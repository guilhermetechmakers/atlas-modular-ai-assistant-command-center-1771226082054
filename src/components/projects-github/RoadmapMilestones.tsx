import { useState } from 'react'
import { Calendar, Flag, Plus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useMilestones, useCreateMilestone } from '@/hooks/use-projects-github'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export interface RoadmapMilestonesProps {
  repoId: string | null
  className?: string
}

export function RoadmapMilestones({ repoId, className }: RoadmapMilestonesProps) {
  const [createOpen, setCreateOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')

  const { milestones, isLoading, refetch } = useMilestones(repoId)
  const { create, isSubmitting } = useCreateMilestone(repoId)

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error('Title is required')
      return
    }
    try {
      await create({ title: title.trim(), description: description.trim() || undefined, due_date: dueDate || undefined })
      toast.success('Milestone created')
      setCreateOpen(false)
      setTitle('')
      setDescription('')
      setDueDate('')
      refetch()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to create milestone')
    }
  }

  return (
    <>
      <Card className={cn('transition-all duration-300 hover:shadow-card-hover border-primary/10', className)}>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary/30 to-amber-600/20 text-primary">
              <Flag className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <CardTitle className="text-base">Roadmap & milestones</CardTitle>
              <CardDescription>Timeline view with milestones, create epics/milestones</CardDescription>
            </div>
          </div>
          <Button size="sm" onClick={() => setCreateOpen(true)} disabled={!repoId}>
            <Plus className="h-4 w-4 mr-1" aria-hidden />
            Add milestone
          </Button>
        </CardHeader>
        <CardContent>
          {!repoId ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground/50 mb-3" aria-hidden />
              <p className="text-sm text-muted-foreground">Select a repository to view roadmap</p>
            </div>
          ) : isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full animate-shimmer" />
              ))}
            </div>
          ) : milestones.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground/50 mb-3" aria-hidden />
              <p className="text-sm text-muted-foreground">No milestones yet</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => setCreateOpen(true)}>
                Create first milestone
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/60 to-amber-600/30 rounded-full" aria-hidden />
                <ul className="space-y-4">
                  {milestones.map((m, i) => (
                    <li key={m.id} className="relative flex gap-4 pl-10 animate-fade-in-up" style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'backwards' }}>
                      <span className="absolute left-0 flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary bg-card-surface shadow-sm" aria-hidden />
                      <div className="flex-1 rounded-lg border border-border bg-panel p-4 transition-all duration-300 hover:shadow-card-hover hover:border-primary/30">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="font-semibold text-white">{m.title}</h4>
                          <span
                            className={cn(
                              'rounded-md px-2 py-0.5 text-xs font-medium',
                              m.state === 'open' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-muted text-muted-foreground'
                            )}
                          >
                            {m.state}
                          </span>
                        </div>
                        {m.description && (
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{m.description}</p>
                        )}
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          {m.due_date && (
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              Due {new Date(m.due_date).toLocaleDateString()}
                            </span>
                          )}
                          {(m.open_issues_count != null || m.closed_issues_count != null) && (
                            <span>
                              {m.open_issues_count ?? 0} open · {m.closed_issues_count ?? 0} closed
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent onClose={() => setCreateOpen(false)}>
          <DialogHeader>
            <DialogTitle>Create milestone / epic</DialogTitle>
            <DialogDescription>Add a milestone to the roadmap</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="milestone-title" className="block text-sm font-medium text-foreground mb-1">
                Title
              </label>
              <Input
                id="milestone-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Milestone title"
                aria-required
              />
            </div>
            <div>
              <label htmlFor="milestone-desc" className="block text-sm font-medium text-foreground mb-1">
                Description (optional)
              </label>
              <textarea
                id="milestone-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                rows={3}
                className="flex w-full rounded-lg border border-input bg-panel px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y min-h-[60px]"
              />
            </div>
            <div>
              <label htmlFor="milestone-due" className="block text-sm font-medium text-foreground mb-1">
                Due date (optional)
              </label>
              <Input
                id="milestone-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isSubmitting || !title.trim()}>
              {isSubmitting ? 'Creating…' : 'Create milestone'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
