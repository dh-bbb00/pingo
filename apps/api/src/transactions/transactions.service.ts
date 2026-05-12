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
    if (filter.categoryId) where.categoryId = filter.categoryId;
    if (filter.cardCompany) where.cardCompany = filter.cardCompany;
    if (filter.merchantName) where.merchantName = { contains: filter.merchantName };
    if (filter.amountMin !== undefined || filter.amountMax !== undefined) {
      where.amount = {
        ...(filter.amountMin !== undefined && { gte: filter.amountMin }),
        ...(filter.amountMax !== undefined && { lte: filter.amountMax }),
      };
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.transaction.findMany({
        where,
        include: { category: { select: { id: true, name: true, icon: true, color: true } } },
        orderBy: { transactionDate: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  create(userId: string, dto: CreateTransactionDto) {
    return this.prisma.transaction.create({
      data: { ...dto, userId, transactionDate: new Date(dto.transactionDate) },
      include: { category: { select: { id: true, name: true, icon: true, color: true } } },
    });
  }

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

  private async findOneOrThrow(userId: string, id: string) {
    const tx = await this.prisma.transaction.findFirst({ where: { id, userId } });
    if (!tx) throw new NotFoundException(MSG.common.notFound);
    return tx;
  }
}
