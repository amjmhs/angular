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
    describe("View Anchor", function () {
        describe('create', function () {
            it('should create anchor nodes without parents', function () {
                var rootNodes = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                    index_1.anchorDef(0 /* None */, null, null, 0)
                ])).rootNodes;
                expect(rootNodes.length).toBe(1);
            });
            it('should create views with multiple root anchor nodes', function () {
                var rootNodes = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                    index_1.anchorDef(0 /* None */, null, null, 0), index_1.anchorDef(0 /* None */, null, null, 0)
                ])).rootNodes;
                expect(rootNodes.length).toBe(2);
            });
            it('should create anchor nodes with parents', function () {
                var rootNodes = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                    index_1.elementDef(0, 0 /* None */, null, null, 1, 'div'),
                    index_1.anchorDef(0 /* None */, null, null, 0),
                ])).rootNodes;
                expect(dom_adapter_1.getDOM().childNodes(rootNodes[0]).length).toBe(1);
            });
            it('should add debug information to the renderer', function () {
                var someContext = new Object();
                var _a = helper_1.createAndGetRootNodes(helper_1.compViewDef([index_1.anchorDef(0 /* None */, null, null, 0)]), someContext), view = _a.view, rootNodes = _a.rootNodes;
                expect(core_1.getDebugNode(rootNodes[0]).nativeNode).toBe(index_1.asElementData(view, 0).renderElement);
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5jaG9yX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3Qvdmlldy9hbmNob3Jfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHNDQUEyQztBQUMzQyxzREFBNkY7QUFDN0YsNkVBQXFFO0FBRXJFLG1DQUE0RDtBQUU1RDtJQUNFLFFBQVEsQ0FBQyxhQUFhLEVBQUU7UUFFdEIsUUFBUSxDQUFDLFFBQVEsRUFBRTtZQUNqQixFQUFFLENBQUMsNENBQTRDLEVBQUU7Z0JBQy9DLElBQU0sU0FBUyxHQUFHLDhCQUFxQixDQUFDLG9CQUFXLENBQUM7b0JBQ2hDLGlCQUFTLGVBQWlCLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO2lCQUN6QyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7Z0JBQ2hDLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25DLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLHFEQUFxRCxFQUFFO2dCQUN4RCxJQUFNLFNBQVMsR0FDWCw4QkFBcUIsQ0FBQyxvQkFBVyxDQUFDO29CQUNoQyxpQkFBUyxlQUFpQixJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLGlCQUFTLGVBQWlCLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO2lCQUNuRixDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7Z0JBQ2xCLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25DLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLHlDQUF5QyxFQUFFO2dCQUM1QyxJQUFNLFNBQVMsR0FBRyw4QkFBcUIsQ0FBQyxvQkFBVyxDQUFDO29CQUNoQyxrQkFBVSxDQUFDLENBQUMsZ0JBQWtCLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQztvQkFDbkQsaUJBQVMsZUFBaUIsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7aUJBQ3pDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztnQkFDaEMsTUFBTSxDQUFDLG9CQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNELENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLDhDQUE4QyxFQUFFO2dCQUNqRCxJQUFNLFdBQVcsR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO2dCQUMzQixJQUFBLHdIQUNtRSxFQURsRSxjQUFJLEVBQUUsd0JBQVMsQ0FDb0Q7Z0JBQzFFLE1BQU0sQ0FBQyxtQkFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxxQkFBYSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUM3RixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7Q0FDSiJ9