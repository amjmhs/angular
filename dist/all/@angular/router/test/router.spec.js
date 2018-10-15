"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var testing_1 = require("@angular/core/testing");
var events_1 = require("../src/events");
var pre_activation_1 = require("../src/pre_activation");
var router_1 = require("../src/router");
var router_outlet_context_1 = require("../src/router_outlet_context");
var router_state_1 = require("../src/router_state");
var url_tree_1 = require("../src/url_tree");
var tree_1 = require("../src/utils/tree");
var router_testing_module_1 = require("../testing/src/router_testing_module");
var helpers_1 = require("./helpers");
describe('Router', function () {
    describe('resetConfig', function () {
        var TestComponent = /** @class */ (function () {
            function TestComponent() {
            }
            return TestComponent;
        }());
        beforeEach(function () { testing_1.TestBed.configureTestingModule({ imports: [router_testing_module_1.RouterTestingModule] }); });
        it('should copy config to avoid mutations of user-provided objects', function () {
            var r = testing_1.TestBed.get(router_1.Router);
            var configs = [{
                    path: 'a',
                    component: TestComponent,
                    children: [{ path: 'b', component: TestComponent }, { path: 'c', component: TestComponent }]
                }];
            var children = configs[0].children;
            r.resetConfig(configs);
            var rConfigs = r.config;
            var rChildren = rConfigs[0].children;
            // routes array and shallow copy
            expect(configs).not.toBe(rConfigs);
            expect(configs[0]).not.toBe(rConfigs[0]);
            expect(configs[0].path).toBe(rConfigs[0].path);
            expect(configs[0].component).toBe(rConfigs[0].component);
            // children should be new array and routes shallow copied
            expect(children).not.toBe(rChildren);
            expect(children[0]).not.toBe(rChildren[0]);
            expect(children[0].path).toBe(rChildren[0].path);
            expect(children[1]).not.toBe(rChildren[1]);
            expect(children[1].path).toBe(rChildren[1].path);
        });
    });
    describe('resetRootComponentType', function () {
        var NewRootComponent = /** @class */ (function () {
            function NewRootComponent() {
            }
            return NewRootComponent;
        }());
        beforeEach(function () { testing_1.TestBed.configureTestingModule({ imports: [router_testing_module_1.RouterTestingModule] }); });
        it('should not change root route when updating the root component', function () {
            var r = testing_1.TestBed.get(router_1.Router);
            var root = r.routerState.root;
            r.resetRootComponentType(NewRootComponent);
            expect(r.routerState.root).toBe(root);
        });
    });
    describe('setUpLocationChangeListener', function () {
        beforeEach(function () { testing_1.TestBed.configureTestingModule({ imports: [router_testing_module_1.RouterTestingModule] }); });
        it('should be idempotent', testing_1.inject([router_1.Router, common_1.Location], function (r, location) {
            r.setUpLocationChangeListener();
            var a = r.locationSubscription;
            r.setUpLocationChangeListener();
            var b = r.locationSubscription;
            expect(a).toBe(b);
            r.dispose();
            r.setUpLocationChangeListener();
            var c = r.locationSubscription;
            expect(c).not.toBe(b);
        }));
    });
    describe('PreActivation', function () {
        var serializer = new url_tree_1.DefaultUrlSerializer();
        var inj = { get: function (token) { return function () { return token + "_value"; }; } };
        var empty;
        var logger;
        var events;
        var CA_CHILD = 'canActivate_child';
        var CA_CHILD_FALSE = 'canActivate_child_false';
        var CAC_CHILD = 'canActivateChild_child';
        var CAC_CHILD_FALSE = 'canActivateChild_child_false';
        var CA_GRANDCHILD = 'canActivate_grandchild';
        var CA_GRANDCHILD_FALSE = 'canActivate_grandchild_false';
        var CDA_CHILD = 'canDeactivate_child';
        var CDA_CHILD_FALSE = 'canDeactivate_child_false';
        var CDA_GRANDCHILD = 'canDeactivate_grandchild';
        var CDA_GRANDCHILD_FALSE = 'canDeactivate_grandchild_false';
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                providers: [
                    helpers_1.Logger, helpers_1.provideTokenLogger(CA_CHILD), helpers_1.provideTokenLogger(CA_CHILD_FALSE, false),
                    helpers_1.provideTokenLogger(CAC_CHILD), helpers_1.provideTokenLogger(CAC_CHILD_FALSE, false),
                    helpers_1.provideTokenLogger(CA_GRANDCHILD), helpers_1.provideTokenLogger(CA_GRANDCHILD_FALSE, false),
                    helpers_1.provideTokenLogger(CDA_CHILD), helpers_1.provideTokenLogger(CDA_CHILD_FALSE, false),
                    helpers_1.provideTokenLogger(CDA_GRANDCHILD), helpers_1.provideTokenLogger(CDA_GRANDCHILD_FALSE, false)
                ]
            });
        });
        beforeEach(testing_1.inject([helpers_1.Logger], function (_logger) {
            empty = router_state_1.createEmptyStateSnapshot(serializer.parse('/'), null);
            logger = _logger;
            events = [];
        }));
        describe('ChildActivation', function () {
            it('should run', function () {
                /**
                 * R  -->  R (ChildActivationStart)
                 *          \
                 *           child
                 */
                var result = false;
                var childSnapshot = helpers_1.createActivatedRouteSnapshot({ component: 'child', routeConfig: { path: 'child' } });
                var futureState = new router_state_1.RouterStateSnapshot('url', new tree_1.TreeNode(empty.root, [new tree_1.TreeNode(childSnapshot, [])]));
                var p = new pre_activation_1.PreActivation(futureState, empty, testing_1.TestBed, function (evt) { events.push(evt); });
                p.initialize(new router_outlet_context_1.ChildrenOutletContexts());
                p.checkGuards().subscribe(function (x) { return result = x; }, function (e) { throw e; });
                expect(result).toBe(true);
                expect(events.length).toEqual(2);
                expect(events[0].snapshot).toBe(events[0].snapshot.root);
                expect(events[1].snapshot.routeConfig.path).toBe('child');
            });
            it('should run from top to bottom', function () {
                /**
                 * R  -->  R (ChildActivationStart)
                 *          \
                 *           child (ChildActivationStart)
                 *            \
                 *             grandchild (ChildActivationStart)
                 *              \
                 *               great grandchild
                 */
                var result = false;
                var childSnapshot = helpers_1.createActivatedRouteSnapshot({ component: 'child', routeConfig: { path: 'child' } });
                var grandchildSnapshot = helpers_1.createActivatedRouteSnapshot({ component: 'grandchild', routeConfig: { path: 'grandchild' } });
                var greatGrandchildSnapshot = helpers_1.createActivatedRouteSnapshot({ component: 'great-grandchild', routeConfig: { path: 'great-grandchild' } });
                var futureState = new router_state_1.RouterStateSnapshot('url', new tree_1.TreeNode(empty.root, [new tree_1.TreeNode(childSnapshot, [
                        new tree_1.TreeNode(grandchildSnapshot, [new tree_1.TreeNode(greatGrandchildSnapshot, [])])
                    ])]));
                var p = new pre_activation_1.PreActivation(futureState, empty, testing_1.TestBed, function (evt) { events.push(evt); });
                p.initialize(new router_outlet_context_1.ChildrenOutletContexts());
                p.checkGuards().subscribe(function (x) { return result = x; }, function (e) { throw e; });
                expect(result).toBe(true);
                expect(events.length).toEqual(6);
                expect(events[0].snapshot).toBe(events[0].snapshot.root);
                expect(events[2].snapshot.routeConfig.path).toBe('child');
                expect(events[4].snapshot.routeConfig.path).toBe('grandchild');
                expect(events[5].snapshot.routeConfig.path).toBe('great-grandchild');
            });
            it('should not run for unchanged routes', function () {
                /**
                 *         R  -->  R
                 *        / \
                 *   child   child (ChildActivationStart)
                 *            \
                 *             grandchild
                 */
                var result = false;
                var childSnapshot = helpers_1.createActivatedRouteSnapshot({ component: 'child', routeConfig: { path: 'child' } });
                var grandchildSnapshot = helpers_1.createActivatedRouteSnapshot({ component: 'grandchild', routeConfig: { path: 'grandchild' } });
                var currentState = new router_state_1.RouterStateSnapshot('url', new tree_1.TreeNode(empty.root, [new tree_1.TreeNode(childSnapshot, [])]));
                var futureState = new router_state_1.RouterStateSnapshot('url', new tree_1.TreeNode(empty.root, [new tree_1.TreeNode(childSnapshot, [new tree_1.TreeNode(grandchildSnapshot, [])])]));
                var p = new pre_activation_1.PreActivation(futureState, currentState, testing_1.TestBed, function (evt) { events.push(evt); });
                p.initialize(new router_outlet_context_1.ChildrenOutletContexts());
                p.checkGuards().subscribe(function (x) { return result = x; }, function (e) { throw e; });
                expect(result).toBe(true);
                expect(events.length).toEqual(2);
                expect(events[0].snapshot).not.toBe(events[0].snapshot.root);
                expect(events[0].snapshot.routeConfig.path).toBe('child');
            });
            it('should skip multiple unchanged routes but fire for all changed routes', function () {
                /**
                 *         R  -->  R
                 *            / \
                 *       child   child
                 *          /     \
                 * grandchild      grandchild (ChildActivationStart)
                 *                  \
                 *                   greatgrandchild (ChildActivationStart)
                 *                    \
                 *                     great-greatgrandchild
                 */
                var result = false;
                var childSnapshot = helpers_1.createActivatedRouteSnapshot({ component: 'child', routeConfig: { path: 'child' } });
                var grandchildSnapshot = helpers_1.createActivatedRouteSnapshot({ component: 'grandchild', routeConfig: { path: 'grandchild' } });
                var greatGrandchildSnapshot = helpers_1.createActivatedRouteSnapshot({ component: 'greatgrandchild', routeConfig: { path: 'greatgrandchild' } });
                var greatGreatGrandchildSnapshot = helpers_1.createActivatedRouteSnapshot({ component: 'great-greatgrandchild', routeConfig: { path: 'great-greatgrandchild' } });
                var currentState = new router_state_1.RouterStateSnapshot('url', new tree_1.TreeNode(empty.root, [new tree_1.TreeNode(childSnapshot, [new tree_1.TreeNode(grandchildSnapshot, [])])]));
                var futureState = new router_state_1.RouterStateSnapshot('url', new tree_1.TreeNode(empty.root, [new tree_1.TreeNode(childSnapshot, [new tree_1.TreeNode(grandchildSnapshot, [
                            new tree_1.TreeNode(greatGrandchildSnapshot, [new tree_1.TreeNode(greatGreatGrandchildSnapshot, [])])
                        ])])]));
                var p = new pre_activation_1.PreActivation(futureState, currentState, testing_1.TestBed, function (evt) { events.push(evt); });
                p.initialize(new router_outlet_context_1.ChildrenOutletContexts());
                p.checkGuards().subscribe(function (x) { return result = x; }, function (e) { throw e; });
                expect(result).toBe(true);
                expect(events.length).toEqual(4);
                expect(events[0] instanceof events_1.ChildActivationStart).toBe(true);
                expect(events[0].snapshot).not.toBe(events[0].snapshot.root);
                expect(events[0].snapshot.routeConfig.path).toBe('grandchild');
                expect(events[2].snapshot.routeConfig.path).toBe('greatgrandchild');
            });
        });
        describe('guards', function () {
            it('should run CanActivate checks', function () {
                /**
                 * R  -->  R
                 *          \
                 *           child (CA, CAC)
                 *            \
                 *             grandchild (CA)
                 */
                var childSnapshot = helpers_1.createActivatedRouteSnapshot({
                    component: 'child',
                    routeConfig: {
                        canActivate: [CA_CHILD],
                        canActivateChild: [CAC_CHILD]
                    }
                });
                var grandchildSnapshot = helpers_1.createActivatedRouteSnapshot({ component: 'grandchild', routeConfig: { canActivate: [CA_GRANDCHILD] } });
                var futureState = new router_state_1.RouterStateSnapshot('url', new tree_1.TreeNode(empty.root, [new tree_1.TreeNode(childSnapshot, [new tree_1.TreeNode(grandchildSnapshot, [])])]));
                checkGuards(futureState, empty, testing_1.TestBed, function (result) {
                    expect(result).toBe(true);
                    expect(logger.logs).toEqual([CA_CHILD, CAC_CHILD, CA_GRANDCHILD]);
                });
            });
            it('should not run grandchild guards if child fails', function () {
                /**
                 * R  -->  R
                 *          \
                 *           child (CA: x, CAC)
                 *            \
                 *             grandchild (CA)
                 */
                var childSnapshot = helpers_1.createActivatedRouteSnapshot({
                    component: 'child',
                    routeConfig: { canActivate: [CA_CHILD_FALSE], canActivateChild: [CAC_CHILD] }
                });
                var grandchildSnapshot = helpers_1.createActivatedRouteSnapshot({ component: 'grandchild', routeConfig: { canActivate: [CA_GRANDCHILD] } });
                var futureState = new router_state_1.RouterStateSnapshot('url', new tree_1.TreeNode(empty.root, [new tree_1.TreeNode(childSnapshot, [new tree_1.TreeNode(grandchildSnapshot, [])])]));
                checkGuards(futureState, empty, testing_1.TestBed, function (result) {
                    expect(result).toBe(false);
                    expect(logger.logs).toEqual([CA_CHILD_FALSE]);
                });
            });
            it('should not run grandchild guards if child canActivateChild fails', function () {
                /**
                 * R  -->  R
                 *          \
                 *           child (CA, CAC: x)
                 *            \
                 *             grandchild (CA)
                 */
                var childSnapshot = helpers_1.createActivatedRouteSnapshot({
                    component: 'child',
                    routeConfig: { canActivate: [CA_CHILD], canActivateChild: [CAC_CHILD_FALSE] }
                });
                var grandchildSnapshot = helpers_1.createActivatedRouteSnapshot({ component: 'grandchild', routeConfig: { canActivate: [CA_GRANDCHILD] } });
                var futureState = new router_state_1.RouterStateSnapshot('url', new tree_1.TreeNode(empty.root, [new tree_1.TreeNode(childSnapshot, [new tree_1.TreeNode(grandchildSnapshot, [])])]));
                checkGuards(futureState, empty, testing_1.TestBed, function (result) {
                    expect(result).toBe(false);
                    expect(logger.logs).toEqual([CA_CHILD, CAC_CHILD_FALSE]);
                });
            });
            it('should run deactivate guards before activate guards', function () {
                /**
                 *      R  -->  R
                 *     /         \
                 *    prev (CDA)  child (CA)
                 *                 \
                 *                  grandchild (CA)
                 */
                var prevSnapshot = helpers_1.createActivatedRouteSnapshot({ component: 'prev', routeConfig: { canDeactivate: [CDA_CHILD] } });
                var childSnapshot = helpers_1.createActivatedRouteSnapshot({
                    component: 'child',
                    routeConfig: { canActivate: [CA_CHILD], canActivateChild: [CAC_CHILD] }
                });
                var grandchildSnapshot = helpers_1.createActivatedRouteSnapshot({ component: 'grandchild', routeConfig: { canActivate: [CA_GRANDCHILD] } });
                var currentState = new router_state_1.RouterStateSnapshot('prev', new tree_1.TreeNode(empty.root, [new tree_1.TreeNode(prevSnapshot, [])]));
                var futureState = new router_state_1.RouterStateSnapshot('url', new tree_1.TreeNode(empty.root, [new tree_1.TreeNode(childSnapshot, [new tree_1.TreeNode(grandchildSnapshot, [])])]));
                checkGuards(futureState, currentState, testing_1.TestBed, function (result) {
                    expect(logger.logs).toEqual([CDA_CHILD, CA_CHILD, CAC_CHILD, CA_GRANDCHILD]);
                });
            });
            it('should not run activate if deactivate fails guards', function () {
                /**
                 *      R  -->  R
                 *     /         \
                 *    prev (CDA)  child (CA)
                 *                 \
                 *                  grandchild (CA)
                 */
                var prevSnapshot = helpers_1.createActivatedRouteSnapshot({ component: 'prev', routeConfig: { canDeactivate: [CDA_CHILD_FALSE] } });
                var childSnapshot = helpers_1.createActivatedRouteSnapshot({
                    component: 'child',
                    routeConfig: { canActivate: [CA_CHILD], canActivateChild: [CAC_CHILD] }
                });
                var grandchildSnapshot = helpers_1.createActivatedRouteSnapshot({ component: 'grandchild', routeConfig: { canActivate: [CA_GRANDCHILD] } });
                var currentState = new router_state_1.RouterStateSnapshot('prev', new tree_1.TreeNode(empty.root, [new tree_1.TreeNode(prevSnapshot, [])]));
                var futureState = new router_state_1.RouterStateSnapshot('url', new tree_1.TreeNode(empty.root, [new tree_1.TreeNode(childSnapshot, [new tree_1.TreeNode(grandchildSnapshot, [])])]));
                checkGuards(futureState, currentState, testing_1.TestBed, function (result) {
                    expect(result).toBe(false);
                    expect(logger.logs).toEqual([CDA_CHILD_FALSE]);
                });
            });
            it('should deactivate from bottom up, then activate top down', function () {
                /**
                 *      R     -->      R
                 *     /                \
                 *    prevChild (CDA)    child (CA)
                 *   /                    \
                 *  prevGrandchild(CDA)    grandchild (CA)
                 */
                var prevChildSnapshot = helpers_1.createActivatedRouteSnapshot({ component: 'prev_child', routeConfig: { canDeactivate: [CDA_CHILD] } });
                var prevGrandchildSnapshot = helpers_1.createActivatedRouteSnapshot({ component: 'prev_grandchild', routeConfig: { canDeactivate: [CDA_GRANDCHILD] } });
                var childSnapshot = helpers_1.createActivatedRouteSnapshot({
                    component: 'child',
                    routeConfig: { canActivate: [CA_CHILD], canActivateChild: [CAC_CHILD] }
                });
                var grandchildSnapshot = helpers_1.createActivatedRouteSnapshot({ component: 'grandchild', routeConfig: { canActivate: [CA_GRANDCHILD] } });
                var currentState = new router_state_1.RouterStateSnapshot('prev', new tree_1.TreeNode(empty.root, [
                    new tree_1.TreeNode(prevChildSnapshot, [new tree_1.TreeNode(prevGrandchildSnapshot, [])])
                ]));
                var futureState = new router_state_1.RouterStateSnapshot('url', new tree_1.TreeNode(empty.root, [new tree_1.TreeNode(childSnapshot, [new tree_1.TreeNode(grandchildSnapshot, [])])]));
                checkGuards(futureState, currentState, testing_1.TestBed, function (result) {
                    expect(result).toBe(true);
                    expect(logger.logs).toEqual([
                        CDA_GRANDCHILD, CDA_CHILD, CA_CHILD, CAC_CHILD, CA_GRANDCHILD
                    ]);
                });
                logger.empty();
                checkGuards(currentState, futureState, testing_1.TestBed, function (result) {
                    expect(result).toBe(true);
                    expect(logger.logs).toEqual([]);
                });
            });
        });
        describe('resolve', function () {
            it('should resolve data', function () {
                /**
                 * R  -->  R
                 *          \
                 *           a
                 */
                var r = { data: 'resolver' };
                var n = helpers_1.createActivatedRouteSnapshot({ component: 'a', resolve: r });
                var s = new router_state_1.RouterStateSnapshot('url', new tree_1.TreeNode(empty.root, [new tree_1.TreeNode(n, [])]));
                checkResolveData(s, empty, inj, function () {
                    expect(s.root.firstChild.data).toEqual({ data: 'resolver_value' });
                });
            });
            it('should wait for the parent resolve to complete', function () {
                /**
                 * R  -->  R
                 *          \
                 *           null (resolve: parentResolve)
                 *            \
                 *             b (resolve: childResolve)
                 */
                var parentResolve = { data: 'resolver' };
                var childResolve = {};
                var parent = helpers_1.createActivatedRouteSnapshot({ component: null, resolve: parentResolve });
                var child = helpers_1.createActivatedRouteSnapshot({ component: 'b', resolve: childResolve });
                var s = new router_state_1.RouterStateSnapshot('url', new tree_1.TreeNode(empty.root, [new tree_1.TreeNode(parent, [new tree_1.TreeNode(child, [])])]));
                var inj = { get: function (token) { return function () { return Promise.resolve(token + "_value"); }; } };
                checkResolveData(s, empty, inj, function () {
                    expect(s.root.firstChild.firstChild.data).toEqual({ data: 'resolver_value' });
                });
            });
            it('should copy over data when creating a snapshot', function () {
                /**
                 * R  -->  R         -->         R
                 *          \                     \
                 *           n1 (resolve: r1)      n21 (resolve: r1)
                 *                                  \
                 *                                   n22 (resolve: r2)
                 */
                var r1 = { data: 'resolver1' };
                var r2 = { data: 'resolver2' };
                var n1 = helpers_1.createActivatedRouteSnapshot({ component: 'a', resolve: r1 });
                var s1 = new router_state_1.RouterStateSnapshot('url', new tree_1.TreeNode(empty.root, [new tree_1.TreeNode(n1, [])]));
                checkResolveData(s1, empty, inj, function () { });
                var n21 = helpers_1.createActivatedRouteSnapshot({ component: 'a', resolve: r1 });
                var n22 = helpers_1.createActivatedRouteSnapshot({ component: 'b', resolve: r2 });
                var s2 = new router_state_1.RouterStateSnapshot('url', new tree_1.TreeNode(empty.root, [new tree_1.TreeNode(n21, [new tree_1.TreeNode(n22, [])])]));
                checkResolveData(s2, s1, inj, function () {
                    expect(s2.root.firstChild.data).toEqual({ data: 'resolver1_value' });
                    expect(s2.root.firstChild.firstChild.data).toEqual({ data: 'resolver2_value' });
                });
            });
        });
    });
});
function checkResolveData(future, curr, injector, check) {
    var p = new pre_activation_1.PreActivation(future, curr, injector);
    p.initialize(new router_outlet_context_1.ChildrenOutletContexts());
    p.resolveData('emptyOnly').subscribe(check, function (e) { throw e; });
}
function checkGuards(future, curr, injector, check) {
    var p = new pre_activation_1.PreActivation(future, curr, injector);
    p.initialize(new router_outlet_context_1.ChildrenOutletContexts());
    p.checkGuards().subscribe(check, function (e) { throw e; });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9yb3V0ZXIvdGVzdC9yb3V0ZXIuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILDBDQUF5QztBQUN6QyxpREFBc0Q7QUFHdEQsd0NBQW1EO0FBQ25ELHdEQUFvRDtBQUNwRCx3Q0FBcUM7QUFDckMsc0VBQW9FO0FBQ3BFLG9EQUFrRjtBQUNsRiw0Q0FBcUQ7QUFDckQsMENBQTJDO0FBQzNDLDhFQUF5RTtBQUV6RSxxQ0FBbUY7QUFFbkYsUUFBUSxDQUFDLFFBQVEsRUFBRTtJQUVqQixRQUFRLENBQUMsYUFBYSxFQUFFO1FBQ3RCO1lBQUE7WUFBcUIsQ0FBQztZQUFELG9CQUFDO1FBQUQsQ0FBQyxBQUF0QixJQUFzQjtRQUV0QixVQUFVLENBQUMsY0FBUSxpQkFBTyxDQUFDLHNCQUFzQixDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsMkNBQW1CLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV4RixFQUFFLENBQUMsZ0VBQWdFLEVBQUU7WUFDbkUsSUFBTSxDQUFDLEdBQVcsaUJBQU8sQ0FBQyxHQUFHLENBQUMsZUFBTSxDQUFDLENBQUM7WUFDdEMsSUFBTSxPQUFPLEdBQVcsQ0FBQztvQkFDdkIsSUFBSSxFQUFFLEdBQUc7b0JBQ1QsU0FBUyxFQUFFLGFBQWE7b0JBQ3hCLFFBQVEsRUFBRSxDQUFDLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUMsQ0FBQztpQkFDekYsQ0FBQyxDQUFDO1lBQ0gsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVUsQ0FBQztZQUV2QyxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FB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