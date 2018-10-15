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
describe('nestedFormArray example', () => {
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    let inputs;
    let buttons;
    beforeEach(() => {
        protractor_1.browser.get('/forms/ts/nestedFormArray/index.html');
        inputs = protractor_1.element.all(protractor_1.by.css('input'));
        buttons = protractor_1.element.all(protractor_1.by.css('button'));
    });
    it('should populate the UI with initial values', () => {
        expect(inputs.get(0).getAttribute('value')).toEqual('SF');
        expect(inputs.get(1).getAttribute('value')).toEqual('NY');
    });
    it('should add inputs programmatically', () => {
        expect(inputs.count()).toBe(2);
        buttons.get(1).click();
        inputs = protractor_1.element.all(protractor_1.by.css('input'));
        expect(inputs.count()).toBe(3);
    });
    it('should set the value programmatically', () => {
        buttons.get(2).click();
        expect(inputs.get(0).getAttribute('value')).toEqual('LA');
        expect(inputs.get(1).getAttribute('value')).toEqual('MTV');
    });
});
//# sourceMappingURL=nested_form_array_spec.js.map