import { IsInt, IsIn, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { VM } from '../../common/constants/validation-messages';

const SORT_VALUES = ['budget_asc', 'budget_desc', 'name_asc', 'name_desc', 'date_asc', 'date_desc'] as const;
export type CategorySortValue = typeof SORT_VALUES[number];

export class GetCategoriesQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: VM.number })
  @Min(1, { message: VM.min(1) })
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: VM.number })
  @Min(1, { message: VM.min(1) })
  pageSize = 20;

  @IsOptional()
  @IsIn(SORT_VALUES, { message: VM.invalid })
  sort: CategorySortValue = 'date_desc';
}
