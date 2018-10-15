"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var forms_1 = require("@angular/forms");
var normalize_validator_1 = require("@angular/forms/src/directives/normalize_validator");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
(function () {
    function validator(key, error) {
        return function (c) {
            var r = {};
            r[key] = error;
            return r;
        };
    }
    var AsyncValidatorDirective = /** @class */ (function () {
        function AsyncValidatorDirective(expected, error) {
            this.expected = expected;
            this.error = error;
        }
        AsyncValidatorDirective.prototype.validate = function (c) {
            var _this = this;
            return rxjs_1.Observable.create(function (obs) {
                var error = _this.expected !== c.value ? _this.error : null;
                obs.next(error);
                obs.complete();
            });
        };
        return AsyncValidatorDirective;
    }());
    testing_internal_1.describe('Validators', function () {
        testing_internal_1.describe('min', function () {
            testing_internal_1.it('should not error on an empty string', function () { testing_internal_1.expect(forms_1.Validators.min(2)(new forms_1.FormControl(''))).toBeNull(); });
            testing_internal_1.it('should not error on null', function () { testing_internal_1.expect(forms_1.Validators.min(2)(new forms_1.FormControl(null))).toBeNull(); });
            testing_internal_1.it('should not error on undefined', function () { testing_internal_1.expect(forms_1.Validators.min(2)(new forms_1.FormControl(undefined))).toBeNull(); });
            testing_internal_1.it('should return null if NaN after parsing', function () { testing_internal_1.expect(forms_1.Validators.min(2)(new forms_1.FormControl('a'))).toBeNull(); });
            testing_internal_1.it('should return a validation error on small values', function () {
                testing_internal_1.expect(forms_1.Validators.min(2)(new forms_1.FormControl(1))).toEqual({ 'min': { 'min': 2, 'actual': 1 } });
            });
            testing_internal_1.it('should return a validation error on small values converted from strings', function () {
                testing_internal_1.expect(forms_1.Validators.min(2)(new forms_1.FormControl('1'))).toEqual({ 'min': { 'min': 2, 'actual': '1' } });
            });
            testing_internal_1.it('should not error on big values', function () { testing_internal_1.expect(forms_1.Validators.min(2)(new forms_1.FormControl(3))).toBeNull(); });
            testing_internal_1.it('should not error on equal values', function () { testing_internal_1.expect(forms_1.Validators.min(2)(new forms_1.FormControl(2))).toBeNull(); });
            testing_internal_1.it('should not error on equal values when value is string', function () { testing_internal_1.expect(forms_1.Validators.min(2)(new forms_1.FormControl('2'))).toBeNull(); });
            testing_internal_1.it('should validate as expected when min value is a string', function () {
                testing_internal_1.expect(forms_1.Validators.min('2')(new forms_1.FormControl(1))).toEqual({
                    'min': { 'min': '2', 'actual': 1 }
                });
            });
            testing_internal_1.it('should return null if min value is undefined', function () { testing_internal_1.expect(forms_1.Validators.min(undefined)(new forms_1.FormControl(3))).toBeNull(); });
            testing_internal_1.it('should return null if min value is null', function () { testing_internal_1.expect(forms_1.Validators.min(null)(new forms_1.FormControl(3))).toBeNull(); });
        });
        testing_internal_1.describe('max', function () {
            testing_internal_1.it('should not error on an empty string', function () { testing_internal_1.expect(forms_1.Validators.max(2)(new forms_1.FormControl(''))).toBeNull(); });
            testing_internal_1.it('should not error on null', function () { testing_internal_1.expect(forms_1.Validators.max(2)(new forms_1.FormControl(null))).toBeNull(); });
            testing_internal_1.it('should not error on undefined', function () { testing_internal_1.expect(forms_1.Validators.max(2)(new forms_1.FormControl(undefined))).toBeNull(); });
            testing_internal_1.it('should return null if NaN after parsing', function () { testing_internal_1.expect(forms_1.Validators.max(2)(new forms_1.FormControl('aaa'))).toBeNull(); });
            testing_internal_1.it('should return a validation error on big values', function () {
                testing_internal_1.expect(forms_1.Validators.max(2)(new forms_1.FormControl(3))).toEqual({ 'max': { 'max': 2, 'actual': 3 } });
            });
            testing_internal_1.it('should return a validation error on big values converted from strings', function () {
                testing_internal_1.expect(forms_1.Validators.max(2)(new forms_1.FormControl('3'))).toEqual({ 'max': { 'max': 2, 'actual': '3' } });
            });
            testing_internal_1.it('should not error on small values', function () { testing_internal_1.expect(forms_1.Validators.max(2)(new forms_1.FormControl(1))).toBeNull(); });
            testing_internal_1.it('should not error on equal values', function () { testing_internal_1.expect(forms_1.Validators.max(2)(new forms_1.FormControl(2))).toBeNull(); });
            testing_internal_1.it('should not error on equal values when value is string', function () { testing_internal_1.expect(forms_1.Validators.max(2)(new forms_1.FormControl('2'))).toBeNull(); });
            testing_internal_1.it('should validate as expected when max value is a string', function () {
                testing_internal_1.expect(forms_1.Validators.max('2')(new forms_1.FormControl(3))).toEqual({
                    'max': { 'max': '2', 'actual': 3 }
                });
            });
            testing_internal_1.it('should return null if max value is undefined', function () { testing_internal_1.expect(forms_1.Validators.max(undefined)(new forms_1.FormControl(3))).toBeNull(); });
            testing_internal_1.it('should return null if max value is null', function () { testing_internal_1.expect(forms_1.Validators.max(null)(new forms_1.FormControl(3))).toBeNull(); });
        });
        testing_internal_1.describe('required', function () {
            testing_internal_1.it('should error on an empty string', function () { testing_internal_1.expect(forms_1.Validators.required(new forms_1.FormControl(''))).toEqual({ 'required': true }); });
            testing_internal_1.it('should error on null', function () { testing_internal_1.expect(forms_1.Validators.required(new forms_1.FormControl(null))).toEqual({ 'required': true }); });
            testing_internal_1.it('should not error on undefined', function () {
                testing_internal_1.expect(forms_1.Validators.required(new forms_1.FormControl(undefined))).toEqual({ 'required': true });
            });
            testing_internal_1.it('should not error on a non-empty string', function () { testing_internal_1.expect(forms_1.Validators.required(new forms_1.FormControl('not empty'))).toBeNull(); });
            testing_internal_1.it('should accept zero as valid', function () { testing_internal_1.expect(forms_1.Validators.required(new forms_1.FormControl(0))).toBeNull(); });
            testing_internal_1.it('should error on an empty array', function () { return testing_internal_1.expect(forms_1.Validators.required(new forms_1.FormControl([]))).toEqual({ 'required': true }); });
            testing_internal_1.it('should not error on a non-empty array', function () { return testing_internal_1.expect(forms_1.Validators.required(new forms_1.FormControl([1, 2]))).toBeNull(); });
        });
        testing_internal_1.describe('requiredTrue', function () {
            testing_internal_1.it('should error on false', function () { return testing_internal_1.expect(forms_1.Validators.requiredTrue(new forms_1.FormControl(false))).toEqual({ 'required': true }); });
            testing_internal_1.it('should not error on true', function () { return testing_internal_1.expect(forms_1.Validators.requiredTrue(new forms_1.FormControl(true))).toBeNull(); });
        });
        testing_internal_1.describe('email', function () {
            testing_internal_1.it('should not error on an empty string', function () { return testing_internal_1.expect(forms_1.Validators.email(new forms_1.FormControl(''))).toBeNull(); });
            testing_internal_1.it('should not error on null', function () { return testing_internal_1.expect(forms_1.Validators.email(new forms_1.FormControl(null))).toBeNull(); });
            testing_internal_1.it('should error on invalid email', function () { return testing_internal_1.expect(forms_1.Validators.email(new forms_1.FormControl('some text'))).toEqual({ 'email': true }); });
            testing_internal_1.it('should not error on valid email', function () { return testing_internal_1.expect(forms_1.Validators.email(new forms_1.FormControl('test@gmail.com'))).toBeNull(); });
        });
        testing_internal_1.describe('minLength', function () {
            testing_internal_1.it('should not error on an empty string', function () { testing_internal_1.expect(forms_1.Validators.minLength(2)(new forms_1.FormControl(''))).toBeNull(); });
            testing_internal_1.it('should not error on null', function () { testing_internal_1.expect(forms_1.Validators.minLength(2)(new forms_1.FormControl(null))).toBeNull(); });
            testing_internal_1.it('should not error on undefined', function () { testing_internal_1.expect(forms_1.Validators.minLength(2)(new forms_1.FormControl(undefined))).toBeNull(); });
            testing_internal_1.it('should not error on valid strings', function () { testing_internal_1.expect(forms_1.Validators.minLength(2)(new forms_1.FormControl('aa'))).toBeNull(); });
            testing_internal_1.it('should error on short strings', function () {
                testing_internal_1.expect(forms_1.Validators.minLength(2)(new forms_1.FormControl('a'))).toEqual({
                    'minlength': { 'requiredLength': 2, 'actualLength': 1 }
                });
            });
            testing_internal_1.it('should not error when FormArray has valid length', function () {
                var fa = new forms_1.FormArray([new forms_1.FormControl(''), new forms_1.FormControl('')]);
                testing_internal_1.expect(forms_1.Validators.minLength(2)(fa)).toBeNull();
            });
            testing_internal_1.it('should error when FormArray has invalid length', function () {
                var fa = new forms_1.FormArray([new forms_1.FormControl('')]);
                testing_internal_1.expect(forms_1.Validators.minLength(2)(fa)).toEqual({
                    'minlength': { 'requiredLength': 2, 'actualLength': 1 }
                });
            });
        });
        testing_internal_1.describe('maxLength', function () {
            testing_internal_1.it('should not error on an empty string', function () { testing_internal_1.expect(forms_1.Validators.maxLength(2)(new forms_1.FormControl(''))).toBeNull(); });
            testing_internal_1.it('should not error on null', function () { testing_internal_1.expect(forms_1.Validators.maxLength(2)(new forms_1.FormControl(null))).toBeNull(); });
            testing_internal_1.it('should not error on undefined', function () { testing_internal_1.expect(forms_1.Validators.maxLength(2)(new forms_1.FormControl(undefined))).toBeNull(); });
            testing_internal_1.it('should not error on valid strings', function () { testing_internal_1.expect(forms_1.Validators.maxLength(2)(new forms_1.FormControl('aa'))).toBeNull(); });
            testing_internal_1.it('should error on long strings', function () {
                testing_internal_1.expect(forms_1.Validators.maxLength(2)(new forms_1.FormControl('aaa'))).toEqual({
                    'maxlength': { 'requiredLength': 2, 'actualLength': 3 }
                });
            });
            testing_internal_1.it('should not error when FormArray has valid length', function () {
                var fa = new forms_1.FormArray([new forms_1.FormControl(''), new forms_1.FormControl('')]);
                testing_internal_1.expect(forms_1.Validators.maxLength(2)(fa)).toBeNull();
            });
            testing_internal_1.it('should error when FormArray has invalid length', function () {
                var fa = new forms_1.FormArray([new forms_1.FormControl(''), new forms_1.FormControl('')]);
                testing_internal_1.expect(forms_1.Validators.maxLength(1)(fa)).toEqual({
                    'maxlength': { 'requiredLength': 1, 'actualLength': 2 }
                });
            });
        });
        testing_internal_1.describe('pattern', function () {
            testing_internal_1.it('should not error on an empty string', function () { testing_internal_1.expect(forms_1.Validators.pattern('[a-zA-Z ]+')(new forms_1.FormControl(''))).toBeNull(); });
            testing_internal_1.it('should not error on null', function () { testing_internal_1.expect(forms_1.Validators.pattern('[a-zA-Z ]+')(new forms_1.FormControl(null))).toBeNull(); });
            testing_internal_1.it('should not error on undefined', function () {
                testing_internal_1.expect(forms_1.Validators.pattern('[a-zA-Z ]+')(new forms_1.FormControl(undefined))).toBeNull();
            });
            testing_internal_1.it('should not error on null value and "null" pattern', function () { testing_internal_1.expect(forms_1.Validators.pattern('null')(new forms_1.FormControl(null))).toBeNull(); });
            testing_internal_1.it('should not error on valid strings', function () { return testing_internal_1.expect(forms_1.Validators.pattern('[a-zA-Z ]*')(new forms_1.FormControl('aaAA'))).toBeNull(); });
            testing_internal_1.it('should error on failure to match string', function () {
                testing_internal_1.expect(forms_1.Validators.pattern('[a-zA-Z ]*')(new forms_1.FormControl('aaa0'))).toEqual({
                    'pattern': { 'requiredPattern': '^[a-zA-Z ]*$', 'actualValue': 'aaa0' }
                });
            });
            testing_internal_1.it('should accept RegExp object', function () {
                var pattern = new RegExp('[a-zA-Z ]+');
                testing_internal_1.expect(forms_1.Validators.pattern(pattern)(new forms_1.FormControl('aaAA'))).toBeNull();
            });
            testing_internal_1.it('should error on failure to match RegExp object', function () {
                var pattern = new RegExp('^[a-zA-Z ]*$');
                testing_internal_1.expect(forms_1.Validators.pattern(pattern)(new forms_1.FormControl('aaa0'))).toEqual({
                    'pattern': { 'requiredPattern': '/^[a-zA-Z ]*$/', 'actualValue': 'aaa0' }
                });
            });
            testing_internal_1.it('should not error on "null" pattern', function () { return testing_internal_1.expect(forms_1.Validators.pattern(null)(new forms_1.FormControl('aaAA'))).toBeNull(); });
            testing_internal_1.it('should not error on "undefined" pattern', function () { return testing_internal_1.expect(forms_1.Validators.pattern(undefined)(new forms_1.FormControl('aaAA'))).toBeNull(); });
            testing_internal_1.it('should work with pattern string containing both boundary symbols', function () { return testing_internal_1.expect(forms_1.Validators.pattern('^[aA]*$')(new forms_1.FormControl('aaAA'))).toBeNull(); });
            testing_internal_1.it('should work with pattern string containing only start boundary symbols', function () { return testing_internal_1.expect(forms_1.Validators.pattern('^[aA]*')(new forms_1.FormControl('aaAA'))).toBeNull(); });
            testing_internal_1.it('should work with pattern string containing only end boundary symbols', function () { return testing_internal_1.expect(forms_1.Validators.pattern('[aA]*$')(new forms_1.FormControl('aaAA'))).toBeNull(); });
            testing_internal_1.it('should work with pattern string not containing any boundary symbols', function () { return testing_internal_1.expect(forms_1.Validators.pattern('[aA]*')(new forms_1.FormControl('aaAA'))).toBeNull(); });
        });
        testing_internal_1.describe('compose', function () {
            testing_internal_1.it('should return null when given null', function () { testing_internal_1.expect(forms_1.Validators.compose(null)).toBe(null); });
            testing_internal_1.it('should collect errors from all the validators', function () {
                var c = forms_1.Validators.compose([validator('a', true), validator('b', true)]);
                testing_internal_1.expect(c(new forms_1.FormControl(''))).toEqual({ 'a': true, 'b': true });
            });
            testing_internal_1.it('should run validators left to right', function () {
                var c = forms_1.Validators.compose([validator('a', 1), validator('a', 2)]);
                testing_internal_1.expect(c(new forms_1.FormControl(''))).toEqual({ 'a': 2 });
            });
            testing_internal_1.it('should return null when no errors', function () {
                var c = forms_1.Validators.compose([forms_1.Validators.nullValidator, forms_1.Validators.nullValidator]);
                testing_internal_1.expect(c(new forms_1.FormControl(''))).toBeNull();
            });
            testing_internal_1.it('should ignore nulls', function () {
                var c = forms_1.Validators.compose([null, forms_1.Validators.required]);
                testing_internal_1.expect(c(new forms_1.FormControl(''))).toEqual({ 'required': true });
            });
        });
        testing_internal_1.describe('composeAsync', function () {
            testing_internal_1.describe('promises', function () {
                function promiseValidator(response) {
                    return function (c) {
                        var res = c.value != 'expected' ? response : null;
                        return Promise.resolve(res);
                    };
                }
                testing_internal_1.it('should return null when given null', function () { testing_internal_1.expect(forms_1.Validators.composeAsync(null)).toBeNull(); });
                testing_internal_1.it('should collect errors from all the validators', testing_1.fakeAsync(function () {
                    var v = forms_1.Validators.composeAsync([promiseValidator({ 'one': true }), promiseValidator({ 'two': true })]);
                    var errorMap = undefined;
                    v(new forms_1.FormControl('invalid'))
                        .pipe(operators_1.first())
                        .subscribe(function (errors) { return errorMap = errors; });
                    testing_1.tick();
                    testing_internal_1.expect(errorMap).toEqual({ 'one': true, 'two': true });
                }));
                testing_internal_1.it('should normalize and evaluate async validator-directives correctly', testing_1.fakeAsync(function () {
                    var v = forms_1.Validators.composeAsync([normalize_validator_1.normalizeAsyncValidator(new AsyncValidatorDirective('expected', { 'one': true }))]);
                    var errorMap = undefined;
                    v(new forms_1.FormControl('invalid'))
                        .pipe(operators_1.first())
                        .subscribe(function (errors) { return errorMap = errors; });
                    testing_1.tick();
                    testing_internal_1.expect(errorMap).toEqual({ 'one': true });
                }));
                testing_internal_1.it('should return null when no errors', testing_1.fakeAsync(function () {
                    var v = forms_1.Validators.composeAsync([promiseValidator({ 'one': true })]);
                    var errorMap = undefined;
                    v(new forms_1.FormControl('expected'))
                        .pipe(operators_1.first())
                        .subscribe(function (errors) { return errorMap = errors; });
                    testing_1.tick();
                    testing_internal_1.expect(errorMap).toBeNull();
                }));
                testing_internal_1.it('should ignore nulls', testing_1.fakeAsync(function () {
                    var v = forms_1.Validators.composeAsync([promiseValidator({ 'one': true }), null]);
                    var errorMap = undefined;
                    v(new forms_1.FormControl('invalid'))
                        .pipe(operators_1.first())
                        .subscribe(function (errors) { return errorMap = errors; });
                    testing_1.tick();
                    testing_internal_1.expect(errorMap).toEqual({ 'one': true });
                }));
            });
            testing_internal_1.describe('observables', function () {
                function observableValidator(response) {
                    return function (c) {
                        var res = c.value != 'expected' ? response : null;
                        return rxjs_1.of(res);
                    };
                }
                testing_internal_1.it('should return null when given null', function () { testing_internal_1.expect(forms_1.Validators.composeAsync(null)).toBeNull(); });
                testing_internal_1.it('should collect errors from all the validators', function () {
                    var v = forms_1.Validators.composeAsync([observableValidator({ 'one': true }), observableValidator({ 'two': true })]);
                    var errorMap = undefined;
                    v(new forms_1.FormControl('invalid'))
                        .pipe(operators_1.first())
                        .subscribe(function (errors) { return errorMap = errors; });
                    testing_internal_1.expect(errorMap).toEqual({ 'one': true, 'two': true });
                });
                testing_internal_1.it('should normalize and evaluate async validator-directives correctly', function () {
                    var v = forms_1.Validators.composeAsync([normalize_validator_1.normalizeAsyncValidator(new AsyncValidatorDirective('expected', { 'one': true }))]);
                    var errorMap = undefined;
                    v(new forms_1.FormControl('invalid'))
                        .pipe(operators_1.first())
                        .subscribe(function (errors) { return errorMap = errors; });
                    testing_internal_1.expect(errorMap).toEqual({ 'one': true });
                });
                testing_internal_1.it('should return null when no errors', function () {
                    var v = forms_1.Validators.composeAsync([observableValidator({ 'one': true })]);
                    var errorMap = undefined;
                    v(new forms_1.FormControl('expected'))
                        .pipe(operators_1.first())
                        .subscribe(function (errors) { return errorMap = errors; });
                    testing_internal_1.expect(errorMap).toBeNull();
                });
                testing_internal_1.it('should ignore nulls', function () {
                    var v = forms_1.Validators.composeAsync([observableValidator({ 'one': true }), null]);
                    var errorMap = undefined;
                    v(new forms_1.FormControl('invalid'))
                        .pipe(operators_1.first())
                        .subscribe(function (errors) { return errorMap = errors; });
                    testing_internal_1.expect(errorMap).toEqual({ 'one': true });
                });
                testing_internal_1.it('should wait for all validators before setting errors', testing_1.fakeAsync(function () {
                    function getTimerObs(time, errorMap) {
                        return function (c) { return rxjs_1.timer(time).pipe(operators_1.map(function () { return errorMap; })); };
                    }
                    var v = forms_1.Validators.composeAsync([getTimerObs(100, { one: true }), getTimerObs(200, { two: true })]);
                    var errorMap = undefined;
                    v(new forms_1.FormControl('invalid'))
                        .pipe(operators_1.first())
                        .subscribe(function (errors) { return errorMap = errors; });
                    testing_1.tick(100);
                    testing_internal_1.expect(errorMap).not.toBeDefined("Expected errors not to be set until all validators came back.");
                    testing_1.tick(100);
                    testing_internal_1.expect(errorMap).toEqual({ one: true, two: true }, "Expected errors to merge once all validators resolved.");
                }));
            });
        });
    });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9yc19zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvdGVzdC92YWxpZGF0b3JzX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxpREFBc0Q7QUFDdEQsK0VBQWdGO0FBQ2hGLHdDQUFxRztBQUNyRyx5RkFBMEY7QUFFMUYsNkJBQTRDO0FBQzVDLDRDQUEwQztBQUUxQyxDQUFDO0lBQ0MsbUJBQW1CLEdBQVcsRUFBRSxLQUFVO1FBQ3hDLE9BQU8sVUFBQyxDQUFrQjtZQUN4QixJQUFNLENBQUMsR0FBcUIsRUFBRSxDQUFDO1lBQy9CLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDZixPQUFPLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRDtRQUNFLGlDQUFvQixRQUFnQixFQUFVLEtBQVU7WUFBcEMsYUFBUSxHQUFSLFFBQVEsQ0FBUTtZQUFVLFVBQUssR0FBTCxLQUFLLENBQUs7UUFBRyxDQUFDO1FBRTVELDBDQUFRLEdBQVIsVUFBUyxDQUFNO1lBQWYsaUJBTUM7WUFMQyxPQUFPLGlCQUFVLENBQUMsTUFBTSxDQUFDLFVBQUMsR0FBUTtnQkFDaEMsSUFBTSxLQUFLLEdBQUcsS0FBSSxDQUFDLFFBQVEsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQzVELEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2hCLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNqQixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFDSCw4QkFBQztJQUFELENBQUMsQUFWRCxJQVVDO0lBRUQsMkJBQVEsQ0FBQyxZQUFZLEVBQUU7UUFDckIsMkJBQVEsQ0FBQyxLQUFLLEVBQUU7WUFDZCxx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