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
    describe('injection', function () {
        beforeEach(function () { return core_1.destroyPlatform(); });
        afterEach(function () { return core_1.destroyPlatform(); });
        it('should downgrade ng2 service to ng1', testing_1.async(function () {
            // Tokens used in ng2 to identify services
            var Ng2Service = new core_1.InjectionToken('ng2-service');
            // Sample ng1 NgModule for tests
            var Ng2Module = /** @class */ (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () { };
                Ng2Module = __decorate([
                    core_1.NgModule({
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                        providers: [
                            { provide: Ng2Service, useValue: 'ng2 service value' },
                        ]
                    })
                ], Ng2Module);
                return Ng2Module;
            }());
            // create the ng1 module that will import an ng2 service
            var ng1Module = angular.module('ng1Module', []).factory('ng2Service', static_1.downgradeInjectable(Ng2Service));
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, test_helpers_1.html('<div>'), ng1Module)
                .then(function (upgrade) {
                var ng1Injector = upgrade.$injector;
                expect(ng1Injector.get('ng2Service')).toBe('ng2 service value');
            });
        }));
        it('should upgrade ng1 service to ng2', testing_1.async(function () {
            // Tokens used in ng2 to identify services
            var Ng1Service = new core_1.InjectionToken('ng1-service');
            // Sample ng1 NgModule for tests
            var Ng2Module = /** @class */ (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () { };
                Ng2Module = __decorate([
                    core_1.NgModule({
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                        providers: [
                            // the following line is the "upgrade" of an AngularJS service
                            {
                                provide: Ng1Service,
                                useFactory: function (i) { return i.get('ng1Service'); },
                                deps: ['$injector']
                            }
                        ]
                    })
                ], Ng2Module);
                return Ng2Module;
            }());
            // create the ng1 module that will import an ng2 service
            var ng1Module = angular.module('ng1Module', []).value('ng1Service', 'ng1 service value');
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, test_helpers_1.html('<div>'), ng1Module)
                .then(function (upgrade) {
                var ng2Injector = upgrade.injector;
                expect(ng2Injector.get(Ng1Service)).toBe('ng1 service value');
            });
        }));
        it('should initialize the upgraded injector before application run blocks are executed', testing_1.async(function () {
            var runBlockTriggered = false;
            var ng1Module = angular.module('ng1Module', []).run([
                constants_1.INJECTOR_KEY,
                function (injector) {
                    runBlockTriggered = true;
                    expect(injector.get(constants_1.$INJECTOR)).toBeDefined();
                }
            ]);
            var Ng2Module = /** @class */ (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () { };
                Ng2Module = __decorate([
                    core_1.NgModule({ imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule] })
                ], Ng2Module);
                return Ng2Module;
            }());
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, test_helpers_1.html('<div>'), ng1Module).then(function () {
                expect(runBlockTriggered).toBeTruthy();
            });
        }));
        it('should allow resetting angular at runtime', testing_1.async(function () {
            var wrappedBootstrapCalled = false;
            var n = static_1.getAngularJSGlobal();
            static_1.setAngularJSGlobal({
                bootstrap: function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    wrappedBootstrapCalled = true;
                    n.bootstrap.apply(n, args);
                },
                module: n.module,
                element: n.element,
                version: n.version,
                resumeBootstrap: n.resumeBootstrap,
                getTestability: n.getTestability
            });
            var Ng2Module = /** @class */ (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () { };
                Ng2Module = __decorate([
                    core_1.NgModule({ imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule] })
                ], Ng2Module);
                return Ng2Module;
            }());
            var ng1Module = angular.module('ng1Module', []);
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, test_helpers_1.html('<div>'), ng1Module)
                .then(function (upgrade) { return expect(wrappedBootstrapCalled).toBe(true); })
                .then(function () { return static_1.setAngularJSGlobal(n); }); // Reset the AngularJS global.
        }));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5qZWN0aW9uX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy91cGdyYWRlL3Rlc3Qvc3RhdGljL2ludGVncmF0aW9uL2luamVjdGlvbl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsc0NBQWtGO0FBQ2xGLGlEQUE0QztBQUM1Qyw4REFBd0Q7QUFDeEQsOEVBQXlFO0FBQ3pFLGtEQUFtSDtBQUNuSCxxRUFBdUU7QUFDdkUsMEVBQXFGO0FBRXJGLGdEQUFvRTtBQUVwRSxpQ0FBa0IsQ0FBQztJQUNqQixRQUFRLENBQUMsV0FBVyxFQUFFO1FBRXBCLFVBQVUsQ0FBQyxjQUFNLE9BQUEsc0JBQWUsRUFBRSxFQUFqQixDQUFpQixDQUFDLENBQUM7UUFDcEMsU0FBUyxDQUFDLGNBQU0sT0FBQSxzQkFBZSxFQUFFLEVBQWpCLENBQWlCLENBQUMsQ0FBQztRQUVuQyxFQUFFLENBQUMscUNBQXFDLEVBQUUsZUFBSyxDQUFDO1lBQzNDLDBDQUEwQztZQUMxQyxJQUFNLFVBQVUsR0FBRyxJQUFJLHFCQUFjLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFckQsZ0NBQWdDO1lBT2hDO2dCQUFBO2dCQUVBLENBQUM7Z0JBREMsaUNBQWEsR0FBYixjQUFpQixDQUFDO2dCQURkLFNBQVM7b0JBTmQsZUFBUSxDQUFDO3dCQUNSLE9BQU8sRUFBRSxDQUFDLGdDQUFhLEVBQUUsc0JBQWEsQ0FBQzt3QkFDdkMsU0FBUyxFQUFFOzRCQUNULEVBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsbUJBQW1CLEVBQUM7eUJBQ3JEO3FCQUNGLENBQUM7bUJBQ0ksU0FBUyxDQUVkO2dCQUFELGdCQUFDO2FBQUEsQUFGRCxJQUVDO1lBRUQsd0RBQXdEO1lBQ3hELElBQU0sU0FBUyxHQUNYLE9BQU8sQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FB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