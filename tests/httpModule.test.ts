import nodeFetch from 'node-fetch';
import {CancelRequest, TimeoutError} from '../src/errors';
import {createInstance} from '../src/server';

describe('Создание инстанса HttpModule', () => {
    it('функция createInstance', () => {
        const httpModule = createInstance({fetch: nodeFetch, logger: console});

        expect(httpModule).toBeDefined();
    });
    it('статический метод httpModule.create', () => {
        const httpModule = createInstance({fetch: nodeFetch, logger: console});
        const httpModuleNew = httpModule.create({fetch: nodeFetch, logger: console});

        expect(httpModuleNew).toBeDefined();
    });
    it('статический метод httpModule.create', () => {
        const httpModule = createInstance({fetch: nodeFetch, logger: console});
        const httpModuleExtended = httpModule.extend();

        expect(httpModuleExtended).toBeDefined();
    });
});

const mockResponse = {
    userId: 1,
    id: 1,
    title: 'delectus aut autem',
    completed: false,
};

describe('Проверка работоспособности httpModule', () => {
    const httpModule = createInstance({
        prefixUrl: 'https://jsonplaceholder.typicode.com',
        logger: console,
    });

    it('должен сделать запрос', async () => {
        const data = await httpModule('/todos/1').execute();

        expect(data).toEqual(mockResponse);
    });
});

describe('Отмена запроса', () => {
    const httpModule = createInstance({fetch: nodeFetch, prefixUrl: 'https://jsonplaceholder.typicode.com', logger: console});

    it('с помощью функции abort с опцией immediate:false', async () => {
        const {abort, execute} = httpModule('/todos/1');

        abort();

        try {
            await execute();
        } catch (e) {
            expect(e).toBeInstanceOf(CancelRequest);
        }
    });

    it('отмена запроса с передачей signal', () => {
        const abortController = new AbortController();

        httpModule('/todos/1', {signal: abortController.signal})
            .execute()
            .catch((err) => {
                expect(err).toBeInstanceOf(CancelRequest);
            });
        abortController.abort();
    });

    it('отмена запроса по таймауту', () => {
        httpModule('/todos/1', {timeout: 5, keepalive: false})
            .execute()
            .catch((err) => {
                expect(err).toBeInstanceOf(TimeoutError);
            });
    });
});
