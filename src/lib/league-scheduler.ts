export interface MatchPairing {
  team1: string[];
  team2: string[];
  round: number;
}

/**
 * Generate round-robin match schedule for singles league
 * Each player plays against every other player exactly once
 */
export function generateSingleRoundRobin(playerIds: string[]): MatchPairing[] {
  const matches: MatchPairing[] = [];
  const n = playerIds.length;

  // If odd number of players, add a "bye" player
  const players = n % 2 === 0 ? [...playerIds] : [...playerIds, null];

  const numRounds = players.length - 1;
  const half = players.length / 2;

  for (let round = 0; round < numRounds; round++) {
    for (let i = 0; i < half; i++) {
      const team1Player = players[i];
      const team2Player = players[players.length - 1 - i];

      // Skip if one of the players is null (bye)
      if (team1Player && team2Player) {
        matches.push({
          team1: [team1Player],
          team2: [team2Player],
          round: round + 1,
        });
      }
    }

    // Rotate players (keep first player fixed, rotate the rest)
    const last = players.pop()!;
    players.splice(1, 0, last);
  }

  return matches;
}

/**
 * Generate round-robin match schedule for doubles league
 * Creates all possible unique pairings and matchups
 */
export function generateDoubleRoundRobin(playerIds: string[]): MatchPairing[] {
  const matches: MatchPairing[] = [];
  const n = playerIds.length;

  // Need at least 4 players for doubles
  if (n < 4) {
    return [];
  }

  // Generate all possible teams of 2
  const teams: string[][] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      teams.push([playerIds[i], playerIds[j]]);
    }
  }

  // Generate all possible matchups between teams
  let currentRound = 1;
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      const team1 = teams[i];
      const team2 = teams[j];

      // Check if teams share a player (they shouldn't play against each other)
      if (!team1.some((player) => team2.includes(player))) {
        matches.push({
          team1,
          team2,
          round: currentRound,
        });

        // Increment round every few matches to balance schedule
        if (matches.filter((m) => m.round === currentRound).length >= Math.floor(n / 2)) {
          currentRound++;
        }
      }
    }
  }

  return matches;
}

/**
 * Generate elimination bracket for singles
 * Simple single-elimination tournament
 */
export function generateSingleElimination(playerIds: string[]): MatchPairing[] {
  const matches: MatchPairing[] = [];
  const n = playerIds.length;

  if (n < 2) {
    return [];
  }

  // If not power of 2, some players get byes
  const nextPowerOf2 = Math.pow(2, Math.ceil(Math.log2(n)));
  const byes = nextPowerOf2 - n;

  // Add null byes
  const players = [...playerIds];
  for (let i = 0; i < byes; i++) {
    players.push(null);
  }

  // First round
  const round1Matches: MatchPairing[] = [];
  for (let i = 0; i < players.length; i += 2) {
    const player1 = players[i];
    const player2 = players[i + 1];

    if (player1 && player2) {
      round1Matches.push({
        team1: [player1],
        team2: [player2],
        round: 1,
      });
    } else if (player1 || player2) {
      // Bye - the player advances automatically
      // We don't add a match for this
    }
  }

  matches.push(...round1Matches);

  // Subsequent rounds (we don't know who wins yet, so this is just placeholder)
  // In a real implementation, you'd generate bracket dynamically after each round

  return matches;
}

/**
 * Get a description of the schedule for display
 */
export function getScheduleDescription(
  format: 'ROUND_ROBIN' | 'ELIMINATION',
  matchType: 'SINGLES' | 'DOUBLES',
  playerCount: number
): string {
  if (format === 'ROUND_ROBIN') {
    if (matchType === 'SINGLES') {
      const totalMatches = (playerCount * (playerCount - 1)) / 2;
      return `Round Robin: Each player plays every other player once (${totalMatches} total matches)`;
    } else {
      const teams = (playerCount * (playerCount - 1)) / 2;
      const totalMatches = (teams * (teams - 1)) / 2; // Approximate
      return `Round Robin: All possible team matchups (${totalMatches}+ total matches)`;
    }
  } else {
    return `Elimination: Single-elimination tournament bracket`;
  }
}

/**
 * Estimate number of rounds needed
 */
export function estimateRounds(
  format: 'ROUND_ROBIN' | 'ELIMINATION',
  matchType: 'SINGLES' | 'DOUBLES',
  playerCount: number
): number {
  if (format === 'ROUND_ROBIN') {
    return matchType === 'SINGLES' ? playerCount - 1 : Math.ceil(playerCount / 2);
  } else {
    return Math.ceil(Math.log2(playerCount));
  }
}
