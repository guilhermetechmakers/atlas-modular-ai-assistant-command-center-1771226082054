/**
 * Notes List — filters, tags, and saved searches.
 */

import { useState, useEffect, useCallback } from 'react'
import { List, Search, Tag, Filter, Bookmark } from 'lucide-react'
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
import { fetchNotes, fetchSavedSearches, createSavedSearch, deleteSavedSearch } from '@/api/research-knowledge-base'
import type { ResearchNote, SavedSearch } from '@/types/research-knowledge-base'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export interface NotesListProps {
  onSelectNote?: (note: ResearchNote) => void
}

export function NotesList({ onSelectNote }: NotesListProps) {
  const [notes, setNotes] = useState<ResearchNote[]>([])
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [saveSearchOpen, setSaveSearchOpen] = useState(false)
  const [savedSearchName, setSavedSearchName] = useState('')

  const loadNotes = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetchNotes({
        search: searchQuery || undefined,
        tags: selectedTags.length ? selectedTags : undefined,
        status: statusFilter || undefined,
      })
      setNotes(data)
    } catch {
      setNotes([])
      toast.error('Failed to load notes')
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, selectedTags, statusFilter])

  const loadSavedSearches = useCallback(async () => {
    try {
      const data = await fetchSavedSearches()
      setSavedSearches(data)
    } catch {
      setSavedSearches([])
    }
  }, [])

  useEffect(() => {
    loadNotes()
  }, [loadNotes])

  useEffect(() => {
    loadSavedSearches()
  }, [loadSavedSearches])

  const allTags = Array.from(
    new Set(notes.flatMap((n) => n.tags).filter(Boolean))
  ).sort()

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const applySavedSearch = (saved: SavedSearch) => {
    setSearchQuery(saved.query)
    if (saved.filters?.tags?.length) setSelectedTags(saved.filters.tags)
    if (saved.filters?.status) setStatusFilter(saved.filters.status)
  }

  const handleSaveCurrentSearch = async () => {
    if (!savedSearchName.trim()) {
      toast.error('Enter a name for this search')
      return
    }
    try {
      await createSavedSearch({
        name: savedSearchName.trim(),
        query: searchQuery,
        filters: {
          tags: selectedTags.length ? selectedTags : undefined,
          status: statusFilter || undefined,
        },
      })
      setSaveSearchOpen(false)
      setSavedSearchName('')
      await loadSavedSearches()
      toast.success('Search saved')
    } catch {
      toast.error('Failed to save search')
    }
  }

  const handleDeleteSavedSearch = async (id: string) => {
    try {
      await deleteSavedSearch(id)
      await loadSavedSearches()
      toast.success('Saved search removed')
    } catch {
      toast.error('Failed to remove saved search')
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-border bg-panel transition-all duration-200 hover:shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-white">
            <List className="h-5 w-5 text-purple" aria-hidden />
            Notes
          </CardTitle>
          <CardDescription>Filter by tags and search. Use saved searches for quick access.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                type="search"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadNotes()}
                className="pl-9"
                aria-label="Search notes"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => loadNotes()} className="shrink-0">
                <Filter className="h-4 w-4 mr-1" aria-hidden />
                Apply
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSaveSearchOpen(true)}
                className="shrink-0"
              >
                <Bookmark className="h-4 w-4 mr-1" aria-hidden />
                Save search
              </Button>
            </div>
          </div>

          {savedSearches.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Saved:</span>
              {savedSearches.map((s) => (
                <div key={s.id} className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => applySavedSearch(s)}
                  >
                    {s.name}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDeleteSavedSearch(s.id)}
                    aria-label={`Remove saved search ${s.name}`}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          )}

          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Tag className="h-4 w-4" aria-hidden />
                Tags:
              </span>
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className={cn(
                    'cursor-pointer transition-all duration-200 hover:scale-105',
                    selectedTags.includes(tag)
                      ? 'bg-primary/20 text-primary border border-primary/50'
                      : 'bg-card-surface text-muted-foreground hover:bg-panel'
                  )}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-border bg-panel px-3 py-2 text-sm text-foreground focus:border-primary focus-ring"
              aria-label="Filter by status"
            >
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-panel overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-4/5" />
            </div>
          ) : notes.length === 0 ? (
            <div className="p-12 text-center">
              <List className="mx-auto h-12 w-12 text-muted-foreground/50" aria-hidden />
              <p className="mt-4 text-muted-foreground">No notes yet.</p>
              <p className="text-sm text-muted-foreground">Create a note in the Editor or save a clip from Web Clipper.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {notes.map((note) => (
                <li key={note.id}>
                  <button
                    type="button"
                    onClick={() => onSelectNote?.(note)}
                    className="w-full text-left px-4 py-3 transition-all duration-200 hover:bg-card-surface focus-ring rounded-none"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium text-white truncate">{note.title || 'Untitled'}</span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {new Date(note.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {note.tags.slice(0, 5).map((t) => (
                          <Badge key={t} variant="secondary" className="text-xs font-normal">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Dialog open={saveSearchOpen} onOpenChange={setSaveSearchOpen}>
        <DialogContent onClose={() => setSaveSearchOpen(false)}>
          <DialogHeader>
            <DialogTitle>Save current search</DialogTitle>
            <DialogDescription>Save filters and query for quick access later.</DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Search name"
            value={savedSearchName}
            onChange={(e) => setSavedSearchName(e.target.value)}
            aria-label="Saved search name"
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setSaveSearchOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveCurrentSearch}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
