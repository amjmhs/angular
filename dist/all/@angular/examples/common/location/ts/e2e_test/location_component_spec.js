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
    var EC = protractor_1.protractor.ExpectedConditions;
    // Waits for the element with id 'abc' to be present on the dom.
    protractor_1.browser.wait(EC.presenceOf(protractor_1.$(selector)), 20000);
}
describe('Location', function () {
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    it('should verify paths', function () {
        protractor_1.browser.get('/common/location/ts/#/bar/baz');
        waitForElement('hash-location');
        expect(protractor_1.element.all(protractor_1.by.css('path-location code')).get(0).getText())
            .toEqual('/common/location/ts');
        expect(protractor_1.element.all(protractor_1.by.css('hash-location code')).get(0).getText()).toEqual('/bar/baz');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYXRpb25fY29tcG9uZW50X3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9leGFtcGxlcy9jb21tb24vbG9jYXRpb24vdHMvZTJlX3Rlc3QvbG9jYXRpb25fY29tcG9uZW50X3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCx5Q0FBK0Q7QUFFL0QseURBQW1FO0FBR25FLHdCQUF3QixRQUFnQjtJQUN0QyxJQUFNLEVBQUUsR0FBUyx1QkFBVyxDQUFDLGtCQUFrQixDQUFDO0lBQ2hELGdFQUFnRTtJQUNoRSxvQkFBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLGNBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2xELENBQUM7QUFFRCxRQUFRLENBQUMsVUFBVSxFQUFFO0lBQ25CLFNBQVMsQ0FBQyxnQ0FBcUIsQ0FBQyxDQUFDO0lBRWpDLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRTtRQUN4QixvQkFBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1FBQzdDLGNBQWMsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUNoQyxNQUFNLENBQUMsb0JBQU8sQ0FBQyxHQUFHLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO2FBQzdELE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1FBQ3BDLE1BQU0sQ0FBQyxvQkFBTyxDQUFDLEdBQUcsQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDekYsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9