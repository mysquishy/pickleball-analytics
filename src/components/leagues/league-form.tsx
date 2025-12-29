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
import { Checkbox } from '@/components/ui/checkbox';
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

interface LeagueFormProps {
  clubId: string;
  clubSlug: string;
  players: Player[];
}

export function LeagueForm({ clubId, clubSlug, players }: LeagueFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [format, setFormat] = useState<'ROUND_ROBIN' | 'ELIMINATION'>('ROUND_ROBIN');
  const [matchType, setMatchType] = useState<'SINGLES' | 'DOUBLES'>('DOUBLES');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (selectedPlayers.length < 2) {
        throw new Error('Please select at least 2 players for the league');
      }

      const response = await fetch(`/api/clubs/${clubId}/leagues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description: description || undefined,
          format,
          matchType,
          startDate: startDate ? new Date(startDate).toISOString() : undefined,
          endDate: endDate ? new Date(endDate).toISOString() : undefined,
          playerIds: selectedPlayers,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create league');
      }

      router.push(`/clubs/${clubSlug}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create league');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayer = (playerId: string) => {
    setSelectedPlayers((prev) =>
      prev.includes(playerId) ? prev.filter((id) => id !== playerId) : [...prev, playerId]
    );
  };

  const canSubmit = () => {
    return (
      name.trim() &&
      selectedPlayers.length >= 2 &&
      (matchType === 'SINGLES' ? selectedPlayers.length >= 2 : selectedPlayers.length >= 4)
    );
  };

  const minPlayers = matchType === 'SINGLES' ? 2 : 4;
  const idealPlayers = matchType === 'SINGLES' ? 4 : 8;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* League Name */}
      <div className="space-y-2">
        <Label htmlFor="name">League Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Spring 2025 League"
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="League rules, schedule information..."
          rows={3}
          maxLength={500}
        />
        <p className="text-xs text-muted-foreground">{description.length}/500 characters</p>
      </div>

      {/* Format and Match Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="format">Format *</Label>
          <Select value={format} onValueChange={(value: any) => setFormat(value)}>
            <SelectTrigger id="format">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ROUND_ROBIN">Round Robin</SelectItem>
              <SelectItem value="ELIMINATION">Elimination</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {format === 'ROUND_ROBIN'
              ? 'Every player/team plays against every other'
              : 'Single-elimination tournament'}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="matchType">Match Type *</Label>
          <Select value={matchType} onValueChange={(value: any) => setMatchType(value)}>
            <SelectTrigger id="matchType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SINGLES">Singles (1v1)</SelectItem>
              <SelectItem value="DOUBLES">Doubles (2v2)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Start and End Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date (Optional)</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date (Optional)</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Player Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Players *</CardTitle>
          <p className="text-sm text-muted-foreground">
            {matchType === 'SINGLES'
              ? `Select ${minPlayers}+ players for singles league`
              : `Select ${minPlayers}+ players for doubles league`}
          </p>
        </CardHeader>
        <CardContent>
          {players.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No players available. Add players first.
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded"
                >
                  <Checkbox
                    id={player.id}
                    checked={selectedPlayers.includes(player.id)}
                    onCheckedChange={() => togglePlayer(player.id)}
                  />
                  <label htmlFor={player.id} className="flex-1 cursor-pointer">
                    <span className="font-medium">{player.user.name || player.user.email}</span>
                    {player.skillLevel && (
                      <span className="ml-2 text-sm text-muted-foreground">
                        ({player.skillLevel.toFixed(1)})
                      </span>
                    )}
                  </label>
                </div>
              ))}
            </div>
          )}

          {selectedPlayers.length > 0 && (
            <div className="mt-4 p-3 bg-muted/50 rounded">
              <p className="text-sm font-medium">
                {selectedPlayers.length} player{selectedPlayers.length !== 1 ? 's' : ''} selected
              </p>
              {selectedPlayers.length < minPlayers && (
                <p className="text-xs text-muted-foreground mt-1">
                  Need at least {minPlayers} players to create league
                </p>
              )}
              {selectedPlayers.length >= minPlayers && (
                <p className="text-xs text-green-600 mt-1">
                  ✓ Ready to create league
                  {selectedPlayers.length >= idealPlayers ? ' (ideal size!)' : ''}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={!canSubmit() || isLoading}>
          {isLoading ? 'Creating League...' : 'Create League'}
        </Button>
      </div>
    </form>
  );
}
