"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var browser_1 = require("./browser");
exports.BrowserModule = browser_1.BrowserModule;
exports.platformBrowser = browser_1.platformBrowser;
var meta_1 = require("./browser/meta");
exports.Meta = meta_1.Meta;
var title_1 = require("./browser/title");
exports.Title = title_1.Title;
var tools_1 = require("./browser/tools/tools");
exports.disableDebugTools = tools_1.disableDebugTools;
exports.enableDebugTools = tools_1.enableDebugTools;
var transfer_state_1 = require("./browser/transfer_state");
exports.BrowserTransferStateModule = transfer_state_1.BrowserTransferStateModule;
exports.TransferState = transfer_state_1.TransferState;
exports.makeStateKey = transfer_state_1.makeStateKey;
var by_1 = require("./dom/debug/by");
exports.By = by_1.By;
var dom_tokens_1 = require("./dom/dom_tokens");
exports.DOCUMENT = dom_tokens_1.DOCUMENT;
var event_manager_1 = require("./dom/events/event_manager");
exports.EVENT_MANAGER_PLUGINS = event_manager_1.EVENT_MANAGER_PLUGINS;
exports.EventManager = event_manager_1.EventManager;
var hammer_gestures_1 = require("./dom/events/hammer_gestures");
exports.HAMMER_GESTURE_CONFIG = hammer_gestures_1.HAMMER_GESTURE_CONFIG;
exports.HAMMER_LOADER = hammer_gestures_1.HAMMER_LOADER;
exports.HammerGestureConfig = hammer_gestures_1.HammerGestureConfig;
var dom_sanitization_service_1 = require("./security/dom_sanitization_service");
exports.DomSanitizer = dom_sanitization_service_1.DomSanitizer;
__export(require("./private_export"));
var version_1 = require("./version");
exports.VERSION = version_1.VERSION;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm0tYnJvd3Nlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLWJyb3dzZXIvc3JjL3BsYXRmb3JtLWJyb3dzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7QUFFSCxxQ0FBeUQ7QUFBakQsa0NBQUEsYUFBYSxDQUFBO0FBQUUsb0NBQUEsZUFBZSxDQUFBO0FBQ3RDLHVDQUFvRDtBQUE1QyxzQkFBQSxJQUFJLENBQUE7QUFDWix5Q0FBc0M7QUFBOUIsd0JBQUEsS0FBSyxDQUFBO0FBQ2IsK0NBQTBFO0FBQWxFLG9DQUFBLGlCQUFpQixDQUFBO0FBQUUsbUNBQUEsZ0JBQWdCLENBQUE7QUFDM0MsMkRBQTJHO0FBQW5HLHNEQUFBLDBCQUEwQixDQUFBO0FBQVkseUNBQUEsYUFBYSxDQUFBO0FBQUUsd0NBQUEsWUFBWSxDQUFBO0FBQ3pFLHFDQUFrQztBQUExQixrQkFBQSxFQUFFLENBQUE7QUFDViwrQ0FBMEM7QUFBbEMsZ0NBQUEsUUFBUSxDQUFBO0FBQ2hCLDREQUErRTtBQUF2RSxnREFBQSxxQkFBcUIsQ0FBQTtBQUFFLHVDQUFBLFlBQVksQ0FBQTtBQUMzQyxnRUFBcUg7QUFBN0csa0RBQUEscUJBQXFCLENBQUE7QUFBRSwwQ0FBQSxhQUFhLENBQUE7QUFBRSxnREFBQSxtQkFBbUIsQ0FBQTtBQUNqRSxnRkFBdUk7QUFBL0gsa0RBQUEsWUFBWSxDQUFBO0FBRXBCLHNDQUFpQztBQUNqQyxxQ0FBa0M7QUFBMUIsNEJBQUEsT0FBTyxDQUFBIn0=