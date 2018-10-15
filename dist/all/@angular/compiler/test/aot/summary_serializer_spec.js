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
var compiler_cli_1 = require("@angular/compiler-cli");
var summary_serializer_1 = require("@angular/compiler/src/aot/summary_serializer");
var util_1 = require("@angular/compiler/src/aot/util");
var static_symbol_resolver_spec_1 = require("./static_symbol_resolver_spec");
var summary_resolver_spec_1 = require("./summary_resolver_spec");
{
    describe('summary serializer', function () {
        var summaryResolver;
        var symbolResolver;
        var symbolCache;
        var host;
        beforeEach(function () { symbolCache = new compiler_1.StaticSymbolCache(); });
        function init(summaries, metadata) {
            if (summaries === void 0) { summaries = {}; }
            if (metadata === void 0) { metadata = {}; }
            host = new summary_resolver_spec_1.MockAotSummaryResolverHost(summaries);
            summaryResolver = new compiler_1.AotSummaryResolver(host, symbolCache);
            symbolResolver = new compiler_1.StaticSymbolResolver(new static_symbol_resolver_spec_1.MockStaticSymbolResolverHost(metadata), symbolCache, summaryResolver);
        }
        describe('summaryFileName', function () {
            it('should add .ngsummary.json to the filename', function () {
                init();
                expect(util_1.summaryFileName('a.ts')).toBe('a.ngsummary.json');
                expect(util_1.summaryFileName('a.d.ts')).toBe('a.ngsummary.json');
                expect(util_1.summaryFileName('a.js')).toBe('a.ngsummary.json');
            });
        });
        it('should serialize various data correctly', function () {
            init();
            var serializedData = summary_serializer_1.serializeSummaries('someFile.ts', summary_resolver_spec_1.createMockOutputContext(), summaryResolver, symbolResolver, [
                {
                    symbol: symbolCache.get('/tmp/some_values.ts', 'Values'),
                    metadata: {
                        aNumber: 1,
                        aString: 'hello',
                        anArray: [1, 2],
                        aStaticSymbol: symbolCache.get('/tmp/some_symbol.ts', 'someName'),
                        aStaticSymbolWithMembers: symbolCache.get('/tmp/some_symbol.ts', 'someName', ['someMember']),
                    }
                },
                {
                    symbol: symbolCache.get('/tmp/some_service.ts', 'SomeService'),
                    metadata: {
                        __symbolic: 'class',
                        members: { 'aMethod': { __symbolic: 'function' } },
                        statics: { aStatic: true },
                        decorators: ['aDecoratorData']
                    }
                }
            ], [{
                    summary: {
                        summaryKind: compiler_1.CompileSummaryKind.Injectable,
                        type: {
                            reference: symbolCache.get('/tmp/some_service.ts', 'SomeService'),
                        }
                    },
                    metadata: null
                }]);
            var summaries = summary_serializer_1.deserializeSummaries(symbolCache, summaryResolver, 'someFile.d.ts', serializedData.json)
                .summaries;
            expect(summaries.length).toBe(2);
            // Note: change from .ts to .d.ts is expected
            expect(summaries[0].symbol).toBe(symbolCache.get('/tmp/some_values.d.ts', 'Values'));
            expect(summaries[0].metadata).toEqual({
                aNumber: 1,
                aString: 'hello',
                anArray: [1, 2],
                aStaticSymbol: symbolCache.get('/tmp/some_symbol.d.ts', 'someName'),
                aStaticSymbolWithMembers: symbolCache.get('/tmp/some_symbol.d.ts', 'someName', ['someMember'])
            });
            expect(summaries[1].symbol).toBe(symbolCache.get('/tmp/some_service.d.ts', 'SomeService'));
            // serialization should drop class decorators
            expect(summaries[1].metadata).toEqual({
                __symbolic: 'class',
                members: { aMethod: { __symbolic: 'function' } },
                statics: { aStatic: true }
            });
            expect(summaries[1].type.type.reference)
                .toBe(symbolCache.get('/tmp/some_service.d.ts', 'SomeService'));
        });
        it('should automatically add exported directives / pipes of NgModules that are not source files', function () {
            init();
            var externalSerialized = summary_serializer_1.serializeSummaries('someFile.ts', summary_resolver_spec_1.createMockOutputContext(), summaryResolver, symbolResolver, [
                { symbol: symbolCache.get('/tmp/external.ts', 'SomeExternalPipe'), metadata: null },
                { symbol: symbolCache.get('/tmp/external.ts', 'SomeExternalDir'), metadata: null },
            ], [
                {
                    summary: {
                        summaryKind: compiler_1.CompileSummaryKind.Pipe,
                        type: {
                            reference: symbolCache.get('/tmp/external.ts', 'SomeExternalPipe'),
                        }
                    },
                    metadata: null
                },
                {
                    summary: {
                        summaryKind: compiler_1.CompileSummaryKind.Directive,
                        type: {
                            reference: symbolCache.get('/tmp/external.ts', 'SomeExternalDir'),
                        },
                        providers: [],
                        viewProviders: [],
                    },
                    metadata: null
                }
            ]);
            init({
                '/tmp/external.ngsummary.json': externalSerialized.json,
            });
            var serialized = summary_serializer_1.serializeSummaries('someFile.ts', summary_resolver_spec_1.createMockOutputContext(), summaryResolver, symbolResolver, [
                { symbol: symbolCache.get('/tmp/some_module.ts', 'SomeModule'), metadata: null },
            ], [{
                    summary: {
                        summaryKind: compiler_1.CompileSummaryKind.NgModule,
                        type: { reference: symbolCache.get('/tmp/some_module.ts', 'SomeModule') },
                        exportedPipes: [
                            { reference: symbolCache.get('/tmp/some_pipe.ts', 'SomePipe') },
                            { reference: symbolCache.get('/tmp/external.d.ts', 'SomeExternalPipe') }
                        ],
                        exportedDirectives: [
                            { reference: symbolCache.get('/tmp/some_dir.ts', 'SomeDir') },
                            { reference: symbolCache.get('/tmp/external.d.ts', 'SomeExternalDir') }
                        ],
                        providers: [],
                        modules: [],
                    },
                    metadata: null
                }]);
            var summaries = summary_serializer_1.deserializeSummaries(symbolCache, summaryResolver, 'someFile.d.ts', serialized.json)
                .summaries;
            init({
                '/tmp/some_module.ngsummary.json': serialized.json,
            });
            var serializedReexport = summary_serializer_1.serializeSummaries('someFile.ts', summary_resolver_spec_1.createMockOutputContext(), summaryResolver, symbolResolver, [
                {
                    symbol: symbolCache.get('/tmp/some_reexport.ts', 'ReexportModule'),
                    metadata: symbolCache.get('/tmp/some_module.d.ts', 'SomeModule')
                },
            ], []);
            expect(summaries.length).toBe(3);
            expect(summaries[0].symbol).toBe(symbolCache.get('/tmp/some_module.d.ts', 'SomeModule'));
            expect(summaries[1].symbol).toBe(symbolCache.get('/tmp/external.d.ts', 'SomeExternalDir'));
            expect(summaries[2].symbol)
                .toBe(symbolCache.get('/tmp/external.d.ts', 'SomeExternalPipe'));
            var reexportSummaries = summary_serializer_1.deserializeSummaries(symbolCache, summaryResolver, 'someFile.d.ts', serializedReexport.json)
                .summaries;
            expect(reexportSummaries.length).toBe(4);
            expect(reexportSummaries[0].symbol)
                .toBe(symbolCache.get('/tmp/some_reexport.d.ts', 'ReexportModule'));
            expect(reexportSummaries[1].symbol)
                .toBe(symbolCache.get('/tmp/some_module.d.ts', 'SomeModule'));
            expect(reexportSummaries[2].symbol)
                .toBe(symbolCache.get('/tmp/external.d.ts', 'SomeExternalDir'));
            expect(reexportSummaries[3].symbol)
                .toBe(symbolCache.get('/tmp/external.d.ts', 'SomeExternalPipe'));
        });
        it('should automatically add the metadata of referenced symbols that are not in the source files', function () {
            init();
            var externalSerialized = summary_serializer_1.serializeSummaries('someFile.ts', summary_resolver_spec_1.createMockOutputContext(), summaryResolver, symbolResolver, [
                {
                    symbol: symbolCache.get('/tmp/external.ts', 'PROVIDERS'),
                    metadata: [symbolCache.get('/tmp/external_svc.ts', 'SomeService')]
                },
                {
                    symbol: symbolCache.get('/tmp/external_svc.ts', 'SomeService'),
                    metadata: { __symbolic: 'class' }
                },
                // Note: This is an important usecase when using ng1 and ng2 together via
                // goog.module.
                // In these cases, users write the following to get a referrable symbol in metadata
                // collection:
                //   import UsernameService from 'goog:somePackage.UsernameService';
                //   export {UsernameService};
                {
                    symbol: symbolCache.get('/tmp/external.ts', 'ReexportNonExistent'),
                    metadata: symbolCache.get('/tmp/external.ts', 'NonExistent'),
                }
            ], [{
                    summary: {
                        summaryKind: compiler_1.CompileSummaryKind.Injectable,
                        type: {
                            reference: symbolCache.get('/tmp/external_svc.ts', 'SomeService'),
                        }
                    },
                    metadata: null
                }]);
            init({
                '/tmp/external.ngsummary.json': externalSerialized.json,
            }, {
                '/tmp/local.ts': "\n          export var local = 'a';\n        ",
                '/tmp/non_summary.d.ts': { __symbolic: 'module', version: compiler_cli_1.METADATA_VERSION, metadata: { 'external': 'b' } }
            });
            var serialized = summary_serializer_1.serializeSummaries('someFile.ts', summary_resolver_spec_1.createMockOutputContext(), summaryResolver, symbolResolver, [{
                    symbol: symbolCache.get('/tmp/test.ts', 'main'),
                    metadata: {
                        local: symbolCache.get('/tmp/local.ts', 'local'),
                        external: symbolCache.get('/tmp/external.d.ts', 'PROVIDERS'),
                        externalNonSummary: symbolCache.get('/tmp/non_summary.d.ts', 'external'),
                        reexportNonExistent: symbolCache.get('/tmp/external.ts', 'ReexportNonExistent'),
                    }
                }], []);
            var summaries = summary_serializer_1.deserializeSummaries(symbolCache, summaryResolver, 'someFile.d.ts', serialized.json)
                .summaries;
            // Note: local should not show up!
            expect(summaries.length).toBe(4);
            expect(summaries[0].symbol).toBe(symbolCache.get('/tmp/test.d.ts', 'main'));
            expect(summaries[0].metadata).toEqual({
                local: symbolCache.get('/tmp/local.d.ts', 'local'),
                external: symbolCache.get('/tmp/external.d.ts', 'PROVIDERS'),
                externalNonSummary: symbolCache.get('/tmp/non_summary.d.ts', 'external'),
                reexportNonExistent: symbolCache.get('/tmp/external.d.ts', 'ReexportNonExistent'),
            });
            expect(summaries[1].symbol).toBe(symbolCache.get('/tmp/external.d.ts', 'PROVIDERS'));
            expect(summaries[1].metadata).toEqual([symbolCache.get('/tmp/external_svc.d.ts', 'SomeService')]);
            // SomService is a transitive dep, but should have been serialized as well.
            expect(summaries[2].symbol).toBe(symbolCache.get('/tmp/external_svc.d.ts', 'SomeService'));
            expect(summaries[2].type.type.reference)
                .toBe(symbolCache.get('/tmp/external_svc.d.ts', 'SomeService'));
            // there was no summary for non_summary, but it should have
            // been serialized as well.
            expect(summaries[3].symbol).toBe(symbolCache.get('/tmp/non_summary.d.ts', 'external'));
            expect(summaries[3].metadata).toEqual('b');
        });
        it('should resolve reexported values in libraries', function () {
            init();
            var externalSerialized = summary_serializer_1.serializeSummaries('someFile.ts', summary_resolver_spec_1.createMockOutputContext(), summaryResolver, symbolResolver, [
                { symbol: symbolCache.get('/tmp/external.ts', 'value'), metadata: 'someString' },
                {
                    symbol: symbolCache.get('/tmp/external.ts', 'reexportValue'),
                    metadata: symbolCache.get('/tmp/external.ts', 'value')
                },
            ], []);
            init({
                '/tmp/external.ngsummary.json': externalSerialized.json,
            });
            var serialized = summary_serializer_1.serializeSummaries('someFile.ts', summary_resolver_spec_1.createMockOutputContext(), summaryResolver, symbolResolver, [
                {
                    symbol: symbolCache.get('/tmp/test.ts', 'mainValue'),
                    metadata: symbolCache.get('/tmp/external.d.ts', 'reexportValue'),
                },
            ], []);
            var summaries = summary_serializer_1.deserializeSummaries(symbolCache, summaryResolver, 'someFile.d.ts', serialized.json)
                .summaries;
            expect(summaries.length).toBe(2);
            expect(summaries[0].symbol).toBe(symbolCache.get('/tmp/test.d.ts', 'mainValue'));
            expect(summaries[0].metadata).toBe(symbolCache.get('/tmp/external.d.ts', 'value'));
            expect(summaries[1].symbol).toBe(symbolCache.get('/tmp/external.d.ts', 'value'));
            expect(summaries[1].metadata).toBe('someString');
        });
        it('should not create "importAs" names for ctor arguments which are types of reexported classes in libraries', function () {
            init();
            var externalSerialized = summary_serializer_1.serializeSummaries('someFile.ts', summary_resolver_spec_1.createMockOutputContext(), summaryResolver, symbolResolver, [
                {
                    symbol: symbolCache.get('/tmp/external.ts', 'type'),
                    metadata: { __symbolic: 'interface' }
                },
                {
                    symbol: symbolCache.get('/tmp/external.ts', 'value'),
                    metadata: { __symbolic: 'class' }
                },
                {
                    symbol: symbolCache.get('/tmp/external.ts', 'reexportClass'),
                    metadata: {
                        __symbolic: 'class',
                        'members': {
                            '__ctor__': [{
                                    '__symbolic': 'constructor',
                                    'parameters': [
                                        symbolCache.get('/tmp/external.ts', 'type'),
                                        symbolCache.get('/tmp/external.ts', 'value'),
                                    ]
                                }]
                        }
                    }
                },
            ], []);
            expect(externalSerialized.exportAs).toEqual([]);
            init({
                '/tmp/external.ngsummary.json': externalSerialized.json,
            });
            var serialized = summary_serializer_1.serializeSummaries('someFile.ts', summary_resolver_spec_1.createMockOutputContext(), summaryResolver, symbolResolver, [{
                    symbol: symbolCache.get('/tmp/test.ts', 'mainClass'),
                    metadata: symbolCache.get('/tmp/external.d.ts', 'reexportClass'),
                }], []);
            var importAs = summary_serializer_1.deserializeSummaries(symbolCache, summaryResolver, 'someFile.d.ts', serialized.json)
                .importAs;
            expect(importAs).toEqual([
                {
                    symbol: symbolCache.get('/tmp/external.d.ts', 'reexportClass'),
                    importAs: symbolCache.get('/tmp/test.d.ts', 'mainClass'),
                },
                {
                    symbol: symbolCache.get('/tmp/external.d.ts', 'value'),
                    importAs: symbolCache.get('someFile.ngfactory.d.ts', 'value_3'),
                }
            ]);
        });
        it('should use existing reexports for "importAs" for symbols of libraries', function () {
            init();
            var externalSerialized = summary_serializer_1.serializeSummaries('someFile.ts', summary_resolver_spec_1.createMockOutputContext(), summaryResolver, symbolResolver, [
                { symbol: symbolCache.get('/tmp/external.ts', 'value'), metadata: 'aValue' },
                {
                    symbol: symbolCache.get('/tmp/external.ts', 'reexportValue'),
                    metadata: symbolCache.get('/tmp/external.ts', 'value')
                },
            ], []);
            expect(externalSerialized.exportAs).toEqual([]);
            init({
                '/tmp/external.ngsummary.json': externalSerialized.json,
            });
            var serialized = summary_serializer_1.serializeSummaries('someFile.ts', summary_resolver_spec_1.createMockOutputContext(), summaryResolver, symbolResolver, [{
                    symbol: symbolCache.get('/tmp/test.ts', 'mainValue'),
                    metadata: symbolCache.get('/tmp/external.d.ts', 'reexportValue'),
                }], []);
            expect(serialized.exportAs).toEqual([]);
            var importAs = summary_serializer_1.deserializeSummaries(symbolCache, summaryResolver, 'someFile.d.ts', serialized.json)
                .importAs;
            expect(importAs).toEqual([{
                    symbol: symbolCache.get('/tmp/external.d.ts', 'value'),
                    importAs: symbolCache.get('/tmp/test.d.ts', 'mainValue'),
                }]);
        });
        it('should create reexports in the ngfactory for symbols of libraries', function () {
            init();
            var serialized = summary_serializer_1.serializeSummaries('someFile.ts', summary_resolver_spec_1.createMockOutputContext(), summaryResolver, symbolResolver, [{
                    symbol: symbolCache.get('/tmp/test.ts', 'main'),
                    metadata: [
                        symbolCache.get('/tmp/external.d.ts', 'lib'),
                        symbolCache.get('/tmp/external.d.ts', 'lib', ['someMember']),
                    ]
                }], []);
            // Note: no entry for the symbol with members!
            expect(serialized.exportAs).toEqual([
                { symbol: symbolCache.get('/tmp/external.d.ts', 'lib'), exportAs: 'lib_1' }
            ]);
            var deserialized = summary_serializer_1.deserializeSummaries(symbolCache, summaryResolver, 'someFile.d.ts', serialized.json);
            // Note: no entry for the symbol with members!
            expect(deserialized.importAs).toEqual([{
                    symbol: symbolCache.get('/tmp/external.d.ts', 'lib'),
                    importAs: symbolCache.get('someFile.ngfactory.d.ts', 'lib_1')
                }]);
        });
        describe('with resolved symbols', function () {
            it('should be able to serialize a call', function () {
                init();
                var serialized = summary_serializer_1.serializeSummaries('someFile.ts', summary_resolver_spec_1.createMockOutputContext(), summaryResolver, symbolResolver, [{
                        symbol: symbolCache.get('/tmp/test.ts', 'main'),
                        metadata: {
                            __symbolic: 'call',
                            expression: { __symbolic: 'resolved', symbol: symbolCache.get('/tmp/test2.ts', 'ref') }
                        }
                    }], []);
                expect(serialized.json).not.toContain('error');
            });
            it('should be able to serialize a call to a method', function () {
                init();
                var serialized = summary_serializer_1.serializeSummaries('someFile.ts', summary_resolver_spec_1.createMockOutputContext(), summaryResolver, symbolResolver, [{
                        symbol: symbolCache.get('/tmp/test.ts', 'main'),
                        metadata: {
                            __symbolic: 'call',
                            expression: {
                                __symbolic: 'select',
                                expression: { __symbolic: 'resolved', symbol: symbolCache.get('/tmp/test2.ts', 'ref') },
                                name: 'foo'
                            }
                        }
                    }], []);
                expect(serialized.json).not.toContain('error');
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VtbWFyeV9zZXJpYWxpemVyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0L2FvdC9zdW1tYXJ5X3NlcmlhbGl6ZXJfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILDhDQUFrTDtBQUNsTCxzREFBdUQ7QUFDdkQsbUZBQXNHO0FBQ3RHLHVEQUErRDtBQUUvRCw2RUFBMkU7QUFDM0UsaUVBQTRGO0FBRzVGO0lBQ0UsUUFBUSxDQUFDLG9CQUFvQixFQUFFO1FBQzdCLElBQUksZUFBbUMsQ0FBQztRQUN4QyxJQUFJLGNBQW9DLENBQUM7UUFDekMsSUFBSSxXQUE4QixDQUFDO1FBQ25DLElBQUksSUFBZ0MsQ0FBQztRQUVyQyxVQUFVLENBQUMsY0FBUSxXQUFXLEdBQUcsSUFBSSw0QkFBaUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFN0QsY0FDSSxTQUE0QyxFQUFFLFFBQW1DO1lBQWpGLDBCQUFBLEVBQUEsY0FBNEM7WUFBRSx5QkFBQSxFQUFBLGFBQW1DO1lBQ25GLElBQUksR0FBRyxJQUFJLGtEQUEwQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ2pELGVBQWUsR0FBRyxJQUFJLDZCQUFrQixDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztZQUM1RCxjQUFjLEdBQUcsSUFBSSwrQkFBb0IsQ0FDckMsSUFBSSwwREFBNEIsQ0FBQyxRQUFRLENBQUMsRUFBRSxXQUFXLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFDaEYsQ0FBQztRQUVELFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtZQUMxQixFQUFFLENBQUMsNENBQTRDLEVBQUU7Z0JBQy9DLElBQUksRUFBRSxDQUFDO2dCQUNQLE1BQU0sQ0FBQyxzQkFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7Z0JBQ3pE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