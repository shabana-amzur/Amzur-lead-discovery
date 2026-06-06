export interface LeadScoringInput {
  company: {
    industry: string;
    employeeCount?: number;
    revenue?: string;
    location?: string;
    technologies?: string[];
  };
  signals: Array<{
    type: string;
    confidence: number;
    content: string;
  }>;
  opportunities?: Array<{
    serviceType: string;
    confidence: number;
  }>;
}

export interface LeadScore {
  totalScore: number;
  companyFit: number;
  serviceFit: number;
  intentScore: number;
  engagementScore: number;
  breakdown: {
    industry: number;
    companySize: number;
    geography: number;
    serviceMatch: number;
    signalStrength: number;
    signalRecency: number;
  };
}

export class LeadScoringService {
  // Target industries for Amzur
  private readonly targetIndustries = [
    'Healthcare',
    'Insurance',
    'Manufacturing',
    'Retail',
    'Government',
    'Energy',
    'Financial Services',
    'Technology',
  ];

  // Amzur service categories
  private readonly services = {
    DIGITAL_ENGINEERING: ['software development', 'app modernization', 'low-code', 'shopify'],
    CLOUD_SERVICES: ['aws', 'cloud migration', 'kubernetes', 'devops', 'azure'],
    AI_ML: ['ai', 'machine learning', 'computer vision', 'generative ai', 'chatbot'],
    ERP_NETSUITE: ['netsuite', 'erp', 'financial automation'],
    MANAGED_SERVICES: ['managed infrastructure', 'qa testing', 'application support'],
    CYBERSECURITY: ['security', 'vulnerability', 'compliance', 'penetration testing'],
  };

  calculateScore(input: LeadScoringInput): LeadScore {
    const companyFit = this.calculateCompanyFit(input.company);
    const serviceFit = this.calculateServiceFit(input);
    const intentScore = this.calculateIntentScore(input.signals);
    const engagementScore = 0; // Placeholder for future engagement tracking

    return {
      totalScore: companyFit + serviceFit + intentScore + engagementScore,
      companyFit,
      serviceFit,
      intentScore,
      engagementScore,
      breakdown: {
        industry: this.scoreIndustry(input.company.industry),
        companySize: this.scoreCompanySize(input.company.employeeCount),
        geography: this.scoreGeography(input.company.location),
        serviceMatch: this.scoreServiceMatch(input),
        signalStrength: this.scoreSignalStrength(input.signals),
        signalRecency: 10, // Placeholder
      },
    };
  }

  private calculateCompanyFit(company: LeadScoringInput['company']): number {
    // Max: 35 points
    const industry = this.scoreIndustry(company.industry);
    const size = this.scoreCompanySize(company.employeeCount);
    const geography = this.scoreGeography(company.location);

    return Math.min(35, industry + size + geography);
  }

  private scoreIndustry(industry: string): number {
    // Max: 15 points
    const normalized = industry.toLowerCase();
    const isTarget = this.targetIndustries.some(target =>
      normalized.includes(target.toLowerCase())
    );
    return isTarget ? 15 : 5;
  }

  private scoreCompanySize(employeeCount?: number): number {
    // Max: 10 points
    if (!employeeCount) return 5;
    
    if (employeeCount >= 100 && employeeCount <= 5000) return 10; // Sweet spot
    if (employeeCount >= 50 && employeeCount < 100) return 8;
    if (employeeCount > 5000) return 7;
    return 4;
  }

  private scoreGeography(location?: string): number {
    // Max: 10 points
    if (!location) return 5;
    
    const usLocations = ['united states', 'usa', 'us', 'america'];
    const isUS = usLocations.some(loc =>
      location.toLowerCase().includes(loc)
    );
    
    return isUS ? 10 : 6;
  }

  private calculateServiceFit(input: LeadScoringInput): number {
    // Max: 30 points
    return this.scoreServiceMatch(input);
  }

  private scoreServiceMatch(input: LeadScoringInput): number {
    // Max: 30 points
    const { company, signals, opportunities } = input;
    let score = 0;

    // Check technologies
    const techStack = (company.technologies || []).join(' ').toLowerCase();
    
    Object.entries(this.services).forEach(([_, keywords]) => {
      const hasMatch = keywords.some(keyword =>
        techStack.includes(keyword.toLowerCase())
      );
      if (hasMatch) score += 5;
    });

    // Check signals
    const signalContent = signals.map(s => s.content).join(' ').toLowerCase();
    
    Object.entries(this.services).forEach(([_, keywords]) => {
      const hasMatch = keywords.some(keyword =>
        signalContent.includes(keyword.toLowerCase())
      );
      if (hasMatch) score += 3;
    });

    // Check opportunities
    if (opportunities && opportunities.length > 0) {
      score += Math.min(10, opportunities.length * 3);
    }

    return Math.min(30, score);
  }

  private calculateIntentScore(signals: LeadScoringInput['signals']): number {
    // Max: 25 points
    if (signals.length === 0) return 0;

    const strength = this.scoreSignalStrength(signals);
    const recency = 10; // Placeholder - would check signal dates

    return Math.min(25, strength + recency);
  }

  private scoreSignalStrength(signals: LeadScoringInput['signals']): number {
    // Max: 15 points
    if (signals.length === 0) return 0;

    const avgConfidence = signals.reduce((sum, s) => sum + s.confidence, 0) / signals.length;
    const signalCount = Math.min(5, signals.length);

    return Math.round((avgConfidence / 100) * 10 + signalCount);
  }
}

export const leadScoring = new LeadScoringService();
