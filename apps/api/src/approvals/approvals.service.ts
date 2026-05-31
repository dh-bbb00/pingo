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
   * 승인/거절 처리
   * - NEW_USER:   Device.isTrusted + User.status 모두 업데이트
   * - NEW_DEVICE: Device.isTrusted만 업데이트 (User는 이미 APPROVED 상태 유지)
   */
  async review(id: string, status: 'APPROVED' | 'REJECTED', adminId: string) {
    const request = await this.prisma.approvalRequest.findUnique({ where: { id } });
    if (!request) throw new NotFoundException();

    await this.prisma.$transaction(async (tx) => {
      await tx.approvalRequest.update({
        where: { id },
        data: { status, reviewedById: adminId, reviewedAt: new Date() },
      });
      await tx.device.update({
        where: { id: request.deviceId },
        data: { isTrusted: status === 'APPROVED' },
      });
      if (request.type === 'NEW_USER') {
        await tx.user.update({
          where: { id: request.userId },
          data: { status: status === 'APPROVED' ? 'APPROVED' : 'REJECTED' },
        });
        // 신규 승인 시 현금·상품권 결제수단 자동 생성
        if (status === 'APPROVED') {
          await tx.paymentMethod.createMany({
            data: [
              { userId: request.userId, type: 'CASH',      name: '현금' },
              { userId: request.userId, type: 'GIFT_CARD', name: '상품권' },
            ],
          });
        }
      }
    });

    return this.prisma.approvalRequest.findUnique({ where: { id } });
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
