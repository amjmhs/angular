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
var resource_loader_impl_1 = require("../../src/resource_loader/resource_loader_impl");
{
    testing_internal_1.describe('ResourceLoaderImpl', function () {
        var resourceLoader;
        // TODO(juliemr): This file currently won't work with dart unit tests run using
        // exclusive it or describe (iit or ddescribe). This is because when
        // pub run test is executed against this specific file the relative paths
        // will be relative to here, so url200 should look like
        // static_assets/200.html.
        // We currently have no way of detecting this.
        var url200 = '/base/angular/packages/platform-browser/test/browser/static_assets/200.html';
        var url404 = '/bad/path/404.html';
        testing_internal_1.beforeEach(function () { resourceLoader = new resource_loader_impl_1.ResourceLoaderImpl(); });
        testing_internal_1.it('should resolve the Promise with the file content on success', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            resourceLoader.get(url200).then(function (text) {
                testing_internal_1.expect(text.trim()).toEqual('<p>hey</p>');
                async.done();
            });
        }), 10000);
        testing_internal_1.it('should reject the Promise on failure', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            resourceLoader.get(url404).catch(function (e) {
                testing_internal_1.expect(e).toEqual("Failed to load " + url404);
                async.done();
                return null;
            });
        }), 10000);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2VfbG9hZGVyX2ltcGxfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLWJyb3dzZXItZHluYW1pYy90ZXN0L3Jlc291cmNlX2xvYWRlci9yZXNvdXJjZV9sb2FkZXJfaW1wbF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsK0VBQXdIO0FBQ3hILHVGQUFrRjtBQUVsRjtJQUNFLDJCQUFRLENBQUMsb0JBQW9CLEVBQUU7UUFDN0IsSUFBSSxjQUFrQyxDQUFDO1FBRXZDLCtFQUErRTtRQUMvRSxvRUFBb0U7UUFDcEUseUVBQXlFO1FBQ3pFLHVEQUF1RDtRQUN2RCwwQkFBMEI7UUFDMUIsOENBQThDO1FBQzlDLElBQU0sTUFBTSxHQUFHLDZFQUE2RSxDQUFDO1FBQzdGLElBQU0sTUFBTSxHQUFHLG9CQUFvQixDQUFDO1FBRXBDLDZCQUFVLENBQUMsY0FBUSxjQUFjLEdBQUcsSUFBSSx5Q0FBa0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFakUscUJBQUUsQ0FBQyw2REFBNkQsRUFDN0QseUJBQU0sQ0FBQyxDQUFDLHFDQUFrQixDQUFDLEVBQUUsVUFBQyxLQUF5QjtZQUNyRCxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLElBQUk7Z0JBQ25DLHlCQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUMxQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDZixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRWQscUJBQUUsQ0FBQyxzQ0FBc0MsRUFDdEMseUJBQU0sQ0FBQyxDQUFDLHFDQUFrQixDQUFDLEVBQUUsVUFBQyxLQUF5QjtZQUNyRCxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFDLENBQUM7Z0JBQ2pDLHlCQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLG9CQUFrQixNQUFRLENBQUMsQ0FBQztnQkFDOUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNiLE9BQU8sSUFBSSxDQUFDO1lBQ2QsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNoQixDQUFDLENBQUMsQ0FBQztDQUNKIn0=