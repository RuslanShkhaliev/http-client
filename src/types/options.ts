import {IsoFetch, IsoHeaders} from './globals';
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

export type Timeout = number | null
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

export type InstanceOptions = Omit<NormalizedOptions, 'hooks' | 'cacheService'>
