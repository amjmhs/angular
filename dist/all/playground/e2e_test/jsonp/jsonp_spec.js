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
describe('jsonp', function () {
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    describe('fetching', function () {
        var URL = 'all/playground/src/jsonp/index.html';
        it('should fetch and display people', function () {
            protractor_1.browser.get(URL);
            expect(getComponentText('jsonp-app', '.people')).toEqual('hello, caitp');
        });
    });
});
function getComponentText(selector, innerSelector) {
    return protractor_1.browser.executeScript("return document.querySelector(\"" + selector + "\").querySelector(\"" + innerSelector + "\").textContent.trim()");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbnBfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL21vZHVsZXMvcGxheWdyb3VuZC9lMmVfdGVzdC9qc29ucC9qc29ucF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsOENBQXdEO0FBQ3hELHlDQUFtQztBQUVuQyxRQUFRLENBQUMsT0FBTyxFQUFFO0lBRWhCLFNBQVMsQ0FBQyxnQ0FBcUIsQ0FBQyxDQUFDO0lBRWpDLFFBQVEsQ0FBQyxVQUFVLEVBQUU7UUFDbkIsSUFBTSxHQUFHLEdBQUcscUNBQXFDLENBQUM7UUFFbEQsRUFBRSxDQUFDLGlDQUFpQyxFQUFFO1lBQ3BDLG9CQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDM0UsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsMEJBQTBCLFFBQWdCLEVBQUUsYUFBcUI7SUFDL0QsT0FBTyxvQkFBTyxDQUFDLGFBQWEsQ0FDeEIscUNBQWtDLFFBQVEsNEJBQXFCLGFBQWEsMkJBQXVCLENBQUMsQ0FBQztBQUMzRyxDQUFDIn0=