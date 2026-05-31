import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://YOUR_PROJECT.supabase.co',
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY'
)

/* ═══════════════════════════════════════════════════════════
   FULL SUPABASE SQL SCHEMA — paste into SQL Editor and Run
═══════════════════════════════════════════════════════════

-- ── PROFILES ──────────────────────────────────────────────
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student','admin','instructor')),
  career_track TEXT,
  cohort TEXT DEFAULT 'Cohort 1',
  language TEXT DEFAULT 'en' CHECK (language IN ('en','ar','fa')),
  avatar_url TEXT,
  phone TEXT,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen TIMESTAMPTZ,
  timezone TEXT DEFAULT 'America/Denver'
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own profile" ON public.profiles FOR ALL USING (auth.uid()=id);
CREATE POLICY "Admin all profiles" ON public.profiles FOR SELECT
  USING (EXISTS(SELECT 1 FROM public.profiles WHERE id=auth.uid() AND role IN ('admin','instructor')));
CREATE POLICY "Admin update profiles" ON public.profiles FOR UPDATE
  USING (EXISTS(SELECT 1 FROM public.profiles WHERE id=auth.uid() AND role IN ('admin','instructor')));

-- ── SESSIONS (class sessions) ─────────────────────────────
CREATE TABLE public.class_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  week_num INTEGER NOT NULL,
  day_label TEXT NOT NULL,
  title TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ,
  zoom_link TEXT,
  recording_url TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id)
);
ALTER TABLE public.class_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "All read sessions" ON public.class_sessions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin manage sessions" ON public.class_sessions FOR ALL
  USING (EXISTS(SELECT 1 FROM public.profiles WHERE id=auth.uid() AND role IN ('admin','instructor')));

-- ── ATTENDANCE ────────────────────────────────────────────
CREATE TABLE public.attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.class_sessions(id) ON DELETE CASCADE,
  checked_in_at TIMESTAMPTZ DEFAULT NOW(),
  check_in_method TEXT DEFAULT 'manual' CHECK (check_in_method IN ('manual','auto','instructor')),
  UNIQUE(user_id, session_id)
);
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own attendance" ON public.attendance FOR ALL USING (auth.uid()=user_id);
CREATE POLICY "Admin attendance" ON public.attendance FOR ALL
  USING (EXISTS(SELECT 1 FROM public.profiles WHERE id=auth.uid() AND role IN ('admin','instructor')));

-- ── TIME TRACKING ─────────────────────────────────────────
CREATE TABLE public.time_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_start TIMESTAMPTZ DEFAULT NOW(),
  session_end TIMESTAMPTZ,
  page_context TEXT,
  duration_seconds INTEGER
);
ALTER TABLE public.time_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own time" ON public.time_tracking FOR ALL USING (auth.uid()=user_id);
CREATE POLICY "Admin time" ON public.time_tracking FOR SELECT
  USING (EXISTS(SELECT 1 FROM public.profiles WHERE id=auth.uid() AND role IN ('admin','instructor')));

-- ── PROGRESS (lab completion) ─────────────────────────────
CREATE TABLE public.progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  week_num INTEGER NOT NULL CHECK (week_num BETWEEN 1 AND 8),
  lab_num INTEGER NOT NULL CHECK (lab_num BETWEEN 1 AND 7),
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  submission_url TEXT,
  submission_text TEXT,
  submission_type TEXT CHECK (submission_type IN ('text','file','url','google_doc')),
  grade TEXT CHECK (grade IN ('pass','fail','pending','not_submitted')),
  grade_notes TEXT,
  graded_by UUID REFERENCES auth.users(id),
  graded_at TIMESTAMPTZ,
  UNIQUE(user_id, week_num, lab_num)
);
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own progress" ON public.progress FOR ALL USING (auth.uid()=user_id);
CREATE POLICY "Admin progress" ON public.progress FOR ALL
  USING (EXISTS(SELECT 1 FROM public.profiles WHERE id=auth.uid() AND role IN ('admin','instructor')));

-- ── QUIZ RESULTS ──────────────────────────────────────────
CREATE TABLE public.quiz_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  week_num INTEGER NOT NULL,
  session_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  answers JSONB,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own quizzes" ON public.quiz_results FOR ALL USING (auth.uid()=user_id);
CREATE POLICY "Admin quizzes" ON public.quiz_results FOR SELECT
  USING (EXISTS(SELECT 1 FROM public.profiles WHERE id=auth.uid() AND role IN ('admin','instructor')));

-- ── NOTIFICATIONS ─────────────────────────────────────────
CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info','success','warning','alert','grade','message')),
  read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own notifications" ON public.notifications FOR ALL USING (auth.uid()=user_id);
CREATE POLICY "Admin send notifications" ON public.notifications FOR INSERT
  WITH CHECK (EXISTS(SELECT 1 FROM public.profiles WHERE id=auth.uid() AND role IN ('admin','instructor')));

-- ── MESSAGES (support + instructor chat) ─────────────────
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  to_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  thread_id UUID,
  subject TEXT,
  body TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own messages" ON public.messages FOR ALL
  USING (auth.uid()=from_id OR auth.uid()=to_id);

-- ── FILE UPLOADS ──────────────────────────────────────────
CREATE TABLE public.file_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  week_num INTEGER,
  lab_num INTEGER,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.file_uploads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own files" ON public.file_uploads FOR ALL USING (auth.uid()=user_id);
CREATE POLICY "Admin files" ON public.file_uploads FOR SELECT
  USING (EXISTS(SELECT 1 FROM public.profiles WHERE id=auth.uid() AND role IN ('admin','instructor')));

-- ── CAREER: JOB TRACKER ───────────────────────────────────
CREATE TABLE public.job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  title TEXT NOT NULL,
  location TEXT,
  salary_range TEXT,
  status TEXT DEFAULT 'saved' CHECK (status IN ('saved','applied','phone_screen','interview','offer','rejected','withdrawn')),
  applied_date DATE,
  job_url TEXT,
  contact_name TEXT,
  contact_email TEXT,
  notes TEXT,
  ai_match_score INTEGER,
  resume_version TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own jobs" ON public.job_applications FOR ALL USING (auth.uid()=user_id);

-- ── CAREER: RESUMES ───────────────────────────────────────
CREATE TABLE public.resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  version_name TEXT NOT NULL,
  content JSONB NOT NULL,
  ats_score INTEGER,
  target_role TEXT,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own resumes" ON public.resumes FOR ALL USING (auth.uid()=user_id);

-- ── CAREER: WEEKLY GOALS ──────────────────────────────────
CREATE TABLE public.weekly_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  week_of DATE NOT NULL,
  linkedin_posts INTEGER DEFAULT 0,
  applications_target INTEGER DEFAULT 5,
  applications_done INTEGER DEFAULT 0,
  networking_contacts INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  notes TEXT,
  UNIQUE(user_id, week_of)
);
ALTER TABLE public.weekly_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own goals" ON public.weekly_goals FOR ALL USING (auth.uid()=user_id);

-- ── STORAGE BUCKET ────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public) VALUES ('submissions', 'submissions', false);
CREATE POLICY "Upload own files" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id='submissions' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Read own files" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id='submissions' AND (auth.uid()::text = (storage.foldername(name))[1]
    OR EXISTS(SELECT 1 FROM public.profiles WHERE id=auth.uid() AND role IN ('admin','instructor'))));

-- ── AUTO PROFILE ON SIGNUP ────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles(id,full_name,email,role)
  VALUES(NEW.id,COALESCE(NEW.raw_user_meta_data->>'full_name','Student'),NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role','student'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── REALTIME ──────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.progress;

*/
