export interface CacheService {
    set: (key: string, val: any, expire?: number) => Promise<void>
    get: (key: string) => Promise<any>
}
export type LoggerService = any
