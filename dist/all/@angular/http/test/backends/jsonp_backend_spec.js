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
var core_1 = require("@angular/core");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var browser_jsonp_1 = require("@angular/http/src/backends/browser_jsonp");
var jsonp_backend_1 = require("@angular/http/src/backends/jsonp_backend");
var base_request_options_1 = require("@angular/http/src/base_request_options");
var base_response_options_1 = require("@angular/http/src/base_response_options");
var enums_1 = require("@angular/http/src/enums");
var static_request_1 = require("@angular/http/src/static_request");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
var existingScripts = [];
var MockBrowserJsonp = /** @class */ (function (_super) {
    __extends(MockBrowserJsonp, _super);
    function MockBrowserJsonp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.callbacks = new Map();
        return _this;
    }
    MockBrowserJsonp.prototype.addEventListener = function (type, cb) { this.callbacks.set(type, cb); };
    MockBrowserJsonp.prototype.removeEventListener = function (type, cb) { this.callbacks.delete(type); };
    MockBrowserJsonp.prototype.dispatchEvent = function (type, argument) {
        if (argument === void 0) { argument = {}; }
        var cb = this.callbacks.get(type);
        if (cb) {
            cb(argument);
        }
    };
    MockBrowserJsonp.prototype.build = function (url) {
        var script = new MockBrowserJsonp();
        script.src = url;
        existingScripts.push(script);
        return script;
    };
    MockBrowserJsonp.prototype.send = function (node) {
    };
    MockBrowserJsonp.prototype.cleanup = function (node) {
    };
    return MockBrowserJsonp;
}(browser_jsonp_1.BrowserJsonp));
{
    testing_internal_1.describe('JSONPBackend', function () {
        var backend;
        var sampleRequest;
        testing_internal_1.beforeEach(function () {
            var injector = core_1.Injector.create([
                { provide: base_response_options_1.ResponseOptions, useClass: base_response_options_1.BaseResponseOptions, deps: [] },
                { provide: browser_jsonp_1.BrowserJsonp, useClass: MockBrowserJsonp, deps: [] },
                { provide: jsonp_backend_1.JSONPBackend, useClass: jsonp_backend_1.JSONPBackend, deps: [browser_jsonp_1.BrowserJsonp, base_response_options_1.ResponseOptions] }
            ]);
            backend = injector.get(jsonp_backend_1.JSONPBackend);
            var base = new base_request_options_1.BaseRequestOptions();
            sampleRequest =
                new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ url: 'https://google.com' })));
        });
        testing_internal_1.afterEach(function () { existingScripts = []; });
        testing_internal_1.it('should create a connection', function () {
            var instance = undefined;
            matchers_1.expect(function () { return instance = backend.createConnection(sampleRequest); }).not.toThrow();
            matchers_1.expect(instance).toBeAnInstanceOf(jsonp_backend_1.JSONPConnection);
        });
        testing_internal_1.describe('JSONPConnection', function () {
            testing_internal_1.it('should use the injected BaseResponseOptions to create the response', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var connection = new jsonp_backend_1.JSONPConnection(sampleRequest, new MockBrowserJsonp(), new base_response_options_1.ResponseOptions({ type: enums_1.ResponseType.Error }));
                connection.response.subscribe(function (res) {
                    matchers_1.expect(res.type).toBe(enums_1.ResponseType.Error);
                    async.done();
                });
                connection.finished();
                existingScripts[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should ignore load/callback when disposed', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var connection = new jsonp_backend_1.JSONPConnection(sampleRequest, new MockBrowserJsonp());
                var spy = new testing_internal_1.SpyObject();
                var loadSpy = spy.spy('load');
                var errorSpy = spy.spy('error');
                var returnSpy = spy.spy('cancelled');
                var request = connection.response.subscribe(loadSpy, errorSpy, returnSpy);
                request.unsubscribe();
                connection.finished('Fake data');
                existingScripts[0].dispatchEvent('load');
                setTimeout(function () {
                    matchers_1.expect(connection.readyState).toBe(enums_1.ReadyState.Cancelled);
                    matchers_1.expect(loadSpy).not.toHaveBeenCalled();
                    matchers_1.expect(errorSpy).not.toHaveBeenCalled();
                    matchers_1.expect(returnSpy).not.toHaveBeenCalled();
                    async.done();
                }, 10);
            }));
            testing_internal_1.it('should report error if loaded without invoking callback', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var connection = new jsonp_backend_1.JSONPConnection(sampleRequest, new MockBrowserJsonp());
                connection.response.subscribe(function () { return async.fail('Response listener should not be called'); }, function (err) {
                    matchers_1.expect(err.text()).toBe('JSONP injected script did not invoke callback.');
                    async.done();
                });
                existingScripts[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should report error if script contains error', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var connection = new jsonp_backend_1.JSONPConnection(sampleRequest, new MockBrowserJsonp());
                connection.response.subscribe(function () { return async.fail('Response listener should not be called'); }, function (err) {
                    matchers_1.expect(err.text()).toBe('Oops!');
                    async.done();
                });
                existingScripts[0].dispatchEvent('error', ({ message: 'Oops!' }));
            }));
            testing_internal_1.it('should throw if request method is not GET', function () {
                [enums_1.RequestMethod.Post, enums_1.RequestMethod.Put, enums_1.RequestMethod.Delete, enums_1.RequestMethod.Options,
                    enums_1.RequestMethod.Head, enums_1.RequestMethod.Patch]
                    .forEach(function (method) {
                    var base = new base_request_options_1.BaseRequestOptions();
                    var req = new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ url: 'https://google.com', method: method })));
                    matchers_1.expect(function () { return new jsonp_backend_1.JSONPConnection(req, new MockBrowserJsonp())
                        .response.subscribe(); })
                        .toThrowError();
                });
            });
            testing_internal_1.it('should respond with data passed to callback', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var connection = new jsonp_backend_1.JSONPConnection(sampleRequest, new MockBrowserJsonp());
                connection.response.subscribe(function (res) {
                    matchers_1.expect(res.json()).toEqual(({ fake_payload: true, blob_id: 12345 }));
                    async.done();
                });
                connection.finished(({ fake_payload: true, blob_id: 12345 }));
                existingScripts[0].dispatchEvent('load');
            }));
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbnBfYmFja2VuZF9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvaHR0cC90ZXN0L2JhY2tlbmRzL2pzb25wX2JhY2tlbmRfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBdUM7QUFDdkMsK0VBQXNJO0FBQ3RJLDBFQUFzRTtBQUN0RSwwRUFBdUY7QUFDdkYsK0VBQTBGO0FBQzFGLGlGQUE2RjtBQUM3RixpREFBZ0Y7QUFDaEYsbUVBQXlEO0FBRXpELDJFQUFzRTtBQUV0RSxJQUFJLGVBQWUsR0FBdUIsRUFBRSxDQUFDO0FBRTdDO0lBQStCLG9DQUFZO0lBQTNDO1FBQUEscUVBMkJDO1FBeEJDLGVBQVMsR0FBRyxJQUFJLEdBQUcsRUFBOEIsQ0FBQzs7SUF3QnBELENBQUM7SUF0QkMsMkNBQWdCLEdBQWhCLFVBQWlCLElBQVksRUFBRSxFQUFzQixJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFeEYsOENBQW1CLEdBQW5CLFVBQW9CLElBQVksRUFBRSxFQUFZLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRWhGLHdDQUFhLEdBQWIsVUFBYyxJQUFZLEVBQUUsUUFBa0I7UUFBbEIseUJBQUEsRUFBQSxhQUFrQjtRQUM1QyxJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwQyxJQUFJLEVBQUUsRUFBRTtZQUNOLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNkO0lBQ0gsQ0FBQztJQUVELGdDQUFLLEdBQUwsVUFBTSxHQUFXO1FBQ2YsSUFBTSxNQUFNLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO1FB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