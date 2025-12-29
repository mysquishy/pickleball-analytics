import { requireAdmin } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FadeInUp } from '@/components/animations/FadeInUp';
import { Key, Mail, CreditCard, Shield, Bell, Globe } from 'lucide-react';
import { STRIPE_PLANS } from '@/lib/stripe';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SettingsPage() {
  await requireAdmin();

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <FadeInUp>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Business Settings</h1>
          <p className="text-gray-600">Configure your SaaS application</p>
        </div>
      </FadeInUp>

      <div className="space-y-6">
        {/* API Keys */}
        <FadeInUp delay={0.1}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5 text-blue-600" />
                <div>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>
                    Manage Stripe, OpenAI, and other service integrations
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Stripe Secret Key</label>
                  <div className="mt-1 flex items-center gap-2">
                    <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                      {process.env.STRIPE_SECRET_KEY
                        ? `sk_***${process.env.STRIPE_SECRET_KEY.slice(-4)}`
                        : 'Not configured'}
                    </code>
                    <span className="text-xs text-gray-500">Set in .env.local</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">OpenAI API Key</label>
                  <div className="mt-1 flex items-center gap-2">
                    <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                      {process.env.OPENAI_API_KEY
                        ? `sk-***${process.env.OPENAI_API_KEY.slice(-4)}`
                        : 'Not configured'}
                    </code>
                    <span className="text-xs text-gray-500">Set in .env.local</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeInUp>

        {/* Email Configuration */}
        <FadeInUp delay={0.2}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-green-600" />
                <div>
                  <CardTitle>Email Settings</CardTitle>
                  <CardDescription>Configure transactional email service (Resend)</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Resend API Key</label>
                  <div className="mt-1 flex items-center gap-2">
                    <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                      {process.env.RESEND_API_KEY
                        ? `re_***${process.env.RESEND_API_KEY.slice(-4)}`
                        : 'Not configured'}
                    </code>
                    <span className="text-xs text-gray-500">Set in .env.local</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">From Email</label>
                  <div className="mt-1">
                    <code className="bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                      {process.env.EMAIL_FROM || 'Not configured'}
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeInUp>

        {/* Payment Settings */}
        <FadeInUp delay={0.3}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-purple-600" />
                <div>
                  <CardTitle>Payment Configuration</CardTitle>
                  <CardDescription>Stripe pricing and subscription settings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Hobby Plan</label>
                    <div className="mt-1">
                      <code className="text-sm">${STRIPE_PLANS.HOBBY.price}/month</code>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Pro Plan</label>
                    <div className="mt-1">
                      <code className="text-sm">${STRIPE_PLANS.PRO.price}/month</code>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Enterprise Plan</label>
                    <div className="mt-1">
                      <code className="text-sm">${STRIPE_PLANS.ENTERPRISE.price}/month</code>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  To change pricing, update STRIPE_PLANS in lib/stripe.ts (single source of truth)
                </p>
              </div>
            </CardContent>
          </Card>
        </FadeInUp>

        {/* Security */}
        <FadeInUp delay={0.4}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-red-600" />
                <div>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Authentication and security settings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">NextAuth Secret</label>
                  <div className="mt-1 flex items-center gap-2">
                    <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                      {process.env.NEXTAUTH_SECRET ? '***' : 'Not configured'}
                    </code>
                    <span className="text-xs text-gray-500">Set in .env.local</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Sentry DSN</label>
                  <div className="mt-1">
                    <code className="bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                      {process.env.SENTRY_DSN ? 'Configured' : 'Not configured (optional)'}
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeInUp>

        {/* App Configuration */}
        <FadeInUp delay={0.5}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-indigo-600" />
                <div>
                  <CardTitle>Application</CardTitle>
                  <CardDescription>General app configuration</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">App URL</label>
                  <div className="mt-1">
                    <code className="bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                      {process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}
                    </code>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Database</label>
                  <div className="mt-1">
                    <code className="bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                      {process.env.DATABASE_URL?.includes('sqlite')
                        ? 'SQLite (Development)'
                        : 'PostgreSQL (Production)'}
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeInUp>

        {/* Notifications */}
        <FadeInUp delay={0.6}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-yellow-600" />
                <div>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Configure admin notification preferences</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <div>
                    <div className="text-sm font-medium">New Customer Signups</div>
                    <div className="text-xs text-gray-500">
                      Get notified when new customers subscribe
                    </div>
                  </div>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <div>
                    <div className="text-sm font-medium">Failed Payments</div>
                    <div className="text-xs text-gray-500">Alert on payment failures</div>
                  </div>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="rounded" />
                  <div>
                    <div className="text-sm font-medium">Monthly Reports</div>
                    <div className="text-xs text-gray-500">Receive monthly revenue summaries</div>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>
        </FadeInUp>
      </div>
    </div>
  );
}
