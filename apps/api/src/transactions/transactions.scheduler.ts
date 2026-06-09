import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TransactionsService } from './transactions.service';
import { AppLoggerService } from '../logger/logger.service';

@Injectable()
export class TransactionsScheduler {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly logger: AppLoggerService,
  ) {}

  /** 매월 1일 00:10에 실행 — 할부 원거래 기준으로 해당 월 납입 내역 자동 생성 */
  @Cron('10 0 1 * *')
  async handleInstallmentGeneration() {
    this.logger.log('할부 납입 내역 자동 생성 시작', 'TransactionsScheduler');
    try {
      const results = await this.transactionsService.generateInstallmentTransactions();
      this.logger.log(`할부 납입 내역 ${results.length}건 생성 완료`, 'TransactionsScheduler');
    } catch (err) {
      this.logger.error('할부 납입 내역 자동 생성 실패', (err as Error).stack, 'TransactionsScheduler');
    }
  }
}
