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
export var $EOF = 0;
/** @type {?} */
export var $TAB = 9;
/** @type {?} */
export var $LF = 10;
/** @type {?} */
export var $VTAB = 11;
/** @type {?} */
export var $FF = 12;
/** @type {?} */
export var $CR = 13;
/** @type {?} */
export var $SPACE = 32;
/** @type {?} */
export var $BANG = 33;
/** @type {?} */
export var $DQ = 34;
/** @type {?} */
export var $HASH = 35;
/** @type {?} */
export var $$ = 36;
/** @type {?} */
export var $PERCENT = 37;
/** @type {?} */
export var $AMPERSAND = 38;
/** @type {?} */
export var $SQ = 39;
/** @type {?} */
export var $LPAREN = 40;
/** @type {?} */
export var $RPAREN = 41;
/** @type {?} */
export var $STAR = 42;
/** @type {?} */
export var $PLUS = 43;
/** @type {?} */
export var $COMMA = 44;
/** @type {?} */
export var $MINUS = 45;
/** @type {?} */
export var $PERIOD = 46;
/** @type {?} */
export var $SLASH = 47;
/** @type {?} */
export var $COLON = 58;
/** @type {?} */
export var $SEMICOLON = 59;
/** @type {?} */
export var $LT = 60;
/** @type {?} */
export var $EQ = 61;
/** @type {?} */
export var $GT = 62;
/** @type {?} */
export var $QUESTION = 63;
/** @type {?} */
export var $0 = 48;
/** @type {?} */
export var $9 = 57;
/** @type {?} */
export var $A = 65;
/** @type {?} */
export var $E = 69;
/** @type {?} */
export var $F = 70;
/** @type {?} */
export var $X = 88;
/** @type {?} */
export var $Z = 90;
/** @type {?} */
export var $LBRACKET = 91;
/** @type {?} */
export var $BACKSLASH = 92;
/** @type {?} */
export var $RBRACKET = 93;
/** @type {?} */
export var $CARET = 94;
/** @type {?} */
export var $_ = 95;
/** @type {?} */
export var $a = 97;
/** @type {?} */
export var $e = 101;
/** @type {?} */
export var $f = 102;
/** @type {?} */
export var $n = 110;
/** @type {?} */
export var $r = 114;
/** @type {?} */
export var $t = 116;
/** @type {?} */
export var $u = 117;
/** @type {?} */
export var $v = 118;
/** @type {?} */
export var $x = 120;
/** @type {?} */
export var $z = 122;
/** @type {?} */
export var $LBRACE = 123;
/** @type {?} */
export var $BAR = 124;
/** @type {?} */
export var $RBRACE = 125;
/** @type {?} */
export var $NBSP = 160;
/** @type {?} */
export var $PIPE = 124;
/** @type {?} */
export var $TILDA = 126;
/** @type {?} */
export var $AT = 64;
/** @type {?} */
export var $BT = 96;
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