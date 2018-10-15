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
var common_1 = require("@angular/common");
var testing_1 = require("@angular/common/testing");
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
/**
 * @description
 *
 * Allows to simulate the loading of ng modules in tests.
 *
 * ```
 * const loader = TestBed.get(NgModuleFactoryLoader);
 *
 * @Component({template: 'lazy-loaded'})
 * class LazyLoadedComponent {}
 * @NgModule({
 *   declarations: [LazyLoadedComponent],
 *   imports: [RouterModule.forChild([{path: 'loaded', component: LazyLoadedComponent}])]
 * })
 *
 * class LoadedModule {}
 *
 * // sets up stubbedModules
 * loader.stubbedModules = {lazyModule: LoadedModule};
 *
 * router.resetConfig([
 *   {path: 'lazy', loadChildren: 'lazyModule'},
 * ]);
 *
 * router.navigateByUrl('/lazy/loaded');
 * ```
 *
 *
 */
var SpyNgModuleFactoryLoader = /** @class */ (function () {
    function SpyNgModuleFactoryLoader(compiler) {
        this.compiler = compiler;
        /**
         * @docsNotRequired
         */
        this._stubbedModules = {};
    }
    Object.defineProperty(SpyNgModuleFactoryLoader.prototype, "stubbedModules", {
        /**
         * @docsNotRequired
         */
        get: function () { return this._stubbedModules; },
        /**
         * @docsNotRequired
         */
        set: function (modules) {
            var res = {};
            for (var _i = 0, _a = Object.keys(modules); _i < _a.length; _i++) {
                var t = _a[_i];
                res[t] = this.compiler.compileModuleAsync(modules[t]);
            }
            this._stubbedModules = res;
        },
        enumerable: true,
        configurable: true
    });
    SpyNgModuleFactoryLoader.prototype.load = function (path) {
        if (this._stubbedModules[path]) {
            return this._stubbedModules[path];
        }
        else {
            return Promise.reject(new Error("Cannot find module " + path));
        }
    };
    SpyNgModuleFactoryLoader = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [core_1.Compiler])
    ], SpyNgModuleFactoryLoader);
    return SpyNgModuleFactoryLoader;
}());
exports.SpyNgModuleFactoryLoader = SpyNgModuleFactoryLoader;
function isUrlHandlingStrategy(opts) {
    // This property check is needed because UrlHandlingStrategy is an interface and doesn't exist at
    // runtime.
    return 'shouldProcessUrl' in opts;
}
/**
 * Router setup factory function used for testing.
 *
 *
 */
function setupTestingRouter(urlSerializer, contexts, location, loader, compiler, injector, routes, opts, urlHandlingStrategy) {
    var router = new router_1.Router(null, urlSerializer, contexts, location, injector, loader, compiler, router_1.ɵflatten(routes));
    if (opts) {
        // Handle deprecated argument ordering.
        if (isUrlHandlingStrategy(opts)) {
            router.urlHandlingStrategy = opts;
        }
        else {
            // Handle ExtraOptions
            if (opts.malformedUriErrorHandler) {
                router.malformedUriErrorHandler = opts.malformedUriErrorHandler;
            }
            if (opts.paramsInheritanceStrategy) {
                router.paramsInheritanceStrategy = opts.paramsInheritanceStrategy;
            }
        }
    }
    if (urlHandlingStrategy) {
        router.urlHandlingStrategy = urlHandlingStrategy;
    }
    return router;
}
exports.setupTestingRouter = setupTestingRouter;
/**
 * @description
 *
 * Sets up the router to be used for testing.
 *
 * The modules sets up the router to be used for testing.
 * It provides spy implementations of `Location`, `LocationStrategy`, and {@link
 * NgModuleFactoryLoader}.
 *
 * @usageNotes
 * ### Example
 *
 * ```
 * beforeEach(() => {
 *   TestBed.configureTestModule({
 *     imports: [
 *       RouterTestingModule.withRoutes(
 *         [{path: '', component: BlankCmp}, {path: 'simple', component: SimpleCmp}]
 *       )
 *     ]
 *   });
 * });
 * ```
 *
 *
 */
var RouterTestingModule = /** @class */ (function () {
    function RouterTestingModule() {
    }
    RouterTestingModule_1 = RouterTestingModule;
    RouterTestingModule.withRoutes = function (routes, config) {
        return {
            ngModule: RouterTestingModule_1,
            providers: [
                router_1.provideRoutes(routes),
                { provide: router_1.ROUTER_CONFIGURATION, useValue: config ? config : {} },
            ]
        };
    };
    var RouterTestingModule_1;
    RouterTestingModule = RouterTestingModule_1 = __decorate([
        core_1.NgModule({
            exports: [router_1.RouterModule],
            providers: [
                router_1.ɵROUTER_PROVIDERS, { provide: common_1.Location, useClass: testing_1.SpyLocation },
                { provide: common_1.LocationStrategy, useClass: testing_1.MockLocationStrategy },
                { provide: core_1.NgModuleFactoryLoader, useClass: SpyNgModuleFactoryLoader }, {
                    provide: router_1.Router,
                    useFactory: setupTestingRouter,
                    deps: [
                        router_1.UrlSerializer, router_1.ChildrenOutletContexts, common_1.Location, core_1.NgModuleFactoryLoader, core_1.Compiler, core_1.Injector,
                        router_1.ROUTES, router_1.ROUTER_CONFIGURATION, [router_1.UrlHandlingStrategy, new core_1.Optional()]
                    ]
                },
                { provide: router_1.PreloadingStrategy, useExisting: router_1.NoPreloading }, router_1.provideRoutes([])
            ]
        })
    ], RouterTestingModule);
    return RouterTestingModule;
}());
exports.RouterTestingModule = RouterTestingModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3Rlc3RpbmdfbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcm91dGVyL3Rlc3Rpbmcvc3JjL3JvdXRlcl90ZXN0aW5nX21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUVILDBDQUEyRDtBQUMzRCxtREFBMEU7QUFDMUUsc0NBQThJO0FBQzlJLDBDQUF5UjtBQUl6Ujs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTRCRztBQUVIO0lBc0JFLGtDQUFvQixRQUFrQjtRQUFsQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBckJ0Qzs7V0FFRztRQUNLLG9CQUFlLEdBQW9ELEVBQUUsQ0FBQztJQWtCckMsQ0FBQztJQWIxQyxzQkFBSSxvREFBYztRQVFsQjs7V0FFRzthQUNILGNBQThDLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7UUFkNUU7O1dBRUc7YUFDSCxVQUFtQixPQUE4QjtZQUMvQyxJQUFNLEdBQUcsR0FBMEIsRUFBRSxDQUFDO1lBQ3RDLEtBQWdCLFVBQW9CLEVBQXBCLEtBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBcEIsY0FBb0IsRUFBcEIsSUFBb0IsRUFBRTtnQkFBakMsSUFBTSxDQUFDLFNBQUE7Z0JBQ1YsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDdkQ7WUFDRCxJQUFJLENBQUMsZUFBZSxHQUFHLEdBQUcsQ0FBQztRQUM3QixDQUFDOzs7T0FBQTtJQVNELHVDQUFJLEdBQUosVUFBSyxJQUFZO1FBQ2YsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzlCLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNuQzthQUFNO1lBQ0wsT0FBWSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLHdCQUFzQixJQUFNLENBQUMsQ0FBQyxDQUFDO1NBQ3JFO0lBQ0gsQ0FBQztJQTlCVSx3QkFBd0I7UUFEcEMsaUJBQVUsRUFBRTt5Q0F1Qm1CLGVBQVE7T0F0QjNCLHdCQUF3QixDQStCcEM7SUFBRCwrQkFBQztDQUFBLEFBL0JELElBK0JDO0FBL0JZLDREQUF3QjtBQWlDckMsK0JBQStCLElBQXdDO0lBRXJFLGlHQUFpRztJQUNqRyxXQUFXO0lBQ1gsT0FBTyxrQkFBa0IsSUFBSSxJQUFJLENBQUM7QUFDcEMsQ0FBQztBQXVCRDs7OztHQUlHO0FBQ0gsNEJBQ0ksYUFBNEIsRUFBRSxRQUFnQyxFQUFFLFFBQWtCLEVBQ2xGLE1BQTZCLEVBQUUsUUFBa0IsRUFBRSxRQUFrQixFQUFFLE1BQWlCLEVBQ3hGLElBQXlDLEVBQUUsbUJBQXlDO0lBQ3RGLElBQU0sTUFBTSxHQUFHLElBQUksZUFBTSxDQUNyQixJQUFNLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsaUJBQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQzVGLElBQUksSUFBSSxFQUFFO1FBQ1IsdUNBQXVDO1FBQ3ZDLElBQUkscUJBQXFCLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDL0IsTUFBTSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQztTQUNuQzthQUFNO1lBQ0wsc0JBQXNCO1lBRXRCLElBQUksSUFBSSxDQUFDLHdCQUF3QixFQUFFO2dCQUNqQyxNQUFNLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDO2FBQ2pFO1lBRUQsSUFBSSxJQUFJLENBQUMseUJBQXlCLEVBQUU7Z0JBQ2xDLE1BQU0sQ0FBQyx5QkFBeUIsR0FBRyxJQUFJLENBQUMseUJBQXlCLENBQUM7YUFDbkU7U0FDRjtLQUNGO0lBRUQsSUFBSSxtQkFBbUIsRUFBRTtRQUN2QixNQUFNLENBQUMsbUJBQW1CLEdBQUcsbUJBQW1CLENBQUM7S0FDbEQ7SUFDRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBM0JELGdEQTJCQztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBeUJHO0FBaUJIO0lBQUE7SUFXQSxDQUFDOzRCQVhZLG1CQUFtQjtJQUN2Qiw4QkFBVSxHQUFqQixVQUFrQixNQUFjLEVBQUUsTUFBcUI7UUFFckQsT0FBTztZQUNMLFFBQVEsRUFBRSxxQkFBbUI7WUFDN0IsU0FBUyxFQUFFO2dCQUNULHNCQUFhLENBQUMsTUFBTSxDQUFDO2dCQUNyQixFQUFDLE9BQU8sRUFBRSw2QkFBb0IsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBQzthQUNoRTtTQUNGLENBQUM7SUFDSixDQUFDOztJQVZVLG1CQUFtQjtRQWhCL0IsZUFBUSxDQUFDO1lBQ1IsT0FBTyxFQUFFLENBQUMscUJBQVksQ0FBQztZQUN2QixTQUFTLEVBQUU7Z0JBQ1QsMEJBQWdCLEVBQUUsRUFBQyxPQUFPLEVBQUUsaUJBQVEsRUFBRSxRQUFRLEVBQUUscUJBQVcsRUFBQztnQkFDNUQsRUFBQyxPQUFPLEVBQUUseUJBQWdCLEVBQUUsUUFBUSxFQUFFLDhCQUFvQixFQUFDO2dCQUMzRCxFQUFDLE9BQU8sRUFBRSw0QkFBcUIsRUFBRSxRQUFRLEVBQUUsd0JBQXdCLEVBQUMsRUFBRTtvQkFDcEUsT0FBTyxFQUFFLGVBQU07b0JBQ2YsVUFBVSxFQUFFLGtCQUFrQjtvQkFDOUIsSUFBSSxFQUFFO3dCQUNKLHNCQUFhLEVBQUUsK0JBQXNCLEVBQUUsaUJBQVEsRUFBRSw0QkFBcUIsRUFBRSxlQUFRLEVBQUUsZUFBUTt3QkFDMUYsZUFBTSxFQUFFLDZCQUFvQixFQUFFLENBQUMsNEJBQW1CLEVBQUUsSUFBSSxlQUFRLEVBQUUsQ0FBQztxQkFDcEU7aUJBQ0Y7Z0JBQ0QsRUFBQyxPQUFPLEVBQUUsMkJBQWtCLEVBQUUsV0FBVyxFQUFFLHFCQUFZLEVBQUMsRUFBRSxzQkFBYSxDQUFDLEVBQUUsQ0FBQzthQUM1RTtTQUNGLENBQUM7T0FDVyxtQkFBbUIsQ0FXL0I7SUFBRCwwQkFBQztDQUFBLEFBWEQsSUFXQztBQVhZLGtEQUFtQiJ9