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
describe('ngComponentOutlet', function () {
    var URL = 'common/ngComponentOutlet/ts/';
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    describe('ng-component-outlet-example', function () {
        it('should render simple', function () {
            protractor_1.browser.get(URL);
            waitForElement('ng-component-outlet-simple-example');
            expect(protractor_1.element.all(protractor_1.by.css('hello-world')).getText()).toEqual(['Hello World!']);
        });
        it('should render complete', function () {
            protractor_1.browser.get(URL);
            waitForElement('ng-component-outlet-complete-example');
            expect(protractor_1.element.all(protractor_1.by.css('complete-component')).getText()).toEqual(['Complete: AhojSvet!']);
        });
        it('should render other module', function () {
            protractor_1.browser.get(URL);
            waitForElement('ng-component-outlet-other-module-example');
            expect(protractor_1.element.all(protractor_1.by.css('other-module-component')).getText()).toEqual([
                'Other Module Component!'
            ]);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdDb21wb25lbnRPdXRsZXRfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2V4YW1wbGVzL2NvbW1vbi9uZ0NvbXBvbmVudE91dGxldC90cy9lMmVfdGVzdC9uZ0NvbXBvbmVudE91dGxldF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgseUNBQXVFO0FBQ3ZFLHlEQUFtRTtBQUVuRSx3QkFBd0IsUUFBZ0I7SUFDdEMsSUFBTSxFQUFFLEdBQUcsK0JBQWtCLENBQUM7SUFDOUIsZ0VBQWdFO0lBQ2hFLG9CQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsY0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDbEQsQ0FBQztBQUVELFFBQVEsQ0FBQyxtQkFBbUIsRUFBRTtJQUM1QixJQUFNLEdBQUcsR0FBRyw4QkFBOEIsQ0FBQztJQUMzQyxTQUFTLENBQUMsZ0NBQXFCLENBQUMsQ0FBQztJQUVqQyxRQUFRLENBQUMsNkJBQTZCLEVBQUU7UUFDdEMsRUFBRSxDQUFDLHNCQUFzQixFQUFFO1lBQ3pCLG9CQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLGNBQWMsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO1lBQ3JELE1BQU0sQ0FBQyxvQkFBTyxDQUFDLEdBQUcsQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1FBQ2pGLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHdCQUF3QixFQUFFO1lBQzNCLG9CQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLGNBQWMsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1lBQ3ZELE1BQU0sQ0FBQyxvQkFBTyxDQUFDLEdBQUcsQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQztRQUMvRixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw0QkFBNEIsRUFBRTtZQUMvQixvQkFBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqQixjQUFjLENBQUMsMENBQTBDLENBQUMsQ0FBQztZQUMzRCxNQUFNLENBQUMsb0JBQU8sQ0FBQyxHQUFHLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3RFLHlCQUF5QjthQUMxQixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==