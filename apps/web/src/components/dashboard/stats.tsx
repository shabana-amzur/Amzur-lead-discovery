export function DashboardStats() {
  const stats = [
    { title: 'Total Leads', value: '1,234', change: '+12%' },
    { title: 'High Intent', value: '89', change: '+5%' },
    { title: 'Active Opportunities', value: '45', change: '+23%' },
    { title: 'Success Rate', value: '34%', change: '+2%' },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.title} className="rounded-lg border bg-card p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">{stat.title}</h3>
          </div>
          <div className="text-2xl font-bold">{stat.value}</div>
          <p className="text-xs text-muted-foreground">{stat.change} from last month</p>
        </div>
      ))}
    </div>
  );
}
