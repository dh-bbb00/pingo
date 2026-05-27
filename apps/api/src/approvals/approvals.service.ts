import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApprovalStatus } from '@prisma/client';

@Injectable()
export class ApprovalsService {
  constructor(private readonly prisma: PrismaService) {}

  /** 승인 요청 목록 — status 기준 (PENDING: 대기, REJECTED: 거절) */
  findAll(status: ApprovalStatus) {
    return this.prisma.approvalRequest.findMany({
      where: { status },
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

  /**
   * 거절된 계정 삭제 — User·Device·관련 레코드를 모두 제거해 재신청 가능 상태로 만든다.
   * 삭제 순서: RefreshToken → ApprovalRequest → Device → User (외래키 제약 순서)
   */
  async deleteRequest(id: string): Promise<void> {
    const request = await this.prisma.approvalRequest.findUnique({ where: { id } });
    if (!request) throw new NotFoundException();

    const { userId } = request;
    await this.prisma.$transaction([
      this.prisma.refreshToken.deleteMany({ where: { userId } }),
      this.prisma.approvalRequest.deleteMany({ where: { userId } }),
      this.prisma.device.deleteMany({ where: { userId } }),
      this.prisma.user.delete({ where: { id: userId } }),
    ]);
  }
}
