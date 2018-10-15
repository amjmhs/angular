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
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var platform_browser_1 = require("@angular/platform-browser");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var static_1 = require("@angular/upgrade/static");
var angular = require("@angular/upgrade/static/src/common/angular1");
var constants_1 = require("@angular/upgrade/static/src/common/constants");
var test_helpers_1 = require("../test_helpers");
test_helpers_1.withEachNg1Version(function () {
    describe('upgrade ng1 component', function () {
        beforeEach(function () { return core_1.destroyPlatform(); });
        afterEach(function () { return core_1.destroyPlatform(); });
        describe('template/templateUrl', function () {
            it('should support `template` (string)', testing_1.async(function () {
                // Define `ng1Component`
                var ng1Component = { template: 'Hello, Angular!' };
                // Define `Ng1ComponentFacade`
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
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Hello, Angular!');
                });
            }));
            it('should support `template` (function)', testing_1.async(function () {
                // Define `ng1Component`
                var ng1Component = { template: function () { return 'Hello, Angular!'; } };
                // Define `Ng1ComponentFacade`
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
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Hello, Angular!');
                });
            }));
            it('should support not pass any arguments to `template` function', testing_1.async(function () {
                // Define `ng1Component`
                var ng1Component = {
                    template: function ($attrs, $element) {
                        expect($attrs).toBeUndefined();
                        expect($element).toBeUndefined();
                        return 'Hello, Angular!';
                    }
                };
                // Define `Ng1ComponentFacade`
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
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Hello, Angular!');
                });
            }));
            it('should support `templateUrl` (string) fetched from `$templateCache`', testing_1.async(function () {
                // Define `ng1Component`
                var ng1Component = { templateUrl: 'ng1.component.html' };
                // Define `Ng1ComponentFacade`
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
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }))
                    .run(function ($templateCache) {
                    return $templateCache.put('ng1.component.html', 'Hello, Angular!');
                });
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Hello, Angular!');
                });
            }));
            it('should support `templateUrl` (function) fetched from `$templateCache`', testing_1.async(function () {
                // Define `ng1Component`
                var ng1Component = { templateUrl: function () { return 'ng1.component.html'; } };
                // Define `Ng1ComponentFacade`
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
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }))
                    .run(function ($templateCache) {
                    return $templateCache.put('ng1.component.html', 'Hello, Angular!');
                });
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Hello, Angular!');
                });
            }));
            it('should support not pass any arguments to `templateUrl` function', testing_1.async(function () {
                // Define `ng1Component`
                var ng1Component = {
                    templateUrl: function ($attrs, $element) {
                        expect($attrs).toBeUndefined();
                        expect($element).toBeUndefined();
                        return 'ng1.component.html';
                    }
                };
                // Define `Ng1ComponentFacade`
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
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }))
                    .run(function ($templateCache) {
                    return $templateCache.put('ng1.component.html', 'Hello, Angular!');
                });
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Hello, Angular!');
                });
            }));
            // NOT SUPPORTED YET
            xit('should support `templateUrl` (string) fetched from the server', testing_1.fakeAsync(function () {
                // Define `ng1Component`
                var ng1Component = { templateUrl: 'ng1.component.html' };
                // Define `Ng1ComponentFacade`
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
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }))
                    .value('$httpBackend', function (method, url, post, callback) {
                    return setTimeout(function () { return callback(200, (method + ":" + url).toLowerCase()); }, 1000);
                });
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    testing_1.tick(500);
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('');
                    testing_1.tick(500);
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('get:ng1.component.html');
                });
            }));
            // NOT SUPPORTED YET
            xit('should support `templateUrl` (function) fetched from the server', testing_1.fakeAsync(function () {
                // Define `ng1Component`
                var ng1Component = { templateUrl: function () { return 'ng1.component.html'; } };
                // Define `Ng1ComponentFacade`
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
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }))
                    .value('$httpBackend', function (method, url, post, callback) {
                    return setTimeout(function () { return callback(200, (method + ":" + url).toLowerCase()); }, 1000);
                });
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    testing_1.tick(500);
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('');
                    testing_1.tick(500);
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('get:ng1.component.html');
                });
            }));
            it('should support empty templates', testing_1.async(function () {
                // Define `ng1Component`s
                var ng1ComponentA = { template: '' };
                var ng1ComponentB = { template: function () { return ''; } };
                var ng1ComponentC = { templateUrl: 'ng1.component.html' };
                var ng1ComponentD = { templateUrl: function () { return 'ng1.component.html'; } };
                // Define `Ng1ComponentFacade`s
                var Ng1ComponentAFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentAFacade, _super);
                    function Ng1ComponentAFacade(e, i) {
                        return _super.call(this, 'ng1A', e, i) || this;
                    }
                    Ng1ComponentAFacade = __decorate([
                        core_1.Directive({ selector: 'ng1A' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentAFacade);
                    return Ng1ComponentAFacade;
                }(static_1.UpgradeComponent));
                var Ng1ComponentBFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentBFacade, _super);
                    function Ng1ComponentBFacade(e, i) {
                        return _super.call(this, 'ng1B', e, i) || this;
                    }
                    Ng1ComponentBFacade = __decorate([
                        core_1.Directive({ selector: 'ng1B' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentBFacade);
                    return Ng1ComponentBFacade;
                }(static_1.UpgradeComponent));
                var Ng1ComponentCFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentCFacade, _super);
                    function Ng1ComponentCFacade(e, i) {
                        return _super.call(this, 'ng1C', e, i) || this;
                    }
                    Ng1ComponentCFacade = __decorate([
                        core_1.Directive({ selector: 'ng1C' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentCFacade);
                    return Ng1ComponentCFacade;
                }(static_1.UpgradeComponent));
                var Ng1ComponentDFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentDFacade, _super);
                    function Ng1ComponentDFacade(e, i) {
                        return _super.call(this, 'ng1D', e, i) || this;
                    }
                    Ng1ComponentDFacade = __decorate([
                        core_1.Directive({ selector: 'ng1D' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentDFacade);
                    return Ng1ComponentDFacade;
                }(static_1.UpgradeComponent));
                // Define `Ng2Component`
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component() {
                    }
                    Ng2Component = __decorate([
                        core_1.Component({
                            selector: 'ng2',
                            template: "\n               <ng1A>Ignore this</ng1A>\n               <ng1B>Ignore this</ng1B>\n               <ng1C>Ignore this</ng1C>\n               <ng1D>Ignore this</ng1D>\n             "
                        })
                    ], Ng2Component);
                    return Ng2Component;
                }());
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1A', ng1ComponentA)
                    .component('ng1B', ng1ComponentB)
                    .component('ng1C', ng1ComponentC)
                    .component('ng1D', ng1ComponentD)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }))
                    .run(function ($templateCache) {
                    return $templateCache.put('ng1.component.html', '');
                });
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [
                                Ng1ComponentAFacade, Ng1ComponentBFacade, Ng1ComponentCFacade, Ng1ComponentDFacade,
                                Ng2Component
                            ],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                            schemas: [core_1.NO_ERRORS_SCHEMA]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('');
                });
            }));
        });
        describe('bindings', function () {
            it('should support `@` bindings', testing_1.fakeAsync(function () {
                var ng2ComponentInstance;
                // Define `ng1Component`
                var ng1Component = {
                    template: 'Inside: {{ $ctrl.inputA }}, {{ $ctrl.inputB }}',
                    bindings: { inputA: '@inputAttrA', inputB: '@' }
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    __decorate([
                        core_1.Input('inputAttrA'),
                        __metadata("design:type", String)
                    ], Ng1ComponentFacade.prototype, "inputA", void 0);
                    __decorate([
                        core_1.Input(),
                        __metadata("design:type", String)
                    ], Ng1ComponentFacade.prototype, "inputB", void 0);
                    Ng1ComponentFacade = __decorate([
                        core_1.Directive({ selector: 'ng1' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentFacade);
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
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
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    var ng1 = element.querySelector('ng1');
                    var ng1Controller = angular.element(ng1).controller('ng1');
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Inside: foo, bar | Outside: foo, bar');
                    ng1Controller.inputA = 'baz';
                    ng1Controller.inputB = 'qux';
                    testing_1.tick();
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Inside: baz, qux | Outside: foo, bar');
                    ng2ComponentInstance.dataA = 'foo2';
                    ng2ComponentInstance.dataB = 'bar2';
                    test_helpers_1.$digest(adapter);
                    testing_1.tick();
                    expect(test_helpers_1.multiTrim(element.textContent))
                        .toBe('Inside: foo2, bar2 | Outside: foo2, bar2');
                });
            }));
            it('should support `<` bindings', testing_1.fakeAsync(function () {
                var ng2ComponentInstance;
                // Define `ng1Component`
                var ng1Component = {
                    template: 'Inside: {{ $ctrl.inputA.value }}, {{ $ctrl.inputB.value }}',
                    bindings: { inputA: '<inputAttrA', inputB: '<' }
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    __decorate([
                        core_1.Input('inputAttrA'),
                        __metadata("design:type", String)
                    ], Ng1ComponentFacade.prototype, "inputA", void 0);
                    __decorate([
                        core_1.Input(),
                        __metadata("design:type", String)
                    ], Ng1ComponentFacade.prototype, "inputB", void 0);
                    Ng1ComponentFacade = __decorate([
                        core_1.Directive({ selector: 'ng1' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentFacade);
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
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
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    var ng1 = element.querySelector('ng1');
                    var ng1Controller = angular.element(ng1).controller('ng1');
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Inside: foo, bar | Outside: foo, bar');
                    ng1Controller.inputA = { value: 'baz' };
                    ng1Controller.inputB = { value: 'qux' };
                    testing_1.tick();
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Inside: baz, qux | Outside: foo, bar');
                    ng2ComponentInstance.dataA = { value: 'foo2' };
                    ng2ComponentInstance.dataB = { value: 'bar2' };
                    test_helpers_1.$digest(adapter);
                    testing_1.tick();
                    expect(test_helpers_1.multiTrim(element.textContent))
                        .toBe('Inside: foo2, bar2 | Outside: foo2, bar2');
                });
            }));
            it('should support `=` bindings', testing_1.fakeAsync(function () {
                var ng2ComponentInstance;
                // Define `ng1Component`
                var ng1Component = {
                    template: 'Inside: {{ $ctrl.inputA.value }}, {{ $ctrl.inputB.value }}',
                    bindings: { inputA: '=inputAttrA', inputB: '=' }
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    __decorate([
                        core_1.Input('inputAttrA'),
                        __metadata("design:type", String)
                    ], Ng1ComponentFacade.prototype, "inputA", void 0);
                    __decorate([
                        core_1.Output('inputAttrAChange'),
                        __metadata("design:type", core_1.EventEmitter)
                    ], Ng1ComponentFacade.prototype, "inputAChange", void 0);
                    __decorate([
                        core_1.Input(),
                        __metadata("design:type", String)
                    ], Ng1ComponentFacade.prototype, "inputB", void 0);
                    __decorate([
                        core_1.Output(),
                        __metadata("design:type", core_1.EventEmitter)
                    ], Ng1ComponentFacade.prototype, "inputBChange", void 0);
                    Ng1ComponentFacade = __decorate([
                        core_1.Directive({ selector: 'ng1' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentFacade);
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
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
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    var ng1 = element.querySelector('ng1');
                    var ng1Controller = angular.element(ng1).controller('ng1');
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Inside: foo, bar | Outside: foo, bar');
                    ng1Controller.inputA = { value: 'baz' };
                    ng1Controller.inputB = { value: 'qux' };
                    testing_1.tick();
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Inside: baz, qux | Outside: baz, qux');
                    ng2ComponentInstance.dataA = { value: 'foo2' };
                    ng2ComponentInstance.dataB = { value: 'bar2' };
                    test_helpers_1.$digest(adapter);
                    testing_1.tick();
                    expect(test_helpers_1.multiTrim(element.textContent))
                        .toBe('Inside: foo2, bar2 | Outside: foo2, bar2');
                });
            }));
            it('should support `&` bindings', testing_1.fakeAsync(function () {
                // Define `ng1Component`
                var ng1Component = {
                    template: 'Inside: -',
                    bindings: { outputA: '&outputAttrA', outputB: '&' }
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    __decorate([
                        core_1.Output('outputAttrA'),
                        __metadata("design:type", core_1.EventEmitter)
                    ], Ng1ComponentFacade.prototype, "outputA", void 0);
                    __decorate([
                        core_1.Output(),
                        __metadata("design:type", core_1.EventEmitter)
                    ], Ng1ComponentFacade.prototype, "outputB", void 0);
                    Ng1ComponentFacade = __decorate([
                        core_1.Directive({ selector: 'ng1' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentFacade);
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
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
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    var ng1 = element.querySelector('ng1');
                    var ng1Controller = angular.element(ng1).controller('ng1');
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Inside: - | Outside: foo, bar');
                    ng1Controller.outputA('baz');
                    ng1Controller.outputB('qux');
                    testing_1.tick();
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Inside: - | Outside: baz, qux');
                });
            }));
            it('should bind properties, events', testing_1.fakeAsync(function () {
                // Define `ng1Component`
                var ng1Component = {
                    template: "\n               Hello {{ $ctrl.fullName }};\n               A: {{ $ctrl.modelA }};\n               B: {{ $ctrl.modelB }};\n               C: {{ $ctrl.modelC }}\n             ",
                    bindings: { fullName: '@', modelA: '<dataA', modelB: '=dataB', modelC: '=', event: '&' },
                    controller: function ($scope) {
                        var _this = this;
                        $scope.$watch('$ctrl.modelB', function (v) {
                            if (v === 'Savkin') {
                                _this.modelB = 'SAVKIN';
                                _this.event('WORKS');
                                // Should not update because `modelA: '<dataA'` is uni-directional.
                                _this.modelA = 'VICTOR';
                                // Should not update because `[modelC]` is uni-directional.
                                _this.modelC = 'sf';
                            }
                        });
                    }
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    __decorate([
                        core_1.Input(),
                        __metadata("design:type", String)
                    ], Ng1ComponentFacade.prototype, "fullName", void 0);
                    __decorate([
                        core_1.Input('dataA'),
                        __metadata("design:type", Object)
                    ], Ng1ComponentFacade.prototype, "modelA", void 0);
                    __decorate([
                        core_1.Input('dataB'),
                        __metadata("design:type", Object)
                    ], Ng1ComponentFacade.prototype, "modelB", void 0);
                    __decorate([
                        core_1.Output('dataBChange'),
                        __metadata("design:type", core_1.EventEmitter)
                    ], Ng1ComponentFacade.prototype, "modelBChange", void 0);
                    __decorate([
                        core_1.Input(),
                        __metadata("design:type", Object)
                    ], Ng1ComponentFacade.prototype, "modelC", void 0);
                    __decorate([
                        core_1.Output(),
                        __metadata("design:type", core_1.EventEmitter)
                    ], Ng1ComponentFacade.prototype, "modelCChange", void 0);
                    __decorate([
                        core_1.Output(),
                        __metadata("design:type", core_1.EventEmitter)
                    ], Ng1ComponentFacade.prototype, "event", void 0);
                    Ng1ComponentFacade = __decorate([
                        core_1.Directive({ selector: 'ng1' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentFacade);
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
                // Define `Ng2Component`
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component() {
                        this.first = 'Victor';
                        this.last = 'Savkin';
                        this.city = 'SF';
                        this.event = '?';
                    }
                    Ng2Component = __decorate([
                        core_1.Component({
                            selector: 'ng2',
                            template: "\n               <ng1 fullName=\"{{ last }}, {{ first }}, {{ city }}\"\n                   [(dataA)]=\"first\" [(dataB)]=\"last\" [modelC]=\"city\"\n                   (event)=\"event = $event\">\n               </ng1> |\n               <ng1 fullName=\"{{ 'TEST' }}\" dataA=\"First\" dataB=\"Last\" modelC=\"City\"></ng1> |\n               {{ event }} - {{ last }}, {{ first }}, {{ city }}\n             "
                        })
                    ], Ng2Component);
                    return Ng2Component;
                }());
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(test_helpers_1.multiTrim(element.textContent))
                        .toBe('Hello Savkin, Victor, SF; A: VICTOR; B: SAVKIN; C: sf | ' +
                        'Hello TEST; A: First; B: Last; C: City | ' +
                        'WORKS - SAVKIN, Victor, SF');
                    // Detect changes
                    testing_1.tick();
                    expect(test_helpers_1.multiTrim(element.textContent))
                        .toBe('Hello SAVKIN, Victor, SF; A: VICTOR; B: SAVKIN; C: sf | ' +
                        'Hello TEST; A: First; B: Last; C: City | ' +
                        'WORKS - SAVKIN, Victor, SF');
                });
            }));
            it('should bind optional properties', testing_1.fakeAsync(function () {
                // Define `ng1Component`
                var ng1Component = {
                    template: 'Inside: {{ $ctrl.inputA.value }}, {{ $ctrl.inputB }}',
                    bindings: { inputA: '=?inputAttrA', inputB: '=?', outputA: '&?outputAttrA', outputB: '&?' }
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    __decorate([
                        core_1.Input('inputAttrA'),
                        __metadata("design:type", String)
                    ], Ng1ComponentFacade.prototype, "inputA", void 0);
                    __decorate([
                        core_1.Output('inputAttrAChange'),
                        __metadata("design:type", core_1.EventEmitter)
                    ], Ng1ComponentFacade.prototype, "inputAChange", void 0);
                    __decorate([
                        core_1.Input(),
                        __metadata("design:type", String)
                    ], Ng1ComponentFacade.prototype, "inputB", void 0);
                    __decorate([
                        core_1.Output(),
                        __metadata("design:type", core_1.EventEmitter)
                    ], Ng1ComponentFacade.prototype, "inputBChange", void 0);
                    __decorate([
                        core_1.Output('outputAttrA'),
                        __metadata("design:type", core_1.EventEmitter)
                    ], Ng1ComponentFacade.prototype, "outputA", void 0);
                    __decorate([
                        core_1.Output(),
                        __metadata("design:type", core_1.EventEmitter)
                    ], Ng1ComponentFacade.prototype, "outputB", void 0);
                    Ng1ComponentFacade = __decorate([
                        core_1.Directive({ selector: 'ng1' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentFacade);
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
                // Define `Ng2Component`
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component() {
                        this.dataA = { value: 'foo' };
                        this.dataB = { value: 'bar' };
                    }
                    Ng2Component.prototype.updateDataB = function (value) { this.dataB.value = value; };
                    Ng2Component = __decorate([
                        core_1.Component({
                            selector: 'ng2',
                            template: "\n               <ng1 [(inputAttrA)]=\"dataA\" [(inputB)]=\"dataB.value\"></ng1> |\n               <ng1 inputB=\"Bar\" (outputAttrA)=\"dataA = $event\"></ng1> |\n               <ng1 (outputB)=\"updateDataB($event)\"></ng1> |\n               <ng1></ng1> |\n               Outside: {{ dataA.value }}, {{ dataB.value }}\n             "
                        })
                    ], Ng2Component);
                    return Ng2Component;
                }());
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    var ng1s = element.querySelectorAll('ng1');
                    var ng1Controller0 = angular.element(ng1s[0]).controller('ng1');
                    var ng1Controller1 = angular.element(ng1s[1]).controller('ng1');
                    var ng1Controller2 = angular.element(ng1s[2]).controller('ng1');
                    expect(test_helpers_1.multiTrim(element.textContent))
                        .toBe('Inside: foo, bar | Inside: , Bar | Inside: , | Inside: , | Outside: foo, bar');
                    ng1Controller0.inputA.value = 'baz';
                    ng1Controller0.inputB = 'qux';
                    testing_1.tick();
                    expect(test_helpers_1.multiTrim(element.textContent))
                        .toBe('Inside: baz, qux | Inside: , Bar | Inside: , | Inside: , | Outside: baz, qux');
                    ng1Controller1.outputA({ value: 'foo again' });
                    ng1Controller2.outputB('bar again');
                    test_helpers_1.$digest(adapter);
                    testing_1.tick();
                    expect(ng1Controller0.inputA).toEqual({ value: 'foo again' });
                    expect(ng1Controller0.inputB).toEqual('bar again');
                    expect(test_helpers_1.multiTrim(element.textContent))
                        .toBe('Inside: foo again, bar again | Inside: , Bar | Inside: , | Inside: , | ' +
                        'Outside: foo again, bar again');
                });
            }));
            it('should bind properties, events to scope when bindToController is not used', testing_1.fakeAsync(function () {
                // Define `ng1Directive`
                var ng1Directive = {
                    template: '{{ someText }} - Data: {{ inputA }} - Length: {{ inputA.length }}',
                    scope: { inputA: '=', outputA: '&' },
                    controller: function ($scope) {
                        $scope['someText'] = 'ng1';
                        this.$scope = $scope;
                    }
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    __decorate([
                        core_1.Input(),
                        __metadata("design:type", String)
                    ], Ng1ComponentFacade.prototype, "inputA", void 0);
                    __decorate([
                        core_1.Output(),
                        __metadata("design:type", core_1.EventEmitter)
                    ], Ng1ComponentFacade.prototype, "inputAChange", void 0);
                    __decorate([
                        core_1.Output(),
                        __metadata("design:type", core_1.EventEmitter)
                    ], Ng1ComponentFacade.prototype, "outputA", void 0);
                    Ng1ComponentFacade = __decorate([
                        core_1.Directive({ selector: '[ng1]' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentFacade);
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
                // Define `Ng2Component`
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component() {
                        this.someText = 'ng2';
                        this.dataA = [1, 2, 3];
                    }
                    Ng2Component = __decorate([
                        core_1.Component({
                            selector: 'ng2',
                            template: "\n                <div ng1 [(inputA)]=\"dataA\" (outputA)=\"dataA.push($event)\"></div> |\n                {{ someText }} - Data: {{ dataA }} - Length: {{ dataA.length }}\n              "
                        })
                    ], Ng2Component);
                    return Ng2Component;
                }());
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .directive('ng1', function () { return ng1Directive; })
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    var ng1 = element.querySelector('[ng1]');
                    var ng1Controller = angular.element(ng1).controller('ng1');
                    expect(test_helpers_1.multiTrim(element.textContent))
                        .toBe('ng1 - Data: [1,2,3] - Length: 3 | ng2 - Data: 1,2,3 - Length: 3');
                    ng1Controller.$scope.inputA = [4, 5];
                    testing_1.tick();
                    expect(test_helpers_1.multiTrim(element.textContent))
                        .toBe('ng1 - Data: [4,5] - Length: 2 | ng2 - Data: 4,5 - Length: 2');
                    ng1Controller.$scope.outputA(6);
                    test_helpers_1.$digest(adapter);
                    testing_1.tick();
                    expect(ng1Controller.$scope.inputA).toEqual([4, 5, 6]);
                    expect(test_helpers_1.multiTrim(element.textContent))
                        .toBe('ng1 - Data: [4,5,6] - Length: 3 | ng2 - Data: 4,5,6 - Length: 3');
                });
            }));
        });
        describe('compiling', function () {
            it('should compile the ng1 template in the correct DOM context', testing_1.async(function () {
                var grandParentNodeName;
                // Define `ng1Component`
                var ng1ComponentA = { template: 'ng1A(<ng1-b></ng1-b>)' };
                var ng1DirectiveB = {
                    compile: function (tElem) {
                        grandParentNodeName = tElem.parent().parent()[0].nodeName;
                        return {};
                    }
                };
                // Define `Ng1ComponentAFacade`
                var Ng1ComponentAFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentAFacade, _super);
                    function Ng1ComponentAFacade(elementRef, injector) {
                        return _super.call(this, 'ng1A', elementRef, injector) || this;
                    }
                    Ng1ComponentAFacade = __decorate([
                        core_1.Directive({ selector: 'ng1A' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentAFacade);
                    return Ng1ComponentAFacade;
                }(static_1.UpgradeComponent));
                // Define `Ng2ComponentX`
                var Ng2ComponentX = /** @class */ (function () {
                    function Ng2ComponentX() {
                    }
                    Ng2ComponentX = __decorate([
                        core_1.Component({ selector: 'ng2-x', template: 'ng2X(<ng1A></ng1A>)' })
                    ], Ng2ComponentX);
                    return Ng2ComponentX;
                }());
                // Define `ng1Module`
                var ng1Module = angular.module('ng1', [])
                    .component('ng1A', ng1ComponentA)
                    .directive('ng1B', function () { return ng1DirectiveB; })
                    .directive('ng2X', static_1.downgradeComponent({ component: Ng2ComponentX }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                            declarations: [Ng1ComponentAFacade, Ng2ComponentX],
                            entryComponents: [Ng2ComponentX],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2-x></ng2-x>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(grandParentNodeName).toBe('NG2-X');
                });
            }));
        });
        describe('linking', function () {
            it('should run the pre-linking after instantiating the controller', testing_1.async(function () {
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
                // Define `Ng1ComponentFacade`
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
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                            declarations: [Ng1ComponentFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(log).toEqual(['ng1-ctrl', 'ng1-pre']);
                });
            }));
            it('should run the pre-linking function before linking', testing_1.async(function () {
                var log = [];
                // Define `ng1Directive`
                var ng1DirectiveA = {
                    template: '<ng1-b></ng1-b>',
                    link: { pre: function () { return log.push('ng1A-pre'); } }
                };
                var ng1DirectiveB = { link: function () { return log.push('ng1B-post'); } };
                // Define `Ng1ComponentAFacade`
                var Ng1ComponentAFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentAFacade, _super);
                    function Ng1ComponentAFacade(elementRef, injector) {
                        return _super.call(this, 'ng1A', elementRef, injector) || this;
                    }
                    Ng1ComponentAFacade = __decorate([
                        core_1.Directive({ selector: 'ng1A' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentAFacade);
                    return Ng1ComponentAFacade;
                }(static_1.UpgradeComponent));
                // Define `Ng2Component`
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component() {
                    }
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<ng1A></ng1A>' })
                    ], Ng2Component);
                    return Ng2Component;
                }());
                // Define `ng1Module`
                var ng1Module = angular.module('ng1', [])
                    .directive('ng1A', function () { return ng1DirectiveA; })
                    .directive('ng1B', function () { return ng1DirectiveB; })
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                            declarations: [Ng1ComponentAFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(log).toEqual(['ng1A-pre', 'ng1B-post']);
                });
            }));
            it('should run the post-linking function after linking (link: object)', testing_1.async(function () {
                var log = [];
                // Define `ng1Directive`
                var ng1DirectiveA = {
                    template: '<ng1-b></ng1-b>',
                    link: { post: function () { return log.push('ng1A-post'); } }
                };
                var ng1DirectiveB = { link: function () { return log.push('ng1B-post'); } };
                // Define `Ng1ComponentAFacade`
                var Ng1ComponentAFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentAFacade, _super);
                    function Ng1ComponentAFacade(elementRef, injector) {
                        return _super.call(this, 'ng1A', elementRef, injector) || this;
                    }
                    Ng1ComponentAFacade = __decorate([
                        core_1.Directive({ selector: 'ng1A' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentAFacade);
                    return Ng1ComponentAFacade;
                }(static_1.UpgradeComponent));
                // Define `Ng2Component`
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component() {
                    }
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<ng1A></ng1A>' })
                    ], Ng2Component);
                    return Ng2Component;
                }());
                // Define `ng1Module`
                var ng1Module = angular.module('ng1', [])
                    .directive('ng1A', function () { return ng1DirectiveA; })
                    .directive('ng1B', function () { return ng1DirectiveB; })
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                            declarations: [Ng1ComponentAFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(log).toEqual(['ng1B-post', 'ng1A-post']);
                });
            }));
            it('should run the post-linking function after linking (link: function)', testing_1.async(function () {
                var log = [];
                // Define `ng1Directive`
                var ng1DirectiveA = {
                    template: '<ng1-b></ng1-b>',
                    link: function () { return log.push('ng1A-post'); }
                };
                var ng1DirectiveB = { link: function () { return log.push('ng1B-post'); } };
                // Define `Ng1ComponentAFacade`
                var Ng1ComponentAFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentAFacade, _super);
                    function Ng1ComponentAFacade(elementRef, injector) {
                        return _super.call(this, 'ng1A', elementRef, injector) || this;
                    }
                    Ng1ComponentAFacade = __decorate([
                        core_1.Directive({ selector: 'ng1A' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentAFacade);
                    return Ng1ComponentAFacade;
                }(static_1.UpgradeComponent));
                // Define `Ng2Component`
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component() {
                    }
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<ng1A></ng1A>' })
                    ], Ng2Component);
                    return Ng2Component;
                }());
                // Define `ng1Module`
                var ng1Module = angular.module('ng1', [])
                    .directive('ng1A', function () { return ng1DirectiveA; })
                    .directive('ng1B', function () { return ng1DirectiveB; })
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                            declarations: [Ng1ComponentAFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(log).toEqual(['ng1B-post', 'ng1A-post']);
                });
            }));
            it('should run the post-linking function before `$postLink`', testing_1.async(function () {
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
                // Define `Ng1ComponentFacade`
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
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                            declarations: [Ng1ComponentFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(log).toEqual(['ng1-post', 'ng1-$post']);
                });
            }));
        });
        describe('controller', function () {
            it('should support `controllerAs`', testing_1.async(function () {
                // Define `ng1Directive`
                var ng1Directive = {
                    template: '{{ vm.scope }}; {{ vm.isClass }}; {{ vm.hasElement }}; {{ vm.isPublished() }}',
                    scope: true,
                    controllerAs: 'vm',
                    controller: /** @class */ (function () {
                        function class_1($element, $scope) {
                            this.$element = $element;
                            this.hasElement = $element[0].nodeName;
                            this.scope = $scope.$parent.$parent === $scope.$root ? 'scope' : 'wrong-scope';
                            this.verifyIAmAClass();
                        }
                        class_1.prototype.isPublished = function () {
                            return this.$element.controller('ng1') === this ? 'published' : 'not-published';
                        };
                        class_1.prototype.verifyIAmAClass = function () { this.isClass = 'isClass'; };
                        return class_1;
                    }())
                };
                // Define `Ng1ComponentFacade`
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
                    .directive('ng1', function () { return ng1Directive; })
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('scope; isClass; NG1; published');
                });
            }));
            it('should support `bindToController` (boolean)', testing_1.async(function () {
                // Define `ng1Directive`
                var ng1DirectiveA = {
                    template: 'Scope: {{ title }}; Controller: {{ $ctrl.title }}',
                    scope: { title: '@' },
                    bindToController: false,
                    controllerAs: '$ctrl',
                    controller: /** @class */ (function () {
                        function controller() {
                        }
                        return controller;
                    }())
                };
                var ng1DirectiveB = {
                    template: 'Scope: {{ title }}; Controller: {{ $ctrl.title }}',
                    scope: { title: '@' },
                    bindToController: true,
                    controllerAs: '$ctrl',
                    controller: /** @class */ (function () {
                        function controller() {
                        }
                        return controller;
                    }())
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentAFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentAFacade, _super);
                    function Ng1ComponentAFacade(elementRef, injector) {
                        return _super.call(this, 'ng1A', elementRef, injector) || this;
                    }
                    __decorate([
                        core_1.Input(),
                        __metadata("design:type", String)
                    ], Ng1ComponentAFacade.prototype, "title", void 0);
                    Ng1ComponentAFacade = __decorate([
                        core_1.Directive({ selector: 'ng1A' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentAFacade);
                    return Ng1ComponentAFacade;
                }(static_1.UpgradeComponent));
                var Ng1ComponentBFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentBFacade, _super);
                    function Ng1ComponentBFacade(elementRef, injector) {
                        return _super.call(this, 'ng1B', elementRef, injector) || this;
                    }
                    __decorate([
                        core_1.Input(),
                        __metadata("design:type", String)
                    ], Ng1ComponentBFacade.prototype, "title", void 0);
                    Ng1ComponentBFacade = __decorate([
                        core_1.Directive({ selector: 'ng1B' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentBFacade);
                    return Ng1ComponentBFacade;
                }(static_1.UpgradeComponent));
                // Define `Ng2Component`
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component() {
                    }
                    Ng2Component = __decorate([
                        core_1.Component({
                            selector: 'ng2',
                            template: "\n            <ng1A title=\"WORKS\"></ng1A> |\n            <ng1B title=\"WORKS\"></ng1B>\n          "
                        })
                    ], Ng2Component);
                    return Ng2Component;
                }());
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .directive('ng1A', function () { return ng1DirectiveA; })
                    .directive('ng1B', function () { return ng1DirectiveB; })
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentAFacade, Ng1ComponentBFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                            schemas: [core_1.NO_ERRORS_SCHEMA]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(test_helpers_1.multiTrim(element.textContent))
                        .toBe('Scope: WORKS; Controller: | Scope: ; Controller: WORKS');
                });
            }));
            it('should support `bindToController` (object)', testing_1.async(function () {
                // Define `ng1Directive`
                var ng1Directive = {
                    template: '{{ $ctrl.title }}',
                    scope: {},
                    bindToController: { title: '@' },
                    controllerAs: '$ctrl',
                    controller: /** @class */ (function () {
                        function controller() {
                        }
                        return controller;
                    }())
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    __decorate([
                        core_1.Input(),
                        __metadata("design:type", String)
                    ], Ng1ComponentFacade.prototype, "title", void 0);
                    Ng1ComponentFacade = __decorate([
                        core_1.Directive({ selector: 'ng1' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentFacade);
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
                // Define `Ng2Component`
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component() {
                        this.dataA = 'foo';
                        this.dataB = 'bar';
                    }
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<ng1 title="WORKS"></ng1>' })
                    ], Ng2Component);
                    return Ng2Component;
                }());
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .directive('ng1', function () { return ng1Directive; })
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('WORKS');
                });
            }));
            it('should support `controller` as string', testing_1.async(function () {
                // Define `ng1Directive`
                var ng1Directive = {
                    template: '{{ $ctrl.title }} {{ $ctrl.text }}',
                    scope: { title: '@' },
                    bindToController: true,
                    controller: 'Ng1Controller as $ctrl'
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    __decorate([
                        core_1.Input(),
                        __metadata("design:type", String)
                    ], Ng1ComponentFacade.prototype, "title", void 0);
                    Ng1ComponentFacade = __decorate([
                        core_1.Directive({ selector: 'ng1' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentFacade);
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
                // Define `Ng2Component`
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component() {
                    }
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<ng1 title="WORKS"></ng1>' })
                    ], Ng2Component);
                    return Ng2Component;
                }());
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .controller('Ng1Controller', /** @class */ (function () {
                    function class_2() {
                        this.text = 'GREAT';
                    }
                    return class_2;
                }()))
                    .directive('ng1', function () { return ng1Directive; })
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('WORKS GREAT');
                });
            }));
            it('should insert the compiled content before instantiating the controller', testing_1.async(function () {
                var compiledContent;
                var getCurrentContent;
                // Define `ng1Component`
                var ng1Component = {
                    template: 'Hello, {{ $ctrl.name }}!',
                    controller: /** @class */ (function () {
                        function class_3($element) {
                            this.name = 'world';
                            getCurrentContent = function () { return $element.text(); };
                            compiledContent = getCurrentContent();
                        }
                        return class_3;
                    }())
                };
                // Define `Ng1ComponentFacade`
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
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                            declarations: [Ng1ComponentFacade, Ng2Component],
                            entryComponents: [Ng2Component]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(test_helpers_1.multiTrim(compiledContent)).toBe('Hello, {{ $ctrl.name }}!');
                    expect(test_helpers_1.multiTrim(getCurrentContent())).toBe('Hello, world!');
                });
            }));
        });
        describe('require', function () {
            // NOT YET SUPPORTED
            xdescribe('in pre-/post-link', function () {
                it('should resolve to its own controller if falsy', testing_1.async(function () {
                    // Define `ng1Directive`
                    var ng1Directive = {
                        template: 'Pre: {{ pre }} | Post: {{ post }}',
                        controller: /** @class */ (function () {
                            function class_4() {
                                this.value = 'foo';
                            }
                            return class_4;
                        }()),
                        link: {
                            pre: function (scope, elem, attrs, ctrl) {
                                scope['pre'] = ctrl.value;
                            },
                            post: function (scope, elem, attrs, ctrl) {
                                scope['post'] = ctrl.value;
                            }
                        }
                    };
                    // Define `Ng1ComponentFacade`
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
                        .directive('ng1', function () { return ng1Directive; })
                        .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                    // Define `Ng2Module`
                    var Ng2Module = /** @class */ (function () {
                        function Ng2Module() {
                        }
                        Ng2Module.prototype.ngDoBootstrap = function () { };
                        Ng2Module = __decorate([
                            core_1.NgModule({
                                declarations: [Ng1ComponentFacade, Ng2Component],
                                entryComponents: [Ng2Component],
                                imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                            })
                        ], Ng2Module);
                        return Ng2Module;
                    }());
                    // Bootstrap
                    var element = test_helpers_1.html("<ng2></ng2>");
                    test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                        expect(test_helpers_1.multiTrim(document.body.textContent)).toBe('Pre: foo | Post: foo');
                    });
                }));
                // TODO: Add more tests
            });
            describe('in controller', function () {
                it('should be available to children', testing_1.async(function () {
                    // Define `ng1Component`
                    var ng1ComponentA = {
                        template: '<ng1-b></ng1-b>',
                        controller: /** @class */ (function () {
                            function class_5() {
                                this.value = 'ng1A';
                            }
                            return class_5;
                        }())
                    };
                    var ng1ComponentB = {
                        template: 'Required: {{ $ctrl.required.value }}',
                        require: { required: '^^ng1A' }
                    };
                    // Define `Ng1ComponentFacade`
                    var Ng1ComponentAFacade = /** @class */ (function (_super) {
                        __extends(Ng1ComponentAFacade, _super);
                        function Ng1ComponentAFacade(elementRef, injector) {
                            return _super.call(this, 'ng1A', elementRef, injector) || this;
                        }
                        Ng1ComponentAFacade = __decorate([
                            core_1.Directive({ selector: 'ng1A' }),
                            __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                        ], Ng1ComponentAFacade);
                        return Ng1ComponentAFacade;
                    }(static_1.UpgradeComponent));
                    // Define `Ng2Component`
                    var Ng2Component = /** @class */ (function () {
                        function Ng2Component() {
                        }
                        Ng2Component = __decorate([
                            core_1.Component({ selector: 'ng2', template: '<ng1A></ng1A>' })
                        ], Ng2Component);
                        return Ng2Component;
                    }());
                    // Define `ng1Module`
                    var ng1Module = angular.module('ng1Module', [])
                        .component('ng1A', ng1ComponentA)
                        .component('ng1B', ng1ComponentB)
                        .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                    // Define `Ng2Module`
                    var Ng2Module = /** @class */ (function () {
                        function Ng2Module() {
                        }
                        Ng2Module.prototype.ngDoBootstrap = function () { };
                        Ng2Module = __decorate([
                            core_1.NgModule({
                                declarations: [Ng1ComponentAFacade, Ng2Component],
                                entryComponents: [Ng2Component],
                                imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                            })
                        ], Ng2Module);
                        return Ng2Module;
                    }());
                    // Bootstrap
                    var element = test_helpers_1.html("<ng2></ng2>");
                    test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                        expect(test_helpers_1.multiTrim(element.textContent)).toBe('Required: ng1A');
                    });
                }));
                it('should throw if required controller cannot be found', testing_1.async(function () {
                    // Define `ng1Component`
                    var ng1ComponentA = { require: { foo: 'iDoNotExist' } };
                    var ng1ComponentB = { require: { foo: '^iDoNotExist' } };
                    var ng1ComponentC = { require: { foo: '^^iDoNotExist' } };
                    // Define `Ng1ComponentFacade`
                    var Ng1ComponentAFacade = /** @class */ (function (_super) {
                        __extends(Ng1ComponentAFacade, _super);
                        function Ng1ComponentAFacade(elementRef, injector) {
                            return _super.call(this, 'ng1A', elementRef, injector) || this;
                        }
                        Ng1ComponentAFacade = __decorate([
                            core_1.Directive({ selector: 'ng1A' }),
                            __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                        ], Ng1ComponentAFacade);
                        return Ng1ComponentAFacade;
                    }(static_1.UpgradeComponent));
                    var Ng1ComponentBFacade = /** @class */ (function (_super) {
                        __extends(Ng1ComponentBFacade, _super);
                        function Ng1ComponentBFacade(elementRef, injector) {
                            return _super.call(this, 'ng1B', elementRef, injector) || this;
                        }
                        Ng1ComponentBFacade = __decorate([
                            core_1.Directive({ selector: 'ng1B' }),
                            __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                        ], Ng1ComponentBFacade);
                        return Ng1ComponentBFacade;
                    }(static_1.UpgradeComponent));
                    var Ng1ComponentCFacade = /** @class */ (function (_super) {
                        __extends(Ng1ComponentCFacade, _super);
                        function Ng1ComponentCFacade(elementRef, injector) {
                            return _super.call(this, 'ng1C', elementRef, injector) || this;
                        }
                        Ng1ComponentCFacade = __decorate([
                            core_1.Directive({ selector: 'ng1C' }),
                            __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                        ], Ng1ComponentCFacade);
                        return Ng1ComponentCFacade;
                    }(static_1.UpgradeComponent));
                    // Define `Ng2Component`
                    var Ng2ComponentA = /** @class */ (function () {
                        function Ng2ComponentA() {
                        }
                        Ng2ComponentA = __decorate([
                            core_1.Component({ selector: 'ng2-a', template: '<ng1A></ng1A>' })
                        ], Ng2ComponentA);
                        return Ng2ComponentA;
                    }());
                    var Ng2ComponentB = /** @class */ (function () {
                        function Ng2ComponentB() {
                        }
                        Ng2ComponentB = __decorate([
                            core_1.Component({ selector: 'ng2-b', template: '<ng1B></ng1B>' })
                        ], Ng2ComponentB);
                        return Ng2ComponentB;
                    }());
                    var Ng2ComponentC = /** @class */ (function () {
                        function Ng2ComponentC() {
                        }
                        Ng2ComponentC = __decorate([
                            core_1.Component({ selector: 'ng2-c', template: '<ng1C></ng1C>' })
                        ], Ng2ComponentC);
                        return Ng2ComponentC;
                    }());
                    // Define `ng1Module`
                    var mockExceptionHandler = jasmine.createSpy('$exceptionHandler');
                    var ng1Module = angular.module('ng1Module', [])
                        .component('ng1A', ng1ComponentA)
                        .component('ng1B', ng1ComponentB)
                        .component('ng1C', ng1ComponentC)
                        .directive('ng2A', static_1.downgradeComponent({ component: Ng2ComponentA }))
                        .directive('ng2B', static_1.downgradeComponent({ component: Ng2ComponentB }))
                        .directive('ng2C', static_1.downgradeComponent({ component: Ng2ComponentC }))
                        .value('$exceptionHandler', mockExceptionHandler);
                    // Define `Ng2Module`
                    var Ng2Module = /** @class */ (function () {
                        function Ng2Module() {
                        }
                        Ng2Module.prototype.ngDoBootstrap = function () { };
                        Ng2Module = __decorate([
                            core_1.NgModule({
                                declarations: [
                                    Ng1ComponentAFacade, Ng1ComponentBFacade, Ng1ComponentCFacade, Ng2ComponentA,
                                    Ng2ComponentB, Ng2ComponentC
                                ],
                                entryComponents: [Ng2ComponentA, Ng2ComponentB, Ng2ComponentC],
                                imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                            })
                        ], Ng2Module);
                        return Ng2Module;
                    }());
                    // Bootstrap
                    var elementA = test_helpers_1.html("<ng2-a></ng2-a>");
                    var elementB = test_helpers_1.html("<ng2-b></ng2-b>");
                    var elementC = test_helpers_1.html("<ng2-c></ng2-c>");
                    test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, elementA, ng1Module).then(function () {
                        expect(mockExceptionHandler)
                            .toHaveBeenCalledWith(new Error('Unable to find required \'iDoNotExist\' in upgraded directive \'ng1A\'.'));
                    });
                    test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, elementB, ng1Module).then(function () {
                        expect(mockExceptionHandler)
                            .toHaveBeenCalledWith(new Error('Unable to find required \'^iDoNotExist\' in upgraded directive \'ng1B\'.'));
                    });
                    test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, elementC, ng1Module).then(function () {
                        expect(mockExceptionHandler)
                            .toHaveBeenCalledWith(new Error('Unable to find required \'^^iDoNotExist\' in upgraded directive \'ng1C\'.'));
                    });
                }));
                it('should not throw if missing required controller is optional', testing_1.async(function () {
                    // Define `ng1Component`
                    var ng1Component = {
                        require: {
                            foo: '?iDoNotExist',
                            bar: '^?iDoNotExist',
                            baz: '?^^iDoNotExist',
                        }
                    };
                    // Define `Ng1ComponentFacade`
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
                    var mockExceptionHandler = jasmine.createSpy('$exceptionHandler');
                    var ng1Module = angular.module('ng1Module', [])
                        .component('ng1', ng1Component)
                        .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }))
                        .value('$exceptionHandler', mockExceptionHandler);
                    // Define `Ng2Module`
                    var Ng2Module = /** @class */ (function () {
                        function Ng2Module() {
                        }
                        Ng2Module.prototype.ngDoBootstrap = function () { };
                        Ng2Module = __decorate([
                            core_1.NgModule({
                                declarations: [Ng1ComponentFacade, Ng2Component],
                                entryComponents: [Ng2Component],
                                imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                            })
                        ], Ng2Module);
                        return Ng2Module;
                    }());
                    // Bootstrap
                    var element = test_helpers_1.html("<ng2></ng2>");
                    test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                        expect(mockExceptionHandler).not.toHaveBeenCalled();
                    });
                }));
                it('should assign resolved values to the controller instance (if `require` is not object)', testing_1.async(function () {
                    // Define `ng1Component`
                    var ng1ComponentA = {
                        template: 'ng1A(<div><ng2></ng2></div>)',
                        controller: /** @class */ (function () {
                            function class_6() {
                                this.value = 'A';
                            }
                            return class_6;
                        }())
                    };
                    var ng1ComponentB = {
                        template: "ng1B({{ $ctrl.getProps() }})",
                        require: '^ng1A',
                        controller: /** @class */ (function () {
                            function controller() {
                            }
                            controller.prototype.getProps = function () {
                                // If all goes well, there should be no keys on `this`
                                return Object.keys(this).join(', ');
                            };
                            return controller;
                        }())
                    };
                    var ng1ComponentC = {
                        template: "ng1C({{ $ctrl.getProps() }})",
                        require: ['?ng1A', '^ng1A', '^^ng1A', 'ng1C', '^ng1C', '?^^ng1C'],
                        controller: /** @class */ (function () {
                            function controller() {
                            }
                            controller.prototype.getProps = function () {
                                // If all goes well, there should be no keys on `this`
                                return Object.keys(this).join(', ');
                            };
                            return controller;
                        }())
                    };
                    // Define `Ng1ComponentFacade`
                    var Ng1ComponentBFacade = /** @class */ (function (_super) {
                        __extends(Ng1ComponentBFacade, _super);
                        function Ng1ComponentBFacade(elementRef, injector) {
                            return _super.call(this, 'ng1B', elementRef, injector) || this;
                        }
                        Ng1ComponentBFacade = __decorate([
                            core_1.Directive({ selector: 'ng1B' }),
                            __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                        ], Ng1ComponentBFacade);
                        return Ng1ComponentBFacade;
                    }(static_1.UpgradeComponent));
                    var Ng1ComponentCFacade = /** @class */ (function (_super) {
                        __extends(Ng1ComponentCFacade, _super);
                        function Ng1ComponentCFacade(elementRef, injector) {
                            return _super.call(this, 'ng1C', elementRef, injector) || this;
                        }
                        Ng1ComponentCFacade = __decorate([
                            core_1.Directive({ selector: 'ng1C' }),
                            __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                        ], Ng1ComponentCFacade);
                        return Ng1ComponentCFacade;
                    }(static_1.UpgradeComponent));
                    // Define `Ng2Component`
                    var Ng2Component = /** @class */ (function () {
                        function Ng2Component() {
                        }
                        Ng2Component = __decorate([
                            core_1.Component({ selector: 'ng2', template: 'ng2(<div><ng1B></ng1B> | <ng1C></ng1C></div>)' })
                        ], Ng2Component);
                        return Ng2Component;
                    }());
                    // Define `ng1Module`
                    var ng1Module = angular.module('ng1Module', [])
                        .component('ng1A', ng1ComponentA)
                        .component('ng1B', ng1ComponentB)
                        .component('ng1C', ng1ComponentC)
                        .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                    // Define `Ng2Module`
                    var Ng2Module = /** @class */ (function () {
                        function Ng2Module() {
                        }
                        Ng2Module.prototype.ngDoBootstrap = function () { };
                        Ng2Module = __decorate([
                            core_1.NgModule({
                                declarations: [Ng1ComponentBFacade, Ng1ComponentCFacade, Ng2Component],
                                entryComponents: [Ng2Component],
                                imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                            })
                        ], Ng2Module);
                        return Ng2Module;
                    }());
                    // Bootstrap
                    var element = test_helpers_1.html("<ng1-a></ng1-a>");
                    test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                        expect(test_helpers_1.multiTrim(element.textContent)).toBe('ng1A(ng2(ng1B() | ng1C()))');
                    });
                }));
                it('should assign resolved values to the controller instance (if `require` is object)', testing_1.async(function () {
                    // Define `ng1Component`
                    var ng1ComponentA = {
                        template: 'ng1A(<div><ng2></ng2></div>)',
                        controller: /** @class */ (function () {
                            function class_7() {
                                this.value = 'A';
                            }
                            return class_7;
                        }())
                    };
                    var ng1ComponentB = {
                        template: "ng1B(\n                 ng1A: {{ $ctrl.ng1ASelf.value }} |\n                 ^ng1A: {{ $ctrl.ng1ASelfUp.value }} |\n                 ^^ng1A: {{ $ctrl.ng1AParentUp.value }} |\n                 ng1B: {{ $ctrl.ng1BSelf.value }} |\n                 ^ng1B: {{ $ctrl.ng1BSelfUp.value }} |\n                 ^^ng1B: {{ $ctrl.ng1BParentUp.value }}\n               )",
                        require: {
                            ng1ASelf: '?ng1A',
                            ng1ASelfUp: '^ng1A',
                            ng1AParentUp: '^^ng1A',
                            ng1BSelf: 'ng1B',
                            ng1BSelfUp: '^ng1B',
                            ng1BParentUp: '?^^ng1B',
                        },
                        controller: /** @class */ (function () {
                            function class_8() {
                                this.value = 'B';
                            }
                            return class_8;
                        }())
                    };
                    // Define `Ng1ComponentFacade`
                    var Ng1ComponentBFacade = /** @class */ (function (_super) {
                        __extends(Ng1ComponentBFacade, _super);
                        function Ng1ComponentBFacade(elementRef, injector) {
                            return _super.call(this, 'ng1B', elementRef, injector) || this;
                        }
                        Ng1ComponentBFacade = __decorate([
                            core_1.Directive({ selector: 'ng1B' }),
                            __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                        ], Ng1ComponentBFacade);
                        return Ng1ComponentBFacade;
                    }(static_1.UpgradeComponent));
                    // Define `Ng2Component`
                    var Ng2Component = /** @class */ (function () {
                        function Ng2Component() {
                        }
                        Ng2Component = __decorate([
                            core_1.Component({ selector: 'ng2', template: 'ng2(<div><ng1B></ng1B></div>)' })
                        ], Ng2Component);
                        return Ng2Component;
                    }());
                    // Define `ng1Module`
                    var ng1Module = angular.module('ng1Module', [])
                        .component('ng1A', ng1ComponentA)
                        .component('ng1B', ng1ComponentB)
                        .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                    // Define `Ng2Module`
                    var Ng2Module = /** @class */ (function () {
                        function Ng2Module() {
                        }
                        Ng2Module.prototype.ngDoBootstrap = function () { };
                        Ng2Module = __decorate([
                            core_1.NgModule({
                                declarations: [Ng1ComponentBFacade, Ng2Component],
                                entryComponents: [Ng2Component],
                                imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                            })
                        ], Ng2Module);
                        return Ng2Module;
                    }());
                    // Bootstrap
                    var element = test_helpers_1.html("<ng1-a></ng1-a>");
                    test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                        expect(test_helpers_1.multiTrim(element.textContent))
                            .toBe('ng1A(ng2(ng1B( ng1A: | ^ng1A: A | ^^ng1A: A | ng1B: B | ^ng1B: B | ^^ng1B: )))');
                    });
                }));
                it('should assign to controller before calling `$onInit()`', testing_1.async(function () {
                    // Define `ng1Component`
                    var ng1ComponentA = {
                        template: '<ng2></ng2>',
                        controller: /** @class */ (function () {
                            function class_9() {
                                this.value = 'ng1A';
                            }
                            return class_9;
                        }())
                    };
                    var ng1ComponentB = {
                        template: '$onInit: {{ $ctrl.onInitValue }}',
                        require: { required: '^^ng1A' },
                        controller: /** @class */ (function () {
                            function class_10() {
                            }
                            class_10.prototype.$onInit = function () {
                                var self = this;
                                self.onInitValue = self.required.value;
                            };
                            return class_10;
                        }())
                    };
                    // Define `Ng1ComponentFacade`
                    var Ng1ComponentBFacade = /** @class */ (function (_super) {
                        __extends(Ng1ComponentBFacade, _super);
                        function Ng1ComponentBFacade(elementRef, injector) {
                            return _super.call(this, 'ng1B', elementRef, injector) || this;
                        }
                        Ng1ComponentBFacade = __decorate([
                            core_1.Directive({ selector: 'ng1B' }),
                            __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                        ], Ng1ComponentBFacade);
                        return Ng1ComponentBFacade;
                    }(static_1.UpgradeComponent));
                    // Define `Ng2Component`
                    var Ng2Component = /** @class */ (function () {
                        function Ng2Component() {
                        }
                        Ng2Component = __decorate([
                            core_1.Component({ selector: 'ng2', template: '<ng1B></ng1B>' })
                        ], Ng2Component);
                        return Ng2Component;
                    }());
                    // Define `ng1Module`
                    var ng1Module = angular.module('ng1Module', [])
                        .component('ng1A', ng1ComponentA)
                        .component('ng1B', ng1ComponentB)
                        .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                    // Define `Ng2Module`
                    var Ng2Module = /** @class */ (function () {
                        function Ng2Module() {
                        }
                        Ng2Module.prototype.ngDoBootstrap = function () { };
                        Ng2Module = __decorate([
                            core_1.NgModule({
                                declarations: [Ng1ComponentBFacade, Ng2Component],
                                entryComponents: [Ng2Component],
                                imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                            })
                        ], Ng2Module);
                        return Ng2Module;
                    }());
                    // Bootstrap
                    var element = test_helpers_1.html("<ng1-a></ng1-a>");
                    test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                        expect(test_helpers_1.multiTrim(element.textContent)).toBe('$onInit: ng1A');
                    });
                }));
                it('should use the key as name if the required controller name is omitted', testing_1.async(function () {
                    // Define `ng1Component`
                    var ng1ComponentA = {
                        template: '<ng1-b></ng1-b>',
                        controller: /** @class */ (function () {
                            function class_11() {
                                this.value = 'A';
                            }
                            return class_11;
                        }())
                    };
                    var ng1ComponentB = { template: '<ng2></ng2>', controller: /** @class */ (function () {
                            function class_12() {
                                this.value = 'B';
                            }
                            return class_12;
                        }()) };
                    var ng1ComponentC = {
                        template: 'ng1A: {{ $ctrl.ng1A.value }} | ng1B: {{ $ctrl.ng1B.value }} | ng1C: {{ $ctrl.ng1C.value }}',
                        require: {
                            ng1A: '^^',
                            ng1B: '?^',
                            ng1C: '',
                        },
                        controller: /** @class */ (function () {
                            function class_13() {
                                this.value = 'C';
                            }
                            return class_13;
                        }())
                    };
                    // Define `Ng1ComponentFacade`
                    var Ng1ComponentCFacade = /** @class */ (function (_super) {
                        __extends(Ng1ComponentCFacade, _super);
                        function Ng1ComponentCFacade(elementRef, injector) {
                            return _super.call(this, 'ng1C', elementRef, injector) || this;
                        }
                        Ng1ComponentCFacade = __decorate([
                            core_1.Directive({ selector: 'ng1C' }),
                            __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                        ], Ng1ComponentCFacade);
                        return Ng1ComponentCFacade;
                    }(static_1.UpgradeComponent));
                    // Define `Ng2Component`
                    var Ng2Component = /** @class */ (function () {
                        function Ng2Component() {
                        }
                        Ng2Component = __decorate([
                            core_1.Component({ selector: 'ng2', template: '<ng1C></ng1C>' })
                        ], Ng2Component);
                        return Ng2Component;
                    }());
                    // Define `ng1Module`
                    var ng1Module = angular.module('ng1Module', [])
                        .component('ng1A', ng1ComponentA)
                        .component('ng1B', ng1ComponentB)
                        .component('ng1C', ng1ComponentC)
                        .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                    // Define `Ng2Module`
                    var Ng2Module = /** @class */ (function () {
                        function Ng2Module() {
                        }
                        Ng2Module.prototype.ngDoBootstrap = function () { };
                        Ng2Module = __decorate([
                            core_1.NgModule({
                                declarations: [Ng1ComponentCFacade, Ng2Component],
                                entryComponents: [Ng2Component],
                                imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                            })
                        ], Ng2Module);
                        return Ng2Module;
                    }());
                    // Bootstrap
                    var element = test_helpers_1.html('<ng1-a></ng1-a>');
                    test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                        expect(test_helpers_1.multiTrim(element.textContent)).toBe('ng1A: A | ng1B: B | ng1C: C');
                    });
                }));
            });
        });
        describe('transclusion', function () {
            it('should support single-slot transclusion', testing_1.async(function () {
                var ng2ComponentAInstance;
                var ng2ComponentBInstance;
                // Define `ng1Component`
                var ng1Component = { template: 'ng1(<div ng-transclude></div>)', transclude: true };
                // Define `Ng1ComponentFacade`
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
                    .directive('ng2A', static_1.downgradeComponent({ component: Ng2ComponentA }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                            declarations: [Ng1ComponentFacade, Ng2ComponentA, Ng2ComponentB],
                            entryComponents: [Ng2ComponentA]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2-a></ng2-a>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('ng2A(ng1(foo | ))');
                    ng2ComponentAInstance.value = 'baz';
                    ng2ComponentAInstance.showB = true;
                    test_helpers_1.$digest(adapter);
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('ng2A(ng1(baz | ng2B(bar)))');
                    ng2ComponentBInstance.value = 'qux';
                    test_helpers_1.$digest(adapter);
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('ng2A(ng1(baz | ng2B(qux)))');
                });
            }));
            it('should support single-slot transclusion with fallback content', testing_1.async(function () {
                var ng1ControllerInstances = [];
                var ng2ComponentInstance;
                // Define `ng1Component`
                var ng1Component = {
                    template: 'ng1(<div ng-transclude>{{ $ctrl.value }}</div>)',
                    transclude: true,
                    controller: /** @class */ (function () {
                        function class_14() {
                            this.value = 'from-ng1';
                            ng1ControllerInstances.push(this);
                        }
                        return class_14;
                    }())
                };
                // Define `Ng1ComponentFacade`
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
                // Define `Ng2Component`
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component() {
                        this.value = 'from-ng2';
                        ng2ComponentInstance = this;
                    }
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: 'ng2(<ng1>{{ value }}</ng1> | <ng1></ng1>)' }),
                        __metadata("design:paramtypes", [])
                    ], Ng2Component);
                    return Ng2Component;
                }());
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                            declarations: [Ng1ComponentFacade, Ng2Component],
                            entryComponents: [Ng2Component]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('ng2(ng1(from-ng2) | ng1(from-ng1))');
                    ng1ControllerInstances.forEach(function (ctrl) { return ctrl.value = 'ng1-foo'; });
                    ng2ComponentInstance.value = 'ng2-bar';
                    test_helpers_1.$digest(adapter);
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('ng2(ng1(ng2-bar) | ng1(ng1-foo))');
                });
            }));
            it('should support multi-slot transclusion', testing_1.async(function () {
                var ng2ComponentInstance;
                // Define `ng1Component`
                var ng1Component = {
                    template: 'ng1(x(<div ng-transclude="slotX"></div>) | y(<div ng-transclude="slotY"></div>))',
                    transclude: { slotX: 'contentX', slotY: 'contentY' }
                };
                // Define `Ng1ComponentFacade`
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
                            template: "\n               ng2(\n                 <ng1>\n                   <content-x>{{ x }}1</content-x>\n                   <content-y>{{ y }}1</content-y>\n                   <content-x>{{ x }}2</content-x>\n                   <content-y>{{ y }}2</content-y>\n                 </ng1>\n               )"
                        }),
                        __metadata("design:paramtypes", [])
                    ], Ng2Component);
                    return Ng2Component;
                }());
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                            declarations: [Ng1ComponentFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            schemas: [core_1.NO_ERRORS_SCHEMA]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    expect(test_helpers_1.multiTrim(element.textContent, true)).toBe('ng2(ng1(x(foo1foo2)|y(bar1bar2)))');
                    ng2ComponentInstance.x = 'baz';
                    ng2ComponentInstance.y = 'qux';
                    test_helpers_1.$digest(adapter);
                    expect(test_helpers_1.multiTrim(element.textContent, true)).toBe('ng2(ng1(x(baz1baz2)|y(qux1qux2)))');
                });
            }));
            it('should support default slot (with fallback content)', testing_1.async(function () {
                var ng1ControllerInstances = [];
                var ng2ComponentInstance;
                // Define `ng1Component`
                var ng1Component = {
                    template: 'ng1(default(<div ng-transclude="">fallback-{{ $ctrl.value }}</div>))',
                    transclude: { slotX: 'contentX', slotY: 'contentY' },
                    controller: /** @class */ (function () {
                        function class_15() {
                            this.value = 'ng1';
                            ng1ControllerInstances.push(this);
                        }
                        return class_15;
                    }())
                };
                // Define `Ng1ComponentFacade`
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
                            template: "\n               ng2(\n                 <ng1>\n                   ({{ x }})\n                   <content-x>ignored x</content-x>\n                   {{ x }}-<span>{{ y }}</span>\n                   <content-y>ignored y</content-y>\n                   <span>({{ y }})</span>\n                 </ng1> |\n                 <!--\n                   Remove any whitespace, because in AngularJS versions prior to 1.6\n                   even whitespace counts as transcluded content.\n                 -->\n                 <ng1><content-x>ignored x</content-x><content-y>ignored y</content-y></ng1>\n               )"
                        }),
                        __metadata("design:paramtypes", [])
                    ], Ng2Component);
                    return Ng2Component;
                }());
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                            declarations: [Ng1ComponentFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            schemas: [core_1.NO_ERRORS_SCHEMA]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    expect(test_helpers_1.multiTrim(element.textContent, true))
                        .toBe('ng2(ng1(default((foo)foo-bar(bar)))|ng1(default(fallback-ng1)))');
                    ng1ControllerInstances.forEach(function (ctrl) { return ctrl.value = 'ng1-plus'; });
                    ng2ComponentInstance.x = 'baz';
                    ng2ComponentInstance.y = 'qux';
                    test_helpers_1.$digest(adapter);
                    expect(test_helpers_1.multiTrim(element.textContent, true))
                        .toBe('ng2(ng1(default((baz)baz-qux(qux)))|ng1(default(fallback-ng1-plus)))');
                });
            }));
            it('should support optional transclusion slots (with fallback content)', testing_1.async(function () {
                var ng1ControllerInstances = [];
                var ng2ComponentInstance;
                // Define `ng1Component`
                var ng1Component = {
                    template: "\n               ng1(\n                x(<div ng-transclude=\"slotX\">{{ $ctrl.x }}</div>) |\n                y(<div ng-transclude=\"slotY\">{{ $ctrl.y }}</div>)\n               )",
                    transclude: { slotX: '?contentX', slotY: '?contentY' },
                    controller: /** @class */ (function () {
                        function class_16() {
                            this.x = 'ng1X';
                            this.y = 'ng1Y';
                            ng1ControllerInstances.push(this);
                        }
                        return class_16;
                    }())
                };
                // Define `Ng1ComponentFacade`
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
                            template: "\n               ng2(\n                 <ng1><content-x>{{ x }}</content-x></ng1> |\n                 <ng1><content-y>{{ y }}</content-y></ng1>\n               )"
                        }),
                        __metadata("design:paramtypes", [])
                    ], Ng2Component);
                    return Ng2Component;
                }());
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                            declarations: [Ng1ComponentFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            schemas: [core_1.NO_ERRORS_SCHEMA]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    expect(test_helpers_1.multiTrim(element.textContent, true))
                        .toBe('ng2(ng1(x(ng2X)|y(ng1Y))|ng1(x(ng1X)|y(ng2Y)))');
                    ng1ControllerInstances.forEach(function (ctrl) {
                        ctrl.x = 'ng1X-foo';
                        ctrl.y = 'ng1Y-bar';
                    });
                    ng2ComponentInstance.x = 'ng2X-baz';
                    ng2ComponentInstance.y = 'ng2Y-qux';
                    test_helpers_1.$digest(adapter);
                    expect(test_helpers_1.multiTrim(element.textContent, true))
                        .toBe('ng2(ng1(x(ng2X-baz)|y(ng1Y-bar))|ng1(x(ng1X-foo)|y(ng2Y-qux)))');
                });
            }));
            it('should throw if a non-optional slot is not filled', testing_1.async(function () {
                var errorMessage;
                // Define `ng1Component`
                var ng1Component = {
                    template: '',
                    transclude: { slotX: '?contentX', slotY: 'contentY' }
                };
                // Define `Ng1ComponentFacade`
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
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                            declarations: [Ng1ComponentFacade, Ng2Component],
                            entryComponents: [Ng2Component]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    expect(errorMessage)
                        .toContain('Required transclusion slot \'slotY\' on directive: ng1');
                });
            }));
            it('should support structural directives in transcluded content', testing_1.async(function () {
                var ng2ComponentInstance;
                // Define `ng1Component`
                var ng1Component = {
                    template: 'ng1(x(<div ng-transclude="slotX"></div>) | default(<div ng-transclude=""></div>))',
                    transclude: { slotX: 'contentX' }
                };
                // Define `Ng1ComponentFacade`
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
                            template: "\n               ng2(\n                 <ng1>\n                   <content-x><div *ngIf=\"show\">{{ x }}1</div></content-x>\n                   <div *ngIf=\"!show\">{{ y }}1</div>\n                   <content-x><div *ngIf=\"!show\">{{ x }}2</div></content-x>\n                   <div *ngIf=\"show\">{{ y }}2</div>\n                 </ng1>\n               )"
                        }),
                        __metadata("design:paramtypes", [])
                    ], Ng2Component);
                    return Ng2Component;
                }());
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                            declarations: [Ng1ComponentFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            schemas: [core_1.NO_ERRORS_SCHEMA]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    expect(test_helpers_1.multiTrim(element.textContent, true)).toBe('ng2(ng1(x(foo1)|default(bar2)))');
                    ng2ComponentInstance.x = 'baz';
                    ng2ComponentInstance.y = 'qux';
                    ng2ComponentInstance.show = false;
                    test_helpers_1.$digest(adapter);
                    expect(test_helpers_1.multiTrim(element.textContent, true)).toBe('ng2(ng1(x(baz2)|default(qux1)))');
                    ng2ComponentInstance.show = true;
                    test_helpers_1.$digest(adapter);
                    expect(test_helpers_1.multiTrim(element.textContent, true)).toBe('ng2(ng1(x(baz1)|default(qux2)))');
                });
            }));
        });
        describe('lifecycle hooks', function () {
            it('should call `$onChanges()` on binding destination (prototype)', testing_1.fakeAsync(function () {
                var scopeOnChanges = jasmine.createSpy('scopeOnChanges');
                var controllerOnChangesA = jasmine.createSpy('controllerOnChangesA');
                var controllerOnChangesB = jasmine.createSpy('controllerOnChangesB');
                var ng2ComponentInstance;
                // Define `ng1Directive`
                var ng1DirectiveA = {
                    template: '',
                    scope: { inputA: '<' },
                    bindToController: false,
                    controllerAs: '$ctrl',
                    controller: /** @class */ (function () {
                        function class_17() {
                        }
                        class_17.prototype.$onChanges = function (changes) { controllerOnChangesA(changes); };
                        return class_17;
                    }())
                };
                var ng1DirectiveB = {
                    template: '',
                    scope: { inputB: '<' },
                    bindToController: true,
                    controllerAs: '$ctrl',
                    controller: /** @class */ (function () {
                        function class_18() {
                        }
                        class_18.prototype.$onChanges = function (changes) { controllerOnChangesB(changes); };
                        return class_18;
                    }())
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentAFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentAFacade, _super);
                    function Ng1ComponentAFacade(elementRef, injector) {
                        return _super.call(this, 'ng1A', elementRef, injector) || this;
                    }
                    __decorate([
                        core_1.Input(),
                        __metadata("design:type", Object)
                    ], Ng1ComponentAFacade.prototype, "inputA", void 0);
                    Ng1ComponentAFacade = __decorate([
                        core_1.Directive({ selector: 'ng1A' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentAFacade);
                    return Ng1ComponentAFacade;
                }(static_1.UpgradeComponent));
                var Ng1ComponentBFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentBFacade, _super);
                    function Ng1ComponentBFacade(elementRef, injector) {
                        return _super.call(this, 'ng1B', elementRef, injector) || this;
                    }
                    __decorate([
                        core_1.Input(),
                        __metadata("design:type", Object)
                    ], Ng1ComponentBFacade.prototype, "inputB", void 0);
                    Ng1ComponentBFacade = __decorate([
                        core_1.Directive({ selector: 'ng1B' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentBFacade);
                    return Ng1ComponentBFacade;
                }(static_1.UpgradeComponent));
                // Define `Ng2Component`
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component() {
                        this.data = { foo: 'bar' };
                        ng2ComponentInstance = this;
                    }
                    Ng2Component = __decorate([
                        core_1.Component({
                            selector: 'ng2',
                            template: '<ng1A [inputA]="data"></ng1A> | <ng1B [inputB]="data"></ng1B>'
                        }),
                        __metadata("design:paramtypes", [])
                    ], Ng2Component);
                    return Ng2Component;
                }());
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .directive('ng1A', function () { return ng1DirectiveA; })
                    .directive('ng1B', function () { return ng1DirectiveB; })
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }))
                    .run(function ($rootScope) {
                    Object.getPrototypeOf($rootScope)['$onChanges'] = scopeOnChanges;
                });
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentAFacade, Ng1ComponentBFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    // Initial change
                    expect(scopeOnChanges.calls.count()).toBe(1);
                    expect(controllerOnChangesA).not.toHaveBeenCalled();
                    expect(controllerOnChangesB.calls.count()).toBe(1);
                    expect(scopeOnChanges.calls.argsFor(0)[0]).toEqual({ inputA: jasmine.any(Object) });
                    expect(scopeOnChanges.calls.argsFor(0)[0].inputA.currentValue).toEqual({ foo: 'bar' });
                    expect(scopeOnChanges.calls.argsFor(0)[0].inputA.isFirstChange()).toBe(true);
                    expect(controllerOnChangesB.calls.argsFor(0)[0].inputB.currentValue).toEqual({
                        foo: 'bar'
                    });
                    expect(controllerOnChangesB.calls.argsFor(0)[0].inputB.isFirstChange()).toBe(true);
                    // Change: Re-assign `data`
                    ng2ComponentInstance.data = { foo: 'baz' };
                    test_helpers_1.$digest(adapter);
                    testing_1.tick();
                    expect(scopeOnChanges.calls.count()).toBe(2);
                    expect(controllerOnChangesA).not.toHaveBeenCalled();
                    expect(controllerOnChangesB.calls.count()).toBe(2);
                    expect(scopeOnChanges.calls.argsFor(1)[0]).toEqual({ inputA: jasmine.any(Object) });
                    expect(scopeOnChanges.calls.argsFor(1)[0].inputA.previousValue).toEqual({ foo: 'bar' });
                    expect(scopeOnChanges.calls.argsFor(1)[0].inputA.currentValue).toEqual({ foo: 'baz' });
                    expect(scopeOnChanges.calls.argsFor(1)[0].inputA.isFirstChange()).toBe(false);
                    expect(controllerOnChangesB.calls.argsFor(1)[0].inputB.previousValue).toEqual({
                        foo: 'bar'
                    });
                    expect(controllerOnChangesB.calls.argsFor(1)[0].inputB.currentValue).toEqual({
                        foo: 'baz'
                    });
                    expect(controllerOnChangesB.calls.argsFor(1)[0].inputB.isFirstChange()).toBe(false);
                    // No change: Update internal property
                    ng2ComponentInstance.data.foo = 'qux';
                    test_helpers_1.$digest(adapter);
                    testing_1.tick();
                    expect(scopeOnChanges.calls.count()).toBe(2);
                    expect(controllerOnChangesA).not.toHaveBeenCalled();
                    expect(controllerOnChangesB.calls.count()).toBe(2);
                    // Change: Re-assign `data` (even if it looks the same)
                    ng2ComponentInstance.data = { foo: 'qux' };
                    test_helpers_1.$digest(adapter);
                    testing_1.tick();
                    expect(scopeOnChanges.calls.count()).toBe(3);
                    expect(controllerOnChangesA).not.toHaveBeenCalled();
                    expect(controllerOnChangesB.calls.count()).toBe(3);
                    expect(scopeOnChanges.calls.argsFor(2)[0]).toEqual({ inputA: jasmine.any(Object) });
                    expect(scopeOnChanges.calls.argsFor(2)[0].inputA.previousValue).toEqual({ foo: 'qux' });
                    expect(scopeOnChanges.calls.argsFor(2)[0].inputA.currentValue).toEqual({ foo: 'qux' });
                    expect(scopeOnChanges.calls.argsFor(2)[0].inputA.isFirstChange()).toBe(false);
                    expect(controllerOnChangesB.calls.argsFor(2)[0].inputB.previousValue).toEqual({
                        foo: 'qux'
                    });
                    expect(controllerOnChangesB.calls.argsFor(2)[0].inputB.currentValue).toEqual({
                        foo: 'qux'
                    });
                    expect(controllerOnChangesB.calls.argsFor(2)[0].inputB.isFirstChange()).toBe(false);
                });
            }));
            it('should call `$onChanges()` on binding destination (instance)', testing_1.fakeAsync(function () {
                var scopeOnChangesA = jasmine.createSpy('scopeOnChangesA');
                var scopeOnChangesB = jasmine.createSpy('scopeOnChangesB');
                var controllerOnChangesA = jasmine.createSpy('controllerOnChangesA');
                var controllerOnChangesB = jasmine.createSpy('controllerOnChangesB');
                var ng2ComponentInstance;
                // Define `ng1Directive`
                var ng1DirectiveA = {
                    template: '',
                    scope: { inputA: '<' },
                    bindToController: false,
                    controllerAs: '$ctrl',
                    controller: /** @class */ (function () {
                        function class_19($scope) {
                            $scope['$onChanges'] = scopeOnChangesA;
                            this.$onChanges = controllerOnChangesA;
                        }
                        return class_19;
                    }())
                };
                var ng1DirectiveB = {
                    template: '',
                    scope: { inputB: '<' },
                    bindToController: true,
                    controllerAs: '$ctrl',
                    controller: /** @class */ (function () {
                        function class_20($scope) {
                            $scope['$onChanges'] = scopeOnChangesB;
                            this.$onChanges = controllerOnChangesB;
                        }
                        return class_20;
                    }())
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentAFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentAFacade, _super);
                    function Ng1ComponentAFacade(elementRef, injector) {
                        return _super.call(this, 'ng1A', elementRef, injector) || this;
                    }
                    __decorate([
                        core_1.Input(),
                        __metadata("design:type", Object)
                    ], Ng1ComponentAFacade.prototype, "inputA", void 0);
                    Ng1ComponentAFacade = __decorate([
                        core_1.Directive({ selector: 'ng1A' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentAFacade);
                    return Ng1ComponentAFacade;
                }(static_1.UpgradeComponent));
                var Ng1ComponentBFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentBFacade, _super);
                    function Ng1ComponentBFacade(elementRef, injector) {
                        return _super.call(this, 'ng1B', elementRef, injector) || this;
                    }
                    __decorate([
                        core_1.Input(),
                        __metadata("design:type", Object)
                    ], Ng1ComponentBFacade.prototype, "inputB", void 0);
                    Ng1ComponentBFacade = __decorate([
                        core_1.Directive({ selector: 'ng1B' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentBFacade);
                    return Ng1ComponentBFacade;
                }(static_1.UpgradeComponent));
                // Define `Ng2Component`
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component() {
                        this.data = { foo: 'bar' };
                        ng2ComponentInstance = this;
                    }
                    Ng2Component = __decorate([
                        core_1.Component({
                            selector: 'ng2',
                            template: '<ng1A [inputA]="data"></ng1A> | <ng1B [inputB]="data"></ng1B>'
                        }),
                        __metadata("design:paramtypes", [])
                    ], Ng2Component);
                    return Ng2Component;
                }());
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .directive('ng1A', function () { return ng1DirectiveA; })
                    .directive('ng1B', function () { return ng1DirectiveB; })
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentAFacade, Ng1ComponentBFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    // Initial change
                    expect(scopeOnChangesA.calls.count()).toBe(1);
                    expect(scopeOnChangesB).not.toHaveBeenCalled();
                    expect(controllerOnChangesA).not.toHaveBeenCalled();
                    expect(controllerOnChangesB.calls.count()).toBe(1);
                    expect(scopeOnChangesA.calls.argsFor(0)[0].inputA.currentValue).toEqual({ foo: 'bar' });
                    expect(scopeOnChangesA.calls.argsFor(0)[0].inputA.isFirstChange()).toBe(true);
                    expect(controllerOnChangesB.calls.argsFor(0)[0].inputB.currentValue).toEqual({
                        foo: 'bar'
                    });
                    expect(controllerOnChangesB.calls.argsFor(0)[0].inputB.isFirstChange()).toBe(true);
                    // Change: Re-assign `data`
                    ng2ComponentInstance.data = { foo: 'baz' };
                    test_helpers_1.$digest(adapter);
                    testing_1.tick();
                    expect(scopeOnChangesA.calls.count()).toBe(2);
                    expect(scopeOnChangesB).not.toHaveBeenCalled();
                    expect(controllerOnChangesA).not.toHaveBeenCalled();
                    expect(controllerOnChangesB.calls.count()).toBe(2);
                    expect(scopeOnChangesA.calls.argsFor(1)[0].inputA.previousValue).toEqual({ foo: 'bar' });
                    expect(scopeOnChangesA.calls.argsFor(1)[0].inputA.currentValue).toEqual({ foo: 'baz' });
                    expect(scopeOnChangesA.calls.argsFor(1)[0].inputA.isFirstChange()).toBe(false);
                    expect(controllerOnChangesB.calls.argsFor(1)[0].inputB.previousValue).toEqual({
                        foo: 'bar'
                    });
                    expect(controllerOnChangesB.calls.argsFor(1)[0].inputB.currentValue).toEqual({
                        foo: 'baz'
                    });
                    expect(controllerOnChangesB.calls.argsFor(1)[0].inputB.isFirstChange()).toBe(false);
                    // No change: Update internal property
                    ng2ComponentInstance.data.foo = 'qux';
                    test_helpers_1.$digest(adapter);
                    testing_1.tick();
                    expect(scopeOnChangesA.calls.count()).toBe(2);
                    expect(scopeOnChangesB).not.toHaveBeenCalled();
                    expect(controllerOnChangesA).not.toHaveBeenCalled();
                    expect(controllerOnChangesB.calls.count()).toBe(2);
                    // Change: Re-assign `data` (even if it looks the same)
                    ng2ComponentInstance.data = { foo: 'qux' };
                    test_helpers_1.$digest(adapter);
                    testing_1.tick();
                    expect(scopeOnChangesA.calls.count()).toBe(3);
                    expect(scopeOnChangesB).not.toHaveBeenCalled();
                    expect(controllerOnChangesA).not.toHaveBeenCalled();
                    expect(controllerOnChangesB.calls.count()).toBe(3);
                    expect(scopeOnChangesA.calls.argsFor(2)[0].inputA.previousValue).toEqual({ foo: 'qux' });
                    expect(scopeOnChangesA.calls.argsFor(2)[0].inputA.currentValue).toEqual({ foo: 'qux' });
                    expect(scopeOnChangesA.calls.argsFor(2)[0].inputA.isFirstChange()).toBe(false);
                    expect(controllerOnChangesB.calls.argsFor(2)[0].inputB.previousValue).toEqual({
                        foo: 'qux'
                    });
                    expect(controllerOnChangesB.calls.argsFor(2)[0].inputB.currentValue).toEqual({
                        foo: 'qux'
                    });
                    expect(controllerOnChangesB.calls.argsFor(2)[0].inputB.isFirstChange()).toBe(false);
                });
            }));
            it('should call `$onInit()` on controller', testing_1.async(function () {
                // Define `ng1Directive`
                var ng1DirectiveA = {
                    template: 'Called: {{ called }}',
                    bindToController: false,
                    controller: /** @class */ (function () {
                        function class_21($scope) {
                            this.$scope = $scope;
                            $scope['called'] = 'no';
                        }
                        class_21.prototype.$onInit = function () { this.$scope['called'] = 'yes'; };
                        return class_21;
                    }())
                };
                var ng1DirectiveB = {
                    template: 'Called: {{ called }}',
                    bindToController: true,
                    controller: /** @class */ (function () {
                        function class_22($scope) {
                            $scope['called'] = 'no';
                            this['$onInit'] = function () { return $scope['called'] = 'yes'; };
                        }
                        return class_22;
                    }())
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentAFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentAFacade, _super);
                    function Ng1ComponentAFacade(elementRef, injector) {
                        return _super.call(this, 'ng1A', elementRef, injector) || this;
                    }
                    Ng1ComponentAFacade = __decorate([
                        core_1.Directive({ selector: 'ng1A' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentAFacade);
                    return Ng1ComponentAFacade;
                }(static_1.UpgradeComponent));
                var Ng1ComponentBFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentBFacade, _super);
                    function Ng1ComponentBFacade(elementRef, injector) {
                        return _super.call(this, 'ng1B', elementRef, injector) || this;
                    }
                    Ng1ComponentBFacade = __decorate([
                        core_1.Directive({ selector: 'ng1B' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentBFacade);
                    return Ng1ComponentBFacade;
                }(static_1.UpgradeComponent));
                // Define `Ng2Component`
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component() {
                    }
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<ng1A></ng1A> | <ng1B></ng1B>' })
                    ], Ng2Component);
                    return Ng2Component;
                }());
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .directive('ng1A', function () { return ng1DirectiveA; })
                    .directive('ng1B', function () { return ng1DirectiveB; })
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentAFacade, Ng1ComponentBFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Called: yes | Called: yes');
                });
            }));
            it('should not call `$onInit()` on scope', testing_1.async(function () {
                // Define `ng1Directive`
                var ng1DirectiveA = {
                    template: 'Called: {{ called }}',
                    bindToController: false,
                    controller: /** @class */ (function () {
                        function class_23($scope) {
                            $scope['called'] = 'no';
                            $scope['$onInit'] = function () { return $scope['called'] = 'yes'; };
                            Object.getPrototypeOf($scope)['$onInit'] = function () { return $scope['called'] = 'yes'; };
                        }
                        return class_23;
                    }())
                };
                var ng1DirectiveB = {
                    template: 'Called: {{ called }}',
                    bindToController: true,
                    controller: /** @class */ (function () {
                        function class_24($scope) {
                            $scope['called'] = 'no';
                            $scope['$onInit'] = function () { return $scope['called'] = 'yes'; };
                            Object.getPrototypeOf($scope)['$onInit'] = function () { return $scope['called'] = 'yes'; };
                        }
                        return class_24;
                    }())
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentAFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentAFacade, _super);
                    function Ng1ComponentAFacade(elementRef, injector) {
                        return _super.call(this, 'ng1A', elementRef, injector) || this;
                    }
                    Ng1ComponentAFacade = __decorate([
                        core_1.Directive({ selector: 'ng1A' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentAFacade);
                    return Ng1ComponentAFacade;
                }(static_1.UpgradeComponent));
                var Ng1ComponentBFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentBFacade, _super);
                    function Ng1ComponentBFacade(elementRef, injector) {
                        return _super.call(this, 'ng1B', elementRef, injector) || this;
                    }
                    Ng1ComponentBFacade = __decorate([
                        core_1.Directive({ selector: 'ng1B' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentBFacade);
                    return Ng1ComponentBFacade;
                }(static_1.UpgradeComponent));
                // Define `Ng2Component`
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component() {
                    }
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<ng1A></ng1A> | <ng1B></ng1B>' })
                    ], Ng2Component);
                    return Ng2Component;
                }());
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .directive('ng1A', function () { return ng1DirectiveA; })
                    .directive('ng1B', function () { return ng1DirectiveB; })
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentAFacade, Ng1ComponentBFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Called: no | Called: no');
                });
            }));
            it('should call `$postLink()` on controller', testing_1.async(function () {
                // Define `ng1Directive`
                var ng1DirectiveA = {
                    template: 'Called: {{ called }}',
                    bindToController: false,
                    controller: /** @class */ (function () {
                        function class_25($scope) {
                            this.$scope = $scope;
                            $scope['called'] = 'no';
                        }
                        class_25.prototype.$postLink = function () { this.$scope['called'] = 'yes'; };
                        return class_25;
                    }())
                };
                var ng1DirectiveB = {
                    template: 'Called: {{ called }}',
                    bindToController: true,
                    controller: /** @class */ (function () {
                        function class_26($scope) {
                            $scope['called'] = 'no';
                            this['$postLink'] = function () { return $scope['called'] = 'yes'; };
                        }
                        return class_26;
                    }())
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentAFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentAFacade, _super);
                    function Ng1ComponentAFacade(elementRef, injector) {
                        return _super.call(this, 'ng1A', elementRef, injector) || this;
                    }
                    Ng1ComponentAFacade = __decorate([
                        core_1.Directive({ selector: 'ng1A' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentAFacade);
                    return Ng1ComponentAFacade;
                }(static_1.UpgradeComponent));
                var Ng1ComponentBFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentBFacade, _super);
                    function Ng1ComponentBFacade(elementRef, injector) {
                        return _super.call(this, 'ng1B', elementRef, injector) || this;
                    }
                    Ng1ComponentBFacade = __decorate([
                        core_1.Directive({ selector: 'ng1B' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentBFacade);
                    return Ng1ComponentBFacade;
                }(static_1.UpgradeComponent));
                // Define `Ng2Component`
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component() {
                    }
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<ng1A></ng1A> | <ng1B></ng1B>' })
                    ], Ng2Component);
                    return Ng2Component;
                }());
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .directive('ng1A', function () { return ng1DirectiveA; })
                    .directive('ng1B', function () { return ng1DirectiveB; })
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentAFacade, Ng1ComponentBFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Called: yes | Called: yes');
                });
            }));
            it('should not call `$postLink()` on scope', testing_1.async(function () {
                // Define `ng1Directive`
                var ng1DirectiveA = {
                    template: 'Called: {{ called }}',
                    bindToController: false,
                    controller: /** @class */ (function () {
                        function class_27($scope) {
                            $scope['called'] = 'no';
                            $scope['$postLink'] = function () { return $scope['called'] = 'yes'; };
                            Object.getPrototypeOf($scope)['$postLink'] = function () { return $scope['called'] = 'yes'; };
                        }
                        return class_27;
                    }())
                };
                var ng1DirectiveB = {
                    template: 'Called: {{ called }}',
                    bindToController: true,
                    controller: /** @class */ (function () {
                        function class_28($scope) {
                            $scope['called'] = 'no';
                            $scope['$postLink'] = function () { return $scope['called'] = 'yes'; };
                            Object.getPrototypeOf($scope)['$postLink'] = function () { return $scope['called'] = 'yes'; };
                        }
                        return class_28;
                    }())
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentAFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentAFacade, _super);
                    function Ng1ComponentAFacade(elementRef, injector) {
                        return _super.call(this, 'ng1A', elementRef, injector) || this;
                    }
                    Ng1ComponentAFacade = __decorate([
                        core_1.Directive({ selector: 'ng1A' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentAFacade);
                    return Ng1ComponentAFacade;
                }(static_1.UpgradeComponent));
                var Ng1ComponentBFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentBFacade, _super);
                    function Ng1ComponentBFacade(elementRef, injector) {
                        return _super.call(this, 'ng1B', elementRef, injector) || this;
                    }
                    Ng1ComponentBFacade = __decorate([
                        core_1.Directive({ selector: 'ng1B' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentBFacade);
                    return Ng1ComponentBFacade;
                }(static_1.UpgradeComponent));
                // Define `Ng2Component`
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component() {
                    }
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<ng1A></ng1A> | <ng1B></ng1B>' })
                    ], Ng2Component);
                    return Ng2Component;
                }());
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .directive('ng1A', function () { return ng1DirectiveA; })
                    .directive('ng1B', function () { return ng1DirectiveB; })
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentAFacade, Ng1ComponentBFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Called: no | Called: no');
                });
            }));
            it('should call `$doCheck()` on controller', testing_1.async(function () {
                var controllerDoCheckA = jasmine.createSpy('controllerDoCheckA');
                var controllerDoCheckB = jasmine.createSpy('controllerDoCheckB');
                // Define `ng1Directive`
                var ng1DirectiveA = {
                    template: 'ng1A',
                    bindToController: false,
                    controller: /** @class */ (function () {
                        function controller() {
                        }
                        controller.prototype.$doCheck = function () { controllerDoCheckA(); };
                        return controller;
                    }())
                };
                var ng1DirectiveB = {
                    template: 'ng1B',
                    bindToController: true,
                    controller: /** @class */ (function () {
                        function class_29() {
                            this['$doCheck'] = controllerDoCheckB;
                        }
                        return class_29;
                    }())
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentAFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentAFacade, _super);
                    function Ng1ComponentAFacade(elementRef, injector) {
                        return _super.call(this, 'ng1A', elementRef, injector) || this;
                    }
                    Ng1ComponentAFacade = __decorate([
                        core_1.Directive({ selector: 'ng1A' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentAFacade);
                    return Ng1ComponentAFacade;
                }(static_1.UpgradeComponent));
                var Ng1ComponentBFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentBFacade, _super);
                    function Ng1ComponentBFacade(elementRef, injector) {
                        return _super.call(this, 'ng1B', elementRef, injector) || this;
                    }
                    Ng1ComponentBFacade = __decorate([
                        core_1.Directive({ selector: 'ng1B' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentBFacade);
                    return Ng1ComponentBFacade;
                }(static_1.UpgradeComponent));
                // Define `Ng2Component`
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component() {
                    }
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<ng1A></ng1A> | <ng1B></ng1B>' })
                    ], Ng2Component);
                    return Ng2Component;
                }());
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .directive('ng1A', function () { return ng1DirectiveA; })
                    .directive('ng1B', function () { return ng1DirectiveB; })
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentAFacade, Ng1ComponentBFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    // Get to a stable `$digest` state.
                    test_helpers_1.$digest(adapter);
                    // Initial change.
                    // (Do not use a specific number due to differences between AngularJS 1.5/1.6.)
                    expect(controllerDoCheckA.calls.count()).toBeGreaterThan(0);
                    expect(controllerDoCheckB.calls.count()).toBeGreaterThan(0);
                    controllerDoCheckA.calls.reset();
                    controllerDoCheckB.calls.reset();
                    // Run a `$digest`
                    test_helpers_1.$digest(adapter);
                    expect(controllerDoCheckA.calls.count()).toBe(1);
                    expect(controllerDoCheckB.calls.count()).toBe(1);
                    // Run another `$digest`
                    test_helpers_1.$digest(adapter);
                    expect(controllerDoCheckA.calls.count()).toBe(2);
                    expect(controllerDoCheckB.calls.count()).toBe(2);
                });
            }));
            it('should not call `$doCheck()` on scope', testing_1.async(function () {
                var scopeDoCheck = jasmine.createSpy('scopeDoCheck');
                // Define `ng1Directive`
                var ng1DirectiveA = {
                    template: 'ng1A',
                    bindToController: false,
                    controller: /** @class */ (function () {
                        function class_30($scope) {
                            this.$scope = $scope;
                            $scope['$doCheck'] = scopeDoCheck;
                        }
                        return class_30;
                    }())
                };
                var ng1DirectiveB = {
                    template: 'ng1B',
                    bindToController: true,
                    controller: /** @class */ (function () {
                        function class_31($scope) {
                            this.$scope = $scope;
                            $scope['$doCheck'] = scopeDoCheck;
                        }
                        return class_31;
                    }())
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentAFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentAFacade, _super);
                    function Ng1ComponentAFacade(elementRef, injector) {
                        return _super.call(this, 'ng1A', elementRef, injector) || this;
                    }
                    Ng1ComponentAFacade = __decorate([
                        core_1.Directive({ selector: 'ng1A' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentAFacade);
                    return Ng1ComponentAFacade;
                }(static_1.UpgradeComponent));
                var Ng1ComponentBFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentBFacade, _super);
                    function Ng1ComponentBFacade(elementRef, injector) {
                        return _super.call(this, 'ng1B', elementRef, injector) || this;
                    }
                    Ng1ComponentBFacade = __decorate([
                        core_1.Directive({ selector: 'ng1B' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentBFacade);
                    return Ng1ComponentBFacade;
                }(static_1.UpgradeComponent));
                // Define `Ng2Component`
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component() {
                    }
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<ng1A></ng1A> | <ng1B></ng1B>' })
                    ], Ng2Component);
                    return Ng2Component;
                }());
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .directive('ng1A', function () { return ng1DirectiveA; })
                    .directive('ng1B', function () { return ng1DirectiveB; })
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentAFacade, Ng1ComponentBFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    // Initial change
                    expect(scopeDoCheck).not.toHaveBeenCalled();
                    // Run a `$digest`
                    test_helpers_1.$digest(adapter);
                    expect(scopeDoCheck).not.toHaveBeenCalled();
                    // Run another `$digest`
                    test_helpers_1.$digest(adapter);
                    expect(scopeDoCheck).not.toHaveBeenCalled();
                });
            }));
            it('should call `$onDestroy()` on controller', testing_1.async(function () {
                var controllerOnDestroyA = jasmine.createSpy('controllerOnDestroyA');
                var controllerOnDestroyB = jasmine.createSpy('controllerOnDestroyB');
                // Define `ng1Directive`
                var ng1DirectiveA = {
                    template: 'ng1A',
                    scope: {},
                    bindToController: false,
                    controllerAs: '$ctrl',
                    controller: /** @class */ (function () {
                        function controller() {
                        }
                        controller.prototype.$onDestroy = function () { controllerOnDestroyA(); };
                        return controller;
                    }())
                };
                var ng1DirectiveB = {
                    template: 'ng1B',
                    scope: {},
                    bindToController: true,
                    controllerAs: '$ctrl',
                    controller: /** @class */ (function () {
                        function class_32() {
                            this['$onDestroy'] = controllerOnDestroyB;
                        }
                        return class_32;
                    }())
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentAFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentAFacade, _super);
                    function Ng1ComponentAFacade(elementRef, injector) {
                        return _super.call(this, 'ng1A', elementRef, injector) || this;
                    }
                    Ng1ComponentAFacade = __decorate([
                        core_1.Directive({ selector: 'ng1A' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentAFacade);
                    return Ng1ComponentAFacade;
                }(static_1.UpgradeComponent));
                var Ng1ComponentBFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentBFacade, _super);
                    function Ng1ComponentBFacade(elementRef, injector) {
                        return _super.call(this, 'ng1B', elementRef, injector) || this;
                    }
                    Ng1ComponentBFacade = __decorate([
                        core_1.Directive({ selector: 'ng1B' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentBFacade);
                    return Ng1ComponentBFacade;
                }(static_1.UpgradeComponent));
                // Define `Ng2Component`
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component() {
                    }
                    __decorate([
                        core_1.Input(),
                        __metadata("design:type", Boolean)
                    ], Ng2Component.prototype, "show", void 0);
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<div *ngIf="show"><ng1A></ng1A> | <ng1B></ng1B></div>' })
                    ], Ng2Component);
                    return Ng2Component;
                }());
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .directive('ng1A', function () { return ng1DirectiveA; })
                    .directive('ng1B', function () { return ng1DirectiveB; })
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentAFacade, Ng1ComponentBFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html('<ng2 [show]="!destroyFromNg2" ng-if="!destroyFromNg1"></ng2>');
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    var $rootScope = adapter.$injector.get('$rootScope');
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toBe('ng1A | ng1B');
                    expect(controllerOnDestroyA).not.toHaveBeenCalled();
                    expect(controllerOnDestroyB).not.toHaveBeenCalled();
                    $rootScope.$apply('destroyFromNg1 = true');
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toBe('');
                    expect(controllerOnDestroyA).toHaveBeenCalled();
                    expect(controllerOnDestroyB).toHaveBeenCalled();
                    controllerOnDestroyA.calls.reset();
                    controllerOnDestroyB.calls.reset();
                    $rootScope.$apply('destroyFromNg1 = false');
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toBe('ng1A | ng1B');
                    expect(controllerOnDestroyA).not.toHaveBeenCalled();
                    expect(controllerOnDestroyB).not.toHaveBeenCalled();
                    $rootScope.$apply('destroyFromNg2 = true');
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toBe('');
                    expect(controllerOnDestroyA).toHaveBeenCalled();
                    expect(controllerOnDestroyB).toHaveBeenCalled();
                });
            }));
            it('should not call `$onDestroy()` on scope', testing_1.async(function () {
                var scopeOnDestroy = jasmine.createSpy('scopeOnDestroy');
                // Define `ng1Directive`
                var ng1DirectiveA = {
                    template: 'ng1A',
                    scope: {},
                    bindToController: false,
                    controllerAs: '$ctrl',
                    controller: /** @class */ (function () {
                        function class_33($scope) {
                            $scope['$onDestroy'] = scopeOnDestroy;
                            Object.getPrototypeOf($scope)['$onDestroy'] = scopeOnDestroy;
                        }
                        return class_33;
                    }())
                };
                var ng1DirectiveB = {
                    template: 'ng1B',
                    scope: {},
                    bindToController: true,
                    controllerAs: '$ctrl',
                    controller: /** @class */ (function () {
                        function class_34($scope) {
                            $scope['$onDestroy'] = scopeOnDestroy;
                            Object.getPrototypeOf($scope)['$onDestroy'] = scopeOnDestroy;
                        }
                        return class_34;
                    }())
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentAFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentAFacade, _super);
                    function Ng1ComponentAFacade(elementRef, injector) {
                        return _super.call(this, 'ng1A', elementRef, injector) || this;
                    }
                    Ng1ComponentAFacade = __decorate([
                        core_1.Directive({ selector: 'ng1A' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentAFacade);
                    return Ng1ComponentAFacade;
                }(static_1.UpgradeComponent));
                var Ng1ComponentBFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentBFacade, _super);
                    function Ng1ComponentBFacade(elementRef, injector) {
                        return _super.call(this, 'ng1B', elementRef, injector) || this;
                    }
                    Ng1ComponentBFacade = __decorate([
                        core_1.Directive({ selector: 'ng1B' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentBFacade);
                    return Ng1ComponentBFacade;
                }(static_1.UpgradeComponent));
                // Define `Ng2Component`
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component() {
                    }
                    __decorate([
                        core_1.Input(),
                        __metadata("design:type", Boolean)
                    ], Ng2Component.prototype, "show", void 0);
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<div *ngIf="show"><ng1A></ng1A> | <ng1B></ng1B></div>' })
                    ], Ng2Component);
                    return Ng2Component;
                }());
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .directive('ng1A', function () { return ng1DirectiveA; })
                    .directive('ng1B', function () { return ng1DirectiveB; })
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentAFacade, Ng1ComponentBFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html('<ng2 [show]="!destroyFromNg2" ng-if="!destroyFromNg1"></ng2>');
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    var $rootScope = adapter.$injector.get('$rootScope');
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toBe('ng1A | ng1B');
                    expect(scopeOnDestroy).not.toHaveBeenCalled();
                    $rootScope.$apply('destroyFromNg1 = true');
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toBe('');
                    expect(scopeOnDestroy).not.toHaveBeenCalled();
                    $rootScope.$apply('destroyFromNg1 = false');
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toBe('ng1A | ng1B');
                    expect(scopeOnDestroy).not.toHaveBeenCalled();
                    $rootScope.$apply('destroyFromNg2 = true');
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toBe('');
                    expect(scopeOnDestroy).not.toHaveBeenCalled();
                });
            }));
            it('should be called in order `$onChanges()` > `$onInit()` > `$doCheck()` > `$postLink()`', testing_1.async(function () {
                // Define `ng1Component`
                var ng1Component = {
                    // `$doCheck()` will keep getting called as long as the interpolated value keeps
                    // changing (by appending `> $doCheck`). Only care about the first 4 values.
                    template: '{{ $ctrl.calls.slice(0, 4).join(" > ") }}',
                    bindings: { value: '<' },
                    controller: /** @class */ (function () {
                        function class_35() {
                            this.calls = [];
                        }
                        class_35.prototype.$onChanges = function () { this.calls.push('$onChanges'); };
                        class_35.prototype.$onInit = function () { this.calls.push('$onInit'); };
                        class_35.prototype.$doCheck = function () { this.calls.push('$doCheck'); };
                        class_35.prototype.$postLink = function () { this.calls.push('$postLink'); };
                        return class_35;
                    }())
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = /** @class */ (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    __decorate([
                        core_1.Input(),
                        __metadata("design:type", Object)
                    ], Ng1ComponentFacade.prototype, "value", void 0);
                    Ng1ComponentFacade = __decorate([
                        core_1.Directive({ selector: 'ng1' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentFacade);
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
                // Define `Ng2Component`
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component() {
                    }
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<ng1 value="foo"></ng1>' })
                    ], Ng2Component);
                    return Ng2Component;
                }());
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(test_helpers_1.multiTrim(element.textContent))
                        .toBe('$onChanges > $onInit > $doCheck > $postLink');
                });
            }));
        });
        describe('destroying the upgraded component', function () {
            it('should destroy `$componentScope`', testing_1.async(function () {
                var scopeDestroyListener = jasmine.createSpy('scopeDestroyListener');
                var ng2ComponentAInstance;
                // Define `ng1Component`
                var ng1Component = {
                    controller: /** @class */ (function () {
                        function class_36($scope) {
                            $scope.$on('$destroy', scopeDestroyListener);
                        }
                        return class_36;
                    }())
                };
                // Define `Ng1ComponentFacade`
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
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2A', static_1.downgradeComponent({ component: Ng2ComponentA }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentFacade, Ng2ComponentA, Ng2ComponentB],
                            entryComponents: [Ng2ComponentA],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2-a></ng2-a>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    expect(scopeDestroyListener).not.toHaveBeenCalled();
                    ng2ComponentAInstance.destroyIt = true;
                    test_helpers_1.$digest(adapter);
                    expect(scopeDestroyListener).toHaveBeenCalledTimes(1);
                });
            }));
            it('should emit `$destroy` on `$element` and descendants', testing_1.async(function () {
                var elementDestroyListener = jasmine.createSpy('elementDestroyListener');
                var descendantDestroyListener = jasmine.createSpy('descendantDestroyListener');
                var ng2ComponentAInstance;
                // Define `ng1Component`
                var ng1Component = {
                    controller: /** @class */ (function () {
                        function class_37($element) {
                            $element.on('$destroy', elementDestroyListener);
                            $element.contents().on('$destroy', descendantDestroyListener);
                        }
                        return class_37;
                    }()),
                    template: '<div></div>'
                };
                // Define `Ng1ComponentFacade`
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
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2A', static_1.downgradeComponent({ component: Ng2ComponentA }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentFacade, Ng2ComponentA, Ng2ComponentB],
                            entryComponents: [Ng2ComponentA],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2-a></ng2-a>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    expect(elementDestroyListener).not.toHaveBeenCalled();
                    expect(descendantDestroyListener).not.toHaveBeenCalled();
                    ng2ComponentAInstance.destroyIt = true;
                    test_helpers_1.$digest(adapter);
                    expect(elementDestroyListener).toHaveBeenCalledTimes(1);
                    expect(descendantDestroyListener).toHaveBeenCalledTimes(1);
                });
            }));
            it('should clear data on `$element` and descendants`', testing_1.async(function () {
                var ng1ComponentElement;
                var ng2ComponentAInstance;
                // Define `ng1Component`
                var ng1Component = {
                    controller: /** @class */ (function () {
                        function class_38($element) {
                            $element.data('test', 1);
                            $element.contents().data('test', 2);
                            ng1ComponentElement = $element;
                        }
                        return class_38;
                    }()),
                    template: '<div></div>'
                };
                // Define `Ng1ComponentFacade`
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
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2A', static_1.downgradeComponent({ component: Ng2ComponentA }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentFacade, Ng2ComponentA, Ng2ComponentB],
                            entryComponents: [Ng2ComponentA],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2-a></ng2-a>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    expect(ng1ComponentElement.data('test')).toBe(1);
                    expect(ng1ComponentElement.contents().data('test')).toBe(2);
                    ng2ComponentAInstance.destroyIt = true;
                    test_helpers_1.$digest(adapter);
                    expect(ng1ComponentElement.data('test')).toBeUndefined();
                    expect(ng1ComponentElement.contents().data('test')).toBeUndefined();
                });
            }));
            it('should clear dom listeners on `$element` and descendants`', testing_1.async(function () {
                var elementClickListener = jasmine.createSpy('elementClickListener');
                var descendantClickListener = jasmine.createSpy('descendantClickListener');
                var ng1DescendantElement;
                var ng2ComponentAInstance;
                // Define `ng1Component`
                var ng1Component = {
                    controller: /** @class */ (function () {
                        function class_39($element) {
                            ng1DescendantElement = $element.contents();
                            $element.on('click', elementClickListener);
                            ng1DescendantElement.on('click', descendantClickListener);
                        }
                        return class_39;
                    }()),
                    template: '<div></div>'
                };
                // Define `Ng1ComponentFacade`
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
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2A', static_1.downgradeComponent({ component: Ng2ComponentA }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentFacade, Ng2ComponentA, Ng2ComponentB],
                            entryComponents: [Ng2ComponentA],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2-a></ng2-a>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    ng1DescendantElement[0].click();
                    expect(elementClickListener).toHaveBeenCalledTimes(1);
                    expect(descendantClickListener).toHaveBeenCalledTimes(1);
                    ng2ComponentAInstance.destroyIt = true;
                    test_helpers_1.$digest(adapter);
                    ng1DescendantElement[0].click();
                    expect(elementClickListener).toHaveBeenCalledTimes(1);
                    expect(descendantClickListener).toHaveBeenCalledTimes(1);
                });
            }));
            it('should clean up `$doCheck()` watchers from the parent scope', testing_1.async(function () {
                var ng2Component;
                // Define `ng1Component`
                var ng1Component = { template: 'ng1', controller: /** @class */ (function () {
                        function controller() {
                        }
                        controller.prototype.$doCheck = function () { };
                        return controller;
                    }()) };
                // Define `Ng1ComponentFacade`
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
                // Define `Ng2Component`
                var Ng2Component = /** @class */ (function () {
                    function Ng2Component($scope) {
                        this.$scope = $scope;
                        this.doShow = false;
                        ng2Component = this;
                    }
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<ng1 *ngIf="doShow"></ng1>' }),
                        __param(0, core_1.Inject(constants_1.$SCOPE)),
                        __metadata("design:paramtypes", [Object])
                    ], Ng2Component);
                    return Ng2Component;
                }());
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = /** @class */ (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                            declarations: [Ng1ComponentFacade, Ng2Component],
                            entryComponents: [Ng2Component]
                        })
                    ], Ng2Module);
                    return Ng2Module;
                }());
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    var getWatcherCount = function () {
                        return ng2Component.$scope.$$watchers.length;
                    };
                    var baseWatcherCount = getWatcherCount();
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toBe('');
                    ng2Component.doShow = true;
                    test_helpers_1.$digest(adapter);
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toBe('ng1');
                    expect(getWatcherCount()).toBe(baseWatcherCount + 1);
                    ng2Component.doShow = false;
                    test_helpers_1.$digest(adapter);
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toBe('');
                    expect(getWatcherCount()).toBe(baseWatcherCount);
                    ng2Component.doShow = true;
                    test_helpers_1.$digest(adapter);
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toBe('ng1');
                    expect(getWatcherCount()).toBe(baseWatcherCount + 1);
                });
            }));
        });
        it('should support ng2 > ng1 > ng2 (no inputs/outputs)', testing_1.async(function () {
            // Define `ng1Component`
            var ng1Component = { template: 'ng1X(<ng2-b></ng2-b>)' };
            // Define `Ng1ComponentFacade`
            var Ng1ComponentFacade = /** @class */ (function (_super) {
                __extends(Ng1ComponentFacade, _super);
                function Ng1ComponentFacade(elementRef, injector) {
                    return _super.call(this, 'ng1X', elementRef, injector) || this;
                }
                Ng1ComponentFacade = __decorate([
                    core_1.Directive({ selector: 'ng1X' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentFacade);
                return Ng1ComponentFacade;
            }(static_1.UpgradeComponent));
            // Define `Ng2Component`
            var Ng2ComponentA = /** @class */ (function () {
                function Ng2ComponentA() {
                }
                Ng2ComponentA = __decorate([
                    core_1.Component({ selector: 'ng2-a', template: 'ng2A(<ng1X></ng1X>)' })
                ], Ng2ComponentA);
                return Ng2ComponentA;
            }());
            var Ng2ComponentB = /** @class */ (function () {
                function Ng2ComponentB() {
                }
                Ng2ComponentB = __decorate([
                    core_1.Component({ selector: 'ng2-b', template: 'ng2B' })
                ], Ng2ComponentB);
                return Ng2ComponentB;
            }());
            // Define `ng1Module`
            var ng1Module = angular.module('ng1', [])
                .component('ng1X', ng1Component)
                .directive('ng2A', static_1.downgradeComponent({ component: Ng2ComponentA }))
                .directive('ng2B', static_1.downgradeComponent({ component: Ng2ComponentB }));
            // Define `Ng2Module`
            var Ng2Module = /** @class */ (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () { };
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng1ComponentFacade, Ng2ComponentA, Ng2ComponentB],
                        entryComponents: [Ng2ComponentA, Ng2ComponentB],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                        schemas: [core_1.NO_ERRORS_SCHEMA],
                    })
                ], Ng2Module);
                return Ng2Module;
            }());
            // Bootstrap
            var element = test_helpers_1.html("<ng2-a></ng2-a>");
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                expect(test_helpers_1.multiTrim(document.body.textContent)).toBe('ng2A(ng1X(ng2B))');
            });
        }));
        it('should support ng2 > ng1 > ng2 (with inputs/outputs)', testing_1.fakeAsync(function () {
            var ng2ComponentAInstance;
            var ng2ComponentBInstance;
            var ng1ControllerXInstance;
            // Define `ng1Component`
            var Ng1ControllerX = /** @class */ (function () {
                function Ng1ControllerX() {
                    ng1ControllerXInstance = this;
                }
                return Ng1ControllerX;
            }());
            var ng1Component = {
                template: "\n              ng1X({{ $ctrl.ng1XInputA }}, {{ $ctrl.ng1XInputB.value }}, {{ $ctrl.ng1XInputC.value }}) |\n              <ng2-b\n                [ng2-b-input1]=\"$ctrl.ng1XInputA\"\n                [ng2-b-input-c]=\"$ctrl.ng1XInputC.value\"\n                (ng2-b-output-c)=\"$ctrl.ng1XInputC = {value: $event}\">\n              </ng2-b>\n            ",
                bindings: {
                    ng1XInputA: '@',
                    ng1XInputB: '<',
                    ng1XInputC: '=',
                    ng1XOutputA: '&',
                    ng1XOutputB: '&'
                },
                controller: Ng1ControllerX
            };
            // Define `Ng1ComponentFacade`
            var Ng1ComponentXFacade = /** @class */ (function (_super) {
                __extends(Ng1ComponentXFacade, _super);
                function Ng1ComponentXFacade(elementRef, injector) {
                    return _super.call(this, 'ng1X', elementRef, injector) || this;
                }
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", String)
                ], Ng1ComponentXFacade.prototype, "ng1XInputA", void 0);
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", Object)
                ], Ng1ComponentXFacade.prototype, "ng1XInputB", void 0);
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", Object)
                ], Ng1ComponentXFacade.prototype, "ng1XInputC", void 0);
                __decorate([
                    core_1.Output(),
                    __metadata("design:type", core_1.EventEmitter)
                ], Ng1ComponentXFacade.prototype, "ng1XInputCChange", void 0);
                __decorate([
                    core_1.Output(),
                    __metadata("design:type", core_1.EventEmitter)
                ], Ng1ComponentXFacade.prototype, "ng1XOutputA", void 0);
                __decorate([
                    core_1.Output(),
                    __metadata("design:type", core_1.EventEmitter)
                ], Ng1ComponentXFacade.prototype, "ng1XOutputB", void 0);
                Ng1ComponentXFacade = __decorate([
                    core_1.Directive({ selector: 'ng1X' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentXFacade);
                return Ng1ComponentXFacade;
            }(static_1.UpgradeComponent));
            // Define `Ng2Component`
            var Ng2ComponentA = /** @class */ (function () {
                function Ng2ComponentA() {
                    this.ng2ADataA = { value: 'foo' };
                    this.ng2ADataB = { value: 'bar' };
                    this.ng2ADataC = { value: 'baz' };
                    ng2ComponentAInstance = this;
                }
                Ng2ComponentA = __decorate([
                    core_1.Component({
                        selector: 'ng2-a',
                        template: "\n              ng2A({{ ng2ADataA.value }}, {{ ng2ADataB.value }}, {{ ng2ADataC.value }}) |\n              <ng1X\n                  ng1XInputA=\"{{ ng2ADataA.value }}\"\n                  bind-ng1XInputB=\"ng2ADataB\"\n                  [(ng1XInputC)]=\"ng2ADataC\"\n                  (ng1XOutputA)=\"ng2ADataA = $event\"\n                  on-ng1XOutputB=\"ng2ADataB.value = $event\">\n              </ng1X>\n            "
                    }),
                    __metadata("design:paramtypes", [])
                ], Ng2ComponentA);
                return Ng2ComponentA;
            }());
            var Ng2ComponentB = /** @class */ (function () {
                function Ng2ComponentB() {
                    this.ng2BOutputC = new core_1.EventEmitter();
                    ng2ComponentBInstance = this;
                }
                __decorate([
                    core_1.Input('ng2BInput1'),
                    __metadata("design:type", Object)
                ], Ng2ComponentB.prototype, "ng2BInputA", void 0);
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", Object)
                ], Ng2ComponentB.prototype, "ng2BInputC", void 0);
                __decorate([
                    core_1.Output(),
                    __metadata("design:type", Object)
                ], Ng2ComponentB.prototype, "ng2BOutputC", void 0);
                Ng2ComponentB = __decorate([
                    core_1.Component({ selector: 'ng2-b', template: 'ng2B({{ ng2BInputA }}, {{ ng2BInputC }})' }),
                    __metadata("design:paramtypes", [])
                ], Ng2ComponentB);
                return Ng2ComponentB;
            }());
            // Define `ng1Module`
            var ng1Module = angular.module('ng1', [])
                .component('ng1X', ng1Component)
                .directive('ng2A', static_1.downgradeComponent({ component: Ng2ComponentA }))
                .directive('ng2B', static_1.downgradeComponent({ component: Ng2ComponentB }));
            // Define `Ng2Module`
            var Ng2Module = /** @class */ (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () { };
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng1ComponentXFacade, Ng2ComponentA, Ng2ComponentB],
                        entryComponents: [Ng2ComponentA, Ng2ComponentB],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                        schemas: [core_1.NO_ERRORS_SCHEMA],
                    })
                ], Ng2Module);
                return Ng2Module;
            }());
            // Bootstrap
            var element = test_helpers_1.html("<ng2-a></ng2-a>");
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                // Initial value propagation.
                // (ng2A > ng1X > ng2B)
                expect(test_helpers_1.multiTrim(document.body.textContent))
                    .toBe('ng2A(foo, bar, baz) | ng1X(foo, bar, baz) | ng2B(foo, baz)');
                // Update `ng2BInputA`/`ng2BInputC`.
                // (Should not propagate upwards.)
                ng2ComponentBInstance.ng2BInputA = 'foo2';
                ng2ComponentBInstance.ng2BInputC = 'baz2';
                test_helpers_1.$digest(adapter);
                testing_1.tick();
                expect(test_helpers_1.multiTrim(document.body.textContent))
                    .toBe('ng2A(foo, bar, baz) | ng1X(foo, bar, baz) | ng2B(foo2, baz2)');
                // Emit from `ng2BOutputC`.
                // (Should propagate all the way up to `ng1ADataC` and back all the way down to
                // `ng2BInputC`.)
                ng2ComponentBInstance.ng2BOutputC.emit('baz3');
                test_helpers_1.$digest(adapter);
                testing_1.tick();
                expect(test_helpers_1.multiTrim(document.body.textContent))
                    .toBe('ng2A(foo, bar, baz3) | ng1X(foo, bar, baz3) | ng2B(foo2, baz3)');
                // Update `ng1XInputA`/`ng1XInputB`.
                // (Should not propagate upwards, only downwards.)
                ng1ControllerXInstance.ng1XInputA = 'foo4';
                ng1ControllerXInstance.ng1XInputB = { value: 'bar4' };
                test_helpers_1.$digest(adapter);
                testing_1.tick();
                expect(test_helpers_1.multiTrim(document.body.textContent))
                    .toBe('ng2A(foo, bar, baz3) | ng1X(foo4, bar4, baz3) | ng2B(foo4, baz3)');
                // Update `ng1XInputC`.
                // (Should propagate upwards and downwards.)
                ng1ControllerXInstance.ng1XInputC = { value: 'baz5' };
                test_helpers_1.$digest(adapter);
                testing_1.tick();
                expect(test_helpers_1.multiTrim(document.body.textContent))
                    .toBe('ng2A(foo, bar, baz5) | ng1X(foo4, bar4, baz5) | ng2B(foo4, baz5)');
                // Update a property on `ng1XInputC`.
                // (Should propagate upwards and downwards.)
                ng1ControllerXInstance.ng1XInputC.value = 'baz6';
                test_helpers_1.$digest(adapter);
                testing_1.tick();
                expect(test_helpers_1.multiTrim(document.body.textContent))
                    .toBe('ng2A(foo, bar, baz6) | ng1X(foo4, bar4, baz6) | ng2B(foo4, baz6)');
                // Emit from `ng1XOutputA`.
                // (Should propagate upwards to `ng1ADataA` and back all the way down to `ng2BInputA`.)
                ng1ControllerXInstance.ng1XOutputA({ value: 'foo7' });
                test_helpers_1.$digest(adapter);
                testing_1.tick();
                expect(test_helpers_1.multiTrim(document.body.textContent))
                    .toBe('ng2A(foo7, bar, baz6) | ng1X(foo7, bar4, baz6) | ng2B(foo7, baz6)');
                // Emit from `ng1XOutputB`.
                // (Should propagate upwards to `ng1ADataB`, but not downwards,
                //  since `ng1XInputB` has been re-assigned (i.e. `ng2ADataB !== ng1XInputB`).)
                ng1ControllerXInstance.ng1XOutputB('bar8');
                test_helpers_1.$digest(adapter);
                testing_1.tick();
                expect(test_helpers_1.multiTrim(document.body.textContent))
                    .toBe('ng2A(foo7, bar8, baz6) | ng1X(foo7, bar4, baz6) | ng2B(foo7, baz6)');
                // Update `ng2ADataA`/`ng2ADataB`/`ng2ADataC`.
                // (Should propagate everywhere.)
                ng2ComponentAInstance.ng2ADataA = { value: 'foo9' };
                ng2ComponentAInstance.ng2ADataB = { value: 'bar9' };
                ng2ComponentAInstance.ng2ADataC = { value: 'baz9' };
                test_helpers_1.$digest(adapter);
                testing_1.tick();
                expect(test_helpers_1.multiTrim(document.body.textContent))
                    .toBe('ng2A(foo9, bar9, baz9) | ng1X(foo9, bar9, baz9) | ng2B(foo9, baz9)');
            });
        }));
        it('should support ng2 > ng1 > ng2 > ng1 (with `require`)', testing_1.async(function () {
            // Define `ng1Component`
            var ng1ComponentA = {
                template: 'ng1A(<ng2-b></ng2-b>)',
                controller: /** @class */ (function () {
                    function class_40() {
                        this.value = 'ng1A';
                    }
                    return class_40;
                }())
            };
            var ng1ComponentB = {
                template: 'ng1B(^^ng1A: {{ $ctrl.ng1A.value }} | ?^^ng1B: {{ $ctrl.ng1B.value }} | ^ng1B: {{ $ctrl.ng1BSelf.value }})',
                require: { ng1A: '^^', ng1B: '?^^', ng1BSelf: '^ng1B' },
                controller: /** @class */ (function () {
                    function class_41() {
                        this.value = 'ng1B';
                    }
                    return class_41;
                }())
            };
            // Define `Ng1ComponentFacade`
            var Ng1ComponentAFacade = /** @class */ (function (_super) {
                __extends(Ng1ComponentAFacade, _super);
                function Ng1ComponentAFacade(elementRef, injector) {
                    return _super.call(this, 'ng1A', elementRef, injector) || this;
                }
                Ng1ComponentAFacade = __decorate([
                    core_1.Directive({ selector: 'ng1A' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentAFacade);
                return Ng1ComponentAFacade;
            }(static_1.UpgradeComponent));
            var Ng1ComponentBFacade = /** @class */ (function (_super) {
                __extends(Ng1ComponentBFacade, _super);
                function Ng1ComponentBFacade(elementRef, injector) {
                    return _super.call(this, 'ng1B', elementRef, injector) || this;
                }
                Ng1ComponentBFacade = __decorate([
                    core_1.Directive({ selector: 'ng1B' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentBFacade);
                return Ng1ComponentBFacade;
            }(static_1.UpgradeComponent));
            // Define `Ng2Component`
            var Ng2ComponentA = /** @class */ (function () {
                function Ng2ComponentA() {
                }
                Ng2ComponentA = __decorate([
                    core_1.Component({ selector: 'ng2-a', template: 'ng2A(<ng1A></ng1A>)' })
                ], Ng2ComponentA);
                return Ng2ComponentA;
            }());
            var Ng2ComponentB = /** @class */ (function () {
                function Ng2ComponentB() {
                }
                Ng2ComponentB = __decorate([
                    core_1.Component({ selector: 'ng2-b', template: 'ng2B(<ng1B></ng1B>)' })
                ], Ng2ComponentB);
                return Ng2ComponentB;
            }());
            // Define `ng1Module`
            var ng1Module = angular.module('ng1', [])
                .component('ng1A', ng1ComponentA)
                .component('ng1B', ng1ComponentB)
                .directive('ng2A', static_1.downgradeComponent({ component: Ng2ComponentA }))
                .directive('ng2B', static_1.downgradeComponent({ component: Ng2ComponentB }));
            // Define `Ng2Module`
            var Ng2Module = /** @class */ (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () { };
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng1ComponentAFacade, Ng1ComponentBFacade, Ng2ComponentA, Ng2ComponentB],
                        entryComponents: [Ng2ComponentA, Ng2ComponentB],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                        schemas: [core_1.NO_ERRORS_SCHEMA],
                    })
                ], Ng2Module);
                return Ng2Module;
            }());
            // Bootstrap
            var element = test_helpers_1.html("<ng2-a></ng2-a>");
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                expect(test_helpers_1.multiTrim(document.body.textContent))
                    .toBe('ng2A(ng1A(ng2B(ng1B(^^ng1A: ng1A | ?^^ng1B: | ^ng1B: ng1B))))');
            });
        }));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBncmFkZV9jb21wb25lbnRfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3VwZ3JhZGUvdGVzdC9zdGF0aWMvaW50ZWdyYXRpb24vdXBncmFkZV9jb21wb25lbnRfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBd0w7QUFDeEwsaURBQTZEO0FBQzdELDhEQUF3RDtBQUN4RCw4RUFBeUU7QUFDekUsa0RBQTRGO0FBQzVGLHFFQUF1RTtBQUN2RSwwRUFBb0U7QUFFcEUsZ0RBQXdGO0FBRXhGLGlDQUFrQixDQUFDO0lBQ2pCLFFBQVEsQ0FBQyx1QkFBdUIsRUFBRTtRQUVoQyxVQUFVLENBQUMsY0FBTSxPQUFBLHNCQUFlLEVBQUUsRUFBakIsQ0FBaUIsQ0FBQyxDQUFDO1FBQ3BDLFNBQVMsQ0FBQyxjQUFNLE9BQUEsc0JBQWUsRUFBRSxFQUFqQixDQUFpQixDQUFDLENBQUM7UUFFbkMsUUFBUSxDQUFDLHNCQUFzQixFQUFFO1lBQy9CLEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRSxlQUFLLENBQUM7Z0JBQzFDLHdCQUF3QjtnQkFDeEIsSUFBTSxZQUFZLEdBQXVCLEVBQUMsUUFBUSxFQUFFLGlCQUFpQixFQUFDLENBQUM7Z0JBRXZFLDhCQUE4QjtnQkFFOUI7b0JBQWlDLHNDQUFnQjtvQkFDL0MsNEJBQVksVUFBc0IsRUFBRSxRQUFrQjsrQkFDcEQsa0JBQU0sS0FBSyxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUM7b0JBQ3BDLENBQUM7b0JBSEcsa0JBQWtCO3dCQUR2QixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBQyxDQUFDO3lEQUVILGlCQUFVLEVBQVksZUFBUTt1QkFEbEQsa0JBQWtCLENBSXZCO29CQUFELHlCQUFDO2lCQUFBLEFBSkQsQ0FBaUMseUJBQWdCLEdBSWhEO2dCQUVE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