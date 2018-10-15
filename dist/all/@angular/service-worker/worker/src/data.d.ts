/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Adapter, Context } from './adapter';
import { Database } from './database';
import { DataGroupConfig } from './manifest';
/**
 * A group of cached resources determined by a set of URL patterns which follow a LRU policy
 * for caching.
 */
export declare class DataGroup {
    private scope;
    private adapter;
    private config;
    private db;
    private prefix;
    /**
     * Compiled regular expression set used to determine which resources fall under the purview
     * of this group.
     */
    private readonly patterns;
    /**
     * The `Cache` instance in which resources belonging to this group are cached.
     */
    private readonly cache;
    /**
     * Tracks the LRU state of resources in this cache.
     */
    private _lru;
    /**
     * Database table used to store the state of the LRU cache.
     */
    private readonly lruTable;
    /**
     * Database table used to store metadata for resources in the cache.
     */
    private readonly ageTable;
    constructor(scope: ServiceWorkerGlobalScope, adapter: Adapter, config: DataGroupConfig, db: Database, prefix: string);
    /**
     * Lazily initialize/load the LRU chain.
     */
    private lru;
    /**
     * Sync the LRU chain to non-volatile storage.
     */
    syncLru(): Promise<void>;
    /**
     * Process a fetch event and return a `Response` if the resource is covered by this group,
     * or `null` otherwise.
     */
    handleFetch(req: Request, ctx: Context): Promise<Response | null>;
    private handleFetchWithPerformance;
    private handleFetchWithFreshness;
    private networkFetchWithTimeout;
    private safeCacheResponse;
    private loadFromCache;
    /**
     * Operation for caching the response from the server. This has to happen all
     * at once, so that the cache and LRU tracking remain in sync. If the network request
     * completes before the timeout, this logic will be run inline with the response flow.
     * If the request times out on the server, an error will be returned but the real network
     * request will still be running in the background, to be cached when it completes.
     */
    private cacheResponse;
    /**
     * Delete all of the saved state which this group uses to track resources.
     */
    cleanup(): Promise<void>;
    /**
     * Clear the state of the cache for a particular resource.
     *
     * This doesn't remove the resource from the LRU table, that is assumed to have
     * been done already. This clears the GET and HEAD versions of the request from
     * the cache itself, as well as the metadata stored in the age table.
     */
    private clearCacheForUrl;
    private safeFetch;
}
