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
var CAMEL_CASE_REGEXP = /([A-Z])/g;
var DASH_CASE_REGEXP = /-([a-z])/g;
function camelCaseToDashCase(input) {
    return input.replace(CAMEL_CASE_REGEXP, function () {
        var m = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            m[_i] = arguments[_i];
        }
        return '-' + m[1].toLowerCase();
    });
}
exports.camelCaseToDashCase = camelCaseToDashCase;
function dashCaseToCamelCase(input) {
    return input.replace(DASH_CASE_REGEXP, function () {
        var m = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            m[_i] = arguments[_i];
        }
        return m[1].toUpperCase();
    });
}
exports.dashCaseToCamelCase = dashCaseToCamelCase;
/**
 * Exports the value under a given `name` in the global property `ng`. For example `ng.probe` if
 * `name` is `'probe'`.
 * @param name Name under which it will be exported. Keep in mind this will be a property of the
 * global `ng` object.
 * @param value The value to export.
 */
function exportNgVar(name, value) {
    if (typeof COMPILED === 'undefined' || !COMPILED) {
        // Note: we can't export `ng` when using closure enhanced optimization as:
        // - closure declares globals itself for minified names, which sometimes clobber our `ng` global
        // - we can't declare a closure extern as the namespace `ng` is already used within Google
        //   for typings for angularJS (via `goog.provide('ng....')`).
        var ng_1 = core_1.ɵglobal['ng'] = core_1.ɵglobal['ng'] || {};
        ng_1[name] = value;
    }
}
exports.exportNgVar = exportNgVar;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLWJyb3dzZXIvc3JjL2RvbS91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0NBQWdEO0FBRWhELElBQU0saUJBQWlCLEdBQUcsVUFBVSxDQUFDO0FBQ3JDLElBQU0sZ0JBQWdCLEdBQUcsV0FBVyxDQUFDO0FBR3JDLDZCQUFvQyxLQUFhO0lBQy9DLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRTtRQUFDLFdBQWM7YUFBZCxVQUFjLEVBQWQscUJBQWMsRUFBZCxJQUFjO1lBQWQsc0JBQWM7O1FBQUssT0FBQSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRTtJQUF4QixDQUF3QixDQUFDLENBQUM7QUFDeEYsQ0FBQztBQUZELGtEQUVDO0FBRUQsNkJBQW9DLEtBQWE7SUFDL0MsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFO1FBQUMsV0FBYzthQUFkLFVBQWMsRUFBZCxxQkFBYyxFQUFkLElBQWM7WUFBZCxzQkFBYzs7UUFBSyxPQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUU7SUFBbEIsQ0FBa0IsQ0FBQyxDQUFDO0FBQ2pGLENBQUM7QUFGRCxrREFFQztBQUVEOzs7Ozs7R0FNRztBQUNILHFCQUE0QixJQUFZLEVBQUUsS0FBVTtJQUNsRCxJQUFJLE9BQU8sUUFBUSxLQUFLLFdBQVcsSUFBSSxDQUFDLFFBQVEsRUFBRTtRQUNoRCwwRUFBMEU7UUFDMUUsZ0dBQWdHO1FBQ2hHLDBGQUEwRjtRQUMxRiw4REFBOEQ7UUFDOUQsSUFBTSxJQUFFLEdBQUcsY0FBTSxDQUFDLElBQUksQ0FBQyxHQUFJLGNBQU0sQ0FBQyxJQUFJLENBQXFDLElBQUksRUFBRSxDQUFDO1FBQ2xGLElBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUM7S0FDbEI7QUFDSCxDQUFDO0FBVEQsa0NBU0MifQ==