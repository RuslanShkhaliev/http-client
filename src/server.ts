import http from 'http';
import https from 'https';
import nodeFetch from 'node-fetch';
import {fetchWrapper} from './fetchWrapper';
import {
    assert,
    deepMerge,
    defineHooks,
    normalizeOptions,
} from './helpers';
import {
    Config,
    HTTPClient,
    InitOptions,
    Options,
} from './types';

const createKeepAliveAgent = () => {
    const httpAgent = new http.Agent({keepAlive: true});
    const httpsAgent = new https.Agent({keepAlive: true});

    return (url: URL) => (url.protocol === 'https:' ? httpsAgent : httpAgent);
};

export const createInstance = (initOptions: InitOptions) => {
    const normalizedOptions = {
        ...normalizeOptions(initOptions || {}),
        fetch: initOptions?.fetch ?? nodeFetch,
        agent: createKeepAliveAgent(),
    };

    assert(typeof normalizedOptions.fetch === 'function', 'fetch обязательное поле');
    const httpClient = <T>(
        url: string,
        options?: Options,
    ) => // @ts-ignore
        // eslint-disable-next-line implicit-arrow-linebreak
            fetchWrapper<T>(url, deepMerge(normalizedOptions as unknown as Config, options));

    httpClient.create = (newInitOptions: InitOptions) => createInstance(newInitOptions);
    httpClient.extend = (newInitOptions?: Partial<InitOptions>) => createInstance(deepMerge(normalizedOptions as unknown as Config, newInitOptions));
    httpClient.hooks = defineHooks(normalizedOptions.hooks);

    return httpClient;
};

export * from './errors';
export type {
    InitOptions,
    Options,
    HTTPClient,
};
