import type { Cache } from "@nestjs/cache-manager"
import { Inject, Injectable } from "@nestjs/common"
import InternalCache from "./cache.interface"

@Injectable()
class CacheService implements InternalCache {
  constructor(@Inject("CACHE_MANAGER") private readonly cacheManager: Cache) {}

  public async get<T>(key: string): Promise<T | null> {
    const result = await this.cacheManager.get<T>(key)

    return result === undefined ? null : result
  }

  public async set<T>(key: string, value: T, ttl?: number): Promise<T> {
    await this.cacheManager.set(key, value, ttl)

    return value
  }
}

export default CacheService
