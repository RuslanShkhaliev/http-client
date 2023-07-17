import {Request as NodeRequest, Response as NodeResponse} from 'node-fetch';

export type IsomorphicResponse = Response | NodeResponse
export type IsomorphicRequest = Request | NodeRequest
