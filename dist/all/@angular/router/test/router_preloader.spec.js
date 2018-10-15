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
var index_1 = require("../index");
var router_preloader_1 = require("../src/router_preloader");
var testing_2 = require("../testing");
describe('RouterPreloader', function () {
    var LazyLoadedCmp = /** @class */ (function () {
        function LazyLoadedCmp() {
        }
        LazyLoadedCmp = __decorate([
            core_1.Component({ template: '' })
        ], LazyLoadedCmp);
        return LazyLoadedCmp;
    }());
    describe('should not load configurations with canLoad guard', function () {
        var LoadedModule = /** @class */ (function () {
            function LoadedModule() {
            }
            LoadedModule = __decorate([
                core_1.NgModule({
                    declarations: [LazyLoadedCmp],
                    imports: [index_1.RouterModule.forChild([{ path: 'LoadedModule1', component: LazyLoadedCmp }])]
                })
            ], LoadedModule);
            return LoadedModule;
        }());
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                imports: [testing_2.RouterTestingModule.withRoutes([{ path: 'lazy', loadChildren: 'expected', canLoad: ['someGuard'] }])],
                providers: [{ provide: router_preloader_1.PreloadingStrategy, useExisting: router_preloader_1.PreloadAllModules }]
            });
        });
        it('should work', testing_1.fakeAsync(testing_1.inject([core_1.NgModuleFactoryLoader, router_preloader_1.RouterPreloader, index_1.Router], function (loader, preloader, router) {
            loader.stubbedModules = { expected: LoadedModule };
            preloader.preload().subscribe(function () { });
            testing_1.tick();
            var c = router.config;
            expect(c[0]._loadedConfig).not.toBeDefined();
        })));
    });
    describe('should preload configurations', function () {
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                imports: [testing_2.RouterTestingModule.withRoutes([{ path: 'lazy', loadChildren: 'expected' }])],
                providers: [{ provide: router_preloader_1.PreloadingStrategy, useExisting: router_preloader_1.PreloadAllModules }]
            });
        });
        it('should work', testing_1.fakeAsync(testing_1.inject([core_1.NgModuleFactoryLoader, router_preloader_1.RouterPreloader, index_1.Router, core_1.NgModuleRef], function (loader, preloader, router, testModule) {
            var events = [];
            var LoadedModule2 = /** @class */ (function () {
                function LoadedModule2() {
                }
                LoadedModule2 = __decorate([
                    core_1.NgModule({
                        declarations: [LazyLoadedCmp],
                        imports: [index_1.RouterModule.forChild([{ path: 'LoadedModule2', component: LazyLoadedCmp }])]
                    })
                ], LoadedModule2);
                return LoadedModule2;
            }());
            var LoadedModule1 = /** @class */ (function () {
                function LoadedModule1() {
                }
                LoadedModule1 = __decorate([
                    core_1.NgModule({
                        imports: [index_1.RouterModule.forChild([{ path: 'LoadedModule1', loadChildren: 'expected2' }])]
                    })
                ], LoadedModule1);
                return LoadedModule1;
            }());
            router.events.subscribe(function (e) {
                if (e instanceof index_1.RouteConfigLoadEnd || e instanceof index_1.RouteConfigLoadStart) {
                    events.push(e);
                }
            });
            loader.stubbedModules = {
                expected: LoadedModule1,
                expected2: LoadedModule2,
            };
            preloader.preload().subscribe(function () { });
            testing_1.tick();
            var c = router.config;
            expect(c[0].loadChildren).toEqual('expected');
            var loadedConfig = c[0]._loadedConfig;
            var module = loadedConfig.module;
            expect(loadedConfig.routes[0].path).toEqual('LoadedModule1');
            expect(module._parent).toBe(testModule);
            var loadedConfig2 = loadedConfig.routes[0]._loadedConfig;
            var module2 = loadedConfig2.module;
            expect(loadedConfig2.routes[0].path).toEqual('LoadedModule2');
            expect(module2._parent).toBe(module);
            expect(events.map(function (e) { return e.toString(); })).toEqual([
                'RouteConfigLoadStart(path: lazy)',
                'RouteConfigLoadEnd(path: lazy)',
                'RouteConfigLoadStart(path: LoadedModule1)',
                'RouteConfigLoadEnd(path: LoadedModule1)',
            ]);
        })));
    });
    describe('should support modules that have already been loaded', function () {
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                imports: [testing_2.RouterTestingModule.withRoutes([{ path: 'lazy', loadChildren: 'expected' }])],
                providers: [{ provide: router_preloader_1.PreloadingStrategy, useExisting: router_preloader_1.PreloadAllModules }]
            });
        });
        it('should work', testing_1.fakeAsync(testing_1.inject([core_1.NgModuleFactoryLoader, router_preloader_1.RouterPreloader, index_1.Router, core_1.NgModuleRef, core_1.Compiler], function (loader, preloader, router, testModule, compiler) {
            var LoadedModule2 = /** @class */ (function () {
                function LoadedModule2() {
                }
                LoadedModule2 = __decorate([
                    core_1.NgModule()
                ], LoadedModule2);
                return LoadedModule2;
            }());
            var module2 = compiler.compileModuleSync(LoadedModule2).create(null);
            var LoadedModule1 = /** @class */ (function () {
                function LoadedModule1() {
                }
                LoadedModule1 = __decorate([
                    core_1.NgModule({
                        imports: [index_1.RouterModule.forChild([
                                {
                                    path: 'LoadedModule2',
                                    loadChildren: 'no',
                                    _loadedConfig: {
                                        routes: [{ path: 'LoadedModule3', loadChildren: 'expected3' }],
                                        module: module2,
                                    }
                                },
                            ])]
                    })
                ], LoadedModule1);
                return LoadedModule1;
            }());
            var LoadedModule3 = /** @class */ (function () {
                function LoadedModule3() {
                }
                LoadedModule3 = __decorate([
                    core_1.NgModule({ imports: [index_1.RouterModule.forChild([])] })
                ], LoadedModule3);
                return LoadedModule3;
            }());
            loader.stubbedModules = {
                expected: LoadedModule1,
                expected3: LoadedModule3,
            };
            preloader.preload().subscribe(function () { });
            testing_1.tick();
            var c = router.config;
            var loadedConfig = c[0]._loadedConfig;
            var module = loadedConfig.module;
            expect(module._parent).toBe(testModule);
            var loadedConfig2 = loadedConfig.routes[0]._loadedConfig;
            var loadedConfig3 = loadedConfig2.routes[0]._loadedConfig;
            var module3 = loadedConfig3.module;
            expect(module3._parent).toBe(module2);
        })));
    });
    describe('should ignore errors', function () {
        var LoadedModule = /** @class */ (function () {
            function LoadedModule() {
            }
            LoadedModule = __decorate([
                core_1.NgModule({
                    declarations: [LazyLoadedCmp],
                    imports: [index_1.RouterModule.forChild([{ path: 'LoadedModule1', component: LazyLoadedCmp }])]
                })
            ], LoadedModule);
            return LoadedModule;
        }());
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                imports: [testing_2.RouterTestingModule.withRoutes([
                        { path: 'lazy1', loadChildren: 'expected1' }, { path: 'lazy2', loadChildren: 'expected2' }
                    ])],
                providers: [{ provide: router_preloader_1.PreloadingStrategy, useExisting: router_preloader_1.PreloadAllModules }]
            });
        });
        it('should work', testing_1.fakeAsync(testing_1.inject([core_1.NgModuleFactoryLoader, router_preloader_1.RouterPreloader, index_1.Router], function (loader, preloader, router) {
            loader.stubbedModules = { expected2: LoadedModule };
            preloader.preload().subscribe(function () { });
            testing_1.tick();
            var c = router.config;
            expect(c[0]._loadedConfig).not.toBeDefined();
            expect(c[1]._loadedConfig).toBeDefined();
        })));
    });
    describe('should copy loaded configs', function () {
        var configs = [{ path: 'LoadedModule1', component: LazyLoadedCmp }];
        var LoadedModule = /** @class */ (function () {
            function LoadedModule() {
            }
            LoadedModule = __decorate([
                core_1.NgModule({ declarations: [LazyLoadedCmp], imports: [index_1.RouterModule.forChild(configs)] })
            ], LoadedModule);
            return LoadedModule;
        }());
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                imports: [testing_2.RouterTestingModule.withRoutes([{ path: 'lazy1', loadChildren: 'expected' }])],
                providers: [{ provide: router_preloader_1.PreloadingStrategy, useExisting: router_preloader_1.PreloadAllModules }]
            });
        });
        it('should work', testing_1.fakeAsync(testing_1.inject([core_1.NgModuleFactoryLoader, router_preloader_1.RouterPreloader, index_1.Router], function (loader, preloader, router) {
            loader.stubbedModules = { expected: LoadedModule };
            preloader.preload().subscribe(function () { });
            testing_1.tick();
            var c = router.config;
            expect(c[0]._loadedConfig).toBeDefined();
            expect(c[0]._loadedConfig.routes).not.toBe(configs);
            expect(c[0]._loadedConfig.routes[0]).not.toBe(configs[0]);
            expect(c[0]._loadedConfig.routes[0].component).toBe(configs[0].component);
        })));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3ByZWxvYWRlci5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcm91dGVyL3Rlc3Qvcm91dGVyX3ByZWxvYWRlci5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsc0NBQWdHO0FBQ2hHLGlEQUF1RTtBQUV2RSxrQ0FBK0Y7QUFFL0YsNERBQStGO0FBQy9GLHNDQUF5RTtBQUV6RSxRQUFRLENBQUMsaUJBQWlCLEVBQUU7SUFFMUI7UUFBQTtRQUNBLENBQUM7UUFESyxhQUFhO1lBRGxCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsRUFBRSxFQUFDLENBQUM7V0FDcEIsYUFBYSxDQUNsQjtRQUFELG9CQUFDO0tBQUEsQUFERCxJQUNDO0lBRUQsUUFBUSxDQUFDLG1EQUFtRCxFQUFFO1FBSzVEO1lBQUE7WUFDQSxDQUFDO1lBREssWUFBWTtnQkFKakIsZUFBUSxDQUFDO29CQUNSLFlBQVksRUFBRSxDQUFDLGFBQWEsQ0FBQztvQkFDN0IsT0FBTyxFQUFFLENBQUMsb0JBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFDLElBQUksRUFBRSxlQUFlLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBQyxDQUFDLENBQUMsQ0FBQztpQkFDdEYsQ0FBQztlQUNJLFlBQVksQ0FDakI7WUFBRCxtQkFBQztTQUFBLEFBREQsSUFDQztRQUVELFVBQVUsQ0FBQztZQUNULGlCQUFPLENBQUMsc0JBQXNCLENBQUM7Z0JBQzdCLE9BQU8sRUFBRSxDQUFDLDZCQUFtQixDQUFDLFVBQVUsQ0FDcEMsQ0FBQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEUsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUscUNBQWtCLEVBQUUsV0FB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