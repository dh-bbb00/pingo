import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TransactionsScheduler } from './transactions.scheduler';

@Module({
  providers: [TransactionsService, TransactionsScheduler],
  controllers: [TransactionsController],
  exports: [TransactionsService],
})
export class TransactionsModule {}
