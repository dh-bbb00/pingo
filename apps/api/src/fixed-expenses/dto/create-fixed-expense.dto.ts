import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/** 고정 지출 생성 DTO */
export class CreateFixedExpenseDto {
  @ApiProperty({ description: '카테고리 ID' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ description: '금액 (원)' })
  @IsNumber()
  @Min(1)
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

  @ApiProperty({ description: '매월 지출 일자 (1~31). 해당 월에 없는 날짜면 말일로 처리' })
  @IsNumber()
  @Min(1)
  @Max(31)
  dayOfMonth: number;

  @ApiProperty({ required: false, default: true, description: 'false면 스케줄러 실행 시 제외' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
