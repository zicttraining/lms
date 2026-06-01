-- ─────────────────────────────────────────────────────────────────
-- ZICT LMS — Migration: Add program column to profiles
--
-- Run this in Supabase → SQL Editor
-- ─────────────────────────────────────────────────────────────────

-- 1. Add the program column (defaults to 'applied_ai' for existing students)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS program TEXT NOT NULL DEFAULT 'applied_ai';

-- 2. Valid programs check (optional but recommended)
ALTER TABLE profiles
  ADD CONSTRAINT profiles_program_check
  CHECK (program IN ('applied_ai', 'aws', 'cybersecurity', 'ai_ml', 'mentorship'));

-- 3. If you have existing students and want to confirm they're all on applied_ai:
-- UPDATE profiles SET program = 'applied_ai' WHERE role = 'student' AND program IS NULL;

-- ─────────────────────────────────────────────────────────────────
-- To change a specific student's program manually:
-- UPDATE profiles SET program = 'aws' WHERE email = 'student@example.com';
-- ─────────────────────────────────────────────────────────────────
