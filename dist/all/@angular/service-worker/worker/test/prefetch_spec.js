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
var assets_1 = require("../src/assets");
var db_cache_1 = require("../src/db-cache");
var idle_1 = require("../src/idle");
var mock_1 = require("../testing/mock");
var scope_1 = require("../testing/scope");
var async_1 = require("./async");
var dist = new mock_1.MockFileSystemBuilder()
    .addFile('/foo.txt', 'this is foo')
    .addFile('/bar.txt', 'this is bar')
    .build();
var manifest = mock_1.tmpManifestSingleAssetGroup(dist);
var server = new mock_1.MockServerStateBuilder().withStaticFiles(dist).withManifest(manifest).build();
var scope = new scope_1.SwTestHarnessBuilder().withServerState(server).build();
var db = new db_cache_1.CacheDatabase(scope, scope);
(function () {
    var _this = this;
    // Skip environments that don't support the minimum APIs needed to run the SW tests.
    if (!scope_1.SwTestHarness.envIsSupported()) {
        return;
    }
    describe('prefetch assets', function () {
        var group;
        var idle;
        beforeEach(function () {
            idle = new idle_1.IdleScheduler(null, 3000, {
                log: function (v, ctx) {
                    if (ctx === void 0) { ctx = ''; }
                    return console.error(v, ctx);
                },
            });
            group = new assets_1.PrefetchAssetGroup(scope, scope, idle, manifest.assetGroups[0], mock_1.tmpHashTable(manifest), db, 'test');
        });
        async_1.async_it('initializes without crashing', function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, group.initializeFully()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        }); }); });
        async_1.async_it('fully caches the two files', function () { return __awaiter(_this, void 0, void 0, function () {
            var res1, res2, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, group.initializeFully()];
                    case 1:
                        _c.sent();
                        scope.updateServerState();
                        return [4 /*yield*/, group.handleFetch(scope.newRequest('/foo.txt'), scope)];
                    case 2:
                        res1 = _c.sent();
                        return [4 /*yield*/, group.handleFetch(scope.newRequest('/bar.txt'), scope)];
                    case 3:
                        res2 = _c.sent();
                        _a = expect;
                        return [4 /*yield*/, res1.text()];
                    case 4:
                        _a.apply(void 0, [_c.sent()]).toEqual('this is foo');
                        _b = expect;
                        return [4 /*yield*/, res2.text()];
                    case 5:
                        _b.apply(void 0, [_c.sent()]).toEqual('this is bar');
                        return [2 /*return*/];
                }
            });
        }); });
        async_1.async_it('persists the cache across restarts', function () { return __awaiter(_this, void 0, void 0, function () {
            var freshScope, res1, res2, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, group.initializeFully()];
                    case 1:
                        _c.sent();
                        freshScope = new scope_1.SwTestHarnessBuilder().withCacheState(scope.caches.dehydrate()).build();
                        group = new assets_1.PrefetchAssetGroup(freshScope, freshScope, idle, manifest.assetGroups[0], mock_1.tmpHashTable(manifest), new db_cache_1.CacheDatabase(freshScope, freshScope), 'test');
                        return [4 /*yield*/, group.initializeFully()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, group.handleFetch(scope.newRequest('/foo.txt'), scope)];
                    case 3:
                        res1 = _c.sent();
                        return [4 /*yield*/, group.handleFetch(scope.newRequest('/bar.txt'), scope)];
                    case 4:
                        res2 = _c.sent();
                        _a = expect;
                        return [4 /*yield*/, res1.text()];
                    case 5:
                        _a.apply(void 0, [_c.sent()]).toEqual('this is foo');
                        _b = expect;
                        return [4 /*yield*/, res2.text()];
                    case 6:
                        _b.apply(void 0, [_c.sent()]).toEqual('this is bar');
                        return [2 /*return*/];
                }
            });
        }); });
        async_1.async_it('caches properly if resources are requested before initialization', function () { return __awaiter(_this, void 0, void 0, function () {
            var res1, res2, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, group.handleFetch(scope.newRequest('/foo.txt'), scope)];
                    case 1:
                        res1 = _c.sent();
                        return [4 /*yield*/, group.handleFetch(scope.newRequest('/bar.txt'), scope)];
                    case 2:
                        res2 = _c.sent();
                        _a = expect;
                        return [4 /*yield*/, res1.text()];
                    case 3:
                        _a.apply(void 0, [_c.sent()]).toEqual('this is foo');
                        _b = expect;
                        return [4 /*yield*/, res2.text()];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toEqual('this is bar');
                        scope.updateServerState();
                        return [4 /*yield*/, group.initializeFully()];
                    case 5:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        async_1.async_it('throws if the server-side content does not match the manifest hash', function () { return __awaiter(_this, void 0, void 0, function () {
            var badHashFs, badServer, badScope, err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        badHashFs = dist.extend().addFile('/foo.txt', 'corrupted file').build();
                        badServer = new mock_1.MockServerStateBuilder().withManifest(manifest).withStaticFiles(badHashFs).build();
                        badScope = new scope_1.SwTestHarnessBuilder().withServerState(badServer).build();
                        group = new assets_1.PrefetchAssetGroup(badScope, badScope, idle, manifest.assetGroups[0], mock_1.tmpHashTable(manifest), new db_cache_1.CacheDatabase(badScope, badScope), 'test');
                        return [4 /*yield*/, errorFrom(group.initializeFully())];
                    case 1:
                        err = _a.sent();
                        expect(err.message).toContain('Hash mismatch');
                        return [2 /*return*/];
                }
            });
        }); });
    });
})();
function errorFrom(promise) {
    return promise.catch(function (err) { return err; });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZmV0Y2hfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3NlcnZpY2Utd29ya2VyL3dvcmtlci90ZXN0L3ByZWZldGNoX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILHdDQUFpRDtBQUNqRCw0Q0FBOEM7QUFDOUMsb0NBQTBDO0FBQzFDLHdDQUF5SDtBQUN6SCwwQ0FBcUU7QUFFckUsaUNBQTRDO0FBRTVDLElBQU0sSUFBSSxHQUFHLElBQUksNEJBQXFCLEVBQUU7S0FDdEIsT0FBTyxDQUFDLFVBQVUsRUFBRSxhQUFhLENBQUM7S0FDbEMsT0FBTyxDQUFDLFVBQVUsRUFBRSxhQUFhLENBQUM7S0FDbEMsS0FBSyxFQUFFLENBQUM7QUFFMUIsSUFBTSxRQUFRLEdBQUcsa0NBQTJCLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFbkQsSUFBTSxNQUFNLEdBQUcsSUFBSSw2QkFBc0IsRUFBRSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7QUFFakcsSUFBTSxLQUFLLEdBQUcsSUFBSSw0QkFBb0IsRUFBRSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUV6RSxJQUFNLEVBQUUsR0FBRyxJQUFJLHdCQUFhLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBSTNDLENBQUM7SUFBQSxpQkF5REE7SUF4REMsb0ZBQW9GO0lBQ3BGLElBQUksQ0FBQyxxQkFBYSxDQUFDLGNBQWMsRUFBRSxFQUFFO1FBQ25DLE9BQU87S0FDUjtJQUNELFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtRQUMxQixJQUFJLEtBQXlCLENBQUM7UUFDOUIsSUFBSSxJQUFtQixDQUFDO1FBQ3hCLFVBQVUs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