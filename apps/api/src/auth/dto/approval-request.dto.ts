import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/** 사용 승인 요청 DTO — react-native-device-info 로 수집한 기기 정보 포함 */
export class ApprovalRequestDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ description: 'getUniqueId() — 앱 재설치 시 변경될 수 있음' })
  @IsString()
  @IsNotEmpty()
  deviceUid: string;

  @ApiProperty({ description: 'getDeviceName()' })
  @IsString()
  @IsNotEmpty()
  deviceName: string;

  @ApiProperty({ description: 'getModel()' })
  @IsString()
  @IsNotEmpty()
  phoneModel: string;

  @ApiProperty({ description: 'getSystemVersion()' })
  @IsString()
  @IsNotEmpty()
  osVersion: string;

  @ApiProperty({ description: 'getVersion()' })
  @IsString()
  @IsNotEmpty()
  appVersion: string;
}
