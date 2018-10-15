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
var ar_1 = require("@angular/common/locales/ar");
var de_1 = require("@angular/common/locales/de");
var en_1 = require("@angular/common/locales/en");
var en_2 = require("@angular/common/locales/extra/en");
var hu_1 = require("@angular/common/locales/hu");
var sr_1 = require("@angular/common/locales/sr");
var th_1 = require("@angular/common/locales/th");
var format_date_1 = require("@angular/common/src/i18n/format_date");
describe('Format date', function () {
    describe('toDate', function () {
        it('should support date', function () { expect(format_date_1.isDate(format_date_1.toDate(new Date()))).toBeTruthy(); });
        it('should support int', function () { expect(format_date_1.isDate(format_date_1.toDate(123456789))).toBeTruthy(); });
        it('should support numeric strings', function () { expect(format_date_1.isDate(format_date_1.toDate('123456789'))).toBeTruthy(); });
        it('should support decimal strings', function () { expect(format_date_1.isDate(format_date_1.toDate('123456789.11'))).toBeTruthy(); });
        it('should support ISO string', function () { expect(format_date_1.isDate(format_date_1.toDate('2015-06-15T21:43:11Z'))).toBeTruthy(); });
        it('should throw for empty string', function () { expect(function () { return format_date_1.toDate(''); }).toThrow(); });
        it('should throw for alpha numeric strings', function () { expect(function () { return format_date_1.toDate('123456789 hello'); }).toThrow(); });
        it('should throw for NaN', function () { expect(function () { return format_date_1.toDate(Number.NaN); }).toThrow(); });
        it('should support ISO string without time', function () { expect(format_date_1.isDate(format_date_1.toDate('2015-01-01'))).toBeTruthy(); });
        it('should throw for objects', function () { expect(function () { return format_date_1.toDate({}); }).toThrow(); });
    });
    describe('formatDate', function () {
        var isoStringWithoutTime = '2015-01-01';
        var defaultLocale = 'en-US';
        var defaultFormat = 'mediumDate';
        var date;
        // Check the transformation of a date into a pattern
        function expectDateFormatAs(date, pattern, output) {
            expect(format_date_1.formatDate(date, pattern, defaultLocale)).toEqual(output, "pattern: \"" + pattern + "\"");
        }
        beforeAll(function () {
            common_1.registerLocaleData(en_1.default, en_2.default);
            common_1.registerLocaleData(de_1.default);
            common_1.registerLocaleData(hu_1.default);
            common_1.registerLocaleData(sr_1.default);
            common_1.registerLocaleData(th_1.default);
            common_1.registerLocaleData(ar_1.default);
        });
        beforeEach(function () { date = new Date(2015, 5, 15, 9, 3, 1, 550); });
        it('should format each component correctly', function () {
            var dateFixtures = {
                G: 'AD',
                GG: 'AD',
                GGG: 'AD',
                GGGG: 'Anno Domini',
                GGGGG: 'A',
                y: '2015',
                yy: '15',
                yyy: '2015',
                yyyy: '2015',
                M: '6',
                MM: '06',
                MMM: 'Jun',
                MMMM: 'June',
                MMMMM: 'J',
                L: '6',
                LL: '06',
                LLL: 'Jun',
                LLLL: 'June',
                LLLLL: 'J',
                w: '25',
                ww: '25',
                W: '3',
                d: '15',
                dd: '15',
                E: 'Mon',
                EE: 'Mon',
                EEE: 'Mon',
                EEEE: 'Monday',
                EEEEEE: 'Mo',
                h: '9',
                hh: '09',
                H: '9',
                HH: '09',
                m: '3',
                mm: '03',
                s: '1',
                ss: '01',
                S: '5',
                SS: '55',
                SSS: '550',
                a: 'AM',
                aa: 'AM',
                aaa: 'AM',
                aaaa: 'AM',
                aaaaa: 'a',
                b: 'morning',
                bb: 'morning',
                bbb: 'morning',
                bbbb: 'morning',
                bbbbb: 'morning',
                B: 'in the morning',
                BB: 'in the morning',
                BBB: 'in the morning',
                BBBB: 'in the morning',
                BBBBB: 'in the morning',
            };
            var isoStringWithoutTimeFixtures = {
                G: 'AD',
                GG: 'AD',
                GGG: 'AD',
                GGGG: 'Anno Domini',
                GGGGG: 'A',
                y: '2015',
                yy: '15',
                yyy: '2015',
                yyyy: '2015',
                M: '1',
                MM: '01',
                MMM: 'Jan',
                MMMM: 'January',
                MMMMM: 'J',
                L: '1',
                LL: '01',
                LLL: 'Jan',
                LLLL: 'January',
                LLLLL: 'J',
                w: '1',
                ww: '01',
                W: '1',
                d: '1',
                dd: '01',
                E: 'Thu',
                EE: 'Thu',
                EEE: 'Thu',
                EEEE: 'Thursday',
                EEEEE: 'T',
                EEEEEE: 'Th',
                h: '12',
                hh: '12',
                H: '0',
                HH: '00',
                m: '0',
                mm: '00',
                s: '0',
                ss: '00',
                S: '0',
                SS: '00',
                SSS: '000',
                a: 'AM',
                aa: 'AM',
                aaa: 'AM',
                aaaa: 'AM',
                aaaaa: 'a',
                b: 'midnight',
                bb: 'midnight',
                bbb: 'midnight',
                bbbb: 'midnight',
                bbbbb: 'midnight',
                B: 'midnight',
                BB: 'midnight',
                BBB: 'midnight',
                BBBB: 'midnight',
                BBBBB: 'mi',
            };
            Object.keys(dateFixtures).forEach(function (pattern) {
                expectDateFormatAs(date, pattern, dateFixtures[pattern]);
            });
            Object.keys(isoStringWithoutTimeFixtures).forEach(function (pattern) {
                expectDateFormatAs(isoStringWithoutTime, pattern, isoStringWithoutTimeFixtures[pattern]);
            });
        });
        it('should format with timezones', function () {
            var dateFixtures = {
                z: /GMT(\+|-)\d/,
                zz: /GMT(\+|-)\d/,
                zzz: /GMT(\+|-)\d/,
                zzzz: /GMT(\+|-)\d{2}\:30/,
                Z: /(\+|-)\d{2}30/,
                ZZ: /(\+|-)\d{2}30/,
                ZZZ: /(\+|-)\d{2}30/,
                ZZZZ: /GMT(\+|-)\d{2}\:30/,
                ZZZZZ: /(\+|-)\d{2}\:30/,
                O: /GMT(\+|-)\d/,
                OOOO: /GMT(\+|-)\d{2}\:30/,
            };
            Object.keys(dateFixtures).forEach(function (pattern) {
                expect(format_date_1.formatDate(date, pattern, defaultLocale, '+0430')).toMatch(dateFixtures[pattern]);
            });
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
                'EEEE, MMMM d, y': 'Monday, June 15, 2015',
                'H:mm a': '9:03 AM',
                'ms': '31',
                'MM/dd/yy hh:mm': '06/15/15 09:03',
                'MM/dd/y': '06/15/2015'
            };
            Object.keys(dateFixtures).forEach(function (pattern) {
                expectDateFormatAs(date, pattern, dateFixtures[pattern]);
            });
        });
        it('should format with pattern aliases', function () {
            var dateFixtures = {
                'MM/dd/yyyy': '06/15/2015',
                shortDate: '6/15/15',
                mediumDate: 'Jun 15, 2015',
                longDate: 'June 15, 2015',
                fullDate: 'Monday, June 15, 2015',
                short: '6/15/15, 9:03 AM',
                medium: 'Jun 15, 2015, 9:03:01 AM',
                long: /June 15, 2015 at 9:03:01 AM GMT(\+|-)\d/,
                full: /Monday, June 15, 2015 at 9:03:01 AM GMT(\+|-)\d{2}:\d{2}/,
                shortTime: '9:03 AM',
                mediumTime: '9:03:01 AM',
                longTime: /9:03:01 AM GMT(\+|-)\d/,
                fullTime: /9:03:01 AM GMT(\+|-)\d{2}:\d{2}/,
            };
            Object.keys(dateFixtures).forEach(function (pattern) {
                expect(format_date_1.formatDate(date, pattern, defaultLocale)).toMatch(dateFixtures[pattern]);
            });
        });
        it('should format invalid in IE ISO date', function () { return expect(format_date_1.formatDate('2017-01-11T12:00:00.014-0500', defaultFormat, defaultLocale))
            .toEqual('Jan 11, 2017'); });
        it('should format invalid in Safari ISO date', function () { return expect(format_date_1.formatDate('2017-01-20T12:00:00+0000', defaultFormat, defaultLocale))
            .toEqual('Jan 20, 2017'); });
        // https://github.com/angular/angular/issues/9524
        // https://github.com/angular/angular/issues/9524
        it('should format correctly with iso strings that contain time', function () { return expect(format_date_1.formatDate('2017-05-07T22:14:39', 'dd-MM-yyyy HH:mm', defaultLocale))
            .toMatch(/07-05-2017 \d{2}:\d{2}/); });
        // https://github.com/angular/angular/issues/21491
        it('should not assume UTC for iso strings in Safari if the timezone is not defined', function () {
            // this test only works if the timezone is not in UTC
            // which is the case for BrowserStack when we test Safari
            if (new Date().getTimezoneOffset() !== 0) {
                expect(format_date_1.formatDate('2018-01-11T13:00:00', 'HH', defaultLocale))
                    .not.toEqual(format_date_1.formatDate('2018-01-11T13:00:00Z', 'HH', defaultLocale));
            }
        });
        // https://github.com/angular/angular/issues/16624
        // https://github.com/angular/angular/issues/17478
        it('should show the correct time when the timezone is fixed', function () {
            expect(format_date_1.formatDate('2017-06-13T10:14:39+0000', 'shortTime', defaultLocale, '+0000'))
                .toEqual('10:14 AM');
            expect(format_date_1.formatDate('2017-06-13T10:14:39+0000', 'h:mm a', defaultLocale, '+0000'))
                .toEqual('10:14 AM');
        });
        it('should remove bidi control characters', function () { return expect(format_date_1.formatDate(date, 'MM/dd/yyyy', defaultLocale).length).toEqual(10); });
        it("should format the date correctly in various locales", function () {
            expect(format_date_1.formatDate(date, 'short', 'de')).toEqual('15.06.15, 09:03');
            expect(format_date_1.formatDate(date, 'short', 'ar')).toEqual('15‏/6‏/2015 9:03 ص');
            expect(format_date_1.formatDate(date, 'dd-MM-yy', 'th')).toEqual('15-06-15');
            expect(format_date_1.formatDate(date, 'a', 'hu')).toEqual('de.');
            expect(format_date_1.formatDate(date, 'a', 'sr')).toEqual('пре подне');
            // TODO(ocombe): activate this test when we support local numbers
            // expect(formatDate(date, 'hh', 'mr')).toEqual('०९');
        });
        it('should throw if we use getExtraDayPeriods without loading extra locale data', function () {
            expect(function () { return format_date_1.formatDate(date, 'b', 'de'); })
                .toThrowError(/Missing extra locale data for the locale "de"/);
        });
        // https://github.com/angular/angular/issues/24384
        it('should not round fractional seconds', function () {
            expect(format_date_1.formatDate(3999, 'm:ss', 'en')).toEqual('0:03');
            expect(format_date_1.formatDate(3999, 'm:ss.S', 'en')).toEqual('0:03.9');
            expect(format_date_1.formatDate(3999, 'm:ss.SS', 'en')).toEqual('0:03.99');
            expect(format_date_1.formatDate(3999, 'm:ss.SSS', 'en')).toEqual('0:03.999');
            expect(format_date_1.formatDate(3000, 'm:ss', 'en')).toEqual('0:03');
            expect(format_date_1.formatDate(3000, 'm:ss.S', 'en')).toEqual('0:03.0');
            expect(format_date_1.formatDate(3000, 'm:ss.SS', 'en')).toEqual('0:03.00');
            expect(format_date_1.formatDate(3000, 'm:ss.SSS', 'en')).toEqual('0:03.000');
            expect(format_date_1.formatDate(3001, 'm:ss', 'en')).toEqual('0:03');
            expect(format_date_1.formatDate(3001, 'm:ss.S', 'en')).toEqual('0:03.0');
            expect(format_date_1.formatDate(3001, 'm:ss.SS', 'en')).toEqual('0:03.00');
            expect(format_date_1.formatDate(3001, 'm:ss.SSS', 'en')).toEqual('0:03.001');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0X2RhdGVfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbW1vbi90ZXN0L2kxOG4vZm9ybWF0X2RhdGVfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILDBDQUFtRDtBQUNuRCxpREFBa0Q7QUFDbEQsaURBQWtEO0FBQ2xELGlEQUFrRDtBQUNsRCx1REFBNkQ7QUFDN0QsaURBQWtEO0FBQ2xELGlEQUFrRDtBQUNsRCxpREFBa0Q7QUFDbEQsb0VBQWdGO0FBRWhGLFFBQVEsQ0FBQyxhQUFhLEVBQUU7SUFDdEIsUUFBUSxDQUFDLFFBQVEsRUFBRTtRQUNqQixFQUFFLENBQUMscUJBQXFCLEVBQUUsY0FBUSxNQUFNLENBQUMsb0JBQU0sQ0FBQyxvQkFBTSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV0RixFQUFFLENBQUMsb0JBQW9CLEVBQUUsY0FBUSxNQUFNLENBQUMsb0JBQU0sQ0FBQyxvQkFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXBGLEVBQUUsQ0FBQyxnQ0FBZ0MsRUFDaEMsY0FBUSxNQUFNLENBQUMsb0JBQU0sQ0FBQyxvQkFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWhFLEVBQUUsQ0FBQyxnQ0FBZ0MsRUFDaEMsY0FBUSxNQUFNLENBQUMsb0JBQU0sQ0FBQyxvQkFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRW5FLEVBQUUsQ0FBQywyQkFBMkIsRUFDM0IsY0FBUSxNQUFNLENBQUMsb0JBQU0sQ0FBQyxvQkFBTSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFM0UsRUFBRSxDQUFDLCtCQUErQixFQUFFLGNBQVEsTUFBTSxDQUFDLGNBQU0sT0FBQSxvQkFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFWLENBQVUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFbkYsRUFBRSxDQUFDLHdDQUF3QyxFQUN4QyxjQUFRLE1BQU0sQ0FBQyxjQUFNLE9BQUEsb0JBQU0sQ0FBQyxpQkFBaUIsQ0FBQyxFQUF6QixDQUF5QixDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVqRSxFQUFFLENBQUMsc0JBQXNCLEVBQUUsY0FBUSxNQUFNLENBQUMsY0FBTSxPQUFBLG9CQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFsQixDQUFrQixDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVsRixFQUFFLENBQUMsd0NBQXdDLEVBQ3hDLGNBQVEsTUFBTSxDQUFDLG9CQUFNLENBQUMsb0JBQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVqRSxFQUFFLENBQUMsMEJBQTBCLEVBQUUsY0FBUSxNQUFNLENBQUMsY0FBTSxPQUFBLG9CQUFNLENBQUMsRUFBUyxDQUFDLEVBQWpCLENBQWlCLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZGLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFlBQVksRUFBRTtRQUNyQixJQUFNLG9CQUFvQixHQUFHLFlBQVksQ0FBQztRQUMxQyxJQUFNLGFBQWEsR0FBRyxPQUFPLENBQUM7UUFDOUIsSUFBTSxhQUFhLEdBQUcsWUFBWSxDQUFDO1FBQ25DLElBQUksSUFBVSxDQUFDO1FBRWYsb0RBQW9EO1FBQ3BELDRCQUE0QixJQUFtQixFQUFFLE9BQVksRUFBRSxNQUFjO1lBQzNFLE1BQU0sQ0FBQyx3QkFBVSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLGdCQUFhLE9BQU8sT0FBRyxDQUFDLENBQUM7UUFDNUYsQ0FBQztRQUVELFNBQVMsQ0FBQztZQUNSLDJCQUFrQixDQUFDLFlBQVEsRUFBRSxZQUFhLENBQUMsQ0FBQztZQUM1QywyQkFBa0IsQ0FBQyxZQUFRLENBQUMsQ0FBQztZQUM3QiwyQkFBa0IsQ0FBQyxZQUFRLENBQUMsQ0FBQztZQUM3QiwyQkFBa0IsQ0FBQyxZQUFRLENBQUMsQ0FBQztZQUM3QiwyQkFBa0IsQ0FBQyxZQUFRLENBQUMsQ0FBQztZQUM3QiwyQkFBa0IsQ0FBQyxZQUFRLENBQUMsQ0FBQztRQUMvQixDQUFDLENBQUMsQ0FBQztRQUVILFVBQVUsQ0FBQyxjQUFRLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWxFLEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRTtZQUMzQyxJQUFNLFlBQVksR0FBUTtnQkFDeEIsQ0FBQyxFQUFFLElBQUk7Z0JBQ1AsRUFBRSxFQUFFLElBQUk7Z0JBQ1IsR0FBRyxFQUFFLElBQUk7Z0JBQ1QsSUFBSSxFQUFFLGFBQWE7Z0JBQ25CLEtBQUssRUFBRSxHQUFHO2dCQUNWLENBQUMsRUFBRSxNQUFNO2dCQUNULEVBQUUsRUFBRSxJQUFJO2dCQUNSLEdBQUcsRUFBRSxNQUFNO2dCQUNYLElBQUksRUFBRSxNQUFNO2dCQUNaLENBQUMsRUFBRSxHQUFHO2dCQUNOLEVBQUUsRUFBRSxJQUFJO2dCQUNSLEdBQUcsRUFBRSxLQUFLO2dCQUNWLElBQUksRUFBRSxNQUFNO2dCQUNaLEtBQUssRUFBRSxHQUFHO2dCQUNWLENBQUMsRUFBRSxHQUFHO2dCQUNOLEVBQUUsRUFBRSxJQUFJO2dCQUNSLEdBQUcsRUFBRSxLQUFLO2dCQUNWLElBQUksRUFBRSxNQUFNO2dCQUNaLEtBQUssRUFBRSxHQUFHO2dCQUNWLENBQUMsRUFBRSxJQUFJO2dCQUNQLEVBQUUsRUFBRSxJQUFJO2dCQUNSLENBQUMsRUFBRSxHQUFHO2dCQUNOLENBQUMsRUFBRSxJQUFJO2dCQUNQLEVBQUUsRUFBRSxJQUFJO2dCQUNSLENBQUMsRUFBRSxLQUFLO2dCQUNSLEVBQUUsRUFBRSxLQUFLO2dCQUNULEdBQUcsRUFBRSxLQUFLO2dCQUNWLElBQUksRUFBRSxRQUFRO2dCQUNkLE1BQU0sRUFBRSxJQUFJO2dCQUNaLENBQUMsRUFBRSxHQUFHO2dCQUNOLEVBQUUsRUFBRSxJQUFJO2dCQUNSLENBQUMsRUFBRSxHQUFHO2dCQUNOLEVBQUUsRUFBRSxJQUFJO2dCQUNSLENBQUMsRUFBRSxHQUFHO2dCQUNOLEVBQUUsRUFBRSxJQUFJO2dCQUNSLENBQUMsRUFBRSxHQUFHO2dCQUNOLEVBQUUsRUFBRSxJQUFJO2dCQUNSLENBQUMsRUFBRSxHQUFHO2dCQUNOLEVBQUUsRUFBRSxJQUFJO2dCQUNSLEdBQUcsRUFBRSxLQUFLO2dCQUNWLENBQUMsRUFBRSxJQUFJO2dCQUNQLEVBQUUsRUFBRSxJQUFJO2dCQUNSLEdBQUcsRUFBRSxJQUFJO2dCQUNULElBQUksRUFBRSxJQUFJO2dCQUNWLEtBQUssRUFBRSxHQUFHO2dCQUNWLENBQUMsRUFBRSxTQUFTO2dCQUNaLEVBQUUsRUFBRSxTQUFTO2dCQUNiLEdBQUcsRUFBRSxTQUFTO2dCQUNkLElBQUksRUFBRSxTQUFTO2dCQUNmLEtBQUssRUFBRSxTQUFTO2dCQUNoQixDQUFDLEVBQUUsZ0JBQWdCO2dCQUNuQixFQUFFLEVBQUUsZ0JBQWdCO2dCQUNwQixHQUFHLEVBQUUsZ0JBQWdCO2dCQUNyQixJQUFJLEVBQUUsZ0JBQWdCO2dCQUN0QixLQUFLLEVBQUUsZ0JBQWdCO2FBQ3hCLENBQUM7WUFF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LElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDL0QsTUFBTSxDQUFDLHdCQUFVLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN2RCxNQUFNLENBQUMsd0JBQVUsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzNELE1BQU0sQ0FBQyx3QkFBVSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDN0QsTUFBTSxDQUFDLHdCQUFVLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMvRCxNQUFNLENBQUMsd0JBQVUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3ZELE1BQU0sQ0FBQyx3QkFBVSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDM0QsTUFBTSxDQUFDLHdCQUFVLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM3RCxNQUFNLENBQUMsd0JBQVUsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2pFLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9