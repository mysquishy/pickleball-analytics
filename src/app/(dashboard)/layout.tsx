import { requireAdmin } from '@/lib/auth';
import { Sidebar } from '@/components/dashboard/sidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Only admins can access this entire section
  await requireAdmin();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 bg-gray-50">{children}</main>
    </div>
  );
}
