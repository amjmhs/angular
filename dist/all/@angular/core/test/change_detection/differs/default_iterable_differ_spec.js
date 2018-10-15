"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var default_iterable_differ_1 = require("@angular/core/src/change_detection/differs/default_iterable_differ");
var iterable_1 = require("../../change_detection/iterable");
var util_1 = require("../../change_detection/util");
var ItemWithId = /** @class */ (function () {
    function ItemWithId(id) {
        this.id = id;
    }
    ItemWithId.prototype.toString = function () { return "{id: " + this.id + "}"; };
    return ItemWithId;
}());
var ComplexItem = /** @class */ (function () {
    function ComplexItem(id, color) {
        this.id = id;
        this.color = color;
    }
    ComplexItem.prototype.toString = function () { return "{id: " + this.id + ", color: " + this.color + "}"; };
    return ComplexItem;
}());
// TODO(vicb): UnmodifiableListView / frozen object when implemented
{
    describe('iterable differ', function () {
        describe('DefaultIterableDiffer', function () {
            var differ;
            beforeEach(function () { differ = new default_iterable_differ_1.DefaultIterableDiffer(); });
            it('should support list and iterables', function () {
                var f = new default_iterable_differ_1.DefaultIterableDifferFactory();
                expect(f.supports([])).toBeTruthy();
                expect(f.supports(new iterable_1.TestIterable())).toBeTruthy();
                expect(f.supports(new Map())).toBeFalsy();
                expect(f.supports(null)).toBeFalsy();
            });
            it('should support iterables', function () {
                var l = new iterable_1.TestIterable();
                differ.check(l);
                expect(util_1.iterableDifferToString(differ)).toEqual(util_1.iterableChangesAsString({ collection: [] }));
                l.list = [1];
                differ.check(l);
                expect(util_1.iterableDifferToString(differ)).toEqual(util_1.iterableChangesAsString({
                    collection: ['1[null->0]'],
                    additions: ['1[null->0]']
                }));
                l.list = [2, 1];
                differ.check(l);
                expect(util_1.iterableDifferToString(differ)).toEqual(util_1.iterableChangesAsString({
                    collection: ['2[null->0]', '1[0->1]'],
                    previous: ['1[0->1]'],
                    additions: ['2[null->0]'],
                    moves: ['1[0->1]']
                }));
            });
            it('should detect additions', function () {
                var l = [];
                differ.check(l);
                expect(util_1.iterableDifferToString(differ)).toEqual(util_1.iterableChangesAsString({ collection: [] }));
                l.push('a');
                differ.check(l);
                expect(util_1.iterableDifferToString(differ)).toEqual(util_1.iterableChangesAsString({
                    collection: ['a[null->0]'],
                    additions: ['a[null->0]']
                }));
                l.push('b');
                differ.check(l);
                expect(util_1.iterableDifferToString(differ))
                    .toEqual(util_1.iterableChangesAsString({ collection: ['a', 'b[null->1]'], previous: ['a'], additions: ['b[null->1]'] }));
            });
            it('should support changing the reference', function () {
                var l = [0];
                differ.check(l);
                l = [1, 0];
                differ.check(l);
                expect(util_1.iterableDifferToString(differ)).toEqual(util_1.iterableChangesAsString({
                    collection: ['1[null->0]', '0[0->1]'],
                    previous: ['0[0->1]'],
                    additions: ['1[null->0]'],
                    moves: ['0[0->1]']
                }));
                l = [2, 1, 0];
                differ.check(l);
                expect(util_1.iterableDifferToString(differ)).toEqual(util_1.iterableChangesAsString({
                    collection: ['2[null->0]', '1[0->1]', '0[1->2]'],
                    previous: ['1[0->1]', '0[1->2]'],
                    additions: ['2[null->0]'],
                    moves: ['1[0->1]', '0[1->2]']
                }));
            });
            it('should handle swapping element', function () {
                var l = [1, 2];
                differ.check(l);
                l.length = 0;
                l.push(2);
                l.push(1);
                differ.check(l);
                expect(util_1.iterableDifferToString(differ)).toEqual(util_1.iterableChangesAsString({
                    collection: ['2[1->0]', '1[0->1]'],
                    previous: ['1[0->1]', '2[1->0]'],
                    moves: ['2[1->0]', '1[0->1]']
                }));
            });
            it('should handle incremental swapping element', function () {
                var l = ['a', 'b', 'c'];
                differ.check(l);
                l.splice(1, 1);
                l.splice(0, 0, 'b');
                differ.check(l);
                expect(util_1.iterableDifferToString(differ)).toEqual(util_1.iterableChangesAsString({
                    collection: ['b[1->0]', 'a[0->1]', 'c'],
                    previous: ['a[0->1]', 'b[1->0]', 'c'],
                    moves: ['b[1->0]', 'a[0->1]']
                }));
                l.splice(1, 1);
                l.push('a');
                differ.check(l);
                expect(util_1.iterableDifferToString(differ)).toEqual(util_1.iterableChangesAsString({
                    collection: ['b', 'c[2->1]', 'a[1->2]'],
                    previous: ['b', 'a[1->2]', 'c[2->1]'],
                    moves: ['c[2->1]', 'a[1->2]']
                }));
            });
            it('should detect changes in list', function () {
                var l = [];
                differ.check(l);
                l.push('a');
                differ.check(l);
                expect(util_1.iterableDifferToString(differ)).toEqual(util_1.iterableChangesAsString({
                    collection: ['a[null->0]'],
                    additions: ['a[null->0]']
                }));
                l.push('b');
                differ.check(l);
                expect(util_1.iterableDifferToString(differ))
                    .toEqual(util_1.iterableChangesAsString({ collection: ['a', 'b[null->1]'], previous: ['a'], additions: ['b[null->1]'] }));
                l.push('c');
                l.push('d');
                differ.check(l);
                expect(util_1.iterableDifferToString(differ)).toEqual(util_1.iterableChangesAsString({
                    collection: ['a', 'b', 'c[null->2]', 'd[null->3]'],
                    previous: ['a', 'b'],
                    additions: ['c[null->2]', 'd[null->3]']
                }));
                l.splice(2, 1);
                differ.check(l);
                expect(util_1.iterableDifferToString(differ)).toEqual(util_1.iterableChangesAsString({
                    collection: ['a', 'b', 'd[3->2]'],
                    previous: ['a', 'b', 'c[2->null]', 'd[3->2]'],
                    moves: ['d[3->2]'],
                    removals: ['c[2->null]']
                }));
                l.length = 0;
                l.push('d');
                l.push('c');
                l.push('b');
                l.push('a');
                differ.check(l);
                expect(util_1.iterableDifferToString(differ)).toEqual(util_1.iterableChangesAsString({
                    collection: ['d[2->0]', 'c[null->1]', 'b[1->2]', 'a[0->3]'],
                    previous: ['a[0->3]', 'b[1->2]', 'd[2->0]'],
                    additions: ['c[null->1]'],
                    moves: ['d[2->0]', 'b[1->2]', 'a[0->3]']
                }));
            });
            it('should ignore [NaN] != [NaN]', function () {
                var l = [NaN];
                differ.check(l);
                differ.check(l);
                expect(util_1.iterableDifferToString(differ))
                    .toEqual(util_1.iterableChangesAsString({ collection: [NaN], previous: [NaN] }));
            });
            it('should detect [NaN] moves', function () {
                var l = [NaN, NaN];
                differ.check(l);
                l.unshift('foo');
                differ.check(l);
                expect(util_1.iterableDifferToString(differ)).toEqual(util_1.iterableChangesAsString({
                    collection: ['foo[null->0]', 'NaN[0->1]', 'NaN[1->2]'],
                    previous: ['NaN[0->1]', 'NaN[1->2]'],
                    additions: ['foo[null->0]'],
                    moves: ['NaN[0->1]', 'NaN[1->2]']
                }));
            });
            it('should remove and add same item', function () {
                var l = ['a', 'b', 'c'];
                differ.check(l);
                l.splice(1, 1);
                differ.check(l);
                expect(util_1.iterableDifferToString(differ)).toEqual(util_1.iterableChangesAsString({
                    collection: ['a', 'c[2->1]'],
                    previous: ['a', 'b[1->null]', 'c[2->1]'],
                    moves: ['c[2->1]'],
                    removals: ['b[1->null]']
                }));
                l.splice(1, 0, 'b');
                differ.check(l);
                expect(util_1.iterableDifferToString(differ)).toEqual(util_1.iterableChangesAsString({
                    collection: ['a', 'b[null->1]', 'c[1->2]'],
                    previous: ['a', 'c[1->2]'],
                    additions: ['b[null->1]'],
                    moves: ['c[1->2]']
                }));
            });
            it('should support duplicates', function () {
                var l = ['a', 'a', 'a', 'b', 'b'];
                differ.check(l);
                l.splice(0, 1);
                differ.check(l);
                expect(util_1.iterableDifferToString(differ)).toEqual(util_1.iterableChangesAsString({
                    collection: ['a', 'a', 'b[3->2]', 'b[4->3]'],
                    previous: ['a', 'a', 'a[2->null]', 'b[3->2]', 'b[4->3]'],
                    moves: ['b[3->2]', 'b[4->3]'],
                    removals: ['a[2->null]']
                }));
            });
            it('should support insertions/moves', function () {
                var l = ['a', 'a', 'b', 'b'];
                differ.check(l);
                l.splice(0, 0, 'b');
                differ.check(l);
                expect(util_1.iterableDifferToString(differ)).toEqual(util_1.iterableChangesAsString({
                    collection: ['b[2->0]', 'a[0->1]', 'a[1->2]', 'b', 'b[null->4]'],
                    previous: ['a[0->1]', 'a[1->2]', 'b[2->0]', 'b'],
                    additions: ['b[null->4]'],
                    moves: ['b[2->0]', 'a[0->1]', 'a[1->2]']
                }));
            });
            it('should not report unnecessary moves', function () {
                var l = ['a', 'b', 'c'];
                differ.check(l);
                l.length = 0;
                l.push('b');
                l.push('a');
                l.push('c');
                differ.check(l);
                expect(util_1.iterableDifferToString(differ)).toEqual(util_1.iterableChangesAsString({
                    collection: ['b[1->0]', 'a[0->1]', 'c'],
                    previous: ['a[0->1]', 'b[1->0]', 'c'],
                    moves: ['b[1->0]', 'a[0->1]']
                }));
            });
            // https://github.com/angular/angular/issues/17852
            it('support re-insertion', function () {
                var l = ['a', '*', '*', 'd', '-', '-', '-', 'e'];
                differ.check(l);
                l[1] = 'b';
                l[5] = 'c';
                differ.check(l);
                expect(util_1.iterableDifferToString(differ)).toEqual(util_1.iterableChangesAsString({
                    collection: ['a', 'b[null->1]', '*[1->2]', 'd', '-', 'c[null->5]', '-[5->6]', 'e'],
                    previous: ['a', '*[1->2]', '*[2->null]', 'd', '-', '-[5->6]', '-[6->null]', 'e'],
                    additions: ['b[null->1]', 'c[null->5]'],
                    moves: ['*[1->2]', '-[5->6]'],
                    removals: ['*[2->null]', '-[6->null]'],
                }));
            });
            describe('forEachOperation', function () {
                function stringifyItemChange(record, p, c, originalIndex) {
                    var suffix = originalIndex == null ? '' : ' [o=' + originalIndex + ']';
                    var value = record.item;
                    if (record.currentIndex == null) {
                        return "REMOVE " + value + " (" + p + " -> VOID)" + suffix;
                    }
                    else if (record.previousIndex == null) {
                        return "INSERT " + value + " (VOID -> " + c + ")" + suffix;
                    }
                    else {
                        return "MOVE " + value + " (" + p + " -> " + c + ")" + suffix;
                    }
                }
                function modifyArrayUsingOperation(arr, endData, prev, next) {
                    var value = null;
                    if (prev == null) {
                        value = endData[next];
                        arr.splice(next, 0, value);
                    }
                    else if (next == null) {
                        value = arr[prev];
                        arr.splice(prev, 1);
                    }
                    else {
                        value = arr[prev];
                        arr.splice(prev, 1);
                        arr.splice(next, 0, value);
                    }
                    return value;
                }
                it('should trigger a series of insert/move/remove changes for inputs that have been diffed', function () {
                    var startData = [0, 1, 2, 3, 4, 5];
                    var endData = [6, 2, 7, 0, 4, 8];
                    differ = differ.diff(startData);
                    differ = differ.diff(endData);
                    var operations = [];
                    differ.forEachOperation(function (item, prev, next) {
                        var value = modifyArrayUsingOperation(startData, endData, prev, next);
                        operations.push(stringifyItemChange(item, prev, next, item.previousIndex));
                    });
                    expect(operations).toEqual([
                        'INSERT 6 (VOID -> 0)', 'MOVE 2 (3 -> 1) [o=2]', 'INSERT 7 (VOID -> 2)',
                        'REMOVE 1 (4 -> VOID) [o=1]', 'REMOVE 3 (4 -> VOID) [o=3]',
                        'REMOVE 5 (5 -> VOID) [o=5]', 'INSERT 8 (VOID -> 5)'
                    ]);
                    expect(startData).toEqual(endData);
                });
                it('should consider inserting/removing/moving items with respect to items that have not moved at all', function () {
                    var startData = [0, 1, 2, 3];
                    var endData = [2, 1];
                    differ = differ.diff(startData);
                    differ = differ.diff(endData);
                    var operations = [];
                    differ.forEachOperation(function (item, prev, next) {
                        modifyArrayUsingOperation(startData, endData, prev, next);
                        operations.push(stringifyItemChange(item, prev, next, item.previousIndex));
                    });
                    expect(operations).toEqual([
                        'REMOVE 0 (0 -> VOID) [o=0]', 'MOVE 2 (1 -> 0) [o=2]', 'REMOVE 3 (2 -> VOID) [o=3]'
                    ]);
                    expect(startData).toEqual(endData);
                });
                it('should be able to manage operations within a criss/cross of move operations', function () {
                    var startData = [1, 2, 3, 4, 5, 6];
                    var endData = [3, 6, 4, 9, 1, 2];
                    differ = differ.diff(startData);
                    differ = differ.diff(endData);
                    var operations = [];
                    differ.forEachOperation(function (item, prev, next) {
                        modifyArrayUsingOperation(startData, endData, prev, next);
                        operations.push(stringifyItemChange(item, prev, next, item.previousIndex));
                    });
                    expect(operations).toEqual([
                        'MOVE 3 (2 -> 0) [o=2]', 'MOVE 6 (5 -> 1) [o=5]', 'MOVE 4 (4 -> 2) [o=3]',
                        'INSERT 9 (VOID -> 3)', 'REMOVE 5 (6 -> VOID) [o=4]'
                    ]);
                    expect(startData).toEqual(endData);
                });
                it('should skip moves for multiple nodes that have not moved', function () {
                    var startData = [0, 1, 2, 3, 4];
                    var endData = [4, 1, 2, 3, 0, 5];
                    differ = differ.diff(startData);
                    differ = differ.diff(endData);
                    var operations = [];
                    differ.forEachOperation(function (item, prev, next) {
                        modifyArrayUsingOperation(startData, endData, prev, next);
                        operations.push(stringifyItemChange(item, prev, next, item.previousIndex));
                    });
                    expect(operations).toEqual([
                        'MOVE 4 (4 -> 0) [o=4]', 'MOVE 1 (2 -> 1) [o=1]', 'MOVE 2 (3 -> 2) [o=2]',
                        'MOVE 3 (4 -> 3) [o=3]', 'INSERT 5 (VOID -> 5)'
                    ]);
                    expect(startData).toEqual(endData);
                });
                it('should not fail', function () {
                    var startData = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
                    var endData = [10, 11, 1, 5, 7, 8, 0, 5, 3, 6];
                    differ = differ.diff(startData);
                    differ = differ.diff(endData);
                    var operations = [];
                    differ.forEachOperation(function (item, prev, next) {
                        modifyArrayUsingOperation(startData, endData, prev, next);
                        operations.push(stringifyItemChange(item, prev, next, item.previousIndex));
                    });
                    expect(operations).toEqual([
                        'MOVE 10 (10 -> 0) [o=10]', 'MOVE 11 (11 -> 1) [o=11]', 'MOVE 1 (3 -> 2) [o=1]',
                        'MOVE 5 (7 -> 3) [o=5]', 'MOVE 7 (9 -> 4) [o=7]', 'MOVE 8 (10 -> 5) [o=8]',
                        'REMOVE 2 (7 -> VOID) [o=2]', 'INSERT 5 (VOID -> 7)', 'REMOVE 4 (9 -> VOID) [o=4]',
                        'REMOVE 9 (10 -> VOID) [o=9]'
                    ]);
                    expect(startData).toEqual(endData);
                });
                it('should trigger nothing when the list is completely full of replaced items that are tracked by the index', function () {
                    differ = new default_iterable_differ_1.DefaultIterableDiffer(function (index) { return index; });
                    var startData = [1, 2, 3, 4];
                    var endData = [5, 6, 7, 8];
                    differ = differ.diff(startData);
                    differ = differ.diff(endData);
                    var operations = [];
                    differ.forEachOperation(function (item, prev, next) {
                        var value = modifyArrayUsingOperation(startData, endData, prev, next);
                        operations.push(stringifyItemChange(item, prev, next, item.previousIndex));
                    });
                    expect(operations).toEqual([]);
                });
            });
            describe('diff', function () {
                it('should return self when there is a change', function () {
                    expect(differ.diff(['a', 'b'])).toBe(differ);
                });
                it('should return null when there is no change', function () {
                    differ.diff(['a', 'b']);
                    expect(differ.diff(['a', 'b'])).toEqual(null);
                });
                it('should treat null as an empty list', function () {
                    differ.diff(['a', 'b']);
                    expect(util_1.iterableDifferToString(differ.diff(null))).toEqual(util_1.iterableChangesAsString({
                        previous: ['a[0->null]', 'b[1->null]'],
                        removals: ['a[0->null]', 'b[1->null]']
                    }));
                });
                it('should throw when given an invalid collection', function () {
                    expect(function () { return differ.diff('invalid'); }).toThrowError(/Error trying to diff 'invalid'/);
                });
            });
        });
        describe('trackBy function by id', function () {
            var differ;
            var trackByItemId = function (index, item) { return item.id; };
            var buildItemList = function (list) { return list.map(function (val) { return new ItemWithId(val); }); };
            beforeEach(function () { differ = new default_iterable_differ_1.DefaultIterableDiffer(trackByItemId); });
            it('should treat the collection as dirty if identity changes', function () {
                differ.diff(buildItemList(['a']));
                expect(differ.diff(buildItemList(['a']))).toBe(differ);
            });
            it('should treat seen records as identity changes, not additions', function () {
                var l = buildItemList(['a', 'b', 'c']);
                differ.check(l);
                expect(util_1.iterableDifferToString(differ)).toEqual(util_1.iterableChangesAsString({
                    collection: ["{id: a}[null->0]", "{id: b}[null->1]", "{id: c}[null->2]"],
                    additions: ["{id: a}[null->0]", "{id: b}[null->1]", "{id: c}[null->2]"]
                }));
                l = buildItemList(['a', 'b', 'c']);
                differ.check(l);
                expect(util_1.iterableDifferToString(differ)).toEqual(util_1.iterableChangesAsString({
                    collection: ["{id: a}", "{id: b}", "{id: c}"],
                    identityChanges: ["{id: a}", "{id: b}", "{id: c}"],
                    previous: ["{id: a}", "{id: b}", "{id: c}"]
                }));
            });
            it('should have updated properties in identity change collection', function () {
                var l = [new ComplexItem('a', 'blue'), new ComplexItem('b', 'yellow')];
                differ.check(l);
                l = [new ComplexItem('a', 'orange'), new ComplexItem('b', 'red')];
                differ.check(l);
                expect(util_1.iterableDifferToString(differ)).toEqual(util_1.iterableChangesAsString({
                    collection: ["{id: a, color: orange}", "{id: b, color: red}"],
                    identityChanges: ["{id: a, color: orange}", "{id: b, color: red}"],
                    previous: ["{id: a, color: orange}", "{id: b, color: red}"]
                }));
            });
            it('should track moves normally', function () {
                var l = buildItemList(['a', 'b', 'c']);
                differ.check(l);
                l = buildItemList(['b', 'a', 'c']);
                differ.check(l);
                expect(util_1.iterableDifferToString(differ)).toEqual(util_1.iterableChangesAsString({
                    collection: ['{id: b}[1->0]', '{id: a}[0->1]', '{id: c}'],
                    identityChanges: ['{id: b}[1->0]', '{id: a}[0->1]', '{id: c}'],
                    previous: ['{id: a}[0->1]', '{id: b}[1->0]', '{id: c}'],
                    moves: ['{id: b}[1->0]', '{id: a}[0->1]']
                }));
            });
            it('should track duplicate reinsertion normally', function () {
                var l = buildItemList(['a', 'a']);
                differ.check(l);
                l = buildItemList(['b', 'a', 'a']);
                differ.check(l);
                expect(util_1.iterableDifferToString(differ)).toEqual(util_1.iterableChangesAsString({
                    collection: ['{id: b}[null->0]', '{id: a}[0->1]', '{id: a}[1->2]'],
                    identityChanges: ['{id: a}[0->1]', '{id: a}[1->2]'],
                    previous: ['{id: a}[0->1]', '{id: a}[1->2]'],
                    moves: ['{id: a}[0->1]', '{id: a}[1->2]'],
                    additions: ['{id: b}[null->0]']
                }));
            });
            it('should track removals normally', function () {
                var l = buildItemList(['a', 'b', 'c']);
                differ.check(l);
                l.splice(2, 1);
                differ.check(l);
                expect(util_1.iterableDifferToString(differ)).toEqual(util_1.iterableChangesAsString({
                    collection: ['{id: a}', '{id: b}'],
                    previous: ['{id: a}', '{id: b}', '{id: c}[2->null]'],
                    removals: ['{id: c}[2->null]']
                }));
            });
        });
        describe('trackBy function by index', function () {
            var differ;
            var trackByIndex = function (index, item) { return index; };
            beforeEach(function () { differ = new default_iterable_differ_1.DefaultIterableDiffer(trackByIndex); });
            it('should track removals normally', function () {
                differ.check(['a', 'b', 'c', 'd']);
                differ.check(['e', 'f', 'g', 'h']);
                differ.check(['e', 'f', 'h']);
                expect(util_1.iterableDifferToString(differ)).toEqual(util_1.iterableChangesAsString({
                    collection: ['e', 'f', 'h'],
                    previous: ['e', 'f', 'h', 'h[3->null]'],
                    removals: ['h[3->null]'],
                    identityChanges: ['h']
                }));
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdF9pdGVyYWJsZV9kaWZmZXJfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9jaGFuZ2VfZGV0ZWN0aW9uL2RpZmZlcnMvZGVmYXVsdF9pdGVyYWJsZV9kaWZmZXJfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILDhHQUF1STtBQUV2SSw0REFBNkQ7QUFDN0Qsb0RBQTRGO0FBRTVGO0lBQ0Usb0JBQW9CLEVBQVU7UUFBVixPQUFFLEdBQUYsRUFBRSxDQUFRO0lBQUcsQ0FBQztJQUVsQyw2QkFBUSxHQUFSLGNBQWEsT0FBTyxVQUFRLElBQUksQ0FBQyxFQUFFLE1BQUcsQ0FBQyxDQUFDLENBQUM7SUFDM0MsaUJBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQztBQUVEO0lBQ0UscUJBQW9CLEVBQVUsRUFBVSxLQUFhO1FBQWpDLE9BQUUsR0FBRixFQUFFLENBQVE7UUFBVSxVQUFLLEdBQUwsS0FBSyxDQUFRO0lBQUcsQ0FBQztJQUV6RCw4QkFBUSxHQUFSLGNBQWEsT0FBTyxVQUFRLElBQUksQ0FBQyxFQUFFLGlCQUFZLElBQUksQ0FBQyxLQUFLLE1BQUcsQ0FBQyxDQUFDLENBQUM7SUFDakUsa0JBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQztBQUVELG9FQUFvRTtBQUNwRTtJQUNFLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtRQUMxQixRQUFRLENBQUMsdUJBQXVCLEVBQUU7WUFDaEMsSUFBSSxNQUFrQyxDQUFDO1lBRXZDLFVBQVUsQ0FBQyxjQUFRLE1BQU0sR0FBRyxJQUFJLCtDQUFxQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUU1RCxFQUFFLENBQUMsbUNBQW1DLEVBQUU7Z0JBQ3RDLElBQU0sQ0FBQyxHQUFHLElBQUksc0RBQTRCLEVBQUUsQ0FBQztnQkFDN0MsTUFBTSxDQUFDLENBQUMsQ0FBQyxRQUFR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