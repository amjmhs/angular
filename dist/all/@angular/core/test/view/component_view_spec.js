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
var index_1 = require("@angular/core/src/view/index");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var helper_1 = require("./helper");
/**
 * We map addEventListener to the Zones internal name. This is because we want to be fast
 * and bypass the zone bookkeeping. We know that we can do the bookkeeping faster.
 */
var addEventListener = '__zone_symbol__addEventListener';
{
    describe("Component Views", function () {
        it('should create and attach component views', function () {
            var instance = undefined;
            var AComp = /** @class */ (function () {
                function AComp() {
                    instance = this;
                }
                return AComp;
            }());
            var _a = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                index_1.elementDef(0, 0 /* None */, null, null, 1, 'div', null, null, null, null, function () { return helper_1.compViewDef([
                    index_1.elementDef(0, 0 /* None */, null, null, 0, 'span'),
                ]); }),
                index_1.directiveDef(1, 32768 /* Component */, null, 0, AComp, []),
            ])), view = _a.view, rootNodes = _a.rootNodes;
            var compView = index_1.asElementData(view, 0).componentView;
            expect(compView.context).toBe(instance);
            expect(compView.component).toBe(instance);
            var compRootEl = dom_adapter_1.getDOM().childNodes(rootNodes[0])[0];
            expect(dom_adapter_1.getDOM().nodeName(compRootEl).toLowerCase()).toBe('span');
        });
        if (helper_1.isBrowser()) {
            describe('root views', function () {
                var rootNode;
                beforeEach(function () {
                    rootNode = document.createElement('root');
                    document.body.appendChild(rootNode);
                    helper_1.recordNodeToRemove(rootNode);
                });
                it('should select root elements based on a selector', function () {
                    var view = helper_1.createRootView(helper_1.compViewDef([
                        index_1.elementDef(0, 0 /* None */, null, null, 0, 'div'),
                    ]), {}, [], 'root');
                    var rootNodes = index_1.rootRenderNodes(view);
                    expect(rootNodes).toEqual([rootNode]);
                });
                it('should select root elements based on a node', function () {
                    var view = helper_1.createRootView(helper_1.compViewDef([
                        index_1.elementDef(0, 0 /* None */, null, null, 0, 'div'),
                    ]), {}, [], rootNode);
                    var rootNodes = index_1.rootRenderNodes(view);
                    expect(rootNodes).toEqual([rootNode]);
                });
                it('should set attributes on the root node', function () {
                    helper_1.createRootView(helper_1.compViewDef([
                        index_1.elementDef(0, 0 /* None */, null, null, 0, 'div', [['a', 'b']]),
                    ]), {}, [], rootNode);
                    expect(rootNode.getAttribute('a')).toBe('b');
                });
                it('should clear the content of the root node', function () {
                    rootNode.appendChild(document.createElement('div'));
                    helper_1.createRootView(helper_1.compViewDef([
                        index_1.elementDef(0, 0 /* None */, null, null, 0, 'div', [['a', 'b']]),
                    ]), {}, [], rootNode);
                    expect(rootNode.childNodes.length).toBe(0);
                });
            });
        }
        describe('data binding', function () {
            it('should dirty check component views', function () {
                var value;
                var AComp = /** @class */ (function () {
                    function AComp() {
                    }
                    return AComp;
                }());
                var update = jasmine.createSpy('updater').and.callFake(function (check, view) {
                    check(view, 0, 0 /* Inline */, value);
                });
                var _a = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                    index_1.elementDef(0, 0 /* None */, null, null, 1, 'div', null, null, null, null, function () { return helper_1.compViewDef([
                        index_1.elementDef(0, 0 /* None */, null, null, 0, 'span', null, [[1 /* TypeElementAttribute */, 'a', core_1.SecurityContext.NONE]]),
                    ], null, update); }),
                    index_1.directiveDef(1, 32768 /* Component */, null, 0, AComp, []),
                ])), view = _a.view, rootNodes = _a.rootNodes;
                var compView = index_1.asElementData(view, 0).componentView;
                value = 'v1';
                index_1.Services.checkAndUpdateView(view);
                expect(update.calls.mostRecent().args[1]).toBe(compView);
                update.calls.reset();
                index_1.Services.checkNoChangesView(view);
                expect(update.calls.mostRecent().args[1]).toBe(compView);
                value = 'v2';
                expect(function () { return index_1.Services.checkNoChangesView(view); })
                    .toThrowError("ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: 'a: v1'. Current value: 'a: v2'.");
            });
            // fixes https://github.com/angular/angular/issues/21788
            it('report the binding name when an expression changes after it has been checked', function () {
                var value;
                var AComp = /** @class */ (function () {
                    function AComp() {
                    }
                    return AComp;
                }());
                var update = jasmine.createSpy('updater').and.callFake(function (check, view) {
                    check(view, 0, 0 /* Inline */, 'const', 'const', value);
                });
                var _a = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                    index_1.elementDef(0, 0 /* None */, null, null, 1, 'div', null, null, null, null, function () { return helper_1.compViewDef([
                        index_1.elementDef(0, 0 /* None */, null, null, 0, 'span', null, [
                            [1 /* TypeElementAttribute */, 'p1', core_1.SecurityContext.NONE],
                            [1 /* TypeElementAttribute */, 'p2', core_1.SecurityContext.NONE],
                            [1 /* TypeElementAttribute */, 'p3', core_1.SecurityContext.NONE],
                        ]),
                    ], null, update); }),
                    index_1.directiveDef(1, 32768 /* Component */, null, 0, AComp, []),
                ])), view = _a.view, rootNodes = _a.rootNodes;
                value = 'v1';
                index_1.Services.checkAndUpdateView(view);
                value = 'v2';
                expect(function () { return index_1.Services.checkNoChangesView(view); })
                    .toThrowError("ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: 'p3: v1'. Current value: 'p3: v2'.");
            });
            it('should support detaching and attaching component views for dirty checking', function () {
                var AComp = /** @class */ (function () {
                    function AComp() {
                    }
                    return AComp;
                }());
                var update = jasmine.createSpy('updater');
                var _a = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                    index_1.elementDef(0, 0 /* None */, null, null, 1, 'div', null, null, null, null, function () { return helper_1.compViewDef([
                        index_1.elementDef(0, 0 /* None */, null, null, 0, 'span'),
                    ], update); }),
                    index_1.directiveDef(1, 32768 /* Component */, null, 0, AComp, [], null, null),
                ])), view = _a.view, rootNodes = _a.rootNodes;
                var compView = index_1.asElementData(view, 0).componentView;
                index_1.Services.checkAndUpdateView(view);
                update.calls.reset();
                compView.state &= ~8 /* ChecksEnabled */;
                index_1.Services.checkAndUpdateView(view);
                expect(update).not.toHaveBeenCalled();
                compView.state |= 8 /* ChecksEnabled */;
                index_1.Services.checkAndUpdateView(view);
                expect(update).toHaveBeenCalled();
            });
            if (helper_1.isBrowser()) {
                it('should support OnPush components', function () {
                    var compInputValue;
                    var AComp = /** @class */ (function () {
                        function AComp() {
                        }
                        return AComp;
                    }());
                    var update = jasmine.createSpy('updater');
                    var addListenerSpy = spyOn(HTMLElement.prototype, addEventListener).and.callThrough();
                    var view = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                        index_1.elementDef(0, 0 /* None */, null, null, 1, 'div', null, null, null, null, function () {
                            return helper_1.compViewDef([
                                index_1.elementDef(0, 0 /* None */, null, null, 0, 'span', null, null, [[null, 'click']]),
                            ], update, null, 2 /* OnPush */);
                        }),
                        index_1.directiveDef(1, 32768 /* Component */, null, 0, AComp, [], { a: [0, 'a'] }),
                    ], function (check, view) { check(view, 1, 0 /* Inline */, compInputValue); })).view;
                    index_1.Services.checkAndUpdateView(view);
                    // auto detach
                    update.calls.reset();
                    index_1.Services.checkAndUpdateView(view);
                    expect(update).not.toHaveBeenCalled();
                    // auto attach on input changes
                    update.calls.reset();
                    compInputValue = 'v1';
                    index_1.Services.checkAndUpdateView(view);
                    expect(update).toHaveBeenCalled();
                    // auto detach
                    update.calls.reset();
                    index_1.Services.checkAndUpdateView(view);
                    expect(update).not.toHaveBeenCalled();
                    // auto attach on events
                    helper_1.callMostRecentEventListenerHandler(addListenerSpy, 'SomeEvent');
                    update.calls.reset();
                    index_1.Services.checkAndUpdateView(view);
                    expect(update).toHaveBeenCalled();
                    // auto detach
                    update.calls.reset();
                    index_1.Services.checkAndUpdateView(view);
                    expect(update).not.toHaveBeenCalled();
                });
            }
            it('should not stop dirty checking views that threw errors in change detection', function () {
                var AComp = /** @class */ (function () {
                    function AComp() {
                    }
                    return AComp;
                }());
                var update = jasmine.createSpy('updater');
                var _a = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                    index_1.elementDef(0, 0 /* None */, null, null, 1, 'div', null, null, null, null, function () { return helper_1.compViewDef([index_1.elementDef(0, 0 /* None */, null, null, 0, 'span', null, [[1 /* TypeElementAttribute */, 'a', core_1.SecurityContext.NONE]])], null, update); }),
                    index_1.directiveDef(1, 32768 /* Component */, null, 0, AComp, [], null, null),
                ])), view = _a.view, rootNodes = _a.rootNodes;
                update.and.callFake(function (check, view) { throw new Error('Test'); });
                expect(function () { return index_1.Services.checkAndUpdateView(view); }).toThrowError('Test');
                expect(update).toHaveBeenCalled();
                update.calls.reset();
                expect(function () { return index_1.Services.checkAndUpdateView(view); }).toThrowError('Test');
                expect(update).toHaveBeenCalled();
            });
        });
        describe('destroy', function () {
            it('should destroy component views', function () {
                var log = [];
                var AComp = /** @class */ (function () {
                    function AComp() {
                    }
                    return AComp;
                }());
                var ChildProvider = /** @class */ (function () {
                    function ChildProvider() {
                    }
                    ChildProvider.prototype.ngOnDestroy = function () { log.push('ngOnDestroy'); };
                    return ChildProvider;
                }());
                var _a = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                    index_1.elementDef(0, 0 /* None */, null, null, 1, 'div', null, null, null, null, function () { return helper_1.compViewDef([
                        index_1.elementDef(0, 0 /* None */, null, null, 1, 'span'),
                        index_1.directiveDef(1, 131072 /* OnDestroy */, null, 0, ChildProvider, [])
                    ]); }),
                    index_1.directiveDef(1, 32768 /* Component */, null, 0, AComp, [], null, null),
                ])), view = _a.view, rootNodes = _a.rootNodes;
                index_1.Services.destroyView(view);
                expect(log).toEqual(['ngOnDestroy']);
            });
            it('should throw on dirty checking destroyed views', function () {
                var _a = helper_1.createAndGetRootNodes(helper_1.compViewDef([index_1.elementDef(0, 0 /* None */, null, null, 0, 'div')])), view = _a.view, rootNodes = _a.rootNodes;
                index_1.Services.destroyView(view);
                expect(function () { return index_1.Services.checkAndUpdateView(view); })
                    .toThrowError('ViewDestroyedError: Attempt to use a destroyed view: detectChanges');
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50X3ZpZXdfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC92aWV3L2NvbXBvbmVudF92aWV3X3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxzQ0FBOEM7QUFDOUMsc0RBQW9NO0FBQ3BNLDZFQUFxRTtBQUVyRSxtQ0FBK0k7QUFJL0k7OztHQUdHO0FBQ0gsSUFBTSxnQkFBZ0IsR0FBRyxpQ0FBdUQsQ0FBQztBQUVqRjtJQUNFLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtRQUMxQixFQUFFLENBQUMsMENBQTBDLEVBQUU7WUFDN0MsSUFBSSxRQUFRLEdBQVUsU0FBVyxDQUFDO1lBQ2xDO2dCQUNFO29CQUFnQixRQUFRLEdBQUcsSUFBSSxDQUFDO2dCQUFDLENBQUM7Z0JBQ3BDLFlBQUM7WUFBRCxDQUFDLEFBRkQsSUFFQztZQUVLLElBQUE7Ozs7O2VBT0gsRUFQSSxjQUFJLEVBQUUsd0JBQVMsQ0FPbEI7WUFFSixJQUFNLFFBQVEsR0FBRyxxQkFBYSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUM7WUFFdEQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDeEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFMUMsSUFBTSxVQUFVLEdBQUcsb0JBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4RCxNQUFNLENBQUMsb0JBQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuRSxDQUFD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