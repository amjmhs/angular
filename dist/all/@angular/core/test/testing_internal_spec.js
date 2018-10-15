"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var TestObj = /** @class */ (function () {
    function TestObj(prop) {
        this.prop = prop;
    }
    TestObj.prototype.someFunc = function () { return -1; };
    TestObj.prototype.someComplexFunc = function (a) { return a; };
    return TestObj;
}());
var SpyTestObj = /** @class */ (function (_super) {
    __extends(SpyTestObj, _super);
    function SpyTestObj() {
        return _super.call(this, TestObj) || this;
    }
    return SpyTestObj;
}(testing_internal_1.SpyObject));
{
    describe('testing', function () {
        describe('should respect custom equality tester', function () {
            beforeEach(function () {
                var equalIfMarried = function (first, second) { return first === 'kevin' && second === 'patricia'; };
                jasmine.addCustomEqualityTester(equalIfMarried);
            });
            it('for positive test', function () { expect('kevin').toEqual('patricia'); });
            it('for negative test', function () { expect('kevin').not.toEqual('kevin'); });
        });
        describe('equality', function () {
            it('should structurally compare objects', function () {
                var expected = new TestObj(new TestObj({ 'one': [1, 2] }));
                var actual = new TestObj(new TestObj({ 'one': [1, 2] }));
                var falseActual = new TestObj(new TestObj({ 'one': [1, 3] }));
                expect(actual).toEqual(expected);
                expect(falseActual).not.toEqual(expected);
            });
        });
        describe('toEqual for Maps', function () {
            it('should detect equality for same reference', function () {
                var m1 = new Map();
                m1.set('a', 1);
                expect(m1).toEqual(m1);
            });
            it('should detect equality for same content', function () {
                var m1 = new Map();
                m1.set('a', 1);
                var m2 = new Map();
                m2.set('a', 1);
                expect(m1).toEqual(m2);
            });
            it('should detect missing entries', function () {
                var m1 = new Map();
                m1.set('a', 1);
                var m2 = new Map();
                expect(m1).not.toEqual(m2);
            });
            it('should detect different values', function () {
                var m1 = new Map();
                m1.set('a', 1);
                var m2 = new Map();
                m2.set('a', 2);
                expect(m1).not.toEqual(m2);
            });
            it('should detect additional entries', function () {
                var m1 = new Map();
                m1.set('a', 1);
                var m2 = new Map();
                m2.set('a', 1);
                m2.set('b', 2);
                expect(m1).not.toEqual(m2);
            });
        });
        describe('spy objects', function () {
            var spyObj;
            beforeEach(function () { spyObj = new SpyTestObj(); });
            it('should return a new spy func with no calls', function () { expect(spyObj.spy('someFunc')).not.toHaveBeenCalled(); });
            it('should record function calls', function () {
                spyObj.spy('someFunc').and.callFake(function (a, b) { return a + b; });
                expect(spyObj.someFunc(1, 2)).toEqual(3);
                expect(spyObj.spy('someFunc')).toHaveBeenCalledWith(1, 2);
            });
            it('should match multiple function calls', function () {
                spyObj.someFunc(1, 2);
                spyObj.someFunc(3, 4);
                expect(spyObj.spy('someFunc')).toHaveBeenCalledWith(1, 2);
                expect(spyObj.spy('someFunc')).toHaveBeenCalledWith(3, 4);
            });
            it('should match null arguments', function () {
                spyObj.someFunc(null, 'hello');
                expect(spyObj.spy('someFunc')).toHaveBeenCalledWith(null, 'hello');
            });
            it('should match using deep equality', function () {
                spyObj.someComplexFunc([1]);
                expect(spyObj.spy('someComplexFunc')).toHaveBeenCalledWith([1]);
            });
            it('should support stubs', function () {
                var s = testing_internal_1.SpyObject.stub({ 'a': 1 }, { 'b': 2 });
                expect(s.a()).toEqual(1);
                expect(s.b()).toEqual(2);
            });
            it('should create spys for all methods', function () { expect(function () { return spyObj.someFunc(); }).not.toThrow(); });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGluZ19pbnRlcm5hbF9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L3Rlc3RpbmdfaW50ZXJuYWxfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCwrRUFBcUU7QUFFckU7SUFFRSxpQkFBWSxJQUFTO1FBQUksSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFBQyxDQUFDO0lBQzVDLDBCQUFRLEdBQVIsY0FBcUIsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakMsaUNBQWUsR0FBZixVQUFnQixDQUFNLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZDLGNBQUM7QUFBRCxDQUFDLEFBTEQsSUFLQztBQUVEO0lBQXlCLDhCQUFTO0lBQ2hDO2VBQWdCLGtCQUFNLE9BQU8sQ0FBQztJQUFFLENBQUM7SUFDbkMsaUJBQUM7QUFBRCxDQUFDLEFBRkQsQ0FBeUIsNEJBQVMsR0FFakM7QUFFRDtJQUNFLFFBQVEsQ0FBQyxTQUFTLEVBQUU7UUFDbEIsUUFBUSxDQUFDLHVDQUF1QyxFQUFFO1lBQ2hELFVBQVUsQ0FBQztnQkFDVCxJQUFNLGNBQWMsR0FDaEIsVUFBQyxLQUFVLEVBQUUsTUFBVyxJQUFPLE9BQU8sS0FBSyxLQUFLLE9BQU8sSUFBSSxNQUFNLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4RixPQUFPLENBQUMsdUJBQXVCLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDbEQsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsbUJBQW1CLEVBQUUsY0FBUSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFeEUsRUFBRSxDQUFDLG1CQUFtQixFQUFFLGNBQVEsTUFBTSxDQUFDLE9B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