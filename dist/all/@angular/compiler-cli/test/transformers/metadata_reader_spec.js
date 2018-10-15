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
var metadata_1 = require("../../src/metadata");
var metadata_reader_1 = require("../../src/transformers/metadata_reader");
var mocks_1 = require("../mocks");
describe('metadata reader', function () {
    var host;
    beforeEach(function () {
        var context = new mocks_1.MockAotContext('/tmp/src', clone(FILES));
        var metadataCollector = new metadata_1.MetadataCollector();
        host = {
            fileExists: function (fileName) { return context.fileExists(fileName); },
            readFile: function (fileName) { return context.readFile(fileName); },
            getSourceFileMetadata: function (fileName) {
                var sourceText = context.readFile(fileName);
                return sourceText != null ?
                    metadataCollector.getMetadata(ts.createSourceFile(fileName, sourceText, ts.ScriptTarget.Latest)) :
                    undefined;
            },
        };
    });
    it('should be able to read a metadata file', function () {
        expect(metadata_reader_1.readMetadata('node_modules/@angular/core.d.ts', host)).toEqual([
            { __symbolic: 'module', version: metadata_1.METADATA_VERSION, metadata: { foo: { __symbolic: 'class' } } }
        ]);
    });
    it('should be able to read metadata from an otherwise unused .d.ts file ', function () {
        expect(metadata_reader_1.readMetadata('node_modules/@angular/unused.d.ts', host)).toEqual([dummyMetadata]);
    });
    it('should be able to read empty metadata ', function () { expect(metadata_reader_1.readMetadata('node_modules/@angular/empty.d.ts', host)).toEqual([]); });
    it('should return undefined for missing modules', function () { expect(metadata_reader_1.readMetadata('node_modules/@angular/missing.d.ts', host)).toBeUndefined(); });
    it("should add missing v" + metadata_1.METADATA_VERSION + " metadata from v1 metadata and .d.ts files", function () {
        expect(metadata_reader_1.readMetadata('metadata_versions/v1.d.ts', host)).toEqual([
            { __symbolic: 'module', version: 1, metadata: { foo: { __symbolic: 'class' } } }, {
                __symbolic: 'module',
                version: metadata_1.METADATA_VERSION,
                metadata: {
                    foo: { __symbolic: 'class' },
                    aType: { __symbolic: 'interface' },
                    Bar: { __symbolic: 'class', members: { ngOnInit: [{ __symbolic: 'method' }] } },
                    BarChild: { __symbolic: 'class', extends: { __symbolic: 'reference', name: 'Bar' } },
                    ReExport: { __symbolic: 'reference', module: './lib/utils2', name: 'ReExport' },
                },
                exports: [{ from: './lib/utils2', export: ['Export'] }],
            }
        ]);
    });
    it("should upgrade a missing metadata file into v" + metadata_1.METADATA_VERSION, function () {
        expect(metadata_reader_1.readMetadata('metadata_versions/v1_empty.d.ts', host)).toEqual([{
                __symbolic: 'module',
                version: metadata_1.METADATA_VERSION,
                metadata: {},
                exports: [{ from: './lib/utils' }]
            }]);
    });
    it("should upgrade v3 metadata into v" + metadata_1.METADATA_VERSION, function () {
        expect(metadata_reader_1.readMetadata('metadata_versions/v3.d.ts', host)).toEqual([
            { __symbolic: 'module', version: 3, metadata: { foo: { __symbolic: 'class' } } }, {
                __symbolic: 'module',
                version: metadata_1.METADATA_VERSION,
                metadata: {
                    foo: { __symbolic: 'class' },
                    aType: { __symbolic: 'interface' },
                    Bar: { __symbolic: 'class', members: { ngOnInit: [{ __symbolic: 'method' }] } },
                    BarChild: { __symbolic: 'class', extends: { __symbolic: 'reference', name: 'Bar' } },
                    ReExport: { __symbolic: 'reference', module: './lib/utils2', name: 'ReExport' },
                }
                // Note: exports is missing because it was elided in the original.
            }
        ]);
    });
});
var dummyModule = 'export let foo: any[];';
var dummyMetadata = {
    __symbolic: 'module',
    version: metadata_1.METADATA_VERSION,
    metadata: { foo: { __symbolic: 'error', message: 'Variable not initialized', line: 0, character: 11 } }
};
var FILES = {
    'tmp': {
        'src': {
            'main.ts': "\n        import * as c from '@angular/core';\n        import * as r from '@angular/router';\n        import * as u from './lib/utils';\n        import * as cs from './lib/collections';\n        import * as u2 from './lib2/utils2';\n      ",
            'lib': {
                'utils.ts': dummyModule,
                'collections.ts': dummyModule,
            },
            'lib2': { 'utils2.ts': dummyModule },
            'node_modules': {
                '@angular': {
                    'core.d.ts': dummyModule,
                    'core.metadata.json': "{\"__symbolic\":\"module\", \"version\": " + metadata_1.METADATA_VERSION + ", \"metadata\": {\"foo\": {\"__symbolic\": \"class\"}}}",
                    'router': { 'index.d.ts': dummyModule, 'src': { 'providers.d.ts': dummyModule } },
                    'unused.d.ts': dummyModule,
                    'empty.d.ts': 'export declare var a: string;',
                    'empty.metadata.json': '[]',
                }
            },
            'metadata_versions': {
                'v1.d.ts': "\n          import {ReExport} from './lib/utils2';\n          export {ReExport};\n\n          export {Export} from './lib/utils2';\n\n          export type aType = number;\n\n          export declare class Bar {\n            ngOnInit() {}\n          }\n          export declare class BarChild extends Bar {}\n        ",
                'v1.metadata.json': "{\"__symbolic\":\"module\", \"version\": 1, \"metadata\": {\"foo\": {\"__symbolic\": \"class\"}}}",
                'v1_empty.d.ts': "\n          export * from './lib/utils';\n        ",
                'v3.d.ts': "\n          import {ReExport} from './lib/utils2';\n          export {ReExport};\n\n          export {Export} from './lib/utils2';\n\n          export type aType = number;\n\n          export declare class Bar {\n            ngOnInit() {}\n          }\n          export declare class BarChild extends Bar {}\n        ",
                'v3.metadata.json': "{\"__symbolic\":\"module\", \"version\": 3, \"metadata\": {\"foo\": {\"__symbolic\": \"class\"}}}",
            }
        }
    }
};
function clone(entry) {
    if (typeof entry === 'string') {
        return entry;
    }
    else {
        var result = {};
        for (var name_1 in entry) {
            result[name_1] = clone(entry[name_1]);
        }
        return result;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YWRhdGFfcmVhZGVyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvdGVzdC90cmFuc2Zvcm1lcnMvbWV0YWRhdGFfcmVhZGVyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCwrQkFBaUM7QUFFakMsK0NBQXVGO0FBQ3ZGLDBFQUF3RjtBQUN4RixrQ0FBMEQ7QUFFMUQsUUFBUSxDQUFDLGlCQUFpQixFQUFFO0lBQzFCLElBQUksSUFBd0IsQ0FBQztJQUU3QixVQUFVLENBQUM7UUFDVCxJQUFNLE9BQU8sR0FBRyxJQUFJLHNCQUFjLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzdELElBQU0saUJBQWlCLEdBQUcsSUFBSSw0QkFBaUIsRUFBRSxDQUFDO1FBQ2xELElBQUksR0FBRztZQUNMLFVBQVUsRUFBRSxVQUFDLFFBQVEsSUFBSyxPQUFBLE9BQU8sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQTVCLENBQTRCO1lBQ3RELFFBQVEsRUFBRSxVQUFDLFFBQVEsSUFBSyxPQUFBLE9BQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQTFCLENBQTBCO1lBQ2xELHFCQUFxQixFQUFFLFVBQUMsUUFBUTtnQkFDOUIsSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDOUMsT0FBTyxVQUFVLElBQUksSUFBSSxDQUFDLENBQUM7b0JBQ3ZCLGlCQUFpQixDQUFDLFdBQVcsQ0FDekIsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3hFLFNBQVMsQ0FBQztZQUNoQixDQUFDO1NBQ0YsQ0FBQztJQUNKLENBQUMsQ0FBQyxD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