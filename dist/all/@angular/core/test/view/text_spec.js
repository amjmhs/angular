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
    describe("View Text", function () {
        describe('create', function () {
            it('should create text nodes without parents', function () {
                var rootNodes = helper_1.createAndGetRootNodes(helper_1.compViewDef([index_1.textDef(0, null, ['a'])])).rootNodes;
                expect(rootNodes.length).toBe(1);
                expect(dom_adapter_1.getDOM().getText(rootNodes[0])).toBe('a');
            });
            it('should create views with multiple root text nodes', function () {
                var rootNodes = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                    index_1.textDef(0, null, ['a']),
                    index_1.textDef(1, null, ['b']),
                ])).rootNodes;
                expect(rootNodes.length).toBe(2);
            });
            it('should create text nodes with parents', function () {
                var rootNodes = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                    index_1.elementDef(0, 0 /* None */, null, null, 1, 'div'),
                    index_1.textDef(1, null, ['a']),
                ])).rootNodes;
                expect(rootNodes.length).toBe(1);
                var textNode = dom_adapter_1.getDOM().firstChild(rootNodes[0]);
                expect(dom_adapter_1.getDOM().getText(textNode)).toBe('a');
            });
            it('should add debug information to the renderer', function () {
                var someContext = new Object();
                var _a = helper_1.createAndGetRootNodes(helper_1.compViewDef([index_1.textDef(0, null, ['a'])]), someContext), view = _a.view, rootNodes = _a.rootNodes;
                expect(core_1.getDebugNode(rootNodes[0]).nativeNode).toBe(index_1.asTextData(view, 0).renderText);
            });
        });
        describe('change text', function () {
            helper_1.ARG_TYPE_VALUES.forEach(function (inlineDynamic) {
                it("should update via strategy " + inlineDynamic, function () {
                    var _a = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                        index_1.textDef(0, null, ['0', '1', '2']),
                    ], null, function (check, view) {
                        helper_1.checkNodeInlineOrDynamic(check, view, 0, inlineDynamic, ['a', 'b']);
                    })), view = _a.view, rootNodes = _a.rootNodes;
                    index_1.Services.checkAndUpdateView(view);
                    expect(dom_adapter_1.getDOM().getText(rootNodes[0])).toBe('0a1b2');
                });
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dF9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L3ZpZXcvdGV4dF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0NBQTJDO0FBQzNDLHNEQUFrRztBQUNsRyw2RUFBcUU7QUFFckUsbUNBQXVHO0FBRXZHO0lBQ0UsUUFBUSxDQUFDLFdBQVcsRUFBRTtRQUVwQixRQUFRLENBQUMsUUFBUSxFQUFFO1lBQ2pCLEVBQUUsQ0FBQywwQ0FBMEMsRUFBRTtnQkFDN0MsSUFBTSxTQUFTLEdBQUcsOEJBQXFCLENBQUMsb0JBQVcsQ0FBQyxDQUFDLGVBQU8sQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7Z0JBQzFGLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxNQUFNLENBQUMsb0JBQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNuRCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxtREFBbUQsRUFBRTtnQkFDdEQsSUFBTSxTQUFTLEdBQUcsOEJBQXFCLENBQUMsb0JBQVcsQ0FBQztvQkFDaEMsZUFBTyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDdkIsZUFBTyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDeEIsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO2dCQUNoQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQyxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyx1Q0FBdUMsRUFBRTtnQkFDMUMsSUFBTSxTQUFTLEdBQUcsOEJBQXFCLENBQUMsb0JBQVcsQ0FBQztvQkFDaEMsa0JBQVUsQ0FBQyxDQUFDLGdCQUFrQixJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUM7b0JBQ25ELGVBQU8sQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ3hCLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztnQkFDaEMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLElBQU0sUUFBUSxHQUFHLG9CQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25ELE1BQU0sQ0FBQyxvQkFBTSxFQUFFLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQy9DLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLDhDQUE4QyxFQUFFO2dCQUNqRCxJQUFNLFdBQVcsR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO2dCQUMzQixJQUFBLHlHQUN3RSxFQUR2RSxjQUFJLEVBQUUsd0JBQVMsQ0FDeUQ7Z0JBQy9FLE1BQU0sQ0FBQyxtQkFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBVSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN2RixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLGFBQWEsRUFBRTtZQUN0Qix3QkFBZSxDQUFDLE9BQU8sQ0FBQyxVQUFDLGFBQWE7Z0JBQ3BDLEVBQUUsQ0FBQyxnQ0FBOEIsYUFBZSxFQUFFO29CQUMxQyxJQUFBOzs7O3VCQU1DLEVBTkEsY0FBSSxFQUFFLHdCQUFTLENBTWQ7b0JBRVIsZ0JBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFFbEMsTUFBTSxDQUFDLG9CQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3ZELENBQUMsQ0FBQyxDQUFDO1lBRUwsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUVMLENBQUMsQ0FBQyxDQUFDO0NBQ0oifQ==