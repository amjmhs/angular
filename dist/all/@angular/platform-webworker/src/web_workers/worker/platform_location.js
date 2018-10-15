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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var client_message_broker_1 = require("../shared/client_message_broker");
var message_bus_1 = require("../shared/message_bus");
var messaging_api_1 = require("../shared/messaging_api");
var serializer_1 = require("../shared/serializer");
var WebWorkerPlatformLocation = /** @class */ (function (_super) {
    __extends(WebWorkerPlatformLocation, _super);
    function WebWorkerPlatformLocation(brokerFactory, bus, _serializer) {
        var _this = _super.call(this) || this;
        _this._serializer = _serializer;
        _this._popStateListeners = [];
        _this._hashChangeListeners = [];
        _this._location = null;
        _this._broker = brokerFactory.createMessageBroker(messaging_api_1.ROUTER_CHANNEL);
        _this._channelSource = bus.from(messaging_api_1.ROUTER_CHANNEL);
        _this._channelSource.subscribe({
            next: function (msg) {
                var listeners = null;
                if (msg.hasOwnProperty('event')) {
                    var type = msg['event']['type'];
                    if (type === 'popstate') {
                        listeners = _this._popStateListeners;
                    }
                    else if (type === 'hashchange') {
                        listeners = _this._hashChangeListeners;
                    }
                    if (listeners) {
                        // There was a popState or hashChange event, so the location object thas been updated
                        _this._location = _this._serializer.deserialize(msg['location'], serializer_1.LocationType);
                        listeners.forEach(function (fn) { return fn(msg['event']); });
                    }
                }
            }
        });
        _this.initialized = new Promise(function (res) { return _this.initializedResolve = res; });
        return _this;
    }
    /** @internal **/
    WebWorkerPlatformLocation.prototype.init = function () {
        var _this = this;
        var args = new client_message_broker_1.UiArguments('getLocation');
        return this._broker.runOnService(args, serializer_1.LocationType).then(function (val) {
            _this._location = val;
            _this.initializedResolve();
            return true;
        }, function (err) { throw new Error(err); });
    };
    WebWorkerPlatformLocation.prototype.getBaseHrefFromDOM = function () {
        throw new Error('Attempt to get base href from DOM from WebWorker. You must either provide a value for the APP_BASE_HREF token through DI or use the hash location strategy.');
    };
    WebWorkerPlatformLocation.prototype.onPopState = function (fn) { this._popStateListeners.push(fn); };
    WebWorkerPlatformLocation.prototype.onHashChange = function (fn) { this._hashChangeListeners.push(fn); };
    Object.defineProperty(WebWorkerPlatformLocation.prototype, "pathname", {
        get: function () { return this._location ? this._location.pathname : '<unknown>'; },
        set: function (newPath) {
            if (this._location === null) {
                throw new Error('Attempt to set pathname before value is obtained from UI');
            }
            this._location.pathname = newPath;
            var fnArgs = [new client_message_broker_1.FnArg(newPath, 1 /* PRIMITIVE */)];
            var args = new client_message_broker_1.UiArguments('setPathname', fnArgs);
            this._broker.runOnService(args, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebWorkerPlatformLocation.prototype, "search", {
        get: function () { return this._location ? this._location.search : '<unknown>'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebWorkerPlatformLocation.prototype, "hash", {
        get: function () { return this._location ? this._location.hash : '<unknown>'; },
        enumerable: true,
        configurable: true
    });
    WebWorkerPlatformLocation.prototype.pushState = function (state, title, url) {
        var fnArgs = [
            new client_message_broker_1.FnArg(state, 1 /* PRIMITIVE */),
            new client_message_broker_1.FnArg(title, 1 /* PRIMITIVE */),
            new client_message_broker_1.FnArg(url, 1 /* PRIMITIVE */),
        ];
        var args = new client_message_broker_1.UiArguments('pushState', fnArgs);
        this._broker.runOnService(args, null);
    };
    WebWorkerPlatformLocation.prototype.replaceState = function (state, title, url) {
        var fnArgs = [
            new client_message_broker_1.FnArg(state, 1 /* PRIMITIVE */),
            new client_message_broker_1.FnArg(title, 1 /* PRIMITIVE */),
            new client_message_broker_1.FnArg(url, 1 /* PRIMITIVE */),
        ];
        var args = new client_message_broker_1.UiArguments('replaceState', fnArgs);
        this._broker.runOnService(args, null);
    };
    WebWorkerPlatformLocation.prototype.forward = function () {
        var args = new client_message_broker_1.UiArguments('forward');
        this._broker.runOnService(args, null);
    };
    WebWorkerPlatformLocation.prototype.back = function () {
        var args = new client_message_broker_1.UiArguments('back');
        this._broker.runOnService(args, null);
    };
    WebWorkerPlatformLocation = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [client_message_broker_1.ClientMessageBrokerFactory, message_bus_1.MessageBus, serializer_1.Serializer])
    ], WebWorkerPlatformLocation);
    return WebWorkerPlatformLocation;
}(common_1.PlatformLocation));
exports.WebWorkerPlatformLocation = WebWorkerPlatformLocation;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm1fbG9jYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS13ZWJ3b3JrZXIvc3JjL3dlYl93b3JrZXJzL3dvcmtlci9wbGF0Zm9ybV9sb2NhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCwwQ0FBeUU7QUFDekUsc0NBQXVEO0FBQ3ZELHlFQUFvSDtBQUNwSCxxREFBaUQ7QUFDakQseURBQXVEO0FBQ3ZELG1EQUErRTtBQUcvRTtJQUErQyw2Q0FBZ0I7SUFVN0QsbUNBQ0ksYUFBeUMsRUFBRSxHQUFlLEVBQVUsV0FBdUI7UUFEL0YsWUFFRSxpQkFBTyxTQXdCUjtRQXpCdUUsaUJBQVcsR0FBWCxXQUFXLENBQVk7UUFUdkYsd0JBQWtCLEdBQW9CLEVBQUUsQ0FBQztRQUN6QywwQkFBb0IsR0FBb0IsRUFBRSxDQUFDO1FBQzNDLGVBQVMsR0FBaUIsSUFBTSxDQUFDO1FBU3ZDLEtBQUksQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDLG1CQUFtQixDQUFDLDhCQUFjLENBQUMsQ0FBQztRQUNqRSxLQUFJLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsOEJBQWMsQ0FBQyxDQUFDO1FBRS9DLEtBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDO1lBQzVCLElBQUksRUFBRSxVQUFDLEdBQXlCO2dCQUM5QixJQUFJLFNBQVMsR0FBeUIsSUFBSSxDQUFDO2dCQUMzQyxJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLEVBQUU7b0JBQy9CLElBQU0sSUFBSSxHQUFXLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDMUMsSUFBSSxJQUFJLEtBQUssVUFBVSxFQUFFO3dCQUN2QixTQUFTLEdBQUcsS0FBSSxDQUFDLGtCQUFrQixDQUFDO3FC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