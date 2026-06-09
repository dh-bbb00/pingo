import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString, Min, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VM } from '../../common/constants/validation-messages';

/** 내역 추가 DTO */
export class CreateTransactionDto {
  @ApiProperty({ required: false, nullable: true, description: 'null이면 기타(미분류)로 처리' })
  @IsOptional()
  @ValidateIf((o) => o.categoryId !== null)
  @IsString({ message: VM.string })
  categoryId?: string | null;

  @ApiProperty({ description: '원 단위. 할부인 경우 월 납입금' })
  @IsNumber({}, { message: VM.number })
  @Min(1, { message: VM.min(1) })
  amount: number;

  @ApiProperty({ description: '가맹점명' })
  @IsString({ message: VM.string })
  @IsNotEmpty({ message: VM.notEmpty })
  merchantName: string;

  @ApiProperty({ required: false, nullable: true, description: '결제수단 ID (null이면 미지정)' })
  @IsOptional()
  @IsString({ message: VM.string })
  paymentMethodId?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: VM.string })
  memo?: string;

  @ApiProperty({ description: '실제 거래 일시 (ISO 8601)' })
  @IsDateString({}, { message: VM.dateString })
  transactionDate: string;

  @ApiProperty({ required: false, nullable: true, description: '할부 개월수 (2 이상). null = 일시불' })
  @IsOptional()
  @ValidateIf((o) => o.installmentMonths !== null)
  @IsNumber({}, { message: VM.number })
  @Min(2, { message: VM.min(2) })
  installmentMonths?: number | null;

  @ApiProperty({ required: false, nullable: true, description: '할부 원금 (할부일 때만)' })
  @IsOptional()
  @ValidateIf((o) => o.totalAmount !== null)
  @IsNumber({}, { message: VM.number })
  @Min(1, { message: VM.min(1) })
  totalAmount?: number | null;

  @ApiProperty({ required: false, nullable: true, description: '마지막 납부월 (ISO 8601). 할부일 때만' })
  @IsOptional()
  @ValidateIf((o) => o.installmentEndDate !== null)
  @IsDateString({}, { message: VM.dateString })
  installmentEndDate?: string | null;

  @ApiProperty({ required: false, nullable: true, description: '원거래 ID. 스케줄러 생성 할부 내역에 설정' })
  @IsOptional()
  @ValidateIf((o) => o.originalTransactionId !== null)
  @IsString({ message: VM.string })
  originalTransactionId?: string | null;
}
