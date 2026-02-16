/**
 * Content Pipeline API — CRUD using central api helpers.
 */

import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api'
import type { ContentPipeline, ContentIdea, ContentDraft, ScheduledPost, ContentAsset } from '@/types/content-pipeline'

const BASE = '/content-pipeline'

export async function fetchPipelines(): Promise<ContentPipeline[]> {
  try {
    return await apiGet<ContentPipeline[]>(BASE)
  } catch {
    return []
  }
}

export async function createPipeline(payload: { title: string; description?: string }): Promise<ContentPipeline> {
  return apiPost<ContentPipeline>(BASE, payload)
}

export async function updatePipeline(id: string, payload: Partial<ContentPipeline>): Promise<ContentPipeline> {
  return apiPut<ContentPipeline>(`${BASE}/${id}`, payload)
}

export async function deletePipeline(id: string): Promise<void> {
  await apiDelete(`${BASE}/${id}`)
}

export async function fetchIdeas(pipelineId?: string): Promise<ContentIdea[]> {
  try {
    const path = pipelineId ? `${BASE}/${pipelineId}/ideas` : `${BASE}/ideas`
    return await apiGet<ContentIdea[]>(path)
  } catch {
    return []
  }
}

export async function createIdea(payload: {
  pipeline_id?: string
  title: string
  notes?: string
  tags?: string[]
  source_link?: string
}): Promise<ContentIdea> {
  return apiPost<ContentIdea>(`${BASE}/ideas`, payload)
}

export async function updateIdea(id: string, payload: Partial<ContentIdea>): Promise<ContentIdea> {
  return apiPut<ContentIdea>(`${BASE}/ideas/${id}`, payload)
}

export async function deleteIdea(id: string): Promise<void> {
  await apiDelete(`${BASE}/ideas/${id}`)
}

export async function fetchDrafts(ideaId?: string): Promise<ContentDraft[]> {
  try {
    const path = ideaId ? `${BASE}/drafts?idea_id=${ideaId}` : `${BASE}/drafts`
    return await apiGet<ContentDraft[]>(path)
  } catch {
    return []
  }
}

export async function createDraft(payload: { idea_id?: string; title: string; body?: string }): Promise<ContentDraft> {
  return apiPost<ContentDraft>(`${BASE}/drafts`, payload)
}

export async function updateDraft(id: string, payload: Partial<ContentDraft>): Promise<ContentDraft> {
  return apiPut<ContentDraft>(`${BASE}/drafts/${id}`, payload)
}

export async function fetchScheduled(): Promise<ScheduledPost[]> {
  try {
    return await apiGet<ScheduledPost[]>(`${BASE}/scheduled`)
  } catch {
    return []
  }
}

export async function schedulePost(payload: {
  draft_id: string
  platform: string
  scheduled_at: string
  title: string
}): Promise<ScheduledPost> {
  return apiPost<ScheduledPost>(`${BASE}/scheduled`, payload)
}

export async function fetchAssets(): Promise<ContentAsset[]> {
  try {
    return await apiGet<ContentAsset[]>(`${BASE}/assets`)
  } catch {
    return []
  }
}

export async function deleteAsset(id: string): Promise<void> {
  await apiDelete(`${BASE}/assets/${id}`)
}
