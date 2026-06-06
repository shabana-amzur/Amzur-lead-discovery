/**
 * LinkedIn Web Scraper
 * Scrapes LinkedIn posts for service requirements
 * 
 * IMPORTANT: This is for educational/demo purposes only.
 * LinkedIn's Terms of Service prohibit automated scraping.
 * For production use, please use official LinkedIn API or authorized services.
 */

const puppeteer = require('puppeteer');

class LinkedInScraper {
  constructor(credentials = {}) {
    this.email = credentials.email || process.env.LINKEDIN_EMAIL;
    this.password = credentials.password || process.env.LINKEDIN_PASSWORD;
    this.browser = null;
    this.page = null;
  }

  /**
   * Initialize browser and login to LinkedIn
   */
  async init() {
    console.log('🚀 Starting LinkedIn scraper...');
    
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
      ],
    });

    this.page = await this.browser.newPage();
    
    // Set user agent to avoid detection
    await this.page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    if (this.email && this.password) {
      await this.login();
    }
  }

  /**
   * Login to LinkedIn
   */
  async login() {
    try {
      console.log('🔐 Logging in to LinkedIn...');
      
      await this.page.goto('https://www.linkedin.com/login', {
        waitUntil: 'networkidle2',
      });

      // Fill in credentials
      await this.page.type('#username', this.email);
      await this.page.type('#password', this.password);
      await this.page.click('button[type="submit"]');

      // Wait for redirect
      await this.page.waitForNavigation({ waitUntil: 'networkidle2' });
      
      console.log('✅ Successfully logged in');
    } catch (error) {
      console.error('❌ Login failed:', error.message);
      throw error;
    }
  }

  /**
   * Search for posts with specific keywords
   */
  async searchPosts(keyword, maxResults = 20) {
    try {
      console.log(`🔍 Searching for: "${keyword}"...`);
      
      // Navigate to LinkedIn search
      const searchUrl = `https://www.linkedin.com/search/results/content/?keywords=${encodeURIComponent(keyword)}&origin=SWITCH_SEARCH_VERTICAL`;
      await this.page.goto(searchUrl, { waitUntil: 'networkidle2' });

      // Wait for posts to load
      await this.page.waitForSelector('.feed-shared-update-v2', { timeout: 10000 });

      // Scroll to load more posts
      await this.autoScroll(maxResults);

      // Extract post data
      const posts = await this.page.evaluate(() => {
        const postElements = document.querySelectorAll('.feed-shared-update-v2');
        const results = [];

        postElements.forEach((post, index) => {
          try {
            // Extract author info
            const authorElement = post.querySelector('.feed-shared-actor__name');
            const authorName = authorElement?.innerText.trim() || '';
            
            const subtitleElement = post.querySelector('.feed-shared-actor__description');
            const authorTitle = subtitleElement?.innerText.trim() || '';

            // Extract content
            const contentElement = post.querySelector('.feed-shared-text');
            const content = contentElement?.innerText.trim() || '';

            // Extract engagement
            const likesElement = post.querySelector('[aria-label*="reaction"]');
            const likesText = likesElement?.getAttribute('aria-label') || '0';
            const likes = parseInt(likesText.match(/\d+/)?.[0] || '0');

            const commentsElement = post.querySelector('[aria-label*="comment"]');
            const commentsText = commentsElement?.innerText || '0';
            const comments = parseInt(commentsText.match(/\d+/)?.[0] || '0');

            // Extract post URL
            const linkElement = post.querySelector('.feed-shared-actor__meta a');
            const postUrl = linkElement?.href || '';

            // Extract timestamp
            const timeElement = post.querySelector('.feed-shared-actor__sub-description');
            const timeText = timeElement?.innerText || '';

            results.push({
              id: `linkedin-${Date.now()}-${index}`,
              authorName,
              authorTitle,
              content,
              postUrl,
              timeText,
              engagement: { likes, comments, shares: 0 },
            });
          } catch (e) {
            console.error('Error parsing post:', e);
          }
        });

        return results;
      });

      console.log(`✅ Found ${posts.length} posts`);
      return posts.slice(0, maxResults);
    } catch (error) {
      console.error(`❌ Search failed for "${keyword}":`, error.message);
      return [];
    }
  }

  /**
   * Auto scroll to load more posts
   */
  async autoScroll(maxPosts = 20) {
    await this.page.evaluate(async (maxPosts) => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 500;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          const postCount = document.querySelectorAll('.feed-shared-update-v2').length;
          
          if (totalHeight >= scrollHeight || postCount >= maxPosts) {
            clearInterval(timer);
            resolve();
          }
        }, 500);
      });
    }, maxPosts);
  }

  /**
   * Scrape multiple keywords
   */
  async scrapeMultipleKeywords(keywords, maxPerKeyword = 10) {
    const allPosts = [];
    
    for (const keyword of keywords) {
      const posts = await this.searchPosts(keyword, maxPerKeyword);
      allPosts.push(...posts);
      
      // Random delay to avoid rate limiting
      await this.delay(2000 + Math.random() * 3000);
    }

    // Remove duplicates by post URL
    const uniquePosts = Array.from(
      new Map(allPosts.map(post => [post.postUrl, post])).values()
    );

    return uniquePosts;
  }

  /**
   * Convert scraped posts to lead format
   */
  convertToLeads(posts) {
    const serviceKeywords = {
      'MVP as a Service': ['mvp', 'minimum viable product', 'prototype', 'startup'],
      'ERP (NetSuite)': ['netsuite', 'erp', 'enterprise resource planning'],
      'AI/ML Services': ['ai', 'machine learning', 'artificial intelligence', 'ml model'],
      'Custom App Development': ['app development', 'custom software', 'mobile app'],
      'Shopify': ['shopify', 'ecommerce', 'online store'],
    };

    return posts.map(post => {
      // Detect service type
      let serviceMatch = 'Custom App Development';
      let maxScore = 0;
      
      const contentLower = post.content.toLowerCase();
      Object.entries(serviceKeywords).forEach(([service, keywords]) => {
        const score = keywords.filter(kw => contentLower.includes(kw.toLowerCase())).length;
        if (score > maxScore) {
          maxScore = score;
          serviceMatch = service;
        }
      });

      // Calculate score and lead type
      const score = Math.min(85 + Math.floor(Math.random() * 15), 100);
      const daysAgo = this.parseDaysAgo(post.timeText);
      let leadType = 'Qualified Lead';
      if (daysAgo <= 1) leadType = 'Hot Lead - Posted recently';
      else if (daysAgo <= 3) leadType = 'Warm Lead - Active discussion';

      // Extract company name from author title
      const companyMatch = post.authorTitle.match(/at (.+?)(?:\||$)/);
      const companyName = companyMatch ? companyMatch[1].trim() : 'Unknown Company';

      const deadline = new Date();
      deadline.setDate(deadline.getDate() + (14 - daysAgo));

      return {
        id: post.id,
        companyName,
        website: `https://${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
        companyLinkedin: `https://linkedin.com/company/${companyName.toLowerCase().replace(/\s+/g, '-')}`,
        companyEmail: `info@${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
        industry: 'Technology',
        employeeCount: 50,
        geography: 'US',
        location: 'United States',
        status: 'new',
        score,
        leadType,
        companyServices: `Company seeking ${serviceMatch}`,
        requirement: post.content.substring(0, 500),
        approachStrategy: `Respond to LinkedIn post by ${post.authorName}. Posted ${post.timeText}. Engagement: ${post.engagement.likes} likes, ${post.engagement.comments} comments.`,
        evidenceLink: post.postUrl,
        deadline: deadline.toISOString().split('T')[0],
        serviceMatch,
        source: 'LinkedIn',
        signals: [
          {
            type: 'LinkedIn Post',
            content: `Posted ${post.timeText} - ${post.engagement.likes} likes`,
          },
          {
            type: 'Engagement',
            content: `${post.engagement.comments} comments showing interest`,
          },
        ],
        contacts: [
          {
            name: post.authorName,
            title: post.authorTitle,
            linkedin: post.postUrl,
            email: '',
            phone: '',
            decisionMaker: true,
          },
        ],
        createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
      };
    });
  }

  /**
   * Parse "X days ago" text to number
   */
  parseDaysAgo(timeText) {
    if (timeText.includes('hour') || timeText.includes('minute')) return 0;
    if (timeText.includes('1 day')) return 1;
    const match = timeText.match(/(\d+)\s*day/);
    return match ? parseInt(match[1]) : 7;
  }

  /**
   * Delay helper
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Close browser
   */
  async close() {
    if (this.browser) {
      await this.browser.close();
      console.log('👋 Browser closed');
    }
  }

  /**
   * Main scraping function
   */
  async scrape(keywords = [], maxPerKeyword = 10) {
    try {
      await this.init();
      const posts = await this.scrapeMultipleKeywords(keywords, maxPerKeyword);
      const leads = this.convertToLeads(posts);
      await this.close();
      return leads;
    } catch (error) {
      console.error('❌ Scraping failed:', error);
      await this.close();
      return [];
    }
  }
}

module.exports = { LinkedInScraper };
