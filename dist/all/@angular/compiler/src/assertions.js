"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
function assertArrayOfStrings(identifier, value) {
    if (value == null) {
        return;
    }
    if (!Array.isArray(value)) {
        throw new Error("Expected '" + identifier + "' to be an array of strings.");
    }
    for (var i = 0; i < value.length; i += 1) {
        if (typeof value[i] !== 'string') {
            throw new Error("Expected '" + identifier + "' to be an array of strings.");
        }
    }
}
exports.assertArrayOfStrings = assertArrayOfStrings;
var INTERPOLATION_BLACKLIST_REGEXPS = [
    /^\s*$/,
    /[<>]/,
    /^[{}]$/,
    /&(#|[a-z])/i,
    /^\/\//,
];
function assertInterpolationSymbols(identifier, value) {
    if (value != null && !(Array.isArray(value) && value.length == 2)) {
        throw new Error("Expected '" + identifier + "' to be an array, [start, end].");
    }
    else if (value != null) {
        var start_1 = value[0];
        var end_1 = value[1];
        // black list checking
        INTERPOLATION_BLACKLIST_REGEXPS.forEach(function (regexp) {
            if (regexp.test(start_1) || regexp.test(end_1)) {
                throw new Error("['" + start_1 + "', '" + end_1 + "'] contains unusable interpolation symbol.");
            }
        });
    }
}
exports.assertInterpolationSymbols = assertInterpolationSymbols;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXJ0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9hc3NlcnRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsOEJBQXFDLFVBQWtCLEVBQUUsS0FBVTtJQUNqRSxJQUFJLEtBQUssSUFBSSxJQUFJLEVBQUU7UUFDakIsT0FBTztLQUNSO0lBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDekIsTUFBTSxJQUFJLEtBQUssQ0FBQyxlQUFhLFVBQVUsaUNBQThCLENBQUMsQ0FBQztLQUN4RTtJQUNELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDeEMsSUFBSSxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLEVBQUU7WUFDaEMsTUFBTSxJQUFJLEtBQUssQ0FBQyxlQUFhLFVBQVUsaUNBQThCLENBQUMsQ0FBQztTQUN4RTtLQUNGO0FBQ0gsQ0FBQztBQVpELG9EQVlDO0FBRUQsSUFBTSwrQkFBK0IsR0FBRztJQUN0QyxPQUFPO0lBQ1AsTUFBTTtJQUNOLFFBQVE7SUFDUixhQUFhO0lBQ2IsT0FBTztDQUNSLENBQUM7QUFFRixvQ0FBMkMsVUFBa0IsRUFBRSxLQUFVO0lBQ3ZFLElBQUksS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxFQUFFO1FBQ2pFLE1BQU0sSUFBSSxLQUFLLENBQUMsZUFBYSxVQUFVLG9DQUFpQyxDQUFDLENBQUM7S0FDM0U7U0FBTSxJQUFJLEtBQUssSUFBSSxJQUFJLEVBQUU7UUFDeEIsSUFBTSxPQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBVyxDQUFDO1FBQ2pDLElBQU0sS0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQVcsQ0FBQztRQUMvQixzQkFBc0I7UUFDdEIsK0JBQStCLENBQUMsT0FBTyxDQUFDLFVBQUEsTUFBTTtZQUM1QyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFHLENBQUMsRUFBRTtnQkFDMUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFLLE9BQUssWUFBTyxLQUFHLCtDQUE0QyxDQUFDLENBQUM7YUFDbkY7UUFDSCxDQUFDLENBQUMsQ0FBQztLQUNKO0FBQ0gsQ0FBQztBQWJELGdFQWFDIn0=