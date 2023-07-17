import {FetchClient, SearchParams} from './common';
import {Hooks} from './hooks';
import {CacheService, LoggerService} from './services';

type CommonOptions = {
    prefixUrl?: string
    redirect?: string
    method?: string
    headers?: Record<string, any>
    timeout?: number
    credentials?: 'include' | 'omit' | 'same-origin'
    hooks?: Hooks
    keepalive?: boolean
}
export type InitOptions = CommonOptions & {
    baseUrl?: string
    fetch?: FetchClient
    agent?: null
    cacheService?: CacheService | null
}

export type Options = CommonOptions & {
    signal?: AbortSignal | null
    body?: any
    params?: SearchParams
    trace?: boolean
    cache?: {
        key: string
        expire?: number
    }
}
export type Config = Omit<InitOptions, 'fetch'> & Omit<Options, 'fetch'> & Required<{
    baseUrl: string
    prefixUrl: string
    fetch: FetchClient
    hooks: Required<Hooks>
    logger: LoggerService
}>
