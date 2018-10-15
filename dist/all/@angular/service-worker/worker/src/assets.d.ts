/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Adapter, Context } from './adapter';
import { CacheState, UpdateCacheStatus, UpdateSource } from './api';
import { Database, Table } from './database';
import { IdleScheduler } from './idle';
import { AssetGroupConfig } from './manifest';
/**
 * A group of assets that are cached in a `Cache` and managed by a given policy.
 *
 * Concrete classes derive from this base and specify the exact caching policy.
 */
export declare abstract class AssetGroup {
    protected scope: ServiceWorkerGlobalScope;
    protected adapter: Adapter;
    protected idle: IdleScheduler;
    protected config: AssetGroupConfig;
    protected hashes: Map<string, string>;
    protected db: Database;
    protected prefix: string;
    /**
     * A deduplication cache, to make sure the SW never makes two network requests
     * for the same resource at once. Managed by `fetchAndCacheOnce`.
     */
    private inFlightRequests;
    /**
     * Regular expression patterns.
     */
    protected patterns: RegExp[];
    /**
     * A Promise which resolves to the `Cache` used to back this asset group. This
     * is openedfrom the constructor.
     */
    protected cache: Promise<Cache>;
    /**
     * Group name from the configuration.
     */
    readonly name: string;
    /**
     * Metadata associated with specific cache entries.
     */
    protected metadata: Promise<Table>;
    private origin;
    constructor(scope: ServiceWorkerGlobalScope, adapter: Adapter, idle: IdleScheduler, config: AssetGroupConfig, hashes: Map<string, string>, db: Database, prefix: string);
    cacheStatus(url: string): Promise<UpdateCacheStatus>;
    /**
     * Initialize this asset group, updating from the given source if available.
     */
    abstract initializeFully(updateFrom?: UpdateSource): Promise<void>;
    /**
     * Clean up all the cached data for this group.
     */
    cleanup(): Promise<void>;
    /**
     * Process a request for a given resource and return it, or return null if it's not available.
     */
    handleFetch(req: Request, ctx: Context): Promise<Response | null>;
    private getConfigUrl;
    /**
     * Some resources are cached without a hash, meaning that their expiration is controlled
     * by HTTP caching headers. Check whether the given request/response pair is still valid
     * per the caching headers.
     */
    private needToRevalidate;
    /**
     * Fetch the complete state of a cached resource, or return null if it's not found.
     */
    fetchFromCacheOnly(url: string): Promise<CacheState | null>;
    /**
     * Lookup all resources currently stored in the cache which have no associated hash.
     */
    unhashedResources(): Promise<string[]>;
    /**
     * Fetch the given resource from the network, and cache it if able.
     */
    protected fetchAndCacheOnce(req: Request, used?: boolean): Promise<Response>;
    protected fetchFromNetwork(req: Request, redirectLimit?: number): Promise<Response>;
    /**
     * Load a particular asset from the network, accounting for hash validation.
     */
    protected cacheBustedFetchFromNetwork(req: Request): Promise<Response>;
    /**
     * Possibly update a resource, if it's expired and needs to be updated. A no-op otherwise.
     */
    protected maybeUpdate(updateFrom: UpdateSource, req: Request, cache: Cache): Promise<boolean>;
    /**
     * Construct a cache-busting URL for a given URL.
     */
    private cacheBust;
    protected safeFetch(req: Request): Promise<Response>;
}
/**
 * An `AssetGroup` that prefetches all of its resources during initialization.
 */
export declare class PrefetchAssetGroup extends AssetGroup {
    initializeFully(updateFrom?: UpdateSource): Promise<void>;
}
export declare class LazyAssetGroup extends AssetGroup {
    initializeFully(updateFrom?: UpdateSource): Promise<void>;
}
