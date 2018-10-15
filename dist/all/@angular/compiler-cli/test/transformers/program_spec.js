"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ng = require("@angular/compiler-cli");
var fs = require("fs");
var path = require("path");
var ts = require("typescript");
var perform_compile_1 = require("../../src/perform_compile");
var api_1 = require("../../src/transformers/api");
var program_1 = require("../../src/transformers/program");
var util_1 = require("../../src/transformers/util");
var test_support_1 = require("../test_support");
describe('ng program', function () {
    var testSupport;
    var errorSpy;
    beforeEach(function () {
        errorSpy = jasmine.createSpy('consoleError').and.callFake(console.error);
        testSupport = test_support_1.setup();
    });
    function createModuleAndCompSource(prefix, template) {
        if (template === void 0) { template = prefix + 'template'; }
        var templateEntry = template.endsWith('.html') ? "templateUrl: '" + template + "'" : "template: `" + template + "`";
        return "\n      import {Component, NgModule} from '@angular/core';\n\n      @Component({selector: '" + prefix + "', " + templateEntry + "})\n      export class " + prefix + "Comp {}\n\n      @NgModule({declarations: [" + prefix + "Comp]})\n      export class " + prefix + "Module {}\n    ";
    }
    function compileLib(libName) {
        var _a;
        testSupport.writeFiles((_a = {},
            _a[libName + "_src/index.ts"] = createModuleAndCompSource(libName),
            _a));
        var options = testSupport.createCompilerOptions();
        var program = ng.createProgram({
            rootNames: [path.resolve(testSupport.basePath, libName + "_src/index.ts")],
            options: options,
            host: ng.createCompilerHost({ options: options }),
        });
        test_support_1.expectNoDiagnosticsInProgram(options, program);
        fs.symlinkSync(path.resolve(testSupport.basePath, 'built', libName + "_src"), path.resolve(testSupport.basePath, 'node_modules', libName));
        program.emit({ emitFlags: ng.EmitFlags.DTS | ng.EmitFlags.JS | ng.EmitFlags.Metadata });
    }
    function compile(oldProgram, overrideOptions, rootNames, host) {
        var options = testSupport.createCompilerOptions(overrideOptions);
        if (!rootNames) {
            rootNames = [path.resolve(testSupport.basePath, 'src/index.ts')];
        }
        if (!host) {
            host = ng.createCompilerHost({ options: options });
        }
        var program = ng.createProgram({
            rootNames: rootNames,
            options: options,
            host: host,
            oldProgram: oldProgram,
        });
        test_support_1.expectNoDiagnosticsInProgram(options, program);
        var emitResult = program.emit();
        return { emitResult: emitResult, program: program };
    }
    function resolveFiles(rootNames) {
        var preOptions = testSupport.createCompilerOptions();
        var preHost = ts.createCompilerHost(preOptions);
        // don't resolve symlinks
        preHost.realpath = function (f) { return f; };
        var preProgram = ts.createProgram(rootNames, preOptions, preHost);
        return preProgram.getSourceFiles().map(function (sf) { return sf.fileName; });
    }
    describe('reuse of old program', function () {
        it('should reuse generated code for libraries from old programs', function () {
            compileLib('lib');
            testSupport.writeFiles({
                'src/main.ts': createModuleAndCompSource('main'),
                'src/index.ts': "\n            export * from './main';\n            export * from 'lib/index';\n          "
            });
            var p1 = compile().program;
            expect(p1.getTsProgram().getSourceFiles().some(function (sf) { return /node_modules\/lib\/.*\.ngfactory\.ts$/.test(sf.fileName); }))
                .toBe(true);
            expect(p1.getTsProgram().getSourceFiles().some(function (sf) { return /node_modules\/lib2\/.*\.ngfactory.*$/.test(sf.fileName); }))
                .toBe(false);
            var p2 = compile(p1).program;
            expect(p2.getTsProgram().getSourceFiles().some(function (sf) { return /node_modules\/lib\/.*\.ngfactory.*$/.test(sf.fileName); }))
                .toBe(false);
            expect(p2.getTsProgram().getSourceFiles().some(function (sf) { return /node_modules\/lib2\/.*\.ngfactory.*$/.test(sf.fileName); }))
                .toBe(false);
            // import a library for which we didn't generate code before
            compileLib('lib2');
            testSupport.writeFiles({
                'src/index.ts': "\n          export * from './main';\n          export * from 'lib/index';\n          export * from 'lib2/index';\n        ",
            });
            var p3 = compile(p2).program;
            expect(p3.getTsProgram().getSourceFiles().some(function (sf) { return /node_modules\/lib\/.*\.ngfactory.*$/.test(sf.fileName); }))
                .toBe(false);
            expect(p3.getTsProgram().getSourceFiles().some(function (sf) { return /node_modules\/lib2\/.*\.ngfactory\.ts$/.test(sf.fileName); }))
                .toBe(true);
            var p4 = compile(p3).program;
            expect(p4.getTsProgram().getSourceFiles().some(function (sf) { return /node_modules\/lib\/.*\.ngfactory.*$/.test(sf.fileName); }))
                .toBe(false);
            expect(p4.getTsProgram().getSourceFiles().some(function (sf) { return /node_modules\/lib2\/.*\.ngfactory.*$/.test(sf.fileName); }))
                .toBe(false);
        });
        // Note: this is the case for watch mode with declaration:false
        it('should reuse generated code from libraries from old programs with declaration:false', function () {
            compileLib('lib');
            testSupport.writeFiles({
                'src/main.ts': createModuleAndCompSource('main'),
                'src/index.ts': "\n            export * from './main';\n            export * from 'lib/index';\n          "
            });
            var p1 = compile(undefined, { declaration: false }).program;
            expect(p1.getTsProgram().getSourceFiles().some(function (sf) { return /node_modules\/lib\/.*\.ngfactory\.ts$/.test(sf.fileName); }))
                .toBe(true);
            expect(p1.getTsProgram().getSourceFiles().some(function (sf) { return /node_modules\/lib2\/.*\.ngfactory.*$/.test(sf.fileName); }))
                .toBe(false);
            var p2 = compile(p1, { declaration: false }).program;
            expect(p2.getTsProgram().getSourceFiles().some(function (sf) { return /node_modules\/lib\/.*\.ngfactory.*$/.test(sf.fileName); }))
                .toBe(false);
            expect(p2.getTsProgram().getSourceFiles().some(function (sf) { return /node_modules\/lib2\/.*\.ngfactory.*$/.test(sf.fileName); }))
                .toBe(false);
        });
        it('should only emit changed files', function () {
            testSupport.writeFiles({
                'src/index.ts': createModuleAndCompSource('comp', 'index.html'),
                'src/index.html': "Start"
            });
            var options = { declaration: false };
            var host = ng.createCompilerHost({ options: options });
            var originalGetSourceFile = host.getSourceFile;
            var fileCache = new Map();
            host.getSourceFile = function (fileName) {
                if (fileCache.has(fileName)) {
                    return fileCache.get(fileName);
                }
                var sf = originalGetSourceFile.call(host, fileName);
                fileCache.set(fileName, sf);
                return sf;
            };
            var written = new Map();
            host.writeFile = function (fileName, data) { return written.set(fileName, data); };
            // compile libraries
            var p1 = compile(undefined, options, undefined, host).program;
            // compile without libraries
            var p2 = compile(p1, options, undefined, host).program;
            expect(written.has(path.resolve(testSupport.basePath, 'built/src/index.js'))).toBe(true);
            var ngFactoryContent = written.get(path.resolve(testSupport.basePath, 'built/src/index.ngfactory.js'));
            expect(ngFactoryContent).toMatch(/Start/);
            // no change -> no emit
            written.clear();
            var p3 = compile(p2, options, undefined, host).program;
            expect(written.size).toBe(0);
            // change a user file
            written.clear();
            fileCache.delete(path.resolve(testSupport.basePath, 'src/index.ts'));
            var p4 = compile(p3, options, undefined, host).program;
            expect(written.size).toBe(1);
            expect(written.has(path.resolve(testSupport.basePath, 'built/src/index.js'))).toBe(true);
            // change a file that is input to generated files
            written.clear();
            testSupport.writeFiles({ 'src/index.html': 'Hello' });
            var p5 = compile(p4, options, undefined, host).program;
            expect(written.size).toBe(1);
            ngFactoryContent =
                written.get(path.resolve(testSupport.basePath, 'built/src/index.ngfactory.js'));
            expect(ngFactoryContent).toMatch(/Hello/);
            // change a file and create an intermediate program that is not emitted
            written.clear();
            fileCache.delete(path.resolve(testSupport.basePath, 'src/index.ts'));
            var p6 = ng.createProgram({
                rootNames: [path.resolve(testSupport.basePath, 'src/index.ts')],
                options: testSupport.createCompilerOptions(options), host: host,
                oldProgram: p5
            });
            var p7 = compile(p6, options, undefined, host).program;
            expect(written.size).toBe(1);
        });
        it('should set emitSkipped to false for full and incremental emit', function () {
            testSupport.writeFiles({
                'src/index.ts': createModuleAndCompSource('main'),
            });
            var _a = compile(), emitResult1 = _a.emitResult, p1 = _a.program;
            expect(emitResult1.emitSkipped).toBe(false);
            var _b = compile(p1), emitResult2 = _b.emitResult, p2 = _b.program;
            expect(emitResult2.emitSkipped).toBe(false);
            var _c = compile(p2), emitResult3 = _c.emitResult, p3 = _c.program;
            expect(emitResult3.emitSkipped).toBe(false);
        });
        it('should store library summaries on emit', function () {
            compileLib('lib');
            testSupport.writeFiles({
                'src/main.ts': createModuleAndCompSource('main'),
                'src/index.ts': "\n            export * from './main';\n            export * from 'lib/index';\n          "
            });
            var p1 = compile().program;
            expect(Array.from(p1.getLibrarySummaries().values())
                .some(function (sf) { return /node_modules\/lib\/index\.ngfactory\.d\.ts$/.test(sf.fileName); }))
                .toBe(true);
            expect(Array.from(p1.getLibrarySummaries().values())
                .some(function (sf) { return /node_modules\/lib\/index\.ngsummary\.json$/.test(sf.fileName); }))
                .toBe(true);
            expect(Array.from(p1.getLibrarySummaries().values())
                .some(function (sf) { return /node_modules\/lib\/index\.d\.ts$/.test(sf.fileName); }))
                .toBe(true);
            expect(Array.from(p1.getLibrarySummaries().values())
                .some(function (sf) { return /src\/main.*$/.test(sf.fileName); }))
                .toBe(false);
        });
        if (!test_support_1.isInBazel()) {
            it('should reuse the old ts program completely if nothing changed', function () {
                testSupport.writeFiles({ 'src/index.ts': createModuleAndCompSource('main') });
                // Note: the second compile drops factories for library files,
                // and therefore changes the structure again
                var p1 = compile().program;
                var p2 = compile(p1).program;
                compile(p2);
                expect(util_1.tsStructureIsReused(p2.getTsProgram())).toBe(2 /* Completely */);
            });
            it('should reuse the old ts program completely if a template or a ts file changed', function () {
                testSupport.writeFiles({
                    'src/main.ts': createModuleAndCompSource('main', 'main.html'),
                    'src/main.html': "Some template",
                    'src/util.ts': "export const x = 1",
                    'src/index.ts': "\n            export * from './main';\n            export * from './util';\n          "
                });
                // Note: the second compile drops factories for library files,
                // and therefore changes the structure again
                var p1 = compile().program;
                var p2 = compile(p1).program;
                testSupport.writeFiles({
                    'src/main.html': "Another template",
                    'src/util.ts': "export const x = 2",
                });
                compile(p2);
                expect(util_1.tsStructureIsReused(p2.getTsProgram())).toBe(2 /* Completely */);
            });
            it('should not reuse the old ts program if an import changed', function () {
                testSupport.writeFiles({
                    'src/main.ts': createModuleAndCompSource('main'),
                    'src/util.ts': "export const x = 1",
                    'src/index.ts': "\n            export * from './main';\n            export * from './util';\n          "
                });
                // Note: the second compile drops factories for library files,
                // and therefore changes the structure again
                var p1 = compile().program;
                var p2 = compile(p1).program;
                testSupport.writeFiles({ 'src/util.ts': "import {Injectable} from '@angular/core'; export const x = 1;" });
                compile(p2);
                expect(util_1.tsStructureIsReused(p2.getTsProgram())).toBe(1 /* SafeModules */);
            });
        }
    });
    it('should not typecheck templates if skipTemplateCodegen is set but fullTemplateTypeCheck is not', function () {
        testSupport.writeFiles({
            'src/main.ts': "\n        import {NgModule} from '@angular/core';\n\n        @NgModule((() => {if (1==1) return null as any;}) as any)\n        export class SomeClassWithInvalidMetadata {}\n      ",
        });
        var options = testSupport.createCompilerOptions({ skipTemplateCodegen: true });
        var host = ng.createCompilerHost({ options: options });
        var program = ng.createProgram({ rootNames: [path.resolve(testSupport.basePath, 'src/main.ts')], options: options, host: host });
        test_support_1.expectNoDiagnosticsInProgram(options, program);
        var emitResult = program.emit({ emitFlags: api_1.EmitFlags.All });
        expect(emitResult.diagnostics.length).toBe(0);
        testSupport.shouldExist('built/src/main.metadata.json');
    });
    it('should typecheck templates if skipTemplateCodegen and fullTemplateTypeCheck is set', function () {
        testSupport.writeFiles({
            'src/main.ts': createModuleAndCompSource('main', "{{nonExistent}}"),
        });
        var options = testSupport.createCompilerOptions({
            skipTemplateCodegen: true,
            fullTemplateTypeCheck: true,
        });
        var host = ng.createCompilerHost({ options: options });
        var program = ng.createProgram({ rootNames: [path.resolve(testSupport.basePath, 'src/main.ts')], options: options, host: host });
        var diags = program.getNgSemanticDiagnostics();
        expect(diags.length).toBe(1);
        expect(diags[0].messageText).toBe("Property 'nonExistent' does not exist on type 'mainComp'.");
    });
    it('should be able to use asynchronously loaded resources', function (done) {
        testSupport.writeFiles({
            'src/main.ts': createModuleAndCompSource('main', 'main.html'),
            // Note: we need to be able to resolve the template synchronously,
            // only the content is delivered asynchronously.
            'src/main.html': '',
        });
        var options = testSupport.createCompilerOptions();
        var host = ng.createCompilerHost({ options: options });
        host.readResource = function () { return Promise.resolve('Hello world!'); };
        var program = ng.createProgram({ rootNames: [path.resolve(testSupport.basePath, 'src/main.ts')], options: options, host: host });
        program.loadNgStructureAsync().then(function () {
            program.emit();
            var ngFactoryPath = path.resolve(testSupport.basePath, 'built/src/main.ngfactory.js');
            var factory = fs.readFileSync(ngFactoryPath, 'utf8');
            expect(factory).toContain('Hello world!');
            done();
        });
    });
    it('should work with noResolve', function () {
        // create a temporary ts program to get the list of all files from angular...
        testSupport.writeFiles({
            'src/main.ts': createModuleAndCompSource('main'),
        });
        var allRootNames = resolveFiles([path.resolve(testSupport.basePath, 'src/main.ts')]);
        // now do the actual test with noResolve
        var program = compile(undefined, { noResolve: true }, allRootNames);
        testSupport.shouldExist('built/src/main.ngfactory.js');
        testSupport.shouldExist('built/src/main.ngfactory.d.ts');
    });
    it('should work with tsx files', function () {
        // create a temporary ts program to get the list of all files from angular...
        testSupport.writeFiles({
            'src/main.tsx': createModuleAndCompSource('main'),
        });
        var allRootNames = resolveFiles([path.resolve(testSupport.basePath, 'src/main.tsx')]);
        var program = compile(undefined, { jsx: ts.JsxEmit.React }, allRootNames);
        testSupport.shouldExist('built/src/main.js');
        testSupport.shouldExist('built/src/main.d.ts');
        testSupport.shouldExist('built/src/main.ngfactory.js');
        testSupport.shouldExist('built/src/main.ngfactory.d.ts');
        testSupport.shouldExist('built/src/main.ngsummary.json');
    });
    it('should emit also empty generated files depending on the options', function () {
        testSupport.writeFiles({
            'src/main.ts': "\n        import {Component, NgModule} from '@angular/core';\n\n        @Component({selector: 'main', template: '', styleUrls: ['main.css']})\n        export class MainComp {}\n\n        @NgModule({declarations: [MainComp]})\n        export class MainModule {}\n      ",
            'src/main.css': "",
            'src/util.ts': 'export const x = 1;',
            'src/index.ts': "\n        export * from './util';\n        export * from './main';\n      ",
        });
        var options = testSupport.createCompilerOptions({
            allowEmptyCodegenFiles: true,
            enableSummariesForJit: true,
        });
        var host = ng.createCompilerHost({ options: options });
        var written = new Map();
        host.writeFile =
            function (fileName, data, writeByteOrderMark, onError, sourceFiles) {
                written.set(fileName, { original: sourceFiles, data: data });
            };
        var program = ng.createProgram({ rootNames: [path.resolve(testSupport.basePath, 'src/index.ts')], options: options, host: host });
        program.emit();
        function assertGenFile(fileName, checks) {
            var writeData = written.get(path.join(testSupport.basePath, fileName));
            expect(writeData).toBeTruthy();
            expect(writeData.original.some(function (sf) { return sf.fileName === path.join(testSupport.basePath, checks.originalFileName); }))
                .toBe(true);
            switch (checks.shouldBe) {
                case 0 /* Empty */:
                    expect(writeData.data).toMatch(/^(\s*\/\*([^*]|\*[^/])*\*\/\s*)?$/);
                    break;
                case 1 /* EmptyExport */:
                    expect(writeData.data)
                        .toMatch(/^((\s*\/\*([^*]|\*[^/])*\*\/\s*)|(\s*export\s*{\s*}\s*;\s*)|())$/);
                    break;
                case 2 /* NoneEmpty */:
                    expect(writeData.data).not.toBe('');
                    break;
            }
        }
        assertGenFile('built/src/util.ngfactory.js', { originalFileName: 'src/util.ts', shouldBe: 0 /* Empty */ });
        assertGenFile('built/src/util.ngfactory.d.ts', { originalFileName: 'src/util.ts', shouldBe: 1 /* EmptyExport */ });
        assertGenFile('built/src/util.ngsummary.js', { originalFileName: 'src/util.ts', shouldBe: 0 /* Empty */ });
        assertGenFile('built/src/util.ngsummary.d.ts', { originalFileName: 'src/util.ts', shouldBe: 1 /* EmptyExport */ });
        assertGenFile('built/src/util.ngsummary.json', { originalFileName: 'src/util.ts', shouldBe: 2 /* NoneEmpty */ });
        // Note: we always fill non shim and shim style files as they might
        // be shared by component with and without ViewEncapsulation.
        assertGenFile('built/src/main.css.ngstyle.js', { originalFileName: 'src/main.ts', shouldBe: 2 /* NoneEmpty */ });
        assertGenFile('built/src/main.css.ngstyle.d.ts', { originalFileName: 'src/main.ts', shouldBe: 1 /* EmptyExport */ });
        // Note: this file is not empty as we actually generated code for it
        assertGenFile('built/src/main.css.shim.ngstyle.js', { originalFileName: 'src/main.ts', shouldBe: 2 /* NoneEmpty */ });
        assertGenFile('built/src/main.css.shim.ngstyle.d.ts', { originalFileName: 'src/main.ts', shouldBe: 1 /* EmptyExport */ });
    });
    it('should not emit /// references in .d.ts files', function () {
        testSupport.writeFiles({
            'src/main.ts': createModuleAndCompSource('main'),
        });
        compile(undefined, { declaration: true }, [path.resolve(testSupport.basePath, 'src/main.ts')]);
        var dts = fs.readFileSync(path.resolve(testSupport.basePath, 'built', 'src', 'main.d.ts')).toString();
        expect(dts).toMatch('export declare class');
        expect(dts).not.toMatch('///');
    });
    it('should not emit generated files whose sources are outside of the rootDir', function () {
        testSupport.writeFiles({
            'src/main.ts': createModuleAndCompSource('main'),
            'src/index.ts': "\n          export * from './main';\n        "
        });
        var options = testSupport.createCompilerOptions({ rootDir: path.resolve(testSupport.basePath, 'src') });
        var host = ng.createCompilerHost({ options: options });
        var writtenFileNames = [];
        var oldWriteFile = host.writeFile;
        host.writeFile = function (fileName, data, writeByteOrderMark, onError, sourceFiles) {
            writtenFileNames.push(fileName);
            oldWriteFile(fileName, data, writeByteOrderMark, onError, sourceFiles);
        };
        compile(/*oldProgram*/ undefined, options, /*rootNames*/ undefined, host);
        // no emit for files from node_modules as they are outside of rootDir
        expect(writtenFileNames.some(function (f) { return /node_modules/.test(f); })).toBe(false);
        // emit all gen files for files under src/
        testSupport.shouldExist('built/main.js');
        testSupport.shouldExist('built/main.d.ts');
        testSupport.shouldExist('built/main.ngfactory.js');
        testSupport.shouldExist('built/main.ngfactory.d.ts');
        testSupport.shouldExist('built/main.ngsummary.json');
    });
    describe('createSrcToOutPathMapper', function () {
        it('should return identity mapping if no outDir is present', function () {
            var mapper = program_1.createSrcToOutPathMapper(undefined, undefined, undefined);
            expect(mapper('/tmp/b/y.js')).toBe('/tmp/b/y.js');
        });
        it('should return identity mapping if first src and out fileName have same dir', function () {
            var mapper = program_1.createSrcToOutPathMapper('/tmp', '/tmp/a/x.ts', '/tmp/a/x.js');
            expect(mapper('/tmp/b/y.js')).toBe('/tmp/b/y.js');
        });
        it('should adjust the filename if the outDir is inside of the rootDir', function () {
            var mapper = program_1.createSrcToOutPathMapper('/tmp/out', '/tmp/a/x.ts', '/tmp/out/a/x.js');
            expect(mapper('/tmp/b/y.js')).toBe('/tmp/out/b/y.js');
        });
        it('should adjust the filename if the outDir is outside of the rootDir', function () {
            var mapper = program_1.createSrcToOutPathMapper('/out', '/tmp/a/x.ts', '/out/a/x.js');
            expect(mapper('/tmp/b/y.js')).toBe('/out/b/y.js');
        });
        it('should adjust the filename if the common prefix of sampleSrc and sampleOut is outside of outDir', function () {
            var mapper = program_1.createSrcToOutPathMapper('/dist/common', '/src/common/x.ts', '/dist/common/x.js');
            expect(mapper('/src/common/y.js')).toBe('/dist/common/y.js');
        });
        it('should work on windows with normalized paths', function () {
            var mapper = program_1.createSrcToOutPathMapper('c:/tmp/out', 'c:/tmp/a/x.ts', 'c:/tmp/out/a/x.js', path.win32);
            expect(mapper('c:/tmp/b/y.js')).toBe('c:\\tmp\\out\\b\\y.js');
        });
        it('should work on windows with non-normalized paths', function () {
            var mapper = program_1.createSrcToOutPathMapper('c:\\tmp\\out', 'c:\\tmp\\a\\x.ts', 'c:\\tmp\\out\\a\\x.js', path.win32);
            expect(mapper('c:\\tmp\\b\\y.js')).toBe('c:\\tmp\\out\\b\\y.js');
        });
    });
    describe('listLazyRoutes', function () {
        function writeSomeRoutes() {
            testSupport.writeFiles({
                'src/main.ts': "\n          import {NgModule} from '@angular/core';\n          import {RouterModule} from '@angular/router';\n\n          @NgModule({\n            imports: [RouterModule.forRoot([{loadChildren: './child#ChildModule'}])]\n          })\n          export class MainModule {}\n        ",
                'src/child.ts': "\n          import {NgModule} from '@angular/core';\n          import {RouterModule} from '@angular/router';\n\n          @NgModule({\n            imports: [RouterModule.forChild([{loadChildren: './child2#ChildModule2'}])]\n          })\n          export class ChildModule {}\n        ",
                'src/child2.ts': "\n          import {NgModule} from '@angular/core';\n\n          @NgModule()\n          export class ChildModule2 {}\n        ",
            });
        }
        function createProgram(rootNames, overrideOptions) {
            if (overrideOptions === void 0) { overrideOptions = {}; }
            var options = testSupport.createCompilerOptions(overrideOptions);
            var host = ng.createCompilerHost({ options: options });
            var program = ng.createProgram({ rootNames: rootNames.map(function (p) { return path.resolve(testSupport.basePath, p); }), options: options, host: host });
            return { program: program, options: options };
        }
        function normalizeRoutes(lazyRoutes) {
            return lazyRoutes.map(function (r) { return ({
                route: r.route,
                module: { name: r.module.name, filePath: r.module.filePath },
                referencedModule: { name: r.referencedModule.name, filePath: r.referencedModule.filePath },
            }); });
        }
        it('should list all lazyRoutes', function () {
            writeSomeRoutes();
            var _a = createProgram(['src/main.ts', 'src/child.ts', 'src/child2.ts']), program = _a.program, options = _a.options;
            test_support_1.expectNoDiagnosticsInProgram(options, program);
            expect(normalizeRoutes(program.listLazyRoutes())).toEqual([
                {
                    module: { name: 'MainModule', filePath: path.resolve(testSupport.basePath, 'src/main.ts') },
                    referencedModule: { name: 'ChildModule', filePath: path.resolve(testSupport.basePath, 'src/child.ts') },
                    route: './child#ChildModule'
                },
                {
                    module: { name: 'ChildModule', filePath: path.resolve(testSupport.basePath, 'src/child.ts') },
                    referencedModule: { name: 'ChildModule2', filePath: path.resolve(testSupport.basePath, 'src/child2.ts') },
                    route: './child2#ChildModule2'
                },
            ]);
        });
        it('should emit correctly after listing lazyRoutes', function () {
            testSupport.writeFiles({
                'src/main.ts': "\n          import {NgModule} from '@angular/core';\n          import {RouterModule} from '@angular/router';\n\n          @NgModule({\n            imports: [RouterModule.forRoot([{loadChildren: './lazy/lazy#LazyModule'}])]\n          })\n          export class MainModule {}\n        ",
                'src/lazy/lazy.ts': "\n          import {NgModule} from '@angular/core';\n\n          @NgModule()\n          export class ChildModule {}\n        ",
            });
            var _a = createProgram(['src/main.ts', 'src/lazy/lazy.ts']), program = _a.program, options = _a.options;
            test_support_1.expectNoDiagnosticsInProgram(options, program);
            program.listLazyRoutes();
            program.emit();
            var ngFactoryPath = path.resolve(testSupport.basePath, 'built/src/lazy/lazy.ngfactory.js');
            var lazyNgFactory = fs.readFileSync(ngFactoryPath, 'utf8');
            expect(lazyNgFactory).toContain('import * as i1 from "./lazy";');
        });
        it('should list lazyRoutes given an entryRoute recursively', function () {
            writeSomeRoutes();
            var _a = createProgram(['src/main.ts']), program = _a.program, options = _a.options;
            test_support_1.expectNoDiagnosticsInProgram(options, program);
            expect(normalizeRoutes(program.listLazyRoutes('src/main#MainModule'))).toEqual([
                {
                    module: { name: 'MainModule', filePath: path.resolve(testSupport.basePath, 'src/main.ts') },
                    referencedModule: { name: 'ChildModule', filePath: path.resolve(testSupport.basePath, 'src/child.ts') },
                    route: './child#ChildModule'
                },
                {
                    module: { name: 'ChildModule', filePath: path.resolve(testSupport.basePath, 'src/child.ts') },
                    referencedModule: { name: 'ChildModule2', filePath: path.resolve(testSupport.basePath, 'src/child2.ts') },
                    route: './child2#ChildModule2'
                },
            ]);
            expect(normalizeRoutes(program.listLazyRoutes('src/child#ChildModule'))).toEqual([
                {
                    module: { name: 'ChildModule', filePath: path.resolve(testSupport.basePath, 'src/child.ts') },
                    referencedModule: { name: 'ChildModule2', filePath: path.resolve(testSupport.basePath, 'src/child2.ts') },
                    route: './child2#ChildModule2'
                },
            ]);
        });
        it('should list lazyRoutes pointing to a default export', function () {
            testSupport.writeFiles({
                'src/main.ts': "\n          import {NgModule} from '@angular/core';\n          import {RouterModule} from '@angular/router';\n\n          @NgModule({\n            imports: [RouterModule.forRoot([{loadChildren: './child'}])]\n          })\n          export class MainModule {}\n        ",
                'src/child.ts': "\n          import {NgModule} from '@angular/core';\n\n          @NgModule()\n          export default class ChildModule {}\n        ",
            });
            var _a = createProgram(['src/main.ts']), program = _a.program, options = _a.options;
            expect(normalizeRoutes(program.listLazyRoutes('src/main#MainModule'))).toEqual([
                {
                    module: { name: 'MainModule', filePath: path.resolve(testSupport.basePath, 'src/main.ts') },
                    referencedModule: {
                        name: undefined,
                        filePath: path.resolve(testSupport.basePath, 'src/child.ts')
                    },
                    route: './child'
                },
            ]);
        });
        it('should list lazyRoutes from imported modules', function () {
            testSupport.writeFiles({
                'src/main.ts': "\n          import {NgModule} from '@angular/core';\n          import {RouterModule} from '@angular/router';\n          import {NestedMainModule} from './nested/main';\n\n          @NgModule({\n            imports: [\n              RouterModule.forRoot([{loadChildren: './child#ChildModule'}]),\n              NestedMainModule,\n            ]\n          })\n          export class MainModule {}\n        ",
                'src/child.ts': "\n          import {NgModule} from '@angular/core';\n\n          @NgModule()\n          export class ChildModule {}\n        ",
                'src/nested/main.ts': "\n          import {NgModule} from '@angular/core';\n          import {RouterModule} from '@angular/router';\n\n          @NgModule({\n            imports: [RouterModule.forChild([{loadChildren: './child#NestedChildModule'}])]\n          })\n          export class NestedMainModule {}\n        ",
                'src/nested/child.ts': "\n          import {NgModule} from '@angular/core';\n\n          @NgModule()\n          export class NestedChildModule {}\n        ",
            });
            var _a = createProgram(['src/main.ts']), program = _a.program, options = _a.options;
            expect(normalizeRoutes(program.listLazyRoutes('src/main#MainModule'))).toEqual([
                {
                    module: {
                        name: 'NestedMainModule',
                        filePath: path.resolve(testSupport.basePath, 'src/nested/main.ts')
                    },
                    referencedModule: {
                        name: 'NestedChildModule',
                        filePath: path.resolve(testSupport.basePath, 'src/nested/child.ts')
                    },
                    route: './child#NestedChildModule'
                },
                {
                    module: { name: 'MainModule', filePath: path.resolve(testSupport.basePath, 'src/main.ts') },
                    referencedModule: { name: 'ChildModule', filePath: path.resolve(testSupport.basePath, 'src/child.ts') },
                    route: './child#ChildModule'
                },
            ]);
        });
        it('should dedupe lazyRoutes given an entryRoute', function () {
            writeSomeRoutes();
            testSupport.writeFiles({
                'src/index.ts': "\n          import {NgModule} from '@angular/core';\n          import {RouterModule} from '@angular/router';\n\n          @NgModule({\n            imports: [\n              RouterModule.forRoot([{loadChildren: './main#MainModule'}]),\n              RouterModule.forRoot([{loadChildren: './child#ChildModule'}]),\n            ]\n          })\n          export class MainModule {}\n        ",
            });
            var _a = createProgram(['src/index.ts']), program = _a.program, options = _a.options;
            test_support_1.expectNoDiagnosticsInProgram(options, program);
            expect(normalizeRoutes(program.listLazyRoutes('src/main#MainModule'))).toEqual([
                {
                    module: { name: 'MainModule', filePath: path.resolve(testSupport.basePath, 'src/main.ts') },
                    referencedModule: { name: 'ChildModule', filePath: path.resolve(testSupport.basePath, 'src/child.ts') },
                    route: './child#ChildModule'
                },
                {
                    module: { name: 'ChildModule', filePath: path.resolve(testSupport.basePath, 'src/child.ts') },
                    referencedModule: { name: 'ChildModule2', filePath: path.resolve(testSupport.basePath, 'src/child2.ts') },
                    route: './child2#ChildModule2'
                },
            ]);
        });
        it('should list lazyRoutes given an entryRoute even with static errors', function () {
            testSupport.writeFiles({
                'src/main.ts': "\n          import {NgModule, Component} from '@angular/core';\n          import {RouterModule} from '@angular/router';\n\n          @Component({\n            selector: 'url-comp',\n            // Non existent external template\n            templateUrl: 'non-existent.html',\n          })\n          export class ErrorComp {}\n\n          @Component({\n            selector: 'err-comp',\n            // Error in template\n            template: '<input/>{{',\n          })\n          export class ErrorComp2 {}\n\n          // Component with metadata errors.\n          @Component(() => {if (1==1) return null as any;})\n          export class ErrorComp3 {}\n\n          // Unused component\n          @Component({\n            selector: 'unused-comp',\n            template: ''\n          })\n          export class UnusedComp {}\n\n          @NgModule({\n            declarations: [ErrorComp, ErrorComp2, ErrorComp3, NonExistentComp],\n            imports: [RouterModule.forRoot([{loadChildren: './child#ChildModule'}])]\n          })\n          export class MainModule {}\n\n          @NgModule({\n            // Component used in 2 NgModules\n            declarations: [ErrorComp],\n          })\n          export class Mod2 {}\n        ",
                'src/child.ts': "\n          import {NgModule} from '@angular/core';\n\n          @NgModule()\n          export class ChildModule {}\n        ",
            });
            var program = createProgram(['src/main.ts'], { collectAllErrors: true }).program;
            expect(normalizeRoutes(program.listLazyRoutes('src/main#MainModule'))).toEqual([{
                    module: { name: 'MainModule', filePath: path.resolve(testSupport.basePath, 'src/main.ts') },
                    referencedModule: { name: 'ChildModule', filePath: path.resolve(testSupport.basePath, 'src/child.ts') },
                    route: './child#ChildModule'
                }]);
        });
    });
    it('should report errors for ts and ng errors on emit with noEmitOnError=true', function () {
        testSupport.writeFiles({
            'src/main.ts': "\n        import {Component, NgModule} from '@angular/core';\n\n        // Ts error\n        let x: string = 1;\n\n        // Ng error\n        @Component({selector: 'comp', templateUrl: './main.html'})\n        export class MyComp {}\n\n        @NgModule({declarations: [MyComp]})\n        export class MyModule {}\n        ",
            'src/main.html': '{{nonExistent}}'
        });
        var options = testSupport.createCompilerOptions({ noEmitOnError: true });
        var host = ng.createCompilerHost({ options: options });
        var program1 = ng.createProgram({ rootNames: [path.resolve(testSupport.basePath, 'src/main.ts')], options: options, host: host });
        var errorDiags = program1.emit().diagnostics.filter(function (d) { return d.category === ts.DiagnosticCategory.Error; });
        expect(perform_compile_1.formatDiagnostics(errorDiags))
            .toContain("src/main.ts(5,13): error TS2322: Type '1' is not assignable to type 'string'.");
        expect(perform_compile_1.formatDiagnostics(errorDiags))
            .toContain("src/main.html(1,1): error TS100: Property 'nonExistent' does not exist on type 'MyComp'.");
    });
    it('should not report emit errors with noEmitOnError=false', function () {
        testSupport.writeFiles({
            'src/main.ts': "\n        @NgModule()\n      "
        });
        var options = testSupport.createCompilerOptions({ noEmitOnError: false });
        var host = ng.createCompilerHost({ options: options });
        var program1 = ng.createProgram({ rootNames: [path.resolve(testSupport.basePath, 'src/main.ts')], options: options, host: host });
        expect(program1.emit().diagnostics.length).toBe(0);
    });
    describe('errors', function () {
        var fileWithStructuralError = "\n      import {NgModule} from '@angular/core';\n\n      @NgModule(() => (1===1 ? null as any : null as any))\n      export class MyModule {}\n    ";
        var fileWithGoodContent = "\n      import {NgModule} from '@angular/core';\n\n      @NgModule()\n      export class MyModule {}\n    ";
        it('should not throw on structural errors but collect them', function () {
            testSupport.write('src/index.ts', fileWithStructuralError);
            var options = testSupport.createCompilerOptions();
            var host = ng.createCompilerHost({ options: options });
            var program = ng.createProgram({ rootNames: [path.resolve(testSupport.basePath, 'src/index.ts')], options: options, host: host });
            var structuralErrors = program.getNgStructuralDiagnostics();
            expect(structuralErrors.length).toBe(1);
            expect(structuralErrors[0].messageText).toContain('Function expressions are not supported');
        });
        it('should not throw on structural errors but collect them (loadNgStructureAsync)', function (done) {
            testSupport.write('src/index.ts', fileWithStructuralError);
            var options = testSupport.createCompilerOptions();
            var host = ng.createCompilerHost({ options: options });
            var program = ng.createProgram({ rootNames: [path.resolve(testSupport.basePath, 'src/index.ts')], options: options, host: host });
            program.loadNgStructureAsync().then(function () {
                var structuralErrors = program.getNgStructuralDiagnostics();
                expect(structuralErrors.length).toBe(1);
                expect(structuralErrors[0].messageText).toContain('Function expressions are not supported');
                done();
            });
        });
        it('should include non-formatted errors (e.g. invalid templateUrl)', function () {
            testSupport.write('src/index.ts', "\n        import {Component, NgModule} from '@angular/core';\n\n        @Component({\n          selector: 'my-component',\n          templateUrl: 'template.html',   // invalid template url\n        })\n        export class MyComponent {}\n\n        @NgModule({\n          declarations: [MyComponent]\n        })\n        export class MyModule {}\n      ");
            var options = testSupport.createCompilerOptions();
            var host = ng.createCompilerHost({ options: options });
            var program = ng.createProgram({
                rootNames: [path.resolve(testSupport.basePath, 'src/index.ts')],
                options: options,
                host: host,
            });
            var structuralErrors = program.getNgStructuralDiagnostics();
            expect(structuralErrors.length).toBe(1);
            expect(structuralErrors[0].messageText).toContain('Couldn\'t resolve resource template.html');
        });
        it('should be able report structural errors with noResolve:true and generateCodeForLibraries:false ' +
            'even if getSourceFile throws for non existent files', function () {
            testSupport.write('src/index.ts', fileWithGoodContent);
            // compile angular and produce .ngsummary.json / ngfactory.d.ts files
            compile();
            testSupport.write('src/ok.ts', fileWithGoodContent);
            testSupport.write('src/error.ts', fileWithStructuralError);
            // Make sure the ok.ts file is before the error.ts file,
            // so we added a .ngfactory.ts file for it.
            var allRootNames = resolveFiles(['src/ok.ts', 'src/error.ts'].map(function (fn) { return path.resolve(testSupport.basePath, fn); }));
            var options = testSupport.createCompilerOptions({
                noResolve: true,
                generateCodeForLibraries: false,
            });
            var host = ng.createCompilerHost({ options: options });
            var originalGetSourceFile = host.getSourceFile;
            host.getSourceFile =
                function (fileName, languageVersion, onError) {
                    // We should never try to load .ngfactory.ts files
                    if (fileName.match(/\.ngfactory\.ts$/)) {
                        throw new Error("Non existent ngfactory file: " + fileName);
                    }
                    return originalGetSourceFile.call(host, fileName, languageVersion, onError);
                };
            var program = ng.createProgram({ rootNames: allRootNames, options: options, host: host });
            var structuralErrors = program.getNgStructuralDiagnostics();
            expect(structuralErrors.length).toBe(1);
            expect(structuralErrors[0].messageText)
                .toContain('Function expressions are not supported');
        });
    });
    describe('checkVersion', function () {
        var MIN_TS_VERSION = '2.7.2';
        var MAX_TS_VERSION = '2.8.0';
        var versionError = function (version) {
            return "The Angular Compiler requires TypeScript >=" + MIN_TS_VERSION + " and <" + MAX_TS_VERSION + " but " + version + " was found instead.";
        };
        it('should not throw when a supported TypeScript version is used', function () {
            expect(function () { return program_1.checkVersion('2.7.2', MIN_TS_VERSION, MAX_TS_VERSION, undefined); }).not.toThrow();
            expect(function () { return program_1.checkVersion('2.7.2', MIN_TS_VERSION, MAX_TS_VERSION, false); }).not.toThrow();
            expect(function () { return program_1.checkVersion('2.7.2', MIN_TS_VERSION, MAX_TS_VERSION, true); }).not.toThrow();
        });
        it('should handle a TypeScript version < the minimum supported one', function () {
            expect(function () { return program_1.checkVersion('2.4.1', MIN_TS_VERSION, MAX_TS_VERSION, undefined); })
                .toThrowError(versionError('2.4.1'));
            expect(function () { return program_1.checkVersion('2.4.1', MIN_TS_VERSION, MAX_TS_VERSION, false); })
                .toThrowError(versionError('2.4.1'));
            expect(function () { return program_1.checkVersion('2.4.1', MIN_TS_VERSION, MAX_TS_VERSION, true); }).not.toThrow();
        });
        it('should handle a TypeScript version > the maximum supported one', function () {
            expect(function () { return program_1.checkVersion('2.9.0', MIN_TS_VERSION, MAX_TS_VERSION, undefined); })
                .toThrowError(versionError('2.9.0'));
            expect(function () { return program_1.checkVersion('2.9.0', MIN_TS_VERSION, MAX_TS_VERSION, false); })
                .toThrowError(versionError('2.9.0'));
            expect(function () { return program_1.checkVersion('2.9.0', MIN_TS_VERSION, MAX_TS_VERSION, true); }).not.toThrow();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3JhbV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3Rlc3QvdHJhbnNmb3JtZXJzL3Byb2dyYW1fc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILDBDQUE0QztBQUM1Qyx1QkFBeUI7QUFDekIsMkJBQTZCO0FBQzdCLCtCQUFpQztBQUVqQyw2REFBNEQ7QUFDNUQsa0RBQThFO0FBQzlFLDBEQUFzRjtBQUN0RixvREFBb0c7QUFDcEcsZ0RBQTRGO0FBRTVGLFFBQVEsQ0FBQyxZQUFZLEVBQUU7SUFDckIsSUFBSSxXQUF3QixDQUFDO0lBQzdCLElBQUksUUFBMkMsQ0FBQztJQUVoRCxVQUFVLENBQUM7UUFDVCxRQUFRLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6RSxXQUFXLEdBQUcsb0JBQUssRUFBRSxDQUFDO0lBQ3hCLENBQUMsQ0FBQyxDQUFDO0lBRUgsbUNBQW1DLE1BQWMsRUFBRSxRQUFzQztRQUF0Qyx5QkFBQSxFQUFBLFdBQW1CLE1BQU0sR0FBRyxVQUFVO1FBQ3ZGLElBQU0sYUFBYSxHQUNmLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLG1CQUFpQixRQUFRLE1BQUcsQ0FBQyxDQUFDLENBQUMsZ0JBQWUsUUFBUSxNQUFJLENBQUM7UUFDNUYsT0FBTyxnR0FHb0IsTUFBTSxXQUFNLGFBQWEsK0JBQ25DLE1BQU0sbURBRU8sTUFBTSxvQ0FDbkIsTUFBTSxvQkFDdEIsQ0FBQztJQUNKLENBQUM7SUFFRCxvQkFBb0IsT0FBZTs7UUFDakMsV0FBVyxDQUFDLFVBQVU7WUFDcEIsR0FBSSxPQUFPLGtCQUFlLElBQUcseUJBQXlCLENBQUMsT0FBTyxDQUFDO2dCQUMv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