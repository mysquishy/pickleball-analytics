/**
 * Client-side feature flag hook
 */

'use client';

import { useState, useEffect } from 'react';

export interface UseFeatureFlagResult {
  enabled: boolean;
  loading: boolean;
}

export function useFeatureFlag(flagKey: string, userId?: string): UseFeatureFlagResult {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkFlag() {
      try {
        setLoading(true);
        const response = await fetch('/api/feature-flags/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ flagKey, userId }),
        });

        if (response.ok) {
          const data = await response.json();
          setEnabled(data.enabled);
        }
      } catch (error) {
        console.error('Failed to check feature flag:', error);
        setEnabled(false);
      } finally {
        setLoading(false);
      }
    }

    checkFlag();
  }, [flagKey, userId]);

  return { enabled, loading };
}

/**
 * Server-side feature flag check hook
 * For use in Server Components
 */
export async function getFeatureFlagValue(flagKey: string, userId?: string): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/feature-flags/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ flagKey, userId }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.enabled;
    }
  } catch (error) {
    console.error('Failed to check feature flag:', error);
  }

  return false;
}
