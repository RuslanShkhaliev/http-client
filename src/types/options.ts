import {
    IsoFetch,
    IsoHeaders,
    IsoRequestInit,
} from './globals';
import {Hooks} from './hooks';
import {CacheService} from './services';

export type HeadersInit = IsoHeaders | Record<string, string | undefined>

export enum HTTP_METHODS {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

export type CacheOptions = {
    key: string
    expire: number
}
export type TimerType = {
    value: any
}

type Timeout = number | null

export type SearchParamsInit = string | string[][] | Record<string, string> | URLSearchParams | undefined;
export type SearchParamsOption = SearchParamsInit | Record<string, string | number | boolean> | Array<Array<string | number | boolean>>;

export interface CreateInstanceOptions {
    fetch: IsoFetch
    baseUrl?: string
    timeout?: Timeout
    hooks?: Hooks
    headers?: IsoHeaders
    cacheService?: CacheService
}

export type NormalizedOptions = CreateInstanceOptions & {
    baseUrl: string
    timeout: Timeout
    hooks: Required<Hooks>
}

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

export type InstanceOptions = Omit<NormalizedOptions, 'hooks' | 'cacheService'>

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
