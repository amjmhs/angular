/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { AUTO_STYLE, style } from '@angular/animations';
import { getOrSetAsInMap } from '../render/shared';
import { NG_ANIMATING_SELECTOR, NG_TRIGGER_SELECTOR, SUBSTITUTION_EXPR_START, copyObj, extractStyleParams, iteratorToArray, normalizeAnimationEntry, resolveTiming, validateStyleParams, visitDslNode } from '../util';
import { parseTransitionExpr } from './animation_transition_expr';
/** @type {?} */
var SELF_TOKEN = ':self';
/** @type {?} */
var SELF_TOKEN_REGEX = new RegExp("s*" + SELF_TOKEN + "s*,?", 'g');
/**
 * @param {?} driver
 * @param {?} metadata
 * @param {?} errors
 * @return {?}
 */
export function buildAnimationAst(driver, metadata, errors) {
    return new AnimationAstBuilderVisitor(driver).build(metadata, errors);
}
/** @type {?} */
var ROOT_SELECTOR = '';
var AnimationAstBuilderVisitor = /** @class */ (function () {
    function AnimationAstBuilderVisitor(_driver) {
        this._driver = _driver;
    }
    /**
     * @param {?} metadata
     * @param {?} errors
     * @return {?}
     */
    AnimationAstBuilderVisitor.prototype.build = /**
     * @param {?} metadata
     * @param {?} errors
     * @return {?}
     */
    function (metadata, errors) {
        /** @type {?} */
        var context = new AnimationAstBuilderContext(errors);
        this._resetContextStyleTimingState(context);
        return /** @type {?} */ (visitDslNode(this, normalizeAnimationEntry(metadata), context));
    };
    /**
     * @param {?} context
     * @return {?}
     */
    AnimationAstBuilderVisitor.prototype._resetContextStyleTimingState = /**
     * @param {?} context
     * @return {?}
     */
    function (context) {
        context.currentQuerySelector = ROOT_SELECTOR;
        context.collectedStyles = {};
        context.collectedStyles[ROOT_SELECTOR] = {};
        context.currentTime = 0;
    };
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    AnimationAstBuilderVisitor.prototype.visitTrigger = /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    function (metadata, context) {
        var _this = this;
        /** @type {?} */
        var queryCount = context.queryCount = 0;
        /** @type {?} */
        var depCount = context.depCount = 0;
        /** @type {?} */
        var states = [];
        /** @type {?} */
        var transitions = [];
        if (metadata.name.charAt(0) == '@') {
            context.errors.push('animation triggers cannot be prefixed with an `@` sign (e.g. trigger(\'@foo\', [...]))');
        }
        metadata.definitions.forEach(function (def) {
            _this._resetContextStyleTimingState(context);
            if (def.type == 0 /* State */) {
                /** @type {?} */
                var stateDef_1 = /** @type {?} */ (def);
                /** @type {?} */
                var name_1 = stateDef_1.name;
                name_1.toString().split(/\s*,\s*/).forEach(function (n) {
                    stateDef_1.name = n;
                    states.push(_this.visitState(stateDef_1, context));
                });
                stateDef_1.name = name_1;
            }
            else if (def.type == 1 /* Transition */) {
                /** @type {?} */
                var transition = _this.visitTransition(/** @type {?} */ (def), context);
                queryCount += transition.queryCount;
                depCount += transition.depCount;
                transitions.push(transition);
            }
            else {
                context.errors.push('only state() and transition() definitions can sit inside of a trigger()');
            }
        });
        return {
            type: 7 /* Trigger */,
            name: metadata.name, states: states, transitions: transitions, queryCount: queryCount, depCount: depCount,
            options: null
        };
    };
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    AnimationAstBuilderVisitor.prototype.visitState = /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    function (metadata, context) {
        /** @type {?} */
        var styleAst = this.visitStyle(metadata.styles, context);
        /** @type {?} */
        var astParams = (metadata.options && metadata.options.params) || null;
        if (styleAst.containsDynamicStyles) {
            /** @type {?} */
            var missingSubs_1 = new Set();
            /** @type {?} */
            var params_1 = astParams || {};
            styleAst.styles.forEach(function (value) {
                if (isObject(value)) {
                    /** @type {?} */
                    var stylesObj_1 = /** @type {?} */ (value);
                    Object.keys(stylesObj_1).forEach(function (prop) {
                        extractStyleParams(stylesObj_1[prop]).forEach(function (sub) {
                            if (!params_1.hasOwnProperty(sub)) {
                                missingSubs_1.add(sub);
                            }
                        });
                    });
                }
            });
            if (missingSubs_1.size) {
                /** @type {?} */
                var missingSubsArr = iteratorToArray(missingSubs_1.values());
                context.errors.push("state(\"" + metadata.name + "\", ...) must define default values for all the following style substitutions: " + missingSubsArr.join(', '));
            }
        }
        return {
            type: 0 /* State */,
            name: metadata.name,
            style: styleAst,
            options: astParams ? { params: astParams } : null
        };
    };
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    AnimationAstBuilderVisitor.prototype.visitTransition = /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    function (metadata, context) {
        context.queryCount = 0;
        context.depCount = 0;
        /** @type {?} */
        var animation = visitDslNode(this, normalizeAnimationEntry(metadata.animation), context);
        /** @type {?} */
        var matchers = parseTransitionExpr(metadata.expr, context.errors);
        return {
            type: 1 /* Transition */,
            matchers: matchers,
            animation: animation,
            queryCount: context.queryCount,
            depCount: context.depCount,
            options: normalizeAnimationOptions(metadata.options)
        };
    };
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    AnimationAstBuilderVisitor.prototype.visitSequence = /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    function (metadata, context) {
        var _this = this;
        return {
            type: 2 /* Sequence */,
            steps: metadata.steps.map(function (s) { return visitDslNode(_this, s, context); }),
            options: normalizeAnimationOptions(metadata.options)
        };
    };
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    AnimationAstBuilderVisitor.prototype.visitGroup = /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    function (metadata, context) {
        var _this = this;
        /** @type {?} */
        var currentTime = context.currentTime;
        /** @type {?} */
        var furthestTime = 0;
        /** @type {?} */
        var steps = metadata.steps.map(function (step) {
            context.currentTime = currentTime;
            /** @type {?} */
            var innerAst = visitDslNode(_this, step, context);
            furthestTime = Math.max(furthestTime, context.currentTime);
            return innerAst;
        });
        context.currentTime = furthestTime;
        return {
            type: 3 /* Group */,
            steps: steps,
            options: normalizeAnimationOptions(metadata.options)
        };
    };
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    AnimationAstBuilderVisitor.prototype.visitAnimate = /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    function (metadata, context) {
        /** @type {?} */
        var timingAst = constructTimingAst(metadata.timings, context.errors);
        context.currentAnimateTimings = timingAst;
        /** @type {?} */
        var styleAst;
        /** @type {?} */
        var styleMetadata = metadata.styles ? metadata.styles : style({});
        if (styleMetadata.type == 5 /* Keyframes */) {
            styleAst = this.visitKeyframes(/** @type {?} */ (styleMetadata), context);
        }
        else {
            /** @type {?} */
            var styleMetadata_1 = /** @type {?} */ (metadata.styles);
            /** @type {?} */
            var isEmpty = false;
            if (!styleMetadata_1) {
                isEmpty = true;
                /** @type {?} */
                var newStyleData = {};
                if (timingAst.easing) {
                    newStyleData['easing'] = timingAst.easing;
                }
                styleMetadata_1 = style(newStyleData);
            }
            context.currentTime += timingAst.duration + timingAst.delay;
            /** @type {?} */
            var _styleAst = this.visitStyle(styleMetadata_1, context);
            _styleAst.isEmptyStep = isEmpty;
            styleAst = _styleAst;
        }
        context.currentAnimateTimings = null;
        return {
            type: 4 /* Animate */,
            timings: timingAst,
            style: styleAst,
            options: null
        };
    };
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    AnimationAstBuilderVisitor.prototype.visitStyle = /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    function (metadata, context) {
        /** @type {?} */
        var ast = this._makeStyleAst(metadata, context);
        this._validateStyleAst(ast, context);
        return ast;
    };
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    AnimationAstBuilderVisitor.prototype._makeStyleAst = /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    function (metadata, context) {
        /** @type {?} */
        var styles = [];
        if (Array.isArray(metadata.styles)) {
            (/** @type {?} */ (metadata.styles)).forEach(function (styleTuple) {
                if (typeof styleTuple == 'string') {
                    if (styleTuple == AUTO_STYLE) {
                        styles.push(/** @type {?} */ (styleTuple));
                    }
                    else {
                        context.errors.push("The provided style string value " + styleTuple + " is not allowed.");
                    }
                }
                else {
                    styles.push(/** @type {?} */ (styleTuple));
                }
            });
        }
        else {
            styles.push(metadata.styles);
        }
        /** @type {?} */
        var containsDynamicStyles = false;
        /** @type {?} */
        var collectedEasing = null;
        styles.forEach(function (styleData) {
            if (isObject(styleData)) {
                /** @type {?} */
                var styleMap = /** @type {?} */ (styleData);
                /** @type {?} */
                var easing = styleMap['easing'];
                if (easing) {
                    collectedEasing = /** @type {?} */ (easing);
                    delete styleMap['easing'];
                }
                if (!containsDynamicStyles) {
                    for (var prop in styleMap) {
                        /** @type {?} */
                        var value = styleMap[prop];
                        if (value.toString().indexOf(SUBSTITUTION_EXPR_START) >= 0) {
                            containsDynamicStyles = true;
                            break;
                        }
                    }
                }
            }
        });
        return {
            type: 6 /* Style */,
            styles: styles,
            easing: collectedEasing,
            offset: metadata.offset, containsDynamicStyles: containsDynamicStyles,
            options: null
        };
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationAstBuilderVisitor.prototype._validateStyleAst = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) {
        var _this = this;
        /** @type {?} */
        var timings = context.currentAnimateTimings;
        /** @type {?} */
        var endTime = context.currentTime;
        /** @type {?} */
        var startTime = context.currentTime;
        if (timings && startTime > 0) {
            startTime -= timings.duration + timings.delay;
        }
        ast.styles.forEach(function (tuple) {
            if (typeof tuple == 'string')
                return;
            Object.keys(tuple).forEach(function (prop) {
                if (!_this._driver.validateStyleProperty(prop)) {
                    context.errors.push("The provided animation property \"" + prop + "\" is not a supported CSS property for animations");
                    return;
                }
                /** @type {?} */
                var collectedStyles = context.collectedStyles[/** @type {?} */ ((context.currentQuerySelector))];
                /** @type {?} */
                var collectedEntry = collectedStyles[prop];
                /** @type {?} */
                var updateCollectedStyle = true;
                if (collectedEntry) {
                    if (startTime != endTime && startTime >= collectedEntry.startTime &&
                        endTime <= collectedEntry.endTime) {
                        context.errors.push("The CSS property \"" + prop + "\" that exists between the times of \"" + collectedEntry.startTime + "ms\" and \"" + collectedEntry.endTime + "ms\" is also being animated in a parallel animation between the times of \"" + startTime + "ms\" and \"" + endTime + "ms\"");
                        updateCollectedStyle = false;
                    }
                    // we always choose the smaller start time value since we
                    // want to have a record of the entire animation window where
                    // the style property is being animated in between
                    startTime = collectedEntry.startTime;
                }
                if (updateCollectedStyle) {
                    collectedStyles[prop] = { startTime: startTime, endTime: endTime };
                }
                if (context.options) {
                    validateStyleParams(tuple[prop], context.options, context.errors);
                }
            });
        });
    };
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    AnimationAstBuilderVisitor.prototype.visitKeyframes = /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    function (metadata, context) {
        var _this = this;
        /** @type {?} */
        var ast = { type: 5 /* Keyframes */, styles: [], options: null };
        if (!context.currentAnimateTimings) {
            context.errors.push("keyframes() must be placed inside of a call to animate()");
            return ast;
        }
        /** @type {?} */
        var MAX_KEYFRAME_OFFSET = 1;
        /** @type {?} */
        var totalKeyframesWithOffsets = 0;
        /** @type {?} */
        var offsets = [];
        /** @type {?} */
        var offsetsOutOfOrder = false;
        /** @type {?} */
        var keyframesOutOfRange = false;
        /** @type {?} */
        var previousOffset = 0;
        /** @type {?} */
        var keyframes = metadata.steps.map(function (styles) {
            /** @type {?} */
            var style = _this._makeStyleAst(styles, context);
            /** @type {?} */
            var offsetVal = style.offset != null ? style.offset : consumeOffset(style.styles);
            /** @type {?} */
            var offset = 0;
            if (offsetVal != null) {
                totalKeyframesWithOffsets++;
                offset = style.offset = offsetVal;
            }
            keyframesOutOfRange = keyframesOutOfRange || offset < 0 || offset > 1;
            offsetsOutOfOrder = offsetsOutOfOrder || offset < previousOffset;
            previousOffset = offset;
            offsets.push(offset);
            return style;
        });
        if (keyframesOutOfRange) {
            context.errors.push("Please ensure that all keyframe offsets are between 0 and 1");
        }
        if (offsetsOutOfOrder) {
            context.errors.push("Please ensure that all keyframe offsets are in order");
        }
        /** @type {?} */
        var length = metadata.steps.length;
        /** @type {?} */
        var generatedOffset = 0;
        if (totalKeyframesWithOffsets > 0 && totalKeyframesWithOffsets < length) {
            context.errors.push("Not all style() steps within the declared keyframes() contain offsets");
        }
        else if (totalKeyframesWithOffsets == 0) {
            generatedOffset = MAX_KEYFRAME_OFFSET / (length - 1);
        }
        /** @type {?} */
        var limit = length - 1;
        /** @type {?} */
        var currentTime = context.currentTime;
        /** @type {?} */
        var currentAnimateTimings = /** @type {?} */ ((context.currentAnimateTimings));
        /** @type {?} */
        var animateDuration = currentAnimateTimings.duration;
        keyframes.forEach(function (kf, i) {
            /** @type {?} */
            var offset = generatedOffset > 0 ? (i == limit ? 1 : (generatedOffset * i)) : offsets[i];
            /** @type {?} */
            var durationUpToThisFrame = offset * animateDuration;
            context.currentTime = currentTime + currentAnimateTimings.delay + durationUpToThisFrame;
            currentAnimateTimings.duration = durationUpToThisFrame;
            _this._validateStyleAst(kf, context);
            kf.offset = offset;
            ast.styles.push(kf);
        });
        return ast;
    };
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    AnimationAstBuilderVisitor.prototype.visitReference = /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    function (metadata, context) {
        return {
            type: 8 /* Reference */,
            animation: visitDslNode(this, normalizeAnimationEntry(metadata.animation), context),
            options: normalizeAnimationOptions(metadata.options)
        };
    };
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    AnimationAstBuilderVisitor.prototype.visitAnimateChild = /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    function (metadata, context) {
        context.depCount++;
        return {
            type: 9 /* AnimateChild */,
            options: normalizeAnimationOptions(metadata.options)
        };
    };
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    AnimationAstBuilderVisitor.prototype.visitAnimateRef = /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    function (metadata, context) {
        return {
            type: 10 /* AnimateRef */,
            animation: this.visitReference(metadata.animation, context),
            options: normalizeAnimationOptions(metadata.options)
        };
    };
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    AnimationAstBuilderVisitor.prototype.visitQuery = /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    function (metadata, context) {
        /** @type {?} */
        var parentSelector = /** @type {?} */ ((context.currentQuerySelector));
        /** @type {?} */
        var options = /** @type {?} */ ((metadata.options || {}));
        context.queryCount++;
        context.currentQuery = metadata;
        var _a = normalizeSelector(metadata.selector), selector = _a[0], includeSelf = _a[1];
        context.currentQuerySelector =
            parentSelector.length ? (parentSelector + ' ' + selector) : selector;
        getOrSetAsInMap(context.collectedStyles, context.currentQuerySelector, {});
        /** @type {?} */
        var animation = visitDslNode(this, normalizeAnimationEntry(metadata.animation), context);
        context.currentQuery = null;
        context.currentQuerySelector = parentSelector;
        return {
            type: 11 /* Query */,
            selector: selector,
            limit: options.limit || 0,
            optional: !!options.optional, includeSelf: includeSelf, animation: animation,
            originalSelector: metadata.selector,
            options: normalizeAnimationOptions(metadata.options)
        };
    };
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    AnimationAstBuilderVisitor.prototype.visitStagger = /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    function (metadata, context) {
        if (!context.currentQuery) {
            context.errors.push("stagger() can only be used inside of query()");
        }
        /** @type {?} */
        var timings = metadata.timings === 'full' ?
            { duration: 0, delay: 0, easing: 'full' } :
            resolveTiming(metadata.timings, context.errors, true);
        return {
            type: 12 /* Stagger */,
            animation: visitDslNode(this, normalizeAnimationEntry(metadata.animation), context), timings: timings,
            options: null
        };
    };
    return AnimationAstBuilderVisitor;
}());
export { AnimationAstBuilderVisitor };
if (false) {
    /** @type {?} */
    AnimationAstBuilderVisitor.prototype._driver;
}
/**
 * @param {?} selector
 * @return {?}
 */
function normalizeSelector(selector) {
    /** @type {?} */
    var hasAmpersand = selector.split(/\s*,\s*/).find(function (token) { return token == SELF_TOKEN; }) ? true : false;
    if (hasAmpersand) {
        selector = selector.replace(SELF_TOKEN_REGEX, '');
    }
    // the :enter and :leave selectors are filled in at runtime during timeline building
    selector = selector.replace(/@\*/g, NG_TRIGGER_SELECTOR)
        .replace(/@\w+/g, function (match) { return NG_TRIGGER_SELECTOR + '-' + match.substr(1); })
        .replace(/:animating/g, NG_ANIMATING_SELECTOR);
    return [selector, hasAmpersand];
}
/**
 * @param {?} obj
 * @return {?}
 */
function normalizeParams(obj) {
    return obj ? copyObj(obj) : null;
}
/** @typedef {?} */
var StyleTimeTuple;
export { StyleTimeTuple };
var AnimationAstBuilderContext = /** @class */ (function () {
    function AnimationAstBuilderContext(errors) {
        this.errors = errors;
        this.queryCount = 0;
        this.depCount = 0;
        this.currentTransition = null;
        this.currentQuery = null;
        this.currentQuerySelector = null;
        this.currentAnimateTimings = null;
        this.currentTime = 0;
        this.collectedStyles = {};
        this.options = null;
    }
    return AnimationAstBuilderContext;
}());
export { AnimationAstBuilderContext };
if (false) {
    /** @type {?} */
    AnimationAstBuilderContext.prototype.queryCount;
    /** @type {?} */
    AnimationAstBuilderContext.prototype.depCount;
    /** @type {?} */
    AnimationAstBuilderContext.prototype.currentTransition;
    /** @type {?} */
    AnimationAstBuilderContext.prototype.currentQuery;
    /** @type {?} */
    AnimationAstBuilderContext.prototype.currentQuerySelector;
    /** @type {?} */
    AnimationAstBuilderContext.prototype.currentAnimateTimings;
    /** @type {?} */
    AnimationAstBuilderContext.prototype.currentTime;
    /** @type {?} */
    AnimationAstBuilderContext.prototype.collectedStyles;
    /** @type {?} */
    AnimationAstBuilderContext.prototype.options;
    /** @type {?} */
    AnimationAstBuilderContext.prototype.errors;
}
/**
 * @param {?} styles
 * @return {?}
 */
function consumeOffset(styles) {
    if (typeof styles == 'string')
        return null;
    /** @type {?} */
    var offset = null;
    if (Array.isArray(styles)) {
        styles.forEach(function (styleTuple) {
            if (isObject(styleTuple) && styleTuple.hasOwnProperty('offset')) {
                /** @type {?} */
                var obj = /** @type {?} */ (styleTuple);
                offset = parseFloat(/** @type {?} */ (obj['offset']));
                delete obj['offset'];
            }
        });
    }
    else if (isObject(styles) && styles.hasOwnProperty('offset')) {
        /** @type {?} */
        var obj = /** @type {?} */ (styles);
        offset = parseFloat(/** @type {?} */ (obj['offset']));
        delete obj['offset'];
    }
    return offset;
}
/**
 * @param {?} value
 * @return {?}
 */
function isObject(value) {
    return !Array.isArray(value) && typeof value == 'object';
}
/**
 * @param {?} value
 * @param {?} errors
 * @return {?}
 */
function constructTimingAst(value, errors) {
    /** @type {?} */
    var timings = null;
    if (value.hasOwnProperty('duration')) {
        timings = /** @type {?} */ (value);
    }
    else if (typeof value == 'number') {
        /** @type {?} */
        var duration = resolveTiming(/** @type {?} */ (value), errors).duration;
        return makeTimingAst(/** @type {?} */ (duration), 0, '');
    }
    /** @type {?} */
    var strValue = /** @type {?} */ (value);
    /** @type {?} */
    var isDynamic = strValue.split(/\s+/).some(function (v) { return v.charAt(0) == '{' && v.charAt(1) == '{'; });
    if (isDynamic) {
        /** @type {?} */
        var ast = /** @type {?} */ (makeTimingAst(0, 0, ''));
        ast.dynamic = true;
        ast.strValue = strValue;
        return /** @type {?} */ (ast);
    }
    timings = timings || resolveTiming(strValue, errors);
    return makeTimingAst(timings.duration, timings.delay, timings.easing);
}
/**
 * @param {?} options
 * @return {?}
 */
function normalizeAnimationOptions(options) {
    if (options) {
        options = copyObj(options);
        if (options['params']) {
            options['params'] = /** @type {?} */ ((normalizeParams(options['params'])));
        }
    }
    else {
        options = {};
    }
    return options;
}
/**
 * @param {?} duration
 * @param {?} delay
 * @param {?} easing
 * @return {?}
 */
function makeTimingAst(duration, delay, easing) {
    return { duration: duration, delay: delay, easing: easing };
}
//# sourceMappingURL=animation_ast_builder.js.map