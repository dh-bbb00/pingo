import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { MSG } from '../common/constants/messages';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /** 내 정보 — 민감 정보(password) 제외하고 반환 */
  findMe(userId: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { id: true, email: true, role: true, status: true, createdAt: true },
    });
  }

  /** 비밀번호 변경 — 현재 비밀번호 검증 후 교체 */
  async updatePassword(userId: string, dto: UpdatePasswordDto): Promise<void> {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const valid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!valid) throw new UnauthorizedException(MSG.user.wrongPassword);
    const hashed = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({ where: { id: userId }, data: { password: hashed } });
  }

  /** 현재 JWT에 담긴 deviceId 기준으로 기기 정보 반환 */
  async getDevice(userId: string, deviceId: string) {
    const device = await this.prisma.device.findFirst({
      where: { id: deviceId, userId },
      select: {
        id: true, deviceName: true, phoneModel: true,
        osVersion: true, appVersion: true, isTrusted: true, createdAt: true,
      },
    });
    if (!device) throw new NotFoundException(MSG.common.notFound);
    return device;
  }

  /** 기기 삭제 — 연결된 refresh token 함께 삭제 */
  async removeDevice(userId: string, deviceId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({ where: { userId, deviceId } });
    await this.prisma.device.delete({ where: { id: deviceId } });
  }
}
