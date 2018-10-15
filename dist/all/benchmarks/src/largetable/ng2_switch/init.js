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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvYmVuY2htYXJrcy9zcmMvbGFyZ2V0YWJsZS9uZzJfc3dpdGNoL2luaXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxzQ0FBMEQ7QUFFMUQsbUNBQStDO0FBQy9DLGdDQUErQztBQUkvQyxjQUFxQixTQUFpQztJQUNwRCxJQUFJLEtBQXFCLENBQUM7SUFDMUIsSUFBSSxNQUFzQixDQUFDO0lBRTNCO1FBQ0UsS0FBSyxDQUFDLElBQUksR0FBRyxpQkFBVSxDQUFDO1FBQ3hCLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQ7UUFDRSxLQUFLLENBQUMsSUFBSSxHQUFHLGlCQUFVLEVBQUUsQ0FBQztRQUMxQixNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVELGtCQUFpQixDQUFDO0lBRWxCLElBQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUM7SUFDcEMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMscUJBQWMsQ0FBQyxDQUFDO0lBRXRDLEtBQUssR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztJQUN0QyxpQkFBVSxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUN0QyxpQkFBVSxDQUFDLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNwQyxpQkFBVSxDQUFDLG1CQUFtQixFQUFFLGNBQU8sQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDcEUsaUJBQVUsQ0FBQyxtQkFBbUIsRUFBRSxjQUFPLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQzVFLENBQUM7QUF4QkQsb0JBd0JDIn0=