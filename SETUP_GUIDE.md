# ZICT LMS v2.0 — Full Setup Guide
## Deploy in 25 Minutes

---

## WHAT THIS APP INCLUDES

### Phase 1 — Core LMS
- ✅ Secure student login (email + password, no self-registration)
- ✅ Week unlock system (locked until prior week labs complete)
- ✅ Lab checkboxes with file/text/Google Doc submissions
- ✅ In-app grading by instructor (pass/fail + notes)
- ✅ Real-time notifications (grade received, announcements)
- ✅ Student-to-instructor messaging + support tab
- ✅ Attendance tracking per class session
- ✅ Time-in-portal tracking per student
- ✅ ZICT brand colors (orange/yellow/green)
- ✅ Translation: English 🇺🇸 / Arabic 🇸🇦 / Persian 🇮🇷

### Phase 2 — Content & Learning
- ✅ Step-by-step lab instructions built into every lab page
- ✅ Video embed support (YouTube unlisted + Loom + direct upload)
- ✅ Session viewer per week (all instructor-led sessions listed)
- ✅ Progress dashboard with charts

### Phase 3 — Career Development
- ✅ Job Tracker (Kanban + list view, full pipeline)
- ✅ Resume Builder with ATS scoring
- ✅ LinkedIn Tools (checklist, About structure, 5 post templates)
- ✅ Career research hub with Perplexity AI prompt integration
- ✅ 10 industry-specific job boards
- ✅ Weekly career goals tracker

---

## STEP 1 — Create Supabase Database (10 min)

1. Go to **supabase.com** → click "Start your project"
2. Click **"New project"** → name it `zict-lms`
3. Set a strong database password (save it!)
4. Region: **US East (N. Virginia)** — closest to Denver
5. Wait ~2 minutes for project to initialize

**Run the SQL schema:**
1. In Supabase left sidebar → **SQL Editor** → **"New query"**
2. Open `src/lib/supabase.js` in this folder
3. Copy everything between the `/*` and `*/` comment block (lines ~18–130)
4. Paste into SQL Editor → click **"Run"**
5. You should see: "Success. No rows returned"

---

## STEP 2 — Get Your Keys (2 min)

1. Supabase → **Settings** → **API**
2. Copy:
   - **Project URL**: `https://xxxxxxxxxx.supabase.co`
   - **anon public key**: `eyJhbGci...` (long string)

---

## STEP 3 — Configure Environment (1 min)

Create a file named `.env` in the `zict-lms` folder:

```
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJYOUR_ANON_KEY_HERE
```

---

## STEP 4 — Deploy to Netlify (5 min)

### Option A — Drag and Drop (Fastest)
1. Run `npm run build` in the `zict-lms` folder
2. Go to **netlify.com** → sign up free → "Add new site" → "Deploy manually"
3. Drag the **`dist`** folder into Netlify
4. You get a URL like `https://zict-portal-abc123.netlify.app`

### Option B — GitHub (Best for updates)
1. Push `zict-lms` folder to a GitHub repo
2. Netlify → "Add new site" → "Import from Git" → connect repo
3. Build command: `npm run build` | Publish directory: `dist`

**After deploying — add environment variables in Netlify:**
1. Site settings → Environment variables → Add:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key
2. Trigger a redeploy

---

## STEP 5 — Create Admin Account (5 min)

1. Go to your deployed URL → you see the ZICT login screen
2. In Supabase → **Authentication** → **Users** → **"Invite user"**
3. Enter YOUR email → click Send invitation
4. Check email → click the magic link → set your password
5. Sign in to portal

**Make yourself admin:**
1. Supabase → **Table Editor** → `profiles` table
2. Find your row → click `role` cell → change `student` → `admin`
3. Sign out → sign back in → "Admin Dashboard" now appears

---

## STEP 6 — Add Students (2 min each)

**From Admin Dashboard → Students tab → Add Student:**
- Enter full name, email, temporary password
- Click "Create Account"
- Share credentials with student via email or text

Students sign in at your Netlify URL. They pick their language (EN/AR/FA) on the login screen or in settings.

---

## HOW TO ADD VIDEOS TO A LAB

Each lab has a "Watch Video" tab that appears automatically when a video URL exists.

**To add a video to a lab:**
1. Supabase → **Table Editor** → `class_sessions` table
2. Add a row: `week_num`, `day_label`, `title`, `recording_url`
3. For `recording_url`, paste:
   - YouTube: `https://www.youtube.com/watch?v=VIDEO_ID` (unlisted recommended)
   - Loom: `https://www.loom.com/share/SHARE_ID`
   - Direct video: any `.mp4` URL

The video tab appears automatically for students when viewing that lab's week.

---

## UNLOCK RULES

| Week | Requires |
|------|----------|
| Week 1 | Always open |
| Week 2 | 5+ labs in Week 1 |
| Week 3 | 5+ labs in Week 2 |
| Weeks 4–8 | 6+ labs in previous week |

**Certificates unlock automatically:**
| Certificate | Requirements |
|-------------|--------------|
| Level 1 — Digital Readiness | Week 1 ≥5 labs + Week 2 ≥5 labs |
| Level 2 — AI Productivity | Level 1 + Weeks 3,4,5 ≥6 each |
| Level 3 — AI Automation | Level 2 + Weeks 6,7,8 ≥6 each |

---

## GRADING WORKFLOW

1. Student submits a lab → instructor receives in-portal notification
2. Admin Dashboard → Grading → queue shows all pending submissions
3. Click "Grade" → view submission (file/link/text) → Pass or Needs Revision
4. Add instructor notes → click Pass/Revise
5. Student immediately receives in-portal notification with grade + notes

---

## TRANSLATION

Students and admins can switch language from:
- The **login screen** (English / Arabic / Farsi buttons)
- The **top navigation bar** (language dropdown)

Arabic and Persian/Farsi automatically enable **RTL (right-to-left)** layout.

---

## CUSTOM DOMAIN

1. Netlify → Domain settings → "Add custom domain"
2. Enter: `portal.zicloudtech.com` (or your domain)
3. Add a CNAME in your DNS: `portal` → your Netlify URL
4. Netlify handles SSL automatically (free)

---

## SUPPORT

Email: admissions@zicloudtech.com
Supabase docs: supabase.com/docs
Netlify docs: docs.netlify.com

---
*ZICT LMS v2.0 — Full 3-Phase Build*
*Applied AI & Digital Productivity Professional Certificate Program*
*Zicloud Technology Inc. · Denver, CO*
