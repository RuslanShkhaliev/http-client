import {
    AfterResponseHook,
    BeforeErrorHook,
    BeforeRequestHook,
    Hooks,
    InitOptions,
    SearchParams,
} from '../types';
import {isObject} from './is';

export function assert(condition: any, msg?: string): asserts condition {
    if (!condition) {
        throw new Error(String(msg));
    }
}

export const startTimer = () => {
    const init = Date.now();

    return () => Date.now() - init;
};

export const isAbsolute = (url: string) => /^(http|https):\/\//.test(url);

export const composeURL = (...urls: [baseUrl: string, prefixUrl: string, url: string]) => {
    const [,, urlPath] = urls;

    if (isAbsolute(urlPath)) {
        return urlPath;
    }
    const resultUrl = urls
        .map((url) => url?.replace(/^\/|\/$/g, ''))
        .filter(Boolean)
        .join('/');

    return isAbsolute(resultUrl) ? resultUrl : `/${resultUrl}`;
};
export const getUrlWithParams = (url: string, params: SearchParams) => {
    const textSearchParams = new URLSearchParams(params as unknown as URLSearchParams).toString();

    const searchParams = '?' + textSearchParams;

    return url.replace(/(?:\?.*?)?(?=#|$)/, searchParams);
};

type IObject = {
    [key: string]: any
}

export const deepMerge = <T extends Partial<IObject>>(...sources: (Partial<T> | undefined)[]): T => {
    let returnValue: any = {};

    for (const source of sources) {
        if (Array.isArray(source)) {
            if (!Array.isArray(returnValue)) {
                returnValue = [];
            }

            returnValue = [...returnValue, ...source];
        } else if (isObject(source)) {
            // eslint-disable-next-line prefer-const
            for (let [key, value] of Object.entries(source)) {
                if (isObject(value) && key in returnValue) {
                    value = deepMerge(returnValue[key], value);
                }

                returnValue = {...returnValue, [key]: value};
            }
        }
    }

    return returnValue;
};

export const setUseMethod = <T>(hooks: T[]) => (hook: T): T => {
    hooks.push(hook);

    return hook;
};
export const setRemoveHook = <T>(hooks: T[]) => (hook: T): void => {
    const index = hooks.indexOf(hook);

    if (hook) {
        hooks.splice(index, 1);
    }
};

export const getQuery = (input: string, ...queries: string[]): Record<string, string | null> => {
    const originalQueries = new URLSearchParams(input.replace(/.+\?/, ''));

    return queries.reduce((acc, key) => ({
        ...acc,
        [key]: originalQueries.get(key),
    }), {});
};

export const normalizeOptions = (options: InitOptions) => ({
    ...options,
    baseUrl: options.baseUrl ?? '',
    prefixUrl: options.prefixUrl ?? '',
    hooks: deepMerge(
        {
            beforeRequest: [],
            afterResponse: [],
            beforeError: [],
        },
        options.hooks,
    ),
    headers: options.headers ?? {},
    keepalive: true,
});

export const defineHooks = (hooks: Required<Hooks>) => ({
    beforeRequest: {
        use: setUseMethod<BeforeRequestHook>(hooks.beforeRequest),
        remove: setRemoveHook<BeforeRequestHook>(hooks.beforeRequest),
    },
    afterResponse: {
        use: setUseMethod<AfterResponseHook>(hooks.afterResponse),
        remove: setRemoveHook<AfterResponseHook>(hooks.afterResponse),
    },
    beforeError: {
        use: setUseMethod<BeforeErrorHook>(hooks.beforeError),
        remove: setRemoveHook<BeforeErrorHook>(hooks.beforeError),
    },
});
