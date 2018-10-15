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
var o = require("@angular/compiler/src/output/output_ast");
var ts = require("typescript");
var node_emitter_1 = require("../../src/transformers/node_emitter");
var mocks_1 = require("../mocks");
var sourceMap = require('source-map');
var someGenFilePath = '/somePackage/someGenFile';
var someGenFileName = someGenFilePath + '.ts';
var someSourceFilePath = '/somePackage/someSourceFile';
var anotherModuleUrl = '/somePackage/someOtherPath';
var sameModuleIdentifier = new o.ExternalReference(null, 'someLocalId', null);
var externalModuleIdentifier = new o.ExternalReference(anotherModuleUrl, 'someExternalId', null);
describe('TypeScriptNodeEmitter', function () {
    var context;
    var host;
    var emitter;
    var someVar;
    beforeEach(function () {
        context = new mocks_1.MockAotContext('/', FILES);
        host = new mocks_1.MockCompilerHost(context);
        emitter = new node_emitter_1.TypeScriptNodeEmitter();
        someVar = o.variable('someVar', null, null);
    });
    function emitStmt(stmt, format, preamble) {
        if (format === void 0) { format = 1 /* Flat */; }
        var stmts = Array.isArray(stmt) ? stmt : [stmt];
        var program = ts.createProgram([someGenFileName], { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 }, host);
        var moduleSourceFile = program.getSourceFile(someGenFileName);
        var transformers = {
            before: [function (context) {
                    return function (sourceFile) {
                        var newSourceFile = emitter.updateSourceFile(sourceFile, stmts, preamble)[0];
                        return newSourceFile;
                    };
                }]
        };
        var result = '';
        var emitResult = program.emit(moduleSourceFile, function (fileName, data, writeByteOrderMark, onError, sourceFiles) {
            if (fileName.startsWith(someGenFilePath)) {
                result = data;
            }
        }, undefined, undefined, transformers);
        return normalizeResult(result, format);
    }
    it('should declare variables', function () {
        expect(emitStmt(someVar.set(o.literal(1)).toDeclStmt())).toEqual("var someVar = 1;");
        expect(emitStmt(someVar.set(o.literal(1)).toDeclStmt(null, [o.StmtModifier.Final])))
            .toEqual("var someVar = 1;");
        expect(emitStmt(someVar.set(o.literal(1)).toDeclStmt(null, [o.StmtModifier.Exported])))
            .toEqual("var someVar = 1; exports.someVar = someVar;");
    });
    describe('declare variables with ExternExpressions as values', function () {
        it('should create no reexport if the identifier is in the same module', function () {
            // identifier is in the same module -> no reexport
            expect(emitStmt(someVar.set(o.importExpr(sameModuleIdentifier)).toDeclStmt(null, [
                o.StmtModifier.Exported
            ]))).toEqual('var someVar = someLocalId; exports.someVar = someVar;');
        });
        it('should create no reexport if the variable is not exported', function () {
            expect(emitStmt(someVar.set(o.importExpr(externalModuleIdentifier)).toDeclStmt()))
                .toEqual("const i0 = require(\"/somePackage/someOtherPath\"); var someVar = i0.someExternalId;");
        });
        it('should create no reexport if the variable is typed', function () {
            expect(emitStmt(someVar.set(o.importExpr(externalModuleIdentifier))
                .toDeclStmt(o.DYNAMIC_TYPE, [o.StmtModifier.Exported])))
                .toEqual("const i0 = require(\"/somePackage/someOtherPath\"); var someVar = i0.someExternalId; exports.someVar = someVar;");
        });
        it('should create a reexport', function () {
            expect(emitStmt(someVar.set(o.importExpr(externalModuleIdentifier))
                .toDeclStmt(null, [o.StmtModifier.Exported])))
                .toEqual("var someOtherPath_1 = require(\"/somePackage/someOtherPath\"); exports.someVar = someOtherPath_1.someExternalId;");
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
                .toEqual("var someOtherPath_1 = require(\"/somePackage/someOtherPath\"); exports.someVar = someOtherPath_1.someExternalId; exports.someVar2 = someOtherPath_1.someExternalId2;");
        });
    });
    it('should read and write variables', function () {
        expect(emitStmt(someVar.toStmt())).toEqual("someVar;");
        expect(emitStmt(someVar.set(o.literal(1)).toStmt())).toEqual("someVar = 1;");
        expect(emitStmt(someVar.set(o.variable('someOtherVar').set(o.literal(1))).toStmt()))
            .toEqual("someVar = someOtherVar = 1;");
    });
    it('should read and write keys', function () {
        expect(emitStmt(o.variable('someMap').key(o.variable('someKey')).toStmt()))
            .toEqual("someMap[someKey];");
        expect(emitStmt(o.variable('someMap').key(o.variable('someKey')).set(o.literal(1)).toStmt()))
            .toEqual("someMap[someKey] = 1;");
    });
    it('should read and write properties', function () {
        expect(emitStmt(o.variable('someObj').prop('someProp').toStmt())).toEqual("someObj.someProp;");
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
        expect(emitStmt(o.literal('someStr').toStmt())).toEqual("\"someStr\";");
        expect(emitStmt(o.literalArr([o.literal(1)]).toStmt())).toEqual("[1];");
        expect(emitStmt(o.literalMap([
            { key: 'someKey', value: o.literal(1), quoted: false },
            { key: 'a', value: o.literal('a'), quoted: false },
            { key: 'b', value: o.literal('b'), quoted: true },
            { key: '*', value: o.literal('star'), quoted: false },
        ]).toStmt())
            .replace(/\s+/gm, ''))
            .toEqual("({someKey:1,a:\"a\",\"b\":\"b\",\"*\":\"star\"});");
        // Regressions #22774
        expect(emitStmt(o.literal('\\0025BC').toStmt())).toEqual('"\\\\0025BC";');
        expect(emitStmt(o.literal('"some value"').toStmt())).toEqual('"\\"some value\\"";');
        expect(emitStmt(o.literal('"some \\0025BC value"').toStmt()))
            .toEqual('"\\"some \\\\0025BC value\\"";');
        expect(emitStmt(o.literal('\n \\0025BC \n ').toStmt())).toEqual('"\\n \\\\0025BC \\n ";');
        expect(emitStmt(o.literal('\r \\0025BC \r ').toStmt())).toEqual('"\\r \\\\0025BC \\r ";');
    });
    it('should support blank literals', function () {
        expect(emitStmt(o.literal(null).toStmt())).toEqual('null;');
        expect(emitStmt(o.literal(undefined).toStmt())).toEqual('undefined;');
        expect(emitStmt(o.variable('a', null).isBlank().toStmt())).toEqual('(a == null);');
    });
    it('should support external identifiers', function () {
        expect(emitStmt(o.importExpr(sameModuleIdentifier).toStmt())).toEqual('someLocalId;');
        expect(emitStmt(o.importExpr(externalModuleIdentifier).toStmt()))
            .toEqual("const i0 = require(\"/somePackage/someOtherPath\"); i0.someExternalId;");
    });
    it('should support operators', function () {
        var lhs = o.variable('lhs');
        var rhs = o.variable('rhs');
        expect(emitStmt(someVar.cast(o.INT_TYPE).toStmt())).toEqual('someVar;');
        expect(emitStmt(o.not(someVar).toStmt())).toEqual('!someVar;');
        expect(emitStmt(o.assertNotNull(someVar).toStmt())).toEqual('someVar;');
        expect(emitStmt(someVar.conditional(o.variable('trueCase'), o.variable('falseCase')).toStmt()))
            .toEqual('(someVar ? trueCase : falseCase);');
        expect(emitStmt(someVar.conditional(o.variable('trueCase'), o.variable('falseCase'))
            .conditional(o.variable('trueCase'), o.variable('falseCase'))
            .toStmt()))
            .toEqual('((someVar ? trueCase : falseCase) ? trueCase : falseCase);');
        expect(emitStmt(lhs.equals(rhs).toStmt())).toEqual('(lhs == rhs);');
        expect(emitStmt(lhs.notEquals(rhs).toStmt())).toEqual('(lhs != rhs);');
        expect(emitStmt(lhs.identical(rhs).toStmt())).toEqual('(lhs === rhs);');
        expect(emitStmt(lhs.notIdentical(rhs).toStmt())).toEqual('(lhs !== rhs);');
        expect(emitStmt(lhs.minus(rhs).toStmt())).toEqual('(lhs - rhs);');
        expect(emitStmt(lhs.plus(rhs).toStmt())).toEqual('(lhs + rhs);');
        expect(emitStmt(lhs.divide(rhs).toStmt())).toEqual('(lhs / rhs);');
        expect(emitStmt(lhs.multiply(rhs).toStmt())).toEqual('(lhs * rhs);');
        expect(emitStmt(lhs.plus(rhs).multiply(rhs).toStmt())).toEqual('((lhs + rhs) * rhs);');
        expect(emitStmt(lhs.modulo(rhs).toStmt())).toEqual('(lhs % rhs);');
        expect(emitStmt(lhs.and(rhs).toStmt())).toEqual('(lhs && rhs);');
        expect(emitStmt(lhs.or(rhs).toStmt())).toEqual('(lhs || rhs);');
        expect(emitStmt(lhs.lower(rhs).toStmt())).toEqual('(lhs < rhs);');
        expect(emitStmt(lhs.lowerEquals(rhs).toStmt())).toEqual('(lhs <= rhs);');
        expect(emitStmt(lhs.bigger(rhs).toStmt())).toEqual('(lhs > rhs);');
        expect(emitStmt(lhs.biggerEquals(rhs).toStmt())).toEqual('(lhs >= rhs);');
    });
    it('should support function expressions', function () {
        expect(emitStmt(o.fn([], []).toStmt())).toEqual("(function () { });");
        expect(emitStmt(o.fn([], [new o.ReturnStatement(o.literal(1))], o.INT_TYPE).toStmt()))
            .toEqual("(function () { return 1; });");
        expect(emitStmt(o.fn([new o.FnParam('param1', o.INT_TYPE)], []).toStmt()))
            .toEqual("(function (param1) { });");
    });
    it('should support function statements', function () {
        expect(emitStmt(new o.DeclareFunctionStmt('someFn', [], []))).toEqual('function someFn() { }');
        expect(emitStmt(new o.DeclareFunctionStmt('someFn', [], [], null, [o.StmtModifier.Exported])))
            .toEqual("function someFn() { } exports.someFn = someFn;");
        expect(emitStmt(new o.DeclareFunctionStmt('someFn', [], [new o.ReturnStatement(o.literal(1))], o.INT_TYPE)))
            .toEqual("function someFn() { return 1; }");
        expect(emitStmt(new o.DeclareFunctionStmt('someFn', [new o.FnParam('param1', o.INT_TYPE)], []))).toEqual("function someFn(param1) { }");
    });
    describe('comments', function () {
        it('should support a preamble', function () {
            expect(emitStmt(o.variable('a').toStmt(), 1 /* Flat */, '/* SomePreamble */'))
                .toBe('/* SomePreamble */ a;');
        });
        it('should support singleline comments', function () { expect(emitStmt(new o.CommentStmt('Simple comment'))).toBe('// Simple comment'); });
        it('should support multiline comments', function () {
            expect(emitStmt(new o.CommentStmt('Multiline comment', true)))
                .toBe('/* Multiline comment */');
            expect(emitStmt(new o.CommentStmt("Multiline\ncomment", true), 0 /* Raw */))
                .toBe("/* Multiline\ncomment */");
        });
        describe('JSDoc comments', function () {
            it('should be supported', function () {
                expect(emitStmt(new o.JSDocCommentStmt([{ text: 'Intro comment' }]), 0 /* Raw */))
                    .toBe("/**\n * Intro comment\n */");
                expect(emitStmt(new o.JSDocCommentStmt([{ tagName: "desc" /* Desc */, text: 'description' }]), 0 /* Raw */))
                    .toBe("/**\n * @desc description\n */");
                expect(emitStmt(new o.JSDocCommentStmt([
                    { text: 'Intro comment' },
                    { tagName: "desc" /* Desc */, text: 'description' },
                    { tagName: "id" /* Id */, text: '{number} identifier 123' },
                ]), 0 /* Raw */))
                    .toBe("/**\n * Intro comment\n * @desc description\n * @id {number} identifier 123\n */");
            });
            it('should escape @ in the text', function () {
                expect(emitStmt(new o.JSDocCommentStmt([{ text: 'email@google.com' }]), 0 /* Raw */))
                    .toBe("/**\n * email\\@google.com\n */");
            });
            it('should not allow /* and */ in the text', function () {
                expect(function () { return emitStmt(new o.JSDocCommentStmt([{ text: 'some text /* */' }]), 0 /* Raw */); })
                    .toThrowError("JSDoc text cannot contain \"/*\" and \"*/\"");
            });
        });
    });
    it('should support if stmt', function () {
        var trueCase = o.variable('trueCase').callFn([]).toStmt();
        var falseCase = o.variable('falseCase').callFn([]).toStmt();
        expect(emitStmt(new o.IfStmt(o.variable('cond'), [trueCase])))
            .toEqual('if (cond) { trueCase(); }');
        expect(emitStmt(new o.IfStmt(o.variable('cond'), [trueCase], [falseCase])))
            .toEqual('if (cond) { trueCase(); } else { falseCase(); }');
    });
    it('should support try/catch', function () {
        var bodyStmt = o.variable('body').callFn([]).toStmt();
        var catchStmt = o.variable('catchFn').callFn([o.CATCH_ERROR_VAR, o.CATCH_STACK_VAR]).toStmt();
        expect(emitStmt(new o.TryCatchStmt([bodyStmt], [catchStmt])))
            .toEqual("try { body(); } catch (error) { var stack = error.stack; catchFn(error, stack); }");
    });
    it('should support support throwing', function () { expect(emitStmt(new o.ThrowStmt(someVar))).toEqual('throw someVar;'); });
    describe('classes', function () {
        var callSomeMethod;
        beforeEach(function () { callSomeMethod = o.THIS_EXPR.callMethod('someMethod', []).toStmt(); });
        it('should support declaring classes', function () {
            expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], null, []))).toEqual('class SomeClass { }');
            expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], null, [], [
                o.StmtModifier.Exported
            ]))).toEqual('class SomeClass { } exports.SomeClass = SomeClass;');
            expect(emitStmt(new o.ClassStmt('SomeClass', o.variable('SomeSuperClass'), [], [], null, []))).toEqual('class SomeClass extends SomeSuperClass { }');
        });
        it('should support declaring constructors', function () {
            var superCall = o.SUPER_EXPR.callFn([o.variable('someParam')]).toStmt();
            expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], new o.ClassMethod(null, [], []), [])))
                .toEqual("class SomeClass { constructor() { } }");
            expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], new o.ClassMethod(null, [new o.FnParam('someParam', o.INT_TYPE)], []), [])))
                .toEqual("class SomeClass { constructor(someParam) { } }");
            expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], new o.ClassMethod(null, [], [superCall]), [])))
                .toEqual("class SomeClass { constructor() { super(someParam); } }");
            expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], new o.ClassMethod(null, [], [callSomeMethod]), [])))
                .toEqual("class SomeClass { constructor() { this.someMethod(); } }");
        });
        it('should support declaring fields', function () {
            expect(emitStmt(new o.ClassStmt('SomeClass', null, [new o.ClassField('someField')], [], null, [])))
                .toEqual("class SomeClass { constructor() { this.someField = null; } }");
            expect(emitStmt(new o.ClassStmt('SomeClass', null, [new o.ClassField('someField', o.INT_TYPE)], [], null, [])))
                .toEqual("class SomeClass { constructor() { this.someField = null; } }");
            expect(emitStmt(new o.ClassStmt('SomeClass', null, [new o.ClassField('someField', o.INT_TYPE, [o.StmtModifier.Private])], [], null, [])))
                .toEqual("class SomeClass { constructor() { this.someField = null; } }");
        });
        it('should support declaring getters', function () {
            expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [new o.ClassGetter('someGetter', [])], null, [])))
                .toEqual("class SomeClass { get someGetter() { } }");
            expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [new o.ClassGetter('someGetter', [], o.INT_TYPE)], null, [])))
                .toEqual("class SomeClass { get someGetter() { } }");
            expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [new o.ClassGetter('someGetter', [callSomeMethod])], null, [])))
                .toEqual("class SomeClass { get someGetter() { this.someMethod(); } }");
            expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [new o.ClassGetter('someGetter', [], null, [o.StmtModifier.Private])], null, [])))
                .toEqual("class SomeClass { get someGetter() { } }");
        });
        it('should support methods', function () {
            expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], null, [
                new o.ClassMethod('someMethod', [], [])
            ]))).toEqual("class SomeClass { someMethod() { } }");
            expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], null, [
                new o.ClassMethod('someMethod', [], [], o.INT_TYPE)
            ]))).toEqual("class SomeClass { someMethod() { } }");
            expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], null, [
                new o.ClassMethod('someMethod', [new o.FnParam('someParam', o.INT_TYPE)], [])
            ]))).toEqual("class SomeClass { someMethod(someParam) { } }");
            expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], null, [
                new o.ClassMethod('someMethod', [], [callSomeMethod])
            ]))).toEqual("class SomeClass { someMethod() { this.someMethod(); } }");
        });
    });
    it('should support builtin types', function () {
        var writeVarExpr = o.variable('a').set(o.NULL_EXPR);
        expect(emitStmt(writeVarExpr.toDeclStmt(o.DYNAMIC_TYPE))).toEqual('var a = null;');
        expect(emitStmt(writeVarExpr.toDeclStmt(o.BOOL_TYPE))).toEqual('var a = null;');
        expect(emitStmt(writeVarExpr.toDeclStmt(o.INT_TYPE))).toEqual('var a = null;');
        expect(emitStmt(writeVarExpr.toDeclStmt(o.NUMBER_TYPE))).toEqual('var a = null;');
        expect(emitStmt(writeVarExpr.toDeclStmt(o.STRING_TYPE))).toEqual('var a = null;');
        expect(emitStmt(writeVarExpr.toDeclStmt(o.FUNCTION_TYPE))).toEqual('var a = null;');
    });
    it('should support external types', function () {
        var writeVarExpr = o.variable('a').set(o.NULL_EXPR);
        expect(emitStmt(writeVarExpr.toDeclStmt(o.importType(sameModuleIdentifier))))
            .toEqual('var a = null;');
        expect(emitStmt(writeVarExpr.toDeclStmt(o.importType(externalModuleIdentifier))))
            .toEqual("var a = null;");
    });
    it('should support expression types', function () {
        expect(emitStmt(o.variable('a').set(o.NULL_EXPR).toDeclStmt(o.expressionType(o.variable('b')))))
            .toEqual('var a = null;');
    });
    it('should support expressions with type parameters', function () {
        expect(emitStmt(o.variable('a')
            .set(o.NULL_EXPR)
            .toDeclStmt(o.importType(externalModuleIdentifier, [o.STRING_TYPE]))))
            .toEqual("var a = null;");
    });
    it('should support combined types', function () {
        var writeVarExpr = o.variable('a').set(o.NULL_EXPR);
        expect(emitStmt(writeVarExpr.toDeclStmt(new o.ArrayType(null)))).toEqual('var a = null;');
        expect(emitStmt(writeVarExpr.toDeclStmt(new o.ArrayType(o.INT_TYPE)))).toEqual('var a = null;');
        expect(emitStmt(writeVarExpr.toDeclStmt(new o.MapType(null)))).toEqual('var a = null;');
        expect(emitStmt(writeVarExpr.toDeclStmt(new o.MapType(o.INT_TYPE)))).toEqual('var a = null;');
    });
    describe('source maps', function () {
        function emitStmt(stmt, preamble) {
            var stmts = Array.isArray(stmt) ? stmt : [stmt];
            var program = ts.createProgram([someGenFileName], {
                module: ts.ModuleKind.CommonJS,
                target: ts.ScriptTarget.ES2017,
                sourceMap: true,
                inlineSourceMap: true,
                inlineSources: true,
            }, host);
            var moduleSourceFile = program.getSourceFile(someGenFileName);
            var transformers = {
                before: [function (context) {
                        return function (sourceFile) {
                            var newSourceFile = emitter.updateSourceFile(sourceFile, stmts, preamble)[0];
                            return newSourceFile;
                        };
                    }]
            };
            var result = '';
            var emitResult = program.emit(moduleSourceFile, function (fileName, data, writeByteOrderMark, onError, sourceFiles) {
                if (fileName.startsWith(someGenFilePath)) {
                    result = data;
                }
            }, undefined, undefined, transformers);
            return result;
        }
        function mappingItemsOf(text) {
            // find the source map:
            var sourceMapMatch = /sourceMappingURL\=data\:application\/json;base64,(.*)$/.exec(text);
            var sourceMapBase64 = sourceMapMatch[1];
            var sourceMapBuffer = Buffer.from(sourceMapBase64, 'base64');
            var sourceMapText = sourceMapBuffer.toString('utf8');
            var sourceMapParsed = JSON.parse(sourceMapText);
            var consumer = new sourceMap.SourceMapConsumer(sourceMapParsed);
            var mappings = [];
            consumer.eachMapping(function (mapping) { mappings.push(mapping); });
            return mappings;
        }
        it('should produce a source map that maps back to the source', function () {
            var statement = someVar.set(o.literal(1)).toDeclStmt();
            var text = '<my-comp> a = 1 </my-comp>';
            var sourceName = '/some/file.html';
            var sourceUrl = '../some/file.html';
            var file = new compiler_1.ParseSourceFile(text, sourceName);
            var start = new compiler_1.ParseLocation(file, 0, 0, 0);
            var end = new compiler_1.ParseLocation(file, text.length, 0, text.length);
            statement.sourceSpan = new compiler_1.ParseSourceSpan(start, end);
            var result = emitStmt(statement);
            var mappings = mappingItemsOf(result);
            expect(mappings).toEqual([
                {
                    source: sourceUrl,
                    generatedLine: 3,
                    generatedColumn: 0,
                    originalLine: 1,
                    originalColumn: 0,
                    name: null // TODO: Review use of `!` here (#19904)
                },
                {
                    source: sourceUrl,
                    generatedLine: 3,
                    generatedColumn: 16,
                    originalLine: 1,
                    originalColumn: 26,
                    name: null // TODO: Review use of `!` here (#19904)
                }
            ]);
        });
        it('should produce a mapping per range instead of a mapping per node', function () {
            var text = '<my-comp> a = 1 </my-comp>';
            var sourceName = '/some/file.html';
            var sourceUrl = '../some/file.html';
            var file = new compiler_1.ParseSourceFile(text, sourceName);
            var start = new compiler_1.ParseLocation(file, 0, 0, 0);
            var end = new compiler_1.ParseLocation(file, text.length, 0, text.length);
            var stmt = function (loc) {
                var start = new compiler_1.ParseLocation(file, loc, 0, loc);
                var end = new compiler_1.ParseLocation(file, loc + 1, 0, loc + 1);
                var span = new compiler_1.ParseSourceSpan(start, end);
                return someVar
                    .set(new o.BinaryOperatorExpr(o.BinaryOperator.Plus, o.literal(loc, null, span), o.literal(loc, null, span), null, span))
                    .toDeclStmt();
            };
            var stmts = [1, 2, 3, 4, 5, 6].map(stmt);
            var result = emitStmt(stmts);
            var mappings = mappingItemsOf(result);
            // The span is used in three different nodes but should only be emitted at most twice
            // (once for the start and once for the end of a span).
            var maxDup = Math.max.apply(Math, Array.from(countsOfDuplicatesMap(mappings.map(function (m) { return m.originalColumn; })).values()));
            expect(maxDup <= 2).toBeTruthy('A redundant range was emitted');
        });
    });
});
function countsOfDuplicatesMap(a) {
    var result = new Map();
    for (var _i = 0, a_1 = a; _i < a_1.length; _i++) {
        var item = a_1[_i];
        result.set(item, (result.get(item) || 0) + 1);
    }
    return result;
}
var FILES = {
    somePackage: { 'someGenFile.ts': "export var a: number;" }
};
function normalizeResult(result, format) {
    // Remove TypeScript prefixes
    var res = result.replace('"use strict";', ' ')
        .replace('exports.__esModule = true;', ' ')
        .replace('Object.defineProperty(exports, "__esModule", { value: true });', ' ');
    // Remove new lines
    // Squish adjacent spaces
    if (format === 1 /* Flat */) {
        return res.replace(/\n/g, ' ').replace(/ +/g, ' ').replace(/^ /g, '').replace(/ $/g, '');
    }
    // Remove prefix and postfix spaces
    return res.trim();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZV9lbWl0dGVyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvdGVzdC90cmFuc2Zvcm1lcnMvbm9kZV9lbWl0dGVyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw4Q0FBa0Y7QUFDbEYsMkRBQTZEO0FBQzdELCtCQUFpQztBQUVqQyxvRUFBMEU7QUFDMUUsa0NBQXFFO0FBRXJFLElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUV4QyxJQUFNLGVBQWUsR0FBRywwQkFBMEIsQ0FBQztBQUNuRCxJQUFNLGVBQWUsR0FBRyxlQUFlLEdBQUcsS0FBSyxDQUFDO0FBQ2hELElBQU0sa0JBQWtCLEdBQUcsNkJBQTZCLENBQUM7QUFDekQsSUFBTSxnQkFBZ0IsR0FBRyw0QkFBNEIsQ0FBQztBQUV0RCxJQUFNLG9CQUFvQixHQUFHLElBQUksQ0FBQyxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFFaEYsSUFBTSx3QkFBd0IsR0FBRyxJQUFJLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUVuRyxRQUFRLENBQUMsdUJBQXVCLEVBQUU7SUFDaEMsSUFBSSxPQUF1QixDQUFDO0lBQzVCLElBQUksSUFBc0IsQ0FBQztJQUMzQixJQUFJLE9BQThCLENBQUM7SUFDbkMsSUFBSSxPQUFzQixDQUFDO0lBRTNCLFVBQVUsQ0FBQztRQUNULE9BQU8sR0FBRyxJQUFJLHNCQUFjLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3pDLElBQUksR0FBRyxJQUFJLHdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3JDLE9BQU8sR0FBRyxJQUFJLG9DQUFxQixFQUFFLENBQUM7UUFDdEMsT0FBTyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM5QyxDQUFDLENBQUMsQ0FBQztJQUVILGtCQUNJLElBQWlDLEVBQUUsTUFBNEIsRUFBRSxRQUFpQjtRQUEvQyx1QkFBQSxFQUFBLHFCQUE0QjtRQUNqRSxJQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFbEQsSUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FDNUIsQ0FBQyxlQUFlLENBQUMsRUFBRSxFQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMvRixJQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDaEUsSUFBTSxZQUFZLEdBQTBCO1lBQzFDLE1BQU0sRUFBRSxDQUFDLFVBQUEsT0FBTztvQkFDZCxPQUFPLFVBQUEsVUFBVTt3QkFDUixJQUFBLHdFQUFhLENBQTBEO3dCQUM5RSxPQUFPLGFBQWEsQ0FBQztvQkFDdkIsQ0FBQyxDQUFDO2dCQUNKLENBQUMsQ0FBQztTQUNILENBQUM7UUFDRixJQUFJLE1BQU0sR0FBVyxFQUFFLENBQUM7UUFDeEIsSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FDM0IsZ0JBQWdCLEVBQUUsVUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFLE9BQU8sRUFBRSxXQUFXO1lBQ3pFLElBQUksUUFBUSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsRUFBRTtnQkFDeEMsTUFBTSxHQUFHLElBQUksQ0FBQzthQUNmO1FBQ0gsQ0FBQyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDM0MsT0FBTyxlQUFlLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFRCxFQUFFLENBQUMsMEJBQTBCLEVBQUU7UUFDN0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDckYsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDL0UsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDakMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDbEYsT0FBTyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7SUFDOUQsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsb0RBQW9ELEVBQUU7UUFDN0QsRUFBRSxDQUFDLG1FQUFtRSxFQUFFO1lBQ3RFLGtEQUFrRDtZQUNsRCxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRTtnQkFDL0UsQ0FBQyxDQUFDLFlBQVksQ0FBQyxRQUFRO2FBQ3hCLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLHVEQUF1RCxDQUFDLENBQUM7UUFDeEUsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsMkRBQTJELEVBQUU7WUFDOUQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7aUJBQzdFLE9BQU8sQ0FDSixzRkFBb0YsQ0FBQyxDQUFDO1FBQ2hHLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLG9EQUFvRCxFQUFFO1lBQ3ZELE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLHdCQUF3QixDQUFDLENBQUM7aUJBQzlDLFVBQVUsQ0FBQyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3ZFLE9BQU8sQ0FDSixpSEFBK0csQ0FBQyxDQUFDO1FBQzNILENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDBCQUEwQixFQUFFO1lBQzdCLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLHdCQUF3QixDQUFDLENBQUM7aUJBQzlDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDN0QsT0FBTyxDQUNKLGtIQUFnSCxDQUFDLENBQUM7UUFDNUgsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMscURBQXFELEVBQUU7WUFDeEQsSUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN4QyxJQUFNLHlCQUF5QixHQUMzQixJQUFJLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsRUFBRSxpQkFBaUIsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN2RSxNQUFNLENBQUMsUUFBUSxDQUFDO2dCQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO3FCQUM5QyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDaEQsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLHlCQUF5QixDQUFDLENBQUM7cUJBQ2hELFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQ2pELENBQUMsQ0FBQztpQkFDRSxPQUFPLENBQ0osc0tBQW9LLENBQUMsQ0FBQztRQUNoTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGlDQUFpQyxFQUFFO1FBQ3BDLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDdkQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzdFLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO2FBQy9FLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0lBQzlDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDRCQUE0QixFQUFFO1FBQy9CLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7YUFDdEUsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDbEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO2FBQ3hGLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0lBQ3hDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGtDQUFrQyxFQUFFO1FBQ3JDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQy9GLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO2FBQzlFLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0lBQ3hDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHNEQUFzRCxFQUFFO1FBQ3pELE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzdGLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQzthQUNwRixPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUN2QyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQzthQUN6RSxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUNwQyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxzREFBc0QsRUFBRTtRQUN6RCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUM3RixNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7YUFDcEYsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDdkMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7YUFDekUsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDcEMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsZ0NBQWdDLEVBQUU7UUFDbkMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzthQUNiLFVBQVUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzthQUM3RCxNQUFNLEVBQUUsQ0FBQyxDQUFDO2FBQzFCLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBRW5DLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUM7YUFDbkIsVUFBVSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7YUFDekUsTUFBTSxFQUFFLENBQUMsQ0FBQzthQUMxQixPQUFPLENBQUMsaUNBQWlDLENBQUMsQ0FBQztRQUVoRCxNQUFNLENBQUMsUUFBUSxDQUNKLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQzthQUMzRixPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUNwQyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyx5QkFBeUIsRUFBRTtRQUM1QixNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0RCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM1RCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFZLENBQUMsQ0FBQztRQUN0RSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztZQUNWLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFDO1lBQ3BELEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFDO1lBQ2hELEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFDO1lBQy9DLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFDO1NBQ3BELENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUNqQixPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2FBQzVCLE9BQU8sQ0FBQyxtREFBeUMsQ0FBQyxDQUFDO1FBRXhELHFCQUFxQjtRQUNyQixNQUFNLENBQUMsUUFBUSxDQUFD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T0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ2xFLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ2pFLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ25FLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBQ3ZGLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ25FLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ2pFLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ2hFLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUs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