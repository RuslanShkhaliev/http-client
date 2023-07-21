import {
    CanceledRequest,
    HTTPError,
    InvalidUrl,
    TimeoutError,
} from './errors';
import {
    combineURL,
    deepMerge,
    getUrlWithQuery,
    mergeHeaders,
} from './helpers';
import {
    CacheService,
    CreateInstanceOptions,
    HTTP_METHODS,
    Hooks,
    InstanceOptions,
    IsoRequest,
    IsoResponse,
    NormalizedOptions,
    Request,
    RequestContext,
    RequestOptions,
    TimerType,
} from './types';

export class HttpClient {
    public static initialize(initOptions: CreateInstanceOptions) {
        const options = HttpClient.normalizeOptions(initOptions);

        return new HttpClient(options);
    }

    protected static normalizeOptions(initOptions: CreateInstanceOptions): NormalizedOptions {
        const {
            baseUrl = '',
            hooks,
            timeout = null,
            ...options
        } = initOptions ?? {};

        return {
            ...options,
            baseUrl,
            timeout,
            hooks: deepMerge({
                beforeRequest: [],
                afterResponse: [],
                beforeError: [],
            }, hooks),
        };
    }

    protected options: InstanceOptions;

    protected hooks: Hooks;

    protected cacheService?: CacheService;

    constructor(options: NormalizedOptions) {
        const {cacheService, hooks, ...globalOptions} = options;

        this.options = globalOptions;
        this.cacheService = cacheService;
        this.hooks = deepMerge({
            beforeRequest: [],
            afterResponse: [],
            beforeError: [],
        }, hooks);
    }

    public request(url: string, options: RequestOptions = {}) {
        if (!url.startsWith('http') && !url.startsWith('/')) {
            throw new InvalidUrl('Относительный путь должен начинаться со слеша');
        }
        const {prefix = ''} = options;

        const abortController = new AbortController();

        if (options.signal) {
            options.signal.addEventListener('abort', () => {
                abortController.abort();
            });
        }

        const request: Request = {
            url: combineURL(this.options.baseUrl, prefix, url),
            headers: mergeHeaders(this.options.headers, options.headers),
            timeout: options.timeout ?? this.options.timeout,
            method: options.method ?? HTTP_METHODS.GET,
            credentials: options.credentials ?? 'same-origin',
            body: options.body,
            signal: abortController.signal,
        };

        const config = {
            prefix,
            baseUrl: this.options.baseUrl,
            query: options.query,
            cache: options.cache,
            trace: options.trace === true,
        };

        const hooks = deepMerge(
            this.hooks,
            options.hooks,
        );

        if ((request.method === HTTP_METHODS.POST) && options.body && (typeof options.body !== 'string')) {
            request.body = JSON.stringify(options.body);
        }

        if (options.query) {
            request.url = getUrlWithQuery(url, options.query);
        }

        const context: RequestContext = {
            request,
            config,
            hooks,
        };

        const execute = async () => {
            if (this.cacheService && config.cache?.key !== undefined) {
                const data = await this.cacheService?.get(config.cache.key);

                if (data !== undefined && data !== null) {
                    return data;
                }
            }

            const response = await this.fetch(context);

            response.json = () => response.clone().json();

            const res = {
                response,
                data: await response.json(),
            };

            if (this.cacheService && config.cache?.key !== undefined && response) {
                this.cacheService.set(config.cache.key, res, config.cache.expire);
            }

            return res;
        };

        return {
            execute,
            cancelRequest: () => abortController.abort(),
        };
    }

    private async fetch(context: RequestContext) {
        const timer = {value: null};

        try {
            let response = await Promise.race<IsoResponse>([
                this.executeFetch(context),
                this.timeoutPromise(timer, context),
            ]);

            for (const hook of context.hooks.afterResponse) {
                const modifiedResponse = await hook(
                    context.request,
                    context.config,
                    response.clone(),
                );

                if (modifiedResponse instanceof globalThis.Response) {
                    response = modifiedResponse;
                }
            }

            if (!response.ok) {
                let error = new HTTPError(response, context.request, context.config);

                for (const hook of context.hooks.beforeError) {
                    error = await hook(error);
                }
                throw error;
            }

            return response;
        } catch (error: any) {
            if (error.name === 'AbortError') {
                // eslint-disable-next-line no-ex-assign
                error = new CanceledRequest(context.request, context.config);
            }
            throw error;
        }
    }

    protected async executeFetch(context: RequestContext): Promise<IsoResponse> {
        const {hooks} = context;
        let request = new globalThis.Request(context.request.url, context.request as any) as IsoRequest;

        for (const hook of hooks.beforeRequest) {
            const result = await hook(request, context.config);

            if (result instanceof globalThis.Request) {
                request = result;
                break;
            }
            if (result instanceof globalThis.Response) {
                return result;
            }
        }

        return this.options.fetch(request as any);
    }

    protected timeoutPromise(timer: TimerType, context: RequestContext): Promise<any> {
        return new Promise((_, rej) => {
            if (typeof context.request.timeout === 'number') {
                timer.value = setTimeout(() => {
                    const err = new TimeoutError(context.request, context.config);

                    clearTimeout(timer.value);
                    timer.value = null;

                    return rej(err);
                }, context.request.timeout);
            }
        });
    }
}
