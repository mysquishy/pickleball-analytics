import { prisma } from '@/lib/prisma';
import { STRIPE_PLANS } from '@/lib/stripe';

// Get plan prices from single source of truth
const getPlanPrices = () => ({
  HOBBY: STRIPE_PLANS.HOBBY.price,
  PRO: STRIPE_PLANS.PRO.price,
  ENTERPRISE: STRIPE_PLANS.ENTERPRISE.price,
});

/**
 * Get Monthly Recurring Revenue (MRR)
 * Calculates based on active subscriptions
 */
export async function getMRR() {
  const subscriptions = await prisma.subscription.findMany({
    where: {
      status: 'ACTIVE',
    },
  });

  const planPrices = getPlanPrices();

  const mrr = subscriptions.reduce((total, sub) => {
    return total + (planPrices[sub.plan as keyof typeof planPrices] || 0);
  }, 0);

  return mrr;
}

/**
 * Get Annual Recurring Revenue (ARR)
 */
export async function getARR() {
  const mrr = await getMRR();
  return mrr * 12;
}

/**
 * Get total customer count
 */
export async function getTotalCustomers() {
  return prisma.organization.count({
    where: {
      subscription: {
        status: 'ACTIVE',
      },
    },
  });
}

/**
 * Get subscription breakdown by plan
 */
export async function getSubscriptionsByPlan() {
  const subscriptions = await prisma.subscription.groupBy({
    by: ['plan'],
    where: {
      status: 'ACTIVE',
    },
    _count: true,
  });

  return subscriptions.map((sub) => ({
    plan: sub.plan,
    count: sub._count,
  }));
}

/**
 * Get revenue trend for the last 30 days
 * Note: This is estimated based on subscription creation dates
 */
export async function getRevenueTrend(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const subscriptions = await prisma.subscription.findMany({
    where: {
      createdAt: {
        gte: startDate,
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  const planPrices = getPlanPrices();

  // Group by date
  const revenueByDate: Record<string, number> = {};

  subscriptions.forEach((sub) => {
    const date = sub.createdAt.toISOString().split('T')[0];
    const revenue = planPrices[sub.plan as keyof typeof planPrices] || 0;
    revenueByDate[date] = (revenueByDate[date] || 0) + revenue;
  });

  // Fill in missing dates with 0
  const trend = [];
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    const dateStr = date.toISOString().split('T')[0];
    trend.push({
      date: dateStr,
      revenue: revenueByDate[dateStr] || 0,
    });
  }

  return trend;
}

/**
 * Get recent signups
 */
export async function getRecentSignups(limit = 10) {
  const organizations = await prisma.organization.findMany({
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      subscription: true,
      _count: {
        select: {
          members: true,
        },
      },
    },
  });

  return organizations.map((org) => ({
    id: org.id,
    name: org.name,
    plan: org.subscription?.plan || 'FREE',
    members: org._count.members,
    createdAt: org.createdAt,
  }));
}

/**
 * Get all admin analytics in one call
 */
export async function getAdminAnalytics() {
  const [mrr, arr, totalCustomers, planBreakdown, revenueTrend, recentSignups] = await Promise.all([
    getMRR(),
    getARR(),
    getTotalCustomers(),
    getSubscriptionsByPlan(),
    getRevenueTrend(),
    getRecentSignups(),
  ]);

  return {
    mrr,
    arr,
    totalCustomers,
    planBreakdown,
    revenueTrend,
    recentSignups,
  };
}
