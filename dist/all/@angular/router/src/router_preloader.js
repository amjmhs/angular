"use strict";
/**
*@license
*Copyright Google Inc. All Rights Reserved.
*
*Use of this source code is governed by an MIT-style license that can be
*found in the LICENSE file at https://angular.io/license
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
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var events_1 = require("./events");
var router_1 = require("./router");
var router_config_loader_1 = require("./router_config_loader");
/**
 * @description
 *
 * Provides a preloading strategy.
 *
 * @experimental
 */
var PreloadingStrategy = /** @class */ (function () {
    function PreloadingStrategy() {
    }
    return PreloadingStrategy;
}());
exports.PreloadingStrategy = PreloadingStrategy;
/**
 * @description
 *
 * Provides a preloading strategy that preloads all modules as quickly as possible.
 *
 * ```
 * RouteModule.forRoot(ROUTES, {preloadingStrategy: PreloadAllModules})
 * ```
 *
 * @experimental
 */
var PreloadAllModules = /** @class */ (function () {
    function PreloadAllModules() {
    }
    PreloadAllModules.prototype.preload = function (route, fn) {
        return fn().pipe(operators_1.catchError(function () { return rxjs_1.of(null); }));
    };
    return PreloadAllModules;
}());
exports.PreloadAllModules = PreloadAllModules;
/**
 * @description
 *
 * Provides a preloading strategy that does not preload any modules.
 *
 * This strategy is enabled by default.
 *
 * @experimental
 */
var NoPreloading = /** @class */ (function () {
    function NoPreloading() {
    }
    NoPreloading.prototype.preload = function (route, fn) { return rxjs_1.of(null); };
    return NoPreloading;
}());
exports.NoPreloading = NoPreloading;
/**
 * The preloader optimistically loads all router configurations to
 * make navigations into lazily-loaded sections of the application faster.
 *
 * The preloader runs in the background. When the router bootstraps, the preloader
 * starts listening to all navigation events. After every such event, the preloader
 * will check if any configurations can be loaded lazily.
 *
 * If a route is protected by `canLoad` guards, the preloaded will not load it.
 *
 *
 */
var RouterPreloader = /** @class */ (function () {
    function RouterPreloader(router, moduleLoader, compiler, injector, preloadingStrategy) {
        this.router = router;
        this.injector = injector;
        this.preloadingStrategy = preloadingStrategy;
        var onStartLoad = function (r) { return router.triggerEvent(new events_1.RouteConfigLoadStart(r)); };
        var onEndLoad = function (r) { return router.triggerEvent(new events_1.RouteConfigLoadEnd(r)); };
        this.loader = new router_config_loader_1.RouterConfigLoader(moduleLoader, compiler, onStartLoad, onEndLoad);
    }
    RouterPreloader.prototype.setUpPreloading = function () {
        var _this = this;
        this.subscription =
            this.router.events
                .pipe(operators_1.filter(function (e) { return e instanceof events_1.NavigationEnd; }), operators_1.concatMap(function () { return _this.preload(); }))
                .subscribe(function () { });
    };
    RouterPreloader.prototype.preload = function () {
        var ngModule = this.injector.get(core_1.NgModuleRef);
        return this.processRoutes(ngModule, this.router.config);
    };
    // TODO(jasonaden): This class relies on code external to the class to call setUpPreloading. If
    // this hasn't been done, ngOnDestroy will fail as this.subscription will be undefined. This
    // should be refactored.
    RouterPreloader.prototype.ngOnDestroy = function () { this.subscription.unsubscribe(); };
    RouterPreloader.prototype.processRoutes = function (ngModule, routes) {
        var res = [];
        for (var _i = 0, routes_1 = routes; _i < routes_1.length; _i++) {
            var route = routes_1[_i];
            // we already have the config loaded, just recurse
            if (route.loadChildren && !route.canLoad && route._loadedConfig) {
                var childConfig = route._loadedConfig;
                res.push(this.processRoutes(childConfig.module, childConfig.routes));
                // no config loaded, fetch the config
            }
            else if (route.loadChildren && !route.canLoad) {
                res.push(this.preloadConfig(ngModule, route));
                // recurse into children
            }
            else if (route.children) {
                res.push(this.processRoutes(ngModule, route.children));
            }
        }
        return rxjs_1.from(res).pipe(operators_1.mergeAll(), operators_1.map(function (_) { return void 0; }));
    };
    RouterPreloader.prototype.preloadConfig = function (ngModule, route) {
        var _this = this;
        return this.preloadingStrategy.preload(route, function () {
            var loaded$ = _this.loader.load(ngModule.injector, route);
            return loaded$.pipe(operators_1.mergeMap(function (config) {
                route._loadedConfig = config;
                return _this.processRoutes(config.module, config.routes);
            }));
        });
    };
    RouterPreloader = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [router_1.Router, core_1.NgModuleFactoryLoader, core_1.Compiler,
            core_1.Injector, PreloadingStrategy])
    ], RouterPreloader);
    return RouterPreloader;
}());
exports.RouterPreloader = RouterPreloader;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3ByZWxvYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3JvdXRlci9zcmMvcm91dGVyX3ByZWxvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztFQU1FOzs7Ozs7Ozs7OztBQUVGLHNDQUE0RztBQUM1Ryw2QkFBeUQ7QUFDekQsNENBQXNGO0FBR3RGLG1DQUF3RjtBQUN4RixtQ0FBZ0M7QUFDaEMsK0RBQTBEO0FBRzFEOzs7Ozs7R0FNRztBQUNIO0lBQUE7SUFFQSxDQUFDO0lBQUQseUJBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUZxQixnREFBa0I7QUFJeEM7Ozs7Ozs7Ozs7R0FVRztBQUNIO0lBQUE7SUFJQSxDQUFDO0lBSEMsbUNBQU8sR0FBUCxVQUFRLEtBQVksRUFBRSxFQUF5QjtRQUM3QyxPQUFPLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxzQkFBVSxDQUFDLGNBQU0sT0FBQSxTQUFFLENBQUUsSUFBSSxDQUFDLEVBQVQsQ0FBUyxDQUFDLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBQ0gsd0JBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQztBQUpZLDhDQUFpQjtBQU05Qjs7Ozs7Ozs7R0FRRztBQUNIO0lBQUE7SUFFQSxDQUFDO0lBREMsOEJBQU8sR0FBUCxVQUFRLEtBQVksRUFBRSxFQUF5QixJQUFxQixPQUFPLFNBQUUsQ0FBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekYsbUJBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUZZLG9DQUFZO0FBSXpCOzs7Ozs7Ozs7OztHQVdHO0FBRUg7SUFLRSx5QkFDWSxNQUFjLEVBQUUsWUFBbUMsRUFBRSxRQUFrQixFQUN2RSxRQUFrQixFQUFVLGtCQUFzQztRQURsRSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUFVLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7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