// ─────────────────────────────────────────────
// ZICT Program Data — all weeks, labs, sessions
// ─────────────────────────────────────────────

// ── Programs ──────────────────────────────────
export const PROGRAMS = [
  { id: 'applied_ai',    label: 'Applied AI & Digital Productivity', color: '#F97316', icon: '🤖' },
  { id: 'aws',           label: 'AWS Cloud Architect Engineer',       color: '#3B82F6', icon: '☁️' },
  { id: 'cybersecurity', label: 'Cybersecurity Essentials',          color: '#EF4444', icon: '🔐' },
  { id: 'ai_ml',         label: 'AI / ML Foundations',               color: '#8B5CF6', icon: '🧠' },
  { id: 'mentorship',    label: 'Technical Mentorship & Placement',  color: '#22C55E', icon: '🚀' },
]

export function getProgramById(id) {
  return PROGRAMS.find(p => p.id === id) || PROGRAMS[0]
}

export function getWeeksByProgram(programId) {
  return WEEKS.filter(w => w.program === (programId || 'applied_ai'))
}

export function getTotalLabsByProgram(programId) {
  return getWeeksByProgram(programId).reduce((sum, w) => sum + w.labCount, 0)
}

export const CAREER_TRACKS = [
  { id: 'it',       label: 'IT & AI Support',                       salary: '$37K–$120K' },
  { id: 'admin',    label: 'Administrative & Office Technology',     salary: '$34K–$66K'  },
  { id: 'biz',      label: 'Business Operations & Analysis',         salary: '$50K–$104K' },
  { id: 'marketing',label: 'Marketing, Communications & Content',    salary: '$44K–$140K' },
  { id: 'cx',       label: 'Customer Service & Client Relations',    salary: '$35K–$109K' },
  { id: 'hr',       label: 'Human Resources & People Ops',           salary: '$46K–$130K' },
  { id: 'sales',    label: 'Sales & Business Development',           salary: '$47K–$140K' },
  { id: 'data',     label: 'Data, Reporting & AI Analytics',         salary: '$36K–$99K'  },
  { id: 'auto',     label: 'Automation & Workflow Management',       salary: '$58K–$104K' },
  { id: 'sector',   label: 'Healthcare / Gov / Edu / Legal',         salary: '$40K–$99K'  },
]

export const WEEKS = [
  {
    num: 1, title: 'Digital Readiness & Cybersecurity',
    program: 'applied_ai',
    level: 1, levelLabel: 'Level 1', color: '#3B82F6',
    sessions: 8, labCount: 6,
    unlocksAt: null, cert: null,
    appliedLabTitle: 'Digital Security Audit',
    careerContext: {
      whyItMatters: 'Every organisation handles sensitive data — employees who understand cybersecurity reduce breach risk and are trusted with more responsibility from day one.',
      jobTitles: ['IT Support Specialist', 'Help Desk Technician', 'Digital Literacy Trainer', 'Cybersecurity Analyst (Entry)'],
      salaryRange: '$38K–$72K',
      skills: ['Password management', 'MFA setup', 'Phishing detection', 'Data privacy compliance'],
      searchQuery: 'IT support digital literacy cybersecurity entry level',
      levelUp: 'Complete Level 1 certification and add "Security-Aware Professional" to your LinkedIn skills section.',
      businessUse: 'A single data breach costs small businesses an average of $200K — often enough to close them. This week gives you the tools to protect your customer data, lock down your accounts, and meet basic compliance requirements (GDPR, HIPAA) at zero cost. Set up Bitwarden for your entire team, enable MFA on every business account, and train staff on phishing in one hour.',
      employeeUse: 'Propose a "Security Audit Hour" to your manager — use the 6-item checklist from this week to review your team\'s accounts and flag risks. Employees who proactively identify security gaps are trusted with more responsibility and leadership opportunities.',
      businessExamples: [
        'A 3-person e-commerce shop avoids a hacked PayPal account by enabling MFA — saves $4,000 in potential fraud',
        'A consultant organises all client contracts in a structured Google Drive with proper sharing permissions — impresses clients and wins referrals',
        'A small medical practice completes a HIPAA awareness checklist from this week, avoiding a $10K fine from an unencrypted email',
      ],
      roi: 'Zero cost. Data breach prevention alone saves businesses $200K+ on average. MFA alone blocks 99.9% of account compromise attacks.',
    },
    labs: [
      { num: 1, title: 'Security Setup Lab',         day: 'Mon', desc: 'Install Bitwarden, generate 5 strong passwords, save vault items' },
      { num: 2, title: 'MFA Activation Exercise',    day: 'Mon', desc: 'Enable MFA on Gmail, Microsoft, LinkedIn — screenshot all 3' },
      { num: 3, title: 'Phishing Detection Drill',   day: 'Tue', desc: 'Complete Google Phishing Quiz ≥80%, write 3-sentence reflection' },
      { num: 4, title: 'Cloud Storage Organization', day: 'Tue', desc: 'Build structured Google Drive with 5 sub-folders, set sharing' },
      { num: 5, title: 'Network Safety Assessment',  day: 'Wed', desc: 'Audit device Wi-Fi, firewall, VPN — complete 6-item checklist' },
      { num: 6, title: 'Digital Security Audit',     day: 'Thu', isApplied: true, desc: 'Full personal audit + GDPR/HIPAA Q&A + 30-day action plan' },
    ]
  },
  {
    num: 2, title: 'Workplace Digital Tools',
    program: 'applied_ai',
    level: 1, levelLabel: 'Level 1', color: '#3B82F6',
    sessions: 8, labCount: 6,
    unlocksAt: { week: 1, minLabs: 5 },
    cert: { level: 1, title: 'Digital Readiness & Workplace Technology Certificate', awardedAfterWeek: 2 },
    appliedLabTitle: 'Multi-Tool Workflow Project',
    careerContext: {
      whyItMatters: 'Google Workspace and Microsoft 365 are required in 92% of administrative and operations job postings — fluency in these tools is the single fastest way to increase your employability.',
      jobTitles: ['Administrative Assistant', 'Executive Assistant', 'Office Manager', 'Operations Coordinator'],
      salaryRange: '$40K–$78K',
      skills: ['Google Docs/Sheets/Slides', 'Microsoft Excel & PowerPoint', 'Zoom & Teams meetings', 'Professional email management'],
      searchQuery: 'administrative assistant google workspace microsoft 365',
      levelUp: 'Take the Google Workspace Individual Certification (free) to add a verified credential to your resume.',
      businessUse: 'Stop losing documents, repeating yourself in meetings, and chasing approvals over email. Google Workspace ($6/user/month) centralises everything your business produces — documents, spreadsheets, client files, meeting notes — all searchable, all shareable, all backed up. This week you build the habits that separate professional businesses from chaotic ones.',
      employeeUse: 'Become the most organised person on your team. Use Google Sheets to build a tracker for your department, run your next meeting with Zoom and share structured notes via Docs, and suggest migrating team files from email attachments to shared Drives. Visible organisation = visible leadership.',
      businessExamples: [
        'A real estate agent moves from email attachments to a structured Google Drive folder per client — saves 3 hours/week and stops losing documents',
        'A hair salon owner builds a Google Sheets booking tracker and shares it with staff — eliminates double-bookings overnight',
        'A freelance designer uses Google Slides templates instead of rebuilding proposals each time — cuts proposal time from 4 hours to 30 minutes',
      ],
      roi: '$6/user/month for Google Workspace. Businesses report 25% faster decision-making and 30% reduction in email volume after full adoption.',
    },
    labs: [
      { num: 1, title: 'Google Docs Collaboration Lab', day: 'Mon', desc: 'Shared doc, comments, track changes, heading styles, co-editing' },
      { num: 2, title: 'Google Sheets Data Lab',        day: 'Mon', desc: 'Budget tracker with SUM, AVERAGE, IF, conditional formatting' },
      { num: 3, title: 'Excel Spreadsheet Lab',         day: 'Tue', desc: 'Employee table, formulas, bar chart, formatted as Table' },
      { num: 4, title: 'PowerPoint Presentation Lab',   day: 'Tue', desc: '5-slide professional deck, custom colors, Fade transitions' },
      { num: 5, title: 'Virtual Meeting Lab',           day: 'Wed', desc: 'Host 10-min Zoom, screen share, record, Slack follow-up' },
      { num: 6, title: 'Multi-Tool Workflow Project',   day: 'Thu', isApplied: true, desc: 'Gmail brief → Excel report → Slides summary → Drive package' },
    ]
  },
  {
    num: 3, title: 'AI Foundations & Prompt Engineering',
    program: 'applied_ai',
    level: 2, levelLabel: 'Level 2', color: '#EAB308',
    sessions: 9, labCount: 7,
    unlocksAt: { week: 2, minLabs: 5 },
    cert: null,
    appliedLabTitle: 'Prompt Library Build',
    careerContext: {
      whyItMatters: 'Prompt engineering is one of the top 10 fastest-growing skills on LinkedIn — companies are actively hiring people who can get reliable, high-quality output from AI tools.',
      jobTitles: ['AI Prompt Engineer', 'AI Content Specialist', 'AI Productivity Trainer', 'Technology Coordinator'],
      salaryRange: '$55K–$130K',
      skills: ['ChatGPT & Gemini prompting', 'Role-Task-Format-Tone framework', 'AI bias awareness', 'Prompt library creation'],
      searchQuery: 'AI prompt engineer specialist productivity',
      levelUp: 'Build a public Prompt Library on GitHub or Notion and link it in your resume and LinkedIn profile.',
      businessUse: 'The Prompt Library you build this week becomes a permanent business asset. Instead of every employee figuring out AI from scratch, you give them pre-tested, role-specific prompts that deliver consistent, professional output. A business owner who knows how to prompt AI correctly cuts content, research, and communication costs by 40–70% per task.',
      employeeUse: 'The employee who understands AI tools best becomes the unofficial "AI champion" on their team — a role that leads directly to raises, promotions, and being included in strategic projects. Share two prompts from your library at your next team meeting and watch your credibility jump.',
      businessExamples: [
        'A marketing agency owner builds a 15-prompt library for client social media content — writes a full month of posts in one afternoon instead of one week',
        'A restaurant owner uses the Role-Task-Format-Tone framework to write a professional menu description, staff training materials, and a Yelp response template in 30 minutes',
        'An HR manager creates a library of prompts for job descriptions, screening questions, and onboarding documents — reduces hiring admin time by 60%',
      ],
      roi: 'ChatGPT Plus costs $20/month. One replaced copywriter saves $2,000–$5,000/month. One replaced research session saves 2–4 hours per task.',
    },
    labs: [
      { num: 1, title: 'AI Tool Comparison Lab',       day: 'Mon', desc: 'Same prompt → ChatGPT, Gemini, Copilot — comparison table' },
      { num: 2, title: 'Basic Prompting Exercise',     day: 'Mon', desc: '5 prompts across 5 categories, evaluate and rate outputs' },
      { num: 3, title: 'Prompt Refinement Lab',        day: 'Tue', desc: '3 weak prompts improved using Role-Task-Format-Tone framework' },
      { num: 4, title: 'AI Summarization Exercise',    day: 'Tue', desc: 'Article → 5-bullet summary, 1-paragraph, tweet versions' },
      { num: 5, title: 'Bias & Hallucination Lab',     day: 'Wed', desc: 'Generate 3 AI responses, identify bias/inaccuracy, reflection' },
      { num: 6, title: 'Role-Play Prompt Lab',         day: 'Wed', desc: 'AI mock interviewer — 5-question simulation, review feedback' },
      { num: 7, title: 'Prompt Library Build',         day: 'Thu', isApplied: true, desc: '15 categorized, tested, workplace-ready prompts in Google Doc' },
    ]
  },
  {
    num: 4, title: 'AI for Workplace Productivity',
    program: 'applied_ai',
    level: 2, levelLabel: 'Level 2', color: '#EAB308',
    sessions: 8, labCount: 7,
    unlocksAt: { week: 3, minLabs: 6 },
    cert: null,
    appliedLabTitle: 'Simulated AI Workday',
    careerContext: {
      whyItMatters: 'Professionals who use AI tools complete tasks 40–80% faster than peers who don\'t — employers are now paying a 15–25% salary premium for AI-productive staff.',
      jobTitles: ['AI Productivity Analyst', 'Operations Specialist', 'Business Analyst', 'AI-Augmented Executive Assistant'],
      salaryRange: '$52K–$100K',
      skills: ['AI email drafting', 'Meeting transcription & summarisation', 'AI research with Perplexity', 'Presentation generation (Gamma)'],
      searchQuery: 'AI productivity specialist operations analyst business',
      levelUp: 'Document your "AI Workday" output as a case study — show it in interviews to prove real productivity gains.',
      businessUse: 'This week directly eliminates the most expensive invisible cost in your business: time spent on repetitive writing, meeting follow-ups, and research. Deploy AI for every email, every meeting summary, every report draft. A business owner who reclaims 10 hours/week from administrative tasks gains 500+ hours/year to spend on growth, clients, and strategy.',
      employeeUse: 'Use AI to complete your current workload in half the time — then use the saved time to take on higher-value work that gets you promoted. Never send a first-draft email without AI editing. Never leave a meeting without an AI-generated summary ready to send. You will immediately stand out as the most productive person on your team.',
      businessExamples: [
        'A business coach uses AI to summarise client session recordings into action items and next steps — sends same-day follow-ups that clients rave about',
        'A logistics company owner uses AI to draft all 5 weekly supplier emails in 20 minutes instead of 2 hours — reinvests that time in client calls',
        'A startup founder uses Gamma to build investor pitch slides in 2 hours instead of 2 days — raises funding faster because the deck is always updated',
      ],
      roi: '10 hours/week saved × 52 weeks × your hourly value = $26,000–$104,000 in recovered productive time per year per employee.',
    },
    labs: [
      { num: 1, title: 'Email Drafting Lab',       day: 'Mon', desc: '5 professional email types with ChatGPT — edited for human voice' },
      { num: 2, title: 'Meeting Summary Lab',      day: 'Mon', desc: '10-min transcript → structured minutes with decisions & actions' },
      { num: 3, title: 'AI Research Brief',        day: 'Tue', desc: 'Perplexity AI research, verify 3 claims, write 1-page brief' },
      { num: 4, title: 'Report Writing Lab',       day: 'Tue', desc: '500-word AI business report, edited and formatted in Docs' },
      { num: 5, title: 'AI Presentation Lab',      day: 'Wed', desc: 'Gamma.app 7-slide deck, customized, exported PDF' },
      { num: 6, title: 'Spreadsheet AI Lab',       day: 'Wed', desc: 'CSV to ChatGPT Code Interpreter — 3 insights, chart, cleaning' },
      { num: 7, title: 'Simulated AI Workday',     day: 'Thu', isApplied: true, desc: 'Full workday: email + meeting summary + task plan + slide + research' },
    ]
  },
  {
    num: 5, title: 'AI for Business Applications',
    program: 'applied_ai',
    level: 2, levelLabel: 'Level 2', color: '#EAB308',
    sessions: 8, labCount: 7,
    unlocksAt: { week: 4, minLabs: 6 },
    cert: { level: 2, title: 'AI Productivity & Workplace Applications Certificate', awardedAfterWeek: 5 },
    appliedLabTitle: 'Business Simulation Lab',
    careerContext: {
      whyItMatters: 'Marketing, sales, HR, and customer service teams are the fastest adopters of AI — professionals who can deploy AI across these functions are being promoted ahead of traditional colleagues.',
      jobTitles: ['AI Marketing Specialist', 'Content Strategist', 'Sales Operations Analyst', 'HR Technology Specialist'],
      salaryRange: '$52K–$115K',
      skills: ['Social media content at scale', 'AI-powered sales outreach', 'Job description & HR writing', 'Business reporting with AI'],
      searchQuery: 'AI marketing content strategy business operations specialist',
      levelUp: 'You\'ve earned Level 2 certification — add it to LinkedIn and start applying for mid-level roles with confidence.',
      businessUse: 'This week gives you the ability to run a fully AI-assisted business operation across your four biggest cost centres: marketing (social content), sales (outreach sequences), HR (job descriptions and onboarding), and finance (reports and invoices). A solo founder or small team can now execute at the quality level of a $500K/year marketing department — for $20/month.',
      employeeUse: 'Volunteer for cross-functional projects in marketing, HR, or sales. Use this week\'s skills to produce assets that those departments would normally spend thousands of dollars outsourcing. Being the employee who can "do everything with AI" makes you the most valuable person in any room.',
      businessExamples: [
        'A personal trainer creates 30 days of Instagram content in a single afternoon — fills their schedule 3 weeks ahead for the first time',
        'A staffing agency owner writes 10 AI-generated job descriptions in 20 minutes — reduces time-to-post from 2 days to same day',
        'A B2B software startup builds a 3-email cold outreach sequence with AI — increases reply rates by 35% compared to their previous manual emails',
      ],
      roi: 'Social media management agencies charge $1,500–$5,000/month. AI replaces 80% of that work. Sales copywriters charge $500–$2,000 per email sequence. AI replaces that too.',
    },
    labs: [
      { num: 1, title: 'Social Media Content Lab',  day: 'Mon', desc: '5-post campaign for LinkedIn/Instagram/Facebook for a sample biz' },
      { num: 2, title: 'Customer FAQ Lab',          day: 'Mon', desc: '10-question AI-powered FAQ document with response scripts' },
      { num: 3, title: 'Sales Outreach Lab',        day: 'Tue', desc: '3-email cold outreach sequence for product/service scenario' },
      { num: 4, title: 'Business Document Lab',     day: 'Tue', desc: '1-page business proposal + service invoice with AI' },
      { num: 5, title: 'Job Description Lab',       day: 'Tue', desc: '2 AI-generated JDs + screening questions + onboarding outline' },
      { num: 6, title: 'Business Reporting Lab',    day: 'Wed', desc: 'Financial data → plain-language 1-page performance summary' },
      { num: 7, title: 'Business Simulation Lab',   day: 'Thu', isApplied: true, desc: 'Marketing → customer response → sales email → invoice → weekly summary' },
    ]
  },
  {
    num: 6, title: 'Automation & Workflow Systems',
    program: 'applied_ai',
    level: 3, levelLabel: 'Level 3', color: '#22C55E',
    sessions: 9, labCount: 7,
    unlocksAt: { week: 5, minLabs: 6 },
    cert: null,
    appliedLabTitle: 'Full Automation Build',
    careerContext: {
      whyItMatters: 'Automation engineers save companies an average of 20+ hours per week per employee — businesses are paying $20–40K salary premiums for staff who can build no-code/low-code automation workflows.',
      jobTitles: ['Workflow Automation Specialist', 'Operations Automation Analyst', 'No-Code Developer', 'Business Process Engineer'],
      salaryRange: '$58K–$110K',
      skills: ['Zapier & Make.com automation', 'AI + automation integration', 'Process mapping', 'Workflow debugging & documentation'],
      searchQuery: 'workflow automation specialist zapier make no-code',
      levelUp: 'Document your Week 6 automation as a case study with ROI numbers — "Automated X, saving Y hours/week" is a hiring magnet.',
      businessUse: 'Automation is the most direct path to scaling a business without hiring. The workflows you build this week eliminate the repetitive tasks that eat your team\'s time every single day — lead capture, follow-up emails, invoice triggers, file organisation, social posting. One well-built Zap can replace 2–3 hours of daily manual work indefinitely.',
      employeeUse: 'Identify the most repetitive task in your department and propose automating it. Use Zapier\'s free tier to build a proof of concept before your manager\'s next team meeting. Employees who bring automation ideas to their organisation are consistently fast-tracked into operations leadership and technology roles.',
      businessExamples: [
        'A real estate agent automates their lead pipeline: new Zillow inquiry → Gmail alert → Google Sheet row → personalised follow-up email draft in 3 minutes, not 3 hours',
        'An e-commerce store owner connects Shopify to Google Sheets via Zapier — gets automatic daily sales reports every morning without opening a dashboard',
        'A dental practice automates new patient form intake → patient record creation → welcome email → appointment reminder. Saves front desk 90 minutes per new patient.',
      ],
      roi: 'Zapier free plan handles 5 workflows. Paid starts at $20/month. One 3-step Zap saving 1 hour/day = 250 hours/year saved = $12,500–$25,000 in recovered staff time.',
    },
    labs: [
      { num: 1, title: 'First Zap Lab',               day: 'Mon', desc: 'Gmail label → Google Sheet → Slack notification (3-step Zap)' },
      { num: 2, title: 'Make.com Scenario Lab',       day: 'Mon', desc: 'Form submission → Google Doc → email notification' },
      { num: 3, title: 'Process Mapping Exercise',    day: 'Tue', desc: '5-step manual process → Lucidchart diagram → 3 automation points' },
      { num: 4, title: 'AI + Automation Integration', day: 'Tue', desc: 'ChatGPT API in Zapier: form trigger → AI draft → reply email' },
      { num: 5, title: 'Operations Automation Lab',   day: 'Wed', desc: 'File received → Drive → Sheets log → team notification' },
      { num: 6, title: 'Workflow Testing & Debugging',day: 'Wed', desc: 'Break 2 Zap steps, diagnose, fix, document debugging process' },
      { num: 7, title: 'Full Automation Build',       day: 'Thu', isApplied: true, desc: '5+ step workflow with AI integration, presented to group' },
    ]
  },
  {
    num: 7, title: 'Advanced AI & Multi-Tool Integration',
    program: 'applied_ai',
    level: 3, levelLabel: 'Level 3', color: '#22C55E',
    sessions: 8, labCount: 7,
    unlocksAt: { week: 6, minLabs: 6 },
    cert: null,
    appliedLabTitle: 'Integrated Workflow Optimization',
    careerContext: {
      whyItMatters: 'Professionals who can connect multiple AI tools into end-to-end pipelines are in the top 2% of AI literacy — companies building AI-first operations are actively recruiting these skills.',
      jobTitles: ['AI Systems Analyst', 'Digital Operations Manager', 'AI Integration Specialist', 'Custom GPT Developer'],
      salaryRange: '$75K–$145K',
      skills: ['Multi-tool AI pipelines', 'Custom GPT creation', 'Data analysis with Code Interpreter', 'AI governance & policy writing'],
      searchQuery: 'AI integration specialist digital operations systems analyst',
      levelUp: 'Your Custom GPT from this week is a portfolio artifact — publish it and share it on LinkedIn to stand out.',
      businessUse: 'This week you build the two most powerful business AI tools available to a small business: a Custom GPT trained on your business (acts as a 24/7 AI expert on your products, policies, and brand voice) and a data pipeline that turns raw business data into plain-English insights in minutes. These are the tools that previously cost $50,000+ to build custom.',
      employeeUse: 'Build a Custom GPT for your specific job function — a GPT that knows your company\'s products, brand guidelines, and common tasks. Present it to your manager as an internal productivity tool. Employees who build company-specific AI tools are viewed as high-potential leaders regardless of their job title.',
      businessExamples: [
        'A landscaping company owner builds a Custom GPT trained on their service catalogue, pricing, and FAQs — it drafts customer quotes in seconds instead of 20-minute calls',
        'A financial advisor uploads 3 months of client transaction data to Code Interpreter — gets a plain-English report identifying spending patterns to present at the next client review',
        'A law firm builds an AI governance policy using the Week 7 framework — protects client confidentiality while allowing staff to use AI tools safely',
      ],
      roi: 'A Custom GPT replaces a $500/month customer service chatbot subscription. AI-generated data insights replace a $3,000/month analyst retainer for basic reporting.',
    },
    labs: [
      { num: 1, title: 'Multi-Tool Content Pipeline',      day: 'Mon', desc: 'Perplexity → ChatGPT → Canva AI → packaged Google Doc' },
      { num: 2, title: 'Data Analysis Lab',                day: 'Mon', desc: 'CSV to Code Interpreter — 3 insights, chart, 1-page summary' },
      { num: 3, title: 'AI Visual Content Lab',            day: 'Tue', desc: '5 branded social images with Canva AI / DALL-E' },
      { num: 4, title: 'Custom GPT Builder Lab',           day: 'Tue', desc: 'Role-specific GPT built, tested with 10 queries, performance report' },
      { num: 5, title: 'Workflow Optimization Lab',        day: 'Wed', desc: 'Audit Week 6 workflow, fix 2 inefficiencies, document improvements' },
      { num: 6, title: 'AI Governance Assessment',         day: 'Wed', desc: 'Review 3 AI policies, write 1-page company AI use policy' },
      { num: 7, title: 'Integrated Workflow Optimization', day: 'Thu', isApplied: true, desc: 'Automation + data analysis + visual output — full system' },
    ]
  },
  {
    num: 8, title: 'Capstone Project & Career Readiness',
    program: 'applied_ai',
    level: 3, levelLabel: 'Level 3', color: '#22C55E',
    sessions: 9, labCount: 7,
    unlocksAt: { week: 7, minLabs: 6 },
    cert: { level: 3, title: 'AI Automation & Digital Operations Certificate', awardedAfterWeek: 8, isFull: true },
    appliedLabTitle: 'Final Demo Day & Graduation',
    careerContext: {
      whyItMatters: 'You have now completed one of the most comprehensive AI productivity programs available. You are in the top 5% of AI-literate professionals in the workforce — employers hiring for digital transformation roles want exactly what you\'ve built.',
      jobTitles: ['AI Operations Specialist', 'Digital Transformation Analyst', 'AI Productivity Consultant', 'Technology Trainer / Facilitator'],
      salaryRange: '$60K–$150K',
      skills: ['Full AI workflow design', 'Capstone portfolio', 'AI-optimised resume & LinkedIn', 'Live presentation skills'],
      searchQuery: 'AI specialist digital transformation operations consultant',
      levelUp: 'Post your graduation on LinkedIn, tag @ZICTTraining, and share your capstone. Your next step: apply for 3 roles within the first week of graduation.',
      businessUse: 'Your capstone IS your business transformation plan. Over 8 weeks you\'ve built the complete AI-powered operating system for your business — from security to tools to AI writing to automation to custom intelligence. Your final deliverable should document the full "before and after": what your business operations looked like before this program, and how they work now. This document becomes your business case for continued AI investment.',
      employeeUse: 'Your capstone portfolio proves you can apply AI across every business function. Bring it to your next performance review. Document the hours saved, processes improved, and business value created during this program. Employees who can quantify their AI impact are in the strongest negotiating position for raises and new roles.',
      businessExamples: [
        'A solo consultant uses their capstone to pitch "AI-Powered Business Operations" as a $5,000 service to small business clients — their ZICT certificate is their proof of expertise',
        'A retail shop owner implements all 8 weeks of learnings as a single system: secure accounts → cloud files → AI content → automated orders → custom product GPT. Saves 25 hours/week.',
        'An employee uses their capstone to apply for an internal "Digital Transformation Lead" role — uses documented productivity gains as their application case study and gets promoted',
      ],
      roi: 'Students who complete the full ZICT Applied AI program report an average of 15–20 hours/week saved in their first 90 days of applying these skills in their business or job.',
    },
    labs: [
      { num: 1, title: 'Capstone Scoping Lab',         day: 'Mon', desc: '1-page proposal: problem, tools, expected output, success metrics' },
      { num: 2, title: 'AI Resume Lab',                day: 'Mon', desc: 'AI-rewritten resume tailored to 2 target job descriptions + ATS test' },
      { num: 3, title: 'LinkedIn Optimization Lab',    day: 'Tue', desc: 'AI-written headline, About section, 3 experience bullets — published' },
      { num: 4, title: 'Cover Letter Lab',             day: 'Tue', desc: 'Customized AI cover letter for real job posting, refined for ATS' },
      { num: 5, title: 'Capstone Build Lab',           day: 'Tue', desc: '80% capstone complete, instructor draft review, feedback incorporated' },
      { num: 6, title: 'Capstone Presentation Lab',    day: 'Wed', desc: '5-minute live presentation to cohort, Q&A' },
      { num: 7, title: 'Final Demo Day & Graduation',  day: 'Thu', isApplied: true, desc: 'Final capstone, program evaluation, ZICT certificate, celebration' },
    ]
  },

  // ── AWS Cloud Architect Engineer ─────────────────────────
  {
    num: 1, title: 'Architecture & Design',
    program: 'aws', level: 1, levelLabel: 'Foundation', color: '#3B82F6',
    sessions: 4, labCount: 4, unlocksAt: null, cert: null,
    appliedLabTitle: 'Architecture Documentation',
    careerContext: {
      whyItMatters: 'Cloud architecture design is the first skill clients pay for — consulting firms charge $150–$300/hour for discovery and documentation work that you are doing right now.',
      jobTitles: ['Junior Cloud Engineer', 'Cloud Consultant (Associate)', 'Solutions Architect Associate', 'Cloud Infrastructure Analyst'],
      salaryRange: '$70K–$105K',
      skills: ['Requirements gathering', 'AWS service selection', 'Lucidchart architecture diagrams', 'Technical documentation'],
      searchQuery: 'junior cloud engineer AWS solutions architect associate',
      levelUp: 'Start studying for the AWS Certified Solutions Architect – Associate (SAA-C03). This week\'s content is the first 20% of that exam.',
    },
    labs: [
      { num: 1, title: 'Client Discovery & Requirement Gathering', day: 'Mon', desc: 'Document BME client needs across 9 AWS domains: geography, IAM, compute, security, storage, networking, database, monitoring, cost' },
      { num: 2, title: 'AWS Technical Recommendations',           day: 'Tue', desc: 'Select one AWS service per domain with business justification tied to BME requirements' },
      { num: 3, title: 'Development Architecture Diagram',        day: 'Wed', desc: 'Build a Lucidchart diagram of the Dev environment using standard AWS architecture icons' },
      { num: 4, title: 'Architecture Documentation',              day: 'Thu', isApplied: true, desc: 'Written technical brief covering network, compute, data, security, and monitoring layers for BME' },
    ]
  },
  {
    num: 2, title: 'Infrastructure Build',
    program: 'aws', level: 1, levelLabel: 'Foundation', color: '#3B82F6',
    sessions: 4, labCount: 4, unlocksAt: { week: 1, minLabs: 3 },
    cert: { level: 1, title: 'AWS Infrastructure Design Certificate', awardedAfterWeek: 2 },
    appliedLabTitle: 'ALB, Auto Scaling & HTTPS Setup',
    careerContext: {
      whyItMatters: 'VPC, EC2, ALB, and Auto Scaling are the core skills in 80% of Cloud Engineer job descriptions — companies rebuilding on-prem infrastructure to AWS need engineers who can build exactly what you built this week.',
      jobTitles: ['Cloud Engineer', 'Infrastructure Engineer', 'AWS Engineer', 'Cloud Support Engineer'],
      salaryRange: '$80K–$130K',
      skills: ['VPC with public & private subnets', 'EC2 with Apache & User Data', 'Application Load Balancer + HTTPS', 'Auto Scaling Groups'],
      searchQuery: 'AWS cloud infrastructure engineer VPC EC2',
      levelUp: 'Screenshot your ALB DNS running over HTTPS and add it as a portfolio project on LinkedIn — "Built a multi-AZ load-balanced web application on AWS."',
    },
    labs: [
      { num: 1, title: 'Extended Architecture Documentation', day: 'Mon', desc: 'Expand Week 1 docs to link each AWS service to performance, scalability, and security outcomes' },
      { num: 2, title: 'Consolidated Client Technical Package', day: 'Tue', desc: 'Combine all architecture docs into a single client-ready technical deliverable for BME' },
      { num: 3, title: 'VPC, Subnets, EC2 & Apache Setup',     day: 'Wed', desc: 'Build Dev network with IGW, NAT Gateway, route tables, security groups, and Apache web server on EC2' },
      { num: 4, title: 'ALB, Auto Scaling & HTTPS Setup',       day: 'Thu', isApplied: true, desc: 'Configure Application Load Balancer, Auto Scaling Group, and SSL certificate via ACM' },
    ]
  },
  {
    num: 3, title: 'AWS Services & Terraform',
    program: 'aws', level: 2, levelLabel: 'IaC & CI/CD', color: '#6366F1',
    sessions: 4, labCount: 4, unlocksAt: { week: 2, minLabs: 3 },
    cert: null,
    appliedLabTitle: 'Production Terraform Deployment',
    careerContext: {
      whyItMatters: 'Terraform is the #1 required skill in DevOps job postings — engineers who can deploy infrastructure as code instead of clicking through the console command a 20–30% salary premium.',
      jobTitles: ['DevOps Engineer', 'Cloud Infrastructure Engineer', 'Platform Engineer', 'Infrastructure as Code Specialist'],
      salaryRange: '$90K–$145K',
      skills: ['S3, RDS, IAM, CloudTrail, SNS, CloudFront', 'Terraform variables & modules', 'Remote S3 backend + DynamoDB state lock', 'Multi-environment deployment (Dev/UAT/Prod)'],
      searchQuery: 'DevOps engineer Terraform AWS infrastructure as code',
      levelUp: 'Push your Terraform code to GitHub with a README. A working Terraform repo is worth more than any certification on a resume.',
    },
    labs: [
      { num: 1, title: 'S3, RDS, IAM, CloudTrail & SNS Setup', day: 'Mon', desc: 'Configure S3 with versioning, RDS MySQL Multi-AZ, IAM instance roles, CloudTrail, SNS, CloudFront, and AWS Budgets' },
      { num: 2, title: 'UAT Architecture & Terraform Guide',   day: 'Tue', desc: 'Create UAT architecture diagram and complete the end-to-end Terraform learning guide with tool setup' },
      { num: 3, title: 'Multi-Environment Terraform',          day: 'Wed', desc: 'Folder structure with modules, variables, and remote S3 backend for Dev, UAT, and Prod state management' },
      { num: 4, title: 'Production Terraform Deployment',      day: 'Thu', isApplied: true, desc: 'Full three-tier production infrastructure deployed via Terraform with Multi-AZ RDS and parameterized modules' },
    ]
  },
  {
    num: 4, title: 'CI/CD Pipelines',
    program: 'aws', level: 2, levelLabel: 'IaC & CI/CD', color: '#6366F1',
    sessions: 4, labCount: 4, unlocksAt: { week: 3, minLabs: 3 },
    cert: { level: 2, title: 'AWS Infrastructure as Code & CI/CD Certificate', awardedAfterWeek: 4 },
    appliedLabTitle: 'Capstone Project Plan',
    careerContext: {
      whyItMatters: 'CI/CD pipeline experience is listed in over 70% of DevOps and Cloud Engineer job postings — companies building on AWS need engineers who can automate deployment without human error.',
      jobTitles: ['DevOps Engineer', 'CI/CD Pipeline Engineer', 'Release Engineer', 'Cloud Automation Engineer'],
      salaryRange: '$100K–$155K',
      skills: ['GitHub Actions workflows', 'OIDC keyless AWS authentication', 'Terraform plan on PR / apply on merge', 'Multi-environment promotion gates'],
      searchQuery: 'DevOps CI/CD pipeline engineer GitHub Actions AWS',
      levelUp: 'You\'ve earned Level 2 certification. Add "Automated Terraform deployments with GitHub Actions CI/CD across Dev/UAT/Prod" to your resume bullet points.',
    },
    labs: [
      { num: 1, title: 'GitHub Actions CI/CD Pipeline Setup', day: 'Mon', desc: 'Configure GitHub Secrets, create workflow YAML for Terraform plan on PR and apply on merge to main' },
      { num: 2, title: 'CI/CD Pipeline Documentation',        day: 'Tue', desc: 'Written explanation of pipeline architecture, error troubleshooting steps, and environment promotion strategy' },
      { num: 3, title: 'Weeks 1–4 Review & Consolidation',    day: 'Wed', desc: 'Audit all prior deliverables, fill documentation gaps, prepare architecture portfolio folder in GitHub' },
      { num: 4, title: 'Capstone Project Plan',                day: 'Thu', isApplied: true, desc: 'Define capstone scope: problem, services, environments, timeline, and success criteria — approved by instructor' },
    ]
  },
  {
    num: 5, title: 'Containers & Cloud-Native',
    program: 'aws', level: 3, levelLabel: 'Architect', color: '#0EA5E9',
    sessions: 4, labCount: 4, unlocksAt: { week: 4, minLabs: 3 },
    cert: null,
    appliedLabTitle: 'ECS Terraform Capstone Presentation',
    careerContext: {
      whyItMatters: 'Container expertise (Docker + ECS/EKS) is the fastest-growing skill in cloud engineering — companies migrating from EC2 monoliths to microservices need engineers who can containerise and orchestrate workloads.',
      jobTitles: ['Cloud-Native Engineer', 'Container Engineer', 'ECS/Docker Specialist', 'Site Reliability Engineer (SRE)'],
      salaryRange: '$110K–$165K',
      skills: ['Docker image builds & ECR push', 'ECS Fargate serverless containers', 'Container infrastructure via Terraform', 'ALB + auto-scaling for containers'],
      searchQuery: 'Docker ECS Fargate container cloud native engineer AWS',
      levelUp: 'Add your live ECS deployment URL and GitHub repo to LinkedIn. "Deployed containerised applications to AWS ECS Fargate with Terraform" is a Level 3 resume bullet.',
    },
    labs: [
      { num: 1, title: 'GitHub Setup & Repository Fork',       day: 'Mon', desc: 'GitHub account setup, fork the ZICT training repo, create meaningful commits, resolve any merge conflicts' },
      { num: 2, title: 'Docker, ECR & ECS Fargate',            day: 'Tue', desc: 'Build a Docker image, push to Amazon ECR, and deploy the containerised app on ECS Fargate' },
      { num: 3, title: 'Production ECS with Terraform',        day: 'Wed', desc: 'ALB with HTTPS, ECS auto-scaling, CloudWatch log groups, and IAM task roles all provisioned via Terraform' },
      { num: 4, title: 'ECS Terraform Capstone Presentation',  day: 'Thu', isApplied: true, desc: 'Live demo of running ECS deployment, GitHub repo with all code, 5-slide architecture presentation' },
    ]
  },
  {
    num: 6, title: 'Kubernetes, Observability & Graduation',
    program: 'aws', level: 3, levelLabel: 'Architect', color: '#0EA5E9',
    sessions: 4, labCount: 4, unlocksAt: { week: 5, minLabs: 3 },
    cert: { level: 3, title: 'AWS Cloud Architect Engineer Certificate', awardedAfterWeek: 6, isFull: true },
    appliedLabTitle: 'Final Demo Day & Graduation',
    careerContext: {
      whyItMatters: 'Kubernetes engineers are among the highest-paid cloud professionals in the market — companies running microservices at scale need EKS expertise that very few engineers currently have.',
      jobTitles: ['Kubernetes Engineer', 'Platform Engineer', 'Site Reliability Engineer', 'AWS Cloud Architect'],
      salaryRange: '$125K–$190K',
      skills: ['Amazon EKS cluster deployment', 'CloudWatch Container Insights', 'Multi-environment CI/CD with approval gates', 'Full capstone presentation'],
      searchQuery: 'Kubernetes EKS platform engineer cloud architect AWS',
      levelUp: '🎓 You\'ve earned the AWS Cloud Architect Engineer Certificate. Next step: AWS Certified Solutions Architect – Associate (SAA-C03) exam. Your portfolio already covers most of the material.',
    },
    labs: [
      { num: 1, title: 'Amazon EKS Kubernetes Deployment',     day: 'Mon', desc: 'Create EKS cluster, write deployment manifests, verify pod health, and perform a rolling update' },
      { num: 2, title: 'EKS Observability & Monitoring',       day: 'Tue', desc: 'CloudWatch Container Insights, pod metrics dashboard, SNS alerts on failure, CloudTrail audit logging for EKS' },
      { num: 3, title: 'Multi-Environment CI/CD Automation',   day: 'Wed', desc: 'GitHub Actions multi-environment pipeline with manual approval gates for UAT and Production promotion' },
      { num: 4, title: 'Final Demo Day & Graduation',           day: 'Thu', isApplied: true, desc: '10-slide final presentation, live deployment demo, published GitHub repo, LinkedIn announcement, ZICT certificate' },
    ]
  },
]

// ── Week lookup helper ────────────────────────────────────
export function getWeekByNum(program, weekNum) {
  return WEEKS.find(w => w.program === (program || 'applied_ai') && w.num === weekNum)
}

// ── Unlock logic ─────────────────────────────────────────
export function getWeekStatus(weekNum, completedLabs) {
  const week = WEEKS[weekNum - 1]
  if (!week || !week.unlocksAt) return 'unlocked'
  const { week: reqWeek, minLabs } = week.unlocksAt
  const done = (completedLabs || []).filter(l => l.week_num === reqWeek && l.completed).length
  return done >= minLabs ? 'unlocked' : 'locked'
}

// ── Certificate status ────────────────────────────────────
export function getCertStatus(completedLabs, program) {
  const labs = completedLabs || []
  const count = (wn) => labs.filter(l => l.week_num === wn && l.completed).length
  const certs = []
  if ((program || 'applied_ai') === 'aws') {
    if (count(1) >= 3 && count(2) >= 3) certs.push(1)
    if (certs.includes(1) && count(3) >= 3 && count(4) >= 3) certs.push(2)
    if (certs.includes(2) && count(5) >= 3 && count(6) >= 3) certs.push(3)
  } else {
    if (count(1) >= 5 && count(2) >= 5) certs.push(1)
    if (certs.includes(1) && count(3) >= 6 && count(4) >= 6 && count(5) >= 6) certs.push(2)
    if (certs.includes(2) && count(6) >= 6 && count(7) >= 6 && count(8) >= 6) certs.push(3)
  }
  return certs
}

// ── Session data ─────────────────────────────────────────
export const WEEK_SESSIONS = {
  1: [
    { id:'IL-1', day:'Mon', title:'Digital Literacy Overview & Internet Safety', objective:'Define digital literacy; identify key online risks; understand safe browsing habits' },
    { id:'IL-2', day:'Mon', title:'Cybersecurity Threats & Social Engineering',  objective:'Recognize phishing, malware, ransomware; analyze real-world attack examples' },
    { id:'IL-3', day:'Mon', title:'Password Management & Multi-Factor Authentication', objective:'Explain strong password principles; demonstrate MFA setup' },
    { id:'IL-4', day:'Tue', title:'Network Security — VPN, Firewalls & Public Wi-Fi', objective:'Describe how VPNs work; identify safe vs. unsafe network behaviors' },
    { id:'IL-5', day:'Tue', title:'File Management & Cloud Storage Fundamentals',  objective:'Organize digital files; use Google Drive and OneDrive for professional work' },
    { id:'IL-6', day:'Tue', title:'Data Privacy & Compliance Awareness (GDPR, HIPAA)', objective:'Identify key data privacy regulations; apply principles to workplace tasks' },
    { id:'IL-7', day:'Wed', title:'Digital Communication Etiquette',              objective:'Draft professional emails; understand tone, format, and workplace norms' },
    { id:'IL-8', day:'Wed', title:'Browser Security & Safe Search Practices',     objective:'Configure secure browser settings; evaluate trusted vs. untrusted sources' },
  ],
  2: [
    { id:'IL-1', day:'Mon', title:'Google Workspace Fundamentals — Gmail, Drive, Docs', objective:'Navigate all Google Workspace apps for professional productivity' },
    { id:'IL-2', day:'Mon', title:'Microsoft 365 Essentials — Outlook, OneDrive, Teams', objective:'Use Microsoft 365 for workplace communication and collaboration' },
    { id:'IL-3', day:'Mon', title:'Advanced Google Docs & Slides',               objective:'Apply headings, styles, collaboration tools, presentations in Docs/Slides' },
    { id:'IL-4', day:'Tue', title:'Google Sheets & Excel Data Management',       objective:'Build spreadsheets with formulas, charts, and conditional formatting' },
    { id:'IL-5', day:'Tue', title:'Microsoft Word & PowerPoint Proficiency',     objective:'Create professional documents and presentations in Word and PowerPoint' },
    { id:'IL-6', day:'Tue', title:'Zoom, Teams & Professional Video Meetings',   objective:'Host meetings, share screens, manage recordings, professional etiquette' },
    { id:'IL-7', day:'Wed', title:'Slack & Microsoft Teams — Workplace Messaging', objective:'Use team messaging tools for professional async and sync communication' },
    { id:'IL-8', day:'Wed', title:'Email Management & Calendar Mastery',         objective:'Organize inbox, use filters/labels, schedule with Google/Outlook Calendar' },
  ],
  3: [
    { id:'IL-1', day:'Mon', title:'What is AI? History, Types & Real-World Applications', objective:'Distinguish narrow AI, general AI, generative AI; map AI to everyday tools' },
    { id:'IL-2', day:'Mon', title:'Machine Learning vs. Deep Learning vs. Generative AI', objective:'Explain with analogies how models learn; show examples in action' },
    { id:'IL-3', day:'Mon', title:'How Large Language Models Work',              objective:'Explain tokens, context windows, and model training in plain language' },
    { id:'IL-4', day:'Tue', title:'Introduction to ChatGPT',                     objective:'Navigate ChatGPT; understand capabilities and limitations; explore use cases' },
    { id:'IL-5', day:'Tue', title:'Google Gemini & Microsoft Copilot Overview',  objective:'Compare Gemini and Copilot to ChatGPT; identify best-use scenarios' },
    { id:'IL-6', day:'Tue', title:'Prompt Engineering Principles — Role, Task, Format, Tone', objective:'Write effective prompts using RTFT framework with real examples' },
    { id:'IL-7', day:'Wed', title:'Advanced Prompting — Chain-of-Thought & Few-Shot', objective:'Build multi-step prompts; use examples to guide AI output' },
    { id:'IL-8', day:'Wed', title:'AI Ethics, Bias, Hallucinations & Responsible Use', objective:'Identify AI bias sources; understand hallucination risks; apply responsible AI principles' },
    { id:'IL-9', day:'Wed', title:'AI Tools Landscape — Choosing the Right Tool', objective:'Survey the AI ecosystem; match tools to workplace tasks by category' },
  ],
  4: [
    { id:'IL-1', day:'Mon', title:'AI for Email Writing & Professional Communication', objective:'Use ChatGPT to draft, refine, and customize professional emails' },
    { id:'IL-2', day:'Mon', title:'AI Meeting Transcription & Summary Tools',    objective:'Use Otter.ai, Fireflies, and ChatGPT to convert meetings to structured notes' },
    { id:'IL-3', day:'Tue', title:'AI Research Tools — Perplexity AI & Web Search', objective:'Use Perplexity AI for cited research; evaluate source quality' },
    { id:'IL-4', day:'Tue', title:'AI Report & Document Generation',             objective:'Draft business reports, memos, and proposals with AI; edit for accuracy' },
    { id:'IL-5', day:'Wed', title:'AI Presentation Tools — Gamma & Canva',      objective:'Generate slides with Gamma.app; design with Canva AI tools' },
    { id:'IL-6', day:'Wed', title:'AI for Data Analysis — Code Interpreter',    objective:'Upload CSVs to ChatGPT Code Interpreter; extract insights and charts' },
    { id:'IL-7', day:'Wed', title:'AI Task Management & Scheduling',             objective:'Use AI to prioritize tasks, build weekly plans, manage project timelines' },
    { id:'IL-8', day:'Thu', title:'Measuring AI Productivity Gains',             objective:'Calculate time saved; document ROI of AI tools in your workflow' },
  ],
  5: [
    { id:'IL-1', day:'Mon', title:'AI for Marketing & Social Media Content',     objective:'Create multi-platform content campaigns using ChatGPT and Canva AI' },
    { id:'IL-2', day:'Mon', title:'AI Customer Service Tools & FAQ Systems',     objective:'Build FAQ bots, response templates, and customer communication scripts' },
    { id:'IL-3', day:'Tue', title:'AI Sales & Business Development Tools',       objective:'Use AI for outreach sequences, proposal writing, and CRM automation' },
    { id:'IL-4', day:'Tue', title:'AI for HR & Recruiting',                      objective:'Use AI for job descriptions, screening questions, and onboarding documents' },
    { id:'IL-5', day:'Tue', title:'AI Financial Document Generation',            objective:'Create invoices, proposals, and reports with AI; format for business use' },
    { id:'IL-6', day:'Wed', title:'AI for Legal & Compliance Documentation',     objective:'Use AI to draft basic contracts, policies, and compliance checklists' },
    { id:'IL-7', day:'Wed', title:'Industry-Specific AI Applications',           objective:'Deep-dive into AI tools for your chosen career track industry' },
    { id:'IL-8', day:'Thu', title:'Building an AI-Augmented Business Workflow',  objective:'Map a full business function from input to output using 3+ AI tools' },
  ],
  6: [
    { id:'IL-1', day:'Mon', title:'Introduction to Workflow Automation & No-Code Tools', objective:'Explain automation triggers, actions, filters; tour Zapier and Make.com' },
    { id:'IL-2', day:'Mon', title:'Zapier Fundamentals — Zaps, Triggers, Actions', objective:'Build 2-step and 3-step Zaps; connect Gmail, Sheets, Slack' },
    { id:'IL-3', day:'Tue', title:'Make.com Scenarios & Advanced Routing',       objective:'Build branching scenarios with routers, filters, and error handling' },
    { id:'IL-4', day:'Tue', title:'Integrating AI APIs into Automation Workflows', objective:'Add ChatGPT API as an action inside a Zapier or Make.com workflow' },
    { id:'IL-5', day:'Wed', title:'Process Mapping & Automation Opportunity Analysis', objective:'Identify automatable processes; calculate ROI of each automation' },
    { id:'IL-6', day:'Wed', title:'Automation Testing, Debugging & Documentation', objective:'Test workflows with edge cases; document automation for handoff' },
    { id:'IL-7', day:'Wed', title:'Operations Automation — Google Workspace & Microsoft 365', objective:'Automate file management, email routing, and calendar tasks' },
    { id:'IL-8', day:'Thu', title:'Building Your Automation Portfolio',          objective:'Package Week 6 automations as portfolio artifacts with business value statements' },
    { id:'IL-9', day:'Thu', title:'Client-Facing Automation Presentations',      objective:'Present automation ROI and workflow demos to a non-technical audience' },
  ],
  7: [
    { id:'IL-1', day:'Mon', title:'Multi-Tool AI Pipelines — Connecting Tools End-to-End', objective:'Build a content pipeline using Perplexity, ChatGPT, and Canva AI in sequence' },
    { id:'IL-2', day:'Mon', title:'Advanced Data Analysis with AI Code Interpreter',      objective:'Upload CSV data to ChatGPT Code Interpreter; generate charts and written insights' },
    { id:'IL-3', day:'Tue', title:'AI Visual Content Creation — Canva AI & DALL-E',       objective:'Generate on-brand social images and presentations using AI image tools' },
    { id:'IL-4', day:'Tue', title:'Building Custom GPTs for Specific Roles',              objective:'Configure a role-specific GPT with custom instructions, knowledge, and capabilities' },
    { id:'IL-5', day:'Wed', title:'Workflow Optimization & Efficiency Auditing',          objective:'Identify bottlenecks in existing automations; apply fixes and document improvements' },
    { id:'IL-6', day:'Wed', title:'AI Governance, Policy & Responsible Use at Work',     objective:'Review real AI policies; draft a one-page company AI usage policy' },
    { id:'IL-7', day:'Thu', title:'Integrated System Design — Bringing It All Together',  objective:'Map a complete AI + automation system across research, content, and data workflows' },
    { id:'IL-8', day:'Thu', title:'Portfolio Presentation Prep',                          objective:'Package Week 7 outputs as portfolio artifacts with business-value framing' },
  ],
  8: [
    { id:'IL-1', day:'Mon', title:'Capstone Project Scoping & Planning',                  objective:'Define problem, tools, deliverables, and success metrics for your capstone' },
    { id:'IL-2', day:'Mon', title:'AI-Powered Resume Writing & ATS Optimization',         objective:'Rewrite resume bullets with AI; test against ATS scanners for two target roles' },
    { id:'IL-3', day:'Tue', title:'LinkedIn Profile Optimization with AI',                objective:'Write AI-powered headline, About section, and experience bullets; publish live' },
    { id:'IL-4', day:'Tue', title:'Cover Letter & Job Application Strategy',              objective:'Draft a tailored AI cover letter for a real posting; optimize for ATS' },
    { id:'IL-5', day:'Tue', title:'Capstone Build Session — Instructor Review',           objective:'Complete 80% of capstone build; receive structured instructor feedback' },
    { id:'IL-6', day:'Wed', title:'Capstone Presentation Skills & Demo Prep',             objective:'Structure a 5-minute live demo; practice under time constraints' },
    { id:'IL-7', day:'Wed', title:'Job Search Strategy & Networking with AI',             objective:'Use AI to research companies, write outreach messages, and build a target list' },
    { id:'IL-8', day:'Thu', title:'Mock Interviews & Career Q&A',                         objective:'Practice common interview questions with AI; receive peer and instructor feedback' },
    { id:'IL-9', day:'Thu', title:'Demo Day Prep & Program Wrap-Up',                      objective:'Final dry-run; program evaluation; 90-day post-graduation action plan' },
  ],
}

// ── Lab step-by-step data ─────────────────────────────────
export const LAB_DATA = {
  w1l1: {
    overview: 'In this lab you will install Bitwarden — the most trusted free password manager — and practice generating cryptographically strong passwords. This replaces the dangerous habit of reusing weak passwords.',
    deliverable: 'Screenshot of Bitwarden vault showing 5 saved login items + screenshot of the password generator. File: LAB1_YourName_W1.png',
    steps: [
      { action: 'Go to bitwarden.com and click "Get Started Free"', detail: 'Use your personal email. The free plan is fully sufficient.' },
      { action: 'Create your master password — at least 16 characters', detail: 'Mix uppercase, lowercase, numbers, and symbols. Write it on paper in a safe place — you <strong>cannot recover it</strong> if lost.', warn: 'Never share your master password with anyone, including your instructor.' },
      { action: 'Install the browser extension', detail: 'After login → Download → install for Chrome/Firefox/Edge → pin it to your toolbar.' },
      { action: 'Open the Password Generator: Tools → Password Generator', detail: 'Set: Length 16+, Uppercase ✓, Lowercase ✓, Numbers ✓, Special Characters ✓. Generate 5 passwords for: Gmail, LinkedIn, Work Email, Bank, Social Media.', tip: 'Click Copy immediately after generating, then paste into the vault item before it clears.' },
      { action: 'Save each password as a Vault item', detail: 'Click + → Login → enter site name, your username/email, paste the password → Save.' },
      { action: 'Screenshot your vault showing all 5 items', detail: 'Go to My Vault → take screenshot. You may blur the actual password values if you prefer.', featured: true },
    ]
  },
  w1l6: {
    overview: 'Thursday Applied Lab: Comprehensive digital security audit. You will assess your current security posture, answer GDPR and HIPAA awareness questions, and write a concrete 30-day action plan.',
    deliverable: 'Google Doc link with all 4 sections complete. Be ready to walk through your action plan during group check-in (2 minutes). File: LAB6_APPLIED_YourName_W1',
    steps: [
      { action: 'Open a new Google Doc — title it "Digital Security Audit — [Your Name]"', detail: 'Share it with your instructor before end of class today.' },
      { action: 'Section 1: Password Health (15 min)', detail: 'List your key accounts. For each: Does it have a unique password? Is it in Bitwarden? Does it have MFA? Rate: 🔴 Weak / 🟡 Medium / 🟢 Strong. Upgrade at least 3 to Green during this session.' },
      { action: 'Section 2: Device & Network (10 min)', detail: 'Copy your LAB-5 checklist here. Add: "My biggest network vulnerability is ___. My plan to fix it is ___."' },
      { action: 'Section 3: GDPR & HIPAA Awareness (10 min)', detail: 'Answer in 1–2 sentences each:<br>① What must a company do after a data breach under GDPR?<br>② What does HIPAA protect? Give one example of PHI.<br>③ One thing you personally will do to protect your data privacy.' },
      { action: 'Section 4: My 30-Day Security Action Plan (15 min)', detail: 'Write 5 numbered, concrete actions with specific dates. "Update passwords on my 10 main accounts in Bitwarden by [date]" — not vague goals.', featured: true, tip: 'Graded on specificity. Show you understand real threats and the real fixes for each.' },
    ]
  },
  w2l1: {
    overview: 'Google Docs is the professional standard for collaborative document work. This lab teaches the key features that employers expect: heading styles, comments, track changes, and sharing.',
    deliverable: 'Google Doc share link showing: headings applied, 3+ comments, evidence of tracked changes accepted/rejected. Paste link in LMS submission.',
    steps: [
      { action: 'Create a new Google Doc, title it "Week 2 Collaboration Lab — [Your Name]"', detail: 'Go to docs.google.com → click blank template → rename at the top.' },
      { action: 'Write a 3-paragraph mock business memo', detail: 'TO: All Staff · FROM: [Your Name] · RE: New AI Tools Policy. Write 3 short paragraphs about a fictional company adopting AI tools. Keep each paragraph 3–4 sentences.' },
      { action: 'Apply Heading styles to structure the document', detail: 'Select your TO/FROM/RE line → Format → Paragraph styles → Heading 1. Select each paragraph topic sentence → Heading 2. Check View → Show document outline to see it work.', tip: 'Heading styles create a navigable document — employers expect this in professional memos and reports.' },
      { action: 'Add 3 comments using the Comments feature', detail: 'Highlight a phrase → right-click → Comment (or Ctrl+Alt+M). Leave 3 comments: one asking a question, one suggesting a change, one approving something.' },
      { action: 'Enable Suggesting mode and make 2 edits', detail: 'Click the pencil icon top-right → change "Editing" to "Suggesting." Make 2 edits — they appear as colored tracked changes.' },
      { action: 'Accept one suggestion and reject one, then set sharing', detail: 'Accept one tracked change (✓) and reject the other (✗). Switch back to Editing mode. Share → Anyone with the link → Commenter. Copy the link.', featured: true },
    ]
  },
  w3l3: {
    overview: 'The Role-Task-Format-Tone (RTFT) framework transforms vague prompts into precise instructions that get professional-quality AI output. This is the most important prompting skill in the program.',
    deliverable: 'Google Doc showing all 3 prompt pairs (before/after), AI outputs, and your explanations. File: LAB3_YourName_W3',
    steps: [
      { action: 'Understand the RTFT Framework', detail: '<strong>Role:</strong> "You are a senior marketing strategist…"<br><strong>Task:</strong> "Write a 5-bullet summary of…"<br><strong>Format:</strong> "Use a numbered list" / "3 short paragraphs" / "Table with 3 columns"<br><strong>Tone:</strong> "Professional and direct" / "Friendly and conversational"' },
      { action: 'Take 3 weak prompts and rewrite each using RTFT', detail: '<strong>Weak 1:</strong> "Write something about social media"<br><strong>Weak 2:</strong> "Help me with my email"<br><strong>Weak 3:</strong> "Explain AI"<br><br>In a Google Doc: show the Original → Your RTFT-Improved Prompt → The AI output you received.' },
      { action: 'Write a one-sentence explanation for each improvement', detail: '"The improved prompt worked better because ___." Be specific about which element of RTFT made the biggest difference.', featured: true },
    ]
  },
  w3l7: {
    overview: 'Your Prompt Library is the most valuable deliverable in the program. Graduates use it at their jobs. Make it real for your specific career track.',
    deliverable: 'Google Doc share link with 15 prompts organized in 5 categories, each with RTFT structure, tested output, and "best for" annotation. File: LAB7_APPLIED_YourName_W3',
    steps: [
      { action: 'Create a Google Doc titled "My AI Prompt Library — [Your Name]"', detail: 'Insert → Table of contents. You will have 5 categories. This is your professional AI toolkit.' },
      { action: 'Build 5 categories with 3 prompts each = 15 total', detail: '<strong>Category 1 — Email Writing:</strong> professional intro, follow-up, declining a request<br><strong>Category 2 — Research:</strong> summarize, research a topic, compare two options<br><strong>Category 3 — Content:</strong> social media post, blog intro, presentation talking points<br><strong>Category 4 — Data & Analysis:</strong> interpret data, find trends, write a report from bullets<br><strong>Category 5 — Career:</strong> resume bullet, LinkedIn About, interview prep' },
      { action: 'For each prompt: write it using RTFT, test it, paste the output', detail: 'Format: <strong>Prompt Name</strong> → <strong>The Prompt</strong> → <strong>Sample Output</strong> (first 3–4 sentences) → <strong>Best for:</strong> (1 sentence)', featured: true, tip: 'Customize these for your career track — HR prompts look different from automation prompts.' },
    ]
  },
  w4l7: {
    overview: 'Today you run a full simulated AI workday — 5 tasks, 3 hours, no non-AI tools. This is the real skill: not knowing AI tools exist, but actually using them under time pressure to produce real work.',
    deliverable: 'Google Doc with all 5 task outputs + 3-sentence reflection. Gamma PDF also attached. File: LAB7_APPLIED_YourName_W4',
    steps: [
      { action: 'Task 1 — Email Draft (20 min): ChatGPT → Gmail draft', detail: 'Use ChatGPT to draft a professional project update email. Edit it personally. Paste into Gmail as a draft (to yourself). Screenshot the draft.' },
      { action: 'Task 2 — Meeting Summary (25 min): Transcript → Structured Minutes', detail: 'The instructor provides a 10-min sample transcript in LMS. Paste into ChatGPT: `"Convert this transcript into meeting minutes with: Date, Attendees, Key Decisions (numbered), Action Items (owner + deadline), Next Meeting date."`' },
      { action: 'Task 3 — Task Plan (20 min): AI Prioritized Weekly Schedule', detail: 'Prompt: `"You are a productivity coach. I have these 8 tasks this week: [list them]. Organize into a prioritized Mon–Fri daily plan using the Eisenhower Matrix. Format as a table."`' },
      { action: 'Task 4 — AI Slide Deck (25 min): Gamma.app 5-slide deck', detail: 'Go to gamma.app → New → Generate → type your topic. Change the theme color. Edit at least 2 slide texts. Add your name to Slide 1. Export as PDF.' },
      { action: 'Task 5 — Research Brief (25 min): Perplexity AI + 1-page brief', detail: 'Search Perplexity: "Top 3 ways companies use AI to improve customer service in 2025." Write a 1-page brief: intro + 3 key findings + your conclusion. Cite your sources.', featured: true, tip: 'End with a 3-sentence reflection: Most efficient tool? What took longest without AI? What am I still not confident about?' },
    ]
  },
  w6l1: {
    overview: 'Zapier is the most widely used automation platform in the world. This lab builds your first real multi-step automation connecting Gmail, Google Sheets, and Slack.',
    deliverable: 'Screenshot of active Zap in Zapier dashboard + screenshot of Google Sheet with at least 1 row logged. File: LAB1_YourName_W6.png',
    steps: [
      { action: 'Sign up for a free Zapier account at zapier.com', detail: 'The free plan allows 5 active Zaps and 100 tasks/month — enough for all Week 6 labs. Sign in with Gmail.' },
      { action: 'Create a Gmail label called "ZICT-Zap-Test"', detail: 'In Gmail → click "+" next to Labels in left sidebar → name it "ZICT-Zap-Test". This will be your Zap trigger.' },
      { action: 'In Zapier: Create Zap → Trigger: Gmail → New Labeled Email', detail: 'Connect your Gmail account → choose "ZICT-Zap-Test" label → click "Test trigger" (send yourself a labeled email first).' },
      { action: 'Add Action 1: Google Sheets — Create Spreadsheet Row', detail: 'Connect Google Sheets → select a new sheet called "Zap Log" → map fields: Column A = Subject, Column B = Sender, Column C = Date Received.' },
      { action: 'Add Action 2: Slack or Gmail notification', detail: 'Slack: Post message "New email logged: {{subject}} from {{sender}}" in a channel.<br>No Slack: Gmail → Send Email to yourself with body "Zap Alert: {{subject}}".' },
      { action: 'Turn on your Zap and test it for real', detail: 'Click Publish Zap. Send yourself a test email and apply the "ZICT-Zap-Test" label. Within 15 min (free plan delay), check your Google Sheet for the new row.', featured: true, tip: 'Free plan has a 15-min polling delay. This is normal — paid plans are instant.' },
    ]
  },
  w8l7: {
    overview: 'Final Demo Day and Graduation. You have built something real: a portfolio, a prompt library, an AI workflow, and tailored resumes. Today you present it and receive your ZICT certificate.',
    deliverable: 'Capstone Google Doc link + Gamma/Slides presentation + program evaluation form + 90-day plan. File: CAPSTONE_YourName_W8_FINAL',
    steps: [
      { action: 'Prepare your 5-minute presentation structure', detail: '<strong>Minute 1:</strong> The problem you solved<br><strong>Minute 2:</strong> The solution you built and the tools used<br><strong>Minute 3:</strong> Live demo<br><strong>Minute 4:</strong> Results — time saved, business value<br><strong>Minute 5:</strong> What\'s next — job target + cert plan' },
      { action: 'Run a full dry-run — time yourself to exactly 5 minutes', detail: 'Present out loud to yourself or a partner. Hard stop at 5 minutes during Demo Day — practice this constraint.' },
      { action: 'Complete the program evaluation form in LMS', detail: 'Required for certificate. Covers: program quality, instructor effectiveness, learning outcomes, job-readiness confidence (1–10).' },
      { action: 'Write your 90-day post-graduation plan', detail: '5 bullet points: Which cert to pursue, which job titles to apply for, networking targets, timeline milestones, and your personal AI learning goals.', featured: true, tip: '🎓 You built something real. You earned 3 certificates. You have a portfolio, a prompt library, an automation, and tailored resumes. That\'s the program.' },
    ]
  },

  // ── AWS Cloud Architect Engineer — Lab Data ─────────────
  // Week 1 — Architecture & Design
  aws_w1l1: {
    overview: 'You are a Cloud Engineer at ZICT assigned to Best Music Entertainment (BME), an event ticketing platform serving 100,000+ concurrent peak users. Before a single AWS service is chosen, your job is to understand what BME actually needs across all 9 cloud domains. This document becomes the source of truth for every decision you make over the next 6 weeks.',
    deliverable: 'Google Doc titled "BME Cloud Discovery — [Your Name]" with all 9 sections completed and shared with your instructor. File: AWS_LAB1_YourName_W1',
    steps: [
      { action: 'Open a new Google Doc — title it "BME Cloud Discovery — [Your Name]"', detail: 'Create 9 sections with these headings: Geographic Location, IAM & Access, Compute, Security, Storage, Networking, Database, Monitoring & Logging, Cost Management.' },
      { action: 'Section 1 — Geographic Location', detail: 'BME requirement: Denver-based company, US audience, needs low latency. Record: Primary region = us-east-1. Note why multi-AZ matters for an events platform with ticket-sale spikes.', featured: true },
      { action: 'Sections 2–4: IAM, Compute, Security', detail: '<strong>IAM:</strong> Who needs access? Devs, ops, read-only? List 3 user types and what permissions each needs.<br><strong>Compute:</strong> BME expects 100K concurrent users at peak. What instance type family handles variable load?<br><strong>Security:</strong> Ticketing = payment data. List 3 security requirements (encryption, WAF, MFA).' },
      { action: 'Sections 5–7: Storage, Networking, Database', detail: '<strong>Storage:</strong> BME stores event images, PDFs, and backups. Identify file sizes and frequency of access.<br><strong>Networking:</strong> Does BME need a private subnet? Why? What separates public web tier from private DB tier?<br><strong>Database:</strong> Ticket data is relational. What availability requirement exists for checkout during a concert sell-out?' },
      { action: 'Sections 8–9: Monitoring and Cost', detail: '<strong>Monitoring:</strong> When the site goes down during a ticket drop, how does BME know? List 3 alert scenarios.<br><strong>Cost:</strong> BME is a startup. Identify 2 ways to right-size cost (reserved instances, auto-scaling off-peak).' },
      { action: 'Review with a partner — read each other\'s discovery docs', detail: 'Compare your notes. Are there requirements the other person captured that you missed? Add any gaps.', tip: 'This document becomes the source of truth for every AWS service decision in the next 5 weeks. Be thorough.' },
    ]
  },
  aws_w1l2: {
    overview: 'With BME\'s requirements documented, you now select one specific AWS service for each of the 9 domains and justify every choice with a business reason, not just a technical one.',
    deliverable: 'Google Doc with a 9-row table: Domain | AWS Service | Business Justification. File: AWS_LAB2_YourName_W1',
    steps: [
      { action: 'Create a table in your Google Doc: 3 columns — Domain, AWS Service Chosen, Business Justification', detail: 'Rows: Geographic, IAM, Compute, Security, Storage, Networking, Database, Monitoring, Cost. Each cell must have a real entry.' },
      { action: 'Fill in Geographic & IAM', detail: '<strong>Geographic:</strong> Primary: us-east-1, Secondary: us-west-2. Justification: US-east covers East Coast latency for BME\'s primary market; west-2 is DR.<br><strong>IAM:</strong> AWS IAM with MFA enforced. Justification: Least-privilege access prevents insider threat on payment-adjacent systems.' },
      { action: 'Fill in Compute, Security, Storage', detail: '<strong>Compute:</strong> EC2 with Auto Scaling Group (t3.medium for dev). Justification: Scales horizontally during ticket drops without manual intervention.<br><strong>Security:</strong> AWS WAF + Security Groups + KMS. Justification: WAF blocks SQLi/XSS at the edge; KMS encrypts customer data at rest.<br><strong>Storage:</strong> Amazon S3 (Standard + Intelligent-Tiering). Justification: S3 Standard for active assets; Intelligent-Tiering moves old event PDFs to cheaper storage automatically.' },
      { action: 'Fill in Networking, Database, Monitoring, Cost', detail: '<strong>Networking:</strong> VPC with public/private subnets + ALB + NAT Gateway. Justification: Public subnet for ALB only; EC2 and RDS in private subnets — never directly reachable from internet.<br><strong>Database:</strong> Amazon RDS MySQL Multi-AZ. Justification: Automatic failover in under 2 minutes; critical for maintaining checkout during the primary DB failure.<br><strong>Monitoring:</strong> CloudWatch + CloudTrail + SNS. Justification: CloudWatch triggers SNS alerts in <1 min; CloudTrail gives audit trail for compliance.<br><strong>Cost:</strong> AWS Budgets + Cost Explorer. Justification: Alerts at 80% of monthly budget to prevent surprise bills during low-traffic months.' },
      { action: 'Write a 1-paragraph executive summary at the top of the doc', detail: 'Explain to a non-technical BME executive what infrastructure you\'ve recommended and why it protects their business. No jargon.', featured: true, tip: 'The business justification column is what gets you hired. Any engineer can name a service — not everyone can explain why.' },
    ]
  },
  aws_w1l3: {
    overview: 'Architecture diagrams are how cloud engineers communicate. Today you build the BME Development environment diagram in Lucidchart using official AWS architecture icons.',
    deliverable: 'Lucidchart shareable link showing the full Dev environment with all services labeled and connections drawn. File: AWS_LAB3_YourName_W1 (paste link in submission)',
    steps: [
      { action: 'Sign up for Lucidchart (free) at lucidchart.com', detail: 'Use your Google account for single sign-on. The free plan supports up to 3 active diagrams.' },
      { action: 'Import the AWS Shape Library', detail: 'Click "+" → Shapes → Search "AWS" → enable the AWS shape library. You should see 200+ official AWS icons organized by category.' },
      { action: 'Build the outer boundary: AWS Account → Region → VPC', detail: 'Draw a large rectangle labeled "AWS Account". Inside: a region rectangle labeled "us-east-1 (Dev)". Inside that: a VPC rectangle labeled "VPC 10.0.0.0/16".' },
      { action: 'Add subnets and core services', detail: 'Inside VPC: draw 2 subnets side by side.<br><strong>Public Subnet (10.0.1.0/24):</strong> Add Internet Gateway at the top, ALB icon inside the subnet.<br><strong>Private Subnet (10.0.2.0/24):</strong> Add EC2 instance icon, then RDS icon below it. Add NAT Gateway in the public subnet with an arrow to the private subnet.', featured: true },
      { action: 'Add supporting services outside the VPC', detail: 'Add S3 bucket icon to the right of the VPC with a dotted line to EC2 (app reads/writes to S3). Add CloudWatch icon at the bottom with arrows from EC2 and RDS (monitoring). Add IAM icon at the top (applies to all services).' },
      { action: 'Label every connection and add a legend', detail: 'Every arrow needs a label: "HTTPS 443", "MySQL 3306", "SSH 22 (restricted)", "S3 API". Add a legend box with color coding: blue = network, orange = compute, green = data.', tip: 'Unlabeled arrows are the #1 feedback on architecture diagrams. Every line must explain what traffic flows over it.' },
    ]
  },
  aws_w1l4: {
    overview: 'The architecture document is the formal technical brief you hand to a client. It translates your diagram into words — covering every layer of the stack and the decisions behind each one.',
    deliverable: 'Google Doc with all 5 sections complete (600–800 words total). File: AWS_LAB4_APPLIED_YourName_W1',
    steps: [
      { action: 'Create the doc: "BME Cloud Architecture Brief — Dev Environment — [Your Name]"', detail: 'Include today\'s date and "Prepared for: Best Music Entertainment | By: ZICT Engineering".' },
      { action: 'Section 1 — Network Layer', detail: 'Describe the VPC CIDR, subnet strategy (public vs. private and why), Internet Gateway, NAT Gateway, and route tables. Explain: "External traffic hits the ALB in the public subnet. EC2 instances in the private subnet can reach the internet via NAT Gateway for updates, but are not directly reachable from outside."' },
      { action: 'Section 2 — Compute Layer', detail: 'Document EC2 instance type (t3.micro for dev), AMI, security group rules (port 80/443 open from ALB only; port 22 restricted to your IP). Explain the Auto Scaling Group configuration even if not yet built.', featured: true },
      { action: 'Section 3 — Data Layer', detail: 'Document RDS MySQL instance size, Multi-AZ reasoning (even in dev, practice the pattern), storage size, backup retention (7 days), encryption at rest (KMS), and subnet group (private subnets only).' },
      { action: 'Section 4 — Security Layer', detail: 'List every security control: Security Groups (stateful firewall), NACLs (optional stateless), IAM roles (EC2 instance role for S3/CloudWatch access), KMS keys, and future WAF plan.' },
      { action: 'Section 5 — Monitoring Layer + Executive Sign-Off', detail: 'CloudWatch metrics (CPUUtilization, DatabaseConnections), SNS topic for alerts, CloudTrail enabled. Close with a sign-off paragraph: "This architecture provides a cost-effective, secure, and scalable foundation for BME\'s development environment. All services are sized for learning while maintaining production-equivalent patterns."', tip: 'This document is your capstone portfolio artifact. Write it like you\'re billing the client.' },
    ]
  },
  // Week 2 — Infrastructure Build
  aws_w2l1: {
    overview: 'With the Dev environment running, you now expand the architecture documentation to explicitly link each AWS service to its business impact. This extended document forms the second layer of your client-ready portfolio.',
    deliverable: 'Google Doc extending your Week 1 architecture brief. Add a "Business Impact" column to each section explaining performance, scalability, and security outcomes. File: AWS_LAB1_YourName_W2',
    steps: [
      { action: 'Open your Week 1 Architecture Doc and add a new section: "Extended Technical Justification"', detail: 'For each of the 9 domains, add a second paragraph that answers: "How does this choice directly affect BME\'s ability to sell tickets to 100,000+ concurrent users?"' },
      { action: 'Performance mapping', detail: 'Map each service to a performance outcome:<br>• ALB → distributes load, no single point of failure during peak sales<br>• Auto Scaling → adds EC2 instances within 60–90 seconds when CPU > 70%<br>• CloudFront → serves static assets (images, JS) from edge caches, reducing EC2 load by 40–70%<br>• RDS Multi-AZ → automatic failover in <2 minutes, maintains checkout during DB failure', featured: true },
      { action: 'Scalability mapping', detail: 'Map each service to a scalability outcome:<br>• Auto Scaling Group: handles sudden 10x traffic spikes with zero manual intervention<br>• S3: unlimited storage for event assets — no provisioning needed<br>• RDS Read Replicas (future): offload reporting queries from the primary DB<br>• ElastiCache (future): cache ticket availability data, reducing DB queries by 80%' },
      { action: 'Security mapping', detail: 'Map each service to a security control:<br>• VPC private subnets: EC2 and RDS never directly reachable from the internet<br>• Security Groups: port 80/443 open only at the ALB; port 22 restricted to known IPs<br>• KMS: encrypts RDS and S3 at rest — required for payment-adjacent data<br>• CloudTrail: every AWS API call logged for compliance audit<br>• WAF (planned): blocks SQLi and XSS at the network edge before requests reach EC2' },
      { action: 'Write a 1-paragraph executive summary at the top', detail: 'Address it to the BME CEO. Use no jargon. Explain in plain language what the infrastructure does, why it will handle their ticket sale peaks, and what protects their customer data.', tip: 'Executives approve budgets. If they can\'t understand your document, the project doesn\'t get funded.' },
    ]
  },
  aws_w2l2: {
    overview: 'Today you package everything produced in Week 1 and Lab W2-1 into a single, professional client-ready technical deliverable. This is the document you present to BME before building UAT.',
    deliverable: 'A single Google Doc combining: discovery notes, service recommendations table, Lucidchart diagram link, architecture brief, and extended justification — all in one shareable document. File: AWS_LAB2_YourName_W2',
    steps: [
      { action: 'Create a new master Google Doc: "BME Cloud Infrastructure Proposal — [Your Name] — [Date]"', detail: 'This document will be shared with your instructor and will serve as the capstone documentation artifact for Weeks 1–2.' },
      { action: 'Section 1 — Executive Summary (1 page)', detail: 'Write a 3-paragraph summary: (1) BME\'s business challenge and why cloud is the right solution; (2) the recommended architecture and key services; (3) the expected outcomes — uptime, scalability, security compliance, and estimated monthly cost range.' },
      { action: 'Section 2 — Service Recommendations Table', detail: 'Copy and clean your Day 2 recommendations table. Add a third column: "Estimated Monthly Cost" using AWS Pricing Calculator estimates for each service. This shows BME you\'ve thought about budget.', featured: true },
      { action: 'Section 3 — Architecture Diagram', detail: 'Embed your Lucidchart diagram (File → Embed → copy HTML). Or paste the shareable link with a screenshot. Label the diagram "Figure 1: BME Development Environment Architecture — [Date]".' },
      { action: 'Section 4 — Technical Layer Documentation', detail: 'Paste your cleaned architecture brief (5 sections: Network, Compute, Data, Security, Monitoring). Edit it for grammar and professionalism — imagine a senior architect will review this before it goes to the client.' },
      { action: 'Section 5 — Next Steps & Risk Register', detail: 'List 3 next steps with owners and dates: e.g. "Begin VPC build — ZICT Engineering — Week 2". Add a simple risk register: 2 risks, 2 mitigations. Example risk: "RDS Multi-AZ doubles cost in dev" → mitigation: "Use single-AZ in dev, enforce Multi-AZ from UAT onward."', tip: 'A risk register shows a client you have thought beyond "best case." This is what separates a junior engineer from a senior one.' },
    ]
  },
  aws_w2l3: {
    overview: 'Today you stop designing and start building. You will provision a complete VPC with public and private subnets, launch an EC2 instance with Apache, connect via EC2 Instance Connect, and create a Launch Template and Auto Scaling Group — giving BME a scalable, self-healing web tier.',
    deliverable: 'Screenshots of: VPC + subnets in console, EC2 running with Apache HTML page visible in browser, Launch Template created, Auto Scaling Group with min=2 max=4. File: AWS_LAB3_YourName_W2',
    steps: [
      { action: 'Create the VPC with public and private subnets', detail: 'VPC Dashboard → Create VPC → "VPC and more" (wizard).<br>Name: BME-Dev-VPC, CIDR: 10.0.0.0/16.<br>AZs: 2 (us-east-1a, us-east-1b).<br>Public subnets: 2 (10.0.1.0/24 and 10.0.2.0/24).<br>Private subnets: 2 (10.0.3.0/24 and 10.0.4.0/24).<br>NAT gateways: 0 (for dev cost savings — add in UAT).<br>Internet Gateway: 1.<br>Click Create VPC — the wizard creates all route tables and associations automatically.', featured: true },
      { action: 'Verify the route table setup', detail: 'VPC → Route Tables. You should see 2 route tables: one with 0.0.0.0/0 → Internet Gateway (public), one without (private). Click each and confirm the subnet associations are correct. The public subnet route table must include the IGW route or your EC2 will not have internet access.' },
      { action: 'Create a Security Group for EC2', detail: 'VPC → Security Groups → Create. Name: BME-Web-SG. VPC: BME-Dev-VPC.<br>Inbound rules:<br>• HTTP port 80 → Source: 0.0.0.0/0 (allows web traffic)<br>• HTTPS port 443 → Source: 0.0.0.0/0<br>• SSH port 22 → Source: Your IP only (not 0.0.0.0/0 — this is a security requirement)<br>Outbound: leave default (all traffic allowed).' },
      { action: 'Launch EC2 instance with Apache via User Data', detail: 'EC2 → Launch Instance.<br>Name: BME-Web-Dev-1. AMI: Amazon Linux 2023. Type: t3.micro (free tier eligible).<br>Key pair: create or select existing (you need this for SSH).<br>Network: BME-Dev-VPC. Subnet: BME-Public-1a. Auto-assign public IP: Enable.<br>Security Group: BME-Web-SG.<br>Under "Advanced details → User data" paste this script exactly:<br><code>#!/bin/bash<br>yum update -y<br>yum install -y httpd<br>systemctl start httpd<br>systemctl enable httpd<br>cd /var/www/html<br>echo "&lt;!DOCTYPE html&gt;&lt;html&gt;&lt;head&gt;&lt;title&gt;BME Services&lt;/title&gt;&lt;/head&gt;&lt;body style=\'text-align:center;padding-top:40px;background:#0C0F14;color:white\'&gt;&lt;h1&gt;Welcome to BME Services!&lt;/h1&gt;&lt;p&gt;Server: $(hostname -f)&lt;/p&gt;&lt;/body&gt;&lt;/html&gt;" &gt; index.html</code><br>Launch the instance.', warn: 'The User Data script runs once at first boot. If Apache still isn\'t running after 3 minutes, connect via EC2 Instance Connect and run the commands manually.' },
      { action: 'Verify Apache via browser', detail: 'EC2 → Instances → wait for "Running" status and 2/2 checks passed.<br>Copy the Public IPv4 address → open in browser: http://[PUBLIC-IP]<br>You should see the BME Services page.<br>Take a screenshot of: (1) the EC2 console showing the running instance, (2) the browser showing your HTML page.', featured: true },
      { action: 'Connect via EC2 Instance Connect and verify', detail: 'EC2 → Instances → select your instance → Connect → EC2 Instance Connect → Connect.<br>In the terminal run:<br><code>sudo systemctl status httpd</code> — should show "active (running)"<br><code>cat /var/www/html/index.html</code> — should show your HTML.<br>This confirms Apache is running and serving your page correctly.' },
      { action: 'Create a Launch Template from your running instance', detail: 'EC2 → Instances → right-click your BME-Web-Dev-1 → "Create template from instance".<br>Name: BME-Launch-Template. Description: "BME web server with Apache".<br>Ensure the User Data script is included (it should auto-populate).<br>Click Create launch template. Screenshot the confirmation page.', tip: 'A Launch Template captures the full configuration of a running instance — AMI, instance type, security group, user data — so Auto Scaling can replicate it exactly.' },
      { action: 'Create an Auto Scaling Group', detail: 'EC2 → Auto Scaling Groups → Create.<br>Name: BME-ASG-Dev. Launch template: BME-Launch-Template.<br>VPC: BME-Dev-VPC. Subnets: select BOTH public subnets (1a and 1b) for high availability.<br>Group size: Desired: 2, Minimum: 2, Maximum: 4.<br>No scaling policy needed for this lab — just verify the ASG launches 2 instances automatically.<br>Click Create.<br>Go to EC2 → Instances and confirm you see 2 instances launching from the template.', tip: 'With 2 instances in 2 AZs, if one AZ has an outage BME\'s site stays up. This is the core of high availability.' },
    ]
  },
  aws_w2l4: {
    overview: 'This is the full high-availability build: two EC2 instances running Apache across two Availability Zones, fronted by an HTTPS Application Load Balancer with a self-signed SSL certificate imported into ACM and HTTP-to-HTTPS auto-redirect. This is the architecture pattern used by production web applications.',
    deliverable: 'Screenshots saved in folder "Day8-Assessment": EC2_Instance, ACM_Certificate, Target_Group, ALB_Listeners, Redirect_Rule, ALB_DNS. File: AWS_LAB4_APPLIED_YourName_W2',
    steps: [
      { action: 'Generate a free self-signed SSL certificate', detail: 'Run this command on your PC (Git Bash, Mac Terminal, or EC2 terminal):<br><code>openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout private.key -out certificate.crt -subj "/C=US/ST=Demo/L=Demo/O=BMEServices/CN=bme.demo.local"</code><br>This creates 2 files: <code>certificate.crt</code> (certificate body) and <code>private.key</code> (private key).<br>View contents with: <code>cat certificate.crt</code> and <code>cat private.key</code> — you will paste these into ACM next.', featured: true },
      { action: 'Import the certificate into AWS Certificate Manager (ACM)', detail: 'AWS Console → Certificate Manager → Import a certificate.<br>• Certificate body: paste the full contents of <code>certificate.crt</code> (including the BEGIN/END lines)<br>• Certificate private key: paste the full contents of <code>private.key</code> (including the BEGIN/END lines)<br>• Certificate chain: leave empty<br>Click Next → Import. The certificate status should show "Issued". Screenshot the ACM console.', tip: 'For production, request a public certificate through ACM using domain validation instead. Self-signed certs show a browser warning but are fine for learning.' },
      { action: 'Ensure two EC2 instances are running Apache in two different Availability Zones', detail: 'If you completed Lab W2-3, your Auto Scaling Group may already have 2 instances. Verify they are in different AZs (us-east-1a and us-east-1b).<br>If not: launch a second EC2 in BME-Public-1b (the second public subnet) using the same User Data Apache script from Lab W2-3.<br>Security Group for both: BME-Web-SG (port 80 open from 0.0.0.0/0).<br>Confirm both instances show "Running" and pass health checks.' },
      { action: 'Create a Target Group', detail: 'EC2 → Target Groups → Create target group.<br>Target type: Instances. Name: BME-TG. Protocol: HTTP. Port: 80. VPC: BME-Dev-VPC.<br>Health check path: /<br>Advanced health check settings: Healthy threshold: 2, Unhealthy threshold: 2, Timeout: 5s, Interval: 30s.<br>Next → Register Targets → select BOTH your EC2 instances → Include as pending → Create target group.<br>Screenshot the Target Group showing both instances registered.', featured: true },
      { action: 'Create the Application Load Balancer', detail: 'EC2 → Load Balancers → Create Load Balancer → Application Load Balancer.<br>Name: BME-ALB. Scheme: Internet-facing. IP type: IPv4.<br>Network mapping: select BOTH public subnets (us-east-1a and us-east-1b).<br>Security Group: create new "BME-ALB-SG" with inbound: HTTP 80 (0.0.0.0/0) and HTTPS 443 (0.0.0.0/0).<br>Listeners: Add HTTPS listener on port 443 → Action: Forward to BME-TG → SSL certificate: select your imported ACM cert.<br>Create load balancer. Copy the DNS name.' },
      { action: 'Set up HTTP → HTTPS redirect (301 Permanently Moved)', detail: 'After the ALB is created, go to: EC2 → Load Balancers → BME-ALB → Listeners tab.<br>Click "Add listener" → Protocol: HTTP, Port: 80.<br>Default action: Redirect to URL. Protocol: HTTPS. Port: 443. Status code: 301 - Permanently moved.<br>Save.<br>Now any HTTP request to the ALB automatically redirects to HTTPS. Screenshot the Listeners tab showing both HTTP:80 (redirect) and HTTPS:443 (forward to target).', warn: 'You cannot redirect from HTTPS to HTTPS — that creates a loop. The redirect must go from HTTP:80 to HTTPS:443 only.' },
      { action: 'Test the full setup', detail: 'Copy your ALB DNS name (format: BME-ALB-xxxxx.us-east-1.elb.amazonaws.com).<br>• Test HTTP redirect: paste <code>http://[ALB-DNS]</code> in browser → should automatically redirect to HTTPS (padlock shows "Not secure" warning for self-signed cert — click "Advanced → Proceed").<br>• Test HTTPS: paste <code>https://[ALB-DNS]</code> → should load your BME Services Apache page.<br>• Reload several times — you may see different hostnames, confirming the ALB is distributing traffic between your two EC2 instances.' },
      { action: 'Save screenshots and clean up', detail: 'Create a folder "Day8-Assessment" and save screenshots named: EC2_Instance, ACM_Certificate, Target_Group, ALB_Listeners, Redirect_Rule, ALB_DNS.<br>After saving all screenshots, clean up to avoid charges:<br>1. Delete the Load Balancer<br>2. Delete the Target Group<br>3. Delete the ACM Certificate (imported certs can be deleted without issue)<br>4. Stop (or terminate) EC2 instances<br>5. Delete any EBS volumes not auto-deleted', tip: 'Always clean up in this order: Load Balancer first (it references the target group), then target group, then EC2. Reversing the order may fail.' },
    ]
  },
  // Week 3 — AWS Services & Terraform
  aws_w3l1: {
    overview: 'This is the most comprehensive hands-on day of the program. You are configuring the full supporting services stack for BME: S3 for storage, RDS for the database, IAM roles for secure access, NAT Gateway for private subnet internet, CloudTrail for audit logging, SNS+CloudWatch for alerting, CloudFront for content delivery, and a full ALB setup. Complete each part and capture screenshots as evidence.',
    deliverable: 'Screenshots of all 10 parts organised in a Google Drive folder "Day9-Assessment". File: AWS_LAB1_YourName_W3',
    steps: [
      { action: 'Part 1 — Create S3 Bucket with versioning and test access', detail: 'S3 → Create bucket. Name: bme-assets-[yourname] (globally unique). Region: us-east-1. Uncheck "Block all public access" if you need to test public file access. Enable Versioning under Advanced Settings.<br>Upload a test image or PDF file. Copy the Object URL and open in browser to verify access.<br>Versioning test: modify the file slightly and re-upload with the same name. In S3 → Objects → check "Show versions" — you should see 2 versions.', featured: true },
      { action: 'Part 2 — Launch RDS Aurora MySQL in a private subnet', detail: 'Create a DB Subnet Group first: RDS → Subnet groups → Create → select both PRIVATE subnets in BME-Dev-VPC.<br>RDS → Create database → Standard → Amazon Aurora MySQL-compatible.<br>Template: Dev/Test. DB instance: db.t3.micro. Multi-AZ: Yes (standby in second AZ). VPC: BME-Dev-VPC. Subnet group: your new private subnet group. Public accessibility: No.<br>Security Group: allow MySQL TCP 3306 inbound from BME-Web-SG only.<br>Verify connectivity: SSH into your EC2 → install MySQL client → run: <code>mysql -h [Aurora-endpoint] -u admin -p</code> → type SHOW DATABASES;' },
      { action: 'Part 3 — Create IAM Role for EC2 → RDS access', detail: 'IAM → Roles → Create role → AWS Service → EC2 → Next.<br>Attach policies: <code>AmazonRDSFullAccess</code>, <code>AmazonS3ReadOnlyAccess</code>, <code>CloudWatchAgentServerPolicy</code>.<br>Name: BME-EC2-InstanceRole.<br>Attach to EC2: EC2 → select your instance → Actions → Security → Modify IAM role → select BME-EC2-InstanceRole → Update IAM role.<br>Test: SSH into EC2 and run <code>aws s3 ls</code> — it should list your S3 buckets WITHOUT needing to provide credentials. That is the power of IAM roles.' },
      { action: 'Part 4 — Configure NAT Gateway so private EC2s can reach the internet', detail: 'NAT Gateway lives in the PUBLIC subnet but serves the PRIVATE subnet. VPC → NAT Gateways → Create NAT Gateway.<br>Subnet: BME-Public-1a. Connectivity: Public. Allocate Elastic IP.<br>Update private route table: VPC → Route Tables → select the route table for the PRIVATE subnets → Routes → Edit → Add: Destination 0.0.0.0/0, Target: your NAT Gateway → Save.<br>Test: launch a small EC2 in the private subnet → SSH in via the bastion → run <code>curl https://example.com</code> → you should get HTML back, confirming the NAT Gateway is working.', warn: 'NAT Gateway costs ~$0.045/hour + data transfer. Delete it after the lab unless continuing to UAT build.' },
      { action: 'Part 5 — Enable CloudTrail with SNS notifications', detail: 'CloudTrail → Trails → Create trail. Name: bme-audit-trail. S3 bucket: create new "bme-cloudtrail-logs-[yourname]". Enable for all regions. Under SNS: select "Create new SNS topic" → name: CloudTrail-Event-Alerts.<br>SNS → Topics → find your topic → Create subscription → Protocol: Email → enter your email → Create subscription. Check your inbox and confirm the subscription link.<br>Trigger a test event: in your EC2 terminal run: <code>aws s3 mb s3://test-cloudtrail-[yourname]</code><br>Wait 5–10 minutes → check your email for a CloudTrail notification. Screenshot the SNS email received.', featured: true },
      { action: 'Part 6 — Create CloudWatch Alarm for EC2 CPU with SNS alert', detail: 'CloudWatch → Alarms → Create Alarm → Select metric → EC2 → Per-Instance Metrics → select your instance → CPUUtilization → Select metric.<br>Condition: Greater than 80% for 1 data point in 5 minutes.<br>Notification: Create new SNS topic "EC2-High-CPU-Alert" → enter your email → Create topic.<br>Confirm the subscription email again.<br>Simulate high CPU: SSH into EC2 → run: <code>yes > /dev/null &</code> (run this command 3–4 times to spike CPU).<br>Watch CloudWatch → after 5 min you should receive an email alert. To stop load: <code>killall yes</code>', tip: 'This is how BME gets notified BEFORE their site crashes. Set the alarm at 70–80%, not 100%.' },
      { action: 'Part 7 — Create CloudFront distribution for S3 assets', detail: 'CloudFront → Create distribution.<br>Origin domain: your S3 bucket (select from dropdown). For S3, configure OAC (Origin Access Control): click "Create new OAC" → Create. Then update your S3 bucket policy when prompted.<br>Viewer protocol policy: Redirect HTTP to HTTPS.<br>Cache policy: CachingOptimized (default).<br>Create distribution. Wait 3–5 min for Deployed status.<br>Copy the CloudFront domain name (format: d1234example.cloudfront.net) → open in browser → test that your S3 file loads via HTTPS through CloudFront.' },
      { action: 'Part 8 — Full ALB + Target Group setup (review from Day 8)', detail: 'If you completed the ALB in Lab W2-4 (Day 8), verify it is still working and add your RDS private EC2 as a second check: EC2 → Target Groups → health status → both instances should show "Healthy".<br>If you need to rebuild: follow the ALB steps from Lab W2-4 exactly.<br>Test HTTP → HTTPS redirect: open <code>http://[ALB-DNS]</code> in browser — it should auto-redirect to HTTPS.' },
      { action: 'Part 9 — Add NAT Gateway route to private subnet (verify)', detail: 'This verifies Part 4 by testing full connectivity from a private EC2:<br>1. SSH into your public bastion EC2<br>2. Upload your key.pem to the bastion: <code>scp -i key.pem key.pem ec2-user@[BASTION-IP]:~/</code><br>3. SSH from bastion to private EC2: <code>ssh -i key.pem ec2-user@[PRIVATE-IP]</code><br>4. Test internet: <code>curl https://example.com</code><br>If you see HTML output, your NAT Gateway and route table are configured correctly. Screenshot the terminal output.' },
      { action: 'Part 10 — Document everything and clean up', detail: 'Document each service in your "Day9-Assessment" Google Drive folder. Include: S3 bucket screenshot, RDS status screenshot, IAM role attachment, CloudTrail trail status, SNS notification email received, CloudWatch alarm in ALARM state, CloudFront distribution deployed, ALB healthy targets, NAT Gateway active.<br>Clean up to avoid charges: delete ALB, delete Target Group, stop EC2 instances, delete NAT Gateway (costs ~$1.08/day if left running), delete RDS instance, delete S3 objects then buckets.', warn: 'Always delete the NAT Gateway before the end of the session — it charges ~$0.045/hour even when idle.' },
    ]
  },
  aws_w3l2: {
    overview: 'Day 10 has two parts. Part 1: you write the UAT-specific technical recommendations — same 9 domains as Day 2, but now the answers reflect UAT\'s higher bar (multi-AZ, performance testing, realistic traffic simulation). Part 2: you create your first Terraform resource — a simple EC2 instance — which proves your IaC foundation is working before you build the full three-tier stack.',
    deliverable: 'Google Doc with UAT recommendations table + screenshot of `terraform apply` success creating EC2 + screenshot of EC2 running in console. File: AWS_LAB2_YourName_W3',
    steps: [
      { action: 'Create the UAT Technical Recommendations document', detail: 'Open a new Google Doc: "BME UAT Technical Recommendations — [Your Name]".<br>Create a table with 3 columns: Domain | AWS Service | Business Justification.<br>Fill in all 9 rows following this order:<br>1. Geographic Location & AZs<br>2. Identity and Access Management (IAM)<br>3. Compute<br>4. Security<br>5. Storage<br>6. Networking<br>7. Database<br>8. Monitoring & Compliance<br>9. Cost<br>For UAT, the answers should be more rigorous than Dev (Multi-AZ required, realistic instance sizes, WAF enabled).', featured: true },
      { action: 'UAT recommendations — key differences from Dev', detail: 'Compared to your Dev recommendations, UAT should upgrade:<br>• Compute: t3.micro → t3.small (handles more realistic traffic load testing)<br>• Database: db.t3.micro Single-AZ → db.t3.small Multi-AZ (validates failover before Prod)<br>• Security: add WAF rules to test against common attack patterns<br>• Networking: add NAT Gateway (UAT needs private EC2s to pull updates)<br>• Monitoring: enable detailed CloudWatch monitoring (1-minute intervals vs 5-minute)<br>Write a 1-sentence justification for each upgrade choice.' },
      { action: 'Create a UAT Architecture Diagram in Lucidchart', detail: 'Open your Dev diagram and "Save As" a new file: "BME UAT Architecture".<br>Update the VPC CIDR to 10.1.0.0/16 (UAT environment).<br>Add: NAT Gateway in the public subnet, second RDS instance (Multi-AZ standby shown), WAF in front of the ALB.<br>Export as PNG and add to your Google Doc under the recommendations table.' },
      { action: 'Install and verify Terraform', detail: 'Download Terraform: terraform.io/downloads → select your OS → install.<br>Verify installation: open terminal → <code>terraform --version</code><br>You should see: Terraform v1.x.x on [your OS].<br>Also verify AWS CLI: <code>aws --version</code> and <code>aws configure</code> (enter your Access Key, Secret, region: us-east-1, output: json).<br>Test AWS CLI access: <code>aws sts get-caller-identity</code> — you should see your Account ID.', warn: 'Never paste your AWS Access Key ID and Secret into a file that you might commit to GitHub. Use environment variables or the ~/.aws/credentials file only.' },
      { action: 'Create a simple EC2 with Terraform', detail: 'Create a new folder: <code>bme-terraform-intro/</code><br>Inside, create <code>main.tf</code>:<br><code>provider "aws" {<br>  region = "us-east-1"<br>}<br>resource "aws_instance" "bme_test" {<br>  ami           = "ami-0c02fb55956c7d316"  # Amazon Linux 2023 us-east-1<br>  instance_type = "t3.micro"<br>  tags = {<br>    Name = "BME-Terraform-Test"<br>  }<br>}</code><br>Run: <code>terraform init</code> → initializes providers.<br>Run: <code>terraform plan</code> → shows what will be created (1 EC2 instance).<br>Run: <code>terraform apply</code> → type "yes" when prompted.', featured: true },
      { action: 'Verify in AWS Console and destroy', detail: 'Go to EC2 Console → you should see "BME-Terraform-Test" in Running state. Screenshot this.<br>Back in terminal run: <code>terraform destroy</code> → type "yes". The instance will be terminated.<br>Verify in EC2 Console → instance should show "Terminated".<br>This is Infrastructure as Code: provision in 30 seconds, destroy in 30 seconds, no manual clicking.', tip: 'The AMI ID "ami-0c02fb55956c7d316" is Amazon Linux 2023 for us-east-1. If you get an AMI error, find the correct ID in EC2 → Launch Instance → browse AMIs → copy the AMI ID for your region.' },
    ]
  },
  aws_w4l2: {
    overview: 'Day 14 is about proving your CI/CD pipeline works end-to-end by writing the documentation and performing the full deploy-and-destroy cycle. You will fork the class repository, configure your own backend, deploy all three environments, capture screenshots, and submit the evidence.',
    deliverable: 'GitHub repository link + Google Drive folder with 4 screenshot categories: deployment logs (Dev/UAT/Prod), running EC2 instances, successful destroy logs, terminated instances. File: AWS_LAB2_YourName_W4',
    steps: [
      { action: 'Fork and set up your personal repository', detail: 'Go to github.com/zicttraining/bme-allinone- → click Fork → fork to your GitHub account.<br>Clone it locally: <code>git clone [your-fork-url]</code><br>Checkout the develop branch: <code>git checkout develop</code><br>Explore the folder structure: Dev/ UAT/ Prod/ — each has its own Terraform files and backend configuration.', featured: true },
      { action: 'Create your unique backend resources in AWS', detail: 'You need unique S3 bucket names and DynamoDB table names (global uniqueness for S3).<br><strong>S3 Buckets</strong> (AWS Console → S3 → Create bucket):<br>• bme-dev-state-[yourname] (Region: us-west-2, Versioning: ON, Block public access: ON)<br>• bme-uat-state-[yourname]<br>• bme-prod-state-[yourname]<br><strong>DynamoDB Tables</strong> (Console → DynamoDB → Create table):<br>• bme-dev-lock-[yourname] (Partition key: LockID, type: String)<br>• bme-uat-lock-[yourname]<br>• bme-prod-lock-[yourname]<br>Verify all show Status = ACTIVE.' },
      { action: 'Update backend.tf for each environment with your unique resource names', detail: 'In your cloned repo, update Dev/backend.tf:<br><code>terraform {<br>  backend "s3" {<br>    bucket         = "bme-dev-state-[yourname]"<br>    key            = "dev/terraform.tfstate"<br>    region         = "us-west-2"<br>    dynamodb_table = "bme-dev-lock-[yourname]"<br>    encrypt        = true<br>  }<br>}</code><br>Repeat for UAT/backend.tf and Prod/backend.tf with their respective bucket/table names.<br>Commit the changes: <code>git add . && git commit -m "Add personal backend config"</code>' },
      { action: 'Deploy Dev, UAT, and Production via GitHub Actions', detail: 'Push to develop branch to trigger Dev deployment: <code>git push origin develop</code><br>Go to your GitHub repo → Actions tab → watch the "Terraform CI/CD" workflow run.<br>When Dev succeeds, push to uat branch: <code>git checkout -b uat && git push origin uat</code><br>For Production: GitHub → Actions → select the workflow → Run workflow → environment: production, destroy: false → Run.<br>For each deployment, screenshot: (1) the Actions tab showing the green checkmark, (2) the EC2 instances running in AWS Console.' },
      { action: 'Destroy all three environments', detail: 'To destroy, re-run the workflow with destroy: true.<br>GitHub → Actions → select the workflow → Run workflow.<br>Set: environment: dev, destroy: true → Run. Wait for success.<br>Repeat for uat and production.<br>Screenshot: (1) each destroy workflow showing green success, (2) EC2 console showing instances "Terminated".<br>Verify S3 and DynamoDB state files are deleted/empty.', warn: 'Always destroy environments after testing. Each running EC2 + NAT Gateway costs real money. Your instructor may check AWS billing.' },
      { action: 'Write the CI/CD Pipeline Documentation', detail: 'In your Google Doc, write a 1-page write-up covering:<br>1. <strong>Pipeline Architecture:</strong> Draw a simple flow — Git Push → GitHub Actions → OIDC auth → AWS STS → IAM Role → Terraform → AWS Resources.<br>2. <strong>Environment Promotion Strategy:</strong> Why Dev → UAT → Prod? What is tested at each stage before promoting?<br>3. <strong>Error Troubleshooting:</strong> List 2 common errors you encountered and how you fixed them (e.g., state lock conflict, backend bucket not found).<br>4. <strong>Security:</strong> Why OIDC is better than storing AWS access keys in GitHub Secrets.', featured: true, tip: 'This write-up is what a Tech Lead reviews before approving your pipeline in a real job. Make it clear enough that someone who wasn\'t in class can run it.' },
    ]
  },
  aws_w4l3: {
    overview: 'Weeks 1–4 covered the complete cloud architecture lifecycle: discovery → design → build → IaC → automation. Today you audit everything you have built, close any gaps, and organise your GitHub portfolio so it tells a coherent story to a hiring manager.',
    deliverable: 'Updated GitHub repo with all weeks\' work organised in folders + Google Doc "Portfolio Audit Checklist" with every item checked or flagged. File: AWS_LAB3_YourName_W4',
    steps: [
      { action: 'Run a self-audit against the full deliverables checklist', detail: 'Open a new Google Doc: "Weeks 1–4 Portfolio Audit — [Your Name]". Create a 3-column table: Item | Status (✅ Done / ⚠️ Needs work / ❌ Missing) | Action needed.<br>Items to audit:<br>• Week 1: Discovery doc, Recommendations table, Lucidchart diagram, Architecture brief<br>• Week 2: Extended docs, Client package, VPC build, ALB + HTTPS<br>• Week 3: All 10 services from Day 9, UAT recommendations, Terraform intro, Multi-env Terraform, Production deployment<br>• Week 4: GitHub Actions pipeline, Deploy/Destroy cycle completed' },
      { action: 'Organise your GitHub repository structure', detail: 'Your bme-infra GitHub repo should have this structure:<br><code>bme-infra/<br>  Week1-Architecture/<br>    discovery.pdf or link<br>    recommendations.pdf or link<br>    lucidchart-diagram.png<br>  Week2-Infrastructure/<br>    vpc-setup-screenshots/<br>    alb-https-screenshots/<br>  Week3-Services-Terraform/<br>    Day9-screenshots/<br>    environments/<br>      Dev/ UAT/ Prod/<br>  Week4-CICD/<br>    .github/workflows/deploy.yml<br>    pipeline-screenshots/<br>  README.md</code><br>If your repo is missing any folders, create them and add screenshots or links.', featured: true },
      { action: 'Write or improve your README.md', detail: 'Your README should have these sections:<br>1. Project Overview — what is BME, what does this repo deploy?<br>2. Architecture Diagram — embed or link your Lucidchart diagram<br>3. Environments — table of Dev/UAT/Prod with CIDR ranges and instance sizes<br>4. How to Deploy — step-by-step (terraform init, terraform plan, terraform apply)<br>5. How to Destroy — step-by-step<br>6. Technologies Used — list AWS services, Terraform, GitHub Actions<br>A good README is the difference between a portfolio and a folder of files.' },
      { action: 'Identify and close the top 2 gaps from your audit', detail: 'From your audit checklist, pick the 2 most important ❌ or ⚠️ items and fix them now. Common gaps students find:<br>• Missing screenshots from Day 9 services<br>• Terraform destroy was never tested<br>• Architecture diagram not updated to reflect what was actually built<br>• No README in the GitHub repo<br>Fix at least 2 gaps, commit, and push.' },
      { action: 'Peer review — exchange portfolios with a classmate', detail: 'Share your GitHub repo link with a classmate and review theirs. Give written feedback on 2 things they did well and 1 thing to improve. Record your classmate\'s feedback in your audit doc.<br>This simulates a pull request review, which is a daily reality in cloud engineering teams.', tip: 'The best engineers ask for code reviews. The habit of seeking and giving feedback is more valuable than any single technical skill.' },
    ]
  },
  aws_w4l4: {
    overview: 'Projects start next week and run for three weeks with minimal instructor guidance. Today you define your capstone scope, select the services you will deploy, plan your timeline, and get instructor sign-off before you start building.',
    deliverable: 'Google Doc "Capstone Project Plan — [Your Name]" approved and signed off by instructor before end of class. File: AWS_LAB4_APPLIED_YourName_W4',
    steps: [
      { action: 'Select your capstone client scenario', detail: 'You can use BME or choose a different client from this list:<br>• MrMike — e-commerce and digital services platform<br>• HealthFirst — healthcare patient portal (adds HIPAA compliance layer)<br>• EduStream — online education video platform (adds CloudFront + media workload)<br>• Your own business idea (must be approved by instructor)<br>Write a 1-paragraph "Client Brief" explaining what the company does and why they need AWS infrastructure.' },
      { action: 'Define the scope: what you will build in 3 weeks', detail: 'Your capstone must include ALL of these:<br>✅ Three-tier VPC (public ALB, private EC2, private RDS)<br>✅ All 3 environments deployed via Terraform (Dev, UAT, Prod)<br>✅ GitHub Actions CI/CD pipeline (OIDC, no keys in GitHub)<br>✅ S3, CloudTrail, CloudWatch, SNS configured<br>✅ Terraform state in S3 + DynamoDB locking<br>✅ Screenshots and documentation for every deployed resource<br>Optional advanced components (pick 1):<br>• Docker + ECR + ECS Fargate deployment<br>• Amazon EKS Kubernetes cluster<br>• AWS Lambda + API Gateway serverless function', featured: true },
      { action: 'Create a week-by-week project timeline', detail: 'In your Google Doc create a 3-week plan:<br><strong>Week 5 (Project Week 1):</strong><br>Mon: VPC + EC2 + RDS deployed for Dev via Terraform<br>Tue: S3, IAM, CloudTrail, SNS configured<br>Wed: UAT environment deployed<br>Thu: GitHub Actions pipeline working for Dev and UAT<br><strong>Week 6 (Project Week 2):</strong><br>Mon: Production environment deployed<br>Tue: Full destroy and redeploy test (proves automation)<br>Wed: Optional advanced component (ECS or EKS)<br>Thu: Documentation and README<br><strong>Week 7 (Capstone Week):</strong><br>Build presentation, polish portfolio, final demo prep' },
      { action: 'Identify risks and mitigations', detail: 'List 3 risks that could delay your project and how you will handle them:<br>Example risks:<br>• "Terraform state conflict if I run apply in two tabs" → mitigation: always run one `terraform apply` at a time, use DynamoDB locking<br>• "RDS takes 8–15 minutes to provision" → mitigation: start RDS first before other resources, use `terraform apply -target` to wait<br>• "GitHub Actions failing due to IAM permissions" → mitigation: test with `terraform plan` in a PR before merging to main<br>Having a risk plan means you don\'t panic when things break — and things will break.' },
      { action: 'Get instructor sign-off', detail: 'Show your instructor your completed plan. They will review:<br>1. Is the scope achievable in 3 weeks?<br>2. Are you using the right AWS services for your client scenario?<br>3. Do you have a clear first task for Monday?<br>Your instructor will sign off in your Google Doc or LMS submission. You cannot start the capstone without sign-off.<br>After approval: commit your project plan to your GitHub repo in a new file: <code>CAPSTONE_PLAN.md</code>', tip: '🚀 Projects start next week. Your sign-off plan becomes your contract. Stick to the timeline — instructors check progress every Thursday.' },
    ]
  },
  aws_w3l3: {
    overview: 'Infrastructure as Code means your entire AWS environment lives in version-controlled files — reproducible, reviewable, and deployable in minutes. Today you build the Terraform folder structure that will deploy Dev, UAT, and Production from a single codebase.',
    deliverable: 'GitHub repo link with folder structure visible: environments/dev/, environments/uat/, environments/prod/, modules/. S3 backend config working for dev state. File: AWS_LAB3_YourName_W3 (GitHub link)',
    steps: [
      { action: 'Install the required tools', detail: 'Install on your machine:<br>• <code>Terraform</code> — terraform.io/downloads (v1.6+)<br>• <code>AWS CLI</code> — run `aws configure` with your Access Key ID + Secret (from IAM → your user → Security credentials)<br>• <code>Git</code> + <code>GitHub Desktop</code> or VS Code with Git<br>• <code>VS Code</code> + HashiCorp Terraform extension', featured: true },
      { action: 'Create the folder structure', detail: 'In VS Code, create a new folder `bme-infra`. Inside create:<br><code>environments/<br>  dev/<br>    main.tf &nbsp;&nbsp;provider.tf &nbsp;&nbsp;variables.tf &nbsp;&nbsp;backend.tf<br>  uat/<br>    main.tf &nbsp;&nbsp;provider.tf &nbsp;&nbsp;variables.tf &nbsp;&nbsp;backend.tf<br>  prod/<br>    main.tf &nbsp;&nbsp;provider.tf &nbsp;&nbsp;variables.tf &nbsp;&nbsp;backend.tf<br>modules/<br>  vpc/ &nbsp;&nbsp;compute/ &nbsp;&nbsp;database/ &nbsp;&nbsp;security/</code>' },
      { action: 'Write provider.tf for dev', detail: 'In environments/dev/provider.tf:<br><code>terraform {<br>  required_providers {<br>    aws = { source = "hashicorp/aws", version = "~> 5.0" }<br>  }<br>}<br>provider "aws" { region = "us-east-1" }</code>' },
      { action: 'Configure S3 remote backend for dev state', detail: 'Create S3 bucket: bme-terraform-state-[yourname] (versioning ON, no public access). In environments/dev/backend.tf:<br><code>terraform {<br>  backend "s3" {<br>    bucket = "bme-terraform-state-[yourname]"<br>    key &nbsp;&nbsp;&nbsp;= "dev/terraform.tfstate"<br>    region = "us-east-1"<br>  }<br>}</code><br>Run: `terraform init` — you should see "Successfully configured the backend".' },
      { action: 'Write a simple VPC module and call it from dev', detail: 'In modules/vpc/main.tf, write a VPC resource with variables for cidr_block and name. In environments/dev/main.tf, call the module with dev-specific values (CIDR 10.0.0.0/16). Run `terraform plan` — you should see the VPC plan without errors.', tip: 'If `terraform plan` fails, check your AWS CLI credentials with `aws sts get-caller-identity` first.' },
      { action: 'Push to GitHub', detail: 'Create a new private GitHub repo `bme-infra`. Add a .gitignore with `.terraform/` and `*.tfstate`. Commit all files and push. Share the repo link in your submission.', warn: 'Never commit terraform.tfstate or .tfvars files containing secrets to GitHub.' },
    ]
  },
  aws_w3l4: {
    overview: 'Production-grade infrastructure means three environments deployed from the same Terraform code, with environment-specific variables. Today you deploy the full three-tier stack for Production.',
    deliverable: 'GitHub repo showing environments/prod/ with all .tf files. Screenshots of: `terraform apply` success output, VPC + subnets in console, RDS Multi-AZ running, EC2 instances via Auto Scaling. File: AWS_LAB4_APPLIED_YourName_W3',
    steps: [
      { action: 'Review environment variable differences', detail: 'The same Terraform modules run in all environments — only variables change. In a new Google Doc, create a table:<br>Variable | Dev | UAT | Prod<br>VPC CIDR | 10.0.0.0/16 | 10.1.0.0/16 | 10.2.0.0/16<br>EC2 type | t3.micro | t3.small | c5.large<br>RDS class | db.t3.micro | db.t3.small | db.r5.large<br>Min EC2 count | 1 | 1 | 3' },
      { action: 'Complete the production modules', detail: 'Ensure you have Terraform resources for: VPC + 2 public + 2 private subnets (Multi-AZ), IGW + NAT Gateway + route tables, Security Groups, EC2 Launch Template, Auto Scaling Group, ALB + Target Group, RDS Multi-AZ subnet group + instance, S3 bucket for assets.', featured: true },
      { action: 'Configure prod/variables.tf and prod/terraform.tfvars', detail: 'variables.tf declares: environment, vpc_cidr, ec2_instance_type, rds_instance_class, min_capacity, max_capacity, desired_capacity.<br>terraform.tfvars sets production values. Remember: .tfvars goes in .gitignore.' },
      { action: 'Run terraform plan and review every resource', detail: 'Run `terraform plan -var-file="terraform.tfvars"` from environments/prod/. Read the output carefully. Count expected resources. If the plan shows destroying existing infrastructure, stop and review — something is wrong with your state.', warn: 'Never run `terraform apply` in production without reading every line of `terraform plan` first.' },
      { action: 'Apply and capture evidence', detail: 'Run `terraform apply -var-file="terraform.tfvars"`. Terraform will prompt "Do you want to perform these actions?" — type `yes`. It takes 8–15 minutes for RDS Multi-AZ. Screenshot the green "Apply complete! Resources: X added" message.', tip: 'After the lab, run `terraform destroy` to avoid ongoing AWS charges unless your instructor tells you to keep it running.' },
    ]
  },
  aws_w4l1: {
    overview: 'Today you build a fully automated Terraform deployment pipeline using GitHub Actions with OIDC authentication — NO AWS access keys stored anywhere. OIDC (OpenID Connect) lets GitHub Actions assume an AWS IAM Role temporarily without long-lived credentials. This is the security-first approach used by professional DevOps teams.',
    deliverable: 'GitHub repo link showing the pipeline running. Screenshots of: OIDC provider in AWS IAM, GitHubActionsRole in IAM, Dev deployment green in Actions tab, Prod deployment via manual trigger. File: AWS_LAB1_YourName_W4',
    steps: [
      { action: 'Fork the class repository and clone it locally', detail: 'Go to: github.com/zicttraining/bme-allinone- → Fork to your account.<br>Clone: <code>git clone [your-fork-url]</code><br>Checkout develop branch: <code>git checkout develop</code><br>Explore the folder structure: Dev/ UAT/ Prod/ and .github/workflows/<br>All Terraform and backend configurations are already provided — you do NOT write Terraform from scratch today.', featured: true, warn: 'Do NOT create IAM users. Do NOT generate AWS access keys. Do NOT add AWS secrets in GitHub. All deployments MUST happen via GitHub Actions with OIDC.' },
      { action: 'Create the OIDC Identity Provider in AWS IAM', detail: 'AWS Console → IAM → Identity Providers → Add Provider.<br>Provider type: OpenID Connect<br>Provider URL: <code>https://token.actions.githubusercontent.com</code><br>Audience: <code>sts.amazonaws.com</code><br>Click "Get thumbprint" → Add Provider.<br>Screenshot the new Identity Provider showing as Active in IAM.' },
      { action: 'Create the GitHubActionsRole with trust policy', detail: 'IAM → Roles → Create Role → Web Identity.<br>Identity provider: token.actions.githubusercontent.com<br>Audience: sts.amazonaws.com<br>Attach policy: AdministratorAccess (lab only — in production use least-privilege).<br>Name: GitHubActionsRole → Create role.<br>After creation, go to Trust relationships → Edit trust policy. Replace with:<br><code>{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Federated":"arn:aws:iam::[YOUR-ACCOUNT-ID]:oidc-provider/token.actions.githubusercontent.com"},"Action":"sts:AssumeRoleWithWebIdentity","Condition":{"StringLike":{"token.actions.githubusercontent.com:sub":"repo:[YOUR-GITHUB-USERNAME]/bme-allinone-:*"},"StringEquals":{"token.actions.githubusercontent.com:aud":"sts.amazonaws.com"}}}]}</code><br>Replace [YOUR-ACCOUNT-ID] and [YOUR-GITHUB-USERNAME] with your actual values.', warn: 'The sub condition locks this role to YOUR repository only. If you fork it to a different org/user, update this value — otherwise the pipeline will fail with access denied.' },
      { action: 'Create the backend S3 buckets and DynamoDB tables', detail: 'AWS Console → S3 → Create 3 buckets:<br>• bme-dev-app-buckettt (or a unique name ending in your initials)<br>• bme-uat-app-buckettt<br>• bme-prod-app-buckettt<br>Settings for each: Block public access ON, Versioning ON, Region: us-west-2.<br>DynamoDB → Create 3 tables:<br>• bme-dev-app-dbb — Partition key: LockID (String)<br>• bme-uat-app-dbb<br>• bme-prod-app-dbb<br>Verify all tables show Status = ACTIVE in us-west-2.' },
      { action: 'Verify the GitHub Actions workflow file uses OIDC', detail: 'In your cloned repo, open .github/workflows/deploy.yml. Verify it contains:<br><code>permissions:<br>  id-token: write<br>  contents: read</code><br>And the AWS credentials step:<br><code>- name: Configure AWS Credentials<br>  uses: aws-actions/configure-aws-credentials@v2<br>  with:<br>    role-to-assume: arn:aws:iam::[ACCOUNT-ID]:role/GitHubActionsRole<br>    aws-region: us-west-2</code><br>Update the role ARN with your actual Account ID. Commit and push this change.', featured: true },
      { action: 'Deploy Dev, UAT, and Production', detail: '<strong>Dev:</strong> <code>git push origin develop</code> → GitHub Actions triggers automatically.<br><strong>UAT:</strong> <code>git checkout -b uat && git push origin uat</code> → triggers UAT deployment.<br><strong>Production:</strong> GitHub → Actions → "AWS Terraform CI/CD" → Run workflow → environment: production, destroy: false → Run workflow.<br>For each: watch the Actions tab, verify green checkmarks, screenshot the EC2 instances running in AWS Console.' },
      { action: 'Test the destroy functionality', detail: 'GitHub → Actions → Run workflow again.<br>Set: environment: production, destroy: true → Run.<br>Watch the workflow run terraform destroy. Screenshot the green success.<br>Go to EC2 Console → confirm instances are "Terminated".<br>Repeat for dev and uat environments.<br>Final screenshot: all 3 environments destroyed, zero EC2 instances running.', tip: 'The destroy flow is as important as the deploy flow. In a real DevOps role, you will destroy environments daily to control costs. Test it every time.' },
    ]
  },
  aws_w5l2: {
    overview: 'Containers are how modern applications are deployed. Today you package a web app into a Docker image, store it in Amazon ECR, and run it on ECS Fargate — serverless containers with no EC2 to manage.',
    deliverable: 'Screenshots of: Docker image built locally, image pushed to ECR, ECS Fargate task running, app accessible via browser. File: AWS_LAB2_YourName_W5',
    steps: [
      { action: 'Install Docker Desktop and verify', detail: 'Download Docker Desktop from docker.com. After install, run: `docker --version` and `docker run hello-world`. You should see "Hello from Docker!" — Docker is working.', featured: true },
      { action: 'Create a simple Dockerfile', detail: 'Create a folder `bme-app`. Inside, create `index.html` and a `Dockerfile`:<br><code>FROM nginx:alpine<br>COPY index.html /usr/share/nginx/html/<br>EXPOSE 80</code><br>In index.html: `&lt;h1&gt;BME App — Containerized on ECS Fargate&lt;/h1&gt;`<br>Build: `docker build -t bme-app .`<br>Test locally: `docker run -p 8080:80 bme-app` → open localhost:8080.' },
      { action: 'Create ECR repository and push the image', detail: 'AWS Console → ECR → Create repository. Name: bme-app. Private. Run the "View push commands" instructions:<br>1. `aws ecr get-login-password | docker login ...`<br>2. `docker tag bme-app:latest [account-id].dkr.ecr.us-east-1.amazonaws.com/bme-app:latest`<br>3. `docker push [account-id].dkr.ecr.us-east-1.amazonaws.com/bme-app:latest`<br>Screenshot the ECR console showing your image.' },
      { action: 'Create an ECS Cluster and Task Definition', detail: '<strong>Cluster:</strong> ECS → Clusters → Create → Fargate (serverless). Name: BME-Cluster.<br><strong>Task Definition:</strong> ECS → Task Definitions → Create → Fargate. Name: bme-task. CPU: 0.25 vCPU, Memory: 0.5 GB. Container: name=bme-app, image=[your ECR URI], port=80.' },
      { action: 'Run the ECS Service', detail: 'ECS → your cluster → Services → Create. Launch type: Fargate. Task definition: bme-task. Desired tasks: 1. VPC: BME-Dev-VPC. Subnet: public. Security Group: allow HTTP 80. Assign public IP: YES. Wait 2 minutes → Tasks tab → click the task → copy Public IP → open in browser.', tip: 'ECS Fargate means you never patch, resize, or manage the underlying EC2. AWS handles all of that — you just define the container and desired count.' },
    ]
  },
  aws_w6l1: {
    overview: 'Kubernetes is the industry standard for container orchestration at scale. Amazon EKS runs Kubernetes as a managed service — you define the app, AWS manages the control plane. Today you deploy BME\'s app on EKS.',
    deliverable: 'Screenshots of: EKS cluster active, kubectl connected (`kubectl get nodes`), deployment running (`kubectl get pods`), service accessible via external IP. File: AWS_LAB1_YourName_W6',
    steps: [
      { action: 'Install kubectl and eksctl', detail: '`kubectl` is the Kubernetes CLI. `eksctl` is AWS\'s EKS provisioning tool.<br>• Install kubectl: kubernetes.io/docs/tasks/tools/<br>• Install eksctl: eksctl.io/introduction/installation/<br>Verify: `kubectl version --client` and `eksctl version`.' },
      { action: 'Create the EKS cluster', detail: 'Run: `eksctl create cluster --name bme-cluster --region us-east-1 --nodegroup-name bme-nodes --node-type t3.medium --nodes 2 --nodes-min 1 --nodes-max 3 --managed`<br>This takes 10–15 minutes. eksctl creates the VPC, subnets, node group, and configures kubectl automatically.', featured: true, warn: 'EKS clusters cost ~$0.10/hour for the control plane plus EC2 node costs. Destroy after the lab: `eksctl delete cluster --name bme-cluster`' },
      { action: 'Write the deployment manifest', detail: 'Create `bme-deployment.yaml`:<br><code>apiVersion: apps/v1<br>kind: Deployment<br>metadata:<br>  name: bme-app<br>spec:<br>  replicas: 2<br>  selector: { matchLabels: { app: bme-app } }<br>  template:<br>    metadata: { labels: { app: bme-app } }<br>    spec:<br>      containers:<br>      - name: bme-app<br>        image: [your ECR URI]:latest<br>        ports: [{containerPort: 80}]</code><br>Apply: `kubectl apply -f bme-deployment.yaml`' },
      { action: 'Expose the deployment with a LoadBalancer service', detail: 'Create `bme-service.yaml`:<br><code>apiVersion: v1<br>kind: Service<br>metadata: { name: bme-service }<br>spec:<br>  type: LoadBalancer<br>  selector: { app: bme-app }<br>  ports: [{port: 80, targetPort: 80}]</code><br>Apply: `kubectl apply -f bme-service.yaml`<br>Run: `kubectl get service bme-service` — wait for EXTERNAL-IP to appear (2–3 min). Open the IP in your browser.' },
      { action: 'Perform a rolling update', detail: 'Edit index.html: change the heading text. Rebuild and push a new Docker image with tag `:v2`. Update the deployment: `kubectl set image deployment/bme-app bme-app=[ECR URI]:v2`. Watch the rollout: `kubectl rollout status deployment/bme-app`. Verify the new version loads in the browser without downtime.', tip: 'Rolling updates replace pods one at a time, keeping the app available throughout. This is the `StrategyType: RollingUpdate` default in Kubernetes.' },
    ]
  },
  aws_w6l4: {
    overview: 'Final Demo Day. Over 6 weeks you designed, built, automated, and containerized a production-grade cloud infrastructure for BME. Today you present it, demonstrate it live, and earn your AWS Cloud Architect Engineer Certificate.',
    deliverable: '10-slide presentation shared link + GitHub repo link (all weeks\' code) + LinkedIn announcement screenshot. File: AWS_FINAL_YourName_W6',
    steps: [
      { action: 'Prepare your 10-slide deck (use Google Slides or Gamma)', detail: '<strong>Slide 1:</strong> Title — "BME Cloud Infrastructure | ZICT AWS Program | [Your Name]"<br><strong>Slide 2:</strong> Problem — BME\'s challenge (100K concurrent users, ticketing spikes, no cloud infrastructure)<br><strong>Slide 3:</strong> Architecture overview diagram (your Lucidchart from Week 1, updated)<br><strong>Slide 4:</strong> Infrastructure stack — VPC, EC2/ALB/ASG, RDS, S3, CloudFront<br><strong>Slide 5:</strong> Infrastructure as Code — Terraform structure and environment strategy', featured: true },
      { action: 'Complete slides 6–10', detail: '<strong>Slide 6:</strong> CI/CD Pipeline — GitHub Actions workflow diagram<br><strong>Slide 7:</strong> Containers — ECS Fargate and/or EKS deployment architecture<br><strong>Slide 8:</strong> Security controls — WAF, KMS, IAM roles, Security Groups, CloudTrail<br><strong>Slide 9:</strong> Monitoring — CloudWatch dashboards, SNS alerts, what gets alerted on<br><strong>Slide 10:</strong> Career readiness — your GitHub portfolio, LinkedIn profile update, target job titles, next cert (AWS SAA-C03)' },
      { action: 'Prepare your live demo (3 minutes)', detail: 'Show ONE of: (a) browser loading your app via ALB or ECS service, (b) GitHub Actions pipeline running a plan, (c) `kubectl get pods` showing running containers. Choose what works most reliably on demo day — live demos should be rehearsed.' },
      { action: 'Publish your GitHub repository', detail: 'Make your bme-infra repo public. Ensure it has a README.md explaining the project. All weeks\' Terraform code, CI/CD workflows, Dockerfiles, and Kubernetes manifests should be visible. This is your primary portfolio artifact.', warn: 'Remove any .tfvars files or .env files containing credentials before making public. Run `git log --all --full-history -- "*.tfvars"` to check history.' },
      { action: 'Post your LinkedIn announcement', detail: '"Excited to share that I just completed the @ZICT AWS Cloud Architect Engineer program! Over 6 weeks I designed and deployed a production-ready AWS infrastructure including VPC, EC2, RDS, Terraform IaC, GitHub Actions CI/CD, Docker, ECS Fargate, and Amazon EKS. GitHub: [link] #AWS #CloudEngineering #ZICT #Terraform #DevOps"', tip: '🎓 You built real infrastructure. You have a GitHub portfolio with 24 assessments of cloud work. You are ready for Cloud Engineer, DevOps Engineer, and Solutions Architect roles.' },
    ]
  },
}

// ── AWS Instructor-Led Sessions ───────────────────────────
export const AWS_WEEK_SESSIONS = {
  1: [
    { id:'AW-1', day:'Mon', title:'Client Discovery & Cloud Requirements Gathering', objective:'Conduct structured discovery across 9 AWS domains; document BME business requirements' },
    { id:'AW-2', day:'Tue', title:'AWS Service Selection & Business Justification',  objective:'Map BME requirements to specific AWS services; articulate business-driven rationale' },
    { id:'AW-3', day:'Wed', title:'Cloud Architecture Diagramming with Lucidchart',  objective:'Use AWS icon library to produce professional architecture diagrams' },
    { id:'AW-4', day:'Thu', title:'Architecture Documentation & Technical Writing',  objective:'Write a client-ready technical brief covering all architecture layers' },
  ],
  2: [
    { id:'AW-1', day:'Mon', title:'VPC Design Principles & CIDR Planning',           objective:'Understand subnet strategy, public vs. private tiers, and CIDR notation' },
    { id:'AW-2', day:'Tue', title:'Building the Network: IGW, NAT, Route Tables',    objective:'Provision full VPC networking foundation in AWS Console' },
    { id:'AW-3', day:'Wed', title:'EC2, Security Groups & Apache Web Server',         objective:'Launch EC2 in VPC, configure security groups, install and verify Apache' },
    { id:'AW-4', day:'Thu', title:'ALB, Auto Scaling & SSL/TLS with ACM',             objective:'Configure load balancing, auto-scaling, and HTTPS termination' },
  ],
  3: [
    { id:'AW-1', day:'Mon', title:'AWS Data & Security Services Deep Dive',          objective:'Configure S3, RDS Multi-AZ, IAM roles, CloudTrail, SNS, CloudFront, and Budgets' },
    { id:'AW-2', day:'Tue', title:'UAT Environment Planning & Terraform Introduction', objective:'Design UAT architecture; understand Terraform concepts and file structure' },
    { id:'AW-3', day:'Wed', title:'Terraform Multi-Environment Setup & S3 Backend',  objective:'Build modular Terraform with remote state management across Dev/UAT/Prod' },
    { id:'AW-4', day:'Thu', title:'Production Terraform Deployment & Review',         objective:'Apply full three-tier Terraform stack; review plan output and apply process' },
  ],
  4: [
    { id:'AW-1', day:'Mon', title:'CI/CD Fundamentals & GitHub Actions',             objective:'Understand pipeline concepts; configure GitHub Actions for Terraform automation' },
    { id:'AW-2', day:'Tue', title:'Pipeline Troubleshooting & Documentation',         objective:'Debug common CI/CD failures; document pipeline architecture for handoff' },
    { id:'AW-3', day:'Wed', title:'Weeks 1–4 Portfolio Review & Gap Analysis',       objective:'Audit all deliverables; prepare complete GitHub architecture portfolio' },
    { id:'AW-4', day:'Thu', title:'Capstone Project Scoping & Planning Session',      objective:'Define capstone scope, services, timeline, and success criteria with instructor' },
  ],
  5: [
    { id:'AW-1', day:'Mon', title:'Git, GitHub & Version Control Best Practices',    objective:'Fork repos, branch strategy, meaningful commits, PR workflow' },
    { id:'AW-2', day:'Tue', title:'Docker & Container Fundamentals',                  objective:'Build Docker images, run containers locally, understand Dockerfile' },
    { id:'AW-3', day:'Wed', title:'Amazon ECR & ECS Fargate Deployment',              objective:'Push images to ECR; deploy containerized app on serverless Fargate' },
    { id:'AW-4', day:'Thu', title:'ECS + Terraform: Production Container Infrastructure', objective:'Provision complete ECS stack with ALB, auto-scaling, and logging via Terraform' },
  ],
  6: [
    { id:'AW-1', day:'Mon', title:'Kubernetes Fundamentals & Amazon EKS',            objective:'Understand pods, deployments, services; create EKS cluster with eksctl' },
    { id:'AW-2', day:'Tue', title:'EKS Observability: CloudWatch, SNS & CloudTrail', objective:'Configure Container Insights, pod dashboards, and failure alerting' },
    { id:'AW-3', day:'Wed', title:'Multi-Environment CI/CD with Manual Approval Gates', objective:'Build GitHub Actions pipeline with UAT and Prod promotion gates' },
    { id:'AW-4', day:'Thu', title:'Final Presentations, Demo Day & Graduation',       objective:'10-slide capstone presentation, live demo, certificate award, LinkedIn announcement' },
  ],
}

// ── Session lookup helper ─────────────────────────────────
export function getSessionsByWeek(program, weekNum) {
  if ((program || 'applied_ai') === 'aws') return AWS_WEEK_SESSIONS[weekNum] || []
  return WEEK_SESSIONS[weekNum] || []
}
