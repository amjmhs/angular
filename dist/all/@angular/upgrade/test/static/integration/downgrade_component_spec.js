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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var platform_browser_1 = require("@angular/platform-browser");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var static_1 = require("@angular/upgrade/static");
var angular = require("@angular/upgrade/static/src/common/angular1");
var test_helpers_1 = require("../test_helpers");
test_helpers_1.withEachNg1Version(function () {
    describe('downgrade ng2 component', function () {
        beforeEach(function () { return core_1.destroyPlatform(); });
        afterEach(function () { return core_1.destroyPlatform(); });
        it('should bind properties, events', testing_1.async(function () {
            var ng1Module = angular.module('ng1', []).value('$exceptionHandler', function (err) {
                throw err;
            }).run(function ($rootScope) {
                $rootScope['name'] = 'world';
                $rootScope['dataA'] = 'A';
                $rootScope['dataB'] = 'B';
                $rootScope['modelA'] = 'initModelA';
                $rootScope['modelB'] = 'initModelB';
                $rootScope['eventA'] = '?';
                $rootScope['eventB'] = '?';
            });
            var Ng2Component = /** @class */ (function () {
                function Ng2Component() {
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
                Ng2Component.prototype.ngOnChanges = function (changes) {
                    var _this = this;
                    var assert = function (prop, value) {
                        var propVal = _this[prop];
                        if (propVal != value) {
                            throw new Error("Expected: '" + prop + "' to be '" + value + "' but was '" + propVal + "'");
                        }
                    };
                    var assertChange = function (prop, value) {
                        assert(prop, value);
                        if (!changes[prop]) {
                            throw new Error("Changes record for '" + prop + "' not found.");
                        }
                        var actualValue = changes[prop].currentValue;
                        if (actualValue != value) {
                            throw new Error("Expected changes record for'" + prop + "' to be '" + value + "' but was '" + actualValue + "'");
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
                Ng2Component = __decorate([
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
                ], Ng2Component);
                return Ng2Component;
            }());
            ng1Module.directive('ng2', static_1.downgradeComponent({
                component: Ng2Component,
            }));
            var Ng2Module = /** @class */ (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () { };
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                return Ng2Module;
            }());
            var element = test_helpers_1.html("\n           <div>\n             <ng2 literal=\"Text\" interpolate=\"Hello {{name}}\"\n                 bind-one-way-a=\"dataA\" [one-way-b]=\"dataB\"\n                 bindon-two-way-a=\"modelA\" [(two-way-b)]=\"modelB\"\n                 on-event-a='eventA=$event' (event-b)=\"eventB=$event\"></ng2>\n             | modelA: {{modelA}}; modelB: {{modelB}}; eventA: {{eventA}}; eventB: {{eventB}};\n           </div>");
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                expect(test_helpers_1.multiTrim(document.body.textContent))
                    .toEqual('ignore: -; ' +
                    'literal: Text; interpolate: Hello world; ' +
                    'oneWayA: A; oneWayB: B; twoWayA: newA; twoWayB: newB; (2) | ' +
                    'modelA: newA; modelB: newB; eventA: aFired; eventB: bFired;');
                test_helpers_1.$apply(upgrade, 'name = "everyone"');
                expect(test_helpers_1.multiTrim(document.body.textContent))
                    .toEqual('ignore: -; ' +
                    'literal: Text; interpolate: Hello everyone; ' +
                    'oneWayA: A; oneWayB: B; twoWayA: newA; twoWayB: newB; (3) | ' +
                    'modelA: newA; modelB: newB; eventA: aFired; eventB: bFired;');
            });
        }));
        it('should bind properties to onpush components', testing_1.async(function () {
            var ng1Module = angular.module('ng1', []).value('$exceptionHandler', function (err) {
                throw err;
            }).run(function ($rootScope) {
                $rootScope['dataB'] = 'B';
            });
            var Ng2Component = /** @class */ (function () {
                function Ng2Component() {
                    this.ngOnChangesCount = 0;
                    this.oneWayB = '?';
                }
                Ng2Component = __decorate([
                    core_1.Component({
                        selector: 'ng2',
                        inputs: ['oneWayB'],
                        template: 'oneWayB: {{oneWayB}}',
                        changeDetection: core_1.ChangeDetectionStrategy.OnPush
                    })
                ], Ng2Component);
                return Ng2Component;
            }());
            ng1Module.directive('ng2', static_1.downgradeComponent({
                component: Ng2Component,
            }));
            var Ng2Module = /** @class */ (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () { };
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                return Ng2Module;
            }());
            var element = test_helpers_1.html("\n          <div>\n            <ng2 [one-way-b]=\"dataB\"></ng2>\n          </div>");
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                expect(test_helpers_1.multiTrim(document.body.textContent)).toEqual('oneWayB: B');
                test_helpers_1.$apply(upgrade, 'dataB= "everyone"');
                expect(test_helpers_1.multiTrim(document.body.textContent)).toEqual('oneWayB: everyone');
            });
        }));
        it('should support two-way binding and event listener', testing_1.async(function () {
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
            ng1Module.directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
            var Ng2Module = /** @class */ (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () { };
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                return Ng2Module;
            }());
            var element = test_helpers_1.html("\n          <div>\n            <ng2 [(model)]=\"value\" (model-change)=\"listener($event)\"></ng2>\n            | value: {{value}}\n          </div>\n        ");
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                expect(test_helpers_1.multiTrim(element.textContent)).toEqual('model: newC; | value: newC');
                expect(listenerSpy).toHaveBeenCalledWith('newC');
            });
        }));
        it('should run change-detection on every digest (by default)', testing_1.async(function () {
            var ng2Component;
            var Ng2Component = /** @class */ (function () {
                function Ng2Component() {
                    this.value1 = -1;
                    this.value2 = -1;
                    ng2Component = this;
                }
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", Object)
                ], Ng2Component.prototype, "value1", void 0);
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", Object)
                ], Ng2Component.prototype, "value2", void 0);
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: '{{ value1 }} | {{ value2 }}' }),
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
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                        declarations: [Ng2Component],
                        entryComponents: [Ng2Component]
                    })
                ], Ng2Module);
                return Ng2Module;
            }());
            var ng1Module = angular.module('ng1', [])
                .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }))
                .run(function ($rootScope) {
                $rootScope.value1 = 0;
                $rootScope.value2 = 0;
            });
            var element = test_helpers_1.html('<ng2 [value1]="value1" value2="{{ value2 }}"></ng2>');
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                var $rootScope = upgrade.$injector.get('$rootScope');
                expect(element.textContent).toBe('0 | 0');
                // Digest should invoke CD
                $rootScope.$digest();
                $rootScope.$digest();
                expect(element.textContent).toBe('0 | 0');
                // Internal changes should be detected on digest
                ng2Component.value1 = 1;
                ng2Component.value2 = 2;
                $rootScope.$digest();
                expect(element.textContent).toBe('1 | 2');
                // Digest should propagate change in prop-bound input
                $rootScope.$apply('value1 = 3');
                expect(element.textContent).toBe('3 | 2');
                // Digest should propagate change in attr-bound input
                ng2Component.value1 = 4;
                $rootScope.$apply('value2 = 5');
                expect(element.textContent).toBe('4 | 5');
                // Digest should propagate changes that happened before the digest
                $rootScope.value1 = 6;
                expect(element.textContent).toBe('4 | 5');
                $rootScope.$digest();
                expect(element.textContent).toBe('6 | 5');
            });
        }));
        it('should not run change-detection on every digest when opted out', testing_1.async(function () {
            var ng2Component;
            var Ng2Component = /** @class */ (function () {
                function Ng2Component() {
                    this.value1 = -1;
                    this.value2 = -1;
                    ng2Component = this;
                }
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", Object)
                ], Ng2Component.prototype, "value1", void 0);
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", Object)
                ], Ng2Component.prototype, "value2", void 0);
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: '{{ value1 }} | {{ value2 }}' }),
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
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                        declarations: [Ng2Component],
                        entryComponents: [Ng2Component]
                    })
                ], Ng2Module);
                return Ng2Module;
            }());
            var ng1Module = angular.module('ng1', [])
                .directive('ng2', static_1.downgradeComponent({ component: Ng2Component, propagateDigest: false }))
                .run(function ($rootScope) {
                $rootScope.value1 = 0;
                $rootScope.value2 = 0;
            });
            var element = test_helpers_1.html('<ng2 [value1]="value1" value2="{{ value2 }}"></ng2>');
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                var $rootScope = upgrade.$injector.get('$rootScope');
                expect(element.textContent).toBe('0 | 0');
                // Digest should not invoke CD
                $rootScope.$digest();
                $rootScope.$digest();
                expect(element.textContent).toBe('0 | 0');
                // Digest should not invoke CD, even if component values have changed (internally)
                ng2Component.value1 = 1;
                ng2Component.value2 = 2;
                $rootScope.$digest();
                expect(element.textContent).toBe('0 | 0');
                // Digest should invoke CD, if prop-bound input has changed
                $rootScope.$apply('value1 = 3');
                expect(element.textContent).toBe('3 | 2');
                // Digest should invoke CD, if attr-bound input has changed
                ng2Component.value1 = 4;
                $rootScope.$apply('value2 = 5');
                expect(element.textContent).toBe('4 | 5');
                // Digest should invoke CD, if input has changed before the digest
                $rootScope.value1 = 6;
                $rootScope.$digest();
                expect(element.textContent).toBe('6 | 5');
            });
        }));
        it('should still run normal Angular change-detection regardless of `propagateDigest`', testing_1.fakeAsync(function () {
            var ng2Component;
            var Ng2Component = /** @class */ (function () {
                function Ng2Component() {
                    var _this = this;
                    this.value = 'foo';
                    setTimeout(function () { return _this.value = 'bar'; }, 1000);
                }
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: '{{ value }}' }),
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
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                        declarations: [Ng2Component],
                        entryComponents: [Ng2Component]
                    })
                ], Ng2Module);
                return Ng2Module;
            }());
            var ng1Module = angular.module('ng1', [])
                .directive('ng2A', static_1.downgradeComponent({ component: Ng2Component, propagateDigest: true }))
                .directive('ng2B', static_1.downgradeComponent({ component: Ng2Component, propagateDigest: false }));
            var element = test_helpers_1.html('<ng2-a></ng2-a> | <ng2-b></ng2-b>');
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                expect(element.textContent).toBe('foo | foo');
                testing_1.tick(1000);
                expect(element.textContent).toBe('bar | bar');
            });
        }));
        it('should initialize inputs in time for `ngOnChanges`', testing_1.async(function () {
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
                        template: "\n             ngOnChangesCount: {{ ngOnChangesCount }} |\n             firstChangesCount: {{ firstChangesCount }} |\n             initialValue: {{ initialValue }}"
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
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                        declarations: [Ng2Component],
                        entryComponents: [Ng2Component]
                    })
                ], Ng2Module);
                return Ng2Module;
            }());
            var ng1Module = angular.module('ng1', []).directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
            var element = test_helpers_1.html("\n           <ng2 [foo]=\"'foo'\"></ng2>\n           <ng2 foo=\"bar\"></ng2>\n           <ng2 [foo]=\"'baz'\" ng-if=\"true\"></ng2>\n           <ng2 foo=\"qux\" ng-if=\"true\"></ng2>\n         ");
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                var nodes = element.querySelectorAll('ng2');
                var expectedTextWith = function (value) {
                    return "ngOnChangesCount: 1 | firstChangesCount: 1 | initialValue: " + value;
                };
                expect(test_helpers_1.multiTrim(nodes[0].textContent)).toBe(expectedTextWith('foo'));
                expect(test_helpers_1.multiTrim(nodes[1].textContent)).toBe(expectedTextWith('bar'));
                expect(test_helpers_1.multiTrim(nodes[2].textContent)).toBe(expectedTextWith('baz'));
                expect(test_helpers_1.multiTrim(nodes[3].textContent)).toBe(expectedTextWith('qux'));
            });
        }));
        it('should bind to ng-model', testing_1.async(function () {
            var ng1Module = angular.module('ng1', []).run(function ($rootScope) { $rootScope['modelA'] = 'A'; });
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
                    core_1.Component({ selector: 'ng2', template: '<span>{{_value}}</span>' }),
                    __metadata("design:paramtypes", [])
                ], Ng2);
                return Ng2;
            }());
            ng1Module.directive('ng2', static_1.downgradeComponent({ component: Ng2 }));
            var element = test_helpers_1.html("<div><ng2 ng-model=\"modelA\"></ng2> | {{modelA}}</div>");
            var Ng2Module = /** @class */ (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () { };
                Ng2Module = __decorate([
                    core_1.NgModule({ declarations: [Ng2], entryComponents: [Ng2], imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule] })
                ], Ng2Module);
                return Ng2Module;
            }());
            platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(Ng2Module).then(function (ref) {
                var adapter = ref.injector.get(static_1.UpgradeModule);
                adapter.bootstrap(element, [ng1Module.name]);
                var $rootScope = adapter.$injector.get('$rootScope');
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
            });
        }));
        it('should properly run cleanup when ng1 directive is destroyed', testing_1.async(function () {
            var destroyed = false;
            var Ng2Component = /** @class */ (function () {
                function Ng2Component() {
                }
                Ng2Component.prototype.ngOnDestroy = function () { destroyed = true; };
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: 'test' })
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
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                return Ng2Module;
            }());
            var ng1Module = angular.module('ng1', [])
                .directive('ng1', function () { return { template: '<div ng-if="!destroyIt"><ng2></ng2></div>' }; })
                .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
            var element = test_helpers_1.html('<ng1></ng1>');
            platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(Ng2Module).then(function (ref) {
                var adapter = ref.injector.get(static_1.UpgradeModule);
                adapter.bootstrap(element, [ng1Module.name]);
                expect(element.textContent).toContain('test');
                expect(destroyed).toBe(false);
                var $rootScope = adapter.$injector.get('$rootScope');
                $rootScope.$apply('destroyIt = true');
                expect(element.textContent).not.toContain('test');
                expect(destroyed).toBe(true);
            });
        }));
        it('should properly run cleanup with multiple levels of nesting', testing_1.async(function () {
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
                    core_1.Component({
                        selector: 'ng2-outer',
                        template: '<div *ngIf="!destroyIt"><ng1></ng1></div>',
                    })
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
            var Ng1ComponentFacade = /** @class */ (function (_super) {
                __extends(Ng1ComponentFacade, _super);
                function Ng1ComponentFacade(elementRef, injector) {
                    return _super.call(this, 'ng1', elementRef, injector) || this;
                }
                Ng1ComponentFacade = __decorate([
                    core_1.Directive({ selector: 'ng1' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentFacade);
                return Ng1ComponentFacade;
            }(static_1.UpgradeComponent));
            var Ng2Module = /** @class */ (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () { };
                Ng2Module = __decorate([
                    core_1.NgModule({
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                        declarations: [Ng1ComponentFacade, Ng2InnerComponent, Ng2OuterComponent],
                        entryComponents: [Ng2InnerComponent, Ng2OuterComponent],
                    })
                ], Ng2Module);
                return Ng2Module;
            }());
            var ng1Module = angular.module('ng1', [])
                .directive('ng1', function () { return ({ template: '<ng2-inner></ng2-inner>' }); })
                .directive('ng2Inner', static_1.downgradeComponent({ component: Ng2InnerComponent }))
                .directive('ng2Outer', static_1.downgradeComponent({ component: Ng2OuterComponent }));
            var element = test_helpers_1.html('<ng2-outer [destroy-it]="destroyIt"></ng2-outer>');
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                expect(element.textContent).toBe('test');
                expect(destroyed).toBe(false);
                test_helpers_1.$apply(upgrade, 'destroyIt = true');
                expect(element.textContent).toBe('');
                expect(destroyed).toBe(true);
            });
        }));
        it('should work when compiled outside the dom (by fallback to the root ng2.injector)', testing_1.async(function () {
            var Ng2Component = /** @class */ (function () {
                function Ng2Component() {
                }
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: 'test' })
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
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                return Ng2Module;
            }());
            var ng1Module = angular.module('ng1', [])
                .directive('ng1', [
                '$compile',
                function ($compile) {
                    return {
                        link: function ($scope, $element, $attrs) {
                            // here we compile some HTML that contains a downgraded component
                            // since it is not currently in the DOM it is not able to "require"
                            // an ng2 injector so it should use the `moduleInjector` instead.
                            var compiled = $compile('<ng2></ng2>');
                            var template = compiled($scope);
                            $element.append(template);
                        }
                    };
                }
            ])
                .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
            var element = test_helpers_1.html('<ng1></ng1>');
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                // the fact that the body contains the correct text means that the
                // downgraded component was able to access the moduleInjector
                // (since there is no other injector in this system)
                expect(test_helpers_1.multiTrim(document.body.textContent)).toEqual('test');
            });
        }));
        it('should allow attribute selectors for downgraded components', testing_1.async(function () {
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
                Ng2Module.prototype.ngDoBootstrap = function () { };
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [WorksComponent],
                        entryComponents: [WorksComponent],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                return Ng2Module;
            }());
            var ng1Module = angular.module('ng1', []).directive('worksComponent', static_1.downgradeComponent({ component: WorksComponent }));
            var element = test_helpers_1.html('<works-component></works-component>');
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                expect(test_helpers_1.multiTrim(document.body.textContent)).toBe('It works');
            });
        }));
        it('should allow attribute selectors for components in ng2', testing_1.async(function () {
            var WorksComponent = /** @class */ (function () {
                function WorksComponent() {
                }
                WorksComponent = __decorate([
                    core_1.Component({ selector: '[itWorks]', template: 'It works' })
                ], WorksComponent);
                return WorksComponent;
            }());
            var RootComponent = /** @class */ (function () {
                function RootComponent() {
                }
                RootComponent = __decorate([
                    core_1.Component({ selector: 'root-component', template: '<span itWorks></span>!' })
                ], RootComponent);
                return RootComponent;
            }());
            var Ng2Module = /** @class */ (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () { };
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [RootComponent, WorksComponent],
                        entryComponents: [RootComponent],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                return Ng2Module;
            }());
            var ng1Module = angular.module('ng1', []).directive('rootComponent', static_1.downgradeComponent({ component: RootComponent }));
            var element = test_helpers_1.html('<root-component></root-component>');
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                expect(test_helpers_1.multiTrim(document.body.textContent)).toBe('It works!');
            });
        }));
        it('should respect hierarchical dependency injection for ng2', testing_1.async(function () {
            var ParentComponent = /** @class */ (function () {
                function ParentComponent() {
                }
                ParentComponent = __decorate([
                    core_1.Component({ selector: 'parent', template: 'parent(<ng-content></ng-content>)' })
                ], ParentComponent);
                return ParentComponent;
            }());
            var ChildComponent = /** @class */ (function () {
                function ChildComponent(parent) {
                }
                ChildComponent = __decorate([
                    core_1.Component({ selector: 'child', template: 'child' }),
                    __metadata("design:paramtypes", [ParentComponent])
                ], ChildComponent);
                return ChildComponent;
            }());
            var Ng2Module = /** @class */ (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () { };
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [ParentComponent, ChildComponent],
                        entryComponents: [ParentComponent, ChildComponent],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                return Ng2Module;
            }());
            var ng1Module = angular.module('ng1', [])
                .directive('parent', static_1.downgradeComponent({ component: ParentComponent }))
                .directive('child', static_1.downgradeComponent({ component: ChildComponent }));
            var element = test_helpers_1.html('<parent><child></child></parent>');
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                expect(test_helpers_1.multiTrim(document.body.textContent)).toBe('parent(child)');
            });
        }));
        it('should work with ng2 lazy loaded components', testing_1.async(function () {
            var componentInjector;
            var Ng2Component = /** @class */ (function () {
                function Ng2Component(injector) {
                    componentInjector = injector;
                }
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: '' }),
                    __metadata("design:paramtypes", [core_1.Injector])
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
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                    })
                ], Ng2Module);
                return Ng2Module;
            }());
            var LazyLoadedComponent = /** @class */ (function () {
                function LazyLoadedComponent(module) {
                    this.module = module;
                }
                LazyLoadedComponent = __decorate([
                    core_1.Component({ template: '' }),
                    __metadata("design:paramtypes", [core_1.NgModuleRef])
                ], LazyLoadedComponent);
                return LazyLoadedComponent;
            }());
            var LazyLoadedModule = /** @class */ (function () {
                function LazyLoadedModule() {
                }
                LazyLoadedModule = __decorate([
                    core_1.NgModule({
                        declarations: [LazyLoadedComponent],
                        entryComponents: [LazyLoadedComponent],
                    })
                ], LazyLoadedModule);
                return LazyLoadedModule;
            }());
            var ng1Module = angular.module('ng1', []).directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
            var element = test_helpers_1.html('<ng2></ng2>');
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                var modInjector = upgrade.injector;
                // Emulate the router lazy loading a module and creating a component
                var compiler = modInjector.get(core_1.Compiler);
                var modFactory = compiler.compileModuleSync(LazyLoadedModule);
                var childMod = modFactory.create(modInjector);
                var cmpFactory = childMod.componentFactoryResolver.resolveComponentFactory(LazyLoadedComponent);
                var lazyCmp = cmpFactory.create(componentInjector);
                expect(lazyCmp.instance.module.injector).toBe(childMod.injector);
            });
        }));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmdyYWRlX2NvbXBvbmVudF9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvdXBncmFkZS90ZXN0L3N0YXRpYy9pbnRlZ3JhdGlvbi9kb3duZ3JhZGVfY29tcG9uZW50X3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsc0NBQW1RO0FBQ25RLGlEQUE2RDtBQUM3RCw4REFBd0Q7QUFDeEQsOEVBQXlFO0FBQ3pFLGtEQUE0RjtBQUM1RixxRUFBdUU7QUFFdkUsZ0RBQXVGO0FBRXZGLGlDQUFrQixDQUFDO0lBQ2pCLFFBQVEsQ0FBQyx5QkFBeUIsRUFBRTtRQUVsQyxVQUFVLENBQUMsY0FBTSxPQUFBLHNCQUFlLEVBQUUsRUFBakIsQ0FBaUIsQ0FBQyxDQUFDO1FBQ3BDLFNBQVMsQ0FBQyxjQUFNLE9BQUEsc0JBQWUsRUFBRSxFQUFqQixDQUFpQixDQUFDLENBQUM7UUFFbkMsRUFBRSxDQUFDLGdDQUFnQyxFQUFFLGVBQUssQ0FBQztZQUN0QyxJQUFNLFNBQVMsR0FDWCxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsbUJBQW1CLEVBQUUsVUFBQyxHQUFRO2dCQUNuQyxNQUFNLEdBQUcsQ0FBQztZQUNaLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFDLFVBQTBCO2dCQUN6RCxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDO2dCQUM3QixVQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFDO2dCQUMxQixVQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFDO2dCQUMxQixVQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsWUFBWSxDQUFDO2dCQUNwQyxVQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsWUFBWSxDQUFDO2dCQUNwQyxV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