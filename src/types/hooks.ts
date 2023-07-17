import {HTTPError} from '../errors';
import {RequestContext} from './request';

export type BeforeRequestHook = (ctx: RequestContext, cancel: () => void) => Promise<void> | void
export type AfterResponseHook = (ctx: RequestContext) => Promise<void> | void
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
