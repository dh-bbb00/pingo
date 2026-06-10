import { Injectable } from '@nestjs/common';
import { SchedulerLogStatus, SchedulerLogType, SchedulerTrigger } from '@prisma/client';
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
  status?:   SchedulerLogStatus;
  year?:     number;
  month?:    number;
}

const ALL_TYPES: SchedulerLogType[] = [
  SchedulerLogType.BUDGET_ROLLOVER,
  SchedulerLogType.FIXED_EXPENSES,
  SchedulerLogType.INSTALLMENTS,
];

@Injectable()
export class SchedulerLogService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 실행 결과를 기록. NOT_RUN 예약 항목이 있으면 업데이트(upsert), 없으면 새로 생성.
   */
  async writeLog(params: WriteLogParams) {
    const status = params.success ? SchedulerLogStatus.SUCCESS : SchedulerLogStatus.FAILURE;

    const existing = await this.prisma.schedulerLog.findFirst({
      where: { type: params.type, year: params.year, month: params.month, status: SchedulerLogStatus.NOT_RUN },
    });

    const data = {
      status,
      runAt:        new Date(),
      triggeredBy:  params.triggeredBy,
      totalCount:   params.totalCount,
      successCount: params.successCount,
      error:        params.error ?? null,
    };

    if (existing) {
      return this.prisma.schedulerLog.update({ where: { id: existing.id }, data });
    }

    return this.prisma.schedulerLog.create({
      data: { type: params.type, year: params.year, month: params.month, ...data },
    });
  }

  /**
   * 다음 달 NOT_RUN 예약 항목 생성. 스케줄러 정상 실행 후 호출.
   * 이미 항목이 있으면 건너뜀.
   */
  async createNextMonthEntries() {
    const now = new Date();
    let nextYear  = now.getFullYear();
    let nextMonth = now.getMonth() + 2;
    if (nextMonth > 12) { nextYear++; nextMonth = 1; }

    for (const type of ALL_TYPES) {
      const existing = await this.prisma.schedulerLog.findFirst({
        where: { type, year: nextYear, month: nextMonth },
      });
      if (!existing) {
        await this.prisma.schedulerLog.create({
          data: { type, year: nextYear, month: nextMonth, status: SchedulerLogStatus.NOT_RUN },
        });
      }
    }
  }

  /** 페이지네이션 로그 목록 — NOT_RUN은 기본 제외, status 필터로 명시 가능 */
  async getLogs(params: GetLogsParams) {
    const { page, pageSize, type, status, year, month } = params;

    const statusFilter = status !== undefined
      ? status
      : { not: SchedulerLogStatus.NOT_RUN };

    const where = {
      ...(type  !== undefined && { type }),
      ...(year  !== undefined && { year }),
      ...(month !== undefined && { month }),
      status: statusFilter,
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

    return Promise.all(
      ALL_TYPES.map(async (type) => {
        const log = await this.prisma.schedulerLog.findFirst({
          where: { type, year, month },
        });
        return { type, log };
      }),
    );
  }

  /** NOT_RUN 상태 항목 목록 — year+month 지정 시 해당 월만 */
  async getNotRunEntries(year?: number, month?: number) {
    return this.prisma.schedulerLog.findMany({
      where: {
        status: SchedulerLogStatus.NOT_RUN,
        ...(year  !== undefined && { year }),
        ...(month !== undefined && { month }),
      },
      orderBy: [{ year: 'desc' }, { month: 'desc' }, { type: 'asc' }],
    });
  }

  async getById(id: string) {
    return this.prisma.schedulerLog.findUnique({ where: { id } });
  }
}
