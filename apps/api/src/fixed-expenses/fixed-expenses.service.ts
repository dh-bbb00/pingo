import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFixedExpenseDto } from './dto/create-fixed-expense.dto';
import { UpdateFixedExpenseDto } from './dto/update-fixed-expense.dto';
import { MSG } from '../common/constants/messages';

@Injectable()
export class FixedExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  // 목록·단건 조회에서 항상 같은 관계 필드를 포함하도록 상수로 관리
  private readonly INCLUDE = {
    category:      { select: { id: true, name: true, icon: true, color: true } },
    paymentMethod: { select: { id: true, name: true, type: true } },
  } as const;

  /** 고정 지출 목록 조회 — 납부일(dayOfMonth) 오름차순 */
  findAll(userId: string) {
    return this.prisma.fixedExpense.findMany({
      where:   { userId },
      include: this.INCLUDE,
      orderBy: { dayOfMonth: 'asc' },
    });
  }

  create(userId: string, dto: CreateFixedExpenseDto) {
    return this.prisma.fixedExpense.create({
      data:    { ...dto, userId, categoryId: dto.categoryId ?? null },
      include: this.INCLUDE,
    });
  }

  async update(userId: string, id: string, dto: UpdateFixedExpenseDto) {
    await this.findOneOrThrow(userId, id);
    return this.prisma.fixedExpense.update({
      where:   { id },
      data:    dto,
      include: this.INCLUDE,
    });
  }

  async remove(userId: string, id: string) {
    await this.findOneOrThrow(userId, id);
    return this.prisma.fixedExpense.delete({ where: { id } });
  }

  /**
   * 이번 달 등록 여부 조회
   * fixedExpenseId 대신 merchantName·amount·categoryId로 매칭하는 이유:
   * 스케줄러가 생성한 Transaction 외에 사용자가 직접 입력한 동일 내역도 "등록됨"으로 간주하기 위함.
   */
  async getThisMonthStatus(userId: string, id: string): Promise<{ registered: boolean }> {
    const fe = await this.findOneOrThrow(userId, id);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const existing = await this.prisma.transaction.findFirst({
      where: {
        userId,
        merchantName: fe.merchantName,
        amount:       fe.amount,
        categoryId:   fe.categoryId,
        transactionDate: { gte: startOfMonth, lte: endOfMonth },
      },
    });
    return { registered: !!existing };
  }

  /**
   * 이번 달 거래 내역 수동 등록
   * fixedExpenseId 기준으로 중복 체크 — 이미 있으면 기존 내역 반환.
   * dayOfMonth가 해당 월의 말일을 초과하면 말일로 clamp (예: 31일 → 2월 28일).
   */
  async registerThisMonthTransaction(userId: string, id: string) {
    const fe = await this.findOneOrThrow(userId, id);
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    // 이번달에 이미 생성된 내역이 있으면 그대로 반환 (중복 방지)
    const monthStart = new Date(year, month, 1);
    const monthEnd   = new Date(year, month + 1, 0, 23, 59, 59, 999);
    const existing = await this.prisma.transaction.findFirst({
      where: { fixedExpenseId: fe.id, transactionDate: { gte: monthStart, lte: monthEnd } },
    });
    if (existing) return existing;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const day = Math.min(fe.dayOfMonth, daysInMonth);
    return this.prisma.transaction.create({
      data: {
        userId,
        categoryId:      fe.categoryId,
        paymentMethodId: fe.paymentMethodId,
        amount:          fe.amount,
        merchantName:    fe.merchantName,
        memo:            fe.memo,
        transactionDate: new Date(year, month, day),
        fixedExpenseId:  fe.id,
      },
    });
  }

  /**
   * 매월 1일 스케줄러 호출 — isActive 항목의 Transaction을 해당 월의 dayOfMonth일로 일괄 생성
   *
   * targetMonth는 1-based로 받아 내부에서 0-based로 변환한다.
   * 이미 생성된 항목은 fixedExpenseId 기준으로 스킵하여 중복 방지.
   * 병렬 처리 대신 순차 처리하는 이유: DB 부하 분산 및 각 항목 실패가 전체에 영향 주지 않도록.
   */
  async generateMonthlyTransactions(targetYear?: number, targetMonth?: number): Promise<{ totalCount: number; successCount: number }> {
    const now = new Date();
    const year  = targetYear  ?? now.getFullYear();
    const month = targetMonth != null ? targetMonth - 1 : now.getMonth(); // 0-based

    const monthStart = new Date(year, month, 1);
    const monthEnd   = new Date(year, month + 1, 0, 23, 59, 59, 999);

    const actives = await this.prisma.fixedExpense.findMany({ where: { isActive: true } });

    const results: Awaited<ReturnType<typeof this.prisma.transaction.create>>[] = [];

    for (const fe of actives) {
      // 이번달에 이미 생성된 내역이 있으면 스킵 (중복 방지)
      const existing = await this.prisma.transaction.findFirst({
        where: { fixedExpenseId: fe.id, transactionDate: { gte: monthStart, lte: monthEnd } },
      });
      if (existing) continue;

      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const day = Math.min(fe.dayOfMonth, daysInMonth);

      const created = await this.prisma.transaction.create({
        data: {
          userId:          fe.userId,
          categoryId:      fe.categoryId,
          paymentMethodId: fe.paymentMethodId,
          amount:          fe.amount,
          merchantName:    fe.merchantName,
          memo:            fe.memo,
          transactionDate: new Date(year, month, day),
          fixedExpenseId:  fe.id,
        },
      });
      results.push(created);
    }

    return { totalCount: actives.length, successCount: results.length };
  }

  private async findOneOrThrow(userId: string, id: string) {
    const fe = await this.prisma.fixedExpense.findFirst({ where: { id, userId } });
    if (!fe) throw new NotFoundException(MSG.common.notFound);
    return fe;
  }
}
