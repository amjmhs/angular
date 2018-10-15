"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-console  */
var protractor_1 = require("protractor");
var yargs = require('yargs');
var webdriver = require("selenium-webdriver");
var cmdArgs;
function readCommandLine(extraOptions) {
    var options = {
        'bundles': { describe: 'Whether to use the angular bundles or not.', default: false }
    };
    if (extraOptions) {
        for (var key in extraOptions) {
            options[key] = extraOptions[key];
        }
    }
    cmdArgs = yargs.usage('Angular e2e test options.').options(options).help('ng-help').wrap(40).argv;
    return cmdArgs;
}
exports.readCommandLine = readCommandLine;
function openBrowser(config) {
    if (config.ignoreBrowserSynchronization) {
        protractor_1.browser.ignoreSynchronization = true;
    }
    var params = config.params || [];
    if (!params.some(function (param) { return param.name === 'bundles'; })) {
        params = params.concat([{ name: 'bundles', value: cmdArgs.bundles }]);
    }
    var urlParams = [];
    params.forEach(function (param) { urlParams.push(param.name + '=' + param.value); });
    var url = encodeURI(config.url + '?' + urlParams.join('&'));
    protractor_1.browser.get(url);
    if (config.ignoreBrowserSynchronization) {
        protractor_1.browser.sleep(2000);
    }
}
exports.openBrowser = openBrowser;
/**
 * @experimental This API will be moved to Protractor.
 */
function verifyNoBrowserErrors() {
    // TODO(tbosch): Bug in ChromeDriver: Need to execute at least one command
    // so that the browser logs can be read out!
    protractor_1.browser.executeScript('1+1');
    protractor_1.browser.manage().logs().get('browser').then(function (browserLog) {
        var filteredLog = browserLog.filter(function (logEntry) {
            if (logEntry.level.value >= webdriver.logging.Level.INFO.value) {
                console.log('>> ' + logEntry.message);
            }
            return logEntry.level.value > webdriver.logging.Level.WARNING.value;
        });
        expect(filteredLog).toEqual([]);
    });
}
exports.verifyNoBrowserErrors = verifyNoBrowserErrors;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZTJlX3V0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9tb2R1bGVzL2UyZV91dGlsL2UyZV91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsZ0NBQWdDO0FBQ2hDLHlDQUFtQztBQUVuQyxJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDL0IsOENBQWdEO0FBRWhELElBQUksT0FBNkIsQ0FBQztBQUlsQyx5QkFBZ0MsWUFBbUM7SUFDakUsSUFBTSxPQUFPLEdBQXlCO1FBQ3BDLFNBQVMsRUFBRSxFQUFDLFFBQVEsRUFBRSw0Q0FBNEMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFDO0tBQ3BGLENBQUM7SUFDRixJQUFJLFlBQVksRUFBRTtRQUNoQixLQUFLLElBQU0sR0FBRyxJQUFJLFlBQVksRUFBRTtZQUM5QixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2xDO0tBQ0Y7SUFFRCxPQUFPLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUNsRyxPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDO0FBWkQsMENBWUM7QUFFRCxxQkFBNEIsTUFJM0I7SUFDQyxJQUFJLE1BQU0sQ0FBQyw0QkFBNEIsRUFBRTtRQUN2QyxvQkFBTyxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQztLQUN0QztJQUNELElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO0lBQ2pDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQUMsS0FBSyxJQUFLLE9BQUEsS0FBSyxDQUFDLElBQUksS0FBSyxTQUFTLEVBQXhCLENBQXdCLENBQUMsRUFBRTtRQUNyRCxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLE9BQU8sRUFBQyxDQUFDLENBQUMsQ0FBQztLQUNyRTtJQUVELElBQU0sU0FBUyxHQUFhLEVBQUUsQ0FBQztJQUMvQixNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxJQUFPLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0UsSUFBTSxHQUFHLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUM5RCxvQkFBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNqQixJQUFJLE1BQU0sQ0FBQyw0QkFBNEIsRUFBRTtRQUN2QyxvQkFBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNyQjtBQUNILENBQUM7QUFwQkQsa0NBb0JDO0FBRUQ7O0dBRUc7QUFDSDtJQUNFLDBFQUEwRTtJQUMxRSw0Q0FBNEM7SUFDNUMsb0JBQU8sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDN0Isb0JBQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVMsVUFBZTtRQUNsRSxJQUFNLFdBQVcsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLFVBQVMsUUFBYTtZQUMxRCxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQzlELE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUN2QztZQUNELE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUN0RSxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDbEMsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBYkQsc0RBYUMifQ==