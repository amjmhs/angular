/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** *
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
  @type {?} */
export const ANY_STATE = '*';
/**
 * @param {?} transitionValue
 * @param {?} errors
 * @return {?}
 */
export function parseTransitionExpr(transitionValue, errors) {
    /** @type {?} */
    const expressions = [];
    if (typeof transitionValue == 'string') {
        (/** @type {?} */ (transitionValue))
            .split(/\s*,\s*/)
            .forEach(str => parseInnerTransitionStr(str, expressions, errors));
    }
    else {
        expressions.push(/** @type {?} */ (transitionValue));
    }
    return expressions;
}
/**
 * @param {?} eventStr
 * @param {?} expressions
 * @param {?} errors
 * @return {?}
 */
function parseInnerTransitionStr(eventStr, expressions, errors) {
    if (eventStr[0] == ':') {
        /** @type {?} */
        const result = parseAnimationAlias(eventStr, errors);
        if (typeof result == 'function') {
            expressions.push(result);
            return;
        }
        eventStr = /** @type {?} */ (result);
    }
    /** @type {?} */
    const match = eventStr.match(/^(\*|[-\w]+)\s*(<?[=-]>)\s*(\*|[-\w]+)$/);
    if (match == null || match.length < 4) {
        errors.push(`The provided transition expression "${eventStr}" is not supported`);
        return expressions;
    }
    /** @type {?} */
    const fromState = match[1];
    /** @type {?} */
    const separator = match[2];
    /** @type {?} */
    const toState = match[3];
    expressions.push(makeLambdaFromStates(fromState, toState));
    /** @type {?} */
    const isFullAnyStateExpr = fromState == ANY_STATE && toState == ANY_STATE;
    if (separator[0] == '<' && !isFullAnyStateExpr) {
        expressions.push(makeLambdaFromStates(toState, fromState));
    }
}
/**
 * @param {?} alias
 * @param {?} errors
 * @return {?}
 */
function parseAnimationAlias(alias, errors) {
    switch (alias) {
        case ':enter':
            return 'void => *';
        case ':leave':
            return '* => void';
        case ':increment':
            return (fromState, toState) => parseFloat(toState) > parseFloat(fromState);
        case ':decrement':
            return (fromState, toState) => parseFloat(toState) < parseFloat(fromState);
        default:
            errors.push(`The transition alias value "${alias}" is not supported`);
            return '* => *';
    }
}
/** @type {?} */
const TRUE_BOOLEAN_VALUES = new Set(['true', '1']);
/** @type {?} */
const FALSE_BOOLEAN_VALUES = new Set(['false', '0']);
/**
 * @param {?} lhs
 * @param {?} rhs
 * @return {?}
 */
function makeLambdaFromStates(lhs, rhs) {
    /** @type {?} */
    const LHS_MATCH_BOOLEAN = TRUE_BOOLEAN_VALUES.has(lhs) || FALSE_BOOLEAN_VALUES.has(lhs);
    /** @type {?} */
    const RHS_MATCH_BOOLEAN = TRUE_BOOLEAN_VALUES.has(rhs) || FALSE_BOOLEAN_VALUES.has(rhs);
    return (fromState, toState) => {
        /** @type {?} */
        let lhsMatch = lhs == ANY_STATE || lhs == fromState;
        /** @type {?} */
        let rhsMatch = rhs == ANY_STATE || rhs == toState;
        if (!lhsMatch && LHS_MATCH_BOOLEAN && typeof fromState === 'boolean') {
            lhsMatch = fromState ? TRUE_BOOLEAN_VALUES.has(lhs) : FALSE_BOOLEAN_VALUES.has(lhs);
        }
        if (!rhsMatch && RHS_MATCH_BOOLEAN && typeof toState === 'boolean') {
            rhsMatch = toState ? TRUE_BOOLEAN_VALUES.has(rhs) : FALSE_BOOLEAN_VALUES.has(rhs);
        }
        return lhsMatch && rhsMatch;
    };
}
//# sourceMappingURL=animation_transition_expr.js.map