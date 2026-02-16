import { useState } from 'react'
import { Sparkles, FileText, Target } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export interface AIPMActionsProps {
  repoId: string | null
  onSummarize?: () => void
  onCreateFromGoal?: () => void
  className?: string
}

export function AIPMActions({
  repoId,
  onSummarize,
  onCreateFromGoal,
  className,
}: AIPMActionsProps) {
  const [summarizing, setSummarizing] = useState(false)
  const [creating, setCreating] = useState(false)

  const handleSummarize = async () => {
    if (!repoId) {
      toast.error('Select a repository first')
      return
    }
    setSummarizing(true)
    try {
      await new Promise((r) => setTimeout(r, 1200))
      toast.success('Recent activity summarized')
      onSummarize?.()
    } catch {
      toast.error('Failed to summarize')
    } finally {
      setSummarizing(false)
    }
  }

  const handleCreateFromGoal = async () => {
    if (!repoId) {
      toast.error('Select a repository first')
      return
    }
    setCreating(true)
    try {
      await new Promise((r) => setTimeout(r, 1500))
      toast.success('Issues created from goal')
      onCreateFromGoal?.()
    } catch {
      toast.error('Failed to create issues')
    } finally {
      setCreating(false)
    }
  }

  return (
    <Card className={cn('transition-all duration-300 hover:shadow-card-hover border-primary/20', className)}>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-amber-600 text-primary-foreground shadow-card">
            <Sparkles className="h-5 w-5" aria-hidden />
          </span>
          AI PM actions
        </CardTitle>
        <CardDescription>Summarize recent activity or create issues from a goal</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="primary"
          className="flex-1 transition-all duration-300 hover:scale-[1.02] hover:shadow-glow-orange bg-gradient-to-r from-primary to-amber-600"
          onClick={handleSummarize}
          disabled={!repoId || summarizing}
          isLoading={summarizing}
        >
          <FileText className="h-4 w-4 mr-2 shrink-0" aria-hidden />
          {summarizing ? 'Summarizing…' : 'Summarize recent activity'}
        </Button>
        <Button
          variant="primary"
          className="flex-1 transition-all duration-300 hover:scale-[1.02] hover:shadow-glow-orange bg-gradient-to-r from-primary to-amber-600"
          onClick={handleCreateFromGoal}
          disabled={!repoId || creating}
          isLoading={creating}
        >
          <Target className="h-4 w-4 mr-2 shrink-0" aria-hidden />
          {creating ? 'Creating…' : 'Create issues from goal'}
        </Button>
      </CardContent>
    </Card>
  )
}
