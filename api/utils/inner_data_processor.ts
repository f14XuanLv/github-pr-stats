import type { GitHubPR, ProcessedPR, PRStats, APIParams, RepoAggregate } from '../types.js'

type SortField = 'stars_desc' | 'stars_asc' | 'created_date_desc' | 'created_date_asc' | 'status' | 'merged_desc' | 'merged_asc' | 'merged_rate_desc' | 'merged_rate_asc'
type StatusFilter = 'all' | 'merged' | 'open' | 'closed' | 'draft'

export class DataProcessor {
  static processGitHubPRs(rawPRs: GitHubPR[]): ProcessedPR[] {
    return rawPRs.map(pr => ({
      repo: `${pr.repository.owner.login}/${pr.repository.name}`,
      stars: pr.repository.stargazerCount,
      pr_title: pr.title,
      pr_number: pr.number,
      status: this.mapPRStatus(pr),
      created_date: this.formatDate(pr.createdAt),
      merged_date: pr.mergedAt ? this.formatDate(pr.mergedAt) : null,
      url: pr.url
    }))
  }

  private static mapPRStatus(pr: GitHubPR): 'merged' | 'open' | 'closed' | 'draft' {
    if (pr.isDraft) return 'draft'
    if (pr.state === 'MERGED') return 'merged'
    if (pr.state === 'OPEN') return 'open'
    return 'closed'
  }

  private static formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toISOString().split('T')[0]
  }

  static filterByStatus(prs: ProcessedPR[], statusParam: string): ProcessedPR[] {
    if (statusParam === 'all') {
      return prs
    }

    const statuses = statusParam.split(',').map(s => s.trim()) as StatusFilter[]
    return prs.filter(pr => statuses.includes(pr.status))
  }

  static filterByMinStars(prs: ProcessedPR[], minStars: number): ProcessedPR[] {
    if (minStars <= 0) {
      return prs
    }
    return prs.filter(pr => pr.stars >= minStars)
  }

  static sortPRs(prs: ProcessedPR[], sortParam: string): ProcessedPR[] {
    if (!sortParam) {
      return prs
    }

    const sortFields = sortParam.split(',').map(s => s.trim()) as SortField[]
    
    return [...prs].sort((a, b) => {
      for (const field of sortFields) {
        const comparison = this.comparePRs(a, b, field)
        if (comparison !== 0) {
          return comparison
        }
      }
      return 0
    })
  }

  private static comparePRs(a: ProcessedPR, b: ProcessedPR, field: SortField): number {
    switch (field) {
      case 'stars_desc':
        return b.stars - a.stars
      case 'stars_asc':
        return a.stars - b.stars
      case 'created_date_desc':
        return new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
      case 'created_date_asc':
        return new Date(a.created_date).getTime() - new Date(b.created_date).getTime()
      case 'status':
        return this.getStatusPriority(a.status) - this.getStatusPriority(b.status)
      default:
        return 0
    }
  }

  private static getStatusPriority(status: string): number {
    const priorities = { merged: 0, open: 1, draft: 2, closed: 3 }
    return priorities[status as keyof typeof priorities] ?? 4
  }

  static limitResults(prs: ProcessedPR[], limit: number): ProcessedPR[] {
    if (limit <= 0) {
      return prs
    }
    return prs.slice(0, limit)
  }

  static calculateStats(originalPRs: ProcessedPR[], displayPRs: ProcessedPR[]): PRStats {
    const mergedCount = originalPRs.filter(pr => pr.status === 'merged').length
    
    // Calculate unique repositories with at least 1 PR
    const reposWithPR = new Set(originalPRs.map(pr => pr.repo)).size
    
    // Calculate unique repositories with at least 1 merged PR
    const reposWithMergedPR = new Set(
      originalPRs.filter(pr => pr.status === 'merged').map(pr => pr.repo)
    ).size
    
    // Calculate unique repositories in currently displayed PRs
    const showingRepos = new Set(displayPRs.map(pr => pr.repo)).size
    
    return {
      total_pr: originalPRs.length,
      merged_pr: mergedCount,
      display_pr: displayPRs.length,
      repos_with_pr: reposWithPR,
      repos_with_merged_pr: reposWithMergedPR,
      showing_repos: showingRepos
    }
  }

  static aggregateByRepo(prs: ProcessedPR[]): RepoAggregate[] {
    const repoMap = new Map<string, ProcessedPR[]>()
    
    for (const pr of prs) {
      if (!repoMap.has(pr.repo)) {
        repoMap.set(pr.repo, [])
      }
      repoMap.get(pr.repo)!.push(pr)
    }
    
    return Array.from(repoMap.entries()).map(([repo, prs]) => {
      const merged = prs.filter(pr => pr.status === 'merged').length
      const open = prs.filter(pr => pr.status === 'open').length
      const draft = prs.filter(pr => pr.status === 'draft').length
      const closed = prs.filter(pr => pr.status === 'closed').length
      const total = prs.length
      const merged_rate = total > 0 ? Math.round((merged / total) * 100) : 0
      
      const pr_numbers = prs.map(pr => pr.pr_number).sort((a, b) => b - a)
      
      return {
        repo,
        stars: prs[0].stars,
        pr_numbers,
        total,
        merged,
        open,
        draft,
        closed,
        merged_rate
      }
    })
  }
  
  static sortRepoAggregates(repos: RepoAggregate[], sortParam: string): RepoAggregate[] {
    if (!sortParam) {
      return repos
    }

    const sortFields = sortParam.split(',').map(s => s.trim()) as SortField[]
    
    return [...repos].sort((a, b) => {
      for (const field of sortFields) {
        const comparison = this.compareRepoAggregates(a, b, field)
        if (comparison !== 0) {
          return comparison
        }
      }
      return 0
    })
  }

  private static compareRepoAggregates(a: RepoAggregate, b: RepoAggregate, field: SortField): number {
    switch (field) {
      case 'stars_desc':
        return b.stars - a.stars
      case 'stars_asc':
        return a.stars - b.stars
      case 'merged_desc':
        return b.merged - a.merged
      case 'merged_asc':
        return a.merged - b.merged
      case 'merged_rate_desc':
        return b.merged_rate - a.merged_rate
      case 'merged_rate_asc':
        return a.merged_rate - b.merged_rate
      default:
        return 0
    }
  }

  static processData(rawPRs: GitHubPR[], params: APIParams): { prs: ProcessedPR[], stats: PRStats, repos?: RepoAggregate[] } {
    let processedPRs = this.processGitHubPRs(rawPRs)
    
    const originalPRs = [...processedPRs]
    
    processedPRs = this.filterByMinStars(processedPRs, params.min_stars || 0)
    
    if (params.mode === 'repo-aggregate') {
      let repos = this.aggregateByRepo(processedPRs)
      repos = this.sortRepoAggregates(repos, params.sort || 'merged_desc,stars_desc')
      const displayRepos = repos.slice(0, params.limit || 10)
      
      // Get all PRs from the displayed repositories for accurate stats calculation
      const displayRepoNames = new Set(displayRepos.map(repo => repo.repo))
      const displayedPRs = processedPRs.filter(pr => displayRepoNames.has(pr.repo))
      
      const stats = this.calculateStats(originalPRs, displayedPRs)
      
      return { prs: [], stats, repos: displayRepos }
    }
    
    processedPRs = this.filterByStatus(processedPRs, params.status || 'all')
    
    processedPRs = this.sortPRs(processedPRs, params.sort || 'status,stars_desc')
    
    const displayPRs = this.limitResults(processedPRs, params.limit || 10)
    
    const stats = this.calculateStats(originalPRs, displayPRs)
    
    return { prs: displayPRs, stats }
  }
}