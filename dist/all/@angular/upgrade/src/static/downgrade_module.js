"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var platform_browser_1 = require("@angular/platform-browser");
var angular = require("../common/angular1");
var constants_1 = require("../common/constants");
var util_1 = require("../common/util");
var angular1_providers_1 = require("./angular1_providers");
var util_2 = require("./util");
/**
 * @description
 *
 * A helper function for creating an AngularJS module that can bootstrap an Angular module
 * "on-demand" (possibly lazily) when a {@link downgradeComponent downgraded component} needs to be
 * instantiated.
 *
 * *Part of the [upgrade/static](api?query=upgrade/static) library for hybrid upgrade apps that
 * support AoT compilation.*
 *
 * It allows loading/bootstrapping the Angular part of a hybrid application lazily and not having to
 * pay the cost up-front. For example, you can have an AngularJS application that uses Angular for
 * specific routes and only instantiate the Angular modules if/when the user visits one of these
 * routes.
 *
 * The Angular module will be bootstrapped once (when requested for the first time) and the same
 * reference will be used from that point onwards.
 *
 * `downgradeModule()` requires either an `NgModuleFactory` or a function:
 * - `NgModuleFactory`: If you pass an `NgModuleFactory`, it will be used to instantiate a module
 *   using `platformBrowser`'s {@link PlatformRef#bootstrapModuleFactory bootstrapModuleFactory()}.
 * - `Function`: If you pass a function, it is expected to return a promise resolving to an
 *   `NgModuleRef`. The function is called with an array of extra {@link StaticProvider Providers}
 *   that are expected to be available from the returned `NgModuleRef`'s `Injector`.
 *
 * `downgradeModule()` returns the name of the created AngularJS wrapper module. You can use it to
 * declare a dependency in your main AngularJS module.
 *
 * {@example upgrade/static/ts/lite/module.ts region="basic-how-to"}
 *
 * For more details on how to use `downgradeModule()` see
 * [Upgrading for Performance](guide/upgrade-performance).
 *
 * @usageNotes
 *
 * Apart from `UpgradeModule`, you can use the rest of the `upgrade/static` helpers as usual to
 * build a hybrid application. Note that the Angular pieces (e.g. downgraded services) will not be
 * available until the downgraded module has been bootstrapped, i.e. by instantiating a downgraded
 * component.
 *
 * <div class="alert is-important">
 *
 *   You cannot use `downgradeModule()` and `UpgradeModule` in the same hybrid application.<br />
 *   Use one or the other.
 *
 * </div>
 *
 * ### Differences with `UpgradeModule`
 *
 * Besides their different API, there are two important internal differences between
 * `downgradeModule()` and `UpgradeModule` that affect the behavior of hybrid applications:
 *
 * 1. Unlike `UpgradeModule`, `downgradeModule()` does not bootstrap the main AngularJS module
 *    inside the {@link NgZone Angular zone}.
 * 2. Unlike `UpgradeModule`, `downgradeModule()` does not automatically run a
 *    [$digest()](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$digest) when changes are
 *    detected in the Angular part of the application.
 *
 * What this means is that applications using `UpgradeModule` will run change detection more
 * frequently in order to ensure that both frameworks are properly notified about possible changes.
 * This will inevitably result in more change detection runs than necessary.
 *
 * `downgradeModule()`, on the other side, does not try to tie the two change detection systems as
 * tightly, restricting the explicit change detection runs only to cases where it knows it is
 * necessary (e.g. when the inputs of a downgraded component change). This improves performance,
 * especially in change-detection-heavy applications, but leaves it up to the developer to manually
 * notify each framework as needed.
 *
 * For a more detailed discussion of the differences and their implications, see
 * [Upgrading for Performance](guide/upgrade-performance).
 *
 * <div class="alert is-helpful">
 *
 *   You can manually trigger a change detection run in AngularJS using
 *   [scope.$apply(...)](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$apply) or
 *   [$rootScope.$digest()](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$digest).
 *
 *   You can manually trigger a change detection run in Angular using {@link NgZone#run
 *   ngZone.run(...)}.
 *
 * </div>
 *
 * @experimental
 */
function downgradeModule(moduleFactoryOrBootstrapFn) {
    var LAZY_MODULE_NAME = constants_1.UPGRADE_MODULE_NAME + '.lazy';
    var bootstrapFn = util_1.isFunction(moduleFactoryOrBootstrapFn) ?
        moduleFactoryOrBootstrapFn :
        function (extraProviders) {
            return platform_browser_1.platformBrowser(extraProviders).bootstrapModuleFactory(moduleFactoryOrBootstrapFn);
        };
    var injector;
    // Create an ng1 module to bootstrap.
    angular.module(LAZY_MODULE_NAME, [])
        .factory(constants_1.INJECTOR_KEY, function () {
        if (!injector) {
            throw new Error('Trying to get the Angular injector before bootstrapping an Angular module.');
        }
        return injector;
    })
        .factory(constants_1.LAZY_MODULE_REF, [
        constants_1.$INJECTOR,
        function ($injector) {
            angular1_providers_1.setTempInjectorRef($injector);
            var result = {
                needsNgZone: true,
                promise: bootstrapFn(angular1_providers_1.angular1Providers).then(function (ref) {
                    injector = result.injector = new util_2.NgAdapterInjector(ref.injector);
                    injector.get(constants_1.$INJECTOR);
                    return injector;
                })
            };
            return result;
        }
    ]);
    return LAZY_MODULE_NAME;
}
exports.downgradeModule = downgradeModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmdyYWRlX21vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3VwZ3JhZGUvc3JjL3N0YXRpYy9kb3duZ3JhZGVfbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBR0gsOERBQTBEO0FBRTFELDRDQUE4QztBQUM5QyxpREFBa0c7QUFDbEcsdUNBQXlEO0FBRXpELDJEQUEyRTtBQUMzRSwrQkFBeUM7QUFHekM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBbUZHO0FBQ0gseUJBQ0ksMEJBQytEO0lBQ2pFLElBQU0sZ0JBQWdCLEdBQUcsK0JBQW1CLEdBQUcsT0FBTyxDQUFDO0lBQ3ZELElBQU0sV0FBVyxHQUFHLGlCQUFVLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxDQUFDO1FBQ3hELDBCQUEwQixDQUFDLENBQUM7UUFDNUIsVUFBQyxjQUFnQztZQUM3QixPQUFBLGtDQUFlLENBQUMsY0FBYyxDQUFDLENBQUMsc0JBQXNCLENBQUMsMEJBQTBCLENBQUM7UUFBbEYsQ0FBa0YsQ0FBQztJQUUzRixJQUFJLFFBQWtCLENBQUM7SUFFdkIscUNBQXFDO0lBQ3JDLE9BQU8sQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxDQUFDO1NBQy9CLE9BQU8sQ0FDSix3QkFBWSxFQUNaO1FBQ0UsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNiLE1BQU0sSUFBSSxLQUFLLENBQ1gsNEVBQTRFLENBQUMsQ0FBQztTQUNuRjtRQUNELE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUMsQ0FBQztTQUNMLE9BQU8sQ0FBQywyQkFBZSxFQUFFO1FBQ3hCLHFCQUFTO1FBQ1QsVUFBQyxTQUFtQztZQUNsQyx1Q0FBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM5QixJQUFNLE1BQU0sR0FBa0I7Z0JBQzVCLFdBQVcsRUFBRSxJQUFJO2dCQUNqQixPQUFPLEVBQUUsV0FBVyxDQUFDLHNDQUFpQixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsR0FBRztvQkFDOUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLEdBQUcsSUFBSSx3QkFBaUIsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ2pFLFFBQVEsQ0FBQyxHQUFHLENBQUMscUJBQVMsQ0FBQyxDQUFDO29CQUV4QixPQUFPLFFBQVEsQ0FBQztnQkFDbEIsQ0FBQyxDQUFDO2FBQ0gsQ0FBQztZQUNGLE9BQU8sTUFBTSxDQUFDO1FBQ2hCLENBQUM7S0FDRixDQUFDLENBQUM7SUFFUCxPQUFPLGdCQUFnQixDQUFDO0FBQzFCLENBQUM7QUF4Q0QsMENBd0NDIn0=