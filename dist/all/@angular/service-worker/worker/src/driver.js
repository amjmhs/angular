"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_version_1 = require("./app-version");
var debug_1 = require("./debug");
var error_1 = require("./error");
var idle_1 = require("./idle");
var manifest_1 = require("./manifest");
var msg_1 = require("./msg");
var IDLE_THRESHOLD = 5000;
var SUPPORTED_CONFIG_VERSION = 1;
var NOTIFICATION_OPTION_NAMES = [
    'actions', 'badge', 'body', 'data', 'dir', 'icon', 'image', 'lang', 'renotify',
    'requireInteraction', 'silent', 'tag', 'timestamp', 'title', 'vibrate'
];
var DriverReadyState;
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
})(DriverReadyState = exports.DriverReadyState || (exports.DriverReadyState = {}));
var Driver = /** @class */ (function () {
    function Driver(scope, adapter, db) {
        // Set up all the event handlers that the SW needs.
        var _this = this;
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
        this.scope.addEventListener('install', function (event) {
            // SW code updates are separate from application updates, so code updates are
            // almost as straightforward as restarting the SW. Because of this, it's always
            // safe to skip waiting until application tabs are closed, and activate the new
            // SW version immediately.
            event.waitUntil(_this.scope.skipWaiting());
        });
        // The activate event is triggered when this version of the service worker is
        // first activated.
        this.scope.addEventListener('activate', function (event) {
            // As above, it's safe to take over from existing clients immediately, since
            // the new SW version will continue to serve the old application.
            event.waitUntil(_this.scope.clients.claim());
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
            if (_this.scope.registration.active !== null) {
                _this.scope.registration.active.postMessage({ action: 'INITIALIZE' });
            }
        });
        // Handle the fetch, message, and push events.
        this.scope.addEventListener('fetch', function (event) { return _this.onFetch(event); });
        this.scope.addEventListener('message', function (event) { return _this.onMessage(event); });
        this.scope.addEventListener('push', function (event) { return _this.onPush(event); });
        this.scope.addEventListener('notificationclick', function (event) { return _this.onClick(event); });
        // The debugger generates debug pages in response to debugging requests.
        this.debugger = new debug_1.DebugHandler(this, this.adapter);
        // The IdleScheduler will execute idle tasks after a given delay.
        this.idle = new idle_1.IdleScheduler(this.adapter, IDLE_THRESHOLD, this.debugger);
    }
    /**
     * The handler for fetch events.
     *
     * This is the transition point between the synchronous event handler and the
     * asynchronous execution that eventually resolves for respondWith() and waitUntil().
     */
    Driver.prototype.onFetch = function (event) {
        var req = event.request;
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
                this.debugger.log("Ignoring invalid request: 'only-if-cached' can be set only with 'same-origin' mode", "Driver.fetch(" + req.url + ", cache: " + req.cache + ", mode: " + req.mode + ")");
            }
            return;
        }
        // Past this point, the SW commits to handling the request itself. This could still
        // fail (and result in `state` being set to `SAFE_MODE`), but even in that case the
        // SW will still deliver a response.
        event.respondWith(this.handleFetch(event));
    };
    /**
     * The handler for message events.
     */
    Driver.prototype.onMessage = function (event) {
        var _this = this;
        // Ignore message events when the SW is in safe mode, for now.
        if (this.state === DriverReadyState.SAFE_MODE) {
            return;
        }
        // If the message doesn't have the expected signature, ignore it.
        var data = event.data;
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
                event.waitUntil((function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.initialized];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, this.idle.trigger()];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); })());
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
    };
    Driver.prototype.onPush = function (msg) {
        // Push notifications without data have no effect.
        if (!msg.data) {
            return;
        }
        // Handle the push and keep the SW alive until it's handled.
        msg.waitUntil(this.handlePush(msg.data.json()));
    };
    Driver.prototype.onClick = function (event) {
        // Handle the click event and keep the SW alive until it's handled.
        event.waitUntil(this.handleClick(event.notification, event.action));
    };
    Driver.prototype.handleMessage = function (msg, from) {
        return __awaiter(this, void 0, void 0, function () {
            var action;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!msg_1.isMsgCheckForUpdates(msg)) return [3 /*break*/, 2];
                        action = (function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.checkForUpdate()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        }); }); })();
                        return [4 /*yield*/, this.reportStatus(from, action, msg.statusNonce)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        if (!msg_1.isMsgActivateUpdate(msg)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.reportStatus(from, this.updateClient(from), msg.statusNonce)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Driver.prototype.handlePush = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var desc, options;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.broadcast({
                            type: 'PUSH',
                            data: data,
                        })];
                    case 1:
                        _a.sent();
                        if (!data.notification || !data.notification.title) {
                            return [2 /*return*/];
                        }
                        desc = data.notification;
                        options = {};
                        NOTIFICATION_OPTION_NAMES.filter(function (name) { return desc.hasOwnProperty(name); })
                            .forEach(function (name) { return options[name] = desc[name]; });
                        return [4 /*yield*/, this.scope.registration.showNotification(desc['title'], options)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Driver.prototype.handleClick = function (notification, action) {
        return __awaiter(this, void 0, void 0, function () {
            var options;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        notification.close();
                        options = {};
                        // The filter uses `name in notification` because the properties are on the prototype so
                        // hasOwnProperty does not work here
                        NOTIFICATION_OPTION_NAMES.filter(function (name) { return name in notification; })
                            .forEach(function (name) { return options[name] = notification[name]; });
                        return [4 /*yield*/, this.broadcast({
                                type: 'NOTIFICATION_CLICK',
                                data: { action: action, notification: options },
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Driver.prototype.reportStatus = function (client, promise, nonce) {
        return __awaiter(this, void 0, void 0, function () {
            var response, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = { type: 'STATUS', nonce: nonce, status: true };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, promise];
                    case 2:
                        _a.sent();
                        client.postMessage(response);
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        client.postMessage(__assign({}, response, { status: false, error: e_1.toString() }));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Driver.prototype.updateClient = function (client) {
        return __awaiter(this, void 0, void 0, function () {
            var existing, previous, existingVersion, current, notice;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        existing = this.clientVersionMap.get(client.id);
                        if (existing === this.latestHash) {
                            // Nothing to do, this client is already on the latest version.
                            return [2 /*return*/];
                        }
                        previous = undefined;
                        // Look up the application data associated with the existing version. If there
                        // isn't any, fall back on using the hash.
                        if (existing !== undefined) {
                            existingVersion = this.versions.get(existing);
                            previous = this.mergeHashWithAppData(existingVersion.manifest, existing);
                        }
                        // Set the current version used by the client, and sync the mapping to disk.
                        this.clientVersionMap.set(client.id, this.latestHash);
                        return [4 /*yield*/, this.sync()];
                    case 1:
                        _a.sent();
                        current = this.versions.get(this.latestHash);
                        notice = {
                            type: 'UPDATE_ACTIVATED',
                            previous: previous,
                            current: this.mergeHashWithAppData(current.manifest, this.latestHash),
                        };
                        client.postMessage(notice);
                        return [2 /*return*/];
                }
            });
        });
    };
    Driver.prototype.handleFetch = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var e_2, appVersion, res, err_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Since the SW may have just been started, it may or may not have been initialized already.
                        // this.initialized will be `null` if initialization has not yet been attempted, or will be a
                        // Promise which will resolve (successfully or unsuccessfully) if it has.
                        if (this.initialized === null) {
                            // Initialization has not yet been attempted, so attempt it. This should only ever happen once
                            // per SW instantiation.
                            this.initialized = this.initialize();
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        // Wait for initialization.
                        return [4 /*yield*/, this.initialized];
                    case 2:
                        // Wait for initialization.
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        // Initialization failed. Enter a safe state.
                        this.state = DriverReadyState.SAFE_MODE;
                        this.stateMessage = "Initialization failed due to error: " + error_1.errorToString(e_2);
                        // Even though the driver entered safe mode, background tasks still need to happen.
                        event.waitUntil(this.idle.trigger());
                        // Since the SW is already committed to responding to the currently active request,
                        // respond with a network fetch.
                        return [2 /*return*/, this.safeFetch(event.request)];
                    case 4:
                        // On navigation requests, check for new updates.
                        if (event.request.mode === 'navigate' && !this.scheduledNavUpdateCheck) {
                            this.scheduledNavUpdateCheck = true;
                            this.idle.schedule('check-updates-on-navigation', function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            this.scheduledNavUpdateCheck = false;
                                            return [4 /*yield*/, this.checkForUpdate()];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        }
                        return [4 /*yield*/, this.assignVersion(event)];
                    case 5:
                        appVersion = _a.sent();
                        // Bail out
                        if (appVersion === null) {
                            event.waitUntil(this.idle.trigger());
                            return [2 /*return*/, this.safeFetch(event.request)];
                        }
                        res = null;
                        _a.label = 6;
                    case 6:
                        _a.trys.push([6, 8, , 11]);
                        return [4 /*yield*/, appVersion.handleFetch(event.request, event)];
                    case 7:
                        // Handle the request. First try the AppVersion. If that doesn't work, fall back on the
                        // network.
                        res = _a.sent();
                        return [3 /*break*/, 11];
                    case 8:
                        err_1 = _a.sent();
                        if (!err_1.isCritical) return [3 /*break*/, 10];
                        // Something went wrong with the activation of this version.
                        return [4 /*yield*/, this.versionFailed(appVersion, err_1, this.latestHash === appVersion.manifestHash)];
                    case 9:
                        // Something went wrong with the activation of this version.
                        _a.sent();
                        event.waitUntil(this.idle.trigger());
                        return [2 /*return*/, this.safeFetch(event.request)];
                    case 10: throw err_1;
                    case 11:
                        // The AppVersion will only return null if the manifest doesn't specify what to do about this
                        // request. In that case, just fall back on the network.
                        if (res === null) {
                            event.waitUntil(this.idle.trigger());
                            return [2 /*return*/, this.safeFetch(event.request)];
                        }
                        // Trigger the idle scheduling system. The Promise returned by trigger() will resolve after
                        // a specific amount of time has passed. If trigger() hasn't been called again by then (e.g.
                        // on a subsequent request), the idle task queue will be drained and the Promise won't resolve
                        // until that operation is complete as well.
                        event.waitUntil(this.idle.trigger());
                        // The AppVersion returned a usable response, so return it.
                        return [2 /*return*/, res];
                }
            });
        });
    };
    /**
     * Attempt to quickly reach a state where it's safe to serve responses.
     */
    Driver.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, table, manifests, assignments, latest, _1, manifest, hash;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.db.open('control')];
                    case 1:
                        table = _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 7]);
                        return [4 /*yield*/, Promise.all([
                                table.read('manifests'),
                                table.read('assignments'),
                                table.read('latest'),
                            ])];
                    case 3:
                        // Read them from the DB simultaneously.
                        _a = _b.sent(), manifests = _a[0], assignments = _a[1], latest = _a[2];
                        // Successfully loaded from saved state. This implies a manifest exists, so
                        // the update check needs to happen in the background.
                        this.idle.schedule('init post-load (update, cleanup)', function () { return __awaiter(_this, void 0, void 0, function () {
                            var err_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.checkForUpdate()];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2:
                                        _a.trys.push([2, 4, , 5]);
                                        return [4 /*yield*/, this.cleanupCaches()];
                                    case 3:
                                        _a.sent();
                                        return [3 /*break*/, 5];
                                    case 4:
                                        err_2 = _a.sent();
                                        // Nothing to do - cleanup failed. Just log it.
                                        this.debugger.log(err_2, 'cleanupCaches @ init post-load');
                                        return [3 /*break*/, 5];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [3 /*break*/, 7];
                    case 4:
                        _1 = _b.sent();
                        return [4 /*yield*/, this.fetchLatestManifest()];
                    case 5:
                        manifest = _b.sent();
                        hash = manifest_1.hashManifest(manifest);
                        manifests = {};
                        manifests[hash] = manifest;
                        assignments = {};
                        latest = { latest: hash };
                        // Save the initial state to the DB.
                        return [4 /*yield*/, Promise.all([
                                table.write('manifests', manifests),
                                table.write('assignments', assignments),
                                table.write('latest', latest),
                            ])];
                    case 6:
                        // Save the initial state to the DB.
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 7:
                        // At this point, either the state has been loaded successfully, or fresh state
                        // with a new copy of the manifest has been produced. At this point, the `Driver`
                        // can have its internals hydrated from the state.
                        // Initialize the `versions` map by setting each hash to a new `AppVersion` instance
                        // for that manifest.
                        Object.keys(manifests).forEach(function (hash) {
                            var manifest = manifests[hash];
                            // If the manifest is newly initialized, an AppVersion may have already been
                            // created for it.
                            if (!_this.versions.has(hash)) {
                                _this.versions.set(hash, new app_version_1.AppVersion(_this.scope, _this.adapter, _this.db, _this.idle, manifest, hash));
                            }
                        });
                        // Map each client ID to its associated hash. Along the way, verify that the hash
                        // is still valid for that client ID. It should not be possible for a client to
                        // still be associated with a hash that was since removed from the state.
                        Object.keys(assignments).forEach(function (clientId) {
                            var hash = assignments[clientId];
                            if (_this.versions.has(hash)) {
                                _this.clientVersionMap.set(clientId, hash);
                            }
                            else {
                                _this.clientVersionMap.set(clientId, latest.latest);
                                _this.debugger.log("Unknown version " + hash + " mapped for client " + clientId + ", using latest instead", "initialize: map assignments");
                            }
                        });
                        // Set the latest version.
                        this.latestHash = latest.latest;
                        // Finally, assert that the latest version is in fact loaded.
                        if (!this.versions.has(latest.latest)) {
                            throw new Error("Invariant violated (initialize): latest hash " + latest.latest + " has no known manifest");
                        }
                        // Finally, wait for the scheduling of initialization of all versions in the
                        // manifest. Ordinarily this just schedules the initializations to happen during
                        // the next idle period, but in development mode this might actually wait for the
                        // full initialization.
                        // If any of these initializations fail, versionFailed() will be called either
                        // synchronously or asynchronously to handle the failure and re-map clients.
                        return [4 /*yield*/, Promise.all(Object.keys(manifests).map(function (hash) { return __awaiter(_this, void 0, void 0, function () {
                                var err_3;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            // Attempt to schedule or initialize this version. If this operation is
                                            // successful, then initialization either succeeded or was scheduled. If
                                            // it fails, then full initialization was attempted and failed.
                                            return [4 /*yield*/, this.scheduleInitialization(this.versions.get(hash), this.latestHash === hash)];
                                        case 1:
                                            // Attempt to schedule or initialize this version. If this operation is
                                            // successful, then initialization either succeeded or was scheduled. If
                                            // it fails, then full initialization was attempted and failed.
                                            _a.sent();
                                            return [3 /*break*/, 3];
                                        case 2:
                                            err_3 = _a.sent();
                                            this.debugger.log(err_3, "initialize: schedule init of " + hash);
                                            return [2 /*return*/, false];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 8:
                        // Finally, wait for the scheduling of initialization of all versions in the
                        // manifest. Ordinarily this just schedules the initializations to happen during
                        // the next idle period, but in development mode this might actually wait for the
                        // full initialization.
                        // If any of these initializations fail, versionFailed() will be called either
                        // synchronously or asynchronously to handle the failure and re-map clients.
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Driver.prototype.lookupVersionByHash = function (hash, debugName) {
        if (debugName === void 0) { debugName = 'lookupVersionByHash'; }
        // The version should exist, but check just in case.
        if (!this.versions.has(hash)) {
            throw new Error("Invariant violated (" + debugName + "): want AppVersion for " + hash + " but not loaded");
        }
        return this.versions.get(hash);
    };
    /**
     * Decide which version of the manifest to use for the event.
     */
    Driver.prototype.assignVersion = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var clientId, hash, appVersion, client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        clientId = event.clientId;
                        if (!clientId) return [3 /*break*/, 7];
                        if (!this.clientVersionMap.has(clientId)) return [3 /*break*/, 4];
                        hash = this.clientVersionMap.get(clientId);
                        appVersion = this.lookupVersionByHash(hash, 'assignVersion');
                        if (!(this.state === DriverReadyState.NORMAL && hash !== this.latestHash &&
                            appVersion.isNavigationRequest(event.request))) return [3 /*break*/, 3];
                        // Update this client to the latest version immediately.
                        if (this.latestHash === null) {
                            throw new Error("Invariant violated (assignVersion): latestHash was null");
                        }
                        return [4 /*yield*/, this.scope.clients.get(clientId)];
                    case 1:
                        client = _a.sent();
                        return [4 /*yield*/, this.updateClient(client)];
                    case 2:
                        _a.sent();
                        appVersion = this.lookupVersionByHash(this.latestHash, 'assignVersion');
                        _a.label = 3;
                    case 3: 
                    // TODO: make sure the version is valid.
                    return [2 /*return*/, appVersion];
                    case 4:
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
                            return [2 /*return*/, null];
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
                            throw new Error("Invariant violated (assignVersion): latestHash was null");
                        }
                        // Pin this client ID to the current latest version, indefinitely.
                        this.clientVersionMap.set(clientId, this.latestHash);
                        return [4 /*yield*/, this.sync()];
                    case 5:
                        _a.sent();
                        // Return the latest `AppVersion`.
                        return [2 /*return*/, this.lookupVersionByHash(this.latestHash, 'assignVersion')];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        // No client ID was associated with the request. This must be a navigation request
                        // for a new client. First check that the SW is accepting new clients.
                        if (this.state !== DriverReadyState.NORMAL) {
                            return [2 /*return*/, null];
                        }
                        // Serve it with the latest version, and assume that the client will actually get
                        // associated with that version on the next request.
                        // First validate the current state.
                        if (this.latestHash === null) {
                            throw new Error("Invariant violated (assignVersion): latestHash was null");
                        }
                        // Return the latest `AppVersion`.
                        return [2 /*return*/, this.lookupVersionByHash(this.latestHash, 'assignVersion')];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Driver.prototype.fetchLatestManifest = function (ignoreOfflineError) {
        if (ignoreOfflineError === void 0) { ignoreOfflineError = false; }
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.safeFetch(this.adapter.newRequest('ngsw.json?ngsw-cache-bust=' + Math.random()))];
                    case 1:
                        res = _a.sent();
                        if (!!res.ok) return [3 /*break*/, 6];
                        if (!(res.status === 404)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.deleteAllCaches()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.scope.registration.unregister()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        if (res.status === 504 && ignoreOfflineError) {
                            return [2 /*return*/, null];
                        }
                        _a.label = 5;
                    case 5: throw new Error("Manifest fetch failed! (status: " + res.status + ")");
                    case 6:
                        this.lastUpdateCheck = this.adapter.time;
                        return [2 /*return*/, res.json()];
                }
            });
        });
    };
    Driver.prototype.deleteAllCaches = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.scope.caches.keys()];
                    case 1: return [4 /*yield*/, (_a.sent())
                            .filter(function (key) { return key.startsWith('ngsw:'); })
                            .reduce(function (previous, key) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Promise.all([
                                            previous,
                                            this.scope.caches.delete(key),
                                        ])];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }, Promise.resolve())];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Schedule the SW's attempt to reach a fully prefetched state for the given AppVersion
     * when the SW is not busy and has connectivity. This returns a Promise which must be
     * awaited, as under some conditions the AppVersion might be initialized immediately.
     */
    Driver.prototype.scheduleInitialization = function (appVersion, latest) {
        return __awaiter(this, void 0, void 0, function () {
            var initialize;
            var _this = this;
            return __generator(this, function (_a) {
                initialize = function () { return __awaiter(_this, void 0, void 0, function () {
                    var err_4;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 4]);
                                return [4 /*yield*/, appVersion.initializeFully()];
                            case 1:
                                _a.sent();
                                return [3 /*break*/, 4];
                            case 2:
                                err_4 = _a.sent();
                                this.debugger.log(err_4, "initializeFully for " + appVersion.manifestHash);
                                return [4 /*yield*/, this.versionFailed(appVersion, err_4, latest)];
                            case 3:
                                _a.sent();
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); };
                // TODO: better logic for detecting localhost.
                if (this.scope.registration.scope.indexOf('://localhost') > -1) {
                    return [2 /*return*/, initialize()];
                }
                this.idle.schedule("initialization(" + appVersion.manifestHash + ")", initialize);
                return [2 /*return*/];
            });
        });
    };
    Driver.prototype.versionFailed = function (appVersion, err, latest) {
        return __awaiter(this, void 0, void 0, function () {
            var broken, brokenHash, affectedClients, err2_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        broken = Array.from(this.versions.entries()).find(function (_a) {
                            var hash = _a[0], version = _a[1];
                            return version === appVersion;
                        });
                        if (broken === undefined) {
                            // This version is no longer in use anyway, so nobody cares.
                            return [2 /*return*/];
                        }
                        brokenHash = broken[0];
                        // TODO: notify affected apps.
                        // The action taken depends on whether the broken manifest is the active (latest) or not.
                        // If so, the SW cannot accept new clients, but can continue to service old ones.
                        if (this.latestHash === brokenHash || latest) {
                            // The latest manifest is broken. This means that new clients are at the mercy of the
                            // network, but caches continue to be valid for previous versions. This is
                            // unfortunate but unavoidable.
                            this.state = DriverReadyState.EXISTING_CLIENTS_ONLY;
                            this.stateMessage = "Degraded due to: " + error_1.errorToString(err);
                            // Cancel the binding for these clients.
                            Array.from(this.clientVersionMap.keys())
                                .forEach(function (clientId) { return _this.clientVersionMap.delete(clientId); });
                        }
                        else {
                            affectedClients = Array.from(this.clientVersionMap.keys())
                                .filter(function (clientId) { return _this.clientVersionMap.get(clientId) === brokenHash; });
                            // Push the affected clients onto the latest version.
                            affectedClients.forEach(function (clientId) { return _this.clientVersionMap.set(clientId, _this.latestHash); });
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.sync()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err2_1 = _a.sent();
                        // We are already in a bad state. No need to make things worse.
                        // Just log the error and move on.
                        this.debugger.log(err2_1, "Driver.versionFailed(" + (err.message || err) + ")");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Driver.prototype.setupUpdate = function (manifest, hash) {
        return __awaiter(this, void 0, void 0, function () {
            var newVersion;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newVersion = new app_version_1.AppVersion(this.scope, this.adapter, this.db, this.idle, manifest, hash);
                        if (!(manifest.configVersion !== SUPPORTED_CONFIG_VERSION)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.deleteAllCaches()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.scope.registration.unregister()];
                    case 2:
                        _a.sent();
                        throw new Error("Invalid config version: expected " + SUPPORTED_CONFIG_VERSION + ", got " + manifest.configVersion + ".");
                    case 3: 
                    // Cause the new version to become fully initialized. If this fails, then the
                    // version will not be available for use.
                    return [4 /*yield*/, newVersion.initializeFully(this)];
                    case 4:
                        // Cause the new version to become fully initialized. If this fails, then the
                        // version will not be available for use.
                        _a.sent();
                        // Install this as an active version of the app.
                        this.versions.set(hash, newVersion);
                        // Future new clients will use this hash as the latest version.
                        this.latestHash = hash;
                        return [4 /*yield*/, this.sync()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.notifyClientsAboutUpdate()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Driver.prototype.checkForUpdate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var hash, manifest, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hash = '(unknown)';
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.fetchLatestManifest(true)];
                    case 2:
                        manifest = _a.sent();
                        if (manifest === null) {
                            // Client or server offline. Unable to check for updates at this time.
                            // Continue to service clients (existing and new).
                            this.debugger.log('Check for update aborted. (Client or server offline.)');
                            return [2 /*return*/, false];
                        }
                        hash = manifest_1.hashManifest(manifest);
                        // Check whether this is really an update.
                        if (this.versions.has(hash)) {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, this.setupUpdate(manifest, hash)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 4:
                        err_5 = _a.sent();
                        this.debugger.log(err_5, "Error occurred while updating to manifest " + hash);
                        this.state = DriverReadyState.EXISTING_CLIENTS_ONLY;
                        this.stateMessage = "Degraded due to failed initialization: " + error_1.errorToString(err_5);
                        return [2 /*return*/, false];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Synchronize the existing state to the underlying database.
     */
    Driver.prototype.sync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var table, manifests, assignments, latest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.open('control')];
                    case 1:
                        table = _a.sent();
                        manifests = {};
                        this.versions.forEach(function (version, hash) { manifests[hash] = version.manifest; });
                        assignments = {};
                        this.clientVersionMap.forEach(function (hash, clientId) { assignments[clientId] = hash; });
                        latest = {
                            latest: this.latestHash,
                        };
                        // Synchronize all of these.
                        return [4 /*yield*/, Promise.all([
                                table.write('manifests', manifests),
                                table.write('assignments', assignments),
                                table.write('latest', latest),
                            ])];
                    case 2:
                        // Synchronize all of these.
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Driver.prototype.cleanupCaches = function () {
        return __awaiter(this, void 0, void 0, function () {
            var activeClients, knownClients, usedVersions, obsoleteVersions;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.scope.clients.matchAll()];
                    case 1:
                        activeClients = (_a.sent()).map(function (client) { return client.id; });
                        knownClients = Array.from(this.clientVersionMap.keys());
                        // Remove clients in the clientVersionMap that are no longer active.
                        knownClients.filter(function (id) { return activeClients.indexOf(id) === -1; })
                            .forEach(function (id) { return _this.clientVersionMap.delete(id); });
                        usedVersions = new Set();
                        this.clientVersionMap.forEach(function (version, _) { return usedVersions.add(version); });
                        obsoleteVersions = Array.from(this.versions.keys())
                            .filter(function (version) { return !usedVersions.has(version) && version !== _this.latestHash; });
                        // Remove all the versions which are no longer used.
                        return [4 /*yield*/, obsoleteVersions.reduce(function (previous, version) { return __awaiter(_this, void 0, void 0, function () {
                                var instance, err_6;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: 
                                        // Wait for the other cleanup operations to complete.
                                        return [4 /*yield*/, previous];
                                        case 1:
                                            // Wait for the other cleanup operations to complete.
                                            _a.sent();
                                            _a.label = 2;
                                        case 2:
                                            _a.trys.push([2, 4, , 5]);
                                            instance = this.versions.get(version);
                                            // Delete it from the canonical map.
                                            this.versions.delete(version);
                                            // Clean it up.
                                            return [4 /*yield*/, instance.cleanup()];
                                        case 3:
                                            // Clean it up.
                                            _a.sent();
                                            return [3 /*break*/, 5];
                                        case 4:
                                            err_6 = _a.sent();
                                            // Oh well? Not much that can be done here. These caches will be removed when
                                            // the SW revs its format version, which happens from time to time.
                                            this.debugger.log(err_6, "cleanupCaches - cleanup " + version);
                                            return [3 /*break*/, 5];
                                        case 5: return [2 /*return*/];
                                    }
                                });
                            }); }, Promise.resolve())];
                    case 2:
                        // Remove all the versions which are no longer used.
                        _a.sent();
                        // Commit all the changes to the saved state.
                        return [4 /*yield*/, this.sync()];
                    case 3:
                        // Commit all the changes to the saved state.
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Determine if a specific version of the given resource is cached anywhere within the SW,
     * and fetch it if so.
     */
    Driver.prototype.lookupResourceWithHash = function (url, hash) {
        var _this = this;
        return Array
            // Scan through the set of all cached versions, valid or otherwise. It's safe to do such
            // lookups even for invalid versions as the cached version of a resource will have the
            // same hash regardless.
            .from(this.versions.values())
            // Reduce the set of versions to a single potential result. At any point along the
            // reduction, if a response has already been identified, then pass it through, as no
            // future operation could change the response. If no response has been found yet, keep
            // checking versions until one is or until all versions have been exhausted.
            .reduce(function (prev, version) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prev];
                    case 1:
                        // First, check the previous result. If a non-null result has been found already, just
                        // return it.
                        if ((_a.sent()) !== null) {
                            return [2 /*return*/, prev];
                        }
                        // No result has been found yet. Try the next `AppVersion`.
                        return [2 /*return*/, version.lookupResourceWithHash(url, hash)];
                }
            });
        }); }, Promise.resolve(null));
    };
    Driver.prototype.lookupResourceWithoutHash = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var version;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initialized];
                    case 1:
                        _a.sent();
                        version = this.versions.get(this.latestHash);
                        return [2 /*return*/, version.lookupResourceWithoutHash(url)];
                }
            });
        });
    };
    Driver.prototype.previouslyCachedResources = function () {
        return __awaiter(this, void 0, void 0, function () {
            var version;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initialized];
                    case 1:
                        _a.sent();
                        version = this.versions.get(this.latestHash);
                        return [2 /*return*/, version.previouslyCachedResources()];
                }
            });
        });
    };
    Driver.prototype.recentCacheStatus = function (url) {
        var version = this.versions.get(this.latestHash);
        return version.recentCacheStatus(url);
    };
    Driver.prototype.mergeHashWithAppData = function (manifest, hash) {
        return {
            hash: hash,
            appData: manifest.appData,
        };
    };
    Driver.prototype.notifyClientsAboutUpdate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var clients, next;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initialized];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.scope.clients.matchAll()];
                    case 2:
                        clients = _a.sent();
                        next = this.versions.get(this.latestHash);
                        return [4 /*yield*/, clients.reduce(function (previous, client) { return __awaiter(_this, void 0, void 0, function () {
                                var version, current, notice;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, previous];
                                        case 1:
                                            _a.sent();
                                            version = this.clientVersionMap.get(client.id);
                                            if (version === undefined) {
                                                // Unmapped client - assume it's the latest.
                                                return [2 /*return*/];
                                            }
                                            if (version === this.latestHash) {
                                                // Client is already on the latest version, no need for a notification.
                                                return [2 /*return*/];
                                            }
                                            current = this.versions.get(version);
                                            notice = {
                                                type: 'UPDATE_AVAILABLE',
                                                current: this.mergeHashWithAppData(current.manifest, version),
                                                available: this.mergeHashWithAppData(next.manifest, this.latestHash),
                                            };
                                            client.postMessage(notice);
                                            return [2 /*return*/];
                                    }
                                });
                            }); }, Promise.resolve())];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Driver.prototype.broadcast = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            var clients;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.scope.clients.matchAll()];
                    case 1:
                        clients = _a.sent();
                        clients.forEach(function (client) { client.postMessage(msg); });
                        return [2 /*return*/];
                }
            });
        });
    };
    Driver.prototype.debugState = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {
                        state: DriverReadyState[this.state],
                        why: this.stateMessage,
                        latestHash: this.latestHash,
                        lastUpdateCheck: this.lastUpdateCheck,
                    }];
            });
        });
    };
    Driver.prototype.debugVersions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                // Build list of versions.
                return [2 /*return*/, Array.from(this.versions.keys()).map(function (hash) {
                        var version = _this.versions.get(hash);
                        var clients = Array.from(_this.clientVersionMap.entries())
                            .filter(function (_a) {
                            var clientId = _a[0], version = _a[1];
                            return version === hash;
                        })
                            .map(function (_a) {
                            var clientId = _a[0], version = _a[1];
                            return clientId;
                        });
                        return {
                            hash: hash,
                            manifest: version.manifest, clients: clients,
                            status: '',
                        };
                    })];
            });
        });
    };
    Driver.prototype.debugIdleState = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {
                        queue: this.idle.taskDescriptions,
                        lastTrigger: this.idle.lastTrigger,
                        lastRun: this.idle.lastRun,
                    }];
            });
        });
    };
    Driver.prototype.safeFetch = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.scope.fetch(req)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_7 = _a.sent();
                        this.debugger.log(err_7, "Driver.fetch(" + req.url + ")");
                        return [2 /*return*/, this.adapter.newResponse(null, {
                                status: 504,
                                statusText: 'Gateway Timeout',
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return Driver;
}());
exports.Driver = Driver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJpdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvd29ya2VyL3NyYy9kcml2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSUgsNkNBQXlDO0FBRXpDLGlDQUFxQztBQUNyQyxpQ0FBc0M7QUFDdEMsK0JBQXFDO0FBQ3JDLHVDQUFnRTtBQUNoRSw2QkFBd0U7QUFXeEUsSUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDO0FBRTVCLElBQU0sd0JBQXdCLEdBQUcsQ0FBQyxDQUFDO0FBRW5DLElBQU0seUJBQXlCLEdBQUc7SUFDaEMsU0FBUyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVO0lBQzlFLG9CQUFvQixFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxTQUFTO0NBQ3ZFLENBQUM7QUFNRixJQUFZLGdCQVlYO0FBWkQsV0FBWSxnQkFBZ0I7SUFDMUIsbUVBQW1FO0lBQ25FLDJEQUFNLENBQUE7SUFFTix3RkFBd0Y7SUFDeEYsdUZBQXVGO0lBQ3ZGLDRCQUE0QjtJQUM1Qix5RkFBcUIsQ0FBQTtJQUVyQixvRkFBb0Y7SUFDcEYsbUNBQW1DO0lBQ25DLGlFQUFTLENBQUE7QUFDWCxDQUFDLEVBWlcsZ0JBQWdCLEdBQWhCLHdCQUFnQixLQUFoQix3QkFBZ0IsUUFZM0I7QUFFRDtJQXVERSxnQkFDWSxLQUErQixFQUFVLE9BQWdCLEVBQVUsRUFBWTtRQUN6RixtREFBbUQ7UUFGckQsaUJBOENDO1FBN0NXLFVBQUssR0FBTCxLQUFLLENBQTBCO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUFVLE9BQUUsR0FBRixFQUFFLENBQVU7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