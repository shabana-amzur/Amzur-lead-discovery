import { Queue, Worker } from 'bullmq';
import { ai } from '@amzur/ai';
import { prisma } from '@amzur/database';

// Outreach job queue
export const outreachQueue = new Queue('outreach-generation', {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
});

interface OutreachJob {
  leadId: string;
  contactId?: string;
  type: 'email' | 'linkedin' | 'script';
}

// Outreach Agent Worker
export class OutreachAgent {
  private worker: Worker;

  constructor() {
    this.worker = new Worker(
      'outreach-generation',
      async (job) => {
        console.log(`Processing outreach job: ${job.id}`);
        const data = job.data as OutreachJob;

        try {
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

          // Get contact if specified, otherwise use primary decision maker
          let contact = null;
          if (data.contactId) {
            contact = await prisma.contact.findUnique({
              where: { id: data.contactId },
            });
          } else {
            contact = await prisma.contact.findFirst({
              where: {
                companyId: lead.companyId,
                seniority: 'C-Level',
              },
            });
          }

          if (!contact) {
            throw new Error(`No contact found for lead ${data.leadId}`);
          }

          // Determine best service match
          const topOpportunity = lead.opportunities[0];
          const serviceType = topOpportunity
            ? this.formatServiceType(topOpportunity.serviceType)
            : 'Digital Engineering';

          // Extract signal summaries
          const signals = lead.signals
            .slice(0, 3)
            .map((s: any) => s.content.substring(0, 100));

          // Generate outreach content using AI
          const outreachContent = await ai.generateOutreach({
            companyName: lead.company.name,
            contactName: contact.name,
            contactTitle: contact.title,
            serviceType,
            signals,
            type: data.type,
          });

          // Save outreach message to database
          const outreachMessage = await prisma.outreachMessage.create({
            data: {
              leadId: lead.id,
              contactId: contact.id,
              type: this.mapOutreachType(data.type),
              subject: outreachContent.subject,
              content: outreachContent.content,
              status: 'DRAFT',
            },
          });

          console.log(
            `Generated ${data.type} outreach for lead ${lead.id}: ${outreachMessage.id}`
          );

          return {
            success: true,
            outreachId: outreachMessage.id,
          };
        } catch (error) {
          console.error('Outreach generation job failed:', error);
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
      console.log(`Outreach generation job ${job.id} completed`);
    });

    this.worker.on('failed', (job, err) => {
      console.error(`Outreach generation job ${job?.id} failed:`, err);
    });
  }

  private formatServiceType(serviceType: string): string {
    const mapping: Record<string, string> = {
      DIGITAL_ENGINEERING: 'Digital Engineering',
      CLOUD_SERVICES: 'Cloud Services',
      AI_ML: 'AI/ML',
      ERP_NETSUITE: 'NetSuite ERP',
      MANAGED_SERVICES: 'Managed Services',
      CYBERSECURITY: 'Cybersecurity',
    };
    return mapping[serviceType] || serviceType;
  }

  private mapOutreachType(type: string): 'COLD_EMAIL' | 'LINKEDIN_MESSAGE' | 'DISCOVERY_CALL_SCRIPT' {
    const mapping: Record<string, any> = {
      email: 'COLD_EMAIL',
      linkedin: 'LINKEDIN_MESSAGE',
      script: 'DISCOVERY_CALL_SCRIPT',
    };
    return mapping[type] || 'COLD_EMAIL';
  }

  async generateOutreach(leadId: string, contactId?: string, type: 'email' | 'linkedin' | 'script' = 'email') {
    await outreachQueue.add('generate-outreach', {
      leadId,
      contactId,
      type,
    });
    console.log(`Queued outreach generation for lead ${leadId}`);
  }

  async generateForQualifiedLeads() {
    // Generate outreach for all qualified leads without existing outreach
    const qualifiedLeads = await prisma.lead.findMany({
      where: {
        status: 'QUALIFIED',
        score: { gte: 70 },
      },
      include: {
        outreach: true,
      },
    });

    for (const lead of qualifiedLeads) {
      if (lead.outreach.length === 0) {
        await this.generateOutreach(lead.id);
      }
    }

    console.log(`Queued outreach generation for ${qualifiedLeads.length} qualified leads`);
  }

  async stop() {
    await this.worker.close();
  }
}

// Run agent if executed directly
if (require.main === module) {
  const agent = new OutreachAgent();
  agent.generateForQualifiedLeads();
  console.log('Outreach Agent running...');
}
