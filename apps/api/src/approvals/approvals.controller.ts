import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
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
  @ApiOperation({ summary: '승인 요청 목록 (PENDING)' })
  async findAll(): Promise<ListResponse<unknown>> {
    const data = await this.approvalsService.findAll();
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
}
