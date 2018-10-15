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
var compiler_1 = require("@angular/compiler");
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
// Services, and components for the tests.
var ChildComp = /** @class */ (function () {
    function ChildComp() {
        this.childBinding = 'Child';
    }
    ChildComp = __decorate([
        core_1.Component({ selector: 'child-comp', template: "<span>Original {{childBinding}}</span>" }),
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], ChildComp);
    return ChildComp;
}());
var MockChildComp = /** @class */ (function () {
    function MockChildComp() {
    }
    MockChildComp = __decorate([
        core_1.Component({ selector: 'child-comp', template: "<span>Mock</span>" }),
        core_1.Injectable()
    ], MockChildComp);
    return MockChildComp;
}());
var ParentComp = /** @class */ (function () {
    function ParentComp() {
    }
    ParentComp = __decorate([
        core_1.Component({
            selector: 'parent-comp',
            template: "Parent(<child-comp></child-comp>)",
        }),
        core_1.Injectable()
    ], ParentComp);
    return ParentComp;
}());
var MyIfComp = /** @class */ (function () {
    function MyIfComp() {
        this.showMore = false;
    }
    MyIfComp = __decorate([
        core_1.Component({ selector: 'my-if-comp', template: "MyIf(<span *ngIf=\"showMore\">More</span>)" }),
        core_1.Injectable()
    ], MyIfComp);
    return MyIfComp;
}());
var ChildChildComp = /** @class */ (function () {
    function ChildChildComp() {
    }
    ChildChildComp = __decorate([
        core_1.Component({ selector: 'child-child-comp', template: "<span>ChildChild</span>" }),
        core_1.Injectable()
    ], ChildChildComp);
    return ChildChildComp;
}());
var ChildWithChildComp = /** @class */ (function () {
    function ChildWithChildComp() {
        this.childBinding = 'Child';
    }
    ChildWithChildComp = __decorate([
        core_1.Component({
            selector: 'child-comp',
            template: "<span>Original {{childBinding}}(<child-child-comp></child-child-comp>)</span>",
        }),
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], ChildWithChildComp);
    return ChildWithChildComp;
}());
var FancyService = /** @class */ (function () {
    function FancyService() {
        this.value = 'real value';
    }
    FancyService.prototype.getAsyncValue = function () { return Promise.resolve('async value'); };
    FancyService.prototype.getTimeoutValue = function () {
        return new Promise(function (resolve, reject) { return setTimeout(function () { return resolve('timeout value'); }, 10); });
    };
    return FancyService;
}());
var MockFancyService = /** @class */ (function (_super) {
    __extends(MockFancyService, _super);
    function MockFancyService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.value = 'mocked out value';
        return _this;
    }
    return MockFancyService;
}(FancyService));
var TestProvidersComp = /** @class */ (function () {
    function TestProvidersComp(fancyService) {
        this.fancyService = fancyService;
    }
    TestProvidersComp = __decorate([
        core_1.Component({
            selector: 'my-service-comp',
            providers: [FancyService],
            template: "injected value: {{fancyService.value}}"
        }),
        __metadata("design:paramtypes", [FancyService])
    ], TestProvidersComp);
    return TestProvidersComp;
}());
var TestViewProvidersComp = /** @class */ (function () {
    function TestViewProvidersComp(fancyService) {
        this.fancyService = fancyService;
    }
    TestViewProvidersComp = __decorate([
        core_1.Component({
            selector: 'my-service-comp',
            viewProviders: [FancyService],
            template: "injected value: {{fancyService.value}}"
        }),
        __metadata("design:paramtypes", [FancyService])
    ], TestViewProvidersComp);
    return TestViewProvidersComp;
}());
var SomeDirective = /** @class */ (function () {
    function SomeDirective() {
    }
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], SomeDirective.prototype, "someDir", void 0);
    SomeDirective = __decorate([
        core_1.Directive({ selector: '[someDir]', host: { '[title]': 'someDir' } })
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
var SomeLibModule = /** @class */ (function () {
    function SomeLibModule() {
    }
    SomeLibModule = __decorate([
        core_1.NgModule()
    ], SomeLibModule);
    return SomeLibModule;
}());
var CompWithUrlTemplate = /** @class */ (function () {
    function CompWithUrlTemplate() {
    }
    CompWithUrlTemplate = __decorate([
        core_1.Component({
            selector: 'comp',
            templateUrl: '/base/angular/packages/platform-browser/test/static_assets/test.html'
        })
    ], CompWithUrlTemplate);
    return CompWithUrlTemplate;
}());
{
    describe('public testing API', function () {
        describe('using the async helper with context passing', function () {
            beforeEach(function () { this.actuallyDone = false; });
            afterEach(function () { matchers_1.expect(this.actuallyDone).toEqual(true); });
            it('should run normal tests', function () { this.actuallyDone = true; });
            it('should run normal async tests', function (done) {
                var _this = this;
                setTimeout(function () {
                    _this.actuallyDone = true;
                    done();
                }, 0);
            });
            it('should run async tests with tasks', testing_1.async(function () {
                var _this = this;
                setTimeout(function () { return _this.actuallyDone = true; }, 0);
            }));
            it('should run async tests with promises', testing_1.async(function () {
                var _this = this;
                var p = new Promise(function (resolve, reject) { return setTimeout(resolve, 10); });
                p.then(function () { return _this.actuallyDone = true; });
            }));
        });
        describe('basic context passing to inject, fakeAsync and withModule helpers', function () {
            var moduleConfig = {
                providers: [FancyService],
            };
            beforeEach(function () { this.contextModified = false; });
            afterEach(function () { matchers_1.expect(this.contextModified).toEqual(true); });
            it('should pass context to inject helper', testing_1.inject([], function () { this.contextModified = true; }));
            it('should pass context to fakeAsync helper', testing_1.fakeAsync(function () { this.contextModified = true; }));
            it('should pass context to withModule helper - simple', testing_1.withModule(moduleConfig, function () { this.contextModified = true; }));
            it('should pass context to withModule helper - advanced', testing_1.withModule(moduleConfig).inject([FancyService], function (service) {
                matchers_1.expect(service.value).toBe('real value');
                this.contextModified = true;
            }));
            it('should preserve context when async and inject helpers are combined', testing_1.async(testing_1.inject([], function () {
                var _this = this;
                setTimeout(function () { return _this.contextModified = true; }, 0);
            })));
            it('should preserve context when fakeAsync and inject helpers are combined', testing_1.fakeAsync(testing_1.inject([], function () {
                var _this = this;
                setTimeout(function () { return _this.contextModified = true; }, 0);
                testing_1.tick(1);
            })));
        });
        describe('using the test injector with the inject helper', function () {
            describe('setting up Providers', function () {
                beforeEach(function () {
                    testing_1.TestBed.configureTestingModule({ providers: [{ provide: FancyService, useValue: new FancyService() }] });
                    it('should use set up providers', testing_1.inject([FancyService], function (service) {
                        matchers_1.expect(service.value).toEqual('real value');
                    }));
                    it('should wait until returned promises', testing_1.async(testing_1.inject([FancyService], function (service) {
                        service.getAsyncValue().then(function (value) { return matchers_1.expect(value).toEqual('async value'); });
                        service.getTimeoutValue().then(function (value) { return matchers_1.expect(value).toEqual('timeout value'); });
                    })));
                    it('should allow the use of fakeAsync', testing_1.fakeAsync(testing_1.inject([FancyService], function (service) {
                        var value = undefined;
                        service.getAsyncValue().then(function (val) { return value = val; });
                        testing_1.tick();
                        matchers_1.expect(value).toEqual('async value');
                    })));
                    it('should allow use of "done"', function (done) {
                        testing_1.inject([FancyService], function (service) {
                            var count = 0;
                            var id = setInterval(function () {
                                count++;
                                if (count > 2) {
                                    clearInterval(id);
                                    done();
                                }
                            }, 5);
                        })(); // inject needs to be invoked explicitly with ().
                    });
                    describe('using beforeEach', function () {
                        beforeEach(testing_1.inject([FancyService], function (service) {
                            service.value = 'value modified in beforeEach';
                        }));
                        it('should use modified providers', testing_1.inject([FancyService], function (service) {
                            matchers_1.expect(service.value).toEqual('value modified in beforeEach');
                        }));
                    });
                    describe('using async beforeEach', function () {
                        beforeEach(testing_1.async(testing_1.inject([FancyService], function (service) {
                            service.getAsyncValue().then(function (value) { return service.value = value; });
                        })));
                        it('should use asynchronously modified value', testing_1.inject([FancyService], function (service) {
                            matchers_1.expect(service.value).toEqual('async value');
                        }));
                    });
                });
            });
        });
        describe('using the test injector with modules', function () {
            var moduleConfig = {
                providers: [FancyService],
                imports: [SomeLibModule],
                declarations: [SomeDirective, SomePipe, CompUsingModuleDirectiveAndPipe],
            };
            describe('setting up a module', function () {
                beforeEach(function () { return testing_1.TestBed.configureTestingModule(moduleConfig); });
                it('should use set up providers', testing_1.inject([FancyService], function (service) {
                    matchers_1.expect(service.value).toEqual('real value');
                }));
                it('should be able to create any declared components', function () {
                    var compFixture = testing_1.TestBed.createComponent(CompUsingModuleDirectiveAndPipe);
                    matchers_1.expect(compFixture.componentInstance).toBeAnInstanceOf(CompUsingModuleDirectiveAndPipe);
                });
                it('should use set up directives and pipes', function () {
                    var compFixture = testing_1.TestBed.createComponent(CompUsingModuleDirectiveAndPipe);
                    var el = compFixture.debugElement;
                    compFixture.detectChanges();
                    matchers_1.expect(el.children[0].properties['title']).toBe('transformed someValue');
                });
                it('should use set up imported modules', testing_1.inject([SomeLibModule], function (libModule) {
                    matchers_1.expect(libModule).toBeAnInstanceOf(SomeLibModule);
                }));
                describe('provided schemas', function () {
                    var ComponentUsingInvalidProperty = /** @class */ (function () {
                        function ComponentUsingInvalidProperty() {
                        }
                        ComponentUsingInvalidProperty = __decorate([
                            core_1.Component({ template: '<some-element [someUnknownProp]="true"></some-element>' })
                        ], ComponentUsingInvalidProperty);
                        return ComponentUsingInvalidProperty;
                    }());
                    beforeEach(function () {
                        testing_1.TestBed.configureTestingModule({ schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA], declarations: [ComponentUsingInvalidProperty] });
                    });
                    it('should not error on unknown bound properties on custom elements when using the CUSTOM_ELEMENTS_SCHEMA', function () {
                        matchers_1.expect(testing_1.TestBed.createComponent(ComponentUsingInvalidProperty).componentInstance)
                            .toBeAnInstanceOf(ComponentUsingInvalidProperty);
                    });
                });
            });
            describe('per test modules', function () {
                it('should use set up providers', testing_1.withModule(moduleConfig).inject([FancyService], function (service) {
                    matchers_1.expect(service.value).toEqual('real value');
                }));
                it('should use set up directives and pipes', testing_1.withModule(moduleConfig, function () {
                    var compFixture = testing_1.TestBed.createComponent(CompUsingModuleDirectiveAndPipe);
                    var el = compFixture.debugElement;
                    compFixture.detectChanges();
                    matchers_1.expect(el.children[0].properties['title']).toBe('transformed someValue');
                }));
                it('should use set up library modules', testing_1.withModule(moduleConfig).inject([SomeLibModule], function (libModule) {
                    matchers_1.expect(libModule).toBeAnInstanceOf(SomeLibModule);
                }));
            });
            describe('components with template url', function () {
                beforeEach(testing_1.async(function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [CompWithUrlTemplate] });
                    testing_1.TestBed.compileComponents();
                }));
                it('should allow to createSync components with templateUrl after explicit async compilation', function () {
                    var fixture = testing_1.TestBed.createComponent(CompWithUrlTemplate);
                    matchers_1.expect(fixture.nativeElement).toHaveText('from external template');
                });
            });
            describe('overwriting metadata', function () {
                var SomePipe = /** @class */ (function () {
                    function SomePipe() {
                    }
                    SomePipe.prototype.transform = function (value) { return "transformed " + value; };
                    SomePipe = __decorate([
                        core_1.Pipe({ name: 'undefined' })
                    ], SomePipe);
                    return SomePipe;
                }());
                var SomeDirective = /** @class */ (function () {
                    function SomeDirective() {
                        this.someProp = 'hello';
                    }
                    SomeDirective = __decorate([
                        core_1.Directive({ selector: '[undefined]' })
                    ], SomeDirective);
                    return SomeDirective;
                }());
                var SomeComponent = /** @class */ (function () {
                    function SomeComponent() {
                    }
                    SomeComponent = __decorate([
                        core_1.Component({ selector: 'comp', template: 'someText' })
                    ], SomeComponent);
                    return SomeComponent;
                }());
                var SomeOtherComponent = /** @class */ (function () {
                    function SomeOtherComponent() {
                    }
                    SomeOtherComponent = __decorate([
                        core_1.Component({ selector: 'comp', template: 'someOtherText' })
                    ], SomeOtherComponent);
                    return SomeOtherComponent;
                }());
                var SomeModule = /** @class */ (function () {
                    function SomeModule() {
                    }
                    SomeModule = __decorate([
                        core_1.NgModule({ declarations: [SomeComponent, SomeDirective, SomePipe] })
                    ], SomeModule);
                    return SomeModule;
                }());
                beforeEach(function () { return testing_1.TestBed.configureTestingModule({ imports: [SomeModule] }); });
                describe('module', function () {
                    beforeEach(function () {
                        testing_1.TestBed.overrideModule(SomeModule, { set: { declarations: [SomeOtherComponent] } });
                    });
                    it('should work', function () {
                        matchers_1.expect(testing_1.TestBed.createComponent(SomeOtherComponent).componentInstance)
                            .toBeAnInstanceOf(SomeOtherComponent);
                    });
                });
                describe('component', function () {
                    beforeEach(function () {
                        testing_1.TestBed.overrideComponent(SomeComponent, { set: { selector: 'comp', template: 'newText' } });
                    });
                    it('should work', function () {
                        matchers_1.expect(testing_1.TestBed.createComponent(SomeComponent).nativeElement).toHaveText('newText');
                    });
                });
                describe('directive', function () {
                    beforeEach(function () {
                        testing_1.TestBed
                            .overrideComponent(SomeComponent, { set: { selector: 'comp', template: "<div someDir></div>" } })
                            .overrideDirective(SomeDirective, { set: { selector: '[someDir]', host: { '[title]': 'someProp' } } });
                    });
                    it('should work', function () {
                        var compFixture = testing_1.TestBed.createComponent(SomeComponent);
                        compFixture.detectChanges();
                        matchers_1.expect(compFixture.debugElement.children[0].properties['title']).toEqual('hello');
                    });
                });
                describe('pipe', function () {
                    beforeEach(function () {
                        testing_1.TestBed
                            .overrideComponent(SomeComponent, { set: { selector: 'comp', template: "{{'hello' | somePipe}}" } })
                            .overridePipe(SomePipe, { set: { name: 'somePipe' } })
                            .overridePipe(SomePipe, { add: { pure: false } });
                    });
                    it('should work', function () {
                        var compFixture = testing_1.TestBed.createComponent(SomeComponent);
                        compFixture.detectChanges();
                        matchers_1.expect(compFixture.nativeElement).toHaveText('transformed hello');
                    });
                });
                describe('template', function () {
                    var testBedSpy;
                    beforeEach(function () {
                        testBedSpy = spyOn(testing_1.getTestBed(), 'overrideComponent').and.callThrough();
                        testing_1.TestBed.overrideTemplate(SomeComponent, 'newText');
                    });
                    it("should override component's template", function () {
                        var fixture = testing_1.TestBed.createComponent(SomeComponent);
                        matchers_1.expect(fixture.nativeElement).toHaveText('newText');
                        matchers_1.expect(testBedSpy).toHaveBeenCalledWith(SomeComponent, {
                            set: { template: 'newText', templateUrl: null }
                        });
                    });
                });
            });
            describe('overriding providers', function () {
                describe('in NgModules', function () {
                    it('should support useValue', function () {
                        testing_1.TestBed.configureTestingModule({
                            providers: [
                                { provide: 'a', useValue: 'aValue' },
                            ]
                        });
                        testing_1.TestBed.overrideProvider('a', { useValue: 'mockValue' });
                        matchers_1.expect(testing_1.TestBed.get('a')).toBe('mockValue');
                    });
                    it('should support useFactory', function () {
                        testing_1.TestBed.configureTestingModule({
                            providers: [
                                { provide: 'dep', useValue: 'depValue' },
                                { provide: 'a', useValue: 'aValue' },
                            ]
                        });
                        testing_1.TestBed.overrideProvider('a', { useFactory: function (dep) { return "mockA: " + dep; }, deps: ['dep'] });
                        matchers_1.expect(testing_1.TestBed.get('a')).toBe('mockA: depValue');
                    });
                    it('should support @Optional without matches', function () {
                        testing_1.TestBed.configureTestingModule({
                            providers: [
                                { provide: 'a', useValue: 'aValue' },
                            ]
                        });
                        testing_1.TestBed.overrideProvider('a', { useFactory: function (dep) { return "mockA: " + dep; }, deps: [[new core_1.Optional(), 'dep']] });
                        matchers_1.expect(testing_1.TestBed.get('a')).toBe('mockA: null');
                    });
                    it('should support Optional with matches', function () {
                        testing_1.TestBed.configureTestingModule({
                            providers: [
                                { provide: 'dep', useValue: 'depValue' },
                                { provide: 'a', useValue: 'aValue' },
                            ]
                        });
                        testing_1.TestBed.overrideProvider('a', { useFactory: function (dep) { return "mockA: " + dep; }, deps: [[new core_1.Optional(), 'dep']] });
                        matchers_1.expect(testing_1.TestBed.get('a')).toBe('mockA: depValue');
                    });
                    it('should support SkipSelf', function () {
                        var MyModule = /** @class */ (function () {
                            function MyModule() {
                            }
                            MyModule = __decorate([
                                core_1.NgModule({
                                    providers: [
                                        { provide: 'a', useValue: 'aValue' },
                                        { provide: 'dep', useValue: 'depValue' },
                                    ]
                                })
                            ], MyModule);
                            return MyModule;
                        }());
                        testing_1.TestBed.overrideProvider('a', { useFactory: function (dep) { return "mockA: " + dep; }, deps: [[new core_1.SkipSelf(), 'dep']] });
                        testing_1.TestBed.configureTestingModule({ providers: [{ provide: 'dep', useValue: 'parentDepValue' }] });
                        var compiler = testing_1.TestBed.get(core_1.Compiler);
                        var modFactory = compiler.compileModuleSync(MyModule);
                        matchers_1.expect(modFactory.create(testing_1.getTestBed()).injector.get('a')).toBe('mockA: parentDepValue');
                    });
                    it('should keep imported NgModules eager', function () {
                        var someModule;
                        var SomeModule = /** @class */ (function () {
                            function SomeModule() {
                                someModule = this;
                            }
                            SomeModule = __decorate([
                                core_1.NgModule(),
                                __metadata("design:paramtypes", [])
                            ], SomeModule);
                            return SomeModule;
                        }());
                        testing_1.TestBed.configureTestingModule({
                            providers: [
                                { provide: 'a', useValue: 'aValue' },
                            ],
                            imports: [SomeModule]
                        });
                        testing_1.TestBed.overrideProvider('a', { useValue: 'mockValue' });
                        matchers_1.expect(testing_1.TestBed.get('a')).toBe('mockValue');
                        matchers_1.expect(someModule).toBeAnInstanceOf(SomeModule);
                    });
                    it('should keep imported NgModules lazy with deprecatedOverrideProvider', function () {
                        var someModule;
                        var SomeModule = /** @class */ (function () {
                            function SomeModule() {
                                someModule = this;
                            }
                            SomeModule = __decorate([
                                core_1.NgModule(),
                                __metadata("design:paramtypes", [])
                            ], SomeModule);
                            return SomeModule;
                        }());
                        testing_1.TestBed.configureTestingModule({
                            providers: [
                                { provide: 'a', useValue: 'aValue' },
                            ],
                            imports: [SomeModule]
                        });
                        testing_1.TestBed.deprecatedOverrideProvider('a', { useValue: 'mockValue' });
                        matchers_1.expect(testing_1.TestBed.get('a')).toBe('mockValue');
                        matchers_1.expect(someModule).toBeUndefined();
                    });
                    describe('injecting eager providers into an eager overwritten provider', function () {
                        var MyModule = /** @class */ (function () {
                            // NgModule is eager, which makes all of its deps eager
                            function MyModule(a, b) {
                            }
                            MyModule = __decorate([
                                core_1.NgModule({
                                    providers: [
                                        { provide: 'a', useFactory: function () { return 'aValue'; } },
                                        { provide: 'b', useFactory: function () { return 'bValue'; } },
                                    ]
                                }),
                                __param(0, core_1.Inject('a')), __param(1, core_1.Inject('b')),
                                __metadata("design:paramtypes", [Object, Object])
                            ], MyModule);
                            return MyModule;
                        }());
                        it('should inject providers that were declared before', function () {
                            testing_1.TestBed.configureTestingModule({ imports: [MyModule] });
                            testing_1.TestBed.overrideProvider('b', { useFactory: function (a) { return "mockB: " + a; }, deps: ['a'] });
                            matchers_1.expect(testing_1.TestBed.get('b')).toBe('mockB: aValue');
                        });
                        it('should inject providers that were declared afterwards', function () {
                            testing_1.TestBed.configureTestingModule({ imports: [MyModule] });
                            testing_1.TestBed.overrideProvider('a', { useFactory: function (b) { return "mockA: " + b; }, deps: ['b'] });
                            matchers_1.expect(testing_1.TestBed.get('a')).toBe('mockA: bValue');
                        });
                    });
                });
                describe('in Components', function () {
                    it('should support useValue', function () {
                        var MComp = /** @class */ (function () {
                            function MComp() {
                            }
                            MComp = __decorate([
                                core_1.Component({
                                    template: '',
                                    providers: [
                                        { provide: 'a', useValue: 'aValue' },
                                    ]
                                })
                            ], MComp);
                            return MComp;
                        }());
                        testing_1.TestBed.overrideProvider('a', { useValue: 'mockValue' });
                        var ctx = testing_1.TestBed.configureTestingModule({ declarations: [MComp] }).createComponent(MComp);
                        matchers_1.expect(ctx.debugElement.injector.get('a')).toBe('mockValue');
                    });
                    it('should support useFactory', function () {
                        var MyComp = /** @class */ (function () {
                            function MyComp() {
                            }
                            MyComp = __decorate([
                                core_1.Component({
                                    template: '',
                                    providers: [
                                        { provide: 'dep', useValue: 'depValue' },
                                        { provide: 'a', useValue: 'aValue' },
                                    ]
                                })
                            ], MyComp);
                            return MyComp;
                        }());
                        testing_1.TestBed.overrideProvider('a', { useFactory: function (dep) { return "mockA: " + dep; }, deps: ['dep'] });
                        var ctx = testing_1.TestBed.configureTestingModule({ declarations: [MyComp] }).createComponent(MyComp);
                        matchers_1.expect(ctx.debugElement.injector.get('a')).toBe('mockA: depValue');
                    });
                    it('should support @Optional without matches', function () {
                        var MyComp = /** @class */ (function () {
                            function MyComp() {
                            }
                            MyComp = __decorate([
                                core_1.Component({
                                    template: '',
                                    providers: [
                                        { provide: 'a', useValue: 'aValue' },
                                    ]
                                })
                            ], MyComp);
                            return MyComp;
                        }());
                        testing_1.TestBed.overrideProvider('a', { useFactory: function (dep) { return "mockA: " + dep; }, deps: [[new core_1.Optional(), 'dep']] });
                        var ctx = testing_1.TestBed.configureTestingModule({ declarations: [MyComp] }).createComponent(MyComp);
                        matchers_1.expect(ctx.debugElement.injector.get('a')).toBe('mockA: null');
                    });
                    it('should support Optional with matches', function () {
                        var MyComp = /** @class */ (function () {
                            function MyComp() {
                            }
                            MyComp = __decorate([
                                core_1.Component({
                                    template: '',
                                    providers: [
                                        { provide: 'dep', useValue: 'depValue' },
                                        { provide: 'a', useValue: 'aValue' },
                                    ]
                                })
                            ], MyComp);
                            return MyComp;
                        }());
                        testing_1.TestBed.overrideProvider('a', { useFactory: function (dep) { return "mockA: " + dep; }, deps: [[new core_1.Optional(), 'dep']] });
                        var ctx = testing_1.TestBed.configureTestingModule({ declarations: [MyComp] }).createComponent(MyComp);
                        matchers_1.expect(ctx.debugElement.injector.get('a')).toBe('mockA: depValue');
                    });
                    it('should support SkipSelf', function () {
                        var MyDir = /** @class */ (function () {
                            function MyDir() {
                            }
                            MyDir = __decorate([
                                core_1.Directive({
                                    selector: '[myDir]',
                                    providers: [
                                        { provide: 'a', useValue: 'aValue' },
                                        { provide: 'dep', useValue: 'depValue' },
                                    ]
                                })
                            ], MyDir);
                            return MyDir;
                        }());
                        var MyComp = /** @class */ (function () {
                            function MyComp() {
                            }
                            MyComp = __decorate([
                                core_1.Component({
                                    template: '<div myDir></div>',
                                    providers: [
                                        { provide: 'dep', useValue: 'parentDepValue' },
                                    ]
                                })
                            ], MyComp);
                            return MyComp;
                        }());
                        testing_1.TestBed.overrideProvider('a', { useFactory: function (dep) { return "mockA: " + dep; }, deps: [[new core_1.SkipSelf(), 'dep']] });
                        var ctx = testing_1.TestBed.configureTestingModule({ declarations: [MyComp, MyDir] })
                            .createComponent(MyComp);
                        matchers_1.expect(ctx.debugElement.children[0].injector.get('a')).toBe('mockA: parentDepValue');
                    });
                    it('should support multiple providers in a template', function () {
                        var MyDir1 = /** @class */ (function () {
                            function MyDir1() {
                            }
                            MyDir1 = __decorate([
                                core_1.Directive({
                                    selector: '[myDir1]',
                                    providers: [
                                        { provide: 'a', useValue: 'aValue1' },
                                    ]
                                })
                            ], MyDir1);
                            return MyDir1;
                        }());
                        var MyDir2 = /** @class */ (function () {
                            function MyDir2() {
                            }
                            MyDir2 = __decorate([
                                core_1.Directive({
                                    selector: '[myDir2]',
                                    providers: [
                                        { provide: 'a', useValue: 'aValue2' },
                                    ]
                                })
                            ], MyDir2);
                            return MyDir2;
                        }());
                        var MyComp = /** @class */ (function () {
                            function MyComp() {
                            }
                            MyComp = __decorate([
                                core_1.Component({
                                    template: '<div myDir1></div><div myDir2></div>',
                                })
                            ], MyComp);
                            return MyComp;
                        }());
                        testing_1.TestBed.overrideProvider('a', { useValue: 'mockA' });
                        var ctx = testing_1.TestBed.configureTestingModule({ declarations: [MyComp, MyDir1, MyDir2] })
                            .createComponent(MyComp);
                        matchers_1.expect(ctx.debugElement.children[0].injector.get('a')).toBe('mockA');
                        matchers_1.expect(ctx.debugElement.children[1].injector.get('a')).toBe('mockA');
                    });
                    describe('injecting eager providers into an eager overwritten provider', function () {
                        var MyComp = /** @class */ (function () {
                            // Component is eager, which makes all of its deps eager
                            function MyComp(a, b) {
                            }
                            MyComp = __decorate([
                                core_1.Component({
                                    template: '',
                                    providers: [
                                        { provide: 'a', useFactory: function () { return 'aValue'; } },
                                        { provide: 'b', useFactory: function () { return 'bValue'; } },
                                    ]
                                }),
                                __param(0, core_1.Inject('a')), __param(1, core_1.Inject('b')),
                                __metadata("design:paramtypes", [Object, Object])
                            ], MyComp);
                            return MyComp;
                        }());
                        it('should inject providers that were declared before it', function () {
                            testing_1.TestBed.overrideProvider('b', { useFactory: function (a) { return "mockB: " + a; }, deps: ['a'] });
                            var ctx = testing_1.TestBed.configureTestingModule({ declarations: [MyComp] }).createComponent(MyComp);
                            matchers_1.expect(ctx.debugElement.injector.get('b')).toBe('mockB: aValue');
                        });
                        it('should inject providers that were declared after it', function () {
                            testing_1.TestBed.overrideProvider('a', { useFactory: function (b) { return "mockA: " + b; }, deps: ['b'] });
                            var ctx = testing_1.TestBed.configureTestingModule({ declarations: [MyComp] }).createComponent(MyComp);
                            matchers_1.expect(ctx.debugElement.injector.get('a')).toBe('mockA: bValue');
                        });
                    });
                });
                it('should reset overrides when the testing modules is resetted', function () {
                    testing_1.TestBed.overrideProvider('a', { useValue: 'mockValue' });
                    testing_1.TestBed.resetTestingModule();
                    testing_1.TestBed.configureTestingModule({ providers: [{ provide: 'a', useValue: 'aValue' }] });
                    matchers_1.expect(testing_1.TestBed.get('a')).toBe('aValue');
                });
            });
            describe('overrideTemplateUsingTestingModule', function () {
                it('should compile the template in the context of the testing module', function () {
                    var MyComponent = /** @class */ (function () {
                        function MyComponent() {
                            this.prop = 'some prop';
                        }
                        MyComponent = __decorate([
                            core_1.Component({ selector: 'comp', template: 'a' })
                        ], MyComponent);
                        return MyComponent;
                    }());
                    var testDir;
                    var TestDir = /** @class */ (function () {
                        function TestDir() {
                            testDir = this;
                        }
                        __decorate([
                            core_1.Input('test'),
                            __metadata("design:type", String)
                        ], TestDir.prototype, "test", void 0);
                        TestDir = __decorate([
                            core_1.Directive({ selector: '[test]' }),
                            __metadata("design:paramtypes", [])
                        ], TestDir);
                        return TestDir;
                    }());
                    testing_1.TestBed.overrideTemplateUsingTestingModule(MyComponent, '<div [test]="prop">Hello world!</div>');
                    var fixture = testing_1.TestBed.configureTestingModule({ declarations: [MyComponent, TestDir] })
                        .createComponent(MyComponent);
                    fixture.detectChanges();
                    matchers_1.expect(fixture.nativeElement).toHaveText('Hello world!');
                    matchers_1.expect(testDir).toBeAnInstanceOf(TestDir);
                    matchers_1.expect(testDir.test).toBe('some prop');
                });
                it('should throw if the TestBed is already created', function () {
                    var MyComponent = /** @class */ (function () {
                        function MyComponent() {
                        }
                        MyComponent = __decorate([
                            core_1.Component({ selector: 'comp', template: 'a' })
                        ], MyComponent);
                        return MyComponent;
                    }());
                    testing_1.TestBed.get(core_1.Injector);
                    matchers_1.expect(function () { return testing_1.TestBed.overrideTemplateUsingTestingModule(MyComponent, 'b'); })
                        .toThrowError(/Cannot override template when the test module has already been instantiated/);
                });
                it('should reset overrides when the testing module is resetted', function () {
                    var MyComponent = /** @class */ (function () {
                        function MyComponent() {
                        }
                        MyComponent = __decorate([
                            core_1.Component({ selector: 'comp', template: 'a' })
                        ], MyComponent);
                        return MyComponent;
                    }());
                    testing_1.TestBed.overrideTemplateUsingTestingModule(MyComponent, 'b');
                    var fixture = testing_1.TestBed.resetTestingModule()
                        .configureTestingModule({ declarations: [MyComponent] })
                        .createComponent(MyComponent);
                    matchers_1.expect(fixture.nativeElement).toHaveText('a');
                });
            });
            describe('setting up the compiler', function () {
                describe('providers', function () {
                    beforeEach(function () {
                        var resourceLoaderGet = jasmine.createSpy('resourceLoaderGet')
                            .and.returnValue(Promise.resolve('Hello world!'));
                        testing_1.TestBed.configureTestingModule({ declarations: [CompWithUrlTemplate] });
                        testing_1.TestBed.configureCompiler({ providers: [{ provide: compiler_1.ResourceLoader, useValue: { get: resourceLoaderGet } }] });
                    });
                    it('should use set up providers', testing_1.fakeAsync(function () {
                        testing_1.TestBed.compileComponents();
                        testing_1.tick();
                        var compFixture = testing_1.TestBed.createComponent(CompWithUrlTemplate);
                        matchers_1.expect(compFixture.nativeElement).toHaveText('Hello world!');
                    }));
                });
                describe('useJit true', function () {
                    beforeEach(function () { return testing_1.TestBed.configureCompiler({ useJit: true }); });
                    it('should set the value into CompilerConfig', testing_1.inject([compiler_1.CompilerConfig], function (config) {
                        matchers_1.expect(config.useJit).toBe(true);
                    }));
                });
                describe('useJit false', function () {
                    beforeEach(function () { return testing_1.TestBed.configureCompiler({ useJit: false }); });
                    it('should set the value into CompilerConfig', testing_1.inject([compiler_1.CompilerConfig], function (config) {
                        matchers_1.expect(config.useJit).toBe(false);
                    }));
                });
            });
        });
        describe('errors', function () {
            var originalJasmineIt;
            var originalJasmineBeforeEach;
            var patchJasmineIt = function () {
                var resolve;
                var reject;
                var promise = new Promise(function (res, rej) {
                    resolve = res;
                    reject = rej;
                });
                originalJasmineIt = jasmine.getEnv().it;
                jasmine.getEnv().it = function (description, fn) {
                    var done = (function () { return resolve(null); });
                    done.fail = function (err) { return reject(err); };
                    fn(done);
                    return null;
                };
                return promise;
            };
            var restoreJasmineIt = function () { return jasmine.getEnv().it = originalJasmineIt; };
            var patchJasmineBeforeEach = function () {
                var resolve;
                var reject;
                var promise = new Promise(function (res, rej) {
                    resolve = res;
                    reject = rej;
                });
                originalJasmineBeforeEach = jasmine.getEnv().beforeEach;
                jasmine.getEnv().beforeEach = function (fn) {
                    var done = (function () { return resolve(null); });
                    done.fail = function (err) { return reject(err); };
                    fn(done);
                };
                return promise;
            };
            var restoreJasmineBeforeEach = function () { return jasmine.getEnv().beforeEach =
                originalJasmineBeforeEach; };
            it('should fail when an asynchronous error is thrown', function (done) {
                var itPromise = patchJasmineIt();
                var barError = new Error('bar');
                it('throws an async error', testing_1.async(testing_1.inject([], function () { return setTimeout(function () { throw barError; }, 0); })));
                itPromise.then(function () { return done.fail('Expected test to fail, but it did not'); }, function (err) {
                    matchers_1.expect(err).toEqual(barError);
                    done();
                });
                restoreJasmineIt();
            });
            it('should fail when a returned promise is rejected', function (done) {
                var itPromise = patchJasmineIt();
                it('should fail with an error from a promise', testing_1.async(testing_1.inject([], function () {
                    var reject = undefined;
                    var promise = new Promise(function (_, rej) { return reject = rej; });
                    var p = promise.then(function () { return matchers_1.expect(1).toEqual(2); });
                    reject('baz');
                    return p;
                })));
                itPromise.then(function () { return done.fail('Expected test to fail, but it did not'); }, function (err) {
                    matchers_1.expect(err.message).toEqual('Uncaught (in promise): baz');
                    done();
                });
                restoreJasmineIt();
            });
            describe('components', function () {
                var resourceLoaderGet;
                beforeEach(function () {
                    resourceLoaderGet = jasmine.createSpy('resourceLoaderGet')
                        .and.returnValue(Promise.resolve('Hello world!'));
                    testing_1.TestBed.configureCompiler({ providers: [{ provide: compiler_1.ResourceLoader, useValue: { get: resourceLoaderGet } }] });
                });
                it('should report an error for declared components with templateUrl which never call TestBed.compileComponents', function () {
                    var itPromise = patchJasmineIt();
                    matchers_1.expect(function () {
                        return it('should fail', testing_1.withModule({ declarations: [CompWithUrlTemplate] }, function () { return testing_1.TestBed.createComponent(CompWithUrlTemplate); }));
                    })
                        .toThrowError("This test module uses the component " + core_1.ɵstringify(CompWithUrlTemplate) + " which is using a \"templateUrl\" or \"styleUrls\", but they were never compiled. " +
                        "Please call \"TestBed.compileComponents\" before your test.");
                    restoreJasmineIt();
                });
            });
            it('should error on unknown bound properties on custom elements by default', function () {
                var ComponentUsingInvalidProperty = /** @class */ (function () {
                    function ComponentUsingInvalidProperty() {
                    }
                    ComponentUsingInvalidProperty = __decorate([
                        core_1.Component({ template: '<some-element [someUnknownProp]="true"></some-element>' })
                    ], ComponentUsingInvalidProperty);
                    return ComponentUsingInvalidProperty;
                }());
                var itPromise = patchJasmineIt();
                matchers_1.expect(function () { return it('should fail', testing_1.withModule({ declarations: [ComponentUsingInvalidProperty] }, function () { return testing_1.TestBed.createComponent(ComponentUsingInvalidProperty); })); })
                    .toThrowError(/Can't bind to 'someUnknownProp'/);
                restoreJasmineIt();
            });
        });
        describe('creating components', function () {
            beforeEach(function () {
                testing_1.TestBed.configureTestingModule({
                    declarations: [
                        ChildComp,
                        MyIfComp,
                        ChildChildComp,
                        ParentComp,
                        TestProvidersComp,
                        TestViewProvidersComp,
                    ]
                });
            });
            it('should instantiate a component with valid DOM', testing_1.async(function () {
                var fixture = testing_1.TestBed.createComponent(ChildComp);
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('Original Child');
            }));
            it('should allow changing members of the component', testing_1.async(function () {
                var componentFixture = testing_1.TestBed.createComponent(MyIfComp);
                componentFixture.detectChanges();
                matchers_1.expect(componentFixture.nativeElement).toHaveText('MyIf()');
                componentFixture.componentInstance.showMore = true;
                componentFixture.detectChanges();
                matchers_1.expect(componentFixture.nativeElement).toHaveText('MyIf(More)');
            }));
            it('should override a template', testing_1.async(function () {
                testing_1.TestBed.overrideComponent(ChildComp, { set: { template: '<span>Mock</span>' } });
                var componentFixture = testing_1.TestBed.createComponent(ChildComp);
                componentFixture.detectChanges();
                matchers_1.expect(componentFixture.nativeElement).toHaveText('Mock');
            }));
            it('should override a provider', testing_1.async(function () {
                testing_1.TestBed.overrideComponent(TestProvidersComp, { set: { providers: [{ provide: FancyService, useClass: MockFancyService }] } });
                var componentFixture = testing_1.TestBed.createComponent(TestProvidersComp);
                componentFixture.detectChanges();
                matchers_1.expect(componentFixture.nativeElement).toHaveText('injected value: mocked out value');
            }));
            it('should override a viewProvider', testing_1.async(function () {
                testing_1.TestBed.overrideComponent(TestViewProvidersComp, { set: { viewProviders: [{ provide: FancyService, useClass: MockFancyService }] } });
                var componentFixture = testing_1.TestBed.createComponent(TestViewProvidersComp);
                componentFixture.detectChanges();
                matchers_1.expect(componentFixture.nativeElement).toHaveText('injected value: mocked out value');
            }));
        });
        describe('using alternate components', function () {
            beforeEach(function () {
                testing_1.TestBed.configureTestingModule({
                    declarations: [
                        MockChildComp,
                        ParentComp,
                    ]
                });
            });
            it('should override component dependencies', testing_1.async(function () {
                var componentFixture = testing_1.TestBed.createComponent(ParentComp);
                componentFixture.detectChanges();
                matchers_1.expect(componentFixture.nativeElement).toHaveText('Parent(Mock)');
            }));
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGluZ19wdWJsaWNfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLWJyb3dzZXIvdGVzdC90ZXN0aW5nX3B1YmxpY19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILDhDQUFpRTtBQUNqRSxzQ0FBdUw7QUFDdkwsaURBQXNHO0FBQ3RHLDJFQUFzRTtBQUV0RSwwQ0FBMEM7QUFJMUM7SUFFRTtRQUFnQixJQUFJLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQztJQUFDLENBQUM7SUFGMUMsU0FBUztRQUZkLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSx3Q0FBd0MsRUFBQyxDQUFDO1FBQ3ZGLGlCQUFVLEVBQUU7O09BQ1AsU0FBUyxDQUdkO0lBQUQsZ0JBQUM7Q0FBQSxBQUhELElBR0M7QUFJRDtJQUFBO0lBQ0EsQ0FBQztJQURLLGFBQWE7UUFGbEIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLG1CQUFtQixFQUFDLENBQUM7UUFDbEUsaUJBQVUsRUFBRTtPQUNQLGFBQWEsQ0FDbEI7SUFBRCxvQkFBQztDQUFBLEFBREQsSUFDQztBQU9EO0lBQUE7SUFDQSxDQUFDO0lBREssVUFBVTtRQUxmLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsYUFBYTtZQUN2QixRQUFRLEVBQUUsbUNBQW1DO1NBQzlDLENBQUM7UUFDRCxpQkFBVSxFQUFFO09BQ1AsVUFBVSxDQUNmO0lBQUQsaUJBQUM7Q0FBQSxBQURELElBQ0M7QUFJRDtJQUZBO1FBR0UsYUFBUSxHQUFZLEtBQUssQ0FBQztJQUM1QixDQUFDO0lBRkssUUFBUTtRQUZiLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSw0Q0FBMEMsRUFBQyxDQUFDO1FBQ3pGLGlCQUFVLEVBQUU7T0FDUCxRQUFRLENBRWI7SUFBRCxlQUFDO0NBQUEsQUFGRCxJQUVDO0FBSUQ7SUFBQTtJQUNBLENBQUM7SUFESyxjQUFjO1FBRm5CLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsa0JBQWtCLEVBQUUsUUFBUSxFQUFFLHlCQUF5QixFQUFDLENBQUM7UUFDOUUsaUJBQVUsRUFBRTtPQUNQLGNBQWMsQ0FDbkI7SUFBRCxxQkFBQztDQUFBLEFBREQsSUFDQztBQU9EO0lBRUU7UUFBZ0IsSUFBSSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUM7SUFBQyxDQUFDO0lBRjFDLGtCQUFrQjtRQUx2QixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLFlBQVk7WUFDdEIsUUFBUSxFQUFFLCtFQUErRTtTQUMxRixDQUFDO1FBQ0QsaUJBQVUsRUFBRTs7T0FDUCxrQkFBa0IsQ0FHdkI7SUFBRCx5QkFBQztDQUFBLEFBSEQsSUFHQztBQUVEO0lBQUE7UUFDRSxVQUFLLEdBQVcsWUFBWSxDQUFDO0lBSy9CLENBQUM7SUFKQyxvQ0FBYSxHQUFiLGNBQWtCLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUQsc0NBQWUsR0FBZjtRQUNFLE9BQU8sSUFBSSxPQUFPLENBQVMsVUFBQyxPQUFPLEVBQUUsTUFBTSxJQUFLLE9BQUEsVUFBVSxDQUFDLGNBQU0sT0FBQSxPQUFPLENBQUMsZUFBZSxDQUFDLEVBQXhCLENBQXdCLEVBQUUsRUFBRSxDQUFDLEVBQTlDLENBQThDLENBQUMsQ0FBQztJQUNsRyxDQUFDO0lBQ0gsbUJBQUM7QUFBRCxDQUFDLEFBTkQsSUFNQztBQUVEO0lBQStCLG9DQUFZO0lBQTNDO1FBQUEscUVBRUM7UUFEQyxXQUFLLEdBQVcsa0JBQWtCLENBQUM7O0lBQ3JDLENBQUM7SUFBRCx1QkFBQztBQUFELENBQUMsQUFGRCxDQUErQixZQUFZLEdBRTFDO0FBT0Q7SUFDRSwyQkFBb0IsWUFBMEI7UUFBMUIsaUJBQVksR0FBWixZQUFZLENBQWM7SUFBRyxDQUFDO0lBRDlDLGlCQUFpQjtRQUx0QixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLGlCQUFpQjtZQUMzQixTQUFTLEVBQUUsQ0FBQyxZQUFZLENBQUM7WUFDekIsUUFBUSxFQUFFLHdDQUF3QztTQUNuRCxDQUFDO3lDQUVrQyxZQUFZO09BRDFDLGlCQUFpQixDQUV0QjtJQUFELHdCQUFDO0NBQUEsQUFGRCxJQUVDO0FBT0Q7SUFDRSwrQkFBb0IsWUFBMEI7UUFBMUIsaUJBQVksR0FBWixZQUFZLENBQWM7SUFBRyxDQUFDO0lBRDlDLHFCQUFxQjtRQUwxQixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLGlCQUFpQjtZQUMzQixhQUFhLEVBQUUsQ0FBQyxZQUFZLENBQUM7WUFDN0IsUUFBUSxFQUFFLHdDQUF3QztTQUNuRCxDQUFDO3lDQUVrQyxZQUFZO09BRDFDLHFCQUFxQixDQUUxQjtJQUFELDRCQUFDO0NBQUEsQUFGRCxJQUVDO0FBR0Q7SUFBQTtJQUlBLENBQUM7SUFEQztRQURDLFlBQUssRUFBRTs7a0RBQ1U7SUFIZCxhQUFhO1FBRGxCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxFQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUMsRUFBQyxDQUFDO09BQzNELGFBQWEsQ0FJbEI7SUFBRCxvQkFBQztDQUFBLEFBSkQsSUFJQztBQUdEO0lBQUE7SUFFQSxDQUFDO0lBREMsNEJBQVMsR0FBVCxVQUFVLEtBQWEsSUFBSSxPQUFPLGlCQUFlLEtBQU8sQ0FBQyxDQUFDLENBQUM7SUFEdkQsUUFBUTtRQURiLFdBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxVQUFVLEVBQUMsQ0FBQztPQUNuQixRQUFRLENBRWI7SUFBRCxlQUFDO0NBQUEsQUFGRCxJQUVDO0FBR0Q7SUFBQTtJQUNBLENBQUM7SUFESywrQkFBK0I7UUFEcEMsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLG1EQUFpRCxFQUFDLENBQUM7T0FDckYsK0JBQStCLENBQ3BDO0lBQUQsc0NBQUM7Q0FBQSxBQURELElBQ0M7QUFHRDtJQUFBO0lBQ0EsQ0FBQztJQURLLGFBQWE7UUFEbEIsZUFBUSxFQUFFO09BQ0wsYUFBYSxDQUNsQjtJQUFELG9CQUFDO0NBQUEsQUFERCxJQUNDO0FBTUQ7SUFBQTtJQUNBLENBQUM7SUFESyxtQkFBbUI7UUFKeEIsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxNQUFNO1lBQ2hCLFdBQVcsRUFBRSxzRUFBc0U7U0FDcEYsQ0FBQztPQUNJLG1CQUFtQixDQUN4QjtJQUFELDBCQUFDO0NBQUEsQUFERCxJQUNDO0FBRUQ7SUFDRSxRQUFRLENBQUMsb0JBQW9CLEVBQUU7UUFDN0IsUUFBUSxDQUFDLDZDQUE2QyxFQUFFO1lBQ3RELFVBQVUsQ0FBQyxjQUFhLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFdEQsU0FBUyxDQUFDLGNBQWEsaUJBQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFbkUsRUFBRSxDQUFDLHlCQUF5QixFQUFFLGNBQWEsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV4RSxFQUFFLENBQUMsK0JBQStCLEVBQUUsVUFBUyxJQUFJO2dCQUFiLGlCQUtuQztnQkFKQyxVQUFVLENBQUM7b0JBQ1QsS0FBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7b0JBQ3pCLElBQUksRUFBRSxDQUFDO2dCQUNULENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNSLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLG1DQUFtQyxFQUNuQyxlQUFLLENBQUM7Z0JBQUEsaUJBQTZEO2dCQUFoRCxVQUFVLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxFQUF4QixDQUF3QixFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV6RSxFQUFFLENBQUMsc0NBQXNDLEVBQUUsZUFBSyxDQUFDO2dCQUFBLGlCQUc3QztnQkFGQyxJQUFNLENBQUMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNLElBQUssT0FBQSxVQUFVLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUF2QixDQUF1QixDQUFDLENBQUM7Z0JBQ3BFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxFQUF4QixDQUF3QixDQUFDLENBQUM7WUFDekMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNULENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLG1FQUFtRSxFQUFFO1lBQzVFLElBQU0sWUFBWSxHQUFHO2dCQUNuQixTQUFTLEVBQUUsQ0FBQyxZQUFZLENBQUM7YUFDMUIsQ0FBQztZQUVGLFVBQVUsQ0FBQyxjQUFhLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFekQsU0FBUyxDQUFDLGNBQWEsaUJBQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFdEUsRUFBRSxDQUFDLHNDQUFzQyxFQUN0QyxnQkFBTSxDQUFDLEVBQUUsRUFBRSxjQUFhLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUU1RCxFQUFFLENBQUMseUNBQXlDLEVBQ3pDLG1CQUFTLENBQUMsY0FBYSxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFM0QsRUFBRSxDQUFDLG1EQUFtRCxFQUNuRCxvQkFBVSxDQUFDLFlBQVksRUFBRSxjQUFhLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUUxRSxFQUFFLENBQUMscURBQXFELEVBQ3JELG9CQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsWUFBWSxDQUFDLEVBQUUsVUFBUyxPQUFxQjtnQkFDNUUsaUJBQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUN6QyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztZQUM5QixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRVAsRUFBRSxDQUFDLG9FQUFvRSxFQUNwRSxlQUFLLENBQUMsZ0JBQU0sQ0FBQyxFQUFFLEVBQUU7Z0JBQUEsaUJBQWdFO2dCQUFuRCxVQUFVLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxFQUEzQixDQUEyQixFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXhGLEVBQUUsQ0FBQyx3RUFBd0UsRUFDeEUsbUJBQVMsQ0FBQyxnQkFBTSxDQUFDLEVBQUUsRUFBRTtnQkFBQSxpQkFHcEI7Z0JBRkMsVUFBVSxDQUFDLGNBQU0sT0FBQSxLQUFJLENBQUMsZUFBZSxHQUFHLElBQUksRUFBM0IsQ0FBMkIsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDakQsY0FBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1YsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1YsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsZ0RBQWdELEVBQUU7WUFDekQsUUFBUSxDQUFDLHNCQUFzQixFQUFFO2dCQUMvQixVQUFVLENBQUM7b0JBQ1QsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FDMUIsRUFBQyxTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLElBQUksWUFBWSxFQUFFLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztvQkFFMUUsRUFBRSxDQUFDLDZCQUE2QixFQUFFLGdCQUFNLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFBRSxVQUFDLE9BQXFCO3dCQUMxRSxpQkFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7b0JBQzlDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBRVAsRUFBRSxDQUFDLHFDQUFxQyxFQUNyQyxlQUFLLENBQUMsZ0JBQU0sQ0FBQyxDQUFDLFlBQVksQ0FBQyxFQUFFLFVBQUMsT0FBcUI7d0JBQ2pELE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxLQUFLLElBQUssT0FBQSxpQkFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsRUFBcEMsQ0FBb0MsQ0FBQyxDQUFDO3dCQUM5RSxPQUFPLENBQUMsZUFBZSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsS0FBSyxJQUFLLE9BQUEsaUJBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLEVBQXRDLENBQXNDLENBQUMsQ0FBQztvQkFDcEYsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUVSLEVBQUUsQ0FBQyxtQ0FBbUMsRUFDbkMsbUJBQVMsQ0FBQyxnQkFBTSxDQUFDLENBQUMsWUFBWSxDQUFDLEVBQUUsVUFBQyxPQUFxQjt3QkFDckQsSUFBSSxLQUFLLEdBQVcsU0FBVyxDQUFDO3dCQUNoQyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsR0FBRyxJQUFLLE9BQUEsS0FBSyxHQUFHLEdBQUcsRUFBWCxDQUFXLENBQUMsQ0FBQzt3QkFDbkQsY0FBSSxFQUFFLENBQUM7d0JBQ1AsaUJBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQ3ZDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFFUixFQUFFLENBQUMsNEJBQTRCLEVBQUUsVUFBQyxJQUFJO3dCQUNwQyxnQkFBTSxDQUFDLENBQUMsWUFBWSxDQUFDLEVBQUUsVUFBQyxPQUFxQjs0QkFDM0MsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDOzRCQUNkLElBQU0sRUFBRSxHQUFHLFdBQVcsQ0FBQztnQ0FDckIsS0FBSyxFQUFFLENBQUM7Z0NBQ1IsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFO29DQUNiLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQ0FDbEIsSUFBSSxFQUFFLENBQUM7aUNBQ1I7NEJBQ0gsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUNSLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBRSxpREFBaUQ7b0JBQzFELENBQUMsQ0FBQyxDQUFDO29CQUVILFFBQVEsQ0FBQyxrQkFBa0IsRUFBRTt3QkFDM0IsVUFBVSxDQUFDLGdCQUFNLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFBRSxVQUFDLE9BQXFCOzRCQUN0RCxPQUFPLENBQUMsS0FBSyxHQUFHLDhCQUE4QixDQUFDO3dCQUNqRCxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUVKLEVBQUUsQ0FBQywrQkFBK0IsRUFBRSxnQkFBTSxDQUFDLENBQUMsWUFBWSxDQUFDLEVBQUUsVUFBQyxPQUFxQjs0QkFDNUUsaUJBQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLDhCQUE4QixDQUFDLENBQUM7d0JBQ2hFLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ1QsQ0FBQyxDQUFDLENBQUM7b0JBRUgsUUFBUSxDQUFDLHdCQUF3QixFQUFFO3dCQUNqQyxVQUFVLENBQUMsZUFBSyxDQUFDLGdCQUFNLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFBRSxVQUFDLE9BQXFCOzRCQUM1RCxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsS0FBSyxJQUFLLE9BQUEsT0FBTyxDQUFDLEtBQUssR0FBRyxLQUFLLEVBQXJCLENBQXFCLENBQUMsQ0FBQzt3QkFDakUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUVMLEVBQUUsQ0FBQywwQ0FBMEMsRUFDMUMsZ0JBQU0sQ0FBQyxDQUFDLFlBQVksQ0FBQyxFQUFFLFVBQUMsT0FBcUI7NEJBQzNDLGlCQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQzt3QkFDL0MsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDVCxDQUFDLENBQUMsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsc0NBQXNDLEVBQUU7WUFDL0MsSUFBTSxZQUFZLEdBQUc7Z0JBQ25CLFNBQVMsRUFBRSxDQUFDLFlBQVksQ0FBQztnQkFDekIsT0FBTyxFQUFFLENBQUMsYUFBYSxDQUFDO2dCQUN4QixZQUFZLEVBQUUsQ0FBQyxhQUFhLEVBQUUsUUFBUSxFQUFFLCtCQUErQixDQUFDO2FBQ3pFLENBQUM7WUFFRixRQUFRLENBQUMscUJBQXFCLEVBQUU7Z0JBQzlCLFVBQVUsQ0FBQyxjQUFNLE9BQUEsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQyxZQUFZLENBQUMsRUFBNUMsQ0FBNEMsQ0FBQyxDQUFDO2dCQUUvRCxFQUFFLENBQUMsNkJBQTZCLEVBQUUsZ0JBQU0sQ0FBQyxDQUFDLFlBQVksQ0FBQyxFQUFFLFVBQUMsT0FBcUI7b0JBQzFFLGlCQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDOUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFUCxFQUFFLENBQUMsa0RBQWtELEVBQUU7b0JBQ3JELElBQU0sV0FBVyxHQUFHLGlCQUFPLENBQUMsZUFBZSxDQUFDLCtCQUErQixDQUFDLENBQUM7b0JBQzdFLGlCQUFNLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLENBQUMsZ0JBQWdCLENBQUMsK0JBQStCLENBQUMsQ0FBQztnQkFDMUYsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsRUFBRSxDQUFDLHdDQUF3QyxFQUFFO29CQUMzQyxJQUFNLFdBQVcsR0FBRyxpQkFBTyxDQUFDLGVBQWUsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO29CQUM3RSxJQUFNLEVBQUUsR0FBRyxXQUFXLENBQUMsWUFBWSxDQUFDO29CQUVwQyxXQUFXLENBQUMsYUFBYSxFQUFFLENBQUM7b0JBQzVCLGlCQUFNLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztnQkFDM0UsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsRUFBRSxDQUFDLG9DQUFvQyxFQUNwQyxnQkFBTSxDQUFDLENBQUMsYUFBYSxDQUFDLEVBQUUsVUFBQyxTQUF3QjtvQkFDL0MsaUJBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDcEQsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFUCxRQUFRLENBQUMsa0JBQWtCLEVBQUU7b0JBRTNCO3dCQUFBO3dCQUNBLENBQUM7d0JBREssNkJBQTZCOzRCQURsQyxnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLHdEQUF3RCxFQUFDLENBQUM7MkJBQzFFLDZCQUE2QixDQUNsQzt3QkFBRCxvQ0FBQztxQkFBQSxBQURELElBQ0M7b0JBRUQsVUFBVSxDQUFDO3dCQUNULGlCQUFPLENBQUMsc0JBQXNCLENBQzFCLEVBQUMsT0FBTyxFQUFFLENBQUMsNkJBQXNCLENBQUMsRUFBRSxZQUFZLEVBQUUsQ0FBQyw2QkFBNkIsQ0FBQyxFQUFDLENBQUMsQ0FBQztvQkFDMUYsQ0FBQyxDQUFDLENBQUM7b0JBRUgsRUFBRSxDQUFDLHVHQUF1RyxFQUN2Rzt3QkFDRSxpQkFBTSxDQUFDLGlCQUFPLENBQUMsZUFBZSxDQUFDLDZCQUE2QixDQUFDLENBQUMsaUJBQWlCLENBQUM7NkJBQzNFLGdCQUFnQixDQUFDLDZCQUE2QixDQUFDLENBQUM7b0JBQ3ZELENBQUMsQ0FBQyxDQUFDO2dCQUNSLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCxRQUFRLENBQUMsa0JBQWtCLEVBQUU7Z0JBQzNCLEVBQUUsQ0FBQyw2QkFBNkIsRUFDN0Isb0JBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFBRSxVQUFDLE9BQXFCO29CQUNwRSxpQkFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQzlDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRVAsRUFBRSxDQUFDLHdDQUF3QyxFQUFFLG9CQUFVLENBQUMsWUFBWSxFQUFFO29CQUNqRSxJQUFNLFdBQVcsR0FBRyxpQkFBTyxDQUFDLGVBQWUsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO29CQUM3RSxJQUFNLEVBQUUsR0FBRyxXQUFXLENBQUMsWUFBWSxDQUFDO29CQUVwQyxXQUFXLENBQUMsYUFBYSxFQUFFLENBQUM7b0JBQzVCLGlCQUFNLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztnQkFDM0UsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFUCxFQUFFLENBQUMsbUNBQW1DLEVBQ25DLG9CQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsYUFBYSxDQUFDLEVBQUUsVUFBQyxTQUF3QjtvQkFDeEUsaUJBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDcEQsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNULENBQUMsQ0FBQyxDQUFDO1lBRUgsUUFBUSxDQUFDLDhCQUE4QixFQUFFO2dCQUN2QyxVQUFVLENBQUMsZUFBSyxDQUFDO29CQUNmLGlCQUFPLENBQUMsc0JBQXNCLENBQUMsRUFBQyxZQUFZLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFDLENBQUMsQ0FBQztvQkFDdEUsaUJBQU8sQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO2dCQUM5QixDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVKLEVBQUUsQ0FBQyx5RkFBeUYsRUFDekY7b0JBQ0UsSUFBTSxPQUFPLEdBQUcsaUJBQU8sQ0FBQyxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQztvQkFDN0QsaUJBQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxDQUFDLHdCQUF3QixDQUFDLENBQUM7Z0JBQ3JFLENBQUMsQ0FBQyxDQUFDO1lBQ1IsQ0FBQyxDQUFDLENBQUM7WUFFSCxRQUFRLENBQUMsc0JBQXNCLEVBQUU7Z0JBRS9CO29CQUFBO29CQUVBLENBQUM7b0JBREMsNEJBQVMsR0FBVCxVQUFVLEtBQWEsSUFBWSxPQUFPLGlCQUFlLEtBQU8sQ0FBQyxDQUFDLENBQUM7b0JBRC9ELFFBQVE7d0JBRGIsV0FBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLFdBQVcsRUFBQyxDQUFDO3VCQUNwQixRQUFRLENBRWI7b0JBQUQsZUFBQztpQkFBQSxBQUZELElBRUM7Z0JBR0Q7b0JBREE7d0JBRUUsYUFBUSxHQUFHLE9BQU8sQ0FBQztvQkFDckIsQ0FBQztvQkFGSyxhQUFhO3dCQURsQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLGFBQWEsRUFBQyxDQUFDO3VCQUMvQixhQUFhLENBRWxCO29CQUFELG9CQUFDO2lCQUFBLEFBRkQsSUFFQztnQkFHRDtvQkFBQTtvQkFDQSxDQUFDO29CQURLLGFBQWE7d0JBRGxCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUMsQ0FBQzt1QkFDOUMsYUFBYSxDQUNsQjtvQkFBRCxvQkFBQztpQkFBQSxBQURELElBQ0M7Z0JBR0Q7b0JBQUE7b0JBQ0EsQ0FBQztvQkFESyxrQkFBa0I7d0JBRHZCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxlQUFlLEVBQUMsQ0FBQzt1QkFDbkQsa0JBQWtCLENBQ3ZCO29CQUFELHlCQUFDO2lCQUFBLEFBREQsSUFDQztnQkFHRDtvQkFBQTtvQkFDQSxDQUFDO29CQURLLFVBQVU7d0JBRGYsZUFBUSxDQUFDLEVBQUMsWUFBWSxFQUFFLENBQUMsYUFBYSxFQUFFLGFBQWEsRUFBRSxRQUFRLENBQUMsRUFBQyxDQUFDO3VCQUM3RCxVQUFVLENBQ2Y7b0JBQUQsaUJBQUM7aUJBQUEsQUFERCxJQUNDO2dCQUVELFVBQVUsQ0FBQyxjQUFNLE9BQUEsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFDLENBQUMsRUFBdkQsQ0FBdUQsQ0FBQyxDQUFDO2dCQUUxRSxRQUFRLENBQUMsUUFBUSxFQUFFO29CQUNqQixVQUFVLENBQUM7d0JBQ1QsaUJBQU8sQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLEVBQUMsR0FBRyxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsa0JBQWtCLENBQUMsRUFBQyxFQUFDLENBQUMsQ0FBQztvQkFDbEYsQ0FBQyxDQUFDLENBQUM7b0JBQ0gsRUFBRSxDQUFDLGFBQWEsRUFBRTt3QkFDaEIsaUJBQU0sQ0FBQyxpQkFBTyxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLGlCQUFpQixDQUFDOzZCQUNoRSxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO29CQUM1QyxDQUFDLENBQUMsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztnQkFFSCxRQUFRLENBQUMsV0FBVyxFQUFFO29CQUNwQixVQUFVLENBQUM7d0JBQ1QsaUJBQU8sQ0FBQyxpQkFBaUIsQ0FDckIsYUFBYSxFQUFFLEVBQUMsR0FBRyxFQUFFLEVBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFDLEVBQUMsQ0FBQyxDQUFDO29CQUNyRSxDQUFDLENBQUMsQ0FBQztvQkFDSCxFQUFFLENBQUMsYUFBYSxFQUFFO3dCQUNoQixpQkFBTSxDQUFDLGlCQUFPLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDckYsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsUUFBUSxDQUFDLFdBQVcsRUFBRTtvQkFDcEIsVUFBVSxDQUFDO3dCQUNULGlCQUFPOzZCQUNGLGlCQUFpQixDQUNkLGFBQWEsRUFBRSxFQUFDLEdBQUcsRUFBRSxFQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLHFCQUFxQixFQUFDLEVBQUMsQ0FBQzs2QkFDN0UsaUJBQWlCLENBQ2QsYUFBYSxFQUFFLEVBQUMsR0FBRyxFQUFFLEVBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsRUFBQyxTQUFTLEVBQUUsVUFBVSxFQUFDLEVBQUMsRUFBQyxDQUFDLENBQUM7b0JBQ3hGLENBQUMsQ0FBQyxDQUFDO29CQUNILEVBQUUsQ0FBQyxhQUFhLEVBQUU7d0JBQ2hCLElBQU0sV0FBVyxHQUFHLGlCQUFPLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDO3dCQUMzRCxXQUFXLENBQUMsYUFBYSxFQUFFLENBQUM7d0JBQzVCLGlCQUFNLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUNwRixDQUFDLENBQUMsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztnQkFFSCxRQUFRLENBQUMsTUFBTSxFQUFFO29CQUNmLFVBQVUsQ0FBQzt3QkFDVCxpQkFBTzs2QkFDRixpQkFBaUIsQ0FDZCxhQUFhLEVBQUUsRUFBQyxHQUFHLEVBQUUsRUFBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSx3QkFBd0IsRUFBQyxFQUFDLENBQUM7NkJBQ2hGLFlBQVksQ0FBQyxRQUFRLEVBQUUsRUFBQyxHQUFHLEVBQUUsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFDLEVBQUMsQ0FBQzs2QkFDakQsWUFBWSxDQUFDLFFBQVEsRUFBRSxFQUFDLEdBQUcsRUFBRSxFQUFDLElBQUksRUFBRSxLQUFLLEVBQUMsRUFBQyxDQUFDLENBQUM7b0JBQ3BELENBQUMsQ0FBQyxDQUFDO29CQUNILEVBQUUsQ0FBQyxhQUFhLEVBQUU7d0JBQ2hCLElBQU0sV0FBVyxHQUFHLGlCQUFPLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDO3dCQUMzRCxXQUFXLENBQUMsYUFBYSxFQUFFLENBQUM7d0JBQzVCLGlCQUFNLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO29CQUNwRSxDQUFDLENBQUMsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztnQkFFSCxRQUFRLENBQUMsVUFBVSxFQUFFO29CQUNuQixJQUFJLFVBQWUsQ0FBQztvQkFDcEIsVUFBVSxDQUFDO3dCQUNULFVBQVUsR0FBRyxLQUFLLENBQUMsb0JBQVUsRUFBRSxFQUFFLG1CQUFtQixDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO3dCQUN4RSxpQkFBTyxDQUFDLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxTQUFTLENBQUMsQ0FBQztvQkFDckQsQ0FBQyxDQUFDLENBQUM7b0JBQ0gsRUFBRSxDQUFDLHNDQUFzQyxFQUFFO3dCQUN6QyxJQUFNLE9BQU8sR0FBRyxpQkFBTyxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsQ0FBQzt3QkFDdkQsaUJBQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO3dCQUNwRCxpQkFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLGFBQWEsRUFBRTs0QkFDckQsR0FBRyxFQUFFLEVBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFDO3lCQUM5QyxDQUFDLENBQUM7b0JBQ0wsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILFFBQVEsQ0FBQyxzQkFBc0IsRUFBRTtnQkFDL0IsUUFBUSxDQUFDLGNBQWMsRUFBRTtvQkFDdkIsRUFBRSxDQUFDLHlCQUF5QixFQUFFO3dCQUM1QixpQkFBTyxDQUFDLHNCQUFzQixDQUFDOzRCQUM3QixTQUFTLEVBQUU7Z0NBQ1QsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUM7NkJBQ25DO3lCQUNGLENBQUMsQ0FBQzt3QkFDSCxpQkFBTyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxFQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUMsQ0FBQyxDQUFDO3dCQUN2RCxpQkFBTSxDQUFDLGlCQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO29CQUM3QyxDQUFDLENBQUMsQ0FBQztvQkFFSCxFQUFFLENBQUMsMkJBQTJCLEVBQUU7d0JBQzlCLGlCQUFPLENBQUMsc0JBQXNCLENBQUM7NEJBQzdCLFNBQVMsRUFBRTtnQ0FDVCxFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBQztnQ0FDdEMsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUM7NkJBQ25DO3lCQUNGLENBQUMsQ0FBQzt3QkFDSCxpQkFBTyxDQUFDLGdCQUFnQixDQUNwQixHQUFHLEVBQUUsRUFBQyxVQUFVLEVBQUUsVUFBQyxHQUFRLElBQUssT0FBQSxZQUFVLEdBQUssRUFBZixDQUFlLEVBQUUsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUMsQ0FBQyxDQUFDO3dCQUNyRSxpQkFBTSxDQUFDLGlCQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7b0JBQ25ELENBQUMsQ0FBQyxDQUFDO29CQUVILEVBQUUsQ0FBQywwQ0FBMEMsRUFBRTt3QkFDN0MsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQzs0QkFDN0IsU0FBUyxFQUFFO2dDQUNULEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFDOzZCQUNuQzt5QkFDRixDQUFDLENBQUM7d0JBQ0gsaUJBQU8sQ0FBQyxnQkFBZ0IsQ0FDcEIsR0FBRyxFQUFFLEVBQUMsVUFBVSxFQUFFLFVBQUMsR0FBUSxJQUFLLE9BQUEsWUFBVSxHQUFLLEVBQWYsQ0FBZSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxlQUFRLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQzt3QkFDdkYsaUJBQU0sQ0FBQyxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDL0MsQ0FBQyxDQUFDLENBQUM7b0JBRUgsRUFBRSxDQUFDLHNDQUFzQyxFQUFFO3dCQUN6QyxpQkFBTyxDQUFDLHNCQUFzQixDQUFDOzRCQUM3QixTQUFTLEVBQUU7Z0NBQ1QsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUM7Z0NBQ3RDLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFDOzZCQUNuQzt5QkFDRixDQUFDLENBQUM7d0JBQ0gsaUJBQU8sQ0FBQyxnQkFBZ0IsQ0FDcEIsR0FBRyxFQUFFLEVBQUMsVUFBVSxFQUFFLFVBQUMsR0FBUSxJQUFLLE9BQUEsWUFBVSxHQUFLLEVBQWYsQ0FBZSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxlQUFRLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQzt3QkFDdkYsaUJBQU0sQ0FBQyxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO29CQUNuRCxDQUFDLENBQUMsQ0FBQztvQkFFSCxFQUFFLENBQUMseUJBQXlCLEVBQUU7d0JBTzVCOzRCQUFBOzRCQUNBLENBQUM7NEJBREssUUFBUTtnQ0FOYixlQUFRLENBQUM7b0NBQ1IsU0FBUyxFQUFFO3dDQUNULEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFDO3dDQUNsQyxFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBQztxQ0FDdkM7aUNBQ0YsQ0FBQzsrQkFDSSxRQUFRLENBQ2I7NEJBQUQsZUFBQzt5QkFBQSxBQURELElBQ0M7d0JBRUQsaUJBQU8sQ0FBQyxnQkFBZ0IsQ0FDcEIsR0FBRyxFQUFFLEVBQUMsVUFBVSxFQUFFLFVBQUMsR0FBUSxJQUFLLE9BQUEsWUFBVSxHQUFLLEVBQWYsQ0FBZSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxlQUFRLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQzt3QkFDdkYsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FDMUIsRUFBQyxTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLGdCQUFnQixFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7d0JBRWpFLElBQU0sUUFBUSxHQUFHLGlCQUFPLENBQUMsR0FBRyxDQUFDLGVBQVEsQ0FBYSxDQUFDO3dCQUNuRCxJQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQ3hELGlCQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxvQkFBVSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7b0JBQzFGLENBQUMsQ0FBQyxDQUFDO29CQUVILEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRTt3QkFDekMsSUFBSSxVQUFnQyxDQUFDO3dCQUdyQzs0QkFDRTtnQ0FBZ0IsVUFBVSxHQUFHLElBQUksQ0FBQzs0QkFBQyxDQUFDOzRCQURoQyxVQUFVO2dDQURmLGVBQVEsRUFBRTs7K0JBQ0wsVUFBVSxDQUVmOzRCQUFELGlCQUFDO3lCQUFBLEFBRkQsSUFFQzt3QkFFRCxpQkFBTyxDQUFDLHNCQUFzQixDQUFDOzRCQUM3QixTQUFTLEVBQUU7Z0NBQ1QsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUM7NkJBQ25DOzRCQUNELE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQzt5QkFDdEIsQ0FBQyxDQUFDO3dCQUNILGlCQUFPLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLEVBQUMsUUFBUSxFQUFFLFdBQVcsRUFBQyxDQUFDLENBQUM7d0JBRXZELGlCQUFNLENBQUMsaUJBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7d0JBQzNDLGlCQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQ2xELENBQUMsQ0FBQyxDQUFDO29CQUVILEVBQUUsQ0FBQyxxRUFBcUUsRUFBRTt3QkFDeEUsSUFBSSxVQUFnQyxDQUFDO3dCQUdyQzs0QkFDRTtnQ0FBZ0IsVUFBVSxHQUFHLElBQUksQ0FBQzs0QkFBQyxDQUFDOzRCQURoQyxVQUFVO2dDQURmLGVBQVEsRUFBRTs7K0JBQ0wsVUFBVSxDQUVmOzRCQUFELGlCQUFDO3lCQUFBLEFBRkQsSUFFQzt3QkFFRCxpQkFBTyxDQUFDLHNCQUFzQixDQUFDOzRCQUM3QixTQUFTLEVBQUU7Z0NBQ1QsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUM7NkJBQ25DOzRCQUNELE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQzt5QkFDdEIsQ0FBQyxDQUFDO3dCQUNILGlCQUFPLENBQUMsMEJBQTBCLENBQUMsR0FBRyxFQUFFLEVBQUMsUUFBUSxFQUFFLFdBQVcsRUFBQyxDQUFDLENBQUM7d0JBRWpFLGlCQUFNLENBQUMsaUJBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7d0JBQzNDLGlCQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUM7b0JBQ3JDLENBQUMsQ0FBQyxDQUFDO29CQUVILFFBQVEsQ0FBQyw4REFBOEQsRUFBRTt3QkFPdkU7NEJBQ0UsdURBQXVEOzRCQUN2RCxrQkFBeUIsQ0FBTSxFQUFlLENBQU07NEJBQUcsQ0FBQzs0QkFGcEQsUUFBUTtnQ0FOYixlQUFRLENBQUM7b0NBQ1IsU0FBUyxFQUFFO3dDQUNULEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsY0FBTSxPQUFBLFFBQVEsRUFBUixDQUFRLEVBQUM7d0NBQzFDLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsY0FBTSxPQUFBLFFBQVEsRUFBUixDQUFRLEVBQUM7cUNBQzNDO2lDQUNGLENBQUM7Z0NBR2EsV0FBQSxhQUFNLENBQUMsR0FBRyxDQUFDLENBQUEsRUFBVSxXQUFBLGFBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTs7K0JBRnpDLFFBQVEsQ0FHYjs0QkFBRCxlQUFDO3lCQUFBLEFBSEQsSUFHQzt3QkFFRCxFQUFFLENBQUMsbURBQW1ELEVBQUU7NEJBQ3RELGlCQUFPLENBQUMsc0JBQXNCLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBQyxDQUFDLENBQUM7NEJBQ3RELGlCQUFPLENBQUMsZ0JBQWdCLENBQ3BCLEdBQUcsRUFBRSxFQUFDLFVBQVUsRUFBRSxVQUFDLENBQVMsSUFBSyxPQUFBLFlBQVUsQ0FBRyxFQUFiLENBQWEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUFDLENBQUM7NEJBRWxFLGlCQUFNLENBQUMsaUJBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7d0JBQ2pELENBQUMsQ0FBQyxDQUFDO3dCQUVILEVBQUUsQ0FBQyx1REFBdUQsRUFBRTs0QkFDMUQsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFDLENBQUMsQ0FBQzs0QkFDdEQsaUJBQU8sQ0FBQyxnQkFBZ0IsQ0FDcEIsR0FBRyxFQUFFLEVBQUMsVUFBVSxFQUFFLFVBQUMsQ0FBUyxJQUFLLE9BQUEsWUFBVSxDQUFHLEVBQWIsQ0FBYSxFQUFFLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsQ0FBQzs0QkFFbEUsaUJBQU0sQ0FBQyxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQzt3QkFDakQsQ0FBQyxDQUFDLENBQUM7b0JBQ0wsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsUUFBUSxDQUFDLGVBQWUsRUFBRTtvQkFDeEIsRUFBRSxDQUFDLHlCQUF5QixFQUFFO3dCQU81Qjs0QkFBQTs0QkFDQSxDQUFDOzRCQURLLEtBQUs7Z0NBTlYsZ0JBQVMsQ0FBQztvQ0FDVCxRQUFRLEVBQUUsRUFBRTtvQ0FDWixTQUFTLEVBQUU7d0NBQ1QsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUM7cUNBQ25DO2lDQUNGLENBQUM7K0JBQ0ksS0FBSyxDQUNWOzRCQUFELFlBQUM7eUJBQUEsQUFERCxJQUNDO3dCQUVELGlCQUFPLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLEVBQUMsUUFBUSxFQUFFLFdBQVcsRUFBQyxDQUFDLENBQUM7d0JBQ3ZELElBQU0sR0FBRyxHQUNMLGlCQUFPLENBQUMsc0JBQXNCLENBQUMsRUFBQyxZQUFZLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBQyxDQUFDLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUVuRixpQkFBTSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztvQkFDL0QsQ0FBQyxDQUFDLENBQUM7b0JBRUgsRUFBRSxDQUFDLDJCQUEyQixFQUFFO3dCQVE5Qjs0QkFBQTs0QkFDQSxDQUFDOzRCQURLLE1BQU07Z0NBUFgsZ0JBQVMsQ0FBQztvQ0FDVCxRQUFRLEVBQUUsRUFBRTtvQ0FDWixTQUFTLEVBQUU7d0NBQ1QsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUM7d0NBQ3RDLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFDO3FDQUNuQztpQ0FDRixDQUFDOytCQUNJLE1BQU0sQ0FDWDs0QkFBRCxhQUFDO3lCQUFBLEFBREQsSUFDQzt3QkFFRCxpQkFBTyxDQUFDLGdCQUFnQixDQUNwQixHQUFHLEVBQUUsRUFBQyxVQUFVLEVBQUUsVUFBQyxHQUFRLElBQUssT0FBQSxZQUFVLEdBQUssRUFBZixDQUFlLEVBQUUsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUMsQ0FBQyxDQUFDO3dCQUNyRSxJQUFNLEdBQUcsR0FDTCxpQkFBTyxDQUFDLHNCQUFzQixDQUFDLEVBQUMsWUFBWSxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFFckYsaUJBQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztvQkFDckUsQ0FBQyxDQUFDLENBQUM7b0JBRUgsRUFBRSxDQUFDLDBDQUEwQyxFQUFFO3dCQU83Qzs0QkFBQTs0QkFDQSxDQUFDOzRCQURLLE1BQU07Z0NBTlgsZ0JBQVMsQ0FBQztvQ0FDVCxRQUFRLEVBQUUsRUFBRTtvQ0FDWixTQUFTLEVBQUU7d0NBQ1QsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUM7cUNBQ25DO2lDQUNGLENBQUM7K0JBQ0ksTUFBTSxDQUNYOzRCQUFELGFBQUM7eUJBQUEsQUFERCxJQUNDO3dCQUVELGlCQUFPLENBQUMsZ0JBQWdCLENBQ3BCLEdBQUcsRUFBRSxFQUFDLFVBQVUsRUFBRSxVQUFDLEdBQVEsSUFBSyxPQUFBLFlBQVUsR0FBSyxFQUFmLENBQWUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksZUFBUSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7d0JBQ3ZGLElBQU0sR0FBRyxHQUNMLGlCQUFPLENBQUMsc0JBQXNCLENBQUMsRUFBQyxZQUFZLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBQyxDQUFDLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUVyRixpQkFBTSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDakUsQ0FBQyxDQUFDLENBQUM7b0JBRUgsRUFBRSxDQUFDLHNDQUFzQyxFQUFFO3dCQVF6Qzs0QkFBQTs0QkFDQSxDQUFDOzRCQURLLE1BQU07Z0NBUFgsZ0JBQVMsQ0FBQztvQ0FDVCxRQUFRLEVBQUUsRUFBRTtvQ0FDWixTQUFTLEVBQUU7d0NBQ1QsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUM7d0NBQ3RDLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFDO3FDQUNuQztpQ0FDRixDQUFDOytCQUNJLE1BQU0sQ0FDWDs0QkFBRCxhQUFDO3lCQUFBLEFBREQsSUFDQzt3QkFFRCxpQkFBTyxDQUFDLGdCQUFnQixDQUNwQixHQUFHLEVBQUUsRUFBQyxVQUFVLEVBQUUsVUFBQyxHQUFRLElBQUssT0FBQSxZQUFVLEdBQUssRUFBZixDQUFlLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLGVBQVEsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO3dCQUN2RixJQUFNLEdBQUcsR0FDTCxpQkFBTyxDQUFDLHNCQUFzQixDQUFDLEVBQUMsWUFBWSxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFFckYsaUJBQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztvQkFDckUsQ0FBQyxDQUFDLENBQUM7b0JBRUgsRUFBRSxDQUFDLHlCQUF5QixFQUFFO3dCQVE1Qjs0QkFBQTs0QkFDQSxDQUFDOzRCQURLLEtBQUs7Z0NBUFYsZ0JBQVMsQ0FBQztvQ0FDVCxRQUFRLEVBQUUsU0FBUztvQ0FDbkIsU0FBUyxFQUFFO3dDQUNULEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFDO3dDQUNsQyxFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBQztxQ0FDdkM7aUNBQ0YsQ0FBQzsrQkFDSSxLQUFLLENBQ1Y7NEJBQUQsWUFBQzt5QkFBQSxBQURELElBQ0M7d0JBUUQ7NEJBQUE7NEJBQ0EsQ0FBQzs0QkFESyxNQUFNO2dDQU5YLGdCQUFTLENBQUM7b0NBQ1QsUUFBUSxFQUFFLG1CQUFtQjtvQ0FDN0IsU0FBUyxFQUFFO3dDQUNULEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLEVBQUM7cUNBQzdDO2lDQUNGLENBQUM7K0JBQ0ksTUFBTSxDQUNYOzRCQUFELGFBQUM7eUJBQUEsQUFERCxJQUNDO3dCQUVELGlCQUFPLENBQUMsZ0JBQWdCLENBQ3BCLEdBQUcsRUFBRSxFQUFDLFVBQVUsRUFBRSxVQUFDLEdBQVEsSUFBSyxPQUFBLFlBQVUsR0FBSyxFQUFmLENBQWUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksZUFBUSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7d0JBQ3ZGLElBQU0sR0FBRyxHQUFHLGlCQUFPLENBQUMsc0JBQXNCLENBQUMsRUFBQyxZQUFZLEVBQUUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLEVBQUMsQ0FBQzs2QkFDMUQsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUN6QyxpQkFBTSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztvQkFDdkYsQ0FBQyxDQUFDLENBQUM7b0JBRUgsRUFBRSxDQUFDLGlEQUFpRCxFQUFFO3dCQU9wRDs0QkFBQTs0QkFDQSxDQUFDOzRCQURLLE1BQU07Z0NBTlgsZ0JBQVMsQ0FBQztvQ0FDVCxRQUFRLEVBQUUsVUFBVTtvQ0FDcEIsU0FBUyxFQUFFO3dDQUNULEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFDO3FDQUNwQztpQ0FDRixDQUFDOytCQUNJLE1BQU0sQ0FDWDs0QkFBRCxhQUFDO3lCQUFBLEFBREQsSUFDQzt3QkFRRDs0QkFBQTs0QkFDQSxDQUFDOzRCQURLLE1BQU07Z0NBTlgsZ0JBQVMsQ0FBQztvQ0FDVCxRQUFRLEVBQUUsVUFBVTtvQ0FDcEIsU0FBUyxFQUFFO3dDQUNULEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFDO3FDQUNwQztpQ0FDRixDQUFDOytCQUNJLE1BQU0sQ0FDWDs0QkFBRCxhQUFDO3lCQUFBLEFBREQsSUFDQzt3QkFLRDs0QkFBQTs0QkFDQSxDQUFDOzRCQURLLE1BQU07Z0NBSFgsZ0JBQVMsQ0FBQztvQ0FDVCxRQUFRLEVBQUUsc0NBQXNDO2lDQUNqRCxDQUFDOytCQUNJLE1BQU0sQ0FDWDs0QkFBRCxhQUFDO3lCQUFBLEFBREQsSUFDQzt3QkFFRCxpQkFBTyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxFQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO3dCQUNuRCxJQUFNLEdBQUcsR0FBRyxpQkFBTyxDQUFDLHNCQUFzQixDQUFDLEVBQUMsWUFBWSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsRUFBQyxDQUFDOzZCQUNuRSxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7d0JBQ3pDLGlCQUFNLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzt3QkFDckUsaUJBQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUN2RSxDQUFDLENBQUMsQ0FBQztvQkFFSCxRQUFRLENBQUMsOERBQThELEVBQUU7d0JBUXZFOzRCQUNFLHdEQUF3RDs0QkFDeEQsZ0JBQXlCLENBQU0sRUFBZSxDQUFNOzRCQUFHLENBQUM7NEJBRnBELE1BQU07Z0NBUFgsZ0JBQVMsQ0FBQztvQ0FDVCxRQUFRLEVBQUUsRUFBRTtvQ0FDWixTQUFTLEVBQUU7d0NBQ1QsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxjQUFNLE9BQUEsUUFBUSxFQUFSLENBQVEsRUFBQzt3Q0FDMUMsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxjQUFNLE9BQUEsUUFBUSxFQUFSLENBQVEsRUFBQztxQ0FDM0M7aUNBQ0YsQ0FBQztnQ0FHYSxXQUFBLGFBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQSxFQUFVLFdBQUEsYUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBOzsrQkFGekMsTUFBTSxDQUdYOzRCQUFELGFBQUM7eUJBQUEsQUFIRCxJQUdDO3dCQUVELEVBQUUsQ0FBQyxzREFBc0QsRUFBRTs0QkFDekQsaUJBQU8sQ0FBQyxnQkFBZ0IsQ0FDcEIsR0FBRyxFQUFFLEVBQUMsVUFBVSxFQUFFLFVBQUMsQ0FBUyxJQUFLLE9BQUEsWUFBVSxDQUFHLEVBQWIsQ0FBYSxFQUFFLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsQ0FBQzs0QkFDbEUsSUFBTSxHQUFHLEdBQ0wsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQyxFQUFDLFlBQVksRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7NEJBRXJGLGlCQUFNLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO3dCQUNuRSxDQUFDLENBQUMsQ0FBQzt3QkFFSCxFQUFFLENBQUMscURBQXFELEVBQUU7NEJBQ3hELGlCQUFPLENBQUMsZ0JBQWdCLENBQ3BCLEdBQUcsRUFBRSxFQUFDLFVBQVUsRUFBRSxVQUFDLENBQVMsSUFBSyxPQUFBLFlBQVUsQ0FBRyxFQUFiLENBQWEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUFDLENBQUM7NEJBQ2xFLElBQU0sR0FBRyxHQUNMLGlCQUFPLENBQUMsc0JBQXNCLENBQUMsRUFBQyxZQUFZLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBQyxDQUFDLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDOzRCQUVyRixpQkFBTSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQzt3QkFDbkUsQ0FBQyxDQUFDLENBQUM7b0JBQ0wsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsRUFBRSxDQUFDLDZEQUE2RCxFQUFFO29CQUNoRSxpQkFBTyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxFQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUMsQ0FBQyxDQUFDO29CQUN2RCxpQkFBTyxDQUFDLGtCQUFrQixFQUFFLENBQUM7b0JBQzdCLGlCQUFPLENBQUMsc0JBQXNCLENBQUMsRUFBQyxTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO29CQUNsRixpQkFBTSxDQUFDLGlCQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUMxQyxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsUUFBUSxDQUFDLG9DQUFvQyxFQUFFO2dCQUM3QyxFQUFFLENBQUMsa0VBQWtFLEVBQUU7b0JBRXJFO3dCQURBOzRCQUVFLFNBQUksR0FBRyxXQUFXLENBQUM7d0JBQ3JCLENBQUM7d0JBRkssV0FBVzs0QkFEaEIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBQyxDQUFDOzJCQUN2QyxXQUFXLENBRWhCO3dCQUFELGtCQUFDO3FCQUFBLEFBRkQsSUFFQztvQkFFRCxJQUFJLE9BQTBCLENBQUM7b0JBRy9CO3dCQUNFOzRCQUFnQixPQUFPLEdBQUcsSUFBSSxDQUFDO3dCQUFDLENBQUM7d0JBSWpDOzRCQURDLFlBQUssQ0FBQyxNQUFNLENBQUM7OzZEQUNDO3dCQUxYLE9BQU87NEJBRFosZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUMsQ0FBQzs7MkJBQzFCLE9BQU8sQ0FNWjt3QkFBRCxjQUFDO3FCQUFBLEFBTkQsSUFNQztvQkFFRCxpQkFBTyxDQUFDLGtDQUFrQyxDQUN0QyxXQUFXLEVBQUUsdUNBQXVDLENBQUMsQ0FBQztvQkFFMUQsSUFBTSxPQUFPLEdBQUcsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQyxFQUFDLFlBQVksRUFBRSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsRUFBQyxDQUFDO3lCQUNqRSxlQUFlLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBQ2xELE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQztvQkFDeEIsaUJBQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO29CQUN6RCxpQkFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUMxQyxpQkFBTSxDQUFDLE9BQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQzNDLENBQUMsQ0FBQyxDQUFDO2dCQUVILEVBQUUsQ0FBQyxnREFBZ0QsRUFBRTtvQkFFbkQ7d0JBQUE7d0JBQ0EsQ0FBQzt3QkFESyxXQUFXOzRCQURoQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFDLENBQUM7MkJBQ3ZDLFdBQVcsQ0FDaEI7d0JBQUQsa0JBQUM7cUJBQUEsQUFERCxJQUNDO29CQUVELGlCQUFPLENBQUMsR0FBRyxDQUFDLGVBQVEsQ0FBQyxDQUFDO29CQUV0QixpQkFBTSxDQUFDLGNBQU0sT0FBQSxpQkFBTyxDQUFDLGtDQUFrQyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsRUFBNUQsQ0FBNEQsQ0FBQzt5QkFDckUsWUFBWSxDQUNULDZFQUE2RSxDQUFDLENBQUM7Z0JBQ3pGLENBQUMsQ0FBQyxDQUFDO2dCQUVILEVBQUUsQ0FBQyw0REFBNEQsRUFBRTtvQkFFL0Q7d0JBQUE7d0JBQ0EsQ0FBQzt3QkFESyxXQUFXOzRCQURoQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFDLENBQUM7MkJBQ3ZDLFdBQVcsQ0FDaEI7d0JBQUQsa0JBQUM7cUJBQUEsQUFERCxJQUNDO29CQUVELGlCQUFPLENBQUMsa0NBQWtDLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUU3RCxJQUFNLE9BQU8sR0FBRyxpQkFBTyxDQUFDLGtCQUFrQixFQUFFO3lCQUN2QixzQkFBc0IsQ0FBQyxFQUFDLFlBQVksRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFDLENBQUM7eUJBQ3JELGVBQWUsQ0FBQyxXQUFXLENBQUMsQ0FBQztvQkFDbEQsaUJBQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNoRCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsUUFBUSxDQUFDLHlCQUF5QixFQUFFO2dCQUVsQyxRQUFRLENBQUMsV0FBVyxFQUFFO29CQUNwQixVQUFVLENBQUM7d0JBQ1QsSUFBTSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDOzZCQUNqQyxHQUFHLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQzt3QkFDaEYsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQyxFQUFDLFlBQVksRUFBRSxDQUFDLG1CQUFtQixDQUFDLEVBQUMsQ0FBQyxDQUFDO3dCQUN0RSxpQkFBTyxDQUFDLGlCQUFpQixDQUNyQixFQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLHlCQUFjLEVBQUUsUUFBUSxFQUFFLEVBQUMsR0FBRyxFQUFFLGlCQUFpQixFQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztvQkFDcEYsQ0FBQyxDQUFDLENBQUM7b0JBRUgsRUFBRSxDQUFDLDZCQUE2QixFQUFFLG1CQUFTLENBQUM7d0JBQ3ZDLGlCQUFPLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzt3QkFDNUIsY0FBSSxFQUFFLENBQUM7d0JBQ1AsSUFBTSxXQUFXLEdBQUcsaUJBQU8sQ0FBQyxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQzt3QkFDakUsaUJBQU0sQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO29CQUMvRCxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNULENBQUMsQ0FBQyxDQUFDO2dCQUVILFFBQVEsQ0FBQyxhQUFhLEVBQUU7b0JBQ3RCLFVBQVUsQ0FBQyxjQUFNLE9BQUEsaUJBQU8sQ0FBQyxpQkFBaUIsQ0FBQyxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQyxFQUF6QyxDQUF5QyxDQUFDLENBQUM7b0JBQzVELEVBQUUsQ0FBQywwQ0FBMEMsRUFDMUMsZ0JBQU0sQ0FBQyxDQUFDLHlCQUFjLENBQUMsRUFBRSxVQUFDLE1BQXNCO3dCQUM5QyxpQkFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ25DLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1QsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsUUFBUSxDQUFDLGNBQWMsRUFBRTtvQkFDdkIsVUFBVSxDQUFDLGNBQU0sT0FBQSxpQkFBTyxDQUFDLGlCQUFpQixDQUFDLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxDQUFDLEVBQTFDLENBQTBDLENBQUMsQ0FBQztvQkFDN0QsRUFBRSxDQUFDLDBDQUEwQyxFQUMxQyxnQkFBTSxDQUFDLENBQUMseUJBQWMsQ0FBQyxFQUFFLFVBQUMsTUFBc0I7d0JBQzlDLGlCQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDcEMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDVCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsUUFBUSxFQUFFO1lBQ2pCLElBQUksaUJBQTBFLENBQUM7WUFDL0UsSUFBSSx5QkFBK0UsQ0FBQztZQUVwRixJQUFNLGNBQWMsR0FBRztnQkFDckIsSUFBSSxPQUE4QixDQUFDO2dCQUNuQyxJQUFJLE1BQTRCLENBQUM7Z0JBQ2pDLElBQU0sT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLFVBQUMsR0FBRyxFQUFFLEdBQUc7b0JBQ25DLE9BQU8sR0FBRyxHQUFHLENBQUM7b0JBQ2QsTUFBTSxHQUFHLEdBQUcsQ0FBQztnQkFDZixDQUFDLENBQUMsQ0FBQztnQkFDSCxpQkFBaUIsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDO2dCQUN4QyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLFVBQUMsV0FBbUIsRUFBRSxFQUEwQjtvQkFDcEUsSUFBTSxJQUFJLEdBQVcsQ0FBQyxjQUFNLE9BQUEsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFiLENBQWEsQ0FBQyxDQUFDO29CQUMzQyxJQUFJLENBQUMsSUFBSSxHQUFHLFVBQUMsR0FBRyxJQUFLLE9BQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFYLENBQVcsQ0FBQztvQkFDakMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNULE9BQU8sSUFBSSxDQUFDO2dCQUNkLENBQUMsQ0FBQztnQkFDRixPQUFPLE9BQU8sQ0FBQztZQUNqQixDQUFDLENBQUM7WUFFRixJQUFNLGdCQUFnQixHQUFHLGNBQU0sT0FBQSxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLGlCQUFpQixFQUF2QyxDQUF1QyxDQUFDO1lBRXZFLElBQU0sc0JBQXNCLEdBQUc7Z0JBQzdCLElBQUksT0FBOEIsQ0FBQztnQkFDbkMsSUFBSSxNQUE0QixDQUFDO2dCQUNqQyxJQUFNLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFDLEdBQUcsRUFBRSxHQUFHO29CQUNuQyxPQUFPLEdBQUcsR0FBRyxDQUFDO29CQUNkLE1BQU0sR0FBRyxHQUFHLENBQUM7Z0JBQ2YsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gseUJBQXlCLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQztnQkFDeEQsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLFVBQVUsR0FBRyxVQUFDLEVBQTBCO29CQUN2RCxJQUFNLElBQUksR0FBVyxDQUFDLGNBQU0sT0FBQSxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQWIsQ0FBYSxDQUFDLENBQUM7b0JBQzNDLElBQUksQ0FBQyxJQUFJLEdBQUcsVUFBQyxHQUFHLElBQUssT0FBQSxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQVgsQ0FBVyxDQUFDO29CQUNqQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ1gsQ0FBQyxDQUFDO2dCQUNGLE9BQU8sT0FBTyxDQUFDO1lBQ2pCLENBQUMsQ0FBQztZQUVGLElBQU0sd0JBQXdCLEdBQUcsY0FBTSxPQUFBLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxVQUFVO2dCQUM5RCx5QkFBeUIsRUFEVSxDQUNWLENBQUM7WUFFOUIsRUFBRSxDQUFDLGtEQUFrRCxFQUFFLFVBQUMsSUFBSTtnQkFDMUQsSUFBTSxTQUFTLEdBQUcsY0FBYyxFQUFFLENBQUM7Z0JBQ25DLElBQU0sUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUVsQyxFQUFFLENBQUMsdUJBQXVCLEVBQ3ZCLGVBQUssQ0FBQyxnQkFBTSxDQUFDLEVBQUUsRUFBRSxjQUFNLE9BQUEsVUFBVSxDQUFDLGNBQVEsTUFBTSxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQXhDLENBQXdDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRXRFLFNBQVMsQ0FBQyxJQUFJLENBQUMsY0FBTSxPQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsdUNBQXVDLENBQUMsRUFBbEQsQ0FBa0QsRUFBRSxVQUFDLEdBQUc7b0JBQzNFLGlCQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUM5QixJQUFJLEVBQUUsQ0FBQztnQkFDVCxDQUFDLENBQUMsQ0FBQztnQkFDSCxnQkFBZ0IsRUFBRSxDQUFDO1lBQ3JCLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLGlEQUFpRCxFQUFFLFVBQUMsSUFBSTtnQkFDekQsSUFBTSxTQUFTLEdBQUcsY0FBYyxFQUFFLENBQUM7Z0JBRW5DLEVBQUUsQ0FBQywwQ0FBMEMsRUFBRSxlQUFLLENBQUMsZ0JBQU0sQ0FBQyxFQUFFLEVBQUU7b0JBQzNELElBQUksTUFBTSxHQUF5QixTQUFXLENBQUM7b0JBQy9DLElBQU0sT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLFVBQUMsQ0FBQyxFQUFFLEdBQUcsSUFBSyxPQUFBLE1BQU0sR0FBRyxHQUFHLEVBQVosQ0FBWSxDQUFDLENBQUM7b0JBQ3RELElBQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBTSxPQUFBLGlCQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFwQixDQUFvQixDQUFDLENBQUM7b0JBRW5ELE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDZCxPQUFPLENBQUMsQ0FBQztnQkFDWCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRVIsU0FBUyxDQUFDLElBQUksQ0FBQyxjQUFNLE9BQUEsSUFBSSxDQUFDLElBQUksQ0FBQyx1Q0FBdUMsQ0FBQyxFQUFsRCxDQUFrRCxFQUFFLFVBQUMsR0FBRztvQkFDM0UsaUJBQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7b0JBQzFELElBQUksRUFBRSxDQUFDO2dCQUNULENBQUMsQ0FBQyxDQUFDO2dCQUNILGdCQUFnQixFQUFFLENBQUM7WUFDckIsQ0FBQyxDQUFDLENBQUM7WUFFSCxRQUFRLENBQUMsWUFBWSxFQUFFO2dCQUNyQixJQUFJLGlCQUE4QixDQUFDO2dCQUNuQyxVQUFVLENBQUM7b0JBQ1QsaUJBQWlCLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQzt5QkFDakMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7b0JBQzFFLGlCQUFPLENBQUMsaUJBQWlCLENBQ3JCLEVBQUMsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUseUJBQWMsRUFBRSxRQUFRLEVBQUUsRUFBQyxHQUFHLEVBQUUsaUJBQWlCLEVBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO2dCQUNwRixDQUFDLENBQUMsQ0FBQztnQkFFSCxFQUFFLENBQUMsNEdBQTRHLEVBQzVHO29CQUNFLElBQU0sU0FBUyxHQUFHLGNBQWMsRUFBRSxDQUFDO29CQUVuQyxpQkFBTSxDQUNGO3dCQUNJLE9BQUEsRUFBRSxDQUFDLGFBQWEsRUFBRSxvQkFBVSxDQUNOLEVBQUMsWUFBWSxFQUFFLENBQUMsbUJBQW1CLENBQUMsRUFBQyxFQUNyQyxjQUFNLE9BQUEsaUJBQU8sQ0FBQyxlQUFlLENBQUMsbUJBQW1CLENBQUMsRUFBNUMsQ0FBNEMsQ0FBQyxDQUFDO29CQUYxRSxDQUUwRSxDQUFDO3lCQUM5RSxZQUFZLENBQ1QseUNBQXVDLGlCQUFTLENBQUMsbUJBQW1CLENBQUMsdUZBQWdGO3dCQUNySiw2REFBMkQsQ0FBQyxDQUFDO29CQUVyRSxnQkFBZ0IsRUFBRSxDQUFDO2dCQUNyQixDQUFDLENBQUMsQ0FBQztZQUVSLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLHdFQUF3RSxFQUFFO2dCQUUzRTtvQkFBQTtvQkFDQSxDQUFDO29CQURLLDZCQUE2Qjt3QkFEbEMsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSx3REFBd0QsRUFBQyxDQUFDO3VCQUMxRSw2QkFBNkIsQ0FDbEM7b0JBQUQsb0NBQUM7aUJBQUEsQUFERCxJQUNDO2dCQUVELElBQU0sU0FBUyxHQUFHLGNBQWMsRUFBRSxDQUFDO2dCQUVuQyxpQkFBTSxDQUNGLGNBQU0sT0FBQSxFQUFFLENBQ0osYUFBYSxFQUFFLG9CQUFVLENBQ04sRUFBQyxZQUFZLEVBQUUsQ0FBQyw2QkFBNkIsQ0FBQyxFQUFDLEVBQy9DLGNBQU0sT0FBQSxpQkFBTyxDQUFDLGVBQWUsQ0FBQyw2QkFBNkIsQ0FBQyxFQUF0RCxDQUFzRCxDQUFDLENBQUMsRUFIL0UsQ0FHK0UsQ0FBQztxQkFDckYsWUFBWSxDQUFDLGlDQUFpQyxDQUFDLENBQUM7Z0JBRXJELGdCQUFnQixFQUFFLENBQUM7WUFDckIsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtZQUU5QixVQUFVLENBQUM7Z0JBQ1QsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQztvQkFDN0IsWUFBWSxFQUFFO3dCQUNaLFNBQVM7d0JBQ1QsUUFBUTt3QkFDUixjQUFjO3dCQUNkLFVBQVU7d0JBQ1YsaUJBQWlCO3dCQUNqQixxQkFBcUI7cUJBQ3RCO2lCQUNGLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLCtDQUErQyxFQUFFLGVBQUssQ0FBQztnQkFDckQsSUFBTSxPQUFPLEdBQUcsaUJBQU8sQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ25ELE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFFeEIsaUJBQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDN0QsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVQLEVBQUUsQ0FBQyxnREFBZ0QsRUFBRSxlQUFLLENBQUM7Z0JBQ3RELElBQU0sZ0JBQWdCLEdBQUcsaUJBQU8sQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzNELGdCQUFnQixDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNqQyxpQkFBTSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFFNUQsZ0JBQWdCLENBQUMsaUJBQWlCLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztnQkFDbkQsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ2pDLGlCQUFNLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ2xFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFUCxFQUFFLENBQUMsNEJBQTRCLEVBQUUsZUFBSyxDQUFDO2dCQUNsQyxpQkFBTyxDQUFDLGlCQUFpQixDQUFDLFNBQVMsRUFBRSxFQUFDLEdBQUcsRUFBRSxFQUFDLFFBQVEsRUFBRSxtQkFBbUIsRUFBQyxFQUFDLENBQUMsQ0FBQztnQkFDN0UsSUFBTSxnQkFBZ0IsR0FBRyxpQkFBTyxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDNUQsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ2pDLGlCQUFNLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRTVELENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFUCxFQUFFLENBQUMsNEJBQTRCLEVBQUUsZUFBSyxDQUFDO2dCQUNsQyxpQkFBTyxDQUFDLGlCQUFpQixDQUNyQixpQkFBaUIsRUFDakIsRUFBQyxHQUFHLEVBQUUsRUFBQyxTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLGdCQUFnQixFQUFDLENBQUMsRUFBQyxFQUFDLENBQUMsQ0FBQztnQkFDL0UsSUFBTSxnQkFBZ0IsR0FBRyxpQkFBTyxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2dCQUNwRSxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDakMsaUJBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLENBQUMsa0NBQWtDLENBQUMsQ0FBQztZQUN4RixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBR1AsRUFBRSxDQUFDLGdDQUFnQyxFQUFFLGVBQUssQ0FBQztnQkFDdEMsaUJBQU8sQ0FBQyxpQkFBaUIsQ0FDckIscUJBQXFCLEVBQ3JCLEVBQUMsR0FBRyxFQUFFLEVBQUMsYUFBYSxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsRUFBQyxDQUFDLEVBQUMsRUFBQyxDQUFDLENBQUM7Z0JBRW5GLElBQU0sZ0JBQWdCLEdBQUcsaUJBQU8sQ0FBQyxlQUFlLENBQUMscUJBQXFCLENBQUMsQ0FBQztnQkFDeEUsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ2pDLGlCQUFNLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxDQUFDLGtDQUFrQyxDQUFDLENBQUM7WUFDeEYsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNULENBQUMsQ0FBQyxDQUFDO1FBQ0gsUUFBUSxDQUFDLDRCQUE0QixFQUFFO1lBQ3JDLFVBQVUsQ0FBQztnQkFDVCxpQkFBTyxDQUFDLHNCQUFzQixDQUFDO29CQUM3QixZQUFZLEVBQUU7d0JBQ1osYUFBYTt3QkFDYixVQUFVO3FCQUNYO2lCQUNGLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLHdDQUF3QyxFQUFFLGVBQUssQ0FBQztnQkFFOUMsSUFBTSxnQkFBZ0IsR0FBRyxpQkFBTyxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDN0QsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ2pDLGlCQUFNLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ3BFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDVCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0NBQ0oifQ==