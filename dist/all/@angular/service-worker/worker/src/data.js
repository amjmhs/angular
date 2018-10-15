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
/**
 * Manages an instance of `LruState` and moves URLs to the head of the
 * chain when requested.
 */
var LruList = /** @class */ (function () {
    function LruList(state) {
        if (state === undefined) {
            state = {
                head: null,
                tail: null,
                map: {},
                count: 0,
            };
        }
        this.state = state;
    }
    Object.defineProperty(LruList.prototype, "size", {
        /**
         * The current count of URLs in the list.
         */
        get: function () { return this.state.count; },
        enumerable: true,
        configurable: true
    });
    /**
     * Remove the tail.
     */
    LruList.prototype.pop = function () {
        // If there is no tail, return null.
        if (this.state.tail === null) {
            return null;
        }
        var url = this.state.tail;
        this.remove(url);
        // This URL has been successfully evicted.
        return url;
    };
    LruList.prototype.remove = function (url) {
        var node = this.state.map[url];
        if (node === undefined) {
            return false;
        }
        // Special case if removing the current head.
        if (this.state.head === url) {
            // The node is the current head. Special case the removal.
            if (node.next === null) {
                // This is the only node. Reset the cache to be empty.
                this.state.head = null;
                this.state.tail = null;
                this.state.map = {};
                this.state.count = 0;
                return true;
            }
            // There is at least one other node. Make the next node the new head.
            var next = this.state.map[node.next];
            next.previous = null;
            this.state.head = next.url;
            node.next = null;
            delete this.state.map[url];
            this.state.count--;
            return true;
        }
        // The node is not the head, so it has a previous. It may or may not be the tail.
        // If it is not, then it has a next. First, grab the previous node.
        var previous = this.state.map[node.previous];
        // Fix the forward pointer to skip over node and go directly to node.next.
        previous.next = node.next;
        // node.next may or may not be set. If it is, fix the back pointer to skip over node.
        // If it's not set, then this node happened to be the tail, and the tail needs to be
        // updated to point to the previous node (removing the tail).
        if (node.next !== null) {
            // There is a next node, fix its back pointer to skip this node.
            this.state.map[node.next].previous = node.previous;
        }
        else {
            // There is no next node - the accessed node must be the tail. Move the tail pointer.
            this.state.tail = node.previous;
        }
        node.next = null;
        node.previous = null;
        delete this.state.map[url];
        // Count the removal.
        this.state.count--;
        return true;
    };
    LruList.prototype.accessed = function (url) {
        // When a URL is accessed, its node needs to be moved to the head of the chain.
        // This is accomplished in two steps:
        //
        // 1) remove the node from its position within the chain.
        // 2) insert the node as the new head.
        //
        // Sometimes, a URL is accessed which has not been seen before. In this case, step 1 can
        // be skipped completely (which will grow the chain by one). Of course, if the node is
        // already the head, this whole operation can be skipped.
        if (this.state.head === url) {
            // The URL is already in the head position, accessing it is a no-op.
            return;
        }
        // Look up the node in the map, and construct a new entry if it's
        var node = this.state.map[url] || { url: url, next: null, previous: null };
        // Step 1: remove the node from its position within the chain, if it is in the chain.
        if (this.state.map[url] !== undefined) {
            this.remove(url);
        }
        // Step 2: insert the node at the head of the chain.
        // First, check if there's an existing head node. If there is, it has previous: null.
        // Its previous pointer should be set to the node we're inserting.
        if (this.state.head !== null) {
            this.state.map[this.state.head].previous = url;
        }
        // The next pointer of the node being inserted gets set to the old head, before the head
        // pointer is updated to this node.
        node.next = this.state.head;
        // The new head is the new node.
        this.state.head = url;
        // If there is no tail, then this is the first node, and is both the head and the tail.
        if (this.state.tail === null) {
            this.state.tail = url;
        }
        // Set the node in the map of nodes (if the URL has been seen before, this is a no-op)
        // and count the insertion.
        this.state.map[url] = node;
        this.state.count++;
    };
    return LruList;
}());
/**
 * A group of cached resources determined by a set of URL patterns which follow a LRU policy
 * for caching.
 */
var DataGroup = /** @class */ (function () {
    function DataGroup(scope, adapter, config, db, prefix) {
        this.scope = scope;
        this.adapter = adapter;
        this.config = config;
        this.db = db;
        this.prefix = prefix;
        /**
         * Tracks the LRU state of resources in this cache.
         */
        this._lru = null;
        this.patterns = this.config.patterns.map(function (pattern) { return new RegExp(pattern); });
        this.cache = this.scope.caches.open(this.prefix + ":dynamic:" + this.config.name + ":cache");
        this.lruTable = this.db.open(this.prefix + ":dynamic:" + this.config.name + ":lru");
        this.ageTable = this.db.open(this.prefix + ":dynamic:" + this.config.name + ":age");
    }
    /**
     * Lazily initialize/load the LRU chain.
     */
    DataGroup.prototype.lru = function () {
        return __awaiter(this, void 0, void 0, function () {
            var table, _a, _b, e_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(this._lru === null)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.lruTable];
                    case 1:
                        table = _c.sent();
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 4, , 5]);
                        _a = this;
                        _b = LruList.bind;
                        return [4 /*yield*/, table.read('lru')];
                    case 3:
                        _a._lru = new (_b.apply(LruList, [void 0, _c.sent()]))();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _c.sent();
                        this._lru = new LruList();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/, this._lru];
                }
            });
        });
    };
    /**
     * Sync the LRU chain to non-volatile storage.
     */
    DataGroup.prototype.syncLru = function () {
        return __awaiter(this, void 0, void 0, function () {
            var table;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this._lru === null) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.lruTable];
                    case 1:
                        table = _a.sent();
                        return [2 /*return*/, table.write('lru', this._lru.state)];
                }
            });
        });
    };
    /**
     * Process a fetch event and return a `Response` if the resource is covered by this group,
     * or `null` otherwise.
     */
    DataGroup.prototype.handleFetch = function (req, ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var lru, _a, wasCached;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // Do nothing
                        if (!this.patterns.some(function (pattern) { return pattern.test(req.url); })) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, this.lru()];
                    case 1:
                        lru = _b.sent();
                        _a = req.method;
                        switch (_a) {
                            case 'OPTIONS': return [3 /*break*/, 2];
                            case 'GET': return [3 /*break*/, 3];
                            case 'HEAD': return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 4];
                    case 2: 
                    // Don't try to cache this - it's non-mutating, but is part of a mutating request.
                    // Most likely SWs don't even see this, but this guard is here just in case.
                    return [2 /*return*/, null];
                    case 3:
                        // Handle the request with whatever strategy was selected.
                        switch (this.config.strategy) {
                            case 'freshness':
                                return [2 /*return*/, this.handleFetchWithFreshness(req, ctx, lru)];
                            case 'performance':
                                return [2 /*return*/, this.handleFetchWithPerformance(req, ctx, lru)];
                            default:
                                throw new Error("Unknown strategy: " + this.config.strategy);
                        }
                        _b.label = 4;
                    case 4:
                        wasCached = lru.remove(req.url);
                        if (!wasCached) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.clearCacheForUrl(req.url)];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6: 
                    // Sync the LRU chain to non-volatile storage.
                    return [4 /*yield*/, this.syncLru()];
                    case 7:
                        // Sync the LRU chain to non-volatile storage.
                        _b.sent();
                        // Finally, fall back on the network.
                        return [2 /*return*/, this.safeFetch(req)];
                }
            });
        });
    };
    DataGroup.prototype.handleFetchWithPerformance = function (req, ctx, lru) {
        return __awaiter(this, void 0, void 0, function () {
            var res, fromCache, _a, timeoutFetch, networkFetch;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        res = null;
                        return [4 /*yield*/, this.loadFromCache(req, lru)];
                    case 1:
                        fromCache = _b.sent();
                        if (fromCache !== null) {
                            res = fromCache.res;
                            // Check the age of the resource.
                            if (this.config.refreshAheadMs !== undefined && fromCache.age >= this.config.refreshAheadMs) {
                                ctx.waitUntil(this.safeCacheResponse(req, this.safeFetch(req)));
                            }
                        }
                        if (res !== null) {
                            return [2 /*return*/, res];
                        }
                        _a = this.networkFetchWithTimeout(req), timeoutFetch = _a[0], networkFetch = _a[1];
                        return [4 /*yield*/, timeoutFetch];
                    case 2:
                        res = _b.sent();
                        // Since fetch() will always return a response, undefined indicates a timeout.
                        if (res === undefined) {
                            // The request timed out. Return a Gateway Timeout error.
                            res = this.adapter.newResponse(null, { status: 504, statusText: 'Gateway Timeout' });
                            // Cache the network response eventually.
                            ctx.waitUntil(this.safeCacheResponse(req, networkFetch));
                        }
                        // The request completed in time, so cache it inline with the response flow.
                        return [4 /*yield*/, this.cacheResponse(req, res, lru)];
                    case 3:
                        // The request completed in time, so cache it inline with the response flow.
                        _b.sent();
                        return [2 /*return*/, res];
                }
            });
        });
    };
    DataGroup.prototype.handleFetchWithFreshness = function (req, ctx, lru) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, timeoutFetch, networkFetch, res, e_2, fromCache;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.networkFetchWithTimeout(req), timeoutFetch = _a[0], networkFetch = _a[1];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, timeoutFetch];
                    case 2:
                        res = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _b.sent();
                        res = undefined;
                        return [3 /*break*/, 4];
                    case 4:
                        if (!(res === undefined)) return [3 /*break*/, 6];
                        ctx.waitUntil(this.safeCacheResponse(req, networkFetch));
                        return [4 /*yield*/, this.loadFromCache(req, lru)];
                    case 5:
                        fromCache = _b.sent();
                        res = (fromCache !== null) ? fromCache.res : null;
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, this.cacheResponse(req, res, lru, true)];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8:
                        // Either the network fetch didn't time out, or the cache yielded a usable response.
                        // In either case, use it.
                        if (res !== null) {
                            return [2 /*return*/, res];
                        }
                        return [4 /*yield*/, networkFetch];
                    case 9:
                        // No response in the cache. No choice but to fall back on the full network fetch.
                        res = _b.sent();
                        return [4 /*yield*/, this.cacheResponse(req, res, lru, true)];
                    case 10:
                        _b.sent();
                        return [2 /*return*/, res];
                }
            });
        });
    };
    DataGroup.prototype.networkFetchWithTimeout = function (req) {
        var _this = this;
        // If there is a timeout configured, race a timeout Promise with the network fetch.
        // Otherwise, just fetch from the network directly.
        if (this.config.timeoutMs !== undefined) {
            var networkFetch_1 = this.scope.fetch(req);
            var safeNetworkFetch = (function () { return __awaiter(_this, void 0, void 0, function () {
                var err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, networkFetch_1];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2:
                            err_1 = _a.sent();
                            return [2 /*return*/, this.adapter.newResponse(null, {
                                    status: 504,
                                    statusText: 'Gateway Timeout',
                                })];
                        case 3: return [2 /*return*/];
                    }
                });
            }); })();
            var networkFetchUndefinedError = (function () { return __awaiter(_this, void 0, void 0, function () {
                var err_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, networkFetch_1];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2:
                            err_2 = _a.sent();
                            return [2 /*return*/, undefined];
                        case 3: return [2 /*return*/];
                    }
                });
            }); })();
            // Construct a Promise<undefined> for the timeout.
            var timeout = this.adapter.timeout(this.config.timeoutMs);
            // Race that with the network fetch. This will either be a Response, or `undefined`
            // in the event that the request errored or timed out.
            return [Promise.race([networkFetchUndefinedError, timeout]), safeNetworkFetch];
        }
        else {
            var networkFetch = this.safeFetch(req);
            // Do a plain fetch.
            return [networkFetch, networkFetch];
        }
    };
    DataGroup.prototype.safeCacheResponse = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, e_3;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 4, , 5]);
                        _a = this.cacheResponse;
                        _b = [req];
                        return [4 /*yield*/, res];
                    case 1:
                        _b = _b.concat([_c.sent()]);
                        return [4 /*yield*/, this.lru()];
                    case 2: return [4 /*yield*/, _a.apply(this, _b.concat([_c.sent()]))];
                    case 3:
                        _c.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_3 = _c.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DataGroup.prototype.loadFromCache = function (req, lru) {
        return __awaiter(this, void 0, void 0, function () {
            var cache, res, ageTable, age, _a, e_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.cache];
                    case 1:
                        cache = _b.sent();
                        return [4 /*yield*/, cache.match(req)];
                    case 2:
                        res = _b.sent();
                        if (!(res !== undefined)) return [3 /*break*/, 10];
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 6, , 7]);
                        return [4 /*yield*/, this.ageTable];
                    case 4:
                        ageTable = _b.sent();
                        _a = this.adapter.time;
                        return [4 /*yield*/, ageTable.read(req.url)];
                    case 5:
                        age = _a - (_b.sent()).age;
                        // If the response is young enough, use it.
                        if (age <= this.config.maxAge) {
                            // Successful match from the cache. Use the response, after marking it as having
                            // been accessed.
                            lru.accessed(req.url);
                            return [2 /*return*/, { res: res, age: age }];
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        e_4 = _b.sent();
                        return [3 /*break*/, 7];
                    case 7:
                        lru.remove(req.url);
                        return [4 /*yield*/, this.clearCacheForUrl(req.url)];
                    case 8:
                        _b.sent();
                        // TODO: avoid duplicate in event of network timeout, maybe.
                        return [4 /*yield*/, this.syncLru()];
                    case 9:
                        // TODO: avoid duplicate in event of network timeout, maybe.
                        _b.sent();
                        _b.label = 10;
                    case 10: return [2 /*return*/, null];
                }
            });
        });
    };
    /**
     * Operation for caching the response from the server. This has to happen all
     * at once, so that the cache and LRU tracking remain in sync. If the network request
     * completes before the timeout, this logic will be run inline with the response flow.
     * If the request times out on the server, an error will be returned but the real network
     * request will still be running in the background, to be cached when it completes.
     */
    DataGroup.prototype.cacheResponse = function (req, res, lru, okToCacheOpaque) {
        if (okToCacheOpaque === void 0) { okToCacheOpaque = false; }
        return __awaiter(this, void 0, void 0, function () {
            var evictedUrl, ageTable;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Only cache successful responses.
                        if (!res.ok || (okToCacheOpaque && res.type === 'opaque')) {
                            return [2 /*return*/];
                        }
                        if (!(lru.size >= this.config.maxSize)) return [3 /*break*/, 2];
                        evictedUrl = lru.pop();
                        if (!(evictedUrl !== null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.clearCacheForUrl(evictedUrl)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        // TODO: evaluate for possible race conditions during flaky network periods.
                        // Mark this resource as having been accessed recently. This ensures it won't be evicted
                        // until enough other resources are requested that it falls off the end of the LRU chain.
                        lru.accessed(req.url);
                        return [4 /*yield*/, this.cache];
                    case 3: 
                    // Store the response in the cache (cloning because the browser will consume
                    // the body during the caching operation).
                    return [4 /*yield*/, (_a.sent()).put(req, res.clone())];
                    case 4:
                        // Store the response in the cache (cloning because the browser will consume
                        // the body during the caching operation).
                        _a.sent();
                        return [4 /*yield*/, this.ageTable];
                    case 5:
                        ageTable = _a.sent();
                        return [4 /*yield*/, ageTable.write(req.url, { age: this.adapter.time })];
                    case 6:
                        _a.sent();
                        // Sync the LRU chain to non-volatile storage.
                        return [4 /*yield*/, this.syncLru()];
                    case 7:
                        // Sync the LRU chain to non-volatile storage.
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete all of the saved state which this group uses to track resources.
     */
    DataGroup.prototype.cleanup = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Remove both the cache and the database entries which track LRU stats.
                    return [4 /*yield*/, Promise.all([
                            this.scope.caches.delete(this.prefix + ":dynamic:" + this.config.name + ":cache"),
                            this.db.delete(this.prefix + ":dynamic:" + this.config.name + ":age"),
                            this.db.delete(this.prefix + ":dynamic:" + this.config.name + ":lru"),
                        ])];
                    case 1:
                        // Remove both the cache and the database entries which track LRU stats.
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Clear the state of the cache for a particular resource.
     *
     * This doesn't remove the resource from the LRU table, that is assumed to have
     * been done already. This clears the GET and HEAD versions of the request from
     * the cache itself, as well as the metadata stored in the age table.
     */
    DataGroup.prototype.clearCacheForUrl = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, cache, ageTable;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([this.cache, this.ageTable])];
                    case 1:
                        _a = _b.sent(), cache = _a[0], ageTable = _a[1];
                        return [4 /*yield*/, Promise.all([
                                cache.delete(this.adapter.newRequest(url, { method: 'GET' })),
                                cache.delete(this.adapter.newRequest(url, { method: 'HEAD' })),
                                ageTable.delete(url),
                            ])];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataGroup.prototype.safeFetch = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.scope.fetch(req)];
                }
                catch (err) {
                    return [2 /*return*/, this.adapter.newResponse(null, {
                            status: 504,
                            statusText: 'Gateway Timeout',
                        })];
                }
                return [2 /*return*/];
            });
        });
    };
    return DataGroup;
}());
exports.DataGroup = DataGroup;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3NlcnZpY2Utd29ya2VyL3dvcmtlci9zcmMvZGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBOERIOzs7R0FHRztBQUNIO0lBRUUsaUJBQVksS0FBZ0I7UUFDMUIsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQ3ZCLEtBQUssR0FBRztnQkFDTixJQUFJLEVBQUUsSUFBSTtnQkFDVixJQUFJLEVBQUUsSUFBSTtnQkFDVixHQUFHLEVBQUUsRUFBRTtnQkFDUCxLQUFLLEVBQUUsQ0FBQzthQUNULENBQUM7U0FDSDtRQUNELElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3JCLENBQUM7SUFLRCxzQkFBSSx5QkFBSTtRQUhSOztXQUVHO2FBQ0gsY0FBcUIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBRS9DOztPQUVHO0lBQ0gscUJBQUcsR0FBSDtRQUNFLG9DQUFvQztRQUNwQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLElBQUksRUFBRTtZQUM1QixPQUFPLElBQUksQ0FBQztTQUNiO1FBRUQsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7UUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVqQiwwQ0FBMEM7UUFDMUMsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDO0lBRUQsd0JBQU0sR0FBTixVQUFPLEdBQVc7UUFDaEIsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakMsSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFO1lBQ3RCLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCw2Q0FBNkM7UUFDN0MsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxHQUFHLEVBQUU7WUFDM0IsMERBQTBEO1lBQzFELElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUU7Z0JBQ3RCLHNEQUFzRDtnQkFDdEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO2dCQUN2QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztnQkFDcEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO2dCQUNyQixPQUFPLElBQUksQ0FBQzthQUNiO1lBRUQscUVBQXFFO1lBQ3JFLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFNLENBQUcsQ0FBQztZQUMzQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztZQUNyQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO1lBQzNCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDM0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNuQixPQUFPLElBQUksQ0FBQztTQUNiO1FBRUQsaUZBQWlGO1FBQ2pGLG1FQUFtRTtRQUNuRSxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBVSxDQUFHLENBQUM7UUFFbkQsMEVBQTBFO1FBQzFFLFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUUxQixxRkFBcUY7UUFDckYsb0ZBQW9GO1FBQ3BGLDZEQUE2RDtRQUM3RCxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFFO1lBQ3RCLGdFQUFnRTtZQUNoRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFHLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFVLENBQUM7U0FDeEQ7YUFBTTtZQUNMLHFGQUFxRjtZQUNyRixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsUUFBVSxDQUFDO1NBQ25DO1FBRUQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDckIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMzQixxQkFBcUI7UUFDckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUVuQixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCwwQkFBUSxHQUFSLFVBQVMsR0FBVztRQUNsQiwrRUFBK0U7UUFDL0UscUNBQXFDO1FBQ3JDLEVBQUU7UUFDRix5REFBeUQ7UUFDekQsc0NBQXNDO1FBQ3RDLEVBQUU7UUFDRix3RkFBd0Y7UUFDeEYsc0ZBQXNGO1FBQ3RGLHlEQUF5RDtRQUN6RCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLEdBQUcsRUFBRTtZQUMzQixvRUFBb0U7WUFDcEUsT0FBTztTQUNSO1FBRUQsaUVBQWlFO1FBQ2pFLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUMsR0FBRyxLQUFBLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUM7UUFFdEUscUZBQXFGO1FBQ3JGLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssU0FBUyxFQUFFO1lBQ3JDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbEI7UUFFRCxvREFBb0Q7UUFFcEQscUZBQXFGO1FBQ3JGLGtFQUFrRTtRQUNsRSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLElBQUksRUFBRTtZQUM1QixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBRyxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7U0FDbEQ7UUFFRCx3RkFBd0Y7UUFDeEYsbUNBQW1DO1FBQ25DLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7UUFFNUIsZ0NBQWdDO1FBQ2hDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUV0Qix1RkFBdUY7UUFDdkYsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUU7WUFDNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO1NBQ3ZCO1FBRUQsc0ZBQXNGO1FBQ3RGLDJCQUEyQjtRQUMzQixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDM0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBQ0gsY0FBQztBQUFELENBQUMsQUExSUQsSUEwSUM7QUFFRDs7O0dBR0c7QUFDSDtJQTJCRSxtQkFDWSxLQUErQixFQUFVLE9BQWdCLEVBQ3pELE1BQXVCLEVBQVUsRUFBWSxFQUFVLE1BQWM7UUFEckUsVUFBSyxHQUFMLEtBQUssQ0FBMEI7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQ3pELFdBQU0sR0FBTixNQUFNLENBQWlCO1FBQVUsT0FBRSxHQUFGLEVBQUUsQ0FBVTtRQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7UUFqQmpGOztXQUVHO1FBQ0ssU0FBSSxHQUFpQixJQUFJLENBQUM7UUFlaEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBQSxPQUFPLElBQUksT0FBQSxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBbkIsQ0FBbUIsQ0FBQyxDQUFDO1FBQ3pFLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFJLElBQUksQ0FBQyxNQUFNLGlCQUFZLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxXQUFRLENBQUMsQ0FBQztRQUN4RixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFJLElBQUksQ0FBQyxNQUFNLGlCQUFZLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxTQUFNLENBQUMsQ0FBQztRQUMvRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFJLElBQUksQ0FBQyxNQUFNLGlCQUFZLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxTQUFNLENBQUMsQ0FBQztJQUNqRixDQUFDO0lBRUQ7O09BRUc7SUFDVyx1QkFBRyxHQUFqQjs7Ozs7OzZCQUNNLENBQUEsSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUEsRUFBbEIsd0JBQWtCO3dCQUNOLHFCQUFNLElBQUksQ0FBQyxRQUFRLEVBQUE7O3dCQUEzQixLQUFLLEdBQUcsU0FBbUI7Ozs7d0JBRS9CLEtBQUEsSUFBSSxDQUFBOzZCQUFZLE9BQU87d0JBQUMscUJBQU0sS0FBSyxDQUFDLElBQUksQ0FBVyxLQUFLLENBQUMsRUFBQTs7d0JBQXpELEdBQUssSUFBSSxHQUFHLGNBQUksT0FBTyxXQUFDLFNBQWlDLEtBQUMsQ0FBQzs7Ozt3QkFFM0QsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDOzs0QkFHOUIsc0JBQU8sSUFBSSxDQUFDLElBQUksRUFBQzs7OztLQUNsQjtJQUVEOztPQUVHO0lBQ0csMkJBQU8sR0FBYjs7Ozs7O3dCQUNFLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUU7NEJBQ3RCLHNCQUFPO3lCQUNSO3dCQUNhLHFCQUFNLElBQUksQ0FBQyxRQUFRLEVBQUE7O3dCQUEzQixLQUFLLEdBQUcsU0FBbUI7d0JBQ2pDLHNCQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFNLENBQUMsS0FBSyxDQUFDLEVBQUM7Ozs7S0FDOUM7SUFFRDs7O09BR0c7SUFDRywrQkFBVyxHQUFqQixVQUFrQixHQUFZLEVBQUUsR0FBWTs7Ozs7O3dCQUMxQyxhQUFhO3dCQUNiLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFBLE9BQU8sSUFBSSxPQUFBLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFyQixDQUFxQixDQUFDLEVBQUU7NEJBQ3pELHNCQUFPLElBQUksRUFBQzt5QkFDYjt3QkFHVyxxQkFBTSxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUE7O3dCQUF0QixHQUFHLEdBQUcsU0FBZ0I7d0JBR3BCLEtBQUEsR0FBRyxDQUFDLE1BQU0sQ0FBQTs7aUNBQ1gsU0FBUyxDQUFDLENBQVYsd0JBQVM7aUNBSVQsS0FBSyxDQUFDLENBQU4sd0JBQUs7aUNBQ0wsTUFBTSxDQUFDLENBQVAsd0JBQU07Ozs7b0JBSlQsa0ZBQWtGO29CQUNsRiw0RUFBNEU7b0JBQzVFLHNCQUFPLElBQUksRUFBQzs7d0JBR1osMERBQTBEO3dCQUMxRCxRQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFOzRCQUM1QixLQUFLLFdBQVc7Z0NBQ2Qsc0JBQU8sSUFBSSxDQUFDLHdCQUF3QixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUM7NEJBQ3RELEtBQUssYUFBYTtnQ0FDaEIsc0JBQU8sSUFBSSxDQUFDLDBCQUEwQixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUM7NEJBQ3hEO2dDQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMsdUJBQXFCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBVSxDQUFDLENBQUM7eUJBQ2hFOzs7d0JBR0ssU0FBUyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDOzZCQUdsQyxTQUFTLEVBQVQsd0JBQVM7d0JBQ1gscUJBQU0sSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBQTs7d0JBQXBDLFNBQW9DLENBQUM7OztvQkFHdkMsOENBQThDO29CQUM5QyxxQkFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUE7O3dCQURwQiw4Q0FBOEM7d0JBQzlDLFNBQW9CLENBQUM7d0JBRXJCLHFDQUFxQzt3QkFDckMsc0JBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBQzs7OztLQUVoQztJQUVhLDhDQUEwQixHQUF4QyxVQUF5QyxHQUFZLEVBQUUsR0FBWSxFQUFFLEdBQVk7Ozs7Ozt3QkFFM0UsR0FBRyxHQUE0QixJQUFJLENBQUM7d0JBSXRCLHFCQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFBOzt3QkFBOUMsU0FBUyxHQUFHLFNBQWtDO3dCQUNwRCxJQUFJLFNBQVMsS0FBSyxJQUFJLEVBQUU7NEJBQ3RCLEdBQUcsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDOzRCQUNwQixpQ0FBaUM7NEJBQ2pDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEtBQUssU0FBUyxJQUFJLFNBQVMsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUU7Z0NBQzNGLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs2QkFDakU7eUJBQ0Y7d0JBRUQsSUFBSSxHQUFHLEtBQUssSUFBSSxFQUFFOzRCQUNoQixzQkFBTyxHQUFHLEVBQUM7eUJBQ1o7d0JBSUssS0FBK0IsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxFQUEvRCxZQUFZLFFBQUEsRUFBRSxZQUFZLFFBQUEsQ0FBc0M7d0JBQ2pFLHFCQUFNLFlBQVksRUFBQTs7d0JBQXhCLEdBQUcsR0FBRyxTQUFrQixDQUFDO3dCQUV6Qiw4RUFBOEU7d0JBQzlFLElBQUksR0FBRyxLQUFLLFNBQVMsRUFBRTs0QkFDckIseURBQXlEOzRCQUN6RCxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEVBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsaUJBQWlCLEVBQUMsQ0FBQyxDQUFDOzRCQUVuRix5Q0FBeUM7NEJBQ3pDLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDO3lCQUMxRDt3QkFFRCw0RUFBNEU7d0JBQzVFLHFCQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBQTs7d0JBRHZDLDRFQUE0RTt3QkFDNUUsU0FBdUMsQ0FBQzt3QkFDeEMsc0JBQU8sR0FBRyxFQUFDOzs7O0tBQ1o7SUFFYSw0Q0FBd0IsR0FBdEMsVUFBdUMsR0FBWSxFQUFFLEdBQVksRUFBRSxHQUFZOzs7Ozs7d0JBR3ZFLEtBQStCLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsRUFBL0QsWUFBWSxRQUFBLEVBQUUsWUFBWSxRQUFBLENBQXNDOzs7O3dCQU0vRCxxQkFBTSxZQUFZLEVBQUE7O3dCQUF4QixHQUFHLEdBQUcsU0FBa0IsQ0FBQzs7Ozt3QkFFekIsR0FBRyxHQUFHLFNBQVMsQ0FBQzs7OzZCQUlkLENBQUEsR0FBRyxLQUFLLFNBQVMsQ0FBQSxFQUFqQix3QkFBaUI7d0JBQ25CLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDO3dCQUl2QyxxQkFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBQTs7d0JBQTlDLFNBQVMsR0FBRyxTQUFrQzt3QkFDcEQsR0FBRyxHQUFHLENBQUMsU0FBUyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7OzRCQUVsRCxxQkFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFBOzt3QkFBN0MsU0FBNkMsQ0FBQzs7O3dCQUdoRCxvRkFBb0Y7d0JBQ3BGLDBCQUEwQjt3QkFDMUIsSUFBSSxHQUFHLEtBQUssSUFBSSxFQUFFOzRCQUNoQixzQkFBTyxHQUFHLEVBQUM7eUJBQ1o7d0JBR0sscUJBQU0sWUFBWSxFQUFBOzt3QkFEeEIsa0ZBQWtGO3dCQUNsRixHQUFHLEdBQUcsU0FBa0IsQ0FBQzt3QkFDekIscUJBQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBQTs7d0JBQTdDLFNBQTZDLENBQUM7d0JBQzlDLHNCQUFPLEdBQUcsRUFBQzs7OztLQUNaO0lBRU8sMkNBQXVCLEdBQS9CLFVBQWdDLEdBQVk7UUFBNUMsaUJBZ0NDO1FBL0JDLG1GQUFtRjtRQUNuRixtREFBbUQ7UUFDbkQsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsS0FBSyxTQUFTLEVBQUU7WUFDdkMsSUFBTSxjQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDM0MsSUFBTSxnQkFBZ0IsR0FBRyxDQUFDOzs7Ozs7NEJBRWYscUJBQU0sY0FBWSxFQUFBO2dDQUF6QixzQkFBTyxTQUFrQixFQUFDOzs7NEJBRTFCLHNCQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRTtvQ0FDcEMsTUFBTSxFQUFFLEdBQUc7b0NBQ1gsVUFBVSxFQUFFLGlCQUFpQjtpQ0FDOUIsQ0FBQyxFQUFDOzs7O2lCQUVOLENBQUMsRUFBRSxDQUFDO1lBQ0wsSUFBTSwwQkFBMEIsR0FBRyxDQUFDOzs7Ozs7NEJBRXpCLHFCQUFNLGNBQVksRUFBQTtnQ0FBekIsc0JBQU8sU0FBa0IsRUFBQzs7OzRCQUUxQixzQkFBTyxTQUFTLEVBQUM7Ozs7aUJBRXBCLENBQUMsRUFBRSxDQUFDO1lBQ0wsa0RBQWtEO1lBQ2xELElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUF1QixDQUFDO1lBQ2xGLG1GQUFtRjtZQUNuRixzREFBc0Q7WUFDdEQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQywwQkFBMEIsRUFBRSxPQUFPLENBQUMsQ0FBQyxFQUFFLGdCQUFnQixDQUFDLENBQUM7U0FDaEY7YUFBTTtZQUNMLElBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDekMsb0JBQW9CO1lBQ3BCLE9BQU8sQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUM7U0FDckM7SUFDSCxDQUFDO0lBRWEscUNBQWlCLEdBQS9CLFVBQWdDLEdBQVksRUFBRSxHQUFzQjs7Ozs7Ozt3QkFFMUQsS0FBQSxJQUFJLENBQUMsYUFBYSxDQUFBOzhCQUFDLEdBQUc7d0JBQUUscUJBQU0sR0FBRyxFQUFBOzt3Q0FBVCxTQUFTO3dCQUFFLHFCQUFNLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBQTs0QkFBekQscUJBQU0sU0FBQSxJQUFJLGFBQStCLFNBQWdCLEdBQUMsRUFBQTs7d0JBQTFELFNBQTBELENBQUM7Ozs7Ozs7OztLQUk5RDtJQUVhLGlDQUFhLEdBQTNCLFVBQTRCLEdBQVksRUFBRSxHQUFZOzs7Ozs0QkFHdEMscUJBQU0sSUFBSSxDQUFDLEtBQUssRUFBQTs7d0JBQXhCLEtBQUssR0FBRyxTQUFnQjt3QkFDcEIscUJBQU0sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBQTs7d0JBQTVCLEdBQUcsR0FBRyxTQUFzQjs2QkFDNUIsQ0FBQSxHQUFHLEtBQUssU0FBUyxDQUFBLEVBQWpCLHlCQUFpQjs7Ozt3QkFHQSxxQkFBTSxJQUFJLENBQUMsUUFBUSxFQUFBOzt3QkFBOUIsUUFBUSxHQUFHLFNBQW1CO3dCQUN4QixLQUFBLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFBO3dCQUFJLHFCQUFNLFFBQVEsQ0FBQyxJQUFJLENBQVksR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFBOzt3QkFBbEUsR0FBRyxHQUFHLEtBQW9CLENBQUMsU0FBdUMsQ0FBQyxDQUFDLEdBQUc7d0JBQzdFLDJDQUEyQzt3QkFDM0MsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7NEJBQzdCLGdGQUFnRjs0QkFDaEYsaUJBQWlCOzRCQUNqQixHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQzs0QkFDdEIsc0JBQU8sRUFBQyxHQUFHLEtBQUEsRUFBRSxHQUFHLEtBQUEsRUFBQyxFQUFDO3lCQUNuQjs7Ozs7O3dCQU9ILEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUNwQixxQkFBTSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFBOzt3QkFBcEMsU0FBb0MsQ0FBQzt3QkFFckMsNERBQTREO3dCQUM1RCxxQkFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUE7O3dCQURwQiw0REFBNEQ7d0JBQzVELFNBQW9CLENBQUM7OzZCQUV2QixzQkFBTyxJQUFJLEVBQUM7Ozs7S0FDYjtJQUVEOzs7Ozs7T0FNRztJQUNXLGlDQUFhLEdBQTNCLFVBQ0ksR0FBWSxFQUFFLEdBQWEsRUFBRSxHQUFZLEVBQUUsZUFBZ0M7UUFBaEMsZ0NBQUEsRUFBQSx1QkFBZ0M7Ozs7Ozt3QkFDN0UsbUNBQW1DO3dCQUNuQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLGVBQWUsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBQyxFQUFFOzRCQUN6RCxzQkFBTzt5QkFDUjs2QkFJRyxDQUFBLEdBQUcsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUEsRUFBL0Isd0JBQStCO3dCQUUzQixVQUFVLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDOzZCQUN6QixDQUFBLFVBQVUsS0FBSyxJQUFJLENBQUEsRUFBbkIsd0JBQW1CO3dCQUNyQixxQkFBTSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLEVBQUE7O3dCQUF2QyxTQUF1QyxDQUFDOzs7d0JBSTVDLDRFQUE0RTt3QkFFNUUsd0ZBQXdGO3dCQUN4Rix5RkFBeUY7d0JBQ3pGLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUloQixxQkFBTSxJQUFJLENBQUMsS0FBSyxFQUFBOztvQkFGdEIsNEVBQTRFO29CQUM1RSwwQ0FBMEM7b0JBQzFDLHFCQUFLLENBQUMsU0FBZ0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUE7O3dCQUY3Qyw0RUFBNEU7d0JBQzVFLDBDQUEwQzt3QkFDMUMsU0FBNkMsQ0FBQzt3QkFHN0IscUJBQU0sSUFBSSxDQUFDLFFBQVEsRUFBQTs7d0JBQTlCLFFBQVEsR0FBRyxTQUFtQjt3QkFDcEMscUJBQU0sUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFDLENBQUMsRUFBQTs7d0JBQXZELFNBQXVELENBQUM7d0JBRXhELDhDQUE4Qzt3QkFDOUMscUJBQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFBOzt3QkFEcEIsOENBQThDO3dCQUM5QyxTQUFvQixDQUFDOzs7OztLQUN0QjtJQUVEOztPQUVHO0lBQ0csMkJBQU8sR0FBYjs7Ozs7b0JBQ0Usd0VBQXdFO29CQUN4RSxxQkFBTSxPQUFPLENBQUMsR0FBRyxDQUFDOzRCQUNoQixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUksSUFBSSxDQUFDLE1BQU0saUJBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLFdBQVEsQ0FBQzs0QkFDNUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUksSUFBSSxDQUFDLE1BQU0saUJBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLFNBQU0sQ0FBQzs0QkFDaEUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUksSUFBSSxDQUFDLE1BQU0saUJBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLFNBQU0sQ0FBQzt5QkFDakUsQ0FBQyxFQUFBOzt3QkFMRix3RUFBd0U7d0JBQ3hFLFNBSUUsQ0FBQzs7Ozs7S0FDSjtJQUVEOzs7Ozs7T0FNRztJQUNXLG9DQUFnQixHQUE5QixVQUErQixHQUFXOzs7Ozs0QkFDZCxxQkFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBQTs7d0JBQWxFLEtBQW9CLFNBQThDLEVBQWpFLEtBQUssUUFBQSxFQUFFLFFBQVEsUUFBQTt3QkFDdEIscUJBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQztnQ0FDaEIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztnQ0FDM0QsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsRUFBQyxNQUFNLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQztnQ0FDNUQsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7NkJBQ3JCLENBQUMsRUFBQTs7d0JBSkYsU0FJRSxDQUFDOzs7OztLQUNKO0lBRWEsNkJBQVMsR0FBdkIsVUFBd0IsR0FBWTs7O2dCQUNsQyxJQUFJO29CQUNGLHNCQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFDO2lCQUM5QjtnQkFBQyxPQUFPLEdBQUcsRUFBRTtvQkFDWixzQkFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUU7NEJBQ3BDLE1BQU0sRUFBRSxHQUFHOzRCQUNYLFVBQVUsRUFBRSxpQkFBaUI7eUJBQzlCLENBQUMsRUFBQztpQkFDSjs7OztLQUNGO0lBQ0gsZ0JBQUM7QUFBRCxDQUFDLEFBblZELElBbVZDO0FBblZZLDhCQUFTIn0=