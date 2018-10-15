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
export const $EOF = 0;
/** @type {?} */
export const $TAB = 9;
/** @type {?} */
export const $LF = 10;
/** @type {?} */
export const $VTAB = 11;
/** @type {?} */
export const $FF = 12;
/** @type {?} */
export const $CR = 13;
/** @type {?} */
export const $SPACE = 32;
/** @type {?} */
export const $BANG = 33;
/** @type {?} */
export const $DQ = 34;
/** @type {?} */
export const $HASH = 35;
/** @type {?} */
export const $$ = 36;
/** @type {?} */
export const $PERCENT = 37;
/** @type {?} */
export const $AMPERSAND = 38;
/** @type {?} */
export const $SQ = 39;
/** @type {?} */
export const $LPAREN = 40;
/** @type {?} */
export const $RPAREN = 41;
/** @type {?} */
export const $STAR = 42;
/** @type {?} */
export const $PLUS = 43;
/** @type {?} */
export const $COMMA = 44;
/** @type {?} */
export const $MINUS = 45;
/** @type {?} */
export const $PERIOD = 46;
/** @type {?} */
export const $SLASH = 47;
/** @type {?} */
export const $COLON = 58;
/** @type {?} */
export const $SEMICOLON = 59;
/** @type {?} */
export const $LT = 60;
/** @type {?} */
export const $EQ = 61;
/** @type {?} */
export const $GT = 62;
/** @type {?} */
export const $QUESTION = 63;
/** @type {?} */
export const $0 = 48;
/** @type {?} */
export const $9 = 57;
/** @type {?} */
export const $A = 65;
/** @type {?} */
export const $E = 69;
/** @type {?} */
export const $F = 70;
/** @type {?} */
export const $X = 88;
/** @type {?} */
export const $Z = 90;
/** @type {?} */
export const $LBRACKET = 91;
/** @type {?} */
export const $BACKSLASH = 92;
/** @type {?} */
export const $RBRACKET = 93;
/** @type {?} */
export const $CARET = 94;
/** @type {?} */
export const $_ = 95;
/** @type {?} */
export const $a = 97;
/** @type {?} */
export const $e = 101;
/** @type {?} */
export const $f = 102;
/** @type {?} */
export const $n = 110;
/** @type {?} */
export const $r = 114;
/** @type {?} */
export const $t = 116;
/** @type {?} */
export const $u = 117;
/** @type {?} */
export const $v = 118;
/** @type {?} */
export const $x = 120;
/** @type {?} */
export const $z = 122;
/** @type {?} */
export const $LBRACE = 123;
/** @type {?} */
export const $BAR = 124;
/** @type {?} */
export const $RBRACE = 125;
/** @type {?} */
export const $NBSP = 160;
/** @type {?} */
export const $PIPE = 124;
/** @type {?} */
export const $TILDA = 126;
/** @type {?} */
export const $AT = 64;
/** @type {?} */
export const $BT = 96;
/**
 * @param {?} code
 * @return {?}
 */
export function isWhitespace(code) {
    return (code >= $TAB && code <= $SPACE) || (code == $NBSP);
}
/**
 * @param {?} code
 * @return {?}
 */
export function isDigit(code) {
    return $0 <= code && code <= $9;
}
/**
 * @param {?} code
 * @return {?}
 */
export function isAsciiLetter(code) {
    return code >= $a && code <= $z || code >= $A && code <= $Z;
}
/**
 * @param {?} code
 * @return {?}
 */
export function isAsciiHexDigit(code) {
    return code >= $a && code <= $f || code >= $A && code <= $F || isDigit(code);
}
//# sourceMappingURL=chars.js.map