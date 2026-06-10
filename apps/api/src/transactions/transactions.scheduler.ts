import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SchedulerLogType, SchedulerTrigger } from '@prisma/client';
import { TransactionsService } from './transactions.service';
import { SchedulerLogService } from '../scheduler/scheduler-log.service';
import { AppLoggerService } from '../logger/logger.service';

@Injectable()
export class TransactionsScheduler {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly schedulerLogService: SchedulerLogService,
    private readonly logger:              AppLoggerService,
  ) {}

  /** 매월 1일 00:10에 실행 — 할부 원거래 기준으로 해당 월 납입 내역 자동 생성 */
  @Cron('10 0 1 * *')
  async handleInstallmentGeneration() {
    this.logger.log('할부 납입 내역 자동 생성 시작', 'TransactionsScheduler');

    const now   = new Date();
    const year  = now.getFullYear();
    const month = now.getMonth() + 1;

    try {
      const { totalCount, successCount } = await this.transactionsService.generateInstallmentTransactions();
      await this.schedulerLogService.writeLog({
        type: SchedulerLogType.INSTALLMENTS, year, month,
        triggeredBy: SchedulerTrigger.CRON,
        success: true, totalCount, successCount,
      });
      await this.schedulerLogService.createNextMonthEntries();
      this.logger.log(`할부 납입 내역 ${successCount}건 생성 완료`, 'TransactionsScheduler');
    } catch (err) {
      await this.schedulerLogService.writeLog({
        type: SchedulerLogType.INSTALLMENTS, year, month,
        triggeredBy: SchedulerTrigger.CRON,
        success: false, totalCount: 0, successCount: 0,
        error: (err as Error).message,
      });
      this.logger.error('할부 납입 내역 자동 생성 실패', (err as Error).stack, 'TransactionsScheduler');
    }
  }
}
