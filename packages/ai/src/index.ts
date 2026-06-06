import OpenAI from 'openai';

export class AIService {
  private client: OpenAI;

  constructor(apiKey?: string) {
    this.client = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });
  }

  async detectBuyingSignal(content: string): Promise<{
    hasBuyingSignal: boolean;
    signalType: string | null;
    confidence: number;
    reasoning: string;
  }> {
    const prompt = `Analyze the following content and determine if it indicates a buying signal for IT services (Digital Engineering, Cloud, AI/ML, ERP, Managed Services, Cybersecurity).

Content: "${content}"

Respond in JSON format:
{
  "hasBuyingSignal": boolean,
  "signalType": "HIRING" | "TECHNOLOGY" | "FUNDING" | "GROWTH" | "PAIN_POINT" | "NEWS" | null,
  "confidence": 0-100,
  "reasoning": "explanation"
}`;

    const response = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  }

  async qualifyLead(leadData: any): Promise<{
    score: number;
    companyFit: number;
    serviceFit: number;
    intentScore: number;
    recommendation: string;
  }> {
    const prompt = `Qualify this lead and provide a score breakdown:

Lead Data:
${JSON.stringify(leadData, null, 2)}

Amzur Services:
- Digital Engineering (app dev, modernization, low-code)
- Cloud Services (AWS migration, Kubernetes, DevOps)
- AI/ML (computer vision, generative AI, chatbots)
- ERP (NetSuite implementation, ERP consulting)
- Managed Services (infrastructure, application support, QA)
- Cybersecurity (vulnerability management, security testing)

Scoring criteria:
- Company Fit (0-35): Industry, size, geography
- Service Fit (0-30): Match with Amzur services
- Intent Score (0-25): Buying signals strength
- Total: 0-100

Respond in JSON format with score breakdown and recommendation.`;

    const response = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  }

  async generateOutreach(params: {
    companyName: string;
    contactName: string;
    contactTitle: string;
    serviceType: string;
    signals: string[];
    type: 'email' | 'linkedin' | 'script';
  }): Promise<{ subject?: string; content: string }> {
    const prompts = {
      email: `Write a personalized cold email to ${params.contactName} (${params.contactTitle}) at ${params.companyName}.

Reference these buying signals:
${params.signals.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Pitch Amzur's ${params.serviceType} services.
Keep it under 150 words, professional tone, focus on their needs.

Format:
Subject: [subject line]
Body: [email body]`,

      linkedin: `Write a short LinkedIn connection message to ${params.contactName} at ${params.companyName}.
Reference: ${params.signals[0] || 'their recent activity'}
Mention Amzur's ${params.serviceType} services.
Max 300 characters, conversational tone.`,

      script: `Create a discovery call script for ${params.companyName}.
Contact: ${params.contactName} (${params.contactTitle})
Signals: ${params.signals.join(', ')}
Service: ${params.serviceType}

Include:
1. Opening (build rapport)
2. Discovery questions (5-7)
3. Value proposition
4. Next steps`,
    };

    const response = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompts[params.type] }],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content || '';

    if (params.type === 'email') {
      const [subjectLine, ...bodyLines] = content.split('\n');
      return {
        subject: subjectLine.replace('Subject:', '').trim(),
        content: bodyLines.join('\n').replace('Body:', '').trim(),
      };
    }

    return { content };
  }

  async extractCompanyInfo(text: string): Promise<{
    companyName: string | null;
    industry: string | null;
    services: string[];
    technologies: string[];
  }> {
    const prompt = `Extract company information from this text:

"${text}"

Return JSON:
{
  "companyName": string | null,
  "industry": string | null,
  "services": string[],
  "technologies": string[]
}`;

    const response = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      response_format: { type: 'json_object' },
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  }
}

export const ai = new AIService();
