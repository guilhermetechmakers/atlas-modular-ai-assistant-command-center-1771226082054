/**
 * Research & Knowledge Base — save web clips, notes, summaries, and decisions.
 * Tagging, search, AI summarization with citations and change detection.
 */

import { useState, useEffect } from 'react'
import { BookOpen, List, FileEdit, Link2, GitCompare } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { NotesList } from '@/components/research-knowledge-base/NotesList'
import { NoteEditor } from '@/components/research-knowledge-base/NoteEditor'
import { WebClipperIntegration } from '@/components/research-knowledge-base/WebClipperIntegration'
import { CompareView } from '@/components/research-knowledge-base/CompareView'
import { VectorSearchToggle } from '@/components/research-knowledge-base/Embeddings/VectorSearchToggle'
import { cn } from '@/lib/utils'

const TAB_ITEMS = [
  { value: 'notes', label: 'Notes', icon: List },
  { value: 'editor', label: 'Editor', icon: FileEdit },
  { value: 'clipper', label: 'Web Clipper', icon: Link2 },
  { value: 'compare', label: 'Compare', icon: GitCompare },
] as const

export function ResearchKnowledgeBasePage() {
  const [activeTab, setActiveTab] = useState('notes')

  useEffect(() => {
    document.title = 'Research & Knowledge Base — Atlas'
    return () => {
      document.title = 'Atlas — Command center'
    }
  }, [])

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-purple" aria-hidden />
            Research & Knowledge Base
          </h1>
          <p className="mt-1 text-muted-foreground">
            Save web clips, notes, summaries, and decisions. Tagging, search, and AI summarization with citations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <VectorSearchToggle />
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1 p-2 bg-panel rounded-lg w-full">
          {TAB_ITEMS.map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2',
                activeTab === value && 'bg-card-surface text-cyan'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="notes" className="mt-6">
          <NotesList />
        </TabsContent>
        <TabsContent value="editor" className="mt-6">
          <NoteEditor />
        </TabsContent>
        <TabsContent value="clipper" className="mt-6">
          <WebClipperIntegration />
        </TabsContent>
        <TabsContent value="compare" className="mt-6">
          <CompareView />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ResearchKnowledgeBasePage
