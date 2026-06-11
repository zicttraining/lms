// surveyData.js — Program-specific intake survey configs for all 5 ZICT programs
// Each program has its own: career track options, quiz questions, and answer key

// ── Shared helpers ─────────────────────────────────────────────
export function scoreProgramSurvey(programId, answers) {
  const config = PROGRAM_SURVEYS[programId]
  if (!config) return { total: 0, pct: 0, computedLevel: 'beginner', sectionScores: {} }

  const sectionScores = {}
  let total = 0
  let maxTotal = 0

  config.quizSections.forEach(section => {
    let score = 0
    section.questions.forEach(q => {
      maxTotal++
      if (answers[q.field] === q.answer) score++
    })
    sectionScores[section.id] = score
    total += score
  })

  const pct = maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0
  const computedLevel = total >= maxTotal * 0.77 ? 'advanced'
    : total >= maxTotal * 0.44 ? 'intermediate'
    : 'beginner'

  return { total, maxTotal, pct, computedLevel, sectionScores }
}

export function careerTrackFromGoal(programId, goal) {
  const config = PROGRAM_SURVEYS[programId]
  if (!config) return null
  const track = config.careerTracks.find(t => t.label === goal)
  return track?.id || null
}

// ── Program Survey Configurations ─────────────────────────────

export const PROGRAM_SURVEYS = {

  // ══════════════════════════════════════════════════════════
  // Applied AI & Digital Productivity
  // ══════════════════════════════════════════════════════════
  applied_ai: {
    programLabel: 'Applied AI & Digital Productivity',
    programIcon: '🤖',
    intro: 'We\'ll ask about your digital security knowledge, AI literacy, and automation experience to set your starting level and personalise your assessments.',
    careerTracks: [
      { id: 'it',        label: 'IT & AI Support' },
      { id: 'biz',       label: 'Business Operations' },
      { id: 'sector',    label: 'Healthcare / Gov / Edu / Legal' },
      { id: 'data',      label: 'Data & Analytics' },
      { id: 'auto',      label: 'Automation & Workflow Management' },
      { id: 'marketing', label: 'Marketing, Communications & Content' },
      { id: 'admin',     label: 'Administrative & Office Technology' },
      { id: 'cx',        label: 'Customer Service & Client Relations' },
      { id: 'hr',        label: 'Human Resources & People Ops' },
      { id: 'sales',     label: 'Sales & Business Development' },
    ],
    whyJoiningOptions: [
      'New job in tech or AI', 'Advance in current job', 'Start or grow a business',
      'Learn AI for personal growth', 'Career change',
    ],
    quizSections: [
      {
        id: 'cyber',
        title: 'Digital Security Knowledge',
        subtitle: 'These 4 questions are scored and help us understand your security baseline.',
        questions: [
          {
            field: 'ans_mfa',
            label: 'What does MFA mean?',
            options: ['A strong password type', 'A second login step like a phone code', 'A type of firewall', 'Multi-Factor Application'],
            answer: 'A second login step like a phone code',
          },
          {
            field: 'ans_phishing',
            label: 'An urgent bank email asks you to click a link. You:',
            options: ["Go to the bank's official website", 'Click the link', 'Reply asking if it is real', 'Ignore it and do nothing'],
            answer: "Go to the bank's official website",
          },
          {
            field: 'ans_wifi',
            label: 'Which Wi-Fi type is UNSAFE?',
            options: ['WPA3', 'WPA2-Enterprise', 'WEP', 'HTTPS'],
            answer: 'WEP',
          },
          {
            field: 'ans_gdrive',
            label: 'You share a Google Drive file but want them to READ only — not edit. Which permission?',
            options: ['Editor', 'Owner', 'Viewer', 'Commenter'],
            answer: 'Viewer',
          },
        ],
      },
      {
        id: 'ai',
        title: 'AI Knowledge',
        subtitle: 'These 5 questions assess your current AI literacy.',
        questions: [
          {
            field: 'ans_hallucination',
            label: 'AI "hallucination" means:',
            options: ['AI refuses to answer', 'AI states false info as true', 'AI is confused by the prompt', 'AI generates images incorrectly'],
            answer: 'AI states false info as true',
          },
          {
            field: 'ans_best_prompt',
            label: 'Which is the best AI prompt?',
            options: [
              'Help me write something',
              'Write an email',
              'You are a recruiter. Write a 5-sentence follow-up email after a first interview. Tone: warm. End with next steps.',
              'Make an email about interview',
            ],
            answer: 'You are a recruiter. Write a 5-sentence follow-up email after a first interview. Tone: warm. End with next steps.',
          },
          {
            field: 'ans_rtft',
            label: 'RTFT stands for:',
            options: ['Real-Time Fine-Tuning', 'Random Task Format Test', 'Role, Task, Format, Tone', 'Research, Think, Focus, Try'],
            answer: 'Role, Task, Format, Tone',
          },
          {
            field: 'ans_ai_search',
            label: 'Which AI tool provides search results WITH cited sources?',
            options: ['ChatGPT', 'Google Gemini', 'Perplexity AI', 'Claude'],
            answer: 'Perplexity AI',
          },
          {
            field: 'ans_citations',
            label: 'ChatGPT gives you 5 citations. You should:',
            options: ['Trust them all — AI is accurate', 'Verify each one — AI invents fake citations', 'Use them without checking', 'Ignore them'],
            answer: 'Verify each one — AI invents fake citations',
          },
        ],
      },
      {
        id: 'automation',
        title: 'Automation Knowledge',
        subtitle: '2 questions on workflow automation.',
        questions: [
          {
            field: 'ans_zapier',
            label: 'What does Zapier do?',
            options: ['Connects apps and automates tasks without code', 'A CRM for sales teams', 'An AI chatbot', 'A project management tool'],
            answer: 'Connects apps and automates tasks without code',
          },
          {
            field: 'ans_trigger',
            label: 'In Zapier, a Trigger is:',
            options: ['The action that completes the workflow', 'The event that starts the automation', 'A workflow error', 'A type of app connection'],
            answer: 'The event that starts the automation',
          },
        ],
      },
    ],
    extraSections: {
      tools: true,
      automationComfort: true,
      automationTools: true,
    },
  },

  // ══════════════════════════════════════════════════════════
  // AWS Cloud Architect Engineer
  // ══════════════════════════════════════════════════════════
  aws: {
    programLabel: 'AWS Cloud Architect Engineer',
    programIcon: '☁️',
    intro: 'We\'ll assess your foundational cloud and AWS knowledge to place you at the right starting level and personalise your learning path.',
    careerTracks: [
      { id: 'aws_cloud_eng',  label: 'Cloud / DevOps Engineer' },
      { id: 'aws_architect',  label: 'Solutions Architect' },
      { id: 'aws_support',    label: 'Cloud Support Specialist' },
      { id: 'aws_security',   label: 'Cloud Security Specialist' },
      { id: 'aws_devops',     label: 'DevOps / Site Reliability Engineer' },
    ],
    whyJoiningOptions: [
      'New job in cloud / tech', 'Get AWS certified', 'Advance in current IT role',
      'Transition from on-prem to cloud', 'Build cloud skills for my business',
    ],
    quizSections: [
      {
        id: 'cloud_basics',
        title: 'Cloud Fundamentals',
        subtitle: 'These 4 questions assess your cloud computing baseline.',
        questions: [
          {
            field: 'ans_cloud_def',
            label: 'What is the main benefit of cloud computing?',
            options: [
              'It is always free to use',
              'On-demand access to shared computing resources — scale up or down as needed',
              'It replaces the internet',
              'It only works for large enterprises',
            ],
            answer: 'On-demand access to shared computing resources — scale up or down as needed',
          },
          {
            field: 'ans_s3',
            label: 'What is Amazon S3 used for?',
            options: [
              'Running virtual servers',
              'Managing user accounts and permissions',
              'Storing and retrieving any amount of data (files, images, backups)',
              'Monitoring cloud costs',
            ],
            answer: 'Storing and retrieving any amount of data (files, images, backups)',
          },
          {
            field: 'ans_ec2',
            label: 'Amazon EC2 provides:',
            options: [
              'Object storage in the cloud',
              'A managed database service',
              'Resizable virtual servers (compute capacity) in the cloud',
              'A content delivery network',
            ],
            answer: 'Resizable virtual servers (compute capacity) in the cloud',
          },
          {
            field: 'ans_region',
            label: 'An AWS Region is:',
            options: [
              'A single data centre',
              'A geographic area containing multiple isolated data centres (Availability Zones)',
              'A billing account boundary',
              'A type of AWS subscription',
            ],
            answer: 'A geographic area containing multiple isolated data centres (Availability Zones)',
          },
        ],
      },
      {
        id: 'aws_services',
        title: 'AWS Services & Security',
        subtitle: 'These 4 questions assess your AWS services knowledge.',
        questions: [
          {
            field: 'ans_iam',
            label: 'What does AWS IAM manage?',
            options: [
              'Internet access and firewall rules',
              'Identities, users, and permissions — who can access which AWS resources',
              'Virtual private networks',
              'DNS and domain routing',
            ],
            answer: 'Identities, users, and permissions — who can access which AWS resources',
          },
          {
            field: 'ans_vpc',
            label: 'A VPC (Virtual Private Cloud) in AWS is:',
            options: [
              'A type of virtual machine',
              'An isolated private network within AWS where you launch your resources',
              'A backup service for EC2',
              'A content distribution service',
            ],
            answer: 'An isolated private network within AWS where you launch your resources',
          },
          {
            field: 'ans_security_group',
            label: 'A Security Group in AWS acts as:',
            options: [
              'A team of AWS security engineers',
              'A virtual firewall controlling inbound and outbound traffic to EC2 instances',
              'An IAM group for security personnel',
              'A compliance audit service',
            ],
            answer: 'A virtual firewall controlling inbound and outbound traffic to EC2 instances',
          },
          {
            field: 'ans_pay_model',
            label: 'AWS pricing model is primarily:',
            options: [
              'Annual flat fee regardless of use',
              'Per-user monthly subscription',
              'Pay-as-you-go — you only pay for what you use',
              'Free for small businesses',
            ],
            answer: 'Pay-as-you-go — you only pay for what you use',
          },
        ],
      },
    ],
    extraSections: {
      tools: false,
      automationComfort: false,
      automationTools: false,
    },
  },

  // ══════════════════════════════════════════════════════════
  // Cybersecurity Essentials
  // ══════════════════════════════════════════════════════════
  cybersecurity: {
    programLabel: 'Cybersecurity Essentials',
    programIcon: '🔐',
    intro: 'We\'ll assess your security concepts, threat knowledge, and technical baseline to personalise your learning path and career track.',
    careerTracks: [
      { id: 'cyber_soc',      label: 'SOC Analyst / Security Operations' },
      { id: 'cyber_analyst',  label: 'Security Analyst / DFIR' },
      { id: 'cyber_pentest',  label: 'Penetration Tester / Ethical Hacker' },
      { id: 'cyber_grc',      label: 'GRC / Compliance Analyst' },
      { id: 'cyber_cloud',    label: 'Cloud Security Engineer' },
    ],
    whyJoiningOptions: [
      'Get a cybersecurity job', 'Earn a security certification', 'Advance in IT to security',
      'Protect my own business or organisation', 'Career change into security',
    ],
    quizSections: [
      {
        id: 'security_concepts',
        title: 'Security Concepts',
        subtitle: 'These 4 questions assess your foundational security knowledge.',
        questions: [
          {
            field: 'ans_cia',
            label: 'The CIA Triad in cybersecurity stands for:',
            options: [
              'Cybercrime Investigation Agency',
              'Confidentiality, Integrity, Availability',
              'Classified Information Access',
              'Cloud Infrastructure Architecture',
            ],
            answer: 'Confidentiality, Integrity, Availability',
          },
          {
            field: 'ans_phishing_type',
            label: 'Which type of attack tricks users into revealing passwords by pretending to be a trusted source?',
            options: ['SQL Injection', 'Phishing', 'Man-in-the-Middle', 'Ransomware'],
            answer: 'Phishing',
          },
          {
            field: 'ans_encrypt',
            label: 'Asymmetric encryption uses:',
            options: [
              'The same key to encrypt and decrypt',
              'A public key to encrypt and a private key to decrypt',
              'No keys — just algorithms',
              'A password and a PIN',
            ],
            answer: 'A public key to encrypt and a private key to decrypt',
          },
          {
            field: 'ans_firewall',
            label: 'What is the primary function of a firewall?',
            options: [
              'Encrypt all data on a device',
              'Monitor and control incoming and outgoing network traffic based on rules',
              'Scan for viruses on a hard drive',
              'Back up files to the cloud',
            ],
            answer: 'Monitor and control incoming and outgoing network traffic based on rules',
          },
        ],
      },
      {
        id: 'threats_response',
        title: 'Threats & Incident Response',
        subtitle: 'These 4 questions assess your threat and response knowledge.',
        questions: [
          {
            field: 'ans_zero_day',
            label: 'A zero-day vulnerability is:',
            options: [
              'A security flaw that has been fully patched',
              'A flaw unknown to the vendor with no patch available',
              'An attack that takes exactly zero seconds',
              'A vulnerability discovered on day one of a system launch',
            ],
            answer: 'A flaw unknown to the vendor with no patch available',
          },
          {
            field: 'ans_ransomware',
            label: 'Ransomware is malware that:',
            options: [
              'Slows down your computer',
              'Encrypts your files and demands payment for the decryption key',
              'Steals your browser history',
              'Sends spam from your email account',
            ],
            answer: 'Encrypts your files and demands payment for the decryption key',
          },
          {
            field: 'ans_siem',
            label: 'What does a SIEM system do?',
            options: [
              'Sends marketing emails automatically',
              'Collects and analyses security event logs to detect threats in real time',
              'Encrypts sensitive databases',
              'Scans for outdated software',
            ],
            answer: 'Collects and analyses security event logs to detect threats in real time',
          },
          {
            field: 'ans_pentest',
            label: 'Penetration testing is:',
            options: [
              'Installing antivirus software',
              'Monitoring network traffic for anomalies',
              'An authorised simulated cyberattack to find vulnerabilities before attackers do',
              'Writing security policies and procedures',
            ],
            answer: 'An authorised simulated cyberattack to find vulnerabilities before attackers do',
          },
        ],
      },
    ],
    extraSections: {
      tools: false,
      automationComfort: false,
      automationTools: false,
    },
  },

  // ══════════════════════════════════════════════════════════
  // AI / ML Foundations
  // ══════════════════════════════════════════════════════════
  ai_ml: {
    programLabel: 'AI / ML Foundations',
    programIcon: '🧠',
    intro: 'We\'ll assess your machine learning concepts and data fundamentals to place you at the right starting point and personalise your learning track.',
    careerTracks: [
      { id: 'ml_engineer',       label: 'ML / AI Engineer' },
      { id: 'ml_data_scientist', label: 'Data Scientist' },
      { id: 'ml_data_eng',       label: 'Data Engineer' },
      { id: 'ml_ai_pm',          label: 'AI Product Manager' },
      { id: 'ml_analyst',        label: 'AI / ML Research Analyst' },
    ],
    whyJoiningOptions: [
      'Get a data science or ML job', 'Build AI products', 'Transition from data analyst to ML',
      'Apply ML to my current field', 'Start AI/ML research',
    ],
    quizSections: [
      {
        id: 'ml_concepts',
        title: 'Machine Learning Concepts',
        subtitle: 'These 4 questions assess your ML knowledge baseline.',
        questions: [
          {
            field: 'ans_supervised',
            label: 'Supervised learning means:',
            options: [
              'A human watches the model train',
              'Training a model on labelled data — each input has a known correct output',
              'The model learns without any data',
              'Training with unlabelled data only',
            ],
            answer: 'Training a model on labelled data — each input has a known correct output',
          },
          {
            field: 'ans_overfitting',
            label: 'A model that "overfits" to training data will:',
            options: [
              'Perform equally well on all datasets',
              'Perform well on training data but poorly on new, unseen data',
              'Always give 100% accuracy',
              'Refuse to make predictions',
            ],
            answer: 'Perform well on training data but poorly on new, unseen data',
          },
          {
            field: 'ans_nn',
            label: 'A neural network is modelled after:',
            options: [
              'The structure of a computer CPU',
              'The human brain — interconnected nodes (neurons) in layers',
              'A decision tree algorithm',
              'A spreadsheet formula system',
            ],
            answer: 'The human brain — interconnected nodes (neurons) in layers',
          },
          {
            field: 'ans_training',
            label: '"Training a model" means:',
            options: [
              'Buying the model from a vendor',
              'Running the model on a production server',
              'Adjusting the model\'s internal parameters by exposing it to data so it learns patterns',
              'Writing documentation for the model',
            ],
            answer: 'Adjusting the model\'s internal parameters by exposing it to data so it learns patterns',
          },
        ],
      },
      {
        id: 'data_tools',
        title: 'Data & Tools',
        subtitle: 'These 4 questions assess your data and tooling knowledge.',
        questions: [
          {
            field: 'ans_feature',
            label: 'In ML, a "feature" is:',
            options: [
              'A bug in the model',
              'An individual measurable input variable used to make predictions',
              'A special function in Python',
              'A type of neural network layer',
            ],
            answer: 'An individual measurable input variable used to make predictions',
          },
          {
            field: 'ans_python_use',
            label: 'Python is preferred in AI/ML primarily because:',
            options: [
              'It is the fastest programming language',
              'It was invented for AI',
              'It has a rich ecosystem of libraries (NumPy, Pandas, TensorFlow, scikit-learn) and a simple syntax',
              'It runs natively on all hardware',
            ],
            answer: 'It has a rich ecosystem of libraries (NumPy, Pandas, TensorFlow, scikit-learn) and a simple syntax',
          },
          {
            field: 'ans_train_test',
            label: 'Why do we split data into training and test sets?',
            options: [
              'To save storage space',
              'To evaluate how well the model performs on data it has never seen',
              'Because only half of the data is useful',
              'To make training faster',
            ],
            answer: 'To evaluate how well the model performs on data it has never seen',
          },
          {
            field: 'ans_gpu',
            label: 'GPUs are used in AI training because they:',
            options: [
              'Have more memory than CPUs',
              'Can process thousands of operations in parallel — ideal for matrix math in deep learning',
              'Are cheaper than CPUs',
              'Run Python code faster',
            ],
            answer: 'Can process thousands of operations in parallel — ideal for matrix math in deep learning',
          },
        ],
      },
    ],
    extraSections: {
      tools: false,
      automationComfort: false,
      automationTools: false,
    },
  },

  // ══════════════════════════════════════════════════════════
  // Technical Mentorship & Placement
  // ══════════════════════════════════════════════════════════
  mentorship: {
    programLabel: 'Technical Mentorship & Placement',
    programIcon: '🚀',
    intro: 'We\'ll learn about your goals, current skills, and career target so your mentor can build a personalised roadmap for you.',
    careerTracks: [
      { id: 'it',        label: 'IT & AI Support' },
      { id: 'biz',       label: 'Business Operations' },
      { id: 'data',      label: 'Data & Analytics' },
      { id: 'auto',      label: 'Automation & Workflow' },
      { id: 'aws_cloud_eng', label: 'Cloud Engineering' },
      { id: 'cyber_soc', label: 'Cybersecurity' },
      { id: 'ml_engineer', label: 'AI / ML Engineering' },
      { id: 'sector',    label: 'Healthcare / Gov / Edu / Legal' },
      { id: 'marketing', label: 'Marketing & Content' },
    ],
    whyJoiningOptions: [
      'Land my first tech job', 'Transition careers into tech',
      'Get mentored for a specific role', 'Build a portfolio', 'Prepare for certification exams',
    ],
    quizSections: [
      {
        id: 'tech_literacy',
        title: 'Technical Literacy',
        subtitle: '4 questions to understand your current tech baseline.',
        questions: [
          {
            field: 'ans_linkedin',
            label: 'LinkedIn is primarily used for:',
            options: [
              'Online shopping', 'Professional networking and job searching',
              'Social photo sharing', 'Project management',
            ],
            answer: 'Professional networking and job searching',
          },
          {
            field: 'ans_ats',
            label: 'ATS stands for (in job applications):',
            options: [
              'Automated Test Suite', 'Applicant Tracking System',
              'Advanced Tech Skills', 'Annual Training Schedule',
            ],
            answer: 'Applicant Tracking System',
          },
          {
            field: 'ans_portfolio',
            label: 'A tech portfolio is:',
            options: [
              'A financial investment document',
              'A collection of projects and work samples that demonstrate your skills',
              'A list of certifications you\'ve earned',
              'A resume in PDF format',
            ],
            answer: 'A collection of projects and work samples that demonstrate your skills',
          },
          {
            field: 'ans_star',
            label: 'The STAR method is used for:',
            options: [
              'Writing code efficiently',
              'Structuring answers to behavioural interview questions (Situation, Task, Action, Result)',
              'Rating job applicants',
              'Organising a portfolio',
            ],
            answer: 'Structuring answers to behavioural interview questions (Situation, Task, Action, Result)',
          },
        ],
      },
      {
        id: 'career_awareness',
        title: 'Career & Industry Awareness',
        subtitle: '4 questions on your career readiness knowledge.',
        questions: [
          {
            field: 'ans_networking',
            label: '"Networking" in a career context means:',
            options: [
              'Setting up computer networks',
              'Building professional relationships that can support your career growth',
              'Using LinkedIn only',
              'Cold emailing companies',
            ],
            answer: 'Building professional relationships that can support your career growth',
          },
          {
            field: 'ans_cover_letter',
            label: 'The main purpose of a cover letter is to:',
            options: [
              'List your work history', 'Explain why you are the right fit for this specific role and company',
              'Summarise your education', 'Provide references',
            ],
            answer: 'Explain why you are the right fit for this specific role and company',
          },
          {
            field: 'ans_salary_neg',
            label: 'When is the best time to negotiate salary?',
            options: [
              'Before applying', 'During the first interview',
              'After you receive a job offer', 'On your first day of work',
            ],
            answer: 'After you receive a job offer',
          },
          {
            field: 'ans_github',
            label: 'GitHub is used to:',
            options: [
              'Send professional emails',
              'Store, share, and collaborate on code — and showcase your projects publicly',
              'Build websites visually without code',
              'Manage project tasks and deadlines',
            ],
            answer: 'Store, share, and collaborate on code — and showcase your projects publicly',
          },
        ],
      },
    ],
    extraSections: {
      tools: false,
      automationComfort: false,
      automationTools: false,
    },
  },
}
