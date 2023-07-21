import {CanceledRequest, TimeoutError} from '../src/errors';
import {createInstance} from '../src/server';

describe('Создание инстанса HttpModule', () => {
    it('функция createInstance', () => {
        const httpModule = createInstance();

        expect(httpModule).toBeDefined();
    });
    it('статический метод httpModule.create', () => {
        const httpModule = createInstance();
        const httpModuleNew = httpModule.create();

        expect(httpModuleNew).toBeDefined();
    });
    it('статический метод httpModule.extend', () => {
        const httpModule = createInstance();
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
        baseUrl: 'https://jsonplaceholder.typicode.com',
    });

    it('должен сделать запрос', async () => {
        const {data} = await httpModule('/todos/1').execute();

        expect(data).toEqual(mockResponse);
    });
});

describe('Отмена запроса', () => {
    const httpModule = createInstance({baseUrl: 'https://jsonplaceholder.typicode.com'});

    it('с помощью функции abort с опцией immediate:false', async () => {
        const {cancelRequest, execute} = httpModule('/todos/1');

        cancelRequest();

        try {
            await execute();
        } catch (e) {
            expect(e).toBeInstanceOf(CanceledRequest);
        }
    });

    it('отмена запроса с передачей signal', () => {
        const abortController = new AbortController();

        httpModule('/todos/1', {signal: abortController.signal})
            .execute()
            .catch((err) => {
                expect(err).toBeInstanceOf(CanceledRequest);
            });
        abortController.abort();
    });

    it('отмена запроса по таймауту', () => {
        httpModule('/todos/1', {timeout: 5})
            .execute()
            .catch((err) => {
                expect(err).toBeInstanceOf(TimeoutError);
            });
    });
});
