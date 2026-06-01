-- ═══════════════════════════════════════════════════════════════
-- ZICT LMS — Scheduled Notifications & Reminders
-- Run this entire file in Supabase → SQL Editor
-- Requires: Supabase Pro plan (for pg_cron)
-- ═══════════════════════════════════════════════════════════════

-- Step 1: Enable the pg_cron extension (only needed once)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- ───────────────────────────────────────────────────────────────
-- SCHEDULE 1: Daily Inactive Student Reminders
-- Fires every day at 9:00 AM UTC
-- Finds students who haven't submitted in 3+ days → inserts in-app reminder
-- ───────────────────────────────────────────────────────────────
SELECT cron.schedule(
  'zict-inactive-student-reminders',   -- job name (unique)
  '0 9 * * *',                          -- cron: every day at 09:00 UTC
  $$
  WITH inactive AS (
    SELECT p.id, p.full_name
    FROM profiles p
    WHERE p.role = 'student'
      AND p.id NOT IN (
        SELECT DISTINCT user_id
        FROM progress
        WHERE completed = true
          AND completed_at >= NOW() - INTERVAL '3 days'
      )
  ),
  never_submitted AS (
    SELECT id FROM profiles WHERE role = 'student'
    AND id NOT IN (SELECT DISTINCT user_id FROM progress WHERE completed = true)
  )
  INSERT INTO notifications (user_id, title, body, type, link)
  SELECT
    i.id,
    CASE WHEN ns.id IS NOT NULL
      THEN 'Let''s get started! 🚀'
      ELSE 'It''s been 3+ days — keep your streak going!'
    END,
    CASE WHEN ns.id IS NOT NULL
      THEN 'You haven''t submitted a lab yet. Open Week 1 and complete your first lab today!'
      ELSE 'You haven''t submitted a lab in 3+ days. Log in and keep going — your next week is waiting!'
    END,
    'warning',
    '/program'
  FROM inactive i
  LEFT JOIN never_submitted ns ON ns.id = i.id
  -- Don't spam: only send if no reminder was sent in the last 24 hours
  WHERE i.id NOT IN (
    SELECT user_id FROM notifications
    WHERE type = 'warning'
      AND link = '/program'
      AND created_at >= NOW() - INTERVAL '24 hours'
  );
  $$
);

-- ───────────────────────────────────────────────────────────────
-- SCHEDULE 2: Daily Grade Queue Alert for Instructors
-- Fires every day at 8:00 AM UTC
-- If 5+ labs are pending grade, notifies all admin/instructor accounts
-- ───────────────────────────────────────────────────────────────
SELECT cron.schedule(
  'zict-grade-queue-alert',
  '0 8 * * *',
  $$
  DO $$
  DECLARE
    pending_count INT;
  BEGIN
    SELECT COUNT(*) INTO pending_count
    FROM progress WHERE grade = 'pending';

    IF pending_count >= 5 THEN
      INSERT INTO notifications (user_id, title, body, type, link)
      SELECT
        id,
        '📋 Grade queue: ' || pending_count || ' labs awaiting review',
        pending_count || ' student lab submissions are waiting to be graded. Open the Grading Dashboard to review.',
        'alert',
        '/admin/grading'
      FROM profiles
      WHERE role IN ('admin', 'instructor')
        AND id NOT IN (
          SELECT user_id FROM notifications
          WHERE link = '/admin/grading'
            AND created_at >= NOW() - INTERVAL '24 hours'
        );
    END IF;
  END $$;
  $$
);

-- ───────────────────────────────────────────────────────────────
-- SCHEDULE 3: Weekly Progress Digest — Every Monday 7:00 AM UTC
-- Sends each student a personalised progress summary
-- ───────────────────────────────────────────────────────────────
SELECT cron.schedule(
  'zict-weekly-digest',
  '0 7 * * 1',  -- every Monday at 07:00 UTC
  $$
  WITH student_stats AS (
    SELECT
      p.id,
      p.full_name,
      COUNT(CASE WHEN pr.completed = true THEN 1 END) AS labs_done,
      COUNT(CASE WHEN pr.grade = 'pass'   THEN 1 END) AS labs_passed,
      COUNT(CASE WHEN pr.grade = 'pending' THEN 1 END) AS labs_pending,
      COUNT(CASE WHEN pr.grade = 'fail'   THEN 1 END) AS labs_failed
    FROM profiles p
    LEFT JOIN progress pr ON pr.user_id = p.id
    WHERE p.role = 'student'
    GROUP BY p.id, p.full_name
  )
  INSERT INTO notifications (user_id, title, body, type, link)
  SELECT
    id,
    'Weekly Update — ' || TO_CHAR(NOW(), 'Day, Mon DD'),
    SPLIT_PART(full_name, ' ', 1) || ', you''ve completed ' || labs_done || ' labs'
      || CASE WHEN labs_passed > 0 THEN ' (' || labs_passed || ' passed' ELSE '' END
      || CASE WHEN labs_pending > 0 THEN ', ' || labs_pending || ' awaiting grade' ELSE '' END
      || CASE WHEN labs_passed > 0 THEN ')' ELSE '' END
      || '. '
      || CASE
           WHEN labs_done = 0 THEN 'Start your first lab this week — your program is waiting!'
           WHEN labs_done < 5  THEN 'You''re building momentum. Keep it up!'
           WHEN labs_done < 15 THEN 'Solid progress — stay consistent and you''ll finish strong.'
           ELSE 'Outstanding work this program. You''re one of our top students!'
         END,
    'info',
    '/dashboard'
  FROM student_stats;
  $$
);

-- ───────────────────────────────────────────────────────────────
-- TRIGGER: Instant Week-Unlock Notification
-- Fires on every INSERT into the progress table
-- If the new submission crosses the unlock threshold for the next week,
-- sends an immediate "Week X is now unlocked!" notification
-- ───────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION notify_week_unlock()
RETURNS TRIGGER AS $$
DECLARE
  completed_in_week INT;
  next_week_num     INT;
  unlock_threshold  INT;
  week_title        TEXT;
  already_notified  BOOLEAN;
BEGIN
  -- Only fire when a lab is marked complete
  IF NEW.completed = true THEN
    next_week_num    := NEW.week_num + 1;
    unlock_threshold := 3;  -- adjust to match your programData.js unlocksAt.minLabs

    -- Count completed labs in the current week for this student
    SELECT COUNT(*) INTO completed_in_week
    FROM progress
    WHERE user_id = NEW.user_id
      AND week_num = NEW.week_num
      AND completed = true;

    -- Check if this submission crosses the threshold
    IF completed_in_week >= unlock_threshold THEN
      -- Check we haven't already sent this exact unlock notification
      SELECT EXISTS (
        SELECT 1 FROM notifications
        WHERE user_id = NEW.user_id
          AND title LIKE '%Week ' || next_week_num || '%unlocked%'
      ) INTO already_notified;

      IF NOT already_notified THEN
        INSERT INTO notifications (user_id, title, body, type, link)
        VALUES (
          NEW.user_id,
          '🔓 Week ' || next_week_num || ' is now unlocked!',
          'You''ve completed enough labs in Week ' || NEW.week_num || ' to unlock the next week. Head to your Program page to continue.',
          'success',
          '/program/week/' || next_week_num
        );
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach the trigger to the progress table
DROP TRIGGER IF EXISTS trigger_week_unlock ON progress;
CREATE TRIGGER trigger_week_unlock
  AFTER INSERT OR UPDATE ON progress
  FOR EACH ROW EXECUTE FUNCTION notify_week_unlock();

-- ───────────────────────────────────────────────────────────────
-- VERIFY: List all scheduled jobs
-- ───────────────────────────────────────────────────────────────
-- SELECT jobname, schedule, active FROM cron.job;

-- ───────────────────────────────────────────────────────────────
-- TO PAUSE A JOB (without deleting it):
-- SELECT cron.unschedule('zict-inactive-student-reminders');
--
-- TO DELETE A JOB:
-- SELECT cron.unschedule('zict-grade-queue-alert');
-- ───────────────────────────────────────────────────────────────
