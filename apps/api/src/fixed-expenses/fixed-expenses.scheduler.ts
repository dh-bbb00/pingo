import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FixedExpensesService } from './fixed-expenses.service';
import { AppLoggerService } from '../logger/logger.service';

@Injectable()
export class FixedExpensesScheduler {
  constructor(
    private readonly fixedExpensesService: FixedExpensesService,
    private readonly logger: AppLoggerService,
  ) {}

  /** 매월 1일 00:05에 실행 — 고정 지출 Transaction 자동 생성 */
  @Cron('5 0 1 * *')
  async handleMonthlyGeneration() {
    this.logger.log('고정 지출 자동 생성 시작', 'FixedExpensesScheduler');
    try {
      const results = await this.fixedExpensesService.generateMonthlyTransactions();
      this.logger.log(`고정 지출 ${results.length}건 생성 완료`, 'FixedExpensesScheduler');
    } catch (err) {
      this.logger.error('고정 지출 자동 생성 실패', (err as Error).stack, 'FixedExpensesScheduler');
    }
  }
}
