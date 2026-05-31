import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VM } from '../../common/constants/validation-messages';

/** 카드 결제수단 등록 DTO (CASH·GIFT_CARD는 자동 생성되므로 CARD만 허용) */
export class CreatePaymentMethodDto {
  @ApiProperty({ description: '카드사명 예: 신한, 국민' })
  @IsString({ message: VM.string })
  @IsNotEmpty({ message: VM.notEmpty })
  @MaxLength(20, { message: VM.max(20) })
  name: string;

  @ApiProperty({ required: false, description: '카드번호 (예: 끝 4자리 또는 전체)' })
  @IsOptional()
  @IsString({ message: VM.string })
  @MaxLength(20, { message: VM.max(20) })
  cardNumber?: string;
}
