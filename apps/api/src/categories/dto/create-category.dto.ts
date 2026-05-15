import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VM } from '../../common/constants/validation-messages';

/** 카테고리 생성 DTO */
export class CreateCategoryDto {
  @ApiProperty()
  @IsString({ message: VM.string })
  @IsNotEmpty({ message: VM.notEmpty })
  name: string;

  @ApiProperty({ required: false, description: '아이콘 식별자' })
  @IsOptional()
  @IsString({ message: VM.string })
  icon?: string;

  @ApiProperty({ required: false, description: 'HEX 색상코드 예: #FF5733' })
  @IsOptional()
  @IsString({ message: VM.string })
  color?: string;

  @ApiProperty({ required: false, description: '월 예산 (원). null이면 예산 기능 비활성' })
  @IsOptional()
  @IsNumber({}, { message: VM.number })
  @Min(0, { message: VM.min(0) })
  budget?: number;

  @ApiProperty({ required: false, description: 'true면 매월 동일 예산 자동 적용' })
  @IsOptional()
  @IsBoolean({ message: VM.boolean })
  isBudgetFixed?: boolean;
}
