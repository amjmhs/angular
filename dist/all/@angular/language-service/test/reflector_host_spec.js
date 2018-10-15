"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var ts = require("typescript");
var language_service_1 = require("../src/language_service");
var reflector_host_1 = require("../src/reflector_host");
var typescript_host_1 = require("../src/typescript_host");
var test_data_1 = require("./test_data");
var test_utils_1 = require("./test_utils");
describe('reflector_host_spec', function () {
    // Regression #21811
    it('should be able to find angular under windows', function () {
        var originalJoin = path.join;
        var mockHost = new test_utils_1.MockTypescriptHost(['/app/main.ts', '/app/parsing-cases.ts'], test_data_1.toh, 'app/node_modules', __assign({}, path, { join: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return originalJoin.apply(path, args);
            } }));
        var service = ts.createLanguageService(mockHost);
        var ngHost = new typescript_host_1.TypeScriptServiceHost(mockHost, service);
        var ngService = language_service_1.createLanguageService(ngHost);
        var reflectorHost = new reflector_host_1.ReflectorHost(function () { return undefined; }, mockHost, { basePath: '\\app' });
        spyOn(path, 'join').and.callFake(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _a;
            return (_a = path.win32).join.apply(_a, args);
        });
        var result = reflectorHost.moduleNameToFileName('@angular/core');
        expect(result).not.toBeNull('could not find @angular/core using path.win32');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmbGVjdG9yX2hvc3Rfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xhbmd1YWdlLXNlcnZpY2UvdGVzdC9yZWZsZWN0b3JfaG9zdF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7QUFFSCwyQkFBNkI7QUFDN0IsK0JBQWlDO0FBRWpDLDREQUE4RDtBQUM5RCx3REFBb0Q7QUFFcEQsMERBQTZEO0FBRTdELHlDQUFnQztBQUNoQywyQ0FBZ0Q7QUFFaEQsUUFBUSxDQUFDLHFCQUFxQixFQUFFO0lBRTlCLG9CQUFvQjtJQUNwQixFQUFFLENBQUMsOENBQThDLEVBQUU7UUFDakQsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUMvQixJQUFJLFFBQVEsR0FBRyxJQUFJLCtCQUFrQixDQUNqQyxDQUFDLGNBQWMsRUFBRSx1QkFBdUIsQ0FBQyxFQUFFLGVBQUcsRUFBRSxrQkFBa0IsZUFDOUQsSUFBSSxJQUFFLElBQUksRUFBRTtnQkFBQyxjQUFpQjtxQkFBakIsVUFBaUIsRUFBakIscUJBQWlCLEVBQWpCLElBQWlCO29CQUFqQix5QkFBaUI7O2dCQUFLLE9BQUEsWUFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO1lBQTlCLENBQThCLElBQUUsQ0FBQztRQUM1RSxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUMscUJBQXFCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDakQsSUFBSSxNQUFNLEdBQUcsSUFBSSx1Q0FBcUIsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDMUQsSUFBSSxTQUFTLEdBQUcsd0NBQXFCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDOUMsSUFBTSxhQUFhLEdBQUcsSUFBSSw4QkFBYSxDQUFDLGNBQU0sT0FBQSxTQUFnQixFQUFoQixDQUFnQixFQUFFLFFBQVEsRUFBRSxFQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO1FBRS9GLEtBQUssQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztZQUFDLGNBQWlCO2lCQUFqQixVQUFpQixFQUFqQixxQkFBaUIsRUFBakIsSUFBaUI7Z0JBQWpCLHlCQUFpQjs7O1lBQU8sT0FBTyxDQUFBLEtBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQSxDQUFDLElBQUksV0FBSSxJQUFJLEVBQUU7UUFBQyxDQUFDLENBQUMsQ0FBQztRQUM5RixJQUFNLE1BQU0sR0FBRyxhQUFhLENBQUMsb0JBQW9CLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDbkUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsK0NBQStDLENBQUMsQ0FBQztJQUMvRSxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=