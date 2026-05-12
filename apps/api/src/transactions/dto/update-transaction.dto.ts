import { PartialType } from '@nestjs/swagger';
import { CreateTransactionDto } from './create-transaction.dto';

/** 내역 수정 DTO — 모든 필드 optional */
export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}
