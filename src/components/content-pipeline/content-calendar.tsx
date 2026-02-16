/**
 * Content Calendar — drag-to-schedule posts with platform tags.
 */

import { useState, useEffect } from 'react'
import { Calendar, GripVertical } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchScheduled } from '@/api/content-pipeline'
import type { ScheduledPost } from '@/types/content-pipeline'
import { cn } from '@/lib/utils'

const PLATFORM_LABELS: Record<string, string> = {
  twitter: 'Twitter',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  blog: 'Blog',
  newsletter: 'Newsletter',
  instagram: 'Instagram',
}

export function ContentCalendar() {
  const [scheduled, setScheduled] = useState<ScheduledPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchScheduled()
      .then((data) => {
        if (!cancelled) setScheduled(data)
      })
      .catch(() => {
        if (!cancelled) setScheduled([])
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const byDate = scheduled.reduce<Record<string, ScheduledPost[]>>((acc, post) => {
    const date = post.scheduled_at.slice(0, 10)
    if (!acc[date]) acc[date] = []
    acc[date].push(post)
    return acc
  }, {})
  const dates = Object.keys(byDate).sort()

  const isEmpty = !isLoading && scheduled.length === 0

  return (
    <Card className="transition-all duration-200 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5 text-cyan" aria-hidden />
          Content calendar
        </CardTitle>
        <CardDescription>Drag to schedule posts with platform tags (drag handled by connector)</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground/50 mb-4" aria-hidden />
            <p className="text-muted-foreground text-sm">No scheduled posts</p>
            <p className="text-muted-foreground/80 text-xs mt-1">
              Schedule drafts from the Publishing Scheduler tab
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {dates.map((date) => (
              <div key={date}>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  {new Date(date).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <ul className="space-y-2">
                  {byDate[date].map((post) => (
                    <li
                      key={post.id}
                      className={cn(
                        'flex items-center gap-3 rounded-lg border border-border bg-panel/50 p-3',
                        'transition-all duration-200 hover:shadow-sm hover:border-[rgb(63,63,70)]'
                      )}
                    >
                      <span
                        className="cursor-grab text-muted-foreground touch-none"
                        aria-label="Drag to reschedule"
                      >
                        <GripVertical className="h-4 w-4" aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground truncate">{post.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(post.scheduled_at).toLocaleTimeString(undefined, {
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <Badge variant="outline" className="shrink-0">
                        {PLATFORM_LABELS[post.platform] ?? post.platform}
                      </Badge>
                      <Badge
                        variant={
                          post.status === 'published'
                            ? 'success'
                            : post.status === 'failed'
                              ? 'destructive'
                              : 'secondary'
                        }
                      >
                        {post.status}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
