import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/** 내역 추가 DTO */
export class CreateTransactionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ description: '원 단위' })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: '가맹점명' })
  @IsString()
  @IsNotEmpty()
  merchantName: string;

  @ApiProperty({ required: false, description: '카드사 예: 신한, 국민' })
  @IsOptional()
  @IsString()
  cardCompany?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  memo?: string;

  @ApiProperty({ description: '실제 거래 일시 (ISO 8601)' })
  @IsDateString()
  transactionDate: string;
}
