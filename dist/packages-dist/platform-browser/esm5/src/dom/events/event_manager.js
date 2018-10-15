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
import { Inject, Injectable, InjectionToken, NgZone } from '@angular/core';
import { getDOM } from '../dom_adapter';
/** *
 * The injection token for the event-manager plug-in service.
  @type {?} */
export var EVENT_MANAGER_PLUGINS = new InjectionToken('EventManagerPlugins');
/**
 * An injectable service that provides event management for Angular
 * through a browser plug-in.
 */
var EventManager = /** @class */ (function () {
    /**
     * Initializes an instance of the event-manager service.
     */
    function EventManager(plugins, _zone) {
        var _this = this;
        this._zone = _zone;
        this._eventNameToPlugin = new Map();
        plugins.forEach(function (p) { return p.manager = _this; });
        this._plugins = plugins.slice().reverse();
    }
    /**
     * Registers a handler for a specific element and event.
     *
     * @param element The HTML element to receive event notifications.
     * @param eventName The name of the event to listen for.
     * @param handler A function to call when the notification occurs. Receives the
     * event object as an argument.
     * @returns  A callback function that can be used to remove the handler.
     */
    /**
     * Registers a handler for a specific element and event.
     *
     * @param {?} element The HTML element to receive event notifications.
     * @param {?} eventName The name of the event to listen for.
     * @param {?} handler A function to call when the notification occurs. Receives the
     * event object as an argument.
     * @return {?} A callback function that can be used to remove the handler.
     */
    EventManager.prototype.addEventListener = /**
     * Registers a handler for a specific element and event.
     *
     * @param {?} element The HTML element to receive event notifications.
     * @param {?} eventName The name of the event to listen for.
     * @param {?} handler A function to call when the notification occurs. Receives the
     * event object as an argument.
     * @return {?} A callback function that can be used to remove the handler.
     */
    function (element, eventName, handler) {
        /** @type {?} */
        var plugin = this._findPluginFor(eventName);
        return plugin.addEventListener(element, eventName, handler);
    };
    /**
     * Registers a global handler for an event in a target view.
     *
     * @param target A target for global event notifications. One of "window", "document", or "body".
     * @param eventName The name of the event to listen for.
     * @param handler A function to call when the notification occurs. Receives the
     * event object as an argument.
     * @returns A callback function that can be used to remove the handler.
     */
    /**
     * Registers a global handler for an event in a target view.
     *
     * @param {?} target A target for global event notifications. One of "window", "document", or "body".
     * @param {?} eventName The name of the event to listen for.
     * @param {?} handler A function to call when the notification occurs. Receives the
     * event object as an argument.
     * @return {?} A callback function that can be used to remove the handler.
     */
    EventManager.prototype.addGlobalEventListener = /**
     * Registers a global handler for an event in a target view.
     *
     * @param {?} target A target for global event notifications. One of "window", "document", or "body".
     * @param {?} eventName The name of the event to listen for.
     * @param {?} handler A function to call when the notification occurs. Receives the
     * event object as an argument.
     * @return {?} A callback function that can be used to remove the handler.
     */
    function (target, eventName, handler) {
        /** @type {?} */
        var plugin = this._findPluginFor(eventName);
        return plugin.addGlobalEventListener(target, eventName, handler);
    };
    /**
     * Retrieves the compilation zone in which event listeners are registered.
     */
    /**
     * Retrieves the compilation zone in which event listeners are registered.
     * @return {?}
     */
    EventManager.prototype.getZone = /**
     * Retrieves the compilation zone in which event listeners are registered.
     * @return {?}
     */
    function () { return this._zone; };
    /** @internal */
    /**
     * \@internal
     * @param {?} eventName
     * @return {?}
     */
    EventManager.prototype._findPluginFor = /**
     * \@internal
     * @param {?} eventName
     * @return {?}
     */
    function (eventName) {
        /** @type {?} */
        var plugin = this._eventNameToPlugin.get(eventName);
        if (plugin) {
            return plugin;
        }
        /** @type {?} */
        var plugins = this._plugins;
        for (var i = 0; i < plugins.length; i++) {
            /** @type {?} */
            var plugin_1 = plugins[i];
            if (plugin_1.supports(eventName)) {
                this._eventNameToPlugin.set(eventName, plugin_1);
                return plugin_1;
            }
        }
        throw new Error("No event manager plugin found for event " + eventName);
    };
    EventManager.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    EventManager.ctorParameters = function () { return [
        { type: Array, decorators: [{ type: Inject, args: [EVENT_MANAGER_PLUGINS,] }] },
        { type: NgZone }
    ]; };
    return EventManager;
}());
export { EventManager };
if (false) {
    /** @type {?} */
    EventManager.prototype._plugins;
    /** @type {?} */
    EventManager.prototype._eventNameToPlugin;
    /** @type {?} */
    EventManager.prototype._zone;
}
/**
 * @abstract
 */
var /**
 * @abstract
 */
EventManagerPlugin = /** @class */ (function () {
    function EventManagerPlugin(_doc) {
        this._doc = _doc;
    }
    /**
     * @param {?} element
     * @param {?} eventName
     * @param {?} handler
     * @return {?}
     */
    EventManagerPlugin.prototype.addGlobalEventListener = /**
     * @param {?} element
     * @param {?} eventName
     * @param {?} handler
     * @return {?}
     */
    function (element, eventName, handler) {
        /** @type {?} */
        var target = getDOM().getGlobalEventTarget(this._doc, element);
        if (!target) {
            throw new Error("Unsupported event target " + target + " for event " + eventName);
        }
        return this.addEventListener(target, eventName, handler);
    };
    return EventManagerPlugin;
}());
/**
 * @abstract
 */
export { EventManagerPlugin };
if (false) {
    /** @type {?} */
    EventManagerPlugin.prototype.manager;
    /** @type {?} */
    EventManagerPlugin.prototype._doc;
    /**
     * @abstract
     * @param {?} eventName
     * @return {?}
     */
    EventManagerPlugin.prototype.supports = function (eventName) { };
    /**
     * @abstract
     * @param {?} element
     * @param {?} eventName
     * @param {?} handler
     * @return {?}
     */
    EventManagerPlugin.prototype.addEventListener = function (element, eventName, handler) { };
}
//# sourceMappingURL=event_manager.js.map