import { Module } from '@nestjs/common';
import { FixedExpensesService } from './fixed-expenses.service';
import { FixedExpensesController } from './fixed-expenses.controller';
import { FixedExpensesScheduler } from './fixed-expenses.scheduler';
import { LoggerModule } from '../logger/logger.module';
import { SchedulerLogModule } from '../scheduler/scheduler-log.module';

@Module({
  imports: [LoggerModule, SchedulerLogModule],
  providers: [FixedExpensesService, FixedExpensesScheduler],
  controllers: [FixedExpensesController],
  exports: [FixedExpensesService],
})
export class FixedExpensesModule {}
