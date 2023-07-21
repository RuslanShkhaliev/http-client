import {combineURL, getUrlWithQuery} from '../src/helpers';

describe('Проверяем функции хелперы', () => {
    describe('composeURL', () => {
        it.each([
            {
                args: ['https://example.com', 'web-api', ''],
                expected: 'https://example.com/web-api',
            },
            {
                args: ['https://example.com', 'web-api', '/'],
                expected: 'https://example.com/web-api',
            },
            {
                args: ['https://example.com', '/web-api', ''],
                expected: 'https://example.com/web-api',
            },
            {
                args: ['https://example.com', '/web-api/', '/'],
                expected: 'https://example.com/web-api',
            },
            {
                args: ['https://example.com/', '/web-api/', '/home'],
                expected: 'https://example.com/web-api/home',
            },
            {
                args: ['https://example.com/', '/web-api/home', '/page/'],
                expected: 'https://example.com/web-api/home/page',
            },
            {
                args: ['https://example.com/', '/web-api/home/', '/page/'],
                expected: 'https://example.com/web-api/home/page',
            },
            {
                args: ['https://example.com', '', 'home'],
                expected: 'https://example.com/home',
            },
            {
                args: ['https://example.com', '', '/home'],
                expected: 'https://example.com/home',
            },
            {
                args: ['', 'web-api', '/home'],
                expected: '/web-api/home',
            },
            {
                args: ['', '/web-api/', '/home'],
                expected: '/web-api/home',
            },
            {
                args: ['', 'web-api', ''],
                expected: '/web-api',
            },
            {
                args: ['', '/web-api/', ''],
                expected: '/web-api',
            },
            {
                args: ['', '', 'home'],
                expected: '/home',
            },
            {
                args: ['', '', 'https://example.com'],
                expected: 'https://example.com',
            },
            {
                args: ['', 'https://example.com', 'home'],
                expected: 'https://example.com/home',
            },
            {
                args: ['/', 'https://example.com', 'home'],
                expected: 'https://example.com/home',
            },
            {
                args: ['/', 'https://example.com', 'https://home'],
                expected: 'https://home',
            },
            {
                args: ['/', undefined, '/home'],
                expected: '/home',
            },
        ])('объединяет baseUrl и url, создавая новый url', ({args, expected}) => {
            expect(combineURL(...args as [baseUrl: string, prefix: string, url: string])).toBe(expected);
        });
    });

    describe('appendUrlParams', () => {
        const url = 'https://example.com';
        const urlWithParams = `${url}?filter=desc&page=4`;

        it.each([
            {filter: 'desc', page: 4},
            [['filter', 'desc'], ['page', '4']],
            new URLSearchParams({filter: 'desc', page: '4'}),
            'filter=desc&page=4',
        ])('должен объеденить параметры с url', (params) => {
            // @ts-ignore
            expect(getUrlWithQuery(url, params)).toBe(urlWithParams);
        });

        it('должен переопределить параметры в url', () => {
            const url = 'https://example.com?page=4';
            const queryParams = {page: 3};

            expect(getUrlWithQuery(url, queryParams)).toBe('https://example.com?page=3');
        });
    });

    /* describe('createKeepAliveAgent', () => {
        let agent: any;
        let mockAgent: any;

        beforeEach(() => {
            agent = createKeepAliveAgent();
            mockAgent = jest.fn(agent);
        });
        it('должен вернуть инстанс http.Agent', () => {
            const url = new URL('http://example.com');

            expect(mockAgent(url)).toBeInstanceOf(http.Agent);
            expect(mockAgent).toHaveBeenCalled();
        });
        it('должен вернуть инстанс https.Agent', () => {
            const url = new URL('https://example.com');

            expect(mockAgent(url)).toBeInstanceOf(https.Agent);
            expect(mockAgent(url).keepAlive).toBe(true);
            expect(mockAgent).toHaveBeenCalled();
        });
    }); */
});
