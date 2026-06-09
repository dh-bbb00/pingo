import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SchedulerLogType, SchedulerTrigger } from '@prisma/client';
import { FixedExpensesService } from './fixed-expenses.service';
import { SchedulerLogService } from '../scheduler/scheduler-log.service';
import { AppLoggerService } from '../logger/logger.service';

@Injectable()
export class FixedExpensesScheduler {
  constructor(
    private readonly fixedExpensesService: FixedExpensesService,
    private readonly schedulerLogService:  SchedulerLogService,
    private readonly logger:               AppLoggerService,
  ) {}

  /** 매월 1일 00:05에 실행 — 고정 지출 Transaction 자동 생성 */
  @Cron('5 0 1 * *')
  async handleMonthlyGeneration() {
    this.logger.log('고정 지출 자동 생성 시작', 'FixedExpensesScheduler');

    const now   = new Date();
    const year  = now.getFullYear();
    const month = now.getMonth() + 1;

    try {
      const { totalCount, successCount } = await this.fixedExpensesService.generateMonthlyTransactions();
      await this.schedulerLogService.writeLog({
        type: SchedulerLogType.FIXED_EXPENSES, year, month,
        triggeredBy: SchedulerTrigger.CRON,
        success: true, totalCount, successCount,
      });
      this.logger.log(`고정 지출 ${successCount}건 생성 완료`, 'FixedExpensesScheduler');
    } catch (err) {
      await this.schedulerLogService.writeLog({
        type: SchedulerLogType.FIXED_EXPENSES, year, month,
        triggeredBy: SchedulerTrigger.CRON,
        success: false, totalCount: 0, successCount: 0,
        error: (err as Error).message,
      });
      this.logger.error('고정 지출 자동 생성 실패', (err as Error).stack, 'FixedExpensesScheduler');
    }
  }
}
