/**
 * Vector Search Toggle (future) — toggle for semantic search.
 */

import { useState } from 'react'
import { Database } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function VectorSearchToggle() {
  const [enabled, setEnabled] = useState(false)

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setEnabled((e) => !e)}
      className={cn(
        'transition-all duration-200',
        enabled && 'bg-primary/20 border-primary/50 text-primary'
      )}
      aria-pressed={enabled}
      aria-label={enabled ? 'Disable semantic search' : 'Enable semantic search'}
      title="Semantic search (embeddings) — coming soon"
    >
      <Database className="h-4 w-4 mr-1" aria-hidden />
      Vector search {enabled ? 'On' : 'Off'}
    </Button>
  )
}
