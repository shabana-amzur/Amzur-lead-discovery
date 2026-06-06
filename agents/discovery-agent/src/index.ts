import { Queue, Worker } from 'bullmq';
import { leadDiscovery } from '@amzur/lead-discovery';
import { prisma } from '@amzur/database';

// Discovery job queue
export const discoveryQueue = new Queue('lead-discovery', {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
});

// Job types
interface DiscoveryJob {
  type: 'job-boards' | 'news' | 'social' | 'web-search';
  keywords?: string[];
  topics?: string[];
  platforms?: string[];
  query?: string;
}

// Discovery Agent Worker
export class DiscoveryAgent {
  private worker: Worker;

  constructor() {
    this.worker = new Worker(
      'lead-discovery',
      async (job) => {
        console.log(`Processing discovery job: ${job.id}`);
        const data = job.data as DiscoveryJob;

        try {
          let leads: any[] = [];

          switch (data.type) {
            case 'job-boards':
              leads = await leadDiscovery.discoverFromJobBoards(data.keywords || []);
              break;
            case 'news':
              leads = await leadDiscovery.discoverFromNews(data.topics || []);
              break;
            case 'social':
              leads = await leadDiscovery.discoverFromSocial(data.platforms || []);
              break;
            case 'web-search':
              leads = await leadDiscovery.searchGoogle(data.query || '');
              break;
          }

          // Save discovered leads to database
          for (const lead of leads) {
            await this.saveLead(lead);
          }

          return { success: true, leadsFound: leads.length };
        } catch (error) {
          console.error('Discovery job failed:', error);
          throw error;
        }
      },
      {
        connection: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
        },
        concurrency: 5,
      }
    );

    this.worker.on('completed', (job) => {
      console.log(`Discovery job ${job.id} completed`);
    });

    this.worker.on('failed', (job, err) => {
      console.error(`Discovery job ${job?.id} failed:`, err);
    });
  }

  private async saveLead(lead: any) {
    // Check if company already exists
    let company = await prisma.company.findFirst({
      where: { website: lead.website },
    });

    if (!company) {
      company = await prisma.company.create({
        data: {
          name: lead.companyName,
          website: lead.website,
          domain: lead.website ? new URL(lead.website).hostname : null,
          industry: 'Unknown', // Will be enriched later
        },
      });
    }

    // Create lead if doesn't exist
    const existingLead = await prisma.lead.findFirst({
      where: { companyId: company.id },
    });

    if (!existingLead) {
      await prisma.lead.create({
        data: {
          companyId: company.id,
          source: lead.source,
          status: 'NEW',
          score: 0,
        },
      });
    }

    console.log(`Saved lead for company: ${lead.companyName}`);
  }

  async scheduleDiscovery() {
    // Schedule various discovery jobs
    await discoveryQueue.add('discover-job-boards', {
      type: 'job-boards',
      keywords: [
        'AWS Architect',
        'DevOps Engineer',
        'Cloud Engineer',
        'AI Engineer',
        'NetSuite Consultant',
        'Security Engineer',
        'Full Stack Developer',
      ],
    });

    await discoveryQueue.add('discover-news', {
      type: 'news',
      topics: [
        'cloud migration',
        'digital transformation',
        'ai implementation',
        'erp upgrade',
        'cybersecurity',
      ],
    });

    console.log('Discovery jobs scheduled');
  }

  async stop() {
    await this.worker.close();
  }
}

// Run agent if executed directly
if (require.main === module) {
  const agent = new DiscoveryAgent();
  agent.scheduleDiscovery();
  
  console.log('Discovery Agent running...');
}
