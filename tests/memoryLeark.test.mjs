// @ts-nocheck
import httpModule from '../dist/index.js'

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
const cacheService = new Map();

const fetchClient = httpModule.create({
    logger: console,
    cacheService,
})

const queue = [1, 1, 1, 1, 1];
const request = async () => {
    for await (const execute of queue) {
        const response = await fetchClient(`https://jsonplaceholder.typicode.com/todos/${Math.floor(Math.random() * 10)}`, {}, {cache: {key: 1}}).execute();
        const data = response.json();

        console.log(data);
    }
};

request();
setTimeout(() => {
    console.log(cacheService);
}, 3000);

//
// {
//    // тест с исполнением запроса
//    let k = 0
//    const timer = setInterval(async () => {
//        try {
//            // генерируем ключ для доступа к апи из коллекции
//            await fetchClient(`https://jsonplaceholder.typicode.com/todos/${k + 1}`, {}, {cache: { cacheKey: Date.now() + Math.random()}}).execute()
//        } catch(err) {
//            console.log(err, 'err')
//        }
//    })
//    printAnalysis(timer, 30000)
//
//
//    setTimeout(() => {
//        console.log(cacheService.size)
//        process.exit(0)
//    }, 65000)
// }

// {
//    const timer = setInterval(() => {
//        try {
//            const apiKey = randomFrom(api)
//            api[apiKey](`https://jsonplaceholder.typicode.com/todos/${apiKey + 1}`)
//        } catch(err) {
//
//        }
//    }, 5)
//
//    printAnalysis(timer, 150000)
// }
