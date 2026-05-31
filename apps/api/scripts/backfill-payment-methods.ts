/**
 * 결제수단 기능 추가 이전에 승인된 계정에 현금·상품권 결제수단을 일괄 생성합니다.
 * 이미 존재하는 경우 건너뜁니다.
 *
 * 실행: pnpm --filter @pingo/api exec ts-node -r tsconfig-paths/register scripts/backfill-payment-methods.ts
 */
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

async function main() {
  const pool    = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma  = new PrismaClient({ adapter } as any);

  const approvedUsers = await prisma.user.findMany({
    where:  { status: 'APPROVED', role: 'USER' },
    select: { id: true, email: true },
  });

  console.log(`승인된 유저 ${approvedUsers.length}명 확인`);

  let created = 0;

  for (const user of approvedUsers) {
    const existing = await prisma.paymentMethod.findMany({
      where: { userId: user.id, type: { in: ['CASH', 'GIFT_CARD'] } },
      select: { type: true },
    });

    const existingTypes = existing.map(m => m.type);
    const toCreate = [];

    if (!existingTypes.includes('CASH'))      toCreate.push({ userId: user.id, type: 'CASH'      as const, name: '현금' });
    if (!existingTypes.includes('GIFT_CARD')) toCreate.push({ userId: user.id, type: 'GIFT_CARD' as const, name: '상품권' });

    if (toCreate.length > 0) {
      await prisma.paymentMethod.createMany({ data: toCreate });
      console.log(`  ${user.email}: ${toCreate.map(m => m.name).join(', ')} 생성`);
      created += toCreate.length;
    } else {
      console.log(`  ${user.email}: 이미 존재 (스킵)`);
    }
  }

  console.log(`\n완료 — 총 ${created}개 생성`);
  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
