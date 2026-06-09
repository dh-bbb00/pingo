import { Module } from '@nestjs/common';
import { SchedulerLogService } from './scheduler-log.service';

/** SchedulerLogService를 다른 모듈에서 주입받을 수 있도록 분리한 모듈 */
@Module({
  providers: [SchedulerLogService],
  exports:   [SchedulerLogService],
})
export class SchedulerLogModule {}
