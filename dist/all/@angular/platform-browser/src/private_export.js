"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var browser_1 = require("./browser");
exports.ɵBROWSER_SANITIZATION_PROVIDERS = browser_1.BROWSER_SANITIZATION_PROVIDERS;
exports.ɵINTERNAL_BROWSER_PLATFORM_PROVIDERS = browser_1.INTERNAL_BROWSER_PLATFORM_PROVIDERS;
exports.ɵinitDomAdapter = browser_1.initDomAdapter;
var browser_adapter_1 = require("./browser/browser_adapter");
exports.ɵBrowserDomAdapter = browser_adapter_1.BrowserDomAdapter;
var browser_platform_location_1 = require("./browser/location/browser_platform_location");
exports.ɵBrowserPlatformLocation = browser_platform_location_1.BrowserPlatformLocation;
var server_transition_1 = require("./browser/server-transition");
exports.ɵTRANSITION_ID = server_transition_1.TRANSITION_ID;
var testability_1 = require("./browser/testability");
exports.ɵBrowserGetTestability = testability_1.BrowserGetTestability;
var transfer_state_1 = require("./browser/transfer_state");
exports.ɵescapeHtml = transfer_state_1.escapeHtml;
var ng_probe_1 = require("./dom/debug/ng_probe");
exports.ɵELEMENT_PROBE_PROVIDERS = ng_probe_1.ELEMENT_PROBE_PROVIDERS;
var dom_adapter_1 = require("./dom/dom_adapter");
exports.ɵDomAdapter = dom_adapter_1.DomAdapter;
exports.ɵgetDOM = dom_adapter_1.getDOM;
exports.ɵsetRootDomAdapter = dom_adapter_1.setRootDomAdapter;
var dom_renderer_1 = require("./dom/dom_renderer");
exports.ɵDomRendererFactory2 = dom_renderer_1.DomRendererFactory2;
exports.ɵNAMESPACE_URIS = dom_renderer_1.NAMESPACE_URIS;
exports.ɵflattenStyles = dom_renderer_1.flattenStyles;
exports.ɵshimContentAttribute = dom_renderer_1.shimContentAttribute;
exports.ɵshimHostAttribute = dom_renderer_1.shimHostAttribute;
var dom_events_1 = require("./dom/events/dom_events");
exports.ɵDomEventsPlugin = dom_events_1.DomEventsPlugin;
var hammer_gestures_1 = require("./dom/events/hammer_gestures");
exports.ɵHammerGesturesPlugin = hammer_gestures_1.HammerGesturesPlugin;
var key_events_1 = require("./dom/events/key_events");
exports.ɵKeyEventsPlugin = key_events_1.KeyEventsPlugin;
var shared_styles_host_1 = require("./dom/shared_styles_host");
exports.ɵDomSharedStylesHost = shared_styles_host_1.DomSharedStylesHost;
exports.ɵSharedStylesHost = shared_styles_host_1.SharedStylesHost;
var dom_sanitization_service_1 = require("./security/dom_sanitization_service");
exports.ɵDomSanitizerImpl = dom_sanitization_service_1.DomSanitizerImpl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpdmF0ZV9leHBvcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyL3NyYy9wcml2YXRlX2V4cG9ydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHFDQUE0TTtBQUFwTSxvREFBQSw4QkFBOEIsQ0FBbUM7QUFBRSx5REFBQSxtQ0FBbUMsQ0FBd0M7QUFBRSxvQ0FBQSxjQUFjLENBQW1CO0FBQ3pMLDZEQUFrRjtBQUExRSwrQ0FBQSxpQkFBaUIsQ0FBc0I7QUFDL0MsMEZBQWlIO0FBQXpHLCtEQUFBLHVCQUF1QixDQUE0QjtBQUMzRCxpRUFBNEU7QUFBcEUsNkNBQUEsYUFBYSxDQUFrQjtBQUN2QyxxREFBc0Y7QUFBOUUsK0NBQUEscUJBQXFCLENBQTBCO0FBQ3ZELDJEQUFtRTtBQUEzRCx1Q0FBQSxVQUFVLENBQWU7QUFDakMsaURBQXlGO0FBQWpGLDhDQUFBLHVCQUF1QixDQUE0QjtBQUMzRCxpREFBd0g7QUFBaEgsb0NBQUEsVUFBVSxDQUFlO0FBQUUsZ0NBQUEsTUFBTSxDQUFXO0FBQUUsMkNBQUEsaUJBQWlCLENBQXNCO0FBQzdGLG1EQUEyTztBQUFuTyw4Q0FBQSxtQkFBbUIsQ0FBd0I7QUFBRSx5Q0FBQSxjQUFjLENBQW1CO0FBQUUsd0NBQUEsYUFBYSxDQUFrQjtBQUFFLCtDQUFBLG9CQUFvQixDQUF5QjtBQUFFLDRDQUFBLGlCQUFpQixDQUFzQjtBQUMvTSxzREFBNEU7QUFBcEUsd0NBQUEsZUFBZSxDQUFvQjtBQUMzQyxnRUFBMkY7QUFBbkYsa0RBQUEsb0JBQW9CLENBQXlCO0FBQ3JELHNEQUE0RTtBQUFwRSx3Q0FBQSxlQUFlLENBQW9CO0FBQzNDLCtEQUE0SDtBQUFwSCxvREFBQSxtQkFBbUIsQ0FBd0I7QUFBRSxpREFBQSxnQkFBZ0IsQ0FBcUI7QUFDMUYsZ0ZBQTBGO0FBQWxGLHVEQUFBLGdCQUFnQixDQUFxQiJ9