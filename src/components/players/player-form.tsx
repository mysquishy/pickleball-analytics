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

interface PlayerFormProps {
  clubId: string;
  clubSlug: string;
}

export function PlayerForm({ clubId, clubSlug }: PlayerFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    skillLevel: '',
    skillLevelSelf: '',
    phone: '',
    bio: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/clubs/${clubId}/players`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          skillLevel: formData.skillLevel ? parseFloat(formData.skillLevel) : undefined,
          skillLevelSelf: formData.skillLevelSelf ? parseFloat(formData.skillLevelSelf) : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create player');
      }

      router.push(`/clubs/${clubSlug}/players`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create player');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Player Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
          placeholder="player@example.com"
          required
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">
          We&apos;ll create an account for this player if one doesn&apos;t exist
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Player Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="John Smith"
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">
          Optional - defaults to email username if not provided
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="skillLevel">Skill Level (Rated)</Label>
          <Select
            value={formData.skillLevel}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, skillLevel: value }))}
            disabled={isLoading}
          >
            <SelectTrigger id="skillLevel">
              <SelectValue placeholder="Select skill level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1.0">1.0 - Beginner</SelectItem>
              <SelectItem value="1.5">1.5</SelectItem>
              <SelectItem value="2.0">2.0 - Novice</SelectItem>
              <SelectItem value="2.5">2.5</SelectItem>
              <SelectItem value="3.0">3.0 - Intermediate</SelectItem>
              <SelectItem value="3.5">3.5</SelectItem>
              <SelectItem value="4.0">4.0 - Advanced</SelectItem>
              <SelectItem value="4.5">4.5</SelectItem>
              <SelectItem value="5.0">5.0 - Professional</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">Official rating (if available)</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="skillLevelSelf">Self-Rated Skill Level</Label>
          <Select
            value={formData.skillLevelSelf}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, skillLevelSelf: value }))}
            disabled={isLoading}
          >
            <SelectTrigger id="skillLevelSelf">
              <SelectValue placeholder="Select skill level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1.0">1.0 - Beginner</SelectItem>
              <SelectItem value="1.5">1.5</SelectItem>
              <SelectItem value="2.0">2.0 - Novice</SelectItem>
              <SelectItem value="2.5">2.5</SelectItem>
              <SelectItem value="3.0">3.0 - Intermediate</SelectItem>
              <SelectItem value="3.5">3.5</SelectItem>
              <SelectItem value="4.0">4.0 - Advanced</SelectItem>
              <SelectItem value="4.5">4.5</SelectItem>
              <SelectItem value="5.0">5.0 - Professional</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">Player&apos;s own assessment</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
          placeholder="(555) 123-4567"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
          placeholder="Playing style, experience, notes..."
          rows={4}
          maxLength={500}
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">{formData.bio.length}/500 characters</p>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating Player...' : 'Create Player'}
        </Button>
      </div>
    </form>
  );
}
