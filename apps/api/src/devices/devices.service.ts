import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/** 기기 관련 공통 로직 — auth, users 모듈에서 공유 */
@Injectable()
export class DevicesService {
  constructor(private readonly prisma: PrismaService) {}

  findTrustedDevice(userId: string) {
    return this.prisma.device.findFirst({
      where: { userId, isTrusted: true },
    });
  }

  /** 기기 삭제 — 연결된 refresh token 함께 삭제 */
  async remove(userId: string, deviceId: string) {
    await this.prisma.refreshToken.deleteMany({ where: { userId, deviceId } });
    return this.prisma.device.delete({ where: { id: deviceId } });
  }
}
