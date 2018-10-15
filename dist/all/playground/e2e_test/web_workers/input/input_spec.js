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
describe('WebWorkers Input', function () {
    afterEach(function () {
        e2e_util_1.verifyNoBrowserErrors();
        protractor_1.browser.ignoreSynchronization = false;
    });
    var selector = 'input-app';
    var URL = 'all/playground/src/web_workers/input/index.html';
    var VALUE = 'test val';
    it('should bootstrap', function () {
        // This test can't wait for Angular as Testability is not available when using WebWorker
        protractor_1.browser.ignoreSynchronization = true;
        protractor_1.browser.get(URL);
        waitForBootstrap();
        var elem = protractor_1.element(protractor_1.by.css(selector + ' h2'));
        expect(elem.getText()).toEqual('Input App');
    });
    it('should bind to input value', function () {
        // This test can't wait for Angular as Testability is not available when using WebWorker
        protractor_1.browser.ignoreSynchronization = true;
        protractor_1.browser.get(URL);
        waitForBootstrap();
        var input = protractor_1.element(protractor_1.by.css(selector + ' input'));
        input.sendKeys(VALUE);
        var displayElem = protractor_1.element(protractor_1.by.css(selector + ' .input-val'));
        var expectedVal = "Input val is " + VALUE + ".";
        protractor_1.browser.wait(protractor_1.ExpectedConditions.textToBePresentInElement(displayElem, expectedVal), 5000);
        expect(displayElem.getText()).toEqual(expectedVal);
    });
    it('should bind to textarea value', function () {
        // This test can't wait for Angular as Testability is not available when using WebWorker
        protractor_1.browser.ignoreSynchronization = true;
        protractor_1.browser.get(URL);
        waitForBootstrap();
        var input = protractor_1.element(protractor_1.by.css(selector + ' textarea'));
        input.sendKeys(VALUE);
        var displayElem = protractor_1.element(protractor_1.by.css(selector + ' .textarea-val'));
        var expectedVal = "Textarea val is " + VALUE + ".";
        protractor_1.browser.wait(protractor_1.ExpectedConditions.textToBePresentInElement(displayElem, expectedVal), 5000);
        expect(displayElem.getText()).toEqual(expectedVal);
    });
    function waitForBootstrap() {
        protractor_1.browser.wait(protractor_1.protractor.until.elementLocated(protractor_1.by.css(selector + ' h2')), 5000)
            .then(function () {
            var elem = protractor_1.element(protractor_1.by.css(selector + ' h2'));
            protractor_1.browser.wait(protractor_1.protractor.ExpectedConditions.textToBePresentInElement(elem, 'Input App'), 5000);
        }, function () {
            // jasmine will timeout if this gets called too many times
            console.error('>> unexpected timeout -> browser.refresh()');
            protractor_1.browser.refresh();
            waitForBootstrap();
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXRfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvcGxheWdyb3VuZC9lMmVfdGVzdC93ZWJfd29ya2Vycy9pbnB1dC9pbnB1dF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsOENBQXdEO0FBQ3hELHlDQUFnRjtBQUdoRixRQUFRLENBQUMsa0JBQWtCLEVBQUU7SUFDM0IsU0FBUyxDQUFDO1FBQ1IsZ0NBQXFCLEVBQUUsQ0FBQztRQUN4QixvQkFBTyxDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQztJQUN4QyxDQUFDLENBQUMsQ0FBQztJQUNILElBQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQztJQUM3QixJQUFNLEdBQUcsR0FBRyxpREFBaUQsQ0FBQztJQUM5RCxJQUFNLEtBQUssR0FBRyxVQUFVLENBQUM7SUFFekIsRUFBRSxDQUFDLGtCQUFrQixFQUFFO1FBQ3JCLHdGQUF3RjtRQUN4RixvQkFBTyxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQztRQUNyQyxvQkFBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVqQixnQkFBZ0IsRUFBRSxDQUFDO1FBQ25CLElBQU0sSUFBSSxHQUFHLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUMvQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzlDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDRCQUE0QixFQUFFO1FBQy9CLHdGQUF3RjtRQUN4RixvQkFBTyxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQztRQUNyQyxvQkFBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVqQixnQkFBZ0IsRUFBRSxDQUFDO1FBQ25CLElB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