"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const protractor_1 = require("protractor");
const e2e_util_1 = require("../../../../../_common/e2e_util");
describe('testability example', () => {
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    describe('using task tracking', () => {
        const URL = '/core/testability/ts/whenStable/';
        it('times out with a list of tasks', done => {
            protractor_1.browser.get(URL);
            protractor_1.browser.ignoreSynchronization = true;
            // Script that runs in the browser and calls whenStable with a timeout.
            let waitWithResultScript = function (done) {
                let rootEl = document.querySelector('example-app');
                let testability = window.getAngularTestability(rootEl);
                testability.whenStable((didWork, tasks) => { done(tasks); }, 1000);
            };
            protractor_1.element(protractor_1.by.css('.start-button')).click();
            protractor_1.browser.driver.executeAsyncScript(waitWithResultScript).then((result) => {
                let pendingTask = result[0];
                expect(pendingTask.delay).toEqual(5000);
                expect(pendingTask.source).toEqual('setTimeout');
                expect(protractor_1.element(protractor_1.by.css('.status')).getText()).not.toContain('done');
                done();
            });
        });
        afterAll(() => { protractor_1.browser.ignoreSynchronization = false; });
    });
});
//# sourceMappingURL=testability_example_spec.js.map