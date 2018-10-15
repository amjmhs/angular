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
var fetch_1 = require("./fetch");
var MockCacheStorage = /** @class */ (function () {
    function MockCacheStorage(origin, hydrateFrom) {
        var _this = this;
        this.origin = origin;
        this.caches = new Map();
        if (hydrateFrom !== undefined) {
            var hydrated_1 = JSON.parse(hydrateFrom);
            Object.keys(hydrated_1).forEach(function (name) { _this.caches.set(name, new MockCache(_this.origin, hydrated_1[name])); });
        }
    }
    MockCacheStorage.prototype.has = function (name) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, this.caches.has(name)];
        }); });
    };
    MockCacheStorage.prototype.keys = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, Array.from(this.caches.keys())];
        }); });
    };
    MockCacheStorage.prototype.open = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.caches.has(name)) {
                    this.caches.set(name, new MockCache(this.origin));
                }
                return [2 /*return*/, this.caches.get(name)];
            });
        });
    };
    MockCacheStorage.prototype.match = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Array.from(this.caches.values())
                            .reduce(function (answer, cache) { return __awaiter(_this, void 0, void 0, function () {
                            var curr;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, answer];
                                    case 1:
                                        curr = _a.sent();
                                        if (curr !== undefined) {
                                            return [2 /*return*/, curr];
                                        }
                                        return [2 /*return*/, cache.match(req)];
                                }
                            });
                        }); }, Promise.resolve(undefined))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MockCacheStorage.prototype['delete'] = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.caches.has(name)) {
                    this.caches.delete(name);
                    return [2 /*return*/, true];
                }
                return [2 /*return*/, false];
            });
        });
    };
    MockCacheStorage.prototype.dehydrate = function () {
        var _this = this;
        var dehydrated = {};
        Array.from(this.caches.keys()).forEach(function (name) {
            var cache = _this.caches.get(name);
            dehydrated[name] = cache.dehydrate();
        });
        return JSON.stringify(dehydrated);
    };
    return MockCacheStorage;
}());
exports.MockCacheStorage = MockCacheStorage;
var MockCache = /** @class */ (function () {
    function MockCache(origin, hydrated) {
        var _this = this;
        this.origin = origin;
        this.cache = new Map();
        if (hydrated !== undefined) {
            Object.keys(hydrated).forEach(function (url) {
                var resp = hydrated[url];
                _this.cache.set(url, new fetch_1.MockResponse(resp.body, { status: resp.status, statusText: resp.statusText, headers: resp.headers }));
            });
        }
    }
    MockCache.prototype.add = function (request) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            throw 'Not implemented';
        }); });
    };
    MockCache.prototype.addAll = function (requests) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            throw 'Not implemented';
        }); });
    };
    MockCache.prototype['delete'] = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                url = (typeof request === 'string' ? request : request.url);
                if (this.cache.has(url)) {
                    this.cache.delete(url);
                    return [2 /*return*/, true];
                }
                return [2 /*return*/, false];
            });
        });
    };
    MockCache.prototype.keys = function (match) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (match !== undefined) {
                    throw 'Not implemented';
                }
                return [2 /*return*/, Array.from(this.cache.keys())];
            });
        });
    };
    MockCache.prototype.match = function (request, options) {
        return __awaiter(this, void 0, void 0, function () {
            var url, res;
            return __generator(this, function (_a) {
                url = (typeof request === 'string' ? request : request.url);
                if (url.startsWith(this.origin)) {
                    url = '/' + url.substr(this.origin.length);
                }
                res = this.cache.get(url);
                if (res !== undefined) {
                    res = res.clone();
                }
                return [2 /*return*/, res];
            });
        });
    };
    MockCache.prototype.matchAll = function (request, options) {
        return __awaiter(this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                if (request === undefined) {
                    return [2 /*return*/, Array.from(this.cache.values())];
                }
                url = (typeof request === 'string' ? request : request.url);
                if (this.cache.has(url)) {
                    return [2 /*return*/, [this.cache.get(url)]];
                }
                else {
                    return [2 /*return*/, []];
                }
                return [2 /*return*/];
            });
        });
    };
    MockCache.prototype.put = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = (typeof request === 'string' ? request : request.url);
                        this.cache.set(url, response.clone());
                        // Even though the body above is cloned, consume it here because the
                        // real cache consumes the body.
                        return [4 /*yield*/, response.text()];
                    case 1:
                        // Even though the body above is cloned, consume it here because the
                        // real cache consumes the body.
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MockCache.prototype.dehydrate = function () {
        var _this = this;
        var dehydrated = {};
        Array.from(this.cache.keys()).forEach(function (url) {
            var resp = _this.cache.get(url);
            var dehydratedResp = {
                body: resp._body,
                status: resp.status,
                statusText: resp.statusText,
                headers: {},
            };
            resp.headers.forEach(function (value, name) { dehydratedResp.headers[name] = value; });
            dehydrated[url] = dehydratedResp;
        });
        return dehydrated;
    };
    return MockCache;
}());
exports.MockCache = MockCache;
// This can be used to simulate a situation (bug?), where the user clears the caches from DevTools,
// while the SW is still running (e.g. serving another tab) and keeps references to the deleted
// caches.
function clearAllCaches(caches) {
    return __awaiter(this, void 0, void 0, function () {
        var cacheNames, cacheInstances;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, caches.keys()];
                case 1:
                    cacheNames = _a.sent();
                    return [4 /*yield*/, Promise.all(cacheNames.map(function (name) { return caches.open(name); }))];
                case 2:
                    cacheInstances = _a.sent();
                    // Delete all cache instances from `CacheStorage`.
                    return [4 /*yield*/, Promise.all(cacheNames.map(function (name) { return caches.delete(name); }))];
                case 3:
                    // Delete all cache instances from `CacheStorage`.
                    _a.sent();
                    // Delete all entries from each cache instance.
                    return [4 /*yield*/, Promise.all(cacheInstances.map(function (cache) { return __awaiter(_this, void 0, void 0, function () {
                            var keys;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, cache.keys()];
                                    case 1:
                                        keys = _a.sent();
                                        return [4 /*yield*/, Promise.all(keys.map(function (key) { return cache.delete(key); }))];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 4:
                    // Delete all entries from each cache instance.
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.clearAllCaches = clearAllCaches;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9zZXJ2aWNlLXdvcmtlci93b3JrZXIvdGVzdGluZy9jYWNoZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsaUNBQWtEO0FBZ0JsRDtJQUdFLDBCQUFvQixNQUFjLEVBQUUsV0FBb0I7UUFBeEQsaUJBTUM7UUFObUIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUYxQixXQUFNLEdBQUcsSUFBSSxHQUFHLEVBQXFCLENBQUM7UUFHNUMsSUFBSSxXQUFXLEtBQUssU0FBUyxFQUFFO1lBQzdCLElBQU0sVUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUEyQixDQUFDO1lBQ25FLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBUSxDQUFDLENBQUMsT0FBTyxDQUN6QixVQUFBLElBQUksSUFBTSxLQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxTQUFTLENBQUMsS0FBSSxDQUFDLE1BQU0sRUFBRSxVQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDckY7SUFDSCxDQUFDO0lBRUssOEJBQUcsR0FBVCxVQUFVLElBQVk7O1lBQXNCLHNCQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFDOztLQUFFO0lBRXJFLCtCQUFJLEdBQVY7O1lBQWtDLHNCQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFDOztLQUFFO0lBRXBFLCtCQUFJLEdBQVYsVUFBVyxJQUFZOzs7Z0JBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFB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