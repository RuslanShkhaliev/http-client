export interface CacheService {
    set: (key: string, val: any, expire?: number) => Promise<void>
    get: <T = any>(key: string) => Promise<T>
}
