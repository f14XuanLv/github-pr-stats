import { GraphQLClient } from 'graphql-request'
import type { GitHubPR, GraphQLResponse } from '../types.js'

const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql'

const GET_USER_PRS_QUERY = `
  query GetUserPRs($username: String!, $first: Int!, $after: String) {
    user(login: $username) {
      pullRequests(
        first: $first
        after: $after
        orderBy: { field: CREATED_AT, direction: DESC }
      ) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          number
          title
          state
          createdAt
          mergedAt
          closedAt
          isDraft
          repository {
            name
            owner {
              login
            }
            stargazerCount
          }
          url
        }
      }
    }
  }
`

export class GitHubAPIClient {
  private client: GraphQLClient

  constructor(token: string) {
    this.client = new GraphQLClient(GITHUB_GRAPHQL_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'github-pr-stats'
      }
    })
  }

  async getAllUserPRs(username: string): Promise<GitHubPR[]> {
    const allPRs: GitHubPR[] = []
    let hasNextPage = true
    let cursor: string | null = null
    const pageSize = 100

    while (hasNextPage) {
      try {
        const response: GraphQLResponse = await this.client.request(
          GET_USER_PRS_QUERY,
          {
            username,
            first: pageSize,
            after: cursor
          }
        )

        if (!response.user) {
          throw new Error(`User "${username}" not found`)
        }

        const { nodes, pageInfo } = response.user.pullRequests
        allPRs.push(...nodes)

        hasNextPage = pageInfo.hasNextPage
        cursor = pageInfo.endCursor
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to fetch PRs for user "${username}": ${error.message}`)
        }
        throw error
      }
    }

    return allPRs
  }

  async getUserPRsCount(username: string): Promise<number> {
    try {
      const response: GraphQLResponse = await this.client.request(
        GET_USER_PRS_QUERY,
        {
          username,
          first: 1,
          after: null
        }
      )

      if (!response.user) {
        throw new Error(`User "${username}" not found`)
      }

      return response.user.pullRequests.totalCount
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch PR count for user "${username}": ${error.message}`)
      }
      throw error
    }
  }
}