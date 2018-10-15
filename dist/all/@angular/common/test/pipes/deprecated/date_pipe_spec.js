"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var pipe_resolver_1 = require("@angular/compiler/src/pipe_resolver");
var compiler_reflector_1 = require("@angular/platform-browser-dynamic/src/compiler_reflector");
var browser_util_1 = require("@angular/platform-browser/testing/src/browser_util");
{
    describe('DeprecatedDatePipe', function () {
        var date;
        var isoStringWithoutTime = '2015-01-01';
        var pipe;
        // Check the transformation of a date into a pattern
        function expectDateFormatAs(date, pattern, output) {
            // disabled on chrome mobile because of the following bug affecting the intl API
            // https://bugs.chromium.org/p/chromium/issues/detail?id=796583
            // the android 7 emulator of saucelabs uses chrome mobile 63
            if (!browser_util_1.browserDetection.isAndroid && !browser_util_1.browserDetection.isWebkit) {
                expect(pipe.transform(date, pattern)).toEqual(output);
            }
        }
        // TODO: reactivate the disabled expectations once emulators are fixed in SauceLabs
        // In some old versions of Chrome in Android emulators, time formatting returns dates in the
        // timezone of the VM host,
        // instead of the device timezone. Same symptoms as
        // https://bugs.chromium.org/p/chromium/issues/detail?id=406382
        // This happens locally and in SauceLabs, so some checks are disabled to avoid failures.
        // Tracking issue: https://github.com/angular/angular/issues/11187
        beforeEach(function () {
            date = new Date(2015, 5, 15, 9, 3, 1);
            pipe = new common_1.DeprecatedDatePipe('en-US');
        });
        it('should be marked as pure', function () {
            expect(new pipe_resolver_1.PipeResolver(new compiler_reflector_1.JitReflector()).resolve(common_1.DeprecatedDatePipe).pure).toEqual(true);
        });
        describe('supports', function () {
            it('should support date', function () { expect(function () { return pipe.transform(date); }).not.toThrow(); });
            it('should support int', function () { expect(function () { return pipe.transform(123456789); }).not.toThrow(); });
            it('should support numeric strings', function () { expect(function () { return pipe.transform('123456789'); }).not.toThrow(); });
            it('should support decimal strings', function () { expect(function () { return pipe.transform('123456789.11'); }).not.toThrow(); });
            it('should support ISO string', function () { return expect(function () { return pipe.transform('2015-06-15T21:43:11Z'); }).not.toThrow(); });
            it('should return null for empty string', function () { return expect(pipe.transform('')).toEqual(null); });
            it('should return null for NaN', function () { return expect(pipe.transform(Number.NaN)).toEqual(null); });
            it('should support ISO string without time', function () { expect(function () { return pipe.transform(isoStringWithoutTime); }).not.toThrow(); });
            it('should not support other objects', function () { return expect(function () { return pipe.transform({}); }).toThrowError(/InvalidPipeArgument/); });
        });
        describe('transform', function () {
            it('should format each component correctly', function () {
                var dateFixtures = {
                    'y': '2015',
                    'yy': '15',
                    'M': '6',
                    'MM': '06',
                    'MMM': 'Jun',
                    'MMMM': 'June',
                    'd': '15',
                    'dd': '15',
                    'EEE': 'Mon',
                    'EEEE': 'Monday'
                };
                var isoStringWithoutTimeFixtures = {
                    'y': '2015',
                    'yy': '15',
                    'M': '1',
                    'MM': '01',
                    'MMM': 'Jan',
                    'MMMM': 'January',
                    'd': '1',
                    'dd': '01',
                    'EEE': 'Thu',
                    'EEEE': 'Thursday'
                };
                if (!browser_util_1.browserDetection.isOldChrome) {
                    dateFixtures['h'] = '9';
                    dateFixtures['hh'] = '09';
                    dateFixtures['j'] = '9 AM';
                    isoStringWithoutTimeFixtures['h'] = '12';
                    isoStringWithoutTimeFixtures['hh'] = '12';
                    isoStringWithoutTimeFixtures['j'] = '12 AM';
                }
                // IE and Edge can't format a date to minutes and seconds without hours
                if (!browser_util_1.browserDetection.isEdge && !browser_util_1.browserDetection.isIE ||
                    !browser_util_1.browserDetection.supportsNativeIntlApi) {
                    if (!browser_util_1.browserDetection.isOldChrome) {
                        dateFixtures['HH'] = '09';
                        isoStringWithoutTimeFixtures['HH'] = '00';
                    }
                    dateFixtures['E'] = 'M';
                    dateFixtures['L'] = 'J';
                    dateFixtures['m'] = '3';
                    dateFixtures['s'] = '1';
                    dateFixtures['mm'] = '03';
                    dateFixtures['ss'] = '01';
                    isoStringWithoutTimeFixtures['m'] = '0';
                    isoStringWithoutTimeFixtures['s'] = '0';
                    isoStringWithoutTimeFixtures['mm'] = '00';
                    isoStringWithoutTimeFixtures['ss'] = '00';
                }
                Object.keys(dateFixtures).forEach(function (pattern) {
                    expectDateFormatAs(date, pattern, dateFixtures[pattern]);
                });
                if (!browser_util_1.browserDetection.isOldChrome) {
                    Object.keys(isoStringWithoutTimeFixtures).forEach(function (pattern) {
                        expectDateFormatAs(isoStringWithoutTime, pattern, isoStringWithoutTimeFixtures[pattern]);
                    });
                }
                expect(pipe.transform(date, 'Z')).toBeDefined();
            });
            it('should format common multi component patterns', function () {
                var dateFixtures = {
                    'EEE, M/d/y': 'Mon, 6/15/2015',
                    'EEE, M/d': 'Mon, 6/15',
                    'MMM d': 'Jun 15',
                    'dd/MM/yyyy': '15/06/2015',
                    'MM/dd/yyyy': '06/15/2015',
                    'yMEEEd': '20156Mon15',
                    'MEEEd': '6Mon15',
                    'MMMd': 'Jun15',
                    'yMMMMEEEEd': 'Monday, June 15, 2015'
                };
                // IE and Edge can't format a date to minutes and seconds without hours
                if (!browser_util_1.browserDetection.isEdge && !browser_util_1.browserDetection.isIE ||
                    !browser_util_1.browserDetection.supportsNativeIntlApi) {
                    dateFixtures['ms'] = '31';
                }
                if (!browser_util_1.browserDetection.isOldChrome) {
                    dateFixtures['jm'] = '9:03 AM';
                }
                Object.keys(dateFixtures).forEach(function (pattern) {
                    expectDateFormatAs(date, pattern, dateFixtures[pattern]);
                });
            });
            it('should format with pattern aliases', function () {
                var dateFixtures = {
                    'MM/dd/yyyy': '06/15/2015',
                    'fullDate': 'Monday, June 15, 2015',
                    'longDate': 'June 15, 2015',
                    'mediumDate': 'Jun 15, 2015',
                    'shortDate': '6/15/2015'
                };
                if (!browser_util_1.browserDetection.isOldChrome) {
                    // IE and Edge do not add a coma after the year in these 2 cases
                    if ((browser_util_1.browserDetection.isEdge || browser_util_1.browserDetection.isIE) &&
                        browser_util_1.browserDetection.supportsNativeIntlApi) {
                        dateFixtures['medium'] = 'Jun 15, 2015 9:03:01 AM';
                        dateFixtures['short'] = '6/15/2015 9:03 AM';
                    }
                    else {
                        dateFixtures['medium'] = 'Jun 15, 2015, 9:03:01 AM';
                        dateFixtures['short'] = '6/15/2015, 9:03 AM';
                    }
                }
                if (!browser_util_1.browserDetection.isOldChrome) {
                    dateFixtures['mediumTime'] = '9:03:01 AM';
                    dateFixtures['shortTime'] = '9:03 AM';
                }
                Object.keys(dateFixtures).forEach(function (pattern) {
                    expectDateFormatAs(date, pattern, dateFixtures[pattern]);
                });
            });
            it('should format invalid in IE ISO date', function () { return expect(pipe.transform('2017-01-11T09:25:14.014-0500')).toEqual('Jan 11, 2017'); });
            it('should format invalid in Safari ISO date', function () { return expect(pipe.transform('2017-01-20T19:00:00+0000')).toEqual('Jan 20, 2017'); });
            it('should remove bidi control characters', function () { return expect(pipe.transform(date, 'MM/dd/yyyy').length).toEqual(10); });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZV9waXBlX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vdGVzdC9waXBlcy9kZXByZWNhdGVkL2RhdGVfcGlwZV9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsMENBQW1EO0FBQ25ELHFFQUFpRTtBQUNqRSwrRkFBc0Y7QUFDdEYsbUZBQW9GO0FBRXBGO0lBQ0UsUUFBUSxDQUFDLG9CQUFvQixFQUFFO1FBQzdCLElBQUksSUFBVSxDQUFDO1FBQ2YsSUFBTSxvQkFBb0IsR0FBRyxZQUFZLENBQUM7UUFDMUMsSUFBSSxJQUF3QixDQUFDO1FBRTdCLG9EQUFvRDtRQUNwRCw0QkFBNEIsSUFBbUIsRUFBRSxPQUFZLEVBQUUsTUFBYztZQUMzRSxnRkFBZ0Y7WUFDaEYsK0RBQStEO1lBQy9ELDREQUE0RDtZQUM1RCxJQUFJLENBQUMsK0JBQWdCLENBQUMsU0FBUyxJQUFJLENBQUMsK0JBQWdCLENBQUMsUUFBUSxFQUFFO2dCQUM3RCxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDdkQ7UUFDSCxDQUFDO1FBRUQsbUZBQW1GO1FBQ25GLDRGQUE0RjtRQUM1RiwyQkFBMkI7UUFDM0IsbURBQW1EO1FBQ25ELCtEQUErRDtRQUMvRCx3RkFBd0Y7UUFDeEYsa0VBQWtFO1FBRWxFLFVBQVUsQ0FBQztZQUNULElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLElBQUksR0FBRyxJQUFJLDJCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3pDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDBCQUEw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