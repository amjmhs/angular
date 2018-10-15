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
describe('hello world', function () {
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    describe('hello world app', function () {
        var URL = 'all/playground/src/hello_world/index.html';
        it('should greet', function () {
            protractor_1.browser.get(URL);
            expect(getComponentText('hello-app', '.greeting')).toEqual('hello world!');
        });
        it('should change greeting', function () {
            protractor_1.browser.get(URL);
            clickComponentButton('hello-app', '.changeButton');
            expect(getComponentText('hello-app', '.greeting')).toEqual('howdy world!');
        });
    });
});
function getComponentText(selector, innerSelector) {
    return protractor_1.browser.executeScript("return document.querySelector(\"" + selector + "\").querySelector(\"" + innerSelector + "\").textContent");
}
function clickComponentButton(selector, innerSelector) {
    return protractor_1.browser.executeScript("return document.querySelector(\"" + selector + "\").querySelector(\"" + innerSelector + "\").click()");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVsbG9fd29ybGRfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL21vZHVsZXMvcGxheWdyb3VuZC9lMmVfdGVzdC9oZWxsb193b3JsZC9oZWxsb193b3JsZF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsOENBQXdEO0FBQ3hELHlDQUFtQztBQUVuQyxRQUFRLENBQUMsYUFBYSxFQUFFO0lBRXRCLFNBQVMsQ0FBQyxnQ0FBcUIsQ0FBQyxDQUFDO0lBRWpDLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtRQUMxQixJQUFNLEdBQUcsR0FBRywyQ0FBMkMsQ0FBQztRQUV4RCxFQUFFLENBQUMsY0FBYyxFQUFFO1lBQ2pCLG9CQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRWpCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDN0UsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsd0JBQXdCLEVBQUU7WUFDM0Isb0JBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFakIsb0JBQW9CLENBQUMsV0FBVyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBQ25ELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDN0UsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUVMLENBQUMsQ0FBQyxDQUFDO0FBRUgsMEJBQTBCLFFBQWdCLEVBQUUsYUFBcUI7SUFDL0QsT0FBTyxvQkFBTyxDQUFDLGFBQWEsQ0FDeEIscUNBQWtDLFFBQVEsNEJBQXFCLGFBQWEsb0JBQWdCLENBQUMsQ0FBQztBQUNwRyxDQUFDO0FBRUQsOEJBQThCLFFBQWdCLEVBQUUsYUFBcUI7SUFDbkUsT0FBTyxvQkFBTyxDQUFDLGFBQWEsQ0FDeEIscUNBQWtDLFFBQVEsNEJBQXFCLGFBQWEsZ0JBQVksQ0FBQyxDQUFDO0FBQ2hHLENBQUMifQ==