import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/AuthContext'
import './i18n'
import './styles/global.css'

// Pages
import Login from './pages/auth/Login'
import Dashboard from './pages/student/Dashboard'
import ProgramView from './pages/student/ProgramView'
import WeekView from './pages/student/WeekView'
import LabView from './pages/student/LabView'
import Messages from './pages/student/Messages'
import CareerCenter from './pages/career/CareerCenter'
import JobTracker from './pages/career/JobTracker'
import ResumeBuilder from './pages/career/ResumeBuilder'
import LinkedInTools from './pages/career/LinkedInTools'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminStudents from './pages/admin/AdminStudents'
import AdminStudentDetail from './pages/admin/AdminStudentDetail'
import AdminAttendance from './pages/admin/AdminAttendance'
import AdminNotifications from './pages/admin/AdminNotifications'
import AdminGrading from './pages/admin/AdminGrading'
import AdminApprovals from './pages/admin/AdminApprovals'
import AdminAssessments from './pages/admin/AdminAssessments'
import StudentAssessments from './pages/student/StudentAssessments'
import SurveyOnboarding from './pages/student/SurveyOnboarding'
import Analytics from './pages/student/Analytics'
import Notes from './pages/student/Notes'
import InstructorLayout from './pages/instructor/InstructorLayout'
import InstructorDashboard from './pages/instructor/InstructorDashboard'
import InstructorAssignments from './pages/instructor/InstructorAssignments'

function Guard({ children, adminOnly = false, instructorOnly = false }) {
  const { user, profile, loading } = useAuth()
  if (loading) return <div className="loading-screen"><div className="loader" /></div>
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && !['admin', 'instructor'].includes(profile?.role)) return <Navigate to="/dashboard" replace />
  if (instructorOnly && !['admin', 'instructor'].includes(profile?.role)) return <Navigate to="/dashboard" replace />
  return children
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Guard><Dashboard /></Guard>} />
      <Route path="/program" element={<Guard><ProgramView /></Guard>} />
      <Route path="/program/week/:weekNum" element={<Guard><WeekView /></Guard>} />
      <Route path="/program/week/:weekNum/lab/:labNum" element={<Guard><LabView /></Guard>} />
      <Route path="/messages" element={<Guard><Messages /></Guard>} />
      <Route path="/career" element={<Guard><CareerCenter /></Guard>} />
      <Route path="/career/jobs" element={<Guard><JobTracker /></Guard>} />
      <Route path="/career/resume" element={<Guard><ResumeBuilder /></Guard>} />
      <Route path="/career/linkedin" element={<Guard><LinkedInTools /></Guard>} />
      <Route path="/admin" element={<Guard adminOnly><AdminLayout /></Guard>}>
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="students/:id" element={<AdminStudentDetail />} />
        <Route path="attendance" element={<AdminAttendance />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="grading" element={<AdminGrading />} />
        <Route path="assessments" element={<AdminAssessments />} />
        <Route path="approvals" element={<AdminApprovals />} />
      </Route>
      <Route path="/assessments" element={<Guard><StudentAssessments /></Guard>} />
      <Route path="/analytics" element={<Guard><Analytics /></Guard>} />
      <Route path="/notes" element={<Guard><Notes /></Guard>} />
      <Route path="/survey" element={<Guard><SurveyOnboarding /></Guard>} />
      <Route path="/instructor" element={<Guard instructorOnly><InstructorLayout /></Guard>}>
        <Route index element={<InstructorDashboard />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="students/:id" element={<AdminStudentDetail />} />
        <Route path="grading" element={<AdminGrading />} />
        <Route path="assignments" element={<InstructorAssignments />} />
        <Route path="class" element={<AdminAttendance />} />
        <Route path="notifications" element={<AdminNotifications />} />
      </Route>
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
