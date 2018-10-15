/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { UpdateCacheStatus } from './api';
import { SwCriticalError, errorToString } from './error';
import { sha1Binary } from './sha1';
/**
 * A group of assets that are cached in a `Cache` and managed by a given policy.
 *
 * Concrete classes derive from this base and specify the exact caching policy.
 */
export class AssetGroup {
    constructor(scope, adapter, idle, config, hashes, db, prefix) {
        this.scope = scope;
        this.adapter = adapter;
        this.idle = idle;
        this.config = config;
        this.hashes = hashes;
        this.db = db;
        this.prefix = prefix;
        /**
         * A deduplication cache, to make sure the SW never makes two network requests
         * for the same resource at once. Managed by `fetchAndCacheOnce`.
         */
        this.inFlightRequests = new Map();
        /**
         * Regular expression patterns.
         */
        this.patterns = [];
        this.name = config.name;
        // Patterns in the config are regular expressions disguised as strings. Breathe life into them.
        this.patterns = this.config.patterns.map(pattern => new RegExp(pattern));
        // This is the primary cache, which holds all of the cached requests for this group. If a
        // resource
        // isn't in this cache, it hasn't been fetched yet.
        this.cache = this.scope.caches.open(`${this.prefix}:${this.config.name}:cache`);
        // This is the metadata table, which holds specific information for each cached URL, such as
        // the timestamp of when it was added to the cache.
        this.metadata = this.db.open(`${this.prefix}:${this.config.name}:meta`);
        // Determine the origin from the registration scope. This is used to differentiate between
        // relative and absolute URLs.
        this.origin =
            this.adapter.parseUrl(this.scope.registration.scope, this.scope.registration.scope).origin;
    }
    async cacheStatus(url) {
        const cache = await this.cache;
        const meta = await this.metadata;
        const res = await cache.match(this.adapter.newRequest(url));
        if (res === undefined) {
            return UpdateCacheStatus.NOT_CACHED;
        }
        try {
            const data = await meta.read(url);
            if (!data.used) {
                return UpdateCacheStatus.CACHED_BUT_UNUSED;
            }
        }
        catch (_) {
            // Error on the side of safety and assume cached.
        }
        return UpdateCacheStatus.CACHED;
    }
    /**
     * Clean up all the cached data for this group.
     */
    async cleanup() {
        await this.scope.caches.delete(`${this.prefix}:${this.config.name}:cache`);
        await this.db.delete(`${this.prefix}:${this.config.name}:meta`);
    }
    /**
     * Process a request for a given resource and return it, or return null if it's not available.
     */
    async handleFetch(req, ctx) {
        const url = this.getConfigUrl(req.url);
        // Either the request matches one of the known resource URLs, one of the patterns for
        // dynamically matched URLs, or neither. Determine which is the case for this request in
        // order to decide how to handle it.
        if (this.config.urls.indexOf(url) !== -1 || this.patterns.some(pattern => pattern.test(url))) {
            // This URL matches a known resource. Either it's been cached already or it's missing, in
            // which case it needs to be loaded from the network.
            // Open the cache to check whether this resource is present.
            const cache = await this.cache;
            // Look for a cached response. If one exists, it can be used to resolve the fetch
            // operation.
            const cachedResponse = await cache.match(req);
            if (cachedResponse !== undefined) {
                // A response has already been cached (which presumably matches the hash for this
                // resource). Check whether it's safe to serve this resource from cache.
                if (this.hashes.has(url)) {
                    // This resource has a hash, and thus is versioned by the manifest. It's safe to return
                    // the response.
                    return cachedResponse;
                }
                else {
                    // This resource has no hash, and yet exists in the cache. Check how old this request is
                    // to make sure it's still usable.
                    if (await this.needToRevalidate(req, cachedResponse)) {
                        this.idle.schedule(`revalidate(${this.prefix}, ${this.config.name}): ${req.url}`, async () => { await this.fetchAndCacheOnce(req); });
                    }
                    // In either case (revalidation or not), the cached response must be good.
                    return cachedResponse;
                }
            }
            // No already-cached response exists, so attempt a fetch/cache operation. The original request
            // may specify things like credential inclusion, but for assets these are not honored in order
            // to avoid issues with opaque responses. The SW requests the data itself.
            const res = await this.fetchAndCacheOnce(this.adapter.newRequest(req.url));
            // If this is successful, the response needs to be cloned as it might be used to respond to
            // multiple fetch operations at the same time.
            return res.clone();
        }
        else {
            return null;
        }
    }
    getConfigUrl(url) {
        // If the URL is relative to the SW's own origin, then only consider the path relative to
        // the domain root. Determine this by checking the URL's origin against the SW's.
        const parsed = this.adapter.parseUrl(url, this.scope.registration.scope);
        if (parsed.origin === this.origin) {
            // The URL is relative to the SW's origin domain.
            return parsed.path;
        }
        else {
            return url;
        }
    }
    /**
     * Some resources are cached without a hash, meaning that their expiration is controlled
     * by HTTP caching headers. Check whether the given request/response pair is still valid
     * per the caching headers.
     */
    async needToRevalidate(req, res) {
        // Three different strategies apply here:
        // 1) The request has a Cache-Control header, and thus expiration needs to be based on its age.
        // 2) The request has an Expires header, and expiration is based on the current timestamp.
        // 3) The request has no applicable caching headers, and must be revalidated.
        if (res.headers.has('Cache-Control')) {
            // Figure out if there is a max-age directive in the Cache-Control header.
            const cacheControl = res.headers.get('Cache-Control');
            const cacheDirectives = cacheControl
                // Directives are comma-separated within the Cache-Control header value.
                .split(',')
                // Make sure each directive doesn't have extraneous whitespace.
                .map(v => v.trim())
                // Some directives have values (like maxage and s-maxage)
                .map(v => v.split('='));
            // Lowercase all the directive names.
            cacheDirectives.forEach(v => v[0] = v[0].toLowerCase());
            // Find the max-age directive, if one exists.
            const maxAgeDirective = cacheDirectives.find(v => v[0] === 'max-age');
            const cacheAge = maxAgeDirective ? maxAgeDirective[1] : undefined;
            if (!cacheAge) {
                // No usable TTL defined. Must assume that the response is stale.
                return true;
            }
            try {
                const maxAge = 1000 * parseInt(cacheAge);
                // Determine the origin time of this request. If the SW has metadata on the request (which
                // it
                // should), it will have the time the request was added to the cache. If it doesn't for some
                // reason, the request may have a Date header which will serve the same purpose.
                let ts;
                try {
                    // Check the metadata table. If a timestamp is there, use it.
                    const metaTable = await this.metadata;
                    ts = (await metaTable.read(req.url)).ts;
                }
                catch (e) {
                    // Otherwise, look for a Date header.
                    const date = res.headers.get('Date');
                    if (date === null) {
                        // Unable to determine when this response was created. Assume that it's stale, and
                        // revalidate it.
                        return true;
                    }
                    ts = Date.parse(date);
                }
                const age = this.adapter.time - ts;
                return age < 0 || age > maxAge;
            }
            catch (e) {
                // Assume stale.
                return true;
            }
        }
        else if (res.headers.has('Expires')) {
            // Determine if the expiration time has passed.
            const expiresStr = res.headers.get('Expires');
            try {
                // The request needs to be revalidated if the current time is later than the expiration
                // time, if it parses correctly.
                return this.adapter.time > Date.parse(expiresStr);
            }
            catch (e) {
                // The expiration date failed to parse, so revalidate as a precaution.
                return true;
            }
        }
        else {
            // No way to evaluate staleness, so assume the response is already stale.
            return true;
        }
    }
    /**
     * Fetch the complete state of a cached resource, or return null if it's not found.
     */
    async fetchFromCacheOnly(url) {
        const cache = await this.cache;
        const metaTable = await this.metadata;
        // Lookup the response in the cache.
        const response = await cache.match(this.adapter.newRequest(url));
        if (response === undefined) {
            // It's not found, return null.
            return null;
        }
        // Next, lookup the cached metadata.
        let metadata = undefined;
        try {
            metadata = await metaTable.read(url);
        }
        catch (e) {
            // Do nothing, not found. This shouldn't happen, but it can be handled.
        }
        // Return both the response and any available metadata.
        return { response, metadata };
    }
    /**
     * Lookup all resources currently stored in the cache which have no associated hash.
     */
    async unhashedResources() {
        const cache = await this.cache;
        // Start with the set of all cached URLs.
        return (await cache.keys())
            .map(request => request.url)
            // Exclude the URLs which have hashes.
            .filter(url => !this.hashes.has(url));
    }
    /**
     * Fetch the given resource from the network, and cache it if able.
     */
    async fetchAndCacheOnce(req, used = true) {
        // The `inFlightRequests` map holds information about which caching operations are currently
        // underway for known resources. If this request appears there, another "thread" is already
        // in the process of caching it, and this work should not be duplicated.
        if (this.inFlightRequests.has(req.url)) {
            // There is a caching operation already in progress for this request. Wait for it to
            // complete, and hopefully it will have yielded a useful response.
            return this.inFlightRequests.get(req.url);
        }
        // No other caching operation is being attempted for this resource, so it will be owned here.
        // Go to the network and get the correct version.
        const fetchOp = this.fetchFromNetwork(req);
        // Save this operation in `inFlightRequests` so any other "thread" attempting to cache it
        // will block on this chain instead of duplicating effort.
        this.inFlightRequests.set(req.url, fetchOp);
        // Make sure this attempt is cleaned up properly on failure.
        try {
            // Wait for a response. If this fails, the request will remain in `inFlightRequests`
            // indefinitely.
            const res = await fetchOp;
            // It's very important that only successful responses are cached. Unsuccessful responses
            // should never be cached as this can completely break applications.
            if (!res.ok) {
                throw new Error(`Response not Ok (fetchAndCacheOnce): request for ${req.url} returned response ${res.status} ${res.statusText}`);
            }
            try {
                // This response is safe to cache (as long as it's cloned). Wait until the cache operation
                // is complete.
                const cache = await this.scope.caches.open(`${this.prefix}:${this.config.name}:cache`);
                await cache.put(req, res.clone());
                // If the request is not hashed, update its metadata, especially the timestamp. This is
                // needed for future determination of whether this cached response is stale or not.
                if (!this.hashes.has(req.url)) {
                    // Metadata is tracked for requests that are unhashed.
                    const meta = { ts: this.adapter.time, used };
                    const metaTable = await this.metadata;
                    await metaTable.write(req.url, meta);
                }
                return res;
            }
            catch (err) {
                // Among other cases, this can happen when the user clears all data through the DevTools,
                // but the SW is still running and serving another tab. In that case, trying to write to the
                // caches throws an `Entry was not found` error.
                // If this happens the SW can no longer work correctly. This situation is unrecoverable.
                throw new SwCriticalError(`Failed to update the caches for request to '${req.url}' (fetchAndCacheOnce): ${errorToString(err)}`);
            }
        }
        finally {
            // Finally, it can be removed from `inFlightRequests`. This might result in a double-remove
            // if some other chain was already making this request too, but that won't hurt anything.
            this.inFlightRequests.delete(req.url);
        }
    }
    async fetchFromNetwork(req, redirectLimit = 3) {
        // Make a cache-busted request for the resource.
        const res = await this.cacheBustedFetchFromNetwork(req);
        // Check for redirected responses, and follow the redirects.
        if (res['redirected'] && !!res.url) {
            // If the redirect limit is exhausted, fail with an error.
            if (redirectLimit === 0) {
                throw new SwCriticalError(`Response hit redirect limit (fetchFromNetwork): request redirected too many times, next is ${res.url}`);
            }
            // Unwrap the redirect directly.
            return this.fetchFromNetwork(this.adapter.newRequest(res.url), redirectLimit - 1);
        }
        return res;
    }
    /**
     * Load a particular asset from the network, accounting for hash validation.
     */
    async cacheBustedFetchFromNetwork(req) {
        const url = this.getConfigUrl(req.url);
        // If a hash is available for this resource, then compare the fetched version with the
        // canonical hash. Otherwise, the network version will have to be trusted.
        if (this.hashes.has(url)) {
            // It turns out this resource does have a hash. Look it up. Unless the fetched version
            // matches this hash, it's invalid and the whole manifest may need to be thrown out.
            const canonicalHash = this.hashes.get(url);
            // Ideally, the resource would be requested with cache-busting to guarantee the SW gets
            // the freshest version. However, doing this would eliminate any chance of the response
            // being in the HTTP cache. Given that the browser has recently actively loaded the page,
            // it's likely that many of the responses the SW needs to cache are in the HTTP cache and
            // are fresh enough to use. In the future, this could be done by setting cacheMode to
            // *only* check the browser cache for a cached version of the resource, when cacheMode is
            // fully supported. For now, the resource is fetched directly, without cache-busting, and
            // if the hash test fails a cache-busted request is tried before concluding that the
            // resource isn't correct. This gives the benefit of acceleration via the HTTP cache
            // without the risk of stale data, at the expense of a duplicate request in the event of
            // a stale response.
            // Fetch the resource from the network (possibly hitting the HTTP cache).
            const networkResult = await this.safeFetch(req);
            // Decide whether a cache-busted request is necessary. It might be for two independent
            // reasons: either the non-cache-busted request failed (hopefully transiently) or if the
            // hash of the content retrieved does not match the canonical hash from the manifest. It's
            // only valid to access the content of the first response if the request was successful.
            let makeCacheBustedRequest = networkResult.ok;
            if (makeCacheBustedRequest) {
                // The request was successful. A cache-busted request is only necessary if the hashes
                // don't match. Compare them, making sure to clone the response so it can be used later
                // if it proves to be valid.
                const fetchedHash = sha1Binary(await networkResult.clone().arrayBuffer());
                makeCacheBustedRequest = (fetchedHash !== canonicalHash);
            }
            // Make a cache busted request to the network, if necessary.
            if (makeCacheBustedRequest) {
                // Hash failure, the version that was retrieved under the default URL did not have the
                // hash expected. This could be because the HTTP cache got in the way and returned stale
                // data, or because the version on the server really doesn't match. A cache-busting
                // request will differentiate these two situations.
                // TODO: handle case where the URL has parameters already (unlikely for assets).
                const cacheBustReq = this.adapter.newRequest(this.cacheBust(req.url));
                const cacheBustedResult = await this.safeFetch(cacheBustReq);
                // If the response was unsuccessful, there's nothing more that can be done.
                if (!cacheBustedResult.ok) {
                    throw new SwCriticalError(`Response not Ok (cacheBustedFetchFromNetwork): cache busted request for ${req.url} returned response ${cacheBustedResult.status} ${cacheBustedResult.statusText}`);
                }
                // Hash the contents.
                const cacheBustedHash = sha1Binary(await cacheBustedResult.clone().arrayBuffer());
                // If the cache-busted version doesn't match, then the manifest is not an accurate
                // representation of the server's current set of files, and the SW should give up.
                if (canonicalHash !== cacheBustedHash) {
                    throw new SwCriticalError(`Hash mismatch (cacheBustedFetchFromNetwork): ${req.url}: expected ${canonicalHash}, got ${cacheBustedHash} (after cache busting)`);
                }
                // If it does match, then use the cache-busted result.
                return cacheBustedResult;
            }
            // Excellent, the version from the network matched on the first try, with no need for
            // cache-busting. Use it.
            return networkResult;
        }
        else {
            // This URL doesn't exist in our hash database, so it must be requested directly.
            return this.safeFetch(req);
        }
    }
    /**
     * Possibly update a resource, if it's expired and needs to be updated. A no-op otherwise.
     */
    async maybeUpdate(updateFrom, req, cache) {
        const url = this.getConfigUrl(req.url);
        const meta = await this.metadata;
        // Check if this resource is hashed and already exists in the cache of a prior version.
        if (this.hashes.has(url)) {
            const hash = this.hashes.get(url);
            // Check the caches of prior versions, using the hash to ensure the correct version of
            // the resource is loaded.
            const res = await updateFrom.lookupResourceWithHash(url, hash);
            // If a previously cached version was available, copy it over to this cache.
            if (res !== null) {
                // Copy to this cache.
                await cache.put(req, res);
                await meta.write(req.url, { ts: this.adapter.time, used: false });
                // No need to do anything further with this resource, it's now cached properly.
                return true;
            }
        }
        // No up-to-date version of this resource could be found.
        return false;
    }
    /**
     * Construct a cache-busting URL for a given URL.
     */
    cacheBust(url) {
        return url + (url.indexOf('?') === -1 ? '?' : '&') + 'ngsw-cache-bust=' + Math.random();
    }
    async safeFetch(req) {
        try {
            return await this.scope.fetch(req);
        }
        catch (err) {
            return this.adapter.newResponse('', {
                status: 504,
                statusText: 'Gateway Timeout',
            });
        }
    }
}
/**
 * An `AssetGroup` that prefetches all of its resources during initialization.
 */
export class PrefetchAssetGroup extends AssetGroup {
    async initializeFully(updateFrom) {
        // Open the cache which actually holds requests.
        const cache = await this.cache;
        // Cache all known resources serially. As this reduce proceeds, each Promise waits
        // on the last before starting the fetch/cache operation for the next request. Any
        // errors cause fall-through to the final Promise which rejects.
        await this.config.urls.reduce(async (previous, url) => {
            // Wait on all previous operations to complete.
            await previous;
            // Construct the Request for this url.
            const req = this.adapter.newRequest(url);
            // First, check the cache to see if there is already a copy of this resource.
            const alreadyCached = (await cache.match(req)) !== undefined;
            // If the resource is in the cache already, it can be skipped.
            if (alreadyCached) {
                return;
            }
            // If an update source is available.
            if (updateFrom !== undefined && await this.maybeUpdate(updateFrom, req, cache)) {
                return;
            }
            // Otherwise, go to the network and hopefully cache the response (if successful).
            await this.fetchAndCacheOnce(req, false);
        }, Promise.resolve());
        // Handle updating of unknown (unhashed) resources. This is only possible if there's
        // a source to update from.
        if (updateFrom !== undefined) {
            const metaTable = await this.metadata;
            // Select all of the previously cached resources. These are cached unhashed resources
            // from previous versions of the app, in any asset group.
            await (await updateFrom.previouslyCachedResources())
                // First, narrow down the set of resources to those which are handled by this group.
                // Either it's a known URL, or it matches a given pattern.
                .filter(url => this.config.urls.some(cacheUrl => cacheUrl === url) ||
                this.patterns.some(pattern => pattern.test(url)))
                // Finally, process each resource in turn.
                .reduce(async (previous, url) => {
                await previous;
                const req = this.adapter.newRequest(url);
                // It's possible that the resource in question is already cached. If so,
                // continue to the next one.
                const alreadyCached = (await cache.match(req) !== undefined);
                if (alreadyCached) {
                    return;
                }
                // Get the most recent old version of the resource.
                const res = await updateFrom.lookupResourceWithoutHash(url);
                if (res === null || res.metadata === undefined) {
                    // Unexpected, but not harmful.
                    return;
                }
                // Write it into the cache. It may already be expired, but it can still serve
                // traffic until it's updated (stale-while-revalidate approach).
                await cache.put(req, res.response);
                await metaTable.write(url, Object.assign({}, res.metadata, { used: false }));
            }, Promise.resolve());
        }
    }
}
export class LazyAssetGroup extends AssetGroup {
    async initializeFully(updateFrom) {
        // No action necessary if no update source is available - resources managed in this group
        // are all lazily loaded, so there's nothing to initialize.
        if (updateFrom === undefined) {
            return;
        }
        // Open the cache which actually holds requests.
        const cache = await this.cache;
        // Loop through the listed resources, caching any which are available.
        await this.config.urls.reduce(async (previous, url) => {
            // Wait on all previous operations to complete.
            await previous;
            // Construct the Request for this url.
            const req = this.adapter.newRequest(url);
            // First, check the cache to see if there is already a copy of this resource.
            const alreadyCached = (await cache.match(req)) !== undefined;
            // If the resource is in the cache already, it can be skipped.
            if (alreadyCached) {
                return;
            }
            const updated = await this.maybeUpdate(updateFrom, req, cache);
            if (this.config.updateMode === 'prefetch' && !updated) {
                // If the resource was not updated, either it was not cached before or
                // the previously cached version didn't match the updated hash. In that
                // case, prefetch update mode dictates that the resource will be updated,
                // except if it was not previously utilized. Check the status of the
                // cached resource to see.
                const cacheStatus = await updateFrom.recentCacheStatus(url);
                // If the resource is not cached, or was cached but unused, then it will be
                // loaded lazily.
                if (cacheStatus !== UpdateCacheStatus.CACHED) {
                    return;
                }
                // Update from the network.
                await this.fetchAndCacheOnce(req, false);
            }
        }, Promise.resolve());
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvd29ya2VyL3NyYy9hc3NldHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBR0gsT0FBTyxFQUFhLGlCQUFpQixFQUE0QixNQUFNLE9BQU8sQ0FBQztBQUUvRSxPQUFPLEVBQUMsZUFBZSxFQUFFLGFBQWEsRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUd2RCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBRWxDOzs7O0dBSUc7QUFDSCxNQUFNO0lBK0JKLFlBQ2MsS0FBK0IsRUFBWSxPQUFnQixFQUMzRCxJQUFtQixFQUFZLE1BQXdCLEVBQ3ZELE1BQTJCLEVBQVksRUFBWSxFQUFZLE1BQWM7UUFGN0UsVUFBSyxHQUFMLEtBQUssQ0FBMEI7UUFBWSxZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQzNELFNBQUksR0FBSixJQUFJLENBQWU7UUFBWSxXQUFNLEdBQU4sTUFBTSxDQUFrQjtRQUN2RCxXQUFNLEdBQU4sTUFBTSxDQUFxQjtRQUFZLE9BQUUsR0FBRixFQUFFLENBQVU7UUFBWSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBakMzRjs7O1dBR0c7UUFDSyxxQkFBZ0IsR0FBRyxJQUFJLEdBQUcsRUFBNkIsQ0FBQztRQUVoRTs7V0FFRztRQUNPLGFBQVEsR0FBYSxFQUFFLENBQUM7UUF5QmhDLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztRQUN4QiwrRkFBK0Y7UUFDL0YsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBRXpFLHlGQUF5RjtRQUN6RixXQUFXO1FBQ1gsbURBQW1EO1FBQ25ELElB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