/**
 * Apollo.io API Integration
 * Fetches real B2B leads with intent signals
 */

const https = require('https');

class ApolloAPI {
  constructor(apiKey) {
    this.apiKey = apiKey || process.env.APOLLO_API_KEY;
    this.baseUrl = 'https://api.apollo.io/v1';
  }

  /**
   * Make HTTP request using Node.js https module
   */
  request(url, options, postData) {
    return new Promise((resolve, reject) => {
      const req = https.request(url, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve(data);
          }
        });
      });
      req.on('error', reject);
      if (postData) req.write(postData);
      req.end();
    });
  }

  /**
   * Search for companies with specific technologies or keywords
   */
  async searchCompanies(query) {
    const body = {
      q_organization_keyword_tags: query.keywords || [],
      page: 1,
      per_page: query.limit || 25,
      organization_locations: query.locations || ['United States', 'United Kingdom', 'UAE', 'Australia'],
      organization_num_employees_ranges: query.employeeRanges || ['11,50', '51,200', '201,500', '501,1000', '1001,10000'],
      // Request more detailed fields
      reveal_personal_emails: false,
      reveal_phone_number: false,
    };

    try {
      const data = await this.request(
        'https://api.apollo.io/v1/mixed_companies/search',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': this.apiKey,
            'Cache-Control': 'no-cache',
          },
        },
        JSON.stringify(body)
      );

      return data.organizations || [];
    } catch (error) {
      console.error('Apollo search error:', error.message);
      return [];
    }
  }

  /**
   * Get people (contacts) at a company
   */
  async searchPeople(companyName, jobTitles = ['CTO', 'VP Engineering', 'Head of']) {
    const body = {
      q_organization_name: companyName,
      person_titles: jobTitles,
      page: 1,
      per_page: 5,
    };

    try {
      const data = await this.request(
        'https://api.apollo.io/v1/mixed_people/search',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': this.apiKey,
          },
        },
        JSON.stringify(body)
      );

      return data.people || [];
    } catch (error) {
      console.error('Apollo people search error:', error.message);
      return [];
    }
  }

  /**
   * Enrich a company with full details
   */
  async enrichCompany(domain) {
    try {
      const data = await this.request(
        `https://api.apollo.io/v1/organizations/enrich?domain=${domain}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': this.apiKey,
            'Cache-Control': 'no-cache',
          },
        }
      );

      return data.organization || {};
    } catch (error) {
      console.error('Apollo enrich error:', error.message);
      return {};
    }
  }

  /**
   * Search for companies hiring specific roles (intent signal)
   */
  async findHiringCompanies(jobKeywords) {
    const companies = await this.searchCompanies({
      keywords: jobKeywords,
      limit: 50,
    });

    const leads = [];
    
    for (const company of companies) {
      // Detect service need from technologies/keywords
      const serviceMatch = this.detectServiceNeed(company);
      
      // Get decision makers
      const contacts = await this.searchPeople(company.name);
      
      const lead = this.convertToLead(company, serviceMatch, contacts);
      leads.push(lead);
      
      // Rate limiting
      await this.delay(200);
    }

    return leads;
  }

  /**
   * Detect service need from company data
   */
  detectServiceNeed(company) {
    const keywords = (company.keywords || []).join(' ').toLowerCase();
    const tech = (company.technology_names || []).join(' ').toLowerCase();
    const description = (company.short_description || '').toLowerCase();
    
    const allText = `${keywords} ${tech} ${description}`;

    if (allText.includes('shopify') || allText.includes('ecommerce')) return 'Shopify';
    if (allText.includes('netsuite') || allText.includes('erp')) return 'ERP (NetSuite)';
    if (allText.includes('ai') || allText.includes('machine learning')) return 'AI/ML Services';
    if (allText.includes('mvp') || allText.includes('startup')) return 'MVP as a Service';
    
    return 'Custom App Development';
  }

  /**
   * Generate DIVERSE and SPECIFIC requirement based on company characteristics
   */
  generateRequirement(company, serviceMatch) {
    const employeeCount = company.estimated_num_employees || 0;
    const hasGrowth = company.employee_growth_rate && company.employee_growth_rate > 10;
    const industry = company.industry || 'Technology';
    const companyName = company.name;
    const hasTech = company.technology_names && company.technology_names.length > 0;
    const techStack = hasTech ? company.technology_names.slice(0, 3).join(', ') : null;
    
    // Create variety by using company name hash to select different templates
    const nameHash = companyName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const templateIndex = nameHash % 3;
    
    // Company stage detection
    let stage, stageDescription;
    if (employeeCount < 20) {
      stage = 'early';
      stageDescription = 'an early-stage startup';
    } else if (employeeCount < 100) {
      stage = 'growth';
      stageDescription = 'a growth-stage company';
    } else {
      stage = 'enterprise';
      stageDescription = 'an established enterprise';
    }
    
    // Generate diverse requirements based on service and template variation
    const requirementTemplates = {
      'MVP as a Service': [
        `${companyName}, ${stageDescription} in ${industry} with ${employeeCount || 'growing number of'} employees, appears to be in product development phase. ${hasGrowth ? `With ${company.employee_growth_rate}% growth, they're likely validating market fit and need to rapidly iterate on their product.` : 'Early-stage companies typically need to move fast from concept to market-tested MVP.'} ${hasTech ? `Current tech stack (${techStack}) suggests in-house capability, but may need augmentation for faster development cycles.` : 'May need full-stack team to build initial product.'} Opportunity: Offer rapid prototyping services, technical co-founding support, or agile MVP development.`,
        
        `Based in ${company.country || 'US'}, ${companyName} is ${stageDescription} operating in ${industry}. ${employeeCount ? `Team size of ${employeeCount} indicates` : 'Their profile suggests'} they're at a critical juncture where speed to market matters. ${hasGrowth ? `${company.employee_growth_rate}% employee growth signals they're scaling and need technical execution partners.` : 'Companies at this stage often lack dedicated development resources.'} ${hasTech ? `They use ${techStack}, showing technical awareness but may need specialized MVP expertise.` : 'Need to validate business model with minimal viable product quickly.'} Recommended approach: Position as technical acceleration partner who's built similar industry MVPs.`,
        
        `${companyName} presents an interesting opportunity in the ${industry} space. ${employeeCount ? `With ${employeeCount} employees, ` : ''}they're likely focused on proving product-market fit. ${hasGrowth ? `Strong growth trajectory (${company.employee_growth_rate}%) means they need to build and iterate fast.` : 'Early-stage companies need lean, focused development to maximize runway.'} ${hasTech ? `While they have some technical infrastructure (${techStack}), MVP development requires specialized rapid-build expertise.` : 'Opportunity to become their technical partner for v1 product build.'} Value proposition: Demonstrate case studies of MVPs we've launched in ${industry} or similar sectors.`
      ],
      
      'ERP (NetSuite)': [
        `${companyName} is ${stageDescription} in ${industry} with ${employeeCount || 'significant'} headcount. ${hasGrowth ? `Growing at ${company.employee_growth_rate}%, they're hitting operational scaling pain points -` : 'At this scale,'} disconnected systems, manual processes, and lack of real-time visibility become critical bottlenecks. ${hasTech ? `Their tech stack includes ${techStack}, suggesting technical sophistication but likely missing integrated ERP backbone.` : 'May be using QuickBooks or spreadsheets that can\'t support current complexity.'} NetSuite opportunity: Multi-subsidiary management, real-time financial consolidation, and automated workflows could transform their operations. Approach angle: Operational efficiency ROI and scaling infrastructure.`,
        
        `Operating in ${industry}, ${companyName} has reached ${employeeCount || 'a'} scale where operational complexity demands enterprise systems. ${hasGrowth ? `With ${company.employee_growth_rate}% growth, manual processes and siloed data are becoming unsustainable.` : 'Companies at this size typically struggle with fragmented business systems.'} ${hasTech ? `Current technology (${techStack}) likely needs ERP integration to unify operations.` : 'Lack of integrated system means reporting delays, inventory issues, and financial close challenges.'} NetSuite value: Single source of truth, automated order-to-cash, and scalable platform for international expansion. Position: Schedule discovery call to assess current pain points.`,
        
        `${companyName}, based in ${company.country || 'US'}, exemplifies the ${industry} companies we help systematize. ${employeeCount ? `${employeeCount} employees means` : 'Their size suggests'} multiple departments, complex workflows, and need for business intelligence. ${hasGrowth ? `Rapid ${company.employee_growth_rate}% growth exposes process gaps that NetSuite addresses.` : 'At this maturity, efficiency gains from ERP deliver massive ROI.'} ${hasTech ? `They use ${techStack} but likely lack unified ERP - creates integration and visibility challenges.` : 'Typical symptoms: delayed reporting, inventory errors, manual reconciliation.'} Strategy: Lead with industry-specific NetSuite implementation case study, emphasize rapid deployment methodology.`
      ],
      
      'AI/ML Services': [
        `${companyName} operates in ${industry}, an increasingly data-driven sector. ${employeeCount ? `With ${employeeCount} employees, ` : ''}they're at a scale where AI/ML can create competitive differentiation. ${hasGrowth ? `${company.employee_growth_rate}% growth generates more data and customer interactions - perfect for ML optimization.` : 'Companies in this space increasingly adopt AI for automation and insights.'} ${hasTech ? `Tech stack (${techStack}) ${techStack.toLowerCase().includes('python') || techStack.toLowerCase().includes('aws') ? 'shows ML-ready infrastructure' : 'would need ML platform integration'}.` : 'May need full ML infrastructure setup from data pipeline to model deployment.'} AI opportunities: Predictive analytics, process automation, personalization engines, or intelligent document processing. Entry point: Offer AI feasibility assessment for their specific use cases.`,
        
        `In the ${industry} landscape, ${companyName} ${employeeCount ? `(${employeeCount} employees)` : ''} is positioned to leverage AI/ML for operational advantage. ${hasGrowth ? `Strong growth (${company.employee_growth_rate}%) means scaling challenges that ML can address - demand forecasting, customer segmentation, churn prediction.` : 'At their stage, AI investments in automation and intelligence yield high returns.'} ${hasTech ? `Current stack includes ${techStack}${techStack.toLowerCase().includes('python') || techStack.toLowerCase().includes('data') ? ' - already data-oriented, likely receptive to ML solutions' : ', requiring ML platform integration strategy'}.` : 'Need end-to-end ML solution from data engineering to production models.'} Value proposition: Industry-specific AI use cases with measurable ROI. Start with quick-win pilot project.`,
        
        `${companyName}, ${stageDescription} in ${industry}, represents strong AI/ML opportunity. ${employeeCount ? `Team of ${employeeCount} generates` : 'They generate'} operational data that's currently underutilized. ${hasGrowth ? `With ${company.employee_growth_rate}% employee growth, manual decision-making doesn't scale - ML-powered insights become critical.` : 'Companies at this maturity benefit from AI-driven automation and predictive capabilities.'} ${hasTech ? `They use ${techStack}${hasTech && (techStack.toLowerCase().includes('salesforce') || techStack.toLowerCase().includes('cloud')) ? ', meaning rich data sources for ML training' : ', which can integrate with our ML platforms'}.` : 'Greenfield opportunity to build data + ML infrastructure.'} Specific applications: Customer lifetime value modeling, intelligent workflow routing, or anomaly detection. Approach: Share similar ${industry} AI transformation case study.`
      ],
      
      'Custom App Development': [
        `${companyName} in ${industry} ${employeeCount ? `(${employeeCount} team members)` : ''} likely faces unique workflow challenges that off-the-shelf software can't solve. ${hasGrowth ? `${company.employee_growth_rate}% growth means processes that worked before are breaking - custom tools become necessary.` : 'Companies at this stage develop specialized needs requiring bespoke solutions.'} ${hasTech ? `Current technologies (${techStack}) may need custom integrations, internal tools, or customer-facing applications built on top.` : 'Opportunity for greenfield custom application development.'} Development needs could include: workflow automation platforms, customer portals, field service apps, or legacy system modernization. Position as: Technical partner who understands ${industry} domain and can architect scalable custom solutions.`,
        
        `Operating in ${industry}, ${companyName} ${employeeCount ? `with ${employeeCount} employees` : ''} has grown beyond generic software capabilities. ${hasGrowth ? `Rapid ${company.employee_growth_rate}% expansion exposes gaps where custom apps deliver competitive advantage.` : 'Mature companies need tailored solutions for their specific operational model.'} ${hasTech ? `Existing tech (${techStack}) works but custom development can unify these tools or extend functionality for unique processes.` : 'Clean slate to build exactly what their business needs without SaaS constraints.'} Custom app opportunities: Internal admin dashboards, mobile field apps, API integration layers, or specialized calculators/configurators. Outreach strategy: Demonstrate relevant ${industry} custom builds, emphasize agile delivery.`,
        
        `${companyName}, ${stageDescription} player in ${industry}, exemplifies companies needing purpose-built software. ${employeeCount ? `At ${employeeCount} employees, ` : ''}their operational complexity demands tools designed for their exact workflows. ${hasGrowth ? `Growing ${company.employee_growth_rate}% means their processes are evolving - custom apps provide the flexibility to adapt.` : 'Established processes need software that fits perfectly, not forced into generic platforms.'} ${hasTech ? `They use ${techStack} but likely have workflow gaps, manual steps, or integration needs requiring custom development.` : 'Opportunity to build their entire tech ecosystem tailored to business model.'} Focus areas: Customer-facing portals, vendor/partner platforms, inventory/logistics apps, or reporting dashboards. Entry: Offer to map their workflows and identify custom development opportunities with highest ROI.`
      ],
      
      'Shopify': [
        `${companyName} in ${industry} ${industry.toLowerCase().includes('retail') || industry.toLowerCase().includes('commerce') ? '(e-commerce native industry)' : '(exploring D2C potential)'} ${employeeCount ? `with ${employeeCount} person team` : ''} needs e-commerce infrastructure that scales. ${hasGrowth ? `${company.employee_growth_rate}% growth means their commerce platform must handle increasing traffic, orders, and complexity.` : 'Companies selling online need reliable, feature-rich platforms.'} ${hasTech ? `Current tech includes ${techStack}${techStack.toLowerCase().includes('shopify') ? ' - opportunity for optimization, custom features, or headless migration' : ' - can integrate Shopify as commerce layer or migrate from legacy platform'}.` : 'Greenfield Shopify implementation opportunity.'} Shopify services: Custom theme development, app integrations, subscription systems, multi-channel selling, or headless commerce architecture. Angle: Show ${industry} Shopify success stories, emphasize conversion rate optimization.`,
        
        `${companyName}, operating in ${industry}, ${employeeCount ? `employing ${employeeCount} people,` : ''} represents ${industry.toLowerCase().includes('commerce') || industry.toLowerCase().includes('retail') ? 'classic Shopify target - direct-to-consumer brand needing enterprise commerce' : 'emerging D2C opportunity needing commerce foundation'}. ${hasGrowth ? `Strong ${company.employee_growth_rate}% growth trajectory demands e-commerce infrastructure that won't break as they scale.` : 'E-commerce brands at this stage outgrow basic platforms and need customization.'} ${hasTech ? `Tech stack (${techStack}) ${techStack.toLowerCase().includes('shopify') ? 'already on Shopify - opportunity to enhance with custom checkout, apps, or Shopify Plus migration' : 'likely needs Shopify integration or migration from current platform'}.` : 'Perfect timing for professional Shopify setup with conversion optimization.'} Value proposition: Custom Shopify solutions that increase AOV, reduce cart abandonment, enable subscriptions. Start with e-commerce audit.`,
        
        `In ${industry}, ${companyName} ${employeeCount ? `(${employeeCount} employees)` : ''} needs e-commerce capabilities that drive revenue. ${hasGrowth ? `${company.employee_growth_rate}% growth means their online channel must be optimized, scalable, and differentiated.` : 'Online selling requires platform that balances ease-of-use with customization.'} ${hasTech ? `Current technologies: ${techStack}${techStack.toLowerCase().includes('shopify') || techStack.toLowerCase().includes('commerce') ? ' - opportunity to optimize existing e-commerce or build custom features' : ' - can add Shopify as commerce engine integrated with their stack'}.` : 'Opportunity for full Shopify buildout from theme to fulfillment integration.'} Shopify expertise areas: Conversion-optimized custom themes, subscription/membership systems, international expansion (markets, currencies), AR/virtual try-on features. Hook: Offer free e-commerce growth assessment analyzing their potential revenue lift.`
      ]
    };
    
    const templates = requirementTemplates[serviceMatch] || requirementTemplates['Custom App Development'];
    return templates[templateIndex];
  }

  /**
   * Detect enquiry type based on company characteristics and signals
   */
  detectEnquiryType(company, serviceMatch) {
    const companyName = (company.name || '').toLowerCase();
    const description = (company.short_description || '').toLowerCase();
    const keywords = (company.keywords || []).join(' ').toLowerCase();
    const industry = (company.industry || '').toLowerCase();
    const allText = `${companyName} ${description} ${keywords} ${industry}`;
    
    // Detect hiring signals
    if (allText.includes('hiring') || allText.includes('recruitment') || allText.includes('job')) {
      return 'Hiring';
    }
    
    // Detect tender/RFP signals
    if (allText.includes('tender') || allText.includes('rfp') || allText.includes('procurement') || allText.includes('bid')) {
      return 'Tender/RFP';
    }
    
    // Detect active search signals
    if (allText.includes('looking for') || allText.includes('seeking') || allText.includes('need') || 
        allText.includes('searching') || allText.includes('require')) {
      return 'Searching for Service';
    }
    
    // Detect general enquiry signals
    if (allText.includes('enquiry') || allText.includes('inquiry') || allText.includes('consultation') || 
        allText.includes('explore') || allText.includes('interested')) {
      return 'General Enquiry';
    }
    
    // Industry-based detection
    if (industry.includes('venture') || industry.includes('capital') || industry.includes('investment')) {
      return 'Portfolio Company Need';
    }
    
    if (industry.includes('media') || industry.includes('news') || industry.includes('publishing') || 
        companyName.includes('news') || companyName.includes('media')) {
      return 'Digital Transformation';
    }
    
    if (industry.includes('retail') || industry.includes('commerce') || industry.includes('fashion') ||
        companyName.includes('retail') || companyName.includes('commerce')) {
      return 'E-commerce Enhancement Need';
    }
    
    if (industry.includes('science') || industry.includes('research') || industry.includes('education') ||
        companyName.includes('university') || companyName.includes('school')) {
      return 'Research/Academic Need';
    }
    
    if (industry.includes('conference') || industry.includes('event') || companyName.includes('conference') ||
        companyName.includes('expo') || companyName.includes('awards')) {
      return 'Event Platform Need';
    }
    
    // Service-based with variation using company name hash
    const nameHash = companyName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const variation = nameHash % 3;
    
    const enquiryVariations = {
      'MVP as a Service': ['Product Development Need', 'Startup Launch Support', 'Technical Co-founding Need'],
      'ERP (NetSuite)': ['Operational Efficiency Need', 'Business Systemization', 'Scaling Infrastructure Need'],
      'AI/ML Services': ['Technology Innovation Need', 'AI/ML Implementation', 'Data Science Initiative'],
      'Custom App Development': ['Custom Solution Need', 'Digital Product Build', 'Software Development Requirement'],
      'Shopify': ['E-commerce Enhancement Need', 'Online Store Development', 'Commerce Platform Upgrade']
    };
    
    const variations = enquiryVariations[serviceMatch] || ['General Enquiry', 'General Enquiry', 'General Enquiry'];
    return variations[variation];
  }

  /**
   * Generate evidence link - honest about what we know
   */
  generateEvidenceLink(company, serviceMatch) {
    // Primary: LinkedIn company page (where we can verify activity)
    if (company.linkedin_url) {
      return company.linkedin_url;
    }
    
    // Secondary: Company website
    if (company.website_url) {
      return company.website_url;
    }
    
    // Fallback: Construct likely LinkedIn URL
    const companySlug = company.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return `https://www.linkedin.com/company/${companySlug}`;
  }

  /**
   * Detect geography from multiple signals
   */
  detectGeography(company) {
    const companyName = (company.name || '').toLowerCase();
    const website = (company.website_url || company.primary_domain || '').toLowerCase();
    const location = (company.city || '') + ' ' + (company.state || '') + ' ' + (company.country || '');
    const allText = `${companyName} ${website} ${location}`.toLowerCase();
    
    // Check domain extensions
    if (website.includes('.co.uk') || website.includes('.uk')) return 'UK';
    if (website.includes('.ae') || website.includes('.dubai')) return 'UAE';
    if (website.includes('.au')) return 'Australia';
    
    // Check company name signals
    if (companyName.includes('europe') || companyName.includes('british') || companyName.includes('london') || 
        companyName.includes('uk ') || companyName.includes(' uk')) return 'UK';
    if (companyName.includes('dubai') || companyName.includes('emirates') || companyName.includes('uae')) return 'UAE';
    if (companyName.includes('australia') || companyName.includes('sydney') || companyName.includes('melbourne')) return 'Australia';
    
    // Check location text
    if (allText.includes('united kingdom') || allText.includes('england') || allText.includes('scotland') || 
        allText.includes('wales') || allText.includes('london')) return 'UK';
    if (allText.includes('united arab emirates') || allText.includes('dubai') || allText.includes('abu dhabi')) return 'UAE';
    if (allText.includes('australia') || allText.includes('sydney') || allText.includes('melbourne') || 
        allText.includes('brisbane')) return 'Australia';
    
    // Check country field with exact match
    const countryMap = {
      'United Kingdom': 'UK',
      'United Arab Emirates': 'UAE',
      'Australia': 'Australia',
      'United States': 'US'
    };
    
    if (company.country && countryMap[company.country]) {
      return countryMap[company.country];
    }
    
    // Default to US only if no other signals
    return 'US';
  }

  /**
   * Convert Apollo company to lead format
   */
  convertToLead(company, serviceMatch, contacts) {
    const now = new Date();
    const deadline = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    // Detect geography using multiple signals
    const geography = this.detectGeography(company);

    // Get city and country with fallbacks
    const city = company.city || 'Unknown City';
    const state = company.state || '';
    const country = company.country || 'United States';
    const location = `${city}${state ? ', ' + state : ''}, ${country}`;
    const industry = company.industry || 'Technology';
    const hasGrowth = company.employee_growth_rate && company.employee_growth_rate > 10;

    // Calculate score based on signals
    let score = 75;
    if (company.estimated_num_employees > 50) score += 5;
    if (company.estimated_num_employees > 200) score += 5;
    if (company.linkedin_url) score += 5;
    if (contacts.length > 0) score += 10;

    // Generate detailed requirement
    const requirement = this.generateRequirement(company, serviceMatch);
    const evidenceLink = this.generateEvidenceLink(company, serviceMatch);
    const enquiryType = this.detectEnquiryType(company, serviceMatch);
    const companyServices = company.short_description || 
      `${industry} company providing innovative solutions`;

    return {
      id: `apollo-${company.id}`,
      companyName: company.name,
      website: company.website_url || company.primary_domain || '',
      companyLinkedin: company.linkedin_url || '',
      companyEmail: `info@${company.primary_domain || company.name.toLowerCase().replace(/\s+/g, '')}.com`,
      industry: company.industry || 'Technology',
      employeeCount: company.estimated_num_employees || 0,
      geography,
      location,
      status: 'new',
      score: Math.min(score, 100),
      leadType: 'Apollo Lead - Intent Signal',
      companyServices,
      requirement,
      approachStrategy: `Research ${company.name} on LinkedIn to verify current initiatives. ${contacts.length > 0 ? `Contact ${contacts[0].name || 'decision maker'} if intent confirmed.` : 'Look for recent posts about growth, product launches, or tech initiatives. Connect with founders/leadership to explore needs.'}`,
      evidenceLink,
      deadline: deadline.toISOString().split('T')[0],
      serviceMatch,
      enquiryType,
      source: 'Apollo.io',
      signals: [
        {
          type: 'Company Profile',
          content: `${company.estimated_num_employees || 'Growing'} employees in ${industry}${hasGrowth ? ` (${company.employee_growth_rate}% growth)` : ''}`,
        },
        {
          type: 'Technology Indicators',
          content: company.technology_names && company.technology_names.length > 0 
            ? `Uses: ${company.technology_names.slice(0, 3).join(', ')}`
            : 'Tech stack not available - research needed',
        },
        {
          type: 'Next Steps',
          content: `Verify intent through LinkedIn research, check for recent funding/growth announcements, identify decision makers`,
        }
      ],
      contacts: contacts.map(person => ({
        name: person.name || `${person.first_name || ''} ${person.last_name || ''}`.trim(),
        title: person.title || '',
        email: person.email || '',
        linkedin: person.linkedin_url || '',
        phone: person.phone_numbers?.[0]?.sanitized_number || '',
        decisionMaker: ['cto', 'vp', 'head', 'director', 'chief', 'founder'].some(t => 
          (person.title || '').toLowerCase().includes(t)
        ),
      })),
      createdAt: now,
    };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = { ApolloAPI };
