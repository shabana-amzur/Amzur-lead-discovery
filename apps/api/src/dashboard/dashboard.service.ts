import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  async getStats() {
    return {
      totalLeads: 1234,
      highIntentLeads: 89,
      activeOpportunities: 45,
      successRate: 34,
      leadsByStatus: {
        new: 234,
        qualified: 89,
        contacted: 56,
        meeting: 23,
        proposal: 12,
      },
      opportunitiesByService: {
        'Cloud Migration': 12,
        'AI Implementation': 8,
        'NetSuite ERP': 6,
        'Cybersecurity': 5,
        'Digital Engineering': 10,
        'Managed Services': 4,
      },
    };
  }
}
