"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module
 * @description
 * The http module provides services to perform http requests. To get started, see the {@link Http}
 * class.
 */
var core_1 = require("@angular/core");
var browser_jsonp_1 = require("./backends/browser_jsonp");
var browser_xhr_1 = require("./backends/browser_xhr");
var jsonp_backend_1 = require("./backends/jsonp_backend");
var xhr_backend_1 = require("./backends/xhr_backend");
var base_request_options_1 = require("./base_request_options");
var base_response_options_1 = require("./base_response_options");
var http_1 = require("./http");
var interfaces_1 = require("./interfaces");
function _createDefaultCookieXSRFStrategy() {
    return new xhr_backend_1.CookieXSRFStrategy();
}
exports._createDefaultCookieXSRFStrategy = _createDefaultCookieXSRFStrategy;
function httpFactory(xhrBackend, requestOptions) {
    return new http_1.Http(xhrBackend, requestOptions);
}
exports.httpFactory = httpFactory;
function jsonpFactory(jsonpBackend, requestOptions) {
    return new http_1.Jsonp(jsonpBackend, requestOptions);
}
exports.jsonpFactory = jsonpFactory;
/**
 * The module that includes http's providers
 *
 * @deprecated see https://angular.io/guide/http
 */
var HttpModule = /** @class */ (function () {
    function HttpModule() {
    }
    HttpModule = __decorate([
        core_1.NgModule({
            providers: [
                // TODO(pascal): use factory type annotations once supported in DI
                // issue: https://github.com/angular/angular/issues/3183
                { provide: http_1.Http, useFactory: httpFactory, deps: [xhr_backend_1.XHRBackend, base_request_options_1.RequestOptions] },
                browser_xhr_1.BrowserXhr,
                { provide: base_request_options_1.RequestOptions, useClass: base_request_options_1.BaseRequestOptions },
                { provide: base_response_options_1.ResponseOptions, useClass: base_response_options_1.BaseResponseOptions },
                xhr_backend_1.XHRBackend,
                { provide: interfaces_1.XSRFStrategy, useFactory: _createDefaultCookieXSRFStrategy },
            ],
        })
    ], HttpModule);
    return HttpModule;
}());
exports.HttpModule = HttpModule;
/**
 * The module that includes jsonp's providers
 *
 * @deprecated see https://angular.io/guide/http
 */
var JsonpModule = /** @class */ (function () {
    function JsonpModule() {
    }
    JsonpModule = __decorate([
        core_1.NgModule({
            providers: [
                // TODO(pascal): use factory type annotations once supported in DI
                // issue: https://github.com/angular/angular/issues/3183
                { provide: http_1.Jsonp, useFactory: jsonpFactory, deps: [jsonp_backend_1.JSONPBackend, base_request_options_1.RequestOptions] },
                browser_jsonp_1.BrowserJsonp,
                { provide: base_request_options_1.RequestOptions, useClass: base_request_options_1.BaseRequestOptions },
                { provide: base_response_options_1.ResponseOptions, useClass: base_response_options_1.BaseResponseOptions },
                jsonp_backend_1.JSONPBackend,
            ],
        })
    ], JsonpModule);
    return JsonpModule;
}());
exports.JsonpModule = JsonpModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cF9tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9odHRwL3NyYy9odHRwX21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVIOzs7OztHQUtHO0FBQ0gsc0NBQXVDO0FBRXZDLDBEQUFzRDtBQUN0RCxzREFBa0Q7QUFDbEQsMERBQXNEO0FBQ3RELHNEQUFzRTtBQUN0RSwrREFBMEU7QUFDMUUsaUVBQTZFO0FBQzdFLCtCQUFtQztBQUNuQywyQ0FBMEM7QUFHMUM7SUFDRSxPQUFPLElBQUksZ0NBQWtCLEVBQUUsQ0FBQztBQUNsQyxDQUFDO0FBRkQsNEVBRUM7QUFFRCxxQkFBNEIsVUFBc0IsRUFBRSxjQUE4QjtJQUNoRixPQUFPLElBQUksV0FBSSxDQUFDLFVBQVUsRUFBRSxjQUFjLENBQUMsQ0FBQztBQUM5QyxDQUFDO0FBRkQsa0NBRUM7QUFFRCxzQkFBNkIsWUFBMEIsRUFBRSxjQUE4QjtJQUNyRixPQUFPLElBQUksWUFBSyxDQUFDLFlBQVksRUFBRSxjQUFjLENBQUMsQ0FBQztBQUNqRCxDQUFDO0FBRkQsb0NBRUM7QUFHRDs7OztHQUlHO0FBYUg7SUFBQTtJQUNBLENBQUM7SUFEWSxVQUFVO1FBWnRCLGVBQVEsQ0FBQztZQUNSLFNBQVMsRUFBRTtnQkFDVCxrRUFBa0U7Z0JBQ2xFLHdEQUF3RDtnQkFDeEQsRUFBQyxPQUFPLEVBQUUsV0FBSSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsd0JBQVUsRUFBRSxxQ0FBYyxDQUFDLEVBQUM7Z0JBQzVFLHdCQUFVO2dCQUNWLEVBQUMsT0FBTyxFQUFFLHFDQUFjLEVBQUUsUUFBUSxFQUFFLHlDQUFrQixFQUFDO2dCQUN2RCxFQUFDLE9BQU8sRUFBRSx1Q0FBZSxFQUFFLFFBQVEsRUFBRSwyQ0FBbUIsRUFBQztnQkFDekQsd0JBQVU7Z0JBQ1YsRUFBQyxPQUFPLEVBQUUseUJBQVksRUFBRSxVQUFVLEVBQUUsZ0NBQWdDLEVBQUM7YUFDdEU7U0FDRixDQUFDO09BQ1csVUFBVSxDQUN0QjtJQUFELGlCQUFDO0NBQUEsQUFERCxJQUNDO0FBRFksZ0NBQVU7QUFHdkI7Ozs7R0FJRztBQVlIO0lBQUE7SUFDQSxDQUFDO0lBRFksV0FBVztRQVh2QixlQUFRLENBQUM7WUFDUixTQUFTLEVBQUU7Z0JBQ1Qsa0VBQWtFO2dCQUNsRSx3REFBd0Q7Z0JBQ3hELEVBQUMsT0FBTyxFQUFFLFlBQUssRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDLDRCQUFZLEVBQUUscUNBQWMsQ0FBQyxFQUFDO2dCQUNoRiw0QkFBWTtnQkFDWixFQUFDLE9BQU8sRUFBRSxxQ0FBYyxFQUFFLFFBQVEsRUFBRSx5Q0FBa0IsRUFBQztnQkFDdkQsRUFBQyxPQUFPLEVBQUUsdUNBQWUsRUFBRSxRQUFRLEVBQUUsMkNBQW1CLEVBQUM7Z0JBQ3pELDRCQUFZO2FBQ2I7U0FDRixDQUFDO09BQ1csV0FBVyxDQUN2QjtJQUFELGtCQUFDO0NBQUEsQUFERCxJQUNDO0FBRFksa0NBQVcifQ==