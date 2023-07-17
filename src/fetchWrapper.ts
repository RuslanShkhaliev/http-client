import {
    CancelRequest,
    HTTPError,
    InvalidUrl,
    TimeoutError,
} from './errors';
import {
    composeURL,
    getQuery,
    getUrlWithParams,
    startTimer,
} from './helpers';
import {isEmpty, isServer} from './helpers/is';
import {Config, RequestContext} from './types';

enum ABORT_REASON {
    TIMEOUT,
    CANCEL
}

enum FETCH_METHODS {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

export function fetchWrapper<T = any>(url: string, options: Config) {
    if (!url.startsWith('http') && !url.startsWith('/')) {
        throw new InvalidUrl('Относительный путь должен начинаться со слеша');
    }
    const normalizeOptions = {
        url: composeURL(
            options.baseUrl,
            options.prefixUrl,
            url,
        ),
        method: FETCH_METHODS.GET,
        ...options,
        params: options.params ?? {},
        credentials: options.credentials ?? 'same-origin',
        redirect: options.redirect ?? 'manual',
        trace: options.trace === true,
    };

    if (!isEmpty(normalizeOptions.params)) {
        normalizeOptions.url = getUrlWithParams(normalizeOptions.url, normalizeOptions.params);
    }

    const {
        hooks, logger, cacheService, cache, fetch, trace,
        ...request
    } = normalizeOptions;

    const config = {cache, trace};

    const {beforeRequest, afterResponse, beforeError} = hooks;

    const withCache = cacheService && cache?.key;

    const abortController = new AbortController();
    let abortReason: ABORT_REASON;

    const cancelRequest = () => {
        abortController.abort();
        abortReason = ABORT_REASON.CANCEL;
    };

    const cancelByTimeout = () => {
        abortController?.abort();
        abortReason = ABORT_REASON.TIMEOUT;
    };

    if (options.signal) {
        options.signal.addEventListener('abort', cancelRequest);
    }

    if (normalizeOptions.method.toUpperCase() === FETCH_METHODS.POST && typeof normalizeOptions.body !== 'string') {
        request.body = JSON.stringify(request.body);
    }
    request.signal = abortController.signal;

    const execute = async (): Promise<T> => {
        if (withCache) {
            const cacheData = await cacheService.get(cache.key);

            if (cacheData) {
                return cacheData;
            }
        }

        const context: RequestContext = {
            request,
            response: null,
            data: null,
            error: null,
        };

        for (const hook of beforeRequest) {
            await hook(context, cancelRequest);
        }

        const stopTraceTimer = config.trace ? startTimer() : null;
        let timeoutId: null | ReturnType<typeof setTimeout> = null;

        if (request.timeout) {
            timeoutId = setTimeout(cancelByTimeout, request.timeout);
        }

        // @ts-ignore
        return fetch(request.url, request)
            .then(async (fetchResponse) => {
                context.response = fetchResponse;

                if (fetchResponse.ok) {
                    try {
                        context.data = await fetchResponse.json();
                    } catch (error) {
                        if (isServer) {
                            logger?.error({
                                description: 'Ошибка парсинга json',
                                error,
                            });
                        }
                    }
                }

                for (const hook of afterResponse) {
                    await hook(context);
                }

                if (context.response.ok && withCache && context.data) {
                    cacheService.set(cache.key, context.data, cache.expire);
                }

                if (!context.response.ok) {
                    context.error = new HTTPError(context.response, context.request);
                }
                const {trace: queryTrace} = getQuery(request.url, 'trace');

                if (config.trace ?? queryTrace) {
                    logger?.info({
                        type: 'Trace Log',
                        ...context,
                        config,
                        time: stopTraceTimer?.(),
                    });
                }

                if (context.error) {
                    throw context.error;
                }

                return context.data;
            })
            .catch(async (err) => {
                context.error = err;

                if (abortController?.signal?.aborted) {
                    context.error = abortReason === ABORT_REASON.TIMEOUT
                        ? new TimeoutError(request)
                        : new CancelRequest(request);
                }

                for (const hook of beforeError) {
                    context.error = await hook(context.error as HTTPError);
                }

                if (isServer && logger) {
                    logger?.error({
                        ...context,
                        config,
                    });
                }

                throw context.error;
            })
            .finally(() => {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                }
            });
    };

    const dummyAbort = () => {
        logger?.log('Нельзя отменить запрос на сервере');
    };

    return {
        abort: isServer ? dummyAbort : cancelRequest,
        execute,
    };
}
