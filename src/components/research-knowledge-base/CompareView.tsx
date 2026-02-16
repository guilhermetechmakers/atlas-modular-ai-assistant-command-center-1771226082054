/**
 * Compare View — side-by-side comparison of saved items or tool analyses.
 */

import { useState, useEffect } from 'react'
import { GitCompare, FileText } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchNotes } from '@/api/research-knowledge-base'
import type { ResearchNote } from '@/types/research-knowledge-base'

export function CompareView() {
  const [notes, setNotes] = useState<ResearchNote[]>([])
  const [leftId, setLeftId] = useState<string | null>(null)
  const [rightId, setRightId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchNotes()
      .then((data) => {
        if (!cancelled) {
          setNotes(data)
          if (data[0]) setLeftId(data[0].id)
          if (data[1]) setRightId(data[1].id)
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

  const left = notes.find((n) => n.id === leftId)
  const right = notes.find((n) => n.id === rightId)

  if (isLoading) {
    return (
      <Card className="border-border bg-panel">
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border bg-panel overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-white">
          <GitCompare className="h-5 w-5 text-purple" aria-hidden />
          Compare
        </CardTitle>
        <CardDescription>Side-by-side comparison of saved notes or tool analyses.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {notes.length < 2 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/50" aria-hidden />
            <p className="mt-4 text-muted-foreground">Add at least two notes to compare them side by side.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">Left:</label>
                <select
                  value={leftId ?? ''}
                  onChange={(e) => setLeftId(e.target.value || null)}
                  className="rounded-lg border border-border bg-panel px-3 py-2 text-sm text-foreground focus:border-primary focus-ring"
                  aria-label="Select left note"
                >
                  {notes.map((n) => (
                    <option key={n.id} value={n.id}>{n.title || 'Untitled'}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">Right:</label>
                <select
                  value={rightId ?? ''}
                  onChange={(e) => setRightId(e.target.value || null)}
                  className="rounded-lg border border-border bg-panel px-3 py-2 text-sm text-foreground focus:border-primary focus-ring"
                  aria-label="Select right note"
                >
                  {notes.map((n) => (
                    <option key={n.id} value={n.id}>{n.title || 'Untitled'}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 border border-border rounded-card-lg overflow-hidden">
              <div className="min-h-[200px] bg-card-surface p-4">
                {left ? (
                  <>
                    <h3 className="font-semibold text-white mb-2">{left.title || 'Untitled'}</h3>
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap font-sans prose prose-invert max-w-none">
                      {left.body || 'No content.'}
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground text-sm">Select a note.</p>
                )}
              </div>
              <div className="min-h-[200px] bg-card-surface p-4">
                {right ? (
                  <>
                    <h3 className="font-semibold text-white mb-2">{right.title || 'Untitled'}</h3>
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap font-sans prose prose-invert max-w-none">
                      {right.body || 'No content.'}
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground text-sm">Select a note.</p>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
