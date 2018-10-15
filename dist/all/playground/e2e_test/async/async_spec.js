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
describe('async', function () {
    var URL = 'all/playground/src/async/index.html';
    beforeEach(function () { return protractor_1.browser.get(URL); });
    it('should work with synchronous actions', function () {
        var increment = protractor_1.$('#increment');
        increment.$('.action').click();
        expect(increment.$('.val').getText()).toEqual('1');
    });
    it('should wait for asynchronous actions', function () {
        var timeout = protractor_1.$('#delayedIncrement');
        // At this point, the async action is still pending, so the count should
        // still be 0.
        expect(timeout.$('.val').getText()).toEqual('0');
        timeout.$('.action').click();
        // whenStable should only be called when the async action finished,
        // so the count should be 1 at this point.
        expect(timeout.$('.val').getText()).toEqual('1');
    });
    it('should notice when asynchronous actions are cancelled', function () {
        var timeout = protractor_1.$('#delayedIncrement');
        // At this point, the async action is still pending, so the count should
        // still be 0.
        expect(timeout.$('.val').getText()).toEqual('0');
        protractor_1.browser.ignoreSynchronization = true;
        timeout.$('.action').click();
        timeout.$('.cancel').click();
        protractor_1.browser.ignoreSynchronization = false;
        // whenStable should be called since the async action is cancelled. The
        // count should still be 0;
        expect(timeout.$('.val').getText()).toEqual('0');
    });
    it('should wait for a series of asynchronous actions', function () {
        var timeout = protractor_1.$('#multiDelayedIncrements');
        // At this point, the async action is still pending, so the count should
        // still be 0.
        expect(timeout.$('.val').getText()).toEqual('0');
        timeout.$('.action').click();
        // whenStable should only be called when all the async actions
        // finished, so the count should be 10 at this point.
        expect(timeout.$('.val').getText()).toEqual('10');
    });
    it('should wait via frameworkStabilizer', function () {
        var whenAllStable = function () {
            return protractor_1.browser.executeAsyncScript('window.frameworkStabilizers[0](arguments[0]);');
        };
        // This disables protractor's wait mechanism
        protractor_1.browser.ignoreSynchronization = true;
        var timeout = protractor_1.$('#multiDelayedIncrements');
        // At this point, the async action is still pending, so the count should
        // still be 0.
        expect(timeout.$('.val').getText()).toEqual('0');
        timeout.$('.action').click();
        whenAllStable().then(function (didWork) {
            // whenAllStable should only be called when all the async actions
            // finished, so the count should be 10 at this point.
            expect(timeout.$('.val').getText()).toEqual('10');
            expect(didWork).toBeTruthy(); // Work was done.
        });
        whenAllStable().then(function (didWork) {
            // whenAllStable should be called immediately since nothing is pending.
            expect(didWork).toBeFalsy(); // No work was done.
            protractor_1.browser.ignoreSynchronization = false;
        });
    });
    afterEach(e2e_util_1.verifyNoBrowserErrors);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN5bmNfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL21vZHVsZXMvcGxheWdyb3VuZC9lMmVfdGVzdC9hc3luYy9hc3luY19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsOENBQXdEO0FBQ3hELHlDQUFzQztBQUd0QyxRQUFRLENBQUMsT0FBTyxFQUFFO0lBQ2hCLElBQU0sR0FBRyxHQUFHLHFDQUFxQyxDQUFDO0lBRWxELFVBQVUsQ0FBQyxjQUFNLE9BQUEsb0JBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQWhCLENBQWdCLENBQUMsQ0FBQztJQUVuQyxFQUFFLENBQUMsc0NBQXNDLEVBQUU7UUFDekMsSUFBTSxTQUFTLEdBQUcsY0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2xDLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFL0IsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDckQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsc0NBQXNDLEVBQUU7UUFDekMsSUFBTSxPQUFPLEdBQUcsY0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFFdkMsd0VBQXdFO1FBQ3hFLGNBQWM7UUFDZCxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVqRCxPQUFPLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRTdCLG1FQUFtRTtRQUNuRSwwQ0FBMEM7UUFDMUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFD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