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
var platform_browser_1 = require("@angular/platform-browser");
var rxjs_1 = require("rxjs");
var base_response_options_1 = require("../base_response_options");
var enums_1 = require("../enums");
var headers_1 = require("../headers");
var http_utils_1 = require("../http_utils");
var interfaces_1 = require("../interfaces");
var static_response_1 = require("../static_response");
var browser_xhr_1 = require("./browser_xhr");
var XSSI_PREFIX = /^\)\]\}',?\n/;
/**
 * Creates connections using `XMLHttpRequest`. Given a fully-qualified
 * request, an `XHRConnection` will immediately create an `XMLHttpRequest` object and send the
 * request.
 *
 * This class would typically not be created or interacted with directly inside applications, though
 * the {@link MockConnection} may be interacted with in tests.
 *
 * @deprecated see https://angular.io/guide/http
 */
var XHRConnection = /** @class */ (function () {
    function XHRConnection(req, browserXHR, baseResponseOptions) {
        var _this = this;
        this.request = req;
        this.response = new rxjs_1.Observable(function (responseObserver) {
            var _xhr = browserXHR.build();
            _xhr.open(enums_1.RequestMethod[req.method].toUpperCase(), req.url);
            if (req.withCredentials != null) {
                _xhr.withCredentials = req.withCredentials;
            }
            // load event handler
            var onLoad = function () {
                // normalize IE9 bug (http://bugs.jquery.com/ticket/1450)
                var status = _xhr.status === 1223 ? 204 : _xhr.status;
                var body = null;
                // HTTP 204 means no content
                if (status !== 204) {
                    // responseText is the old-school way of retrieving response (supported by IE8 & 9)
                    // response/responseType properties were introduced in ResourceLoader Level2 spec
                    // (supported by IE10)
                    body = (typeof _xhr.response === 'undefined') ? _xhr.responseText : _xhr.response;
                    // Implicitly strip a potential XSSI prefix.
                    if (typeof body === 'string') {
                        body = body.replace(XSSI_PREFIX, '');
                    }
                }
                // fix status code when it is 0 (0 status is undocumented).
                // Occurs when accessing file resources or on Android 4.1 stock browser
                // while retrieving files from application cache.
                if (status === 0) {
                    status = body ? 200 : 0;
                }
                var headers = headers_1.Headers.fromResponseHeaderString(_xhr.getAllResponseHeaders());
                // IE 9 does not provide the way to get URL of response
                var url = http_utils_1.getResponseURL(_xhr) || req.url;
                var statusText = _xhr.statusText || 'OK';
                var responseOptions = new base_response_options_1.ResponseOptions({ body: body, status: status, headers: headers, statusText: statusText, url: url });
                if (baseResponseOptions != null) {
                    responseOptions = baseResponseOptions.merge(responseOptions);
                }
                var response = new static_response_1.Response(responseOptions);
                response.ok = http_utils_1.isSuccess(status);
                if (response.ok) {
                    responseObserver.next(response);
                    // TODO(gdi2290): defer complete if array buffer until done
                    responseObserver.complete();
                    return;
                }
                responseObserver.error(response);
            };
            // error event handler
            var onError = function (err) {
                var responseOptions = new base_response_options_1.ResponseOptions({
                    body: err,
                    type: enums_1.ResponseType.Error,
                    status: _xhr.status,
                    statusText: _xhr.statusText,
                });
                if (baseResponseOptions != null) {
                    responseOptions = baseResponseOptions.merge(responseOptions);
                }
                responseObserver.error(new static_response_1.Response(responseOptions));
            };
            _this.setDetectedContentType(req, _xhr);
            if (req.headers == null) {
                req.headers = new headers_1.Headers();
            }
            if (!req.headers.has('Accept')) {
                req.headers.append('Accept', 'application/json, text/plain, */*');
            }
            req.headers.forEach(function (values, name) { return _xhr.setRequestHeader(name, values.join(',')); });
            // Select the correct buffer type to store the response
            if (req.responseType != null && _xhr.responseType != null) {
                switch (req.responseType) {
                    case enums_1.ResponseContentType.ArrayBuffer:
                        _xhr.responseType = 'arraybuffer';
                        break;
                    case enums_1.ResponseContentType.Json:
                        _xhr.responseType = 'json';
                        break;
                    case enums_1.ResponseContentType.Text:
                        _xhr.responseType = 'text';
                        break;
                    case enums_1.ResponseContentType.Blob:
                        _xhr.responseType = 'blob';
                        break;
                    default:
                        throw new Error('The selected responseType is not supported');
                }
            }
            _xhr.addEventListener('load', onLoad);
            _xhr.addEventListener('error', onError);
            _xhr.send(_this.request.getBody());
            return function () {
                _xhr.removeEventListener('load', onLoad);
                _xhr.removeEventListener('error', onError);
                _xhr.abort();
            };
        });
    }
    XHRConnection.prototype.setDetectedContentType = function (req /** TODO Request */, _xhr /** XMLHttpRequest */) {
        // Skip if a custom Content-Type header is provided
        if (req.headers != null && req.headers.get('Content-Type') != null) {
            return;
        }
        // Set the detected content type
        switch (req.contentType) {
            case enums_1.ContentType.NONE:
                break;
            case enums_1.ContentType.JSON:
                _xhr.setRequestHeader('content-type', 'application/json');
                break;
            case enums_1.ContentType.FORM:
                _xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
                break;
            case enums_1.ContentType.TEXT:
                _xhr.setRequestHeader('content-type', 'text/plain');
                break;
            case enums_1.ContentType.BLOB:
                var blob = req.blob();
                if (blob.type) {
                    _xhr.setRequestHeader('content-type', blob.type);
                }
                break;
        }
    };
    return XHRConnection;
}());
exports.XHRConnection = XHRConnection;
/**
 * `XSRFConfiguration` sets up Cross Site Request Forgery (XSRF) protection for the application
 * using a cookie. See https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)
 * for more information on XSRF.
 *
 * Applications can configure custom cookie and header names by binding an instance of this class
 * with different `cookieName` and `headerName` values. See the main HTTP documentation for more
 * details.
 *
 * @deprecated see https://angular.io/guide/http
 */
var CookieXSRFStrategy = /** @class */ (function () {
    function CookieXSRFStrategy(_cookieName, _headerName) {
        if (_cookieName === void 0) { _cookieName = 'XSRF-TOKEN'; }
        if (_headerName === void 0) { _headerName = 'X-XSRF-TOKEN'; }
        this._cookieName = _cookieName;
        this._headerName = _headerName;
    }
    CookieXSRFStrategy.prototype.configureRequest = function (req) {
        var xsrfToken = platform_browser_1.ɵgetDOM().getCookie(this._cookieName);
        if (xsrfToken) {
            req.headers.set(this._headerName, xsrfToken);
        }
    };
    return CookieXSRFStrategy;
}());
exports.CookieXSRFStrategy = CookieXSRFStrategy;
/**
 * Creates {@link XHRConnection} instances.
 *
 * This class would typically not be used by end users, but could be
 * overridden if a different backend implementation should be used,
 * such as in a node backend.
 *
 * @usageNotes
 * ### Example
 *
 * ```
 * import {Http, MyNodeBackend, HTTP_PROVIDERS, BaseRequestOptions} from '@angular/http';
 * @Component({
 *   viewProviders: [
 *     HTTP_PROVIDERS,
 *     {provide: Http, useFactory: (backend, options) => {
 *       return new Http(backend, options);
 *     }, deps: [MyNodeBackend, BaseRequestOptions]}]
 * })
 * class MyComponent {
 *   constructor(http:Http) {
 *     http.request('people.json').subscribe(res => this.people = res.json());
 *   }
 * }
 * ```
 * @deprecated see https://angular.io/guide/http
 */
var XHRBackend = /** @class */ (function () {
    function XHRBackend(_browserXHR, _baseResponseOptions, _xsrfStrategy) {
        this._browserXHR = _browserXHR;
        this._baseResponseOptions = _baseResponseOptions;
        this._xsrfStrategy = _xsrfStrategy;
    }
    XHRBackend.prototype.createConnection = function (request) {
        this._xsrfStrategy.configureRequest(request);
        return new XHRConnection(request, this._browserXHR, this._baseResponseOptions);
    };
    XHRBackend = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [browser_xhr_1.BrowserXhr, base_response_options_1.ResponseOptions,
            interfaces_1.XSRFStrategy])
    ], XHRBackend);
    return XHRBackend;
}());
exports.XHRBackend = XHRBackend;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGhyX2JhY2tlbmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9odHRwL3NyYy9iYWNrZW5kcy94aHJfYmFja2VuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUVILHNDQUF5QztBQUN6Qyw4REFBNEQ7QUFDNUQsNkJBQTBDO0FBQzFDLGtFQUF5RDtBQUN6RCxrQ0FBbUc7QUFDbkcsc0NBQW1DO0FBQ25DLDRDQUF3RDtBQUN4RCw0Q0FBMEU7QUFFMUUsc0RBQTRDO0FBQzVDLDZDQUF5QztBQUV6QyxJQUFNLFdBQVcsR0FBRyxjQUFjLENBQUM7QUFFbkM7Ozs7Ozs7OztHQVNHO0FBQ0g7SUFTRSx1QkFBWSxHQUFZLEVBQUUsVUFBc0IsRUFBRSxtQkFBcUM7UUFBdkYsaUJBNkdDO1FBNUdDLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1FBQ25CLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxpQkFBVSxDQUFXLFVBQUMsZ0JBQW9DO1lBQzVFLElBQU0sSUFBSSxHQUFtQixVQUFVLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDaEQsSUFBSSxDQUFDLElBQUksQ0FBQyxxQkFBYSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDNUQsSUFBSSxHQUFHLENBQUMsZUFBZSxJQUFJLElBQUksRUFBRTtnQkFDL0IsSUFBSSxDQUFDLGVBQWUsR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDO2FBQzVDO1lBQ0QscUJBQXFCO1lBQ3JCLElBQU0sTUFBTSxHQUFHO2dCQUNiLHlEQUF5RDtnQkFDekQsSUFBSSxNQUFNLEdBQVcsSUFBSSxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztnQkFFOUQs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