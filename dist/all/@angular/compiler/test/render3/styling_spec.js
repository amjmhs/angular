"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var styling_1 = require("../../src/render3/view/styling");
describe('inline css style parsing', function () {
    it('should parse empty or blank strings', function () {
        var result1 = styling_1.parseStyle('');
        expect(result1).toEqual({});
        var result2 = styling_1.parseStyle('    ');
        expect(result2).toEqual({});
    });
    it('should parse a string into a key/value map', function () {
        var result = styling_1.parseStyle('width:100px;height:200px;opacity:0');
        expect(result).toEqual({ width: '100px', height: '200px', opacity: '0' });
    });
    it('should trim values and properties', function () {
        var result = styling_1.parseStyle('width :333px ; height:666px    ; opacity: 0.5;');
        expect(result).toEqual({ width: '333px', height: '666px', opacity: '0.5' });
    });
    it('should chomp out start/end quotes', function () {
        var result = styling_1.parseStyle('content: "foo"; opacity: \'0.5\'; font-family: "Verdana", Helvetica, "sans-serif"');
        expect(result).toEqual({ content: 'foo', opacity: '0.5', 'font-family': '"Verdana", Helvetica, "sans-serif"' });
    });
    it('should not mess up with quoted strings that contain [:;] values', function () {
        var result = styling_1.parseStyle('content: "foo; man: guy"; width: 100px');
        expect(result).toEqual({ content: 'foo; man: guy', width: '100px' });
    });
    it('should not mess up with quoted strings that contain inner quote values', function () {
        var quoteStr = '"one \'two\' three \"four\" five"';
        var result = styling_1.parseStyle("content: " + quoteStr + "; width: 123px");
        expect(result).toEqual({ content: quoteStr, width: '123px' });
    });
    it('should respect parenthesis that are placed within a style', function () {
        var result = styling_1.parseStyle('background-image: url("foo.jpg")');
        expect(result).toEqual({ 'background-image': 'url("foo.jpg")' });
    });
    it('should respect multi-level parenthesis that contain special [:;] characters', function () {
        var result = styling_1.parseStyle('color: rgba(calc(50 * 4), var(--cool), :5;); height: 100px;');
        expect(result).toEqual({ color: 'rgba(calc(50 * 4), var(--cool), :5;)', height: '100px' });
    });
    it('should hyphenate style properties from camel case', function () {
        var result = styling_1.parseStyle('borderWidth: 200px');
        expect(result).toEqual({
            'border-width': '200px',
        });
    });
    describe('quote chomping', function () {
        it('should remove the start and end quotes', function () {
            expect(styling_1.stripUnnecessaryQuotes('\'foo bar\'')).toEqual('foo bar');
            expect(styling_1.stripUnnecessaryQuotes('"foo bar"')).toEqual('foo bar');
        });
        it('should not remove quotes if the quotes are not at the start and end', function () {
            expect(styling_1.stripUnnecessaryQuotes('foo bar')).toEqual('foo bar');
            expect(styling_1.stripUnnecessaryQuotes('   foo bar   ')).toEqual('   foo bar   ');
            expect(styling_1.stripUnnecessaryQuotes('\'foo\' bar')).toEqual('\'foo\' bar');
            expect(styling_1.stripUnnecessaryQuotes('foo "bar"')).toEqual('foo "bar"');
        });
        it('should not remove quotes if there are inner quotes', function () {
            var str = '"Verdana", "Helvetica"';
            expect(styling_1.stripUnnecessaryQuotes(str)).toEqual(str);
        });
    });
    describe('camelCasing => hyphenation', function () {
        it('should convert a camel-cased value to a hyphenated value', function () {
            expect(styling_1.hyphenate('fooBar')).toEqual('foo-bar');
            expect(styling_1.hyphenate('fooBarMan')).toEqual('foo-bar-man');
            expect(styling_1.hyphenate('-fooBar-man')).toEqual('-foo-bar-man');
        });
        it('should make everything lowercase', function () { expect(styling_1.hyphenate('-WebkitAnimation')).toEqual('-webkit-animation'); });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R5bGluZ19zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdC9yZW5kZXIzL3N0eWxpbmdfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILDBEQUE2RjtBQUU3RixRQUFRLENBQUMsMEJBQTBCLEVBQUU7SUFDbkMsRUFBRSxDQUFDLHFDQUFxQyxFQUFFO1FBQ3hDLElBQU0sT0FBTyxHQUFHLG9CQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDL0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUU1QixJQUFNLE9BQU8sR0FBRyxvQkFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ25DLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDOUIsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsNENBQTRDLEVBQUU7UUFDL0MsSUFBTSxNQUFNLEdBQUcsb0JBQVUsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO1FBQ2hFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUM7SUFDMUUsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsbUNBQW1DLEVBQUU7UUFDdEMsSUFBTSxNQUFNLEdBQUcsb0JBQVUsQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO1FBQzVFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7SUFDNUUsQ0FBQyxDQUFDLENBQUM7SUFFSCxF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d0IsQ0FBQztZQUNyQyxNQUFNLENBQUMsZ0NBQXNCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyw0QkFBNEIsRUFBRTtRQUNyQyxFQUFFLENBQUMsMERBQTBELEVBQUU7WUFDN0QsTUFBTSxDQUFDLG1CQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDL0MsTUFBTSxDQUFDLG1CQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDdEQsTUFBTSxDQUFDLG1CQUFTLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDM0QsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsa0NBQWtDLEVBQ2xDLGNBQVEsTUFBTSxDQUFDLG1CQUFTLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEYsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9