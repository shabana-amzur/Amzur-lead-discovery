export function RecentOpportunities() {
  const opportunities = [
    {
      company: 'TechCorp Inc',
      service: 'Cloud Migration',
      score: 92,
      status: 'High Intent',
    },
    {
      company: 'HealthPlus Systems',
      service: 'AI Implementation',
      score: 85,
      status: 'Qualified',
    },
    {
      company: 'RetailMax',
      service: 'NetSuite ERP',
      score: 78,
      status: 'New',
    },
  ];

  return (
    <div className="col-span-3 rounded-lg border bg-card p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Opportunities</h3>
      <div className="space-y-4">
        {opportunities.map((opp) => (
          <div key={opp.company} className="flex items-center justify-between">
            <div>
              <p className="font-medium">{opp.company}</p>
              <p className="text-sm text-muted-foreground">{opp.service}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-primary">{opp.score}</p>
              <p className="text-xs text-muted-foreground">{opp.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
