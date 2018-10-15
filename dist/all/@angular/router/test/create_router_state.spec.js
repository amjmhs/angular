"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var create_router_state_1 = require("../src/create_router_state");
var recognize_1 = require("../src/recognize");
var route_reuse_strategy_1 = require("../src/route_reuse_strategy");
var router_state_1 = require("../src/router_state");
var shared_1 = require("../src/shared");
var url_tree_1 = require("../src/url_tree");
describe('create router state', function () {
    var reuseStrategy = new route_reuse_strategy_1.DefaultRouteReuseStrategy();
    var emptyState = function () { return router_state_1.createEmptyState(new url_tree_1.UrlTree(new url_tree_1.UrlSegmentGroup([], {}), {}, null), RootComponent); };
    it('should create new state', function () {
        var state = create_router_state_1.createRouterState(reuseStrategy, createState([
            { path: 'a', component: ComponentA },
            { path: 'b', component: ComponentB, outlet: 'left' },
            { path: 'c', component: ComponentC, outlet: 'right' }
        ], 'a(left:b//right:c)'), emptyState());
        checkActivatedRoute(state.root, RootComponent);
        var c = state.children(state.root);
        checkActivatedRoute(c[0], ComponentA);
        checkActivatedRoute(c[1], ComponentB, 'left');
        checkActivatedRoute(c[2], ComponentC, 'right');
    });
    it('should reuse existing nodes when it can', function () {
        var config = [
            { path: 'a', component: ComponentA }, { path: 'b', component: ComponentB, outlet: 'left' },
            { path: 'c', component: ComponentC, outlet: 'left' }
        ];
        var prevState = create_router_state_1.createRouterState(reuseStrategy, createState(config, 'a(left:b)'), emptyState());
        advanceState(prevState);
        var state = create_router_state_1.createRouterState(reuseStrategy, createState(config, 'a(left:c)'), prevState);
        expect(prevState.root).toBe(state.root);
        var prevC = prevState.children(prevState.root);
        var currC = state.children(state.root);
        expect(prevC[0]).toBe(currC[0]);
        expect(prevC[1]).not.toBe(currC[1]);
        checkActivatedRoute(currC[1], ComponentC, 'left');
    });
    it('should handle componentless routes', function () {
        var config = [{
                path: 'a/:id',
                children: [
                    { path: 'b', component: ComponentA }, { path: 'c', component: ComponentB, outlet: 'right' }
                ]
            }];
        var prevState = create_router_state_1.createRouterState(reuseStrategy, createState(config, 'a/1;p=11/(b//right:c)'), emptyState());
        advanceState(prevState);
        var state = create_router_state_1.createRouterState(reuseStrategy, createState(config, 'a/2;p=22/(b//right:c)'), prevState);
        expect(prevState.root).toBe(state.root);
        var prevP = prevState.firstChild(prevState.root);
        var currP = state.firstChild(state.root);
        expect(prevP).toBe(currP);
        var currC = state.children(currP);
        expect(currP._futureSnapshot.params).toEqual({ id: '2', p: '22' });
        expect(currP._futureSnapshot.paramMap.get('id')).toEqual('2');
        expect(currP._futureSnapshot.paramMap.get('p')).toEqual('22');
        checkActivatedRoute(currC[0], ComponentA);
        checkActivatedRoute(currC[1], ComponentB, 'right');
    });
    it('should cache the retrieved routeReuseStrategy', function () {
        var config = [
            { path: 'a', component: ComponentA }, { path: 'b', component: ComponentB, outlet: 'left' },
            { path: 'c', component: ComponentC, outlet: 'left' }
        ];
        spyOn(reuseStrategy, 'retrieve').and.callThrough();
        var prevState = create_router_state_1.createRouterState(reuseStrategy, createState(config, 'a(left:b)'), emptyState());
        advanceState(prevState);
        // Expect 2 calls as the baseline setup
        expect(reuseStrategy.retrieve).toHaveBeenCalledTimes(2);
        // This call should produce a reused activated route
        var state = create_router_state_1.createRouterState(reuseStrategy, createState(config, 'a(left:c)'), prevState);
        // Verify the retrieve method has been called one more time
        expect(reuseStrategy.retrieve).toHaveBeenCalledTimes(3);
    });
});
function advanceState(state) {
    advanceNode(state._root);
}
function advanceNode(node) {
    router_state_1.advanceActivatedRoute(node.value);
    node.children.forEach(advanceNode);
}
function createState(config, url) {
    var res = undefined;
    recognize_1.recognize(RootComponent, config, tree(url), url).forEach(function (s) { return res = s; });
    return res;
}
function checkActivatedRoute(actual, cmp, outlet) {
    if (outlet === void 0) { outlet = shared_1.PRIMARY_OUTLET; }
    if (actual === null) {
        expect(actual).toBeDefined();
    }
    else {
        expect(actual.component).toBe(cmp);
        expect(actual.outlet).toEqual(outlet);
    }
}
function tree(url) {
    return new url_tree_1.DefaultUrlSerializer().parse(url);
}
var RootComponent = /** @class */ (function () {
    function RootComponent() {
    }
    return RootComponent;
}());
var ComponentA = /** @class */ (function () {
    function ComponentA() {
    }
    return ComponentA;
}());
var ComponentB = /** @class */ (function () {
    function ComponentB() {
    }
    return ComponentB;
}());
var ComponentC = /** @class */ (function () {
    function ComponentC() {
    }
    return ComponentC;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlX3JvdXRlcl9zdGF0ZS5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcm91dGVyL3Rlc3QvY3JlYXRlX3JvdXRlcl9zdGF0ZS5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBR0gsa0VBQTZEO0FBQzdELDhDQUEyQztBQUMzQyxvRUFBc0U7QUFDdEUsb0RBQThIO0FBQzlILHdDQUE2QztBQUM3Qyw0Q0FBK0U7QUFHL0UsUUFBUSxDQUFDLHFCQUFxQixFQUFFO0lBQzlCLElBQU0sYUFBYSxHQUFHLElBQUksZ0RBQXlCLEVBQUUsQ0FBQztJQUV0RCxJQUFNLFVBQVUsR0FBRyxjQUFNLE9BQUEsK0JBQWdCLENBQ3JDLElBQUssa0JBQWUsQ0FBQyxJQUFJLDBCQUFlLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFNLENBQUMsRUFBRSxhQUFhLENBQUMsRUFEeEQsQ0FDd0QsQ0FBQztJQUVsRixFQUFFLENBQUMseUJBQXlCLEVBQUU7UUFDNUIsSUFBTSxLQUFLLEdBQUcsdUNBQWlCLENBQzNCLGFBQWEsRUFBRSxXQUFXLENBQ1A7WUFDRSxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBQztZQUNsQyxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFDO1lBQ2xELEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUM7U0FDcEQsRUFDRCxvQkFBb0IsQ0FBQyxFQUN4QyxVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBRWxCLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFFL0MsSUFBTSxDQUFDLEdBQUksS0FBYSxDQUFDLFFBQVEsQ0FB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