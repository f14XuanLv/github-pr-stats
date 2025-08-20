import type { ProcessedPR, PRStats, APIParams, RepoAggregate } from '../types.js'
import { escapeXml, truncateText, getStatusIcon, getTheme, type Theme } from './svg-utils.js'

interface FieldConfig {
  key: string
  label: string
  width: number
  align: 'left' | 'center' | 'right'
}

export class SVGGenerator {
  private static readonly FIELD_CONFIGS: Record<string, FieldConfig> = {
    repo: { key: 'repo', label: 'Repository', width: 200, align: 'left' },
    stars: { key: 'stars', label: 'Stars', width: 80, align: 'right' },
    pr_title: { key: 'pr_title', label: 'PR Title', width: 250, align: 'left' },
    pr_number: { key: 'pr_number', label: 'PR #', width: 60, align: 'center' },
    status: { key: 'status', label: 'Status', width: 80, align: 'center' },
    created_date: { key: 'created_date', label: 'Created', width: 90, align: 'center' },
    merged_date: { key: 'merged_date', label: 'Merged', width: 90, align: 'center' },
    pr_numbers: { key: 'pr_numbers', label: 'PRs Number', width: 240, align: 'left' },
    total: { key: 'total', label: 'Total', width: 60, align: 'center' },
    merged: { key: 'merged', label: 'Merged', width: 60, align: 'center' },
    open: { key: 'open', label: 'Open', width: 50, align: 'center' },
    draft: { key: 'draft', label: 'Draft', width: 50, align: 'center' },
    closed: { key: 'closed', label: 'Closed', width: 60, align: 'center' },
    merged_rate: { key: 'merged_rate', label: 'Merged Rate', width: 90, align: 'center' }
  }

  static generate(
    username: string,
    prs: ProcessedPR[],
    stats: PRStats,
    params: APIParams,
    repos?: RepoAggregate[]
  ): string {
    if (params.mode === 'repo-aggregate' && repos) {
      return this.generateRepoAggregateView(username, repos, stats, params)
    }
    return this.generatePRListView(username, prs, stats, params)
  }

  private static generatePRListView(
    username: string,
    prs: ProcessedPR[],
    stats: PRStats,
    params: APIParams
  ): string {
    const theme = getTheme(params.theme || 'dark')
    const fields = this.parseFields(params.fields || 'repo,stars,pr_title,pr_number,status,created_date,merged_date')
    const statsToShow = this.parseStats(params.stats || 'all')
    
    const tableWidth = this.calculateTableWidth(fields)
    const rowHeight = 35
    const headerHeight = 40
    const titleHeight = 50
    
    // Calculate stats dimensions
    const statsInfo = this.calculateStatsLayout(stats, statsToShow, tableWidth)
    const statsHeight = statsInfo.height
    const effectiveWidth = statsInfo.width
    
    const statsMargin = statsHeight > 0 ? 10 : 0 // Add margin after stats
    const totalHeight = titleHeight + statsHeight + statsMargin + headerHeight + (prs.length * rowHeight) + 40
    
    let svg = this.createSVGHeader(effectiveWidth, totalHeight, theme)
    
    let currentY = 20
    
    svg += this.renderTitle(username, effectiveWidth, currentY, theme)
    currentY += titleHeight
    
    if (statsHeight > 0) {
      svg += this.renderStats(stats, statsToShow, effectiveWidth, tableWidth, currentY, theme)
      currentY += statsHeight + statsMargin
    }
    
    // Calculate table offset for centering when table is narrower than stats
    const tableOffsetX = Math.max(0, (effectiveWidth - tableWidth) / 2)
    
    svg += this.renderTableHeader(fields, currentY, theme, tableOffsetX)
    currentY += headerHeight
    
    svg += this.renderTableBody(prs, fields, currentY, theme, tableOffsetX)
    
    svg += '</svg>'
    
    return svg
  }

  private static generateRepoAggregateView(
    username: string,
    repos: RepoAggregate[],
    stats: PRStats,
    params: APIParams
  ): string {
    const theme = getTheme(params.theme || 'dark')
    const fields = this.parseFields(params.fields || 'repo,stars,pr_numbers,total,merged,open,draft,closed,merged_rate')
    const statsToShow = this.parseStats(params.stats || 'total_pr,merged_pr,display_pr')
    
    const tableWidth = this.calculateTableWidth(fields)
    const rowHeight = 35
    const headerHeight = 40
    const titleHeight = 50
    
    // Calculate stats dimensions
    const statsInfo = this.calculateStatsLayout(stats, statsToShow, tableWidth)
    const statsHeight = statsInfo.height
    const effectiveWidth = statsInfo.width
    
    const statsMargin = statsHeight > 0 ? 10 : 0
    const totalHeight = titleHeight + statsHeight + statsMargin + headerHeight + (repos.length * rowHeight) + 40
    
    let svg = this.createSVGHeader(effectiveWidth, totalHeight, theme)
    
    let currentY = 20
    
    svg += this.renderTitle(username, effectiveWidth, currentY, theme)
    currentY += titleHeight
    
    if (statsHeight > 0) {
      svg += this.renderStats(stats, statsToShow, effectiveWidth, tableWidth, currentY, theme)
      currentY += statsHeight + statsMargin
    }
    
    const tableOffsetX = Math.max(0, (effectiveWidth - tableWidth) / 2)
    
    svg += this.renderTableHeader(fields, currentY, theme, tableOffsetX)
    currentY += headerHeight
    
    svg += this.renderRepoTableBody(repos, fields, currentY, theme, tableOffsetX)
    
    svg += '</svg>'
    
    return svg
  }

  private static parseFields(fieldsParam: string): FieldConfig[] {
    const fieldKeys = fieldsParam.split(',').map(f => f.trim())
    const fields: FieldConfig[] = []
    
    if (!fieldKeys.includes('repo')) {
      fields.push(this.FIELD_CONFIGS.repo)
    }
    
    for (const key of fieldKeys) {
      if (this.FIELD_CONFIGS[key]) {
        fields.push(this.FIELD_CONFIGS[key])
      }
    }
    
    return fields
  }

  private static parseStats(statsParam: string): Array<keyof PRStats> {
    if (statsParam === 'none' || !statsParam) return []
    if (statsParam === 'all') return ['total_pr', 'merged_pr', 'display_pr', 'repos_with_pr', 'repos_with_merged_pr', 'showing_repos']
    
    return statsParam.split(',')
      .map(s => s.trim())
      .filter(s => ['total_pr', 'merged_pr', 'display_pr', 'showing_repos', 'repos_with_pr', 'repos_with_merged_pr'].includes(s)) as Array<keyof PRStats>
  }

  private static calculateTableWidth(fields: FieldConfig[]): number {
    return fields.reduce((sum, field) => sum + field.width, 0) + 40
  }

  private static calculateStatsLayout(stats: PRStats, statsToShow: Array<keyof PRStats>, tableWidth: number): { width: number, height: number, rows: Array<Array<keyof PRStats>> } {
    if (statsToShow.length === 0) {
      return { width: 0, height: 0, rows: [] }
    }

    const labels = {
      total_pr: 'Total PRs',
      merged_pr: 'Merged PRs',
      display_pr: 'Showing PRs',
      showing_repos: 'Showing Repos',
      repos_with_pr: 'Repos(≥1 PR)',
      repos_with_merged_pr: 'Repos(≥1 Merged PR)'
    }

    // Group stats into two rows: PR-related and Repo-related
    const prStats: Array<keyof PRStats> = []
    const repoStats: Array<keyof PRStats> = []

    for (const statKey of statsToShow) {
      if (['total_pr', 'merged_pr', 'display_pr'].includes(statKey)) {
        prStats.push(statKey)
      } else {
        repoStats.push(statKey)
      }
    }

    const rows: Array<Array<keyof PRStats>> = []
    if (prStats.length > 0) rows.push(prStats)
    if (repoStats.length > 0) rows.push(repoStats)

    // Calculate width needed for each row
    let maxWidth = 0
    for (const row of rows) {
      const rowTexts = row.map(key => `${labels[key]}: ${stats[key]}`)
      const rowText = rowTexts.join('   |   ')
      // Estimate width: average character width ~8px, plus padding
      const estimatedWidth = rowText.length * 8 + 80
      maxWidth = Math.max(maxWidth, estimatedWidth)
    }

    // Minimum stats width to ensure good appearance
    const minStatsWidth = 400
    const requiredStatsWidth = Math.max(minStatsWidth, maxWidth)
    
    // Stats width should match table width when table is wider than minimum stats width
    const finalWidth = Math.max(tableWidth, requiredStatsWidth)
    
    // Height: 25px per row + 20px padding for clean spacing
    const height = rows.length > 0 ? rows.length * 25 + 20 : 0

    return { width: finalWidth, height, rows }
  }

  private static createSVGHeader(width: number, height: number, theme: Theme): string {
    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" 
      xmlns="http://www.w3.org/2000/svg" style="background-color: ${theme.background};">
      <defs>
        <style>
          .title { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.titleColor}; }
          .stats { font: 600 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.statsColor}; }
          .header { font: 600 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.headerColor}; }
          .text { font: 400 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.textColor}; }
        </style>
      </defs>`
  }

  private static renderTitle(username: string, width: number, y: number, _theme: Theme): string {
    return `<text x="${width / 2}" y="${y + 25}" text-anchor="middle" class="title">
      GitHub PR Contributions - ${escapeXml(username)}
    </text>`
  }

  private static renderStats(
    stats: PRStats,
    statsToShow: Array<keyof PRStats>,
    totalWidth: number,
    _tableWidth: number,
    y: number,
    theme: Theme
  ): string {
    const statsLayout = this.calculateStatsLayout(stats, statsToShow, _tableWidth)
    if (statsLayout.rows.length === 0) return ''

    const labels = {
      total_pr: 'Total PRs',
      merged_pr: 'Merged PRs',
      display_pr: 'Showing PRs',
      showing_repos: 'Showing Repos',
      repos_with_pr: 'Repos(≥1 PR)',
      repos_with_merged_pr: 'Repos(≥1 Merged PR)'
    }

    const statsWidth = Math.min(statsLayout.width, totalWidth - 40)
    const statsX = (totalWidth - statsWidth) / 2
    const centerX = totalWidth / 2
    const centerY = y + statsLayout.height / 2
    
    let svg = `<rect x="${statsX}" y="${y}" width="${statsWidth}" height="${statsLayout.height}" 
      fill="${theme.statsBg}" stroke="${theme.borderColor}" rx="6"/>`
    
    // Create a centered group for all stats text
    svg += `<g text-anchor="middle" dominant-baseline="central">`
    
    // Render each row, vertically centered around the group center
    const rowCount = statsLayout.rows.length
    const totalRowsHeight = (rowCount - 1) * 25 // Space between rows
    const startOffset = -totalRowsHeight / 2
    
    for (let rowIndex = 0; rowIndex < statsLayout.rows.length; rowIndex++) {
      const row = statsLayout.rows[rowIndex]
      const rowY = centerY + startOffset + (rowIndex * 25)
      
      const statsElements = row
        .map(key => {
          const text = `${labels[key]}: ${stats[key]}`
          const color = (key === 'merged_pr' || key === 'repos_with_merged_pr') ? theme.mergedStatsColor : theme.statsColor
          return `<tspan fill="${color}">${escapeXml(text)}</tspan>`
        })
        .join(`<tspan fill="${theme.statsColor}">   |   </tspan>`)
      
      svg += `<text x="${centerX}" y="${rowY}" class="stats" xml:space="preserve">
        ${statsElements}
      </text>`
    }
    
    svg += `</g>`
    
    return svg
  }

  private static renderTableHeader(fields: FieldConfig[], y: number, theme: Theme, offsetX: number = 0): string {
    const baseX = 20 + offsetX
    let svg = `<rect x="${baseX}" y="${y}" width="${this.calculateTableWidth(fields) - 40}" height="35" 
      fill="${theme.headerBg}" stroke="${theme.borderColor}"/>`
    
    let currentX = baseX
    for (const field of fields) {
      const textX = this.getTextX(currentX, field.width, field.align)
      svg += `<text x="${textX}" y="${y + 22}" class="header" text-anchor="${this.getTextAnchor(field.align)}">
        ${escapeXml(field.label)}
      </text>`
      
      if (currentX + field.width < this.calculateTableWidth(fields) - 20 + baseX) {
        svg += `<line x1="${currentX + field.width}" y1="${y}" x2="${currentX + field.width}" y2="${y + 35}" 
          stroke="${theme.borderColor}"/>`
      }
      
      currentX += field.width
    }
    
    return svg
  }

  private static renderTableBody(prs: ProcessedPR[], fields: FieldConfig[], startY: number, theme: Theme, offsetX: number = 0): string {
    let svg = ''
    const tableWidth = this.calculateTableWidth(fields) - 40
    const baseX = 20 + offsetX
    
    for (let i = 0; i < prs.length; i++) {
      const pr = prs[i]
      const y = startY + (i * 35)
      const bgColor = i % 2 === 0 ? theme.rowEvenBg : theme.rowOddBg
      
      svg += `<rect x="${baseX}" y="${y}" width="${tableWidth}" height="35" 
        fill="${bgColor}" stroke="${theme.borderColor}"/>`
      
      let currentX = baseX
      for (const field of fields) {
        const value = this.formatFieldValue(pr, field.key)
        const textX = this.getTextX(currentX, field.width, field.align)
        
        if (field.key === 'status') {
          const icon = getStatusIcon(pr.status)
          svg += `<g transform="translate(${textX - 7}, ${y + 11})">${icon}</g>`
        } else {
          svg += `<text x="${textX}" y="${y + 22}" class="text" text-anchor="${this.getTextAnchor(field.align)}">
            ${escapeXml(value)}
          </text>`
        }
        
        if (currentX + field.width < this.calculateTableWidth(fields) - 20 + baseX) {
          svg += `<line x1="${currentX + field.width}" y1="${y}" x2="${currentX + field.width}" y2="${y + 35}" 
            stroke="${theme.borderColor}"/>`
        }
        
        currentX += field.width
      }
    }
    
    return svg
  }

  private static renderRepoTableBody(repos: RepoAggregate[], fields: FieldConfig[], startY: number, theme: Theme, offsetX: number = 0): string {
    let svg = ''
    const tableWidth = this.calculateTableWidth(fields) - 40
    const baseX = 20 + offsetX
    
    for (let i = 0; i < repos.length; i++) {
      const repo = repos[i]
      const y = startY + (i * 35)
      const bgColor = i % 2 === 0 ? theme.rowEvenBg : theme.rowOddBg
      
      svg += `<rect x="${baseX}" y="${y}" width="${tableWidth}" height="35" 
        fill="${bgColor}" stroke="${theme.borderColor}"/>`
      
      let currentX = baseX
      for (const field of fields) {
        const value = this.formatRepoFieldValue(repo, field.key)
        const textX = this.getTextX(currentX, field.width, field.align)
        
        // Apply truncation for pr_numbers to prevent overflow
        const displayValue = field.key === 'pr_numbers' 
          ? truncateText(value, Math.floor(field.width / 8)) // Approximately 8px per character
          : value
        
        svg += `<text x="${textX}" y="${y + 22}" class="text" text-anchor="${this.getTextAnchor(field.align)}">
          ${escapeXml(displayValue)}
        </text>`
        
        if (currentX + field.width < this.calculateTableWidth(fields) - 20 + baseX) {
          svg += `<line x1="${currentX + field.width}" y1="${y}" x2="${currentX + field.width}" y2="${y + 35}" 
            stroke="${theme.borderColor}"/>`
        }
        
        currentX += field.width
      }
    }
    
    return svg
  }

  private static formatRepoFieldValue(repo: RepoAggregate, fieldKey: string): string {
    switch (fieldKey) {
      case 'repo':
        return truncateText(repo.repo, 25)
      case 'stars':
        return repo.stars.toLocaleString() + ' ⭐'
      case 'pr_numbers':
        // Calculate how many PR numbers can fit in the cell (240px width)
        // Estimate: each "#1234," takes about 45px, so we can fit about 5 numbers
        const maxNumbers = 5
        const prNumbers = repo.pr_numbers.slice(0, maxNumbers).map(n => `#${n}`).join(', ')
        return repo.pr_numbers.length > maxNumbers ? prNumbers + '...' : prNumbers
      case 'total':
        return repo.total.toString()
      case 'merged':
        return repo.merged.toString()
      case 'open':
        return repo.open.toString()
      case 'draft':
        return repo.draft.toString()
      case 'closed':
        return repo.closed.toString()
      case 'merged_rate':
        return `${repo.merged_rate}%`
      default:
        return String(repo[fieldKey as keyof RepoAggregate] || '-')
    }
  }

  private static formatFieldValue(pr: ProcessedPR, fieldKey: string): string {
    switch (fieldKey) {
      case 'repo':
        return truncateText(pr.repo, 25)
      case 'stars':
        return pr.stars.toLocaleString() + ' ⭐'
      case 'pr_title':
        return truncateText(pr.pr_title, 35)
      case 'pr_number':
        return `#${pr.pr_number}`
      case 'status':
        return pr.status
      case 'created_date':
      case 'merged_date':
        return pr[fieldKey as keyof ProcessedPR] as string || '-'
      default:
        return String(pr[fieldKey as keyof ProcessedPR] || '-')
    }
  }

  private static getTextX(x: number, width: number, align: 'left' | 'center' | 'right'): number {
    switch (align) {
      case 'left':
        return x + 8
      case 'center':
        return x + width / 2
      case 'right':
        return x + width - 8
    }
  }

  private static getTextAnchor(align: 'left' | 'center' | 'right'): string {
    switch (align) {
      case 'left':
        return 'start'
      case 'center':
        return 'middle'
      case 'right':
        return 'end'
    }
  }
}