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
{
    describe("Embedded Views", function () {
        it('should create embedded views with the right context', function () {
            var parentContext = new Object();
            var childContext = new Object();
            var parentView = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                index_1.elementDef(0, 0 /* None */, null, null, 1, 'div'),
                index_1.anchorDef(16777216 /* EmbeddedViews */, null, null, 0, null, helper_1.compViewDefFactory([index_1.elementDef(0, 0 /* None */, null, null, 0, 'span')])),
            ]), parentContext).view;
            var childView = helper_1.createEmbeddedView(parentView, parentView.def.nodes[1], childContext);
            expect(childView.component).toBe(parentContext);
            expect(childView.context).toBe(childContext);
        });
        it('should attach and detach embedded views', function () {
            var _a = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                index_1.elementDef(0, 0 /* None */, null, null, 2, 'div'),
                index_1.anchorDef(16777216 /* EmbeddedViews */, null, null, 0, null, helper_1.compViewDefFactory([
                    index_1.elementDef(0, 0 /* None */, null, null, 0, 'span', [['name', 'child0']])
                ])),
                index_1.anchorDef(0 /* None */, null, null, 0, null, helper_1.compViewDefFactory([index_1.elementDef(0, 0 /* None */, null, null, 0, 'span', [['name', 'child1']])]))
            ])), parentView = _a.view, rootNodes = _a.rootNodes;
            var viewContainerData = index_1.asElementData(parentView, 1);
            var rf = parentView.root.rendererFactory;
            var childView0 = helper_1.createEmbeddedView(parentView, parentView.def.nodes[1]);
            var childView1 = helper_1.createEmbeddedView(parentView, parentView.def.nodes[2]);
            index_1.attachEmbeddedView(parentView, viewContainerData, 0, childView0);
            index_1.attachEmbeddedView(parentView, viewContainerData, 1, childView1);
            // 2 anchors + 2 elements
            var rootChildren = dom_adapter_1.getDOM().childNodes(rootNodes[0]);
            expect(rootChildren.length).toBe(4);
            expect(dom_adapter_1.getDOM().getAttribute(rootChildren[1], 'name')).toBe('child0');
            expect(dom_adapter_1.getDOM().getAttribute(rootChildren[2], 'name')).toBe('child1');
            rf.begin();
            index_1.detachEmbeddedView(viewContainerData, 1);
            index_1.detachEmbeddedView(viewContainerData, 0);
            rf.end();
            expect(dom_adapter_1.getDOM().childNodes(rootNodes[0]).length).toBe(2);
        });
        it('should move embedded views', function () {
            var _a = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                index_1.elementDef(0, 0 /* None */, null, null, 2, 'div'),
                index_1.anchorDef(16777216 /* EmbeddedViews */, null, null, 0, null, helper_1.compViewDefFactory([
                    index_1.elementDef(0, 0 /* None */, null, null, 0, 'span', [['name', 'child0']])
                ])),
                index_1.anchorDef(0 /* None */, null, null, 0, null, helper_1.compViewDefFactory([index_1.elementDef(0, 0 /* None */, null, null, 0, 'span', [['name', 'child1']])]))
            ])), parentView = _a.view, rootNodes = _a.rootNodes;
            var viewContainerData = index_1.asElementData(parentView, 1);
            var childView0 = helper_1.createEmbeddedView(parentView, parentView.def.nodes[1]);
            var childView1 = helper_1.createEmbeddedView(parentView, parentView.def.nodes[2]);
            index_1.attachEmbeddedView(parentView, viewContainerData, 0, childView0);
            index_1.attachEmbeddedView(parentView, viewContainerData, 1, childView1);
            index_1.moveEmbeddedView(viewContainerData, 0, 1);
            expect(viewContainerData.viewContainer._embeddedViews).toEqual([childView1, childView0]);
            // 2 anchors + 2 elements
            var rootChildren = dom_adapter_1.getDOM().childNodes(rootNodes[0]);
            expect(rootChildren.length).toBe(4);
            expect(dom_adapter_1.getDOM().getAttribute(rootChildren[1], 'name')).toBe('child1');
            expect(dom_adapter_1.getDOM().getAttribute(rootChildren[2], 'name')).toBe('child0');
        });
        it('should include embedded views in root nodes', function () {
            var parentView = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                index_1.anchorDef(16777216 /* EmbeddedViews */, null, null, 0, null, helper_1.compViewDefFactory([
                    index_1.elementDef(0, 0 /* None */, null, null, 0, 'span', [['name', 'child0']])
                ])),
                index_1.elementDef(1, 0 /* None */, null, null, 0, 'span', [['name', 'after']])
            ])).view;
            var childView0 = helper_1.createEmbeddedView(parentView, parentView.def.nodes[0]);
            index_1.attachEmbeddedView(parentView, index_1.asElementData(parentView, 0), 0, childView0);
            var rootNodes = index_1.rootRenderNodes(parentView);
            expect(rootNodes.length).toBe(3);
            expect(dom_adapter_1.getDOM().getAttribute(rootNodes[1], 'name')).toBe('child0');
            expect(dom_adapter_1.getDOM().getAttribute(rootNodes[2], 'name')).toBe('after');
        });
        it('should dirty check embedded views', function () {
            var childValue = 'v1';
            var update = jasmine.createSpy('updater').and.callFake(function (check, view) {
                check(view, 0, 0 /* Inline */, childValue);
            });
            var _a = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                index_1.elementDef(0, 0 /* None */, null, null, 1, 'div'),
                index_1.anchorDef(16777216 /* EmbeddedViews */, null, null, 0, null, helper_1.compViewDefFactory([index_1.elementDef(0, 0 /* None */, null, null, 0, 'span', null, [[1 /* TypeElementAttribute */, 'name', core_1.SecurityContext.NONE]])], update))
            ])), parentView = _a.view, rootNodes = _a.rootNodes;
            var childView0 = helper_1.createEmbeddedView(parentView, parentView.def.nodes[1]);
            index_1.attachEmbeddedView(parentView, index_1.asElementData(parentView, 1), 0, childView0);
            index_1.Services.checkAndUpdateView(parentView);
            expect(update.calls.mostRecent().args[1]).toBe(childView0);
            update.calls.reset();
            index_1.Services.checkNoChangesView(parentView);
            expect(update.calls.mostRecent().args[1]).toBe(childView0);
            childValue = 'v2';
            expect(function () { return index_1.Services.checkNoChangesView(parentView); })
                .toThrowError("ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: 'name: v1'. Current value: 'name: v2'.");
        });
        it('should destroy embedded views', function () {
            var log = [];
            var ChildProvider = /** @class */ (function () {
                function ChildProvider() {
                }
                ChildProvider.prototype.ngOnDestroy = function () { log.push('ngOnDestroy'); };
                return ChildProvider;
            }());
            var parentView = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                index_1.elementDef(0, 0 /* None */, null, null, 1, 'div'),
                index_1.anchorDef(16777216 /* EmbeddedViews */, null, null, 0, null, helper_1.compViewDefFactory([
                    index_1.elementDef(0, 0 /* None */, null, null, 1, 'span'),
                    index_1.directiveDef(1, 131072 /* OnDestroy */, null, 0, ChildProvider, [])
                ]))
            ])).view;
            var childView0 = helper_1.createEmbeddedView(parentView, parentView.def.nodes[1]);
            index_1.attachEmbeddedView(parentView, index_1.asElementData(parentView, 1), 0, childView0);
            index_1.Services.destroyView(parentView);
            expect(log).toEqual(['ngOnDestroy']);
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1iZWRkZWRfdmlld19zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L3ZpZXcvZW1iZWRkZWRfdmlld19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0NBQThDO0FBQzlDLHNEQUFtUDtBQUNuUCw2RUFBcUU7QUFFckUsbUNBQW9HO0FBRXBHO0lBQ0UsUUFBUSxDQUFDLGdCQUFnQixFQUFFO1FBRXpCLEVBQUUsQ0FBQyxxREFBcUQsRUFBRTtZQUN4RCxJQUFNLGFBQWEsR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO1lBQ25DLElBQU0sWUFBWSxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7WUFFM0IsSUFBQTs7O21DQUFnQixDQU9KO1lBRW5CLElBQU0sU0FBUyxHQUFHLDJCQUFrQixDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUN4RixNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNoRCxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMvQyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx5Q0FBeUMsRUFBRTtZQUN0QyxJQUFBOzs7Ozs7ZUFRSCxFQVJJLG9CQUFnQixFQUFFLHdCQUFTLENBUTlCO1lBQ0osSUFBTSxpQkFBaUIsR0FBRyxxQkFBYSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN2RCxJQUFNLEVBQUUsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQztZQUUzQyxJQUFNLFVBQVUsR0FBRywyQkFBa0IsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLEdBQUcsQ0FB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