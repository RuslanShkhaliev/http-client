// eslint-disable-next-line max-classes-per-file
import {
    IsoResponse,
    Request,
    RequestConfig,
} from './types';

export class HTTPError extends Error {
    static CLIENT_ERRORS_BY_STATUS = {
        400: 'BadRequest',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'NotFound',
    };

    public response: IsoResponse;

    public config: RequestConfig;

    public request: Request;

    public statusCode?: number | string;

    constructor(response: IsoResponse, request: Request, config: RequestConfig) {
        const code = (response.status || response.status === 0) ? response.status : '';
        const title = response.statusText || '';
        const status = `${code} ${title}`.trim();
        const reason = status ? `status code ${status}` : 'an unknown error';

        super(`Request failed with ${reason}`);

        this.name = HTTPError.CLIENT_ERRORS_BY_STATUS[code] ?? 'HTTPError';
        this.response = response;
        this.request = request;
        this.statusCode = code;
        this.config = config;
    }
}

export class TimeoutError extends Error {
    public request: Request;

    public config?: RequestConfig;

    constructor(request: Request, config?: RequestConfig) {
        super('Request Timeout');
        this.name = 'TimeoutError';
        this.request = request;
        this.config = config;
    }
}
export class CanceledRequest extends Error {
    public request: Request;

    public config?: RequestConfig;

    constructor(request: Request, config?: RequestConfig) {
        super('request was cancelled');
        this.name = 'CanceledRequest';
        this.request = request;
        this.config = config;
    }
}
export class InvalidUrl extends Error {
}

export type ErrorType =
    HTTPError |
    TimeoutError |
    CanceledRequest |
    InvalidUrl
