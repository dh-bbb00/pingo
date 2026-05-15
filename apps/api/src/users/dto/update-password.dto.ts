import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VM } from '../../common/constants/validation-messages';

/** 비밀번호 변경 DTO */
export class UpdatePasswordDto {
  @ApiProperty()
  @IsString({ message: VM.string })
  currentPassword: string;

  @ApiProperty()
  @IsString({ message: VM.string })
  @MinLength(8, { message: VM.minLength(8) })
  newPassword: string;
}
