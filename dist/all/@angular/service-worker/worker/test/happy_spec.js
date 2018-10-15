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
var generator_1 = require("../../config/src/generator");
var db_cache_1 = require("../src/db-cache");
var driver_1 = require("../src/driver");
var sha1_1 = require("../src/sha1");
var cache_1 = require("../testing/cache");
var fetch_1 = require("../testing/fetch");
var mock_1 = require("../testing/mock");
var scope_1 = require("../testing/scope");
var async_1 = require("./async");
var dist = new mock_1.MockFileSystemBuilder()
    .addFile('/foo.txt', 'this is foo')
    .addFile('/bar.txt', 'this is bar')
    .addFile('/baz.txt', 'this is baz')
    .addFile('/qux.txt', 'this is qux')
    .addFile('/quux.txt', 'this is quux')
    .addFile('/quuux.txt', 'this is quuux')
    .addFile('/lazy/unchanged1.txt', 'this is unchanged (1)')
    .addFile('/lazy/unchanged2.txt', 'this is unchanged (2)')
    .addUnhashedFile('/unhashed/a.txt', 'this is unhashed', { 'Cache-Control': 'max-age=10' })
    .addUnhashedFile('/unhashed/b.txt', 'this is unhashed b', { 'Cache-Control': 'no-cache' })
    .build();
var distUpdate = new mock_1.MockFileSystemBuilder()
    .addFile('/foo.txt', 'this is foo v2')
    .addFile('/bar.txt', 'this is bar')
    .addFile('/baz.txt', 'this is baz v2')
    .addFile('/qux.txt', 'this is qux v2')
    .addFile('/quux.txt', 'this is quux v2')
    .addFile('/quuux.txt', 'this is quuux v2')
    .addFile('/lazy/unchanged1.txt', 'this is unchanged (1)')
    .addFile('/lazy/unchanged2.txt', 'this is unchanged (2)')
    .addUnhashedFile('/unhashed/a.txt', 'this is unhashed v2', { 'Cache-Control': 'max-age=10' })
    .addUnhashedFile('/ignored/file1', 'this is not handled by the SW')
    .addUnhashedFile('/ignored/dir/file2', 'this is not handled by the SW either')
    .build();
var brokenFs = new mock_1.MockFileSystemBuilder().addFile('/foo.txt', 'this is foo').build();
var brokenManifest = {
    configVersion: 1,
    index: '/foo.txt',
    assetGroups: [{
            name: 'assets',
            installMode: 'prefetch',
            updateMode: 'prefetch',
            urls: [
                '/foo.txt',
            ],
            patterns: [],
        }],
    dataGroups: [],
    navigationUrls: generator_1.processNavigationUrls(''),
    hashTable: mock_1.tmpHashTableForFs(brokenFs, { '/foo.txt': true }),
};
var manifest = {
    configVersion: 1,
    appData: {
        version: 'original',
    },
    index: '/foo.txt',
    assetGroups: [
        {
            name: 'assets',
            installMode: 'prefetch',
            updateMode: 'prefetch',
            urls: [
                '/foo.txt',
                '/bar.txt',
                '/redirected.txt',
            ],
            patterns: [
                '/unhashed/.*',
            ],
        },
        {
            name: 'other',
            installMode: 'lazy',
            updateMode: 'lazy',
            urls: [
                '/baz.txt',
                '/qux.txt',
            ],
            patterns: [],
        },
        {
            name: 'lazy_prefetch',
            installMode: 'lazy',
            updateMode: 'prefetch',
            urls: [
                '/quux.txt',
                '/quuux.txt',
                '/lazy/unchanged1.txt',
                '/lazy/unchanged2.txt',
            ],
            patterns: [],
        }
    ],
    navigationUrls: generator_1.processNavigationUrls(''),
    hashTable: mock_1.tmpHashTableForFs(dist),
};
var manifestUpdate = {
    configVersion: 1,
    appData: {
        version: 'update',
    },
    index: '/foo.txt',
    assetGroups: [
        {
            name: 'assets',
            installMode: 'prefetch',
            updateMode: 'prefetch',
            urls: [
                '/foo.txt',
                '/bar.txt',
                '/redirected.txt',
            ],
            patterns: [
                '/unhashed/.*',
            ],
        },
        {
            name: 'other',
            installMode: 'lazy',
            updateMode: 'lazy',
            urls: [
                '/baz.txt',
                '/qux.txt',
            ],
            patterns: [],
        },
        {
            name: 'lazy_prefetch',
            installMode: 'lazy',
            updateMode: 'prefetch',
            urls: [
                '/quux.txt',
                '/quuux.txt',
                '/lazy/unchanged1.txt',
                '/lazy/unchanged2.txt',
            ],
            patterns: [],
        }
    ],
    navigationUrls: generator_1.processNavigationUrls('', [
        '/**/file1',
        '/**/file2',
        '!/ignored/file1',
        '!/ignored/dir/**',
    ]),
    hashTable: mock_1.tmpHashTableForFs(distUpdate),
};
var server = new mock_1.MockServerStateBuilder()
    .withStaticFiles(dist)
    .withManifest(manifest)
    .withRedirect('/redirected.txt', '/redirect-target.txt', 'this was a redirect')
    .withError('/error.txt')
    .build();
var serverUpdate = new mock_1.MockServerStateBuilder()
    .withStaticFiles(distUpdate)
    .withManifest(manifestUpdate)
    .withRedirect('/redirected.txt', '/redirect-target.txt', 'this was a redirect')
    .build();
var brokenServer = new mock_1.MockServerStateBuilder().withStaticFiles(brokenFs).withManifest(brokenManifest).build();
var server404 = new mock_1.MockServerStateBuilder().withStaticFiles(dist).build();
var scope = new scope_1.SwTestHarnessBuilder().withServerState(server).build();
var manifestHash = sha1_1.sha1(JSON.stringify(manifest));
var manifestUpdateHash = sha1_1.sha1(JSON.stringify(manifestUpdate));
(function () {
    var _this = this;
    // Skip environments that don't support the minimum APIs needed to run the SW tests.
    if (!scope_1.SwTestHarness.envIsSupported()) {
        return;
    }
    describe('Driver', function () {
        var scope;
        var driver;
        beforeEach(function () {
            server.reset();
            serverUpdate.reset();
            server404.reset();
            brokenServer.reset();
            scope = new scope_1.SwTestHarnessBuilder().withServerState(server).build();
            driver = new driver_1.Driver(scope, scope, new db_cache_1.CacheDatabase(scope, scope));
        });
        async_1.async_it('initializes prefetched content correctly, after activation', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, scope.startup(true)];
                    case 1:
                        _a.apply(void 0, [_d.sent()]).toEqual(true);
                        return [4 /*yield*/, scope.resolveSelfMessages()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, driver.initialized];
                    case 3:
                        _d.sent();
                        server.assertSawRequestFor('ngsw.json');
                        server.assertSawRequestFor('/foo.txt');
                        server.assertSawRequestFor('/bar.txt');
                        server.assertSawRequestFor('/redirected.txt');
                        _b = expect;
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                    case 4:
                        _b.apply(void 0, [_d.sent()]).toEqual('this is foo');
                        _c = expect;
                        return [4 /*yield*/, makeRequest(scope, '/bar.txt')];
                    case 5:
                        _c.apply(void 0, [_d.sent()]).toEqual('this is bar');
                        server.assertNoOtherRequests();
                        return [2 /*return*/];
                }
            });
        }); });
        async_1.async_it('initializes prefetched content correctly, after a request kicks it off', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                    case 1:
                        _a.apply(void 0, [_d.sent()]).toEqual('this is foo');
                        return [4 /*yield*/, driver.initialized];
                    case 2:
                        _d.sent();
                        server.assertSawRequestFor('ngsw.json');
                        server.assertSawRequestFor('/foo.txt');
                        server.assertSawRequestFor('/bar.txt');
                        server.assertSawRequestFor('/redirected.txt');
                        _b = expect;
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                    case 3:
                        _b.apply(void 0, [_d.sent()]).toEqual('this is foo');
                        _c = expect;
                        return [4 /*yield*/, makeRequest(scope, '/bar.txt')];
                    case 4:
                        _c.apply(void 0, [_d.sent()]).toEqual('this is bar');
                        server.assertNoOtherRequests();
                        return [2 /*return*/];
                }
            });
        }); });
        async_1.async_it('handles non-relative URLs', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                    case 1:
                        _a.apply(void 0, [_c.sent()]).toEqual('this is foo');
                        return [4 /*yield*/, driver.initialized];
                    case 2:
                        _c.sent();
                        server.clearRequests();
                        _b = expect;
                        return [4 /*yield*/, makeRequest(scope, 'http://localhost/foo.txt')];
                    case 3:
                        _b.apply(void 0, [_c.sent()]).toEqual('this is foo');
                        server.assertNoOtherRequests();
                        return [2 /*return*/];
                }
            });
        }); });
        async_1.async_it('handles actual errors from the browser', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, resPromise, done, res;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                    case 1:
                        _a.apply(void 0, [_c.sent()]).toEqual('this is foo');
                        return [4 /*yield*/, driver.initialized];
                    case 2:
                        _c.sent();
                        server.clearRequests();
                        _b = scope.handleFetch(new fetch_1.MockRequest('/error.txt'), 'default'), resPromise = _b[0], done = _b[1];
                        return [4 /*yield*/, done];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, resPromise];
                    case 4:
                        res = (_c.sent());
                        expect(res.status).toEqual(504);
                        expect(res.statusText).toEqual('Gateway Timeout');
                        return [2 /*return*/];
                }
            });
        }); });
        async_1.async_it('handles redirected responses', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                    case 1:
                        _a.apply(void 0, [_c.sent()]).toEqual('this is foo');
                        return [4 /*yield*/, driver.initialized];
                    case 2:
                        _c.sent();
                        server.clearRequests();
                        _b = expect;
                        return [4 /*yield*/, makeRequest(scope, '/redirected.txt')];
                    case 3:
                        _b.apply(void 0, [_c.sent()]).toEqual('this was a redirect');
                        server.assertNoOtherRequests();
                        return [2 /*return*/];
                }
            });
        }); });
        async_1.async_it('caches lazy content on-request', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                    case 1:
                        _a.apply(void 0, [_e.sent()]).toEqual('this is foo');
                        return [4 /*yield*/, driver.initialized];
                    case 2:
                        _e.sent();
                        server.clearRequests();
                        _b = expect;
                        return [4 /*yield*/, makeRequest(scope, '/baz.txt')];
                    case 3:
                        _b.apply(void 0, [_e.sent()]).toEqual('this is baz');
                        server.assertSawRequestFor('/baz.txt');
                        server.assertNoOtherRequests();
                        _c = expect;
                        return [4 /*yield*/, makeRequest(scope, '/baz.txt')];
                    case 4:
                        _c.apply(void 0, [_e.sent()]).toEqual('this is baz');
                        server.assertNoOtherRequests();
                        _d = expect;
                        return [4 /*yield*/, makeRequest(scope, '/qux.txt')];
                    case 5:
                        _d.apply(void 0, [_e.sent()]).toEqual('this is qux');
                        server.assertSawRequestFor('/qux.txt');
                        server.assertNoOtherRequests();
                        return [2 /*return*/];
                }
            });
        }); });
        async_1.async_it('updates to new content when requested', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, client, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                    case 1:
                        _a.apply(void 0, [_g.sent()]).toEqual('this is foo');
                        return [4 /*yield*/, driver.initialized];
                    case 2:
                        _g.sent();
                        client = scope.clients.getMock('default');
                        expect(client.messages).toEqual([]);
                        scope.updateServerState(serverUpdate);
                        _b = expect;
                        return [4 /*yield*/, driver.checkForUpdate()];
                    case 3:
                        _b.apply(void 0, [_g.sent()]).toEqual(true);
                        serverUpdate.assertSawRequestFor('ngsw.json');
                        serverUpdate.assertSawRequestFor('/foo.txt');
                        serverUpdate.assertSawRequestFor('/redirected.txt');
                        serverUpdate.assertNoOtherRequests();
                        expect(client.messages).toEqual([{
                                type: 'UPDATE_AVAILABLE',
                                current: { hash: manifestHash, appData: { version: 'original' } },
                                available: { hash: manifestUpdateHash, appData: { version: 'update' } },
                            }]);
                        // Default client is still on the old version of the app.
                        _c = expect;
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                    case 4:
                        // Default client is still on the old version of the app.
                        _c.apply(void 0, [_g.sent()]).toEqual('this is foo');
                        // Sending a new client id should result in the updated version being returned.
                        _d = expect;
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt', 'new')];
                    case 5:
                        // Sending a new client id should result in the updated version being returned.
                        _d.apply(void 0, [_g.sent()]).toEqual('this is foo v2');
                        // Of course, the old version should still work.
                        _e = expect;
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                    case 6:
                        // Of course, the old version should still work.
                        _e.apply(void 0, [_g.sent()]).toEqual('this is foo');
                        _f = expect;
                        return [4 /*yield*/, makeRequest(scope, '/bar.txt')];
                    case 7:
                        _f.apply(void 0, [_g.sent()]).toEqual('this is bar');
                        serverUpdate.assertNoOtherRequests();
                        return [2 /*return*/];
                }
            });
        }); });
        async_1.async_it('updates a specific client to new content on request', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, client, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                    case 1:
                        _a.apply(void 0, [_d.sent()]).toEqual('this is foo');
                        return [4 /*yield*/, driver.initialized];
                    case 2:
                        _d.sent();
                        client = scope.clients.getMock('default');
                        expect(client.messages).toEqual([]);
                        scope.updateServerState(serverUpdate);
                        _b = expect;
                        return [4 /*yield*/, driver.checkForUpdate()];
                    case 3:
                        _b.apply(void 0, [_d.sent()]).toEqual(true);
                        serverUpdate.clearRequests();
                        return [4 /*yield*/, driver.updateClient(client)];
                    case 4:
                        _d.sent();
                        expect(client.messages).toEqual([
                            {
                                type: 'UPDATE_AVAILABLE',
                                current: { hash: manifestHash, appData: { version: 'original' } },
                                available: { hash: manifestUpdateHash, appData: { version: 'update' } },
                            },
                            {
                                type: 'UPDATE_ACTIVATED',
                                previous: { hash: manifestHash, appData: { version: 'original' } },
                                current: { hash: manifestUpdateHash, appData: { version: 'update' } },
                            }
                        ]);
                        _c = expect;
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                    case 5:
                        _c.apply(void 0, [_d.sent()]).toEqual('this is foo v2');
                        return [2 /*return*/];
                }
            });
        }); });
        async_1.async_it('handles empty client ID', function () { return __awaiter(_this, void 0, void 0, function () {
            var navRequest, _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        navRequest = function (url, clientId) {
                            return makeRequest(scope, url, clientId, {
                                headers: { Accept: 'text/plain, text/html, text/css' },
                                mode: 'navigate',
                            });
                        };
                        // Initialize the SW.
                        _a = expect;
                        return [4 /*yield*/, navRequest('/foo/file1', '')];
                    case 1:
                        // Initialize the SW.
                        _a.apply(void 0, [_f.sent()]).toEqual('this is foo');
                        _b = expect;
                        return [4 /*yield*/, navRequest('/bar/file2', null)];
                    case 2:
                        _b.apply(void 0, [_f.sent()]).toEqual('this is foo');
                        return [4 /*yield*/, driver.initialized];
                    case 3:
                        _f.sent();
                        // Update to a new version.
                        scope.updateServerState(serverUpdate);
                        _c = expect;
                        return [4 /*yield*/, driver.checkForUpdate()];
                    case 4:
                        _c.apply(void 0, [_f.sent()]).toEqual(true);
                        // Correctly handle navigation requests, even if `clientId` is null/empty.
                        _d = expect;
                        return [4 /*yield*/, navRequest('/foo/file1', '')];
                    case 5:
                        // Correctly handle navigation requests, even if `clientId` is null/empty.
                        _d.apply(void 0, [_f.sent()]).toEqual('this is foo v2');
                        _e = expect;
                        return [4 /*yield*/, navRequest('/bar/file2', null)];
                    case 6:
                        _e.apply(void 0, [_f.sent()]).toEqual('this is foo v2');
                        return [2 /*return*/];
                }
            });
        }); });
        async_1.async_it('checks for updates on restart', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                    case 1:
                        _a.apply(void 0, [_c.sent()]).toEqual('this is foo');
                        return [4 /*yield*/, driver.initialized];
                    case 2:
                        _c.sent();
                        scope = new scope_1.SwTestHarnessBuilder()
                            .withCacheState(scope.caches.dehydrate())
                            .withServerState(serverUpdate)
                            .build();
                        driver = new driver_1.Driver(scope, scope, new db_cache_1.CacheDatabase(scope, scope));
                        _b = expect;
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                    case 3:
                        _b.apply(void 0, [_c.sent()]).toEqual('this is foo');
                        return [4 /*yield*/, driver.initialized];
                    case 4:
                        _c.sent();
                        serverUpdate.assertNoOtherRequests();
                        scope.advance(12000);
                        return [4 /*yield*/, driver.idle.empty];
                    case 5:
                        _c.sent();
                        serverUpdate.assertSawRequestFor('ngsw.json');
                        serverUpdate.assertSawRequestFor('/foo.txt');
                        serverUpdate.assertSawRequestFor('/redirected.txt');
                        serverUpdate.assertNoOtherRequests();
                        return [2 /*return*/];
                }
            });
        }); });
        async_1.async_it('checks for updates on navigation', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                    case 1:
                        _a.apply(void 0, [_c.sent()]).toEqual('this is foo');
                        return [4 /*yield*/, driver.initialized];
                    case 2:
                        _c.sent();
                        server.clearRequests();
                        _b = expect;
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt', 'default', {
                                mode: 'navigate',
                            })];
                    case 3:
                        _b.apply(void 0, [_c.sent()]).toEqual('this is foo');
                        scope.advance(12000);
                        return [4 /*yield*/, driver.idle.empty];
                    case 4:
                        _c.sent();
                        server.assertSawRequestFor('ngsw.json');
                        return [2 /*return*/];
                }
            });
        }); });
        async_1.async_it('does not make concurrent checks for updates on navigation', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                    case 1:
                        _a.apply(void 0, [_d.sent()]).toEqual('this is foo');
                        return [4 /*yield*/, driver.initialized];
                    case 2:
                        _d.sent();
                        server.clearRequests();
                        _b = expect;
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt', 'default', {
                                mode: 'navigate',
                            })];
                    case 3:
                        _b.apply(void 0, [_d.sent()]).toEqual('this is foo');
                        _c = expect;
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt', 'default', {
                                mode: 'navigate',
                            })];
                    case 4:
                        _c.apply(void 0, [_d.sent()]).toEqual('this is foo');
                        scope.advance(12000);
                        return [4 /*yield*/, driver.idle.empty];
                    case 5:
                        _d.sent();
                        server.assertSawRequestFor('ngsw.json');
                        server.assertNoOtherRequests();
                        return [2 /*return*/];
                }
            });
        }); });
        async_1.async_it('preserves multiple client assignments across restarts', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                    case 1:
                        _a.apply(void 0, [_f.sent()]).toEqual('this is foo');
                        return [4 /*yield*/, driver.initialized];
                    case 2:
                        _f.sent();
                        scope.updateServerState(serverUpdate);
                        _b = expect;
                        return [4 /*yield*/, driver.checkForUpdate()];
                    case 3:
                        _b.apply(void 0, [_f.sent()]).toEqual(true);
                        _c = expect;
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt', 'new')];
                    case 4:
                        _c.apply(void 0, [_f.sent()]).toEqual('this is foo v2');
                        serverUpdate.clearRequests();
                        scope = new scope_1.SwTestHarnessBuilder()
                            .withCacheState(scope.caches.dehydrate())
                            .withServerState(serverUpdate)
                            .build();
                        driver = new driver_1.Driver(scope, scope, new db_cache_1.CacheDatabase(scope, scope));
                        _d = expect;
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                    case 5:
                        _d.apply(void 0, [_f.sent()]).toEqual('this is foo');
                        _e = expect;
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt', 'new')];
                    case 6:
                        _e.apply(void 0, [_f.sent()]).toEqual('this is foo v2');
                        serverUpdate.assertNoOtherRequests();
                        return [2 /*return*/];
                }
            });
        }); });
        async_1.async_it('updates when refreshed', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, client, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                    case 1:
                        _a.apply(void 0, [_d.sent()]).toEqual('this is foo');
                        return [4 /*yield*/, driver.initialized];
                    case 2:
                        _d.sent();
                        client = scope.clients.getMock('default');
                        scope.updateServerState(serverUpdate);
                        _b = expect;
                        return [4 /*yield*/, driver.checkForUpdate()];
                    case 3:
                        _b.apply(void 0, [_d.sent()]).toEqual(true);
                        serverUpdate.clearRequests();
                        _c = expect;
                        return [4 /*yield*/, makeRequest(scope, '/file1', 'default', {
                                headers: {
                                    'Accept': 'text/plain, text/html, text/css',
                                },
                                mode: 'navigate',
                            })];
                    case 4:
                        _c.apply(void 0, [_d.sent()]).toEqual('this is foo v2');
                        expect(client.messages).toEqual([
                            {
                                type: 'UPDATE_AVAILABLE',
                                current: { hash: manifestHash, appData: { version: 'original' } },
                                available: { hash: manifestUpdateHash, appData: { version: 'update' } },
                            },
                            {
                                type: 'UPDATE_ACTIVATED',
                                previous: { hash: manifestHash, appData: { version: 'original' } },
                                current: { hash: manifestUpdateHash, appData: { version: 'update' } },
                            }
                        ]);
                        serverUpdate.assertNoOtherRequests();
                        return [2 /*return*/];
                }
            });
        }); });
        async_1.async_it('cleans up properly when manually requested', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                    case 1:
                        _a.apply(void 0, [_e.sent()]).toEqual('this is foo');
                        return [4 /*yield*/, driver.initialized];
                    case 2:
                        _e.sent();
                        scope.updateServerState(serverUpdate);
                        _b = expect;
                        return [4 /*yield*/, driver.checkForUpdate()];
                    case 3:
                        _b.apply(void 0, [_e.sent()]).toEqual(true);
                        serverUpdate.clearRequests();
                        _c = expect;
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt', 'new')];
                    case 4:
                        _c.apply(void 0, [_e.sent()]).toEqual('this is foo v2');
                        // Delete the default client.
                        scope.clients.remove('default');
                        // After this, the old version should no longer be cached.
                        return [4 /*yield*/, driver.cleanupCaches()];
                    case 5:
                        // After this, the old version should no longer be cached.
                        _e.sent();
                        _d = expect;
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                    case 6:
                        _d.apply(void 0, [_e.sent()]).toEqual('this is foo v2');
                        serverUpdate.assertNoOtherRequests();
                        return [2 /*return*/];
                }
            });
        }); });
        async_1.async_it('cleans up properly on restart', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, keys, hasOriginalCaches, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                    case 1:
                        _a.apply(void 0, [_d.sent()]).toEqual('this is foo');
                        return [4 /*yield*/, driver.initialized];
                    case 2:
                        _d.sent();
                        scope = new scope_1.SwTestHarnessBuilder()
                            .withCacheState(scope.caches.dehydrate())
                            .withServerState(serverUpdate)
                            .build();
                        driver = new driver_1.Driver(scope, scope, new db_cache_1.CacheDatabase(scope, scope));
                        _b = expect;
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                    case 3:
                        _b.apply(void 0, [_d.sent()]).toEqual('this is foo');
                        return [4 /*yield*/, driver.initialized];
                    case 4:
                        _d.sent();
                        serverUpdate.assertNoOtherRequests();
                        return [4 /*yield*/, scope.caches.keys()];
                    case 5:
                        keys = _d.sent();
                        hasOriginalCaches = keys.some(function (name) { return name.startsWith("ngsw:" + manifestHash + ":"); });
                        expect(hasOriginalCaches).toEqual(true);
                        scope.clients.remove('default');
                        scope.advance(12000);
                        return [4 /*yield*/, driver.idle.empty];
                    case 6:
                        _d.sent();
                        serverUpdate.clearRequests();
                        driver = new driver_1.Driver(scope, scope, new db_cache_1.CacheDatabase(scope, scope));
                        _c = expect;
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                    case 7:
                        _c.apply(void 0, [_d.sent()]).toEqual('this is foo v2');
                        return [4 /*yield*/, scope.caches.keys()];
                    case 8:
                        keys = _d.sent();
                        hasOriginalCaches = keys.some(function (name) { return name.startsWith("ngsw:" + manifestHash + ":"); });
                        expect(hasOriginalCaches).toEqual(false);
                        return [2 /*return*/];
                }
            });
        }); });
        async_1.async_it('shows notifications for push notifications', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual('this is foo');
                        return [4 /*yield*/, driver.initialized];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, scope.handlePush({
                                notification: {
                                    title: 'This is a test',
                                    body: 'Test body',
                                }
                            })];
                    case 3:
                        _b.sent();
                        expect(scope.notifications).toEqual([{
                                title: 'This is a test',
                                options: { title: 'This is a test', body: 'Test body' },
                            }]);
                        expect(scope.clients.getMock('default').messages).toEqual([{
                                type: 'PUSH',
                                data: {
                                    notification: {
                                        title: 'This is a test',
                                        body: 'Test body',
                                    },
                                },
                            }]);
                        return [2 /*return*/];
                }
            });
        }); });
        async_1.async_it('broadcasts notification click events with action', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, message;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual('this is foo');
                        return [4 /*yield*/, driver.initialized];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, scope.handleClick({ title: 'This is a test with action', body: 'Test body with action' }, 'button')];
                    case 3:
                        _b.sent();
                        message = scope.clients.getMock('default').messages[0];
                        expect(message.type).toEqual('NOTIFICATION_CLICK');
                        expect(message.data.action).toEqual('button');
                        expect(message.data.notification.title).toEqual('This is a test with action');
                        expect(message.data.notification.body).toEqual('Test body with action');
                        return [2 /*return*/];
                }
            });
        }); });
        async_1.async_it('broadcasts notification click events without action', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, message;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual('this is foo');
                        return [4 /*yield*/, driver.initialized];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, scope.handleClick({ title: 'This is a test without action', body: 'Test body without action' })];
                    case 3:
                        _b.sent();
                        message = scope.clients.getMock('default').messages[0];
                        expect(message.type).toEqual('NOTIFICATION_CLICK');
                        expect(message.data.action).toBeUndefined();
                        expect(message.data.notification.title).toEqual('This is a test without action');
                        expect(message.data.notification.body).toEqual('Test body without action');
                        return [2 /*return*/];
                }
            });
        }); });
        async_1.async_it('prefetches updates to lazy cache when set', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            return __generator(this, function (_l) {
                switch (_l.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                    case 1:
                        _a.apply(void 0, [_l.sent()]).toEqual('this is foo');
                        return [4 /*yield*/, driver.initialized];
                    case 2:
                        _l.sent();
                        // Fetch some files from the `lazy_prefetch` asset group.
                        _b = expect;
                        return [4 /*yield*/, makeRequest(scope, '/quux.txt')];
                    case 3:
                        // Fetch some files from the `lazy_prefetch` asset group.
                        _b.apply(void 0, [_l.sent()]).toEqual('this is quux');
                        _c = expect;
                        return [4 /*yield*/, makeRequest(scope, '/lazy/unchanged1.txt')];
                    case 4:
                        _c.apply(void 0, [_l.sent()]).toEqual('this is unchanged (1)');
                        // Install update.
                        scope.updateServerState(serverUpdate);
                        _d = expect;
                        return [4 /*yield*/, driver.checkForUpdate()];
                    case 5:
                        _d.apply(void 0, [_l.sent()]).toBe(true);
                        // Previously requested and changed: Fetch from network.
                        serverUpdate.assertSawRequestFor('/quux.txt');
                        // Never requested and changed: Don't fetch.
                        serverUpdate.assertNoRequestFor('/quuux.txt');
                        // Previously requested and unchanged: Fetch from cache.
                        serverUpdate.assertNoRequestFor('/lazy/unchanged1.txt');
                        // Never requested and unchanged: Don't fetch.
                        serverUpdate.assertNoRequestFor('/lazy/unchanged2.txt');
                        serverUpdate.clearRequests();
                        _f = (_e = driver).updateClient;
                        return [4 /*yield*/, scope.clients.get('default')];
                    case 6: 
                    // Update client.
                    return [4 /*yield*/, _f.apply(_e, [_l.sent()])];
                    case 7:
                        // Update client.
                        _l.sent();
                        // Already cached.
                        _g = expect;
                        return [4 /*yield*/, makeRequest(scope, '/quux.txt')];
                    case 8:
                        // Already cached.
                        _g.apply(void 0, [_l.sent()]).toBe('this is quux v2');
                        serverUpdate.assertNoOtherRequests();
                        // Not cached: Fetch from network.
                        _h = expect;
                        return [4 /*yield*/, makeRequest(scope, '/quuux.txt')];
                    case 9:
                        // Not cached: Fetch from network.
                        _h.apply(void 0, [_l.sent()]).toBe('this is quuux v2');
                        serverUpdate.assertSawRequestFor('/quuux.txt');
                        // Already cached (copied from old cache).
                        _j = expect;
                        return [4 /*yield*/, makeRequest(scope, '/lazy/unchanged1.txt')];
                    case 10:
                        // Already cached (copied from old cache).
                        _j.apply(void 0, [_l.sent()]).toBe('this is unchanged (1)');
                        serverUpdate.assertNoOtherRequests();
                        // Not cached: Fetch from network.
                        _k = expect;
                        return [4 /*yield*/, makeRequest(scope, '/lazy/unchanged2.txt')];
                    case 11:
                        // Not cached: Fetch from network.
                        _k.apply(void 0, [_l.sent()]).toBe('this is unchanged (2)');
                        serverUpdate.assertSawRequestFor('/lazy/unchanged2.txt');
                        serverUpdate.assertNoOtherRequests();
                        return [2 /*return*/];
                }
            });
        }); });
        async_1.async_it('unregisters when manifest 404s', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                    case 1:
                        _a.apply(void 0, [_d.sent()]).toEqual('this is foo');
                        return [4 /*yield*/, driver.initialized];
                    case 2:
                        _d.sent();
                        scope.updateServerState(server404);
                        _b = expect;
                        return [4 /*yield*/, driver.checkForUpdate()];
                    case 3:
                        _b.apply(void 0, [_d.sent()]).toEqual(false);
                        expect(scope.unregistered).toEqual(true);
                        _c = expect;
                        return [4 /*yield*/, scope.caches.keys()];
                    case 4:
                        _c.apply(void 0, [_d.sent()]).toEqual([]);
                        return [2 /*return*/];
                }
            });
        }); });
        async_1.async_it('does not unregister or change state when offline (i.e. manifest 504s)', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                    case 1:
                        _a.apply(void 0, [_d.sent()]).toEqual('this is foo');
                        return [4 /*yield*/, driver.initialized];
                    case 2:
                        _d.sent();
                        server.online = false;
                        _b = expect;
                        return [4 /*yield*/, driver.checkForUpdate()];
                    case 3:
                        _b.apply(void 0, [_d.sent()]).toEqual(false);
                        expect(driver.state).toEqual(driver_1.DriverReadyState.NORMAL);
                        expect(scope.unregistered).toBeFalsy();
                        _c = expect;
                        return [4 /*yield*/, scope.caches.keys()];
                    case 4:
                        _c.apply(void 0, [_d.sent()]).not.toEqual([]);
                        return [2 /*return*/];
                }
            });
        }); });
        describe('unhashed requests', function () {
            async_1.async_beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).toEqual('this is foo');
                            return [4 /*yield*/, driver.initialized];
                        case 2:
                            _b.sent();
                            server.clearRequests();
                            return [2 /*return*/];
                    }
                });
            }); });
            async_1.async_it('are cached appropriately', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, makeRequest(scope, '/unhashed/a.txt')];
                        case 1:
                            _a.apply(void 0, [_c.sent()]).toEqual('this is unhashed');
                            server.assertSawRequestFor('/unhashed/a.txt');
                            _b = expect;
                            return [4 /*yield*/, makeRequest(scope, '/unhashed/a.txt')];
                        case 2:
                            _b.apply(void 0, [_c.sent()]).toEqual('this is unhashed');
                            server.assertNoOtherRequests();
                            return [2 /*return*/];
                    }
                });
            }); });
            async_1.async_it("doesn't error when 'Cache-Control' is 'no-cache'", function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, makeRequest(scope, '/unhashed/b.txt')];
                        case 1:
                            _a.apply(void 0, [_c.sent()]).toEqual('this is unhashed b');
                            server.assertSawRequestFor('/unhashed/b.txt');
                            _b = expect;
                            return [4 /*yield*/, makeRequest(scope, '/unhashed/b.txt')];
                        case 2:
                            _b.apply(void 0, [_c.sent()]).toEqual('this is unhashed b');
                            server.assertNoOtherRequests();
                            return [2 /*return*/];
                    }
                });
            }); });
            async_1.async_it('avoid opaque responses', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, makeRequest(scope, '/unhashed/a.txt', 'default', {
                                    credentials: 'include'
                                })];
                        case 1:
                            _a.apply(void 0, [_c.sent()]).toEqual('this is unhashed');
                            server.assertSawRequestFor('/unhashed/a.txt');
                            _b = expect;
                            return [4 /*yield*/, makeRequest(scope, '/unhashed/a.txt')];
                        case 2:
                            _b.apply(void 0, [_c.sent()]).toEqual('this is unhashed');
                            server.assertNoOtherRequests();
                            return [2 /*return*/];
                    }
                });
            }); });
            async_1.async_it('expire according to Cache-Control headers', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, makeRequest(scope, '/unhashed/a.txt')];
                        case 1:
                            _a.apply(void 0, [_d.sent()]).toEqual('this is unhashed');
                            server.clearRequests();
                            // Update the resource on the server.
                            scope.updateServerState(serverUpdate);
                            // Move ahead by 15 seconds.
                            scope.advance(15000);
                            _b = expect;
                            return [4 /*yield*/, makeRequest(scope, '/unhashed/a.txt')];
                        case 2:
                            _b.apply(void 0, [_d.sent()]).toEqual('this is unhashed');
                            serverUpdate.assertNoOtherRequests();
                            // Another 6 seconds.
                            scope.advance(6000);
                            return [4 /*yield*/, driver.idle.empty];
                        case 3:
                            _d.sent();
                            serverUpdate.assertSawRequestFor('/unhashed/a.txt');
                            // Now the new version of the resource should be served.
                            _c = expect;
                            return [4 /*yield*/, makeRequest(scope, '/unhashed/a.txt')];
                        case 4:
                            // Now the new version of the resource should be served.
                            _c.apply(void 0, [_d.sent()]).toEqual('this is unhashed v2');
                            server.assertNoOtherRequests();
                            return [2 /*return*/];
                    }
                });
            }); });
            async_1.async_it('survive serialization', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, state, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, makeRequest(scope, '/unhashed/a.txt')];
                        case 1:
                            _a.apply(void 0, [_d.sent()]).toEqual('this is unhashed');
                            server.clearRequests();
                            state = scope.caches.dehydrate();
                            scope = new scope_1.SwTestHarnessBuilder().withCacheState(state).withServerState(server).build();
                            driver = new driver_1.Driver(scope, scope, new db_cache_1.CacheDatabase(scope, scope));
                            _b = expect;
                            return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                        case 2:
                            _b.apply(void 0, [_d.sent()]).toEqual('this is foo');
                            return [4 /*yield*/, driver.initialized];
                        case 3:
                            _d.sent();
                            server.assertNoRequestFor('/unhashed/a.txt');
                            server.clearRequests();
                            _c = expect;
                            return [4 /*yield*/, makeRequest(scope, '/unhashed/a.txt')];
                        case 4:
                            _c.apply(void 0, [_d.sent()]).toEqual('this is unhashed');
                            server.assertNoOtherRequests();
                            // Advance the clock by 6 seconds, triggering the idle tasks. If an idle task
                            // was scheduled from the request above, it means that the metadata was not
                            // properly saved.
                            scope.advance(6000);
                            return [4 /*yield*/, driver.idle.empty];
                        case 5:
                            _d.sent();
                            server.assertNoRequestFor('/unhashed/a.txt');
                            return [2 /*return*/];
                    }
                });
            }); });
            async_1.async_it('get carried over during updates', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, makeRequest(scope, '/unhashed/a.txt')];
                        case 1:
                            _a.apply(void 0, [_e.sent()]).toEqual('this is unhashed');
                            server.clearRequests();
                            scope = new scope_1.SwTestHarnessBuilder()
                                .withCacheState(scope.caches.dehydrate())
                                .withServerState(serverUpdate)
                                .build();
                            driver = new driver_1.Driver(scope, scope, new db_cache_1.CacheDatabase(scope, scope));
                            _b = expect;
                            return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                        case 2:
                            _b.apply(void 0, [_e.sent()]).toEqual('this is foo');
                            return [4 /*yield*/, driver.initialized];
                        case 3:
                            _e.sent();
                            scope.advance(15000);
                            return [4 /*yield*/, driver.idle.empty];
                        case 4:
                            _e.sent();
                            serverUpdate.assertNoRequestFor('/unhashed/a.txt');
                            serverUpdate.clearRequests();
                            _c = expect;
                            return [4 /*yield*/, makeRequest(scope, '/unhashed/a.txt')];
                        case 5:
                            _c.apply(void 0, [_e.sent()]).toEqual('this is unhashed');
                            serverUpdate.assertNoOtherRequests();
                            scope.advance(15000);
                            return [4 /*yield*/, driver.idle.empty];
                        case 6:
                            _e.sent();
                            serverUpdate.assertSawRequestFor('/unhashed/a.txt');
                            _d = expect;
                            return [4 /*yield*/, makeRequest(scope, '/unhashed/a.txt')];
                        case 7:
                            _d.apply(void 0, [_e.sent()]).toEqual('this is unhashed v2');
                            serverUpdate.assertNoOtherRequests();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('routing', function () {
            var navRequest = function (url, init) {
                if (init === void 0) { init = {}; }
                return makeRequest(scope, url, undefined, __assign({ headers: { Accept: 'text/plain, text/html, text/css' }, mode: 'navigate' }, init));
            };
            async_1.async_beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).toEqual('this is foo');
                            return [4 /*yield*/, driver.initialized];
                        case 2:
                            _b.sent();
                            server.clearRequests();
                            return [2 /*return*/];
                    }
                });
            }); });
            async_1.async_it('redirects to index on a route-like request', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, navRequest('/baz')];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).toEqual('this is foo');
                            server.assertNoOtherRequests();
                            return [2 /*return*/];
                    }
                });
            }); });
            async_1.async_it('redirects to index on a request to the origin URL request', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, navRequest('http://localhost/')];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).toEqual('this is foo');
                            server.assertNoOtherRequests();
                            return [2 /*return*/];
                    }
                });
            }); });
            async_1.async_it('does not redirect to index on a non-navigation request', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, navRequest('/baz', { mode: undefined })];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).toBeNull();
                            server.assertSawRequestFor('/baz');
                            return [2 /*return*/];
                    }
                });
            }); });
            async_1.async_it('does not redirect to index on a request that does not accept HTML', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, navRequest('/baz', { headers: {} })];
                        case 1:
                            _a.apply(void 0, [_c.sent()]).toBeNull();
                            server.assertSawRequestFor('/baz');
                            _b = expect;
                            return [4 /*yield*/, navRequest('/qux', { headers: { 'Accept': 'text/plain' } })];
                        case 2:
                            _b.apply(void 0, [_c.sent()]).toBeNull();
                            server.assertSawRequestFor('/qux');
                            return [2 /*return*/];
                    }
                });
            }); });
            async_1.async_it('does not redirect to index on a request with an extension', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, navRequest('/baz.html')];
                        case 1:
                            _a.apply(void 0, [_c.sent()]).toBeNull();
                            server.assertSawRequestFor('/baz.html');
                            // Only considers the last path segment when checking for a file extension.
                            _b = expect;
                            return [4 /*yield*/, navRequest('/baz.html/qux')];
                        case 2:
                            // Only considers the last path segment when checking for a file extension.
                            _b.apply(void 0, [_c.sent()]).toBe('this is foo');
                            server.assertNoOtherRequests();
                            return [2 /*return*/];
                    }
                });
            }); });
            async_1.async_it('does not redirect to index if the URL contains `__`', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, navRequest('/baz/x__x')];
                        case 1:
                            _a.apply(void 0, [_e.sent()]).toBeNull();
                            server.assertSawRequestFor('/baz/x__x');
                            _b = expect;
                            return [4 /*yield*/, navRequest('/baz/x__x/qux')];
                        case 2:
                            _b.apply(void 0, [_e.sent()]).toBeNull();
                            server.assertSawRequestFor('/baz/x__x/qux');
                            _c = expect;
                            return [4 /*yield*/, navRequest('/baz/__')];
                        case 3:
                            _c.apply(void 0, [_e.sent()]).toBeNull();
                            server.assertSawRequestFor('/baz/__');
                            _d = expect;
                            return [4 /*yield*/, navRequest('/baz/__/qux')];
                        case 4:
                            _d.apply(void 0, [_e.sent()]).toBeNull();
                            server.assertSawRequestFor('/baz/__/qux');
                            return [2 /*return*/];
                    }
                });
            }); });
            describe('(with custom `navigationUrls`)', function () {
                async_1.async_beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                scope.updateServerState(serverUpdate);
                                return [4 /*yield*/, driver.checkForUpdate()];
                            case 1:
                                _a.sent();
                                serverUpdate.clearRequests();
                                return [2 /*return*/];
                        }
                    });
                }); });
                async_1.async_it('redirects to index on a request that matches any positive pattern', function () { return __awaiter(_this, void 0, void 0, function () {
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                _a = expect;
                                return [4 /*yield*/, navRequest('/foo/file0')];
                            case 1:
                                _a.apply(void 0, [_d.sent()]).toBeNull();
                                serverUpdate.assertSawRequestFor('/foo/file0');
                                _b = expect;
                                return [4 /*yield*/, navRequest('/foo/file1')];
                            case 2:
                                _b.apply(void 0, [_d.sent()]).toBe('this is foo v2');
                                serverUpdate.assertNoOtherRequests();
                                _c = expect;
                                return [4 /*yield*/, navRequest('/bar/file2')];
                            case 3:
                                _c.apply(void 0, [_d.sent()]).toBe('this is foo v2');
                                serverUpdate.assertNoOtherRequests();
                                return [2 /*return*/];
                        }
                    });
                }); });
                async_1.async_it('does not redirect to index on a request that matches any negative pattern', function () { return __awaiter(_this, void 0, void 0, function () {
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                _a = expect;
                                return [4 /*yield*/, navRequest('/ignored/file1')];
                            case 1:
                                _a.apply(void 0, [_d.sent()]).toBe('this is not handled by the SW');
                                serverUpdate.assertSawRequestFor('/ignored/file1');
                                _b = expect;
                                return [4 /*yield*/, navRequest('/ignored/dir/file2')];
                            case 2:
                                _b.apply(void 0, [_d.sent()])
                                    .toBe('this is not handled by the SW either');
                                serverUpdate.assertSawRequestFor('/ignored/dir/file2');
                                _c = expect;
                                return [4 /*yield*/, navRequest('/ignored/directory/file2')];
                            case 3:
                                _c.apply(void 0, [_d.sent()]).toBe('this is foo v2');
                                serverUpdate.assertNoOtherRequests();
                                return [2 /*return*/];
                        }
                    });
                }); });
                async_1.async_it('strips URL query before checking `navigationUrls`', function () { return __awaiter(_this, void 0, void 0, function () {
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                _a = expect;
                                return [4 /*yield*/, navRequest('/foo/file1?query=/a/b')];
                            case 1:
                                _a.apply(void 0, [_d.sent()]).toBe('this is foo v2');
                                serverUpdate.assertNoOtherRequests();
                                _b = expect;
                                return [4 /*yield*/, navRequest('/ignored/file1?query=/a/b')];
                            case 2:
                                _b.apply(void 0, [_d.sent()])
                                    .toBe('this is not handled by the SW');
                                serverUpdate.assertSawRequestFor('/ignored/file1');
                                _c = expect;
                                return [4 /*yield*/, navRequest('/ignored/dir/file2?query=/a/b')];
                            case 3:
                                _c.apply(void 0, [_d.sent()])
                                    .toBe('this is not handled by the SW either');
                                serverUpdate.assertSawRequestFor('/ignored/dir/file2');
                                return [2 /*return*/];
                        }
                    });
                }); });
                async_1.async_it('strips registration scope before checking `navigationUrls`', function () { return __awaiter(_this, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = expect;
                                return [4 /*yield*/, navRequest('http://localhost/ignored/file1')];
                            case 1:
                                _a.apply(void 0, [_b.sent()])
                                    .toBe('this is not handled by the SW');
                                serverUpdate.assertSawRequestFor('/ignored/file1');
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        });
        describe('bugs', function () {
            async_1.async_it('does not crash with bad index hash', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            scope = new scope_1.SwTestHarnessBuilder().withServerState(brokenServer).build();
                            scope.registration.scope = 'http://site.com';
                            driver = new driver_1.Driver(scope, scope, new db_cache_1.CacheDatabase(scope, scope));
                            _a = expect;
                            return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).toEqual('this is foo');
                            return [2 /*return*/];
                    }
                });
            }); });
            async_1.async_it('enters degraded mode when update has a bad index', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).toEqual('this is foo');
                            return [4 /*yield*/, driver.initialized];
                        case 2:
                            _b.sent();
                            server.clearRequests();
                            scope = new scope_1.SwTestHarnessBuilder()
                                .withCacheState(scope.caches.dehydrate())
                                .withServerState(brokenServer)
                                .build();
                            driver = new driver_1.Driver(scope, scope, new db_cache_1.CacheDatabase(scope, scope));
                            return [4 /*yield*/, driver.checkForUpdate()];
                        case 3:
                            _b.sent();
                            scope.advance(12000);
                            return [4 /*yield*/, driver.idle.empty];
                        case 4:
                            _b.sent();
                            expect(driver.state).toEqual(driver_1.DriverReadyState.EXISTING_CLIENTS_ONLY);
                            return [2 /*return*/];
                    }
                });
            }); });
            async_1.async_it('enters degraded mode when failing to write to cache', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: 
                        // Initialize the SW.
                        return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                        case 1:
                            // Initialize the SW.
                            _c.sent();
                            return [4 /*yield*/, driver.initialized];
                        case 2:
                            _c.sent();
                            expect(driver.state).toBe(driver_1.DriverReadyState.NORMAL);
                            server.clearRequests();
                            // Operate normally.
                            _a = expect;
                            return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                        case 3:
                            // Operate normally.
                            _a.apply(void 0, [_c.sent()]).toBe('this is foo');
                            server.assertNoOtherRequests();
                            // Clear the caches and make them unwritable.
                            return [4 /*yield*/, cache_1.clearAllCaches(scope.caches)];
                        case 4:
                            // Clear the caches and make them unwritable.
                            _c.sent();
                            spyOn(cache_1.MockCache.prototype, 'put').and.throwError('Can\'t touch this');
                            // Enter degraded mode and serve from network.
                            _b = expect;
                            return [4 /*yield*/, makeRequest(scope, '/foo.txt')];
                        case 5:
                            // Enter degraded mode and serve from network.
                            _b.apply(void 0, [_c.sent()]).toBe('this is foo');
                            expect(driver.state).toBe(driver_1.DriverReadyState.EXISTING_CLIENTS_ONLY);
                            server.assertSawRequestFor('/foo.txt');
                            return [2 /*return*/];
                    }
                });
            }); });
            async_1.async_it('ignores invalid `only-if-cached` requests ', function () { return __awaiter(_this, void 0, void 0, function () {
                var requestFoo, _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            requestFoo = function (cache, mode) {
                                return makeRequest(scope, '/foo.txt', undefined, { cache: cache, mode: mode });
                            };
                            _a = expect;
                            return [4 /*yield*/, requestFoo('default', 'no-cors')];
                        case 1:
                            _a.apply(void 0, [_d.sent()]).toBe('this is foo');
                            _b = expect;
                            return [4 /*yield*/, requestFoo('only-if-cached', 'same-origin')];
                        case 2:
                            _b.apply(void 0, [_d.sent()]).toBe('this is foo');
                            _c = expect;
                            return [4 /*yield*/, requestFoo('only-if-cached', 'no-cors')];
                        case 3:
                            _c.apply(void 0, [_d.sent()]).toBeNull();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
})();
function makeRequest(scope, url, clientId, init) {
    if (clientId === void 0) { clientId = 'default'; }
    return __awaiter(this, void 0, void 0, function () {
        var _a, resPromise, done, res;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = scope.handleFetch(new fetch_1.MockRequest(url, init), clientId), resPromise = _a[0], done = _a[1];
                    return [4 /*yield*/, done];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, resPromise];
                case 2:
                    res = _b.sent();
                    if (res !== undefined && res.ok) {
                        return [2 /*return*/, res.text()];
                    }
                    return [2 /*return*/, null];
            }
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFwcHlfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3NlcnZpY2Utd29ya2VyL3dvcmtlci90ZXN0L2hhcHB5X3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsd0RBQWlFO0FBQ2pFLDRDQUE4QztBQUM5Qyx3Q0FBdUQ7QUFFdkQsb0NBQWlDO0FBQ2pDLDBDQUEyRDtBQUMzRCwwQ0FBNkM7QUFDN0Msd0NBQWlHO0FBQ2pHLDBDQUFxRTtBQUVyRSxpQ0FBOEQ7QUFFOUQsSUFBTSxJQUFJLEdBQ04sSUFBSSw0QkFBcUIsRUFBRTtLQUN0QixPQUFPLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQztLQUNsQyxPQUFPLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQztLQUNsQyxPQUFPLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQztLQUNsQyxPQUFPLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQztLQUNsQyxPQUFPLENBQUMsV0FBVyxFQUFFLGNBQWMsQ0FBQztLQUNwQyxPQUFPLENBQUMsWUFBWSxFQUFFLGVBQWUsQ0FBQztLQUN0QyxPQUFPLENBQUMsc0JBQXNCLEVBQUUsdUJBQXVCLENBQUM7S0FDeEQsT0FBTyxDQUFDLHNCQUFzQixFQUFFLHVCQUF1QixDQUFDO0tBQ3hELGVBQWUsQ0FBQyxpQkFBaUIsRUFBRSxrQkFBa0IsRUFBRSxFQUFDLGVBQWUsRUFBRSxZQUFZLEVBQUMsQ0FBQztLQUN2RixlQUFlLENBQUMsaUJBQWlCLEVBQUUsb0JBQW9CLEVBQUUsRUFBQyxlQUFlLEVBQUUsVUFBVSxFQUFDLENBQUM7S0FDdkYsS0FBSyxFQUFFLENBQUM7QUFFakIsSUFBTSxVQUFVLEdBQ1osSUFBSSw0QkFBcUIsRUFBRTtLQUN0QixPQUFPLENBQUMsVUFBVSxFQUFFLGdCQUFnQixD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