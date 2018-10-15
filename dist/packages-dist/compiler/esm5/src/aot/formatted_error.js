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
import { syntaxError } from '../util';
/**
 * @record
 */
export function Position() { }
/** @type {?} */
Position.prototype.fileName;
/** @type {?} */
Position.prototype.line;
/** @type {?} */
Position.prototype.column;
/**
 * @record
 */
export function FormattedMessageChain() { }
/** @type {?} */
FormattedMessageChain.prototype.message;
/** @type {?|undefined} */
FormattedMessageChain.prototype.position;
/** @type {?|undefined} */
FormattedMessageChain.prototype.next;
/** @typedef {?} */
var FormattedError;
export { FormattedError };
/** @type {?} */
var FORMATTED_MESSAGE = 'ngFormattedMessage';
/**
 * @param {?} level
 * @return {?}
 */
function indentStr(level) {
    if (level <= 0)
        return '';
    if (level < 6)
        return ['', ' ', '  ', '   ', '    ', '     '][level];
    /** @type {?} */
    var half = indentStr(Math.floor(level / 2));
    return half + half + (level % 2 === 1 ? ' ' : '');
}
/**
 * @param {?} chain
 * @param {?=} indent
 * @return {?}
 */
function formatChain(chain, indent) {
    if (indent === void 0) { indent = 0; }
    if (!chain)
        return '';
    /** @type {?} */
    var position = chain.position ?
        chain.position.fileName + "(" + (chain.position.line + 1) + "," + (chain.position.column + 1) + ")" :
        '';
    /** @type {?} */
    var prefix = position && indent === 0 ? position + ": " : '';
    /** @type {?} */
    var postfix = position && indent !== 0 ? " at " + position : '';
    /** @type {?} */
    var message = "" + prefix + chain.message + postfix;
    return "" + indentStr(indent) + message + ((chain.next && ('\n' + formatChain(chain.next, indent + 2))) || '');
}
/**
 * @param {?} chain
 * @return {?}
 */
export function formattedError(chain) {
    /** @type {?} */
    var message = formatChain(chain) + '.';
    /** @type {?} */
    var error = /** @type {?} */ (syntaxError(message));
    (/** @type {?} */ (error))[FORMATTED_MESSAGE] = true;
    error.chain = chain;
    error.position = chain.position;
    return error;
}
/**
 * @param {?} error
 * @return {?}
 */
export function isFormattedError(error) {
    return !!(/** @type {?} */ (error))[FORMATTED_MESSAGE];
}
//# sourceMappingURL=formatted_error.js.map