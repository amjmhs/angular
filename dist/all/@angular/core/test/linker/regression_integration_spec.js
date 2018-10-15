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
var testing_1 = require("@angular/core/testing");
var platform_browser_1 = require("@angular/platform-browser");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
{
    describe('jit', function () { declareTests({ useJit: true }); });
    describe('no jit', function () { declareTests({ useJit: false }); });
    declareTestsUsingBootstrap();
}
function declareTests(_a) {
    var useJit = _a.useJit;
    // Place to put reproductions for regressions
    describe('regressions', function () {
        beforeEach(function () { testing_1.TestBed.configureTestingModule({ declarations: [MyComp1, PlatformPipe] }); });
        describe('platform pipes', function () {
            beforeEach(function () { testing_1.TestBed.configureCompiler({ useJit: useJit }); });
            it('should overwrite them by custom pipes', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [CustomPipe] });
                var template = '{{true | somePipe}}';
                testing_1.TestBed.overrideComponent(MyComp1, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp1);
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('someCustomPipe');
            });
        });
        describe('expressions', function () {
            it('should evaluate conditional and boolean operators with right precedence - #8244', function () {
                var template = "{{'red' + (true ? ' border' : '')}}";
                testing_1.TestBed.overrideComponent(MyComp1, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp1);
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('red border');
            });
            it('should evaluate conditional and unary operators with right precedence - #8235', function () {
                var template = "{{!null?.length}}";
                testing_1.TestBed.overrideComponent(MyComp1, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp1);
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('true');
            });
            it('should only evaluate stateful pipes once - #10639', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [CountingPipe] });
                var template = '{{(null|countingPipe)?.value}}';
                testing_1.TestBed.overrideComponent(MyComp1, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp1);
                CountingPipe.reset();
                fixture.detectChanges(/* checkNoChanges */ false);
                matchers_1.expect(fixture.nativeElement).toHaveText('counting pipe value');
                matchers_1.expect(CountingPipe.calls).toBe(1);
            });
            it('should only update the bound property when using asyncPipe - #15205', testing_1.fakeAsync(function () {
                var MyComp = /** @class */ (function () {
                    function MyComp() {
                        this.p = Promise.resolve(1);
                    }
                    MyComp = __decorate([
                        core_1.Component({ template: '<div myDir [a]="p | async" [b]="2"></div>' })
                    ], MyComp);
                    return MyComp;
                }());
                var MyDir = /** @class */ (function () {
                    function MyDir() {
                        this.setterCalls = {};
                    }
                    Object.defineProperty(MyDir.prototype, "a", {
                        set: function (v) { this.setterCalls['a'] = v; },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(MyDir.prototype, "b", {
                        set: function (v) { this.setterCalls['b'] = v; },
                        enumerable: true,
                        configurable: true
                    });
                    MyDir.prototype.ngOnChanges = function (changes) { this.changes = changes; };
                    __decorate([
                        core_1.Input(),
                        __metadata("design:type", Number),
                        __metadata("design:paramtypes", [Number])
                    ], MyDir.prototype, "a", null);
                    __decorate([
                        core_1.Input(),
                        __metadata("design:type", Number),
                        __metadata("design:paramtypes", [Number])
                    ], MyDir.prototype, "b", null);
                    MyDir = __decorate([
                        core_1.Directive({ selector: '[myDir]' })
                    ], MyDir);
                    return MyDir;
                }());
                testing_1.TestBed.configureTestingModule({ declarations: [MyDir, MyComp] });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                var dir = fixture.debugElement.query(platform_browser_1.By.directive(MyDir)).injector.get(MyDir);
                fixture.detectChanges();
                matchers_1.expect(dir.setterCalls).toEqual({ 'a': null, 'b': 2 });
                matchers_1.expect(Object.keys(dir.changes)).toEqual(['a', 'b']);
                dir.setterCalls = {};
                dir.changes = {};
                testing_1.tick();
                fixture.detectChanges();
                matchers_1.expect(dir.setterCalls).toEqual({ 'a': 1 });
                matchers_1.expect(Object.keys(dir.changes)).toEqual(['a']);
            }));
            it('should only evaluate methods once - #10639', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyCountingComp] });
                var template = '{{method()?.value}}';
                testing_1.TestBed.overrideComponent(MyCountingComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyCountingComp);
                MyCountingComp.reset();
                fixture.detectChanges(/* checkNoChanges */ false);
                matchers_1.expect(fixture.nativeElement).toHaveText('counting method value');
                matchers_1.expect(MyCountingComp.calls).toBe(1);
            });
            it('should evaluate a conditional in a statement binding', function () {
                var SomeComponent = /** @class */ (function () {
                    function SomeComponent() {
                    }
                    SomeComponent = __decorate([
                        core_1.Component({ selector: 'some-comp', template: '<p (click)="nullValue?.click()"></p>' })
                    ], SomeComponent);
                    return SomeComponent;
                }());
                var SomeReferencedClass = /** @class */ (function () {
                    function SomeReferencedClass() {
                    }
                    SomeReferencedClass.prototype.click = function () { };
                    return SomeReferencedClass;
                }());
                matchers_1.expect(function () {
                    var fixture = testing_1.TestBed.configureTestingModule({ declarations: [SomeComponent] })
                        .createComponent(SomeComponent);
                    fixture.detectChanges(/* checkNoChanges */ false);
                }).not.toThrow();
            });
        });
        describe('providers', function () {
            function createInjector(providers) {
                testing_1.TestBed.overrideComponent(MyComp1, { add: { providers: providers } });
                return testing_1.TestBed.createComponent(MyComp1).componentInstance.injector;
            }
            it('should support providers with an InjectionToken that contains a `.` in the name', function () {
                var token = new core_1.InjectionToken('a.b');
                var tokenValue = 1;
                var injector = createInjector([{ provide: token, useValue: tokenValue }]);
                matchers_1.expect(injector.get(token)).toEqual(tokenValue);
            });
            it('should support providers with string token with a `.` in it', function () {
                var token = 'a.b';
                var tokenValue = 1;
                var injector = createInjector([{ provide: token, useValue: tokenValue }]);
                matchers_1.expect(injector.get(token)).toEqual(tokenValue);
            });
            it('should support providers with an anonymous function as token', function () {
                var token = function () { return true; };
                var tokenValue = 1;
                var injector = createInjector([{ provide: token, useValue: tokenValue }]);
                matchers_1.expect(injector.get(token)).toEqual(tokenValue);
            });
            it('should support providers with an InjectionToken that has a StringMap as value', function () {
                var token1 = new core_1.InjectionToken('someToken');
                var token2 = new core_1.InjectionToken('someToken');
                var tokenValue1 = { 'a': 1 };
                var tokenValue2 = { 'a': 1 };
                var injector = createInjector([{ provide: token1, useValue: tokenValue1 }, { provide: token2, useValue: tokenValue2 }]);
                matchers_1.expect(injector.get(token1)).toEqual(tokenValue1);
                matchers_1.expect(injector.get(token2)).toEqual(tokenValue2);
            });
            it('should support providers that have a `name` property with a number value', function () {
                var TestClass = /** @class */ (function () {
                    function TestClass(name) {
                        this.name = name;
                    }
                    return TestClass;
                }());
                var data = [new TestClass(1), new TestClass(2)];
                var injector = createInjector([{ provide: 'someToken', useValue: data }]);
                matchers_1.expect(injector.get('someToken')).toEqual(data);
            });
            describe('ANALYZE_FOR_ENTRY_COMPONENTS providers', function () {
                it('should support class instances', function () {
                    var SomeObject = /** @class */ (function () {
                        function SomeObject() {
                        }
                        SomeObject.prototype.someMethod = function () { };
                        return SomeObject;
                    }());
                    matchers_1.expect(function () { return createInjector([
                        { provide: core_1.ANALYZE_FOR_ENTRY_COMPONENTS, useValue: new SomeObject(), multi: true }
                    ]); })
                        .not.toThrow();
                });
            });
        });
        it('should allow logging a previous elements class binding via interpolation', function () {
            var template = "<div [class.a]=\"true\" #el>Class: {{el.className}}</div>";
            testing_1.TestBed.overrideComponent(MyComp1, { set: { template: template } });
            var fixture = testing_1.TestBed.createComponent(MyComp1);
            fixture.detectChanges();
            matchers_1.expect(fixture.nativeElement).toHaveText('Class: a');
        });
        it('should support ngClass before a component and content projection inside of an ngIf', function () {
            testing_1.TestBed.configureTestingModule({ declarations: [CmpWithNgContent] });
            var template = "A<cmp-content *ngIf=\"true\" [ngClass]=\"'red'\">B</cmp-content>C";
            testing_1.TestBed.overrideComponent(MyComp1, { set: { template: template } });
            var fixture = testing_1.TestBed.createComponent(MyComp1);
            fixture.detectChanges();
            matchers_1.expect(fixture.nativeElement).toHaveText('ABC');
        });
        it('should handle mutual recursion entered from multiple sides - #7084', function () {
            testing_1.TestBed.configureTestingModule({ declarations: [FakeRecursiveComp, LeftComp, RightComp] });
            var fixture = testing_1.TestBed.createComponent(FakeRecursiveComp);
            fixture.detectChanges();
            matchers_1.expect(fixture.nativeElement).toHaveText('[]');
        });
        it('should generate the correct output when constructors have the same name', function () {
            function ComponentFactory(selector, template) {
                var MyComponent = /** @class */ (function () {
                    function MyComponent() {
                    }
                    MyComponent = __decorate([
                        core_1.Component({ selector: selector, template: template })
                    ], MyComponent);
                    return MyComponent;
                }());
                return MyComponent;
            }
            var HeroComponent = ComponentFactory('my-hero', 'my hero');
            var VillainComponent = ComponentFactory('a-villain', 'a villain');
            var MainComponent = ComponentFactory('my-app', 'I was saved by <my-hero></my-hero> from <a-villain></a-villain>.');
            testing_1.TestBed.configureTestingModule({ declarations: [HeroComponent, VillainComponent, MainComponent] });
            var fixture = testing_1.TestBed.createComponent(MainComponent);
            matchers_1.expect(fixture.nativeElement).toHaveText('I was saved by my hero from a villain.');
        });
        it('should allow to use the renderer outside of views', function () {
            var MyComp = /** @class */ (function () {
                function MyComp(renderer) {
                    this.renderer = renderer;
                }
                MyComp = __decorate([
                    core_1.Component({ template: '' }),
                    __metadata("design:paramtypes", [core_1.Renderer2])
                ], MyComp);
                return MyComp;
            }());
            testing_1.TestBed.configureTestingModule({ declarations: [MyComp] });
            var ctx = testing_1.TestBed.createComponent(MyComp);
            var txtNode = ctx.componentInstance.renderer.createText('test');
            matchers_1.expect(txtNode).toHaveText('test');
        });
        it('should not recreate TemplateRef references during dirty checking', function () {
            var MyComp = /** @class */ (function () {
                function MyComp() {
                }
                MyComp = __decorate([
                    core_1.Component({ template: '<div [someDir]="someRef"></div><ng-template #someRef></ng-template>' })
                ], MyComp);
                return MyComp;
            }());
            var MyDir = /** @class */ (function () {
                function MyDir() {
                }
                __decorate([
                    core_1.Input('someDir'),
                    __metadata("design:type", core_1.TemplateRef)
                ], MyDir.prototype, "template", void 0);
                MyDir = __decorate([
                    core_1.Directive({ selector: '[someDir]' })
                ], MyDir);
                return MyDir;
            }());
            var ctx = testing_1.TestBed.configureTestingModule({ declarations: [MyComp, MyDir] }).createComponent(MyComp);
            var dir = ctx.debugElement.query(platform_browser_1.By.directive(MyDir)).injector.get(MyDir);
            matchers_1.expect(dir.template).toBeUndefined();
            ctx.detectChanges();
            var template = dir.template;
            matchers_1.expect(template).toBeDefined();
            ctx.detectChanges();
            matchers_1.expect(dir.template).toBe(template);
        });
        it('should not recreate ViewContainerRefs in queries', function () {
            var MyComp = /** @class */ (function () {
                function MyComp() {
                    this.show = true;
                }
                __decorate([
                    core_1.ViewChildren('vc', { read: core_1.ViewContainerRef }),
                    __metadata("design:type", core_1.QueryList)
                ], MyComp.prototype, "viewContainers", void 0);
                MyComp = __decorate([
                    core_1.Component({ template: '<div #vc></div><div *ngIf="show" #vc></div>' })
                ], MyComp);
                return MyComp;
            }());
            var ctx = testing_1.TestBed.configureTestingModule({ declarations: [MyComp] }).createComponent(MyComp);
            ctx.componentInstance.show = true;
            ctx.detectChanges();
            matchers_1.expect(ctx.componentInstance.viewContainers.length).toBe(2);
            var vc = ctx.componentInstance.viewContainers.first;
            matchers_1.expect(vc).toBeDefined();
            ctx.componentInstance.show = false;
            ctx.detectChanges();
            matchers_1.expect(ctx.componentInstance.viewContainers.first).toBe(vc);
        });
        describe('empty templates - #15143', function () {
            it('should allow empty components', function () {
                var MyComp = /** @class */ (function () {
                    function MyComp() {
                    }
                    MyComp = __decorate([
                        core_1.Component({ template: '' })
                    ], MyComp);
                    return MyComp;
                }());
                var fixture = testing_1.TestBed.configureTestingModule({ declarations: [MyComp] }).createComponent(MyComp);
                fixture.detectChanges();
                matchers_1.expect(fixture.debugElement.childNodes.length).toBe(0);
            });
            it('should allow empty embedded templates', function () {
                var MyComp = /** @class */ (function () {
                    function MyComp() {
                    }
                    MyComp = __decorate([
                        core_1.Component({ template: '<ng-template [ngIf]="true"></ng-template>' })
                    ], MyComp);
                    return MyComp;
                }());
                var fixture = testing_1.TestBed.configureTestingModule({ declarations: [MyComp] }).createComponent(MyComp);
                fixture.detectChanges();
                // Note: We always need to create at least a comment in an embedded template,
                // so we can append other templates after it.
                // 1 comment for the anchor,
                // 1 comment for the empty embedded template.
                matchers_1.expect(fixture.debugElement.childNodes.length).toBe(2);
            });
        });
        it('should support @ContentChild and @Input on the same property for static queries', function () {
            var Test = /** @class */ (function () {
                function Test() {
                }
                __decorate([
                    core_1.Input(), core_1.ContentChild(core_1.TemplateRef),
                    __metadata("design:type", core_1.TemplateRef)
                ], Test.prototype, "tpl", void 0);
                Test = __decorate([
                    core_1.Directive({ selector: 'test' })
                ], Test);
                return Test;
            }());
            var App = /** @class */ (function () {
                function App() {
                }
                App = __decorate([
                    core_1.Component({
                        selector: 'my-app',
                        template: "\n          <test></test><br>\n          <test><ng-template>Custom as a child</ng-template></test><br>\n          <ng-template #custom>Custom as a binding</ng-template>\n          <test [tpl]=\"custom\"></test><br>\n        "
                    })
                ], App);
                return App;
            }());
            var fixture = testing_1.TestBed.configureTestingModule({ declarations: [App, Test] }).createComponent(App);
            fixture.detectChanges();
            var testDirs = fixture.debugElement.queryAll(platform_browser_1.By.directive(Test)).map(function (el) { return el.injector.get(Test); });
            matchers_1.expect(testDirs[0].tpl).toBeUndefined();
            matchers_1.expect(testDirs[1].tpl).toBeDefined();
            matchers_1.expect(testDirs[2].tpl).toBeDefined();
        });
        it('should not add ng-version for dynamically created components', function () {
            var App = /** @class */ (function () {
                function App() {
                }
                App = __decorate([
                    core_1.Component({ template: '' })
                ], App);
                return App;
            }());
            var MyModule = /** @class */ (function () {
                function MyModule() {
                }
                MyModule = __decorate([
                    core_1.NgModule({ declarations: [App], entryComponents: [App] })
                ], MyModule);
                return MyModule;
            }());
            var modRef = testing_1.TestBed.configureTestingModule({ imports: [MyModule] })
                .get(core_1.NgModuleRef);
            var compRef = modRef.componentFactoryResolver.resolveComponentFactory(App).create(core_1.Injector.NULL);
            matchers_1.expect(dom_adapter_1.getDOM().hasAttribute(compRef.location.nativeElement, 'ng-version')).toBe(false);
        });
    });
}
function declareTestsUsingBootstrap() {
    // Place to put reproductions for regressions
    describe('regressions using bootstrap', function () {
        var COMP_SELECTOR = 'root-comp';
        var MockConsole = /** @class */ (function () {
            function MockConsole() {
                this.errors = [];
            }
            MockConsole.prototype.error = function () {
                var s = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    s[_i] = arguments[_i];
                }
                this.errors.push(s);
            };
            return MockConsole;
        }());
        var logger;
        var errorHandler;
        beforeEach(testing_1.inject([platform_browser_1.DOCUMENT], function (doc) {
            core_1.destroyPlatform();
            var el = dom_adapter_1.getDOM().createElement(COMP_SELECTOR, doc);
            dom_adapter_1.getDOM().appendChild(doc.body, el);
            logger = new MockConsole();
            errorHandler = new core_1.ErrorHandler();
            errorHandler._console = logger;
        }));
        afterEach(function () { core_1.destroyPlatform(); });
        if (dom_adapter_1.getDOM().supportsDOMEvents()) {
            // This test needs a real DOM....
            it('should keep change detecting if there was an error', function (done) {
                var ErrorComp = /** @class */ (function () {
                    function ErrorComp() {
                        this.value = 0;
                        this.thrownValue = 0;
                    }
                    ErrorComp.prototype.next = function () { this.value++; };
                    ErrorComp.prototype.nextAndThrow = function () {
                        this.value++;
                        this.throwIfNeeded();
                    };
                    ErrorComp.prototype.throwIfNeeded = function () {
                        core_1.NgZone.assertInAngularZone();
                        if (this.thrownValue !== this.value) {
                            this.thrownValue = this.value;
                            throw new Error("Error: " + this.value);
                        }
                    };
                    ErrorComp = __decorate([
                        core_1.Component({
                            selector: COMP_SELECTOR,
                            template: '<button (click)="next()"></button><button (click)="nextAndThrow()"></button><button (dirClick)="nextAndThrow()"></button><span>Value:{{value}}</span><span>{{throwIfNeeded()}}</span>'
                        })
                    ], ErrorComp);
                    return ErrorComp;
                }());
                var EventDir = /** @class */ (function () {
                    function EventDir() {
                        this.dirClick = new core_1.EventEmitter();
                    }
                    EventDir.prototype.onClick = function (event) { this.dirClick.next(event); };
                    __decorate([
                        core_1.Output(),
                        __metadata("design:type", Object)
                    ], EventDir.prototype, "dirClick", void 0);
                    __decorate([
                        core_1.HostListener('click', ['$event']),
                        __metadata("design:type", Function),
                        __metadata("design:paramtypes", [Object]),
                        __metadata("design:returntype", void 0)
                    ], EventDir.prototype, "onClick", null);
                    EventDir = __decorate([
                        core_1.Directive({ selector: '[dirClick]' })
                    ], EventDir);
                    return EventDir;
                }());
                var TestModule = /** @class */ (function () {
                    function TestModule() {
                    }
                    TestModule = __decorate([
                        core_1.NgModule({
                            imports: [platform_browser_1.BrowserModule],
                            declarations: [ErrorComp, EventDir],
                            bootstrap: [ErrorComp],
                            providers: [{ provide: core_1.ErrorHandler, useValue: errorHandler }],
                        })
                    ], TestModule);
                    return TestModule;
                }());
                platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(TestModule).then(function (ref) {
                    core_1.NgZone.assertNotInAngularZone();
                    var appRef = ref.injector.get(core_1.ApplicationRef);
                    var compRef = appRef.components[0];
                    var compEl = compRef.location.nativeElement;
                    var nextBtn = compEl.children[0];
                    var nextAndThrowBtn = compEl.children[1];
                    var nextAndThrowDirBtn = compEl.children[2];
                    nextBtn.click();
                    assertValueAndErrors(compEl, 1, 0);
                    nextBtn.click();
                    assertValueAndErrors(compEl, 2, 2);
                    nextAndThrowBtn.click();
                    assertValueAndErrors(compEl, 3, 4);
                    nextAndThrowBtn.click();
                    assertValueAndErrors(compEl, 4, 6);
                    nextAndThrowDirBtn.click();
                    assertValueAndErrors(compEl, 5, 8);
                    nextAndThrowDirBtn.click();
                    assertValueAndErrors(compEl, 6, 10);
                    // Assert that there were no more errors
                    matchers_1.expect(logger.errors.length).toBe(12);
                    done();
                });
                function assertValueAndErrors(compEl, value, errorIndex) {
                    matchers_1.expect(compEl).toHaveText("Value:" + value);
                    matchers_1.expect(logger.errors[errorIndex][0]).toBe('ERROR');
                    matchers_1.expect(logger.errors[errorIndex][1].message).toBe("Error: " + value);
                    matchers_1.expect(logger.errors[errorIndex + 1][0]).toBe('ERROR CONTEXT');
                }
            });
        }
    });
}
var MyComp1 = /** @class */ (function () {
    function MyComp1(injector) {
        this.injector = injector;
    }
    MyComp1 = __decorate([
        core_1.Component({ selector: 'my-comp', template: '' }),
        __metadata("design:paramtypes", [core_1.Injector])
    ], MyComp1);
    return MyComp1;
}());
var PlatformPipe = /** @class */ (function () {
    function PlatformPipe() {
    }
    PlatformPipe.prototype.transform = function (value) { return 'somePlatformPipe'; };
    PlatformPipe = __decorate([
        core_1.Pipe({ name: 'somePipe', pure: true })
    ], PlatformPipe);
    return PlatformPipe;
}());
var CustomPipe = /** @class */ (function () {
    function CustomPipe() {
    }
    CustomPipe.prototype.transform = function (value) { return 'someCustomPipe'; };
    CustomPipe = __decorate([
        core_1.Pipe({ name: 'somePipe', pure: true })
    ], CustomPipe);
    return CustomPipe;
}());
var CmpWithNgContent = /** @class */ (function () {
    function CmpWithNgContent() {
    }
    CmpWithNgContent = __decorate([
        core_1.Component({ selector: 'cmp-content', template: "<ng-content></ng-content>" })
    ], CmpWithNgContent);
    return CmpWithNgContent;
}());
var MyCountingComp = /** @class */ (function () {
    function MyCountingComp() {
    }
    MyCountingComp_1 = MyCountingComp;
    MyCountingComp.prototype.method = function () {
        MyCountingComp_1.calls++;
        return { value: 'counting method value' };
    };
    MyCountingComp.reset = function () { MyCountingComp_1.calls = 0; };
    var MyCountingComp_1;
    MyCountingComp.calls = 0;
    MyCountingComp = MyCountingComp_1 = __decorate([
        core_1.Component({ selector: 'counting-cmp', template: '' })
    ], MyCountingComp);
    return MyCountingComp;
}());
var CountingPipe = /** @class */ (function () {
    function CountingPipe() {
    }
    CountingPipe_1 = CountingPipe;
    CountingPipe.prototype.transform = function (value) {
        CountingPipe_1.calls++;
        return { value: 'counting pipe value' };
    };
    CountingPipe.reset = function () { CountingPipe_1.calls = 0; };
    var CountingPipe_1;
    CountingPipe.calls = 0;
    CountingPipe = CountingPipe_1 = __decorate([
        core_1.Pipe({ name: 'countingPipe' })
    ], CountingPipe);
    return CountingPipe;
}());
var LeftComp = /** @class */ (function () {
    function LeftComp() {
    }
    LeftComp = __decorate([
        core_1.Component({
            selector: 'left',
            template: "L<right *ngIf=\"false\"></right>",
        })
    ], LeftComp);
    return LeftComp;
}());
var RightComp = /** @class */ (function () {
    function RightComp() {
    }
    RightComp = __decorate([
        core_1.Component({
            selector: 'right',
            template: "R<left *ngIf=\"false\"></left>",
        })
    ], RightComp);
    return RightComp;
}());
var FakeRecursiveComp = /** @class */ (function () {
    function FakeRecursiveComp() {
    }
    FakeRecursiveComp = __decorate([
        core_1.Component({
            selector: 'fakeRecursiveComp',
            template: "[<left *ngIf=\"false\"></left><right *ngIf=\"false\"></right>]",
        })
    ], FakeRecursiveComp);
    return FakeRecursiveComp;
}());
exports.FakeRecursiveComp = FakeRecursiveComp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVncmVzc2lvbl9pbnRlZ3JhdGlvbl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L2xpbmtlci9yZWdyZXNzaW9uX2ludGVncmF0aW9uX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBaVg7QUFDalgsaURBQThFO0FBQzlFLDhEQUFzRTtBQUN0RSw4RUFBeUU7QUFDekUsNkVBQXFFO0FBQ3JFLDJFQUFzRTtBQUV0RTtJQUNFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsY0FBUSxZQUFZLENBQUMsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXpELFFBQVEsQ0FBQyxRQUFRLEVBQUUsY0FBUSxZQUFZLENBQUMsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTdELDBCQUEwQixFQUFFLENBQUM7Q0FDOUI7QUFFRCxzQkFBc0IsRUFBMkI7UUFBMUIsa0JBQU07SUFDM0IsNkNBQTZDO0lBQzdDLFFBQVEsQ0FBQyxhQUFhLEVBQUU7UUFFdEIsVUFBVSxDQUFDLGNBQVEsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQyxFQUFDLFlBQVksRUFBRSxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUvRixRQUFRLENBQUMsZ0JBQWdCLEVBQUU7WUFDekIsVUFBVSxDQUFDLGNBQVEsaUJBQU8sQ0FBQyxpQkFBaUIsQ0FBQyxFQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFbkUsRUFBRSxDQUFDLHVDQUF1QyxFQUFFO2dCQUMxQyxpQkFBTyxDQUFDLHNCQUFzQixDQUFDLEVBQUMsWUFBWSxFQUFFLENB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