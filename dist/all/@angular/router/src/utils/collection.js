"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var shared_1 = require("../shared");
function shallowEqualArrays(a, b) {
    if (a.length !== b.length)
        return false;
    for (var i = 0; i < a.length; ++i) {
        if (!shallowEqual(a[i], b[i]))
            return false;
    }
    return true;
}
exports.shallowEqualArrays = shallowEqualArrays;
function shallowEqual(a, b) {
    var k1 = Object.keys(a);
    var k2 = Object.keys(b);
    if (k1.length != k2.length) {
        return false;
    }
    var key;
    for (var i = 0; i < k1.length; i++) {
        key = k1[i];
        if (a[key] !== b[key]) {
            return false;
        }
    }
    return true;
}
exports.shallowEqual = shallowEqual;
/**
 * Flattens single-level nested arrays.
 */
function flatten(arr) {
    return Array.prototype.concat.apply([], arr);
}
exports.flatten = flatten;
/**
 * Return the last element of an array.
 */
function last(a) {
    return a.length > 0 ? a[a.length - 1] : null;
}
exports.last = last;
/**
 * Verifys all booleans in an array are `true`.
 */
function and(bools) {
    return !bools.some(function (v) { return !v; });
}
exports.and = and;
function forEach(map, callback) {
    for (var prop in map) {
        if (map.hasOwnProperty(prop)) {
            callback(map[prop], prop);
        }
    }
}
exports.forEach = forEach;
function waitForMap(obj, fn) {
    if (Object.keys(obj).length === 0) {
        return rxjs_1.of({});
    }
    var waitHead = [];
    var waitTail = [];
    var res = {};
    forEach(obj, function (a, k) {
        var mapped = fn(k, a).pipe(operators_1.map(function (r) { return res[k] = r; }));
        if (k === shared_1.PRIMARY_OUTLET) {
            waitHead.push(mapped);
        }
        else {
            waitTail.push(mapped);
        }
    });
    // Closure compiler has problem with using spread operator here. So just using Array.concat.
    return rxjs_1.of.apply(null, waitHead.concat(waitTail)).pipe(operators_1.concatAll(), operators_1.last(), operators_1.map(function () { return res; }));
}
exports.waitForMap = waitForMap;
/**
 * ANDs Observables by merging all input observables, reducing to an Observable verifying all
 * input Observables return `true`.
 */
function andObservables(observables) {
    return observables.pipe(operators_1.mergeAll(), operators_1.every(function (result) { return result === true; }));
}
exports.andObservables = andObservables;
function wrapIntoObservable(value) {
    if (core_1.ɵisObservable(value)) {
        return value;
    }
    if (core_1.ɵisPromise(value)) {
        // Use `Promise.resolve()` to wrap promise-like instances.
        // Required ie when a Resolver returns a AngularJS `$q` promise to correctly trigger the
        // change detection.
        return rxjs_1.from(Promise.resolve(value));
    }
    return rxjs_1.of(value);
}
exports.wrapIntoObservable = wrapIntoObservable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sbGVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3JvdXRlci9zcmMvdXRpbHMvY29sbGVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHNDQUFzRztBQUN0Ryw2QkFBMkM7QUFDM0MsNENBQWtGO0FBRWxGLG9DQUF5QztBQUV6Qyw0QkFBbUMsQ0FBUSxFQUFFLENBQVE7SUFDbkQsSUFBSSxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxNQUFNO1FBQUUsT0FBTyxLQUFLLENBQUM7SUFDeEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7UUFDakMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQUUsT0FBTyxLQUFLLENBQUM7S0FDN0M7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFORCxnREFNQztBQUVELHNCQUE2QixDQUFxQixFQUFFLENBQXFCO0lBQ3ZFLElBQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUIsSUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQixJQUFJLEVBQUUsQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRTtRQUMxQixPQUFPLEtBQUssQ0FBQztLQUNkO0lBQ0QsSUFBSSxHQUFXLENBQUM7SUFDaEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDbEMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNaLElB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