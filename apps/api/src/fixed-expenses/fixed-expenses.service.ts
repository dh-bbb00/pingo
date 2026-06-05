import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFixedExpenseDto } from './dto/create-fixed-expense.dto';
import { UpdateFixedExpenseDto } from './dto/update-fixed-expense.dto';
import { MSG } from '../common/constants/messages';

@Injectable()
export class FixedExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly INCLUDE = {
    category:      { select: { id: true, name: true, icon: true, color: true } },
    paymentMethod: { select: { id: true, name: true, type: true } },
  } as const;

  findAll(userId: string) {
    return this.prisma.fixedExpense.findMany({
      where:   { userId },
      include: this.INCLUDE,
      orderBy: { dayOfMonth: 'asc' },
    });
  }

  create(userId: string, dto: CreateFixedExpenseDto) {
    return this.prisma.fixedExpense.create({
      data:    { ...dto, userId },
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

  async registerThisMonthTransaction(userId: string, id: string) {
    const fe = await this.findOneOrThrow(userId, id);
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
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
      },
    });
  }

  /** 매월 1일 스케줄러 호출 — isActive 항목의 Transaction을 해당 월의 dayOfMonth일로 생성 */
  async generateMonthlyTransactions() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-based

    const actives = await this.prisma.fixedExpense.findMany({ where: { isActive: true } });

    const creates = actives.map((fe) => {
      // 해당 월의 말일을 구해 dayOfMonth가 초과하면 말일로 처리
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const day = Math.min(fe.dayOfMonth, daysInMonth);
      const transactionDate = new Date(year, month, day);

      return this.prisma.transaction.create({
        data: {
          userId:          fe.userId,
          categoryId:      fe.categoryId,
          paymentMethodId: fe.paymentMethodId,
          amount:          fe.amount,
          merchantName:    fe.merchantName,
          memo:            fe.memo,
          transactionDate,
        },
      });
    });

    return this.prisma.$transaction(creates);
  }

  private async findOneOrThrow(userId: string, id: string) {
    const fe = await this.prisma.fixedExpense.findFirst({ where: { id, userId } });
    if (!fe) throw new NotFoundException(MSG.common.notFound);
    return fe;
  }
}
