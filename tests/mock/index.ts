import {CacheService} from '../../src/types';

export const createMockCacheService = (shouldThrowError?: boolean): CacheService => {
    const cache = new Map();

    return {
        set(key: string, value: any, exp?: number) {
            if (shouldThrowError) {
                throw new Error('ошибка сохранения в кеш');
            }
            cache.set(key, value);

            return Promise.resolve();
        },
        get(key: string) {
            return new Promise((res, rej) => {
                if (shouldThrowError) {
                    rej(new Error('ошибка чтения из кеша'));
                }
                res(cache.get(key));
            });
        },
    };
};
