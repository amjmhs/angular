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
var lexer_1 = require("../../src/ml_parser/lexer");
var ast_spec_utils_1 = require("./ast_spec_utils");
{
    describe('HtmlParser', function () {
        var parser;
        beforeEach(function () { parser = new html_parser_1.HtmlParser(); });
        describe('parse', function () {
            describe('text nodes', function () {
                it('should parse root level text nodes', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('a', 'TestComp'))).toEqual([[html.Text, 'a', 0]]);
                });
                it('should parse text nodes inside regular elements', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<div>a</div>', 'TestComp'))).toEqual([
                        [html.Element, 'div', 0], [html.Text, 'a', 1]
                    ]);
                });
                it('should parse text nodes inside <ng-template> elements', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<ng-template>a</ng-template>', 'TestComp'))).toEqual([
                        [html.Element, 'ng-template', 0], [html.Text, 'a', 1]
                    ]);
                });
                it('should parse CDATA', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<![CDATA[text]]>', 'TestComp'))).toEqual([
                        [html.Text, 'text', 0]
                    ]);
                });
            });
            describe('elements', function () {
                it('should parse root level elements', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<div></div>', 'TestComp'))).toEqual([
                        [html.Element, 'div', 0]
                    ]);
                });
                it('should parse elements inside of regular elements', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<div><span></span></div>', 'TestComp'))).toEqual([
                        [html.Element, 'div', 0], [html.Element, 'span', 1]
                    ]);
                });
                it('should parse elements inside  <ng-template> elements', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<ng-template><span></span></ng-template>', 'TestComp')))
                        .toEqual([[html.Element, 'ng-template', 0], [html.Element, 'span', 1]]);
                });
                it('should support void elements', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<link rel="author license" href="/about">', 'TestComp')))
                        .toEqual([
                        [html.Element, 'link', 0],
                        [html.Attribute, 'rel', 'author license'],
                        [html.Attribute, 'href', '/about'],
                    ]);
                });
                it('should not error on void elements from HTML5 spec', function () {
                    // <base> - it can be present in head only
                    // <meta> - it can be present in head only
                    // <command> - obsolete
                    // <keygen> - obsolete
                    ['<map><area></map>', '<div><br></div>', '<colgroup><col></colgroup>',
                        '<div><embed></div>', '<div><hr></div>', '<div><img></div>', '<div><input></div>',
                        '<object><param>/<object>', '<audio><source></audio>', '<audio><track></audio>',
                        '<p><wbr></p>',
                    ].forEach(function (html) { expect(parser.parse(html, 'TestComp').errors).toEqual([]); });
                });
                it('should close void elements on text nodes', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<p>before<br>after</p>', 'TestComp'))).toEqual([
                        [html.Element, 'p', 0],
                        [html.Text, 'before', 1],
                        [html.Element, 'br', 1],
                        [html.Text, 'after', 1],
                    ]);
                });
                it('should support optional end tags', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<div><p>1<p>2</div>', 'TestComp'))).toEqual([
                        [html.Element, 'div', 0],
                        [html.Element, 'p', 1],
                        [html.Text, '1', 2],
                        [html.Element, 'p', 1],
                        [html.Text, '2', 2],
                    ]);
                });
                it('should support nested elements', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<ul><li><ul><li></li></ul></li></ul>', 'TestComp')))
                        .toEqual([
                        [html.Element, 'ul', 0],
                        [html.Element, 'li', 1],
                        [html.Element, 'ul', 2],
                        [html.Element, 'li', 3],
                    ]);
                });
                it('should add the requiredParent', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<table><thead><tr head></tr></thead><tr noparent></tr><tbody><tr body></tr></tbody><tfoot><tr foot></tr></tfoot></table>', 'TestComp')))
                        .toEqual([
                        [html.Element, 'table', 0],
                        [html.Element, 'thead', 1],
                        [html.Element, 'tr', 2],
                        [html.Attribute, 'head', ''],
                        [html.Element, 'tbody', 1],
                        [html.Element, 'tr', 2],
                        [html.Attribute, 'noparent', ''],
                        [html.Element, 'tbody', 1],
                        [html.Element, 'tr', 2],
                        [html.Attribute, 'body', ''],
                        [html.Element, 'tfoot', 1],
                        [html.Element, 'tr', 2],
                        [html.Attribute, 'foot', ''],
                    ]);
                });
                it('should append the required parent considering ng-container', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<table><ng-container><tr></tr></ng-container></table>', 'TestComp')))
                        .toEqual([
                        [html.Element, 'table', 0],
                        [html.Element, 'tbody', 1],
                        [html.Element, 'ng-container', 2],
                        [html.Element, 'tr', 3],
                    ]);
                });
                it('should append the required parent considering top level ng-container', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<ng-container><tr></tr></ng-container><p></p>', 'TestComp')))
                        .toEqual([
                        [html.Element, 'ng-container', 0],
                        [html.Element, 'tr', 1],
                        [html.Element, 'p', 0],
                    ]);
                });
                it('should special case ng-container when adding a required parent', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<table><thead><ng-container><tr></tr></ng-container></thead></table>', 'TestComp')))
                        .toEqual([
                        [html.Element, 'table', 0],
                        [html.Element, 'thead', 1],
                        [html.Element, 'ng-container', 2],
                        [html.Element, 'tr', 3],
                    ]);
                });
                it('should not add the requiredParent when the parent is a <ng-template>', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<ng-template><tr></tr></ng-template>', 'TestComp')))
                        .toEqual([
                        [html.Element, 'ng-template', 0],
                        [html.Element, 'tr', 1],
                    ]);
                });
                // https://github.com/angular/angular/issues/5967
                it('should not add the requiredParent to a template root element', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<tr></tr>', 'TestComp'))).toEqual([
                        [html.Element, 'tr', 0],
                    ]);
                });
                it('should support explicit namespace', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<myns:div></myns:div>', 'TestComp'))).toEqual([
                        [html.Element, ':myns:div', 0]
                    ]);
                });
                it('should support implicit namespace', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<svg></svg>', 'TestComp'))).toEqual([
                        [html.Element, ':svg:svg', 0]
                    ]);
                });
                it('should propagate the namespace', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<myns:div><p></p></myns:div>', 'TestComp'))).toEqual([
                        [html.Element, ':myns:div', 0],
                        [html.Element, ':myns:p', 1],
                    ]);
                });
                it('should match closing tags case sensitive', function () {
                    var errors = parser.parse('<DiV><P></p></dIv>', 'TestComp').errors;
                    expect(errors.length).toEqual(2);
                    expect(humanizeErrors(errors)).toEqual([
                        [
                            'p',
                            'Unexpected closing tag "p". It may happen when the tag has already been closed by another tag. For more info see https://www.w3.org/TR/html5/syntax.html#closing-elements-that-have-implied-end-tags',
                            '0:8'
                        ],
                        [
                            'dIv',
                            'Unexpected closing tag "dIv". It may happen when the tag has already been closed by another tag. For more info see https://www.w3.org/TR/html5/syntax.html#closing-elements-that-have-implied-end-tags',
                            '0:12'
                        ],
                    ]);
                });
                it('should support self closing void elements', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<input />', 'TestComp'))).toEqual([
                        [html.Element, 'input', 0]
                    ]);
                });
                it('should support self closing foreign elements', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<math />', 'TestComp'))).toEqual([
                        [html.Element, ':math:math', 0]
                    ]);
                });
                it('should ignore LF immediately after textarea, pre and listing', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<p>\n</p><textarea>\n</textarea><pre>\n\n</pre><listing>\n\n</listing>', 'TestComp')))
                        .toEqual([
                        [html.Element, 'p', 0],
                        [html.Text, '\n', 1],
                        [html.Element, 'textarea', 0],
                        [html.Element, 'pre', 0],
                        [html.Text, '\n', 1],
                        [html.Element, 'listing', 0],
                        [html.Text, '\n', 1],
                    ]);
                });
            });
            describe('attributes', function () {
                it('should parse attributes on regular elements case sensitive', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<div kEy="v" key2=v2></div>', 'TestComp'))).toEqual([
                        [html.Element, 'div', 0],
                        [html.Attribute, 'kEy', 'v'],
                        [html.Attribute, 'key2', 'v2'],
                    ]);
                });
                it('should parse attributes without values', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<div k></div>', 'TestComp'))).toEqual([
                        [html.Element, 'div', 0],
                        [html.Attribute, 'k', ''],
                    ]);
                });
                it('should parse attributes on svg elements case sensitive', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<svg viewBox="0"></svg>', 'TestComp'))).toEqual([
                        [html.Element, ':svg:svg', 0],
                        [html.Attribute, 'viewBox', '0'],
                    ]);
                });
                it('should parse attributes on <ng-template> elements', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<ng-template k="v"></ng-template>', 'TestComp')))
                        .toEqual([
                        [html.Element, 'ng-template', 0],
                        [html.Attribute, 'k', 'v'],
                    ]);
                });
                it('should support namespace', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<svg:use xlink:href="Port" />', 'TestComp'))).toEqual([
                        [html.Element, ':svg:use', 0],
                        [html.Attribute, ':xlink:href', 'Port'],
                    ]);
                });
            });
            describe('comments', function () {
                it('should preserve comments', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<!-- comment --><div></div>', 'TestComp'))).toEqual([
                        [html.Comment, 'comment', 0],
                        [html.Element, 'div', 0],
                    ]);
                });
            });
            describe('expansion forms', function () {
                it('should parse out expansion forms', function () {
                    var parsed = parser.parse("<div>before{messages.length, plural, =0 {You have <b>no</b> messages} =1 {One {{message}}}}after</div>", 'TestComp', true);
                    expect(ast_spec_utils_1.humanizeDom(parsed)).toEqual([
                        [html.Element, 'div', 0],
                        [html.Text, 'before', 1],
                        [html.Expansion, 'messages.length', 'plural', 1],
                        [html.ExpansionCase, '=0', 2],
                        [html.ExpansionCase, '=1', 2],
                        [html.Text, 'after', 1],
                    ]);
                    var cases = parsed.rootNodes[0].children[1].cases;
                    expect(ast_spec_utils_1.humanizeDom(new html_parser_1.ParseTreeResult(cases[0].expression, []))).toEqual([
                        [html.Text, 'You have ', 0],
                        [html.Element, 'b', 0],
                        [html.Text, 'no', 1],
                        [html.Text, ' messages', 0],
                    ]);
                    expect(ast_spec_utils_1.humanizeDom(new html_parser_1.ParseTreeResult(cases[1].expression, []))).toEqual([[html.Text, 'One {{message}}', 0]]);
                });
                it('should parse out expansion forms', function () {
                    var parsed = parser.parse("<div><span>{a, plural, =0 {b}}</span></div>", 'TestComp', true);
                    expect(ast_spec_utils_1.humanizeDom(parsed)).toEqual([
                        [html.Element, 'div', 0],
                        [html.Element, 'span', 1],
                        [html.Expansion, 'a', 'plural', 2],
                        [html.ExpansionCase, '=0', 3],
                    ]);
                });
                it('should parse out nested expansion forms', function () {
                    var parsed = parser.parse("{messages.length, plural, =0 { {p.gender, select, male {m}} }}", 'TestComp', true);
                    expect(ast_spec_utils_1.humanizeDom(parsed)).toEqual([
                        [html.Expansion, 'messages.length', 'plural', 0],
                        [html.ExpansionCase, '=0', 1],
                    ]);
                    var firstCase = parsed.rootNodes[0].cases[0];
                    expect(ast_spec_utils_1.humanizeDom(new html_parser_1.ParseTreeResult(firstCase.expression, []))).toEqual([
                        [html.Expansion, 'p.gender', 'select', 0],
                        [html.ExpansionCase, 'male', 1],
                        [html.Text, ' ', 0],
                    ]);
                });
                it('should error when expansion form is not closed', function () {
                    var p = parser.parse("{messages.length, plural, =0 {one}", 'TestComp', true);
                    expect(humanizeErrors(p.errors)).toEqual([
                        [null, 'Invalid ICU message. Missing \'}\'.', '0:34']
                    ]);
                });
                it('should support ICU expressions with cases that contain numbers', function () {
                    var p = parser.parse("{sex, select, male {m} female {f} 0 {other}}", 'TestComp', true);
                    expect(p.errors.length).toEqual(0);
                });
                it('should error when expansion case is not closed', function () {
                    var p = parser.parse("{messages.length, plural, =0 {one", 'TestComp', true);
                    expect(humanizeErrors(p.errors)).toEqual([
                        [null, 'Invalid ICU message. Missing \'}\'.', '0:29']
                    ]);
                });
                it('should error when invalid html in the case', function () {
                    var p = parser.parse("{messages.length, plural, =0 {<b/>}", 'TestComp', true);
                    expect(humanizeErrors(p.errors)).toEqual([
                        ['b', 'Only void and foreign elements can be self closed "b"', '0:30']
                    ]);
                });
            });
            describe('source spans', function () {
                it('should store the location', function () {
                    expect(ast_spec_utils_1.humanizeDomSourceSpans(parser.parse('<div [prop]="v1" (e)="do()" attr="v2" noValue>\na\n</div>', 'TestComp')))
                        .toEqual([
                        [html.Element, 'div', 0, '<div [prop]="v1" (e)="do()" attr="v2" noValue>'],
                        [html.Attribute, '[prop]', 'v1', '[prop]="v1"'],
                        [html.Attribute, '(e)', 'do()', '(e)="do()"'],
                        [html.Attribute, 'attr', 'v2', 'attr="v2"'],
                        [html.Attribute, 'noValue', '', 'noValue'],
                        [html.Text, '\na\n', 1, '\na\n'],
                    ]);
                });
                it('should set the start and end source spans', function () {
                    var node = parser.parse('<div>a</div>', 'TestComp').rootNodes[0];
                    expect(node.startSourceSpan.start.offset).toEqual(0);
                    expect(node.startSourceSpan.end.offset).toEqual(5);
                    expect(node.endSourceSpan.start.offset).toEqual(6);
                    expect(node.endSourceSpan.end.offset).toEqual(12);
                });
                it('should support expansion form', function () {
                    expect(ast_spec_utils_1.humanizeDomSourceSpans(parser.parse('<div>{count, plural, =0 {msg}}</div>', 'TestComp', true)))
                        .toEqual([
                        [html.Element, 'div', 0, '<div>'],
                        [html.Expansion, 'count', 'plural', 1, '{count, plural, =0 {msg}}'],
                        [html.ExpansionCase, '=0', 2, '=0 {msg}'],
                    ]);
                });
                it('should not report a value span for an attribute without a value', function () {
                    var ast = parser.parse('<div bar></div>', 'TestComp');
                    expect(ast.rootNodes[0].attrs[0].valueSpan).toBeUndefined();
                });
                it('should report a value span for an attribute with a value', function () {
                    var ast = parser.parse('<div bar="12"></div>', 'TestComp');
                    var attr = ast.rootNodes[0].attrs[0];
                    expect(attr.valueSpan.start.offset).toEqual(9);
                    expect(attr.valueSpan.end.offset).toEqual(13);
                });
            });
            describe('visitor', function () {
                it('should visit text nodes', function () {
                    var result = ast_spec_utils_1.humanizeDom(parser.parse('text', 'TestComp'));
                    expect(result).toEqual([[html.Text, 'text', 0]]);
                });
                it('should visit element nodes', function () {
                    var result = ast_spec_utils_1.humanizeDom(parser.parse('<div></div>', 'TestComp'));
                    expect(result).toEqual([[html.Element, 'div', 0]]);
                });
                it('should visit attribute nodes', function () {
                    var result = ast_spec_utils_1.humanizeDom(parser.parse('<div id="foo"></div>', 'TestComp'));
                    expect(result).toContain([html.Attribute, 'id', 'foo']);
                });
                it('should visit all nodes', function () {
                    var result = parser.parse('<div id="foo"><span id="bar">a</span><span>b</span></div>', 'TestComp');
                    var accumulator = [];
                    var visitor = new /** @class */ (function () {
                        function class_1() {
                        }
                        class_1.prototype.visit = function (node, context) { accumulator.push(node); };
                        class_1.prototype.visitElement = function (element, context) {
                            html.visitAll(this, element.attrs);
                            html.visitAll(this, element.children);
                        };
                        class_1.prototype.visitAttribute = function (attribute, context) { };
                        class_1.prototype.visitText = function (text, context) { };
                        class_1.prototype.visitComment = function (comment, context) { };
                        class_1.prototype.visitExpansion = function (expansion, context) {
                            html.visitAll(this, expansion.cases);
                        };
                        class_1.prototype.visitExpansionCase = function (expansionCase, context) { };
                        return class_1;
                    }());
                    html.visitAll(visitor, result.rootNodes);
                    expect(accumulator.map(function (n) { return n.constructor; })).toEqual([
                        html.Element, html.Attribute, html.Element, html.Attribute, html.Text, html.Element,
                        html.Text
                    ]);
                });
                it('should skip typed visit if visit() returns a truthy value', function () {
                    var visitor = new /** @class */ (function () {
                        function class_2() {
                        }
                        class_2.prototype.visit = function (node, context) { return true; };
                        class_2.prototype.visitElement = function (element, context) { throw Error('Unexpected'); };
                        class_2.prototype.visitAttribute = function (attribute, context) {
                            throw Error('Unexpected');
                        };
                        class_2.prototype.visitText = function (text, context) { throw Error('Unexpected'); };
                        class_2.prototype.visitComment = function (comment, context) { throw Error('Unexpected'); };
                        class_2.prototype.visitExpansion = function (expansion, context) {
                            throw Error('Unexpected');
                        };
                        class_2.prototype.visitExpansionCase = function (expansionCase, context) {
                            throw Error('Unexpected');
                        };
                        return class_2;
                    }());
                    var result = parser.parse('<div id="foo"></div><div id="bar"></div>', 'TestComp');
                    var traversal = html.visitAll(visitor, result.rootNodes);
                    expect(traversal).toEqual([true, true]);
                });
            });
            describe('errors', function () {
                it('should report unexpected closing tags', function () {
                    var errors = parser.parse('<div></p></div>', 'TestComp').errors;
                    expect(errors.length).toEqual(1);
                    expect(humanizeErrors(errors)).toEqual([[
                            'p',
                            'Unexpected closing tag "p". It may happen when the tag has already been closed by another tag. For more info see https://www.w3.org/TR/html5/syntax.html#closing-elements-that-have-implied-end-tags',
                            '0:5'
                        ]]);
                });
                it('should report subsequent open tags without proper close tag', function () {
                    var errors = parser.parse('<div</div>', 'TestComp').errors;
                    expect(errors.length).toEqual(1);
                    expect(humanizeErrors(errors)).toEqual([[
                            'div',
                            'Unexpected closing tag "div". It may happen when the tag has already been closed by another tag. For more info see https://www.w3.org/TR/html5/syntax.html#closing-elements-that-have-implied-end-tags',
                            '0:4'
                        ]]);
                });
                it('should report closing tag for void elements', function () {
                    var errors = parser.parse('<input></input>', 'TestComp').errors;
                    expect(errors.length).toEqual(1);
                    expect(humanizeErrors(errors)).toEqual([
                        ['input', 'Void elements do not have end tags "input"', '0:7']
                    ]);
                });
                it('should report self closing html element', function () {
                    var errors = parser.parse('<p />', 'TestComp').errors;
                    expect(errors.length).toEqual(1);
                    expect(humanizeErrors(errors)).toEqual([
                        ['p', 'Only void and foreign elements can be self closed "p"', '0:0']
                    ]);
                });
                it('should report self closing custom element', function () {
                    var errors = parser.parse('<my-cmp />', 'TestComp').errors;
                    expect(errors.length).toEqual(1);
                    expect(humanizeErrors(errors)).toEqual([
                        ['my-cmp', 'Only void and foreign elements can be self closed "my-cmp"', '0:0']
                    ]);
                });
                it('should also report lexer errors', function () {
                    var errors = parser.parse('<!-err--><div></p></div>', 'TestComp').errors;
                    expect(errors.length).toEqual(2);
                    expect(humanizeErrors(errors)).toEqual([
                        [lexer_1.TokenType.COMMENT_START, 'Unexpected character "e"', '0:3'],
                        [
                            'p',
                            'Unexpected closing tag "p". It may happen when the tag has already been closed by another tag. For more info see https://www.w3.org/TR/html5/syntax.html#closing-elements-that-have-implied-end-tags',
                            '0:14'
                        ]
                    ]);
                });
            });
        });
    });
}
function humanizeErrors(errors) {
    return errors.map(function (e) {
        if (e instanceof html_parser_1.TreeError) {
            // Parser errors
            return [e.elementName, e.msg, ast_spec_utils_1.humanizeLineColumn(e.span.start)];
        }
        // Tokenizer errors
        return [e.tokenType, e.msg, ast_spec_utils_1.humanizeLineColumn(e.span.start)];
    });
}
exports.humanizeErrors = humanizeErrors;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbF9wYXJzZXJfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3Rlc3QvbWxfcGFyc2VyL2h0bWxfcGFyc2VyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw4Q0FBZ0Q7QUFDaEQsK0RBQXVGO0FBQ3ZGLG1EQUFvRDtBQUdwRCxtREFBeUY7QUFFekY7SUFDRSxRQUFRLENBQUMsWUFBWSxFQUFFO1FBQ3JCLElBQUksTUFBa0IsQ0FBQztRQUV2QixVQUFVLENBQUMsY0FBUSxNQUFNLEdBQUcsSUFBSSx3QkFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVqRCxRQUFRLENBQUMsT0FBTyxFQUFFO1lBQ2hCLFFBQVEsQ0FBQyxZQUFZLEVBQUU7Z0JBQ3JCLEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRTtvQkFDdkMsTUFBTSxDQUFDLDRCQUFXLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwRixDQUFDLENBQUMsQ0FBQztnQkFFSCxFQUFFLENBQUMsaURBQWlELEVBQUU7b0JBQ3BELE1BQU0sQ0FBQyw0QkFBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7d0JBQ3BFLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7cUJBQzlDLENBQUMsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztnQkFFSCxFQUFFLENBQUMsdURB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