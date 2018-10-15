"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var default_keyvalue_differ_1 = require("@angular/core/src/change_detection/differs/default_keyvalue_differ");
var util_1 = require("../../change_detection/util");
// TODO(vicb): Update the code & tests for object equality
{
    describe('keyvalue differ', function () {
        describe('DefaultKeyValueDiffer', function () {
            var differ;
            var m;
            beforeEach(function () {
                differ = new default_keyvalue_differ_1.DefaultKeyValueDiffer();
                m = new Map();
            });
            afterEach(function () { differ = null; });
            it('should detect additions', function () {
                differ.check(m);
                m.set('a', 1);
                differ.check(m);
                expect(util_1.kvChangesAsString(differ))
                    .toEqual(util_1.testChangesAsString({ map: ['a[null->1]'], additions: ['a[null->1]'] }));
                m.set('b', 2);
                differ.check(m);
                expect(util_1.kvChangesAsString(differ))
                    .toEqual(util_1.testChangesAsString({ map: ['a', 'b[null->2]'], previous: ['a'], additions: ['b[null->2]'] }));
            });
            it('should handle changing key/values correctly', function () {
                m.set(1, 10);
                m.set(2, 20);
                differ.check(m);
                m.set(2, 10);
                m.set(1, 20);
                differ.check(m);
                expect(util_1.kvChangesAsString(differ)).toEqual(util_1.testChangesAsString({
                    map: ['1[10->20]', '2[20->10]'],
                    previous: ['1[10->20]', '2[20->10]'],
                    changes: ['1[10->20]', '2[20->10]']
                }));
            });
            it('should expose previous and current value', function () {
                m.set(1, 10);
                differ.check(m);
                m.set(1, 20);
                differ.check(m);
                differ.forEachChangedItem(function (record) {
                    expect(record.previousValue).toEqual(10);
                    expect(record.currentValue).toEqual(20);
                });
            });
            it('should do basic map watching', function () {
                differ.check(m);
                m.set('a', 'A');
                differ.check(m);
                expect(util_1.kvChangesAsString(differ))
                    .toEqual(util_1.testChangesAsString({ map: ['a[null->A]'], additions: ['a[null->A]'] }));
                m.set('b', 'B');
                differ.check(m);
                expect(util_1.kvChangesAsString(differ))
                    .toEqual(util_1.testChangesAsString({ map: ['a', 'b[null->B]'], previous: ['a'], additions: ['b[null->B]'] }));
                m.set('b', 'BB');
                m.set('d', 'D');
                differ.check(m);
                expect(util_1.kvChangesAsString(differ)).toEqual(util_1.testChangesAsString({
                    map: ['a', 'b[B->BB]', 'd[null->D]'],
                    previous: ['a', 'b[B->BB]'],
                    additions: ['d[null->D]'],
                    changes: ['b[B->BB]']
                }));
                m.delete('b');
                differ.check(m);
                expect(util_1.kvChangesAsString(differ))
                    .toEqual(util_1.testChangesAsString({ map: ['a', 'd'], previous: ['a', 'b[BB->null]', 'd'], removals: ['b[BB->null]'] }));
                m.clear();
                differ.check(m);
                expect(util_1.kvChangesAsString(differ)).toEqual(util_1.testChangesAsString({
                    previous: ['a[A->null]', 'd[D->null]'],
                    removals: ['a[A->null]', 'd[D->null]']
                }));
            });
            it('should not see a NaN value as a change', function () {
                m.set('foo', Number.NaN);
                differ.check(m);
                differ.check(m);
                expect(util_1.kvChangesAsString(differ))
                    .toEqual(util_1.testChangesAsString({ map: ['foo'], previous: ['foo'] }));
            });
            it('should work regardless key order', function () {
                m.set('a', 0);
                m.set('b', 0);
                differ.check(m);
                m = new Map();
                m.set('b', 1);
                m.set('a', 1);
                differ.check(m);
                expect(util_1.kvChangesAsString(differ)).toEqual(util_1.testChangesAsString({
                    map: ['b[0->1]', 'a[0->1]'],
                    previous: ['a[0->1]', 'b[0->1]'],
                    changes: ['b[0->1]', 'a[0->1]']
                }));
            });
            describe('JsObject changes', function () {
                it('should support JS Object', function () {
                    var f = new default_keyvalue_differ_1.DefaultKeyValueDifferFactory();
                    expect(f.supports({})).toBeTruthy();
                    expect(f.supports('not supported')).toBeFalsy();
                    expect(f.supports(0)).toBeFalsy();
                    expect(f.supports(null)).toBeFalsy();
                });
                it('should do basic object watching', function () {
                    var m = {};
                    differ.check(m);
                    m['a'] = 'A';
                    differ.check(m);
                    expect(util_1.kvChangesAsString(differ))
                        .toEqual(util_1.testChangesAsString({ map: ['a[null->A]'], additions: ['a[null->A]'] }));
                    m['b'] = 'B';
                    differ.check(m);
                    expect(util_1.kvChangesAsString(differ))
                        .toEqual(util_1.testChangesAsString({ map: ['a', 'b[null->B]'], previous: ['a'], additions: ['b[null->B]'] }));
                    m['b'] = 'BB';
                    m['d'] = 'D';
                    differ.check(m);
                    expect(util_1.kvChangesAsString(differ)).toEqual(util_1.testChangesAsString({
                        map: ['a', 'b[B->BB]', 'd[null->D]'],
                        previous: ['a', 'b[B->BB]'],
                        additions: ['d[null->D]'],
                        changes: ['b[B->BB]']
                    }));
                    m = {};
                    m['a'] = 'A';
                    m['d'] = 'D';
                    differ.check(m);
                    expect(util_1.kvChangesAsString(differ)).toEqual(util_1.testChangesAsString({
                        map: ['a', 'd'],
                        previous: ['a', 'b[BB->null]', 'd'],
                        removals: ['b[BB->null]']
                    }));
                    m = {};
                    differ.check(m);
                    expect(util_1.kvChangesAsString(differ)).toEqual(util_1.testChangesAsString({
                        previous: ['a[A->null]', 'd[D->null]'],
                        removals: ['a[A->null]', 'd[D->null]']
                    }));
                });
                it('should work regardless key order', function () {
                    differ.check({ a: 0, b: 0 });
                    differ.check({ b: 1, a: 1 });
                    expect(util_1.kvChangesAsString(differ)).toEqual(util_1.testChangesAsString({
                        map: ['b[0->1]', 'a[0->1]'],
                        previous: ['a[0->1]', 'b[0->1]'],
                        changes: ['b[0->1]', 'a[0->1]']
                    }));
                });
                // https://github.com/angular/angular/issues/14997
                it('should work regardless key order', function () {
                    differ.check({ a: 1, b: 2 });
                    differ.check({ b: 3, a: 2 });
                    differ.check({ a: 1, b: 2 });
                    expect(util_1.kvChangesAsString(differ)).toEqual(util_1.testChangesAsString({
                        map: ['a[2->1]', 'b[3->2]'],
                        previous: ['b[3->2]', 'a[2->1]'],
                        changes: ['a[2->1]', 'b[3->2]']
                    }));
                });
                it('should when the first item is moved', function () {
                    differ.check({ a: 'a', b: 'b' });
                    differ.check({ c: 'c', a: 'a' });
                    expect(util_1.kvChangesAsString(differ)).toEqual(util_1.testChangesAsString({
                        map: ['c[null->c]', 'a'],
                        previous: ['a', 'b[b->null]'],
                        additions: ['c[null->c]'],
                        removals: ['b[b->null]']
                    }));
                });
            });
            describe('diff', function () {
                it('should return self when there is a change', function () {
                    m.set('a', 'A');
                    expect(differ.diff(m)).toBe(differ);
                });
                it('should return null when there is no change', function () {
                    m.set('a', 'A');
                    differ.diff(m);
                    expect(differ.diff(m)).toEqual(null);
                });
                it('should treat null as an empty list', function () {
                    m.set('a', 'A');
                    differ.diff(m);
                    expect(util_1.kvChangesAsString(differ.diff(null)))
                        .toEqual(util_1.testChangesAsString({ previous: ['a[A->null]'], removals: ['a[A->null]'] }));
                });
                it('should throw when given an invalid collection', function () {
                    expect(function () { return differ.diff('invalid'); }).toThrowError(/Error trying to diff 'invalid'/);
                });
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdF9rZXl2YWx1ZV9kaWZmZXJfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9jaGFuZ2VfZGV0ZWN0aW9uL2RpZmZlcnMvZGVmYXVsdF9rZXl2YWx1ZV9kaWZmZXJfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILDhHQUF1STtBQUV2SSxvREFBbUY7QUFHbkYsMERBQTBEO0FBQzFEO0lBQ0UsUUFBUSxDQUFDLGlCQUFpQixFQUFFO1FBQzFCLFFBQVEsQ0FBQyx1QkFBdUIsRUFBRTtZQUNoQyxJQUFJLE1BQXVDLENBQUM7WUFDNUMsSUFBSSxDQUFnQixDQUFDO1lBRXJCLFVBQVUsQ0FBQztnQkFDVCxNQUFNLEdBQUcsSUFBSSwrQ0FBcUIsRUFBZSxDQUFDO2dCQUNsRCxDQUFDLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUNoQixDQUFDLENBQUMsQ0FBQztZQUVILFNBQVMsQ0FBQyxjQUFRLE1BQU0sR0FBRyxJQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV0QyxFQUFFLENBQUMseUJBQXlCLEVBQUU7Z0JBQzVCLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRWhCLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNkLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hCLE1BQU0sQ0FBQyx3QkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztxQkFDNUIsT0FBTyxDQUFDLDBCQUFtQixDQUFDLEVBQUMsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsWUFBWSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRXBGLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxD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