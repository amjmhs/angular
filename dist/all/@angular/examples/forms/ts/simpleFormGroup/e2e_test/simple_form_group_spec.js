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
describe('formControlName example', function () {
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    describe('index view', function () {
        var firstInput;
        var lastInput;
        beforeEach(function () {
            protractor_1.browser.get('/forms/ts/simpleFormGroup/index.html');
            firstInput = protractor_1.element(protractor_1.by.css('[formControlName="first"]'));
            lastInput = protractor_1.element(protractor_1.by.css('[formControlName="last"]'));
        });
        it('should populate the form control values in the DOM', function () {
            expect(firstInput.getAttribute('value')).toEqual('Nancy');
            expect(lastInput.getAttribute('value')).toEqual('Drew');
        });
        it('should show the error when the form is invalid', function () {
            firstInput.click();
            firstInput.clear();
            firstInput.sendKeys('a');
            expect(protractor_1.element(protractor_1.by.css('div')).getText()).toEqual('Name is too short.');
        });
        it('should set the value programmatically', function () {
            protractor_1.element(protractor_1.by.css('button:not([type="submit"])')).click();
            expect(firstInput.getAttribute('value')).toEqual('Carson');
            expect(lastInput.getAttribute('value')).toEqual('Drew');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltcGxlX2Zvcm1fZ3JvdXBfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2V4YW1wbGVzL2Zvcm1zL3RzL3NpbXBsZUZvcm1Hcm91cC9lMmVfdGVzdC9zaW1wbGVfZm9ybV9ncm91cF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgseUNBQStEO0FBQy9ELHlEQUFtRTtBQUVuRSxRQUFRLENBQUMseUJBQXlCLEVBQUU7SUFDbEMsU0FBUyxDQUFDLGdDQUFxQixDQUFDLENBQUM7SUFFakMsUUFBUSxDQUFDLFlBQVksRUFBRTtRQUNyQixJQUFJLFVBQXlCLENBQUM7UUFDOUIsSUFBSSxTQUF3QixDQUFDO1FBRTdCLFVBQVUsQ0FBQztZQUNULG9CQUFPLENBQUMsR0FBRyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7WUFDcEQsVUFBVSxHQUFHLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLENBQUM7WUFDMUQsU0FBUyxHQUFHLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUM7UUFDMUQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsb0RBQW9ELEVBQUU7WUFDdkQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDMUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsZ0RBQWdELEVBQUU7WUFDbkQsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ25CLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNuQixVQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRXpCLE1BQU0sQ0FBQyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQ3pFLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHVDQUF1QyxFQUFFO1lBQzFDLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDdkQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDM0QsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUQsQ0FBQyxDQUFDLENBQUM7SUFFTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=