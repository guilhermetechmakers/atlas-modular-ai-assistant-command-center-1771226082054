/**
 * Research & Knowledge Base API — notes, clips, CRUD via central api helpers.
 */

import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api'
import type {
  ResearchKnowledgeBase,
  ResearchNote,
  SavedSearch,
  WebClipPayload,
} from '@/types/research-knowledge-base'

const BASE = '/research-knowledge-base'

export async function fetchKnowledgeBases(): Promise<ResearchKnowledgeBase[]> {
  try {
    return await apiGet<ResearchKnowledgeBase[]>(BASE)
  } catch {
    return []
  }
}

export async function createKnowledgeBase(payload: {
  title: string
  description?: string
}): Promise<ResearchKnowledgeBase> {
  return apiPost<ResearchKnowledgeBase>(BASE, payload)
}

export async function updateKnowledgeBase(
  id: string,
  payload: Partial<Pick<ResearchKnowledgeBase, 'title' | 'description' | 'status'>>
): Promise<ResearchKnowledgeBase> {
  return apiPut<ResearchKnowledgeBase>(`${BASE}/${id}`, payload)
}

export async function deleteKnowledgeBase(id: string): Promise<void> {
  await apiDelete(`${BASE}/${id}`)
}

export async function fetchNotes(params?: {
  tags?: string[]
  status?: string
  search?: string
}): Promise<ResearchNote[]> {
  try {
    const searchParams = new URLSearchParams()
    if (params?.tags?.length) searchParams.set('tags', params.tags.join(','))
    if (params?.status) searchParams.set('status', params.status)
    if (params?.search) searchParams.set('q', params.search)
    const qs = searchParams.toString()
    return await apiGet<ResearchNote[]>(qs ? `${BASE}/notes?${qs}` : `${BASE}/notes`)
  } catch {
    return []
  }
}

export async function fetchNote(id: string): Promise<ResearchNote | null> {
  try {
    return await apiGet<ResearchNote>(`${BASE}/notes/${id}`)
  } catch {
    return null
  }
}

export async function createNote(payload: {
  title: string
  body?: string
  tags?: string[]
}): Promise<ResearchNote> {
  return apiPost<ResearchNote>(`${BASE}/notes`, payload)
}

export async function updateNote(
  id: string,
  payload: Partial<Pick<ResearchNote, 'title' | 'body' | 'tags' | 'sources' | 'citations' | 'status'>>
): Promise<ResearchNote> {
  return apiPut<ResearchNote>(`${BASE}/notes/${id}`, payload)
}

export async function deleteNote(id: string): Promise<void> {
  await apiDelete(`${BASE}/notes/${id}`)
}

export async function saveWebClip(payload: WebClipPayload): Promise<ResearchNote> {
  return apiPost<ResearchNote>(`${BASE}/clips`, payload)
}

export async function summarizeNote(noteId: string): Promise<ResearchNote> {
  return apiPost<ResearchNote>(`${BASE}/notes/${noteId}/summarize`, {})
}

export async function fetchSavedSearches(): Promise<SavedSearch[]> {
  try {
    return await apiGet<SavedSearch[]>(`${BASE}/saved-searches`)
  } catch {
    return []
  }
}

export async function createSavedSearch(payload: {
  name: string
  query: string
  filters?: { tags?: string[]; status?: string }
}): Promise<SavedSearch> {
  return apiPost<SavedSearch>(`${BASE}/saved-searches`, payload)
}

export async function deleteSavedSearch(id: string): Promise<void> {
  await apiDelete(`${BASE}/saved-searches/${id}`)
}
