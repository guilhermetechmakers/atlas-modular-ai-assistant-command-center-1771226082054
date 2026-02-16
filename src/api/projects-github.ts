import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api'
import type { ProjectGitHub, GitHubRepo, GitHubIssue, RepoActivityItem, Milestone } from '@/types/projects-github'

const PROJECTS_BASE = '/projects-github'

export async function fetchProjects(): Promise<ProjectGitHub[]> {
  const data = await apiGet<ProjectGitHub[]>(`${PROJECTS_BASE}`)
  return Array.isArray(data) ? data : []
}

export async function createProject(payload: { title: string; description?: string }): Promise<ProjectGitHub> {
  return apiPost<ProjectGitHub>(`${PROJECTS_BASE}`, payload)
}

export async function updateProject(id: string, payload: Partial<Pick<ProjectGitHub, 'title' | 'description' | 'status'>>): Promise<ProjectGitHub> {
  return apiPut<ProjectGitHub>(`${PROJECTS_BASE}/${id}`, payload)
}

export async function deleteProject(id: string): Promise<void> {
  await apiDelete(`${PROJECTS_BASE}/${id}`)
}

/** GitHub-connected repos (from backend proxy or OAuth) */
export async function fetchRepos(): Promise<GitHubRepo[]> {
  try {
    const data = await apiGet<GitHubRepo[]>(`${PROJECTS_BASE}/repos`)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

/** Activity feed for a repo (commits, PRs, issues) */
export async function fetchRepoActivity(repoId: string, filters?: { type?: string }): Promise<RepoActivityItem[]> {
  try {
    const q = filters?.type ? `?type=${encodeURIComponent(filters.type)}` : ''
    const data = await apiGet<RepoActivityItem[]>(`${PROJECTS_BASE}/repos/${repoId}/activity${q}`)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

/** Issues for a repo (for list and board) */
export async function fetchRepoIssues(repoId: string, params?: { state?: string }): Promise<GitHubIssue[]> {
  try {
    const q = params?.state ? `?state=${encodeURIComponent(params.state)}` : ''
    const data = await apiGet<GitHubIssue[]>(`${PROJECTS_BASE}/repos/${repoId}/issues${q}`)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

/** Create issue (maps to github.create_issue) */
export async function createIssue(repoId: string, payload: { title: string; body?: string; labels?: string[] }): Promise<GitHubIssue> {
  return apiPost<GitHubIssue>(`${PROJECTS_BASE}/repos/${repoId}/issues`, payload)
}

/** Update issue state (for Kanban drag) */
export async function updateIssueState(repoId: string, issueId: string, state: 'open' | 'closed'): Promise<GitHubIssue> {
  return apiPut<GitHubIssue>(`${PROJECTS_BASE}/repos/${repoId}/issues/${issueId}`, { state })
}

/** Milestones for roadmap */
export async function fetchMilestones(repoId: string): Promise<Milestone[]> {
  try {
    const data = await apiGet<Milestone[]>(`${PROJECTS_BASE}/repos/${repoId}/milestones`)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export async function createMilestone(repoId: string, payload: { title: string; description?: string; due_date?: string }): Promise<Milestone> {
  return apiPost<Milestone>(`${PROJECTS_BASE}/repos/${repoId}/milestones`, payload)
}
