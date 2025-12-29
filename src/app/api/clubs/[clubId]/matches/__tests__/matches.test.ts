/**
 * Matches API Route Tests
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

describe('/api/clubs/[clubId]/matches', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  describe('POST /api/clubs/[clubId]/matches', () => {
    it('should create a singles match', async () => {
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

      const player1 = await createTestPlayer({
        clubId: club.id,
        userId: user.id,
      });

      const player2User = await createTestUser({
        email: 'player2@example.com',
      });
      const player2 = await createTestPlayer({
        clubId: club.id,
        userId: player2User.id,
      });

      const matchData = {
        matchType: 'SINGLES',
        completedAt: new Date().toISOString(),
        playerMatches: [
          {
            playerId: player1.id,
            team: 'TEAM1',
            isWinner: true,
            score: 11,
          },
          {
            playerId: player2.id,
            team: 'TEAM2',
            isWinner: false,
            score: 9,
          },
        ],
      };

      const response = await fetch(`http://localhost:3000/api/clubs/${club.id}/matches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(matchData),
      });

      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.match).toBeDefined();
      expect(data.match.matchType).toBe('SINGLES');
      expect(data.match.playerMatches).toHaveLength(2);
    });

    it('should create a doubles match with positions', async () => {
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

      const players = [];
      for (let i = 0; i < 4; i++) {
        const playerUser = await createTestUser({
          email: `player${i}@example.com`,
        });
        players.push(
          await createTestPlayer({
            clubId: club.id,
            userId: playerUser.id,
          })
        );
      }

      const matchData = {
        matchType: 'DOUBLES',
        completedAt: new Date().toISOString(),
        playerMatches: [
          {
            playerId: players[0].id,
            team: 'TEAM1',
            position: 'FIRST',
            isWinner: true,
            score: 11,
          },
          {
            playerId: players[1].id,
            team: 'TEAM1',
            position: 'SECOND',
            isWinner: true,
            score: 11,
          },
          {
            playerId: players[2].id,
            team: 'TEAM2',
            position: 'FIRST',
            isWinner: false,
            score: 9,
          },
          {
            playerId: players[3].id,
            team: 'TEAM2',
            position: 'SECOND',
            isWinner: false,
            score: 9,
          },
        ],
      };

      const response = await fetch(`http://localhost:3000/api/clubs/${club.id}/matches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(matchData),
      });

      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.match.playerMatches).toHaveLength(4);

      // Verify positions
      const team1First = data.match.playerMatches.find(
        (pm: any) => pm.team === 'TEAM1' && pm.position === 'FIRST'
      );
      const team1Second = data.match.playerMatches.find(
        (pm: any) => pm.team === 'TEAM1' && pm.position === 'SECOND'
      );

      expect(team1First).toBeDefined();
      expect(team1Second).toBeDefined();
    });

    it('should reject match with unbalanced teams', async () => {
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

      const player1 = await createTestPlayer({
        clubId: club.id,
        userId: user.id,
      });

      const player2User = await createTestUser({
        email: 'player2@example.com',
      });
      const player2 = await createTestPlayer({
        clubId: club.id,
        userId: player2User.id,
      });

      const matchData = {
        matchType: 'DOUBLES',
        completedAt: new Date().toISOString(),
        playerMatches: [
          {
            playerId: player1.id,
            team: 'TEAM1',
            position: 'FIRST',
            isWinner: true,
            score: 11,
          },
          {
            playerId: player2.id,
            team: 'TEAM2',
            position: 'FIRST',
            isWinner: false,
            score: 9,
          },
          // Missing TEAM1 SECOND and TEAM2 SECOND
        ],
      };

      const response = await fetch(`http://localhost:3000/api/clubs/${club.id}/matches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(matchData),
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('team');
    });

    it('should require admin to create matches', async () => {
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
        },
        body: JSON.stringify(matchData),
      });

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/clubs/[clubId]/matches', () => {
    it('should list matches for a club', async () => {
      const user = await createTestUser();
      const org = await createTestOrganization();
      await createTestMembership({
        userId: user.id,
        organizationId: org.id,
        role: 'MEMBER',
      });

      const club = await createTestClub({
        organizationId: org.id,
      });

      const player = await createTestPlayer({
        clubId: club.id,
        userId: user.id,
      });

      // Create a test match
      await prisma.match.create({
        data: {
          clubId: club.id,
          matchType: 'SINGLES',
          completedAt: new Date(),
          playerMatches: {
            create: {
              playerId: player.id,
              team: 'TEAM1',
              isWinner: true,
              score: 11,
            },
          },
        },
      });

      const response = await fetch(`http://localhost:3000/api/clubs/${club.id}/matches`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.matches).toBeDefined();
      expect(data.matches.length).toBe(1);
    });

    it('should support pagination', async () => {
      const user = await createTestUser();
      const org = await createTestOrganization();
      await createTestMembership({
        userId: user.id,
        organizationId: org.id,
        role: 'MEMBER',
      });

      const club = await createTestClub({
        organizationId: org.id,
      });

      const player = await createTestPlayer({
        clubId: club.id,
        userId: user.id,
      });

      // Create 25 matches
      for (let i = 0; i < 25; i++) {
        await prisma.match.create({
          data: {
            clubId: club.id,
            matchType: 'SINGLES',
            completedAt: new Date(),
            playerMatches: {
              create: {
                playerId: player.id,
                team: 'TEAM1',
                isWinner: true,
                score: 11,
              },
            },
          },
        });
      }

      // Request first page
      const response = await fetch(
        `http://localhost:3000/api/clubs/${club.id}/matches?limit=20&offset=0`
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.matches.length).toBe(20);
      expect(data.total).toBe(25);
    });
  });
});
