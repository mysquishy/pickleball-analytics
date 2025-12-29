'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Club {
  id: string;
  slug: string;
  name: string;
}

interface PlayerStats {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  skillLevel?: number | null;
}

interface Stats {
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number;
}

interface LeaderboardEntry {
  rank: number;
  player: PlayerStats;
  stats: Stats;
}

interface LeaderboardClientProps {
  club: Club;
  initialLeaderboard: LeaderboardEntry[];
  initialType: string;
  initialSkillLevel?: string;
}

const SKILL_LEVELS = ['1.0', '1.5', '2.0', '2.5', '3.0', '3.5', '4.0', '4.5', '5.0'];

export function LeaderboardClient({
  club,
  initialLeaderboard,
  initialType,
  initialSkillLevel,
}: LeaderboardClientProps) {
  const router = useRouter();
  const [type, setType] = useState(initialType);
  const [skillLevel, setSkillLevel] = useState(initialSkillLevel || '3.0');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(initialLeaderboard);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLeaderboard = async (newType: string, newSkillLevel?: string) => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        type: newType,
        limit: '50',
      });

      if (newSkillLevel) {
        queryParams.set('skillLevel', newSkillLevel);
      }

      const response = await fetch(`/api/clubs/${club.id}/leaderboard?${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.leaderboard || []);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTypeChange = (newType: string) => {
    setType(newType);
    if (newType !== 'skill') {
      router.push(`/clubs/${club.slug}/leaderboard?type=${newType}`);
      fetchLeaderboard(newType);
    } else {
      router.push(`/clubs/${club.slug}/leaderboard?type=${newType}&skill=${skillLevel}`);
      fetchLeaderboard(newType, skillLevel);
    }
  };

  const handleSkillLevelChange = (newSkillLevel: string) => {
    setSkillLevel(newSkillLevel);
    router.push(`/clubs/${club.slug}/leaderboard?type=skill&skill=${newSkillLevel}`);
    fetchLeaderboard('skill', newSkillLevel);
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'monthly':
        return 'This Month';
      case 'active':
        return 'Most Active';
      case 'skill':
        return `Skill Level ${skillLevel}`;
      default:
        return 'Overall';
    }
  };

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
            <p className="text-muted-foreground mt-2">{club.name}</p>
          </div>
          <Link href={`/clubs/${club.slug}`}>
            <Button variant="outline">Back to Club</Button>
          </Link>
        </div>

        {/* Type Selector */}
        <div className="flex gap-4 items-center">
          <div className="flex-1 max-w-xs">
            <Select value={type} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select leaderboard type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overall">Overall</SelectItem>
                <SelectItem value="monthly">This Month</SelectItem>
                <SelectItem value="active">Most Active</SelectItem>
                <SelectItem value="skill">By Skill Level</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === 'skill' && (
            <div className="flex-1 max-w-xs">
              <Select value={skillLevel} onValueChange={handleSkillLevelChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select skill level" />
                </SelectTrigger>
                <SelectContent>
                  {SKILL_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>{getTypeLabel()} Leaderboard</CardTitle>
          <CardDescription>
            {type === 'overall' && 'Players with 5+ matches, ranked by win rate'}
            {type === 'monthly' && 'Players with 3+ matches this month, ranked by win rate'}
            {type === 'active' && 'Players ranked by total matches played'}
            {type === 'skill' && 'Players with 3+ matches, ranked by win rate'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading leaderboard...</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No players qualify for this leaderboard yet.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Players need at least {type === 'monthly' || type === 'skill' ? '3' : '5'} matches
                to appear.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((entry) => (
                <div
                  key={entry.player.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="text-2xl font-bold w-12 text-center">
                      {getMedalIcon(entry.rank)}
                    </div>

                    {/* Avatar */}
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={entry.player.image || undefined} />
                      <AvatarFallback>
                        {entry.player.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Player Info */}
                    <div>
                      <p className="font-semibold">{entry.player.name}</p>
                      <div className="flex gap-2 text-sm text-muted-foreground">
                        {entry.player.skillLevel && (
                          <span>{entry.player.skillLevel.toFixed(1)}</span>
                        )}
                        {entry.stats.totalMatches > 0 && (
                          <span>{entry.stats.totalMatches} matches</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{entry.stats.winRate}%</p>
                    <p className="text-sm text-muted-foreground">
                      {entry.stats.wins}W - {entry.stats.losses}L
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Box */}
      <Card className="mt-6 bg-muted/50">
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-2">Leaderboard Rules:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>
                <strong>Overall:</strong> Players with 5+ matches, ranked by win rate
              </li>
              <li>
                <strong>Monthly:</strong> Players with 3+ matches this month, ranked by win rate
              </li>
              <li>
                <strong>Most Active:</strong> Players ranked by total matches played
              </li>
              <li>
                <strong>Skill Level:</strong> Players with 3+ matches in that skill range, ranked by
                win rate
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
