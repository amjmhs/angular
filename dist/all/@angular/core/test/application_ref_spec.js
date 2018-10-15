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
var core_1 = require("@angular/core");
var application_ref_1 = require("@angular/core/src/application_ref");
var error_handler_1 = require("@angular/core/src/error_handler");
var platform_browser_1 = require("@angular/platform-browser");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var dom_tokens_1 = require("@angular/platform-browser/src/dom/dom_tokens");
var browser_util_1 = require("@angular/platform-browser/testing/src/browser_util");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
var ng_zone_1 = require("../src/zone/ng_zone");
var testing_1 = require("../testing");
var SomeComponent = /** @class */ (function () {
    function SomeComponent() {
    }
    SomeComponent = __decorate([
        core_1.Component({ selector: 'bootstrap-app', template: 'hello' })
    ], SomeComponent);
    return SomeComponent;
}());
{
    describe('bootstrap', function () {
        var mockConsole;
        beforeEach(function () { mockConsole = new MockConsole(); });
        function createRootEl(selector) {
            if (selector === void 0) { selector = 'bootstrap-app'; }
            var doc = testing_1.TestBed.get(dom_tokens_1.DOCUMENT);
            var rootEl = dom_adapter_1.getDOM().firstChild(dom_adapter_1.getDOM().content(dom_adapter_1.getDOM().createTemplate("<" + selector + "></" + selector + ">")));
            var oldRoots = dom_adapter_1.getDOM().querySelectorAll(doc, selector);
            for (var i = 0; i < oldRoots.length; i++) {
                dom_adapter_1.getDOM().remove(oldRoots[i]);
            }
            dom_adapter_1.getDOM().appendChild(doc.body, rootEl);
        }
        function createModule(providersOrOptions) {
            var options = {};
            if (providersOrOptions instanceof Array) {
                options = { providers: providersOrOptions };
            }
            else {
                options = providersOrOptions || {};
            }
            var errorHandler = new error_handler_1.ErrorHandler();
            errorHandler._console = mockConsole;
            var platformModule = dom_adapter_1.getDOM().supportsDOMEvents() ?
                platform_browser_1.BrowserModule :
                require('@angular/platform-server').ServerModule;
            var MyModule = /** @class */ (function () {
                function MyModule() {
                }
                MyModule = __decorate([
                    core_1.NgModule({
                        providers: [{ provide: error_handler_1.ErrorHandler, useValue: errorHandler }, options.providers || []],
                        imports: [platformModule],
                        declarations: [SomeComponent],
                        entryComponents: [SomeComponent],
                        bootstrap: options.bootstrap || []
                    })
                ], MyModule);
                return MyModule;
            }());
            if (options.ngDoBootstrap !== false) {
                MyModule.prototype.ngDoBootstrap = options.ngDoBootstrap || (function () { });
            }
            return MyModule;
        }
        it('should bootstrap a component from a child module', testing_1.async(testing_1.inject([application_ref_1.ApplicationRef, core_1.Compiler], function (app, compiler) {
            var SomeComponent = /** @class */ (function () {
                function SomeComponent() {
                }
                SomeComponent = __decorate([
                    core_1.Component({
                        selector: 'bootstrap-app',
                        template: '',
                    })
                ], SomeComponent);
                return SomeComponent;
            }());
            var SomeModule = /** @class */ (function () {
                function SomeModule() {
                }
                SomeModule = __decorate([
                    core_1.NgModule({
                        providers: [{ provide: 'hello', useValue: 'component' }],
                        declarations: [SomeComponent],
                        entryComponents: [SomeComponent],
                    })
                ], SomeModule);
                return SomeModule;
            }());
            createRootEl();
            var modFactory = compiler.compileModuleSync(SomeModule);
            var module = modFactory.create(testing_1.TestBed);
            var cmpFactory = module.componentFactoryResolver.resolveComponentFactory(SomeComponent);
            var component = app.bootstrap(cmpFactory);
            // The component should see the child module providers
            matchers_1.expect(component.injector.get('hello')).toEqual('component');
        })));
        it('should bootstrap a component with a custom selector', testing_1.async(testing_1.inject([application_ref_1.ApplicationRef, core_1.Compiler], function (app, compiler) {
            var SomeComponent = /** @class */ (function () {
                function SomeComponent() {
                }
                SomeComponent = __decorate([
                    core_1.Component({
                        selector: 'bootstrap-app',
                        template: '',
                    })
                ], SomeComponent);
                return SomeComponent;
            }());
            var SomeModule = /** @class */ (function () {
                function SomeModule() {
                }
                SomeModule = __decorate([
                    core_1.NgModule({
                        providers: [{ provide: 'hello', useValue: 'component' }],
                        declarations: [SomeComponent],
                        entryComponents: [SomeComponent],
                    })
                ], SomeModule);
                return SomeModule;
            }());
            createRootEl('custom-selector');
            var modFactory = compiler.compileModuleSync(SomeModule);
            var module = modFactory.create(testing_1.TestBed);
            var cmpFactory = module.componentFactoryResolver.resolveComponentFactory(SomeComponent);
            var component = app.bootstrap(cmpFactory, 'custom-selector');
            // The component should see the child module providers
            matchers_1.expect(component.injector.get('hello')).toEqual('component');
        })));
        describe('ApplicationRef', function () {
            beforeEach(function () { testing_1.TestBed.configureTestingModule({ imports: [createModule()] }); });
            it('should throw when reentering tick', function () {
                var ReenteringComponent = /** @class */ (function () {
                    function ReenteringComponent(appRef) {
                        this.appRef = appRef;
                        this.reenterCount = 1;
                    }
                    ReenteringComponent.prototype.reenter = function () {
                        if (this.reenterCount--) {
                            try {
                                this.appRef.tick();
                            }
                            catch (e) {
                                this.reenterErr = e;
                            }
                        }
                    };
                    ReenteringComponent = __decorate([
                        core_1.Component({ template: '{{reenter()}}' }),
                        __metadata("design:paramtypes", [application_ref_1.ApplicationRef])
                    ], ReenteringComponent);
                    return ReenteringComponent;
                }());
                var fixture = testing_1.TestBed.configureTestingModule({ declarations: [ReenteringComponent] })
                    .createComponent(ReenteringComponent);
                var appRef = testing_1.TestBed.get(application_ref_1.ApplicationRef);
                appRef.attachView(fixture.componentRef.hostView);
                appRef.tick();
                matchers_1.expect(fixture.componentInstance.reenterErr.message)
                    .toBe('ApplicationRef.tick is called recursively');
            });
            describe('APP_BOOTSTRAP_LISTENER', function () {
                var capturedCompRefs;
                beforeEach(function () {
                    capturedCompRefs = [];
                    testing_1.TestBed.configureTestingModule({
                        providers: [{
                                provide: core_1.APP_BOOTSTRAP_LISTENER,
                                multi: true,
                                useValue: function (compRef) { capturedCompRefs.push(compRef); }
                            }]
                    });
                });
                it('should be called when a component is bootstrapped', testing_1.inject([application_ref_1.ApplicationRef], function (ref) {
                    createRootEl();
                    var compRef = ref.bootstrap(SomeComponent);
                    matchers_1.expect(capturedCompRefs).toEqual([compRef]);
                }));
            });
            describe('bootstrap', function () {
                it('should throw if an APP_INITIIALIZER is not yet resolved', testing_1.withModule({
                    providers: [
                        { provide: core_1.APP_INITIALIZER, useValue: function () { return new Promise(function () { }); }, multi: true }
                    ]
                }, testing_1.inject([application_ref_1.ApplicationRef], function (ref) {
                    createRootEl();
                    matchers_1.expect(function () { return ref.bootstrap(SomeComponent); })
                        .toThrowError('Cannot bootstrap as there are still asynchronous initializers running. Bootstrap components in the `ngDoBootstrap` method of the root module.');
                })));
            });
        });
        describe('bootstrapModule', function () {
            var defaultPlatform;
            beforeEach(testing_1.inject([core_1.PlatformRef], function (_platform) {
                createRootEl();
                defaultPlatform = _platform;
            }));
            it('should wait for asynchronous app initializers', testing_1.async(function () {
                var resolve;
                var promise = new Promise(function (res) { resolve = res; });
                var initializerDone = false;
                setTimeout(function () {
                    resolve(true);
                    initializerDone = true;
                }, 1);
                defaultPlatform
                    .bootstrapModule(createModule([{ provide: core_1.APP_INITIALIZER, useValue: function () { return promise; }, multi: true }]))
                    .then(function (_) { matchers_1.expect(initializerDone).toBe(true); });
            }));
            it('should rethrow sync errors even if the exceptionHandler is not rethrowing', testing_1.async(function () {
                defaultPlatform
                    .bootstrapModule(createModule([{ provide: core_1.APP_INITIALIZER, useValue: function () { throw 'Test'; }, multi: true }]))
                    .then(function () { return matchers_1.expect(false).toBe(true); }, function (e) {
                    matchers_1.expect(e).toBe('Test');
                    // Error rethrown will be seen by the exception handler since it's after
                    // construction.
                    matchers_1.expect(mockConsole.res[0].join('#')).toEqual('ERROR#Test');
                });
            }));
            it('should rethrow promise errors even if the exceptionHandler is not rethrowing', testing_1.async(function () {
                defaultPlatform
                    .bootstrapModule(createModule([
                    { provide: core_1.APP_INITIALIZER, useValue: function () { return Promise.reject('Test'); }, multi: true }
                ]))
                    .then(function () { return matchers_1.expect(false).toBe(true); }, function (e) {
                    matchers_1.expect(e).toBe('Test');
                    matchers_1.expect(mockConsole.res[0].join('#')).toEqual('ERROR#Test');
                });
            }));
            it('should throw useful error when ApplicationRef is not configured', testing_1.async(function () {
                var EmptyModule = /** @class */ (function () {
                    function EmptyModule() {
                    }
                    EmptyModule = __decorate([
                        core_1.NgModule()
                    ], EmptyModule);
                    return EmptyModule;
                }());
                return defaultPlatform.bootstrapModule(EmptyModule)
                    .then(function () { return fail('expecting error'); }, function (error) {
                    matchers_1.expect(error.message)
                        .toEqual('No ErrorHandler. Is platform module (BrowserModule) included?');
                });
            }));
            it('should call the `ngDoBootstrap` method with `ApplicationRef` on the main module', testing_1.async(function () {
                var ngDoBootstrap = jasmine.createSpy('ngDoBootstrap');
                defaultPlatform.bootstrapModule(createModule({ ngDoBootstrap: ngDoBootstrap }))
                    .then(function (moduleRef) {
                    var appRef = moduleRef.injector.get(application_ref_1.ApplicationRef);
                    matchers_1.expect(ngDoBootstrap).toHaveBeenCalledWith(appRef);
                });
            }));
            it('should auto bootstrap components listed in @NgModule.bootstrap', testing_1.async(function () {
                defaultPlatform.bootstrapModule(createModule({ bootstrap: [SomeComponent] }))
                    .then(function (moduleRef) {
                    var appRef = moduleRef.injector.get(application_ref_1.ApplicationRef);
                    matchers_1.expect(appRef.componentTypes).toEqual([SomeComponent]);
                });
            }));
            it('should error if neither `ngDoBootstrap` nor @NgModule.bootstrap was specified', testing_1.async(function () {
                defaultPlatform.bootstrapModule(createModule({ ngDoBootstrap: false }))
                    .then(function () { return matchers_1.expect(false).toBe(true); }, function (e) {
                    var expectedErrMsg = "The module MyModule was bootstrapped, but it does not declare \"@NgModule.bootstrap\" components nor a \"ngDoBootstrap\" method. Please define one of these.";
                    matchers_1.expect(e.message).toEqual(expectedErrMsg);
                    matchers_1.expect(mockConsole.res[0].join('#')).toEqual('ERROR#Error: ' + expectedErrMsg);
                });
            }));
            it('should add bootstrapped module into platform modules list', testing_1.async(function () {
                defaultPlatform.bootstrapModule(createModule({ bootstrap: [SomeComponent] }))
                    .then(function (module) { return matchers_1.expect(defaultPlatform._modules).toContain(module); });
            }));
            it('should bootstrap with NoopNgZone', testing_1.async(function () {
                defaultPlatform
                    .bootstrapModule(createModule({ bootstrap: [SomeComponent] }), { ngZone: 'noop' })
                    .then(function (module) {
                    var ngZone = module.injector.get(core_1.NgZone);
                    matchers_1.expect(ngZone instanceof ng_zone_1.NoopNgZone).toBe(true);
                });
            }));
        });
        describe('bootstrapModuleFactory', function () {
            var defaultPlatform;
            beforeEach(testing_1.inject([core_1.PlatformRef], function (_platform) {
                createRootEl();
                defaultPlatform = _platform;
            }));
            it('should wait for asynchronous app initializers', testing_1.async(function () {
                var resolve;
                var promise = new Promise(function (res) { resolve = res; });
                var initializerDone = false;
                setTimeout(function () {
                    resolve(true);
                    initializerDone = true;
                }, 1);
                var compilerFactory = defaultPlatform.injector.get(core_1.CompilerFactory, null);
                var moduleFactory = compilerFactory.createCompiler().compileModuleSync(createModule([{ provide: core_1.APP_INITIALIZER, useValue: function () { return promise; }, multi: true }]));
                defaultPlatform.bootstrapModuleFactory(moduleFactory).then(function (_) {
                    matchers_1.expect(initializerDone).toBe(true);
                });
            }));
            it('should rethrow sync errors even if the exceptionHandler is not rethrowing', testing_1.async(function () {
                var compilerFactory = defaultPlatform.injector.get(core_1.CompilerFactory, null);
                var moduleFactory = compilerFactory.createCompiler().compileModuleSync(createModule([{ provide: core_1.APP_INITIALIZER, useValue: function () { throw 'Test'; }, multi: true }]));
                matchers_1.expect(function () { return defaultPlatform.bootstrapModuleFactory(moduleFactory); }).toThrow('Test');
                // Error rethrown will be seen by the exception handler since it's after
                // construction.
                matchers_1.expect(mockConsole.res[0].join('#')).toEqual('ERROR#Test');
            }));
            it('should rethrow promise errors even if the exceptionHandler is not rethrowing', testing_1.async(function () {
                var compilerFactory = defaultPlatform.injector.get(core_1.CompilerFactory, null);
                var moduleFactory = compilerFactory.createCompiler().compileModuleSync(createModule([{ provide: core_1.APP_INITIALIZER, useValue: function () { return Promise.reject('Test'); }, multi: true }]));
                defaultPlatform.bootstrapModuleFactory(moduleFactory)
                    .then(function () { return matchers_1.expect(false).toBe(true); }, function (e) {
                    matchers_1.expect(e).toBe('Test');
                    matchers_1.expect(mockConsole.res[0].join('#')).toEqual('ERROR#Test');
                });
            }));
        });
        describe('attachView / detachView', function () {
            var MyComp = /** @class */ (function () {
                function MyComp() {
                    this.name = 'Initial';
                }
                MyComp = __decorate([
                    core_1.Component({ template: '{{name}}' })
                ], MyComp);
                return MyComp;
            }());
            var ContainerComp = /** @class */ (function () {
                function ContainerComp() {
                }
                __decorate([
                    core_1.ViewChild('vc', { read: core_1.ViewContainerRef }),
                    __metadata("design:type", core_1.ViewContainerRef)
                ], ContainerComp.prototype, "vc", void 0);
                ContainerComp = __decorate([
                    core_1.Component({ template: '<ng-container #vc></ng-container>' })
                ], ContainerComp);
                return ContainerComp;
            }());
            var EmbeddedViewComp = /** @class */ (function () {
                function EmbeddedViewComp() {
                }
                __decorate([
                    core_1.ViewChild(core_1.TemplateRef),
                    __metadata("design:type", core_1.TemplateRef)
                ], EmbeddedViewComp.prototype, "tplRef", void 0);
                EmbeddedViewComp = __decorate([
                    core_1.Component({ template: '<ng-template #t>Dynamic content</ng-template>' })
                ], EmbeddedViewComp);
                return EmbeddedViewComp;
            }());
            beforeEach(function () {
                testing_1.TestBed.configureTestingModule({
                    declarations: [MyComp, ContainerComp, EmbeddedViewComp],
                    providers: [{ provide: testing_1.ComponentFixtureNoNgZone, useValue: true }]
                });
            });
            it('should dirty check attached views', function () {
                var comp = testing_1.TestBed.createComponent(MyComp);
                var appRef = testing_1.TestBed.get(application_ref_1.ApplicationRef);
                matchers_1.expect(appRef.viewCount).toBe(0);
                appRef.tick();
                matchers_1.expect(comp.nativeElement).toHaveText('');
                appRef.attachView(comp.componentRef.hostView);
                appRef.tick();
                matchers_1.expect(appRef.viewCount).toBe(1);
                matchers_1.expect(comp.nativeElement).toHaveText('Initial');
            });
            it('should not dirty check detached views', function () {
                var comp = testing_1.TestBed.createComponent(MyComp);
                var appRef = testing_1.TestBed.get(application_ref_1.ApplicationRef);
                appRef.attachView(comp.componentRef.hostView);
                appRef.tick();
                matchers_1.expect(comp.nativeElement).toHaveText('Initial');
                appRef.detachView(comp.componentRef.hostView);
                comp.componentInstance.name = 'New';
                appRef.tick();
                matchers_1.expect(appRef.viewCount).toBe(0);
                matchers_1.expect(comp.nativeElement).toHaveText('Initial');
            });
            it('should detach attached views if they are destroyed', function () {
                var comp = testing_1.TestBed.createComponent(MyComp);
                var appRef = testing_1.TestBed.get(application_ref_1.ApplicationRef);
                appRef.attachView(comp.componentRef.hostView);
                comp.destroy();
                matchers_1.expect(appRef.viewCount).toBe(0);
            });
            it('should detach attached embedded views if they are destroyed', function () {
                var comp = testing_1.TestBed.createComponent(EmbeddedViewComp);
                var appRef = testing_1.TestBed.get(application_ref_1.ApplicationRef);
                var embeddedViewRef = comp.componentInstance.tplRef.createEmbeddedView({});
                appRef.attachView(embeddedViewRef);
                embeddedViewRef.destroy();
                matchers_1.expect(appRef.viewCount).toBe(0);
            });
            it('should not allow to attach a view to both, a view container and the ApplicationRef', function () {
                var comp = testing_1.TestBed.createComponent(MyComp);
                var hostView = comp.componentRef.hostView;
                var containerComp = testing_1.TestBed.createComponent(ContainerComp);
                containerComp.detectChanges();
                var vc = containerComp.componentInstance.vc;
                var appRef = testing_1.TestBed.get(application_ref_1.ApplicationRef);
                vc.insert(hostView);
                matchers_1.expect(function () { return appRef.attachView(hostView); })
                    .toThrowError('This view is already attached to a ViewContainer!');
                hostView = vc.detach(0);
                appRef.attachView(hostView);
                matchers_1.expect(function () { return vc.insert(hostView); })
                    .toThrowError('This view is already attached directly to the ApplicationRef!');
            });
        });
    });
    describe('AppRef', function () {
        var SyncComp = /** @class */ (function () {
            function SyncComp() {
                this.text = '1';
            }
            SyncComp = __decorate([
                core_1.Component({ selector: 'sync-comp', template: "<span>{{text}}</span>" })
            ], SyncComp);
            return SyncComp;
        }());
        var ClickComp = /** @class */ (function () {
            function ClickComp() {
                this.text = '1';
            }
            ClickComp.prototype.onClick = function () { this.text += '1'; };
            ClickComp = __decorate([
                core_1.Component({ selector: 'click-comp', template: "<span (click)=\"onClick()\">{{text}}</span>" })
            ], ClickComp);
            return ClickComp;
        }());
        var MicroTaskComp = /** @class */ (function () {
            function MicroTaskComp() {
                this.text = '1';
            }
            MicroTaskComp.prototype.ngOnInit = function () {
                var _this = this;
                Promise.resolve(null).then(function (_) { _this.text += '1'; });
            };
            MicroTaskComp = __decorate([
                core_1.Component({ selector: 'micro-task-comp', template: "<span>{{text}}</span>" })
            ], MicroTaskComp);
            return MicroTaskComp;
        }());
        var MacroTaskComp = /** @class */ (function () {
            function MacroTaskComp() {
                this.text = '1';
            }
            MacroTaskComp.prototype.ngOnInit = function () {
                var _this = this;
                setTimeout(function () { _this.text += '1'; }, 10);
            };
            MacroTaskComp = __decorate([
                core_1.Component({ selector: 'macro-task-comp', template: "<span>{{text}}</span>" })
            ], MacroTaskComp);
            return MacroTaskComp;
        }());
        var MicroMacroTaskComp = /** @class */ (function () {
            function MicroMacroTaskComp() {
                this.text = '1';
            }
            MicroMacroTaskComp.prototype.ngOnInit = function () {
                var _this = this;
                Promise.resolve(null).then(function (_) {
                    _this.text += '1';
                    setTimeout(function () { _this.text += '1'; }, 10);
                });
            };
            MicroMacroTaskComp = __decorate([
                core_1.Component({ selector: 'micro-macro-task-comp', template: "<span>{{text}}</span>" })
            ], MicroMacroTaskComp);
            return MicroMacroTaskComp;
        }());
        var MacroMicroTaskComp = /** @class */ (function () {
            function MacroMicroTaskComp() {
                this.text = '1';
            }
            MacroMicroTaskComp.prototype.ngOnInit = function () {
                var _this = this;
                setTimeout(function () {
                    _this.text += '1';
                    Promise.resolve(null).then(function (_) { _this.text += '1'; });
                }, 10);
            };
            MacroMicroTaskComp = __decorate([
                core_1.Component({ selector: 'macro-micro-task-comp', template: "<span>{{text}}</span>" })
            ], MacroMicroTaskComp);
            return MacroMicroTaskComp;
        }());
        var stableCalled = false;
        beforeEach(function () {
            stableCalled = false;
            testing_1.TestBed.configureTestingModule({
                declarations: [
                    SyncComp, MicroTaskComp, MacroTaskComp, MicroMacroTaskComp, MacroMicroTaskComp, ClickComp
                ],
            });
        });
        afterEach(function () { matchers_1.expect(stableCalled).toBe(true, 'isStable did not emit true on stable'); });
        function expectStableTexts(component, expected) {
            var fixture = testing_1.TestBed.createComponent(component);
            var appRef = testing_1.TestBed.get(application_ref_1.ApplicationRef);
            var zone = testing_1.TestBed.get(core_1.NgZone);
            appRef.attachView(fixture.componentRef.hostView);
            zone.run(function () { return appRef.tick(); });
            var i = 0;
            appRef.isStable.subscribe({
                next: function (stable) {
                    if (stable) {
                        matchers_1.expect(i).toBeLessThan(expected.length);
                        matchers_1.expect(fixture.nativeElement).toHaveText(expected[i++]);
                        stableCalled = true;
                    }
                }
            });
        }
        it('isStable should fire on synchronous component loading', testing_1.async(function () { expectStableTexts(SyncComp, ['1']); }));
        it('isStable should fire after a microtask on init is completed', testing_1.async(function () { expectStableTexts(MicroTaskComp, ['11']); }));
        it('isStable should fire after a macrotask on init is completed', testing_1.async(function () { expectStableTexts(MacroTaskComp, ['11']); }));
        it('isStable should fire only after chain of micro and macrotasks on init are completed', testing_1.async(function () { expectStableTexts(MicroMacroTaskComp, ['111']); }));
        it('isStable should fire only after chain of macro and microtasks on init are completed', testing_1.async(function () { expectStableTexts(MacroMicroTaskComp, ['111']); }));
        describe('unstable', function () {
            var unstableCalled = false;
            afterEach(function () { matchers_1.expect(unstableCalled).toBe(true, 'isStable did not emit false on unstable'); });
            function expectUnstable(appRef) {
                appRef.isStable.subscribe({
                    next: function (stable) {
                        if (stable) {
                            stableCalled = true;
                        }
                        if (!stable) {
                            unstableCalled = true;
                        }
                    }
                });
            }
            it('should be fired after app becomes unstable', testing_1.async(function () {
                var fixture = testing_1.TestBed.createComponent(ClickComp);
                var appRef = testing_1.TestBed.get(application_ref_1.ApplicationRef);
                var zone = testing_1.TestBed.get(core_1.NgZone);
                appRef.attachView(fixture.componentRef.hostView);
                zone.run(function () { return appRef.tick(); });
                fixture.whenStable().then(function () {
                    expectUnstable(appRef);
                    var element = fixture.debugElement.children[0];
                    browser_util_1.dispatchEvent(element.nativeElement, 'click');
                });
            }));
        });
    });
}
var MockConsole = /** @class */ (function () {
    function MockConsole() {
        this.res = [];
    }
    MockConsole.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        // Logging from ErrorHandler should run outside of the Angular Zone.
        core_1.NgZone.assertNotInAngularZone();
        this.res.push(args);
    };
    MockConsole.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        // Logging from ErrorHandler should run outside of the Angular Zone.
        core_1.NgZone.assertNotInAngularZone();
        this.res.push(args);
    };
    return MockConsole;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb25fcmVmX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvYXBwbGljYXRpb25fcmVmX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBMkw7QUFDM0wscUVBQWlFO0FBQ2pFLGlFQUE2RDtBQUU3RCw4REFBd0Q7QUFDeEQsNkVBQXFFO0FBQ3JFLDJFQUFzRTtBQUN0RSxtRkFBaUY7QUFDakYsMkVBQXNFO0FBQ3RFLCtDQUErQztBQUMvQyxzQ0FBd0Y7QUFHeEY7SUFBQTtJQUNBLENBQUM7SUFESyxhQUFhO1FBRGxCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsZUFBZSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUMsQ0FBQztPQUNwRCxhQUFhLENBQ2xCO0lBQUQsb0JBQUM7Q0FBQSxBQURELElBQ0M7QUFFRDtJQUNFLFFBQVEsQ0FBQyxXQUFXLEVBQUU7UUFDcEIsSUFBSSxXQUF3QixDQUFDO1FBRTdCLFVBQVUsQ0FBQyxjQUFRLFdBQVcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdkQsc0JBQXNCLFFBQTBCO1lBQTFCLHlCQUFBLEVBQUEsMEJBQTBCO1lBQzlDLElBQU0sR0FBRyxHQUFHLGlCQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFRLENBQUMsQ0FBQztZQUNsQyxJQUFNLE1BQU0sR0FBZ0Isb0JBQU0sRUFBRSxDQUFDLFVBQVUsQ0FDM0Msb0JBQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQyxvQkFBTSxFQUFFLENBQUMsY0FBYyxDQUFDLE1BQUksUUFBUSxXQUFNLFFBQVEsTUFBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlFLElBQU0sUUFBUSxHQUFHLG9CQUFNLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFD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