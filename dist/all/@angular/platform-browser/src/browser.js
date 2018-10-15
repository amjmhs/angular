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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var browser_adapter_1 = require("./browser/browser_adapter");
var browser_platform_location_1 = require("./browser/location/browser_platform_location");
var server_transition_1 = require("./browser/server-transition");
var testability_1 = require("./browser/testability");
var ng_probe_1 = require("./dom/debug/ng_probe");
var dom_renderer_1 = require("./dom/dom_renderer");
var dom_tokens_1 = require("./dom/dom_tokens");
var dom_events_1 = require("./dom/events/dom_events");
var event_manager_1 = require("./dom/events/event_manager");
var hammer_gestures_1 = require("./dom/events/hammer_gestures");
var key_events_1 = require("./dom/events/key_events");
var shared_styles_host_1 = require("./dom/shared_styles_host");
var dom_sanitization_service_1 = require("./security/dom_sanitization_service");
exports.INTERNAL_BROWSER_PLATFORM_PROVIDERS = [
    { provide: core_1.PLATFORM_ID, useValue: common_1.ɵPLATFORM_BROWSER_ID },
    { provide: core_1.PLATFORM_INITIALIZER, useValue: initDomAdapter, multi: true },
    { provide: common_1.PlatformLocation, useClass: browser_platform_location_1.BrowserPlatformLocation, deps: [dom_tokens_1.DOCUMENT] },
    { provide: dom_tokens_1.DOCUMENT, useFactory: _document, deps: [] },
];
/**
 * @security Replacing built-in sanitization providers exposes the application to XSS risks.
 * Attacker-controlled data introduced by an unsanitized provider could expose your
 * application to XSS risks. For more detail, see the [Security Guide](http://g.co/ng/security).
 * @experimental
 */
exports.BROWSER_SANITIZATION_PROVIDERS = [
    { provide: core_1.Sanitizer, useExisting: dom_sanitization_service_1.DomSanitizer },
    { provide: dom_sanitization_service_1.DomSanitizer, useClass: dom_sanitization_service_1.DomSanitizerImpl, deps: [dom_tokens_1.DOCUMENT] },
];
exports.platformBrowser = core_1.createPlatformFactory(core_1.platformCore, 'browser', exports.INTERNAL_BROWSER_PLATFORM_PROVIDERS);
function initDomAdapter() {
    browser_adapter_1.BrowserDomAdapter.makeCurrent();
    testability_1.BrowserGetTestability.init();
}
exports.initDomAdapter = initDomAdapter;
function errorHandler() {
    return new core_1.ErrorHandler();
}
exports.errorHandler = errorHandler;
function _document() {
    return document;
}
exports._document = _document;
exports.BROWSER_MODULE_PROVIDERS = [
    exports.BROWSER_SANITIZATION_PROVIDERS,
    { provide: core_1.ɵAPP_ROOT, useValue: true },
    { provide: core_1.ErrorHandler, useFactory: errorHandler, deps: [] },
    {
        provide: event_manager_1.EVENT_MANAGER_PLUGINS,
        useClass: dom_events_1.DomEventsPlugin,
        multi: true,
        deps: [dom_tokens_1.DOCUMENT, core_1.NgZone, core_1.PLATFORM_ID]
    },
    { provide: event_manager_1.EVENT_MANAGER_PLUGINS, useClass: key_events_1.KeyEventsPlugin, multi: true, deps: [dom_tokens_1.DOCUMENT] },
    {
        provide: event_manager_1.EVENT_MANAGER_PLUGINS,
        useClass: hammer_gestures_1.HammerGesturesPlugin,
        multi: true,
        deps: [dom_tokens_1.DOCUMENT, hammer_gestures_1.HAMMER_GESTURE_CONFIG, core_1.ɵConsole, [new core_1.Optional(), hammer_gestures_1.HAMMER_LOADER]]
    },
    { provide: hammer_gestures_1.HAMMER_GESTURE_CONFIG, useClass: hammer_gestures_1.HammerGestureConfig, deps: [] },
    {
        provide: dom_renderer_1.DomRendererFactory2,
        useClass: dom_renderer_1.DomRendererFactory2,
        deps: [event_manager_1.EventManager, shared_styles_host_1.DomSharedStylesHost]
    },
    { provide: core_1.RendererFactory2, useExisting: dom_renderer_1.DomRendererFactory2 },
    { provide: shared_styles_host_1.SharedStylesHost, useExisting: shared_styles_host_1.DomSharedStylesHost },
    { provide: shared_styles_host_1.DomSharedStylesHost, useClass: shared_styles_host_1.DomSharedStylesHost, deps: [dom_tokens_1.DOCUMENT] },
    { provide: core_1.Testability, useClass: core_1.Testability, deps: [core_1.NgZone] },
    { provide: event_manager_1.EventManager, useClass: event_manager_1.EventManager, deps: [event_manager_1.EVENT_MANAGER_PLUGINS, core_1.NgZone] },
    ng_probe_1.ELEMENT_PROBE_PROVIDERS,
];
/**
 * Exports required infrastructure for all Angular apps.
 * Included by defaults in all Angular apps created with the CLI
 * `new` command.
 * Re-exports `CommonModule` and `ApplicationModule`, making their
 * exports and providers available to all apps.
 *
 *
 */
var BrowserModule = /** @class */ (function () {
    function BrowserModule(parentModule) {
        if (parentModule) {
            throw new Error("BrowserModule has already been loaded. If you need access to common directives such as NgIf and NgFor from a lazy loaded module, import CommonModule instead.");
        }
    }
    BrowserModule_1 = BrowserModule;
    /**
     * Configures a browser-based app to transition from a server-rendered app, if
     * one is present on the page.
     *
     * @param params An object containing an identifier for the app to transition.
     * The ID must match between the client and server versions of the app.
     * @returns The reconfigured `BrowserModule` to import into the app's root `AppModule`.
     *
     * @experimental
     */
    BrowserModule.withServerTransition = function (params) {
        return {
            ngModule: BrowserModule_1,
            providers: [
                { provide: core_1.APP_ID, useValue: params.appId },
                { provide: server_transition_1.TRANSITION_ID, useExisting: core_1.APP_ID },
                server_transition_1.SERVER_TRANSITION_PROVIDERS,
            ],
        };
    };
    var BrowserModule_1;
    BrowserModule = BrowserModule_1 = __decorate([
        core_1.NgModule({ providers: exports.BROWSER_MODULE_PROVIDERS, exports: [common_1.CommonModule, core_1.ApplicationModule] }),
        __param(0, core_1.Optional()), __param(0, core_1.SkipSelf()), __param(0, core_1.Inject(BrowserModule_1)),
        __metadata("design:paramtypes", [Object])
    ], BrowserModule);
    return BrowserModule;
}());
exports.BrowserModule = BrowserModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLWJyb3dzZXIvc3JjL2Jyb3dzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7QUFFSCwwQ0FBNEc7QUFDNUcsc0NBQTBjO0FBRTFjLDZEQUE0RDtBQUM1RCwwRkFBcUY7QUFFckYsaUVBQXVGO0FBQ3ZGLHFEQUE0RDtBQUU1RCxpREFBNkQ7QUFFN0QsbURBQXVEO0FBQ3ZELCtDQUEwQztBQUMxQyxzREFBd0Q7QUFDeEQsNERBQW1HO0FBQ25HLGdFQUE2SDtBQUM3SCxzREFBd0Q7QUFDeEQsK0RBQStFO0FBQy9FLGdGQUFtRjtBQUV0RSxRQUFBLG1DQUFtQyxHQUFxQjtJQUNuRSxFQUFDLE9BQU8sRUFBRSxrQkFBVyxFQUFFLFFBQVEsRUFBRSw2QkFBbUIsRUFBQztJQUNyRCxFQUFDLE9BQU8sRUFBRSwyQkFBb0IsRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUM7SUFDdEUsRUFBQyxPQUFPLEVBQUUseUJBQWdCLEVBQUUsUUFBUSxFQUFFLG1EQUF1QixFQUFFLElBQUksRUFBRSxDQUFDLHFCQUFRLENBQUMsRUFBQztJQUNoRixFQUFDLE9BQU8sRUFBRSxxQkFBUSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBQztDQUNyRCxDQUFDO0FBRUY7Ozs7O0dBS0c7QUFDVSxRQUFBLDhCQUE4QixHQUFxQjtJQUM5RCxFQUFDLE9BQU8sRUFBRSxnQkFBUyxFQUFFLFdBQVcsRUFBRSx1Q0FBWSxFQUFDO0lBQy9DLEVBQUMsT0FBTyxFQUFFLHVDQUFZLEVBQUUsUUFBUSxFQUFFLDJDQUFnQixFQUFFLElBQUksRUFBRSxDQUFDLHFCQUFRLENBQUMsRUFBQztDQUN0RSxDQUFDO0FBRVcsUUFBQSxlQUFlLEdBQ3hCLDRCQUFxQixD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