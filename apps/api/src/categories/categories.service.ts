import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DeleteCategoryDto } from './dto/delete-category.dto';
import { GetCategoriesQueryDto, CategorySortValue } from './dto/get-categories-query.dto';
import { MSG } from '../common/constants/messages';
import { ApiErrorCode } from '../common/constants/error-codes';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 카테고리 목록 조회 (페이지네이션 + 이번 달 예산 포함)
   *
   * budget 정렬은 Prisma orderBy가 관계 집계를 지원하지 않아
   * 전체를 메모리에 올린 뒤 애플리케이션 레이어에서 정렬한다.
   * 그 외 정렬(이름·날짜)은 DB 쿼리에서 직접 처리한다.
   */
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

      // 예산 미설정 항목은 오름차순 시 맨 뒤, 내림차순 시 맨 앞으로 배치
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

    // budget 외 정렬: DB 쿼리 + count + 전체 예산 합계를 병렬 조회
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

    // monthlyBudgets 관계 필드를 제거하고 budget 스칼라로 평탄화
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

  /** 카테고리 단건 조회 (이번 달 예산 포함) */
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

  /**
   * 카테고리 생성
   * budget이 함께 전달되면 이번 달 예산도 같이 등록한다.
   */
  async create(userId: string, dto: CreateCategoryDto) {
    const count = await this.prisma.category.count({ where: { userId } });
    if (count >= 20) {
      throw new ConflictException({ errorCode: ApiErrorCode.CATEGORY_LIMIT_EXCEEDED, message: MSG.category.limitExceeded });
    }

    const { budget, ...categoryData } = dto;
    const category = await this.prisma.category.create({
      data: { ...categoryData, userId },
    });

    if (budget != null) {
      await this.upsertCurrentBudget(category.id, budget);
    }

    return { ...category, budget: budget ?? null };
  }

  /**
   * 카테고리 수정
   * budget=null → 이번 달 예산 삭제
   * budget=숫자 → 이번 달 예산 upsert
   * budget=undefined(미전달) → 예산 변경 없음
   */
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

  /**
   * 카테고리 삭제
   * replaceCategoryId가 있으면 해당 카테고리로 거래 내역을 이전한 뒤 삭제.
   * 없으면 스키마의 onDelete: SetNull이 거래 내역의 categoryId를 null로 처리한다.
   */
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

  /** 이번 달 예산 upsert — create/update 공통 처리 */
  private async upsertCurrentBudget(categoryId: string, budget: number) {
    const { year, month } = this.currentYearMonth();
    return this.prisma.categoryMonthlyBudget.upsert({
      where: { categoryId_year_month: { categoryId, year, month } },
      update: { budget },
      create: { categoryId, year, month, budget },
    });
  }

  /** 이번 달 예산 삭제 (budget=null 전달 시 호출) */
  private async deleteCurrentBudget(categoryId: string) {
    const { year, month } = this.currentYearMonth();
    await this.prisma.categoryMonthlyBudget.deleteMany({
      where: { categoryId, year, month },
    });
  }

  /** budget 정렬 이외의 정렬 기준을 Prisma orderBy 형태로 변환 */
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

  /** 존재하지 않으면 404, 반환값은 이후 로직에서 소유권 확인에 활용 */
  private async findOneOrThrow(userId: string, id: string) {
    const category = await this.prisma.category.findFirst({ where: { id, userId } });
    if (!category) throw new NotFoundException(MSG.common.notFound);
    return category;
  }
}
