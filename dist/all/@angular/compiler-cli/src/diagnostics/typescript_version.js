"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Converts a `string` version into an array of numbers
 * @example
 * toNumbers('2.0.1'); // returns [2, 0, 1]
 */
function toNumbers(value) {
    return value.split('.').map(Number);
}
exports.toNumbers = toNumbers;
/**
 * Compares two arrays of positive numbers with lexicographical order in mind.
 *
 * However - unlike lexicographical order - for arrays of different length we consider:
 * [1, 2, 3] = [1, 2, 3, 0] instead of [1, 2, 3] < [1, 2, 3, 0]
 *
 * @param a The 'left hand' array in the comparison test
 * @param b The 'right hand' in the comparison test
 * @returns {-1|0|1} The comparison result: 1 if a is greater, -1 if b is greater, 0 is the two
 * arrays are equals
 */
function compareNumbers(a, b) {
    var max = Math.max(a.length, b.length);
    var min = Math.min(a.length, b.length);
    for (var i = 0; i < min; i++) {
        if (a[i] > b[i])
            return 1;
        if (a[i] < b[i])
            return -1;
    }
    if (min !== max) {
        var longestArray = a.length === max ? a : b;
        // The result to return in case the to arrays are considered different (1 if a is greater,
        // -1 if b is greater)
        var comparisonResult = a.length === max ? 1 : -1;
        // Check that at least one of the remaining elements is greater than 0 to consider that the two
        // arrays are different (e.g. [1, 0] and [1] are considered the same but not [1, 0, 1] and [1])
        for (var i = min; i < max; i++) {
            if (longestArray[i] > 0) {
                return comparisonResult;
            }
        }
    }
    return 0;
}
exports.compareNumbers = compareNumbers;
/**
 * Checks if a TypeScript version is:
 * - greater or equal than the provided `low` version,
 * - lower or equal than an optional `high` version.
 *
 * @param version The TypeScript version
 * @param low The minimum version
 * @param high The maximum version
 */
function isVersionBetween(version, low, high) {
    var tsNumbers = toNumbers(version);
    if (high !== undefined) {
        return compareNumbers(toNumbers(low), tsNumbers) <= 0 &&
            compareNumbers(toNumbers(high), tsNumbers) >= 0;
    }
    return compareNumbers(toNumbers(low), tsNumbers) <= 0;
}
exports.isVersionBetween = isVersionBetween;
/**
 * Compares two versions
 *
 * @param v1 The 'left hand' version in the comparison test
 * @param v2 The 'right hand' version in the comparison test
 * @returns {-1|0|1} The comparison result: 1 if v1 is greater, -1 if v2 is greater, 0 is the two
 * versions are equals
 */
function compareVersions(v1, v2) {
    return compareNumbers(toNumbers(v1), toNumbers(v2));
}
exports.compareVersions = compareVersions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXNjcmlwdF92ZXJzaW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9kaWFnbm9zdGljcy90eXBlc2NyaXB0X3ZlcnNpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSDs7OztHQUlHO0FBQ0gsbUJBQTBCLEtBQWE7SUFDckMsT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN0QyxDQUFDO0FBRkQsOEJBRUM7QUFFRDs7Ozs7Ozs7OztHQVVHO0FBQ0gsd0JBQStCLENBQVcsRUFBRSxDQUFXO0lBQ3JELElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDekMsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUV6QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzVCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFBRSxPQUFPLENBQUMsQ0FBQztRQUMxQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztLQUM1QjtJQUVELElBQUksR0FBRyxLQUFLLEdBQUcsRUFBRTtRQUNmLElBQU0sWUFBWSxHQUFHLENBQUMsQ0FBQyxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU5QywwRkFBMEY7UUFDMUYsc0JBQXNCO1FBQ3RCLElBQU0sZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFbkQsK0ZBQStGO1FBQy9GLCtGQUErRjtRQUMvRixLQUFLLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzlCLElBQUksWUFBWSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDdkIsT0FBTyxnQkFBZ0IsQ0FBQzthQUN6QjtTQUNGO0tBQ0Y7SUFFRCxPQUFPLENBQUMsQ0FBQztBQUNYLENBQUM7QUExQkQsd0NBMEJDO0FBRUQ7Ozs7Ozs7O0dBUUc7QUFDSCwwQkFBaUMsT0FBZSxFQUFFLEdBQVcsRUFBRSxJQUFhO0lBQzFFLElBQU0sU0FBUyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNyQyxJQUFJLElBQUksS0FBSyxTQUFTLEVBQUU7UUFDdEIsT0FBTyxjQUFjLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUM7WUFDakQsY0FBYyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDckQ7SUFDRCxPQUFPLGNBQWMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3hELENBQUM7QUFQRCw0Q0FPQztBQUVEOzs7Ozs7O0dBT0c7QUFDSCx5QkFBZ0MsRUFBVSxFQUFFLEVBQVU7SUFDcEQsT0FBTyxjQUFjLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3RELENBQUM7QUFGRCwwQ0FFQyJ9