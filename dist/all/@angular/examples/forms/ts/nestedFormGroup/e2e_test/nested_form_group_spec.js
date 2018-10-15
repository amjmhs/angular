"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var e2e_util_1 = require("../../../../_common/e2e_util");
describe('nestedFormGroup example', function () {
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    var firstInput;
    var lastInput;
    var button;
    beforeEach(function () {
        protractor_1.browser.get('/forms/ts/nestedFormGroup/index.html');
        firstInput = protractor_1.element(protractor_1.by.css('[formControlName="first"]'));
        lastInput = protractor_1.element(protractor_1.by.css('[formControlName="last"]'));
        button = protractor_1.element(protractor_1.by.css('button:not([type="submit"])'));
    });
    it('should populate the UI with initial values', function () {
        expect(firstInput.getAttribute('value')).toEqual('Nancy');
        expect(lastInput.getAttribute('value')).toEqual('Drew');
    });
    it('should show the error when name is invalid', function () {
        firstInput.click();
        firstInput.clear();
        firstInput.sendKeys('a');
        expect(protractor_1.element(protractor_1.by.css('p')).getText()).toEqual('Name is invalid.');
    });
    it('should set the value programmatically', function () {
        button.click();
        expect(firstInput.getAttribute('value')).toEqual('Bess');
        expect(lastInput.getAttribute('value')).toEqual('Marvin');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmVzdGVkX2Zvcm1fZ3JvdXBfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2V4YW1wbGVzL2Zvcm1zL3RzL25lc3RlZEZvcm1Hcm91cC9lMmVfdGVzdC9uZXN0ZWRfZm9ybV9ncm91cF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgseUNBQStEO0FBQy9ELHlEQUFtRTtBQUVuRSxRQUFRLENBQUMseUJBQXlCLEVBQUU7SUFDbEMsU0FBUyxDQUFDLGdDQUFxQixDQUFDLENBQUM7SUFDakMsSUFBSSxVQUF5QixDQUFDO0lBQzlCLElBQUksU0FBd0IsQ0FBQztJQUM3QixJQUFJLE1BQXFCLENBQUM7SUFFMUIsVUFBVSxDQUFDO1FBQ1Qsb0JBQU8sQ0FBQyxHQUFHLENBQUMsc0NBQXNDLENBQUMsQ0FBQztRQUNwRCxVQUFVLEdBQUcsb0JBQU8sQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUMsQ0FBQztRQUMxRCxTQUFTLEdBQUcsb0JBQU8sQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUMsQ0FBQztRQUN4RCxNQUFNLEdBQUcsb0JBQU8sQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLDZCQUE2QixDQUFDLENBQUMsQ0FBQztJQUMxRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRTtRQUMvQyxNQUFNLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMxRCxNQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMxRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRTtRQUMvQyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDbkIsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ25CLFVBQVUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFekIsTUFBTSxDQUFDLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDckUsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsdUNBQXVDLEVBQUU7UUFDMUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2YsTUFBTSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDNUQsQ0FBQyxDQUFDLENBQUM7QUFFTCxDQUFDLENBQUMsQ0FBQyJ9