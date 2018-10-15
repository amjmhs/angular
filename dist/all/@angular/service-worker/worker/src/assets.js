"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var api_1 = require("./api");
var error_1 = require("./error");
var sha1_1 = require("./sha1");
/**
 * A group of assets that are cached in a `Cache` and managed by a given policy.
 *
 * Concrete classes derive from this base and specify the exact caching policy.
 */
var AssetGroup = /** @class */ (function () {
    function AssetGroup(scope, adapter, idle, config, hashes, db, prefix) {
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
        this.patterns = this.config.patterns.map(function (pattern) { return new RegExp(pattern); });
        // This is the primary cache, which holds all of the cached requests for this group. If a
        // resource
        // isn't in this cache, it hasn't been fetched yet.
        this.cache = this.scope.caches.open(this.prefix + ":" + this.config.name + ":cache");
        // This is the metadata table, which holds specific information for each cached URL, such as
        // the timestamp of when it was added to the cache.
        this.metadata = this.db.open(this.prefix + ":" + this.config.name + ":meta");
        // Determine the origin from the registration scope. This is used to differentiate between
        // relative and absolute URLs.
        this.origin =
            this.adapter.parseUrl(this.scope.registration.scope, this.scope.registration.scope).origin;
    }
    AssetGroup.prototype.cacheStatus = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var cache, meta, res, data_1, _1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cache];
                    case 1:
                        cache = _a.sent();
                        return [4 /*yield*/, this.metadata];
                    case 2:
                        meta = _a.sent();
                        return [4 /*yield*/, cache.match(this.adapter.newRequest(url))];
                    case 3:
                        res = _a.sent();
                        if (res === undefined) {
                            return [2 /*return*/, api_1.UpdateCacheStatus.NOT_CACHED];
                        }
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, meta.read(url)];
                    case 5:
                        data_1 = _a.sent();
                        if (!data_1.used) {
                            return [2 /*return*/, api_1.UpdateCacheStatus.CACHED_BUT_UNUSED];
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        _1 = _a.sent();
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/, api_1.UpdateCacheStatus.CACHED];
                }
            });
        });
    };
    /**
     * Clean up all the cached data for this group.
     */
    AssetGroup.prototype.cleanup = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.scope.caches.delete(this.prefix + ":" + this.config.name + ":cache")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.db.delete(this.prefix + ":" + this.config.name + ":meta")];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Process a request for a given resource and return it, or return null if it's not available.
     */
    AssetGroup.prototype.handleFetch = function (req, ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var url, cache, cachedResponse, res;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.getConfigUrl(req.url);
                        if (!(this.config.urls.indexOf(url) !== -1 || this.patterns.some(function (pattern) { return pattern.test(url); }))) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.cache];
                    case 1:
                        cache = _a.sent();
                        return [4 /*yield*/, cache.match(req)];
                    case 2:
                        cachedResponse = _a.sent();
                        if (!(cachedResponse !== undefined)) return [3 /*break*/, 5];
                        if (!this.hashes.has(url)) return [3 /*break*/, 3];
                        // This resource has a hash, and thus is versioned by the manifest. It's safe to return
                        // the response.
                        return [2 /*return*/, cachedResponse];
                    case 3: return [4 /*yield*/, this.needToRevalidate(req, cachedResponse)];
                    case 4:
                        // This resource has no hash, and yet exists in the cache. Check how old this request is
                        // to make sure it's still usable.
                        if (_a.sent()) {
                            this.idle.schedule("revalidate(" + this.prefix + ", " + this.config.name + "): " + req.url, function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.fetchAndCacheOnce(req)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            }); }); });
                        }
                        // In either case (revalidation or not), the cached response must be good.
                        return [2 /*return*/, cachedResponse];
                    case 5: return [4 /*yield*/, this.fetchAndCacheOnce(this.adapter.newRequest(req.url))];
                    case 6:
                        res = _a.sent();
                        // If this is successful, the response needs to be cloned as it might be used to respond to
                        // multiple fetch operations at the same time.
                        return [2 /*return*/, res.clone()];
                    case 7: return [2 /*return*/, null];
                }
            });
        });
    };
    AssetGroup.prototype.getConfigUrl = function (url) {
        // If the URL is relative to the SW's own origin, then only consider the path relative to
        // the domain root. Determine this by checking the URL's origin against the SW's.
        var parsed = this.adapter.parseUrl(url, this.scope.registration.scope);
        if (parsed.origin === this.origin) {
            // The URL is relative to the SW's origin domain.
            return parsed.path;
        }
        else {
            return url;
        }
    };
    /**
     * Some resources are cached without a hash, meaning that their expiration is controlled
     * by HTTP caching headers. Check whether the given request/response pair is still valid
     * per the caching headers.
     */
    AssetGroup.prototype.needToRevalidate = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var cacheControl, cacheDirectives, maxAgeDirective, cacheAge, maxAge, ts, metaTable, e_1, date, age, e_2, expiresStr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!res.headers.has('Cache-Control')) return [3 /*break*/, 9];
                        cacheControl = res.headers.get('Cache-Control');
                        cacheDirectives = cacheControl
                            // Directives are comma-separated within the Cache-Control header value.
                            .split(',')
                            // Make sure each directive doesn't have extraneous whitespace.
                            .map(function (v) { return v.trim(); })
                            // Some directives have values (like maxage and s-maxage)
                            .map(function (v) { return v.split('='); });
                        // Lowercase all the directive names.
                        cacheDirectives.forEach(function (v) { return v[0] = v[0].toLowerCase(); });
                        maxAgeDirective = cacheDirectives.find(function (v) { return v[0] === 'max-age'; });
                        cacheAge = maxAgeDirective ? maxAgeDirective[1] : undefined;
                        if (!cacheAge) {
                            // No usable TTL defined. Must assume that the response is stale.
                            return [2 /*return*/, true];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        maxAge = 1000 * parseInt(cacheAge);
                        ts = void 0;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, this.metadata];
                    case 3:
                        metaTable = _a.sent();
                        return [4 /*yield*/, metaTable.read(req.url)];
                    case 4:
                        ts = (_a.sent()).ts;
                        return [3 /*break*/, 6];
                    case 5:
                        e_1 = _a.sent();
                        date = res.headers.get('Date');
                        if (date === null) {
                            // Unable to determine when this response was created. Assume that it's stale, and
                            // revalidate it.
                            return [2 /*return*/, true];
                        }
                        ts = Date.parse(date);
                        return [3 /*break*/, 6];
                    case 6:
                        age = this.adapter.time - ts;
                        return [2 /*return*/, age < 0 || age > maxAge];
                    case 7:
                        e_2 = _a.sent();
                        // Assume stale.
                        return [2 /*return*/, true];
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        if (res.headers.has('Expires')) {
                            expiresStr = res.headers.get('Expires');
                            try {
                                // The request needs to be revalidated if the current time is later than the expiration
                                // time, if it parses correctly.
                                return [2 /*return*/, this.adapter.time > Date.parse(expiresStr)];
                            }
                            catch (e) {
                                // The expiration date failed to parse, so revalidate as a precaution.
                                return [2 /*return*/, true];
                            }
                        }
                        else {
                            // No way to evaluate staleness, so assume the response is already stale.
                            return [2 /*return*/, true];
                        }
                        _a.label = 10;
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Fetch the complete state of a cached resource, or return null if it's not found.
     */
    AssetGroup.prototype.fetchFromCacheOnly = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var cache, metaTable, response, metadata, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cache];
                    case 1:
                        cache = _a.sent();
                        return [4 /*yield*/, this.metadata];
                    case 2:
                        metaTable = _a.sent();
                        return [4 /*yield*/, cache.match(this.adapter.newRequest(url))];
                    case 3:
                        response = _a.sent();
                        if (response === undefined) {
                            // It's not found, return null.
                            return [2 /*return*/, null];
                        }
                        metadata = undefined;
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, metaTable.read(url)];
                    case 5:
                        metadata = _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        e_3 = _a.sent();
                        return [3 /*break*/, 7];
                    case 7: 
                    // Return both the response and any available metadata.
                    return [2 /*return*/, { response: response, metadata: metadata }];
                }
            });
        });
    };
    /**
     * Lookup all resources currently stored in the cache which have no associated hash.
     */
    AssetGroup.prototype.unhashedResources = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cache;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cache];
                    case 1:
                        cache = _a.sent();
                        return [4 /*yield*/, cache.keys()];
                    case 2: 
                    // Start with the set of all cached URLs.
                    return [2 /*return*/, (_a.sent())
                            .map(function (request) { return request.url; })
                            // Exclude the URLs which have hashes.
                            .filter(function (url) { return !_this.hashes.has(url); })];
                }
            });
        });
    };
    /**
     * Fetch the given resource from the network, and cache it if able.
     */
    AssetGroup.prototype.fetchAndCacheOnce = function (req, used) {
        if (used === void 0) { used = true; }
        return __awaiter(this, void 0, void 0, function () {
            var fetchOp, res, cache, meta, metaTable, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // The `inFlightRequests` map holds information about which caching operations are currently
                        // underway for known resources. If this request appears there, another "thread" is already
                        // in the process of caching it, and this work should not be duplicated.
                        if (this.inFlightRequests.has(req.url)) {
                            // There is a caching operation already in progress for this request. Wait for it to
                            // complete, and hopefully it will have yielded a useful response.
                            return [2 /*return*/, this.inFlightRequests.get(req.url)];
                        }
                        fetchOp = this.fetchFromNetwork(req);
                        // Save this operation in `inFlightRequests` so any other "thread" attempting to cache it
                        // will block on this chain instead of duplicating effort.
                        this.inFlightRequests.set(req.url, fetchOp);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 11, 12]);
                        return [4 /*yield*/, fetchOp];
                    case 2:
                        res = _a.sent();
                        // It's very important that only successful responses are cached. Unsuccessful responses
                        // should never be cached as this can completely break applications.
                        if (!res.ok) {
                            throw new Error("Response not Ok (fetchAndCacheOnce): request for " + req.url + " returned response " + res.status + " " + res.statusText);
                        }
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 9, , 10]);
                        return [4 /*yield*/, this.scope.caches.open(this.prefix + ":" + this.config.name + ":cache")];
                    case 4:
                        cache = _a.sent();
                        return [4 /*yield*/, cache.put(req, res.clone())];
                    case 5:
                        _a.sent();
                        if (!!this.hashes.has(req.url)) return [3 /*break*/, 8];
                        meta = { ts: this.adapter.time, used: used };
                        return [4 /*yield*/, this.metadata];
                    case 6:
                        metaTable = _a.sent();
                        return [4 /*yield*/, metaTable.write(req.url, meta)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: return [2 /*return*/, res];
                    case 9:
                        err_1 = _a.sent();
                        // Among other cases, this can happen when the user clears all data through the DevTools,
                        // but the SW is still running and serving another tab. In that case, trying to write to the
                        // caches throws an `Entry was not found` error.
                        // If this happens the SW can no longer work correctly. This situation is unrecoverable.
                        throw new error_1.SwCriticalError("Failed to update the caches for request to '" + req.url + "' (fetchAndCacheOnce): " + error_1.errorToString(err_1));
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        // Finally, it can be removed from `inFlightRequests`. This might result in a double-remove
                        // if some other chain was already making this request too, but that won't hurt anything.
                        this.inFlightRequests.delete(req.url);
                        return [7 /*endfinally*/];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    AssetGroup.prototype.fetchFromNetwork = function (req, redirectLimit) {
        if (redirectLimit === void 0) { redirectLimit = 3; }
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cacheBustedFetchFromNetwork(req)];
                    case 1:
                        res = _a.sent();
                        // Check for redirected responses, and follow the redirects.
                        if (res['redirected'] && !!res.url) {
                            // If the redirect limit is exhausted, fail with an error.
                            if (redirectLimit === 0) {
                                throw new error_1.SwCriticalError("Response hit redirect limit (fetchFromNetwork): request redirected too many times, next is " + res.url);
                            }
                            // Unwrap the redirect directly.
                            return [2 /*return*/, this.fetchFromNetwork(this.adapter.newRequest(res.url), redirectLimit - 1)];
                        }
                        return [2 /*return*/, res];
                }
            });
        });
    };
    /**
     * Load a particular asset from the network, accounting for hash validation.
     */
    AssetGroup.prototype.cacheBustedFetchFromNetwork = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var url, canonicalHash, networkResult, makeCacheBustedRequest, fetchedHash, _a, cacheBustReq, cacheBustedResult, cacheBustedHash, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        url = this.getConfigUrl(req.url);
                        if (!this.hashes.has(url)) return [3 /*break*/, 7];
                        canonicalHash = this.hashes.get(url);
                        return [4 /*yield*/, this.safeFetch(req)];
                    case 1:
                        networkResult = _c.sent();
                        makeCacheBustedRequest = networkResult.ok;
                        if (!makeCacheBustedRequest) return [3 /*break*/, 3];
                        _a = sha1_1.sha1Binary;
                        return [4 /*yield*/, networkResult.clone().arrayBuffer()];
                    case 2:
                        fetchedHash = _a.apply(void 0, [_c.sent()]);
                        makeCacheBustedRequest = (fetchedHash !== canonicalHash);
                        _c.label = 3;
                    case 3:
                        if (!makeCacheBustedRequest) return [3 /*break*/, 6];
                        cacheBustReq = this.adapter.newRequest(this.cacheBust(req.url));
                        return [4 /*yield*/, this.safeFetch(cacheBustReq)];
                    case 4:
                        cacheBustedResult = _c.sent();
                        // If the response was unsuccessful, there's nothing more that can be done.
                        if (!cacheBustedResult.ok) {
                            throw new error_1.SwCriticalError("Response not Ok (cacheBustedFetchFromNetwork): cache busted request for " + req.url + " returned response " + cacheBustedResult.status + " " + cacheBustedResult.statusText);
                        }
                        _b = sha1_1.sha1Binary;
                        return [4 /*yield*/, cacheBustedResult.clone().arrayBuffer()];
                    case 5:
                        cacheBustedHash = _b.apply(void 0, [_c.sent()]);
                        // If the cache-busted version doesn't match, then the manifest is not an accurate
                        // representation of the server's current set of files, and the SW should give up.
                        if (canonicalHash !== cacheBustedHash) {
                            throw new error_1.SwCriticalError("Hash mismatch (cacheBustedFetchFromNetwork): " + req.url + ": expected " + canonicalHash + ", got " + cacheBustedHash + " (after cache busting)");
                        }
                        // If it does match, then use the cache-busted result.
                        return [2 /*return*/, cacheBustedResult];
                    case 6: 
                    // Excellent, the version from the network matched on the first try, with no need for
                    // cache-busting. Use it.
                    return [2 /*return*/, networkResult];
                    case 7: 
                    // This URL doesn't exist in our hash database, so it must be requested directly.
                    return [2 /*return*/, this.safeFetch(req)];
                }
            });
        });
    };
    /**
     * Possibly update a resource, if it's expired and needs to be updated. A no-op otherwise.
     */
    AssetGroup.prototype.maybeUpdate = function (updateFrom, req, cache) {
        return __awaiter(this, void 0, void 0, function () {
            var url, meta, hash, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.getConfigUrl(req.url);
                        return [4 /*yield*/, this.metadata];
                    case 1:
                        meta = _a.sent();
                        if (!this.hashes.has(url)) return [3 /*break*/, 5];
                        hash = this.hashes.get(url);
                        return [4 /*yield*/, updateFrom.lookupResourceWithHash(url, hash)];
                    case 2:
                        res = _a.sent();
                        if (!(res !== null)) return [3 /*break*/, 5];
                        // Copy to this cache.
                        return [4 /*yield*/, cache.put(req, res)];
                    case 3:
                        // Copy to this cache.
                        _a.sent();
                        return [4 /*yield*/, meta.write(req.url, { ts: this.adapter.time, used: false })];
                    case 4:
                        _a.sent();
                        // No need to do anything further with this resource, it's now cached properly.
                        return [2 /*return*/, true];
                    case 5: 
                    // No up-to-date version of this resource could be found.
                    return [2 /*return*/, false];
                }
            });
        });
    };
    /**
     * Construct a cache-busting URL for a given URL.
     */
    AssetGroup.prototype.cacheBust = function (url) {
        return url + (url.indexOf('?') === -1 ? '?' : '&') + 'ngsw-cache-bust=' + Math.random();
    };
    AssetGroup.prototype.safeFetch = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.scope.fetch(req)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_2 = _a.sent();
                        return [2 /*return*/, this.adapter.newResponse('', {
                                status: 504,
                                statusText: 'Gateway Timeout',
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return AssetGroup;
}());
exports.AssetGroup = AssetGroup;
/**
 * An `AssetGroup` that prefetches all of its resources during initialization.
 */
var PrefetchAssetGroup = /** @class */ (function (_super) {
    __extends(PrefetchAssetGroup, _super);
    function PrefetchAssetGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PrefetchAssetGroup.prototype.initializeFully = function (updateFrom) {
        return __awaiter(this, void 0, void 0, function () {
            var cache, metaTable_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cache];
                    case 1:
                        cache = _a.sent();
                        // Cache all known resources serially. As this reduce proceeds, each Promise waits
                        // on the last before starting the fetch/cache operation for the next request. Any
                        // errors cause fall-through to the final Promise which rejects.
                        return [4 /*yield*/, this.config.urls.reduce(function (previous, url) { return __awaiter(_this, void 0, void 0, function () {
                                var req, alreadyCached, _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: 
                                        // Wait on all previous operations to complete.
                                        return [4 /*yield*/, previous];
                                        case 1:
                                            // Wait on all previous operations to complete.
                                            _b.sent();
                                            req = this.adapter.newRequest(url);
                                            return [4 /*yield*/, cache.match(req)];
                                        case 2:
                                            alreadyCached = (_b.sent()) !== undefined;
                                            // If the resource is in the cache already, it can be skipped.
                                            if (alreadyCached) {
                                                return [2 /*return*/];
                                            }
                                            _a = updateFrom !== undefined;
                                            if (!_a) return [3 /*break*/, 4];
                                            return [4 /*yield*/, this.maybeUpdate(updateFrom, req, cache)];
                                        case 3:
                                            _a = (_b.sent());
                                            _b.label = 4;
                                        case 4:
                                            // If an update source is available.
                                            if (_a) {
                                                return [2 /*return*/];
                                            }
                                            // Otherwise, go to the network and hopefully cache the response (if successful).
                                            return [4 /*yield*/, this.fetchAndCacheOnce(req, false)];
                                        case 5:
                                            // Otherwise, go to the network and hopefully cache the response (if successful).
                                            _b.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }, Promise.resolve())];
                    case 2:
                        // Cache all known resources serially. As this reduce proceeds, each Promise waits
                        // on the last before starting the fetch/cache operation for the next request. Any
                        // errors cause fall-through to the final Promise which rejects.
                        _a.sent();
                        if (!(updateFrom !== undefined)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.metadata];
                    case 3:
                        metaTable_1 = _a.sent();
                        return [4 /*yield*/, updateFrom.previouslyCachedResources()];
                    case 4: 
                    // Select all of the previously cached resources. These are cached unhashed resources
                    // from previous versions of the app, in any asset group.
                    return [4 /*yield*/, (_a.sent())
                            // First, narrow down the set of resources to those which are handled by this group.
                            // Either it's a known URL, or it matches a given pattern.
                            .filter(function (url) { return _this.config.urls.some(function (cacheUrl) { return cacheUrl === url; }) ||
                            _this.patterns.some(function (pattern) { return pattern.test(url); }); })
                            // Finally, process each resource in turn.
                            .reduce(function (previous, url) { return __awaiter(_this, void 0, void 0, function () {
                            var req, alreadyCached, res;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, previous];
                                    case 1:
                                        _a.sent();
                                        req = this.adapter.newRequest(url);
                                        return [4 /*yield*/, cache.match(req)];
                                    case 2:
                                        alreadyCached = ((_a.sent()) !== undefined);
                                        if (alreadyCached) {
                                            return [2 /*return*/];
                                        }
                                        return [4 /*yield*/, updateFrom.lookupResourceWithoutHash(url)];
                                    case 3:
                                        res = _a.sent();
                                        if (res === null || res.metadata === undefined) {
                                            // Unexpected, but not harmful.
                                            return [2 /*return*/];
                                        }
                                        // Write it into the cache. It may already be expired, but it can still serve
                                        // traffic until it's updated (stale-while-revalidate approach).
                                        return [4 /*yield*/, cache.put(req, res.response)];
                                    case 4:
                                        // Write it into the cache. It may already be expired, but it can still serve
                                        // traffic until it's updated (stale-while-revalidate approach).
                                        _a.sent();
                                        return [4 /*yield*/, metaTable_1.write(url, __assign({}, res.metadata, { used: false }))];
                                    case 5:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }, Promise.resolve())];
                    case 5:
                        // Select all of the previously cached resources. These are cached unhashed resources
                        // from previous versions of the app, in any asset group.
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return PrefetchAssetGroup;
}(AssetGroup));
exports.PrefetchAssetGroup = PrefetchAssetGroup;
var LazyAssetGroup = /** @class */ (function (_super) {
    __extends(LazyAssetGroup, _super);
    function LazyAssetGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LazyAssetGroup.prototype.initializeFully = function (updateFrom) {
        return __awaiter(this, void 0, void 0, function () {
            var cache;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // No action necessary if no update source is available - resources managed in this group
                        // are all lazily loaded, so there's nothing to initialize.
                        if (updateFrom === undefined) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.cache];
                    case 1:
                        cache = _a.sent();
                        // Loop through the listed resources, caching any which are available.
                        return [4 /*yield*/, this.config.urls.reduce(function (previous, url) { return __awaiter(_this, void 0, void 0, function () {
                                var req, alreadyCached, updated, cacheStatus;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: 
                                        // Wait on all previous operations to complete.
                                        return [4 /*yield*/, previous];
                                        case 1:
                                            // Wait on all previous operations to complete.
                                            _a.sent();
                                            req = this.adapter.newRequest(url);
                                            return [4 /*yield*/, cache.match(req)];
                                        case 2:
                                            alreadyCached = (_a.sent()) !== undefined;
                                            // If the resource is in the cache already, it can be skipped.
                                            if (alreadyCached) {
                                                return [2 /*return*/];
                                            }
                                            return [4 /*yield*/, this.maybeUpdate(updateFrom, req, cache)];
                                        case 3:
                                            updated = _a.sent();
                                            if (!(this.config.updateMode === 'prefetch' && !updated)) return [3 /*break*/, 6];
                                            return [4 /*yield*/, updateFrom.recentCacheStatus(url)];
                                        case 4:
                                            cacheStatus = _a.sent();
                                            // If the resource is not cached, or was cached but unused, then it will be
                                            // loaded lazily.
                                            if (cacheStatus !== api_1.UpdateCacheStatus.CACHED) {
                                                return [2 /*return*/];
                                            }
                                            // Update from the network.
                                            return [4 /*yield*/, this.fetchAndCacheOnce(req, false)];
                                        case 5:
                                            // Update from the network.
                                            _a.sent();
                                            _a.label = 6;
                                        case 6: return [2 /*return*/];
                                    }
                                });
                            }); }, Promise.resolve())];
                    case 2:
                        // Loop through the listed resources, caching any which are available.
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return LazyAssetGroup;
}(AssetGroup));
exports.LazyAssetGroup = LazyAssetGroup;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvd29ya2VyL3NyYy9hc3NldHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdILDZCQUErRTtBQUUvRSxpQ0FBdUQ7QUFHdkQsK0JBQWtDO0FBRWxDOzs7O0dBSUc7QUFDSDtJQStCRSxvQkFDYyxLQUErQixFQUFZLE9BQWdCLEVBQzNELElBQW1CLEVBQVksTUFBd0IsRUFDdkQsTUFBMkIsRUFBWSxFQUFZLEVBQVksTUFBYztRQUY3RSxVQUFLLEdBQUwsS0FBSyxDQUEwQjtRQUFZLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFDM0QsU0FBSSxHQUFKLElBQUksQ0FBZTtRQUFZLFdBQU0sR0FBTixNQUFNLENBQWtCO1FBQ3ZELFdBQU0sR0FBTixNQUFNLENBQXFCO1FBQVksT0FBRSxHQUFGLEVBQUUsQ0FBVTtRQUFZLFdBQU0sR0FBTixNQUFNLENBQVE7UUFqQzNGOzs7V0FHRztRQUNLLHFCQUFnQixHQUFHLElBQUksR0FBRyxFQUE2QixDQUFDO1FBRWhFOztXQUVHO1FBQ08sYUFBUSxHQUFhLEVBQUUsQ0FBQztRQXlCaEMsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ3hCLCtGQUErRjtRQUMvRixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFBLE9BQU8sSUFBSSxPQUFBLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFuQixDQUFtQixDQUFDLENBQUM7UUFFekUseUZBQXlGO1FBQ3pGLFdBQVc7UUFDWCxtREFBbUQ7UUFDbkQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxD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