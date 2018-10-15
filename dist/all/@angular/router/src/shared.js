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
 * Name of the primary outlet.
 *
 *
 */
exports.PRIMARY_OUTLET = 'primary';
var ParamsAsMap = /** @class */ (function () {
    function ParamsAsMap(params) {
        this.params = params || {};
    }
    ParamsAsMap.prototype.has = function (name) { return this.params.hasOwnProperty(name); };
    ParamsAsMap.prototype.get = function (name) {
        if (this.has(name)) {
            var v = this.params[name];
            return Array.isArray(v) ? v[0] : v;
        }
        return null;
    };
    ParamsAsMap.prototype.getAll = function (name) {
        if (this.has(name)) {
            var v = this.params[name];
            return Array.isArray(v) ? v : [v];
        }
        return [];
    };
    Object.defineProperty(ParamsAsMap.prototype, "keys", {
        get: function () { return Object.keys(this.params); },
        enumerable: true,
        configurable: true
    });
    return ParamsAsMap;
}());
/**
 * Convert a `Params` instance to a `ParamMap`.
 *
 *
 */
function convertToParamMap(params) {
    return new ParamsAsMap(params);
}
exports.convertToParamMap = convertToParamMap;
var NAVIGATION_CANCELING_ERROR = 'ngNavigationCancelingError';
function navigationCancelingError(message) {
    var error = Error('NavigationCancelingError: ' + message);
    error[NAVIGATION_CANCELING_ERROR] = true;
    return error;
}
exports.navigationCancelingError = navigationCancelingError;
function isNavigationCancelingError(error) {
    return error && error[NAVIGATION_CANCELING_ERROR];
}
exports.isNavigationCancelingError = isNavigationCancelingError;
// Matches the route configuration (`route`) against the actual URL (`segments`).
function defaultUrlMatcher(segments, segmentGroup, route) {
    var parts = route.path.split('/');
    if (parts.length > segments.length) {
        // The actual URL is shorter than the config, no match
        return null;
    }
    if (route.pathMatch === 'full' &&
        (segmentGroup.hasChildren() || parts.length < segments.length)) {
        // The config is longer than the actual URL but we are looking for a full match, return null
        return null;
    }
    var posParams = {};
    // Check each config part against the actual URL
    for (var index = 0; index < parts.length; index++) {
        var part = parts[index];
        var segment = segments[index];
        var isParameter = part.startsWith(':');
        if (isParameter) {
            posParams[part.substring(1)] = segment;
        }
        else if (part !== segment.path) {
            // The actual URL part does not match the config, no match
            return null;
        }
    }
    return { consumed: segments.slice(0, parts.length), posParams: posParams };
}
exports.defaultUrlMatcher = defaultUrlMatcher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcm91dGVyL3NyYy9zaGFyZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFNSDs7Ozs7O0dBTUc7QUFDVSxRQUFBLGNBQWMsR0FBRyxTQUFTLENBQUM7QUEyQ3hDO0lBR0UscUJBQVksTUFBYztRQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxJQUFJLEVBQUUsQ0FBQztJQUFDLENBQUM7SUFFM0QseUJBQUcsR0FBSCxVQUFJLElBQVksSUFBYSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV2RSx5QkFBRyxHQUFILFVBQUksSUFBWTtRQUNkLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNsQixJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzVCLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDcEM7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCw0QkFBTSxHQUFOLFVBQU8sSUFBWTtRQUNqQixJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDbEIsSUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM1QixPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNuQztRQUVELE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVELHNCQUFJLDZCQUFJO2FBQVIsY0FBdUIsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQzNELGtCQUFDO0FBQUQsQ0FBQyxBQTFCRCxJQTBCQztBQUVEOzs7O0dBSUc7QUFDSCwyQkFBa0MsTUFBYztJQUM5QyxPQUFPLElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2pDLENBQUM7QUFGRCw4Q0FFQztBQUVELElBQU0sMEJBQTBCLEdBQUcsNEJBQTRCLENBQUM7QUFFaEUsa0NBQXlDLE9BQWU7SUFDdEQsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLDRCQUE0QixHQUFHLE9BQU8sQ0FBQyxDQUFDO0lBQzNELEtBQWEsQ0FBQywwQkFBMEIsQ0FBQyxHQUFHLElBQUksQ0FBQztJQUNsRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUFKRCw0REFJQztBQUVELG9DQUEyQyxLQUFZO0lBQ3JELE9BQU8sS0FBSyxJQUFLLEtBQWEsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0FBQzdELENBQUM7QUFGRCxnRUFFQztBQUVELGlGQUFpRjtBQUNqRiwyQkFDSSxRQUFzQixFQUFFLFlBQTZCLEVBQUUsS0FBWTtJQUNyRSxJQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUV0QyxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRTtRQUNsQyxzREFBc0Q7UUFDdEQsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUVELElBQUksS0FBSyxDQUFDLFNBQVMsS0FBSyxNQUFNO1FBQzFCLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQ2xFLDRGQUE0RjtRQUM1RixPQUFPLElBQUksQ0FBQztLQUNiO0lBRUQsSUFBTSxTQUFTLEdBQWdDLEVBQUUsQ0FBQztJQUVsRCxnREFBZ0Q7SUFDaEQsS0FBSyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDakQsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFCLElBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoQyxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3pDLElBQUksV0FBVyxFQUFFO1lBQ2YsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUM7U0FDeEM7YUFBTSxJQUFJLElBQUksS0FBSyxPQUFPLENBQUMsSUFBSSxFQUFFO1lBQ2hDLDBEQUEwRDtZQUMxRCxPQUFPLElBQUksQ0FBQztTQUNiO0tBQ0Y7SUFFRCxPQUFPLEVBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxTQUFTLFdBQUEsRUFBQyxDQUFDO0FBQ2hFLENBQUM7QUEvQkQsOENBK0JDIn0=