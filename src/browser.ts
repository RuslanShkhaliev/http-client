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

export const createInstance = (initOptions: InitOptions) => {
    const normalizedOptions = {
        ...normalizeOptions(initOptions),
        fetch: initOptions?.fetch ?? window.fetch.bind(window),
    };

    assert(typeof normalizedOptions.fetch === 'function', 'fetch обязательное поле');

    const httpClient = <T>(
        url: string,
        options?: Options,
    ) => fetchWrapper<T>(url, deepMerge(normalizedOptions as Config, options as Config));

    httpClient.create = (newInitOptions: InitOptions) => createInstance(newInitOptions);
    // @ts-ignore
    httpClient.extend = (newInitOptions?: Partial<InitOptions>) => createInstance(deepMerge(normalizedOptions, newInitOptions));
    httpClient.hooks = defineHooks(normalizedOptions.hooks);

    return httpClient;
};

export * from './errors';
export type {
    InitOptions,
    Options,
    HTTPClient,
};
