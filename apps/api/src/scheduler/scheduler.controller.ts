import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CategoriesService } from '../categories/categories.service';
import { FixedExpensesService } from '../fixed-expenses/fixed-expenses.service';
import { TransactionsService } from '../transactions/transactions.service';
import { AppLoggerService } from '../logger/logger.service';
import type { BasicResponse } from '../common/types/response.type';

@ApiTags('Scheduler')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('scheduler')
export class SchedulerController {
  constructor(
    private readonly categoriesService:    CategoriesService,
    private readonly fixedExpensesService: FixedExpensesService,
    private readonly transactionsService:  TransactionsService,
    private readonly logger:               AppLoggerService,
  ) {}

  /** 월간 스케줄러 수동 실행 — 서버 다운 등으로 자동 실행을 놓쳤을 때 사용 */
  @Post('run-monthly')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: '월간 스케줄러 수동 실행 (어드민 전용)' })
  async runMonthly(): Promise<BasicResponse<{ budgets: number; fixedExpenses: number; installments: number }>> {
    this.logger.log('월간 스케줄러 수동 실행 시작', 'SchedulerController');
    try {
      const budgets      = await this.categoriesService.rolloverFixedBudgets();
      const fixedResults = await this.fixedExpensesService.generateMonthlyTransactions();
      const installments = await this.transactionsService.generateInstallmentTransactions();

      const data = {
        budgets,
        fixedExpenses: fixedResults.length,
        installments:  installments.length,
      };
      this.logger.log(
        `월간 스케줄러 수동 실행 완료 — 예산이월: ${data.budgets}건, 고정지출: ${data.fixedExpenses}건, 할부: ${data.installments}건`,
        'SchedulerController',
      );
      return { success: true, data };
    } catch (err) {
      this.logger.error('월간 스케줄러 수동 실행 실패', (err as Error).stack, 'SchedulerController');
      throw err;
    }
  }
}
