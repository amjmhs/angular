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
import { createComponent, createContentChild, createContentChildren, createDirective, createHostBinding, createHostListener, createInput, createOutput, createViewChild, createViewChildren } from './core';
import { resolveForwardRef, splitAtColon, stringify } from './util';
/** @type {?} */
const QUERY_METADATA_IDENTIFIERS = [
    createViewChild,
    createViewChildren,
    createContentChild,
    createContentChildren,
];
export class DirectiveResolver {
    /**
     * @param {?} _reflector
     */
    constructor(_reflector) {
        this._reflector = _reflector;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    isDirective(type) {
        /** @type {?} */
        const typeMetadata = this._reflector.annotations(resolveForwardRef(type));
        return typeMetadata && typeMetadata.some(isDirectiveMetadata);
    }
    /**
     * @param {?} type
     * @param {?=} throwIfNotFound
     * @return {?}
     */
    resolve(type, throwIfNotFound = true) {
        /** @type {?} */
        const typeMetadata = this._reflector.annotations(resolveForwardRef(type));
        if (typeMetadata) {
            /** @type {?} */
            const metadata = findLast(typeMetadata, isDirectiveMetadata);
            if (metadata) {
                /** @type {?} */
                const propertyMetadata = this._reflector.propMetadata(type);
                /** @type {?} */
                const guards = this._reflector.guards(type);
                return this._mergeWithPropertyMetadata(metadata, propertyMetadata, guards, type);
            }
        }
        if (throwIfNotFound) {
            throw new Error(`No Directive annotation found on ${stringify(type)}`);
        }
        return null;
    }
    /**
     * @param {?} dm
     * @param {?} propertyMetadata
     * @param {?} guards
     * @param {?} directiveType
     * @return {?}
     */
    _mergeWithPropertyMetadata(dm, propertyMetadata, guards, directiveType) {
        /** @type {?} */
        const inputs = [];
        /** @type {?} */
        const outputs = [];
        /** @type {?} */
        const host = {};
        /** @type {?} */
        const queries = {};
        Object.keys(propertyMetadata).forEach((propName) => {
            /** @type {?} */
            const input = findLast(propertyMetadata[propName], (a) => createInput.isTypeOf(a));
            if (input) {
                if (input.bindingPropertyName) {
                    inputs.push(`${propName}: ${input.bindingPropertyName}`);
                }
                else {
                    inputs.push(propName);
                }
            }
            /** @type {?} */
            const output = findLast(propertyMetadata[propName], (a) => createOutput.isTypeOf(a));
            if (output) {
                if (output.bindingPropertyName) {
                    outputs.push(`${propName}: ${output.bindingPropertyName}`);
                }
                else {
                    outputs.push(propName);
                }
            }
            /** @type {?} */
            const hostBindings = propertyMetadata[propName].filter(a => createHostBinding.isTypeOf(a));
            hostBindings.forEach(hostBinding => {
                if (hostBinding.hostPropertyName) {
                    /** @type {?} */
                    const startWith = hostBinding.hostPropertyName[0];
                    if (startWith === '(') {
                        throw new Error(`@HostBinding can not bind to events. Use @HostListener instead.`);
                    }
                    else if (startWith === '[') {
                        throw new Error(`@HostBinding parameter should be a property name, 'class.<name>', or 'attr.<name>'.`);
                    }
                    host[`[${hostBinding.hostPropertyName}]`] = propName;
                }
                else {
                    host[`[${propName}]`] = propName;
                }
            });
            /** @type {?} */
            const hostListeners = propertyMetadata[propName].filter(a => createHostListener.isTypeOf(a));
            hostListeners.forEach(hostListener => {
                /** @type {?} */
                const args = hostListener.args || [];
                host[`(${hostListener.eventName})`] = `${propName}(${args.join(',')})`;
            });
            /** @type {?} */
            const query = findLast(propertyMetadata[propName], (a) => QUERY_METADATA_IDENTIFIERS.some(i => i.isTypeOf(a)));
            if (query) {
                queries[propName] = query;
            }
        });
        return this._merge(dm, inputs, outputs, host, queries, guards, directiveType);
    }
    /**
     * @param {?} def
     * @return {?}
     */
    _extractPublicName(def) { return splitAtColon(def, [/** @type {?} */ ((null)), def])[1].trim(); }
    /**
     * @param {?} bindings
     * @return {?}
     */
    _dedupeBindings(bindings) {
        /** @type {?} */
        const names = new Set();
        /** @type {?} */
        const publicNames = new Set();
        /** @type {?} */
        const reversedResult = [];
        // go last to first to allow later entries to overwrite previous entries
        for (let i = bindings.length - 1; i >= 0; i--) {
            /** @type {?} */
            const binding = bindings[i];
            /** @type {?} */
            const name = this._extractPublicName(binding);
            publicNames.add(name);
            if (!names.has(name)) {
                names.add(name);
                reversedResult.push(binding);
            }
        }
        return reversedResult.reverse();
    }
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
    _merge(directive, inputs, outputs, host, queries, guards, directiveType) {
        /** @type {?} */
        const mergedInputs = this._dedupeBindings(directive.inputs ? directive.inputs.concat(inputs) : inputs);
        /** @type {?} */
        const mergedOutputs = this._dedupeBindings(directive.outputs ? directive.outputs.concat(outputs) : outputs);
        /** @type {?} */
        const mergedHost = directive.host ? Object.assign({}, directive.host, host) : host;
        /** @type {?} */
        const mergedQueries = directive.queries ? Object.assign({}, directive.queries, queries) : queries;
        if (createComponent.isTypeOf(directive)) {
            /** @type {?} */
            const comp = /** @type {?} */ (directive);
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
                providers: directive.providers, guards
            });
        }
    }
}
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
    for (let i = arr.length - 1; i >= 0; i--) {
        if (condition(arr[i])) {
            return arr[i];
        }
    }
    return null;
}
//# sourceMappingURL=directive_resolver.js.map