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
Object.defineProperty(exports, "__esModule", { value: true });
var xhr2 = require('xhr2');
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var http_2 = require("@angular/common/http");
var rxjs_1 = require("rxjs");
var isAbsoluteUrl = /^[a-zA-Z\-\+.]+:\/\//;
function validateRequestUrl(url) {
    if (!isAbsoluteUrl.test(url)) {
        throw new Error("URLs requested via Http on the server must be absolute. URL: " + url);
    }
}
var ServerXhr = /** @class */ (function () {
    function ServerXhr() {
    }
    ServerXhr.prototype.build = function () { return new xhr2.XMLHttpRequest(); };
    ServerXhr = __decorate([
        core_1.Injectable()
    ], ServerXhr);
    return ServerXhr;
}());
exports.ServerXhr = ServerXhr;
var ServerXsrfStrategy = /** @class */ (function () {
    function ServerXsrfStrategy() {
    }
    ServerXsrfStrategy.prototype.configureRequest = function (req) { };
    ServerXsrfStrategy = __decorate([
        core_1.Injectable()
    ], ServerXsrfStrategy);
    return ServerXsrfStrategy;
}());
exports.ServerXsrfStrategy = ServerXsrfStrategy;
var ZoneMacroTaskWrapper = /** @class */ (function () {
    function ZoneMacroTaskWrapper() {
    }
    ZoneMacroTaskWrapper.prototype.wrap = function (request) {
        var _this = this;
        return new rxjs_1.Observable(function (observer) {
            var task = null;
            var scheduled = false;
            var sub = null;
            var savedResult = null;
            var savedError = null;
            var scheduleTask = function (_task) {
                task = _task;
                scheduled = true;
                var delegate = _this.delegate(request);
                sub = delegate.subscribe(function (res) { return savedResult = res; }, function (err) {
                    if (!scheduled) {
                        throw new Error('An http observable was completed twice. This shouldn\'t happen, please file a bug.');
                    }
                    savedError = err;
                    scheduled = false;
                    task.invoke();
                }, function () {
                    if (!scheduled) {
                        throw new Error('An http observable was completed twice. This shouldn\'t happen, please file a bug.');
                    }
                    scheduled = false;
                    task.invoke();
                });
            };
            var cancelTask = function (_task) {
                if (!scheduled) {
                    return;
                }
                scheduled = false;
                if (sub) {
                    sub.unsubscribe();
                    sub = null;
                }
            };
            var onComplete = function () {
                if (savedError !== null) {
                    observer.error(savedError);
                }
                else {
                    observer.next(savedResult);
                    observer.complete();
                }
            };
            // MockBackend for Http is synchronous, which means that if scheduleTask is by
            // scheduleMacroTask, the request will hit MockBackend and the response will be
            // sent, causing task.invoke() to be called.
            var _task = Zone.current.scheduleMacroTask('ZoneMacroTaskWrapper.subscribe', onComplete, {}, function () { return null; }, cancelTask);
            scheduleTask(_task);
            return function () {
                if (scheduled && task) {
                    task.zone.cancelTask(task);
                    scheduled = false;
                }
                if (sub) {
                    sub.unsubscribe();
                    sub = null;
                }
            };
        });
    };
    return ZoneMacroTaskWrapper;
}());
exports.ZoneMacroTaskWrapper = ZoneMacroTaskWrapper;
var ZoneMacroTaskConnection = /** @class */ (function (_super) {
    __extends(ZoneMacroTaskConnection, _super);
    function ZoneMacroTaskConnection(request, backend) {
        var _this = _super.call(this) || this;
        _this.request = request;
        _this.backend = backend;
        validateRequestUrl(request.url);
        _this.response = _this.wrap(request);
        return _this;
    }
    ZoneMacroTaskConnection.prototype.delegate = function (request) {
        this.lastConnection = this.backend.createConnection(request);
        return this.lastConnection.response;
    };
    Object.defineProperty(ZoneMacroTaskConnection.prototype, "readyState", {
        get: function () {
            return !!this.lastConnection ? this.lastConnection.readyState : http_1.ReadyState.Unsent;
        },
        enumerable: true,
        configurable: true
    });
    return ZoneMacroTaskConnection;
}(ZoneMacroTaskWrapper));
exports.ZoneMacroTaskConnection = ZoneMacroTaskConnection;
var ZoneMacroTaskBackend = /** @class */ (function () {
    function ZoneMacroTaskBackend(backend) {
        this.backend = backend;
    }
    ZoneMacroTaskBackend.prototype.createConnection = function (request) {
        return new ZoneMacroTaskConnection(request, this.backend);
    };
    return ZoneMacroTaskBackend;
}());
exports.ZoneMacroTaskBackend = ZoneMacroTaskBackend;
var ZoneClientBackend = /** @class */ (function (_super) {
    __extends(ZoneClientBackend, _super);
    function ZoneClientBackend(backend) {
        var _this = _super.call(this) || this;
        _this.backend = backend;
        return _this;
    }
    ZoneClientBackend.prototype.handle = function (request) { return this.wrap(request); };
    ZoneClientBackend.prototype.delegate = function (request) {
        return this.backend.handle(request);
    };
    return ZoneClientBackend;
}(ZoneMacroTaskWrapper));
exports.ZoneClientBackend = ZoneClientBackend;
function httpFactory(xhrBackend, options) {
    var macroBackend = new ZoneMacroTaskBackend(xhrBackend);
    return new http_1.Http(macroBackend, options);
}
exports.httpFactory = httpFactory;
function zoneWrappedInterceptingHandler(backend, injector) {
    var realBackend = new http_2.ɵHttpInterceptingHandler(backend, injector);
    return new ZoneClientBackend(realBackend);
}
exports.zoneWrappedInterceptingHandler = zoneWrappedInterceptingHandler;
exports.SERVER_HTTP_PROVIDERS = [
    { provide: http_1.Http, useFactory: httpFactory, deps: [http_1.XHRBackend, http_1.RequestOptions] },
    { provide: http_1.BrowserXhr, useClass: ServerXhr }, { provide: http_1.XSRFStrategy, useClass: ServerXsrfStrategy },
    { provide: http_2.XhrFactory, useClass: ServerXhr }, {
        provide: http_2.HttpHandler,
        useFactory: zoneWrappedInterceptingHandler,
        deps: [http_2.HttpBackend, core_1.Injector]
    }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLXNlcnZlci9zcmMvaHR0cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxJQUFNLElBQUksR0FBUSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFbEMsc0NBQW9GO0FBQ3BGLHNDQUF1SjtBQUV2Siw2Q0FBMkw7QUFFM0wsNkJBQXdEO0FBRXhELElBQU0sYUFBYSxHQUFHLHNCQUFzQixDQUFDO0FBRTdDLDRCQUE0QixHQUFXO0lBQ3JDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQzVCLE1BQU0sSUFBSSxLQUFLLENBQUMsa0VBQWdFLEdBQUssQ0FBQyxDQUFDO0tBQ3hGO0FBQ0gsQ0FBQztBQUdEO0lBQUE7SUFFQSxDQUFDO0lBREMseUJBQUssR0FBTCxjQUEwQixPQUFPLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQURsRCxTQUFTO1FBRHJCLGlCQUFVLEVBQUU7T0FDQSxTQUFTLENBRXJCO0lBQUQsZ0JBQUM7Q0FBQSxBQUZELElBRUM7QUFGWSw4QkFBUztBQUt0QjtJQUFBO0lBRUEsQ0FBQztJQURDLDZDQUFnQixHQUFoQixVQUFpQixHQUFZLElBQVMsQ0FBQztJQUQ1QixrQkFBa0I7UUFEOUIsaUJBQVUsRUFBRTtPQUNBLGtCQUFrQixDQUU5QjtJQUFELHlCQUFDO0NBQUEsQUFGRCxJQUVDO0FBRlksZ0RBQWtCO0FBSS9CO0lBQUE7SUE0RUEsQ0FBQztJQTNFQyxtQ0FBSSxHQUFKLFVBQUssT0FBVTtRQUFmLGlCQXdFQztRQXZFQyxPQUFPLElBQUksaUJBQVUsQ0FBQyxVQUFDLFFBQXFCO1lBQzFDLElBQUksSUFBSSxHQUFTLElBQU0sQ0FBQztZQUN4QixJQUFJLFNBQVMsR0FBWSxLQUFL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