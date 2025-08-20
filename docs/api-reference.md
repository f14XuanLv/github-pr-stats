# API Reference

## 📝 API Parameters

### Basic Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `username` | string | **Required** | GitHub username |
| `mode` | string | `pr-list` | Display mode:<br>• `pr-list`: Detailed PR list<br>• `repo-aggregate`: Repository aggregate statistics |
| `theme` | string | `dark` | Theme style: `dark` (dark), `light` (light) |
| `limit` | number | `10` | Display limit (selects top limit records after filtering and sorting) |

### Filtering Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `status` | string | `all` | PR status filter (PR List mode only):<br>• Single value: `all`, `merged`, `open`, `closed`, `draft`<br>• Multiple values: `merged,open` (comma-separated)<br>• Ignored in Repository Aggregate mode |
| `min_stars` | number | `0` | Minimum star count filter |

### Sorting Parameters

**PR List Mode** (default: `status,stars_desc`):
- `status`: Sort by fixed status order (merged → open → draft → closed)
- `stars_desc/asc`: Sort by repository star count
- `created_date_desc/asc`: Sort by creation time

**Repository Aggregate Mode** (default: `merged_desc,stars_desc`):
- `merged_desc/asc`: Sort by merged PR count
- `merged_rate_desc/asc`: Sort by merge rate
- `stars_desc/asc`: Sort by star count

Supports multi-field sorting with comma separation: `sort=merged_desc,stars_desc`

### Display Parameters

#### Field Configuration (fields)

**PR List Mode** (default: `repo,stars,pr_title,pr_number,status,created_date,merged_date`):
- `repo`: Repository name (required)
- `stars`: Star count
- `pr_title`: PR title
- `pr_number`: PR number  
- `status`: PR status
- `created_date`: Creation time
- `merged_date`: Merge time

**Repository Aggregate Mode** (default: `repo,stars,pr_numbers,total,merged,merged_rate`):
- `repo`: Repository name (required)
- `stars`: Star count
- `pr_numbers`: PR number list
- `total`: Total PR count
- `merged`: Merged count
- `open`: Open status count
- `draft`: Draft status count  
- `closed`: Closed count
- `merged_rate`: Merge rate

#### Statistics (stats)

Default: `total_pr,merged_pr,display_pr`

Available options:
- `all`: Show all statistics
- `total_pr`: Total PR count
- `merged_pr`: Merged PR count
- `display_pr`: Displayed PR count
- `repos_with_pr`: Repositories with contributions
- `repos_with_merged_pr`: Repositories with successful contributions
- `showing_repos`: Showing repositories count
- `none`: No statistics

## 📊 Usage Examples

### PR List Mode Examples

```bash
# Basic usage - show all PRs
/api/github-pr-stats?username=yourname

# High-quality contributions - merged PRs from high-star projects, top 5
/api/github-pr-stats?username=yourname&status=merged&min_stars=1000&limit=5

# Recent activity - sorted by creation time, top 10
/api/github-pr-stats?username=yourname&sort=created_date_desc&limit=10

# Multi-status filter - merged and open PRs
/api/github-pr-stats?username=yourname&status=merged,open&limit=15

# Simplified display - show core information only
/api/github-pr-stats?username=yourname&fields=repo,pr_title,status&stats=none
```

### Repository Aggregate Mode Examples

```bash
# Basic repository statistics
/api/github-pr-stats?username=yourname&mode=repo-aggregate

# Sort by merge rate - show top 10 repositories with highest contribution quality
/api/github-pr-stats?username=yourname&mode=repo-aggregate&sort=merged_rate_desc&limit=10

# High-impact projects - filter high-star repositories
/api/github-pr-stats?username=yourname&mode=repo-aggregate&min_stars=5000

# Detailed statistics - include PR counts for all statuses
/api/github-pr-stats?username=yourname&mode=repo-aggregate&fields=repo,total,merged,open,closed,merged_rate

# Complete statistics information
/api/github-pr-stats?username=yourname&mode=repo-aggregate&stats=all&limit=15
```

### Themes and Styling

```bash
# Light theme
/api/github-pr-stats?username=yourname&theme=light

# Custom statistics display
/api/github-pr-stats?username=yourname&stats=total_pr,merged_pr,repos_with_pr

# No statistics display
/api/github-pr-stats?username=yourname&stats=none
```