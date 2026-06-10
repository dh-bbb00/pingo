import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StatsQueryDto } from './dto/stats-query.dto';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 기간 내 카테고리별 지출 합계
   * 클라이언트는 이 데이터로 도넛 차트·예산 비교 UI를 구성
   */
  async getByCategory(userId: string, query: StatsQueryDto) {
    const where = this.buildWhere(userId, query);

    const rows = await this.prisma.transaction.groupBy({
      by: ['categoryId'],
      where,
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
    });

    // 카테고리 상세 정보 조인 (groupBy는 include 미지원)
    const categoryIds = rows.map((r) => r.categoryId).filter((id): id is string => id !== null);
    const categories = await this.prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true, icon: true, color: true },
    });
    const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));

    const total = rows.reduce((sum, r) => sum + (r._sum.amount ?? 0), 0);

    return {
      total,
      byCategory: rows.map((r) => ({
        category: r.categoryId ? catMap[r.categoryId] : null,
        amount: r._sum.amount ?? 0,
        ratio: total > 0 ? Math.round(((r._sum.amount ?? 0) / total) * 1000) / 10 : 0,
      })),
    };
  }

  /**
   * 기간 내 일별 지출 합계
   * 클라이언트는 이 데이터로 막대 차트(일별 소비 트렌드)를 구성
   */
  async getByDate(userId: string, query: StatsQueryDto) {
    const where = this.buildWhere(userId, query);

    const rows = await this.prisma.transaction.groupBy({
      by: ['transactionDate'],
      where,
      _sum: { amount: true },
      orderBy: { transactionDate: 'asc' },
    });

    return rows.map((r) => ({
      date: r.transactionDate,
      amount: r._sum.amount ?? 0,
    }));
  }

  /**
   * 월별 지출 합계 — 최근 N개월 추이
   * startDate/endDate로 범위를 지정하면 해당 기간 내 월별로 집계
   */
  async getByMonth(userId: string, query: StatsQueryDto) {
    // Prisma groupBy는 date_trunc 미지원이므로 raw query 사용
    const categoryFilter = query.categoryId
      ? query.categoryId === 'uncategorized'
        ? Prisma.sql`AND "categoryId" IS NULL`
        : Prisma.sql`AND "categoryId" = ${query.categoryId}`
      : Prisma.empty;
    const paymentFilter     = query.paymentMethodId ? Prisma.sql`AND "paymentMethodId" = ${query.paymentMethodId}` : Prisma.empty;
    const rows = await this.prisma.$queryRaw<{ month: Date; amount: bigint }[]>`
      SELECT date_trunc('month', "transactionDate") AS month,
             SUM(amount)::bigint AS amount
      FROM "Transaction"
      WHERE "userId" = ${userId}
        AND "transactionDate" >= ${new Date(query.startDate)}
        AND "transactionDate" <= ${new Date(query.endDate)}
        ${categoryFilter}
        ${paymentFilter}
      GROUP BY month
      ORDER BY month ASC
    `;

    return rows.map((r) => ({
      month: r.month,
      amount: Number(r.amount),
    }));
  }

  /**
   * 특정 하루 내 시간대별 지출 합계 (0~23시)
   * 클라이언트는 이 데이터로 일별 시간대 막대 차트를 구성
   */
  async getByHour(userId: string, query: StatsQueryDto) {
    const categoryFilter = query.categoryId
      ? query.categoryId === 'uncategorized'
        ? Prisma.sql`AND "categoryId" IS NULL`
        : Prisma.sql`AND "categoryId" = ${query.categoryId}`
      : Prisma.empty;
    const paymentFilter     = query.paymentMethodId ? Prisma.sql`AND "paymentMethodId" = ${query.paymentMethodId}` : Prisma.empty;

    const rows = await this.prisma.$queryRaw<{ hour: number; amount: bigint }[]>`
      SELECT EXTRACT(hour FROM "transactionDate")::int AS hour,
             SUM(amount)::bigint AS amount
      FROM "Transaction"
      WHERE "userId" = ${userId}
        AND "transactionDate" >= ${new Date(query.startDate)}
        AND "transactionDate" <= ${new Date(query.endDate)}
        ${categoryFilter}
        ${paymentFilter}
      GROUP BY hour
      ORDER BY hour ASC
    `;

    return rows.map((r) => ({
      hour:   r.hour,
      amount: Number(r.amount),
    }));
  }

  async getHomeSummary(userId: string) {
    const now   = new Date();
    const year  = now.getFullYear();
    const month = now.getMonth() + 1;

    const startThis  = new Date(year, month - 1, 1);
    const endThis    = new Date(year, month, 0, 23, 59, 59, 999);
    const lastYear   = month === 1 ? year - 1 : year;
    const lastMonth  = month === 1 ? 12 : month - 1;
    const startLast  = new Date(lastYear, lastMonth - 1, 1);
    const endLast    = new Date(lastYear, lastMonth, 0, 23, 59, 59, 999);
    const trendStart = new Date(year, month - 7, 1); // 6개월 전 시작

    const [byCatRows, lastMonthAgg, budgets, recentTx, trendRows] = await Promise.all([
      this.prisma.transaction.groupBy({
        by: ['categoryId'],
        where: { userId, transactionDate: { gte: startThis, lte: endThis } },
        _sum: { amount: true },
        orderBy: { _sum: { amount: 'desc' } },
      }),
      this.prisma.transaction.aggregate({
        where: { userId, transactionDate: { gte: startLast, lte: endLast } },
        _sum: { amount: true },
      }),
      this.prisma.categoryMonthlyBudget.findMany({
        where: { category: { userId }, year, month },
        select: { categoryId: true, budget: true },
      }),
      this.prisma.transaction.findMany({
        where: { userId },
        orderBy: { transactionDate: 'desc' },
        take: 5,
        include: {
          category:      { select: { id: true, name: true, icon: true, color: true } },
          paymentMethod: { select: { id: true, name: true, type: true } },
        },
      }),
      this.prisma.$queryRaw<{ month: Date; amount: bigint }[]>`
        SELECT date_trunc('month', "transactionDate") AS month,
               SUM(amount)::bigint AS amount
        FROM   "Transaction"
        WHERE  "userId" = ${userId}
          AND  "transactionDate" >= ${trendStart}
          AND  "transactionDate" <= ${endThis}
        GROUP BY month
        ORDER BY month ASC
      `,
    ]);

    const categoryIds = byCatRows.map(r => r.categoryId).filter((id): id is string => !!id);
    const categories  = await this.prisma.category.findMany({
      where:  { id: { in: categoryIds } },
      select: { id: true, name: true, icon: true, color: true },
    });
    const catMap    = Object.fromEntries(categories.map(c => [c.id, c]));
    const budgetMap = Object.fromEntries(budgets.map(b => [b.categoryId, b.budget]));
    const thisMonthTotal = byCatRows.reduce((s, r) => s + (r._sum.amount ?? 0), 0);

    return {
      thisMonthTotal,
      lastMonthTotal: lastMonthAgg._sum.amount ?? 0,
      byCategory: byCatRows.map(r => ({
        category: r.categoryId ? (catMap[r.categoryId] ?? null) : null,
        amount:   r._sum.amount ?? 0,
        ratio:    thisMonthTotal > 0
          ? Math.round(((r._sum.amount ?? 0) / thisMonthTotal) * 1000) / 10
          : 0,
        budget: r.categoryId ? (budgetMap[r.categoryId] ?? null) : null,
      })),
      recentTransactions: recentTx,
      monthlyTrend: trendRows.map(r => ({ month: r.month, amount: Number(r.amount) })),
    };
  }

  /** 기간 내 금액 기준 상위 10건 거래 */
  async getTop10(userId: string, query: StatsQueryDto) {
    return this.prisma.transaction.findMany({
      where:   this.buildWhere(userId, query),
      orderBy: { amount: 'desc' },
      take:    10,
      select: {
        id:              true,
        merchantName:    true,
        amount:          true,
        transactionDate: true,
        category:      { select: { id: true, name: true, icon: true, color: true } },
        paymentMethod: { select: { id: true, name: true, type: true } },
      },
    })
  }

  private buildWhere(userId: string, query: StatsQueryDto) {
    const categoryFilter = query.categoryId
      ? query.categoryId === 'uncategorized'
        ? { categoryId: null }
        : { categoryId: query.categoryId }
      : {};

    return {
      userId,
      ...categoryFilter,
      ...(query.paymentMethodId && { paymentMethodId: query.paymentMethodId }),
      transactionDate: {
        gte: new Date(query.startDate),
        lte: new Date(query.endDate),
      },
    };
  }
}
