import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/** 비밀번호 변경 DTO */
export class UpdatePasswordDto {
  @ApiProperty()
  @IsString()
  currentPassword: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  newPassword: string;
}
