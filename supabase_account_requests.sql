-- ════════════════════════════════════════════════════════════
-- ZICT LMS — Self-Registration + Account Approval Flow
-- Run in Supabase → SQL Editor
-- ════════════════════════════════════════════════════════════

-- ── Account requests (self-registration queue) ────────────────
CREATE TABLE IF NOT EXISTS public.account_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  program TEXT NOT NULL DEFAULT 'applied_ai',
  preferred_language TEXT DEFAULT 'en',
  why_joining TEXT,
  career_interest TEXT,
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending','approved','rejected')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.account_requests ENABLE ROW LEVEL SECURITY;
-- Anyone (unauthenticated) can submit a request
CREATE POLICY "Public can submit requests" ON public.account_requests
  FOR INSERT WITH CHECK (true);
-- Only admins/instructors can read and update
CREATE POLICY "Admin view requests" ON public.account_requests
  FOR SELECT USING (
    EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','instructor'))
  );
CREATE POLICY "Admin update requests" ON public.account_requests
  FOR UPDATE USING (
    EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','instructor'))
  );

-- ── Add step_responses to progress for guided submissions ─────
-- Stores per-step text + screenshot as JSONB
ALTER TABLE public.progress
  ADD COLUMN IF NOT EXISTS step_responses JSONB;
-- [{num:1, action:"...", response:"...", screenshot_url:"...", screenshot_name:"..."}]

-- ── Realtime for account requests ─────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE public.account_requests;
