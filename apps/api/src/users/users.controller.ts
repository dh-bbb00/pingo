import { Controller, Get, Patch, Delete, Body, Param, Query, UseGuards, Post } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { MSG } from '../common/constants/messages';
import { BasicResponse, PageResponse } from '../common/types/response.type';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /** 유저 목록 — ADMIN 전용 (status 필터: APPROVED | SUSPENDED) */
  @Get()
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: '유저 목록 (ADMIN, 상태 필터·검색·페이지네이션)' })
  async findAll(
    @Query('search')   search?: string,
    @Query('page')     page     = '1',
    @Query('pageSize') pageSize = '20',
    @Query('status')   status:  'APPROVED' | 'SUSPENDED' = 'APPROVED',
  ): Promise<PageResponse<unknown>> {
    const result = await this.usersService.findAllAdmin({
      search,
      page:     parseInt(page,     10),
      pageSize: parseInt(pageSize, 10),
      status,
    });
    return {
      success: true,
      data: result.users,
      pagination: {
        page:       result.page,
        pageSize:   result.pageSize,
        total:      result.total,
        totalPages: result.totalPages,
      },
    };
  }

  @Get('me')
  @ApiOperation({ summary: '내 정보' })
  async getMe(
    @CurrentUser() user: { id: string },
  ): Promise<BasicResponse<unknown>> {
    const data = await this.usersService.findMe(user.id);
    return { success: true, data };
  }

  @Patch('me/password')
  @ApiOperation({ summary: '비밀번호 변경' })
  async updatePassword(
    @CurrentUser() user: { id: string },
    @Body() dto: UpdatePasswordDto,
  ): Promise<BasicResponse<null>> {
    await this.usersService.updatePassword(user.id, dto);
    return { success: true, data: null, message: MSG.user.passwordChanged };
  }

  /** 내 전체 기기 목록 */
  @Get('me/devices')
  @ApiOperation({ summary: '내 기기 목록' })
  async getMyDevices(
    @CurrentUser() user: { id: string; deviceId: string },
  ): Promise<BasicResponse<unknown>> {
    const data = await this.usersService.getMyDevices(user.id, user.deviceId);
    return { success: true, data };
  }

  /** 특정 기기 삭제 */
  @Delete('me/devices/:id')
  @ApiOperation({ summary: '기기 삭제' })
  async removeDeviceById(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
  ): Promise<BasicResponse<null>> {
    await this.usersService.removeDeviceById(user.id, id);
    return { success: true, data: null };
  }

  /** 현재 로그인한 기기 정보 — JWT payload의 deviceId 기준 */
  @Get('me/device')
  @ApiOperation({ summary: '현재 기기 정보' })
  async getDevice(
    @CurrentUser() user: { id: string; deviceId: string },
  ): Promise<BasicResponse<unknown>> {
    const data = await this.usersService.getDevice(user.id, user.deviceId);
    return { success: true, data };
  }

  /** FCM 토큰 등록/갱신 — 앱 시작 시 호출 */
  @Post('me/device/fcm-token')
  @ApiOperation({ summary: 'FCM 토큰 저장' })
  async saveFcmToken(
    @CurrentUser() user: { id: string; deviceId: string },
    @Body('fcmToken') fcmToken: string,
  ): Promise<BasicResponse<null>> {
    await this.usersService.saveFcmToken(user.deviceId, fcmToken);
    return { success: true, data: null };
  }

  /** 기기 삭제 — 로그아웃 처리도 겸함 */
  @Delete('me/device')
  @ApiOperation({ summary: '기기 삭제' })
  async removeDevice(
    @CurrentUser() user: { id: string; deviceId: string },
  ): Promise<BasicResponse<null>> {
    await this.usersService.removeDevice(user.id, user.deviceId);
    return { success: true, data: null };
  }

  /** 사용 정지 — ADMIN 전용, refresh token 삭제로 즉시 강제 로그아웃 */
  @Patch(':id/suspend')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: '유저 사용 정지 (ADMIN)' })
  async suspend(
    @Param('id') id: string,
  ): Promise<BasicResponse<null>> {
    await this.usersService.suspend(id);
    return { success: true, data: null };
  }

  /** 사용 정지 해제 — ADMIN 전용 */
  @Patch(':id/unsuspend')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: '유저 사용 정지 해제 (ADMIN)' })
  async unsuspend(
    @Param('id') id: string,
  ): Promise<BasicResponse<null>> {
    await this.usersService.unsuspend(id);
    return { success: true, data: null };
  }
}
