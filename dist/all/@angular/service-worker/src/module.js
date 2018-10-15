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
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var operators_1 = require("rxjs/operators");
var low_level_1 = require("./low_level");
var push_1 = require("./push");
var update_1 = require("./update");
var RegistrationOptions = /** @class */ (function () {
    function RegistrationOptions() {
    }
    return RegistrationOptions;
}());
exports.RegistrationOptions = RegistrationOptions;
exports.SCRIPT = new core_1.InjectionToken('NGSW_REGISTER_SCRIPT');
function ngswAppInitializer(injector, script, options, platformId) {
    var initializer = function () {
        var app = injector.get(core_1.ApplicationRef);
        if (!(common_1.isPlatformBrowser(platformId) && ('serviceWorker' in navigator) &&
            options.enabled !== false)) {
            return;
        }
        var whenStable = app.isStable.pipe(operators_1.filter(function (stable) { return !!stable; }), operators_1.take(1)).toPromise();
        // Wait for service worker controller changes, and fire an INITIALIZE action when a new SW
        // becomes active. This allows the SW to initialize itself even if there is no application
        // traffic.
        navigator.serviceWorker.addEventListener('controllerchange', function () {
            if (navigator.serviceWorker.controller !== null) {
                navigator.serviceWorker.controller.postMessage({ action: 'INITIALIZE' });
            }
        });
        // Don't return the Promise, as that will block the application until the SW is registered, and
        // cause a crash if the SW registration fails.
        whenStable.then(function () { return navigator.serviceWorker.register(script, { scope: options.scope }); });
    };
    return initializer;
}
exports.ngswAppInitializer = ngswAppInitializer;
function ngswCommChannelFactory(opts, platformId) {
    return new low_level_1.NgswCommChannel(common_1.isPlatformBrowser(platformId) && opts.enabled !== false ? navigator.serviceWorker :
        undefined);
}
exports.ngswCommChannelFactory = ngswCommChannelFactory;
/**
 * @experimental
 */
var ServiceWorkerModule = /** @class */ (function () {
    function ServiceWorkerModule() {
    }
    ServiceWorkerModule_1 = ServiceWorkerModule;
    /**
     * Register the given Angular Service Worker script.
     *
     * If `enabled` is set to `false` in the given options, the module will behave as if service
     * workers are not supported by the browser, and the service worker will not be registered.
     */
    ServiceWorkerModule.register = function (script, opts) {
        if (opts === void 0) { opts = {}; }
        return {
            ngModule: ServiceWorkerModule_1,
            providers: [
                { provide: exports.SCRIPT, useValue: script },
                { provide: RegistrationOptions, useValue: opts },
                {
                    provide: low_level_1.NgswCommChannel,
                    useFactory: ngswCommChannelFactory,
                    deps: [RegistrationOptions, core_1.PLATFORM_ID]
                },
                {
                    provide: core_1.APP_INITIALIZER,
                    useFactory: ngswAppInitializer,
                    deps: [core_1.Injector, exports.SCRIPT, RegistrationOptions, core_1.PLATFORM_ID],
                    multi: true,
                },
            ],
        };
    };
    var ServiceWorkerModule_1;
    ServiceWorkerModule = ServiceWorkerModule_1 = __decorate([
        core_1.NgModule({
            providers: [push_1.SwPush, update_1.SwUpdate],
        })
    ], ServiceWorkerModule);
    return ServiceWorkerModule;
}());
exports.ServiceWorkerModule = ServiceWorkerModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILDBDQUFrRDtBQUNsRCxzQ0FBb0k7QUFDcEksNENBQTRDO0FBRTVDLHlDQUE0QztBQUM1QywrQkFBOEI7QUFDOUIsbUNBQWtDO0FBRWxDO0lBQUE7SUFHQSxDQUFDO0lBQUQsMEJBQUM7QUFBRCxDQUFDLEFBSEQsSUFHQztBQUhxQixrREFBbUI7QUFLNUIsUUFBQSxNQUFNLEdBQUcsSUFBSSxxQkFBYyxDQUFTLHNCQUFzQixDQUFDLENBQUM7QUFFekUsNEJBQ0ksUUFBa0IsRUFBRSxNQUFjLEVBQUUsT0FBNEIsRUFDaEUsVUFBa0I7SUFDcEIsSUFBTSxXQUFXLEdBQUc7UUFDbEIsSUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBaUIscUJBQWMsQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyxDQUFDLDBCQUFpQixDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsZUFBZSxJQUFJLFNBQVMsQ0FBQztZQUMvRCxPQUFPLENBQUMsT0FBTyxLQUFLLEtBQUssQ0FBQyxFQUFFO1lBQ2hDLE9BQU87U0FDUjtRQUNELElBQU0sVUFBVSxHQUNaLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGtCQUFNLENBQUMsVUFBQyxNQUFlLElBQUssT0FBQSxDQUFDLENBQUMsTUFBTSxFQUFSLENBQVEsQ0FBQyxFQUFFLGdCQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUVsRiwwRkFBMEY7UUFDMUYsMEZBQTBGO1FBQzFGLFdBQVc7UUFDWCxTQUFTLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFO1lBQzNELElBQUksU0FBUyxDQUFDLGFBQWEsQ0FBQyxVQUFVLEtBQUssSUFBSSxFQUFFO2dCQUMvQyxTQUFTLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsRUFBQyxNQUFNLEVBQUUsWUFBWSxFQUFDLENBQUMsQ0FBQzthQUN4RTtRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsK0ZBQStGO1FBQy9GLDhDQUE4QztRQUM5QyxVQUFVLENBQUMsSUFBSSxDQUFDLGNBQU0sT0FBQSxTQUFTLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBQyxDQUFDLEVBQWhFLENBQWdFLENBQUMsQ0FBQztJQUMxRixDQUFDLENBQUM7SUFDRixPQUFPLFdBQVcsQ0FBQztBQUNyQixDQUFDO0FBMUJELGdEQTBCQztBQUVELGdDQUNJLElBQXlCLEVBQUUsVUFBa0I7SUFDL0MsT0FBTyxJQUFJLDJCQUFlLENBQ3RCLDBCQUFpQixDQUFDLFVBQVUsQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDekIsU0FBUyxDQUFDLENBQUM7QUFDM0UsQ0FBQztBQUxELHdEQUtDO0FBRUQ7O0dBRUc7QUFJSDtJQUFBO0lBNEJBLENBQUM7NEJBNUJZLG1CQUFtQjtJQUM5Qjs7Ozs7T0FLRztJQUNJLDRCQUFRLEdBQWYsVUFBZ0IsTUFBYyxFQUFFLElBQStDO1FBQS9DLHFCQUFBLEVBQUEsU0FBK0M7UUFFN0UsT0FBTztZQUNMLFFBQVEsRUFBRSxxQkFBbUI7WUFDN0IsU0FBUyxFQUFFO2dCQUNULEVBQUMsT0FBTyxFQUFFLGNBQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFDO2dCQUNuQyxFQUFDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO2dCQUM5QztvQkFDRSxPQUFPLEVBQUUsMkJBQWU7b0JBQ3hCLFVBQVUsRUFBRSxzQkFBc0I7b0JBQ2xDLElBQUksRUFBRSxDQUFDLG1CQUFtQixFQUFFLGtCQUFXLENBQUM7aUJBQ3pDO2dCQUNEO29CQUNFLE9BQU8sRUFBRSxzQkFBZTtvQkFDeEIsVUFBVSxFQUFFLGtCQUFrQjtvQkFDOUIsSUFBSSxFQUFFLENBQUMsZUFBUSxFQUFFLGNBQU0sRUFBRSxtQkFBbUIsRUFBRSxrQkFBVyxDQUFDO29CQUMxRCxLQUFLLEVBQUUsSUFBSTtpQkFDWjthQUNGO1NBQ0YsQ0FBQztJQUNKLENBQUM7O0lBM0JVLG1CQUFtQjtRQUgvQixlQUFRLENBQUM7WUFDUixTQUFTLEVBQUUsQ0FBQyxhQUFNLEVBQUUsaUJBQVEsQ0FBQztTQUM5QixDQUFDO09BQ1csbUJBQW1CLENBNEIvQjtJQUFELDBCQUFDO0NBQUEsQUE1QkQsSUE0QkM7QUE1Qlksa0RBQW1CIn0=