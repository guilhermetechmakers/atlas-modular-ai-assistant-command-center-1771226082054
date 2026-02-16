import { useState, useCallback } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderGit2,
  Github,
  FileText,
  ListOrdered,
  BookOpen,
  Calendar,
  Wallet,
  Bot,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  Shield,
  HelpCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const SIDEBAR_STORAGE_KEY = 'atlas-sidebar-collapsed'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dashboard/projects', icon: FolderGit2, label: 'Projects' },
  { to: '/dashboard/projects-github', icon: Github, label: 'Projects (GitHub)' },
  { to: '/dashboard/content', icon: FileText, label: 'Content' },
  { to: '/content-pipeline', icon: ListOrdered, label: 'Content Pipeline' },
  { to: '/dashboard/research', icon: BookOpen, label: 'Research' },
  { to: '/dashboard/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/dashboard/finance', icon: Wallet, label: 'Finance' },
  { to: '/dashboard/agents', icon: Bot, label: 'Agents' },
]

const bottomItems = [
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/help', icon: HelpCircle, label: 'Help' },
]

const adminItem = { to: '/admin', icon: Shield, label: 'Admin' }

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true'
    } catch {
      return false
    }
  })
  const location = useLocation()

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next))
      } catch {
        // ignore
      }
      return next
    })
  }, [])

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-border bg-panel text-foreground transition-[width] duration-300 ease-in-out',
        collapsed ? 'w-[56px]' : 'w-[240px]'
      )}
      aria-label="Main navigation"
    >
      <div className="flex h-14 shrink-0 items-center border-b border-border px-3">
        {!collapsed && (
          <NavLink to="/dashboard" className="flex items-center gap-2 font-semibold text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Search className="h-4 w-4" aria-hidden />
            </span>
            Atlas
          </NavLink>
        )}
        {collapsed && (
          <NavLink to="/dashboard" className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground" aria-label="Atlas home">
            <Search className="h-4 w-4" aria-hidden />
          </NavLink>
        )}
      </div>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to))
          return (
            <NavLink
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200',
                'hover:bg-card-surface hover:text-white',
                isActive
                  ? 'bg-card-surface text-primary border-l-2 border-l-primary -ml-0.5 pl-3.5'
                  : 'text-muted-foreground'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          )
        })}
      </nav>
      <div className="border-t border-border p-2">
        {bottomItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-card-surface hover:text-white',
              location.pathname === to && 'bg-card-surface text-cyan'
            )}
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
        <NavLink
          to={adminItem.to}
          className={cn(
            'mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-card-surface hover:text-white',
            location.pathname === adminItem.to && 'bg-card-surface text-cyan'
          )}
        >
          <adminItem.icon className="h-5 w-5 shrink-0" aria-hidden />
          {!collapsed && <span>{adminItem.label}</span>}
        </NavLink>
      </div>
      <button
        type="button"
        onClick={toggle}
        className="flex h-10 items-center justify-center border-t border-border text-muted-foreground transition-colors hover:bg-card-surface hover:text-white focus-ring"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
      </button>
    </aside>
  )
}
