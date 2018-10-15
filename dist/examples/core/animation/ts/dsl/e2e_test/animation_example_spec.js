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
function waitForElement(selector) {
    const EC = protractor_1.ExpectedConditions;
    // Waits for the element with id 'abc' to be present on the dom.
    protractor_1.browser.wait(EC.presenceOf(protractor_1.$(selector)), 20000);
}
describe('animation example', () => {
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    describe('index view', () => {
        const URL = '/core/animation/ts/dsl/';
        it('should list out the current collection of items', () => {
            protractor_1.browser.get(URL);
            waitForElement('.toggle-container');
            expect(protractor_1.element.all(protractor_1.by.css('.toggle-container')).get(0).getText()).toEqual('Look at this box');
        });
    });
});
//# sourceMappingURL=animation_example_spec.js.map