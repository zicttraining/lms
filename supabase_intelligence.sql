-- ════════════════════════════════════════════════════════════
-- ZICT LMS — Intelligence Layer (Scoring + Survey + Skill Level)
-- Run AFTER supabase_assessments.sql
-- ════════════════════════════════════════════════════════════

-- ── Extend profiles with intelligence fields ─────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS skill_level TEXT DEFAULT 'beginner'
    CHECK (skill_level IN ('beginner','intermediate','advanced')),
  ADD COLUMN IF NOT EXISTS survey_completed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS survey_score INTEGER DEFAULT 0,   -- 0–100: % correct on intake MCQs
  ADD COLUMN IF NOT EXISTS career_goals TEXT,                -- why joining / what they want
  ADD COLUMN IF NOT EXISTS study_hours TEXT,                 -- hours per week outside class
  ADD COLUMN IF NOT EXISTS learning_style TEXT;              -- how they learn best

-- ── Extend assessments with scoring ──────────────────────────
ALTER TABLE public.assessments
  ADD COLUMN IF NOT EXISTS max_score INTEGER DEFAULT 100,     -- each assessment worth max_score points
  ADD COLUMN IF NOT EXISTS min_skill_level TEXT DEFAULT 'beginner'
    CHECK (min_skill_level IN ('beginner','intermediate','advanced'));
    -- students below this level won't see the assessment until they level up

-- ── Extend assessment_submissions with numerical score ────────
ALTER TABLE public.assessment_submissions
  ADD COLUMN IF NOT EXISTS score INTEGER,   -- 0–max_score; pass threshold = 70%
  ADD COLUMN IF NOT EXISTS milestone_sent BOOLEAN DEFAULT FALSE; -- prevent duplicate congrats

-- ── SURVEY RESPONSES ─────────────────────────────────────────
-- Full intake survey data, linked to profile
CREATE TABLE IF NOT EXISTS public.survey_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  -- Identity
  preferred_language TEXT,
  career_track_goal TEXT,      -- raw answer (maps to career_track id after processing)
  why_joining TEXT,
  employment_status TEXT,
  -- Cybersecurity quiz answers (4 questions, 1 pt each)
  ans_mfa TEXT,
  ans_phishing TEXT,
  ans_wifi TEXT,
  ans_gdrive TEXT,
  cyber_score INTEGER DEFAULT 0,  -- 0–4
  -- Workplace tools (confidence 1-5, not MCQ)
  google_confidence INTEGER,
  ms365_confidence INTEGER,
  tools_used TEXT[],
  -- AI literacy quiz (5 questions, 1 pt each)
  ans_hallucination TEXT,
  ans_best_prompt TEXT,
  ans_rtft TEXT,
  ans_ai_search TEXT,
  ans_citations TEXT,
  ai_quiz_score INTEGER DEFAULT 0,  -- 0–5
  -- AI usage
  ai_frequency TEXT,
  self_skill_level TEXT,            -- self-reported
  target_industries TEXT[],
  -- Automation
  ans_zapier TEXT,
  ans_trigger TEXT,
  automation_comfort INTEGER,
  automation_tools TEXT[],
  -- Career readiness
  resume_status TEXT,
  interview_confidence INTEGER,
  linkedin_use TEXT,
  cert_goals TEXT[],
  career_challenge TEXT,
  -- Learning style
  learning_style TEXT,
  study_hours TEXT,
  -- Computed
  total_quiz_score INTEGER DEFAULT 0,  -- cyber + ai = 0–9
  computed_skill_level TEXT,           -- what quiz says vs self-report
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own survey" ON public.survey_responses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admin survey" ON public.survey_responses FOR SELECT
  USING (EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','instructor')));

-- ── Update min_skill_level on existing pre-built assessments ─
-- General beginner assessments
UPDATE public.assessments SET min_skill_level = 'beginner' WHERE specialization IS NULL;

-- Track assessments — set intermediate level
UPDATE public.assessments SET min_skill_level = 'intermediate'
  WHERE specialization IS NOT NULL AND title IN (
    'Zapier IT Automation Workflow',
    'End-to-End Automation Workflow Project',
    'AI & Compliance Research Brief',
    'Market Intelligence Report with AI'
  );

UPDATE public.assessments SET min_skill_level = 'advanced'
  WHERE title = 'End-to-End Automation Workflow Project';

-- ── Helper function: compute skill level from quiz score ──────
-- 0–3 correct  → beginner
-- 4–6 correct  → intermediate
-- 7–9 correct  → advanced
CREATE OR REPLACE FUNCTION compute_skill_level(quiz_total INTEGER)
RETURNS TEXT AS $$
BEGIN
  IF quiz_total >= 7 THEN RETURN 'advanced';
  ELSIF quiz_total >= 4 THEN RETURN 'intermediate';
  ELSE RETURN 'beginner';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ── Assessment score milestone notification trigger ───────────
CREATE OR REPLACE FUNCTION notify_assessment_milestone()
RETURNS TRIGGER AS $$
DECLARE
  total_score INTEGER;
  student_name TEXT;
  milestone INTEGER;
BEGIN
  IF NEW.grade = 'pass' AND OLD.grade <> 'pass' AND NOT NEW.milestone_sent THEN
    SELECT COALESCE(SUM(score), 0) INTO total_score
    FROM assessment_submissions
    WHERE user_id = NEW.user_id AND grade = 'pass';

    SELECT full_name INTO student_name FROM profiles WHERE id = NEW.user_id;

    -- Milestone bands
    milestone := CASE
      WHEN total_score >= 500 THEN 500
      WHEN total_score >= 250 THEN 250
      WHEN total_score >= 100 THEN 100
      WHEN total_score >= 50  THEN 50
      ELSE 0
    END;

    IF milestone > 0 THEN
      -- Check not already sent for this milestone
      IF NOT EXISTS (
        SELECT 1 FROM notifications
        WHERE user_id = NEW.user_id
          AND title LIKE '%' || milestone || ' points%'
      ) THEN
        INSERT INTO notifications (user_id, title, body, type, link) VALUES (
          NEW.user_id,
          '🏆 ' || milestone || ' Assessment Points Reached!',
          'Congratulations! You''ve earned ' || total_score || ' total assessment points. '
            || CASE milestone
                 WHEN 50  THEN 'Great start — you''re building real skills.'
                 WHEN 100 THEN 'You''re proving your skills with applied work. Keep going!'
                 WHEN 250 THEN 'Practitioner level unlocked! Mid-level roles are within reach.'
                 WHEN 500 THEN 'Expert level! You are in the top tier of this program.'
               END,
          'success',
          '/assessments'
        );
      END IF;
    END IF;

    -- Mark milestone notification sent
    UPDATE assessment_submissions SET milestone_sent = TRUE WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_assessment_milestone ON assessment_submissions;
CREATE TRIGGER trigger_assessment_milestone
  AFTER UPDATE ON assessment_submissions
  FOR EACH ROW EXECUTE FUNCTION notify_assessment_milestone();
