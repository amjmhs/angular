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
var bundler_1 = require("@angular/compiler-cli/src/metadata/bundler");
var index_writer_1 = require("@angular/compiler-cli/src/metadata/index_writer");
var source_map_util_1 = require("@angular/compiler/testing/src/output/source_map_util");
var ts = require("typescript");
var test_util_1 = require("./test_util");
describe('compiler (unbundled Angular)', function () {
    var angularFiles = test_util_1.setup();
    describe('Quickstart', function () {
        it('should compile', function () {
            var genFiles = test_util_1.compile([QUICKSTART, angularFiles]).genFiles;
            expect(genFiles.find(function (f) { return /app\.component\.ngfactory\.ts/.test(f.genFileUrl); })).toBeDefined();
            expect(genFiles.find(function (f) { return /app\.module\.ngfactory\.ts/.test(f.genFileUrl); })).toBeDefined();
        });
    });
    describe('aot source mapping', function () {
        var componentPath = '/app/app.component.ts';
        var ngFactoryPath = '/app/app.component.ngfactory.ts';
        var rootDir;
        var appDir;
        beforeEach(function () {
            appDir = {
                'app.module.ts': "\n              import { NgModule }      from '@angular/core';\n\n              import { AppComponent }  from './app.component';\n\n              @NgModule({\n                declarations: [ AppComponent ],\n                bootstrap:    [ AppComponent ]\n              })\n              export class AppModule { }\n            "
            };
            rootDir = { 'app': appDir };
        });
        function compileApp() {
            var genFiles = test_util_1.compile([rootDir, angularFiles]).genFiles;
            return genFiles.find(function (genFile) { return genFile.srcFileUrl === componentPath && genFile.genFileUrl.endsWith('.ts'); });
        }
        function findLineAndColumn(file, token) {
            var index = file.indexOf(token);
            if (index === -1) {
                return { line: null, column: null };
            }
            var linesUntilToken = file.slice(0, index).split('\n');
            var line = linesUntilToken.length;
            var column = linesUntilToken[linesUntilToken.length - 1].length;
            return { line: line, column: column };
        }
        function createComponentSource(componentDecorator) {
            return "\n        import { NgModule, Component } from '@angular/core';\n\n        @Component({\n          " + componentDecorator + "\n        })\n        export class AppComponent {\n          someMethod() {}\n        }\n      ";
        }
        describe('inline templates', function () {
            var ngUrl = componentPath + ".AppComponent.html";
            function templateDecorator(template) { return "template: `" + template + "`,"; }
            declareTests({ ngUrl: ngUrl, templateDecorator: templateDecorator });
        });
        describe('external templates', function () {
            var ngUrl = '/app/app.component.html';
            var templateUrl = '/app/app.component.html';
            function templateDecorator(template) {
                appDir['app.component.html'] = template;
                return "templateUrl: 'app.component.html',";
            }
            declareTests({ ngUrl: ngUrl, templateDecorator: templateDecorator });
        });
        function declareTests(_a) {
            var ngUrl = _a.ngUrl, templateDecorator = _a.templateDecorator;
            it('should use the right source url in html parse errors', function () {
                appDir['app.component.ts'] = createComponentSource(templateDecorator('<div>\n  </error>'));
                expect(function () { return compileApp(); })
                    .toThrowError(new RegExp("Template parse errors[\\s\\S]*" + ngUrl + "@1:2"));
            });
            it('should use the right source url in template parse errors', function () {
                appDir['app.component.ts'] =
                    createComponentSource(templateDecorator('<div>\n  <div unknown="{{ctxProp}}"></div>'));
                expect(function () { return compileApp(); })
                    .toThrowError(new RegExp("Template parse errors[\\s\\S]*" + ngUrl + "@1:7"));
            });
            it('should create a sourceMap for the template', function () {
                var template = 'Hello World!';
                appDir['app.component.ts'] = createComponentSource(templateDecorator(template));
                var genFile = compileApp();
                var genSource = compiler_1.toTypeScript(genFile);
                var sourceMap = source_map_util_1.extractSourceMap(genSource);
                expect(sourceMap.file).toEqual(genFile.genFileUrl);
                // Note: the generated file also contains code that is not mapped to
                // the template (e.g. import statements, ...)
                var templateIndex = sourceMap.sources.indexOf(ngUrl);
                expect(sourceMap.sourcesContent[templateIndex]).toEqual(template);
                // for the mapping to the original source file we don't store the source code
                // as we want to keep whatever TypeScript / ... produced for them.
                var sourceIndex = sourceMap.sources.indexOf(ngFactoryPath);
                expect(sourceMap.sourcesContent[sourceIndex]).toBe(' ');
            });
            it('should map elements correctly to the source', function () {
                var template = '<div>\n   <span></span></div>';
                appDir['app.component.ts'] = createComponentSource(templateDecorator(template));
                var genFile = compileApp();
                var genSource = compiler_1.toTypeScript(genFile);
                var sourceMap = source_map_util_1.extractSourceMap(genSource);
                expect(source_map_util_1.originalPositionFor(sourceMap, findLineAndColumn(genSource, "'span'")))
                    .toEqual({ line: 2, column: 3, source: ngUrl });
            });
            it('should map bindings correctly to the source', function () {
                var template = "<div>\n   <span [title]=\"someMethod()\"></span></div>";
                appDir['app.component.ts'] = createComponentSource(templateDecorator(template));
                var genFile = compileApp();
                var genSource = compiler_1.toTypeScript(genFile);
                var sourceMap = source_map_util_1.extractSourceMap(genSource);
                expect(source_map_util_1.originalPositionFor(sourceMap, findLineAndColumn(genSource, "someMethod()")))
                    .toEqual({ line: 2, column: 9, source: ngUrl });
            });
            it('should map events correctly to the source', function () {
                var template = "<div>\n   <span (click)=\"someMethod()\"></span></div>";
                appDir['app.component.ts'] = createComponentSource(templateDecorator(template));
                var genFile = compileApp();
                var genSource = compiler_1.toTypeScript(genFile);
                var sourceMap = source_map_util_1.extractSourceMap(genSource);
                expect(source_map_util_1.originalPositionFor(sourceMap, findLineAndColumn(genSource, "someMethod()")))
                    .toEqual({ line: 2, column: 9, source: ngUrl });
            });
            it('should map non template parts to the factory file', function () {
                appDir['app.component.ts'] = createComponentSource(templateDecorator('Hello World!'));
                var genFile = compileApp();
                var genSource = compiler_1.toTypeScript(genFile);
                var sourceMap = source_map_util_1.extractSourceMap(genSource);
                expect(source_map_util_1.originalPositionFor(sourceMap, { line: 1, column: 0 }))
                    .toEqual({ line: 1, column: 0, source: ngFactoryPath });
            });
        }
    });
    describe('errors', function () {
        it('should only warn if not all arguments of an @Injectable class can be resolved', function () {
            var FILES = {
                app: {
                    'app.ts': "\n                import {Injectable} from '@angular/core';\n\n                @Injectable()\n                export class MyService {\n                  constructor(a: boolean) {}\n                }\n              "
                }
            };
            var warnSpy = spyOn(console, 'warn');
            test_util_1.compile([FILES, angularFiles]);
            expect(warnSpy).toHaveBeenCalledWith("Warning: Can't resolve all parameters for MyService in /app/app.ts: (?). This will become an error in Angular v6.x");
        });
        it('should error if not all arguments of an @Injectable class can be resolved if strictInjectionParameters is true', function () {
            var FILES = {
                app: {
                    'app.ts': "\n                import {Injectable} from '@angular/core';\n\n                @Injectable()\n                export class MyService {\n                  constructor(a: boolean) {}\n                }\n              "
                }
            };
            var warnSpy = spyOn(console, 'warn');
            expect(function () { return test_util_1.compile([FILES, angularFiles], { strictInjectionParameters: true }); })
                .toThrowError("Can't resolve all parameters for MyService in /app/app.ts: (?).");
            expect(warnSpy).not.toHaveBeenCalled();
        });
        it('should be able to suppress a null access', function () {
            var FILES = {
                app: {
                    'app.ts': "\n                import {Component, NgModule} from '@angular/core';\n\n                interface Person { name: string; }\n\n                @Component({\n                  selector: 'my-comp',\n                  template: '{{maybe_person!.name}}'\n                })\n                export class MyComp {\n                  maybe_person?: Person;\n                }\n\n                @NgModule({\n                  declarations: [MyComp]\n                })\n                export class MyModule {}\n              "
                }
            };
            test_util_1.compile([FILES, angularFiles], { postCompile: test_util_1.expectNoDiagnostics });
        });
        it('should not contain a self import in factory', function () {
            var FILES = {
                app: {
                    'app.ts': "\n                import {Component, NgModule} from '@angular/core';\n\n                interface Person { name: string; }\n\n                @Component({\n                  selector: 'my-comp',\n                  template: '{{person.name}}'\n                })\n                export class MyComp {\n                  person: Person;\n                }\n\n                @NgModule({\n                  declarations: [MyComp]\n                })\n                export class MyModule {}\n              "
                }
            };
            test_util_1.compile([FILES, angularFiles], {
                postCompile: function (program) {
                    var factorySource = program.getSourceFile('/app/app.ngfactory.ts');
                    expect(factorySource.text).not.toContain('\'/app/app.ngfactory\'');
                }
            });
        });
    });
    it('should report when a component is declared in any module', function () {
        var FILES = {
            app: {
                'app.ts': "\n          import {Component, NgModule} from '@angular/core';\n\n          @Component({selector: 'my-comp', template: ''})\n          export class MyComp {}\n\n          @NgModule({})\n          export class MyModule {}\n        "
            }
        };
        expect(function () { return test_util_1.compile([FILES, angularFiles]); })
            .toThrowError(/Cannot determine the module for class MyComp/);
    });
    it('should add the preamble to generated files', function () {
        var FILES = {
            app: {
                'app.ts': "\n              import { NgModule, Component } from '@angular/core';\n\n              @Component({ template: '' })\n              export class AppComponent {}\n\n              @NgModule({ declarations: [ AppComponent ] })\n              export class AppModule { }\n            "
            }
        };
        var genFilePreamble = '/* Hello world! */';
        var genFiles = test_util_1.compile([FILES, angularFiles]).genFiles;
        var genFile = genFiles.find(function (gf) { return gf.srcFileUrl === '/app/app.ts' && gf.genFileUrl.endsWith('.ts'); });
        var genSource = compiler_1.toTypeScript(genFile, genFilePreamble);
        expect(genSource.startsWith(genFilePreamble)).toBe(true);
    });
    it('should be able to use animation macro methods', function () {
        var FILES = {
            app: {
                'app.ts': "\n      import {Component, NgModule} from '@angular/core';\n      import {trigger, state, style, transition, animate} from '@angular/animations';\n\n      export const EXPANSION_PANEL_ANIMATION_TIMING = '225ms cubic-bezier(0.4,0.0,0.2,1)';\n\n      @Component({\n        selector: 'app-component',\n        template: '<div></div>',\n        animations: [\n          trigger('bodyExpansion', [\n            state('collapsed', style({height: '0px'})),\n            state('expanded', style({height: '*'})),\n            transition('expanded <=> collapsed', animate(EXPANSION_PANEL_ANIMATION_TIMING)),\n          ]),\n          trigger('displayMode', [\n            state('collapsed', style({margin: '0'})),\n            state('default', style({margin: '16px 0'})),\n            state('flat', style({margin: '0'})),\n            transition('flat <=> collapsed, default <=> collapsed, flat <=> default',\n                      animate(EXPANSION_PANEL_ANIMATION_TIMING)),\n          ]),\n        ],\n      })\n      export class AppComponent { }\n\n      @NgModule({ declarations: [ AppComponent ] })\n      export class AppModule { }\n    "
            }
        };
        test_util_1.compile([FILES, angularFiles]);
    });
    it('should detect an entry component via an indirection', function () {
        var FILES = {
            app: {
                'app.ts': "\n          import {NgModule, ANALYZE_FOR_ENTRY_COMPONENTS} from '@angular/core';\n          import {AppComponent} from './app.component';\n          import {COMPONENT_VALUE, MyComponent} from './my-component';\n\n          @NgModule({\n            declarations: [ AppComponent, MyComponent ],\n            bootstrap: [ AppComponent ],\n            providers: [{\n              provide: ANALYZE_FOR_ENTRY_COMPONENTS,\n              multi: true,\n              useValue: COMPONENT_VALUE\n            }],\n          })\n          export class AppModule { }\n        ",
                'app.component.ts': "\n          import {Component} from '@angular/core';\n\n          @Component({\n            selector: 'app-component',\n            template: '<div></div>',\n          })\n          export class AppComponent { }\n        ",
                'my-component.ts': "\n          import {Component} from '@angular/core';\n\n          @Component({\n            selector: 'my-component',\n            template: '<div></div>',\n          })\n          export class MyComponent {}\n\n          export const COMPONENT_VALUE = [{a: 'b', component: MyComponent}];\n        "
            }
        };
        var result = test_util_1.compile([FILES, angularFiles]);
        var appModuleFactory = result.genFiles.find(function (f) { return /my-component\.ngfactory/.test(f.genFileUrl); });
        expect(appModuleFactory).toBeDefined();
        if (appModuleFactory) {
            expect(compiler_1.toTypeScript(appModuleFactory)).toContain('MyComponentNgFactory');
        }
    });
    describe('ComponentFactories', function () {
        it('should include inputs, outputs and ng-content selectors in the component factory', function () {
            var FILES = {
                app: {
                    'app.ts': "\n                import {Component, NgModule, Input, Output} from '@angular/core';\n\n                @Component({\n                  selector: 'my-comp',\n                  template: '<ng-content></ng-content><ng-content select=\"child\"></ng-content>'\n                })\n                export class MyComp {\n                  @Input('aInputName')\n                  aInputProp: string;\n\n                  @Output('aOutputName')\n                  aOutputProp: any;\n                }\n\n                @NgModule({\n                  declarations: [MyComp]\n                })\n                export class MyModule {}\n              "
                }
            };
            var genFiles = test_util_1.compile([FILES, angularFiles]).genFiles;
            var genFile = genFiles.find(function (genFile) { return genFile.srcFileUrl === '/app/app.ts'; });
            var genSource = compiler_1.toTypeScript(genFile);
            var createComponentFactoryCall = /ɵccf\([^)]*\)/m.exec(genSource)[0].replace(/\s*/g, '');
            // selector
            expect(createComponentFactoryCall).toContain('my-comp');
            // inputs
            expect(createComponentFactoryCall).toContain("{aInputProp:'aInputName'}");
            // outputs
            expect(createComponentFactoryCall).toContain("{aOutputProp:'aOutputName'}");
            // ngContentSelectors
            expect(createComponentFactoryCall).toContain("['*','child']");
        });
    });
    describe('generated templates', function () {
        it('should not call `check` for directives without bindings nor ngDoCheck/ngOnInit', function () {
            var FILES = {
                app: {
                    'app.ts': "\n                import { NgModule, Component } from '@angular/core';\n\n                @Component({ template: '' })\n                export class AppComponent {}\n\n                @NgModule({ declarations: [ AppComponent ] })\n                export class AppModule { }\n              "
                }
            };
            var genFiles = test_util_1.compile([FILES, angularFiles]).genFiles;
            var genFile = genFiles.find(function (gf) { return gf.srcFileUrl === '/app/app.ts' && gf.genFileUrl.endsWith('.ts'); });
            var genSource = compiler_1.toTypeScript(genFile);
            expect(genSource).not.toContain('check(');
        });
    });
    describe('summaries', function () {
        var angularSummaryFiles;
        beforeAll(function () {
            angularSummaryFiles = test_util_1.compile(angularFiles, { useSummaries: false, emit: true }).outDir;
        });
        inheritanceWithSummariesSpecs(function () { return angularSummaryFiles; });
        it('should not reexport type symbols mentioned in constructors', function () {
            var libInput = {
                'lib': {
                    'base.ts': "\n            export class AValue {}\n            export type AType = {};\n\n            export class AClass {\n              constructor(a: AType, b: AValue) {}\n            }\n          "
                }
            };
            var appInput = {
                'app': {
                    'main.ts': "\n            export {AClass} from '../lib/base';\n          "
                }
            };
            var libOutDir = test_util_1.compile([libInput, angularSummaryFiles], { useSummaries: true }).outDir;
            var appGenFiles = test_util_1.compile([appInput, libOutDir, angularSummaryFiles], { useSummaries: true }).genFiles;
            var appNgFactory = appGenFiles.find(function (f) { return f.genFileUrl === '/app/main.ngfactory.ts'; });
            var appNgFactoryTs = compiler_1.toTypeScript(appNgFactory);
            expect(appNgFactoryTs).not.toContain('AType');
            expect(appNgFactoryTs).toContain('AValue');
        });
        it('should not reexport complex function calls', function () {
            var libInput = {
                'lib': {
                    'base.ts': "\n            export class AClass {\n              constructor(arg: any) {}\n\n              static create(arg: any = null): AClass { return new AClass(arg); }\n\n              call(arg: any) {}\n            }\n\n            export function simple(arg: any) { return [arg]; }\n\n            export const ctor_arg = {};\n            export const ctor_call = new AClass(ctor_arg);\n\n            export const static_arg = {};\n            export const static_call = AClass.create(static_arg);\n\n            export const complex_arg = {};\n            export const complex_call = AClass.create().call(complex_arg);\n\n            export const simple_arg = {};\n            export const simple_call = simple(simple_arg);\n          "
                }
            };
            var appInput = {
                'app': {
                    'main.ts': "\n            import {ctor_call, static_call, complex_call, simple_call} from '../lib/base';\n\n            export const calls = [ctor_call, static_call, complex_call, simple_call];\n          ",
                }
            };
            var libOutDir = test_util_1.compile([libInput, angularSummaryFiles], { useSummaries: true }).outDir;
            var appGenFiles = test_util_1.compile([appInput, libOutDir, angularSummaryFiles], { useSummaries: true }).genFiles;
            var appNgFactory = appGenFiles.find(function (f) { return f.genFileUrl === '/app/main.ngfactory.ts'; });
            var appNgFactoryTs = compiler_1.toTypeScript(appNgFactory);
            // metadata of ctor calls is preserved, so we reexport the argument
            expect(appNgFactoryTs).toContain('ctor_arg');
            expect(appNgFactoryTs).toContain('ctor_call');
            // metadata of static calls is preserved, so we reexport the argument
            expect(appNgFactoryTs).toContain('static_arg');
            expect(appNgFactoryTs).toContain('AClass');
            expect(appNgFactoryTs).toContain('static_call');
            // metadata of complex calls is elided, so we don't reexport the argument
            expect(appNgFactoryTs).not.toContain('complex_arg');
            expect(appNgFactoryTs).toContain('complex_call');
            // metadata of simple calls is preserved, so we reexport the argument
            expect(appNgFactoryTs).toContain('simple_arg');
            expect(appNgFactoryTs).toContain('simple_call');
        });
        it('should not reexport already exported symbols except for lowered symbols', function () {
            var libInput = {
                'lib': {
                    'base.ts': "\n            export const exportedVar = 1;\n\n            // A symbol introduced by lowering expressions\n            export const \u02751 = 'lowered symbol';\n          "
                }
            };
            var appInput = {
                'app': {
                    'main.ts': "export * from '../lib/base';",
                }
            };
            var libOutDir = test_util_1.compile([libInput, angularSummaryFiles], { useSummaries: true }).outDir;
            var appGenFiles = test_util_1.compile([appInput, libOutDir, angularSummaryFiles], { useSummaries: true }).genFiles;
            var appNgFactory = appGenFiles.find(function (f) { return f.genFileUrl === '/app/main.ngfactory.ts'; });
            var appNgFactoryTs = compiler_1.toTypeScript(appNgFactory);
            // we don't need to reexport exported symbols via the .ngfactory
            // as we can refer to them via the reexport.
            expect(appNgFactoryTs).not.toContain('exportedVar');
            // although ɵ1 is reexported via `export *`, we still need to reexport it
            // via the .ngfactory as tsickle expands `export *` into named exports,
            // and doesn't know about our lowered symbols as we introduce them
            // after the typecheck phase.
            expect(appNgFactoryTs).toContain('ɵ1');
        });
    });
    function inheritanceWithSummariesSpecs(getAngularSummaryFiles) {
        function compileParentAndChild(_a) {
            var parentClassDecorator = _a.parentClassDecorator, parentModuleDecorator = _a.parentModuleDecorator, childClassDecorator = _a.childClassDecorator, childModuleDecorator = _a.childModuleDecorator;
            var libInput = {
                'lib': {
                    'base.ts': "\n              import {Injectable, Pipe, Directive, Component, NgModule} from '@angular/core';\n\n              " + parentClassDecorator + "\n              export class Base {}\n\n              " + parentModuleDecorator + "\n              export class BaseModule {}\n            "
                }
            };
            var appInput = {
                'app': {
                    'main.ts': "\n              import {Injectable, Pipe, Directive, Component, NgModule} from '@angular/core';\n              import {Base} from '../lib/base';\n\n              " + childClassDecorator + "\n              export class Extends extends Base {}\n\n              " + childModuleDecorator + "\n              export class MyModule {}\n            "
                }
            };
            var libOutDir = test_util_1.compile([libInput, getAngularSummaryFiles()], { useSummaries: true }).outDir;
            var genFiles = test_util_1.compile([libOutDir, appInput, getAngularSummaryFiles()], { useSummaries: true }).genFiles;
            return genFiles.find(function (gf) { return gf.srcFileUrl === '/app/main.ts'; });
        }
        it('should inherit ctor and lifecycle hooks from classes in other compilation units', function () {
            var libInput = {
                'lib': {
                    'base.ts': "\n            export class AParam {}\n\n            export class Base {\n              constructor(a: AParam) {}\n              ngOnDestroy() {}\n            }\n          "
                }
            };
            var appInput = {
                'app': {
                    'main.ts': "\n            import {NgModule, Component} from '@angular/core';\n            import {Base} from '../lib/base';\n\n            @Component({template: ''})\n            export class Extends extends Base {}\n\n            @NgModule({\n              declarations: [Extends]\n            })\n            export class MyModule {}\n          "
                }
            };
            var libOutDir = test_util_1.compile([libInput, getAngularSummaryFiles()], { useSummaries: true }).outDir;
            var genFiles = test_util_1.compile([libOutDir, appInput, getAngularSummaryFiles()], { useSummaries: true }).genFiles;
            var mainNgFactory = genFiles.find(function (gf) { return gf.srcFileUrl === '/app/main.ts'; });
            var flags = 16384 /* TypeDirective */ | 32768 /* Component */ | 131072 /* OnDestroy */;
            expect(compiler_1.toTypeScript(mainNgFactory))
                .toContain(flags + ",(null as any),0,i1.Extends,[i2.AParam]");
        });
        it('should inherit ctor and lifecycle hooks from classes in other compilation units over 2 levels', function () {
            var lib1Input = {
                'lib1': {
                    'base.ts': "\n            export class AParam {}\n\n            export class Base {\n              constructor(a: AParam) {}\n              ngOnDestroy() {}\n            }\n          "
                }
            };
            var lib2Input = {
                'lib2': {
                    'middle.ts': "\n            import {Base} from '../lib1/base';\n            export class Middle extends Base {}\n          "
                }
            };
            var appInput = {
                'app': {
                    'main.ts': "\n            import {NgModule, Component} from '@angular/core';\n            import {Middle} from '../lib2/middle';\n\n            @Component({template: ''})\n            export class Extends extends Middle {}\n\n            @NgModule({\n              declarations: [Extends]\n            })\n            export class MyModule {}\n          "
                }
            };
            var lib1OutDir = test_util_1.compile([lib1Input, getAngularSummaryFiles()], { useSummaries: true }).outDir;
            var lib2OutDir = test_util_1.compile([lib1OutDir, lib2Input, getAngularSummaryFiles()], { useSummaries: true }).outDir;
            var genFiles = test_util_1.compile([lib2OutDir, appInput, getAngularSummaryFiles()], { useSummaries: true }).genFiles;
            var mainNgFactory = genFiles.find(function (gf) { return gf.srcFileUrl === '/app/main.ts'; });
            var flags = 16384 /* TypeDirective */ | 32768 /* Component */ | 131072 /* OnDestroy */;
            expect(compiler_1.toTypeScript(mainNgFactory))
                .toContain(flags + ",(null as any),0,i1.Extends,[i2.AParam_2]");
        });
        describe('Injectable', function () {
            it('should allow to inherit', function () {
                var mainNgFactory = compileParentAndChild({
                    parentClassDecorator: '@Injectable()',
                    parentModuleDecorator: '@NgModule({providers: [Base]})',
                    childClassDecorator: '@Injectable()',
                    childModuleDecorator: '@NgModule({providers: [Extends]})',
                });
                expect(mainNgFactory).toBeTruthy();
            });
            it('should error if the child class has no matching decorator', function () {
                expect(function () { return compileParentAndChild({
                    parentClassDecorator: '@Injectable()',
                    parentModuleDecorator: '@NgModule({providers: [Base]})',
                    childClassDecorator: '',
                    childModuleDecorator: '@NgModule({providers: [Extends]})',
                }); })
                    .toThrowError("Error during template compile of 'Extends'\n  Class Extends in /app/main.ts extends from a Injectable in another compilation unit without duplicating the decorator\n    Please add a Injectable or Pipe or Directive or Component or NgModule decorator to the class.");
            });
        });
        describe('Component', function () {
            it('should allow to inherit', function () {
                var mainNgFactory = compileParentAndChild({
                    parentClassDecorator: "@Component({template: ''})",
                    parentModuleDecorator: '@NgModule({declarations: [Base]})',
                    childClassDecorator: "@Component({template: ''})",
                    childModuleDecorator: '@NgModule({declarations: [Extends]})'
                });
                expect(mainNgFactory).toBeTruthy();
            });
            it('should error if the child class has no matching decorator', function () {
                expect(function () { return compileParentAndChild({
                    parentClassDecorator: "@Component({template: ''})",
                    parentModuleDecorator: '@NgModule({declarations: [Base]})',
                    childClassDecorator: '',
                    childModuleDecorator: '@NgModule({declarations: [Extends]})',
                }); })
                    .toThrowError("Error during template compile of 'Extends'\n  Class Extends in /app/main.ts extends from a Directive in another compilation unit without duplicating the decorator\n    Please add a Directive or Component decorator to the class.");
            });
        });
        describe('Directive', function () {
            it('should allow to inherit', function () {
                var mainNgFactory = compileParentAndChild({
                    parentClassDecorator: "@Directive({selector: '[someDir]'})",
                    parentModuleDecorator: '@NgModule({declarations: [Base]})',
                    childClassDecorator: "@Directive({selector: '[someDir]'})",
                    childModuleDecorator: '@NgModule({declarations: [Extends]})',
                });
                expect(mainNgFactory).toBeTruthy();
            });
            it('should error if the child class has no matching decorator', function () {
                expect(function () { return compileParentAndChild({
                    parentClassDecorator: "@Directive({selector: '[someDir]'})",
                    parentModuleDecorator: '@NgModule({declarations: [Base]})',
                    childClassDecorator: '',
                    childModuleDecorator: '@NgModule({declarations: [Extends]})',
                }); })
                    .toThrowError("Error during template compile of 'Extends'\n  Class Extends in /app/main.ts extends from a Directive in another compilation unit without duplicating the decorator\n    Please add a Directive or Component decorator to the class.");
            });
        });
        describe('Pipe', function () {
            it('should allow to inherit', function () {
                var mainNgFactory = compileParentAndChild({
                    parentClassDecorator: "@Pipe({name: 'somePipe'})",
                    parentModuleDecorator: '@NgModule({declarations: [Base]})',
                    childClassDecorator: "@Pipe({name: 'somePipe'})",
                    childModuleDecorator: '@NgModule({declarations: [Extends]})',
                });
                expect(mainNgFactory).toBeTruthy();
            });
            it('should error if the child class has no matching decorator', function () {
                expect(function () { return compileParentAndChild({
                    parentClassDecorator: "@Pipe({name: 'somePipe'})",
                    parentModuleDecorator: '@NgModule({declarations: [Base]})',
                    childClassDecorator: '',
                    childModuleDecorator: '@NgModule({declarations: [Extends]})',
                }); })
                    .toThrowError("Error during template compile of 'Extends'\n  Class Extends in /app/main.ts extends from a Pipe in another compilation unit without duplicating the decorator\n    Please add a Pipe decorator to the class.");
            });
        });
        describe('NgModule', function () {
            it('should allow to inherit', function () {
                var mainNgFactory = compileParentAndChild({
                    parentClassDecorator: "@NgModule()",
                    parentModuleDecorator: '',
                    childClassDecorator: "@NgModule()",
                    childModuleDecorator: '',
                });
                expect(mainNgFactory).toBeTruthy();
            });
            it('should error if the child class has no matching decorator', function () {
                expect(function () { return compileParentAndChild({
                    parentClassDecorator: "@NgModule()",
                    parentModuleDecorator: '',
                    childClassDecorator: '',
                    childModuleDecorator: '',
                }); })
                    .toThrowError("Error during template compile of 'Extends'\n  Class Extends in /app/main.ts extends from a NgModule in another compilation unit without duplicating the decorator\n    Please add a NgModule decorator to the class.");
            });
        });
    }
});
describe('compiler (bundled Angular)', function () {
    var angularFiles = test_util_1.setup();
    beforeAll(function () {
        if (!test_util_1.isInBazel()) {
            // If we are not using Bazel then we need to build these files explicitly
            var emittingHost = new test_util_1.EmittingCompilerHost(['@angular/core/index'], { emitMetadata: false });
            // Create the metadata bundled
            var indexModule = emittingHost.effectiveName('@angular/core/index');
            var bundler = new bundler_1.MetadataBundler(indexModule, '@angular/core', new test_util_1.MockMetadataBundlerHost(emittingHost));
            var bundle = bundler.getMetadataBundle();
            var metadata = JSON.stringify(bundle.metadata, null, ' ');
            var bundleIndexSource = index_writer_1.privateEntriesToIndex('./index', bundle.privates);
            emittingHost.override('@angular/core/bundle_index.ts', bundleIndexSource);
            emittingHost.addWrittenFile('@angular/core/package.json', JSON.stringify({ typings: 'bundle_index.d.ts' }));
            emittingHost.addWrittenFile('@angular/core/bundle_index.metadata.json', metadata);
            // Emit the sources
            var bundleIndexName = emittingHost.effectiveName('@angular/core/bundle_index.ts');
            var emittingProgram = ts.createProgram([bundleIndexName], test_util_1.settings, emittingHost);
            emittingProgram.emit();
            angularFiles = emittingHost.writtenAngularFiles();
        }
    });
    describe('Quickstart', function () {
        it('should compile', function () {
            var genFiles = test_util_1.compile([QUICKSTART, angularFiles]).genFiles;
            expect(genFiles.find(function (f) { return /app\.component\.ngfactory\.ts/.test(f.genFileUrl); })).toBeDefined();
            expect(genFiles.find(function (f) { return /app\.module\.ngfactory\.ts/.test(f.genFileUrl); })).toBeDefined();
        });
        it('should support tsx', function () {
            var tsOptions = { jsx: ts.JsxEmit.React };
            var genFiles = test_util_1.compile([QUICKSTART_TSX, angularFiles], /* options */ undefined, tsOptions).genFiles;
            expect(genFiles.find(function (f) { return /app\.component\.ngfactory\.ts/.test(f.genFileUrl); })).toBeDefined();
            expect(genFiles.find(function (f) { return /app\.module\.ngfactory\.ts/.test(f.genFileUrl); })).toBeDefined();
        });
    });
    describe('Bundled library', function () {
        var libraryFiles;
        beforeAll(function () {
            // Emit the library bundle
            var emittingHost = new test_util_1.EmittingCompilerHost(['/bolder/index.ts'], { emitMetadata: false, mockData: LIBRARY });
            if (test_util_1.isInBazel()) {
                // In bazel we can just add the angular files from the ones read during setup.
                emittingHost.addFiles(angularFiles);
            }
            // Create the metadata bundled
            var indexModule = '/bolder/public-api';
            var bundler = new bundler_1.MetadataBundler(indexModule, 'bolder', new test_util_1.MockMetadataBundlerHost(emittingHost));
            var bundle = bundler.getMetadataBundle();
            var metadata = JSON.stringify(bundle.metadata, null, ' ');
            var bundleIndexSource = index_writer_1.privateEntriesToIndex('./public-api', bundle.privates);
            emittingHost.override('/bolder/index.ts', bundleIndexSource);
            emittingHost.addWrittenFile('/bolder/index.metadata.json', metadata);
            // Emit the sources
            var emittingProgram = ts.createProgram(['/bolder/index.ts'], test_util_1.settings, emittingHost);
            emittingProgram.emit();
            var libFiles = emittingHost.written;
            // Copy the .html file
            var htmlFileName = '/bolder/src/bolder.component.html';
            libFiles.set(htmlFileName, emittingHost.readFile(htmlFileName));
            libraryFiles = test_util_1.arrayToMockDir(test_util_1.toMockFileArray(libFiles).map(function (_a) {
                var fileName = _a.fileName, content = _a.content;
                return ({ fileName: "/node_modules" + fileName, content: content });
            }));
        });
        it('should compile', function () { return test_util_1.compile([LIBRARY_USING_APP, libraryFiles, angularFiles]); });
    });
});
var QUICKSTART = {
    quickstart: {
        app: {
            'app.component.ts': "\n        import {Component} from '@angular/core';\n\n        @Component({\n          template: '<h1>Hello {{name}}</h1>'\n        })\n        export class AppComponent {\n          name = 'Angular';\n        }\n      ",
            'app.module.ts': "\n        import { NgModule }      from '@angular/core';\n        import { toString }      from './utils';\n\n        import { AppComponent }  from './app.component';\n\n        @NgModule({\n          declarations: [ AppComponent ],\n          bootstrap:    [ AppComponent ]\n        })\n        export class AppModule { }\n      ",
            // #15420
            'utils.ts': "\n        export function toString(value: any): string {\n          return  '';\n        }\n      "
        }
    }
};
var QUICKSTART_TSX = {
    quickstart: {
        app: {
            // #20555
            'app.component.tsx': "\n        import {Component} from '@angular/core';\n\n        @Component({\n          template: '<h1>Hello {{name}}</h1>'\n        })\n        export class AppComponent {\n          name = 'Angular';\n        }\n      ",
            'app.module.ts': "\n        import { NgModule }      from '@angular/core';\n        import { AppComponent }  from './app.component';\n\n        @NgModule({\n          declarations: [ AppComponent ],\n          bootstrap:    [ AppComponent ]\n        })\n        export class AppModule { }\n      "
        }
    }
};
var LIBRARY = {
    bolder: {
        'public-api.ts': "\n      export * from './src/bolder.component';\n      export * from './src/bolder.module';\n      export {BolderModule as ReExportedModule} from './src/bolder.module';\n    ",
        src: {
            'bolder.component.ts': "\n        import {Component, Input} from '@angular/core';\n\n        @Component({\n          selector: 'bolder',\n          templateUrl: './bolder.component.html'\n        })\n        export class BolderComponent {\n          @Input() data: string;\n        }\n      ",
            'bolder.component.html': "\n        <b>{{data}}</b>\n      ",
            'bolder.module.ts': "\n        import {NgModule} from '@angular/core';\n        import {BolderComponent} from './bolder.component';\n\n        @NgModule({\n          declarations: [BolderComponent],\n          exports: [BolderComponent]\n        })\n        export class BolderModule {}\n      "
        }
    }
};
var LIBRARY_USING_APP = {
    'lib-user': {
        app: {
            'app.component.ts': "\n        import {Component} from '@angular/core';\n\n        @Component({\n          template: '<h1>Hello <bolder [data]=\"name\"></bolder></h1>'\n        })\n        export class AppComponent {\n          name = 'Angular';\n        }\n      ",
            'app.module.ts': "\n        import { NgModule }      from '@angular/core';\n        import { BolderModule }  from 'bolder';\n\n        import { AppComponent }  from './app.component';\n\n        @NgModule({\n          declarations: [ AppComponent ],\n          bootstrap:    [ AppComponent ],\n          imports:      [ BolderModule ]\n        })\n        export class AppModule { }\n      "
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXJfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3Rlc3QvYW90L2NvbXBpbGVyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw4Q0FBMkg7QUFDM0gsc0VBQTJFO0FBQzNFLGdGQUFzRjtBQUN0Rix3RkFBMkc7QUFFM0csK0JBQWlDO0FBRWpDLHlDQUEyTjtBQUUzTixRQUFRLENBQUMsOEJBQThCLEVBQUU7SUFDdkMsSUFBSSxZQUFZLEdBQUcsaUJBQUssRUFBRSxDQUFDO0lBRTNCLFFBQVEsQ0FBQyxZQUFZLEVBQUU7UUFDckIsRUFBRSxDQUFDLGdCQUFnQixFQUFFO1lBQ1osSUFBQSxtRUFBUSxDQUF3QztZQUN2RCxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLCtCQUErQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQWxELENBQWtELENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQzdGLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsNEJBQTRCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBL0MsQ0FBK0MsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDNUYsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxvQkFBb0IsRUFBRTtRQUM3QixJQUFNLGFBQWEsR0FBRyx1QkFBdUIsQ0FBQztRQUM5QyxJQUFNLGFBQWEsR0FBRyxpQ0FBaUMsQ0FBQztRQUV4RCxJQUFJLE9BQXNCLENBQUM7UUFDM0IsSUFBSSxNQUFxQixDQUFDO1FBRTFCLFVBQVUsQ0FBQztZQUNULE1BQU0sR0FBRztnQkFDUCxlQUFlLEVBQUUsMFVBVVo7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