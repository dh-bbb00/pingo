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

  @ApiProperty({ description: '원 단위' })
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
}
