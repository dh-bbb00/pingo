import { Module } from '@nestjs/common';
import { SchedulerController } from './scheduler.controller';
import { SchedulerLogModule } from './scheduler-log.module';
import { CategoriesModule } from '../categories/categories.module';
import { FixedExpensesModule } from '../fixed-expenses/fixed-expenses.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [CategoriesModule, FixedExpensesModule, TransactionsModule, LoggerModule, SchedulerLogModule],
  controllers: [SchedulerController],
})
export class SchedulerModule {}
