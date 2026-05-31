import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PaymentMethodsService } from './payment-methods.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { BasicResponse, ListResponse } from '../common/types/response.type';

@ApiTags('PaymentMethods')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Get()
  @ApiOperation({ summary: '결제수단 목록 (CASH·GIFT_CARD 고정 + 등록 카드)' })
  async findAll(@CurrentUser() user: { id: string }): Promise<ListResponse<unknown>> {
    const data = await this.paymentMethodsService.findAll(user.id);
    return { success: true, data };
  }

  @Post()
  @ApiOperation({ summary: '카드 결제수단 등록' })
  async create(
    @CurrentUser() user: { id: string },
    @Body() dto: CreatePaymentMethodDto,
  ): Promise<BasicResponse<unknown>> {
    const data = await this.paymentMethodsService.create(user.id, dto);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: '결제수단 수정 (이름·기본 결제수단)' })
  async update(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
    @Body() dto: UpdatePaymentMethodDto,
  ): Promise<BasicResponse<unknown>> {
    const data = await this.paymentMethodsService.update(user.id, id, dto);
    return { success: true, data };
  }

  @Delete(':id')
  @ApiOperation({ summary: '카드 결제수단 삭제' })
  async remove(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
  ): Promise<BasicResponse<null>> {
    await this.paymentMethodsService.remove(user.id, id);
    return { success: true, data: null };
  }
}
