/**
 * Content Pipeline types — ideas, drafts, calendar, assets, scheduling.
 */

export interface ContentPipeline {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export interface ContentIdea {
  id: string
  pipeline_id?: string
  title: string
  notes?: string
  tags: string[]
  source_link?: string
  created_at: string
  status: 'idea' | 'draft' | 'scheduled' | 'published'
}

export interface ContentDraft {
  id: string
  idea_id?: string
  title: string
  body: string
  version: number
  created_at: string
  updated_at: string
}

export type PlatformTag = 'twitter' | 'linkedin' | 'youtube' | 'blog' | 'newsletter' | 'instagram'

export interface ScheduledPost {
  id: string
  draft_id: string
  platform: PlatformTag
  scheduled_at: string
  title: string
  status: 'scheduled' | 'published' | 'failed'
}

export interface ContentAsset {
  id: string
  name: string
  type: 'thumbnail' | 'script' | 'outline' | 'image' | 'other'
  url?: string
  file_size?: number
  created_at: string
}

export interface RepurposeSource {
  id: string
  draft_id: string
  platform_targets: PlatformTag[]
  created_at: string
}
