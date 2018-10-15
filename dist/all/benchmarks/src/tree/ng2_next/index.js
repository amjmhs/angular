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
var tree_1 = require("./tree");
function main() {
    var tree;
    var appMod;
    var detectChangesRuns = 0;
    function destroyDom() {
        tree.data = util_2.emptyTree;
        appMod.tick();
    }
    function createDom() {
        tree.data = util_2.buildTree();
        appMod.tick();
    }
    function detectChanges() {
        for (var i = 0; i < 10; i++) {
            appMod.tick();
        }
        detectChangesRuns += 10;
        numberOfChecksEl.textContent = "" + detectChangesRuns;
    }
    function noop() { }
    var numberOfChecksEl = document.getElementById('numberOfChecks');
    core_1.enableProdMode();
    appMod = new tree_1.AppModule();
    appMod.bootstrap();
    tree = appMod.componentRef.instance;
    util_1.bindAction('#destroyDom', destroyDom);
    util_1.bindAction('#createDom', createDom);
    util_1.bindAction('#detectChanges', detectChanges);
    util_1.bindAction('#detectChangesProfile', util_1.profile(detectChanges, noop, 'detectChanges'));
    util_1.bindAction('#updateDomProfile', util_1.profile(createDom, noop, 'update'));
    util_1.bindAction('#createDomProfile', util_1.profile(createDom, destroyDom, 'create'));
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2JlbmNobWFya3Mvc3JjL3RyZWUvbmcyX25leHQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxzQ0FBNkM7QUFFN0MsbUNBQStDO0FBQy9DLGdDQUE2QztBQUU3QywrQkFBZ0Q7QUFFaEQ7SUFDRSxJQUFJLElBQW1CLENBQUM7SUFDeEIsSUFBSSxNQUFpQixDQUFDO0lBQ3RCLElBQUksaUJBQWlCLEdBQUcsQ0FBQyxDQUFDO0lBRTFCO1FBQ0UsSUFBSSxDQUFDLElBQUksR0FBRyxnQkFBUyxDQUFDO1FBQ3RCLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQ7UUFDRSxJQUFJLENBQUMsSUFBSSxHQUFHLGdCQUFTLEVBQUUsQ0FBQztRQUN4QixNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVEO1FBQ0UsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMzQixNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDZjtRQUNELGlCQUFpQixJQUFJLEVBQUUsQ0FBQztRQUN4QixnQkFBZ0IsQ0FBQyxXQUFXLEdBQUcsS0FBRyxpQkFBbUIsQ0FBQztJQUN4RCxDQUFDO0lBRUQsa0JBQWlCLENBQUM7SUFFbEIsSUFBTSxnQkFBZ0IsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFFbkUscUJBQWMsRUFBRSxDQUFDO0lBQ2pCLE1BQU0sR0FBRyxJQUFJLGdCQUFTLEVBQUUsQ0FBQztJQUN6QixNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbkIsSUFBSSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDO0lBRXBDLGlCQUFVLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ3RDLGlCQUFVLENBQUMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3BDLGlCQUFVLENBQUMsZ0JBQWdCLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDNUMsaUJBQVUsQ0FBQyx1QkFBdUIsRUFBRSxjQUFPLENBQUMsYUFBYSxFQUFFLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDO0lBQ25GLGlCQUFVLENBQUMsbUJBQW1CLEVBQUUsY0FBTyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUNwRSxpQkFBVSxDQUFDLG1CQUFtQixFQUFFLGNBQU8sQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDNUUsQ0FBQztBQXRDRCxvQkFzQ0MifQ==