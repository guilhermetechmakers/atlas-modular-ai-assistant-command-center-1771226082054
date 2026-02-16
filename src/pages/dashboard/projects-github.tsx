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
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
          <FolderGit2 className="h-8 w-8 text-primary" aria-hidden />
          Projects (GitHub)
        </h1>
        <p className="mt-1 text-muted-foreground">
          Connect accounts, select repos, view issues and PRs, manage roadmaps and boards
        </p>
      </div>

      <RepoSelector
        selectedRepoId={repoId}
        onSelectRepo={setSelectedRepo}
      />

      <AIPMActions repoId={repoId} />

      <div className="grid gap-6 lg:grid-cols-2">
        <RepoActivityFeed repoId={repoId} />
        <IssueListDetailPanel repoId={repoId} />
      </div>

      <RoadmapMilestones repoId={repoId} />

      <TaskBoard repoId={repoId} />
    </div>
  )
}
