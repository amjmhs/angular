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
var renderer_1 = require("./web_workers/worker/renderer");
var worker_adapter_1 = require("./web_workers/worker/worker_adapter");
/**
 * @experimental
 */
exports.platformWorkerApp = core_1.createPlatformFactory(core_1.platformCore, 'workerApp', [{ provide: core_1.PLATFORM_ID, useValue: common_1.ɵPLATFORM_WORKER_APP_ID }]);
function errorHandler() {
    return new core_1.ErrorHandler();
}
exports.errorHandler = errorHandler;
// TODO(jteplitz602): remove this and compile with lib.webworker.d.ts (#3492)
var _postMessage = {
    postMessage: function (message, transferrables) {
        postMessage(message, transferrables);
    }
};
function createMessageBus(zone) {
    var sink = new post_message_bus_1.PostMessageBusSink(_postMessage);
    var source = new post_message_bus_1.PostMessageBusSource();
    var bus = new post_message_bus_1.PostMessageBus(sink, source);
    bus.attachToZone(zone);
    return bus;
}
exports.createMessageBus = createMessageBus;
function setupWebWorker() {
    worker_adapter_1.WorkerDomAdapter.makeCurrent();
}
exports.setupWebWorker = setupWebWorker;
/**
 * The ng module for the worker app side.
 *
 * @experimental
 */
var WorkerAppModule = /** @class */ (function () {
    function WorkerAppModule() {
    }
    WorkerAppModule = __decorate([
        core_1.NgModule({
            providers: [
                platform_browser_1.ɵBROWSER_SANITIZATION_PROVIDERS,
                serializer_1.Serializer,
                { provide: platform_browser_1.DOCUMENT, useValue: null },
                client_message_broker_1.ClientMessageBrokerFactory,
                service_message_broker_1.ServiceMessageBrokerFactory,
                renderer_1.WebWorkerRendererFactory2,
                { provide: core_1.RendererFactory2, useExisting: renderer_1.WebWorkerRendererFactory2 },
                { provide: api_1.ON_WEB_WORKER, useValue: true },
                render_store_1.RenderStore,
                { provide: core_1.ErrorHandler, useFactory: errorHandler, deps: [] },
                { provide: message_bus_1.MessageBus, useFactory: createMessageBus, deps: [core_1.NgZone] },
                { provide: core_1.APP_INITIALIZER, useValue: setupWebWorker, multi: true },
                { provide: common_1.ViewportScroller, useClass: common_1.ɵNullViewportScroller, deps: [] },
            ],
            exports: [
                common_1.CommonModule,
                core_1.ApplicationModule,
            ]
        })
    ], WorkerAppModule);
    return WorkerAppModule;
}());
exports.WorkerAppModule = WorkerAppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2VyX2FwcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLXdlYndvcmtlci9zcmMvd29ya2VyX2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILDBDQUFpSztBQUNqSyxzQ0FBZ047QUFDaE4sOERBQXNIO0FBRXRILGdEQUF1RDtBQUN2RCxvRkFBc0Y7QUFDdEYsZ0VBQTREO0FBQzVELDBFQUErRztBQUMvRyxrRUFBOEQ7QUFDOUQsOERBQTJEO0FBQzNELHNGQUF3RjtBQUN4RiwwREFBd0U7QUFDeEUsc0VBQXFFO0FBSXJFOztHQUVHO0FBQ1UsUUFBQSxpQkFBaUIsR0FBRyw0QkFBcUIsQ0FDbEQsbUJBQVksRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxrQkFBVyxFQUFFLFFBQVEsRUFBRSxnQ0FBc0IsRUFBQyxDQUFDLENBQUMsQ0FBQztBQUUzRjtJQUNFLE9BQU8sSUFBSSxtQkFBWSxFQUFFLENBQUM7QUFDNUIsQ0FBQztBQUZELG9DQUVDO0FBR0QsNkVBQTZFO0FBQzdFLElBQU0sWUFBWSxHQUFHO0lBQ25CLFdBQVcsRUFBRSxVQUFDLE9BQVksRUFBRSxjQUE4QjtRQUNsRCxXQUFZLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7Q0FDRixDQUFDO0FBRUYsMEJBQWlDLElBQVk7SUFDM0MsSUFBTSxJQUFJLEdBQUcsSUFBSSxxQ0FBa0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNsRCxJQUFNLE1BQU0sR0FBRyxJQUFJLHVDQUFvQixFQUFFLENBQUM7SUFDMUMsSUFBTSxHQUFHLEdBQUcsSUFBSSxpQ0FBYyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM3QyxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZCLE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQU5ELDRDQU1DO0FBRUQ7SUFDRSxpQ0FBZ0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUNqQyxDQUFDO0FBRkQsd0NBRUM7QUFFRDs7OztHQUlHO0FBc0JIO0lBQUE7SUFDQSxDQUFDO0lBRFksZUFBZTtRQXJCM0IsZUFBUSxDQUFDO1lBQ1IsU0FBUyxFQUFFO2dCQUNULGtEQUE4QjtnQkFDOUIsdUJBQVU7Z0JBQ1YsRUFBQyxPQUFPLEVBQUUsMkJBQVEsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO2dCQUNuQyxrREFBMEI7Z0JBQzFCLG9EQUEyQjtnQkFDM0Isb0NBQXlCO2dCQUN6QixFQUFDLE9BQU8sRUFBRSx1QkFBZ0IsRUFBRSxXQUFXLEVBQUUsb0NBQXlCLEVBQUM7Z0JBQ25FLEVBQUMsT0FBTyxFQUFFLG1CQUFhLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztnQkFDeEMsMEJBQVc7Z0JBQ1gsRUFBQyxPQUFPLEVBQUUsbUJBQVksRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUM7Z0JBQzNELEVBQUMsT0FBTyxFQUFFLHdCQUFVLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBRSxDQUFDLGFBQU0sQ0FBQyxFQUFDO2dCQUNuRSxFQUFDLE9BQU8sRUFBRSxzQkFBZSxFQUFFLFFBQVEsRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQztnQkFDakUsRUFBQyxPQUFPLEVBQUUseUJBQWdCLEVBQUUsUUFBUSxFQUFFLDhCQUFvQixFQUFFLElBQUksRUFBRSxFQUFFLEVBQUM7YUFDdEU7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AscUJBQVk7Z0JBQ1osd0JBQWlCO2FBQ2xCO1NBQ0YsQ0FBQztPQUNXLGVBQWUsQ0FDM0I7SUFBRCxzQkFBQztDQUFBLEFBREQsSUFDQztBQURZLDBDQUFlIn0=