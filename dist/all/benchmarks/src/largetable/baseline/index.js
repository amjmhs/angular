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
var table_1 = require("./table");
var table;
function destroyDom() {
    table.data = util_2.emptyTable;
}
function createDom() {
    table.data = util_2.buildTable();
}
function noop() { }
function init() {
    var rootEl = document.querySelector('largetable');
    rootEl.textContent = '';
    table = new table_1.TableComponent(rootEl);
    util_1.bindAction('#destroyDom', destroyDom);
    util_1.bindAction('#createDom', createDom);
    util_1.bindAction('#updateDomProfile', util_1.profile(createDom, noop, 'update'));
    util_1.bindAction('#createDomProfile', util_1.profile(createDom, destroyDom, 'create'));
}
init();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2JlbmNobWFya3Mvc3JjL2xhcmdldGFibGUvYmFzZWxpbmUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxtQ0FBK0M7QUFDL0MsZ0NBQStDO0FBQy9DLGlDQUF1QztBQUV2QyxJQUFJLEtBQXFCLENBQUM7QUFFMUI7SUFDRSxLQUFLLENBQUMsSUFBSSxHQUFHLGlCQUFVLENBQUM7QUFDMUIsQ0FBQztBQUVEO0lBQ0UsS0FBSyxDQUFDLElBQUksR0FBRyxpQkFBVSxFQUFFLENBQUM7QUFDNUIsQ0FBQztBQUVELGtCQUFpQixDQUFDO0FBRWxCO0lBQ0UsSUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNwRCxNQUFNLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztJQUN4QixLQUFLLEdBQUcsSUFBSSxzQkFBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRW5DLGlCQUFVLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ3RDLGlCQUFVLENBQUMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBRXBDLGlCQUFVLENBQUMsbUJBQW1CLEVBQUUsY0FBTyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUNwRSxpQkFBVSxDQUFDLG1CQUFtQixFQUFFLGNBQU8sQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDNUUsQ0FBQztBQUVELElBQUksRUFBRSxDQUFDIn0=