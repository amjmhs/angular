/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Adapter, Context } from './adapter';
import { CacheState, UpdateCacheStatus, UpdateSource } from './api';
import { Database } from './database';
import { IdleScheduler } from './idle';
import { Manifest } from './manifest';
/**
 * A specific version of the application, identified by a unique manifest
 * as determined by its hash.
 *
 * Each `AppVersion` can be thought of as a published version of the app
 * that can be installed as an update to any previously installed versions.
 */
export declare class AppVersion implements UpdateSource {
    private scope;
    private adapter;
    private database;
    private idle;
    readonly manifest: Manifest;
    readonly manifestHash: string;
    /**
     * A Map of absolute URL paths (/foo.txt) to the known hash of their
     * contents (if available).
     */
    private hashTable;
    /**
     * All of the asset groups active in this version of the app.
     */
    private assetGroups;
    /**
     * All of the data groups active in this version of the app.
     */
    private dataGroups;
    /**
     * Requests to URLs that match any of the `include` RegExps and none of the `exclude` RegExps
     * are considered navigation requests and handled accordingly.
     */
    private navigationUrls;
    /**
     * Tracks whether the manifest has encountered any inconsistencies.
     */
    private _okay;
    readonly okay: boolean;
    constructor(scope: ServiceWorkerGlobalScope, adapter: Adapter, database: Database, idle: IdleScheduler, manifest: Manifest, manifestHash: string);
    /**
     * Fully initialize this version of the application. If this Promise resolves successfully, all
     * required
     * data has been safely downloaded.
     */
    initializeFully(updateFrom?: UpdateSource): Promise<void>;
    handleFetch(req: Request, context: Context): Promise<Response | null>;
    /**
     * Determine whether the request is a navigation request.
     * Takes into account: Request mode, `Accept` header, `navigationUrls` patterns.
     */
    isNavigationRequest(req: Request): boolean;
    /**
     * Check this version for a given resource with a particular hash.
     */
    lookupResourceWithHash(url: string, hash: string): Promise<Response | null>;
    /**
     * Check this version for a given resource regardless of its hash.
     */
    lookupResourceWithoutHash(url: string): Promise<CacheState | null>;
    /**
     * List all unhashed resources from all asset groups.
     */
    previouslyCachedResources(): Promise<string[]>;
    recentCacheStatus(url: string): Promise<UpdateCacheStatus>;
    /**
     * Erase this application version, by cleaning up all the caches.
     */
    cleanup(): Promise<void>;
    /**
     * Get the opaque application data which was provided with the manifest.
     */
    readonly appData: Object | null;
    /**
     * Check whether a request accepts `text/html` (based on the `Accept` header).
     */
    private acceptsTextHtml;
}
