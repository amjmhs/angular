"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var lifecycle_reflector_1 = require("@angular/compiler/src/lifecycle_reflector");
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var compile_metadata_1 = require("../src/compile_metadata");
var metadata_resolver_1 = require("../src/metadata_resolver");
var resource_loader_1 = require("../src/resource_loader");
var metadata_resolver_fixture_1 = require("./metadata_resolver_fixture");
var test_bindings_1 = require("./test_bindings");
{
    describe('CompileMetadataResolver', function () {
        beforeEach(function () { testing_1.TestBed.configureCompiler({ providers: test_bindings_1.TEST_COMPILER_PROVIDERS }); });
        it('should throw on the getDirectiveMetadata/getPipeMetadata methods if the module has not been loaded yet', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var SomeModule = /** @class */ (function () {
                function SomeModule() {
                }
                SomeModule = __decorate([
                    core_1.NgModule({})
                ], SomeModule);
                return SomeModule;
            }());
            var SomePipe = /** @class */ (function () {
                function SomePipe() {
                }
                SomePipe = __decorate([
                    core_1.Pipe({ name: 'pipe' })
                ], SomePipe);
                return SomePipe;
            }());
            expect(function () { return resolver.getDirectiveMetadata(ComponentWithEverythingInline); })
                .toThrowError(/Illegal state/);
            expect(function () { return resolver.getPipeMetadata(SomePipe); }).toThrowError(/Illegal state/);
        }));
        it('should read metadata in sync for components with inline resources', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var SomeModule = /** @class */ (function () {
                function SomeModule() {
                }
                SomeModule = __decorate([
                    core_1.NgModule({ declarations: [ComponentWithEverythingInline] })
                ], SomeModule);
                return SomeModule;
            }());
            resolver.loadNgModuleDirectiveAndPipeMetadata(SomeModule, true);
            var meta = resolver.getDirectiveMetadata(ComponentWithEverythingInline);
            expect(meta.selector).toEqual('someSelector');
            expect(meta.exportAs).toEqual('someExportAs');
            expect(meta.isComponent).toBe(true);
            expect(meta.type.reference).toBe(ComponentWithEverythingInline);
            expect(compile_metadata_1.identifierName(meta.type)).toEqual(core_1.ɵstringify(ComponentWithEverythingInline));
            expect(meta.type.lifecycleHooks).toEqual(lifecycle_reflector_1.LIFECYCLE_HOOKS_VALUES);
            expect(meta.changeDetection).toBe(core_1.ChangeDetectionStrategy.Default);
            expect(meta.inputs).toEqual({ 'someProp': 'someProp' });
            expect(meta.outputs).toEqual({ 'someEvent': 'someEvent' });
            expect(meta.hostListeners).toEqual({ 'someHostListener': 'someHostListenerExpr' });
            expect(meta.hostProperties).toEqual({ 'someHostProp': 'someHostPropExpr' });
            expect(meta.hostAttributes).toEqual({ 'someHostAttr': 'someHostAttrValue' });
            expect(meta.template.encapsulation).toBe(core_1.ViewEncapsulation.Emulated);
            expect(meta.template.styles).toEqual(['someStyle']);
            expect(meta.template.template).toEqual('someTemplate');
            expect(meta.template.interpolation).toEqual(['{{', '}}']);
        }));
        it('should throw when reading metadata for component with external resources when sync=true is passed', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var SomeModule = /** @class */ (function () {
                function SomeModule() {
                }
                SomeModule = __decorate([
                    core_1.NgModule({ declarations: [ComponentWithExternalResources] })
                ], SomeModule);
                return SomeModule;
            }());
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(SomeModule, true); })
                .toThrowError("Can't compile synchronously as " + core_1.ɵstringify(ComponentWithExternalResources) + " is still being loaded!");
        }));
        it('should read external metadata when sync=false', testing_1.async(testing_1.inject([metadata_resolver_1.CompileMetadataResolver, resource_loader_1.ResourceLoader], function (resolver, resourceLoader) {
            var SomeModule = /** @class */ (function () {
                function SomeModule() {
                }
                SomeModule = __decorate([
                    core_1.NgModule({ declarations: [ComponentWithExternalResources] })
                ], SomeModule);
                return SomeModule;
            }());
            resourceLoader.when('someTemplateUrl', 'someTemplate');
            resolver.loadNgModuleDirectiveAndPipeMetadata(SomeModule, false).then(function () {
                var meta = resolver.getDirectiveMetadata(ComponentWithExternalResources);
                expect(meta.selector).toEqual('someSelector');
                expect(meta.template.styleUrls).toEqual(['someStyleUrl']);
                expect(meta.template.templateUrl).toEqual('someTemplateUrl');
                expect(meta.template.template).toEqual('someTemplate');
            });
            resourceLoader.flush();
        })));
        it('should use `./` as base url for templates during runtime compilation if no moduleId is given', testing_1.async(testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var ComponentWithoutModuleId = /** @class */ (function () {
                function ComponentWithoutModuleId() {
                }
                ComponentWithoutModuleId = __decorate([
                    core_1.Component({ selector: 'someComponent', templateUrl: 'someUrl' })
                ], ComponentWithoutModuleId);
                return ComponentWithoutModuleId;
            }());
            var SomeModule = /** @class */ (function () {
                function SomeModule() {
                }
                SomeModule = __decorate([
                    core_1.NgModule({ declarations: [ComponentWithoutModuleId] })
                ], SomeModule);
                return SomeModule;
            }());
            resolver.loadNgModuleDirectiveAndPipeMetadata(SomeModule, false).then(function () {
                var value = resolver.getDirectiveMetadata(ComponentWithoutModuleId).template.templateUrl;
                var expectedEndValue = './someUrl';
                expect(value.endsWith(expectedEndValue)).toBe(true);
            });
        })));
        it('should throw when the moduleId is not a string', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var SomeModule = /** @class */ (function () {
                function SomeModule() {
                }
                SomeModule = __decorate([
                    core_1.NgModule({ declarations: [ComponentWithInvalidModuleId] })
                ], SomeModule);
                return SomeModule;
            }());
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(SomeModule, true); })
                .toThrowError("moduleId should be a string in \"ComponentWithInvalidModuleId\". See" +
                " https://goo.gl/wIDDiL for more information.\n" +
                "If you're using Webpack you should inline the template and the styles, see" +
                " https://goo.gl/X2J8zc.");
        }));
        it('should throw when metadata is incorrectly typed', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var SomeModule = /** @class */ (function () {
                function SomeModule() {
                }
                SomeModule = __decorate([
                    core_1.NgModule({ declarations: [metadata_resolver_fixture_1.MalformedStylesComponent] })
                ], SomeModule);
                return SomeModule;
            }());
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(SomeModule, true); })
                .toThrowError("Expected 'styles' to be an array of strings.");
        }));
        it('should throw with descriptive error message when a module imports itself', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var SomeModule = /** @class */ (function () {
                function SomeModule() {
                }
                SomeModule_1 = SomeModule;
                var SomeModule_1;
                SomeModule = SomeModule_1 = __decorate([
                    core_1.NgModule({ imports: [SomeModule_1] })
                ], SomeModule);
                return SomeModule;
            }());
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(SomeModule, true); })
                .toThrowError("'SomeModule' module can't import itself");
        }));
        it('should throw with descriptive error message when provider token can not be resolved', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var SomeModule = /** @class */ (function () {
                function SomeModule() {
                }
                SomeModule = __decorate([
                    core_1.NgModule({ declarations: [MyBrokenComp1] })
                ], SomeModule);
                return SomeModule;
            }());
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(SomeModule, true); })
                .toThrowError("Can't resolve all parameters for MyBrokenComp1: (?).");
        }));
        it('should throw with descriptive error message when a directive is passed to imports', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var ModuleWithImportedComponent = /** @class */ (function () {
                function ModuleWithImportedComponent() {
                }
                ModuleWithImportedComponent = __decorate([
                    core_1.NgModule({ imports: [ComponentWithoutModuleId] })
                ], ModuleWithImportedComponent);
                return ModuleWithImportedComponent;
            }());
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(ModuleWithImportedComponent, true); })
                .toThrowError("Unexpected directive 'ComponentWithoutModuleId' imported by the module 'ModuleWithImportedComponent'. Please add a @NgModule annotation.");
        }));
        it('should throw with descriptive error message when a pipe is passed to imports', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var SomePipe = /** @class */ (function () {
                function SomePipe() {
                }
                SomePipe = __decorate([
                    core_1.Pipe({ name: 'somePipe' })
                ], SomePipe);
                return SomePipe;
            }());
            var ModuleWithImportedPipe = /** @class */ (function () {
                function ModuleWithImportedPipe() {
                }
                ModuleWithImportedPipe = __decorate([
                    core_1.NgModule({ imports: [SomePipe] })
                ], ModuleWithImportedPipe);
                return ModuleWithImportedPipe;
            }());
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(ModuleWithImportedPipe, true); })
                .toThrowError("Unexpected pipe 'SomePipe' imported by the module 'ModuleWithImportedPipe'. Please add a @NgModule annotation.");
        }));
        it('should throw with descriptive error message when a module is passed to declarations', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var SomeModule = /** @class */ (function () {
                function SomeModule() {
                }
                SomeModule = __decorate([
                    core_1.NgModule({})
                ], SomeModule);
                return SomeModule;
            }());
            var ModuleWithDeclaredModule = /** @class */ (function () {
                function ModuleWithDeclaredModule() {
                }
                ModuleWithDeclaredModule = __decorate([
                    core_1.NgModule({ declarations: [SomeModule] })
                ], ModuleWithDeclaredModule);
                return ModuleWithDeclaredModule;
            }());
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(ModuleWithDeclaredModule, true); })
                .toThrowError("Unexpected module 'SomeModule' declared by the module 'ModuleWithDeclaredModule'. Please add a @Pipe/@Directive/@Component annotation.");
        }));
        it('should throw with descriptive error message when a declared pipe is missing annotation', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var SomePipe = /** @class */ (function () {
                function SomePipe() {
                }
                return SomePipe;
            }());
            var ModuleWithDeclaredModule = /** @class */ (function () {
                function ModuleWithDeclaredModule() {
                }
                ModuleWithDeclaredModule = __decorate([
                    core_1.NgModule({ declarations: [SomePipe] })
                ], ModuleWithDeclaredModule);
                return ModuleWithDeclaredModule;
            }());
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(ModuleWithDeclaredModule, true); })
                .toThrowError("Unexpected value 'SomePipe' declared by the module 'ModuleWithDeclaredModule'. Please add a @Pipe/@Directive/@Component annotation.");
        }));
        it('should throw with descriptive error message when an imported module is missing annotation', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var SomeModule = /** @class */ (function () {
                function SomeModule() {
                }
                return SomeModule;
            }());
            var ModuleWithImportedModule = /** @class */ (function () {
                function ModuleWithImportedModule() {
                }
                ModuleWithImportedModule = __decorate([
                    core_1.NgModule({ imports: [SomeModule] })
                ], ModuleWithImportedModule);
                return ModuleWithImportedModule;
            }());
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(ModuleWithImportedModule, true); })
                .toThrowError("Unexpected value 'SomeModule' imported by the module 'ModuleWithImportedModule'. Please add a @NgModule annotation.");
        }));
        it('should throw with descriptive error message when null is passed to declarations', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var ModuleWithNullDeclared = /** @class */ (function () {
                function ModuleWithNullDeclared() {
                }
                ModuleWithNullDeclared = __decorate([
                    core_1.NgModule({ declarations: [null] })
                ], ModuleWithNullDeclared);
                return ModuleWithNullDeclared;
            }());
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(ModuleWithNullDeclared, true); })
                .toThrowError("Unexpected value 'null' declared by the module 'ModuleWithNullDeclared'");
        }));
        it('should throw with descriptive error message when null is passed to imports', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var ModuleWithNullImported = /** @class */ (function () {
                function ModuleWithNullImported() {
                }
                ModuleWithNullImported = __decorate([
                    core_1.NgModule({ imports: [null] })
                ], ModuleWithNullImported);
                return ModuleWithNullImported;
            }());
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(ModuleWithNullImported, true); })
                .toThrowError("Unexpected value 'null' imported by the module 'ModuleWithNullImported'");
        }));
        it('should throw with descriptive error message when a param token of a dependency is undefined', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var SomeModule = /** @class */ (function () {
                function SomeModule() {
                }
                SomeModule = __decorate([
                    core_1.NgModule({ declarations: [MyBrokenComp2] })
                ], SomeModule);
                return SomeModule;
            }());
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(SomeModule, true); })
                .toThrowError("Can't resolve all parameters for NonAnnotatedService: (?).");
        }));
        it('should throw with descriptive error message when encounter invalid provider', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var SomeModule = /** @class */ (function () {
                function SomeModule() {
                }
                SomeModule = __decorate([
                    core_1.NgModule({ providers: [{ provide: SimpleService, useClass: undefined }] })
                ], SomeModule);
                return SomeModule;
            }());
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(SomeModule, true); })
                .toThrowError(/Invalid provider for SimpleService. useClass cannot be undefined./);
        }));
        it('should throw with descriptive error message when provider is undefined', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var SomeModule = /** @class */ (function () {
                function SomeModule() {
                }
                SomeModule = __decorate([
                    core_1.NgModule({ providers: [undefined] })
                ], SomeModule);
                return SomeModule;
            }());
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(SomeModule, true); })
                .toThrowError(/Encountered undefined provider!/);
        }));
        it('should throw with descriptive error message when one of providers is not present', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var SomeModule = /** @class */ (function () {
                function SomeModule() {
                }
                SomeModule = __decorate([
                    core_1.NgModule({ declarations: [MyBrokenComp3] })
                ], SomeModule);
                return SomeModule;
            }());
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(SomeModule, true); })
                .toThrowError("Invalid providers for \"MyBrokenComp3\" - only instances of Provider and Type are allowed, got: [SimpleService, ?null?, ...]");
        }));
        it('should throw with descriptive error message when one of viewProviders is not present', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var SomeModule = /** @class */ (function () {
                function SomeModule() {
                }
                SomeModule = __decorate([
                    core_1.NgModule({ declarations: [MyBrokenComp4] })
                ], SomeModule);
                return SomeModule;
            }());
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(SomeModule, true); })
                .toThrowError("Invalid viewProviders for \"MyBrokenComp4\" - only instances of Provider and Type are allowed, got: [?null?, ...]");
        }));
        it('should throw with descriptive error message when null or undefined is passed to module bootstrap', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var ModuleWithNullBootstrap = /** @class */ (function () {
                function ModuleWithNullBootstrap() {
                }
                ModuleWithNullBootstrap = __decorate([
                    core_1.NgModule({ bootstrap: [null] })
                ], ModuleWithNullBootstrap);
                return ModuleWithNullBootstrap;
            }());
            var ModuleWithUndefinedBootstrap = /** @class */ (function () {
                function ModuleWithUndefinedBootstrap() {
                }
                ModuleWithUndefinedBootstrap = __decorate([
                    core_1.NgModule({ bootstrap: [undefined] })
                ], ModuleWithUndefinedBootstrap);
                return ModuleWithUndefinedBootstrap;
            }());
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(ModuleWithNullBootstrap, true); })
                .toThrowError("Unexpected value 'null' used in the bootstrap property of module 'ModuleWithNullBootstrap'");
            expect(function () {
                return resolver.loadNgModuleDirectiveAndPipeMetadata(ModuleWithUndefinedBootstrap, true);
            })
                .toThrowError("Unexpected value 'undefined' used in the bootstrap property of module 'ModuleWithUndefinedBootstrap'");
        }));
        it('should throw an error when the interpolation config has invalid symbols', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var Module1 = /** @class */ (function () {
                function Module1() {
                }
                Module1 = __decorate([
                    core_1.NgModule({ declarations: [ComponentWithInvalidInterpolation1] })
                ], Module1);
                return Module1;
            }());
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(Module1, true); })
                .toThrowError("[' ', ' '] contains unusable interpolation symbol.");
            var Module2 = /** @class */ (function () {
                function Module2() {
                }
                Module2 = __decorate([
                    core_1.NgModule({ declarations: [ComponentWithInvalidInterpolation2] })
                ], Module2);
                return Module2;
            }());
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(Module2, true); })
                .toThrowError("['{', '}'] contains unusable interpolation symbol.");
            var Module3 = /** @class */ (function () {
                function Module3() {
                }
                Module3 = __decorate([
                    core_1.NgModule({ declarations: [ComponentWithInvalidInterpolation3] })
                ], Module3);
                return Module3;
            }());
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(Module3, true); })
                .toThrowError("['<%', '%>'] contains unusable interpolation symbol.");
            var Module4 = /** @class */ (function () {
                function Module4() {
                }
                Module4 = __decorate([
                    core_1.NgModule({ declarations: [ComponentWithInvalidInterpolation4] })
                ], Module4);
                return Module4;
            }());
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(Module4, true); })
                .toThrowError("['&#', '}}'] contains unusable interpolation symbol.");
            var Module5 = /** @class */ (function () {
                function Module5() {
                }
                Module5 = __decorate([
                    core_1.NgModule({ declarations: [ComponentWithInvalidInterpolation5] })
                ], Module5);
                return Module5;
            }());
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(Module5, true); })
                .toThrowError("['&lbrace;', '}}'] contains unusable interpolation symbol.");
        }));
        it("should throw an error when a Pipe is added to module's bootstrap list", testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var MyPipe = /** @class */ (function () {
                function MyPipe() {
                }
                MyPipe = __decorate([
                    core_1.Pipe({ name: 'pipe' })
                ], MyPipe);
                return MyPipe;
            }());
            var ModuleWithPipeInBootstrap = /** @class */ (function () {
                function ModuleWithPipeInBootstrap() {
                }
                ModuleWithPipeInBootstrap = __decorate([
                    core_1.NgModule({ declarations: [MyPipe], bootstrap: [MyPipe] })
                ], ModuleWithPipeInBootstrap);
                return ModuleWithPipeInBootstrap;
            }());
            expect(function () { return resolver.getNgModuleMetadata(ModuleWithPipeInBootstrap); })
                .toThrowError("MyPipe cannot be used as an entry component.");
        }));
        it("should throw an error when a Service is added to module's bootstrap list", testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var ModuleWithServiceInBootstrap = /** @class */ (function () {
                function ModuleWithServiceInBootstrap() {
                }
                ModuleWithServiceInBootstrap = __decorate([
                    core_1.NgModule({ declarations: [], bootstrap: [SimpleService] })
                ], ModuleWithServiceInBootstrap);
                return ModuleWithServiceInBootstrap;
            }());
            expect(function () { return resolver.getNgModuleMetadata(ModuleWithServiceInBootstrap); })
                .toThrowError("SimpleService cannot be used as an entry component.");
        }));
        it("should throw an error when a Directive is added to module's bootstrap list", testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var MyDirective = /** @class */ (function () {
                function MyDirective() {
                }
                MyDirective = __decorate([
                    core_1.Directive({ selector: 'directive' })
                ], MyDirective);
                return MyDirective;
            }());
            var ModuleWithDirectiveInBootstrap = /** @class */ (function () {
                function ModuleWithDirectiveInBootstrap() {
                }
                ModuleWithDirectiveInBootstrap = __decorate([
                    core_1.NgModule({ declarations: [], bootstrap: [MyDirective] })
                ], ModuleWithDirectiveInBootstrap);
                return ModuleWithDirectiveInBootstrap;
            }());
            expect(function () { return resolver.getNgModuleMetadata(ModuleWithDirectiveInBootstrap); })
                .toThrowError("MyDirective cannot be used as an entry component.");
        }));
        it("should not throw an error when a Component is added to module's bootstrap list", testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var MyComp = /** @class */ (function () {
                function MyComp() {
                }
                MyComp = __decorate([
                    core_1.Component({ template: '' })
                ], MyComp);
                return MyComp;
            }());
            var ModuleWithComponentInBootstrap = /** @class */ (function () {
                function ModuleWithComponentInBootstrap() {
                }
                ModuleWithComponentInBootstrap = __decorate([
                    core_1.NgModule({ declarations: [MyComp], bootstrap: [MyComp] })
                ], ModuleWithComponentInBootstrap);
                return ModuleWithComponentInBootstrap;
            }());
            expect(function () { return resolver.getNgModuleMetadata(ModuleWithComponentInBootstrap); }).not.toThrow();
        }));
        // #20049
        it('should throw a reasonable message when an invalid import is given', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var InvalidModule = /** @class */ (function () {
                function InvalidModule() {
                }
                InvalidModule = __decorate([
                    core_1.NgModule({ imports: [{ ngModule: true }] })
                ], InvalidModule);
                return InvalidModule;
            }());
            expect(function () { resolver.getNgModuleMetadata(InvalidModule); })
                .toThrowError("Unexpected value '[object Object]' imported by the module 'InvalidModule'. Please add a @NgModule annotation.");
        }));
    });
    it('should dedupe declarations in NgModule', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
        var MyComp = /** @class */ (function () {
            function MyComp() {
            }
            MyComp = __decorate([
                core_1.Component({ template: '' })
            ], MyComp);
            return MyComp;
        }());
        var MyModule = /** @class */ (function () {
            function MyModule() {
            }
            MyModule = __decorate([
                core_1.NgModule({ declarations: [MyComp, MyComp] })
            ], MyModule);
            return MyModule;
        }());
        var modMeta = resolver.getNgModuleMetadata(MyModule);
        expect(modMeta.declaredDirectives.length).toBe(1);
        expect(modMeta.declaredDirectives[0].reference).toBe(MyComp);
    }));
}
var ComponentWithoutModuleId = /** @class */ (function () {
    function ComponentWithoutModuleId() {
    }
    ComponentWithoutModuleId = __decorate([
        core_1.Component({ selector: 'someComponent', template: '' })
    ], ComponentWithoutModuleId);
    return ComponentWithoutModuleId;
}());
var ComponentWithInvalidModuleId = /** @class */ (function () {
    function ComponentWithInvalidModuleId() {
    }
    ComponentWithInvalidModuleId = __decorate([
        core_1.Component({ selector: 'someComponent', template: '', moduleId: 0 })
    ], ComponentWithInvalidModuleId);
    return ComponentWithInvalidModuleId;
}());
var ComponentWithExternalResources = /** @class */ (function () {
    function ComponentWithExternalResources() {
    }
    ComponentWithExternalResources = __decorate([
        core_1.Component({
            selector: 'someSelector',
            templateUrl: 'someTemplateUrl',
            styleUrls: ['someStyleUrl'],
        })
    ], ComponentWithExternalResources);
    return ComponentWithExternalResources;
}());
var ComponentWithEverythingInline = /** @class */ (function () {
    function ComponentWithEverythingInline() {
    }
    ComponentWithEverythingInline.prototype.ngOnChanges = function (changes) { };
    ComponentWithEverythingInline.prototype.ngOnInit = function () { };
    ComponentWithEverythingInline.prototype.ngDoCheck = function () { };
    ComponentWithEverythingInline.prototype.ngOnDestroy = function () { };
    ComponentWithEverythingInline.prototype.ngAfterContentInit = function () { };
    ComponentWithEverythingInline.prototype.ngAfterContentChecked = function () { };
    ComponentWithEverythingInline.prototype.ngAfterViewInit = function () { };
    ComponentWithEverythingInline.prototype.ngAfterViewChecked = function () { };
    ComponentWithEverythingInline = __decorate([
        core_1.Component({
            selector: 'someSelector',
            inputs: ['someProp'],
            outputs: ['someEvent'],
            host: {
                '[someHostProp]': 'someHostPropExpr',
                '(someHostListener)': 'someHostListenerExpr',
                'someHostAttr': 'someHostAttrValue'
            },
            exportAs: 'someExportAs',
            moduleId: 'someModuleId',
            changeDetection: core_1.ChangeDetectionStrategy.Default,
            template: 'someTemplate',
            encapsulation: core_1.ViewEncapsulation.Emulated,
            styles: ['someStyle'],
            interpolation: ['{{', '}}']
        })
    ], ComponentWithEverythingInline);
    return ComponentWithEverythingInline;
}());
var MyBrokenComp1 = /** @class */ (function () {
    function MyBrokenComp1(dependency) {
        this.dependency = dependency;
    }
    MyBrokenComp1 = __decorate([
        core_1.Component({ selector: 'my-broken-comp', template: '' }),
        __metadata("design:paramtypes", [Object])
    ], MyBrokenComp1);
    return MyBrokenComp1;
}());
var NonAnnotatedService = /** @class */ (function () {
    function NonAnnotatedService(dep) {
    }
    return NonAnnotatedService;
}());
var MyBrokenComp2 = /** @class */ (function () {
    function MyBrokenComp2(dependency) {
    }
    MyBrokenComp2 = __decorate([
        core_1.Component({ selector: 'my-broken-comp', template: '', providers: [NonAnnotatedService] }),
        __metadata("design:paramtypes", [NonAnnotatedService])
    ], MyBrokenComp2);
    return MyBrokenComp2;
}());
var SimpleService = /** @class */ (function () {
    function SimpleService() {
    }
    SimpleService = __decorate([
        core_1.Injectable()
    ], SimpleService);
    return SimpleService;
}());
var MyBrokenComp3 = /** @class */ (function () {
    function MyBrokenComp3() {
    }
    MyBrokenComp3 = __decorate([
        core_1.Component({ selector: 'my-broken-comp', template: '', providers: [SimpleService, null, [null]] })
    ], MyBrokenComp3);
    return MyBrokenComp3;
}());
var MyBrokenComp4 = /** @class */ (function () {
    function MyBrokenComp4() {
    }
    MyBrokenComp4 = __decorate([
        core_1.Component({ selector: 'my-broken-comp', template: '', viewProviders: [null, SimpleService, [null]] })
    ], MyBrokenComp4);
    return MyBrokenComp4;
}());
var ComponentWithInvalidInterpolation1 = /** @class */ (function () {
    function ComponentWithInvalidInterpolation1() {
    }
    ComponentWithInvalidInterpolation1 = __decorate([
        core_1.Component({ selector: 'someSelector', template: '', interpolation: [' ', ' '] })
    ], ComponentWithInvalidInterpolation1);
    return ComponentWithInvalidInterpolation1;
}());
var ComponentWithInvalidInterpolation2 = /** @class */ (function () {
    function ComponentWithInvalidInterpolation2() {
    }
    ComponentWithInvalidInterpolation2 = __decorate([
        core_1.Component({ selector: 'someSelector', template: '', interpolation: ['{', '}'] })
    ], ComponentWithInvalidInterpolation2);
    return ComponentWithInvalidInterpolation2;
}());
var ComponentWithInvalidInterpolation3 = /** @class */ (function () {
    function ComponentWithInvalidInterpolation3() {
    }
    ComponentWithInvalidInterpolation3 = __decorate([
        core_1.Component({ selector: 'someSelector', template: '', interpolation: ['<%', '%>'] })
    ], ComponentWithInvalidInterpolation3);
    return ComponentWithInvalidInterpolation3;
}());
var ComponentWithInvalidInterpolation4 = /** @class */ (function () {
    function ComponentWithInvalidInterpolation4() {
    }
    ComponentWithInvalidInterpolation4 = __decorate([
        core_1.Component({ selector: 'someSelector', template: '', interpolation: ['&#', '}}'] })
    ], ComponentWithInvalidInterpolation4);
    return ComponentWithInvalidInterpolation4;
}());
var ComponentWithInvalidInterpolation5 = /** @class */ (function () {
    function ComponentWithInvalidInterpolation5() {
    }
    ComponentWithInvalidInterpolation5 = __decorate([
        core_1.Component({ selector: 'someSelector', template: '', interpolation: ['&lbrace;', '}}'] })
    ], ComponentWithInvalidInterpolation5);
    return ComponentWithInvalidInterpolation5;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YWRhdGFfcmVzb2x2ZXJfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3Rlc3QvbWV0YWRhdGFfcmVzb2x2ZXJfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUVILGlGQUFpRztBQUNqRyxzQ0FBa1I7QUFDbFIsaURBQTZEO0FBRTdELDREQUF1RDtBQUN2RCw4REFBaUU7QUFDakUsMERBQXNEO0FBR3RELHlFQUFxRTtBQUNyRSxpREFBd0Q7QUFFeEQ7SUFDRSxRQUFRLENBQUMseUJBQXlCLEVBQUU7UUFDbEMsVUFBVSxDQUFDLGNBQVEsaUJBQU8sQ0FBQyxpQkFBaUIsQ0FBQyxFQUFDLFNBQVMsRUFBRSx1Q0FBdUIsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV2RixFQUFFLENBQUMsd0dBQXdHLEVBQ3hHLGdCQUFNLENBQUMsQ0FBQywyQ0FBdUIsQ0FBQyxFQUFFLFVBQUMsUUFBaUM7WUFFbEU7Z0JBQUE7Z0JBQ0EsQ0FBQztnQkFESyxVQUFVO29CQURmLGVBQVEsQ0FBQyxFQUFFLENBQUM7bUJBQ1AsVUFBVSxDQUNmO2dCQUFELGlCQUFDO2FBQUEsQUFERCxJQUNDO1lBR0Q7Z0JBQUE7Z0JBQ0EsQ0FBQztnQkFESyxRQUFRO29CQURiLFdBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUMsQ0FBQzttQkFDZixRQUFRLENBQ2I7Z0JBQUQsZUFBQzthQUFBLEFBREQsSUFDQztZQUVELE1BQU0sQ0FBQyxjQUFNLE9BQUEsUUFBUSxDQUFDLG9CQUFvQixDQUFDLDZCQUE2QixDQUFDLEVBQTVELENBQTRELENBQUM7aUJBQ3JFLFlBQVksQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUNuQyxNQUFNLENBQUMsY0FBTSxPQUFBLFFBQVEsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLEVBQWxDLENBQWtD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