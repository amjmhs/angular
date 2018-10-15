"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var animations_1 = require("@angular/animations");
var util_1 = require("../util");
var animation_timeline_instruction_1 = require("./animation_timeline_instruction");
var element_instruction_map_1 = require("./element_instruction_map");
var ONE_FRAME_IN_MILLISECONDS = 1;
var ENTER_TOKEN = ':enter';
var ENTER_TOKEN_REGEX = new RegExp(ENTER_TOKEN, 'g');
var LEAVE_TOKEN = ':leave';
var LEAVE_TOKEN_REGEX = new RegExp(LEAVE_TOKEN, 'g');
/*
 * The code within this file aims to generate web-animations-compatible keyframes from Angular's
 * animation DSL code.
 *
 * The code below will be converted from:
 *
 * ```
 * sequence([
 *   style({ opacity: 0 }),
 *   animate(1000, style({ opacity: 0 }))
 * ])
 * ```
 *
 * To:
 * ```
 * keyframes = [{ opacity: 0, offset: 0 }, { opacity: 1, offset: 1 }]
 * duration = 1000
 * delay = 0
 * easing = ''
 * ```
 *
 * For this operation to cover the combination of animation verbs (style, animate, group, etc...) a
 * combination of prototypical inheritance, AST traversal and merge-sort-like algorithms are used.
 *
 * [AST Traversal]
 * Each of the animation verbs, when executed, will return an string-map object representing what
 * type of action it is (style, animate, group, etc...) and the data associated with it. This means
 * that when functional composition mix of these functions is evaluated (like in the example above)
 * then it will end up producing a tree of objects representing the animation itself.
 *
 * When this animation object tree is processed by the visitor code below it will visit each of the
 * verb statements within the visitor. And during each visit it will build the context of the
 * animation keyframes by interacting with the `TimelineBuilder`.
 *
 * [TimelineBuilder]
 * This class is responsible for tracking the styles and building a series of keyframe objects for a
 * timeline between a start and end time. The builder starts off with an initial timeline and each
 * time the AST comes across a `group()`, `keyframes()` or a combination of the two wihtin a
 * `sequence()` then it will generate a sub timeline for each step as well as a new one after
 * they are complete.
 *
 * As the AST is traversed, the timing state on each of the timelines will be incremented. If a sub
 * timeline was created (based on one of the cases above) then the parent timeline will attempt to
 * merge the styles used within the sub timelines into itself (only with group() this will happen).
 * This happens with a merge operation (much like how the merge works in mergesort) and it will only
 * copy the most recently used styles from the sub timelines into the parent timeline. This ensures
 * that if the styles are used later on in another phase of the animation then they will be the most
 * up-to-date values.
 *
 * [How Missing Styles Are Updated]
 * Each timeline has a `backFill` property which is responsible for filling in new styles into
 * already processed keyframes if a new style shows up later within the animation sequence.
 *
 * ```
 * sequence([
 *   style({ width: 0 }),
 *   animate(1000, style({ width: 100 })),
 *   animate(1000, style({ width: 200 })),
 *   animate(1000, style({ width: 300 }))
 *   animate(1000, style({ width: 400, height: 400 })) // notice how `height` doesn't exist anywhere
 * else
 * ])
 * ```
 *
 * What is happening here is that the `height` value is added later in the sequence, but is missing
 * from all previous animation steps. Therefore when a keyframe is created it would also be missing
 * from all previous keyframes up until where it is first used. For the timeline keyframe generation
 * to properly fill in the style it will place the previous value (the value from the parent
 * timeline) or a default value of `*` into the backFill object. Given that each of the keyframe
 * styles are objects that prototypically inhert from the backFill object, this means that if a
 * value is added into the backFill then it will automatically propagate any missing values to all
 * keyframes. Therefore the missing `height` value will be properly filled into the already
 * processed keyframes.
 *
 * When a sub-timeline is created it will have its own backFill property. This is done so that
 * styles present within the sub-timeline do not accidentally seep into the previous/future timeline
 * keyframes
 *
 * (For prototypically-inherited contents to be detected a `for(i in obj)` loop must be used.)
 *
 * [Validation]
 * The code in this file is not responsible for validation. That functionality happens with within
 * the `AnimationValidatorVisitor` code.
 */
function buildAnimationTimelines(driver, rootElement, ast, enterClassName, leaveClassName, startingStyles, finalStyles, options, subInstructions, errors) {
    if (startingStyles === void 0) { startingStyles = {}; }
    if (finalStyles === void 0) { finalStyles = {}; }
    if (errors === void 0) { errors = []; }
    return new AnimationTimelineBuilderVisitor().buildKeyframes(driver, rootElement, ast, enterClassName, leaveClassName, startingStyles, finalStyles, options, subInstructions, errors);
}
exports.buildAnimationTimelines = buildAnimationTimelines;
var AnimationTimelineBuilderVisitor = /** @class */ (function () {
    function AnimationTimelineBuilderVisitor() {
    }
    AnimationTimelineBuilderVisitor.prototype.buildKeyframes = function (driver, rootElement, ast, enterClassName, leaveClassName, startingStyles, finalStyles, options, subInstructions, errors) {
        if (errors === void 0) { errors = []; }
        subInstructions = subInstructions || new element_instruction_map_1.ElementInstructionMap();
        var context = new AnimationTimelineContext(driver, rootElement, subInstructions, enterClassName, leaveClassName, errors, []);
        context.options = options;
        context.currentTimeline.setStyles([startingStyles], null, context.errors, options);
        util_1.visitDslNode(this, ast, context);
        // this checks to see if an actual animation happened
        var timelines = context.timelines.filter(function (timeline) { return timeline.containsAnimation(); });
        if (timelines.length && Object.keys(finalStyles).length) {
            var tl = timelines[timelines.length - 1];
            if (!tl.allowOnlyTimelineStyles()) {
                tl.setStyles([finalStyles], null, context.errors, options);
            }
        }
        return timelines.length ? timelines.map(function (timeline) { return timeline.buildKeyframes(); }) :
            [animation_timeline_instruction_1.createTimelineInstruction(rootElement, [], [], [], 0, 0, '', false)];
    };
    AnimationTimelineBuilderVisitor.prototype.visitTrigger = function (ast, context) {
        // these values are not visited in this AST
    };
    AnimationTimelineBuilderVisitor.prototype.visitState = function (ast, context) {
        // these values are not visited in this AST
    };
    AnimationTimelineBuilderVisitor.prototype.visitTransition = function (ast, context) {
        // these values are not visited in this AST
    };
    AnimationTimelineBuilderVisitor.prototype.visitAnimateChild = function (ast, context) {
        var elementInstructions = context.subInstructions.consume(context.element);
        if (elementInstructions) {
            var innerContext = context.createSubContext(ast.options);
            var startTime = context.currentTimeline.currentTime;
            var endTime = this._visitSubInstructions(elementInstructions, innerContext, innerContext.options);
            if (startTime != endTime) {
                // we do this on the upper context because we created a sub context for
                // the sub child animations
                context.transformIntoNewTimeline(endTime);
            }
        }
        context.previousNode = ast;
    };
    AnimationTimelineBuilderVisitor.prototype.visitAnimateRef = function (ast, context) {
        var innerContext = context.createSubContext(ast.options);
        innerContext.transformIntoNewTimeline();
        this.visitReference(ast.animation, innerContext);
        context.transformIntoNewTimeline(innerContext.currentTimeline.currentTime);
        context.previousNode = ast;
    };
    AnimationTimelineBuilderVisitor.prototype._visitSubInstructions = function (instructions, context, options) {
        var startTime = context.currentTimeline.currentTime;
        var furthestTime = startTime;
        // this is a special-case for when a user wants to skip a sub
        // animation from being fired entirely.
        var duration = options.duration != null ? util_1.resolveTimingValue(options.duration) : null;
        var delay = options.delay != null ? util_1.resolveTimingValue(options.delay) : null;
        if (duration !== 0) {
            instructions.forEach(function (instruction) {
                var instructionTimings = context.appendInstructionToTimeline(instruction, duration, delay);
                furthestTime =
                    Math.max(furthestTime, instructionTimings.duration + instructionTimings.delay);
            });
        }
        return furthestTime;
    };
    AnimationTimelineBuilderVisitor.prototype.visitReference = function (ast, context) {
        context.updateOptions(ast.options, true);
        util_1.visitDslNode(this, ast.animation, context);
        context.previousNode = ast;
    };
    AnimationTimelineBuilderVisitor.prototype.visitSequence = function (ast, context) {
        var _this = this;
        var subContextCount = context.subContextCount;
        var ctx = context;
        var options = ast.options;
        if (options && (options.params || options.delay)) {
            ctx = context.createSubContext(options);
            ctx.transformIntoNewTimeline();
            if (options.delay != null) {
                if (ctx.previousNode.type == 6 /* Style */) {
                    ctx.currentTimeline.snapshotCurrentStyles();
                    ctx.previousNode = DEFAULT_NOOP_PREVIOUS_NODE;
                }
                var delay = util_1.resolveTimingValue(options.delay);
                ctx.delayNextStep(delay);
            }
        }
        if (ast.steps.length) {
            ast.steps.forEach(function (s) { return util_1.visitDslNode(_this, s, ctx); });
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
    AnimationTimelineBuilderVisitor.prototype.visitGroup = function (ast, context) {
        var _this = this;
        var innerTimelines = [];
        var furthestTime = context.currentTimeline.currentTime;
        var delay = ast.options && ast.options.delay ? util_1.resolveTimingValue(ast.options.delay) : 0;
        ast.steps.forEach(function (s) {
            var innerContext = context.createSubContext(ast.options);
            if (delay) {
                innerContext.delayNextStep(delay);
            }
            util_1.visitDslNode(_this, s, innerContext);
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
    AnimationTimelineBuilderVisitor.prototype._visitTiming = function (ast, context) {
        if (ast.dynamic) {
            var strValue = ast.strValue;
            var timingValue = context.params ? util_1.interpolateParams(strValue, context.params, context.errors) : strValue;
            return util_1.resolveTiming(timingValue, context.errors);
        }
        else {
            return { duration: ast.duration, delay: ast.delay, easing: ast.easing };
        }
    };
    AnimationTimelineBuilderVisitor.prototype.visitAnimate = function (ast, context) {
        var timings = context.currentAnimateTimings = this._visitTiming(ast.timings, context);
        var timeline = context.currentTimeline;
        if (timings.delay) {
            context.incrementTime(timings.delay);
            timeline.snapshotCurrentStyles();
        }
        var style = ast.style;
        if (style.type == 5 /* Keyframes */) {
            this.visitKeyframes(style, context);
        }
        else {
            context.incrementTime(timings.duration);
            this.visitStyle(style, context);
            timeline.applyStylesToKeyframe();
        }
        context.currentAnimateTimings = null;
        context.previousNode = ast;
    };
    AnimationTimelineBuilderVisitor.prototype.visitStyle = function (ast, context) {
        var timeline = context.currentTimeline;
        var timings = context.currentAnimateTimings;
        // this is a special case for when a style() call
        // directly follows  an animate() call (but not inside of an animate() call)
        if (!timings && timeline.getCurrentStyleProperties().length) {
            timeline.forwardFrame();
        }
        var easing = (timings && timings.easing) || ast.easing;
        if (ast.isEmptyStep) {
            timeline.applyEmptyStep(easing);
        }
        else {
            timeline.setStyles(ast.styles, easing, context.errors, context.options);
        }
        context.previousNode = ast;
    };
    AnimationTimelineBuilderVisitor.prototype.visitKeyframes = function (ast, context) {
        var currentAnimateTimings = context.currentAnimateTimings;
        var startTime = (context.currentTimeline).duration;
        var duration = currentAnimateTimings.duration;
        var innerContext = context.createSubContext();
        var innerTimeline = innerContext.currentTimeline;
        innerTimeline.easing = currentAnimateTimings.easing;
        ast.styles.forEach(function (step) {
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
    AnimationTimelineBuilderVisitor.prototype.visitQuery = function (ast, context) {
        var _this = this;
        // in the event that the first step before this is a style step we need
        // to ensure the styles are applied before the children are animated
        var startTime = context.currentTimeline.currentTime;
        var options = (ast.options || {});
        var delay = options.delay ? util_1.resolveTimingValue(options.delay) : 0;
        if (delay && (context.previousNode.type === 6 /* Style */ ||
            (startTime == 0 && context.currentTimeline.getCurrentStyleProperties().length))) {
            context.currentTimeline.snapshotCurrentStyles();
            context.previousNode = DEFAULT_NOOP_PREVIOUS_NODE;
        }
        var furthestTime = startTime;
        var elms = context.invokeQuery(ast.selector, ast.originalSelector, ast.limit, ast.includeSelf, options.optional ? true : false, context.errors);
        context.currentQueryTotal = elms.length;
        var sameElementTimeline = null;
        elms.forEach(function (element, i) {
            context.currentQueryIndex = i;
            var innerContext = context.createSubContext(ast.options, element);
            if (delay) {
                innerContext.delayNextStep(delay);
            }
            if (element === context.element) {
                sameElementTimeline = innerContext.currentTimeline;
            }
            util_1.visitDslNode(_this, ast.animation, innerContext);
            // this is here just incase the inner steps only contain or end
            // with a style() call (which is here to signal that this is a preparatory
            // call to style an element before it is animated again)
            innerContext.currentTimeline.applyStylesToKeyframe();
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
    AnimationTimelineBuilderVisitor.prototype.visitStagger = function (ast, context) {
        var parentContext = context.parentContext;
        var tl = context.currentTimeline;
        var timings = ast.timings;
        var duration = Math.abs(timings.duration);
        var maxTime = duration * (context.currentQueryTotal - 1);
        var delay = duration * context.currentQueryIndex;
        var staggerTransformer = timings.duration < 0 ? 'reverse' : timings.easing;
        switch (staggerTransformer) {
            case 'reverse':
                delay = maxTime - delay;
                break;
            case 'full':
                delay = parentContext.currentStaggerTime;
                break;
        }
        var timeline = context.currentTimeline;
        if (delay) {
            timeline.delayNextStep(delay);
        }
        var startingTime = timeline.currentTime;
        util_1.visitDslNode(this, ast.animation, context);
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
exports.AnimationTimelineBuilderVisitor = AnimationTimelineBuilderVisitor;
var DEFAULT_NOOP_PREVIOUS_NODE = {};
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
        get: function () { return this.options.params; },
        enumerable: true,
        configurable: true
    });
    AnimationTimelineContext.prototype.updateOptions = function (options, skipIfExists) {
        var _this = this;
        if (!options)
            return;
        var newOptions = options;
        var optionsToUpdate = this.options;
        // NOTE: this will get patched up when other animation methods support duration overrides
        if (newOptions.duration != null) {
            optionsToUpdate.duration = util_1.resolveTimingValue(newOptions.duration);
        }
        if (newOptions.delay != null) {
            optionsToUpdate.delay = util_1.resolveTimingValue(newOptions.delay);
        }
        var newParams = newOptions.params;
        if (newParams) {
            var paramsToUpdate_1 = optionsToUpdate.params;
            if (!paramsToUpdate_1) {
                paramsToUpdate_1 = this.options.params = {};
            }
            Object.keys(newParams).forEach(function (name) {
                if (!skipIfExists || !paramsToUpdate_1.hasOwnProperty(name)) {
                    paramsToUpdate_1[name] = util_1.interpolateParams(newParams[name], paramsToUpdate_1, _this.errors);
                }
            });
        }
    };
    AnimationTimelineContext.prototype._copyOptions = function () {
        var options = {};
        if (this.options) {
            var oldParams_1 = this.options.params;
            if (oldParams_1) {
                var params_1 = options['params'] = {};
                Object.keys(oldParams_1).forEach(function (name) { params_1[name] = oldParams_1[name]; });
            }
        }
        return options;
    };
    AnimationTimelineContext.prototype.createSubContext = function (options, element, newTime) {
        if (options === void 0) { options = null; }
        var target = element || this.element;
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
    AnimationTimelineContext.prototype.transformIntoNewTimeline = function (newTime) {
        this.previousNode = DEFAULT_NOOP_PREVIOUS_NODE;
        this.currentTimeline = this.currentTimeline.fork(this.element, newTime);
        this.timelines.push(this.currentTimeline);
        return this.currentTimeline;
    };
    AnimationTimelineContext.prototype.appendInstructionToTimeline = function (instruction, duration, delay) {
        var updatedTimings = {
            duration: duration != null ? duration : instruction.duration,
            delay: this.currentTimeline.currentTime + (delay != null ? delay : 0) + instruction.delay,
            easing: ''
        };
        var builder = new SubTimelineBuilder(this._driver, instruction.element, instruction.keyframes, instruction.preStyleProps, instruction.postStyleProps, updatedTimings, instruction.stretchStartingKeyframe);
        this.timelines.push(builder);
        return updatedTimings;
    };
    AnimationTimelineContext.prototype.incrementTime = function (time) {
        this.currentTimeline.forwardTime(this.currentTimeline.duration + time);
    };
    AnimationTimelineContext.prototype.delayNextStep = function (delay) {
        // negative delays are not yet supported
        if (delay > 0) {
            this.currentTimeline.delayNextStep(delay);
        }
    };
    AnimationTimelineContext.prototype.invokeQuery = function (selector, originalSelector, limit, includeSelf, optional, errors) {
        var results = [];
        if (includeSelf) {
            results.push(this.element);
        }
        if (selector.length > 0) { // if :self is only used then the selector is empty
            selector = selector.replace(ENTER_TOKEN_REGEX, '.' + this._enterClassName);
            selector = selector.replace(LEAVE_TOKEN_REGEX, '.' + this._leaveClassName);
            var multi = limit != 1;
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
exports.AnimationTimelineContext = AnimationTimelineContext;
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
        this._globalTimelineStyles = this._elementTimelineStylesLookup.get(element);
        if (!this._globalTimelineStyles) {
            this._globalTimelineStyles = this._localTimelineStyles;
            this._elementTimelineStylesLookup.set(element, this._localTimelineStyles);
        }
        this._loadKeyframe();
    }
    TimelineBuilder.prototype.containsAnimation = function () {
        switch (this._keyframes.size) {
            case 0:
                return false;
            case 1:
                return this.getCurrentStyleProperties().length > 0;
            default:
                return true;
        }
    };
    TimelineBuilder.prototype.getCurrentStyleProperties = function () { return Object.keys(this._currentKeyframe); };
    Object.defineProperty(TimelineBuilder.prototype, "currentTime", {
        get: function () { return this.startTime + this.duration; },
        enumerable: true,
        configurable: true
    });
    TimelineBuilder.prototype.delayNextStep = function (delay) {
        // in the event that a style() step is placed right before a stagger()
        // and that style() step is the very first style() value in the animation
        // then we need to make a copy of the keyframe [0, copy, 1] so that the delay
        // properly applies the style() values to work with the stagger...
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
    TimelineBuilder.prototype.fork = function (element, currentTime) {
        this.applyStylesToKeyframe();
        return new TimelineBuilder(this._driver, element, currentTime || this.currentTime, this._elementTimelineStylesLookup);
    };
    TimelineBuilder.prototype._loadKeyframe = function () {
        if (this._currentKeyframe) {
            this._previousKeyframe = this._currentKeyframe;
        }
        this._currentKeyframe = this._keyframes.get(this.duration);
        if (!this._currentKeyframe) {
            this._currentKeyframe = Object.create(this._backFill, {});
            this._keyframes.set(this.duration, this._currentKeyframe);
        }
    };
    TimelineBuilder.prototype.forwardFrame = function () {
        this.duration += ONE_FRAME_IN_MILLISECONDS;
        this._loadKeyframe();
    };
    TimelineBuilder.prototype.forwardTime = function (time) {
        this.applyStylesToKeyframe();
        this.duration = time;
        this._loadKeyframe();
    };
    TimelineBuilder.prototype._updateStyle = function (prop, value) {
        this._localTimelineStyles[prop] = value;
        this._globalTimelineStyles[prop] = value;
        this._styleSummary[prop] = { time: this.currentTime, value: value };
    };
    TimelineBuilder.prototype.allowOnlyTimelineStyles = function () { return this._currentEmptyStepKeyframe !== this._currentKeyframe; };
    TimelineBuilder.prototype.applyEmptyStep = function (easing) {
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
            _this._backFill[prop] = _this._globalTimelineStyles[prop] || animations_1.AUTO_STYLE;
            _this._currentKeyframe[prop] = animations_1.AUTO_STYLE;
        });
        this._currentEmptyStepKeyframe = this._currentKeyframe;
    };
    TimelineBuilder.prototype.setStyles = function (input, easing, errors, options) {
        var _this = this;
        if (easing) {
            this._previousKeyframe['easing'] = easing;
        }
        var params = (options && options.params) || {};
        var styles = flattenStyles(input, this._globalTimelineStyles);
        Object.keys(styles).forEach(function (prop) {
            var val = util_1.interpolateParams(styles[prop], params, errors);
            _this._pendingStyles[prop] = val;
            if (!_this._localTimelineStyles.hasOwnProperty(prop)) {
                _this._backFill[prop] = _this._globalTimelineStyles.hasOwnProperty(prop) ?
                    _this._globalTimelineStyles[prop] :
                    animations_1.AUTO_STYLE;
            }
            _this._updateStyle(prop, val);
        });
    };
    TimelineBuilder.prototype.applyStylesToKeyframe = function () {
        var _this = this;
        var styles = this._pendingStyles;
        var props = Object.keys(styles);
        if (props.length == 0)
            return;
        this._pendingStyles = {};
        props.forEach(function (prop) {
            var val = styles[prop];
            _this._currentKeyframe[prop] = val;
        });
        Object.keys(this._localTimelineStyles).forEach(function (prop) {
            if (!_this._currentKeyframe.hasOwnProperty(prop)) {
                _this._currentKeyframe[prop] = _this._localTimelineStyles[prop];
            }
        });
    };
    TimelineBuilder.prototype.snapshotCurrentStyles = function () {
        var _this = this;
        Object.keys(this._localTimelineStyles).forEach(function (prop) {
            var val = _this._localTimelineStyles[prop];
            _this._pendingStyles[prop] = val;
            _this._updateStyle(prop, val);
        });
    };
    TimelineBuilder.prototype.getFinalKeyframe = function () { return this._keyframes.get(this.duration); };
    Object.defineProperty(TimelineBuilder.prototype, "properties", {
        get: function () {
            var properties = [];
            for (var prop in this._currentKeyframe) {
                properties.push(prop);
            }
            return properties;
        },
        enumerable: true,
        configurable: true
    });
    TimelineBuilder.prototype.mergeTimelineCollectedStyles = function (timeline) {
        var _this = this;
        Object.keys(timeline._styleSummary).forEach(function (prop) {
            var details0 = _this._styleSummary[prop];
            var details1 = timeline._styleSummary[prop];
            if (!details0 || details1.time > details0.time) {
                _this._updateStyle(prop, details1.value);
            }
        });
    };
    TimelineBuilder.prototype.buildKeyframes = function () {
        var _this = this;
        this.applyStylesToKeyframe();
        var preStyleProps = new Set();
        var postStyleProps = new Set();
        var isEmpty = this._keyframes.size === 1 && this.duration === 0;
        var finalKeyframes = [];
        this._keyframes.forEach(function (keyframe, time) {
            var finalKeyframe = util_1.copyStyles(keyframe, true);
            Object.keys(finalKeyframe).forEach(function (prop) {
                var value = finalKeyframe[prop];
                if (value == animations_1.ɵPRE_STYLE) {
                    preStyleProps.add(prop);
                }
                else if (value == animations_1.AUTO_STYLE) {
                    postStyleProps.add(prop);
                }
            });
            if (!isEmpty) {
                finalKeyframe['offset'] = time / _this.duration;
            }
            finalKeyframes.push(finalKeyframe);
        });
        var preProps = preStyleProps.size ? util_1.iteratorToArray(preStyleProps.values()) : [];
        var postProps = postStyleProps.size ? util_1.iteratorToArray(postStyleProps.values()) : [];
        // special case for a 0-second animation (which is designed just to place styles onscreen)
        if (isEmpty) {
            var kf0 = finalKeyframes[0];
            var kf1 = util_1.copyObj(kf0);
            kf0['offset'] = 0;
            kf1['offset'] = 1;
            finalKeyframes = [kf0, kf1];
        }
        return animation_timeline_instruction_1.createTimelineInstruction(this.element, finalKeyframes, preProps, postProps, this.duration, this.startTime, this.easing, false);
    };
    return TimelineBuilder;
}());
exports.TimelineBuilder = TimelineBuilder;
var SubTimelineBuilder = /** @class */ (function (_super) {
    __extends(SubTimelineBuilder, _super);
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
    SubTimelineBuilder.prototype.containsAnimation = function () { return this.keyframes.length > 1; };
    SubTimelineBuilder.prototype.buildKeyframes = function () {
        var keyframes = this.keyframes;
        var _a = this.timings, delay = _a.delay, duration = _a.duration, easing = _a.easing;
        if (this._stretchStartingKeyframe && delay) {
            var newKeyframes = [];
            var totalTime = duration + delay;
            var startingGap = delay / totalTime;
            // the original starting keyframe now starts once the delay is done
            var newFirstKeyframe = util_1.copyStyles(keyframes[0], false);
            newFirstKeyframe['offset'] = 0;
            newKeyframes.push(newFirstKeyframe);
            var oldFirstKeyframe = util_1.copyStyles(keyframes[0], false);
            oldFirstKeyframe['offset'] = roundOffset(startingGap);
            newKeyframes.push(oldFirstKeyframe);
            /*
              When the keyframe is stretched then it means that the delay before the animation
              starts is gone. Instead the first keyframe is placed at the start of the animation
              and it is then copied to where it starts when the original delay is over. This basically
              means nothing animates during that delay, but the styles are still renderered. For this
              to work the original offset values that exist in the original keyframes must be "warped"
              so that they can take the new keyframe + delay into account.
      
              delay=1000, duration=1000, keyframes = 0 .5 1
      
              turns into
      
              delay=0, duration=2000, keyframes = 0 .33 .66 1
             */
            // offsets between 1 ... n -1 are all warped by the keyframe stretch
            var limit = keyframes.length - 1;
            for (var i = 1; i <= limit; i++) {
                var kf = util_1.copyStyles(keyframes[i], false);
                var oldOffset = kf['offset'];
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
        return animation_timeline_instruction_1.createTimelineInstruction(this.element, keyframes, this.preStyleProps, this.postStyleProps, duration, delay, easing, true);
    };
    return SubTimelineBuilder;
}(TimelineBuilder));
function roundOffset(offset, decimalPoints) {
    if (decimalPoints === void 0) { decimalPoints = 3; }
    var mult = Math.pow(10, decimalPoints - 1);
    return Math.round(offset * mult) / mult;
}
function flattenStyles(input, allStyles) {
    var styles = {};
    var allProperties;
    input.forEach(function (token) {
        if (token === '*') {
            allProperties = allProperties || Object.keys(allStyles);
            allProperties.forEach(function (prop) { styles[prop] = animations_1.AUTO_STYLE; });
        }
        else {
            util_1.copyStyles(token, false, styles);
        }
    });
    return styles;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX3RpbWVsaW5lX2J1aWxkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9hbmltYXRpb25zL2Jyb3dzZXIvc3JjL2RzbC9hbmltYXRpb25fdGltZWxpbmVfYnVpbGRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0dBTUc7QUFDSCxrREFBeUw7QUFHekwsZ0NBQWlJO0FBR2pJLG1GQUF5RztBQUN6RyxxRUFBZ0U7QUFFaEUsSUFBTSx5QkFBeUIsR0FBRyxDQUFDLENBQUM7QUFDcEMsSUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDO0FBQzdCLElBQU0saUJBQWlCLEdBQUcsSUFBSSxNQUFNLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZELElBQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQztBQUM3QixJQUFNLGlCQUFpQixHQUFHLElBQUksTUFBTSxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUV2RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FtRkc7QUFDSCxpQ0FDSSxNQUF1QixFQUFFLFdBQWdCLEVBQUUsR0FBK0IsRUFDMUUsY0FBc0IsRUFBRSxjQUFzQixFQUFFLGNBQStCLEVBQy9FLFdBQTRCLEVBQUUsT0FBeUIsRUFDdkQsZUFBdUMsRUFBRSxNQUFrQjtJQUZYLCtCQUFBLEVBQUEsbUJBQStCO0lBQy9FLDRCQUFBLEVBQUEsZ0JBQTRCO0lBQ2EsdUJBQUEsRUFBQSxXQUFrQjtJQUM3RCxPQUFPLElBQUksK0JBQStCLEVBQUUsQ0FBQyxjQUFjLENBQ3ZELE1BQU0sRUFBRSxXQUFXLEVBQUUsR0FBRyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLFdBQVcsRUFDckYsT0FBTyxFQUFFLGVB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