import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ApprovalsService {
  constructor(private readonly prisma: PrismaService) {}

  /** 승인 대기 목록 — 관리자 화면에서 사용 */
  findAll() {
    return this.prisma.approvalRequest.findMany({
      where: { status: 'PENDING' },
      include: {
        user: { select: { id: true, email: true, createdAt: true } },
        device: {
          select: { deviceName: true, phoneModel: true, osVersion: true, appVersion: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * 승인/거절 처리 — 트랜잭션으로 ApprovalRequest, Device, User 동시 업데이트
   * 승인 시 Device.isTrusted = true, User.status = APPROVED
   * 거절 시 Device.isTrusted = false, User.status = REJECTED
   */
  async review(id: string, status: 'APPROVED' | 'REJECTED', adminId: string) {
    const request = await this.prisma.approvalRequest.findUnique({
      where: { id },
    });
    if (!request) throw new NotFoundException();

    const [approval] = await this.prisma.$transaction([
      this.prisma.approvalRequest.update({
        where: { id },
        data: { status, reviewedById: adminId, reviewedAt: new Date() },
      }),
      this.prisma.device.update({
        where: { id: request.deviceId },
        data: { isTrusted: status === 'APPROVED' },
      }),
      this.prisma.user.update({
        where: { id: request.userId },
        data: { status: status === 'APPROVED' ? 'APPROVED' : 'REJECTED' },
      }),
    ]);

    return approval;
  }
}
