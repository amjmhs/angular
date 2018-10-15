"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var resource_loader_mock_1 = require("@angular/compiler/testing/src/resource_loader_mock");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
{
    testing_internal_1.describe('MockResourceLoader', function () {
        var resourceLoader;
        testing_internal_1.beforeEach(function () { resourceLoader = new resource_loader_mock_1.MockResourceLoader(); });
        function expectResponse(request, url, response, done) {
            if (done === void 0) { done = null; }
            function onResponse(text) {
                if (response === null) {
                    throw "Unexpected response " + url + " -> " + text;
                }
                else {
                    testing_internal_1.expect(text).toEqual(response);
                    if (done != null)
                        done();
                }
                return text;
            }
            function onError(error) {
                if (response !== null) {
                    throw "Unexpected error " + url;
                }
                else {
                    testing_internal_1.expect(error).toEqual("Failed to load " + url);
                    if (done != null)
                        done();
                }
                return error;
            }
            request.then(onResponse, onError);
        }
        testing_internal_1.it('should return a response from the definitions', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var url = '/foo';
            var response = 'bar';
            resourceLoader.when(url, response);
            expectResponse(resourceLoader.get(url), url, response, function () { return async.done(); });
            resourceLoader.flush();
        }));
        testing_internal_1.it('should return an error from the definitions', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var url = '/foo';
            var response = null;
            resourceLoader.when(url, response);
            expectResponse(resourceLoader.get(url), url, response, function () { return async.done(); });
            resourceLoader.flush();
        }));
        testing_internal_1.it('should return a response from the expectations', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var url = '/foo';
            var response = 'bar';
            resourceLoader.expect(url, response);
            expectResponse(resourceLoader.get(url), url, response, function () { return async.done(); });
            resourceLoader.flush();
        }));
        testing_internal_1.it('should return an error from the expectations', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var url = '/foo';
            var response = null;
            resourceLoader.expect(url, response);
            expectResponse(resourceLoader.get(url), url, response, function () { return async.done(); });
            resourceLoader.flush();
        }));
        testing_internal_1.it('should not reuse expectations', function () {
            var url = '/foo';
            var response = 'bar';
            resourceLoader.expect(url, response);
            resourceLoader.get(url);
            resourceLoader.get(url);
            testing_internal_1.expect(function () { resourceLoader.flush(); }).toThrowError('Unexpected request /foo');
        });
        testing_internal_1.it('should return expectations before definitions', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var url = '/foo';
            resourceLoader.when(url, 'when');
            resourceLoader.expect(url, 'expect');
            expectResponse(resourceLoader.get(url), url, 'expect');
            expectResponse(resourceLoader.get(url), url, 'when', function () { return async.done(); });
            resourceLoader.flush();
        }));
        testing_internal_1.it('should throw when there is no definitions or expectations', function () {
            resourceLoader.get('/foo');
            testing_internal_1.expect(function () { resourceLoader.flush(); }).toThrowError('Unexpected request /foo');
        });
        testing_internal_1.it('should throw when flush is called without any pending requests', function () {
            testing_internal_1.expect(function () { resourceLoader.flush(); }).toThrowError('No pending requests to flush');
        });
        testing_internal_1.it('should throw on unsatisfied expectations', function () {
            resourceLoader.expect('/foo', 'bar');
            resourceLoader.when('/bar', 'foo');
            resourceLoader.get('/bar');
            testing_internal_1.expect(function () { resourceLoader.flush(); }).toThrowError('Unsatisfied requests: /foo');
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2VfbG9hZGVyX21vY2tfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3Rlc3QvcmVzb3VyY2VfbG9hZGVyX21vY2tfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILDJGQUFzRjtBQUN0RiwrRUFBd0g7QUFFeEg7SUFDRSwyQkFBUSxDQUFDLG9CQUFvQixFQUFFO1FBQzdCLElBQUksY0FBa0MsQ0FBQztRQUV2Qyw2QkFBVSxDQUFDLGNBQVEsY0FBYyxHQUFHLElBQUkseUNBQWtCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWpFLHdCQUNJLE9BQXdCLEVBQUUsR0FBVyxFQUFFLFFBQWdCLEVBQUUsSUFBeUI7WUFBekIscUJBQUEsRUFBQSxPQUFtQixJQUFNO1lBQ3BGLG9CQUFvQixJQUFZO2dCQUM5QixJQUFJLFFBQVEsS0FBSyxJQUFJLEVBQUU7b0JBQ3JCLE1BQU0seUJBQXVCLEdBQUcsWUFBTyxJQUFNLENBQUM7aUJBQy9DO3FCQUFNO29CQUNMLHlCQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUMvQixJQUFJLElBQUksSUFBSSxJQUFJO3dCQUFFLElBQUksRUFBRSxDQUFDO2lCQUMxQjtnQkFDRCxPQUFPLElBQUksQ0FBQztZQUNkLENBQUM7WUFFRCxpQkFBaUIsS0FBYTtnQkFDNUIsSUFBSSxRQUFRLEtBQUssSUFBSSxFQUFFO29CQUNyQixNQUFNLHNCQUFvQixHQUFLLENBQUM7aUJBQ2pDO3FCQUFNO29CQUNMLHlCQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLG9CQUFrQixHQUFLLENBQUMsQ0FBQztvQkFDL0MsSUFBSSxJQUFJLElBQUksSUFBSTt3QkFBRSxJQUFJLEVBQUUsQ0FBQztpQkFDMUI7Z0JBQ0QsT0FBTyxLQUFLLENBQUM7WUFD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