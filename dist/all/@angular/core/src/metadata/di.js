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
var injection_token_1 = require("../di/injection_token");
var decorators_1 = require("../util/decorators");
/**
 * This token can be used to create a virtual provider that will populate the
 * `entryComponents` fields of components and ng modules based on its `useValue`.
 * All components that are referenced in the `useValue` value (either directly
 * or in a nested array or map) will be added to the `entryComponents` property.
 *
 * @usageNotes
 * ### Example
 * The following example shows how the router can populate the `entryComponents`
 * field of an NgModule based on the router configuration which refers
 * to components.
 *
 * ```typescript
 * // helper function inside the router
 * function provideRoutes(routes) {
 *   return [
 *     {provide: ROUTES, useValue: routes},
 *     {provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: routes, multi: true}
 *   ];
 * }
 *
 * // user code
 * let routes = [
 *   {path: '/root', component: RootComp},
 *   {path: '/teams', component: TeamsComp}
 * ];
 *
 * @NgModule({
 *   providers: [provideRoutes(routes)]
 * })
 * class ModuleWithRoutes {}
 * ```
 *
 * @experimental
 */
exports.ANALYZE_FOR_ENTRY_COMPONENTS = new injection_token_1.InjectionToken('AnalyzeForEntryComponents');
/**
 * Attribute decorator and metadata.
 *
 * @Annotation
 */
exports.Attribute = decorators_1.makeParamDecorator('Attribute', function (attributeName) { return ({ attributeName: attributeName }); });
/**
 * Base class for query metadata.
 *
 * @see `ContentChildren`.
 * @see `ContentChild`.
 * @see `ViewChildren`.
 * @see `ViewChild`.
 */
var Query = /** @class */ (function () {
    function Query() {
    }
    return Query;
}());
exports.Query = Query;
/**
 * ContentChildren decorator and metadata.
 *
 *
 *  @Annotation
 */
exports.ContentChildren = decorators_1.makePropDecorator('ContentChildren', function (selector, data) {
    if (data === void 0) { data = {}; }
    return (__assign({ selector: selector, first: false, isViewQuery: false, descendants: false }, data));
}, Query);
/**
 * ContentChild decorator and metadata.
 *
 *
 * @Annotation
 */
exports.ContentChild = decorators_1.makePropDecorator('ContentChild', function (selector, data) {
    if (data === void 0) { data = {}; }
    return (__assign({ selector: selector, first: true, isViewQuery: false, descendants: true }, data));
}, Query);
/**
 * ViewChildren decorator and metadata.
 *
 * @Annotation
 */
exports.ViewChildren = decorators_1.makePropDecorator('ViewChildren', function (selector, data) {
    if (data === void 0) { data = {}; }
    return (__assign({ selector: selector, first: false, isViewQuery: true, descendants: true }, data));
}, Query);
/**
 * ViewChild decorator and metadata.
 *
 * @Annotation
 */
exports.ViewChild = decorators_1.makePropDecorator('ViewChild', function (selector, data) {
    return (__assign({ selector: selector, first: true, isViewQuery: true, descendants: true }, data));
}, Query);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9tZXRhZGF0YS9kaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7O0FBRUgseURBQXFEO0FBRXJELGlEQUF5RTtBQUV6RTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWtDRztBQUNVLFFBQUEsNEJBQTRCLEdBQUcsSUFBSSxnQ0FBYyxDQUFNLDJCQUEyQixDQUFDLENBQUM7QUF5RGpHOzs7O0dBSUc7QUFDVSxRQUFBLFNBQVMsR0FDbEIsK0JBQWtCLENBQUMsV0FBVyxFQUFFLFVBQUMsYUFBc0IsSUFBSyxPQUFBLENBQUMsRUFBQyxhQUFhLGVBQUEsRUFBQyxDQUFDLEVBQWpCLENBQWlCLENBQUMsQ0FBQztBQWFuRjs7Ozs7OztHQU9HO0FBQ0g7SUFBQTtJQUE2QixDQUFDO0lBQUQsWUFBQztBQUFELENBQUMsQUFBOUIsSUFBOEI7QUFBUixzQkFBSztBQW1EM0I7Ozs7O0dBS0c7QUFDVSxRQUFBLGVBQWUsR0FBNkIsOEJBQWlCLENBQ3RFLGlCQUFpQixFQUNqQixVQUFDLFFBQWMsRUFBRSxJQUFjO0lBQWQscUJBQUEsRUFBQSxTQUFjO0lBQzNCLE9BQUEsWUFBRSxRQUFRLFVBQUEsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLEtBQUssSUFBSyxJQUFJLEVBQUU7QUFBM0UsQ0FBMkUsRUFDL0UsS0FBSyxDQUFDLENBQUM7QUErQ1g7Ozs7O0dBS0c7QUFDVSxRQUFBLFlBQVksR0FBMEIsOEJBQWlCLENBQ2hFLGNBQWMsRUFBRSxVQUFDLFFBQWMsRUFBRSxJQUFjO0lBQWQscUJBQUEsRUFBQSxTQUFjO0lBQzNCLE9BQUEsWUFBRSxRQUFRLFVBQUEsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLElBQUksSUFBSyxJQUFJLEVBQUU7QUFBekUsQ0FBeUUsRUFDN0YsS0FBSyxDQUFDLENBQUM7QUE2Q1g7Ozs7R0FJRztBQUNVLFFBQUEsWUFBWSxHQUEwQiw4QkFBaUIsQ0FDaEUsY0FBYyxFQUFFLFVBQUMsUUFBYyxFQUFFLElBQWM7SUFBZCxxQkFBQSxFQUFBLFNBQWM7SUFDM0IsT0FBQSxZQUFFLFFBQVEsVUFBQSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxJQUFLLElBQUksRUFBRTtBQUF6RSxDQUF5RSxFQUM3RixLQUFLLENBQUMsQ0FBQztBQXdEWDs7OztHQUlHO0FBQ1UsUUFBQSxTQUFTLEdBQXVCLDhCQUFpQixDQUMxRCxXQUFXLEVBQUUsVUFBQyxRQUFhLEVBQUUsSUFBUztJQUNyQixPQUFBLFlBQUUsUUFBUSxVQUFBLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLElBQUssSUFBSSxFQUFFO0FBQXhFLENBQXdFLEVBQ3pGLEtBQUssQ0FBQyxDQUFDIn0=