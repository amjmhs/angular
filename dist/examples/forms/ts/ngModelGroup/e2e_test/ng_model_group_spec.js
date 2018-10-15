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
describe('ngModelGroup example', () => {
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    let inputs;
    let buttons;
    beforeEach(() => {
        protractor_1.browser.get('/forms/ts/ngModelGroup/index.html');
        inputs = protractor_1.element.all(protractor_1.by.css('input'));
        buttons = protractor_1.element.all(protractor_1.by.css('button'));
    });
    it('should populate the UI with initial values', () => {
        expect(inputs.get(0).getAttribute('value')).toEqual('Nancy');
        expect(inputs.get(1).getAttribute('value')).toEqual('Drew');
    });
    it('should show the error when name is invalid', () => {
        inputs.get(0).click();
        inputs.get(0).clear();
        inputs.get(0).sendKeys('a');
        expect(protractor_1.element(protractor_1.by.css('p')).getText()).toEqual('Name is invalid.');
    });
    it('should set the value when changing the domain model', () => {
        buttons.get(1).click();
        expect(inputs.get(0).getAttribute('value')).toEqual('Bess');
        expect(inputs.get(1).getAttribute('value')).toEqual('Marvin');
    });
});
//# sourceMappingURL=ng_model_group_spec.js.map