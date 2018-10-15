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
import * as o from '../../output/output_ast';
/** *
 * Name of the temporary to use during data binding
  @type {?} */
export const TEMPORARY_NAME = '_t';
/** *
 * Name of the context parameter passed into a template function
  @type {?} */
export const CONTEXT_NAME = 'ctx';
/** *
 * Name of the RenderFlag passed into a template function
  @type {?} */
export const RENDER_FLAGS = 'rf';
/** *
 * The prefix reference variables
  @type {?} */
export const REFERENCE_PREFIX = '_r';
/** *
 * The name of the implicit context reference
  @type {?} */
export const IMPLICIT_REFERENCE = '$implicit';
/** *
 * Name of the i18n attributes *
  @type {?} */
export const I18N_ATTR = 'i18n';
/** @type {?} */
export const I18N_ATTR_PREFIX = 'i18n-';
/** *
 * I18n separators for metadata *
  @type {?} */
export const MEANING_SEPARATOR = '|';
/** @type {?} */
export const ID_SEPARATOR = '@@';
/**
 * Creates an allocator for a temporary variable.
 *
 * A variable declaration is added to the statements the first time the allocator is invoked.
 * @param {?} statements
 * @param {?} name
 * @return {?}
 */
export function temporaryAllocator(statements, name) {
    /** @type {?} */
    let temp = null;
    return () => {
        if (!temp) {
            statements.push(new o.DeclareVarStmt(TEMPORARY_NAME, undefined, o.DYNAMIC_TYPE));
            temp = o.variable(name);
        }
        return temp;
    };
}
/**
 * @param {?} feature
 * @return {?}
 */
export function unsupported(feature) {
    if (this) {
        throw new Error(`Builder ${this.constructor.name} doesn't support ${feature} yet`);
    }
    throw new Error(`Feature ${feature} is not supported yet`);
}
/**
 * @template T
 * @param {?} arg
 * @return {?}
 */
export function invalid(arg) {
    throw new Error(`Invalid state: Visitor ${this.constructor.name} doesn't handle ${o.constructor.name}`);
}
/**
 * @param {?} value
 * @return {?}
 */
export function asLiteral(value) {
    if (Array.isArray(value)) {
        return o.literalArr(value.map(asLiteral));
    }
    return o.literal(value, o.INFERRED_TYPE);
}
/**
 * @param {?} keys
 * @return {?}
 */
export function conditionallyCreateMapObjectLiteral(keys) {
    if (Object.getOwnPropertyNames(keys).length > 0) {
        return mapToExpression(keys);
    }
    return null;
}
/**
 * @param {?} map
 * @param {?=} quoted
 * @return {?}
 */
export function mapToExpression(map, quoted = false) {
    return o.literalMap(Object.getOwnPropertyNames(map).map(key => ({ key, quoted, value: asLiteral(map[key]) })));
}
/**
 *  Remove trailing null nodes as they are implied.
 * @param {?} parameters
 * @return {?}
 */
export function trimTrailingNulls(parameters) {
    while (o.isNull(parameters[parameters.length - 1])) {
        parameters.pop();
    }
    return parameters;
}
/**
 * @param {?} query
 * @param {?} constantPool
 * @return {?}
 */
export function getQueryPredicate(query, constantPool) {
    if (Array.isArray(query.predicate)) {
        return constantPool.getConstLiteral(o.literalArr(query.predicate.map(selector => /** @type {?} */ (o.literal(selector)))));
    }
    else {
        return query.predicate;
    }
}
/**
 * @return {?}
 */
export function noop() { }
export class DefinitionMap {
    constructor() {
        this.values = [];
    }
    /**
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    set(key, value) {
        if (value) {
            this.values.push({ key, value, quoted: false });
        }
    }
    /**
     * @return {?}
     */
    toLiteralMap() { return o.literalMap(this.values); }
}
if (false) {
    /** @type {?} */
    DefinitionMap.prototype.values;
}
//# sourceMappingURL=util.js.map