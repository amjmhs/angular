"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("../render/shared");
var util_1 = require("../util");
var animation_timeline_builder_1 = require("./animation_timeline_builder");
var animation_transition_instruction_1 = require("./animation_transition_instruction");
var EMPTY_OBJECT = {};
var AnimationTransitionFactory = /** @class */ (function () {
    function AnimationTransitionFactory(_triggerName, ast, _stateStyles) {
        this._triggerName = _triggerName;
        this.ast = ast;
        this._stateStyles = _stateStyles;
    }
    AnimationTransitionFactory.prototype.match = function (currentState, nextState, element, params) {
        return oneOrMoreTransitionsMatch(this.ast.matchers, currentState, nextState, element, params);
    };
    AnimationTransitionFactory.prototype.buildStyles = function (stateName, params, errors) {
        var backupStateStyler = this._stateStyles['*'];
        var stateStyler = this._stateStyles[stateName];
        var backupStyles = backupStateStyler ? backupStateStyler.buildStyles(params, errors) : {};
        return stateStyler ? stateStyler.buildStyles(params, errors) : backupStyles;
    };
    AnimationTransitionFactory.prototype.build = function (driver, element, currentState, nextState, enterClassName, leaveClassName, currentOptions, nextOptions, subInstructions, skipAstBuild) {
        var errors = [];
        var transitionAnimationParams = this.ast.options && this.ast.options.params || EMPTY_OBJECT;
        var currentAnimationParams = currentOptions && currentOptions.params || EMPTY_OBJECT;
        var currentStateStyles = this.buildStyles(currentState, currentAnimationParams, errors);
        var nextAnimationParams = nextOptions && nextOptions.params || EMPTY_OBJECT;
        var nextStateStyles = this.buildStyles(nextState, nextAnimationParams, errors);
        var queriedElements = new Set();
        var preStyleMap = new Map();
        var postStyleMap = new Map();
        var isRemoval = nextState === 'void';
        var animationOptions = { params: __assign({}, transitionAnimationParams, nextAnimationParams) };
        var timelines = skipAstBuild ? [] : animation_timeline_builder_1.buildAnimationTimelines(driver, element, this.ast.animation, enterClassName, leaveClassName, currentStateStyles, nextStateStyles, animationOptions, subInstructions, errors);
        var totalTime = 0;
        timelines.forEach(function (tl) { totalTime = Math.max(tl.duration + tl.delay, totalTime); });
        if (errors.length) {
            return animation_transition_instruction_1.createTransitionInstruction(element, this._triggerName, currentState, nextState, isRemoval, currentStateStyles, nextStateStyles, [], [], preStyleMap, postStyleMap, totalTime, errors);
        }
        timelines.forEach(function (tl) {
            var elm = tl.element;
            var preProps = shared_1.getOrSetAsInMap(preStyleMap, elm, {});
            tl.preStyleProps.forEach(function (prop) { return preProps[prop] = true; });
            var postProps = shared_1.getOrSetAsInMap(postStyleMap, elm, {});
            tl.postStyleProps.forEach(function (prop) { return postProps[prop] = true; });
            if (elm !== element) {
                queriedElements.add(elm);
            }
        });
        var queriedElementsList = util_1.iteratorToArray(queriedElements.values());
        return animation_transition_instruction_1.createTransitionInstruction(element, this._triggerName, currentState, nextState, isRemoval, currentStateStyles, nextStateStyles, timelines, queriedElementsList, preStyleMap, postStyleMap, totalTime);
    };
    return AnimationTransitionFactory;
}());
exports.AnimationTransitionFactory = AnimationTransitionFactory;
function oneOrMoreTransitionsMatch(matchFns, currentState, nextState, element, params) {
    return matchFns.some(function (fn) { return fn(currentState, nextState, element, params); });
}
var AnimationStateStyles = /** @class */ (function () {
    function AnimationStateStyles(styles, defaultParams) {
        this.styles = styles;
        this.defaultParams = defaultParams;
    }
    AnimationStateStyles.prototype.buildStyles = function (params, errors) {
        var finalStyles = {};
        var combinedParams = util_1.copyObj(this.defaultParams);
        Object.keys(params).forEach(function (key) {
            var value = params[key];
            if (value != null) {
                combinedParams[key] = value;
            }
        });
        this.styles.styles.forEach(function (value) {
            if (typeof value !== 'string') {
                var styleObj_1 = value;
                Object.keys(styleObj_1).forEach(function (prop) {
                    var val = styleObj_1[prop];
                    if (val.length > 1) {
                        val = util_1.interpolateParams(val, combinedParams, errors);
                    }
                    finalStyles[prop] = val;
                });
            }
        });
        return finalStyles;
    };
    return AnimationStateStyles;
}());
exports.AnimationStateStyles = AnimationStateStyles;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX3RyYW5zaXRpb25fZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2FuaW1hdGlvbnMvYnJvd3Nlci9zcmMvZHNsL2FuaW1hdGlvbl90cmFuc2l0aW9uX2ZhY3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQVVBLDJDQUFpRDtBQUNqRCxnQ0FBMkY7QUFHM0YsMkVBQXFFO0FBRXJFLHVGQUErRztBQUcvRyxJQUFNLFlBQVksR0FBRyxFQUFFLENBQUM7QUFFeEI7SUFDRSxvQ0FDWSxZQUFvQixFQUFTLEdBQWtCLEVBQy9DLFlBQXlEO1FBRHpELGlCQUFZLEdBQVosWUFBWSxDQUFRO1FBQVMsUUFBRyxHQUFILEdBQUcsQ0FBZTtRQUMvQyxpQkFBWSxHQUFaLFlBQVksQ0FBNkM7SUFBRyxDQUFDO0lBRXpFLDBDQUFLLEdBQUwsVUFBTSxZQUFpQixFQUFFLFNBQWMsRUFBRSxPQUFZLEVBQUUsTUFBNEI7UUFDakYsT0FBTyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNoRyxDQUFDO0lBRUQsZ0RBQVcsR0FBWCxVQUFZLFNBQWlCLEVBQUUsTUFBNEIsRUFBRSxNQUFhO1FBQ3hFLElBQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqRCxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2pELElBQU0sWUFBWSxHQUFHLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDNUYsT0FBTyxXQUFXLENBQUMsQ0FBQyxDQUFDLFdBQVcs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