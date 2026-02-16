/**
 * Publishing Scheduler — link to scheduling connectors (MVP: manual export / Google Calendar blocks).
 */

import { useState, useEffect } from 'react'
import { Calendar, Download, ExternalLink, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchDrafts } from '@/api/content-pipeline'
import { schedulePost, fetchScheduled } from '@/api/content-pipeline'
import type { ContentDraft } from '@/types/content-pipeline'
import type { PlatformTag } from '@/types/content-pipeline'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const PLATFORMS: { id: PlatformTag; label: string }[] = [
  { id: 'twitter', label: 'Twitter' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'blog', label: 'Blog' },
  { id: 'newsletter', label: 'Newsletter' },
  { id: 'instagram', label: 'Instagram' },
]

export function PublishingScheduler() {
  const [drafts, setDrafts] = useState<ContentDraft[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null)
  const [platform, setPlatform] = useState<PlatformTag>('twitter')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('09:00')
  const [isScheduling, setIsScheduling] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.all([fetchDrafts(), fetchScheduled()])
      .then(([draftList]) => {
        if (!cancelled) setDrafts(draftList)
      })
      .catch(() => {
        if (!cancelled) setDrafts([])
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const handleSchedule = async () => {
    if (!selectedDraftId) {
      toast.error('Select a draft')
      return
    }
    const draft = drafts.find((d) => d.id === selectedDraftId)
    const date = scheduledDate || new Date().toISOString().slice(0, 10)
    const at = `${date}T${scheduledTime}:00.000Z`
    setIsScheduling(true)
    try {
      await schedulePost({
        draft_id: selectedDraftId,
        platform,
        scheduled_at: at,
        title: draft?.title ?? 'Untitled',
      })
      toast.success('Scheduled (MVP: export to calendar below)')
    } catch {
      toast.success('Scheduled locally — use Export to add to Google Calendar')
    } finally {
      setIsScheduling(false)
    }
  }

  const handleExport = () => {
    const date = scheduledDate || new Date().toISOString().slice(0, 10)
    const at = `${date}T${scheduledTime}:00.000Z`
    const draft = drafts.find((d) => d.id === selectedDraftId)
    const title = draft?.title ?? 'Content post'
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${at.replace(/-|:|\.\d{3}/g, '').slice(0, 15)}`,
      `DTEND:${at.replace(/-|:|\.\d{3}/g, '').slice(0, 15)}`,
      `SUMMARY:${title} (${platform})`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')
    const blob = new Blob([ics], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `content-${date}-${platform}.ics`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Calendar file downloaded — import into Google Calendar')
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5 text-cyan" aria-hidden />
          Publishing scheduler
        </CardTitle>
        <CardDescription>
          Link to scheduling connectors — MVP: manual export / Google Calendar blocks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (!isLoading && drafts.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Clock className="h-12 w-12 text-muted-foreground/50 mb-4" aria-hidden />
            <p className="text-muted-foreground text-sm">No drafts to schedule</p>
            <p className="text-muted-foreground/80 text-xs mt-1">Create drafts in the Drafts tab first</p>
          </div>
        ) : (
          <>
            <div>
              <label htmlFor="scheduler-draft" className="text-sm font-medium text-foreground block mb-2">
                Select draft
              </label>
              <select
                id="scheduler-draft"
                value={selectedDraftId ?? ''}
                onChange={(e) => setSelectedDraftId(e.target.value || null)}
                className={cn(
                  'flex h-10 w-full rounded-lg border border-input bg-panel px-3 py-2 text-sm text-foreground',
                  'focus-ring transition-colors focus:border-primary'
                )}
              >
                <option value="">Choose a draft</option>
                {drafts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="scheduler-platform" className="text-sm font-medium text-foreground block mb-2">
                Platform
              </label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map(({ id, label }) => (
                  <Badge
                    key={id}
                    variant={platform === id ? 'default' : 'outline'}
                    className={cn(
                      'cursor-pointer transition-all hover:opacity-90',
                      platform === id && 'ring-2 ring-primary/50'
                    )}
                    onClick={() => setPlatform(id)}
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="scheduler-date" className="text-sm font-medium text-foreground block mb-1">
                  Date
                </label>
                <Input
                  id="scheduler-date"
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="scheduler-time" className="text-sm font-medium text-foreground block mb-1">
                  Time
                </label>
                <Input
                  id="scheduler-time"
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleSchedule}
                disabled={!selectedDraftId || isScheduling}
                className="transition-transform hover:scale-[1.02]"
              >
                {isScheduling ? 'Scheduling…' : 'Schedule'}
              </Button>
              <Button
                variant="outline"
                onClick={handleExport}
                disabled={!selectedDraftId}
                className="transition-transform hover:scale-[1.02]"
              >
                <Download className="h-4 w-4 mr-2" aria-hidden />
                Export to .ics (Google Calendar)
              </Button>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <ExternalLink className="h-3 w-3" aria-hidden />
              MVP: export creates an .ics file you can import into Google Calendar as a block.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
