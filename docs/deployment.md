# Deployment Guide

## 🚀 One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/f14xuanlv/github-pr-stats)

Deploy your dedicated PR statistics service instantly and start using it within 5 minutes!

## 🛠️ Environment Variables

Configure the following environment variables before deployment:

```env
# GitHub API Token (required)
GITHUB_TOKEN=ghp_your_github_token_here

# Redis cache URL (optional but highly recommended)
REDIS_URL=redis://default:password@host:6379
```

**Note**:
- `GITHUB_TOKEN` is required for accessing GitHub API
- `REDIS_URL` is optional but highly recommended for better performance and reduced API calls

## 🔑 GitHub Token Creation

1. Visit [GitHub Token Settings](https://github.com/settings/tokens/new)

2. Fill in Token information:
   - **Note**: Enter `GitHub PR Stats`
   - **Expiration**: Select `No expiration`

3. Select permissions (minimal required):
   - ✅ `public_repo`: Access public repositories (required)
   - ✅ `read:user`: Read user profile (for GraphQL)

   ![Create GitHub Token](/images/create_github_token.png)

4. Click `Generate token` button at the bottom of the page

5. **Important**: Copy the generated Token immediately (only shown once)

## 🗄️ Vercel Redis Creation

1. Login to [Vercel Console](https://vercel.com/dashboard)

2. Visit [Vercel Storage](https://vercel.com/dashboard/stores) page

3. Click `Create Database` → Select `Redis (Serverless Redis)` → Continue
   ![Create Vercel Redis](/images/create_vercel_redis.png)

4. Fill in database information:
   - **Name**: Custom input
   - **Region**: Choose your preferred region

5. After creation, enter the database details page and add the copied URL to environment variables:
   ```env
   REDIS_URL=redis://default:your_password@your_host:6379
   ```

## ⚙️ Complete Configuration Example

```env
# GitHub API Token (required)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Redis cache URL (optional but highly recommended for performance)
REDIS_URL=redis://default:AbCdEf123456@redis-12345.upstash.io:6379
```

## 🏗️ System Architecture

### Tech Stack
- **Frontend**: React + TypeScript + Vite
- **Backend**: Vercel Serverless Functions
- **Database**: Redis (caching)
- **API**: GitHub GraphQL API

### Data Flow
1. **Parameter Parsing** → Validate query parameters
2. **Cache Check** → Redis cache optimization
3. **Data Fetching** → GitHub GraphQL API
4. **Data Processing** → Filter, sort, aggregate
5. **Result Limiting** → Select top limit records
6. **SVG Generation** → Theme rendering
7. **Response Output** → Standard SVG format

### Security Features
- Server-side Token isolation
- Read-only API access
- Smart caching strategy
- Modular design