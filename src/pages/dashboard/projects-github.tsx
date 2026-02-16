import { useState, useEffect } from 'react'
import { FolderGit2 } from 'lucide-react'
import { RepoSelector } from '@/components/projects-github/RepoSelector'
import { RepoActivityFeed } from '@/components/projects-github/RepoActivityFeed'
import { IssueListDetailPanel } from '@/components/projects-github/IssueListDetailPanel'
import { RoadmapMilestones } from '@/components/projects-github/RoadmapMilestones'
import { TaskBoard } from '@/components/projects-github/TaskBoard'
import { AIPMActions } from '@/components/projects-github/AIPMActions'
import type { GitHubRepo } from '@/types/projects-github'

export function ProjectsGitHubPage() {
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null)
  const repoId = selectedRepo?.id ?? null

  useEffect(() => {
    document.title = 'Projects (GitHub) — Atlas'
    return () => { document.title = 'Atlas — Command center' }
  }, [])

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="animate-fade-in-up">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-amber-600 text-primary-foreground shadow-card">
            <FolderGit2 className="h-6 w-6" aria-hidden />
          </span>
          <span className="bg-gradient-to-r from-white via-primary to-amber-400 bg-clip-text text-transparent">
            Projects (GitHub)
          </span>
        </h1>
        <p className="mt-2 text-muted-foreground text-base leading-relaxed max-w-2xl">
          Connect accounts, select repos, view issues and PRs, manage roadmaps and boards.
        </p>
      </header>

      <section className="animate-fade-in-up" style={{ animationDelay: '50ms', animationFillMode: 'backwards' }}>
        <RepoSelector
          selectedRepoId={repoId}
          onSelectRepo={setSelectedRepo}
        />
      </section>

      <section className="animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}>
        <AIPMActions repoId={repoId} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2 animate-fade-in-up" style={{ animationDelay: '150ms', animationFillMode: 'backwards' }}>
        <RepoActivityFeed repoId={repoId} />
        <IssueListDetailPanel repoId={repoId} />
      </section>

      <section className="animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}>
        <RoadmapMilestones repoId={repoId} />
      </section>

      <section className="animate-fade-in-up" style={{ animationDelay: '250ms', animationFillMode: 'backwards' }}>
        <TaskBoard repoId={repoId} />
      </section>
    </div>
  )
}

export default ProjectsGitHubPage
