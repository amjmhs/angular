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
function waitForElement(selector) {
    // Waits for the element with id 'abc' to be present on the dom.
    protractor_1.browser.wait(protractor_1.ExpectedConditions.presenceOf(protractor_1.$(selector)), 20000);
}
describe('relative assets relative-app', function () {
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    var URL = 'all/playground/src/relative_assets/';
    it('should load in the templateUrl relative to the my-cmp component', function () {
        protractor_1.browser.get(URL);
        waitForElement('my-cmp .inner-container');
        expect(protractor_1.element.all(protractor_1.by.css('my-cmp .inner-container')).count()).toEqual(1);
    });
    it('should load in the styleUrls relative to the my-cmp component', function () {
        protractor_1.browser.get(URL);
        waitForElement('my-cmp .inner-container');
        var elem = protractor_1.element(protractor_1.by.css('my-cmp .inner-container'));
        var width = protractor_1.browser.executeScript(function (e) { return parseInt(window.getComputedStyle(e).width); }, elem.getWebElement());
        expect(width).toBe(432);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXRzX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3BsYXlncm91bmQvZTJlX3Rlc3QvcmVsYXRpdmVfYXNzZXRzL2Fzc2V0c19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsOENBQXdEO0FBQ3hELHlDQUF1RTtBQUV2RSx3QkFBd0IsUUFBZ0I7SUFDdEMsZ0VBQWdFO0lBQ2hFLG9CQUFPLENBQUMsSUFBSSxDQUFDLCtCQUFrQixDQUFDLFVBQVUsQ0FBQyxjQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNsRSxDQUFDO0FBRUQsUUFBUSxDQUFDLDhCQUE4QixFQUFFO0lBRXZDLFNBQVMsQ0FBQyxnQ0FBcUIsQ0FBQyxDQUFDO0lBRWpDLElBQU0sR0FBRyxHQUFHLHFDQUFxQyxDQUFDO0lBRWxELEVBQUUsQ0FBQyxpRUFBaUUsRUFBRTtRQUNwRSxvQkFBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVqQixjQUFjLENBQUMseUJBQXlCLENBQUMsQ0FBQztRQUMxQyxNQUFNLENBQUMsb0JBQU8sQ0FBQyxHQUFHLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUUsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsK0RBQStELEVBQUU7UUFDbEUsb0JBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFakIsY0FBYyxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFDMUMsSUFBTSxJQUFJLEdBQUcsb0JBQU8sQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQztRQUN4RCxJQUFNLEtBQUssR0FBRyxvQkFBTyxDQUFDLGFBQWEsQ0FDL0IsVUFBQyxDQUFVLElBQUssT0FBQSxRQUFRLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUExQyxDQUEwQyxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO1FBRXRGLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDMUIsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9