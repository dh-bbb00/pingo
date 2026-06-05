import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FixedExpensesService } from './fixed-expenses.service';
import { CreateFixedExpenseDto } from './dto/create-fixed-expense.dto';
import { UpdateFixedExpenseDto } from './dto/update-fixed-expense.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { BasicResponse, ListResponse } from '../common/types/response.type';

@ApiTags('Fixed Expenses')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('fixed-expenses')
export class FixedExpensesController {
  constructor(private readonly fixedExpensesService: FixedExpensesService) {}

  @Get()
  @ApiOperation({ summary: '고정 지출 목록' })
  async findAll(
    @CurrentUser() user: { id: string },
  ): Promise<ListResponse<unknown>> {
    const data = await this.fixedExpensesService.findAll(user.id);
    return { success: true, data };
  }

  @Post()
  @ApiOperation({ summary: '고정 지출 등록' })
  async create(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateFixedExpenseDto,
  ): Promise<BasicResponse<unknown>> {
    const data = await this.fixedExpensesService.create(user.id, dto);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: '고정 지출 수정' })
  async update(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
    @Body() dto: UpdateFixedExpenseDto,
  ): Promise<BasicResponse<unknown>> {
    const data = await this.fixedExpensesService.update(user.id, id, dto);
    return { success: true, data };
  }

  @Get(':id/this-month-status')
  @ApiOperation({ summary: '이번 달 고정 지출 등록 여부 확인' })
  async getThisMonthStatus(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
  ): Promise<BasicResponse<{ registered: boolean }>> {
    const data = await this.fixedExpensesService.getThisMonthStatus(user.id, id);
    return { success: true, data };
  }

  @Post(':id/register-this-month')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '이번 달 고정 지출 즉시 등록' })
  async registerThisMonth(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
  ): Promise<BasicResponse<unknown>> {
    const data = await this.fixedExpensesService.registerThisMonthTransaction(user.id, id);
    return { success: true, data };
  }

  @Delete(':id')
  @ApiOperation({ summary: '고정 지출 삭제' })
  async remove(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
  ): Promise<BasicResponse<null>> {
    await this.fixedExpensesService.remove(user.id, id);
    return { success: true, data: null };
  }
}
