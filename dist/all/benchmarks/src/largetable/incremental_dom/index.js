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
function main() {
    var table;
    function destroyDom() { table.data = util_2.emptyTable; }
    function createDom() { table.data = util_2.buildTable(); }
    function noop() { }
    function init() {
        table = new table_1.TableComponent(document.querySelector('largetable'));
        util_1.bindAction('#destroyDom', destroyDom);
        util_1.bindAction('#createDom', createDom);
        util_1.bindAction('#updateDomProfile', util_1.profile(createDom, noop, 'update'));
        util_1.bindAction('#createDomProfile', util_1.profile(createDom, destroyDom, 'create'));
    }
    init();
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2JlbmNobWFya3Mvc3JjL2xhcmdldGFibGUvaW5jcmVtZW50YWxfZG9tL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsbUNBQStDO0FBQy9DLGdDQUErQztBQUMvQyxpQ0FBdUM7QUFFdkM7SUFDRSxJQUFJLEtBQXFCLENBQUM7SUFFMUIsd0JBQXdCLEtBQUssQ0FBQyxJQUFJLEdBQUcsaUJBQVUsQ0FBQyxDQUFDLENBQUM7SUFFbEQsdUJBQXVCLEtBQUssQ0FBQyxJQUFJLEdBQUcsaUJBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUVuRCxrQkFBaUIsQ0FBQztJQUVsQjtRQUNFLEtBQUssR0FBRyxJQUFJLHNCQUFjLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBRWpFLGlCQUFVLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3RDLGlCQUFVLENBQUMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRXBDLGlCQUFVLENBQUMsbUJBQW1CLEVBQUUsY0FBTyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUNwRSxpQkFBVSxDQUFDLG1CQUFtQixFQUFFLGNBQU8sQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUVELElBQUksRUFBRSxDQUFDO0FBQ1QsQ0FBQztBQXBCRCxvQkFvQkMifQ==