/**
 * Enhanced Admin Dashboard Analytics
 * Provides detailed metrics for admin dashboard
 */

import { prisma } from './prisma';

export interface DashboardStats {
  users: {
    total: number;
    active: number;
    growth: number;
    thisMonth: number;
  };
  revenue: {
    total: number;
    mrr: number; // Monthly Recurring Revenue
    arr: number; // Annual Recurring Revenue
    growth: number;
  };
  subscriptions: {
    total: number;
    active: number;
    churned: number;
    trial: number;
  };
  usage: {
    totalRequests: number;
    avgPerUser: number;
    peakHour: number;
  };
}

export interface TimeSeriesData {
  date: string;
  value: number;
}

export async function getDashboardStats(organizationId: string): Promise<DashboardStats> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // User stats (through Membership)
  const [totalUsers, thisMonthUsers, lastMonthUsers] = await Promise.all([
    prisma.membership.count({ where: { organizationId } }),
    prisma.membership.count({
      where: { organizationId, createdAt: { gte: startOfMonth } },
    }),
    prisma.membership.count({
      where: { organizationId, createdAt: { gte: startOfLastMonth, lt: startOfMonth } },
    }),
  ]);

  // Revenue stats
  const subscriptions = await prisma.subscription.findMany({
    where: { organizationId, status: 'ACTIVE' },
  });

  const mrr = subscriptions.reduce((sum, sub) => sum + (sub.price || 0), 0);

  // Usage stats
  const usage = await prisma.usage.findMany({
    where: { organizationId, timestamp: { gte: startOfMonth } },
  });

  const totalRequests = usage.reduce((sum, u) => sum + (u.value || 0), 0);

  return {
    users: {
      total: totalUsers,
      active: totalUsers, // Could refine with last login
      growth: lastMonthUsers > 0 ? ((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100 : 0,
      thisMonth: thisMonthUsers,
    },
    revenue: {
      total: mrr * 12, // Approximate total
      mrr,
      arr: mrr * 12,
      growth: 0, // Would need historical data
    },
    subscriptions: {
      total: await prisma.subscription.count({ where: { organizationId } }),
      active: await prisma.subscription.count({
        where: { organizationId, status: 'ACTIVE' },
      }),
      churned: await prisma.subscription.count({
        where: { organizationId, status: 'CANCELED' },
      }),
      trial: await prisma.subscription.count({
        where: { organizationId, status: 'TRIALING' },
      }),
    },
    usage: {
      totalRequests,
      avgPerUser: totalUsers > 0 ? totalRequests / totalUsers : 0,
      peakHour: 0, // Would need aggregated data
    },
  };
}

export async function getRevenueChart(
  organizationId: string,
  months: number = 6
): Promise<TimeSeriesData[]> {
  const data: TimeSeriesData[] = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = date;
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

    const subscriptions = await prisma.subscription.findMany({
      where: {
        organizationId,
        createdAt: { gte: start, lt: end },
      },
    });

    const revenue = subscriptions.reduce((sum, sub) => sum + (sub.price || 0), 0);

    data.push({
      date: date.toISOString().split('T')[0],
      value: revenue,
    });
  }

  return data;
}

export async function getUserGrowthChart(
  organizationId: string,
  months: number = 6
): Promise<TimeSeriesData[]> {
  const data: TimeSeriesData[] = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = date;
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

    const users = await prisma.membership.count({
      where: {
        organizationId,
        createdAt: { gte: start, lt: end },
      },
    });

    data.push({
      date: date.toISOString().split('T')[0],
      value: users,
    });
  }

  return data;
}

export async function getTopUsers(
  organizationId: string,
  limit: number = 10
): Promise<Array<{ name: string | null; email: string; usage: number }>> {
  // Get members of this organization
  const memberships = await prisma.membership.findMany({
    where: { organizationId },
    include: { user: { select: { id: true, name: true, email: true } } },
    take: limit,
  });

  // Return members with mock usage data (since Usage doesn't track by userId)
  return memberships.map((membership) => ({
    name: membership.user.name,
    email: membership.user.email,
    usage: 0, // Would need userId in Usage model for real tracking
  }));
}

export async function getFeatureUsage(
  organizationId: string
): Promise<Array<{ feature: string; usage: number }>> {
  const features = await prisma.usage.groupBy({
    by: ['metric'],
    where: { organizationId },
    _sum: { value: true },
    orderBy: { _sum: { value: 'desc' } },
  });

  return features.map((f) => ({
    feature: f.metric,
    usage: f._sum.value || 0,
  }));
}
