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
import * as tslib_1 from "tslib";
import { concat, defer, fromEvent, of, throwError } from 'rxjs';
import { filter, map, publish, switchMap, take, tap } from 'rxjs/operators';
/** @type {?} */
export var ERR_SW_NOT_SUPPORTED = 'Service workers are disabled or not supported by this browser';
/**
 * An event emitted when a new version of the app is available.
 *
 * \@experimental
 * @record
 */
export function UpdateAvailableEvent() { }
/** @type {?} */
UpdateAvailableEvent.prototype.type;
/** @type {?} */
UpdateAvailableEvent.prototype.current;
/** @type {?} */
UpdateAvailableEvent.prototype.available;
/**
 * An event emitted when a new version of the app has been downloaded and activated.
 *
 * \@experimental
 * @record
 */
export function UpdateActivatedEvent() { }
/** @type {?} */
UpdateActivatedEvent.prototype.type;
/** @type {?|undefined} */
UpdateActivatedEvent.prototype.previous;
/** @type {?} */
UpdateActivatedEvent.prototype.current;
/**
 * An event emitted when a `PushEvent` is received by the service worker.
 * @record
 */
export function PushEvent() { }
/** @type {?} */
PushEvent.prototype.type;
/** @type {?} */
PushEvent.prototype.data;
/** @typedef {?} */
var IncomingEvent;
export { IncomingEvent };
/**
 * @record
 */
export function TypedEvent() { }
/** @type {?} */
TypedEvent.prototype.type;
/**
 * @record
 */
function StatusEvent() { }
/** @type {?} */
StatusEvent.prototype.type;
/** @type {?} */
StatusEvent.prototype.nonce;
/** @type {?} */
StatusEvent.prototype.status;
/** @type {?|undefined} */
StatusEvent.prototype.error;
/**
 * @param {?} message
 * @return {?}
 */
function errorObservable(message) {
    return defer(function () { return throwError(new Error(message)); });
}
/**
 * \@experimental
 */
var /**
 * \@experimental
 */
NgswCommChannel = /** @class */ (function () {
    function NgswCommChannel(serviceWorker) {
        this.serviceWorker = serviceWorker;
        if (!serviceWorker) {
            this.worker = this.events = this.registration = errorObservable(ERR_SW_NOT_SUPPORTED);
        }
        else {
            /** @type {?} */
            var controllerChangeEvents = fromEvent(serviceWorker, 'controllerchange');
            /** @type {?} */
            var controllerChanges = controllerChangeEvents.pipe(map(function () { return serviceWorker.controller; }));
            /** @type {?} */
            var currentController = defer(function () { return of(serviceWorker.controller); });
            /** @type {?} */
            var controllerWithChanges = concat(currentController, controllerChanges);
            this.worker = controllerWithChanges.pipe(filter(function (c) { return !!c; }));
            this.registration = /** @type {?} */ ((this.worker.pipe(switchMap(function () { return serviceWorker.getRegistration(); }))));
            /** @type {?} */
            var rawEvents = fromEvent(serviceWorker, 'message');
            /** @type {?} */
            var rawEventPayload = rawEvents.pipe(map(function (event) { return event.data; }));
            /** @type {?} */
            var eventsUnconnected = rawEventPayload.pipe(filter(function (event) { return event && event.type; }));
            /** @type {?} */
            var events = /** @type {?} */ (eventsUnconnected.pipe(publish()));
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
            .pipe(take(1), tap(function (sw) {
            sw.postMessage(tslib_1.__assign({ action: action }, payload));
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
        return this.events.pipe(filter(filterFn));
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
        return this.eventsOfType(type).pipe(take(1));
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
            .pipe(filter(function (event) { return event.nonce === nonce; }), take(1), map(function (event) {
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
 * \@experimental
 */
export { NgswCommChannel };
if (false) {
    /** @type {?} */
    NgswCommChannel.prototype.worker;
    /** @type {?} */
    NgswCommChannel.prototype.registration;
    /** @type {?} */
    NgswCommChannel.prototype.events;
    /** @type {?} */
    NgswCommChannel.prototype.serviceWorker;
}
//# sourceMappingURL=low_level.js.map