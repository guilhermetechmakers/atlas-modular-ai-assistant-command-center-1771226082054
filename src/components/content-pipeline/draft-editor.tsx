/**
 * Draft Editor — WYSIWYG/Markdown editor with versioning and AI assist.
 */

import { useState, useEffect } from 'react'
import { FileEdit, Save, History, Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchDrafts, createDraft, updateDraft } from '@/api/content-pipeline'
import type { ContentDraft } from '@/types/content-pipeline'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function DraftEditor() {
  const [drafts, setDrafts] = useState<ContentDraft[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [aiAssistOpen, setAiAssistOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchDrafts()
      .then((data) => {
        if (!cancelled) {
          setDrafts(data)
          if (data[0] && !selectedId) setSelectedId(data[0].id)
        }
      })
      .catch(() => {
        if (!cancelled) setDrafts([])
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const selected = drafts.find((d) => d.id === selectedId)
  useEffect(() => {
    if (selected) {
      setTitle(selected.title)
      setBody(selected.body)
    } else {
      setTitle('')
      setBody('')
    }
  }, [selected?.id, selected?.title, selected?.body])

  const handleSave = async () => {
    if (!selectedId) {
      try {
        setIsSaving(true)
        const created = await createDraft({ title: title.trim() || 'Untitled', body })
        setDrafts((prev) => [created, ...prev])
        setSelectedId(created.id)
        toast.success('Draft created')
      } catch {
        const newDraft: ContentDraft = {
          id: `local-${Date.now()}`,
          title: title.trim() || 'Untitled',
          body,
          version: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setDrafts((prev) => [newDraft, ...prev])
        setSelectedId(newDraft.id)
        toast.success('Draft created')
      } finally {
        setIsSaving(false)
      }
      return
    }
    setIsSaving(true)
    try {
      const updated = await updateDraft(selectedId, { title: title.trim() || 'Untitled', body })
      setDrafts((prev) => prev.map((d) => (d.id === selectedId ? { ...d, ...updated } : d)))
      toast.success('Draft saved')
    } catch {
      setDrafts((prev) =>
        prev.map((d) =>
          d.id === selectedId
            ? { ...d, title: title.trim() || 'Untitled', body, updated_at: new Date().toISOString() }
            : d
        )
      )
      toast.success('Draft saved')
    } finally {
      setIsSaving(false)
    }
  }

  const handleNewDraft = () => {
    setSelectedId(null)
    setTitle('')
    setBody('')
  }

  const isEmpty = !isLoading && drafts.length === 0 && !selectedId

  return (
    <Card className="transition-all duration-200 hover:shadow-card-hover">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileEdit className="h-5 w-5 text-cyan" aria-hidden />
            Drafts
          </CardTitle>
          <CardDescription>Edit with versioning and AI assist (Markdown supported)</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAiAssistOpen((o) => !o)}
            className="text-muted-foreground hover:text-foreground"
            aria-label="AI assist"
          >
            <Sparkles className="h-4 w-4" aria-hidden />
          </Button>
          <Button variant="outline" size="sm" onClick={handleNewDraft}>
            New draft
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-1" aria-hidden />
            {isSaving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : (
          <>
            {drafts.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <History className="h-4 w-4 text-muted-foreground" aria-hidden />
                <span className="text-sm text-muted-foreground">Version / Select:</span>
                {drafts.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelectedId(d.id)}
                    className={cn(
                      'rounded-md px-2 py-1 text-sm transition-colors',
                      selectedId === d.id
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'bg-panel text-muted-foreground hover:text-foreground border border-transparent'
                    )}
                  >
                    v{d.version} · {d.title.slice(0, 20)}{d.title.length > 20 ? '…' : ''}
                  </button>
                ))}
              </div>
            )}
            {aiAssistOpen && (
              <div className="rounded-lg border border-cyan/30 bg-cyan/5 p-3 text-sm text-muted-foreground">
                AI assist: connect an LLM endpoint to expand or refine this draft. (MVP: manual edit only.)
              </div>
            )}
            <div>
              <label htmlFor="draft-title" className="text-sm font-medium text-foreground block mb-1">
                Title
              </label>
              <Input
                id="draft-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Draft title"
                className="rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="draft-body" className="text-sm font-medium text-foreground block mb-1">
                Body (Markdown)
              </label>
              <Textarea
                id="draft-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your content in Markdown..."
                className="min-h-[200px] font-mono text-sm rounded-lg"
              />
            </div>
            {isEmpty && (
              <p className="text-sm text-muted-foreground">
                Create a new draft above or save to add your first draft.
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
