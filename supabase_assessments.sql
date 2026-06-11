-- ════════════════════════════════════════════════════════════
-- ZICT LMS — Project-Based Assessments
-- Run this in Supabase → SQL Editor
-- ════════════════════════════════════════════════════════════

-- ── ASSESSMENTS (template library) ──────────────────────────
-- specialization: NULL or '{}' = general (all students)
--                 ARRAY['it','sector',...] = track-specific
CREATE TABLE public.assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  instructions JSONB DEFAULT '[]'::JSONB,  -- [{action, detail, tip, warn}]
  deliverable TEXT,
  rubric JSONB DEFAULT '[]'::JSONB,         -- [{criterion, description}]
  specialization TEXT[],                    -- NULL/empty = general
  week_context INTEGER,
  difficulty TEXT DEFAULT 'intermediate'
    CHECK (difficulty IN ('beginner','intermediate','advanced')),
  type TEXT DEFAULT 'project'
    CHECK (type IN ('project','reflection','portfolio','case_study')),
  estimated_hours NUMERIC DEFAULT 2,
  active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "All read active assessments" ON public.assessments
  FOR SELECT TO authenticated
  USING (active = TRUE OR EXISTS(
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','instructor')
  ));
CREATE POLICY "Admin manage assessments" ON public.assessments
  FOR ALL USING (
    EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','instructor'))
  );

-- ── ASSESSMENT SUBMISSIONS ───────────────────────────────────
CREATE TABLE public.assessment_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  submission_text TEXT,
  submission_url TEXT,
  submission_type TEXT DEFAULT 'text'
    CHECK (submission_type IN ('text','url','file')),
  grade TEXT DEFAULT 'pending'
    CHECK (grade IN ('pass','fail','pending')),
  grade_notes TEXT,
  graded_by UUID REFERENCES auth.users(id),
  graded_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(assessment_id, user_id)
);
ALTER TABLE public.assessment_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own assessment submissions" ON public.assessment_submissions
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admin assessment submissions" ON public.assessment_submissions
  FOR ALL USING (
    EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','instructor'))
  );

ALTER PUBLICATION supabase_realtime ADD TABLE public.assessment_submissions;

-- ════════════════════════════════════════════════════════════
-- SEED: Pre-built Assessment Templates
-- ════════════════════════════════════════════════════════════

-- ── GENERAL (all career tracks) ──────────────────────────────

INSERT INTO public.assessments (title, description, instructions, deliverable, rubric, specialization, week_context, difficulty, type, estimated_hours) VALUES
(
  'AI Productivity Blueprint',
  'Map your current daily workflows, identify 3 repetitive tasks, and redesign each using AI tools. This assessment bridges Week 1–2 concepts with your real work context.',
  '[
    {"action": "Audit your current week", "detail": "List every recurring task you do in a typical work or study week. Include things like writing emails, researching topics, filling out forms, scheduling, or summarizing content. Aim for at least 10 tasks.", "tip": "Use a Google Sheet with columns: Task | Time Spent | Frequency | Manual Steps"},
    {"action": "Identify your top 3 AI-ready tasks", "detail": "From your list, circle the 3 tasks that are (1) repetitive, (2) text-based or research-based, and (3) time-consuming. These are your AI opportunities.", "tip": "Good candidates: writing first drafts, summarizing documents, answering FAQs, formatting data"},
    {"action": "Redesign each task with AI", "detail": "For each of the 3 tasks, write a before/after: what you do now vs. how you would do it with ChatGPT, Gemini, or another AI tool. Include the exact prompt you would use.", "tip": "Use the RTFT framework: Role, Task, Format, Tone"},
    {"action": "Estimate your time savings", "detail": "For each redesigned task, estimate how many minutes per week you would save. Add them up for a monthly and yearly total.", "warn": "Be realistic — AI still needs human review. Factor in 20% editing time."},
    {"action": "Write your 30-day AI adoption plan", "detail": "List 3 specific actions you will take in the next 30 days to start using AI in these tasks. Include which tool you will use and when.", "tip": "Specific = \"I will use ChatGPT every Monday to draft my weekly status update\" — not \"I will use AI more\""}
  ]'::JSONB,
  'Submit a Google Doc titled "AI Productivity Blueprint — [Your Name]" containing: (1) Your task audit table, (2) 3 before/after workflow redesigns with prompts, (3) Time savings estimate, (4) 30-day action plan. Minimum 500 words.',
  '[
    {"criterion": "Task Audit", "description": "At least 10 tasks listed with time and frequency data"},
    {"criterion": "AI Redesign Quality", "description": "3 clear before/after comparisons with specific, usable prompts"},
    {"criterion": "RTFT Framework", "description": "Prompts demonstrate Role, Task, Format, Tone structure"},
    {"criterion": "Time Savings Analysis", "description": "Realistic estimates with monthly and yearly totals"},
    {"criterion": "Action Plan", "description": "3 specific, scheduled actions for the next 30 days"}
  ]'::JSONB,
  NULL,
  2,
  'beginner',
  'reflection',
  3
),
(
  'AI Prompt Engineering Portfolio',
  'Build a personal library of 10 high-quality, role-specific prompts using the RTFT framework. Your prompts should solve real problems in your industry and be ready to use immediately.',
  '[
    {"action": "Review the RTFT framework", "detail": "Role, Task, Format, Tone. Every strong prompt specifies who the AI is playing, what job it is doing, how the output should look, and the right emotional register.", "tip": "Bad: \"Write an email.\" Good: \"You are an HR coordinator. Write a 3-sentence email to a new hire confirming their start date. Format: bullet points. Tone: warm and professional.\""},
    {"action": "Select 10 use cases from your industry", "detail": "Think about what you do or want to do. Pick 10 situations where you could use AI: writing, summarizing, researching, explaining, generating options, role-playing a scenario, etc."},
    {"action": "Write all 10 prompts using RTFT", "detail": "For each prompt, fill in: Role, Task, Format (e.g. bullet list / numbered steps / 3-paragraph essay), Tone (formal / conversational / empathetic). Then combine them into one full prompt string."},
    {"action": "Test each prompt in ChatGPT or Gemini", "detail": "Run every prompt and paste the first output next to it. Note: did it work as expected? Did you need to adjust it?", "tip": "Add a \"Test Result\" column to your doc — pass/needs adjustment"},
    {"action": "Refine 3 prompts based on test results", "detail": "Pick 3 prompts that did not perform well and rewrite them. Document what changed and why. This is the most important learning step.", "warn": "Do not skip testing — untested prompts are not portfolio-ready"}
  ]'::JSONB,
  'Submit a Google Doc titled "Prompt Portfolio — [Your Name]" with a table: Prompt # | Use Case | Full RTFT Prompt | Test Result | Refined Version (if applicable). Minimum 10 prompts, 3 with refinement notes.',
  '[
    {"criterion": "RTFT Structure", "description": "All 10 prompts clearly specify Role, Task, Format, and Tone"},
    {"criterion": "Industry Relevance", "description": "Prompts connect to real use cases in the student'\''s career track"},
    {"criterion": "Testing Evidence", "description": "Each prompt includes a test result note"},
    {"criterion": "Refinement Quality", "description": "3 prompts show before/after improvement with reasoning"},
    {"criterion": "Usability", "description": "Prompts are specific enough to use immediately without further editing"}
  ]'::JSONB,
  NULL,
  3,
  'intermediate',
  'portfolio',
  4
),
(
  'Digital Tools Proficiency Showcase',
  'Demonstrate your mastery of workplace digital tools by creating a complete multi-tool project that a real employer would recognize as professional work.',
  '[
    {"action": "Choose a realistic project scenario", "detail": "Pick one of: (A) Plan a team event — build a budget tracker, agenda doc, and presentation. (B) Onboard a new employee — create a welcome guide, task checklist, and training schedule. (C) Launch a small project — project plan doc, budget sheet, and status update email. Use whichever fits your career track."},
    {"action": "Build the spreadsheet component", "detail": "Create a Google Sheet or Excel file. Must include: formatted headers, at least one formula (SUM, AVERAGE, or IF), conditional formatting on at least one column, and a chart or visualization.", "tip": "Name your file: PROJECT_Sheet_[YourName]"},
    {"action": "Build the document component", "detail": "Create a Google Doc or Word document with: Heading styles (H1/H2/H3), a table, bullet lists, and at least one comment or suggestion using the collaboration tools.", "tip": "Name your file: PROJECT_Doc_[YourName]"},
    {"action": "Build the presentation component", "detail": "Create a Google Slides or PowerPoint deck with: minimum 5 slides, consistent theme/colors, at least one chart or image, and speaker notes on 2+ slides."},
    {"action": "Record a 3-minute walkthrough", "detail": "Use Loom (free) or screen recording to walk through all three files in under 3 minutes. Explain what each file is for and one feature you are most proud of.", "tip": "Loom.com — free, no download required. Record your screen + face."}
  ]'::JSONB,
  'Submit three links: (1) Google Sheet / Excel file URL, (2) Google Doc / Word URL, (3) Loom or screen recording URL. All three must be set to "Anyone with the link can view."',
  '[
    {"criterion": "Spreadsheet (formulas + chart)", "description": "Has formatted headers, at least one formula, conditional formatting, and a chart"},
    {"criterion": "Document (structure + collaboration)", "description": "Uses heading styles, table, lists, and collaboration features"},
    {"criterion": "Presentation (design + notes)", "description": "5+ slides, consistent theme, chart or image, speaker notes"},
    {"criterion": "Coherent scenario", "description": "All three files tell the same story / serve the same project"},
    {"criterion": "Video walkthrough", "description": "3-minute recording explains purpose and highlights a key feature"}
  ]'::JSONB,
  NULL,
  2,
  'intermediate',
  'project',
  5
);

-- ── IT & AI SUPPORT TRACK ────────────────────────────────────

INSERT INTO public.assessments (title, description, instructions, deliverable, rubric, specialization, week_context, difficulty, type, estimated_hours) VALUES
(
  'AI-Powered IT Helpdesk Knowledge Base',
  'Build a practical IT FAQ knowledge base using ChatGPT, structured so any team member or end user can resolve common issues without calling support. This is a real deliverable you can add to your portfolio.',
  '[
    {"action": "Identify 20 common IT support requests", "detail": "Think about what questions IT teams hear most often: password resets, software installation, Wi-Fi issues, email problems, printer setup, VPN access, account lockouts, etc. List them in a Google Sheet.", "tip": "Interview a friend or family member who is not in IT — ask what computer problems frustrate them most"},
    {"action": "Use ChatGPT to draft answers for all 20", "detail": "Prompt: \"You are an IT support specialist. A user reports: [issue]. Write a clear step-by-step resolution in plain language, under 150 words. Format: numbered steps.\" Run this for each of your 20 issues.", "tip": "Use a consistent RTFT prompt for all 20 — this makes the tone uniform"},
    {"action": "Organize into a Knowledge Base document", "detail": "Create a Google Doc with sections by category: Account & Access, Software & Apps, Network & Connectivity, Hardware, Email & Collaboration. Under each, add the relevant Q&A pairs with clear headings.", "warn": "Review every AI answer for accuracy — AI can describe steps that are outdated or specific to a different OS version"},
    {"action": "Add a Troubleshooting Decision Tree", "detail": "Pick one complex issue (e.g., \"User cannot connect to Wi-Fi\") and create a simple decision tree using a Google Drawing or a nested list: Is the password correct? → Y: try forget/rejoin → N: contact admin. Show at least 3 decision branches."},
    {"action": "Write a 1-page IT Support Policy", "detail": "Use AI to draft a short policy: what the helpdesk covers, response time expectations, escalation path, and what users should try first. Keep it under 250 words. Edit and personalize it.", "tip": "Prompt: \"Draft a 1-page IT helpdesk policy for a 20-person company. Include: scope, hours, SLA, escalation. Tone: clear and professional.\""}
  ]'::JSONB,
  'Submit a Google Doc titled "IT Knowledge Base — [Your Name]" containing all 5 sections. Share as "Anyone with the link can view." Also submit a Google Sheet showing your initial 20-issue list with the prompts you used.',
  '[
    {"criterion": "Coverage (20 issues)", "description": "At least 20 distinct issues organized into categories"},
    {"criterion": "Answer Quality", "description": "Answers are accurate, step-by-step, and written in plain language"},
    {"criterion": "AI Prompt Documentation", "description": "The Google Sheet shows the prompts used and any edits made to AI output"},
    {"criterion": "Decision Tree", "description": "At least one issue has a multi-branch troubleshooting tree"},
    {"criterion": "IT Policy", "description": "1-page policy is complete, professional, and clearly edited from AI draft"}
  ]'::JSONB,
  ARRAY['it'],
  4,
  'intermediate',
  'project',
  4
),
(
  'Zapier IT Automation Workflow',
  'Design and build a working Zapier automation that solves a real IT or operations problem. This project teaches you to think in systems — triggers, conditions, actions — which is foundational to IT support and automation roles.',
  '[
    {"action": "Pick a real IT automation scenario", "detail": "Choose one: (A) New employee onboarding — when a row is added to a Google Sheet, send a welcome email and create a Trello card. (B) IT ticket routing — when a form is submitted, send an email to the right team based on issue category. (C) Software access request — form submission → email to manager → calendar event for IT setup. (D) Design your own if you have a better idea.", "tip": "Start simple — one trigger, one or two actions. You can add complexity after it works."},
    {"action": "Set up the Trigger in Zapier", "detail": "Log in to Zapier (free plan works). Create a new Zap. Set the Trigger app (Google Forms, Google Sheets, Typeform, etc.) and select the event. Connect your account and test the trigger to confirm it receives sample data.", "warn": "You must connect a real account and have at least one sample record for the trigger to test"},
    {"action": "Configure the Action(s)", "detail": "Add your action step(s). Map the data fields from the trigger to the action correctly. For example: map the \"Name\" field from the form to the \"To Name\" field in the email.", "tip": "Use the \"Test Action\" button — this sends a real record to confirm it works end-to-end"},
    {"action": "Take screenshots of every step", "detail": "Capture: (1) The Zap overview screen showing all steps, (2) The Trigger setup screen, (3) Each Action setup screen, (4) The successful test result screen. Name your screenshots clearly."},
    {"action": "Write a Process Documentation page", "detail": "In a Google Doc, describe: (1) The problem this automation solves, (2) A step-by-step explanation of how the Zap works, (3) What would happen without this automation (manual process), (4) How you would extend it in the future.", "tip": "This documentation is what you would hand to a manager — write it for someone who has never used Zapier"}
  ]'::JSONB,
  'Submit: (1) A Google Doc with your process documentation and all screenshots embedded. (2) The Zapier Zap name and a screenshot of it set to "On" (active). If you have a paid Zapier plan, include the sharing URL.',
  '[
    {"criterion": "Working Zap", "description": "Screenshots confirm the automation runs end-to-end with a successful test"},
    {"criterion": "Practical Use Case", "description": "The scenario solves a real IT or operations problem, not a toy example"},
    {"criterion": "Configuration Accuracy", "description": "Trigger and action fields are correctly mapped with no placeholder data"},
    {"criterion": "Process Documentation", "description": "Google Doc clearly explains the problem, solution, and manual alternative"},
    {"criterion": "Future Extension", "description": "Doc includes at least one specific idea for expanding the automation"}
  ]'::JSONB,
  ARRAY['it'],
  6,
  'intermediate',
  'project',
  3
);

-- ── BUSINESS OPERATIONS TRACK ────────────────────────────────

INSERT INTO public.assessments (title, description, instructions, deliverable, rubric, specialization, week_context, difficulty, type, estimated_hours) VALUES
(
  'Business Process AI Integration Report',
  'Identify 3 manual business processes, analyze the cost and time of doing them manually, and present a redesigned workflow using AI and automation tools. This is the kind of analysis that gets people promoted.',
  '[
    {"action": "Select 3 manual business processes", "detail": "Choose processes that are: (1) done regularly (daily/weekly/monthly), (2) involve creating, reviewing, or routing documents or data, and (3) currently require significant human time. Examples: expense reporting, onboarding paperwork, weekly status reports, invoice processing, customer inquiry responses.", "tip": "If you are not currently working, use a business you know (a family member'\''s business, a past job, or a hypothetical 10-person company)"},
    {"action": "Document each process as-is", "detail": "For each process, create a process map: list every step in sequence, who does each step, how long it takes, and what tools they use. Calculate: steps × time per step = total time per occurrence × frequency = monthly hours spent.", "warn": "Be precise about time. \"It takes a while\" is not analysis. Use realistic estimates: replying to 20 customer emails = 5 min each = 100 min/day = 8+ hours/week."},
    {"action": "Redesign each process with AI/automation", "detail": "For each process, propose a new version: which steps can AI generate (e.g., draft responses with ChatGPT), which steps can be automated (e.g., Zapier routes form submissions), and which steps still require human review. Draw the new process map.", "tip": "Keep humans in the loop for decisions, approvals, and customer-facing final outputs"},
    {"action": "Calculate ROI for each redesign", "detail": "Compare: old time vs. new time, old cost (hours × $20/hr or actual salary estimate) vs. new cost (tool subscription + reduced hours). Present: hours saved per month, cost saved per month, and payback period if there is a tool cost.", "tip": "Zapier free plan costs $0. ChatGPT Plus is $20/month. Google Workspace is $6/user. Use these in your calculations."},
    {"action": "Write an executive summary", "detail": "Summarize your findings in 1 page as if presenting to a business owner or manager. Include: the 3 processes, total current cost, total projected savings, and a recommended implementation order (start with the highest ROI first).", "tip": "Use the structure: Situation → Problem → Solution → Expected Results → Recommended Next Step"}
  ]'::JSONB,
  'Submit a Google Doc or Google Slides deck titled "AI Integration Report — [Your Name]" with: (1) Process maps for all 3 scenarios (before/after), (2) ROI calculations, (3) 1-page executive summary.',
  '[
    {"criterion": "Process Documentation", "description": "All 3 processes documented with steps, owners, time, and tools"},
    {"criterion": "AI/Automation Redesign", "description": "Each redesign clearly identifies what AI does, what automation handles, and what humans keep"},
    {"criterion": "ROI Calculations", "description": "Realistic time and cost calculations with sources or assumptions stated"},
    {"criterion": "Executive Summary", "description": "1-page summary is professional, persuasive, and prioritizes by ROI"},
    {"criterion": "Real-World Applicability", "description": "The processes and solutions are realistic for an actual business context"}
  ]'::JSONB,
  ARRAY['biz'],
  5,
  'intermediate',
  'case_study',
  5
),
(
  'End-to-End Automation Workflow Project',
  'Build a complete multi-step Zapier or Make.com automation for a business operation, document it professionally, and present it as if delivering to a client. This is a hire-ready portfolio project.',
  '[
    {"action": "Define the business problem", "detail": "Write a 1-paragraph description of a real business operation that wastes time. Examples: customer inquiry from website form → manually emailed to sales rep → manually added to CRM → manually scheduled follow-up. Each \"manually\" is an automation opportunity.", "tip": "The best automations connect 3+ systems. Think: where does data enter your business? Where does it need to go?"},
    {"action": "Map the automation architecture", "detail": "Draw or describe the full flow: Trigger → Step 1 → Step 2 → Step 3 → Final Output. Specify the exact app at each step (e.g., Typeform → Google Sheets → Gmail → Slack). This is your blueprint.", "warn": "Do not start building until your map is approved or reviewed — fixing architecture is cheaper than rebuilding a broken Zap"},
    {"action": "Build the automation", "detail": "Implement in Zapier (free), Make.com (free), or Power Automate (free with Microsoft account). Must include: one Trigger, minimum 2 Actions, and at least one Filter or Condition (e.g., only send email if form field = \"Urgent\"). Test with real sample data.", "tip": "Use Zapier'\''s \"Test\" button at every step. A Zap that passed tests is a Zap you can be proud of."},
    {"action": "Create client-ready documentation", "detail": "Produce a 2–3 page Google Doc with: (1) Executive summary of what the automation does and why, (2) Architecture diagram or screenshot walkthrough, (3) Setup instructions (how to replicate it), (4) Maintenance notes (what to check if it breaks).", "tip": "Write as if handing this to someone who will maintain it after you leave. That clarity = professionalism."},
    {"action": "Record a demo video", "detail": "Use Loom to record a 3–5 minute walkthrough: show the trigger firing (submit a test form), watch the steps execute in real time, confirm the output in the destination app. Narrate what is happening and why it matters.", "warn": "Make sure notifications are off and no sensitive data appears on screen during recording"}
  ]'::JSONB,
  'Submit: (1) Google Doc with client documentation (architecture + setup + maintenance), (2) Screenshots of all Zap/automation steps with successful test results, (3) Loom demo video URL.',
  '[
    {"criterion": "Business Problem Clarity", "description": "Problem statement is specific and the automation clearly addresses it"},
    {"criterion": "Architecture (3+ steps)", "description": "At least 3 connected apps with a trigger, filter/condition, and 2+ actions"},
    {"criterion": "Successful Test", "description": "Screenshots confirm end-to-end test passed with real data"},
    {"criterion": "Client Documentation", "description": "2–3 page doc covers purpose, architecture, setup, and maintenance"},
    {"criterion": "Demo Video", "description": "3–5 min Loom shows live automation running with clear narration"}
  ]'::JSONB,
  ARRAY['biz','auto'],
  6,
  'advanced',
  'project',
  6
);

-- ── HEALTHCARE / GOV / EDU / LEGAL TRACK ─────────────────────

INSERT INTO public.assessments (title, description, instructions, deliverable, rubric, specialization, week_context, difficulty, type, estimated_hours) VALUES
(
  'Sector-Specific AI Communication Templates',
  'Create a library of 5 professional communication templates for your sector (healthcare, government, education, or legal) using AI, then edit and polish them to meet the standards of your field.',
  '[
    {"action": "Select your sector and 5 communication scenarios", "detail": "Pick the 5 most common professional communications in your field. Examples — Healthcare: appointment reminder, test result notification, referral letter, patient education handout, HIPAA disclosure summary. Education: parent update email, IEP summary, course syllabus, disciplinary notice, field trip permission slip. Government: constituent response letter, public notice, meeting agenda, policy update memo. Legal: client intake letter, demand letter, engagement letter, status update, closing checklist.", "tip": "Choose scenarios you will actually use or encounter — not hypothetical ones"},
    {"action": "Draft each template using ChatGPT", "detail": "For each of the 5 scenarios, use this prompt structure: \"You are a [sector] professional. Draft a [document type] for [specific situation]. Audience: [recipient]. Tone: professional and [sector-appropriate — e.g. empathetic for healthcare, formal for legal]. Length: [target length]. Format: [letter / email / form / memo].\" Run and save each output.", "warn": "Do not submit raw AI output. Every template must be reviewed and edited by you."},
    {"action": "Edit for compliance and accuracy", "detail": "Review each template for: sector-specific terminology (correct and appropriate), regulatory language (HIPAA for healthcare, FERPA for education, plain language requirements for government), and any information that is too specific or incorrect. Mark your edits in Track Changes.", "tip": "If you are unsure about a regulation, use Perplexity AI to research it: \"What are HIPAA requirements for patient communication?\""},
    {"action": "Add usage instructions to each template", "detail": "Under each template, add a \"How to Use\" note: (1) When to send this, (2) What fields need to be customized (highlight placeholders like [Patient Name]), (3) Who should review before sending, (4) Any legal or compliance checkboxes to complete.", "tip": "Placeholders format: use [BRACKETS] for all fields that need to be filled in"},
    {"action": "Compile into a professional Template Guide", "detail": "Organize all 5 templates in a Google Doc with a cover page, table of contents, and consistent formatting. Add a 1-paragraph introduction explaining who the guide is for and how to use it.", "tip": "This document should look professional enough to share with your team or include in a job application portfolio"}
  ]'::JSONB,
  'Submit a Google Doc titled "[Sector] Communication Templates — [Your Name]" containing all 5 templates with usage instructions, a cover page, and table of contents. Track Changes must show your edits to AI output.',
  '[
    {"criterion": "Sector Relevance", "description": "All 5 templates address real, common situations in the chosen sector"},
    {"criterion": "AI Prompt Quality", "description": "Prompts are RTFT-structured and sector-appropriate"},
    {"criterion": "Compliance Review", "description": "Templates reflect awareness of relevant regulations (HIPAA, FERPA, etc.)"},
    {"criterion": "Editing Evidence", "description": "Track Changes or revision notes show human editing of AI output"},
    {"criterion": "Professional Packaging", "description": "Document has cover page, TOC, consistent formatting, and is portfolio-ready"}
  ]'::JSONB,
  ARRAY['sector'],
  3,
  'intermediate',
  'portfolio',
  4
),
(
  'AI & Compliance Research Brief',
  'Use AI tools to research how artificial intelligence is being adopted (and regulated) in your sector, then write a concise policy brief that could inform leadership decisions. This is a high-value document in any regulated industry.',
  '[
    {"action": "Define your research question", "detail": "Narrow your brief to one of: (A) How is AI being used in [your sector] and what are the top 3 use cases? (B) What regulations govern AI use in [your sector] and what are the compliance requirements? (C) What are the risks of using AI in [your sector] and how are organizations mitigating them? Pick the question most relevant to your career goals.", "tip": "A focused brief is more valuable than a broad one. Pick one question and answer it well."},
    {"action": "Research using Perplexity AI and Google", "detail": "Use Perplexity AI (perplexity.ai) to research your topic — it cites sources, making fact-checking faster. Run at least 5 targeted searches. For each, note: the search query, the key finding, and the source URL. Verify 3+ facts from the primary source (not just the AI summary).", "warn": "AI can hallucinate citations. Always click the source link and confirm the fact is actually in the document."},
    {"action": "Identify 3–5 key findings", "detail": "From your research, extract the 3–5 most important facts, trends, or requirements that a decision-maker in your sector should know. Write each as one clear sentence: \"[Sector] organizations using AI for [use case] must [requirement] under [regulation/standard].\""},
    {"action": "Draft the policy brief", "detail": "Structure: (1) Executive Summary — 2–3 sentences on why this matters now, (2) Background — current AI adoption trends in the sector (1 paragraph), (3) Key Findings — your 3–5 bullet findings with evidence, (4) Implications — what this means for a typical organization, (5) Recommendations — 2–3 practical steps an organization should take today.", "tip": "Total length: 1–2 pages. Policy briefs are meant to be read in 5 minutes. Every sentence must earn its place."},
    {"action": "Add a source list", "detail": "List all sources cited in your brief. Minimum 5 sources, with at least 3 from official or authoritative sources (government sites, professional associations, peer-reviewed publications). Format: Author (if available), Title, Organization, Year, URL."}
  ]'::JSONB,
  'Submit a Google Doc titled "AI & Compliance Brief — [Sector] — [Your Name]" (1–2 pages) containing all 5 sections plus source list. The brief must include at least 5 cited sources.',
  '[
    {"criterion": "Research Depth", "description": "Brief is based on 5+ credible sources, with at least 3 verified from primary sources"},
    {"criterion": "Finding Quality", "description": "3–5 key findings are specific, evidence-backed, and sector-relevant"},
    {"criterion": "Policy Brief Structure", "description": "All 5 sections present: Executive Summary, Background, Findings, Implications, Recommendations"},
    {"criterion": "Practical Recommendations", "description": "Recommendations are actionable, not generic (not just \"use AI responsibly\")"},
    {"criterion": "Source Integrity", "description": "Sources are cited correctly and claims are traceable to actual documents"}
  ]'::JSONB,
  ARRAY['sector'],
  4,
  'intermediate',
  'case_study',
  4
);

-- ── DATA & ANALYTICS TRACK ───────────────────────────────────

INSERT INTO public.assessments (title, description, instructions, deliverable, rubric, specialization, week_context, difficulty, type, estimated_hours) VALUES
(
  'AI-Assisted Data Storytelling Project',
  'Take a real dataset, use AI tools to help you analyze and visualize it, and present your findings as a professional data story. This combines spreadsheet skills with AI-powered analysis and presentation.',
  '[
    {"action": "Choose or find a dataset", "detail": "Use one of: (A) Download a free dataset from Kaggle.com, Data.gov, or Google Dataset Search. Good beginner sets: US city populations, movie ratings, restaurant health scores, job market data. (B) Create your own: track something for a week (your time, exercise, expenses). (C) Use a dataset provided by your instructor.", "tip": "Aim for 50–500 rows. Too small = nothing to analyze. Too large = unnecessary complexity for this project."},
    {"action": "Import into Google Sheets and do basic cleaning", "detail": "Upload your CSV to Google Sheets. Then: (1) Remove duplicate rows (Data → Remove Duplicates), (2) Check for blank cells and decide how to handle them, (3) Format number and date columns consistently, (4) Add a \"Data Notes\" tab documenting what each column means and any cleaning decisions you made.", "warn": "Document every cleaning decision. \"I deleted 12 rows with missing location data\" is more professional than silently deleting them."},
    {"action": "Use ChatGPT to generate analysis ideas", "detail": "Describe your dataset to ChatGPT: \"I have a dataset with [X] rows and these columns: [list them]. What are 5 interesting questions I could answer with this data?\" Pick 3 questions and use Sheets formulas (COUNTIF, AVERAGEIF, SUMIF, SORT) or a pivot table to answer each one.", "tip": "ChatGPT can also write formulas for you: \"Write a Google Sheets COUNTIF formula that counts rows where column B equals 'New York'\""},
    {"action": "Create 3 visualizations", "detail": "Build 3 different chart types in Google Sheets: one bar/column chart, one line chart (if you have time-based data) or pie chart, and one of your choice. Each chart must have: a descriptive title, labeled axes, and a 1-sentence insight caption below it explaining what the chart shows.", "tip": "Insight caption format: \"This chart shows that [finding] — meaning [so what for the audience]\""},
    {"action": "Build a data story presentation", "detail": "Create a 6–8 slide Google Slides deck: Slide 1: Title + dataset source. Slide 2: What question does this data answer? Slide 3–5: One chart per slide + 2–3 bullet insights. Slide 6: Key takeaway + limitations of the analysis. Slide 7 (optional): Recommendations or next steps.", "tip": "Each slide should have one chart and 3 bullet points MAX. Data storytelling = simple, focused, clear."}
  ]'::JSONB,
  'Submit: (1) Google Sheets file with cleaned data, formulas/pivot table, and 3 charts embedded. (2) Google Slides presentation (6–8 slides). (3) A link to your dataset source. All files set to "Anyone with link can view."',
  '[
    {"criterion": "Data Cleaning Documentation", "description": "Data Notes tab documents column definitions and all cleaning decisions"},
    {"criterion": "3 Analysis Questions", "description": "Three specific questions answered using Sheets formulas or pivot tables"},
    {"criterion": "3 Visualizations", "description": "Three distinct chart types with titles, labels, and insight captions"},
    {"criterion": "Presentation Quality", "description": "6–8 slides with one chart per slide and focused, clear insights"},
    {"criterion": "AI Usage Documentation", "description": "Brief note (1 paragraph) describing which parts ChatGPT helped with and what you changed"}
  ]'::JSONB,
  ARRAY['data'],
  5,
  'intermediate',
  'project',
  5
),
(
  'Market Intelligence Report with AI',
  'Use Perplexity AI and other tools to compile a professional market intelligence report on an industry, role, or technology relevant to your career. This is the kind of research analysts are paid to produce.',
  '[
    {"action": "Define your research scope", "detail": "Choose one of: (A) An industry you want to work in (e.g., \"Healthcare AI market 2025\"), (B) A job role you are targeting (e.g., \"Data analyst demand and salary trends\"), (C) A technology you want to master (e.g., \"AI automation tools market overview\"). Write a 2-sentence scope statement: what you are researching and why it matters to your career.", "tip": "The more specific your scope, the better your report. \"AI in healthcare\" is too broad. \"AI tools used in radiology departments in the US\" is a scope you can actually research well."},
    {"action": "Conduct structured research using Perplexity AI", "detail": "Use Perplexity AI to answer these 6 research questions about your topic: (1) What is the current market size and growth rate? (2) Who are the top 5 companies or players? (3) What are the 3 biggest trends right now? (4) What skills are employers in this space looking for? (5) What are the main challenges or risks? (6) What does the next 3 years look like? For each answer, record the Perplexity query, key findings, and source URLs.", "warn": "Click every source link. If a source does not exist or does not support the claim, flag it as unverified and find an alternative."},
    {"action": "Verify with primary sources", "detail": "For at least 3 of your 6 findings, find a primary source to confirm: a company website, government report, industry association publication, or news article from a major outlet published in the last 12 months. This is what separates analysis from AI-generated noise.", "tip": "Good primary sources: BLS.gov (jobs), Statista.com (market data), SHRM (HR), AHA (healthcare), McKinsey/Deloitte annual reports"},
    {"action": "Synthesize findings into a structured report", "detail": "Format: (1) Cover page with title, date, your name. (2) Executive Summary — 3–4 sentences: what you researched, key finding, and your main recommendation. (3) Market Overview — size, growth, key players (1 page). (4) Trends & Opportunities — top 3 trends with evidence (1 page). (5) Skills & Career Implications — what this means for someone trying to break in or advance (half page). (6) Sources — all URLs with dates accessed.", "tip": "Use Google Docs headers, a table for the key players section, and pull-quote boxes for the most striking statistics"},
    {"action": "Add a personal reflection", "detail": "Add a final half-page section: (1) Which finding surprised you most and why? (2) Which trend are you most excited about for your career? (3) What is one thing you will do differently in your job search or skill development based on this research? This section is written in first person — it shows critical thinking, not just research.", "tip": "This section often becomes the best part of the report and the most memorable in an interview"}
  ]'::JSONB,
  'Submit a Google Doc titled "Market Intelligence Report: [Your Topic] — [Your Name]" (3–5 pages) with all sections including sources and personal reflection.',
  '[
    {"criterion": "Research Depth", "description": "All 6 research questions answered with specific data points, not vague generalizations"},
    {"criterion": "Source Verification", "description": "At least 3 findings confirmed from primary sources with URLs and dates"},
    {"criterion": "Report Structure", "description": "All required sections present: cover, exec summary, overview, trends, career implications, sources"},
    {"criterion": "Data Quality", "description": "Market size/growth data cited with year; claims are specific and verifiable"},
    {"criterion": "Personal Reflection", "description": "Half-page reflection shows genuine analysis of implications for the student'\''s career path"}
  ]'::JSONB,
  ARRAY['data'],
  4,
  'intermediate',
  'case_study',
  4
);
