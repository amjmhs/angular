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
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var browser_util_1 = require("@angular/platform-browser/testing/src/browser_util");
(function () {
    function isNumeric(value) { return !isNaN(value - parseFloat(value)); }
    // Between the symbol and the number, Edge adds a no breaking space and IE11 adds a standard space
    function normalize(s) { return s.replace(/\u00A0| /g, ''); }
    testing_internal_1.describe('Number pipes', function () {
        testing_internal_1.describe('DeprecatedDecimalPipe', function () {
            var pipe;
            testing_internal_1.beforeEach(function () { pipe = new common_1.DeprecatedDecimalPipe('en-US'); });
            testing_internal_1.describe('transform', function () {
                testing_internal_1.it('should return correct value for numbers', function () {
                    testing_internal_1.expect(pipe.transform(12345)).toEqual('12,345');
                    testing_internal_1.expect(pipe.transform(123, '.2')).toEqual('123.00');
                    testing_internal_1.expect(pipe.transform(1, '3.')).toEqual('001');
                    testing_internal_1.expect(pipe.transform(1.1, '3.4-5')).toEqual('001.1000');
                    testing_internal_1.expect(pipe.transform(1.123456, '3.4-5')).toEqual('001.12346');
                    testing_internal_1.expect(pipe.transform(1.1234)).toEqual('1.123');
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
                    testing_internal_1.expect(function () { return pipe.transform(new Object()); }).toThrowError();
                    testing_internal_1.expect(function () { return pipe.transform('123abc'); }).toThrowError();
                });
            });
        });
        testing_internal_1.describe('DeprecatedPercentPipe', function () {
            var pipe;
            testing_internal_1.beforeEach(function () { pipe = new common_1.DeprecatedPercentPipe('en-US'); });
            testing_internal_1.describe('transform', function () {
                testing_internal_1.it('should return correct value for numbers', function () {
                    testing_internal_1.expect(normalize(pipe.transform(1.23))).toEqual('123%');
                    testing_internal_1.expect(normalize(pipe.transform(1.2, '.2'))).toEqual('120.00%');
                });
                testing_internal_1.it('should not support other objects', function () { testing_internal_1.expect(function () { return pipe.transform(new Object()); }).toThrowError(); });
            });
        });
        testing_internal_1.describe('DeprecatedCurrencyPipe', function () {
            var pipe;
            testing_internal_1.beforeEach(function () { pipe = new common_1.DeprecatedCurrencyPipe('en-US'); });
            testing_internal_1.describe('transform', function () {
                testing_internal_1.it('should return correct value for numbers', function () {
                    // In old Chrome, default formatiing for USD is different
                    if (browser_util_1.browserDetection.isOldChrome) {
                        testing_internal_1.expect(normalize(pipe.transform(123))).toEqual('USD123');
                    }
                    else {
                        testing_internal_1.expect(normalize(pipe.transform(123))).toEqual('USD123.00');
                    }
                    testing_internal_1.expect(normalize(pipe.transform(12, 'EUR', false, '.1'))).toEqual('EUR12.0');
                    testing_internal_1.expect(normalize(pipe.transform(5.1234, 'USD', false, '.0-3'))).toEqual('USD5.123');
                });
                testing_internal_1.it('should not support other objects', function () { testing_internal_1.expect(function () { return pipe.transform(new Object()); }).toThrowError(); });
            });
        });
        testing_internal_1.describe('isNumeric', function () {
            testing_internal_1.it('should return true when passing correct numeric string', function () { testing_internal_1.expect(isNumeric('2')).toBe(true); });
            testing_internal_1.it('should return true when passing correct double string', function () { testing_internal_1.expect(isNumeric('1.123')).toBe(true); });
            testing_internal_1.it('should return true when passing correct negative string', function () { testing_internal_1.expect(isNumeric('-2')).toBe(true); });
            testing_internal_1.it('should return true when passing correct scientific notation string', function () { testing_internal_1.expect(isNumeric('1e5')).toBe(true); });
            testing_internal_1.it('should return false when passing incorrect numeric', function () { testing_internal_1.expect(isNumeric('a')).toBe(false); });
            testing_internal_1.it('should return false when passing parseable but non numeric', function () { testing_internal_1.expect(isNumeric('2a')).toBe(false); });
        });
    });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVtYmVyX3BpcGVfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbW1vbi90ZXN0L3BpcGVzL2RlcHJlY2F0ZWQvbnVtYmVyX3BpcGVfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILDBDQUFxRztBQUNyRywrRUFBNEY7QUFDNUYsbUZBQW9GO0FBRXBGLENBQUM7SUFDQyxtQkFBbUIsS0FBVSxJQUFhLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVyRixrR0FBa0c7SUFDbEcsbUJBQW1CLENBQVMsSUFBWSxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUU1RSwyQkFBUSxDQUFDLGNBQWMsRUFBRTtRQUN2QiwyQkFBUSxDQUFDLHVCQUF1QixFQUFFO1lBQ2hDLElBQUksSUFBMkIsQ0FBQztZQUVoQyw2QkFBVSxDQUFDLGNBQVEsSUFBSSxHQUFHLElBQUksOEJBQXFCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVqRSwyQkFBUSxDQUFDLFdBQVcsRUFBRTtnQkFDcEIscUJBQUUsQ0FBQyx5Q0FBeUMsRUFBRTtvQkFDNUMseUJBQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNoRCx5QkFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNwRCx5QkFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFD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