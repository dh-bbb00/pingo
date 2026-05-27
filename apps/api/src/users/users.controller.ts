import { Controller, Get, Patch, Delete, Body, Query, UseGuards } from '@nestjs/common';
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

  /** 승인된 유저 목록 — ADMIN 전용 */
  @Get()
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: '승인 유저 목록 (ADMIN, 검색·페이지네이션)' })
  async findAll(
    @Query('search')   search?: string,
    @Query('page')     page     = '1',
    @Query('pageSize') pageSize = '20',
  ): Promise<PageResponse<unknown>> {
    const result = await this.usersService.findAllAdmin({
      search,
      page:     parseInt(page,     10),
      pageSize: parseInt(pageSize, 10),
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

  /** 현재 로그인한 기기 정보 — JWT payload의 deviceId 기준 */
  @Get('me/device')
  @ApiOperation({ summary: '현재 기기 정보' })
  async getDevice(
    @CurrentUser() user: { id: string; deviceId: string },
  ): Promise<BasicResponse<unknown>> {
    const data = await this.usersService.getDevice(user.id, user.deviceId);
    return { success: true, data };
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
}
