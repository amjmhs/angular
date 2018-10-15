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
describe('simpleForm example', () => {
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    let inputs;
    let paragraphs;
    beforeEach(() => {
        protractor_1.browser.get('/forms/ts/simpleForm/index.html');
        inputs = protractor_1.element.all(protractor_1.by.css('input'));
        paragraphs = protractor_1.element.all(protractor_1.by.css('p'));
    });
    it('should update the domain model as you type', () => {
        inputs.get(0).click();
        inputs.get(0).sendKeys('Nancy');
        inputs.get(1).click();
        inputs.get(1).sendKeys('Drew');
        expect(paragraphs.get(0).getText()).toEqual('First name value: Nancy');
        expect(paragraphs.get(2).getText()).toEqual('Form value: { "first": "Nancy", "last": "Drew" }');
    });
    it('should report the validity correctly', () => {
        expect(paragraphs.get(1).getText()).toEqual('First name valid: false');
        expect(paragraphs.get(3).getText()).toEqual('Form valid: false');
        inputs.get(0).click();
        inputs.get(0).sendKeys('a');
        expect(paragraphs.get(1).getText()).toEqual('First name valid: true');
        expect(paragraphs.get(3).getText()).toEqual('Form valid: true');
    });
});
//# sourceMappingURL=simple_form_spec.js.map