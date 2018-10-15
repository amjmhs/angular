"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var main_1 = require("../../src/main");
var test_support_1 = require("../test_support");
function setupFakeCore(support) {
    var fakeCore = path.join(process.env.TEST_SRCDIR, 'angular/packages/compiler-cli/test/ngtsc/fake_core/npm_package');
    var nodeModulesPath = path.join(support.basePath, 'node_modules');
    var angularCoreDirectory = path.join(nodeModulesPath, '@angular/core');
    fs.symlinkSync(fakeCore, angularCoreDirectory);
}
function getNgRootDir() {
    var moduleFilename = module.filename.replace(/\\/g, '/');
    var distIndex = moduleFilename.indexOf('/dist/all');
    return moduleFilename.substr(0, distIndex);
}
describe('ngtsc behavioral tests', function () {
    if (!test_support_1.isInBazel()) {
        // These tests should be excluded from the non-Bazel build.
        return;
    }
    var basePath;
    var outDir;
    var write;
    var errorSpy;
    function shouldExist(fileName) {
        if (!fs.existsSync(path.resolve(outDir, fileName))) {
            throw new Error("Expected " + fileName + " to be emitted (outDir: " + outDir + ")");
        }
    }
    function shouldNotExist(fileName) {
        if (fs.existsSync(path.resolve(outDir, fileName))) {
            throw new Error("Did not expect " + fileName + " to be emitted (outDir: " + outDir + ")");
        }
    }
    function getContents(fileName) {
        shouldExist(fileName);
        var modulePath = path.resolve(outDir, fileName);
        return fs.readFileSync(modulePath, 'utf8');
    }
    function writeConfig(tsconfig) {
        if (tsconfig === void 0) { tsconfig = '{"extends": "./tsconfig-base.json", "angularCompilerOptions": {"enableIvy": "ngtsc"}}'; }
        write('tsconfig.json', tsconfig);
    }
    beforeEach(function () {
        errorSpy = jasmine.createSpy('consoleError').and.callFake(console.error);
        var support = test_support_1.setup();
        basePath = support.basePath;
        outDir = path.join(basePath, 'built');
        process.chdir(basePath);
        write = function (fileName, content) { support.write(fileName, content); };
        setupFakeCore(support);
        write('tsconfig-base.json', "{\n      \"compilerOptions\": {\n        \"experimentalDecorators\": true,\n        \"skipLibCheck\": true,\n        \"noImplicitAny\": true,\n        \"types\": [],\n        \"outDir\": \"built\",\n        \"rootDir\": \".\",\n        \"baseUrl\": \".\",\n        \"declaration\": true,\n        \"target\": \"es5\",\n        \"module\": \"es2015\",\n        \"moduleResolution\": \"node\",\n        \"lib\": [\"es6\", \"dom\"],\n        \"typeRoots\": [\"node_modules/@types\"]\n      },\n      \"angularCompilerOptions\": {\n        \"enableIvy\": \"ngtsc\"\n      }\n    }");
    });
    it('should compile Injectables without errors', function () {
        writeConfig();
        write('test.ts', "\n        import {Injectable} from '@angular/core';\n\n        @Injectable()\n        export class Dep {}\n\n        @Injectable()\n        export class Service {\n          constructor(dep: Dep) {}\n        }\n    ");
        var exitCode = main_1.main(['-p', basePath], errorSpy);
        expect(errorSpy).not.toHaveBeenCalled();
        expect(exitCode).toBe(0);
        var jsContents = getContents('test.js');
        expect(jsContents).toContain('Dep.ngInjectableDef =');
        expect(jsContents).toContain('Service.ngInjectableDef =');
        expect(jsContents).not.toContain('__decorate');
        var dtsContents = getContents('test.d.ts');
        expect(dtsContents).toContain('static ngInjectableDef: i0.ɵInjectableDef<Dep>;');
        expect(dtsContents).toContain('static ngInjectableDef: i0.ɵInjectableDef<Service>;');
    });
    it('should compile Components without errors', function () {
        writeConfig();
        write('test.ts', "\n        import {Component} from '@angular/core';\n\n        @Component({\n          selector: 'test-cmp',\n          template: 'this is a test',\n        })\n        export class TestCmp {}\n    ");
        var exitCode = main_1.main(['-p', basePath], errorSpy);
        expect(errorSpy).not.toHaveBeenCalled();
        expect(exitCode).toBe(0);
        var jsContents = getContents('test.js');
        expect(jsContents).toContain('TestCmp.ngComponentDef = i0.ɵdefineComponent');
        expect(jsContents).not.toContain('__decorate');
        var dtsContents = getContents('test.d.ts');
        expect(dtsContents).toContain('static ngComponentDef: i0.ɵComponentDef<TestCmp, \'test-cmp\'>');
    });
    it('should compile Components without errors', function () {
        writeConfig();
        write('test.ts', "\n        import {Component} from '@angular/core';\n\n        @Component({\n          selector: 'test-cmp',\n          templateUrl: './dir/test.html',\n        })\n        export class TestCmp {}\n    ");
        write('dir/test.html', '<p>Hello World</p>');
        var exitCode = main_1.main(['-p', basePath], errorSpy);
        expect(errorSpy).not.toHaveBeenCalled();
        expect(exitCode).toBe(0);
        var jsContents = getContents('test.js');
        expect(jsContents).toContain('Hello World');
    });
    it('should compile NgModules without errors', function () {
        writeConfig();
        write('test.ts', "\n        import {Component, NgModule} from '@angular/core';\n\n        @Component({\n          selector: 'test-cmp',\n          template: 'this is a test',\n        })\n        export class TestCmp {}\n\n        @NgModule({\n          declarations: [TestCmp],\n        })\n        export class TestModule {}\n    ");
        var exitCode = main_1.main(['-p', basePath], errorSpy);
        expect(errorSpy).not.toHaveBeenCalled();
        expect(exitCode).toBe(0);
        var jsContents = getContents('test.js');
        expect(jsContents)
            .toContain('i0.ɵdefineNgModule({ type: TestModule, bootstrap: [], ' +
            'declarations: [TestCmp], imports: [], exports: [] })');
        var dtsContents = getContents('test.d.ts');
        expect(dtsContents).toContain('static ngComponentDef: i0.ɵComponentDef<TestCmp, \'test-cmp\'>');
        expect(dtsContents)
            .toContain('static ngModuleDef: i0.ɵNgModuleDef<TestModule, [typeof TestCmp], never, never>');
        expect(dtsContents).not.toContain('__decorate');
    });
    it('should compile NgModules with services without errors', function () {
        writeConfig();
        write('test.ts', "\n        import {Component, NgModule} from '@angular/core';\n\n        export class Token {}\n\n        @NgModule({})\n        export class OtherModule {}\n\n        @Component({\n          selector: 'test-cmp',\n          template: 'this is a test',\n        })\n        export class TestCmp {}\n\n        @NgModule({\n          declarations: [TestCmp],\n          providers: [{provide: Token, useValue: 'test'}],\n          imports: [OtherModule],\n        })\n        export class TestModule {}\n    ");
        var exitCode = main_1.main(['-p', basePath], errorSpy);
        expect(errorSpy).not.toHaveBeenCalled();
        expect(exitCode).toBe(0);
        var jsContents = getContents('test.js');
        expect(jsContents).toContain('i0.ɵdefineNgModule({ type: TestModule,');
        expect(jsContents)
            .toContain("TestModule.ngInjectorDef = i0.defineInjector({ factory: " +
            "function TestModule_Factory() { return new TestModule(); }, providers: [{ provide: " +
            "Token, useValue: 'test' }], imports: [[OtherModule]] });");
        var dtsContents = getContents('test.d.ts');
        expect(dtsContents)
            .toContain('static ngModuleDef: i0.ɵNgModuleDef<TestModule, [typeof TestCmp], [typeof OtherModule], never>');
        expect(dtsContents).toContain('static ngInjectorDef: i0.ɵInjectorDef');
    });
    it('should compile Pipes without errors', function () {
        writeConfig();
        write('test.ts', "\n        import {Pipe} from '@angular/core';\n\n        @Pipe({\n          name: 'test-pipe',\n          pure: false,\n        })\n        export class TestPipe {}\n    ");
        var exitCode = main_1.main(['-p', basePath], errorSpy);
        expect(errorSpy).not.toHaveBeenCalled();
        expect(exitCode).toBe(0);
        var jsContents = getContents('test.js');
        var dtsContents = getContents('test.d.ts');
        expect(jsContents)
            .toContain('TestPipe.ngPipeDef = i0.ɵdefinePipe({ name: "test-pipe", type: TestPipe, ' +
            'factory: function TestPipe_Factory() { return new TestPipe(); }, pure: false })');
        expect(dtsContents).toContain('static ngPipeDef: i0.ɵPipeDef<TestPipe, \'test-pipe\'>;');
    });
    it('should compile pure Pipes without errors', function () {
        writeConfig();
        write('test.ts', "\n        import {Pipe} from '@angular/core';\n\n        @Pipe({\n          name: 'test-pipe',\n        })\n        export class TestPipe {}\n    ");
        var exitCode = main_1.main(['-p', basePath], errorSpy);
        expect(errorSpy).not.toHaveBeenCalled();
        expect(exitCode).toBe(0);
        var jsContents = getContents('test.js');
        var dtsContents = getContents('test.d.ts');
        expect(jsContents)
            .toContain('TestPipe.ngPipeDef = i0.ɵdefinePipe({ name: "test-pipe", type: TestPipe, ' +
            'factory: function TestPipe_Factory() { return new TestPipe(); }, pure: true })');
        expect(dtsContents).toContain('static ngPipeDef: i0.ɵPipeDef<TestPipe, \'test-pipe\'>;');
    });
    it('should compile Pipes with dependencies', function () {
        writeConfig();
        write('test.ts', "\n        import {Pipe} from '@angular/core';\n\n        export class Dep {}\n\n        @Pipe({\n          name: 'test-pipe',\n          pure: false,\n        })\n        export class TestPipe {\n          constructor(dep: Dep) {}\n        }\n    ");
        var exitCode = main_1.main(['-p', basePath], errorSpy);
        expect(errorSpy).not.toHaveBeenCalled();
        expect(exitCode).toBe(0);
        var jsContents = getContents('test.js');
        expect(jsContents).toContain('return new TestPipe(i0.ɵdirectiveInject(Dep));');
    });
    it('should include @Pipes in @NgModule scopes', function () {
        writeConfig();
        write('test.ts', "\n        import {Component, NgModule, Pipe} from '@angular/core';\n\n        @Pipe({name: 'test'})\n        export class TestPipe {}\n\n        @Component({selector: 'test-cmp', template: '{{value | test}}'})\n        export class TestCmp {}\n\n        @NgModule({declarations: [TestPipe, TestCmp]})\n        export class TestModule {}\n    ");
        var exitCode = main_1.main(['-p', basePath], errorSpy);
        expect(errorSpy).not.toHaveBeenCalled();
        expect(exitCode).toBe(0);
        var jsContents = getContents('test.js');
        expect(jsContents).toContain('pipes: [TestPipe]');
        var dtsContents = getContents('test.d.ts');
        expect(dtsContents)
            .toContain('i0.ɵNgModuleDef<TestModule, [typeof TestPipe,typeof TestCmp], never, never>');
    });
    it('should unwrap a ModuleWithProviders function if a generic type is provided for it', function () {
        writeConfig();
        write("test.ts", "\n        import {NgModule} from '@angular/core';\n        import {RouterModule} from 'router';\n\n        @NgModule({imports: [RouterModule.forRoot()]})\n        export class TestModule {}\n    ");
        write('node_modules/router/index.d.ts', "\n        import {ModuleWithProviders} from '@angular/core';\n\n        declare class RouterModule {\n          static forRoot(): ModuleWithProviders<RouterModule>;\n        }\n    ");
        var exitCode = main_1.main(['-p', basePath], errorSpy);
        expect(errorSpy).not.toHaveBeenCalled();
        expect(exitCode).toBe(0);
        var jsContents = getContents('test.js');
        expect(jsContents).toContain('imports: [[RouterModule.forRoot()]]');
        var dtsContents = getContents('test.d.ts');
        expect(dtsContents).toContain("import * as i1 from 'router';");
        expect(dtsContents)
            .toContain('i0.ɵNgModuleDef<TestModule, never, [typeof i1.RouterModule], never>');
    });
    it('should inject special types according to the metadata', function () {
        writeConfig();
        write("test.ts", "\n        import {\n          Attribute,\n          ChangeDetectorRef,\n          Component,\n          ElementRef,\n          Injector,\n          TemplateRef,\n          ViewContainerRef,\n        } from '@angular/core';\n\n        @Component({\n          selector: 'test',\n          template: 'Test',\n        })\n        class FooCmp {\n          constructor(\n            @Attribute(\"test\") attr: string,\n            cdr: ChangeDetectorRef,\n            er: ElementRef,\n            i: Injector,\n            tr: TemplateRef,\n            vcr: ViewContainerRef,\n          ) {}\n        }\n    ");
        var exitCode = main_1.main(['-p', basePath], errorSpy);
        expect(errorSpy).not.toHaveBeenCalled();
        expect(exitCode).toBe(0);
        var jsContents = getContents('test.js');
        expect(jsContents)
            .toContain("factory: function FooCmp_Factory() { return new FooCmp(i0.\u0275injectAttribute(\"test\"), i0.\u0275injectChangeDetectorRef(), i0.\u0275injectElementRef(), i0.\u0275directiveInject(i0.INJECTOR), i0.\u0275injectTemplateRef(), i0.\u0275injectViewContainerRef()); }");
    });
    it('should generate queries for components', function () {
        writeConfig();
        write("test.ts", "\n        import {Component, ContentChild, ContentChildren, TemplateRef, ViewChild} from '@angular/core';\n\n        @Component({\n          selector: 'test',\n          template: '<div #foo></div>',\n          queries: {\n            'mview': new ViewChild('test1'),\n            'mcontent': new ContentChild('test2'),\n          }\n        })\n        class FooCmp {\n          @ContentChild('bar', {read: TemplateRef}) child: any;\n          @ContentChildren(TemplateRef) children: any;\n          get aview(): any { return null; }\n          @ViewChild('accessor') set aview(value: any) {}\n        }\n    ");
        var exitCode = main_1.main(['-p', basePath], errorSpy);
        expect(errorSpy).not.toHaveBeenCalled();
        expect(exitCode).toBe(0);
        var jsContents = getContents('test.js');
        expect(jsContents).toContain("i0.\u0275Q(null, [\"bar\"], true, TemplateRef)");
        expect(jsContents).toContain("i0.\u0275Q(null, TemplateRef, false)");
        expect(jsContents).toContain("i0.\u0275Q(null, [\"test2\"], true)");
        expect(jsContents).toContain("i0.\u0275Q(0, [\"accessor\"], true)");
        expect(jsContents).toContain("i0.\u0275Q(1, [\"test1\"], true)");
    });
    it('should generate host bindings for directives', function () {
        writeConfig();
        write("test.ts", "\n        import {Component, HostBinding, HostListener, TemplateRef} from '@angular/core';\n\n        @Component({\n          selector: 'test',\n          template: 'Test',\n          host: {\n            '[attr.hello]': 'foo',\n            '(click)': 'onClick($event)',\n            '[prop]': 'bar',\n          },\n        })\n        class FooCmp {\n          onClick(event: any): void {}\n\n          @HostBinding('class.someclass')\n          get someClass(): boolean { return false; }\n\n          @HostListener('onChange', ['arg'])\n          onChange(event: any, arg: any): void {}\n        }\n    ");
        var exitCode = main_1.main(['-p', basePath], errorSpy);
        expect(errorSpy).not.toHaveBeenCalled();
        expect(exitCode).toBe(0);
        var jsContents = getContents('test.js');
        expect(jsContents).toContain("i0.\u0275p(elIndex, \"attr.hello\", i0.\u0275b(i0.\u0275d(dirIndex).foo));");
        expect(jsContents).toContain("i0.\u0275p(elIndex, \"prop\", i0.\u0275b(i0.\u0275d(dirIndex).bar));");
        expect(jsContents)
            .toContain('i0.ɵp(elIndex, "class.someclass", i0.ɵb(i0.ɵd(dirIndex).someClass))');
        expect(jsContents).toContain('i0.ɵd(dirIndex).onClick($event)');
        expect(jsContents).toContain('i0.ɵd(dirIndex).onChange(i0.ɵd(dirIndex).arg)');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd0c2Nfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS90ZXN0L25ndHNjL25ndHNjX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCx1QkFBeUI7QUFDekIsMkJBQTZCO0FBRzdCLHVDQUFnRjtBQUNoRixnREFBMkU7QUFFM0UsdUJBQXVCLE9BQW9CO0lBQ3pDLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLGdFQUFnRSxDQUFDLENBQUM7SUFFL0YsSUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQ3BFLElBQU0sb0JBQW9CLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFFekUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztBQUNqRCxDQUFDO0FBRUQ7SUFDRSxJQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDM0QsSUFBTSxTQUFTLEdBQUcsY0FBYyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN0RCxPQUFPLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzdDLENBQUM7QUFFRCxRQUFRLENBQUMsd0JBQXdCLEVBQUU7SUFDakMsSUFBSSxDQUFDLHdCQUFTLEVBQUUsRUFBRTtRQUNoQiwyREFBMkQ7UUFDM0QsT0FBTztLQUNSO0lBRUQsSUFBSSxRQUFnQixDQUFDO0lBQ3JCLElBQUksTUFBYyxDQUFDO0lBQ25CLElBQUksS0FBa0QsQ0FBQztJQUN2RCxJ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