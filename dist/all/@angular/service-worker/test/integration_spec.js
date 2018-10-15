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
var operators_1 = require("rxjs/operators");
var low_level_1 = require("../src/low_level");
var push_1 = require("../src/push");
var update_1 = require("../src/update");
var mock_1 = require("../testing/mock");
var db_cache_1 = require("../worker/src/db-cache");
var driver_1 = require("../worker/src/driver");
var fetch_1 = require("../worker/testing/fetch");
var mock_2 = require("../worker/testing/mock");
var scope_1 = require("../worker/testing/scope");
var async_1 = require("./async");
var dist = new mock_2.MockFileSystemBuilder().addFile('/only.txt', 'this is only').build();
var distUpdate = new mock_2.MockFileSystemBuilder().addFile('/only.txt', 'this is only v2').build();
function obsToSinglePromise(obs) {
    return obs.pipe(operators_1.take(1)).toPromise();
}
var manifest = {
    configVersion: 1,
    appData: { version: '1' },
    index: '/only.txt',
    assetGroups: [{
            name: 'assets',
            installMode: 'prefetch',
            updateMode: 'prefetch',
            urls: ['/only.txt'],
            patterns: [],
        }],
    navigationUrls: [],
    hashTable: mock_2.tmpHashTableForFs(dist),
};
var manifestUpdate = {
    configVersion: 1,
    appData: { version: '2' },
    index: '/only.txt',
    assetGroups: [{
            name: 'assets',
            installMode: 'prefetch',
            updateMode: 'prefetch',
            urls: ['/only.txt'],
            patterns: [],
        }],
    navigationUrls: [],
    hashTable: mock_2.tmpHashTableForFs(distUpdate),
};
var server = new mock_2.MockServerStateBuilder().withStaticFiles(dist).withManifest(manifest).build();
var serverUpdate = new mock_2.MockServerStateBuilder().withStaticFiles(distUpdate).withManifest(manifestUpdate).build();
(function () {
    var _this = this;
    // Skip environments that don't support the minimum APIs needed to run the SW tests.
    if (!scope_1.SwTestHarness.envIsSupported()) {
        return;
    }
    describe('ngsw + companion lib', function () {
        var mock;
        var comm;
        var reg;
        var scope;
        var driver;
        async_1.async_beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Fire up the client.
                        mock = new mock_1.MockServiceWorkerContainer();
                        comm = new low_level_1.NgswCommChannel(mock);
                        scope = new scope_1.SwTestHarnessBuilder().withServerState(server).build();
                        driver = new driver_1.Driver(scope, scope, new db_cache_1.CacheDatabase(scope, scope));
                        scope.clients.add('default');
                        scope.clients.getMock('default').queue.subscribe(function (msg) { mock.sendMessage(msg); });
                        mock.messages.subscribe(function (msg) { scope.handleMessage(msg, 'default'); });
                        mock.notificationClicks.subscribe(function (msg) { scope.handleMessage(msg, 'default'); });
                        mock.setupSw();
                        reg = mock.mockRegistration;
                        return [4 /*yield*/, Promise.all(scope.handleFetch(new fetch_1.MockRequest('/only.txt'), 'default'))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, driver.initialized];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        async_1.async_it('communicates back and forth via update check', function () { return __awaiter(_this, void 0, void 0, function () {
            var update;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        update = new update_1.SwUpdate(comm);
                        return [4 /*yield*/, update.checkForUpdate()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        async_1.async_it('detects an actual update', function () { return __awaiter(_this, void 0, void 0, function () {
            var update, gotUpdateNotice;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        update = new update_1.SwUpdate(comm);
                        scope.updateServerState(serverUpdate);
                        gotUpdateNotice = (function () { return __awaiter(_this, void 0, void 0, function () { var notice; return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, obsToSinglePromise(update.available)];
                                case 1:
                                    notice = _a.sent();
                                    return [2 /*return*/];
                            }
                        }); }); })();
                        return [4 /*yield*/, update.checkForUpdate()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, gotUpdateNotice];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        async_1.async_it('receives push message notifications', function () { return __awaiter(_this, void 0, void 0, function () {
            var push, gotPushNotice;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        push = new push_1.SwPush(comm);
                        scope.updateServerState(serverUpdate);
                        gotPushNotice = (function () { return __awaiter(_this, void 0, void 0, function () {
                            var message;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, obsToSinglePromise(push.messages)];
                                    case 1:
                                        message = _a.sent();
                                        expect(message).toEqual({
                                            test: 'success',
                                        });
                                        return [2 /*return*/];
                                }
                            });
                        }); })();
                        return [4 /*yield*/, scope.handlePush({
                                test: 'success',
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, gotPushNotice];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        async_1.async_it('receives push message click events', function () { return __awaiter(_this, void 0, void 0, function () {
            var push, gotNotificationClick;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        push = new push_1.SwPush(comm);
                        scope.updateServerState(serverUpdate);
                        gotNotificationClick = (function () { return __awaiter(_this, void 0, void 0, function () {
                            var event;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, obsToSinglePromise(push.notificationClicks)];
                                    case 1:
                                        event = _a.sent();
                                        expect(event.action).toEqual('clicked');
                                        expect(event.notification.title).toEqual('This is a test');
                                        return [2 /*return*/];
                                }
                            });
                        }); })();
                        return [4 /*yield*/, scope.handleClick({ title: 'This is a test' }, 'clicked')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, gotNotificationClick];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWdyYXRpb25fc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3NlcnZpY2Utd29ya2VyL3Rlc3QvaW50ZWdyYXRpb25fc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR0gsNENBQW9DO0FBRXBDLDhDQUFpRDtBQUNqRCxvQ0FBbUM7QUFDbkMsd0NBQXVDO0FBQ3ZDLHdDQUEwRjtBQUMxRixtREFBcUQ7QUFDckQsK0NBQTRDO0FBRTVDLGlEQUFvRDtBQUNwRCwrQ0FBd0c7QUFDeEcsaURBQTRFO0FBRTVFLGlDQUE4RDtBQUU5RCxJQUFNLElBQUksR0FBRyxJQUFJLDRCQUFxQixFQUFFLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxjQUFjLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUV0RixJQUFNLFVBQVUsR0FBRyxJQUFJLDRCQUFxQixFQUFFLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBRS9GLDRCQUErQixHQUFrQjtJQUMvQyxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsZ0JBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ3ZDLENBQUM7QUFFRCxJQUFNLFFBQVEsR0FBYTtJQUN6QixhQUFhLEVBQUUsQ0FBQztJQUNoQixPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFDO0lBQ3ZCLEtBQUssRUFBRSxXQUFXO0lBQ2xCLFdBQVcsRUFBRSxDQUFDO1lBQ1osSUFBSSxFQUFFLFFBQVE7WUFDZCxXQUFXLEVBQUUsVUFBVTtZQUN2QixVQUFVLEVBQUUsVUFBVTtZQUN0QixJQUFJLEVBQUUsQ0FBQyxXQUFXLENBQUM7WUFDbkIsUUFBUSxFQUFFLEVBQUU7U0FDYixDQUFDO0lBQ0Ys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