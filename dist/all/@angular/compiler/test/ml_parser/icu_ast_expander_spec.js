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
var icu_ast_expander_1 = require("../../src/ml_parser/icu_ast_expander");
var ast_spec_utils_1 = require("./ast_spec_utils");
{
    describe('Expander', function () {
        function expand(template) {
            var htmlParser = new html_parser_1.HtmlParser();
            var res = htmlParser.parse(template, 'url', true);
            return icu_ast_expander_1.expandNodes(res.rootNodes);
        }
        it('should handle the plural expansion form', function () {
            var res = expand("{messages.length, plural,=0 {zero<b>bold</b>}}");
            expect(ast_spec_utils_1.humanizeNodes(res.nodes)).toEqual([
                [html.Element, 'ng-container', 0],
                [html.Attribute, '[ngPlural]', 'messages.length'],
                [html.Element, 'ng-template', 1],
                [html.Attribute, 'ngPluralCase', '=0'],
                [html.Text, 'zero', 2],
                [html.Element, 'b', 2],
                [html.Text, 'bold', 3],
            ]);
        });
        it('should handle nested expansion forms', function () {
            var res = expand("{messages.length, plural, =0 { {p.gender, select, male {m}} }}");
            expect(ast_spec_utils_1.humanizeNodes(res.nodes)).toEqual([
                [html.Element, 'ng-container', 0],
                [html.Attribute, '[ngPlural]', 'messages.length'],
                [html.Element, 'ng-template', 1],
                [html.Attribute, 'ngPluralCase', '=0'],
                [html.Element, 'ng-container', 2],
                [html.Attribute, '[ngSwitch]', 'p.gender'],
                [html.Element, 'ng-template', 3],
                [html.Attribute, 'ngSwitchCase', 'male'],
                [html.Text, 'm', 4],
                [html.Text, ' ', 2],
            ]);
        });
        it('should correctly set source code positions', function () {
            var nodes = expand("{messages.length, plural,=0 {<b>bold</b>}}").nodes;
            var container = nodes[0];
            expect(container.sourceSpan.start.col).toEqual(0);
            expect(container.sourceSpan.end.col).toEqual(42);
            expect(container.startSourceSpan.start.col).toEqual(0);
            expect(container.startSourceSpan.end.col).toEqual(42);
            expect(container.endSourceSpan.start.col).toEqual(0);
            expect(container.endSourceSpan.end.col).toEqual(42);
            var switchExp = container.attrs[0];
            expect(switchExp.sourceSpan.start.col).toEqual(1);
            expect(switchExp.sourceSpan.end.col).toEqual(16);
            var template = container.children[0];
            expect(template.sourceSpan.start.col).toEqual(25);
            expect(template.sourceSpan.end.col).toEqual(41);
            var switchCheck = template.attrs[0];
            expect(switchCheck.sourceSpan.start.col).toEqual(25);
            expect(switchCheck.sourceSpan.end.col).toEqual(28);
            var b = template.children[0];
            expect(b.sourceSpan.start.col).toEqual(29);
            expect(b.endSourceSpan.end.col).toEqual(40);
        });
        it('should handle other special forms', function () {
            var res = expand("{person.gender, select, male {m} other {default}}");
            expect(ast_spec_utils_1.humanizeNodes(res.nodes)).toEqual([
                [html.Element, 'ng-container', 0],
                [html.Attribute, '[ngSwitch]', 'person.gender'],
                [html.Element, 'ng-template', 1],
                [html.Attribute, 'ngSwitchCase', 'male'],
                [html.Text, 'm', 2],
                [html.Element, 'ng-template', 1],
                [html.Attribute, 'ngSwitchDefault', ''],
                [html.Text, 'default', 2],
            ]);
        });
        it('should parse an expansion form as a tag single child', function () {
            var res = expand("<div><span>{a, b, =4 {c}}</span></div>");
            expect(ast_spec_utils_1.humanizeNodes(res.nodes)).toEqual([
                [html.Element, 'div', 0],
                [html.Element, 'span', 1],
                [html.Element, 'ng-container', 2],
                [html.Attribute, '[ngSwitch]', 'a'],
                [html.Element, 'ng-template', 3],
                [html.Attribute, 'ngSwitchCase', '=4'],
                [html.Text, 'c', 4],
            ]);
        });
        describe('errors', function () {
            it('should error on unknown plural cases', function () {
                expect(humanizeErrors(expand('{n, plural, unknown {-}}').errors)).toEqual([
                    "Plural cases should be \"=<number>\" or one of zero, one, two, few, many, other",
                ]);
            });
        });
    });
}
function humanizeErrors(errors) {
    return errors.map(function (error) { return error.msg; });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWN1X2FzdF9leHBhbmRlcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdC9tbF9wYXJzZXIvaWN1X2FzdF9leHBhbmRlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsOENBQWdEO0FBQ2hELCtEQUEyRDtBQUMzRCx5RUFBa0Y7QUFHbEYsbURBQStDO0FBRS9DO0lBQ0UsUUFBUSxDQUFDLFVBQVUsRUFBRTtRQUNuQixnQkFBZ0IsUUFBZ0I7WUFDOUIsSUFBTSxVQUFVLEdBQUcsSUFBSSx3QkFBVSxFQUFFLENBQUM7WUFDcEMsSUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3BELE9BQU8sOEJBQVcsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDcEMsQ0FBQztRQUVELEVBQUUsQ0FBQyx5Q0FBeUMsRUFBRTtZQUM1QyxJQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsZ0RBQWdELENBQUMsQ0FBQztZQUVyRSxNQUFNLENBQUMsOEJBQWEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3ZDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDO2dCQUNqQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLGlCQUFpQixDQUFDO2dCQUNqRCxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLENBQUMsQ0FBQztnQkFDaEMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGNBQWMsRUFBRSxJQUFJLENBQUM7Z0JBQ3RDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO2dCQUN0QixDQUFDLElBQUksQ0FBQyxPQUFP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