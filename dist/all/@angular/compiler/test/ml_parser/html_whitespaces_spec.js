"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var html = require("../../src/ml_parser/ast");
var html_parser_1 = require("../../src/ml_parser/html_parser");
var html_whitespaces_1 = require("../../src/ml_parser/html_whitespaces");
var ast_spec_utils_1 = require("./ast_spec_utils");
{
    describe('removeWhitespaces', function () {
        function parseAndRemoveWS(template) {
            return ast_spec_utils_1.humanizeDom(html_whitespaces_1.removeWhitespaces(new html_parser_1.HtmlParser().parse(template, 'TestComp')));
        }
        it('should remove blank text nodes', function () {
            expect(parseAndRemoveWS(' ')).toEqual([]);
            expect(parseAndRemoveWS('\n')).toEqual([]);
            expect(parseAndRemoveWS('\t')).toEqual([]);
            expect(parseAndRemoveWS('    \t    \n ')).toEqual([]);
        });
        it('should remove whitespaces (space, tab, new line) between elements', function () {
            expect(parseAndRemoveWS('<br>  <br>\t<br>\n<br>')).toEqual([
                [html.Element, 'br', 0],
                [html.Element, 'br', 0],
                [html.Element, 'br', 0],
                [html.Element, 'br', 0],
            ]);
        });
        it('should remove whitespaces from child text nodes', function () {
            expect(parseAndRemoveWS('<div><span> </span></div>')).toEqual([
                [html.Element, 'div', 0],
                [html.Element, 'span', 1],
            ]);
        });
        it('should remove whitespaces from the beginning and end of a template', function () {
            expect(parseAndRemoveWS(" <br>\t")).toEqual([
                [html.Element, 'br', 0],
            ]);
        });
        it('should convert &ngsp; to a space and preserve it', function () {
            expect(parseAndRemoveWS('<div><span>foo</span>&ngsp;<span>bar</span></div>')).toEqual([
                [html.Element, 'div', 0],
                [html.Element, 'span', 1],
                [html.Text, 'foo', 2],
                [html.Text, ' ', 1],
                [html.Element, 'span', 1],
                [html.Text, 'bar', 2],
            ]);
        });
        it('should replace multiple whitespaces with one space', function () {
            expect(parseAndRemoveWS('\n\n\nfoo\t\t\t')).toEqual([[html.Text, ' foo ', 0]]);
            expect(parseAndRemoveWS('   \n foo  \t ')).toEqual([[html.Text, ' foo ', 0]]);
        });
        it('should not replace &nbsp;', function () {
            expect(parseAndRemoveWS('&nbsp;')).toEqual([[html.Text, '\u00a0', 0]]);
        });
        it('should not replace sequences of &nbsp;', function () {
            expect(parseAndRemoveWS('&nbsp;&nbsp;foo&nbsp;&nbsp;')).toEqual([
                [html.Text, '\u00a0\u00a0foo\u00a0\u00a0', 0]
            ]);
        });
        it('should not replace single tab and newline with spaces', function () {
            expect(parseAndRemoveWS('\nfoo')).toEqual([[html.Text, '\nfoo', 0]]);
            expect(parseAndRemoveWS('\tfoo')).toEqual([[html.Text, '\tfoo', 0]]);
        });
        it('should preserve single whitespaces between interpolations', function () {
            expect(parseAndRemoveWS("{{fooExp}} {{barExp}}")).toEqual([
                [html.Text, '{{fooExp}} {{barExp}}', 0],
            ]);
            expect(parseAndRemoveWS("{{fooExp}}\t{{barExp}}")).toEqual([
                [html.Text, '{{fooExp}}\t{{barExp}}', 0],
            ]);
            expect(parseAndRemoveWS("{{fooExp}}\n{{barExp}}")).toEqual([
                [html.Text, '{{fooExp}}\n{{barExp}}', 0],
            ]);
        });
        it('should preserve whitespaces around interpolations', function () {
            expect(parseAndRemoveWS(" {{exp}} ")).toEqual([
                [html.Text, ' {{exp}} ', 0],
            ]);
        });
        it('should preserve whitespaces inside <pre> elements', function () {
            expect(parseAndRemoveWS("<pre><strong>foo</strong>\n<strong>bar</strong></pre>")).toEqual([
                [html.Element, 'pre', 0],
                [html.Element, 'strong', 1],
                [html.Text, 'foo', 2],
                [html.Text, '\n', 1],
                [html.Element, 'strong', 1],
                [html.Text, 'bar', 2],
            ]);
        });
        it('should skip whitespace trimming in <textarea>', function () {
            expect(parseAndRemoveWS("<textarea>foo\n\n  bar</textarea>")).toEqual([
                [html.Element, 'textarea', 0],
                [html.Text, 'foo\n\n  bar', 1],
            ]);
        });
        it("should preserve whitespaces inside elements annotated with " + html_whitespaces_1.PRESERVE_WS_ATTR_NAME, function () {
            expect(parseAndRemoveWS("<div " + html_whitespaces_1.PRESERVE_WS_ATTR_NAME + "><img> <img></div>")).toEqual([
                [html.Element, 'div', 0],
                [html.Element, 'img', 1],
                [html.Text, ' ', 1],
                [html.Element, 'img', 1],
            ]);
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbF93aGl0ZXNwYWNlc19zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdC9tbF9wYXJzZXIvaHRtbF93aGl0ZXNwYWNlc19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsOENBQWdEO0FBQ2hELCtEQUEyRDtBQUMzRCx5RUFBOEY7QUFFOUYsbURBQTZDO0FBRTdDO0lBQ0UsUUFBUSxDQUFDLG1CQUFtQixFQUFFO1FBRTVCLDBCQUEwQixRQUFnQjtZQUN4QyxPQUFPLDRCQUFXLENBQUMsb0NBQWlCLENBQUMsSUFBSSx3QkFBVSxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEYsQ0FBQztRQUVELEVBQUUsQ0FBQyxnQ0FBZ0MsRUFBRTtZQUNuQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDMUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzNDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMzQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDeEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsbUVBQW1FLEVBQUU7WUFDdEUsTUFBTSxDQUFDLGdCQUFnQixDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3pELENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO2dCQUN2QixDQUFDLElB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