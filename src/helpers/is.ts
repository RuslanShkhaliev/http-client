export const isObject = (value: unknown): value is object => value !== null && typeof value === 'object';
export const isEmpty = (value: any): boolean => !isObject(value) || Object.keys(value).length === 0;
export const isServer = typeof process !== 'undefined'
    && process.versions != null
    && process.versions.node != null;
