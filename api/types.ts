export interface GitHubPR {
  id: string
  number: number
  title: string
  state: 'MERGED' | 'OPEN' | 'CLOSED' | 'DRAFT'
  createdAt: string
  mergedAt: string | null
  closedAt: string | null
  isDraft: boolean
  repository: {
    name: string
    owner: {
      login: string
    }
    stargazerCount: number
  }
  url: string
}

export interface ProcessedPR {
  repo: string
  stars: number
  pr_title: string
  pr_number: number
  status: 'merged' | 'open' | 'closed' | 'draft'
  created_date: string
  merged_date: string | null
  url: string
}

export interface PRStats {
  total_pr: number
  merged_pr: number
  display_pr: number
  repos_with_pr: number
  repos_with_merged_pr: number
  showing_repos: number
}

export interface RepoAggregate {
  repo: string
  stars: number
  pr_numbers: number[]
  total: number
  merged: number
  open: number
  draft: number
  closed: number
  merged_rate: number
}

export interface APIParams {
  username: string
  theme?: 'dark' | 'light'
  status?: string
  min_stars?: number
  limit?: number
  sort?: string
  stats?: string
  fields?: string
  mode?: 'pr-list' | 'repo-aggregate'
}

export interface GraphQLResponse {
  user: {
    pullRequests: {
      totalCount: number
      pageInfo: {
        hasNextPage: boolean
        endCursor: string | null
      }
      nodes: GitHubPR[]
    }
  }
}