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
    var tree;
    var appRef;
    function destroyDom() {
        tree.data = util_2.emptyTree;
        appRef.tick();
    }
    function createDom() {
        tree.data = util_2.buildTree();
        appRef.tick();
    }
    function noop() { }
    var injector = moduleRef.injector;
    appRef = injector.get(core_1.ApplicationRef);
    tree = appRef.components[0].instance;
    util_1.bindAction('#destroyDom', destroyDom);
    util_1.bindAction('#createDom', createDom);
    util_1.bindAction('#updateDomProfile', util_1.profile(createDom, noop, 'update'));
    util_1.bindAction('#createDomProfile', util_1.profile(createDom, destroyDom, 'create'));
}
exports.init = init;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvYmVuY2htYXJrcy9zcmMvdHJlZS9uZzJfc3dpdGNoL2luaXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxzQ0FBMEQ7QUFFMUQsbUNBQStDO0FBQy9DLGdDQUE2QztBQUk3QyxjQUFxQixTQUFpQztJQUNwRCxJQUFJLElBQW1CLENBQUM7SUFDeEIsSUFBSSxNQUFzQixDQUFDO0lBRTNCO1FBQ0UsSUFBSSxDQUFDLElBQUksR0FBRyxnQkFBUyxDQUFDO1FBQ3RCLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQ7UUFDRSxJQUFJLENBQUMsSUFBSSxHQUFHLGdCQUFTLEVBQUUsQ0FBQztRQUN4QixNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVELGtCQUFpQixDQUFDO0lBRWxCLElBQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUM7SUFDcEMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMscUJBQWMsQ0FBQyxDQUFDO0lBRXRDLElBQUksR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztJQUNyQyxpQkFBVSxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUN0QyxpQkFBVSxDQUFDLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNwQyxpQkFBVSxDQUFDLG1CQUFtQixFQUFFLGNBQU8sQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDcEUsaUJBQVUsQ0FBQyxtQkFBbUIsRUFBRSxjQUFPLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQzVFLENBQUM7QUF4QkQsb0JBd0JDIn0=