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
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var application_ref_1 = require("@angular/core/src/application_ref");
var console_1 = require("@angular/core/src/console");
var testability_1 = require("@angular/core/src/testability/testability");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var platform_browser_1 = require("@angular/platform-browser");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var dom_tokens_1 = require("@angular/platform-browser/src/dom/dom_tokens");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
var NonExistentComp = /** @class */ (function () {
    function NonExistentComp() {
    }
    NonExistentComp = __decorate([
        core_1.Component({ selector: 'non-existent', template: '' })
    ], NonExistentComp);
    return NonExistentComp;
}());
var HelloRootCmp = /** @class */ (function () {
    function HelloRootCmp() {
        this.greeting = 'hello';
    }
    HelloRootCmp = __decorate([
        core_1.Component({ selector: 'hello-app', template: '{{greeting}} world!' }),
        __metadata("design:paramtypes", [])
    ], HelloRootCmp);
    return HelloRootCmp;
}());
var HelloRootCmpContent = /** @class */ (function () {
    function HelloRootCmpContent() {
    }
    HelloRootCmpContent = __decorate([
        core_1.Component({ selector: 'hello-app', template: 'before: <ng-content></ng-content> after: done' }),
        __metadata("design:paramtypes", [])
    ], HelloRootCmpContent);
    return HelloRootCmpContent;
}());
var HelloRootCmp2 = /** @class */ (function () {
    function HelloRootCmp2() {
        this.greeting = 'hello';
    }
    HelloRootCmp2 = __decorate([
        core_1.Component({ selector: 'hello-app-2', template: '{{greeting}} world, again!' }),
        __metadata("design:paramtypes", [])
    ], HelloRootCmp2);
    return HelloRootCmp2;
}());
var HelloRootCmp3 = /** @class */ (function () {
    function HelloRootCmp3(appBinding /** TODO #9100 */) {
        this.appBinding = appBinding;
    }
    HelloRootCmp3 = __decorate([
        core_1.Component({ selector: 'hello-app', template: '' }),
        __param(0, core_1.Inject('appBinding')),
        __metadata("design:paramtypes", [Object])
    ], HelloRootCmp3);
    return HelloRootCmp3;
}());
var HelloRootCmp4 = /** @class */ (function () {
    function HelloRootCmp4(appRef) {
        this.appRef = appRef;
    }
    HelloRootCmp4 = __decorate([
        core_1.Component({ selector: 'hello-app', template: '' }),
        __param(0, core_1.Inject(application_ref_1.ApplicationRef)),
        __metadata("design:paramtypes", [application_ref_1.ApplicationRef])
    ], HelloRootCmp4);
    return HelloRootCmp4;
}());
var HelloRootMissingTemplate = /** @class */ (function () {
    function HelloRootMissingTemplate() {
    }
    HelloRootMissingTemplate = __decorate([
        core_1.Component({ selector: 'hello-app' })
    ], HelloRootMissingTemplate);
    return HelloRootMissingTemplate;
}());
var HelloRootDirectiveIsNotCmp = /** @class */ (function () {
    function HelloRootDirectiveIsNotCmp() {
    }
    HelloRootDirectiveIsNotCmp = __decorate([
        core_1.Directive({ selector: 'hello-app' })
    ], HelloRootDirectiveIsNotCmp);
    return HelloRootDirectiveIsNotCmp;
}());
var HelloOnDestroyTickCmp = /** @class */ (function () {
    function HelloOnDestroyTickCmp(appRef) {
        this.appRef = appRef;
    }
    HelloOnDestroyTickCmp.prototype.ngOnDestroy = function () { this.appRef.tick(); };
    HelloOnDestroyTickCmp = __decorate([
        core_1.Component({ selector: 'hello-app', template: '' }),
        __param(0, core_1.Inject(application_ref_1.ApplicationRef)),
        __metadata("design:paramtypes", [application_ref_1.ApplicationRef])
    ], HelloOnDestroyTickCmp);
    return HelloOnDestroyTickCmp;
}());
var HelloUrlCmp = /** @class */ (function () {
    function HelloUrlCmp() {
        this.greeting = 'hello';
    }
    HelloUrlCmp = __decorate([
        core_1.Component({ selector: 'hello-app', templateUrl: './sometemplate.html' })
    ], HelloUrlCmp);
    return HelloUrlCmp;
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
var HelloCmpUsingPlatformDirectiveAndPipe = /** @class */ (function () {
    function HelloCmpUsingPlatformDirectiveAndPipe() {
        this.show = false;
    }
    HelloCmpUsingPlatformDirectiveAndPipe = __decorate([
        core_1.Component({ selector: 'hello-app', template: "<div  [someDir]=\"'someValue' | somePipe\"></div>" })
    ], HelloCmpUsingPlatformDirectiveAndPipe);
    return HelloCmpUsingPlatformDirectiveAndPipe;
}());
var HelloCmpUsingCustomElement = /** @class */ (function () {
    function HelloCmpUsingCustomElement() {
    }
    HelloCmpUsingCustomElement = __decorate([
        core_1.Component({ selector: 'hello-app', template: '<some-el [someProp]="true">hello world!</some-el>' })
    ], HelloCmpUsingCustomElement);
    return HelloCmpUsingCustomElement;
}());
var MockConsole = /** @class */ (function () {
    function MockConsole() {
        this.res = [];
    }
    MockConsole.prototype.error = function () {
        var s = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            s[_i] = arguments[_i];
        }
        this.res.push(s);
    };
    return MockConsole;
}());
var DummyConsole = /** @class */ (function () {
    function DummyConsole() {
        this.warnings = [];
    }
    DummyConsole.prototype.log = function (message) { };
    DummyConsole.prototype.warn = function (message) { this.warnings.push(message); };
    return DummyConsole;
}());
var TestModule = /** @class */ (function () {
    function TestModule() {
    }
    return TestModule;
}());
function bootstrap(cmpType, providers, platformProviders, imports) {
    if (providers === void 0) { providers = []; }
    if (platformProviders === void 0) { platformProviders = []; }
    if (imports === void 0) { imports = []; }
    var TestModule = /** @class */ (function () {
        function TestModule() {
        }
        TestModule = __decorate([
            core_1.NgModule({
                imports: [platform_browser_1.BrowserModule].concat(imports),
                declarations: [cmpType],
                bootstrap: [cmpType],
                providers: providers,
                schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA]
            })
        ], TestModule);
        return TestModule;
    }());
    return platform_browser_dynamic_1.platformBrowserDynamic(platformProviders).bootstrapModule(TestModule);
}
{
    var el_1 /** TODO #9100 */, el2_1 /** TODO #9100 */, testProviders_1, lightDom_1 /** TODO #9100 */;
    testing_internal_1.describe('bootstrap factory method', function () {
        if (isNode)
            return;
        var compilerConsole;
        testing_internal_1.beforeEachProviders(function () { return [testing_internal_1.Log]; });
        testing_internal_1.beforeEach(testing_internal_1.inject([dom_tokens_1.DOCUMENT], function (doc) {
            application_ref_1.destroyPlatform();
            compilerConsole = new DummyConsole();
            testProviders_1 = [{ provide: console_1.Console, useValue: compilerConsole }];
            var oldRoots = dom_adapter_1.getDOM().querySelectorAll(doc, 'hello-app,hello-app-2,light-dom-el');
            for (var i = 0; i < oldRoots.length; i++) {
                dom_adapter_1.getDOM().remove(oldRoots[i]);
            }
            el_1 = dom_adapter_1.getDOM().createElement('hello-app', doc);
            el2_1 = dom_adapter_1.getDOM().createElement('hello-app-2', doc);
            lightDom_1 = dom_adapter_1.getDOM().createElement('light-dom-el', doc);
            dom_adapter_1.getDOM().appendChild(doc.body, el_1);
            dom_adapter_1.getDOM().appendChild(doc.body, el2_1);
            dom_adapter_1.getDOM().appendChild(el_1, lightDom_1);
            dom_adapter_1.getDOM().setText(lightDom_1, 'loading');
        }));
        testing_internal_1.afterEach(application_ref_1.destroyPlatform);
        testing_internal_1.it('should throw if bootstrapped Directive is not a Component', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (done) {
            var logger = new MockConsole();
            var errorHandler = new core_1.ErrorHandler();
            errorHandler._console = logger;
            matchers_1.expect(function () { return bootstrap(HelloRootDirectiveIsNotCmp, [{ provide: core_1.ErrorHandler, useValue: errorHandler }]); })
                .toThrowError("HelloRootDirectiveIsNotCmp cannot be used as an entry component.");
            done.done();
        }));
        testing_internal_1.it('should throw if no element is found', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var logger = new MockConsole();
            var errorHandler = new core_1.ErrorHandler();
            errorHandler._console = logger;
            bootstrap(NonExistentComp, [
                { provide: core_1.ErrorHandler, useValue: errorHandler }
            ]).then(null, function (reason) {
                matchers_1.expect(reason.message)
                    .toContain('The selector "non-existent" did not match any elements');
                async.done();
                return null;
            });
        }));
        testing_internal_1.it('should throw if no provider', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var logger = new MockConsole();
            var errorHandler = new core_1.ErrorHandler();
            errorHandler._console = logger;
            var IDontExist = /** @class */ (function () {
                function IDontExist() {
                }
                return IDontExist;
            }());
            var CustomCmp = /** @class */ (function () {
                function CustomCmp(iDontExist) {
                }
                CustomCmp = __decorate([
                    core_1.Component({ selector: 'cmp', template: 'Cmp' }),
                    __metadata("design:paramtypes", [IDontExist])
                ], CustomCmp);
                return CustomCmp;
            }());
            var RootCmp = /** @class */ (function () {
                function RootCmp() {
                }
                RootCmp = __decorate([
                    core_1.Component({
                        selector: 'hello-app',
                        template: '<cmp></cmp>',
                    })
                ], RootCmp);
                return RootCmp;
            }());
            var CustomModule = /** @class */ (function () {
                function CustomModule() {
                }
                CustomModule = __decorate([
                    core_1.NgModule({ declarations: [CustomCmp], exports: [CustomCmp] })
                ], CustomModule);
                return CustomModule;
            }());
            bootstrap(RootCmp, [{ provide: core_1.ErrorHandler, useValue: errorHandler }], [], [
                CustomModule
            ]).then(null, function (e) {
                matchers_1.expect(e.message).toContain('StaticInjectorError(TestModule)[CustomCmp -> IDontExist]: \n' +
                    '  StaticInjectorError(Platform: core)[CustomCmp -> IDontExist]: \n' +
                    '    NullInjectorError: No provider for IDontExist!');
                async.done();
                return null;
            });
        }));
        if (dom_adapter_1.getDOM().supportsDOMEvents()) {
            testing_internal_1.it('should forward the error to promise when bootstrap fails', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var logger = new MockConsole();
                var errorHandler = new core_1.ErrorHandler();
                errorHandler._console = logger;
                var refPromise = bootstrap(NonExistentComp, [{ provide: core_1.ErrorHandler, useValue: errorHandler }]);
                refPromise.then(null, function (reason) {
                    matchers_1.expect(reason.message)
                        .toContain('The selector "non-existent" did not match any elements');
                    async.done();
                });
            }));
            testing_internal_1.it('should invoke the default exception handler when bootstrap fails', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var logger = new MockConsole();
                var errorHandler = new core_1.ErrorHandler();
                errorHandler._console = logger;
                var refPromise = bootstrap(NonExistentComp, [{ provide: core_1.ErrorHandler, useValue: errorHandler }]);
                refPromise.then(null, function (reason) {
                    matchers_1.expect(logger.res[0].join('#'))
                        .toContain('ERROR#Error: The selector "non-existent" did not match any elements');
                    async.done();
                    return null;
                });
            }));
        }
        testing_internal_1.it('should create an injector promise', function () {
            var refPromise = bootstrap(HelloRootCmp, testProviders_1);
            matchers_1.expect(refPromise).toEqual(jasmine.any(Promise));
        });
        testing_internal_1.it('should set platform name to browser', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var refPromise = bootstrap(HelloRootCmp, testProviders_1);
            refPromise.then(function (ref) {
                matchers_1.expect(common_1.isPlatformBrowser(ref.injector.get(core_1.PLATFORM_ID))).toBe(true);
                async.done();
            });
        }));
        testing_internal_1.it('should display hello world', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var refPromise = bootstrap(HelloRootCmp, testProviders_1);
            refPromise.then(function (ref) {
                matchers_1.expect(el_1).toHaveText('hello world!');
                matchers_1.expect(el_1.getAttribute('ng-version')).toEqual(core_1.VERSION.full);
                async.done();
            });
        }));
        testing_internal_1.it('should throw a descriptive error if BrowserModule is installed again via a lazily loaded module', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var AsyncModule = /** @class */ (function () {
                function AsyncModule() {
                }
                AsyncModule = __decorate([
                    core_1.NgModule({ imports: [platform_browser_1.BrowserModule] })
                ], AsyncModule);
                return AsyncModule;
            }());
            bootstrap(HelloRootCmp, testProviders_1)
                .then(function (ref) {
                var compiler = ref.injector.get(core_1.Compiler);
                return compiler.compileModuleAsync(AsyncModule).then(function (factory) {
                    matchers_1.expect(function () { return factory.create(ref.injector); })
                        .toThrowError("BrowserModule has already been loaded. If you need access to common directives such as NgIf and NgFor from a lazy loaded module, import CommonModule instead.");
                });
            })
                .then(function () { return async.done(); }, function (err) { return async.fail(err); });
        }));
        testing_internal_1.it('should support multiple calls to bootstrap', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var refPromise1 = bootstrap(HelloRootCmp, testProviders_1);
            var refPromise2 = bootstrap(HelloRootCmp2, testProviders_1);
            Promise.all([refPromise1, refPromise2]).then(function (refs) {
                matchers_1.expect(el_1).toHaveText('hello world!');
                matchers_1.expect(el2_1).toHaveText('hello world, again!');
                async.done();
            });
        }));
        testing_internal_1.it('should not crash if change detection is invoked when the root component is disposed', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            bootstrap(HelloOnDestroyTickCmp, testProviders_1).then(function (ref) {
                matchers_1.expect(function () { return ref.destroy(); }).not.toThrow();
                async.done();
            });
        }));
        testing_internal_1.it('should unregister change detectors when components are disposed', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            bootstrap(HelloRootCmp, testProviders_1).then(function (ref) {
                var appRef = ref.injector.get(application_ref_1.ApplicationRef);
                ref.destroy();
                matchers_1.expect(function () { return appRef.tick(); }).not.toThrow();
                async.done();
            });
        }));
        testing_internal_1.it('should make the provided bindings available to the application component', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var refPromise = bootstrap(HelloRootCmp3, [testProviders_1, { provide: 'appBinding', useValue: 'BoundValue' }]);
            refPromise.then(function (ref) {
                matchers_1.expect(ref.injector.get('appBinding')).toEqual('BoundValue');
                async.done();
            });
        }));
        testing_internal_1.it('should not override locale provided during bootstrap', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var refPromise = bootstrap(HelloRootCmp, [testProviders_1], [{ provide: core_1.LOCALE_ID, useValue: 'fr-FR' }]);
            refPromise.then(function (ref) {
                matchers_1.expect(ref.injector.get(core_1.LOCALE_ID)).toEqual('fr-FR');
                async.done();
            });
        }));
        testing_internal_1.it('should avoid cyclic dependencies when root component requires Lifecycle through DI', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var refPromise = bootstrap(HelloRootCmp4, testProviders_1);
            refPromise.then(function (ref) {
                var appRef = ref.injector.get(application_ref_1.ApplicationRef);
                matchers_1.expect(appRef).toBeDefined();
                async.done();
            });
        }));
        testing_internal_1.it('should run platform initializers', testing_internal_1.inject([testing_internal_1.Log, testing_internal_1.AsyncTestCompleter], function (log, async) {
            var p = core_1.createPlatformFactory(platform_browser_dynamic_1.platformBrowserDynamic, 'someName', [
                { provide: core_1.PLATFORM_INITIALIZER, useValue: log.fn('platform_init1'), multi: true },
                { provide: core_1.PLATFORM_INITIALIZER, useValue: log.fn('platform_init2'), multi: true }
            ])();
            var SomeModule = /** @class */ (function () {
                function SomeModule() {
                }
                SomeModule.prototype.ngDoBootstrap = function () { };
                SomeModule = __decorate([
                    core_1.NgModule({
                        imports: [platform_browser_1.BrowserModule],
                        providers: [
                            { provide: core_1.APP_INITIALIZER, useValue: log.fn('app_init1'), multi: true },
                            { provide: core_1.APP_INITIALIZER, useValue: log.fn('app_init2'), multi: true }
                        ]
                    })
                ], SomeModule);
                return SomeModule;
            }());
            matchers_1.expect(log.result()).toEqual('platform_init1; platform_init2');
            log.clear();
            p.bootstrapModule(SomeModule).then(function () {
                matchers_1.expect(log.result()).toEqual('app_init1; app_init2');
                async.done();
            });
        }));
        testing_internal_1.it('should remove styles when transitioning from a server render', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var RootCmp = /** @class */ (function () {
                function RootCmp() {
                }
                RootCmp = __decorate([
                    core_1.Component({
                        selector: 'root',
                        template: 'root',
                    })
                ], RootCmp);
                return RootCmp;
            }());
            var TestModule = /** @class */ (function () {
                function TestModule() {
                }
                TestModule = __decorate([
                    core_1.NgModule({
                        bootstrap: [RootCmp],
                        declarations: [RootCmp],
                        imports: [platform_browser_1.BrowserModule.withServerTransition({ appId: 'my-app' })],
                    })
                ], TestModule);
                return TestModule;
            }());
            // First, set up styles to be removed.
            var dom = dom_adapter_1.getDOM();
            var platform = platform_browser_dynamic_1.platformBrowserDynamic();
            var document = platform.injector.get(dom_tokens_1.DOCUMENT);
            var style = dom.createElement('style', document);
            dom.setAttribute(style, 'ng-transition', 'my-app');
            dom.appendChild(document.head, style);
            var root = dom.createElement('root', document);
            dom.appendChild(document.body, root);
            platform.bootstrapModule(TestModule).then(function () {
                var styles = Array.prototype.slice.apply(dom.getElementsByTagName(document, 'style') || []);
                styles.forEach(function (style) { matchers_1.expect(dom.getAttribute(style, 'ng-transition')).not.toBe('my-app'); });
                async.done();
            });
        }));
        testing_internal_1.it('should register each application with the testability registry', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var refPromise1 = bootstrap(HelloRootCmp, testProviders_1);
            var refPromise2 = bootstrap(HelloRootCmp2, testProviders_1);
            Promise.all([refPromise1, refPromise2]).then(function (refs) {
                var registry = refs[0].injector.get(testability_1.TestabilityRegistry);
                var testabilities = [refs[0].injector.get(testability_1.Testability), refs[1].injector.get(testability_1.Testability)];
                Promise.all(testabilities).then(function (testabilities) {
                    matchers_1.expect(registry.findTestabilityInTree(el_1)).toEqual(testabilities[0]);
                    matchers_1.expect(registry.findTestabilityInTree(el2_1)).toEqual(testabilities[1]);
                    async.done();
                });
            });
        }));
        testing_internal_1.it('should allow to pass schemas', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            bootstrap(HelloCmpUsingCustomElement, testProviders_1).then(function (compRef) {
                matchers_1.expect(el_1).toHaveText('hello world!');
                async.done();
            });
        }));
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vdHN0cmFwX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyL3Rlc3QvYnJvd3Nlci9ib290c3RyYXBfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7OztBQUVILDBDQUFrRDtBQUNsRCxzQ0FBNFE7QUFDNVEscUVBQWtGO0FBQ2xGLHFEQUFrRDtBQUVsRCx5RUFBMkY7QUFDM0YsK0VBQTBKO0FBQzFKLDhEQUF3RDtBQUN4RCw4RUFBeUU7QUFDekUsNkVBQXFFO0FBQ3JFLDJFQUFzRTtBQUN0RSwyRUFBc0U7QUFHdEU7SUFBQTtJQUNBLENBQUM7SUFESyxlQUFlO1FBRHBCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUMsQ0FBQztPQUM5QyxlQUFlLENBQ3BCO0lBQUQsc0JBQUM7Q0FBQSxBQURELElBQ0M7QUFHRDtJQUVFO1FBQWdCLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO0lBQUMsQ0FBQztJQUZ0QyxZQUFZO1FBRGpCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxxQkFBcUIsRUFBQyxDQUFDOztPQUM5RCxZQUFZLENBR2pCO0lBQUQsbUJBQUM7Q0FBQSxBQUhELElBR0M7QUFHRDtJQUNFO0lBQWUsQ0FBQztJQURaLG1CQUFtQjtRQUR4QixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsK0NBQStDLEVBQUMsQ0FBQzs7T0FDeEYsbUJBQW1CLENBRXhCO0lBQUQsMEJBQUM7Q0FBQSxBQUZELElBRUM7QUFHRDtJQUVFO1FBQWdCLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO0lBQUMsQ0FBQztJQUZ0QyxhQUFhO1FBRGxCLGdCQUFTLENBQUMsRUFBQyxRQUFR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