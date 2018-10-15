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
    rootEl.data = util_2.emptyTree;
    function destroyDom() { rootEl.data = util_2.emptyTree; }
    function createDom() { rootEl.data = util_2.buildTree(); }
    function noop() { }
    util_1.bindAction('#destroyDom', destroyDom);
    util_1.bindAction('#createDom', createDom);
    util_1.bindAction('#updateDomProfile', util_1.profile(createDom, noop, 'update'));
    util_1.bindAction('#createDomProfile', util_1.profile(createDom, destroyDom, 'create'));
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2JlbmNobWFya3Mvc3JjL3RyZWUvcG9seW1lci9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILG1DQUErQztBQUMvQyxnQ0FBNkM7QUFJN0M7SUFDRSxJQUFNLE1BQU0sR0FBUSxRQUFRLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQzFELE1BQU0sQ0FBQyxJQUFJLEdBQUcsZ0JBQVMsQ0FBQztJQUV4Qix3QkFBd0IsTUFBTSxDQUFDLElBQUksR0FBRyxnQkFBUyxDQUFDLENBQUMsQ0FBQztJQUVsRCx1QkFBdUIsTUFBTSxDQUFDLElBQUksR0FBRyxnQkFBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRW5ELGtCQUFpQixDQUFDO0lBRWxCLGlCQUFVLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ3RDLGlCQUFVLENBQUMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBRXBDLGlCQUFVLENBQUMsbUJBQW1CLEVBQUUsY0FBTyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUNwRSxpQkFBVSxDQUFDLG1CQUFtQixFQUFFLGNBQU8sQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDNUUsQ0FBQztBQWZELG9CQWVDIn0=