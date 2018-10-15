"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../src/utils");
describe('utils', function () {
    describe('scheduler', function () {
        describe('schedule()', function () {
            var setTimeoutSpy;
            var clearTimeoutSpy;
            beforeEach(function () {
                setTimeoutSpy = spyOn(window, 'setTimeout').and.returnValue(42);
                clearTimeoutSpy = spyOn(window, 'clearTimeout');
            });
            it('should delegate to `window.setTimeout()`', function () {
                var cb = function () { return null; };
                var delay = 1337;
                utils_1.scheduler.schedule(cb, delay);
                expect(setTimeoutSpy).toHaveBeenCalledWith(cb, delay);
            });
            it('should return a function for cancelling the scheduled job', function () {
                var cancelFn = utils_1.scheduler.schedule(function () { return null; }, 0);
                expect(clearTimeoutSpy).not.toHaveBeenCalled();
                cancelFn();
                expect(clearTimeoutSpy).toHaveBeenCalledWith(42);
            });
        });
        describe('scheduleBeforeRender()', function () {
            if (typeof window.requestAnimationFrame === 'undefined') {
                var mockCancelFn_1 = function () { return undefined; };
                var scheduleSpy_1;
                beforeEach(function () { return scheduleSpy_1 = spyOn(utils_1.scheduler, 'schedule').and.returnValue(mockCancelFn_1); });
                it('should delegate to `scheduler.schedule()`', function () {
                    var cb = function () { return null; };
                    expect(utils_1.scheduler.scheduleBeforeRender(cb)).toBe(mockCancelFn_1);
                    expect(scheduleSpy_1).toHaveBeenCalledWith(cb, 16);
                });
            }
            else {
                var requestAnimationFrameSpy_1;
                var cancelAnimationFrameSpy_1;
                beforeEach(function () {
                    requestAnimationFrameSpy_1 = spyOn(window, 'requestAnimationFrame').and.returnValue(42);
                    cancelAnimationFrameSpy_1 = spyOn(window, 'cancelAnimationFrame');
                });
                it('should delegate to `window.requestAnimationFrame()`', function () {
                    var cb = function () { return null; };
                    utils_1.scheduler.scheduleBeforeRender(cb);
                    expect(requestAnimationFrameSpy_1).toHaveBeenCalledWith(cb);
                });
                it('should return a function for cancelling the scheduled job', function () {
                    var cancelFn = utils_1.scheduler.scheduleBeforeRender(function () { return null; });
                    expect(cancelAnimationFrameSpy_1).not.toHaveBeenCalled();
                    cancelFn();
                    expect(cancelAnimationFrameSpy_1).toHaveBeenCalledWith(42);
                });
            }
        });
    });
    describe('camelToKebabCase()', function () {
        it('should convert camel-case to kebab-case', function () {
            expect(utils_1.camelToDashCase('fooBarBazQux')).toBe('foo-bar-baz-qux');
            expect(utils_1.camelToDashCase('foo1Bar2Baz3Qux4')).toBe('foo1-bar2-baz3-qux4');
        });
        it('should keep existing dashes', function () { expect(utils_1.camelToDashCase('fooBar-baz-Qux')).toBe('foo-bar-baz--qux'); });
    });
    describe('createCustomEvent()', function () {
        it('should create a custom event (with appropriate properties)', function () {
            var value = { bar: 'baz' };
            var event = utils_1.createCustomEvent(document, 'foo', value);
            expect(event).toEqual(jasmine.any(CustomEvent));
            expect(event).toEqual(jasmine.any(Event));
            expect(event.type).toBe('foo');
            expect(event.bubbles).toBe(false);
            expect(event.cancelable).toBe(false);
            expect(event.detail).toEqual(value);
        });
    });
    describe('isElement()', function () {
        it('should return true for Element nodes', function () {
            var elems = [
                document.body,
                document.createElement('div'),
                document.createElement('option'),
                document.documentElement,
            ];
            elems.forEach(function (n) { return expect(utils_1.isElement(n)).toBe(true); });
        });
        it('should return false for non-Element nodes', function () {
            var nonElems = [
                document,
                document.createAttribute('foo'),
                document.createDocumentFragment(),
                document.createComment('bar'),
                document.createTextNode('baz'),
            ];
            nonElems.forEach(function (n) { return expect(utils_1.isElement(n)).toBe(false); });
        });
    });
    describe('isFunction()', function () {
        it('should return true for functions', function () {
            var obj = { foo: function () { }, bar: function () { return null; }, baz: function () { } };
            var fns = [
                function () { },
                function () { return null; },
                obj.foo,
                obj.bar,
                obj.baz,
                Function,
                Date,
            ];
            fns.forEach(function (v) { return expect(utils_1.isFunction(v)).toBe(true); });
        });
        it('should return false for non-functions', function () {
            var nonFns = [
                undefined,
                null,
                true,
                42,
                {},
            ];
            nonFns.forEach(function (v) { return expect(utils_1.isFunction(v)).toBe(false); });
        });
    });
    describe('kebabToCamelCase()', function () {
        it('should convert camel-case to kebab-case', function () {
            expect(utils_1.kebabToCamelCase('foo-bar-baz-qux')).toBe('fooBarBazQux');
            expect(utils_1.kebabToCamelCase('foo1-bar2-baz3-qux4')).toBe('foo1Bar2Baz3Qux4');
            expect(utils_1.kebabToCamelCase('foo-1-bar-2-baz-3-qux-4')).toBe('foo1Bar2Baz3Qux4');
        });
        it('should keep uppercase letters', function () {
            expect(utils_1.kebabToCamelCase('foo-barBaz-Qux')).toBe('fooBarBaz-Qux');
            expect(utils_1.kebabToCamelCase('foo-barBaz--qux')).toBe('fooBarBaz-Qux');
        });
    });
    describe('matchesSelector()', function () {
        var li;
        beforeEach(function () {
            var div = document.createElement('div');
            div.innerHTML = "\n        <div class=\"bar\" id=\"barDiv\">\n          <span class=\"baz\"></span>\n          <ul class=\"baz\" id=\"bazUl\">\n            <li class=\"qux\" id=\"quxLi\"></li>\n          </ul>\n        </div>\n      ";
            li = div.querySelector('li');
        });
        it('should return whether the element matches the selector', function () {
            expect(utils_1.matchesSelector(li, 'li')).toBe(true);
            expect(utils_1.matchesSelector(li, '.qux')).toBe(true);
            expect(utils_1.matchesSelector(li, '#quxLi')).toBe(true);
            expect(utils_1.matchesSelector(li, '.qux#quxLi:not(.quux)')).toBe(true);
            expect(utils_1.matchesSelector(li, '.bar > #bazUl > li')).toBe(true);
            expect(utils_1.matchesSelector(li, '.bar .baz ~ .baz li')).toBe(true);
            expect(utils_1.matchesSelector(li, 'ol')).toBe(false);
            expect(utils_1.matchesSelector(li, '.quux')).toBe(false);
            expect(utils_1.matchesSelector(li, '#quuxOl')).toBe(false);
            expect(utils_1.matchesSelector(li, '.qux#quxLi:not(li)')).toBe(false);
            expect(utils_1.matchesSelector(li, '.bar > #bazUl > .quxLi')).toBe(false);
            expect(utils_1.matchesSelector(li, 'div span ul li')).toBe(false);
        });
    });
    describe('strictEquals()', function () {
        it('should perform strict equality check', function () {
            var values = [
                undefined,
                null,
                true,
                false,
                42,
                '42',
                function () { return undefined; },
                function () { return undefined; },
                {},
                {},
            ];
            values.forEach(function (v1, i) {
                values.forEach(function (v2, j) { expect(utils_1.strictEquals(v1, v2)).toBe(i === j); });
            });
        });
        it('should consider two `NaN` values equals', function () {
            expect(utils_1.strictEquals(NaN, NaN)).toBe(true);
            expect(utils_1.strictEquals(NaN, 'foo')).toBe(false);
            expect(utils_1.strictEquals(NaN, 42)).toBe(false);
            expect(utils_1.strictEquals(NaN, null)).toBe(false);
            expect(utils_1.strictEquals(NaN, undefined)).toBe(false);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHNfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2VsZW1lbnRzL3Rlc3QvdXRpbHNfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHNDQUFtSjtBQUVuSixRQUFRLENBQUMsT0FBTyxFQUFFO0lBQ2hCLFFBQVEsQ0FBQyxXQUFXLEVBQUU7UUFDcEIsUUFBUSxDQUFDLFlBQVksRUFBRTtZQUNyQixJQUFJLGFBQTBCLENBQUM7WUFDL0IsSUFBSSxlQUE0QixDQUFDO1lBRWpDLFVBQVUsQ0FBQztnQkFDVCxhQUFhLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNoRSxlQUFlLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxjQUFjLENBQUMsQ0FBQztZQUNsRCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQywwQ0FBMEMsRUFBRTtnQkFDN0MsSUFBTSxFQUFFLEdBQUcsY0FBTSxPQUFBLElBQUksRUFBSixDQUFJLENBQUM7Z0JBQ3RCLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQztnQkFFbkIsaUJBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUU5QixNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsb0JBQW9CLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3hELENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLDJEQUEyRCxFQUFFO2dCQUM5RCxJQUFNLFFBQVEsR0FBRyxpQkFBUyxDQUFDLFFBQVEsQ0FBQyxjQUFNLE9BQUEsSUFBSSxFQUFKLENBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDbkQsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2dCQUUv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