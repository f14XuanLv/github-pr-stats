import type { VercelRequest, VercelResponse } from '@vercel/node'
import { GitHubAPIClient } from './utils/github-api.js'
import { CacheManager } from './utils/cache.js'
import { DataProcessor } from './utils/inner_data_processor.js'
import { SVGGenerator } from './utils/svg_generator.js'
import type { APIParams } from './types.js'

const CACHE_TTL_SECONDS = 3600

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const params = parseQueryParams(req.query)
    
    if (!params.username) {
      return res.status(400).json({ error: 'Username parameter is required' })
    }

    if (!process.env.GITHUB_TOKEN) {
      return res.status(500).json({ error: 'GitHub token not configured' })
    }

    const cache = new CacheManager()
    const githubClient = new GitHubAPIClient(process.env.GITHUB_TOKEN)

    let rawPRs = await cache.get(params.username)
    
    if (!rawPRs) {
      console.log(`Fetching PR data for user: ${params.username}`)
      
      try {
        rawPRs = await githubClient.getAllUserPRs(params.username)
        await cache.set(params.username, rawPRs, CACHE_TTL_SECONDS)
        console.log(`Fetched ${rawPRs.length} PRs for user: ${params.username}`)
      } catch (error) {
        if (error instanceof Error && error.message.includes('not found')) {
          return res.status(404).json({ error: `User "${params.username}" not found` })
        }
        throw error
      }
    } else {
      console.log(`Using cached data for user: ${params.username}, found ${rawPRs.length} PRs`)
    }

    const { prs, stats, repos } = DataProcessor.processData(rawPRs, params)
    
    const svg = SVGGenerator.generate(params.username, prs, stats, params, repos)
    
    res.setHeader('Content-Type', 'image/svg+xml')
    res.setHeader('Cache-Control', 'public, max-age=300')
    res.setHeader('Access-Control-Allow-Origin', '*')
    
    return res.status(200).send(svg)

  } catch (error) {
    console.error('API Error:', error)
    
    let errorMessage = 'Internal server error'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    
    if (req.query.format === 'json') {
      return res.status(500).json({ error: errorMessage })
    }
    
    const errorSvg = generateErrorSvg(errorMessage)
    res.setHeader('Content-Type', 'image/svg+xml')
    return res.status(500).send(errorSvg)
  }
}

function parseQueryParams(query: VercelRequest['query']): APIParams {
  const getString = (key: string): string | undefined => {
    const value = query[key]
    return Array.isArray(value) ? value[0] : value
  }

  const getNumber = (key: string, defaultValue?: number): number | undefined => {
    const value = getString(key)
    if (!value) return defaultValue
    const num = parseInt(value, 10)
    return isNaN(num) ? defaultValue : num
  }

  const mode = (getString('mode') as 'pr-list' | 'repo-aggregate') || 'pr-list'
  
  // Set defaults based on mode
  const defaultSort = mode === 'repo-aggregate' ? 'merged_desc,stars_desc' : 'status,stars_desc'
  const defaultFields = mode === 'repo-aggregate' 
    ? 'repo,stars,pr_numbers,total,merged,merged_rate'
    : 'repo,stars,pr_title,pr_number,status,created_date,merged_date'

  return {
    username: getString('username') || '',
    theme: (getString('theme') as 'dark' | 'light') || 'dark',
    status: getString('status') || 'all',
    min_stars: getNumber('min_stars', 0),
    limit: getNumber('limit', 10),
    sort: getString('sort') || defaultSort,
    stats: getString('stats') || 'total_pr,merged_pr,display_pr',
    fields: getString('fields') || defaultFields,
    mode
  }
}

function generateErrorSvg(message: string): string {
  const width = 600
  const height = 120
  
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" 
    xmlns="http://www.w3.org/2000/svg" style="background-color: #0d1117;">
    <defs>
      <style>
        .error-title { font: 600 16px 'Segoe UI', Ubuntu, Sans-Serif; fill: #f85149; }
        .error-message { font: 400 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: #e6edf3; }
      </style>
    </defs>
    <rect x="10" y="10" width="${width - 20}" height="${height - 20}" 
      fill="#21262d" stroke="#f85149" stroke-width="2" rx="6"/>
    <text x="${width / 2}" y="35" text-anchor="middle" class="error-title">
      GitHub PR Stats Error
    </text>
    <text x="${width / 2}" y="65" text-anchor="middle" class="error-message">
      ${message}
    </text>
  </svg>`
}