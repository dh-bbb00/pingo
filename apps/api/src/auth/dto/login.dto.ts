import { IsEmail, IsString, MinLength, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/** 로그인 DTO — deviceUid 로 기기 변경 감지 */
export class LoginDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ description: 'react-native-device-info getUniqueId()' })
  @IsString()
  @IsNotEmpty()
  deviceUid: string;

  @ApiProperty({ required: false, description: '앱 버전이 바뀐 경우 업데이트용' })
  @IsOptional()
  @IsString()
  appVersion?: string;
}
