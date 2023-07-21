import http from 'http';
import https from 'https';
import nodeFetch, {
    Headers,
    Request,
    Response,
} from 'node-fetch';
import {assert, deepMerge} from './helpers';
import {isServer} from './helpers/is';
import {HttpClient} from './httpClient';
import {
    CreateInstanceOptions,
    HTTPClientInstance,
    InstanceOptions,
    RequestOptions,
} from './types';

const createKeepAliveAgent = () => {
    const httpAgent = new http.Agent({keepAlive: true});
    const httpsAgent = new https.Agent({keepAlive: true});

    return (url: URL) => (url.protocol === 'https:' ? httpsAgent : httpAgent);
};

export const createInstance = (initOptions: Partial<CreateInstanceOptions> = {}): HTTPClientInstance => {
    if (!globalThis.Request) {
        Object.assign(globalThis, {Request});
    }
    if (!globalThis.Headers) {
        Object.assign(globalThis, {Headers});
    }
    if (!globalThis.Response) {
        Object.assign(globalThis, {Response});
    }

    initOptions.fetch ??= typeof globalThis.fetch === 'function' ? globalThis.fetch.bind(globalThis) : nodeFetch;

    assert(typeof initOptions.fetch === 'function', 'fetch обязательное поле');

    const IsoHttpClientInstance = HttpClient.initialize(initOptions as CreateInstanceOptions);

    const isoHttpClient = (url: string, options: RequestOptions = {}) => {
        if (isServer) {
            options.agent = createKeepAliveAgent();
        }

        return IsoHttpClientInstance.request(url, options);
    };

    isoHttpClient.create = (newOptions: Partial<CreateInstanceOptions> = {}) => createInstance(newOptions);
    isoHttpClient.extend = (newOptions: Partial<CreateInstanceOptions> = {}) => createInstance(deepMerge(initOptions, newOptions));

    return isoHttpClient;
};

export * from './errors';
export type {
    InstanceOptions,
    RequestOptions,
    HTTPClientInstance,
};
