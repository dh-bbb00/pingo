import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { MSG } from '../common/constants/messages';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.category.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
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

  private async findOneOrThrow(userId: string, id: string) {
    const category = await this.prisma.category.findFirst({ where: { id, userId } });
    if (!category) throw new NotFoundException(MSG.common.notFound);
    return category;
  }
}
