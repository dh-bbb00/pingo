import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFixedExpenseDto } from './dto/create-fixed-expense.dto';
import { UpdateFixedExpenseDto } from './dto/update-fixed-expense.dto';
import { MSG } from '../common/constants/messages';

@Injectable()
export class FixedExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.fixedExpense.findMany({
      where: { userId },
      include: { category: { select: { id: true, name: true, icon: true, color: true } } },
      orderBy: { dayOfMonth: 'asc' },
    });
  }

  create(userId: string, dto: CreateFixedExpenseDto) {
    return this.prisma.fixedExpense.create({
      data: { ...dto, userId },
      include: { category: { select: { id: true, name: true, icon: true, color: true } } },
    });
  }

  async update(userId: string, id: string, dto: UpdateFixedExpenseDto) {
    await this.findOneOrThrow(userId, id);
    return this.prisma.fixedExpense.update({
      where: { id },
      data: dto,
      include: { category: { select: { id: true, name: true, icon: true, color: true } } },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOneOrThrow(userId, id);
    return this.prisma.fixedExpense.delete({ where: { id } });
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
          userId: fe.userId,
          categoryId: fe.categoryId,
          amount: fe.amount,
          merchantName: fe.merchantName,
          cardCompany: fe.cardCompany,
          memo: fe.memo,
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
