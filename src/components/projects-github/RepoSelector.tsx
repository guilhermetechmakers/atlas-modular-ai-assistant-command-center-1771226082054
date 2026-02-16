import { useState } from 'react'
import { Github, ChevronDown, Check, Link2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useRepos } from '@/hooks/use-projects-github'
import { cn } from '@/lib/utils'
import type { GitHubRepo } from '@/types/projects-github'

export interface RepoSelectorProps {
  selectedRepoId: string | null
  onSelectRepo: (repo: GitHubRepo | null) => void
  className?: string
}

export function RepoSelector({ selectedRepoId, onSelectRepo, className }: RepoSelectorProps) {
  const { repos, isLoading, error, refetch } = useRepos()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const selectedRepo = repos.find((r) => r.id === selectedRepoId) ?? null

  const isEmpty = !isLoading && !error && repos.length === 0

  return (
    <Card className={cn('transition-all duration-300 hover:shadow-card-hover border-primary/20', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary/30 to-amber-600/20 text-primary">
            <Github className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <CardTitle className="text-base">Repositories</CardTitle>
            <CardDescription>Connect and manage GitHub accounts, choose repos</CardDescription>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="shrink-0 hover:scale-[1.02] hover:shadow-md"
        >
          <Link2 className="h-4 w-4 mr-1" aria-hidden />
          Connect GitHub
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full animate-shimmer" />
            <Skeleton className="h-24 w-full animate-shimmer" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-panel/50 py-12 text-center">
            <Github className="h-14 w-14 text-muted-foreground/50 mb-4" aria-hidden />
            <p className="text-sm font-medium text-foreground">No repositories connected</p>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm">Connect your GitHub account to select repos and view activity.</p>
            <Button variant="primary" size="sm" className="mt-4 hover:scale-[1.02] hover:shadow-glow-orange" onClick={() => refetch()}>
              <Link2 className="h-4 w-4 mr-2" aria-hidden />
              Connect GitHub
            </Button>
          </div>
        ) : (
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen((o) => !o)}
              className={cn(
                'flex w-full items-center justify-between rounded-lg border border-border bg-panel px-3 py-2.5 text-left text-sm transition-colors hover:bg-card-surface focus-ring',
                dropdownOpen && 'ring-2 ring-primary ring-offset-2 ring-offset-workspace'
              )}
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
              aria-label="Select repository"
            >
              <span className="truncate">
                {selectedRepo ? selectedRepo.full_name : 'Select a repository'}
              </span>
              <ChevronDown className={cn('h-4 w-4 shrink-0 transition-transform', dropdownOpen && 'rotate-180')} aria-hidden />
            </button>
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" aria-hidden onClick={() => setDropdownOpen(false)} />
                <ul
                  className="absolute top-full left-0 right-0 z-20 mt-1 max-h-60 overflow-auto rounded-lg border border-border bg-card-surface py-1 shadow-card"
                  role="listbox"
                >
                  <li role="option">
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-panel"
                      onClick={() => {
                        onSelectRepo(null)
                        setDropdownOpen(false)
                      }}
                    >
                      {!selectedRepoId ? <Check className="h-4 w-4 text-primary" /> : <span className="w-4" />}
                      <span className="text-muted-foreground">Clear selection</span>
                    </button>
                  </li>
                  {repos.map((repo) => {
                    const isSelected = repo.id === selectedRepoId
                    return (
                      <li key={repo.id} role="option" aria-selected={isSelected}>
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-panel"
                          onClick={() => {
                            onSelectRepo(repo)
                            setDropdownOpen(false)
                          }}
                        >
                          {isSelected ? <Check className="h-4 w-4 shrink-0 text-primary" /> : <span className="w-4 shrink-0" />}
                          <span className="truncate font-medium">{repo.full_name}</span>
                          {repo.private && (
                            <span className="ml-auto shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">Private</span>
                          )}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
