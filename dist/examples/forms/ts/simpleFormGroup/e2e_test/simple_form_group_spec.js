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
describe('formControlName example', () => {
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    describe('index view', () => {
        let firstInput;
        let lastInput;
        beforeEach(() => {
            protractor_1.browser.get('/forms/ts/simpleFormGroup/index.html');
            firstInput = protractor_1.element(protractor_1.by.css('[formControlName="first"]'));
            lastInput = protractor_1.element(protractor_1.by.css('[formControlName="last"]'));
        });
        it('should populate the form control values in the DOM', () => {
            expect(firstInput.getAttribute('value')).toEqual('Nancy');
            expect(lastInput.getAttribute('value')).toEqual('Drew');
        });
        it('should show the error when the form is invalid', () => {
            firstInput.click();
            firstInput.clear();
            firstInput.sendKeys('a');
            expect(protractor_1.element(protractor_1.by.css('div')).getText()).toEqual('Name is too short.');
        });
        it('should set the value programmatically', () => {
            protractor_1.element(protractor_1.by.css('button:not([type="submit"])')).click();
            expect(firstInput.getAttribute('value')).toEqual('Carson');
            expect(lastInput.getAttribute('value')).toEqual('Drew');
        });
    });
});
//# sourceMappingURL=simple_form_group_spec.js.map