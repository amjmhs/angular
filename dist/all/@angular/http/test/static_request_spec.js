"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var base_request_options_1 = require("@angular/http/src/base_request_options");
var enums_1 = require("@angular/http/src/enums");
var headers_1 = require("@angular/http/src/headers");
var http_utils_1 = require("@angular/http/src/http_utils");
var static_request_1 = require("@angular/http/src/static_request");
var platform_browser_1 = require("@angular/platform-browser");
{
    testing_internal_1.describe('Request', function () {
        testing_internal_1.describe('detectContentType', function () {
            testing_internal_1.it('should return ContentType.NONE', function () {
                var req = new static_request_1.Request(new base_request_options_1.RequestOptions({ url: 'test', method: 'GET', body: null }));
                testing_internal_1.expect(req.detectContentType()).toEqual(enums_1.ContentType.NONE);
            });
            testing_internal_1.it('should return ContentType.JSON', function () {
                var req = new static_request_1.Request(new base_request_options_1.RequestOptions({
                    url: 'test',
                    method: 'GET',
                    body: null,
                    headers: new headers_1.Headers({ 'content-type': 'application/json' })
                }));
                testing_internal_1.expect(req.detectContentType()).toEqual(enums_1.ContentType.JSON);
            });
            testing_internal_1.it('should return ContentType.FORM', function () {
                var req = new static_request_1.Request(new base_request_options_1.RequestOptions({
                    url: 'test',
                    method: 'GET',
                    body: null,
                    headers: new headers_1.Headers({ 'content-type': 'application/x-www-form-urlencoded' })
                }));
                testing_internal_1.expect(req.detectContentType()).toEqual(enums_1.ContentType.FORM);
            });
            testing_internal_1.it('should return ContentType.FORM_DATA', function () {
                var req = new static_request_1.Request(new base_request_options_1.RequestOptions({
                    url: 'test',
                    method: 'GET',
                    body: null,
                    headers: new headers_1.Headers({ 'content-type': 'multipart/form-data' })
                }));
                testing_internal_1.expect(req.detectContentType()).toEqual(enums_1.ContentType.FORM_DATA);
            });
            testing_internal_1.it('should return ContentType.TEXT', function () {
                var req = new static_request_1.Request(new base_request_options_1.RequestOptions({
                    url: 'test',
                    method: 'GET',
                    body: null,
                    headers: new headers_1.Headers({ 'content-type': 'text/plain' })
                }));
                testing_internal_1.expect(req.detectContentType()).toEqual(enums_1.ContentType.TEXT);
            });
            testing_internal_1.it('should return ContentType.BLOB', function () {
                var req = new static_request_1.Request(new base_request_options_1.RequestOptions({
                    url: 'test',
                    method: 'GET',
                    body: null,
                    headers: new headers_1.Headers({ 'content-type': 'application/octet-stream' })
                }));
                testing_internal_1.expect(req.detectContentType()).toEqual(enums_1.ContentType.BLOB);
            });
            testing_internal_1.it('should not create a blob out of ArrayBuffer', function () {
                var req = new static_request_1.Request(new base_request_options_1.RequestOptions({
                    url: 'test',
                    method: 'GET',
                    body: new static_request_1.ArrayBuffer(1),
                    headers: new headers_1.Headers({ 'content-type': 'application/octet-stream' })
                }));
                testing_internal_1.expect(req.detectContentType()).toEqual(enums_1.ContentType.ARRAY_BUFFER);
            });
        });
        testing_internal_1.it('should return empty string if no body is present', function () {
            var req = new static_request_1.Request(new base_request_options_1.RequestOptions({
                url: 'test',
                method: 'GET',
                body: null,
                headers: new headers_1.Headers({ 'content-type': 'application/json' })
            }));
            testing_internal_1.expect(req.text()).toEqual('');
        });
        testing_internal_1.it('should return empty string if body is undefined', function () {
            var reqOptions = new base_request_options_1.RequestOptions({ url: 'test', method: 'GET', headers: new headers_1.Headers({ 'content-type': 'application/json' }) });
            delete reqOptions.body;
            var req = new static_request_1.Request(reqOptions);
            testing_internal_1.expect(req.text()).toEqual('');
        });
        testing_internal_1.it('should use object params', function () {
            var req = new static_request_1.Request({ url: 'http://test.com', params: { 'a': 3, 'b': ['x', 'y'] } });
            testing_internal_1.expect(req.url).toBe('http://test.com?a=3&b=x&b=y');
        });
        testing_internal_1.it('should use search if present', function () {
            var req = new static_request_1.Request({ url: 'http://test.com', search: 'a=1&b=2' });
            testing_internal_1.expect(req.url).toBe('http://test.com?a=1&b=2');
        });
        if (platform_browser_1.ɵgetDOM().supportsWebAnimation()) {
            testing_internal_1.it('should serialize an ArrayBuffer to string via legacy encoding', function () {
                var str = '\u89d2\u5ea6';
                testing_internal_1.expect(new static_request_1.Request({ body: http_utils_1.stringToArrayBuffer(str), url: '/' }).text()).toEqual(str);
            });
            testing_internal_1.it('should serialize an ArrayBuffer to string via iso-8859 encoding', function () {
                var str = 'abcd';
                testing_internal_1.expect(new static_request_1.Request({ body: http_utils_1.stringToArrayBuffer8(str), url: '/' }).text('iso-8859'))
                    .toEqual(str);
            });
        }
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljX3JlcXVlc3Rfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2h0dHAvdGVzdC9zdGF0aWNfcmVxdWVzdF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsK0VBQWdGO0FBQ2hGLCtFQUFzRTtBQUN0RSxpREFBb0Q7QUFDcEQscURBQWtEO0FBQ2xELDJEQUF1RjtBQUN2RixtRUFBc0U7QUFDdEUsOERBQTREO0FBRTVEO0lBQ0UsMkJBQVEsQ0FBQyxTQUFTLEVBQUU7UUFDbEIsMkJBQVEsQ0FBQyxtQkFBbUIsRUFBRTtZQUM1QixxQkFBRSxDQUFDLGdDQUFnQyxFQUFFO2dCQUNuQyxJQUFNLEdBQUcsR0FDTCxJQUFJLHdCQUFPLENBQUMsSUFBSSxxQ0FBYyxDQUFDLEVBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUMsQ0FBUSxDQUFDLENBQUM7Z0JBRXJGLHlCQUFNLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsbUJBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM1RCxDQUFDLENBQUMsQ0FBQztZQUVILHFCQUFFLENBQUMsZ0NBQWdDLEVBQUU7Z0JBQ25DLElBQU0sR0FBRyxHQUFHLElBQUksd0JBQU8sQ0FBQyxJQUFJLHFDQUFjLENBQUM7b0JBQ3pDLEdBQUcsRUFBRSxNQUFNO29CQUNYLE1BQU0sRUFBRSxLQUFLO29CQUNiLElBQUksRUFBRSxJQUFJO29CQUNWLE9BQU8sRUFBRSxJQUFJLGlCQUFPLENBQUMsRUFBQyxjQUFjLEVBQUUsa0JBQWtCLEVBQUMsQ0FBQztpQkFDM0QsQ0FBUSxDQUFDLENBQUM7Z0JBRVgseUJBQU0sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxtQkFBVyxDQUFDLElBQUks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