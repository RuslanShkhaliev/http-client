import {assert, deepMerge} from './helpers';
import {HttpClient} from './httpClient';
import {
    CreateInstanceOptions,
    HTTPClientInstance,
    InstanceOptions,
    RequestOptions,
} from './types';

export const createInstance = (initOptions: Partial<CreateInstanceOptions> = {}): HTTPClientInstance => {
    initOptions.fetch ??= globalThis.fetch.bind(globalThis);

    assert(typeof initOptions.fetch === 'function', 'fetch обязательное поле');

    const IsoHttpClientInstance = HttpClient.initialize(initOptions as CreateInstanceOptions);

    const isoHttpClient = (url: string, options: RequestOptions = {}) => IsoHttpClientInstance.request(url, options);

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
