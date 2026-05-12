import { IsOptional, IsDateString, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/** 통계 조회 쿼리 파라미터 */
export class StatsQueryDto {
  @ApiProperty({ description: '시작일 (ISO 8601)' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: '종료일 (ISO 8601)' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ required: false, description: '특정 카테고리 ID로 범위 제한' })
  @IsOptional()
  @IsString()
  categoryId?: string;
}
