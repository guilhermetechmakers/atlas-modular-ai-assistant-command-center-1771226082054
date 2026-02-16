/**
 * Summarize Button — run AI to create summarized note with citations.
 */

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { summarizeNote } from '@/api/research-knowledge-base'
import type { ResearchNote } from '@/types/research-knowledge-base'
import { toast } from 'sonner'

export interface SummarizeButtonProps {
  noteId: string
  onSummarized?: (note: ResearchNote) => void
}

export function SummarizeButton({ noteId, onSummarized }: SummarizeButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSummarize = async () => {
    setIsLoading(true)
    try {
      const updated = await summarizeNote(noteId)
      onSummarized?.(updated)
      toast.success('Note summarized with citations')
    } catch {
      toast.error('Summarization failed. Try again or check your connection.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSummarize}
      isLoading={isLoading}
      aria-label="Summarize note with AI"
    >
      <Sparkles className="h-4 w-4 mr-1" aria-hidden />
      Summarize
    </Button>
  )
}
