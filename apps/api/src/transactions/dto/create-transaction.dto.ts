import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VM } from '../../common/constants/validation-messages';

/** 내역 추가 DTO */
export class CreateTransactionDto {
  @ApiProperty()
  @IsString({ message: VM.string })
  @IsNotEmpty({ message: VM.notEmpty })
  categoryId: string;

  @ApiProperty({ description: '원 단위' })
  @IsNumber({}, { message: VM.number })
  @Min(0, { message: VM.min(0) })
  amount: number;

  @ApiProperty({ description: '가맹점명' })
  @IsString({ message: VM.string })
  @IsNotEmpty({ message: VM.notEmpty })
  merchantName: string;

  @ApiProperty({ required: false, description: '카드사 예: 신한, 국민' })
  @IsOptional()
  @IsString({ message: VM.string })
  cardCompany?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: VM.string })
  memo?: string;

  @ApiProperty({ description: '실제 거래 일시 (ISO 8601)' })
  @IsDateString({}, { message: VM.dateString })
  transactionDate: string;
}
