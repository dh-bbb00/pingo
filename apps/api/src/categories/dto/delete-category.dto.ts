import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VM } from '../../common/constants/validation-messages';

export class DeleteCategoryDto {
  @ApiProperty({ required: false, nullable: true, description: '내역을 이동할 카테고리 ID. null이면 기타(미분류)로 처리' })
  @IsOptional()
  @IsString({ message: VM.string })
  replaceCategoryId?: string;
}
