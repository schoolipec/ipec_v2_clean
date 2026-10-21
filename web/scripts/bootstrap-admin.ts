/**
 * Script de bootstrap: crea el primer SuperAdmin.
 * Uso: npx tsx scripts/bootstrap-admin.ts
 *
 * Variables de entorno requeridas en .env:
 *   INITIAL_SUPERADMIN_EMAIL
 *   INITIAL_SUPERADMIN_PASSWORD
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.INITIAL_SUPERADMIN_EMAIL;
  const password = process.env.INITIAL_SUPERADMIN_PASSWORD;

  if (!email || !password) {
    console.error('❌ Falta INITIAL_SUPERADMIN_EMAIL o INITIAL_SUPERADMIN_PASSWORD en .env');
    process.exit(1);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`ℹ️  Ya existe un usuario con email: ${email}`);
    await prisma.$disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name: 'Super Admin',
      passwordHash,
      role: 'SUPER_ADMIN',
      mustChangePassword: false,
    },
  });

  console.log(`✅ SuperAdmin creado: ${user.email} (id: ${user.id})`);
  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
