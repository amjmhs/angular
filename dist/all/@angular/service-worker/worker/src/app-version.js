"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
var api_1 = require("./api");
var assets_1 = require("./assets");
var data_1 = require("./data");
/**
 * A specific version of the application, identified by a unique manifest
 * as determined by its hash.
 *
 * Each `AppVersion` can be thought of as a published version of the app
 * that can be installed as an update to any previously installed versions.
 */
var AppVersion = /** @class */ (function () {
    function AppVersion(scope, adapter, database, idle, manifest, manifestHash) {
        var _this = this;
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
        Object.keys(this.manifest.hashTable).forEach(function (url) {
            _this.hashTable.set(url, _this.manifest.hashTable[url]);
        });
        // Process each `AssetGroup` declared in the manifest. Each declared group gets an `AssetGroup`
        // instance
        // created for it, of a type that depends on the configuration mode.
        this.assetGroups = (manifest.assetGroups || []).map(function (config) {
            // Every asset group has a cache that's prefixed by the manifest hash and the name of the
            // group.
            var prefix = "ngsw:" + _this.manifestHash + ":assets";
            // Check the caching mode, which determines when resources will be fetched/updated.
            switch (config.installMode) {
                case 'prefetch':
                    return new assets_1.PrefetchAssetGroup(_this.scope, _this.adapter, _this.idle, config, _this.hashTable, _this.database, prefix);
                case 'lazy':
                    return new assets_1.LazyAssetGroup(_this.scope, _this.adapter, _this.idle, config, _this.hashTable, _this.database, prefix);
            }
        });
        // Process each `DataGroup` declared in the manifest.
        this.dataGroups = (manifest.dataGroups || [])
            .map(function (config) { return new data_1.DataGroup(_this.scope, _this.adapter, config, _this.database, "ngsw:" + config.version + ":data"); });
        // Create `include`/`exclude` RegExps for the `navigationUrls` declared in the manifest.
        var includeUrls = manifest.navigationUrls.filter(function (spec) { return spec.positive; });
        var excludeUrls = manifest.navigationUrls.filter(function (spec) { return !spec.positive; });
        this.navigationUrls = {
            include: includeUrls.map(function (spec) { return new RegExp(spec.regex); }),
            exclude: excludeUrls.map(function (spec) { return new RegExp(spec.regex); }),
        };
    }
    Object.defineProperty(AppVersion.prototype, "okay", {
        get: function () { return this._okay; },
        enumerable: true,
        configurable: true
    });
    /**
     * Fully initialize this version of the application. If this Promise resolves successfully, all
     * required
     * data has been safely downloaded.
     */
    AppVersion.prototype.initializeFully = function (updateFrom) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        // Fully initialize each asset group, in series. Starts with an empty Promise,
                        // and waits for the previous groups to have been initialized before initializing
                        // the next one in turn.
                        return [4 /*yield*/, this.assetGroups.reduce(function (previous, group) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: 
                                        // Wait for the previous groups to complete initialization. If there is a
                                        // failure, this will throw, and each subsequent group will throw, until the
                                        // whole sequence fails.
                                        return [4 /*yield*/, previous];
                                        case 1:
                                            // Wait for the previous groups to complete initialization. If there is a
                                            // failure, this will throw, and each subsequent group will throw, until the
                                            // whole sequence fails.
                                            _a.sent();
                                            // Initialize this group.
                                            return [2 /*return*/, group.initializeFully(updateFrom)];
                                    }
                                });
                            }); }, Promise.resolve())];
                    case 1:
                        // Fully initialize each asset group, in series. Starts with an empty Promise,
                        // and waits for the previous groups to have been initialized before initializing
                        // the next one in turn.
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        this._okay = false;
                        throw err_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AppVersion.prototype.handleFetch = function (req, context) {
        return __awaiter(this, void 0, void 0, function () {
            var asset, data;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.assetGroups.reduce(function (potentialResponse, group) { return __awaiter(_this, void 0, void 0, function () {
                            var resp;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, potentialResponse];
                                    case 1:
                                        resp = _a.sent();
                                        if (resp !== null) {
                                            return [2 /*return*/, resp];
                                        }
                                        // No response has been found yet. Maybe this group will have one.
                                        return [2 /*return*/, group.handleFetch(req, context)];
                                }
                            });
                        }); }, Promise.resolve(null))];
                    case 1:
                        asset = _a.sent();
                        // The result of the above is the asset response, if there is any, or null otherwise. Return the
                        // asset
                        // response if there was one. If not, check with the data caching groups.
                        if (asset !== null) {
                            return [2 /*return*/, asset];
                        }
                        return [4 /*yield*/, this.dataGroups.reduce(function (potentialResponse, group) { return __awaiter(_this, void 0, void 0, function () {
                                var resp;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, potentialResponse];
                                        case 1:
                                            resp = _a.sent();
                                            if (resp !== null) {
                                                return [2 /*return*/, resp];
                                            }
                                            return [2 /*return*/, group.handleFetch(req, context)];
                                    }
                                });
                            }); }, Promise.resolve(null))];
                    case 2:
                        data = _a.sent();
                        // If the data caching group returned a response, go with it.
                        if (data !== null) {
                            return [2 /*return*/, data];
                        }
                        // Next, check if this is a navigation request for a route. Detect circular
                        // navigations by checking if the request URL is the same as the index URL.
                        if (req.url !== this.manifest.index && this.isNavigationRequest(req)) {
                            // This was a navigation request. Re-enter `handleFetch` with a request for
                            // the URL.
                            return [2 /*return*/, this.handleFetch(this.adapter.newRequest(this.manifest.index), context)];
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    };
    /**
     * Determine whether the request is a navigation request.
     * Takes into account: Request mode, `Accept` header, `navigationUrls` patterns.
     */
    AppVersion.prototype.isNavigationRequest = function (req) {
        if (req.mode !== 'navigate') {
            return false;
        }
        if (!this.acceptsTextHtml(req)) {
            return false;
        }
        var urlPrefix = this.scope.registration.scope.replace(/\/$/, '');
        var url = req.url.startsWith(urlPrefix) ? req.url.substr(urlPrefix.length) : req.url;
        var urlWithoutQueryOrHash = url.replace(/[?#].*$/, '');
        return this.navigationUrls.include.some(function (regex) { return regex.test(urlWithoutQueryOrHash); }) &&
            !this.navigationUrls.exclude.some(function (regex) { return regex.test(urlWithoutQueryOrHash); });
    };
    /**
     * Check this version for a given resource with a particular hash.
     */
    AppVersion.prototype.lookupResourceWithHash = function (url, hash) {
        return __awaiter(this, void 0, void 0, function () {
            var cacheState;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Verify that this version has the requested resource cached. If not,
                        // there's no point in trying.
                        if (!this.hashTable.has(url)) {
                            return [2 /*return*/, null];
                        }
                        // Next, check whether the resource has the correct hash. If not, any cached
                        // response isn't usable.
                        if (this.hashTable.get(url) !== hash) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, this.lookupResourceWithoutHash(url)];
                    case 1:
                        cacheState = _a.sent();
                        return [2 /*return*/, cacheState && cacheState.response];
                }
            });
        });
    };
    /**
     * Check this version for a given resource regardless of its hash.
     */
    AppVersion.prototype.lookupResourceWithoutHash = function (url) {
        var _this = this;
        // Limit the search to asset groups, and only scan the cache, don't
        // load resources from the network.
        return this.assetGroups.reduce(function (potentialResponse, group) { return __awaiter(_this, void 0, void 0, function () {
            var resp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, potentialResponse];
                    case 1:
                        resp = _a.sent();
                        if (resp !== null) {
                            return [2 /*return*/, resp];
                        }
                        // fetchFromCacheOnly() avoids any network fetches, and returns the
                        // full set of cache data, not just the Response.
                        return [2 /*return*/, group.fetchFromCacheOnly(url)];
                }
            });
        }); }, Promise.resolve(null));
    };
    /**
     * List all unhashed resources from all asset groups.
     */
    AppVersion.prototype.previouslyCachedResources = function () {
        var _this = this;
        return this.assetGroups.reduce(function (resources, group) { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, resources];
                    case 1:
                        _b = (_a = (_c.sent())).concat;
                        return [4 /*yield*/, group.unhashedResources()];
                    case 2: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        }); }, Promise.resolve([]));
    };
    AppVersion.prototype.recentCacheStatus = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.assetGroups.reduce(function (current, group) { return __awaiter(_this, void 0, void 0, function () {
                        var status, groupStatus;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, current];
                                case 1:
                                    status = _a.sent();
                                    if (status === api_1.UpdateCacheStatus.CACHED) {
                                        return [2 /*return*/, status];
                                    }
                                    return [4 /*yield*/, group.cacheStatus(url)];
                                case 2:
                                    groupStatus = _a.sent();
                                    if (groupStatus === api_1.UpdateCacheStatus.NOT_CACHED) {
                                        return [2 /*return*/, status];
                                    }
                                    return [2 /*return*/, groupStatus];
                            }
                        });
                    }); }, Promise.resolve(api_1.UpdateCacheStatus.NOT_CACHED))];
            });
        });
    };
    /**
     * Erase this application version, by cleaning up all the caches.
     */
    AppVersion.prototype.cleanup = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(this.assetGroups.map(function (group) { return group.cleanup(); }))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, Promise.all(this.dataGroups.map(function (group) { return group.cleanup(); }))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(AppVersion.prototype, "appData", {
        /**
         * Get the opaque application data which was provided with the manifest.
         */
        get: function () { return this.manifest.appData || null; },
        enumerable: true,
        configurable: true
    });
    /**
     * Check whether a request accepts `text/html` (based on the `Accept` header).
     */
    AppVersion.prototype.acceptsTextHtml = function (req) {
        var accept = req.headers.get('Accept');
        if (accept === null) {
            return false;
        }
        var values = accept.split(',');
        return values.some(function (value) { return value.trim().toLowerCase() === 'text/html'; });
    };
    return AppVersion;
}());
exports.AppVersion = AppVersion;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXZlcnNpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9zZXJ2aWNlLXdvcmtlci93b3JrZXIvc3JjL2FwcC12ZXJzaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHSCw2QkFBa0U7QUFDbEUsbUNBQXdFO0FBQ3hFLCtCQUFpQztBQU1qQzs7Ozs7O0dBTUc7QUFDSDtJQThCRSxvQkFDWSxLQUErQixFQUFVLE9BQWdCLEVBQVUsUUFBa0IsRUFDckYsSUFBbUIsRUFBVyxRQUFrQixFQUFXLFlBQW9CO1FBRjNGLGlCQXdDQztRQXZDVyxVQUFLLEdBQUwsS0FBSyxDQUEwQjtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ3JGLFNBQUksR0FBSixJQUFJLENBQWU7UUFBVyxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQVcsaUJBQVksR0FBWixZQUFZLENBQVE7UUEvQjNGOzs7V0FHRztRQUNLLGNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBa0IsQ0FBQztRQWtCOUM7O1dBRUc7UUFDSyxVQUFLLEdBQUcsSUFBSSxDQUFDO1FBT25CLDJGQUEyRjtRQUMzRixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsR0FBRztZQUM5QyxLQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN4RCxDQUFDLENBQUMsQ0FBQztRQUVILCtGQUErRjtRQUMvRixXQUFXO1FBQ1gsb0VBQW9FO1FBQ3BFLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxRQUFRLENBQUMsV0FBVyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLE1BQU07WUFDeEQseUZBQXlGO1lBQ3pGLFNBQVM7WUFDVCxJQUFNLE1BQU0sR0FBRyxVQUFRLEtBQUksQ0FBQyxZQUFZLFlBQVMsQ0FBQztZQUNsRCxtRkFBbUY7WUFDbkYsUUFBUSxNQUFNLENBQUMsV0FBVyxFQUFFO2dCQUMxQixLQUFLLFVBQVU7b0JBQ2IsT0FBTyxJQUFJLDJCQUFrQixDQUN6QixLQUFJLENBQUMsS0FBSyxFQUFFLEtBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSSxDQUFDLFNBQVMsRUFBRSxLQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUMxRixLQUFLLE1BQU07b0JBQ1QsT0FBTyxJQUFJLHVCQUFjLENBQ3JCLEtBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSSxDQUFDLE9BQU8sRUFBRSxLQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFJLENBQUMsU0FBUyxFQUFFLEtBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7YUFDM0Y7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILHFEQUFxRDtRQUNyRCxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsUUFBUSxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUM7YUFDdEIsR0FBRyxDQUNBLFVBQUEsTUFBTSxJQUFJLE9BQUEsSUFBSSxnQkFBUyxDQUNuQixLQUFJLENBQUMsS0FBSyxFQUFFLEtBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEtBQUksQ0FBQyxRQUFRLEVBQy9DLFVBQVEsTUFBTSxDQUFDLE9BQU8sVUFBTyxDQUFDLEVBRnhCLENBRXdCLENBQUMsQ0FBQztRQUU5RCx3RkFBd0Y7UUFDeEYsSUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLENBQUMsUUFBUSxFQUFiLENBQWEsQ0FBQyxDQUFDO1FBQzFFLElBQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFkLENBQWMsQ0FBQyxDQUFDO1FBQzNFLElBQUksQ0FBQyxjQUFjLEdBQUc7WUFDcEIsT0FBTyxFQUFFLFdBQVcsQ0FBQyxHQUFHLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQXRCLENBQXNCLENBQUM7WUFDeEQsT0FBTyxFQUFFLFdBQVcsQ0FBQyxHQUFHLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQXRCLENBQXNCLENBQUM7U0FDekQsQ0FBQztJQUNKLENBQUM7SUExQ0Qsc0JBQUksNEJBQUk7YUFBUixjQUFzQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQTRDMUM7Ozs7T0FJRztJQUNHLG9DQUFlLEdBQXJCLFVBQXNCLFVBQXlCOzs7Ozs7Ozt3QkFFM0MsOEVBQThFO3dCQUM5RSxpRkFBaUY7d0JBQ2pGLHdCQUF3Qjt3QkFDeEIscUJBQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQWdCLFVBQU0sUUFBUSxFQUFFLEtBQUs7Ozs7d0NBQ2hFLHlFQUF5RTt3Q0FDekUsNEVBQTRFO3dDQUM1RSx3QkFBd0I7d0NBQ3hCLHFCQUFNLFFBQVEsRUFBQTs7NENBSGQseUVBQXlFOzRDQUN6RSw0RUFBNEU7NENBQzVFLHdCQUF3Qjs0Q0FDeEIsU0FBYyxDQUFDOzRDQUVmLHlCQUF5Qjs0Q0FDekIsc0JBQU8sS0FBSyxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsRUFBQzs7O2lDQUMxQyxFQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFBOzt3QkFYckIsOEVBQThFO3dCQUM5RSxpRkFBaUY7d0JBQ2pGLHdCQUF3Qjt3QkFDeEIsU0FRcUIsQ0FBQzs7Ozt3QkFFdEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7d0JBQ25CLE1BQU0sS0FBRyxDQUFDOzs7OztLQUViO0lBRUssZ0NBQVcsR0FBakIsVUFBa0IsR0FBWSxFQUFFLE9BQWdCOzs7Ozs7NEJBUWhDLHFCQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFVBQU0saUJBQWlCLEVBQUUsS0FBSzs7Ozs0Q0FHM0QscUJBQU0saUJBQWlCLEVBQUE7O3dDQUE5QixJQUFJLEdBQUcsU0FBdUI7d0NBQ3BDLElBQUksSUFBSSxLQUFLLElBQUksRUFBRTs0Q0FDakIsc0JBQU8sSUFBSSxFQUFDO3lDQUNiO3dDQUVELGtFQUFrRTt3Q0FDbEUsc0JBQU8sS0FBSyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLEVBQUM7Ozs2QkFDeEMsRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFnQixJQUFJLENBQUMsQ0FBQyxFQUFBOzt3QkFWbEMsS0FBSyxHQUFHLFNBVTBCO3dCQUV4QyxnR0FBZ0c7d0JBQ2hHLFFBQVE7d0JBQ1IseUVBQXlFO3dCQUN6RSxJQUFJLEtBQUssS0FBSyxJQUFJLEVBQUU7NEJBQ2xCLHNCQUFPLEtBQUssRUFBQzt5QkFDZDt3QkFJWSxxQkFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFNLGlCQUFpQixFQUFFLEtBQUs7Ozs7Z0RBQ3pELHFCQUFNLGlCQUFpQixFQUFBOzs0Q0FBOUIsSUFBSSxHQUFHLFNBQXVCOzRDQUNwQyxJQUFJLElBQUksS0FBSyxJQUFJLEVBQUU7Z0RBQ2pCLHNCQUFPLElBQUksRUFBQzs2Q0FDYjs0Q0FFRCxzQkFBTyxLQUFLLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsRUFBQzs7O2lDQUN4QyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQWdCLElBQUksQ0FBQyxDQUFDLEVBQUE7O3dCQVBsQyxJQUFJLEdBQUcsU0FPMkI7d0JBRXhDLDZEQUE2RDt3QkFDN0QsSUFBSSxJQUFJLEtBQUssSUFBSSxFQUFFOzRCQUNqQixzQkFBTyxJQUFJLEVBQUM7eUJBQ2I7d0JBRUQsMkVBQTJFO3dCQUMzRSwyRUFBMkU7d0JBQzNFLElBQUksR0FBRyxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsbUJBQW1CLENBQUMsR0FBRyxDQUFDLEVBQUU7NEJBQ3BFLDJFQUEyRTs0QkFDM0UsV0FBVzs0QkFDWCxzQkFBTyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsT0FBTyxDQUFDLEVBQUM7eUJBQ2hGO3dCQUVELHNCQUFPLElBQUksRUFBQzs7OztLQUNiO0lBRUQ7OztPQUdHO0lBQ0gsd0NBQW1CLEdBQW5CLFVBQW9CLEdBQVk7UUFDOUIsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLFVBQVUsRUFBRTtZQUMzQixPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDOUIsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ25FLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7UUFDdkYsSUFBTSxxQkFBcUIsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUV6RCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsRUFBakMsQ0FBaUMsQ0FBQztZQUMvRSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsRUFBakMsQ0FBaUMsQ0FBQyxDQUFDO0lBQ3BGLENBQUM7SUFFRDs7T0FFRztJQUNHLDJDQUFzQixHQUE1QixVQUE2QixHQUFXLEVBQUUsSUFBWTs7Ozs7O3dCQUNwRCxzRUFBc0U7d0JBQ3RFLDhCQUE4Qjt3QkFDOUIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFOzRCQUM1QixzQkFBTyxJQUFJLEVBQUM7eUJBQ2I7d0JBRUQsNEVBQTRFO3dCQUM1RSx5QkFBeUI7d0JBQ3pCLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxFQUFFOzRCQUNwQyxzQkFBTyxJQUFJLEVBQUM7eUJBQ2I7d0JBRWtCLHFCQUFNLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxHQUFHLENBQUMsRUFBQTs7d0JBQXRELFVBQVUsR0FBRyxTQUF5Qzt3QkFDNUQsc0JBQU8sVUFBVSxJQUFJLFVBQVUsQ0FBQyxRQUFRLEVBQUM7Ozs7S0FDMUM7SUFFRDs7T0FFRztJQUNILDhDQUF5QixHQUF6QixVQUEwQixHQUFXO1FBQXJDLGlCQWFDO1FBWkMsbUVBQW1FO1FBQ25FLG1DQUFtQztRQUNuQyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFVBQU0saUJBQWlCLEVBQUUsS0FBSzs7Ozs0QkFDOUMscUJBQU0saUJBQWlCLEVBQUE7O3dCQUE5QixJQUFJLEdBQUcsU0FBdUI7d0JBQ3BDLElBQUksSUFBSSxLQUFLLElBQUksRUFBRTs0QkFDakIsc0JBQU8sSUFBSSxFQUFDO3lCQUNiO3dCQUVELG1FQUFtRTt3QkFDbkUsaURBQWlEO3dCQUNqRCxzQkFBTyxLQUFLLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLEVBQUM7OzthQUN0QyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQWtCLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVEOztPQUVHO0lBQ0gsOENBQXlCLEdBQXpCO1FBQUEsaUJBSUM7UUFIQyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFVBQU0sU0FBUyxFQUFFLEtBQUs7Ozs7NEJBQzNDLHFCQUFNLFNBQVMsRUFBQTs7d0JBQWhCLEtBQUEsQ0FBQSxLQUFBLENBQUMsU0FBZSxDQUFDLENBQUEsQ0FBQyxNQUFNLENBQUE7d0JBQUMscUJBQU0sS0FBSyxDQUFDLGlCQUFpQixFQUFFLEVBQUE7NEJBQS9ELHNCQUFPLGNBQXlCLFNBQStCLEVBQUMsRUFBQzs7O2FBQ2xFLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFSyxzQ0FBaUIsR0FBdkIsVUFBd0IsR0FBVzs7OztnQkFDakMsc0JBQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsVUFBTSxPQUFPLEVBQUUsS0FBSzs7Ozt3Q0FDbEMscUJBQU0sT0FBTyxFQUFBOztvQ0FBdEIsTUFBTSxHQUFHLFNBQWE7b0NBQzVCLElBQUksTUFBTSxLQUFLLHVCQUFpQixDQUFDLE1BQU0sRUFBRTt3Q0FDdkMsc0JBQU8sTUFBTSxFQUFDO3FDQUNmO29DQUNtQixxQkFBTSxLQUFLLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxFQUFBOztvQ0FBMUMsV0FBVyxHQUFHLFNBQTRCO29DQUNoRCxJQUFJLFdBQVcsS0FBSyx1QkFBaUIsQ0FBQyxVQUFVLEVBQUU7d0NBQ2hELHNCQUFPLE1BQU0sRUFBQztxQ0FDZjtvQ0FDRCxzQkFBTyxXQUFXLEVBQUM7Ozt5QkFDcEIsRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLHVCQUFpQixDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUM7OztLQUNuRDtJQUVEOztPQUVHO0lBQ0csNEJBQU8sR0FBYjs7Ozs0QkFDRSxxQkFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSyxDQUFDLE9BQU8sRUFBRSxFQUFmLENBQWUsQ0FBQyxDQUFDLEVBQUE7O3dCQUFqRSxTQUFpRSxDQUFDO3dCQUNsRSxxQkFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSyxDQUFDLE9BQU8sRUFBRSxFQUFmLENBQWUsQ0FBQyxDQUFDLEVBQUE7O3dCQUFoRSxTQUFnRSxDQUFDOzs7OztLQUNsRTtJQUtELHNCQUFJLCtCQUFPO1FBSFg7O1dBRUc7YUFDSCxjQUE2QixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBRXBFOztPQUVHO0lBQ0ssb0NBQWUsR0FBdkIsVUFBd0IsR0FBWTtRQUNsQyxJQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN6QyxJQUFJLE1BQU0sS0FBSyxJQUFJLEVBQUU7WUFDbkIsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELElBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakMsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxLQUFLLFdBQVcsRUFBMUMsQ0FBMEMsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFDSCxpQkFBQztBQUFELENBQUMsQUFqUUQsSUFpUUM7QUFqUVksZ0NBQVUifQ==