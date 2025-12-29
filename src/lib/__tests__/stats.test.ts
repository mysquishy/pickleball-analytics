/**
 * Stats Calculation Tests
 * Verify win rates, leaderboards, and standings are calculated correctly
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

describe('Stats Calculations', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  describe('Win Rate Calculations', () => {
    it('should calculate correct win rate for player', async () => {
      const user = await createTestUser();
      const _org = await createTestOrganization();
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

      // Create 10 matches: 7 wins, 3 losses
      for (let i = 0; i < 10; i++) {
        const _match = await prisma.match.create({
          data: {
            clubId: club.id,
            matchType: 'SINGLES',
            completedAt: new Date(),
          },
        });

        await prisma.playerMatch.create({
          data: {
            playerId: player.id,
            matchId: match.id,
            team: 'TEAM1',
            isWinner: i < 7, // First 7 are wins
            score: i < 7 ? 11 : 9,
          },
        });
      }

      const playerMatches = await prisma.playerMatch.findMany({
        where: { playerId: player.id },
      });

      const totalMatches = playerMatches.length;
      const wins = playerMatches.filter((pm) => pm.isWinner).length;
      const winRate = (wins / totalMatches) * 100;

      expect(totalMatches).toBe(10);
      expect(wins).toBe(7);
      expect(winRate).toBe(70.0);
    });

    it('should handle zero matches gracefully', async () => {
      const user = await createTestUser();
      const _org = await createTestOrganization();
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

      const playerMatches = await prisma.playerMatch.findMany({
        where: { playerId: player.id },
      });

      const totalMatches = playerMatches.length;
      const wins = playerMatches.filter((pm) => pm.isWinner).length;
      const winRate = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;

      expect(totalMatches).toBe(0);
      expect(wins).toBe(0);
      expect(winRate).toBe(0);
    });
  });

  describe('Leaderboard Rankings', () => {
    it('should rank players by win rate (with minimum matches)', async () => {
      const user1 = await createTestUser({ email: 'user1@example.com' });
      const user2 = await createTestUser({ email: 'user2@example.com' });
      const user3 = await createTestUser({ email: 'user3@example.com' });

      const _org = await createTestOrganization();
      await createTestMembership({
        userId: user1.id,
        organizationId: org.id,
        role: 'MEMBER',
      });

      const club = await createTestClub({
        organizationId: org.id,
      });

      const player1 = await createTestPlayer({
        clubId: club.id,
        userId: user1.id,
      });
      const player2 = await createTestPlayer({
        clubId: club.id,
        userId: user2.id,
      });
      const player3 = await createTestPlayer({
        clubId: club.id,
        userId: user3.id,
      });

      // Player1: 5 wins, 0 losses (100% win rate)
      for (let i = 0; i < 5; i++) {
        const _match = await prisma.match.create({
          data: {
            clubId: club.id,
            matchType: 'SINGLES',
            completedAt: new Date(),
          },
        });

        await prisma.playerMatch.create({
          data: {
            playerId: player1.id,
            matchId: match.id,
            team: 'TEAM1',
            isWinner: true,
            score: 11,
          },
        });
      }

      // Player2: 3 wins, 2 losses (60% win rate)
      for (let i = 0; i < 5; i++) {
        const _match = await prisma.match.create({
          data: {
            clubId: club.id,
            matchType: 'SINGLES',
            completedAt: new Date(),
          },
        });

        await prisma.playerMatch.create({
          data: {
            playerId: player2.id,
            matchId: match.id,
            team: 'TEAM1',
            isWinner: i < 3,
            score: i < 3 ? 11 : 9,
          },
        });
      }

      // Player3: Only 2 matches (should not qualify for leaderboard with 5-match minimum)

      for (let i = 0; i < 2; i++) {
        const _match = await prisma.match.create({
          data: {
            clubId: club.id,
            matchType: 'SINGLES',
            completedAt: new Date(),
          },
        });

        await prisma.playerMatch.create({
          data: {
            playerId: player3.id,
            matchId: match.id,
            team: 'TEAM1',
            isWinner: true,
            score: 11,
          },
        });
      }

      // Leaderboard should only have player1 and player2
      const players = await prisma.player.findMany({
        where: { clubId: club.id, isActive: true },
      });

      const leaderboard = await Promise.all(
        players.map(async (player) => {
          const playerMatches = await prisma.playerMatch.findMany({
            where: { playerId: player.id },
          });

          const totalMatches = playerMatches.length;
          const wins = playerMatches.filter((pm) => pm.isWinner).length;
          const winRate = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;

          return {
            playerId: player.id,
            totalMatches,
            wins,
            winRate,
          };
        })
      );

      const qualifiedPlayers = leaderboard.filter((p) => p.totalMatches >= 5);
      qualifiedPlayers.sort((a, b) => b.winRate - a.winRate);

      expect(qualifiedPlayers.length).toBe(2);
      expect(qualifiedPlayers[0].playerId).toBe(player1.id);
      expect(qualifiedPlayers[0].winRate).toBe(100.0);
      expect(qualifiedPlayers[1].playerId).toBe(player2.id);
      expect(qualifiedPlayers[1].winRate).toBe(60.0);
    });
  });

  describe('League Standings', () => {
    it('should calculate league standings correctly', async () => {
      const user1 = await createTestUser({ email: 'user1@example.com' });
      const user2 = await createTestUser({ email: 'user2@example.com' });
      const user3 = await createTestUser({ email: 'user3@example.com' });

      const _org = await createTestOrganization();
      await createTestMembership({
        userId: user1.id,
        organizationId: org.id,
        role: 'ADMIN',
      });

      const club = await createTestClub({
        organizationId: org.id,
      });

      const player1 = await createTestPlayer({
        clubId: club.id,
        userId: user1.id,
      });
      const player2 = await createTestPlayer({
        clubId: club.id,
        userId: user2.id,
      });
      const player3 = await createTestPlayer({
        clubId: club.id,
        userId: user3.id,
      });

      // Create league
      const league = await prisma.league.create({
        data: {
          clubId: club.id,
          name: 'Test League',
          format: 'ROUND_ROBIN',
          matchType: 'SINGLES',
          status: 'ACTIVE',
          memberships: {
            create: [{ playerId: player1.id }, { playerId: player2.id }, { playerId: player3.id }],
          },
        },
      });

      // Create league matches
      // Player1: 2-0 (100%)
      await createLeagueMatch(club.id, league.id, player1.id, true);
      await createLeagueMatch(club.id, league.id, player1.id, true);

      // Player2: 1-1 (50%)
      await createLeagueMatch(club.id, league.id, player2.id, true);
      await createLeagueMatch(club.id, league.id, player2.id, false);

      // Player3: 0-2 (0%)
      await createLeagueMatch(club.id, league.id, player3.id, false);
      await createLeagueMatch(club.id, league.id, player3.id, false);

      // Get standings
      const memberships = await prisma.leagueMembership.findMany({
        where: { leagueId: league.id },
        include: {
          player: true,
        },
      });

      const standings = await Promise.all(
        memberships.map(async (membership) => {
          const playerMatches = await prisma.playerMatch.findMany({
            where: {
              playerId: membership.playerId,
              match: { leagueId: league.id },
            },
          });

          const totalMatches = playerMatches.length;
          const wins = playerMatches.filter((pm) => pm.isWinner).length;
          const winRate = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;

          return {
            playerId: membership.playerId,
            totalMatches,
            wins,
            losses: totalMatches - wins,
            winRate,
          };
        })
      );

      standings.sort((a, b) => {
        if (b.winRate !== a.winRate) {
          return b.winRate - a.winRate;
        }
        return b.totalMatches - a.totalMatches;
      });

      expect(standings[0].playerId).toBe(player1.id);
      expect(standings[0].wins).toBe(2);
      expect(standings[0].winRate).toBe(100.0);

      expect(standings[1].playerId).toBe(player2.id);
      expect(standings[1].wins).toBe(1);
      expect(standings[1].winRate).toBe(50.0);

      expect(standings[2].playerId).toBe(player3.id);
      expect(standings[2].wins).toBe(0);
      expect(standings[2].winRate).toBe(0.0);
    });
  });

  describe('Head-to-Head Statistics', () => {
    it('should calculate head-to-head record between players', async () => {
      const user1 = await createTestUser({ email: 'user1@example.com' });
      const user2 = await createTestUser({ email: 'user2@example.com' });

      const _org = await createTestOrganization();
      await createTestMembership({
        userId: user1.id,
        organizationId: org.id,
        role: 'MEMBER',
      });

      const club = await createTestClub({
        organizationId: org.id,
      });

      const player1 = await createTestPlayer({
        clubId: club.id,
        userId: user1.id,
      });
      const player2 = await createTestPlayer({
        clubId: club.id,
        userId: user2.id,
      });

      // Create 5 matches between player1 and player2
      // Player1 wins 3, Player2 wins 2
      for (let i = 0; i < 5; i++) {
        const _match = await prisma.match.create({
          data: {
            clubId: club.id,
            matchType: 'SINGLES',
            completedAt: new Date(),
            playerMatches: {
              create: [
                {
                  playerId: player1.id,
                  team: 'TEAM1',
                  isWinner: i < 3,
                  score: i < 3 ? 11 : 9,
                },
                {
                  playerId: player2.id,
                  team: 'TEAM2',
                  isWinner: i >= 3,
                  score: i >= 3 ? 11 : 9,
                },
              ],
            },
          },
        });
      }

      // Get player1's matches against player2
      const player1Matches = await prisma.playerMatch.findMany({
        where: { playerId: player1.id },
        include: {
          match: {
            include: {
              playerMatches: {
                where: { playerId: player2.id },
              },
            },
          },
        },
      });

      const matchesVsPlayer2 = player1Matches.filter((pm) => pm.match.playerMatches.length > 0);

      const wins = matchesVsPlayer2.filter((pm) => pm.isWinner).length;
      const losses = matchesVsPlayer2.length - wins;

      expect(matchesVsPlayer2.length).toBe(5);
      expect(wins).toBe(3);
      expect(losses).toBe(2);
    });
  });
});

async function createLeagueMatch(
  clubId: string,
  leagueId: string,
  playerId: string,
  isWinner: boolean
) {
  const opponentUser = await createTestUser({
    email: `opp-${Date.now()}-${Math.random()}@example.com`,
  });

  const _org = await prisma.organization.findFirst({
    where: { clubs: { some: { id: clubId } } },
  });

  const opponentPlayer = await createTestPlayer({
    clubId,
    userId: opponentUser.id,
  });

  await prisma.match.create({
    data: {
      clubId,
      leagueId,
      matchType: 'SINGLES',
      completedAt: new Date(),
      playerMatches: {
        create: [
          {
            playerId,
            team: 'TEAM1',
            isWinner,
            score: isWinner ? 11 : 9,
          },
          {
            playerId: opponentPlayer.id,
            team: 'TEAM2',
            isWinner: !isWinner,
            score: !isWinner ? 11 : 9,
          },
        ],
      },
    },
  });
}
