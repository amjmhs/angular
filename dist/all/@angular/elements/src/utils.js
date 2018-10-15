"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var core_1 = require("@angular/core");
var elProto = Element.prototype;
var matches = elProto.matches || elProto.matchesSelector || elProto.mozMatchesSelector ||
    elProto.msMatchesSelector || elProto.oMatchesSelector || elProto.webkitMatchesSelector;
/**
 * Provide methods for scheduling the execution of a callback.
 */
exports.scheduler = {
    /**
     * Schedule a callback to be called after some delay.
     *
     * Returns a function that when executed will cancel the scheduled function.
     */
    schedule: function (taskFn, delay) { var id = setTimeout(taskFn, delay); return function () { return clearTimeout(id); }; },
    /**
     * Schedule a callback to be called before the next render.
     * (If `window.requestAnimationFrame()` is not available, use `scheduler.schedule()` instead.)
     *
     * Returns a function that when executed will cancel the scheduled function.
     */
    scheduleBeforeRender: function (taskFn) {
        // TODO(gkalpak): Implement a better way of accessing `requestAnimationFrame()`
        //                (e.g. accounting for vendor prefix, SSR-compatibility, etc).
        if (typeof window === 'undefined') {
            // For SSR just schedule immediately.
            return exports.scheduler.schedule(taskFn, 0);
        }
        if (typeof window.requestAnimationFrame === 'undefined') {
            var frameMs = 16;
            return exports.scheduler.schedule(taskFn, frameMs);
        }
        var id = window.requestAnimationFrame(taskFn);
        return function () { return window.cancelAnimationFrame(id); };
    },
};
/**
 * Convert a camelCased string to kebab-cased.
 */
function camelToDashCase(input) {
    return input.replace(/[A-Z]/g, function (char) { return "-" + char.toLowerCase(); });
}
exports.camelToDashCase = camelToDashCase;
/**
 * Create a `CustomEvent` (even on browsers where `CustomEvent` is not a constructor).
 */
function createCustomEvent(doc, name, detail) {
    var bubbles = false;
    var cancelable = false;
    // On IE9-11, `CustomEvent` is not a constructor.
    if (typeof CustomEvent !== 'function') {
        var event_1 = doc.createEvent('CustomEvent');
        event_1.initCustomEvent(name, bubbles, cancelable, detail);
        return event_1;
    }
    return new CustomEvent(name, { bubbles: bubbles, cancelable: cancelable, detail: detail });
}
exports.createCustomEvent = createCustomEvent;
/**
 * Check whether the input is an `Element`.
 */
function isElement(node) {
    return node.nodeType === Node.ELEMENT_NODE;
}
exports.isElement = isElement;
/**
 * Check whether the input is a function.
 */
function isFunction(value) {
    return typeof value === 'function';
}
exports.isFunction = isFunction;
/**
 * Convert a kebab-cased string to camelCased.
 */
function kebabToCamelCase(input) {
    return input.replace(/-([a-z\d])/g, function (_, char) { return char.toUpperCase(); });
}
exports.kebabToCamelCase = kebabToCamelCase;
/**
 * Check whether an `Element` matches a CSS selector.
 */
function matchesSelector(element, selector) {
    return matches.call(element, selector);
}
exports.matchesSelector = matchesSelector;
/**
 * Test two values for strict equality, accounting for the fact that `NaN !== NaN`.
 */
function strictEquals(value1, value2) {
    return value1 === value2 || (value1 !== value1 && value2 !== value2);
}
exports.strictEquals = strictEquals;
/** Gets a map of default set of attributes to observe and the properties they affect. */
function getDefaultAttributeToPropertyInputs(inputs) {
    var attributeToPropertyInputs = {};
    inputs.forEach(function (_a) {
        var propName = _a.propName, templateName = _a.templateName;
        attributeToPropertyInputs[camelToDashCase(templateName)] = propName;
    });
    return attributeToPropertyInputs;
}
exports.getDefaultAttributeToPropertyInputs = getDefaultAttributeToPropertyInputs;
/**
 * Gets a component's set of inputs. Uses the injector to get the component factory where the inputs
 * are defined.
 */
function getComponentInputs(component, injector) {
    var componentFactoryResolver = injector.get(core_1.ComponentFactoryResolver);
    var componentFactory = componentFactoryResolver.resolveComponentFactory(component);
    return componentFactory.inputs;
}
exports.getComponentInputs = getComponentInputs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9lbGVtZW50cy9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCxzQ0FBdUU7QUFFdkUsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQWdCLENBQUM7QUFDekMsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsZUFBZSxJQUFJLE9BQU8sQ0FBQyxrQkFBa0I7SUFDcEYsT0FBTyxDQUFDLGlCQUFpQixJQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsSUFBSSxPQUFPLENBQUMscUJBQXFCLENBQUM7QUFFM0Y7O0dBRUc7QUFDVSxRQUFBLFNBQVMsR0FBRztJQUN2Qjs7OztPQUlHO0lBQ0gsUUFBUSxFQUFSLFVBQVMsTUFBa0IsRUFBRSxLQUFhLElBQ2pDLElBQU0sRUFBRSxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLGNBQU0sT0FBQSxZQUFZLENBQUMsRUFBRSxDQUFDLEVBQWhCLENBQWdCLENBQUMsQ0FBQSxDQUFDO0lBRTlFOzs7OztPQUtHO0lBQ0gsb0JBQW9CLEVBQXBCLFVBQXFCLE1BQWtCO1FBQ3JDLCtFQUErRTtRQUMvRSw4RUFBOEU7UUFDOUUsSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLEVBQUU7WUFDakMscUNBQXFDO1lBQ3JDLE9BQU8saUJBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ3RDO1FBRUQsSUFBSSxPQUFPLE1BQU0sQ0FBQyxxQkFBcUIsS0FBSyxXQUFXLEVBQUU7WUFDdkQsSUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDO1lBQ25CLE9BQU8saUJBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQzVDO1FBRUQsSUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2hELE9BQU8sY0FBTSxPQUFBLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLENBQUMsRUFBL0IsQ0FBK0IsQ0FBQztJQUMvQyxDQUFDO0NBQ0YsQ0FBQztBQUVGOztHQUVHO0FBQ0gseUJBQWdDLEtBQWE7SUFDM0MsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxVQUFBLElBQUksSUFBSSxPQUFBLE1BQUksSUFBSSxDQUFDLFdBQVcsRUFBSSxFQUF4QixDQUF3QixDQUFDLENBQUM7QUFDbkUsQ0FBQztBQUZELDBDQUVDO0FBRUQ7O0dBRUc7QUFDSCwyQkFBa0MsR0FBYSxFQUFFLElBQVksRUFBRSxNQUFXO0lBQ3hFLElBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQztJQUN0QixJQUFNLFVBQVUsR0FBRyxLQUFLLENBQUM7SUFFekIsaURBQWlEO0lBQ2pELElBQUksT0FBTyxXQUFXLEtBQUssVUFBVSxFQUFFO1FBQ3JDLElBQU0sT0FBSyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDN0MsT0FBSyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN6RCxPQUFPLE9BQUssQ0FBQztLQUNkO0lBRUQsT0FBTyxJQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUUsRUFBQyxPQUFPLFNBQUEsRUFBRSxVQUFVLFlBQUEsRUFBRSxNQUFNLFFBQUEsRUFBQyxDQUFDLENBQUM7QUFDOUQsQ0FBQztBQVpELDhDQVlDO0FBRUQ7O0dBRUc7QUFDSCxtQkFBMEIsSUFBVTtJQUNsQyxPQUFPLElBQUksQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDLFlBQVksQ0FBQztBQUM3QyxDQUFDO0FBRkQsOEJBRUM7QUFFRDs7R0FFRztBQUNILG9CQUEyQixLQUFVO0lBQ25DLE9BQU8sT0FBTyxLQUFLLEtBQUssVUFBVSxDQUFDO0FBQ3JDLENBQUM7QUFGRCxnQ0FFQztBQUVEOztHQUVHO0FBQ0gsMEJBQWlDLEtBQWE7SUFDNUMsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxVQUFDLENBQUMsRUFBRSxJQUFJLElBQUssT0FBQSxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQWxCLENBQWtCLENBQUMsQ0FBQztBQUN2RSxDQUFDO0FBRkQsNENBRUM7QUFFRDs7R0FFRztBQUNILHlCQUFnQyxPQUFnQixFQUFFLFFBQWdCO0lBQ2hFLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDekMsQ0FBQztBQUZELDBDQUVDO0FBRUQ7O0dBRUc7QUFDSCxzQkFBNkIsTUFBVyxFQUFFLE1BQVc7SUFDbkQsT0FBTyxNQUFNLEtBQUssTUFBTSxJQUFJLENBQUMsTUFBTSxLQUFLLE1BQU0sSUFBSSxNQUFNLEtBQUssTUFBTSxDQUFDLENBQUM7QUFDdkUsQ0FBQztBQUZELG9DQUVDO0FBRUQseUZBQXlGO0FBQ3pGLDZDQUNJLE1BQWtEO0lBQ3BELElBQU0seUJBQXlCLEdBQTRCLEVBQUUsQ0FBQztJQUM5RCxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUMsRUFBd0I7WUFBdkIsc0JBQVEsRUFBRSw4QkFBWTtRQUNyQyx5QkFBeUIsQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUM7SUFDdEUsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLHlCQUF5QixDQUFDO0FBQ25DLENBQUM7QUFSRCxrRkFRQztBQUVEOzs7R0FHRztBQUNILDRCQUNJLFNBQW9CLEVBQUUsUUFBa0I7SUFDMUMsSUFBTSx3QkFBd0IsR0FBNkIsUUFBUSxDQUFDLEdBQUcsQ0FBQywrQkFBd0IsQ0FBQyxDQUFDO0lBQ2xHLElBQU0sZ0JBQWdCLEdBQUcsd0JBQXdCLENBQUMsdUJBQXVCLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDckYsT0FBTyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUM7QUFDakMsQ0FBQztBQUxELGdEQUtDIn0=