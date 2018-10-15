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
{
    testing_internal_1.describe('BaseRequestOptions', function () {
        testing_internal_1.it('should create a new object when calling merge', function () {
            var options1 = new base_request_options_1.BaseRequestOptions();
            var options2 = options1.merge(new base_request_options_1.RequestOptions({ method: enums_1.RequestMethod.Delete }));
            testing_internal_1.expect(options2).not.toBe(options1);
            testing_internal_1.expect(options2.method).toBe(enums_1.RequestMethod.Delete);
        });
        testing_internal_1.it('should retain previously merged values when merging again', function () {
            var options1 = new base_request_options_1.BaseRequestOptions();
            var options2 = options1.merge(new base_request_options_1.RequestOptions({ method: enums_1.RequestMethod.Delete }));
            testing_internal_1.expect(options2.method).toBe(enums_1.RequestMethod.Delete);
        });
        testing_internal_1.it('should accept search params as object', function () {
            var params = { a: 1, b: 'text', c: [1, 2, '3'] };
            var options = new base_request_options_1.RequestOptions({ params: params });
            testing_internal_1.expect(options.params.paramsMap.size).toBe(3);
            testing_internal_1.expect(options.params.paramsMap.get('a')).toEqual(['1']);
            testing_internal_1.expect(options.params.paramsMap.get('b')).toEqual(['text']);
            testing_internal_1.expect(options.params.paramsMap.get('c')).toEqual(['1', '2', '3']);
        });
        testing_internal_1.it('should merge search params as object', function () {
            var options1 = new base_request_options_1.BaseRequestOptions();
            var params = { a: 1, b: 'text', c: [1, 2, '3'] };
            var options2 = options1.merge(new base_request_options_1.RequestOptions({ params: params }));
            testing_internal_1.expect(options2.params.paramsMap.size).toBe(3);
            testing_internal_1.expect(options2.params.paramsMap.get('a')).toEqual(['1']);
            testing_internal_1.expect(options2.params.paramsMap.get('b')).toEqual(['text']);
            testing_internal_1.expect(options2.params.paramsMap.get('c')).toEqual(['1', '2', '3']);
        });
        testing_internal_1.it('should create a new headers object when calling merge', function () {
            var options1 = new base_request_options_1.RequestOptions({ headers: new headers_1.Headers() });
            var options2 = options1.merge();
            testing_internal_1.expect(options2.headers).not.toBe(options1.headers);
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZV9yZXF1ZXN0X29wdGlvbnNfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2h0dHAvdGVzdC9iYXNlX3JlcXVlc3Rfb3B0aW9uc19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsK0VBQWdGO0FBQ2hGLCtFQUEwRjtBQUMxRixpREFBc0Q7QUFDdEQscURBQWtEO0FBRWxEO0lBQ0UsMkJBQVEsQ0FBQyxvQkFBb0IsRUFBRTtRQUM3QixxQkFBRSxDQUFDLCtDQUErQyxFQUFFO1lBQ2xELElBQU0sUUFBUSxHQUFHLElBQUkseUNBQWtCLEVBQUUsQ0FBQztZQUMxQyxJQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUkscUNBQWMsQ0FBQyxFQUFDLE1BQU0sRUFBRSxxQkFBYSxDQUFDLE1BQU0sRUFBQyxDQUFDLENBQUMsQ0FBQztZQUNwRix5QkFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDcEMseUJBQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLHFCQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUM7UUFFSCxxQkFBRSxDQUFDLDJEQUEyRCxFQUFFO1lBQzlELElBQU0sUUFBUSxHQUFHLElBQUkseUNBQWtCLEVBQUUsQ0FBQztZQUMxQyxJQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUkscUNBQWMsQ0FBQyxFQUFDLE1BQU0sRUFBRSxxQkFBYSxDQUFDLE1BQU0sRUFBQyxDQUFDLENBQUMsQ0FBQztZQUNwRix5QkFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMscUJBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNyRCxDQUFDLENBQUMsQ0FBQztRQUVILHFC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