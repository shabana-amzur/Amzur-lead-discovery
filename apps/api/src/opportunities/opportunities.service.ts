import { Injectable } from '@nestjs/common';

@Injectable()
export class OpportunitiesService {
  async findAll(service?: string) {
    const opportunities = [
      {
        id: '1',
        leadId: '1',
        companyName: 'TechCorp Inc',
        serviceType: 'Cloud Migration',
        confidence: 92,
        signals: ['Hiring AWS Architect', 'Legacy infrastructure mentioned'],
      },
      {
        id: '2',
        leadId: '2',
        companyName: 'HealthPlus Systems',
        serviceType: 'AI Implementation',
        confidence: 85,
        signals: ['Job posting: ML Engineer', 'AI automation needs'],
      },
    ];

    if (service) {
      return opportunities.filter((opp) => opp.serviceType === service);
    }

    return opportunities;
  }

  async getByService() {
    return {
      'Cloud Migration': 12,
      'AI Implementation': 8,
      'NetSuite ERP': 6,
      'Cybersecurity': 5,
      'Digital Engineering': 10,
      'Managed Services': 4,
    };
  }
}
