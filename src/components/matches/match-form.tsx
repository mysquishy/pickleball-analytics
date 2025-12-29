'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Player {
  id: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  skillLevel: number | null;
}

interface Court {
  id: string;
  name: string;
}

interface MatchFormProps {
  clubId: string;
  clubSlug: string;
  players: Player[];
  courts: Court[];
}

type MatchType = 'SINGLES' | 'DOUBLES';
type Team = 'TEAM1' | 'TEAM2';
type Position = 'FIRST' | 'SECOND';

interface PlayerMatchData {
  playerId: string;
  team: Team;
  position?: Position;
  isWinner: boolean;
  score?: number;
}

export function MatchForm({ clubId, clubSlug, players, courts }: MatchFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [matchType, setMatchType] = useState<MatchType>('SINGLES');
  const [courtId, setCourtId] = useState<string>('');
  const [notes, setNotes] = useState('');

  // Player selections
  const [team1Players, setTeam1Players] = useState<{ [key in Position]?: string }>({});
  const [team2Players, setTeam2Players] = useState<{ [key in Position]?: string }>({});
  const [team1Score, setTeam1Score] = useState<number>(0);
  const [team2Score, setTeam2Score] = useState<number>(0);
  const [winningTeam, setWinningTeam] = useState<Team | null>(null);

  const availablePlayers = players.filter((p) => {
    const selectedIds = [...Object.values(team1Players), ...Object.values(team2Players)];
    return !selectedIds.includes(p.id);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Build player match data
      const playerMatches: PlayerMatchData[] = [];

      if (matchType === 'SINGLES') {
        const team1PlayerId = team1Players.FIRST;
        const team2PlayerId = team2Players.FIRST;

        if (!team1PlayerId || !team2PlayerId) {
          throw new Error('Please select players for both teams');
        }

        playerMatches.push({
          playerId: team1PlayerId,
          team: 'TEAM1',
          isWinner: winningTeam === 'TEAM1',
          score: team1Score,
        });

        playerMatches.push({
          playerId: team2PlayerId,
          team: 'TEAM2',
          isWinner: winningTeam === 'TEAM2',
          score: team2Score,
        });
      } else {
        // DOUBLES
        const team1First = team1Players.FIRST;
        const team1Second = team1Players.SECOND;
        const team2First = team2Players.FIRST;
        const team2Second = team2Players.SECOND;

        if (!team1First || !team1Second || !team2First || !team2Second) {
          throw new Error('Please select 2 players for each team');
        }

        playerMatches.push({
          playerId: team1First,
          team: 'TEAM1',
          position: 'FIRST',
          isWinner: winningTeam === 'TEAM1',
          score: team1Score,
        });

        playerMatches.push({
          playerId: team1Second,
          team: 'TEAM1',
          position: 'SECOND',
          isWinner: winningTeam === 'TEAM1',
          score: team1Score,
        });

        playerMatches.push({
          playerId: team2First,
          team: 'TEAM2',
          position: 'FIRST',
          isWinner: winningTeam === 'TEAM2',
          score: team2Score,
        });

        playerMatches.push({
          playerId: team2Second,
          team: 'TEAM2',
          position: 'SECOND',
          isWinner: winningTeam === 'TEAM2',
          score: team2Score,
        });
      }

      const response = await fetch(`/api/clubs/${clubId}/matches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courtId: courtId || undefined,
          matchType,
          completedAt: new Date().toISOString(),
          notes: notes || undefined,
          playerMatches,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create match');
      }

      router.push(`/clubs/${clubSlug}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create match');
    } finally {
      setIsLoading(false);
    }
  };

  const canSubmit = () => {
    if (matchType === 'SINGLES') {
      return team1Players.FIRST && team2Players.FIRST && winningTeam;
    } else {
      return (
        team1Players.FIRST &&
        team1Players.SECOND &&
        team2Players.FIRST &&
        team2Players.SECOND &&
        winningTeam
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Match Type */}
      <div className="space-y-2">
        <Label>Match Type *</Label>
        <Select value={matchType} onValueChange={(value: MatchType) => setMatchType(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SINGLES">Singles (1v1)</SelectItem>
            <SelectItem value="DOUBLES">Doubles (2v2)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Court Selection */}
      {courts.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="court">Court (Optional)</Label>
          <Select value={courtId} onValueChange={setCourtId}>
            <SelectTrigger id="court">
              <SelectValue placeholder="Select court" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No court selected</SelectItem>
              {courts.map((court) => (
                <SelectItem key={court.id} value={court.id}>
                  {court.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Teams */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Team 1 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Team 1</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {matchType === 'DOUBLES' && (
              <div className="space-y-2">
                <Label htmlFor="team1-first">First Position *</Label>
                <Select
                  value={team1Players.FIRST}
                  onValueChange={(value) => setTeam1Players({ ...team1Players, FIRST: value })}
                >
                  <SelectTrigger id="team1-first">
                    <SelectValue placeholder="Select player" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePlayers.map((player) => (
                      <SelectItem key={player.id} value={player.id}>
                        {player.user.name || player.user.email}
                        {player.skillLevel && ` (${player.skillLevel.toFixed(1)})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="team1-main">
                {matchType === 'SINGLES' ? 'Player *' : 'Second Position *'}
              </Label>
              <Select
                value={matchType === 'SINGLES' ? team1Players.FIRST : team1Players.SECOND}
                onValueChange={(value) =>
                  matchType === 'SINGLES'
                    ? setTeam1Players({ ...team1Players, FIRST: value })
                    : setTeam1Players({ ...team1Players, SECOND: value })
                }
              >
                <SelectTrigger id="team1-main">
                  <SelectValue placeholder="Select player" />
                </SelectTrigger>
                <SelectContent>
                  {availablePlayers.map((player) => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.user.name || player.user.email}
                      {player.skillLevel && ` (${player.skillLevel.toFixed(1)})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="team1-score">Score *</Label>
              <Input
                id="team1-score"
                type="number"
                min="0"
                value={team1Score}
                onChange={(e) => setTeam1Score(parseInt(e.target.value) || 0)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Team 2 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Team 2</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {matchType === 'DOUBLES' && (
              <div className="space-y-2">
                <Label htmlFor="team2-first">First Position *</Label>
                <Select
                  value={team2Players.FIRST}
                  onValueChange={(value) => setTeam2Players({ ...team2Players, FIRST: value })}
                >
                  <SelectTrigger id="team2-first">
                    <SelectValue placeholder="Select player" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePlayers.map((player) => (
                      <SelectItem key={player.id} value={player.id}>
                        {player.user.name || player.user.email}
                        {player.skillLevel && ` (${player.skillLevel.toFixed(1)})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="team2-main">
                {matchType === 'SINGLES' ? 'Player *' : 'Second Position *'}
              </Label>
              <Select
                value={matchType === 'SINGLES' ? team2Players.FIRST : team2Players.SECOND}
                onValueChange={(value) =>
                  matchType === 'SINGLES'
                    ? setTeam2Players({ ...team2Players, FIRST: value })
                    : setTeam2Players({ ...team2Players, SECOND: value })
                }
              >
                <SelectTrigger id="team2-main">
                  <SelectValue placeholder="Select player" />
                </SelectTrigger>
                <SelectContent>
                  {availablePlayers.map((player) => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.user.name || player.user.email}
                      {player.skillLevel && ` (${player.skillLevel.toFixed(1)})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="team2-score">Score *</Label>
              <Input
                id="team2-score"
                type="number"
                min="0"
                value={team2Score}
                onChange={(e) => setTeam2Score(parseInt(e.target.value) || 0)}
                required
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Winner */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <Label className="text-base font-semibold">Who won? *</Label>
            <div className="flex gap-4">
              <Button
                type="button"
                variant={winningTeam === 'TEAM1' ? 'default' : 'outline'}
                onClick={() => setWinningTeam('TEAM1')}
                className="flex-1"
              >
                Team 1 Won ({team1Score})
              </Button>
              <Button
                type="button"
                variant={winningTeam === 'TEAM2' ? 'default' : 'outline'}
                onClick={() => setWinningTeam('TEAM2')}
                className="flex-1"
              >
                Team 2 Won ({team2Score})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Match highlights, close scores, notable plays..."
          rows={3}
          maxLength={500}
        />
        <p className="text-xs text-muted-foreground">{notes.length}/500 characters</p>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={!canSubmit() || isLoading}>
          {isLoading ? 'Logging Match...' : 'Log Match'}
        </Button>
      </div>
    </form>
  );
}
