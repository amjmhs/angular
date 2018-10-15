"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var evaluator_1 = require("../../src/metadata/evaluator");
var symbols_1 = require("../../src/metadata/symbols");
var typescript_mocks_1 = require("./typescript.mocks");
describe('Evaluator', function () {
    var documentRegistry = ts.createDocumentRegistry();
    var host;
    var service;
    var program;
    var typeChecker;
    var symbols;
    var evaluator;
    beforeEach(function () {
        host = new typescript_mocks_1.Host(FILES, [
            'expressions.ts', 'consts.ts', 'const_expr.ts', 'forwardRef.ts', 'classes.ts',
            'newExpression.ts', 'errors.ts', 'declared.ts'
        ]);
        service = ts.createLanguageService(host, documentRegistry);
        program = service.getProgram();
        typeChecker = program.getTypeChecker();
        symbols = new symbols_1.Symbols(null);
        evaluator = new evaluator_1.Evaluator(symbols, new Map());
    });
    it('should not have typescript errors in test data', function () {
        typescript_mocks_1.expectNoDiagnostics(service.getCompilerOptionsDiagnostics());
        for (var _i = 0, _a = program.getSourceFiles(); _i < _a.length; _i++) {
            var sourceFile = _a[_i];
            typescript_mocks_1.expectNoDiagnostics(service.getSyntacticDiagnostics(sourceFile.fileName));
            if (sourceFile.fileName != 'errors.ts') {
                // Skip errors.ts because we it has intentional semantic errors that we are testing for.
                typescript_mocks_1.expectNoDiagnostics(service.getSemanticDiagnostics(sourceFile.fileName));
            }
        }
    });
    it('should be able to fold literal expressions', function () {
        var consts = program.getSourceFile('consts.ts');
        expect(evaluator.isFoldable(typescript_mocks_1.findVarInitializer(consts, 'someName'))).toBeTruthy();
        expect(evaluator.isFoldable(typescript_mocks_1.findVarInitializer(consts, 'someBool'))).toBeTruthy();
        expect(evaluator.isFoldable(typescript_mocks_1.findVarInitializer(consts, 'one'))).toBeTruthy();
        expect(evaluator.isFoldable(typescript_mocks_1.findVarInitializer(consts, 'two'))).toBeTruthy();
    });
    it('should be able to fold expressions with foldable references', function () {
        var expressions = program.getSourceFile('expressions.ts');
        symbols.define('someName', 'some-name');
        symbols.define('someBool', true);
        symbols.define('one', 1);
        symbols.define('two', 2);
        expect(evaluator.isFoldable(typescript_mocks_1.findVarInitializer(expressions, 'three'))).toBeTruthy();
        expect(evaluator.isFoldable(typescript_mocks_1.findVarInitializer(expressions, 'four'))).toBeTruthy();
        symbols.define('three', 3);
        symbols.define('four', 4);
        expect(evaluator.isFoldable(typescript_mocks_1.findVarInitializer(expressions, 'obj'))).toBeTruthy();
        expect(evaluator.isFoldable(typescript_mocks_1.findVarInitializer(expressions, 'arr'))).toBeTruthy();
    });
    it('should be able to evaluate literal expressions', function () {
        var consts = program.getSourceFile('consts.ts');
        expect(evaluator.evaluateNode(typescript_mocks_1.findVarInitializer(consts, 'someName'))).toBe('some-name');
        expect(evaluator.evaluateNode(typescript_mocks_1.findVarInitializer(consts, 'someBool'))).toBe(true);
        expect(evaluator.evaluateNode(typescript_mocks_1.findVarInitializer(consts, 'one'))).toBe(1);
        expect(evaluator.evaluateNode(typescript_mocks_1.findVarInitializer(consts, 'two'))).toBe(2);
    });
    it('should be able to evaluate expressions', function () {
        var expressions = program.getSourceFile('expressions.ts');
        symbols.define('someName', 'some-name');
        symbols.define('someBool', true);
        symbols.define('one', 1);
        symbols.define('two', 2);
        expect(evaluator.evaluateNode(typescript_mocks_1.findVarInitializer(expressions, 'three'))).toBe(3);
        symbols.define('three', 3);
        expect(evaluator.evaluateNode(typescript_mocks_1.findVarInitializer(expressions, 'four'))).toBe(4);
        symbols.define('four', 4);
        expect(evaluator.evaluateNode(typescript_mocks_1.findVarInitializer(expressions, 'obj')))
            .toEqual({ one: 1, two: 2, three: 3, four: 4 });
        expect(evaluator.evaluateNode(typescript_mocks_1.findVarInitializer(expressions, 'arr'))).toEqual([1, 2, 3, 4]);
        expect(evaluator.evaluateNode(typescript_mocks_1.findVarInitializer(expressions, 'bTrue'))).toEqual(true);
        expect(evaluator.evaluateNode(typescript_mocks_1.findVarInitializer(expressions, 'bFalse'))).toEqual(false);
        expect(evaluator.evaluateNode(typescript_mocks_1.findVarInitializer(expressions, 'bAnd'))).toEqual(true);
        expect(evaluator.evaluateNode(typescript_mocks_1.findVarInitializer(expressions, 'bOr'))).toEqual(true);
        expect(evaluator.evaluateNode(typescript_mocks_1.findVarInitializer(expressions, 'nDiv'))).toEqual(2);
        expect(evaluator.evaluateNode(typescript_mocks_1.findVarInitializer(expressions, 'nMod'))).toEqual(1);
        expect(evaluator.evaluateNode(typescript_mocks_1.findVarInitializer(expressions, 'bLOr'))).toEqual(false || true);
        expect(evaluator.evaluateNode(typescript_mocks_1.findVarInitializer(expressions, 'bLAnd'))).toEqual(true && true);
        expect(evaluator.evaluateNode(typescript_mocks_1.findVarInitializer(expressions, 'bBOr'))).toEqual(0x11 | 0x22);
        expect(evaluator.evaluateNode(typescript_mocks_1.findVarInitializer(expressions, 'bBAnd'))).toEqual(0x11 & 0x03);
        expect(evaluator.evaluateNode(typescript_mocks_1.findVarInitializer(expressions, 'bXor'))).toEqual(0x11 ^ 0x21);
        expect(evaluator.evaluateNode(typescript_mocks_1.findVarInitializer(expressions, 'bEqual')))
            .toEqual(1 == '1');
        expect(evaluator.evaluateNode(typescript_mocks_1.findVarInitializer(expressions, 'bNotEqual')))
            .toEqual(1 != '1');
        expect(evaluator.evaluateNode(typescript_mocks_1.findVarInitializer(expressions, 'bIdentical')))
            .toEqual(1 === '1');
        expect(evaluator.evaluateNode(typescript_mocks_1.findVarInitializer(expressions, 'bNotIdentical')))
            .toEqual(1 !== '1');
        expect(evaluator.evaluateNode(typescript_mocks_1.findVarInitializer(expressions, 'bLessThan'))).toEqual(1 < 2);
        expect(evaluator.evaluateNode(typescript_mocks_1.findVarInitializer(expressions, 'bGreaterThan'))).toEqual(1 > 2);
        expect(evaluator.evaluateNode(typescript_mocks_1.findVarInitializer(expressions, 'bLessThanEqual')))
            .toEqual(1 <= 2);
        expect(evaluator.evaluateNode(typescript_mocks_1.findVarInitializer(expressions, 'bGreaterThanEqual')))
            .toEqual(1 >= 2);
        expect(evaluator.evaluateNode(typescript_mocks_1.findVarInitializer(expressions, 'bShiftLeft'))).toEqual(1 << 2);
        expect(evaluator.evaluateNode(typescript_mocks_1.findVarInitializer(expressions, 'bShiftRight'))).toEqual(-1 >> 2);
        expect(evaluator.evaluateNode(typescript_mocks_1.findVarInitializer(expressions, 'bShiftRightU')))
            .toEqual(-1 >>> 2);
    });
    it('should report recursive references as symbolic', function () {
        var expressions = program.getSourceFile('expressions.ts');
        expect(evaluator.evaluateNode(typescript_mocks_1.findVarInitializer(expressions, 'recursiveA')))
            .toEqual({ __symbolic: 'reference', name: 'recursiveB' });
        expect(evaluator.evaluateNode(typescript_mocks_1.findVarInitializer(expressions, 'recursiveB')))
            .toEqual({ __symbolic: 'reference', name: 'recursiveA' });
    });
    it('should correctly handle special cases for CONST_EXPR', function () {
        var const_expr = program.getSourceFile('const_expr.ts');
        expect(evaluator.evaluateNode(typescript_mocks_1.findVarInitializer(const_expr, 'bTrue'))).toEqual(true);
        expect(evaluator.evaluateNode(typescript_mocks_1.findVarInitializer(const_expr, 'bFalse'))).toEqual(false);
    });
    it('should resolve a forwardRef', function () {
        var forwardRef = program.getSourceFile('forwardRef.ts');
        expect(evaluator.evaluateNode(typescript_mocks_1.findVarInitializer(forwardRef, 'bTrue'))).toEqual(true);
        expect(evaluator.evaluateNode(typescript_mocks_1.findVarInitializer(forwardRef, 'bFalse'))).toEqual(false);
    });
    it('should return new expressions', function () {
        symbols.define('Value', { __symbolic: 'reference', module: './classes', name: 'Value' });
        evaluator = new evaluator_1.Evaluator(symbols, new Map());
        var newExpression = program.getSourceFile('newExpression.ts');
        expect(evaluator.evaluateNode(typescript_mocks_1.findVarInitializer(newExpression, 'someValue'))).toEqual({
            __symbolic: 'new',
            expression: { __symbolic: 'reference', name: 'Value', module: './classes', line: 4, character: 33 },
            arguments: ['name', 12]
        });
        expect(evaluator.evaluateNode(typescript_mocks_1.findVarInitializer(newExpression, 'complex'))).toEqual({
            __symbolic: 'new',
            expression: { __symbolic: 'reference', name: 'Value', module: './classes', line: 5, character: 42 },
            arguments: ['name', 12]
        });
    });
    it('should support referene to a declared module type', function () {
        var declared = program.getSourceFile('declared.ts');
        var aDecl = typescript_mocks_1.findVar(declared, 'a');
        expect(evaluator.evaluateNode(aDecl.type)).toEqual({
            __symbolic: 'select',
            expression: { __symbolic: 'reference', name: 'Foo' },
            member: 'A'
        });
    });
    it('should return errors for unsupported expressions', function () {
        var errors = program.getSourceFile('errors.ts');
        var fDecl = typescript_mocks_1.findVar(errors, 'f');
        expect(evaluator.evaluateNode(fDecl.initializer))
            .toEqual({ __symbolic: 'error', message: 'Lambda not supported', line: 1, character: 12 });
        var eDecl = typescript_mocks_1.findVar(errors, 'e');
        expect(evaluator.evaluateNode(eDecl.type)).toEqual({
            __symbolic: 'error',
            message: 'Could not resolve type',
            line: 2,
            character: 11,
            context: { typeName: 'NotFound' }
        });
        var sDecl = typescript_mocks_1.findVar(errors, 's');
        expect(evaluator.evaluateNode(sDecl.initializer)).toEqual({
            __symbolic: 'error',
            message: 'Name expected',
            line: 3,
            character: 14,
            context: { received: '1' }
        });
        var tDecl = typescript_mocks_1.findVar(errors, 't');
        expect(evaluator.evaluateNode(tDecl.initializer)).toEqual({
            __symbolic: 'error',
            message: 'Expression form not supported',
            line: 4,
            character: 12
        });
    });
    it('should be able to fold an array spread', function () {
        var expressions = program.getSourceFile('expressions.ts');
        symbols.define('arr', [1, 2, 3, 4]);
        var arrSpread = typescript_mocks_1.findVar(expressions, 'arrSpread');
        expect(evaluator.evaluateNode(arrSpread.initializer)).toEqual([0, 1, 2, 3, 4, 5]);
    });
    it('should be able to produce a spread expression', function () {
        var expressions = program.getSourceFile('expressions.ts');
        var arrSpreadRef = typescript_mocks_1.findVar(expressions, 'arrSpreadRef');
        expect(evaluator.evaluateNode(arrSpreadRef.initializer)).toEqual([
            0, { __symbolic: 'spread', expression: { __symbolic: 'reference', name: 'arrImport' } }, 5
        ]);
    });
    it('should be able to handle a new expression with no arguments', function () {
        var source = sourceFileOf("\n      export var a = new f;\n    ");
        var expr = typescript_mocks_1.findVar(source, 'a');
        expect(evaluator.evaluateNode(expr.initializer))
            .toEqual({ __symbolic: 'new', expression: { __symbolic: 'reference', name: 'f' } });
    });
    describe('with substitution', function () {
        var evaluator;
        var lambdaTemp = 'lambdaTemp';
        beforeEach(function () {
            evaluator = new evaluator_1.Evaluator(symbols, new Map(), {
                substituteExpression: function (value, node) {
                    if (node.kind == ts.SyntaxKind.ArrowFunction) {
                        return { __symbolic: 'reference', name: lambdaTemp };
                    }
                    return value;
                }
            });
        });
        it('should be able to substitute a lambda with a reference', function () {
            var source = sourceFileOf("\n        var b = 1;\n        export var a = () => b;\n      ");
            var expr = typescript_mocks_1.findVar(source, 'a');
            expect(evaluator.evaluateNode(expr.initializer))
                .toEqual({ __symbolic: 'reference', name: lambdaTemp });
        });
        it('should be able to substitute a lambda in an expression', function () {
            var source = sourceFileOf("\n        var b = 1;\n        export var a = [\n          { provide: 'someValue': useFactory: () => b }\n        ];\n      ");
            var expr = typescript_mocks_1.findVar(source, 'a');
            expect(evaluator.evaluateNode(expr.initializer)).toEqual([
                { provide: 'someValue', useFactory: { __symbolic: 'reference', name: lambdaTemp } }
            ]);
        });
    });
});
function sourceFileOf(text) {
    return ts.createSourceFile('test.ts', text, ts.ScriptTarget.Latest, true);
}
var FILES = {
    'directives.ts': "\n    export function Pipe(options: { name?: string, pure?: boolean}) {\n      return function(fn: Function) { }\n    }\n    ",
    'classes.ts': "\n    export class Value {\n      constructor(public name: string, public value: any) {}\n    }\n  ",
    'consts.ts': "\n    export var someName = 'some-name';\n    export var someBool = true;\n    export var one = 1;\n    export var two = 2;\n    export var arrImport = [1, 2, 3, 4];\n  ",
    'expressions.ts': "\n    import {arrImport} from './consts';\n\n    export var someName = 'some-name';\n    export var someBool = true;\n    export var one = 1;\n    export var two = 2;\n\n    export var three = one + two;\n    export var four = two * two;\n    export var obj = { one: one, two: two, three: three, four: four };\n    export var arr = [one, two, three, four];\n    export var bTrue = someBool;\n    export var bFalse = !someBool;\n    export var bAnd = someBool && someBool;\n    export var bOr = someBool || someBool;\n    export var nDiv = four / two;\n    export var nMod = (four + one) % two;\n\n    export var bLOr = false || true;             // true\n    export var bLAnd = true && true;             // true\n    export var bBOr = 0x11 | 0x22;               // 0x33\n    export var bBAnd = 0x11 & 0x03;              // 0x01\n    export var bXor = 0x11 ^ 0x21;               // 0x20\n    export var bEqual = 1 == <any>\"1\";           // true\n    export var bNotEqual = 1 != <any>\"1\";        // false\n    export var bIdentical = 1 === <any>\"1\";      // false\n    export var bNotIdentical = 1 !== <any>\"1\";   // true\n    export var bLessThan = 1 < 2;                // true\n    export var bGreaterThan = 1 > 2;             // false\n    export var bLessThanEqual = 1 <= 2;          // true\n    export var bGreaterThanEqual = 1 >= 2;       // false\n    export var bShiftLeft = 1 << 2;              // 0x04\n    export var bShiftRight = -1 >> 2;            // -1\n    export var bShiftRightU = -1 >>> 2;          // 0x3fffffff\n\n    export var arrSpread = [0, ...arr, 5];\n\n    export var arrSpreadRef = [0, ...arrImport, 5];\n\n    export var recursiveA = recursiveB;\n    export var recursiveB = recursiveA;\n  ",
    'A.ts': "\n    import {Pipe} from './directives';\n\n    @Pipe({name: 'A', pure: false})\n    export class A {}",
    'B.ts': "\n    import {Pipe} from './directives';\n    import {someName, someBool} from './consts';\n\n    @Pipe({name: someName, pure: someBool})\n    export class B {}",
    'const_expr.ts': "\n    function CONST_EXPR(value: any) { return value; }\n    export var bTrue = CONST_EXPR(true);\n    export var bFalse = CONST_EXPR(false);\n  ",
    'forwardRef.ts': "\n    function forwardRef(value: any) { return value; }\n    export var bTrue = forwardRef(() => true);\n    export var bFalse = forwardRef(() => false);\n  ",
    'newExpression.ts': "\n    import {Value} from './classes';\n    function CONST_EXPR(value: any) { return value; }\n    function forwardRef(value: any) { return value; }\n    export const someValue = new Value(\"name\", 12);\n    export const complex = CONST_EXPR(new Value(\"name\", forwardRef(() => 12)));\n  ",
    'errors.ts': "\n    let f = () => 1;\n    let e: NotFound;\n    let s = { 1: 1, 2: 2 };\n    let t = typeof 12;\n  ",
    'declared.ts': "\n    declare namespace Foo {\n      type A = string;\n    }\n\n    let a: Foo.A = 'some value';\n  "
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZhbHVhdG9yX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvdGVzdC9tZXRhZGF0YS9ldmFsdWF0b3Jfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUdILCtCQUFpQztBQUVqQywwREFBdUQ7QUFDdkQsc0RBQW1EO0FBRW5ELHVEQUFxRztBQUVyRyxRQUFRLENBQUMsV0FBVyxFQUFFO0lBQ3BCLElBQU0sZ0JBQWdCLEdBQUcsRUFBRSxDQUFDLHNCQUFzQixFQUFFLENBQUM7SUFDckQsSUFBSSxJQUE0QixDQUFDO0lBQ2pDLElBQUksT0FBMkIsQ0FBQztJQUNoQyxJQUFJLE9BQW1CLENBQUM7SUFDeEIsSUFBSSxXQUEyQixDQUFDO0lBQ2hDLElBQUksT0FBZ0IsQ0FBQztJQUNyQixJQUFJLFNBQW9CLENBQUM7SUFFekIsVUFBVSxDQUFDO1FBQ1QsSUFBSSxHQUFHLElBQUksdUJBQUksQ0FBQyxLQUFLLEVBQUU7WUFDckIsZ0JBQWdCLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUUsWUFBWTtZQUM3RSxrQkFBa0IsRUFBRSxXQUFXLEVBQUUsYUFBYTtTQUMvQyxDQUFDLENBQUM7UUFDSCxPQUFPLEdBQUcsRUFBRSxDQUFDLHFCQUFxQixDQUFDLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzNELE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDL0IsV0FBVyxHQUFHLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN2QyxPQUFPLEdBQUcsSUFBSSxpQkFBTyxDQUFDLElBQTRCLENBQUMsQ0FBQztRQUNwRCxTQUFTLEdBQUcsSUFBSSxxQkFBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDaEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsZ0RB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