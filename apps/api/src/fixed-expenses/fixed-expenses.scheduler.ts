import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MSG } from '../common/constants/messages';
import { SchedulerLogType, SchedulerTrigger } from '@prisma/client';
import { FixedExpensesService } from './fixed-expenses.service';
import { SchedulerLogService } from '../scheduler/scheduler-log.service';
import { AppLoggerService } from '../logger/logger.service';
import { FirebaseService } from '../firebase/firebase.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FixedExpensesScheduler {
  constructor(
    private readonly fixedExpensesService: FixedExpensesService,
    private readonly schedulerLogService:  SchedulerLogService,
    private readonly logger:               AppLoggerService,
    private readonly firebase:             FirebaseService,
    private readonly prisma:               PrismaService,
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
      await this.schedulerLogService.createNextMonthEntries();
      this.logger.log(`고정 지출 ${successCount}건 생성 완료`, 'FixedExpensesScheduler');
    } catch (err) {
      await this.schedulerLogService.writeLog({
        type: SchedulerLogType.FIXED_EXPENSES, year, month,
        triggeredBy: SchedulerTrigger.CRON,
        success: false, totalCount: 0, successCount: 0,
        error: (err as Error).message,
      });
      this.logger.error('고정 지출 자동 생성 실패', (err as Error).stack, 'FixedExpensesScheduler');
      await this.notifyAdmins();
    }
  }

  /**
   * 매일 08:00 — 오늘이 dayOfMonth인 고정 지출 유저에게만 납부일 알림 발송.
   * 기존 매월 1일 일괄 발송 방식은 dayOfMonth와 무관하게 모든 유저에게 발송되어
   * 납부일이 아직 안 된 유저도 알림을 받는 문제가 있어 일별 발송으로 변경.
   */
  @Cron('0 8 * * *')
  async handleDailyFixedExpenseNotification() {
    const todayDay = new Date().getDate();

    try {
      const devices = await this.prisma.device.findMany({
        where: {
          user: {
            role: 'USER',
            status: 'APPROVED',
            fixedExpenses: { some: { isActive: true, dayOfMonth: todayDay } },
          },
          fcmToken: { not: null },
        },
        select: { fcmToken: true },
      });
      const tokens = devices.map(d => d.fcmToken!);
      if (tokens.length === 0) return;
      await this.firebase.sendMulticast(tokens, MSG.fixedExpensePush.title, MSG.fixedExpensePush.body);
      this.logger.log(`고정 지출 납부일 알림 ${tokens.length}건 발송 (${todayDay}일)`, 'FixedExpensesScheduler');
    } catch (err) {
      this.logger.error('고정 지출 납부일 알림 발송 실패', (err as Error).stack, 'FixedExpensesScheduler');
    }
  }

  /** ADMIN 역할 기기의 FCM 토큰을 모아 실패 알림 전송 */
  private async notifyAdmins(): Promise<void> {
    try {
      const devices = await this.prisma.device.findMany({
        where: { user: { role: 'ADMIN' }, fcmToken: { not: null } },
        select: { fcmToken: true },
      });
      const tokens = devices.map(d => d.fcmToken!);
      await this.firebase.sendMulticast(
        tokens,
        '고정 지출 자동 등록 실패',
        '이번 달 고정 지출 자동 등록에 실패했습니다. 어드민 화면에서 수동으로 실행해주세요.',
      );
    } catch {
      // 알림 실패는 스케줄러 흐름에 영향 없음
    }
  }
}
