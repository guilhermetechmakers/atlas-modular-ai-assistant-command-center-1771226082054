/**
 * Research & Knowledge Base types — notes, clips, citations, comparisons.
 */

export interface ResearchKnowledgeBase {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export interface SourceAttachment {
  id: string
  url: string
  title?: string
  snapshot?: string
  favicon?: string
  captured_at: string
}

export interface CitationMetadata {
  id: string
  source_id: string
  excerpt: string
  position?: number
}

export interface ResearchNote {
  id: string
  user_id: string
  title: string
  body: string
  tags: string[]
  sources: SourceAttachment[]
  citations: CitationMetadata[]
  status: 'active' | 'archived'
  created_at: string
  updated_at: string
}

export interface SavedSearch {
  id: string
  name: string
  query: string
  filters: { tags?: string[]; status?: string }
  created_at: string
}

export interface WebClipPayload {
  url: string
  title?: string
  snapshot?: string
  tags?: string[]
}
