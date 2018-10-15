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
import { ComponentNgElementStrategyFactory } from './component-factory-strategy';
import { createCustomEvent, getComponentInputs, getDefaultAttributeToPropertyInputs } from './utils';
/**
 * Prototype for a class constructor based on an Angular component
 * that can be used for custom element registration. Implemented and returned
 * by the {\@link createCustomElement createCustomElement() function}.
 *
 * \@experimental
 * @record
 * @template P
 */
export function NgElementConstructor() { }
/**
 * An array of observed attribute names for the custom element,
 * derived by transforming input property names from the source component.
 * @type {?}
 */
NgElementConstructor.prototype.observedAttributes;
/**
 * Implements the functionality needed for a custom element.
 *
 * \@experimental
 * @abstract
 */
var /**
 * Implements the functionality needed for a custom element.
 *
 * \@experimental
 * @abstract
 */
NgElement = /** @class */ (function (_super) {
    tslib_1.__extends(NgElement, _super);
    function NgElement() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * A subscription to change, connect, and disconnect events in the custom element.
         */
        _this.ngElementEventsSubscription = null;
        return _this;
    }
    return NgElement;
}(HTMLElement));
/**
 * Implements the functionality needed for a custom element.
 *
 * \@experimental
 * @abstract
 */
export { NgElement };
if (false) {
    /**
     * The strategy that controls how a component is transformed in a custom element.
     * @type {?}
     */
    NgElement.prototype.ngElementStrategy;
    /**
     * A subscription to change, connect, and disconnect events in the custom element.
     * @type {?}
     */
    NgElement.prototype.ngElementEventsSubscription;
    /**
     * Prototype for a handler that responds to a change in an observed attribute.
     * @abstract
     * @param {?} attrName The name of the attribute that has changed.
     * @param {?} oldValue The previous value of the attribute.
     * @param {?} newValue The new value of the attribute.
     * @param {?=} namespace The namespace in which the attribute is defined.
     * @return {?} Nothing.
     */
    NgElement.prototype.attributeChangedCallback = function (attrName, oldValue, newValue, namespace) { };
    /**
     * Prototype for a handler that responds to the insertion of the custom element in the DOM.
     * @abstract
     * @return {?} Nothing.
     */
    NgElement.prototype.connectedCallback = function () { };
    /**
     * Prototype for a handler that responds to the deletion of the custom element from the DOM.
     * @abstract
     * @return {?} Nothing.
     */
    NgElement.prototype.disconnectedCallback = function () { };
}
/** @typedef {?} */
var WithProperties;
export { WithProperties };
/**
 * A configuration that initializes an NgElementConstructor with the
 * dependencies and strategy it needs to transform a component into
 * a custom element class.
 *
 * \@experimental
 * @record
 */
export function NgElementConfig() { }
/**
 * The injector to use for retrieving the component's factory.
 * @type {?}
 */
NgElementConfig.prototype.injector;
/**
 * An optional custom strategy factory to use instead of the default.
 * The strategy controls how the transformation is performed.
 * @type {?|undefined}
 */
NgElementConfig.prototype.strategyFactory;
/**
 * \@description Creates a custom element class based on an Angular component.
 *
 * Builds a class that encapsulates the functionality of the provided component and
 * uses the configuration information to provide more context to the class.
 * Takes the component factory's inputs and outputs to convert them to the proper
 * custom element API and add hooks to input changes.
 *
 * The configuration's injector is the initial injector set on the class,
 * and used by default for each created instance.This behavior can be overridden with the
 * static property to affect all newly created instances, or as a constructor argument for
 * one-off creations.
 *
 * \@experimental
 * @template P
 * @param {?} component The component to transform.
 * @param {?} config A configuration that provides initialization information to the created class.
 * @return {?} The custom-element construction class, which can be registered with
 * a browser's `CustomElementRegistry`.
 *
 */
export function createCustomElement(component, config) {
    /** @type {?} */
    var inputs = getComponentInputs(component, config.injector);
    /** @type {?} */
    var strategyFactory = config.strategyFactory || new ComponentNgElementStrategyFactory(component, config.injector);
    /** @type {?} */
    var attributeToPropertyInputs = getDefaultAttributeToPropertyInputs(inputs);
    var NgElementImpl = /** @class */ (function (_super) {
        tslib_1.__extends(NgElementImpl, _super);
        function NgElementImpl(injector) {
            var _this = _super.call(this) || this;
            // Note that some polyfills (e.g. document-register-element) do not call the constructor.
            // Do not assume this strategy has been created.
            // TODO(andrewseguin): Add e2e tests that cover cases where the constructor isn't called. For
            // now this is tested using a Google internal test suite.
            // Note that some polyfills (e.g. document-register-element) do not call the constructor.
            // Do not assume this strategy has been created.
            // TODO(andrewseguin): Add e2e tests that cover cases where the constructor isn't called. For
            // now this is tested using a Google internal test suite.
            _this.ngElementStrategy = strategyFactory.create(injector || config.injector);
            return _this;
        }
        /**
         * @param {?} attrName
         * @param {?} oldValue
         * @param {?} newValue
         * @param {?=} namespace
         * @return {?}
         */
        NgElementImpl.prototype.attributeChangedCallback = /**
         * @param {?} attrName
         * @param {?} oldValue
         * @param {?} newValue
         * @param {?=} namespace
         * @return {?}
         */
        function (attrName, oldValue, newValue, namespace) {
            if (!this.ngElementStrategy) {
                this.ngElementStrategy = strategyFactory.create(config.injector);
            }
            /** @type {?} */
            var propName = /** @type {?} */ ((attributeToPropertyInputs[attrName]));
            this.ngElementStrategy.setInputValue(propName, newValue);
        };
        /**
         * @return {?}
         */
        NgElementImpl.prototype.connectedCallback = /**
         * @return {?}
         */
        function () {
            var _this = this;
            if (!this.ngElementStrategy) {
                this.ngElementStrategy = strategyFactory.create(config.injector);
            }
            this.ngElementStrategy.connect(this);
            // Listen for events from the strategy and dispatch them as custom events
            this.ngElementEventsSubscription = this.ngElementStrategy.events.subscribe(function (e) {
                /** @type {?} */
                var customEvent = createCustomEvent(_this.ownerDocument, e.name, e.value);
                _this.dispatchEvent(customEvent);
            });
        };
        /**
         * @return {?}
         */
        NgElementImpl.prototype.disconnectedCallback = /**
         * @return {?}
         */
        function () {
            if (this.ngElementStrategy) {
                this.ngElementStrategy.disconnect();
            }
            if (this.ngElementEventsSubscription) {
                this.ngElementEventsSubscription.unsubscribe();
                this.ngElementEventsSubscription = null;
            }
        };
        NgElementImpl['observedAttributes'] = Object.keys(attributeToPropertyInputs);
        return NgElementImpl;
    }(NgElement));
    if (false) {
        /* TODO: handle strange member:
        static readonly['observedAttributes'] = Object.keys(attributeToPropertyInputs);
        */
    }
    // Add getters and setters to the prototype for each property input. If the config does not
    // contain property inputs, use all inputs by default.
    inputs.map(function (_a) {
        var propName = _a.propName;
        return propName;
    }).forEach(function (property) {
        Object.defineProperty(NgElementImpl.prototype, property, {
            get: function () { return this.ngElementStrategy.getInputValue(property); },
            set: function (newValue) { this.ngElementStrategy.setInputValue(property, newValue); },
            configurable: true,
            enumerable: true,
        });
    });
    return /** @type {?} */ ((/** @type {?} */ (NgElementImpl)));
}
//# sourceMappingURL=create-custom-element.js.map