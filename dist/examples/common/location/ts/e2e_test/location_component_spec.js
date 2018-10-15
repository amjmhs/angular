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
    const EC = protractor_1.protractor.ExpectedConditions;
    // Waits for the element with id 'abc' to be present on the dom.
    protractor_1.browser.wait(EC.presenceOf(protractor_1.$(selector)), 20000);
}
describe('Location', () => {
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    it('should verify paths', () => {
        protractor_1.browser.get('/common/location/ts/#/bar/baz');
        waitForElement('hash-location');
        expect(protractor_1.element.all(protractor_1.by.css('path-location code')).get(0).getText())
            .toEqual('/common/location/ts');
        expect(protractor_1.element.all(protractor_1.by.css('hash-location code')).get(0).getText()).toEqual('/bar/baz');
    });
});
//# sourceMappingURL=location_component_spec.js.map