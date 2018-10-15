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
Object.defineProperty(exports, "__esModule", { value: true });
var body_1 = require("./body");
var enums_1 = require("./enums");
var headers_1 = require("./headers");
var http_utils_1 = require("./http_utils");
var url_search_params_1 = require("./url_search_params");
// TODO(jeffbcross): properly implement body accessors
/**
 * Creates `Request` instances from provided values.
 *
 * The Request's interface is inspired by the Request constructor defined in the [Fetch
 * Spec](https://fetch.spec.whatwg.org/#request-class),
 * but is considered a static value whose body can be accessed many times. There are other
 * differences in the implementation, but this is the most significant.
 *
 * `Request` instances are typically created by higher-level classes, like {@link Http} and
 * {@link Jsonp}, but it may occasionally be useful to explicitly create `Request` instances.
 * One such example is when creating services that wrap higher-level services, like {@link Http},
 * where it may be useful to generate a `Request` with arbitrary headers and search params.
 *
 * ```typescript
 * import {Injectable, Injector} from '@angular/core';
 * import {HTTP_PROVIDERS, Http, Request, RequestMethod} from '@angular/http';
 *
 * @Injectable()
 * class AutoAuthenticator {
 *   constructor(public http:Http) {}
 *   request(url:string) {
 *     return this.http.request(new Request({
 *       method: RequestMethod.Get,
 *       url: url,
 *       search: 'password=123'
 *     }));
 *   }
 * }
 *
 * var injector = Injector.resolveAndCreate([HTTP_PROVIDERS, AutoAuthenticator]);
 * var authenticator = injector.get(AutoAuthenticator);
 * authenticator.request('people.json').subscribe(res => {
 *   //URL should have included '?password=123'
 *   console.log('people', res.json());
 * });
 * ```
 *
 * @deprecated see https://angular.io/guide/http
 */
var Request = /** @class */ (function (_super) {
    __extends(Request, _super);
    function Request(requestOptions) {
        var _this = _super.call(this) || this;
        // TODO: assert that url is present
        var url = requestOptions.url;
        _this.url = requestOptions.url;
        var paramsArg = requestOptions.params || requestOptions.search;
        if (paramsArg) {
            var params = void 0;
            if (typeof paramsArg === 'object' && !(paramsArg instanceof url_search_params_1.URLSearchParams)) {
                params = urlEncodeParams(paramsArg).toString();
            }
            else {
                params = paramsArg.toString();
            }
            if (params.length > 0) {
                var prefix = '?';
                if (_this.url.indexOf('?') != -1) {
                    prefix = (_this.url[_this.url.length - 1] == '&') ? '' : '&';
                }
                // TODO: just delete search-query-looking string in url?
                _this.url = url + prefix + params;
            }
        }
        _this._body = requestOptions.body;
        _this.method = http_utils_1.normalizeMethodName(requestOptions.method);
        // TODO(jeffbcross): implement behavior
        // Defaults to 'omit', consistent with browser
        _this.headers = new headers_1.Headers(requestOptions.headers);
        _this.contentType = _this.detectContentType();
        _this.withCredentials = requestOptions.withCredentials;
        _this.responseType = requestOptions.responseType;
        return _this;
    }
    /**
     * Returns the content type enum based on header options.
     */
    Request.prototype.detectContentType = function () {
        switch (this.headers.get('content-type')) {
            case 'application/json':
                return enums_1.ContentType.JSON;
            case 'application/x-www-form-urlencoded':
                return enums_1.ContentType.FORM;
            case 'multipart/form-data':
                return enums_1.ContentType.FORM_DATA;
            case 'text/plain':
            case 'text/html':
                return enums_1.ContentType.TEXT;
            case 'application/octet-stream':
                return this._body instanceof exports.ArrayBuffer ? enums_1.ContentType.ARRAY_BUFFER : enums_1.ContentType.BLOB;
            default:
                return this.detectContentTypeFromBody();
        }
    };
    /**
     * Returns the content type of request's body based on its type.
     */
    Request.prototype.detectContentTypeFromBody = function () {
        if (this._body == null) {
            return enums_1.ContentType.NONE;
        }
        else if (this._body instanceof url_search_params_1.URLSearchParams) {
            return enums_1.ContentType.FORM;
        }
        else if (this._body instanceof FormData) {
            return enums_1.ContentType.FORM_DATA;
        }
        else if (this._body instanceof Blob) {
            return enums_1.ContentType.BLOB;
        }
        else if (this._body instanceof exports.ArrayBuffer) {
            return enums_1.ContentType.ARRAY_BUFFER;
        }
        else if (this._body && typeof this._body === 'object') {
            return enums_1.ContentType.JSON;
        }
        else {
            return enums_1.ContentType.TEXT;
        }
    };
    /**
     * Returns the request's body according to its type. If body is undefined, return
     * null.
     */
    Request.prototype.getBody = function () {
        switch (this.contentType) {
            case enums_1.ContentType.JSON:
                return this.text();
            case enums_1.ContentType.FORM:
                return this.text();
            case enums_1.ContentType.FORM_DATA:
                return this._body;
            case enums_1.ContentType.TEXT:
                return this.text();
            case enums_1.ContentType.BLOB:
                return this.blob();
            case enums_1.ContentType.ARRAY_BUFFER:
                return this.arrayBuffer();
            default:
                return null;
        }
    };
    return Request;
}(body_1.Body));
exports.Request = Request;
function urlEncodeParams(params) {
    var searchParams = new url_search_params_1.URLSearchParams();
    Object.keys(params).forEach(function (key) {
        var value = params[key];
        if (value && Array.isArray(value)) {
            value.forEach(function (element) { return searchParams.append(key, element.toString()); });
        }
        else {
            searchParams.append(key, value.toString());
        }
    });
    return searchParams;
}
var noop = function () { };
var w = typeof window == 'object' ? window : noop;
var FormData = w /** TODO #9100 */['FormData'] || noop;
var Blob = w /** TODO #9100 */['Blob'] || noop;
exports.ArrayBuffer = w /** TODO #9100 */['ArrayBuffer'] || noop;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljX3JlcXVlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9odHRwL3NyYy9zdGF0aWNfcmVxdWVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCwrQkFBNEI7QUFDNUIsaUNBQXdFO0FBQ3hFLHFDQUFrQztBQUNsQywyQ0FBaUQ7QUFFakQseURBQW9EO0FBR3BELHNEQUFzRDtBQUN0RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FzQ0c7QUFDSDtJQUE2QiwyQkFBSTtJQWlCL0IsaUJBQVksY0FBMkI7UUFBdkMsWUFDRSxpQkFBTyxTQTZCUjtRQTVCQyxtQ0FBbUM7UUFDbkMsSUFBTSxHQUFHLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQztRQUMvQixLQUFJLENBQUMsR0FBRyxHQUFHLGNBQWMsQ0FBQyxHQUFLLENBQUM7UUFDaEMsSUFBTSxTQUFTLEdBQUcsY0FBYyxDQUFDLE1BQU0sSUFBSSxjQUFjLENBQUMsTUFBTSxDQUFDO1FBQ2pFLElBQUksU0FBUyxFQUFFO1lBQ2IsSUFBSSxNQUFNLFNBQVEsQ0FBQztZQUNuQixJQUFJLE9BQU8sU0FBUyxLQUFLLFFBQVEsSUFBSSxDQUFDLENBQUMsU0FBUyxZQUFZLG1DQUFlLENBQUMsRUFBRTtnQkFDNUUsTUFBTSxHQUFHLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQzthQUNoRDtpQkFBTTtnQkFDTCxNQUFNLEdBQUcsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO2FBQy9CO1lBQ0QsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDckIsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDO2dCQUNqQixJQUFJLEtBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO29CQUMv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