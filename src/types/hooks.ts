import {HTTPError} from '../errors';
import {IsoRequest, IsoResponse} from './globals';
import {Request, RequestConfig} from './options';

export type BeforeRequestHook = (request: IsoRequest, config: RequestConfig) => IsoRequest | IsoResponse | void | Promise<IsoRequest | IsoResponse | void>;
export type AfterResponseHook = (request: Request, config: RequestConfig, response: IsoResponse) => IsoResponse | void | Promise<IsoResponse | void>;
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

export type HookStaticMethods = {
    beforeRequest: {
        use: (hook: BeforeRequestHook) => BeforeRequestHook
        remove: (hook: BeforeRequestHook) => void
    }
    afterResponse: {
        use: (hook: AfterResponseHook) => AfterResponseHook
        remove: (hook: AfterResponseHook) => void
    }
    beforeError: {
        use: (hook: BeforeErrorHook) => BeforeErrorHook
        remove: (hook: BeforeErrorHook) => void
    }
}
