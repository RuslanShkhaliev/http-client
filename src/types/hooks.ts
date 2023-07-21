import {HTTPError} from '../errors';
import {IsoRequest, IsoResponse} from './globals';
import {Request, RequestConfig} from './request';

export type BeforeRequestHook = (request: IsoRequest, config: RequestConfig) => IsoRequest | IsoResponse | void | Promise<IsoRequest | IsoResponse | void>;
export type AfterResponseHook = (response: IsoResponse, request: Request, config: RequestConfig) => IsoResponse | void | Promise<IsoResponse | void>;
export type BeforeErrorHook = (error: HTTPError) => HTTPError | Promise<HTTPError>

export interface Hooks {
    /**
     * запустится сразу перед запросом
     * */
    beforeRequest?: BeforeRequestHook[]
    /**
     * запустится сразу после отвера на запрос
     */
    afterResponse?: AfterResponseHook[]
    /**
     * запустится сразу после ответа (4хх, 5хх) на запрос
     */
    beforeError?: BeforeErrorHook[]
}
