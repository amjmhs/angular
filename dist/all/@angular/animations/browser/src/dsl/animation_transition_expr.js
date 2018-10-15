"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
exports.ANY_STATE = '*';
function parseTransitionExpr(transitionValue, errors) {
    var expressions = [];
    if (typeof transitionValue == 'string') {
        transitionValue
            .split(/\s*,\s*/)
            .forEach(function (str) { return parseInnerTransitionStr(str, expressions, errors); });
    }
    else {
        expressions.push(transitionValue);
    }
    return expressions;
}
exports.parseTransitionExpr = parseTransitionExpr;
function parseInnerTransitionStr(eventStr, expressions, errors) {
    if (eventStr[0] == ':') {
        var result = parseAnimationAlias(eventStr, errors);
        if (typeof result == 'function') {
            expressions.push(result);
            return;
        }
        eventStr = result;
    }
    var match = eventStr.match(/^(\*|[-\w]+)\s*(<?[=-]>)\s*(\*|[-\w]+)$/);
    if (match == null || match.length < 4) {
        errors.push("The provided transition expression \"" + eventStr + "\" is not supported");
        return expressions;
    }
    var fromState = match[1];
    var separator = match[2];
    var toState = match[3];
    expressions.push(makeLambdaFromStates(fromState, toState));
    var isFullAnyStateExpr = fromState == exports.ANY_STATE && toState == exports.ANY_STATE;
    if (separator[0] == '<' && !isFullAnyStateExpr) {
        expressions.push(makeLambdaFromStates(toState, fromState));
    }
}
function parseAnimationAlias(alias, errors) {
    switch (alias) {
        case ':enter':
            return 'void => *';
        case ':leave':
            return '* => void';
        case ':increment':
            return function (fromState, toState) { return parseFloat(toState) > parseFloat(fromState); };
        case ':decrement':
            return function (fromState, toState) { return parseFloat(toState) < parseFloat(fromState); };
        default:
            errors.push("The transition alias value \"" + alias + "\" is not supported");
            return '* => *';
    }
}
// DO NOT REFACTOR ... keep the follow set instantiations
// with the values intact (closure compiler for some reason
// removes follow-up lines that add the values outside of
// the constructor...
var TRUE_BOOLEAN_VALUES = new Set(['true', '1']);
var FALSE_BOOLEAN_VALUES = new Set(['false', '0']);
function makeLambdaFromStates(lhs, rhs) {
    var LHS_MATCH_BOOLEAN = TRUE_BOOLEAN_VALUES.has(lhs) || FALSE_BOOLEAN_VALUES.has(lhs);
    var RHS_MATCH_BOOLEAN = TRUE_BOOLEAN_VALUES.has(rhs) || FALSE_BOOLEAN_VALUES.has(rhs);
    return function (fromState, toState) {
        var lhsMatch = lhs == exports.ANY_STATE || lhs == fromState;
        var rhsMatch = rhs == exports.ANY_STATE || rhs == toState;
        if (!lhsMatch && LHS_MATCH_BOOLEAN && typeof fromState === 'boolean') {
            lhsMatch = fromState ? TRUE_BOOLEAN_VALUES.has(lhs) : FALSE_BOOLEAN_VALUES.has(lhs);
        }
        if (!rhsMatch && RHS_MATCH_BOOLEAN && typeof toState === 'boolean') {
            rhsMatch = toState ? TRUE_BOOLEAN_VALUES.has(rhs) : FALSE_BOOLEAN_VALUES.has(rhs);
        }
        return lhsMatch && rhsMatch;
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX3RyYW5zaXRpb25fZXhwci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2FuaW1hdGlvbnMvYnJvd3Nlci9zcmMvZHNsL2FuaW1hdGlvbl90cmFuc2l0aW9uX2V4cHIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDVSxRQUFBLFNBQVMsR0FBRyxHQUFHLENBQUM7QUFJN0IsNkJBQ0ksZUFBNkMsRUFBRSxNQUFnQjtJQUNqRSxJQUFNLFdBQVcsR0FBMEIsRUFBRSxDQUFDO0lBQzlDLElBQUksT0FBTyxlQUFlLElBQUksUUFBUSxFQUFFO1FBQzdCLGVBQWdCO2FBQ3BCLEtBQUssQ0FBQyxTQUFTLENBQUM7YUFDaEIsT0FBTyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsdUJBQXVCLENBQUMsR0FBRyxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUMsRUFBakQsQ0FBaUQsQ0FBQyxDQUFDO0tBQ3hFO1NBQU07UUFDTCxXQUFXLENBQUMsSUFBSSxDQUFzQixlQUFlLENBQUMsQ0FBQztLQUN4RDtJQUNELE9BQU8sV0FBVyxDQUFDO0FBQ3JCLENBQUM7QUFYRCxrREFXQztBQUVELGlDQUNJLFFBQWdCLEVBQUUsV0FBa0MsRUFBRSxNQUFnQjtJQUN4RSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLEVBQUU7UUFDdEIsSUFBTSxNQUFNLEdBQUcsbUJBQW1CLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3JELElBQUksT0FBTyxNQUFNLElBQUksVUFBVSxFQUFFO1lBQy9CLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDekIsT0FBTztTQUNSO1FBQ0QsUUFBUSxHQUFHLE1BQWdCLENBQUM7S0FDN0I7SUFFRCxJQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7SUFD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