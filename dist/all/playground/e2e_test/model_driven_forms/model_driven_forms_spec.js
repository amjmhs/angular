"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var e2e_util_1 = require("e2e_util/e2e_util");
var protractor_1 = require("protractor");
describe('Model-Driven Forms', function () {
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    var URL = 'all/playground/src/model_driven_forms/index.html';
    it('should display errors', function () {
        protractor_1.browser.get(URL);
        var form = protractor_1.element.all(protractor_1.by.css('form')).first();
        var input = protractor_1.element.all(protractor_1.by.css('#creditCard')).first();
        var firstName = protractor_1.element.all(protractor_1.by.css('#firstName')).first();
        input.sendKeys('invalid');
        firstName.click();
        expect(form.getAttribute('innerHTML')).toContain('is invalid credit card number');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWxfZHJpdmVuX2Zvcm1zX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3BsYXlncm91bmQvZTJlX3Rlc3QvbW9kZWxfZHJpdmVuX2Zvcm1zL21vZGVsX2RyaXZlbl9mb3Jtc19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsOENBQXdEO0FBQ3hELHlDQUFnRDtBQUVoRCxRQUFRLENBQUMsb0JBQW9CLEVBQUU7SUFFN0IsU0FBUyxDQUFDLGdDQUFxQixDQUFDLENBQUM7SUFFakMsSUFBTSxHQUFHLEdBQUcsa0RBQWtELENBQUM7SUFFL0QsRUFBRSxDQUFDLHVCQUF1QixFQUFFO1FBQzFCLG9CQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWpCLElBQU0sSUFBSSxHQUFHLG9CQUFPLENBQUMsR0FBRyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNqRCxJQUFNLEtBQUssR0FBRyxvQkFBTyxDQUFDLEdBQUcsQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDekQsSUFBTSxTQUFTLEdBQUcsb0JBQU8sQ0FBQyxHQUFHLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRTVELEtBQUssQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDMUIsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRWxCLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLCtCQUErQixDQUFDLENBQUM7SUFDcEYsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9