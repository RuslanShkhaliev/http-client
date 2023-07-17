import nodeFetch from 'node-fetch';

export type FetchClient = typeof nodeFetch | typeof window.fetch
export type SearchParams = Record<string, any>
