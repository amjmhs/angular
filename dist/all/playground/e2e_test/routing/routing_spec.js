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
describe('routing inbox-app', function () {
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    describe('index view', function () {
        var URL = 'all/playground/src/routing/';
        it('should list out the current collection of items', function () {
            protractor_1.browser.get(URL);
            waitForElement('.inbox-item-record');
            expect(protractor_1.element.all(protractor_1.by.css('.inbox-item-record')).count()).toEqual(200);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGluZ19zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9wbGF5Z3JvdW5kL2UyZV90ZXN0L3JvdXRpbmcvcm91dGluZ19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsOENBQXdEO0FBQ3hELHlDQUF1RTtBQUV2RSx3QkFBd0IsUUFBZ0I7SUFDdEMsZ0VBQWdFO0lBQ2hFLG9CQUFPLENBQUMsSUFBSSxDQUFDLCtCQUFrQixDQUFDLFVBQVUsQ0FBQyxjQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNsRSxDQUFDO0FBRUQsUUFBUSxDQUFDLG1CQUFtQixFQUFFO0lBRTVCLFNBQVMsQ0FBQyxnQ0FBcUIsQ0FBQyxDQUFDO0lBRWpDLFFBQVEsQ0FBQyxZQUFZLEVBQUU7UUFDckIsSUFBTSxHQUFHLEdBQUcsNkJBQTZCLENBQUM7UUFFMUMsRUFBRSxDQUFDLGlEQUFpRCxFQUFFO1lBQ3BELG9CQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBQ3JDLE1BQU0sQ0FBQyxvQkFBTyxDQUFDLEdBQUcsQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN6RSxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==