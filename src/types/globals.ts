import nodeFetch, {
    HeadersInit as NodeHeadersInit,
    Request as NodeRequest,
    RequestInit as NodeRequestInit,
    Response as NodeResponse,
} from 'node-fetch';

export type IsoResponse = Response | NodeResponse
export type IsoRequest = Request | NodeRequest
export type IsoHeaders = HeadersInit | NodeHeadersInit
export type IsoRequestInit = RequestInit | NodeRequestInit
export type IsoFetch = typeof nodeFetch | typeof globalThis.fetch
