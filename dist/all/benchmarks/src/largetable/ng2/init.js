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
var util_2 = require("../util");
function init(moduleRef) {
    var table;
    var appRef;
    function destroyDom() {
        table.data = util_2.emptyTable;
        appRef.tick();
    }
    function createDom() {
        table.data = util_2.buildTable();
        appRef.tick();
    }
    function noop() { }
    var injector = moduleRef.injector;
    appRef = injector.get(core_1.ApplicationRef);
    table = appRef.components[0].instance;
    util_1.bindAction('#destroyDom', destroyDom);
    util_1.bindAction('#createDom', createDom);
    util_1.bindAction('#updateDomProfile', util_1.profile(createDom, noop, 'update'));
    util_1.bindAction('#createDomProfile', util_1.profile(createDom, destroyDom, 'create'));
}
exports.init = init;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvYmVuY2htYXJrcy9zcmMvbGFyZ2V0YWJsZS9uZzIvaW5pdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHNDQUEwRDtBQUUxRCxtQ0FBK0M7QUFDL0MsZ0NBQStDO0FBSS9DLGNBQXFCLFNBQWlDO0lBQ3BELElBQUksS0FBcUIsQ0FBQztJQUMxQixJQUFJLE1BQXNCLENBQUM7SUFFM0I7UUFDRSxLQUFLLENBQUMsSUFBSSxHQUFHLGlCQUFVLENBQUM7UUFDeEIsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFFRDtRQUNFLEtBQUssQ0FBQyxJQUFJLEdBQUcsaUJBQVUsRUFBRSxDQUFDO1FBQzFCLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQsa0JBQWlCLENBQUM7SUFFbEIsSUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQztJQUNwQyxNQUFNLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxxQkFBYyxDQUFDLENBQUM7SUFFdEMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO0lBQ3RDLGlCQUFVLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ3RDLGlCQUFVLENBQUMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3BDLGlCQUFVLENBQUMsbUJBQW1CLEVBQUUsY0FBTyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUNwRSxpQkFBVSxDQUFDLG1CQUFtQixFQUFFLGNBQU8sQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDNUUsQ0FBQztBQXhCRCxvQkF3QkMifQ==