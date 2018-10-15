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
import { Inject, Injectable, InjectionToken, Optional, ɵConsole as Console } from '@angular/core';
import { DOCUMENT } from '../dom_tokens';
import { EventManagerPlugin } from './event_manager';
/** *
 * Supported HammerJS recognizer event names.
  @type {?} */
var EVENT_NAMES = {
    // pan
    'pan': true,
    'panstart': true,
    'panmove': true,
    'panend': true,
    'pancancel': true,
    'panleft': true,
    'panright': true,
    'panup': true,
    'pandown': true,
    // pinch
    'pinch': true,
    'pinchstart': true,
    'pinchmove': true,
    'pinchend': true,
    'pinchcancel': true,
    'pinchin': true,
    'pinchout': true,
    // press
    'press': true,
    'pressup': true,
    // rotate
    'rotate': true,
    'rotatestart': true,
    'rotatemove': true,
    'rotateend': true,
    'rotatecancel': true,
    // swipe
    'swipe': true,
    'swipeleft': true,
    'swiperight': true,
    'swipeup': true,
    'swipedown': true,
    // tap
    'tap': true,
};
/** *
 * DI token for providing [HammerJS](http://hammerjs.github.io/) support to Angular.
 * @see `HammerGestureConfig`
 *
 * \@experimental
  @type {?} */
export var HAMMER_GESTURE_CONFIG = new InjectionToken('HammerGestureConfig');
/** @typedef {?} */
var HammerLoader;
export { HammerLoader };
/** *
 * Injection token used to provide a {\@link HammerLoader} to Angular.
  @type {?} */
export var HAMMER_LOADER = new InjectionToken('HammerLoader');
/**
 * @record
 */
export function HammerInstance() { }
/** @type {?} */
HammerInstance.prototype.on;
/** @type {?} */
HammerInstance.prototype.off;
/** @type {?|undefined} */
HammerInstance.prototype.destroy;
/**
 * An injectable [HammerJS Manager](http://hammerjs.github.io/api/#hammer.manager)
 * for gesture recognition. Configures specific event recognition.
 * \@experimental
 */
var HammerGestureConfig = /** @class */ (function () {
    function HammerGestureConfig() {
        /**
         * A set of supported event names for gestures to be used in Angular.
         * Angular supports all built-in recognizers, as listed in
         * [HammerJS documentation](http://hammerjs.github.io/).
         */
        this.events = [];
        /**
         * Maps gesture event names to a set of configuration options
         * that specify overrides to the default values for specific properties.
         *
         * The key is a supported event name to be configured,
         * and the options object contains a set of properties, with override values
         * to be applied to the named recognizer event.
         * For example, to disable recognition of the rotate event, specify
         *  `{"rotate": {"enable": false}}`.
         *
         * Properties that are not present take the HammerJS default values.
         * For information about which properties are supported for which events,
         * and their allowed and default values, see
         * [HammerJS documentation](http://hammerjs.github.io/).
         *
         */
        this.overrides = {};
    }
    /**
     * Creates a [HammerJS Manager](http://hammerjs.github.io/api/#hammer.manager)
     * and attaches it to a given HTML element.
     * @param element The element that will recognize gestures.
     * @returns A HammerJS event-manager object.
     */
    /**
     * Creates a [HammerJS Manager](http://hammerjs.github.io/api/#hammer.manager)
     * and attaches it to a given HTML element.
     * @param {?} element The element that will recognize gestures.
     * @return {?} A HammerJS event-manager object.
     */
    HammerGestureConfig.prototype.buildHammer = /**
     * Creates a [HammerJS Manager](http://hammerjs.github.io/api/#hammer.manager)
     * and attaches it to a given HTML element.
     * @param {?} element The element that will recognize gestures.
     * @return {?} A HammerJS event-manager object.
     */
    function (element) {
        /** @type {?} */
        var mc = new /** @type {?} */ ((Hammer))(element, this.options);
        mc.get('pinch').set({ enable: true });
        mc.get('rotate').set({ enable: true });
        for (var eventName in this.overrides) {
            mc.get(eventName).set(this.overrides[eventName]);
        }
        return mc;
    };
    HammerGestureConfig.decorators = [
        { type: Injectable },
    ];
    return HammerGestureConfig;
}());
export { HammerGestureConfig };
if (false) {
    /**
     * A set of supported event names for gestures to be used in Angular.
     * Angular supports all built-in recognizers, as listed in
     * [HammerJS documentation](http://hammerjs.github.io/).
     * @type {?}
     */
    HammerGestureConfig.prototype.events;
    /**
     * Maps gesture event names to a set of configuration options
     * that specify overrides to the default values for specific properties.
     *
     * The key is a supported event name to be configured,
     * and the options object contains a set of properties, with override values
     * to be applied to the named recognizer event.
     * For example, to disable recognition of the rotate event, specify
     *  `{"rotate": {"enable": false}}`.
     *
     * Properties that are not present take the HammerJS default values.
     * For information about which properties are supported for which events,
     * and their allowed and default values, see
     * [HammerJS documentation](http://hammerjs.github.io/).
     *
     * @type {?}
     */
    HammerGestureConfig.prototype.overrides;
    /**
     * Properties whose default values can be overridden for a given event.
     * Different sets of properties apply to different events.
     * For information about which properties are supported for which events,
     * and their allowed and default values, see
     * [HammerJS documentation](http://hammerjs.github.io/).
     * @type {?}
     */
    HammerGestureConfig.prototype.options;
}
var HammerGesturesPlugin = /** @class */ (function (_super) {
    tslib_1.__extends(HammerGesturesPlugin, _super);
    function HammerGesturesPlugin(doc, _config, console, loader) {
        var _this = _super.call(this, doc) || this;
        _this._config = _config;
        _this.console = console;
        _this.loader = loader;
        return _this;
    }
    /**
     * @param {?} eventName
     * @return {?}
     */
    HammerGesturesPlugin.prototype.supports = /**
     * @param {?} eventName
     * @return {?}
     */
    function (eventName) {
        if (!EVENT_NAMES.hasOwnProperty(eventName.toLowerCase()) && !this.isCustomEvent(eventName)) {
            return false;
        }
        if (!(/** @type {?} */ (window)).Hammer && !this.loader) {
            this.console.warn("The \"" + eventName + "\" event cannot be bound because Hammer.JS is not " +
                "loaded and no custom loader has been specified.");
            return false;
        }
        return true;
    };
    /**
     * @param {?} element
     * @param {?} eventName
     * @param {?} handler
     * @return {?}
     */
    HammerGesturesPlugin.prototype.addEventListener = /**
     * @param {?} element
     * @param {?} eventName
     * @param {?} handler
     * @return {?}
     */
    function (element, eventName, handler) {
        var _this = this;
        /** @type {?} */
        var zone = this.manager.getZone();
        eventName = eventName.toLowerCase();
        // If Hammer is not present but a loader is specified, we defer adding the event listener
        // until Hammer is loaded.
        if (!(/** @type {?} */ (window)).Hammer && this.loader) {
            /** @type {?} */
            var cancelRegistration_1 = false;
            /** @type {?} */
            var deregister_1 = function () { cancelRegistration_1 = true; };
            this.loader()
                .then(function () {
                // If Hammer isn't actually loaded when the custom loader resolves, give up.
                if (!(/** @type {?} */ (window)).Hammer) {
                    _this.console.warn("The custom HAMMER_LOADER completed, but Hammer.JS is not present.");
                    deregister_1 = function () { };
                    return;
                }
                if (!cancelRegistration_1) {
                    // Now that Hammer is loaded and the listener is being loaded for real,
                    // the deregistration function changes from canceling registration to removal.
                    // Now that Hammer is loaded and the listener is being loaded for real,
                    // the deregistration function changes from canceling registration to removal.
                    deregister_1 = _this.addEventListener(element, eventName, handler);
                }
            })
                .catch(function () {
                _this.console.warn("The \"" + eventName + "\" event cannot be bound because the custom " +
                    "Hammer.JS loader failed.");
                deregister_1 = function () { };
            });
            // Return a function that *executes* `deregister` (and not `deregister` itself) so that we
            // can change the behavior of `deregister` once the listener is added. Using a closure in
            // this way allows us to avoid any additional data structures to track listener removal.
            return function () { deregister_1(); };
        }
        return zone.runOutsideAngular(function () {
            /** @type {?} */
            var mc = _this._config.buildHammer(element);
            /** @type {?} */
            var callback = function (eventObj) {
                zone.runGuarded(function () { handler(eventObj); });
            };
            mc.on(eventName, callback);
            return function () {
                mc.off(eventName, callback);
                // destroy mc to prevent memory leak
                if (typeof mc.destroy === 'function') {
                    mc.destroy();
                }
            };
        });
    };
    /**
     * @param {?} eventName
     * @return {?}
     */
    HammerGesturesPlugin.prototype.isCustomEvent = /**
     * @param {?} eventName
     * @return {?}
     */
    function (eventName) { return this._config.events.indexOf(eventName) > -1; };
    HammerGesturesPlugin.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    HammerGesturesPlugin.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
        { type: HammerGestureConfig, decorators: [{ type: Inject, args: [HAMMER_GESTURE_CONFIG,] }] },
        { type: Console },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [HAMMER_LOADER,] }] }
    ]; };
    return HammerGesturesPlugin;
}(EventManagerPlugin));
export { HammerGesturesPlugin };
if (false) {
    /** @type {?} */
    HammerGesturesPlugin.prototype._config;
    /** @type {?} */
    HammerGesturesPlugin.prototype.console;
    /** @type {?} */
    HammerGesturesPlugin.prototype.loader;
}
//# sourceMappingURL=hammer_gestures.js.map