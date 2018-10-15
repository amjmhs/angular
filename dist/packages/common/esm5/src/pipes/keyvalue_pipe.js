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
import { KeyValueDiffers, Pipe } from '@angular/core';
/**
 * @template K, V
 * @param {?} key
 * @param {?} value
 * @return {?}
 */
function makeKeyValuePair(key, value) {
    return { key: key, value: value };
}
/**
 * A key value pair.
 * Usually used to represent the key value pairs from a Map or Object.
 * @record
 * @template K, V
 */
export function KeyValue() { }
/** @type {?} */
KeyValue.prototype.key;
/** @type {?} */
KeyValue.prototype.value;
/**
 * \@ngModule CommonModule
 * \@description
 *
 * Transforms Object or Map into an array of key value pairs.
 *
 * The output array will be ordered by keys.
 * By default the comparator will be by Unicode point value.
 * You can optionally pass a compareFn if your keys are complex types.
 *
 * \@usageNotes
 * ### Examples
 *
 * This examples show how an Object or a Map and be iterated by ngFor with the use of this keyvalue
 * pipe.
 *
 * {\@example common/pipes/ts/keyvalue_pipe.ts region='KeyValuePipe'}
 */
var KeyValuePipe = /** @class */ (function () {
    function KeyValuePipe(differs) {
        this.differs = differs;
    }
    /**
     * @template K, V
     * @param {?} input
     * @param {?=} compareFn
     * @return {?}
     */
    KeyValuePipe.prototype.transform = /**
     * @template K, V
     * @param {?} input
     * @param {?=} compareFn
     * @return {?}
     */
    function (input, compareFn) {
        var _this = this;
        if (compareFn === void 0) { compareFn = defaultComparator; }
        if (!input || (!(input instanceof Map) && typeof input !== 'object')) {
            return null;
        }
        if (!this.differ) {
            // make a differ for whatever type we've been passed in
            this.differ = this.differs.find(input).create();
        }
        /** @type {?} */
        var differChanges = this.differ.diff(/** @type {?} */ (input));
        if (differChanges) {
            this.keyValues = [];
            differChanges.forEachItem(function (r) {
                _this.keyValues.push(makeKeyValuePair(r.key, /** @type {?} */ ((r.currentValue))));
            });
            this.keyValues.sort(compareFn);
        }
        return this.keyValues;
    };
    KeyValuePipe.decorators = [
        { type: Pipe, args: [{ name: 'keyvalue', pure: false },] },
    ];
    /** @nocollapse */
    KeyValuePipe.ctorParameters = function () { return [
        { type: KeyValueDiffers }
    ]; };
    return KeyValuePipe;
}());
export { KeyValuePipe };
if (false) {
    /** @type {?} */
    KeyValuePipe.prototype.differ;
    /** @type {?} */
    KeyValuePipe.prototype.keyValues;
    /** @type {?} */
    KeyValuePipe.prototype.differs;
}
/**
 * @template K, V
 * @param {?} keyValueA
 * @param {?} keyValueB
 * @return {?}
 */
export function defaultComparator(keyValueA, keyValueB) {
    /** @type {?} */
    var a = keyValueA.key;
    /** @type {?} */
    var b = keyValueB.key;
    // if same exit with 0;
    if (a === b)
        return 0;
    // make sure that undefined are at the end of the sort.
    if (a === undefined)
        return 1;
    if (b === undefined)
        return -1;
    // make sure that nulls are at the end of the sort.
    if (a === null)
        return 1;
    if (b === null)
        return -1;
    if (typeof a == 'string' && typeof b == 'string') {
        return a < b ? -1 : 1;
    }
    if (typeof a == 'number' && typeof b == 'number') {
        return a - b;
    }
    if (typeof a == 'boolean' && typeof b == 'boolean') {
        return a < b ? -1 : 1;
    }
    /** @type {?} */
    var aString = String(a);
    /** @type {?} */
    var bString = String(b);
    return aString == bString ? 0 : aString < bString ? -1 : 1;
}
//# sourceMappingURL=keyvalue_pipe.js.map