import { PartialType } from '@nestjs/swagger';
import { CreateFixedExpenseDto } from './create-fixed-expense.dto';

/** 고정 지출 수정 DTO — 모든 필드 optional */
export class UpdateFixedExpenseDto extends PartialType(CreateFixedExpenseDto) {}
