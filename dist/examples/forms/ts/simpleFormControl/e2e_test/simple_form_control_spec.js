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
describe('simpleFormControl example', () => {
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    describe('index view', () => {
        let input;
        let valueP;
        let statusP;
        beforeEach(() => {
            protractor_1.browser.get('/forms/ts/simpleFormControl/index.html');
            input = protractor_1.element(protractor_1.by.css('input'));
            valueP = protractor_1.element(protractor_1.by.css('p:first-of-type'));
            statusP = protractor_1.element(protractor_1.by.css('p:last-of-type'));
        });
        it('should populate the form control value in the DOM', () => {
            expect(input.getAttribute('value')).toEqual('value');
            expect(valueP.getText()).toEqual('Value: value');
        });
        it('should update the value as user types', () => {
            input.click();
            input.sendKeys('s!');
            expect(valueP.getText()).toEqual('Value: values!');
        });
        it('should show the correct validity state', () => {
            expect(statusP.getText()).toEqual('Validation status: VALID');
            input.click();
            input.clear();
            input.sendKeys('a');
            expect(statusP.getText()).toEqual('Validation status: INVALID');
        });
        it('should set the value programmatically', () => {
            protractor_1.element(protractor_1.by.css('button')).click();
            expect(input.getAttribute('value')).toEqual('new value');
        });
    });
});
//# sourceMappingURL=simple_form_control_spec.js.map