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
var index_1 = require("../../src/metadata/index");
var lower_expressions_1 = require("../../src/transformers/lower_expressions");
var metadata_cache_1 = require("../../src/transformers/metadata_cache");
var mocks_1 = require("../mocks");
var DEFAULT_FIELDS_TO_LOWER = ['useFactory', 'useValue', 'data'];
describe('Expression lowering', function () {
    describe('transform', function () {
        it('should be able to lower a simple expression', function () {
            expect(convert('const a = 1 +◊b: 2◊;')).toBe('const b = 2; const a = 1 + b; export { b };');
        });
        it('should be able to lower an expression in a decorator', function () {
            expect(convert("\n          import {Component} from '@angular/core';\n\n          @Component({\n            provider: [{provide: 'someToken', useFactory:\u25CAl: () => null\u25CA}]\n          })\n          class MyClass {}\n      ")).toContain('const l = () => null; exports.l = l;');
        });
        it('should be able to export a variable if the whole value is lowered', function () {
            expect(convert('/*a*/ const a =◊b: () => null◊;'))
                .toBe('/*a*/ const a = () => null; const b = a; export { b };');
        });
    });
    describe('collector', function () {
        it('should request a lowering for useValue', function () {
            var collected = collect("\n        import {Component} from '@angular/core';\n\n        enum SomeEnum {\n          OK,\n          NotOK\n        }\n\n        @Component({\n          provider: [{provide: 'someToken', useValue:\u25CAenum: SomeEnum.OK\u25CA}]\n        })\n        export class MyClass {}\n      ");
            expect(collected.requests.has(collected.annotations[0].start))
                .toBeTruthy('did not find the useValue');
        });
        it('should not request a lowering for useValue with a reference to a static property', function () {
            var collected = collect("\n        import {Component} from '@angular/core';\n\n        @Component({\n          provider: [{provide: 'someToken', useValue:\u25CAvalue: MyClass.someMethod\u25CA}]\n        })\n        export class MyClass {\n          static someMethod() {}\n        }\n      ");
            expect(collected.requests.size).toBe(0);
        });
        it('should request a lowering for useFactory', function () {
            var collected = collect("\n        import {Component} from '@angular/core';\n\n        @Component({\n          provider: [{provide: 'someToken', useFactory:\u25CAlambda: () => null\u25CA}]\n        })\n        export class MyClass {}\n      ");
            expect(collected.requests.has(collected.annotations[0].start))
                .toBeTruthy('did not find the useFactory');
        });
        it('should request a lowering for data', function () {
            var collected = collect("\n        import {Component} from '@angular/core';\n\n        enum SomeEnum {\n          OK,\n          NotOK\n        }\n\n        @Component({\n          provider: [{provide: 'someToken', data:\u25CAenum: SomeEnum.OK\u25CA}]\n        })\n        export class MyClass {}\n      ");
            expect(collected.requests.has(collected.annotations[0].start))
                .toBeTruthy('did not find the data field');
        });
        it('should not lower a non-module', function () {
            var collected = collect("\n          declare const global: any;\n          const ngDevMode: boolean = (function(global: any) {\n            return global.ngDevMode = true;\n          })(typeof window != 'undefined' && window || typeof self != 'undefined' && self || typeof global != 'undefined' && global);\n       ");
            expect(collected.requests.size).toBe(0, 'unexpected rewriting');
        });
        it('should throw a validation exception for invalid files', function () {
            var cache = new metadata_cache_1.MetadataCache(new index_1.MetadataCollector({}), /* strict */ true, [new lower_expressions_1.LowerMetadataTransform(DEFAULT_FIELDS_TO_LOWER)]);
            var sourceFile = ts.createSourceFile('foo.ts', "\n        import {Injectable} from '@angular/core';\n\n        class SomeLocalClass {}\n        @Injectable()\n        export class SomeClass {\n          constructor(a: SomeLocalClass) {}\n        }\n      ", ts.ScriptTarget.Latest, true);
            expect(function () { return cache.getMetadata(sourceFile); }).toThrow();
        });
        it('should not report validation errors on a .d.ts file', function () {
            var cache = new metadata_cache_1.MetadataCache(new index_1.MetadataCollector({}), /* strict */ true, [new lower_expressions_1.LowerMetadataTransform(DEFAULT_FIELDS_TO_LOWER)]);
            var dtsFile = ts.createSourceFile('foo.d.ts', "\n        import {Injectable} from '@angular/core';\n\n        class SomeLocalClass {}\n        @Injectable()\n        export class SomeClass {\n          constructor(a: SomeLocalClass) {}\n        }\n      ", ts.ScriptTarget.Latest, true);
            expect(function () { return cache.getMetadata(dtsFile); }).not.toThrow();
        });
    });
});
function getAnnotations(annotatedSource) {
    var annotations = [];
    var adjustment = 0;
    var unannotatedSource = annotatedSource.replace(/◊([a-zA-Z]+):(.*)◊/g, function (text, name, source, index) {
        annotations.push({ start: index + adjustment, length: source.length, name: name });
        adjustment -= text.length - source.length;
        return source;
    });
    return { unannotatedSource: unannotatedSource, annotations: annotations };
}
// Transform helpers
function convert(annotatedSource) {
    var _a;
    var _b = getAnnotations(annotatedSource), annotations = _b.annotations, unannotatedSource = _b.unannotatedSource;
    var baseFileName = 'someFile';
    var moduleName = '/' + baseFileName;
    var fileName = moduleName + '.ts';
    var context = new mocks_1.MockAotContext('/', (_a = {}, _a[baseFileName + '.ts'] = unannotatedSource, _a));
    var host = new mocks_1.MockCompilerHost(context);
    var sourceFile = ts.createSourceFile(fileName, unannotatedSource, ts.ScriptTarget.Latest, /* setParentNodes */ true);
    var requests = new Map();
    for (var _i = 0, annotations_1 = annotations; _i < annotations_1.length; _i++) {
        var annotation = annotations_1[_i];
        var node = findNode(sourceFile, annotation.start, annotation.length);
        if (!node)
            throw new Error('Invalid test specification. Could not find the node to substitute');
        var location_1 = node.pos;
        requests.set(location_1, { name: annotation.name, kind: node.kind, location: location_1, end: node.end });
    }
    var program = ts.createProgram([fileName], { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 }, host);
    var moduleSourceFile = program.getSourceFile(fileName);
    var transformers = {
        before: [lower_expressions_1.getExpressionLoweringTransformFactory({
                getRequests: function (sourceFile) {
                    if (sourceFile.fileName == moduleSourceFile.fileName) {
                        return requests;
                    }
                    else {
                        return new Map();
                    }
                }
            }, program)]
    };
    var result = '';
    var emitResult = program.emit(moduleSourceFile, function (emittedFileName, data, writeByteOrderMark, onError, sourceFiles) {
        if (fileName.startsWith(moduleName)) {
            result = data;
        }
    }, undefined, undefined, transformers);
    return normalizeResult(result);
}
function findNode(node, start, length) {
    function find(node) {
        if (node.getFullStart() == start && node.getEnd() == start + length) {
            return node;
        }
        if (node.getFullStart() <= start && node.getEnd() >= start + length) {
            return ts.forEachChild(node, find);
        }
    }
    return ts.forEachChild(node, find);
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
// Collector helpers
function collect(annotatedSource) {
    var _a = getAnnotations(annotatedSource), annotations = _a.annotations, unannotatedSource = _a.unannotatedSource;
    var transformer = new lower_expressions_1.LowerMetadataTransform(DEFAULT_FIELDS_TO_LOWER);
    var cache = new metadata_cache_1.MetadataCache(new index_1.MetadataCollector({}), false, [transformer]);
    var sourceFile = ts.createSourceFile('someName.ts', unannotatedSource, ts.ScriptTarget.Latest, /* setParentNodes */ true);
    return {
        metadata: cache.getMetadata(sourceFile),
        requests: transformer.getRequests(sourceFile), annotations: annotations
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG93ZXJfZXhwcmVzc2lvbnNfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS90ZXN0L3RyYW5zZm9ybWVycy9sb3dlcl9leHByZXNzaW9uc19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsK0JBQWlDO0FBRWpDLGtEQUEyRTtBQUMzRSw4RUFBNEo7QUFDNUosd0VBQW9FO0FBQ3BFLGtDQUFxRTtBQUVyRSxJQUFNLHVCQUF1QixHQUFHLENBQUMsWUFBWSxFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUVuRSxRQUFRLENBQUMscUJBQXFCLEVBQUU7SUFDOUIsUUFBUSxDQUFDLFdBQVcsRUFBRTtRQUNwQixFQUFFLENBQUMsNkNBQTZDLEVBQUU7WUFDaEQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLDZDQUE2QyxDQUFDLENBQUM7UUFDOUYsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsc0RBQXNELEVBQUU7WUFDekQsTUFBTSxDQUFDLE9BQU8sQ0FBQyx3TkFPZCxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsc0NBQXNDLENBQUMsQ0FBQztRQUN4RCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxtRUFBbUUsRUFBRTtZQUN0RSxNQUFNLENBQUMsT0FBTyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7aUJBQzdDLElBQUksQ0FBQyx3REFBd0QsQ0FBQyxDQUFDO1FBQ3RFLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsV0FBVyxFQUFFO1FBQ3BCLEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRTtZQUMzQyxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsNlJBWXpCLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxTQUFTLENBQUMs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