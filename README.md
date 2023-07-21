НЕ ИСПОЛЬЗУЙТЕ В ПРОДАКШЕНЕ. Библиотека требует доработки и используется для личных нужд

# httpClient

Библиотека является оберткой над fetch/[nodeFetch](https://www.npmjs.com/package/node-fetch/v/2.6.1) и предоставляет интерфейс для работы с запросами HTTP как в браузере, так и на стороне сервера,



## Установка

```bash
  yarn add http-client
```

## Features

- Поддержка тайм-аута
- Опция префикса URL
- Передача параметров (searchParams) для запроса
- Хуки запроса
- Коды состояния, отличные от 2xx, рассматриваются как ошибки
- Типизированные ошибки
- Экземпляры с пользовательскими настройками по умолчанию
- Логгирование ошибок на стороне сервера
- Трейсинг запроса
- Keepalive соединение
- AbortController "из коробки"
- Работа с кешем (при передаче кеш сервиса)
- Нативный фетч (client-side)

## Применение
```ts
import httpClient from 'http-client';

const data = await httpClient('https://jsonplaceholder.typicode.com/todos/1').execute()

console.log(data)
// =>
/*{
  "userId": 1,
  "id": 1,
  "title": "delectus aut autem",
  "completed": false
}*/
```

```ts
import httpClient from 'http-client';

const {execute, abort} = httpClient('https://jsonplaceholder.typicode.com/todos/1')

setTimeout(abort, 5000)

try {
    await execute()
} catch(err) {
    console.log(err)
}
// => CanceledRequest: Запрос был отменен

```
## API

### createInstance(defaultOptions):

```ts
import {createInstance} from 'http-client'

const httpClient = createInstance({
    baseUrl: 'http://example.com',
    headers,
})

```
### httpClient.create(defaultOptions):

```ts
import httpClient from 'http-client'

const newHttpModule = httpClient.create({
    baseUrl: 'http://example.com',
    headers,
})

```

### httpClient.extend(defaultOptions):

Метод создает новый экземпляр наследуя дефолтные опции, которые можно
переопределить новыми.

```ts
import {createInstance} from 'http-client'

const httpClient = createInstance({
    baseUrl: 'http://example.com'
})

await httpClient('/home').execute()

// => http://example.com/home

const webApiHttp = httpClient.extend({prefix: '/web-api'})

await webApiHttp('/home').execute()

// request to: http://example.com/web-api/home

```

### httpClient.hooks[beforeRequest, afterResponse, beforeError]

Статический метод который дает возможность добавить или удалить хук
Добавляет новый хук в массив хуков переданных при инициализации клиента, но до хуков конкретного запроса.

```ts
httpClient.hooks.afterResponse.use(tokenHook)
httpClient.hooks.afterResponse.remove(loggerHook)

```


### Опции инстанса

#### fetch
Тип: `function`\
По умолчанию: `node-fetch` на сервере, `fetch` на клиенте

Пользовательская fetch функция. Должна быть совместима со стандартом [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

#### logger
Тип `ILogger`\
Примечание:
- необязательный параметр

#### cacheService
Тип `CacheService`\
По умолчанию: `null`

#### baseUrl

Тип: `string`\
По умолчанию: `''`

Префикс, который следует добавлять перед URL-адресом при выполнении запроса. Это может быть любой допустимый URL-адрес, относительный или абсолютный для client-side и абсолютный для server-side. Слеш `/` в конце не является обязательным и при необходимости будет удален/вставлен ​​автоматически при соединении с url.

```ts
import {createInstance} from 'http-client'

const httpClient = createInstance({ baseUrl: 'https://example.com'})
const data = await httpClient('/getSports'}).execute()

// => 'https://example.com/getSpors'

```

Примечание:
- Начальные слеши `url` обязательны, это обеспечивает согласованность и помогает избегать путаницы в отношении того, как обрабатывается URL-адрес.


### Опции запроса

#### method
Тип: `string`\
По умолчанию: `'get'`

#### query
Тип: `string[][] | Record<string, string | number> | string | URLSearchParams`\
По умолчанию: `''`

Параметры поиска для включения в URL-адрес запроса. Установка этого параметра переопределит все существующие параметры поиска во входном URL-адресе.

Принимает любое значение, поддерживаемое URLSearchParams().

#### prefix

Тип: `string`\
По умолчанию: `''`

Префикс, который будет добавлен перед `url`, но после `baseUrl`

Полезно при использовании [`httpClient.extend()`](#httpClientextenddefaultOptions) для создания специфичных для ниши экземпляров.

```js
import {createInstance} from 'http-client'

const httpClient = createInstance({baseUrl: 'https://example.com', prefix: '/api/v2'})

const webApiHttp = httpClient.extends({prefix: '/web-api'})

const response = await webApiHttp('getSports')

// => 'https://example.com/web-api/getSpors'

```

#### timeout
Тип: `number`\
По умолчанию: не задан

#### signal
Тип: `AbortSignal`\
По умолчанию: null

`Fetch` (и, следовательно, `httpClient`) имеет встроенную поддержку отмены запросов через [AbortController Api](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)

```ts
import httpClient, {CanceledRequest} from 'http-client'

const abortController = new AbortController()

const {signal} = abortController

setTimeout(() => {
    controller.abort()
}, 5000)

try {
    await httpClient(url, {signal})
} catch(err) {
    // if (err.name === 'CanceledRequest') {
    //     console.log(err.message)
    // }
    if (err instanceof CanceledRequest) {
        console.log(err.message)
    } else {
        console.error('Ошибка запроса:', error)
    }
}
// => CanceledRequest: Запрос был отменен

```

Примечание:

httpClient создает `AbortController` для каждого запроса под капотом, поэтому нет необходимости
прокидывать его снаружи. Однако, одно другому не мешает и не вызывает конфликтов.

#### hooks
Тип: `object<string, Function[]>`\
По умолчанию: `{beforeRequest: [], afterResponse: [], beforeError: []}`

Хуки позволяют вносить изменения в течение жизненного цикла запроса. Хуки-функции могут быть асинхронными и запускаться последовательно.

Хуки `beforeRequest` и `afterResponse` получают в качестве аргументов контекст запроса `context` и ничего не возвращают, все изменения вносятся путем мутации контекста

##### context
Тип: `object`\
По умолчанию:
```ts
{
    request: object,
    response: Response | null,
    data: any,
    error: HTTPError | null,
}
```

###### hooks.beforeRequest
Тип: `Function[]`\
По умолчанию: `[]`

Этот хук позволяет изменить запрос прямо перед его отправкой.
Функция получает `context` и функцию `cancel` в качестве аргументов. Например, вы можете изменить `context.request.headers` или отменить запрос вызвав метод `cancel()`.

```ts
import httpClient from 'http-client'

const api = httpClient.extend({
    hooks: {
        beforeRequest: [
            ({request}, _cancel) => {
                request.headers['X-Requested-With'] = 'httpClient'
            }
        ]
    }
})

```


