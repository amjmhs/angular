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
import { createComponent, createContentChild, createContentChildren, createDirective, createHostBinding, createHostListener, createInput, createOutput, createViewChild, createViewChildren } from './core';
import { resolveForwardRef, splitAtColon, stringify } from './util';
/** @type {?} */
var QUERY_METADATA_IDENTIFIERS = [
    createViewChild,
    createViewChildren,
    createContentChild,
    createContentChildren,
];
var DirectiveResolver = /** @class */ (function () {
    function DirectiveResolver(_reflector) {
        this._reflector = _reflector;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    DirectiveResolver.prototype.isDirective = /**
     * @param {?} type
     * @return {?}
     */
    function (type) {
        /** @type {?} */
        var typeMetadata = this._reflector.annotations(resolveForwardRef(type));
        return typeMetadata && typeMetadata.some(isDirectiveMetadata);
    };
    /**
     * @param {?} type
     * @param {?=} throwIfNotFound
     * @return {?}
     */
    DirectiveResolver.prototype.resolve = /**
     * @param {?} type
     * @param {?=} throwIfNotFound
     * @return {?}
     */
    function (type, throwIfNotFound) {
        if (throwIfNotFound === void 0) { throwIfNotFound = true; }
        /** @type {?} */
        var typeMetadata = this._reflector.annotations(resolveForwardRef(type));
        if (typeMetadata) {
            /** @type {?} */
            var metadata = findLast(typeMetadata, isDirectiveMetadata);
            if (metadata) {
                /** @type {?} */
                var propertyMetadata = this._reflector.propMetadata(type);
                /** @type {?} */
                var guards = this._reflector.guards(type);
                return this._mergeWithPropertyMetadata(metadata, propertyMetadata, guards, type);
            }
        }
        if (throwIfNotFound) {
            throw new Error("No Directive annotation found on " + stringify(type));
        }
        return null;
    };
    /**
     * @param {?} dm
     * @param {?} propertyMetadata
     * @param {?} guards
     * @param {?} directiveType
     * @return {?}
     */
    DirectiveResolver.prototype._mergeWithPropertyMetadata = /**
     * @param {?} dm
     * @param {?} propertyMetadata
     * @param {?} guards
     * @param {?} directiveType
     * @return {?}
     */
    function (dm, propertyMetadata, guards, directiveType) {
        /** @type {?} */
        var inputs = [];
        /** @type {?} */
        var outputs = [];
        /** @type {?} */
        var host = {};
        /** @type {?} */
        var queries = {};
        Object.keys(propertyMetadata).forEach(function (propName) {
            /** @type {?} */
            var input = findLast(propertyMetadata[propName], function (a) { return createInput.isTypeOf(a); });
            if (input) {
                if (input.bindingPropertyName) {
                    inputs.push(propName + ": " + input.bindingPropertyName);
                }
                else {
                    inputs.push(propName);
                }
            }
            /** @type {?} */
            var output = findLast(propertyMetadata[propName], function (a) { return createOutput.isTypeOf(a); });
            if (output) {
                if (output.bindingPropertyName) {
                    outputs.push(propName + ": " + output.bindingPropertyName);
                }
                else {
                    outputs.push(propName);
                }
            }
            /** @type {?} */
            var hostBindings = propertyMetadata[propName].filter(function (a) { return createHostBinding.isTypeOf(a); });
            hostBindings.forEach(function (hostBinding) {
                if (hostBinding.hostPropertyName) {
                    /** @type {?} */
                    var startWith = hostBinding.hostPropertyName[0];
                    if (startWith === '(') {
                        throw new Error("@HostBinding can not bind to events. Use @HostListener instead.");
                    }
                    else if (startWith === '[') {
                        throw new Error("@HostBinding parameter should be a property name, 'class.<name>', or 'attr.<name>'.");
                    }
                    host["[" + hostBinding.hostPropertyName + "]"] = propName;
                }
                else {
                    host["[" + propName + "]"] = propName;
                }
            });
            /** @type {?} */
            var hostListeners = propertyMetadata[propName].filter(function (a) { return createHostListener.isTypeOf(a); });
            hostListeners.forEach(function (hostListener) {
                /** @type {?} */
                var args = hostListener.args || [];
                host["(" + hostListener.eventName + ")"] = propName + "(" + args.join(',') + ")";
            });
            /** @type {?} */
            var query = findLast(propertyMetadata[propName], function (a) { return QUERY_METADATA_IDENTIFIERS.some(function (i) { return i.isTypeOf(a); }); });
            if (query) {
                queries[propName] = query;
            }
        });
        return this._merge(dm, inputs, outputs, host, queries, guards, directiveType);
    };
    /**
     * @param {?} def
     * @return {?}
     */
    DirectiveResolver.prototype._extractPublicName = /**
     * @param {?} def
     * @return {?}
     */
    function (def) { return splitAtColon(def, [/** @type {?} */ ((null)), def])[1].trim(); };
    /**
     * @param {?} bindings
     * @return {?}
     */
    DirectiveResolver.prototype._dedupeBindings = /**
     * @param {?} bindings
     * @return {?}
     */
    function (bindings) {
        /** @type {?} */
        var names = new Set();
        /** @type {?} */
        var publicNames = new Set();
        /** @type {?} */
        var reversedResult = [];
        // go last to first to allow later entries to overwrite previous entries
        for (var i = bindings.length - 1; i >= 0; i--) {
            /** @type {?} */
            var binding = bindings[i];
            /** @type {?} */
            var name_1 = this._extractPublicName(binding);
            publicNames.add(name_1);
            if (!names.has(name_1)) {
                names.add(name_1);
                reversedResult.push(binding);
            }
        }
        return reversedResult.reverse();
    };
    /**
     * @param {?} directive
     * @param {?} inputs
     * @param {?} outputs
     * @param {?} host
     * @param {?} queries
     * @param {?} guards
     * @param {?} directiveType
     * @return {?}
     */
    DirectiveResolver.prototype._merge = /**
     * @param {?} directive
     * @param {?} inputs
     * @param {?} outputs
     * @param {?} host
     * @param {?} queries
     * @param {?} guards
     * @param {?} directiveType
     * @return {?}
     */
    function (directive, inputs, outputs, host, queries, guards, directiveType) {
        /** @type {?} */
        var mergedInputs = this._dedupeBindings(directive.inputs ? directive.inputs.concat(inputs) : inputs);
        /** @type {?} */
        var mergedOutputs = this._dedupeBindings(directive.outputs ? directive.outputs.concat(outputs) : outputs);
        /** @type {?} */
        var mergedHost = directive.host ? tslib_1.__assign({}, directive.host, host) : host;
        /** @type {?} */
        var mergedQueries = directive.queries ? tslib_1.__assign({}, directive.queries, queries) : queries;
        if (createComponent.isTypeOf(directive)) {
            /** @type {?} */
            var comp = /** @type {?} */ (directive);
            return createComponent({
                selector: comp.selector,
                inputs: mergedInputs,
                outputs: mergedOutputs,
                host: mergedHost,
                exportAs: comp.exportAs,
                moduleId: comp.moduleId,
                queries: mergedQueries,
                changeDetection: comp.changeDetection,
                providers: comp.providers,
                viewProviders: comp.viewProviders,
                entryComponents: comp.entryComponents,
                template: comp.template,
                templateUrl: comp.templateUrl,
                styles: comp.styles,
                styleUrls: comp.styleUrls,
                encapsulation: comp.encapsulation,
                animations: comp.animations,
                interpolation: comp.interpolation,
                preserveWhitespaces: directive.preserveWhitespaces,
            });
        }
        else {
            return createDirective({
                selector: directive.selector,
                inputs: mergedInputs,
                outputs: mergedOutputs,
                host: mergedHost,
                exportAs: directive.exportAs,
                queries: mergedQueries,
                providers: directive.providers, guards: guards
            });
        }
    };
    return DirectiveResolver;
}());
export { DirectiveResolver };
if (false) {
    /** @type {?} */
    DirectiveResolver.prototype._reflector;
}
/**
 * @param {?} type
 * @return {?}
 */
function isDirectiveMetadata(type) {
    return createDirective.isTypeOf(type) || createComponent.isTypeOf(type);
}
/**
 * @template T
 * @param {?} arr
 * @param {?} condition
 * @return {?}
 */
export function findLast(arr, condition) {
    for (var i = arr.length - 1; i >= 0; i--) {
        if (condition(arr[i])) {
            return arr[i];
        }
    }
    return null;
}
//# sourceMappingURL=directive_resolver.js.map