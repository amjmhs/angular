/**
 * @license Angular v6.1.10-bea78b0
 * (c) 2010-2018 Google, Inc. https://angular.io/
 * License: MIT
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/core'), require('rxjs/operators'), require('rxjs')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/common', '@angular/core', 'rxjs/operators', 'rxjs'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.serviceWorker = {}),global.ng.common,global.ng.core,global.rxjs.operators,global.rxjs));
}(this, (function (exports,_angular_common,_angular_core,rxjs_operators,rxjs) { 'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */



var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

/**
 * @license Angular v6.1.10-bea78b0
 * (c) 2010-2018 Google, Inc. https://angular.io/
 * License: MIT
 */
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
/** @type {?} */
var ERR_SW_NOT_SUPPORTED = 'Service workers are disabled or not supported by this browser';
/**
 * An event emitted when a new version of the app is available.
 *
 * \@experimental
 * @record
 */

/**
 * An event emitted when a new version of the app has been downloaded and activated.
 *
 * \@experimental
 * @record
 */

/**
 * An event emitted when a `PushEvent` is received by the service worker.
 * @record
 */

/**
 * @record
 */

/**
 * @param {?} message
 * @return {?}
 */
function errorObservable(message) {
    return rxjs.defer(function () { return rxjs.throwError(new Error(message)); });
}
/**
 * \@experimental
 */
var NgswCommChannel = /** @class */ (function () {
    function NgswCommChannel(serviceWorker) {
        this.serviceWorker = serviceWorker;
        if (!serviceWorker) {
            this.worker = this.events = this.registration = errorObservable(ERR_SW_NOT_SUPPORTED);
        }
        else {
            /** @type {?} */
            var controllerChangeEvents = rxjs.fromEvent(serviceWorker, 'controllerchange');
            /** @type {?} */
            var controllerChanges = controllerChangeEvents.pipe(rxjs_operators.map(function () { return serviceWorker.controller; }));
            /** @type {?} */
            var currentController = rxjs.defer(function () { return rxjs.of(serviceWorker.controller); });
            /** @type {?} */
            var controllerWithChanges = rxjs.concat(currentController, controllerChanges);
            this.worker = controllerWithChanges.pipe(rxjs_operators.filter(function (c) { return !!c; }));
            this.registration = /** @type {?} */ ((this.worker.pipe(rxjs_operators.switchMap(function () { return serviceWorker.getRegistration(); }))));
            /** @type {?} */
            var rawEvents = rxjs.fromEvent(serviceWorker, 'message');
            /** @type {?} */
            var rawEventPayload = rawEvents.pipe(rxjs_operators.map(function (event) { return event.data; }));
            /** @type {?} */
            var eventsUnconnected = rawEventPayload.pipe(rxjs_operators.filter(function (event) { return event && event.type; }));
            /** @type {?} */
            var events = /** @type {?} */ (eventsUnconnected.pipe(rxjs_operators.publish()));
            events.connect();
            this.events = events;
        }
    }
    /**
     * @param {?} action
     * @param {?} payload
     * @return {?}
     */
    NgswCommChannel.prototype.postMessage = /**
     * @param {?} action
     * @param {?} payload
     * @return {?}
     */
    function (action, payload) {
        return this.worker
            .pipe(rxjs_operators.take(1), rxjs_operators.tap(function (sw) {
            sw.postMessage(__assign({ action: action }, payload));
        }))
            .toPromise()
            .then(function () { return undefined; });
    };
    /**
     * @param {?} type
     * @param {?} payload
     * @param {?} nonce
     * @return {?}
     */
    NgswCommChannel.prototype.postMessageWithStatus = /**
     * @param {?} type
     * @param {?} payload
     * @param {?} nonce
     * @return {?}
     */
    function (type, payload, nonce) {
        /** @type {?} */
        var waitForStatus = this.waitForStatus(nonce);
        /** @type {?} */
        var postMessage = this.postMessage(type, payload);
        return Promise.all([waitForStatus, postMessage]).then(function () { return undefined; });
    };
    /**
     * @return {?}
     */
    NgswCommChannel.prototype.generateNonce = /**
     * @return {?}
     */
    function () { return Math.round(Math.random() * 10000000); };
    /**
     * @template T
     * @param {?} type
     * @return {?}
     */
    NgswCommChannel.prototype.eventsOfType = /**
     * @template T
     * @param {?} type
     * @return {?}
     */
    function (type) {
        /** @type {?} */
        var filterFn = function (event) { return event.type === type; };
        return this.events.pipe(rxjs_operators.filter(filterFn));
    };
    /**
     * @template T
     * @param {?} type
     * @return {?}
     */
    NgswCommChannel.prototype.nextEventOfType = /**
     * @template T
     * @param {?} type
     * @return {?}
     */
    function (type) {
        return this.eventsOfType(type).pipe(rxjs_operators.take(1));
    };
    /**
     * @param {?} nonce
     * @return {?}
     */
    NgswCommChannel.prototype.waitForStatus = /**
     * @param {?} nonce
     * @return {?}
     */
    function (nonce) {
        return this.eventsOfType('STATUS')
            .pipe(rxjs_operators.filter(function (event) { return event.nonce === nonce; }), rxjs_operators.take(1), rxjs_operators.map(function (event) {
            if (event.status) {
                return undefined;
            }
            throw new Error(/** @type {?} */ ((event.error)));
        }))
            .toPromise();
    };
    Object.defineProperty(NgswCommChannel.prototype, "isEnabled", {
        get: /**
         * @return {?}
         */
        function () { return !!this.serviceWorker; },
        enumerable: true,
        configurable: true
    });
    return NgswCommChannel;
}());

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
/**
 * Subscribe and listen to push notifications from the Service Worker.
 *
 * \@experimental
 */
var SwPush = /** @class */ (function () {
    function SwPush(sw) {
        this.sw = sw;
        this.subscriptionChanges = new rxjs.Subject();
        if (!sw.isEnabled) {
            this.messages = rxjs.NEVER;
            this.notificationClicks = rxjs.NEVER;
            this.subscription = rxjs.NEVER;
            return;
        }
        this.messages = this.sw.eventsOfType('PUSH').pipe(rxjs_operators.map(function (message) { return message.data; }));
        this.notificationClicks =
            this.sw.eventsOfType('NOTIFICATION_CLICK').pipe(rxjs_operators.map(function (message) { return message.data; }));
        this.pushManager = this.sw.registration.pipe(rxjs_operators.map(function (registration) { return registration.pushManager; }));
        /** @type {?} */
        var workerDrivenSubscriptions = this.pushManager.pipe(rxjs_operators.switchMap(function (pm) { return pm.getSubscription(); }));
        this.subscription = rxjs.merge(workerDrivenSubscriptions, this.subscriptionChanges);
    }
    Object.defineProperty(SwPush.prototype, "isEnabled", {
        /**
         * True if the Service Worker is enabled (supported by the browser and enabled via
         * `ServiceWorkerModule`).
         */
        get: /**
         * True if the Service Worker is enabled (supported by the browser and enabled via
         * `ServiceWorkerModule`).
         * @return {?}
         */
        function () { return this.sw.isEnabled; },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} options
     * @return {?}
     */
    SwPush.prototype.requestSubscription = /**
     * @param {?} options
     * @return {?}
     */
    function (options) {
        var _this = this;
        if (!this.sw.isEnabled) {
            return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
        }
        /** @type {?} */
        var pushOptions = { userVisibleOnly: true };
        /** @type {?} */
        var key = this.decodeBase64(options.serverPublicKey.replace(/_/g, '/').replace(/-/g, '+'));
        /** @type {?} */
        var applicationServerKey = new Uint8Array(new ArrayBuffer(key.length));
        for (var i = 0; i < key.length; i++) {
            applicationServerKey[i] = key.charCodeAt(i);
        }
        pushOptions.applicationServerKey = applicationServerKey;
        return this.pushManager.pipe(rxjs_operators.switchMap(function (pm) { return pm.subscribe(pushOptions); }), rxjs_operators.take(1))
            .toPromise()
            .then(function (sub) {
            _this.subscriptionChanges.next(sub);
            return sub;
        });
    };
    /**
     * @return {?}
     */
    SwPush.prototype.unsubscribe = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this.sw.isEnabled) {
            return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
        }
        /** @type {?} */
        var doUnsubscribe = function (sub) {
            if (sub === null) {
                throw new Error('Not subscribed to push notifications.');
            }
            return sub.unsubscribe().then(function (success) {
                if (!success) {
                    throw new Error('Unsubscribe failed!');
                }
                _this.subscriptionChanges.next(null);
            });
        };
        return this.subscription.pipe(rxjs_operators.take(1), rxjs_operators.switchMap(doUnsubscribe)).toPromise();
    };
    /**
     * @param {?} input
     * @return {?}
     */
    SwPush.prototype.decodeBase64 = /**
     * @param {?} input
     * @return {?}
     */
    function (input) { return atob(input); };
    SwPush.decorators = [
        { type: _angular_core.Injectable },
    ];
    /** @nocollapse */
    SwPush.ctorParameters = function () { return [
        { type: NgswCommChannel }
    ]; };
    return SwPush;
}());

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
/**
 * Subscribe to update notifications from the Service Worker, trigger update
 * checks, and forcibly activate updates.
 *
 * \@experimental
 */
var SwUpdate = /** @class */ (function () {
    function SwUpdate(sw) {
        this.sw = sw;
        if (!sw.isEnabled) {
            this.available = rxjs.NEVER;
            this.activated = rxjs.NEVER;
            return;
        }
        this.available = this.sw.eventsOfType('UPDATE_AVAILABLE');
        this.activated = this.sw.eventsOfType('UPDATE_ACTIVATED');
    }
    Object.defineProperty(SwUpdate.prototype, "isEnabled", {
        /**
         * True if the Service Worker is enabled (supported by the browser and enabled via
         * `ServiceWorkerModule`).
         */
        get: /**
         * True if the Service Worker is enabled (supported by the browser and enabled via
         * `ServiceWorkerModule`).
         * @return {?}
         */
        function () { return this.sw.isEnabled; },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    SwUpdate.prototype.checkForUpdate = /**
     * @return {?}
     */
    function () {
        if (!this.sw.isEnabled) {
            return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
        }
        /** @type {?} */
        var statusNonce = this.sw.generateNonce();
        return this.sw.postMessageWithStatus('CHECK_FOR_UPDATES', { statusNonce: statusNonce }, statusNonce);
    };
    /**
     * @return {?}
     */
    SwUpdate.prototype.activateUpdate = /**
     * @return {?}
     */
    function () {
        if (!this.sw.isEnabled) {
            return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
        }
        /** @type {?} */
        var statusNonce = this.sw.generateNonce();
        return this.sw.postMessageWithStatus('ACTIVATE_UPDATE', { statusNonce: statusNonce }, statusNonce);
    };
    SwUpdate.decorators = [
        { type: _angular_core.Injectable },
    ];
    /** @nocollapse */
    SwUpdate.ctorParameters = function () { return [
        { type: NgswCommChannel }
    ]; };
    return SwUpdate;
}());

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
/**
 * @abstract
 */
var RegistrationOptions = /** @class */ (function () {
    function RegistrationOptions() {
    }
    return RegistrationOptions;
}());
/** @type {?} */
var SCRIPT = new _angular_core.InjectionToken('NGSW_REGISTER_SCRIPT');
/**
 * @param {?} injector
 * @param {?} script
 * @param {?} options
 * @param {?} platformId
 * @return {?}
 */
function ngswAppInitializer(injector, script, options, platformId) {
    /** @type {?} */
    var initializer = function () {
        /** @type {?} */
        var app = injector.get(_angular_core.ApplicationRef);
        if (!(_angular_common.isPlatformBrowser(platformId) && ('serviceWorker' in navigator) &&
            options.enabled !== false)) {
            return;
        }
        /** @type {?} */
        var whenStable = app.isStable.pipe(rxjs_operators.filter(function (stable) { return !!stable; }), rxjs_operators.take(1)).toPromise();
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
/**
 * @param {?} opts
 * @param {?} platformId
 * @return {?}
 */
function ngswCommChannelFactory(opts, platformId) {
    return new NgswCommChannel(_angular_common.isPlatformBrowser(platformId) && opts.enabled !== false ? navigator.serviceWorker :
        undefined);
}
/**
 * \@experimental
 */
var ServiceWorkerModule = /** @class */ (function () {
    function ServiceWorkerModule() {
    }
    /**
     * Register the given Angular Service Worker script.
     *
     * If `enabled` is set to `false` in the given options, the module will behave as if service
     * workers are not supported by the browser, and the service worker will not be registered.
     */
    /**
     * Register the given Angular Service Worker script.
     *
     * If `enabled` is set to `false` in the given options, the module will behave as if service
     * workers are not supported by the browser, and the service worker will not be registered.
     * @param {?} script
     * @param {?=} opts
     * @return {?}
     */
    ServiceWorkerModule.register = /**
     * Register the given Angular Service Worker script.
     *
     * If `enabled` is set to `false` in the given options, the module will behave as if service
     * workers are not supported by the browser, and the service worker will not be registered.
     * @param {?} script
     * @param {?=} opts
     * @return {?}
     */
    function (script, opts) {
        if (opts === void 0) { opts = {}; }
        return {
            ngModule: ServiceWorkerModule,
            providers: [
                { provide: SCRIPT, useValue: script },
                { provide: RegistrationOptions, useValue: opts },
                {
                    provide: NgswCommChannel,
                    useFactory: ngswCommChannelFactory,
                    deps: [RegistrationOptions, _angular_core.PLATFORM_ID]
                },
                {
                    provide: _angular_core.APP_INITIALIZER,
                    useFactory: ngswAppInitializer,
                    deps: [_angular_core.Injector, SCRIPT, RegistrationOptions, _angular_core.PLATFORM_ID],
                    multi: true,
                },
            ],
        };
    };
    ServiceWorkerModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    providers: [SwPush, SwUpdate],
                },] },
    ];
    return ServiceWorkerModule;
}());

exports.ServiceWorkerModule = ServiceWorkerModule;
exports.SwPush = SwPush;
exports.SwUpdate = SwUpdate;
exports.ɵa = NgswCommChannel;
exports.ɵb = RegistrationOptions;
exports.ɵc = SCRIPT;
exports.ɵd = ngswAppInitializer;
exports.ɵe = ngswCommChannelFactory;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=service-worker.umd.js.map
