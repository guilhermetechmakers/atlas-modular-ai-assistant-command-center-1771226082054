import { useState, useCallback } from 'react'
import { LayoutGrid, GripVertical, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useRepoIssues, useUpdateIssueState } from '@/hooks/use-projects-github'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { GitHubIssue } from '@/types/projects-github'

export interface TaskBoardProps {
  repoId: string | null
  className?: string
}

const COLUMNS: { id: 'open' | 'closed'; label: string }[] = [
  { id: 'open', label: 'Open' },
  { id: 'closed', label: 'Closed' },
]

export function TaskBoard({ repoId, className }: TaskBoardProps) {
  const { issues, isLoading, refetch } = useRepoIssues(repoId)
  const { update } = useUpdateIssueState(repoId)
  const [draggedIssue, setDraggedIssue] = useState<GitHubIssue | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<'open' | 'closed' | null>(null)

  const issuesByState = useCallback(
    (state: 'open' | 'closed') => issues.filter((i) => i.state === state),
    [issues]
  )

  const handleDragStart = (e: React.DragEvent, issue: GitHubIssue) => {
    setDraggedIssue(issue)
    e.dataTransfer.setData('text/plain', issue.id)
    e.dataTransfer.effectAllowed = 'move'
    if (e.dataTransfer.setDragImage) {
      const el = e.currentTarget
      const ghost = el.cloneNode(true) as HTMLElement
      ghost.style.position = 'absolute'
      ghost.style.top = '-9999px'
      document.body.appendChild(ghost)
      e.dataTransfer.setDragImage(ghost, 0, 0)
      requestAnimationFrame(() => document.body.removeChild(ghost))
    }
  }

  const handleDragOver = (e: React.DragEvent, columnId: 'open' | 'closed') => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverColumn(columnId)
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = async (e: React.DragEvent, targetState: 'open' | 'closed') => {
    e.preventDefault()
    setDragOverColumn(null)
    const issueId = e.dataTransfer.getData('text/plain')
    const issue = issues.find((i) => i.id === issueId)
    if (!issue || issue.state === targetState) {
      setDraggedIssue(null)
      return
    }
    setDraggedIssue(null)
    try {
      await update(issueId, targetState)
      toast.success(`Issue #${issue.number} moved to ${targetState}`)
      refetch()
    } catch {
      toast.error('Failed to update issue')
    }
  }

  const handleDragEnd = () => {
    setDraggedIssue(null)
    setDragOverColumn(null)
  }

  return (
    <Card className={cn('transition-all duration-300 hover:shadow-card-hover border-primary/10', className)}>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-amber-600/10 text-primary">
            <LayoutGrid className="h-4 w-4" aria-hidden />
          </span>
          Task board
        </CardTitle>
        <CardDescription>Kanban mapped to GitHub issue states, drag-and-drop</CardDescription>
      </CardHeader>
      <CardContent>
        {!repoId ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-panel/30 py-12 text-center">
            <LayoutGrid className="h-12 w-12 text-muted-foreground/50 mb-3" aria-hidden />
            <p className="text-sm font-medium text-muted-foreground">Select a repository</p>
            <p className="mt-1 text-xs text-muted-foreground">Choose a repo to see the Kanban board</p>
          </div>
        ) : isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2].map((c) => (
              <div key={c} className="space-y-2">
                <Skeleton className="h-8 w-24 animate-shimmer" />
                <Skeleton className="h-32 w-full animate-shimmer" />
                <Skeleton className="h-24 w-full animate-shimmer" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {COLUMNS.map((col) => {
              const items = issuesByState(col.id)
              const isOver = dragOverColumn === col.id
              return (
                <div
                  key={col.id}
                  onDragOver={(e) => handleDragOver(e, col.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, col.id)}
                  className={cn(
                    'rounded-lg border-2 border-dashed p-4 transition-colors min-h-[200px]',
                    isOver ? 'border-primary bg-primary/10 shadow-glow-orange' : 'border-border bg-panel/30'
                  )}
                >
                  <div className="sticky top-0 z-10 flex items-center gap-2 mb-3 py-1 -mx-1 px-1 rounded-md bg-panel/80 backdrop-blur-sm">
                    <span className="text-sm font-semibold text-white">{col.label}</span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {items.length}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {items.map((issue) => (
                      <li
                        key={issue.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, issue)}
                        onDragEnd={handleDragEnd}
                        className={cn(
                          'flex items-center gap-2 rounded-lg border border-border bg-card-surface px-3 py-2 cursor-grab active:cursor-grabbing transition-all duration-300 hover:shadow-card-hover hover:scale-[1.02]',
                          draggedIssue?.id === issue.id && 'opacity-50'
                        )}
                      >
                        <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                        <AlertCircle className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white truncate">#{issue.number} {issue.title}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {items.length === 0 && !isOver && (
                    <p className="text-xs text-muted-foreground py-4 text-center">Drop issues here</p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
