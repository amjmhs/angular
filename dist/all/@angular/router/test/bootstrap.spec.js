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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var platform_browser_1 = require("@angular/platform-browser");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var router_1 = require("@angular/router");
var operators_1 = require("rxjs/operators");
describe('bootstrap', function () {
    if (isNode)
        return;
    var log = [];
    var testProviders = null;
    var RootCmp = /** @class */ (function () {
        function RootCmp() {
            log.push('RootCmp');
        }
        RootCmp = __decorate([
            core_1.Component({ selector: 'test-app', template: 'root <router-outlet></router-outlet>' }),
            __metadata("design:paramtypes", [])
        ], RootCmp);
        return RootCmp;
    }());
    var SecondRootCmp = /** @class */ (function () {
        function SecondRootCmp() {
        }
        SecondRootCmp = __decorate([
            core_1.Component({ selector: 'test-app2', template: 'root <router-outlet></router-outlet>' })
        ], SecondRootCmp);
        return SecondRootCmp;
    }());
    var TestResolver = /** @class */ (function () {
        function TestResolver() {
        }
        TestResolver.prototype.resolve = function () {
            var resolve = null;
            var res = new Promise(function (r) { return resolve = r; });
            setTimeout(function () { return resolve('test-data'); }, 0);
            return res;
        };
        return TestResolver;
    }());
    beforeEach(testing_1.inject([platform_browser_1.DOCUMENT], function (doc) {
        core_1.destroyPlatform();
        var el1 = platform_browser_1.ɵgetDOM().createElement('test-app', doc);
        var el2 = platform_browser_1.ɵgetDOM().createElement('test-app2', doc);
        platform_browser_1.ɵgetDOM().appendChild(doc.body, el1);
        platform_browser_1.ɵgetDOM().appendChild(doc.body, el2);
        log = [];
        testProviders = [{ provide: common_1.APP_BASE_HREF, useValue: '' }];
    }));
    afterEach(testing_1.inject([platform_browser_1.DOCUMENT], function (doc) {
        var oldRoots = platform_browser_1.ɵgetDOM().querySelectorAll(doc, 'test-app,test-app2');
        for (var i = 0; i < oldRoots.length; i++) {
            platform_browser_1.ɵgetDOM().remove(oldRoots[i]);
        }
    }));
    it('should wait for resolvers to complete when initialNavigation = enabled', function (done) {
        var TestCmpEnabled = /** @class */ (function () {
            function TestCmpEnabled() {
            }
            TestCmpEnabled = __decorate([
                core_1.Component({ selector: 'test', template: 'test' })
            ], TestCmpEnabled);
            return TestCmpEnabled;
        }());
        var TestModule = /** @class */ (function () {
            function TestModule(router) {
                log.push('TestModule');
                router.events.subscribe(function (e) { return log.push(e.constructor.name); });
            }
            TestModule = __decorate([
                core_1.NgModule({
                    imports: [
                        platform_browser_1.BrowserModule, router_1.RouterModule.forRoot([{ path: '**', component: TestCmpEnabled, resolve: { test: TestResolver } }], { useHash: true, initialNavigation: 'enabled' })
                    ],
                    declarations: [RootCmp, TestCmpEnabled],
                    bootstrap: [RootCmp],
                    providers: testProviders.concat([TestResolver]),
                    schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA]
                }),
                __metadata("design:paramtypes", [router_1.Router])
            ], TestModule);
            return TestModule;
        }());
        platform_browser_dynamic_1.platformBrowserDynamic([]).bootstrapModule(TestModule).then(function (res) {
            var router = res.injector.get(router_1.Router);
            var data = router.routerState.snapshot.root.firstChild.data;
            expect(data['test']).toEqual('test-data');
            expect(log).toEqual([
                'TestModule', 'NavigationStart', 'RoutesRecognized', 'GuardsCheckStart',
                'ChildActivationStart', 'ActivationStart', 'GuardsCheckEnd', 'ResolveStart', 'ResolveEnd',
                'RootCmp', 'ActivationEnd', 'ChildActivationEnd', 'NavigationEnd', 'Scroll'
            ]);
            done();
        });
    });
    it('should NOT wait for resolvers to complete when initialNavigation = legacy_enabled', function (done) {
        var TestCmpLegacyEnabled = /** @class */ (function () {
            function TestCmpLegacyEnabled() {
            }
            TestCmpLegacyEnabled = __decorate([
                core_1.Component({ selector: 'test', template: 'test' })
            ], TestCmpLegacyEnabled);
            return TestCmpLegacyEnabled;
        }());
        var TestModule = /** @class */ (function () {
            function TestModule(router) {
                log.push('TestModule');
                router.events.subscribe(function (e) { return log.push(e.constructor.name); });
            }
            TestModule = __decorate([
                core_1.NgModule({
                    imports: [
                        platform_browser_1.BrowserModule,
                        router_1.RouterModule.forRoot([{ path: '**', component: TestCmpLegacyEnabled, resolve: { test: TestResolver } }], { useHash: true, initialNavigation: 'legacy_enabled' })
                    ],
                    declarations: [RootCmp, TestCmpLegacyEnabled],
                    bootstrap: [RootCmp],
                    providers: testProviders.concat([TestResolver]),
                    schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA]
                }),
                __metadata("design:paramtypes", [router_1.Router])
            ], TestModule);
            return TestModule;
        }());
        platform_browser_dynamic_1.platformBrowserDynamic([]).bootstrapModule(TestModule).then(function (res) {
            var router = res.injector.get(router_1.Router);
            expect(router.routerState.snapshot.root.firstChild).toBeNull();
            // ResolveEnd has not been emitted yet because bootstrap returned too early
            expect(log).toEqual([
                'TestModule', 'RootCmp', 'NavigationStart', 'RoutesRecognized', 'GuardsCheckStart',
                'ChildActivationStart', 'ActivationStart', 'GuardsCheckEnd', 'ResolveStart'
            ]);
            router.events.subscribe(function (e) {
                if (e instanceof router_1.NavigationEnd) {
                    done();
                }
            });
        });
    });
    it('should not run navigation when initialNavigation = disabled', function (done) {
        var TestCmpDiabled = /** @class */ (function () {
            function TestCmpDiabled() {
            }
            TestCmpDiabled = __decorate([
                core_1.Component({ selector: 'test', template: 'test' })
            ], TestCmpDiabled);
            return TestCmpDiabled;
        }());
        var TestModule = /** @class */ (function () {
            function TestModule(router) {
                log.push('TestModule');
                router.events.subscribe(function (e) { return log.push(e.constructor.name); });
            }
            TestModule = __decorate([
                core_1.NgModule({
                    imports: [
                        platform_browser_1.BrowserModule, router_1.RouterModule.forRoot([{ path: '**', component: TestCmpDiabled, resolve: { test: TestResolver } }], { useHash: true, initialNavigation: 'disabled' })
                    ],
                    declarations: [RootCmp, TestCmpDiabled],
                    bootstrap: [RootCmp],
                    providers: testProviders.concat([TestResolver]),
                    schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA]
                }),
                __metadata("design:paramtypes", [router_1.Router])
            ], TestModule);
            return TestModule;
        }());
        platform_browser_dynamic_1.platformBrowserDynamic([]).bootstrapModule(TestModule).then(function (res) {
            var router = res.injector.get(router_1.Router);
            expect(log).toEqual(['TestModule', 'RootCmp']);
            done();
        });
    });
    it('should not run navigation when initialNavigation = legacy_disabled', function (done) {
        var TestCmpLegacyDisabled = /** @class */ (function () {
            function TestCmpLegacyDisabled() {
            }
            TestCmpLegacyDisabled = __decorate([
                core_1.Component({ selector: 'test', template: 'test' })
            ], TestCmpLegacyDisabled);
            return TestCmpLegacyDisabled;
        }());
        var TestModule = /** @class */ (function () {
            function TestModule(router) {
                log.push('TestModule');
                router.events.subscribe(function (e) { return log.push(e.constructor.name); });
            }
            TestModule = __decorate([
                core_1.NgModule({
                    imports: [
                        platform_browser_1.BrowserModule,
                        router_1.RouterModule.forRoot([{ path: '**', component: TestCmpLegacyDisabled, resolve: { test: TestResolver } }], { useHash: true, initialNavigation: 'legacy_disabled' })
                    ],
                    declarations: [RootCmp, TestCmpLegacyDisabled],
                    bootstrap: [RootCmp],
                    providers: testProviders.concat([TestResolver]),
                    schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA]
                }),
                __metadata("design:paramtypes", [router_1.Router])
            ], TestModule);
            return TestModule;
        }());
        platform_browser_dynamic_1.platformBrowserDynamic([]).bootstrapModule(TestModule).then(function (res) {
            var router = res.injector.get(router_1.Router);
            expect(log).toEqual(['TestModule', 'RootCmp']);
            done();
        });
    });
    it('should not init router navigation listeners if a non root component is bootstrapped', function (done) {
        var TestModule = /** @class */ (function () {
            function TestModule() {
            }
            TestModule = __decorate([
                core_1.NgModule({
                    imports: [platform_browser_1.BrowserModule, router_1.RouterModule.forRoot([], { useHash: true })],
                    declarations: [SecondRootCmp, RootCmp],
                    entryComponents: [SecondRootCmp],
                    bootstrap: [RootCmp],
                    providers: testProviders,
                    schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA]
                })
            ], TestModule);
            return TestModule;
        }());
        platform_browser_dynamic_1.platformBrowserDynamic([]).bootstrapModule(TestModule).then(function (res) {
            var router = res.injector.get(router_1.Router);
            spyOn(router, 'resetRootComponentType').and.callThrough();
            var appRef = res.injector.get(core_1.ApplicationRef);
            appRef.bootstrap(SecondRootCmp);
            expect(router.resetRootComponentType).not.toHaveBeenCalled();
            done();
        });
    });
    it('should reinit router navigation listeners if a previously bootstrapped root component is destroyed', function (done) {
        var TestModule = /** @class */ (function () {
            function TestModule() {
            }
            TestModule = __decorate([
                core_1.NgModule({
                    imports: [platform_browser_1.BrowserModule, router_1.RouterModule.forRoot([], { useHash: true })],
                    declarations: [SecondRootCmp, RootCmp],
                    entryComponents: [SecondRootCmp],
                    bootstrap: [RootCmp],
                    providers: testProviders,
                    schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA]
                })
            ], TestModule);
            return TestModule;
        }());
        platform_browser_dynamic_1.platformBrowserDynamic([]).bootstrapModule(TestModule).then(function (res) {
            var router = res.injector.get(router_1.Router);
            spyOn(router, 'resetRootComponentType').and.callThrough();
            var appRef = res.injector.get(core_1.ApplicationRef);
            appRef.components[0].onDestroy(function () {
                appRef.bootstrap(SecondRootCmp);
                expect(router.resetRootComponentType).toHaveBeenCalled();
                done();
            });
            appRef.components[0].destroy();
        });
    });
    it('should restore the scrolling position', function (done) { return __awaiter(_this, void 0, void 0, function () {
        var TallComponent, TestModule, res, router, location;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    TallComponent = /** @class */ (function () {
                        function TallComponent() {
                        }
                        TallComponent = __decorate([
                            core_1.Component({
                                selector: 'component-a',
                                template: "\n           <div style=\"height: 3000px;\"></div>\n           <div id=\"marker1\"></div>\n           <div style=\"height: 3000px;\"></div>\n           <div id=\"marker2\"></div>\n           <div style=\"height: 3000px;\"></div>\n           <a name=\"marker3\"></a>\n           <div style=\"height: 3000px;\"></div>\n      "
                            })
                        ], TallComponent);
                        return TallComponent;
                    }());
                    TestModule = /** @class */ (function () {
                        function TestModule() {
                        }
                        TestModule = __decorate([
                            core_1.NgModule({
                                imports: [
                                    platform_browser_1.BrowserModule,
                                    router_1.RouterModule.forRoot([
                                        { path: '', pathMatch: 'full', redirectTo: '/aa' },
                                        { path: 'aa', component: TallComponent }, { path: 'bb', component: TallComponent },
                                        { path: 'cc', component: TallComponent },
                                        { path: 'fail', component: TallComponent, canActivate: ['returnFalse'] }
                                    ], {
                                        useHash: true,
                                        scrollPositionRestoration: 'enabled',
                                        anchorScrolling: 'enabled',
                                        scrollOffset: [0, 100],
                                        onSameUrlNavigation: 'reload'
                                    })
                                ],
                                declarations: [TallComponent, RootCmp],
                                bootstrap: [RootCmp],
                                providers: testProviders.concat([{ provide: 'returnFalse', useValue: function () { return false; } }]),
                                schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA]
                            })
                        ], TestModule);
                        return TestModule;
                    }());
                    return [4 /*yield*/, platform_browser_dynamic_1.platformBrowserDynamic([]).bootstrapModule(TestModule)];
                case 1:
                    res = _a.sent();
                    router = res.injector.get(router_1.Router);
                    location = res.injector.get(common_1.Location);
                    return [4 /*yield*/, router.navigateByUrl('/aa')];
                case 2:
                    _a.sent();
                    window.scrollTo(0, 5000);
                    return [4 /*yield*/, router.navigateByUrl('/fail')];
                case 3:
                    _a.sent();
                    expect(window.scrollY).toEqual(5000);
                    return [4 /*yield*/, router.navigateByUrl('/bb')];
                case 4:
                    _a.sent();
                    window.scrollTo(0, 3000);
                    expect(window.scrollY).toEqual(3000);
                    return [4 /*yield*/, router.navigateByUrl('/cc')];
                case 5:
                    _a.sent();
                    expect(window.scrollY).toEqual(0);
                    return [4 /*yield*/, router.navigateByUrl('/aa#marker2')];
                case 6:
                    _a.sent();
                    expect(window.scrollY >= 5900).toBe(true);
                    expect(window.scrollY < 6000).toBe(true); // offset
                    return [4 /*yield*/, router.navigateByUrl('/aa#marker3')];
                case 7:
                    _a.sent();
                    expect(window.scrollY >= 8900).toBe(true);
                    expect(window.scrollY < 9000).toBe(true);
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    function waitForNavigationToComplete(router) {
        return router.events.pipe(operators_1.filter(function (e) { return e instanceof router_1.NavigationEnd; }), operators_1.first()).toPromise();
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vdHN0cmFwLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9yb3V0ZXIvdGVzdC9ib290c3RyYXAuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxpQkE2VEE7O0FBN1RBLDBDQUEwRTtBQUMxRSxzQ0FBMkc7QUFDM0csaURBQTZDO0FBQzdDLDhEQUFxRjtBQUNyRiw4RUFBeUU7QUFDekUsMENBQThGO0FBQzlGLDRDQUE2QztBQUU3QyxRQUFRLENBQUMsV0FBVyxFQUFFO0lBQ3BCLElBQUksTUFBTTtRQUFFLE9BQU87SUFDbkIsSUFBSSxHQUFHLEdBQVUsRUFBRSxDQUFDO0lBQ3BCLElBQUksYUFBYSxHQUFVLElBQU0sQ0FBQztJQUdsQztRQUNFO1lBQWdCLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFBQyxDQUFDO1FBRGxDLE9BQU87WUFEWixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsc0NBQXNDLEVBQUMsQ0FBQzs7V0FDOUUsT0FBTyxDQUVaO1FBQUQsY0FBQztLQUFBLEFBRkQsSUFFQztJQUdEO1FBQUE7UUFDQSxDQUFDO1FBREssYUFBYTtZQURsQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsc0NBQXNDLEVBQUMsQ0FBQztXQUMvRSxhQUFhLENBQ2xCO1FBQUQsb0JBQUM7S0FBQSxBQURELElBQ0M7SUFFRDtRQUFBO1FBT0EsQ0FBQztRQU5DLDhCQUFPLEdBQVA7WUFDRSxJQUFJLE9BQU8sR0FBUSxJQUFJLENBQUM7WUFDeEIsSUFBTSxHQUFHLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxPQUFPLEdBQUcsQ0FBQyxFQUFYLENBQVcsQ0FB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