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
const e2e_util_1 = require("../../../../../_common/e2e_util");
describe('contentChild example', () => {
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    let button;
    let result;
    beforeEach(() => {
        protractor_1.browser.get('/core/di/ts/contentChild/index.html');
        button = protractor_1.element(protractor_1.by.css('button'));
        result = protractor_1.element(protractor_1.by.css('div'));
    });
    it('should query content child', () => {
        expect(result.getText()).toEqual('pane: 1');
        button.click();
        expect(result.getText()).toEqual('pane: 2');
    });
});
//# sourceMappingURL=content_child_spec.js.map