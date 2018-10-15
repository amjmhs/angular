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
var de_AT_1 = require("@angular/common/locales/de-AT");
var common_1 = require("@angular/common");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
{
    testing_internal_1.describe('Number pipes', function () {
        beforeAll(function () {
            common_1.registerLocaleData(en_1.default);
            common_1.registerLocaleData(es_US_1.default);
            common_1.registerLocaleData(fr_1.default);
            common_1.registerLocaleData(ar_1.default);
            common_1.registerLocaleData(de_AT_1.default);
        });
        testing_internal_1.describe('DecimalPipe', function () {
            testing_internal_1.describe('transform', function () {
                var pipe;
                testing_internal_1.beforeEach(function () { pipe = new common_1.DecimalPipe('en-US'); });
                testing_internal_1.it('should return correct value for numbers', function () {
                    testing_internal_1.expect(pipe.transform(12345)).toEqual('12,345');
                    testing_internal_1.expect(pipe.transform(1.123456, '3.4-5')).toEqual('001.12346');
                });
                testing_internal_1.it('should support strings', function () {
                    testing_internal_1.expect(pipe.transform('12345')).toEqual('12,345');
                    testing_internal_1.expect(pipe.transform('123', '.2')).toEqual('123.00');
                    testing_internal_1.expect(pipe.transform('1', '3.')).toEqual('001');
                    testing_internal_1.expect(pipe.transform('1.1', '3.4-5')).toEqual('001.1000');
                    testing_internal_1.expect(pipe.transform('1.123456', '3.4-5')).toEqual('001.12346');
                    testing_internal_1.expect(pipe.transform('1.1234')).toEqual('1.123');
                });
                testing_internal_1.it('should not support other objects', function () {
                    testing_internal_1.expect(function () { return pipe.transform({}); })
                        .toThrowError("InvalidPipeArgument: '[object Object] is not a number' for pipe 'DecimalPipe'");
                    testing_internal_1.expect(function () { return pipe.transform('123abc'); })
                        .toThrowError("InvalidPipeArgument: '123abc is not a number' for pipe 'DecimalPipe'");
                });
            });
            testing_internal_1.describe('transform with custom locales', function () {
                testing_internal_1.it('should return the correct format for es-US', function () {
                    var pipe = new common_1.DecimalPipe('es-US');
                    testing_internal_1.expect(pipe.transform('9999999.99', '1.2-2')).toEqual('9,999,999.99');
                });
            });
        });
        testing_internal_1.describe('PercentPipe', function () {
            var pipe;
            testing_internal_1.beforeEach(function () { pipe = new common_1.PercentPipe('en-US'); });
            testing_internal_1.describe('transform', function () {
                testing_internal_1.it('should return correct value for numbers', function () {
                    testing_internal_1.expect(pipe.transform(1.23)).toEqual('123%');
                    testing_internal_1.expect(pipe.transform(12.3456, '0.0-10')).toEqual('1,234.56%');
                });
                testing_internal_1.it('should not support other objects', function () {
                    testing_internal_1.expect(function () { return pipe.transform({}); })
                        .toThrowError("InvalidPipeArgument: '[object Object] is not a number' for pipe 'PercentPipe'");
                });
            });
        });
        testing_internal_1.describe('CurrencyPipe', function () {
            var pipe;
            testing_internal_1.beforeEach(function () { pipe = new common_1.CurrencyPipe('en-US'); });
            testing_internal_1.describe('transform', function () {
                testing_internal_1.it('should return correct value for numbers', function () {
                    testing_internal_1.expect(pipe.transform(123)).toEqual('$123.00');
                    testing_internal_1.expect(pipe.transform(12, 'EUR', 'code', '.1')).toEqual('EUR12.0');
                    testing_internal_1.expect(pipe.transform(5.1234, 'USD', 'code', '.0-3')).toEqual('USD5.123');
                    testing_internal_1.expect(pipe.transform(5.1234, 'USD', 'code')).toEqual('USD5.12');
                    testing_internal_1.expect(pipe.transform(5.1234, 'USD', 'symbol')).toEqual('$5.12');
                    testing_internal_1.expect(pipe.transform(5.1234, 'CAD', 'symbol')).toEqual('CA$5.12');
                    testing_internal_1.expect(pipe.transform(5.1234, 'CAD', 'symbol-narrow')).toEqual('$5.12');
                    testing_internal_1.expect(pipe.transform(5.1234, 'CAD', 'symbol-narrow', '5.2-2')).toEqual('$00,005.12');
                    testing_internal_1.expect(pipe.transform(5.1234, 'CAD', 'symbol-narrow', '5.2-2', 'fr'))
                        .toEqual('00 005,12 $');
                    testing_internal_1.expect(pipe.transform(5, 'USD', 'symbol', '', 'fr')).toEqual('5,00 $US');
                    testing_internal_1.expect(pipe.transform(123456789, 'EUR', 'symbol', '', 'de-at'))
                        .toEqual('€ 123.456.789,00');
                });
                testing_internal_1.it('should support any currency code name', function () {
                    // currency code is unknown, default formatting options will be used
                    testing_internal_1.expect(pipe.transform(5.1234, 'unexisting_ISO_code', 'symbol'))
                        .toEqual('unexisting_ISO_code5.12');
                    // currency code is USD, the pipe will format based on USD but will display "Custom name"
                    testing_internal_1.expect(pipe.transform(5.1234, 'USD', 'Custom name')).toEqual('Custom name5.12');
                });
                testing_internal_1.it('should not support other objects', function () {
                    testing_internal_1.expect(function () { return pipe.transform({}); })
                        .toThrowError("InvalidPipeArgument: '[object Object] is not a number' for pipe 'CurrencyPipe'");
                });
                testing_internal_1.it('should warn if you are using the v4 signature', function () {
                    var warnSpy = spyOn(console, 'warn');
                    pipe.transform(123, 'USD', true);
                    testing_internal_1.expect(warnSpy).toHaveBeenCalledWith("Warning: the currency pipe has been changed in Angular v5. The symbolDisplay option (third parameter) is now a string instead of a boolean. The accepted values are \"code\", \"symbol\" or \"symbol-narrow\".");
                });
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVtYmVyX3BpcGVfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbW1vbi90ZXN0L3BpcGVzL251bWJlcl9waXBlX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxpREFBa0Q7QUFDbEQsdURBQXVEO0FBQ3ZELGlEQUFrRDtBQUNsRCxpREFBa0Q7QUFDbEQsdURBQXVEO0FBQ3ZELDBDQUF5RztBQUN6RywrRUFBNEY7QUFFNUY7SUFDRSwyQkFBUSxDQUFDLGNBQWMsRUFBRTtRQUN2QixTQUFTLENBQUM7WUFDUiwyQkFBa0IsQ0FBQyxZQUFRLENBQUMsQ0FBQztZQUM3QiwyQkFBa0IsQ0FBQyxlQUFVLENBQUMsQ0FBQztZQUMvQiwyQkFBa0IsQ0FBQyxZQUFRLENBQUMsQ0FBQztZQUM3QiwyQkFBa0IsQ0FBQyxZQUFRLENBQUMsQ0FBQztZQUM3QiwyQkFBa0IsQ0FBQyxlQUFVLENBQUMsQ0FBQztRQUNqQyxDQUFDLENBQUMsQ0FBQztRQUVILDJCQUFRLENBQUMsYUFBYSxFQUFFO1lBQ3RCLDJCQUFRLENBQUMsV0FBVyxFQUFFO2dCQUNwQixJQUFJLElBQWlCLENBQUM7Z0JBQ3RCLDZCQUFVLENBQUMsY0FBUSxJQUFJLEdBQUcsSUFBSSxvQkFBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRXZELHFCQUFFLENBQUMseUNBQXlDLEVBQUU7b0JBQzVDLHlCQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDaEQseUJBQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDakUsQ0FBQyxDQUFDLENBQUM7Z0JBRUgscUJBQUUs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