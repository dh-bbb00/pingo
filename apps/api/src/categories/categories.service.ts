import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { GetCategoriesQueryDto, CategorySortValue } from './dto/get-categories-query.dto';
import { MSG } from '../common/constants/messages';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, query: GetCategoriesQueryDto) {
    const { page, pageSize, sort } = query;
    const orderBy = this.buildOrderBy(sort);

    const [data, total, agg] = await Promise.all([
      this.prisma.category.findMany({
        where: { userId },
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.category.count({ where: { userId } }),
      this.prisma.category.aggregate({
        where: { userId },
        _sum: { budget: true },
      }),
    ]);

    return {
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        totalBudget: agg._sum.budget ?? 0,
      },
    };
  }

  async findOne(userId: string, id: string) {
    return this.findOneOrThrow(userId, id);
  }

  create(userId: string, dto: CreateCategoryDto) {
    return this.prisma.category.create({ data: { ...dto, userId } });
  }

  async update(userId: string, id: string, dto: UpdateCategoryDto) {
    await this.findOneOrThrow(userId, id);
    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async remove(userId: string, id: string) {
    await this.findOneOrThrow(userId, id);
    return this.prisma.category.delete({ where: { id } });
  }

  private buildOrderBy(sort: CategorySortValue): Prisma.CategoryOrderByWithRelationInput | Prisma.CategoryOrderByWithRelationInput[] {
    switch (sort) {
      case 'budget_asc':  return [{ budget: { sort: 'asc',  nulls: 'last' } }, { name: 'asc' }];
      case 'budget_desc': return [{ budget: { sort: 'desc', nulls: 'last' } }, { name: 'asc' }];
      case 'name_asc':    return { name: 'asc' };
      case 'name_desc':   return { name: 'desc' };
      case 'date_asc':    return { createdAt: 'asc' };
      case 'date_desc':   return { createdAt: 'desc' };
    }
  }

  private async findOneOrThrow(userId: string, id: string) {
    const category = await this.prisma.category.findFirst({ where: { id, userId } });
    if (!category) throw new NotFoundException(MSG.common.notFound);
    return category;
  }
}
