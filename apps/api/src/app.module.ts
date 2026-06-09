import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { PrismaModule } from './prisma/prisma.module';
import { LoggerModule } from './logger/logger.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

import { AuthModule } from './auth/auth.module';
import { ApprovalsModule } from './approvals/approvals.module';
import { DevicesModule } from './devices/devices.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { TransactionsModule } from './transactions/transactions.module';
import { FixedExpensesModule } from './fixed-expenses/fixed-expenses.module';
import { StatsModule } from './stats/stats.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    LoggerModule,
    AuthModule,
    ApprovalsModule,
    DevicesModule,
    UsersModule,
    CategoriesModule,
    TransactionsModule,
    FixedExpensesModule,
    StatsModule,
    PaymentMethodsModule,
    SchedulerModule,
  ],
  controllers: [HealthController],
  providers: [
    // 전역 예외 필터 — 모든 예외를 { success: false, message } 형태로 응답
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    // 전역 로깅 인터셉터 — 성공 응답마다 메서드·경로·소요시간 기록
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export class AppModule {}
