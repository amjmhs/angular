"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var platform_browser_1 = require("@angular/platform-browser");
var spies_1 = require("./spies");
{
    describe('profiler', function () {
        if (isNode)
            return;
        beforeEach(function () { platform_browser_1.enableDebugTools(new spies_1.SpyComponentRef()); });
        afterEach(function () { platform_browser_1.disableDebugTools(); });
        it('should time change detection', function () { spies_1.callNgProfilerTimeChangeDetection(); });
        it('should time change detection with recording', function () { spies_1.callNgProfilerTimeChangeDetection({ 'record': true }); });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHNfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLWJyb3dzZXIvdGVzdC9icm93c2VyL3Rvb2xzL3Rvb2xzX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw4REFBOEU7QUFFOUUsaUNBQTJFO0FBRTNFO0lBQ0UsUUFBUSxDQUFDLFVBQVUsRUFBRTtRQUNuQixJQUFJLE1BQU07WUFBRSxPQUFPO1FBQ25CLFVBQVUsQ0FBQyxjQUFRLG1DQUFnQixDQUFPLElBQUksdUJBQWUsRUFBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV0RSxTQUFTLENBQUMsY0FBUSxvQ0FBaUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFMUMsRUFBRSxDQUFDLDhCQUE4QixFQUFFLGNBQVEseUNBQWlDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRW5GLEVBQUUsQ0FBQyw2Q0FBNkMsRUFDN0MsY0FBUSx5Q0FBaUMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckUsQ0FBQyxDQUFDLENBQUM7Q0FDSiJ9