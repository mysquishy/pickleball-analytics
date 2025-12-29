import { requireAdmin } from '@/lib/auth';
import { getAdminAnalytics } from '@/lib/admin-analytics';
import { FadeInUp } from '@/components/animations/FadeInUp';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RevenueChart } from '@/components/admin/revenue-chart';
import { DollarSign, Users, TrendingUp, Package } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminPage() {
  await requireAdmin();

  const analytics = await getAdminAnalytics();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <FadeInUp>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-gray-600">Overview of your SaaS metrics</p>
        </div>
      </FadeInUp>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <FadeInUp delay={0.1}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${analytics.mrr.toLocaleString()}</div>
              <p className="text-xs text-gray-600 mt-1">${analytics.arr.toLocaleString()} ARR</p>
            </CardContent>
          </Card>
        </FadeInUp>

        <FadeInUp delay={0.2}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <Users className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalCustomers}</div>
              <p className="text-xs text-gray-600 mt-1">Paying organizations</p>
            </CardContent>
          </Card>
        </FadeInUp>

        <FadeInUp delay={0.3}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
              <Package className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.planBreakdown.reduce((sum, plan) => sum + plan.count, 0)}
              </div>
              <p className="text-xs text-gray-600 mt-1">All active plans</p>
            </CardContent>
          </Card>
        </FadeInUp>

        <FadeInUp delay={0.4}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.recentSignups.length}</div>
              <p className="text-xs text-gray-600 mt-1">Recent signups</p>
            </CardContent>
          </Card>
        </FadeInUp>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend Chart */}
        <FadeInUp delay={0.5}>
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend (30 Days)</CardTitle>
              <CardDescription>New subscription revenue by day</CardDescription>
            </CardHeader>
            <CardContent>
              <RevenueChart data={analytics.revenueTrend} />
            </CardContent>
          </Card>
        </FadeInUp>

        {/* Plan Breakdown */}
        <FadeInUp delay={0.6}>
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plans</CardTitle>
              <CardDescription>Active subscriptions by plan</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.planBreakdown.length > 0 ? (
                <div className="space-y-4">
                  {analytics.planBreakdown.map((plan) => (
                    <div key={plan.plan} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            plan.plan === 'HOBBY'
                              ? 'bg-blue-500'
                              : plan.plan === 'PRO'
                                ? 'bg-purple-500'
                                : 'bg-green-500'
                          }`}
                        />
                        <span className="font-medium">{plan.plan}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold">{plan.count}</span>
                        <span className="text-sm text-gray-600 w-16">
                          {((plan.count / analytics.totalCustomers) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-gray-500">
                  No active subscriptions
                </div>
              )}
            </CardContent>
          </Card>
        </FadeInUp>
      </div>

      {/* Recent Signups */}
      <FadeInUp delay={0.7}>
        <Card>
          <CardHeader>
            <CardTitle>Recent Signups</CardTitle>
            <CardDescription>Latest organizations to join</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.recentSignups.length > 0 ? (
              <div className="space-y-4">
                {analytics.recentSignups.map((signup) => (
                  <div
                    key={signup.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0"
                  >
                    <div>
                      <div className="font-medium">{signup.name}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(signup.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">{signup.plan}</div>
                        <div className="text-xs text-gray-600">{signup.members} members</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-500">No signups yet</div>
            )}
          </CardContent>
        </Card>
      </FadeInUp>
    </div>
  );
}
