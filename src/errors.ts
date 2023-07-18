// eslint-disable-next-line max-classes-per-file
import {
    FetchRequest,
    IsoRequest,
    IsoResponse,
} from './types';

export class HTTPError extends Error {
    static CLIENT_ERRORS_BY_STATUS = {
        400: 'BadRequest',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'NotFound',
    };

    public response: IsoResponse;

    public request: FetchRequest;

    public statusCode?: number | string;

    constructor(response: IsoResponse, request: FetchRequest) {
        const code = (response.status ?? response.status === 0) ? response.status : '';

        super();

        this.name = HTTPError.CLIENT_ERRORS_BY_STATUS[code] ?? 'HTTPError';
        this.response = response;
        this.request = request;
        this.statusCode = code;
    }
}

export class TimeoutError extends Error {
    public request: Request;

    constructor(request: any) {
        super('Истекло время запроса');
        this.name = 'TimeoutError';
        this.request = request;
    }
}
export class CancelRequest extends Error {
    public request: IsoRequest;

    constructor(request: any) {
        super('Запрос был отменен');
        this.name = 'CancelRequest';
        this.request = request;
    }
}
export class InvalidUrl extends Error {
}

export type ErrorType =
    HTTPError |
    TimeoutError |
    CancelRequest |
    InvalidUrl
