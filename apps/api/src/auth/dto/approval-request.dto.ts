import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VM } from '../../common/constants/validation-messages';

/** 사용 승인 요청 DTO — react-native-device-info 로 수집한 기기 정보 포함 */
export class ApprovalRequestDto {
  @ApiProperty()
  @IsEmail({}, { message: VM.email })
  email: string;

  @ApiProperty()
  @IsString({ message: VM.string })
  @MinLength(8, { message: VM.minLength(8) })
  password: string;

  @ApiProperty({ description: 'getUniqueId() — 앱 재설치 시 변경될 수 있음' })
  @IsString({ message: VM.string })
  @IsNotEmpty({ message: VM.notEmpty })
  deviceUid: string;

  @ApiProperty({ description: 'getDeviceName()' })
  @IsString({ message: VM.string })
  @IsNotEmpty({ message: VM.notEmpty })
  deviceName: string;

  @ApiProperty({ description: 'getModel()' })
  @IsString({ message: VM.string })
  @IsNotEmpty({ message: VM.notEmpty })
  phoneModel: string;

  @ApiProperty({ description: 'getSystemVersion()' })
  @IsString({ message: VM.string })
  @IsNotEmpty({ message: VM.notEmpty })
  osVersion: string;

  @ApiProperty({ description: 'getVersion()' })
  @IsString({ message: VM.string })
  @IsNotEmpty({ message: VM.notEmpty })
  appVersion: string;
}
