import {IsoHeaders, IsoRequestInit} from './globals';
import {Hooks} from './hooks';
import {
    CacheOptions,
    SearchParamsOption,
    Timeout,
} from './options';

export type RequestOptions = IsoRequestInit & {
    prefix?: string
    query?: SearchParamsOption
    timeout?: Timeout
    credentials?: 'include' | 'omit' | 'same-origin'
    agent?: any
    trace?: boolean
    cache?: CacheOptions
    hooks?: Hooks
}
export type RequestConfig = {
    baseUrl: string
    prefix: string
    query?: SearchParamsOption
    cache?: CacheOptions
    trace: boolean
}

export type Request = {
    url: string
    headers: IsoHeaders
    timeout: Timeout
    method: string
    credentials: string
    body: any
    signal: AbortSignal
}

export type RequestContext = {
    request: Request
    config: RequestConfig
    hooks: Required<Hooks>
}
