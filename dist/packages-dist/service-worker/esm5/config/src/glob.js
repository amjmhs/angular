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
/** @type {?} */
var QUESTION_MARK = '[^/]';
/** @type {?} */
var WILD_SINGLE = '[^/]*';
/** @type {?} */
var WILD_OPEN = '(?:.+\\/)?';
/** @type {?} */
var TO_ESCAPE_BASE = [
    { replace: /\./g, with: '\\.' },
    { replace: /\+/g, with: '\\+' },
    { replace: /\*/g, with: WILD_SINGLE },
];
/** @type {?} */
var TO_ESCAPE_WILDCARD_QM = TO_ESCAPE_BASE.concat([
    { replace: /\?/g, with: QUESTION_MARK },
]);
/** @type {?} */
var TO_ESCAPE_LITERAL_QM = TO_ESCAPE_BASE.concat([
    { replace: /\?/g, with: '\\?' },
]);
/**
 * @param {?} glob
 * @param {?=} literalQuestionMark
 * @return {?}
 */
export function globToRegex(glob, literalQuestionMark) {
    if (literalQuestionMark === void 0) { literalQuestionMark = false; }
    /** @type {?} */
    var toEscape = literalQuestionMark ? TO_ESCAPE_LITERAL_QM : TO_ESCAPE_WILDCARD_QM;
    /** @type {?} */
    var segments = glob.split('/').reverse();
    /** @type {?} */
    var regex = '';
    while (segments.length > 0) {
        /** @type {?} */
        var segment = /** @type {?} */ ((segments.pop()));
        if (segment === '**') {
            if (segments.length > 0) {
                regex += WILD_OPEN;
            }
            else {
                regex += '.*';
            }
        }
        else {
            /** @type {?} */
            var processed = toEscape.reduce(function (segment, escape) { return segment.replace(escape.replace, escape.with); }, segment);
            regex += processed;
            if (segments.length > 0) {
                regex += '\\/';
            }
        }
    }
    return regex;
}
//# sourceMappingURL=glob.js.map