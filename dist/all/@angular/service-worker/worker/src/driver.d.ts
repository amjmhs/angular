/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Adapter } from './adapter';
import { CacheState, DebugIdleState, DebugState, DebugVersion, Debuggable, UpdateCacheStatus, UpdateSource } from './api';
import { Database } from './database';
import { DebugHandler } from './debug';
import { IdleScheduler } from './idle';
export declare enum DriverReadyState {
    NORMAL = 0,
    EXISTING_CLIENTS_ONLY = 1,
    SAFE_MODE = 2
}
export declare class Driver implements Debuggable, UpdateSource {
    private scope;
    private adapter;
    private db;
    /**
     * Tracks the current readiness condition under which the SW is operating. This controls
     * whether the SW attempts to respond to some or all requests.
     */
    state: DriverReadyState;
    private stateMessage;
    /**
     * Tracks whether the SW is in an initialized state or not. Before initialization,
     * it's not legal to respond to requests.
     */
    initialized: Promise<void> | null;
    /**
     * Maps client IDs to the manifest hash of the application version being used to serve
     * them. If a client ID is not present here, it has not yet been assigned a version.
     *
     * If a ManifestHash appears here, it is also present in the `versions` map below.
     */
    private clientVersionMap;
    /**
     * Maps manifest hashes to instances of `AppVersion` for those manifests.
     */
    private versions;
    /**
     * The latest version fetched from the server.
     *
     * Valid after initialization has completed.
     */
    private latestHash;
    private lastUpdateCheck;
    /**
     * Whether there is a check for updates currently scheduled due to navigation.
     */
    private scheduledNavUpdateCheck;
    /**
     * Keep track of whether we have logged an invalid `only-if-cached` request.
     * (See `.onFetch()` for details.)
     */
    private loggedInvalidOnlyIfCachedRequest;
    /**
     * A scheduler which manages a queue of tasks that need to be executed when the SW is
     * not doing any other work (not processing any other requests).
     */
    idle: IdleScheduler;
    debugger: DebugHandler;
    constructor(scope: ServiceWorkerGlobalScope, adapter: Adapter, db: Database);
    /**
     * The handler for fetch events.
     *
     * This is the transition point between the synchronous event handler and the
     * asynchronous execution that eventually resolves for respondWith() and waitUntil().
     */
    private onFetch;
    /**
     * The handler for message events.
     */
    private onMessage;
    private onPush;
    private onClick;
    private handleMessage;
    private handlePush;
    private handleClick;
    private reportStatus;
    updateClient(client: Client): Promise<void>;
    private handleFetch;
    /**
     * Attempt to quickly reach a state where it's safe to serve responses.
     */
    private initialize;
    private lookupVersionByHash;
    /**
     * Decide which version of the manifest to use for the event.
     */
    private assignVersion;
    /**
     * Retrieve a copy of the latest manifest from the server.
     * Return `null` if `ignoreOfflineError` is true (default: false) and the server or client are
     * offline (detected as response status 504).
     */
    private fetchLatestManifest;
    private deleteAllCaches;
    /**
     * Schedule the SW's attempt to reach a fully prefetched state for the given AppVersion
     * when the SW is not busy and has connectivity. This returns a Promise which must be
     * awaited, as under some conditions the AppVersion might be initialized immediately.
     */
    private scheduleInitialization;
    private versionFailed;
    private setupUpdate;
    checkForUpdate(): Promise<boolean>;
    /**
     * Synchronize the existing state to the underlying database.
     */
    private sync;
    cleanupCaches(): Promise<void>;
    /**
     * Determine if a specific version of the given resource is cached anywhere within the SW,
     * and fetch it if so.
     */
    lookupResourceWithHash(url: string, hash: string): Promise<Response | null>;
    lookupResourceWithoutHash(url: string): Promise<CacheState | null>;
    previouslyCachedResources(): Promise<string[]>;
    recentCacheStatus(url: string): Promise<UpdateCacheStatus>;
    private mergeHashWithAppData;
    notifyClientsAboutUpdate(): Promise<void>;
    broadcast(msg: Object): Promise<void>;
    debugState(): Promise<DebugState>;
    debugVersions(): Promise<DebugVersion[]>;
    debugIdleState(): Promise<DebugIdleState>;
    safeFetch(req: Request): Promise<Response>;
}
