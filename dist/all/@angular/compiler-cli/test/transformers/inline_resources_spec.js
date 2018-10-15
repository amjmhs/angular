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
var inline_resources_1 = require("../../src/transformers/inline_resources");
var metadata_cache_1 = require("../../src/transformers/metadata_cache");
var mocks_1 = require("../mocks");
describe('inline resources transformer', function () {
    describe('decorator input', function () {
        describe('should not touch unrecognized decorators', function () {
            it('Not from @angular/core', function () {
                expect(convert("declare const Component: Function;\n          @Component({templateUrl: './thing.html'}) class Foo {}"))
                    .toContain('templateUrl');
            });
            it('missing @ sign', function () {
                expect(convert("import {Component} from '@angular/core';\n          Component({templateUrl: './thing.html'}) class Foo {}"))
                    .toContain('templateUrl');
            });
            it('too many arguments to @Component', function () {
                expect(convert("import {Component} from '@angular/core';\n          @Component(1, {templateUrl: './thing.html'}) class Foo {}"))
                    .toContain('templateUrl');
            });
            it('wrong argument type to @Component', function () {
                expect(convert("import {Component} from '@angular/core';\n          @Component([{templateUrl: './thing.html'}]) class Foo {}"))
                    .toContain('templateUrl');
            });
        });
        it('should replace templateUrl', function () {
            var actual = convert("import {Component} from '@angular/core';\n        @Component({\n          templateUrl: './thing.html',\n\t        otherProp: 3,\n\t      }) export class Foo {}");
            expect(actual).not.toContain('templateUrl:');
            expect(actual.replace(/\s+/g, ' '))
                .toContain('Foo = __decorate([ core_1.Component({ template: "Some template", otherProp: 3 }) ], Foo)');
        });
        it('should allow different quotes', function () {
            var actual = convert("import {Component} from '@angular/core';\n        @Component({\"templateUrl\": `./thing.html`}) export class Foo {}");
            expect(actual).not.toContain('templateUrl:');
            expect(actual).toContain('{ template: "Some template" }');
        });
        it('should replace styleUrls', function () {
            var actual = convert("import {Component} from '@angular/core';\n        @Component({\n          styleUrls: ['./thing1.css', './thing2.css'],\n        })\n        export class Foo {}");
            expect(actual).not.toContain('styleUrls:');
            expect(actual).toContain('styles: [".some_style {}", ".some_other_style {}"]');
        });
        it('should preserve existing styles', function () {
            var actual = convert("import {Component} from '@angular/core';\n        @Component({\n          styles: ['h1 { color: blue }'],\n          styleUrls: ['./thing1.css'],\n        })\n        export class Foo {}");
            expect(actual).not.toContain('styleUrls:');
            expect(actual).toContain("styles: ['h1 { color: blue }', \".some_style {}\"]");
        });
        it('should handle empty styleUrls', function () {
            var actual = convert("import {Component} from '@angular/core';\n        @Component({styleUrls: [], styles: []}) export class Foo {}");
            expect(actual).not.toContain('styleUrls:');
            expect(actual).not.toContain('styles:');
        });
    });
    describe('annotation input', function () {
        it('should replace templateUrl', function () {
            var actual = convert("import {Component} from '@angular/core';\n      declare const NotComponent: Function;\n\n      export class Foo {\n        static decorators: {type: Function, args?: any[]}[] = [\n          {\n            type: NotComponent,\n            args: [],\n          },{\n            type: Component,\n            args: [{\n              templateUrl: './thing.html'\n          }],\n        }];\n      }\n    ");
            expect(actual).not.toContain('templateUrl:');
            expect(actual.replace(/\s+/g, ' '))
                .toMatch(/Foo\.decorators = [{ .*type: core_1\.Component, args: [{ template: "Some template" }]/);
        });
        it('should replace styleUrls', function () {
            var actual = convert("import {Component} from '@angular/core';\n      declare const NotComponent: Function;\n\n      export class Foo {\n        static decorators: {type: Function, args?: any[]}[] = [{\n          type: Component,\n          args: [{\n            styleUrls: ['./thing1.css', './thing2.css'],\n          }],\n        }];\n      }\n    ");
            expect(actual).not.toContain('styleUrls:');
            expect(actual.replace(/\s+/g, ' '))
                .toMatch(/Foo\.decorators = [{ .*type: core_1\.Component, args: [{ style: "Some template" }]/);
        });
    });
});
describe('metadata transformer', function () {
    it('should transform decorators', function () {
        var source = "import {Component} from '@angular/core';\n      @Component({\n        templateUrl: './thing.html',\n        styleUrls: ['./thing1.css', './thing2.css'],\n        styles: ['h1 { color: red }'],\n      })\n      export class Foo {}\n    ";
        var sourceFile = ts.createSourceFile('someFile.ts', source, ts.ScriptTarget.Latest, /* setParentNodes */ true);
        var cache = new metadata_cache_1.MetadataCache(new index_1.MetadataCollector(), /* strict */ true, [new inline_resources_1.InlineResourcesMetadataTransformer({ loadResource: loadResource, resourceNameToFileName: function (u) { return u; } })]);
        var metadata = cache.getMetadata(sourceFile);
        expect(metadata).toBeDefined('Expected metadata from test source file');
        if (metadata) {
            var classData = metadata.metadata['Foo'];
            expect(classData && index_1.isClassMetadata(classData))
                .toBeDefined("Expected metadata to contain data for Foo");
            if (classData && index_1.isClassMetadata(classData)) {
                expect(JSON.stringify(classData)).not.toContain('templateUrl');
                expect(JSON.stringify(classData)).toContain('"template":"Some template"');
                expect(JSON.stringify(classData)).not.toContain('styleUrls');
                expect(JSON.stringify(classData))
                    .toContain('"styles":["h1 { color: red }",".some_style {}",".some_other_style {}"]');
            }
        }
    });
});
function loadResource(path) {
    if (path === './thing.html')
        return 'Some template';
    if (path === './thing1.css')
        return '.some_style {}';
    if (path === './thing2.css')
        return '.some_other_style {}';
    throw new Error('No fake data for path ' + path);
}
function convert(source) {
    var _a;
    var baseFileName = 'someFile';
    var moduleName = '/' + baseFileName;
    var fileName = moduleName + '.ts';
    var context = new mocks_1.MockAotContext('/', (_a = {}, _a[baseFileName + '.ts'] = source, _a));
    var host = new mocks_1.MockCompilerHost(context);
    var sourceFile = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, /* setParentNodes */ true);
    var program = ts.createProgram([fileName], {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2017,
    }, host);
    var moduleSourceFile = program.getSourceFile(fileName);
    var transformers = {
        before: [inline_resources_1.getInlineResourcesTransformFactory(program, { loadResource: loadResource, resourceNameToFileName: function (u) { return u; } })]
    };
    var result = '';
    var emitResult = program.emit(moduleSourceFile, function (emittedFileName, data, writeByteOrderMark, onError, sourceFiles) {
        if (fileName.startsWith(moduleName)) {
            result = data;
        }
    }, undefined, undefined, transformers);
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5saW5lX3Jlc291cmNlc19zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3Rlc3QvdHJhbnNmb3JtZXJzL2lubGluZV9yZXNvdXJjZXNfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILCtCQUFpQztBQUVqQyxrREFBNEU7QUFDNUUsNEVBQStIO0FBQy9ILHdFQUFvRTtBQUNwRSxrQ0FBMEQ7QUFFMUQsUUFBUSxDQUFDLDhCQUE4QixFQUFFO0lBQ3ZDLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtRQUMxQixRQUFRLENBQUMsMENBQTBDLEVBQUU7WUFDbkQsRUFBRSxDQUFDLHdCQUF3QixFQUFFO2dCQUMzQixNQUFNLENBQUMsT0FBTyxDQUFDLHNHQUMwQyxDQUFDLENBQUM7cUJBQ3RELFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNoQyxDQUFDLENBQUMsQ0FBQztZQUNILEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDbkIsTUFBTSxDQUFDLE9BQU8sQ0FBQywyR0FDeUMsQ0FBQyxDQUFDO3FCQUNyRCxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDaEMsQ0FBQyxDQUFDLENBQUM7WUFDSCxFQUFFLENBQUMsa0NBQWtDLEVBQUU7Z0JBQ3JDLE1BQU0sQ0FBQyxPQUFPLENBQUMsK0dBQzZDLENBQUMsQ0FBQztxQkFDekQsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ2hDLENBQUMsQ0FBQyxDQUFDO1lBQ0gsRUFBRSxDQUFDLG1DQUFtQyxFQUFFO2dCQUN0QyxNQUFNLENBQUMsT0FBTyxDQUFDLDhHQUM0QyxDQUFDLENBQUM7cUJBQ3hELFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNoQyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDRCQUE0QixFQUFFO1lBQy9CLElB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