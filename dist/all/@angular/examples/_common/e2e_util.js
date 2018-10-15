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
var webdriver = require("selenium-webdriver");
// TODO (juliemr): remove this method once this becomes a protractor plugin
function verifyNoBrowserErrors() {
    browser.manage().logs().get('browser').then(function (browserLog) {
        var errors = [];
        browserLog.filter(function (logEntry) {
            var msg = logEntry.message;
            console.log('>> ' + msg);
            if (logEntry.level.value >= webdriver.logging.Level.INFO.value) {
                errors.push(msg);
            }
        });
        expect(errors).toEqual([]);
    });
}
exports.verifyNoBrowserErrors = verifyNoBrowserErrors;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZTJlX3V0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9leGFtcGxlcy9fY29tbW9uL2UyZV91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsZ0NBQWdDO0FBQ2hDLDhDQUFnRDtBQUloRCwyRUFBMkU7QUFDM0U7SUFDRSxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFTLFVBQWlCO1FBQ3BFLElBQU0sTUFBTSxHQUFVLEVBQUUsQ0FBQztRQUN6QixVQUFVLENBQUMsTUFBTSxDQUFDLFVBQUEsUUFBUTtZQUN4QixJQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDO1lBQzdCLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQ3pCLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDOUQsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNsQjtRQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM3QixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFaRCxzREFZQyJ9