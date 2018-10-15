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
describe('ngTemplateOutlet', function () {
    var URL = 'common/ngTemplateOutlet/ts/';
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    describe('ng-template-outlet-example', function () {
        it('should render', function () {
            protractor_1.browser.get(URL);
            waitForElement('ng-template-outlet-example');
            expect(protractor_1.element.all(protractor_1.by.css('ng-template-outlet-example span')).getText()).toEqual([
                'Hello', 'Hello World!', 'Ahoj Svet!'
            ]);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdUZW1wbGF0ZU91dGxldF9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZXhhbXBsZXMvY29tbW9uL25nVGVtcGxhdGVPdXRsZXQvdHMvZTJlX3Rlc3QvbmdUZW1wbGF0ZU91dGxldF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgseUNBQXVFO0FBQ3ZFLHlEQUFtRTtBQUVuRSx3QkFBd0IsUUFBZ0I7SUFDdEMsSUFBTSxFQUFFLEdBQUcsK0JBQWtCLENBQUM7SUFDOUIsZ0VBQWdFO0lBQ2hFLG9CQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsY0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDbEQsQ0FBQztBQUVELFFBQVEsQ0FBQyxrQkFBa0IsRUFBRTtJQUMzQixJQUFNLEdBQUcsR0FBRyw2QkFBNkIsQ0FBQztJQUMxQyxTQUFTLENBQUMsZ0NBQXFCLENBQUMsQ0FBQztJQUVqQyxRQUFRLENBQUMsNEJBQTRCLEVBQUU7UUFDckMsRUFBRSxDQUFDLGVBQWUsRUFBRTtZQUNsQixvQkFBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqQixjQUFjLENBQUMsNEJBQTRCLENBQUMsQ0FBQztZQUM3QyxNQUFNLENBQUMsb0JBQU8sQ0FBQyxHQUFHLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQy9FLE9BQU8sRUFBRSxjQUFjLEVBQUUsWUFBWTthQUN0QyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==