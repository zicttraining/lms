// careerIntel.js — Job data, skill progression, and improvement suggestions per career track

export const SCORE_LEVELS = [
  { min: 0,   max: 49,  id: 'foundation',   label: 'Foundation',   color: '#6B7A96', desc: 'Building core skills — keep submitting assessments.' },
  { min: 50,  max: 149, id: 'practitioner', label: 'Practitioner', color: '#F97316', desc: 'Demonstrating applied skills — employers notice this.' },
  { min: 150, max: 299, id: 'proficient',   label: 'Proficient',   color: '#EAB308', desc: 'Strong portfolio — actively pursue entry-level roles.' },
  { min: 300, max: 499, id: 'advanced',     label: 'Advanced',     color: '#22C55E', desc: 'Expert-level work — target specialist and analyst roles.' },
  { min: 500, max: Infinity, id: 'expert',  label: 'Expert',       color: '#8B5CF6', desc: 'Top-tier graduate — you qualify for high-value positions.' },
]

export function getScoreLevel(score) {
  return SCORE_LEVELS.find(l => score >= l.min && score <= l.max) || SCORE_LEVELS[0]
}

// ── Track Intelligence ─────────────────────────────────────────
// Per track: jobs at each level, skills to build, next actions, adjacent tracks
export const TRACK_INTEL = {
  it: {
    label: 'IT & AI Support',
    icon: '💻',
    color: '#3B82F6',
    summary: 'AI is reshaping IT — from automated ticketing to AI-powered diagnostics. IT professionals who master AI tools are the most in-demand of any tech role right now.',
    jobs: {
      foundation: [
        { title: 'Help Desk Technician', salary: '$38K–$52K', desc: 'First point of contact for IT issues — remote and in-office.' },
        { title: 'Desktop Support Specialist', salary: '$40K–$55K', desc: 'Manages end-user hardware, software, and peripherals.' },
        { title: 'IT Support Coordinator', salary: '$38K–$50K', desc: 'Triages and routes IT tickets, maintains knowledge base.' },
      ],
      practitioner: [
        { title: 'AI Operations Specialist', salary: '$55K–$78K', desc: 'Manages AI tools, prompts, and workflows across an org.' },
        { title: 'Cloud Support Engineer', salary: '$58K–$85K', desc: 'Supports AWS/Azure environments and cloud migrations.' },
        { title: 'IT Systems Analyst', salary: '$60K–$80K', desc: 'Evaluates and improves IT systems and processes.' },
      ],
      proficient: [
        { title: 'AI Tools Administrator', salary: '$70K–$95K', desc: 'Oversees enterprise AI tool deployment and governance.' },
        { title: 'IT Automation Engineer', salary: '$72K–$98K', desc: 'Builds automated workflows using Zapier, Power Automate, or scripts.' },
        { title: 'Technical Product Manager (AI)', salary: '$80K–$110K', desc: 'Manages AI product features and roadmaps in tech companies.' },
      ],
      advanced: [
        { title: 'AI Infrastructure Manager', salary: '$95K–$130K', desc: 'Leads AI/ML infrastructure strategy and operations.' },
        { title: 'IT Director', salary: '$100K–$150K', desc: 'Oversees all IT operations for an organization.' },
      ],
      expert: [
        { title: 'VP of AI & Technology', salary: '$130K–$200K+', desc: 'Leads organizational AI transformation strategy.' },
        { title: 'Chief Technology Officer (CTO)', salary: '$150K–$250K+', desc: 'Sets technology vision for an entire organization.' },
      ],
    },
    topSkills: ['AI tool integration', 'Automation with Zapier/Power Automate', 'Cloud platforms (AWS/Azure)', 'ITIL practices', 'Prompt engineering'],
    nextSteps: {
      beginner: ['Complete the IT Knowledge Base assessment', 'Set up Bitwarden and enable MFA on all work accounts', 'Learn the RTFT prompt framework'],
      intermediate: ['Complete the Zapier IT Automation project', 'Get your Google AI Essentials certificate (free)', 'Build a portfolio of 3 automation workflows'],
      advanced: ['Pursue AWS Cloud Practitioner certification', 'Design a multi-system AI integration project', 'Document your work for a LinkedIn portfolio post'],
    },
    adjacent: ['auto', 'data'],
    adjacentWhy: 'Your IT skills give you an edge in Automation (you understand systems) and Data Analytics (you already work with data).',
    certPaths: ['Google AI Essentials', 'AWS Cloud Practitioner', 'Microsoft AI-900', 'CompTIA A+'],
  },

  biz: {
    label: 'Business Operations',
    icon: '📊',
    color: '#F97316',
    summary: 'AI is automating 40% of operational tasks — from reporting to scheduling to customer communications. Business operations professionals who automate workflows are indispensable.',
    jobs: {
      foundation: [
        { title: 'Operations Coordinator', salary: '$42K–$58K', desc: 'Supports daily business operations and process documentation.' },
        { title: 'Administrative Analyst', salary: '$40K–$55K', desc: 'Analyzes operational data and creates reports.' },
        { title: 'Project Coordinator', salary: '$44K–$60K', desc: 'Tracks project timelines, tasks, and stakeholder communication.' },
      ],
      practitioner: [
        { title: 'Business Process Analyst', salary: '$60K–$82K', desc: 'Maps and improves business workflows using AI and automation.' },
        { title: 'Operations Manager', salary: '$65K–$90K', desc: 'Oversees day-to-day business operations and team performance.' },
        { title: 'AI Business Consultant', salary: '$70K–$95K', desc: 'Advises businesses on AI tool adoption and ROI.' },
      ],
      proficient: [
        { title: 'Digital Transformation Manager', salary: '$80K–$110K', desc: 'Leads technology and process modernization initiatives.' },
        { title: 'Business Intelligence Analyst', salary: '$75K–$100K', desc: 'Turns operational data into actionable insights.' },
      ],
      advanced: [
        { title: 'Director of Operations', salary: '$100K–$140K', desc: 'Leads operations strategy across multiple departments.' },
        { title: 'Chief Operating Officer (COO)', salary: '$130K–$200K+', desc: 'Sets operational strategy for an entire organization.' },
      ],
      expert: [
        { title: 'VP of Business Operations', salary: '$140K–$220K+', desc: 'Executive-level oversight of all operational units.' },
      ],
    },
    topSkills: ['Process automation (Zapier, Make.com)', 'Data analysis with Google Sheets/Excel', 'AI-powered reporting', 'Project management', 'Stakeholder communication'],
    nextSteps: {
      beginner: ['Complete the AI Productivity Blueprint', 'Build your first Zapier automation (even a simple 2-step one)', 'Document a process you repeat every week'],
      intermediate: ['Complete the Business Process AI Integration Report', 'Get Google Workspace certified (free)', 'Build an ROI analysis for one automated workflow'],
      advanced: ['Complete the End-to-End Automation project', 'Pitch an AI solution to a real business', 'Publish your process documentation on LinkedIn'],
    },
    adjacent: ['auto', 'marketing'],
    adjacentWhy: 'Business operations skills pair naturally with Automation (you already think in workflows) and Marketing (data-driven operations connects to marketing analytics).',
    certPaths: ['Google Project Management Certificate', 'Microsoft AI-900', 'Zapier Certified Expert', 'Six Sigma Green Belt'],
  },

  sector: {
    label: 'Healthcare / Gov / Edu / Legal',
    icon: '🏥',
    color: '#EC4899',
    summary: 'Regulated industries are adopting AI carefully but aggressively — from HIPAA-compliant AI documentation in healthcare to AI-assisted legal research. Professionals who understand BOTH their field and AI are extremely rare and highly valued.',
    jobs: {
      foundation: [
        { title: 'AI-Enabled Administrative Specialist', salary: '$40K–$55K', desc: 'Manages documentation and communication using AI tools in a regulated environment.' },
        { title: 'Healthcare Technology Coordinator', salary: '$44K–$60K', desc: 'Supports EHR systems and digital health tools.' },
        { title: 'Government Digital Services Assistant', salary: '$42K–$58K', desc: 'Supports digital communication and public services delivery.' },
        { title: 'Legal Technology Assistant', salary: '$46K–$62K', desc: 'Assists legal teams with research and document management using AI tools.' },
      ],
      practitioner: [
        { title: 'Healthcare AI Applications Specialist', salary: '$62K–$85K', desc: 'Implements AI documentation and patient communication tools in clinical settings.' },
        { title: 'Policy & Compliance Analyst (AI)', salary: '$65K–$88K', desc: 'Reviews and advises on AI use policies for regulated environments.' },
        { title: 'Education Technology Coordinator', salary: '$55K–$75K', desc: 'Integrates AI tools into curriculum and learning management systems.' },
        { title: 'Legal Research Analyst (AI)', salary: '$68K–$92K', desc: 'Uses AI to accelerate legal research, case analysis, and document drafting.' },
      ],
      proficient: [
        { title: 'Digital Health Program Manager', salary: '$80K–$105K', desc: 'Leads AI adoption and digital health programs within healthcare organizations.' },
        { title: 'Regulatory Technology (RegTech) Specialist', salary: '$78K–$100K', desc: 'Applies AI to compliance monitoring and regulatory reporting.' },
      ],
      advanced: [
        { title: 'Chief Digital Officer (Healthcare/Gov)', salary: '$110K–$160K', desc: 'Leads digital transformation strategy in a regulated organization.' },
        { title: 'AI Compliance Director', salary: '$100K–$145K', desc: 'Governs enterprise AI use within legal and ethical frameworks.' },
      ],
      expert: [
        { title: 'VP of Digital Innovation', salary: '$140K–$200K+', desc: 'Drives AI and technology strategy at the executive level in regulated sectors.' },
      ],
    },
    topSkills: ['HIPAA/FERPA/legal compliance basics', 'AI-assisted document drafting', 'Policy analysis', 'Secure data handling', 'Perplexity AI for research'],
    nextSteps: {
      beginner: ['Complete the Sector Communication Templates assessment', 'Research one AI regulation relevant to your field (start with Perplexity AI)', 'Learn what HIPAA or FERPA requires about AI use'],
      intermediate: ['Complete the AI & Compliance Research Brief', 'Draft a 1-page responsible AI use policy for your organization', 'Connect with 3 professionals in your sector on LinkedIn'],
      advanced: ['Develop a sector-specific AI governance framework', 'Present your compliance brief to a real audience', 'Research certifications specific to your sector (e.g., CHDA for healthcare)'],
    },
    adjacent: ['it', 'data'],
    adjacentWhy: 'Sector expertise + IT skills makes you a rare healthcare/gov IT specialist. Add data analytics and you can work in health informatics or policy analysis.',
    certPaths: ['Google AI Essentials', 'AHIMA credentials (healthcare)', 'Certified Government Financial Manager (CGFM)', 'CIPP/US (privacy/legal)'],
  },

  data: {
    label: 'Data, Reporting & AI Analytics',
    icon: '📈',
    color: '#8B5CF6',
    summary: 'Data is the language of every business decision. AI has made data analysis 10x faster — professionals who combine data skills with AI tools are commanding premium salaries.',
    jobs: {
      foundation: [
        { title: 'Data Entry & Reporting Specialist', salary: '$38K–$52K', desc: 'Manages data inputs and produces standard reports using Excel/Sheets.' },
        { title: 'Business Intelligence Assistant', salary: '$44K–$60K', desc: 'Supports BI teams with data cleaning, visualization, and reporting.' },
        { title: 'Research Analyst (AI-Assisted)', salary: '$46K–$62K', desc: 'Collects and synthesizes market and business data using AI tools.' },
      ],
      practitioner: [
        { title: 'Data Analyst', salary: '$60K–$85K', desc: 'Analyzes datasets to produce insights and recommendations.' },
        { title: 'AI Analytics Specialist', salary: '$65K–$90K', desc: 'Uses AI to accelerate data processing and pattern recognition.' },
        { title: 'Market Research Analyst', salary: '$58K–$80K', desc: 'Gathers and interprets market intelligence to guide business decisions.' },
      ],
      proficient: [
        { title: 'Senior Data Analyst', salary: '$80K–$105K', desc: 'Leads analysis projects and presents findings to stakeholders.' },
        { title: 'Business Intelligence Developer', salary: '$85K–$115K', desc: 'Builds dashboards and reporting infrastructure using BI tools.' },
      ],
      advanced: [
        { title: 'Data Science Analyst', salary: '$95K–$130K', desc: 'Applies statistical models and ML techniques to business problems.' },
        { title: 'Analytics Manager', salary: '$100K–$140K', desc: 'Leads a data analytics team and strategy.' },
      ],
      expert: [
        { title: 'Chief Data Officer (CDO)', salary: '$140K–$220K+', desc: 'Governs enterprise data strategy and AI analytics capabilities.' },
        { title: 'VP of Analytics & AI', salary: '$150K–$230K+', desc: 'Drives data-driven decision making at the executive level.' },
      ],
    },
    topSkills: ['Google Sheets / Excel (pivot tables, formulas)', 'Data visualization', 'Perplexity AI for research', 'ChatGPT for data summarization', 'Basic statistics'],
    nextSteps: {
      beginner: ['Complete the AI Productivity Blueprint to understand AI-data workflows', 'Build a Google Sheets tracker for something in your real life', 'Practice 3 COUNTIF/AVERAGEIF/VLOOKUP formulas'],
      intermediate: ['Complete the Data Storytelling project', 'Publish a chart or insight on LinkedIn with a 3-sentence analysis', 'Learn Google Looker Studio (free) to build your first dashboard'],
      advanced: ['Complete the Market Intelligence Report', 'Get the Google Data Analytics Certificate (Coursera)', 'Build a dataset and analysis from scratch on a topic you care about'],
    },
    adjacent: ['biz', 'it'],
    adjacentWhy: 'Data skills amplify every other track. Add business operations context and you become a business analyst. Add IT skills and you move into data engineering.',
    certPaths: ['Google Data Analytics Certificate', 'Microsoft Power BI Certification', 'Tableau Desktop Specialist', 'AWS Cloud Practitioner (data services)'],
  },

  auto: {
    label: 'Automation & Workflow Management',
    icon: '⚙️',
    color: '#22C55E',
    summary: 'The no-code automation market is worth $4B and growing 25% per year. Zapier, Make.com, and Power Automate specialists are among the highest-paid entry-level tech roles.',
    jobs: {
      foundation: [
        { title: 'Workflow Automation Assistant', salary: '$44K–$60K', desc: 'Builds and maintains no-code automations for business teams.' },
        { title: 'Operations Automation Coordinator', salary: '$46K–$62K', desc: 'Documents and automates repetitive operational workflows.' },
      ],
      practitioner: [
        { title: 'No-Code Automation Specialist', salary: '$62K–$85K', desc: 'Designs and deploys multi-step automations using Zapier, Make.com, or Power Automate.' },
        { title: 'Process Automation Analyst', salary: '$65K–$88K', desc: 'Analyzes business processes and recommends automation solutions.' },
        { title: 'Zapier Certified Consultant', salary: '$60K–$95K', desc: 'Freelance or agency-based automation consultant for small/mid businesses.' },
      ],
      proficient: [
        { title: 'Automation Engineer', salary: '$78K–$105K', desc: 'Builds complex multi-system automations and integrations.' },
        { title: 'Digital Transformation Specialist', salary: '$80K–$110K', desc: 'Leads process re-engineering and automation adoption across an organization.' },
      ],
      advanced: [
        { title: 'RPA Developer', salary: '$90K–$125K', desc: 'Builds robotic process automation using enterprise RPA tools (UiPath, Blue Prism).' },
        { title: 'Automation Architect', salary: '$100K–$140K', desc: 'Designs enterprise-wide automation strategy and infrastructure.' },
      ],
      expert: [
        { title: 'Head of Automation & AI', salary: '$130K–$185K+', desc: 'Leads automation and AI integration at the organizational level.' },
      ],
    },
    topSkills: ['Zapier / Make.com / Power Automate', 'API basics (triggers, webhooks)', 'Process mapping', 'Google Sheets automation', 'Prompt engineering for workflows'],
    nextSteps: {
      beginner: ['Complete the AI Productivity Blueprint', 'Build your first 2-step Zapier automation (any real use case)', 'Document one workflow you want to automate'],
      intermediate: ['Complete the End-to-End Automation project', 'Get Zapier free certification', 'Build a client-facing automation for a real business (family member, local business)'],
      advanced: ['Learn Make.com (more powerful than Zapier for complex flows)', 'Build an automation that saves 10+ hours/month', 'Create a portfolio of 5 documented automation projects'],
    },
    adjacent: ['it', 'biz'],
    adjacentWhy: 'Automation expertise supercharges both IT (you automate IT tasks) and Business Operations (you automate business processes). These tracks hire the same people.',
    certPaths: ['Zapier Expert Certification', 'Microsoft Power Automate Certificate', 'Make.com Partner Certification', 'Google Project Management Certificate'],
  },

  marketing: {
    label: 'Marketing, Communications & Content',
    icon: '📣',
    color: '#EC4899',
    summary: 'AI content tools have made marketing teams 3x faster. Professionals who can direct AI tools to produce on-brand, high-quality content — and know how to measure results — are in high demand.',
    jobs: {
      foundation: [
        { title: 'Content Creator (AI-Assisted)', salary: '$40K–$55K', desc: 'Produces blog posts, social media content, and emails using AI writing tools.' },
        { title: 'Digital Marketing Coordinator', salary: '$42K–$58K', desc: 'Manages social platforms, email campaigns, and basic analytics.' },
        { title: 'Communications Assistant', salary: '$38K–$52K', desc: 'Drafts press releases, internal communications, and customer messaging.' },
      ],
      practitioner: [
        { title: 'AI Content Strategist', salary: '$58K–$80K', desc: 'Develops content strategies powered by AI tools and audience data.' },
        { title: 'Digital Marketing Manager', salary: '$62K–$88K', desc: 'Manages multi-channel campaigns and optimizes performance with AI analytics.' },
        { title: 'SEO Content Specialist', salary: '$55K–$78K', desc: 'Creates AI-assisted, SEO-optimized content at scale.' },
      ],
      proficient: [
        { title: 'Brand Content Director', salary: '$78K–$105K', desc: 'Leads all content production and brand voice across channels.' },
        { title: 'Marketing Analytics Manager', salary: '$80K–$108K', desc: 'Analyzes campaign data and directs AI-powered personalization.' },
      ],
      advanced: [
        { title: 'Chief Marketing Officer (CMO)', salary: '$110K–$180K+', desc: 'Sets marketing strategy for an entire organization.' },
      ],
      expert: [
        { title: 'VP of Growth & AI Marketing', salary: '$140K–$220K+', desc: 'Leads AI-powered growth strategy at the executive level.' },
      ],
    },
    topSkills: ['RTFT prompt writing for content', 'ChatGPT/Claude for copywriting', 'Social media strategy', 'Email marketing', 'Basic SEO'],
    nextSteps: {
      beginner: ['Complete the Prompt Engineering Portfolio (10 marketing prompts)', 'Write 3 AI-drafted LinkedIn posts and publish them', 'Learn one email marketing tool (Mailchimp, free)'],
      intermediate: ['Build an AI content calendar for a business', 'Create a before/after campaign showing AI vs manual content', 'Get Google Digital Marketing & E-commerce Certificate'],
      advanced: ['Run a real A/B test on AI-generated vs human-edited content', 'Build a content strategy deck for a real client', 'Publish a case study on LinkedIn showing your results'],
    },
    adjacent: ['biz', 'data'],
    adjacentWhy: 'Marketing + data analytics = growth marketing (one of the most hired roles). Marketing + business ops = marketing operations (another top-paying niche).',
    certPaths: ['Google Digital Marketing & E-commerce', 'HubSpot Content Marketing', 'Meta Social Media Professional', 'Semrush SEO Certification'],
  },

  admin: {
    label: 'Administrative & Office Technology',
    icon: '🗂️',
    color: '#3B82F6',
    summary: 'The administrative role has been transformed by AI — professionals who automate routine tasks and use AI for research, scheduling, and document production are the most valuable in any office.',
    jobs: {
      foundation: [
        { title: 'Administrative Assistant (AI-Enhanced)', salary: '$38K–$52K', desc: 'Manages schedules, correspondence, and documentation using AI tools.' },
        { title: 'Office Coordinator', salary: '$38K–$50K', desc: 'Coordinates office operations, supplies, and team logistics.' },
        { title: 'Executive Assistant (Entry)', salary: '$44K–$60K', desc: 'Supports senior leaders with scheduling, travel, and communications.' },
      ],
      practitioner: [
        { title: 'Senior Executive Assistant', salary: '$58K–$80K', desc: 'Provides high-level support including AI-powered research and reporting.' },
        { title: 'Office Manager', salary: '$55K–$75K', desc: 'Oversees all office operations, processes, and staff coordination.' },
        { title: 'Operations Administrator', salary: '$54K–$72K', desc: 'Manages operational data, processes, and tools for a business unit.' },
      ],
      proficient: [
        { title: 'Chief of Staff', salary: '$80K–$115K', desc: 'Manages priorities and operations for C-suite executives.' },
      ],
      advanced: [
        { title: 'Director of Administration', salary: '$90K–$130K', desc: 'Leads all administrative functions for an organization.' },
      ],
      expert: [
        { title: 'VP of Corporate Operations', salary: '$120K–$180K+', desc: 'Oversees all corporate administrative and operational functions.' },
      ],
    },
    topSkills: ['Google Workspace / Microsoft 365 mastery', 'AI-assisted scheduling and research', 'Professional email management', 'Document automation', 'Project coordination'],
    nextSteps: {
      beginner: ['Complete the Digital Tools Proficiency Showcase', 'Get Google Workspace Individual Certification (free)', 'Build a template library for your 5 most repeated tasks'],
      intermediate: ['Complete the AI Productivity Blueprint', 'Automate one recurring weekly task with Zapier', 'Create a professional portfolio doc showing your tool skills'],
      advanced: ['Build an end-to-end admin automation system', 'Pursue Microsoft 365 Fundamentals certification', 'Mentor a newer student on digital tools'],
    },
    adjacent: ['biz', 'auto'],
    adjacentWhy: 'Admin skills + automation expertise = operations manager territory. Admin + business ops = project management and COO career paths.',
    certPaths: ['Google Workspace Individual Certification', 'Microsoft 365 Fundamentals (MS-900)', 'CompTIA ITF+', 'Project Management Professional (PMP)'],
  },

  cx: {
    label: 'Customer Service & Client Relations',
    icon: '🎧',
    color: '#06B6D4',
    summary: 'AI chatbots handle tier-1 support — but humans who can use AI to handle tier-2 and tier-3 issues faster, with better documentation, are irreplaceable.',
    jobs: {
      foundation: [
        { title: 'Customer Service Representative (AI-Assisted)', salary: '$36K–$50K', desc: 'Resolves customer issues using AI-assisted knowledge bases.' },
        { title: 'Client Support Specialist', salary: '$38K–$52K', desc: 'Manages client accounts and resolves service issues.' },
        { title: 'Help Desk Agent', salary: '$38K–$52K', desc: 'First-line support for product or service issues.' },
      ],
      practitioner: [
        { title: 'Customer Success Manager', salary: '$58K–$80K', desc: 'Drives client retention and expansion through proactive relationship management.' },
        { title: 'CX Analyst', salary: '$55K–$75K', desc: 'Analyzes customer data and feedback to improve service quality.' },
        { title: 'AI Customer Experience Specialist', salary: '$60K–$82K', desc: 'Manages AI chatbot performance and escalation workflows.' },
      ],
      proficient: [
        { title: 'Customer Experience Manager', salary: '$72K–$98K', desc: 'Leads CX strategy and team for a product or service line.' },
      ],
      advanced: [
        { title: 'Director of Customer Success', salary: '$95K–$135K', desc: 'Oversees enterprise customer relationships and retention strategy.' },
      ],
      expert: [
        { title: 'Chief Customer Officer (CCO)', salary: '$130K–$200K+', desc: 'Sets customer experience strategy at the executive level.' },
      ],
    },
    topSkills: ['AI-assisted ticket resolution', 'Customer communication templates', 'CRM tools', 'Data-driven service improvement', 'Empathy + AI speed'],
    nextSteps: {
      beginner: ['Build 10 customer response templates using ChatGPT', 'Learn one CRM tool (HubSpot CRM is free)', 'Complete the Prompt Engineering Portfolio with customer service prompts'],
      intermediate: ['Build an AI knowledge base for common customer questions', 'Automate one customer follow-up sequence with Zapier', 'Get HubSpot Service Hub certification (free)'],
      advanced: ['Design a complete AI-enhanced CX workflow', 'Build a case study showing resolution time improvement with AI', 'Pursue Salesforce Associate certification'],
    },
    adjacent: ['marketing', 'biz'],
    adjacentWhy: 'CX + marketing = growth and retention strategy. CX + business ops = customer operations — a critical function in any scaling company.',
    certPaths: ['HubSpot Customer Service Certification', 'Salesforce Associate', 'Google Digital Marketing & E-commerce', 'HDI Customer Service Representative'],
  },

  hr: {
    label: 'Human Resources & People Ops',
    icon: '👥',
    color: '#EAB308',
    summary: 'HR teams using AI for recruiting, onboarding, and performance management are reducing time-to-hire by 50% and improving employee engagement. AI literacy is now a top HR hiring requirement.',
    jobs: {
      foundation: [
        { title: 'HR Assistant (AI-Enhanced)', salary: '$40K–$54K', desc: 'Supports recruiting, onboarding, and employee documentation.' },
        { title: 'People Operations Coordinator', salary: '$42K–$58K', desc: 'Manages HR processes, systems, and employee communications.' },
        { title: 'Recruiting Coordinator', salary: '$44K–$60K', desc: 'Screens candidates and manages recruiting workflows.' },
      ],
      practitioner: [
        { title: 'AI-Enabled HR Specialist', salary: '$58K–$80K', desc: 'Uses AI tools for job posting, screening, onboarding, and analytics.' },
        { title: 'Talent Acquisition Specialist', salary: '$60K–$84K', desc: 'Sources and recruits candidates using AI-enhanced workflows.' },
        { title: 'HR Business Partner', salary: '$65K–$88K', desc: 'Partners with business leaders on people strategy and performance.' },
      ],
      proficient: [
        { title: 'HR Manager', salary: '$75K–$100K', desc: 'Leads HR operations for a business unit or department.' },
        { title: 'People Analytics Manager', salary: '$80K–$108K', desc: 'Uses HR data and AI to drive workforce insights and decisions.' },
      ],
      advanced: [
        { title: 'HR Director', salary: '$100K–$140K', desc: 'Leads all HR strategy for an organization.' },
      ],
      expert: [
        { title: 'Chief People Officer (CPO)', salary: '$140K–$220K+', desc: 'Sets people strategy and culture at the executive level.' },
      ],
    },
    topSkills: ['AI-powered job posting and screening', 'Onboarding automation', 'HR analytics', 'Employee communication templates', 'Performance tracking tools'],
    nextSteps: {
      beginner: ['Build 5 HR communication templates (offer letter, onboarding email, performance review)', 'Learn one HRIS tool (BambooHR has a free trial)', 'Complete the Sector Communication Templates assessment'],
      intermediate: ['Automate a recruiting workflow with Zapier (form → email → calendar)', 'Get SHRM-CP certification prep started', 'Build an AI-generated job description library for 10 roles'],
      advanced: ['Design a full AI-enhanced recruiting funnel', 'Build a people analytics dashboard in Google Sheets', 'Write and publish a LinkedIn article on AI in HR'],
    },
    adjacent: ['admin', 'biz'],
    adjacentWhy: 'HR skills + business operations = people operations (one of the fastest-growing functions in tech). HR + admin = chief of staff career path.',
    certPaths: ['SHRM Certified Professional (SHRM-CP)', 'PHR Certification', 'Google Project Management', 'LinkedIn Learning HR Foundations'],
  },

  sales: {
    label: 'Sales & Business Development',
    icon: '💼',
    color: '#F97316',
    summary: 'AI has created a two-tier sales world: reps who use AI for prospecting, personalization, and follow-up are 3x more productive. Those who don\'t are being replaced.',
    jobs: {
      foundation: [
        { title: 'Sales Development Representative (SDR)', salary: '$42K–$60K + commission', desc: 'Prospects and qualifies leads using AI-assisted outreach.' },
        { title: 'Business Development Coordinator', salary: '$44K–$62K', desc: 'Supports BD team with research, outreach, and CRM management.' },
        { title: 'Account Coordinator', salary: '$40K–$55K', desc: 'Manages client accounts and coordinates service delivery.' },
      ],
      practitioner: [
        { title: 'Account Executive (AI-Enhanced)', salary: '$65K–$100K + commission', desc: 'Closes new business using AI for personalized outreach and proposals.' },
        { title: 'Business Development Manager', salary: '$70K–$95K', desc: 'Identifies and develops new business opportunities.' },
        { title: 'AI Sales Enablement Specialist', salary: '$65K–$88K', desc: 'Builds AI-powered sales tools, templates, and training for sales teams.' },
      ],
      proficient: [
        { title: 'Sales Manager', salary: '$80K–$120K + commission', desc: 'Leads a sales team and drives revenue targets.' },
      ],
      advanced: [
        { title: 'Director of Sales', salary: '$110K–$160K + commission', desc: 'Leads sales strategy across multiple teams or regions.' },
      ],
      expert: [
        { title: 'VP of Sales / CRO', salary: '$150K–$250K+', desc: 'Sets revenue strategy at the executive level.' },
      ],
    },
    topSkills: ['AI prospecting and outreach personalization', 'CRM tools (Salesforce, HubSpot)', 'Proposal automation', 'LinkedIn Sales Navigator', 'Data-driven pipeline management'],
    nextSteps: {
      beginner: ['Build 5 personalized outreach email templates using ChatGPT', 'Set up a free HubSpot CRM', 'Complete the Prompt Engineering Portfolio with sales-specific prompts'],
      intermediate: ['Automate a lead follow-up sequence with Zapier', 'Get HubSpot Sales Software certification (free)', 'Build a sales pitch deck with AI and present it to anyone'],
      advanced: ['Design a complete AI-enhanced sales funnel', 'Track 30 outreach attempts and measure AI vs manual response rate', 'Get Salesforce Associate certified'],
    },
    adjacent: ['marketing', 'biz'],
    adjacentWhy: 'Sales + marketing = growth and demand generation. Sales + business ops = revenue operations (RevOps) — one of the highest-paying entry-level paths in tech.',
    certPaths: ['HubSpot Sales Software Certification', 'Salesforce Associate', 'LinkedIn Sales Navigator Certification', 'Dale Carnegie Sales Training'],
  },
}

  // ── AWS Program tracks ──────────────────────────────────────
  aws_cloud_eng: {
    label: 'Cloud / DevOps Engineer',
    icon: '☁️',
    color: '#3B82F6',
    summary: 'Cloud engineers are the builders of modern infrastructure. AWS is the #1 cloud platform — engineers who know it are hired everywhere.',
    jobs: {
      foundation: [
        { title: 'Cloud Support Associate', salary: '$48K–$65K', desc: 'Provides technical support for cloud environments and helps customers troubleshoot AWS services.' },
        { title: 'Junior Cloud Engineer', salary: '$52K–$70K', desc: 'Assists in deploying and managing cloud infrastructure under senior engineers.' },
      ],
      practitioner: [
        { title: 'Cloud Engineer', salary: '$75K–$105K', desc: 'Designs, deploys, and manages cloud infrastructure on AWS.' },
        { title: 'DevOps Engineer', salary: '$80K–$115K', desc: 'Builds CI/CD pipelines and automates infrastructure deployment.' },
        { title: 'Cloud Operations Engineer', salary: '$72K–$98K', desc: 'Monitors, optimises, and maintains cloud systems and costs.' },
      ],
      proficient: [
        { title: 'Senior Cloud Engineer', salary: '$100K–$140K', desc: 'Leads cloud architecture decisions and mentors junior engineers.' },
        { title: 'Site Reliability Engineer (SRE)', salary: '$105K–$145K', desc: 'Ensures cloud services are reliable, scalable, and fault-tolerant.' },
      ],
      advanced: [
        { title: 'Cloud Architect', salary: '$130K–$170K', desc: 'Designs enterprise-scale cloud solutions and migration strategies.' },
      ],
      expert: [
        { title: 'VP of Cloud Infrastructure', salary: '$160K–$230K+', desc: 'Sets cloud strategy at the executive level.' },
      ],
    },
    topSkills: ['AWS core services (EC2, S3, RDS, VPC)', 'Infrastructure as Code (Terraform)', 'CI/CD pipelines', 'Linux', 'Docker & Kubernetes basics'],
    nextSteps: {
      beginner: ['Pass the AWS Cloud Practitioner exam (CCP)', 'Launch your first EC2 instance', 'Complete the S3 and IAM labs'],
      intermediate: ['Pass AWS Solutions Architect Associate', 'Build a 3-tier web app on AWS', 'Learn Terraform basics'],
      advanced: ['Pass AWS DevOps Professional', 'Deploy a full CI/CD pipeline', 'Contribute to an open-source AWS project'],
    },
    adjacent: ['aws_architect', 'aws_security'],
    adjacentWhy: 'Cloud engineers naturally grow into architecture and security roles as they gain experience.',
    certPaths: ['AWS Cloud Practitioner', 'AWS Solutions Architect Associate', 'AWS DevOps Professional', 'Terraform Associate'],
  },
  aws_architect: {
    label: 'Solutions Architect',
    icon: '🏗️',
    color: '#6366F1',
    summary: 'Solutions Architects are the strategists of cloud. They design systems that are reliable, secure, cost-efficient, and scalable — commanding some of the highest salaries in tech.',
    jobs: {
      foundation: [{ title: 'Cloud Associate Architect', salary: '$65K–$88K', desc: 'Assists senior architects with cloud design documentation and service selection.' }],
      practitioner: [{ title: 'Solutions Architect', salary: '$95K–$135K', desc: 'Designs cloud architectures for new applications and migration projects.' }],
      proficient: [{ title: 'Senior Solutions Architect', salary: '$130K–$170K', desc: 'Leads architecture reviews and works directly with enterprise customers.' }],
      advanced: [{ title: 'Principal Architect', salary: '$155K–$200K', desc: 'Sets architectural standards across an engineering organisation.' }],
      expert: [{ title: 'Distinguished Architect', salary: '$200K+', desc: 'AWS-level or company-wide architect shaping platform strategy.' }],
    },
    topSkills: ['AWS Well-Architected Framework', 'System design', 'Cost optimisation', 'High availability and DR', 'Networking (VPC, Route 53)'],
    nextSteps: {
      beginner: ['Study the AWS Well-Architected Framework (free whitepaper)', 'Build a 2-tier app on AWS and document it'],
      intermediate: ['Pass AWS Solutions Architect Associate', 'Design a resilient architecture using multi-AZ deployments'],
      advanced: ['Pass AWS Solutions Architect Professional', 'Complete an AWS Capstone design project'],
    },
    adjacent: ['aws_cloud_eng', 'aws_security'],
    adjacentWhy: 'Architects who understand DevOps and security are the most complete — both are natural next steps.',
    certPaths: ['AWS Solutions Architect Associate', 'AWS Solutions Architect Professional', 'AWS Advanced Networking'],
  },
  aws_support: {
    label: 'Cloud Support Specialist',
    icon: '🛠️',
    color: '#22C55E',
    summary: 'Cloud support is the fastest entry point into AWS careers. Support engineers learn every AWS service deeply — and many transition into engineering and architecture roles.',
    jobs: {
      foundation: [{ title: 'Cloud Support Associate', salary: '$45K–$62K', desc: 'Helps customers troubleshoot AWS issues via tickets, chat, and phone.' }],
      practitioner: [{ title: 'Cloud Support Engineer', salary: '$68K–$90K', desc: 'Resolves complex technical AWS issues and writes support documentation.' }],
      proficient: [{ title: 'Senior Support Engineer', salary: '$88K–$115K', desc: 'Handles escalated issues and advises on architecture best practices.' }],
      advanced: [{ title: 'Technical Account Manager (TAM)', salary: '$105K–$145K', desc: 'Provides proactive guidance to enterprise AWS customers.' }],
      expert: [{ title: 'Support Leadership / Solutions Architect', salary: '$130K+', desc: 'Transitions into architecture or engineering leadership.' }],
    },
    topSkills: ['AWS core services (EC2, S3, RDS)', 'Troubleshooting and log analysis', 'Networking basics', 'Customer communication', 'Linux CLI'],
    nextSteps: {
      beginner: ['Pass AWS Cloud Practitioner', 'Complete all hands-on labs in the program', 'Practice explaining AWS concepts to non-technical users'],
      intermediate: ['Pass AWS Solutions Architect Associate', 'Build a troubleshooting runbook for 10 common AWS issues'],
      advanced: ['Pursue TAM career path', 'Study for AWS specialty certifications'],
    },
    adjacent: ['aws_cloud_eng', 'aws_architect'],
    adjacentWhy: 'Support engineers see more AWS services than most engineers — this breadth naturally leads to architecture and engineering roles.',
    certPaths: ['AWS Cloud Practitioner', 'AWS Solutions Architect Associate', 'AWS SysOps Administrator'],
  },
  aws_security: {
    label: 'Cloud Security Specialist',
    icon: '🔒',
    color: '#EF4444',
    summary: 'Cloud security is the fastest-growing specialty in tech. Every company moving to AWS needs security professionals who understand both cloud and security.',
    jobs: {
      foundation: [{ title: 'Cloud Security Analyst', salary: '$58K–$78K', desc: 'Monitors cloud environments for security threats and misconfigurations.' }],
      practitioner: [{ title: 'Cloud Security Engineer', salary: '$85K–$115K', desc: 'Implements security controls, IAM policies, and compliance frameworks on AWS.' }],
      proficient: [{ title: 'Senior Cloud Security Engineer', salary: '$115K–$150K', desc: 'Leads cloud security architecture and responds to incidents.' }],
      advanced: [{ title: 'Cloud Security Architect', salary: '$140K–$180K', desc: 'Designs enterprise cloud security strategy and standards.' }],
      expert: [{ title: 'CISO / Head of Cloud Security', salary: '$160K–$230K+', desc: 'Sets security strategy for an entire organisation.' }],
    },
    topSkills: ['IAM and least privilege', 'AWS Security services (GuardDuty, WAF, Security Hub)', 'Compliance (SOC 2, HIPAA, PCI)', 'Incident response', 'Threat modelling'],
    nextSteps: {
      beginner: ['Pass AWS Cloud Practitioner', 'Study IAM best practices and complete the IAM labs'],
      intermediate: ['Pass AWS Security Specialty', 'Complete a cloud security audit project'],
      advanced: ['Earn CISSP or CCSP', 'Design a cloud security framework from scratch'],
    },
    adjacent: ['aws_cloud_eng', 'cyber_analyst'],
    adjacentWhy: 'Cloud security bridges AWS engineering and cybersecurity — both are strong complementary skill sets.',
    certPaths: ['AWS Security Specialty', 'CISSP', 'CCSP (Cloud Security)', 'CompTIA Security+'],
  },
  aws_devops: {
    label: 'DevOps / Site Reliability Engineer',
    icon: '⚡',
    color: '#F59E0B',
    summary: 'DevOps engineers make software delivery fast and reliable. They are among the highest-paid engineers in the industry and are in demand everywhere.',
    jobs: {
      foundation: [{ title: 'Junior DevOps Engineer', salary: '$58K–$78K', desc: 'Maintains CI/CD pipelines and supports deployment processes.' }],
      practitioner: [{ title: 'DevOps Engineer', salary: '$85K–$120K', desc: 'Automates deployment pipelines and manages cloud infrastructure as code.' }],
      proficient: [{ title: 'Senior DevOps Engineer', salary: '$115K–$155K', desc: 'Architects CI/CD systems and sets DevOps standards for engineering teams.' }],
      advanced: [{ title: 'SRE Lead / Platform Engineer', salary: '$140K–$185K', desc: 'Leads reliability engineering and platform infrastructure strategy.' }],
      expert: [{ title: 'VP of Engineering / CTO', salary: '$180K+', desc: 'Sets technical direction for an organisation.' }],
    },
    topSkills: ['CI/CD (GitHub Actions, Jenkins, CodePipeline)', 'Infrastructure as Code (Terraform, CDK)', 'Docker & Kubernetes', 'Monitoring (CloudWatch, Prometheus)', 'Linux scripting'],
    nextSteps: {
      beginner: ['Pass AWS Cloud Practitioner', 'Set up a GitHub Actions pipeline for any project'],
      intermediate: ['Pass AWS DevOps Professional', 'Deploy an app with Terraform on AWS'],
      advanced: ['Containerise an app with Docker and deploy to ECS/EKS', 'Pass Kubernetes CKA certification'],
    },
    adjacent: ['aws_cloud_eng', 'aws_architect'],
    adjacentWhy: 'DevOps and cloud engineering are deeply connected — DevOps engineers often grow into architect or SRE lead roles.',
    certPaths: ['AWS DevOps Professional', 'Certified Kubernetes Administrator (CKA)', 'Terraform Associate', 'Linux Foundation LFCS'],
  },

  // ── Cybersecurity Program tracks ────────────────────────────
  cyber_soc: {
    label: 'SOC Analyst / Security Operations',
    icon: '🖥️',
    color: '#EF4444',
    summary: 'SOC analysts are the frontline defenders of cybersecurity. Every company with digital assets needs them, making this one of the most reliable entry points into security.',
    jobs: {
      foundation: [{ title: 'Tier 1 SOC Analyst', salary: '$45K–$62K', desc: 'Monitors security alerts, triages incidents, and escalates threats.' }],
      practitioner: [{ title: 'Tier 2 SOC Analyst', salary: '$65K–$90K', desc: 'Investigates incidents, performs threat hunting, and manages SIEM alerts.' }],
      proficient: [{ title: 'Senior SOC Analyst', salary: '$88K–$115K', desc: 'Leads incident response and develops detection rules.' }],
      advanced: [{ title: 'SOC Manager / Lead', salary: '$110K–$150K', desc: 'Manages the SOC team and oversees security operations strategy.' }],
      expert: [{ title: 'Head of Security Operations', salary: '$140K–$200K+', desc: 'Sets enterprise security operations strategy.' }],
    },
    topSkills: ['SIEM tools (Splunk, Microsoft Sentinel)', 'Threat hunting', 'Incident response', 'Log analysis', 'Network monitoring'],
    nextSteps: {
      beginner: ['Pass CompTIA Security+', 'Set up a home lab with a SIEM (Splunk free tier)', 'Complete TryHackMe SOC path (free)'],
      intermediate: ['Get hands-on with Splunk or Microsoft Sentinel', 'Complete a Tier 1 SOC simulation project'],
      advanced: ['Pursue CompTIA CySA+', 'Lead a simulated incident response exercise'],
    },
    adjacent: ['cyber_analyst', 'cyber_grc'],
    adjacentWhy: 'SOC analysts often grow into DFIR (digital forensics) or GRC roles as they gain experience.',
    certPaths: ['CompTIA Security+', 'CompTIA CySA+', 'Microsoft SC-200', 'Splunk Core Certified User'],
  },
  cyber_analyst: {
    label: 'Security Analyst / DFIR',
    icon: '🔍',
    color: '#8B5CF6',
    summary: 'Security analysts and DFIR professionals investigate breaches and uncover the how, what, and who behind cyberattacks. High demand, high impact.',
    jobs: {
      foundation: [{ title: 'Junior Security Analyst', salary: '$50K–$68K', desc: 'Supports security investigations and vulnerability assessments.' }],
      practitioner: [{ title: 'Security Analyst', salary: '$72K–$98K', desc: 'Conducts vulnerability assessments, threat analysis, and incident investigations.' }],
      proficient: [{ title: 'Senior Security Analyst', salary: '$95K–$128K', desc: 'Leads security investigations and advises on remediation.' }],
      advanced: [{ title: 'DFIR Lead / Principal Analyst', salary: '$120K–$160K', desc: 'Leads digital forensics and incident response for the organisation.' }],
      expert: [{ title: 'Director of Security Analytics', salary: '$150K+', desc: 'Sets strategy for detection, investigation, and response at an enterprise scale.' }],
    },
    topSkills: ['Digital forensics', 'Malware analysis basics', 'Vulnerability assessment', 'Incident response', 'Network packet analysis'],
    nextSteps: {
      beginner: ['Pass CompTIA Security+', 'Complete a CTF challenge (TryHackMe or HackTheBox)'],
      intermediate: ['Get CompTIA CySA+', 'Complete a DFIR lab project'],
      advanced: ['Pursue GCFE or GCIH (GIAC certs)', 'Complete a full incident response simulation'],
    },
    adjacent: ['cyber_soc', 'cyber_pentest'],
    adjacentWhy: 'Analysts who want to go offensive move into pentesting; those who want to go defensive go into SOC leadership or GRC.',
    certPaths: ['CompTIA Security+', 'CompTIA CySA+', 'GCIH (GIAC)', 'eCDFP'],
  },
  cyber_pentest: {
    label: 'Penetration Tester / Ethical Hacker',
    icon: '🎯',
    color: '#F97316',
    summary: 'Ethical hackers are paid to think like attackers and find vulnerabilities before criminals do. Penetration testing is one of the most exciting and well-paid roles in security.',
    jobs: {
      foundation: [{ title: 'Junior Penetration Tester', salary: '$58K–$78K', desc: 'Assists with vulnerability scanning and basic penetration tests under supervision.' }],
      practitioner: [{ title: 'Penetration Tester', salary: '$80K–$115K', desc: 'Conducts web, network, and application penetration tests for clients.' }],
      proficient: [{ title: 'Senior Penetration Tester', salary: '$110K–$148K', desc: 'Leads complex engagements and writes detailed finding reports.' }],
      advanced: [{ title: 'Red Team Lead', salary: '$135K–$175K', desc: 'Leads adversarial simulation exercises against enterprise targets.' }],
      expert: [{ title: 'Principal Security Researcher', salary: '$160K+', desc: 'Discovers zero-days and publishes original security research.' }],
    },
    topSkills: ['Kali Linux', 'Web application testing (OWASP Top 10)', 'Network scanning (Nmap)', 'Exploitation frameworks (Metasploit)', 'Report writing'],
    nextSteps: {
      beginner: ['Complete TryHackMe beginner path (free)', 'Study OWASP Top 10 vulnerabilities'],
      intermediate: ['Earn eJPT (eLearnSecurity Junior Pentester)', 'Complete 10 HackTheBox machines'],
      advanced: ['Pass OSCP (Offensive Security Certified Professional)', 'Build a home lab and document your findings'],
    },
    adjacent: ['cyber_analyst', 'cyber_soc'],
    adjacentWhy: 'Pentesters who want to transition to the defensive side become excellent security analysts — they know exactly what attackers look for.',
    certPaths: ['CompTIA PenTest+', 'eJPT', 'OSCP', 'CEH (Certified Ethical Hacker)'],
  },
  cyber_grc: {
    label: 'GRC / Compliance Analyst',
    icon: '📋',
    color: '#22C55E',
    summary: 'Governance, Risk, and Compliance is the business side of cybersecurity. GRC analysts don\'t need to hack — they ensure organisations follow regulations and manage risk. High demand in finance, healthcare, and government.',
    jobs: {
      foundation: [{ title: 'GRC Analyst', salary: '$52K–$70K', desc: 'Supports compliance activities, risk assessments, and policy documentation.' }],
      practitioner: [{ title: 'Compliance Analyst / Risk Analyst', salary: '$72K–$96K', desc: 'Manages compliance programs (HIPAA, PCI DSS, SOC 2) and risk registers.' }],
      proficient: [{ title: 'GRC Manager', salary: '$95K–$125K', desc: 'Leads GRC programs and liaises with auditors and regulators.' }],
      advanced: [{ title: 'CISO / Head of GRC', salary: '$130K–$180K', desc: 'Sets risk and compliance strategy for an entire organisation.' }],
      expert: [{ title: 'VP of Risk & Compliance', salary: '$165K+', desc: 'Executive-level oversight of all governance, risk, and compliance functions.' }],
    },
    topSkills: ['Risk assessment frameworks (NIST, ISO 27001)', 'Compliance (HIPAA, PCI DSS, SOC 2, GDPR)', 'Policy writing', 'Audit management', 'Business communication'],
    nextSteps: {
      beginner: ['Study NIST Cybersecurity Framework (free whitepaper)', 'Complete the AI & Compliance Research Brief assessment'],
      intermediate: ['Earn CompTIA Security+', 'Complete an ISO 27001 gap assessment project'],
      advanced: ['Pursue CISA or CRISC certification', 'Lead a full compliance audit project'],
    },
    adjacent: ['cyber_analyst', 'cyber_soc'],
    adjacentWhy: 'GRC + technical security = a rare and highly valued combination. Many GRC professionals branch into security analysis or CISO roles.',
    certPaths: ['CompTIA Security+', 'CISA (ISACA)', 'CRISC (ISACA)', 'ISO 27001 Lead Auditor'],
  },
  cyber_cloud: {
    label: 'Cloud Security Engineer',
    icon: '🌐',
    color: '#3B82F6',
    summary: 'The crossroads of cloud and security. Every major cloud migration creates a need for engineers who understand both AWS/Azure and security best practices.',
    jobs: {
      foundation: [{ title: 'Cloud Security Analyst', salary: '$58K–$78K', desc: 'Monitors cloud environments and remediates security misconfigurations.' }],
      practitioner: [{ title: 'Cloud Security Engineer', salary: '$88K–$120K', desc: 'Implements security controls across AWS/Azure and enforces compliance.' }],
      proficient: [{ title: 'Senior Cloud Security Engineer', salary: '$118K–$155K', desc: 'Designs cloud security architecture and leads security engineering projects.' }],
      advanced: [{ title: 'Cloud Security Architect', salary: '$145K–$185K', desc: 'Sets enterprise cloud security strategy and standards.' }],
      expert: [{ title: 'CISO / Head of Cloud Security', salary: '$165K+', desc: 'Governs cloud security at the executive level.' }],
    },
    topSkills: ['AWS/Azure security services', 'IAM and zero trust', 'Cloud compliance (SOC 2, HIPAA)', 'Container security', 'CSPM tools'],
    nextSteps: {
      beginner: ['Pass AWS Cloud Practitioner', 'Study IAM best practices and complete cloud security labs'],
      intermediate: ['Earn AWS Security Specialty or AZ-500', 'Complete a cloud security posture assessment project'],
      advanced: ['Earn CCSP', 'Build a cloud security framework and present it'],
    },
    adjacent: ['aws_security', 'cyber_analyst'],
    adjacentWhy: 'Cloud security engineers who go deeper on cloud become cloud architects; those who go deeper on security become CISOs.',
    certPaths: ['AWS Security Specialty', 'AZ-500 (Azure Security)', 'CCSP', 'CompTIA Security+'],
  },

  // ── AI / ML Program tracks ───────────────────────────────────
  ml_engineer: {
    label: 'ML / AI Engineer',
    icon: '🤖',
    color: '#8B5CF6',
    summary: 'ML engineers build the systems that power AI products. They are among the most-hired and highest-paid engineers in the world right now.',
    jobs: {
      foundation: [{ title: 'Junior ML Engineer', salary: '$65K–$88K', desc: 'Implements ML models under senior engineers, handles data pipelines.' }],
      practitioner: [{ title: 'ML Engineer', salary: '$95K–$135K', desc: 'Builds, trains, and deploys ML models into production systems.' }],
      proficient: [{ title: 'Senior ML Engineer', salary: '$130K–$175K', desc: 'Leads ML system design and mentors junior engineers.' }],
      advanced: [{ title: 'Staff ML Engineer', salary: '$165K–$215K', desc: 'Sets ML platform strategy and architecture for an engineering organisation.' }],
      expert: [{ title: 'Principal AI Engineer / AI Research Lead', salary: '$200K+', desc: 'Drives AI innovation and research at a company or research institution.' }],
    },
    topSkills: ['Python (NumPy, Pandas, scikit-learn)', 'Deep learning (TensorFlow or PyTorch)', 'MLOps and model deployment', 'Data pipelines', 'Statistics'],
    nextSteps: {
      beginner: ['Complete the Python for Data Science crash course', 'Build your first classification model with scikit-learn', 'Set up a Jupyter notebook environment'],
      intermediate: ['Build and deploy a model as an API using FastAPI', 'Complete a Kaggle competition', 'Learn MLflow for experiment tracking'],
      advanced: ['Fine-tune a pre-trained LLM on a custom dataset', 'Build an end-to-end MLOps pipeline', 'Publish a project to GitHub with documentation'],
    },
    adjacent: ['ml_data_scientist', 'ml_data_eng'],
    adjacentWhy: 'ML engineers who go deeper on statistics become data scientists; those who go deeper on infrastructure become data engineers.',
    certPaths: ['AWS Machine Learning Specialty', 'Google Professional ML Engineer', 'TensorFlow Developer Certificate', 'deeplearning.ai specialisations'],
  },
  ml_data_scientist: {
    label: 'Data Scientist',
    icon: '📊',
    color: '#F97316',
    summary: 'Data scientists extract insights from data and build predictive models. The role sits between statistics, programming, and business — and commands top salaries.',
    jobs: {
      foundation: [{ title: 'Junior Data Scientist', salary: '$65K–$88K', desc: 'Analyses data, builds basic models, and presents findings to stakeholders.' }],
      practitioner: [{ title: 'Data Scientist', salary: '$90K–$130K', desc: 'Designs experiments, builds predictive models, and drives data-driven decisions.' }],
      proficient: [{ title: 'Senior Data Scientist', salary: '$125K–$165K', desc: 'Leads complex modelling projects and translates results for business leaders.' }],
      advanced: [{ title: 'Principal Data Scientist', salary: '$155K–$200K', desc: 'Sets data science strategy and mentors teams.' }],
      expert: [{ title: 'Head of Data Science / Chief AI Officer', salary: '$185K+', desc: 'Leads AI/data science strategy at the executive level.' }],
    },
    topSkills: ['Statistics and probability', 'Python / R', 'Data visualisation', 'A/B testing', 'Machine learning'],
    nextSteps: {
      beginner: ['Complete the data storytelling assessment', 'Learn Python pandas and matplotlib', 'Complete a Kaggle intro course'],
      intermediate: ['Build a full EDA (exploratory data analysis) project', 'Understand and implement linear/logistic regression from scratch'],
      advanced: ['Complete Google Data Analytics Certificate', 'Publish a data project with interactive visualisation'],
    },
    adjacent: ['ml_engineer', 'ml_analyst'],
    adjacentWhy: 'Data scientists who code more become ML engineers; those who communicate more become data analysts or AI PMs.',
    certPaths: ['Google Data Analytics Certificate', 'IBM Data Science Professional', 'AWS Machine Learning Specialty', 'deeplearning.ai specialisations'],
  },
  ml_data_eng: {
    label: 'Data Engineer',
    icon: '🔧',
    color: '#22C55E',
    summary: 'Data engineers build the pipelines that feed ML models and analytics. Without good data infrastructure, AI doesn\'t work — making data engineers foundational to every AI product.',
    jobs: {
      foundation: [{ title: 'Junior Data Engineer', salary: '$60K–$82K', desc: 'Builds and maintains data pipelines under senior engineers.' }],
      practitioner: [{ title: 'Data Engineer', salary: '$88K–$122K', desc: 'Designs ETL/ELT pipelines, manages data warehouses, and ensures data quality.' }],
      proficient: [{ title: 'Senior Data Engineer', salary: '$118K–$158K', desc: 'Architects large-scale data systems and leads data infrastructure projects.' }],
      advanced: [{ title: 'Staff Data Engineer / Data Architect', salary: '$150K–$195K', desc: 'Sets data platform strategy for an engineering organisation.' }],
      expert: [{ title: 'Head of Data Engineering', salary: '$180K+', desc: 'Leads all data infrastructure and platform strategy.' }],
    },
    topSkills: ['Python', 'SQL (advanced)', 'Apache Spark / Kafka', 'Cloud data warehouses (Snowflake, BigQuery)', 'Airflow / dbt'],
    nextSteps: {
      beginner: ['Master SQL (especially window functions and CTEs)', 'Set up a PostgreSQL database and practise queries', 'Learn Python pandas for data manipulation'],
      intermediate: ['Build an ETL pipeline using Python + a cloud database', 'Complete the Google Data Engineering specialisation'],
      advanced: ['Deploy a streaming pipeline with Kafka or Kinesis', 'Build a dbt project and document the data model'],
    },
    adjacent: ['ml_engineer', 'ml_data_scientist'],
    adjacentWhy: 'Data engineers who learn ML become ML engineers; those who learn analytics become data scientists.',
    certPaths: ['Google Professional Data Engineer', 'AWS Data Analytics Specialty', 'dbt Analytics Engineer', 'Databricks Associate'],
  },
  ml_ai_pm: {
    label: 'AI Product Manager',
    icon: '🎯',
    color: '#EAB308',
    summary: 'AI PMs bridge the gap between business goals and AI capabilities. They don\'t build models — they decide what to build, why, and for whom. A rare hybrid role with excellent compensation.',
    jobs: {
      foundation: [{ title: 'Associate Product Manager (AI)', salary: '$68K–$90K', desc: 'Supports AI product development with research, requirements, and documentation.' }],
      practitioner: [{ title: 'AI Product Manager', salary: '$95K–$130K', desc: 'Owns AI product features from conception to launch, working with ML and engineering teams.' }],
      proficient: [{ title: 'Senior AI PM', salary: '$130K–$170K', desc: 'Leads AI product strategy and manages cross-functional teams.' }],
      advanced: [{ title: 'Group PM / Director of AI Product', salary: '$160K–$210K', desc: 'Sets AI product vision across multiple product lines.' }],
      expert: [{ title: 'VP of AI Product / Chief AI Officer', salary: '$200K+', desc: 'Drives AI product and business strategy at the executive level.' }],
    },
    topSkills: ['Understanding of ML model lifecycle', 'Product roadmapping', 'User research and A/B testing', 'AI ethics and bias', 'Stakeholder management'],
    nextSteps: {
      beginner: ['Complete the AI Productivity Blueprint to understand AI workflows', 'Learn product management basics (PM School or Product HQ, free)'],
      intermediate: ['Define a product spec for one AI feature', 'Study AI ethics and responsible AI frameworks'],
      advanced: ['Complete an end-to-end AI product case study', 'Get the Product School AI PM Certificate'],
    },
    adjacent: ['ml_analyst', 'ml_engineer'],
    adjacentWhy: 'AI PMs who want to go more technical become ML engineers; those who want to go more analytical become data scientists or research analysts.',
    certPaths: ['Product School AI PM Certificate', 'Google Project Management Certificate', 'CSPO (Scrum Product Owner)', 'deeplearning.ai AI for Everyone'],
  },
  ml_analyst: {
    label: 'AI / ML Research Analyst',
    icon: '🔬',
    color: '#EC4899',
    summary: 'Research analysts study AI/ML developments, evaluate models, and communicate insights. A great entry-level role for those interested in AI policy, research, or becoming a technical writer/communicator.',
    jobs: {
      foundation: [{ title: 'AI Research Assistant', salary: '$50K–$70K', desc: 'Supports research projects with literature review, data collection, and report writing.' }],
      practitioner: [{ title: 'ML Research Analyst', salary: '$72K–$98K', desc: 'Evaluates AI models, benchmarks performance, and writes technical reports.' }],
      proficient: [{ title: 'Senior Research Analyst', salary: '$95K–$128K', desc: 'Leads research projects and publishes findings for technical and non-technical audiences.' }],
      advanced: [{ title: 'AI Policy Analyst / Principal Researcher', salary: '$115K–$155K', desc: 'Sets research agenda and influences AI policy and standards.' }],
      expert: [{ title: 'Research Director / Head of AI Policy', salary: '$150K+', desc: 'Leads AI research or policy at an institute, government body, or large tech company.' }],
    },
    topSkills: ['Technical writing', 'Research methodology', 'Python basics', 'Data visualisation', 'AI ethics and policy'],
    nextSteps: {
      beginner: ['Complete the Market Intelligence Report with AI assessment', 'Read 5 AI research papers (Google Scholar)', 'Write a 1-page summary of one AI trend'],
      intermediate: ['Publish a research note on LinkedIn', 'Complete a data storytelling project', 'Study AI ethics frameworks (EU AI Act, NIST AI RMF)'],
      advanced: ['Contribute to an open-source AI evaluation project', 'Write and publish an original AI analysis piece'],
    },
    adjacent: ['ml_data_scientist', 'ml_ai_pm'],
    adjacentWhy: 'Research analysts who code more become data scientists; those who focus on product become AI PMs.',
    certPaths: ['deeplearning.ai AI for Everyone', 'Google Data Analytics Certificate', 'Coursera AI Ethics', 'Turing Institute AI courses'],
  },
}

// ── Survey answer key (for MCQ scoring) ──────────────────────
export const SURVEY_ANSWER_KEY = {
  ans_mfa: 'A second login step like a phone code',
  ans_phishing: "Go to the bank's official website",
  ans_wifi: 'WEP',
  ans_gdrive: 'Viewer',
  ans_hallucination: 'AI states false info as true',
  ans_best_prompt: 'You are a recruiter. Write a 5-sentence follow-up email after a first interview. Tone: warm. End with next steps.',
  ans_rtft: 'Role, Task, Format, Tone',
  ans_ai_search: 'Perplexity AI',
  ans_citations: 'Verify each one — AI invents fake citations',
}

export function scoreSurvey(answers) {
  let cyber = 0, ai = 0
  if (answers.ans_mfa === SURVEY_ANSWER_KEY.ans_mfa) cyber++
  if (answers.ans_phishing === SURVEY_ANSWER_KEY.ans_phishing) cyber++
  if (answers.ans_wifi === SURVEY_ANSWER_KEY.ans_wifi) cyber++
  if (answers.ans_gdrive === SURVEY_ANSWER_KEY.ans_gdrive) cyber++
  if (answers.ans_hallucination === SURVEY_ANSWER_KEY.ans_hallucination) ai++
  if (answers.ans_best_prompt === SURVEY_ANSWER_KEY.ans_best_prompt) ai++
  if (answers.ans_rtft === SURVEY_ANSWER_KEY.ans_rtft) ai++
  if (answers.ans_ai_search === SURVEY_ANSWER_KEY.ans_ai_search) ai++
  if (answers.ans_citations === SURVEY_ANSWER_KEY.ans_citations) ai++
  const total = cyber + ai
  const pct = Math.round((total / 9) * 100)
  const computedLevel = total >= 7 ? 'advanced' : total >= 4 ? 'intermediate' : 'beginner'
  return { cyber, ai, total, pct, computedLevel }
}

export function CAREER_TRACK_FROM_GOAL(goal) {
  const map = {
    'IT & AI Support': 'it',
    'Business Operations': 'biz',
    'Healthcare / Gov / Edu / Legal': 'sector',
    'Data & Analytics': 'data',
    'Automation & Workflow Management': 'auto',
    'Marketing, Communications & Content': 'marketing',
    'Administrative & Office Technology': 'admin',
    'Customer Service & Client Relations': 'cx',
    'Human Resources & People Ops': 'hr',
    'Sales & Business Development': 'sales',
  }
  return map[goal] || null
}

// ── What-to-improve suggestions based on student performance ─
export function getImprovementSuggestions(trackId, skillLevel, recentFails, score, totalAssessments, completedAssessments) {
  const intel = TRACK_INTEL[trackId]
  if (!intel) return []
  const suggestions = []
  const pctComplete = totalAssessments > 0 ? Math.round((completedAssessments / totalAssessments) * 100) : 0

  if (completedAssessments === 0) {
    suggestions.push({ type: 'start', icon: '🚀', text: `Start your first ${intel.label} assessment to begin earning points toward your job readiness score.` })
  }
  if (recentFails > 0) {
    suggestions.push({ type: 'revise', icon: '📝', text: `You have ${recentFails} assessment${recentFails > 1 ? 's' : ''} needing revision. Review the rubric, strengthen your work, and resubmit — resubmits are expected and show growth.` })
  }
  if (score < 50 && completedAssessments > 0) {
    suggestions.push({ type: 'score', icon: '🎯', text: `Your score is ${score} — reach 50 to unlock Practitioner status. Focus on completing General assessments first to build momentum.` })
  }
  if (pctComplete < 50 && completedAssessments > 0) {
    suggestions.push({ type: 'progress', icon: '📈', text: `You've completed ${pctComplete}% of your available assessments. Finishing more assessments is the fastest way to improve your job readiness score.` })
  }
  const nextStepList = intel.nextSteps[skillLevel] || intel.nextSteps.beginner
  if (nextStepList?.[0]) {
    suggestions.push({ type: 'skill', icon: '💡', text: nextStepList[Math.min(completedAssessments, nextStepList.length - 1)] })
  }
  return suggestions.slice(0, 3)
}
