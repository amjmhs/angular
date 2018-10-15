/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { InjectionToken } from '../di/injection_token';
import { makeParamDecorator, makePropDecorator } from '../util/decorators';
/** *
 * This token can be used to create a virtual provider that will populate the
 * `entryComponents` fields of components and ng modules based on its `useValue`.
 * All components that are referenced in the `useValue` value (either directly
 * or in a nested array or map) will be added to the `entryComponents` property.
 *
 * \@usageNotes
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
 * \@NgModule({
 *   providers: [provideRoutes(routes)]
 * })
 * class ModuleWithRoutes {}
 * ```
 *
 * \@experimental
  @type {?} */
export var ANALYZE_FOR_ENTRY_COMPONENTS = new InjectionToken('AnalyzeForEntryComponents');
/**
 * Type of the Attribute decorator / constructor function.
 *
 *
 * @record
 */
export function AttributeDecorator() { }
/** *
 * Attribute decorator and metadata.
 *
 * \@Annotation
  @type {?} */
export var Attribute = makeParamDecorator('Attribute', function (attributeName) { return ({ attributeName: attributeName }); });
/**
 * Base class for query metadata.
 *
 * @see `ContentChildren`.
 * @see `ContentChild`.
 * @see `ViewChildren`.
 * @see `ViewChild`.
 * @abstract
 */
var /**
 * Base class for query metadata.
 *
 * @see `ContentChildren`.
 * @see `ContentChild`.
 * @see `ViewChildren`.
 * @see `ViewChild`.
 * @abstract
 */
Query = /** @class */ (function () {
    function Query() {
    }
    return Query;
}());
/**
 * Base class for query metadata.
 *
 * @see `ContentChildren`.
 * @see `ContentChild`.
 * @see `ViewChildren`.
 * @see `ViewChild`.
 * @abstract
 */
export { Query };
/**
 * Type of the ContentChildren decorator / constructor function.
 *
 * @see `ContentChildren`.
 * @record
 */
export function ContentChildrenDecorator() { }
/** *
 * ContentChildren decorator and metadata.
 *
 *
 * \@Annotation
  @type {?} */
export var ContentChildren = makePropDecorator('ContentChildren', function (selector, data) {
    if (data === void 0) { data = {}; }
    return (tslib_1.__assign({ selector: selector, first: false, isViewQuery: false, descendants: false }, data));
}, Query);
/**
 * Type of the ContentChild decorator / constructor function.
 *
 *
 *
 * @record
 */
export function ContentChildDecorator() { }
/** *
 * ContentChild decorator and metadata.
 *
 *
 * \@Annotation
  @type {?} */
export var ContentChild = makePropDecorator('ContentChild', function (selector, data) {
    if (data === void 0) { data = {}; }
    return (tslib_1.__assign({ selector: selector, first: true, isViewQuery: false, descendants: true }, data));
}, Query);
/**
 * Type of the ViewChildren decorator / constructor function.
 *
 * @see `ViewChildren`.
 *
 *
 * @record
 */
export function ViewChildrenDecorator() { }
/** *
 * ViewChildren decorator and metadata.
 *
 * \@Annotation
  @type {?} */
export var ViewChildren = makePropDecorator('ViewChildren', function (selector, data) {
    if (data === void 0) { data = {}; }
    return (tslib_1.__assign({ selector: selector, first: false, isViewQuery: true, descendants: true }, data));
}, Query);
/**
 * Type of the ViewChild decorator / constructor function.
 *
 * @see `ViewChild`.
 * @record
 */
export function ViewChildDecorator() { }
/** *
 * ViewChild decorator and metadata.
 *
 * \@Annotation
  @type {?} */
export var ViewChild = makePropDecorator('ViewChild', function (selector, data) {
    return (tslib_1.__assign({ selector: selector, first: true, isViewQuery: true, descendants: true }, data));
}, Query);
//# sourceMappingURL=di.js.map