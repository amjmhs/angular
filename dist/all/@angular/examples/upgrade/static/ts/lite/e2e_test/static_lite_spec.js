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
var e2e_util_1 = require("../../../../../_common/e2e_util");
var e2e_util_2 = require("./e2e_util");
function loadPage() {
    protractor_1.browser.rootEl = 'example-app';
    protractor_1.browser.get('/upgrade/static/ts/lite/');
}
describe('upgrade/static (lite)', function () {
    var showHideBtn;
    var ng2Heroes;
    var ng2HeroesHeader;
    var ng2HeroesExtra;
    var ng2HeroesAddBtn;
    var ng1Heroes;
    var expectHeroes = function (isShown, ng1HeroCount, statusMessage) {
        if (ng1HeroCount === void 0) { ng1HeroCount = 3; }
        if (statusMessage === void 0) { statusMessage = 'Ready'; }
        // Verify the show/hide button text.
        expect(showHideBtn.getText()).toBe(isShown ? 'Hide heroes' : 'Show heroes');
        // Verify the `<ng2-heroes>` component.
        expect(ng2Heroes.isPresent()).toBe(isShown);
        if (isShown) {
            expect(ng2HeroesHeader.getText()).toBe('Heroes');
            expect(ng2HeroesExtra.getText()).toBe("Status: " + statusMessage);
        }
        // Verify the `<ng1-hero>` components.
        expect(ng1Heroes.count()).toBe(isShown ? ng1HeroCount : 0);
        if (isShown) {
            ng1Heroes.each(function (ng1Hero) { return expect(ng1Hero).toBeAHero(); });
        }
    };
    beforeEach(function () {
        showHideBtn = protractor_1.element(protractor_1.by.binding('toggleBtnText'));
        ng2Heroes = protractor_1.element(protractor_1.by.css('.ng2-heroes'));
        ng2HeroesHeader = ng2Heroes.element(protractor_1.by.css('h1'));
        ng2HeroesExtra = ng2Heroes.element(protractor_1.by.css('.extra'));
        ng2HeroesAddBtn = ng2Heroes.element(protractor_1.by.buttonText('Add Hero'));
        ng1Heroes = protractor_1.element.all(protractor_1.by.css('.ng1-hero'));
    });
    beforeEach(e2e_util_2.addCustomMatchers);
    beforeEach(loadPage);
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    it('should initially not render the heroes', function () { return expectHeroes(false); });
    it('should toggle the heroes when clicking the "show/hide" button', function () {
        showHideBtn.click();
        expectHeroes(true);
        showHideBtn.click();
        expectHeroes(false);
    });
    it('should add a new hero when clicking the "add" button', function () {
        showHideBtn.click();
        ng2HeroesAddBtn.click();
        expectHeroes(true, 4, 'Added hero Kamala Khan');
        expect(ng1Heroes.last()).toHaveName('Kamala Khan');
    });
    it('should remove a hero when clicking its "remove" button', function () {
        showHideBtn.click();
        var firstHero = ng1Heroes.first();
        expect(firstHero).toHaveName('Superman');
        var removeBtn = firstHero.element(protractor_1.by.buttonText('Remove'));
        removeBtn.click();
        expectHeroes(true, 2, 'Removed hero Superman');
        expect(ng1Heroes.first()).not.toHaveName('Superman');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljX2xpdGVfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2V4YW1wbGVzL3VwZ3JhZGUvc3RhdGljL3RzL2xpdGUvZTJlX3Rlc3Qvc3RhdGljX2xpdGVfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHlDQUFtRjtBQUVuRiw0REFBc0U7QUFDdEUsdUNBQTZDO0FBRTdDO0lBQ0Usb0JBQU8sQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDO0lBQy9CLG9CQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFDMUMsQ0FBQztBQUVELFFBQVEsQ0FBQyx1QkFBdUIsRUFBRTtJQUNoQyxJQUFJLFdBQTBCLENBQUM7SUFDL0IsSUFBSSxTQUF3QixDQUFDO0lBQzdCLElBQUksZUFBOEIsQ0FBQztJQUNuQyxJQUFJLGNBQTZCLENBQUM7SUFDbEMsSUFBSSxlQUE4QixDQUFDO0lBQ25DLElBQUksU0FBNkIsQ0FBQztJQUVsQyxJQUFNLFlBQVksR0FBRyxVQUFDLE9BQWdCLEVBQUUsWUFBZ0IsRUFBRSxhQUF1QjtRQUF6Qyw2QkFBQSxFQUFBLGdCQUFnQjtRQUFFLDhCQUFBLEVBQUEsdUJBQXVCO1FBQy9FLG9DQUFvQztRQUNwQyxNQUFNLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUU1RSx1Q0FBdUM7UUFDdkMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM1QyxJQUFJLE9BQU8sRUFBRTtZQUNYLE1BQU0sQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDakQsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFXLGFBQWUsQ0FBQyxDQUFDO1NBQ25FO1FBRUQsc0NBQXNDO1FBQ3RDLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNELElBQUksT0FBTyxFQUFFO1lBQ1gsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFBLE9BQU8sSUFBSSxPQUFBLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBM0IsQ0FBMkIsQ0FBQyxDQUFDO1NBQ3hEO0lBQ0gsQ0FBQyxDQUFDO0lBRUYsVUFBVSxDQUFDO1FBQ1QsV0FBVyxHQUFHLG9CQUFPLENBQUMsZUFBRSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1FBRW5ELFNBQVMsR0FBRyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUMzQyxlQUFlLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbEQsY0FBYyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ3JELGVBQWUsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGVBQUUsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUUvRCxTQUFTLEdBQUcsb0JBQU8sQ0FBQyxHQUFHLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0lBQy9DLENBQUMsQ0FBQyxDQUFDO0lBQ0gsVUFBVSxDQUFDLDRCQUFpQixDQUFDLENBQUM7SUFDOUIsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3JCLFNBQVMsQ0FBQyxnQ0FBcUIsQ0FBQyxDQUFDO0lBRWpDLEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRSxjQUFNLE9BQUEsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFuQixDQUFtQixDQUFDLENBQUM7SUFFeEUsRUFBRSxDQUFDLCtEQUErRCxFQUFFO1FBQ2xFLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNwQixZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFbkIsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3BCLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN0QixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxzREFBc0QsRUFBRTtRQUN6RCxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDcEIsZUFBZSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRXhCLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLHdCQUF3QixDQUFDLENBQUM7UUFDaEQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNyRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyx3REFBd0QsRUFBRTtRQUMzRCxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFcEIsSUFBTSxTQUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3BDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFekMsSUFBTSxTQUFTLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDN0QsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRWxCLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLHVCQUF1QixDQUFDLENBQUM7UUFDL0MsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDdkQsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9