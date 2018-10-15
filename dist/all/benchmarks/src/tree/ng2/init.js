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
    var detectChangesRuns = 0;
    function destroyDom() {
        tree.data = util_2.emptyTree;
        appRef.tick();
    }
    function createDom() {
        tree.data = util_2.buildTree();
        appRef.tick();
    }
    function detectChanges() {
        for (var i = 0; i < 10; i++) {
            appRef.tick();
        }
        detectChangesRuns += 10;
        numberOfChecksEl.textContent = "" + detectChangesRuns;
    }
    function noop() { }
    var injector = moduleRef.injector;
    appRef = injector.get(core_1.ApplicationRef);
    var numberOfChecksEl = document.getElementById('numberOfChecks');
    tree = appRef.components[0].instance;
    util_1.bindAction('#destroyDom', destroyDom);
    util_1.bindAction('#createDom', createDom);
    util_1.bindAction('#detectChanges', detectChanges);
    util_1.bindAction('#detectChangesProfile', util_1.profile(detectChanges, noop, 'detectChanges'));
    util_1.bindAction('#updateDomProfile', util_1.profile(createDom, noop, 'update'));
    util_1.bindAction('#createDomProfile', util_1.profile(createDom, destroyDom, 'create'));
}
exports.init = init;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvYmVuY2htYXJrcy9zcmMvdHJlZS9uZzIvaW5pdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHNDQUEwRDtBQUUxRCxtQ0FBK0M7QUFDL0MsZ0NBQTZDO0FBSTdDLGNBQXFCLFNBQWlDO0lBQ3BELElBQUksSUFBbUIsQ0FBQztJQUN4QixJQUFJLE1BQXNCLENBQUM7SUFDM0IsSUFBSSxpQkFBaUIsR0FBRyxDQUFDLENBQUM7SUFFMUI7UUFDRSxJQUFJLENBQUMsSUFBSSxHQUFHLGdCQUFTLENBQUM7UUFDdEIsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFFRDtRQUNFLElBQUksQ0FBQyxJQUFJLEdBQUcsZ0JBQVMsRUFBRSxDQUFDO1FBQ3hCLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQ7UUFDRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzNCLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNmO1FBQ0QsaUJBQWlCLElBQUksRUFBRSxDQUFDO1FBQ3hCLGdCQUFnQixDQUFDLFdBQVcsR0FBRyxLQUFHLGlCQUFtQixDQUFDO0lBQ3hELENBQUM7SUFFRCxrQkFBaUIsQ0FBQztJQUVsQixJQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDO0lBQ3BDLE1BQU0sR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLHFCQUFjLENBQUMsQ0FBQztJQUN0QyxJQUFNLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUcsQ0FBQztJQUVyRSxJQUFJLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7SUFFckMsaUJBQVUsQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDdEMsaUJBQVUsQ0FBQyxZQUFZLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDcEMsaUJBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUM1QyxpQkFBVSxDQUFDLHVCQUF1QixFQUFFLGNBQU8sQ0FBQyxhQUFhLEVBQUUsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUM7SUFDbkYsaUJBQVUsQ0FBQyxtQkFBbUIsRUFBRSxjQUFPLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ3BFLGlCQUFVLENBQUMsbUJBQW1CLEVBQUUsY0FBTyxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUM1RSxDQUFDO0FBckNELG9CQXFDQyJ9