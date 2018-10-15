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
import { Directive, ElementRef, EventEmitter, Inject, Injector } from '@angular/core';
import * as angular from '../common/angular1';
import { $SCOPE } from '../common/constants';
import { UpgradeHelper } from '../common/upgrade_helper';
import { isFunction, strictEquals } from '../common/util';
/** @type {?} */
var CAMEL_CASE = /([A-Z])/g;
/** @type {?} */
var INITIAL_VALUE = {
    __UNINITIALIZED__: true
};
/** @type {?} */
var NOT_SUPPORTED = 'NOT_SUPPORTED';
var UpgradeNg1ComponentAdapterBuilder = /** @class */ (function () {
    function UpgradeNg1ComponentAdapterBuilder(name) {
        this.name = name;
        this.inputs = [];
        this.inputsRename = [];
        this.outputs = [];
        this.outputsRename = [];
        this.propertyOutputs = [];
        this.checkProperties = [];
        this.propertyMap = {};
        this.directive = null;
        /** @type {?} */
        var selector = name.replace(CAMEL_CASE, function (all, next) { return '-' + next.toLowerCase(); });
        /** @type {?} */
        var self = this;
        /** @type {?} */
        var directive = { selector: selector, inputs: this.inputsRename, outputs: this.outputsRename };
        var MyClass = /** @class */ (function () {
            function MyClass(scope, injector, elementRef) {
                /** @type {?} */
                var helper = new UpgradeHelper(injector, name, elementRef, this.directive);
                return /** @type {?} */ (new UpgradeNg1ComponentAdapter(helper, scope, self.template, self.inputs, self.outputs, self.propertyOutputs, self.checkProperties, self.propertyMap));
            }
            /**
             * @return {?}
             */
            MyClass.prototype.ngOnInit = /**
             * @return {?}
             */
            function () {
                /* needs to be here for ng2 to properly detect it */
            };
            /**
             * @return {?}
             */
            MyClass.prototype.ngOnChanges = /**
             * @return {?}
             */
            function () {
                /* needs to be here for ng2 to properly detect it */
            };
            /**
             * @return {?}
             */
            MyClass.prototype.ngDoCheck = /**
             * @return {?}
             */
            function () {
                /* needs to be here for ng2 to properly detect it */
            };
            /**
             * @return {?}
             */
            MyClass.prototype.ngOnDestroy = /**
             * @return {?}
             */
            function () {
                /* needs to be here for ng2 to properly detect it */
            };
            MyClass.decorators = [
                { type: Directive, args: [tslib_1.__assign({ jit: true }, directive),] },
            ];
            /** @nocollapse */
            MyClass.ctorParameters = function () { return [
                { type: undefined, decorators: [{ type: Inject, args: [$SCOPE,] }] },
                { type: Injector },
                { type: ElementRef }
            ]; };
            return MyClass;
        }());
        if (false) {
            /** @type {?} */
            MyClass.prototype.directive;
        }
        this.type = MyClass;
    }
    /**
     * @return {?}
     */
    UpgradeNg1ComponentAdapterBuilder.prototype.extractBindings = /**
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var btcIsObject = typeof /** @type {?} */ ((this.directive)).bindToController === 'object';
        if (btcIsObject && Object.keys(/** @type {?} */ ((/** @type {?} */ ((this.directive)).scope))).length) {
            throw new Error("Binding definitions on scope and controller at the same time are not supported.");
        }
        /** @type {?} */
        var context = (btcIsObject) ? /** @type {?} */ ((this.directive)).bindToController : /** @type {?} */ ((this.directive)).scope;
        if (typeof context == 'object') {
            Object.keys(context).forEach(function (propName) {
                /** @type {?} */
                var definition = context[propName];
                /** @type {?} */
                var bindingType = definition.charAt(0);
                /** @type {?} */
                var bindingOptions = definition.charAt(1);
                /** @type {?} */
                var attrName = definition.substring(bindingOptions === '?' ? 2 : 1) || propName;
                /** @type {?} */
                var inputName = "input_" + attrName;
                /** @type {?} */
                var inputNameRename = inputName + ": " + attrName;
                /** @type {?} */
                var outputName = "output_" + attrName;
                /** @type {?} */
                var outputNameRename = outputName + ": " + attrName;
                /** @type {?} */
                var outputNameRenameChange = outputNameRename + "Change";
                switch (bindingType) {
                    case '@':
                    case '<':
                        _this.inputs.push(inputName);
                        _this.inputsRename.push(inputNameRename);
                        _this.propertyMap[inputName] = propName;
                        break;
                    case '=':
                        _this.inputs.push(inputName);
                        _this.inputsRename.push(inputNameRename);
                        _this.propertyMap[inputName] = propName;
                        _this.outputs.push(outputName);
                        _this.outputsRename.push(outputNameRenameChange);
                        _this.propertyMap[outputName] = propName;
                        _this.checkProperties.push(propName);
                        _this.propertyOutputs.push(outputName);
                        break;
                    case '&':
                        _this.outputs.push(outputName);
                        _this.outputsRename.push(outputNameRename);
                        _this.propertyMap[outputName] = propName;
                        break;
                    default:
                        /** @type {?} */
                        var json = JSON.stringify(context);
                        throw new Error("Unexpected mapping '" + bindingType + "' in '" + json + "' in '" + _this.name + "' directive.");
                }
            });
        }
    };
    /**
     * Upgrade ng1 components into Angular.
     */
    /**
     * Upgrade ng1 components into Angular.
     * @param {?} exportedComponents
     * @param {?} $injector
     * @return {?}
     */
    UpgradeNg1ComponentAdapterBuilder.resolve = /**
     * Upgrade ng1 components into Angular.
     * @param {?} exportedComponents
     * @param {?} $injector
     * @return {?}
     */
    function (exportedComponents, $injector) {
        /** @type {?} */
        var promises = Object.keys(exportedComponents).map(function (name) {
            /** @type {?} */
            var exportedComponent = exportedComponents[name];
            exportedComponent.directive = UpgradeHelper.getDirective($injector, name);
            exportedComponent.extractBindings();
            return Promise
                .resolve(UpgradeHelper.getTemplate($injector, exportedComponent.directive, true))
                .then(function (template) { return exportedComponent.template = template; });
        });
        return Promise.all(promises);
    };
    return UpgradeNg1ComponentAdapterBuilder;
}());
export { UpgradeNg1ComponentAdapterBuilder };
if (false) {
    /** @type {?} */
    UpgradeNg1ComponentAdapterBuilder.prototype.type;
    /** @type {?} */
    UpgradeNg1ComponentAdapterBuilder.prototype.inputs;
    /** @type {?} */
    UpgradeNg1ComponentAdapterBuilder.prototype.inputsRename;
    /** @type {?} */
    UpgradeNg1ComponentAdapterBuilder.prototype.outputs;
    /** @type {?} */
    UpgradeNg1ComponentAdapterBuilder.prototype.outputsRename;
    /** @type {?} */
    UpgradeNg1ComponentAdapterBuilder.prototype.propertyOutputs;
    /** @type {?} */
    UpgradeNg1ComponentAdapterBuilder.prototype.checkProperties;
    /** @type {?} */
    UpgradeNg1ComponentAdapterBuilder.prototype.propertyMap;
    /** @type {?} */
    UpgradeNg1ComponentAdapterBuilder.prototype.directive;
    /** @type {?} */
    UpgradeNg1ComponentAdapterBuilder.prototype.template;
    /** @type {?} */
    UpgradeNg1ComponentAdapterBuilder.prototype.name;
}
var UpgradeNg1ComponentAdapter = /** @class */ (function () {
    function UpgradeNg1ComponentAdapter(helper, scope, template, inputs, outputs, propOuts, checkProperties, propertyMap) {
        this.helper = helper;
        this.template = template;
        this.inputs = inputs;
        this.outputs = outputs;
        this.propOuts = propOuts;
        this.checkProperties = checkProperties;
        this.propertyMap = propertyMap;
        this.controllerInstance = null;
        this.destinationObj = null;
        this.checkLastValues = [];
        this.$element = null;
        this.directive = helper.directive;
        this.element = helper.element;
        this.$element = helper.$element;
        this.componentScope = scope.$new(!!this.directive.scope);
        /** @type {?} */
        var controllerType = this.directive.controller;
        if (this.directive.bindToController && controllerType) {
            this.controllerInstance = this.helper.buildController(controllerType, this.componentScope);
            this.destinationObj = this.controllerInstance;
        }
        else {
            this.destinationObj = this.componentScope;
        }
        for (var i = 0; i < inputs.length; i++) {
            (/** @type {?} */ (this))[inputs[i]] = null;
        }
        for (var j = 0; j < outputs.length; j++) {
            /** @type {?} */
            var emitter = (/** @type {?} */ (this))[outputs[j]] = new EventEmitter();
            if (this.propOuts.indexOf(outputs[j]) === -1) {
                this.setComponentProperty(outputs[j], (function (emitter) { return function (value) { return emitter.emit(value); }; })(emitter));
            }
        }
        for (var k = 0; k < propOuts.length; k++) {
            this.checkLastValues.push(INITIAL_VALUE);
        }
    }
    /**
     * @return {?}
     */
    UpgradeNg1ComponentAdapter.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var attachChildNodes = this.helper.prepareTransclusion();
        /** @type {?} */
        var linkFn = this.helper.compileTemplate(this.template);
        /** @type {?} */
        var controllerType = this.directive.controller;
        /** @type {?} */
        var bindToController = this.directive.bindToController;
        if (controllerType && !bindToController) {
            this.controllerInstance = this.helper.buildController(controllerType, this.componentScope);
        }
        /** @type {?} */
        var requiredControllers = this.helper.resolveAndBindRequiredControllers(this.controllerInstance);
        // Hook: $onInit
        if (this.controllerInstance && isFunction(this.controllerInstance.$onInit)) {
            this.controllerInstance.$onInit();
        }
        /** @type {?} */
        var link = this.directive.link;
        /** @type {?} */
        var preLink = (typeof link == 'object') && (/** @type {?} */ (link)).pre;
        /** @type {?} */
        var postLink = (typeof link == 'object') ? (/** @type {?} */ (link)).post : link;
        /** @type {?} */
        var attrs = NOT_SUPPORTED;
        /** @type {?} */
        var transcludeFn = NOT_SUPPORTED;
        if (preLink) {
            preLink(this.componentScope, this.$element, attrs, requiredControllers, transcludeFn);
        }
        linkFn(this.componentScope, /** @type {?} */ ((null)), { parentBoundTranscludeFn: attachChildNodes });
        if (postLink) {
            postLink(this.componentScope, this.$element, attrs, requiredControllers, transcludeFn);
        }
        // Hook: $postLink
        if (this.controllerInstance && isFunction(this.controllerInstance.$postLink)) {
            this.controllerInstance.$postLink();
        }
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    UpgradeNg1ComponentAdapter.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        var _this = this;
        /** @type {?} */
        var ng1Changes = {};
        Object.keys(changes).forEach(function (name) {
            /** @type {?} */
            var change = changes[name];
            _this.setComponentProperty(name, change.currentValue);
            ng1Changes[_this.propertyMap[name]] = change;
        });
        if (isFunction(/** @type {?} */ ((this.destinationObj)).$onChanges)) {
            /** @type {?} */ ((/** @type {?} */ ((this.destinationObj)).$onChanges))(ng1Changes);
        }
    };
    /**
     * @return {?}
     */
    UpgradeNg1ComponentAdapter.prototype.ngDoCheck = /**
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var destinationObj = this.destinationObj;
        /** @type {?} */
        var lastValues = this.checkLastValues;
        /** @type {?} */
        var checkProperties = this.checkProperties;
        /** @type {?} */
        var propOuts = this.propOuts;
        checkProperties.forEach(function (propName, i) {
            /** @type {?} */
            var value = /** @type {?} */ ((destinationObj))[propName];
            /** @type {?} */
            var last = lastValues[i];
            if (!strictEquals(last, value)) {
                /** @type {?} */
                var eventEmitter = (/** @type {?} */ (_this))[propOuts[i]];
                eventEmitter.emit(lastValues[i] = value);
            }
        });
        if (this.controllerInstance && isFunction(this.controllerInstance.$doCheck)) {
            this.controllerInstance.$doCheck();
        }
    };
    /**
     * @return {?}
     */
    UpgradeNg1ComponentAdapter.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () { this.helper.onDestroy(this.componentScope, this.controllerInstance); };
    /**
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    UpgradeNg1ComponentAdapter.prototype.setComponentProperty = /**
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    function (name, value) {
        /** @type {?} */ ((this.destinationObj))[this.propertyMap[name]] = value;
    };
    return UpgradeNg1ComponentAdapter;
}());
if (false) {
    /** @type {?} */
    UpgradeNg1ComponentAdapter.prototype.controllerInstance;
    /** @type {?} */
    UpgradeNg1ComponentAdapter.prototype.destinationObj;
    /** @type {?} */
    UpgradeNg1ComponentAdapter.prototype.checkLastValues;
    /** @type {?} */
    UpgradeNg1ComponentAdapter.prototype.directive;
    /** @type {?} */
    UpgradeNg1ComponentAdapter.prototype.element;
    /** @type {?} */
    UpgradeNg1ComponentAdapter.prototype.$element;
    /** @type {?} */
    UpgradeNg1ComponentAdapter.prototype.componentScope;
    /** @type {?} */
    UpgradeNg1ComponentAdapter.prototype.helper;
    /** @type {?} */
    UpgradeNg1ComponentAdapter.prototype.template;
    /** @type {?} */
    UpgradeNg1ComponentAdapter.prototype.inputs;
    /** @type {?} */
    UpgradeNg1ComponentAdapter.prototype.outputs;
    /** @type {?} */
    UpgradeNg1ComponentAdapter.prototype.propOuts;
    /** @type {?} */
    UpgradeNg1ComponentAdapter.prototype.checkProperties;
    /** @type {?} */
    UpgradeNg1ComponentAdapter.prototype.propertyMap;
}
//# sourceMappingURL=upgrade_ng1_adapter.js.map