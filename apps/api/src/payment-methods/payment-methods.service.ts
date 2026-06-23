import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { MSG } from '../common/constants/messages';

@Injectable()
export class PaymentMethodsService {
  constructor(private readonly prisma: PrismaService) {}

  /** 결제수단 목록 — CASH·GIFT_CARD 고정 항목 먼저, 이후 CARD를 등록순으로 반환 (소프트 삭제 제외) */
  findAll(userId: string) {
    return this.prisma.paymentMethod.findMany({
      where: { userId, deletedAt: null },
      orderBy: [{ type: 'asc' }, { createdAt: 'asc' }],
    });
  }

  /** CARD 타입 결제수단 등록. 이름·카드번호가 동일한 소프트 삭제 항목이 있으면 복원 */
  async create(userId: string, dto: CreatePaymentMethodDto) {
    if (dto.cardNumber) {
      const deleted = await this.prisma.paymentMethod.findFirst({
        where: { userId, name: dto.name, cardNumber: dto.cardNumber, deletedAt: { not: null } },
      });
      if (deleted) {
        return this.prisma.paymentMethod.update({
          where: { id: deleted.id },
          data: { deletedAt: null },
        });
      }
    }
    return this.prisma.paymentMethod.create({
      data: { userId, type: 'CARD', name: dto.name, ...(dto.cardNumber && { cardNumber: dto.cardNumber }) },
    });
  }

  /** 결제수단 수정. isDefault=true 시 기존 기본 결제수단 해제 후 설정 */
  async update(userId: string, id: string, dto: UpdatePaymentMethodDto) {
    const method = await this.findOneOrThrow(userId, id);

    // CASH·GIFT_CARD는 이름 변경 불가
    if (dto.name && method.type !== 'CARD') {
      throw new ForbiddenException(MSG.paymentMethod.cannotEditFixed);
    }

    if (dto.isDefault) {
      await this.prisma.$transaction([
        this.prisma.paymentMethod.updateMany({
          where: { userId, isDefault: true, deletedAt: null },
          data: { isDefault: false },
        }),
        this.prisma.paymentMethod.update({
          where: { id },
          data: { ...(dto.name && { name: dto.name }), ...(dto.cardNumber !== undefined && { cardNumber: dto.cardNumber }), isDefault: true },
        }),
      ]);
      return this.prisma.paymentMethod.findUnique({ where: { id } });
    }

    return this.prisma.paymentMethod.update({
      where: { id },
      data: {
        ...(dto.name       && { name: dto.name }),
        ...(dto.cardNumber !== undefined && { cardNumber: dto.cardNumber }),
        ...(dto.isDefault === false && { isDefault: false }),
      },
    });
  }

  /** CARD 타입만 소프트 삭제 가능. 기존 내역은 카드 정보를 그대로 유지 */
  async remove(userId: string, id: string) {
    const method = await this.findOneOrThrow(userId, id);
    if (method.type !== 'CARD') {
      throw new ForbiddenException(MSG.paymentMethod.cannotDeleteFixed);
    }
    return this.prisma.paymentMethod.update({
      where: { id },
      data: { deletedAt: new Date(), isDefault: false },
    });
  }

  private async findOneOrThrow(userId: string, id: string) {
    const method = await this.prisma.paymentMethod.findFirst({ where: { id, userId, deletedAt: null } });
    if (!method) throw new NotFoundException(MSG.common.notFound);
    return method;
  }
}
