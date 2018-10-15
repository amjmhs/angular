"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var console_1 = require("@angular/core/src/console");
var defs_1 = require("@angular/core/src/di/defs");
var util_1 = require("@angular/core/src/view/util");
var testing_1 = require("@angular/core/testing");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
var ng_module_factory_loader_1 = require("../../src/linker/ng_module_factory_loader");
var util_2 = require("../../src/util");
var Engine = /** @class */ (function () {
    function Engine() {
    }
    return Engine;
}());
var BrokenEngine = /** @class */ (function () {
    function BrokenEngine() {
        throw new Error('Broken Engine');
    }
    return BrokenEngine;
}());
var DashboardSoftware = /** @class */ (function () {
    function DashboardSoftware() {
    }
    return DashboardSoftware;
}());
var Dashboard = /** @class */ (function () {
    function Dashboard(software) {
    }
    Dashboard = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [DashboardSoftware])
    ], Dashboard);
    return Dashboard;
}());
var TurboEngine = /** @class */ (function (_super) {
    __extends(TurboEngine, _super);
    function TurboEngine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TurboEngine;
}(Engine));
var CARS = new core_1.InjectionToken('Cars');
var Car = /** @class */ (function () {
    function Car(engine) {
        this.engine = engine;
    }
    Car = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [Engine])
    ], Car);
    return Car;
}());
var CarWithOptionalEngine = /** @class */ (function () {
    function CarWithOptionalEngine(engine) {
        this.engine = engine;
    }
    CarWithOptionalEngine = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Optional()),
        __metadata("design:paramtypes", [Engine])
    ], CarWithOptionalEngine);
    return CarWithOptionalEngine;
}());
var CarWithDashboard = /** @class */ (function () {
    function CarWithDashboard(engine, dashboard) {
        this.engine = engine;
        this.dashboard = dashboard;
    }
    CarWithDashboard = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [Engine, Dashboard])
    ], CarWithDashboard);
    return CarWithDashboard;
}());
var SportsCar = /** @class */ (function (_super) {
    __extends(SportsCar, _super);
    function SportsCar(engine) {
        return _super.call(this, engine) || this;
    }
    SportsCar = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [Engine])
    ], SportsCar);
    return SportsCar;
}(Car));
var CarWithInject = /** @class */ (function () {
    function CarWithInject(engine) {
        this.engine = engine;
    }
    CarWithInject = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(TurboEngine)),
        __metadata("design:paramtypes", [Engine])
    ], CarWithInject);
    return CarWithInject;
}());
var CyclicEngine = /** @class */ (function () {
    function CyclicEngine(car) {
    }
    CyclicEngine = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [Car])
    ], CyclicEngine);
    return CyclicEngine;
}());
var NoAnnotations = /** @class */ (function () {
    function NoAnnotations(secretDependency) {
    }
    return NoAnnotations;
}());
function factoryFn(a) { }
var SomeComp = /** @class */ (function () {
    function SomeComp() {
    }
    SomeComp = __decorate([
        core_1.Component({ selector: 'comp', template: '' })
    ], SomeComp);
    return SomeComp;
}());
var SomeDirective = /** @class */ (function () {
    function SomeDirective() {
    }
    __decorate([
        core_1.HostBinding('title'), core_1.Input(),
        __metadata("design:type", String)
    ], SomeDirective.prototype, "someDir", void 0);
    SomeDirective = __decorate([
        core_1.Directive({ selector: '[someDir]' })
    ], SomeDirective);
    return SomeDirective;
}());
var SomePipe = /** @class */ (function () {
    function SomePipe() {
    }
    SomePipe.prototype.transform = function (value) { return "transformed " + value; };
    SomePipe = __decorate([
        core_1.Pipe({ name: 'somePipe' })
    ], SomePipe);
    return SomePipe;
}());
var CompUsingModuleDirectiveAndPipe = /** @class */ (function () {
    function CompUsingModuleDirectiveAndPipe() {
    }
    CompUsingModuleDirectiveAndPipe = __decorate([
        core_1.Component({ selector: 'comp', template: "<div  [someDir]=\"'someValue' | somePipe\"></div>" })
    ], CompUsingModuleDirectiveAndPipe);
    return CompUsingModuleDirectiveAndPipe;
}());
var DummyConsole = /** @class */ (function () {
    function DummyConsole() {
        this.warnings = [];
    }
    DummyConsole.prototype.log = function (message) { };
    DummyConsole.prototype.warn = function (message) { this.warnings.push(message); };
    return DummyConsole;
}());
{
    describe('jit', function () { declareTests({ useJit: true }); });
    describe('no jit', function () { declareTests({ useJit: false }); });
}
function declareTests(_a) {
    var useJit = _a.useJit;
    describe('NgModule', function () {
        var compiler;
        var injector;
        var console;
        beforeEach(function () {
            console = new DummyConsole();
            testing_1.TestBed.configureCompiler({ useJit: useJit, providers: [{ provide: console_1.Console, useValue: console }] });
        });
        beforeEach(testing_1.inject([core_1.Compiler, core_1.Injector], function (_compiler, _injector) {
            compiler = _compiler;
            injector = _injector;
        }));
        function createModuleFactory(moduleType) {
            return compiler.compileModuleSync(moduleType);
        }
        function createModule(moduleType, parentInjector) {
            return createModuleFactory(moduleType).create(parentInjector || null);
        }
        function createComp(compType, moduleType) {
            var ngModule = createModule(moduleType, injector);
            var cf = ngModule.componentFactoryResolver.resolveComponentFactory(compType);
            var comp = cf.create(core_1.Injector.NULL);
            return new testing_1.ComponentFixture(comp, null, false);
        }
        describe('errors', function () {
            it('should error when exporting a directive that was neither declared nor imported', function () {
                var SomeModule = /** @class */ (function () {
                    function SomeModule() {
                    }
                    SomeModule = __decorate([
                        core_1.NgModule({ exports: [SomeDirective] })
                    ], SomeModule);
                    return SomeModule;
                }());
                matchers_1.expect(function () { return createModule(SomeModule); })
                    .toThrowError("Can't export directive " + util_2.stringify(SomeDirective) + " from " + util_2.stringify(SomeModule) + " as it was neither declared nor imported!");
            });
            it('should error when exporting a pipe that was neither declared nor imported', function () {
                var SomeModule = /** @class */ (function () {
                    function SomeModule() {
                    }
                    SomeModule = __decorate([
                        core_1.NgModule({ exports: [SomePipe] })
                    ], SomeModule);
                    return SomeModule;
                }());
                matchers_1.expect(function () { return createModule(SomeModule); })
                    .toThrowError("Can't export pipe " + util_2.stringify(SomePipe) + " from " + util_2.stringify(SomeModule) + " as it was neither declared nor imported!");
            });
            it('should error if a directive is declared in more than 1 module', function () {
                var Module1 = /** @class */ (function () {
                    function Module1() {
                    }
                    Module1 = __decorate([
                        core_1.NgModule({ declarations: [SomeDirective] })
                    ], Module1);
                    return Module1;
                }());
                var Module2 = /** @class */ (function () {
                    function Module2() {
                    }
                    Module2 = __decorate([
                        core_1.NgModule({ declarations: [SomeDirective] })
                    ], Module2);
                    return Module2;
                }());
                createModule(Module1);
                matchers_1.expect(function () { return createModule(Module2); })
                    .toThrowError("Type " + util_2.stringify(SomeDirective) + " is part of the declarations of 2 modules: " + util_2.stringify(Module1) + " and " + util_2.stringify(Module2) + "! " +
                    ("Please consider moving " + util_2.stringify(SomeDirective) + " to a higher module that imports " + util_2.stringify(Module1) + " and " + util_2.stringify(Module2) + ". ") +
                    ("You can also create a new NgModule that exports and includes " + util_2.stringify(SomeDirective) + " then import that NgModule in " + util_2.stringify(Module1) + " and " + util_2.stringify(Module2) + "."));
            });
            it('should error if a directive is declared in more than 1 module also if the module declaring it is imported', function () {
                var Module1 = /** @class */ (function () {
                    function Module1() {
                    }
                    Module1 = __decorate([
                        core_1.NgModule({ declarations: [SomeDirective], exports: [SomeDirective] })
                    ], Module1);
                    return Module1;
                }());
                var Module2 = /** @class */ (function () {
                    function Module2() {
                    }
                    Module2 = __decorate([
                        core_1.NgModule({ declarations: [SomeDirective], imports: [Module1] })
                    ], Module2);
                    return Module2;
                }());
                matchers_1.expect(function () { return createModule(Module2); })
                    .toThrowError("Type " + util_2.stringify(SomeDirective) + " is part of the declarations of 2 modules: " + util_2.stringify(Module1) + " and " + util_2.stringify(Module2) + "! " +
                    ("Please consider moving " + util_2.stringify(SomeDirective) + " to a higher module that imports " + util_2.stringify(Module1) + " and " + util_2.stringify(Module2) + ". ") +
                    ("You can also create a new NgModule that exports and includes " + util_2.stringify(SomeDirective) + " then import that NgModule in " + util_2.stringify(Module1) + " and " + util_2.stringify(Module2) + "."));
            });
            it('should error if a pipe is declared in more than 1 module', function () {
                var Module1 = /** @class */ (function () {
                    function Module1() {
                    }
                    Module1 = __decorate([
                        core_1.NgModule({ declarations: [SomePipe] })
                    ], Module1);
                    return Module1;
                }());
                var Module2 = /** @class */ (function () {
                    function Module2() {
                    }
                    Module2 = __decorate([
                        core_1.NgModule({ declarations: [SomePipe] })
                    ], Module2);
                    return Module2;
                }());
                createModule(Module1);
                matchers_1.expect(function () { return createModule(Module2); })
                    .toThrowError("Type " + util_2.stringify(SomePipe) + " is part of the declarations of 2 modules: " + util_2.stringify(Module1) + " and " + util_2.stringify(Module2) + "! " +
                    ("Please consider moving " + util_2.stringify(SomePipe) + " to a higher module that imports " + util_2.stringify(Module1) + " and " + util_2.stringify(Module2) + ". ") +
                    ("You can also create a new NgModule that exports and includes " + util_2.stringify(SomePipe) + " then import that NgModule in " + util_2.stringify(Module1) + " and " + util_2.stringify(Module2) + "."));
            });
            it('should error if a pipe is declared in more than 1 module also if the module declaring it is imported', function () {
                var Module1 = /** @class */ (function () {
                    function Module1() {
                    }
                    Module1 = __decorate([
                        core_1.NgModule({ declarations: [SomePipe], exports: [SomePipe] })
                    ], Module1);
                    return Module1;
                }());
                var Module2 = /** @class */ (function () {
                    function Module2() {
                    }
                    Module2 = __decorate([
                        core_1.NgModule({ declarations: [SomePipe], imports: [Module1] })
                    ], Module2);
                    return Module2;
                }());
                matchers_1.expect(function () { return createModule(Module2); })
                    .toThrowError("Type " + util_2.stringify(SomePipe) + " is part of the declarations of 2 modules: " + util_2.stringify(Module1) + " and " + util_2.stringify(Module2) + "! " +
                    ("Please consider moving " + util_2.stringify(SomePipe) + " to a higher module that imports " + util_2.stringify(Module1) + " and " + util_2.stringify(Module2) + ". ") +
                    ("You can also create a new NgModule that exports and includes " + util_2.stringify(SomePipe) + " then import that NgModule in " + util_2.stringify(Module1) + " and " + util_2.stringify(Module2) + "."));
            });
        });
        describe('schemas', function () {
            it('should error on unknown bound properties on custom elements by default', function () {
                var ComponentUsingInvalidProperty = /** @class */ (function () {
                    function ComponentUsingInvalidProperty() {
                    }
                    ComponentUsingInvalidProperty = __decorate([
                        core_1.Component({ template: '<some-element [someUnknownProp]="true"></some-element>' })
                    ], ComponentUsingInvalidProperty);
                    return ComponentUsingInvalidProperty;
                }());
                var SomeModule = /** @class */ (function () {
                    function SomeModule() {
                    }
                    SomeModule = __decorate([
                        core_1.NgModule({ declarations: [ComponentUsingInvalidProperty] })
                    ], SomeModule);
                    return SomeModule;
                }());
                matchers_1.expect(function () { return createModule(SomeModule); }).toThrowError(/Can't bind to 'someUnknownProp'/);
            });
            it('should not error on unknown bound properties on custom elements when using the CUSTOM_ELEMENTS_SCHEMA', function () {
                var ComponentUsingInvalidProperty = /** @class */ (function () {
                    function ComponentUsingInvalidProperty() {
                    }
                    ComponentUsingInvalidProperty = __decorate([
                        core_1.Component({ template: '<some-element [someUnknownProp]="true"></some-element>' })
                    ], ComponentUsingInvalidProperty);
                    return ComponentUsingInvalidProperty;
                }());
                var SomeModule = /** @class */ (function () {
                    function SomeModule() {
                    }
                    SomeModule = __decorate([
                        core_1.NgModule({ schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA], declarations: [ComponentUsingInvalidProperty] })
                    ], SomeModule);
                    return SomeModule;
                }());
                matchers_1.expect(function () { return createModule(SomeModule); }).not.toThrow();
            });
        });
        describe('id', function () {
            var token = 'myid';
            var SomeModule = /** @class */ (function () {
                function SomeModule() {
                }
                SomeModule = __decorate([
                    core_1.NgModule({ id: token })
                ], SomeModule);
                return SomeModule;
            }());
            var SomeOtherModule = /** @class */ (function () {
                function SomeOtherModule() {
                }
                SomeOtherModule = __decorate([
                    core_1.NgModule({ id: token })
                ], SomeOtherModule);
                return SomeOtherModule;
            }());
            afterEach(function () { return ng_module_factory_loader_1.clearModulesForTest(); });
            it('should register loaded modules', function () {
                createModule(SomeModule);
                var factory = core_1.getModuleFactory(token);
                matchers_1.expect(factory).toBeTruthy();
                matchers_1.expect(factory.moduleType).toBe(SomeModule);
            });
            it('should throw when registering a duplicate module', function () {
                createModule(SomeModule);
                matchers_1.expect(function () { return createModule(SomeOtherModule); }).toThrowError(/Duplicate module registered/);
            });
        });
        describe('entryComponents', function () {
            it('should create ComponentFactories in root modules', function () {
                var SomeModule = /** @class */ (function () {
                    function SomeModule() {
                    }
                    SomeModule = __decorate([
                        core_1.NgModule({ declarations: [SomeComp], entryComponents: [SomeComp] })
                    ], SomeModule);
                    return SomeModule;
                }());
                var ngModule = createModule(SomeModule);
                matchers_1.expect(ngModule.componentFactoryResolver.resolveComponentFactory(SomeComp).componentType)
                    .toBe(SomeComp);
                matchers_1.expect(ngModule.injector.get(core_1.ComponentFactoryResolver)
                    .resolveComponentFactory(SomeComp)
                    .componentType)
                    .toBe(SomeComp);
            });
            it('should throw if we cannot find a module associated with a module-level entryComponent', function () {
                var SomeCompWithEntryComponents = /** @class */ (function () {
                    function SomeCompWithEntryComponents() {
                    }
                    SomeCompWithEntryComponents = __decorate([
                        core_1.Component({ template: '' })
                    ], SomeCompWithEntryComponents);
                    return SomeCompWithEntryComponents;
                }());
                var SomeModule = /** @class */ (function () {
                    function SomeModule() {
                    }
                    SomeModule = __decorate([
                        core_1.NgModule({ declarations: [], entryComponents: [SomeCompWithEntryComponents] })
                    ], SomeModule);
                    return SomeModule;
                }());
                matchers_1.expect(function () { return createModule(SomeModule); })
                    .toThrowError('Component SomeCompWithEntryComponents is not part of any NgModule or the module has not been imported into your module.');
            });
            it('should throw if we cannot find a module associated with a component-level entryComponent', function () {
                var SomeCompWithEntryComponents = /** @class */ (function () {
                    function SomeCompWithEntryComponents() {
                    }
                    SomeCompWithEntryComponents = __decorate([
                        core_1.Component({ template: '', entryComponents: [SomeComp] })
                    ], SomeCompWithEntryComponents);
                    return SomeCompWithEntryComponents;
                }());
                var SomeModule = /** @class */ (function () {
                    function SomeModule() {
                    }
                    SomeModule = __decorate([
                        core_1.NgModule({ declarations: [SomeCompWithEntryComponents] })
                    ], SomeModule);
                    return SomeModule;
                }());
                matchers_1.expect(function () { return createModule(SomeModule); })
                    .toThrowError('Component SomeComp is not part of any NgModule or the module has not been imported into your module.');
            });
            it('should create ComponentFactories via ANALYZE_FOR_ENTRY_COMPONENTS', function () {
                var SomeModule = /** @class */ (function () {
                    function SomeModule() {
                    }
                    SomeModule = __decorate([
                        core_1.NgModule({
                            declarations: [SomeComp],
                            providers: [{
                                    provide: core_1.ANALYZE_FOR_ENTRY_COMPONENTS,
                                    multi: true,
                                    useValue: [{ a: 'b', component: SomeComp }]
                                }]
                        })
                    ], SomeModule);
                    return SomeModule;
                }());
                var ngModule = createModule(SomeModule);
                matchers_1.expect(ngModule.componentFactoryResolver.resolveComponentFactory(SomeComp).componentType)
                    .toBe(SomeComp);
                matchers_1.expect(ngModule.injector.get(core_1.ComponentFactoryResolver)
                    .resolveComponentFactory(SomeComp)
                    .componentType)
                    .toBe(SomeComp);
            });
            it('should create ComponentFactories in imported modules', function () {
                var SomeImportedModule = /** @class */ (function () {
                    function SomeImportedModule() {
                    }
                    SomeImportedModule = __decorate([
                        core_1.NgModule({ declarations: [SomeComp], entryComponents: [SomeComp] })
                    ], SomeImportedModule);
                    return SomeImportedModule;
                }());
                var SomeModule = /** @class */ (function () {
                    function SomeModule() {
                    }
                    SomeModule = __decorate([
                        core_1.NgModule({ imports: [SomeImportedModule] })
                    ], SomeModule);
                    return SomeModule;
                }());
                var ngModule = createModule(SomeModule);
                matchers_1.expect(ngModule.componentFactoryResolver.resolveComponentFactory(SomeComp).componentType)
                    .toBe(SomeComp);
                matchers_1.expect(ngModule.injector.get(core_1.ComponentFactoryResolver)
                    .resolveComponentFactory(SomeComp)
                    .componentType)
                    .toBe(SomeComp);
            });
            it('should create ComponentFactories if the component was imported', function () {
                var SomeImportedModule = /** @class */ (function () {
                    function SomeImportedModule() {
                    }
                    SomeImportedModule = __decorate([
                        core_1.NgModule({ declarations: [SomeComp], exports: [SomeComp] })
                    ], SomeImportedModule);
                    return SomeImportedModule;
                }());
                var SomeModule = /** @class */ (function () {
                    function SomeModule() {
                    }
                    SomeModule = __decorate([
                        core_1.NgModule({ imports: [SomeImportedModule], entryComponents: [SomeComp] })
                    ], SomeModule);
                    return SomeModule;
                }());
                var ngModule = createModule(SomeModule);
                matchers_1.expect(ngModule.componentFactoryResolver.resolveComponentFactory(SomeComp).componentType)
                    .toBe(SomeComp);
                matchers_1.expect(ngModule.injector.get(core_1.ComponentFactoryResolver)
                    .resolveComponentFactory(SomeComp)
                    .componentType)
                    .toBe(SomeComp);
            });
        });
        describe('bootstrap components', function () {
            it('should create ComponentFactories', function () {
                var SomeModule = /** @class */ (function () {
                    function SomeModule() {
                    }
                    SomeModule = __decorate([
                        core_1.NgModule({ declarations: [SomeComp], bootstrap: [SomeComp] })
                    ], SomeModule);
                    return SomeModule;
                }());
                var ngModule = createModule(SomeModule);
                matchers_1.expect(ngModule.componentFactoryResolver.resolveComponentFactory(SomeComp).componentType)
                    .toBe(SomeComp);
            });
            it('should store the ComponentFactories in the NgModuleInjector', function () {
                var SomeModule = /** @class */ (function () {
                    function SomeModule() {
                    }
                    SomeModule = __decorate([
                        core_1.NgModule({ declarations: [SomeComp], bootstrap: [SomeComp] })
                    ], SomeModule);
                    return SomeModule;
                }());
                var ngModule = createModule(SomeModule);
                matchers_1.expect(ngModule._bootstrapComponents.length).toBe(1);
                matchers_1.expect(ngModule._bootstrapComponents[0]).toBe(SomeComp);
            });
        });
        describe('directives and pipes', function () {
            describe('declarations', function () {
                it('should be supported in root modules', function () {
                    var SomeModule = /** @class */ (function () {
                        function SomeModule() {
                        }
                        SomeModule = __decorate([
                            core_1.NgModule({
                                declarations: [CompUsingModuleDirectiveAndPipe, SomeDirective, SomePipe],
                                entryComponents: [CompUsingModuleDirectiveAndPipe]
                            })
                        ], SomeModule);
                        return SomeModule;
                    }());
                    var compFixture = createComp(CompUsingModuleDirectiveAndPipe, SomeModule);
                    compFixture.detectChanges();
                    matchers_1.expect(compFixture.debugElement.children[0].properties['title'])
                        .toBe('transformed someValue');
                });
                it('should be supported in imported modules', function () {
                    var SomeImportedModule = /** @class */ (function () {
                        function SomeImportedModule() {
                        }
                        SomeImportedModule = __decorate([
                            core_1.NgModule({
                                declarations: [CompUsingModuleDirectiveAndPipe, SomeDirective, SomePipe],
                                entryComponents: [CompUsingModuleDirectiveAndPipe]
                            })
                        ], SomeImportedModule);
                        return SomeImportedModule;
                    }());
                    var SomeModule = /** @class */ (function () {
                        function SomeModule() {
                        }
                        SomeModule = __decorate([
                            core_1.NgModule({ imports: [SomeImportedModule] })
                        ], SomeModule);
                        return SomeModule;
                    }());
                    var compFixture = createComp(CompUsingModuleDirectiveAndPipe, SomeModule);
                    compFixture.detectChanges();
                    matchers_1.expect(compFixture.debugElement.children[0].properties['title'])
                        .toBe('transformed someValue');
                });
                it('should be supported in nested components', function () {
                    var ParentCompUsingModuleDirectiveAndPipe = /** @class */ (function () {
                        function ParentCompUsingModuleDirectiveAndPipe() {
                        }
                        ParentCompUsingModuleDirectiveAndPipe = __decorate([
                            core_1.Component({
                                selector: 'parent',
                                template: '<comp></comp>',
                            })
                        ], ParentCompUsingModuleDirectiveAndPipe);
                        return ParentCompUsingModuleDirectiveAndPipe;
                    }());
                    var SomeModule = /** @class */ (function () {
                        function SomeModule() {
                        }
                        SomeModule = __decorate([
                            core_1.NgModule({
                                declarations: [
                                    ParentCompUsingModuleDirectiveAndPipe, CompUsingModuleDirectiveAndPipe, SomeDirective,
                                    SomePipe
                                ],
                                entryComponents: [ParentCompUsingModuleDirectiveAndPipe]
                            })
                        ], SomeModule);
                        return SomeModule;
                    }());
                    var compFixture = createComp(ParentCompUsingModuleDirectiveAndPipe, SomeModule);
                    compFixture.detectChanges();
                    matchers_1.expect(compFixture.debugElement.children[0].children[0].properties['title'])
                        .toBe('transformed someValue');
                });
            });
            describe('import/export', function () {
                it('should support exported directives and pipes', function () {
                    var SomeImportedModule = /** @class */ (function () {
                        function SomeImportedModule() {
                        }
                        SomeImportedModule = __decorate([
                            core_1.NgModule({ declarations: [SomeDirective, SomePipe], exports: [SomeDirective, SomePipe] })
                        ], SomeImportedModule);
                        return SomeImportedModule;
                    }());
                    var SomeModule = /** @class */ (function () {
                        function SomeModule() {
                        }
                        SomeModule = __decorate([
                            core_1.NgModule({
                                declarations: [CompUsingModuleDirectiveAndPipe],
                                imports: [SomeImportedModule],
                                entryComponents: [CompUsingModuleDirectiveAndPipe]
                            })
                        ], SomeModule);
                        return SomeModule;
                    }());
                    var compFixture = createComp(CompUsingModuleDirectiveAndPipe, SomeModule);
                    compFixture.detectChanges();
                    matchers_1.expect(compFixture.debugElement.children[0].properties['title'])
                        .toBe('transformed someValue');
                });
                it('should support exported directives and pipes if the module is wrapped into an `ModuleWithProviders`', function () {
                    var SomeImportedModule = /** @class */ (function () {
                        function SomeImportedModule() {
                        }
                        SomeImportedModule = __decorate([
                            core_1.NgModule({ declarations: [SomeDirective, SomePipe], exports: [SomeDirective, SomePipe] })
                        ], SomeImportedModule);
                        return SomeImportedModule;
                    }());
                    var SomeModule = /** @class */ (function () {
                        function SomeModule() {
                        }
                        SomeModule = __decorate([
                            core_1.NgModule({
                                declarations: [CompUsingModuleDirectiveAndPipe],
                                imports: [{ ngModule: SomeImportedModule }],
                                entryComponents: [CompUsingModuleDirectiveAndPipe]
                            })
                        ], SomeModule);
                        return SomeModule;
                    }());
                    var compFixture = createComp(CompUsingModuleDirectiveAndPipe, SomeModule);
                    compFixture.detectChanges();
                    matchers_1.expect(compFixture.debugElement.children[0].properties['title'])
                        .toBe('transformed someValue');
                });
                it('should support reexported modules', function () {
                    var SomeReexportedModule = /** @class */ (function () {
                        function SomeReexportedModule() {
                        }
                        SomeReexportedModule = __decorate([
                            core_1.NgModule({ declarations: [SomeDirective, SomePipe], exports: [SomeDirective, SomePipe] })
                        ], SomeReexportedModule);
                        return SomeReexportedModule;
                    }());
                    var SomeImportedModule = /** @class */ (function () {
                        function SomeImportedModule() {
                        }
                        SomeImportedModule = __decorate([
                            core_1.NgModule({ exports: [SomeReexportedModule] })
                        ], SomeImportedModule);
                        return SomeImportedModule;
                    }());
                    var SomeModule = /** @class */ (function () {
                        function SomeModule() {
                        }
                        SomeModule = __decorate([
                            core_1.NgModule({
                                declarations: [CompUsingModuleDirectiveAndPipe],
                                imports: [SomeImportedModule],
                                entryComponents: [CompUsingModuleDirectiveAndPipe]
                            })
                        ], SomeModule);
                        return SomeModule;
                    }());
                    var compFixture = createComp(CompUsingModuleDirectiveAndPipe, SomeModule);
                    compFixture.detectChanges();
                    matchers_1.expect(compFixture.debugElement.children[0].properties['title'])
                        .toBe('transformed someValue');
                });
                it('should support exporting individual directives of an imported module', function () {
                    var SomeReexportedModule = /** @class */ (function () {
                        function SomeReexportedModule() {
                        }
                        SomeReexportedModule = __decorate([
                            core_1.NgModule({ declarations: [SomeDirective, SomePipe], exports: [SomeDirective, SomePipe] })
                        ], SomeReexportedModule);
                        return SomeReexportedModule;
                    }());
                    var SomeImportedModule = /** @class */ (function () {
                        function SomeImportedModule() {
                        }
                        SomeImportedModule = __decorate([
                            core_1.NgModule({ imports: [SomeReexportedModule], exports: [SomeDirective, SomePipe] })
                        ], SomeImportedModule);
                        return SomeImportedModule;
                    }());
                    var SomeModule = /** @class */ (function () {
                        function SomeModule() {
                        }
                        SomeModule = __decorate([
                            core_1.NgModule({
                                declarations: [CompUsingModuleDirectiveAndPipe],
                                imports: [SomeImportedModule],
                                entryComponents: [CompUsingModuleDirectiveAndPipe]
                            })
                        ], SomeModule);
                        return SomeModule;
                    }());
                    var compFixture = createComp(CompUsingModuleDirectiveAndPipe, SomeModule);
                    compFixture.detectChanges();
                    matchers_1.expect(compFixture.debugElement.children[0].properties['title'])
                        .toBe('transformed someValue');
                });
                it('should not use non exported pipes of an imported module', function () {
                    var SomeImportedModule = /** @class */ (function () {
                        function SomeImportedModule() {
                        }
                        SomeImportedModule = __decorate([
                            core_1.NgModule({
                                declarations: [SomePipe],
                            })
                        ], SomeImportedModule);
                        return SomeImportedModule;
                    }());
                    var SomeModule = /** @class */ (function () {
                        function SomeModule() {
                        }
                        SomeModule = __decorate([
                            core_1.NgModule({
                                declarations: [CompUsingModuleDirectiveAndPipe],
                                imports: [SomeImportedModule],
                                entryComponents: [CompUsingModuleDirectiveAndPipe]
                            })
                        ], SomeModule);
                        return SomeModule;
                    }());
                    matchers_1.expect(function () { return createComp(SomeComp, SomeModule); })
                        .toThrowError(/The pipe 'somePipe' could not be found/);
                });
                it('should not use non exported directives of an imported module', function () {
                    var SomeImportedModule = /** @class */ (function () {
                        function SomeImportedModule() {
                        }
                        SomeImportedModule = __decorate([
                            core_1.NgModule({
                                declarations: [SomeDirective],
                            })
                        ], SomeImportedModule);
                        return SomeImportedModule;
                    }());
                    var SomeModule = /** @class */ (function () {
                        function SomeModule() {
                        }
                        SomeModule = __decorate([
                            core_1.NgModule({
                                declarations: [CompUsingModuleDirectiveAndPipe, SomePipe],
                                imports: [SomeImportedModule],
                                entryComponents: [CompUsingModuleDirectiveAndPipe]
                            })
                        ], SomeModule);
                        return SomeModule;
                    }());
                    matchers_1.expect(function () { return createComp(SomeComp, SomeModule); }).toThrowError(/Can't bind to 'someDir'/);
                });
            });
        });
        describe('providers', function () {
            var moduleType = null;
            function createInjector(providers, parent) {
                var SomeModule = /** @class */ (function () {
                    function SomeModule() {
                    }
                    SomeModule = __decorate([
                        core_1.NgModule({ providers: providers })
                    ], SomeModule);
                    return SomeModule;
                }());
                moduleType = SomeModule;
                return createModule(SomeModule, parent).injector;
            }
            it('should provide the module', function () { matchers_1.expect(createInjector([]).get(moduleType)).toBeAnInstanceOf(moduleType); });
            it('should instantiate a class without dependencies', function () {
                var injector = createInjector([Engine]);
                var engine = injector.get(Engine);
                matchers_1.expect(engine).toBeAnInstanceOf(Engine);
            });
            it('should resolve dependencies based on type information', function () {
                var injector = createInjector([Engine, Car]);
                var car = injector.get(Car);
                matchers_1.expect(car).toBeAnInstanceOf(Car);
                matchers_1.expect(car.engine).toBeAnInstanceOf(Engine);
            });
            it('should resolve dependencies based on @Inject annotation', function () {
                var injector = createInjector([TurboEngine, Engine, CarWithInject]);
                var car = injector.get(CarWithInject);
                matchers_1.expect(car).toBeAnInstanceOf(CarWithInject);
                matchers_1.expect(car.engine).toBeAnInstanceOf(TurboEngine);
            });
            it('should throw when no type and not @Inject (class case)', function () {
                matchers_1.expect(function () { return createInjector([NoAnnotations]); })
                    .toThrowError('Can\'t resolve all parameters for NoAnnotations: (?).');
            });
            it('should throw when no type and not @Inject (factory case)', function () {
                matchers_1.expect(function () { return createInjector([{ provide: 'someToken', useFactory: factoryFn }]); })
                    .toThrowError('Can\'t resolve all parameters for factoryFn: (?).');
            });
            it('should cache instances', function () {
                var injector = createInjector([Engine]);
                var e1 = injector.get(Engine);
                var e2 = injector.get(Engine);
                matchers_1.expect(e1).toBe(e2);
            });
            it('should provide to a value', function () {
                var injector = createInjector([{ provide: Engine, useValue: 'fake engine' }]);
                var engine = injector.get(Engine);
                matchers_1.expect(engine).toEqual('fake engine');
            });
            it('should provide to a factory', function () {
                function sportsCarFactory(e) { return new SportsCar(e); }
                var injector = createInjector([Engine, { provide: Car, useFactory: sportsCarFactory, deps: [Engine] }]);
                var car = injector.get(Car);
                matchers_1.expect(car).toBeAnInstanceOf(SportsCar);
                matchers_1.expect(car.engine).toBeAnInstanceOf(Engine);
            });
            it('should supporting provider to null', function () {
                var injector = createInjector([{ provide: Engine, useValue: null }]);
                var engine = injector.get(Engine);
                matchers_1.expect(engine).toBeNull();
            });
            it('should provide to an alias', function () {
                var injector = createInjector([
                    Engine, { provide: SportsCar, useClass: SportsCar },
                    { provide: Car, useExisting: SportsCar }
                ]);
                var car = injector.get(Car);
                var sportsCar = injector.get(SportsCar);
                matchers_1.expect(car).toBeAnInstanceOf(SportsCar);
                matchers_1.expect(car).toBe(sportsCar);
            });
            it('should support multiProviders', function () {
                var injector = createInjector([
                    Engine, { provide: CARS, useClass: SportsCar, multi: true },
                    { provide: CARS, useClass: CarWithOptionalEngine, multi: true }
                ]);
                var cars = injector.get(CARS);
                matchers_1.expect(cars.length).toEqual(2);
                matchers_1.expect(cars[0]).toBeAnInstanceOf(SportsCar);
                matchers_1.expect(cars[1]).toBeAnInstanceOf(CarWithOptionalEngine);
            });
            it('should support multiProviders that are created using useExisting', function () {
                var injector = createInjector([Engine, SportsCar, { provide: CARS, useExisting: SportsCar, multi: true }]);
                var cars = injector.get(CARS);
                matchers_1.expect(cars.length).toEqual(1);
                matchers_1.expect(cars[0]).toBe(injector.get(SportsCar));
            });
            it('should throw when the aliased provider does not exist', function () {
                var injector = createInjector([{ provide: 'car', useExisting: SportsCar }]);
                var e = "NullInjectorError: No provider for " + util_2.stringify(SportsCar) + "!";
                matchers_1.expect(function () { return injector.get('car'); }).toThrowError(e);
            });
            it('should handle forwardRef in useExisting', function () {
                var injector = createInjector([
                    { provide: 'originalEngine', useClass: core_1.forwardRef(function () { return Engine; }) },
                    { provide: 'aliasedEngine', useExisting: core_1.forwardRef(function () { return 'originalEngine'; }) }
                ]);
                matchers_1.expect(injector.get('aliasedEngine')).toBeAnInstanceOf(Engine);
            });
            it('should support overriding factory dependencies', function () {
                var injector = createInjector([Engine, { provide: Car, useFactory: function (e) { return new SportsCar(e); }, deps: [Engine] }]);
                var car = injector.get(Car);
                matchers_1.expect(car).toBeAnInstanceOf(SportsCar);
                matchers_1.expect(car.engine).toBeAnInstanceOf(Engine);
            });
            it('should support optional dependencies', function () {
                var injector = createInjector([CarWithOptionalEngine]);
                var car = injector.get(CarWithOptionalEngine);
                matchers_1.expect(car.engine).toBeNull();
            });
            it('should flatten passed-in providers', function () {
                var injector = createInjector([[[Engine, Car]]]);
                var car = injector.get(Car);
                matchers_1.expect(car).toBeAnInstanceOf(Car);
            });
            it('should use the last provider when there are multiple providers for same token', function () {
                var injector = createInjector([{ provide: Engine, useClass: Engine }, { provide: Engine, useClass: TurboEngine }]);
                matchers_1.expect(injector.get(Engine)).toBeAnInstanceOf(TurboEngine);
            });
            it('should use non-type tokens', function () {
                var injector = createInjector([{ provide: 'token', useValue: 'value' }]);
                matchers_1.expect(injector.get('token')).toEqual('value');
            });
            it('should throw when given invalid providers', function () {
                matchers_1.expect(function () { return createInjector(['blah']); })
                    .toThrowError("Invalid provider for the NgModule 'SomeModule' - only instances of Provider and Type are allowed, got: [?blah?]");
            });
            it('should throw when given blank providers', function () {
                matchers_1.expect(function () { return createInjector([null, { provide: 'token', useValue: 'value' }]); })
                    .toThrowError("Invalid provider for the NgModule 'SomeModule' - only instances of Provider and Type are allowed, got: [?null?, ...]");
            });
            it('should provide itself', function () {
                var parent = createInjector([]);
                var child = createInjector([], parent);
                matchers_1.expect(child.get(core_1.Injector)).toBe(child);
            });
            it('should provide undefined', function () {
                var factoryCounter = 0;
                var injector = createInjector([{
                        provide: 'token',
                        useFactory: function () {
                            factoryCounter++;
                            return undefined;
                        }
                    }]);
                matchers_1.expect(injector.get('token')).toBeUndefined();
                matchers_1.expect(injector.get('token')).toBeUndefined();
                matchers_1.expect(factoryCounter).toBe(1);
            });
            describe('injecting lazy providers into an eager provider via Injector.get', function () {
                it('should inject providers that were declared before it', function () {
                    var MyModule = /** @class */ (function () {
                        // NgModule is eager, which makes all of its deps eager
                        function MyModule(eager) {
                        }
                        MyModule = __decorate([
                            core_1.NgModule({
                                providers: [
                                    { provide: 'lazy', useFactory: function () { return 'lazyValue'; } },
                                    {
                                        provide: 'eager',
                                        useFactory: function (i) { return "eagerValue: " + i.get('lazy'); },
                                        deps: [core_1.Injector]
                                    },
                                ]
                            }),
                            __param(0, core_1.Inject('eager')),
                            __metadata("design:paramtypes", [Object])
                        ], MyModule);
                        return MyModule;
                    }());
                    matchers_1.expect(createModule(MyModule).injector.get('eager')).toBe('eagerValue: lazyValue');
                });
                it('should inject providers that were declared after it', function () {
                    var MyModule = /** @class */ (function () {
                        // NgModule is eager, which makes all of its deps eager
                        function MyModule(eager) {
                        }
                        MyModule = __decorate([
                            core_1.NgModule({
                                providers: [
                                    {
                                        provide: 'eager',
                                        useFactory: function (i) { return "eagerValue: " + i.get('lazy'); },
                                        deps: [core_1.Injector]
                                    },
                                    { provide: 'lazy', useFactory: function () { return 'lazyValue'; } },
                                ]
                            }),
                            __param(0, core_1.Inject('eager')),
                            __metadata("design:paramtypes", [Object])
                        ], MyModule);
                        return MyModule;
                    }());
                    matchers_1.expect(createModule(MyModule).injector.get('eager')).toBe('eagerValue: lazyValue');
                });
            });
            describe('injecting eager providers into an eager provider via Injector.get', function () {
                it('should inject providers that were declared before it', function () {
                    var MyModule = /** @class */ (function () {
                        // NgModule is eager, which makes all of its deps eager
                        function MyModule(eager1, eager2) {
                        }
                        MyModule = __decorate([
                            core_1.NgModule({
                                providers: [
                                    { provide: 'eager1', useFactory: function () { return 'v1'; } },
                                    {
                                        provide: 'eager2',
                                        useFactory: function (i) { return "v2: " + i.get('eager1'); },
                                        deps: [core_1.Injector]
                                    },
                                ]
                            }),
                            __param(0, core_1.Inject('eager1')), __param(1, core_1.Inject('eager2')),
                            __metadata("design:paramtypes", [Object, Object])
                        ], MyModule);
                        return MyModule;
                    }());
                    matchers_1.expect(createModule(MyModule).injector.get('eager2')).toBe('v2: v1');
                });
                it('should inject providers that were declared after it', function () {
                    var MyModule = /** @class */ (function () {
                        // NgModule is eager, which makes all of its deps eager
                        function MyModule(eager1, eager2) {
                        }
                        MyModule = __decorate([
                            core_1.NgModule({
                                providers: [
                                    {
                                        provide: 'eager1',
                                        useFactory: function (i) { return "v1: " + i.get('eager2'); },
                                        deps: [core_1.Injector]
                                    },
                                    { provide: 'eager2', useFactory: function () { return 'v2'; } },
                                ]
                            }),
                            __param(0, core_1.Inject('eager1')), __param(1, core_1.Inject('eager2')),
                            __metadata("design:paramtypes", [Object, Object])
                        ], MyModule);
                        return MyModule;
                    }());
                    matchers_1.expect(createModule(MyModule).injector.get('eager1')).toBe('v1: v2');
                });
                it('eager providers should get initialized only once', function () {
                    var MyService1 = /** @class */ (function () {
                        function MyService1(injector) {
                            // Create MyService2 before it it's initialized by TestModule.
                            this.innerService = injector.get(MyService2);
                        }
                        MyService1 = __decorate([
                            core_1.Injectable(),
                            __metadata("design:paramtypes", [core_1.Injector])
                        ], MyService1);
                        return MyService1;
                    }());
                    var MyService2 = /** @class */ (function () {
                        function MyService2() {
                        }
                        MyService2 = __decorate([
                            core_1.Injectable(),
                            __metadata("design:paramtypes", [])
                        ], MyService2);
                        return MyService2;
                    }());
                    var TestModule = /** @class */ (function () {
                        function TestModule(service1, service2) {
                            this.service1 = service1;
                            this.service2 = service2;
                        }
                        TestModule = __decorate([
                            core_1.NgModule({
                                providers: [MyService1, MyService2],
                            }),
                            __metadata("design:paramtypes", [MyService1, MyService2])
                        ], TestModule);
                        return TestModule;
                    }());
                    var moduleRef = createModule(TestModule, injector);
                    var module = moduleRef.instance;
                    // MyService2 should not get initialized twice.
                    matchers_1.expect(module.service1.innerService).toBe(module.service2);
                });
            });
            it('should throw when no provider defined', function () {
                var injector = createInjector([]);
                matchers_1.expect(function () { return injector.get('NonExisting'); })
                    .toThrowError('NullInjectorError: No provider for NonExisting!');
            });
            it('should throw when trying to instantiate a cyclic dependency', function () {
                matchers_1.expect(function () { return createInjector([Car, { provide: Engine, useClass: CyclicEngine }]); })
                    .toThrowError(/Cannot instantiate cyclic dependency! Car/g);
            });
            it('should support null values', function () {
                var injector = createInjector([{ provide: 'null', useValue: null }]);
                matchers_1.expect(injector.get('null')).toBe(null);
            });
            describe('child', function () {
                it('should load instances from parent injector', function () {
                    var parent = createInjector([Engine]);
                    var child = createInjector([], parent);
                    var engineFromParent = parent.get(Engine);
                    var engineFromChild = child.get(Engine);
                    matchers_1.expect(engineFromChild).toBe(engineFromParent);
                });
                it('should not use the child providers when resolving the dependencies of a parent provider', function () {
                    var parent = createInjector([Car, Engine]);
                    var child = createInjector([{ provide: Engine, useClass: TurboEngine }], parent);
                    var carFromChild = child.get(Car);
                    matchers_1.expect(carFromChild.engine).toBeAnInstanceOf(Engine);
                });
                it('should create new instance in a child injector', function () {
                    var parent = createInjector([Engine]);
                    var child = createInjector([{ provide: Engine, useClass: TurboEngine }], parent);
                    var engineFromParent = parent.get(Engine);
                    var engineFromChild = child.get(Engine);
                    matchers_1.expect(engineFromParent).not.toBe(engineFromChild);
                    matchers_1.expect(engineFromChild).toBeAnInstanceOf(TurboEngine);
                });
            });
            describe('depedency resolution', function () {
                describe('@Self()', function () {
                    it('should return a dependency from self', function () {
                        var inj = createInjector([
                            Engine,
                            { provide: Car, useFactory: function (e) { return new Car(e); }, deps: [[Engine, new core_1.Self()]] }
                        ]);
                        matchers_1.expect(inj.get(Car)).toBeAnInstanceOf(Car);
                    });
                });
                describe('default', function () {
                    it('should not skip self', function () {
                        var parent = createInjector([Engine]);
                        var child = createInjector([
                            { provide: Engine, useClass: TurboEngine },
                            { provide: Car, useFactory: function (e) { return new Car(e); }, deps: [Engine] }
                        ], parent);
                        matchers_1.expect(child.get(Car).engine).toBeAnInstanceOf(TurboEngine);
                    });
                });
            });
            describe('lifecycle', function () {
                it('should instantiate modules eagerly', function () {
                    var created = false;
                    var ImportedModule = /** @class */ (function () {
                        function ImportedModule() {
                            created = true;
                        }
                        ImportedModule = __decorate([
                            core_1.NgModule(),
                            __metadata("design:paramtypes", [])
                        ], ImportedModule);
                        return ImportedModule;
                    }());
                    var SomeModule = /** @class */ (function () {
                        function SomeModule() {
                        }
                        SomeModule = __decorate([
                            core_1.NgModule({ imports: [ImportedModule] })
                        ], SomeModule);
                        return SomeModule;
                    }());
                    createModule(SomeModule);
                    matchers_1.expect(created).toBe(true);
                });
                it('should instantiate providers that are not used by a module lazily', function () {
                    var created = false;
                    createInjector([{
                            provide: 'someToken',
                            useFactory: function () {
                                created = true;
                                return true;
                            }
                        }]);
                    matchers_1.expect(created).toBe(false);
                });
                it('should support ngOnDestroy on any provider', function () {
                    var destroyed = false;
                    var SomeInjectable = /** @class */ (function () {
                        function SomeInjectable() {
                        }
                        SomeInjectable.prototype.ngOnDestroy = function () { destroyed = true; };
                        return SomeInjectable;
                    }());
                    var SomeModule = /** @class */ (function () {
                        // Inject SomeInjectable to make it eager...
                        function SomeModule(i) {
                        }
                        SomeModule = __decorate([
                            core_1.NgModule({ providers: [SomeInjectable] }),
                            __metadata("design:paramtypes", [SomeInjectable])
                        ], SomeModule);
                        return SomeModule;
                    }());
                    var moduleRef = createModule(SomeModule);
                    matchers_1.expect(destroyed).toBe(false);
                    moduleRef.destroy();
                    matchers_1.expect(destroyed).toBe(true);
                });
                it('should support ngOnDestroy for lazy providers', function () {
                    var created = false;
                    var destroyed = false;
                    var SomeInjectable = /** @class */ (function () {
                        function SomeInjectable() {
                            created = true;
                        }
                        SomeInjectable.prototype.ngOnDestroy = function () { destroyed = true; };
                        return SomeInjectable;
                    }());
                    var SomeModule = /** @class */ (function () {
                        function SomeModule() {
                        }
                        SomeModule = __decorate([
                            core_1.NgModule({ providers: [SomeInjectable] })
                        ], SomeModule);
                        return SomeModule;
                    }());
                    var moduleRef = createModule(SomeModule);
                    matchers_1.expect(created).toBe(false);
                    matchers_1.expect(destroyed).toBe(false);
                    // no error if the provider was not yet created
                    moduleRef.destroy();
                    matchers_1.expect(created).toBe(false);
                    matchers_1.expect(destroyed).toBe(false);
                    moduleRef = createModule(SomeModule);
                    moduleRef.injector.get(SomeInjectable);
                    matchers_1.expect(created).toBe(true);
                    moduleRef.destroy();
                    matchers_1.expect(destroyed).toBe(true);
                });
            });
            describe('imported and exported modules', function () {
                it('should add the providers of imported modules', function () {
                    var ImportedModule = /** @class */ (function () {
                        function ImportedModule() {
                        }
                        ImportedModule = __decorate([
                            core_1.NgModule({ providers: [{ provide: 'token1', useValue: 'imported' }] })
                        ], ImportedModule);
                        return ImportedModule;
                    }());
                    var SomeModule = /** @class */ (function () {
                        function SomeModule() {
                        }
                        SomeModule = __decorate([
                            core_1.NgModule({ imports: [ImportedModule] })
                        ], SomeModule);
                        return SomeModule;
                    }());
                    var injector = createModule(SomeModule).injector;
                    matchers_1.expect(injector.get(SomeModule)).toBeAnInstanceOf(SomeModule);
                    matchers_1.expect(injector.get(ImportedModule)).toBeAnInstanceOf(ImportedModule);
                    matchers_1.expect(injector.get('token1')).toBe('imported');
                });
                it('should add the providers of imported ModuleWithProviders', function () {
                    var ImportedModule = /** @class */ (function () {
                        function ImportedModule() {
                        }
                        ImportedModule = __decorate([
                            core_1.NgModule()
                        ], ImportedModule);
                        return ImportedModule;
                    }());
                    var SomeModule = /** @class */ (function () {
                        function SomeModule() {
                        }
                        SomeModule = __decorate([
                            core_1.NgModule({
                                imports: [
                                    { ngModule: ImportedModule, providers: [{ provide: 'token1', useValue: 'imported' }] }
                                ]
                            })
                        ], SomeModule);
                        return SomeModule;
                    }());
                    var injector = createModule(SomeModule).injector;
                    matchers_1.expect(injector.get(SomeModule)).toBeAnInstanceOf(SomeModule);
                    matchers_1.expect(injector.get(ImportedModule)).toBeAnInstanceOf(ImportedModule);
                    matchers_1.expect(injector.get('token1')).toBe('imported');
                });
                it('should overwrite the providers of imported modules', function () {
                    var ImportedModule = /** @class */ (function () {
                        function ImportedModule() {
                        }
                        ImportedModule = __decorate([
                            core_1.NgModule({ providers: [{ provide: 'token1', useValue: 'imported' }] })
                        ], ImportedModule);
                        return ImportedModule;
                    }());
                    var SomeModule = /** @class */ (function () {
                        function SomeModule() {
                        }
                        SomeModule = __decorate([
                            core_1.NgModule({ providers: [{ provide: 'token1', useValue: 'direct' }], imports: [ImportedModule] })
                        ], SomeModule);
                        return SomeModule;
                    }());
                    var injector = createModule(SomeModule).injector;
                    matchers_1.expect(injector.get('token1')).toBe('direct');
                });
                it('should overwrite the providers of imported ModuleWithProviders', function () {
                    var ImportedModule = /** @class */ (function () {
                        function ImportedModule() {
                        }
                        ImportedModule = __decorate([
                            core_1.NgModule()
                        ], ImportedModule);
                        return ImportedModule;
                    }());
                    var SomeModule = /** @class */ (function () {
                        function SomeModule() {
                        }
                        SomeModule = __decorate([
                            core_1.NgModule({
                                providers: [{ provide: 'token1', useValue: 'direct' }],
                                imports: [
                                    { ngModule: ImportedModule, providers: [{ provide: 'token1', useValue: 'imported' }] }
                                ]
                            })
                        ], SomeModule);
                        return SomeModule;
                    }());
                    var injector = createModule(SomeModule).injector;
                    matchers_1.expect(injector.get('token1')).toBe('direct');
                });
                it('should overwrite the providers of imported modules on the second import level', function () {
                    var ImportedModuleLevel2 = /** @class */ (function () {
                        function ImportedModuleLevel2() {
                        }
                        ImportedModuleLevel2 = __decorate([
                            core_1.NgModule({ providers: [{ provide: 'token1', useValue: 'imported' }] })
                        ], ImportedModuleLevel2);
                        return ImportedModuleLevel2;
                    }());
                    var ImportedModuleLevel1 = /** @class */ (function () {
                        function ImportedModuleLevel1() {
                        }
                        ImportedModuleLevel1 = __decorate([
                            core_1.NgModule({
                                providers: [{ provide: 'token1', useValue: 'direct' }],
                                imports: [ImportedModuleLevel2]
                            })
                        ], ImportedModuleLevel1);
                        return ImportedModuleLevel1;
                    }());
                    var SomeModule = /** @class */ (function () {
                        function SomeModule() {
                        }
                        SomeModule = __decorate([
                            core_1.NgModule({ imports: [ImportedModuleLevel1] })
                        ], SomeModule);
                        return SomeModule;
                    }());
                    var injector = createModule(SomeModule).injector;
                    matchers_1.expect(injector.get('token1')).toBe('direct');
                });
                it('should add the providers of exported modules', function () {
                    var ExportedValue = /** @class */ (function () {
                        function ExportedValue() {
                        }
                        ExportedValue = __decorate([
                            core_1.NgModule({ providers: [{ provide: 'token1', useValue: 'exported' }] })
                        ], ExportedValue);
                        return ExportedValue;
                    }());
                    var SomeModule = /** @class */ (function () {
                        function SomeModule() {
                        }
                        SomeModule = __decorate([
                            core_1.NgModule({ exports: [ExportedValue] })
                        ], SomeModule);
                        return SomeModule;
                    }());
                    var injector = createModule(SomeModule).injector;
                    matchers_1.expect(injector.get(SomeModule)).toBeAnInstanceOf(SomeModule);
                    matchers_1.expect(injector.get(ExportedValue)).toBeAnInstanceOf(ExportedValue);
                    matchers_1.expect(injector.get('token1')).toBe('exported');
                });
                it('should overwrite the providers of exported modules', function () {
                    var ExportedModule = /** @class */ (function () {
                        function ExportedModule() {
                        }
                        ExportedModule = __decorate([
                            core_1.NgModule({ providers: [{ provide: 'token1', useValue: 'exported' }] })
                        ], ExportedModule);
                        return ExportedModule;
                    }());
                    var SomeModule = /** @class */ (function () {
                        function SomeModule() {
                        }
                        SomeModule = __decorate([
                            core_1.NgModule({ providers: [{ provide: 'token1', useValue: 'direct' }], exports: [ExportedModule] })
                        ], SomeModule);
                        return SomeModule;
                    }());
                    var injector = createModule(SomeModule).injector;
                    matchers_1.expect(injector.get('token1')).toBe('direct');
                });
                it('should overwrite the providers of imported modules by following imported modules', function () {
                    var ImportedModule1 = /** @class */ (function () {
                        function ImportedModule1() {
                        }
                        ImportedModule1 = __decorate([
                            core_1.NgModule({ providers: [{ provide: 'token1', useValue: 'imported1' }] })
                        ], ImportedModule1);
                        return ImportedModule1;
                    }());
                    var ImportedModule2 = /** @class */ (function () {
                        function ImportedModule2() {
                        }
                        ImportedModule2 = __decorate([
                            core_1.NgModule({ providers: [{ provide: 'token1', useValue: 'imported2' }] })
                        ], ImportedModule2);
                        return ImportedModule2;
                    }());
                    var SomeModule = /** @class */ (function () {
                        function SomeModule() {
                        }
                        SomeModule = __decorate([
                            core_1.NgModule({ imports: [ImportedModule1, ImportedModule2] })
                        ], SomeModule);
                        return SomeModule;
                    }());
                    var injector = createModule(SomeModule).injector;
                    matchers_1.expect(injector.get('token1')).toBe('imported2');
                });
                it('should overwrite the providers of exported modules by following exported modules', function () {
                    var ExportedModule1 = /** @class */ (function () {
                        function ExportedModule1() {
                        }
                        ExportedModule1 = __decorate([
                            core_1.NgModule({ providers: [{ provide: 'token1', useValue: 'exported1' }] })
                        ], ExportedModule1);
                        return ExportedModule1;
                    }());
                    var ExportedModule2 = /** @class */ (function () {
                        function ExportedModule2() {
                        }
                        ExportedModule2 = __decorate([
                            core_1.NgModule({ providers: [{ provide: 'token1', useValue: 'exported2' }] })
                        ], ExportedModule2);
                        return ExportedModule2;
                    }());
                    var SomeModule = /** @class */ (function () {
                        function SomeModule() {
                        }
                        SomeModule = __decorate([
                            core_1.NgModule({ exports: [ExportedModule1, ExportedModule2] })
                        ], SomeModule);
                        return SomeModule;
                    }());
                    var injector = createModule(SomeModule).injector;
                    matchers_1.expect(injector.get('token1')).toBe('exported2');
                });
                it('should overwrite the providers of imported modules by exported modules', function () {
                    var ImportedModule = /** @class */ (function () {
                        function ImportedModule() {
                        }
                        ImportedModule = __decorate([
                            core_1.NgModule({ providers: [{ provide: 'token1', useValue: 'imported' }] })
                        ], ImportedModule);
                        return ImportedModule;
                    }());
                    var ExportedModule = /** @class */ (function () {
                        function ExportedModule() {
                        }
                        ExportedModule = __decorate([
                            core_1.NgModule({ providers: [{ provide: 'token1', useValue: 'exported' }] })
                        ], ExportedModule);
                        return ExportedModule;
                    }());
                    var SomeModule = /** @class */ (function () {
                        function SomeModule() {
                        }
                        SomeModule = __decorate([
                            core_1.NgModule({ imports: [ImportedModule], exports: [ExportedModule] })
                        ], SomeModule);
                        return SomeModule;
                    }());
                    var injector = createModule(SomeModule).injector;
                    matchers_1.expect(injector.get('token1')).toBe('exported');
                });
                it('should not overwrite the providers if a module was already used on the same level', function () {
                    var ImportedModule1 = /** @class */ (function () {
                        function ImportedModule1() {
                        }
                        ImportedModule1 = __decorate([
                            core_1.NgModule({ providers: [{ provide: 'token1', useValue: 'imported1' }] })
                        ], ImportedModule1);
                        return ImportedModule1;
                    }());
                    var ImportedModule2 = /** @class */ (function () {
                        function ImportedModule2() {
                        }
                        ImportedModule2 = __decorate([
                            core_1.NgModule({ providers: [{ provide: 'token1', useValue: 'imported2' }] })
                        ], ImportedModule2);
                        return ImportedModule2;
                    }());
                    var SomeModule = /** @class */ (function () {
                        function SomeModule() {
                        }
                        SomeModule = __decorate([
                            core_1.NgModule({ imports: [ImportedModule1, ImportedModule2, ImportedModule1] })
                        ], SomeModule);
                        return SomeModule;
                    }());
                    var injector = createModule(SomeModule).injector;
                    matchers_1.expect(injector.get('token1')).toBe('imported2');
                });
                it('should not overwrite the providers if a module was already used on a child level', function () {
                    var ImportedModule1 = /** @class */ (function () {
                        function ImportedModule1() {
                        }
                        ImportedModule1 = __decorate([
                            core_1.NgModule({ providers: [{ provide: 'token1', useValue: 'imported1' }] })
                        ], ImportedModule1);
                        return ImportedModule1;
                    }());
                    var ImportedModule3 = /** @class */ (function () {
                        function ImportedModule3() {
                        }
                        ImportedModule3 = __decorate([
                            core_1.NgModule({ imports: [ImportedModule1] })
                        ], ImportedModule3);
                        return ImportedModule3;
                    }());
                    var ImportedModule2 = /** @class */ (function () {
                        function ImportedModule2() {
                        }
                        ImportedModule2 = __decorate([
                            core_1.NgModule({ providers: [{ provide: 'token1', useValue: 'imported2' }] })
                        ], ImportedModule2);
                        return ImportedModule2;
                    }());
                    var SomeModule = /** @class */ (function () {
                        function SomeModule() {
                        }
                        SomeModule = __decorate([
                            core_1.NgModule({ imports: [ImportedModule3, ImportedModule2, ImportedModule1] })
                        ], SomeModule);
                        return SomeModule;
                    }());
                    var injector = createModule(SomeModule).injector;
                    matchers_1.expect(injector.get('token1')).toBe('imported2');
                });
                it('should throw when given invalid providers in an imported ModuleWithProviders', function () {
                    var ImportedModule1 = /** @class */ (function () {
                        function ImportedModule1() {
                        }
                        ImportedModule1 = __decorate([
                            core_1.NgModule()
                        ], ImportedModule1);
                        return ImportedModule1;
                    }());
                    var SomeModule = /** @class */ (function () {
                        function SomeModule() {
                        }
                        SomeModule = __decorate([
                            core_1.NgModule({ imports: [{ ngModule: ImportedModule1, providers: ['broken'] }] })
                        ], SomeModule);
                        return SomeModule;
                    }());
                    matchers_1.expect(function () { return createModule(SomeModule).injector; })
                        .toThrowError("Invalid provider for the NgModule 'ImportedModule1' - only instances of Provider and Type are allowed, got: [?broken?]");
                });
            });
            describe('tree shakable providers', function () {
                it('definition should not persist across NgModuleRef instances', function () {
                    var SomeModule = /** @class */ (function () {
                        function SomeModule() {
                        }
                        SomeModule = __decorate([
                            core_1.NgModule()
                        ], SomeModule);
                        return SomeModule;
                    }());
                    var Bar = /** @class */ (function () {
                        function Bar() {
                        }
                        Bar.ngInjectableDef = defs_1.defineInjectable({
                            factory: function () { return new Bar(); },
                            providedIn: SomeModule,
                        });
                        return Bar;
                    }());
                    var factory = createModuleFactory(SomeModule);
                    var ngModuleRef1 = factory.create(null);
                    // Inject a tree shakeable provider token.
                    ngModuleRef1.injector.get(Bar);
                    // Tree Shakeable provider definition should get added to the NgModule data.
                    var providerDef1 = ngModuleRef1._def.providersByKey[util_1.tokenKey(Bar)];
                    matchers_1.expect(providerDef1).not.toBeUndefined();
                    // Instantiate the same module. The tree shakeable provider
                    // definition should not already be present.
                    var ngModuleRef2 = factory.create(null);
                    var providerDef2 = ngModuleRef2._def.providersByKey[util_1.tokenKey(Bar)];
                    matchers_1.expect(providerDef2).toBeUndefined();
                });
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfbW9kdWxlX2ludGVncmF0aW9uX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvbGlua2VyL25nX21vZHVsZV9pbnRlZ3JhdGlvbl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILHNDQUEwUztBQUMxUyxxREFBa0Q7QUFDbEQsa0RBQTBFO0FBRTFFLG9EQUFxRDtBQUNyRCxpREFBd0U7QUFDeEUsMkVBQXNFO0FBR3RFLHNGQUE4RTtBQUM5RSx1Q0FBeUM7QUFFekM7SUFBQTtJQUFjLENBQUM7SUFBRCxhQUFDO0FBQUQsQ0FBQyxBQUFmLElBQWU7QUFFZjtJQUNFO1FBQWdCLE1BQU0sSUFBSSxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7SUFBQyxDQUFDO0lBQ3JELG1CQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFFRDtJQUFBO0lBQXlCLENBQUM7SUFBRCx3QkFBQztBQUFELENBQUMsQUFBMUIsSUFBMEI7QUFHMUI7SUFDRSxtQkFBWSxRQUEyQjtJQUFHLENBQUM7SUFEdkMsU0FBUztRQURkLGlCQUFVLEVBQUU7eUNBRVcsaUJBQWlCO09BRG5DLFNBQVMsQ0FFZDtJQUFELGdCQUFDO0NBQUEsQUFGRCxJQUVDO0FBRUQ7SUFBMEIsK0JBQU07SUFBaEM7O0lBQWtDLENBQUM7SUFBRCxrQkFBQztBQUFELENBQUMsQUFBbkMsQ0FBMEIsTUFBTSxHQUFHO0FBRW5DLElBQU0sSUFBSSxHQUFHLElBQUkscUJBQWMsQ0FBUSxNQUFNLENBQUMsQ0FBQztBQUUvQztJQUNFLGFBQW1CLE1BQWM7UUFBZCxXQUFNLEdBQU4sTUFBTSxDQUFRO0lBQUcsQ0FBQztJQURqQyxHQUFHO1FBRFIsaUJBQVUsRUFBRTt5Q0FFZ0IsTUFBTTtPQUQ3QixHQUFHLENBRVI7SUFBRCxVQUFDO0NBQUEsQUFGRCxJQUVD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