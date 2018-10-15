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
const e2e_util_1 = require("../../../../_common/e2e_util");
function waitForElement(selector) {
    const EC = protractor_1.ExpectedConditions;
    // Waits for the element with id 'abc' to be present on the dom.
    protractor_1.browser.wait(EC.presenceOf(protractor_1.$(selector)), 20000);
}
describe('ngComponentOutlet', () => {
    const URL = 'common/ngComponentOutlet/ts/';
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    describe('ng-component-outlet-example', () => {
        it('should render simple', () => {
            protractor_1.browser.get(URL);
            waitForElement('ng-component-outlet-simple-example');
            expect(protractor_1.element.all(protractor_1.by.css('hello-world')).getText()).toEqual(['Hello World!']);
        });
        it('should render complete', () => {
            protractor_1.browser.get(URL);
            waitForElement('ng-component-outlet-complete-example');
            expect(protractor_1.element.all(protractor_1.by.css('complete-component')).getText()).toEqual(['Complete: AhojSvet!']);
        });
        it('should render other module', () => {
            protractor_1.browser.get(URL);
            waitForElement('ng-component-outlet-other-module-example');
            expect(protractor_1.element.all(protractor_1.by.css('other-module-component')).getText()).toEqual([
                'Other Module Component!'
            ]);
        });
    });
});
//# sourceMappingURL=ngComponentOutlet_spec.js.map