import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VM } from '../../common/constants/validation-messages';

/** JWT 인증된 유저의 새 기기 승인 요청 DTO — email/password 불필요, userId는 토큰에서 추출 */
export class DeviceApprovalRequestDto {
  @ApiProperty({ description: 'getUniqueId()' })
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
