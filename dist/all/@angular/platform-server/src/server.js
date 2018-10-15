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
var browser_1 = require("@angular/animations/browser");
var common_1 = require("@angular/common");
var http_1 = require("@angular/common/http");
var core_1 = require("@angular/core");
var http_2 = require("@angular/http");
var platform_browser_1 = require("@angular/platform-browser");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var animations_1 = require("@angular/platform-browser/animations");
var domino_adapter_1 = require("./domino_adapter");
var http_3 = require("./http");
var location_1 = require("./location");
var platform_state_1 = require("./platform_state");
var server_events_1 = require("./server_events");
var server_renderer_1 = require("./server_renderer");
var styles_host_1 = require("./styles_host");
var tokens_1 = require("./tokens");
function notSupported(feature) {
    throw new Error("platform-server does not support '" + feature + "'.");
}
exports.INTERNAL_SERVER_PLATFORM_PROVIDERS = [
    { provide: platform_browser_1.DOCUMENT, useFactory: _document, deps: [core_1.Injector] },
    { provide: core_1.PLATFORM_ID, useValue: common_1.ɵPLATFORM_SERVER_ID },
    { provide: core_1.PLATFORM_INITIALIZER, useFactory: initDominoAdapter, multi: true, deps: [core_1.Injector] }, {
        provide: common_1.PlatformLocation,
        useClass: location_1.ServerPlatformLocation,
        deps: [platform_browser_1.DOCUMENT, [core_1.Optional, tokens_1.INITIAL_CONFIG]]
    },
    { provide: platform_state_1.PlatformState, deps: [platform_browser_1.DOCUMENT] },
    // Add special provider that allows multiple instances of platformServer* to be created.
    { provide: core_1.ɵALLOW_MULTIPLE_PLATFORMS, useValue: true }
];
function initDominoAdapter(injector) {
    return function () { domino_adapter_1.DominoAdapter.makeCurrent(); };
}
function instantiateServerRendererFactory(renderer, engine, zone) {
    return new animations_1.ɵAnimationRendererFactory(renderer, engine, zone);
}
exports.instantiateServerRendererFactory = instantiateServerRendererFactory;
exports.SERVER_RENDER_PROVIDERS = [
    server_renderer_1.ServerRendererFactory2,
    {
        provide: core_1.RendererFactory2,
        useFactory: instantiateServerRendererFactory,
        deps: [server_renderer_1.ServerRendererFactory2, browser_1.ɵAnimationEngine, core_1.NgZone]
    },
    styles_host_1.ServerStylesHost,
    { provide: platform_browser_1.ɵSharedStylesHost, useExisting: styles_host_1.ServerStylesHost },
    { provide: platform_browser_1.EVENT_MANAGER_PLUGINS, multi: true, useClass: server_events_1.ServerEventManagerPlugin },
];
/**
 * The ng module for the server.
 *
 * @experimental
 */
var ServerModule = /** @class */ (function () {
    function ServerModule() {
    }
    ServerModule = __decorate([
        core_1.NgModule({
            exports: [platform_browser_1.BrowserModule],
            imports: [http_2.HttpModule, http_1.HttpClientModule, animations_1.NoopAnimationsModule],
            providers: [
                exports.SERVER_RENDER_PROVIDERS,
                http_3.SERVER_HTTP_PROVIDERS,
                { provide: core_1.Testability, useValue: null },
                { provide: common_1.ViewportScroller, useClass: common_1.ɵNullViewportScroller },
            ],
        })
    ], ServerModule);
    return ServerModule;
}());
exports.ServerModule = ServerModule;
function _document(injector) {
    var config = injector.get(tokens_1.INITIAL_CONFIG, null);
    if (config && config.document) {
        return domino_adapter_1.parseDocument(config.document, config.url);
    }
    else {
        return platform_browser_1.ɵgetDOM().createHtmlDocument();
    }
}
/**
 * @experimental
 */
exports.platformServer = core_1.createPlatformFactory(core_1.platformCore, 'server', exports.INTERNAL_SERVER_PLATFORM_PROVIDERS);
/**
 * The server platform that supports the runtime compiler.
 *
 * @experimental
 */
exports.platformDynamicServer = core_1.createPlatformFactory(platform_browser_dynamic_1.ɵplatformCoreDynamic, 'serverDynamic', exports.INTERNAL_SERVER_PLATFORM_PROVIDERS);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tc2VydmVyL3NyYy9zZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7QUFFSCx1REFBNkQ7QUFDN0QsMENBQTZKO0FBQzdKLDZDQUFzRDtBQUN0RCxzQ0FBNlQ7QUFDN1Qsc0NBQXlDO0FBQ3pDLDhEQUFtSztBQUNuSyw4RUFBOEY7QUFDOUYsbUVBQXFHO0FBRXJHLG1EQUE4RDtBQUM5RCwrQkFBNkM7QUFDN0MsdUNBQWtEO0FBQ2xELG1EQUErQztBQUMvQyxpREFBeUQ7QUFDekQscURBQXlEO0FBQ3pELDZDQUErQztBQUMvQyxtQ0FBd0Q7QUFFeEQsc0JBQXNCLE9BQWU7SUFDbkMsTUFBTSxJQUFJLEtBQUssQ0FBQyx1Q0FBcUMsT0FBTyxPQUFJLENBQUMsQ0FBQztBQUNwRSxDQUFDO0FBRVksUUFBQSxrQ0FBa0MsR0FBcUI7SUFDbEUsRUFBQyxPQUFPLEVBQUUsMkJBQVEsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLGVBQVEsQ0FBQyxFQUFDO0lBQzVELEVBQUMsT0FBTyxFQUFFLGtCQUFXLEVBQUUsUUFBUSxFQUFFLDRCQUFrQixFQUFDO0lBQ3BELEVBQUMsT0FBTyxFQUFFLDJCQUFvQixFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLGVBQVEsQ0FBQyxFQUFDLEVBQUU7UUFDN0YsT0FBTyxFQUFFLHlCQUFnQjtRQUN6QixRQUFRLEVBQUUsaUNBQXNCO1FBQ2hDLElBQUksRUFBRSxDQUFDLDJCQUFRLEVBQUUsQ0FBQyxlQUFRLEVBQUUsdUJBQWMsQ0FBQyxDQUFDO0tBQzdDO0lBQ0QsRUFBQyxPQUFPLEVBQUUsOEJBQWEsRUFBRSxJQUFJLEVBQUUsQ0FBQywyQkFBUSxDQUFDLEVBQUM7SUFDMUMsd0ZBQXdGO0lBQ3hGLEVBQUMsT0FBTyxFQUFFLGdDQUF3QixFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUM7Q0FDcEQsQ0FBQztBQUVGLDJCQUEyQixRQUFrQjtJQUMzQyxPQUFPLGNBQVEsOEJBQWEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoRCxDQUFDO0FBRUQsMENBQ0ksUUFBMEIsRUFBRSxNQUF3QixFQUFFLElBQVk7SUFDcEUsT0FBTyxJQUFJLHNDQUF5QixDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDL0QsQ0FBQztBQUhELDRFQUdDO0FBRVksUUFBQSx1QkFBdUIsR0FBZTtJQUNqRCx3Q0FBc0I7SUFDdEI7UUFDRSxPQUFPLEVBQUUsdUJBQWdCO1FBQ3pCLFVBQVUsRUFBRSxnQ0FBZ0M7UUFDNUMsSUFBSSxFQUFFLENBQUMsd0NBQXNCLEVBQUUsMEJBQWdCLEVBQUUsYUFBTSxDQUFDO0tBQ3pEO0lBQ0QsOEJBQWdCO0lBQ2hCLEVBQUMsT0FBTyxFQUFFLG9DQUFnQixFQUFFLFdBQVcsRUFBRSw4QkFBZ0IsRUFBQztJQUMxRCxFQUFDLE9BQU8sRUFBRSx3Q0FBcUIsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSx3Q0FBd0IsRUFBQztDQUNsRixDQUFDO0FBRUY7Ozs7R0FJRztBQVdIO0lBQUE7SUFDQSxDQUFDO0lBRFksWUFBWTtRQVZ4QixlQUFRLENBQUM7WUFDUixPQUFPLEVBQUUsQ0FBQyxnQ0FBYSxDQUFDO1lBQ3hCLE9BQU8sRUFBRSxDQUFDLGlCQUFVLEVBQUUsdUJBQWdCLEVBQUUsaUNBQW9CLENBQUM7WUFDN0QsU0FBUyxFQUFFO2dCQUNULCtCQUF1QjtnQkFDdkIsNEJBQXFCO2dCQUNyQixFQUFDLE9BQU8sRUFBRSxrQkFBVyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUM7Z0JBQ3RDLEVBQUMsT0FBTyxFQUFFLHlCQUFnQixFQUFFLFFBQVEsRUFBRSw4QkFBb0IsRUFBQzthQUM1RDtTQUNGLENBQUM7T0FDVyxZQUFZLENBQ3hCO0lBQUQsbUJBQUM7Q0FBQSxBQURELElBQ0M7QUFEWSxvQ0FBWTtBQUd6QixtQkFBbUIsUUFBa0I7SUFDbkMsSUFBSSxNQUFNLEdBQXdCLFFBQVEsQ0FBQyxHQUFHLENBQUMsdUJBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNyRSxJQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFO1FBQzdCLE9BQU8sOEJBQWEsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNuRDtTQUFNO1FBQ0wsT0FBTywwQkFBTSxFQUFFLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztLQUN0QztBQUNILENBQUM7QUFFRDs7R0FFRztBQUNVLFFBQUEsY0FBYyxHQUN2Qiw0QkFBcUIsQ0FBQyxtQkFBWSxFQUFFLFFBQVEsRUFBRSwwQ0FBa0MsQ0FBQyxDQUFDO0FBRXRGOzs7O0dBSUc7QUFDVSxRQUFBLHFCQUFxQixHQUM5Qiw0QkFBcUIsQ0FBQywrQ0FBbUIsRUFBRSxlQUFlLEVBQUUsMENBQWtDLENBQUMsQ0FBQyJ9