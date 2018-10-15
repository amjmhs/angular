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
var db_cache_1 = require("../src/db-cache");
var driver_1 = require("../src/driver");
var fetch_1 = require("../testing/fetch");
var mock_1 = require("../testing/mock");
var scope_1 = require("../testing/scope");
var async_1 = require("./async");
var dist = new mock_1.MockFileSystemBuilder()
    .addFile('/foo.txt', 'this is foo')
    .addFile('/bar.txt', 'this is bar')
    .addFile('/api/test', 'version 1')
    .addFile('/api/a', 'version A')
    .addFile('/api/b', 'version B')
    .addFile('/api/c', 'version C')
    .addFile('/api/d', 'version D')
    .addFile('/api/e', 'version E')
    .addFile('/fresh/data', 'this is fresh data')
    .addFile('/refresh/data', 'this is some data')
    .build();
var distUpdate = new mock_1.MockFileSystemBuilder()
    .addFile('/foo.txt', 'this is foo v2')
    .addFile('/bar.txt', 'this is bar')
    .addFile('/api/test', 'version 2')
    .addFile('/fresh/data', 'this is fresher data')
    .addFile('/refresh/data', 'this is refreshed data')
    .build();
var manifest = {
    configVersion: 1,
    index: '/index.html',
    assetGroups: [
        {
            name: 'assets',
            installMode: 'prefetch',
            updateMode: 'prefetch',
            urls: [
                '/foo.txt',
                '/bar.txt',
            ],
            patterns: [],
        },
    ],
    dataGroups: [
        {
            name: 'testPerf',
            maxSize: 3,
            strategy: 'performance',
            patterns: ['^/api/.*$'],
            timeoutMs: 1000,
            maxAge: 5000,
            version: 1,
        },
        {
            name: 'testRefresh',
            maxSize: 3,
            strategy: 'performance',
            patterns: ['^/refresh/.*$'],
            timeoutMs: 1000,
            refreshAheadMs: 1000,
            maxAge: 5000,
            version: 1,
        },
        {
            name: 'testFresh',
            maxSize: 3,
            strategy: 'freshness',
            patterns: ['^/fresh/.*$'],
            timeoutMs: 1000,
            maxAge: 5000,
            version: 1,
        },
    ],
    navigationUrls: [],
    hashTable: mock_1.tmpHashTableForFs(dist),
};
var seqIncreasedManifest = __assign({}, manifest, { dataGroups: [
        __assign({}, manifest.dataGroups[0], { version: 2 }),
        manifest.dataGroups[1],
        manifest.dataGroups[2],
    ] });
var server = new mock_1.MockServerStateBuilder().withStaticFiles(dist).withManifest(manifest).build();
var serverUpdate = new mock_1.MockServerStateBuilder().withStaticFiles(distUpdate).withManifest(manifest).build();
var serverSeqUpdate = new mock_1.MockServerStateBuilder()
    .withStaticFiles(distUpdate)
    .withManifest(seqIncreasedManifest)
    .build();
var scope = new scope_1.SwTestHarnessBuilder().withServerState(server).build();
function asyncWrap(fn) {
    return function (done) { fn().then(function () { return done(); }, function (err) { return done.fail(err); }); };
}
(function () {
    var _this = this;
    // Skip environments that don't support the minimum APIs needed to run the SW tests.
    if (!scope_1.SwTestHarness.envIsSupported()) {
        return;
    }
    describe('data cache', function () {
        var scope;
        var driver;
        async_1.async_beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        server.clearRequests();
                        scope = new scope_1.SwTestHarnessBuilder().withServerState(server).build();
                        driver = new driver_1.Driver(scope, scope, new db_cache_1.CacheDatabase(scope, scope));
                        // Initialize.
                        _a = expect;
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                    case 1:
                        // Initialize.
                        _a.apply(void 0, [_b.sent()]).toEqual('this is foo');
                        return [4 /*yield*/, driver.initialized];
                    case 2:
                        _b.sent();
                        server.reset();
                        serverUpdate.reset();
                        return [2 /*return*/];
                }
            });
        }); });
        describe('in performance mode', function () {
            async_1.async_it('names the caches correctly', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, keys;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, makeRequest(scope, '/api/test')];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).toEqual('version 1');
                            return [4 /*yield*/, scope.caches.keys()];
                        case 2:
                            keys = _b.sent();
                            expect(keys.every(function (key) { return key.startsWith('ngsw:'); })).toEqual(true);
                            return [2 /*return*/];
                    }
                });
            }); });
            async_1.async_it('caches a basic request', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, makeRequest(scope, '/api/test')];
                        case 1:
                            _a.apply(void 0, [_c.sent()]).toEqual('version 1');
                            server.assertSawRequestFor('/api/test');
                            scope.advance(1000);
                            _b = expect;
                            return [4 /*yield*/, makeRequest(scope, '/api/test')];
                        case 2:
                            _b.apply(void 0, [_c.sent()]).toEqual('version 1');
                            server.assertNoOtherRequests();
                            return [2 /*return*/];
                    }
                });
            }); });
            async_1.async_it('refreshes after awhile', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, makeRequest(scope, '/api/test')];
                        case 1:
                            _a.apply(void 0, [_c.sent()]).toEqual('version 1');
                            server.clearRequests();
                            scope.advance(10000);
                            scope.updateServerState(serverUpdate);
                            _b = expect;
                            return [4 /*yield*/, makeRequest(scope, '/api/test')];
                        case 2:
                            _b.apply(void 0, [_c.sent()]).toEqual('version 2');
                            return [2 /*return*/];
                    }
                });
            }); });
            async_1.async_it('expires the least recently used entry', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                return __generator(this, function (_l) {
                    switch (_l.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, makeRequest(scope, '/api/a')];
                        case 1:
                            _a.apply(void 0, [_l.sent()]).toEqual('version A');
                            _b = expect;
                            return [4 /*yield*/, makeRequest(scope, '/api/b')];
                        case 2:
                            _b.apply(void 0, [_l.sent()]).toEqual('version B');
                            _c = expect;
                            return [4 /*yield*/, makeRequest(scope, '/api/c')];
                        case 3:
                            _c.apply(void 0, [_l.sent()]).toEqual('version C');
                            _d = expect;
                            return [4 /*yield*/, makeRequest(scope, '/api/d')];
                        case 4:
                            _d.apply(void 0, [_l.sent()]).toEqual('version D');
                            _e = expect;
                            return [4 /*yield*/, makeRequest(scope, '/api/e')];
                        case 5:
                            _e.apply(void 0, [_l.sent()]).toEqual('version E');
                            server.clearRequests();
                            _f = expect;
                            return [4 /*yield*/, makeRequest(scope, '/api/c')];
                        case 6:
                            _f.apply(void 0, [_l.sent()]).toEqual('version C');
                            _g = expect;
                            return [4 /*yield*/, makeRequest(scope, '/api/d')];
                        case 7:
                            _g.apply(void 0, [_l.sent()]).toEqual('version D');
                            _h = expect;
                            return [4 /*yield*/, makeRequest(scope, '/api/e')];
                        case 8:
                            _h.apply(void 0, [_l.sent()]).toEqual('version E');
                            server.assertNoOtherRequests();
                            _j = expect;
                            return [4 /*yield*/, makeRequest(scope, '/api/a')];
                        case 9:
                            _j.apply(void 0, [_l.sent()]).toEqual('version A');
                            _k = expect;
                            return [4 /*yield*/, makeRequest(scope, '/api/b')];
                        case 10:
                            _k.apply(void 0, [_l.sent()]).toEqual('version B');
                            server.assertSawRequestFor('/api/a');
                            server.assertSawRequestFor('/api/b');
                            server.assertNoOtherRequests();
                            return [2 /*return*/];
                    }
                });
            }); });
            async_1.async_it('does not carry over cache with new version', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, makeRequest(scope, '/api/test')];
                        case 1:
                            _a.apply(void 0, [_f.sent()]).toEqual('version 1');
                            scope.updateServerState(serverSeqUpdate);
                            _b = expect;
                            return [4 /*yield*/, driver.checkForUpdate()];
                        case 2:
                            _b.apply(void 0, [_f.sent()]).toEqual(true);
                            _d = (_c = driver).updateClient;
                            return [4 /*yield*/, scope.clients.get('default')];
                        case 3: return [4 /*yield*/, _d.apply(_c, [_f.sent()])];
                        case 4:
                            _f.sent();
                            _e = expect;
                            return [4 /*yield*/, makeRequest(scope, '/api/test')];
                        case 5:
                            _e.apply(void 0, [_f.sent()]).toEqual('version 2');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('in freshness mode', function () {
            async_1.async_it('goes to the server first', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, makeRequest(scope, '/fresh/data')];
                        case 1:
                            _a.apply(void 0, [_d.sent()]).toEqual('this is fresh data');
                            server.assertSawRequestFor('/fresh/data');
                            server.clearRequests();
                            _b = expect;
                            return [4 /*yield*/, makeRequest(scope, '/fresh/data')];
                        case 2:
                            _b.apply(void 0, [_d.sent()]).toEqual('this is fresh data');
                            server.assertSawRequestFor('/fresh/data');
                            server.assertNoOtherRequests();
                            scope.updateServerState(serverUpdate);
                            _c = expect;
                            return [4 /*yield*/, makeRequest(scope, '/fresh/data')];
                        case 3:
                            _c.apply(void 0, [_d.sent()]).toEqual('this is fresher data');
                            serverUpdate.assertSawRequestFor('/fresh/data');
                            serverUpdate.assertNoOtherRequests();
                            return [2 /*return*/];
                    }
                });
            }); });
            async_1.async_it('falls back on the cache when server times out', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, res, done, _c, _d, res2, done2, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, makeRequest(scope, '/fresh/data')];
                        case 1:
                            _a.apply(void 0, [_f.sent()]).toEqual('this is fresh data');
                            server.assertSawRequestFor('/fresh/data');
                            server.clearRequests();
                            scope.updateServerState(serverUpdate);
                            serverUpdate.pause();
                            _b = makePendingRequest(scope, '/fresh/data'), res = _b[0], done = _b[1];
                            return [4 /*yield*/, serverUpdate.nextRequest];
                        case 2:
                            _f.sent();
                            // Since the network request doesn't return within the timeout of 1,000ms,
                            // this should return cached data.
                            scope.advance(2000);
                            _c = expect;
                            return [4 /*yield*/, res];
                        case 3:
                            _c.apply(void 0, [_f.sent()]).toEqual('this is fresh data');
                            // Unpausing allows the worker to continue with caching.
                            serverUpdate.unpause();
                            return [4 /*yield*/, done];
                        case 4:
                            _f.sent();
                            serverUpdate.pause();
                            _d = makePendingRequest(scope, '/fresh/data'), res2 = _d[0], done2 = _d[1];
                            return [4 /*yield*/, serverUpdate.nextRequest];
                        case 5:
                            _f.sent();
                            scope.advance(2000);
                            _e = expect;
                            return [4 /*yield*/, res2];
                        case 6:
                            _e.apply(void 0, [_f.sent()]).toEqual('this is fresher data');
                            return [2 /*return*/];
                    }
                });
            }); });
            async_1.async_it('refreshes ahead', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            server.assertNoOtherRequests();
                            serverUpdate.assertNoOtherRequests();
                            _a = expect;
                            return [4 /*yield*/, makeRequest(scope, '/refresh/data')];
                        case 1:
                            _a.apply(void 0, [_e.sent()]).toEqual('this is some data');
                            server.assertSawRequestFor('/refresh/data');
                            server.clearRequests();
                            _b = expect;
                            return [4 /*yield*/, makeRequest(scope, '/refresh/data')];
                        case 2:
                            _b.apply(void 0, [_e.sent()]).toEqual('this is some data');
                            server.assertNoOtherRequests();
                            scope.updateServerState(serverUpdate);
                            scope.advance(1500);
                            _c = expect;
                            return [4 /*yield*/, makeRequest(scope, '/refresh/data')];
                        case 3:
                            _c.apply(void 0, [_e.sent()]).toEqual('this is some data');
                            serverUpdate.assertSawRequestFor('/refresh/data');
                            _d = expect;
                            return [4 /*yield*/, makeRequest(scope, '/refresh/data')];
                        case 4:
                            _d.apply(void 0, [_e.sent()]).toEqual('this is refreshed data');
                            serverUpdate.assertNoOtherRequests();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
})();
function makeRequest(scope, url, clientId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, resPromise, done, res;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = scope.handleFetch(new fetch_1.MockRequest(url), clientId || 'default'), resPromise = _a[0], done = _a[1];
                    return [4 /*yield*/, done];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, resPromise];
                case 2:
                    res = _b.sent();
                    if (res !== undefined) {
                        return [2 /*return*/, res.text()];
                    }
                    return [2 /*return*/, null];
            }
        });
    });
}
function makePendingRequest(scope, url, clientId) {
    var _this = this;
    var _a = scope.handleFetch(new fetch_1.MockRequest(url), clientId || 'default'), resPromise = _a[0], done = _a[1];
    return [
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, resPromise];
                    case 1:
                        res = _a.sent();
                        if (res !== undefined) {
                            return [2 /*return*/, res.text()];
                        }
                        return [2 /*return*/, null];
                }
            });
        }); })(),
        done
    ];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvd29ya2VyL3Rlc3QvZGF0YV9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILDRDQUE4QztBQUM5Qyx3Q0FBcUM7QUFFckMsMENBQTZDO0FBQzdDLHdDQUFpRztBQUNqRywwQ0FBcUU7QUFFckUsaUNBQThEO0FBRTlELElBQU0sSUFBSSxHQUFHLElBQUksNEJBQXFCLEVBQUU7S0FDdEIsT0FBTyxDQUFDLFVBQVUsRUFBRSxhQUFhLENBQUM7S0FDbEMsT0FBTyxDQUFDLFVBQVUsRUFBRSxhQUFhLENBQUM7S0FDbEMsT0FBTyxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUM7S0FDakMsT0FBTyxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUM7S0FDOUIsT0FBTyxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUM7S0FDOUIsT0FBTyxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUM7S0FDOUIsT0FBTyxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUM7S0FDOUIsT0FBTyxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUM7S0FDOUIsT0FBTyxDQUFDLGFBQWEsRUFBRSxvQkFBb0IsQ0FBQztLQUM1QyxPQUFPLENBQUMsZUFBZSxFQUFFLG1CQUFtQixDQUFDO0tBQzdDLEtBQUssRUFBRSxDQUFDO0FBRzFCLElBQU0sVUFBVSxHQUFHLElBQUksNEJBQXFCLEVBQUU7S0FDdEIsT0FBTyxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQztLQUNyQyxPQUFPLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQztLQUNsQyxPQUFPLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQztLQUNqQyxPQUFPLENBQUMsYUFBYSxFQUFFLHNCQUFzQixDQUFDO0tBQzlDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsd0JBQXdCLENBQUM7S0FDbEQsS0FBSyxFQUFFLENBQUM7QUFFaEMsSUFBTSxRQUFRLEdBQWE7SUFDekIsYUFBYSxFQUFFLENBQUM7SUFDaEIsS0FBSyxFQUFFLGFBQWE7SUFDcEIsV0FBVyxFQUFFO1FBQ1g7WUFDRSxJQUFJLEVBQUUsUUFBUTtZQUNkLFdBQVcsRUFBRSxVQUFVO1lBQ3ZCLFVBQVUsRUFBRSxVQUFVO1lBQ3RCLElBQUksRUFBRTtnQkFDSixVQUFVO2dCQUNWLFVBQVU7YUFDWDtZQUNELFFBQVEsRUFBRSxFQUFFO1NBQ2I7S0FDRjtJQUNELFVBQVUsRUFBRTtRQUNWO1lBQ0UsSUFBSSxFQUFFLFVBQVU7WUFDaEIsT0FBTyxFQUFFLENBQUM7WUFDVixRQUFRLEVBQUUsYUFBYTtZQUN2QixRQUFRLEVBQUUsQ0FBQyxXQUFXLENBQUM7WUFDdkIsU0FBUyxFQUFFLElBQUk7WUFDZixNQUFNLEVBQUUsSUFBSTtZQUNaLE9BQU8sRUFBRSxDQUFDO1NBQ1g7UUFDRDtZQUNFLElBQUksRUFBRSxhQUFhO1lBQ25CLE9BQU8sRUFBRSxDQUFDO1lBQ1YsUUFBUSxFQUFFLGFBQWE7WUFDdkIsUUFBUSxFQUFFLENBQUMsZUFBZSxDQUFDO1lBQzNCLFNBQVMsRUFBRSxJQUFJO1lBQ2YsY0FBYyxFQUFFLElBQUk7WUFDcEIsTUFBTSxFQUFFLElBQUk7WUFDWixPQUFPLEVBQUUsQ0FBQztTQUNYO1FBQ0Q7WUFDRSxJQUFJLEVBQUUsV0FBVztZQUNqQixPQUFPLEVBQUUsQ0FBQztZQUNWLFFBQVEsRUFBRSxXQUFXO1lBQ3JCLFFBQVEsRUFBRSxDQUFDLGFBQWEsQ0FBQztZQUN6QixTQUFTLEVBQUUsSUFBSTtZQUNmLE1BQU0sRUFBRSxJQUFJO1lBQ1osT0FBTyxFQUFFLENBQUM7U0FDWDtLQUNGO0lBQ0QsY0FBYyxFQUFFLEVBQUU7SUFDbEIsU0FBUyxFQUFFLHdCQUFpQixDQUFDLElBQUksQ0FBQztDQUNuQyxDQUFDO0FBRUYsSUFBTSxvQkFBb0IsZ0JBQ3JCLFFBQVEsSUFDWCxVQUFVLEVBQUU7cUJBRUwsUUFBUSxDQUFDLFVBQVksQ0FBQyxDQUFDLENBQUMsSUFDM0IsT0FBTyxFQUFFLENBQUM7UUFFWixRQUFRLENBQUMsVUFBWSxDQUFDLENBQUMsQ0FBQztRQUN4QixRQUFRLENBQUMsVUFBWSxDQUFDLENBQUMsQ0FBQztLQUN6QixHQUNGLENBQUM7QUFHRixJQUFNLE1BQU0sR0FBRyxJQUFJLDZCQUFzQixFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUVqRyxJQUFNLFlBQVksR0FDZCxJQUFJLDZCQUFzQixFQUFFLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUU1RixJQUFNLGVBQWUsR0FBRyxJQUFJLDZCQUFzQixFQUFFO0tBQ3ZCLGVBQWUsQ0FBQyxVQUFVLENBQUM7S0FDM0IsWUFBWSxDQUFDLG9CQUFvQixDQUFDO0tBQ2xDLEtBQUssRUFBRSxDQUFDO0FBRXJDLElBQU0sS0FBSyxHQUFHLElBQUksNEJBQW9CLEVBQUUsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7QUFFekUsbUJBQW1CLEVBQXVCO0lBQ3hDLE9BQU8sVUFBQyxJQUFZLElBQU8sRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQU0sT0FBQSxJQUFJLEVBQUUsRUFBTixDQUFNLEVBQUUsVUFBQSxHQUFHLElBQUksT0FBQSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFkLENBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9FLENBQUM7QUFFRCxDQUFDO0lBQUEsaUJBZ0lBO0lBL0hDLG9GQUFvRjtJQUNwRixJQUFJLENBQUMscUJBQWEsQ0FBQyxjQUFjLEVBQUUsRUFBRTtRQUNuQyxPQUFPO0tBQ1I7SUFDRCxRQUFRLENBQUMsWUFBWSxFQUFFO1FBQ3JCLElBQUksS0FBb0IsQ0FBQztRQUN6QixJQUFJLE1BQWMsQ0FBQztRQUNuQix3QkFBZ0IsQ0FBQzs7Ozs7d0JBQ2YsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDO3dCQUN2QixLQUFLLEdBQUcsSUFBSSw0QkFBb0IsRUFBRSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDbkUsTUFBTSxHQUFHLElBQUksZUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSx3QkFBYSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO3dCQUVuRSxjQUFjO3dCQUNkLEtBQUEsTUFBTSxDQUFBO3dCQUFDLHFCQUFNLFdBQVcsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLEVBQUE7O3dCQUQzQyxjQUFjO3dCQUNkLGtCQUFPLFNBQW9DLEVBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7d0JBQ3BFLHFCQUFNLE1BQU0sQ0FBQyxXQUFXLEVBQUE7O3dCQUF4QixTQUF3QixDQUFDO3dCQUN6QixNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7d0JBQ2YsWUFBWSxDQUFDLEtBQUssRUFBRSxDQUFDOzs7O2FBQ3RCLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtZQUM5QixnQkFBUSxDQUFDLDRCQUE0QixFQUFFOzs7Ozs0QkFDckMsS0FBQSxNQUFNLENBQUE7NEJBQUMscUJBQU0sV0FBVyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsRUFBQTs7NEJBQTVDLGtCQUFPLFNBQXFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7NEJBQ3RELHFCQUFNLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUE7OzRCQUFoQyxJQUFJLEdBQUcsU0FBeUI7NEJBQ3RDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBdkIsQ0FBdUIsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDOzs7O2lCQUNsRSxDQUFDLENBQUM7WUFFSCxnQkFBUSxDQUFDLHdCQUF3QixFQUFFOzs7Ozs0QkFDakMsS0FBQSxNQUFNLENBQUE7NEJBQUMscUJBQU0sV0FBVyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsRUFBQTs7NEJBQTVDLGtCQUFPLFNBQXFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7NEJBQ25FLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLENBQUMsQ0FBQzs0QkFDeEMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFDcEIsS0FBQSxNQUFNLENBQUE7NEJBQUMscUJBQU0sV0FBVyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsRUFBQTs7NEJBQTVDLGtCQUFPLFNBQXFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7NEJBQ25FLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDOzs7O2lCQUNoQyxDQUFDLENBQUM7WUFFSCxnQkFBUSxDQUFDLHdCQUF3QixFQUFFOzs7Ozs0QkFDakMsS0FBQSxNQUFNLENBQUE7NEJBQUMscUJBQU0sV0FBVyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsRUFBQTs7NEJBQTVDLGtCQUFPLFNBQXFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7NEJBQ25FLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQzs0QkFDdkIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQzs0QkFDckIsS0FBSyxDQUFDLGlCQUFpQixDQUFDLFlBQVksQ0FBQyxDQUFDOzRCQUN0QyxLQUFBLE1BQU0sQ0FBQTs0QkFBQyxxQkFBTSxXQUFXLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxFQUFBOzs0QkFBNUMsa0JBQU8sU0FBcUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQzs7OztpQkFDcEUsQ0FBQyxDQUFDO1lBRUgsZ0JBQVEsQ0FBQyx1Q0FBdUMsRUFBRTs7Ozs7NEJBQ2hELEtBQUEsTUFBTSxDQUFBOzRCQUFDLHFCQUFNLFdBQVcsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEVBQUE7OzRCQUF6QyxrQkFBTyxTQUFrQyxFQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDOzRCQUNoRSxLQUFBLE1BQU0sQ0FBQTs0QkFBQyxxQkFBTSxXQUFXLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxFQUFBOzs0QkFBekMsa0JBQU8sU0FBa0MsRUFBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQzs0QkFDaEUsS0FBQSxNQUFNLENBQUE7NEJBQUMscUJBQU0sV0FBVyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsRUFBQTs7NEJBQXpDLGtCQUFPLFNBQWtDLEVBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7NEJBQ2hFLEtBQUEsTUFBTSxDQUFBOzRCQUFDLHFCQUFNLFdBQVcsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEVBQUE7OzRCQUF6QyxrQkFBTyxTQUFrQyxFQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDOzRCQUNoRSxLQUFBLE1BQU0sQ0FBQTs0QkFBQyxxQkFBTSxXQUFXLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxFQUFBOzs0QkFBekMsa0JBQU8sU0FBa0MsRUFBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQzs0QkFDaEUsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDOzRCQUN2QixLQUFBLE1BQU0sQ0FBQTs0QkFBQyxxQkFBTSxXQUFXLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxFQUFBOzs0QkFBekMsa0JBQU8sU0FBa0MsRUFBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQzs0QkFDaEUsS0FBQSxNQUFNLENBQUE7NEJBQUMscUJBQU0sV0FBVyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsRUFBQTs7NEJBQXpDLGtCQUFPLFNBQWtDLEVBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7NEJBQ2hFLEtBQUEsTUFBTSxDQUFBOzRCQUFDLHFCQUFNLFdBQVcsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEVBQUE7OzRCQUF6QyxrQkFBTyxTQUFrQyxFQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDOzRCQUNoRSxNQUFNLENBQUMscUJBQXFCLEVBQUUsQ0FBQzs0QkFDL0IsS0FBQSxNQUFNLENBQUE7NEJBQUMscUJBQU0sV0FBVyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsRUFBQTs7NEJBQXpDLGtCQUFPLFNBQWtDLEVBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7NEJBQ2hFLEtBQUEsTUFBTSxDQUFBOzRCQUFDLHFCQUFNLFdBQVcsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEVBQUE7OzRCQUF6QyxrQkFBTyxTQUFrQyxFQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDOzRCQUNoRSxNQUFNLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUM7NEJBQ3JDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQzs0QkFDckMsTUFBTSxDQUFDLHFCQUFxQixFQUFFLENBQUM7Ozs7aUJBQ2hDLENBQUMsQ0FBQztZQUVILGdCQUFRLENBQUMsNENBQTRDLEVBQUU7Ozs7OzRCQUNyRCxLQUFBLE1BQU0sQ0FBQTs0QkFBQyxxQkFBTSxXQUFXLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxFQUFBOzs0QkFBNUMsa0JBQU8sU0FBcUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQzs0QkFDbkUsS0FBSyxDQUFDLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxDQUFDOzRCQUN6QyxLQUFBLE1BQU0sQ0FBQTs0QkFBQyxxQkFBTSxNQUFNLENBQUMsY0FBYyxFQUFFLEVBQUE7OzRCQUFwQyxrQkFBTyxTQUE2QixFQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUM5QyxLQUFBLENBQUEsS0FBQSxNQUFNLENBQUEsQ0FBQyxZQUFZLENBQUE7NEJBQUMscUJBQU0sS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUE7Z0NBQTVELHFCQUFNLGNBQW9CLFNBQWtDLEVBQUMsRUFBQTs7NEJBQTdELFNBQTZELENBQUM7NEJBQzlELEtBQUEsTUFBTSxDQUFBOzRCQUFDLHFCQUFNLFdBQVcsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLEVBQUE7OzRCQUE1QyxrQkFBTyxTQUFxQyxFQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDOzs7O2lCQUNwRSxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxtQkFBbUIsRUFBRTtZQUM1QixnQkFBUSxDQUFDLDBCQUEwQixFQUFFOzs7Ozs0QkFDbkMsS0FBQSxNQUFNLENBQUE7NEJBQUMscUJBQU0sV0FBVyxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsRUFBQTs7NEJBQTlDLGtCQUFPLFNBQXVDLEVBQUMsQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQzs0QkFDOUUsTUFBTSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxDQUFDOzRCQUMxQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7NEJBQ3ZCLEtBQUEsTUFBTSxDQUFBOzRCQUFDLHFCQUFNLFdBQVcsQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLEVBQUE7OzRCQUE5QyxrQkFBTyxTQUF1QyxFQUFDLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7NEJBQzlFLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLENBQUMsQ0FBQzs0QkFDMUMsTUFBTSxDQUFDLHFCQUFxQixFQUFFLENBQUM7NEJBQy9CLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsQ0FBQzs0QkFDdEMsS0FBQSxNQUFNLENBQUE7NEJBQUMscUJBQU0sV0FBVyxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsRUFBQTs7NEJBQTlDLGtCQUFPLFNBQXVDLEVBQUMsQ0FBQyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQzs0QkFDaEYsWUFBWSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxDQUFDOzRCQUNoRCxZQUFZLENBQUMscUJBQXFCLEVBQUUsQ0FBQzs7OztpQkFDdEMsQ0FBQyxDQUFDO1lBRUgsZ0JBQVEsQ0FBQywrQ0FBK0MsRUFBRTs7Ozs7NEJBQ3hELEtBQUEsTUFBTSxDQUFBOzRCQUFDLHFCQUFNLFdBQVcsQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLEVBQUE7OzRCQUE5QyxrQkFBTyxTQUF1QyxFQUFDLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7NEJBQzlFLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLENBQUMsQ0FBQzs0QkFDMUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDOzRCQUN2QixLQUFLLENBQUMsaUJBQWlCLENBQUMsWUFBWSxDQUFDLENBQUM7NEJBQ3RDLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQzs0QkFDZixLQUFjLGtCQUFrQixDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsRUFBckQsR0FBRyxRQUFBLEVBQUUsSUFBSSxRQUFBLENBQTZDOzRCQUU3RCxxQkFBTSxZQUFZLENBQUMsV0FBVyxFQUFBOzs0QkFBOUIsU0FBOEIsQ0FBQzs0QkFFL0IsMEVBQTBFOzRCQUMxRSxrQ0FBa0M7NEJBQ2xDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7NEJBRXBCLEtBQUEsTUFBTSxDQUFBOzRCQUFDLHFCQUFNLEdBQUcsRUFBQTs7NEJBQWhCLGtCQUFPLFNBQVMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDOzRCQUVoRCx3REFBd0Q7NEJBQ3hELFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQzs0QkFDdkIscUJBQU0sSUFBSSxFQUFBOzs0QkFBVixTQUFVLENBQUM7NEJBRVgsWUFBWSxDQUFDLEtBQUssRUFBRSxDQUFDOzRCQUNmLEtBQWdCLGtCQUFrQixDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsRUFBdkQsSUFBSSxRQUFBLEVBQUUsS0FBSyxRQUFBLENBQTZDOzRCQUMvRCxxQkFBTSxZQUFZLENBQUMsV0FBVyxFQUFBOzs0QkFBOUIsU0FBOEIsQ0FBQzs0QkFDL0IsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFDcEIsS0FBQSxNQUFNLENBQUE7NEJBQUMscUJBQU0sSUFBSSxFQUFBOzs0QkFBakIsa0JBQU8sU0FBVSxFQUFDLENBQUMsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUM7Ozs7aUJBQ3BELENBQUMsQ0FBQztZQUVILGdCQUFRLENBQUMsaUJBQWlCLEVBQUU7Ozs7OzRCQUMxQixNQUFNLENBQUMscUJBQXFCLEVBQUUsQ0FBQzs0QkFDL0IsWUFBWSxDQUFDLHFCQUFxQixFQUFFLENBQUM7NEJBQ3JDLEtBQUEsTUFBTSxDQUFBOzRCQUFDLHFCQUFNLFdBQVcsQ0FBQyxLQUFLLEVBQUUsZUFBZSxDQUFDLEVBQUE7OzRCQUFoRCxrQkFBTyxTQUF5QyxFQUFDLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7NEJBQy9FLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsQ0FBQzs0QkFDNUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDOzRCQUN2QixLQUFBLE1BQU0sQ0FBQTs0QkFBQyxxQkFBTSxXQUFXLENBQUMsS0FBSyxFQUFFLGVBQWUsQ0FBQyxFQUFBOzs0QkFBaEQsa0JBQU8sU0FBeUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOzRCQUMvRSxNQUFNLENBQUMscUJBQXFCLEVBQUUsQ0FBQzs0QkFDL0IsS0FBSyxDQUFDLGlCQUFpQixDQUFDLFlBQVksQ0FBQyxDQUFDOzRCQUN0QyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUNwQixLQUFBLE1BQU0sQ0FBQTs0QkFBQyxxQkFBTSxXQUFXLENBQUMsS0FBSyxFQUFFLGVBQWUsQ0FBQyxFQUFBOzs0QkFBaEQsa0JBQU8sU0FBeUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOzRCQUMvRSxZQUFZLENBQUMsbUJBQW1CLENBQUMsZUFBZSxDQUFDLENBQUM7NEJBQ2xELEtBQUEsTUFBTSxDQUFBOzRCQUFDLHFCQUFNLFdBQVcsQ0FBQyxLQUFLLEVBQUUsZUFBZSxDQUFDLEVBQUE7OzRCQUFoRCxrQkFBTyxTQUF5QyxFQUFDLENBQUMsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUM7NEJBQ3BGLFlBQVksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDOzs7O2lCQUN0QyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUVMLHFCQUEyQixLQUFvQixFQUFFLEdBQVcsRUFBRSxRQUFpQjs7Ozs7O29CQUVuRSxLQUFxQixLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksbUJBQVcsQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLElBQUksU0FBUyxDQUFDLEVBQWxGLFVBQVUsUUFBQSxFQUFFLElBQUksUUFBQSxDQUFtRTtvQkFDMUYscUJBQU0sSUFBSSxFQUFBOztvQkFBVixTQUFVLENBQUM7b0JBQ0MscUJBQU0sVUFBVSxFQUFBOztvQkFBdEIsR0FBRyxHQUFHLFNBQWdCO29CQUM1QixJQUFJLEdBQUcsS0FBSyxTQUFTLEVBQUU7d0JBQ3JCLHNCQUFPLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBQztxQkFDbkI7b0JBQ0Qsc0JBQU8sSUFBSSxFQUFDOzs7O0NBQ2I7QUFFTCw0QkFBNEIsS0FBb0IsRUFBRSxHQUFXLEVBQUUsUUFBaUI7SUFBaEYsaUJBYUs7SUFYTyxJQUFBLDJFQUFtRixFQUFsRixrQkFBVSxFQUFFLFlBQUksQ0FBbUU7SUFDMUYsT0FBTztRQUNMLENBQUM7Ozs7NEJBQ2EscUJBQU0sVUFBVSxFQUFBOzt3QkFBdEIsR0FBRyxHQUFHLFNBQWdCO3dCQUM1QixJQUFJLEdBQUcsS0FBSyxTQUFTLEVBQUU7NEJBQ3JCLHNCQUFPLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBQzt5QkFDbkI7d0JBQ0Qsc0JBQU8sSUFBSSxFQUFDOzs7YUFDYixDQUFDLEVBQUU7UUFDSixJQUFJO0tBQ0wsQ0FBQztBQUNKLENBQUMifQ==