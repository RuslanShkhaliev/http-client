import {
    HeadersInit,
    SearchParamsInit,
    SearchParamsOption,
} from '../types';
import {isObject} from './is';

export function assert(condition: any, msg?: string): asserts condition {
    if (!condition) {
        throw new Error(String(msg));
    }
}

export const isAbsolute = (url: string) => /^(http|https):\/\//.test(url);

export const combineURL = (...urls: [baseUrl: string, prefix: string, url: string]) => {
    const [, prefix, urlPath] = urls;

    if (isAbsolute(urlPath) && !isAbsolute(prefix)) {
        const prefixUrl = prefix.length ? `/${prefix}` : '';

        return `${urlPath}${prefixUrl}`.replace(/(\/\/) | (\/\$)/g, '/');
    } if (isAbsolute(urlPath)) {
        return urlPath;
    }
    const resultUrl = urls
        .map((url) => url?.replace(/^\/|\/$/g, ''))
        .filter(Boolean)
        .join('/');

    return isAbsolute(resultUrl) ? resultUrl : `/${resultUrl}`;
};
export const getUrlWithQuery = (url: string, searchParams: SearchParamsOption) => {
    const textSearchParams = typeof searchParams === 'string'
        ? searchParams.replace(/^\?/, '')
        : new URLSearchParams(searchParams as SearchParamsInit).toString();

    return url.replace(/(?:\?.*?)?(?=#|$)/, '?' + textSearchParams);
};

export const mergeHeaders = (h1: HeadersInit = {}, h2: HeadersInit = {}) => {
    const result = new globalThis.Headers(h1 as any);
    const isHeadersInstance = h2 instanceof globalThis.Headers;
    const source = new globalThis.Headers(h2 as any);

    for (const [key, value] of source.entries()) {
        if ((isHeadersInstance && value === 'undefined') || value === undefined) {
            result.delete(key);
        } else {
            result.set(key, value);
        }
    }

    return result;
};

export const deepMerge = <T>(...sources: Array<Partial<T> | undefined>): T => {
    let returnValue: any = {};
    let headers = {};

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

            if (isObject((source as any).headers)) {
                headers = mergeHeaders(headers, (source as any).headers);
                returnValue.headers = headers;
            }
        }
    }

    return returnValue;
};

export const getQuery = (input: string, ...queries: string[]): Record<string, string | null> => {
    const originalQueries = new URLSearchParams(input.replace(/.+\?/, ''));

    return queries.reduce((acc, key) => ({
        ...acc,
        [key]: originalQueries.get(key),
    }), {});
};
