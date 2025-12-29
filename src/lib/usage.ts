import { prisma } from '@/lib/prisma';

/**
 * Track usage for an organization
 */
export async function trackUsage({
  organizationId,
  metric,
  value = 1,
  metadata,
}: {
  organizationId: string;
  metric: string;
  value?: number;
  metadata?: Record<string, unknown>;
}) {
  await prisma.usage.create({
    data: {
      organizationId,
      metric,
      value,
      metadata: metadata ? JSON.stringify(metadata) : null,
    },
  });
}

/**
 * Get usage for a specific metric in a time range
 */
export async function getUsage({
  organizationId,
  metric,
  startDate,
  endDate,
}: {
  organizationId: string;
  metric: string;
  startDate: Date;
  endDate: Date;
}) {
  const usage = await prisma.usage.findMany({
    where: {
      organizationId,
      metric,
      timestamp: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { timestamp: 'desc' },
  });

  const total = usage.reduce((sum, record) => sum + record.value, 0);

  return {
    records: usage,
    total,
    count: usage.length,
  };
}

/**
 * Get current billing period usage
 */
export async function getCurrentPeriodUsage(organizationId: string, metric: string) {
  // Get organization's subscription to find billing period
  const subscription = await prisma.subscription.findUnique({
    where: { organizationId },
  });

  if (!subscription) {
    throw new Error('No subscription found');
  }

  // Calculate current period start (30 days ago from period end)
  const periodEnd = subscription.stripeCurrentPeriodEnd;
  const periodStart = new Date(periodEnd);
  periodStart.setDate(periodStart.getDate() - 30);

  return getUsage({
    organizationId,
    metric,
    startDate: periodStart,
    endDate: periodEnd,
  });
}

/**
 * Get all usage metrics for an organization
 */
export async function getAllUsage({
  organizationId,
  startDate,
  endDate,
}: {
  organizationId: string;
  startDate: Date;
  endDate: Date;
}) {
  const usage = await prisma.usage.findMany({
    where: {
      organizationId,
      timestamp: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { timestamp: 'desc' },
  });

  // Group by metric
  const grouped = usage.reduce(
    (acc, record) => {
      if (!acc[record.metric]) {
        acc[record.metric] = { total: 0, count: 0, records: [] };
      }
      acc[record.metric].total += record.value;
      acc[record.metric].count += 1;
      acc[record.metric].records.push(record);
      return acc;
    },
    {} as Record<string, { total: number; count: number; records: typeof usage }>
  );

  return grouped;
}
