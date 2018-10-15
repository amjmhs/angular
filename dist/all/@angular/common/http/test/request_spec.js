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
var headers_1 = require("../src/headers");
var params_1 = require("../src/params");
var request_1 = require("../src/request");
var TEST_URL = 'http://angular.io';
var TEST_STRING = "I'm a body!";
{
    testing_internal_1.describe('HttpRequest', function () {
        testing_internal_1.describe('constructor', function () {
            testing_internal_1.it('initializes url', function () {
                var req = new request_1.HttpRequest('', TEST_URL, null);
                expect(req.url).toBe(TEST_URL);
            });
            testing_internal_1.it('doesn\'t require a body for body-less methods', function () {
                var req = new request_1.HttpRequest('GET', TEST_URL);
                expect(req.method).toBe('GET');
                expect(req.body).toBeNull();
                req = new request_1.HttpRequest('HEAD', TEST_URL);
                expect(req.method).toBe('HEAD');
                expect(req.body).toBeNull();
                req = new request_1.HttpRequest('JSONP', TEST_URL);
                expect(req.method).toBe('JSONP');
                expect(req.body).toBeNull();
                req = new request_1.HttpRequest('OPTIONS', TEST_URL);
                expect(req.method).toBe('OPTIONS');
                expect(req.body).toBeNull();
            });
            testing_internal_1.it('accepts a string request method', function () {
                var req = new request_1.HttpRequest('TEST', TEST_URL, null);
                expect(req.method).toBe('TEST');
            });
            testing_internal_1.it('accepts a string body', function () {
                var req = new request_1.HttpRequest('POST', TEST_URL, TEST_STRING);
                expect(req.body).toBe(TEST_STRING);
            });
            testing_internal_1.it('accepts an object body', function () {
                var req = new request_1.HttpRequest('POST', TEST_URL, { data: TEST_STRING });
                expect(req.body).toEqual({ data: TEST_STRING });
            });
            testing_internal_1.it('creates default headers if not passed', function () {
                var req = new request_1.HttpRequest('GET', TEST_URL);
                expect(req.headers instanceof headers_1.HttpHeaders).toBeTruthy();
            });
            testing_internal_1.it('uses the provided headers if passed', function () {
                var headers = new headers_1.HttpHeaders();
                var req = new request_1.HttpRequest('GET', TEST_URL, { headers: headers });
                expect(req.headers).toBe(headers);
            });
            testing_internal_1.it('defaults to Json', function () {
                var req = new request_1.HttpRequest('GET', TEST_URL);
                expect(req.responseType).toBe('json');
            });
        });
        testing_internal_1.describe('clone() copies the request', function () {
            var headers = new headers_1.HttpHeaders({
                'Test': 'Test header',
            });
            var req = new request_1.HttpRequest('POST', TEST_URL, 'test body', {
                headers: headers,
                reportProgress: true,
                responseType: 'text',
                withCredentials: true,
            });
            testing_internal_1.it('in the base case', function () {
                var clone = req.clone();
                expect(clone.method).toBe('POST');
                expect(clone.responseType).toBe('text');
                expect(clone.url).toBe(TEST_URL);
                // Headers should be the same, as the headers are sealed.
                expect(clone.headers).toBe(headers);
                expect(clone.headers.get('Test')).toBe('Test header');
            });
            testing_internal_1.it('and updates the url', function () { expect(req.clone({ url: '/changed' }).url).toBe('/changed'); });
            testing_internal_1.it('and updates the method', function () { expect(req.clone({ method: 'PUT' }).method).toBe('PUT'); });
            testing_internal_1.it('and updates the body', function () { expect(req.clone({ body: 'changed body' }).body).toBe('changed body'); });
        });
        testing_internal_1.describe('content type detection', function () {
            var baseReq = new request_1.HttpRequest('POST', '/test', null);
            testing_internal_1.it('handles a null body', function () { expect(baseReq.detectContentTypeHeader()).toBeNull(); });
            testing_internal_1.it('doesn\'t associate a content type with ArrayBuffers', function () {
                var req = baseReq.clone({ body: new ArrayBuffer(4) });
                expect(req.detectContentTypeHeader()).toBeNull();
            });
            testing_internal_1.it('handles strings as text', function () {
                var req = baseReq.clone({ body: 'hello world' });
                expect(req.detectContentTypeHeader()).toBe('text/plain');
            });
            testing_internal_1.it('handles arrays as json', function () {
                var req = baseReq.clone({ body: ['a', 'b'] });
                expect(req.detectContentTypeHeader()).toBe('application/json');
            });
            testing_internal_1.it('handles numbers as json', function () {
                var req = baseReq.clone({ body: 314159 });
                expect(req.detectContentTypeHeader()).toBe('application/json');
            });
            testing_internal_1.it('handles objects as json', function () {
                var req = baseReq.clone({ body: { data: 'test data' } });
                expect(req.detectContentTypeHeader()).toBe('application/json');
            });
        });
        testing_internal_1.describe('body serialization', function () {
            var baseReq = new request_1.HttpRequest('POST', '/test', null);
            testing_internal_1.it('handles a null body', function () { expect(baseReq.serializeBody()).toBeNull(); });
            testing_internal_1.it('passes ArrayBuffers through', function () {
                var body = new ArrayBuffer(4);
                expect(baseReq.clone({ body: body }).serializeBody()).toBe(body);
            });
            testing_internal_1.it('passes strings through', function () {
                var body = 'hello world';
                expect(baseReq.clone({ body: body }).serializeBody()).toBe(body);
            });
            testing_internal_1.it('serializes arrays as json', function () {
                expect(baseReq.clone({ body: ['a', 'b'] }).serializeBody()).toBe('["a","b"]');
            });
            testing_internal_1.it('handles numbers as json', function () { expect(baseReq.clone({ body: 314159 }).serializeBody()).toBe('314159'); });
            testing_internal_1.it('handles objects as json', function () {
                var req = baseReq.clone({ body: { data: 'test data' } });
                expect(req.serializeBody()).toBe('{"data":"test data"}');
            });
            testing_internal_1.it('serializes parameters as urlencoded', function () {
                var params = new params_1.HttpParams().append('first', 'value').append('second', 'other');
                var withParams = baseReq.clone({ body: params });
                expect(withParams.serializeBody()).toEqual('first=value&second=other');
                expect(withParams.detectContentTypeHeader())
                    .toEqual('application/x-www-form-urlencoded;charset=UTF-8');
            });
        });
        testing_internal_1.describe('parameter handling', function () {
            var baseReq = new request_1.HttpRequest('GET', '/test', null);
            var params = new params_1.HttpParams({ fromString: 'test=true' });
            testing_internal_1.it('appends parameters to a base URL', function () {
                var req = baseReq.clone({ params: params });
                expect(req.urlWithParams).toEqual('/test?test=true');
            });
            testing_internal_1.it('appends parameters to a URL with an empty query string', function () {
                var req = baseReq.clone({ params: params, url: '/test?' });
                expect(req.urlWithParams).toEqual('/test?test=true');
            });
            testing_internal_1.it('appends parameters to a URL with a query string', function () {
                var req = baseReq.clone({ params: params, url: '/test?other=false' });
                expect(req.urlWithParams).toEqual('/test?other=false&test=true');
            });
            testing_internal_1.it('sets parameters via setParams', function () {
                var req = baseReq.clone({ setParams: { 'test': 'false' } });
                expect(req.urlWithParams).toEqual('/test?test=false');
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWVzdF9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tbW9uL2h0dHAvdGVzdC9yZXF1ZXN0X3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCwrRUFBbUY7QUFFbkYsMENBQTJDO0FBQzNDLHdDQUF5QztBQUN6QywwQ0FBMkM7QUFFM0MsSUFBTSxRQUFRLEdBQUcsbUJBQW1CLENBQUM7QUFDckMsSUFBTSxXQUFXLEdBQUcsYUFBYSxDQUFDO0FBRWxDO0lBQ0UsMkJBQVEsQ0FBQyxhQUFhLEVBQUU7UUFDdEIsMkJBQVEsQ0FBQyxhQUFhLEVBQUU7WUFDdEIscUJBQUUsQ0FBQyxpQkFBaUIsRUFBRTtnQkFDcEIsSUFBTSxHQUFHLEdBQUcsSUFBSSxxQkFBVyxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ2hELE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2pDLENBQUMsQ0FBQyxDQUFDO1lBQ0gscUJBQUUsQ0FBQywrQ0FBK0MsRUFBRTtnQkFDbEQsSUFBSSxHQUFHLEdBQUcsSUFBSSxxQkFBVyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDM0MsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQy9CLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQzVCLEdBQUcsR0FBRyxJQUFJLHFCQUFXLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUN4QyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDaEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJ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