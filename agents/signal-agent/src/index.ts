import { Queue, Worker } from 'bullmq';
import { ai } from '@amzur/ai';
import { prisma } from '@amzur/database';

// Signal detection job queue
export const signalQueue = new Queue('signal-detection', {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
});

interface SignalDetectionJob {
  leadId: string;
  contentToAnalyze: string;
  source: string;
  sourceUrl: string;
}

// Signal Detection Agent Worker
export class SignalAgent {
  private worker: Worker;

  constructor() {
    this.worker = new Worker(
      'signal-detection',
      async (job) => {
        console.log(`Processing signal detection job: ${job.id}`);
        const data = job.data as SignalDetectionJob;

        try {
          // Use AI to detect buying signals
          const result = await ai.detectBuyingSignal(data.contentToAnalyze);

          if (result.hasBuyingSignal && result.signalType) {
            // Save buying signal to database
            await prisma.buyingSignal.create({
              data: {
                leadId: data.leadId,
                type: result.signalType as any,
                source: data.source,
                content: data.contentToAnalyze.substring(0, 500),
                confidence: result.confidence,
                metadata: {
                  url: data.sourceUrl,
                  reasoning: result.reasoning,
                },
              },
            });

            console.log(`Detected ${result.signalType} signal for lead ${data.leadId}`);
          }

          return {
            success: true,
            hasBuyingSignal: result.hasBuyingSignal,
            signalType: result.signalType,
            confidence: result.confidence,
          };
        } catch (error) {
          console.error('Signal detection job failed:', error);
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
      console.log(`Signal detection job ${job.id} completed`);
    });

    this.worker.on('failed', (job, err) => {
      console.error(`Signal detection job ${job?.id} failed:`, err);
    });
  }

  async analyzeLeadSignals(leadId: string) {
    // Fetch all unprocessed content sources for the lead
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        company: true,
      },
    });

    if (!lead) {
      throw new Error(`Lead ${leadId} not found`);
    }

    // Analyze job postings
    const jobPostings = await prisma.jobPosting.findMany({
      where: {
        companyName: lead.company.name,
        processed: false,
      },
    });

    for (const job of jobPostings) {
      await signalQueue.add('analyze-job-posting', {
        leadId: lead.id,
        contentToAnalyze: `${job.title}\n\n${job.description}`,
        source: job.platform,
        sourceUrl: job.url,
      });

      // Mark as processed
      await prisma.jobPosting.update({
        where: { id: job.id },
        data: { processed: true },
      });
    }

    // Analyze news articles
    const articles = await prisma.newsArticle.findMany({
      where: {
        companies: {
          has: lead.company.name,
        },
        processed: false,
      },
    });

    for (const article of articles) {
      await signalQueue.add('analyze-news', {
        leadId: lead.id,
        contentToAnalyze: `${article.title}\n\n${article.content}`,
        source: article.source,
        sourceUrl: article.url,
      });

      // Mark as processed
      await prisma.newsArticle.update({
        where: { id: article.id },
        data: { processed: true },
      });
    }

    console.log(`Queued signal detection jobs for lead ${leadId}`);
  }

  async stop() {
    await this.worker.close();
  }
}

// Run agent if executed directly
if (require.main === module) {
  const agent = new SignalAgent();
  console.log('Signal Detection Agent running...');
}
