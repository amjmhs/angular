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
var util_1 = require("../../util");
var tree_1 = require("./tree");
function noop() { }
function main() {
    var component;
    if (typeof window !== 'undefined') {
        component = core_1.ɵrenderComponent(tree_1.TreeComponent);
        util_1.bindAction('#createDom', function () { return tree_1.createDom(component); });
        util_1.bindAction('#destroyDom', function () { return tree_1.destroyDom(component); });
        util_1.bindAction('#detectChanges', function () { return tree_1.detectChanges(component); });
        util_1.bindAction('#detectChangesProfile', util_1.profile(function () { return tree_1.detectChanges(component); }, noop, 'detectChanges'));
        util_1.bindAction('#updateDomProfile', util_1.profile(function () { return tree_1.createDom(component); }, noop, 'update'));
        util_1.bindAction('#createDomProfile', util_1.profile(function () { return tree_1.createDom(component); }, function () { return tree_1.destroyDom(component); }, 'create'));
    }
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2JlbmNobWFya3Mvc3JjL3RyZWUvcmVuZGVyMy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHNDQUFrRTtBQUNsRSxtQ0FBK0M7QUFDL0MsK0JBQTJFO0FBRTNFLGtCQUFpQixDQUFDO0FBRWxCO0lBQ0UsSUFBSSxTQUF3QixDQUFDO0lBQzdCLElBQUksT0FBTyxNQUFNLEtBQUssV0FBVyxFQUFFO1FBQ2pDLFNBQVMsR0FBRyx1QkFBZSxDQUFDLG9CQUFhLENBQUMsQ0FBQztRQUMzQyxpQkFBVSxDQUFDLFlBQVksRUFBRSxjQUFNLE9BQUEsZ0JBQVMsQ0FBQyxTQUFTLENBQUMsRUFBcEIsQ0FBb0IsQ0FBQyxDQUFDO1FBQ3JELGlCQUFVLENBQUMsYUFBYSxFQUFFLGNBQU0sT0FBQSxpQkFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFyQixDQUFxQixDQUFDLENBQUM7UUFDdkQsaUJBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxjQUFNLE9BQUEsb0JBQWEsQ0FBQyxTQUFTLENBQUMsRUFBeEIsQ0FBd0IsQ0FBQyxDQUFDO1FBQzdELGlCQUFVLENBQ04sdUJBQXVCLEVBQUUsY0FBTyxDQUFDLGNBQU0sT0FBQSxvQkFBYSxDQUFDLFNBQVMsQ0FBQyxFQUF4QixDQUF3QixFQUFFLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDO1FBQzdGLGlCQUFVLENBQUMsbUJBQW1CLEVBQUUsY0FBTyxDQUFDLGNBQU0sT0FBQSxnQkFBUyxDQUFDLFNBQVMsQ0FBQyxFQUFwQixDQUFvQixFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ3JGLGlCQUFVLENBQ04sbUJBQW1CLEVBQ25CLGNBQU8sQ0FBQyxjQUFNLE9BQUEsZ0JBQVMsQ0FBQyxTQUFTLENBQUMsRUFBcEIsQ0FBb0IsRUFBRSxjQUFNLE9BQUEsaUJBQVUsQ0FBQyxTQUFTLENBQUMsRUFBckIsQ0FBcUIsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO0tBQ2pGO0FBQ0gsQ0FBQztBQWRELG9CQWNDIn0=