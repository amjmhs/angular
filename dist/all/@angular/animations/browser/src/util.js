"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var animations_1 = require("@angular/animations");
var shared_1 = require("./render/shared");
exports.ONE_SECOND = 1000;
exports.SUBSTITUTION_EXPR_START = '{{';
exports.SUBSTITUTION_EXPR_END = '}}';
exports.ENTER_CLASSNAME = 'ng-enter';
exports.LEAVE_CLASSNAME = 'ng-leave';
exports.ENTER_SELECTOR = '.ng-enter';
exports.LEAVE_SELECTOR = '.ng-leave';
exports.NG_TRIGGER_CLASSNAME = 'ng-trigger';
exports.NG_TRIGGER_SELECTOR = '.ng-trigger';
exports.NG_ANIMATING_CLASSNAME = 'ng-animating';
exports.NG_ANIMATING_SELECTOR = '.ng-animating';
function resolveTimingValue(value) {
    if (typeof value == 'number')
        return value;
    var matches = value.match(/^(-?[\.\d]+)(m?s)/);
    if (!matches || matches.length < 2)
        return 0;
    return _convertTimeValueToMS(parseFloat(matches[1]), matches[2]);
}
exports.resolveTimingValue = resolveTimingValue;
function _convertTimeValueToMS(value, unit) {
    switch (unit) {
        case 's':
            return value * exports.ONE_SECOND;
        default: // ms or something else
            return value;
    }
}
function resolveTiming(timings, errors, allowNegativeValues) {
    return timings.hasOwnProperty('duration') ?
        timings :
        parseTimeExpression(timings, errors, allowNegativeValues);
}
exports.resolveTiming = resolveTiming;
function parseTimeExpression(exp, errors, allowNegativeValues) {
    var regex = /^(-?[\.\d]+)(m?s)(?:\s+(-?[\.\d]+)(m?s))?(?:\s+([-a-z]+(?:\(.+?\))?))?$/i;
    var duration;
    var delay = 0;
    var easing = '';
    if (typeof exp === 'string') {
        var matches = exp.match(regex);
        if (matches === null) {
            errors.push("The provided timing value \"" + exp + "\" is invalid.");
            return { duration: 0, delay: 0, easing: '' };
        }
        duration = _convertTimeValueToMS(parseFloat(matches[1]), matches[2]);
        var delayMatch = matches[3];
        if (delayMatch != null) {
            delay = _convertTimeValueToMS(Math.floor(parseFloat(delayMatch)), matches[4]);
        }
        var easingVal = matches[5];
        if (easingVal) {
            easing = easingVal;
        }
    }
    else {
        duration = exp;
    }
    if (!allowNegativeValues) {
        var containsErrors = false;
        var startIndex = errors.length;
        if (duration < 0) {
            errors.push("Duration values below 0 are not allowed for this animation step.");
            containsErrors = true;
        }
        if (delay < 0) {
            errors.push("Delay values below 0 are not allowed for this animation step.");
            containsErrors = true;
        }
        if (containsErrors) {
            errors.splice(startIndex, 0, "The provided timing value \"" + exp + "\" is invalid.");
        }
    }
    return { duration: duration, delay: delay, easing: easing };
}
function copyObj(obj, destination) {
    if (destination === void 0) { destination = {}; }
    Object.keys(obj).forEach(function (prop) { destination[prop] = obj[prop]; });
    return destination;
}
exports.copyObj = copyObj;
function normalizeStyles(styles) {
    var normalizedStyles = {};
    if (Array.isArray(styles)) {
        styles.forEach(function (data) { return copyStyles(data, false, normalizedStyles); });
    }
    else {
        copyStyles(styles, false, normalizedStyles);
    }
    return normalizedStyles;
}
exports.normalizeStyles = normalizeStyles;
function copyStyles(styles, readPrototype, destination) {
    if (destination === void 0) { destination = {}; }
    if (readPrototype) {
        // we make use of a for-in loop so that the
        // prototypically inherited properties are
        // revealed from the backFill map
        for (var prop in styles) {
            destination[prop] = styles[prop];
        }
    }
    else {
        copyObj(styles, destination);
    }
    return destination;
}
exports.copyStyles = copyStyles;
function getStyleAttributeString(element, key, value) {
    // Return the key-value pair string to be added to the style attribute for the
    // given CSS style key.
    if (value) {
        return key + ':' + value + ';';
    }
    else {
        return '';
    }
}
function writeStyleAttribute(element) {
    // Read the style property of the element and manually reflect it to the
    // style attribute. This is needed because Domino on platform-server doesn't
    // understand the full set of allowed CSS properties and doesn't reflect some
    // of them automatically.
    var styleAttrValue = '';
    for (var i = 0; i < element.style.length; i++) {
        var key = element.style.item(i);
        styleAttrValue += getStyleAttributeString(element, key, element.style.getPropertyValue(key));
    }
    for (var key in element.style) {
        // Skip internal Domino properties that don't need to be reflected.
        if (!element.style.hasOwnProperty(key) || key.startsWith('_')) {
            continue;
        }
        var dashKey = camelCaseToDashCase(key);
        styleAttrValue += getStyleAttributeString(element, dashKey, element.style[key]);
    }
    element.setAttribute('style', styleAttrValue);
}
function setStyles(element, styles) {
    if (element['style']) {
        Object.keys(styles).forEach(function (prop) {
            var camelProp = dashCaseToCamelCase(prop);
            element.style[camelProp] = styles[prop];
        });
        // On the server set the 'style' attribute since it's not automatically reflected.
        if (shared_1.isNode()) {
            writeStyleAttribute(element);
        }
    }
}
exports.setStyles = setStyles;
function eraseStyles(element, styles) {
    if (element['style']) {
        Object.keys(styles).forEach(function (prop) {
            var camelProp = dashCaseToCamelCase(prop);
            element.style[camelProp] = '';
        });
        // On the server set the 'style' attribute since it's not automatically reflected.
        if (shared_1.isNode()) {
            writeStyleAttribute(element);
        }
    }
}
exports.eraseStyles = eraseStyles;
function normalizeAnimationEntry(steps) {
    if (Array.isArray(steps)) {
        if (steps.length == 1)
            return steps[0];
        return animations_1.sequence(steps);
    }
    return steps;
}
exports.normalizeAnimationEntry = normalizeAnimationEntry;
function validateStyleParams(value, options, errors) {
    var params = options.params || {};
    var matches = extractStyleParams(value);
    if (matches.length) {
        matches.forEach(function (varName) {
            if (!params.hasOwnProperty(varName)) {
                errors.push("Unable to resolve the local animation param " + varName + " in the given list of values");
            }
        });
    }
}
exports.validateStyleParams = validateStyleParams;
var PARAM_REGEX = new RegExp(exports.SUBSTITUTION_EXPR_START + "\\s*(.+?)\\s*" + exports.SUBSTITUTION_EXPR_END, 'g');
function extractStyleParams(value) {
    var params = [];
    if (typeof value === 'string') {
        var val = value.toString();
        var match = void 0;
        while (match = PARAM_REGEX.exec(val)) {
            params.push(match[1]);
        }
        PARAM_REGEX.lastIndex = 0;
    }
    return params;
}
exports.extractStyleParams = extractStyleParams;
function interpolateParams(value, params, errors) {
    var original = value.toString();
    var str = original.replace(PARAM_REGEX, function (_, varName) {
        var localVal = params[varName];
        // this means that the value was never overridden by the data passed in by the user
        if (!params.hasOwnProperty(varName)) {
            errors.push("Please provide a value for the animation param " + varName);
            localVal = '';
        }
        return localVal.toString();
    });
    // we do this to assert that numeric values stay as they are
    return str == original ? value : str;
}
exports.interpolateParams = interpolateParams;
function iteratorToArray(iterator) {
    var arr = [];
    var item = iterator.next();
    while (!item.done) {
        arr.push(item.value);
        item = iterator.next();
    }
    return arr;
}
exports.iteratorToArray = iteratorToArray;
function mergeAnimationOptions(source, destination) {
    if (source.params) {
        var p0_1 = source.params;
        if (!destination.params) {
            destination.params = {};
        }
        var p1_1 = destination.params;
        Object.keys(p0_1).forEach(function (param) {
            if (!p1_1.hasOwnProperty(param)) {
                p1_1[param] = p0_1[param];
            }
        });
    }
    return destination;
}
exports.mergeAnimationOptions = mergeAnimationOptions;
var DASH_CASE_REGEXP = /-+([a-z0-9])/g;
function dashCaseToCamelCase(input) {
    return input.replace(DASH_CASE_REGEXP, function () {
        var m = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            m[_i] = arguments[_i];
        }
        return m[1].toUpperCase();
    });
}
exports.dashCaseToCamelCase = dashCaseToCamelCase;
function camelCaseToDashCase(input) {
    return input.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
function allowPreviousPlayerStylesMerge(duration, delay) {
    return duration === 0 || delay === 0;
}
exports.allowPreviousPlayerStylesMerge = allowPreviousPlayerStylesMerge;
function balancePreviousStylesIntoKeyframes(element, keyframes, previousStyles) {
    var previousStyleProps = Object.keys(previousStyles);
    if (previousStyleProps.length && keyframes.length) {
        var startingKeyframe_1 = keyframes[0];
        var missingStyleProps_1 = [];
        previousStyleProps.forEach(function (prop) {
            if (!startingKeyframe_1.hasOwnProperty(prop)) {
                missingStyleProps_1.push(prop);
            }
            startingKeyframe_1[prop] = previousStyles[prop];
        });
        if (missingStyleProps_1.length) {
            var _loop_1 = function () {
                var kf = keyframes[i];
                missingStyleProps_1.forEach(function (prop) { kf[prop] = computeStyle(element, prop); });
            };
            // tslint:disable-next-line
            for (var i = 1; i < keyframes.length; i++) {
                _loop_1();
            }
        }
    }
    return keyframes;
}
exports.balancePreviousStylesIntoKeyframes = balancePreviousStylesIntoKeyframes;
function visitDslNode(visitor, node, context) {
    switch (node.type) {
        case 7 /* Trigger */:
            return visitor.visitTrigger(node, context);
        case 0 /* State */:
            return visitor.visitState(node, context);
        case 1 /* Transition */:
            return visitor.visitTransition(node, context);
        case 2 /* Sequence */:
            return visitor.visitSequence(node, context);
        case 3 /* Group */:
            return visitor.visitGroup(node, context);
        case 4 /* Animate */:
            return visitor.visitAnimate(node, context);
        case 5 /* Keyframes */:
            return visitor.visitKeyframes(node, context);
        case 6 /* Style */:
            return visitor.visitStyle(node, context);
        case 8 /* Reference */:
            return visitor.visitReference(node, context);
        case 9 /* AnimateChild */:
            return visitor.visitAnimateChild(node, context);
        case 10 /* AnimateRef */:
            return visitor.visitAnimateRef(node, context);
        case 11 /* Query */:
            return visitor.visitQuery(node, context);
        case 12 /* Stagger */:
            return visitor.visitStagger(node, context);
        default:
            throw new Error("Unable to resolve animation metadata node #" + node.type);
    }
}
exports.visitDslNode = visitDslNode;
function computeStyle(element, prop) {
    return window.getComputedStyle(element)[prop];
}
exports.computeStyle = computeStyle;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2FuaW1hdGlvbnMvYnJvd3Nlci9zcmMvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILGtEQUFxSTtBQUdySSwwQ0FBdUM7QUFFMUIsUUFBQSxVQUFVLEdBQUcsSUFBSSxDQUFDO0FBRWxCLFFBQUEsdUJBQXVCLEdBQUcsSUFBSSxDQUFDO0FBQy9CLFFBQUEscUJBQXFCLEdBQUcsSUFBSSxDQUFDO0FBQzdCLFFBQUEsZUFBZSxHQUFHLFVBQVUsQ0FBQztBQUM3QixRQUFBLGVBQWUsR0FBRyxVQUFVLENBQUM7QUFDN0IsUUFBQSxjQUFjLEdBQUcsV0FBVyxDQUFDO0FBQzdCLFFBQUEsY0FBYyxHQUFHLFdBQVcsQ0FBQztBQUM3QixRQUFBLG9CQUFvQixHQUFHLFlBQVksQ0FBQztBQUNwQyxRQUFBLG1CQUFtQixHQUFHLGFBQWEsQ0FBQztBQUNwQyxRQUFBLHNCQUFzQixHQUFHLGNBQWMsQ0FBQztBQUN4QyxRQUFBLHFCQUFxQixHQUFHLGVBQWUsQ0FBQztBQUVyRCw0QkFBbUMsS0FBc0I7SUFDdkQsSUFBSSxPQUFPLEtBQUssSUFBSSxRQUFRO1FBQUUsT0FBTyxLQUFLLENBQUM7SUFFM0MsSUFBTSxPQUFPLEdBQUksS0FBZ0IsQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUM3RCxJQUFJLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQztRQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRTdDLE9BQU8scUJBQXFCLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25FLENBQUM7QUFQRCxnREFPQztBQUVELCtCQUErQixLQUFhLEVBQUUsSUFBWTtJQUN4RCxRQUFRLElBQUksRUFBRTtR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