"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var assert_1 = require("./assert");
var view_1 = require("./interfaces/view");
/**
* Must use this method for CD (instead of === ) since NaN !== NaN
*/
function isDifferent(a, b) {
    // NaN is the only value that is not equal to itself so the first
    // test checks if both a and b are not NaN
    return !(a !== a && b !== b) && a !== b;
}
exports.isDifferent = isDifferent;
function stringify(value) {
    if (typeof value == 'function')
        return value.name || value;
    if (typeof value == 'string')
        return value;
    if (value == null)
        return '';
    return '' + value;
}
exports.stringify = stringify;
/**
 *  Function that throws a "not implemented" error so it's clear certain
 *  behaviors/methods aren't yet ready.
 *
 * @returns Not implemented error
 */
function notImplemented() {
    return new Error('NotImplemented');
}
exports.notImplemented = notImplemented;
/**
 * Flattens an array in non-recursive way. Input arrays are not modified.
 */
function flatten(list) {
    var result = [];
    var i = 0;
    while (i < list.length) {
        var item = list[i];
        if (Array.isArray(item)) {
            if (item.length > 0) {
                list = item.concat(list.slice(i + 1));
                i = 0;
            }
            else {
                i++;
            }
        }
        else {
            result.push(item);
            i++;
        }
    }
    return result;
}
exports.flatten = flatten;
/** Retrieves a value from any `LViewData`. */
function loadInternal(index, arr) {
    ngDevMode && assertDataInRangeInternal(index + view_1.HEADER_OFFSET, arr);
    return arr[index + view_1.HEADER_OFFSET];
}
exports.loadInternal = loadInternal;
function assertDataInRangeInternal(index, arr) {
    assert_1.assertLessThan(index, arr ? arr.length : 0, 'index expected to be a valid data index');
}
exports.assertDataInRangeInternal = assertDataInRangeInternal;
/** Retrieves an element value from the provided `viewData`.
  *
  * Elements that are read may be wrapped in a style context,
  * therefore reading the value may involve unwrapping that.
  */
function loadElementInternal(index, arr) {
    var value = loadInternal(index, arr);
    return readElementValue(value);
}
exports.loadElementInternal = loadElementInternal;
function readElementValue(value) {
    return (Array.isArray(value) ? value[0] : value);
}
exports.readElementValue = readElementValue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3JlbmRlcjMvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILG1DQUF3QztBQUV4QywwQ0FBMkQ7QUFHM0Q7O0VBRUU7QUFDRixxQkFBNEIsQ0FBTSxFQUFFLENBQU07SUFDeEMsaUVBQWlFO0lBQ2pFLDBDQUEwQztJQUMxQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzFDLENBQUM7QUFKRCxrQ0FJQztBQUVELG1CQUEwQixLQUFVO0lBQ2xDLElBQUksT0FBTyxLQUFLLElBQUksVUFBVTtRQUFFLE9BQU8sS0FBSyxDQUFDLElBQUksSUFBSSxLQUFLLENBQUM7SUFDM0QsSUFBSSxPQUFPLEtBQUssSUFBSSxRQUFRO1FBQUUsT0FBTyxLQUFLLENBQUM7SUFDM0MsSUFBSSxLQUFLLElBQUksSUFBSTtRQUFFLE9BQU8sRUFBRSxDQUFDO0lBQzdCLE9BQU8sRUFBRSxHQUFHLEtBQUssQ0FBQztBQUNwQixDQUFDO0FBTEQsOEJBS0M7QUFFRDs7Ozs7R0FLRztBQUNIO0lBQ0UsT0FBTyxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3JDLENBQUM7QUFGRCx3Q0FFQztBQUVEOztHQUVHO0FBQ0gsaUJBQXdCLElBQVc7SUFDakMsSUFBTSxNQUFNLEdBQVUsRUFBRSxDQUFDO0lBQ3pCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUVWLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUU7UUFDdEIsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN2QixJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUNuQixJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ1A7aUJBQU07Z0JBQ0wsQ0FBQyxFQUFFLENBQUM7YUFDTDtTQUNGO2FBQU07WUFDTCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xCLENBQUMsRUFBRSxDQUFDO1NBQ0w7S0FDRjtJQUVELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFwQkQsMEJBb0JDO0FBRUQsOENBQThDO0FBQzlDLHNCQUFnQyxLQUFhLEVBQUUsR0FBYztJQUMzRCxTQUFTLElBQUkseUJBQXlCLENBQUMsS0FBSyxHQUFHLG9CQUFhLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDbkUsT0FBTyxHQUFHLENBQUMsS0FBSyxHQUFHLG9CQUFhLENBQUMsQ0FBQztBQUNwQyxDQUFDO0FBSEQsb0NBR0M7QUFFRCxtQ0FBMEMsS0FBYSxFQUFFLEdBQVU7SUFDakUsdUJBQWMsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUseUNBQXlDLENBQUMsQ0FBQztBQUN6RixDQUFDO0FBRkQsOERBRUM7QUFFRDs7OztJQUlJO0FBQ0osNkJBQW9DLEtBQWEsRUFBRSxHQUFjO0lBQy9ELElBQU0sS0FBSyxHQUFHLFlBQVksQ0FBZSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDckQsT0FBTyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNqQyxDQUFDO0FBSEQsa0RBR0M7QUFFRCwwQkFBaUMsS0FBMkI7SUFDMUQsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFFLEtBQXNCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBaUIsQ0FBQztBQUNyRixDQUFDO0FBRkQsNENBRUMifQ==