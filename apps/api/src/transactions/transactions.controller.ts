import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionFilterDto } from './dto/transaction-filter.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { BasicResponse } from '../common/types/response.type';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  /** 날짜 내림차순 정렬. 클라이언트에서 날짜별 그룹핑 처리 */
  @Get()
  @ApiOperation({ summary: '내역 목록 (페이지네이션 + 필터)' })
  async findAll(
    @CurrentUser() user: { id: string },
    @Query() filter: TransactionFilterDto,
  ) {
    const { data, total, page, pageSize, totalPages, totalAmount } =
      await this.transactionsService.findAll(user.id, filter);
    return { success: true, data, pagination: { page, pageSize, total, totalPages, totalAmount } };
  }

  @Get(':id')
  @ApiOperation({ summary: '내역 단건 조회' })
  async findOne(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
  ): Promise<BasicResponse<unknown>> {
    const data = await this.transactionsService.findOne(user.id, id);
    return { success: true, data };
  }

  @Post()
  @ApiOperation({ summary: '내역 추가' })
  async create(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateTransactionDto,
  ): Promise<BasicResponse<unknown>> {
    const data = await this.transactionsService.create(user.id, dto);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: '내역 수정' })
  async update(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
    @Body() dto: UpdateTransactionDto,
  ): Promise<BasicResponse<unknown>> {
    const data = await this.transactionsService.update(user.id, id, dto);
    return { success: true, data };
  }

  @Delete(':id')
  @ApiOperation({ summary: '내역 삭제' })
  async remove(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
  ): Promise<BasicResponse<null>> {
    await this.transactionsService.remove(user.id, id);
    return { success: true, data: null };
  }
}
