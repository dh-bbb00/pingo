import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { BasicResponse, ListResponse } from '../common/types/response.type';

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: '카테고리 목록' })
  async findAll(
    @CurrentUser() user: { id: string },
  ): Promise<ListResponse<unknown>> {
    const data = await this.categoriesService.findAll(user.id);
    return { success: true, data };
  }

  @Post()
  @ApiOperation({ summary: '카테고리 생성' })
  async create(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateCategoryDto,
  ): Promise<BasicResponse<unknown>> {
    const data = await this.categoriesService.create(user.id, dto);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: '카테고리 수정' })
  async update(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<BasicResponse<unknown>> {
    const data = await this.categoriesService.update(user.id, id, dto);
    return { success: true, data };
  }

  @Delete(':id')
  @ApiOperation({ summary: '카테고리 삭제' })
  async remove(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
  ): Promise<BasicResponse<null>> {
    await this.categoriesService.remove(user.id, id);
    return { success: true, data: null };
  }
}
