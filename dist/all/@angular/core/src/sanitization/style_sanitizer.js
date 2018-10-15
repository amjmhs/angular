"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var application_ref_1 = require("../application_ref");
var url_sanitizer_1 = require("./url_sanitizer");
/**
 * Regular expression for safe style values.
 *
 * Quotes (" and ') are allowed, but a check must be done elsewhere to ensure they're balanced.
 *
 * ',' allows multiple values to be assigned to the same property (e.g. background-attachment or
 * font-family) and hence could allow multiple values to get injected, but that should pose no risk
 * of XSS.
 *
 * The function expression checks only for XSS safety, not for CSS validity.
 *
 * This regular expression was taken from the Closure sanitization library, and augmented for
 * transformation values.
 */
var VALUES = '[-,."\'%_!# a-zA-Z0-9]+';
var TRANSFORMATION_FNS = '(?:matrix|translate|scale|rotate|skew|perspective)(?:X|Y|3d)?';
var COLOR_FNS = '(?:rgb|hsl)a?';
var GRADIENTS = '(?:repeating-)?(?:linear|radial)-gradient';
var CSS3_FNS = '(?:calc|attr)';
var FN_ARGS = '\\([-0-9.%, #a-zA-Z]+\\)';
var SAFE_STYLE_VALUE = new RegExp("^(" + VALUES + "|" +
    ("(?:" + TRANSFORMATION_FNS + "|" + COLOR_FNS + "|" + GRADIENTS + "|" + CSS3_FNS + ")") +
    (FN_ARGS + ")$"), 'g');
/**
 * Matches a `url(...)` value with an arbitrary argument as long as it does
 * not contain parentheses.
 *
 * The URL value still needs to be sanitized separately.
 *
 * `url(...)` values are a very common use case, e.g. for `background-image`. With carefully crafted
 * CSS style rules, it is possible to construct an information leak with `url` values in CSS, e.g.
 * by observing whether scroll bars are displayed, or character ranges used by a font face
 * definition.
 *
 * Angular only allows binding CSS values (as opposed to entire CSS rules), so it is unlikely that
 * binding a URL value without further cooperation from the page will cause an information leak, and
 * if so, it is just a leak, not a full blown XSS vulnerability.
 *
 * Given the common use case, low likelihood of attack vector, and low impact of an attack, this
 * code is permissive and allows URLs that sanitize otherwise.
 */
var URL_RE = /^url\(([^)]+)\)$/;
/**
 * Checks that quotes (" and ') are properly balanced inside a string. Assumes
 * that neither escape (\) nor any other character that could result in
 * breaking out of a string parsing context are allowed;
 * see http://www.w3.org/TR/css3-syntax/#string-token-diagram.
 *
 * This code was taken from the Closure sanitization library.
 */
function hasBalancedQuotes(value) {
    var outsideSingle = true;
    var outsideDouble = true;
    for (var i = 0; i < value.length; i++) {
        var c = value.charAt(i);
        if (c === '\'' && outsideDouble) {
            outsideSingle = !outsideSingle;
        }
        else if (c === '"' && outsideSingle) {
            outsideDouble = !outsideDouble;
        }
    }
    return outsideSingle && outsideDouble;
}
/**
 * Sanitizes the given untrusted CSS style property value (i.e. not an entire object, just a single
 * value) and returns a value that is safe to use in a browser environment.
 */
function _sanitizeStyle(value) {
    value = String(value).trim(); // Make sure it's actually a string.
    if (!value)
        return '';
    // Single url(...) values are supported, but only for URLs that sanitize cleanly. See above for
    // reasoning behind this.
    var urlMatch = value.match(URL_RE);
    if ((urlMatch && url_sanitizer_1._sanitizeUrl(urlMatch[1]) === urlMatch[1]) ||
        value.match(SAFE_STYLE_VALUE) && hasBalancedQuotes(value)) {
        return value; // Safe style values.
    }
    if (application_ref_1.isDevMode()) {
        console.warn("WARNING: sanitizing unsafe style value " + value + " (see http://g.co/ng/security#xss).");
    }
    return 'unsafe';
}
exports._sanitizeStyle = _sanitizeStyle;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R5bGVfc2FuaXRpemVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvc2FuaXRpemF0aW9uL3N0eWxlX3Nhbml0aXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHNEQUE2QztBQUM3QyxpREFBNkM7QUFHN0M7Ozs7Ozs7Ozs7Ozs7R0FhRztBQUNILElBQU0sTUFBTSxHQUFHLHlCQUF5QixDQUFDO0FBQ3pDLElBQU0sa0JBQWtCLEdBQUcsK0RBQStELENBQUM7QUFDM0YsSUFBTSxTQUFTLEdBQUcsZUFBZSxDQUFDO0FBQ2xDLElBQU0sU0FBUyxHQUFHLDJDQUEyQyxDQUFDO0FBQzlELElBQU0sUUFBUSxHQUFHLGVBQWUsQ0FBQztBQUNqQyxJQUFNLE9BQU8sR0FBRywwQkFBMEIsQ0FBQztBQUMzQyxJQUFNLGdCQUFnQixHQUFHLElBQUksTUFBTSxDQUMvQixPQUFLLE1BQU0sTUFBRztLQUNWLFFBQU0sa0JBQWtCLFNBQUksU0FBUyxTQUFJLFNBQVMsU0FBSSxRQUFRLE1BQUcsQ0FBQTtLQUM5RCxPQUFPLE9BQUksQ0FBQSxFQUNsQixHQUFHLENBQUMsQ0FBQztBQUVUOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCRztBQUNILElBQU0sTUFBTSxHQUFHLGtCQUFrQixDQUFDO0FBRWxDOzs7Ozs7O0dBT0c7QUFDSCwyQkFBMkIsS0FBYTtJQUN0QyxJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUM7SUFDekIsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDO0lBQ3pCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3JDLElBQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUIsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLGFBQWEsRUFBRTtZQUMvQixhQUFhLEdBQUcsQ0FBQyxhQUFhLENBQUM7U0FDaEM7YUFBTSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksYUFBYSxFQUFFO1lBQ3JDLGFBQWEsR0FBRyxDQUFDLGFBQWEsQ0FBQztTQUNoQztLQUNGO0lBQ0QsT0FBTyxhQUFhLElBQUksYUFBYSxDQUFDO0FBQ3hDLENBQUM7QUFFRDs7O0dBR0c7QUFDSCx3QkFBK0IsS0FBYTtJQUMxQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUUsb0NBQW9DO0lBQ25FLElBQUksQ0FBQyxLQUFLO1FBQUUsT0FBTyxFQUFFLENBQUM7SUFFdEIsK0ZBQStGO0lBQy9GLHlCQUF5QjtJQUN6QixJQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3JDLElBQUksQ0FBQyxRQUFRLElBQUksNEJBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkQsS0FBSyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQzdELE9BQU8sS0FBSyxDQUFDLENBQUUscUJBQXFCO0tBQ3JDO0lBRUQsSUFBSSwyQkFBUyxFQUFFLEVBQUU7UUFDZixPQUFPLENBQUMsSUFBSSxDQUNSLDRDQUEwQyxLQUFLLHdDQUFxQyxDQUFDLENBQUM7S0FDM0Y7SUFFRCxPQUFPLFFBQVEsQ0FBQztBQUNsQixDQUFDO0FBbEJELHdDQWtCQyJ9