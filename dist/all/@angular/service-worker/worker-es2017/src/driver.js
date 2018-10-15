/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AppVersion } from './app-version';
import { DebugHandler } from './debug';
import { errorToString } from './error';
import { IdleScheduler } from './idle';
import { hashManifest } from './manifest';
import { isMsgActivateUpdate, isMsgCheckForUpdates } from './msg';
const IDLE_THRESHOLD = 5000;
const SUPPORTED_CONFIG_VERSION = 1;
const NOTIFICATION_OPTION_NAMES = [
    'actions', 'badge', 'body', 'data', 'dir', 'icon', 'image', 'lang', 'renotify',
    'requireInteraction', 'silent', 'tag', 'timestamp', 'title', 'vibrate'
];
export var DriverReadyState;
(function (DriverReadyState) {
    // The SW is operating in a normal mode, responding to all traffic.
    DriverReadyState[DriverReadyState["NORMAL"] = 0] = "NORMAL";
    // The SW does not have a clean installation of the latest version of the app, but older
    // cached versions are safe to use so long as they don't try to fetch new dependencies.
    // This is a degraded state.
    DriverReadyState[DriverReadyState["EXISTING_CLIENTS_ONLY"] = 1] = "EXISTING_CLIENTS_ONLY";
    // The SW has decided that caching is completely unreliable, and is forgoing request
    // handling until the next restart.
    DriverReadyState[DriverReadyState["SAFE_MODE"] = 2] = "SAFE_MODE";
})(DriverReadyState || (DriverReadyState = {}));
export class Driver {
    constructor(scope, adapter, db) {
        // Set up all the event handlers that the SW needs.
        this.scope = scope;
        this.adapter = adapter;
        this.db = db;
        /**
         * Tracks the current readiness condition under which the SW is operating. This controls
         * whether the SW attempts to respond to some or all requests.
         */
        this.state = DriverReadyState.NORMAL;
        this.stateMessage = '(nominal)';
        /**
         * Tracks whether the SW is in an initialized state or not. Before initialization,
         * it's not legal to respond to requests.
         */
        this.initialized = null;
        /**
         * Maps client IDs to the manifest hash of the application version being used to serve
         * them. If a client ID is not present here, it has not yet been assigned a version.
         *
         * If a ManifestHash appears here, it is also present in the `versions` map below.
         */
        this.clientVersionMap = new Map();
        /**
         * Maps manifest hashes to instances of `AppVersion` for those manifests.
         */
        this.versions = new Map();
        /**
         * The latest version fetched from the server.
         *
         * Valid after initialization has completed.
         */
        this.latestHash = null;
        this.lastUpdateCheck = null;
        /**
         * Whether there is a check for updates currently scheduled due to navigation.
         */
        this.scheduledNavUpdateCheck = false;
        /**
         * Keep track of whether we have logged an invalid `only-if-cached` request.
         * (See `.onFetch()` for details.)
         */
        this.loggedInvalidOnlyIfCachedRequest = false;
        // The install event is triggered when the service worker is first installed.
        this.scope.addEventListener('install', (event) => {
            // SW code updates are separate from application updates, so code updates are
            // almost as straightforward as restarting the SW. Because of this, it's always
            // safe to skip waiting until application tabs are closed, and activate the new
            // SW version immediately.
            event.waitUntil(this.scope.skipWaiting());
        });
        // The activate event is triggered when this version of the service worker is
        // first activated.
        this.scope.addEventListener('activate', (event) => {
            // As above, it's safe to take over from existing clients immediately, since
            // the new SW version will continue to serve the old application.
            event.waitUntil(this.scope.clients.claim());
            // Rather than wait for the first fetch event, which may not arrive until
            // the next time the application is loaded, the SW takes advantage of the
            // activation event to schedule initialization. However, if this were run
            // in the context of the 'activate' event, waitUntil() here would cause fetch
            // events to block until initialization completed. Thus, the SW does a
            // postMessage() to itself, to schedule a new event loop iteration with an
            // entirely separate event context. The SW will be kept alive by waitUntil()
            // within that separate context while initialization proceeds, while at the
            // same time the activation event is allowed to resolve and traffic starts
            // being served.
            if (this.scope.registration.active !== null) {
                this.scope.registration.active.postMessage({ action: 'INITIALIZE' });
            }
        });
        // Handle the fetch, message, and push events.
        this.scope.addEventListener('fetch', (event) => this.onFetch(event));
        this.scope.addEventListener('message', (event) => this.onMessage(event));
        this.scope.addEventListener('push', (event) => this.onPush(event));
        this.scope.addEventListener('notificationclick', (event) => this.onClick(event));
        // The debugger generates debug pages in response to debugging requests.
        this.debugger = new DebugHandler(this, this.adapter);
        // The IdleScheduler will execute idle tasks after a given delay.
        this.idle = new IdleScheduler(this.adapter, IDLE_THRESHOLD, this.debugger);
    }
    /**
     * The handler for fetch events.
     *
     * This is the transition point between the synchronous event handler and the
     * asynchronous execution that eventually resolves for respondWith() and waitUntil().
     */
    onFetch(event) {
        const req = event.request;
        // The only thing that is served unconditionally is the debug page.
        if (this.adapter.parseUrl(req.url, this.scope.registration.scope).path === '/ngsw/state') {
            // Allow the debugger to handle the request, but don't affect SW state in any
            // other way.
            event.respondWith(this.debugger.handleFetch(req));
            return;
        }
        // If the SW is in a broken state where it's not safe to handle requests at all,
        // returning causes the request to fall back on the network. This is preferred over
        // `respondWith(fetch(req))` because the latter still shows in DevTools that the
        // request was handled by the SW.
        // TODO: try to handle DriverReadyState.EXISTING_CLIENTS_ONLY here.
        if (this.state === DriverReadyState.SAFE_MODE) {
            // Even though the worker is in safe mode, idle tasks still need to happen so
            // things like update checks, etc. can take place.
            event.waitUntil(this.idle.trigger());
            return;
        }
        // When opening DevTools in Chrome, a request is made for the current URL (and possibly related
        // resources, e.g. scripts) with `cache: 'only-if-cached'` and `mode: 'no-cors'`. These request
        // will eventually fail, because `only-if-cached` is only allowed to be used with
        // `mode: 'same-origin'`.
        // This is likely a bug in Chrome DevTools. Avoid handling such requests.
        // (See also https://github.com/angular/angular/issues/22362.)
        // TODO(gkalpak): Remove once no longer necessary (i.e. fixed in Chrome DevTools).
        if (req.cache === 'only-if-cached' && req.mode !== 'same-origin') {
            // Log the incident only the first time it happens, to avoid spamming the logs.
            if (!this.loggedInvalidOnlyIfCachedRequest) {
                this.loggedInvalidOnlyIfCachedRequest = true;
                this.debugger.log(`Ignoring invalid request: 'only-if-cached' can be set only with 'same-origin' mode`, `Driver.fetch(${req.url}, cache: ${req.cache}, mode: ${req.mode})`);
            }
            return;
        }
        // Past this point, the SW commits to handling the request itself. This could still
        // fail (and result in `state` being set to `SAFE_MODE`), but even in that case the
        // SW will still deliver a response.
        event.respondWith(this.handleFetch(event));
    }
    /**
     * The handler for message events.
     */
    onMessage(event) {
        // Ignore message events when the SW is in safe mode, for now.
        if (this.state === DriverReadyState.SAFE_MODE) {
            return;
        }
        // If the message doesn't have the expected signature, ignore it.
        const data = event.data;
        if (!data || !data.action) {
            return;
        }
        // Initialization is the only event which is sent directly from the SW to itself,
        // and thus `event.source` is not a Client. Handle it here, before the check
        // for Client sources.
        if (data.action === 'INITIALIZE') {
            // Only initialize if not already initialized (or initializing).
            if (this.initialized === null) {
                // Initialize the SW.
                this.initialized = this.initialize();
                // Wait until initialization is properly scheduled, then trigger idle
                // events to allow it to complete (assuming the SW is idle).
                event.waitUntil((async () => {
                    await this.initialized;
                    await this.idle.trigger();
                })());
            }
            return;
        }
        // Only messages from true clients are accepted past this point (this is essentially
        // a typecast).
        if (!this.adapter.isClient(event.source)) {
            return;
        }
        // Handle the message and keep the SW alive until it's handled.
        event.waitUntil(this.handleMessage(data, event.source));
    }
    onPush(msg) {
        // Push notifications without data have no effect.
        if (!msg.data) {
            return;
        }
        // Handle the push and keep the SW alive until it's handled.
        msg.waitUntil(this.handlePush(msg.data.json()));
    }
    onClick(event) {
        // Handle the click event and keep the SW alive until it's handled.
        event.waitUntil(this.handleClick(event.notification, event.action));
    }
    async handleMessage(msg, from) {
        if (isMsgCheckForUpdates(msg)) {
            const action = (async () => { await this.checkForUpdate(); })();
            await this.reportStatus(from, action, msg.statusNonce);
        }
        else if (isMsgActivateUpdate(msg)) {
            await this.reportStatus(from, this.updateClient(from), msg.statusNonce);
        }
    }
    async handlePush(data) {
        await this.broadcast({
            type: 'PUSH',
            data,
        });
        if (!data.notification || !data.notification.title) {
            return;
        }
        const desc = data.notification;
        let options = {};
        NOTIFICATION_OPTION_NAMES.filter(name => desc.hasOwnProperty(name))
            .forEach(name => options[name] = desc[name]);
        await this.scope.registration.showNotification(desc['title'], options);
    }
    async handleClick(notification, action) {
        notification.close();
        const options = {};
        // The filter uses `name in notification` because the properties are on the prototype so
        // hasOwnProperty does not work here
        NOTIFICATION_OPTION_NAMES.filter(name => name in notification)
            .forEach(name => options[name] = notification[name]);
        await this.broadcast({
            type: 'NOTIFICATION_CLICK',
            data: { action, notification: options },
        });
    }
    async reportStatus(client, promise, nonce) {
        const response = { type: 'STATUS', nonce, status: true };
        try {
            await promise;
            client.postMessage(response);
        }
        catch (e) {
            client.postMessage(Object.assign({}, response, { status: false, error: e.toString() }));
        }
    }
    async updateClient(client) {
        // Figure out which version the client is on. If it's not on the latest,
        // it needs to be moved.
        const existing = this.clientVersionMap.get(client.id);
        if (existing === this.latestHash) {
            // Nothing to do, this client is already on the latest version.
            return;
        }
        // Switch the client over.
        let previous = undefined;
        // Look up the application data associated with the existing version. If there
        // isn't any, fall back on using the hash.
        if (existing !== undefined) {
            const existingVersion = this.versions.get(existing);
            previous = this.mergeHashWithAppData(existingVersion.manifest, existing);
        }
        // Set the current version used by the client, and sync the mapping to disk.
        this.clientVersionMap.set(client.id, this.latestHash);
        await this.sync();
        // Notify the client about this activation.
        const current = this.versions.get(this.latestHash);
        const notice = {
            type: 'UPDATE_ACTIVATED',
            previous,
            current: this.mergeHashWithAppData(current.manifest, this.latestHash),
        };
        client.postMessage(notice);
    }
    async handleFetch(event) {
        // Since the SW may have just been started, it may or may not have been initialized already.
        // this.initialized will be `null` if initialization has not yet been attempted, or will be a
        // Promise which will resolve (successfully or unsuccessfully) if it has.
        if (this.initialized === null) {
            // Initialization has not yet been attempted, so attempt it. This should only ever happen once
            // per SW instantiation.
            this.initialized = this.initialize();
        }
        // If initialization fails, the SW needs to enter a safe state, where it declines to respond to
        // network requests.
        try {
            // Wait for initialization.
            await this.initialized;
        }
        catch (e) {
            // Initialization failed. Enter a safe state.
            this.state = DriverReadyState.SAFE_MODE;
            this.stateMessage = `Initialization failed due to error: ${errorToString(e)}`;
            // Even though the driver entered safe mode, background tasks still need to happen.
            event.waitUntil(this.idle.trigger());
            // Since the SW is already committed to responding to the currently active request,
            // respond with a network fetch.
            return this.safeFetch(event.request);
        }
        // On navigation requests, check for new updates.
        if (event.request.mode === 'navigate' && !this.scheduledNavUpdateCheck) {
            this.scheduledNavUpdateCheck = true;
            this.idle.schedule('check-updates-on-navigation', async () => {
                this.scheduledNavUpdateCheck = false;
                await this.checkForUpdate();
            });
        }
        // Decide which version of the app to use to serve this request. This is asynchronous as in
        // some cases, a record will need to be written to disk about the assignment that is made.
        const appVersion = await this.assignVersion(event);
        // Bail out
        if (appVersion === null) {
            event.waitUntil(this.idle.trigger());
            return this.safeFetch(event.request);
        }
        let res = null;
        try {
            // Handle the request. First try the AppVersion. If that doesn't work, fall back on the
            // network.
            res = await appVersion.handleFetch(event.request, event);
        }
        catch (err) {
            if (err.isCritical) {
                // Something went wrong with the activation of this version.
                await this.versionFailed(appVersion, err, this.latestHash === appVersion.manifestHash);
                event.waitUntil(this.idle.trigger());
                return this.safeFetch(event.request);
            }
            throw err;
        }
        // The AppVersion will only return null if the manifest doesn't specify what to do about this
        // request. In that case, just fall back on the network.
        if (res === null) {
            event.waitUntil(this.idle.trigger());
            return this.safeFetch(event.request);
        }
        // Trigger the idle scheduling system. The Promise returned by trigger() will resolve after
        // a specific amount of time has passed. If trigger() hasn't been called again by then (e.g.
        // on a subsequent request), the idle task queue will be drained and the Promise won't resolve
        // until that operation is complete as well.
        event.waitUntil(this.idle.trigger());
        // The AppVersion returned a usable response, so return it.
        return res;
    }
    /**
     * Attempt to quickly reach a state where it's safe to serve responses.
     */
    async initialize() {
        // On initialization, all of the serialized state is read out of the 'control'
        // table. This includes:
        // - map of hashes to manifests of currently loaded application versions
        // - map of client IDs to their pinned versions
        // - record of the most recently fetched manifest hash
        //
        // If these values don't exist in the DB, then this is the either the first time
        // the SW has run or the DB state has been wiped or is inconsistent. In that case,
        // load a fresh copy of the manifest and reset the state from scratch.
        // Open up the DB table.
        const table = await this.db.open('control');
        // Attempt to load the needed state from the DB. If this fails, the catch {} block
        // will populate these variables with freshly constructed values.
        let manifests, assignments, latest;
        try {
            // Read them from the DB simultaneously.
            [manifests, assignments, latest] = await Promise.all([
                table.read('manifests'),
                table.read('assignments'),
                table.read('latest'),
            ]);
            // Successfully loaded from saved state. This implies a manifest exists, so
            // the update check needs to happen in the background.
            this.idle.schedule('init post-load (update, cleanup)', async () => {
                await this.checkForUpdate();
                try {
                    await this.cleanupCaches();
                }
                catch (err) {
                    // Nothing to do - cleanup failed. Just log it.
                    this.debugger.log(err, 'cleanupCaches @ init post-load');
                }
            });
        }
        catch (_) {
            // Something went wrong. Try to start over by fetching a new manifest from the
            // server and building up an empty initial state.
            const manifest = await this.fetchLatestManifest();
            const hash = hashManifest(manifest);
            manifests = {};
            manifests[hash] = manifest;
            assignments = {};
            latest = { latest: hash };
            // Save the initial state to the DB.
            await Promise.all([
                table.write('manifests', manifests),
                table.write('assignments', assignments),
                table.write('latest', latest),
            ]);
        }
        // At this point, either the state has been loaded successfully, or fresh state
        // with a new copy of the manifest has been produced. At this point, the `Driver`
        // can have its internals hydrated from the state.
        // Initialize the `versions` map by setting each hash to a new `AppVersion` instance
        // for that manifest.
        Object.keys(manifests).forEach((hash) => {
            const manifest = manifests[hash];
            // If the manifest is newly initialized, an AppVersion may have already been
            // created for it.
            if (!this.versions.has(hash)) {
                this.versions.set(hash, new AppVersion(this.scope, this.adapter, this.db, this.idle, manifest, hash));
            }
        });
        // Map each client ID to its associated hash. Along the way, verify that the hash
        // is still valid for that client ID. It should not be possible for a client to
        // still be associated with a hash that was since removed from the state.
        Object.keys(assignments).forEach((clientId) => {
            const hash = assignments[clientId];
            if (this.versions.has(hash)) {
                this.clientVersionMap.set(clientId, hash);
            }
            else {
                this.clientVersionMap.set(clientId, latest.latest);
                this.debugger.log(`Unknown version ${hash} mapped for client ${clientId}, using latest instead`, `initialize: map assignments`);
            }
        });
        // Set the latest version.
        this.latestHash = latest.latest;
        // Finally, assert that the latest version is in fact loaded.
        if (!this.versions.has(latest.latest)) {
            throw new Error(`Invariant violated (initialize): latest hash ${latest.latest} has no known manifest`);
        }
        // Finally, wait for the scheduling of initialization of all versions in the
        // manifest. Ordinarily this just schedules the initializations to happen during
        // the next idle period, but in development mode this might actually wait for the
        // full initialization.
        // If any of these initializations fail, versionFailed() will be called either
        // synchronously or asynchronously to handle the failure and re-map clients.
        await Promise.all(Object.keys(manifests).map(async (hash) => {
            try {
                // Attempt to schedule or initialize this version. If this operation is
                // successful, then initialization either succeeded or was scheduled. If
                // it fails, then full initialization was attempted and failed.
                await this.scheduleInitialization(this.versions.get(hash), this.latestHash === hash);
            }
            catch (err) {
                this.debugger.log(err, `initialize: schedule init of ${hash}`);
                return false;
            }
        }));
    }
    lookupVersionByHash(hash, debugName = 'lookupVersionByHash') {
        // The version should exist, but check just in case.
        if (!this.versions.has(hash)) {
            throw new Error(`Invariant violated (${debugName}): want AppVersion for ${hash} but not loaded`);
        }
        return this.versions.get(hash);
    }
    /**
     * Decide which version of the manifest to use for the event.
     */
    async assignVersion(event) {
        // First, check whether the event has a (non empty) client ID. If it does, the version may
        // already be associated.
        const clientId = event.clientId;
        if (clientId) {
            // Check if there is an assigned client id.
            if (this.clientVersionMap.has(clientId)) {
                // There is an assignment for this client already.
                const hash = this.clientVersionMap.get(clientId);
                let appVersion = this.lookupVersionByHash(hash, 'assignVersion');
                // Ordinarily, this client would be served from its assigned version. But, if this
                // request is a navigation request, this client can be updated to the latest
                // version immediately.
                if (this.state === DriverReadyState.NORMAL && hash !== this.latestHash &&
                    appVersion.isNavigationRequest(event.request)) {
                    // Update this client to the latest version immediately.
                    if (this.latestHash === null) {
                        throw new Error(`Invariant violated (assignVersion): latestHash was null`);
                    }
                    const client = await this.scope.clients.get(clientId);
                    await this.updateClient(client);
                    appVersion = this.lookupVersionByHash(this.latestHash, 'assignVersion');
                }
                // TODO: make sure the version is valid.
                return appVersion;
            }
            else {
                // This is the first time this client ID has been seen. Whether the SW is in a
                // state to handle new clients depends on the current readiness state, so check
                // that first.
                if (this.state !== DriverReadyState.NORMAL) {
                    // It's not safe to serve new clients in the current state. It's possible that
                    // this is an existing client which has not been mapped yet (see below) but
                    // even if that is the case, it's invalid to make an assignment to a known
                    // invalid version, even if that assignment was previously implicit. Return
                    // undefined here to let the caller know that no assignment is possible at
                    // this time.
                    return null;
                }
                // It's safe to handle this request. Two cases apply. Either:
                // 1) the browser assigned a client ID at the time of the navigation request, and
                //    this is truly the first time seeing this client, or
                // 2) a navigation request came previously from the same client, but with no client
                //    ID attached. Browsers do this to avoid creating a client under the origin in
                //    the event the navigation request is just redirected.
                //
                // In case 1, the latest version can safely be used.
                // In case 2, the latest version can be used, with the assumption that the previous
                // navigation request was answered under the same version. This assumption relies
                // on the fact that it's unlikely an update will come in between the navigation
                // request and requests for subsequent resources on that page.
                // First validate the current state.
                if (this.latestHash === null) {
                    throw new Error(`Invariant violated (assignVersion): latestHash was null`);
                }
                // Pin this client ID to the current latest version, indefinitely.
                this.clientVersionMap.set(clientId, this.latestHash);
                await this.sync();
                // Return the latest `AppVersion`.
                return this.lookupVersionByHash(this.latestHash, 'assignVersion');
            }
        }
        else {
            // No client ID was associated with the request. This must be a navigation request
            // for a new client. First check that the SW is accepting new clients.
            if (this.state !== DriverReadyState.NORMAL) {
                return null;
            }
            // Serve it with the latest version, and assume that the client will actually get
            // associated with that version on the next request.
            // First validate the current state.
            if (this.latestHash === null) {
                throw new Error(`Invariant violated (assignVersion): latestHash was null`);
            }
            // Return the latest `AppVersion`.
            return this.lookupVersionByHash(this.latestHash, 'assignVersion');
        }
    }
    async fetchLatestManifest(ignoreOfflineError = false) {
        const res = await this.safeFetch(this.adapter.newRequest('ngsw.json?ngsw-cache-bust=' + Math.random()));
        if (!res.ok) {
            if (res.status === 404) {
                await this.deleteAllCaches();
                await this.scope.registration.unregister();
            }
            else if (res.status === 504 && ignoreOfflineError) {
                return null;
            }
            throw new Error(`Manifest fetch failed! (status: ${res.status})`);
        }
        this.lastUpdateCheck = this.adapter.time;
        return res.json();
    }
    async deleteAllCaches() {
        await (await this.scope.caches.keys())
            .filter(key => key.startsWith('ngsw:'))
            .reduce(async (previous, key) => {
            await Promise.all([
                previous,
                this.scope.caches.delete(key),
            ]);
        }, Promise.resolve());
    }
    /**
     * Schedule the SW's attempt to reach a fully prefetched state for the given AppVersion
     * when the SW is not busy and has connectivity. This returns a Promise which must be
     * awaited, as under some conditions the AppVersion might be initialized immediately.
     */
    async scheduleInitialization(appVersion, latest) {
        const initialize = async () => {
            try {
                await appVersion.initializeFully();
            }
            catch (err) {
                this.debugger.log(err, `initializeFully for ${appVersion.manifestHash}`);
                await this.versionFailed(appVersion, err, latest);
            }
        };
        // TODO: better logic for detecting localhost.
        if (this.scope.registration.scope.indexOf('://localhost') > -1) {
            return initialize();
        }
        this.idle.schedule(`initialization(${appVersion.manifestHash})`, initialize);
    }
    async versionFailed(appVersion, err, latest) {
        // This particular AppVersion is broken. First, find the manifest hash.
        const broken = Array.from(this.versions.entries()).find(([hash, version]) => version === appVersion);
        if (broken === undefined) {
            // This version is no longer in use anyway, so nobody cares.
            return;
        }
        const brokenHash = broken[0];
        // TODO: notify affected apps.
        // The action taken depends on whether the broken manifest is the active (latest) or not.
        // If so, the SW cannot accept new clients, but can continue to service old ones.
        if (this.latestHash === brokenHash || latest) {
            // The latest manifest is broken. This means that new clients are at the mercy of the
            // network, but caches continue to be valid for previous versions. This is
            // unfortunate but unavoidable.
            this.state = DriverReadyState.EXISTING_CLIENTS_ONLY;
            this.stateMessage = `Degraded due to: ${errorToString(err)}`;
            // Cancel the binding for these clients.
            Array.from(this.clientVersionMap.keys())
                .forEach(clientId => this.clientVersionMap.delete(clientId));
        }
        else {
            // The current version is viable, but this older version isn't. The only
            // possible remedy is to stop serving the older version and go to the network.
            // Figure out which clients are affected and put them on the latest.
            const affectedClients = Array.from(this.clientVersionMap.keys())
                .filter(clientId => this.clientVersionMap.get(clientId) === brokenHash);
            // Push the affected clients onto the latest version.
            affectedClients.forEach(clientId => this.clientVersionMap.set(clientId, this.latestHash));
        }
        try {
            await this.sync();
        }
        catch (err2) {
            // We are already in a bad state. No need to make things worse.
            // Just log the error and move on.
            this.debugger.log(err2, `Driver.versionFailed(${err.message || err})`);
        }
    }
    async setupUpdate(manifest, hash) {
        const newVersion = new AppVersion(this.scope, this.adapter, this.db, this.idle, manifest, hash);
        // Firstly, check if the manifest version is correct.
        if (manifest.configVersion !== SUPPORTED_CONFIG_VERSION) {
            await this.deleteAllCaches();
            await this.scope.registration.unregister();
            throw new Error(`Invalid config version: expected ${SUPPORTED_CONFIG_VERSION}, got ${manifest.configVersion}.`);
        }
        // Cause the new version to become fully initialized. If this fails, then the
        // version will not be available for use.
        await newVersion.initializeFully(this);
        // Install this as an active version of the app.
        this.versions.set(hash, newVersion);
        // Future new clients will use this hash as the latest version.
        this.latestHash = hash;
        await this.sync();
        await this.notifyClientsAboutUpdate();
    }
    async checkForUpdate() {
        let hash = '(unknown)';
        try {
            const manifest = await this.fetchLatestManifest(true);
            if (manifest === null) {
                // Client or server offline. Unable to check for updates at this time.
                // Continue to service clients (existing and new).
                this.debugger.log('Check for update aborted. (Client or server offline.)');
                return false;
            }
            hash = hashManifest(manifest);
            // Check whether this is really an update.
            if (this.versions.has(hash)) {
                return false;
            }
            await this.setupUpdate(manifest, hash);
            return true;
        }
        catch (err) {
            this.debugger.log(err, `Error occurred while updating to manifest ${hash}`);
            this.state = DriverReadyState.EXISTING_CLIENTS_ONLY;
            this.stateMessage = `Degraded due to failed initialization: ${errorToString(err)}`;
            return false;
        }
    }
    /**
     * Synchronize the existing state to the underlying database.
     */
    async sync() {
        // Open up the DB table.
        const table = await this.db.open('control');
        // Construct a serializable map of hashes to manifests.
        const manifests = {};
        this.versions.forEach((version, hash) => { manifests[hash] = version.manifest; });
        // Construct a serializable map of client ids to version hashes.
        const assignments = {};
        this.clientVersionMap.forEach((hash, clientId) => { assignments[clientId] = hash; });
        // Record the latest entry. Since this is a sync which is necessarily happening after
        // initialization, latestHash should always be valid.
        const latest = {
            latest: this.latestHash,
        };
        // Synchronize all of these.
        await Promise.all([
            table.write('manifests', manifests),
            table.write('assignments', assignments),
            table.write('latest', latest),
        ]);
    }
    async cleanupCaches() {
        // Query for all currently active clients, and list the client ids. This may skip
        // some clients in the browser back-forward cache, but not much can be done about
        // that.
        const activeClients = (await this.scope.clients.matchAll()).map(client => client.id);
        // A simple list of client ids that the SW has kept track of. Subtracting
        // activeClients from this list will result in the set of client ids which are
        // being tracked but are no longer used in the browser, and thus can be cleaned up.
        const knownClients = Array.from(this.clientVersionMap.keys());
        // Remove clients in the clientVersionMap that are no longer active.
        knownClients.filter(id => activeClients.indexOf(id) === -1)
            .forEach(id => this.clientVersionMap.delete(id));
        // Next, determine the set of versions which are still used. All others can be
        // removed.
        const usedVersions = new Set();
        this.clientVersionMap.forEach((version, _) => usedVersions.add(version));
        // Collect all obsolete versions by filtering out used versions from the set of all versions.
        const obsoleteVersions = Array.from(this.versions.keys())
            .filter(version => !usedVersions.has(version) && version !== this.latestHash);
        // Remove all the versions which are no longer used.
        await obsoleteVersions.reduce(async (previous, version) => {
            // Wait for the other cleanup operations to complete.
            await previous;
            // Try to get past the failure of one particular version to clean up (this
            // shouldn't happen, but handle it just in case).
            try {
                // Get ahold of the AppVersion for this particular hash.
                const instance = this.versions.get(version);
                // Delete it from the canonical map.
                this.versions.delete(version);
                // Clean it up.
                await instance.cleanup();
            }
            catch (err) {
                // Oh well? Not much that can be done here. These caches will be removed when
                // the SW revs its format version, which happens from time to time.
                this.debugger.log(err, `cleanupCaches - cleanup ${version}`);
            }
        }, Promise.resolve());
        // Commit all the changes to the saved state.
        await this.sync();
    }
    /**
     * Determine if a specific version of the given resource is cached anywhere within the SW,
     * and fetch it if so.
     */
    lookupResourceWithHash(url, hash) {
        return Array
            // Scan through the set of all cached versions, valid or otherwise. It's safe to do such
            // lookups even for invalid versions as the cached version of a resource will have the
            // same hash regardless.
            .from(this.versions.values())
            // Reduce the set of versions to a single potential result. At any point along the
            // reduction, if a response has already been identified, then pass it through, as no
            // future operation could change the response. If no response has been found yet, keep
            // checking versions until one is or until all versions have been exhausted.
            .reduce(async (prev, version) => {
            // First, check the previous result. If a non-null result has been found already, just
            // return it.
            if (await prev !== null) {
                return prev;
            }
            // No result has been found yet. Try the next `AppVersion`.
            return version.lookupResourceWithHash(url, hash);
        }, Promise.resolve(null));
    }
    async lookupResourceWithoutHash(url) {
        await this.initialized;
        const version = this.versions.get(this.latestHash);
        return version.lookupResourceWithoutHash(url);
    }
    async previouslyCachedResources() {
        await this.initialized;
        const version = this.versions.get(this.latestHash);
        return version.previouslyCachedResources();
    }
    recentCacheStatus(url) {
        const version = this.versions.get(this.latestHash);
        return version.recentCacheStatus(url);
    }
    mergeHashWithAppData(manifest, hash) {
        return {
            hash,
            appData: manifest.appData,
        };
    }
    async notifyClientsAboutUpdate() {
        await this.initialized;
        const clients = await this.scope.clients.matchAll();
        const next = this.versions.get(this.latestHash);
        await clients.reduce(async (previous, client) => {
            await previous;
            // Firstly, determine which version this client is on.
            const version = this.clientVersionMap.get(client.id);
            if (version === undefined) {
                // Unmapped client - assume it's the latest.
                return;
            }
            if (version === this.latestHash) {
                // Client is already on the latest version, no need for a notification.
                return;
            }
            const current = this.versions.get(version);
            // Send a notice.
            const notice = {
                type: 'UPDATE_AVAILABLE',
                current: this.mergeHashWithAppData(current.manifest, version),
                available: this.mergeHashWithAppData(next.manifest, this.latestHash),
            };
            client.postMessage(notice);
        }, Promise.resolve());
    }
    async broadcast(msg) {
        const clients = await this.scope.clients.matchAll();
        clients.forEach(client => { client.postMessage(msg); });
    }
    async debugState() {
        return {
            state: DriverReadyState[this.state],
            why: this.stateMessage,
            latestHash: this.latestHash,
            lastUpdateCheck: this.lastUpdateCheck,
        };
    }
    async debugVersions() {
        // Build list of versions.
        return Array.from(this.versions.keys()).map(hash => {
            const version = this.versions.get(hash);
            const clients = Array.from(this.clientVersionMap.entries())
                .filter(([clientId, version]) => version === hash)
                .map(([clientId, version]) => clientId);
            return {
                hash,
                manifest: version.manifest, clients,
                status: '',
            };
        });
    }
    async debugIdleState() {
        return {
            queue: this.idle.taskDescriptions,
            lastTrigger: this.idle.lastTrigger,
            lastRun: this.idle.lastRun,
        };
    }
    async safeFetch(req) {
        try {
            return await this.scope.fetch(req);
        }
        catch (err) {
            this.debugger.log(err, `Driver.fetch(${req.url})`);
            return this.adapter.newResponse(null, {
                status: 504,
                statusText: 'Gateway Timeout',
            });
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJpdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvd29ya2VyL3NyYy9kcml2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBSUgsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUV6QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBQ3JDLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFDdEMsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUNyQyxPQUFPLEVBQXlCLFlBQVksRUFBQyxNQUFNLFlBQVksQ0FBQztBQUNoRSxPQUFPLEVBQVMsbUJBQW1CLEVBQUUsb0JBQW9CLEVBQUMsTUFBTSxPQUFPLENBQUM7QUFXeEUsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDO0FBRTVCLE1BQU0sd0JBQXdCLEdBQUcsQ0FBQyxDQUFDO0FBRW5DLE1BQU0seUJBQXlCLEdBQUc7SUFDaEMsU0FBUyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVO0lBQzlFLG9CQUFvQixFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxTQUFTO0NBQ3ZFLENBQUM7QUFNRixNQUFNLENBQU4sSUFBWSxnQkFZWDtBQVpELFdBQVksZ0JBQWdCO0lBQzFCLG1FQUFtRTtJQUNuRSwyREFBTSxDQUFBO0lBRU4sd0ZBQXdGO0lBQ3hGLHVGQUF1RjtJQUN2Riw0QkFBNEI7SUFDNUIseUZBQXFCLENBQUE7SUFFckIsb0ZBQW9GO0lBQ3BGLG1DQUFtQztJQUNuQyxpRUFBUyxDQUFBO0FBQ1gsQ0FBQyxFQVpXLGdCQUFnQixLQUFoQixnQkFBZ0IsUUFZM0I7QUFFRCxNQUFNO0lB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