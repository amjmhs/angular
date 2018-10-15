"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../src/util");
function iterableDifferToString(iterableChanges) {
    var collection = [];
    iterableChanges.forEachItem(function (record) { return collection.push(icrAsString(record)); });
    var previous = [];
    iterableChanges.forEachPreviousItem(function (record) { return previous.push(icrAsString(record)); });
    var additions = [];
    iterableChanges.forEachAddedItem(function (record) { return additions.push(icrAsString(record)); });
    var moves = [];
    iterableChanges.forEachMovedItem(function (record) { return moves.push(icrAsString(record)); });
    var removals = [];
    iterableChanges.forEachRemovedItem(function (record) { return removals.push(icrAsString(record)); });
    var identityChanges = [];
    iterableChanges.forEachIdentityChange(function (record) { return identityChanges.push(icrAsString(record)); });
    return iterableChangesAsString({ collection: collection, previous: previous, additions: additions, moves: moves, removals: removals, identityChanges: identityChanges });
}
exports.iterableDifferToString = iterableDifferToString;
function icrAsString(icr) {
    return icr.previousIndex === icr.currentIndex ? util_1.stringify(icr.item) :
        util_1.stringify(icr.item) + '[' +
            util_1.stringify(icr.previousIndex) + '->' + util_1.stringify(icr.currentIndex) + ']';
}
function iterableChangesAsString(_a) {
    var _b = _a.collection, collection = _b === void 0 ? [] : _b, _c = _a.previous, previous = _c === void 0 ? [] : _c, _d = _a.additions, additions = _d === void 0 ? [] : _d, _e = _a.moves, moves = _e === void 0 ? [] : _e, _f = _a.removals, removals = _f === void 0 ? [] : _f, _g = _a.identityChanges, identityChanges = _g === void 0 ? [] : _g;
    return 'collection: ' + collection.join(', ') + '\n' +
        'previous: ' + previous.join(', ') + '\n' +
        'additions: ' + additions.join(', ') + '\n' +
        'moves: ' + moves.join(', ') + '\n' +
        'removals: ' + removals.join(', ') + '\n' +
        'identityChanges: ' + identityChanges.join(', ') + '\n';
}
exports.iterableChangesAsString = iterableChangesAsString;
function kvcrAsString(kvcr) {
    return util_1.looseIdentical(kvcr.previousValue, kvcr.currentValue) ?
        util_1.stringify(kvcr.key) :
        (util_1.stringify(kvcr.key) + '[' + util_1.stringify(kvcr.previousValue) + '->' +
            util_1.stringify(kvcr.currentValue) + ']');
}
function kvChangesAsString(kvChanges) {
    var map = [];
    var previous = [];
    var changes = [];
    var additions = [];
    var removals = [];
    kvChanges.forEachItem(function (r) { return map.push(kvcrAsString(r)); });
    kvChanges.forEachPreviousItem(function (r) { return previous.push(kvcrAsString(r)); });
    kvChanges.forEachChangedItem(function (r) { return changes.push(kvcrAsString(r)); });
    kvChanges.forEachAddedItem(function (r) { return additions.push(kvcrAsString(r)); });
    kvChanges.forEachRemovedItem(function (r) { return removals.push(kvcrAsString(r)); });
    return testChangesAsString({ map: map, previous: previous, additions: additions, changes: changes, removals: removals });
}
exports.kvChangesAsString = kvChangesAsString;
function testChangesAsString(_a) {
    var map = _a.map, previous = _a.previous, additions = _a.additions, changes = _a.changes, removals = _a.removals;
    if (!map)
        map = [];
    if (!previous)
        previous = [];
    if (!additions)
        additions = [];
    if (!changes)
        changes = [];
    if (!removals)
        removals = [];
    return 'map: ' + map.join(', ') + '\n' +
        'previous: ' + previous.join(', ') + '\n' +
        'additions: ' + additions.join(', ') + '\n' +
        'changes: ' + changes.join(', ') + '\n' +
        'removals: ' + removals.join(', ') + '\n';
}
exports.testChangesAsString = testChangesAsString;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9jaGFuZ2VfZGV0ZWN0aW9uL3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFLSCx1Q0FBeUQ7QUFFekQsZ0NBQTBDLGVBQW1DO0lBQzNFLElBQU0sVUFBVSxHQUFhLEVBQUUsQ0FBQztJQUNoQyxlQUFlLENBQUMsV0FBVyxDQUN2QixVQUFDLE1BQStCLElBQUssT0FBQSxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFwQyxDQUFvQyxDQUFDLENBQUM7SUFFL0UsSUFBTSxRQUFRLEdBQWEsRUFBRSxDQUFDO0lBQzlCLGVBQWUsQ0FBQyxtQkFBbUIsQ0FDL0IsVUFBQyxNQUErQixJQUFLLE9BQUEsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBbEMsQ0FBa0MsQ0FBQyxDQUFDO0lBRTdFLElBQU0sU0FBUyxHQUFhLEVBQUUsQ0FBQztJQUMvQixlQUFlLENBQUMsZ0JBQWdCLENBQzVCLFVBQUMsTUFBK0IsSUFBSyxPQUFBLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQW5DLENBQW1DLENBQUMsQ0FBQztJQUU5RSxJQUFNLEtBQUssR0FBYSxFQUFFLENBQUM7SUFDM0IsZUFBZSxDQUFDLGdCQUFnQixDQUM1QixVQUFDLE1BQStCLElBQUssT0FBQSxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUEvQixDQUErQixDQUFDLENBQUM7SUFFMUUsSUFBTSxRQUFRLEdBQWEsRUFBRSxDQUFDO0lBQzlCLGVBQWUsQ0FBQyxrQkFBa0IsQ0FDOUIsVUFBQyxNQUErQixJQUFLLE9BQUEsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxD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