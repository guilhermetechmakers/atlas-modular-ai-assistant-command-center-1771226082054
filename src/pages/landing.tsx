import { Link } from 'react-router-dom'
import { Search, Zap, Shield, GitBranch, BookOpen, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const features = [
  {
    icon: GitBranch,
    title: 'GitHub-first projects',
    description: 'Repo explorer, issues, roadmaps, and AI PM actions in one place.',
  },
  {
    icon: BookOpen,
    title: 'Research & knowledge base',
    description: 'Notes, clips, summaries with citations and search.',
  },
  {
    icon: Zap,
    title: 'Domain AI agents',
    description: 'PM, Personal, Social, Research, Finance agents with memory and skills.',
  },
  {
    icon: Wallet,
    title: 'Finance cockpit',
    description: 'Ledger, budgets, runway, and AI-powered analysis.',
  },
  {
    icon: Shield,
    title: 'Self-host & audit',
    description: 'Human-in-the-loop approvals and immutable audit logs.',
  },
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-workspace text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-16 pb-24 md:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-cyan/10 pointer-events-none" aria-hidden />
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-panel/80 px-4 py-1.5 text-sm text-muted-foreground mb-8 animate-fade-in">
            <Search className="h-4 w-4 text-primary" aria-hidden />
            Unified command center for solo builders & small teams
          </div>
          <h1 className="text-hero font-bold text-white animate-fade-in-up mb-6">
            One workspace.
            <br />
            <span className="bg-gradient-to-r from-primary to-amber bg-clip-text text-transparent">All your context.</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Atlas aggregates projects, content, research, calendar, and finance into a single searchable hub—powered by modular AI agents with permissioned skills and human approval.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Button asChild size="lg" className="min-h-12 px-8 text-base shadow-glow-orange hover:shadow-glow-orange">
              <Link to="/login-/-signup">Get started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-h-12 px-8 text-base">
              <Link to="/login-/-signup?mode=login">Sign in</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature grid - Bento-style */}
      <section className="px-4 py-16 md:px-6 lg:px-8" aria-labelledby="features-heading">
        <h2 id="features-heading" className="sr-only">Features</h2>
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }, i) => (
              <div
                key={title}
                className={cn(
                  'group rounded-card-lg border border-border bg-card-surface p-6 shadow-card transition-all duration-200 hover:shadow-card-hover hover:border-[rgb(63,63,70)]',
                  i === 0 && 'md:col-span-2',
                  i === 2 && 'lg:col-span-2'
                )}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 md:px-6 lg:px-8" aria-labelledby="cta-heading">
        <div className="mx-auto max-w-3xl rounded-card-lg border border-border bg-panel p-8 md:p-12 text-center">
          <h2 id="cta-heading" className="text-display font-bold text-white mb-4">
            Ready to unify your workflow?
          </h2>
          <p className="text-muted-foreground mb-8">
            Self-hostable. Audit-first. Built for technical power users.
          </p>
          <Button asChild size="lg" className="min-h-12 px-8">
            <Link to="/login-/-signup">Get started</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">© Atlas. Self-host & stay in control.</span>
          <div className="flex gap-6">
            <Link to="/login-/-signup" className="text-sm text-muted-foreground hover:text-white transition-colors">Login / Sign up</Link>
            <Link to="/help" className="text-sm text-muted-foreground hover:text-white transition-colors">Help</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
