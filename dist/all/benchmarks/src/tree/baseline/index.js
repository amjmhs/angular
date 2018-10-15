"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../util");
var util_2 = require("../util");
var tree_1 = require("./tree");
var tree;
function destroyDom() {
    tree.data = util_2.emptyTree;
}
function createDom() {
    tree.data = util_2.buildTree();
}
function noop() { }
function init() {
    var rootEl = document.querySelector('tree');
    rootEl.textContent = '';
    tree = new tree_1.TreeComponent(rootEl);
    util_1.bindAction('#destroyDom', destroyDom);
    util_1.bindAction('#createDom', createDom);
    util_1.bindAction('#updateDomProfile', util_1.profile(createDom, noop, 'update'));
    util_1.bindAction('#createDomProfile', util_1.profile(createDom, destroyDom, 'create'));
}
init();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2JlbmNobWFya3Mvc3JjL3RyZWUvYmFzZWxpbmUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxtQ0FBK0M7QUFDL0MsZ0NBQTZDO0FBQzdDLCtCQUFxQztBQUVyQyxJQUFJLElBQW1CLENBQUM7QUFFeEI7SUFDRSxJQUFJLENBQUMsSUFBSSxHQUFHLGdCQUFTLENBQUM7QUFDeEIsQ0FBQztBQUVEO0lBQ0UsSUFBSSxDQUFDLElBQUksR0FBRyxnQkFBUyxFQUFFLENBQUM7QUFDMUIsQ0FBQztBQUVELGtCQUFpQixDQUFDO0FBRWxCO0lBQ0UsSUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM5QyxNQUFNLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztJQUN4QixJQUFJLEdBQUcsSUFBSSxvQkFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRWpDLGlCQUFVLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ3RDLGlCQUFVLENBQUMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBRXBDLGlCQUFVLENBQUMsbUJBQW1CLEVBQUUsY0FBTyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUNwRSxpQkFBVSxDQUFDLG1CQUFtQixFQUFFLGNBQU8sQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDNUUsQ0FBQztBQUVELElBQUksRUFBRSxDQUFDIn0=