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
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var base_response_options_1 = require("../base_response_options");
var enums_1 = require("../enums");
var interfaces_1 = require("../interfaces");
var static_response_1 = require("../static_response");
var browser_jsonp_1 = require("./browser_jsonp");
var JSONP_ERR_NO_CALLBACK = 'JSONP injected script did not invoke callback.';
var JSONP_ERR_WRONG_METHOD = 'JSONP requests must use GET request method.';
/**
 * Base class for an in-flight JSONP request.
 *
 * @deprecated see https://angular.io/guide/http
 */
var JSONPConnection = /** @class */ (function () {
    /** @internal */
    function JSONPConnection(req, _dom, baseResponseOptions) {
        var _this = this;
        this._dom = _dom;
        this.baseResponseOptions = baseResponseOptions;
        this._finished = false;
        if (req.method !== enums_1.RequestMethod.Get) {
            throw new TypeError(JSONP_ERR_WRONG_METHOD);
        }
        this.request = req;
        this.response = new rxjs_1.Observable(function (responseObserver) {
            _this.readyState = enums_1.ReadyState.Loading;
            var id = _this._id = _dom.nextRequestID();
            _dom.exposeConnection(id, _this);
            // Workaround Dart
            // url = url.replace(/=JSONP_CALLBACK(&|$)/, `generated method`);
            var callback = _dom.requestCallback(_this._id);
            var url = req.url;
            if (url.indexOf('=JSONP_CALLBACK&') > -1) {
                url = url.replace('=JSONP_CALLBACK&', "=" + callback + "&");
            }
            else if (url.lastIndexOf('=JSONP_CALLBACK') === url.length - '=JSONP_CALLBACK'.length) {
                url = url.substring(0, url.length - '=JSONP_CALLBACK'.length) + ("=" + callback);
            }
            var script = _this._script = _dom.build(url);
            var onLoad = function (event) {
                if (_this.readyState === enums_1.ReadyState.Cancelled)
                    return;
                _this.readyState = enums_1.ReadyState.Done;
                _dom.cleanup(script);
                if (!_this._finished) {
                    var responseOptions_1 = new base_response_options_1.ResponseOptions({ body: JSONP_ERR_NO_CALLBACK, type: enums_1.ResponseType.Error, url: url });
                    if (baseResponseOptions) {
                        responseOptions_1 = baseResponseOptions.merge(responseOptions_1);
                    }
                    responseObserver.error(new static_response_1.Response(responseOptions_1));
                    return;
                }
                var responseOptions = new base_response_options_1.ResponseOptions({ body: _this._responseData, url: url });
                if (_this.baseResponseOptions) {
                    responseOptions = _this.baseResponseOptions.merge(responseOptions);
                }
                responseObserver.next(new static_response_1.Response(responseOptions));
                responseObserver.complete();
            };
            var onError = function (error) {
                if (_this.readyState === enums_1.ReadyState.Cancelled)
                    return;
                _this.readyState = enums_1.ReadyState.Done;
                _dom.cleanup(script);
                var responseOptions = new base_response_options_1.ResponseOptions({ body: error.message, type: enums_1.ResponseType.Error });
                if (baseResponseOptions) {
                    responseOptions = baseResponseOptions.merge(responseOptions);
                }
                responseObserver.error(new static_response_1.Response(responseOptions));
            };
            script.addEventListener('load', onLoad);
            script.addEventListener('error', onError);
            _dom.send(script);
            return function () {
                _this.readyState = enums_1.ReadyState.Cancelled;
                script.removeEventListener('load', onLoad);
                script.removeEventListener('error', onError);
                _this._dom.cleanup(script);
            };
        });
    }
    /**
     * Callback called when the JSONP request completes, to notify the application
     * of the new data.
     */
    JSONPConnection.prototype.finished = function (data) {
        // Don't leak connections
        this._finished = true;
        this._dom.removeConnection(this._id);
        if (this.readyState === enums_1.ReadyState.Cancelled)
            return;
        this._responseData = data;
    };
    return JSONPConnection;
}());
exports.JSONPConnection = JSONPConnection;
/**
 * A {@link ConnectionBackend} that uses the JSONP strategy of making requests.
 *
 * @deprecated see https://angular.io/guide/http
 */
var JSONPBackend = /** @class */ (function (_super) {
    __extends(JSONPBackend, _super);
    /** @internal */
    function JSONPBackend(_browserJSONP, _baseResponseOptions) {
        var _this = _super.call(this) || this;
        _this._browserJSONP = _browserJSONP;
        _this._baseResponseOptions = _baseResponseOptions;
        return _this;
    }
    JSONPBackend.prototype.createConnection = function (request) {
        return new JSONPConnection(request, this._browserJSONP, this._baseResponseOptions);
    };
    JSONPBackend = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [browser_jsonp_1.BrowserJsonp, base_response_options_1.ResponseOptions])
    ], JSONPBackend);
    return JSONPBackend;
}(interfaces_1.ConnectionBackend));
exports.JSONPBackend = JSONPBackend;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbnBfYmFja2VuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2h0dHAvc3JjL2JhY2tlbmRzL2pzb25wX2JhY2tlbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsc0NBQXlDO0FBQ3pDLDZCQUEwQztBQUUxQyxrRUFBeUQ7QUFDekQsa0NBQWlFO0FBQ2pFLDRDQUE0RDtBQUU1RCxzREFBNEM7QUFFNUMsaURBQTZDO0FBRTdDLElBQU0scUJBQXFCLEdBQUcsZ0RBQWdELENBQUM7QUFDL0UsSUFBTSxzQkFBc0IsR0FBRyw2Q0FBNkMsQ0FBQztBQUU3RTs7OztHQUlHO0FBQ0g7SUF3QkUsZ0JBQWdCO0lBQ2hCLHlCQUNJLEdBQVksRUFBVSxJQUFrQixFQUFVLG1CQUFxQztRQUQzRixpQkF1RUM7UUF0RXlCLFNBQUksR0FBSixJQUFJLENBQWM7UUFBVSx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQWtCO1FBcEJuRixjQUFTLEdBQVksS0FBSyxDQUFDO1FBcUJqQyxJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUsscUJBQWEsQ0FBQyxHQUFHLEVBQUU7WUFDcEMsTUFBTSxJQUFJLFNBQVMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1NBQzdDO1FBQ0QsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7UUFDbkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLGlCQUFVLENBQVcsVUFBQyxnQkFBb0M7WUFFNUUsS0FBSSxDQUFDLFVBQVUsR0FBRyxrQkFBVSxDQUFDLE9BQU8sQ0FBQztZQUNyQyxJQUFNLEVBQUUsR0FBRyxLQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUUzQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLEtBQUksQ0FBQyxDQUFDO1lBRWhDLGtCQUFrQjtZQUNsQixpRUFB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