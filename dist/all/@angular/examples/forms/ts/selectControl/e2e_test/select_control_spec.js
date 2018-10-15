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
describe('selectControl example', function () {
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    var select;
    var options;
    var p;
    beforeEach(function () {
        protractor_1.browser.get('/forms/ts/selectControl/index.html');
        select = protractor_1.element(protractor_1.by.css('select'));
        options = protractor_1.element.all(protractor_1.by.css('option'));
        p = protractor_1.element(protractor_1.by.css('p'));
    });
    it('should initially select the placeholder option', function () { expect(options.get(0).getAttribute('selected')).toBe('true'); });
    it('should update the model when the value changes in the UI', function () {
        select.click();
        options.get(1).click();
        expect(p.getText()).toEqual('Form value: { "state": { "name": "Arizona", "abbrev": "AZ" } }');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0X2NvbnRyb2xfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2V4YW1wbGVzL2Zvcm1zL3RzL3NlbGVjdENvbnRyb2wvZTJlX3Rlc3Qvc2VsZWN0X2NvbnRyb2xfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHlDQUFtRjtBQUNuRix5REFBbUU7QUFFbkUsUUFBUSxDQUFDLHVCQUF1QixFQUFFO0lBQ2hDLFNBQVMsQ0FBQyxnQ0FBcUIsQ0FBQyxDQUFDO0lBQ2pDLElBQUksTUFBcUIsQ0FBQztJQUMxQixJQUFJLE9BQTJCLENBQUM7SUFDaEMsSUFBSSxDQUFnQixDQUFDO0lBRXJCLFVBQVUsQ0FBQztRQUNULG9CQUFPLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7UUFDbEQsTUFBTSxHQUFHLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ25DLE9BQU8sR0FBRyxvQkFBTyxDQUFDLEdBQUcsQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDeEMsQ0FBQyxHQUFHLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzNCLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGdEQUFnRCxFQUNoRCxjQUFRLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTVFLEVBQUUsQ0FBQywwREFBMEQsRUFBRTtRQUM3RCxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDZixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRXZCLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsZ0VBQWdFLENBQUMsQ0FBQztJQUNoRyxDQUFDLENBQUMsQ0FBQztBQUVMLENBQUMsQ0FBQyxDQUFDIn0=