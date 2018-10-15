"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var ts = require("typescript");
var __1 = require("..");
var in_memory_typescript_1 = require("../../testing/in_memory_typescript");
var resolver_1 = require("../src/resolver");
function makeSimpleProgram(contents) {
    return in_memory_typescript_1.makeProgram([{ name: 'entry.ts', contents: contents }]).program;
}
function makeExpression(code, expr) {
    var program = in_memory_typescript_1.makeProgram([{ name: 'entry.ts', contents: code + "; const target$ = " + expr + ";" }]).program;
    var checker = program.getTypeChecker();
    var decl = in_memory_typescript_1.getDeclaration(program, 'entry.ts', 'target$', ts.isVariableDeclaration);
    return {
        expression: decl.initializer,
        checker: checker,
    };
}
function evaluate(code, expr) {
    var _a = makeExpression(code, expr), expression = _a.expression, checker = _a.checker;
    var host = new __1.TypeScriptReflectionHost(checker);
    return resolver_1.staticallyResolve(expression, host, checker);
}
describe('ngtsc metadata', function () {
    it('reads a file correctly', function () {
        var program = in_memory_typescript_1.makeProgram([
            {
                name: 'entry.ts',
                contents: "\n      import {Y} from './other';\n      const A = Y;\n        export const X = A;\n      "
            },
            {
                name: 'other.ts',
                contents: "\n      export const Y = 'test';\n      "
            }
        ]).program;
        var decl = in_memory_typescript_1.getDeclaration(program, 'entry.ts', 'X', ts.isVariableDeclaration);
        var host = new __1.TypeScriptReflectionHost(program.getTypeChecker());
        var value = resolver_1.staticallyResolve(decl.initializer, host, program.getTypeChecker());
        expect(value).toEqual('test');
    });
    it('map access works', function () { expect(evaluate('const obj = {a: "test"};', 'obj.a')).toEqual('test'); });
    it('function calls work', function () {
        expect(evaluate("function foo(bar) { return bar; }", 'foo("test")')).toEqual('test');
    });
    it('conditionals work', function () {
        expect(evaluate("const x = false; const y = x ? 'true' : 'false';", 'y')).toEqual('false');
    });
    it('addition works', function () { expect(evaluate("const x = 1 + 2;", 'x')).toEqual(3); });
    it('static property on class works', function () { expect(evaluate("class Foo { static bar = 'test'; }", 'Foo.bar')).toEqual('test'); });
    it('static property call works', function () {
        expect(evaluate("class Foo { static bar(test) { return test; } }", 'Foo.bar("test")'))
            .toEqual('test');
    });
    it('indirected static property call works', function () {
        expect(evaluate("class Foo { static bar(test) { return test; } }; const fn = Foo.bar;", 'fn("test")'))
            .toEqual('test');
    });
    it('array works', function () {
        expect(evaluate("const x = 'test'; const y = [1, x, 2];", 'y')).toEqual([1, 'test', 2]);
    });
    it('array spread works', function () {
        expect(evaluate("const a = [1, 2]; const b = [4, 5]; const c = [...a, 3, ...b];", 'c'))
            .toEqual([1, 2, 3, 4, 5]);
    });
    it('&& operations work', function () {
        expect(evaluate("const a = 'hello', b = 'world';", 'a && b')).toEqual('world');
        expect(evaluate("const a = false, b = 'world';", 'a && b')).toEqual(false);
        expect(evaluate("const a = 'hello', b = 0;", 'a && b')).toEqual(0);
    });
    it('|| operations work', function () {
        expect(evaluate("const a = 'hello', b = 'world';", 'a || b')).toEqual('hello');
        expect(evaluate("const a = false, b = 'world';", 'a || b')).toEqual('world');
        expect(evaluate("const a = 'hello', b = 0;", 'a || b')).toEqual('hello');
    });
    it('parentheticals work', function () { expect(evaluate("const a = 3, b = 4;", 'a * (a + b)')).toEqual(21); });
    it('array access works', function () { expect(evaluate("const a = [1, 2, 3];", 'a[1] + a[0]')).toEqual(3); });
    it('array `length` property access works', function () { expect(evaluate("const a = [1, 2, 3];", 'a[\'length\'] + 1')).toEqual(4); });
    it('negation works', function () {
        expect(evaluate("const x = 3;", '!x')).toEqual(false);
        expect(evaluate("const x = 3;", '!!x')).toEqual(true);
    });
    it('imports work', function () {
        var program = in_memory_typescript_1.makeProgram([
            { name: 'second.ts', contents: 'export function foo(bar) { return bar; }' },
            {
                name: 'entry.ts',
                contents: "\n          import {foo} from './second';\n          const target$ = foo;\n      "
            },
        ]).program;
        var checker = program.getTypeChecker();
        var host = new __1.TypeScriptReflectionHost(checker);
        var result = in_memory_typescript_1.getDeclaration(program, 'entry.ts', 'target$', ts.isVariableDeclaration);
        var expr = result.initializer;
        var resolved = resolver_1.staticallyResolve(expr, host, checker);
        if (!(resolved instanceof resolver_1.Reference)) {
            return fail('Expected expression to resolve to a reference');
        }
        expect(ts.isFunctionDeclaration(resolved.node)).toBe(true);
        expect(resolved.expressable).toBe(true);
        var reference = resolved.toExpression(program.getSourceFile('entry.ts'));
        if (!(reference instanceof compiler_1.WrappedNodeExpr)) {
            return fail('Expected expression reference to be a wrapped node');
        }
        if (!ts.isIdentifier(reference.node)) {
            return fail('Expected expression to be an Identifier');
        }
        expect(reference.node.getSourceFile()).toEqual(program.getSourceFile('entry.ts'));
    });
    it('absolute imports work', function () {
        var program = in_memory_typescript_1.makeProgram([
            { name: 'node_modules/some_library/index.d.ts', contents: 'export declare function foo(bar);' },
            {
                name: 'entry.ts',
                contents: "\n          import {foo} from 'some_library';\n          const target$ = foo;\n      "
            },
        ]).program;
        var checker = program.getTypeChecker();
        var host = new __1.TypeScriptReflectionHost(checker);
        var result = in_memory_typescript_1.getDeclaration(program, 'entry.ts', 'target$', ts.isVariableDeclaration);
        var expr = result.initializer;
        var resolved = resolver_1.staticallyResolve(expr, host, checker);
        if (!(resolved instanceof resolver_1.AbsoluteReference)) {
            return fail('Expected expression to resolve to an absolute reference');
        }
        expect(resolved.moduleName).toBe('some_library');
        expect(ts.isFunctionDeclaration(resolved.node)).toBe(true);
        expect(resolved.expressable).toBe(true);
        var reference = resolved.toExpression(program.getSourceFile('entry.ts'));
        if (!(reference instanceof compiler_1.WrappedNodeExpr)) {
            return fail('Expected expression reference to be a wrapped node');
        }
        if (!ts.isIdentifier(reference.node)) {
            return fail('Expected expression to be an Identifier');
        }
        expect(reference.node.getSourceFile()).toEqual(program.getSourceFile('entry.ts'));
    });
    it('reads values from default exports', function () {
        var program = in_memory_typescript_1.makeProgram([
            { name: 'second.ts', contents: 'export default {property: "test"}' },
            {
                name: 'entry.ts',
                contents: "\n          import mod from './second';\n          const target$ = mod.property;\n      "
            },
        ]).program;
        var checker = program.getTypeChecker();
        var host = new __1.TypeScriptReflectionHost(checker);
        var result = in_memory_typescript_1.getDeclaration(program, 'entry.ts', 'target$', ts.isVariableDeclaration);
        var expr = result.initializer;
        expect(resolver_1.staticallyResolve(expr, host, checker)).toEqual('test');
    });
    it('reads values from named exports', function () {
        var program = in_memory_typescript_1.makeProgram([
            { name: 'second.ts', contents: 'export const a = {property: "test"};' },
            {
                name: 'entry.ts',
                contents: "\n          import * as mod from './second';\n          const target$ = mod.a.property;\n      "
            },
        ]).program;
        var checker = program.getTypeChecker();
        var host = new __1.TypeScriptReflectionHost(checker);
        var result = in_memory_typescript_1.getDeclaration(program, 'entry.ts', 'target$', ts.isVariableDeclaration);
        var expr = result.initializer;
        expect(resolver_1.staticallyResolve(expr, host, checker)).toEqual('test');
    });
    it('chain of re-exports works', function () {
        var program = in_memory_typescript_1.makeProgram([
            { name: 'const.ts', contents: 'export const value = {property: "test"};' },
            { name: 'def.ts', contents: "import {value} from './const'; export default value;" },
            { name: 'indirect-reexport.ts', contents: "import value from './def'; export {value};" },
            { name: 'direct-reexport.ts', contents: "export {value} from './indirect-reexport';" },
            {
                name: 'entry.ts',
                contents: "import * as mod from './direct-reexport'; const target$ = mod.value.property;"
            },
        ]).program;
        var checker = program.getTypeChecker();
        var host = new __1.TypeScriptReflectionHost(checker);
        var result = in_memory_typescript_1.getDeclaration(program, 'entry.ts', 'target$', ts.isVariableDeclaration);
        var expr = result.initializer;
        expect(resolver_1.staticallyResolve(expr, host, checker)).toEqual('test');
    });
    it('map spread works', function () {
        var map = evaluate("const a = {a: 1}; const b = {b: 2, c: 1}; const c = {...a, ...b, c: 3};", 'c');
        var obj = {};
        map.forEach(function (value, key) { return obj[key] = value; });
        expect(obj).toEqual({
            a: 1,
            b: 2,
            c: 3,
        });
    });
    it('indirected-via-object function call works', function () {
        expect(evaluate("\n      function fn(res) { return res; }\n      const obj = {fn};\n    ", 'obj.fn("test")'))
            .toEqual('test');
    });
    it('template expressions work', function () { expect(evaluate('const a = 2, b = 4;', '`1${a}3${b}5`')).toEqual('12345'); });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb2x2ZXJfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvbWV0YWRhdGEvdGVzdC9yZXNvbHZlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsOENBQWtEO0FBQ2xELCtCQUFpQztBQUVqQyx3QkFBNEM7QUFDNUMsMkVBQStFO0FBQy9FLDRDQUErRjtBQUUvRiwyQkFBMkIsUUFBZ0I7SUFDekMsT0FBTyxrQ0FBVyxDQUFDLENBQUMsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLFFBQVEsVUFBQSxFQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUM3RCxDQUFDO0FBRUQsd0JBQ0ksSUFBWSxFQUFFLElBQVk7SUFDckIsSUFBQSxnSUFBTyxDQUN1RTtJQUNyRixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDekMsSUFBTSxJQUFJLEdBQUcscUNBQWMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUN0RixPQUFPO1FBQ0wsVUFBVSxFQUFFLElBQUksQ0FBQyxXQUFhO1FBQzlCLE9BQU8sU0FBQTtLQUNSLENBQUM7QUFDSixDQUFDO0FBRUQsa0JBQTJDLElBQVksRUFBRSxJQUFZO0lBQzdELElBQUEsK0JBQWtELEVBQWpELDBCQUFVLEVBQUUsb0JBQU8sQ0FBK0I7SUFDekQsSUFBTSxJQUFJLEdBQUcsSUFBSSw0QkFBd0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNuRCxPQUFPLDRCQUFpQixDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFNLENBQUM7QUFDM0QsQ0FBQztBQUVELFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtJQUN6QixFQUFFLENBQUMsd0JBQXdCLEVBQUU7UUFDcEIsSUFBQTs7Ozs7Ozs7O2tCQUFPLENBZVg7UUFDSCxJQUFNLElBQUksR0FBRyxxQ0FBYyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1FBQ2hGLElBQU0sSUFBSSxHQUFHLElBQUksNEJBQXdCLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7UUFFcEUsSUFBTSxLQUFLLEdBQUcsNEJBQWlCLENBQUMsSUFBSSxDQUFDLFdBQWEsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7UUFDcEYsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNoQyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxrQkFBa0IsRUFDbEIsY0FBUSxNQUFNLENBQUMsUUFBUSxDQUFDLDBCQUEwQixFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFckYsRUFBRSxDQUFDLHFCQUFxQixFQUFFO1FBQ3hCLE1BQU0sQ0FBQyxRQUFRLENBQUMsbUNBQW1DLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdkYsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsbUJBQW1CLEVBQUU7UUFDdEIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxrREFBa0QsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM3RixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxjQUFRLE1BQU0sQ0FBQyxRQUFRLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV0RixFQUFFLENBQUMsZ0NBQWdDLEVBQ2hDLGNBQVEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxvQ0FBb0MsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRWpHLEVBQUUsQ0FBQyw0QkFBNEIsRUFBRTtRQUMvQixNQUFNLENBQUMsUUFBUSxDQUFDLGlEQUFpRCxFQUFFLGlCQUFpQixDQUFDLENBQUM7YUFDakYsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3ZCLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHVDQUF1QyxFQUFFO1FBQzFDLE1BQU0sQ0FDRixRQUFRLENBQ0osc0VBQXNFLEVBQUUsWUFBWSxDQUFDLENBQUM7YUFDekYsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3ZCLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGFBQWEsRUFBRTtRQUNoQixNQUFNLENBQUMsUUFBUSxDQUFDLHdDQUF3QyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFGLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLG9CQUFvQixFQUFFO1FBQ3ZCLE1BQU0sQ0FBQyxRQUFRLENBQUMsZ0VBQWdFLEVBQUUsR0FBRyxDQUFDLENBQUM7YUFDbEYsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsb0JBQW9CLEVBQUU7UUFDdkIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxpQ0FBaUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMvRSxNQUFNLENBQUMsUUFBUSxDQUFDLCtCQUErQixFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNFLE1BQU0sQ0FBQyxRQUFRLENBQUMsMkJBQTJCLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckUsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsb0JBQW9CLEVBQUU7UUFDdkIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxpQ0FBaUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMvRSxNQUFNLENBQUMsUUFBUSxDQUFDLCtCQUErQixFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdFLE1BQU0sQ0FBQyxRQUFRLENBQUMsMkJBQTJCLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDM0UsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMscUJBQXFCLEVBQ3JCLGNBQVEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRWxGLEVBQUUsQ0FBQyxvQkFBb0IsRUFDcEIsY0FBUSxNQUFNLENBQUMsUUFBUSxDQUFDLHNCQUFzQixFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFbEYsRUFBRSxDQUFDLHNDQUFzQyxFQUN0QyxjQUFRLE1BQU0sQ0FBQyxRQUFRLENBQUMsc0JBQXNCLEVBQUUsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXhGLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRTtRQUNuQixNQUFNLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0RCxNQUFNLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4RCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxjQUFjLEVBQUU7UUFDVixJQUFBOzs7Ozs7a0JBQU8sQ0FTWDtRQUNILElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN6QyxJQUFNLElBQUksR0FBRyxJQUFJLDRCQUF3QixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ25ELElBQU0sTUFBTSxHQUFHLHFDQUFjLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsRUFBRSxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDeEYsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFdBQWEsQ0FBQztRQUNsQyxJQUFNLFFBQVEsR0FBRyw0QkFBaUIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxDQUFDLFFBQVEsWUFBWSxvQkFBUyxDQUFDLEVBQUU7WUFDcEMsT0FBTyxJQUFJLENBQUMsK0NBQStDLENBQUMsQ0FBQztTQUM5RDtRQUNELE1BQU0sQ0FBQyxFQUFFLENBQUMscUJBQXFCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNELE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hDLElBQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUcsQ0FBQyxDQUFDO1FBQzdFLElBQUksQ0FBQyxDQUFDLFNBQVMsWUFBWSwwQkFBZSxDQUFDLEVBQUU7WUFDM0MsT0FBTyxJQUFJLENBQUMsb0RBQW9ELENBQUMsQ0FBQztTQUNuRTtRQUNELElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNwQyxPQUFPLElBQUksQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO1NBQ3hEO1FBQ0QsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUcsQ0FBQyxDQUFDO0lBQ3RGLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHVCQUF1QixFQUFFO1FBQ25CLElBQUE7Ozs7OztrQkFBTyxDQVNYO1FBQ0gsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3pDLElBQU0sSUFBSSxHQUFHLElBQUksNEJBQXdCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbkQsSUFBTSxNQUFNLEdBQUcscUNBQWMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUN4RixJQUFNLElBQUksR0FBRyxNQUFNLENBQUMsV0FBYSxDQUFDO1FBQ2xDLElBQU0sUUFBUSxHQUFHLDRCQUFpQixDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLENBQUMsUUFBUSxZQUFZLDRCQUFpQixDQUFDLEVBQUU7WUFDNUMsT0FBTyxJQUFJLENBQUMseURBQXlELENBQUMsQ0FBQztTQUN4RTtRQUNELE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ2pELE1BQU0sQ0FBQyxFQUFFLENBQUMscUJBQXFCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNELE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hDLElBQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUcsQ0FBQyxDQUFDO1FBQzdFLElBQUksQ0FBQyxDQUFDLFNBQVMsWUFBWSwwQkFBZSxDQUFDLEVBQUU7WUFDM0MsT0FBTyxJQUFJLENBQUMsb0RBQW9ELENBQUMsQ0FBQztTQUNuRTtRQUNELElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNwQyxPQUFPLElBQUksQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO1NBQ3hEO1FBQ0QsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUcsQ0FBQyxDQUFDO0lBQ3RGLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLG1DQUFtQyxFQUFFO1FBQy9CLElBQUE7Ozs7OztrQkFBTyxDQVNYO1FBQ0gsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3pDLElBQU0sSUFBSSxHQUFHLElBQUksNEJBQXdCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbkQsSUFBTSxNQUFNLEdBQUcscUNBQWMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUN4RixJQUFNLElBQUksR0FBRyxNQUFNLENBQUMsV0FBYSxDQUFDO1FBQ2xDLE1BQU0sQ0FBQyw0QkFBaUIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2pFLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGlDQUFpQyxFQUFFO1FBQzdCLElBQUE7Ozs7OztrQkFBTyxDQVNYO1FBQ0gsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3pDLElBQU0sSUFBSSxHQUFHLElBQUksNEJBQXdCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbkQsSUFBTSxNQUFNLEdBQUcscUNBQWMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUN4RixJQUFNLElBQUksR0FBRyxNQUFNLENBQUMsV0FBYSxDQUFDO1FBQ2xDLE1BQU0sQ0FBQyw0QkFBaUIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2pFLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDJCQUEyQixFQUFFO1FBQ3ZCLElBQUE7Ozs7Ozs7OztrQkFBTyxDQVNYO1FBQ0gsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3pDLElBQU0sSUFBSSxHQUFHLElBQUksNEJBQXdCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbkQsSUFBTSxNQUFNLEdBQUcscUNBQWMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUN4RixJQUFNLElBQUksR0FBRyxNQUFNLENBQUMsV0FBYSxDQUFDO1FBQ2xDLE1BQU0sQ0FBQyw0QkFBaUIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2pFLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGtCQUFrQixFQUFFO1FBQ3JCLElBQU0sR0FBRyxHQUF3QixRQUFRLENBQ3JDLHlFQUF5RSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRXBGLElBQU0sR0FBRyxHQUE0QixFQUFFLENBQUM7UUFDeEMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUssRUFBRSxHQUFHLElBQUssT0FBQSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxFQUFoQixDQUFnQixDQUFDLENBQUM7UUFDOUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUNsQixDQUFDLEVBQUUsQ0FBQztZQUNKLENBQUMsRUFBRSxDQUFDO1lBQ0osQ0FBQyxFQUFFLENBQUM7U0FDTCxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQywyQ0FBMkMsRUFBRTtRQUM5QyxNQUFNLENBQUMsUUFBUSxDQUNKLHlFQUdWLEVBQ1UsZ0JBQWdCLENBQUMsQ0FBQzthQUN4QixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdkIsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsMkJBQTJCLEVBQzNCLGNBQVEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNGLENBQUMsQ0FBQyxDQUFDIn0=