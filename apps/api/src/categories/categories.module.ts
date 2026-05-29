import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoriesScheduler } from './categories.scheduler';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [LoggerModule],
  providers: [CategoriesService, CategoriesScheduler],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
