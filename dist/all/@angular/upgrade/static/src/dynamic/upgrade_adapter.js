"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var angular = require("../common/angular1");
var constants_1 = require("../common/constants");
var downgrade_component_1 = require("../common/downgrade_component");
var downgrade_injectable_1 = require("../common/downgrade_injectable");
var util_1 = require("../common/util");
var upgrade_ng1_adapter_1 = require("./upgrade_ng1_adapter");
var upgradeCount = 0;
/**
 * Use `UpgradeAdapter` to allow AngularJS and Angular to coexist in a single application.
 *
 * The `UpgradeAdapter` allows:
 * 1. creation of Angular component from AngularJS component directive
 *    (See [UpgradeAdapter#upgradeNg1Component()])
 * 2. creation of AngularJS directive from Angular component.
 *    (See [UpgradeAdapter#downgradeNg2Component()])
 * 3. Bootstrapping of a hybrid Angular application which contains both of the frameworks
 *    coexisting in a single application.
 *
 * @usageNotes
 * ### Mental Model
 *
 * When reasoning about how a hybrid application works it is useful to have a mental model which
 * describes what is happening and explains what is happening at the lowest level.
 *
 * 1. There are two independent frameworks running in a single application, each framework treats
 *    the other as a black box.
 * 2. Each DOM element on the page is owned exactly by one framework. Whichever framework
 *    instantiated the element is the owner. Each framework only updates/interacts with its own
 *    DOM elements and ignores others.
 * 3. AngularJS directives always execute inside AngularJS framework codebase regardless of
 *    where they are instantiated.
 * 4. Angular components always execute inside Angular framework codebase regardless of
 *    where they are instantiated.
 * 5. An AngularJS component can be upgraded to an Angular component. This creates an
 *    Angular directive, which bootstraps the AngularJS component directive in that location.
 * 6. An Angular component can be downgraded to an AngularJS component directive. This creates
 *    an AngularJS directive, which bootstraps the Angular component in that location.
 * 7. Whenever an adapter component is instantiated the host element is owned by the framework
 *    doing the instantiation. The other framework then instantiates and owns the view for that
 *    component. This implies that component bindings will always follow the semantics of the
 *    instantiation framework. The syntax is always that of Angular syntax.
 * 8. AngularJS is always bootstrapped first and owns the bottom most view.
 * 9. The new application is running in Angular zone, and therefore it no longer needs calls to
 *    `$apply()`.
 *
 * ### Example
 *
 * ```
 * const adapter = new UpgradeAdapter(forwardRef(() => MyNg2Module), myCompilerOptions);
 * const module = angular.module('myExample', []);
 * module.directive('ng2Comp', adapter.downgradeNg2Component(Ng2Component));
 *
 * module.directive('ng1Hello', function() {
 *   return {
 *      scope: { title: '=' },
 *      template: 'ng1[Hello {{title}}!](<span ng-transclude></span>)'
 *   };
 * });
 *
 *
 * @Component({
 *   selector: 'ng2-comp',
 *   inputs: ['name'],
 *   template: 'ng2[<ng1-hello [title]="name">transclude</ng1-hello>](<ng-content></ng-content>)',
 *   directives:
 * })
 * class Ng2Component {
 * }
 *
 * @NgModule({
 *   declarations: [Ng2Component, adapter.upgradeNg1Component('ng1Hello')],
 *   imports: [BrowserModule]
 * })
 * class MyNg2Module {}
 *
 *
 * document.body.innerHTML = '<ng2-comp name="World">project</ng2-comp>';
 *
 * adapter.bootstrap(document.body, ['myExample']).ready(function() {
 *   expect(document.body.textContent).toEqual(
 *       "ng2[ng1[Hello World!](transclude)](project)");
 * });
 *
 * ```
 *
 * @deprecated Deprecated since v5. Use `upgrade/static` instead, which also supports
 * [Ahead-of-Time compilation](guide/aot-compiler).
 */
var UpgradeAdapter = /** @class */ (function () {
    function UpgradeAdapter(ng2AppModule, compilerOptions) {
        this.ng2AppModule = ng2AppModule;
        this.compilerOptions = compilerOptions;
        this.idPrefix = "NG2_UPGRADE_" + upgradeCount++ + "_";
        this.downgradedComponents = [];
        /**
         * An internal map of ng1 components which need to up upgraded to ng2.
         *
         * We can't upgrade until injector is instantiated and we can retrieve the component metadata.
         * For this reason we keep a list of components to upgrade until ng1 injector is bootstrapped.
         *
         * @internal
         */
        this.ng1ComponentsToBeUpgraded = {};
        this.upgradedProviders = [];
        this.moduleRef = null;
        if (!ng2AppModule) {
            throw new Error('UpgradeAdapter cannot be instantiated without an NgModule of the Angular app.');
        }
    }
    /**
     * Allows Angular Component to be used from AngularJS.
     *
     * Use `downgradeNg2Component` to create an AngularJS Directive Definition Factory from
     * Angular Component. The adapter will bootstrap Angular component from within the
     * AngularJS template.
     *
     * @usageNotes
     * ### Mental Model
     *
     * 1. The component is instantiated by being listed in AngularJS template. This means that the
     *    host element is controlled by AngularJS, but the component's view will be controlled by
     *    Angular.
     * 2. Even thought the component is instantiated in AngularJS, it will be using Angular
     *    syntax. This has to be done, this way because we must follow Angular components do not
     *    declare how the attributes should be interpreted.
     * 3. `ng-model` is controlled by AngularJS and communicates with the downgraded Angular component
     *    by way of the `ControlValueAccessor` interface from @angular/forms. Only components that
     *    implement this interface are eligible.
     *
     * ### Supported Features
     *
     * - Bindings:
     *   - Attribute: `<comp name="World">`
     *   - Interpolation:  `<comp greeting="Hello {{name}}!">`
     *   - Expression:  `<comp [name]="username">`
     *   - Event:  `<comp (close)="doSomething()">`
     *   - ng-model: `<comp ng-model="name">`
     * - Content projection: yes
     *
     * ### Example
     *
     * ```
     * const adapter = new UpgradeAdapter(forwardRef(() => MyNg2Module));
     * const module = angular.module('myExample', []);
     * module.directive('greet', adapter.downgradeNg2Component(Greeter));
     *
     * @Component({
     *   selector: 'greet',
     *   template: '{{salutation}} {{name}}! - <ng-content></ng-content>'
     * })
     * class Greeter {
     *   @Input() salutation: string;
     *   @Input() name: string;
     * }
     *
     * @NgModule({
     *   declarations: [Greeter],
     *   imports: [BrowserModule]
     * })
     * class MyNg2Module {}
     *
     * document.body.innerHTML =
     *   'ng1 template: <greet salutation="Hello" [name]="world">text</greet>';
     *
     * adapter.bootstrap(document.body, ['myExample']).ready(function() {
     *   expect(document.body.textContent).toEqual("ng1 template: Hello world! - text");
     * });
     * ```
     */
    UpgradeAdapter.prototype.downgradeNg2Component = function (component) {
        this.downgradedComponents.push(component);
        return downgrade_component_1.downgradeComponent({ component: component });
    };
    /**
     * Allows AngularJS Component to be used from Angular.
     *
     * Use `upgradeNg1Component` to create an Angular component from AngularJS Component
     * directive. The adapter will bootstrap AngularJS component from within the Angular
     * template.
     *
     * @usageNotes
     * ### Mental Model
     *
     * 1. The component is instantiated by being listed in Angular template. This means that the
     *    host element is controlled by Angular, but the component's view will be controlled by
     *    AngularJS.
     *
     * ### Supported Features
     *
     * - Bindings:
     *   - Attribute: `<comp name="World">`
     *   - Interpolation:  `<comp greeting="Hello {{name}}!">`
     *   - Expression:  `<comp [name]="username">`
     *   - Event:  `<comp (close)="doSomething()">`
     * - Transclusion: yes
     * - Only some of the features of
     *   [Directive Definition Object](https://docs.angularjs.org/api/ng/service/$compile) are
     *   supported:
     *   - `compile`: not supported because the host element is owned by Angular, which does
     *     not allow modifying DOM structure during compilation.
     *   - `controller`: supported. (NOTE: injection of `$attrs` and `$transclude` is not supported.)
     *   - `controllerAs`: supported.
     *   - `bindToController`: supported.
     *   - `link`: supported. (NOTE: only pre-link function is supported.)
     *   - `name`: supported.
     *   - `priority`: ignored.
     *   - `replace`: not supported.
     *   - `require`: supported.
     *   - `restrict`: must be set to 'E'.
     *   - `scope`: supported.
     *   - `template`: supported.
     *   - `templateUrl`: supported.
     *   - `terminal`: ignored.
     *   - `transclude`: supported.
     *
     *
     * ### Example
     *
     * ```
     * const adapter = new UpgradeAdapter(forwardRef(() => MyNg2Module));
     * const module = angular.module('myExample', []);
     *
     * module.directive('greet', function() {
     *   return {
     *     scope: {salutation: '=', name: '=' },
     *     template: '{{salutation}} {{name}}! - <span ng-transclude></span>'
     *   };
     * });
     *
     * module.directive('ng2', adapter.downgradeNg2Component(Ng2Component));
     *
     * @Component({
     *   selector: 'ng2',
     *   template: 'ng2 template: <greet salutation="Hello" [name]="world">text</greet>'
     * })
     * class Ng2Component {
     * }
     *
     * @NgModule({
     *   declarations: [Ng2Component, adapter.upgradeNg1Component('greet')],
     *   imports: [BrowserModule]
     * })
     * class MyNg2Module {}
     *
     * document.body.innerHTML = '<ng2></ng2>';
     *
     * adapter.bootstrap(document.body, ['myExample']).ready(function() {
     *   expect(document.body.textContent).toEqual("ng2 template: Hello world! - text");
     * });
     * ```
     */
    UpgradeAdapter.prototype.upgradeNg1Component = function (name) {
        if (this.ng1ComponentsToBeUpgraded.hasOwnProperty(name)) {
            return this.ng1ComponentsToBeUpgraded[name].type;
        }
        else {
            return (this.ng1ComponentsToBeUpgraded[name] = new upgrade_ng1_adapter_1.UpgradeNg1ComponentAdapterBuilder(name))
                .type;
        }
    };
    /**
     * Registers the adapter's AngularJS upgrade module for unit testing in AngularJS.
     * Use this instead of `angular.mock.module()` to load the upgrade module into
     * the AngularJS testing injector.
     *
     * @usageNotes
     * ### Example
     *
     * ```
     * const upgradeAdapter = new UpgradeAdapter(MyNg2Module);
     *
     * // configure the adapter with upgrade/downgrade components and services
     * upgradeAdapter.downgradeNg2Component(MyComponent);
     *
     * let upgradeAdapterRef: UpgradeAdapterRef;
     * let $compile, $rootScope;
     *
     * // We must register the adapter before any calls to `inject()`
     * beforeEach(() => {
     *   upgradeAdapterRef = upgradeAdapter.registerForNg1Tests(['heroApp']);
     * });
     *
     * beforeEach(inject((_$compile_, _$rootScope_) => {
     *   $compile = _$compile_;
     *   $rootScope = _$rootScope_;
     * }));
     *
     * it("says hello", (done) => {
     *   upgradeAdapterRef.ready(() => {
     *     const element = $compile("<my-component></my-component>")($rootScope);
     *     $rootScope.$apply();
     *     expect(element.html()).toContain("Hello World");
     *     done();
     *   })
     * });
     *
     * ```
     *
     * @param modules any AngularJS modules that the upgrade module should depend upon
     * @returns an `UpgradeAdapterRef`, which lets you register a `ready()` callback to
     * run assertions once the Angular components are ready to test through AngularJS.
     */
    UpgradeAdapter.prototype.registerForNg1Tests = function (modules) {
        var _this = this;
        var windowNgMock = window['angular'].mock;
        if (!windowNgMock || !windowNgMock.module) {
            throw new Error('Failed to find \'angular.mock.module\'.');
        }
        this.declareNg1Module(modules);
        windowNgMock.module(this.ng1Module.name);
        var upgrade = new UpgradeAdapterRef();
        this.ng2BootstrapDeferred.promise.then(function (ng1Injector) { upgrade._bootstrapDone(_this.moduleRef, ng1Injector); }, util_1.onError);
        return upgrade;
    };
    /**
     * Bootstrap a hybrid AngularJS / Angular application.
     *
     * This `bootstrap` method is a direct replacement (takes same arguments) for AngularJS
     * [`bootstrap`](https://docs.angularjs.org/api/ng/function/angular.bootstrap) method. Unlike
     * AngularJS, this bootstrap is asynchronous.
     *
     * @usageNotes
     * ### Example
     *
     * ```
     * const adapter = new UpgradeAdapter(MyNg2Module);
     * const module = angular.module('myExample', []);
     * module.directive('ng2', adapter.downgradeNg2Component(Ng2));
     *
     * module.directive('ng1', function() {
     *   return {
     *      scope: { title: '=' },
     *      template: 'ng1[Hello {{title}}!](<span ng-transclude></span>)'
     *   };
     * });
     *
     *
     * @Component({
     *   selector: 'ng2',
     *   inputs: ['name'],
     *   template: 'ng2[<ng1 [title]="name">transclude</ng1>](<ng-content></ng-content>)'
     * })
     * class Ng2 {
     * }
     *
     * @NgModule({
     *   declarations: [Ng2, adapter.upgradeNg1Component('ng1')],
     *   imports: [BrowserModule]
     * })
     * class MyNg2Module {}
     *
     * document.body.innerHTML = '<ng2 name="World">project</ng2>';
     *
     * adapter.bootstrap(document.body, ['myExample']).ready(function() {
     *   expect(document.body.textContent).toEqual(
     *       "ng2[ng1[Hello World!](transclude)](project)");
     * });
     * ```
     */
    UpgradeAdapter.prototype.bootstrap = function (element, modules, config) {
        var _this = this;
        this.declareNg1Module(modules);
        var upgrade = new UpgradeAdapterRef();
        // Make sure resumeBootstrap() only exists if the current bootstrap is deferred
        var windowAngular = window /** TODO #???? */['angular'];
        windowAngular.resumeBootstrap = undefined;
        this.ngZone.run(function () { angular.bootstrap(element, [_this.ng1Module.name], config); });
        var ng1BootstrapPromise = new Promise(function (resolve) {
            if (windowAngular.resumeBootstrap) {
                var originalResumeBootstrap_1 = windowAngular.resumeBootstrap;
                windowAngular.resumeBootstrap = function () {
                    windowAngular.resumeBootstrap = originalResumeBootstrap_1;
                    var r = windowAngular.resumeBootstrap.apply(this, arguments);
                    resolve();
                    return r;
                };
            }
            else {
                resolve();
            }
        });
        Promise.all([this.ng2BootstrapDeferred.promise, ng1BootstrapPromise]).then(function (_a) {
            var ng1Injector = _a[0];
            angular.element(element).data(util_1.controllerKey(constants_1.INJECTOR_KEY), _this.moduleRef.injector);
            _this.moduleRef.injector.get(core_1.NgZone).run(function () { upgrade._bootstrapDone(_this.moduleRef, ng1Injector); });
        }, util_1.onError);
        return upgrade;
    };
    /**
     * Allows AngularJS service to be accessible from Angular.
     *
     * @usageNotes
     * ### Example
     *
     * ```
     * class Login { ... }
     * class Server { ... }
     *
     * @Injectable()
     * class Example {
     *   constructor(@Inject('server') server, login: Login) {
     *     ...
     *   }
     * }
     *
     * const module = angular.module('myExample', []);
     * module.service('server', Server);
     * module.service('login', Login);
     *
     * const adapter = new UpgradeAdapter(MyNg2Module);
     * adapter.upgradeNg1Provider('server');
     * adapter.upgradeNg1Provider('login', {asToken: Login});
     *
     * adapter.bootstrap(document.body, ['myExample']).ready((ref) => {
     *   const example: Example = ref.ng2Injector.get(Example);
     * });
     *
     * ```
     */
    UpgradeAdapter.prototype.upgradeNg1Provider = function (name, options) {
        var token = options && options.asToken || name;
        this.upgradedProviders.push({
            provide: token,
            useFactory: function ($injector) { return $injector.get(name); },
            deps: [constants_1.$INJECTOR]
        });
    };
    /**
     * Allows Angular service to be accessible from AngularJS.
     *
     * @usageNotes
     * ### Example
     *
     * ```
     * class Example {
     * }
     *
     * const adapter = new UpgradeAdapter(MyNg2Module);
     *
     * const module = angular.module('myExample', []);
     * module.factory('example', adapter.downgradeNg2Provider(Example));
     *
     * adapter.bootstrap(document.body, ['myExample']).ready((ref) => {
     *   const example: Example = ref.ng1Injector.get('example');
     * });
     *
     * ```
     */
    UpgradeAdapter.prototype.downgradeNg2Provider = function (token) { return downgrade_injectable_1.downgradeInjectable(token); };
    /**
     * Declare the AngularJS upgrade module for this adapter without bootstrapping the whole
     * hybrid application.
     *
     * This method is automatically called by `bootstrap()` and `registerForNg1Tests()`.
     *
     * @param modules The AngularJS modules that this upgrade module should depend upon.
     * @returns The AngularJS upgrade module that is declared by this method
     *
     * @usageNotes
     * ### Example
     *
     * ```
     * const upgradeAdapter = new UpgradeAdapter(MyNg2Module);
     * upgradeAdapter.declareNg1Module(['heroApp']);
     * ```
     */
    UpgradeAdapter.prototype.declareNg1Module = function (modules) {
        var _this = this;
        if (modules === void 0) { modules = []; }
        var delayApplyExps = [];
        var original$applyFn;
        var rootScopePrototype;
        var rootScope;
        var upgradeAdapter = this;
        var ng1Module = this.ng1Module = angular.module(this.idPrefix, modules);
        var platformRef = platform_browser_dynamic_1.platformBrowserDynamic();
        this.ngZone = new core_1.NgZone({ enableLongStackTrace: Zone.hasOwnProperty('longStackTraceZoneSpec') });
        this.ng2BootstrapDeferred = new util_1.Deferred();
        ng1Module.factory(constants_1.INJECTOR_KEY, function () { return _this.moduleRef.injector.get(core_1.Injector); })
            .factory(constants_1.LAZY_MODULE_REF, [
            constants_1.INJECTOR_KEY,
            function (injector) { return ({ injector: injector, needsNgZone: false }); }
        ])
            .constant(constants_1.NG_ZONE_KEY, this.ngZone)
            .factory(constants_1.COMPILER_KEY, function () { return _this.moduleRef.injector.get(core_1.Compiler); })
            .config([
            '$provide', '$injector',
            function (provide, ng1Injector) {
                provide.decorator(constants_1.$ROOT_SCOPE, [
                    '$delegate',
                    function (rootScopeDelegate) {
                        // Capture the root apply so that we can delay first call to $apply until we
                        // bootstrap Angular and then we replay and restore the $apply.
                        rootScopePrototype = rootScopeDelegate.constructor.prototype;
                        if (rootScopePrototype.hasOwnProperty('$apply')) {
                            original$applyFn = rootScopePrototype.$apply;
                            rootScopePrototype.$apply = function (exp) { return delayApplyExps.push(exp); };
                        }
                        else {
                            throw new Error('Failed to find \'$apply\' on \'$rootScope\'!');
                        }
                        return rootScope = rootScopeDelegate;
                    }
                ]);
                if (ng1Injector.has(constants_1.$$TESTABILITY)) {
                    provide.decorator(constants_1.$$TESTABILITY, [
                        '$delegate',
                        function (testabilityDelegate) {
                            var originalWhenStable = testabilityDelegate.whenStable;
                            // Cannot use arrow function below because we need the context
                            var newWhenStable = function (callback) {
                                originalWhenStable.call(this, function () {
                                    var ng2Testability = upgradeAdapter.moduleRef.injector.get(core_1.Testability);
                                    if (ng2Testability.isStable()) {
                                        callback.apply(this, arguments);
                                    }
                                    else {
                                        ng2Testability.whenStable(newWhenStable.bind(this, callback));
                                    }
                                });
                            };
                            testabilityDelegate.whenStable = newWhenStable;
                            return testabilityDelegate;
                        }
                    ]);
                }
            }
        ]);
        ng1Module.run([
            '$injector', '$rootScope',
            function (ng1Injector, rootScope) {
                upgrade_ng1_adapter_1.UpgradeNg1ComponentAdapterBuilder.resolve(_this.ng1ComponentsToBeUpgraded, ng1Injector)
                    .then(function () {
                    // Note: There is a bug in TS 2.4 that prevents us from
                    // inlining this into @NgModule
                    // TODO(tbosch): find or file a bug against TypeScript for this.
                    var ngModule = {
                        providers: [
                            { provide: constants_1.$INJECTOR, useFactory: function () { return ng1Injector; } },
                            { provide: constants_1.$COMPILE, useFactory: function () { return ng1Injector.get(constants_1.$COMPILE); } },
                            _this.upgradedProviders
                        ],
                        imports: [_this.ng2AppModule],
                        entryComponents: _this.downgradedComponents
                    };
                    // At this point we have ng1 injector and we have prepared
                    // ng1 components to be upgraded, we now can bootstrap ng2.
                    var DynamicNgUpgradeModule = /** @class */ (function () {
                        function DynamicNgUpgradeModule() {
                        }
                        DynamicNgUpgradeModule.prototype.ngDoBootstrap = function () { };
                        DynamicNgUpgradeModule = __decorate([
                            core_1.NgModule(__assign({ jit: true }, ngModule)),
                            __metadata("design:paramtypes", [])
                        ], DynamicNgUpgradeModule);
                        return DynamicNgUpgradeModule;
                    }());
                    platformRef
                        .bootstrapModule(DynamicNgUpgradeModule, [_this.compilerOptions, { ngZone: _this.ngZone }])
                        .then(function (ref) {
                        _this.moduleRef = ref;
                        _this.ngZone.run(function () {
                            if (rootScopePrototype) {
                                rootScopePrototype.$apply = original$applyFn; // restore original $apply
                                while (delayApplyExps.length) {
                                    rootScope.$apply(delayApplyExps.shift());
                                }
                                rootScopePrototype = null;
                            }
                        });
                    })
                        .then(function () { return _this.ng2BootstrapDeferred.resolve(ng1Injector); }, util_1.onError)
                        .then(function () {
                        var subscription = _this.ngZone.onMicrotaskEmpty.subscribe({ next: function () { return rootScope.$digest(); } });
                        rootScope.$on('$destroy', function () { subscription.unsubscribe(); });
                    });
                })
                    .catch(function (e) { return _this.ng2BootstrapDeferred.reject(e); });
            }
        ]);
        return ng1Module;
    };
    return UpgradeAdapter;
}());
exports.UpgradeAdapter = UpgradeAdapter;
/**
 * Synchronous promise-like object to wrap parent injectors,
 * to preserve the synchronous nature of AngularJS's $compile.
 */
var ParentInjectorPromise = /** @class */ (function () {
    function ParentInjectorPromise(element) {
        this.element = element;
        this.callbacks = [];
        // store the promise on the element
        element.data(util_1.controllerKey(constants_1.INJECTOR_KEY), this);
    }
    ParentInjectorPromise.prototype.then = function (callback) {
        if (this.injector) {
            callback(this.injector);
        }
        else {
            this.callbacks.push(callback);
        }
    };
    ParentInjectorPromise.prototype.resolve = function (injector) {
        this.injector = injector;
        // reset the element data to point to the real injector
        this.element.data(util_1.controllerKey(constants_1.INJECTOR_KEY), injector);
        // clean out the element to prevent memory leaks
        this.element = null;
        // run all the queued callbacks
        this.callbacks.forEach(function (callback) { return callback(injector); });
        this.callbacks.length = 0;
    };
    return ParentInjectorPromise;
}());
/**
 * Use `UpgradeAdapterRef` to control a hybrid AngularJS / Angular application.
 *
 * @deprecated Deprecated since v5. Use `upgrade/static` instead, which also supports
 * [Ahead-of-Time compilation](guide/aot-compiler).
 */
var UpgradeAdapterRef = /** @class */ (function () {
    function UpgradeAdapterRef() {
        /* @internal */
        this._readyFn = null;
        this.ng1RootScope = null;
        this.ng1Injector = null;
        this.ng2ModuleRef = null;
        this.ng2Injector = null;
    }
    /* @internal */
    UpgradeAdapterRef.prototype._bootstrapDone = function (ngModuleRef, ng1Injector) {
        this.ng2ModuleRef = ngModuleRef;
        this.ng2Injector = ngModuleRef.injector;
        this.ng1Injector = ng1Injector;
        this.ng1RootScope = ng1Injector.get(constants_1.$ROOT_SCOPE);
        this._readyFn && this._readyFn(this);
    };
    /**
     * Register a callback function which is notified upon successful hybrid AngularJS / Angular
     * application has been bootstrapped.
     *
     * The `ready` callback function is invoked inside the Angular zone, therefore it does not
     * require a call to `$apply()`.
     */
    UpgradeAdapterRef.prototype.ready = function (fn) { this._readyFn = fn; };
    /**
     * Dispose of running hybrid AngularJS / Angular application.
     */
    UpgradeAdapterRef.prototype.dispose = function () {
        this.ng1Injector.get(constants_1.$ROOT_SCOPE).$destroy();
        this.ng2ModuleRef.destroy();
    };
    return UpgradeAdapterRef;
}());
exports.UpgradeAdapterRef = UpgradeAdapterRef;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBncmFkZV9hZGFwdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvdXBncmFkZS9zdGF0aWMvc3JjL2R5bmFtaWMvdXBncmFkZV9hZGFwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBK0k7QUFDL0ksOEVBQXlFO0FBRXpFLDRDQUE4QztBQUM5QyxpREFBOEk7QUFDOUkscUVBQWlFO0FBQ2pFLHVFQUFtRTtBQUNuRSx1Q0FBK0U7QUFFL0UsNkRBQXdFO0FBRXhFLElBQUksWUFBWSxHQUFXLENBQUMsQ0FBQztBQUU3Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnRkc7QUFDSDtJQXFCRSx3QkFBb0IsWUFBdUIsRUFBVSxlQUFpQztRQUFsRSxpQkFBWSxHQUFaLFlBQVksQ0FBVztRQUFVLG9CQUFlLEdBQWYsZUFBZSxDQUFrQjtRQXBCOUUsYUFBUSxHQUFXLGlCQUFlLFlBQVksRUFBRSxNQUFHLENBQUM7UUFDcEQseUJBQW9CLEdBQWdCLEVBQUUsQ0FBQztRQUMvQzs7Ozs7OztXQU9HO1FBQ0ssOEJBQXlCLEdBQXdELEVBQUUsQ0FBQztRQUNwRixzQkFBaUIsR0FBcUIsRUFBRSxDQUFDO1FBS3pDLGNBQVMsR0FBMEIsSUFBSSxDQUFDO1FBSzlDLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDakIsTUFBTSxJQUFJLEtBQUssQ0FDWCwrRUFBK0UsQ0FBQyxDQUFDO1NBQ3RGO0lBQ0gsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQTJERztJQUNILDhDQUFxQixHQUFyQixVQUFzQixTQUFvQjtRQUN4QyxJQUFJLENBQUMsb0JBQW9CLENB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