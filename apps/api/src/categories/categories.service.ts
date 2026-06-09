import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DeleteCategoryDto } from './dto/delete-category.dto';
import { GetCategoriesQueryDto, CategorySortValue } from './dto/get-categories-query.dto';
import { MSG } from '../common/constants/messages';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, query: GetCategoriesQueryDto) {
    const { page, pageSize, sort } = query;
    const { year, month } = this.currentYearMonth();

    const budgetInclude = {
      monthlyBudgets: { where: { year, month }, take: 1 },
    };

    if (sort.startsWith('budget')) {
      // budget은 관계 테이블이므로 애플리케이션 레이어에서 정렬
      const all = await this.prisma.category.findMany({
        where: { userId },
        include: budgetInclude,
      });

      const mapped = all.map((c) => ({
        ...c,
        budget: c.monthlyBudgets[0]?.budget ?? null,
        monthlyBudgets: undefined,
      }));

      mapped.sort((a, b) => {
        const aVal = a.budget ?? (sort === 'budget_asc' ? Infinity : -Infinity);
        const bVal = b.budget ?? (sort === 'budget_asc' ? Infinity : -Infinity);
        return sort === 'budget_asc' ? aVal - bVal : bVal - aVal;
      });

      const total = mapped.length;
      const totalBudget = mapped.reduce((s, c) => s + (c.budget ?? 0), 0);
      const data = mapped.slice((page - 1) * pageSize, page * pageSize);

      return {
        data,
        pagination: {
          page, pageSize, total,
          totalPages: Math.ceil(total / pageSize),
          totalBudget,
        },
      };
    }

    const orderBy = this.buildOrderBy(sort);
    const [rawData, total, budgetAgg] = await Promise.all([
      this.prisma.category.findMany({
        where: { userId },
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: budgetInclude,
      }),
      this.prisma.category.count({ where: { userId } }),
      this.prisma.categoryMonthlyBudget.aggregate({
        where: { category: { userId }, year, month },
        _sum: { budget: true },
      }),
    ]);

    const data = rawData.map((c) => ({
      ...c,
      budget: c.monthlyBudgets[0]?.budget ?? null,
      monthlyBudgets: undefined,
    }));

    return {
      data,
      pagination: {
        page, pageSize, total,
        totalPages: Math.ceil(total / pageSize),
        totalBudget: budgetAgg._sum.budget ?? 0,
      },
    };
  }

  async findOne(userId: string, id: string) {
    const { year, month } = this.currentYearMonth();
    const category = await this.prisma.category.findFirst({
      where: { id, userId },
      include: { monthlyBudgets: { where: { year, month }, take: 1 } },
    });
    if (!category) throw new NotFoundException(MSG.common.notFound);

    const { monthlyBudgets, ...rest } = category;
    return { ...rest, budget: monthlyBudgets[0]?.budget ?? null };
  }

  async create(userId: string, dto: CreateCategoryDto) {
    const { budget, ...categoryData } = dto;
    const category = await this.prisma.category.create({
      data: { ...categoryData, userId },
    });

    if (budget != null) {
      await this.upsertCurrentBudget(category.id, budget);
    }

    return { ...category, budget: budget ?? null };
  }

  async update(userId: string, id: string, dto: UpdateCategoryDto) {
    await this.findOneOrThrow(userId, id);
    const { budget, ...categoryData } = dto;

    const category = await this.prisma.category.update({
      where: { id },
      data: categoryData,
    });

    if (budget === null) {
      await this.deleteCurrentBudget(id);
    } else if (budget !== undefined) {
      await this.upsertCurrentBudget(id, budget);
    }

    const { year, month } = this.currentYearMonth();
    const monthlyBudget = budget === null
      ? null
      : await this.prisma.categoryMonthlyBudget.findUnique({
          where: { categoryId_year_month: { categoryId: id, year, month } },
        });

    return { ...category, budget: monthlyBudget?.budget ?? null };
  }

  async remove(userId: string, id: string, dto: DeleteCategoryDto) {
    await this.findOneOrThrow(userId, id);

    if (dto.replaceCategoryId) {
      await this.findOneOrThrow(userId, dto.replaceCategoryId);
      await this.prisma.transaction.updateMany({
        where: { categoryId: id },
        data:  { categoryId: dto.replaceCategoryId },
      });
    }
    // replaceCategoryId 없으면 onDelete: SetNull이 자동으로 null 처리

    return this.prisma.category.delete({ where: { id } });
  }

  /** isBudgetFixed=true인 카테고리의 전월 예산을 이번 달로 복사 (매월 1일 스케줄러 호출) */
  async rolloverFixedBudgets(targetYear?: number, targetMonth?: number) {
    const now = new Date();
    const thisYear  = targetYear  ?? now.getFullYear();
    const thisMonth = targetMonth ?? now.getMonth() + 1;
    const prevYear  = thisMonth === 1 ? thisYear - 1 : thisYear;
    const prevMonth = thisMonth === 1 ? 12 : thisMonth - 1;

    const prevBudgets = await this.prisma.categoryMonthlyBudget.findMany({
      where: {
        year: prevYear,
        month: prevMonth,
        category: { isBudgetFixed: true },
      },
    });

    await Promise.all(
      prevBudgets.map((b) =>
        this.prisma.categoryMonthlyBudget.upsert({
          where: { categoryId_year_month: { categoryId: b.categoryId, year: thisYear, month: thisMonth } },
          update: { budget: b.budget },
          create: { categoryId: b.categoryId, year: thisYear, month: thisMonth, budget: b.budget },
        }),
      ),
    );

    // upsert는 항상 성공하므로 totalCount = successCount
    return { totalCount: prevBudgets.length, successCount: prevBudgets.length };
  }

  private async upsertCurrentBudget(categoryId: string, budget: number) {
    const { year, month } = this.currentYearMonth();
    return this.prisma.categoryMonthlyBudget.upsert({
      where: { categoryId_year_month: { categoryId, year, month } },
      update: { budget },
      create: { categoryId, year, month, budget },
    });
  }

  private async deleteCurrentBudget(categoryId: string) {
    const { year, month } = this.currentYearMonth();
    await this.prisma.categoryMonthlyBudget.deleteMany({
      where: { categoryId, year, month },
    });
  }

  private buildOrderBy(sort: CategorySortValue): Prisma.CategoryOrderByWithRelationInput | Prisma.CategoryOrderByWithRelationInput[] {
    switch (sort) {
      case 'name_asc':  return { name: 'asc' };
      case 'name_desc': return { name: 'desc' };
      case 'date_asc':  return { createdAt: 'asc' };
      case 'date_desc': return { createdAt: 'desc' };
      default:          return { createdAt: 'desc' };
    }
  }

  private currentYearMonth() {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
  }

  private async findOneOrThrow(userId: string, id: string) {
    const category = await this.prisma.category.findFirst({ where: { id, userId } });
    if (!category) throw new NotFoundException(MSG.common.notFound);
    return category;
  }
}
