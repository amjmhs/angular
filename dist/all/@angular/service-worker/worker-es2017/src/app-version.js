/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { UpdateCacheStatus } from './api';
import { LazyAssetGroup, PrefetchAssetGroup } from './assets';
import { DataGroup } from './data';
/**
 * A specific version of the application, identified by a unique manifest
 * as determined by its hash.
 *
 * Each `AppVersion` can be thought of as a published version of the app
 * that can be installed as an update to any previously installed versions.
 */
export class AppVersion {
    constructor(scope, adapter, database, idle, manifest, manifestHash) {
        this.scope = scope;
        this.adapter = adapter;
        this.database = database;
        this.idle = idle;
        this.manifest = manifest;
        this.manifestHash = manifestHash;
        /**
         * A Map of absolute URL paths (/foo.txt) to the known hash of their
         * contents (if available).
         */
        this.hashTable = new Map();
        /**
         * Tracks whether the manifest has encountered any inconsistencies.
         */
        this._okay = true;
        // The hashTable within the manifest is an Object - convert it to a Map for easier lookups.
        Object.keys(this.manifest.hashTable).forEach(url => {
            this.hashTable.set(url, this.manifest.hashTable[url]);
        });
        // Process each `AssetGroup` declared in the manifest. Each declared group gets an `AssetGroup`
        // instance
        // created for it, of a type that depends on the configuration mode.
        this.assetGroups = (manifest.assetGroups || []).map(config => {
            // Every asset group has a cache that's prefixed by the manifest hash and the name of the
            // group.
            const prefix = `ngsw:${this.manifestHash}:assets`;
            // Check the caching mode, which determines when resources will be fetched/updated.
            switch (config.installMode) {
                case 'prefetch':
                    return new PrefetchAssetGroup(this.scope, this.adapter, this.idle, config, this.hashTable, this.database, prefix);
                case 'lazy':
                    return new LazyAssetGroup(this.scope, this.adapter, this.idle, config, this.hashTable, this.database, prefix);
            }
        });
        // Process each `DataGroup` declared in the manifest.
        this.dataGroups = (manifest.dataGroups || [])
            .map(config => new DataGroup(this.scope, this.adapter, config, this.database, `ngsw:${config.version}:data`));
        // Create `include`/`exclude` RegExps for the `navigationUrls` declared in the manifest.
        const includeUrls = manifest.navigationUrls.filter(spec => spec.positive);
        const excludeUrls = manifest.navigationUrls.filter(spec => !spec.positive);
        this.navigationUrls = {
            include: includeUrls.map(spec => new RegExp(spec.regex)),
            exclude: excludeUrls.map(spec => new RegExp(spec.regex)),
        };
    }
    get okay() { return this._okay; }
    /**
     * Fully initialize this version of the application. If this Promise resolves successfully, all
     * required
     * data has been safely downloaded.
     */
    async initializeFully(updateFrom) {
        try {
            // Fully initialize each asset group, in series. Starts with an empty Promise,
            // and waits for the previous groups to have been initialized before initializing
            // the next one in turn.
            await this.assetGroups.reduce(async (previous, group) => {
                // Wait for the previous groups to complete initialization. If there is a
                // failure, this will throw, and each subsequent group will throw, until the
                // whole sequence fails.
                await previous;
                // Initialize this group.
                return group.initializeFully(updateFrom);
            }, Promise.resolve());
        }
        catch (err) {
            this._okay = false;
            throw err;
        }
    }
    async handleFetch(req, context) {
        // Check the request against each `AssetGroup` in sequence. If an `AssetGroup` can't handle the
        // request,
        // it will return `null`. Thus, the first non-null response is the SW's answer to the request.
        // So reduce
        // the group list, keeping track of a possible response. If there is one, it gets passed
        // through, and if
        // not the next group is consulted to produce a candidate response.
        const asset = await this.assetGroups.reduce(async (potentialResponse, group) => {
            // Wait on the previous potential response. If it's not null, it should just be passed
            // through.
            const resp = await potentialResponse;
            if (resp !== null) {
                return resp;
            }
            // No response has been found yet. Maybe this group will have one.
            return group.handleFetch(req, context);
        }, Promise.resolve(null));
        // The result of the above is the asset response, if there is any, or null otherwise. Return the
        // asset
        // response if there was one. If not, check with the data caching groups.
        if (asset !== null) {
            return asset;
        }
        // Perform the same reduction operation as above, but this time processing
        // the data caching groups.
        const data = await this.dataGroups.reduce(async (potentialResponse, group) => {
            const resp = await potentialResponse;
            if (resp !== null) {
                return resp;
            }
            return group.handleFetch(req, context);
        }, Promise.resolve(null));
        // If the data caching group returned a response, go with it.
        if (data !== null) {
            return data;
        }
        // Next, check if this is a navigation request for a route. Detect circular
        // navigations by checking if the request URL is the same as the index URL.
        if (req.url !== this.manifest.index && this.isNavigationRequest(req)) {
            // This was a navigation request. Re-enter `handleFetch` with a request for
            // the URL.
            return this.handleFetch(this.adapter.newRequest(this.manifest.index), context);
        }
        return null;
    }
    /**
     * Determine whether the request is a navigation request.
     * Takes into account: Request mode, `Accept` header, `navigationUrls` patterns.
     */
    isNavigationRequest(req) {
        if (req.mode !== 'navigate') {
            return false;
        }
        if (!this.acceptsTextHtml(req)) {
            return false;
        }
        const urlPrefix = this.scope.registration.scope.replace(/\/$/, '');
        const url = req.url.startsWith(urlPrefix) ? req.url.substr(urlPrefix.length) : req.url;
        const urlWithoutQueryOrHash = url.replace(/[?#].*$/, '');
        return this.navigationUrls.include.some(regex => regex.test(urlWithoutQueryOrHash)) &&
            !this.navigationUrls.exclude.some(regex => regex.test(urlWithoutQueryOrHash));
    }
    /**
     * Check this version for a given resource with a particular hash.
     */
    async lookupResourceWithHash(url, hash) {
        // Verify that this version has the requested resource cached. If not,
        // there's no point in trying.
        if (!this.hashTable.has(url)) {
            return null;
        }
        // Next, check whether the resource has the correct hash. If not, any cached
        // response isn't usable.
        if (this.hashTable.get(url) !== hash) {
            return null;
        }
        const cacheState = await this.lookupResourceWithoutHash(url);
        return cacheState && cacheState.response;
    }
    /**
     * Check this version for a given resource regardless of its hash.
     */
    lookupResourceWithoutHash(url) {
        // Limit the search to asset groups, and only scan the cache, don't
        // load resources from the network.
        return this.assetGroups.reduce(async (potentialResponse, group) => {
            const resp = await potentialResponse;
            if (resp !== null) {
                return resp;
            }
            // fetchFromCacheOnly() avoids any network fetches, and returns the
            // full set of cache data, not just the Response.
            return group.fetchFromCacheOnly(url);
        }, Promise.resolve(null));
    }
    /**
     * List all unhashed resources from all asset groups.
     */
    previouslyCachedResources() {
        return this.assetGroups.reduce(async (resources, group) => {
            return (await resources).concat(await group.unhashedResources());
        }, Promise.resolve([]));
    }
    async recentCacheStatus(url) {
        return this.assetGroups.reduce(async (current, group) => {
            const status = await current;
            if (status === UpdateCacheStatus.CACHED) {
                return status;
            }
            const groupStatus = await group.cacheStatus(url);
            if (groupStatus === UpdateCacheStatus.NOT_CACHED) {
                return status;
            }
            return groupStatus;
        }, Promise.resolve(UpdateCacheStatus.NOT_CACHED));
    }
    /**
     * Erase this application version, by cleaning up all the caches.
     */
    async cleanup() {
        await Promise.all(this.assetGroups.map(group => group.cleanup()));
        await Promise.all(this.dataGroups.map(group => group.cleanup()));
    }
    /**
     * Get the opaque application data which was provided with the manifest.
     */
    get appData() { return this.manifest.appData || null; }
    /**
     * Check whether a request accepts `text/html` (based on the `Accept` header).
     */
    acceptsTextHtml(req) {
        const accept = req.headers.get('Accept');
        if (accept === null) {
            return false;
        }
        const values = accept.split(',');
        return values.some(value => value.trim().toLowerCase() === 'text/html');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXZlcnNpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9zZXJ2aWNlLXdvcmtlci93b3JrZXIvc3JjL2FwcC12ZXJzaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUdILE9BQU8sRUFBYSxpQkFBaUIsRUFBZSxNQUFNLE9BQU8sQ0FBQztBQUNsRSxPQUFPLEVBQWEsY0FBYyxFQUFFLGtCQUFrQixFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQ3hFLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFNakM7Ozs7OztHQU1HO0FBQ0gsTUFBTTtJQThCSixZQUNZLEtBQStCLEVBQVUsT0FBZ0IsRUFBVSxRQUFrQixFQUNyRixJQUFtQixFQUFXLFFBQWtCLEVBQVcsWUFBb0I7UUFEL0UsVUFBSyxHQUFMLEtBQUssQ0FBMEI7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUNyRixTQUFJLEdBQUosSUFBSSxDQUFlO1FBQVcsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUFXLGlCQUFZLEdBQVosWUFBWSxDQUFRO1FBL0IzRjs7O1dBR0c7UUFDSyxjQUFTLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUM7UUFrQjlDOztXQUVHO1FBQ0ssVUFBSyxHQUFHLElBQUksQ0FBQztRQU9uQiwyRkFBMkY7UUFDM0YsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNqRCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN4RCxDQUFDLENBQUMsQ0FBQztRQUVILCtGQUErRjtRQUMvRixXQUFXO1FBQ1gsb0VBQW9F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