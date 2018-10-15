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
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var backend_1 = require("./backend");
var headers_1 = require("./headers");
var params_1 = require("./params");
var request_1 = require("./request");
var response_1 = require("./response");
/**
 * Construct an instance of `HttpRequestOptions<T>` from a source `HttpMethodOptions` and
 * the given `body`. Basically, this clones the object and adds the body.
 */
function addBody(options, body) {
    return {
        body: body,
        headers: options.headers,
        observe: options.observe,
        params: options.params,
        reportProgress: options.reportProgress,
        responseType: options.responseType,
        withCredentials: options.withCredentials,
    };
}
/**
 * Perform HTTP requests.
 *
 * `HttpClient` is available as an injectable class, with methods to perform HTTP requests.
 * Each request method has multiple signatures, and the return type varies according to which
 * signature is called (mainly the values of `observe` and `responseType`).
 *
 *
 */
var HttpClient = /** @class */ (function () {
    function HttpClient(handler) {
        this.handler = handler;
    }
    /**
     * Constructs an `Observable` for a particular HTTP request that, when subscribed,
     * fires the request through the chain of registered interceptors and on to the
     * server.
     *
     * This method can be called in one of two ways. Either an `HttpRequest`
     * instance can be passed directly as the only parameter, or a method can be
     * passed as the first parameter, a string URL as the second, and an
     * options hash as the third.
     *
     * If a `HttpRequest` object is passed directly, an `Observable` of the
     * raw `HttpEvent` stream will be returned.
     *
     * If a request is instead built by providing a URL, the options object
     * determines the return type of `request()`. In addition to configuring
     * request parameters such as the outgoing headers and/or the body, the options
     * hash specifies two key pieces of information about the request: the
     * `responseType` and what to `observe`.
     *
     * The `responseType` value determines how a successful response body will be
     * parsed. If `responseType` is the default `json`, a type interface for the
     * resulting object may be passed as a type parameter to `request()`.
     *
     * The `observe` value determines the return type of `request()`, based on what
     * the consumer is interested in observing. A value of `events` will return an
     * `Observable<HttpEvent>` representing the raw `HttpEvent` stream,
     * including progress events by default. A value of `response` will return an
     * `Observable<HttpResponse<T>>` where the `T` parameter of `HttpResponse`
     * depends on the `responseType` and any optionally provided type parameter.
     * A value of `body` will return an `Observable<T>` with the same `T` body type.
     */
    HttpClient.prototype.request = function (first, url, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var req;
        // Firstly, check whether the primary argument is an instance of `HttpRequest`.
        if (first instanceof request_1.HttpRequest) {
            // It is. The other arguments must be undefined (per the signatures) and can be
            // ignored.
            req = first;
        }
        else {
            // It's a string, so it represents a URL. Construct a request based on it,
            // and incorporate the remaining arguments (assuming GET unless a method is
            // provided.
            // Figure out the headers.
            var headers = undefined;
            if (options.headers instanceof headers_1.HttpHeaders) {
                headers = options.headers;
            }
            else {
                headers = new headers_1.HttpHeaders(options.headers);
            }
            // Sort out parameters.
            var params = undefined;
            if (!!options.params) {
                if (options.params instanceof params_1.HttpParams) {
                    params = options.params;
                }
                else {
                    params = new params_1.HttpParams({ fromObject: options.params });
                }
            }
            // Construct the request.
            req = new request_1.HttpRequest(first, url, (options.body !== undefined ? options.body : null), {
                headers: headers,
                params: params,
                reportProgress: options.reportProgress,
                // By default, JSON is assumed to be returned for all calls.
                responseType: options.responseType || 'json',
                withCredentials: options.withCredentials,
            });
        }
        // Start with an Observable.of() the initial request, and run the handler (which
        // includes all interceptors) inside a concatMap(). This way, the handler runs
        // inside an Observable chain, which causes interceptors to be re-run on every
        // subscription (this also makes retries re-run the handler, including interceptors).
        var events$ = rxjs_1.of(req).pipe(operators_1.concatMap(function (req) { return _this.handler.handle(req); }));
        // If coming via the API signature which accepts a previously constructed HttpRequest,
        // the only option is to get the event stream. Otherwise, return the event stream if
        // that is what was requested.
        if (first instanceof request_1.HttpRequest || options.observe === 'events') {
            return events$;
        }
        // The requested stream contains either the full response or the body. In either
        // case, the first step is to filter the event stream to extract a stream of
        // responses(s).
        var res$ = events$.pipe(operators_1.filter(function (event) { return event instanceof response_1.HttpResponse; }));
        // Decide which stream to return.
        switch (options.observe || 'body') {
            case 'body':
                // The requested stream is the body. Map the response stream to the response
                // body. This could be done more simply, but a misbehaving interceptor might
                // transform the response body into a different format and ignore the requested
                // responseType. Guard against this by validating that the response is of the
                // requested type.
                switch (req.responseType) {
                    case 'arraybuffer':
                        return res$.pipe(operators_1.map(function (res) {
                            // Validate that the body is an ArrayBuffer.
                            if (res.body !== null && !(res.body instanceof ArrayBuffer)) {
                                throw new Error('Response is not an ArrayBuffer.');
                            }
                            return res.body;
                        }));
                    case 'blob':
                        return res$.pipe(operators_1.map(function (res) {
                            // Validate that the body is a Blob.
                            if (res.body !== null && !(res.body instanceof Blob)) {
                                throw new Error('Response is not a Blob.');
                            }
                            return res.body;
                        }));
                    case 'text':
                        return res$.pipe(operators_1.map(function (res) {
                            // Validate that the body is a string.
                            if (res.body !== null && typeof res.body !== 'string') {
                                throw new Error('Response is not a string.');
                            }
                            return res.body;
                        }));
                    case 'json':
                    default:
                        // No validation needed for JSON responses, as they can be of any type.
                        return res$.pipe(operators_1.map(function (res) { return res.body; }));
                }
            case 'response':
                // The response stream was requested directly, so return it.
                return res$;
            default:
                // Guard against new future observe types being added.
                throw new Error("Unreachable: unhandled observe type " + options.observe + "}");
        }
    };
    /**
     * Constructs an `Observable` which, when subscribed, will cause the configured
     * DELETE request to be executed on the server. See the individual overloads for
     * details of `delete()`'s return type based on the provided options.
     */
    HttpClient.prototype.delete = function (url, options) {
        if (options === void 0) { options = {}; }
        return this.request('DELETE', url, options);
    };
    /**
     * Constructs an `Observable` which, when subscribed, will cause the configured
     * GET request to be executed on the server. See the individual overloads for
     * details of `get()`'s return type based on the provided options.
     */
    HttpClient.prototype.get = function (url, options) {
        if (options === void 0) { options = {}; }
        return this.request('GET', url, options);
    };
    /**
     * Constructs an `Observable` which, when subscribed, will cause the configured
     * HEAD request to be executed on the server. See the individual overloads for
     * details of `head()`'s return type based on the provided options.
     */
    HttpClient.prototype.head = function (url, options) {
        if (options === void 0) { options = {}; }
        return this.request('HEAD', url, options);
    };
    /**
     * Constructs an `Observable` which, when subscribed, will cause a request
     * with the special method `JSONP` to be dispatched via the interceptor pipeline.
     *
     * A suitable interceptor must be installed (e.g. via the `HttpClientJsonpModule`).
     * If no such interceptor is reached, then the `JSONP` request will likely be
     * rejected by the configured backend.
     */
    HttpClient.prototype.jsonp = function (url, callbackParam) {
        return this.request('JSONP', url, {
            params: new params_1.HttpParams().append(callbackParam, 'JSONP_CALLBACK'),
            observe: 'body',
            responseType: 'json',
        });
    };
    /**
     * Constructs an `Observable` which, when subscribed, will cause the configured
     * OPTIONS request to be executed on the server. See the individual overloads for
     * details of `options()`'s return type based on the provided options.
     */
    HttpClient.prototype.options = function (url, options) {
        if (options === void 0) { options = {}; }
        return this.request('OPTIONS', url, options);
    };
    /**
     * Constructs an `Observable` which, when subscribed, will cause the configured
     * PATCH request to be executed on the server. See the individual overloads for
     * details of `patch()`'s return type based on the provided options.
     */
    HttpClient.prototype.patch = function (url, body, options) {
        if (options === void 0) { options = {}; }
        return this.request('PATCH', url, addBody(options, body));
    };
    /**
     * Constructs an `Observable` which, when subscribed, will cause the configured
     * POST request to be executed on the server. See the individual overloads for
     * details of `post()`'s return type based on the provided options.
     */
    HttpClient.prototype.post = function (url, body, options) {
        if (options === void 0) { options = {}; }
        return this.request('POST', url, addBody(options, body));
    };
    /**
     * Constructs an `Observable` which, when subscribed, will cause the configured
     * PUT request to be executed on the server. See the individual overloads for
     * details of `put()`'s return type based on the provided options.
     */
    HttpClient.prototype.put = function (url, body, options) {
        if (options === void 0) { options = {}; }
        return this.request('PUT', url, addBody(options, body));
    };
    HttpClient = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [backend_1.HttpHandler])
    ], HttpClient);
    return HttpClient;
}());
exports.HttpClient = HttpClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tbW9uL2h0dHAvc3JjL2NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUVILHNDQUF5QztBQUN6Qyw2QkFBcUM7QUFDckMsNENBQXNEO0FBRXRELHFDQUFzQztBQUN0QyxxQ0FBc0M7QUFDdEMsbUNBQXVEO0FBQ3ZELHFDQUFzQztBQUN0Qyx1Q0FBbUQ7QUFHbkQ7OztHQUdHO0FBQ0gsaUJBQ0ksT0FPQyxFQUNELElBQWM7SUFDaEIsT0FBTztRQUNMLElBQUksTUFBQTtRQUNKLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTztRQUN4QixPQUFPLEVBQUUsT0FBTyxDQUFDLE9BQU87UUFDeEIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNO1FBQ3RCLGNBQWMsRUFBRSxPQUFPLENBQUMsY0FBYztRQUN0QyxZQUFZLEVBQUUsT0FBTyxDQUFDLFlBQVk7UUFDbEMsZUFBZSxFQUFFLE9BQU8sQ0FBQyxlQUFlO0tBQ3pDLENBQUM7QUFDSixDQUFDO0FBSUQ7Ozs7Ozs7O0dBUUc7QUFFSDtJQUNFLG9CQUFvQixPQUFvQjtRQUFwQixZQUFPLEdBQVAsT0FBTyxDQUFhO0lBQUcsQ0FBQztJQThPNUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQThCRztJQUNILDRCQUFPLEdBQVAsVUFBUSxLQUE4QixFQUFFLEdBQVksRUFBRSxPQVFoRDtRQVJOLGlCQWtIQztRQWxIcUQsd0JBQUEsRUFBQSxZQVFoRDtRQUNKLElBQUksR0FBcUIsQ0FBQztRQUMxQiwrRUFBK0U7UUFDL0UsSUFBSSxLQUFLLFlBQVkscUJBQVcsRUFBRTtZQUNoQywrRUFBK0U7WUFDL0UsV0FBVztZQUNYLEdBQUcsR0FBRyxLQUF5QixDQUFDO1NBQ2pDO2FBQU07WUFDTCwwRUFBMEU7WUFDMUUsMkVBQTJFO1lBQzNFLFlB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