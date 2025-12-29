import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const hashedPassword = await bcrypt.hash('demo123', 10);

  // Create or update admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      emailVerified: new Date(),
      role: 'ADMIN',
    },
  });

  // Create or update demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      password: hashedPassword,
      emailVerified: new Date(),
    },
  });

  // Create or update demo organization
  const organization = await prisma.organization.upsert({
    where: { slug: 'acme-corp' },
    update: {},
    create: {
      name: 'Acme Corporation',
      slug: 'acme-corp',
    },
  });

  // Create or update admin membership
  await prisma.membership.upsert({
    where: {
      userId_organizationId: {
        userId: admin.id,
        organizationId: organization.id,
      },
    },
    update: {},
    create: {
      userId: admin.id,
      organizationId: organization.id,
      role: 'OWNER',
    },
  });

  // Create or update demo membership
  await prisma.membership.upsert({
    where: {
      userId_organizationId: {
        userId: user.id,
        organizationId: organization.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      organizationId: organization.id,
      role: 'OWNER',
    },
  });

  console.log('✅ Seed data created');
  console.log('📧 Admin: admin@example.com / admin123');
  console.log('📧 Demo: demo@example.com / demo123');

  // ============= PICKLEBALL SEED DATA =============

  // Create or update pickleball players
  const player1 = await prisma.user.upsert({
    where: { email: 'john.player@example.com' },
    update: {},
    create: {
      email: 'john.player@example.com',
      name: 'John Smith',
      password: hashedPassword,
      emailVerified: new Date(),
    },
  });

  const player2 = await prisma.user.upsert({
    where: { email: 'jane.player@example.com' },
    update: {},
    create: {
      email: 'jane.player@example.com',
      name: 'Jane Doe',
      password: hashedPassword,
      emailVerified: new Date(),
    },
  });

  const player3 = await prisma.user.upsert({
    where: { email: 'mike.player@example.com' },
    update: {},
    create: {
      email: 'mike.player@example.com',
      name: 'Mike Johnson',
      password: hashedPassword,
      emailVerified: new Date(),
    },
  });

  const player4 = await prisma.user.upsert({
    where: { email: 'sarah.player@example.com' },
    update: {},
    create: {
      email: 'sarah.player@example.com',
      name: 'Sarah Williams',
      password: hashedPassword,
      emailVerified: new Date(),
    },
  });

  // Create or update demo club
  const club = await prisma.club.upsert({
    where: { slug: 'downtown-pickleball' },
    update: {},
    create: {
      organizationId: organization.id,
      name: 'Downtown Pickleball Club',
      slug: 'downtown-pickleball',
      address: '123 Main Street',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      phone: '(555) 123-4567',
      email: 'info@downtownpickleball.com',
      website: 'https://downtownpickleball.com',
      description: 'Premier indoor pickleball facility with 12 courts',
    },
  });

  // Create or update courts
  const court1 = await prisma.court.upsert({
    where: { id: 'default-court-1' }, // Using a fixed ID for demo
    update: {},
    create: {
      id: 'default-court-1',
      clubId: club.id,
      name: 'Court 1',
      surface: 'Indoor Hard',
      lighting: true,
      indoors: true,
    },
  });

  await prisma.court.upsert({
    where: { id: 'default-court-2' },
    update: {},
    create: {
      id: 'default-court-2',
      clubId: club.id,
      name: 'Court 2',
      surface: 'Indoor Hard',
      lighting: true,
      indoors: true,
    },
  });

  await prisma.court.upsert({
    where: { id: 'default-court-3' },
    update: {},
    create: {
      id: 'default-court-3',
      clubId: club.id,
      name: 'Court 3',
      surface: 'Indoor Hard',
      lighting: true,
      indoors: true,
    },
  });

  // Create or update players (linked to users and club)
  const p1Profile = await prisma.player.upsert({
    where: { userId: player1.id },
    update: {},
    create: {
      userId: player1.id,
      clubId: club.id,
      skillLevel: 3.5,
      skillLevelSelf: 3.5,
      phone: '(555) 111-2222',
      bio: 'Aggressive player with strong forehand',
      isActive: true,
    },
  });

  const p2Profile = await prisma.player.upsert({
    where: { userId: player2.id },
    update: {},
    create: {
      userId: player2.id,
      clubId: club.id,
      skillLevel: 4.0,
      skillLevelSelf: 4.0,
      phone: '(555) 333-4444',
      bio: 'Consistent player with excellent dinking',
      isActive: true,
    },
  });

  const p3Profile = await prisma.player.upsert({
    where: { userId: player3.id },
    update: {},
    create: {
      userId: player3.id,
      clubId: club.id,
      skillLevel: 3.0,
      skillLevelSelf: 3.0,
      phone: '(555) 555-6666',
      bio: 'Power player with fast serves',
      isActive: true,
    },
  });

  const p4Profile = await prisma.player.upsert({
    where: { userId: player4.id },
    update: {},
    create: {
      userId: player4.id,
      clubId: club.id,
      skillLevel: 3.5,
      skillLevelSelf: 3.5,
      phone: '(555) 777-8888',
      bio: 'All-court player with good volleys',
      isActive: true,
    },
  });

  // Create a doubles match
  const match = await prisma.match.create({
    data: {
      clubId: club.id,
      courtId: court1.id,
      matchType: 'DOUBLES',
      scheduledFor: new Date('2025-12-29T10:00:00'),
      startedAt: new Date('2025-12-29T10:05:00'),
      completedAt: new Date('2025-12-29T10:45:00'),
      notes: 'Competitive doubles match',
    },
  });

  // Add players to the match (Team 1: John & Sarah vs Team 2: Jane & Mike)
  await prisma.playerMatch.create({
    data: {
      matchId: match.id,
      playerId: p1Profile.id,
      team: 'TEAM1',
      position: 'FIRST',
      isWinner: true,
      score: 11,
    },
  });

  await prisma.playerMatch.create({
    data: {
      matchId: match.id,
      playerId: p4Profile.id,
      team: 'TEAM1',
      position: 'SECOND',
      isWinner: true,
      score: 11,
    },
  });

  await prisma.playerMatch.create({
    data: {
      matchId: match.id,
      playerId: p2Profile.id,
      team: 'TEAM2',
      position: 'FIRST',
      isWinner: false,
      score: 9,
    },
  });

  await prisma.playerMatch.create({
    data: {
      matchId: match.id,
      playerId: p3Profile.id,
      team: 'TEAM2',
      position: 'SECOND',
      isWinner: false,
      score: 9,
    },
  });

  // Create a league
  const league = await prisma.league.create({
    data: {
      clubId: club.id,
      name: 'Winter Doubles League 2025',
      description: 'Competitive doubles league for 3.5-4.0 players',
      leagueType: 'DOUBLES',
      status: 'ACTIVE',
      startDate: new Date('2025-01-06'),
      endDate: new Date('2025-03-15'),
    },
  });

  // Add players to league
  await prisma.leagueMembership.create({
    data: {
      leagueId: league.id,
      playerId: p1Profile.id,
    },
  });

  await prisma.leagueMembership.create({
    data: {
      leagueId: league.id,
      playerId: p2Profile.id,
    },
  });

  await prisma.leagueMembership.create({
    data: {
      leagueId: league.id,
      playerId: p3Profile.id,
    },
  });

  await prisma.leagueMembership.create({
    data: {
      leagueId: league.id,
      playerId: p4Profile.id,
    },
  });

  console.log('');
  console.log('🎾 Pickleball seed data created');
  console.log(`🏟️  Club: ${club.name}`);
  console.log(`🏓  Courts: 3`);
  console.log(`👥 Players: 4`);
  console.log(`🏆 Matches: 1 doubles match`);
  console.log(`📊 Leagues: 1 active league`);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
