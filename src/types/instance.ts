import {
    AfterResponseHook,
    BeforeErrorHook,
    BeforeRequestHook,
} from './hooks';
import {InitOptions, Options} from './options';

export type HTTPClient = {
    <T=any>(url: string, options?: Options): {abort: () => void; execute: () => Promise<T>}
    create(newInitConfig: InitOptions): HTTPClient
    extend(newInitConfig?: Partial<InitOptions>): HTTPClient
    hooks: {
        beforeError: {use: (hook: BeforeErrorHook) => BeforeErrorHook; remove: (hook: BeforeErrorHook) => void}
        beforeRequest: {use: (hook: BeforeRequestHook) => BeforeRequestHook; remove: (hook: BeforeRequestHook) => void}
        afterResponse: {use: (hook: AfterResponseHook) => AfterResponseHook; remove: (hook: AfterResponseHook) => void}
    }
}
