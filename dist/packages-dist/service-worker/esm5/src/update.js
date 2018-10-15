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
import { Injectable } from '@angular/core';
import { NEVER } from 'rxjs';
import { ERR_SW_NOT_SUPPORTED, NgswCommChannel } from './low_level';
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
            this.available = NEVER;
            this.activated = NEVER;
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
        { type: Injectable },
    ];
    /** @nocollapse */
    SwUpdate.ctorParameters = function () { return [
        { type: NgswCommChannel }
    ]; };
    return SwUpdate;
}());
export { SwUpdate };
if (false) {
    /**
     * Emits an `UpdateAvailableEvent` event whenever a new app version is available.
     * @type {?}
     */
    SwUpdate.prototype.available;
    /**
     * Emits an `UpdateActivatedEvent` event whenever the app has been updated to a new version.
     * @type {?}
     */
    SwUpdate.prototype.activated;
    /** @type {?} */
    SwUpdate.prototype.sw;
}
//# sourceMappingURL=update.js.map