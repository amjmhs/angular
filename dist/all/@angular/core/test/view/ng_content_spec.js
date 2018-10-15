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
    describe("View NgContent", function () {
        function hostElDef(checkIndex, contentNodes, viewNodes) {
            var AComp = /** @class */ (function () {
                function AComp() {
                }
                return AComp;
            }());
            var aCompViewDef = helper_1.compViewDef(viewNodes);
            return [
                index_1.elementDef(checkIndex, 0 /* None */, null, null, 1 + contentNodes.length, 'acomp', null, null, null, null, function () { return aCompViewDef; }),
                index_1.directiveDef(checkIndex + 1, 32768 /* Component */, null, 0, AComp, [])
            ].concat(contentNodes);
        }
        function createAndGetRootNodes(viewDef, ctx) {
            var view = helper_1.createRootView(viewDef, ctx || {});
            var rootNodes = index_1.rootRenderNodes(view);
            return { rootNodes: rootNodes, view: view };
        }
        it('should create ng-content nodes without parents', function () {
            var _a = createAndGetRootNodes(helper_1.compViewDef(hostElDef(0, [index_1.textDef(2, 0, ['a'])], [index_1.ngContentDef(null, 0)]))), view = _a.view, rootNodes = _a.rootNodes;
            expect(dom_adapter_1.getDOM().firstChild(rootNodes[0])).toBe(index_1.asTextData(view, 2).renderText);
        });
        it('should create views with multiple root ng-content nodes', function () {
            var _a = createAndGetRootNodes(helper_1.compViewDef(hostElDef(0, [index_1.textDef(2, 0, ['a']), index_1.textDef(3, 1, ['b'])], [index_1.ngContentDef(null, 0), index_1.ngContentDef(null, 1)]))), view = _a.view, rootNodes = _a.rootNodes;
            expect(dom_adapter_1.getDOM().childNodes(rootNodes[0])[0]).toBe(index_1.asTextData(view, 2).renderText);
            expect(dom_adapter_1.getDOM().childNodes(rootNodes[0])[1]).toBe(index_1.asTextData(view, 3).renderText);
        });
        it('should create ng-content nodes with parents', function () {
            var _a = createAndGetRootNodes(helper_1.compViewDef(hostElDef(0, [index_1.textDef(2, 0, ['a'])], [index_1.elementDef(0, 0 /* None */, null, null, 1, 'div'), index_1.ngContentDef(null, 0)]))), view = _a.view, rootNodes = _a.rootNodes;
            expect(dom_adapter_1.getDOM().firstChild(dom_adapter_1.getDOM().firstChild(rootNodes[0])))
                .toBe(index_1.asTextData(view, 2).renderText);
        });
        it('should reproject ng-content nodes', function () {
            var _a = createAndGetRootNodes(helper_1.compViewDef(hostElDef(0, [index_1.textDef(2, 0, ['a'])], hostElDef(0, [index_1.ngContentDef(0, 0)], [
                index_1.elementDef(0, 0 /* None */, null, null, 1, 'span'), index_1.ngContentDef(null, 0)
            ])))), view = _a.view, rootNodes = _a.rootNodes;
            expect(dom_adapter_1.getDOM().firstChild(dom_adapter_1.getDOM().firstChild(dom_adapter_1.getDOM().firstChild(rootNodes[0]))))
                .toBe(index_1.asTextData(view, 2).renderText);
        });
        it('should project already attached embedded views', function () {
            var CreateViewService = /** @class */ (function () {
                function CreateViewService(templateRef, viewContainerRef) {
                    viewContainerRef.createEmbeddedView(templateRef);
                }
                return CreateViewService;
            }());
            var _a = createAndGetRootNodes(helper_1.compViewDef(hostElDef(0, [
                index_1.anchorDef(16777216 /* EmbeddedViews */, null, 0, 1, null, helper_1.compViewDefFactory([index_1.textDef(0, null, ['a'])])),
                index_1.directiveDef(3, 0 /* None */, null, 0, CreateViewService, [core_1.TemplateRef, core_1.ViewContainerRef]),
            ], [
                index_1.elementDef(0, 0 /* None */, null, null, 1, 'div'),
                index_1.ngContentDef(null, 0),
            ]))), view = _a.view, rootNodes = _a.rootNodes;
            var anchor = index_1.asElementData(view, 2);
            expect((dom_adapter_1.getDOM().childNodes(dom_adapter_1.getDOM().firstChild(rootNodes[0]))[0]))
                .toBe(anchor.renderElement);
            var embeddedView = anchor.viewContainer._embeddedViews[0];
            expect((dom_adapter_1.getDOM().childNodes(dom_adapter_1.getDOM().firstChild(rootNodes[0]))[1]))
                .toBe(index_1.asTextData(embeddedView, 0).renderText);
        });
        it('should include projected nodes when attaching / detaching embedded views', function () {
            var _a = createAndGetRootNodes(helper_1.compViewDef(hostElDef(0, [index_1.textDef(2, 0, ['a'])], [
                index_1.elementDef(0, 0 /* None */, null, null, 1, 'div'),
                index_1.anchorDef(16777216 /* EmbeddedViews */, null, 0, 0, null, helper_1.compViewDefFactory([
                    index_1.ngContentDef(null, 0),
                    // The anchor would be added by the compiler after the ngContent
                    index_1.anchorDef(0 /* None */, null, null, 0),
                ])),
            ]))), view = _a.view, rootNodes = _a.rootNodes;
            var componentView = index_1.asElementData(view, 0).componentView;
            var rf = componentView.root.rendererFactory;
            var view0 = helper_1.createEmbeddedView(componentView, componentView.def.nodes[1]);
            index_1.attachEmbeddedView(view, index_1.asElementData(componentView, 1), 0, view0);
            expect(dom_adapter_1.getDOM().childNodes(dom_adapter_1.getDOM().firstChild(rootNodes[0])).length).toBe(3);
            expect(dom_adapter_1.getDOM().childNodes(dom_adapter_1.getDOM().firstChild(rootNodes[0]))[1])
                .toBe(index_1.asTextData(view, 2).renderText);
            rf.begin();
            index_1.detachEmbeddedView(index_1.asElementData(componentView, 1), 0);
            rf.end();
            expect(dom_adapter_1.getDOM().childNodes(dom_adapter_1.getDOM().firstChild(rootNodes[0])).length).toBe(1);
        });
        if (helper_1.isBrowser()) {
            it('should use root projectable nodes', function () {
                var projectableNodes = [[document.createTextNode('a')], [document.createTextNode('b')]];
                var view = helper_1.createRootView(helper_1.compViewDef(hostElDef(0, [], [index_1.ngContentDef(null, 0), index_1.ngContentDef(null, 1)])), {}, projectableNodes);
                var rootNodes = index_1.rootRenderNodes(view);
                expect(dom_adapter_1.getDOM().childNodes(rootNodes[0])[0]).toBe(projectableNodes[0][0]);
                expect(dom_adapter_1.getDOM().childNodes(rootNodes[0])[1]).toBe(projectableNodes[1][0]);
            });
        }
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfY29udGVudF9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L3ZpZXcvbmdfY29udGVudF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0NBQXNLO0FBQ3RLLHNEQUF3VztBQUN4Vyw2RUFBcUU7QUFFckUsbUNBQXdHO0FBRXhHO0lBQ0UsUUFBUSxDQUFDLGdCQUFnQixFQUFFO1FBQ3pCLG1CQUNJLFVBQWtCLEVBQUUsWUFBdUIsRUFBRSxTQUFvQjtZQUNuRTtnQkFBQTtnQkFBYSxDQUFDO2dCQUFELFlBQUM7WUFBRCxDQUFDLEFBQWQsSUFBYztZQUVkLElBQU0sWUFBWSxHQUFHLG9CQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7WUFFNUM7Z0JBQ0Usa0JBQVUsQ0FDTixVQUFVLGdCQUFrQixJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUNwRixJQUFJLEVBQUUsSUFBSSxFQUFFLGNBQU0sT0FBQSxZQUFZLEVBQVosQ0FBWSxDQUFDO2dCQUNuQyxvQkFBWSxDQUFDLFVBQVUsR0FBRyxDQUFDLHlCQUF1QixJQUFJLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUM7cUJBQUssWUFBWSxFQUN0RjtRQUNKLENBQUM7UUFFRCwrQkFDSSxPQUF1QixFQUFFLEdBQVM7WUFDcEMsSUFBTSxJQUFJLEdBQUcsdUJBQWMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ2hELElBQU0sU0FBUyxHQUFHLHVCQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDeEMsT0FBTyxFQUFDLFNBQVMsV0FBQSxFQUFFLElBQUksTUFBQSxFQUFDLENBQUM7UUFDM0IsQ0FBQztRQUVELEVBQUUsQ0FBQyxnREFBZ0QsRUFBRTtZ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