import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionFilterDto } from './dto/transaction-filter.dto';
import { MSG } from '../common/constants/messages';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 내역 목록 — 날짜 내림차순, 날짜별 그룹핑은 클라이언트에서 처리
   * 무한스크롤: page/pageSize 기반 페이지네이션
   */
  async findAll(userId: string, filter: TransactionFilterDto) {
    const { page = 1, pageSize = 20 } = filter;

    const where: Prisma.TransactionWhereInput = { userId };
    if (filter.startDate || filter.endDate) {
      where.transactionDate = {
        ...(filter.startDate && { gte: new Date(filter.startDate) }),
        ...(filter.endDate && { lte: new Date(filter.endDate) }),
      };
    }
    if (filter.categoryIds?.length) where.categoryId = { in: filter.categoryIds };
    if (filter.paymentMethodIds?.length) where.paymentMethodId = { in: filter.paymentMethodIds };
    if (filter.merchantName) where.merchantName = { contains: filter.merchantName };
    if (filter.amountMin !== undefined || filter.amountMax !== undefined) {
      where.amount = {
        ...(filter.amountMin !== undefined && { gte: filter.amountMin }),
        ...(filter.amountMax !== undefined && { lte: filter.amountMax }),
      };
    }

    const [data, total, amountAgg] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        include: {
          category:      { select: { id: true, name: true, icon: true, color: true } },
          paymentMethod: { select: { id: true, name: true, type: true } },
        },
        orderBy: { transactionDate: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.transaction.count({ where }),
      this.prisma.transaction.aggregate({ where, _sum: { amount: true } }),
    ]);

    return {
      data, page, pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
      totalAmount: amountAgg._sum.amount ?? 0,
    };
  }

  async findOne(userId: string, id: string) {
    const tx = await this.prisma.transaction.findFirst({
      where: { id, userId },
      include: {
          category:      { select: { id: true, name: true, icon: true, color: true } },
          paymentMethod: { select: { id: true, name: true, type: true } },
        },
    });
    if (!tx) throw new NotFoundException(MSG.common.notFound);
    return tx;
  }

  /** transactionDate는 ISO 문자열로 받아 Date로 변환해서 저장 */
  create(userId: string, dto: CreateTransactionDto) {
    return this.prisma.transaction.create({
      data: { ...dto, userId, transactionDate: new Date(dto.transactionDate) },
      include: {
          category:      { select: { id: true, name: true, icon: true, color: true } },
          paymentMethod: { select: { id: true, name: true, type: true } },
        },
    });
  }

  /**
   * 거래 수정
   * transactionDate는 미전달 시 기존 값 유지, 전달 시 Date로 변환.
   * update 후 반환값에 category·paymentMethod가 포함되지 않으므로
   * 클라이언트는 필요 시 단건 조회로 후속 요청해야 한다.
   */
  async update(userId: string, id: string, dto: UpdateTransactionDto) {
    await this.findOneOrThrow(userId, id);
    return this.prisma.transaction.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.transactionDate && { transactionDate: new Date(dto.transactionDate) }),
      },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOneOrThrow(userId, id);
    return this.prisma.transaction.delete({ where: { id } });
  }

  /** 매월 1일 스케줄러 호출 — 할부 원거래 기준으로 해당 월 납입 내역 자동 생성 */
  async generateInstallmentTransactions(targetYear?: number, targetMonth?: number): Promise<{ totalCount: number; successCount: number }> {
    const now   = new Date();
    const year  = targetYear  ?? now.getFullYear();
    const month = targetMonth != null ? targetMonth - 1 : now.getMonth(); // 0-based

    const monthStart = new Date(year, month, 1);
    const monthEnd   = new Date(year, month + 1, 0, 23, 59, 59, 999);

    // 원거래: originalTransactionId가 없고 installmentEndDate가 이번 달 이후인 항목
    const installments = await this.prisma.transaction.findMany({
      where: {
        installmentMonths:     { not: null },
        installmentEndDate:    { gte: monthStart },
        originalTransactionId: null,
      },
    });

    const results: Awaited<ReturnType<typeof this.prisma.transaction.create>>[] = [];

    for (const tx of installments) {
      // originalTransactionId 기준으로 중복 체크 — 이미 이번 달 자식 내역이 있으면 스킵
      const existing = await this.prisma.transaction.findFirst({
        where: {
          originalTransactionId: tx.id,
          transactionDate: { gte: monthStart, lte: monthEnd },
        },
      });
      if (existing) continue;

      // 월 납입금 = (총금액 - 첫달 납입액) / (할부개월수 - 1)
      // 첫달(원거래)에 잔여 금액을 나눈 값으로, 소수점은 반올림
      const monthlyAmount = Math.round(
        ((tx.totalAmount ?? tx.amount) - tx.amount) / ((tx.installmentMonths ?? 2) - 1),
      );

      const created = await this.prisma.transaction.create({
        data: {
          userId:               tx.userId,
          categoryId:           tx.categoryId,
          paymentMethodId:      tx.paymentMethodId,
          amount:               monthlyAmount,
          merchantName:         tx.merchantName,
          memo:                 tx.memo,
          transactionDate:      new Date(year, month, 1),
          originalTransactionId: tx.id,
        },
      });
      results.push(created);
    }

    return { totalCount: installments.length, successCount: results.length };
  }

  private async findOneOrThrow(userId: string, id: string) {
    const tx = await this.prisma.transaction.findFirst({ where: { id, userId } });
    if (!tx) throw new NotFoundException(MSG.common.notFound);
    return tx;
  }
}
