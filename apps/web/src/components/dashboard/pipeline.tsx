export function LeadPipeline() {
  const stages = [
    { name: 'New', count: 234 },
    { name: 'Qualified', count: 89 },
    { name: 'Contacted', count: 56 },
    { name: 'Meeting', count: 23 },
    { name: 'Proposal', count: 12 },
  ];

  return (
    <div className="col-span-4 rounded-lg border bg-card p-6">
      <h3 className="text-lg font-semibold mb-4">Lead Pipeline</h3>
      <div className="space-y-4">
        {stages.map((stage) => (
          <div key={stage.name} className="flex items-center">
            <div className="w-24 text-sm font-medium">{stage.name}</div>
            <div className="flex-1 bg-muted rounded-full h-2">
              <div
                className="bg-primary rounded-full h-2"
                style={{ width: `${(stage.count / 234) * 100}%` }}
              />
            </div>
            <div className="w-16 text-right text-sm text-muted-foreground">{stage.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
