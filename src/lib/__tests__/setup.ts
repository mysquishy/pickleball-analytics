import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Test database utilities
 */

export async function clearDatabase() {
  // Delete in order of dependencies
  await prisma.playerMatch.deleteMany({});
  await prisma.match.deleteMany({});
  await prisma.leagueMembership.deleteMany({});
  await prisma.league.deleteMany({});
  await prisma.player.deleteMany({});
  await prisma.court.deleteMany({});
  await prisma.club.deleteMany({});
  await prisma.membership.deleteMany({});
  await prisma.organization.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
}

export async function createTestUser(overrides: any = {}) {
  return prisma.user.create({
    data: {
      email: overrides.email || `test-${Date.now()}@example.com`,
      name: overrides.name || 'Test User',
      image: overrides.image || null,
      ...overrides,
    },
  });
}

export async function createTestOrganization(overrides: any = {}) {
  return prisma.organization.create({
    data: {
      name: overrides.name || `Test Org ${Date.now()}`,
      slug: overrides.slug || `test-org-${Date.now()}`,
      ...overrides,
    },
  });
}

export async function createTestClub(data: {
  organizationId: string;
  name?: string;
  slug?: string;
}) {
  return prisma.club.create({
    data: {
      organizationId: data.organizationId,
      name: data.name || `Test Club ${Date.now()}`,
      slug: data.slug || `test-club-${Date.now()}`,
      address: '123 Test St',
      city: 'Test City',
      state: 'TS',
      zipCode: '12345',
    },
  });
}

export async function createTestPlayer(data: {
  clubId: string;
  userId: string;
  skillLevel?: number;
}) {
  return prisma.player.create({
    data: {
      clubId: data.clubId,
      userId: data.userId,
      skillLevel: data.skillLevel || 3.0,
      isActive: true,
    },
  });
}

export async function createTestMembership(data: {
  userId: string;
  organizationId: string;
  role?: 'OWNER' | 'ADMIN' | 'MEMBER';
}) {
  return prisma.membership.create({
    data: {
      userId: data.userId,
      organizationId: data.organizationId,
      role: data.role || 'MEMBER',
    },
  });
}

afterAll(async () => {
  await prisma.$disconnect();
});
