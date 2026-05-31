import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      // Nav
      dashboard: 'Dashboard', program: 'Program', career: 'Career Center',
      messages: 'Messages', notifications: 'Notifications', admin: 'Admin',
      signOut: 'Sign Out', settings: 'Settings', support: 'Support',
      // Auth
      welcomeBack: 'Welcome Back', signIn: 'Sign In', email: 'Email address',
      password: 'Password', signingIn: 'Signing in…', noAccess: "Don't have access?",
      contactInstructor: 'Contact your instructor',
      // Dashboard
      goodMorning: 'Good morning', goodAfternoon: 'Good afternoon', goodEvening: 'Good evening',
      overallProgress: 'Overall Progress', labsComplete: 'labs complete',
      weeksComplete: 'weeks complete', certsEarned: 'Certificates Earned',
      nextCert: 'Next Certificate', timeInPortal: 'Time in Portal',
      attendanceRate: 'Attendance Rate', weeklyGoal: 'Weekly Goal',
      // Program
      week: 'Week', sessions: 'sessions', labs: 'labs',
      locked: 'Locked', unlocked: 'Unlocked', complete: 'Complete',
      stepByStep: 'Step-by-step guide', submitLab: 'Submit Lab',
      markComplete: 'Mark Complete', viewVideo: 'Watch Video',
      // Submissions
      submitWork: 'Submit Your Work', uploadFile: 'Upload File',
      pasteLink: 'Paste Google Doc / Link', writeText: 'Write Submission',
      submitted: 'Submitted', pending: 'Pending Review',
      passed: 'Passed', failed: 'Needs Revision',
      // Attendance
      checkIn: 'Check In', checkedIn: 'Checked In', attendance: 'Attendance',
      present: 'Present', absent: 'Absent', rate: 'Rate',
      // Notifications
      noNotifications: 'No notifications yet',
      markAllRead: 'Mark all read',
      // Messages
      newMessage: 'New Message', send: 'Send', reply: 'Reply',
      to: 'To', subject: 'Subject', message: 'Message',
      inbox: 'Inbox', sent: 'Sent', support: 'Support',
      // Career
      careerCenter: 'Career Center', jobTracker: 'Job Tracker',
      resumeBuilder: 'Resume Builder', linkedinTools: 'LinkedIn Tools',
      weeklyGoals: 'Weekly Goals', networking: 'Networking',
      addJob: 'Add Application', company: 'Company', jobTitle: 'Job Title',
      status: 'Status', applied: 'Applied', interview: 'Interview',
      offer: 'Offer', rejected: 'Rejected', saved: 'Saved',
      atsScore: 'ATS Score', resumeVersion: 'Resume Version',
      // Certs
      level1Cert: 'Digital Readiness & Workplace Technology Certificate',
      level2Cert: 'AI Productivity & Workplace Applications Certificate',
      level3Cert: 'AI Automation & Digital Operations Certificate',
      fullCert: 'ZICT Professional Certificate in Applied AI & Digital Productivity',
    }
  },
  ar: {
    translation: {
      // Nav
      dashboard: 'لوحة التحكم', program: 'البرنامج', career: 'مركز المهن',
      messages: 'الرسائل', notifications: 'الإشعارات', admin: 'الإدارة',
      signOut: 'تسجيل الخروج', settings: 'الإعدادات', support: 'الدعم',
      // Auth
      welcomeBack: 'مرحباً بعودتك', signIn: 'تسجيل الدخول',
      email: 'البريد الإلكتروني', password: 'كلمة المرور',
      signingIn: 'جاري تسجيل الدخول…', noAccess: 'لا تملك وصولاً؟',
      contactInstructor: 'تواصل مع مدرسك',
      // Dashboard
      goodMorning: 'صباح الخير', goodAfternoon: 'مساء الخير', goodEvening: 'مساء النور',
      overallProgress: 'التقدم الإجمالي', labsComplete: 'مختبر مكتمل',
      weeksComplete: 'أسابيع مكتملة', certsEarned: 'الشهادات المكتسبة',
      nextCert: 'الشهادة التالية', timeInPortal: 'الوقت في البوابة',
      attendanceRate: 'معدل الحضور', weeklyGoal: 'الهدف الأسبوعي',
      // Program
      week: 'الأسبوع', sessions: 'جلسات', labs: 'مختبرات',
      locked: 'مغلق', unlocked: 'مفتوح', complete: 'مكتمل',
      stepByStep: 'الدليل خطوة بخطوة', submitLab: 'تسليم المختبر',
      markComplete: 'تحديد كمكتمل', viewVideo: 'مشاهدة الفيديو',
      // Submissions
      submitWork: 'تسليم عملك', uploadFile: 'رفع ملف',
      pasteLink: 'لصق رابط Google Doc', writeText: 'كتابة الإجابة',
      submitted: 'مُسلَّم', pending: 'قيد المراجعة',
      passed: 'ناجح', failed: 'يحتاج مراجعة',
      // Attendance
      checkIn: 'تسجيل الحضور', checkedIn: 'تم التسجيل', attendance: 'الحضور',
      present: 'حاضر', absent: 'غائب', rate: 'المعدل',
      // Notifications
      noNotifications: 'لا توجد إشعارات بعد',
      markAllRead: 'تحديد الكل كمقروء',
      // Messages
      newMessage: 'رسالة جديدة', send: 'إرسال', reply: 'رد',
      to: 'إلى', subject: 'الموضوع', message: 'الرسالة',
      inbox: 'صندوق الوارد', sent: 'المُرسَل', support: 'الدعم',
      // Career
      careerCenter: 'مركز المهن', jobTracker: 'تتبع الوظائف',
      resumeBuilder: 'بناء السيرة الذاتية', linkedinTools: 'أدوات LinkedIn',
      weeklyGoals: 'الأهداف الأسبوعية', networking: 'التواصل المهني',
      addJob: 'إضافة طلب', company: 'الشركة', jobTitle: 'المسمى الوظيفي',
      status: 'الحالة', applied: 'مُقدَّم', interview: 'مقابلة',
      offer: 'عرض عمل', rejected: 'مرفوض', saved: 'محفوظ',
      atsScore: 'نقاط ATS', resumeVersion: 'إصدار السيرة الذاتية',
      level1Cert: 'شهادة الجاهزية الرقمية وتكنولوجيا مكان العمل',
      level2Cert: 'شهادة إنتاجية الذكاء الاصطناعي وتطبيقات مكان العمل',
      level3Cert: 'شهادة أتمتة الذكاء الاصطناعي والعمليات الرقمية',
      fullCert: 'شهادة ZICT المهنية في الذكاء الاصطناعي التطبيقي والإنتاجية الرقمية',
    }
  },
  fa: {
    translation: {
      // Nav
      dashboard: 'داشبورد', program: 'برنامه', career: 'مرکز شغلی',
      messages: 'پیام‌ها', notifications: 'اعلان‌ها', admin: 'مدیریت',
      signOut: 'خروج', settings: 'تنظیمات', support: 'پشتیبانی',
      // Auth
      welcomeBack: 'خوش آمدید', signIn: 'ورود',
      email: 'آدرس ایمیل', password: 'رمز عبور',
      signingIn: 'در حال ورود…', noAccess: 'دسترسی ندارید؟',
      contactInstructor: 'با مدرس خود تماس بگیرید',
      // Dashboard
      goodMorning: 'صبح بخیر', goodAfternoon: 'بعد از ظهر بخیر', goodEvening: 'عصر بخیر',
      overallProgress: 'پیشرفت کلی', labsComplete: 'آزمایشگاه تکمیل شده',
      weeksComplete: 'هفته‌های تکمیل شده', certsEarned: 'گواهینامه‌های کسب شده',
      nextCert: 'گواهینامه بعدی', timeInPortal: 'زمان در پورتال',
      attendanceRate: 'نرخ حضور', weeklyGoal: 'هدف هفتگی',
      // Program
      week: 'هفته', sessions: 'جلسات', labs: 'آزمایشگاه‌ها',
      locked: 'قفل شده', unlocked: 'باز شده', complete: 'تکمیل شده',
      stepByStep: 'راهنمای گام به گام', submitLab: 'ارسال آزمایشگاه',
      markComplete: 'علامت‌گذاری به عنوان تکمیل شده', viewVideo: 'تماشای ویدیو',
      // Submissions
      submitWork: 'ارسال کار', uploadFile: 'بارگذاری فایل',
      pasteLink: 'چسباندن لینک Google Doc', writeText: 'نوشتن پاسخ',
      submitted: 'ارسال شده', pending: 'در انتظار بررسی',
      passed: 'قبول شده', failed: 'نیاز به بازبینی',
      // Attendance
      checkIn: 'ثبت حضور', checkedIn: 'ثبت شده', attendance: 'حضور و غیاب',
      present: 'حاضر', absent: 'غایب', rate: 'نرخ',
      // Notifications
      noNotifications: 'هنوز اعلانی وجود ندارد',
      markAllRead: 'علامت همه به عنوان خوانده شده',
      // Messages
      newMessage: 'پیام جدید', send: 'ارسال', reply: 'پاسخ',
      to: 'به', subject: 'موضوع', message: 'پیام',
      inbox: 'صندوق ورودی', sent: 'ارسال شده', support: 'پشتیبانی',
      // Career
      careerCenter: 'مرکز شغلی', jobTracker: 'ردیاب شغل',
      resumeBuilder: 'ساخت رزومه', linkedinTools: 'ابزارهای LinkedIn',
      weeklyGoals: 'اهداف هفتگی', networking: 'شبکه‌سازی حرفه‌ای',
      addJob: 'افزودن درخواست', company: 'شرکت', jobTitle: 'عنوان شغلی',
      status: 'وضعیت', applied: 'درخواست داده شده', interview: 'مصاحبه',
      offer: 'پیشنهاد کار', rejected: 'رد شده', saved: 'ذخیره شده',
      atsScore: 'امتیاز ATS', resumeVersion: 'نسخه رزومه',
      level1Cert: 'گواهینامه آمادگی دیجیتال و فناوری محیط کار',
      level2Cert: 'گواهینامه بهره‌وری هوش مصنوعی و کاربردهای محیط کار',
      level3Cert: 'گواهینامه اتوماسیون هوش مصنوعی و عملیات دیجیتال',
      fullCert: 'گواهینامه حرفه‌ای ZICT در هوش مصنوعی کاربردی و بهره‌وری دیجیتال',
    }
  }
}

i18n.use(initReactI18next).init({
  resources, lng: 'en', fallbackLng: 'en',
  interpolation: { escapeValue: false }
})

export default i18n
