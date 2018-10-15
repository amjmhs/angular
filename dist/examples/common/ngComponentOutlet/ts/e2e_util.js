"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/* tslint:disable:no-console  */
const webdriver = require("selenium-webdriver");
// TODO (juliemr): remove this method once this becomes a protractor plugin
function verifyNoBrowserErrors() {
    browser.manage().logs().get('browser').then(function (browserLog) {
        const errors = [];
        browserLog.filter(logEntry => {
            const msg = logEntry.message;
            console.log('>> ' + msg);
            if (logEntry.level.value >= webdriver.logging.Level.INFO.value) {
                errors.push(msg);
            }
        });
        expect(errors).toEqual([]);
    });
}
exports.verifyNoBrowserErrors = verifyNoBrowserErrors;
//# sourceMappingURL=e2e_util.js.map