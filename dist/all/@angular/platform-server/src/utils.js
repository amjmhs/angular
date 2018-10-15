"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var operators_1 = require("rxjs/operators");
var platform_state_1 = require("./platform_state");
var server_1 = require("./server");
var tokens_1 = require("./tokens");
function _getPlatform(platformFactory, options) {
    var extraProviders = options.extraProviders ? options.extraProviders : [];
    return platformFactory([
        { provide: tokens_1.INITIAL_CONFIG, useValue: { document: options.document, url: options.url } },
        extraProviders
    ]);
}
function _render(platform, moduleRefPromise) {
    return moduleRefPromise.then(function (moduleRef) {
        var transitionId = moduleRef.injector.get(platform_browser_1.ɵTRANSITION_ID, null);
        if (!transitionId) {
            throw new Error("renderModule[Factory]() requires the use of BrowserModule.withServerTransition() to ensure\nthe server-rendered app can be properly bootstrapped into a client app.");
        }
        var applicationRef = moduleRef.injector.get(core_1.ApplicationRef);
        return applicationRef.isStable.pipe((operators_1.first(function (isStable) { return isStable; })))
            .toPromise()
            .then(function () {
            var platformState = platform.injector.get(platform_state_1.PlatformState);
            // Run any BEFORE_APP_SERIALIZED callbacks just before rendering to string.
            var callbacks = moduleRef.injector.get(tokens_1.BEFORE_APP_SERIALIZED, null);
            if (callbacks) {
                for (var _i = 0, callbacks_1 = callbacks; _i < callbacks_1.length; _i++) {
                    var callback = callbacks_1[_i];
                    try {
                        callback();
                    }
                    catch (e) {
                        // Ignore exceptions.
                        console.warn('Ignoring BEFORE_APP_SERIALIZED Exception: ', e);
                    }
                }
            }
            var output = platformState.renderToString();
            platform.destroy();
            return output;
        });
    });
}
/**
 * Renders a Module to string.
 *
 * `document` is the full document HTML of the page to render, as a string.
 * `url` is the URL for the current render request.
 * `extraProviders` are the platform level providers for the current render request.
 *
 * Do not use this in a production server environment. Use pre-compiled {@link NgModuleFactory} with
 * {@link renderModuleFactory} instead.
 *
 * @experimental
 */
function renderModule(module, options) {
    var platform = _getPlatform(server_1.platformDynamicServer, options);
    return _render(platform, platform.bootstrapModule(module));
}
exports.renderModule = renderModule;
/**
 * Renders a {@link NgModuleFactory} to string.
 *
 * `document` is the full document HTML of the page to render, as a string.
 * `url` is the URL for the current render request.
 * `extraProviders` are the platform level providers for the current render request.
 *
 * @experimental
 */
function renderModuleFactory(moduleFactory, options) {
    var platform = _getPlatform(server_1.platformServer, options);
    return _render(platform, platform.bootstrapModuleFactory(moduleFactory));
}
exports.renderModuleFactory = renderModuleFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1zZXJ2ZXIvc3JjL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0NBQThHO0FBQzlHLDhEQUF5RDtBQUN6RCw0Q0FBcUM7QUFFckMsbURBQStDO0FBQy9DLG1DQUErRDtBQUMvRCxtQ0FBK0Q7QUFRL0Qsc0JBQ0ksZUFBa0UsRUFDbEUsT0FBd0I7SUFDMUIsSUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQzVFLE9BQU8sZUFBZSxDQUFDO1FBQ3JCLEVBQUMsT0FBTyxFQUFFLHVCQUFjLEVBQUUsUUFBUSxFQUFFLEVBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUMsRUFBQztRQUNuRixjQUFjO0tBQ2YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELGlCQUNJLFFBQXFCLEVBQUUsZ0JBQXlDO0lBQ2xFLE9BQU8sZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQUMsU0FBUztRQUNyQyxJQUFNLFlBQVksR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxpQ0FBYyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2xFLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDakIsTUFBTSxJQUFJLEtBQUssQ0FDWCxxS0FDOEQsQ0FBQyxDQUFDO1NBQ3JFO1FBQ0QsSUFBTSxjQUFjLEdBQW1CLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLHFCQUFjLENBQUMsQ0FBQztRQUM5RSxPQUFPLGNBQWMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsaUJBQUssQ0FBQyxVQUFDLFFBQWlCLElBQUssT0FBQSxRQUFRLEVBQVIsQ0FBUSxDQUFDLENBQUMsQ0FBQzthQUN4RSxTQUFTLEVBQUU7YUFDWCxJQUFJLENBQUM7WUFDSixJQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyw4QkFBYSxDQUFDLENBQUM7WUFFM0QsMkVBQTJFO1lBQzNFLElBQU0sU0FBUyxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLDhCQUFxQixFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3RFLElBQUksU0FBUyxFQUFFO2dCQUNiLEtBQXVCLFVBQVMsRUFBVCx1QkFBUyxFQUFULHVCQUFTLEVBQVQsSUFBUyxFQUFFO29CQUE3QixJQUFNLFFBQVEsa0JBQUE7b0JBQ2pCLElBQUk7d0JBQ0YsUUFBUSxFQUFFLENBQUM7cUJBQ1o7b0JBQUMsT0FBTyxDQUFDLEVBQUU7d0JBQ1YscUJBQXFCO3dCQUNyQixPQUFPLENBQUMsSUFBSSxDQUFDLDRDQUE0QyxFQUFFLENBQUMsQ0FBQyxDQUFDO3FCQUMvRDtpQkFDRjthQUNGO1lBRUQsSUFBTSxNQUFNLEdBQUcsYUFBYSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQzlDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNuQixPQUFPLE1BQU0sQ0FBQztRQUNoQixDQUFDLENBQUMsQ0FBQztJQUNULENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVEOzs7Ozs7Ozs7OztHQVdHO0FBQ0gsc0JBQ0ksTUFBZSxFQUFFLE9BQTZFO0lBRWhHLElBQU0sUUFBUSxHQUFHLFlBQVksQ0FBQyw4QkFBcUIsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUM5RCxPQUFPLE9BQU8sQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQzdELENBQUM7QUFMRCxvQ0FLQztBQUVEOzs7Ozs7OztHQVFHO0FBQ0gsNkJBQ0ksYUFBaUMsRUFDakMsT0FBNkU7SUFFL0UsSUFBTSxRQUFRLEdBQUcsWUFBWSxDQUFDLHVCQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDdkQsT0FBTyxPQUFPLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO0FBQzNFLENBQUM7QUFORCxrREFNQyJ9