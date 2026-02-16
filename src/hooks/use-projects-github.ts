import { useState, useEffect, useCallback } from 'react'
import {
  fetchRepos,
  fetchRepoActivity,
  fetchRepoIssues,
  createIssue as apiCreateIssue,
  updateIssueState as apiUpdateIssueState,
  fetchMilestones,
  createMilestone as apiCreateMilestone,
} from '@/api/projects-github'
import type { GitHubRepo, RepoActivityItem, GitHubIssue, Milestone } from '@/types/projects-github'

/** Mock repos when API returns empty (for demo) */
const MOCK_REPOS: GitHubRepo[] = [
  { id: '1', name: 'atlas', full_name: 'org/atlas', private: false, html_url: '#', description: 'Command center app', default_branch: 'main' },
  { id: '2', name: 'docs', full_name: 'org/docs', private: false, html_url: '#', description: 'Documentation', default_branch: 'main' },
]

export function useRepos() {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchRepos()
      setRepos(data.length > 0 ? data : MOCK_REPOS)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load repos')
      setRepos(MOCK_REPOS)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { repos, isLoading, error, refetch }
}

export function useRepoActivity(repoId: string | null, filters?: { type?: string }) {
  const [items, setItems] = useState<RepoActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(!!repoId)

  useEffect(() => {
    if (!repoId) {
      setItems([])
      setIsLoading(false)
      return
    }
    let cancelled = false
    setIsLoading(true)
    fetchRepoActivity(repoId, filters)
      .then((data) => {
        if (!cancelled) setItems(data)
      })
      .catch(() => {
        if (!cancelled) setItems([])
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => { cancelled = true }
  }, [repoId, filters?.type])

  return { items, isLoading }
}

export function useRepoIssues(repoId: string | null, state?: string) {
  const [issues, setIssues] = useState<GitHubIssue[]>([])
  const [isLoading, setIsLoading] = useState(!!repoId)

  const refetch = useCallback(async () => {
    if (!repoId) return
    setIsLoading(true)
    try {
      const data = await fetchRepoIssues(repoId, state ? { state } : undefined)
      setIssues(data)
    } catch {
      setIssues([])
    } finally {
      setIsLoading(false)
    }
  }, [repoId, state])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { issues, isLoading, refetch }
}

export function useCreateIssue(repoId: string | null) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const create = useCallback(
    async (payload: { title: string; body?: string; labels?: string[] }) => {
      if (!repoId) throw new Error('No repo selected')
      setIsSubmitting(true)
      try {
        const issue = await apiCreateIssue(repoId, payload)
        return issue
      } finally {
        setIsSubmitting(false)
      }
    },
    [repoId]
  )

  return { create, isSubmitting }
}

export function useUpdateIssueState(repoId: string | null) {
  const update = useCallback(
    async (issueId: string, state: 'open' | 'closed') => {
      if (!repoId) return
      await apiUpdateIssueState(repoId, issueId, state)
    },
    [repoId]
  )
  return { update }
}

export function useMilestones(repoId: string | null) {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [isLoading, setIsLoading] = useState(!!repoId)

  const refetch = useCallback(async () => {
    if (!repoId) return
    setIsLoading(true)
    try {
      const data = await fetchMilestones(repoId)
      setMilestones(data)
    } catch {
      setMilestones([])
    } finally {
      setIsLoading(false)
    }
  }, [repoId])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { milestones, isLoading, refetch }
}

export function useCreateMilestone(repoId: string | null) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const create = useCallback(
    async (payload: { title: string; description?: string; due_date?: string }) => {
      if (!repoId) throw new Error('No repo selected')
      setIsSubmitting(true)
      try {
        return await apiCreateMilestone(repoId, payload)
      } finally {
        setIsSubmitting(false)
      }
    },
    [repoId]
  )

  return { create, isSubmitting }
}
