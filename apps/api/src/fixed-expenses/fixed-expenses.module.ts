import { Module } from '@nestjs/common';
import { FixedExpensesService } from './fixed-expenses.service';
import { FixedExpensesController } from './fixed-expenses.controller';
import { FixedExpensesScheduler } from './fixed-expenses.scheduler';

@Module({
  providers: [FixedExpensesService, FixedExpensesScheduler],
  controllers: [FixedExpensesController],
})
export class FixedExpensesModule {}
