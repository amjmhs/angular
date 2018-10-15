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
function waitForElement(selector) {
    var EC = protractor_1.ExpectedConditions;
    // Waits for the element with id 'abc' to be present on the dom.
    protractor_1.browser.wait(EC.presenceOf(protractor_1.$(selector)), 20000);
}
describe('ngIf', function () {
    var URL = 'common/ngIf/ts/';
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    describe('ng-if-simple', function () {
        var comp = 'ng-if-simple';
        it('should hide/show content', function () {
            protractor_1.browser.get(URL);
            waitForElement(comp);
            expect(protractor_1.element.all(protractor_1.by.css(comp)).get(0).getText()).toEqual('hide show = true\nText to show');
            protractor_1.element(protractor_1.by.css(comp + ' button')).click();
            expect(protractor_1.element.all(protractor_1.by.css(comp)).get(0).getText()).toEqual('show show = false');
        });
    });
    describe('ng-if-else', function () {
        var comp = 'ng-if-else';
        it('should hide/show content', function () {
            protractor_1.browser.get(URL);
            waitForElement(comp);
            expect(protractor_1.element.all(protractor_1.by.css(comp)).get(0).getText()).toEqual('hide show = true\nText to show');
            protractor_1.element(protractor_1.by.css(comp + ' button')).click();
            expect(protractor_1.element.all(protractor_1.by.css(comp)).get(0).getText())
                .toEqual('show show = false\nAlternate text while primary text is hidden');
        });
    });
    describe('ng-if-then-else', function () {
        var comp = 'ng-if-then-else';
        it('should hide/show content', function () {
            protractor_1.browser.get(URL);
            waitForElement(comp);
            expect(protractor_1.element.all(protractor_1.by.css(comp)).get(0).getText())
                .toEqual('hideSwitch Primary show = true\nPrimary text to show');
            protractor_1.element.all(protractor_1.by.css(comp + ' button')).get(1).click();
            expect(protractor_1.element.all(protractor_1.by.css(comp)).get(0).getText())
                .toEqual('hideSwitch Primary show = true\nSecondary text to show');
            protractor_1.element.all(protractor_1.by.css(comp + ' button')).get(0).click();
            expect(protractor_1.element.all(protractor_1.by.css(comp)).get(0).getText())
                .toEqual('showSwitch Primary show = false\nAlternate text while primary text is hidden');
        });
    });
    describe('ng-if-let', function () {
        var comp = 'ng-if-let';
        it('should hide/show content', function () {
            protractor_1.browser.get(URL);
            waitForElement(comp);
            expect(protractor_1.element.all(protractor_1.by.css(comp)).get(0).getText())
                .toEqual('Next User\nWaiting... (user is null)');
            protractor_1.element(protractor_1.by.css(comp + ' button')).click();
            expect(protractor_1.element.all(protractor_1.by.css(comp)).get(0).getText()).toEqual('Next User\nHello Smith, John!');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdJZl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZXhhbXBsZXMvY29tbW9uL25nSWYvdHMvZTJlX3Rlc3QvbmdJZl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgseUNBQXVFO0FBQ3ZFLHlEQUFtRTtBQUVuRSx3QkFBd0IsUUFBZ0I7SUFDdEMsSUFBTSxFQUFFLEdBQUcsK0JBQWtCLENBQUM7SUFDOUIsZ0VBQWdFO0lBQ2hFLG9CQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsY0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDbEQsQ0FBQztBQUVELFFBQVEsQ0FBQyxNQUFNLEVBQUU7SUFDZixJQUFNLEdBQUcsR0FBRyxpQkFBaUIsQ0FBQztJQUM5QixTQUFTLENBQUMsZ0NBQXFCLENBQUMsQ0FBQztJQUVqQyxRQUFRLENBQUMsY0FBYyxFQUFFO1FBQ3ZCLElBQUksSUFBSSxHQUFHLGNBQWMsQ0FBQztRQUMxQixFQUFFLENBQUMsMEJBQTBCLEVBQUU7WUFDN0Isb0JBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDakIsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3JCLE1BQU0sQ0FBQyxvQkFBTyxDQUFDLEdBQUcsQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7WUFDN0Ysb0JBQU8sQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzFDLE1BQU0sQ0FBQyxvQkFBTyxDQUFDLEdBQUcsQ0FBQyxlQUFFLENB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