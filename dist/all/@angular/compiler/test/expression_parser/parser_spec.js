"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ast_1 = require("@angular/compiler/src/expression_parser/ast");
var lexer_1 = require("@angular/compiler/src/expression_parser/lexer");
var parser_1 = require("@angular/compiler/src/expression_parser/parser");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
var unparser_1 = require("./utils/unparser");
var validator_1 = require("./utils/validator");
describe('parser', function () {
    describe('parseAction', function () {
        it('should parse numbers', function () { checkAction('1'); });
        it('should parse strings', function () {
            checkAction('\'1\'', '"1"');
            checkAction('"1"');
        });
        it('should parse null', function () { checkAction('null'); });
        it('should parse undefined', function () { checkAction('undefined'); });
        it('should parse unary - expressions', function () {
            checkAction('-1', '0 - 1');
            checkAction('+1', '1 - 0');
            checkAction("-'1'", "0 - \"1\"");
            checkAction("+'1'", "\"1\" - 0");
        });
        it('should parse unary ! expressions', function () {
            checkAction('!true');
            checkAction('!!true');
            checkAction('!!!true');
        });
        it('should parse postfix ! expression', function () {
            checkAction('true!');
            checkAction('a!.b');
            checkAction('a!!!!.b');
        });
        it('should parse multiplicative expressions', function () { checkAction('3*4/2%5', '3 * 4 / 2 % 5'); });
        it('should parse additive expressions', function () { checkAction('3 + 6 - 2'); });
        it('should parse relational expressions', function () {
            checkAction('2 < 3');
            checkAction('2 > 3');
            checkAction('2 <= 2');
            checkAction('2 >= 2');
        });
        it('should parse equality expressions', function () {
            checkAction('2 == 3');
            checkAction('2 != 3');
        });
        it('should parse strict equality expressions', function () {
            checkAction('2 === 3');
            checkAction('2 !== 3');
        });
        it('should parse expressions', function () {
            checkAction('true && true');
            checkAction('true || false');
        });
        it('should parse grouped expressions', function () { checkAction('(1 + 2) * 3', '1 + 2 * 3'); });
        it('should ignore comments in expressions', function () { checkAction('a //comment', 'a'); });
        it('should retain // in string literals', function () { checkAction("\"http://www.google.com\"", "\"http://www.google.com\""); });
        it('should parse an empty string', function () { checkAction(''); });
        describe('literals', function () {
            it('should parse array', function () {
                checkAction('[1][0]');
                checkAction('[[1]][0][0]');
                checkAction('[]');
                checkAction('[].length');
                checkAction('[1, 2].length');
            });
            it('should parse map', function () {
                checkAction('{}');
                checkAction('{a: 1, "b": 2}[2]');
                checkAction('{}["a"]');
            });
            it('should only allow identifier, string, or keyword as map key', function () {
                expectActionError('{(:0}', 'expected identifier, keyword, or string');
                expectActionError('{1234:0}', 'expected identifier, keyword, or string');
            });
        });
        describe('member access', function () {
            it('should parse field access', function () {
                checkAction('a');
                checkAction('this.a', 'a');
                checkAction('a.a');
            });
            it('should only allow identifier or keyword as member names', function () {
                expectActionError('x.(', 'identifier or keyword');
                expectActionError('x. 1234', 'identifier or keyword');
                expectActionError('x."foo"', 'identifier or keyword');
            });
            it('should parse safe field access', function () {
                checkAction('a?.a');
                checkAction('a.a?.a');
            });
        });
        describe('method calls', function () {
            it('should parse method calls', function () {
                checkAction('fn()');
                checkAction('add(1, 2)');
                checkAction('a.add(1, 2)');
                checkAction('fn().add(1, 2)');
            });
        });
        describe('functional calls', function () {
            it('should parse function calls', function () { checkAction('fn()(1, 2)'); });
        });
        describe('conditional', function () {
            it('should parse ternary/conditional expressions', function () {
                checkAction('7 == 3 + 4 ? 10 : 20');
                checkAction('false ? 10 : 20');
            });
            it('should report incorrect ternary operator syntax', function () {
                expectActionError('true?1', 'Conditional expression true?1 requires all 3 expressions');
            });
        });
        describe('assignment', function () {
            it('should support field assignments', function () {
                checkAction('a = 12');
                checkAction('a.a.a = 123');
                checkAction('a = 123; b = 234;');
            });
            it('should report on safe field assignments', function () { expectActionError('a?.a = 123', 'cannot be used in the assignment'); });
            it('should support array updates', function () { checkAction('a[0] = 200'); });
        });
        it('should error when using pipes', function () { expectActionError('x|blah', 'Cannot have a pipe'); });
        it('should store the source in the result', function () { matchers_1.expect(parseAction('someExpr', 'someExpr')); });
        it('should store the passed-in location', function () { matchers_1.expect(parseAction('someExpr', 'location').location).toBe('location'); });
        it('should report when encountering interpolation', function () {
            expectActionError('{{a()}}', 'Got interpolation ({{}}) where expression was expected');
        });
    });
    describe('general error handling', function () {
        it('should report an unexpected token', function () { expectActionError('[1,2] trac', 'Unexpected token \'trac\''); });
        it('should report reasonable error for unconsumed tokens', function () { expectActionError(')', 'Unexpected token ) at column 1 in [)]'); });
        it('should report a missing expected token', function () {
            expectActionError('a(b', 'Missing expected ) at the end of the expression [a(b]');
        });
    });
    describe('parseBinding', function () {
        describe('pipes', function () {
            it('should parse pipes', function () {
                checkBinding('a(b | c)', 'a((b | c))');
                checkBinding('a.b(c.d(e) | f)', 'a.b((c.d(e) | f))');
                checkBinding('[1, 2, 3] | a', '([1, 2, 3] | a)');
                checkBinding('{a: 1, "b": 2} | c', '({a: 1, "b": 2} | c)');
                checkBinding('a[b] | c', '(a[b] | c)');
                checkBinding('a?.b | c', '(a?.b | c)');
                checkBinding('true | a', '(true | a)');
                checkBinding('a | b:c | d', '((a | b:c) | d)');
                checkBinding('a | b:(c | d)', '(a | b:(c | d))');
            });
            it('should only allow identifier or keyword as formatter names', function () {
                expectBindingError('"Foo"|(', 'identifier or keyword');
                expectBindingError('"Foo"|1234', 'identifier or keyword');
                expectBindingError('"Foo"|"uppercase"', 'identifier or keyword');
            });
            it('should parse quoted expressions', function () { checkBinding('a:b', 'a:b'); });
            it('should not crash when prefix part is not tokenizable', function () { checkBinding('"a:b"', '"a:b"'); });
            it('should ignore whitespace around quote prefix', function () { checkBinding(' a :b', 'a:b'); });
            it('should refuse prefixes that are not single identifiers', function () {
                expectBindingError('a + b:c', '');
                expectBindingError('1:c', '');
            });
        });
        it('should store the source in the result', function () { matchers_1.expect(parseBinding('someExpr').source).toBe('someExpr'); });
        it('should store the passed-in location', function () { matchers_1.expect(parseBinding('someExpr', 'location').location).toBe('location'); });
        it('should report chain expressions', function () { expectError(parseBinding('1;2'), 'contain chained expression'); });
        it('should report assignment', function () { expectError(parseBinding('a=2'), 'contain assignments'); });
        it('should report when encountering interpolation', function () {
            expectBindingError('{{a.b}}', 'Got interpolation ({{}}) where expression was expected');
        });
        it('should parse conditional expression', function () { checkBinding('a < b ? a : b'); });
        it('should ignore comments in bindings', function () { checkBinding('a //comment', 'a'); });
        it('should retain // in string literals', function () { checkBinding("\"http://www.google.com\"", "\"http://www.google.com\""); });
        it('should retain // in : microsyntax', function () { checkBinding('one:a//b', 'one:a//b'); });
    });
    describe('parseTemplateBindings', function () {
        function keys(templateBindings) { return templateBindings.map(function (binding) { return binding.key; }); }
        function keyValues(templateBindings) {
            return templateBindings.map(function (binding) {
                if (binding.keyIsVar) {
                    return 'let ' + binding.key + (binding.name == null ? '=null' : '=' + binding.name);
                }
                else {
                    return binding.key + (binding.expression == null ? '' : "=" + binding.expression);
                }
            });
        }
        function keySpans(source, templateBindings) {
            return templateBindings.map(function (binding) { return source.substring(binding.span.start, binding.span.end); });
        }
        function exprSources(templateBindings) {
            return templateBindings.map(function (binding) { return binding.expression != null ? binding.expression.source : null; });
        }
        it('should parse a key without a value', function () { matchers_1.expect(keys(parseTemplateBindings('a', ''))).toEqual(['a']); });
        it('should allow string including dashes as keys', function () {
            var bindings = parseTemplateBindings('a', 'b');
            matchers_1.expect(keys(bindings)).toEqual(['a']);
            bindings = parseTemplateBindings('a-b', 'c');
            matchers_1.expect(keys(bindings)).toEqual(['a-b']);
        });
        it('should detect expressions as value', function () {
            var bindings = parseTemplateBindings('a', 'b');
            matchers_1.expect(exprSources(bindings)).toEqual(['b']);
            bindings = parseTemplateBindings('a', '1+1');
            matchers_1.expect(exprSources(bindings)).toEqual(['1+1']);
        });
        it('should detect names as value', function () {
            var bindings = parseTemplateBindings('a', 'let b');
            matchers_1.expect(keyValues(bindings)).toEqual(['a', 'let b=$implicit']);
        });
        it('should allow space and colon as separators', function () {
            var bindings = parseTemplateBindings('a', 'b');
            matchers_1.expect(keys(bindings)).toEqual(['a']);
            matchers_1.expect(exprSources(bindings)).toEqual(['b']);
        });
        it('should allow multiple pairs', function () {
            var bindings = parseTemplateBindings('a', '1 b 2');
            matchers_1.expect(keys(bindings)).toEqual(['a', 'aB']);
            matchers_1.expect(exprSources(bindings)).toEqual(['1 ', '2']);
        });
        it('should store the sources in the result', function () {
            var bindings = parseTemplateBindings('a', '1,b 2');
            matchers_1.expect(bindings[0].expression.source).toEqual('1');
            matchers_1.expect(bindings[1].expression.source).toEqual('2');
        });
        it('should store the passed-in location', function () {
            var bindings = parseTemplateBindings('a', '1,b 2', 'location');
            matchers_1.expect(bindings[0].expression.location).toEqual('location');
        });
        it('should support let notation', function () {
            var bindings = parseTemplateBindings('key', 'let i');
            matchers_1.expect(keyValues(bindings)).toEqual(['key', 'let i=$implicit']);
            bindings = parseTemplateBindings('key', 'let a; let b');
            matchers_1.expect(keyValues(bindings)).toEqual([
                'key',
                'let a=$implicit',
                'let b=$implicit',
            ]);
            bindings = parseTemplateBindings('key', 'let a; let b;');
            matchers_1.expect(keyValues(bindings)).toEqual([
                'key',
                'let a=$implicit',
                'let b=$implicit',
            ]);
            bindings = parseTemplateBindings('key', 'let i-a = k-a');
            matchers_1.expect(keyValues(bindings)).toEqual([
                'key',
                'let i-a=k-a',
            ]);
            bindings = parseTemplateBindings('key', 'let item; let i = k');
            matchers_1.expect(keyValues(bindings)).toEqual([
                'key',
                'let item=$implicit',
                'let i=k',
            ]);
            bindings = parseTemplateBindings('directive', 'let item in expr; let a = b', 'location');
            matchers_1.expect(keyValues(bindings)).toEqual([
                'directive',
                'let item=$implicit',
                'directiveIn=expr in location',
                'let a=b',
            ]);
        });
        it('should support as notation', function () {
            var bindings = parseTemplateBindings('ngIf', 'exp as local', 'location');
            matchers_1.expect(keyValues(bindings)).toEqual(['ngIf=exp  in location', 'let local=ngIf']);
            bindings = parseTemplateBindings('ngFor', 'let item of items as iter; index as i', 'L');
            matchers_1.expect(keyValues(bindings)).toEqual([
                'ngFor', 'let item=$implicit', 'ngForOf=items  in L', 'let iter=ngForOf', 'let i=index'
            ]);
        });
        it('should parse pipes', function () {
            var bindings = parseTemplateBindings('key', 'value|pipe');
            var ast = bindings[0].expression.ast;
            matchers_1.expect(ast).toBeAnInstanceOf(ast_1.BindingPipe);
        });
        describe('spans', function () {
            it('should should support let', function () {
                var source = 'let i';
                matchers_1.expect(keySpans(source, parseTemplateBindings('key', 'let i'))).toEqual(['', 'let i']);
            });
            it('should support multiple lets', function () {
                var source = 'let item; let i=index; let e=even;';
                matchers_1.expect(keySpans(source, parseTemplateBindings('key', source))).toEqual([
                    '', 'let item', 'let i=index', 'let e=even'
                ]);
            });
            it('should support a prefix', function () {
                var source = 'let person of people';
                var prefix = 'ngFor';
                var bindings = parseTemplateBindings(prefix, source);
                matchers_1.expect(keyValues(bindings)).toEqual([
                    'ngFor', 'let person=$implicit', 'ngForOf=people in null'
                ]);
                matchers_1.expect(keySpans(source, bindings)).toEqual(['', 'let person ', 'of people']);
            });
        });
    });
    describe('parseInterpolation', function () {
        it('should return null if no interpolation', function () { matchers_1.expect(parseInterpolation('nothing')).toBe(null); });
        it('should parse no prefix/suffix interpolation', function () {
            var ast = parseInterpolation('{{a}}').ast;
            matchers_1.expect(ast.strings).toEqual(['', '']);
            matchers_1.expect(ast.expressions.length).toEqual(1);
            matchers_1.expect(ast.expressions[0].name).toEqual('a');
        });
        it('should parse prefix/suffix with multiple interpolation', function () {
            var originalExp = 'before {{ a }} middle {{ b }} after';
            var ast = parseInterpolation(originalExp).ast;
            matchers_1.expect(unparser_1.unparse(ast)).toEqual(originalExp);
            validator_1.validate(ast);
        });
        it('should report empty interpolation expressions', function () {
            expectError(parseInterpolation('{{}}'), 'Blank expressions are not allowed in interpolated strings');
            expectError(parseInterpolation('foo {{  }}'), 'Parser Error: Blank expressions are not allowed in interpolated strings');
        });
        it('should parse conditional expression', function () { checkInterpolation('{{ a < b ? a : b }}'); });
        it('should parse expression with newline characters', function () {
            checkInterpolation("{{ 'foo' +\n 'bar' +\r 'baz' }}", "{{ \"foo\" + \"bar\" + \"baz\" }}");
        });
        it('should support custom interpolation', function () {
            var parser = new parser_1.Parser(new lexer_1.Lexer());
            var ast = parser.parseInterpolation('{% a %}', null, { start: '{%', end: '%}' }).ast;
            matchers_1.expect(ast.strings).toEqual(['', '']);
            matchers_1.expect(ast.expressions.length).toEqual(1);
            matchers_1.expect(ast.expressions[0].name).toEqual('a');
        });
        describe('comments', function () {
            it('should ignore comments in interpolation expressions', function () { checkInterpolation('{{a //comment}}', '{{ a }}'); });
            it('should retain // in single quote strings', function () {
                checkInterpolation("{{ 'http://www.google.com' }}", "{{ \"http://www.google.com\" }}");
            });
            it('should retain // in double quote strings', function () {
                checkInterpolation("{{ \"http://www.google.com\" }}", "{{ \"http://www.google.com\" }}");
            });
            it('should ignore comments after string literals', function () { checkInterpolation("{{ \"a//b\" //comment }}", "{{ \"a//b\" }}"); });
            it('should retain // in complex strings', function () {
                checkInterpolation("{{\"//a'//b`//c`//d'//e\" //comment}}", "{{ \"//a'//b`//c`//d'//e\" }}");
            });
            it('should retain // in nested, unterminated strings', function () { checkInterpolation("{{ \"a'b`\" //comment}}", "{{ \"a'b`\" }}"); });
        });
    });
    describe('parseSimpleBinding', function () {
        it('should parse a field access', function () {
            var p = parseSimpleBinding('name');
            matchers_1.expect(unparser_1.unparse(p)).toEqual('name');
            validator_1.validate(p);
        });
        it('should report when encountering pipes', function () {
            expectError(validator_1.validate(parseSimpleBinding('a | somePipe')), 'Host binding expression cannot contain pipes');
        });
        it('should report when encountering interpolation', function () {
            expectError(validator_1.validate(parseSimpleBinding('{{exp}}')), 'Got interpolation ({{}}) where expression was expected');
        });
        it('should report when encountering field write', function () {
            expectError(validator_1.validate(parseSimpleBinding('a = b')), 'Bindings cannot contain assignments');
        });
    });
    describe('wrapLiteralPrimitive', function () {
        it('should wrap a literal primitive', function () {
            matchers_1.expect(unparser_1.unparse(validator_1.validate(createParser().wrapLiteralPrimitive('foo', null)))).toEqual('"foo"');
        });
    });
    describe('error recovery', function () {
        function recover(text, expected) {
            var expr = validator_1.validate(parseAction(text));
            matchers_1.expect(unparser_1.unparse(expr)).toEqual(expected || text);
        }
        it('should be able to recover from an extra paren', function () { return recover('((a)))', 'a'); });
        it('should be able to recover from an extra bracket', function () { return recover('[[a]]]', '[[a]]'); });
        it('should be able to recover from a missing )', function () { return recover('(a;b', 'a; b;'); });
        it('should be able to recover from a missing ]', function () { return recover('[a,b', '[a, b]'); });
        it('should be able to recover from a missing selector', function () { return recover('a.'); });
        it('should be able to recover from a missing selector in a array literal', function () { return recover('[[a.], b, c]'); });
    });
    describe('offsets', function () {
        it('should retain the offsets of an interpolation', function () {
            var interpolations = splitInterpolation('{{a}}  {{b}}  {{c}}');
            matchers_1.expect(interpolations.offsets).toEqual([2, 9, 16]);
        });
        it('should retain the offsets into the expression AST of interpolations', function () {
            var source = parseInterpolation('{{a}}  {{b}}  {{c}}');
            var interpolation = source.ast;
            matchers_1.expect(interpolation.expressions.map(function (e) { return e.span.start; })).toEqual([2, 9, 16]);
        });
    });
});
function createParser() {
    return new parser_1.Parser(new lexer_1.Lexer());
}
function parseAction(text, location) {
    if (location === void 0) { location = null; }
    return createParser().parseAction(text, location);
}
function parseBinding(text, location) {
    if (location === void 0) { location = null; }
    return createParser().parseBinding(text, location);
}
function parseTemplateBindingsResult(key, value, location) {
    if (location === void 0) { location = null; }
    return createParser().parseTemplateBindings(key, value, location);
}
function parseTemplateBindings(key, value, location) {
    if (location === void 0) { location = null; }
    return parseTemplateBindingsResult(key, value, location).templateBindings;
}
function parseInterpolation(text, location) {
    if (location === void 0) { location = null; }
    return createParser().parseInterpolation(text, location);
}
function splitInterpolation(text, location) {
    if (location === void 0) { location = null; }
    return createParser().splitInterpolation(text, location);
}
function parseSimpleBinding(text, location) {
    if (location === void 0) { location = null; }
    return createParser().parseSimpleBinding(text, location);
}
function checkInterpolation(exp, expected) {
    var ast = parseInterpolation(exp);
    if (expected == null)
        expected = exp;
    matchers_1.expect(unparser_1.unparse(ast)).toEqual(expected);
    validator_1.validate(ast);
}
function checkBinding(exp, expected) {
    var ast = parseBinding(exp);
    if (expected == null)
        expected = exp;
    matchers_1.expect(unparser_1.unparse(ast)).toEqual(expected);
    validator_1.validate(ast);
}
function checkAction(exp, expected) {
    var ast = parseAction(exp);
    if (expected == null)
        expected = exp;
    matchers_1.expect(unparser_1.unparse(ast)).toEqual(expected);
    validator_1.validate(ast);
}
function expectError(ast, message) {
    for (var _i = 0, _a = ast.errors; _i < _a.length; _i++) {
        var error = _a[_i];
        if (error.message.indexOf(message) >= 0) {
            return;
        }
    }
    var errMsgs = ast.errors.map(function (err) { return err.message; }).join('\n');
    throw Error("Expected an error containing \"" + message + "\" to be reported, but got the errors:\n" + errMsgs);
}
function expectActionError(text, message) {
    expectError(validator_1.validate(parseAction(text)), message);
}
function expectBindingError(text, message) {
    expectError(validator_1.validate(parseBinding(text)), message);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0L2V4cHJlc3Npb25fcGFyc2VyL3BhcnNlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsbUVBQW9JO0FBQ3BJLHVFQUFvRTtBQUNwRSx5RUFBc0g7QUFDdEgsMkVBQXNFO0FBR3RFLDZDQUF5QztBQUN6QywrQ0FBMkM7QUFFM0MsUUFBUSxDQUFDLFFBQVEsRUFBRTtJQUNqQixRQUFRLENBQUMsYUFBYSxFQUFFO1FBQ3RCLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxjQUFRLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXhELEVBQUUsQ0FBQyxzQkFBc0IsRUFBRTtZQUN6QixXQUFXLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzVCLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNyQixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxjQUFRLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXhELEVBQUUsQ0FBQyx3QkFBd0IsRUFBRSxjQUFRLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWxFLEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRTtZQUNyQyxXQUFXLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzNCLFdBQVcsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDM0IsV0FBVyxDQUFDLE1BQU0sRUFBRSxXQUFTLENBQUMsQ0FBQztZQUMvQixXQUFXLENBQUMsTUFBTSxFQUFFLFdBQVMsQ0FBQyxDQUFDO1FBQ2pDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGtDQUFrQyxF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