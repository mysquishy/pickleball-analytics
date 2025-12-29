import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      emailVerified: new Date(),
      role: 'ADMIN',
    },
  });

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      name: 'Demo User',
      password: hashedPassword,
      emailVerified: new Date(),
    },
  });

  // Create demo organization
  const organization = await prisma.organization.create({
    data: {
      name: 'Acme Corporation',
      slug: 'acme-corp',
    },
  });

  // Create admin membership
  await prisma.membership.create({
    data: {
      userId: admin.id,
      organizationId: organization.id,
      role: 'OWNER',
    },
  });

  // Create demo membership
  await prisma.membership.create({
    data: {
      userId: user.id,
      organizationId: organization.id,
      role: 'OWNER',
    },
  });

  console.log('✅ Seed data created');
  console.log('📧 Admin: admin@example.com / admin123');
  console.log('📧 Demo: demo@example.com / demo123');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
