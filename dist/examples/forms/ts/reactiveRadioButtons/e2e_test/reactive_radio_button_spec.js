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
describe('radioButtons example', () => {
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    let inputs;
    beforeEach(() => {
        protractor_1.browser.get('/forms/ts/reactiveRadioButtons/index.html');
        inputs = protractor_1.element.all(protractor_1.by.css('input'));
    });
    it('should populate the UI with initial values', () => {
        expect(inputs.get(0).getAttribute('checked')).toEqual(null);
        expect(inputs.get(1).getAttribute('checked')).toEqual('true');
        expect(inputs.get(2).getAttribute('checked')).toEqual(null);
        expect(protractor_1.element(protractor_1.by.css('p')).getText()).toEqual('Form value: { "food": "lamb" }');
    });
    it('update model and other buttons as the UI value changes', () => {
        inputs.get(0).click();
        expect(inputs.get(0).getAttribute('checked')).toEqual('true');
        expect(inputs.get(1).getAttribute('checked')).toEqual(null);
        expect(inputs.get(2).getAttribute('checked')).toEqual(null);
        expect(protractor_1.element(protractor_1.by.css('p')).getText()).toEqual('Form value: { "food": "beef" }');
    });
});
//# sourceMappingURL=reactive_radio_button_spec.js.map