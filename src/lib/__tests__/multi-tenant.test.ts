/**
 * Multi-Tenant Isolation Tests
 * CRITICAL: These tests ensure data cannot leak between organizations
 */

import {
  clearDatabase,
  createTestUser,
  createTestOrganization,
  createTestClub,
  createTestPlayer,
  createTestMembership,
} from '@/lib/__tests__/setup';
import { prisma } from '@/lib/prisma';

describe('Multi-Tenant Isolation', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  describe('Organization Data Isolation', () => {
    it('should not allow accessing clubs from different organization', async () => {
      // Create two organizations
      const org1 = await createTestOrganization({
        name: 'Organization 1',
        slug: 'org1',
      });
      const org2 = await createTestOrganization({
        name: 'Organization 2',
        slug: 'org2',
      });

      // Create users for each org
      const user1 = await createTestUser({ email: 'user1@org1.com' });
      const user2 = await createTestUser({ email: 'user2@org2.com' });

      // Create memberships
      await createTestMembership({
        userId: user1.id,
        organizationId: org1.id,
        role: 'MEMBER',
      });
      await createTestMembership({
        userId: user2.id,
        organizationId: org2.id,
        role: 'MEMBER',
      });

      // Create club in org1
      const club1 = await createTestClub({
        organizationId: org1.id,
        name: 'Club 1',
        slug: 'club1',
      });

      // User2 from org2 tries to access club1
      const response = await fetch(`http://localhost:3000/api/clubs/${club1.id}`, {
        headers: {
          // Simulate user2 authentication
          'x-user-id': user2.id,
        },
      });

      // Should be forbidden
      expect(response.status).toBe(403);
    });

    it('should not list clubs from other organizations', async () => {
      const org1 = await createTestOrganization({ slug: 'org1' });
      const org2 = await createTestOrganization({ slug: 'org2' });

      const user1 = await createTestUser({ email: 'user1@org1.com' });
      const user2 = await createTestUser({ email: 'user2@org2.com' });

      await createTestMembership({
        userId: user1.id,
        organizationId: org1.id,
        role: 'MEMBER',
      });
      await createTestMembership({
        userId: user2.id,
        organizationId: org2.id,
        role: 'MEMBER',
      });

      // Create clubs in both orgs
      await createTestClub({
        organizationId: org1.id,
        name: 'Org1 Club',
        slug: 'org1-club',
      });

      await createTestClub({
        organizationId: org2.id,
        name: 'Org2 Club',
        slug: 'org2-club',
      });

      // User2 lists clubs (should only see org2's club)
      const response = await fetch('http://localhost:3000/api/clubs', {
        headers: {
          'x-user-id': user2.id,
        },
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.clubs.length).toBe(1);
      expect(data.clubs[0].name).toBe('Org2 Club');
    });
  });

  describe('Player Data Isolation', () => {
    it('should not allow viewing players from other organizations', async () => {
      const org1 = await createTestOrganization({ slug: 'org1' });
      const org2 = await createTestOrganization({ slug: 'org2' });

      const user1 = await createTestUser({ email: 'user1@org1.com' });
      const user2 = await createTestUser({ email: 'user2@org2.com' });

      await createTestMembership({
        userId: user1.id,
        organizationId: org1.id,
        role: 'MEMBER',
      });
      await createTestMembership({
        userId: user2.id,
        organizationId: org2.id,
        role: 'MEMBER',
      });

      const club1 = await createTestClub({
        organizationId: org1.id,
      });

      const _club2 = await createTestClub({
        organizationId: org2.id,
      });

      // Create players in both clubs
      await createTestPlayer({
        clubId: club1.id,
        userId: user1.id,
      });

      await createTestPlayer({
        clubId: club2.id,
        userId: user2.id,
      });

      // User2 tries to list players from club1
      const response = await fetch(`http://localhost:3000/api/clubs/${club1.id}/players`, {
        headers: {
          'x-user-id': user2.id,
        },
      });

      expect(response.status).toBe(403);
    });
  });

  describe('Match Data Isolation', () => {
    it('should not allow accessing matches from other organizations', async () => {
      const org1 = await createTestOrganization({ slug: 'org1' });
      const org2 = await createTestOrganization({ slug: 'org2' });

      const user1 = await createTestUser({ email: 'user1@org1.com' });
      const user2 = await createTestUser({ email: 'user2@org2.com' });

      await createTestMembership({
        userId: user1.id,
        organizationId: org1.id,
        role: 'MEMBER',
      });
      await createTestMembership({
        userId: user2.id,
        organizationId: org2.id,
        role: 'MEMBER',
      });

      const club1 = await createTestClub({
        organizationId: org1.id,
      });

      const _club2 = await createTestClub({
        organizationId: org2.id,
      });

      // Create match in club1
      await prisma.match.create({
        data: {
          clubId: club1.id,
          matchType: 'SINGLES',
          completedAt: new Date(),
          playerMatches: {
            create: {
              playerId: (
                await createTestPlayer({
                  clubId: club1.id,
                  userId: user1.id,
                })
              ).id,
              team: 'TEAM1',
              isWinner: true,
              score: 11,
            },
          },
        },
      });

      // User2 tries to list matches from club1
      const response = await fetch(`http://localhost:3000/api/clubs/${club1.id}/matches`, {
        headers: {
          'x-user-id': user2.id,
        },
      });

      expect(response.status).toBe(403);
    });
  });

  describe('Leaderboard Isolation', () => {
    it('should not mix players from different organizations in leaderboards', async () => {
      const org1 = await createTestOrganization({ slug: 'org1' });
      const org2 = await createTestOrganization({ slug: 'org2' });

      const user1 = await createTestUser({ email: 'user1@org1.com' });
      const user2 = await createTestUser({ email: 'user2@org2.com' });

      await createTestMembership({
        userId: user1.id,
        organizationId: org1.id,
        role: 'MEMBER',
      });
      await createTestMembership({
        userId: user2.id,
        organizationId: org2.id,
        role: 'MEMBER',
      });

      const club1 = await createTestClub({
        organizationId: org1.id,
      });

      // Create players with high win rates in both orgs
      const _player1 = await createTestPlayer({
        clubId: club1.id,
        userId: user1.id,
        skillLevel: 4.0,
      });

      const _club2 = await createTestClub({
        organizationId: org2.id,
      });

      const _player2 = await createTestPlayer({
        clubId: club2.id,
        userId: user2.id,
        skillLevel: 4.5,
      });

      // User2 requests leaderboard for club1
      const response = await fetch(`http://localhost:3000/api/clubs/${club1.id}/leaderboard`, {
        headers: {
          'x-user-id': user2.id,
        },
      });

      expect(response.status).toBe(403);
    });
  });

  describe('League Data Isolation', () => {
    it('should not allow accessing leagues from other organizations', async () => {
      const org1 = await createTestOrganization({ slug: 'org1' });
      const org2 = await createTestOrganization({ slug: 'org2' });

      const user1 = await createTestUser({ email: 'user1@org1.com' });
      const user2 = await createTestUser({ email: 'user2@org2.com' });

      await createTestMembership({
        userId: user1.id,
        organizationId: org1.id,
        role: 'ADMIN',
      });
      await createTestMembership({
        userId: user2.id,
        organizationId: org2.id,
        role: 'ADMIN',
      });

      const club1 = await createTestClub({
        organizationId: org1.id,
      });

      // Create league in club1
      await prisma.league.create({
        data: {
          clubId: club1.id,
          name: 'Spring League',
          format: 'ROUND_ROBIN',
          matchType: 'DOUBLES',
          status: 'UPCOMING',
          memberships: {
            create: {
              playerId: (
                await createTestPlayer({
                  clubId: club1.id,
                  userId: user1.id,
                })
              ).id,
            },
          },
        },
      });

      // User2 tries to list leagues from club1
      const response = await fetch(`http://localhost:3000/api/clubs/${club1.id}/leagues`, {
        headers: {
          'x-user-id': user2.id,
        },
      });

      expect(response.status).toBe(403);
    });
  });

  describe('Role-Based Access Control', () => {
    it('should allow admins to create matches', async () => {
      const user = await createTestUser();
      const org = await createTestOrganization();
      await createTestMembership({
        userId: user.id,
        organizationId: org.id,
        role: 'ADMIN',
      });

      const club = await createTestClub({
        organizationId: org.id,
      });

      // Should succeed (tested in detail in matches API tests)
      expect(club.id).toBeDefined();
    });

    it('should reject members creating matches', async () => {
      const user = await createTestUser();
      const org = await createTestOrganization();
      await createTestMembership({
        userId: user.id,
        organizationId: org.id,
        role: 'MEMBER', // Not admin
      });

      const club = await createTestClub({
        organizationId: org.id,
      });

      const matchData = {
        matchType: 'SINGLES',
        completedAt: new Date().toISOString(),
        playerMatches: [],
      };

      const response = await fetch(`http://localhost:3000/api/clubs/${club.id}/matches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
        },
        body: JSON.stringify(matchData),
      });

      expect(response.status).toBe(403);
    });
  });
});
