/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { AUTO_STYLE, style } from '@angular/animations';
import { getOrSetAsInMap } from '../render/shared';
import { NG_ANIMATING_SELECTOR, NG_TRIGGER_SELECTOR, SUBSTITUTION_EXPR_START, copyObj, extractStyleParams, iteratorToArray, normalizeAnimationEntry, resolveTiming, validateStyleParams, visitDslNode } from '../util';
import { parseTransitionExpr } from './animation_transition_expr';
/** @type {?} */
const SELF_TOKEN = ':self';
/** @type {?} */
const SELF_TOKEN_REGEX = new RegExp(`\s*${SELF_TOKEN}\s*,?`, 'g');
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
const ROOT_SELECTOR = '';
export class AnimationAstBuilderVisitor {
    /**
     * @param {?} _driver
     */
    constructor(_driver) {
        this._driver = _driver;
    }
    /**
     * @param {?} metadata
     * @param {?} errors
     * @return {?}
     */
    build(metadata, errors) {
        /** @type {?} */
        const context = new AnimationAstBuilderContext(errors);
        this._resetContextStyleTimingState(context);
        return /** @type {?} */ (visitDslNode(this, normalizeAnimationEntry(metadata), context));
    }
    /**
     * @param {?} context
     * @return {?}
     */
    _resetContextStyleTimingState(context) {
        context.currentQuerySelector = ROOT_SELECTOR;
        context.collectedStyles = {};
        context.collectedStyles[ROOT_SELECTOR] = {};
        context.currentTime = 0;
    }
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    visitTrigger(metadata, context) {
        /** @type {?} */
        let queryCount = context.queryCount = 0;
        /** @type {?} */
        let depCount = context.depCount = 0;
        /** @type {?} */
        const states = [];
        /** @type {?} */
        const transitions = [];
        if (metadata.name.charAt(0) == '@') {
            context.errors.push('animation triggers cannot be prefixed with an `@` sign (e.g. trigger(\'@foo\', [...]))');
        }
        metadata.definitions.forEach(def => {
            this._resetContextStyleTimingState(context);
            if (def.type == 0 /* State */) {
                /** @type {?} */
                const stateDef = /** @type {?} */ (def);
                /** @type {?} */
                const name = stateDef.name;
                name.toString().split(/\s*,\s*/).forEach(n => {
                    stateDef.name = n;
                    states.push(this.visitState(stateDef, context));
                });
                stateDef.name = name;
            }
            else if (def.type == 1 /* Transition */) {
                /** @type {?} */
                const transition = this.visitTransition(/** @type {?} */ (def), context);
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
            name: metadata.name, states, transitions, queryCount, depCount,
            options: null
        };
    }
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    visitState(metadata, context) {
        /** @type {?} */
        const styleAst = this.visitStyle(metadata.styles, context);
        /** @type {?} */
        const astParams = (metadata.options && metadata.options.params) || null;
        if (styleAst.containsDynamicStyles) {
            /** @type {?} */
            const missingSubs = new Set();
            /** @type {?} */
            const params = astParams || {};
            styleAst.styles.forEach(value => {
                if (isObject(value)) {
                    /** @type {?} */
                    const stylesObj = /** @type {?} */ (value);
                    Object.keys(stylesObj).forEach(prop => {
                        extractStyleParams(stylesObj[prop]).forEach(sub => {
                            if (!params.hasOwnProperty(sub)) {
                                missingSubs.add(sub);
                            }
                        });
                    });
                }
            });
            if (missingSubs.size) {
                /** @type {?} */
                const missingSubsArr = iteratorToArray(missingSubs.values());
                context.errors.push(`state("${metadata.name}", ...) must define default values for all the following style substitutions: ${missingSubsArr.join(', ')}`);
            }
        }
        return {
            type: 0 /* State */,
            name: metadata.name,
            style: styleAst,
            options: astParams ? { params: astParams } : null
        };
    }
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    visitTransition(metadata, context) {
        context.queryCount = 0;
        context.depCount = 0;
        /** @type {?} */
        const animation = visitDslNode(this, normalizeAnimationEntry(metadata.animation), context);
        /** @type {?} */
        const matchers = parseTransitionExpr(metadata.expr, context.errors);
        return {
            type: 1 /* Transition */,
            matchers,
            animation,
            queryCount: context.queryCount,
            depCount: context.depCount,
            options: normalizeAnimationOptions(metadata.options)
        };
    }
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    visitSequence(metadata, context) {
        return {
            type: 2 /* Sequence */,
            steps: metadata.steps.map(s => visitDslNode(this, s, context)),
            options: normalizeAnimationOptions(metadata.options)
        };
    }
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    visitGroup(metadata, context) {
        /** @type {?} */
        const currentTime = context.currentTime;
        /** @type {?} */
        let furthestTime = 0;
        /** @type {?} */
        const steps = metadata.steps.map(step => {
            context.currentTime = currentTime;
            /** @type {?} */
            const innerAst = visitDslNode(this, step, context);
            furthestTime = Math.max(furthestTime, context.currentTime);
            return innerAst;
        });
        context.currentTime = furthestTime;
        return {
            type: 3 /* Group */,
            steps,
            options: normalizeAnimationOptions(metadata.options)
        };
    }
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    visitAnimate(metadata, context) {
        /** @type {?} */
        const timingAst = constructTimingAst(metadata.timings, context.errors);
        context.currentAnimateTimings = timingAst;
        /** @type {?} */
        let styleAst;
        /** @type {?} */
        let styleMetadata = metadata.styles ? metadata.styles : style({});
        if (styleMetadata.type == 5 /* Keyframes */) {
            styleAst = this.visitKeyframes(/** @type {?} */ (styleMetadata), context);
        }
        else {
            /** @type {?} */
            let styleMetadata = /** @type {?} */ (metadata.styles);
            /** @type {?} */
            let isEmpty = false;
            if (!styleMetadata) {
                isEmpty = true;
                /** @type {?} */
                const newStyleData = {};
                if (timingAst.easing) {
                    newStyleData['easing'] = timingAst.easing;
                }
                styleMetadata = style(newStyleData);
            }
            context.currentTime += timingAst.duration + timingAst.delay;
            /** @type {?} */
            const _styleAst = this.visitStyle(styleMetadata, context);
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
    }
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    visitStyle(metadata, context) {
        /** @type {?} */
        const ast = this._makeStyleAst(metadata, context);
        this._validateStyleAst(ast, context);
        return ast;
    }
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    _makeStyleAst(metadata, context) {
        /** @type {?} */
        const styles = [];
        if (Array.isArray(metadata.styles)) {
            (/** @type {?} */ (metadata.styles)).forEach(styleTuple => {
                if (typeof styleTuple == 'string') {
                    if (styleTuple == AUTO_STYLE) {
                        styles.push(/** @type {?} */ (styleTuple));
                    }
                    else {
                        context.errors.push(`The provided style string value ${styleTuple} is not allowed.`);
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
        let containsDynamicStyles = false;
        /** @type {?} */
        let collectedEasing = null;
        styles.forEach(styleData => {
            if (isObject(styleData)) {
                /** @type {?} */
                const styleMap = /** @type {?} */ (styleData);
                /** @type {?} */
                const easing = styleMap['easing'];
                if (easing) {
                    collectedEasing = /** @type {?} */ (easing);
                    delete styleMap['easing'];
                }
                if (!containsDynamicStyles) {
                    for (let prop in styleMap) {
                        /** @type {?} */
                        const value = styleMap[prop];
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
            styles,
            easing: collectedEasing,
            offset: metadata.offset, containsDynamicStyles,
            options: null
        };
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    _validateStyleAst(ast, context) {
        /** @type {?} */
        const timings = context.currentAnimateTimings;
        /** @type {?} */
        let endTime = context.currentTime;
        /** @type {?} */
        let startTime = context.currentTime;
        if (timings && startTime > 0) {
            startTime -= timings.duration + timings.delay;
        }
        ast.styles.forEach(tuple => {
            if (typeof tuple == 'string')
                return;
            Object.keys(tuple).forEach(prop => {
                if (!this._driver.validateStyleProperty(prop)) {
                    context.errors.push(`The provided animation property "${prop}" is not a supported CSS property for animations`);
                    return;
                }
                /** @type {?} */
                const collectedStyles = context.collectedStyles[/** @type {?} */ ((context.currentQuerySelector))];
                /** @type {?} */
                const collectedEntry = collectedStyles[prop];
                /** @type {?} */
                let updateCollectedStyle = true;
                if (collectedEntry) {
                    if (startTime != endTime && startTime >= collectedEntry.startTime &&
                        endTime <= collectedEntry.endTime) {
                        context.errors.push(`The CSS property "${prop}" that exists between the times of "${collectedEntry.startTime}ms" and "${collectedEntry.endTime}ms" is also being animated in a parallel animation between the times of "${startTime}ms" and "${endTime}ms"`);
                        updateCollectedStyle = false;
                    }
                    // we always choose the smaller start time value since we
                    // want to have a record of the entire animation window where
                    // the style property is being animated in between
                    startTime = collectedEntry.startTime;
                }
                if (updateCollectedStyle) {
                    collectedStyles[prop] = { startTime, endTime };
                }
                if (context.options) {
                    validateStyleParams(tuple[prop], context.options, context.errors);
                }
            });
        });
    }
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    visitKeyframes(metadata, context) {
        /** @type {?} */
        const ast = { type: 5 /* Keyframes */, styles: [], options: null };
        if (!context.currentAnimateTimings) {
            context.errors.push(`keyframes() must be placed inside of a call to animate()`);
            return ast;
        }
        /** @type {?} */
        const MAX_KEYFRAME_OFFSET = 1;
        /** @type {?} */
        let totalKeyframesWithOffsets = 0;
        /** @type {?} */
        const offsets = [];
        /** @type {?} */
        let offsetsOutOfOrder = false;
        /** @type {?} */
        let keyframesOutOfRange = false;
        /** @type {?} */
        let previousOffset = 0;
        /** @type {?} */
        const keyframes = metadata.steps.map(styles => {
            /** @type {?} */
            const style = this._makeStyleAst(styles, context);
            /** @type {?} */
            let offsetVal = style.offset != null ? style.offset : consumeOffset(style.styles);
            /** @type {?} */
            let offset = 0;
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
            context.errors.push(`Please ensure that all keyframe offsets are between 0 and 1`);
        }
        if (offsetsOutOfOrder) {
            context.errors.push(`Please ensure that all keyframe offsets are in order`);
        }
        /** @type {?} */
        const length = metadata.steps.length;
        /** @type {?} */
        let generatedOffset = 0;
        if (totalKeyframesWithOffsets > 0 && totalKeyframesWithOffsets < length) {
            context.errors.push(`Not all style() steps within the declared keyframes() contain offsets`);
        }
        else if (totalKeyframesWithOffsets == 0) {
            generatedOffset = MAX_KEYFRAME_OFFSET / (length - 1);
        }
        /** @type {?} */
        const limit = length - 1;
        /** @type {?} */
        const currentTime = context.currentTime;
        /** @type {?} */
        const currentAnimateTimings = /** @type {?} */ ((context.currentAnimateTimings));
        /** @type {?} */
        const animateDuration = currentAnimateTimings.duration;
        keyframes.forEach((kf, i) => {
            /** @type {?} */
            const offset = generatedOffset > 0 ? (i == limit ? 1 : (generatedOffset * i)) : offsets[i];
            /** @type {?} */
            const durationUpToThisFrame = offset * animateDuration;
            context.currentTime = currentTime + currentAnimateTimings.delay + durationUpToThisFrame;
            currentAnimateTimings.duration = durationUpToThisFrame;
            this._validateStyleAst(kf, context);
            kf.offset = offset;
            ast.styles.push(kf);
        });
        return ast;
    }
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    visitReference(metadata, context) {
        return {
            type: 8 /* Reference */,
            animation: visitDslNode(this, normalizeAnimationEntry(metadata.animation), context),
            options: normalizeAnimationOptions(metadata.options)
        };
    }
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    visitAnimateChild(metadata, context) {
        context.depCount++;
        return {
            type: 9 /* AnimateChild */,
            options: normalizeAnimationOptions(metadata.options)
        };
    }
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    visitAnimateRef(metadata, context) {
        return {
            type: 10 /* AnimateRef */,
            animation: this.visitReference(metadata.animation, context),
            options: normalizeAnimationOptions(metadata.options)
        };
    }
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    visitQuery(metadata, context) {
        /** @type {?} */
        const parentSelector = /** @type {?} */ ((context.currentQuerySelector));
        /** @type {?} */
        const options = /** @type {?} */ ((metadata.options || {}));
        context.queryCount++;
        context.currentQuery = metadata;
        const [selector, includeSelf] = normalizeSelector(metadata.selector);
        context.currentQuerySelector =
            parentSelector.length ? (parentSelector + ' ' + selector) : selector;
        getOrSetAsInMap(context.collectedStyles, context.currentQuerySelector, {});
        /** @type {?} */
        const animation = visitDslNode(this, normalizeAnimationEntry(metadata.animation), context);
        context.currentQuery = null;
        context.currentQuerySelector = parentSelector;
        return {
            type: 11 /* Query */,
            selector,
            limit: options.limit || 0,
            optional: !!options.optional, includeSelf, animation,
            originalSelector: metadata.selector,
            options: normalizeAnimationOptions(metadata.options)
        };
    }
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    visitStagger(metadata, context) {
        if (!context.currentQuery) {
            context.errors.push(`stagger() can only be used inside of query()`);
        }
        /** @type {?} */
        const timings = metadata.timings === 'full' ?
            { duration: 0, delay: 0, easing: 'full' } :
            resolveTiming(metadata.timings, context.errors, true);
        return {
            type: 12 /* Stagger */,
            animation: visitDslNode(this, normalizeAnimationEntry(metadata.animation), context), timings,
            options: null
        };
    }
}
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
    const hasAmpersand = selector.split(/\s*,\s*/).find(token => token == SELF_TOKEN) ? true : false;
    if (hasAmpersand) {
        selector = selector.replace(SELF_TOKEN_REGEX, '');
    }
    // the :enter and :leave selectors are filled in at runtime during timeline building
    selector = selector.replace(/@\*/g, NG_TRIGGER_SELECTOR)
        .replace(/@\w+/g, match => NG_TRIGGER_SELECTOR + '-' + match.substr(1))
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
export class AnimationAstBuilderContext {
    /**
     * @param {?} errors
     */
    constructor(errors) {
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
}
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
    let offset = null;
    if (Array.isArray(styles)) {
        styles.forEach(styleTuple => {
            if (isObject(styleTuple) && styleTuple.hasOwnProperty('offset')) {
                /** @type {?} */
                const obj = /** @type {?} */ (styleTuple);
                offset = parseFloat(/** @type {?} */ (obj['offset']));
                delete obj['offset'];
            }
        });
    }
    else if (isObject(styles) && styles.hasOwnProperty('offset')) {
        /** @type {?} */
        const obj = /** @type {?} */ (styles);
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
    let timings = null;
    if (value.hasOwnProperty('duration')) {
        timings = /** @type {?} */ (value);
    }
    else if (typeof value == 'number') {
        /** @type {?} */
        const duration = resolveTiming(/** @type {?} */ (value), errors).duration;
        return makeTimingAst(/** @type {?} */ (duration), 0, '');
    }
    /** @type {?} */
    const strValue = /** @type {?} */ (value);
    /** @type {?} */
    const isDynamic = strValue.split(/\s+/).some(v => v.charAt(0) == '{' && v.charAt(1) == '{');
    if (isDynamic) {
        /** @type {?} */
        const ast = /** @type {?} */ (makeTimingAst(0, 0, ''));
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
    return { duration, delay, easing };
}
//# sourceMappingURL=animation_ast_builder.js.map