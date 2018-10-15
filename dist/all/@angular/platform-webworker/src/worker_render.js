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
var platform_browser_1 = require("@angular/platform-browser");
var api_1 = require("./web_workers/shared/api");
var client_message_broker_1 = require("./web_workers/shared/client_message_broker");
var message_bus_1 = require("./web_workers/shared/message_bus");
var post_message_bus_1 = require("./web_workers/shared/post_message_bus");
var render_store_1 = require("./web_workers/shared/render_store");
var serializer_1 = require("./web_workers/shared/serializer");
var service_message_broker_1 = require("./web_workers/shared/service_message_broker");
var renderer_1 = require("./web_workers/ui/renderer");
/**
 * Wrapper class that exposes the Worker
 * and underlying {@link MessageBus} for lower level message passing.
 *
 * @experimental WebWorker support is currently experimental.
 */
var WebWorkerInstance = /** @class */ (function () {
    function WebWorkerInstance() {
    }
    /** @internal */
    WebWorkerInstance.prototype.init = function (worker, bus) {
        this.worker = worker;
        this.bus = bus;
    };
    WebWorkerInstance = __decorate([
        core_1.Injectable()
    ], WebWorkerInstance);
    return WebWorkerInstance;
}());
exports.WebWorkerInstance = WebWorkerInstance;
/**
 * @experimental WebWorker support is currently experimental.
 */
exports.WORKER_SCRIPT = new core_1.InjectionToken('WebWorkerScript');
/**
 * A multi-provider used to automatically call the `start()` method after the service is
 * created.
 *
 * @experimental WebWorker support is currently experimental.
 */
exports.WORKER_UI_STARTABLE_MESSAGING_SERVICE = new core_1.InjectionToken('WorkerRenderStartableMsgService');
exports._WORKER_UI_PLATFORM_PROVIDERS = [
    { provide: core_1.NgZone, useFactory: createNgZone, deps: [] },
    {
        provide: renderer_1.MessageBasedRenderer2,
        deps: [service_message_broker_1.ServiceMessageBrokerFactory, message_bus_1.MessageBus, serializer_1.Serializer, render_store_1.RenderStore, core_1.RendererFactory2]
    },
    { provide: exports.WORKER_UI_STARTABLE_MESSAGING_SERVICE, useExisting: renderer_1.MessageBasedRenderer2, multi: true },
    platform_browser_1.ɵBROWSER_SANITIZATION_PROVIDERS,
    { provide: core_1.ErrorHandler, useFactory: _exceptionHandler, deps: [] },
    { provide: platform_browser_1.DOCUMENT, useFactory: _document, deps: [] },
    // TODO(jteplitz602): Investigate if we definitely need EVENT_MANAGER on the render thread
    // #5298
    {
        provide: platform_browser_1.EVENT_MANAGER_PLUGINS,
        useClass: platform_browser_1.ɵDomEventsPlugin,
        deps: [platform_browser_1.DOCUMENT, core_1.NgZone],
        multi: true
    },
    { provide: platform_browser_1.EVENT_MANAGER_PLUGINS, useClass: platform_browser_1.ɵKeyEventsPlugin, deps: [platform_browser_1.DOCUMENT], multi: true },
    {
        provide: platform_browser_1.EVENT_MANAGER_PLUGINS,
        useClass: platform_browser_1.ɵHammerGesturesPlugin,
        deps: [platform_browser_1.DOCUMENT, platform_browser_1.HAMMER_GESTURE_CONFIG],
        multi: true
    },
    { provide: platform_browser_1.HAMMER_GESTURE_CONFIG, useClass: platform_browser_1.HammerGestureConfig, deps: [] },
    core_1.ɵAPP_ID_RANDOM_PROVIDER,
    { provide: platform_browser_1.ɵDomRendererFactory2, deps: [platform_browser_1.EventManager, platform_browser_1.ɵDomSharedStylesHost] },
    { provide: core_1.RendererFactory2, useExisting: platform_browser_1.ɵDomRendererFactory2 },
    { provide: platform_browser_1.ɵSharedStylesHost, useExisting: platform_browser_1.ɵDomSharedStylesHost },
    {
        provide: service_message_broker_1.ServiceMessageBrokerFactory,
        useClass: service_message_broker_1.ServiceMessageBrokerFactory,
        deps: [message_bus_1.MessageBus, serializer_1.Serializer]
    },
    {
        provide: client_message_broker_1.ClientMessageBrokerFactory,
        useClass: client_message_broker_1.ClientMessageBrokerFactory,
        deps: [message_bus_1.MessageBus, serializer_1.Serializer]
    },
    { provide: serializer_1.Serializer, deps: [render_store_1.RenderStore] },
    { provide: api_1.ON_WEB_WORKER, useValue: false },
    { provide: render_store_1.RenderStore, deps: [] },
    { provide: platform_browser_1.ɵDomSharedStylesHost, deps: [platform_browser_1.DOCUMENT] },
    { provide: core_1.Testability, deps: [core_1.NgZone] },
    { provide: platform_browser_1.EventManager, deps: [platform_browser_1.EVENT_MANAGER_PLUGINS, core_1.NgZone] },
    { provide: WebWorkerInstance, deps: [] },
    {
        provide: core_1.PLATFORM_INITIALIZER,
        useFactory: initWebWorkerRenderPlatform,
        multi: true,
        deps: [core_1.Injector]
    },
    { provide: core_1.PLATFORM_ID, useValue: common_1.ɵPLATFORM_WORKER_UI_ID },
    { provide: message_bus_1.MessageBus, useFactory: messageBusFactory, deps: [WebWorkerInstance] },
];
function initializeGenericWorkerRenderer(injector) {
    var bus = injector.get(message_bus_1.MessageBus);
    var zone = injector.get(core_1.NgZone);
    bus.attachToZone(zone);
    // initialize message services after the bus has been created
    var services = injector.get(exports.WORKER_UI_STARTABLE_MESSAGING_SERVICE);
    zone.runGuarded(function () { services.forEach(function (svc) { svc.start(); }); });
}
function messageBusFactory(instance) {
    return instance.bus;
}
function initWebWorkerRenderPlatform(injector) {
    return function () {
        platform_browser_1.ɵBrowserDomAdapter.makeCurrent();
        platform_browser_1.ɵBrowserGetTestability.init();
        var scriptUri;
        try {
            scriptUri = injector.get(exports.WORKER_SCRIPT);
        }
        catch (e) {
            throw new Error('You must provide your WebWorker\'s initialization script with the WORKER_SCRIPT token');
        }
        var instance = injector.get(WebWorkerInstance);
        spawnWebWorker(scriptUri, instance);
        initializeGenericWorkerRenderer(injector);
    };
}
/**
 * @experimental WebWorker support is currently experimental.
 */
exports.platformWorkerUi = core_1.createPlatformFactory(core_1.platformCore, 'workerUi', exports._WORKER_UI_PLATFORM_PROVIDERS);
function _exceptionHandler() {
    return new core_1.ErrorHandler();
}
function _document() {
    return document;
}
function createNgZone() {
    return new core_1.NgZone({ enableLongStackTrace: core_1.isDevMode() });
}
/**
 * Spawns a new class and initializes the WebWorkerInstance
 */
function spawnWebWorker(uri, instance) {
    var webWorker = new Worker(uri);
    var sink = new post_message_bus_1.PostMessageBusSink(webWorker);
    var source = new post_message_bus_1.PostMessageBusSource(webWorker);
    var bus = new post_message_bus_1.PostMessageBus(sink, source);
    instance.init(webWorker, bus);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2VyX3JlbmRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLXdlYndvcmtlci9zcmMvd29ya2VyX3JlbmRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILDBDQUE4RjtBQUM5RixzQ0FBeVM7QUFDelMsOERBQThpQjtBQUU5aUIsZ0RBQXVEO0FBQ3ZELG9GQUFzRjtBQUN0RixnRUFBNEQ7QUFDNUQsMEVBQStHO0FBQy9HLGtFQUE4RDtBQUM5RCw4REFBMkQ7QUFDM0Qsc0ZBQXdGO0FBQ3hGLHNEQUFnRTtBQUloRTs7Ozs7R0FLRztBQUVIO0lBQUE7SUFXQSxDQUFDO0lBTEMsZ0JBQWdCO0lBQ1QsZ0NBQUksR0FBWCxVQUFZLE1BQWMsRUFBRSxHQUFlO1FBQ3pDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0lBQ2pCLENBQUM7SUFWVSxpQkFBaUI7UUFEN0IsaUJBQVUsRUFBRTtPQUNBLGlCQUFpQixDQVc3QjtJQUFELHdCQUFDO0NBQUEsQUFYRCxJQVdDO0FBWFksOENBQWlCO0FBYTlCOztHQUVHO0FBQ1UsUUFBQSxhQUFhLEdBQUcsSUFBSSxxQkFBYyxDQUFTLGlCQUFpQixDQUFDLENBQUM7QUFFM0U7Ozs7O0dBS0c7QUFDVSxRQUFBLHFDQUFxQyxHQUM5QyxJQUFJLHFCQUFjLENBQTBCLGlDQUFpQyxDQUFDLENBQUM7QUFFdEUsUUFBQSw2QkFBNkIsR0FBcUI7SUFDN0QsRUFBQyxPQUFPLEVBQUUsYUFBTSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBQztJQUNyRDtRQUNFLE9BQU8sRUFBRSxnQ0FBcUI7UUFDOUIsSUFBSSxFQUFFLENBQUMsb0RBQTJCLEVBQUUsd0JBQVUsRUFBRSx1QkFBVSxFQUFFLDBCQUFXLEVBQUUs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