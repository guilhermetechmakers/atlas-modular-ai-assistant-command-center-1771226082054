/**
 * Web Clipper Integration — save URLs with metadata and snapshots.
 */

import { useState } from 'react'
import { Link2, Save, Globe } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { saveWebClip } from '@/api/research-knowledge-base'
import { toast } from 'sonner'

export function WebClipperIntegration() {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [snapshot, setSnapshot] = useState('')
  const [tagsStr, setTagsStr] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    const trimmedUrl = url.trim()
    if (!trimmedUrl) {
      toast.error('Enter a URL to save')
      return
    }
    try {
      new URL(trimmedUrl)
    } catch {
      toast.error('Enter a valid URL')
      return
    }

    setIsSubmitting(true)
    try {
      const tags = tagsStr
        .split(/[\s,]+/)
        .map((t) => t.trim())
        .filter(Boolean)
      await saveWebClip({
        url: trimmedUrl,
        title: title.trim() || undefined,
        snapshot: snapshot.trim() || undefined,
        tags: tags.length ? tags : undefined,
      })
      setUrl('')
      setTitle('')
      setSnapshot('')
      setTagsStr('')
      toast.success('Clip saved to your knowledge base')
    } catch {
      toast.error('Failed to save clip. Try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-border bg-panel transition-all duration-200 hover:shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-white">
          <Link2 className="h-5 w-5 text-cyan" aria-hidden />
          Web Clipper
        </CardTitle>
        <CardDescription>Save URLs with metadata and optional snapshot. Use from browser or paste link here.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1 block">URL *</label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              type="url"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="pl-9"
              aria-label="Page URL"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1 block">Title (optional)</label>
          <Input
            placeholder="Page or article title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label="Clip title"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1 block">Snapshot / excerpt (optional)</label>
          <Textarea
            placeholder="Paste a short excerpt or snapshot of the page"
            value={snapshot}
            onChange={(e) => setSnapshot(e.target.value)}
            rows={4}
            className="resize-none"
            aria-label="Snapshot"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1 block">Tags (comma-separated, optional)</label>
          <Input
            placeholder="e.g. research, product"
            value={tagsStr}
            onChange={(e) => setTagsStr(e.target.value)}
            aria-label="Tags"
          />
        </div>
        <Button
          onClick={handleSubmit}
          isLoading={isSubmitting}
          className="w-full sm:w-auto transition-transform duration-200 hover:scale-[1.02]"
        >
          <Save className="h-4 w-4 mr-2" aria-hidden />
          Save clip
        </Button>
      </CardContent>
    </Card>
  )
}
