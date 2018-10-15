"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @description
 *
 * Provides a way to customize when activated routes get reused.
 *
 * @experimental
 */
var RouteReuseStrategy = /** @class */ (function () {
    function RouteReuseStrategy() {
    }
    return RouteReuseStrategy;
}());
exports.RouteReuseStrategy = RouteReuseStrategy;
/**
 * Does not detach any subtrees. Reuses routes as long as their route config is the same.
 */
var DefaultRouteReuseStrategy = /** @class */ (function () {
    function DefaultRouteReuseStrategy() {
    }
    DefaultRouteReuseStrategy.prototype.shouldDetach = function (route) { return false; };
    DefaultRouteReuseStrategy.prototype.store = function (route, detachedTree) { };
    DefaultRouteReuseStrategy.prototype.shouldAttach = function (route) { return false; };
    DefaultRouteReuseStrategy.prototype.retrieve = function (route) { return null; };
    DefaultRouteReuseStrategy.prototype.shouldReuseRoute = function (future, curr) {
        return future.routeConfig === curr.routeConfig;
    };
    return DefaultRouteReuseStrategy;
}());
exports.DefaultRouteReuseStrategy = DefaultRouteReuseStrategy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVfcmV1c2Vfc3RyYXRlZ3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9yb3V0ZXIvc3JjL3JvdXRlX3JldXNlX3N0cmF0ZWd5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBMkJIOzs7Ozs7R0FNRztBQUNIO0lBQUE7SUFtQkEsQ0FBQztJQUFELHlCQUFDO0FBQUQsQ0FBQyxBQW5CRCxJQW1CQztBQW5CcUIsZ0RBQWtCO0FBcUJ4Qzs7R0FFRztBQUNIO0lBQUE7SUFRQSxDQUFDO0lBUEMsZ0RBQVksR0FBWixVQUFhLEtBQTZCLElBQWEsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3RFLHlDQUFLLEdBQUwsVUFBTSxLQUE2QixFQUFFLFlBQWlDLElBQVMsQ0FBQztJQUNoRixnREFBWSxHQUFaLFVBQWEsS0FBNkIsSUFBYSxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDdEUsNENBQVEsR0FBUixVQUFTLEtBQTZCLElBQThCLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNsRixvREFBZ0IsR0FBaEIsVUFBaUIsTUFBOEIsRUFBRSxJQUE0QjtRQUMzRSxPQUFPLE1BQU0sQ0FBQyxXQUFXLEtBQUssSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUNqRCxDQUFDO0lBQ0gsZ0NBQUM7QUFBRCxDQUFDLEFBUkQsSUFRQztBQVJZLDhEQUF5QiJ9