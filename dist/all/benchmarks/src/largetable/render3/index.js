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
var table_1 = require("./table");
function noop() { }
function main() {
    var component;
    if (typeof window !== 'undefined') {
        component = core_1.ɵrenderComponent(table_1.LargeTableComponent);
        util_1.bindAction('#createDom', function () { return table_1.createDom(component); });
        util_1.bindAction('#destroyDom', function () { return table_1.destroyDom(component); });
        util_1.bindAction('#updateDomProfile', util_1.profile(function () { return table_1.createDom(component); }, noop, 'update'));
        util_1.bindAction('#createDomProfile', util_1.profile(function () { return table_1.createDom(component); }, function () { return table_1.destroyDom(component); }, 'create'));
    }
}
exports.main = main;
var isBazel = location.pathname.indexOf('/all/') !== 0;
// isBazel needed while 'scripts/ci/test-e2e.sh test.e2e.protractor-e2e' is run
// on Travis
// TODO: port remaining protractor e2e tests to bazel protractor_web_test_suite rule
if (isBazel) {
    main();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2JlbmNobWFya3Mvc3JjL2xhcmdldGFibGUvcmVuZGVyMy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHNDQUFrRTtBQUVsRSxtQ0FBK0M7QUFFL0MsaUNBQW1FO0FBRW5FLGtCQUFpQixDQUFDO0FBRWxCO0lBQ0UsSUFBSSxTQUE4QixDQUFDO0lBQ25DLElBQUksT0FBTyxNQUFNLEtBQUssV0FBVyxFQUFFO1FBQ2pDLFNBQVMsR0FBRyx1QkFBZSxDQUFzQiwyQkFBbUIsQ0FBQyxDQUFDO1FBQ3RFLGlCQUFVLENBQUMsWUFBWSxFQUFFLGNBQU0sT0FBQSxpQkFBUyxDQUFDLFNBQVMsQ0FBQyxFQUFwQixDQUFvQixDQUFDLENBQUM7UUFDckQsaUJBQVUsQ0FBQyxhQUFhLEVBQUUsY0FBTSxPQUFBLGtCQUFVLENBQUMsU0FBUyxDQUFDLEVBQXJCLENBQXFCLENBQUMsQ0FBQztRQUN2RCxpQkFBVSxDQUFDLG1CQUFtQixFQUFFLGNBQU8sQ0FBQyxjQUFNLE9BQUEsaUJBQVMsQ0FBQyxTQUFTLENBQUMsRUFBcEIsQ0FBb0IsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUNyRixpQkFBVSxDQUNOLG1CQUFtQixFQUNuQixjQUFPLENBQUMsY0FBTSxPQUFBLGlCQUFTLENBQUMsU0FBUyxDQUFDLEVBQXBCLENBQW9CLEVBQUUsY0FBTSxPQUFBLGtCQUFVLENBQUMsU0FBUyxDQUFDLEVBQXJCLENBQXFCLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztLQUNqRjtBQUNILENBQUM7QUFYRCxvQkFXQztBQUVELElBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN6RCwrRUFBK0U7QUFDL0UsWUFBWTtBQUNaLG9GQUFvRjtBQUNwRixJQUFJLE9BQU8sRUFBRTtJQUNYLElBQUksRUFBRSxDQUFDO0NBQ1IifQ==