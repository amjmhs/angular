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
var angular = require("../common/angular1");
var constants_1 = require("../common/constants");
var util_1 = require("../common/util");
var angular1_providers_1 = require("./angular1_providers");
var util_2 = require("./util");
/**
 * @description
 *
 * An `NgModule`, which you import to provide AngularJS core services,
 * and has an instance method used to bootstrap the hybrid upgrade application.
 *
 * *Part of the [upgrade/static](api?query=upgrade/static)
 * library for hybrid upgrade apps that support AoT compilation*
 *
 * The `upgrade/static` package contains helpers that allow AngularJS and Angular components
 * to be used together inside a hybrid upgrade application, which supports AoT compilation.
 *
 * Specifically, the classes and functions in the `upgrade/static` module allow the following:
 *
 * 1. Creation of an Angular directive that wraps and exposes an AngularJS component so
 *    that it can be used in an Angular template. See `UpgradeComponent`.
 * 2. Creation of an AngularJS directive that wraps and exposes an Angular component so
 *    that it can be used in an AngularJS template. See `downgradeComponent`.
 * 3. Creation of an Angular root injector provider that wraps and exposes an AngularJS
 *    service so that it can be injected into an Angular context. See
 *    {@link UpgradeModule#upgrading-an-angular-1-service Upgrading an AngularJS service} below.
 * 4. Creation of an AngularJS service that wraps and exposes an Angular injectable
 *    so that it can be injected into an AngularJS context. See `downgradeInjectable`.
 * 3. Bootstrapping of a hybrid Angular application which contains both of the frameworks
 *    coexisting in a single application.
 *
 * @usageNotes
 *
 * ```ts
 * import {UpgradeModule} from '@angular/upgrade/static';
 * ```
 *
 * See also the {@link UpgradeModule#examples examples} below.
 *
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
 * 3. AngularJS directives always execute inside the AngularJS framework codebase regardless of
 *    where they are instantiated.
 * 4. Angular components always execute inside the Angular framework codebase regardless of
 *    where they are instantiated.
 * 5. An AngularJS component can be "upgraded"" to an Angular component. This is achieved by
 *    defining an Angular directive, which bootstraps the AngularJS component at its location
 *    in the DOM. See `UpgradeComponent`.
 * 6. An Angular component can be "downgraded" to an AngularJS component. This is achieved by
 *    defining an AngularJS directive, which bootstraps the Angular component at its location
 *    in the DOM. See `downgradeComponent`.
 * 7. Whenever an "upgraded"/"downgraded" component is instantiated the host element is owned by
 *    the framework doing the instantiation. The other framework then instantiates and owns the
 *    view for that component.
 *    1. This implies that the component bindings will always follow the semantics of the
 *       instantiation framework.
 *    2. The DOM attributes are parsed by the framework that owns the current template. So
 *       attributes in AngularJS templates must use kebab-case, while AngularJS templates must use
 *       camelCase.
 *    3. However the template binding syntax will always use the Angular style, e.g. square
 *       brackets (`[...]`) for property binding.
 * 8. Angular is bootstrapped first; AngularJS is bootstrapped second. AngularJS always owns the
 *    root component of the application.
 * 9. The new application is running in an Angular zone, and therefore it no longer needs calls to
 *    `$apply()`.
 *
 * ### The `UpgradeModule` class
 *
 * This class is an `NgModule`, which you import to provide AngularJS core services,
 * and has an instance method used to bootstrap the hybrid upgrade application.
 *
 * * Core AngularJS services
 *   Importing this `NgModule` will add providers for the core
 *   [AngularJS services](https://docs.angularjs.org/api/ng/service) to the root injector.
 *
 * * Bootstrap
 *   The runtime instance of this class contains a {@link UpgradeModule#bootstrap `bootstrap()`}
 *   method, which you use to bootstrap the top level AngularJS module onto an element in the
 *   DOM for the hybrid upgrade app.
 *
 *   It also contains properties to access the {@link UpgradeModule#injector root injector}, the
 *   bootstrap `NgZone` and the
 *   [AngularJS $injector](https://docs.angularjs.org/api/auto/service/$injector).
 *
 * ### Examples
 *
 * Import the `UpgradeModule` into your top level {@link NgModule Angular `NgModule`}.
 *
 * {@example upgrade/static/ts/full/module.ts region='ng2-module'}
 *
 * Then inject `UpgradeModule` into your Angular `NgModule` and use it to bootstrap the top level
 * [AngularJS module](https://docs.angularjs.org/api/ng/type/angular.Module) in the
 * `ngDoBootstrap()` method.
 *
 * {@example upgrade/static/ts/full/module.ts region='bootstrap-ng1'}
 *
 * Finally, kick off the whole process, by bootstraping your top level Angular `NgModule`.
 *
 * {@example upgrade/static/ts/full/module.ts region='bootstrap-ng2'}
 *
 * {@a upgrading-an-angular-1-service}
 * ### Upgrading an AngularJS service
 *
 * There is no specific API for upgrading an AngularJS service. Instead you should just follow the
 * following recipe:
 *
 * Let's say you have an AngularJS service:
 *
 * {@example upgrade/static/ts/full/module.ts region="ng1-text-formatter-service"}
 *
 * Then you should define an Angular provider to be included in your `NgModule` `providers`
 * property.
 *
 * {@example upgrade/static/ts/full/module.ts region="upgrade-ng1-service"}
 *
 * Then you can use the "upgraded" AngularJS service by injecting it into an Angular component
 * or service.
 *
 * {@example upgrade/static/ts/full/module.ts region="use-ng1-upgraded-service"}
 *
 * @experimental
 */
var UpgradeModule = /** @class */ (function () {
    function UpgradeModule(
    /** The root `Injector` for the upgrade application. */
    injector, 
    /** The bootstrap zone for the upgrade application */
    ngZone) {
        this.ngZone = ngZone;
        this.injector = new util_2.NgAdapterInjector(injector);
    }
    /**
     * Bootstrap an AngularJS application from this NgModule
     * @param element the element on which to bootstrap the AngularJS application
     * @param [modules] the AngularJS modules to bootstrap for this application
     * @param [config] optional extra AngularJS bootstrap configuration
     */
    UpgradeModule.prototype.bootstrap = function (element, modules, config /*angular.IAngularBootstrapConfig*/) {
        var _this = this;
        if (modules === void 0) { modules = []; }
        var INIT_MODULE_NAME = constants_1.UPGRADE_MODULE_NAME + '.init';
        // Create an ng1 module to bootstrap
        var initModule = angular
            .module(INIT_MODULE_NAME, [])
            .value(constants_1.INJECTOR_KEY, this.injector)
            .factory(constants_1.LAZY_MODULE_REF, [
            constants_1.INJECTOR_KEY,
            function (injector) { return ({ injector: injector, needsNgZone: false }); }
        ])
            .config([
            constants_1.$PROVIDE, constants_1.$INJECTOR,
            function ($provide, $injector) {
                if ($injector.has(constants_1.$$TESTABILITY)) {
                    $provide.decorator(constants_1.$$TESTABILITY, [
                        constants_1.$DELEGATE,
                        function (testabilityDelegate) {
                            var originalWhenStable = testabilityDelegate.whenStable;
                            var injector = _this.injector;
                            // Cannot use arrow function below because we need the context
                            var newWhenStable = function (callback) {
                                originalWhenStable.call(testabilityDelegate, function () {
                                    var ng2Testability = injector.get(core_1.Testability);
                                    if (ng2Testability.isStable()) {
                                        callback();
                                    }
                                    else {
                                        ng2Testability.whenStable(newWhenStable.bind(testabilityDelegate, callback));
                                    }
                                });
                            };
                            testabilityDelegate.whenStable = newWhenStable;
                            return testabilityDelegate;
                        }
                    ]);
                }
                if ($injector.has(constants_1.$INTERVAL)) {
                    $provide.decorator(constants_1.$INTERVAL, [
                        constants_1.$DELEGATE,
                        function (intervalDelegate) {
                            // Wrap the $interval service so that setInterval is called outside NgZone,
                            // but the callback is still invoked within it. This is so that $interval
                            // won't block stability, which preserves the behavior from AngularJS.
                            var wrappedInterval = function (fn, delay, count, invokeApply) {
                                var pass = [];
                                for (var _i = 4; _i < arguments.length; _i++) {
                                    pass[_i - 4] = arguments[_i];
                                }
                                return _this.ngZone.runOutsideAngular(function () {
                                    return intervalDelegate.apply(void 0, [function () {
                                            var args = [];
                                            for (var _i = 0; _i < arguments.length; _i++) {
                                                args[_i] = arguments[_i];
                                            }
                                            // Run callback in the next VM turn - $interval calls
                                            // $rootScope.$apply, and running the callback in NgZone will
                                            // cause a '$digest already in progress' error if it's in the
                                            // same vm turn.
                                            setTimeout(function () { _this.ngZone.run(function () { return fn.apply(void 0, args); }); });
                                        }, delay, count, invokeApply].concat(pass));
                                });
                            };
                            wrappedInterval['cancel'] = intervalDelegate.cancel;
                            return wrappedInterval;
                        }
                    ]);
                }
            }
        ])
            .run([
            constants_1.$INJECTOR,
            function ($injector) {
                _this.$injector = $injector;
                // Initialize the ng1 $injector provider
                angular1_providers_1.setTempInjectorRef($injector);
                _this.injector.get(constants_1.$INJECTOR);
                // Put the injector on the DOM, so that it can be "required"
                angular.element(element).data(util_1.controllerKey(constants_1.INJECTOR_KEY), _this.injector);
                // Wire up the ng1 rootScope to run a digest cycle whenever the zone settles
                // We need to do this in the next tick so that we don't prevent the bootup
                // stabilizing
                setTimeout(function () {
                    var $rootScope = $injector.get('$rootScope');
                    var subscription = _this.ngZone.onMicrotaskEmpty.subscribe(function () { return $rootScope.$digest(); });
                    $rootScope.$on('$destroy', function () { subscription.unsubscribe(); });
                }, 0);
            }
        ]);
        var upgradeModule = angular.module(constants_1.UPGRADE_MODULE_NAME, [INIT_MODULE_NAME].concat(modules));
        // Make sure resumeBootstrap() only exists if the current bootstrap is deferred
        var windowAngular = window['angular'];
        windowAngular.resumeBootstrap = undefined;
        // Bootstrap the AngularJS application inside our zone
        this.ngZone.run(function () { angular.bootstrap(element, [upgradeModule.name], config); });
        // Patch resumeBootstrap() to run inside the ngZone
        if (windowAngular.resumeBootstrap) {
            var originalResumeBootstrap_1 = windowAngular.resumeBootstrap;
            var ngZone_1 = this.ngZone;
            windowAngular.resumeBootstrap = function () {
                var _this = this;
                var args = arguments;
                windowAngular.resumeBootstrap = originalResumeBootstrap_1;
                return ngZone_1.run(function () { return windowAngular.resumeBootstrap.apply(_this, args); });
            };
        }
    };
    UpgradeModule = __decorate([
        core_1.NgModule({ providers: [angular1_providers_1.angular1Providers] }),
        __metadata("design:paramtypes", [core_1.Injector,
            core_1.NgZone])
    ], UpgradeModule);
    return UpgradeModule;
}());
exports.UpgradeModule = UpgradeModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBncmFkZV9tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy91cGdyYWRlL3N0YXRpYy9zcmMvc3RhdGljL3VwZ3JhZGVfbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsc0NBQXNFO0FBRXRFLDRDQUE4QztBQUM5QyxpREFBaUo7QUFDakosdUNBQTREO0FBRTVELDJEQUEyRTtBQUMzRSwrQkFBeUM7QUFHekM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E0SEc7QUFFSDtJQVFFO0lBQ0ksdURBQXVEO0lBQ3ZELFFBQWtCO0lBQ2xCLHFEQUFxRDtJQUM5QyxNQUFjO1FBQWQsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUN2QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksd0JBQWlCLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsaUNBQVMsR0FBVCxVQUNJLE9BQWdCLEVBQUUsT0FBc0IsRUFBRSxNQUFZLENBQUMsbUNBQW1DO1FBRDlGLGlCQXNIQztRQXJIcUIsd0JBQUEsRUFBQSxZQUFzQjtRQUMxQyxJQUFNLGdCQUFnQixHQUFHLCtCQUFtQixHQUFHLE9BQU8sQ0FBQztRQUV2RCxvQ0FBb0M7UUFDcEMsSUFBTSxVQUFVLEdBQ1osT0FBTzthQUNGLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLENBQUM7YUFFNUIsS0FBSyxDQUFDLHdCQUFZLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQzthQUVsQyxPQUFPLENBQ0osMkJBQWUsRUFDZjtZQUNFLHdCQUFZO1lBQ1osVUFBQyxRQUFrQixJQUFLLE9BQUEs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