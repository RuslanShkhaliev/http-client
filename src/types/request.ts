import {ErrorType} from '../errors';
import {IsomorphicResponse} from './globals';
import {Options} from './options';

export type FetchRequest = Partial<Omit<Options, 'fetch' | 'hooks' | 'immediate' | 'trace' | 'cache'>> & {
    baseUrl: string
    prefixUrl: string
    url: string
}

export type RequestContext = {
    response: null | IsomorphicResponse
    request: FetchRequest
    error?: ErrorType | null
    data: any
}
