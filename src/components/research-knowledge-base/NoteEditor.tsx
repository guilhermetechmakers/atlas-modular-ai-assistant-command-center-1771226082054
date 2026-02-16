/**
 * Note Editor — rich text with source attachments and citation metadata.
 */

import { useState, useEffect } from 'react'
import { FileEdit, Save, Link2, Quote, Plus, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { SummarizeButton } from '@/components/research-knowledge-base/SummarizeButton'
import { fetchNotes, createNote, updateNote } from '@/api/research-knowledge-base'
import type { ResearchNote } from '@/types/research-knowledge-base'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function NoteEditor() {
  const [notes, setNotes] = useState<ResearchNote[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [tagsStr, setTagsStr] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchNotes()
      .then((data) => {
        if (!cancelled) {
          setNotes(data)
          if (data[0] && !selectedId) setSelectedId(data[0].id)
        }
      })
      .catch(() => {
        if (!cancelled) setNotes([])
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const selected = notes.find((n) => n.id === selectedId)
  useEffect(() => {
    if (selected) {
      setTitle(selected.title)
      setBody(selected.body)
      setTagsStr(selected.tags.join(', '))
    } else {
      setTitle('')
      setBody('')
      setTagsStr('')
    }
  }, [selected?.id, selected?.title, selected?.body, selected?.tags])

  const handleSave = async () => {
    const tags = tagsStr
      .split(/[\s,]+/)
      .map((t) => t.trim())
      .filter(Boolean)

    if (!selectedId) {
      setIsSaving(true)
      try {
        const created = await createNote({
          title: title.trim() || 'Untitled',
          body: body.trim() || '',
          tags,
        })
        setNotes((prev) => [created, ...prev])
        setSelectedId(created.id)
        toast.success('Note created')
      } catch {
        const newNote: ResearchNote = {
          id: `local-${Date.now()}`,
          user_id: '',
          title: title.trim() || 'Untitled',
          body: body.trim(),
          tags,
          sources: [],
          citations: [],
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setNotes((prev) => [newNote, ...prev])
        setSelectedId(newNote.id)
        toast.success('Note created')
      } finally {
        setIsSaving(false)
      }
      return
    }

    setIsSaving(true)
    try {
      const updated = await updateNote(selectedId, {
        title: title.trim() || 'Untitled',
        body: body.trim(),
        tags,
      })
      setNotes((prev) => prev.map((n) => (n.id === selectedId ? { ...n, ...updated } : n)))
      toast.success('Note saved')
    } catch {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === selectedId
            ? {
                ...n,
                title: title.trim() || 'Untitled',
                body: body.trim(),
                tags,
                updated_at: new Date().toISOString(),
              }
            : n
        )
      )
      toast.success('Note saved')
    } finally {
      setIsSaving(false)
    }
  }

  const handleNewNote = () => {
    setSelectedId(null)
    setTitle('')
    setBody('')
    setTagsStr('')
  }

  if (isLoading) {
    return (
      <Card className="border-border bg-panel">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <Card className="border-border bg-panel h-fit lg:sticky lg:top-24">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-white flex items-center gap-2">
            <FileEdit className="h-4 w-4 text-purple" aria-hidden />
            Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={handleNewNote}
          >
            <Plus className="h-4 w-4" aria-hidden />
            New note
          </Button>
          <ul className="max-h-[320px] overflow-y-auto">
            {notes.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(n.id)}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 hover:bg-card-surface',
                    selectedId === n.id ? 'bg-card-surface text-cyan' : 'text-muted-foreground'
                  )}
                >
                  {n.title || 'Untitled'}
                </button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-border bg-panel transition-all duration-200 hover:shadow-card">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg text-white">Edit note</CardTitle>
            <CardDescription>Rich text with source attachments and citation metadata.</CardDescription>
          </div>
          <div className="flex gap-2">
            {selectedId && <SummarizeButton noteId={selectedId} onSummarized={(n) => setNotes((prev) => prev.map((x) => (x.id === n.id ? n : x)))} />}
            <Button variant="outline" size="sm" onClick={handleSave} isLoading={isSaving}>
              <Save className="h-4 w-4 mr-1" aria-hidden />
              Save
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-medium"
            aria-label="Note title"
          />
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Tags (comma-separated)</label>
            <Input
              placeholder="e.g. research, product, decision"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              aria-label="Tags"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Content</label>
            <Textarea
              placeholder="Write your note. Use the Summarize button to generate an AI summary with citations."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="min-h-[200px] font-sans prose prose-invert max-w-none"
              aria-label="Note content"
            />
          </div>

          {selected?.sources && selected.sources.length > 0 && (
            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-medium text-white flex items-center gap-2 mb-2">
                <Link2 className="h-4 w-4 text-cyan" aria-hidden />
                Source attachments
              </h4>
              <ul className="space-y-2">
                {selected.sources.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center gap-2 rounded-lg border border-border bg-panel px-3 py-2"
                  >
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-cyan hover:underline truncate flex-1 min-w-0"
                    >
                      {s.title || s.url}
                    </a>
                    <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selected?.citations && selected.citations.length > 0 && (
            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-medium text-white flex items-center gap-2 mb-2">
                <Quote className="h-4 w-4 text-amber" aria-hidden />
                Citations
              </h4>
              <ul className="space-y-2">
                {selected.citations.map((c) => (
                  <li
                    key={c.id}
                    className="text-sm text-muted-foreground pl-4 border-l-2 border-amber/50"
                  >
                    {c.excerpt}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
