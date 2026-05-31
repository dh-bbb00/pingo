import { IsOptional, IsString, IsNumber, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { VM } from '../../common/constants/validation-messages';

/** 내역 목록 필터 + 페이지네이션 쿼리 파라미터 */
export class TransactionFilterDto {
  @ApiProperty({ required: false, default: 1, description: '페이지 (1-based)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: VM.number })
  @Min(1, { message: VM.min(1) })
  page?: number = 1;

  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: VM.number })
  @Min(1, { message: VM.min(1) })
  pageSize?: number = 20;

  @ApiProperty({ required: false, description: '시작일 (ISO 8601)' })
  @IsOptional()
  @IsDateString({}, { message: VM.dateString })
  startDate?: string;

  @ApiProperty({ required: false, description: '종료일 (ISO 8601)' })
  @IsOptional()
  @IsDateString({}, { message: VM.dateString })
  endDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: VM.string })
  categoryId?: string;

  @ApiProperty({ required: false, description: '최소 금액 (원)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: VM.number })
  amountMin?: number;

  @ApiProperty({ required: false, description: '최대 금액 (원)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: VM.number })
  amountMax?: number;

  @ApiProperty({ required: false, description: '결제수단 ID 필터' })
  @IsOptional()
  @IsString({ message: VM.string })
  paymentMethodId?: string;

  @ApiProperty({ required: false, description: '가맹점명 부분 검색' })
  @IsOptional()
  @IsString({ message: VM.string })
  merchantName?: string;
}
