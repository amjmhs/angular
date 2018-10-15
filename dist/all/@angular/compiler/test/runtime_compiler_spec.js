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
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
var spies_1 = require("./spies");
var ChildComp = /** @class */ (function () {
    function ChildComp() {
    }
    ChildComp = __decorate([
        core_1.Component({ selector: 'child-cmp' })
    ], ChildComp);
    return ChildComp;
}());
var SomeComp = /** @class */ (function () {
    function SomeComp() {
    }
    SomeComp = __decorate([
        core_1.Component({ selector: 'some-cmp', template: 'someComp' })
    ], SomeComp);
    return SomeComp;
}());
var SomeCompWithUrlTemplate = /** @class */ (function () {
    function SomeCompWithUrlTemplate() {
    }
    SomeCompWithUrlTemplate = __decorate([
        core_1.Component({ selector: 'some-cmp', templateUrl: './someTpl' })
    ], SomeCompWithUrlTemplate);
    return SomeCompWithUrlTemplate;
}());
{
    describe('RuntimeCompiler', function () {
        describe('compilerComponentSync', function () {
            describe('never resolving loader', function () {
                var StubResourceLoader = /** @class */ (function () {
                    function StubResourceLoader() {
                    }
                    StubResourceLoader.prototype.get = function (url) { return new Promise(function () { }); };
                    return StubResourceLoader;
                }());
                beforeEach(function () {
                    testing_1.TestBed.configureCompiler({ providers: [{ provide: compiler_1.ResourceLoader, useClass: StubResourceLoader, deps: [] }] });
                });
                it('should throw when using a templateUrl that has not been compiled before', testing_1.async(function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [SomeCompWithUrlTemplate] });
                    testing_1.TestBed.compileComponents().then(function () {
                        matchers_1.expect(function () { return testing_1.TestBed.createComponent(SomeCompWithUrlTemplate); })
                            .toThrowError("Can't compile synchronously as " + core_1.ɵstringify(SomeCompWithUrlTemplate) + " is still being loaded!");
                    });
                }));
                it('should throw when using a templateUrl in a nested component that has not been compiled before', function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [SomeComp, ChildComp] });
                    testing_1.TestBed.overrideComponent(ChildComp, { set: { templateUrl: '/someTpl.html' } });
                    testing_1.TestBed.overrideComponent(SomeComp, { set: { template: '<child-cmp></child-cmp>' } });
                    testing_1.TestBed.compileComponents().then(function () {
                        matchers_1.expect(function () { return testing_1.TestBed.createComponent(SomeComp); })
                            .toThrowError("Can't compile synchronously as " + core_1.ɵstringify(ChildComp) + " is still being loaded!");
                    });
                });
            });
            describe('resolving loader', function () {
                var StubResourceLoader = /** @class */ (function () {
                    function StubResourceLoader() {
                    }
                    StubResourceLoader.prototype.get = function (url) { return Promise.resolve('hello'); };
                    return StubResourceLoader;
                }());
                beforeEach(function () {
                    testing_1.TestBed.configureCompiler({ providers: [{ provide: compiler_1.ResourceLoader, useClass: StubResourceLoader, deps: [] }] });
                });
                it('should allow to use templateUrl components that have been loaded before', testing_1.async(function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [SomeCompWithUrlTemplate] });
                    testing_1.TestBed.compileComponents().then(function () {
                        var fixture = testing_1.TestBed.createComponent(SomeCompWithUrlTemplate);
                        matchers_1.expect(fixture.nativeElement).toHaveText('hello');
                    });
                }));
            });
        });
    });
    describe('RuntimeCompiler', function () {
        var compiler;
        var resourceLoader;
        var dirResolver;
        var injector;
        beforeEach(function () { testing_1.TestBed.configureCompiler({ providers: [spies_1.SpyResourceLoader.PROVIDE] }); });
        beforeEach(testing_1.fakeAsync(testing_1.inject([core_1.Compiler, compiler_1.ResourceLoader, compiler_1.DirectiveResolver, core_1.Injector], function (_compiler, _resourceLoader, _dirResolver, _injector) {
            compiler = _compiler;
            resourceLoader = _resourceLoader;
            dirResolver = _dirResolver;
            injector = _injector;
        })));
        describe('compileModuleAsync', function () {
            it('should allow to use templateUrl components', testing_1.fakeAsync(function () {
                var SomeModule = /** @class */ (function () {
                    function SomeModule() {
                    }
                    SomeModule = __decorate([
                        core_1.NgModule({
                            declarations: [SomeCompWithUrlTemplate],
                            entryComponents: [SomeCompWithUrlTemplate]
                        })
                    ], SomeModule);
                    return SomeModule;
                }());
                resourceLoader.spy('get').and.callFake(function () { return Promise.resolve('hello'); });
                var ngModuleFactory = undefined;
                compiler.compileModuleAsync(SomeModule).then(function (f) { return ngModuleFactory = f; });
                testing_1.tick();
                matchers_1.expect(ngModuleFactory.moduleType).toBe(SomeModule);
            }));
        });
        describe('compileModuleSync', function () {
            it('should throw when using a templateUrl that has not been compiled before', function () {
                var SomeModule = /** @class */ (function () {
                    function SomeModule() {
                    }
                    SomeModule = __decorate([
                        core_1.NgModule({ declarations: [SomeCompWithUrlTemplate], entryComponents: [SomeCompWithUrlTemplate] })
                    ], SomeModule);
                    return SomeModule;
                }());
                resourceLoader.spy('get').and.callFake(function () { return Promise.resolve(''); });
                matchers_1.expect(function () { return compiler.compileModuleSync(SomeModule); })
                    .toThrowError("Can't compile synchronously as " + core_1.ɵstringify(SomeCompWithUrlTemplate) + " is still being loaded!");
            });
            it('should throw when using a templateUrl in a nested component that has not been compiled before', function () {
                var SomeModule = /** @class */ (function () {
                    function SomeModule() {
                    }
                    SomeModule = __decorate([
                        core_1.NgModule({ declarations: [SomeComp, ChildComp], entryComponents: [SomeComp] })
                    ], SomeModule);
                    return SomeModule;
                }());
                resourceLoader.spy('get').and.callFake(function () { return Promise.resolve(''); });
                dirResolver.setDirective(SomeComp, new core_1.Component({ selector: 'some-cmp', template: '' }));
                dirResolver.setDirective(ChildComp, new core_1.Component({ selector: 'child-cmp', templateUrl: '/someTpl.html' }));
                matchers_1.expect(function () { return compiler.compileModuleSync(SomeModule); })
                    .toThrowError("Can't compile synchronously as " + core_1.ɵstringify(ChildComp) + " is still being loaded!");
            });
            it('should allow to use templateUrl components that have been loaded before', testing_1.fakeAsync(function () {
                var SomeModule = /** @class */ (function () {
                    function SomeModule() {
                    }
                    SomeModule = __decorate([
                        core_1.NgModule({
                            declarations: [SomeCompWithUrlTemplate],
                            entryComponents: [SomeCompWithUrlTemplate]
                        })
                    ], SomeModule);
                    return SomeModule;
                }());
                resourceLoader.spy('get').and.callFake(function () { return Promise.resolve('hello'); });
                compiler.compileModuleAsync(SomeModule);
                testing_1.tick();
                var ngModuleFactory = compiler.compileModuleSync(SomeModule);
                matchers_1.expect(ngModuleFactory).toBeTruthy();
            }));
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVudGltZV9jb21waWxlcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdC9ydW50aW1lX2NvbXBpbGVyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7QUFFSCw4Q0FBb0U7QUFDcEUsc0NBQWdIO0FBQ2hILGlEQUE4RTtBQUM5RSwyRUFBc0U7QUFFdEUsaUNBQTBDO0FBRzFDO0lBQUE7SUFDQSxDQUFDO0lBREssU0FBUztRQURkLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsV0FBVyxFQUFDLENBQUM7T0FDN0IsU0FBUyxDQUNkO0lBQUQsZ0JBQUM7Q0FBQSxBQURELElBQ0M7QUFHRDtJQUFBO0lBQ0EsQ0FBQztJQURLLFFBQVE7UUFEYixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFDLENBQUM7T0FDbEQsUUFBUSxDQUNiO0lBQUQsZUFBQztDQUFBLEFBREQsSUFDQztBQUdEO0lBQUE7SUFDQSxDQUFDO0lBREssdUJBQXVCO1FBRDVCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUMsQ0FBQztPQUN0RCx1QkFBdUIsQ0FDNUI7SUFBRCw4QkFBQztDQUFBLEFBREQsSUFDQztBQUVEO0lBQ0UsUUFBUSxDQUFDLGlCQUFpQixFQUFFO1FBRTFCLFFBQVEsQ0FBQyx1QkFBdUIsRUFBRTtZQUNoQyxRQUFRLENBQUMsd0JBQXdCLEVBQUU7Z0JBQ2pDO29CQUFBO29CQUVBLENBQUM7b0JBREMsZ0NBQUcsR0FBSCxVQUFJLEdBQVcsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLGNBQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNwRCx5QkFBQztnQkFBRCxDQUFDLEFBRkQsSUFFQztnQkFFRCxVQUFVLENBQUM7b0JBQ1Qs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