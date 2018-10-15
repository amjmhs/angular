"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
exports.ERR_SW_NOT_SUPPORTED = 'Service workers are disabled or not supported by this browser';
function errorObservable(message) {
    return rxjs_1.defer(function () { return rxjs_1.throwError(new Error(message)); });
}
/**
 * @experimental
 */
var NgswCommChannel = /** @class */ (function () {
    function NgswCommChannel(serviceWorker) {
        this.serviceWorker = serviceWorker;
        if (!serviceWorker) {
            this.worker = this.events = this.registration = errorObservable(exports.ERR_SW_NOT_SUPPORTED);
        }
        else {
            var controllerChangeEvents = rxjs_1.fromEvent(serviceWorker, 'controllerchange');
            var controllerChanges = controllerChangeEvents.pipe(operators_1.map(function () { return serviceWorker.controller; }));
            var currentController = rxjs_1.defer(function () { return rxjs_1.of(serviceWorker.controller); });
            var controllerWithChanges = rxjs_1.concat(currentController, controllerChanges);
            this.worker = controllerWithChanges.pipe(operators_1.filter(function (c) { return !!c; }));
            this.registration = (this.worker.pipe(operators_1.switchMap(function () { return serviceWorker.getRegistration(); })));
            var rawEvents = rxjs_1.fromEvent(serviceWorker, 'message');
            var rawEventPayload = rawEvents.pipe(operators_1.map(function (event) { return event.data; }));
            var eventsUnconnected = rawEventPayload.pipe(operators_1.filter(function (event) { return event && event.type; }));
            var events = eventsUnconnected.pipe(operators_1.publish());
            events.connect();
            this.events = events;
        }
    }
    NgswCommChannel.prototype.postMessage = function (action, payload) {
        return this.worker
            .pipe(operators_1.take(1), operators_1.tap(function (sw) {
            sw.postMessage(__assign({ action: action }, payload));
        }))
            .toPromise()
            .then(function () { return undefined; });
    };
    NgswCommChannel.prototype.postMessageWithStatus = function (type, payload, nonce) {
        var waitForStatus = this.waitForStatus(nonce);
        var postMessage = this.postMessage(type, payload);
        return Promise.all([waitForStatus, postMessage]).then(function () { return undefined; });
    };
    NgswCommChannel.prototype.generateNonce = function () { return Math.round(Math.random() * 10000000); };
    NgswCommChannel.prototype.eventsOfType = function (type) {
        var filterFn = function (event) { return event.type === type; };
        return this.events.pipe(operators_1.filter(filterFn));
    };
    NgswCommChannel.prototype.nextEventOfType = function (type) {
        return this.eventsOfType(type).pipe(operators_1.take(1));
    };
    NgswCommChannel.prototype.waitForStatus = function (nonce) {
        return this.eventsOfType('STATUS')
            .pipe(operators_1.filter(function (event) { return event.nonce === nonce; }), operators_1.take(1), operators_1.map(function (event) {
            if (event.status) {
                return undefined;
            }
            throw new Error(event.error);
        }))
            .toPromise();
    };
    Object.defineProperty(NgswCommChannel.prototype, "isEnabled", {
        get: function () { return !!this.serviceWorker; },
        enumerable: true,
        configurable: true
    });
    return NgswCommChannel;
}());
exports.NgswCommChannel = NgswCommChannel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG93X2xldmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL2xvd19sZXZlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7O0FBRUgsNkJBQWtHO0FBQ2xHLDRDQUEwRTtBQUU3RCxRQUFBLG9CQUFvQixHQUFHLCtEQUErRCxDQUFDO0FBNENwRyx5QkFBeUIsT0FBZTtJQUN0QyxPQUFPLFlBQUssQ0FBQyxjQUFNLE9BQUEsaUJBQVUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUE5QixDQUE4QixDQUFDLENBQUM7QUFDckQsQ0FBQztBQUVEOztHQUVHO0FBQ0g7SUFPRSx5QkFBb0IsYUFBK0M7UUFBL0Msa0JBQWEsR0FBYixhQUFhLENBQWtDO1FBQ2pFLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDbEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLEdBQUcsZUFBZSxDQUFDLDRCQUFvQixDQUFDLENBQUM7U0FDdkY7YUFBTTtZQUNMLElBQU0sc0JBQXNCLEdBQUcsZ0JBQVMsQ0FBQyxhQUFhLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztZQUM1RSxJQUFNLGlCQUFpQixHQUFHLHNCQUFzQixDQUFDLElBQUksQ0FBQyxlQUFHLENBQUMsY0FBTSxPQUFBLGFBQWEsQ0FBQyxVQUFVLEVBQXhCLENBQXdCLENBQUMsQ0FBQyxDQUFDO1lBQzNGLElBQU0saUJBQWlCLEdBQUcsWUFBSyxDQUFDLGNBQU0sT0FBQSxTQUFFLENBQUUsYUFBYSxDQUFDLFVBQVUsQ0FBQyxFQUE3QixDQUE2QixDQUFDLENBQUM7WUFDckUsSUFBTSxxQkFBcUIsR0FBRyxhQUFNLENBQUMsaUJBQWlCLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztZQUUzRSxJQUFJLENBQUMsTUFBTSxHQUFHLHFCQUFx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