/** Project record stored in DB (projects_(github) table) */
export interface ProjectGitHub {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

/** GitHub repo summary (from API or mock) */
export interface GitHubRepo {
  id: string
  name: string
  full_name: string
  private: boolean
  html_url: string
  description?: string
  default_branch?: string
}

/** GitHub issue (mapped to board/list) */
export interface GitHubIssue {
  id: string
  number: number
  title: string
  body?: string
  state: 'open' | 'closed'
  html_url: string
  created_at: string
  updated_at?: string
  labels?: { name: string; color?: string }[]
  assignees?: { login: string }[]
}

/** Activity item (commit, PR, or issue) */
export interface RepoActivityItem {
  id: string
  type: 'commit' | 'pull_request' | 'issue'
  title: string
  description?: string
  author?: string
  timestamp: string
  url?: string
  repo?: string
}

/** Milestone / epic for roadmap */
export interface Milestone {
  id: string
  title: string
  description?: string
  due_date?: string
  state: 'open' | 'closed'
  open_issues_count?: number
  closed_issues_count?: number
}
