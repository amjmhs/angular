"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var compiler = require("@angular/compiler");
var ts = require("typescript");
var collector_1 = require("../../src/metadata/collector");
var compiler_host_1 = require("../../src/transformers/compiler_host");
var mocks_1 = require("../mocks");
var dummyModule = 'export let foo: any[];';
var aGeneratedFile = new compiler.GeneratedFile('/tmp/src/index.ts', '/tmp/src/index.ngfactory.ts', [new compiler.DeclareVarStmt('x', new compiler.LiteralExpr(1))]);
var aGeneratedFileText = "var x:any = 1;\n";
describe('NgCompilerHost', function () {
    var codeGenerator;
    beforeEach(function () {
        codeGenerator = {
            generateFile: jasmine.createSpy('generateFile').and.returnValue(null),
            findGeneratedFileNames: jasmine.createSpy('findGeneratedFileNames').and.returnValue([]),
        };
    });
    function createNgHost(_a) {
        var _b = (_a === void 0 ? {} : _a).files, files = _b === void 0 ? {} : _b;
        var context = new mocks_1.MockAotContext('/tmp/', files);
        return new mocks_1.MockCompilerHost(context);
    }
    function createHost(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.files, files = _c === void 0 ? {} : _c, _d = _b.options, options = _d === void 0 ? {
            basePath: '/tmp',
            moduleResolution: ts.ModuleResolutionKind.NodeJs,
        } : _d, _e = _b.rootNames, rootNames = _e === void 0 ? ['/tmp/index.ts'] : _e, _f = _b.ngHost, ngHost = _f === void 0 ? createNgHost({ files: files }) : _f, _g = _b.librarySummaries, librarySummaries = _g === void 0 ? [] : _g;
        return new compiler_host_1.TsCompilerAotCompilerTypeCheckHostAdapter(rootNames, options, ngHost, new collector_1.MetadataCollector(), codeGenerator, new Map(librarySummaries.map(function (entry) { return [entry.fileName, entry]; })));
    }
    describe('fileNameToModuleName', function () {
        var host;
        beforeEach(function () { host = createHost(); });
        it('should use a package import when accessing a package from a source file', function () {
            expect(host.fileNameToModuleName('/tmp/node_modules/@angular/core.d.ts', '/tmp/main.ts'))
                .toBe('@angular/core');
        });
        it('should allow an import o a package whose name contains dot (e.g. @angular.io)', function () {
            expect(host.fileNameToModuleName('/tmp/node_modules/@angular.io/core.d.ts', '/tmp/main.ts'))
                .toBe('@angular.io/core');
        });
        it('should use a package import when accessing a package from another package', function () {
            expect(host.fileNameToModuleName('/tmp/node_modules/mod1/index.d.ts', '/tmp/node_modules/mod2/index.d.ts'))
                .toBe('mod1/index');
            expect(host.fileNameToModuleName('/tmp/node_modules/@angular/core/index.d.ts', '/tmp/node_modules/@angular/common/index.d.ts'))
                .toBe('@angular/core/index');
        });
        it('should use a relative import when accessing a file in the same package', function () {
            expect(host.fileNameToModuleName('/tmp/node_modules/mod/a/child.d.ts', '/tmp/node_modules/mod/index.d.ts'))
                .toBe('./a/child');
            expect(host.fileNameToModuleName('/tmp/node_modules/@angular/core/src/core.d.ts', '/tmp/node_modules/@angular/core/index.d.ts'))
                .toBe('./src/core');
        });
        it('should use a relative import when accessing a source file from a source file', function () {
            expect(host.fileNameToModuleName('/tmp/src/a/child.ts', '/tmp/src/index.ts'))
                .toBe('./a/child');
        });
        it('should use a relative import when accessing generated files, even if crossing packages', function () {
            expect(host.fileNameToModuleName('/tmp/node_modules/mod2/b.ngfactory.d.ts', '/tmp/node_modules/mod1/a.ngfactory.d.ts'))
                .toBe('../mod2/b.ngfactory');
        });
        it('should support multiple rootDirs when accessing a source file form a source file', function () {
            var hostWithMultipleRoots = createHost({
                options: {
                    basePath: '/tmp/',
                    rootDirs: [
                        'src/a',
                        'src/b',
                    ]
                }
            });
            // both files are in the rootDirs
            expect(hostWithMultipleRoots.fileNameToModuleName('/tmp/src/b/b.ts', '/tmp/src/a/a.ts'))
                .toBe('./b');
            // one file is not in the rootDirs
            expect(hostWithMultipleRoots.fileNameToModuleName('/tmp/src/c/c.ts', '/tmp/src/a/a.ts'))
                .toBe('../c/c');
        });
        it('should error if accessing a source file from a package', function () {
            expect(function () { return host.fileNameToModuleName('/tmp/src/a/child.ts', '/tmp/node_modules/@angular/core.d.ts'); })
                .toThrowError('Trying to import a source file from a node_modules package: ' +
                'import /tmp/src/a/child.ts from /tmp/node_modules/@angular/core.d.ts');
        });
        it('should use the provided implementation if any', function () {
            var ngHost = createNgHost();
            ngHost.fileNameToModuleName = function () { return 'someResult'; };
            var host = createHost({ ngHost: ngHost });
            expect(host.fileNameToModuleName('a', 'b')).toBe('someResult');
        });
    });
    describe('moduleNameToFileName', function () {
        it('should resolve an import using the containing file', function () {
            var host = createHost({ files: { 'tmp': { 'src': { 'a': { 'child.d.ts': dummyModule } } } } });
            expect(host.moduleNameToFileName('./a/child', '/tmp/src/index.ts'))
                .toBe('/tmp/src/a/child.d.ts');
        });
        it('should allow to skip the containing file for package imports', function () {
            var host = createHost({ files: { 'tmp': { 'node_modules': { '@core': { 'index.d.ts': dummyModule } } } } });
            expect(host.moduleNameToFileName('@core/index')).toBe('/tmp/node_modules/@core/index.d.ts');
        });
        it('should use the provided implementation if any', function () {
            var ngHost = createNgHost();
            ngHost.moduleNameToFileName = function () { return 'someResult'; };
            var host = createHost({ ngHost: ngHost });
            expect(host.moduleNameToFileName('a', 'b')).toBe('someResult');
        });
        it('should work well with windows paths', function () {
            var host = createHost({
                rootNames: ['\\tmp\\index.ts'],
                options: { basePath: '\\tmp' },
                files: { 'tmp': { 'node_modules': { '@core': { 'index.d.ts': dummyModule } } } }
            });
            expect(host.moduleNameToFileName('@core/index')).toBe('/tmp/node_modules/@core/index.d.ts');
        });
    });
    describe('resourceNameToFileName', function () {
        it('should resolve a relative import', function () {
            var host = createHost({ files: { 'tmp': { 'src': { 'a': { 'child.html': '<div>' } } } } });
            expect(host.resourceNameToFileName('./a/child.html', '/tmp/src/index.ts'))
                .toBe('/tmp/src/a/child.html');
            expect(host.resourceNameToFileName('./a/non-existing.html', '/tmp/src/index.ts')).toBe(null);
        });
        it('should resolve package paths as relative paths', function () {
            var host = createHost({ files: { 'tmp': { 'src': { 'a': { 'child.html': '<div>' } } } } });
            expect(host.resourceNameToFileName('a/child.html', '/tmp/src/index.ts'))
                .toBe('/tmp/src/a/child.html');
        });
        it('should resolve absolute paths as package paths', function () {
            var host = createHost({ files: { 'tmp': { 'node_modules': { 'a': { 'child.html': '<div>' } } } } });
            expect(host.resourceNameToFileName('/a/child.html', ''))
                .toBe('/tmp/node_modules/a/child.html');
        });
        it('should use the provided implementation if any', function () {
            var ngHost = createNgHost();
            ngHost.resourceNameToFileName = function () { return 'someResult'; };
            var host = createHost({ ngHost: ngHost });
            expect(host.resourceNameToFileName('a', 'b')).toBe('someResult');
        });
    });
    describe('getSourceFile', function () {
        it('should cache source files by name', function () {
            var host = createHost({ files: { 'tmp': { 'src': { 'index.ts': "" } } } });
            var sf1 = host.getSourceFile('/tmp/src/index.ts', ts.ScriptTarget.Latest);
            var sf2 = host.getSourceFile('/tmp/src/index.ts', ts.ScriptTarget.Latest);
            expect(sf1).toBe(sf2);
        });
        it('should generate code when asking for the base name and add it as referencedFiles', function () {
            codeGenerator.findGeneratedFileNames.and.returnValue(['/tmp/src/index.ngfactory.ts']);
            codeGenerator.generateFile.and.returnValue(aGeneratedFile);
            var host = createHost({
                files: {
                    'tmp': {
                        'src': {
                            'index.ts': "\n              /// <reference path=\"main.ts\"/>\n            "
                        }
                    }
                }
            });
            var sf = host.getSourceFile('/tmp/src/index.ts', ts.ScriptTarget.Latest);
            expect(sf.referencedFiles[0].fileName).toBe('main.ts');
            expect(sf.referencedFiles[1].fileName).toBe('/tmp/src/index.ngfactory.ts');
            var genSf = host.getSourceFile('/tmp/src/index.ngfactory.ts', ts.ScriptTarget.Latest);
            expect(genSf.text).toBe(aGeneratedFileText);
            // the codegen should have been cached
            expect(codeGenerator.generateFile).toHaveBeenCalledTimes(1);
            expect(codeGenerator.findGeneratedFileNames).toHaveBeenCalledTimes(1);
        });
        it('should generate code when asking for the generated name first', function () {
            codeGenerator.findGeneratedFileNames.and.returnValue(['/tmp/src/index.ngfactory.ts']);
            codeGenerator.generateFile.and.returnValue(aGeneratedFile);
            var host = createHost({
                files: {
                    'tmp': {
                        'src': {
                            'index.ts': "\n              /// <reference path=\"main.ts\"/>\n            "
                        }
                    }
                }
            });
            var genSf = host.getSourceFile('/tmp/src/index.ngfactory.ts', ts.ScriptTarget.Latest);
            expect(genSf.text).toBe(aGeneratedFileText);
            var sf = host.getSourceFile('/tmp/src/index.ts', ts.ScriptTarget.Latest);
            expect(sf.referencedFiles[0].fileName).toBe('main.ts');
            expect(sf.referencedFiles[1].fileName).toBe('/tmp/src/index.ngfactory.ts');
            // the codegen should have been cached
            expect(codeGenerator.generateFile).toHaveBeenCalledTimes(1);
            expect(codeGenerator.findGeneratedFileNames).toHaveBeenCalledTimes(1);
        });
        it('should clear old generated references if the original host cached them', function () {
            codeGenerator.findGeneratedFileNames.and.returnValue(['/tmp/src/index.ngfactory.ts']);
            var sfText = "\n          /// <reference path=\"main.ts\"/>\n      ";
            var ngHost = createNgHost({ files: { 'tmp': { 'src': { 'index.ts': sfText } } } });
            var sf = ts.createSourceFile('/tmp/src/index.ts', sfText, ts.ScriptTarget.Latest);
            ngHost.getSourceFile = function () { return sf; };
            codeGenerator.findGeneratedFileNames.and.returnValue(['/tmp/src/index.ngfactory.ts']);
            codeGenerator.generateFile.and.returnValue(new compiler.GeneratedFile('/tmp/src/index.ts', '/tmp/src/index.ngfactory.ts', []));
            var host1 = createHost({ ngHost: ngHost });
            host1.getSourceFile('/tmp/src/index.ts', ts.ScriptTarget.Latest);
            expect(sf.referencedFiles.length).toBe(2);
            expect(sf.referencedFiles[0].fileName).toBe('main.ts');
            expect(sf.referencedFiles[1].fileName).toBe('/tmp/src/index.ngfactory.ts');
            codeGenerator.findGeneratedFileNames.and.returnValue([]);
            codeGenerator.generateFile.and.returnValue(null);
            var host2 = createHost({ ngHost: ngHost });
            host2.getSourceFile('/tmp/src/index.ts', ts.ScriptTarget.Latest);
            expect(sf.referencedFiles.length).toBe(1);
            expect(sf.referencedFiles[0].fileName).toBe('main.ts');
        });
        it('should generate for tsx files', function () {
            codeGenerator.findGeneratedFileNames.and.returnValue(['/tmp/src/index.ngfactory.ts']);
            codeGenerator.generateFile.and.returnValue(aGeneratedFile);
            var host = createHost({ files: { 'tmp': { 'src': { 'index.tsx': "" } } } });
            var genSf = host.getSourceFile('/tmp/src/index.ngfactory.ts', ts.ScriptTarget.Latest);
            expect(genSf.text).toBe(aGeneratedFileText);
            var sf = host.getSourceFile('/tmp/src/index.tsx', ts.ScriptTarget.Latest);
            expect(sf.referencedFiles[0].fileName).toBe('/tmp/src/index.ngfactory.ts');
            // the codegen should have been cached
            expect(codeGenerator.generateFile).toHaveBeenCalledTimes(1);
            expect(codeGenerator.findGeneratedFileNames).toHaveBeenCalledTimes(1);
        });
    });
    describe('updateSourceFile', function () {
        it('should update source files', function () {
            codeGenerator.findGeneratedFileNames.and.returnValue(['/tmp/src/index.ngfactory.ts']);
            codeGenerator.generateFile.and.returnValue(aGeneratedFile);
            var host = createHost({ files: { 'tmp': { 'src': { 'index.ts': '' } } } });
            var genSf = host.getSourceFile('/tmp/src/index.ngfactory.ts', ts.ScriptTarget.Latest);
            expect(genSf.text).toBe(aGeneratedFileText);
            host.updateGeneratedFile(new compiler.GeneratedFile('/tmp/src/index.ts', '/tmp/src/index.ngfactory.ts', [new compiler.DeclareVarStmt('x', new compiler.LiteralExpr(2))]));
            genSf = host.getSourceFile('/tmp/src/index.ngfactory.ts', ts.ScriptTarget.Latest);
            expect(genSf.text).toBe("var x:any = 2;\n");
        });
        it('should error if the imports changed', function () {
            codeGenerator.findGeneratedFileNames.and.returnValue(['/tmp/src/index.ngfactory.ts']);
            codeGenerator.generateFile.and.returnValue(new compiler.GeneratedFile('/tmp/src/index.ts', '/tmp/src/index.ngfactory.ts', [new compiler.DeclareVarStmt('x', new compiler.ExternalExpr(new compiler.ExternalReference('aModule', 'aName')))]));
            var host = createHost({ files: { 'tmp': { 'src': { 'index.ts': '' } } } });
            host.getSourceFile('/tmp/src/index.ngfactory.ts', ts.ScriptTarget.Latest);
            expect(function () { return host.updateGeneratedFile(new compiler.GeneratedFile('/tmp/src/index.ts', '/tmp/src/index.ngfactory.ts', [new compiler.DeclareVarStmt('x', new compiler.ExternalExpr(new compiler.ExternalReference('otherModule', 'aName')))])); })
                .toThrowError([
                "Illegal State: external references changed in /tmp/src/index.ngfactory.ts.",
                "Old: aModule.", "New: otherModule"
            ].join('\n'));
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXJfaG9zdF9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3Rlc3QvdHJhbnNmb3JtZXJzL2NvbXBpbGVyX2hvc3Rfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILDRDQUE4QztBQUM5QywrQkFBaUM7QUFFakMsMERBQStEO0FBRS9ELHNFQUFtSDtBQUNuSCxrQ0FBNEU7QUFFNUUsSUFBTSxXQUFXLEdBQUcsd0JBQXdCLENBQUM7QUFDN0MsSUFBTSxjQUFjLEdBQUcsSUFBSSxRQUFRLENBQUMsYUFBYSxDQUM3QyxtQkFBbUIsRUFBRSw2QkFBNkIsRUFDbEQsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLElBQUksUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyRSxJQUFNLGtCQUFrQixHQUFHLGtCQUFrQixDQUFDO0FBRTlDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtJQUN6QixJQUFJLGFBQWdGLENBQUM7SUFFckYsVUFBVSxDQUFDO1FBQ1QsYUFBYSxHQUFHO1lBQ2QsWUFBWSxFQUFFLE9BQU8sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7WUFDckUsc0JBQXNCLEVBQUUsT0FBTyxDQUFDLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDO1NBQ3hGLENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztJQUVILHNCQUFzQixFQUFzQztZQUFyQyxvQ0FBVSxFQUFWLCtCQUFVO1FBQy9CLElBQU0sT0FBTyxHQUFHLElBQUksc0JBQWMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbkQsT0FBTyxJQUFJLHdCQUFnQixDQUFD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