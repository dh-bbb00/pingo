import { Injectable } from '@nestjs/common';
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
    const where = this.buildWhere(userId, query);

    // Prisma groupBy는 date_trunc 미지원이므로 raw query 사용
    const rows = await this.prisma.$queryRaw<{ month: Date; amount: bigint }[]>`
      SELECT date_trunc('month', "transactionDate") AS month,
             SUM(amount)::bigint AS amount
      FROM "Transaction"
      WHERE "userId" = ${userId}
        AND "transactionDate" >= ${new Date(query.startDate)}
        AND "transactionDate" <= ${new Date(query.endDate)}
      GROUP BY month
      ORDER BY month ASC
    `;

    return rows.map((r) => ({
      month: r.month,
      amount: Number(r.amount),
    }));
  }

  private buildWhere(userId: string, query: StatsQueryDto) {
    return {
      userId,
      ...(query.categoryId && { categoryId: query.categoryId }),
      transactionDate: {
        gte: new Date(query.startDate),
        lte: new Date(query.endDate),
      },
    };
  }
}
