import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/** 승인 요청 처리 DTO */
export class ReviewApprovalDto {
  @ApiProperty({ enum: ['APPROVED', 'REJECTED'] })
  @IsEnum(['APPROVED', 'REJECTED'])
  status: 'APPROVED' | 'REJECTED';
}
