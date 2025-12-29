import { requireAdmin } from '@/lib/auth';
import { getAdminAnalytics } from '@/lib/admin-analytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FadeInUp } from '@/components/animations/FadeInUp';
import { DollarSign, Users, TrendingUp, Package } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  await requireAdmin();

  const analytics = await getAdminAnalytics();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <FadeInUp>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Business Overview</h1>
          <p className="text-gray-600">Your SaaS business metrics at a glance</p>
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
              <CardTitle className="text-sm font-medium">Paying Customers</CardTitle>
              <Users className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalCustomers}</div>
              <p className="text-xs text-gray-600 mt-1">Active subscriptions</p>
            </CardContent>
          </Card>
        </FadeInUp>

        <FadeInUp delay={0.3}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
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
              <CardTitle className="text-sm font-medium">Recent Signups</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.recentSignups.length}</div>
              <p className="text-xs text-gray-600 mt-1">Last 30 days</p>
            </CardContent>
          </Card>
        </FadeInUp>
      </div>

      {/* Plan Breakdown Quick View */}
      <FadeInUp delay={0.5}>
        <Card>
          <CardHeader>
            <CardTitle>Active Plans</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.planBreakdown.length > 0 ? (
              <div className="flex gap-4">
                {analytics.planBreakdown.map((plan) => (
                  <div key={plan.plan} className="flex items-center gap-2">
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
                    <span className="text-gray-600">({plan.count})</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No active subscriptions yet</p>
            )}
          </CardContent>
        </Card>
      </FadeInUp>

      {/* Recent Customers */}
      <FadeInUp delay={0.6}>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Customers</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.recentSignups.length > 0 ? (
              <div className="space-y-3">
                {analytics.recentSignups.slice(0, 5).map((signup) => (
                  <div
                    key={signup.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div>
                      <div className="font-medium">{signup.name}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(signup.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{signup.plan}</div>
                      <div className="text-xs text-gray-600">{signup.members} members</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No customers yet</p>
            )}
          </CardContent>
        </Card>
      </FadeInUp>
    </div>
  );
}
