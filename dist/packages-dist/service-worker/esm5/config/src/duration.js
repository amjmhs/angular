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
var PARSE_TO_PAIRS = /([0-9]+[^0-9]+)/g;
/** @type {?} */
var PAIR_SPLIT = /^([0-9]+)([dhmsu]+)$/;
/**
 * @param {?} duration
 * @return {?}
 */
export function parseDurationToMs(duration) {
    /** @type {?} */
    var matches = [];
    /** @type {?} */
    var array;
    while ((array = PARSE_TO_PAIRS.exec(duration)) !== null) {
        matches.push(array[0]);
    }
    return matches
        .map(function (match) {
        /** @type {?} */
        var res = PAIR_SPLIT.exec(match);
        if (res === null) {
            throw new Error("Not a valid duration: " + match);
        }
        /** @type {?} */
        var factor = 0;
        switch (res[2]) {
            case 'd':
                factor = 86400000;
                break;
            case 'h':
                factor = 3600000;
                break;
            case 'm':
                factor = 60000;
                break;
            case 's':
                factor = 1000;
                break;
            case 'u':
                factor = 1;
                break;
            default:
                throw new Error("Not a valid duration unit: " + res[2]);
        }
        return parseInt(res[1]) * factor;
    })
        .reduce(function (total, value) { return total + value; }, 0);
}
//# sourceMappingURL=duration.js.map