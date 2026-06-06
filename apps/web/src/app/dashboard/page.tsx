import { Metadata } from 'next';
import { DashboardStats } from '@/components/dashboard/stats';
import { LeadPipeline } from '@/components/dashboard/pipeline';
import { RecentOpportunities } from '@/components/dashboard/recent-opportunities';

export const metadata: Metadata = {
  title: 'Dashboard | Amzur Lead Engine',
  description: 'View your lead intelligence dashboard',
};

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <h1 className="text-2xl font-bold">Amzur Lead Engine</h1>
        </div>
      </header>
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <DashboardStats />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <LeadPipeline />
          <RecentOpportunities />
        </div>
      </main>
    </div>
  );
}
