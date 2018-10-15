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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
var SimpleDirective = /** @class */ (function () {
    function SimpleDirective() {
        this.value = null;
    }
    __decorate([
        core_1.Input('simpleDirective'),
        __metadata("design:type", Object)
    ], SimpleDirective.prototype, "value", void 0);
    SimpleDirective = __decorate([
        core_1.Directive({ selector: '[simpleDirective]' })
    ], SimpleDirective);
    return SimpleDirective;
}());
var SimpleComponent = /** @class */ (function () {
    function SimpleComponent() {
    }
    SimpleComponent = __decorate([
        core_1.Component({ selector: '[simpleComponent]', template: '' })
    ], SimpleComponent);
    return SimpleComponent;
}());
var SomeOtherDirective = /** @class */ (function () {
    function SomeOtherDirective() {
    }
    SomeOtherDirective = __decorate([
        core_1.Directive({ selector: '[someOtherDirective]' })
    ], SomeOtherDirective);
    return SomeOtherDirective;
}());
var CycleDirective = /** @class */ (function () {
    function CycleDirective(self) {
    }
    CycleDirective = __decorate([
        core_1.Directive({ selector: '[cycleDirective]' }),
        __metadata("design:paramtypes", [CycleDirective])
    ], CycleDirective);
    return CycleDirective;
}());
var NeedsDirectiveFromSelf = /** @class */ (function () {
    function NeedsDirectiveFromSelf(dependency) {
        this.dependency = dependency;
    }
    NeedsDirectiveFromSelf = __decorate([
        core_1.Directive({ selector: '[needsDirectiveFromSelf]' }),
        __param(0, core_1.Self()),
        __metadata("design:paramtypes", [SimpleDirective])
    ], NeedsDirectiveFromSelf);
    return NeedsDirectiveFromSelf;
}());
var OptionallyNeedsDirective = /** @class */ (function () {
    function OptionallyNeedsDirective(dependency) {
        this.dependency = dependency;
    }
    OptionallyNeedsDirective = __decorate([
        core_1.Directive({ selector: '[optionallyNeedsDirective]' }),
        __param(0, core_1.Self()), __param(0, core_1.Optional()),
        __metadata("design:paramtypes", [SimpleDirective])
    ], OptionallyNeedsDirective);
    return OptionallyNeedsDirective;
}());
var NeedsComponentFromHost = /** @class */ (function () {
    function NeedsComponentFromHost(dependency) {
        this.dependency = dependency;
    }
    NeedsComponentFromHost = __decorate([
        core_1.Directive({ selector: '[needsComponentFromHost]' }),
        __param(0, core_1.Host()),
        __metadata("design:paramtypes", [SimpleComponent])
    ], NeedsComponentFromHost);
    return NeedsComponentFromHost;
}());
var NeedsDirectiveFromHost = /** @class */ (function () {
    function NeedsDirectiveFromHost(dependency) {
        this.dependency = dependency;
    }
    NeedsDirectiveFromHost = __decorate([
        core_1.Directive({ selector: '[needsDirectiveFromHost]' }),
        __param(0, core_1.Host()),
        __metadata("design:paramtypes", [SimpleDirective])
    ], NeedsDirectiveFromHost);
    return NeedsDirectiveFromHost;
}());
var NeedsDirective = /** @class */ (function () {
    function NeedsDirective(dependency) {
        this.dependency = dependency;
    }
    NeedsDirective = __decorate([
        core_1.Directive({ selector: '[needsDirective]' }),
        __metadata("design:paramtypes", [SimpleDirective])
    ], NeedsDirective);
    return NeedsDirective;
}());
var NeedsService = /** @class */ (function () {
    function NeedsService(service) {
        this.service = service;
    }
    NeedsService = __decorate([
        core_1.Directive({ selector: '[needsService]' }),
        __param(0, core_1.Inject('service')),
        __metadata("design:paramtypes", [Object])
    ], NeedsService);
    return NeedsService;
}());
var NeedsAppService = /** @class */ (function () {
    function NeedsAppService(service) {
        this.service = service;
    }
    NeedsAppService = __decorate([
        core_1.Directive({ selector: '[needsAppService]' }),
        __param(0, core_1.Inject('appService')),
        __metadata("design:paramtypes", [Object])
    ], NeedsAppService);
    return NeedsAppService;
}());
var NeedsHostAppService = /** @class */ (function () {
    function NeedsHostAppService(service) {
        this.service = service;
    }
    NeedsHostAppService = __decorate([
        core_1.Component({ selector: '[needsHostAppService]', template: '' }),
        __param(0, core_1.Host()), __param(0, core_1.Inject('appService')),
        __metadata("design:paramtypes", [Object])
    ], NeedsHostAppService);
    return NeedsHostAppService;
}());
var NeedsServiceComponent = /** @class */ (function () {
    function NeedsServiceComponent(service) {
        this.service = service;
    }
    NeedsServiceComponent = __decorate([
        core_1.Component({ selector: '[needsServiceComponent]', template: '' }),
        __param(0, core_1.Inject('service')),
        __metadata("design:paramtypes", [Object])
    ], NeedsServiceComponent);
    return NeedsServiceComponent;
}());
var NeedsServiceFromHost = /** @class */ (function () {
    function NeedsServiceFromHost(service) {
        this.service = service;
    }
    NeedsServiceFromHost = __decorate([
        core_1.Directive({ selector: '[needsServiceFromHost]' }),
        __param(0, core_1.Host()), __param(0, core_1.Inject('service')),
        __metadata("design:paramtypes", [Object])
    ], NeedsServiceFromHost);
    return NeedsServiceFromHost;
}());
var NeedsAttribute = /** @class */ (function () {
    function NeedsAttribute(typeAttribute, titleAttribute, fooAttribute) {
        this.typeAttribute = typeAttribute;
        this.titleAttribute = titleAttribute;
        this.fooAttribute = fooAttribute;
    }
    NeedsAttribute = __decorate([
        core_1.Directive({ selector: '[needsAttribute]' }),
        __param(0, core_1.Attribute('type')), __param(1, core_1.Attribute('title')),
        __param(2, core_1.Attribute('foo')),
        __metadata("design:paramtypes", [String, String,
            String])
    ], NeedsAttribute);
    return NeedsAttribute;
}());
var NeedsAttributeNoType = /** @class */ (function () {
    function NeedsAttributeNoType(fooAttribute) {
        this.fooAttribute = fooAttribute;
    }
    NeedsAttributeNoType = __decorate([
        core_1.Directive({ selector: '[needsAttributeNoType]' }),
        __param(0, core_1.Attribute('foo')),
        __metadata("design:paramtypes", [Object])
    ], NeedsAttributeNoType);
    return NeedsAttributeNoType;
}());
var NeedsElementRef = /** @class */ (function () {
    function NeedsElementRef(elementRef) {
        this.elementRef = elementRef;
    }
    NeedsElementRef = __decorate([
        core_1.Directive({ selector: '[needsElementRef]' }),
        __metadata("design:paramtypes", [core_1.ElementRef])
    ], NeedsElementRef);
    return NeedsElementRef;
}());
var NeedsViewContainerRef = /** @class */ (function () {
    function NeedsViewContainerRef(viewContainer) {
        this.viewContainer = viewContainer;
    }
    NeedsViewContainerRef = __decorate([
        core_1.Directive({ selector: '[needsViewContainerRef]' }),
        __metadata("design:paramtypes", [core_1.ViewContainerRef])
    ], NeedsViewContainerRef);
    return NeedsViewContainerRef;
}());
var NeedsTemplateRef = /** @class */ (function () {
    function NeedsTemplateRef(templateRef) {
        this.templateRef = templateRef;
    }
    NeedsTemplateRef = __decorate([
        core_1.Directive({ selector: '[needsTemplateRef]' }),
        __metadata("design:paramtypes", [core_1.TemplateRef])
    ], NeedsTemplateRef);
    return NeedsTemplateRef;
}());
var OptionallyNeedsTemplateRef = /** @class */ (function () {
    function OptionallyNeedsTemplateRef(templateRef) {
        this.templateRef = templateRef;
    }
    OptionallyNeedsTemplateRef = __decorate([
        core_1.Directive({ selector: '[optionallyNeedsTemplateRef]' }),
        __param(0, core_1.Optional()),
        __metadata("design:paramtypes", [core_1.TemplateRef])
    ], OptionallyNeedsTemplateRef);
    return OptionallyNeedsTemplateRef;
}());
var DirectiveNeedsChangeDetectorRef = /** @class */ (function () {
    function DirectiveNeedsChangeDetectorRef(changeDetectorRef) {
        this.changeDetectorRef = changeDetectorRef;
    }
    DirectiveNeedsChangeDetectorRef = __decorate([
        core_1.Directive({ selector: '[directiveNeedsChangeDetectorRef]' }),
        __metadata("design:paramtypes", [core_1.ChangeDetectorRef])
    ], DirectiveNeedsChangeDetectorRef);
    return DirectiveNeedsChangeDetectorRef;
}());
var PushComponentNeedsChangeDetectorRef = /** @class */ (function () {
    function PushComponentNeedsChangeDetectorRef(changeDetectorRef) {
        this.changeDetectorRef = changeDetectorRef;
        this.counter = 0;
    }
    PushComponentNeedsChangeDetectorRef = __decorate([
        core_1.Component({
            selector: '[componentNeedsChangeDetectorRef]',
            template: '{{counter}}',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }),
        __metadata("design:paramtypes", [core_1.ChangeDetectorRef])
    ], PushComponentNeedsChangeDetectorRef);
    return PushComponentNeedsChangeDetectorRef;
}());
var PurePipe = /** @class */ (function () {
    function PurePipe() {
    }
    PurePipe.prototype.transform = function (value) { return this; };
    PurePipe = __decorate([
        core_1.Pipe({ name: 'purePipe', pure: true }),
        __metadata("design:paramtypes", [])
    ], PurePipe);
    return PurePipe;
}());
var ImpurePipe = /** @class */ (function () {
    function ImpurePipe() {
    }
    ImpurePipe.prototype.transform = function (value) { return this; };
    ImpurePipe = __decorate([
        core_1.Pipe({ name: 'impurePipe', pure: false }),
        __metadata("design:paramtypes", [])
    ], ImpurePipe);
    return ImpurePipe;
}());
var PipeNeedsChangeDetectorRef = /** @class */ (function () {
    function PipeNeedsChangeDetectorRef(changeDetectorRef) {
        this.changeDetectorRef = changeDetectorRef;
    }
    PipeNeedsChangeDetectorRef.prototype.transform = function (value) { return this; };
    PipeNeedsChangeDetectorRef = __decorate([
        core_1.Pipe({ name: 'pipeNeedsChangeDetectorRef' }),
        __metadata("design:paramtypes", [core_1.ChangeDetectorRef])
    ], PipeNeedsChangeDetectorRef);
    return PipeNeedsChangeDetectorRef;
}());
var PipeNeedsService = /** @class */ (function () {
    function PipeNeedsService(service) {
        this.service = service;
    }
    PipeNeedsService.prototype.transform = function (value) { return this; };
    PipeNeedsService = __decorate([
        core_1.Pipe({ name: 'pipeNeedsService' }),
        __param(0, core_1.Inject('service')),
        __metadata("design:paramtypes", [Object])
    ], PipeNeedsService);
    return PipeNeedsService;
}());
exports.PipeNeedsService = PipeNeedsService;
var DuplicatePipe1 = /** @class */ (function () {
    function DuplicatePipe1() {
    }
    DuplicatePipe1.prototype.transform = function (value) { return this; };
    DuplicatePipe1 = __decorate([
        core_1.Pipe({ name: 'duplicatePipe' })
    ], DuplicatePipe1);
    return DuplicatePipe1;
}());
exports.DuplicatePipe1 = DuplicatePipe1;
var DuplicatePipe2 = /** @class */ (function () {
    function DuplicatePipe2() {
    }
    DuplicatePipe2.prototype.transform = function (value) { return this; };
    DuplicatePipe2 = __decorate([
        core_1.Pipe({ name: 'duplicatePipe' })
    ], DuplicatePipe2);
    return DuplicatePipe2;
}());
exports.DuplicatePipe2 = DuplicatePipe2;
var TestComp = /** @class */ (function () {
    function TestComp() {
    }
    TestComp = __decorate([
        core_1.Component({ selector: 'root', template: '' })
    ], TestComp);
    return TestComp;
}());
(function () {
    function createComponentFixture(template, providers, comp) {
        if (!comp) {
            comp = TestComp;
        }
        testing_1.TestBed.overrideComponent(comp, { set: { template: template } });
        if (providers && providers.length) {
            testing_1.TestBed.overrideComponent(comp, { add: { providers: providers } });
        }
        return testing_1.TestBed.createComponent(comp);
    }
    function createComponent(template, providers, comp) {
        var fixture = createComponentFixture(template, providers, comp);
        fixture.detectChanges();
        return fixture.debugElement;
    }
    describe('View injector', function () {
        // On CJS fakeAsync is not supported...
        if (!dom_adapter_1.getDOM().supportsDOMEvents())
            return;
        var TOKEN = new core_1.InjectionToken('token');
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                declarations: [TestComp],
                providers: [
                    { provide: TOKEN, useValue: 'appService' },
                    { provide: 'appService', useFactory: function (v) { return v; }, deps: [TOKEN] },
                ],
            });
        });
        describe('injection', function () {
            it('should instantiate directives that have no dependencies', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleDirective] });
                var el = createComponent('<div simpleDirective>');
                matchers_1.expect(el.children[0].injector.get(SimpleDirective)).toBeAnInstanceOf(SimpleDirective);
            });
            it('should instantiate directives that depend on another directive', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleDirective, NeedsDirective] });
                var el = createComponent('<div simpleDirective needsDirective>');
                var d = el.children[0].injector.get(NeedsDirective);
                matchers_1.expect(d).toBeAnInstanceOf(NeedsDirective);
                matchers_1.expect(d.dependency).toBeAnInstanceOf(SimpleDirective);
            });
            it('should support useValue with different values', function () {
                var el = createComponent('', [
                    { provide: 'numLiteral', useValue: 0 },
                    { provide: 'boolLiteral', useValue: true },
                    { provide: 'strLiteral', useValue: 'a' },
                    { provide: 'null', useValue: null },
                    { provide: 'array', useValue: [1] },
                    { provide: 'map', useValue: { 'a': 1 } },
                    { provide: 'instance', useValue: new TestValue('a') },
                    { provide: 'nested', useValue: [{ 'a': [1] }, new TestValue('b')] },
                ]);
                matchers_1.expect(el.injector.get('numLiteral')).toBe(0);
                matchers_1.expect(el.injector.get('boolLiteral')).toBe(true);
                matchers_1.expect(el.injector.get('strLiteral')).toBe('a');
                matchers_1.expect(el.injector.get('null')).toBe(null);
                matchers_1.expect(el.injector.get('array')).toEqual([1]);
                matchers_1.expect(el.injector.get('map')).toEqual({ 'a': 1 });
                matchers_1.expect(el.injector.get('instance')).toEqual(new TestValue('a'));
                matchers_1.expect(el.injector.get('nested')).toEqual([{ 'a': [1] }, new TestValue('b')]);
            });
            it('should instantiate providers that have dependencies with SkipSelf', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleDirective, SomeOtherDirective] });
                testing_1.TestBed.overrideDirective(SimpleDirective, { add: { providers: [{ provide: 'injectable1', useValue: 'injectable1' }] } });
                testing_1.TestBed.overrideDirective(SomeOtherDirective, {
                    add: {
                        providers: [
                            { provide: 'injectable1', useValue: 'new-injectable1' }, {
                                provide: 'injectable2',
                                useFactory: function (val) { return val + "-injectable2"; },
                                deps: [[new core_1.Inject('injectable1'), new core_1.SkipSelf()]]
                            }
                        ]
                    }
                });
                var el = createComponent('<div simpleDirective><span someOtherDirective></span></div>');
                matchers_1.expect(el.children[0].children[0].injector.get('injectable2'))
                    .toEqual('injectable1-injectable2');
            });
            it('should instantiate providers that have dependencies', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleDirective] });
                var providers = [
                    { provide: 'injectable1', useValue: 'injectable1' }, {
                        provide: 'injectable2',
                        useFactory: function (val) { return val + "-injectable2"; },
                        deps: ['injectable1']
                    }
                ];
                testing_1.TestBed.overrideDirective(SimpleDirective, { add: { providers: providers } });
                var el = createComponent('<div simpleDirective></div>');
                matchers_1.expect(el.children[0].injector.get('injectable2')).toEqual('injectable1-injectable2');
            });
            it('should instantiate viewProviders that have dependencies', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleComponent] });
                var viewProviders = [
                    { provide: 'injectable1', useValue: 'injectable1' }, {
                        provide: 'injectable2',
                        useFactory: function (val) { return val + "-injectable2"; },
                        deps: ['injectable1']
                    }
                ];
                testing_1.TestBed.overrideComponent(SimpleComponent, { set: { viewProviders: viewProviders } });
                var el = createComponent('<div simpleComponent></div>');
                matchers_1.expect(el.children[0].injector.get('injectable2')).toEqual('injectable1-injectable2');
            });
            it('should instantiate components that depend on viewProviders providers', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [NeedsServiceComponent] });
                testing_1.TestBed.overrideComponent(NeedsServiceComponent, { set: { providers: [{ provide: 'service', useValue: 'service' }] } });
                var el = createComponent('<div needsServiceComponent></div>');
                matchers_1.expect(el.children[0].injector.get(NeedsServiceComponent).service).toEqual('service');
            });
            it('should instantiate multi providers', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleDirective] });
                var providers = [
                    { provide: 'injectable1', useValue: 'injectable11', multi: true },
                    { provide: 'injectable1', useValue: 'injectable12', multi: true }
                ];
                testing_1.TestBed.overrideDirective(SimpleDirective, { set: { providers: providers } });
                var el = createComponent('<div simpleDirective></div>');
                matchers_1.expect(el.children[0].injector.get('injectable1')).toEqual([
                    'injectable11', 'injectable12'
                ]);
            });
            it('should instantiate providers lazily', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleDirective] });
                var created = false;
                testing_1.TestBed.overrideDirective(SimpleDirective, { set: { providers: [{ provide: 'service', useFactory: function () { return created = true; } }] } });
                var el = createComponent('<div simpleDirective></div>');
                matchers_1.expect(created).toBe(false);
                el.children[0].injector.get('service');
                matchers_1.expect(created).toBe(true);
            });
            it('should provide undefined', function () {
                var factoryCounter = 0;
                var el = createComponent('', [{
                        provide: 'token',
                        useFactory: function () {
                            factoryCounter++;
                            return undefined;
                        }
                    }]);
                matchers_1.expect(el.injector.get('token')).toBeUndefined();
                matchers_1.expect(el.injector.get('token')).toBeUndefined();
                matchers_1.expect(factoryCounter).toBe(1);
            });
            describe('injecting lazy providers into an eager provider via Injector.get', function () {
                it('should inject providers that were declared before it', function () {
                    var MyComp = /** @class */ (function () {
                        // Component is eager, which makes all of its deps eager
                        function MyComp(eager) {
                        }
                        MyComp = __decorate([
                            core_1.Component({
                                template: '',
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
                        ], MyComp);
                        return MyComp;
                    }());
                    var ctx = testing_1.TestBed.configureTestingModule({ declarations: [MyComp] }).createComponent(MyComp);
                    matchers_1.expect(ctx.debugElement.injector.get('eager')).toBe('eagerValue: lazyValue');
                });
                it('should inject providers that were declared after it', function () {
                    var MyComp = /** @class */ (function () {
                        // Component is eager, which makes all of its deps eager
                        function MyComp(eager) {
                        }
                        MyComp = __decorate([
                            core_1.Component({
                                template: '',
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
                        ], MyComp);
                        return MyComp;
                    }());
                    var ctx = testing_1.TestBed.configureTestingModule({ declarations: [MyComp] }).createComponent(MyComp);
                    matchers_1.expect(ctx.debugElement.injector.get('eager')).toBe('eagerValue: lazyValue');
                });
            });
            describe('injecting eager providers into an eager provider via Injector.get', function () {
                it('should inject providers that were declared before it', function () {
                    var MyComp = /** @class */ (function () {
                        // Component is eager, which makes all of its deps eager
                        function MyComp(eager1, eager2) {
                        }
                        MyComp = __decorate([
                            core_1.Component({
                                template: '',
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
                        ], MyComp);
                        return MyComp;
                    }());
                    var ctx = testing_1.TestBed.configureTestingModule({ declarations: [MyComp] }).createComponent(MyComp);
                    matchers_1.expect(ctx.debugElement.injector.get('eager2')).toBe('v2: v1');
                });
                it('should inject providers that were declared after it', function () {
                    var MyComp = /** @class */ (function () {
                        // Component is eager, which makes all of its deps eager
                        function MyComp(eager1, eager2) {
                        }
                        MyComp = __decorate([
                            core_1.Component({
                                template: '',
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
                        ], MyComp);
                        return MyComp;
                    }());
                    var ctx = testing_1.TestBed.configureTestingModule({ declarations: [MyComp] }).createComponent(MyComp);
                    matchers_1.expect(ctx.debugElement.injector.get('eager1')).toBe('v1: v2');
                });
            });
            it('should allow injecting lazy providers via Injector.get from an eager provider that is declared earlier', function () {
                var SomeComponent = /** @class */ (function () {
                    function SomeComponent(injector) {
                        this.a = injector.get('a');
                    }
                    SomeComponent = __decorate([
                        core_1.Component({ providers: [{ provide: 'a', useFactory: function () { return 'aValue'; } }], template: '' }),
                        __metadata("design:paramtypes", [core_1.Injector])
                    ], SomeComponent);
                    return SomeComponent;
                }());
                var comp = testing_1.TestBed.configureTestingModule({ declarations: [SomeComponent] })
                    .createComponent(SomeComponent);
                matchers_1.expect(comp.componentInstance.a).toBe('aValue');
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
                var SomeComp = /** @class */ (function () {
                    function SomeComp() {
                    }
                    SomeComp = __decorate([
                        core_1.Component({ providers: [SomeInjectable], template: '' })
                    ], SomeComp);
                    return SomeComp;
                }());
                testing_1.TestBed.configureTestingModule({ declarations: [SomeComp] });
                var compRef = testing_1.TestBed.createComponent(SomeComp).componentRef;
                matchers_1.expect(created).toBe(false);
                matchers_1.expect(destroyed).toBe(false);
                // no error if the provider was not yet created
                compRef.destroy();
                matchers_1.expect(created).toBe(false);
                matchers_1.expect(destroyed).toBe(false);
                compRef = testing_1.TestBed.createComponent(SomeComp).componentRef;
                compRef.injector.get(SomeInjectable);
                matchers_1.expect(created).toBe(true);
                compRef.destroy();
                matchers_1.expect(destroyed).toBe(true);
            });
            it('should instantiate view providers lazily', function () {
                var created = false;
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleComponent] });
                testing_1.TestBed.overrideComponent(SimpleComponent, { set: { viewProviders: [{ provide: 'service', useFactory: function () { return created = true; } }] } });
                var el = createComponent('<div simpleComponent></div>');
                matchers_1.expect(created).toBe(false);
                el.children[0].injector.get('service');
                matchers_1.expect(created).toBe(true);
            });
            it('should not instantiate other directives that depend on viewProviders providers (same element)', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleComponent, NeedsService] });
                testing_1.TestBed.overrideComponent(SimpleComponent, { set: { viewProviders: [{ provide: 'service', useValue: 'service' }] } });
                matchers_1.expect(function () { return createComponent('<div simpleComponent needsService></div>'); })
                    .toThrowError(/No provider for service!/);
            });
            it('should not instantiate other directives that depend on viewProviders providers (child element)', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleComponent, NeedsService] });
                testing_1.TestBed.overrideComponent(SimpleComponent, { set: { viewProviders: [{ provide: 'service', useValue: 'service' }] } });
                matchers_1.expect(function () { return createComponent('<div simpleComponent><div needsService></div></div>'); })
                    .toThrowError(/No provider for service!/);
            });
            it('should instantiate directives that depend on providers of other directives', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleDirective, NeedsService] });
                testing_1.TestBed.overrideDirective(SimpleDirective, { set: { providers: [{ provide: 'service', useValue: 'parentService' }] } });
                var el = createComponent('<div simpleDirective><div needsService></div></div>');
                matchers_1.expect(el.children[0].children[0].injector.get(NeedsService).service)
                    .toEqual('parentService');
            });
            it('should instantiate directives that depend on providers in a parent view', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleDirective, NeedsService] });
                testing_1.TestBed.overrideDirective(SimpleDirective, { set: { providers: [{ provide: 'service', useValue: 'parentService' }] } });
                var el = createComponent('<div simpleDirective><ng-container *ngIf="true"><div *ngIf="true" needsService></div></ng-container></div>');
                matchers_1.expect(el.children[0].children[0].injector.get(NeedsService).service)
                    .toEqual('parentService');
            });
            it('should instantiate directives that depend on providers of a component', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleComponent, NeedsService] });
                testing_1.TestBed.overrideComponent(SimpleComponent, { set: { providers: [{ provide: 'service', useValue: 'hostService' }] } });
                testing_1.TestBed.overrideComponent(SimpleComponent, { set: { template: '<div needsService></div>' } });
                var el = createComponent('<div simpleComponent></div>');
                matchers_1.expect(el.children[0].children[0].injector.get(NeedsService).service)
                    .toEqual('hostService');
            });
            it('should instantiate directives that depend on view providers of a component', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleComponent, NeedsService] });
                testing_1.TestBed.overrideComponent(SimpleComponent, { set: { providers: [{ provide: 'service', useValue: 'hostService' }] } });
                testing_1.TestBed.overrideComponent(SimpleComponent, { set: { template: '<div needsService></div>' } });
                var el = createComponent('<div simpleComponent></div>');
                matchers_1.expect(el.children[0].children[0].injector.get(NeedsService).service)
                    .toEqual('hostService');
            });
            it('should instantiate directives in a root embedded view that depend on view providers of a component', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleComponent, NeedsService] });
                testing_1.TestBed.overrideComponent(SimpleComponent, { set: { providers: [{ provide: 'service', useValue: 'hostService' }] } });
                testing_1.TestBed.overrideComponent(SimpleComponent, { set: { template: '<div *ngIf="true" needsService></div>' } });
                var el = createComponent('<div simpleComponent></div>');
                matchers_1.expect(el.children[0].children[0].injector.get(NeedsService).service)
                    .toEqual('hostService');
            });
            it('should instantiate directives that depend on instances in the app injector', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [NeedsAppService] });
                var el = createComponent('<div needsAppService></div>');
                matchers_1.expect(el.children[0].injector.get(NeedsAppService).service).toEqual('appService');
            });
            it('should not instantiate a directive with cyclic dependencies', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [CycleDirective] });
                matchers_1.expect(function () { return createComponent('<div cycleDirective></div>'); })
                    .toThrowError(/Template parse errors:\nCannot instantiate cyclic dependency! CycleDirective \("\[ERROR ->\]<div cycleDirective><\/div>"\): .*TestComp.html@0:0/);
            });
            it('should not instantiate a directive in a view that has a host dependency on providers' +
                ' of the component', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleComponent, NeedsServiceFromHost] });
                testing_1.TestBed.overrideComponent(SimpleComponent, { set: { providers: [{ provide: 'service', useValue: 'hostService' }] } });
                testing_1.TestBed.overrideComponent(SimpleComponent, { set: { template: '<div needsServiceFromHost><div>' } });
                matchers_1.expect(function () { return createComponent('<div simpleComponent></div>'); })
                    .toThrowError(/Template parse errors:\nNo provider for service \("\[ERROR ->\]<div needsServiceFromHost><div>"\): .*SimpleComponent.html@0:0/);
            });
            it('should not instantiate a directive in a view that has a host dependency on providers' +
                ' of a decorator directive', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleComponent, SomeOtherDirective, NeedsServiceFromHost] });
                testing_1.TestBed.overrideComponent(SimpleComponent, { set: { providers: [{ provide: 'service', useValue: 'hostService' }] } });
                testing_1.TestBed.overrideComponent(SimpleComponent, { set: { template: '<div needsServiceFromHost><div>' } });
                matchers_1.expect(function () { return createComponent('<div simpleComponent someOtherDirective></div>'); })
                    .toThrowError(/Template parse errors:\nNo provider for service \("\[ERROR ->\]<div needsServiceFromHost><div>"\): .*SimpleComponent.html@0:0/);
            });
            it('should not instantiate a directive in a view that has a self dependency on a parent directive', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleDirective, NeedsDirectiveFromSelf] });
                matchers_1.expect(function () {
                    return createComponent('<div simpleDirective><div needsDirectiveFromSelf></div></div>');
                })
                    .toThrowError(/Template parse errors:\nNo provider for SimpleDirective \("<div simpleDirective>\[ERROR ->\]<div needsDirectiveFromSelf><\/div><\/div>"\): .*TestComp.html@0:21/);
            });
            it('should instantiate directives that depend on other directives', testing_1.fakeAsync(function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleDirective, NeedsDirective] });
                var el = createComponent('<div simpleDirective><div needsDirective></div></div>');
                var d = el.children[0].children[0].injector.get(NeedsDirective);
                matchers_1.expect(d).toBeAnInstanceOf(NeedsDirective);
                matchers_1.expect(d.dependency).toBeAnInstanceOf(SimpleDirective);
            }));
            it('should throw when a dependency cannot be resolved', testing_1.fakeAsync(function () {
                testing_1.TestBed.configureTestingModule({ declarations: [NeedsService] });
                matchers_1.expect(function () { return createComponent('<div needsService></div>'); })
                    .toThrowError(/No provider for service!/);
            }));
            it('should inject null when an optional dependency cannot be resolved', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [OptionallyNeedsDirective] });
                var el = createComponent('<div optionallyNeedsDirective></div>');
                var d = el.children[0].injector.get(OptionallyNeedsDirective);
                matchers_1.expect(d.dependency).toBeNull();
            });
            it('should instantiate directives that depends on the host component', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleComponent, NeedsComponentFromHost] });
                testing_1.TestBed.overrideComponent(SimpleComponent, { set: { template: '<div needsComponentFromHost></div>' } });
                var el = createComponent('<div simpleComponent></div>');
                var d = el.children[0].children[0].injector.get(NeedsComponentFromHost);
                matchers_1.expect(d.dependency).toBeAnInstanceOf(SimpleComponent);
            });
            it('should instantiate host views for components that have a @Host dependency ', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [NeedsHostAppService] });
                var el = createComponent('', [], NeedsHostAppService);
                matchers_1.expect(el.componentInstance.service).toEqual('appService');
            });
            it('should not instantiate directives that depend on other directives on the host element', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleComponent, SimpleDirective, NeedsDirectiveFromHost] });
                testing_1.TestBed.overrideComponent(SimpleComponent, { set: { template: '<div needsDirectiveFromHost></div>' } });
                matchers_1.expect(function () { return createComponent('<div simpleComponent simpleDirective></div>'); })
                    .toThrowError(/Template parse errors:\nNo provider for SimpleDirective \("\[ERROR ->\]<div needsDirectiveFromHost><\/div>"\): .*SimpleComponent.html@0:0/);
            });
            it('should allow to use the NgModule injector from a root ViewContainerRef.parentInjector', function () {
                var MyComp = /** @class */ (function () {
                    function MyComp(vc) {
                        this.vc = vc;
                    }
                    MyComp = __decorate([
                        core_1.Component({ template: '' }),
                        __metadata("design:paramtypes", [core_1.ViewContainerRef])
                    ], MyComp);
                    return MyComp;
                }());
                var compFixture = testing_1.TestBed
                    .configureTestingModule({
                    declarations: [MyComp],
                    providers: [{ provide: 'someToken', useValue: 'someValue' }]
                })
                    .createComponent(MyComp);
                matchers_1.expect(compFixture.componentInstance.vc.parentInjector.get('someToken'))
                    .toBe('someValue');
            });
        });
        describe('static attributes', function () {
            it('should be injectable', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [NeedsAttribute] });
                var el = createComponent('<div needsAttribute type="text" title></div>');
                var needsAttribute = el.children[0].injector.get(NeedsAttribute);
                matchers_1.expect(needsAttribute.typeAttribute).toEqual('text');
                matchers_1.expect(needsAttribute.titleAttribute).toEqual('');
                matchers_1.expect(needsAttribute.fooAttribute).toEqual(null);
            });
            it('should be injectable without type annotation', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [NeedsAttributeNoType] });
                var el = createComponent('<div needsAttributeNoType foo="bar"></div>');
                var needsAttribute = el.children[0].injector.get(NeedsAttributeNoType);
                matchers_1.expect(needsAttribute.fooAttribute).toEqual('bar');
            });
        });
        describe('refs', function () {
            it('should inject ElementRef', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [NeedsElementRef] });
                var el = createComponent('<div needsElementRef></div>');
                matchers_1.expect(el.children[0].injector.get(NeedsElementRef).elementRef.nativeElement)
                    .toBe(el.children[0].nativeElement);
            });
            it('should inject ChangeDetectorRef of the component\'s view into the component', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [PushComponentNeedsChangeDetectorRef] });
                var cf = createComponentFixture('<div componentNeedsChangeDetectorRef></div>');
                cf.detectChanges();
                var compEl = cf.debugElement.children[0];
                var comp = compEl.injector.get(PushComponentNeedsChangeDetectorRef);
                comp.counter = 1;
                cf.detectChanges();
                matchers_1.expect(compEl.nativeElement).toHaveText('0');
                comp.changeDetectorRef.markForCheck();
                cf.detectChanges();
                matchers_1.expect(compEl.nativeElement).toHaveText('1');
            });
            it('should inject ChangeDetectorRef of the containing component into directives', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [PushComponentNeedsChangeDetectorRef, DirectiveNeedsChangeDetectorRef] });
                testing_1.TestBed.overrideComponent(PushComponentNeedsChangeDetectorRef, {
                    set: {
                        template: '{{counter}}<div directiveNeedsChangeDetectorRef></div><div *ngIf="true" directiveNeedsChangeDetectorRef></div>'
                    }
                });
                var cf = createComponentFixture('<div componentNeedsChangeDetectorRef></div>');
                cf.detectChanges();
                var compEl = cf.debugElement.children[0];
                var comp = compEl.injector.get(PushComponentNeedsChangeDetectorRef);
                comp.counter = 1;
                cf.detectChanges();
                matchers_1.expect(compEl.nativeElement).toHaveText('0');
                matchers_1.expect(compEl.children[0].injector.get(DirectiveNeedsChangeDetectorRef).changeDetectorRef)
                    .toEqual(comp.changeDetectorRef);
                matchers_1.expect(compEl.children[1].injector.get(DirectiveNeedsChangeDetectorRef).changeDetectorRef)
                    .toEqual(comp.changeDetectorRef);
                comp.changeDetectorRef.markForCheck();
                cf.detectChanges();
                matchers_1.expect(compEl.nativeElement).toHaveText('1');
            });
            it('should inject ChangeDetectorRef of a same element component into a directive', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [PushComponentNeedsChangeDetectorRef, DirectiveNeedsChangeDetectorRef] });
                var cf = createComponentFixture('<div componentNeedsChangeDetectorRef directiveNeedsChangeDetectorRef></div>');
                cf.detectChanges();
                var compEl = cf.debugElement.children[0];
                var comp = compEl.injector.get(PushComponentNeedsChangeDetectorRef);
                var dir = compEl.injector.get(DirectiveNeedsChangeDetectorRef);
                comp.counter = 1;
                cf.detectChanges();
                matchers_1.expect(compEl.nativeElement).toHaveText('0');
                dir.changeDetectorRef.markForCheck();
                cf.detectChanges();
                matchers_1.expect(compEl.nativeElement).toHaveText('1');
            });
            it("should not inject ChangeDetectorRef of a parent element's component into a directive", function () {
                testing_1.TestBed
                    .configureTestingModule({
                    declarations: [PushComponentNeedsChangeDetectorRef, DirectiveNeedsChangeDetectorRef]
                })
                    .overrideComponent(PushComponentNeedsChangeDetectorRef, { set: { template: '<ng-content></ng-content>{{counter}}' } });
                var cf = createComponentFixture('<div componentNeedsChangeDetectorRef><div directiveNeedsChangeDetectorRef></div></div>');
                cf.detectChanges();
                var compEl = cf.debugElement.children[0];
                var comp = compEl.injector.get(PushComponentNeedsChangeDetectorRef);
                var dirEl = compEl.children[0];
                var dir = dirEl.injector.get(DirectiveNeedsChangeDetectorRef);
                comp.counter = 1;
                cf.detectChanges();
                matchers_1.expect(compEl.nativeElement).toHaveText('0');
                dir.changeDetectorRef.markForCheck();
                cf.detectChanges();
                matchers_1.expect(compEl.nativeElement).toHaveText('0');
            });
            it('should inject ViewContainerRef', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [NeedsViewContainerRef] });
                var el = createComponent('<div needsViewContainerRef></div>');
                matchers_1.expect(el.children[0].injector.get(NeedsViewContainerRef).viewContainer.element.nativeElement)
                    .toBe(el.children[0].nativeElement);
            });
            it('should inject ViewContainerRef', function () {
                var TestComp = /** @class */ (function () {
                    function TestComp(vcr) {
                        this.vcr = vcr;
                    }
                    TestComp = __decorate([
                        core_1.Component({ template: '' }),
                        __metadata("design:paramtypes", [core_1.ViewContainerRef])
                    ], TestComp);
                    return TestComp;
                }());
                var TestModule = /** @class */ (function () {
                    function TestModule() {
                    }
                    TestModule = __decorate([
                        core_1.NgModule({
                            declarations: [TestComp],
                            entryComponents: [TestComp],
                        })
                    ], TestModule);
                    return TestModule;
                }());
                var testInjector = {
                    get: function (token, notFoundValue) {
                        return token === 'someToken' ? 'someNewValue' : notFoundValue;
                    }
                };
                var compFactory = testing_1.TestBed.configureTestingModule({ imports: [TestModule] })
                    .get(core_1.ComponentFactoryResolver)
                    .resolveComponentFactory(TestComp);
                var component = compFactory.create(testInjector);
                matchers_1.expect(component.instance.vcr.parentInjector.get('someToken')).toBe('someNewValue');
            });
            it('should inject TemplateRef', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [NeedsViewContainerRef, NeedsTemplateRef] });
                var el = createComponent('<ng-template needsViewContainerRef needsTemplateRef></ng-template>');
                matchers_1.expect(el.childNodes[0].injector.get(NeedsTemplateRef).templateRef.elementRef)
                    .toEqual(el.childNodes[0].injector.get(NeedsViewContainerRef).viewContainer.element);
            });
            it('should throw if there is no TemplateRef', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [NeedsTemplateRef] });
                matchers_1.expect(function () { return createComponent('<div needsTemplateRef></div>'); })
                    .toThrowError(/No provider for TemplateRef!/);
            });
            it('should inject null if there is no TemplateRef when the dependency is optional', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [OptionallyNeedsTemplateRef] });
                var el = createComponent('<div optionallyNeedsTemplateRef></div>');
                var instance = el.children[0].injector.get(OptionallyNeedsTemplateRef);
                matchers_1.expect(instance.templateRef).toBeNull();
            });
        });
        describe('pipes', function () {
            it('should instantiate pipes that have dependencies', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleDirective, PipeNeedsService] });
                var el = createComponent('<div [simpleDirective]="true | pipeNeedsService"></div>', [{ provide: 'service', useValue: 'pipeService' }]);
                matchers_1.expect(el.children[0].injector.get(SimpleDirective).value.service).toEqual('pipeService');
            });
            it('should overwrite pipes with later entry in the pipes array', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleDirective, DuplicatePipe1, DuplicatePipe2] });
                var el = createComponent('<div [simpleDirective]="true | duplicatePipe"></div>');
                matchers_1.expect(el.children[0].injector.get(SimpleDirective).value).toBeAnInstanceOf(DuplicatePipe2);
            });
            it('should inject ChangeDetectorRef into pipes', function () {
                testing_1.TestBed.configureTestingModule({
                    declarations: [SimpleDirective, PipeNeedsChangeDetectorRef, DirectiveNeedsChangeDetectorRef]
                });
                var el = createComponent('<div [simpleDirective]="true | pipeNeedsChangeDetectorRef" directiveNeedsChangeDetectorRef></div>');
                var cdRef = el.children[0].injector.get(DirectiveNeedsChangeDetectorRef).changeDetectorRef;
                matchers_1.expect(el.children[0].injector.get(SimpleDirective).value.changeDetectorRef).toEqual(cdRef);
            });
            it('should cache pure pipes', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleDirective, PurePipe] });
                var el = createComponent('<div [simpleDirective]="true | purePipe"></div><div [simpleDirective]="true | purePipe"></div>' +
                    '<div *ngFor="let x of [1,2]" [simpleDirective]="true | purePipe"></div>');
                var purePipe1 = el.children[0].injector.get(SimpleDirective).value;
                var purePipe2 = el.children[1].injector.get(SimpleDirective).value;
                var purePipe3 = el.children[2].injector.get(SimpleDirective).value;
                var purePipe4 = el.children[3].injector.get(SimpleDirective).value;
                matchers_1.expect(purePipe1).toBeAnInstanceOf(PurePipe);
                matchers_1.expect(purePipe2).toBe(purePipe1);
                matchers_1.expect(purePipe3).toBe(purePipe1);
                matchers_1.expect(purePipe4).toBe(purePipe1);
            });
            it('should not cache impure pipes', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleDirective, ImpurePipe] });
                var el = createComponent('<div [simpleDirective]="true | impurePipe"></div><div [simpleDirective]="true | impurePipe"></div>' +
                    '<div *ngFor="let x of [1,2]" [simpleDirective]="true | impurePipe"></div>');
                var impurePipe1 = el.children[0].injector.get(SimpleDirective).value;
                var impurePipe2 = el.children[1].injector.get(SimpleDirective).value;
                var impurePipe3 = el.children[2].injector.get(SimpleDirective).value;
                var impurePipe4 = el.children[3].injector.get(SimpleDirective).value;
                matchers_1.expect(impurePipe1).toBeAnInstanceOf(ImpurePipe);
                matchers_1.expect(impurePipe2).toBeAnInstanceOf(ImpurePipe);
                matchers_1.expect(impurePipe2).not.toBe(impurePipe1);
                matchers_1.expect(impurePipe3).toBeAnInstanceOf(ImpurePipe);
                matchers_1.expect(impurePipe3).not.toBe(impurePipe1);
                matchers_1.expect(impurePipe4).toBeAnInstanceOf(ImpurePipe);
                matchers_1.expect(impurePipe4).not.toBe(impurePipe1);
            });
        });
    });
})();
var TestValue = /** @class */ (function () {
    function TestValue(value) {
        this.value = value;
    }
    return TestValue;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld19pbmplY3Rvcl9pbnRlZ3JhdGlvbl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L2xpbmtlci92aWV3X2luamVjdG9yX2ludGVncmF0aW9uX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBcVQ7QUFDclQsaURBQTJFO0FBQzNFLDZFQUFxRTtBQUNyRSwyRUFBc0U7QUFHdEU7SUFEQTtRQUU0QixVQUFLLEdBQVEsSUFBSSxDQUFDO0lBQzlDLENBQUM7SUFEMkI7UUFBekIsWUFBSyxDQUFDLGlCQUFpQixDQUFDOztrREFBbUI7SUFEeEMsZUFBZTtRQURwQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLG1CQUFtQixFQUFDLENBQUM7T0FDckMsZUFBZSxDQUVwQjtJQUFELHNCQUFDO0NBQUEsQUFGRCxJQUVDO0FBR0Q7SUFBQTtJQUNBLENBQUM7SUFESyxlQUFlO1FBRHBCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsbUJBQW1CLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBQyxDQUFDO09BQ25ELGVBQWUsQ0FDcEI7SUFBRCxzQkFBQztDQUFBLEFBREQsSUFDQztBQUdEO0lBQUE7SUFDQSxDQUFDO0lBREssa0JBQWtCO1FBRHZCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsc0JBQXNCLEVBQUMsQ0FBQztPQUN4QyxrQkFBa0IsQ0FDdkI7SUFBRCx5QkFBQztDQUFBLEFBREQsSUFDQztBQUdEO0lBQ0Usd0JBQVksSUFBb0I7SUFBRyxDQUFDO0lBRGhDLGNBQWM7UUFEbkIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxrQkFBa0IsRUFBQyxDQUFDO3lDQUV0QixjQUFjO09BRDVCLGNBQWMsQ0FFbkI7SUFBRCxxQkFBQztDQUFBLEFBRkQsSUFFQztBQUdEO0lBRUUsZ0NBQW9CLFVBQTJCO1FB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