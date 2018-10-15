/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CommonModule, ViewportScroller, ɵNullViewportScroller as NullViewportScroller, ɵPLATFORM_WORKER_APP_ID as PLATFORM_WORKER_APP_ID } from '@angular/common';
import { APP_INITIALIZER, ApplicationModule, ErrorHandler, NgModule, NgZone, PLATFORM_ID, RendererFactory2, createPlatformFactory, platformCore } from '@angular/core';
import { DOCUMENT, ɵBROWSER_SANITIZATION_PROVIDERS as BROWSER_SANITIZATION_PROVIDERS } from '@angular/platform-browser';
import { ON_WEB_WORKER } from './web_workers/shared/api';
import { ClientMessageBrokerFactory } from './web_workers/shared/client_message_broker';
import { MessageBus } from './web_workers/shared/message_bus';
import { PostMessageBus, PostMessageBusSink, PostMessageBusSource } from './web_workers/shared/post_message_bus';
import { RenderStore } from './web_workers/shared/render_store';
import { Serializer } from './web_workers/shared/serializer';
import { ServiceMessageBrokerFactory } from './web_workers/shared/service_message_broker';
import { WebWorkerRendererFactory2 } from './web_workers/worker/renderer';
import { WorkerDomAdapter } from './web_workers/worker/worker_adapter';
/** *
 * \@experimental
  @type {?} */
export var platformWorkerApp = createPlatformFactory(platformCore, 'workerApp', [{ provide: PLATFORM_ID, useValue: PLATFORM_WORKER_APP_ID }]);
/**
 * @return {?}
 */
export function errorHandler() {
    return new ErrorHandler();
}
var ɵ0 = function (message, transferrables) {
    (/** @type {?} */ (postMessage))(message, transferrables);
};
/** @type {?} */
var _postMessage = {
    postMessage: ɵ0
};
/**
 * @param {?} zone
 * @return {?}
 */
export function createMessageBus(zone) {
    /** @type {?} */
    var sink = new PostMessageBusSink(_postMessage);
    /** @type {?} */
    var source = new PostMessageBusSource();
    /** @type {?} */
    var bus = new PostMessageBus(sink, source);
    bus.attachToZone(zone);
    return bus;
}
/**
 * @return {?}
 */
export function setupWebWorker() {
    WorkerDomAdapter.makeCurrent();
}
/**
 * The ng module for the worker app side.
 *
 * \@experimental
 */
var WorkerAppModule = /** @class */ (function () {
    function WorkerAppModule() {
    }
    WorkerAppModule.decorators = [
        { type: NgModule, args: [{
                    providers: [
                        BROWSER_SANITIZATION_PROVIDERS,
                        Serializer,
                        { provide: DOCUMENT, useValue: null },
                        ClientMessageBrokerFactory,
                        ServiceMessageBrokerFactory,
                        WebWorkerRendererFactory2,
                        { provide: RendererFactory2, useExisting: WebWorkerRendererFactory2 },
                        { provide: ON_WEB_WORKER, useValue: true },
                        RenderStore,
                        { provide: ErrorHandler, useFactory: errorHandler, deps: [] },
                        { provide: MessageBus, useFactory: createMessageBus, deps: [NgZone] },
                        { provide: APP_INITIALIZER, useValue: setupWebWorker, multi: true },
                        { provide: ViewportScroller, useClass: NullViewportScroller, deps: [] },
                    ],
                    exports: [
                        CommonModule,
                        ApplicationModule,
                    ]
                },] },
    ];
    return WorkerAppModule;
}());
export { WorkerAppModule };
export { ɵ0 };
//# sourceMappingURL=worker_app.js.map