/**
 * Analytics utilities
 * Integrates Vercel Analytics (client-side) and PostHog (product analytics)
 */

import { PostHog } from 'posthog-node';

// PostHog client for server-side analytics
const posthogClient =
  process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_HOST
    ? new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        flushAt: 1,
        flushInterval: 0,
      })
    : null;

export interface AnalyticsEvent {
  event: string;
  userId?: string;
  properties?: Record<string, unknown>;
}

/**
 * Track analytics event server-side
 */
export function trackEvent({ event, userId, properties }: AnalyticsEvent) {
  if (!posthogClient) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Event tracked:', { event, userId, properties });
    }
    return;
  }

  try {
    if (userId) {
      posthogClient.capture({
        distinctId: userId,
        event,
        properties,
      });
    } else {
      posthogClient.capture({
        distinctId: 'anonymous',
        event,
        properties,
      });
    }
  } catch (error) {
    console.error('[Analytics] Failed to track event:', error);
  }
}

/**
 * Identify user in analytics
 */
export function identifyUser(userId: string, properties?: Record<string, unknown>) {
  if (!posthogClient) return;

  try {
    posthogClient.identify({
      distinctId: userId,
      properties,
    });
  } catch (error) {
    console.error('[Analytics] Failed to identify user:', error);
  }
}

/**
 * Track page view
 */
export function trackPageView(userId: string | undefined, path: string) {
  trackEvent({
    event: '$pageview',
    userId,
    properties: {
      $current_url: path,
    },
  });
}

/**
 * Flush PostHog events (called at end of request)
 */
export function flushAnalytics() {
  if (!posthogClient) return;

  try {
    posthogClient.flush();
  } catch (error) {
    console.error('[Analytics] Failed to flush events:', error);
  }
}

/**
 * Client-side analytics hook (for use in React components)
 */
export const AnalyticsEvents = {
  // User events
  USER_SIGNED_UP: 'user_signed_up',
  USER_LOGGED_IN: 'user_logged_in',
  USER_LOGGED_OUT: 'user_logged_out',

  // Organization events
  ORGANIZATION_CREATED: 'organization_created',
  ORGANIZATION_INVITED: 'organization_invited',

  // Billing events
  CHECKOUT_INITIATED: 'checkout_initiated',
  SUBSCRIPTION_CREATED: 'subscription_created',
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',

  // Feature events
  AI_CHAT_STARTED: 'ai_chat_started',
  AI_CHAT_MESSAGE_SENT: 'ai_chat_message_sent',

  // Admin events
  ADMIN_DASHBOARD_VIEWED: 'admin_dashboard_viewed',
  ADMIN_EXPORT_DOWNLOADED: 'admin_export_downloaded',
};
