"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var router_state_1 = require("./router_state");
var tree_1 = require("./utils/tree");
function createRouterState(routeReuseStrategy, curr, prevState) {
    var root = createNode(routeReuseStrategy, curr._root, prevState ? prevState._root : undefined);
    return new router_state_1.RouterState(root, curr);
}
exports.createRouterState = createRouterState;
function createNode(routeReuseStrategy, curr, prevState) {
    // reuse an activated route that is currently displayed on the screen
    if (prevState && routeReuseStrategy.shouldReuseRoute(curr.value, prevState.value.snapshot)) {
        var value = prevState.value;
        value._futureSnapshot = curr.value;
        var children = createOrReuseChildren(routeReuseStrategy, curr, prevState);
        return new tree_1.TreeNode(value, children);
        // retrieve an activated route that is used to be displayed, but is not currently displayed
    }
    else {
        var detachedRouteHandle = routeReuseStrategy.retrieve(curr.value);
        if (detachedRouteHandle) {
            var tree = detachedRouteHandle.route;
            setFutureSnapshotsOfActivatedRoutes(curr, tree);
            return tree;
        }
        else {
            var value = createActivatedRoute(curr.value);
            var children = curr.children.map(function (c) { return createNode(routeReuseStrategy, c); });
            return new tree_1.TreeNode(value, children);
        }
    }
}
function setFutureSnapshotsOfActivatedRoutes(curr, result) {
    if (curr.value.routeConfig !== result.value.routeConfig) {
        throw new Error('Cannot reattach ActivatedRouteSnapshot created from a different route');
    }
    if (curr.children.length !== result.children.length) {
        throw new Error('Cannot reattach ActivatedRouteSnapshot with a different number of children');
    }
    result.value._futureSnapshot = curr.value;
    for (var i = 0; i < curr.children.length; ++i) {
        setFutureSnapshotsOfActivatedRoutes(curr.children[i], result.children[i]);
    }
}
function createOrReuseChildren(routeReuseStrategy, curr, prevState) {
    return curr.children.map(function (child) {
        for (var _i = 0, _a = prevState.children; _i < _a.length; _i++) {
            var p = _a[_i];
            if (routeReuseStrategy.shouldReuseRoute(p.value.snapshot, child.value)) {
                return createNode(routeReuseStrategy, child, p);
            }
        }
        return createNode(routeReuseStrategy, child);
    });
}
function createActivatedRoute(c) {
    return new router_state_1.ActivatedRoute(new rxjs_1.BehaviorSubject(c.url), new rxjs_1.BehaviorSubject(c.params), new rxjs_1.BehaviorSubject(c.queryParams), new rxjs_1.BehaviorSubject(c.fragment), new rxjs_1.BehaviorSubject(c.data), c.outlet, c.component, c);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlX3JvdXRlcl9zdGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3JvdXRlci9zcmMvY3JlYXRlX3JvdXRlcl9zdGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILDZCQUFxQztBQUdyQywrQ0FBd0c7QUFDeEcscUNBQXNDO0FBRXRDLDJCQUNJLGtCQUFzQyxFQUFFLElBQXlCLEVBQ2pFLFNBQXNCO0lBQ3hCLElBQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDakcsT0FBTyxJQUFJLDBCQUFXLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3JDLENBQUM7QUFMRCw4Q0FLQztBQUVELG9CQUNJLGtCQUFzQyxFQUFFLElBQXNDLEVBQzlFLFNBQW9DO0lBQ3RDLHFFQUFxRTtJQUNyRSxJQUFJLFNBQVMsSUFBSSxrQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFDMUYsSUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQztRQUM5QixLQUFLLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDbkMsSUFBTSxRQUFRLEdBQUcscUJBQXFCLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzVFLE9BQU8sSUFBSSxlQUFRLENBQWlCLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztRQUVyRCwyRkFBMkY7S0FDNUY7U0FBTTtRQUNMLElBQU0sbUJBQW1CLEdBQ1Esa0JBQWtCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6RSxJQUFJLG1CQUFtQixFQUFFO1lBQ3ZCLElBQU0sSUFBSSxHQUE2QixtQkFBbUIsQ0FBQyxLQUFLLENBQUM7WUFDakUsbUNBQW1DLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2hELE9BQU8sSUFBSSxDQUFDO1NBRWI7YUFBTTtZQUNMLElBQU0sS0FBSyxHQUFHLG9CQUFvQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMvQyxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLFVBQVUsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsRUFBakMsQ0FBaUMsQ0FBQyxDQUFDO1lBQzNFLE9BQU8sSUFBSSxlQUFRLENBQWlCLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztTQUN0RDtLQUNGO0FBQ0gsQ0FBQztBQUVELDZDQUNJLElBQXNDLEVBQUUsTUFBZ0M7SUFDMUUsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsS0FBSyxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRTtRQUN2RCxNQUFNLElBQUksS0FBSyxDQUFDLHVFQUF1RSxDQUFDLENBQUM7S0FDMUY7SUFDRCxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxLQUFLLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFO1FBQ25ELE1BQU0sSUFBSSxLQUFLLENBQUMsNEVBQTRFLENBQUMsQ0FBQztLQUMvRjtJQUNELE1BQU0sQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDMUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1FBQzdDLG1DQUFtQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzNFO0FBQ0gsQ0FBQztBQUVELCtCQUNJLGtCQUFzQyxFQUFFLElBQXNDLEVBQzlFLFNBQW1DO0lBQ3JDLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBQSxLQUFLO1FBQzVCLEtBQWdCLFVBQWtCLEVBQWxCLEtBQUEsU0FBUyxDQUFDLFFBQVEsRUFBbEIsY0FBa0IsRUFBbEIsSUFBa0IsRUFBRTtZQUEvQixJQUFNLENBQUMsU0FBQTtZQUNWLElBQUksa0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUN0RSxPQUFPLFVBQVUsQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDakQ7U0FDRjtRQUNELE9BQU8sVUFBVSxDQUFDLGtCQUFrQixFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQy9DLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELDhCQUE4QixDQUF5QjtJQUNyRCxPQUFPLElBQUksNkJBQWMsQ0FDckIsSUFBSSxzQkFBZSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLHNCQUFlLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksc0JBQWUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQzdGLElBQUksc0JBQWUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSSxzQkFBZSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDOUYsQ0FBQyJ9