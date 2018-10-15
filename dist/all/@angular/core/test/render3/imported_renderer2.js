"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var browser_1 = require("@angular/animations/browser");
var testing_1 = require("@angular/animations/browser/testing");
var platform_browser_1 = require("@angular/platform-browser");
var animations_1 = require("@angular/platform-browser/animations");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var event_manager_1 = require("@angular/platform-browser/src/dom/events/event_manager");
var ng_zone_1 = require("../../src/zone/ng_zone");
var SimpleDomEventsPlugin = /** @class */ (function (_super) {
    __extends(SimpleDomEventsPlugin, _super);
    function SimpleDomEventsPlugin(doc) {
        return _super.call(this, doc) || this;
    }
    SimpleDomEventsPlugin.prototype.supports = function (eventName) { return true; };
    SimpleDomEventsPlugin.prototype.addEventListener = function (element, eventName, handler) {
        var _this = this;
        var callback = handler;
        element.addEventListener(eventName, callback, false);
        return function () { return _this.removeEventListener(element, eventName, callback); };
    };
    SimpleDomEventsPlugin.prototype.removeEventListener = function (target, eventName, callback) {
        return target.removeEventListener.apply(target, [eventName, callback, false]);
    };
    return SimpleDomEventsPlugin;
}(event_manager_1.EventManagerPlugin));
exports.SimpleDomEventsPlugin = SimpleDomEventsPlugin;
function getRendererFactory2(document) {
    var fakeNgZone = new ng_zone_1.NoopNgZone();
    var eventManager = new platform_browser_1.EventManager([new SimpleDomEventsPlugin(document)], fakeNgZone);
    var rendererFactory = new platform_browser_1.ɵDomRendererFactory2(eventManager, new platform_browser_1.ɵDomSharedStylesHost(document));
    var origCreateRenderer = rendererFactory.createRenderer;
    rendererFactory.createRenderer = function () {
        var renderer = origCreateRenderer.apply(this, arguments);
        renderer.destroyNode = function () { };
        return renderer;
    };
    return rendererFactory;
}
exports.getRendererFactory2 = getRendererFactory2;
function getAnimationRendererFactory2(document) {
    var fakeNgZone = new ng_zone_1.NoopNgZone();
    return new animations_1.ɵAnimationRendererFactory(getRendererFactory2(document), new browser_1.ɵAnimationEngine(document.body, new testing_1.MockAnimationDriver(), new browser_1.ɵNoopAnimationStyleNormalizer()), fakeNgZone);
}
exports.getAnimationRendererFactory2 = getAnimationRendererFactory2;
// TODO: code duplicated from ../linker/change_detection_integration_spec.ts, to be removed
// START duplicated code
var RenderLog = /** @class */ (function () {
    function RenderLog() {
        this.log = [];
        this.loggedValues = [];
    }
    RenderLog.prototype.setElementProperty = function (el, propName, propValue) {
        this.log.push(propName + "=" + propValue);
        this.loggedValues.push(propValue);
    };
    RenderLog.prototype.setText = function (node, value) {
        this.log.push("{{" + value + "}}");
        this.loggedValues.push(value);
    };
    RenderLog.prototype.clear = function () {
        this.log = [];
        this.loggedValues = [];
    };
    return RenderLog;
}());
exports.RenderLog = RenderLog;
/**
 * This function patches the DomRendererFactory2 so that it returns a DefaultDomRenderer2
 * which logs some of the DOM operations through a RenderLog instance.
 */
function patchLoggingRenderer2(rendererFactory, log) {
    if (rendererFactory.__patchedForLogging) {
        return;
    }
    rendererFactory.__patchedForLogging = true;
    var origCreateRenderer = rendererFactory.createRenderer;
    rendererFactory.createRenderer = function () {
        var renderer = origCreateRenderer.apply(this, arguments);
        if (renderer.__patchedForLogging) {
            return renderer;
        }
        renderer.__patchedForLogging = true;
        var origSetProperty = renderer.setProperty;
        var origSetValue = renderer.setValue;
        renderer.setProperty = function (el, name, value) {
            log.setElementProperty(el, name, value);
            origSetProperty.call(renderer, el, name, value);
        };
        renderer.setValue = function (node, value) {
            if (dom_adapter_1.getDOM().isTextNode(node)) {
                log.setText(node, value);
            }
            origSetValue.call(renderer, node, value);
        };
        return renderer;
    };
}
exports.patchLoggingRenderer2 = patchLoggingRenderer2;
// END duplicated code
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0ZWRfcmVuZGVyZXIyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L3JlbmRlcjMvaW1wb3J0ZWRfcmVuZGVyZXIyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztBQUVILHVEQUE0RjtBQUM1RiwrREFBd0U7QUFFeEUsOERBQW1HO0FBQ25HLG1FQUErRTtBQUMvRSw2RUFBcUU7QUFDckUsd0ZBQTBGO0FBRTFGLGtEQUFrRDtBQUVsRDtJQUEyQyx5Q0FBa0I7SUFDM0QsK0JBQVksR0FBUTtlQUFJLGtCQUFNLEdBQUcsQ0FBQztJQUFFLENBQUM7SUFFckMsd0NBQVEsR0FBUixVQUFTLFNBQWlCLElBQWEsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBRXJELGdEQUFnQixHQUFoQixVQUFpQixPQUFvQixFQUFFLFNBQWlCLEVBQUUsT0FBaUI7UUFBM0UsaUJBSUM7UUFIQyxJQUFJLFFBQVEsR0FBa0IsT0FBd0IsQ0FBQztRQUN2RCxPQUFPLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNyRCxPQUFPLGNBQU0sT0FBQSxLQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLENBQUMsRUFBdEQsQ0FBc0QsQ0FBQztJQUN0RSxDQUFDO0lBRUQsbURBQW1CLEdBQW5CLFVBQW9CLE1BQVcsRUFBRSxTQUFpQixFQUFFLFFBQWtCO1FBQ3BFLE9BQU8sTUFBTSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDaEYsQ0FBQztJQUNILDRCQUFDO0FBQUQsQ0FBQyxBQWRELENBQTJDLGtDQUFrQixHQWM1RDtBQWRZLHNEQUFxQjtBQWdCbEMsNkJBQW9DLFFB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