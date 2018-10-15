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
var schema_1 = require("../../src/metadata/schema");
var symbols_1 = require("../../src/metadata/symbols");
var typescript_mocks_1 = require("./typescript.mocks");
describe('Symbols', function () {
    var symbols;
    var someValue = 'some-value';
    beforeEach(function () { return symbols = new symbols_1.Symbols(null); });
    it('should be able to add a symbol', function () { return symbols.define('someSymbol', someValue); });
    beforeEach(function () { return symbols.define('someSymbol', someValue); });
    it('should be able to `has` a symbol', function () { return expect(symbols.has('someSymbol')).toBeTruthy(); });
    it('should be able to `get` a symbol value', function () { return expect(symbols.resolve('someSymbol')).toBe(someValue); });
    it('should be able to `get` a symbol value', function () { return expect(symbols.resolve('someSymbol')).toBe(someValue); });
    it('should be able to determine symbol is missing', function () { return expect(symbols.has('missingSymbol')).toBeFalsy(); });
    it('should return undefined from `get` for a missing symbol', function () { return expect(symbols.resolve('missingSymbol')).toBeUndefined(); });
    var host;
    var service;
    var program;
    var expressions;
    var imports;
    beforeEach(function () {
        host = new typescript_mocks_1.Host(FILES, ['consts.ts', 'expressions.ts', 'imports.ts']);
        service = ts.createLanguageService(host);
        program = service.getProgram();
        expressions = program.getSourceFile('expressions.ts');
        imports = program.getSourceFile('imports.ts');
    });
    it('should not have syntax errors in the test sources', function () {
        typescript_mocks_1.expectNoDiagnostics(service.getCompilerOptionsDiagnostics());
        for (var _i = 0, _a = program.getSourceFiles(); _i < _a.length; _i++) {
            var sourceFile = _a[_i];
            typescript_mocks_1.expectNoDiagnostics(service.getSyntacticDiagnostics(sourceFile.fileName));
        }
    });
    it('should be able to find the source files', function () {
        expect(expressions).toBeDefined();
        expect(imports).toBeDefined();
    });
    it('should be able to create symbols for a source file', function () {
        var symbols = new symbols_1.Symbols(expressions);
        expect(symbols).toBeDefined();
    });
    it('should be able to find symbols in expression', function () {
        var symbols = new symbols_1.Symbols(expressions);
        expect(symbols.has('someName')).toBeTruthy();
        expect(symbols.resolve('someName'))
            .toEqual({ __symbolic: 'reference', module: './consts', name: 'someName' });
        expect(symbols.has('someBool')).toBeTruthy();
        expect(symbols.resolve('someBool'))
            .toEqual({ __symbolic: 'reference', module: './consts', name: 'someBool' });
    });
    it('should be able to detect a * import', function () {
        var symbols = new symbols_1.Symbols(imports);
        expect(symbols.resolve('b')).toEqual({ __symbolic: 'reference', module: 'b' });
    });
    it('should be able to detect importing a default export', function () {
        var symbols = new symbols_1.Symbols(imports);
        expect(symbols.resolve('d')).toEqual({ __symbolic: 'reference', module: 'd', default: true });
    });
    it('should be able to import a renamed symbol', function () {
        var symbols = new symbols_1.Symbols(imports);
        expect(symbols.resolve('g')).toEqual({ __symbolic: 'reference', name: 'f', module: 'f' });
    });
    it('should be able to resolve any symbol in core global scope', function () {
        var core = program.getSourceFiles()
            .find(function (source) { return source.fileName.endsWith('lib.d.ts'); });
        expect(core).toBeDefined();
        var visit = function (node) {
            switch (node.kind) {
                case ts.SyntaxKind.VariableStatement:
                case ts.SyntaxKind.VariableDeclarationList:
                    return !!ts.forEachChild(node, visit);
                case ts.SyntaxKind.VariableDeclaration:
                    var variableDeclaration = node;
                    var nameNode = variableDeclaration.name;
                    var name_1 = nameNode.text;
                    var result = symbols.resolve(name_1);
                    expect(schema_1.isMetadataGlobalReferenceExpression(result) && result.name).toEqual(name_1);
                    // Ignore everything after Float64Array as it is IE specific.
                    return name_1 === 'Float64Array';
            }
            return false;
        };
        ts.forEachChild(core, visit);
    });
});
var FILES = {
    'consts.ts': "\n    export var someName = 'some-name';\n    export var someBool = true;\n    export var one = 1;\n    export var two = 2;\n  ",
    'expressions.ts': "\n    import {someName, someBool, one, two} from './consts';\n  ",
    'imports.ts': "\n    import * as b from 'b';\n    import 'c';\n    import d from 'd';\n    import {f as g} from 'f';\n  "
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ltYm9sc19zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3Rlc3QvbWV0YWRhdGEvc3ltYm9sc19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsK0JBQWlDO0FBRWpDLG9EQUE4RTtBQUM5RSxzREFBbUQ7QUFFbkQsdURBQXdFO0FBRXhFLFFBQVEsQ0FBQyxTQUFTLEVBQUU7SUFDbEIsSUFBSSxPQUFnQixDQUFDO0lBQ3JCLElBQU0sU0FBUyxHQUFHLFlBQVksQ0FBQztJQUUvQixVQUFVLENBQUMsY0FBTSxPQUFBLE9BQU8sR0FBRyxJQUFJLGlCQUFPLENBQUMsSUFBNEIsQ0FBQyxFQUFuRCxDQUFtRCxDQUFDLENBQUM7SUFFdEUsRUFBRSxDQUFDLGdDQUFnQyxFQUFFLGNBQU0sT0FBQSxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxTQUFTLENBQUMsRUFBdkMsQ0FBdUMsQ0FBQyxDQUFDO0lBRXBGLFVBQVUsQ0FBQyxjQUFNLE9BQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsU0FBUyxDQUFDLEVBQXZDLENBQXVDLENBQUMsQ0FBQztJQUUxRCxFQUFFLENBQUMsa0NBQWtDLEVBQUUsY0FBTSxPQUFBLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQTlDLENBQThDLENBQUMsQ0FBQztJQUM3RixFQUFFLENBQUMsd0NBQXdDLEVBQ3hDLGNBQU0sT0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBckQsQ0FBcUQsQ0FBQyxDQUFDO0lBQ2hFLEVBQUUsQ0FBQyx3Q0FBd0MsRUFDeEMsY0FBTSxPQUFBLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFD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