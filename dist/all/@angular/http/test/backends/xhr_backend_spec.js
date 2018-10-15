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
var core_1 = require("@angular/core");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var browser_xhr_1 = require("@angular/http/src/backends/browser_xhr");
var xhr_backend_1 = require("@angular/http/src/backends/xhr_backend");
var base_request_options_1 = require("@angular/http/src/base_request_options");
var base_response_options_1 = require("@angular/http/src/base_response_options");
var enums_1 = require("@angular/http/src/enums");
var headers_1 = require("@angular/http/src/headers");
var interfaces_1 = require("@angular/http/src/interfaces");
var static_request_1 = require("@angular/http/src/static_request");
var url_search_params_1 = require("@angular/http/src/url_search_params");
var platform_browser_1 = require("@angular/platform-browser");
var abortSpy;
var sendSpy;
var openSpy;
var setRequestHeaderSpy;
var existingXHRs = [];
var MockBrowserXHR = /** @class */ (function (_super) {
    __extends(MockBrowserXHR, _super);
    function MockBrowserXHR() {
        var _this = _super.call(this) || this;
        _this.callbacks = new Map();
        var spy = new testing_internal_1.SpyObject();
        _this.abort = abortSpy = spy.spy('abort');
        _this.send = sendSpy = spy.spy('send');
        _this.open = openSpy = spy.spy('open');
        _this.setRequestHeader = setRequestHeaderSpy = spy.spy('setRequestHeader');
        // If responseType is supported by the browser, then it should be set to an empty string.
        // (https://www.w3.org/TR/XMLHttpRequest/#the-responsetype-attribute)
        _this.responseType = '';
        return _this;
    }
    MockBrowserXHR.prototype.setStatusCode = function (status) { this.status = status; };
    MockBrowserXHR.prototype.setStatusText = function (statusText) { this.statusText = statusText; };
    MockBrowserXHR.prototype.setResponse = function (value) { this.response = value; };
    MockBrowserXHR.prototype.setResponseText = function (value) { this.responseText = value; };
    MockBrowserXHR.prototype.setResponseURL = function (value) { this.responseURL = value; };
    MockBrowserXHR.prototype.setResponseHeaders = function (value) { this.responseHeaders = value; };
    MockBrowserXHR.prototype.getAllResponseHeaders = function () { return this.responseHeaders || ''; };
    MockBrowserXHR.prototype.getResponseHeader = function (key) {
        return headers_1.Headers.fromResponseHeaderString(this.responseHeaders).get(key);
    };
    MockBrowserXHR.prototype.addEventListener = function (type, cb) { this.callbacks.set(type, cb); };
    MockBrowserXHR.prototype.removeEventListener = function (type, cb) { this.callbacks.delete(type); };
    MockBrowserXHR.prototype.dispatchEvent = function (type) { this.callbacks.get(type)({}); };
    MockBrowserXHR.prototype.build = function () {
        var xhr = new MockBrowserXHR();
        existingXHRs.push(xhr);
        return xhr;
    };
    return MockBrowserXHR;
}(browser_xhr_1.BrowserXhr));
{
    testing_internal_1.describe('XHRBackend', function () {
        var backend;
        var sampleRequest;
        testing_internal_1.beforeEachProviders(function () {
            return [{ provide: base_response_options_1.ResponseOptions, useClass: base_response_options_1.BaseResponseOptions },
                { provide: browser_xhr_1.BrowserXhr, useClass: MockBrowserXHR }, xhr_backend_1.XHRBackend,
                { provide: interfaces_1.XSRFStrategy, useValue: new xhr_backend_1.CookieXSRFStrategy() },
            ];
        });
        testing_internal_1.beforeEach(testing_internal_1.inject([xhr_backend_1.XHRBackend], function (be) {
            backend = be;
            var base = new base_request_options_1.BaseRequestOptions();
            sampleRequest =
                new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ url: 'https://google.com' })));
        }));
        testing_internal_1.afterEach(function () { existingXHRs = []; });
        testing_internal_1.describe('creating a connection', function () {
            var NoopXsrfStrategy = /** @class */ (function () {
                function NoopXsrfStrategy() {
                }
                NoopXsrfStrategy.prototype.configureRequest = function (req) { };
                NoopXsrfStrategy = __decorate([
                    core_1.Injectable()
                ], NoopXsrfStrategy);
                return NoopXsrfStrategy;
            }());
            testing_internal_1.beforeEachProviders(function () { return [{ provide: interfaces_1.XSRFStrategy, useClass: NoopXsrfStrategy }]; });
            testing_internal_1.it('succeeds', function () { testing_internal_1.expect(function () { return backend.createConnection(sampleRequest); }).not.toThrow(); });
        });
        if (platform_browser_1.ɵgetDOM().supportsCookies()) {
            testing_internal_1.describe('XSRF support', function () {
                testing_internal_1.it('sets an XSRF header by default', function () {
                    platform_browser_1.ɵgetDOM().setCookie('XSRF-TOKEN', 'magic XSRF value');
                    backend.createConnection(sampleRequest);
                    testing_internal_1.expect(sampleRequest.headers.get('X-XSRF-TOKEN')).toBe('magic XSRF value');
                });
                testing_internal_1.it('should allow overwriting of existing headers', function () {
                    platform_browser_1.ɵgetDOM().setCookie('XSRF-TOKEN', 'magic XSRF value');
                    sampleRequest.headers.set('X-XSRF-TOKEN', 'already set');
                    backend.createConnection(sampleRequest);
                    testing_internal_1.expect(sampleRequest.headers.get('X-XSRF-TOKEN')).toBe('magic XSRF value');
                });
                testing_internal_1.describe('configuration', function () {
                    testing_internal_1.beforeEachProviders(function () { return [{
                            provide: interfaces_1.XSRFStrategy,
                            useValue: new xhr_backend_1.CookieXSRFStrategy('my cookie', 'X-MY-HEADER')
                        }]; });
                    testing_internal_1.it('uses the configured names', function () {
                        platform_browser_1.ɵgetDOM().setCookie('my cookie', 'XSRF value');
                        backend.createConnection(sampleRequest);
                        testing_internal_1.expect(sampleRequest.headers.get('X-MY-HEADER')).toBe('XSRF value');
                    });
                });
            });
        }
        testing_internal_1.describe('XHRConnection', function () {
            testing_internal_1.it('should use the injected BaseResponseOptions to create the response', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions({ type: enums_1.ResponseType.Error }));
                connection.response.subscribe(function (res) {
                    testing_internal_1.expect(res.type).toBe(enums_1.ResponseType.Error);
                    async.done();
                });
                existingXHRs[0].setStatusCode(200);
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should complete a request', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions({ type: enums_1.ResponseType.Error }));
                connection.response.subscribe(function (res) { testing_internal_1.expect(res.type).toBe(enums_1.ResponseType.Error); }, null, function () { async.done(); });
                existingXHRs[0].setStatusCode(200);
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should call abort when disposed', function () {
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR());
                var request = connection.response.subscribe();
                request.unsubscribe();
                testing_internal_1.expect(abortSpy).toHaveBeenCalled();
            });
            testing_internal_1.it('should create an error Response on error', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions({ type: enums_1.ResponseType.Error }));
                connection.response.subscribe(null, function (res) {
                    testing_internal_1.expect(res.type).toBe(enums_1.ResponseType.Error);
                    async.done();
                });
                existingXHRs[0].dispatchEvent('error');
            }));
            testing_internal_1.it('should set the status text and status code on error', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions({ type: enums_1.ResponseType.Error }));
                connection.response.subscribe(null, function (res) {
                    testing_internal_1.expect(res.type).toBe(enums_1.ResponseType.Error);
                    testing_internal_1.expect(res.status).toEqual(0);
                    testing_internal_1.expect(res.statusText).toEqual('');
                    async.done();
                });
                var xhr = existingXHRs[0];
                // status=0 with a text='' is common for CORS errors
                xhr.setStatusCode(0);
                xhr.setStatusText('');
                xhr.dispatchEvent('error');
            }));
            testing_internal_1.it('should call open with method and url when subscribed to', function () {
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR());
                testing_internal_1.expect(openSpy).not.toHaveBeenCalled();
                connection.response.subscribe();
                testing_internal_1.expect(openSpy).toHaveBeenCalledWith('GET', sampleRequest.url);
            });
            testing_internal_1.it('should call send on the backend with request body when subscribed to', function () {
                var body = 'Some body to love';
                var base = new base_request_options_1.BaseRequestOptions();
                var connection = new xhr_backend_1.XHRConnection(new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ body: body }))), new MockBrowserXHR());
                testing_internal_1.expect(sendSpy).not.toHaveBeenCalled();
                connection.response.subscribe();
                testing_internal_1.expect(sendSpy).toHaveBeenCalledWith(body);
            });
            testing_internal_1.it('should attach headers to the request', function () {
                var headers = new headers_1.Headers({ 'Content-Type': 'text/xml', 'Breaking-Bad': '<3', 'X-Multi': ['a', 'b'] });
                var base = new base_request_options_1.BaseRequestOptions();
                var connection = new xhr_backend_1.XHRConnection(new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ headers: headers }))), new MockBrowserXHR());
                connection.response.subscribe();
                testing_internal_1.expect(setRequestHeaderSpy).toHaveBeenCalledWith('Content-Type', 'text/xml');
                testing_internal_1.expect(setRequestHeaderSpy).toHaveBeenCalledWith('Breaking-Bad', '<3');
                testing_internal_1.expect(setRequestHeaderSpy).toHaveBeenCalledWith('X-Multi', 'a,b');
            });
            testing_internal_1.it('should attach default Accept header', function () {
                var headers = new headers_1.Headers();
                var base = new base_request_options_1.BaseRequestOptions();
                var connection = new xhr_backend_1.XHRConnection(new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ headers: headers }))), new MockBrowserXHR());
                connection.response.subscribe();
                testing_internal_1.expect(setRequestHeaderSpy)
                    .toHaveBeenCalledWith('Accept', 'application/json, text/plain, */*');
            });
            testing_internal_1.it('should not override user provided Accept header', function () {
                var headers = new headers_1.Headers({ 'Accept': 'text/xml' });
                var base = new base_request_options_1.BaseRequestOptions();
                var connection = new xhr_backend_1.XHRConnection(new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ headers: headers }))), new MockBrowserXHR());
                connection.response.subscribe();
                testing_internal_1.expect(setRequestHeaderSpy).toHaveBeenCalledWith('Accept', 'text/xml');
            });
            testing_internal_1.it('should skip content type detection if custom content type header is set', function () {
                var headers = new headers_1.Headers({ 'Content-Type': 'text/plain' });
                var body = { test: 'val' };
                var base = new base_request_options_1.BaseRequestOptions();
                var connection = new xhr_backend_1.XHRConnection(new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ body: body, headers: headers }))), new MockBrowserXHR());
                connection.response.subscribe();
                testing_internal_1.expect(setRequestHeaderSpy).toHaveBeenCalledWith('Content-Type', 'text/plain');
                testing_internal_1.expect(setRequestHeaderSpy).not.toHaveBeenCalledWith('Content-Type', 'application/json');
                testing_internal_1.expect(setRequestHeaderSpy).not.toHaveBeenCalledWith('content-type', 'application/json');
            });
            testing_internal_1.it('should use object body and detect content type header to the request', function () {
                var body = { test: 'val' };
                var base = new base_request_options_1.BaseRequestOptions();
                var connection = new xhr_backend_1.XHRConnection(new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ body: body }))), new MockBrowserXHR());
                connection.response.subscribe();
                testing_internal_1.expect(sendSpy).toHaveBeenCalledWith(JSON.stringify(body, null, 2));
                testing_internal_1.expect(setRequestHeaderSpy).toHaveBeenCalledWith('content-type', 'application/json');
            });
            testing_internal_1.it('should use number body and detect content type header to the request', function () {
                var body = 23;
                var base = new base_request_options_1.BaseRequestOptions();
                var connection = new xhr_backend_1.XHRConnection(new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ body: body }))), new MockBrowserXHR());
                connection.response.subscribe();
                testing_internal_1.expect(sendSpy).toHaveBeenCalledWith('23');
                testing_internal_1.expect(setRequestHeaderSpy).toHaveBeenCalledWith('content-type', 'text/plain');
            });
            testing_internal_1.it('should use string body and detect content type header to the request', function () {
                var body = 'some string';
                var base = new base_request_options_1.BaseRequestOptions();
                var connection = new xhr_backend_1.XHRConnection(new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ body: body }))), new MockBrowserXHR());
                connection.response.subscribe();
                testing_internal_1.expect(sendSpy).toHaveBeenCalledWith(body);
                testing_internal_1.expect(setRequestHeaderSpy).toHaveBeenCalledWith('content-type', 'text/plain');
            });
            testing_internal_1.it('should use URLSearchParams body and detect content type header to the request', function () {
                var body = new url_search_params_1.URLSearchParams();
                body.set('test1', 'val1');
                body.set('test2', 'val2');
                var base = new base_request_options_1.BaseRequestOptions();
                var connection = new xhr_backend_1.XHRConnection(new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ body: body }))), new MockBrowserXHR());
                connection.response.subscribe();
                testing_internal_1.expect(sendSpy).toHaveBeenCalledWith('test1=val1&test2=val2');
                testing_internal_1.expect(setRequestHeaderSpy)
                    .toHaveBeenCalledWith('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
            });
            if (global /** TODO #9100 */['Blob']) {
                // `new Blob(...)` throws an 'Illegal constructor' exception in Android browser <= 4.3,
                // but a BlobBuilder can be used instead
                var createBlob_1 = function (data, datatype) {
                    var newBlob;
                    try {
                        newBlob = new Blob(data || [], datatype ? { type: datatype } : {});
                    }
                    catch (e) {
                        var BlobBuilder = global.BlobBuilder || global.WebKitBlobBuilder ||
                            global.MozBlobBuilder || global.MSBlobBuilder;
                        var builder = new BlobBuilder();
                        builder.append(data);
                        newBlob = builder.getBlob(datatype);
                    }
                    return newBlob;
                };
                testing_internal_1.it('should use FormData body and detect content type header to the request', function () {
                    var body = new FormData();
                    body.append('test1', 'val1');
                    body.append('test2', '123456');
                    var blob = createBlob_1(['body { color: red; }'], 'text/css');
                    body.append('userfile', blob);
                    var base = new base_request_options_1.BaseRequestOptions();
                    var connection = new xhr_backend_1.XHRConnection(new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ body: body }))), new MockBrowserXHR());
                    connection.response.subscribe();
                    testing_internal_1.expect(sendSpy).toHaveBeenCalledWith(body);
                    testing_internal_1.expect(setRequestHeaderSpy).not.toHaveBeenCalledWith();
                });
                testing_internal_1.it('should use blob body and detect content type header to the request', function () {
                    var body = createBlob_1(['body { color: red; }'], 'text/css');
                    var base = new base_request_options_1.BaseRequestOptions();
                    var connection = new xhr_backend_1.XHRConnection(new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ body: body }))), new MockBrowserXHR());
                    connection.response.subscribe();
                    testing_internal_1.expect(sendSpy).toHaveBeenCalledWith(body);
                    testing_internal_1.expect(setRequestHeaderSpy).toHaveBeenCalledWith('content-type', 'text/css');
                });
                testing_internal_1.it('should use blob body without type to the request', function () {
                    var body = createBlob_1(['body { color: red; }'], null);
                    var base = new base_request_options_1.BaseRequestOptions();
                    var connection = new xhr_backend_1.XHRConnection(new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ body: body }))), new MockBrowserXHR());
                    connection.response.subscribe();
                    testing_internal_1.expect(sendSpy).toHaveBeenCalledWith(body);
                    testing_internal_1.expect(setRequestHeaderSpy).not.toHaveBeenCalledWith();
                });
                testing_internal_1.it('should use blob body without type with custom content type header to the request', function () {
                    var headers = new headers_1.Headers({ 'Content-Type': 'text/css' });
                    var body = createBlob_1(['body { color: red; }'], null);
                    var base = new base_request_options_1.BaseRequestOptions();
                    var connection = new xhr_backend_1.XHRConnection(new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ body: body, headers: headers }))), new MockBrowserXHR());
                    connection.response.subscribe();
                    testing_internal_1.expect(sendSpy).toHaveBeenCalledWith(body);
                    testing_internal_1.expect(setRequestHeaderSpy).toHaveBeenCalledWith('Content-Type', 'text/css');
                });
                testing_internal_1.it('should use array buffer body to the request', function () {
                    var body = new ArrayBuffer(512);
                    var longInt8View = new Uint8Array(body);
                    for (var i = 0; i < longInt8View.length; i++) {
                        longInt8View[i] = i % 255;
                    }
                    var base = new base_request_options_1.BaseRequestOptions();
                    var connection = new xhr_backend_1.XHRConnection(new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ body: body }))), new MockBrowserXHR());
                    connection.response.subscribe();
                    testing_internal_1.expect(sendSpy).toHaveBeenCalledWith(body);
                    testing_internal_1.expect(setRequestHeaderSpy).not.toHaveBeenCalledWith();
                });
                testing_internal_1.it('should use array buffer body without type with custom content type header to the request', function () {
                    var headers = new headers_1.Headers({ 'Content-Type': 'text/css' });
                    var body = new ArrayBuffer(512);
                    var longInt8View = new Uint8Array(body);
                    for (var i = 0; i < longInt8View.length; i++) {
                        longInt8View[i] = i % 255;
                    }
                    var base = new base_request_options_1.BaseRequestOptions();
                    var connection = new xhr_backend_1.XHRConnection(new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ body: body, headers: headers }))), new MockBrowserXHR());
                    connection.response.subscribe();
                    testing_internal_1.expect(sendSpy).toHaveBeenCalledWith(body);
                    testing_internal_1.expect(setRequestHeaderSpy).toHaveBeenCalledWith('Content-Type', 'text/css');
                });
            }
            testing_internal_1.it('should return the correct status code', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var statusCode = 418;
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions({ status: statusCode }));
                connection.response.subscribe(function (res) {
                }, function (errRes) {
                    testing_internal_1.expect(errRes.status).toBe(statusCode);
                    async.done();
                });
                existingXHRs[0].setStatusCode(statusCode);
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should call next and complete on 200 codes', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var nextCalled = false;
                var errorCalled = false;
                var statusCode = 200;
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions({ status: statusCode }));
                connection.response.subscribe(function (res) {
                    nextCalled = true;
                    testing_internal_1.expect(res.status).toBe(statusCode);
                }, function (errRes) { errorCalled = true; }, function () {
                    testing_internal_1.expect(nextCalled).toBe(true);
                    testing_internal_1.expect(errorCalled).toBe(false);
                    async.done();
                });
                existingXHRs[0].setStatusCode(statusCode);
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should set ok to true on 200 return', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var statusCode = 200;
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions({ status: statusCode }));
                connection.response.subscribe(function (res) {
                    testing_internal_1.expect(res.ok).toBe(true);
                    async.done();
                });
                existingXHRs[0].setStatusCode(statusCode);
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should set ok to false on 300 return', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var statusCode = 300;
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions({ status: statusCode }));
                connection.response.subscribe(function (res) { throw 'should not be called'; }, function (errRes) {
                    testing_internal_1.expect(errRes.ok).toBe(false);
                    async.done();
                });
                existingXHRs[0].setStatusCode(statusCode);
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should call error and not complete on 300+ codes', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var nextCalled = false;
                var errorCalled = false;
                var statusCode = 301;
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions({ status: statusCode }));
                connection.response.subscribe(function (res) { nextCalled = true; }, function (errRes) {
                    testing_internal_1.expect(errRes.status).toBe(statusCode);
                    testing_internal_1.expect(nextCalled).toBe(false);
                    async.done();
                }, function () { throw 'should not be called'; });
                existingXHRs[0].setStatusCode(statusCode);
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should normalize IE\'s 1223 status code into 204', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var statusCode = 1223;
                var normalizedCode = 204;
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions({ status: statusCode }));
                connection.response.subscribe(function (res) {
                    testing_internal_1.expect(res.status).toBe(normalizedCode);
                    async.done();
                });
                existingXHRs[0].setStatusCode(statusCode);
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should ignore response body for 204 status code', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var statusCode = 204;
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions({ status: statusCode }));
                connection.response.subscribe(function (res) {
                    testing_internal_1.expect(res.text()).toBe('');
                    async.done();
                });
                existingXHRs[0].setStatusCode(statusCode);
                existingXHRs[0].setResponseText('Doge');
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should normalize responseText and response', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var responseBody = 'Doge';
                var connection1 = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions());
                var connection2 = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions());
                connection1.response.subscribe(function (res) {
                    testing_internal_1.expect(res.text()).toBe(responseBody);
                    connection2.response.subscribe(function (res) {
                        testing_internal_1.expect(res.text()).toBe(responseBody);
                        async.done();
                    });
                    existingXHRs[1].setStatusCode(200);
                    existingXHRs[1].setResponse(responseBody);
                    existingXHRs[1].dispatchEvent('load');
                });
                existingXHRs[0].setStatusCode(200);
                existingXHRs[0].setResponseText(responseBody);
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should strip XSSI prefixes', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var conn = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions());
                conn.response.subscribe(function (res) {
                    testing_internal_1.expect(res.text()).toBe('{json: "object"}');
                    async.done();
                });
                existingXHRs[0].setStatusCode(200);
                existingXHRs[0].setResponseText(')]}\'\n{json: "object"}');
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should strip XSSI prefixes', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var conn = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions());
                conn.response.subscribe(function (res) {
                    testing_internal_1.expect(res.text()).toBe('{json: "object"}');
                    async.done();
                });
                existingXHRs[0].setStatusCode(200);
                existingXHRs[0].setResponseText(')]}\',\n{json: "object"}');
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should strip XSSI prefix from errors', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var conn = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions());
                conn.response.subscribe(null, function (res) {
                    testing_internal_1.expect(res.text()).toBe('{json: "object"}');
                    async.done();
                });
                existingXHRs[0].setStatusCode(404);
                existingXHRs[0].setResponseText(')]}\'\n{json: "object"}');
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should parse response headers and add them to the response', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var statusCode = 200;
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions({ status: statusCode }));
                var responseHeaderString = "Date: Fri, 20 Nov 2015 01:45:26 GMT\nContent-Type: application/json; charset=utf-8\nTransfer-Encoding: chunked\nConnection: keep-alive";
                connection.response.subscribe(function (res) {
                    testing_internal_1.expect(res.headers.get('Date')).toEqual('Fri, 20 Nov 2015 01:45:26 GMT');
                    testing_internal_1.expect(res.headers.get('Content-Type')).toEqual('application/json; charset=utf-8');
                    testing_internal_1.expect(res.headers.get('Transfer-Encoding')).toEqual('chunked');
                    testing_internal_1.expect(res.headers.get('Connection')).toEqual('keep-alive');
                    async.done();
                });
                existingXHRs[0].setResponseHeaders(responseHeaderString);
                existingXHRs[0].setStatusCode(statusCode);
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should add the responseURL to the response', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var statusCode = 200;
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions({ status: statusCode }));
                connection.response.subscribe(function (res) {
                    testing_internal_1.expect(res.url).toEqual('http://google.com');
                    async.done();
                });
                existingXHRs[0].setResponseURL('http://google.com');
                existingXHRs[0].setStatusCode(statusCode);
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should add use the X-Request-URL in CORS situations', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var statusCode = 200;
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions({ status: statusCode }));
                var responseHeaders = "X-Request-URL: http://somedomain.com\n           Foo: Bar";
                connection.response.subscribe(function (res) {
                    testing_internal_1.expect(res.url).toEqual('http://somedomain.com');
                    async.done();
                });
                existingXHRs[0].setResponseHeaders(responseHeaders);
                existingXHRs[0].setStatusCode(statusCode);
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should return request url if it cannot be retrieved from response', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var statusCode = 200;
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions({ status: statusCode }));
                connection.response.subscribe(function (res) {
                    testing_internal_1.expect(res.url).toEqual('https://google.com');
                    async.done();
                });
                existingXHRs[0].setStatusCode(statusCode);
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should set the status text property from the XMLHttpRequest instance if present', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var statusText = 'test';
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR());
                connection.response.subscribe(function (res) {
                    testing_internal_1.expect(res.statusText).toBe(statusText);
                    async.done();
                });
                existingXHRs[0].setStatusText(statusText);
                existingXHRs[0].setStatusCode(200);
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should set status text to "OK" if it is not present in XMLHttpRequest instance', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR());
                connection.response.subscribe(function (res) {
                    testing_internal_1.expect(res.statusText).toBe('OK');
                    async.done();
                });
                existingXHRs[0].setStatusCode(200);
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should set withCredentials to true when defined in request options for CORS situations', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var statusCode = 200;
                sampleRequest.withCredentials = true;
                var mockXhr = new MockBrowserXHR();
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, mockXhr, new base_response_options_1.ResponseOptions({ status: statusCode }));
                var responseHeaders = "X-Request-URL: http://somedomain.com\n           Foo: Bar";
                connection.response.subscribe(function (res) {
                    testing_internal_1.expect(res.url).toEqual('http://somedomain.com');
                    testing_internal_1.expect(existingXHRs[0].withCredentials).toBeTruthy();
                    async.done();
                });
                existingXHRs[0].setResponseHeaders(responseHeaders);
                existingXHRs[0].setStatusCode(statusCode);
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should set the responseType attribute to blob when the corresponding response content type is present', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var statusCode = 200;
                var base = new base_request_options_1.BaseRequestOptions();
                var connection = new xhr_backend_1.XHRConnection(new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ responseType: enums_1.ResponseContentType.Blob }))), new MockBrowserXHR());
                connection.response.subscribe(function (res) {
                    testing_internal_1.expect(existingXHRs[0].responseType).toBe('blob');
                    async.done();
                });
                existingXHRs[0].setStatusCode(statusCode);
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should not throw invalidStateError if response without body and responseType not equal to text', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var base = new base_request_options_1.BaseRequestOptions();
                var connection = new xhr_backend_1.XHRConnection(new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ responseType: enums_1.ResponseContentType.Json }))), new MockBrowserXHR());
                connection.response.subscribe(function (res) {
                    testing_internal_1.expect(res.json()).toBe(null);
                    async.done();
                });
                existingXHRs[0].setStatusCode(204);
                existingXHRs[0].dispatchEvent('load');
            }));
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGhyX2JhY2tlbmRfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2h0dHAvdGVzdC9iYWNrZW5kcy94aHJfYmFja2VuZF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILHNDQUF5QztBQUN6QywrRUFBbUs7QUFDbkssc0VBQWtFO0FBQ2xFLHNFQUFxRztBQUNyRywrRUFBMEY7QUFDMUYsaUZBQTZGO0FBQzdGLGlEQUEwRTtBQUMxRSxxREFBa0Q7QUFDbEQsMkRBQTBEO0FBQzFELG1FQUF5RDtBQUV6RCx5RUFBb0U7QUFDcEUsOERBQTREO0FBRTVELElBQUksUUFBYSxDQUFDO0FBQ2xCLElBQUksT0FBWSxDQUFDO0FBQ2pCLElBQUksT0FBWSxDQUFDO0FBQ2pCLElBQUksbUJBQXdCLENBQUM7QUFDN0IsSUFBSSxZQUFZLEdBQXFCLEVBQUUsQ0FBQztBQUV4QztJQUE2QixrQ0FBVTtJQXFCckM7UUFBQSxZQUNFLGlCQUFPLFNBU1I7UUF0QkQsZUFBUyxHQUFHLElBQUksR0FBRyxFQUFvQixDQUFDO1FBY3RDLElBQU0sR0FBRyxHQUFHLElBQUksNEJBQVMsRUFBRSxDQUFDO1FBQzVCLEtBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDekMsS0FBSSxDQUFDLElBQUksR0FBRyxPQUFPLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0QyxLQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RDLEtBQUksQ0FBQyxnQkFBZ0IsR0FBRyxtQkFBbUIsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDMUUseUZBQXlGO1FBQ3pG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