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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var backend_1 = require("./backend");
var client_1 = require("./client");
var interceptor_1 = require("./interceptor");
var jsonp_1 = require("./jsonp");
var xhr_1 = require("./xhr");
var xsrf_1 = require("./xsrf");
/**
 * An injectable `HttpHandler` that applies multiple interceptors
 * to a request before passing it to the given `HttpBackend`.
 *
 * The interceptors are loaded lazily from the injector, to allow
 * interceptors to themselves inject classes depending indirectly
 * on `HttpInterceptingHandler` itself.
 * @see `HttpInterceptor`
 */
var HttpInterceptingHandler = /** @class */ (function () {
    function HttpInterceptingHandler(backend, injector) {
        this.backend = backend;
        this.injector = injector;
        this.chain = null;
    }
    HttpInterceptingHandler.prototype.handle = function (req) {
        if (this.chain === null) {
            var interceptors = this.injector.get(interceptor_1.HTTP_INTERCEPTORS, []);
            this.chain = interceptors.reduceRight(function (next, interceptor) { return new interceptor_1.HttpInterceptorHandler(next, interceptor); }, this.backend);
        }
        return this.chain.handle(req);
    };
    HttpInterceptingHandler = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [backend_1.HttpBackend, core_1.Injector])
    ], HttpInterceptingHandler);
    return HttpInterceptingHandler;
}());
exports.HttpInterceptingHandler = HttpInterceptingHandler;
/**
 * Constructs an `HttpHandler` that applies interceptors
 * to a request before passing it to the given `HttpBackend`.
 *
 * Use as a factory function within `HttpClientModule`.
 *
 *
 */
function interceptingHandler(backend, interceptors) {
    if (interceptors === void 0) { interceptors = []; }
    if (!interceptors) {
        return backend;
    }
    return interceptors.reduceRight(function (next, interceptor) { return new interceptor_1.HttpInterceptorHandler(next, interceptor); }, backend);
}
exports.interceptingHandler = interceptingHandler;
/**
 * Factory function that determines where to store JSONP callbacks.
 *
 * Ordinarily JSONP callbacks are stored on the `window` object, but this may not exist
 * in test environments. In that case, callbacks are stored on an anonymous object instead.
 *
 *
 */
function jsonpCallbackContext() {
    if (typeof window === 'object') {
        return window;
    }
    return {};
}
exports.jsonpCallbackContext = jsonpCallbackContext;
/**
 * Configures XSRF protection support for outgoing requests.
 *
 * For a server that supports a cookie-based XSRF protection system,
 * use directly to configure XSRF protection with the correct
 * cookie and header names.
 *
 * If no names are supplied, the default cookie name is `XSRF-TOKEN`
 * and the default header name is `X-XSRF-TOKEN`.
 *
 *
 */
var HttpClientXsrfModule = /** @class */ (function () {
    function HttpClientXsrfModule() {
    }
    HttpClientXsrfModule_1 = HttpClientXsrfModule;
    /**
     * Disable the default XSRF protection.
     */
    HttpClientXsrfModule.disable = function () {
        return {
            ngModule: HttpClientXsrfModule_1,
            providers: [
                { provide: xsrf_1.HttpXsrfInterceptor, useClass: interceptor_1.NoopInterceptor },
            ],
        };
    };
    /**
     * Configure XSRF protection.
     * @param options An object that can specify either or both
     * cookie name or header name.
     * - Cookie name default is `XSRF-TOKEN`.
     * - Header name default is `X-XSRF-TOKEN`.
     *
     */
    HttpClientXsrfModule.withOptions = function (options) {
        if (options === void 0) { options = {}; }
        return {
            ngModule: HttpClientXsrfModule_1,
            providers: [
                options.cookieName ? { provide: xsrf_1.XSRF_COOKIE_NAME, useValue: options.cookieName } : [],
                options.headerName ? { provide: xsrf_1.XSRF_HEADER_NAME, useValue: options.headerName } : [],
            ],
        };
    };
    var HttpClientXsrfModule_1;
    HttpClientXsrfModule = HttpClientXsrfModule_1 = __decorate([
        core_1.NgModule({
            providers: [
                xsrf_1.HttpXsrfInterceptor,
                { provide: interceptor_1.HTTP_INTERCEPTORS, useExisting: xsrf_1.HttpXsrfInterceptor, multi: true },
                { provide: xsrf_1.HttpXsrfTokenExtractor, useClass: xsrf_1.HttpXsrfCookieExtractor },
                { provide: xsrf_1.XSRF_COOKIE_NAME, useValue: 'XSRF-TOKEN' },
                { provide: xsrf_1.XSRF_HEADER_NAME, useValue: 'X-XSRF-TOKEN' },
            ],
        })
    ], HttpClientXsrfModule);
    return HttpClientXsrfModule;
}());
exports.HttpClientXsrfModule = HttpClientXsrfModule;
/**
 * Configures the [dependency injector](guide/glossary#injector) for `HttpClient`
 * with supporting services for XSRF. Automatically imported by `HttpClientModule`.
 *
 * You can add interceptors to the chain behind `HttpClient` by binding them to the
 * multiprovider for built-in [DI token](guide/glossary#di-token) `HTTP_INTERCEPTORS`.
 *
 *
 */
var HttpClientModule = /** @class */ (function () {
    function HttpClientModule() {
    }
    HttpClientModule = __decorate([
        core_1.NgModule({
            /**
             * Optional configuration for XSRF protection.
             */
            imports: [
                HttpClientXsrfModule.withOptions({
                    cookieName: 'XSRF-TOKEN',
                    headerName: 'X-XSRF-TOKEN',
                }),
            ],
            /**
             * Configures the [dependency injector](guide/glossary#injector) where it is imported
             * with supporting services for HTTP communications.
             */
            providers: [
                client_1.HttpClient,
                { provide: backend_1.HttpHandler, useClass: HttpInterceptingHandler },
                xhr_1.HttpXhrBackend,
                { provide: backend_1.HttpBackend, useExisting: xhr_1.HttpXhrBackend },
                xhr_1.BrowserXhr,
                { provide: xhr_1.XhrFactory, useExisting: xhr_1.BrowserXhr },
            ],
        })
    ], HttpClientModule);
    return HttpClientModule;
}());
exports.HttpClientModule = HttpClientModule;
/**
 * Configures the [dependency injector](guide/glossary#injector) for `HttpClient`
 * with supporting services for JSONP.
 * Without this module, Jsonp requests reach the backend
 * with method JSONP, where they are rejected.
 *
 * You can add interceptors to the chain behind `HttpClient` by binding them to the
 * multiprovider for built-in [DI token](guide/glossary#di-token) `HTTP_INTERCEPTORS`.
 *
 *
 */
var HttpClientJsonpModule = /** @class */ (function () {
    function HttpClientJsonpModule() {
    }
    HttpClientJsonpModule = __decorate([
        core_1.NgModule({
            providers: [
                jsonp_1.JsonpClientBackend,
                { provide: jsonp_1.JsonpCallbackContext, useFactory: jsonpCallbackContext },
                { provide: interceptor_1.HTTP_INTERCEPTORS, useClass: jsonp_1.JsonpInterceptor, multi: true },
            ],
        })
    ], HttpClientJsonpModule);
    return HttpClientJsonpModule;
}());
exports.HttpClientJsonpModule = HttpClientJsonpModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tbW9uL2h0dHAvc3JjL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUVILHNDQUFrRjtBQUdsRixxQ0FBbUQ7QUFDbkQsbUNBQW9DO0FBQ3BDLDZDQUEwRztBQUMxRyxpQ0FBbUY7QUFHbkYsNkJBQTZEO0FBQzdELCtCQUFnSTtBQUVoSTs7Ozs7Ozs7R0FRRztBQUVIO0lBR0UsaUNBQW9CLE9BQW9CLEVBQVUsUUFBa0I7UUFBaEQsWUFBTyxHQUFQLE9BQU8sQ0FBYTtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVU7UUFGNUQsVUFBSyxHQUFxQixJQUFJLENBQUM7SUFFZ0MsQ0FBQztJQUV4RSx3Q0FBTSxHQUFOLFVBQU8sR0FBcUI7UUFDMUIsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksRUFBRTtZQUN2QixJQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQywrQkFBaUIsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUM5RCxJQUFJLENBQUMsS0FBSyxHQUFHLFlBQVksQ0FBQyxXQUFXLENBQ2pDLFVBQUMsSUFBSSxFQUFFLFdBQVcsSUFBSyxPQUFBLElBQUksb0NBQXNCLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxFQUE3QyxDQUE2QyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN6RjtRQUNELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQVpVLHVCQUF1QjtRQURuQyxpQkFBVSxFQUFFO3lDQUlrQixxQkFBVyxFQUFvQixlQUFRO09BSHpELHVCQUF1QixDQWFuQztJQUFELDhCQUFDO0NBQUEsQUFiRCxJQWFDO0FBYlksMERBQXVCO0FBZXBDOzs7Ozs7O0dBT0c7QUFD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