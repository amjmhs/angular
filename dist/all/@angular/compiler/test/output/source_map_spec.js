"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var source_map_1 = require("@angular/compiler/src/output/source_map");
{
    describe('source map generation', function () {
        describe('generation', function () {
            it('should generate a valid source map', function () {
                var map = new source_map_1.SourceMapGenerator('out.js')
                    .addSource('a.js', null)
                    .addLine()
                    .addMapping(0, 'a.js', 0, 0)
                    .addMapping(4, 'a.js', 0, 6)
                    .addMapping(5, 'a.js', 0, 7)
                    .addMapping(8, 'a.js', 0, 22)
                    .addMapping(9, 'a.js', 0, 23)
                    .addMapping(10, 'a.js', 0, 24)
                    .addLine()
                    .addMapping(0, 'a.js', 1, 0)
                    .addMapping(4, 'a.js', 1, 6)
                    .addMapping(5, 'a.js', 1, 7)
                    .addMapping(8, 'a.js', 1, 10)
                    .addMapping(9, 'a.js', 1, 11)
                    .addMapping(10, 'a.js', 1, 12)
                    .addLine()
                    .addMapping(0, 'a.js', 3, 0)
                    .addMapping(2, 'a.js', 3, 2)
                    .addMapping(3, 'a.js', 3, 3)
                    .addMapping(10, 'a.js', 3, 10)
                    .addMapping(11, 'a.js', 3, 11)
                    .addMapping(21, 'a.js', 3, 11)
                    .addMapping(22, 'a.js', 3, 12)
                    .addLine()
                    .addMapping(4, 'a.js', 4, 4)
                    .addMapping(11, 'a.js', 4, 11)
                    .addMapping(12, 'a.js', 4, 12)
                    .addMapping(15, 'a.js', 4, 15)
                    .addMapping(16, 'a.js', 4, 16)
                    .addMapping(21, 'a.js', 4, 21)
                    .addMapping(22, 'a.js', 4, 22)
                    .addMapping(23, 'a.js', 4, 23)
                    .addLine()
                    .addMapping(0, 'a.js', 5, 0)
                    .addMapping(1, 'a.js', 5, 1)
                    .addMapping(2, 'a.js', 5, 2)
                    .addMapping(3, 'a.js', 5, 2);
                // Generated with https://sokra.github.io/source-map-visualization using a TS source map
                expect(map.toJSON().mappings)
                    .toEqual('AAAA,IAAM,CAAC,GAAe,CAAC,CAAC;AACxB,IAAM,CAAC,GAAG,CAAC,CAAC;AAEZ,EAAE,CAAC,OAAO,CAAC,UAAA,CAAC;IACR,OAAO,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC;AACvB,CAAC,CAAC,CAAA');
            });
            it('should include the files and their contents', function () {
                var map = new source_map_1.SourceMapGenerator('out.js')
                    .addSource('inline.ts', 'inline')
                    .addSource('inline.ts', 'inline') // make sur the sources are dedup
                    .addSource('url.ts', null)
                    .addLine()
                    .addMapping(0, 'inline.ts', 0, 0)
                    .toJSON();
                expect(map.file).toEqual('out.js');
                expect(map.sources).toEqual(['inline.ts', 'url.ts']);
                expect(map.sourcesContent).toEqual(['inline', null]);
            });
            it('should not generate source maps when there is no mapping', function () {
                var smg = new source_map_1.SourceMapGenerator('out.js').addSource('inline.ts', 'inline').addLine();
                expect(smg.toJSON()).toEqual(null);
                expect(smg.toJsComment()).toEqual('');
            });
        });
        describe('encodeB64String', function () {
            it('should return the b64 encoded value', function () {
                [['', ''], ['a', 'YQ=='], ['Foo', 'Rm9v'], ['Foo1', 'Rm9vMQ=='], ['Foo12', 'Rm9vMTI='],
                    ['Foo123', 'Rm9vMTIz'],
                ].forEach(function (_a) {
                    var src = _a[0], b64 = _a[1];
                    return expect(source_map_1.toBase64String(src)).toEqual(b64);
                });
            });
        });
        describe('errors', function () {
            it('should throw when mappings are added out of order', function () {
                expect(function () {
                    new source_map_1.SourceMapGenerator('out.js')
                        .addSource('in.js')
                        .addLine()
                        .addMapping(10, 'in.js', 0, 0)
                        .addMapping(0, 'in.js', 0, 0);
                }).toThrowError('Mapping should be added in output order');
            });
            it('should throw when adding segments before any line is created', function () {
                expect(function () {
                    new source_map_1.SourceMapGenerator('out.js').addSource('in.js').addMapping(0, 'in.js', 0, 0);
                }).toThrowError('A line must be added before mappings can be added');
            });
            it('should throw when adding segments referencing unknown sources', function () {
                expect(function () {
                    new source_map_1.SourceMapGenerator('out.js').addSource('in.js').addLine().addMapping(0, 'in_.js', 0, 0);
                }).toThrowError('Unknown source file "in_.js"');
            });
            it('should throw when adding segments without column', function () {
                expect(function () {
                    new source_map_1.SourceMapGenerator('out.js').addSource('in.js').addLine().addMapping(null);
                }).toThrowError('The column in the generated code must be provided');
            });
            it('should throw when adding segments with a source url but no position', function () {
                expect(function () {
                    new source_map_1.SourceMapGenerator('out.js').addSource('in.js').addLine().addMapping(0, 'in.js');
                }).toThrowError('The source location must be provided when a source url is provided');
                expect(function () {
                    new source_map_1.SourceMapGenerator('out.js').addSource('in.js').addLine().addMapping(0, 'in.js', 0);
                }).toThrowError('The source location must be provided when a source url is provided');
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlX21hcF9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdC9vdXRwdXQvc291cmNlX21hcF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0VBQTJGO0FBRTNGO0lBQ0UsUUFBUSxDQUFDLHVCQUF1QixFQUFFO1FBQ2hDLFFBQVEsQ0FBQyxZQUFZLEVBQUU7WUFDckIsRUFBRSxDQUFDLG9DQUFvQyxFQUFFO2dCQUN2QyxJQUFNLEdBQUcsR0FBRyxJQUFJLCtCQUFrQixDQUFDLFFBQVEsQ0FBQztxQkFDM0IsU0FBUyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUM7cUJBQ3ZCLE9BQU8sRUFBRTtxQkFDVCxVQUFVLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3FCQUMzQixVQUFVLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3FCQUMzQixVQUFVLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3FCQUMzQixVQUFVLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO3FCQUM1QixVQUFVLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO3FCQUM1QixVQUFVLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO3FCQUM3QixPQUFPLEVBQUU7cUJBQ1QsVUFBVSxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztxQkFDM0IsVUFBVSxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztxQkFDM0IsVUFBVSxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztxQkFDM0IsVUFBVSxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztxQkFDNUIsVUFBVSxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztxQkFDNUIsVUFBVSxDQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztxQkFDN0IsT0FBTyxFQUFFO3FCQUNULFVBQVUsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7cUJBQzNCLFVBQVUsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7cUJBQzNCLFVBQVUsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7cUJBQzNCLFVBQVUsQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7cUJBQzdCLFVBQVUsQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7cUJBQzdCLFVBQVUsQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7cUJBQzdCLFVBQVUsQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7cUJBQzdCLE9BQU8sRUFBRTtxQkFDVCxVQUFVLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3FCQUMzQixVQUFVLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO3FCQUM3QixVQUFVLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO3FCQUM3QixVQUFVLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO3FCQUM3QixVQUFVLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO3FCQUM3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