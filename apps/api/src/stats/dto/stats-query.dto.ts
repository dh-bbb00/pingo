import { IsOptional, IsDateString, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VM } from '../../common/constants/validation-messages';

/** 통계 조회 쿼리 파라미터 */
export class StatsQueryDto {
  @ApiProperty({ description: '시작일 (ISO 8601)' })
  @IsDateString({}, { message: VM.dateString })
  startDate: string;

  @ApiProperty({ description: '종료일 (ISO 8601)' })
  @IsDateString({}, { message: VM.dateString })
  endDate: string;

  @ApiProperty({ required: false, description: '특정 카테고리 ID로 범위 제한' })
  @IsOptional()
  @IsString({ message: VM.string })
  categoryId?: string;
}
