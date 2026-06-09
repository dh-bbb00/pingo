import { Injectable } from '@nestjs/common';
import { SchedulerLogType, SchedulerTrigger } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

interface WriteLogParams {
  type:         SchedulerLogType;
  year:         number;
  month:        number;
  triggeredBy:  SchedulerTrigger;
  success:      boolean;
  totalCount:   number;
  successCount: number;
  error?:       string;
}

interface GetLogsParams {
  page:      number;
  pageSize:  number;
  type?:     SchedulerLogType;
  success?:  boolean;
  year?:     number;
  month?:    number;
}

@Injectable()
export class SchedulerLogService {
  constructor(private readonly prisma: PrismaService) {}

  async writeLog(params: WriteLogParams) {
    return this.prisma.schedulerLog.create({
      data: {
        type:         params.type,
        year:         params.year,
        month:        params.month,
        triggeredBy:  params.triggeredBy,
        success:      params.success,
        totalCount:   params.totalCount,
        successCount: params.successCount,
        error:        params.error,
      },
    });
  }

  /** 페이지네이션 로그 목록 — type, success, year, month 필터 가능 */
  async getLogs(params: GetLogsParams) {
    const { page, pageSize, type, success, year, month } = params;
    const where = {
      ...(type    !== undefined && { type }),
      ...(success !== undefined && { success }),
      ...(year    !== undefined && { year }),
      ...(month   !== undefined && { month }),
    };

    const [data, total] = await Promise.all([
      this.prisma.schedulerLog.findMany({
        where,
        orderBy: { runAt: 'desc' },
        skip:    (page - 1) * pageSize,
        take:    pageSize,
      }),
      this.prisma.schedulerLog.count({ where }),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  /** 이번 달 실행 현황 — 3가지 타입별로 최신 로그 또는 null 반환 */
  async getCurrentMonthStatus() {
    const now   = new Date();
    const year  = now.getFullYear();
    const month = now.getMonth() + 1;

    const types: SchedulerLogType[] = [
      SchedulerLogType.BUDGET_ROLLOVER,
      SchedulerLogType.FIXED_EXPENSES,
      SchedulerLogType.INSTALLMENTS,
    ];

    const results = await Promise.all(
      types.map(async (type) => {
        const log = await this.prisma.schedulerLog.findFirst({
          where:   { type, year, month },
          orderBy: { runAt: 'desc' },
        });
        return { type, log };
      }),
    );

    return results;
  }

  /**
   * 최근 12개월 × 3타입 중 로그 미존재 항목 반환.
   * year + month 지정 시 해당 월만 확인.
   */
  async getNotRunEntries(year?: number, month?: number) {
    const now = new Date();
    const types: SchedulerLogType[] = [
      SchedulerLogType.BUDGET_ROLLOVER,
      SchedulerLogType.FIXED_EXPENSES,
      SchedulerLogType.INSTALLMENTS,
    ];

    // 특정 월이 지정된 경우 해당 월만, 아니면 최근 12개월
    const months: Array<{ year: number; month: number }> = [];
    if (year !== undefined && month !== undefined) {
      months.push({ year, month });
    } else {
      for (let i = 0; i < 12; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({ year: d.getFullYear(), month: d.getMonth() + 1 });
      }
    }

    const notRun: Array<{ type: SchedulerLogType; year: number; month: number }> = [];

    for (const { year: y, month: m } of months) {
      for (const type of types) {
        const existing = await this.prisma.schedulerLog.findFirst({
          where: { type, year: y, month: m },
        });
        if (!existing) {
          notRun.push({ type, year: y, month: m });
        }
      }
    }

    return notRun;
  }

  async getById(id: string) {
    return this.prisma.schedulerLog.findUnique({ where: { id } });
  }
}
