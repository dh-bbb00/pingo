import { IsEmail, IsString, MinLength, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VM } from '../../common/constants/validation-messages';

/** 로그인 DTO — deviceUid 로 기기 변경 감지 */
export class LoginDto {
  @ApiProperty()
  @IsEmail({}, { message: VM.email })
  email: string;

  @ApiProperty()
  @IsString({ message: VM.string })
  @MinLength(8, { message: VM.minLength(8) })
  password: string;

  @ApiProperty({ description: 'react-native-device-info getUniqueId()' })
  @IsString({ message: VM.string })
  @IsNotEmpty({ message: VM.notEmpty })
  deviceUid: string;

  @ApiProperty({ required: false, description: '앱 버전이 바뀐 경우 업데이트용' })
  @IsOptional()
  @IsString({ message: VM.string })
  appVersion?: string;
}
