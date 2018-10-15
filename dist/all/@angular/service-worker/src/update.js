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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var low_level_1 = require("./low_level");
/**
 * Subscribe to update notifications from the Service Worker, trigger update
 * checks, and forcibly activate updates.
 *
 * @experimental
 */
var SwUpdate = /** @class */ (function () {
    function SwUpdate(sw) {
        this.sw = sw;
        if (!sw.isEnabled) {
            this.available = rxjs_1.NEVER;
            this.activated = rxjs_1.NEVER;
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
        get: function () { return this.sw.isEnabled; },
        enumerable: true,
        configurable: true
    });
    SwUpdate.prototype.checkForUpdate = function () {
        if (!this.sw.isEnabled) {
            return Promise.reject(new Error(low_level_1.ERR_SW_NOT_SUPPORTED));
        }
        var statusNonce = this.sw.generateNonce();
        return this.sw.postMessageWithStatus('CHECK_FOR_UPDATES', { statusNonce: statusNonce }, statusNonce);
    };
    SwUpdate.prototype.activateUpdate = function () {
        if (!this.sw.isEnabled) {
            return Promise.reject(new Error(low_level_1.ERR_SW_NOT_SUPPORTED));
        }
        var statusNonce = this.sw.generateNonce();
        return this.sw.postMessageWithStatus('ACTIVATE_UPDATE', { statusNonce: statusNonce }, statusNonce);
    };
    SwUpdate = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [low_level_1.NgswCommChannel])
    ], SwUpdate);
    return SwUpdate;
}());
exports.SwUpdate = SwUpdate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL3VwZGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUVILHNDQUF5QztBQUN6Qyw2QkFBdUM7QUFFdkMseUNBQThHO0FBSTlHOzs7OztHQUtHO0FBRUg7SUFpQkUsa0JBQW9CLEVBQW1CO1FBQW5CLE9BQUUsR0FBRixFQUFFLENBQWlCO1FBQ3JDLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFO1lBQ2pCLElBQUksQ0FBQyxTQUFTLEdBQUcsWUFBSyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxTQUFTLEdBQUcsWUFBSyxDQUFDO1lBQ3ZCLE9BQU87U0FDUjtRQUNELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQXVCLGtCQUFrQixDQUFDLENBQUM7UUFDaEYsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBdUIsa0JBQWtCLENBQUMsQ0FBQztJQUNsRixDQUFDO0lBVkQsc0JBQUksK0JBQVM7UUFKYjs7O1dBR0c7YUFDSCxjQUEyQixPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFZdEQsaUNBQWMsR0FBZDtRQUNFLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRTtZQUN0QixPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsZ0NBQW9CLENBQUMsQ0FBQyxDQUFDO1NBQ3hEO1FBQ0QsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUM1QyxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMscUJBQXFCLENBQUMsbUJBQW1CLEVBQUUsRUFBQyxXQUFXLGFBQUEsRUFBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ3hGLENBQUM7SUFFRCxpQ0FBYyxHQUFkO1FBQ0UsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFO1lBQ3RCLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxnQ0FBb0IsQ0FBQyxDQUFDLENBQUM7U0FDeEQ7UUFDRCxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQzVDLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxpQkFBaUIsRUFBRSxFQUFDLFdBQVcsYUFBQSxFQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDdEYsQ0FBQztJQXpDVSxRQUFRO1FBRHBCLGlCQUFVLEVBQUU7eUNBa0JhLDJCQUFlO09BakI1QixRQUFRLENBMENwQjtJQUFELGVBQUM7Q0FBQSxBQTFDRCxJQTBDQztBQTFDWSw0QkFBUSJ9