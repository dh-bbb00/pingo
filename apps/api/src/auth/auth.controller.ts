import { Controller, Post, Delete, Body, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { ApprovalRequestDto } from './dto/approval-request.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtGuard } from './guards/jwt.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { MSG } from '../common/constants/messages';
import { BasicResponse } from '../common/types/response.type';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** 최초 사용 승인 요청 — 관리자가 승인해야 로그인 가능 */
  @Post('approval-request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '사용 승인 요청' })
  async requestApproval(
    @Body() dto: ApprovalRequestDto,
    @Req() req: Request,
  ): Promise<BasicResponse<null>> {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] ?? req.ip ?? '';
    await this.authService.requestApproval(dto, ip);
    return { success: true, data: null, message: MSG.auth.approvalSubmitted };
  }

  /**
   * 로그인
   * ForbiddenException message === MSG.auth.newDevice → 기기변경 화면으로 이동
   * ForbiddenException 기타 → 승인 대기 화면으로 이동
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '로그인' })
  async login(
    @Body() dto: LoginDto,
  ): Promise<BasicResponse<{ accessToken: string; refreshToken: string }>> {
    const tokens = await this.authService.login(dto);
    return { success: true, data: tokens };
  }

  /** refresh token으로 access + refresh 재발급 (token rotation) */
  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '토큰 재발급' })
  async refresh(
    @CurrentUser() user: { id: string; deviceId: string },
    @Body() dto: RefreshTokenDto,
  ): Promise<BasicResponse<{ accessToken: string; refreshToken: string }>> {
    const tokens = await this.authService.refresh(user.id, user.deviceId, dto.refreshToken);
    return { success: true, data: tokens };
  }

  /** 로그아웃 — 현재 기기의 refresh token 삭제 */
  @Delete('logout')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '로그아웃' })
  async logout(
    @CurrentUser() user: { id: string; deviceId: string },
  ): Promise<BasicResponse<null>> {
    await this.authService.logout(user.id, user.deviceId);
    return { success: true, data: null };
  }
}
