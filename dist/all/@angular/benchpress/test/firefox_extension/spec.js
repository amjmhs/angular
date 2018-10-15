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
var assertEventsContainsName = function (events, eventName) {
    var found = false;
    for (var i = 0; i < events.length; ++i) {
        if (events[i].name == eventName) {
            found = true;
            break;
        }
    }
    expect(found).toBeTruthy();
};
describe('firefox extension', function () {
    var TEST_URL = 'http://localhost:8001/playground/src/hello_world/index.html';
    it('should measure performance', function () {
        protractor_1.browser.sleep(3000); // wait for extension to load
        protractor_1.browser.driver.get(TEST_URL);
        protractor_1.browser.executeScript('window.startProfiler()').then(function () {
            console.log('started measuring perf');
        });
        protractor_1.browser.executeAsyncScript('setTimeout(arguments[0], 1000);');
        protractor_1.browser.executeScript('window.forceGC()');
        protractor_1.browser.executeAsyncScript('var cb = arguments[0]; window.getProfile(cb);')
            .then(function (profile) {
            assertEventsContainsName(profile, 'gc');
            assertEventsContainsName(profile, 'script');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2JlbmNocHJlc3MvdGVzdC9maXJlZm94X2V4dGVuc2lvbi9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsZ0NBQWdDO0FBQ2hDLHlDQUFtQztBQUVuQyxJQUFNLHdCQUF3QixHQUFHLFVBQVMsTUFBYSxFQUFFLFNBQWlCO0lBQ3hFLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNsQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtRQUN0QyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksU0FBUyxFQUFFO1lBQy9CLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDYixNQUFNO1NBQ1A7S0FDRjtJQUNELE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUM3QixDQUFDLENBQUM7QUFFRixRQUFRLENBQUMsbUJBQW1CLEVBQUU7SUFDNUIsSUFBTSxRQUFRLEdBQUcsNkRBQTZELENBQUM7SUFFL0UsRUFBRSxDQUFDLDRCQUE0QixFQUFFO1FBQy9CLG9CQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUUsNkJBQTZCO1FBRW5ELG9CQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUU3QixvQkFBTyxDQUFDLGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNuRCxPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDeEMsQ0FBQyxDQUFDLENBQUM7UUFFSCxvQkFBTyxDQUFDLGtCQUFrQixDQUFDLGlDQUFpQyxDQUFDLENBQUM7UUFDOUQsb0JBQU8sQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUUxQyxvQkFBTyxDQUFDLGtCQUFrQixDQUFDLCtDQUErQyxDQUFDO2FBQ3RFLElBQUksQ0FBQyxVQUFTLE9BQVk7WUFDekIsd0JBQXdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3hDLHdCQUF3QixDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUM5QyxDQUFDLENBQUMsQ0FBQztJQUNULENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==