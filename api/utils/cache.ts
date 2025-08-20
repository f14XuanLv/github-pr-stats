import { createClient } from 'redis'
import type { GitHubPR } from '../types.js'

export class CacheManager {
  private redis: ReturnType<typeof createClient> | null
  private connected: boolean = false
  private enabled: boolean = false

  constructor() {
    const redisUrl = process.env.REDIS_URL?.trim()
    
    if (!redisUrl) {
      console.log('Redis not configured (REDIS_URL not set), caching disabled')
      this.redis = null
      this.enabled = false
      return
    }

    try {
      this.redis = createClient({ 
        url: redisUrl 
      })
      this.enabled = true

      // Handle connection events
      this.redis.on('error', (err) => {
        console.error('Redis Client Error - please check if REDIS_URL is correct and Redis server is accessible:', err)
        this.connected = false
      })

      this.redis.on('connect', () => {
        console.log('Redis Client Connected')
        this.connected = true
      })
    } catch (error) {
      console.error('Failed to initialize Redis client - please check if REDIS_URL is correct:', error)
      this.redis = null
      this.enabled = false
    }
  }

  private async ensureConnected() {
    if (!this.enabled || !this.redis) {
      return false
    }
    if (!this.connected && !this.redis.isReady) {
      await this.redis.connect()
    }
    return true
  }

  private getCacheKey(username: string): string {
    return `github_pr_stats:${username.toLowerCase()}`
  }

  async get(username: string): Promise<GitHubPR[] | null> {
    try {
      const connected = await this.ensureConnected()
      if (!connected || !this.redis) {
        return null
      }
      
      const cacheKey = this.getCacheKey(username)
      const cached = await this.redis.get(cacheKey)
      
      if (!cached) {
        return null
      }

      return JSON.parse(cached) as GitHubPR[]
    } catch (error) {
      console.error('Redis get error:', error)
      return null
    }
  }

  async set(username: string, data: GitHubPR[], ttlSeconds: number = 300): Promise<void> {
    try {
      const connected = await this.ensureConnected()
      if (!connected || !this.redis) {
        return
      }
      
      const cacheKey = this.getCacheKey(username)
      await this.redis.setEx(cacheKey, ttlSeconds, JSON.stringify(data))
    } catch (error) {
      console.error('Redis set error:', error)
    }
  }

  async exists(username: string): Promise<boolean> {
    try {
      const connected = await this.ensureConnected()
      if (!connected || !this.redis) {
        return false
      }
      
      const cacheKey = this.getCacheKey(username)
      const result = await this.redis.exists(cacheKey)
      return result === 1
    } catch (error) {
      console.error('Redis exists error:', error)
      return false
    }
  }

  async delete(username: string): Promise<void> {
    try {
      const connected = await this.ensureConnected()
      if (!connected || !this.redis) {
        return
      }
      
      const cacheKey = this.getCacheKey(username)
      await this.redis.del(cacheKey)
    } catch (error) {
      console.error('Redis delete error:', error)
    }
  }

  async getTTL(username: string): Promise<number> {
    try {
      const connected = await this.ensureConnected()
      if (!connected || !this.redis) {
        return -1
      }
      
      const cacheKey = this.getCacheKey(username)
      return await this.redis.ttl(cacheKey)
    } catch (error) {
      console.error('Redis TTL error:', error)
      return -1
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.redis && this.redis.isReady) {
        await this.redis.quit()
      }
      this.connected = false
    } catch (error) {
      console.error('Redis disconnect error:', error)
    }
  }
}