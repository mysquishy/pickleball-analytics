/**
 * Analytics Providers
 * Wraps app with Vercel Analytics and PostHog
 */

'use client';

import { Analytics } from '@vercel/analytics/react';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { useEffect } from 'react';

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    capture_pageview: false, // Disable automatic pageview capture
    persistence: 'localStorage',
  });
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Track page views
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.capture('$pageview', {
        $current_url: window.location.href,
      });
    }
  }, []);

  return (
    <PostHogProvider client={posthog}>
      {children}
      <Analytics />
    </PostHogProvider>
  );
}
