import { createBrowserRouter } from 'react-router-dom'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { LandingPage } from '@/pages/landing'
import { LoginPage } from '@/pages/login'
import { SignupPage } from '@/pages/signup'
import LoginSignupPage from '@/pages/Login/Signup'
import { ForgotPasswordPage } from '@/pages/forgot-password'
import { ResetPasswordPage } from '@/pages/reset-password'
import { DashboardOverview } from '@/pages/dashboard/overview'
import { ProjectsPage } from '@/pages/dashboard/projects'
import { ProjectsGitHubPage } from '@/pages/dashboard/projects-github'
import { ContentPage } from '@/pages/dashboard/content'
import { ResearchPage } from '@/pages/dashboard/research'
import { CalendarPage } from '@/pages/dashboard/calendar'
import { FinancePage } from '@/pages/dashboard/finance'
import { AgentsPage } from '@/pages/dashboard/agents'
import { SettingsPage } from '@/pages/settings'
import { HelpPage } from '@/pages/help'
import { AdminPage } from '@/pages/admin'
import { NotFoundPage } from '@/pages/not-found'

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/login-/-signup', element: <LoginSignupPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardOverview /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'projects-github', element: <ProjectsGitHubPage /> },
      { path: 'content', element: <ContentPage /> },
      { path: 'research', element: <ResearchPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'finance', element: <FinancePage /> },
      { path: 'agents', element: <AgentsPage /> },
    ],
  },
  {
    path: '/settings',
    element: <DashboardLayout />,
    children: [{ index: true, element: <SettingsPage /> }],
  },
  {
    path: '/help',
    element: <DashboardLayout />,
    children: [{ index: true, element: <HelpPage /> }],
  },
  {
    path: '/admin',
    element: <DashboardLayout />,
    children: [{ index: true, element: <AdminPage /> }],
  },
  { path: '/404', element: <NotFoundPage /> },
  { path: '*', element: <NotFoundPage /> },
])
