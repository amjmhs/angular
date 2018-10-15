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
import { concat, defer, fromEvent, of, throwError } from 'rxjs';
import { filter, map, publish, switchMap, take, tap } from 'rxjs/operators';
/** @type {?} */
export const ERR_SW_NOT_SUPPORTED = 'Service workers are disabled or not supported by this browser';
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
    return defer(() => throwError(new Error(message)));
}
/**
 * \@experimental
 */
export class NgswCommChannel {
    /**
     * @param {?} serviceWorker
     */
    constructor(serviceWorker) {
        this.serviceWorker = serviceWorker;
        if (!serviceWorker) {
            this.worker = this.events = this.registration = errorObservable(ERR_SW_NOT_SUPPORTED);
        }
        else {
            /** @type {?} */
            const controllerChangeEvents = fromEvent(serviceWorker, 'controllerchange');
            /** @type {?} */
            const controllerChanges = controllerChangeEvents.pipe(map(() => serviceWorker.controller));
            /** @type {?} */
            const currentController = defer(() => of(serviceWorker.controller));
            /** @type {?} */
            const controllerWithChanges = concat(currentController, controllerChanges);
            this.worker = controllerWithChanges.pipe(filter(c => !!c));
            this.registration = /** @type {?} */ ((this.worker.pipe(switchMap(() => serviceWorker.getRegistration()))));
            /** @type {?} */
            const rawEvents = fromEvent(serviceWorker, 'message');
            /** @type {?} */
            const rawEventPayload = rawEvents.pipe(map(event => event.data));
            /** @type {?} */
            const eventsUnconnected = rawEventPayload.pipe(filter(event => event && event.type));
            /** @type {?} */
            const events = /** @type {?} */ (eventsUnconnected.pipe(publish()));
            events.connect();
            this.events = events;
        }
    }
    /**
     * @param {?} action
     * @param {?} payload
     * @return {?}
     */
    postMessage(action, payload) {
        return this.worker
            .pipe(take(1), tap((sw) => {
            sw.postMessage(Object.assign({ action }, payload));
        }))
            .toPromise()
            .then(() => undefined);
    }
    /**
     * @param {?} type
     * @param {?} payload
     * @param {?} nonce
     * @return {?}
     */
    postMessageWithStatus(type, payload, nonce) {
        /** @type {?} */
        const waitForStatus = this.waitForStatus(nonce);
        /** @type {?} */
        const postMessage = this.postMessage(type, payload);
        return Promise.all([waitForStatus, postMessage]).then(() => undefined);
    }
    /**
     * @return {?}
     */
    generateNonce() { return Math.round(Math.random() * 10000000); }
    /**
     * @template T
     * @param {?} type
     * @return {?}
     */
    eventsOfType(type) {
        /** @type {?} */
        const filterFn = (event) => event.type === type;
        return this.events.pipe(filter(filterFn));
    }
    /**
     * @template T
     * @param {?} type
     * @return {?}
     */
    nextEventOfType(type) {
        return this.eventsOfType(type).pipe(take(1));
    }
    /**
     * @param {?} nonce
     * @return {?}
     */
    waitForStatus(nonce) {
        return this.eventsOfType('STATUS')
            .pipe(filter(event => event.nonce === nonce), take(1), map(event => {
            if (event.status) {
                return undefined;
            }
            throw new Error(/** @type {?} */ ((event.error)));
        }))
            .toPromise();
    }
    /**
     * @return {?}
     */
    get isEnabled() { return !!this.serviceWorker; }
}
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