"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var test_util_1 = require("./test_util");
describe('aot summaries for jit', function () {
    var angularFiles = test_util_1.setup();
    var angularSummaryFiles;
    beforeEach(function () {
        angularSummaryFiles = test_util_1.compile(angularFiles, { useSummaries: false, emit: true }).outDir;
    });
    function compileApp(rootDir, options) {
        if (options === void 0) { options = {}; }
        return test_util_1.compile([rootDir, options.useSummaries ? angularSummaryFiles : angularFiles], __assign({}, options, { enableSummariesForJit: true }));
    }
    it('should create @Injectable summaries', function () {
        var appDir = {
            'app.module.ts': "\n        import { Injectable } from '@angular/core';\n\n        export class Dep {}\n\n        @Injectable()\n        export class MyService {\n          constructor(d: Dep) {}\n        }\n      "
        };
        var rootDir = { 'app': appDir };
        var genFile = compileApp(rootDir).genFiles.find(function (f) { return f.genFileUrl === '/app/app.module.ngsummary.ts'; });
        var genSource = compiler_1.toTypeScript(genFile);
        expect(genSource).toContain("import * as i0 from '/app/app.module'");
        expect(genSource).toContain('export function MyServiceNgSummary()');
        // Note: CompileSummaryKind.Injectable = 3
        expect(genSource).toMatch(/summaryKind:3,\s*type:\{\s*reference:i0.MyService/);
        expect(genSource).toContain('token:{identifier:{reference:i0.Dep}}');
    });
    it('should create @Pipe summaries', function () {
        var appDir = {
            'app.module.ts': "\n        import { Pipe, NgModule } from '@angular/core';\n\n        export class Dep {}\n\n        @Pipe({name: 'myPipe'})\n        export class MyPipe {\n          constructor(d: Dep) {}\n        }\n\n        @NgModule({declarations: [MyPipe]})\n        export class MyModule {}\n      "
        };
        var rootDir = { 'app': appDir };
        var genFile = compileApp(rootDir).genFiles.find(function (f) { return f.genFileUrl === '/app/app.module.ngsummary.ts'; });
        var genSource = compiler_1.toTypeScript(genFile);
        expect(genSource).toContain("import * as i0 from '/app/app.module'");
        expect(genSource).toContain('export function MyPipeNgSummary()');
        // Note: CompileSummaryKind.Pipe = 1
        expect(genSource).toMatch(/summaryKind:0,\s*type:\{\s*reference:i0.MyPipe/);
        expect(genSource).toContain('token:{identifier:{reference:i0.Dep}}');
    });
    it('should create @Directive summaries', function () {
        var appDir = {
            'app.module.ts': "\n        import { Directive, NgModule } from '@angular/core';\n\n        export class Dep {}\n\n        @Directive({selector: '[myDir]'})\n        export class MyDirective {\n          constructor(a: Dep) {}\n        }\n\n        @NgModule({declarations: [MyDirective]})\n        export class MyModule {}\n      "
        };
        var rootDir = { 'app': appDir };
        var genFile = compileApp(rootDir).genFiles.find(function (f) { return f.genFileUrl === '/app/app.module.ngsummary.ts'; });
        var genSource = compiler_1.toTypeScript(genFile);
        expect(genSource).toContain("import * as i0 from '/app/app.module'");
        expect(genSource).toContain('export function MyDirectiveNgSummary()');
        // Note: CompileSummaryKind.Directive = 1
        expect(genSource).toMatch(/summaryKind:1,\s*type:\{\s*reference:i0.MyDirective/);
        expect(genSource).toContain('token:{identifier:{reference:i0.Dep}}');
    });
    it('should create @NgModule summaries', function () {
        var appDir = {
            'app.module.ts': "\n        import { NgModule } from '@angular/core';\n\n        export class Dep {}\n\n        @NgModule()\n        export class MyModule {\n          constructor(d: Dep) {}\n        }\n      "
        };
        var rootDir = { 'app': appDir };
        var genFile = compileApp(rootDir).genFiles.find(function (f) { return f.genFileUrl === '/app/app.module.ngsummary.ts'; });
        var genSource = compiler_1.toTypeScript(genFile);
        expect(genSource).toContain("import * as i0 from '/app/app.module'");
        expect(genSource).toContain('export function MyModuleNgSummary()');
        // Note: CompileSummaryKind.NgModule = 2
        expect(genSource).toMatch(/summaryKind:2,\s*type:\{\s*reference:i0.MyModule/);
        expect(genSource).toContain('token:{identifier:{reference:i0.Dep}}');
    });
    it('should embed useClass provider summaries in @Directive summaries', function () {
        var appDir = {
            'app.service.ts': "\n        import { Injectable } from '@angular/core';\n\n        export class Dep {}\n\n        @Injectable()\n        export class MyService {\n          constructor(d: Dep) {}\n        }\n      ",
            'app.module.ts': "\n        import { Directive, NgModule } from '@angular/core';\n        import { MyService } from './app.service';\n\n        @Directive({\n          selector: '[myDir]',\n          providers: [MyService]\n        })\n        export class MyDirective {}\n\n        @NgModule({declarations: [MyDirective]})\n        export class MyModule {}\n      "
        };
        var rootDir = { 'app': appDir };
        var genFile = compileApp(rootDir).genFiles.find(function (f) { return f.genFileUrl === '/app/app.module.ngsummary.ts'; });
        var genSource = compiler_1.toTypeScript(genFile);
        expect(genSource).toMatch(/useClass:\{\s*reference:i1.MyService/);
        // Note: CompileSummaryKind.Injectable = 3
        expect(genSource).toMatch(/summaryKind:3,\s*type:\{\s*reference:i1.MyService/);
        expect(genSource).toContain('token:{identifier:{reference:i1.Dep}}');
    });
    it('should embed useClass provider summaries into @NgModule summaries', function () {
        var appDir = {
            'app.service.ts': "\n        import { Injectable } from '@angular/core';\n\n        export class Dep {}\n\n        @Injectable()\n        export class MyService {\n          constructor(d: Dep) {}\n        }\n      ",
            'app.module.ts': "\n        import { NgModule } from '@angular/core';\n        import { MyService } from './app.service';\n\n        @NgModule({\n          providers: [MyService]\n        })\n        export class MyModule {}\n      "
        };
        var rootDir = { 'app': appDir };
        var genFile = compileApp(rootDir).genFiles.find(function (f) { return f.genFileUrl === '/app/app.module.ngsummary.ts'; });
        var genSource = compiler_1.toTypeScript(genFile);
        expect(genSource).toMatch(/useClass:\{\s*reference:i1.MyService/);
        // Note: CompileSummaryKind.Injectable = 3
        expect(genSource).toMatch(/summaryKind:3,\s*type:\{\s*reference:i1.MyService/);
        expect(genSource).toContain('token:{identifier:{reference:i1.Dep}}');
    });
    it('should reference declared @Directive and @Pipe summaries in @NgModule summaries', function () {
        var appDir = {
            'app.module.ts': "\n        import { Directive, Pipe, NgModule } from '@angular/core';\n\n        @Directive({selector: '[myDir]'})\n        export class MyDirective {}\n\n        @Pipe({name: 'myPipe'})\n        export class MyPipe {}\n\n        @NgModule({declarations: [MyDirective, MyPipe]})\n        export class MyModule {}\n      "
        };
        var rootDir = { 'app': appDir };
        var genFile = compileApp(rootDir).genFiles.find(function (f) { return f.genFileUrl === '/app/app.module.ngsummary.ts'; });
        var genSource = compiler_1.toTypeScript(genFile);
        expect(genSource).toMatch(/export function MyModuleNgSummary()[^;]*,\s*MyDirectiveNgSummary,\s*MyPipeNgSummary\s*\]\s*;/);
    });
    it('should reference imported @NgModule summaries in @NgModule summaries', function () {
        var appDir = {
            'app.module.ts': "\n        import { NgModule } from '@angular/core';\n\n        @NgModule()\n        export class MyImportedModule {}\n\n        @NgModule({imports: [MyImportedModule]})\n        export class MyModule {}\n      "
        };
        var rootDir = { 'app': appDir };
        var genFile = compileApp(rootDir).genFiles.find(function (f) { return f.genFileUrl === '/app/app.module.ngsummary.ts'; });
        var genSource = compiler_1.toTypeScript(genFile);
        expect(genSource).toMatch(/export function MyModuleNgSummary()[^;]*,\s*MyImportedModuleNgSummary\s*\]\s*;/);
    });
    it('should create and use reexports for imported NgModules ' +
        'across compilation units', function () {
        var lib1In = {
            'lib1': {
                'module.ts': "\n          import { NgModule } from '@angular/core';\n\n          @NgModule()\n          export class Lib1Module {}\n        ",
                'reexport.ts': "\n          import { NgModule } from '@angular/core';\n\n          @NgModule()\n          export class ReexportModule {}\n\n          export const reexports: any[] = [ ReexportModule ];\n        ",
            }
        };
        var _a = compileApp(lib1In, { useSummaries: true }), lib2In = _a.outDir, lib1Gen = _a.genFiles;
        lib2In['lib2'] = {
            'module.ts': "\n          import { NgModule } from '@angular/core';\n          import { Lib1Module } from '../lib1/module';\n\n          @NgModule({\n            imports: [Lib1Module]\n          })\n          export class Lib2Module {}\n        ",
            'reexport.ts': "\n        import { reexports as reexports_lib1 } from '../lib1/reexport';\n        export const reexports: any[] = [ reexports_lib1 ];\n        ",
        };
        var _b = compileApp(lib2In, { useSummaries: true }), lib3In = _b.outDir, lib2Gen = _b.genFiles;
        var lib2ModuleNgSummary = lib2Gen.find(function (f) { return f.genFileUrl === '/lib2/module.ngsummary.ts'; });
        var lib2ReexportNgSummary = lib2Gen.find(function (f) { return f.genFileUrl === '/lib2/reexport.ngsummary.ts'; });
        // ngsummaries should add reexports for imported NgModules from a direct dependency
        expect(compiler_1.toTypeScript(lib2ModuleNgSummary))
            .toContain("export {Lib1ModuleNgSummary as Lib1Module_1NgSummary} from '/lib1/module.ngsummary'");
        // ngsummaries should add reexports for reexported values from a direct dependency
        expect(compiler_1.toTypeScript(lib2ReexportNgSummary))
            .toContain("export {ReexportModuleNgSummary as ReexportModule_2NgSummary} from '/lib1/reexport.ngsummary'");
        lib3In['lib3'] = {
            'module.ts': "\n          import { NgModule } from '@angular/core';\n          import { Lib2Module } from '../lib2/module';\n          import { reexports } from '../lib2/reexport';\n\n          @NgModule({\n            imports: [Lib2Module, reexports]\n          })\n          export class Lib3Module {}\n        ",
            'reexport.ts': "\n        import { reexports as reexports_lib2 } from '../lib2/reexport';\n        export const reexports: any[] = [ reexports_lib2 ];\n        ",
        };
        var lib3Gen = compileApp(lib3In, { useSummaries: true }).genFiles;
        var lib3ModuleNgSummary = lib3Gen.find(function (f) { return f.genFileUrl === '/lib3/module.ngsummary.ts'; });
        var lib3ReexportNgSummary = lib3Gen.find(function (f) { return f.genFileUrl === '/lib3/reexport.ngsummary.ts'; });
        // ngsummary.ts files should use the reexported values from direct and deep deps
        var lib3ModuleNgSummarySource = compiler_1.toTypeScript(lib3ModuleNgSummary);
        expect(lib3ModuleNgSummarySource).toContain("import * as i4 from '/lib2/module.ngsummary'");
        expect(lib3ModuleNgSummarySource)
            .toContain("import * as i5 from '/lib2/reexport.ngsummary'");
        expect(lib3ModuleNgSummarySource)
            .toMatch(/export function Lib3ModuleNgSummary()[^;]*,\s*i4.Lib1Module_1NgSummary,\s*i4.Lib2ModuleNgSummary,\s*i5.ReexportModule_2NgSummary\s*\]\s*;/);
        // ngsummaries should add reexports for imported NgModules from a deep dependency
        expect(lib3ModuleNgSummarySource)
            .toContain("export {Lib1Module_1NgSummary as Lib1Module_1NgSummary,Lib2ModuleNgSummary as Lib2Module_2NgSummary} from '/lib2/module.ngsummary'");
        // ngsummaries should add reexports for reexported values from a deep dependency
        expect(compiler_1.toTypeScript(lib3ReexportNgSummary))
            .toContain("export {ReexportModule_2NgSummary as ReexportModule_3NgSummary} from '/lib2/reexport.ngsummary'");
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaml0X3N1bW1hcmllc19zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdC9hb3Qvaml0X3N1bW1hcmllc19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7QUFFSCw4Q0FBb0k7QUFFcEkseUNBQTBEO0FBRTFELFFBQVEsQ0FBQyx1QkFBdUIsRUFBRTtJQUNoQyxJQUFJLFlBQVksR0FBRyxpQkFBSyxFQUFFLENBQUM7SUFDM0IsSUFBSSxtQkFBa0MsQ0FBQztJQUV2QyxVQUFVLENBQUM7UUFDVCxtQkFBbUIsR0FBRyxtQkFBTyxDQUFDLFlBQVksRUFBRSxFQUFDLFlBQVksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsTUFBTSxDQUFDO0lBQ3hGLENBQUMsQ0FBQyxDQUFDO0lBRUgsb0JBQW9CLE9BQXNCLEVBQUUsT0FBc0M7UUFBdEMsd0JBQUEsRUFBQSxZQUFzQztRQUVoRixPQUFPLG1CQUFPLENBQ1YsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxlQUNoRSxPQUFPLElBQUUscUJBQXFCLEVBQUUsSUFBSSxJQUFFLENBQUM7SUFDakQsQ0FBQztJQUVELEVBQUUsQ0FBQyxxQ0FBcUMsRUFBRTtRQUN4QyxJQUFNLE1BQU0sR0FBRztZQUNiLGVBQWUsRUFBRSxzTUFTaEI7U0FDRixDQUFDO1FBQ0YsSUFBTSxPQUFPLEdBQUcsRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFDLENBQUM7UUFFaEMsSUFBTSxPQUFPLEdBQ1QsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsVUFBVSxLQUFLLDhCQUE4QixFQUEvQyxDQUEr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