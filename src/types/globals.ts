import {
    HeadersInit as NodeHeadersInit,
    Request as NodeRequest,
    Response as NodeResponse,
} from 'node-fetch';

export type IsoResponse = Response | NodeResponse
export type IsoRequest = Request | NodeRequest
export type IsoHeaders = HeadersInit | NodeHeadersInit
