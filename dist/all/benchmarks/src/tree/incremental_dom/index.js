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
var patch = require('incremental-dom').patch;
function main() {
    var tree;
    function destroyDom() { tree.data = util_2.emptyTree; }
    function createDom() { tree.data = util_2.buildTree(); }
    function noop() { }
    function init() {
        tree = new tree_1.TreeComponent(document.querySelector('tree'));
        util_1.bindAction('#destroyDom', destroyDom);
        util_1.bindAction('#createDom', createDom);
        util_1.bindAction('#updateDomProfile', util_1.profile(createDom, noop, 'update'));
        util_1.bindAction('#createDomProfile', util_1.profile(createDom, destroyDom, 'create'));
    }
    init();
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2JlbmNobWFya3Mvc3JjL3RyZWUvaW5jcmVtZW50YWxfZG9tL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsbUNBQStDO0FBQy9DLGdDQUE2QztBQUM3QywrQkFBcUM7QUFDOUIsSUFBQSx3Q0FBSyxDQUErQjtBQUUzQztJQUNFLElBQUksSUFBbUIsQ0FBQztJQUV4Qix3QkFBd0IsSUFBSSxDQUFDLElBQUksR0FBRyxnQkFBUyxDQUFDLENBQUMsQ0FBQztJQUVoRCx1QkFBdUIsSUFBSSxDQUFDLElBQUksR0FBRyxnQkFBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRWpELGtCQUFpQixDQUFDO0lBRWxCO1FBQ0UsSUFBSSxHQUFHLElBQUksb0JBQWEsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFFekQsaUJBQVUsQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDdEMsaUJBQVUsQ0FBQyxZQUFZLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFcEMsaUJBQVUsQ0FBQyxtQkFBbUIsRUFBRSxjQUFPLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ3BFLGlCQUFVLENBQUMsbUJBQW1CLEVBQUUsY0FBTyxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBRUQsSUFBSSxFQUFFLENBQUM7QUFDVCxDQUFDO0FBcEJELG9CQW9CQyJ9