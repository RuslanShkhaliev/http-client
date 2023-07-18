import {ErrorType} from '../errors';
import {IsoResponse} from './globals';
import {Options} from './options';

export type FetchRequest = Partial<Omit<Options, 'fetch' | 'hooks' | 'immediate' | 'trace' | 'cache'>> & {
    baseUrl: string
    prefixUrl: string
    url: string
}

export type RequestContext = {
    response: null | IsoResponse
    request: FetchRequest
    error?: ErrorType | null
    data: any
}
