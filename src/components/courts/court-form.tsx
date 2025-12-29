'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface CourtFormProps {
  clubId: string;
  clubSlug: string;
}

export function CourtForm({ clubId, clubSlug }: CourtFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    surface: '',
    lighting: true,
    indoors: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/clubs/${clubId}/courts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create court');
      }

      router.push(`/clubs/${clubSlug}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create court');
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
        <Label htmlFor="name">Court Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="Court 1"
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="surface">Surface Type</Label>
        <Input
          id="surface"
          value={formData.surface}
          onChange={(e) => setFormData((prev) => ({ ...prev, surface: e.target.value }))}
          placeholder="Indoor Hard, Outdoor Concrete, etc."
          disabled={isLoading}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="lighting"
            checked={formData.lighting}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, lighting: checked as boolean }))
            }
            disabled={isLoading}
          />
          <Label htmlFor="lighting" className="cursor-pointer">
            Has lighting
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="indoors"
            checked={formData.indoors}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, indoors: checked as boolean }))
            }
            disabled={isLoading}
          />
          <Label htmlFor="indoors" className="cursor-pointer">
            Indoor court
          </Label>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating Court...' : 'Create Court'}
        </Button>
      </div>
    </form>
  );
}
