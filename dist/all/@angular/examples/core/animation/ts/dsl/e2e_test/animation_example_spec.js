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
function waitForElement(selector) {
    var EC = protractor_1.ExpectedConditions;
    // Waits for the element with id 'abc' to be present on the dom.
    protractor_1.browser.wait(EC.presenceOf(protractor_1.$(selector)), 20000);
}
describe('animation example', function () {
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    describe('index view', function () {
        var URL = '/core/animation/ts/dsl/';
        it('should list out the current collection of items', function () {
            protractor_1.browser.get(URL);
            waitForElement('.toggle-container');
            expect(protractor_1.element.all(protractor_1.by.css('.toggle-container')).get(0).getText()).toEqual('Look at this box');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX2V4YW1wbGVfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2V4YW1wbGVzL2NvcmUvYW5pbWF0aW9uL3RzL2RzbC9lMmVfdGVzdC9hbmltYXRpb25fZXhhbXBsZV9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgseUNBQXVFO0FBQ3ZFLDREQUFzRTtBQUV0RSx3QkFBd0IsUUFBZ0I7SUFDdEMsSUFBTSxFQUFFLEdBQUcsK0JBQWtCLENBQUM7SUFDOUIsZ0VBQWdFO0lBQ2hFLG9CQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsY0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDbEQsQ0FBQztBQUVELFFBQVEsQ0FBQyxtQkFBbUIsRUFBRTtJQUM1QixTQUFTLENBQUMsZ0NBQXFCLENBQUMsQ0FBQztJQUVqQyxRQUFRLENBQUMsWUFBWSxFQUFFO1FBQ3JCLElBQU0sR0FBRyxHQUFHLHlCQUF5QixDQUFDO1FBRXRDLEVBQUUsQ0FBQyxpREFBaUQsRUFBRTtZQUNwRCxvQkFBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqQixjQUFjLENBQUMsbUJBQW1CLENBQUMsQ0FBQztZQUNwQyxNQUFNLENBQUMsb0JBQU8sQ0FBQyxHQUFHLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDaEcsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=