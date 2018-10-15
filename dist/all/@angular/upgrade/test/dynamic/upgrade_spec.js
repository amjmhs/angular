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
var angular = require("@angular/upgrade/src/common/angular1");
var upgrade_adapter_1 = require("@angular/upgrade/src/dynamic/upgrade_adapter");
var test_helpers_1 = require("./test_helpers");
test_helpers_1.withEachNg1Version(function () {
    describe('adapter: ng1 to ng2', function () {
        beforeEach(function () { return core_1.destroyPlatform(); });
        afterEach(function () { return core_1.destroyPlatform(); });
        describe('(basic use)', function () {
            it('should have AngularJS loaded', function () { return expect(angular.version.major).toBe(1); });
            it('should instantiate ng2 in ng1 template and project content', testing_1.async(function () {
                var ng1Module = angular.module('ng1', []);
                var Ng2 = /** @class */ (function () {
                    function Ng2() {
                    }
                    Ng2 = __decorate([
                        core_1.Component({
                            selector: 'ng2',
                            template: "{{ 'NG2' }}(<ng-content></ng-content>)",
                        })
                    ], Ng2);
                    return Ng2;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module = __decorate([
                        core_1.NgModule({ declarations: [Ng2], imports: [platform_browser_1.BrowserModule] })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                var element = test_helpers_1.html('<div>{{ \'ng1[\' }}<ng2>~{{ \'ng-content\' }}~</ng2>{{ \']\' }}</div>');
                var adapter = new upgrade_adapter_1.UpgradeAdapter(Ng2Module);
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(document.body.textContent).toEqual('ng1[NG2(~ng-content~)]');
                    ref.dispose();
                });
            }));
            it('should instantiate ng1 in ng2 template and project content', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                var Ng2 = /** @class */ (function () {
                    function Ng2() {
                    }
                    Ng2 = __decorate([
                        core_1.Component({
                            selector: 'ng2',
                            template: "{{ 'ng2(' }}<ng1>{{'transclude'}}</ng1>{{ ')' }}",
                        })
                    ], Ng2);
                    return Ng2;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [adapter.upgradeNg1Component('ng1'), Ng2],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                ng1Module.directive('ng1', function () {
                    return { transclude: true, template: '{{ "ng1" }}(<ng-transclude></ng-transclude>)' };
                });
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html('<div>{{\'ng1(\'}}<ng2></ng2>{{\')\'}}</div>');
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(document.body.textContent).toEqual('ng1(ng2(ng1(transclude)))');
                    ref.dispose();
                });
            }));
            it('supports the compilerOptions argument', testing_1.async(function () {
                var platformRef = platform_browser_dynamic_1.platformBrowserDynamic();
                spyOn(platformRef, 'bootstrapModule').and.callThrough();
                spyOn(platformRef, 'bootstrapModuleFactory').and.callThrough();
                var ng1Module = angular.module('ng1', []);
                var Ng2 = /** @class */ (function () {
                    function Ng2() {
                    }
                    Ng2 = __decorate([
                        core_1.Component({ selector: 'ng2', template: "{{ 'NG2' }}(<ng-content></ng-content>)" })
                    ], Ng2);
                    return Ng2;
                }());
                var element = test_helpers_1.html('<div>{{ \'ng1[\' }}<ng2>~{{ \'ng-content\' }}~</ng2>{{ \']\' }}</div>');
                var Ng2AppModule = /** @class */ (function () {
                    function Ng2AppModule() {
                    }
                    Ng2AppModule.prototype.ngDoBootstrap = function () { };
                    Ng2AppModule = __decorate([
                        core_1.NgModule({
                            declarations: [Ng2],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2AppModule);
                    return Ng2AppModule;
                }());
                var adapter = new upgrade_adapter_1.UpgradeAdapter(Ng2AppModule, { providers: [] });
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(platformRef.bootstrapModule).toHaveBeenCalledWith(jasmine.any(Function), [
                        { providers: [] }, jasmine.any(Object)
                    ]);
                    expect(platformRef.bootstrapModuleFactory)
                        .toHaveBeenCalledWith(jasmine.any(core_1.NgModuleFactory), { providers: [], ngZone: jasmine.any(core_1.NgZone) });
                    ref.dispose();
                });
            }));
        });
        describe('bootstrap errors', function () {
            var adapter;
            beforeEach(function () {
                angular.module('ng1', []);
                var ng2Component = /** @class */ (function () {
                    function ng2Component() {
                    }
                    ng2Component = __decorate([
                        core_1.Component({
                            selector: 'ng2',
                            template: "<BAD TEMPLATE div></div>",
                        })
                    ], ng2Component);
                    return ng2Component;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [ng2Component],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                adapter = new upgrade_adapter_1.UpgradeAdapter(Ng2Module);
            });
            it('should throw an uncaught error', testing_1.fakeAsync(function () {
                var resolveSpy = jasmine.createSpy('resolveSpy');
                spyOn(console, 'error');
                expect(function () {
                    adapter.bootstrap(test_helpers_1.html('<ng2></ng2>'), ['ng1']).ready(resolveSpy);
                    testing_1.flushMicrotasks();
                }).toThrowError();
                expect(resolveSpy).not.toHaveBeenCalled();
            }));
            it('should output an error message to the console and re-throw', testing_1.fakeAsync(function () {
                var consoleErrorSpy = spyOn(console, 'error');
                expect(function () {
                    adapter.bootstrap(test_helpers_1.html('<ng2></ng2>'), ['ng1']);
                    testing_1.flushMicrotasks();
                }).toThrowError();
                var args = consoleErrorSpy.calls.mostRecent().args;
                expect(consoleErrorSpy).toHaveBeenCalled();
                expect(args.length).toBeGreaterThan(0);
                expect(args[0]).toEqual(jasmine.any(Error));
            }));
        });
        describe('scope/component change-detection', function () {
            it('should interleave scope and component expressions', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                var log = [];
                var l = function (value) {
                    log.push(value);
                    return value + ';';
                };
                ng1Module.directive('ng1a', function () { return ({ template: '{{ l(\'ng1a\') }}' }); });
                ng1Module.directive('ng1b', function () { return ({ template: '{{ l(\'ng1b\') }}' }); });
                ng1Module.run(function ($rootScope) {
                    $rootScope.l = l;
                    $rootScope.reset = function () { return log.length = 0; };
                });
                var Ng2 = /** @class */ (function () {
                    function Ng2() {
                        this.l = l;
                    }
                    Ng2 = __decorate([
                        core_1.Component({
                            selector: 'ng2',
                            template: "{{l('2A')}}<ng1a></ng1a>{{l('2B')}}<ng1b></ng1b>{{l('2C')}}"
                        }),
                        __metadata("design:paramtypes", [])
                    ], Ng2);
                    return Ng2;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [adapter.upgradeNg1Component('ng1a'), adapter.upgradeNg1Component('ng1b'), Ng2],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html('<div>{{reset(); l(\'1A\');}}<ng2>{{l(\'1B\')}}</ng2>{{l(\'1C\')}}</div>');
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(document.body.textContent).toEqual('1A;2A;ng1a;2B;ng1b;2C;1C;');
                    // https://github.com/angular/angular.js/issues/12983
                    expect(log).toEqual(['1A', '1C', '2A', '2B', '2C', 'ng1a', 'ng1b']);
                    ref.dispose();
                });
            }));
            it('should propagate changes to a downgraded component inside the ngZone', testing_1.async(function () {
                var appComponent;
                var upgradeRef;
                var AppComponent = /** @class */ (function () {
                    function AppComponent() {
                        appComponent = this;
                    }
                    AppComponent = __decorate([
                        core_1.Component({ selector: 'my-app', template: '<my-child [value]="value"></my-child>' }),
                        __metadata("design:paramtypes", [])
                    ], AppComponent);
                    return AppComponent;
                }());
                var ChildComponent = /** @class */ (function () {
                    function ChildComponent(zone) {
                        this.zone = zone;
                    }
                    Object.defineProperty(ChildComponent.prototype, "value", {
                        set: function (v) { expect(core_1.NgZone.isInAngularZone()).toBe(true); },
                        enumerable: true,
                        configurable: true
                    });
                    ChildComponent.prototype.ngOnChanges = function (changes) {
                        var _this = this;
                        if (changes['value'].isFirstChange())
                            return;
                        this.zone.onMicrotaskEmpty.subscribe(function () {
                            expect(element.textContent).toEqual('5');
                            upgradeRef.dispose();
                        });
                        Promise.resolve().then(function () { return _this.valueFromPromise = changes['value'].currentValue; });
                    };
                    __decorate([
                        core_1.Input(),
                        __metadata("design:type", Number),
                        __metadata("design:paramtypes", [Number])
                    ], ChildComponent.prototype, "value", null);
                    ChildComponent = __decorate([
                        core_1.Component({
                            selector: 'my-child',
                            template: '<div>{{valueFromPromise}}',
                        }),
                        __metadata("design:paramtypes", [core_1.NgZone])
                    ], ChildComponent);
                    return ChildComponent;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module = __decorate([
                        core_1.NgModule({ declarations: [AppComponent, ChildComponent], imports: [platform_browser_1.BrowserModule] })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []).directive('myApp', adapter.downgradeNg2Component(AppComponent));
                var element = test_helpers_1.html('<my-app></my-app>');
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    upgradeRef = ref;
                    appComponent.value = 5;
                });
            }));
            // This test demonstrates https://github.com/angular/angular/issues/6385
            // which was invalidly fixed by https://github.com/angular/angular/pull/6386
            // it('should not trigger $digest from an async operation in a watcher', async(() => {
            //      @Component({selector: 'my-app', template: ''})
            //      class AppComponent {
            //      }
            //      @NgModule({declarations: [AppComponent], imports: [BrowserModule]})
            //      class Ng2Module {
            //      }
            //      const adapter: UpgradeAdapter = new UpgradeAdapter(forwardRef(() => Ng2Module));
            //      const ng1Module = angular.module('ng1', []).directive(
            //          'myApp', adapter.downgradeNg2Component(AppComponent));
            //      const element = html('<my-app></my-app>');
            //      adapter.bootstrap(element, ['ng1']).ready((ref) => {
            //        let doTimeout = false;
            //        let timeoutId: number;
            //        ref.ng1RootScope.$watch(() => {
            //          if (doTimeout && !timeoutId) {
            //            timeoutId = window.setTimeout(function() {
            //              timeoutId = null;
            //            }, 10);
            //          }
            //        });
            //        doTimeout = true;
            //      });
            //    }));
        });
        describe('downgrade ng2 component', function () {
            it('should allow non-element selectors for downgraded components', testing_1.async(function () {
                var WorksComponent = /** @class */ (function () {
                    function WorksComponent() {
                    }
                    WorksComponent = __decorate([
                        core_1.Component({ selector: '[itWorks]', template: 'It works' })
                    ], WorksComponent);
                    return WorksComponent;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module = __decorate([
                        core_1.NgModule({ declarations: [WorksComponent], imports: [platform_browser_1.BrowserModule] })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                ng1Module.directive('ng2', adapter.downgradeNg2Component(WorksComponent));
                var element = test_helpers_1.html('<ng2></ng2>');
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toBe('It works');
                });
            }));
            it('should bind properties, events', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []).value('$exceptionHandler', function (err) { throw err; });
                ng1Module.run(function ($rootScope) {
                    $rootScope.name = 'world';
                    $rootScope.dataA = 'A';
                    $rootScope.dataB = 'B';
                    $rootScope.modelA = 'initModelA';
                    $rootScope.modelB = 'initModelB';
                    $rootScope.eventA = '?';
                    $rootScope.eventB = '?';
                });
                var Ng2 = /** @class */ (function () {
                    function Ng2() {
                        this.ngOnChangesCount = 0;
                        this.ignore = '-';
                        this.literal = '?';
                        this.interpolate = '?';
                        this.oneWayA = '?';
                        this.oneWayB = '?';
                        this.twoWayA = '?';
                        this.twoWayB = '?';
                        this.eventA = new core_1.EventEmitter();
                        this.eventB = new core_1.EventEmitter();
                        this.twoWayAEmitter = new core_1.EventEmitter();
                        this.twoWayBEmitter = new core_1.EventEmitter();
                    }
                    Ng2.prototype.ngOnChanges = function (changes) {
                        var _this = this;
                        var assert = function (prop, value) {
                            if (_this[prop] != value) {
                                throw new Error("Expected: '" + prop + "' to be '" + value + "' but was '" + _this[prop] + "'");
                            }
                        };
                        var assertChange = function (prop, value) {
                            assert(prop, value);
                            if (!changes[prop]) {
                                throw new Error("Changes record for '" + prop + "' not found.");
                            }
                            var actValue = changes[prop].currentValue;
                            if (actValue != value) {
                                throw new Error("Expected changes record for'" + prop + "' to be '" + value + "' but was '" + actValue + "'");
                            }
                        };
                        switch (this.ngOnChangesCount++) {
                            case 0:
                                assert('ignore', '-');
                                assertChange('literal', 'Text');
                                assertChange('interpolate', 'Hello world');
                                assertChange('oneWayA', 'A');
                                assertChange('oneWayB', 'B');
                                assertChange('twoWayA', 'initModelA');
                                assertChange('twoWayB', 'initModelB');
                                this.twoWayAEmitter.emit('newA');
                                this.twoWayBEmitter.emit('newB');
                                this.eventA.emit('aFired');
                                this.eventB.emit('bFired');
                                break;
                            case 1:
                                assertChange('twoWayA', 'newA');
                                assertChange('twoWayB', 'newB');
                                break;
                            case 2:
                                assertChange('interpolate', 'Hello everyone');
                                break;
                            default:
                                throw new Error('Called too many times! ' + JSON.stringify(changes));
                        }
                    };
                    Ng2 = __decorate([
                        core_1.Component({
                            selector: 'ng2',
                            inputs: ['literal', 'interpolate', 'oneWayA', 'oneWayB', 'twoWayA', 'twoWayB'],
                            outputs: [
                                'eventA', 'eventB', 'twoWayAEmitter: twoWayAChange', 'twoWayBEmitter: twoWayBChange'
                            ],
                            template: 'ignore: {{ignore}}; ' +
                                'literal: {{literal}}; interpolate: {{interpolate}}; ' +
                                'oneWayA: {{oneWayA}}; oneWayB: {{oneWayB}}; ' +
                                'twoWayA: {{twoWayA}}; twoWayB: {{twoWayB}}; ({{ngOnChangesCount}})'
                        })
                    ], Ng2);
                    return Ng2;
                }());
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng2],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                var element = test_helpers_1.html("<div>\n              <ng2 literal=\"Text\" interpolate=\"Hello {{name}}\"\n                   bind-one-way-a=\"dataA\" [one-way-b]=\"dataB\"\n                   bindon-two-way-a=\"modelA\" [(two-way-b)]=\"modelB\"\n                   on-event-a='eventA=$event' (event-b)=\"eventB=$event\"></ng2>\n              | modelA: {{modelA}}; modelB: {{modelB}}; eventA: {{eventA}}; eventB: {{eventB}};\n              </div>");
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(test_helpers_1.multiTrim(document.body.textContent))
                        .toEqual('ignore: -; ' +
                        'literal: Text; interpolate: Hello world; ' +
                        'oneWayA: A; oneWayB: B; twoWayA: newA; twoWayB: newB; (2) | ' +
                        'modelA: newA; modelB: newB; eventA: aFired; eventB: bFired;');
                    ref.ng1RootScope.$apply('name = "everyone"');
                    expect(test_helpers_1.multiTrim(document.body.textContent))
                        .toEqual('ignore: -; ' +
                        'literal: Text; interpolate: Hello everyone; ' +
                        'oneWayA: A; oneWayB: B; twoWayA: newA; twoWayB: newB; (3) | ' +
                        'modelA: newA; modelB: newB; eventA: aFired; eventB: bFired;');
                    ref.dispose();
                });
            }));
            it('should support two-way binding and event listener', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var listenerSpy = jasmine.createSpy('$rootScope.listener');
                var ng1Module = angular.module('ng1', []).run(function ($rootScope) {
                    $rootScope['value'] = 'world';
                    $rootScope['listener'] = listenerSpy;
                });
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component() {
                        this.ngOnChangesCount = 0;
                        this.model = '?';
                        this.modelChange = new core_1.EventEmitter();
                    }
                    Ng2Component.prototype.ngOnChanges = function (changes) {
                        switch (this.ngOnChangesCount++) {
                            case 0:
                                expect(changes.model.currentValue).toBe('world');
                                this.modelChange.emit('newC');
                                break;
                            case 1:
                                expect(changes.model.currentValue).toBe('newC');
                                break;
                            default:
                                throw new Error('Called too many times! ' + JSON.stringify(changes));
                        }
                    };
                    __decorate([
                        core_1.Input(),
                        __metadata("design:type", Object)
                    ], Ng2Component.prototype, "model", void 0);
                    __decorate([
                        core_1.Output(),
                        __metadata("design:type", Object)
                    ], Ng2Component.prototype, "modelChange", void 0);
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: "model: {{model}};" })
                    ], Ng2Component);
                    return Ng2Component;
                }());
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({ declarations: [Ng2Component], imports: [platform_browser_1.BrowserModule] })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                var element = test_helpers_1.html("\n           <div>\n             <ng2 [(model)]=\"value\" (model-change)=\"listener($event)\"></ng2>\n             | value: {{value}}\n           </div>\n         ");
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(test_helpers_1.multiTrim(element.textContent)).toEqual('model: newC; | value: newC');
                    expect(listenerSpy).toHaveBeenCalledWith('newC');
                    ref.dispose();
                });
            }));
            it('should initialize inputs in time for `ngOnChanges`', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component() {
                        this.ngOnChangesCount = 0;
                        this.firstChangesCount = 0;
                    }
                    Ng2Component.prototype.ngOnChanges = function (changes) {
                        this.ngOnChangesCount++;
                        if (this.ngOnChangesCount === 1) {
                            this.initialValue = this.foo;
                        }
                        if (changes['foo'] && changes['foo'].isFirstChange()) {
                            this.firstChangesCount++;
                        }
                    };
                    __decorate([
                        core_1.Input(),
                        __metadata("design:type", String)
                    ], Ng2Component.prototype, "foo", void 0);
                    Ng2Component = __decorate([
                        core_1.Component({
                            selector: 'ng2',
                            template: "\n               ngOnChangesCount: {{ ngOnChangesCount }} |\n               firstChangesCount: {{ firstChangesCount }} |\n               initialValue: {{ initialValue }}"
                        })
                    ], Ng2Component);
                    return Ng2Component;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module = __decorate([
                        core_1.NgModule({ imports: [platform_browser_1.BrowserModule], declarations: [Ng2Component] })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                var ng1Module = angular.module('ng1', []).directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                var element = test_helpers_1.html("\n             <ng2 [foo]=\"'foo'\"></ng2>\n             <ng2 foo=\"bar\"></ng2>\n             <ng2 [foo]=\"'baz'\" ng-if=\"true\"></ng2>\n             <ng2 foo=\"qux\" ng-if=\"true\"></ng2>\n           ");
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    var nodes = element.querySelectorAll('ng2');
                    var expectedTextWith = function (value) {
                        return "ngOnChangesCount: 1 | firstChangesCount: 1 | initialValue: " + value;
                    };
                    expect(test_helpers_1.multiTrim(nodes[0].textContent)).toBe(expectedTextWith('foo'));
                    expect(test_helpers_1.multiTrim(nodes[1].textContent)).toBe(expectedTextWith('bar'));
                    expect(test_helpers_1.multiTrim(nodes[2].textContent)).toBe(expectedTextWith('baz'));
                    expect(test_helpers_1.multiTrim(nodes[3].textContent)).toBe(expectedTextWith('qux'));
                    ref.dispose();
                });
            }));
            it('should bind to ng-model', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                ng1Module.run(function ($rootScope /** TODO #9100 */) { $rootScope.modelA = 'A'; });
                var ng2Instance;
                var Ng2 = /** @class */ (function () {
                    function Ng2() {
                        this._value = '';
                        this._onChangeCallback = function () { };
                        this._onTouchedCallback = function () { };
                        ng2Instance = this;
                    }
                    Ng2.prototype.writeValue = function (value) { this._value = value; };
                    Ng2.prototype.registerOnChange = function (fn) { this._onChangeCallback = fn; };
                    Ng2.prototype.registerOnTouched = function (fn) { this._onTouchedCallback = fn; };
                    Ng2.prototype.doTouch = function () { this._onTouchedCallback(); };
                    Ng2.prototype.doChange = function (newValue) {
                        this._value = newValue;
                        this._onChangeCallback(newValue);
                    };
                    Ng2 = __decorate([
                        core_1.Component({ selector: 'ng2', template: '{{_value}}' }),
                        __metadata("design:paramtypes", [])
                    ], Ng2);
                    return Ng2;
                }());
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html("<div><ng2 ng-model=\"modelA\"></ng2> | {{modelA}}</div>");
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng2],
                            imports: [platform_browser_1.BrowserModule],
                            schemas: [core_1.NO_ERRORS_SCHEMA],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    var $rootScope = ref.ng1RootScope;
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toEqual('A | A');
                    $rootScope.modelA = 'B';
                    $rootScope.$apply();
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toEqual('B | B');
                    ng2Instance.doChange('C');
                    expect($rootScope.modelA).toBe('C');
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toEqual('C | C');
                    var downgradedElement = document.body.querySelector('ng2');
                    expect(downgradedElement.classList.contains('ng-touched')).toBe(false);
                    ng2Instance.doTouch();
                    $rootScope.$apply();
                    expect(downgradedElement.classList.contains('ng-touched')).toBe(true);
                    ref.dispose();
                });
            }));
            it('should properly run cleanup when ng1 directive is destroyed', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                var onDestroyed = new core_1.EventEmitter();
                ng1Module.directive('ng1', function () {
                    return {
                        template: '<div ng-if="!destroyIt"><ng2></ng2></div>',
                        controller: function ($rootScope, $timeout) {
                            $timeout(function () { $rootScope.destroyIt = true; });
                        }
                    };
                });
                var Ng2 = /** @class */ (function () {
                    function Ng2() {
                    }
                    Ng2.prototype.ngOnDestroy = function () { onDestroyed.emit('destroyed'); };
                    Ng2 = __decorate([
                        core_1.Component({ selector: 'ng2', template: 'test' })
                    ], Ng2);
                    return Ng2;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng2],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html('<ng1></ng1>');
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    onDestroyed.subscribe(function () { ref.dispose(); });
                });
            }));
            it('should properly run cleanup with multiple levels of nesting', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var destroyed = false;
                var Ng2OuterComponent = /** @class */ (function () {
                    function Ng2OuterComponent() {
                        this.destroyIt = false;
                    }
                    __decorate([
                        core_1.Input(),
                        __metadata("design:type", Object)
                    ], Ng2OuterComponent.prototype, "destroyIt", void 0);
                    Ng2OuterComponent = __decorate([
                        core_1.Component({ selector: 'ng2-outer', template: '<div *ngIf="!destroyIt"><ng1></ng1></div>' })
                    ], Ng2OuterComponent);
                    return Ng2OuterComponent;
                }());
                var Ng2InnerComponent = /** @class */ (function () {
                    function Ng2InnerComponent() {
                    }
                    Ng2InnerComponent.prototype.ngOnDestroy = function () { destroyed = true; };
                    Ng2InnerComponent = __decorate([
                        core_1.Component({ selector: 'ng2-inner', template: 'test' })
                    ], Ng2InnerComponent);
                    return Ng2InnerComponent;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            imports: [platform_browser_1.BrowserModule],
                            declarations: [Ng2InnerComponent, Ng2OuterComponent, adapter.upgradeNg1Component('ng1')],
                            schemas: [core_1.NO_ERRORS_SCHEMA],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                var ng1Module = angular.module('ng1', [])
                    .directive('ng1', function () { return ({ template: '<ng2-inner></ng2-inner>' }); })
                    .directive('ng2Inner', adapter.downgradeNg2Component(Ng2InnerComponent))
                    .directive('ng2Outer', adapter.downgradeNg2Component(Ng2OuterComponent));
                var element = test_helpers_1.html('<ng2-outer [destroy-it]="destroyIt"></ng2-outer>');
                adapter.bootstrap(element, [ng1Module.name]).ready(function (ref) {
                    expect(element.textContent).toBe('test');
                    expect(destroyed).toBe(false);
                    test_helpers_1.$apply(ref, 'destroyIt = true');
                    expect(element.textContent).toBe('');
                    expect(destroyed).toBe(true);
                });
            }));
            it('should fallback to the root ng2.injector when compiled outside the dom', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                ng1Module.directive('ng1', [
                    '$compile',
                    function ($compile) {
                        return {
                            link: function ($scope, $element, $attrs) {
                                var compiled = $compile('<ng2></ng2>');
                                var template = compiled($scope);
                                $element.append(template);
                            }
                        };
                    }
                ]);
                var Ng2 = /** @class */ (function () {
                    function Ng2() {
                    }
                    Ng2 = __decorate([
                        core_1.Component({ selector: 'ng2', template: 'test' })
                    ], Ng2);
                    return Ng2;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng2],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html('<ng1></ng1>');
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toEqual('test');
                    ref.dispose();
                });
            }));
            it('should support multi-slot projection', testing_1.async(function () {
                var ng1Module = angular.module('ng1', []);
                var Ng2 = /** @class */ (function () {
                    function Ng2() {
                    }
                    Ng2 = __decorate([
                        core_1.Component({
                            selector: 'ng2',
                            template: '2a(<ng-content select=".ng1a"></ng-content>)' +
                                '2b(<ng-content select=".ng1b"></ng-content>)'
                        })
                    ], Ng2);
                    return Ng2;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module = __decorate([
                        core_1.NgModule({ declarations: [Ng2], imports: [platform_browser_1.BrowserModule] })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // The ng-if on one of the projected children is here to make sure
                // the correct slot is targeted even with structural directives in play.
                var element = test_helpers_1.html('<ng2><div ng-if="true" class="ng1a">1a</div><div' +
                    ' class="ng1b">1b</div></ng2>');
                var adapter = new upgrade_adapter_1.UpgradeAdapter(Ng2Module);
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(document.body.textContent).toEqual('2a(1a)2b(1b)');
                    ref.dispose();
                });
            }));
            it('should correctly project structural directives', testing_1.async(function () {
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component() {
                    }
                    __decorate([
                        core_1.Input(),
                        __metadata("design:type", String)
                    ], Ng2Component.prototype, "itemId", void 0);
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: 'ng2-{{ itemId }}(<ng-content></ng-content>)' })
                    ], Ng2Component);
                    return Ng2Component;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module = __decorate([
                        core_1.NgModule({ imports: [platform_browser_1.BrowserModule], declarations: [Ng2Component] })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                var adapter = new upgrade_adapter_1.UpgradeAdapter(Ng2Module);
                var ng1Module = angular.module('ng1', [])
                    .directive('ng2', adapter.downgradeNg2Component(Ng2Component))
                    .run(function ($rootScope) {
                    $rootScope['items'] = [
                        { id: 'a', subitems: [1, 2, 3] }, { id: 'b', subitems: [4, 5, 6] },
                        { id: 'c', subitems: [7, 8, 9] }
                    ];
                });
                var element = test_helpers_1.html("\n             <ng2 ng-repeat=\"item in items\" [item-id]=\"item.id\">\n               <div ng-repeat=\"subitem in item.subitems\">{{ subitem }}</div>\n             </ng2>\n           ");
                adapter.bootstrap(element, [ng1Module.name]).ready(function (ref) {
                    expect(test_helpers_1.multiTrim(document.body.textContent))
                        .toBe('ng2-a( 123 )ng2-b( 456 )ng2-c( 789 )');
                    ref.dispose();
                });
            }));
            it('should allow attribute selectors for components in ng2', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return MyNg2Module; }));
                var ng1Module = angular.module('myExample', []);
                var WorksComponent = /** @class */ (function () {
                    function WorksComponent() {
                    }
                    WorksComponent = __decorate([
                        core_1.Component({ selector: '[works]', template: 'works!' })
                    ], WorksComponent);
                    return WorksComponent;
                }());
                var RootComponent = /** @class */ (function () {
                    function RootComponent() {
                    }
                    RootComponent = __decorate([
                        core_1.Component({ selector: 'root-component', template: 'It <div works></div>' })
                    ], RootComponent);
                    return RootComponent;
                }());
                var MyNg2Module = /** @class */ (function () {
                    function MyNg2Module() {
                    }
                    MyNg2Module = __decorate([
                        core_1.NgModule({ imports: [platform_browser_1.BrowserModule], declarations: [RootComponent, WorksComponent] })
                    ], MyNg2Module);
                    return MyNg2Module;
                }());
                ng1Module.directive('rootComponent', adapter.downgradeNg2Component(RootComponent));
                document.body.innerHTML = '<root-component></root-component>';
                adapter.bootstrap(document.body.firstElementChild, ['myExample']).ready(function (ref) {
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toEqual('It works!');
                    ref.dispose();
                });
            }));
        });
        describe('upgrade ng1 component', function () {
            it('should support `@` bindings', testing_1.fakeAsync(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng2ComponentInstance;
                // Define `ng1Component`
                var ng1Component = {
                    template: 'Inside: {{ $ctrl.inputA }}, {{ $ctrl.inputB }}',
                    bindings: { inputA: '@inputAttrA', inputB: '@' }
                };
                // Define `Ng2Component`
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component() {
                        this.dataA = 'foo';
                        this.dataB = 'bar';
                        ng2ComponentInstance = this;
                    }
                    Ng2Component = __decorate([
                        core_1.Component({
                            selector: 'ng2',
                            template: "\n               <ng1 inputAttrA=\"{{ dataA }}\" inputB=\"{{ dataB }}\"></ng1>\n               | Outside: {{ dataA }}, {{ dataB }}\n             "
                        }),
                        __metadata("design:paramtypes", [])
                    ], Ng2Component);
                    return Ng2Component;
                }());
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [adapter.upgradeNg1Component('ng1'), Ng2Component],
                            imports: [platform_browser_1.BrowserModule]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                adapter.bootstrap(element, ['ng1Module']).ready(function (ref) {
                    var ng1 = element.querySelector('ng1');
                    var ng1Controller = angular.element(ng1).controller('ng1');
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Inside: foo, bar | Outside: foo, bar');
                    ng1Controller.inputA = 'baz';
                    ng1Controller.inputB = 'qux';
                    test_helpers_1.$digest(ref);
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Inside: baz, qux | Outside: foo, bar');
                    ng2ComponentInstance.dataA = 'foo2';
                    ng2ComponentInstance.dataB = 'bar2';
                    test_helpers_1.$digest(ref);
                    expect(test_helpers_1.multiTrim(element.textContent))
                        .toBe('Inside: foo2, bar2 | Outside: foo2, bar2');
                    ref.dispose();
                });
            }));
            it('should support `<` bindings', testing_1.fakeAsync(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng2ComponentInstance;
                // Define `ng1Component`
                var ng1Component = {
                    template: 'Inside: {{ $ctrl.inputA.value }}, {{ $ctrl.inputB.value }}',
                    bindings: { inputA: '<inputAttrA', inputB: '<' }
                };
                // Define `Ng2Component`
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component() {
                        this.dataA = { value: 'foo' };
                        this.dataB = { value: 'bar' };
                        ng2ComponentInstance = this;
                    }
                    Ng2Component = __decorate([
                        core_1.Component({
                            selector: 'ng2',
                            template: "\n               <ng1 [inputAttrA]=\"dataA\" [inputB]=\"dataB\"></ng1>\n               | Outside: {{ dataA.value }}, {{ dataB.value }}\n             "
                        }),
                        __metadata("design:paramtypes", [])
                    ], Ng2Component);
                    return Ng2Component;
                }());
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [adapter.upgradeNg1Component('ng1'), Ng2Component],
                            imports: [platform_browser_1.BrowserModule]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                adapter.bootstrap(element, ['ng1Module']).ready(function (ref) {
                    var ng1 = element.querySelector('ng1');
                    var ng1Controller = angular.element(ng1).controller('ng1');
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Inside: foo, bar | Outside: foo, bar');
                    ng1Controller.inputA = { value: 'baz' };
                    ng1Controller.inputB = { value: 'qux' };
                    test_helpers_1.$digest(ref);
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Inside: baz, qux | Outside: foo, bar');
                    ng2ComponentInstance.dataA = { value: 'foo2' };
                    ng2ComponentInstance.dataB = { value: 'bar2' };
                    test_helpers_1.$digest(ref);
                    expect(test_helpers_1.multiTrim(element.textContent))
                        .toBe('Inside: foo2, bar2 | Outside: foo2, bar2');
                    ref.dispose();
                });
            }));
            it('should support `=` bindings', testing_1.fakeAsync(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng2ComponentInstance;
                // Define `ng1Component`
                var ng1Component = {
                    template: 'Inside: {{ $ctrl.inputA.value }}, {{ $ctrl.inputB.value }}',
                    bindings: { inputA: '=inputAttrA', inputB: '=' }
                };
                // Define `Ng2Component`
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component() {
                        this.dataA = { value: 'foo' };
                        this.dataB = { value: 'bar' };
                        ng2ComponentInstance = this;
                    }
                    Ng2Component = __decorate([
                        core_1.Component({
                            selector: 'ng2',
                            template: "\n               <ng1 [(inputAttrA)]=\"dataA\" [(inputB)]=\"dataB\"></ng1>\n               | Outside: {{ dataA.value }}, {{ dataB.value }}\n             "
                        }),
                        __metadata("design:paramtypes", [])
                    ], Ng2Component);
                    return Ng2Component;
                }());
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [adapter.upgradeNg1Component('ng1'), Ng2Component],
                            imports: [platform_browser_1.BrowserModule]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                adapter.bootstrap(element, ['ng1Module']).ready(function (ref) {
                    var ng1 = element.querySelector('ng1');
                    var ng1Controller = angular.element(ng1).controller('ng1');
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Inside: foo, bar | Outside: foo, bar');
                    ng1Controller.inputA = { value: 'baz' };
                    ng1Controller.inputB = { value: 'qux' };
                    test_helpers_1.$digest(ref);
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Inside: baz, qux | Outside: baz, qux');
                    ng2ComponentInstance.dataA = { value: 'foo2' };
                    ng2ComponentInstance.dataB = { value: 'bar2' };
                    test_helpers_1.$digest(ref);
                    expect(test_helpers_1.multiTrim(element.textContent))
                        .toBe('Inside: foo2, bar2 | Outside: foo2, bar2');
                    ref.dispose();
                });
            }));
            it('should support `&` bindings', testing_1.fakeAsync(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                // Define `ng1Component`
                var ng1Component = {
                    template: 'Inside: -',
                    bindings: { outputA: '&outputAttrA', outputB: '&' }
                };
                // Define `Ng2Component`
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component() {
                        this.dataA = 'foo';
                        this.dataB = 'bar';
                    }
                    Ng2Component = __decorate([
                        core_1.Component({
                            selector: 'ng2',
                            template: "\n               <ng1 (outputAttrA)=\"dataA = $event\" (outputB)=\"dataB = $event\"></ng1>\n               | Outside: {{ dataA }}, {{ dataB }}\n             "
                        })
                    ], Ng2Component);
                    return Ng2Component;
                }());
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [adapter.upgradeNg1Component('ng1'), Ng2Component],
                            imports: [platform_browser_1.BrowserModule]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                adapter.bootstrap(element, ['ng1Module']).ready(function (ref) {
                    var ng1 = element.querySelector('ng1');
                    var ng1Controller = angular.element(ng1).controller('ng1');
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Inside: - | Outside: foo, bar');
                    ng1Controller.outputA('baz');
                    ng1Controller.outputB('qux');
                    test_helpers_1.$digest(ref);
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Inside: - | Outside: baz, qux');
                    ref.dispose();
                });
            }));
            it('should bind properties, events', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                var ng1 = function () {
                    return {
                        template: 'Hello {{fullName}}; A: {{modelA}}; B: {{modelB}}; C: {{modelC}}; | ',
                        scope: { fullName: '@', modelA: '=dataA', modelB: '=dataB', modelC: '=', event: '&' },
                        link: function (scope) {
                            scope.$watch('modelB', function (v) {
                                if (v == 'Savkin') {
                                    scope.modelB = 'SAVKIN';
                                    scope.event('WORKS');
                                    // Should not update because [model-a] is uni directional
                                    scope.modelA = 'VICTOR';
                                }
                            });
                        }
                    };
                };
                ng1Module.directive('ng1', ng1);
                var Ng2 = /** @class */ (function () {
                    function Ng2() {
                        this.first = 'Victor';
                        this.last = 'Savkin';
                        this.city = 'SF';
                        this.event = '?';
                    }
                    Ng2 = __decorate([
                        core_1.Component({
                            selector: 'ng2',
                            template: '<ng1 fullName="{{last}}, {{first}}, {{city}}" [dataA]="first" [(dataB)]="last" [modelC]="city" ' +
                                '(event)="event=$event"></ng1>' +
                                '<ng1 fullName="{{\'TEST\'}}" dataA="First" dataB="Last" modelC="City"></ng1>' +
                                '{{event}}-{{last}}, {{first}}, {{city}}'
                        })
                    ], Ng2);
                    return Ng2;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [adapter.upgradeNg1Component('ng1'), Ng2],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html("<div><ng2></ng2></div>");
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    // we need to do setTimeout, because the EventEmitter uses setTimeout to schedule
                    // events, and so without this we would not see the events processed.
                    setTimeout(function () {
                        expect(test_helpers_1.multiTrim(document.body.textContent))
                            .toEqual('Hello SAVKIN, Victor, SF; A: VICTOR; B: SAVKIN; C: SF; | Hello TEST; A: First; B: Last; C: City; | WORKS-SAVKIN, Victor, SF');
                        ref.dispose();
                    }, 0);
                });
            }));
            it('should bind optional properties', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                var ng1 = function () {
                    return {
                        template: 'Hello; A: {{modelA}}; B: {{modelB}}; | ',
                        scope: { modelA: '=?dataA', modelB: '=?' }
                    };
                };
                ng1Module.directive('ng1', ng1);
                var Ng2 = /** @class */ (function () {
                    function Ng2() {
                        this.first = 'Victor';
                        this.last = 'Savkin';
                    }
                    Ng2 = __decorate([
                        core_1.Component({
                            selector: 'ng2',
                            template: '<ng1 [dataA]="first" [modelB]="last"></ng1>' +
                                '<ng1 dataA="First" modelB="Last"></ng1>' +
                                '<ng1></ng1>' +
                                '<ng1></ng1>'
                        })
                    ], Ng2);
                    return Ng2;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [adapter.upgradeNg1Component('ng1'), Ng2],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html("<div><ng2></ng2></div>");
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    // we need to do setTimeout, because the EventEmitter uses setTimeout to schedule
                    // events, and so without this we would not see the events processed.
                    setTimeout(function () {
                        expect(test_helpers_1.multiTrim(document.body.textContent))
                            .toEqual('Hello; A: Victor; B: Savkin; | Hello; A: First; B: Last; | Hello; A: ; B: ; | Hello; A: ; B: ; |');
                        ref.dispose();
                    }, 0);
                });
            }));
            it('should bind properties, events in controller when bindToController is not used', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                var ng1 = function () {
                    return {
                        restrict: 'E',
                        template: '{{someText}} - Length: {{data.length}}',
                        scope: { data: '=' },
                        controller: function ($scope) { $scope.someText = 'ng1 - Data: ' + $scope.data; }
                    };
                };
                ng1Module.directive('ng1', ng1);
                var Ng2 = /** @class */ (function () {
                    function Ng2() {
                        this.dataList = [1, 2, 3];
                        this.someText = 'ng2';
                    }
                    Ng2 = __decorate([
                        core_1.Component({
                            selector: 'ng2',
                            template: '{{someText}} - Length: {{dataList.length}} | <ng1 [(data)]="dataList"></ng1>'
                        })
                    ], Ng2);
                    return Ng2;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [adapter.upgradeNg1Component('ng1'), Ng2],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html("<div><ng2></ng2></div>");
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    // we need to do setTimeout, because the EventEmitter uses setTimeout to schedule
                    // events, and so without this we would not see the events processed.
                    setTimeout(function () {
                        expect(test_helpers_1.multiTrim(document.body.textContent))
                            .toEqual('ng2 - Length: 3 | ng1 - Data: 1,2,3 - Length: 3');
                        ref.dispose();
                    }, 0);
                });
            }));
            it('should bind properties, events in link function', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                var ng1 = function () {
                    return {
                        restrict: 'E',
                        template: '{{someText}} - Length: {{data.length}}',
                        scope: { data: '=' },
                        link: function ($scope) { $scope.someText = 'ng1 - Data: ' + $scope.data; }
                    };
                };
                ng1Module.directive('ng1', ng1);
                var Ng2 = /** @class */ (function () {
                    function Ng2() {
                        this.dataList = [1, 2, 3];
                        this.someText = 'ng2';
                    }
                    Ng2 = __decorate([
                        core_1.Component({
                            selector: 'ng2',
                            template: '{{someText}} - Length: {{dataList.length}} | <ng1 [(data)]="dataList"></ng1>'
                        })
                    ], Ng2);
                    return Ng2;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [adapter.upgradeNg1Component('ng1'), Ng2],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html("<div><ng2></ng2></div>");
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    // we need to do setTimeout, because the EventEmitter uses setTimeout to schedule
                    // events, and so without this we would not see the events processed.
                    setTimeout(function () {
                        expect(test_helpers_1.multiTrim(document.body.textContent))
                            .toEqual('ng2 - Length: 3 | ng1 - Data: 1,2,3 - Length: 3');
                        ref.dispose();
                    }, 0);
                });
            }));
            it('should support templateUrl fetched from $httpBackend', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                ng1Module.value('$httpBackend', function (method, url, post, cbFn) {
                    cbFn(200, method + ":" + url);
                });
                var ng1 = function () { return { templateUrl: 'url.html' }; };
                ng1Module.directive('ng1', ng1);
                var Ng2 = /** @class */ (function () {
                    function Ng2() {
                    }
                    Ng2 = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<ng1></ng1>' })
                    ], Ng2);
                    return Ng2;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [adapter.upgradeNg1Component('ng1'), Ng2],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html("<div><ng2></ng2></div>");
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toEqual('GET:url.html');
                    ref.dispose();
                });
            }));
            it('should support templateUrl as a function', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                ng1Module.value('$httpBackend', function (method, url, post, cbFn) {
                    cbFn(200, method + ":" + url);
                });
                var ng1 = function () { return { templateUrl: function () { return 'url.html'; } }; };
                ng1Module.directive('ng1', ng1);
                var Ng2 = /** @class */ (function () {
                    function Ng2() {
                    }
                    Ng2 = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<ng1></ng1>' })
                    ], Ng2);
                    return Ng2;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [adapter.upgradeNg1Component('ng1'), Ng2],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html("<div><ng2></ng2></div>");
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toEqual('GET:url.html');
                    ref.dispose();
                });
            }));
            it('should support empty template', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                var ng1 = function () { return { template: '' }; };
                ng1Module.directive('ng1', ng1);
                var Ng2 = /** @class */ (function () {
                    function Ng2() {
                    }
                    Ng2 = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<ng1></ng1>' })
                    ], Ng2);
                    return Ng2;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [adapter.upgradeNg1Component('ng1'), Ng2],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html("<div><ng2></ng2></div>");
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toEqual('');
                    ref.dispose();
                });
            }));
            it('should support template as a function', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                var ng1 = function () { return { template: function () { return ''; } }; };
                ng1Module.directive('ng1', ng1);
                var Ng2 = /** @class */ (function () {
                    function Ng2() {
                    }
                    Ng2 = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<ng1></ng1>' })
                    ], Ng2);
                    return Ng2;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [adapter.upgradeNg1Component('ng1'), Ng2],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html("<div><ng2></ng2></div>");
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toEqual('');
                    ref.dispose();
                });
            }));
            it('should support templateUrl fetched from $templateCache', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                ng1Module.run(function ($templateCache) { return $templateCache.put('url.html', 'WORKS'); });
                var ng1 = function () { return { templateUrl: 'url.html' }; };
                ng1Module.directive('ng1', ng1);
                var Ng2 = /** @class */ (function () {
                    function Ng2() {
                    }
                    Ng2 = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<ng1></ng1>' })
                    ], Ng2);
                    return Ng2;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [adapter.upgradeNg1Component('ng1'), Ng2],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html("<div><ng2></ng2></div>");
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toEqual('WORKS');
                    ref.dispose();
                });
            }));
            it('should support controller with controllerAs', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                var ng1 = function () {
                    return {
                        scope: true,
                        template: '{{ctl.scope}}; {{ctl.isClass}}; {{ctl.hasElement}}; {{ctl.isPublished()}}',
                        controllerAs: 'ctl',
                        controller: /** @class */ (function () {
                            function class_1($scope, $element) {
                                this.verifyIAmAClass();
                                this.scope = $scope.$parent.$parent == $scope.$root ? 'scope' : 'wrong-scope';
                                this.hasElement = $element[0].nodeName;
                                this.$element = $element;
                            }
                            class_1.prototype.verifyIAmAClass = function () { this.isClass = 'isClass'; };
                            class_1.prototype.isPublished = function () {
                                return this.$element.controller('ng1') == this ? 'published' : 'not-published';
                            };
                            return class_1;
                        }())
                    };
                };
                ng1Module.directive('ng1', ng1);
                var Ng2 = /** @class */ (function () {
                    function Ng2() {
                    }
                    Ng2 = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<ng1></ng1>' })
                    ], Ng2);
                    return Ng2;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [adapter.upgradeNg1Component('ng1'), Ng2],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html("<div><ng2></ng2></div>");
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toEqual('scope; isClass; NG1; published');
                    ref.dispose();
                });
            }));
            it('should support bindToController', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                var ng1 = function () {
                    return {
                        scope: { title: '@' },
                        bindToController: true,
                        template: '{{ctl.title}}',
                        controllerAs: 'ctl',
                        controller: /** @class */ (function () {
                            function controller() {
                            }
                            return controller;
                        }())
                    };
                };
                ng1Module.directive('ng1', ng1);
                var Ng2 = /** @class */ (function () {
                    function Ng2() {
                    }
                    Ng2 = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<ng1 title="WORKS"></ng1>' })
                    ], Ng2);
                    return Ng2;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [adapter.upgradeNg1Component('ng1'), Ng2],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html("<div><ng2></ng2></div>");
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toEqual('WORKS');
                    ref.dispose();
                });
            }));
            it('should support bindToController with bindings', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                var ng1 = function () {
                    return {
                        scope: {},
                        bindToController: { title: '@' },
                        template: '{{ctl.title}}',
                        controllerAs: 'ctl',
                        controller: /** @class */ (function () {
                            function controller() {
                            }
                            return controller;
                        }())
                    };
                };
                ng1Module.directive('ng1', ng1);
                var Ng2 = /** @class */ (function () {
                    function Ng2() {
                    }
                    Ng2 = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<ng1 title="WORKS"></ng1>' })
                    ], Ng2);
                    return Ng2;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [adapter.upgradeNg1Component('ng1'), Ng2],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html("<div><ng2></ng2></div>");
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toEqual('WORKS');
                    ref.dispose();
                });
            }));
            it('should support single require in linking fn', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                var ng1 = function ($rootScope) {
                    return {
                        scope: { title: '@' },
                        bindToController: true,
                        template: '{{ctl.status}}',
                        require: 'ng1',
                        controllerAs: 'ctrl',
                        controller: /** @class */ (function () {
                            function class_2() {
                                this.status = 'WORKS';
                            }
                            return class_2;
                        }()),
                        link: function (scope, element, attrs, linkController) {
                            expect(scope.$root).toEqual($rootScope);
                            expect(element[0].nodeName).toEqual('NG1');
                            expect(linkController.status).toEqual('WORKS');
                            scope.ctl = linkController;
                        }
                    };
                };
                ng1Module.directive('ng1', ng1);
                var Ng2 = /** @class */ (function () {
                    function Ng2() {
                    }
                    Ng2 = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<ng1></ng1>' })
                    ], Ng2);
                    return Ng2;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [adapter.upgradeNg1Component('ng1'), Ng2],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html("<div><ng2></ng2></div>");
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toEqual('WORKS');
                    ref.dispose();
                });
            }));
            it('should support array require in linking fn', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                var parent = function () { return { controller: /** @class */ (function () {
                        function class_3() {
                            this.parent = 'PARENT';
                        }
                        return class_3;
                    }()) }; };
                var ng1 = function () {
                    return {
                        scope: { title: '@' },
                        bindToController: true,
                        template: '{{parent.parent}}:{{ng1.status}}',
                        require: ['ng1', '^parent', '?^^notFound'],
                        controllerAs: 'ctrl',
                        controller: /** @class */ (function () {
                            function class_4() {
                                this.status = 'WORKS';
                            }
                            return class_4;
                        }()),
                        link: function (scope, element, attrs, linkControllers) {
                            expect(linkControllers[0].status).toEqual('WORKS');
                            expect(linkControllers[1].parent).toEqual('PARENT');
                            expect(linkControllers[2]).toBe(undefined);
                            scope.ng1 = linkControllers[0];
                            scope.parent = linkControllers[1];
                        }
                    };
                };
                ng1Module.directive('parent', parent);
                ng1Module.directive('ng1', ng1);
                var Ng2 = /** @class */ (function () {
                    function Ng2() {
                    }
                    Ng2 = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<ng1></ng1>' })
                    ], Ng2);
                    return Ng2;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [adapter.upgradeNg1Component('ng1'), Ng2],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html("<div><parent><ng2></ng2></parent></div>");
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toEqual('PARENT:WORKS');
                    ref.dispose();
                });
            }));
            describe('with lifecycle hooks', function () {
                it('should call `$onInit()` on controller', testing_1.async(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var $onInitSpyA = jasmine.createSpy('$onInitA');
                    var $onInitSpyB = jasmine.createSpy('$onInitB');
                    var Ng2Component = /** @class */ (function () {
                        function Ng2Component() {
                        }
                        Ng2Component = __decorate([
                            core_1.Component({ selector: 'ng2', template: '<ng1-a></ng1-a> | <ng1-b></ng1-b>' })
                        ], Ng2Component);
                        return Ng2Component;
                    }());
                    angular.module('ng1', [])
                        .directive('ng1A', function () { return ({
                        template: '',
                        scope: {},
                        bindToController: true,
                        controllerAs: '$ctrl',
                        controller: /** @class */ (function () {
                            function controller() {
                            }
                            controller.prototype.$onInit = function () { $onInitSpyA(); };
                            return controller;
                        }())
                    }); })
                        .directive('ng1B', function () { return ({
                        template: '',
                        scope: {},
                        bindToController: false,
                        controllerAs: '$ctrl',
                        controller: function () { this.$onInit = $onInitSpyB; }
                    }); })
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    var Ng2Module = /** @class */ (function () {
                        function Ng2Module() {
                        }
                        Ng2Module = __decorate([
                            core_1.NgModule({
                                declarations: [
                                    adapter.upgradeNg1Component('ng1A'), adapter.upgradeNg1Component('ng1B'),
                                    Ng2Component
                                ],
                                imports: [platform_browser_1.BrowserModule],
                            })
                        ], Ng2Module);
                        return Ng2Module;
                    }());
                    var element = test_helpers_1.html("<div><ng2></ng2></div>");
                    adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                        expect($onInitSpyA).toHaveBeenCalled();
                        expect($onInitSpyB).toHaveBeenCalled();
                        ref.dispose();
                    });
                }));
                it('should not call `$onInit()` on scope', testing_1.async(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var $onInitSpy = jasmine.createSpy('$onInit');
                    var Ng2Component = /** @class */ (function () {
                        function Ng2Component() {
                        }
                        Ng2Component = __decorate([
                            core_1.Component({ selector: 'ng2', template: '<ng1-a></ng1-a> | <ng1-b></ng1-b>' })
                        ], Ng2Component);
                        return Ng2Component;
                    }());
                    angular.module('ng1', [])
                        .directive('ng1A', function () { return ({
                        template: '',
                        scope: {},
                        bindToController: true,
                        controllerAs: '$ctrl',
                        controller: function ($scope) {
                            Object.getPrototypeOf($scope).$onInit = $onInitSpy;
                        }
                    }); })
                        .directive('ng1B', function () { return ({
                        template: '',
                        scope: {},
                        bindToController: false,
                        controllerAs: '$ctrl',
                        controller: function ($scope) {
                            $scope['$onInit'] = $onInitSpy;
                        }
                    }); })
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    var Ng2Module = /** @class */ (function () {
                        function Ng2Module() {
                        }
                        Ng2Module = __decorate([
                            core_1.NgModule({
                                declarations: [
                                    adapter.upgradeNg1Component('ng1A'), adapter.upgradeNg1Component('ng1B'),
                                    Ng2Component
                                ],
                                imports: [platform_browser_1.BrowserModule],
                            })
                        ], Ng2Module);
                        return Ng2Module;
                    }());
                    var element = test_helpers_1.html("<div><ng2></ng2></div>");
                    adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                        expect($onInitSpy).not.toHaveBeenCalled();
                        ref.dispose();
                    });
                }));
                it('should call `$doCheck()` on controller', testing_1.async(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var $doCheckSpyA = jasmine.createSpy('$doCheckA');
                    var $doCheckSpyB = jasmine.createSpy('$doCheckB');
                    var changeDetector;
                    var Ng2Component = /** @class */ (function () {
                        function Ng2Component(cd) {
                            changeDetector = cd;
                        }
                        Ng2Component = __decorate([
                            core_1.Component({ selector: 'ng2', template: '<ng1-a></ng1-a> | <ng1-b></ng1-b>' }),
                            __metadata("design:paramtypes", [core_1.ChangeDetectorRef])
                        ], Ng2Component);
                        return Ng2Component;
                    }());
                    angular.module('ng1', [])
                        .directive('ng1A', function () { return ({
                        template: '',
                        scope: {},
                        bindToController: true,
                        controllerAs: '$ctrl',
                        controller: /** @class */ (function () {
                            function controller() {
                            }
                            controller.prototype.$doCheck = function () { $doCheckSpyA(); };
                            return controller;
                        }())
                    }); })
                        .directive('ng1B', function () { return ({
                        template: '',
                        scope: {},
                        bindToController: false,
                        controllerAs: '$ctrl',
                        controller: function () { this.$doCheck = $doCheckSpyB; }
                    }); })
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    var Ng2Module = /** @class */ (function () {
                        function Ng2Module() {
                        }
                        Ng2Module = __decorate([
                            core_1.NgModule({
                                declarations: [
                                    adapter.upgradeNg1Component('ng1A'), adapter.upgradeNg1Component('ng1B'),
                                    Ng2Component
                                ],
                                imports: [platform_browser_1.BrowserModule],
                            })
                        ], Ng2Module);
                        return Ng2Module;
                    }());
                    var element = test_helpers_1.html("<div><ng2></ng2></div>");
                    adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                        expect($doCheckSpyA).toHaveBeenCalled();
                        expect($doCheckSpyB).toHaveBeenCalled();
                        $doCheckSpyA.calls.reset();
                        $doCheckSpyB.calls.reset();
                        changeDetector.detectChanges();
                        expect($doCheckSpyA).toHaveBeenCalled();
                        expect($doCheckSpyB).toHaveBeenCalled();
                        ref.dispose();
                    });
                }));
                it('should not call `$doCheck()` on scope', testing_1.async(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var $doCheckSpyA = jasmine.createSpy('$doCheckA');
                    var $doCheckSpyB = jasmine.createSpy('$doCheckB');
                    var changeDetector;
                    var Ng2Component = /** @class */ (function () {
                        function Ng2Component(cd) {
                            changeDetector = cd;
                        }
                        Ng2Component = __decorate([
                            core_1.Component({ selector: 'ng2', template: '<ng1-a></ng1-a> | <ng1-b></ng1-b>' }),
                            __metadata("design:paramtypes", [core_1.ChangeDetectorRef])
                        ], Ng2Component);
                        return Ng2Component;
                    }());
                    angular.module('ng1', [])
                        .directive('ng1A', function () { return ({
                        template: '',
                        scope: {},
                        bindToController: true,
                        controllerAs: '$ctrl',
                        controller: function ($scope) {
                            Object.getPrototypeOf($scope).$doCheck = $doCheckSpyA;
                        }
                    }); })
                        .directive('ng1B', function () { return ({
                        template: '',
                        scope: {},
                        bindToController: false,
                        controllerAs: '$ctrl',
                        controller: function ($scope) {
                            $scope['$doCheck'] = $doCheckSpyB;
                        }
                    }); })
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    var Ng2Module = /** @class */ (function () {
                        function Ng2Module() {
                        }
                        Ng2Module = __decorate([
                            core_1.NgModule({
                                declarations: [
                                    adapter.upgradeNg1Component('ng1A'), adapter.upgradeNg1Component('ng1B'),
                                    Ng2Component
                                ],
                                imports: [platform_browser_1.BrowserModule],
                            })
                        ], Ng2Module);
                        return Ng2Module;
                    }());
                    var element = test_helpers_1.html("<div><ng2></ng2></div>");
                    adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                        $doCheckSpyA.calls.reset();
                        $doCheckSpyB.calls.reset();
                        changeDetector.detectChanges();
                        expect($doCheckSpyA).not.toHaveBeenCalled();
                        expect($doCheckSpyB).not.toHaveBeenCalled();
                        ref.dispose();
                    });
                }));
                it('should call `$postLink()` on controller', testing_1.async(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var $postLinkSpyA = jasmine.createSpy('$postLinkA');
                    var $postLinkSpyB = jasmine.createSpy('$postLinkB');
                    var Ng2Component = /** @class */ (function () {
                        function Ng2Component() {
                        }
                        Ng2Component = __decorate([
                            core_1.Component({ selector: 'ng2', template: '<ng1-a></ng1-a> | <ng1-b></ng1-b>' })
                        ], Ng2Component);
                        return Ng2Component;
                    }());
                    angular.module('ng1', [])
                        .directive('ng1A', function () { return ({
                        template: '',
                        scope: {},
                        bindToController: true,
                        controllerAs: '$ctrl',
                        controller: /** @class */ (function () {
                            function controller() {
                            }
                            controller.prototype.$postLink = function () { $postLinkSpyA(); };
                            return controller;
                        }())
                    }); })
                        .directive('ng1B', function () { return ({
                        template: '',
                        scope: {},
                        bindToController: false,
                        controllerAs: '$ctrl',
                        controller: function () { this.$postLink = $postLinkSpyB; }
                    }); })
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    var Ng2Module = /** @class */ (function () {
                        function Ng2Module() {
                        }
                        Ng2Module = __decorate([
                            core_1.NgModule({
                                declarations: [
                                    adapter.upgradeNg1Component('ng1A'), adapter.upgradeNg1Component('ng1B'),
                                    Ng2Component
                                ],
                                imports: [platform_browser_1.BrowserModule],
                            })
                        ], Ng2Module);
                        return Ng2Module;
                    }());
                    var element = test_helpers_1.html("<div><ng2></ng2></div>");
                    adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                        expect($postLinkSpyA).toHaveBeenCalled();
                        expect($postLinkSpyB).toHaveBeenCalled();
                        ref.dispose();
                    });
                }));
                it('should not call `$postLink()` on scope', testing_1.async(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var $postLinkSpy = jasmine.createSpy('$postLink');
                    var Ng2Component = /** @class */ (function () {
                        function Ng2Component() {
                        }
                        Ng2Component = __decorate([
                            core_1.Component({ selector: 'ng2', template: '<ng1-a></ng1-a> | <ng1-b></ng1-b>' })
                        ], Ng2Component);
                        return Ng2Component;
                    }());
                    angular.module('ng1', [])
                        .directive('ng1A', function () { return ({
                        template: '',
                        scope: {},
                        bindToController: true,
                        controllerAs: '$ctrl',
                        controller: function ($scope) {
                            Object.getPrototypeOf($scope).$postLink = $postLinkSpy;
                        }
                    }); })
                        .directive('ng1B', function () { return ({
                        template: '',
                        scope: {},
                        bindToController: false,
                        controllerAs: '$ctrl',
                        controller: function ($scope) {
                            $scope['$postLink'] = $postLinkSpy;
                        }
                    }); })
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    var Ng2Module = /** @class */ (function () {
                        function Ng2Module() {
                        }
                        Ng2Module = __decorate([
                            core_1.NgModule({
                                declarations: [
                                    adapter.upgradeNg1Component('ng1A'), adapter.upgradeNg1Component('ng1B'),
                                    Ng2Component
                                ],
                                imports: [platform_browser_1.BrowserModule],
                            })
                        ], Ng2Module);
                        return Ng2Module;
                    }());
                    var element = test_helpers_1.html("<div><ng2></ng2></div>");
                    adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                        expect($postLinkSpy).not.toHaveBeenCalled();
                        ref.dispose();
                    });
                }));
                it('should call `$onChanges()` on binding destination', testing_1.fakeAsync(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var $onChangesControllerSpyA = jasmine.createSpy('$onChangesControllerA');
                    var $onChangesControllerSpyB = jasmine.createSpy('$onChangesControllerB');
                    var $onChangesScopeSpy = jasmine.createSpy('$onChangesScope');
                    var ng2Instance;
                    var Ng2Component = /** @class */ (function () {
                        function Ng2Component() {
                            ng2Instance = this;
                        }
                        Ng2Component = __decorate([
                            core_1.Component({
                                selector: 'ng2',
                                template: '<ng1-a [valA]="val"></ng1-a> | <ng1-b [valB]="val"></ng1-b>'
                            }),
                            __metadata("design:paramtypes", [])
                        ], Ng2Component);
                        return Ng2Component;
                    }());
                    angular.module('ng1', [])
                        .directive('ng1A', function () { return ({
                        template: '',
                        scope: { valA: '<' },
                        bindToController: true,
                        controllerAs: '$ctrl',
                        controller: function ($scope) {
                            this.$onChanges = $onChangesControllerSpyA;
                        }
                    }); })
                        .directive('ng1B', function () { return ({
                        template: '',
                        scope: { valB: '<' },
                        bindToController: false,
                        controllerAs: '$ctrl',
                        controller: /** @class */ (function () {
                            function class_5() {
                            }
                            class_5.prototype.$onChanges = function (changes) { $onChangesControllerSpyB(changes); };
                            return class_5;
                        }())
                    }); })
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component))
                        .run(function ($rootScope) {
                        Object.getPrototypeOf($rootScope).$onChanges = $onChangesScopeSpy;
                    });
                    var Ng2Module = /** @class */ (function () {
                        function Ng2Module() {
                        }
                        Ng2Module = __decorate([
                            core_1.NgModule({
                                declarations: [
                                    adapter.upgradeNg1Component('ng1A'), adapter.upgradeNg1Component('ng1B'),
                                    Ng2Component
                                ],
                                imports: [platform_browser_1.BrowserModule],
                            })
                        ], Ng2Module);
                        return Ng2Module;
                    }());
                    var element = test_helpers_1.html("<div><ng2></ng2></div>");
                    adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                        // Initial `$onChanges()` call
                        testing_1.tick();
                        expect($onChangesControllerSpyA.calls.count()).toBe(1);
                        expect($onChangesControllerSpyA.calls.argsFor(0)[0]).toEqual({
                            valA: jasmine.any(core_1.SimpleChange)
                        });
                        expect($onChangesControllerSpyB).not.toHaveBeenCalled();
                        expect($onChangesScopeSpy.calls.count()).toBe(1);
                        expect($onChangesScopeSpy.calls.argsFor(0)[0]).toEqual({
                            valB: jasmine.any(core_1.SimpleChange)
                        });
                        $onChangesControllerSpyA.calls.reset();
                        $onChangesControllerSpyB.calls.reset();
                        $onChangesScopeSpy.calls.reset();
                        // `$onChanges()` call after a change
                        ng2Instance.val = 'new value';
                        testing_1.tick();
                        ref.ng1RootScope.$digest();
                        expect($onChangesControllerSpyA.calls.count()).toBe(1);
                        expect($onChangesControllerSpyA.calls.argsFor(0)[0]).toEqual({
                            valA: jasmine.objectContaining({ currentValue: 'new value' })
                        });
                        expect($onChangesControllerSpyB).not.toHaveBeenCalled();
                        expect($onChangesScopeSpy.calls.count()).toBe(1);
                        expect($onChangesScopeSpy.calls.argsFor(0)[0]).toEqual({
                            valB: jasmine.objectContaining({ currentValue: 'new value' })
                        });
                        ref.dispose();
                    });
                }));
                it('should call `$onDestroy()` on controller', testing_1.fakeAsync(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var $onDestroySpyA = jasmine.createSpy('$onDestroyA');
                    var $onDestroySpyB = jasmine.createSpy('$onDestroyB');
                    var ng2ComponentInstance;
                    var Ng2Component = /** @class */ (function () {
                        function Ng2Component() {
                            this.ng2Destroy = false;
                            ng2ComponentInstance = this;
                        }
                        Ng2Component = __decorate([
                            core_1.Component({
                                selector: 'ng2',
                                template: "\n                <div *ngIf=\"!ng2Destroy\">\n                  <ng1-a></ng1-a> | <ng1-b></ng1-b>\n                </div>\n              "
                            }),
                            __metadata("design:paramtypes", [])
                        ], Ng2Component);
                        return Ng2Component;
                    }());
                    // On browsers that don't support `requestAnimationFrame` (IE 9, Android <= 4.3),
                    // `$animate` will use `setTimeout(..., 16.6)` instead. This timeout will still be
                    // on
                    // the queue at the end of the test, causing it to fail.
                    // Mocking animations (via `ngAnimateMock`) avoids the issue.
                    angular.module('ng1', ['ngAnimateMock'])
                        .directive('ng1A', function () { return ({
                        template: '',
                        scope: {},
                        bindToController: true,
                        controllerAs: '$ctrl',
                        controller: /** @class */ (function () {
                            function controller() {
                            }
                            controller.prototype.$onDestroy = function () { $onDestroySpyA(); };
                            return controller;
                        }())
                    }); })
                        .directive('ng1B', function () { return ({
                        template: '',
                        scope: {},
                        bindToController: false,
                        controllerAs: '$ctrl',
                        controller: function () { this.$onDestroy = $onDestroySpyB; }
                    }); })
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    var Ng2Module = /** @class */ (function () {
                        function Ng2Module() {
                        }
                        Ng2Module = __decorate([
                            core_1.NgModule({
                                declarations: [
                                    adapter.upgradeNg1Component('ng1A'), adapter.upgradeNg1Component('ng1B'),
                                    Ng2Component
                                ],
                                imports: [platform_browser_1.BrowserModule],
                            })
                        ], Ng2Module);
                        return Ng2Module;
                    }());
                    var element = test_helpers_1.html("<div ng-if=\"!ng1Destroy\"><ng2></ng2></div>");
                    adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                        var $rootScope = ref.ng1RootScope;
                        $rootScope.ng1Destroy = false;
                        testing_1.tick();
                        $rootScope.$digest();
                        expect($onDestroySpyA).not.toHaveBeenCalled();
                        expect($onDestroySpyB).not.toHaveBeenCalled();
                        $rootScope.ng1Destroy = true;
                        testing_1.tick();
                        $rootScope.$digest();
                        expect($onDestroySpyA).toHaveBeenCalled();
                        expect($onDestroySpyB).toHaveBeenCalled();
                        $onDestroySpyA.calls.reset();
                        $onDestroySpyB.calls.reset();
                        $rootScope.ng1Destroy = false;
                        testing_1.tick();
                        $rootScope.$digest();
                        expect($onDestroySpyA).not.toHaveBeenCalled();
                        expect($onDestroySpyB).not.toHaveBeenCalled();
                        ng2ComponentInstance.ng2Destroy = true;
                        testing_1.tick();
                        $rootScope.$digest();
                        expect($onDestroySpyA).toHaveBeenCalled();
                        expect($onDestroySpyB).toHaveBeenCalled();
                        ref.dispose();
                    });
                }));
                it('should not call `$onDestroy()` on scope', testing_1.fakeAsync(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var $onDestroySpy = jasmine.createSpy('$onDestroy');
                    var ng2ComponentInstance;
                    var Ng2Component = /** @class */ (function () {
                        function Ng2Component() {
                            this.ng2Destroy = false;
                            ng2ComponentInstance = this;
                        }
                        Ng2Component = __decorate([
                            core_1.Component({
                                selector: 'ng2',
                                template: "\n                <div *ngIf=\"!ng2Destroy\">\n                  <ng1-a></ng1-a> | <ng1-b></ng1-b>\n                </div>\n              "
                            }),
                            __metadata("design:paramtypes", [])
                        ], Ng2Component);
                        return Ng2Component;
                    }());
                    // On browsers that don't support `requestAnimationFrame` (IE 9, Android <= 4.3),
                    // `$animate` will use `setTimeout(..., 16.6)` instead. This timeout will still be
                    // on
                    // the queue at the end of the test, causing it to fail.
                    // Mocking animations (via `ngAnimateMock`) avoids the issue.
                    angular.module('ng1', ['ngAnimateMock'])
                        .directive('ng1A', function () { return ({
                        template: '',
                        scope: {},
                        bindToController: true,
                        controllerAs: '$ctrl',
                        controller: function ($scope) {
                            Object.getPrototypeOf($scope).$onDestroy = $onDestroySpy;
                        }
                    }); })
                        .directive('ng1B', function () { return ({
                        template: '',
                        scope: {},
                        bindToController: false,
                        controllerAs: '$ctrl',
                        controller: function ($scope) {
                            $scope['$onDestroy'] = $onDestroySpy;
                        }
                    }); })
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    var Ng2Module = /** @class */ (function () {
                        function Ng2Module() {
                        }
                        Ng2Module = __decorate([
                            core_1.NgModule({
                                declarations: [
                                    adapter.upgradeNg1Component('ng1A'), adapter.upgradeNg1Component('ng1B'),
                                    Ng2Component
                                ],
                                imports: [platform_browser_1.BrowserModule],
                            })
                        ], Ng2Module);
                        return Ng2Module;
                    }());
                    var element = test_helpers_1.html("<div ng-if=\"!ng1Destroy\"><ng2></ng2></div>");
                    adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                        var $rootScope = ref.ng1RootScope;
                        $rootScope.ng1Destroy = false;
                        testing_1.tick();
                        $rootScope.$digest();
                        $rootScope.ng1Destroy = true;
                        testing_1.tick();
                        $rootScope.$digest();
                        $rootScope.ng1Destroy = false;
                        testing_1.tick();
                        $rootScope.$digest();
                        ng2ComponentInstance.ng2Destroy = true;
                        testing_1.tick();
                        $rootScope.$digest();
                        expect($onDestroySpy).not.toHaveBeenCalled();
                        ref.dispose();
                    });
                }));
            });
            describe('destroying the upgraded component', function () {
                it('should destroy `componentScope`', testing_1.fakeAsync(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var scopeDestroyListener = jasmine.createSpy('scopeDestroyListener');
                    var ng2ComponentInstance;
                    var Ng2Component = /** @class */ (function () {
                        function Ng2Component() {
                            this.ng2Destroy = false;
                            ng2ComponentInstance = this;
                        }
                        Ng2Component = __decorate([
                            core_1.Component({ selector: 'ng2', template: '<div *ngIf="!ng2Destroy"><ng1></ng1></div>' }),
                            __metadata("design:paramtypes", [])
                        ], Ng2Component);
                        return Ng2Component;
                    }());
                    // On browsers that don't support `requestAnimationFrame` (IE 9, Android <= 4.3),
                    // `$animate` will use `setTimeout(..., 16.6)` instead. This timeout will still be on
                    // the queue at the end of the test, causing it to fail.
                    // Mocking animations (via `ngAnimateMock`) avoids the issue.
                    angular.module('ng1', ['ngAnimateMock'])
                        .component('ng1', {
                        controller: function ($scope) {
                            $scope.$on('$destroy', scopeDestroyListener);
                        },
                    })
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    var Ng2Module = /** @class */ (function () {
                        function Ng2Module() {
                        }
                        Ng2Module = __decorate([
                            core_1.NgModule({
                                declarations: [adapter.upgradeNg1Component('ng1'), Ng2Component],
                                imports: [platform_browser_1.BrowserModule],
                            })
                        ], Ng2Module);
                        return Ng2Module;
                    }());
                    var element = test_helpers_1.html('<ng2></ng2>');
                    adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                        var $rootScope = ref.ng1RootScope;
                        expect(scopeDestroyListener).not.toHaveBeenCalled();
                        ng2ComponentInstance.ng2Destroy = true;
                        testing_1.tick();
                        $rootScope.$digest();
                        expect(scopeDestroyListener).toHaveBeenCalledTimes(1);
                    });
                }));
                it('should emit `$destroy` on `$element` and descendants', testing_1.fakeAsync(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var elementDestroyListener = jasmine.createSpy('elementDestroyListener');
                    var descendantDestroyListener = jasmine.createSpy('descendantDestroyListener');
                    var ng2ComponentInstance;
                    var Ng2Component = /** @class */ (function () {
                        function Ng2Component() {
                            this.ng2Destroy = false;
                            ng2ComponentInstance = this;
                        }
                        Ng2Component = __decorate([
                            core_1.Component({ selector: 'ng2', template: '<div *ngIf="!ng2Destroy"><ng1></ng1></div>' }),
                            __metadata("design:paramtypes", [])
                        ], Ng2Component);
                        return Ng2Component;
                    }());
                    // On browsers that don't support `requestAnimationFrame` (IE 9, Android <= 4.3),
                    // `$animate` will use `setTimeout(..., 16.6)` instead. This timeout will still be on
                    // the queue at the end of the test, causing it to fail.
                    // Mocking animations (via `ngAnimateMock`) avoids the issue.
                    angular.module('ng1', ['ngAnimateMock'])
                        .component('ng1', {
                        controller: /** @class */ (function () {
                            function class_6($element) {
                                this.$element = $element;
                            }
                            class_6.prototype.$onInit = function () {
                                this.$element.on('$destroy', elementDestroyListener);
                                this.$element.contents().on('$destroy', descendantDestroyListener);
                            };
                            return class_6;
                        }()),
                        template: '<div></div>'
                    })
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    var Ng2Module = /** @class */ (function () {
                        function Ng2Module() {
                        }
                        Ng2Module = __decorate([
                            core_1.NgModule({
                                declarations: [adapter.upgradeNg1Component('ng1'), Ng2Component],
                                imports: [platform_browser_1.BrowserModule],
                            })
                        ], Ng2Module);
                        return Ng2Module;
                    }());
                    var element = test_helpers_1.html('<ng2></ng2>');
                    adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                        var $rootScope = ref.ng1RootScope;
                        testing_1.tick();
                        $rootScope.$digest();
                        expect(elementDestroyListener).not.toHaveBeenCalled();
                        expect(descendantDestroyListener).not.toHaveBeenCalled();
                        ng2ComponentInstance.ng2Destroy = true;
                        testing_1.tick();
                        $rootScope.$digest();
                        expect(elementDestroyListener).toHaveBeenCalledTimes(1);
                        expect(descendantDestroyListener).toHaveBeenCalledTimes(1);
                    });
                }));
                it('should clear data on `$element` and descendants', testing_1.fakeAsync(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var ng1ComponentElement;
                    var ng2ComponentAInstance;
                    // Define `ng1Component`
                    var ng1Component = {
                        controller: /** @class */ (function () {
                            function class_7($element) {
                                this.$element = $element;
                            }
                            class_7.prototype.$onInit = function () {
                                this.$element.data('test', 1);
                                this.$element.contents().data('test', 2);
                                ng1ComponentElement = this.$element;
                            };
                            return class_7;
                        }()),
                        template: '<div></div>'
                    };
                    // Define `Ng2Component`
                    var Ng2ComponentA = /** @class */ (function () {
                        function Ng2ComponentA() {
                            this.destroyIt = false;
                            ng2ComponentAInstance = this;
                        }
                        Ng2ComponentA = __decorate([
                            core_1.Component({ selector: 'ng2A', template: '<ng2B *ngIf="!destroyIt"></ng2B>' }),
                            __metadata("design:paramtypes", [])
                        ], Ng2ComponentA);
                        return Ng2ComponentA;
                    }());
                    var Ng2ComponentB = /** @class */ (function () {
                        function Ng2ComponentB() {
                        }
                        Ng2ComponentB = __decorate([
                            core_1.Component({ selector: 'ng2B', template: '<ng1></ng1>' })
                        ], Ng2ComponentB);
                        return Ng2ComponentB;
                    }());
                    // Define `ng1Module`
                    angular.module('ng1Module', [])
                        .component('ng1', ng1Component)
                        .directive('ng2A', adapter.downgradeNg2Component(Ng2ComponentA));
                    // Define `Ng2Module`
                    var Ng2Module = /** @class */ (function () {
                        function Ng2Module() {
                        }
                        Ng2Module.prototype.ngDoBootstrap = function () { };
                        Ng2Module = __decorate([
                            core_1.NgModule({
                                declarations: [adapter.upgradeNg1Component('ng1'), Ng2ComponentA, Ng2ComponentB],
                                entryComponents: [Ng2ComponentA],
                                imports: [platform_browser_1.BrowserModule]
                            })
                        ], Ng2Module);
                        return Ng2Module;
                    }());
                    // Bootstrap
                    var element = test_helpers_1.html("<ng2-a></ng2-a>");
                    adapter.bootstrap(element, ['ng1Module']).ready(function (ref) {
                        var $rootScope = ref.ng1RootScope;
                        testing_1.tick();
                        $rootScope.$digest();
                        expect(ng1ComponentElement.data('test')).toBe(1);
                        expect(ng1ComponentElement.contents().data('test')).toBe(2);
                        ng2ComponentAInstance.destroyIt = true;
                        testing_1.tick();
                        $rootScope.$digest();
                        expect(ng1ComponentElement.data('test')).toBeUndefined();
                        expect(ng1ComponentElement.contents().data('test')).toBeUndefined();
                    });
                }));
                it('should clear dom listeners on `$element` and descendants`', testing_1.fakeAsync(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var elementClickListener = jasmine.createSpy('elementClickListener');
                    var descendantClickListener = jasmine.createSpy('descendantClickListener');
                    var ng1DescendantElement;
                    var ng2ComponentAInstance;
                    // Define `ng1Component`
                    var ng1Component = {
                        controller: /** @class */ (function () {
                            function class_8($element) {
                                this.$element = $element;
                            }
                            class_8.prototype.$onInit = function () {
                                ng1DescendantElement = this.$element.contents();
                                this.$element.on('click', elementClickListener);
                                ng1DescendantElement.on('click', descendantClickListener);
                            };
                            return class_8;
                        }()),
                        template: '<div></div>'
                    };
                    // Define `Ng2Component`
                    var Ng2ComponentA = /** @class */ (function () {
                        function Ng2ComponentA() {
                            this.destroyIt = false;
                            ng2ComponentAInstance = this;
                        }
                        Ng2ComponentA = __decorate([
                            core_1.Component({ selector: 'ng2A', template: '<ng2B *ngIf="!destroyIt"></ng2B>' }),
                            __metadata("design:paramtypes", [])
                        ], Ng2ComponentA);
                        return Ng2ComponentA;
                    }());
                    var Ng2ComponentB = /** @class */ (function () {
                        function Ng2ComponentB() {
                        }
                        Ng2ComponentB = __decorate([
                            core_1.Component({ selector: 'ng2B', template: '<ng1></ng1>' })
                        ], Ng2ComponentB);
                        return Ng2ComponentB;
                    }());
                    // Define `ng1Module`
                    angular.module('ng1Module', [])
                        .component('ng1', ng1Component)
                        .directive('ng2A', adapter.downgradeNg2Component(Ng2ComponentA));
                    // Define `Ng2Module`
                    var Ng2Module = /** @class */ (function () {
                        function Ng2Module() {
                        }
                        Ng2Module.prototype.ngDoBootstrap = function () { };
                        Ng2Module = __decorate([
                            core_1.NgModule({
                                declarations: [adapter.upgradeNg1Component('ng1'), Ng2ComponentA, Ng2ComponentB],
                                entryComponents: [Ng2ComponentA],
                                imports: [platform_browser_1.BrowserModule]
                            })
                        ], Ng2Module);
                        return Ng2Module;
                    }());
                    // Bootstrap
                    var element = test_helpers_1.html("<ng2-a></ng2-a>");
                    adapter.bootstrap(element, ['ng1Module']).ready(function (ref) {
                        var $rootScope = ref.ng1RootScope;
                        testing_1.tick();
                        $rootScope.$digest();
                        ng1DescendantElement[0].click();
                        expect(elementClickListener).toHaveBeenCalledTimes(1);
                        expect(descendantClickListener).toHaveBeenCalledTimes(1);
                        ng2ComponentAInstance.destroyIt = true;
                        testing_1.tick();
                        $rootScope.$digest();
                        ng1DescendantElement[0].click();
                        expect(elementClickListener).toHaveBeenCalledTimes(1);
                        expect(descendantClickListener).toHaveBeenCalledTimes(1);
                    });
                }));
            });
            describe('linking', function () {
                it('should run the pre-linking after instantiating the controller', testing_1.async(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var log = [];
                    // Define `ng1Directive`
                    var ng1Directive = {
                        template: '',
                        link: { pre: function () { return log.push('ng1-pre'); } },
                        controller: /** @class */ (function () {
                            function controller() {
                                log.push('ng1-ctrl');
                            }
                            return controller;
                        }())
                    };
                    // Define `Ng2Component`
                    var Ng2Component = /** @class */ (function () {
                        function Ng2Component() {
                        }
                        Ng2Component = __decorate([
                            core_1.Component({ selector: 'ng2', template: '<ng1></ng1>' })
                        ], Ng2Component);
                        return Ng2Component;
                    }());
                    // Define `ng1Module`
                    var ng1Module = angular.module('ng1', [])
                        .directive('ng1', function () { return ng1Directive; })
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    // Define `Ng2Module`
                    var Ng2Module = /** @class */ (function () {
                        function Ng2Module() {
                        }
                        Ng2Module = __decorate([
                            core_1.NgModule({
                                imports: [platform_browser_1.BrowserModule],
                                declarations: [adapter.upgradeNg1Component('ng1'), Ng2Component]
                            })
                        ], Ng2Module);
                        return Ng2Module;
                    }());
                    // Bootstrap
                    var element = test_helpers_1.html("<ng2></ng2>");
                    adapter.bootstrap(element, ['ng1']).ready(function () {
                        expect(log).toEqual(['ng1-ctrl', 'ng1-pre']);
                    });
                }));
                it('should run the pre-linking function before linking', testing_1.async(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var log = [];
                    // Define `ng1Directive`
                    var ng1DirectiveA = {
                        template: '<ng1-b></ng1-b>',
                        link: { pre: function () { return log.push('ng1A-pre'); } }
                    };
                    var ng1DirectiveB = { link: function () { return log.push('ng1B-post'); } };
                    // Define `Ng2Component`
                    var Ng2Component = /** @class */ (function () {
                        function Ng2Component() {
                        }
                        Ng2Component = __decorate([
                            core_1.Component({ selector: 'ng2', template: '<ng1-a></ng1-a>' })
                        ], Ng2Component);
                        return Ng2Component;
                    }());
                    // Define `ng1Module`
                    var ng1Module = angular.module('ng1', [])
                        .directive('ng1A', function () { return ng1DirectiveA; })
                        .directive('ng1B', function () { return ng1DirectiveB; })
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    // Define `Ng2Module`
                    var Ng2Module = /** @class */ (function () {
                        function Ng2Module() {
                        }
                        Ng2Module = __decorate([
                            core_1.NgModule({
                                imports: [platform_browser_1.BrowserModule],
                                declarations: [adapter.upgradeNg1Component('ng1A'), Ng2Component],
                                schemas: [core_1.NO_ERRORS_SCHEMA]
                            })
                        ], Ng2Module);
                        return Ng2Module;
                    }());
                    // Bootstrap
                    var element = test_helpers_1.html("<ng2></ng2>");
                    adapter.bootstrap(element, ['ng1']).ready(function () {
                        expect(log).toEqual(['ng1A-pre', 'ng1B-post']);
                    });
                }));
                it('should run the post-linking function after linking (link: object)', testing_1.async(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var log = [];
                    // Define `ng1Directive`
                    var ng1DirectiveA = {
                        template: '<ng1-b></ng1-b>',
                        link: { post: function () { return log.push('ng1A-post'); } }
                    };
                    var ng1DirectiveB = { link: function () { return log.push('ng1B-post'); } };
                    // Define `Ng2Component`
                    var Ng2Component = /** @class */ (function () {
                        function Ng2Component() {
                        }
                        Ng2Component = __decorate([
                            core_1.Component({ selector: 'ng2', template: '<ng1-a></ng1-a>' })
                        ], Ng2Component);
                        return Ng2Component;
                    }());
                    // Define `ng1Module`
                    var ng1Module = angular.module('ng1', [])
                        .directive('ng1A', function () { return ng1DirectiveA; })
                        .directive('ng1B', function () { return ng1DirectiveB; })
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    // Define `Ng2Module`
                    var Ng2Module = /** @class */ (function () {
                        function Ng2Module() {
                        }
                        Ng2Module = __decorate([
                            core_1.NgModule({
                                imports: [platform_browser_1.BrowserModule],
                                declarations: [adapter.upgradeNg1Component('ng1A'), Ng2Component],
                                schemas: [core_1.NO_ERRORS_SCHEMA]
                            })
                        ], Ng2Module);
                        return Ng2Module;
                    }());
                    // Bootstrap
                    var element = test_helpers_1.html("<ng2></ng2>");
                    adapter.bootstrap(element, ['ng1']).ready(function () {
                        expect(log).toEqual(['ng1B-post', 'ng1A-post']);
                    });
                }));
                it('should run the post-linking function after linking (link: function)', testing_1.async(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var log = [];
                    // Define `ng1Directive`
                    var ng1DirectiveA = {
                        template: '<ng1-b></ng1-b>',
                        link: function () { return log.push('ng1A-post'); }
                    };
                    var ng1DirectiveB = { link: function () { return log.push('ng1B-post'); } };
                    // Define `Ng2Component`
                    var Ng2Component = /** @class */ (function () {
                        function Ng2Component() {
                        }
                        Ng2Component = __decorate([
                            core_1.Component({ selector: 'ng2', template: '<ng1-a></ng1-a>' })
                        ], Ng2Component);
                        return Ng2Component;
                    }());
                    // Define `ng1Module`
                    var ng1Module = angular.module('ng1', [])
                        .directive('ng1A', function () { return ng1DirectiveA; })
                        .directive('ng1B', function () { return ng1DirectiveB; })
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    // Define `Ng2Module`
                    var Ng2Module = /** @class */ (function () {
                        function Ng2Module() {
                        }
                        Ng2Module = __decorate([
                            core_1.NgModule({
                                imports: [platform_browser_1.BrowserModule],
                                declarations: [adapter.upgradeNg1Component('ng1A'), Ng2Component],
                                schemas: [core_1.NO_ERRORS_SCHEMA]
                            })
                        ], Ng2Module);
                        return Ng2Module;
                    }());
                    // Bootstrap
                    var element = test_helpers_1.html("<ng2></ng2>");
                    adapter.bootstrap(element, ['ng1']).ready(function () {
                        expect(log).toEqual(['ng1B-post', 'ng1A-post']);
                    });
                }));
                it('should run the post-linking function before `$postLink`', testing_1.async(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var log = [];
                    // Define `ng1Directive`
                    var ng1Directive = {
                        template: '',
                        link: function () { return log.push('ng1-post'); },
                        controller: /** @class */ (function () {
                            function controller() {
                            }
                            controller.prototype.$postLink = function () { log.push('ng1-$post'); };
                            return controller;
                        }())
                    };
                    // Define `Ng2Component`
                    var Ng2Component = /** @class */ (function () {
                        function Ng2Component() {
                        }
                        Ng2Component = __decorate([
                            core_1.Component({ selector: 'ng2', template: '<ng1></ng1>' })
                        ], Ng2Component);
                        return Ng2Component;
                    }());
                    // Define `ng1Module`
                    var ng1Module = angular.module('ng1', [])
                        .directive('ng1', function () { return ng1Directive; })
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    // Define `Ng2Module`
                    var Ng2Module = /** @class */ (function () {
                        function Ng2Module() {
                        }
                        Ng2Module = __decorate([
                            core_1.NgModule({
                                imports: [platform_browser_1.BrowserModule],
                                declarations: [adapter.upgradeNg1Component('ng1'), Ng2Component]
                            })
                        ], Ng2Module);
                        return Ng2Module;
                    }());
                    // Bootstrap
                    var element = test_helpers_1.html("<ng2></ng2>");
                    adapter.bootstrap(element, ['ng1']).ready(function () {
                        expect(log).toEqual(['ng1-post', 'ng1-$post']);
                    });
                }));
            });
            describe('transclusion', function () {
                it('should support single-slot transclusion', testing_1.async(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var ng2ComponentAInstance;
                    var ng2ComponentBInstance;
                    // Define `ng1Component`
                    var ng1Component = {
                        template: 'ng1(<div ng-transclude></div>)',
                        transclude: true
                    };
                    // Define `Ng2Component`
                    var Ng2ComponentA = /** @class */ (function () {
                        function Ng2ComponentA() {
                            this.value = 'foo';
                            this.showB = false;
                            ng2ComponentAInstance = this;
                        }
                        Ng2ComponentA = __decorate([
                            core_1.Component({
                                selector: 'ng2A',
                                template: 'ng2A(<ng1>{{ value }} | <ng2B *ngIf="showB"></ng2B></ng1>)'
                            }),
                            __metadata("design:paramtypes", [])
                        ], Ng2ComponentA);
                        return Ng2ComponentA;
                    }());
                    var Ng2ComponentB = /** @class */ (function () {
                        function Ng2ComponentB() {
                            this.value = 'bar';
                            ng2ComponentBInstance = this;
                        }
                        Ng2ComponentB = __decorate([
                            core_1.Component({ selector: 'ng2B', template: 'ng2B({{ value }})' }),
                            __metadata("design:paramtypes", [])
                        ], Ng2ComponentB);
                        return Ng2ComponentB;
                    }());
                    // Define `ng1Module`
                    var ng1Module = angular.module('ng1Module', [])
                        .component('ng1', ng1Component)
                        .directive('ng2A', adapter.downgradeNg2Component(Ng2ComponentA));
                    // Define `Ng2Module`
                    var Ng2Module = /** @class */ (function () {
                        function Ng2Module() {
                        }
                        Ng2Module = __decorate([
                            core_1.NgModule({
                                imports: [platform_browser_1.BrowserModule],
                                declarations: [adapter.upgradeNg1Component('ng1'), Ng2ComponentA, Ng2ComponentB]
                            })
                        ], Ng2Module);
                        return Ng2Module;
                    }());
                    // Bootstrap
                    var element = test_helpers_1.html("<ng2-a></ng2-a>");
                    adapter.bootstrap(element, ['ng1Module']).ready(function (ref) {
                        expect(test_helpers_1.multiTrim(element.textContent)).toBe('ng2A(ng1(foo | ))');
                        ng2ComponentAInstance.value = 'baz';
                        ng2ComponentAInstance.showB = true;
                        test_helpers_1.$digest(ref);
                        expect(test_helpers_1.multiTrim(element.textContent)).toBe('ng2A(ng1(baz | ng2B(bar)))');
                        ng2ComponentBInstance.value = 'qux';
                        test_helpers_1.$digest(ref);
                        expect(test_helpers_1.multiTrim(element.textContent)).toBe('ng2A(ng1(baz | ng2B(qux)))');
                    });
                }));
                it('should support single-slot transclusion with fallback content', testing_1.async(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var ng1ControllerInstances = [];
                    var ng2ComponentInstance;
                    // Define `ng1Component`
                    var ng1Component = {
                        template: 'ng1(<div ng-transclude>{{ $ctrl.value }}</div>)',
                        transclude: true,
                        controller: /** @class */ (function () {
                            function class_9() {
                                this.value = 'from-ng1';
                                ng1ControllerInstances.push(this);
                            }
                            return class_9;
                        }())
                    };
                    // Define `Ng2Component`
                    var Ng2Component = /** @class */ (function () {
                        function Ng2Component() {
                            this.value = 'from-ng2';
                            ng2ComponentInstance = this;
                        }
                        Ng2Component = __decorate([
                            core_1.Component({
                                selector: 'ng2',
                                template: "\n                ng2(\n                  <ng1><div>{{ value }}</div></ng1> |\n\n                  <!-- Interpolation-only content should still be detected as transcluded content. -->\n                  <ng1>{{ value }}</ng1> |\n\n                  <ng1></ng1>\n                )"
                            }),
                            __metadata("design:paramtypes", [])
                        ], Ng2Component);
                        return Ng2Component;
                    }());
                    // Define `ng1Module`
                    var ng1Module = angular.module('ng1Module', [])
                        .component('ng1', ng1Component)
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    // Define `Ng2Module`
                    var Ng2Module = /** @class */ (function () {
                        function Ng2Module() {
                        }
                        Ng2Module = __decorate([
                            core_1.NgModule({
                                imports: [platform_browser_1.BrowserModule],
                                declarations: [adapter.upgradeNg1Component('ng1'), Ng2Component]
                            })
                        ], Ng2Module);
                        return Ng2Module;
                    }());
                    // Bootstrap
                    var element = test_helpers_1.html("<ng2></ng2>");
                    adapter.bootstrap(element, ['ng1Module']).ready(function (ref) {
                        expect(test_helpers_1.multiTrim(element.textContent, true))
                            .toBe('ng2(ng1(from-ng2)|ng1(from-ng2)|ng1(from-ng1))');
                        ng1ControllerInstances.forEach(function (ctrl) { return ctrl.value = 'ng1-foo'; });
                        ng2ComponentInstance.value = 'ng2-bar';
                        test_helpers_1.$digest(ref);
                        expect(test_helpers_1.multiTrim(element.textContent, true))
                            .toBe('ng2(ng1(ng2-bar)|ng1(ng2-bar)|ng1(ng1-foo))');
                    });
                }));
                it('should support multi-slot transclusion', testing_1.async(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var ng2ComponentInstance;
                    // Define `ng1Component`
                    var ng1Component = {
                        template: 'ng1(x(<div ng-transclude="slotX"></div>) | y(<div ng-transclude="slotY"></div>))',
                        transclude: { slotX: 'contentX', slotY: 'contentY' }
                    };
                    // Define `Ng2Component`
                    var Ng2Component = /** @class */ (function () {
                        function Ng2Component() {
                            this.x = 'foo';
                            this.y = 'bar';
                            ng2ComponentInstance = this;
                        }
                        Ng2Component = __decorate([
                            core_1.Component({
                                selector: 'ng2',
                                template: "\n                ng2(\n                  <ng1>\n                    <content-x>{{ x }}1</content-x>\n                    <content-y>{{ y }}1</content-y>\n                    <content-x>{{ x }}2</content-x>\n                    <content-y>{{ y }}2</content-y>\n                  </ng1>\n                )"
                            }),
                            __metadata("design:paramtypes", [])
                        ], Ng2Component);
                        return Ng2Component;
                    }());
                    // Define `ng1Module`
                    var ng1Module = angular.module('ng1Module', [])
                        .component('ng1', ng1Component)
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    // Define `Ng2Module`
                    var Ng2Module = /** @class */ (function () {
                        function Ng2Module() {
                        }
                        Ng2Module = __decorate([
                            core_1.NgModule({
                                imports: [platform_browser_1.BrowserModule],
                                declarations: [adapter.upgradeNg1Component('ng1'), Ng2Component],
                                schemas: [core_1.NO_ERRORS_SCHEMA]
                            })
                        ], Ng2Module);
                        return Ng2Module;
                    }());
                    // Bootstrap
                    var element = test_helpers_1.html("<ng2></ng2>");
                    adapter.bootstrap(element, ['ng1Module']).ready(function (ref) {
                        expect(test_helpers_1.multiTrim(element.textContent, true))
                            .toBe('ng2(ng1(x(foo1foo2)|y(bar1bar2)))');
                        ng2ComponentInstance.x = 'baz';
                        ng2ComponentInstance.y = 'qux';
                        test_helpers_1.$digest(ref);
                        expect(test_helpers_1.multiTrim(element.textContent, true))
                            .toBe('ng2(ng1(x(baz1baz2)|y(qux1qux2)))');
                    });
                }));
                it('should support default slot (with fallback content)', testing_1.async(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var ng1ControllerInstances = [];
                    var ng2ComponentInstance;
                    // Define `ng1Component`
                    var ng1Component = {
                        template: 'ng1(default(<div ng-transclude="">fallback-{{ $ctrl.value }}</div>))',
                        transclude: { slotX: 'contentX', slotY: 'contentY' },
                        controller: /** @class */ (function () {
                            function class_10() {
                                this.value = 'ng1';
                                ng1ControllerInstances.push(this);
                            }
                            return class_10;
                        }())
                    };
                    // Define `Ng2Component`
                    var Ng2Component = /** @class */ (function () {
                        function Ng2Component() {
                            this.x = 'foo';
                            this.y = 'bar';
                            ng2ComponentInstance = this;
                        }
                        Ng2Component = __decorate([
                            core_1.Component({
                                selector: 'ng2',
                                template: "\n                ng2(\n                  <ng1>\n                    ({{ x }})\n                    <content-x>ignored x</content-x>\n                    {{ x }}-<span>{{ y }}</span>\n                    <content-y>ignored y</content-y>\n                    <span>({{ y }})</span>\n                  </ng1> |\n\n                  <!--\n                    Remove any whitespace, because in AngularJS versions prior to 1.6\n                    even whitespace counts as transcluded content.\n                  -->\n                  <ng1><content-x>ignored x</content-x><content-y>ignored y</content-y></ng1> |\n\n                  <!--\n                    Interpolation-only content should still be detected as transcluded content.\n                  -->\n                  <ng1>{{ x }}<content-x>ignored x</content-x>{{ y + x }}<content-y>ignored y</content-y>{{ y }}</ng1>\n                )"
                            }),
                            __metadata("design:paramtypes", [])
                        ], Ng2Component);
                        return Ng2Component;
                    }());
                    // Define `ng1Module`
                    var ng1Module = angular.module('ng1Module', [])
                        .component('ng1', ng1Component)
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    // Define `Ng2Module`
                    var Ng2Module = /** @class */ (function () {
                        function Ng2Module() {
                        }
                        Ng2Module = __decorate([
                            core_1.NgModule({
                                imports: [platform_browser_1.BrowserModule],
                                declarations: [adapter.upgradeNg1Component('ng1'), Ng2Component],
                                schemas: [core_1.NO_ERRORS_SCHEMA]
                            })
                        ], Ng2Module);
                        return Ng2Module;
                    }());
                    // Bootstrap
                    var element = test_helpers_1.html("<ng2></ng2>");
                    adapter.bootstrap(element, ['ng1Module']).ready(function (ref) {
                        expect(test_helpers_1.multiTrim(element.textContent, true))
                            .toBe('ng2(ng1(default((foo)foo-bar(bar)))|ng1(default(fallback-ng1))|ng1(default(foobarfoobar)))');
                        ng1ControllerInstances.forEach(function (ctrl) { return ctrl.value = 'ng1-plus'; });
                        ng2ComponentInstance.x = 'baz';
                        ng2ComponentInstance.y = 'qux';
                        test_helpers_1.$digest(ref);
                        expect(test_helpers_1.multiTrim(element.textContent, true))
                            .toBe('ng2(ng1(default((baz)baz-qux(qux)))|ng1(default(fallback-ng1-plus))|ng1(default(bazquxbazqux)))');
                    });
                }));
                it('should support optional transclusion slots (with fallback content)', testing_1.async(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var ng1ControllerInstances = [];
                    var ng2ComponentInstance;
                    // Define `ng1Component`
                    var ng1Component = {
                        template: "\n                ng1(\n                  x(<div ng-transclude=\"slotX\">{{ $ctrl.x }}</div>) |\n                  y(<div ng-transclude=\"slotY\">{{ $ctrl.y }}</div>)\n                )",
                        transclude: { slotX: '?contentX', slotY: '?contentY' },
                        controller: /** @class */ (function () {
                            function class_11() {
                                this.x = 'ng1X';
                                this.y = 'ng1Y';
                                ng1ControllerInstances.push(this);
                            }
                            return class_11;
                        }())
                    };
                    // Define `Ng2Component`
                    var Ng2Component = /** @class */ (function () {
                        function Ng2Component() {
                            this.x = 'ng2X';
                            this.y = 'ng2Y';
                            ng2ComponentInstance = this;
                        }
                        Ng2Component = __decorate([
                            core_1.Component({
                                selector: 'ng2',
                                template: "\n                ng2(\n                  <ng1><content-x>{{ x }}</content-x></ng1> |\n                  <ng1><content-y>{{ y }}</content-y></ng1>\n                )"
                            }),
                            __metadata("design:paramtypes", [])
                        ], Ng2Component);
                        return Ng2Component;
                    }());
                    // Define `ng1Module`
                    var ng1Module = angular.module('ng1Module', [])
                        .component('ng1', ng1Component)
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    // Define `Ng2Module`
                    var Ng2Module = /** @class */ (function () {
                        function Ng2Module() {
                        }
                        Ng2Module = __decorate([
                            core_1.NgModule({
                                imports: [platform_browser_1.BrowserModule],
                                declarations: [adapter.upgradeNg1Component('ng1'), Ng2Component],
                                schemas: [core_1.NO_ERRORS_SCHEMA]
                            })
                        ], Ng2Module);
                        return Ng2Module;
                    }());
                    // Bootstrap
                    var element = test_helpers_1.html("<ng2></ng2>");
                    adapter.bootstrap(element, ['ng1Module']).ready(function (ref) {
                        expect(test_helpers_1.multiTrim(element.textContent, true))
                            .toBe('ng2(ng1(x(ng2X)|y(ng1Y))|ng1(x(ng1X)|y(ng2Y)))');
                        ng1ControllerInstances.forEach(function (ctrl) {
                            ctrl.x = 'ng1X-foo';
                            ctrl.y = 'ng1Y-bar';
                        });
                        ng2ComponentInstance.x = 'ng2X-baz';
                        ng2ComponentInstance.y = 'ng2Y-qux';
                        test_helpers_1.$digest(ref);
                        expect(test_helpers_1.multiTrim(element.textContent, true))
                            .toBe('ng2(ng1(x(ng2X-baz)|y(ng1Y-bar))|ng1(x(ng1X-foo)|y(ng2Y-qux)))');
                    });
                }));
                it('should throw if a non-optional slot is not filled', testing_1.async(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var errorMessage;
                    // Define `ng1Component`
                    var ng1Component = {
                        template: '',
                        transclude: { slotX: '?contentX', slotY: 'contentY' }
                    };
                    // Define `Ng2Component`
                    var Ng2Component = /** @class */ (function () {
                        function Ng2Component() {
                        }
                        Ng2Component = __decorate([
                            core_1.Component({ selector: 'ng2', template: '<ng1></ng1>' })
                        ], Ng2Component);
                        return Ng2Component;
                    }());
                    // Define `ng1Module`
                    var ng1Module = angular.module('ng1Module', [])
                        .value('$exceptionHandler', function (error) { return errorMessage = error.message; })
                        .component('ng1', ng1Component)
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    // Define `Ng2Module`
                    var Ng2Module = /** @class */ (function () {
                        function Ng2Module() {
                        }
                        Ng2Module = __decorate([
                            core_1.NgModule({
                                imports: [platform_browser_1.BrowserModule],
                                declarations: [adapter.upgradeNg1Component('ng1'), Ng2Component]
                            })
                        ], Ng2Module);
                        return Ng2Module;
                    }());
                    // Bootstrap
                    var element = test_helpers_1.html("<ng2></ng2>");
                    adapter.bootstrap(element, ['ng1Module']).ready(function (ref) {
                        expect(errorMessage)
                            .toContain('Required transclusion slot \'slotY\' on directive: ng1');
                    });
                }));
                it('should support structural directives in transcluded content', testing_1.async(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var ng2ComponentInstance;
                    // Define `ng1Component`
                    var ng1Component = {
                        template: 'ng1(x(<div ng-transclude="slotX"></div>) | default(<div ng-transclude=""></div>))',
                        transclude: { slotX: 'contentX' }
                    };
                    // Define `Ng2Component`
                    var Ng2Component = /** @class */ (function () {
                        function Ng2Component() {
                            this.x = 'foo';
                            this.y = 'bar';
                            this.show = true;
                            ng2ComponentInstance = this;
                        }
                        Ng2Component = __decorate([
                            core_1.Component({
                                selector: 'ng2',
                                template: "\n                ng2(\n                  <ng1>\n                    <content-x><div *ngIf=\"show\">{{ x }}1</div></content-x>\n                    <div *ngIf=\"!show\">{{ y }}1</div>\n                    <content-x><div *ngIf=\"!show\">{{ x }}2</div></content-x>\n                    <div *ngIf=\"show\">{{ y }}2</div>\n                  </ng1>\n                )"
                            }),
                            __metadata("design:paramtypes", [])
                        ], Ng2Component);
                        return Ng2Component;
                    }());
                    // Define `ng1Module`
                    var ng1Module = angular.module('ng1Module', [])
                        .component('ng1', ng1Component)
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    // Define `Ng2Module`
                    var Ng2Module = /** @class */ (function () {
                        function Ng2Module() {
                        }
                        Ng2Module = __decorate([
                            core_1.NgModule({
                                imports: [platform_browser_1.BrowserModule],
                                declarations: [adapter.upgradeNg1Component('ng1'), Ng2Component],
                                schemas: [core_1.NO_ERRORS_SCHEMA]
                            })
                        ], Ng2Module);
                        return Ng2Module;
                    }());
                    // Bootstrap
                    var element = test_helpers_1.html("<ng2></ng2>");
                    adapter.bootstrap(element, ['ng1Module']).ready(function (ref) {
                        expect(test_helpers_1.multiTrim(element.textContent, true)).toBe('ng2(ng1(x(foo1)|default(bar2)))');
                        ng2ComponentInstance.x = 'baz';
                        ng2ComponentInstance.y = 'qux';
                        ng2ComponentInstance.show = false;
                        test_helpers_1.$digest(ref);
                        expect(test_helpers_1.multiTrim(element.textContent, true)).toBe('ng2(ng1(x(baz2)|default(qux1)))');
                        ng2ComponentInstance.show = true;
                        test_helpers_1.$digest(ref);
                        expect(test_helpers_1.multiTrim(element.textContent, true)).toBe('ng2(ng1(x(baz1)|default(qux2)))');
                    });
                }));
            });
            it('should bind input properties (<) of components', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                var ng1 = {
                    bindings: { personProfile: '<' },
                    template: 'Hello {{$ctrl.personProfile.firstName}} {{$ctrl.personProfile.lastName}}',
                    controller: /** @class */ (function () {
                        function controller() {
                        }
                        return controller;
                    }())
                };
                ng1Module.component('ng1', ng1);
                var Ng2 = /** @class */ (function () {
                    function Ng2() {
                        this.goku = { firstName: 'GOKU', lastName: 'SAN' };
                    }
                    Ng2 = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<ng1 [personProfile]="goku"></ng1>' })
                    ], Ng2);
                    return Ng2;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [adapter.upgradeNg1Component('ng1'), Ng2],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html("<div><ng2></ng2></div>");
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toEqual("Hello GOKU SAN");
                    ref.dispose();
                });
            }));
            it('should support ng2 > ng1 > ng2', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                var ng1 = {
                    template: 'ng1(<ng2b></ng2b>)',
                };
                ng1Module.component('ng1', ng1);
                var Ng2a = /** @class */ (function () {
                    function Ng2a() {
                    }
                    Ng2a = __decorate([
                        core_1.Component({ selector: 'ng2a', template: 'ng2a(<ng1></ng1>)' })
                    ], Ng2a);
                    return Ng2a;
                }());
                ng1Module.directive('ng2a', adapter.downgradeNg2Component(Ng2a));
                var Ng2b = /** @class */ (function () {
                    function Ng2b() {
                    }
                    Ng2b = __decorate([
                        core_1.Component({ selector: 'ng2b', template: 'ng2b' })
                    ], Ng2b);
                    return Ng2b;
                }());
                ng1Module.directive('ng2b', adapter.downgradeNg2Component(Ng2b));
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [adapter.upgradeNg1Component('ng1'), Ng2a, Ng2b],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                var element = test_helpers_1.html("<div><ng2a></ng2a></div>");
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toEqual('ng2a(ng1(ng2b))');
                });
            }));
        });
        describe('injection', function () {
            function SomeToken() { }
            it('should export ng2 instance to ng1', testing_1.async(function () {
                var MyNg2Module = /** @class */ (function () {
                    function MyNg2Module() {
                    }
                    MyNg2Module = __decorate([
                        core_1.NgModule({
                            providers: [{ provide: SomeToken, useValue: 'correct_value' }],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], MyNg2Module);
                    return MyNg2Module;
                }());
                var adapter = new upgrade_adapter_1.UpgradeAdapter(MyNg2Module);
                var module = angular.module('myExample', []);
                module.factory('someToken', adapter.downgradeNg2Provider(SomeToken));
                adapter.bootstrap(test_helpers_1.html('<div>'), ['myExample']).ready(function (ref) {
                    expect(ref.ng1Injector.get('someToken')).toBe('correct_value');
                    ref.dispose();
                });
            }));
            it('should export ng1 instance to ng2', testing_1.async(function () {
                var MyNg2Module = /** @class */ (function () {
                    function MyNg2Module() {
                    }
                    MyNg2Module = __decorate([
                        core_1.NgModule({ imports: [platform_browser_1.BrowserModule] })
                    ], MyNg2Module);
                    return MyNg2Module;
                }());
                var adapter = new upgrade_adapter_1.UpgradeAdapter(MyNg2Module);
                var module = angular.module('myExample', []);
                module.value('testValue', 'secreteToken');
                adapter.upgradeNg1Provider('testValue');
                adapter.upgradeNg1Provider('testValue', { asToken: 'testToken' });
                adapter.upgradeNg1Provider('testValue', { asToken: String });
                adapter.bootstrap(test_helpers_1.html('<div>'), ['myExample']).ready(function (ref) {
                    expect(ref.ng2Injector.get('testValue')).toBe('secreteToken');
                    expect(ref.ng2Injector.get(String)).toBe('secreteToken');
                    expect(ref.ng2Injector.get('testToken')).toBe('secreteToken');
                    ref.dispose();
                });
            }));
            it('should respect hierarchical dependency injection for ng2', testing_1.async(function () {
                var ng1Module = angular.module('ng1', []);
                var Ng2Parent = /** @class */ (function () {
                    function Ng2Parent() {
                    }
                    Ng2Parent = __decorate([
                        core_1.Component({ selector: 'ng2-parent', template: "ng2-parent(<ng-content></ng-content>)" })
                    ], Ng2Parent);
                    return Ng2Parent;
                }());
                var Ng2Child = /** @class */ (function () {
                    function Ng2Child(parent) {
                    }
                    Ng2Child = __decorate([
                        core_1.Component({ selector: 'ng2-child', template: "ng2-child" }),
                        __metadata("design:paramtypes", [Ng2Parent])
                    ], Ng2Child);
                    return Ng2Child;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module = __decorate([
                        core_1.NgModule({ declarations: [Ng2Parent, Ng2Child], imports: [platform_browser_1.BrowserModule] })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                var element = test_helpers_1.html('<ng2-parent><ng2-child></ng2-child></ng2-parent>');
                var adapter = new upgrade_adapter_1.UpgradeAdapter(Ng2Module);
                ng1Module.directive('ng2Parent', adapter.downgradeNg2Component(Ng2Parent))
                    .directive('ng2Child', adapter.downgradeNg2Component(Ng2Child));
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(document.body.textContent).toEqual('ng2-parent(ng2-child)');
                    ref.dispose();
                });
            }));
        });
        describe('testability', function () {
            it('should handle deferred bootstrap', testing_1.async(function () {
                var MyNg2Module = /** @class */ (function () {
                    function MyNg2Module() {
                    }
                    MyNg2Module = __decorate([
                        core_1.NgModule({ imports: [platform_browser_1.BrowserModule] })
                    ], MyNg2Module);
                    return MyNg2Module;
                }());
                var adapter = new upgrade_adapter_1.UpgradeAdapter(MyNg2Module);
                angular.module('ng1', []);
                var bootstrapResumed = false;
                var element = test_helpers_1.html('<div></div>');
                window.name = 'NG_DEFER_BOOTSTRAP!' + window.name;
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(bootstrapResumed).toEqual(true);
                    ref.dispose();
                });
                setTimeout(function () {
                    bootstrapResumed = true;
                    window.angular.resumeBootstrap();
                }, 100);
            }));
            it('should propagate return value of resumeBootstrap', testing_1.fakeAsync(function () {
                var MyNg2Module = /** @class */ (function () {
                    function MyNg2Module() {
                    }
                    MyNg2Module = __decorate([
                        core_1.NgModule({ imports: [platform_browser_1.BrowserModule] })
                    ], MyNg2Module);
                    return MyNg2Module;
                }());
                var adapter = new upgrade_adapter_1.UpgradeAdapter(MyNg2Module);
                var ng1Module = angular.module('ng1', []);
                var a1Injector;
                ng1Module.run([
                    '$injector', function ($injector) { a1Injector = $injector; }
                ]);
                var element = test_helpers_1.html('<div></div>');
                window.name = 'NG_DEFER_BOOTSTRAP!' + window.name;
                adapter.bootstrap(element, [ng1Module.name]).ready(function (ref) { ref.dispose(); });
                testing_1.tick(100);
                var value = window.angular.resumeBootstrap();
                expect(value).toBe(a1Injector);
            }));
            it('should wait for ng2 testability', testing_1.async(function () {
                var MyNg2Module = /** @class */ (function () {
                    function MyNg2Module() {
                    }
                    MyNg2Module = __decorate([
                        core_1.NgModule({ imports: [platform_browser_1.BrowserModule] })
                    ], MyNg2Module);
                    return MyNg2Module;
                }());
                var adapter = new upgrade_adapter_1.UpgradeAdapter(MyNg2Module);
                angular.module('ng1', []);
                var element = test_helpers_1.html('<div></div>');
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    var ng2Testability = ref.ng2Injector.get(core_1.Testability);
                    ng2Testability.increasePendingRequestCount();
                    var ng2Stable = false;
                    angular.getTestability(element).whenStable(function () {
                        expect(ng2Stable).toEqual(true);
                        ref.dispose();
                    });
                    setTimeout(function () {
                        ng2Stable = true;
                        ng2Testability.decreasePendingRequestCount();
                    }, 100);
                });
            }));
        });
        describe('examples', function () {
            it('should verify UpgradeAdapter example', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var module = angular.module('myExample', []);
                var ng1 = function () {
                    return {
                        scope: { title: '=' },
                        transclude: true,
                        template: 'ng1[Hello {{title}}!](<span ng-transclude></span>)'
                    };
                };
                module.directive('ng1', ng1);
                var Ng2 = /** @class */ (function () {
                    function Ng2() {
                    }
                    Ng2 = __decorate([
                        core_1.Component({
                            selector: 'ng2',
                            inputs: ['name'],
                            template: 'ng2[<ng1 [title]="name">transclude</ng1>](<ng-content></ng-content>)'
                        })
                    ], Ng2);
                    return Ng2;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [adapter.upgradeNg1Component('ng1'), Ng2],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                document.body.innerHTML = '<ng2 name="World">project</ng2>';
                adapter.bootstrap(document.body.firstElementChild, ['myExample']).ready(function (ref) {
                    expect(test_helpers_1.multiTrim(document.body.textContent))
                        .toEqual('ng2[ng1[Hello World!](transclude)](project)');
                    ref.dispose();
                });
            }));
        });
        describe('registerForNg1Tests', function () {
            var upgradeAdapterRef;
            var $compile;
            var $rootScope;
            beforeEach(function () {
                var ng1Module = angular.module('ng1', []);
                var Ng2 = /** @class */ (function () {
                    function Ng2() {
                    }
                    Ng2 = __decorate([
                        core_1.Component({
                            selector: 'ng2',
                            template: 'Hello World',
                        })
                    ], Ng2);
                    return Ng2;
                }());
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module = __decorate([
                        core_1.NgModule({ declarations: [Ng2], imports: [platform_browser_1.BrowserModule] })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                var upgradeAdapter = new upgrade_adapter_1.UpgradeAdapter(Ng2Module);
                ng1Module.directive('ng2', upgradeAdapter.downgradeNg2Component(Ng2));
                upgradeAdapterRef = upgradeAdapter.registerForNg1Tests(['ng1']);
            });
            beforeEach(function () {
                inject(function (_$compile_, _$rootScope_) {
                    $compile = _$compile_;
                    $rootScope = _$rootScope_;
                });
            });
            it('should be able to test ng1 components that use ng2 components', testing_1.async(function () {
                upgradeAdapterRef.ready(function () {
                    var element = $compile('<ng2></ng2>')($rootScope);
                    $rootScope.$digest();
                    expect(element[0].textContent).toContain('Hello World');
                });
            }));
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBncmFkZV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvdXBncmFkZS90ZXN0L2R5bmFtaWMvdXBncmFkZV9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsc0NBQTBPO0FBQzFPLGlEQUE4RTtBQUM5RSw4REFBd0Q7QUFDeEQsOEVBQXlFO0FBQ3pFLDhEQUFnRTtBQUNoRSxnRkFBK0Y7QUFFL0YsK0NBQW9GO0FBTXBGLGlDQUFrQixDQUFDO0lBQ2pCLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtRQUM5QixVQUFVLENBQUMsY0FBTSxPQUFBLHNCQUFlLEVBQUUsRUFBakIsQ0FBaUIsQ0FBQyxDQUFDO1FBQ3BDLFNBQVMsQ0FBQyxjQUFNLE9BQUEsc0JBQWUsRUFBRSxFQUFqQixDQUFpQixDQUFDLENBQUM7UUFFbkMsUUFBUSxDQUFDLGFBQWEsRUFBRTtZQUN0QixFQUFFLENBQUMsOEJBQThCLEVBQUUsY0FBTSxPQUFBLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBckMsQ0FBcUMsQ0FBQyxDQUFDO1lBRWhGLEVBQUUsQ0FBQyw0REFBNEQsRUFBRSxlQUFLLENBQUM7Z0JBQ2xFLElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQU01QztvQkFBQTtvQkFDQSxDQUFDO29CQURLLEdBQUc7d0JBSlIsZ0JBQVMsQ0FBQzs0QkFDVCxRQUFRLEVBQUUsS0FBSzs0QkFDZixRQUFRLEVBQUUsd0NBQXdDO3lCQUNuRCxDQUFDO3VCQUNJLEdBQUcsQ0FDUjtvQkFBRCxVQUFDO2lCQUFBLEFBREQsSUFDQztnQkFHRDtvQkFBQTtvQkFDQSxDQUFDO29CQURLLFNBQVM7d0JBRGQsZUFBUSxDQUFDLEVBQUMsWUFB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