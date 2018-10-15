/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Manages an instance of `LruState` and moves URLs to the head of the
 * chain when requested.
 */
class LruList {
    constructor(state) {
        if (state === undefined) {
            state = {
                head: null,
                tail: null,
                map: {},
                count: 0,
            };
        }
        this.state = state;
    }
    /**
     * The current count of URLs in the list.
     */
    get size() { return this.state.count; }
    /**
     * Remove the tail.
     */
    pop() {
        // If there is no tail, return null.
        if (this.state.tail === null) {
            return null;
        }
        const url = this.state.tail;
        this.remove(url);
        // This URL has been successfully evicted.
        return url;
    }
    remove(url) {
        const node = this.state.map[url];
        if (node === undefined) {
            return false;
        }
        // Special case if removing the current head.
        if (this.state.head === url) {
            // The node is the current head. Special case the removal.
            if (node.next === null) {
                // This is the only node. Reset the cache to be empty.
                this.state.head = null;
                this.state.tail = null;
                this.state.map = {};
                this.state.count = 0;
                return true;
            }
            // There is at least one other node. Make the next node the new head.
            const next = this.state.map[node.next];
            next.previous = null;
            this.state.head = next.url;
            node.next = null;
            delete this.state.map[url];
            this.state.count--;
            return true;
        }
        // The node is not the head, so it has a previous. It may or may not be the tail.
        // If it is not, then it has a next. First, grab the previous node.
        const previous = this.state.map[node.previous];
        // Fix the forward pointer to skip over node and go directly to node.next.
        previous.next = node.next;
        // node.next may or may not be set. If it is, fix the back pointer to skip over node.
        // If it's not set, then this node happened to be the tail, and the tail needs to be
        // updated to point to the previous node (removing the tail).
        if (node.next !== null) {
            // There is a next node, fix its back pointer to skip this node.
            this.state.map[node.next].previous = node.previous;
        }
        else {
            // There is no next node - the accessed node must be the tail. Move the tail pointer.
            this.state.tail = node.previous;
        }
        node.next = null;
        node.previous = null;
        delete this.state.map[url];
        // Count the removal.
        this.state.count--;
        return true;
    }
    accessed(url) {
        // When a URL is accessed, its node needs to be moved to the head of the chain.
        // This is accomplished in two steps:
        //
        // 1) remove the node from its position within the chain.
        // 2) insert the node as the new head.
        //
        // Sometimes, a URL is accessed which has not been seen before. In this case, step 1 can
        // be skipped completely (which will grow the chain by one). Of course, if the node is
        // already the head, this whole operation can be skipped.
        if (this.state.head === url) {
            // The URL is already in the head position, accessing it is a no-op.
            return;
        }
        // Look up the node in the map, and construct a new entry if it's
        const node = this.state.map[url] || { url, next: null, previous: null };
        // Step 1: remove the node from its position within the chain, if it is in the chain.
        if (this.state.map[url] !== undefined) {
            this.remove(url);
        }
        // Step 2: insert the node at the head of the chain.
        // First, check if there's an existing head node. If there is, it has previous: null.
        // Its previous pointer should be set to the node we're inserting.
        if (this.state.head !== null) {
            this.state.map[this.state.head].previous = url;
        }
        // The next pointer of the node being inserted gets set to the old head, before the head
        // pointer is updated to this node.
        node.next = this.state.head;
        // The new head is the new node.
        this.state.head = url;
        // If there is no tail, then this is the first node, and is both the head and the tail.
        if (this.state.tail === null) {
            this.state.tail = url;
        }
        // Set the node in the map of nodes (if the URL has been seen before, this is a no-op)
        // and count the insertion.
        this.state.map[url] = node;
        this.state.count++;
    }
}
/**
 * A group of cached resources determined by a set of URL patterns which follow a LRU policy
 * for caching.
 */
export class DataGroup {
    constructor(scope, adapter, config, db, prefix) {
        this.scope = scope;
        this.adapter = adapter;
        this.config = config;
        this.db = db;
        this.prefix = prefix;
        /**
         * Tracks the LRU state of resources in this cache.
         */
        this._lru = null;
        this.patterns = this.config.patterns.map(pattern => new RegExp(pattern));
        this.cache = this.scope.caches.open(`${this.prefix}:dynamic:${this.config.name}:cache`);
        this.lruTable = this.db.open(`${this.prefix}:dynamic:${this.config.name}:lru`);
        this.ageTable = this.db.open(`${this.prefix}:dynamic:${this.config.name}:age`);
    }
    /**
     * Lazily initialize/load the LRU chain.
     */
    async lru() {
        if (this._lru === null) {
            const table = await this.lruTable;
            try {
                this._lru = new LruList(await table.read('lru'));
            }
            catch (e) {
                this._lru = new LruList();
            }
        }
        return this._lru;
    }
    /**
     * Sync the LRU chain to non-volatile storage.
     */
    async syncLru() {
        if (this._lru === null) {
            return;
        }
        const table = await this.lruTable;
        return table.write('lru', this._lru.state);
    }
    /**
     * Process a fetch event and return a `Response` if the resource is covered by this group,
     * or `null` otherwise.
     */
    async handleFetch(req, ctx) {
        // Do nothing
        if (!this.patterns.some(pattern => pattern.test(req.url))) {
            return null;
        }
        // Lazily initialize the LRU cache.
        const lru = await this.lru();
        // The URL matches this cache. First, check whether this is a mutating request or not.
        switch (req.method) {
            case 'OPTIONS':
                // Don't try to cache this - it's non-mutating, but is part of a mutating request.
                // Most likely SWs don't even see this, but this guard is here just in case.
                return null;
            case 'GET':
            case 'HEAD':
                // Handle the request with whatever strategy was selected.
                switch (this.config.strategy) {
                    case 'freshness':
                        return this.handleFetchWithFreshness(req, ctx, lru);
                    case 'performance':
                        return this.handleFetchWithPerformance(req, ctx, lru);
                    default:
                        throw new Error(`Unknown strategy: ${this.config.strategy}`);
                }
            default:
                // This was a mutating request. Assume the cache for this URL is no longer valid.
                const wasCached = lru.remove(req.url);
                // If there was a cached entry, remove it.
                if (wasCached) {
                    await this.clearCacheForUrl(req.url);
                }
                // Sync the LRU chain to non-volatile storage.
                await this.syncLru();
                // Finally, fall back on the network.
                return this.safeFetch(req);
        }
    }
    async handleFetchWithPerformance(req, ctx, lru) {
        let res = null;
        // Check the cache first. If the resource exists there (and is not expired), the cached
        // version can be used.
        const fromCache = await this.loadFromCache(req, lru);
        if (fromCache !== null) {
            res = fromCache.res;
            // Check the age of the resource.
            if (this.config.refreshAheadMs !== undefined && fromCache.age >= this.config.refreshAheadMs) {
                ctx.waitUntil(this.safeCacheResponse(req, this.safeFetch(req)));
            }
        }
        if (res !== null) {
            return res;
        }
        // No match from the cache. Go to the network. Note that this is not an 'await'
        // call, networkFetch is the actual Promise. This is due to timeout handling.
        const [timeoutFetch, networkFetch] = this.networkFetchWithTimeout(req);
        res = await timeoutFetch;
        // Since fetch() will always return a response, undefined indicates a timeout.
        if (res === undefined) {
            // The request timed out. Return a Gateway Timeout error.
            res = this.adapter.newResponse(null, { status: 504, statusText: 'Gateway Timeout' });
            // Cache the network response eventually.
            ctx.waitUntil(this.safeCacheResponse(req, networkFetch));
        }
        // The request completed in time, so cache it inline with the response flow.
        await this.cacheResponse(req, res, lru);
        return res;
    }
    async handleFetchWithFreshness(req, ctx, lru) {
        // Start with a network fetch.
        const [timeoutFetch, networkFetch] = this.networkFetchWithTimeout(req);
        let res;
        // If that fetch errors, treat it as a timed out request.
        try {
            res = await timeoutFetch;
        }
        catch (e) {
            res = undefined;
        }
        // If the network fetch times out or errors, fall back on the cache.
        if (res === undefined) {
            ctx.waitUntil(this.safeCacheResponse(req, networkFetch));
            // Ignore the age, the network response will be cached anyway due to the
            // behavior of freshness.
            const fromCache = await this.loadFromCache(req, lru);
            res = (fromCache !== null) ? fromCache.res : null;
        }
        else {
            await this.cacheResponse(req, res, lru, true);
        }
        // Either the network fetch didn't time out, or the cache yielded a usable response.
        // In either case, use it.
        if (res !== null) {
            return res;
        }
        // No response in the cache. No choice but to fall back on the full network fetch.
        res = await networkFetch;
        await this.cacheResponse(req, res, lru, true);
        return res;
    }
    networkFetchWithTimeout(req) {
        // If there is a timeout configured, race a timeout Promise with the network fetch.
        // Otherwise, just fetch from the network directly.
        if (this.config.timeoutMs !== undefined) {
            const networkFetch = this.scope.fetch(req);
            const safeNetworkFetch = (async () => {
                try {
                    return await networkFetch;
                }
                catch (err) {
                    return this.adapter.newResponse(null, {
                        status: 504,
                        statusText: 'Gateway Timeout',
                    });
                }
            })();
            const networkFetchUndefinedError = (async () => {
                try {
                    return await networkFetch;
                }
                catch (err) {
                    return undefined;
                }
            })();
            // Construct a Promise<undefined> for the timeout.
            const timeout = this.adapter.timeout(this.config.timeoutMs);
            // Race that with the network fetch. This will either be a Response, or `undefined`
            // in the event that the request errored or timed out.
            return [Promise.race([networkFetchUndefinedError, timeout]), safeNetworkFetch];
        }
        else {
            const networkFetch = this.safeFetch(req);
            // Do a plain fetch.
            return [networkFetch, networkFetch];
        }
    }
    async safeCacheResponse(req, res) {
        try {
            await this.cacheResponse(req, await res, await this.lru());
        }
        catch (e) {
            // TODO: handle this error somehow?
        }
    }
    async loadFromCache(req, lru) {
        // Look for a response in the cache. If one exists, return it.
        const cache = await this.cache;
        let res = await cache.match(req);
        if (res !== undefined) {
            // A response was found in the cache, but its age is not yet known. Look it up.
            try {
                const ageTable = await this.ageTable;
                const age = this.adapter.time - (await ageTable.read(req.url)).age;
                // If the response is young enough, use it.
                if (age <= this.config.maxAge) {
                    // Successful match from the cache. Use the response, after marking it as having
                    // been accessed.
                    lru.accessed(req.url);
                    return { res, age };
                }
                // Otherwise, or if there was an error, assume the response is expired, and evict it.
            }
            catch (e) {
                // Some error getting the age for the response. Assume it's expired.
            }
            lru.remove(req.url);
            await this.clearCacheForUrl(req.url);
            // TODO: avoid duplicate in event of network timeout, maybe.
            await this.syncLru();
        }
        return null;
    }
    /**
     * Operation for caching the response from the server. This has to happen all
     * at once, so that the cache and LRU tracking remain in sync. If the network request
     * completes before the timeout, this logic will be run inline with the response flow.
     * If the request times out on the server, an error will be returned but the real network
     * request will still be running in the background, to be cached when it completes.
     */
    async cacheResponse(req, res, lru, okToCacheOpaque = false) {
        // Only cache successful responses.
        if (!res.ok || (okToCacheOpaque && res.type === 'opaque')) {
            return;
        }
        // If caching this response would make the cache exceed its maximum size, evict something
        // first.
        if (lru.size >= this.config.maxSize) {
            // The cache is too big, evict something.
            const evictedUrl = lru.pop();
            if (evictedUrl !== null) {
                await this.clearCacheForUrl(evictedUrl);
            }
        }
        // TODO: evaluate for possible race conditions during flaky network periods.
        // Mark this resource as having been accessed recently. This ensures it won't be evicted
        // until enough other resources are requested that it falls off the end of the LRU chain.
        lru.accessed(req.url);
        // Store the response in the cache (cloning because the browser will consume
        // the body during the caching operation).
        await (await this.cache).put(req, res.clone());
        // Store the age of the cache.
        const ageTable = await this.ageTable;
        await ageTable.write(req.url, { age: this.adapter.time });
        // Sync the LRU chain to non-volatile storage.
        await this.syncLru();
    }
    /**
     * Delete all of the saved state which this group uses to track resources.
     */
    async cleanup() {
        // Remove both the cache and the database entries which track LRU stats.
        await Promise.all([
            this.scope.caches.delete(`${this.prefix}:dynamic:${this.config.name}:cache`),
            this.db.delete(`${this.prefix}:dynamic:${this.config.name}:age`),
            this.db.delete(`${this.prefix}:dynamic:${this.config.name}:lru`),
        ]);
    }
    /**
     * Clear the state of the cache for a particular resource.
     *
     * This doesn't remove the resource from the LRU table, that is assumed to have
     * been done already. This clears the GET and HEAD versions of the request from
     * the cache itself, as well as the metadata stored in the age table.
     */
    async clearCacheForUrl(url) {
        const [cache, ageTable] = await Promise.all([this.cache, this.ageTable]);
        await Promise.all([
            cache.delete(this.adapter.newRequest(url, { method: 'GET' })),
            cache.delete(this.adapter.newRequest(url, { method: 'HEAD' })),
            ageTable.delete(url),
        ]);
    }
    async safeFetch(req) {
        try {
            return this.scope.fetch(req);
        }
        catch (err) {
            return this.adapter.newResponse(null, {
                status: 504,
                statusText: 'Gateway Timeout',
            });
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3NlcnZpY2Utd29ya2VyL3dvcmtlci9zcmMvZGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUE4REg7OztHQUdHO0FBQ0g7SUFFRSxZQUFZLEtBQWdCO1FBQzFCLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUN2QixLQUFLLEdBQUc7Z0JBQ04sSUFBSSxFQUFFLElBQUk7Z0JBQ1YsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsR0FBRyxFQUFFLEVBQUU7Z0JBQ1AsS0FBSyxFQUFFLENBQUM7YUFDVCxDQUFDO1NBQ0g7UUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNyQixDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFJLElBQUksS0FBYSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUUvQzs7T0FFRztJQUNILEdBQUc7UUFDRCxvQ0FBb0M7UUFDcEMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUU7WUFDNUIsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO1FBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFakIsMENBQTBDO1FBQzFDLE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQztJQUVELE1BQU0sQ0FBQyxHQUFXO1FBQ2hCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pDLElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRTtZQUN0QixPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQsNkNBQTZDO1FBQzdDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtB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