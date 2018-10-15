"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var testing_internal_1 = require("../../../core/testing/src/testing_internal");
var css_parser_1 = require("../../src/css_parser/css_parser");
function assertTokens(tokens, valuesArr) {
    for (var i = 0; i < tokens.length; i++) {
        testing_internal_1.expect(tokens[i].strValue == valuesArr[i]);
    }
}
exports.assertTokens = assertTokens;
{
    testing_internal_1.describe('CssParser', function () {
        function parse(css) {
            return new css_parser_1.CssParser().parse(css, 'some-fake-css-file.css');
        }
        function makeAst(css) {
            var output = parse(css);
            var errors = output.errors;
            if (errors.length > 0) {
                throw new Error(errors.map(function (error) { return error.msg; }).join(', '));
            }
            return output.ast;
        }
        testing_internal_1.it('should parse CSS into a stylesheet Ast', function () {
            var styles = '.selector { prop: value123; }';
            var ast = makeAst(styles);
            testing_internal_1.expect(ast.rules.length).toEqual(1);
            var rule = ast.rules[0];
            var selector = rule.selectors[0];
            testing_internal_1.expect(selector.strValue).toEqual('.selector');
            var block = rule.block;
            testing_internal_1.expect(block.entries.length).toEqual(1);
            var definition = block.entries[0];
            testing_internal_1.expect(definition.property.strValue).toEqual('prop');
            var value = definition.value;
            testing_internal_1.expect(value.tokens[0].strValue).toEqual('value123');
        });
        testing_internal_1.it('should parse multiple CSS selectors sharing the same set of styles', function () {
            var styles = "\n        .class, #id, tag, [attr], key + value, * value, :-moz-any-link {\n          prop: value123;\n        }\n      ";
            var ast = makeAst(styles);
            testing_internal_1.expect(ast.rules.length).toEqual(1);
            var rule = ast.rules[0];
            testing_internal_1.expect(rule.selectors.length).toBe(7);
            var classRule = rule.selectors[0];
            var idRule = rule.selectors[1];
            var tagRule = rule.selectors[2];
            var attrRule = rule.selectors[3];
            var plusOpRule = rule.selectors[4];
            var starOpRule = rule.selectors[5];
            var mozRule = rule.selectors[6];
            assertTokens(classRule.selectorParts[0].tokens, ['.', 'class']);
            assertTokens(idRule.selectorParts[0].tokens, ['.', 'class']);
            assertTokens(attrRule.selectorParts[0].tokens, ['[', 'attr', ']']);
            assertTokens(plusOpRule.selectorParts[0].tokens, ['key']);
            testing_internal_1.expect(plusOpRule.selectorParts[0].operator.strValue).toEqual('+');
            assertTokens(plusOpRule.selectorParts[1].tokens, ['value']);
            assertTokens(starOpRule.selectorParts[0].tokens, ['*']);
            assertTokens(starOpRule.selectorParts[1].tokens, ['value']);
            assertTokens(mozRule.selectorParts[0].pseudoSelectors[0].tokens, [':', '-moz-any-link']);
            var style1 = rule.block.entries[0];
            testing_internal_1.expect(style1.property.strValue).toEqual('prop');
            assertTokens(style1.value.tokens, ['value123']);
        });
        testing_internal_1.it('should parse keyframe rules', function () {
            var styles = "\n        @keyframes rotateMe {\n          from {\n            transform: rotate(-360deg);\n          }\n          50% {\n            transform: rotate(0deg);\n          }\n          to {\n            transform: rotate(360deg);\n          }\n        }\n      ";
            var ast = makeAst(styles);
            testing_internal_1.expect(ast.rules.length).toEqual(1);
            var rule = ast.rules[0];
            testing_internal_1.expect(rule.name.strValue).toEqual('rotateMe');
            var block = rule.block;
            var fromRule = block.entries[0];
            testing_internal_1.expect(fromRule.name.strValue).toEqual('from');
            var fromStyle = fromRule.block.entries[0];
            testing_internal_1.expect(fromStyle.property.strValue).toEqual('transform');
            assertTokens(fromStyle.value.tokens, ['rotate', '(', '-360', 'deg', ')']);
            var midRule = block.entries[1];
            testing_internal_1.expect(midRule.name.strValue).toEqual('50%');
            var midStyle = midRule.block.entries[0];
            testing_internal_1.expect(midStyle.property.strValue).toEqual('transform');
            assertTokens(midStyle.value.tokens, ['rotate', '(', '0', 'deg', ')']);
            var toRule = block.entries[2];
            testing_internal_1.expect(toRule.name.strValue).toEqual('to');
            var toStyle = toRule.block.entries[0];
            testing_internal_1.expect(toStyle.property.strValue).toEqual('transform');
            assertTokens(toStyle.value.tokens, ['rotate', '(', '360', 'deg', ')']);
        });
        testing_internal_1.it('should parse media queries into a stylesheet Ast', function () {
            var styles = "\n        @media all and (max-width:100px) {\n          .selector {\n            prop: value123;\n          }\n        }\n      ";
            var ast = makeAst(styles);
            testing_internal_1.expect(ast.rules.length).toEqual(1);
            var rule = ast.rules[0];
            assertTokens(rule.query.tokens, ['all', 'and', '(', 'max-width', ':', '100', 'px', ')']);
            var block = rule.block;
            testing_internal_1.expect(block.entries.length).toEqual(1);
            var rule2 = block.entries[0];
            testing_internal_1.expect(rule2.selectors[0].strValue).toEqual('.selector');
            var block2 = rule2.block;
            testing_internal_1.expect(block2.entries.length).toEqual(1);
        });
        testing_internal_1.it('should parse inline CSS values', function () {
            var styles = "\n        @import url('remote.css');\n        @charset \"UTF-8\";\n        @namespace ng url(http://angular.io/namespace/ng);\n      ";
            var ast = makeAst(styles);
            var importRule = ast.rules[0];
            testing_internal_1.expect(importRule.type).toEqual(css_parser_1.BlockType.Import);
            assertTokens(importRule.value.tokens, ['url', '(', 'remote', '.', 'css', ')']);
            var charsetRule = ast.rules[1];
            testing_internal_1.expect(charsetRule.type).toEqual(css_parser_1.BlockType.Charset);
            assertTokens(charsetRule.value.tokens, ['UTF-8']);
            var namespaceRule = ast.rules[2];
            testing_internal_1.expect(namespaceRule.type).toEqual(css_parser_1.BlockType.Namespace);
            assertTokens(namespaceRule.value.tokens, ['ng', 'url', '(', 'http://angular.io/namespace/ng', ')']);
        });
        testing_internal_1.it('should parse CSS values that contain functions and leave the inner function data untokenized', function () {
            var styles = "\n        .class {\n          background: url(matias.css);\n          animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);\n          height: calc(100% - 50px);\n          background-image: linear-gradient( 45deg, rgba(100, 0, 0, 0.5), black );\n        }\n      ";
            var ast = makeAst(styles);
            testing_internal_1.expect(ast.rules.length).toEqual(1);
            var defs = ast.rules[0].block.entries;
            testing_internal_1.expect(defs.length).toEqual(4);
            assertTokens(defs[0].value.tokens, ['url', '(', 'matias.css', ')']);
            assertTokens(defs[1].value.tokens, ['cubic-bezier', '(', '0.755, 0.050, 0.855, 0.060', ')']);
            assertTokens(defs[2].value.tokens, ['calc', '(', '100% - 50px', ')']);
            assertTokens(defs[3].value.tokens, ['linear-gradient', '(', '45deg, rgba(100, 0, 0, 0.5), black', ')']);
        });
        testing_internal_1.it('should parse un-named block-level CSS values', function () {
            var styles = "\n        @font-face {\n          font-family: \"Matias\";\n          font-weight: bold;\n          src: url(font-face.ttf);\n        }\n        @viewport {\n          max-width: 100px;\n          min-height: 1000px;\n        }\n      ";
            var ast = makeAst(styles);
            var fontFaceRule = ast.rules[0];
            testing_internal_1.expect(fontFaceRule.type).toEqual(css_parser_1.BlockType.FontFace);
            testing_internal_1.expect(fontFaceRule.block.entries.length).toEqual(3);
            var viewportRule = ast.rules[1];
            testing_internal_1.expect(viewportRule.type).toEqual(css_parser_1.BlockType.Viewport);
            testing_internal_1.expect(viewportRule.block.entries.length).toEqual(2);
        });
        testing_internal_1.it('should parse multiple levels of semicolons', function () {
            var styles = "\n        ;;;\n        @import url('something something')\n        ;;;;;;;;\n        ;;;;;;;;\n        ;@font-face {\n          ;src   :   url(font-face.ttf);;;;;;;;\n          ;;;-webkit-animation:my-animation\n        };;;\n        @media all and (max-width:100px)\n        {;\n          .selector {prop: value123;};\n          ;.selector2{prop:1}}\n      ";
            var ast = makeAst(styles);
            var importRule = ast.rules[0];
            testing_internal_1.expect(importRule.type).toEqual(css_parser_1.BlockType.Import);
            assertTokens(importRule.value.tokens, ['url', '(', 'something something', ')']);
            var fontFaceRule = ast.rules[1];
            testing_internal_1.expect(fontFaceRule.type).toEqual(css_parser_1.BlockType.FontFace);
            testing_internal_1.expect(fontFaceRule.block.entries.length).toEqual(2);
            var mediaQueryRule = ast.rules[2];
            assertTokens(mediaQueryRule.query.tokens, ['all', 'and', '(', 'max-width', ':', '100', 'px', ')']);
            testing_internal_1.expect(mediaQueryRule.block.entries.length).toEqual(2);
        });
        testing_internal_1.it('should throw an error if an unknown @value block rule is parsed', function () {
            var styles = "\n        @matias { hello: there; }\n      ";
            testing_internal_1.expect(function () {
                makeAst(styles);
            }).toThrowError(/^CSS Parse Error: The CSS "at" rule "@matias" is not allowed to used here/g);
        });
        testing_internal_1.it('should parse empty rules', function () {
            var styles = "\n        .empty-rule { }\n        .somewhat-empty-rule { /* property: value; */ }\n        .non-empty-rule { property: value; }\n      ";
            var ast = makeAst(styles);
            var rules = ast.rules;
            testing_internal_1.expect(rules[0].block.entries.length).toEqual(0);
            testing_internal_1.expect(rules[1].block.entries.length).toEqual(0);
            testing_internal_1.expect(rules[2].block.entries.length).toEqual(1);
        });
        testing_internal_1.it('should parse the @document rule', function () {
            var styles = "\n        @document url(http://www.w3.org/),\n                       url-prefix(http://www.w3.org/Style/),\n                       domain(mozilla.org),\n                       regexp(\"https:.*\")\n        {\n          /* CSS rules here apply to:\n             - The page \"http://www.w3.org/\".\n             - Any page whose URL begins with \"http://www.w3.org/Style/\"\n             - Any page whose URL's host is \"mozilla.org\" or ends with\n               \".mozilla.org\"\n             - Any page whose URL starts with \"https:\" */\n\n          /* make the above-mentioned pages really ugly */\n          body {\n            color: purple;\n            background: yellow;\n          }\n        }\n      ";
            var ast = makeAst(styles);
            var rules = ast.rules;
            var documentRule = rules[0];
            testing_internal_1.expect(documentRule.type).toEqual(css_parser_1.BlockType.Document);
            var rule = documentRule.block.entries[0];
            testing_internal_1.expect(rule.strValue).toEqual('body');
        });
        testing_internal_1.it('should parse the @page rule', function () {
            var styles = "\n        @page one {\n          .selector { prop: value; }\n        }\n        @page two {\n          .selector2 { prop: value2; }\n        }\n      ";
            var ast = makeAst(styles);
            var rules = ast.rules;
            var pageRule1 = rules[0];
            testing_internal_1.expect(pageRule1.query.strValue).toEqual('@page one');
            testing_internal_1.expect(pageRule1.query.tokens[0].strValue).toEqual('one');
            testing_internal_1.expect(pageRule1.type).toEqual(css_parser_1.BlockType.Page);
            var pageRule2 = rules[1];
            testing_internal_1.expect(pageRule2.query.strValue).toEqual('@page two');
            testing_internal_1.expect(pageRule2.query.tokens[0].strValue).toEqual('two');
            testing_internal_1.expect(pageRule2.type).toEqual(css_parser_1.BlockType.Page);
            var selectorOne = pageRule1.block.entries[0];
            testing_internal_1.expect(selectorOne.strValue).toEqual('.selector');
            var selectorTwo = pageRule2.block.entries[0];
            testing_internal_1.expect(selectorTwo.strValue).toEqual('.selector2');
        });
        testing_internal_1.it('should parse the @supports rule', function () {
            var styles = "\n        @supports (animation-name: \"rotate\") {\n          a:hover { animation: rotate 1s; }\n        }\n      ";
            var ast = makeAst(styles);
            var rules = ast.rules;
            var supportsRule = rules[0];
            assertTokens(supportsRule.query.tokens, ['(', 'animation-name', ':', 'rotate', ')']);
            testing_internal_1.expect(supportsRule.type).toEqual(css_parser_1.BlockType.Supports);
            var selectorOne = supportsRule.block.entries[0];
            testing_internal_1.expect(selectorOne.strValue).toEqual('a:hover');
        });
        testing_internal_1.it('should collect multiple errors during parsing', function () {
            var styles = "\n        .class$value { something: something }\n        @custom { something: something }\n        #id { cool^: value }\n      ";
            var output = parse(styles);
            testing_internal_1.expect(output.errors.length).toEqual(3);
        });
        testing_internal_1.it('should recover from selector errors and continue parsing', function () {
            var styles = "\n        tag& { key: value; }\n        .%tag { key: value; }\n        #tag$ { key: value; }\n      ";
            var output = parse(styles);
            var errors = output.errors;
            var ast = output.ast;
            testing_internal_1.expect(errors.length).toEqual(3);
            testing_internal_1.expect(ast.rules.length).toEqual(3);
            var rule1 = ast.rules[0];
            testing_internal_1.expect(rule1.selectors[0].strValue).toEqual('tag&');
            testing_internal_1.expect(rule1.block.entries.length).toEqual(1);
            var rule2 = ast.rules[1];
            testing_internal_1.expect(rule2.selectors[0].strValue).toEqual('.%tag');
            testing_internal_1.expect(rule2.block.entries.length).toEqual(1);
            var rule3 = ast.rules[2];
            testing_internal_1.expect(rule3.selectors[0].strValue).toEqual('#tag$');
            testing_internal_1.expect(rule3.block.entries.length).toEqual(1);
        });
        testing_internal_1.it('should throw an error when parsing invalid CSS Selectors', function () {
            var styles = '.class[[prop%=value}] { style: val; }';
            var output = parse(styles);
            var errors = output.errors;
            testing_internal_1.expect(errors.length).toEqual(3);
            testing_internal_1.expect(errors[0].msg).toMatch(/Unexpected character \[\[\] at column 0:7/g);
            testing_internal_1.expect(errors[1].msg).toMatch(/Unexpected character \[%\] at column 0:12/g);
            testing_internal_1.expect(errors[2].msg).toMatch(/Unexpected character \[}\] at column 0:19/g);
        });
        testing_internal_1.it('should throw an error if an attribute selector is not closed properly', function () {
            var styles = '.class[prop=value { style: val; }';
            var output = parse(styles);
            var errors = output.errors;
            testing_internal_1.expect(errors[0].msg).toMatch(/Unbalanced CSS attribute selector at column 0:12/g);
        });
        testing_internal_1.it('should throw an error if a pseudo function selector is not closed properly', function () {
            var styles = 'body:lang(en { key:value; }';
            var output = parse(styles);
            var errors = output.errors;
            testing_internal_1.expect(errors[0].msg)
                .toMatch(/Character does not match expected Character value \("{" should match "\)"\)/);
        });
        testing_internal_1.it('should raise an error when a semi colon is missing from a CSS style/pair that isn\'t the last entry', function () {
            var styles = ".class {\n        color: red\n        background: blue\n      }";
            var output = parse(styles);
            var errors = output.errors;
            testing_internal_1.expect(errors.length).toEqual(1);
            testing_internal_1.expect(errors[0].msg)
                .toMatch(/The CSS key\/value definition did not end with a semicolon at column 1:15/g);
        });
        testing_internal_1.it('should parse the inner value of a :not() pseudo-selector as a CSS selector', function () {
            var styles = "div:not(.ignore-this-div) {\n        prop: value;\n      }";
            var output = parse(styles);
            var errors = output.errors;
            var ast = output.ast;
            testing_internal_1.expect(errors.length).toEqual(0);
            var rule1 = ast.rules[0];
            testing_internal_1.expect(rule1.selectors.length).toEqual(1);
            var simpleSelector = rule1.selectors[0].selectorParts[0];
            assertTokens(simpleSelector.tokens, ['div']);
            var pseudoSelector = simpleSelector.pseudoSelectors[0];
            testing_internal_1.expect(pseudoSelector.name).toEqual('not');
            assertTokens(pseudoSelector.tokens, ['.', 'ignore-this-div']);
        });
        testing_internal_1.it('should parse the inner selectors of a :host-context selector', function () {
            var styles = "body > :host-context(.a, .b, .c:hover) {\n        prop: value;\n      }";
            var output = parse(styles);
            var errors = output.errors;
            var ast = output.ast;
            testing_internal_1.expect(errors.length).toEqual(0);
            var rule1 = ast.rules[0];
            testing_internal_1.expect(rule1.selectors.length).toEqual(1);
            var simpleSelector = rule1.selectors[0].selectorParts[1];
            var innerSelectors = simpleSelector.pseudoSelectors[0].innerSelectors;
            assertTokens(innerSelectors[0].selectorParts[0].tokens, ['.', 'a']);
            assertTokens(innerSelectors[1].selectorParts[0].tokens, ['.', 'b']);
            var finalSelector = innerSelectors[2].selectorParts[0];
            assertTokens(finalSelector.tokens, ['.', 'c', ':', 'hover']);
            assertTokens(finalSelector.pseudoSelectors[0].tokens, [':', 'hover']);
        });
        testing_internal_1.it('should raise parse errors when CSS key/value pairs are invalid', function () {
            var styles = ".class {\n        background color: value;\n        color: value\n        font-size;\n        font-weight\n      }";
            var output = parse(styles);
            var errors = output.errors;
            testing_internal_1.expect(errors.length).toEqual(4);
            testing_internal_1.expect(errors[0].msg)
                .toMatch(/Identifier does not match expected Character value \("color" should match ":"\) at column 1:19/g);
            testing_internal_1.expect(errors[1].msg)
                .toMatch(/The CSS key\/value definition did not end with a semicolon at column 2:15/g);
            testing_internal_1.expect(errors[2].msg)
                .toMatch(/The CSS property was not paired with a style value at column 3:8/g);
            testing_internal_1.expect(errors[3].msg)
                .toMatch(/The CSS property was not paired with a style value at column 4:8/g);
        });
        testing_internal_1.it('should recover from CSS key/value parse errors', function () {
            var styles = "\n        .problem-class { background color: red; color: white; }\n        .good-boy-class { background-color: red; color: white; }\n       ";
            var output = parse(styles);
            var ast = output.ast;
            testing_internal_1.expect(ast.rules.length).toEqual(2);
            var rule1 = ast.rules[0];
            testing_internal_1.expect(rule1.block.entries.length).toEqual(2);
            var style1 = rule1.block.entries[0];
            testing_internal_1.expect(style1.property.strValue).toEqual('background color');
            assertTokens(style1.value.tokens, ['red']);
            var style2 = rule1.block.entries[1];
            testing_internal_1.expect(style2.property.strValue).toEqual('color');
            assertTokens(style2.value.tokens, ['white']);
        });
        testing_internal_1.describe('location offsets', function () {
            var styles;
            function assertMatchesOffsetAndChar(location, expectedOffset, expectedChar) {
                testing_internal_1.expect(location.offset).toEqual(expectedOffset);
                testing_internal_1.expect(styles[expectedOffset]).toEqual(expectedChar);
            }
            testing_internal_1.it('should collect the source span location of each AST node with regular selectors', function () {
                styles = '.problem-class { border-top-right: 1px; color: white; }\n';
                styles += '#good-boy-rule_ { background-color: #fe4; color: teal; }';
                var output = parse(styles);
                var ast = output.ast;
                assertMatchesOffsetAndChar(ast.location.start, 0, '.');
                assertMatchesOffsetAndChar(ast.location.end, 111, '}');
                var rule1 = ast.rules[0];
                assertMatchesOffsetAndChar(rule1.location.start, 0, '.');
                assertMatchesOffsetAndChar(rule1.location.end, 54, '}');
                var rule2 = ast.rules[1];
                assertMatchesOffsetAndChar(rule2.location.start, 56, '#');
                assertMatchesOffsetAndChar(rule2.location.end, 111, '}');
                var selector1 = rule1.selectors[0];
                assertMatchesOffsetAndChar(selector1.location.start, 0, '.');
                assertMatchesOffsetAndChar(selector1.location.end, 1, 'p'); // problem-class
                var selector2 = rule2.selectors[0];
                assertMatchesOffsetAndChar(selector2.location.start, 56, '#');
                assertMatchesOffsetAndChar(selector2.location.end, 57, 'g'); // good-boy-rule_
                var block1 = rule1.block;
                assertMatchesOffsetAndChar(block1.location.start, 15, '{');
                assertMatchesOffsetAndChar(block1.location.end, 54, '}');
                var block2 = rule2.block;
                assertMatchesOffsetAndChar(block2.location.start, 72, '{');
                assertMatchesOffsetAndChar(block2.location.end, 111, '}');
                var block1def1 = block1.entries[0];
                assertMatchesOffsetAndChar(block1def1.location.start, 17, 'b'); // border-top-right
                assertMatchesOffsetAndChar(block1def1.location.end, 36, 'p'); // px
                var block1def2 = block1.entries[1];
                assertMatchesOffsetAndChar(block1def2.location.start, 40, 'c'); // color
                assertMatchesOffsetAndChar(block1def2.location.end, 47, 'w'); // white
                var block2def1 = block2.entries[0];
                assertMatchesOffsetAndChar(block2def1.location.start, 74, 'b'); // background-color
                assertMatchesOffsetAndChar(block2def1.location.end, 93, 'f'); // fe4
                var block2def2 = block2.entries[1];
                assertMatchesOffsetAndChar(block2def2.location.start, 98, 'c'); // color
                assertMatchesOffsetAndChar(block2def2.location.end, 105, 't'); // teal
                var block1value1 = block1def1.value;
                assertMatchesOffsetAndChar(block1value1.location.start, 35, '1');
                assertMatchesOffsetAndChar(block1value1.location.end, 36, 'p');
                var block1value2 = block1def2.value;
                assertMatchesOffsetAndChar(block1value2.location.start, 47, 'w');
                assertMatchesOffsetAndChar(block1value2.location.end, 47, 'w');
                var block2value1 = block2def1.value;
                assertMatchesOffsetAndChar(block2value1.location.start, 92, '#');
                assertMatchesOffsetAndChar(block2value1.location.end, 93, 'f');
                var block2value2 = block2def2.value;
                assertMatchesOffsetAndChar(block2value2.location.start, 105, 't');
                assertMatchesOffsetAndChar(block2value2.location.end, 105, 't');
            });
            testing_internal_1.it('should collect the source span location of each AST node with media query data', function () {
                styles = '@media (all and max-width: 100px) { a { display:none; } }';
                var output = parse(styles);
                var ast = output.ast;
                var mediaQuery = ast.rules[0];
                assertMatchesOffsetAndChar(mediaQuery.location.start, 0, '@');
                assertMatchesOffsetAndChar(mediaQuery.location.end, 56, '}');
                var predicate = mediaQuery.query;
                assertMatchesOffsetAndChar(predicate.location.start, 0, '@');
                assertMatchesOffsetAndChar(predicate.location.end, 32, ')');
                var rule = mediaQuery.block.entries[0];
                assertMatchesOffsetAndChar(rule.location.start, 36, 'a');
                assertMatchesOffsetAndChar(rule.location.end, 54, '}');
            });
            testing_internal_1.it('should collect the source span location of each AST node with keyframe data', function () {
                styles = '@keyframes rotateAndZoomOut { ';
                styles += 'from { transform: rotate(0deg); } ';
                styles += '100% { transform: rotate(360deg) scale(2); }';
                styles += '}';
                var output = parse(styles);
                var ast = output.ast;
                var keyframes = ast.rules[0];
                assertMatchesOffsetAndChar(keyframes.location.start, 0, '@');
                assertMatchesOffsetAndChar(keyframes.location.end, 108, '}');
                var step1 = keyframes.block.entries[0];
                assertMatchesOffsetAndChar(step1.location.start, 30, 'f');
                assertMatchesOffsetAndChar(step1.location.end, 62, '}');
                var step2 = keyframes.block.entries[1];
                assertMatchesOffsetAndChar(step2.location.start, 64, '1');
                assertMatchesOffsetAndChar(step2.location.end, 107, '}');
            });
            testing_internal_1.it('should collect the source span location of each AST node with an inline rule', function () {
                styles = '@import url(something.css)';
                var output = parse(styles);
                var ast = output.ast;
                var rule = ast.rules[0];
                assertMatchesOffsetAndChar(rule.location.start, 0, '@');
                assertMatchesOffsetAndChar(rule.location.end, 25, ')');
                var value = rule.value;
                assertMatchesOffsetAndChar(value.location.start, 8, 'u');
                assertMatchesOffsetAndChar(value.location.end, 25, ')');
            });
            testing_internal_1.it('should property collect the start/end locations with an invalid stylesheet', function () {
                styles = '#id { something: value';
                var output = parse(styles);
                var ast = output.ast;
                assertMatchesOffsetAndChar(ast.location.start, 0, '#');
                assertMatchesOffsetAndChar(ast.location.end, 22, undefined);
            });
        });
        testing_internal_1.it('should parse minified CSS content properly', function () {
            // this code was taken from the angular.io webpage's CSS code
            var styles = "\n.is-hidden{display:none!important}\n.is-visible{display:block!important}\n.is-visually-hidden{height:1px;width:1px;overflow:hidden;opacity:0.01;position:absolute;bottom:0;right:0;z-index:1}\n.grid-fluid,.grid-fixed{margin:0 auto}\n.grid-fluid .c1,.grid-fixed .c1,.grid-fluid .c2,.grid-fixed .c2,.grid-fluid .c3,.grid-fixed .c3,.grid-fluid .c4,.grid-fixed .c4,.grid-fluid .c5,.grid-fixed .c5,.grid-fluid .c6,.grid-fixed .c6,.grid-fluid .c7,.grid-fixed .c7,.grid-fluid .c8,.grid-fixed .c8,.grid-fluid .c9,.grid-fixed .c9,.grid-fluid .c10,.grid-fixed .c10,.grid-fluid .c11,.grid-fixed .c11,.grid-fluid .c12,.grid-fixed .c12{display:inline;float:left}\n.grid-fluid .c1.grid-right,.grid-fixed .c1.grid-right,.grid-fluid .c2.grid-right,.grid-fixed .c2.grid-right,.grid-fluid .c3.grid-right,.grid-fixed .c3.grid-right,.grid-fluid .c4.grid-right,.grid-fixed .c4.grid-right,.grid-fluid .c5.grid-right,.grid-fixed .c5.grid-right,.grid-fluid .c6.grid-right,.grid-fixed .c6.grid-right,.grid-fluid .c7.grid-right,.grid-fixed .c7.grid-right,.grid-fluid .c8.grid-right,.grid-fixed .c8.grid-right,.grid-fluid .c9.grid-right,.grid-fixed .c9.grid-right,.grid-fluid .c10.grid-right,.grid-fixed .c10.grid-right,.grid-fluid .c11.grid-right,.grid-fixed .c11.grid-right,.grid-fluid .c12.grid-right,.grid-fixed .c12.grid-right{float:right}\n.grid-fluid .c1.nb,.grid-fixed .c1.nb,.grid-fluid .c2.nb,.grid-fixed .c2.nb,.grid-fluid .c3.nb,.grid-fixed .c3.nb,.grid-fluid .c4.nb,.grid-fixed .c4.nb,.grid-fluid .c5.nb,.grid-fixed .c5.nb,.grid-fluid .c6.nb,.grid-fixed .c6.nb,.grid-fluid .c7.nb,.grid-fixed .c7.nb,.grid-fluid .c8.nb,.grid-fixed .c8.nb,.grid-fluid .c9.nb,.grid-fixed .c9.nb,.grid-fluid .c10.nb,.grid-fixed .c10.nb,.grid-fluid .c11.nb,.grid-fixed .c11.nb,.grid-fluid .c12.nb,.grid-fixed .c12.nb{margin-left:0}\n.grid-fluid .c1.na,.grid-fixed .c1.na,.grid-fluid .c2.na,.grid-fixed .c2.na,.grid-fluid .c3.na,.grid-fixed .c3.na,.grid-fluid .c4.na,.grid-fixed .c4.na,.grid-fluid .c5.na,.grid-fixed .c5.na,.grid-fluid .c6.na,.grid-fixed .c6.na,.grid-fluid .c7.na,.grid-fixed .c7.na,.grid-fluid .c8.na,.grid-fixed .c8.na,.grid-fluid .c9.na,.grid-fixed .c9.na,.grid-fluid .c10.na,.grid-fixed .c10.na,.grid-fluid .c11.na,.grid-fixed .c11.na,.grid-fluid .c12.na,.grid-fixed .c12.na{margin-right:0}\n       ";
            var output = parse(styles);
            var errors = output.errors;
            testing_internal_1.expect(errors.length).toEqual(0);
            var ast = output.ast;
            testing_internal_1.expect(ast.rules.length).toEqual(8);
        });
        testing_internal_1.it('should parse a snippet of keyframe code from animate.css properly', function () {
            // this code was taken from the angular.io webpage's CSS code
            var styles = "\n@charset \"UTF-8\";\n\n/*!\n * animate.css -http://daneden.me/animate\n * Version - 3.5.1\n * Licensed under the MIT license - http://opensource.org/licenses/MIT\n *\n * Copyright (c) 2016 Daniel Eden\n */\n\n.animated {\n  -webkit-animation-duration: 1s;\n  animation-duration: 1s;\n  -webkit-animation-fill-mode: both;\n  animation-fill-mode: both;\n}\n\n.animated.infinite {\n  -webkit-animation-iteration-count: infinite;\n  animation-iteration-count: infinite;\n}\n\n.animated.hinge {\n  -webkit-animation-duration: 2s;\n  animation-duration: 2s;\n}\n\n.animated.flipOutX,\n.animated.flipOutY,\n.animated.bounceIn,\n.animated.bounceOut {\n  -webkit-animation-duration: .75s;\n  animation-duration: .75s;\n}\n\n@-webkit-keyframes bounce {\n  from, 20%, 53%, 80%, to {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);\n    animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);\n    -webkit-transform: translate3d(0,0,0);\n    transform: translate3d(0,0,0);\n  }\n\n  40%, 43% {\n    -webkit-animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);\n    animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);\n    -webkit-transform: translate3d(0, -30px, 0);\n    transform: translate3d(0, -30px, 0);\n  }\n\n  70% {\n    -webkit-animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);\n    animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);\n    -webkit-transform: translate3d(0, -15px, 0);\n    transform: translate3d(0, -15px, 0);\n  }\n\n  90% {\n    -webkit-transform: translate3d(0,-4px,0);\n    transform: translate3d(0,-4px,0);\n  }\n}\n       ";
            var output = parse(styles);
            var errors = output.errors;
            testing_internal_1.expect(errors.length).toEqual(0);
            var ast = output.ast;
            testing_internal_1.expect(ast.rules.length).toEqual(6);
            var finalRule = ast.rules[ast.rules.length - 1];
            testing_internal_1.expect(finalRule.type).toEqual(css_parser_1.BlockType.Keyframes);
            testing_internal_1.expect(finalRule.block.entries.length).toEqual(4);
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3NzX3BhcnNlcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdC9jc3NfcGFyc2VyL2Nzc19wYXJzZXJfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUdILCtFQUFnRjtBQUVoRiw4REFBK0c7QUFHL0csc0JBQTZCLE1BQWtCLEVBQUUsU0FBbUI7SUFDbEUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDdEMseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzVDO0FBQ0gsQ0FBQztBQUpELG9DQUlDO0FBRUQ7SUFDRSwyQkFBUSxDQUFDLFdBQVcsRUFBRTtRQUNwQixlQUFlLEdBQVc7WUFDeEIsT0FBTyxJQUFJLHNCQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLHdCQUF3QixDQUFDLENBQUM7UUFDOUQsQ0FBQztRQUVELGlCQUFpQixHQUFXO1lBQzFCLElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMxQixJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQzdCLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ3JCLE1BQU0sSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFDLEtBQW9CLElBQUssT0FBQSxLQUFLLENBQUMsR0FBRyxFQUFULENBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQzdFO1lBQ0QsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ3BCLENBQUM7UUFFRCxxQkFBRSxDQUFDLHdDQUF3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