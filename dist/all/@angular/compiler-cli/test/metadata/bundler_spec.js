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
var bundler_1 = require("../../src/metadata/bundler");
var collector_1 = require("../../src/metadata/collector");
var mocks_1 = require("../mocks");
describe('compiler host adapter', function () {
    it('should retrieve metadata for an explicit index relative path reference', function () {
        var context = new mocks_1.MockAotContext('.', exports.SIMPLE_LIBRARY);
        var host = new mocks_1.MockCompilerHost(context);
        var options = {
            moduleResolution: ts.ModuleResolutionKind.NodeJs,
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES5,
        };
        var adapter = new bundler_1.CompilerHostAdapter(host, null, options);
        var metadata = adapter.getMetadataFor('./lib/src/two/index', '.');
        expect(metadata).toBeDefined();
        expect(Object.keys(metadata.metadata).sort()).toEqual([
            'PrivateTwo',
            'TWO_CLASSES',
            'Two',
            'TwoMore',
        ]);
    });
    it('should retrieve metadata for an implied index relative path reference', function () {
        var context = new mocks_1.MockAotContext('.', exports.SIMPLE_LIBRARY_WITH_IMPLIED_INDEX);
        var host = new mocks_1.MockCompilerHost(context);
        var options = {
            moduleResolution: ts.ModuleResolutionKind.NodeJs,
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES5,
        };
        var adapter = new bundler_1.CompilerHostAdapter(host, null, options);
        var metadata = adapter.getMetadataFor('./lib/src/two', '.');
        expect(metadata).toBeDefined();
        expect(Object.keys(metadata.metadata).sort()).toEqual([
            'PrivateTwo',
            'TWO_CLASSES',
            'Two',
            'TwoMore',
        ]);
    });
    it('should fail to retrieve metadata for an implied index with classic module resolution', function () {
        var context = new mocks_1.MockAotContext('.', exports.SIMPLE_LIBRARY_WITH_IMPLIED_INDEX);
        var host = new mocks_1.MockCompilerHost(context);
        var options = {
            moduleResolution: ts.ModuleResolutionKind.Classic,
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES5,
        };
        var adapter = new bundler_1.CompilerHostAdapter(host, null, options);
        var metadata = adapter.getMetadataFor('./lib/src/two', '.');
        expect(metadata).toBeUndefined();
    });
    it('should retrieve exports for an explicit index relative path reference', function () {
        var context = new mocks_1.MockAotContext('.', exports.SIMPLE_LIBRARY);
        var host = new mocks_1.MockCompilerHost(context);
        var options = {
            moduleResolution: ts.ModuleResolutionKind.NodeJs,
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES5,
        };
        var adapter = new bundler_1.CompilerHostAdapter(host, null, options);
        var metadata = adapter.getMetadataFor('./lib/src/index', '.');
        expect(metadata).toBeDefined();
        expect(metadata.exports.map(function (e) { return e.export; })
            .reduce(function (prev, next) { return prev.concat(next); }, [])
            .sort())
            .toEqual([
            'ONE_CLASSES',
            'One',
            'OneMore',
            'TWO_CLASSES',
            'Two',
            'TwoMore',
        ]);
    });
    it('should look for .ts file when resolving metadata via a package.json "main" entry', function () {
        var files = {
            'lib': {
                'one.ts': "\n          class One {}\n          class OneMore extends One {}\n          class PrivateOne {}\n          const ONE_CLASSES = [One, OneMore, PrivateOne];\n          export {One, OneMore, PrivateOne, ONE_CLASSES};\n        ",
                'one.js': "\n          // This will throw an error if the metadata collector tries to load one.js\n        ",
                'package.json': "\n        {\n          \"main\": \"one\"\n        }\n        "
            }
        };
        var context = new mocks_1.MockAotContext('.', files);
        var host = new mocks_1.MockCompilerHost(context);
        var options = {
            moduleResolution: ts.ModuleResolutionKind.NodeJs,
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES5,
        };
        var adapter = new bundler_1.CompilerHostAdapter(host, null, options);
        var metadata = adapter.getMetadataFor('./lib', '.');
        expect(metadata).toBeDefined();
        expect(Object.keys(metadata.metadata).sort()).toEqual([
            'ONE_CLASSES',
            'One',
            'OneMore',
            'PrivateOne',
        ]);
        expect(Array.isArray(metadata.metadata['ONE_CLASSES'])).toBeTruthy();
    });
    it('should look for non-declaration file when resolving metadata via a package.json "types" entry', function () {
        var files = {
            'lib': {
                'one.ts': "\n          class One {}\n          class OneMore extends One {}\n          class PrivateOne {}\n          const ONE_CLASSES = [One, OneMore, PrivateOne];\n          export {One, OneMore, PrivateOne, ONE_CLASSES};\n        ",
                'one.d.ts': "\n          declare class One {\n          }\n          declare class OneMore extends One {\n          }\n          declare class PrivateOne {\n          }\n          declare const ONE_CLASSES: (typeof One)[];\n          export { One, OneMore, PrivateOne, ONE_CLASSES };\n        ",
                'one.js': "\n          // This will throw an error if the metadata collector tries to load one.js\n        ",
                'package.json': "\n        {\n          \"main\": \"one\",\n          \"types\": \"one.d.ts\"\n        }\n        "
            }
        };
        var context = new mocks_1.MockAotContext('.', files);
        var host = new mocks_1.MockCompilerHost(context);
        var options = {
            moduleResolution: ts.ModuleResolutionKind.NodeJs,
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES5,
        };
        var adapter = new bundler_1.CompilerHostAdapter(host, null, options);
        var metadata = adapter.getMetadataFor('./lib', '.');
        expect(metadata).toBeDefined();
        expect(Object.keys(metadata.metadata).sort()).toEqual([
            'ONE_CLASSES',
            'One',
            'OneMore',
            'PrivateOne',
        ]);
        expect(Array.isArray(metadata.metadata['ONE_CLASSES'])).toBeTruthy();
    });
});
describe('metadata bundler', function () {
    it('should be able to bundle a simple library', function () {
        var host = new MockStringBundlerHost('/', exports.SIMPLE_LIBRARY);
        var bundler = new bundler_1.MetadataBundler('/lib/index', undefined, host, 'prfx_');
        var result = bundler.getMetadataBundle();
        expect(Object.keys(result.metadata.metadata).sort()).toEqual([
            'ONE_CLASSES', 'One', 'OneMore', 'TWO_CLASSES', 'Two', 'TwoMore', 'ɵprfx_a', 'ɵprfx_b'
        ]);
        var originalOne = './src/one';
        var originalTwo = './src/two/index';
        expect(Object.keys(result.metadata.origins)
            .sort()
            .map(function (name) { return ({ name: name, value: result.metadata.origins[name] }); }))
            .toEqual([
            { name: 'ONE_CLASSES', value: originalOne }, { name: 'One', value: originalOne },
            { name: 'OneMore', value: originalOne }, { name: 'TWO_CLASSES', value: originalTwo },
            { name: 'Two', value: originalTwo }, { name: 'TwoMore', value: originalTwo },
            { name: 'ɵprfx_a', value: originalOne }, { name: 'ɵprfx_b', value: originalTwo }
        ]);
        expect(result.privates).toEqual([
            { privateName: 'ɵprfx_a', name: 'PrivateOne', module: originalOne },
            { privateName: 'ɵprfx_b', name: 'PrivateTwo', module: originalTwo }
        ]);
    });
    it('should be able to bundle an oddly constructed library', function () {
        var host = new MockStringBundlerHost('/', {
            'lib': {
                'index.ts': "\n          export * from './src/index';\n        ",
                'src': {
                    'index.ts': "\n            export {One, OneMore, ONE_CLASSES} from './one';\n            export {Two, TwoMore, TWO_CLASSES} from './two/index';\n          ",
                    'one.ts': "\n            class One {}\n            class OneMore extends One {}\n            class PrivateOne {}\n            const ONE_CLASSES = [One, OneMore, PrivateOne];\n            export {One, OneMore, PrivateOne, ONE_CLASSES};\n          ",
                    'two': {
                        'index.ts': "\n              class Two {}\n              class TwoMore extends Two {}\n              class PrivateTwo {}\n              const TWO_CLASSES = [Two, TwoMore, PrivateTwo];\n              export {Two, TwoMore, PrivateTwo, TWO_CLASSES};\n            "
                    }
                }
            }
        });
        var bundler = new bundler_1.MetadataBundler('/lib/index', undefined, host);
        var result = bundler.getMetadataBundle();
        expect(Object.keys(result.metadata.metadata).sort()).toEqual([
            'ONE_CLASSES', 'One', 'OneMore', 'TWO_CLASSES', 'Two', 'TwoMore', 'ɵa', 'ɵb'
        ]);
        expect(result.privates).toEqual([
            { privateName: 'ɵa', name: 'PrivateOne', module: './src/one' },
            { privateName: 'ɵb', name: 'PrivateTwo', module: './src/two/index' }
        ]);
    });
    it('should not output windows paths in metadata', function () {
        var host = new MockStringBundlerHost('/', {
            'index.ts': "\n        export * from './exports/test';\n      ",
            'exports': { 'test.ts': "export class TestExport {}" }
        });
        var bundler = new bundler_1.MetadataBundler('/index', undefined, host);
        var result = bundler.getMetadataBundle();
        expect(result.metadata.origins).toEqual({ 'TestExport': './exports/test' });
    });
    it('should convert re-exported to the export', function () {
        var host = new MockStringBundlerHost('/', {
            'index.ts': "\n        export * from './bar';\n        export * from './foo';\n      ",
            'bar.ts': "\n        import {Foo} from './foo';\n        export class Bar extends Foo {\n\n        }\n      ",
            'foo.ts': "\n        export {Foo} from 'foo';\n      "
        });
        var bundler = new bundler_1.MetadataBundler('/index', undefined, host);
        var result = bundler.getMetadataBundle();
        // Expect the extends reference to refer to the imported module
        expect(result.metadata.metadata.Bar.extends.module).toEqual('foo');
        expect(result.privates).toEqual([]);
    });
    it('should treat import then export as a simple export', function () {
        var host = new MockStringBundlerHost('/', {
            'index.ts': "\n        export * from './a';\n        export * from './c';\n      ",
            'a.ts': "\n        import { B } from './b';\n        export { B };\n      ",
            'b.ts': "\n        export class B { }\n      ",
            'c.ts': "\n        import { B } from './b';\n        export class C extends B { }\n      "
        });
        var bundler = new bundler_1.MetadataBundler('/index', undefined, host);
        var result = bundler.getMetadataBundle();
        expect(Object.keys(result.metadata.metadata).sort()).toEqual(['B', 'C']);
        expect(result.privates).toEqual([]);
    });
    it('should be able to bundle a private from a un-exported module', function () {
        var host = new MockStringBundlerHost('/', {
            'index.ts': "\n        export * from './foo';\n      ",
            'foo.ts': "\n        import {Bar} from './bar';\n        export class Foo extends Bar {\n\n        }\n      ",
            'bar.ts': "\n        export class Bar {}\n      "
        });
        var bundler = new bundler_1.MetadataBundler('/index', undefined, host);
        var result = bundler.getMetadataBundle();
        expect(Object.keys(result.metadata.metadata).sort()).toEqual(['Foo', 'ɵa']);
        expect(result.privates).toEqual([{ privateName: 'ɵa', name: 'Bar', module: './bar' }]);
    });
    it('should be able to bundle a library with re-exported symbols', function () {
        var host = new MockStringBundlerHost('/', {
            'public-api.ts': "\n        export * from './src/core';\n        export * from './src/externals';\n      ",
            'src': {
                'core.ts': "\n          export class A {}\n          export class B extends A {}\n        ",
                'externals.ts': "\n          export {E, F, G} from 'external_one';\n          export * from 'external_two';\n        "
            }
        });
        var bundler = new bundler_1.MetadataBundler('/public-api', undefined, host);
        var result = bundler.getMetadataBundle();
        expect(result.metadata.exports).toEqual([
            { from: 'external_two' }, {
                export: [{ name: 'E', as: 'E' }, { name: 'F', as: 'F' }, { name: 'G', as: 'G' }],
                from: 'external_one'
            }
        ]);
        expect(result.metadata.origins['E']).toBeUndefined();
    });
    it('should be able to de-duplicate symbols of re-exported modules', function () {
        var host = new MockStringBundlerHost('/', {
            'public-api.ts': "\n        export {A as A2, A, B as B1, B as B2} from './src/core';\n        export {A as A3} from './src/alternate';\n      ",
            'src': {
                'core.ts': "\n          export class A {}\n          export class B {}\n        ",
                'alternate.ts': "\n          export class A {}\n        ",
            }
        });
        var bundler = new bundler_1.MetadataBundler('/public-api', undefined, host);
        var result = bundler.getMetadataBundle();
        var _a = result.metadata.metadata, A = _a.A, A2 = _a.A2, A3 = _a.A3, B1 = _a.B1, B2 = _a.B2;
        expect(A.__symbolic).toEqual('class');
        expect(A2.__symbolic).toEqual('reference');
        expect(A2.name).toEqual('A');
        expect(A3.__symbolic).toEqual('class');
        expect(B1.__symbolic).toEqual('class');
        expect(B2.__symbolic).toEqual('reference');
        expect(B2.name).toEqual('B1');
    });
});
var MockStringBundlerHost = /** @class */ (function () {
    function MockStringBundlerHost(dirName, directory) {
        this.dirName = dirName;
        this.collector = new collector_1.MetadataCollector();
        var context = new mocks_1.MockAotContext(dirName, directory);
        var host = new mocks_1.MockCompilerHost(context);
        var options = {
            moduleResolution: ts.ModuleResolutionKind.NodeJs,
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES5,
        };
        this.adapter = new bundler_1.CompilerHostAdapter(host, null, options);
    }
    MockStringBundlerHost.prototype.getMetadataFor = function (moduleName) {
        return this.adapter.getMetadataFor(moduleName, this.dirName);
    };
    return MockStringBundlerHost;
}());
exports.MockStringBundlerHost = MockStringBundlerHost;
exports.SIMPLE_LIBRARY = {
    'lib': {
        'index.ts': "\n      export * from './src/index';\n    ",
        'src': {
            'index.ts': "\n        export {One, OneMore, ONE_CLASSES} from './one';\n        export {Two, TwoMore, TWO_CLASSES} from './two/index';\n      ",
            'one.ts': "\n        export class One {}\n        export class OneMore extends One {}\n        export class PrivateOne {}\n        export const ONE_CLASSES = [One, OneMore, PrivateOne];\n      ",
            'two': {
                'index.ts': "\n          export class Two {}\n          export class TwoMore extends Two {}\n          export class PrivateTwo {}\n          export const TWO_CLASSES = [Two, TwoMore, PrivateTwo];\n        "
            }
        }
    }
};
exports.SIMPLE_LIBRARY_WITH_IMPLIED_INDEX = {
    'lib': {
        'index.ts': "\n      export * from './src';\n    ",
        'src': {
            'index.ts': "\n        export {One, OneMore, ONE_CLASSES} from './one';\n        export {Two, TwoMore, TWO_CLASSES} from './two';\n      ",
            'one.ts': "\n        export class One {}\n        export class OneMore extends One {}\n        export class PrivateOne {}\n        export const ONE_CLASSES = [One, OneMore, PrivateOne];\n      ",
            'two': {
                'index.ts': "\n          export class Two {}\n          export class TwoMore extends Two {}\n          export class PrivateTwo {}\n          export const TWO_CLASSES = [Two, TwoMore, PrivateTwo];\n        "
            }
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3Rlc3QvbWV0YWRhdGEvYnVuZGxlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBR0gsK0JBQWlDO0FBRWpDLHNEQUFxRztBQUNyRywwREFBK0Q7QUFFL0Qsa0NBQXFFO0FBRXJFLFFBQVEsQ0FBQyx1QkFBdUIsRUFBRTtJQUVoQyxFQUFFLENBQUMsd0VBQXdFLEVBQUU7UUFDM0UsSUFBTSxPQUFPLEdBQUcsSUFBSSxzQkFBYyxDQUFDLEdBQUcsRUFBRSxzQkFBYyxDQUFDLENBQUM7UUFDeEQsSUFBTSxJQUFJLEdBQUcsSUFBSSx3QkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMzQyxJQUFNLE9BQU8sR0FBdUI7WUFDbEMsZ0JBQWdCLEVBQUUsRUFBRSxDQUFDLG9CQUFvQixDQUFDLE1BQU07WUFDaEQsTUFBTSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUTtZQUM5QixNQUFNLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxHQUFHO1NBQzVCLENBQUM7UUFDRixJQUFNLE9BQU8sR0FBRyxJQUFJLDZCQUFtQixDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDN0QsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUVwRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDL0IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ3RELFlBQVk7WUFDWixhQUFhO1lBQ2IsS0FBSztZQUNMLFNBQVM7U0FDVixDQUFDLENBQUM7SUFDTCxD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