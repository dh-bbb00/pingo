import { Controller, Get, Post, Param, Query, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SchedulerLogType, SchedulerTrigger } from '@prisma/client';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CategoriesService } from '../categories/categories.service';
import { FixedExpensesService } from '../fixed-expenses/fixed-expenses.service';
import { TransactionsService } from '../transactions/transactions.service';
import { SchedulerLogService } from './scheduler-log.service';
import { AppLoggerService } from '../logger/logger.service';
import { MSG } from '../common/constants/messages';
import type { BasicResponse, PageResponse } from '../common/types/response.type';

@ApiTags('Scheduler')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Roles('ADMIN')
@Controller('scheduler')
export class SchedulerController {
  constructor(
    private readonly categoriesService:    CategoriesService,
    private readonly fixedExpensesService: FixedExpensesService,
    private readonly transactionsService:  TransactionsService,
    private readonly schedulerLogService:  SchedulerLogService,
    private readonly logger:               AppLoggerService,
  ) {}

  /** 월간 스케줄러 수동 실행 — 서버 다운 등으로 자동 실행을 놓쳤을 때 사용 */
  @Post('run-monthly')
  @ApiOperation({ summary: '월간 스케줄러 수동 실행 (어드민 전용)' })
  async runMonthly(): Promise<BasicResponse<{ budgets: number; fixedExpenses: number; installments: number }>> {
    this.logger.log('월간 스케줄러 수동 실행 시작', 'SchedulerController');

    const now   = new Date();
    const year  = now.getFullYear();
    const month = now.getMonth() + 1;

    let budgetResult      = { totalCount: 0, successCount: 0 };
    let fixedResult       = { totalCount: 0, successCount: 0 };
    let installmentResult = { totalCount: 0, successCount: 0 };

    try {
      budgetResult = await this.categoriesService.rolloverFixedBudgets();
      await this.schedulerLogService.writeLog({
        type: SchedulerLogType.BUDGET_ROLLOVER, year, month,
        triggeredBy: SchedulerTrigger.MANUAL,
        success: true,
        totalCount:   budgetResult.totalCount,
        successCount: budgetResult.successCount,
      });
    } catch (err) {
      await this.schedulerLogService.writeLog({
        type: SchedulerLogType.BUDGET_ROLLOVER, year, month,
        triggeredBy: SchedulerTrigger.MANUAL,
        success: false, totalCount: 0, successCount: 0,
        error: (err as Error).message,
      });
      this.logger.error('예산 이월 수동 실행 실패', (err as Error).stack, 'SchedulerController');
    }

    try {
      fixedResult = await this.fixedExpensesService.generateMonthlyTransactions();
      await this.schedulerLogService.writeLog({
        type: SchedulerLogType.FIXED_EXPENSES, year, month,
        triggeredBy: SchedulerTrigger.MANUAL,
        success: true,
        totalCount:   fixedResult.totalCount,
        successCount: fixedResult.successCount,
      });
    } catch (err) {
      await this.schedulerLogService.writeLog({
        type: SchedulerLogType.FIXED_EXPENSES, year, month,
        triggeredBy: SchedulerTrigger.MANUAL,
        success: false, totalCount: 0, successCount: 0,
        error: (err as Error).message,
      });
      this.logger.error('고정 지출 자동 생성 수동 실행 실패', (err as Error).stack, 'SchedulerController');
    }

    try {
      installmentResult = await this.transactionsService.generateInstallmentTransactions();
      await this.schedulerLogService.writeLog({
        type: SchedulerLogType.INSTALLMENTS, year, month,
        triggeredBy: SchedulerTrigger.MANUAL,
        success: true,
        totalCount:   installmentResult.totalCount,
        successCount: installmentResult.successCount,
      });
    } catch (err) {
      await this.schedulerLogService.writeLog({
        type: SchedulerLogType.INSTALLMENTS, year, month,
        triggeredBy: SchedulerTrigger.MANUAL,
        success: false, totalCount: 0, successCount: 0,
        error: (err as Error).message,
      });
      this.logger.error('할부 납입 수동 실행 실패', (err as Error).stack, 'SchedulerController');
    }

    const data = {
      budgets:      budgetResult.successCount,
      fixedExpenses: fixedResult.successCount,
      installments:  installmentResult.successCount,
    };
    this.logger.log(
      `월간 스케줄러 수동 실행 완료 — 예산이월: ${data.budgets}건, 고정지출: ${data.fixedExpenses}건, 할부: ${data.installments}건`,
      'SchedulerController',
    );
    return { success: true, data };
  }

  /** 특정 타입 스케줄러 단독 수동 실행 */
  @Post('run-monthly/:type')
  @ApiOperation({ summary: '타입별 스케줄러 수동 실행 (어드민 전용)' })
  @ApiQuery({ name: 'year',  required: false, type: Number })
  @ApiQuery({ name: 'month', required: false, type: Number })
  async runMonthlyByType(
    @Param('type') type: SchedulerLogType,
    @Query('year')  yearStr?:  string,
    @Query('month') monthStr?: string,
  ): Promise<BasicResponse<{ totalCount: number; successCount: number }>> {
    const now   = new Date();
    const year  = yearStr  ? Number(yearStr)  : now.getFullYear();
    const month = monthStr ? Number(monthStr) : now.getMonth() + 1;

    this.logger.log(`스케줄러 수동 실행: ${type} (${year}년 ${month}월)`, 'SchedulerController');

    let result = { totalCount: 0, successCount: 0 };
    try {
      if (type === SchedulerLogType.BUDGET_ROLLOVER) {
        result = await this.categoriesService.rolloverFixedBudgets(year, month);
      } else if (type === SchedulerLogType.FIXED_EXPENSES) {
        result = await this.fixedExpensesService.generateMonthlyTransactions(year, month);
      } else if (type === SchedulerLogType.INSTALLMENTS) {
        result = await this.transactionsService.generateInstallmentTransactions(year, month);
      }
      await this.schedulerLogService.writeLog({
        type, year, month, triggeredBy: SchedulerTrigger.MANUAL,
        success: true, totalCount: result.totalCount, successCount: result.successCount,
      });
    } catch (err) {
      await this.schedulerLogService.writeLog({
        type, year, month, triggeredBy: SchedulerTrigger.MANUAL,
        success: false, totalCount: 0, successCount: 0, error: (err as Error).message,
      });
      this.logger.error(`${type} 수동 실행 실패`, (err as Error).stack, 'SchedulerController');
      throw err;
    }

    this.logger.log(`${type} 수동 실행 완료 — ${result.successCount}/${result.totalCount}건`, 'SchedulerController');
    return { success: true, data: result };
  }

  /** 스케줄러 실행 로그 목록 (페이지네이션) */
  @Get('logs')
  @ApiOperation({ summary: '스케줄러 로그 목록 조회 (어드민 전용)' })
  @ApiQuery({ name: 'page',     required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'type',     required: false, enum: SchedulerLogType })
  @ApiQuery({ name: 'success',  required: false, type: Boolean })
  @ApiQuery({ name: 'year',     required: false, type: Number })
  @ApiQuery({ name: 'month',    required: false, type: Number })
  async getLogs(
    @Query('page')     page     = '1',
    @Query('pageSize') pageSize = '20',
    @Query('type')     type?:    SchedulerLogType,
    @Query('success')  success?: string,
    @Query('year')     year?:    string,
    @Query('month')    month?:   string,
  ): Promise<PageResponse<unknown>> {
    const result = await this.schedulerLogService.getLogs({
      page:     Number(page),
      pageSize: Number(pageSize),
      type,
      success:  success !== undefined ? success === 'true' : undefined,
      year:     year  !== undefined ? Number(year)  : undefined,
      month:    month !== undefined ? Number(month) : undefined,
    });
    return {
      success: true,
      data:    result.data,
      pagination: {
        page:       result.page,
        pageSize:   result.pageSize,
        total:      result.total,
        totalPages: result.totalPages,
      },
    };
  }

  /** 이번 달 스케줄러 실행 현황 */
  @Get('logs/current-month')
  @ApiOperation({ summary: '이번 달 스케줄러 실행 현황 (어드민 전용)' })
  async getCurrentMonthStatus(): Promise<BasicResponse<unknown>> {
    const data = await this.schedulerLogService.getCurrentMonthStatus();
    return { success: true, data };
  }

  /** 미실행 항목 목록 (최근 12개월 또는 특정 월) */
  @Get('logs/not-run')
  @ApiOperation({ summary: '미실행 스케줄러 항목 조회 (어드민 전용)' })
  @ApiQuery({ name: 'year',  required: false, type: Number })
  @ApiQuery({ name: 'month', required: false, type: Number })
  async getNotRun(
    @Query('year')  year?:  string,
    @Query('month') month?: string,
  ): Promise<BasicResponse<unknown>> {
    const data = await this.schedulerLogService.getNotRunEntries(
      year  !== undefined ? Number(year)  : undefined,
      month !== undefined ? Number(month) : undefined,
    );
    return { success: true, data };
  }

  /** 로그 단건 조회 */
  @Get('logs/:id')
  @ApiOperation({ summary: '스케줄러 로그 단건 조회 (어드민 전용)' })
  async getLogById(@Param('id') id: string): Promise<BasicResponse<unknown>> {
    const log = await this.schedulerLogService.getById(id);
    if (!log) throw new NotFoundException(MSG.common.notFound);
    return { success: true, data: log };
  }
}
