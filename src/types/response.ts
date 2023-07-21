import {IsoResponse} from './globals';

type FetchResponse<T> = {
    data: T
    response: IsoResponse
}

export type HttpClientResponse<T> = {
    cancelRequest: () => void
    execute: () => Promise<{
        data: T
        response: IsoResponse
    }>
}
