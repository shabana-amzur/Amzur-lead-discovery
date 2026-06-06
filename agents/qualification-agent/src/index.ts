import { Queue, Worker } from 'bullmq';
import { ai } from '@amzur/ai';
import { leadScoring } from '@amzur/lead-scoring';
import { prisma } from '@amzur/database';

// Qualification job queue
export const qualificationQueue = new Queue('lead-qualification', {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
});

interface QualificationJob {
  leadId: string;
}

// Lead Qualification Agent Worker
export class QualificationAgent {
  private worker: Worker;

  constructor() {
    this.worker = new Worker(
      'lead-qualification',
      async (job) => {
        console.log(`Processing qualification job: ${job.id}`);
        const data = job.data as QualificationJob;

        try {
          // Fetch lead with all related data
          const lead = await prisma.lead.findUnique({
            where: { id: data.leadId },
            include: {
              company: true,
              signals: true,
              opportunities: true,
            },
          });

          if (!lead) {
            throw new Error(`Lead ${data.leadId} not found`);
          }

          // Calculate lead score using scoring service
          const scoreResult = leadScoring.calculateScore({
            company: {
              industry: lead.company.industry,
              employeeCount: lead.company.employeeCount || undefined,
              revenue: lead.company.revenue || undefined,
              location: lead.company.location || undefined,
              technologies: lead.company.technologies,
            },
            signals: lead.signals.map((s: any) => ({
              type: s.type,
              confidence: s.confidence,
              content: s.content,
            })),
            opportunities: lead.opportunities.map((o: any) => ({
              serviceType: o.serviceType,
              confidence: o.confidence,
            })),
          });

          // Use AI for additional qualification insights
          const aiQualification = await ai.qualifyLead({
            company: lead.company,
            signals: lead.signals,
            score: scoreResult.totalScore,
          });

          // Update lead with new scores
          const updatedLead = await prisma.lead.update({
            where: { id: lead.id },
            data: {
              score: scoreResult.totalScore,
              companyFit: scoreResult.companyFit,
              serviceFit: scoreResult.serviceFit,
              intentScore: scoreResult.intentScore,
              engagement: scoreResult.engagementScore,
              status: this.determineStatus(scoreResult.totalScore),
              notes: aiQualification.recommendation,
            },
          });

          console.log(
            `Qualified lead ${lead.id}: Score ${scoreResult.totalScore}, Status ${updatedLead.status}`
          );

          return {
            success: true,
            score: scoreResult.totalScore,
            status: updatedLead.status,
          };
        } catch (error) {
          console.error('Qualification job failed:', error);
          throw error;
        }
      },
      {
        connection: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
        },
        concurrency: 10,
      }
    );

    this.worker.on('completed', (job) => {
      console.log(`Qualification job ${job.id} completed`);
    });

    this.worker.on('failed', (job, err) => {
      console.error(`Qualification job ${job?.id} failed:`, err);
    });
  }

  private determineStatus(score: number): 'NEW' | 'QUALIFIED' | 'CONTACTED' {
    if (score >= 70) return 'QUALIFIED';
    if (score >= 50) return 'CONTACTED';
    return 'NEW';
  }

  async qualifyLead(leadId: string) {
    await qualificationQueue.add('qualify-lead', { leadId });
    console.log(`Queued qualification job for lead ${leadId}`);
  }

  async qualifyAllLeads() {
    // Qualify all leads that haven't been qualified recently
    const leads = await prisma.lead.findMany({
      where: {
        OR: [
          { score: 0 },
          {
            updatedAt: {
              lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Older than 7 days
            },
          },
        ],
      },
      select: { id: true },
    });

    for (const lead of leads) {
      await this.qualifyLead(lead.id);
    }

    console.log(`Queued qualification for ${leads.length} leads`);
  }

  async stop() {
    await this.worker.close();
  }
}

// Run agent if executed directly
if (require.main === module) {
  const agent = new QualificationAgent();
  agent.qualifyAllLeads();
  console.log('Qualification Agent running...');
}
