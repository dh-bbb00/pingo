import { Controller, Get, Patch, Delete, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApprovalStatus } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApprovalsService } from './approvals.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { BasicResponse, ListResponse } from '../common/types/response.type';

/** 관리자 전용 — ADMIN role만 접근 가능 */
@ApiTags('Approvals')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Roles('ADMIN')
@Controller('approvals')
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) {}

  @Get()
  @ApiOperation({ summary: '승인 요청 목록 (status: PENDING | REJECTED)' })
  async findAll(@Query('status') status: ApprovalStatus = 'PENDING'): Promise<ListResponse<unknown>> {
    const data = await this.approvalsService.findAll(status);
    return { success: true, data };
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: '승인' })
  async approve(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ): Promise<BasicResponse<unknown>> {
    const data = await this.approvalsService.review(id, 'APPROVED', user.id);
    return { success: true, data };
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: '거절' })
  async reject(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ): Promise<BasicResponse<unknown>> {
    const data = await this.approvalsService.review(id, 'REJECTED', user.id);
    return { success: true, data };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '거절된 계정 삭제 (User·Device 포함 전체 삭제 — 재신청 가능 상태로 초기화)' })
  async deleteRequest(@Param('id') id: string): Promise<void> {
    await this.approvalsService.deleteRequest(id);
  }
}
