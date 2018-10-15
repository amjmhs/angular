"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../src/util");
{
    describe('util', function () {
        describe('splitAtColon', function () {
            it('should split when a single ":" is present', function () {
                expect(util_1.splitAtColon('a:b', [])).toEqual(['a', 'b']);
            });
            it('should trim parts', function () { expect(util_1.splitAtColon(' a : b ', [])).toEqual(['a', 'b']); });
            it('should support multiple ":"', function () {
                expect(util_1.splitAtColon('a:b:c', [])).toEqual(['a', 'b:c']);
            });
            it('should use the default value when no ":" is present', function () {
                expect(util_1.splitAtColon('ab', ['c', 'd'])).toEqual(['c', 'd']);
            });
        });
        describe('RegExp', function () {
            it('should escape regexp', function () {
                expect(new RegExp(util_1.escapeRegExp('b')).exec('abc')).toBeTruthy();
                expect(new RegExp(util_1.escapeRegExp('b')).exec('adc')).toBeFalsy();
                expect(new RegExp(util_1.escapeRegExp('a.b')).exec('a.b')).toBeTruthy();
                expect(new RegExp(util_1.escapeRegExp('a.b')).exec('axb')).toBeFalsy();
            });
        });
        describe('utf8encode', function () {
            // tests from https://github.com/mathiasbynens/wtf-8
            it('should encode to utf8', function () {
                var tests = [
                    ['abc', 'abc'],
                    // // 1-byte
                    ['\0', '\0'],
                    // // 2-byte
                    ['\u0080', '\xc2\x80'],
                    ['\u05ca', '\xd7\x8a'],
                    ['\u07ff', '\xdf\xbf'],
                    // // 3-byte
                    ['\u0800', '\xe0\xa0\x80'],
                    ['\u2c3c', '\xe2\xb0\xbc'],
                    ['\uffff', '\xef\xbf\xbf'],
                    // //4-byte
                    ['\uD800\uDC00', '\xF0\x90\x80\x80'],
                    ['\uD834\uDF06', '\xF0\x9D\x8C\x86'],
                    ['\uDBFF\uDFFF', '\xF4\x8F\xBF\xBF'],
                    // unmatched surrogate halves
                    // high surrogates: 0xD800 to 0xDBFF
                    ['\uD800', '\xED\xA0\x80'],
                    ['\uD800\uD800', '\xED\xA0\x80\xED\xA0\x80'],
                    ['\uD800A', '\xED\xA0\x80A'],
                    ['\uD800\uD834\uDF06\uD800', '\xED\xA0\x80\xF0\x9D\x8C\x86\xED\xA0\x80'],
                    ['\uD9AF', '\xED\xA6\xAF'],
                    ['\uDBFF', '\xED\xAF\xBF'],
                    // low surrogates: 0xDC00 to 0xDFFF
                    ['\uDC00', '\xED\xB0\x80'],
                    ['\uDC00\uDC00', '\xED\xB0\x80\xED\xB0\x80'],
                    ['\uDC00A', '\xED\xB0\x80A'],
                    ['\uDC00\uD834\uDF06\uDC00', '\xED\xB0\x80\xF0\x9D\x8C\x86\xED\xB0\x80'],
                    ['\uDEEE', '\xED\xBB\xAE'],
                    ['\uDFFF', '\xED\xBF\xBF'],
                ];
                tests.forEach(function (_a) {
                    var input = _a[0], output = _a[1];
                    expect(util_1.utf8Encode(input)).toEqual(output);
                });
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbF9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdC91dGlsX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFHSCxvQ0FBOEU7QUFFOUU7SUFDRSxRQUFRLENBQUMsTUFBTSxFQUFFO1FBQ2YsUUFBUSxDQUFDLGNBQWMsRUFBRTtZQUN2QixFQUFFLENBQUMsMkNBQTJDLEVBQUU7Z0JBQzlDLE1BQU0sQ0FBQyxtQkFBWSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3RELENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLG1CQUFtQixFQUFFLGNBQVEsTUFBTSxDQUFDLG1CQUFZLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUU1RixFQUFFLENBQUMsNkJBQTZCLEVBQUU7Z0JBQ2hDLE1BQU0sQ0FBQyxtQkFBWSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQzFELENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLHFEQUFxRCxFQUFFO2dCQUN4RCxNQUFNLENBQUMsbUJBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzdELENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsUUFBUSxFQUFFO1lBQ2pCLEVB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