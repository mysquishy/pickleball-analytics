/**
 * Feature Flags System
 * Supports gradual rollouts, A/B testing, and user targeting
 */

import { prisma } from './prisma';

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string | null;
  enabled: boolean;
  rolloutPercentage: number;
  userSegment?: string[];
  environment: 'development' | 'staging' | 'production';
  createdAt: Date;
  updatedAt: Date;
}

// Helper to parse userSegment from database JSON string
function parseUserSegment(userSegment: string | null): string[] | undefined {
  if (!userSegment) return undefined;
  try {
    const parsed = JSON.parse(userSegment);
    return Array.isArray(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

// Helper to stringify userSegment for database
function stringifyUserSegment(userSegment?: string[]): string | null {
  if (!userSegment || userSegment.length === 0) return null;
  return JSON.stringify(userSegment);
}

export interface FlagCheckOptions {
  userId?: string;
  organizationId?: string;
  properties?: Record<string, unknown>;
}

/**
 * Check if a feature flag is enabled for a given context
 */
export async function isFeatureEnabled(
  flagKey: string,
  options: FlagCheckOptions = {}
): Promise<boolean> {
  const { userId, properties = {} } = options;

  // Get flag from database or environment
  const flag = await getFeatureFlag(flagKey);

  if (!flag) {
    console.warn(`Feature flag not found: ${flagKey}`);
    return false;
  }

  // Environment check
  const environment =
    process.env.NODE_ENV === 'production'
      ? 'production'
      : process.env.NODE_ENV === 'test'
        ? 'staging'
        : 'development';

  if (flag.environment !== environment && flag.environment !== 'production') {
    return false;
  }

  // Global enabled check
  if (!flag.enabled) {
    return false;
  }

  // User segment targeting
  if (flag.userSegment && flag.userSegment.length > 0) {
    if (userId && !flag.userSegment.includes(userId)) {
      return false;
    }
  }

  // Rollout percentage
  if (flag.rolloutPercentage < 100) {
    // Generate consistent hash based on user ID or random
    const hash = userId ? hashUserId(userId, flagKey) : Math.random() * 100;

    if (hash > flag.rolloutPercentage) {
      return false;
    }
  }

  // Property-based targeting
  if (Object.keys(properties).length > 0) {
    // Could implement complex property matching here
    // For now, just check if properties match
    const matchesProperties = checkPropertyMatch();
    if (!matchesProperties) {
      return false;
    }
  }

  return true;
}

/**
 * Get feature flag from database or environment
 */
async function getFeatureFlag(key: string): Promise<FeatureFlag | null> {
  // Try database first
  try {
    const flag = await prisma.featureFlag.findUnique({
      where: { key },
    });

    if (flag) {
      return {
        ...flag,
        description: flag.description ?? '',
        userSegment: parseUserSegment(flag.userSegment),
        environment: flag.environment as 'development' | 'staging' | 'production',
      };
    }
  } catch {
    // Table might not exist yet, continue to environment flags
    console.debug('Feature flags table not found, using environment flags');
  }

  // Fallback to environment-based flags
  const envFlags = getEnvironmentFlags();
  return envFlags[key] || null;
}

/**
 * Get feature flags from environment variables
 * Format: NEXT_PUBLIC_FEATURE_FLAG_<KEY>=<percentage|enabled>
 */
function getEnvironmentFlags(): Record<string, FeatureFlag> {
  const flags: Record<string, FeatureFlag> = {};

  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith('NEXT_PUBLIC_FEATURE_FLAG_') && value !== undefined) {
      const flagKey = key.replace('NEXT_PUBLIC_FEATURE_FLAG_', '').toLowerCase();
      const flagValue = value.toLowerCase();

      flags[flagKey] = {
        id: flagKey,
        key: flagKey,
        name: flagKey,
        description: `Feature flag from environment: ${flagKey}`,
        enabled: flagValue === 'true' || flagValue === '1',
        rolloutPercentage:
          flagValue === 'true' || flagValue === '1' ? 100 : parseInt(flagValue, 10) || 0,
        environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  }

  return flags;
}

/**
 * Generate consistent hash for user-based rollouts
 */
function hashUserId(userId: string, flagKey: string): number {
  // Simple hash function - in production use crypto
  let hash = 0;
  const str = `${userId}-${flagKey}`;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return Math.abs(hash) % 100;
}

/**
 * Check if properties match flag requirements
 */
function checkPropertyMatch(): boolean {
  // This is a simplified version
  // In production, you might store property rules in the database
  // For example: { "plan": "pro" } to only show for pro users

  return true;
}

/**
 * Server-side hook to check feature flags
 */
export function withFeatureFlag<T extends (...args: unknown[]) => Promise<unknown>>(
  flagKey: string,
  fn: T
): T {
  return (async (...args: unknown[]) => {
    const enabled = await isFeatureEnabled(flagKey);
    if (!enabled) {
      throw new Error(`Feature ${flagKey} is not enabled`);
    }
    return fn(...args);
  }) as T;
}

/**
 * Get all feature flags for admin dashboard
 */
export async function getAllFeatureFlags(): Promise<FeatureFlag[]> {
  try {
    const flags = await prisma.featureFlag.findMany();
    return flags.map((flag) => ({
      ...flag,
      description: flag.description ?? '',
      userSegment: parseUserSegment(flag.userSegment),
      environment: flag.environment as 'development' | 'staging' | 'production',
    }));
  } catch {
    // Return environment flags if database not available
    return Object.values(getEnvironmentFlags());
  }
}

/**
 * Create or update feature flag
 */
export async function upsertFeatureFlag(
  flagKey: string,
  data: Partial<FeatureFlag>
): Promise<FeatureFlag> {
  try {
    // Convert userSegment array to JSON string for database
    const dbData = {
      ...data,
      userSegment: stringifyUserSegment(data.userSegment),
    };

    const flag = await prisma.featureFlag.upsert({
      where: { key: flagKey },
      update: dbData,
      create: {
        key: flagKey,
        name: data.name || flagKey,
        description: data.description || null,
        enabled: data.enabled ?? false,
        rolloutPercentage: data.rolloutPercentage ?? 0,
        userSegment: stringifyUserSegment(data.userSegment),
        environment: data.environment || 'development',
      },
    });

    return {
      ...flag,
      description: flag.description ?? '',
      userSegment: parseUserSegment(flag.userSegment),
      environment: flag.environment as 'development' | 'staging' | 'production',
    };
  } catch (error) {
    console.error('Failed to upsert feature flag:', error);
    throw error;
  }
}
