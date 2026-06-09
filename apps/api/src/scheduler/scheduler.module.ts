import { Module } from '@nestjs/common';
import { SchedulerController } from './scheduler.controller';
import { CategoriesModule } from '../categories/categories.module';
import { FixedExpensesModule } from '../fixed-expenses/fixed-expenses.module';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [CategoriesModule, FixedExpensesModule, TransactionsModule],
  controllers: [SchedulerController],
})
export class SchedulerModule {}
