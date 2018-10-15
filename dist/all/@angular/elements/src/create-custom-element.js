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
var component_factory_strategy_1 = require("./component-factory-strategy");
var utils_1 = require("./utils");
/**
 * Implements the functionality needed for a custom element.
 *
 * @experimental
 */
var NgElement = /** @class */ (function (_super) {
    __extends(NgElement, _super);
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
exports.NgElement = NgElement;
/**
 *  @description Creates a custom element class based on an Angular component.
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
 * @param component The component to transform.
 * @param config A configuration that provides initialization information to the created class.
 * @returns The custom-element construction class, which can be registered with
 * a browser's `CustomElementRegistry`.
 *
 * @experimental
 */
function createCustomElement(component, config) {
    var inputs = utils_1.getComponentInputs(component, config.injector);
    var strategyFactory = config.strategyFactory || new component_factory_strategy_1.ComponentNgElementStrategyFactory(component, config.injector);
    var attributeToPropertyInputs = utils_1.getDefaultAttributeToPropertyInputs(inputs);
    var NgElementImpl = /** @class */ (function (_super) {
        __extends(NgElementImpl, _super);
        function NgElementImpl(injector) {
            var _this = _super.call(this) || this;
            // Note that some polyfills (e.g. document-register-element) do not call the constructor.
            // Do not assume this strategy has been created.
            // TODO(andrewseguin): Add e2e tests that cover cases where the constructor isn't called. For
            // now this is tested using a Google internal test suite.
            _this.ngElementStrategy = strategyFactory.create(injector || config.injector);
            return _this;
        }
        NgElementImpl.prototype.attributeChangedCallback = function (attrName, oldValue, newValue, namespace) {
            if (!this.ngElementStrategy) {
                this.ngElementStrategy = strategyFactory.create(config.injector);
            }
            var propName = attributeToPropertyInputs[attrName];
            this.ngElementStrategy.setInputValue(propName, newValue);
        };
        NgElementImpl.prototype.connectedCallback = function () {
            var _this = this;
            if (!this.ngElementStrategy) {
                this.ngElementStrategy = strategyFactory.create(config.injector);
            }
            this.ngElementStrategy.connect(this);
            // Listen for events from the strategy and dispatch them as custom events
            this.ngElementEventsSubscription = this.ngElementStrategy.events.subscribe(function (e) {
                var customEvent = utils_1.createCustomEvent(_this.ownerDocument, e.name, e.value);
                _this.dispatchEvent(customEvent);
            });
        };
        NgElementImpl.prototype.disconnectedCallback = function () {
            if (this.ngElementStrategy) {
                this.ngElementStrategy.disconnect();
            }
            if (this.ngElementEventsSubscription) {
                this.ngElementEventsSubscription.unsubscribe();
                this.ngElementEventsSubscription = null;
            }
        };
        // Work around a bug in closure typed optimizations(b/79557487) where it is not honoring static
        // field externs. So using quoted access to explicitly prevent renaming.
        NgElementImpl['observedAttributes'] = Object.keys(attributeToPropertyInputs);
        return NgElementImpl;
    }(NgElement));
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
    return NgElementImpl;
}
exports.createCustomElement = createCustomElement;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLWN1c3RvbS1lbGVtZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZWxlbWVudHMvc3JjL2NyZWF0ZS1jdXN0b20tZWxlbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFLSCwyRUFBK0U7QUFFL0UsaUNBQW1HO0FBdUJuRzs7OztHQUlHO0FBQ0g7SUFBd0MsNkJBQVc7SUFBbkQ7UUFBQSxxRUErQkM7UUF6QkM7O1dBRUc7UUFDTyxpQ0FBMkIsR0FBc0IsSUFBSSxDQUFDOztJQXNCbEUsQ0FBQztJQUFELGdCQUFDO0FBQUQsQ0FBQyxBQS9CRCxDQUF3QyxXQUFXLEdBK0JsRDtBQS9CcUIsOEJBQVM7QUErRC9COzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBbUJHO0FBQ0gsNkJBQ0ksU0FBb0IsRUFBRSxNQUF1QjtJQUMvQyxJQUFNLE1BQU0sR0FBRywwQkFBa0IsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRTlELElBQU0sZUFBZSxHQUNqQixNQUFNLENBQUMsZUFBZSxJQUFJLElBQUksOERBQWlDLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUVoRyxJQUFNLHlCQUF5QixHQUFHLDJDQUFtQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRTlFO1FBQTRCLGlDQUFTO1FBS25DLHVCQUFZLFFBQW1CO1lBQS9CLFlBQ0UsaUJBQU8sU0FPUjtZQUxDLHlGQUF5RjtZQUN6RixnREFBZ0Q7WUFDaEQsNkZBQTZGO1lBQzdGLHlEQUF5RDtZQUN6RCxLQUFJLENBQUMsaUJBQWlCLEdBQUcsZUFBZSxDQUFDLE1BQU0sQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDOztRQUMvRSxDQUFDO1FBRUQsZ0RBQXdCLEdBQXhCLFVBQ0ksUUFBZ0IsRUFBRSxRQUFxQixFQUFFLFFBQWdC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