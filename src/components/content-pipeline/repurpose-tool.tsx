/**
 * Repurpose Tool — generate multi-platform copies from a single source.
 */

import { useState } from 'react'
import { Copy, Sparkles, Twitter, Linkedin, Youtube, Mail, FileText } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import type { PlatformTag } from '@/types/content-pipeline'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const PLATFORMS: { id: PlatformTag; label: string; icon: typeof Twitter }[] = [
  { id: 'twitter', label: 'Twitter', icon: Twitter },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { id: 'youtube', label: 'YouTube', icon: Youtube },
  { id: 'blog', label: 'Blog', icon: FileText },
  { id: 'newsletter', label: 'Newsletter', icon: Mail },
  { id: 'instagram', label: 'Instagram', icon: Copy },
]

export function RepurposeTool() {
  const [sourceText, setSourceText] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformTag[]>([])
  const [generated, setGenerated] = useState<Record<string, string>>({})
  const [isGenerating, setIsGenerating] = useState(false)

  const togglePlatform = (id: PlatformTag) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const handleGenerate = () => {
    if (!sourceText.trim()) {
      toast.error('Enter source content first')
      return
    }
    if (selectedPlatforms.length === 0) {
      toast.error('Select at least one platform')
      return
    }
    setIsGenerating(true)
    setTimeout(() => {
      const next: Record<string, string> = {}
      selectedPlatforms.forEach((platform) => {
        next[platform] = `[${platform}] Adapted version:\n\n${sourceText.slice(0, 300)}${sourceText.length > 300 ? '…' : ''}\n\n(MVP: connect LLM to generate platform-specific copy.)`
      })
      setGenerated(next)
      setIsGenerating(false)
      toast.success('Copies generated (MVP placeholder)')
    }, 600)
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Copy className="h-5 w-5 text-cyan" aria-hidden />
          Repurpose tool
        </CardTitle>
        <CardDescription>Generate multi-platform copies from a single source</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label htmlFor="repurpose-source" className="text-sm font-medium text-foreground block mb-2">
            Source content
          </label>
          <Textarea
            id="repurpose-source"
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Paste your blog post, script, or long-form content here..."
            className="min-h-[120px] rounded-lg"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground mb-2">Target platforms</p>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => togglePlatform(id)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200',
                  selectedPlatforms.includes(id)
                    ? 'border-cyan bg-cyan/10 text-cyan'
                    : 'border-border bg-panel text-muted-foreground hover:border-[rgb(63,63,70)] hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {label}
              </button>
            ))}
          </div>
        </div>
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !sourceText.trim() || selectedPlatforms.length === 0}
          className="transition-transform hover:scale-[1.02]"
        >
          <Sparkles className="h-4 w-4 mr-2" aria-hidden />
          {isGenerating ? 'Generating…' : 'Generate copies'}
        </Button>
        {Object.keys(generated).length > 0 && (
          <div className="space-y-4 pt-4 border-t border-border">
            <p className="text-sm font-medium text-foreground">Generated copies</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(generated).map(([platform, text]) => (
                <div
                  key={platform}
                  className="rounded-lg border border-border bg-panel/50 p-3 space-y-2"
                >
                  <Badge variant="outline" className="capitalize">
                    {platform}
                  </Badge>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-6">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
