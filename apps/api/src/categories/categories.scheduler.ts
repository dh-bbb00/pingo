import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SchedulerLogType, SchedulerTrigger } from '@prisma/client';
import { CategoriesService } from './categories.service';
import { SchedulerLogService } from '../scheduler/scheduler-log.service';
import { AppLoggerService } from '../logger/logger.service';

@Injectable()
export class CategoriesScheduler {
  constructor(
    private readonly categoriesService:   CategoriesService,
    private readonly schedulerLogService: SchedulerLogService,
    private readonly logger:              AppLoggerService,
  ) {}

  /** 매월 1일 00:01에 실행 — isBudgetFixed=true 카테고리의 전월 예산을 이번 달로 복사 */
  @Cron('1 0 1 * *')
  async handleBudgetRollover() {
    this.logger.log('예산 자동 이월 시작', 'CategoriesScheduler');

    const now   = new Date();
    const year  = now.getFullYear();
    const month = now.getMonth() + 1;

    try {
      const { totalCount, successCount } = await this.categoriesService.rolloverFixedBudgets();
      await this.schedulerLogService.writeLog({
        type: SchedulerLogType.BUDGET_ROLLOVER, year, month,
        triggeredBy: SchedulerTrigger.CRON,
        success: true, totalCount, successCount,
      });
      await this.schedulerLogService.createNextMonthEntries();
      this.logger.log(`예산 자동 이월 ${successCount}건 완료`, 'CategoriesScheduler');
    } catch (err) {
      await this.schedulerLogService.writeLog({
        type: SchedulerLogType.BUDGET_ROLLOVER, year, month,
        triggeredBy: SchedulerTrigger.CRON,
        success: false, totalCount: 0, successCount: 0,
        error: (err as Error).message,
      });
      this.logger.error('예산 자동 이월 실패', (err as Error).stack, 'CategoriesScheduler');
    }
  }
}
