import { IsOptional, IsString, IsNumber, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/** 내역 목록 필터 + 페이지네이션 쿼리 파라미터 */
export class TransactionFilterDto {
  @ApiProperty({ required: false, default: 1, description: '페이지 (1-based)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageSize?: number = 20;

  @ApiProperty({ required: false, description: '시작일 (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ required: false, description: '종료일 (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({ required: false, description: '최소 금액 (원)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  amountMin?: number;

  @ApiProperty({ required: false, description: '최대 금액 (원)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  amountMax?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  cardCompany?: string;

  @ApiProperty({ required: false, description: '가맹점명 부분 검색' })
  @IsOptional()
  @IsString()
  merchantName?: string;
}
