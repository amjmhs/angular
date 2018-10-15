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
var core_1 = require("@angular/core");
var dom_tokens_1 = require("../dom/dom_tokens");
function escapeHtml(text) {
    var escapedText = {
        '&': '&a;',
        '"': '&q;',
        '\'': '&s;',
        '<': '&l;',
        '>': '&g;',
    };
    return text.replace(/[&"'<>]/g, function (s) { return escapedText[s]; });
}
exports.escapeHtml = escapeHtml;
function unescapeHtml(text) {
    var unescapedText = {
        '&a;': '&',
        '&q;': '"',
        '&s;': '\'',
        '&l;': '<',
        '&g;': '>',
    };
    return text.replace(/&[^;]+;/g, function (s) { return unescapedText[s]; });
}
exports.unescapeHtml = unescapeHtml;
/**
 * Create a `StateKey<T>` that can be used to store value of type T with `TransferState`.
 *
 * Example:
 *
 * ```
 * const COUNTER_KEY = makeStateKey<number>('counter');
 * let value = 10;
 *
 * transferState.set(COUNTER_KEY, value);
 * ```
 *
 * @experimental
 */
function makeStateKey(key) {
    return key;
}
exports.makeStateKey = makeStateKey;
/**
 * A key value store that is transferred from the application on the server side to the application
 * on the client side.
 *
 * `TransferState` will be available as an injectable token. To use it import
 * `ServerTransferStateModule` on the server and `BrowserTransferStateModule` on the client.
 *
 * The values in the store are serialized/deserialized using JSON.stringify/JSON.parse. So only
 * boolean, number, string, null and non-class objects will be serialized and deserialzied in a
 * non-lossy manner.
 *
 * @experimental
 */
var TransferState = /** @class */ (function () {
    function TransferState() {
        this.store = {};
        this.onSerializeCallbacks = {};
    }
    TransferState_1 = TransferState;
    /** @internal */
    TransferState.init = function (initState) {
        var transferState = new TransferState_1();
        transferState.store = initState;
        return transferState;
    };
    /**
     * Get the value corresponding to a key. Return `defaultValue` if key is not found.
     */
    TransferState.prototype.get = function (key, defaultValue) {
        return this.store[key] !== undefined ? this.store[key] : defaultValue;
    };
    /**
     * Set the value corresponding to a key.
     */
    TransferState.prototype.set = function (key, value) { this.store[key] = value; };
    /**
     * Remove a key from the store.
     */
    TransferState.prototype.remove = function (key) { delete this.store[key]; };
    /**
     * Test whether a key exists in the store.
     */
    TransferState.prototype.hasKey = function (key) { return this.store.hasOwnProperty(key); };
    /**
     * Register a callback to provide the value for a key when `toJson` is called.
     */
    TransferState.prototype.onSerialize = function (key, callback) {
        this.onSerializeCallbacks[key] = callback;
    };
    /**
     * Serialize the current state of the store to JSON.
     */
    TransferState.prototype.toJson = function () {
        // Call the onSerialize callbacks and put those values into the store.
        for (var key in this.onSerializeCallbacks) {
            if (this.onSerializeCallbacks.hasOwnProperty(key)) {
                try {
                    this.store[key] = this.onSerializeCallbacks[key]();
                }
                catch (e) {
                    console.warn('Exception in onSerialize callback: ', e);
                }
            }
        }
        return JSON.stringify(this.store);
    };
    var TransferState_1;
    TransferState = TransferState_1 = __decorate([
        core_1.Injectable()
    ], TransferState);
    return TransferState;
}());
exports.TransferState = TransferState;
function initTransferState(doc, appId) {
    // Locate the script tag with the JSON data transferred from the server.
    // The id of the script tag is set to the Angular appId + 'state'.
    var script = doc.getElementById(appId + '-state');
    var initialState = {};
    if (script && script.textContent) {
        try {
            initialState = JSON.parse(unescapeHtml(script.textContent));
        }
        catch (e) {
            console.warn('Exception while restoring TransferState for app ' + appId, e);
        }
    }
    return TransferState.init(initialState);
}
exports.initTransferState = initTransferState;
/**
 * NgModule to install on the client side while using the `TransferState` to transfer state from
 * server to client.
 *
 * @experimental
 */
var BrowserTransferStateModule = /** @class */ (function () {
    function BrowserTransferStateModule() {
    }
    BrowserTransferStateModule = __decorate([
        core_1.NgModule({
            providers: [{ provide: TransferState, useFactory: initTransferState, deps: [dom_tokens_1.DOCUMENT, core_1.APP_ID] }],
        })
    ], BrowserTransferStateModule);
    return BrowserTransferStateModule;
}());
exports.BrowserTransferStateModule = BrowserTransferStateModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmZXJfc3RhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyL3NyYy9icm93c2VyL3RyYW5zZmVyX3N0YXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsc0NBQTJEO0FBQzNELGdEQUEyQztBQUUzQyxvQkFBMkIsSUFBWTtJQUNyQyxJQUFNLFdBQVcsR0FBMEI7UUFDekMsR0FBRyxFQUFFLEtBQUs7UUFDVixHQUFHLEVBQUUsS0FBSztRQUNWLElBQUksRUFBRSxLQUFLO1FBQ1gsR0FBRyxFQUFFLEtBQUs7UUFDVixHQUFHLEVBQUUsS0FBSztLQUNYLENBQUM7SUFDRixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFkLENBQWMsQ0FBQyxDQUFDO0FBQ3ZELENBQUM7QUFURCxnQ0FTQztBQUVELHNCQUE2QixJQUFZO0lBQ3ZDLElBQU0sYUFBYSxHQUEwQjtRQUMzQyxLQUFLLEVBQUUsR0FBRztRQUNWLEtBQUssRUFBRSxHQUFHO1FBQ1YsS0FBSyxFQUFFLElBQUk7UUFDWCxLQUFLLEVBQUUsR0FBRztRQUNWLEtBQUssRUFBRSxHQUFHO0tBQ1gsQ0FBQztJQUNGLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxhQUFhLENBQUMsQ0FBQyxDQUFDLEVBQWhCLENBQWdCLENBQUMsQ0FBQztBQUN6RCxDQUFDO0FBVEQsb0NBU0M7QUFrQkQ7Ozs7Ozs7Ozs7Ozs7R0FhRztBQUNILHNCQUF1QyxHQUFXO0lBQ2hELE9BQU8sR0FBa0IsQ0FBQztBQUM1QixDQUFDO0FBRkQsb0NBRUM7QUFFRDs7Ozs7Ozs7Ozs7O0dBWUc7QUFFSDtJQURBO1FBRVUsVUFBSyxHQUFrQyxFQUFFLENB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