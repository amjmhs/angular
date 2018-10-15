"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var testing_1 = require("@angular/core/testing");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var forms_1 = require("@angular/forms");
var rxjs_1 = require("rxjs");
(function () {
    function syncValidator(_ /** TODO #9100 */) { return null; }
    function asyncValidator(_ /** TODO #9100 */) { return Promise.resolve(null); }
    testing_internal_1.describe('Form Builder', function () {
        var b;
        testing_internal_1.beforeEach(function () { b = new forms_1.FormBuilder(); });
        testing_internal_1.it('should create controls from a value', function () {
            var g = b.group({ 'login': 'some value' });
            testing_internal_1.expect(g.controls['login'].value).toEqual('some value');
        });
        testing_internal_1.it('should create controls from a boxed value', function () {
            var g = b.group({ 'login': { value: 'some value', disabled: true } });
            testing_internal_1.expect(g.controls['login'].value).toEqual('some value');
            testing_internal_1.expect(g.controls['login'].disabled).toEqual(true);
        });
        testing_internal_1.it('should create controls from an array', function () {
            var g = b.group({ 'login': ['some value'], 'password': ['some value', syncValidator, asyncValidator] });
            testing_internal_1.expect(g.controls['login'].value).toEqual('some value');
            testing_internal_1.expect(g.controls['password'].value).toEqual('some value');
            testing_internal_1.expect(g.controls['password'].validator).toEqual(syncValidator);
            testing_internal_1.expect(g.controls['password'].asyncValidator).toEqual(asyncValidator);
        });
        testing_internal_1.it('should use controls whose form state is a primitive value', function () {
            var g = b.group({ 'login': b.control('some value', syncValidator, asyncValidator) });
            testing_internal_1.expect(g.controls['login'].value).toEqual('some value');
            testing_internal_1.expect(g.controls['login'].validator).toBe(syncValidator);
            testing_internal_1.expect(g.controls['login'].asyncValidator).toBe(asyncValidator);
        });
        testing_internal_1.it('should support controls with no validators and whose form state is null', function () {
            var g = b.group({ 'login': b.control(null) });
            testing_internal_1.expect(g.controls['login'].value).toBeNull();
            testing_internal_1.expect(g.controls['login'].validator).toBeNull();
            testing_internal_1.expect(g.controls['login'].asyncValidator).toBeNull();
        });
        testing_internal_1.it('should support controls with validators and whose form state is null', function () {
            var g = b.group({ 'login': b.control(null, syncValidator, asyncValidator) });
            testing_internal_1.expect(g.controls['login'].value).toBeNull();
            testing_internal_1.expect(g.controls['login'].validator).toBe(syncValidator);
            testing_internal_1.expect(g.controls['login'].asyncValidator).toBe(asyncValidator);
        });
        testing_internal_1.it('should support controls with no validators and whose form state is undefined', function () {
            var g = b.group({ 'login': b.control(undefined) });
            testing_internal_1.expect(g.controls['login'].value).toBeNull();
            testing_internal_1.expect(g.controls['login'].validator).toBeNull();
            testing_internal_1.expect(g.controls['login'].asyncValidator).toBeNull();
        });
        testing_internal_1.it('should support controls with validators and whose form state is undefined', function () {
            var g = b.group({ 'login': b.control(undefined, syncValidator, asyncValidator) });
            testing_internal_1.expect(g.controls['login'].value).toBeNull();
            testing_internal_1.expect(g.controls['login'].validator).toBe(syncValidator);
            testing_internal_1.expect(g.controls['login'].asyncValidator).toBe(asyncValidator);
        });
        testing_internal_1.it('should create groups with a custom validator', function () {
            var g = b.group({ 'login': 'some value' }, { 'validator': syncValidator, 'asyncValidator': asyncValidator });
            testing_internal_1.expect(g.validator).toBe(syncValidator);
            testing_internal_1.expect(g.asyncValidator).toBe(asyncValidator);
        });
        testing_internal_1.it('should create control arrays', function () {
            var c = b.control('three');
            var e = b.control(null);
            var f = b.control(undefined);
            var a = b.array(['one', ['two', syncValidator], c, b.array(['four']), e, f], syncValidator, asyncValidator);
            testing_internal_1.expect(a.value).toEqual(['one', 'two', 'three', ['four'], null, null]);
            testing_internal_1.expect(a.validator).toBe(syncValidator);
            testing_internal_1.expect(a.asyncValidator).toBe(asyncValidator);
        });
        testing_internal_1.it('should create control arrays with multiple async validators', testing_1.fakeAsync(function () {
            function asyncValidator1() { return rxjs_1.of({ 'async1': true }); }
            function asyncValidator2() { return rxjs_1.of({ 'async2': true }); }
            var a = b.array(['one', 'two'], null, [asyncValidator1, asyncValidator2]);
            testing_internal_1.expect(a.value).toEqual(['one', 'two']);
            testing_1.tick();
            testing_internal_1.expect(a.errors).toEqual({ 'async1': true, 'async2': true });
        }));
        testing_internal_1.it('should create control arrays with multiple sync validators', function () {
            function syncValidator1() { return { 'sync1': true }; }
            function syncValidator2() { return { 'sync2': true }; }
            var a = b.array(['one', 'two'], [syncValidator1, syncValidator2]);
            testing_internal_1.expect(a.value).toEqual(['one', 'two']);
            testing_internal_1.expect(a.errors).toEqual({ 'sync1': true, 'sync2': true });
        });
    });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9idWlsZGVyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy90ZXN0L2Zvcm1fYnVpbGRlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsaURBQXNEO0FBQ3RELCtFQUE0RjtBQUM1Rix3Q0FBMkM7QUFDM0MsNkJBQXlCO0FBRXpCLENBQUM7SUFDQyx1QkFBdUIsQ0FBTSxDQUFDLGlCQUFpQixJQUEyQixPQUFPLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDeEYsd0JBQXdCLENBQU0sQ0FBQyxpQkFBaUIsSUFBSSxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRW5GLDJCQUFRLENBQUMsY0FBYyxFQUFFO1FBQ3ZCLElBQUksQ0FBYyxDQUFDO1FBRW5CLDZCQUFVLENBQUMsY0FBUSxDQUFDLEdBQUcsSUFBSSxtQkFBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU3QyxxQkFBRSxDQUFDLHFDQUFxQyxFQUFFO1lBQ3hDLElBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFDLENBQUMsQ0FBQztZQUUzQyx5QkFBTSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzFELENBQUMsQ0FBQyxDQUFDO1FBRUgscUJBQUUsQ0FBQywyQ0FBMkMsRUFBRTtZQUM5QyxJQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLEVBQUMsS0FBSyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDLEVBQUMsQ0FBQyxDQUFDO1lBRXBFLHlCQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFP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