export function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + '...'
}

import { iconDefinitions } from '../../lib/icons/definitions.js'

export function getStatusIcon(status: string): string {
  const iconMap = {
    'merged': iconDefinitions.merged,
    'open': iconDefinitions.open,
    'draft': iconDefinitions.draft,
    'closed': iconDefinitions.closed
  }
  
  const icon = iconMap[status as keyof typeof iconMap]
  if (!icon) return ''
  
  return icon.replace('<svg', '<svg width="14" height="14"')
}

export interface Theme {
  background: string
  titleColor: string
  headerBg: string
  headerColor: string
  borderColor: string
  textColor: string
  rowEvenBg: string
  rowOddBg: string
  statsBg: string
  statsColor: string
  mergedStatsColor: string
}

export function getTheme(theme: 'dark' | 'light'): Theme {
  if (theme === 'light') {
    return {
      background: '#ffffff',
      titleColor: '#24292f',
      headerBg: '#f6f8fa',
      headerColor: '#24292f',
      borderColor: '#d0d7de',
      textColor: '#24292f',
      rowEvenBg: '#ffffff',
      rowOddBg: '#f6f8fa',
      statsBg: '#f6f8fa',
      statsColor: '#24292f',
      mergedStatsColor: 'rgba(130, 80, 223, 1)'
    }
  }
  
  return {
    background: '#0d1117',
    titleColor: '#f0f6fc',
    headerBg: '#21262d',
    headerColor: '#f0f6fc',
    borderColor: '#30363d',
    textColor: '#e6edf3',
    rowEvenBg: '#0d1117',
    rowOddBg: '#161b22',
    statsBg: '#21262d',
    statsColor: '#f0f6fc',
    mergedStatsColor: 'rgba(180, 120, 255, 1)'
  }
}