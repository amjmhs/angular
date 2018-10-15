/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { getOrSetAsInMap } from '../render/shared';
import { copyObj, interpolateParams, iteratorToArray } from '../util';
import { buildAnimationTimelines } from './animation_timeline_builder';
import { createTransitionInstruction } from './animation_transition_instruction';
/** @type {?} */
var EMPTY_OBJECT = {};
var AnimationTransitionFactory = /** @class */ (function () {
    function AnimationTransitionFactory(_triggerName, ast, _stateStyles) {
        this._triggerName = _triggerName;
        this.ast = ast;
        this._stateStyles = _stateStyles;
    }
    /**
     * @param {?} currentState
     * @param {?} nextState
     * @param {?} element
     * @param {?} params
     * @return {?}
     */
    AnimationTransitionFactory.prototype.match = /**
     * @param {?} currentState
     * @param {?} nextState
     * @param {?} element
     * @param {?} params
     * @return {?}
     */
    function (currentState, nextState, element, params) {
        return oneOrMoreTransitionsMatch(this.ast.matchers, currentState, nextState, element, params);
    };
    /**
     * @param {?} stateName
     * @param {?} params
     * @param {?} errors
     * @return {?}
     */
    AnimationTransitionFactory.prototype.buildStyles = /**
     * @param {?} stateName
     * @param {?} params
     * @param {?} errors
     * @return {?}
     */
    function (stateName, params, errors) {
        /** @type {?} */
        var backupStateStyler = this._stateStyles['*'];
        /** @type {?} */
        var stateStyler = this._stateStyles[stateName];
        /** @type {?} */
        var backupStyles = backupStateStyler ? backupStateStyler.buildStyles(params, errors) : {};
        return stateStyler ? stateStyler.buildStyles(params, errors) : backupStyles;
    };
    /**
     * @param {?} driver
     * @param {?} element
     * @param {?} currentState
     * @param {?} nextState
     * @param {?} enterClassName
     * @param {?} leaveClassName
     * @param {?=} currentOptions
     * @param {?=} nextOptions
     * @param {?=} subInstructions
     * @param {?=} skipAstBuild
     * @return {?}
     */
    AnimationTransitionFactory.prototype.build = /**
     * @param {?} driver
     * @param {?} element
     * @param {?} currentState
     * @param {?} nextState
     * @param {?} enterClassName
     * @param {?} leaveClassName
     * @param {?=} currentOptions
     * @param {?=} nextOptions
     * @param {?=} subInstructions
     * @param {?=} skipAstBuild
     * @return {?}
     */
    function (driver, element, currentState, nextState, enterClassName, leaveClassName, currentOptions, nextOptions, subInstructions, skipAstBuild) {
        /** @type {?} */
        var errors = [];
        /** @type {?} */
        var transitionAnimationParams = this.ast.options && this.ast.options.params || EMPTY_OBJECT;
        /** @type {?} */
        var currentAnimationParams = currentOptions && currentOptions.params || EMPTY_OBJECT;
        /** @type {?} */
        var currentStateStyles = this.buildStyles(currentState, currentAnimationParams, errors);
        /** @type {?} */
        var nextAnimationParams = nextOptions && nextOptions.params || EMPTY_OBJECT;
        /** @type {?} */
        var nextStateStyles = this.buildStyles(nextState, nextAnimationParams, errors);
        /** @type {?} */
        var queriedElements = new Set();
        /** @type {?} */
        var preStyleMap = new Map();
        /** @type {?} */
        var postStyleMap = new Map();
        /** @type {?} */
        var isRemoval = nextState === 'void';
        /** @type {?} */
        var animationOptions = { params: tslib_1.__assign({}, transitionAnimationParams, nextAnimationParams) };
        /** @type {?} */
        var timelines = skipAstBuild ? [] : buildAnimationTimelines(driver, element, this.ast.animation, enterClassName, leaveClassName, currentStateStyles, nextStateStyles, animationOptions, subInstructions, errors);
        /** @type {?} */
        var totalTime = 0;
        timelines.forEach(function (tl) { totalTime = Math.max(tl.duration + tl.delay, totalTime); });
        if (errors.length) {
            return createTransitionInstruction(element, this._triggerName, currentState, nextState, isRemoval, currentStateStyles, nextStateStyles, [], [], preStyleMap, postStyleMap, totalTime, errors);
        }
        timelines.forEach(function (tl) {
            /** @type {?} */
            var elm = tl.element;
            /** @type {?} */
            var preProps = getOrSetAsInMap(preStyleMap, elm, {});
            tl.preStyleProps.forEach(function (prop) { return preProps[prop] = true; });
            /** @type {?} */
            var postProps = getOrSetAsInMap(postStyleMap, elm, {});
            tl.postStyleProps.forEach(function (prop) { return postProps[prop] = true; });
            if (elm !== element) {
                queriedElements.add(elm);
            }
        });
        /** @type {?} */
        var queriedElementsList = iteratorToArray(queriedElements.values());
        return createTransitionInstruction(element, this._triggerName, currentState, nextState, isRemoval, currentStateStyles, nextStateStyles, timelines, queriedElementsList, preStyleMap, postStyleMap, totalTime);
    };
    return AnimationTransitionFactory;
}());
export { AnimationTransitionFactory };
if (false) {
    /** @type {?} */
    AnimationTransitionFactory.prototype._triggerName;
    /** @type {?} */
    AnimationTransitionFactory.prototype.ast;
    /** @type {?} */
    AnimationTransitionFactory.prototype._stateStyles;
}
/**
 * @param {?} matchFns
 * @param {?} currentState
 * @param {?} nextState
 * @param {?} element
 * @param {?} params
 * @return {?}
 */
function oneOrMoreTransitionsMatch(matchFns, currentState, nextState, element, params) {
    return matchFns.some(function (fn) { return fn(currentState, nextState, element, params); });
}
var AnimationStateStyles = /** @class */ (function () {
    function AnimationStateStyles(styles, defaultParams) {
        this.styles = styles;
        this.defaultParams = defaultParams;
    }
    /**
     * @param {?} params
     * @param {?} errors
     * @return {?}
     */
    AnimationStateStyles.prototype.buildStyles = /**
     * @param {?} params
     * @param {?} errors
     * @return {?}
     */
    function (params, errors) {
        /** @type {?} */
        var finalStyles = {};
        /** @type {?} */
        var combinedParams = copyObj(this.defaultParams);
        Object.keys(params).forEach(function (key) {
            /** @type {?} */
            var value = params[key];
            if (value != null) {
                combinedParams[key] = value;
            }
        });
        this.styles.styles.forEach(function (value) {
            if (typeof value !== 'string') {
                /** @type {?} */
                var styleObj_1 = /** @type {?} */ (value);
                Object.keys(styleObj_1).forEach(function (prop) {
                    /** @type {?} */
                    var val = styleObj_1[prop];
                    if (val.length > 1) {
                        val = interpolateParams(val, combinedParams, errors);
                    }
                    finalStyles[prop] = val;
                });
            }
        });
        return finalStyles;
    };
    return AnimationStateStyles;
}());
export { AnimationStateStyles };
if (false) {
    /** @type {?} */
    AnimationStateStyles.prototype.styles;
    /** @type {?} */
    AnimationStateStyles.prototype.defaultParams;
}
//# sourceMappingURL=animation_transition_factory.js.map