import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CategoriesService } from './categories.service';
import { AppLoggerService } from '../logger/logger.service';

@Injectable()
export class CategoriesScheduler {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly logger: AppLoggerService,
  ) {}

  /** 매월 1일 00:01에 실행 — isBudgetFixed=true 카테고리의 전월 예산을 이번 달로 복사 */
  @Cron('1 0 1 * *')
  async handleBudgetRollover() {
    this.logger.log('예산 자동 이월 시작', 'CategoriesScheduler');
    try {
      const count = await this.categoriesService.rolloverFixedBudgets();
      this.logger.log(`예산 자동 이월 ${count}건 완료`, 'CategoriesScheduler');
    } catch (err) {
      this.logger.error('예산 자동 이월 실패', (err as Error).stack, 'CategoriesScheduler');
    }
  }
}
