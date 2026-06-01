import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VM } from '../../common/constants/validation-messages';

/** 고정 지출 생성 DTO */
export class CreateFixedExpenseDto {
  @ApiProperty({ description: '카테고리 ID' })
  @IsString({ message: VM.string })
  @IsNotEmpty({ message: VM.notEmpty })
  categoryId: string;

  @ApiProperty({ description: '금액 (원)' })
  @IsNumber({}, { message: VM.number })
  @Min(1, { message: VM.min(1) })
  amount: number;

  @ApiProperty({ description: '가맹점명' })
  @IsString({ message: VM.string })
  @IsNotEmpty({ message: VM.notEmpty })
  merchantName: string;

  @ApiProperty({ required: false, description: '결제수단 ID' })
  @IsOptional()
  @IsString({ message: VM.string })
  paymentMethodId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: VM.string })
  memo?: string;

  @ApiProperty({ description: '매월 지출 일자 (1~31). 해당 월에 없는 날짜면 말일로 처리' })
  @IsNumber({}, { message: VM.number })
  @Min(1, { message: VM.min(1) })
  @Max(31, { message: VM.max(31) })
  dayOfMonth: number;

  @ApiProperty({ required: false, default: true, description: 'false면 스케줄러 실행 시 제외' })
  @IsOptional()
  @IsBoolean({ message: VM.boolean })
  isActive?: boolean;
}
