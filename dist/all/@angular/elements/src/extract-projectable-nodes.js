"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
// NOTE: This is a (slightly improved) version of what is used in ngUpgrade's
//       `DowngradeComponentAdapter`.
// TODO(gkalpak): Investigate if it makes sense to share the code.
var utils_1 = require("./utils");
function extractProjectableNodes(host, ngContentSelectors) {
    var nodes = host.childNodes;
    var projectableNodes = ngContentSelectors.map(function () { return []; });
    var wildcardIndex = -1;
    ngContentSelectors.some(function (selector, i) {
        if (selector === '*') {
            wildcardIndex = i;
            return true;
        }
        return false;
    });
    for (var i = 0, ii = nodes.length; i < ii; ++i) {
        var node = nodes[i];
        var ngContentIndex = findMatchingIndex(node, ngContentSelectors, wildcardIndex);
        if (ngContentIndex !== -1) {
            projectableNodes[ngContentIndex].push(node);
        }
    }
    return projectableNodes;
}
exports.extractProjectableNodes = extractProjectableNodes;
function findMatchingIndex(node, selectors, defaultIndex) {
    var matchingIndex = defaultIndex;
    if (utils_1.isElement(node)) {
        selectors.some(function (selector, i) {
            if ((selector !== '*') && utils_1.matchesSelector(node, selector)) {
                matchingIndex = i;
                return true;
            }
            return false;
        });
    }
    return matchingIndex;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0cmFjdC1wcm9qZWN0YWJsZS1ub2Rlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2VsZW1lbnRzL3NyYy9leHRyYWN0LXByb2plY3RhYmxlLW5vZGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsNkVBQTZFO0FBQzdFLHFDQUFxQztBQUNyQyxrRUFBa0U7QUFFbEUsaUNBQW1EO0FBRW5ELGlDQUF3QyxJQUFpQixFQUFFLGtCQUE0QjtJQUNyRixJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQzlCLElBQU0sZ0JBQWdCLEdBQWEsa0JBQWtCLENBQUMsR0FBRyxDQUFDLGNBQU0sT0FBQSxFQUFFLEVBQUYsQ0FBRSxDQUFDLENBQUM7SUFDcEUsSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFFdkIsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFVBQUMsUUFBUSxFQUFFLENBQUM7UUFDbEMsSUFBSSxRQUFRLEtBQUssR0FBRyxFQUFFO1lBQ3BCLGFBQWEsR0FBRyxDQUFDLENBQUM7WUFDbEIsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQyxDQUFDLENBQUM7SUFFSCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1FBQzlDLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLGNBQWMsR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFFbEYsSUFBSSxjQUFjLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDekIsZ0JBQWdCLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzdDO0tBQ0Y7SUFFRCxPQUFPLGdCQUFnQixDQUFDO0FBQzFCLENBQUM7QUF2QkQsMERBdUJDO0FBRUQsMkJBQTJCLElBQVUsRUFBRSxTQUFtQixFQUFFLFlBQW9CO0lBQzlFLElBQUksYUFBYSxHQUFHLFlBQVksQ0FBQztJQUVqQyxJQUFJLGlCQUFTLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDbkIsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxRQUFRLEtBQUssR0FBRyxDQUFDLElBQUksdUJBQWUsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLEVBQUU7Z0JBQ3pELGFBQWEsR0FBRyxDQUFDLENBQUM7Z0JBQ2xCLE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFDRCxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUMsQ0FBQyxDQUFDO0tBQ0o7SUFFRCxPQUFPLGFBQWEsQ0FBQztBQUN2QixDQUFDIn0=