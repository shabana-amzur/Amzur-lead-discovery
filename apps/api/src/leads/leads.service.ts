import { Injectable } from '@nestjs/common';
import { CreateLeadDto, UpdateLeadDto, LeadFilterDto } from './dto';

@Injectable()
export class LeadsService {
  // Comprehensive lead data organized by geography with detailed outreach information
  private leads = [
    // United States Leads (4 leads)
    {
      id: '1',
      companyName: 'CloudTech Solutions',
      website: 'https://cloudtech-solutions.com',
      companyLinkedin: 'https://linkedin.com/company/cloudtech-solutions',
      companyEmail: 'info@cloudtech-solutions.com',
      industry: 'Technology',
      employeeCount: 850,
      geography: 'US',
      location: 'San Francisco, CA, United States',
      status: 'qualified',
      score: 95,
      leadType: 'Hot Lead - Active Job Posting',
      companyServices: 'Leading SaaS platform provider for enterprise project management and collaboration tools. Serving 2,000+ customers including Fortune 500 companies. Core products: CloudProject Pro, TeamSync, and DataVault.',
      requirement: 'Currently operating 200+ legacy on-premise servers across 3 data centers with increasing maintenance costs ($12M annually). Planning complete AWS cloud migration affecting 50+ microservices, 150TB of data, and 24/7 operations serving 2M+ users. Critical requirements: Zero-downtime migration, Kubernetes orchestration, CI/CD pipeline automation, auto-scaling infrastructure, disaster recovery setup, and compliance with SOC 2 Type II. Project scope includes containerizing applications, implementing GitOps workflows, setting up monitoring/alerting with Prometheus/Grafana, and training internal DevOps team. Timeline: Discovery phase by July 2024, migration completion by December 2024.',
      approachStrategy: 'Lead with AWS migration case studies. Emphasize Amzur\'s cloud-native expertise and successful Kubernetes implementations. Request discovery call to discuss their current infrastructure and pain points.',
      evidenceLink: 'https://linkedin.com/jobs/view/aws-solutions-architect-cloudtech-3847291',
      deadline: '2024-06-20',
      serviceMatch: 'Custom App Development',
      signals: [
        { type: 'Hiring', content: 'Active job posting: Senior AWS Solutions Architect - posted 3 days ago' },
        { type: 'Technology', content: 'CTO mentioned cloud migration initiative in recent LinkedIn post' },
        { type: 'Pain Point', content: 'Current infrastructure costs increasing 40% annually' },
      ],
      contacts: [
        { 
          name: 'James Martinez', 
          title: 'CTO', 
          email: 'james.martinez@cloudtech-solutions.com', 
          linkedin: 'https://linkedin.com/in/jamesmartinez-cto',
          phone: '+1-415-555-0123',
          decisionMaker: true
        },
        { 
          name: 'Emily Chen', 
          title: 'VP Engineering', 
          email: 'emily.chen@cloudtech-solutions.com', 
          linkedin: 'https://linkedin.com/in/emilychen-vp',
          phone: '+1-415-555-0124',
          decisionMaker: false
        },
      ],
      createdAt: new Date('2024-06-01'),
    },
    {
      id: '2',
      companyName: 'HealthFirst Medical Group',
      website: 'https://healthfirst-medical.com',
      companyLinkedin: 'https://linkedin.com/company/healthfirst-medical',
      companyEmail: 'contact@healthfirst-medical.com',
      industry: 'Healthcare',
      employeeCount: 450,
      geography: 'US',
      location: 'Boston, MA, United States',
      status: 'qualified',
      score: 88,
      leadType: 'Warm Lead - Funding Event',
      companyServices: 'Multi-specialty medical group operating 12 clinics across New England. Specializing in primary care, cardiology, and radiology services. Processing 50,000+ patient visits monthly with focus on preventive care and early diagnosis.',
      requirement: 'Developing next-generation AI diagnostic platform to reduce diagnosis time by 60% and improve accuracy by 40%. Project involves: Building deep learning models for analyzing X-rays, MRIs, and CT scans; Creating computer vision system to detect early signs of cancer, cardiac issues, and neurological conditions; Processing 10,000+ medical images daily; Integrating with existing Epic EHR system; Ensuring HIPAA compliance and FDA approval pathway. Need expertise in TensorFlow/PyTorch, medical imaging standards (DICOM), model training on GPU clusters, and deploying HIPAA-compliant cloud infrastructure. Budget: $8M from Series B funding allocated for 18-month development cycle. Target: FDA clearance by Q2 2026.',
      approachStrategy: 'Highlight Amzur\'s healthcare AI experience and HIPAA compliance. Share similar healthcare ML implementation case studies. Emphasize rapid development capabilities.',
      evidenceLink: 'https://techcrunch.com/2024/05/15/healthfirst-medical-raises-25m-series-b',
      deadline: '2024-06-25',
      serviceMatch: 'AI/ML Services',
      signals: [
        { type: 'Funding', content: 'Raised $25M Series B funding led by HealthTech Ventures' },
        { type: 'Hiring', content: 'Multiple ML Engineer and Data Scientist positions open' },
        { type: 'Technology', content: 'Announced AI-first strategy in press release' },
      ],
      contacts: [
        { 
          name: 'Dr. Sarah Johnson', 
          title: 'Chief Medical Officer & Head of AI', 
          email: 'sarah.johnson@healthfirst-medical.com', 
          linkedin: 'https://linkedin.com/in/drsarahjohnson',
          phone: '+1-617-555-0201',
          decisionMaker: true
        },
        { 
          name: 'Michael Brown', 
          title: 'Director of Technology', 
          email: 'michael.brown@healthfirst-medical.com', 
          linkedin: 'https://linkedin.com/in/michaelbrown-tech',
          phone: '+1-617-555-0202',
          decisionMaker: false
        },
      ],
      createdAt: new Date('2024-05-20'),
    },
    {
      id: '3',
      companyName: 'RetailGlobal',
      website: 'https://retailglobal.com',
      companyLinkedin: 'https://linkedin.com/company/retailglobal',
      companyEmail: 'business@retailglobal.com',
      industry: 'Retail',
      employeeCount: 1200,
      geography: 'US',
      location: 'New York, NY, United States',
      status: 'new',
      score: 82,
      leadType: 'Qualified Lead - ERP Upgrade',
      companyServices: 'Leading fashion retail chain with 200+ stores across US and online e-commerce platform. Annual revenue $850M. Brands include RetailGlobal Fashion, RG Home, and RG Kids. Known for fast fashion and seasonal collections.',
      requirement: 'Critical ERP transformation project: Replacing 15-year-old SAP ECC system causing $3M annual losses due to inventory mismanagement and delayed reporting. NetSuite OneWorld implementation for: Real-time inventory management across 200+ stores and 5 warehouses; Unified order management for online and in-store purchases; Financial consolidation and reporting; Advanced demand forecasting and replenishment; Integration with Shopify e-commerce platform, POS systems (Square), and 3PL logistics partners (ShipBob, Flexport). Scope includes: Data migration of 10 years historical data, custom workflows for seasonal buying cycles, multi-currency support for international expansion, mobile app for store managers. Budget approved: $4.5M. Decision timeline: Vendor selection by June 30, 2024. Go-live target: January 2025 (before peak season).',
      approachStrategy: 'Position Amzur as NetSuite Alliance Partner with retail expertise. Discuss inventory optimization and omnichannel capabilities. Offer ROI analysis based on similar retail implementations.',
      evidenceLink: 'https://retailglobal.com/investor-relations/q1-2024-earnings-call-transcript',
      deadline: '2024-06-30',
      serviceMatch: 'ERP (NetSuite)',
      signals: [
        { type: 'Technology', content: 'CFO stated need for modern cloud-based ERP in earnings call' },
        { type: 'Pain Point', content: 'Current ERP system 15 years old, causing operational inefficiencies' },
        { type: 'Budget', content: 'Allocated $4.5M for ERP modernization in 2024 budget' },
      ],
      contacts: [
        { 
          name: 'David Thompson', 
          title: 'CFO', 
          email: 'david.thompson@retailglobal.com', 
          linkedin: 'https://linkedin.com/in/davidthompson-cfo',
          phone: '+1-212-555-0301',
          decisionMaker: true
        },
        { 
          name: 'Lisa Wang', 
          title: 'Director of IT Operations', 
          email: 'lisa.wang@retailglobal.com', 
          linkedin: 'https://linkedin.com/in/lisawang-it',
          phone: '+1-212-555-0302',
          decisionMaker: false
        },
      ],
      createdAt: new Date('2024-06-03'),
    },
    {
      id: '4',
      companyName: 'SecureFinance Corp',
      website: 'https://securefinance.com',
      companyLinkedin: 'https://linkedin.com/company/securefinance',
      companyEmail: 'security@securefinance.com',
      industry: 'Financial Services',
      employeeCount: 950,
      geography: 'US',
      location: 'Chicago, IL, United States',
      status: 'qualified',
      score: 91,
      leadType: 'Hot Lead - Compliance Urgency',
      companyServices: 'Digital banking platform providing business banking, treasury management, and payment processing to 5,000+ small and medium businesses. Processing $2B in transactions monthly. FDIC-insured with focus on fintech innovation.',
      requirement: 'Emergency cybersecurity overhaul following security audit revealing 23 critical vulnerabilities. SOC 2 Type II audit scheduled for September 2024 (mandatory for enterprise clients). Requirements: Comprehensive penetration testing of web applications, mobile apps, and APIs; Security code review of 500K+ lines of code; Implementation of SIEM solution for 24/7 threat monitoring; Setup of Security Operations Center (SOC) with incident response playbooks; Vulnerability management program; Security awareness training for 200+ employees; Compliance with PCI DSS, SOC 2, and GLBA regulations. Urgent needs: Fix critical vulnerabilities within 30 days, deploy SIEM by July 15, complete SOC 2 readiness by August 1. Recent phishing attack compromised 50 employee accounts, increasing urgency. Budget pre-approved: $2.8M for security infrastructure + $500K annual managed services contract.',
      approachStrategy: 'Emphasize immediate availability and financial services security expertise. Offer comprehensive security assessment with fast turnaround. Highlight SOC 2 audit support capabilities.',
      evidenceLink: 'https://linkedin.com/posts/securefinance-ciso-urgent-hiring',
      deadline: '2024-06-15',
      serviceMatch: 'Cybersecurity',
      signals: [
        { type: 'Compliance', content: 'Board mandated SOC 2 certification by Q4 2024' },
        { type: 'Hiring', content: 'Recruiting 5 security engineers and 1 CISO' },
        { type: 'Urgency', content: 'Recent security audit revealed critical vulnerabilities' },
      ],
      contacts: [
        { 
          name: 'Robert Anderson', 
          title: 'Chief Risk Officer', 
          email: 'robert.anderson@securefinance.com', 
          linkedin: 'https://linkedin.com/in/robertanderson-cro',
          phone: '+1-312-555-0401',
          decisionMaker: true
        },
        { 
          name: 'Maria Garcia', 
          title: 'VP Information Security', 
          email: 'maria.garcia@securefinance.com', 
          linkedin: 'https://linkedin.com/in/mariagarcia-infosec',
          phone: '+1-312-555-0402',
          decisionMaker: true
        },
      ],
      createdAt: new Date('2024-05-28'),
    },

    // United Kingdom Leads (2 leads)
    {
      id: '5',
      companyName: 'TechBridge London',
      website: 'https://techbridge.co.uk',
      companyLinkedin: 'https://linkedin.com/company/techbridge-london',
      companyEmail: 'hello@techbridge.co.uk',
      industry: 'Technology',
      employeeCount: 320,
      geography: 'UK',
      location: 'London, United Kingdom',
      status: 'qualified',
      score: 86,
      leadType: 'Warm Lead - Digital Transformation',
      companyServices: 'B2B software company providing supply chain management solutions to UK and European manufacturing sector. 320 employees serving 800+ enterprise clients. Annual recurring revenue £45M. Products: SupplyChain360, LogisticsTracker, Vendor Portal.',
      requirement: 'Major digital transformation initiative: Modernizing 10-year-old monolithic .NET application (2M lines of code) to cloud-native microservices architecture. Project includes: Re-architecting backend to Node.js/Python microservices on AWS EKS; Building React-based customer portal replacing legacy WinForms desktop app; Developing iOS and Android mobile apps for supply chain visibility; Implementing real-time tracking with IoT sensor integration; API gateway for partner integrations; GraphQL layer for frontend data access. Technical needs: 8-10 full-stack developers (React, Node.js, TypeScript); 2 DevOps engineers (AWS, Kubernetes, Terraform); 1 mobile developer (React Native); 1 solution architect. Engagement model: Dedicated offshore team with UK-based tech lead. Duration: 18 months. Budget: £2.5M. Business driver: Expanding to France, Germany, Netherlands - need scalable multi-tenant platform. Decision by: End of June 2024.',
      approachStrategy: 'Showcase Amzur\'s UK presence and understanding of UK market. Highlight modern tech stack expertise (React, Node.js, AWS). Offer dedicated offshore development team model.',
      evidenceLink: 'https://techbridge.co.uk/careers/full-stack-developer-cloud-transformation',
      deadline: '2024-06-28',
      serviceMatch: 'Custom App Development',
      signals: [
        { type: 'Technology', content: 'CTO blogged about digital transformation roadmap' },
        { type: 'Hiring', content: 'Job postings for Full Stack Developers and DevOps Engineers' },
        { type: 'Growth', content: 'Expanding to 3 new European markets this year' },
      ],
      contacts: [
        { 
          name: 'Oliver Bennett', 
          title: 'CTO', 
          email: 'oliver.bennett@techbridge.co.uk', 
          linkedin: 'https://linkedin.com/in/oliverbennett-cto',
          phone: '+44-20-7123-4567',
          decisionMaker: true
        },
        { 
          name: 'Emma Clarke', 
          title: 'Head of Product Development', 
          email: 'emma.clarke@techbridge.co.uk', 
          linkedin: 'https://linkedin.com/in/emmaclarke-product',
          phone: '+44-20-7123-4568',
          decisionMaker: false
        },
      ],
      createdAt: new Date('2024-06-04'),
    },
    {
      id: '6',
      companyName: 'BritRetail Group',
      website: 'https://britretail.co.uk',
      companyLinkedin: 'https://linkedin.com/company/britretail',
      companyEmail: 'enquiries@britretail.co.uk',
      industry: 'Retail',
      employeeCount: 580,
      geography: 'UK',
      location: 'Manchester, United Kingdom',
      status: 'new',
      score: 79,
      leadType: 'Qualified Lead - ERP Implementation',
      companyServices: 'Retail holding company operating department stores and specialty retail chains across UK, Ireland, and France. 580 employees, 45 stores, annual turnover £180M. Brands: BritHome, BritFashion, and BritKids. E-commerce represents 35% of sales.',
      requirement: 'NetSuite OneWorld ERP implementation to unify operations across 3 countries currently using disparate systems: UK using Sage, Ireland on QuickBooks, France on Cegid. Critical requirements: Multi-subsidiary financial consolidation with inter-company transactions; Multi-currency support (GBP, EUR) with automatic FX revaluation; UK VAT compliance and MTD integration; Ireland ROS integration; France FEC reporting; Unified inventory management across 45 stores and 3 distribution centers; E-commerce integration with Shopify Plus; EDI integration with suppliers; Retail POS integration; Advanced revenue recognition for gift cards and loyalty programs. Scope: Full implementation including Chart of Accounts design, opening balance migration, user training, and go-live support. Phase 1: UK (3 months), Phase 2: Ireland (2 months), Phase 3: France (2 months). Board approved budget: £850K. RFP responses due: July 15, 2024. Decision: August 1, 2024.',
      approachStrategy: 'Emphasize NetSuite OneWorld implementation experience. Discuss UK-specific tax compliance (VAT, Making Tax Digital). Offer pilot implementation in UK first.',
      evidenceLink: 'https://britretail.co.uk/investor-news/board-approves-erp-modernization',
      deadline: '2024-07-15',
      serviceMatch: 'ERP (NetSuite)',
      signals: [
        { type: 'Technology', content: 'Finance director mentioned need for unified ERP across EU operations' },
        { type: 'Pain Point', content: 'Currently using 3 different accounting systems across countries' },
        { type: 'Budget', content: 'Board approved digital transformation budget for 2024' },
      ],
      contacts: [
        { 
          name: 'William Harris', 
          title: 'Finance Director', 
          email: 'william.harris@britretail.co.uk', 
          linkedin: 'https://linkedin.com/in/williamharris-fd',
          phone: '+44-161-555-0123',
          decisionMaker: true
        },
        { 
          name: 'Sophie Mitchell', 
          title: 'IT Manager', 
          email: 'sophie.mitchell@britretail.co.uk', 
          linkedin: 'https://linkedin.com/in/sophiemitchell-it',
          phone: '+44-161-555-0124',
          decisionMaker: false
        },
      ],
      createdAt: new Date('2024-06-05'),
    },

    // UAE Leads (2 leads)
    {
      id: '7',
      companyName: 'Emirates Digital Solutions',
      website: 'https://emirates-digital.ae',
      companyLinkedin: 'https://linkedin.com/company/emirates-digital',
      companyEmail: 'contact@emirates-digital.ae',
      industry: 'Technology',
      employeeCount: 420,
      geography: 'UAE',
      location: 'Dubai, United Arab Emirates',
      status: 'qualified',
      score: 91,
      leadType: 'Hot Lead - Government Project',
      companyServices: 'Government IT services provider and systems integrator. Official partner for Dubai Smart City initiative. 420 employees delivering cloud solutions, cybersecurity, and digital transformation services to UAE government entities and GCC enterprises.',
      requirement: 'Flagship smart city IoT platform project (AED 15M contract) for Dubai Municipality: Deploy 50,000 IoT sensors across city infrastructure monitoring traffic, air quality, waste management, parking, and street lighting; Build real-time data processing pipeline handling 10M+ events per hour using AWS IoT Core, Kinesis, and Lambda; Develop AI/ML models for predictive analytics (traffic optimization, maintenance scheduling); Create citizen-facing mobile apps (iOS/Android) for reporting issues and accessing city services; Build dashboard for city operations center with real-time visualization; Ensure ISO 27001, UAE Data Protection Law compliance. Technical stack: AWS GovCloud (UAE), Kubernetes, Kafka, TensorFlow, React Native. Requirements: AWS Advanced Consulting Partner with government experience; ISO 27001 certified team; Local UAE presence; Arabic language support. Team needed: 15 engineers (cloud architects, IoT specialists, ML engineers, mobile developers). Project phases: Design (1 month), Development (6 months), Pilot (2 months), Rollout (3 months). Kickoff: July 2024. Vendor selection: June 20, 2024.',
      approachStrategy: 'Highlight Amzur\'s experience with UAE clients and government projects. Emphasize security certifications and scalability. Offer to present at their Dubai office.',
      evidenceLink: 'https://zawya.com/en/press-release/emirates-digital-wins-aed15m-smart-city-contract',
      deadline: '2024-06-20',
      serviceMatch: 'MVP as a Service',
      signals: [
        { type: 'Growth', content: 'Won AED 15M government smart city contract' },
        { type: 'Hiring', content: 'Urgently hiring Cloud Architects and IoT Engineers' },
        { type: 'Technology', content: 'Project kickoff scheduled for July 2024' },
      ],
      contacts: [
        { 
          name: 'Ahmed Al-Mansouri', 
          title: 'CEO', 
          email: 'ahmed.almansouri@emirates-digital.ae', 
          linkedin: 'https://linkedin.com/in/ahmedalmansouri-ceo',
          phone: '+971-4-123-4567',
          decisionMaker: true
        },
        { 
          name: 'Fatima Al-Hassan', 
          title: 'CTO', 
          email: 'fatima.alhassan@emirates-digital.ae', 
          linkedin: 'https://linkedin.com/in/fatimaalhassan-cto',
          phone: '+971-4-123-4568',
          decisionMaker: true
        },
      ],
      createdAt: new Date('2024-05-30'),
    },
    {
      id: '8',
      companyName: 'Gulf Healthcare Partners',
      website: 'https://gulfhealthcare.ae',
      companyLinkedin: 'https://linkedin.com/company/gulf-healthcare',
      companyEmail: 'info@gulfhealthcare.ae',
      industry: 'Healthcare',
      employeeCount: 280,
      geography: 'UAE',
      location: 'Abu Dhabi, United Arab Emirates',
      status: 'new',
      score: 84,
      leadType: 'Warm Lead - AI Implementation',
      companyServices: 'Private healthcare network operating 5 multi-specialty hospitals across UAE (Abu Dhabi, Dubai, Sharjah). 280 physicians, 1,200+ staff, serving 300,000 patients annually. Services: Primary care, specialized surgeries, emergency medicine, diagnostic imaging.',
      requirement: 'Telemedicine and AI diagnostic platform expansion (AED 8M investment from Healthcare Innovation Fund): Develop AI-powered telemedicine app supporting Arabic and English with 24/7 availability; Build symptom checker chatbot using NLP trained on 100K+ medical cases; Implement video consultation platform with AI-assisted diagnosis recommendations; Create AI radiology assistant for analyzing X-rays and CT scans; Integrate with existing Cerner hospital information system and PACS imaging system; Ensure compliance with UAE Ministry of Health telemedicine regulations and data residency requirements. Technical scope: React Native mobile apps; Python/TensorFlow for AI models; DICOM integration; HL7/FHIR for EHR integration; Arabic NLP models; AWS Middle East (UAE) region. Expected usage: 50,000 monthly virtual consultations. Must support Arabic medical terminology and cultural sensitivities. Team required: 6 full-stack developers, 3 ML engineers, 2 healthcare integration specialists, 1 Arabic NLP expert. Duration: 9 months development + 3 months pilot. Initial vendor meetings: Mid-June 2024. Contract decision: July 30, 2024.',
      approachStrategy: 'Lead with healthcare AI expertise and HIPAA compliance. Emphasize multi-language support capabilities. Discuss regulatory compliance in UAE healthcare.',
      evidenceLink: 'https://gulfhealthcare.ae/news/telemedicine-ai-expansion-aed8m-funding',
      deadline: '2024-07-30',
      serviceMatch: 'AI/ML Services',
      signals: [
        { type: 'Technology', content: 'Announced telemedicine expansion across 5 UAE hospitals' },
        { type: 'Funding', content: 'Received AED 8M investment from Healthcare Innovation Fund' },
        { type: 'Hiring', content: 'Looking for AI/ML specialists and mobile developers' },
      ],
      contacts: [
        { 
          name: 'Dr. Khalid Rahman', 
          title: 'Chief Medical Information Officer', 
          email: 'khalid.rahman@gulfhealthcare.ae', 
          linkedin: 'https://linkedin.com/in/drkhalidrahman',
          phone: '+971-2-456-7890',
          decisionMaker: true
        },
        { 
          name: 'Sarah Abdullah', 
          title: 'Director of Digital Health', 
          email: 'sarah.abdullah@gulfhealthcare.ae', 
          linkedin: 'https://linkedin.com/in/sarahabdullah-digitalhealth',
          phone: '+971-2-456-7891',
          decisionMaker: false
        },
      ],
      createdAt: new Date('2024-06-01'),
    },

    // Australia Leads (2 leads)
    {
      id: '9',
      companyName: 'Aussie FinTech Group',
      website: 'https://aussiefintech.com.au',
      companyLinkedin: 'https://linkedin.com/company/aussie-fintech',
      companyEmail: 'hello@aussiefintech.com.au',
      industry: 'Financial Services',
      employeeCount: 350,
      geography: 'Australia',
      location: 'Sydney, NSW, Australia',
      status: 'qualified',
      score: 87,
      leadType: 'Hot Lead - Security Compliance',
      companyServices: 'Digital lending platform providing personal loans, business financing, and BNPL services to Australian consumers and SMBs. Processing AUD $500M in loans annually. 350 employees. Licensed by ASIC, preparing for banking license application.',
      requirement: 'Critical cybersecurity program for APRA CPS 234 compliance ahead of banking license application (APRA audit September 2024). Requirements: External penetration testing of web app, mobile apps (iOS/Android), APIs, and cloud infrastructure; Internal vulnerability assessment of AWS environment (50+ accounts); Security code review of lending platform (300K lines of code); Application security testing (SAST/DAST) with remediation guidance; Implementation of managed SIEM (Splunk/Azure Sentinel) with 24/7 SOC monitoring; Incident response plan and tabletop exercises; Security awareness training (phishing simulations); Third-party vendor risk assessments; Ongoing managed security services with 4-hour SLA. Recent incident: Phishing attack compromised 50 accounts, need immediate response. Compliance requirements: APRA CPS 234, Essential Eight Maturity Level 2, PCI DSS. Budget approved: AUD $1.8M initial + AUD $600K annual. Urgent timeline: Pen testing by July 15, SIEM by August 1, full compliance by September 1. RFP responses due: June 18, 2024.',
      approachStrategy: 'Emphasize Amzur\'s financial services security experience and APRA compliance knowledge. Offer comprehensive security assessment. Highlight 24/7 support capabilities.',
      evidenceLink: 'https://aussiefintech.com.au/about/apra-banking-license-application',
      deadline: '2024-06-18',
      serviceMatch: 'MVP as a Service',
      signals: [
        { type: 'Compliance', content: 'APRA audit scheduled for September 2024' },
        { type: 'Hiring', content: 'Recruiting Security Operations Center (SOC) team' },
        { type: 'Urgency', content: 'Recent phishing attack highlighted security gaps' },
      ],
      contacts: [
        { 
          name: 'Andrew Mitchell', 
          title: 'Chief Information Security Officer', 
          email: 'andrew.mitchell@aussiefintech.com.au', 
          linkedin: 'https://linkedin.com/in/andrewmitchell-ciso',
          phone: '+61-2-9876-5432',
          decisionMaker: true
        },
        { 
          name: 'Rebecca Lee', 
          title: 'Head of Compliance', 
          email: 'rebecca.lee@aussiefintech.com.au', 
          linkedin: 'https://linkedin.com/in/rebeccalee-compliance',
          phone: '+61-2-9876-5433',
          decisionMaker: true
        },
      ],
      createdAt: new Date('2024-06-02'),
    },
    {
      id: '10',
      companyName: 'Sydney Manufacturing Co',
      website: 'https://sydneymanufacturing.com.au',
      companyLinkedin: 'https://linkedin.com/company/sydney-manufacturing',
      companyEmail: 'operations@sydneymanufacturing.com.au',
      industry: 'Manufacturing',
      employeeCount: 520,
      geography: 'Australia',
      location: 'Melbourne, VIC, Australia',
      status: 'new',
      score: 76,
      leadType: 'Qualified Lead - Digital Transformation',
      companyServices: 'Automotive parts manufacturer and supplier to major Australian auto brands. Operating 2 factories (Melbourne, Brisbane) producing 500,000 components monthly. 520 employees. Annual revenue AUD $120M. Exporting to Asia-Pacific markets.',
      requirement: 'Industry 4.0 digital transformation project driven by quality issues (15% defect rate) and production inefficiencies costing AUD $8M annually: Deploy IoT sensors on 150 production machines for real-time performance monitoring; Build predictive maintenance system using ML to reduce downtime by 40%; Develop custom MES (Manufacturing Execution System) for production tracking and quality control; Create inventory management system with barcode scanning and RFID tracking across 2 warehouses; Build mobile apps for warehouse operators and quality inspectors (Android tablets); Implement real-time dashboards showing OEE, defect rates, machine utilization; Integrate with existing SAP ERP system and AutoCAD for production drawings. Technical scope: Azure IoT Hub, Time Series Insights, Machine Learning Studio; React dashboard; .NET Core APIs; SQL Server; Flutter mobile apps. Results target: Reduce defect rate to 5%, increase OEE from 65% to 85%, reduce inventory holding costs by 30%. Project budget: AUD $3.2M. Opening new Brisbane facility (doubling capacity) - need scalable solution. Vendor evaluation starts: Early July 2024. Decision: August 15, 2024.',
      approachStrategy: 'Showcase manufacturing industry experience and IoT expertise. Discuss Industry 4.0 solutions. Offer proof of concept for IoT sensor integration.',
      evidenceLink: 'https://sydneymanufacturing.com.au/annual-report-2024-digital-transformation',
      deadline: '2024-08-15',
      serviceMatch: 'Shopify',
      signals: [
        { type: 'Technology', content: 'CEO mentioned Industry 4.0 initiative in annual report' },
        { type: 'Pain Point', content: 'Manual production tracking causing quality issues' },
        { type: 'Growth', content: 'Opening new manufacturing facility in Brisbane' },
      ],
      contacts: [
        { 
          name: 'Peter Williams', 
          title: 'Operations Director', 
          email: 'peter.williams@sydneymanufacturing.com.au', 
          linkedin: 'https://linkedin.com/in/peterwilliams-ops',
          phone: '+61-3-8765-4321',
          decisionMaker: true
        },
        { 
          name: 'Jennifer Brown', 
          title: 'IT Manager', 
          email: 'jennifer.brown@sydneymanufacturing.com.au', 
          linkedin: 'https://linkedin.com/in/jenniferbrown-it',
          phone: '+61-3-8765-4322',
          decisionMaker: false
        },
      ],
      createdAt: new Date('2024-06-04'),
    },
  ];

  async create(createLeadDto: CreateLeadDto) {
    const newLead = {
      id: (this.leads.length + 1).toString(),
      companyName: createLeadDto.companyName,
      website: createLeadDto.website,
      industry: createLeadDto.industry,
      employeeCount: createLeadDto.employeeCount || 0,
      location: 'Unknown',
      status: createLeadDto.status || 'new',
      score: createLeadDto.score || 0,
      signals: [],
      contacts: [],
      serviceMatch: 'To be determined',
      geography: 'Unknown',
      companyServices: 'To be determined',
      requirement: 'To be determined',
      approachStrategy: 'To be determined',
      evidenceLink: '',
      deadline: '',
      leadType: 'To be qualified',
      companyLinkedin: '',
      companyEmail: '',
      createdAt: new Date(),
    };
    this.leads.push(newLead as any);
    return newLead;
  }

  async findAll(filters: LeadFilterDto) {
    let filteredLeads = [...this.leads];

    if (filters.status) {
      filteredLeads = filteredLeads.filter((lead) => lead.status === filters.status);
    }

    if (filters.industry) {
      filteredLeads = filteredLeads.filter((lead) => lead.industry === filters.industry);
    }

    // Add geography filter
    if (filters.geography) {
      filteredLeads = filteredLeads.filter((lead) => lead.geography === filters.geography);
    }

    // Add service filter
    if (filters.service) {
      filteredLeads = filteredLeads.filter((lead) => lead.serviceMatch === filters.service);
    }

    return {
      data: filteredLeads,
      total: filteredLeads.length,
    };
  }

  async findOne(id: string) {
    return this.leads.find((lead) => lead.id === id);
  }

  async update(id: string, updateLeadDto: UpdateLeadDto) {
    const index = this.leads.findIndex((lead) => lead.id === id);
    if (index !== -1) {
      this.leads[index] = { ...this.leads[index], ...updateLeadDto };
      return this.leads[index];
    }
    return null;
  }

  async remove(id: string) {
    const index = this.leads.findIndex((lead) => lead.id === id);
    if (index !== -1) {
      this.leads.splice(index, 1);
      return { message: 'Lead deleted successfully' };
    }
    return null;
  }

  async triggerDiscovery() {
    // This will trigger a BullMQ job to discover leads
    return {
      message: 'Lead discovery job queued',
      jobId: 'job-' + Date.now(),
    };
  }

  async qualify(id: string) {
    // This will trigger lead qualification
    const lead = this.leads.find((l) => l.id === id);
    if (lead) {
      lead.score = Math.floor(Math.random() * 100);
      lead.status = lead.score > 70 ? 'qualified' : 'new';
      return lead;
    }
    return null;
  }

  async enrich(id: string) {
    // This will trigger lead enrichment
    return {
      message: 'Lead enrichment started',
      leadId: id,
    };
  }
}
