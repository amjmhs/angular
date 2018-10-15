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
describe('nestedFormGroup example', () => {
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    let firstInput;
    let lastInput;
    let button;
    beforeEach(() => {
        protractor_1.browser.get('/forms/ts/nestedFormGroup/index.html');
        firstInput = protractor_1.element(protractor_1.by.css('[formControlName="first"]'));
        lastInput = protractor_1.element(protractor_1.by.css('[formControlName="last"]'));
        button = protractor_1.element(protractor_1.by.css('button:not([type="submit"])'));
    });
    it('should populate the UI with initial values', () => {
        expect(firstInput.getAttribute('value')).toEqual('Nancy');
        expect(lastInput.getAttribute('value')).toEqual('Drew');
    });
    it('should show the error when name is invalid', () => {
        firstInput.click();
        firstInput.clear();
        firstInput.sendKeys('a');
        expect(protractor_1.element(protractor_1.by.css('p')).getText()).toEqual('Name is invalid.');
    });
    it('should set the value programmatically', () => {
        button.click();
        expect(firstInput.getAttribute('value')).toEqual('Bess');
        expect(lastInput.getAttribute('value')).toEqual('Marvin');
    });
});
//# sourceMappingURL=nested_form_group_spec.js.map