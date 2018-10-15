"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("./core");
var util_1 = require("./util");
var QUERY_METADATA_IDENTIFIERS = [
    core_1.createViewChild,
    core_1.createViewChildren,
    core_1.createContentChild,
    core_1.createContentChildren,
];
/*
 * Resolve a `Type` for {@link Directive}.
 *
 * This interface can be overridden by the application developer to create custom behavior.
 *
 * See {@link Compiler}
 */
var DirectiveResolver = /** @class */ (function () {
    function DirectiveResolver(_reflector) {
        this._reflector = _reflector;
    }
    DirectiveResolver.prototype.isDirective = function (type) {
        var typeMetadata = this._reflector.annotations(util_1.resolveForwardRef(type));
        return typeMetadata && typeMetadata.some(isDirectiveMetadata);
    };
    DirectiveResolver.prototype.resolve = function (type, throwIfNotFound) {
        if (throwIfNotFound === void 0) { throwIfNotFound = true; }
        var typeMetadata = this._reflector.annotations(util_1.resolveForwardRef(type));
        if (typeMetadata) {
            var metadata = findLast(typeMetadata, isDirectiveMetadata);
            if (metadata) {
                var propertyMetadata = this._reflector.propMetadata(type);
                var guards = this._reflector.guards(type);
                return this._mergeWithPropertyMetadata(metadata, propertyMetadata, guards, type);
            }
        }
        if (throwIfNotFound) {
            throw new Error("No Directive annotation found on " + util_1.stringify(type));
        }
        return null;
    };
    DirectiveResolver.prototype._mergeWithPropertyMetadata = function (dm, propertyMetadata, guards, directiveType) {
        var inputs = [];
        var outputs = [];
        var host = {};
        var queries = {};
        Object.keys(propertyMetadata).forEach(function (propName) {
            var input = findLast(propertyMetadata[propName], function (a) { return core_1.createInput.isTypeOf(a); });
            if (input) {
                if (input.bindingPropertyName) {
                    inputs.push(propName + ": " + input.bindingPropertyName);
                }
                else {
                    inputs.push(propName);
                }
            }
            var output = findLast(propertyMetadata[propName], function (a) { return core_1.createOutput.isTypeOf(a); });
            if (output) {
                if (output.bindingPropertyName) {
                    outputs.push(propName + ": " + output.bindingPropertyName);
                }
                else {
                    outputs.push(propName);
                }
            }
            var hostBindings = propertyMetadata[propName].filter(function (a) { return core_1.createHostBinding.isTypeOf(a); });
            hostBindings.forEach(function (hostBinding) {
                if (hostBinding.hostPropertyName) {
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
            var hostListeners = propertyMetadata[propName].filter(function (a) { return core_1.createHostListener.isTypeOf(a); });
            hostListeners.forEach(function (hostListener) {
                var args = hostListener.args || [];
                host["(" + hostListener.eventName + ")"] = propName + "(" + args.join(',') + ")";
            });
            var query = findLast(propertyMetadata[propName], function (a) { return QUERY_METADATA_IDENTIFIERS.some(function (i) { return i.isTypeOf(a); }); });
            if (query) {
                queries[propName] = query;
            }
        });
        return this._merge(dm, inputs, outputs, host, queries, guards, directiveType);
    };
    DirectiveResolver.prototype._extractPublicName = function (def) { return util_1.splitAtColon(def, [null, def])[1].trim(); };
    DirectiveResolver.prototype._dedupeBindings = function (bindings) {
        var names = new Set();
        var publicNames = new Set();
        var reversedResult = [];
        // go last to first to allow later entries to overwrite previous entries
        for (var i = bindings.length - 1; i >= 0; i--) {
            var binding = bindings[i];
            var name_1 = this._extractPublicName(binding);
            publicNames.add(name_1);
            if (!names.has(name_1)) {
                names.add(name_1);
                reversedResult.push(binding);
            }
        }
        return reversedResult.reverse();
    };
    DirectiveResolver.prototype._merge = function (directive, inputs, outputs, host, queries, guards, directiveType) {
        var mergedInputs = this._dedupeBindings(directive.inputs ? directive.inputs.concat(inputs) : inputs);
        var mergedOutputs = this._dedupeBindings(directive.outputs ? directive.outputs.concat(outputs) : outputs);
        var mergedHost = directive.host ? __assign({}, directive.host, host) : host;
        var mergedQueries = directive.queries ? __assign({}, directive.queries, queries) : queries;
        if (core_1.createComponent.isTypeOf(directive)) {
            var comp = directive;
            return core_1.createComponent({
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
            return core_1.createDirective({
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
exports.DirectiveResolver = DirectiveResolver;
function isDirectiveMetadata(type) {
    return core_1.createDirective.isTypeOf(type) || core_1.createComponent.isTypeOf(type);
}
function findLast(arr, condition) {
    for (var i = arr.length - 1; i >= 0; i--) {
        if (condition(arr[i])) {
            return arr[i];
        }
    }
    return null;
}
exports.findLast = findLast;
//# sourceMappingURL=directive_resolver.js.map