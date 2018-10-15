/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** @enum {number} */
const Char = {
    OpenParen: 40,
    CloseParen: 41,
    Colon: 58,
    Semicolon: 59,
    BackSlash: 92,
    QuoteNone: 0,
    // indicating we are not inside a quote
    QuoteDouble: 34,
    QuoteSingle: 39,
};
/**
 * Parses string representation of a style and converts it into object literal.
 *
 * @param {?} value string representation of style as used in the `style` attribute in HTML.
 *   Example: `color: red; height: auto`.
 * @return {?} an object literal. `{ color: 'red', height: 'auto'}`.
 */
export function parseStyle(value) {
    /** @type {?} */
    const styles = {};
    /** @type {?} */
    let i = 0;
    /** @type {?} */
    let parenDepth = 0;
    /** @type {?} */
    let quote = 0 /* QuoteNone */;
    /** @type {?} */
    let valueStart = 0;
    /** @type {?} */
    let propStart = 0;
    /** @type {?} */
    let currentProp = null;
    /** @type {?} */
    let valueHasQuotes = false;
    while (i < value.length) {
        /** @type {?} */
        const token = /** @type {?} */ (value.charCodeAt(i++));
        switch (token) {
            case 40 /* OpenParen */:
                parenDepth++;
                break;
            case 41 /* CloseParen */:
                parenDepth--;
                break;
            case 39 /* QuoteSingle */:
                // valueStart needs to be there since prop values don't
                // have quotes in CSS
                valueHasQuotes = valueHasQuotes || valueStart > 0;
                if (quote === 0 /* QuoteNone */) {
                    quote = 39 /* QuoteSingle */;
                }
                else if (quote === 39 /* QuoteSingle */ && value.charCodeAt(i - 1) !== 92 /* BackSlash */) {
                    quote = 0 /* QuoteNone */;
                }
                break;
            case 34 /* QuoteDouble */:
                // same logic as above
                valueHasQuotes = valueHasQuotes || valueStart > 0;
                if (quote === 0 /* QuoteNone */) {
                    quote = 34 /* QuoteDouble */;
                }
                else if (quote === 34 /* QuoteDouble */ && value.charCodeAt(i - 1) !== 92 /* BackSlash */) {
                    quote = 0 /* QuoteNone */;
                }
                break;
            case 58 /* Colon */:
                if (!currentProp && parenDepth === 0 && quote === 0 /* QuoteNone */) {
                    currentProp = hyphenate(value.substring(propStart, i - 1).trim());
                    valueStart = i;
                }
                break;
            case 59 /* Semicolon */:
                if (currentProp && valueStart > 0 && parenDepth === 0 && quote === 0 /* QuoteNone */) {
                    /** @type {?} */
                    const styleVal = value.substring(valueStart, i - 1).trim();
                    styles[currentProp] = valueHasQuotes ? stripUnnecessaryQuotes(styleVal) : styleVal;
                    propStart = i;
                    valueStart = 0;
                    currentProp = null;
                    valueHasQuotes = false;
                }
                break;
        }
    }
    if (currentProp && valueStart) {
        /** @type {?} */
        const styleVal = value.substr(valueStart).trim();
        styles[currentProp] = valueHasQuotes ? stripUnnecessaryQuotes(styleVal) : styleVal;
    }
    return styles;
}
/**
 * @param {?} value
 * @return {?}
 */
export function stripUnnecessaryQuotes(value) {
    /** @type {?} */
    const qS = value.charCodeAt(0);
    /** @type {?} */
    const qE = value.charCodeAt(value.length - 1);
    if (qS == qE && (qS == 39 /* QuoteSingle */ || qS == 34 /* QuoteDouble */)) {
        /** @type {?} */
        const tempValue = value.substring(1, value.length - 1);
        // special case to avoid using a multi-quoted string that was just chomped
        // (e.g. `font-family: "Verdana", "sans-serif"`)
        if (tempValue.indexOf('\'') == -1 && tempValue.indexOf('"') == -1) {
            value = tempValue;
        }
    }
    return value;
}
/**
 * @param {?} value
 * @return {?}
 */
export function hyphenate(value) {
    return value.replace(/[a-z][A-Z]/g, v => {
        return v.charAt(0) + '-' + v.charAt(1);
    }).toLowerCase();
}
//# sourceMappingURL=styling.js.map