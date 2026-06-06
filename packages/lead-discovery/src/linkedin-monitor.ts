/**
 * LinkedIn Post Monitor
 * Monitors LinkedIn for posts containing service requirements
 */

interface LinkedInPost {
  id: string;
  authorName: string;
  authorTitle: string;
  companyName: string;
  content: string;
  postUrl: string;
  postedAt: Date;
  hashtags: string[];
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
}

interface RequirementKeywords {
  service: string;
  keywords: string[];
}

const SERVICE_KEYWORDS: RequirementKeywords[] = [
  {
    service: 'MVP as a Service',
    keywords: ['MVP development', 'minimum viable product', 'prototype development', 'quick launch', 'startup MVP', 'product validation'],
  },
  {
    service: 'ERP (NetSuite)',
    keywords: ['ERP implementation', 'NetSuite', 'enterprise resource planning', 'ERP migration', 'financial system', 'ERP consultant'],
  },
  {
    service: 'AI/ML Services',
    keywords: ['AI development', 'machine learning', 'artificial intelligence', 'ML model', 'deep learning', 'neural network', 'AI integration'],
  },
  {
    service: 'Custom App Development',
    keywords: ['app development', 'custom software', 'web application', 'mobile app', 'software development', 'full stack'],
  },
  {
    service: 'Shopify',
    keywords: ['Shopify development', 'ecommerce development', 'Shopify store', 'Shopify expert', 'online store'],
  },
];

export class LinkedInMonitor {
  private apiKey: string;
  private webhookUrl: string;

  constructor(apiKey?: string, webhookUrl?: string) {
    this.apiKey = apiKey || process.env.LINKEDIN_API_KEY || '';
    this.webhookUrl = webhookUrl || process.env.WEBHOOK_URL || '';
  }

  /**
   * Fetch recent LinkedIn posts from specific search queries
   */
  async fetchPosts(searchQuery: string, maxResults = 50): Promise<LinkedInPost[]> {
    // This would use LinkedIn API or a third-party service
    // For demo, we'll use RapidAPI's LinkedIn scraper or similar service
    
    const posts: LinkedInPost[] = [];
    
    try {
      // Option 1: LinkedIn Official API (requires approval)
      // const response = await this.fetchFromLinkedInAPI(searchQuery);
      
      // Option 2: Third-party API (like Proxycurl, PhantomBuster, or ScrapingBee)
      const response = await this.fetchFromThirdPartyAPI(searchQuery, maxResults);
      
      return response;
    } catch (error) {
      console.error('Error fetching LinkedIn posts:', error);
      return posts;
    }
  }

  /**
   * Use third-party API to fetch LinkedIn posts
   */
  private async fetchFromThirdPartyAPI(query: string, maxResults: number): Promise<LinkedInPost[]> {
    // Example using Proxycurl or similar service
    // You'll need to sign up and get an API key
    
    const apiUrl = 'https://api.proxycurl.com/api/v2/linkedin/company/search';
    
    // For now, return mock data that looks like real LinkedIn posts
    return this.getMockLinkedInPosts();
  }

  /**
   * Monitor LinkedIn for posts with specific keywords
   */
  async monitorByKeywords(keywords: string[]): Promise<LinkedInPost[]> {
    const allPosts: LinkedInPost[] = [];
    
    for (const keyword of keywords) {
      const posts = await this.fetchPosts(keyword, 20);
      allPosts.push(...posts);
    }
    
    // Remove duplicates
    const uniquePosts = Array.from(
      new Map(allPosts.map(post => [post.id, post])).values()
    );
    
    return uniquePosts;
  }

  /**
   * Analyze post content to detect service requirements
   */
  analyzePost(post: LinkedInPost): { service: string; confidence: number } | null {
    const content = post.content.toLowerCase();
    
    for (const serviceConfig of SERVICE_KEYWORDS) {
      let matchCount = 0;
      
      for (const keyword of serviceConfig.keywords) {
        if (content.includes(keyword.toLowerCase())) {
          matchCount++;
        }
      }
      
      if (matchCount > 0) {
        const confidence = (matchCount / serviceConfig.keywords.length) * 100;
        return {
          service: serviceConfig.service,
          confidence: Math.min(confidence, 100),
        };
      }
    }
    
    return null;
  }

  /**
   * Convert LinkedIn post to lead format
   */
  convertPostToLead(post: LinkedInPost, analysis: { service: string; confidence: number }) {
    const now = new Date();
    const daysOld = Math.floor((now.getTime() - post.postedAt.getTime()) / (1000 * 60 * 60 * 24));
    
    let leadType = 'Qualified Lead';
    if (daysOld <= 2) leadType = 'Hot Lead - Recent Post';
    else if (daysOld <= 7) leadType = 'Warm Lead - Active';
    
    // Calculate deadline (14 days from post date)
    const deadline = new Date(post.postedAt);
    deadline.setDate(deadline.getDate() + 14);
    
    return {
      companyName: post.companyName,
      companyLinkedin: `https://linkedin.com/company/${post.companyName.toLowerCase().replace(/\s+/g, '-')}`,
      industry: 'Technology', // Would need to fetch from company profile
      geography: 'US', // Would need to detect from post or company profile
      status: 'new',
      score: Math.floor(analysis.confidence),
      leadType,
      requirement: post.content,
      evidenceLink: post.postUrl,
      deadline: deadline.toISOString().split('T')[0],
      serviceMatch: analysis.service,
      companyServices: `Company seeking ${analysis.service}`,
      approachStrategy: `Respond directly to LinkedIn post. Author: ${post.authorName} (${post.authorTitle}). Engagement: ${post.engagement.likes} likes, ${post.engagement.comments} comments.`,
      contacts: [
        {
          name: post.authorName,
          title: post.authorTitle,
          linkedin: post.postUrl,
          email: '', // Would need to enrich
          phone: '',
          decisionMaker: true,
        },
      ],
      signals: [
        {
          type: 'LinkedIn Post',
          content: `Posted ${daysOld} days ago with ${post.engagement.likes} likes`,
        },
        {
          type: 'Engagement',
          content: `${post.engagement.comments} comments - high interest`,
        },
      ],
      source: 'LinkedIn',
      createdAt: post.postedAt,
    };
  }

  /**
   * Get mock LinkedIn posts for demo (to be replaced with real API)
   */
  private getMockLinkedInPosts(): LinkedInPost[] {
    const now = new Date();
    
    return [
      {
        id: 'linkedin-1',
        authorName: 'Sarah Chen',
        authorTitle: 'CTO at DataStream Analytics',
        companyName: 'DataStream Analytics',
        content: 'Looking for an experienced development team to build our MVP. We need a data analytics dashboard with AI-powered insights. Timeline: 8 weeks. Tech stack: React, Node.js, Python. Budget approved. DM if interested! #MVPdevelopment #StartupLife #TechPartner',
        postUrl: 'https://linkedin.com/posts/sarah-chen-cto_mvpdevelopment-activity-7204567890',
        postedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        hashtags: ['MVPdevelopment', 'StartupLife', 'TechPartner'],
        engagement: { likes: 45, comments: 12, shares: 3 },
      },
      {
        id: 'linkedin-2',
        authorName: 'Michael Rodriguez',
        authorTitle: 'VP Operations at RetailCo',
        companyName: 'RetailCo',
        content: 'Our company is urgently seeking a NetSuite implementation partner. We have 30+ locations and need to consolidate our financial systems. Experience with retail industry required. Please reach out if you specialize in ERP implementations. #NetSuite #ERP #RetailTech',
        postUrl: 'https://linkedin.com/posts/michael-rodriguez-vp_netsuite-activity-7204123456',
        postedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        hashtags: ['NetSuite', 'ERP', 'RetailTech'],
        engagement: { likes: 67, comments: 23, shares: 8 },
      },
      {
        id: 'linkedin-3',
        authorName: 'Dr. Emily Watson',
        authorTitle: 'Chief Medical Officer at HealthTech Innovations',
        companyName: 'HealthTech Innovations',
        content: 'Seeking AI/ML experts to develop our predictive health analytics platform. We have anonymized patient data and need help building ML models for early disease detection. Must have healthcare experience and HIPAA knowledge. Series B funded. #AIHealthcare #MachineLearning',
        postUrl: 'https://linkedin.com/posts/dr-emily-watson_aihealthcare-activity-7203890123',
        postedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        hashtags: ['AIHealthcare', 'MachineLearning'],
        engagement: { likes: 156, comments: 34, shares: 15 },
      },
      {
        id: 'linkedin-4',
        authorName: 'James Sullivan',
        authorTitle: 'Founder & CEO at FashionHub',
        companyName: 'FashionHub',
        content: 'We\'re launching our sustainable fashion e-commerce platform and need Shopify experts ASAP! Custom theme development, payment gateway integration, and inventory management required. Already have designs ready. Timeline: 6 weeks. #Shopify #Ecommerce #SustainableFashion',
        postUrl: 'https://linkedin.com/posts/james-sullivan-ceo_shopify-activity-7204890456',
        postedAt: new Date(now.getTime() - 0.5 * 24 * 60 * 60 * 1000), // 12 hours ago
        hashtags: ['Shopify', 'Ecommerce', 'SustainableFashion'],
        engagement: { likes: 89, comments: 19, shares: 5 },
      },
      {
        id: 'linkedin-5',
        authorName: 'Lisa Park',
        authorTitle: 'Head of Digital at GlobalBank',
        companyName: 'GlobalBank',
        content: 'Looking for a development partner to build our customer mobile banking app. Native iOS and Android required. Need team experienced with financial services, security, and compliance. $2M budget allocated. RFP process starting next week. #FinTech #MobileApp #Banking',
        postUrl: 'https://linkedin.com/posts/lisa-park-digital_fintech-activity-7204234567',
        postedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        hashtags: ['FinTech', 'MobileApp', 'Banking'],
        engagement: { likes: 203, comments: 56, shares: 12 },
      },
    ];
  }

  /**
   * Start monitoring LinkedIn for new posts (to be run as background job)
   */
  async startMonitoring(intervalMinutes = 30) {
    console.log(`Starting LinkedIn monitoring (checking every ${intervalMinutes} minutes)...`);
    
    const monitor = async () => {
      try {
        const allKeywords = SERVICE_KEYWORDS.flatMap(s => s.keywords);
        const posts = await this.monitorByKeywords(allKeywords.slice(0, 5)); // Limit API calls
        
        const leads = posts
          .map(post => {
            const analysis = this.analyzePost(post);
            return analysis ? this.convertPostToLead(post, analysis) : null;
          })
          .filter(lead => lead !== null);
        
        console.log(`Found ${leads.length} new leads from LinkedIn`);
        
        // Send to webhook or save to database
        if (this.webhookUrl && leads.length > 0) {
          await this.sendToWebhook(leads);
        }
        
        return leads;
      } catch (error) {
        console.error('LinkedIn monitoring error:', error);
        return [];
      }
    };
    
    // Run immediately
    await monitor();
    
    // Then run on interval
    setInterval(monitor, intervalMinutes * 60 * 1000);
  }

  private async sendToWebhook(leads: any[]) {
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leads, source: 'LinkedIn', timestamp: new Date() }),
      });
      
      if (!response.ok) {
        console.error('Webhook failed:', response.statusText);
      }
    } catch (error) {
      console.error('Webhook error:', error);
    }
  }
}

export default LinkedInMonitor;
