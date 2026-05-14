import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcryptjs';

async function main() {
  const pool = new Pool({ connectionString: process.env['DATABASE_URL'] });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  const email = process.env['ADMIN_EMAIL'];
  const password = process.env['ADMIN_PASSWORD'];
  const deviceUid = process.env['ADMIN_DEVICE_UID'];

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
  }

  const hashed = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashed,
      role: 'ADMIN',
      status: 'APPROVED',
    },
  });

  console.log(`Admin account ready: ${email}`);

  if (deviceUid) {
    await prisma.device.upsert({
      where: { userId_deviceUid: { userId: admin.id, deviceUid } },
      update: { isTrusted: true },
      create: {
        userId: admin.id,
        deviceUid,
        deviceName: 'Admin Device',
        phoneModel: 'Dev',
        osVersion: 'Dev',
        appVersion: '1.0.0',
        isTrusted: true,
      },
    });
    console.log(`Admin device registered: ${deviceUid}`);
  } else {
    console.log('ADMIN_DEVICE_UID not set — skipping device registration');
  }

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
