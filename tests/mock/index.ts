export class CacheService {
    cache = new Map();

    async set(key: string, val: any, expire?: number) {
        this.cache.set(key, val);
        if (expire) {
            let timer: any = setTimeout(() => {
                this.cache.delete(key);
                clearTimeout(timer);
                timer = null;
            }, expire);
        }

        return this;
    }

    get(key: string) {
        const data = this.cache.get(key);

        if (data) {
            data.data.isCached = true;
        }

        return data;
    }
}
