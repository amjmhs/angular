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
describe('http', function () {
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    describe('fetching', function () {
        var URL = 'all/playground/src/http/index.html';
        it('should fetch and display people', function () {
            protractor_1.browser.get(URL);
            expect(getComponentText('http-app', '.people')).toEqual('hello, Jeff');
        });
    });
});
function getComponentText(selector, innerSelector) {
    return protractor_1.browser.executeScript("return document.querySelector(\"" + selector + "\").querySelector(\"" + innerSelector + "\").textContent.trim()");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cF9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9wbGF5Z3JvdW5kL2UyZV90ZXN0L2h0dHAvaHR0cF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsOENBQXdEO0FBQ3hELHlDQUFtQztBQUVuQyxRQUFRLENBQUMsTUFBTSxFQUFFO0lBRWYsU0FBUyxDQUFDLGdDQUFxQixDQUFDLENBQUM7SUFFakMsUUFBUSxDQUFDLFVBQVUsRUFBRTtRQUNuQixJQUFNLEdBQUcsR0FBRyxvQ0FBb0MsQ0FBQztRQUVqRCxFQUFFLENBQUMsaUNBQWlDLEVBQUU7WUFDcEMsb0JBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDakIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUN6RSxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCwwQkFBMEIsUUFBZ0IsRUFBRSxhQUFxQjtJQUMvRCxPQUFPLG9CQUFPLENBQUMsYUFBYSxDQUN4QixxQ0FBa0MsUUFBUSw0QkFBcUIsYUFBYSwyQkFBdUIsQ0FBQyxDQUFDO0FBQzNHLENBQUMifQ==