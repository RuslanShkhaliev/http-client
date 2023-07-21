import {IsoResponse} from './globals';
import {CreateInstanceOptions} from './options';
import {RequestOptions} from './request';

export type HTTPClientInstance = {
    <T = unknown>(url: string, options?: RequestOptions): {
        cancelRequest: () => void
        execute: () => Promise<{
            data: T
            response: IsoResponse
        }>
    }
    create(newOptions?: Partial<CreateInstanceOptions>): HTTPClientInstance
    extend(newOptions?: Partial<CreateInstanceOptions>): HTTPClientInstance
}
