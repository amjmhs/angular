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
var validators_1 = require("@angular/forms/src/validators");
var rxjs_1 = require("rxjs");
(function () {
    function asyncValidator(expected, timeouts) {
        if (timeouts === void 0) { timeouts = {}; }
        return function (c) {
            var resolve = undefined;
            var promise = new Promise(function (res) { resolve = res; });
            var t = timeouts[c.value] != null ? timeouts[c.value] : 0;
            var res = c.value != expected ? { 'async': true } : null;
            if (t == 0) {
                resolve(res);
            }
            else {
                setTimeout(function () { resolve(res); }, t);
            }
            return promise;
        };
    }
    testing_internal_1.describe('FormArray', function () {
        testing_internal_1.describe('adding/removing', function () {
            var a;
            var c1, c2, c3;
            testing_internal_1.beforeEach(function () {
                a = new forms_1.FormArray([]);
                c1 = new forms_1.FormControl(1);
                c2 = new forms_1.FormControl(2);
                c3 = new forms_1.FormControl(3);
            });
            testing_internal_1.it('should support pushing', function () {
                a.push(c1);
                expect(a.length).toEqual(1);
                expect(a.controls).toEqual([c1]);
            });
            testing_internal_1.it('should support removing', function () {
                a.push(c1);
                a.push(c2);
                a.push(c3);
                a.removeAt(1);
                expect(a.controls).toEqual([c1, c3]);
            });
            testing_internal_1.it('should support inserting', function () {
                a.push(c1);
                a.push(c3);
                a.insert(1, c2);
                expect(a.controls).toEqual([c1, c2, c3]);
            });
        });
        testing_internal_1.describe('value', function () {
            testing_internal_1.it('should be the reduced value of the child controls', function () {
                var a = new forms_1.FormArray([new forms_1.FormControl(1), new forms_1.FormControl(2)]);
                expect(a.value).toEqual([1, 2]);
            });
            testing_internal_1.it('should be an empty array when there are no child controls', function () {
                var a = new forms_1.FormArray([]);
                expect(a.value).toEqual([]);
            });
        });
        testing_internal_1.describe('getRawValue()', function () {
            var a;
            testing_internal_1.it('should work with nested form groups/arrays', function () {
                a = new forms_1.FormArray([
                    new forms_1.FormGroup({ 'c2': new forms_1.FormControl('v2'), 'c3': new forms_1.FormControl('v3') }),
                    new forms_1.FormArray([new forms_1.FormControl('v4'), new forms_1.FormControl('v5')])
                ]);
                a.at(0).get('c3').disable();
                a.at(1).at(1).disable();
                expect(a.getRawValue()).toEqual([{ 'c2': 'v2', 'c3': 'v3' }, ['v4', 'v5']]);
            });
        });
        testing_internal_1.describe('setValue', function () {
            var c, c2, a;
            testing_internal_1.beforeEach(function () {
                c = new forms_1.FormControl('');
                c2 = new forms_1.FormControl('');
                a = new forms_1.FormArray([c, c2]);
            });
            testing_internal_1.it('should set its own value', function () {
                a.setValue(['one', 'two']);
                expect(a.value).toEqual(['one', 'two']);
            });
            testing_internal_1.it('should set child values', function () {
                a.setValue(['one', 'two']);
                expect(c.value).toEqual('one');
                expect(c2.value).toEqual('two');
            });
            testing_internal_1.it('should set values for disabled child controls', function () {
                c2.disable();
                a.setValue(['one', 'two']);
                expect(c2.value).toEqual('two');
                expect(a.value).toEqual(['one']);
                expect(a.getRawValue()).toEqual(['one', 'two']);
            });
            testing_internal_1.it('should set value for disabled arrays', function () {
                a.disable();
                a.setValue(['one', 'two']);
                expect(c.value).toEqual('one');
                expect(c2.value).toEqual('two');
                expect(a.value).toEqual(['one', 'two']);
            });
            testing_internal_1.it('should set parent values', function () {
                var form = new forms_1.FormGroup({ 'parent': a });
                a.setValue(['one', 'two']);
                expect(form.value).toEqual({ 'parent': ['one', 'two'] });
            });
            testing_internal_1.it('should not update the parent explicitly specified', function () {
                var form = new forms_1.FormGroup({ 'parent': a });
                a.setValue(['one', 'two'], { onlySelf: true });
                expect(form.value).toEqual({ parent: ['', ''] });
            });
            testing_internal_1.it('should throw if fields are missing from supplied value (subset)', function () {
                expect(function () { return a.setValue([, 'two']); })
                    .toThrowError(new RegExp("Must supply a value for form control at index: 0"));
            });
            testing_internal_1.it('should throw if a value is provided for a missing control (superset)', function () {
                expect(function () { return a.setValue([
                    'one', 'two', 'three'
                ]); }).toThrowError(new RegExp("Cannot find form control at index 2"));
            });
            testing_internal_1.it('should throw if a value is not provided for a disabled control', function () {
                c2.disable();
                expect(function () { return a.setValue(['one']); })
                    .toThrowError(new RegExp("Must supply a value for form control at index: 1"));
            });
            testing_internal_1.it('should throw if no controls are set yet', function () {
                var empty = new forms_1.FormArray([]);
                expect(function () { return empty.setValue(['one']); })
                    .toThrowError(new RegExp("no form controls registered with this array"));
            });
            testing_internal_1.describe('setValue() events', function () {
                var form;
                var logger;
                testing_internal_1.beforeEach(function () {
                    form = new forms_1.FormGroup({ 'parent': a });
                    logger = [];
                });
                testing_internal_1.it('should emit one valueChange event per control', function () {
                    form.valueChanges.subscribe(function () { return logger.push('form'); });
                    a.valueChanges.subscribe(function () { return logger.push('array'); });
                    c.valueChanges.subscribe(function () { return logger.push('control1'); });
                    c2.valueChanges.subscribe(function () { return logger.push('control2'); });
                    a.setValue(['one', 'two']);
                    expect(logger).toEqual(['control1', 'control2', 'array', 'form']);
                });
                testing_internal_1.it('should not fire an event when explicitly specified', testing_1.fakeAsync(function () {
                    form.valueChanges.subscribe(function (value) { throw 'Should not happen'; });
                    a.valueChanges.subscribe(function (value) { throw 'Should not happen'; });
                    c.valueChanges.subscribe(function (value) { throw 'Should not happen'; });
                    c2.valueChanges.subscribe(function (value) { throw 'Should not happen'; });
                    a.setValue(['one', 'two'], { emitEvent: false });
                    testing_1.tick();
                }));
                testing_internal_1.it('should emit one statusChange event per control', function () {
                    form.statusChanges.subscribe(function () { return logger.push('form'); });
                    a.statusChanges.subscribe(function () { return logger.push('array'); });
                    c.statusChanges.subscribe(function () { return logger.push('control1'); });
                    c2.statusChanges.subscribe(function () { return logger.push('control2'); });
                    a.setValue(['one', 'two']);
                    expect(logger).toEqual(['control1', 'control2', 'array', 'form']);
                });
            });
        });
        testing_internal_1.describe('patchValue', function () {
            var c, c2, a;
            testing_internal_1.beforeEach(function () {
                c = new forms_1.FormControl('');
                c2 = new forms_1.FormControl('');
                a = new forms_1.FormArray([c, c2]);
            });
            testing_internal_1.it('should set its own value', function () {
                a.patchValue(['one', 'two']);
                expect(a.value).toEqual(['one', 'two']);
            });
            testing_internal_1.it('should set child values', function () {
                a.patchValue(['one', 'two']);
                expect(c.value).toEqual('one');
                expect(c2.value).toEqual('two');
            });
            testing_internal_1.it('should patch disabled control values', function () {
                c2.disable();
                a.patchValue(['one', 'two']);
                expect(c2.value).toEqual('two');
                expect(a.value).toEqual(['one']);
                expect(a.getRawValue()).toEqual(['one', 'two']);
            });
            testing_internal_1.it('should patch disabled control arrays', function () {
                a.disable();
                a.patchValue(['one', 'two']);
                expect(c.value).toEqual('one');
                expect(c2.value).toEqual('two');
                expect(a.value).toEqual(['one', 'two']);
            });
            testing_internal_1.it('should set parent values', function () {
                var form = new forms_1.FormGroup({ 'parent': a });
                a.patchValue(['one', 'two']);
                expect(form.value).toEqual({ 'parent': ['one', 'two'] });
            });
            testing_internal_1.it('should not update the parent explicitly specified', function () {
                var form = new forms_1.FormGroup({ 'parent': a });
                a.patchValue(['one', 'two'], { onlySelf: true });
                expect(form.value).toEqual({ parent: ['', ''] });
            });
            testing_internal_1.it('should ignore fields that are missing from supplied value (subset)', function () {
                a.patchValue([, 'two']);
                expect(a.value).toEqual(['', 'two']);
            });
            testing_internal_1.it('should not ignore fields that are null', function () {
                a.patchValue([null]);
                expect(a.value).toEqual([null, '']);
            });
            testing_internal_1.it('should ignore any value provided for a missing control (superset)', function () {
                a.patchValue([, , 'three']);
                expect(a.value).toEqual(['', '']);
            });
            testing_internal_1.describe('patchValue() events', function () {
                var form;
                var logger;
                testing_internal_1.beforeEach(function () {
                    form = new forms_1.FormGroup({ 'parent': a });
                    logger = [];
                });
                testing_internal_1.it('should emit one valueChange event per control', function () {
                    form.valueChanges.subscribe(function () { return logger.push('form'); });
                    a.valueChanges.subscribe(function () { return logger.push('array'); });
                    c.valueChanges.subscribe(function () { return logger.push('control1'); });
                    c2.valueChanges.subscribe(function () { return logger.push('control2'); });
                    a.patchValue(['one', 'two']);
                    expect(logger).toEqual(['control1', 'control2', 'array', 'form']);
                });
                testing_internal_1.it('should not emit valueChange events for skipped controls', function () {
                    form.valueChanges.subscribe(function () { return logger.push('form'); });
                    a.valueChanges.subscribe(function () { return logger.push('array'); });
                    c.valueChanges.subscribe(function () { return logger.push('control1'); });
                    c2.valueChanges.subscribe(function () { return logger.push('control2'); });
                    a.patchValue(['one']);
                    expect(logger).toEqual(['control1', 'array', 'form']);
                });
                testing_internal_1.it('should not fire an event when explicitly specified', testing_1.fakeAsync(function () {
                    form.valueChanges.subscribe(function (value) { throw 'Should not happen'; });
                    a.valueChanges.subscribe(function (value) { throw 'Should not happen'; });
                    c.valueChanges.subscribe(function (value) { throw 'Should not happen'; });
                    c2.valueChanges.subscribe(function (value) { throw 'Should not happen'; });
                    a.patchValue(['one', 'two'], { emitEvent: false });
                    testing_1.tick();
                }));
                testing_internal_1.it('should emit one statusChange event per control', function () {
                    form.statusChanges.subscribe(function () { return logger.push('form'); });
                    a.statusChanges.subscribe(function () { return logger.push('array'); });
                    c.statusChanges.subscribe(function () { return logger.push('control1'); });
                    c2.statusChanges.subscribe(function () { return logger.push('control2'); });
                    a.patchValue(['one', 'two']);
                    expect(logger).toEqual(['control1', 'control2', 'array', 'form']);
                });
            });
        });
        testing_internal_1.describe('reset()', function () {
            var c, c2, a;
            testing_internal_1.beforeEach(function () {
                c = new forms_1.FormControl('initial value');
                c2 = new forms_1.FormControl('');
                a = new forms_1.FormArray([c, c2]);
            });
            testing_internal_1.it('should set its own value if value passed', function () {
                a.setValue(['new value', 'new value']);
                a.reset(['initial value', '']);
                expect(a.value).toEqual(['initial value', '']);
            });
            testing_internal_1.it('should not update the parent when explicitly specified', function () {
                var form = new forms_1.FormGroup({ 'a': a });
                a.reset(['one', 'two'], { onlySelf: true });
                expect(form.value).toEqual({ a: ['initial value', ''] });
            });
            testing_internal_1.it('should set its own value if boxed value passed', function () {
                a.setValue(['new value', 'new value']);
                a.reset([{ value: 'initial value', disabled: false }, '']);
                expect(a.value).toEqual(['initial value', '']);
            });
            testing_internal_1.it('should clear its own value if no value passed', function () {
                a.setValue(['new value', 'new value']);
                a.reset();
                expect(a.value).toEqual([null, null]);
            });
            testing_internal_1.it('should set the value of each of its child controls if value passed', function () {
                a.setValue(['new value', 'new value']);
                a.reset(['initial value', '']);
                expect(c.value).toBe('initial value');
                expect(c2.value).toBe('');
            });
            testing_internal_1.it('should clear the value of each of its child controls if no value', function () {
                a.setValue(['new value', 'new value']);
                a.reset();
                expect(c.value).toBe(null);
                expect(c2.value).toBe(null);
            });
            testing_internal_1.it('should set the value of its parent if value passed', function () {
                var form = new forms_1.FormGroup({ 'a': a });
                a.setValue(['new value', 'new value']);
                a.reset(['initial value', '']);
                expect(form.value).toEqual({ 'a': ['initial value', ''] });
            });
            testing_internal_1.it('should clear the value of its parent if no value passed', function () {
                var form = new forms_1.FormGroup({ 'a': a });
                a.setValue(['new value', 'new value']);
                a.reset();
                expect(form.value).toEqual({ 'a': [null, null] });
            });
            testing_internal_1.it('should mark itself as pristine', function () {
                a.markAsDirty();
                expect(a.pristine).toBe(false);
                a.reset();
                expect(a.pristine).toBe(true);
            });
            testing_internal_1.it('should mark all child controls as pristine', function () {
                c.markAsDirty();
                c2.markAsDirty();
                expect(c.pristine).toBe(false);
                expect(c2.pristine).toBe(false);
                a.reset();
                expect(c.pristine).toBe(true);
                expect(c2.pristine).toBe(true);
            });
            testing_internal_1.it('should mark the parent as pristine if all siblings pristine', function () {
                var c3 = new forms_1.FormControl('');
                var form = new forms_1.FormGroup({ 'a': a, 'c3': c3 });
                a.markAsDirty();
                expect(form.pristine).toBe(false);
                a.reset();
                expect(form.pristine).toBe(true);
            });
            testing_internal_1.it('should not mark the parent pristine if any dirty siblings', function () {
                var c3 = new forms_1.FormControl('');
                var form = new forms_1.FormGroup({ 'a': a, 'c3': c3 });
                a.markAsDirty();
                c3.markAsDirty();
                expect(form.pristine).toBe(false);
                a.reset();
                expect(form.pristine).toBe(false);
            });
            testing_internal_1.it('should mark itself as untouched', function () {
                a.markAsTouched();
                expect(a.untouched).toBe(false);
                a.reset();
                expect(a.untouched).toBe(true);
            });
            testing_internal_1.it('should mark all child controls as untouched', function () {
                c.markAsTouched();
                c2.markAsTouched();
                expect(c.untouched).toBe(false);
                expect(c2.untouched).toBe(false);
                a.reset();
                expect(c.untouched).toBe(true);
                expect(c2.untouched).toBe(true);
            });
            testing_internal_1.it('should mark the parent untouched if all siblings untouched', function () {
                var c3 = new forms_1.FormControl('');
                var form = new forms_1.FormGroup({ 'a': a, 'c3': c3 });
                a.markAsTouched();
                expect(form.untouched).toBe(false);
                a.reset();
                expect(form.untouched).toBe(true);
            });
            testing_internal_1.it('should not mark the parent untouched if any touched siblings', function () {
                var c3 = new forms_1.FormControl('');
                var form = new forms_1.FormGroup({ 'a': a, 'c3': c3 });
                a.markAsTouched();
                c3.markAsTouched();
                expect(form.untouched).toBe(false);
                a.reset();
                expect(form.untouched).toBe(false);
            });
            testing_internal_1.it('should retain previous disabled state', function () {
                a.disable();
                a.reset();
                expect(a.disabled).toBe(true);
            });
            testing_internal_1.it('should set child disabled state if boxed value passed', function () {
                a.disable();
                a.reset([{ value: '', disabled: false }, '']);
                expect(c.disabled).toBe(false);
                expect(a.disabled).toBe(false);
            });
            testing_internal_1.describe('reset() events', function () {
                var form, c3, logger;
                testing_internal_1.beforeEach(function () {
                    c3 = new forms_1.FormControl('');
                    form = new forms_1.FormGroup({ 'a': a, 'c3': c3 });
                    logger = [];
                });
                testing_internal_1.it('should emit one valueChange event per reset control', function () {
                    form.valueChanges.subscribe(function () { return logger.push('form'); });
                    a.valueChanges.subscribe(function () { return logger.push('array'); });
                    c.valueChanges.subscribe(function () { return logger.push('control1'); });
                    c2.valueChanges.subscribe(function () { return logger.push('control2'); });
                    c3.valueChanges.subscribe(function () { return logger.push('control3'); });
                    a.reset();
                    expect(logger).toEqual(['control1', 'control2', 'array', 'form']);
                });
                testing_internal_1.it('should not fire an event when explicitly specified', testing_1.fakeAsync(function () {
                    form.valueChanges.subscribe(function (value) { throw 'Should not happen'; });
                    a.valueChanges.subscribe(function (value) { throw 'Should not happen'; });
                    c.valueChanges.subscribe(function (value) { throw 'Should not happen'; });
                    c2.valueChanges.subscribe(function (value) { throw 'Should not happen'; });
                    c3.valueChanges.subscribe(function (value) { throw 'Should not happen'; });
                    a.reset([], { emitEvent: false });
                    testing_1.tick();
                }));
                testing_internal_1.it('should emit one statusChange event per reset control', function () {
                    form.statusChanges.subscribe(function () { return logger.push('form'); });
                    a.statusChanges.subscribe(function () { return logger.push('array'); });
                    c.statusChanges.subscribe(function () { return logger.push('control1'); });
                    c2.statusChanges.subscribe(function () { return logger.push('control2'); });
                    c3.statusChanges.subscribe(function () { return logger.push('control3'); });
                    a.reset();
                    expect(logger).toEqual(['control1', 'control2', 'array', 'form']);
                });
            });
        });
        testing_internal_1.describe('errors', function () {
            testing_internal_1.it('should run the validator when the value changes', function () {
                var simpleValidator = function (c) {
                    return c.controls[0].value != 'correct' ? { 'broken': true } : null;
                };
                var c = new forms_1.FormControl(null);
                var g = new forms_1.FormArray([c], simpleValidator);
                c.setValue('correct');
                expect(g.valid).toEqual(true);
                expect(g.errors).toEqual(null);
                c.setValue('incorrect');
                expect(g.valid).toEqual(false);
                expect(g.errors).toEqual({ 'broken': true });
            });
        });
        testing_internal_1.describe('dirty', function () {
            var c;
            var a;
            testing_internal_1.beforeEach(function () {
                c = new forms_1.FormControl('value');
                a = new forms_1.FormArray([c]);
            });
            testing_internal_1.it('should be false after creating a control', function () { expect(a.dirty).toEqual(false); });
            testing_internal_1.it('should be true after changing the value of the control', function () {
                c.markAsDirty();
                expect(a.dirty).toEqual(true);
            });
        });
        testing_internal_1.describe('touched', function () {
            var c;
            var a;
            testing_internal_1.beforeEach(function () {
                c = new forms_1.FormControl('value');
                a = new forms_1.FormArray([c]);
            });
            testing_internal_1.it('should be false after creating a control', function () { expect(a.touched).toEqual(false); });
            testing_internal_1.it('should be true after child control is marked as touched', function () {
                c.markAsTouched();
                expect(a.touched).toEqual(true);
            });
        });
        testing_internal_1.describe('pending', function () {
            var c;
            var a;
            testing_internal_1.beforeEach(function () {
                c = new forms_1.FormControl('value');
                a = new forms_1.FormArray([c]);
            });
            testing_internal_1.it('should be false after creating a control', function () {
                expect(c.pending).toEqual(false);
                expect(a.pending).toEqual(false);
            });
            testing_internal_1.it('should be true after changing the value of the control', function () {
                c.markAsPending();
                expect(c.pending).toEqual(true);
                expect(a.pending).toEqual(true);
            });
            testing_internal_1.it('should not update the parent when onlySelf = true', function () {
                c.markAsPending({ onlySelf: true });
                expect(c.pending).toEqual(true);
                expect(a.pending).toEqual(false);
            });
            testing_internal_1.describe('status change events', function () {
                var logger;
                testing_internal_1.beforeEach(function () {
                    logger = [];
                    a.statusChanges.subscribe(function (status) { return logger.push(status); });
                });
                testing_internal_1.it('should emit event after marking control as pending', function () {
                    c.markAsPending();
                    expect(logger).toEqual(['PENDING']);
                });
                testing_internal_1.it('should not emit event from parent when onlySelf is true', function () {
                    c.markAsPending({ onlySelf: true });
                    expect(logger).toEqual([]);
                });
                testing_internal_1.it('should not emit event when emitEvent = false', function () {
                    c.markAsPending({ emitEvent: false });
                    expect(logger).toEqual([]);
                });
                testing_internal_1.it('should emit event when parent is markedAsPending', function () {
                    a.markAsPending();
                    expect(logger).toEqual(['PENDING']);
                });
            });
        });
        testing_internal_1.describe('valueChanges', function () {
            var a;
            var c1 /** TODO #9100 */, c2 /** TODO #9100 */;
            testing_internal_1.beforeEach(function () {
                c1 = new forms_1.FormControl('old1');
                c2 = new forms_1.FormControl('old2');
                a = new forms_1.FormArray([c1, c2]);
            });
            testing_internal_1.it('should fire an event after the value has been updated', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                a.valueChanges.subscribe({
                    next: function (value) {
                        expect(a.value).toEqual(['new1', 'old2']);
                        expect(value).toEqual(['new1', 'old2']);
                        async.done();
                    }
                });
                c1.setValue('new1');
            }));
            testing_internal_1.it('should fire an event after the control\'s observable fired an event', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var controlCallbackIsCalled = false;
                c1.valueChanges.subscribe({ next: function (value) { controlCallbackIsCalled = true; } });
                a.valueChanges.subscribe({
                    next: function (value) {
                        expect(controlCallbackIsCalled).toBe(true);
                        async.done();
                    }
                });
                c1.setValue('new1');
            }));
            testing_internal_1.it('should fire an event when a control is removed', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                a.valueChanges.subscribe({
                    next: function (value) {
                        expect(value).toEqual(['old1']);
                        async.done();
                    }
                });
                a.removeAt(1);
            }));
            testing_internal_1.it('should fire an event when a control is added', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                a.removeAt(1);
                a.valueChanges.subscribe({
                    next: function (value) {
                        expect(value).toEqual(['old1', 'old2']);
                        async.done();
                    }
                });
                a.push(c2);
            }));
        });
        testing_internal_1.describe('get', function () {
            testing_internal_1.it('should return null when path is null', function () {
                var g = new forms_1.FormGroup({});
                expect(g.get(null)).toEqual(null);
            });
            testing_internal_1.it('should return null when path is empty', function () {
                var g = new forms_1.FormGroup({});
                expect(g.get([])).toEqual(null);
            });
            testing_internal_1.it('should return null when path is invalid', function () {
                var g = new forms_1.FormGroup({});
                expect(g.get('invalid')).toEqual(null);
            });
            testing_internal_1.it('should return a child of a control group', function () {
                var g = new forms_1.FormGroup({
                    'one': new forms_1.FormControl('111'),
                    'nested': new forms_1.FormGroup({ 'two': new forms_1.FormControl('222') })
                });
                expect(g.get(['one']).value).toEqual('111');
                expect(g.get('one').value).toEqual('111');
                expect(g.get(['nested', 'two']).value).toEqual('222');
                expect(g.get('nested.two').value).toEqual('222');
            });
            testing_internal_1.it('should return an element of an array', function () {
                var g = new forms_1.FormGroup({ 'array': new forms_1.FormArray([new forms_1.FormControl('111')]) });
                expect(g.get(['array', 0]).value).toEqual('111');
            });
        });
        testing_internal_1.describe('validator', function () {
            function simpleValidator(c) {
                return c.get([0]).value === 'correct' ? null : { 'broken': true };
            }
            function arrayRequiredValidator(c) {
                return validators_1.Validators.required(c.get([0]));
            }
            testing_internal_1.it('should set a single validator', function () {
                var a = new forms_1.FormArray([new forms_1.FormControl()], simpleValidator);
                expect(a.valid).toBe(false);
                expect(a.errors).toEqual({ 'broken': true });
                a.setValue(['correct']);
                expect(a.valid).toBe(true);
            });
            testing_internal_1.it('should set a single validator from options obj', function () {
                var a = new forms_1.FormArray([new forms_1.FormControl()], { validators: simpleValidator });
                expect(a.valid).toBe(false);
                expect(a.errors).toEqual({ 'broken': true });
                a.setValue(['correct']);
                expect(a.valid).toBe(true);
            });
            testing_internal_1.it('should set multiple validators from an array', function () {
                var a = new forms_1.FormArray([new forms_1.FormControl()], [simpleValidator, arrayRequiredValidator]);
                expect(a.valid).toBe(false);
                expect(a.errors).toEqual({ 'required': true, 'broken': true });
                a.setValue(['c']);
                expect(a.valid).toBe(false);
                expect(a.errors).toEqual({ 'broken': true });
                a.setValue(['correct']);
                expect(a.valid).toBe(true);
            });
            testing_internal_1.it('should set multiple validators from options obj', function () {
                var a = new forms_1.FormArray([new forms_1.FormControl()], { validators: [simpleValidator, arrayRequiredValidator] });
                expect(a.valid).toBe(false);
                expect(a.errors).toEqual({ 'required': true, 'broken': true });
                a.setValue(['c']);
                expect(a.valid).toBe(false);
                expect(a.errors).toEqual({ 'broken': true });
                a.setValue(['correct']);
                expect(a.valid).toBe(true);
            });
        });
        testing_internal_1.describe('asyncValidator', function () {
            function otherObservableValidator() { return rxjs_1.of({ 'other': true }); }
            testing_internal_1.it('should run the async validator', testing_1.fakeAsync(function () {
                var c = new forms_1.FormControl('value');
                var g = new forms_1.FormArray([c], null, asyncValidator('expected'));
                expect(g.pending).toEqual(true);
                testing_1.tick();
                expect(g.errors).toEqual({ 'async': true });
                expect(g.pending).toEqual(false);
            }));
            testing_internal_1.it('should set a single async validator from options obj', testing_1.fakeAsync(function () {
                var g = new forms_1.FormArray([new forms_1.FormControl('value')], { asyncValidators: asyncValidator('expected') });
                expect(g.pending).toEqual(true);
                testing_1.tick();
                expect(g.errors).toEqual({ 'async': true });
                expect(g.pending).toEqual(false);
            }));
            testing_internal_1.it('should set multiple async validators from an array', testing_1.fakeAsync(function () {
                var g = new forms_1.FormArray([new forms_1.FormControl('value')], null, [asyncValidator('expected'), otherObservableValidator]);
                expect(g.pending).toEqual(true);
                testing_1.tick();
                expect(g.errors).toEqual({ 'async': true, 'other': true });
                expect(g.pending).toEqual(false);
            }));
            testing_internal_1.it('should set multiple async validators from options obj', testing_1.fakeAsync(function () {
                var g = new forms_1.FormArray([new forms_1.FormControl('value')], { asyncValidators: [asyncValidator('expected'), otherObservableValidator] });
                expect(g.pending).toEqual(true);
                testing_1.tick();
                expect(g.errors).toEqual({ 'async': true, 'other': true });
                expect(g.pending).toEqual(false);
            }));
        });
        testing_internal_1.describe('disable() & enable()', function () {
            var a;
            var c;
            var c2;
            testing_internal_1.beforeEach(function () {
                c = new forms_1.FormControl(null);
                c2 = new forms_1.FormControl(null);
                a = new forms_1.FormArray([c, c2]);
            });
            testing_internal_1.it('should mark the array as disabled', function () {
                expect(a.disabled).toBe(false);
                expect(a.valid).toBe(true);
                a.disable();
                expect(a.disabled).toBe(true);
                expect(a.valid).toBe(false);
                a.enable();
                expect(a.disabled).toBe(false);
                expect(a.valid).toBe(true);
            });
            testing_internal_1.it('should set the array status as disabled', function () {
                expect(a.status).toBe('VALID');
                a.disable();
                expect(a.status).toBe('DISABLED');
                a.enable();
                expect(a.status).toBe('VALID');
            });
            testing_internal_1.it('should mark children of the array as disabled', function () {
                expect(c.disabled).toBe(false);
                expect(c2.disabled).toBe(false);
                a.disable();
                expect(c.disabled).toBe(true);
                expect(c2.disabled).toBe(true);
                a.enable();
                expect(c.disabled).toBe(false);
                expect(c2.disabled).toBe(false);
            });
            testing_internal_1.it('should ignore disabled controls in validation', function () {
                var g = new forms_1.FormGroup({
                    nested: new forms_1.FormArray([new forms_1.FormControl(null, validators_1.Validators.required)]),
                    two: new forms_1.FormControl('two')
                });
                expect(g.valid).toBe(false);
                g.get('nested').disable();
                expect(g.valid).toBe(true);
                g.get('nested').enable();
                expect(g.valid).toBe(false);
            });
            testing_internal_1.it('should ignore disabled controls when serializing value', function () {
                var g = new forms_1.FormGroup({ nested: new forms_1.FormArray([new forms_1.FormControl('one')]), two: new forms_1.FormControl('two') });
                expect(g.value).toEqual({ 'nested': ['one'], 'two': 'two' });
                g.get('nested').disable();
                expect(g.value).toEqual({ 'two': 'two' });
                g.get('nested').enable();
                expect(g.value).toEqual({ 'nested': ['one'], 'two': 'two' });
            });
            testing_internal_1.it('should ignore disabled controls when determining dirtiness', function () {
                var g = new forms_1.FormGroup({ nested: a, two: new forms_1.FormControl('two') });
                g.get(['nested', 0]).markAsDirty();
                expect(g.dirty).toBe(true);
                g.get('nested').disable();
                expect(g.get('nested').dirty).toBe(true);
                expect(g.dirty).toEqual(false);
                g.get('nested').enable();
                expect(g.dirty).toEqual(true);
            });
            testing_internal_1.it('should ignore disabled controls when determining touched state', function () {
                var g = new forms_1.FormGroup({ nested: a, two: new forms_1.FormControl('two') });
                g.get(['nested', 0]).markAsTouched();
                expect(g.touched).toBe(true);
                g.get('nested').disable();
                expect(g.get('nested').touched).toBe(true);
                expect(g.touched).toEqual(false);
                g.get('nested').enable();
                expect(g.touched).toEqual(true);
            });
            testing_internal_1.it('should keep empty, disabled arrays disabled when updating validity', function () {
                var arr = new forms_1.FormArray([]);
                expect(arr.status).toEqual('VALID');
                arr.disable();
                expect(arr.status).toEqual('DISABLED');
                arr.updateValueAndValidity();
                expect(arr.status).toEqual('DISABLED');
                arr.push(new forms_1.FormControl({ value: '', disabled: true }));
                expect(arr.status).toEqual('DISABLED');
                arr.push(new forms_1.FormControl());
                expect(arr.status).toEqual('VALID');
            });
            testing_internal_1.it('should re-enable empty, disabled arrays', function () {
                var arr = new forms_1.FormArray([]);
                arr.disable();
                expect(arr.status).toEqual('DISABLED');
                arr.enable();
                expect(arr.status).toEqual('VALID');
            });
            testing_internal_1.it('should not run validators on disabled controls', function () {
                var validator = jasmine.createSpy('validator');
                var arr = new forms_1.FormArray([new forms_1.FormControl()], validator);
                expect(validator.calls.count()).toEqual(1);
                arr.disable();
                expect(validator.calls.count()).toEqual(1);
                arr.setValue(['value']);
                expect(validator.calls.count()).toEqual(1);
                arr.enable();
                expect(validator.calls.count()).toEqual(2);
            });
            testing_internal_1.describe('disabled errors', function () {
                testing_internal_1.it('should clear out array errors when disabled', function () {
                    var arr = new forms_1.FormArray([new forms_1.FormControl()], function () { return ({ 'expected': true }); });
                    expect(arr.errors).toEqual({ 'expected': true });
                    arr.disable();
                    expect(arr.errors).toEqual(null);
                    arr.enable();
                    expect(arr.errors).toEqual({ 'expected': true });
                });
                testing_internal_1.it('should re-populate array errors when enabled from a child', function () {
                    var arr = new forms_1.FormArray([new forms_1.FormControl()], function () { return ({ 'expected': true }); });
                    arr.disable();
                    expect(arr.errors).toEqual(null);
                    arr.push(new forms_1.FormControl());
                    expect(arr.errors).toEqual({ 'expected': true });
                });
                testing_internal_1.it('should clear out async array errors when disabled', testing_1.fakeAsync(function () {
                    var arr = new forms_1.FormArray([new forms_1.FormControl()], null, asyncValidator('expected'));
                    testing_1.tick();
                    expect(arr.errors).toEqual({ 'async': true });
                    arr.disable();
                    expect(arr.errors).toEqual(null);
                    arr.enable();
                    testing_1.tick();
                    expect(arr.errors).toEqual({ 'async': true });
                }));
                testing_internal_1.it('should re-populate async array errors when enabled from a child', testing_1.fakeAsync(function () {
                    var arr = new forms_1.FormArray([new forms_1.FormControl()], null, asyncValidator('expected'));
                    testing_1.tick();
                    expect(arr.errors).toEqual({ 'async': true });
                    arr.disable();
                    expect(arr.errors).toEqual(null);
                    arr.push(new forms_1.FormControl());
                    testing_1.tick();
                    expect(arr.errors).toEqual({ 'async': true });
                }));
            });
            testing_internal_1.describe('disabled events', function () {
                var logger;
                var c;
                var a;
                var form;
                testing_internal_1.beforeEach(function () {
                    logger = [];
                    c = new forms_1.FormControl('', validators_1.Validators.required);
                    a = new forms_1.FormArray([c]);
                    form = new forms_1.FormGroup({ a: a });
                });
                testing_internal_1.it('should emit value change events in the right order', function () {
                    c.valueChanges.subscribe(function () { return logger.push('control'); });
                    a.valueChanges.subscribe(function () { return logger.push('array'); });
                    form.valueChanges.subscribe(function () { return logger.push('form'); });
                    a.disable();
                    expect(logger).toEqual(['control', 'array', 'form']);
                });
                testing_internal_1.it('should emit status change events in the right order', function () {
                    c.statusChanges.subscribe(function () { return logger.push('control'); });
                    a.statusChanges.subscribe(function () { return logger.push('array'); });
                    form.statusChanges.subscribe(function () { return logger.push('form'); });
                    a.disable();
                    expect(logger).toEqual(['control', 'array', 'form']);
                });
                testing_internal_1.it('should not emit value change events when emitEvent = false', function () {
                    c.valueChanges.subscribe(function () { return logger.push('control'); });
                    a.valueChanges.subscribe(function () { return logger.push('array'); });
                    form.valueChanges.subscribe(function () { return logger.push('form'); });
                    a.disable({ emitEvent: false });
                    expect(logger).toEqual([]);
                    a.enable({ emitEvent: false });
                    expect(logger).toEqual([]);
                });
                testing_internal_1.it('should not emit status change events when emitEvent = false', function () {
                    c.statusChanges.subscribe(function () { return logger.push('control'); });
                    a.statusChanges.subscribe(function () { return logger.push('array'); });
                    form.statusChanges.subscribe(function () { return logger.push('form'); });
                    a.disable({ emitEvent: false });
                    expect(logger).toEqual([]);
                    a.enable({ emitEvent: false });
                    expect(logger).toEqual([]);
                });
            });
            testing_internal_1.describe('setControl()', function () {
                var c;
                var a;
                testing_internal_1.beforeEach(function () {
                    c = new forms_1.FormControl('one');
                    a = new forms_1.FormArray([c]);
                });
                testing_internal_1.it('should replace existing control with new control', function () {
                    var c2 = new forms_1.FormControl('new!', validators_1.Validators.minLength(10));
                    a.setControl(0, c2);
                    expect(a.controls[0]).toEqual(c2);
                    expect(a.value).toEqual(['new!']);
                    expect(a.valid).toBe(false);
                });
                testing_internal_1.it('should add control if control did not exist before', function () {
                    var c2 = new forms_1.FormControl('new!', validators_1.Validators.minLength(10));
                    a.setControl(1, c2);
                    expect(a.controls[1]).toEqual(c2);
                    expect(a.value).toEqual(['one', 'new!']);
                    expect(a.valid).toBe(false);
                });
                testing_internal_1.it('should remove control if new control is null', function () {
                    a.setControl(0, null);
                    expect(a.controls[0]).not.toBeDefined();
                    expect(a.value).toEqual([]);
                });
                testing_internal_1.it('should only emit value change event once', function () {
                    var logger = [];
                    var c2 = new forms_1.FormControl('new!');
                    a.valueChanges.subscribe(function () { return logger.push('change!'); });
                    a.setControl(0, c2);
                    expect(logger).toEqual(['change!']);
                });
            });
        });
    });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9hcnJheV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvdGVzdC9mb3JtX2FycmF5X3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxpREFBc0Q7QUFDdEQsK0VBQWdIO0FBQ2hILHdDQUFvRztBQUNwRyw0REFBeUQ7QUFDekQsNkJBQXlCO0FBRXpCLENBQUM7SUFDQyx3QkFBd0IsUUFBZ0IsRUFBRSxRQUFhO1FBQWIseUJBQUEsRUFBQSxhQUFhO1FBQ3JELE9BQU8sVUFBQyxDQUFrQjtZQUN4QixJQUFJLE9BQU8sR0FBMEIsU0FBVyxDQUFDO1lBQ2pELElBQU0sT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLFVBQUEsR0FBRyxJQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2RCxJQUFNLENBQUMsR0FBSSxRQUFnQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFFLFFBQWdCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUUsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUssSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFFekQsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNkO2lCQUFNO2dCQUNMLFVBQVUsQ0FBQyxjQUFRLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUN4QztZQUVELE9BQU8sT0FBTyxDQUFDO1FBQ2pCLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRCwyQkFBUSxDQUFDLFdBQVcs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