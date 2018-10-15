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
function main() {
    var rootEl = document.querySelector('binary-tree');
    function destroyDom() {
        while (rootEl.firstChild)
            rootEl.removeChild(rootEl.firstChild);
    }
    function createDom() {
        var flatTree = util_2.flattenTree(util_2.buildTree(), []);
        for (var i = 0; i < flatTree.length; i++) {
            var el = document.createElement('tree-leaf');
            el.data = flatTree[i];
            rootEl.appendChild(el);
        }
    }
    util_1.bindAction('#destroyDom', destroyDom);
    util_1.bindAction('#createDom', createDom);
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2JlbmNobWFya3Mvc3JjL3RyZWUvcG9seW1lcl9sZWF2ZXMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxtQ0FBc0M7QUFDdEMsZ0NBQStDO0FBSS9DO0lBQ0UsSUFBTSxNQUFNLEdBQVEsUUFBUSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUUxRDtRQUNFLE9BQU8sTUFBTSxDQUFDLFVBQVU7WUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRUQ7UUFDRSxJQUFNLFFBQVEsR0FBRyxrQkFBVyxDQUFDLGdCQUFTLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM5QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN4QyxJQUFNLEVBQUUsR0FBUSxRQUFRLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3BELEVBQUUsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDeEI7SUFDSCxDQUFDO0lBRUQsaUJBQVUsQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDdEMsaUJBQVUsQ0FBQyxZQUFZLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDdEMsQ0FBQztBQWxCRCxvQkFrQkMifQ==