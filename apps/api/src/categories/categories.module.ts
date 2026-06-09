import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoriesScheduler } from './categories.scheduler';
import { LoggerModule } from '../logger/logger.module';
import { SchedulerLogModule } from '../scheduler/scheduler-log.module';

@Module({
  imports: [LoggerModule, SchedulerLogModule],
  providers: [CategoriesService, CategoriesScheduler],
  controllers: [CategoriesController],
  exports: [CategoriesService],
})
export class CategoriesModule {}
