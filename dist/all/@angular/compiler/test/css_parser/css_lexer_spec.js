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
var css_lexer_1 = require("../../src/css_parser/css_lexer");
(function () {
    function tokenize(code, trackComments, mode) {
        if (trackComments === void 0) { trackComments = false; }
        if (mode === void 0) { mode = css_lexer_1.CssLexerMode.ALL; }
        var scanner = new css_lexer_1.CssLexer().scan(code, trackComments);
        scanner.setMode(mode);
        var tokens = [];
        var output = scanner.scan();
        while (output != null) {
            var error = output.error;
            if (error != null) {
                throw css_lexer_1.cssScannerError(css_lexer_1.getToken(error), css_lexer_1.getRawMessage(error));
            }
            tokens.push(output.token);
            output = scanner.scan();
        }
        return tokens;
    }
    testing_internal_1.describe('CssLexer', function () {
        testing_internal_1.it('should lex newline characters as whitespace when whitespace mode is on', function () {
            var newlines = ['\n', '\r\n', '\r', '\f'];
            newlines.forEach(function (line) {
                var token = tokenize(line, false, css_lexer_1.CssLexerMode.ALL_TRACK_WS)[0];
                testing_internal_1.expect(token.type).toEqual(css_lexer_1.CssTokenType.Whitespace);
            });
        });
        testing_internal_1.it('should combined newline characters as one newline token when whitespace mode is on', function () {
            var newlines = ['\n', '\r\n', '\r', '\f'].join('');
            var tokens = tokenize(newlines, false, css_lexer_1.CssLexerMode.ALL_TRACK_WS);
            testing_internal_1.expect(tokens.length).toEqual(1);
            testing_internal_1.expect(tokens[0].type).toEqual(css_lexer_1.CssTokenType.Whitespace);
        });
        testing_internal_1.it('should not consider whitespace or newline values at all when whitespace mode is off', function () {
            var newlines = ['\n', '\r\n', '\r', '\f'].join('');
            var tokens = tokenize(newlines);
            testing_internal_1.expect(tokens.length).toEqual(0);
        });
        testing_internal_1.it('should lex simple selectors and their inner properties', function () {
            var cssCode = '\n' +
                '  .selector { my-prop: my-value; }\n';
            var tokens = tokenize(cssCode);
            testing_internal_1.expect(tokens[0].type).toEqual(css_lexer_1.CssTokenType.Character);
            testing_internal_1.expect(tokens[0].strValue).toEqual('.');
            testing_internal_1.expect(tokens[1].type).toEqual(css_lexer_1.CssTokenType.Identifier);
            testing_internal_1.expect(tokens[1].strValue).toEqual('selector');
            testing_internal_1.expect(tokens[2].type).toEqual(css_lexer_1.CssTokenType.Character);
            testing_internal_1.expect(tokens[2].strValue).toEqual('{');
            testing_internal_1.expect(tokens[3].type).toEqual(css_lexer_1.CssTokenType.Identifier);
            testing_internal_1.expect(tokens[3].strValue).toEqual('my-prop');
            testing_internal_1.expect(tokens[4].type).toEqual(css_lexer_1.CssTokenType.Character);
            testing_internal_1.expect(tokens[4].strValue).toEqual(':');
            testing_internal_1.expect(tokens[5].type).toEqual(css_lexer_1.CssTokenType.Identifier);
            testing_internal_1.expect(tokens[5].strValue).toEqual('my-value');
            testing_internal_1.expect(tokens[6].type).toEqual(css_lexer_1.CssTokenType.Character);
            testing_internal_1.expect(tokens[6].strValue).toEqual(';');
            testing_internal_1.expect(tokens[7].type).toEqual(css_lexer_1.CssTokenType.Character);
            testing_internal_1.expect(tokens[7].strValue).toEqual('}');
        });
        testing_internal_1.it('should capture the column and line values for each token', function () {
            var cssCode = '#id {\n' +
                '  prop:value;\n' +
                '}';
            var tokens = tokenize(cssCode);
            // #
            testing_internal_1.expect(tokens[0].type).toEqual(css_lexer_1.CssTokenType.Character);
            testing_internal_1.expect(tokens[0].column).toEqual(0);
            testing_internal_1.expect(tokens[0].line).toEqual(0);
            // id
            testing_internal_1.expect(tokens[1].type).toEqual(css_lexer_1.CssTokenType.Identifier);
            testing_internal_1.expect(tokens[1].column).toEqual(1);
            testing_internal_1.expect(tokens[1].line).toEqual(0);
            // {
            testing_internal_1.expect(tokens[2].type).toEqual(css_lexer_1.CssTokenType.Character);
            testing_internal_1.expect(tokens[2].column).toEqual(4);
            testing_internal_1.expect(tokens[2].line).toEqual(0);
            // prop
            testing_internal_1.expect(tokens[3].type).toEqual(css_lexer_1.CssTokenType.Identifier);
            testing_internal_1.expect(tokens[3].column).toEqual(2);
            testing_internal_1.expect(tokens[3].line).toEqual(1);
            // :
            testing_internal_1.expect(tokens[4].type).toEqual(css_lexer_1.CssTokenType.Character);
            testing_internal_1.expect(tokens[4].column).toEqual(6);
            testing_internal_1.expect(tokens[4].line).toEqual(1);
            // value
            testing_internal_1.expect(tokens[5].type).toEqual(css_lexer_1.CssTokenType.Identifier);
            testing_internal_1.expect(tokens[5].column).toEqual(7);
            testing_internal_1.expect(tokens[5].line).toEqual(1);
            // ;
            testing_internal_1.expect(tokens[6].type).toEqual(css_lexer_1.CssTokenType.Character);
            testing_internal_1.expect(tokens[6].column).toEqual(12);
            testing_internal_1.expect(tokens[6].line).toEqual(1);
            // }
            testing_internal_1.expect(tokens[7].type).toEqual(css_lexer_1.CssTokenType.Character);
            testing_internal_1.expect(tokens[7].column).toEqual(0);
            testing_internal_1.expect(tokens[7].line).toEqual(2);
        });
        testing_internal_1.it('should lex quoted strings and escape accordingly', function () {
            var cssCode = 'prop: \'some { value } \\\' that is quoted\'';
            var tokens = tokenize(cssCode);
            testing_internal_1.expect(tokens[0].type).toEqual(css_lexer_1.CssTokenType.Identifier);
            testing_internal_1.expect(tokens[1].type).toEqual(css_lexer_1.CssTokenType.Character);
            testing_internal_1.expect(tokens[2].type).toEqual(css_lexer_1.CssTokenType.String);
            testing_internal_1.expect(tokens[2].strValue).toEqual('\'some { value } \\\' that is quoted\'');
        });
        testing_internal_1.it('should treat attribute operators as regular characters', function () {
            tokenize('^|~+*').forEach(function (token) { testing_internal_1.expect(token.type).toEqual(css_lexer_1.CssTokenType.Character); });
        });
        testing_internal_1.it('should lex numbers properly and set them as numbers', function () {
            var cssCode = '0 1 -2 3.0 -4.001';
            var tokens = tokenize(cssCode);
            testing_internal_1.expect(tokens[0].type).toEqual(css_lexer_1.CssTokenType.Number);
            testing_internal_1.expect(tokens[0].strValue).toEqual('0');
            testing_internal_1.expect(tokens[1].type).toEqual(css_lexer_1.CssTokenType.Number);
            testing_internal_1.expect(tokens[1].strValue).toEqual('1');
            testing_internal_1.expect(tokens[2].type).toEqual(css_lexer_1.CssTokenType.Number);
            testing_internal_1.expect(tokens[2].strValue).toEqual('-2');
            testing_internal_1.expect(tokens[3].type).toEqual(css_lexer_1.CssTokenType.Number);
            testing_internal_1.expect(tokens[3].strValue).toEqual('3.0');
            testing_internal_1.expect(tokens[4].type).toEqual(css_lexer_1.CssTokenType.Number);
            testing_internal_1.expect(tokens[4].strValue).toEqual('-4.001');
        });
        testing_internal_1.it('should lex @keywords', function () {
            var cssCode = '@import()@something';
            var tokens = tokenize(cssCode);
            testing_internal_1.expect(tokens[0].type).toEqual(css_lexer_1.CssTokenType.AtKeyword);
            testing_internal_1.expect(tokens[0].strValue).toEqual('@import');
            testing_internal_1.expect(tokens[1].type).toEqual(css_lexer_1.CssTokenType.Character);
            testing_internal_1.expect(tokens[1].strValue).toEqual('(');
            testing_internal_1.expect(tokens[2].type).toEqual(css_lexer_1.CssTokenType.Character);
            testing_internal_1.expect(tokens[2].strValue).toEqual(')');
            testing_internal_1.expect(tokens[3].type).toEqual(css_lexer_1.CssTokenType.AtKeyword);
            testing_internal_1.expect(tokens[3].strValue).toEqual('@something');
        });
        testing_internal_1.it('should still lex a number even if it has a dimension suffix', function () {
            var cssCode = '40% is 40 percent';
            var tokens = tokenize(cssCode);
            testing_internal_1.expect(tokens[0].type).toEqual(css_lexer_1.CssTokenType.Number);
            testing_internal_1.expect(tokens[0].strValue).toEqual('40');
            testing_internal_1.expect(tokens[1].type).toEqual(css_lexer_1.CssTokenType.Character);
            testing_internal_1.expect(tokens[1].strValue).toEqual('%');
            testing_internal_1.expect(tokens[2].type).toEqual(css_lexer_1.CssTokenType.Identifier);
            testing_internal_1.expect(tokens[2].strValue).toEqual('is');
            testing_internal_1.expect(tokens[3].type).toEqual(css_lexer_1.CssTokenType.Number);
            testing_internal_1.expect(tokens[3].strValue).toEqual('40');
        });
        testing_internal_1.it('should allow escaped character and unicode character-strings in CSS selectors', function () {
            var cssCode = '\\123456 .some\\thing \{\}';
            var tokens = tokenize(cssCode);
            testing_internal_1.expect(tokens[0].type).toEqual(css_lexer_1.CssTokenType.Identifier);
            testing_internal_1.expect(tokens[0].strValue).toEqual('\\123456');
            testing_internal_1.expect(tokens[1].type).toEqual(css_lexer_1.CssTokenType.Character);
            testing_internal_1.expect(tokens[2].type).toEqual(css_lexer_1.CssTokenType.Identifier);
            testing_internal_1.expect(tokens[2].strValue).toEqual('some\\thing');
        });
        testing_internal_1.it('should distinguish identifiers and numbers from special characters', function () {
            var cssCode = 'one*two=-4+three-4-equals_value$';
            var tokens = tokenize(cssCode);
            testing_internal_1.expect(tokens[0].type).toEqual(css_lexer_1.CssTokenType.Identifier);
            testing_internal_1.expect(tokens[0].strValue).toEqual('one');
            testing_internal_1.expect(tokens[1].type).toEqual(css_lexer_1.CssTokenType.Character);
            testing_internal_1.expect(tokens[1].strValue).toEqual('*');
            testing_internal_1.expect(tokens[2].type).toEqual(css_lexer_1.CssTokenType.Identifier);
            testing_internal_1.expect(tokens[2].strValue).toEqual('two');
            testing_internal_1.expect(tokens[3].type).toEqual(css_lexer_1.CssTokenType.Character);
            testing_internal_1.expect(tokens[3].strValue).toEqual('=');
            testing_internal_1.expect(tokens[4].type).toEqual(css_lexer_1.CssTokenType.Number);
            testing_internal_1.expect(tokens[4].strValue).toEqual('-4');
            testing_internal_1.expect(tokens[5].type).toEqual(css_lexer_1.CssTokenType.Character);
            testing_internal_1.expect(tokens[5].strValue).toEqual('+');
            testing_internal_1.expect(tokens[6].type).toEqual(css_lexer_1.CssTokenType.Identifier);
            testing_internal_1.expect(tokens[6].strValue).toEqual('three-4-equals_value');
            testing_internal_1.expect(tokens[7].type).toEqual(css_lexer_1.CssTokenType.Character);
            testing_internal_1.expect(tokens[7].strValue).toEqual('$');
        });
        testing_internal_1.it('should filter out comments and whitespace by default', function () {
            var cssCode = '.selector /* comment */ { /* value */ }';
            var tokens = tokenize(cssCode);
            testing_internal_1.expect(tokens[0].strValue).toEqual('.');
            testing_internal_1.expect(tokens[1].strValue).toEqual('selector');
            testing_internal_1.expect(tokens[2].strValue).toEqual('{');
            testing_internal_1.expect(tokens[3].strValue).toEqual('}');
        });
        testing_internal_1.it('should track comments when the flag is set to true', function () {
            var cssCode = '.selector /* comment */ { /* value */ }';
            var trackComments = true;
            var tokens = tokenize(cssCode, trackComments, css_lexer_1.CssLexerMode.ALL_TRACK_WS);
            testing_internal_1.expect(tokens[0].strValue).toEqual('.');
            testing_internal_1.expect(tokens[1].strValue).toEqual('selector');
            testing_internal_1.expect(tokens[2].strValue).toEqual(' ');
            testing_internal_1.expect(tokens[3].type).toEqual(css_lexer_1.CssTokenType.Comment);
            testing_internal_1.expect(tokens[3].strValue).toEqual('/* comment */');
            testing_internal_1.expect(tokens[4].strValue).toEqual(' ');
            testing_internal_1.expect(tokens[5].strValue).toEqual('{');
            testing_internal_1.expect(tokens[6].strValue).toEqual(' ');
            testing_internal_1.expect(tokens[7].type).toEqual(css_lexer_1.CssTokenType.Comment);
            testing_internal_1.expect(tokens[7].strValue).toEqual('/* value */');
        });
        testing_internal_1.describe('Selector Mode', function () {
            testing_internal_1.it('should throw an error if a selector is being parsed while in the wrong mode', function () {
                var cssCode = '.class > tag';
                var capturedMessage = null;
                try {
                    tokenize(cssCode, false, css_lexer_1.CssLexerMode.STYLE_BLOCK);
                }
                catch (e) {
                    capturedMessage = css_lexer_1.getRawMessage(e);
                }
                testing_internal_1.expect(capturedMessage).toMatch(/Unexpected character \[\>\] at column 0:7 in expression/g);
                capturedMessage = null;
                try {
                    tokenize(cssCode, false, css_lexer_1.CssLexerMode.SELECTOR);
                }
                catch (e) {
                    capturedMessage = css_lexer_1.getRawMessage(e);
                }
                testing_internal_1.expect(capturedMessage).toEqual(null);
            });
        });
        testing_internal_1.describe('Attribute Mode', function () {
            testing_internal_1.it('should consider attribute selectors as valid input and throw when an invalid modifier is used', function () {
                function tokenizeAttr(modifier) {
                    var cssCode = 'value' + modifier + '=\'something\'';
                    return tokenize(cssCode, false, css_lexer_1.CssLexerMode.ATTRIBUTE_SELECTOR);
                }
                testing_internal_1.expect(tokenizeAttr('*').length).toEqual(4);
                testing_internal_1.expect(tokenizeAttr('|').length).toEqual(4);
                testing_internal_1.expect(tokenizeAttr('^').length).toEqual(4);
                testing_internal_1.expect(tokenizeAttr('$').length).toEqual(4);
                testing_internal_1.expect(tokenizeAttr('~').length).toEqual(4);
                testing_internal_1.expect(tokenizeAttr('').length).toEqual(3);
                testing_internal_1.expect(function () { tokenizeAttr('+'); }).toThrow();
            });
        });
        testing_internal_1.describe('Media Query Mode', function () {
            testing_internal_1.it('should validate media queries with a reduced subset of valid characters', function () {
                function tokenizeQuery(code) {
                    return tokenize(code, false, css_lexer_1.CssLexerMode.MEDIA_QUERY);
                }
                // the reason why the numbers are so high is because MediaQueries keep
                // track of the whitespace values
                testing_internal_1.expect(tokenizeQuery('(prop: value)').length).toEqual(5);
                testing_internal_1.expect(tokenizeQuery('(prop: value) and (prop2: value2)').length).toEqual(11);
                testing_internal_1.expect(tokenizeQuery('tv and (prop: value)').length).toEqual(7);
                testing_internal_1.expect(tokenizeQuery('print and ((prop: value) or (prop2: value2))').length).toEqual(15);
                testing_internal_1.expect(tokenizeQuery('(content: \'something $ crazy inside &\')').length).toEqual(5);
                testing_internal_1.expect(function () { tokenizeQuery('(max-height: 10 + 20)'); }).toThrow();
                testing_internal_1.expect(function () { tokenizeQuery('(max-height: fifty < 100)'); }).toThrow();
            });
        });
        testing_internal_1.describe('Pseudo Selector Mode', function () {
            testing_internal_1.it('should validate pseudo selector identifiers with a reduced subset of valid characters', function () {
                function tokenizePseudo(code, withArgs) {
                    if (withArgs === void 0) { withArgs = false; }
                    var mode = withArgs ? css_lexer_1.CssLexerMode.PSEUDO_SELECTOR_WITH_ARGUMENTS :
                        css_lexer_1.CssLexerMode.PSEUDO_SELECTOR;
                    return tokenize(code, false, mode);
                }
                testing_internal_1.expect(tokenizePseudo('hover').length).toEqual(1);
                testing_internal_1.expect(tokenizePseudo('focus').length).toEqual(1);
                testing_internal_1.expect(tokenizePseudo('lang(en-us)', true).length).toEqual(4);
                testing_internal_1.expect(function () { tokenizePseudo('lang(something:broken)', true); }).toThrow();
                testing_internal_1.expect(function () { tokenizePseudo('not(.selector)', true); }).toThrow();
            });
        });
        testing_internal_1.describe('Style Block Mode', function () {
            testing_internal_1.it('should style blocks with a reduced subset of valid characters', function () {
                function tokenizeStyles(code) {
                    return tokenize(code, false, css_lexer_1.CssLexerMode.STYLE_BLOCK);
                }
                testing_internal_1.expect(tokenizeStyles("\n          key: value;\n          prop: 100;\n          style: value3!important;\n        ").length).toEqual(14);
                testing_internal_1.expect(function () { return tokenizeStyles(" key$: value; "); }).toThrow();
                testing_internal_1.expect(function () { return tokenizeStyles(" key: value$; "); }).toThrow();
                testing_internal_1.expect(function () { return tokenizeStyles(" key: value + 10; "); }).toThrow();
                testing_internal_1.expect(function () { return tokenizeStyles(" key: &value; "); }).toThrow();
            });
        });
    });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3NzX2xleGVyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0L2Nzc19wYXJzZXIvY3NzX2xleGVyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCwrRUFBZ0Y7QUFDaEYsNERBQXdJO0FBRXhJLENBQUM7SUFDQyxrQkFDSSxJQUFZLEVBQUUsYUFBOEIsRUFDNUMsSUFBcUM7UUFEdkIsOEJBQUEsRUFBQSxxQkFBOEI7UUFDNUMscUJBQUEsRUFBQSxPQUFxQix3QkFBWSxDQUFDLEdBQUc7UUFDdkMsSUFBTSxPQUFPLEdBQUcsSUFBSSxvQkFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztRQUN6RCxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXRCLElBQU0sTUFBTSxHQUFlLEVBQUUsQ0FBQztRQUM5QixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDNUIsT0FBTyxNQUFNLElBQUksSUFBSSxFQUFFO1lBQ3JCLElBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDM0IsSUFBSSxLQUFLLElBQUksSUFBSSxFQUFFO2dCQUNqQixNQUFNLDJCQUFlLENBQUMsb0JBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSx5QkFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7YUFDOUQ7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQixNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ3pCO1FBRUQsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVELDJCQUFRLENBQUMsVUFBVSxFQUFFO1FBQ25CLHFCQUFFLENBQUMsd0VBQXdFLEVBQUU7WUFDM0UsSUFBTSxRQUFR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QUMsU0FBUyxDQUFDLENBQUM7WUFDdkQseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLHlCQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVsQyxLQUFLO1lBQ0wseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLHdCQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDeEQseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLHlCQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVsQyxJQUFJO1lBQ0oseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLHdCQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDdkQseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLHlCQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVsQyxPQUFPO1lBQ1AseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLHdCQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDeEQseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLHlCQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVsQyxJQUFJO1lBQ0oseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLHdCQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDdkQseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLHlCQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVsQyxRQUFRO1lBQ1IseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLHdCQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDeEQseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLHlCQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVsQyxJQUFJO1lBQ0oseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLHdCQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDdkQseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3JDLHlCQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVsQyxJQUFJO1lBQ0os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