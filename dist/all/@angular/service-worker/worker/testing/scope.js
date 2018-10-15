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
var rxjs_1 = require("rxjs");
var sha1_1 = require("../src/sha1");
var cache_1 = require("./cache");
var fetch_1 = require("./fetch");
var mock_1 = require("./mock");
var EMPTY_SERVER_STATE = new mock_1.MockServerStateBuilder().build();
var MOCK_ORIGIN = 'http://localhost/';
var MockClient = /** @class */ (function () {
    function MockClient(id) {
        this.id = id;
        this.queue = new rxjs_1.Subject();
        this.messages = [];
    }
    MockClient.prototype.postMessage = function (message) {
        this.messages.push(message);
        this.queue.next(message);
    };
    return MockClient;
}());
exports.MockClient = MockClient;
var SwTestHarnessBuilder = /** @class */ (function () {
    function SwTestHarnessBuilder() {
        this.server = EMPTY_SERVER_STATE;
        this.caches = new cache_1.MockCacheStorage(MOCK_ORIGIN);
    }
    SwTestHarnessBuilder.prototype.withCacheState = function (cache) {
        this.caches = new cache_1.MockCacheStorage(MOCK_ORIGIN, cache);
        return this;
    };
    SwTestHarnessBuilder.prototype.withServerState = function (state) {
        this.server = state;
        return this;
    };
    SwTestHarnessBuilder.prototype.build = function () { return new SwTestHarness(this.server, this.caches); };
    return SwTestHarnessBuilder;
}());
exports.SwTestHarnessBuilder = SwTestHarnessBuilder;
var MockClients = /** @class */ (function () {
    function MockClients() {
        this.clients = new Map();
    }
    MockClients.prototype.add = function (clientId) {
        if (this.clients.has(clientId)) {
            return;
        }
        this.clients.set(clientId, new MockClient(clientId));
    };
    MockClients.prototype.remove = function (clientId) { this.clients.delete(clientId); };
    MockClients.prototype.get = function (id) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, this.clients.get(id)];
        }); });
    };
    MockClients.prototype.getMock = function (id) { return this.clients.get(id); };
    MockClients.prototype.matchAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.clients.values())];
            });
        });
    };
    MockClients.prototype.claim = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    return MockClients;
}());
exports.MockClients = MockClients;
var SwTestHarness = /** @class */ (function () {
    function SwTestHarness(server, caches) {
        var _this = this;
        this.server = server;
        this.caches = caches;
        this.clients = new MockClients();
        this.eventHandlers = new Map();
        this.skippedWaiting = true;
        this.selfMessageQueue = [];
        this.notifications = [];
        this.registration = {
            active: {
                postMessage: function (msg) { _this.selfMessageQueue.push(msg); },
            },
            scope: MOCK_ORIGIN,
            showNotification: function (title, options) {
                _this.notifications.push({ title: title, options: options });
            },
            unregister: function () { _this.unregistered = true; },
        };
        this.timers = [];
        this.time = Date.now();
    }
    SwTestHarness.envIsSupported = function () {
        return (typeof URL === 'function') ||
            (typeof require === 'function' && typeof require('url')['parse'] === 'function');
    };
    SwTestHarness.prototype.resolveSelfMessages = function () {
        return __awaiter(this, void 0, void 0, function () {
            var queue;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.selfMessageQueue.length > 0)) return [3 /*break*/, 2];
                        queue = this.selfMessageQueue;
                        this.selfMessageQueue = [];
                        return [4 /*yield*/, queue.reduce(function (previous, msg) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, previous];
                                        case 1:
                                            _a.sent();
                                            return [4 /*yield*/, this.handleMessage(msg, null)];
                                        case 2:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }, Promise.resolve())];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 0];
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    SwTestHarness.prototype.startup = function (firstTime) {
        if (firstTime === void 0) { firstTime = false; }
        return __awaiter(this, void 0, void 0, function () {
            var skippedWaiting, installEvent, activateEvent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!firstTime) {
                            return [2 /*return*/, null];
                        }
                        skippedWaiting = false;
                        if (!this.eventHandlers.has('install')) return [3 /*break*/, 2];
                        installEvent = new MockInstallEvent();
                        this.eventHandlers.get('install')(installEvent);
                        return [4 /*yield*/, installEvent.ready];
                    case 1:
                        _a.sent();
                        skippedWaiting = this.skippedWaiting;
                        _a.label = 2;
                    case 2:
                        if (!this.eventHandlers.has('activate')) return [3 /*break*/, 4];
                        activateEvent = new MockActivateEvent();
                        this.eventHandlers.get('activate')(activateEvent);
                        return [4 /*yield*/, activateEvent.ready];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, skippedWaiting];
                }
            });
        });
    };
    SwTestHarness.prototype.updateServerState = function (server) { this.server = server || EMPTY_SERVER_STATE; };
    SwTestHarness.prototype.fetch = function (req) {
        if (typeof req === 'string') {
            if (req.startsWith(MOCK_ORIGIN)) {
                req = '/' + req.substr(MOCK_ORIGIN.length);
            }
            return this.server.fetch(new fetch_1.MockRequest(req));
        }
        else {
            var mockReq = req.clone();
            if (mockReq.url.startsWith(MOCK_ORIGIN)) {
                mockReq.url = '/' + mockReq.url.substr(MOCK_ORIGIN.length);
            }
            return this.server.fetch(mockReq);
        }
    };
    SwTestHarness.prototype.addEventListener = function (event, handler) {
        this.eventHandlers.set(event, handler);
    };
    SwTestHarness.prototype.removeEventListener = function (event, handler) { this.eventHandlers.delete(event); };
    SwTestHarness.prototype.newRequest = function (url, init) {
        if (init === void 0) { init = {}; }
        return new fetch_1.MockRequest(url, init);
    };
    SwTestHarness.prototype.newResponse = function (body, init) {
        if (init === void 0) { init = {}; }
        return new fetch_1.MockResponse(body, init);
    };
    SwTestHarness.prototype.newHeaders = function (headers) {
        return Object.keys(headers).reduce(function (mock, name) {
            mock.set(name, headers[name]);
            return mock;
        }, new fetch_1.MockHeaders());
    };
    SwTestHarness.prototype.parseUrl = function (url, relativeTo) {
        if (typeof URL === 'function') {
            var obj = new URL(url, relativeTo);
            return { origin: obj.origin, path: obj.pathname };
        }
        else {
            var obj = require('url').parse(url);
            return { origin: obj.origin, path: obj.pathname };
        }
    };
    SwTestHarness.prototype.skipWaiting = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            this.skippedWaiting = true;
            return [2 /*return*/];
        }); });
    };
    SwTestHarness.prototype.waitUntil = function (promise) { };
    SwTestHarness.prototype.handleFetch = function (req, clientId) {
        if (clientId === void 0) { clientId = null; }
        if (!this.eventHandlers.has('fetch')) {
            throw new Error('No fetch handler registered');
        }
        var event = new MockFetchEvent(req, clientId);
        this.eventHandlers.get('fetch').call(this, event);
        if (clientId) {
            this.clients.add(clientId);
        }
        return [event.response, event.ready];
    };
    SwTestHarness.prototype.handleMessage = function (data, clientId) {
        if (!this.eventHandlers.has('message')) {
            throw new Error('No message handler registered');
        }
        var event;
        if (clientId === null) {
            event = new MockMessageEvent(data, null);
        }
        else {
            this.clients.add(clientId);
            event = new MockMessageEvent(data, this.clients.getMock(clientId) || null);
        }
        this.eventHandlers.get('message').call(this, event);
        return event.ready;
    };
    SwTestHarness.prototype.handlePush = function (data) {
        if (!this.eventHandlers.has('push')) {
            throw new Error('No push handler registered');
        }
        var event = new MockPushEvent(data);
        this.eventHandlers.get('push').call(this, event);
        return event.ready;
    };
    SwTestHarness.prototype.handleClick = function (notification, action) {
        if (!this.eventHandlers.has('notificationclick')) {
            throw new Error('No notificationclick handler registered');
        }
        var event = new MockNotificationEvent(notification, action);
        this.eventHandlers.get('notificationclick').call(this, event);
        return event.ready;
    };
    SwTestHarness.prototype.timeout = function (ms) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.timers.push({
                at: _this.time + ms,
                duration: ms,
                fn: resolve,
                fired: false,
            });
        });
    };
    SwTestHarness.prototype.advance = function (by) {
        var _this = this;
        this.time += by;
        this.timers.filter(function (timer) { return !timer.fired; })
            .filter(function (timer) { return timer.at <= _this.time; })
            .forEach(function (timer) {
            timer.fired = true;
            timer.fn();
        });
    };
    SwTestHarness.prototype.isClient = function (obj) { return obj instanceof MockClient; };
    return SwTestHarness;
}());
exports.SwTestHarness = SwTestHarness;
var AssetGroupBuilder = /** @class */ (function () {
    function AssetGroupBuilder(up, name) {
        this.up = up;
        this.name = name;
        this.files = [];
    }
    AssetGroupBuilder.prototype.addFile = function (url, contents, hashed) {
        if (hashed === void 0) { hashed = true; }
        var file = { url: url, contents: contents, hash: undefined };
        if (hashed) {
            file.hash = sha1_1.sha1(contents);
        }
        this.files.push(file);
        return this;
    };
    AssetGroupBuilder.prototype.finish = function () { return this.up; };
    AssetGroupBuilder.prototype.toManifestGroup = function () { return null; };
    return AssetGroupBuilder;
}());
exports.AssetGroupBuilder = AssetGroupBuilder;
var ConfigBuilder = /** @class */ (function () {
    function ConfigBuilder() {
        this.assetGroups = new Map();
    }
    ConfigBuilder.prototype.addAssetGroup = function (name) {
        var builder = new AssetGroupBuilder(this, name);
        this.assetGroups.set(name, builder);
        return this;
    };
    ConfigBuilder.prototype.finish = function () {
        var assetGroups = Array.from(this.assetGroups.values()).map(function (group) { return group.toManifestGroup(); });
        var hashTable = {};
        return {
            configVersion: 1,
            index: '/index.html', assetGroups: assetGroups,
            navigationUrls: [], hashTable: hashTable,
        };
    };
    return ConfigBuilder;
}());
exports.ConfigBuilder = ConfigBuilder;
var OneTimeContext = /** @class */ (function () {
    function OneTimeContext() {
        this.queue = [];
    }
    OneTimeContext.prototype.waitUntil = function (promise) { this.queue.push(promise); };
    Object.defineProperty(OneTimeContext.prototype, "ready", {
        get: function () {
            var _this = this;
            return (function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(this.queue.length > 0)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.queue.shift()];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 0];
                        case 2: return [2 /*return*/];
                    }
                });
            }); })();
        },
        enumerable: true,
        configurable: true
    });
    return OneTimeContext;
}());
var MockExtendableEvent = /** @class */ (function (_super) {
    __extends(MockExtendableEvent, _super);
    function MockExtendableEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MockExtendableEvent;
}(OneTimeContext));
var MockFetchEvent = /** @class */ (function (_super) {
    __extends(MockFetchEvent, _super);
    function MockFetchEvent(request, clientId) {
        var _this = _super.call(this) || this;
        _this.request = request;
        _this.clientId = clientId;
        _this.response = Promise.resolve(undefined);
        return _this;
    }
    MockFetchEvent.prototype.respondWith = function (promise) {
        this.response = promise;
        return promise;
    };
    return MockFetchEvent;
}(MockExtendableEvent));
var MockMessageEvent = /** @class */ (function (_super) {
    __extends(MockMessageEvent, _super);
    function MockMessageEvent(data, source) {
        var _this = _super.call(this) || this;
        _this.data = data;
        _this.source = source;
        return _this;
    }
    return MockMessageEvent;
}(MockExtendableEvent));
var MockPushEvent = /** @class */ (function (_super) {
    __extends(MockPushEvent, _super);
    function MockPushEvent(_data) {
        var _this = _super.call(this) || this;
        _this._data = _data;
        _this.data = {
            json: function () { return _this._data; },
        };
        return _this;
    }
    return MockPushEvent;
}(MockExtendableEvent));
var MockNotificationEvent = /** @class */ (function (_super) {
    __extends(MockNotificationEvent, _super);
    function MockNotificationEvent(_notification, action) {
        var _this = _super.call(this) || this;
        _this._notification = _notification;
        _this.action = action;
        _this.notification = __assign({}, _this._notification, { close: function () { return undefined; } });
        return _this;
    }
    return MockNotificationEvent;
}(MockExtendableEvent));
var MockInstallEvent = /** @class */ (function (_super) {
    __extends(MockInstallEvent, _super);
    function MockInstallEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MockInstallEvent;
}(MockExtendableEvent));
var MockActivateEvent = /** @class */ (function (_super) {
    __extends(MockActivateEvent, _super);
    function MockActivateEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MockActivateEvent;
}(MockExtendableEvent));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NvcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9zZXJ2aWNlLXdvcmtlci93b3JrZXIvdGVzdGluZy9zY29wZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsNkJBQTZCO0FBSTdCLG9DQUFpQztBQUVqQyxpQ0FBeUM7QUFDekMsaUNBQStEO0FBQy9ELCtCQUErRDtBQUUvRCxJQUFNLGtCQUFrQixHQUFHLElBQUksNkJBQXNCLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUVoRSxJQUFNLFdBQVcsR0FBRyxtQkFBbUIsQ0FBQztBQUV4QztJQUdFLG9CQUFxQixFQUFVO1FBQVYsT0FBRSxHQUFGLEVBQUUsQ0FBUTtRQUYvQixVQUFLLEdBQUcsSUFBSSxjQUFPLEVBQVUsQ0FBQztRQUlyQixhQUFRLEdBQWEsRUFBRSxDQUFDO0lBRkMsQ0FBQztJQUluQyxnQ0FBVyxHQUFYLFVBQVksT0FBZTtRQUN6QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM1QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBQ0gsaUJBQUM7QUFBRCxDQUFDLEFBWEQsSUFXQztBQVhZLGdDQUFVO0FBYXZCO0lBQUE7UUFDVSxXQUFNLEdBQUcsa0JBQWtCLENBQUM7UUFDNUIsV0FBTSxHQUFHLElBQUksd0JBQWdCLENBQUMsV0FBVyxDQUFDLENBQUM7SUFhckQsQ0FBQztJQVhDLDZDQUFjLEdBQWQsVUFBZSxLQUFhO1FBQzFCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSx3QkFBZ0IsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdkQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFD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