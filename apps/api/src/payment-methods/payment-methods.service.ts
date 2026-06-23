import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { MSG } from '../common/constants/messages';

@Injectable()
export class PaymentMethodsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 결제수단 목록 — CASH·GIFT_CARD 고정 항목 먼저, 이후 CARD를 등록순으로 반환
   */
  findAll(userId: string) {
    return this.prisma.paymentMethod.findMany({
      where: { userId },
      orderBy: [{ type: 'asc' }, { createdAt: 'asc' }],
    });
  }

  /** CARD 타입 결제수단 등록 */
  create(userId: string, dto: CreatePaymentMethodDto) {
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
          where: { userId, isDefault: true },
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

  /** CARD 타입만 삭제 가능. 삭제 시 연결된 Transaction.paymentMethodId는 자동 SetNull */
  async remove(userId: string, id: string) {
    const method = await this.findOneOrThrow(userId, id);
    if (method.type !== 'CARD') {
      throw new ForbiddenException(MSG.paymentMethod.cannotDeleteFixed);
    }
    return this.prisma.paymentMethod.delete({ where: { id } });
  }

  private async findOneOrThrow(userId: string, id: string) {
    const method = await this.prisma.paymentMethod.findFirst({ where: { id, userId } });
    if (!method) throw new NotFoundException(MSG.common.notFound);
    return method;
  }
}
