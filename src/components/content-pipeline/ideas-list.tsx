/**
 * Ideas List — capture quick ideas with tags and source link.
 */

import { useState, useEffect } from 'react'
import { Lightbulb, Plus, Link2, Tag, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { fetchIdeas, createIdea } from '@/api/content-pipeline'
import type { ContentIdea } from '@/types/content-pipeline'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function IdeasList() {
  const [ideas, setIdeas] = useState<ContentIdea[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [tagsStr, setTagsStr] = useState('')
  const [sourceLink, setSourceLink] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchIdeas()
      .then((data) => {
        if (!cancelled) setIdeas(data)
      })
      .catch(() => {
        if (!cancelled) setIdeas([])
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error('Enter a title for the idea')
      return
    }
    setIsSubmitting(true)
    try {
      const tags = tagsStr
        .split(/[\s,]+/)
        .map((t) => t.trim())
        .filter(Boolean)
      const created = await createIdea({
        title: title.trim(),
        notes: notes.trim() || undefined,
        tags,
        source_link: sourceLink.trim() || undefined,
      })
      setIdeas((prev) => [created, ...prev])
      setModalOpen(false)
      setTitle('')
      setNotes('')
      setTagsStr('')
      setSourceLink('')
      toast.success('Idea added')
    } catch {
      const newIdea: ContentIdea = {
        id: `local-${Date.now()}`,
        title: title.trim(),
        notes: notes.trim() || undefined,
        tags: tagsStr.split(/[\s,]+/).map((t) => t.trim()).filter(Boolean),
        source_link: sourceLink.trim() || undefined,
        created_at: new Date().toISOString(),
        status: 'idea',
      }
      setIdeas((prev) => [newIdea, ...prev])
      setModalOpen(false)
      setTitle('')
      setNotes('')
      setTagsStr('')
      setSourceLink('')
      toast.success('Idea added')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isEmpty = !isLoading && ideas.length === 0

  return (
    <Card className="transition-all duration-200 hover:shadow-card-hover">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lightbulb className="h-5 w-5 text-cyan" aria-hidden />
            Ideas
          </CardTitle>
          <CardDescription>Capture quick ideas with tags and source link</CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setModalOpen(true)}
          className="shrink-0 transition-transform hover:scale-[1.02]"
        >
          <Plus className="h-4 w-4 mr-1" aria-hidden />
          Add idea
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <ul className="space-y-3">
            {[1, 2, 3].map((i) => (
              <li key={i}>
                <Skeleton className="h-16 w-full rounded-lg" />
              </li>
            ))}
          </ul>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Lightbulb className="h-12 w-12 text-muted-foreground/50 mb-4" aria-hidden />
            <p className="text-muted-foreground text-sm">No ideas yet</p>
            <p className="text-muted-foreground/80 text-xs mt-1">Add your first idea to get started</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => setModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" aria-hidden />
              Add idea
            </Button>
          </div>
        ) : (
          <ul className="space-y-3">
            {ideas.map((idea) => (
              <li
                key={idea.id}
                className={cn(
                  'rounded-lg border border-border bg-panel/50 p-3 transition-all duration-200',
                  'hover:border-[rgb(63,63,70)] hover:shadow-sm'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground truncate">{idea.title}</p>
                    {idea.notes && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{idea.notes}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {idea.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" aria-hidden />
                          {tag}
                        </Badge>
                      ))}
                      {idea.source_link && (
                        <a
                          href={idea.source_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-cyan hover:underline"
                        >
                          <Link2 className="h-3 w-3" aria-hidden />
                          Source
                          <ExternalLink className="h-3 w-3" aria-hidden />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent onClose={() => setModalOpen(false)} className="max-w-md">
          <DialogHeader>
            <DialogTitle>New idea</DialogTitle>
            <DialogDescription>Add a quick idea with optional tags and source link.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label htmlFor="idea-title" className="text-sm font-medium text-foreground block mb-1">
                Title
              </label>
              <Input
                id="idea-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Blog post: API design patterns"
              />
            </div>
            <div>
              <label htmlFor="idea-notes" className="text-sm font-medium text-foreground block mb-1">
                Notes
              </label>
              <Input
                id="idea-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes"
              />
            </div>
            <div>
              <label htmlFor="idea-tags" className="text-sm font-medium text-foreground block mb-1">
                Tags (comma or space separated)
              </label>
              <Input
                id="idea-tags"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                placeholder="blog, technical, api"
              />
            </div>
            <div>
              <label htmlFor="idea-source" className="text-sm font-medium text-foreground block mb-1">
                Source link
              </label>
              <Input
                id="idea-source"
                type="url"
                value={sourceLink}
                onChange={(e) => setSourceLink(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} isLoading={isSubmitting}>
              Add idea
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
