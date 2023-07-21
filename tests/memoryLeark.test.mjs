// @ts-nocheck
import {createInstance} from '../dist/esm/server.mjs';


class CacheService {
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
        }
        return Promise.resolve(data)
    }
    get size() {
        return this.cache.size
    }
}

const bytesToMb = (bytes) => +(Math.round(bytes / 1000) / 1000).toFixed(2);
const printAnalysis = (timer, processMs = 10000) => {
    const memory = [];

    setInterval(() => {
        console.clear();
        const usage = process.memoryUsage();

        const row = {
            rss: bytesToMb(usage.rss), // process resident set size
            heapTotal: bytesToMb(usage.heapTotal), // v8 heap size
            heapUsed: bytesToMb(usage.heapUsed), // v8 heap usage
            external: bytesToMb(usage.external), // C++ allocated
            stack: bytesToMb(usage.rss - usage.heapTotal), // stack
        };

        memory.push(row);
        console.table(memory);
    }, 1000);

    setTimeout(() => {
        clearInterval(timer);
    }, processMs);
};

// имитируем 4 разных клиента под разные задачи
const cacheService = new CacheService();
const fetchClient = createInstance({
    baseUrl: 'https://jsonplaceholder.typicode.com'
})


 {
    // тест с исполнением запроса
    let k = 0
    const timer = setInterval(async () => {
        try {
            // генерируем ключ для доступа к апи из коллекции
            await fetchClient(`/todos/${k++}`).execute()
            console.log('load')
        } catch(err) {
            console.log({err, k}, 'err')
        }
    }, 500)
    printAnalysis(timer, 30000)


    setTimeout(() => {
        console.log(cacheService.size)
        process.exit(0)
    }, 65000)
 }

