interface InternalCache {
  get: <T>(key: string) => Promise<T | null>
  set: <T>(key: string, value: T, ttl?: number) => Promise<T>
}

export default InternalCache
