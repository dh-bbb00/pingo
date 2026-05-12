import { Controller, Get, Patch, Delete, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { MSG } from '../common/constants/messages';
import { BasicResponse } from '../common/types/response.type';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
