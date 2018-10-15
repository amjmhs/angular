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
var rxjs_1 = require("rxjs");
exports.patchDecodeBase64 = function (proto) {
    var unpatch = function () { return undefined; };
    if ((typeof atob === 'undefined') && (typeof Buffer === 'function')) {
        var oldDecodeBase64_1 = proto.decodeBase64;
        var newDecodeBase64 = function (input) { return Buffer.from(input, 'base64').toString('binary'); };
        proto.decodeBase64 = newDecodeBase64;
        unpatch = function () { proto.decodeBase64 = oldDecodeBase64_1; };
    }
    return unpatch;
};
var MockServiceWorkerContainer = /** @class */ (function () {
    function MockServiceWorkerContainer() {
        this.onControllerChange = [];
        this.onMessage = [];
        this.mockRegistration = null;
        this.controller = null;
        this.messages = new rxjs_1.Subject();
        this.notificationClicks = new rxjs_1.Subject();
    }
    MockServiceWorkerContainer.prototype.addEventListener = function (event, handler) {
        if (event === 'controllerchange') {
            this.onControllerChange.push(handler);
        }
        else if (event === 'message') {
            this.onMessage.push(handler);
        }
    };
    MockServiceWorkerContainer.prototype.removeEventListener = function (event, handler) {
        if (event === 'controllerchange') {
            this.onControllerChange = this.onControllerChange.filter(function (h) { return h !== handler; });
        }
        else if (event === 'message') {
            this.onMessage = this.onMessage.filter(function (h) { return h !== handler; });
        }
    };
    MockServiceWorkerContainer.prototype.register = function (url) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    MockServiceWorkerContainer.prototype.getRegistration = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.mockRegistration];
            });
        });
    };
    MockServiceWorkerContainer.prototype.setupSw = function (url) {
        var _this = this;
        if (url === void 0) { url = '/ngsw-worker.js'; }
        this.mockRegistration = new MockServiceWorkerRegistration();
        this.controller = new MockServiceWorker(this, url);
        this.onControllerChange.forEach(function (onChange) { return onChange(_this.controller); });
    };
    MockServiceWorkerContainer.prototype.sendMessage = function (value) {
        this.onMessage.forEach(function (onMessage) { return onMessage({
            data: value,
        }); });
    };
    return MockServiceWorkerContainer;
}());
exports.MockServiceWorkerContainer = MockServiceWorkerContainer;
var MockServiceWorker = /** @class */ (function () {
    function MockServiceWorker(mock, scriptURL) {
        this.mock = mock;
        this.scriptURL = scriptURL;
    }
    MockServiceWorker.prototype.postMessage = function (value) { this.mock.messages.next(value); };
    return MockServiceWorker;
}());
exports.MockServiceWorker = MockServiceWorker;
var MockServiceWorkerRegistration = /** @class */ (function () {
    function MockServiceWorkerRegistration() {
        this.pushManager = new MockPushManager();
    }
    return MockServiceWorkerRegistration;
}());
exports.MockServiceWorkerRegistration = MockServiceWorkerRegistration;
var MockPushManager = /** @class */ (function () {
    function MockPushManager() {
        this.subscription = null;
    }
    MockPushManager.prototype.getSubscription = function () { return Promise.resolve(this.subscription); };
    MockPushManager.prototype.subscribe = function (options) {
        this.subscription = new MockPushSubscription();
        return Promise.resolve(this.subscription);
    };
    return MockPushManager;
}());
exports.MockPushManager = MockPushManager;
var MockPushSubscription = /** @class */ (function () {
    function MockPushSubscription() {
    }
    MockPushSubscription.prototype.unsubscribe = function () { return Promise.resolve(true); };
    return MockPushSubscription;
}());
exports.MockPushSubscription = MockPushSubscription;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9jay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3NlcnZpY2Utd29ya2VyL3Rlc3RpbmcvbW9jay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsNkJBQTZCO0FBRWhCLFFBQUEsaUJBQWlCLEdBQUcsVUFBQyxLQUFrQztJQUNsRSxJQUFJLE9BQU8sR0FBZSxjQUFNLE9BQUEsU0FBUyxFQUFULENBQVMsQ0FBQztJQUUxQyxJQUFJLENBQUMsT0FBTyxJQUFJLEtBQUssV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLE1BQU0sS0FBSyxVQUFVLENBQUMsRUFBRTtRQUNuRSxJQUFNLGlCQUFlLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQztRQUMzQyxJQUFNLGVBQWUsR0FBRyxVQUFDLEtBQWEsSUFBSyxPQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBL0MsQ0FBK0MsQ0FBQztRQUUzRixLQUFLLENBQUMsWUFBWSxHQUFHLGVBQWUsQ0FBQztRQUNyQyxPQUFPLEdBQUcsY0FBUSxLQUFLLENBQUMsWUFBWSxHQUFHLGlCQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDM0Q7SUFFRCxPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDLENBQUM7QUFFRjtJQUFBO1FBQ1UsdUJBQWtCLEdBQWUsRUFBRSxDQUFDO1FBQ3BDLGNBQVMsR0FBZSxFQUFFLENBQUM7UUFDbkMscUJBQWdCLEdBQXVDLElBQUksQ0FBQztRQUM1RCxlQUFVLEdBQTJCLElBQUksQ0FBQztRQUMxQyxhQUFRLEdBQUcsSUFBSSxjQUFPLEVBQUUsQ0FBQztRQUN6Qix1QkFBa0IsR0FBRyxJQUFJLGNBQU8sRUFBRSxDQUFDO0lBbUNyQyxDQUFDO0lBakNDLHFEQUFnQixHQUFo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