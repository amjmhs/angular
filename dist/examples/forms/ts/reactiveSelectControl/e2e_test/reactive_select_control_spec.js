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
describe('reactiveSelectControl example', () => {
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    let select;
    let options;
    let p;
    beforeEach(() => {
        protractor_1.browser.get('/forms/ts/reactiveSelectControl/index.html');
        select = protractor_1.element(protractor_1.by.css('select'));
        options = protractor_1.element.all(protractor_1.by.css('option'));
        p = protractor_1.element(protractor_1.by.css('p'));
    });
    it('should populate the initial selection', () => {
        expect(select.getAttribute('value')).toEqual('3: Object');
        expect(options.get(3).getAttribute('selected')).toBe('true');
    });
    it('should update the model when the value changes in the UI', () => {
        select.click();
        options.get(0).click();
        expect(p.getText()).toEqual('Form value: { "state": { "name": "Arizona", "abbrev": "AZ" } }');
    });
});
//# sourceMappingURL=reactive_select_control_spec.js.map