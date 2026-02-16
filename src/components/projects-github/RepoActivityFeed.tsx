import { useState } from 'react'
import { GitCommit, GitPullRequest, AlertCircle, Filter } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useRepoActivity } from '@/hooks/use-projects-github'
import { cn } from '@/lib/utils'
import type { RepoActivityItem } from '@/types/projects-github'

export interface RepoActivityFeedProps {
  repoId: string | null
  className?: string
}

const typeConfig: Record<RepoActivityItem['type'], { icon: typeof GitCommit; label: string }> = {
  commit: { icon: GitCommit, label: 'Commit' },
  pull_request: { icon: GitPullRequest, label: 'PR' },
  issue: { icon: AlertCircle, label: 'Issue' },
}

export function RepoActivityFeed({ repoId, className }: RepoActivityFeedProps) {
  const [filter, setFilter] = useState<RepoActivityItem['type'] | 'all'>('all')
  const { items, isLoading } = useRepoActivity(repoId, filter === 'all' ? undefined : { type: filter })

  const filteredItems = items

  return (
    <Card className={cn('transition-all duration-300 hover:shadow-card-hover border-primary/10', className)}>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-amber-600/10 text-primary">
            <GitCommit className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <CardTitle className="text-base">Activity feed</CardTitle>
            <CardDescription>Commits, PRs, issues with filters</CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-panel p-1">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden />
          {(['all', 'commit', 'pull_request', 'issue'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                'rounded-md px-2 py-1 text-xs font-medium transition-colors',
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-card-surface'
              )}
            >
              {f === 'all' ? 'All' : f === 'pull_request' ? 'PRs' : f === 'commit' ? 'Commits' : 'Issues'}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {!repoId ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-panel/30 py-12 text-center">
            <GitCommit className="h-12 w-12 text-muted-foreground/50 mb-3" aria-hidden />
            <p className="text-sm font-medium text-muted-foreground">Select a repository</p>
            <p className="mt-1 text-xs text-muted-foreground">Choose a repo above to see commits, PRs, and issues</p>
          </div>
        ) : isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-14 w-full animate-shimmer" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-panel/30 py-12 text-center">
            <GitCommit className="h-12 w-12 text-muted-foreground/50 mb-3" aria-hidden />
            <p className="text-sm font-medium text-muted-foreground">No recent activity</p>
            <p className="mt-1 text-xs text-muted-foreground">Activity will appear here once there are commits, PRs, or issues</p>
          </div>
        ) : (
          <ul className="space-y-2 max-h-[320px] overflow-y-auto" role="list">
            {filteredItems.map((item, i) => {
              const config = typeConfig[item.type]
              const Icon = config.icon
              return (
                <li
                  key={item.id}
                  className="flex items-start gap-3 rounded-lg border border-border bg-panel/50 px-3 py-2 transition-all duration-200 hover:bg-card-surface hover:shadow-sm animate-fade-in-up"
                  style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'backwards' }}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">{item.title}</p>
                    {item.description && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{item.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.author && <span>{item.author} · </span>}
                      <time dateTime={item.timestamp}>
                        {new Date(item.timestamp).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </time>
                    </p>
                  </div>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline shrink-0"
                    >
                      View
                    </a>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
