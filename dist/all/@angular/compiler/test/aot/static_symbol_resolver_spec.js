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
var collector_1 = require("@angular/compiler-cli/src/metadata/collector");
var ts = require("typescript");
// This matches .ts files but not .d.ts files.
var TS_EXT = /(^.|(?!\.d)..)\.ts$/;
describe('StaticSymbolResolver', function () {
    var noContext = new compiler_1.StaticSymbol('', '', []);
    var host;
    var symbolResolver;
    var symbolCache;
    beforeEach(function () { symbolCache = new compiler_1.StaticSymbolCache(); });
    function init(testData, summaries, summaryImportAs) {
        if (testData === void 0) { testData = DEFAULT_TEST_DATA; }
        if (summaries === void 0) { summaries = []; }
        if (summaryImportAs === void 0) { summaryImportAs = []; }
        host = new MockStaticSymbolResolverHost(testData);
        symbolResolver = new compiler_1.StaticSymbolResolver(host, symbolCache, new MockSummaryResolver(summaries, summaryImportAs));
    }
    beforeEach(function () { return init(); });
    it('should throw an exception for unsupported metadata versions', function () {
        expect(function () { return symbolResolver.resolveSymbol(symbolResolver.getSymbolByModule('src/version-error', 'e')); })
            .toThrow(new Error("Metadata version mismatch for module /tmp/src/version-error.d.ts, found version 100, expected " + compiler_cli_1.METADATA_VERSION));
    });
    it('should throw an exception for version 2 metadata', function () {
        expect(function () { return symbolResolver.resolveSymbol(symbolResolver.getSymbolByModule('src/version-2-error', 'e')); })
            .toThrowError('Unsupported metadata version 2 for module /tmp/src/version-2-error.d.ts. This module should be compiled with a newer version of ngc');
    });
    it('should be produce the same symbol if asked twice', function () {
        var foo1 = symbolResolver.getStaticSymbol('main.ts', 'foo');
        var foo2 = symbolResolver.getStaticSymbol('main.ts', 'foo');
        expect(foo1).toBe(foo2);
    });
    it('should be able to produce a symbol for a module with no file', function () {
        expect(symbolResolver.getStaticSymbol('angularjs', 'SomeAngularSymbol')).toBeDefined();
    });
    it('should be able to split the metadata per symbol', function () {
        init({
            '/tmp/src/test.ts': "\n        export var a = 1;\n        export var b = 2;\n      "
        });
        expect(symbolResolver.resolveSymbol(symbolResolver.getStaticSymbol('/tmp/src/test.ts', 'a'))
            .metadata)
            .toBe(1);
        expect(symbolResolver.resolveSymbol(symbolResolver.getStaticSymbol('/tmp/src/test.ts', 'b'))
            .metadata)
            .toBe(2);
    });
    it('should be able to resolve static symbols with members', function () {
        init({
            '/tmp/src/test.ts': "\n        export {exportedObj} from './export';\n\n        export var obj = {a: 1};\n        export class SomeClass {\n          static someField = 2;\n        }\n      ",
            '/tmp/src/export.ts': "\n        export var exportedObj = {};\n      ",
        });
        expect(symbolResolver
            .resolveSymbol(symbolResolver.getStaticSymbol('/tmp/src/test.ts', 'obj', ['a']))
            .metadata)
            .toBe(1);
        expect(symbolResolver
            .resolveSymbol(symbolResolver.getStaticSymbol('/tmp/src/test.ts', 'SomeClass', ['someField']))
            .metadata)
            .toBe(2);
        expect(symbolResolver
            .resolveSymbol(symbolResolver.getStaticSymbol('/tmp/src/test.ts', 'exportedObj', ['someMember']))
            .metadata)
            .toBe(symbolResolver.getStaticSymbol('/tmp/src/export.ts', 'exportedObj', ['someMember']));
    });
    it('should use summaries in resolveSymbol and prefer them over regular metadata', function () {
        var symbolA = symbolCache.get('/test.ts', 'a');
        var symbolB = symbolCache.get('/test.ts', 'b');
        var symbolC = symbolCache.get('/test.ts', 'c');
        init({ '/test.ts': 'export var a = 2; export var b = 2; export var c = 2;' }, [
            { symbol: symbolA, metadata: 1 },
            { symbol: symbolB, metadata: 1 },
        ]);
        // reading the metadata of a symbol without a summary first,
        // to test whether summaries are still preferred after this.
        expect(symbolResolver.resolveSymbol(symbolC).metadata).toBe(2);
        expect(symbolResolver.resolveSymbol(symbolA).metadata).toBe(1);
        expect(symbolResolver.resolveSymbol(symbolB).metadata).toBe(1);
    });
    it('should be able to get all exported symbols of a file', function () {
        expect(symbolResolver.getSymbolsOf('/tmp/src/reexport/src/origin1.d.ts')).toEqual([
            symbolResolver.getStaticSymbol('/tmp/src/reexport/src/origin1.d.ts', 'One'),
            symbolResolver.getStaticSymbol('/tmp/src/reexport/src/origin1.d.ts', 'Two'),
            symbolResolver.getStaticSymbol('/tmp/src/reexport/src/origin1.d.ts', 'Three'),
            symbolResolver.getStaticSymbol('/tmp/src/reexport/src/origin1.d.ts', 'Six'),
        ]);
    });
    it('should be able to get all reexported symbols of a file', function () {
        expect(symbolResolver.getSymbolsOf('/tmp/src/reexport/reexport.d.ts')).toEqual([
            symbolResolver.getStaticSymbol('/tmp/src/reexport/reexport.d.ts', 'One'),
            symbolResolver.getStaticSymbol('/tmp/src/reexport/reexport.d.ts', 'Two'),
            symbolResolver.getStaticSymbol('/tmp/src/reexport/reexport.d.ts', 'Four'),
            symbolResolver.getStaticSymbol('/tmp/src/reexport/reexport.d.ts', 'Six'),
            symbolResolver.getStaticSymbol('/tmp/src/reexport/reexport.d.ts', 'Five'),
            symbolResolver.getStaticSymbol('/tmp/src/reexport/reexport.d.ts', 'Thirty'),
        ]);
    });
    it('should read the exported symbols of a file from the summary and ignore exports in the source', function () {
        var someSymbol = symbolCache.get('/test.ts', 'a');
        init({ '/test.ts': 'export var b = 2' }, [{ symbol: symbolCache.get('/test.ts', 'a'), metadata: 1 }]);
        expect(symbolResolver.getSymbolsOf('/test.ts')).toEqual([symbolCache.get('/test.ts', 'a')]);
    });
    describe('importAs', function () {
        it('should calculate importAs relationship for non source files without summaries', function () {
            init({
                '/test.d.ts': [{
                        '__symbolic': 'module',
                        'version': compiler_cli_1.METADATA_VERSION,
                        'metadata': {
                            'a': { '__symbolic': 'reference', 'name': 'b', 'module': './test2' },
                        }
                    }],
                '/test2.d.ts': [{
                        '__symbolic': 'module',
                        'version': compiler_cli_1.METADATA_VERSION,
                        'metadata': {
                            'b': { '__symbolic': 'reference', 'name': 'c', 'module': './test3' },
                        }
                    }]
            }, []);
            symbolResolver.getSymbolsOf('/test.d.ts');
            symbolResolver.getSymbolsOf('/test2.d.ts');
            expect(symbolResolver.getImportAs(symbolCache.get('/test2.d.ts', 'b')))
                .toBe(symbolCache.get('/test.d.ts', 'a'));
            expect(symbolResolver.getImportAs(symbolCache.get('/test3.d.ts', 'c')))
                .toBe(symbolCache.get('/test.d.ts', 'a'));
        });
        it('should calculate importAs relationship for non source files with summaries', function () {
            init({
                '/test.ts': "\n          export {a} from './test2';\n        "
            }, [], [{
                    symbol: symbolCache.get('/test2.d.ts', 'a'),
                    importAs: symbolCache.get('/test3.d.ts', 'b')
                }]);
            symbolResolver.getSymbolsOf('/test.ts');
            expect(symbolResolver.getImportAs(symbolCache.get('/test2.d.ts', 'a')))
                .toBe(symbolCache.get('/test3.d.ts', 'b'));
        });
        it('should ignore summaries for inputAs if requested', function () {
            init({
                '/test.ts': "\n        export {a} from './test2';\n      "
            }, [], [{
                    symbol: symbolCache.get('/test2.d.ts', 'a'),
                    importAs: symbolCache.get('/test3.d.ts', 'b')
                }]);
            symbolResolver.getSymbolsOf('/test.ts');
            expect(symbolResolver.getImportAs(symbolCache.get('/test2.d.ts', 'a'), /* useSummaries */ false))
                .toBeUndefined();
        });
        it('should calculate importAs for symbols with members based on importAs for symbols without', function () {
            init({
                '/test.ts': "\n          export {a} from './test2';\n        "
            }, [], [{
                    symbol: symbolCache.get('/test2.d.ts', 'a'),
                    importAs: symbolCache.get('/test3.d.ts', 'b')
                }]);
            symbolResolver.getSymbolsOf('/test.ts');
            expect(symbolResolver.getImportAs(symbolCache.get('/test2.d.ts', 'a', ['someMember'])))
                .toBe(symbolCache.get('/test3.d.ts', 'b', ['someMember']));
        });
    });
    it('should replace references by StaticSymbols', function () {
        init({
            '/test.ts': "\n        import {b, y} from './test2';\n        export var a = b;\n        export var x = [y];\n\n        export function simpleFn(fnArg) {\n          return [a, y, fnArg];\n        }\n      ",
            '/test2.ts': "\n        export var b;\n        export var y;\n      "
        });
        expect(symbolResolver.resolveSymbol(symbolCache.get('/test.ts', 'a')).metadata)
            .toEqual(symbolCache.get('/test2.ts', 'b'));
        expect(symbolResolver.resolveSymbol(symbolCache.get('/test.ts', 'x')).metadata).toEqual([{
                __symbolic: 'resolved',
                symbol: symbolCache.get('/test2.ts', 'y'),
                line: 3,
                character: 24,
                fileName: '/test.ts'
            }]);
        expect(symbolResolver.resolveSymbol(symbolCache.get('/test.ts', 'simpleFn')).metadata).toEqual({
            __symbolic: 'function',
            parameters: ['fnArg'],
            value: [
                symbolCache.get('/test.ts', 'a'), {
                    __symbolic: 'resolved',
                    symbol: symbolCache.get('/test2.ts', 'y'),
                    line: 6,
                    character: 21,
                    fileName: '/test.ts'
                },
                { __symbolic: 'reference', name: 'fnArg' }
            ]
        });
    });
    it('should ignore module references without a name', function () {
        init({
            '/test.ts': "\n        import Default from './test2';\n        export {Default};\n      "
        });
        expect(symbolResolver.resolveSymbol(symbolCache.get('/test.ts', 'Default')).metadata)
            .toBeFalsy();
    });
    it('should fill references to ambient symbols with undefined', function () {
        init({
            '/test.ts': "\n        export var y = 1;\n        export var z = [window, z];\n      "
        });
        expect(symbolResolver.resolveSymbol(symbolCache.get('/test.ts', 'z')).metadata).toEqual([
            undefined, symbolCache.get('/test.ts', 'z')
        ]);
    });
    it('should allow to use symbols with __', function () {
        init({
            '/test.ts': "\n        export {__a__ as __b__} from './test2';\n        import {__c__} from './test2';\n\n        export var __x__ = 1;\n        export var __y__ = __c__;\n      "
        });
        expect(symbolResolver.resolveSymbol(symbolCache.get('/test.ts', '__x__')).metadata).toBe(1);
        expect(symbolResolver.resolveSymbol(symbolCache.get('/test.ts', '__y__')).metadata)
            .toBe(symbolCache.get('/test2.d.ts', '__c__'));
        expect(symbolResolver.resolveSymbol(symbolCache.get('/test.ts', '__b__')).metadata)
            .toBe(symbolCache.get('/test2.d.ts', '__a__'));
        expect(symbolResolver.getSymbolsOf('/test.ts')).toEqual([
            symbolCache.get('/test.ts', '__b__'),
            symbolCache.get('/test.ts', '__x__'),
            symbolCache.get('/test.ts', '__y__'),
        ]);
    });
    it('should only use the arity for classes from libraries without summaries', function () {
        init({
            '/test.d.ts': [{
                    '__symbolic': 'module',
                    'version': compiler_cli_1.METADATA_VERSION,
                    'metadata': {
                        'AParam': { __symbolic: 'class' },
                        'AClass': {
                            __symbolic: 'class',
                            arity: 1,
                            members: {
                                __ctor__: [{
                                        __symbolic: 'constructor',
                                        parameters: [symbolCache.get('/test.d.ts', 'AParam')]
                                    }]
                            }
                        }
                    }
                }]
        });
        expect(symbolResolver.resolveSymbol(symbolCache.get('/test.d.ts', 'AClass')).metadata)
            .toEqual({ __symbolic: 'class', arity: 1 });
    });
    it('should be able to trace a named export', function () {
        var symbol = symbolResolver
            .resolveSymbol(symbolResolver.getSymbolByModule('./reexport/reexport', 'One', '/tmp/src/main.ts'))
            .metadata;
        expect(symbol.name).toEqual('One');
        expect(symbol.filePath).toEqual('/tmp/src/reexport/src/origin1.d.ts');
    });
    it('should be able to trace a renamed export', function () {
        var symbol = symbolResolver
            .resolveSymbol(symbolResolver.getSymbolByModule('./reexport/reexport', 'Four', '/tmp/src/main.ts'))
            .metadata;
        expect(symbol.name).toEqual('Three');
        expect(symbol.filePath).toEqual('/tmp/src/reexport/src/origin1.d.ts');
    });
    it('should be able to trace an export * export', function () {
        var symbol = symbolResolver
            .resolveSymbol(symbolResolver.getSymbolByModule('./reexport/reexport', 'Five', '/tmp/src/main.ts'))
            .metadata;
        expect(symbol.name).toEqual('Five');
        expect(symbol.filePath).toEqual('/tmp/src/reexport/src/origin5.d.ts');
    });
    it('should be able to trace a multi-level re-export', function () {
        var symbol1 = symbolResolver
            .resolveSymbol(symbolResolver.getSymbolByModule('./reexport/reexport', 'Thirty', '/tmp/src/main.ts'))
            .metadata;
        expect(symbol1.name).toEqual('Thirty');
        expect(symbol1.filePath).toEqual('/tmp/src/reexport/src/reexport2.d.ts');
        var symbol2 = symbolResolver.resolveSymbol(symbol1).metadata;
        expect(symbol2.name).toEqual('Thirty');
        expect(symbol2.filePath).toEqual('/tmp/src/reexport/src/origin30.d.ts');
    });
    it('should prefer names in the file over reexports', function () {
        var metadata = symbolResolver
            .resolveSymbol(symbolResolver.getSymbolByModule('./reexport/reexport', 'Six', '/tmp/src/main.ts'))
            .metadata;
        expect(metadata.__symbolic).toBe('class');
    });
    it('should cache tracing a named export', function () {
        var moduleNameToFileNameSpy = spyOn(host, 'moduleNameToFileName').and.callThrough();
        var getMetadataForSpy = spyOn(host, 'getMetadataFor').and.callThrough();
        symbolResolver.resolveSymbol(symbolResolver.getSymbolByModule('./reexport/reexport', 'One', '/tmp/src/main.ts'));
        moduleNameToFileNameSpy.calls.reset();
        getMetadataForSpy.calls.reset();
        var symbol = symbolResolver
            .resolveSymbol(symbolResolver.getSymbolByModule('./reexport/reexport', 'One', '/tmp/src/main.ts'))
            .metadata;
        expect(moduleNameToFileNameSpy.calls.count()).toBe(1);
        expect(getMetadataForSpy.calls.count()).toBe(0);
        expect(symbol.name).toEqual('One');
        expect(symbol.filePath).toEqual('/tmp/src/reexport/src/origin1.d.ts');
    });
});
var MockSummaryResolver = /** @class */ (function () {
    function MockSummaryResolver(summaries, importAs) {
        if (summaries === void 0) { summaries = []; }
        if (importAs === void 0) { importAs = []; }
        this.summaries = summaries;
        this.importAs = importAs;
    }
    MockSummaryResolver.prototype.addSummary = function (summary) { this.summaries.push(summary); };
    MockSummaryResolver.prototype.resolveSummary = function (reference) {
        return this.summaries.find(function (summary) { return summary.symbol === reference; });
    };
    MockSummaryResolver.prototype.getSymbolsOf = function (filePath) {
        var symbols = this.summaries.filter(function (summary) { return summary.symbol.filePath === filePath; })
            .map(function (summary) { return summary.symbol; });
        return symbols.length ? symbols : null;
    };
    MockSummaryResolver.prototype.getImportAs = function (symbol) {
        var entry = this.importAs.find(function (entry) { return entry.symbol === symbol; });
        return entry ? entry.importAs : undefined;
    };
    MockSummaryResolver.prototype.getKnownModuleName = function (fileName) { return null; };
    MockSummaryResolver.prototype.isLibraryFile = function (filePath) { return filePath.endsWith('.d.ts'); };
    MockSummaryResolver.prototype.toSummaryFileName = function (filePath) { return filePath.replace(/(\.d)?\.ts$/, '.d.ts'); };
    MockSummaryResolver.prototype.fromSummaryFileName = function (filePath) { return filePath; };
    return MockSummaryResolver;
}());
exports.MockSummaryResolver = MockSummaryResolver;
var MockStaticSymbolResolverHost = /** @class */ (function () {
    function MockStaticSymbolResolverHost(data, collectorOptions) {
        this.data = data;
        this.collector = new collector_1.MetadataCollector(collectorOptions);
    }
    // In tests, assume that symbols are not re-exported
    MockStaticSymbolResolverHost.prototype.moduleNameToFileName = function (modulePath, containingFile) {
        function splitPath(path) { return path.split(/\/|\\/g); }
        function resolvePath(pathParts) {
            var result = [];
            pathParts.forEach(function (part, index) {
                switch (part) {
                    case '':
                    case '.':
                        if (index > 0)
                            return;
                        break;
                    case '..':
                        if (index > 0 && result.length != 0)
                            result.pop();
                        return;
                }
                result.push(part);
            });
            return result.join('/');
        }
        function pathTo(from, to) {
            var result = to;
            if (to.startsWith('.')) {
                var fromParts = splitPath(from);
                fromParts.pop(); // remove the file name.
                var toParts = splitPath(to);
                result = resolvePath(fromParts.concat(toParts));
            }
            return result;
        }
        if (modulePath.indexOf('.') === 0) {
            var baseName = pathTo(containingFile, modulePath);
            var tsName = baseName + '.ts';
            if (this._getMetadataFor(tsName)) {
                return tsName;
            }
            return baseName + '.d.ts';
        }
        if (modulePath == 'unresolved') {
            return undefined;
        }
        return '/tmp/' + modulePath + '.d.ts';
    };
    MockStaticSymbolResolverHost.prototype.getMetadataFor = function (moduleId) { return this._getMetadataFor(moduleId); };
    MockStaticSymbolResolverHost.prototype.getOutputName = function (filePath) { return filePath; };
    MockStaticSymbolResolverHost.prototype._getMetadataFor = function (filePath) {
        if (this.data[filePath] && filePath.match(TS_EXT)) {
            var text = this.data[filePath];
            if (typeof text === 'string') {
                var sf = ts.createSourceFile(filePath, this.data[filePath], ts.ScriptTarget.ES5, /* setParentNodes */ true);
                var diagnostics = sf.parseDiagnostics;
                if (diagnostics && diagnostics.length) {
                    var errors = diagnostics
                        .map(function (d) {
                        var _a = ts.getLineAndCharacterOfPosition(d.file, d.start), line = _a.line, character = _a.character;
                        return "(" + line + ":" + character + "): " + d.messageText;
                    })
                        .join('\n');
                    throw Error("Error encountered during parse of file " + filePath + "\n" + errors);
                }
                return [this.collector.getMetadata(sf)];
            }
        }
        var result = this.data[filePath];
        if (result) {
            return Array.isArray(result) ? result : [result];
        }
        else {
            return null;
        }
    };
    return MockStaticSymbolResolverHost;
}());
exports.MockStaticSymbolResolverHost = MockStaticSymbolResolverHost;
var DEFAULT_TEST_DATA = {
    '/tmp/src/version-error.d.ts': { '__symbolic': 'module', 'version': 100, metadata: { e: 's' } },
    '/tmp/src/version-2-error.d.ts': { '__symbolic': 'module', 'version': 2, metadata: { e: 's' } },
    '/tmp/src/reexport/reexport.d.ts': {
        __symbolic: 'module',
        version: compiler_cli_1.METADATA_VERSION,
        metadata: {
            Six: { __symbolic: 'class' },
        },
        exports: [
            { from: './src/origin1', export: ['One', 'Two', { name: 'Three', as: 'Four' }, 'Six'] },
            { from: './src/origin5' }, { from: './src/reexport2' }
        ]
    },
    '/tmp/src/reexport/src/origin1.d.ts': {
        __symbolic: 'module',
        version: compiler_cli_1.METADATA_VERSION,
        metadata: {
            One: { __symbolic: 'class' },
            Two: { __symbolic: 'class' },
            Three: { __symbolic: 'class' },
            Six: { __symbolic: 'class' },
        },
    },
    '/tmp/src/reexport/src/origin5.d.ts': {
        __symbolic: 'module',
        version: compiler_cli_1.METADATA_VERSION,
        metadata: {
            Five: { __symbolic: 'class' },
        },
    },
    '/tmp/src/reexport/src/origin30.d.ts': {
        __symbolic: 'module',
        version: compiler_cli_1.METADATA_VERSION,
        metadata: {
            Thirty: { __symbolic: 'class' },
        },
    },
    '/tmp/src/reexport/src/originNone.d.ts': {
        __symbolic: 'module',
        version: compiler_cli_1.METADATA_VERSION,
        metadata: {},
    },
    '/tmp/src/reexport/src/reexport2.d.ts': {
        __symbolic: 'module',
        version: compiler_cli_1.METADATA_VERSION,
        metadata: {},
        exports: [{ from: './originNone' }, { from: './origin30' }]
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljX3N5bWJvbF9yZXNvbHZlcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdC9hb3Qvc3RhdGljX3N5bWJvbF9yZXNvbHZlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsOENBQTRJO0FBQzVJLHNEQUF5RTtBQUN6RSwwRUFBK0U7QUFDL0UsK0JBQWlDO0FBRWpDLDhDQUE4QztBQUM5QyxJQUFNLE1BQU0sR0FBRyxxQkFBcUIsQ0FBQztBQUVyQyxRQUFRLENBQUMsc0JBQXNCLEVBQUU7SUFDL0IsSUFBTSxTQUFTLEdBQUcsSUFBSSx1QkFBWSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDL0MsSUFBSSxJQUE4QixDQUFDO0lBQ25DLElBQUksY0FBb0MsQ0FBQztJQUN6QyxJQUFJLFdBQThCLENBQUM7SUFFbkMsVUFBVSxDQUFDLGNBQVEsV0FBVyxHQUFHLElBQUksNEJBQWlCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTdELGNBQ0ksUUFBa0QsRUFBRSxTQUF1QyxFQUMzRixlQUFzRTtRQUR0RSx5QkFBQSxFQUFBLDRCQUFrRDtRQUFFLDBCQUFBLEVBQUEsY0FBdUM7UUFDM0YsZ0NBQUEsRUFBQSxvQkFBc0U7UUFDeEUsSUFBSSxHQUFHLElBQUksNEJBQTRCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbEQsY0FBYyxHQUFHLElBQUksK0JBQW9CLENBQ3JDLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQztJQUM5RSxDQUFDO0lBRUQsVUFBVSxDQUFDLGNBQU0sT0FBQSxJQUFJLEVBQUUsRUFBTixDQUFNLENBQUMsQ0FBQztJQUV6QixFQUFFLENBQUMsNkRBQTZELEVBQUU7UUFDaEUsTUFBTSxD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