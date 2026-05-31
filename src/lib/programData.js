// ─────────────────────────────────────────────
// ZICT Program Data — all weeks, labs, sessions
// ─────────────────────────────────────────────

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
    level: 1, levelLabel: 'Level 1', color: '#3B82F6',
    sessions: 8, labCount: 6,
    unlocksAt: null,
    cert: null,
    appliedLabTitle: 'Digital Security Audit',
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
    level: 1, levelLabel: 'Level 1', color: '#3B82F6',
    sessions: 8, labCount: 6,
    unlocksAt: { week: 1, minLabs: 5 },
    cert: { level: 1, title: 'Digital Readiness & Workplace Technology Certificate', awardedAfterWeek: 2 },
    appliedLabTitle: 'Multi-Tool Workflow Project',
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
    level: 2, levelLabel: 'Level 2', color: '#EAB308',
    sessions: 9, labCount: 7,
    unlocksAt: { week: 2, minLabs: 5 },
    cert: null,
    appliedLabTitle: 'Prompt Library Build',
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
    level: 2, levelLabel: 'Level 2', color: '#EAB308',
    sessions: 8, labCount: 7,
    unlocksAt: { week: 3, minLabs: 6 },
    cert: null,
    appliedLabTitle: 'Simulated AI Workday',
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
    level: 2, levelLabel: 'Level 2', color: '#EAB308',
    sessions: 8, labCount: 7,
    unlocksAt: { week: 4, minLabs: 6 },
    cert: { level: 2, title: 'AI Productivity & Workplace Applications Certificate', awardedAfterWeek: 5 },
    appliedLabTitle: 'Business Simulation Lab',
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
    level: 3, levelLabel: 'Level 3', color: '#22C55E',
    sessions: 9, labCount: 7,
    unlocksAt: { week: 5, minLabs: 6 },
    cert: null,
    appliedLabTitle: 'Full Automation Build',
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
    level: 3, levelLabel: 'Level 3', color: '#22C55E',
    sessions: 8, labCount: 7,
    unlocksAt: { week: 6, minLabs: 6 },
    cert: null,
    appliedLabTitle: 'Integrated Workflow Optimization',
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
    level: 3, levelLabel: 'Level 3', color: '#22C55E',
    sessions: 9, labCount: 7,
    unlocksAt: { week: 7, minLabs: 6 },
    cert: { level: 3, title: 'AI Automation & Digital Operations Certificate', awardedAfterWeek: 8, isFull: true },
    appliedLabTitle: 'Final Demo Day & Graduation',
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
]

// ── Unlock logic ─────────────────────────────────────────
export function getWeekStatus(weekNum, completedLabs) {
  const week = WEEKS[weekNum - 1]
  if (!week || !week.unlocksAt) return 'unlocked'
  const { week: reqWeek, minLabs } = week.unlocksAt
  const done = (completedLabs || []).filter(l => l.week_num === reqWeek && l.completed).length
  return done >= minLabs ? 'unlocked' : 'locked'
}

// ── Certificate status ────────────────────────────────────
export function getCertStatus(completedLabs) {
  const labs = completedLabs || []
  const count = (wn) => labs.filter(l => l.week_num === wn && l.completed).length
  const certs = []
  if (count(1) >= 5 && count(2) >= 5) certs.push(1)
  if (certs.includes(1) && count(3) >= 6 && count(4) >= 6 && count(5) >= 6) certs.push(2)
  if (certs.includes(2) && count(6) >= 6 && count(7) >= 6 && count(8) >= 6) certs.push(3)
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
}
