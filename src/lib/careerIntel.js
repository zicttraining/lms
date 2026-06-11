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
