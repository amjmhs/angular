"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var digest_1 = require("../../src/i18n/digest");
{
    describe('digest', function () {
        describe('digest', function () {
            it('must return the ID if it\'s explicit', function () {
                expect(digest_1.digest({
                    id: 'i',
                    nodes: [],
                    placeholders: {},
                    placeholderToMessage: {},
                    meaning: '',
                    description: '',
                    sources: [],
                })).toEqual('i');
            });
        });
        describe('sha1', function () {
            it('should work on empty strings', function () { expect(digest_1.sha1('')).toEqual('da39a3ee5e6b4b0d3255bfef95601890afd80709'); });
            it('should returns the sha1 of "hello world"', function () { expect(digest_1.sha1('abc')).toEqual('a9993e364706816aba3e25717850c26c9cd0d89d'); });
            it('should returns the sha1 of unicode strings', function () { expect(digest_1.sha1('你好，世界')).toEqual('3becb03b015ed48050611c8d7afe4b88f70d5a20'); });
            it('should support arbitrary string size', function () {
                // node.js reference code:
                //
                // var crypto = require('crypto');
                //
                // function sha1(string) {
                //   var shasum = crypto.createHash('sha1');
                //   shasum.update(string, 'utf8');
                //   return shasum.digest('hex', 'utf8');
                // }
                //
                // var prefix = `你好，世界`;
                // var result = sha1(prefix);
                // for (var size = prefix.length; size < 5000; size += 101) {
                //   result = prefix + sha1(result);
                //   while (result.length < size) {
                //     result += result;
                //   }
                //   result = result.slice(-size);
                // }
                //
                // console.log(sha1(result));
                var prefix = "\u4F60\u597D\uFF0C\u4E16\u754C";
                var result = digest_1.sha1(prefix);
                for (var size = prefix.length; size < 5000; size += 101) {
                    result = prefix + digest_1.sha1(result);
                    while (result.length < size) {
                        result += result;
                    }
                    result = result.slice(-size);
                }
                expect(digest_1.sha1(result)).toEqual('24c2dae5c1ac6f604dbe670a60290d7ce6320b45');
            });
        });
        describe('decimal fingerprint', function () {
            it('should work on well known inputs w/o meaning', function () {
                var fixtures = {
                    '  Spaced  Out  ': '3976450302996657536',
                    'Last Name': '4407559560004943843',
                    'First Name': '6028371114637047813',
                    'View': '2509141182388535183',
                    'START_BOLDNUMEND_BOLD of START_BOLDmillionsEND_BOLD': '29997634073898638',
                    'The customer\'s credit card was authorized for AMOUNT and passed all risk checks.': '6836487644149622036',
                    'Hello world!': '3022994926184248873',
                    'Jalape\u00f1o': '8054366208386598941',
                    'The set of SET_NAME is {XXX, ...}.': '135956960462609535',
                    'NAME took a trip to DESTINATION.': '768490705511913603',
                    'by AUTHOR (YEAR)': '7036633296476174078',
                    '': '4416290763660062288',
                };
                Object.keys(fixtures).forEach(function (msg) { expect(digest_1.computeMsgId(msg, '')).toEqual(fixtures[msg]); });
            });
            it('should work on well known inputs with meaning', function () {
                var fixtures = {
                    '7790835225175622807': ['Last Name', 'Gmail UI'],
                    '1809086297585054940': ['First Name', 'Gmail UI'],
                    '3993998469942805487': ['View', 'Gmail UI'],
                };
                Object.keys(fixtures).forEach(function (id) { expect(digest_1.computeMsgId(fixtures[id][0], fixtures[id][1])).toEqual(id); });
            });
            it('should support arbitrary string size', function () {
                var prefix = "\u4F60\u597D\uFF0C\u4E16\u754C";
                var result = digest_1.computeMsgId(prefix, '');
                for (var size = prefix.length; size < 5000; size += 101) {
                    result = prefix + digest_1.computeMsgId(result, '');
                    while (result.length < size) {
                        result += result;
                    }
                    result = result.slice(-size);
                }
                expect(digest_1.computeMsgId(result, '')).toEqual('2122606631351252558');
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlnZXN0X3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0L2kxOG4vZGlnZXN0X3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxnREFBaUU7QUFFakU7SUFDRSxRQUFRLENBQUMsUUFBUSxFQUFFO1FBQ2pCLFFBQVEsQ0FBQyxRQUFRLEVBQUU7WUFDakIsRUFBRSxDQUFDLHNDQUFzQyxFQUFFO2dCQUN6QyxNQUFNLENBQUMsZUFBTSxDQUFDO29CQUNaLEVBQUUsRUFBRSxHQUFHO29CQUNQLEtBQUssRUFBRSxFQUFFO29CQUNULFlBQVksRUFBRSxFQUFFO29CQUNoQixvQkFBb0IsRUFBRSxFQUFFO29CQUN4QixPQUFPLEVBQUUsRUFBRTtvQkFDWCxXQUFXLEVBQUUsRUFBRTtvQkFDZixPQUFPLEVBQUUsRUFBRTtpQkFDWixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkIsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxNQUFNLEVBQUU7WUFDZixFQUFFLENBQUMsOEJBQThCLEVBQzlCLGNBQVEsTUFBTSxDQUFDLGFBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFcEYsRUFBRSxDQUFDLDBDQUEwQyxFQUMxQyxjQUFRLE1BQU0sQ0FBQyxhQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsMENBQTBDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXZGLEVBQUUsQ0FBQyw0Q0FBNEMsRUFDNUMsY0FBUSxNQUFNLENBQUMsYUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDBDQUEwQyxDQUFDLENBQUMsQ0FB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