"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var base_request_options_1 = require("@angular/http/src/base_request_options");
var base_response_options_1 = require("@angular/http/src/base_response_options");
var static_request_1 = require("@angular/http/src/static_request");
var static_response_1 = require("@angular/http/src/static_response");
var mock_backend_1 = require("@angular/http/testing/src/mock_backend");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
{
    testing_internal_1.describe('MockBackend', function () {
        var backend;
        var sampleRequest1;
        var sampleResponse1;
        var sampleRequest2;
        var sampleResponse2;
        testing_internal_1.beforeEach(function () {
            var injector = core_1.Injector.create([
                { provide: base_response_options_1.ResponseOptions, useClass: base_response_options_1.BaseResponseOptions, deps: [] },
                { provide: mock_backend_1.MockBackend, deps: [] }
            ]);
            backend = injector.get(mock_backend_1.MockBackend);
            var base = new base_request_options_1.BaseRequestOptions();
            sampleRequest1 =
                new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ url: 'https://google.com' })));
            sampleResponse1 = new static_response_1.Response(new base_response_options_1.ResponseOptions({ body: 'response1' }));
            sampleRequest2 =
                new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ url: 'https://google.com' })));
            sampleResponse2 = new static_response_1.Response(new base_response_options_1.ResponseOptions({ body: 'response2' }));
        });
        testing_internal_1.it('should create a new MockBackend', function () { matchers_1.expect(backend).toBeAnInstanceOf(mock_backend_1.MockBackend); });
        testing_internal_1.it('should create a new MockConnection', function () {
            matchers_1.expect(backend.createConnection(sampleRequest1)).toBeAnInstanceOf(mock_backend_1.MockConnection);
        });
        testing_internal_1.it('should create a new connection and allow subscription', function () {
            var connection = backend.createConnection(sampleRequest1);
            connection.response.subscribe(function () { });
        });
        testing_internal_1.it('should allow responding after subscription', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var connection = backend.createConnection(sampleRequest1);
            connection.response.subscribe(function () { async.done(); });
            connection.mockRespond(sampleResponse1);
        }));
        testing_internal_1.it('should allow subscribing after responding', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var connection = backend.createConnection(sampleRequest1);
            connection.mockRespond(sampleResponse1);
            connection.response.subscribe(function () { async.done(); });
        }));
        testing_internal_1.it('should allow responding after subscription with an error', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var connection = backend.createConnection(sampleRequest1);
            connection.response.subscribe(null, function () { async.done(); });
            connection.mockError(new Error('nope'));
        }));
        testing_internal_1.it('should not throw when there are no unresolved requests', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var connection = backend.createConnection(sampleRequest1);
            connection.response.subscribe(function () { async.done(); });
            connection.mockRespond(sampleResponse1);
            backend.verifyNoPendingRequests();
        }));
        testing_internal_1.xit('should throw when there are unresolved requests', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var connection = backend.createConnection(sampleRequest1);
            connection.response.subscribe(function () { async.done(); });
            backend.verifyNoPendingRequests();
        }));
        testing_internal_1.it('should work when requests are resolved out of order', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var connection1 = backend.createConnection(sampleRequest1);
            var connection2 = backend.createConnection(sampleRequest1);
            connection1.response.subscribe(function () { async.done(); });
            connection2.response.subscribe(function () { });
            connection2.mockRespond(sampleResponse1);
            connection1.mockRespond(sampleResponse1);
            backend.verifyNoPendingRequests();
        }));
        testing_internal_1.xit('should allow double subscribing', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var responses = [sampleResponse1, sampleResponse2];
            backend.connections.subscribe(function (c) { return c.mockRespond(responses.shift()); });
            var responseObservable = backend.createConnection(sampleRequest1).response;
            responseObservable.subscribe(function (res) { return matchers_1.expect(res.text()).toBe('response1'); });
            responseObservable.subscribe(function (res) { return matchers_1.expect(res.text()).toBe('response2'); }, null, async.done);
        }));
        // TODO(robwormald): readyStates are leaving?
        testing_internal_1.it('should allow resolution of requests manually', function () {
            var connection1 = backend.createConnection(sampleRequest1);
            var connection2 = backend.createConnection(sampleRequest1);
            connection1.response.subscribe(function () { });
            connection2.response.subscribe(function () { });
            backend.resolveAllConnections();
            backend.verifyNoPendingRequests();
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9ja19iYWNrZW5kX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9odHRwL3Rlc3QvYmFja2VuZHMvbW9ja19iYWNrZW5kX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxzQ0FBdUM7QUFDdkMsK0VBQXFIO0FBQ3JILCtFQUEwRjtBQUMxRixpRkFBNkY7QUFDN0YsbUVBQXlEO0FBQ3pELHFFQUEyRDtBQUMzRCx1RUFBbUY7QUFDbkYsMkVBQXNFO0FBR3RFO0lBQ0UsMkJBQVEsQ0FBQyxhQUFhLEVBQUU7UUFFdEIsSUFBSSxPQUFvQixDQUFDO1FBQ3pCLElBQUksY0FBdUIsQ0FBQztRQUM1QixJQUFJLGVBQXlCLENBQUM7UUFDOUIsSUFBSSxjQUF1QixDQUFDO1FBQzVCLElBQUksZUFBeUIsQ0FBQztRQUU5Qiw2QkFBVSxDQUFDO1lBQ1QsSUFBTSxRQUFRLEdBQUcsZUFBUSxDQUFDLE1BQU0sQ0FBQztnQkFDL0IsRUFBQyxPQUFPLEVBQUUsdUNBQWUsRUFBRSxRQUFRLEVBQUUsMkNBQW1CLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBQztnQkFDbkUsRUFBQyxPQUFPLEVBQUUsMEJBQVcsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFDO2FBQ2pDLENBQUMsQ0FBQztZQUNILE9BQU8sR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLDBCQUFXLENBQUMsQ0FBQztZQUNwQyxJQUFNLElBQUksR0FBRyxJQUFJLHlDQUFrQixFQUFFLENBQUM7WUFDdEMsY0FBYztnQkFDVixJQUFJLHdCQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLHFDQUFjLENBQUMsRUFBQyxHQUFHLEVBQUUsb0JBQW9CLEVBQUMsQ0FBQyxDQUFRLENBQUMsQ0FBQztZQUNwRixlQUFlLEdBQUcsSUFBSSwwQkFBUSxDQUFDLElBQUksdUNBQWUsQ0FBQyxFQUFDLElBQUksRUFBRSxX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