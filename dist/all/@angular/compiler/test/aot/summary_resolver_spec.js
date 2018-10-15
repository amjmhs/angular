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
var summary_serializer_1 = require("@angular/compiler/src/aot/summary_serializer");
var constant_pool_1 = require("@angular/compiler/src/constant_pool");
var o = require("@angular/compiler/src/output/output_ast");
var path = require("path");
var static_symbol_resolver_spec_1 = require("./static_symbol_resolver_spec");
var EXT = /(\.d)?\.ts$/;
{
    describe('AotSummaryResolver', function () {
        var summaryResolver;
        var symbolCache;
        var host;
        beforeEach(function () { symbolCache = new compiler_1.StaticSymbolCache(); });
        function init(summaries) {
            if (summaries === void 0) { summaries = {}; }
            host = new MockAotSummaryResolverHost(summaries);
            summaryResolver = new compiler_1.AotSummaryResolver(host, symbolCache);
        }
        function serialize(symbols) {
            // Note: Don't use the top level host / summaryResolver as they might not be created yet
            var mockSummaryResolver = new static_symbol_resolver_spec_1.MockSummaryResolver([]);
            var symbolResolver = new compiler_1.StaticSymbolResolver(new static_symbol_resolver_spec_1.MockStaticSymbolResolverHost({}), symbolCache, mockSummaryResolver);
            return summary_serializer_1.serializeSummaries('someFile.ts', createMockOutputContext(), mockSummaryResolver, symbolResolver, symbols, [])
                .json;
        }
        it('should load serialized summary files', function () {
            var asymbol = symbolCache.get('/a.d.ts', 'a');
            init({ '/a.ngsummary.json': serialize([{ symbol: asymbol, metadata: 1 }]) });
            expect(summaryResolver.resolveSummary(asymbol)).toEqual({ symbol: asymbol, metadata: 1 });
        });
        it('should not load summaries for source files', function () {
            init({});
            spyOn(host, 'loadSummary').and.callThrough();
            expect(summaryResolver.resolveSummary(symbolCache.get('/a.ts', 'a'))).toBeFalsy();
            expect(host.loadSummary).not.toHaveBeenCalled();
        });
        it('should cache summaries', function () {
            var asymbol = symbolCache.get('/a.d.ts', 'a');
            init({ '/a.ngsummary.json': serialize([{ symbol: asymbol, metadata: 1 }]) });
            expect(summaryResolver.resolveSummary(asymbol)).toBe(summaryResolver.resolveSummary(asymbol));
        });
        it('should return all symbols in a summary', function () {
            var asymbol = symbolCache.get('/a.d.ts', 'a');
            init({ '/a.ngsummary.json': serialize([{ symbol: asymbol, metadata: 1 }]) });
            expect(summaryResolver.getSymbolsOf('/a.d.ts')).toEqual([asymbol]);
        });
        it('should fill importAs for deep symbols', function () {
            var libSymbol = symbolCache.get('/lib.d.ts', 'Lib');
            var srcSymbol = symbolCache.get('/src.ts', 'Src');
            init({
                '/src.ngsummary.json': serialize([{ symbol: srcSymbol, metadata: 1 }, { symbol: libSymbol, metadata: 2 }])
            });
            summaryResolver.getSymbolsOf('/src.d.ts');
            expect(summaryResolver.getImportAs(symbolCache.get('/src.d.ts', 'Src'))).toBeFalsy();
            expect(summaryResolver.getImportAs(libSymbol))
                .toBe(symbolCache.get('/src.ngfactory.d.ts', 'Lib_1'));
        });
        describe('isLibraryFile', function () {
            it('should use host.isSourceFile to calculate the result', function () {
                init();
                expect(summaryResolver.isLibraryFile('someFile.ts')).toBe(false);
                expect(summaryResolver.isLibraryFile('someFile.d.ts')).toBe(true);
            });
            it('should calculate the result for generated files based on the result for non generated files', function () {
                init();
                spyOn(host, 'isSourceFile').and.callThrough();
                expect(summaryResolver.isLibraryFile('someFile.ngfactory.ts')).toBe(false);
                expect(host.isSourceFile).toHaveBeenCalledWith('someFile.ts');
            });
        });
        describe('regression', function () {
            // #18170
            it('should support resolving symbol with members ', function () {
                init();
                expect(summaryResolver.resolveSummary(symbolCache.get('/src.d.ts', 'Src', ['One', 'Two'])))
                    .toBeNull();
            });
        });
    });
}
var MockAotSummaryResolverHost = /** @class */ (function () {
    function MockAotSummaryResolverHost(summaries) {
        this.summaries = summaries;
    }
    MockAotSummaryResolverHost.prototype.fileNameToModuleName = function (fileName) {
        return './' + path.basename(fileName).replace(EXT, '');
    };
    MockAotSummaryResolverHost.prototype.toSummaryFileName = function (sourceFileName) {
        return sourceFileName.replace(EXT, '') + '.d.ts';
    };
    MockAotSummaryResolverHost.prototype.fromSummaryFileName = function (filePath) { return filePath; };
    MockAotSummaryResolverHost.prototype.isSourceFile = function (filePath) { return !filePath.endsWith('.d.ts'); };
    MockAotSummaryResolverHost.prototype.loadSummary = function (filePath) { return this.summaries[filePath]; };
    return MockAotSummaryResolverHost;
}());
exports.MockAotSummaryResolverHost = MockAotSummaryResolverHost;
function createMockOutputContext() {
    return {
        statements: [],
        genFilePath: 'someGenFilePath',
        importExpr: function () { return o.NULL_EXPR; },
        constantPool: new constant_pool_1.ConstantPool()
    };
}
exports.createMockOutputContext = createMockOutputContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VtbWFyeV9yZXNvbHZlcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdC9hb3Qvc3VtbWFyeV9yZXNvbHZlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsOENBQWtNO0FBQ2xNLG1GQUFzRztBQUN0RyxxRUFBaUU7QUFDakUsMkRBQTZEO0FBRTdELDJCQUE2QjtBQUU3Qiw2RUFBZ0c7QUFFaEcsSUFBTSxHQUFHLEdBQUcsYUFBYSxDQUFDO0FBRTFCO0lBQ0UsUUFBUSxDQUFDLG9CQUFvQixFQUFFO1FBQzdCLElBQUksZUFBbUMsQ0FBQztRQUN4QyxJQUFJLFdBQThCLENBQUM7UUFDbkMsSUFBSSxJQUFnQyxDQUFDO1FBRXJDLFVBQVUsQ0FBQyxjQUFRLFdBQVcsR0FBRyxJQUFJLDRCQUFpQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU3RCxjQUFjLFNBQTRDO1lBQTVDLDBCQUFBLEVBQUEsY0FBNEM7WUFDeEQsSUFBSSxHQUFHLElBQUksMEJBQTBCLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDakQsZUFBZSxHQUFHLElBQUksNkJBQWtCLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQzlELENBQUM7UUFFRCxtQkFBbUIsT0FBK0I7WUFDaEQsd0ZBQXdGO1lBQ3hGLElBQU0sbUJBQW1CLEdBQUcsSUFBSSxpREFBbUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN4RCxJQUFNLGNBQWMsR0FBRyxJQUFJLCtCQUFvQixDQUMzQyxJQUFJLDBEQUE0QixDQUFDLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1lBQzVFLE9BQU8sdUNBQWtCLENBQ2QsYUFBYSxFQUFFLHVCQUF1QixFQUFFLEVBQUUsbUJBQW1CLEVBQUUsY0FBYyxFQUM3RSxPQUFPLEVBQUUsRUFBRSxDQUFDO2lCQUNsQixJQUFJLENBQUM7UUFDWixDQUFDO1FBRUQsRUFBRSxDQUFDLHNDQUFzQyxFQUFFO1lBQ3pDLElBQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ2hELElBQUksQ0FBQyxFQUFDLG1CQUFtQixFQUFFLFNBQVMsQ0FBQyxDQUFDLEVBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztZQUN6RSxNQUFNLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUM7UUFDMUYsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsNENBQTRDLEVBQUU7WUFDL0MsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ1QsS0FBSyxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7WUFFN0MsTUFBTSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ2xGLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDbEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsd0JBQXdCLEVBQUU7WUFDM0IsSUFBTSxPQUFPLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDaEQsSUFBSSxDQUFDLEVBQUMsbUJBQW1CLEVBQUUsU0FBUyxDQUFDLENBQUMsRUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1lBQ3pFLE1BQU0sQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNoRyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRTtZQUMzQyxJQUFNLE9BQU8sR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNoRCxJQUFJLENBQUMsRUFBQyxtQkFBbUIsRUFBRSxTQUFTLENBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7WUFDekUsTUFBTSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHVDQUF1QyxFQUFFO1lBQzFDLElBQU0sU0FBUyxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3RELElBQU0sU0FBUyxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3BELElBQUksQ0FBQztnQkFDSCxxQkFBcUIsRUFDakIsU0FBUyxDQUFDLENBQUMsRUFBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUMsRUFBRSxFQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUM7YUFDcEYsQ0FBQyxDQUFDO1lBQ0gsZUFBZSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUUxQyxNQUFNLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDckYsTUFBTSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7aUJBQ3pDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLHFCQUFxQixFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDN0QsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsZUFBZSxFQUFFO1lBQ3hCLEVBQUUsQ0FBQyxzREFBc0QsRUFBRTtnQkFDekQsSUFBSSxFQUFFLENBQUM7Z0JBQ1AsTUFBTSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2pFLE1BQU0sQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3BFLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLDZGQUE2RixFQUM3RjtnQkFDRSxJQUFJLEVBQUUsQ0FBQztnQkFDUCxLQUFLLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDOUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDM0UsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNoRSxDQUFDLENBQUMsQ0FBQztRQUNSLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLFlBQVksRUFBRTtZQUNyQixTQUFTO1lBQ1QsRUFBRSxDQUFDLCtDQUErQyxFQUFFO2dCQUNsRCxJQUFJLEVBQUUsQ0FBQztnQkFDUCxNQUFNLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUN0RixRQUFRLEVBQUUsQ0FBQztZQUNsQixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7Q0FDSjtBQUdEO0lBQ0Usb0NBQW9CLFNBQXVDO1FBQXZDLGNBQVMsR0FBVCxTQUFTLENBQThCO0lBQUcsQ0FBQztJQUUvRCx5REFBb0IsR0FBcEIsVUFBcUIsUUFBZ0I7UUFDbkMsT0FBTyxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRCxzREFBaUIsR0FBakIsVUFBa0IsY0FBc0I7UUFDdEMsT0FBTyxjQUFjLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUM7SUFDbkQsQ0FBQztJQUVELHdEQUFtQixHQUFuQixVQUFvQixRQUFnQixJQUFZLE9BQU8sUUFBUSxDQUFDLENBQUMsQ0FBQztJQUVsRSxpREFBWSxHQUFaLFVBQWEsUUFBZ0IsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFdEUsZ0RBQVcsR0FBWCxVQUFZLFFBQWdCLElBQVksT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1RSxpQ0FBQztBQUFELENBQUMsQUFoQkQsSUFnQkM7QUFoQlksZ0VBQTBCO0FBa0J2QztJQUNFLE9BQU87UUFDTCxVQUFVLEVBQUUsRUFBRTtRQUNkLFdBQVcsRUFBRSxpQkFBaUI7UUFDOUIsVUFBVSxFQUFFLGNBQU0sT0FBQSxDQUFDLENBQUMsU0FBUyxFQUFYLENBQVc7UUFDN0IsWUFBWSxFQUFFLElBQUksNEJBQVksRUFBRTtLQUNqQyxDQUFDO0FBQ0osQ0FBQztBQVBELDBEQU9DIn0=