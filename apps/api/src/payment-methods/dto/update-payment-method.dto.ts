import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VM } from '../../common/constants/validation-messages';

export class UpdatePaymentMethodDto {
  @ApiProperty({ required: false, description: '카드사명' })
  @IsOptional()
  @IsString({ message: VM.string })
  @MaxLength(20, { message: VM.max(20) })
  name?: string;

  @ApiProperty({ required: false, description: '카드번호' })
  @IsOptional()
  @IsString({ message: VM.string })
  @MaxLength(20, { message: VM.max(20) })
  cardNumber?: string;

  @ApiProperty({ required: false, description: '기본 결제수단으로 설정' })
  @IsOptional()
  @IsBoolean({ message: VM.boolean })
  isDefault?: boolean;
}
