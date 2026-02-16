/**
 * Content Pipeline — central workspace for ideas, drafts, scheduling, assets, repurpose, and publishing.
 */

import { useState, useEffect } from 'react'
import { ListOrdered, Lightbulb, FileEdit, Calendar, Image, Copy, Clock } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  IdeasList,
  DraftEditor,
  ContentCalendar,
  AssetManager,
  RepurposeTool,
  PublishingScheduler,
} from '@/components/content-pipeline'
import { cn } from '@/lib/utils'

const TAB_ITEMS = [
  { value: 'ideas', label: 'Ideas', icon: Lightbulb },
  { value: 'drafts', label: 'Drafts', icon: FileEdit },
  { value: 'calendar', label: 'Calendar', icon: Calendar },
  { value: 'assets', label: 'Assets', icon: Image },
  { value: 'repurpose', label: 'Repurpose', icon: Copy },
  { value: 'scheduler', label: 'Scheduler', icon: Clock },
] as const

export function ContentPipelinePage() {
  const [activeTab, setActiveTab] = useState('ideas')

  useEffect(() => {
    document.title = 'Content Pipeline — Atlas'
    return () => {
      document.title = 'Atlas — Command center'
    }
  }, [])

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
          <ListOrdered className="h-8 w-8 text-primary" aria-hidden />
          Content Pipeline
        </h1>
        <p className="mt-1 text-muted-foreground">
          Ideas → drafts → schedule → publish. Central workspace with platform tags and content calendar.
        </p>
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

        <TabsContent value="ideas" className="mt-6">
          <IdeasList />
        </TabsContent>
        <TabsContent value="drafts" className="mt-6">
          <DraftEditor />
        </TabsContent>
        <TabsContent value="calendar" className="mt-6">
          <ContentCalendar />
        </TabsContent>
        <TabsContent value="assets" className="mt-6">
          <AssetManager />
        </TabsContent>
        <TabsContent value="repurpose" className="mt-6">
          <RepurposeTool />
        </TabsContent>
        <TabsContent value="scheduler" className="mt-6">
          <PublishingScheduler />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ContentPipelinePage
