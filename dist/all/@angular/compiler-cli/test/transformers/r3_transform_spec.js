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
var ts = require("typescript");
var r3_transform_1 = require("../../src/transformers/r3_transform");
var mocks_1 = require("../mocks");
var someGenFilePath = '/somePackage/someGenFile';
var someGenFileName = someGenFilePath + '.ts';
describe('r3_transform_spec', function () {
    var context;
    var host;
    beforeEach(function () {
        context = new mocks_1.MockAotContext('/', FILES);
        host = new mocks_1.MockCompilerHost(context);
    });
    it('should be able to generate a simple identity function', function () {
        expect(emitStaticMethod(new o.ReturnStatement(o.variable('v')), ['v']))
            .toContain('static someMethod(v) { return v; }');
    });
    it('should be able to generate a static field declaration', function () { expect(emitStaticField(o.literal(10))).toContain('SomeClass.someField = 10'); });
    it('should be able to import a symbol', function () {
        expect(emitStaticMethod(new o.ReturnStatement(o.importExpr(new o.ExternalReference('@angular/core', 'Component')))))
            .toContain('static someMethod() { return i0.Component; } }');
    });
    it('should be able to modify multiple classes in the same module', function () {
        var result = emit(r3_transform_1.getAngularClassTransformerFactory([{
                fileName: someGenFileName,
                statements: [
                    classMethod(new o.ReturnStatement(o.variable('v')), ['v'], 'someMethod', 'SomeClass'),
                    classMethod(new o.ReturnStatement(o.variable('v')), ['v'], 'someOtherMethod', 'SomeOtherClass')
                ]
            }]));
        expect(result).toContain('static someMethod(v) { return v; }');
        expect(result).toContain('static someOtherMethod(v) { return v; }');
    });
    it('should insert imports after existing imports', function () {
        context = context.override({
            somePackage: {
                'someGenFile.ts': "\n        import {Component} from '@angular/core';\n\n        @Component({selector: 'some-class', template: 'hello!'})\n        export class SomeClass {}\n\n        export class SomeOtherClass {}\n      "
            }
        });
        host = new mocks_1.MockCompilerHost(context);
        expect(emitStaticMethod(new o.ReturnStatement(o.importExpr(new o.ExternalReference('@angular/core', 'Component')))))
            .toContain('const core_1 = require("@angular/core"); const i0 = require("@angular/core");');
    });
    function emit(factory) {
        var result = '';
        var program = ts.createProgram([someGenFileName], { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 }, host);
        var moduleSourceFile = program.getSourceFile(someGenFileName);
        var transformers = { before: [factory] };
        var emitResult = program.emit(moduleSourceFile, function (fileName, data, writeByteOrderMark, onError, sourceFiles) {
            if (fileName.startsWith(someGenFilePath)) {
                result = data;
            }
        }, undefined, undefined, transformers);
        return normalizeResult(result);
    }
    function emitStaticMethod(stmt, parameters, methodName, className) {
        if (parameters === void 0) { parameters = []; }
        if (methodName === void 0) { methodName = 'someMethod'; }
        if (className === void 0) { className = 'SomeClass'; }
        var module = {
            fileName: someGenFileName,
            statements: [classMethod(stmt, parameters, methodName, className)]
        };
        return emit(r3_transform_1.getAngularClassTransformerFactory([module]));
    }
    function emitStaticField(initializer, fieldName, className) {
        if (fieldName === void 0) { fieldName = 'someField'; }
        if (className === void 0) { className = 'SomeClass'; }
        var module = {
            fileName: someGenFileName,
            statements: [classField(initializer, fieldName, className)]
        };
        return emit(r3_transform_1.getAngularClassTransformerFactory([module]));
    }
});
var FILES = {
    somePackage: {
        'someGenFile.ts': "\n\n  export class SomeClass {}\n\n  export class SomeOtherClass {}\n"
    }
};
function classMethod(stmt, parameters, methodName, className) {
    if (parameters === void 0) { parameters = []; }
    if (methodName === void 0) { methodName = 'someMethod'; }
    if (className === void 0) { className = 'SomeClass'; }
    var statements = Array.isArray(stmt) ? stmt : [stmt];
    return new o.ClassStmt(
    /* name */ className, 
    /* parent */ null, 
    /* fields */ [], 
    /* getters */ [], 
    /* constructorMethod */ new o.ClassMethod(null, [], []), 
    /* methods */ [new o.ClassMethod(methodName, parameters.map(function (name) { return new o.FnParam(name); }), statements, null, [o.StmtModifier.Static])]);
}
function classField(initializer, fieldName, className) {
    if (fieldName === void 0) { fieldName = 'someField'; }
    if (className === void 0) { className = 'SomeClass'; }
    return new o.ClassStmt(
    /* name */ className, 
    /* parent */ null, 
    /* fields */ [new o.ClassField(fieldName, null, [o.StmtModifier.Static], initializer)], 
    /* getters */ [], 
    /* constructorMethod */ new o.ClassMethod(null, [], []), 
    /* methods */ []);
}
function normalizeResult(result) {
    // Remove TypeScript prefixes
    // Remove new lines
    // Squish adjacent spaces
    // Remove prefix and postfix spaces
    return result.replace('"use strict";', ' ')
        .replace('exports.__esModule = true;', ' ')
        .replace('Object.defineProperty(exports, "__esModule", { value: true });', ' ')
        .replace(/\n/g, ' ')
        .replace(/ +/g, ' ')
        .replace(/^ /g, '')
        .replace(/ $/g, '');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicjNfdHJhbnNmb3JtX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvdGVzdC90cmFuc2Zvcm1lcnMvcjNfdHJhbnNmb3JtX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFHSCwyREFBNkQ7QUFHN0QsK0JBQWlDO0FBRWpDLG9FQUFzRjtBQUN0RixrQ0FBcUU7QUFFckUsSUFBTSxlQUFlLEdBQUcsMEJBQTBCLENBQUM7QUFDbkQsSUFBTSxlQUFlLEdBQUcsZUFBZSxHQUFHLEtBQUssQ0FBQztBQUVoRCxRQUFRLENBQUMsbUJBQW1CLEVBQUU7SUFDNUIsSUFBSSxPQUF1QixDQUFDO0lBQzVCLElBQUksSUFBc0IsQ0FBQztJQUUzQixVQUFVLENBQUM7UUFDVCxPQUFPLEdBQUcsSUFBSSxzQkFBYyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN6QyxJQUFJLEdBQUcsSUFBSSx3QkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN2QyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyx1REFBdUQsRUFBRTtRQUMxRCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDbEUsU0FBUyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7SUFDdkQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsdURBQXVELEVBQ3ZELGNBQVEsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTVGLEVBQUUsQ0FBQyxtQ0FBbUMsRUFB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