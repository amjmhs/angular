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
describe('testability example', function () {
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    describe('using task tracking', function () {
        var URL = '/core/testability/ts/whenStable/';
        it('times out with a list of tasks', function (done) {
            protractor_1.browser.get(URL);
            protractor_1.browser.ignoreSynchronization = true;
            // Script that runs in the browser and calls whenStable with a timeout.
            var waitWithResultScript = function (done) {
                var rootEl = document.querySelector('example-app');
                var testability = window.getAngularTestability(rootEl);
                testability.whenStable(function (didWork, tasks) { done(tasks); }, 1000);
            };
            protractor_1.element(protractor_1.by.css('.start-button')).click();
            protractor_1.browser.driver.executeAsyncScript(waitWithResultScript).then(function (result) {
                var pendingTask = result[0];
                expect(pendingTask.delay).toEqual(5000);
                expect(pendingTask.source).toEqual('setTimeout');
                expect(protractor_1.element(protractor_1.by.css('.status')).getText()).not.toContain('done');
                done();
            });
        });
        afterAll(function () { protractor_1.browser.ignoreSynchronization = false; });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGFiaWxpdHlfZXhhbXBsZV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZXhhbXBsZXMvY29yZS90ZXN0YWJpbGl0eS90cy93aGVuU3RhYmxlL2UyZV90ZXN0L3Rlc3RhYmlsaXR5X2V4YW1wbGVfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHlDQUFnRDtBQUNoRCw0REFBc0U7QUFFdEUsUUFBUSxDQUFDLHFCQUFxQixFQUFFO0lBQzlCLFNBQVMsQ0FBQyxnQ0FBcUIsQ0FBQyxDQUFDO0lBRWpDLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtRQUM5QixJQUFNLEdBQUcsR0FBRyxrQ0FBa0MsQ0FBQztRQUUvQyxFQUFFLENBQUMsZ0NBQWdDLEVBQUUsVUFBQSxJQUFJO1lBQ3ZDLG9CQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLG9CQUFPLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDO1lBRXJDLHVFQUF1RTtZQUN2RSxJQUFJLG9CQUFvQixHQUFHLFVBQVMsSUFBUztnQkFDM0MsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDbkQsSUFBSSxXQUFXLEdBQUksTUFBYyxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNoRSxXQUFXLENBQUMsVUFBVSxDQUFDLFVBQUMsT0FBZ0IsRUFBRSxLQUFVLElBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ25GLENBQUMsQ0FBQztZQUVGLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBRXpDLG9CQUFPLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLG9CQUFvQixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsTUFBYTtnQkFDekUsSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDeEMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQ2pELE1BQU0sQ0FBQyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ25FLElBQUksRUFBRSxDQUFDO1lBQ1QsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxjQUFRLG9CQUFPLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0QsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9