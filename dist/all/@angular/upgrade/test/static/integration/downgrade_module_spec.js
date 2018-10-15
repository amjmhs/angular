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
var platform_browser_1 = require("@angular/platform-browser");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var browser_util_1 = require("@angular/platform-browser/testing/src/browser_util");
var static_1 = require("@angular/upgrade/static");
var angular = require("@angular/upgrade/static/src/common/angular1");
var constants_1 = require("@angular/upgrade/static/src/common/constants");
var test_helpers_1 = require("../test_helpers");
test_helpers_1.withEachNg1Version(function () {
    [true, false].forEach(function (propagateDigest) {
        describe("lazy-load ng2 module (propagateDigest: " + propagateDigest + ")", function () {
            beforeEach(function () { return core_1.destroyPlatform(); });
            it('should support downgrading a component and propagate inputs', testing_1.async(function () {
                var Ng2AComponent = /** @class */ (function () {
                    function Ng2AComponent() {
                        this.value = -1;
                    }
                    __decorate([
                        core_1.Input(),
                        __metadata("design:type", Object)
                    ], Ng2AComponent.prototype, "value", void 0);
                    Ng2AComponent = __decorate([
                        core_1.Component({ selector: 'ng2A', template: 'a({{ value }}) | <ng2B [value]="value"></ng2B>' })
                    ], Ng2AComponent);
                    return Ng2AComponent;
                }());
                var Ng2BComponent = /** @class */ (function () {
                    function Ng2BComponent() {
                        this.value = -2;
                    }
                    __decorate([
                        core_1.Input(),
                        __metadata("design:type", Object)
                    ], Ng2BComponent.prototype, "value", void 0);
                    Ng2BComponent = __decorate([
                        core_1.Component({ selector: 'ng2B', template: 'b({{ value }})' })
                    ], Ng2BComponent);
                    return Ng2BComponent;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng2AComponent, Ng2BComponent],
                            entryComponents: [Ng2AComponent],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                var bootstrapFn = function (extraProviders) {
                    return platform_browser_dynamic_1.platformBrowserDynamic(extraProviders).bootstrapModule(Ng2Module);
                };
                var lazyModuleName = static_1.downgradeModule(bootstrapFn);
                var ng1Module = angular.module('ng1', [lazyModuleName])
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2AComponent, propagateDigest: propagateDigest }))
                    .run(function ($rootScope) { return $rootScope.value = 0; });
                var element = test_helpers_1.html('<div><ng2 [value]="value" ng-if="loadNg2"></ng2></div>');
                var $injector = angular.bootstrap(element, [ng1Module.name]);
                var $rootScope = $injector.get(constants_1.$ROOT_SCOPE);
                expect(element.textContent).toBe('');
                expect(function () { return $injector.get(constants_1.INJECTOR_KEY); }).toThrowError();
                $rootScope.$apply('value = 1');
                expect(element.textContent).toBe('');
                expect(function () { return $injector.get(constants_1.INJECTOR_KEY); }).toThrowError();
                $rootScope.$apply('loadNg2 = true');
                expect(element.textContent).toBe('');
                expect(function () { return $injector.get(constants_1.INJECTOR_KEY); }).toThrowError();
                // Wait for the module to be bootstrapped.
                setTimeout(function () {
                    expect(function () { return $injector.get(constants_1.INJECTOR_KEY); }).not.toThrow();
                    // Wait for `$evalAsync()` to propagate inputs.
                    setTimeout(function () { return expect(element.textContent).toBe('a(1) | b(1)'); });
                });
            }));
            it('should support using an upgraded service', testing_1.async(function () {
                var Ng2Service = /** @class */ (function () {
                    function Ng2Service(ng1Value) {
                        var _this = this;
                        this.ng1Value = ng1Value;
                        this.getValue = function () { return _this.ng1Value + "-bar"; };
                    }
                    Ng2Service = __decorate([
                        __param(0, core_1.Inject('ng1Value')),
                        __metadata("design:paramtypes", [String])
                    ], Ng2Service);
                    return Ng2Service;
                }());
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component(ng2Service) {
                        this.value = ng2Service.getValue();
                    }
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: '{{ value }}' }),
                        __metadata("design:paramtypes", [Ng2Service])
                    ], Ng2Component);
                    return Ng2Component;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule],
                            providers: [
                                Ng2Service,
                                {
                                    provide: 'ng1Value',
                                    useFactory: function (i) { return i.get('ng1Value'); },
                                    deps: ['$injector'],
                                },
                            ],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                var bootstrapFn = function (extraProviders) {
                    return platform_browser_dynamic_1.platformBrowserDynamic(extraProviders).bootstrapModule(Ng2Module);
                };
                var lazyModuleName = static_1.downgradeModule(bootstrapFn);
                var ng1Module = angular.module('ng1', [lazyModuleName])
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component, propagateDigest: propagateDigest }))
                    .value('ng1Value', 'foo');
                var element = test_helpers_1.html('<div><ng2 ng-if="loadNg2"></ng2></div>');
                var $injector = angular.bootstrap(element, [ng1Module.name]);
                var $rootScope = $injector.get(constants_1.$ROOT_SCOPE);
                expect(element.textContent).toBe('');
                expect(function () { return $injector.get(constants_1.INJECTOR_KEY); }).toThrowError();
                $rootScope.$apply('loadNg2 = true');
                expect(element.textContent).toBe('');
                expect(function () { return $injector.get(constants_1.INJECTOR_KEY); }).toThrowError();
                // Wait for the module to be bootstrapped.
                setTimeout(function () {
                    expect(function () { return $injector.get(constants_1.INJECTOR_KEY); }).not.toThrow();
                    // Wait for `$evalAsync()` to propagate inputs.
                    setTimeout(function () { return expect(element.textContent).toBe('foo-bar'); });
                });
            }));
            it('should create components inside the Angular zone', testing_1.async(function () {
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component() {
                        this.inTheZone = false;
                        this.inTheZone = core_1.NgZone.isInAngularZone();
                    }
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: 'In the zone: {{ inTheZone }}' }),
                        __metadata("design:paramtypes", [])
                    ], Ng2Component);
                    return Ng2Component;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                var bootstrapFn = function (extraProviders) {
                    return platform_browser_dynamic_1.platformBrowserDynamic(extraProviders).bootstrapModule(Ng2Module);
                };
                var lazyModuleName = static_1.downgradeModule(bootstrapFn);
                var ng1Module = angular.module('ng1', [lazyModuleName])
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component, propagateDigest: propagateDigest }));
                var element = test_helpers_1.html('<ng2></ng2>');
                angular.bootstrap(element, [ng1Module.name]);
                // Wait for the module to be bootstrapped.
                setTimeout(function () {
                    // Wait for `$evalAsync()` to propagate inputs.
                    setTimeout(function () { return expect(element.textContent).toBe('In the zone: true'); });
                });
            }));
            it('should destroy components inside the Angular zone', testing_1.async(function () {
                var destroyedInTheZone = false;
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component() {
                    }
                    Ng2Component.prototype.ngOnDestroy = function () { destroyedInTheZone = core_1.NgZone.isInAngularZone(); };
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: '' })
                    ], Ng2Component);
                    return Ng2Component;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                var bootstrapFn = function (extraProviders) {
                    return platform_browser_dynamic_1.platformBrowserDynamic(extraProviders).bootstrapModule(Ng2Module);
                };
                var lazyModuleName = static_1.downgradeModule(bootstrapFn);
                var ng1Module = angular.module('ng1', [lazyModuleName])
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component, propagateDigest: propagateDigest }));
                var element = test_helpers_1.html('<ng2 ng-if="!hideNg2"></ng2>');
                var $injector = angular.bootstrap(element, [ng1Module.name]);
                var $rootScope = $injector.get(constants_1.$ROOT_SCOPE);
                // Wait for the module to be bootstrapped.
                setTimeout(function () {
                    $rootScope.$apply('hideNg2 = true');
                    expect(destroyedInTheZone).toBe(true);
                });
            }));
            it('should propagate input changes inside the Angular zone', testing_1.async(function () {
                var ng2Component;
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component() {
                        this.attrInput = 'foo';
                        this.propInput = 'foo';
                        ng2Component = this;
                    }
                    Ng2Component.prototype.ngOnChanges = function () { };
                    __decorate([
                        core_1.Input(),
                        __metadata("design:type", Object)
                    ], Ng2Component.prototype, "attrInput", void 0);
                    __decorate([
                        core_1.Input(),
                        __metadata("design:type", Object)
                    ], Ng2Component.prototype, "propInput", void 0);
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: '' }),
                        __metadata("design:paramtypes", [])
                    ], Ng2Component);
                    return Ng2Component;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                var bootstrapFn = function (extraProviders) {
                    return platform_browser_dynamic_1.platformBrowserDynamic(extraProviders).bootstrapModule(Ng2Module);
                };
                var lazyModuleName = static_1.downgradeModule(bootstrapFn);
                var ng1Module = angular.module('ng1', [lazyModuleName])
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component, propagateDigest: propagateDigest }))
                    .run(function ($rootScope) {
                    $rootScope.attrVal = 'bar';
                    $rootScope.propVal = 'bar';
                });
                var element = test_helpers_1.html('<ng2 attr-input="{{ attrVal }}" [prop-input]="propVal"></ng2>');
                var $injector = angular.bootstrap(element, [ng1Module.name]);
                var $rootScope = $injector.get(constants_1.$ROOT_SCOPE);
                setTimeout(function () {
                    setTimeout(function () {
                        var expectToBeInNgZone = function () { return expect(core_1.NgZone.isInAngularZone()).toBe(true); };
                        var changesSpy = spyOn(ng2Component, 'ngOnChanges').and.callFake(expectToBeInNgZone);
                        expect(ng2Component.attrInput).toBe('bar');
                        expect(ng2Component.propInput).toBe('bar');
                        $rootScope.$apply('attrVal = "baz"');
                        expect(ng2Component.attrInput).toBe('baz');
                        expect(ng2Component.propInput).toBe('bar');
                        expect(changesSpy).toHaveBeenCalledTimes(1);
                        $rootScope.$apply('propVal = "qux"');
                        expect(ng2Component.attrInput).toBe('baz');
                        expect(ng2Component.propInput).toBe('qux');
                        expect(changesSpy).toHaveBeenCalledTimes(2);
                    });
                });
            }));
            it('should wire up the component for change detection', testing_1.async(function () {
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component() {
                        this.count = 0;
                    }
                    Ng2Component.prototype.increment = function () { ++this.count; };
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: '{{ count }}<button (click)="increment()"></button>' })
                    ], Ng2Component);
                    return Ng2Component;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                var bootstrapFn = function (extraProviders) {
                    return platform_browser_dynamic_1.platformBrowserDynamic(extraProviders).bootstrapModule(Ng2Module);
                };
                var lazyModuleName = static_1.downgradeModule(bootstrapFn);
                var ng1Module = angular.module('ng1', [lazyModuleName])
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component, propagateDigest: propagateDigest }));
                var element = test_helpers_1.html('<ng2></ng2>');
                angular.bootstrap(element, [ng1Module.name]);
                setTimeout(function () {
                    setTimeout(function () {
                        var button = element.querySelector('button');
                        expect(element.textContent).toBe('0');
                        button.click();
                        expect(element.textContent).toBe('1');
                        button.click();
                        expect(element.textContent).toBe('2');
                    });
                });
            }));
            it('should run the lifecycle hooks in the correct order', testing_1.async(function () {
                var logs = [];
                var rootScope;
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component() {
                        this.value = 'foo';
                    }
                    Ng2Component.prototype.ngAfterContentChecked = function () { this.log('AfterContentChecked'); };
                    Ng2Component.prototype.ngAfterContentInit = function () { this.log('AfterContentInit'); };
                    Ng2Component.prototype.ngAfterViewChecked = function () { this.log('AfterViewChecked'); };
                    Ng2Component.prototype.ngAfterViewInit = function () { this.log('AfterViewInit'); };
                    Ng2Component.prototype.ngDoCheck = function () { this.log('DoCheck'); };
                    Ng2Component.prototype.ngOnChanges = function () { this.log('OnChanges'); };
                    Ng2Component.prototype.ngOnDestroy = function () { this.log('OnDestroy'); };
                    Ng2Component.prototype.ngOnInit = function () { this.log('OnInit'); };
                    Ng2Component.prototype.log = function (hook) { logs.push(hook + "(" + this.value + ")"); };
                    __decorate([
                        core_1.Input(),
                        __metadata("design:type", Object)
                    ], Ng2Component.prototype, "value", void 0);
                    Ng2Component = __decorate([
                        core_1.Component({
                            selector: 'ng2',
                            template: "\n               {{ value }}\n               <button (click)=\"value = 'qux'\"></button>\n               <ng-content></ng-content>\n             "
                        })
                    ], Ng2Component);
                    return Ng2Component;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                var bootstrapFn = function (extraProviders) {
                    return platform_browser_dynamic_1.platformBrowserDynamic(extraProviders).bootstrapModule(Ng2Module);
                };
                var lazyModuleName = static_1.downgradeModule(bootstrapFn);
                var ng1Module = angular.module('ng1', [lazyModuleName])
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component, propagateDigest: propagateDigest }))
                    .run(function ($rootScope) {
                    rootScope = $rootScope;
                    rootScope.value = 'bar';
                });
                var element = test_helpers_1.html('<div><ng2 value="{{ value }}" ng-if="!hideNg2">Content</ng2></div>');
                angular.bootstrap(element, [ng1Module.name]);
                setTimeout(function () {
                    setTimeout(function () {
                        var button = element.querySelector('button');
                        // Once initialized.
                        expect(test_helpers_1.multiTrim(element.textContent)).toBe('bar Content');
                        expect(logs).toEqual([
                            // `ngOnChanges()` call triggered directly through the `inputChanges` $watcher.
                            'OnChanges(bar)',
                            // Initial CD triggered directly through the `detectChanges()` or `inputChanges`
                            // $watcher (for `propagateDigest` true/false respectively).
                            'OnInit(bar)',
                            'DoCheck(bar)',
                            'AfterContentInit(bar)',
                            'AfterContentChecked(bar)',
                            'AfterViewInit(bar)',
                            'AfterViewChecked(bar)'
                        ].concat((propagateDigest ?
                            [
                                // CD triggered directly through the `detectChanges()` $watcher (2nd
                                // $digest).
                                'DoCheck(bar)',
                                'AfterContentChecked(bar)',
                                'AfterViewChecked(bar)',
                            ] :
                            []), [
                            // CD triggered due to entering/leaving the NgZone (in `downgradeFn()`).
                            'DoCheck(bar)',
                            'AfterContentChecked(bar)',
                            'AfterViewChecked(bar)',
                        ]));
                        logs.length = 0;
                        // Change inputs and run `$digest`.
                        rootScope.$apply('value = "baz"');
                        expect(test_helpers_1.multiTrim(element.textContent)).toBe('baz Content');
                        expect(logs).toEqual([
                            // `ngOnChanges()` call triggered directly through the `inputChanges` $watcher.
                            'OnChanges(baz)',
                            // `propagateDigest: true` (3 CD runs):
                            //   - CD triggered due to entering/leaving the NgZone (in `inputChanges`
                            //   $watcher).
                            //   - CD triggered directly through the `detectChanges()` $watcher.
                            //   - CD triggered due to entering/leaving the NgZone (in `detectChanges`
                            //   $watcher).
                            // `propagateDigest: false` (2 CD runs):
                            //   - CD triggered directly through the `inputChanges` $watcher.
                            //   - CD triggered due to entering/leaving the NgZone (in `inputChanges`
                            //   $watcher).
                            'DoCheck(baz)',
                            'AfterContentChecked(baz)',
                            'AfterViewChecked(baz)',
                            'DoCheck(baz)',
                            'AfterContentChecked(baz)',
                            'AfterViewChecked(baz)'
                        ].concat((propagateDigest ?
                            [
                                'DoCheck(baz)',
                                'AfterContentChecked(baz)',
                                'AfterViewChecked(baz)',
                            ] :
                            [])));
                        logs.length = 0;
                        // Run `$digest` (without changing inputs).
                        rootScope.$digest();
                        expect(test_helpers_1.multiTrim(element.textContent)).toBe('baz Content');
                        expect(logs).toEqual(propagateDigest ?
                            [
                                // CD triggered directly through the `detectChanges()` $watcher.
                                'DoCheck(baz)',
                                'AfterContentChecked(baz)',
                                'AfterViewChecked(baz)',
                                // CD triggered due to entering/leaving the NgZone (in the above $watcher).
                                'DoCheck(baz)',
                                'AfterContentChecked(baz)',
                                'AfterViewChecked(baz)',
                            ] :
                            []);
                        logs.length = 0;
                        // Trigger change detection (without changing inputs).
                        button.click();
                        expect(test_helpers_1.multiTrim(element.textContent)).toBe('qux Content');
                        expect(logs).toEqual([
                            'DoCheck(qux)',
                            'AfterContentChecked(qux)',
                            'AfterViewChecked(qux)',
                        ]);
                        logs.length = 0;
                        // Destroy the component.
                        rootScope.$apply('hideNg2 = true');
                        expect(logs).toEqual([
                            'OnDestroy(qux)',
                        ]);
                        logs.length = 0;
                    });
                });
            }));
            it('should detach hostViews from the ApplicationRef once destroyed', testing_1.async(function () {
                var ng2Component;
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component(appRef) {
                        this.appRef = appRef;
                        ng2Component = this;
                        spyOn(appRef, 'attachView').and.callThrough();
                        spyOn(appRef, 'detachView').and.callThrough();
                    }
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: '' }),
                        __metadata("design:paramtypes", [core_1.ApplicationRef])
                    ], Ng2Component);
                    return Ng2Component;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                var bootstrapFn = function (extraProviders) {
                    return platform_browser_dynamic_1.platformBrowserDynamic(extraProviders).bootstrapModule(Ng2Module);
                };
                var lazyModuleName = static_1.downgradeModule(bootstrapFn);
                var ng1Module = angular.module('ng1', [lazyModuleName])
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component, propagateDigest: propagateDigest }));
                var element = test_helpers_1.html('<ng2 ng-if="!hideNg2"></ng2>');
                var $injector = angular.bootstrap(element, [ng1Module.name]);
                var $rootScope = $injector.get(constants_1.$ROOT_SCOPE);
                setTimeout(function () {
                    setTimeout(function () {
                        var hostView = ng2Component.appRef.attachView.calls.mostRecent().args[0];
                        expect(hostView.destroyed).toBe(false);
                        $rootScope.$apply('hideNg2 = true');
                        expect(hostView.destroyed).toBe(true);
                        expect(ng2Component.appRef.detachView).toHaveBeenCalledWith(hostView);
                    });
                });
            }));
            it('should only retrieve the Angular zone once (and cache it for later use)', testing_1.fakeAsync(function () {
                var count = 0;
                var getNgZoneCount = 0;
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component() {
                        this.count = ++count;
                        this.inTheZone = false;
                        this.inTheZone = core_1.NgZone.isInAngularZone();
                    }
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: 'Count: {{ count }} | In the zone: {{ inTheZone }}' }),
                        __metadata("design:paramtypes", [])
                    ], Ng2Component);
                    return Ng2Component;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module(injector) {
                        var originalGet = injector.get;
                        injector.get = function (token) {
                            if (token === core_1.NgZone)
                                ++getNgZoneCount;
                            return originalGet.apply(injector, arguments);
                        };
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule],
                        }),
                        __metadata("design:paramtypes", [core_1.Injector])
                    ], Ng2Module);
                    return Ng2Module;
                }());
                var tickDelay = browser_util_1.browserDetection.isIE ? 100 : 0;
                var bootstrapFn = function (extraProviders) {
                    return platform_browser_dynamic_1.platformBrowserDynamic(extraProviders).bootstrapModule(Ng2Module);
                };
                var lazyModuleName = static_1.downgradeModule(bootstrapFn);
                var ng1Module = angular.module('ng1', [lazyModuleName])
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component, propagateDigest: propagateDigest }));
                var element = test_helpers_1.html('<div><ng2 ng-if="showNg2"></ng2></div>');
                var $injector = angular.bootstrap(element, [ng1Module.name]);
                var $rootScope = $injector.get(constants_1.$ROOT_SCOPE);
                $rootScope.$apply('showNg2 = true');
                testing_1.tick(tickDelay); // Wait for the module to be bootstrapped and `$evalAsync()` to
                // propagate inputs.
                var injector = $injector.get(constants_1.LAZY_MODULE_REF).injector;
                var injectorGet = injector.get;
                spyOn(injector, 'get').and.callFake(function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    expect(args[0]).not.toBe(core_1.NgZone);
                    return injectorGet.apply(injector, args);
                });
                expect(element.textContent).toBe('Count: 1 | In the zone: true');
                $rootScope.$apply('showNg2 = false');
                expect(element.textContent).toBe('');
                $rootScope.$apply('showNg2 = true');
                testing_1.tick(tickDelay); // Wait for `$evalAsync()` to propagate inputs.
                expect(element.textContent).toBe('Count: 2 | In the zone: true');
                $rootScope.$destroy();
            }));
            it('should give access to both injectors in the Angular module\'s constructor', testing_1.async(function () {
                var $injectorFromNg2 = null;
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component() {
                    }
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: '' })
                    ], Ng2Component);
                    return Ng2Component;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module(injector) {
                        $injectorFromNg2 = injector.get('$injector');
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule],
                        }),
                        __metadata("design:paramtypes", [core_1.Injector])
                    ], Ng2Module);
                    return Ng2Module;
                }());
                var bootstrapFn = function (extraProviders) {
                    return platform_browser_dynamic_1.platformBrowserDynamic(extraProviders).bootstrapModule(Ng2Module);
                };
                var lazyModuleName = static_1.downgradeModule(bootstrapFn);
                var ng1Module = angular.module('ng1', [lazyModuleName])
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component, propagateDigest: propagateDigest }));
                var element = test_helpers_1.html('<ng2></ng2>');
                var $injectorFromNg1 = angular.bootstrap(element, [ng1Module.name]);
                // Wait for the module to be bootstrapped.
                setTimeout(function () { return expect($injectorFromNg2).toBe($injectorFromNg1); });
            }));
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmdyYWRlX21vZHVsZV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvdXBncmFkZS90ZXN0L3N0YXRpYy9pbnRlZ3JhdGlvbi9kb3duZ3JhZGVfbW9kdWxlX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBNFA7QUFDNVAsaURBQTZEO0FBQzdELDhEQUF3RDtBQUN4RCw4RUFBeUU7QUFDekUsbUZBQW9GO0FBQ3BGLGtEQUE0RTtBQUM1RSxxRUFBdUU7QUFDdkUsMEVBQXdHO0FBR3hHLGdEQUFvRTtBQUdwRSxpQ0FBa0IsQ0FBQztJQUNqQixDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxlQUFlO1FBQ25DLFFBQVEsQ0FBQyw0Q0FBMEMsZUFBZSxNQUFHLEVBQUU7WUFFckUsVUFBVSxDQUFDLGNBQU0sT0FBQSxzQkFBZSxFQUFFLEVBQWpCLENBQWlCLENBQUMsQ0FBQztZQUVwQyxFQUFFLENBQUMsNkRBQTZELEVBQUUsZUFBSyxDQUFDO2dCQUduRTtvQkFGQTt3QkFHVyxVQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ3RCLENBQUM7b0JBRFU7d0JBQVIsWUFBSyxFQUFFOztnRUFBWTtvQkFEaEIsYUFBYTt3QkFGbEIsZ0JBQVMsQ0FDTixFQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLGdEQUFnRCxFQUFDLENBQUM7dUJBQzdFLGFBQWEsQ0FFbEI7b0JBQUQsb0JBQUM7aUJBQUEsQUFGRCxJQUVDO2dCQUdEO29CQURBO3dCQUVXLFVBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDdEIsQ0FBQztvQkFEVTt3QkFBUixZQUFLLEVBQUU7O2dFQUFZO29CQURoQixhQUFhO3dCQURsQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLEVBQUMsQ0FBQzt1QkFDcEQsYUFBYSxDQUVsQjtvQkFBRCxvQkFBQztpQkFBQSxBQUZELElBRUM7Z0JBT0Q7b0JBQUE7b0JBRUEsQ0FBQztvQkFEQyxpQ0FBYSxHQUFiLGNBQWlCLENBQUM7b0JBRGQsU0FBUzt3QkFMZCxlQUFRLENBQUM7NEJBQ1IsWUFBWSxFQUFFLENBQUMsYUFBYSxFQUFFLGFBQWEsQ0FBQzs0QkFDNUMsZUFBZSxFQUFFLENBQUMsYUFBYSxDQUFDOzRCQUNoQyxPQUFPLEVBQUUsQ0FBQyxnQ0FBYSxDQUFDO3lCQUN6QixDQUFDO3VCQUNJLFNBQVMsQ0FFZDtvQkFBRCxnQkFBQztpQkFBQSxBQUZELElBRUM7Z0JBRUQsSUFBTSxXQUFXLEdBQUcsVUFBQyxjQUFnQztvQkFDakQsT0FBQSxpREFBc0IsQ0FBQyxjQUFjLENBQUMsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDO2dCQUFqRSxDQUFpRSxDQUFDO2dCQUN0RSxJQUFNLGNBQWMsR0FBRyx3QkFBZSxDQUFZLFdBQVcsQ0FBQyxDQUFDO2dCQUMvRCxJQUFNLFNBQVMsR0FDWCxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO3FCQUNsQyxTQUFTLENBQ04sS0FBSyxFQUFFLDJCQUFrQixDQUFDLEVBQUMsU0FBUyxFQUFFLGFBQWEsRUFBRSxlQUFlLGlCQUFBLEVBQUMsQ0FBQyxDQUFDO3FCQUMxRSxHQUFHLENBQUMsVUFBQyxVQUFxQyxJQUFLLE9BQUEsVUFBVSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQXBCLENBQW9CLENBQUMsQ0FBQztnQkFFOUUsSUFBTSxPQUFPLEdBQUcsbUJBQUksQ0FBQyx3REFBd0QsQ0FBQyxDQUFDO2dCQUMvRSxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUMvRCxJQUFNLFVBQVUsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLHVCQUFXLENBQThCLENBQUM7Z0JBRTNFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNyQyxNQUFNLENBQUMsY0FBTSxPQUFBLFNBQVMsQ0FBQyxHQUFHLENBQUMsd0JBQVksQ0FBQyxFQUEzQixDQUEyQixDQUFDLENBQUMsWUFBWSxFQUFFLENBQUM7Z0JBRXpELFVBQVUsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQy9CLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNyQyxNQUFNLENBQUMsY0FBTSxPQUFBLFNBQVMsQ0FBQyxHQUFHLENBQUMsd0JBQVksQ0FBQyxFQUEzQixDQUEyQixDQUFDLENBQUMsWUFBWSxFQUFFLENBQUM7Z0JBRXpELFVBQVUsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDcEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ3JDLE1BQU0sQ0FBQyxjQUFNLE9BQUEsU0FBUyxDQUFDLEdBQUcsQ0FBQyx3QkFBWSxDQUFDLEVBQTNCLENBQTJCLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFFekQsMENBQTBDO2dCQUMxQyxVQUFVLENBQUM7b0JBQ1QsTUFBTSxDQUFDLGNBQU0sT0FBQSxTQUFTLENBQUMsR0FBRyxDQUFDLHdCQUFZLENBQUMsRUFBM0IsQ0FBMkIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFFeEQsK0NBQStDO29CQUMvQyxVQUFVLENBQUMsY0FBTSxPQUFBLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUEvQyxDQUErQyxDQUFDLENBQUM7Z0JBQ3BFLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVQLEVBQUUsQ0FBQywwQ0FBMEMsRUFBRSxlQUFLLENBQUM7Z0JBQ2hEO29CQUNFLG9CQUF3QyxRQUFnQjt3QkFBeEQsaUJBQTREO3dCQUFwQixhQUFRLEdBQVIsUUFBUSxDQUFRO3dCQUN4RCxhQUFRLEdBQUcsY0FBTSxPQUFHLEtBQUksQ0FBQyxRQUFRLFNBQU0sRUFBdEIsQ0FBc0IsQ0FBQztvQkFEbUIsQ0FBQztvQkFEeEQsVUFBVTt3QkFDRCxXQUFBLGFBQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQTs7dUJBRDNCLFVBQVUsQ0FHZjtvQkFBRCxpQkFBQztpQkFBQSxBQUhELElBR0M7Z0JBR0Q7b0JBRUUsc0JBQVksVUFBc0I7d0JBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQUMsQ0FBQztvQkFGdkUsWUFBWTt3QkFEakIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBQyxDQUFDO3lEQUc1QixVQUFVO3VCQUY5QixZQUFZLENBR2pCO29CQUFELG1CQUFDO2lCQUFBLEFBSEQsSUFHQztnQkFlRDtvQkFBQTtvQkFFQSxDQUFDO29CQURDLGlDQUFhLEdBQWIsY0FBaUIsQ0FBQztvQkFEZCxTQUFTO3dCQWJkLGVBQVEsQ0FBQzs0QkFDUixZQUFZLEVBQUUsQ0FBQyxZQUFZLENBQUM7NEJBQzVCLGVBQWUsRUFBRSxDQUFDLFlBQVksQ0FBQzs0QkFDL0IsT0FBTyxFQUFFLENBQUMsZ0NBQWEsQ0FBQzs0QkFDeEIsU0FBUyxFQUFFO2dDQUNULFVBQVU7Z0NBQ1Y7b0NBQ0UsT0FBTyxFQUFFLFVBQVU7b0NBQ25CLFVBQVUsRUFBRSxVQUFDLENBQTJCLElBQUssT0FBQSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFqQixDQUFpQjtvQ0FDOUQsSUFBSSxFQUFFLENBQUMsV0FBVyxDQUFDO2lDQUNwQjs2QkFDRjt5QkFDRixDQUFDO3VCQUNJLFNBQVMsQ0FFZDtvQkFBRCxnQkFBQztpQkFBQSxBQUZELElBRUM7Z0JBRUQsSUFBTSxXQUFXLEdBQUcsVUFBQyxjQUFnQztvQkFDakQsT0FBQSxpREFBc0IsQ0FBQyxjQUFjLENBQUMsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDO2dCQUFqRSxDQUFpRSxDQUFDO2dCQUN0RSxJQUFNLGNBQWMsR0FBRyx3QkFBZSxDQUFZLFdBQVcsQ0FBQyxDQUFDO2dCQUMvRCxJQUFNLFNBQVMsR0FDWCxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO3FCQUNsQyxTQUFTLENBQUMsS0FBSyxFQUFFLDJCQUFrQixDQUFDLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxlQUFlLGlCQUFBLEVBQUMsQ0FBQyxDQUFDO3FCQUNoRixLQUFLLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUVsQyxJQUFNLE9BQU8sR0FBRyxtQkFBSSxDQUFDLHdDQUF3QyxDQUFDLENBQUM7Z0JBQy9ELElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQy9ELElBQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsdUJBQVcsQ0FBOEIsQ0FBQztnQkFFM0UsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ3JDLE1BQU0sQ0FBQyxjQUFNLE9BQUEsU0FBUyxDQUFDLEdBQUcsQ0FBQyx3QkFBWSxDQUFDLEVBQTNCLENBQTJCLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFFekQsVUFBVSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUNwQyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDckMsTUFBTSxDQUFDLGNBQU0sT0FBQSxTQUFTLENBQUMsR0FBRyxDQUFDLHdCQUFZLENBQUMsRUFBM0IsQ0FBMkIsQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUV6RCwwQ0FBMEM7Z0JBQzFDLFVBQVUsQ0FBQztvQkFDVCxNQUFNLENBQUMsY0FBTSxPQUFBLFNBQVMsQ0FBQyxHQUFHLENBQUMsd0JBQVksQ0FBQyxFQUEzQixDQUEyQixDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUV4RCwrQ0FBK0M7b0JBQy9DLFVBQVUsQ0FBQyxjQUFNLE9BQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQTNDLENBQTJDLENBQUMsQ0FBQztnQkFDaEUsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRVAsRUFBRSxDQUFDLGtEQUFrRCxFQUFFLGVBQUssQ0FBQztnQkFFeEQ7b0JBRUU7d0JBRFEsY0FBUyxHQUFHLEtBQUssQ0FBQzt3QkFDVixJQUFJLENBQUMsU0FBUyxHQUFHLGFBQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztvQkFBQyxDQUFDO29CQUZ4RCxZQUFZO3dCQURqQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsOEJBQThCLEVBQUMsQ0FBQzs7dUJBQ2pFLFlBQVksQ0FHakI7b0JBQUQsbUJBQUM7aUJBQUEsQUFIRCxJQUdDO2dCQU9EO29CQUFBO29CQUVBLENBQUM7b0JBREMsaUNBQWEsR0FBYixjQUFpQixDQUFDO29CQURkLFNBQVM7d0JBTGQsZUFBUSxDQUFDOzRCQUNSLFlBQVksRUFBRSxDQUFDLFlBQVksQ0FBQzs0QkFDNUIsZUFBZSxFQUFFLENBQUMsWUFBWSxDQUFDOzRCQUMvQixPQUFPLEVBQUUsQ0FBQyxnQ0FBYSxDQUFDO3lCQUN6QixDQUFDO3VCQUNJLFNBQVMsQ0FFZDtvQkFBRCxnQkFBQztpQkFBQSxBQUZELElBRUM7Z0JBRUQsSUFBTSxXQUFXLEdBQUcsVUFBQyxjQUFnQztvQkFDakQsT0FBQSxpREFBc0IsQ0FBQyxjQUFjLENBQUMsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDO2dCQUFqRSxDQUFpRSxDQUFDO2dCQUN0RSxJQUFNLGNBQWMsR0FBRyx3QkFBZSxDQUFZLFdBQVcsQ0FBQyxDQUFDO2dCQUMvRCxJQUFNLFNBQVMsR0FDWCxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO3FCQUNsQyxTQUFTLENBQ04sS0FBSyxFQUFFLDJCQUFrQixDQUFDLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxlQUFlLGlCQUFBLEVBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRW5GLElBQU0sT0FBTyxHQUFHLG1CQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ3BDLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBRTdDLDBDQUEwQztnQkFDMUMsVUFBVSxDQUFDO29CQUNULCtDQUErQztvQkFDL0MsVUFBVSxDQUFDLGNBQU0sT0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxFQUFyRCxDQUFxRCxDQUFDLENBQUM7Z0JBQzFFLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVQLEVBQUUsQ0FBQyxtREFBbUQsRUFBRSxlQUFLLENBQUM7Z0JBQ3pELElBQUksa0JBQWtCLEdBQUcsS0FBSyxDQUFDO2dCQUcvQjtvQkFBQTtvQkFFQSxDQUFDO29CQURDLGtDQUFXLEdBQVgsY0FBZ0Isa0JBQWtCLEdBQUcsYUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFENUQsWUFBWTt3QkFEakIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBQyxDQUFDO3VCQUNyQyxZQUFZLENBRWpCO29CQUFELG1CQUFDO2lCQUFBLEFBRkQsSUFFQztnQkFPRDtvQkFBQTtvQkFFQSxDQUFDO29CQURDLGlDQUFhLEdBQWIsY0FBaUIsQ0FBQztvQkFEZCxTQUFTO3dCQUxkLGVBQVEsQ0FBQzs0QkFDUixZQUFZLEVBQUUsQ0FBQyxZQUFZLENBQUM7NEJBQzVCLGVBQWUsRUFBRSxDQUFDLFlBQVksQ0FBQzs0QkFDL0IsT0FBTyxFQUFFLENBQUMsZ0NBQWEsQ0FBQzt5QkFDekIsQ0FBQzt1QkFDSSxTQUFTLENBRWQ7b0JBQUQsZ0JBQUM7aUJBQUEsQUFGRCxJQUVDO2dCQUVELElBQU0sV0FBVyxHQUFHLFVBQUMsY0FBZ0M7b0JBQ2pELE9BQUEsaURBQXNCLENBQUMsY0FBYyxDQUFDLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQztnQkFBakUsQ0FBaUUsQ0FBQztnQkFDdEUsSUFBTSxjQUFjLEdBQUcsd0JBQWUsQ0FBWSxXQUFXLENBQUMsQ0FBQztnQkFDL0QsSUFBTSxTQUFTLEdBQ1gsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztxQkFDbEMsU0FBUyxDQUNOLEtBQUssRUFBRSwyQkFBa0IsQ0FBQyxFQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsZUFBZSxpQkFBQSxFQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVuRixJQUFNLE9BQU8sR0FBRyxtQkFBSSxDQUFDLDhCQUE4QixDQUFDLENBQUM7Z0JBQ3JELElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQy9ELElBQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsdUJBQVcsQ0FBOEIsQ0FBQztnQkFFM0UsMENBQTBDO2dCQUMxQyxVQUFVLENBQUM7b0JBQ1QsVUFBVSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO29CQUNwQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3hDLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVQLEVBQUUsQ0FBQyx3REFBd0QsRUFBRSxlQUFLLENBQUM7Z0JBQzlELElBQUksWUFBMEIsQ0FBQztnQkFHL0I7b0JBSUU7d0JBSFMsY0FBUyxHQUFHLEtBQUssQ0FBQzt3QkFDbEIsY0FBUyxHQUFHLEtBQUssQ0FBQzt3QkFFWCxZQUFZLEdBQUcsSUFBSSxDQUFDO29CQUFDLENBQUM7b0JBQ3RDLGtDQUFXLEdBQVgsY0FBZSxDQUFDO29CQUpQO3dCQUFSLFlBQUssRUFBRTs7bUVBQW1CO29CQUNsQjt3QkFBUixZQUFLLEVBQUU7O21FQUFtQjtvQkFGdkIsWUFBWTt3QkFEakIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBQyxDQUFDOzt1QkFDckMsWUFBWSxDQU1qQjtvQkFBRCxtQkFBQztpQkFBQSxBQU5ELElBTUM7Z0JBT0Q7b0JBQUE7b0JBRUEsQ0FBQztvQkFEQyxpQ0FBYSxHQUFiLGNBQWlCLENBQUM7b0JBRGQsU0FBUzt3QkFMZCxlQUFRLENBQUM7NEJBQ1IsWUFBWSxFQUFFLENBQUMsWUFBWSxDQUFDOzRCQUM1QixlQUFlLEVBQUUsQ0FBQyxZQUFZLENBQUM7NEJBQy9CLE9BQU8sRUFBRSxDQUFDLGdDQUFhLENBQUM7eUJBQ3pCLENBQUM7dUJBQ0ksU0FBUyxDQUVkO29CQUFELGdCQUFDO2lCQUFBLEFBRkQsSUFFQztnQkFFRCxJQUFNLFdBQVcsR0FBRyxVQUFDLGNBQWdDO29CQUNqRCxPQUFBLGlEQUFzQixDQUFDLGNBQWMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUM7Z0JBQWpFLENBQWlFLENBQUM7Z0JBQ3RFLElBQU0sY0FBYyxHQUFHLHdCQUFlLENBQVksV0FBVyxDQUFDLENBQUM7Z0JBQy9ELElBQU0sU0FBUyxHQUNYLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsY0FBYyxDQUFDLENBQUM7cUJBQ2xDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsMkJBQWtCLENBQUMsRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLGVBQWUsaUJBQUEsRUFBQyxDQUFDLENBQUM7cUJBQ2hGLEdBQUcsQ0FBQyxVQUFDLFVBQXFDO29CQUN6QyxVQUFVLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztvQkFDM0IsVUFBVSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7Z0JBQzdCLENBQUMsQ0FBQyxDQUFDO2dCQUVYLElBQU0sT0FBTyxHQUFHLG1CQUFJLENBQUMsK0RBQStELENBQUMsQ0FBQztnQkFDdEYsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDL0QsSUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyx1QkFBVyxDQUE4QixDQUFDO2dCQUUzRSxVQUFVLENBQUM7b0JBQ1QsVUFBVSxDQUFDO3dCQUNULElBQU0sa0JBQWtCLEdBQUcsY0FBTSxPQUFBLE1BQU0sQ0FBQyxhQUFNLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQTNDLENBQTJDLENBQUM7d0JBQzdFLElBQU0sVUFBVSxHQUNaLEtBQUssQ0FBQyxZQUFZLEVBQUUsYUFBYSxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO3dCQUV4RSxNQUFNLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFDM0MsTUFBTSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBRTNDLFVBQVUsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQzt3QkFDckMsTUFBTSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQzNDLE1BQU0sQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUMzQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBRTVDLFVBQVUsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQzt3QkFDckMsTUFBTSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQzNDLE1BQU0sQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUMzQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzlDLENBQUMsQ0FBQyxDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVQLEVBQUUsQ0FBQyxtREFBbUQsRUFBRSxlQUFLLENBQUM7Z0JBR3pEO29CQUZBO3dCQUdVLFVBQUssR0FBRyxDQUFDLENBQUM7b0JBRXBCLENBQUM7b0JBREMsZ0NBQVMsR0FBVCxjQUFjLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBRnpCLFlBQVk7d0JBRmpCLGdCQUFTLENBQ04sRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxvREFBb0QsRUFBQyxDQUFDO3VCQUNoRixZQUFZLENBR2pCO29CQUFELG1CQUFDO2lCQUFBLEFBSEQsSUFHQztnQkFPRDtvQkFBQTtvQkFFQSxDQUFDO29CQURDLGlDQUFhLEdBQWIsY0FBaUIsQ0FBQztvQkFEZCxTQUFTO3dCQUxkLGVBQVEsQ0FBQzs0QkFDUixZQUFZLEVBQUUsQ0FBQyxZQUFZLENBQUM7NEJBQzVCLGVBQWUsRUFBRSxDQUFDLFlBQVksQ0FBQzs0QkFDL0IsT0FBTyxFQUFFLENBQUMsZ0NBQWEsQ0FBQzt5QkFDekIsQ0FBQzt1QkFDSSxTQUFTLENBRWQ7b0JBQUQsZ0JBQUM7aUJBQUEsQUFGRCxJQUVDO2dCQUVELElBQU0sV0FBVyxHQUFHLFVBQUMsY0FBZ0M7b0JBQ2pELE9BQUEsaURBQXNCLENBQUMsY0FBYyxDQUFDLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQztnQkFBakUsQ0FBaUUsQ0FBQztnQkFDdEUsSUFBTSxjQUFjLEdBQUcsd0JBQWUsQ0FBWSxXQUFXLENBQUMsQ0FBQztnQkFDL0QsSUFBTSxTQUFTLEdBQ1gsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztxQkFDbEMsU0FBUyxDQUNOLEtBQUssRUFBRSwyQkFBa0IsQ0FBQyxFQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsZUFBZSxpQkFBQSxFQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVuRixJQUFNLE9BQU8sR0FBRyxtQkFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUNwQyxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUU3QyxVQUFVLENBQUM7b0JBQ1QsVUFBVSxDQUFDO3dCQUNULElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFHLENBQUM7d0JBQ2pELE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUV0QyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7d0JBQ2YsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBRXRDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDZixNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDeEMsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRVAsRUFBRSxDQUFDLHFEQUFxRCxFQUFFLGVBQUssQ0FBQztnQkFDM0QsSUFBTSxJQUFJLEdBQWEsRUFBRSxDQUFDO2dCQUMxQixJQUFJLFNBQW9DLENBQUM7Z0JBVXpDO29CQVJBO3dCQVdXLFVBQUssR0FBRyxLQUFLLENBQUM7b0JBWXpCLENBQUM7b0JBVkMsNENBQXFCLEdBQXJCLGNBQTBCLElBQUksQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzVELHlDQUFrQixHQUFsQixjQUF1QixJQUFJLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN0RCx5Q0FBa0IsR0FBbEIsY0FBdUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdEQsc0NBQWUsR0FBZixjQUFvQixJQUFJLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDaEQsZ0NBQVMsR0FBVCxjQUFjLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNwQyxrQ0FBVyxHQUFYLGNBQWdCLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN4QyxrQ0FBVyxHQUFYLGNBQWdCLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN4QywrQkFBUSxHQUFSLGNBQWEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBRTFCLDBCQUFHLEdBQVgsVUFBWSxJQUFZLElBQUksSUFBSSxDQUFDLElBQUksQ0FBSSxJQUFJLFNBQUksSUFBSSxDQUFDLEtBQUssTUFBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQVh6RDt3QkFBUixZQUFLLEVBQUU7OytEQUFlO29CQUhuQixZQUFZO3dCQVJqQixnQkFBUyxDQUFDOzRCQUNULFFBQVEsRUFBRSxLQUFLOzRCQUNmLFFBQVEsRUFBRSxtSkFJVDt5QkFDRixDQUFDO3VCQUNJLFlBQVksQ0FlakI7b0JBQUQsbUJBQUM7aUJBQUEsQUFmRCxJQWVDO2dCQU9EO29CQUFBO29CQUVBLENBQUM7b0JBREMsaUNBQWEsR0FBYixjQUFpQixDQUFDO29CQURkLFNBQVM7d0JBTGQsZUFBUSxDQUFDOzRCQUNSLFlBQVksRUFBRSxDQUFDLFlBQVksQ0FBQzs0QkFDNUIsZUFBZSxFQUFFLENBQUMsWUFBWSxDQUFDOzRCQUMvQixPQUFPLEVBQUUsQ0FBQyxnQ0FBYSxDQUFDO3lCQUN6QixDQUFDO3VCQUNJLFNBQVMsQ0FFZDtvQkFBRCxnQkFBQztpQkFBQSxBQUZELElBRUM7Z0JBRUQsSUFBTSxXQUFXLEdBQUcsVUFBQyxjQUFnQztvQkFDakQsT0FBQSxpREFBc0IsQ0FBQyxjQUFjLENBQUMsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDO2dCQUFqRSxDQUFpRSxDQUFDO2dCQUN0RSxJQUFNLGNBQWMsR0FBRyx3QkFBZSxDQUFZLFdBQVcsQ0FBQyxDQUFDO2dCQUMvRCxJQUFNLFNBQVMsR0FDWCxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO3FCQUNsQyxTQUFTLENBQUMsS0FBSyxFQUFFLDJCQUFrQixDQUFDLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxlQUFlLGlCQUFBLEVBQUMsQ0FBQyxDQUFDO3FCQUNoRixHQUFHLENBQUMsVUFBQyxVQUFxQztvQkFDekMsU0FBUyxHQUFHLFVBQVUsQ0FBQztvQkFDdkIsU0FBUyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7Z0JBQzFCLENBQUMsQ0FBQyxDQUFDO2dCQUVYLElBQU0sT0FBTyxHQUNULG1CQUFJLENBQUMsb0VBQW9FLENBQUMsQ0FBQztnQkFDL0UsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFFN0MsVUFBVSxDQUFDO29CQUNULFVBQVUsQ0FBQzt3QkFDVCxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBRyxDQUFDO3dCQUVqRCxvQkFBb0I7d0JBQ3BCLE1BQU0sQ0FBQyx3QkFBUyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQzt3QkFDM0QsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU87NEJBQ2xCLCtFQUErRTs0QkFDL0UsZ0JBQWdCOzRCQUNoQixnRkFBZ0Y7NEJBQ2hGLDREQUE0RDs0QkFDNUQsYUFBYTs0QkFDYixjQUFjOzRCQUNkLHVCQUF1Qjs0QkFDdkIsMEJBQTBCOzRCQUMxQixvQkFBb0I7NEJBQ3BCLHVCQUF1QjtpQ0FDcEIsQ0FBQyxlQUFlLENBQUMsQ0FBQzs0QkFDYjtnQ0FDRSxvRUFBb0U7Z0NBQ3BFLFlBQVk7Z0NBQ1osY0FBYztnQ0FDZCwwQkFBMEI7Z0NBQzFCLHVCQUF1Qjs2QkFDeEIsQ0FBQyxDQUFDOzRCQUNILEVBQUUsQ0FBQzs0QkFDWCx3RUFBd0U7NEJBQ3hFLGNBQWM7NEJBQ2QsMEJBQTBCOzRCQUMxQix1QkFBdUI7MkJBQ3ZCLENBQUM7d0JBQ0gsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7d0JBRWhCLG1DQUFtQzt3QkFDbkMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQzt3QkFDbEMsTUFBTSxDQUFDLHdCQUFTLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO3dCQUMzRCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTzs0QkFDbEIsK0VBQStFOzRCQUMvRSxnQkFBZ0I7NEJBQ2hCLHVDQUF1Qzs0QkFDdkMseUVBQXlFOzRCQUN6RSxlQUFlOzRCQUNmLG9FQUFvRTs0QkFDcEUsMEVBQTBFOzRCQUMxRSxlQUFlOzRCQUNmLHdDQUF3Qzs0QkFDeEMsaUVBQWlFOzRCQUNqRSx5RUFBeUU7NEJBQ3pFLGVBQWU7NEJBQ2YsY0FBYzs0QkFDZCwwQkFBMEI7NEJBQzFCLHVCQUF1Qjs0QkFDdkIsY0FBYzs0QkFDZCwwQkFBMEI7NEJBQzFCLHVCQUF1QjtpQ0FDcEIsQ0FBQyxlQUFlLENBQUMsQ0FBQzs0QkFDYjtnQ0FDRSxjQUFjO2dDQUNkLDBCQUEwQjtnQ0FDMUIsdUJBQXVCOzZCQUN4QixDQUFDLENBQUM7NEJBQ0gsRUFBRSxDQUFDLEVBQ1gsQ0FBQzt3QkFDSCxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQzt3QkFFaEIsMkNBQTJDO3dCQUMzQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7d0JBQ3BCLE1BQU0sQ0FBQyx3QkFBUyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQzt3QkFDM0QsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FDaEIsZUFBZSxDQUFDLENBQUM7NEJBQ2I7Z0NBQ0UsZ0VBQWdFO2dDQUNoRSxjQUFjO2dDQUNkLDBCQUEwQjtnQ0FDMUIsdUJBQXVCO2dDQUN2QiwyRUFBMkU7Z0NBQzNFLGNBQWM7Z0NBQ2QsMEJBQTBCO2dDQUMxQix1QkFBdUI7NkJBQ3hCLENBQUMsQ0FBQzs0QkFDSCxFQUFFLENBQUMsQ0FBQzt3QkFDWixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQzt3QkFFaEIsc0RBQXNEO3dCQUN0RCxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7d0JBQ2YsTUFBTSxDQUFDLHdCQUFTLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO3dCQUMzRCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDOzRCQUNuQixjQUFjOzRCQUNkLDBCQUEwQjs0QkFDMUIsdUJBQXVCO3lCQUN4QixDQUFDLENBQUM7d0JBQ0gsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7d0JBRWhCLHlCQUF5Qjt3QkFDekIsU0FBUyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO3dCQUNuQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDOzRCQUNuQixnQkFBZ0I7eUJBQ2pCLENBQUMsQ0FBQzt3QkFDSCxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztvQkFDbEIsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRVAsRUFBRSxDQUFDLGdFQUFnRSxFQUFFLGVBQUssQ0FBQztnQkFDdEUsSUFBSSxZQUEwQixDQUFDO2dCQUcvQjtvQkFDRSxzQkFBbUIsTUFBc0I7d0JBQXRCLFdBQU0sR0FBTixNQUFNLENBQWdCO3dCQUN2QyxZQUFZLEdBQUcsSUFBSSxDQUFDO3dCQUNwQixLQUFLLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQzt3QkFDOUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7b0JBQ2hELENBQUM7b0JBTEcsWUFBWTt3QkFEakIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBQyxDQUFDO3lEQUVkLHFCQUFjO3VCQURyQyxZQUFZLENBTWpCO29CQUFELG1CQUFDO2lCQUFBLEFBTkQsSUFNQztnQkFPRDtvQkFBQTtvQkFFQSxDQUFDO29CQURDLGlDQUFhLEdBQWIsY0FBaUIsQ0FBQztvQkFEZCxTQUFTO3dCQUxkLGVBQVEsQ0FBQzs0QkFDUixZQUFZLEVBQUUsQ0FBQyxZQUFZLENBQUM7NEJBQzVCLGVBQWUsRUFBRSxDQUFDLFlBQVksQ0FBQzs0QkFDL0IsT0FBTyxFQUFFLENBQUMsZ0NBQWEsQ0FBQzt5QkFDekIsQ0FBQzt1QkFDSSxTQUFTLENBRWQ7b0JBQUQsZ0JBQUM7aUJBQUEsQUFGRCxJQUVDO2dCQUVELElBQU0sV0FBVyxHQUFHLFVBQUMsY0FBZ0M7b0JBQ2pELE9BQUEsaURBQXNCLENBQUMsY0FBYyxDQUFDLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQztnQkFBakUsQ0FBaUUsQ0FBQztnQkFDdEUsSUFBTSxjQUFjLEdBQUcsd0JBQWUsQ0FBWSxXQUFXLENBQUMsQ0FBQztnQkFDL0QsSUFBTSxTQUFTLEdBQ1gsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztxQkFDbEMsU0FBUyxDQUNOLEtBQUssRUFBRSwyQkFBa0IsQ0FBQyxFQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsZUFBZSxpQkFBQSxFQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVuRixJQUFNLE9BQU8sR0FBRyxtQkFBSSxDQUFDLDhCQUE4QixDQUFDLENBQUM7Z0JBQ3JELElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQy9ELElBQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsdUJBQVcsQ0FBOEIsQ0FBQztnQkFFM0UsVUFBVSxDQUFDO29CQUNULFVBQVUsQ0FBQzt3QkFDVCxJQUFNLFFBQVEsR0FDVCxZQUFZLENBQUMsTUFBTSxDQUFDLFVBQTBCLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFFL0UsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBRXZDLFVBQVUsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzt3QkFFcEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ3RDLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUN4RSxDQUFDLENBQUMsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFUCxFQUFFLENBQUMseUVBQXlFLEVBQ3pFLG1CQUFTLENBQUM7Z0JBQ1IsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO2dCQUNkLElBQUksY0FBYyxHQUFHLENBQUMsQ0FBQztnQkFJdkI7b0JBR0U7d0JBRlEsVUFBSyxHQUFHLEVBQUUsS0FBSyxDQUFDO3dCQUNoQixjQUFTLEdBQUcsS0FBSyxDQUFDO3dCQUNWLElBQUksQ0FBQyxTQUFTLEdBQUcsYUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO29CQUFDLENBQUM7b0JBSHhELFlBQVk7d0JBRmpCLGdCQUFTLENBQ04sRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxtREFBbUQsRUFBQyxDQUFDOzt1QkFDL0UsWUFBWSxDQUlqQjtvQkFBRCxtQkFBQztpQkFBQSxBQUpELElBSUM7Z0JBT0Q7b0JBQ0UsbUJBQVksUUFBa0I7d0JBQzVCLElBQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUM7d0JBQ2pDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsVUFBUyxLQUFVOzRCQUNoQyxJQUFJLEtBQUssS0FBSyxhQUFNO2dDQUFFLEVBQUUsY0FBYyxDQUFDOzRCQUN2QyxPQUFPLFdBQVcsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO3dCQUNoRCxDQUFDLENBQUM7b0JBQ0osQ0FBQztvQkFDRCxpQ0FBYSxHQUFiLGNBQWlCLENBQUM7b0JBUmQsU0FBUzt3QkFMZCxlQUFRLENBQUM7NEJBQ1IsWUFBWSxFQUFFLENBQUMsWUFBWSxDQUFDOzRCQUM1QixlQUFlLEVBQUUsQ0FBQyxZQUFZLENBQUM7NEJBQy9CLE9BQU8sRUFBRSxDQUFDLGdDQUFhLENBQUM7eUJBQ3pCLENBQUM7eURBRXNCLGVBQVE7dUJBRDFCLFNBQVMsQ0FTZDtvQkFBRCxnQkFBQztpQkFBQSxBQVRELElBU0M7Z0JBRUQsSUFBTSxTQUFTLEdBQUcsK0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEQsSUFBTSxXQUFXLEdBQUcsVUFBQyxjQUFnQztvQkFDakQsT0FBQSxpREFBc0IsQ0FBQyxjQUFjLENBQUMsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDO2dCQUFqRSxDQUFpRSxDQUFDO2dCQUN0RSxJQUFNLGNBQWMsR0FBRyx3QkFBZSxDQUFZLFdBQVcsQ0FBQyxDQUFDO2dCQUMvRCxJQUFNLFNBQVMsR0FDWCxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO3FCQUNsQyxTQUFTLENBQ04sS0FBSyxFQUFFLDJCQUFrQixDQUFDLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxlQUFlLGlCQUFBLEVBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRW5GLElBQU0sT0FBTyxHQUFHLG1CQUFJLENBQUMsd0NBQXdDLENBQUMsQ0FBQztnQkFDL0QsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDL0QsSUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyx1QkFBVyxDQUE4QixDQUFDO2dCQUUzRSxVQUFVLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBQ3BDLGNBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFFLCtEQUErRDtnQkFDL0Qsb0JBQW9CO2dCQUV0QyxJQUFNLFFBQVEsR0FBSSxTQUFTLENBQUMsR0FBRyxDQUFDLDJCQUFlLENBQW1CLENBQUMsUUFBVSxDQUFDO2dCQUM5RSxJQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDO2dCQUNqQyxLQUFLLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7b0JBQUMsY0FBYzt5QkFBZCxVQUFjLEVBQWQscUJBQWMsRUFBZCxJQUFjO3dCQUFkLHlCQUFjOztvQkFDakQsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBTSxDQUFDLENBQUM7b0JBQ2pDLE9BQU8sV0FBVyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQzNDLENBQUMsQ0FBQyxDQUFDO2dCQUVILE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLDhCQUE4QixDQUFDLENBQUM7Z0JBRWpFLFVBQVUsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFDckMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBRXJDLFVBQVUsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDcEMsY0FBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUUsK0NBQStDO2dCQUNqRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO2dCQUVqRSxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDeEIsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVQLEVBQUUsQ0FBQywyRUFBMkUsRUFBRSxlQUFLLENBQUM7Z0JBQ2pGLElBQUksZ0JBQWdCLEdBQWtDLElBQUksQ0FBQztnQkFHM0Q7b0JBQUE7b0JBQ0EsQ0FBQztvQkFESyxZQUFZO3dCQURqQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFDLENBQUM7dUJBQ3JDLFlBQVksQ0FDakI7b0JBQUQsbUJBQUM7aUJBQUEsQUFERCxJQUNDO2dCQU9EO29CQUNFLG1CQUFZLFFBQWtCO3dCQUM1QixnQkFBZ0IsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUEyQixXQUFrQixDQUFDLENBQUM7b0JBQ2hGLENBQUM7b0JBRUQsaUNBQWEsR0FBYixjQUFpQixDQUFDO29CQUxkLFNBQVM7d0JBTGQsZUFBUSxDQUFDOzRCQUNSLFlBQVksRUFBRSxDQUFDLFlBQVksQ0FBQzs0QkFDNUIsZUFBZSxFQUFFLENBQUMsWUFBWSxDQUFDOzRCQUMvQixPQUFPLEVBQUUsQ0FBQyxnQ0FBYSxDQUFDO3lCQUN6QixDQUFDO3lEQUVzQixlQUFRO3VCQUQxQixTQUFTLENBTWQ7b0JBQUQsZ0JBQUM7aUJBQUEsQUFORCxJQU1DO2dCQUVELElBQU0sV0FBVyxHQUFHLFVBQUMsY0FBZ0M7b0JBQ2pELE9BQUEsaURBQXNCLENBQUMsY0FBYyxDQUFDLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQztnQkFBakUsQ0FBaUUsQ0FBQztnQkFDdEUsSUFBTSxjQUFjLEdBQUcsd0JBQWUsQ0FBWSxXQUFXLENBQUMsQ0FBQztnQkFDL0QsSUFBTSxTQUFTLEdBQ1gsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztxQkFDbEMsU0FBUyxDQUNOLEtBQUssRUFBRSwyQkFBa0IsQ0FBQyxFQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsZUFBZSxpQkFBQSxFQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVuRixJQUFNLE9BQU8sR0FBRyxtQkFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUNwQyxJQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBRXRFLDBDQUEwQztnQkFDMUMsVUFBVSxDQUFDLGNBQU0sT0FBQSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBL0MsQ0FBK0MsQ0FBQyxDQUFDO1lBQ3BFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDVCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==