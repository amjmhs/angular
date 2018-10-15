/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { AUTO_STYLE, ɵPRE_STYLE as PRE_STYLE } from '@angular/animations';
import { copyObj, copyStyles, interpolateParams, iteratorToArray, resolveTiming, resolveTimingValue, visitDslNode } from '../util';
import { createTimelineInstruction } from './animation_timeline_instruction';
import { ElementInstructionMap } from './element_instruction_map';
/** @type {?} */
var ONE_FRAME_IN_MILLISECONDS = 1;
/** @type {?} */
var ENTER_TOKEN = ':enter';
/** @type {?} */
var ENTER_TOKEN_REGEX = new RegExp(ENTER_TOKEN, 'g');
/** @type {?} */
var LEAVE_TOKEN = ':leave';
/** @type {?} */
var LEAVE_TOKEN_REGEX = new RegExp(LEAVE_TOKEN, 'g');
/**
 * @param {?} driver
 * @param {?} rootElement
 * @param {?} ast
 * @param {?} enterClassName
 * @param {?} leaveClassName
 * @param {?=} startingStyles
 * @param {?=} finalStyles
 * @param {?=} options
 * @param {?=} subInstructions
 * @param {?=} errors
 * @return {?}
 */
export function buildAnimationTimelines(driver, rootElement, ast, enterClassName, leaveClassName, startingStyles, finalStyles, options, subInstructions, errors) {
    if (startingStyles === void 0) { startingStyles = {}; }
    if (finalStyles === void 0) { finalStyles = {}; }
    if (errors === void 0) { errors = []; }
    return new AnimationTimelineBuilderVisitor().buildKeyframes(driver, rootElement, ast, enterClassName, leaveClassName, startingStyles, finalStyles, options, subInstructions, errors);
}
var AnimationTimelineBuilderVisitor = /** @class */ (function () {
    function AnimationTimelineBuilderVisitor() {
    }
    /**
     * @param {?} driver
     * @param {?} rootElement
     * @param {?} ast
     * @param {?} enterClassName
     * @param {?} leaveClassName
     * @param {?} startingStyles
     * @param {?} finalStyles
     * @param {?} options
     * @param {?=} subInstructions
     * @param {?=} errors
     * @return {?}
     */
    AnimationTimelineBuilderVisitor.prototype.buildKeyframes = /**
     * @param {?} driver
     * @param {?} rootElement
     * @param {?} ast
     * @param {?} enterClassName
     * @param {?} leaveClassName
     * @param {?} startingStyles
     * @param {?} finalStyles
     * @param {?} options
     * @param {?=} subInstructions
     * @param {?=} errors
     * @return {?}
     */
    function (driver, rootElement, ast, enterClassName, leaveClassName, startingStyles, finalStyles, options, subInstructions, errors) {
        if (errors === void 0) { errors = []; }
        subInstructions = subInstructions || new ElementInstructionMap();
        /** @type {?} */
        var context = new AnimationTimelineContext(driver, rootElement, subInstructions, enterClassName, leaveClassName, errors, []);
        context.options = options;
        context.currentTimeline.setStyles([startingStyles], null, context.errors, options);
        visitDslNode(this, ast, context);
        /** @type {?} */
        var timelines = context.timelines.filter(function (timeline) { return timeline.containsAnimation(); });
        if (timelines.length && Object.keys(finalStyles).length) {
            /** @type {?} */
            var tl = timelines[timelines.length - 1];
            if (!tl.allowOnlyTimelineStyles()) {
                tl.setStyles([finalStyles], null, context.errors, options);
            }
        }
        return timelines.length ? timelines.map(function (timeline) { return timeline.buildKeyframes(); }) :
            [createTimelineInstruction(rootElement, [], [], [], 0, 0, '', false)];
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTimelineBuilderVisitor.prototype.visitTrigger = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) {
        // these values are not visited in this AST
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTimelineBuilderVisitor.prototype.visitState = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) {
        // these values are not visited in this AST
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTimelineBuilderVisitor.prototype.visitTransition = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) {
        // these values are not visited in this AST
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTimelineBuilderVisitor.prototype.visitAnimateChild = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) {
        /** @type {?} */
        var elementInstructions = context.subInstructions.consume(context.element);
        if (elementInstructions) {
            /** @type {?} */
            var innerContext = context.createSubContext(ast.options);
            /** @type {?} */
            var startTime = context.currentTimeline.currentTime;
            /** @type {?} */
            var endTime = this._visitSubInstructions(elementInstructions, innerContext, /** @type {?} */ (innerContext.options));
            if (startTime != endTime) {
                // we do this on the upper context because we created a sub context for
                // the sub child animations
                context.transformIntoNewTimeline(endTime);
            }
        }
        context.previousNode = ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTimelineBuilderVisitor.prototype.visitAnimateRef = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) {
        /** @type {?} */
        var innerContext = context.createSubContext(ast.options);
        innerContext.transformIntoNewTimeline();
        this.visitReference(ast.animation, innerContext);
        context.transformIntoNewTimeline(innerContext.currentTimeline.currentTime);
        context.previousNode = ast;
    };
    /**
     * @param {?} instructions
     * @param {?} context
     * @param {?} options
     * @return {?}
     */
    AnimationTimelineBuilderVisitor.prototype._visitSubInstructions = /**
     * @param {?} instructions
     * @param {?} context
     * @param {?} options
     * @return {?}
     */
    function (instructions, context, options) {
        /** @type {?} */
        var startTime = context.currentTimeline.currentTime;
        /** @type {?} */
        var furthestTime = startTime;
        /** @type {?} */
        var duration = options.duration != null ? resolveTimingValue(options.duration) : null;
        /** @type {?} */
        var delay = options.delay != null ? resolveTimingValue(options.delay) : null;
        if (duration !== 0) {
            instructions.forEach(function (instruction) {
                /** @type {?} */
                var instructionTimings = context.appendInstructionToTimeline(instruction, duration, delay);
                furthestTime =
                    Math.max(furthestTime, instructionTimings.duration + instructionTimings.delay);
            });
        }
        return furthestTime;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTimelineBuilderVisitor.prototype.visitReference = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) {
        context.updateOptions(ast.options, true);
        visitDslNode(this, ast.animation, context);
        context.previousNode = ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTimelineBuilderVisitor.prototype.visitSequence = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) {
        var _this = this;
        /** @type {?} */
        var subContextCount = context.subContextCount;
        /** @type {?} */
        var ctx = context;
        /** @type {?} */
        var options = ast.options;
        if (options && (options.params || options.delay)) {
            ctx = context.createSubContext(options);
            ctx.transformIntoNewTimeline();
            if (options.delay != null) {
                if (ctx.previousNode.type == 6 /* Style */) {
                    ctx.currentTimeline.snapshotCurrentStyles();
                    ctx.previousNode = DEFAULT_NOOP_PREVIOUS_NODE;
                }
                /** @type {?} */
                var delay = resolveTimingValue(options.delay);
                ctx.delayNextStep(delay);
            }
        }
        if (ast.steps.length) {
            ast.steps.forEach(function (s) { return visitDslNode(_this, s, ctx); });
            // this is here just incase the inner steps only contain or end with a style() call
            ctx.currentTimeline.applyStylesToKeyframe();
            // this means that some animation function within the sequence
            // ended up creating a sub timeline (which means the current
            // timeline cannot overlap with the contents of the sequence)
            if (ctx.subContextCount > subContextCount) {
                ctx.transformIntoNewTimeline();
            }
        }
        context.previousNode = ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTimelineBuilderVisitor.prototype.visitGroup = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) {
        var _this = this;
        /** @type {?} */
        var innerTimelines = [];
        /** @type {?} */
        var furthestTime = context.currentTimeline.currentTime;
        /** @type {?} */
        var delay = ast.options && ast.options.delay ? resolveTimingValue(ast.options.delay) : 0;
        ast.steps.forEach(function (s) {
            /** @type {?} */
            var innerContext = context.createSubContext(ast.options);
            if (delay) {
                innerContext.delayNextStep(delay);
            }
            visitDslNode(_this, s, innerContext);
            furthestTime = Math.max(furthestTime, innerContext.currentTimeline.currentTime);
            innerTimelines.push(innerContext.currentTimeline);
        });
        // this operation is run after the AST loop because otherwise
        // if the parent timeline's collected styles were updated then
        // it would pass in invalid data into the new-to-be forked items
        innerTimelines.forEach(function (timeline) { return context.currentTimeline.mergeTimelineCollectedStyles(timeline); });
        context.transformIntoNewTimeline(furthestTime);
        context.previousNode = ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTimelineBuilderVisitor.prototype._visitTiming = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) {
        if ((/** @type {?} */ (ast)).dynamic) {
            /** @type {?} */
            var strValue = (/** @type {?} */ (ast)).strValue;
            /** @type {?} */
            var timingValue = context.params ? interpolateParams(strValue, context.params, context.errors) : strValue;
            return resolveTiming(timingValue, context.errors);
        }
        else {
            return { duration: ast.duration, delay: ast.delay, easing: ast.easing };
        }
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTimelineBuilderVisitor.prototype.visitAnimate = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) {
        /** @type {?} */
        var timings = context.currentAnimateTimings = this._visitTiming(ast.timings, context);
        /** @type {?} */
        var timeline = context.currentTimeline;
        if (timings.delay) {
            context.incrementTime(timings.delay);
            timeline.snapshotCurrentStyles();
        }
        /** @type {?} */
        var style = ast.style;
        if (style.type == 5 /* Keyframes */) {
            this.visitKeyframes(style, context);
        }
        else {
            context.incrementTime(timings.duration);
            this.visitStyle(/** @type {?} */ (style), context);
            timeline.applyStylesToKeyframe();
        }
        context.currentAnimateTimings = null;
        context.previousNode = ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTimelineBuilderVisitor.prototype.visitStyle = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) {
        /** @type {?} */
        var timeline = context.currentTimeline;
        /** @type {?} */
        var timings = /** @type {?} */ ((context.currentAnimateTimings));
        // this is a special case for when a style() call
        // directly follows  an animate() call (but not inside of an animate() call)
        if (!timings && timeline.getCurrentStyleProperties().length) {
            timeline.forwardFrame();
        }
        /** @type {?} */
        var easing = (timings && timings.easing) || ast.easing;
        if (ast.isEmptyStep) {
            timeline.applyEmptyStep(easing);
        }
        else {
            timeline.setStyles(ast.styles, easing, context.errors, context.options);
        }
        context.previousNode = ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTimelineBuilderVisitor.prototype.visitKeyframes = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) {
        /** @type {?} */
        var currentAnimateTimings = /** @type {?} */ ((context.currentAnimateTimings));
        /** @type {?} */
        var startTime = (/** @type {?} */ ((context.currentTimeline))).duration;
        /** @type {?} */
        var duration = currentAnimateTimings.duration;
        /** @type {?} */
        var innerContext = context.createSubContext();
        /** @type {?} */
        var innerTimeline = innerContext.currentTimeline;
        innerTimeline.easing = currentAnimateTimings.easing;
        ast.styles.forEach(function (step) {
            /** @type {?} */
            var offset = step.offset || 0;
            innerTimeline.forwardTime(offset * duration);
            innerTimeline.setStyles(step.styles, step.easing, context.errors, context.options);
            innerTimeline.applyStylesToKeyframe();
        });
        // this will ensure that the parent timeline gets all the styles from
        // the child even if the new timeline below is not used
        context.currentTimeline.mergeTimelineCollectedStyles(innerTimeline);
        // we do this because the window between this timeline and the sub timeline
        // should ensure that the styles within are exactly the same as they were before
        context.transformIntoNewTimeline(startTime + duration);
        context.previousNode = ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTimelineBuilderVisitor.prototype.visitQuery = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) {
        var _this = this;
        /** @type {?} */
        var startTime = context.currentTimeline.currentTime;
        /** @type {?} */
        var options = /** @type {?} */ ((ast.options || {}));
        /** @type {?} */
        var delay = options.delay ? resolveTimingValue(options.delay) : 0;
        if (delay && (context.previousNode.type === 6 /* Style */ ||
            (startTime == 0 && context.currentTimeline.getCurrentStyleProperties().length))) {
            context.currentTimeline.snapshotCurrentStyles();
            context.previousNode = DEFAULT_NOOP_PREVIOUS_NODE;
        }
        /** @type {?} */
        var furthestTime = startTime;
        /** @type {?} */
        var elms = context.invokeQuery(ast.selector, ast.originalSelector, ast.limit, ast.includeSelf, options.optional ? true : false, context.errors);
        context.currentQueryTotal = elms.length;
        /** @type {?} */
        var sameElementTimeline = null;
        elms.forEach(function (element, i) {
            context.currentQueryIndex = i;
            /** @type {?} */
            var innerContext = context.createSubContext(ast.options, element);
            if (delay) {
                innerContext.delayNextStep(delay);
            }
            if (element === context.element) {
                sameElementTimeline = innerContext.currentTimeline;
            }
            visitDslNode(_this, ast.animation, innerContext);
            // this is here just incase the inner steps only contain or end
            // with a style() call (which is here to signal that this is a preparatory
            // call to style an element before it is animated again)
            innerContext.currentTimeline.applyStylesToKeyframe();
            /** @type {?} */
            var endTime = innerContext.currentTimeline.currentTime;
            furthestTime = Math.max(furthestTime, endTime);
        });
        context.currentQueryIndex = 0;
        context.currentQueryTotal = 0;
        context.transformIntoNewTimeline(furthestTime);
        if (sameElementTimeline) {
            context.currentTimeline.mergeTimelineCollectedStyles(sameElementTimeline);
            context.currentTimeline.snapshotCurrentStyles();
        }
        context.previousNode = ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTimelineBuilderVisitor.prototype.visitStagger = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) {
        /** @type {?} */
        var parentContext = /** @type {?} */ ((context.parentContext));
        /** @type {?} */
        var tl = context.currentTimeline;
        /** @type {?} */
        var timings = ast.timings;
        /** @type {?} */
        var duration = Math.abs(timings.duration);
        /** @type {?} */
        var maxTime = duration * (context.currentQueryTotal - 1);
        /** @type {?} */
        var delay = duration * context.currentQueryIndex;
        /** @type {?} */
        var staggerTransformer = timings.duration < 0 ? 'reverse' : timings.easing;
        switch (staggerTransformer) {
            case 'reverse':
                delay = maxTime - delay;
                break;
            case 'full':
                delay = parentContext.currentStaggerTime;
                break;
        }
        /** @type {?} */
        var timeline = context.currentTimeline;
        if (delay) {
            timeline.delayNextStep(delay);
        }
        /** @type {?} */
        var startingTime = timeline.currentTime;
        visitDslNode(this, ast.animation, context);
        context.previousNode = ast;
        // time = duration + delay
        // the reason why this computation is so complex is because
        // the inner timeline may either have a delay value or a stretched
        // keyframe depending on if a subtimeline is not used or is used.
        parentContext.currentStaggerTime =
            (tl.currentTime - startingTime) + (tl.startTime - parentContext.currentTimeline.startTime);
    };
    return AnimationTimelineBuilderVisitor;
}());
export { AnimationTimelineBuilderVisitor };
/** @type {?} */
var DEFAULT_NOOP_PREVIOUS_NODE = /** @type {?} */ ({});
var AnimationTimelineContext = /** @class */ (function () {
    function AnimationTimelineContext(_driver, element, subInstructions, _enterClassName, _leaveClassName, errors, timelines, initialTimeline) {
        this._driver = _driver;
        this.element = element;
        this.subInstructions = subInstructions;
        this._enterClassName = _enterClassName;
        this._leaveClassName = _leaveClassName;
        this.errors = errors;
        this.timelines = timelines;
        this.parentContext = null;
        this.currentAnimateTimings = null;
        this.previousNode = DEFAULT_NOOP_PREVIOUS_NODE;
        this.subContextCount = 0;
        this.options = {};
        this.currentQueryIndex = 0;
        this.currentQueryTotal = 0;
        this.currentStaggerTime = 0;
        this.currentTimeline = initialTimeline || new TimelineBuilder(this._driver, element, 0);
        timelines.push(this.currentTimeline);
    }
    Object.defineProperty(AnimationTimelineContext.prototype, "params", {
        get: /**
         * @return {?}
         */
        function () { return this.options.params; },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} options
     * @param {?=} skipIfExists
     * @return {?}
     */
    AnimationTimelineContext.prototype.updateOptions = /**
     * @param {?} options
     * @param {?=} skipIfExists
     * @return {?}
     */
    function (options, skipIfExists) {
        var _this = this;
        if (!options)
            return;
        /** @type {?} */
        var newOptions = /** @type {?} */ (options);
        /** @type {?} */
        var optionsToUpdate = this.options;
        // NOTE: this will get patched up when other animation methods support duration overrides
        if (newOptions.duration != null) {
            (/** @type {?} */ (optionsToUpdate)).duration = resolveTimingValue(newOptions.duration);
        }
        if (newOptions.delay != null) {
            optionsToUpdate.delay = resolveTimingValue(newOptions.delay);
        }
        /** @type {?} */
        var newParams = newOptions.params;
        if (newParams) {
            /** @type {?} */
            var paramsToUpdate_1 = /** @type {?} */ ((optionsToUpdate.params));
            if (!paramsToUpdate_1) {
                paramsToUpdate_1 = this.options.params = {};
            }
            Object.keys(newParams).forEach(function (name) {
                if (!skipIfExists || !paramsToUpdate_1.hasOwnProperty(name)) {
                    paramsToUpdate_1[name] = interpolateParams(newParams[name], paramsToUpdate_1, _this.errors);
                }
            });
        }
    };
    /**
     * @return {?}
     */
    AnimationTimelineContext.prototype._copyOptions = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var options = {};
        if (this.options) {
            /** @type {?} */
            var oldParams_1 = this.options.params;
            if (oldParams_1) {
                /** @type {?} */
                var params_1 = options['params'] = {};
                Object.keys(oldParams_1).forEach(function (name) { params_1[name] = oldParams_1[name]; });
            }
        }
        return options;
    };
    /**
     * @param {?=} options
     * @param {?=} element
     * @param {?=} newTime
     * @return {?}
     */
    AnimationTimelineContext.prototype.createSubContext = /**
     * @param {?=} options
     * @param {?=} element
     * @param {?=} newTime
     * @return {?}
     */
    function (options, element, newTime) {
        if (options === void 0) { options = null; }
        /** @type {?} */
        var target = element || this.element;
        /** @type {?} */
        var context = new AnimationTimelineContext(this._driver, target, this.subInstructions, this._enterClassName, this._leaveClassName, this.errors, this.timelines, this.currentTimeline.fork(target, newTime || 0));
        context.previousNode = this.previousNode;
        context.currentAnimateTimings = this.currentAnimateTimings;
        context.options = this._copyOptions();
        context.updateOptions(options);
        context.currentQueryIndex = this.currentQueryIndex;
        context.currentQueryTotal = this.currentQueryTotal;
        context.parentContext = this;
        this.subContextCount++;
        return context;
    };
    /**
     * @param {?=} newTime
     * @return {?}
     */
    AnimationTimelineContext.prototype.transformIntoNewTimeline = /**
     * @param {?=} newTime
     * @return {?}
     */
    function (newTime) {
        this.previousNode = DEFAULT_NOOP_PREVIOUS_NODE;
        this.currentTimeline = this.currentTimeline.fork(this.element, newTime);
        this.timelines.push(this.currentTimeline);
        return this.currentTimeline;
    };
    /**
     * @param {?} instruction
     * @param {?} duration
     * @param {?} delay
     * @return {?}
     */
    AnimationTimelineContext.prototype.appendInstructionToTimeline = /**
     * @param {?} instruction
     * @param {?} duration
     * @param {?} delay
     * @return {?}
     */
    function (instruction, duration, delay) {
        /** @type {?} */
        var updatedTimings = {
            duration: duration != null ? duration : instruction.duration,
            delay: this.currentTimeline.currentTime + (delay != null ? delay : 0) + instruction.delay,
            easing: ''
        };
        /** @type {?} */
        var builder = new SubTimelineBuilder(this._driver, instruction.element, instruction.keyframes, instruction.preStyleProps, instruction.postStyleProps, updatedTimings, instruction.stretchStartingKeyframe);
        this.timelines.push(builder);
        return updatedTimings;
    };
    /**
     * @param {?} time
     * @return {?}
     */
    AnimationTimelineContext.prototype.incrementTime = /**
     * @param {?} time
     * @return {?}
     */
    function (time) {
        this.currentTimeline.forwardTime(this.currentTimeline.duration + time);
    };
    /**
     * @param {?} delay
     * @return {?}
     */
    AnimationTimelineContext.prototype.delayNextStep = /**
     * @param {?} delay
     * @return {?}
     */
    function (delay) {
        // negative delays are not yet supported
        if (delay > 0) {
            this.currentTimeline.delayNextStep(delay);
        }
    };
    /**
     * @param {?} selector
     * @param {?} originalSelector
     * @param {?} limit
     * @param {?} includeSelf
     * @param {?} optional
     * @param {?} errors
     * @return {?}
     */
    AnimationTimelineContext.prototype.invokeQuery = /**
     * @param {?} selector
     * @param {?} originalSelector
     * @param {?} limit
     * @param {?} includeSelf
     * @param {?} optional
     * @param {?} errors
     * @return {?}
     */
    function (selector, originalSelector, limit, includeSelf, optional, errors) {
        /** @type {?} */
        var results = [];
        if (includeSelf) {
            results.push(this.element);
        }
        if (selector.length > 0) { // if :self is only used then the selector is empty
            // if :self is only used then the selector is empty
            selector = selector.replace(ENTER_TOKEN_REGEX, '.' + this._enterClassName);
            selector = selector.replace(LEAVE_TOKEN_REGEX, '.' + this._leaveClassName);
            /** @type {?} */
            var multi = limit != 1;
            /** @type {?} */
            var elements = this._driver.query(this.element, selector, multi);
            if (limit !== 0) {
                elements = limit < 0 ? elements.slice(elements.length + limit, elements.length) :
                    elements.slice(0, limit);
            }
            results.push.apply(results, elements);
        }
        if (!optional && results.length == 0) {
            errors.push("`query(\"" + originalSelector + "\")` returned zero elements. (Use `query(\"" + originalSelector + "\", { optional: true })` if you wish to allow this.)");
        }
        return results;
    };
    return AnimationTimelineContext;
}());
export { AnimationTimelineContext };
if (false) {
    /** @type {?} */
    AnimationTimelineContext.prototype.parentContext;
    /** @type {?} */
    AnimationTimelineContext.prototype.currentTimeline;
    /** @type {?} */
    AnimationTimelineContext.prototype.currentAnimateTimings;
    /** @type {?} */
    AnimationTimelineContext.prototype.previousNode;
    /** @type {?} */
    AnimationTimelineContext.prototype.subContextCount;
    /** @type {?} */
    AnimationTimelineContext.prototype.options;
    /** @type {?} */
    AnimationTimelineContext.prototype.currentQueryIndex;
    /** @type {?} */
    AnimationTimelineContext.prototype.currentQueryTotal;
    /** @type {?} */
    AnimationTimelineContext.prototype.currentStaggerTime;
    /** @type {?} */
    AnimationTimelineContext.prototype._driver;
    /** @type {?} */
    AnimationTimelineContext.prototype.element;
    /** @type {?} */
    AnimationTimelineContext.prototype.subInstructions;
    /** @type {?} */
    AnimationTimelineContext.prototype._enterClassName;
    /** @type {?} */
    AnimationTimelineContext.prototype._leaveClassName;
    /** @type {?} */
    AnimationTimelineContext.prototype.errors;
    /** @type {?} */
    AnimationTimelineContext.prototype.timelines;
}
var TimelineBuilder = /** @class */ (function () {
    function TimelineBuilder(_driver, element, startTime, _elementTimelineStylesLookup) {
        this._driver = _driver;
        this.element = element;
        this.startTime = startTime;
        this._elementTimelineStylesLookup = _elementTimelineStylesLookup;
        this.duration = 0;
        this._previousKeyframe = {};
        this._currentKeyframe = {};
        this._keyframes = new Map();
        this._styleSummary = {};
        this._pendingStyles = {};
        this._backFill = {};
        this._currentEmptyStepKeyframe = null;
        if (!this._elementTimelineStylesLookup) {
            this._elementTimelineStylesLookup = new Map();
        }
        this._localTimelineStyles = Object.create(this._backFill, {});
        this._globalTimelineStyles = /** @type {?} */ ((this._elementTimelineStylesLookup.get(element)));
        if (!this._globalTimelineStyles) {
            this._globalTimelineStyles = this._localTimelineStyles;
            this._elementTimelineStylesLookup.set(element, this._localTimelineStyles);
        }
        this._loadKeyframe();
    }
    /**
     * @return {?}
     */
    TimelineBuilder.prototype.containsAnimation = /**
     * @return {?}
     */
    function () {
        switch (this._keyframes.size) {
            case 0:
                return false;
            case 1:
                return this.getCurrentStyleProperties().length > 0;
            default:
                return true;
        }
    };
    /**
     * @return {?}
     */
    TimelineBuilder.prototype.getCurrentStyleProperties = /**
     * @return {?}
     */
    function () { return Object.keys(this._currentKeyframe); };
    Object.defineProperty(TimelineBuilder.prototype, "currentTime", {
        get: /**
         * @return {?}
         */
        function () { return this.startTime + this.duration; },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} delay
     * @return {?}
     */
    TimelineBuilder.prototype.delayNextStep = /**
     * @param {?} delay
     * @return {?}
     */
    function (delay) {
        /** @type {?} */
        var hasPreStyleStep = this._keyframes.size == 1 && Object.keys(this._pendingStyles).length;
        if (this.duration || hasPreStyleStep) {
            this.forwardTime(this.currentTime + delay);
            if (hasPreStyleStep) {
                this.snapshotCurrentStyles();
            }
        }
        else {
            this.startTime += delay;
        }
    };
    /**
     * @param {?} element
     * @param {?=} currentTime
     * @return {?}
     */
    TimelineBuilder.prototype.fork = /**
     * @param {?} element
     * @param {?=} currentTime
     * @return {?}
     */
    function (element, currentTime) {
        this.applyStylesToKeyframe();
        return new TimelineBuilder(this._driver, element, currentTime || this.currentTime, this._elementTimelineStylesLookup);
    };
    /**
     * @return {?}
     */
    TimelineBuilder.prototype._loadKeyframe = /**
     * @return {?}
     */
    function () {
        if (this._currentKeyframe) {
            this._previousKeyframe = this._currentKeyframe;
        }
        this._currentKeyframe = /** @type {?} */ ((this._keyframes.get(this.duration)));
        if (!this._currentKeyframe) {
            this._currentKeyframe = Object.create(this._backFill, {});
            this._keyframes.set(this.duration, this._currentKeyframe);
        }
    };
    /**
     * @return {?}
     */
    TimelineBuilder.prototype.forwardFrame = /**
     * @return {?}
     */
    function () {
        this.duration += ONE_FRAME_IN_MILLISECONDS;
        this._loadKeyframe();
    };
    /**
     * @param {?} time
     * @return {?}
     */
    TimelineBuilder.prototype.forwardTime = /**
     * @param {?} time
     * @return {?}
     */
    function (time) {
        this.applyStylesToKeyframe();
        this.duration = time;
        this._loadKeyframe();
    };
    /**
     * @param {?} prop
     * @param {?} value
     * @return {?}
     */
    TimelineBuilder.prototype._updateStyle = /**
     * @param {?} prop
     * @param {?} value
     * @return {?}
     */
    function (prop, value) {
        this._localTimelineStyles[prop] = value;
        this._globalTimelineStyles[prop] = value;
        this._styleSummary[prop] = { time: this.currentTime, value: value };
    };
    /**
     * @return {?}
     */
    TimelineBuilder.prototype.allowOnlyTimelineStyles = /**
     * @return {?}
     */
    function () { return this._currentEmptyStepKeyframe !== this._currentKeyframe; };
    /**
     * @param {?} easing
     * @return {?}
     */
    TimelineBuilder.prototype.applyEmptyStep = /**
     * @param {?} easing
     * @return {?}
     */
    function (easing) {
        var _this = this;
        if (easing) {
            this._previousKeyframe['easing'] = easing;
        }
        // special case for animate(duration):
        // all missing styles are filled with a `*` value then
        // if any destination styles are filled in later on the same
        // keyframe then they will override the overridden styles
        // We use `_globalTimelineStyles` here because there may be
        // styles in previous keyframes that are not present in this timeline
        Object.keys(this._globalTimelineStyles).forEach(function (prop) {
            _this._backFill[prop] = _this._globalTimelineStyles[prop] || AUTO_STYLE;
            _this._currentKeyframe[prop] = AUTO_STYLE;
        });
        this._currentEmptyStepKeyframe = this._currentKeyframe;
    };
    /**
     * @param {?} input
     * @param {?} easing
     * @param {?} errors
     * @param {?=} options
     * @return {?}
     */
    TimelineBuilder.prototype.setStyles = /**
     * @param {?} input
     * @param {?} easing
     * @param {?} errors
     * @param {?=} options
     * @return {?}
     */
    function (input, easing, errors, options) {
        var _this = this;
        if (easing) {
            this._previousKeyframe['easing'] = easing;
        }
        /** @type {?} */
        var params = (options && options.params) || {};
        /** @type {?} */
        var styles = flattenStyles(input, this._globalTimelineStyles);
        Object.keys(styles).forEach(function (prop) {
            /** @type {?} */
            var val = interpolateParams(styles[prop], params, errors);
            _this._pendingStyles[prop] = val;
            if (!_this._localTimelineStyles.hasOwnProperty(prop)) {
                _this._backFill[prop] = _this._globalTimelineStyles.hasOwnProperty(prop) ?
                    _this._globalTimelineStyles[prop] :
                    AUTO_STYLE;
            }
            _this._updateStyle(prop, val);
        });
    };
    /**
     * @return {?}
     */
    TimelineBuilder.prototype.applyStylesToKeyframe = /**
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var styles = this._pendingStyles;
        /** @type {?} */
        var props = Object.keys(styles);
        if (props.length == 0)
            return;
        this._pendingStyles = {};
        props.forEach(function (prop) {
            /** @type {?} */
            var val = styles[prop];
            _this._currentKeyframe[prop] = val;
        });
        Object.keys(this._localTimelineStyles).forEach(function (prop) {
            if (!_this._currentKeyframe.hasOwnProperty(prop)) {
                _this._currentKeyframe[prop] = _this._localTimelineStyles[prop];
            }
        });
    };
    /**
     * @return {?}
     */
    TimelineBuilder.prototype.snapshotCurrentStyles = /**
     * @return {?}
     */
    function () {
        var _this = this;
        Object.keys(this._localTimelineStyles).forEach(function (prop) {
            /** @type {?} */
            var val = _this._localTimelineStyles[prop];
            _this._pendingStyles[prop] = val;
            _this._updateStyle(prop, val);
        });
    };
    /**
     * @return {?}
     */
    TimelineBuilder.prototype.getFinalKeyframe = /**
     * @return {?}
     */
    function () { return this._keyframes.get(this.duration); };
    Object.defineProperty(TimelineBuilder.prototype, "properties", {
        get: /**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var properties = [];
            for (var prop in this._currentKeyframe) {
                properties.push(prop);
            }
            return properties;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} timeline
     * @return {?}
     */
    TimelineBuilder.prototype.mergeTimelineCollectedStyles = /**
     * @param {?} timeline
     * @return {?}
     */
    function (timeline) {
        var _this = this;
        Object.keys(timeline._styleSummary).forEach(function (prop) {
            /** @type {?} */
            var details0 = _this._styleSummary[prop];
            /** @type {?} */
            var details1 = timeline._styleSummary[prop];
            if (!details0 || details1.time > details0.time) {
                _this._updateStyle(prop, details1.value);
            }
        });
    };
    /**
     * @return {?}
     */
    TimelineBuilder.prototype.buildKeyframes = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.applyStylesToKeyframe();
        /** @type {?} */
        var preStyleProps = new Set();
        /** @type {?} */
        var postStyleProps = new Set();
        /** @type {?} */
        var isEmpty = this._keyframes.size === 1 && this.duration === 0;
        /** @type {?} */
        var finalKeyframes = [];
        this._keyframes.forEach(function (keyframe, time) {
            /** @type {?} */
            var finalKeyframe = copyStyles(keyframe, true);
            Object.keys(finalKeyframe).forEach(function (prop) {
                /** @type {?} */
                var value = finalKeyframe[prop];
                if (value == PRE_STYLE) {
                    preStyleProps.add(prop);
                }
                else if (value == AUTO_STYLE) {
                    postStyleProps.add(prop);
                }
            });
            if (!isEmpty) {
                finalKeyframe['offset'] = time / _this.duration;
            }
            finalKeyframes.push(finalKeyframe);
        });
        /** @type {?} */
        var preProps = preStyleProps.size ? iteratorToArray(preStyleProps.values()) : [];
        /** @type {?} */
        var postProps = postStyleProps.size ? iteratorToArray(postStyleProps.values()) : [];
        // special case for a 0-second animation (which is designed just to place styles onscreen)
        if (isEmpty) {
            /** @type {?} */
            var kf0 = finalKeyframes[0];
            /** @type {?} */
            var kf1 = copyObj(kf0);
            kf0['offset'] = 0;
            kf1['offset'] = 1;
            finalKeyframes = [kf0, kf1];
        }
        return createTimelineInstruction(this.element, finalKeyframes, preProps, postProps, this.duration, this.startTime, this.easing, false);
    };
    return TimelineBuilder;
}());
export { TimelineBuilder };
if (false) {
    /** @type {?} */
    TimelineBuilder.prototype.duration;
    /** @type {?} */
    TimelineBuilder.prototype.easing;
    /** @type {?} */
    TimelineBuilder.prototype._previousKeyframe;
    /** @type {?} */
    TimelineBuilder.prototype._currentKeyframe;
    /** @type {?} */
    TimelineBuilder.prototype._keyframes;
    /** @type {?} */
    TimelineBuilder.prototype._styleSummary;
    /** @type {?} */
    TimelineBuilder.prototype._localTimelineStyles;
    /** @type {?} */
    TimelineBuilder.prototype._globalTimelineStyles;
    /** @type {?} */
    TimelineBuilder.prototype._pendingStyles;
    /** @type {?} */
    TimelineBuilder.prototype._backFill;
    /** @type {?} */
    TimelineBuilder.prototype._currentEmptyStepKeyframe;
    /** @type {?} */
    TimelineBuilder.prototype._driver;
    /** @type {?} */
    TimelineBuilder.prototype.element;
    /** @type {?} */
    TimelineBuilder.prototype.startTime;
    /** @type {?} */
    TimelineBuilder.prototype._elementTimelineStylesLookup;
}
var SubTimelineBuilder = /** @class */ (function (_super) {
    tslib_1.__extends(SubTimelineBuilder, _super);
    function SubTimelineBuilder(driver, element, keyframes, preStyleProps, postStyleProps, timings, _stretchStartingKeyframe) {
        if (_stretchStartingKeyframe === void 0) { _stretchStartingKeyframe = false; }
        var _this = _super.call(this, driver, element, timings.delay) || this;
        _this.element = element;
        _this.keyframes = keyframes;
        _this.preStyleProps = preStyleProps;
        _this.postStyleProps = postStyleProps;
        _this._stretchStartingKeyframe = _stretchStartingKeyframe;
        _this.timings = { duration: timings.duration, delay: timings.delay, easing: timings.easing };
        return _this;
    }
    /**
     * @return {?}
     */
    SubTimelineBuilder.prototype.containsAnimation = /**
     * @return {?}
     */
    function () { return this.keyframes.length > 1; };
    /**
     * @return {?}
     */
    SubTimelineBuilder.prototype.buildKeyframes = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var keyframes = this.keyframes;
        var _a = this.timings, delay = _a.delay, duration = _a.duration, easing = _a.easing;
        if (this._stretchStartingKeyframe && delay) {
            /** @type {?} */
            var newKeyframes = [];
            /** @type {?} */
            var totalTime = duration + delay;
            /** @type {?} */
            var startingGap = delay / totalTime;
            /** @type {?} */
            var newFirstKeyframe = copyStyles(keyframes[0], false);
            newFirstKeyframe['offset'] = 0;
            newKeyframes.push(newFirstKeyframe);
            /** @type {?} */
            var oldFirstKeyframe = copyStyles(keyframes[0], false);
            oldFirstKeyframe['offset'] = roundOffset(startingGap);
            newKeyframes.push(oldFirstKeyframe);
            /** @type {?} */
            var limit = keyframes.length - 1;
            for (var i = 1; i <= limit; i++) {
                /** @type {?} */
                var kf = copyStyles(keyframes[i], false);
                /** @type {?} */
                var oldOffset = /** @type {?} */ (kf['offset']);
                /** @type {?} */
                var timeAtKeyframe = delay + oldOffset * duration;
                kf['offset'] = roundOffset(timeAtKeyframe / totalTime);
                newKeyframes.push(kf);
            }
            // the new starting keyframe should be added at the start
            duration = totalTime;
            delay = 0;
            easing = '';
            keyframes = newKeyframes;
        }
        return createTimelineInstruction(this.element, keyframes, this.preStyleProps, this.postStyleProps, duration, delay, easing, true);
    };
    return SubTimelineBuilder;
}(TimelineBuilder));
if (false) {
    /** @type {?} */
    SubTimelineBuilder.prototype.timings;
    /** @type {?} */
    SubTimelineBuilder.prototype.element;
    /** @type {?} */
    SubTimelineBuilder.prototype.keyframes;
    /** @type {?} */
    SubTimelineBuilder.prototype.preStyleProps;
    /** @type {?} */
    SubTimelineBuilder.prototype.postStyleProps;
    /** @type {?} */
    SubTimelineBuilder.prototype._stretchStartingKeyframe;
}
/**
 * @param {?} offset
 * @param {?=} decimalPoints
 * @return {?}
 */
function roundOffset(offset, decimalPoints) {
    if (decimalPoints === void 0) { decimalPoints = 3; }
    /** @type {?} */
    var mult = Math.pow(10, decimalPoints - 1);
    return Math.round(offset * mult) / mult;
}
/**
 * @param {?} input
 * @param {?} allStyles
 * @return {?}
 */
function flattenStyles(input, allStyles) {
    /** @type {?} */
    var styles = {};
    /** @type {?} */
    var allProperties;
    input.forEach(function (token) {
        if (token === '*') {
            allProperties = allProperties || Object.keys(allStyles);
            allProperties.forEach(function (prop) { styles[prop] = AUTO_STYLE; });
        }
        else {
            copyStyles(/** @type {?} */ (token), false, styles);
        }
    });
    return styles;
}
//# sourceMappingURL=animation_timeline_builder.js.map