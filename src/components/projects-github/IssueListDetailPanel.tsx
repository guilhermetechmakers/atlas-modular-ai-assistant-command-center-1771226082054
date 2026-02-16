import { useState, useMemo } from 'react'
import { Search, Filter, Plus, AlertCircle, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { useRepoIssues, useCreateIssue } from '@/hooks/use-projects-github'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { GitHubIssue } from '@/types/projects-github'

export interface IssueListDetailPanelProps {
  repoId: string | null
  className?: string
}

export function IssueListDetailPanel({ repoId, className }: IssueListDetailPanelProps) {
  const [search, setSearch] = useState('')
  const [stateFilter, setStateFilter] = useState<'all' | 'open' | 'closed'>('open')
  const [selectedIssue, setSelectedIssue] = useState<GitHubIssue | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [createTitle, setCreateTitle] = useState('')
  const [createBody, setCreateBody] = useState('')
  const [titleError, setTitleError] = useState(false)
  const BODY_MAX_LENGTH = 5000

  const { issues, isLoading, refetch } = useRepoIssues(repoId, stateFilter === 'all' ? undefined : stateFilter)
  const { create, isSubmitting } = useCreateIssue(repoId)

  const filtered = useMemo(() => {
    if (!search.trim()) return issues
    const q = search.toLowerCase()
    return issues.filter((i) => i.title.toLowerCase().includes(q) || (i.body && i.body.toLowerCase().includes(q)))
  }, [issues, search])

  const handleCreate = async () => {
    if (!createTitle.trim()) {
      setTitleError(true)
      toast.error('Title is required')
      return
    }
    setTitleError(false)
    try {
      await create({ title: createTitle.trim(), body: createBody.trim() || undefined })
      toast.success('Issue created')
      setCreateOpen(false)
      setCreateTitle('')
      setCreateBody('')
      refetch()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to create issue')
    }
  }

  return (
    <>
      <Card className={cn('transition-all duration-300 hover:shadow-card-hover border-primary/10', className)}>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-primary" aria-hidden />
              Issues
            </CardTitle>
            <CardDescription>Search, filter, create issue (mapped to github.create_issue)</CardDescription>
          </div>
          <Button size="sm" onClick={() => setCreateOpen(true)} disabled={!repoId}>
            <Plus className="h-4 w-4 mr-1" aria-hidden />
            New issue
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {repoId && (
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <Input
                  type="search"
                  placeholder="Search issues..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                  aria-label="Search issues"
                />
              </div>
              <div className="flex items-center gap-1 rounded-lg border border-border bg-panel p-1">
                <Filter className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden />
                {(['open', 'closed', 'all'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStateFilter(s)}
                    className={cn(
                      'rounded-md px-2 py-1 text-xs font-medium capitalize transition-colors',
                      stateFilter === s ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-card-surface'
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!repoId ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground/50 mb-3" aria-hidden />
              <p className="text-sm text-muted-foreground">Select a repository to view issues</p>
            </div>
          ) : isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground/50 mb-3" aria-hidden />
              <p className="text-sm text-muted-foreground">No issues match your filters</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => setCreateOpen(true)}>
                Create first issue
              </Button>
            </div>
          ) : (
            <div className="grid gap-2 md:grid-cols-2">
              <ul className="space-y-2 max-h-[360px] overflow-y-auto">
                {filtered.map((issue) => (
                  <li key={issue.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedIssue(issue)}
                      className={cn(
                        'w-full rounded-lg border px-3 py-2.5 text-left transition-all duration-200 hover:shadow-card-hover hover:scale-[1.01]',
                        selectedIssue?.id === issue.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-panel hover:bg-card-surface'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">#{issue.number}</span>
                        <span className={cn('rounded px-1.5 py-0.5 text-xs', issue.state === 'open' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-muted text-muted-foreground')}>
                          {issue.state}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-medium text-white truncate">{issue.title}</p>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="rounded-lg border border-border bg-panel p-4 min-h-[200px]">
                {selectedIssue ? (
                  <div className="space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-muted-foreground">#{selectedIssue.number}</span>
                      <a
                        href={selectedIssue.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                      >
                        Open on GitHub <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <h4 className="font-semibold text-white">{selectedIssue.title}</h4>
                    {selectedIssue.body && (
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-6">{selectedIssue.body}</p>
                    )}
                    {selectedIssue.labels && selectedIssue.labels.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {selectedIssue.labels.map((l) => (
                          <span
                            key={l.name}
                            className="rounded px-2 py-0.5 text-xs bg-muted text-muted-foreground"
                            style={l.color ? { backgroundColor: `#${l.color}20`, color: `#${l.color}` } : undefined}
                          >
                            {l.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Select an issue to view details</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent onClose={() => setCreateOpen(false)}>
          <DialogHeader>
            <DialogTitle>Create issue</DialogTitle>
            <DialogDescription>Creates an issue in the selected repo (github.create_issue)</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="issue-title" className="block text-sm font-medium text-foreground mb-1">
                Title
              </label>
              <Input
                id="issue-title"
                value={createTitle}
                onChange={(e) => { setCreateTitle(e.target.value); setTitleError(false) }}
                placeholder="Issue title"
                aria-required
                className={cn(titleError && 'animate-shake border-destructive')}
              />
              {titleError && (
                <p className="mt-1 text-xs text-destructive">Title is required</p>
              )}
            </div>
            <div>
              <label htmlFor="issue-body" className="block text-sm font-medium text-foreground mb-1">
                Description (optional)
              </label>
              <textarea
                id="issue-body"
                value={createBody}
                onChange={(e) => setCreateBody(e.target.value)}
                placeholder="Describe the issue..."
                rows={4}
                maxLength={BODY_MAX_LENGTH}
                className="flex w-full rounded-lg border border-input bg-panel px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y min-h-[80px]"
              />
              <p className="mt-1 text-xs text-muted-foreground text-right">
                {createBody.length} / {BODY_MAX_LENGTH}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isSubmitting || !createTitle.trim()} isLoading={isSubmitting}>
              {isSubmitting ? 'Creating…' : 'Create issue'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
