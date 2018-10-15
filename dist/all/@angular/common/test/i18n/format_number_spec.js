"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var en_1 = require("@angular/common/locales/en");
var es_US_1 = require("@angular/common/locales/es-US");
var fr_1 = require("@angular/common/locales/fr");
var ar_1 = require("@angular/common/locales/ar");
var common_1 = require("@angular/common");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
testing_internal_1.describe('Format number', function () {
    var defaultLocale = 'en-US';
    beforeAll(function () {
        common_1.registerLocaleData(en_1.default);
        common_1.registerLocaleData(es_US_1.default);
        common_1.registerLocaleData(fr_1.default);
        common_1.registerLocaleData(ar_1.default);
    });
    testing_internal_1.describe('Number', function () {
        testing_internal_1.describe('transform', function () {
            testing_internal_1.it('should return correct value for numbers', function () {
                testing_internal_1.expect(common_1.formatNumber(12345, defaultLocale)).toEqual('12,345');
                testing_internal_1.expect(common_1.formatNumber(123, defaultLocale, '.2')).toEqual('123.00');
                testing_internal_1.expect(common_1.formatNumber(1, defaultLocale, '3.')).toEqual('001');
                testing_internal_1.expect(common_1.formatNumber(1.1, defaultLocale, '3.4-5')).toEqual('001.1000');
                testing_internal_1.expect(common_1.formatNumber(1.123456, defaultLocale, '3.4-5')).toEqual('001.12346');
                testing_internal_1.expect(common_1.formatNumber(1.1234, defaultLocale)).toEqual('1.123');
                testing_internal_1.expect(common_1.formatNumber(1.123456, defaultLocale, '.2')).toEqual('1.123');
                testing_internal_1.expect(common_1.formatNumber(1.123456, defaultLocale, '.4')).toEqual('1.1235');
            });
            testing_internal_1.it('should throw if minFractionDigits is explicitly higher than maxFractionDigits', function () {
                testing_internal_1.expect(function () { return common_1.formatNumber(1.1, defaultLocale, '3.4-2'); })
                    .toThrowError(/is higher than the maximum/);
            });
        });
        testing_internal_1.describe('transform with custom locales', function () {
            testing_internal_1.it('should return the correct format for es-US', function () { testing_internal_1.expect(common_1.formatNumber(9999999.99, 'es-US', '1.2-2')).toEqual('9,999,999.99'); });
        });
    });
    testing_internal_1.describe('Percent', function () {
        testing_internal_1.describe('transform', function () {
            testing_internal_1.it('should return correct value for numbers', function () {
                testing_internal_1.expect(common_1.formatPercent(1.23, defaultLocale)).toEqual('123%');
                testing_internal_1.expect(common_1.formatPercent(1.2, defaultLocale, '.2')).toEqual('120.00%');
                testing_internal_1.expect(common_1.formatPercent(1.2, defaultLocale, '4.2')).toEqual('0,120.00%');
                testing_internal_1.expect(common_1.formatPercent(1.2, 'fr', '4.2')).toEqual('0 120,00 %');
                testing_internal_1.expect(common_1.formatPercent(1.2, 'ar', '4.2')).toEqual('0,120.00‎%‎');
                // see issue #20136
                testing_internal_1.expect(common_1.formatPercent(0.12345674, defaultLocale, '0.0-10')).toEqual('12.345674%');
                testing_internal_1.expect(common_1.formatPercent(0, defaultLocale, '0.0-10')).toEqual('0%');
                testing_internal_1.expect(common_1.formatPercent(0.00, defaultLocale, '0.0-10')).toEqual('0%');
                testing_internal_1.expect(common_1.formatPercent(1, defaultLocale, '0.0-10')).toEqual('100%');
                testing_internal_1.expect(common_1.formatPercent(0.1, defaultLocale, '0.0-10')).toEqual('10%');
                testing_internal_1.expect(common_1.formatPercent(0.12, defaultLocale, '0.0-10')).toEqual('12%');
                testing_internal_1.expect(common_1.formatPercent(0.123, defaultLocale, '0.0-10')).toEqual('12.3%');
                testing_internal_1.expect(common_1.formatPercent(12.3456, defaultLocale, '0.0-10')).toEqual('1,234.56%');
                testing_internal_1.expect(common_1.formatPercent(12.345600, defaultLocale, '0.0-10')).toEqual('1,234.56%');
                testing_internal_1.expect(common_1.formatPercent(12.345699999, defaultLocale, '0.0-6')).toEqual('1,234.57%');
                testing_internal_1.expect(common_1.formatPercent(12.345699999, defaultLocale, '0.4-6')).toEqual('1,234.5700%');
                testing_internal_1.expect(common_1.formatPercent(100, defaultLocale, '0.4-6')).toEqual('10,000.0000%');
                testing_internal_1.expect(common_1.formatPercent(100, defaultLocale, '0.0-10')).toEqual('10,000%');
                testing_internal_1.expect(common_1.formatPercent(1.5e2, defaultLocale)).toEqual('15,000%');
                testing_internal_1.expect(common_1.formatPercent(1e100, defaultLocale)).toEqual('1E+102%');
            });
        });
    });
    testing_internal_1.describe('Currency', function () {
        var defaultCurrencyCode = 'USD';
        testing_internal_1.describe('transform', function () {
            testing_internal_1.it('should return correct value for numbers', function () {
                testing_internal_1.expect(common_1.formatCurrency(123, defaultLocale, '$')).toEqual('$123.00');
                testing_internal_1.expect(common_1.formatCurrency(12, defaultLocale, 'EUR', 'EUR', '.1')).toEqual('EUR12.0');
                testing_internal_1.expect(common_1.formatCurrency(5.1234, defaultLocale, defaultCurrencyCode, defaultCurrencyCode, '.0-3'))
                    .toEqual('USD5.123');
                testing_internal_1.expect(common_1.formatCurrency(5.1234, defaultLocale, defaultCurrencyCode)).toEqual('USD5.12');
                testing_internal_1.expect(common_1.formatCurrency(5.1234, defaultLocale, '$')).toEqual('$5.12');
                testing_internal_1.expect(common_1.formatCurrency(5.1234, defaultLocale, 'CA$')).toEqual('CA$5.12');
                testing_internal_1.expect(common_1.formatCurrency(5.1234, defaultLocale, '$')).toEqual('$5.12');
                testing_internal_1.expect(common_1.formatCurrency(5.1234, defaultLocale, '$', defaultCurrencyCode, '5.2-2'))
                    .toEqual('$00,005.12');
                testing_internal_1.expect(common_1.formatCurrency(5.1234, 'fr', '$', defaultCurrencyCode, '5.2-2'))
                    .toEqual('00 005,12 $');
                testing_internal_1.expect(common_1.formatCurrency(5, 'fr', '$US', defaultCurrencyCode)).toEqual('5,00 $US');
            });
            testing_internal_1.it('should support any currency code name', function () {
                // currency code is unknown, default formatting options will be used
                testing_internal_1.expect(common_1.formatCurrency(5.1234, defaultLocale, 'unexisting_ISO_code'))
                    .toEqual('unexisting_ISO_code5.12');
                // currency code is USD, the pipe will format based on USD but will display "Custom name"
                testing_internal_1.expect(common_1.formatCurrency(5.1234, defaultLocale, 'Custom name')).toEqual('Custom name5.12');
            });
            testing_internal_1.it('should round to the default number of digits if no digitsInfo', function () {
                // IDR has a default number of digits of 0
                testing_internal_1.expect(common_1.formatCurrency(5.1234, defaultLocale, 'IDR', 'IDR')).toEqual('IDR5');
                testing_internal_1.expect(common_1.formatCurrency(5.1234, defaultLocale, 'IDR', 'IDR', '.2')).toEqual('IDR5.12');
                testing_internal_1.expect(common_1.formatCurrency(5.1234, defaultLocale, 'Custom name', 'IDR')).toEqual('Custom name5');
                // BHD has a default number of digits of 3
                testing_internal_1.expect(common_1.formatCurrency(5.1234, defaultLocale, 'BHD', 'BHD')).toEqual('BHD5.123');
                testing_internal_1.expect(common_1.formatCurrency(5.1234, defaultLocale, 'BHD', 'BHD', '.1-2')).toEqual('BHD5.12');
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0X251bWJlcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tbW9uL3Rlc3QvaTE4bi9mb3JtYXRfbnVtYmVyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxpREFBa0Q7QUFDbEQsdURBQXVEO0FBQ3ZELGlEQUFrRDtBQUNsRCxpREFBa0Q7QUFDbEQsMENBQWdHO0FBQ2hHLCtFQUFnRjtBQUVoRiwyQkFBUSxDQUFDLGVBQWUsRUFBRTtJQUN4QixJQUFNLGFBQWEsR0FBRyxPQUFPLENBQUM7SUFFOUIsU0FBUyxDQUFDO1FBQ1IsMkJBQWtCLENBQUMsWUFBUSxDQUFDLENBQUM7UUFDN0IsMkJBQWtCLENBQUMsZUFBVSxDQUFDLENBQUM7UUFDL0IsMkJBQWtCLENBQUMsWUFBUSxDQUFDLENBQUM7UUFDN0IsMkJBQWtCLENBQUMsWUFBUSxDQUFDLENBQUM7SUFDL0IsQ0FBQyxDQUFDLENBQUM7SUFFSCwyQkFBUSxDQUFDLFFBQVEsRUFBRTtRQUNqQiwyQkFBUSxDQUFDLFdBQVcsRUFBRTtZQUNwQixxQkFBRSxDQUFDLHlDQUF5QyxFQUFFO2dCQUM1Qyx5QkFBTSxDQUFDLHFCQUFZLENBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUM3RCx5QkFBTSxDQUFDLHFCQUFZLENBQUMsR0FBRyxFQUFFLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDakUseUJBQU0sQ0FBQyxxQkFBWSxDQUFDLENBQUMsRUFBRSxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzVELHlCQUFNLENBQUMscUJBQVksQ0FBQyxHQUFHLEVBQUUsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFD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