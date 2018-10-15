"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var o = require("@angular/compiler/src/output/output_ast");
var ts_emitter_1 = require("@angular/compiler/src/output/ts_emitter");
var parse_util_1 = require("@angular/compiler/src/parse_util");
var abstract_emitter_spec_1 = require("./abstract_emitter_spec");
var someGenFilePath = 'somePackage/someGenFile';
var anotherModuleUrl = 'somePackage/someOtherPath';
var sameModuleIdentifier = new o.ExternalReference(null, 'someLocalId', null);
var externalModuleIdentifier = new o.ExternalReference(anotherModuleUrl, 'someExternalId', null);
{
    // Not supported features of our OutputAst in TS:
    // - real `const` like in Dart
    // - final fields
    describe('TypeScriptEmitter', function () {
        var emitter;
        var someVar;
        beforeEach(function () {
            emitter = new ts_emitter_1.TypeScriptEmitter();
            someVar = o.variable('someVar', null, null);
        });
        function emitStmt(stmt, preamble) {
            var stmts = Array.isArray(stmt) ? stmt : [stmt];
            var source = emitter.emitStatements(someGenFilePath, stmts, preamble);
            return abstract_emitter_spec_1.stripSourceMapAndNewLine(source);
        }
        it('should declare variables', function () {
            expect(emitStmt(someVar.set(o.literal(1)).toDeclStmt())).toEqual("var someVar:any = 1;");
            expect(emitStmt(someVar.set(o.literal(1)).toDeclStmt(null, [o.StmtModifier.Final])))
                .toEqual("const someVar:any = 1;");
            expect(emitStmt(someVar.set(o.literal(1)).toDeclStmt(null, [o.StmtModifier.Exported])))
                .toEqual("export var someVar:any = 1;");
            expect(emitStmt(someVar.set(o.literal(1)).toDeclStmt(o.INT_TYPE)))
                .toEqual("var someVar:number = 1;");
            expect(emitStmt(someVar.set(o.literal(1)).toDeclStmt(o.INFERRED_TYPE)))
                .toEqual("var someVar = 1;");
        });
        describe('declare variables with ExternExpressions as values', function () {
            it('should create no reexport if the identifier is in the same module', function () {
                // identifier is in the same module -> no reexport
                expect(emitStmt(someVar.set(o.importExpr(sameModuleIdentifier)).toDeclStmt(null, [
                    o.StmtModifier.Exported
                ]))).toEqual('export var someVar:any = someLocalId;');
            });
            it('should create no reexport if the variable is not exported', function () {
                expect(emitStmt(someVar.set(o.importExpr(externalModuleIdentifier)).toDeclStmt())).toEqual([
                    "import * as i0 from 'somePackage/someOtherPath';", "var someVar:any = i0.someExternalId;"
                ].join('\n'));
            });
            it('should create no reexport if the variable is typed', function () {
                expect(emitStmt(someVar.set(o.importExpr(externalModuleIdentifier))
                    .toDeclStmt(o.DYNAMIC_TYPE, [o.StmtModifier.Exported])))
                    .toEqual([
                    "import * as i0 from 'somePackage/someOtherPath';",
                    "export var someVar:any = i0.someExternalId;"
                ].join('\n'));
            });
            it('should create a reexport', function () {
                expect(emitStmt(someVar.set(o.importExpr(externalModuleIdentifier))
                    .toDeclStmt(null, [o.StmtModifier.Exported])))
                    .toEqual([
                    "export {someExternalId as someVar} from 'somePackage/someOtherPath';", ""
                ].join('\n'));
            });
            it('should create multiple reexports from the same file', function () {
                var someVar2 = o.variable('someVar2');
                var externalModuleIdentifier2 = new o.ExternalReference(anotherModuleUrl, 'someExternalId2', null);
                expect(emitStmt([
                    someVar.set(o.importExpr(externalModuleIdentifier))
                        .toDeclStmt(null, [o.StmtModifier.Exported]),
                    someVar2.set(o.importExpr(externalModuleIdentifier2))
                        .toDeclStmt(null, [o.StmtModifier.Exported])
                ]))
                    .toEqual([
                    "export {someExternalId as someVar,someExternalId2 as someVar2} from 'somePackage/someOtherPath';",
                    ""
                ].join('\n'));
            });
        });
        it('should read and write variables', function () {
            expect(emitStmt(someVar.toStmt())).toEqual("someVar;");
            expect(emitStmt(someVar.set(o.literal(1)).toStmt())).toEqual("someVar = 1;");
            expect(emitStmt(someVar.set(o.variable('someOtherVar').set(o.literal(1))).toStmt()))
                .toEqual("someVar = (someOtherVar = 1);");
        });
        it('should read and write keys', function () {
            expect(emitStmt(o.variable('someMap').key(o.variable('someKey')).toStmt()))
                .toEqual("someMap[someKey];");
            expect(emitStmt(o.variable('someMap').key(o.variable('someKey')).set(o.literal(1)).toStmt()))
                .toEqual("someMap[someKey] = 1;");
        });
        it('should read and write properties', function () {
            expect(emitStmt(o.variable('someObj').prop('someProp').toStmt()))
                .toEqual("someObj.someProp;");
            expect(emitStmt(o.variable('someObj').prop('someProp').set(o.literal(1)).toStmt()))
                .toEqual("someObj.someProp = 1;");
        });
        it('should invoke functions and methods and constructors', function () {
            expect(emitStmt(o.variable('someFn').callFn([o.literal(1)]).toStmt())).toEqual('someFn(1);');
            expect(emitStmt(o.variable('someObj').callMethod('someMethod', [o.literal(1)]).toStmt()))
                .toEqual('someObj.someMethod(1);');
            expect(emitStmt(o.variable('SomeClass').instantiate([o.literal(1)]).toStmt()))
                .toEqual('new SomeClass(1);');
        });
        it('should support builtin methods', function () {
            expect(emitStmt(o.variable('arr1')
                .callMethod(o.BuiltinMethod.ConcatArray, [o.variable('arr2')])
                .toStmt()))
                .toEqual('arr1.concat(arr2);');
            expect(emitStmt(o.variable('observable')
                .callMethod(o.BuiltinMethod.SubscribeObservable, [o.variable('listener')])
                .toStmt()))
                .toEqual('observable.subscribe(listener);');
            expect(emitStmt(o.variable('fn').callMethod(o.BuiltinMethod.Bind, [o.variable('someObj')]).toStmt()))
                .toEqual('fn.bind(someObj);');
        });
        it('should support literals', function () {
            expect(emitStmt(o.literal(0).toStmt())).toEqual('0;');
            expect(emitStmt(o.literal(true).toStmt())).toEqual('true;');
            expect(emitStmt(o.literal('someStr').toStmt())).toEqual("'someStr';");
            expect(emitStmt(o.literalArr([o.literal(1)]).toStmt())).toEqual("[1];");
            expect(emitStmt(o.literalMap([
                { key: 'someKey', value: o.literal(1), quoted: false },
                { key: 'a', value: o.literal('a'), quoted: false },
                { key: '*', value: o.literal('star'), quoted: true },
            ]).toStmt())
                .replace(/\s+/gm, ''))
                .toEqual("{someKey:1,a:'a','*':'star'};");
        });
        it('should break expressions into multiple lines if they are too long', function () {
            var values = new Array(100);
            values.fill(o.literal(1));
            values.splice(50, 0, o.fn([], [new o.ReturnStatement(o.literal(1))]));
            expect(emitStmt(o.variable('fn').callFn(values).toStmt())).toEqual([
                'fn(1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,',
                '    1,1,1,1,1,1,1,1,1,1,():void => {', '      return 1;',
                '    },1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,',
                '    1,1,1,1,1,1,1,1,1,1,1,1);'
            ].join('\n'));
        });
        it('should support blank literals', function () {
            expect(emitStmt(o.literal(null).toStmt())).toEqual('(null as any);');
            expect(emitStmt(o.literal(undefined).toStmt())).toEqual('(undefined as any);');
            expect(emitStmt(o.variable('a', null).isBlank().toStmt())).toEqual('(a == null);');
        });
        it('should support external identifiers', function () {
            expect(emitStmt(o.importExpr(sameModuleIdentifier).toStmt())).toEqual('someLocalId;');
            expect(emitStmt(o.importExpr(externalModuleIdentifier).toStmt())).toEqual([
                "import * as i0 from 'somePackage/someOtherPath';", "i0.someExternalId;"
            ].join('\n'));
        });
        it('should support operators', function () {
            var lhs = o.variable('lhs');
            var rhs = o.variable('rhs');
            expect(emitStmt(someVar.cast(o.INT_TYPE).toStmt())).toEqual('(<number>someVar);');
            expect(emitStmt(o.not(someVar).toStmt())).toEqual('!someVar;');
            expect(emitStmt(o.assertNotNull(someVar).toStmt())).toEqual('someVar!;');
            expect(emitStmt(someVar.conditional(o.variable('trueCase'), o.variable('falseCase')).toStmt()))
                .toEqual('(someVar? trueCase: falseCase);');
            expect(emitStmt(lhs.equals(rhs).toStmt())).toEqual('(lhs == rhs);');
            expect(emitStmt(lhs.notEquals(rhs).toStmt())).toEqual('(lhs != rhs);');
            expect(emitStmt(lhs.identical(rhs).toStmt())).toEqual('(lhs === rhs);');
            expect(emitStmt(lhs.notIdentical(rhs).toStmt())).toEqual('(lhs !== rhs);');
            expect(emitStmt(lhs.minus(rhs).toStmt())).toEqual('(lhs - rhs);');
            expect(emitStmt(lhs.plus(rhs).toStmt())).toEqual('(lhs + rhs);');
            expect(emitStmt(lhs.divide(rhs).toStmt())).toEqual('(lhs / rhs);');
            expect(emitStmt(lhs.multiply(rhs).toStmt())).toEqual('(lhs * rhs);');
            expect(emitStmt(lhs.modulo(rhs).toStmt())).toEqual('(lhs % rhs);');
            expect(emitStmt(lhs.and(rhs).toStmt())).toEqual('(lhs && rhs);');
            expect(emitStmt(lhs.or(rhs).toStmt())).toEqual('(lhs || rhs);');
            expect(emitStmt(lhs.lower(rhs).toStmt())).toEqual('(lhs < rhs);');
            expect(emitStmt(lhs.lowerEquals(rhs).toStmt())).toEqual('(lhs <= rhs);');
            expect(emitStmt(lhs.bigger(rhs).toStmt())).toEqual('(lhs > rhs);');
            expect(emitStmt(lhs.biggerEquals(rhs).toStmt())).toEqual('(lhs >= rhs);');
        });
        it('should support function expressions', function () {
            expect(emitStmt(o.fn([], []).toStmt())).toEqual(['():void => {', '};'].join('\n'));
            expect(emitStmt(o.fn([], [new o.ReturnStatement(o.literal(1))], o.INT_TYPE).toStmt()))
                .toEqual(['():number => {', '  return 1;\n};'].join('\n'));
            expect(emitStmt(o.fn([new o.FnParam('param1', o.INT_TYPE)], []).toStmt())).toEqual([
                '(param1:number):void => {', '};'
            ].join('\n'));
        });
        it('should support function statements', function () {
            expect(emitStmt(new o.DeclareFunctionStmt('someFn', [], []))).toEqual(['function someFn():void {', '}'].join('\n'));
            expect(emitStmt(new o.DeclareFunctionStmt('someFn', [], [], null, [o.StmtModifier.Exported])))
                .toEqual(['export function someFn():void {', '}'].join('\n'));
            expect(emitStmt(new o.DeclareFunctionStmt('someFn', [], [new o.ReturnStatement(o.literal(1))], o.INT_TYPE)))
                .toEqual(['function someFn():number {', '  return 1;', '}'].join('\n'));
            expect(emitStmt(new o.DeclareFunctionStmt('someFn', [new o.FnParam('param1', o.INT_TYPE)], []))).toEqual(['function someFn(param1:number):void {', '}'].join('\n'));
        });
        it('should support comments', function () {
            expect(emitStmt(new o.CommentStmt('a\nb'))).toEqual(['// a', '// b'].join('\n'));
        });
        it('should support if stmt', function () {
            var trueCase = o.variable('trueCase').callFn([]).toStmt();
            var falseCase = o.variable('falseCase').callFn([]).toStmt();
            expect(emitStmt(new o.IfStmt(o.variable('cond'), [trueCase]))).toEqual([
                'if (cond) { trueCase(); }'
            ].join('\n'));
            expect(emitStmt(new o.IfStmt(o.variable('cond'), [trueCase], [falseCase]))).toEqual([
                'if (cond) {', '  trueCase();', '} else {', '  falseCase();', '}'
            ].join('\n'));
        });
        it('should support try/catch', function () {
            var bodyStmt = o.variable('body').callFn([]).toStmt();
            var catchStmt = o.variable('catchFn').callFn([o.CATCH_ERROR_VAR, o.CATCH_STACK_VAR]).toStmt();
            expect(emitStmt(new o.TryCatchStmt([bodyStmt], [catchStmt]))).toEqual([
                'try {', '  body();', '} catch (error) {', '  const stack:any = error.stack;',
                '  catchFn(error,stack);', '}'
            ].join('\n'));
        });
        it('should support support throwing', function () { expect(emitStmt(new o.ThrowStmt(someVar))).toEqual('throw someVar;'); });
        describe('classes', function () {
            var callSomeMethod;
            beforeEach(function () { callSomeMethod = o.THIS_EXPR.callMethod('someMethod', []).toStmt(); });
            it('should support declaring classes', function () {
                expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], null, []))).toEqual(['class SomeClass {', '}'].join('\n'));
                expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], null, [], [
                    o.StmtModifier.Exported
                ]))).toEqual(['export class SomeClass {', '}'].join('\n'));
                expect(emitStmt(new o.ClassStmt('SomeClass', o.variable('SomeSuperClass'), [], [], null, []))).toEqual(['class SomeClass extends SomeSuperClass {', '}'].join('\n'));
            });
            it('should support declaring constructors', function () {
                var superCall = o.SUPER_EXPR.callFn([o.variable('someParam')]).toStmt();
                expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], new o.ClassMethod(null, [], []), [])))
                    .toEqual(['class SomeClass {', '  constructor() {', '  }', '}'].join('\n'));
                expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], new o.ClassMethod(null, [new o.FnParam('someParam', o.INT_TYPE)], []), [])))
                    .toEqual(['class SomeClass {', '  constructor(someParam:number) {', '  }', '}'].join('\n'));
                expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], new o.ClassMethod(null, [], [superCall]), [])))
                    .toEqual([
                    'class SomeClass {', '  constructor() {', '    super(someParam);', '  }', '}'
                ].join('\n'));
                expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], new o.ClassMethod(null, [], [callSomeMethod]), [])))
                    .toEqual([
                    'class SomeClass {', '  constructor() {', '    this.someMethod();', '  }', '}'
                ].join('\n'));
            });
            it('should support declaring fields', function () {
                expect(emitStmt(new o.ClassStmt('SomeClass', null, [new o.ClassField('someField')], [], null, [])))
                    .toEqual(['class SomeClass {', '  someField:any;', '}'].join('\n'));
                expect(emitStmt(new o.ClassStmt('SomeClass', null, [new o.ClassField('someField', o.INT_TYPE)], [], null, [])))
                    .toEqual(['class SomeClass {', '  someField:number;', '}'].join('\n'));
                expect(emitStmt(new o.ClassStmt('SomeClass', null, [new o.ClassField('someField', o.INT_TYPE, [o.StmtModifier.Private])], [], null, [])))
                    .toEqual(['class SomeClass {', '  /*private*/ someField:number;', '}'].join('\n'));
            });
            it('should support declaring getters', function () {
                expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [new o.ClassGetter('someGetter', [])], null, [])))
                    .toEqual(['class SomeClass {', '  get someGetter():any {', '  }', '}'].join('\n'));
                expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [new o.ClassGetter('someGetter', [], o.INT_TYPE)], null, [])))
                    .toEqual(['class SomeClass {', '  get someGetter():number {', '  }', '}'].join('\n'));
                expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [new o.ClassGetter('someGetter', [callSomeMethod])], null, [])))
                    .toEqual([
                    'class SomeClass {', '  get someGetter():any {', '    this.someMethod();', '  }', '}'
                ].join('\n'));
                expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [new o.ClassGetter('someGetter', [], null, [o.StmtModifier.Private])], null, [])))
                    .toEqual(['class SomeClass {', '  private get someGetter():any {', '  }', '}'].join('\n'));
            });
            it('should support methods', function () {
                expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], null, [
                    new o.ClassMethod('someMethod', [], [])
                ]))).toEqual(['class SomeClass {', '  someMethod():void {', '  }', '}'].join('\n'));
                expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], null, [
                    new o.ClassMethod('someMethod', [], [], o.INT_TYPE)
                ]))).toEqual(['class SomeClass {', '  someMethod():number {', '  }', '}'].join('\n'));
                expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], null, [new o.ClassMethod('someMethod', [new o.FnParam('someParam', o.INT_TYPE)], [])])))
                    .toEqual([
                    'class SomeClass {', '  someMethod(someParam:number):void {', '  }', '}'
                ].join('\n'));
                expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], null, [new o.ClassMethod('someMethod', [], [callSomeMethod])])))
                    .toEqual([
                    'class SomeClass {', '  someMethod():void {', '    this.someMethod();', '  }', '}'
                ].join('\n'));
            });
        });
        it('should support builtin types', function () {
            var writeVarExpr = o.variable('a').set(o.NULL_EXPR);
            expect(emitStmt(writeVarExpr.toDeclStmt(o.DYNAMIC_TYPE)))
                .toEqual('var a:any = (null as any);');
            expect(emitStmt(writeVarExpr.toDeclStmt(o.BOOL_TYPE)))
                .toEqual('var a:boolean = (null as any);');
            expect(emitStmt(writeVarExpr.toDeclStmt(o.INT_TYPE)))
                .toEqual('var a:number = (null as any);');
            expect(emitStmt(writeVarExpr.toDeclStmt(o.NUMBER_TYPE)))
                .toEqual('var a:number = (null as any);');
            expect(emitStmt(writeVarExpr.toDeclStmt(o.STRING_TYPE)))
                .toEqual('var a:string = (null as any);');
            expect(emitStmt(writeVarExpr.toDeclStmt(o.FUNCTION_TYPE)))
                .toEqual('var a:Function = (null as any);');
        });
        it('should support external types', function () {
            var writeVarExpr = o.variable('a').set(o.NULL_EXPR);
            expect(emitStmt(writeVarExpr.toDeclStmt(o.importType(sameModuleIdentifier))))
                .toEqual('var a:someLocalId = (null as any);');
            expect(emitStmt(writeVarExpr.toDeclStmt(o.importType(externalModuleIdentifier)))).toEqual([
                "import * as i0 from 'somePackage/someOtherPath';",
                "var a:i0.someExternalId = (null as any);"
            ].join('\n'));
        });
        it('should support expression types', function () {
            expect(emitStmt(o.variable('a').set(o.NULL_EXPR).toDeclStmt(o.expressionType(o.variable('b')))))
                .toEqual('var a:b = (null as any);');
        });
        it('should support expressions with type parameters', function () {
            expect(emitStmt(o.variable('a')
                .set(o.NULL_EXPR)
                .toDeclStmt(o.importType(externalModuleIdentifier, [o.STRING_TYPE]))))
                .toEqual([
                "import * as i0 from 'somePackage/someOtherPath';",
                "var a:i0.someExternalId<string> = (null as any);"
            ].join('\n'));
        });
        it('should support combined types', function () {
            var writeVarExpr = o.variable('a').set(o.NULL_EXPR);
            expect(emitStmt(writeVarExpr.toDeclStmt(new o.ArrayType(null))))
                .toEqual('var a:any[] = (null as any);');
            expect(emitStmt(writeVarExpr.toDeclStmt(new o.ArrayType(o.INT_TYPE))))
                .toEqual('var a:number[] = (null as any);');
            expect(emitStmt(writeVarExpr.toDeclStmt(new o.MapType(null))))
                .toEqual('var a:{[key: string]:any} = (null as any);');
            expect(emitStmt(writeVarExpr.toDeclStmt(new o.MapType(o.INT_TYPE))))
                .toEqual('var a:{[key: string]:number} = (null as any);');
        });
        describe('comments', function () {
            it('should support a preamble', function () {
                expect(emitStmt(o.variable('a').toStmt(), '/* SomePreamble */')).toBe([
                    '/* SomePreamble */', 'a;'
                ].join('\n'));
            });
            it('should support singleline comments', function () {
                expect(emitStmt(new o.CommentStmt('Simple comment'))).toBe('// Simple comment');
            });
            it('should support multiline comments', function () {
                expect(emitStmt(new o.CommentStmt('Multiline comment', true)))
                    .toBe('/* Multiline comment */');
                expect(emitStmt(new o.CommentStmt("Multiline\ncomment", true)))
                    .toBe("/* Multiline\ncomment */");
            });
            it('should support JSDoc comments', function () {
                expect(emitStmt(new o.JSDocCommentStmt([{ text: 'Intro comment' }])))
                    .toBe("/**\n * Intro comment\n */");
                expect(emitStmt(new o.JSDocCommentStmt([
                    { tagName: "desc" /* Desc */, text: 'description' }
                ]))).toBe("/**\n * @desc description\n */");
                expect(emitStmt(new o.JSDocCommentStmt([
                    { text: 'Intro comment' },
                    { tagName: "desc" /* Desc */, text: 'description' },
                    { tagName: "id" /* Id */, text: '{number} identifier 123' },
                ])))
                    .toBe("/**\n * Intro comment\n * @desc description\n * @id {number} identifier 123\n */");
            });
        });
        describe('emitter context', function () {
            it('should be able to back to the generating span', function () {
                var file = new parse_util_1.ParseSourceFile('some content', 'a.ts');
                var returnSpan = new parse_util_1.ParseSourceSpan(new parse_util_1.ParseLocation(file, 100, 10, 10), new parse_util_1.ParseLocation(file, 200, 20, 10));
                var referenceSpan = new parse_util_1.ParseSourceSpan(new parse_util_1.ParseLocation(file, 150, 15, 10), new parse_util_1.ParseLocation(file, 175, 17, 10));
                var statements = [new o.ClassStmt('SomeClass', null, [], [], new o.ClassMethod(null, [], []), [new o.ClassMethod('someMethod', [new o.FnParam('a', o.INT_TYPE)], [
                            o.variable('someVar', o.INT_TYPE).set(o.literal(0)).toDeclStmt(),
                            new o.ReturnStatement(o.variable('someVar', null, referenceSpan), returnSpan)
                        ])])];
                var _a = emitter.emitStatementsAndContext('a.ts', statements, '/* some preamble /*\n\n'), sourceText = _a.sourceText, context = _a.context;
                var spanOf = function (text, after) {
                    if (after === void 0) { after = 0; }
                    var location = sourceText.indexOf(text, after);
                    var _a = calculateLineCol(sourceText, location), line = _a.line, col = _a.col;
                    return context.spanOf(line, col);
                };
                var returnLoc = sourceText.indexOf('return');
                expect(spanOf('return someVar')).toEqual(returnSpan, 'return span calculated incorrectly');
                expect(spanOf(';', returnLoc)).toEqual(returnSpan, 'reference span calculated incorrectly');
                expect(spanOf('someVar', returnLoc))
                    .toEqual(referenceSpan, 'return span calculated incorrectly');
            });
        });
    });
}
function calculateLineCol(text, offset) {
    var lines = text.split('\n');
    var line = 0;
    for (var cur = 0; cur < text.length; line++) {
        var next = cur + lines[line].length + 1;
        if (next > offset) {
            return { line: line, col: offset - cur };
        }
        cur = next;
    }
    return { line: line, col: 0 };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHNfZW1pdHRlcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdC9vdXRwdXQvdHNfZW1pdHRlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBR0gsMkRBQTZEO0FBQzdELHNFQUEwRTtBQUMxRSwrREFBaUc7QUFDakcsaUVBQWlFO0FBRWpFLElBQU0sZUFBZSxHQUFHLHlCQUF5QixDQUFDO0FBQ2xELElBQU0sZ0JBQWdCLEdBQUcsMkJBQTJCLENBQUM7QUFFckQsSUFBTSxvQkFBb0IsR0FBRyxJQUFJLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBRWhGLElBQU0sd0JBQXdCLEdBQUcsSUFBSSxDQUFDLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFFbkc7SUFDRSxpREFBaUQ7SUFDakQsOEJBQThCO0lBQzlCLGlCQUFpQjtJQUVqQixRQUFRLENBQUMsbUJBQW1CLEVBQUU7UUFDNUIsSUFBSSxPQUEwQixDQUFDO1FBQy9CLElBQUksT0FBc0IsQ0FBQztRQUUzQixVQUFVLENBQUM7WUFDVCxPQUFPLEdBQUcsSUFBSSw4QkFBaUIsRUFBRSxDQUFDO1lBQ2xDLE9BQU8sR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDOUMsQ0FBQyxDQUFDLENBQUM7UUFFSCxrQkFBa0IsSUFBaUMsRUFBRSxRQUFpQjtZQUNwRSxJQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEQsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLGNB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QUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDckUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDbkUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDakUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDaEUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDbEUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDekUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDbkUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDNUUsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMscUNBQXFDLEVBQUU7WUFDeEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxD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