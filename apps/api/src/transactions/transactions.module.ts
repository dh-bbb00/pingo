import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TransactionsScheduler } from './transactions.scheduler';
import { LoggerModule } from '../logger/logger.module';
import { SchedulerLogModule } from '../scheduler/scheduler-log.module';

@Module({
  imports: [LoggerModule, SchedulerLogModule],
  providers: [TransactionsService, TransactionsScheduler],
  controllers: [TransactionsController],
  exports: [TransactionsService],
})
export class TransactionsModule {}
