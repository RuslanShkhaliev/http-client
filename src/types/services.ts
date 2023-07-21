export interface CacheService {
    set: (key: string, val: any, expire?: number) => Promise<void>
    get: <T = any>(key: string) => Promise<T>
}
export interface LoggerService {
    log: (...args: any[]) => void
    trace: (...args: any[]) => void
}
