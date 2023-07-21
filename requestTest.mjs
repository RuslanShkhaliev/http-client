import {createInstance} from './dist/esm/server.mjs';


class CacheMap {
    cache = new Map()
    async set(key, val, expire) {
        this.cache.set(key, val)
        if (expire) {
            let timer = setTimeout(() => {
                this.cache.delete(key)
                clearTimeout(timer)
                timer = null
            }, expire)
        }

        return this
    }
    async get(key) {
        const data = this.cache.get(key)
        if (data) {
            data.data.isCached = true
            console.log('Попадание в кеш')
        }
        return Promise.resolve(data)
    }
}

const cache = new CacheMap()

const url = 'https://jsonplaceholder.typicode.com'
const isoHttp = createInstance({
    baseUrl: url,
    cacheService: cache,
})

await isoHttp(`/todo/75`, {cache: {key: 75, expire: 13300}, hooks: {
    afterResponse: [
        (request, config, response) => {
            console.log('response', request.status, response.status)
        }
    ],
            //beforeError: [
            //    (err) => {
            //        console.log(err)
            //    }
            //],
            //beforeRequest: [
            //    (request, config) => {
            //        console.log(config)
            //    }
            //]
    }} ).execute()
.catch((err) => {})
