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
var testing_1 = require("@angular/core/testing");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var forms_1 = require("@angular/forms");
var rxjs_1 = require("rxjs");
(function () {
    function simpleValidator(c) {
        return c.get('one').value === 'correct' ? null : { 'broken': true };
    }
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
    function asyncValidatorReturningObservable(c) {
        var e = new core_1.EventEmitter();
        Promise.resolve(null).then(function () { e.emit({ 'async': true }); });
        return e;
    }
    function otherObservableValidator() { return rxjs_1.of({ 'other': true }); }
    testing_internal_1.describe('FormGroup', function () {
        testing_internal_1.describe('value', function () {
            testing_internal_1.it('should be the reduced value of the child controls', function () {
                var g = new forms_1.FormGroup({ 'one': new forms_1.FormControl('111'), 'two': new forms_1.FormControl('222') });
                expect(g.value).toEqual({ 'one': '111', 'two': '222' });
            });
            testing_internal_1.it('should be empty when there are no child controls', function () {
                var g = new forms_1.FormGroup({});
                expect(g.value).toEqual({});
            });
            testing_internal_1.it('should support nested groups', function () {
                var g = new forms_1.FormGroup({
                    'one': new forms_1.FormControl('111'),
                    'nested': new forms_1.FormGroup({ 'two': new forms_1.FormControl('222') })
                });
                expect(g.value).toEqual({ 'one': '111', 'nested': { 'two': '222' } });
                (g.get('nested.two')).setValue('333');
                expect(g.value).toEqual({ 'one': '111', 'nested': { 'two': '333' } });
            });
        });
        testing_internal_1.describe('getRawValue', function () {
            var fg;
            testing_internal_1.it('should work with nested form groups/arrays', function () {
                fg = new forms_1.FormGroup({
                    'c1': new forms_1.FormControl('v1'),
                    'group': new forms_1.FormGroup({ 'c2': new forms_1.FormControl('v2'), 'c3': new forms_1.FormControl('v3') }),
                    'array': new forms_1.FormArray([new forms_1.FormControl('v4'), new forms_1.FormControl('v5')])
                });
                fg.get('group').get('c3').disable();
                fg.get('array').at(1).disable();
                expect(fg.getRawValue())
                    .toEqual({ 'c1': 'v1', 'group': { 'c2': 'v2', 'c3': 'v3' }, 'array': ['v4', 'v5'] });
            });
        });
        testing_internal_1.describe('adding and removing controls', function () {
            testing_internal_1.it('should update value and validity when control is added', function () {
                var g = new forms_1.FormGroup({ 'one': new forms_1.FormControl('1') });
                expect(g.value).toEqual({ 'one': '1' });
                expect(g.valid).toBe(true);
                g.addControl('two', new forms_1.FormControl('2', forms_1.Validators.minLength(10)));
                expect(g.value).toEqual({ 'one': '1', 'two': '2' });
                expect(g.valid).toBe(false);
            });
            testing_internal_1.it('should update value and validity when control is removed', function () {
                var g = new forms_1.FormGroup({ 'one': new forms_1.FormControl('1'), 'two': new forms_1.FormControl('2', forms_1.Validators.minLength(10)) });
                expect(g.value).toEqual({ 'one': '1', 'two': '2' });
                expect(g.valid).toBe(false);
                g.removeControl('two');
                expect(g.value).toEqual({ 'one': '1' });
                expect(g.valid).toBe(true);
            });
        });
        testing_internal_1.describe('dirty', function () {
            var c, g;
            testing_internal_1.beforeEach(function () {
                c = new forms_1.FormControl('value');
                g = new forms_1.FormGroup({ 'one': c });
            });
            testing_internal_1.it('should be false after creating a control', function () { expect(g.dirty).toEqual(false); });
            testing_internal_1.it('should be true after changing the value of the control', function () {
                c.markAsDirty();
                expect(g.dirty).toEqual(true);
            });
        });
        testing_internal_1.describe('touched', function () {
            var c, g;
            testing_internal_1.beforeEach(function () {
                c = new forms_1.FormControl('value');
                g = new forms_1.FormGroup({ 'one': c });
            });
            testing_internal_1.it('should be false after creating a control', function () { expect(g.touched).toEqual(false); });
            testing_internal_1.it('should be true after control is marked as touched', function () {
                c.markAsTouched();
                expect(g.touched).toEqual(true);
            });
        });
        testing_internal_1.describe('setValue', function () {
            var c, c2, g;
            testing_internal_1.beforeEach(function () {
                c = new forms_1.FormControl('');
                c2 = new forms_1.FormControl('');
                g = new forms_1.FormGroup({ 'one': c, 'two': c2 });
            });
            testing_internal_1.it('should set its own value', function () {
                g.setValue({ 'one': 'one', 'two': 'two' });
                expect(g.value).toEqual({ 'one': 'one', 'two': 'two' });
            });
            testing_internal_1.it('should set child values', function () {
                g.setValue({ 'one': 'one', 'two': 'two' });
                expect(c.value).toEqual('one');
                expect(c2.value).toEqual('two');
            });
            testing_internal_1.it('should set child control values if disabled', function () {
                c2.disable();
                g.setValue({ 'one': 'one', 'two': 'two' });
                expect(c2.value).toEqual('two');
                expect(g.value).toEqual({ 'one': 'one' });
                expect(g.getRawValue()).toEqual({ 'one': 'one', 'two': 'two' });
            });
            testing_internal_1.it('should set group value if group is disabled', function () {
                g.disable();
                g.setValue({ 'one': 'one', 'two': 'two' });
                expect(c.value).toEqual('one');
                expect(c2.value).toEqual('two');
                expect(g.value).toEqual({ 'one': 'one', 'two': 'two' });
            });
            testing_internal_1.it('should set parent values', function () {
                var form = new forms_1.FormGroup({ 'parent': g });
                g.setValue({ 'one': 'one', 'two': 'two' });
                expect(form.value).toEqual({ 'parent': { 'one': 'one', 'two': 'two' } });
            });
            testing_internal_1.it('should not update the parent when explicitly specified', function () {
                var form = new forms_1.FormGroup({ 'parent': g });
                g.setValue({ 'one': 'one', 'two': 'two' }, { onlySelf: true });
                expect(form.value).toEqual({ parent: { 'one': '', 'two': '' } });
            });
            testing_internal_1.it('should throw if fields are missing from supplied value (subset)', function () {
                expect(function () { return g.setValue({
                    'one': 'one'
                }); }).toThrowError(new RegExp("Must supply a value for form control with name: 'two'"));
            });
            testing_internal_1.it('should throw if a value is provided for a missing control (superset)', function () {
                expect(function () { return g.setValue({ 'one': 'one', 'two': 'two', 'three': 'three' }); })
                    .toThrowError(new RegExp("Cannot find form control with name: three"));
            });
            testing_internal_1.it('should throw if a value is not provided for a disabled control', function () {
                c2.disable();
                expect(function () { return g.setValue({
                    'one': 'one'
                }); }).toThrowError(new RegExp("Must supply a value for form control with name: 'two'"));
            });
            testing_internal_1.it('should throw if no controls are set yet', function () {
                var empty = new forms_1.FormGroup({});
                expect(function () { return empty.setValue({
                    'one': 'one'
                }); }).toThrowError(new RegExp("no form controls registered with this group"));
            });
            testing_internal_1.describe('setValue() events', function () {
                var form;
                var logger;
                testing_internal_1.beforeEach(function () {
                    form = new forms_1.FormGroup({ 'parent': g });
                    logger = [];
                });
                testing_internal_1.it('should emit one valueChange event per control', function () {
                    form.valueChanges.subscribe(function () { return logger.push('form'); });
                    g.valueChanges.subscribe(function () { return logger.push('group'); });
                    c.valueChanges.subscribe(function () { return logger.push('control1'); });
                    c2.valueChanges.subscribe(function () { return logger.push('control2'); });
                    g.setValue({ 'one': 'one', 'two': 'two' });
                    expect(logger).toEqual(['control1', 'control2', 'group', 'form']);
                });
                testing_internal_1.it('should not fire an event when explicitly specified', testing_1.fakeAsync(function () {
                    form.valueChanges.subscribe(function (value) { throw 'Should not happen'; });
                    g.valueChanges.subscribe(function (value) { throw 'Should not happen'; });
                    c.valueChanges.subscribe(function (value) { throw 'Should not happen'; });
                    g.setValue({ 'one': 'one', 'two': 'two' }, { emitEvent: false });
                    testing_1.tick();
                }));
                testing_internal_1.it('should emit one statusChange event per control', function () {
                    form.statusChanges.subscribe(function () { return logger.push('form'); });
                    g.statusChanges.subscribe(function () { return logger.push('group'); });
                    c.statusChanges.subscribe(function () { return logger.push('control1'); });
                    c2.statusChanges.subscribe(function () { return logger.push('control2'); });
                    g.setValue({ 'one': 'one', 'two': 'two' });
                    expect(logger).toEqual(['control1', 'control2', 'group', 'form']);
                });
            });
        });
        testing_internal_1.describe('patchValue', function () {
            var c, c2, g;
            testing_internal_1.beforeEach(function () {
                c = new forms_1.FormControl('');
                c2 = new forms_1.FormControl('');
                g = new forms_1.FormGroup({ 'one': c, 'two': c2 });
            });
            testing_internal_1.it('should set its own value', function () {
                g.patchValue({ 'one': 'one', 'two': 'two' });
                expect(g.value).toEqual({ 'one': 'one', 'two': 'two' });
            });
            testing_internal_1.it('should set child values', function () {
                g.patchValue({ 'one': 'one', 'two': 'two' });
                expect(c.value).toEqual('one');
                expect(c2.value).toEqual('two');
            });
            testing_internal_1.it('should patch disabled control values', function () {
                c2.disable();
                g.patchValue({ 'one': 'one', 'two': 'two' });
                expect(c2.value).toEqual('two');
                expect(g.value).toEqual({ 'one': 'one' });
                expect(g.getRawValue()).toEqual({ 'one': 'one', 'two': 'two' });
            });
            testing_internal_1.it('should patch disabled control groups', function () {
                g.disable();
                g.patchValue({ 'one': 'one', 'two': 'two' });
                expect(c.value).toEqual('one');
                expect(c2.value).toEqual('two');
                expect(g.value).toEqual({ 'one': 'one', 'two': 'two' });
            });
            testing_internal_1.it('should set parent values', function () {
                var form = new forms_1.FormGroup({ 'parent': g });
                g.patchValue({ 'one': 'one', 'two': 'two' });
                expect(form.value).toEqual({ 'parent': { 'one': 'one', 'two': 'two' } });
            });
            testing_internal_1.it('should not update the parent when explicitly specified', function () {
                var form = new forms_1.FormGroup({ 'parent': g });
                g.patchValue({ 'one': 'one', 'two': 'two' }, { onlySelf: true });
                expect(form.value).toEqual({ parent: { 'one': '', 'two': '' } });
            });
            testing_internal_1.it('should ignore fields that are missing from supplied value (subset)', function () {
                g.patchValue({ 'one': 'one' });
                expect(g.value).toEqual({ 'one': 'one', 'two': '' });
            });
            testing_internal_1.it('should not ignore fields that are null', function () {
                g.patchValue({ 'one': null });
                expect(g.value).toEqual({ 'one': null, 'two': '' });
            });
            testing_internal_1.it('should ignore any value provided for a missing control (superset)', function () {
                g.patchValue({ 'three': 'three' });
                expect(g.value).toEqual({ 'one': '', 'two': '' });
            });
            testing_internal_1.describe('patchValue() events', function () {
                var form;
                var logger;
                testing_internal_1.beforeEach(function () {
                    form = new forms_1.FormGroup({ 'parent': g });
                    logger = [];
                });
                testing_internal_1.it('should emit one valueChange event per control', function () {
                    form.valueChanges.subscribe(function () { return logger.push('form'); });
                    g.valueChanges.subscribe(function () { return logger.push('group'); });
                    c.valueChanges.subscribe(function () { return logger.push('control1'); });
                    c2.valueChanges.subscribe(function () { return logger.push('control2'); });
                    g.patchValue({ 'one': 'one', 'two': 'two' });
                    expect(logger).toEqual(['control1', 'control2', 'group', 'form']);
                });
                testing_internal_1.it('should not emit valueChange events for skipped controls', function () {
                    form.valueChanges.subscribe(function () { return logger.push('form'); });
                    g.valueChanges.subscribe(function () { return logger.push('group'); });
                    c.valueChanges.subscribe(function () { return logger.push('control1'); });
                    c2.valueChanges.subscribe(function () { return logger.push('control2'); });
                    g.patchValue({ 'one': 'one' });
                    expect(logger).toEqual(['control1', 'group', 'form']);
                });
                testing_internal_1.it('should not fire an event when explicitly specified', testing_1.fakeAsync(function () {
                    form.valueChanges.subscribe(function (value) { throw 'Should not happen'; });
                    g.valueChanges.subscribe(function (value) { throw 'Should not happen'; });
                    c.valueChanges.subscribe(function (value) { throw 'Should not happen'; });
                    g.patchValue({ 'one': 'one', 'two': 'two' }, { emitEvent: false });
                    testing_1.tick();
                }));
                testing_internal_1.it('should emit one statusChange event per control', function () {
                    form.statusChanges.subscribe(function () { return logger.push('form'); });
                    g.statusChanges.subscribe(function () { return logger.push('group'); });
                    c.statusChanges.subscribe(function () { return logger.push('control1'); });
                    c2.statusChanges.subscribe(function () { return logger.push('control2'); });
                    g.patchValue({ 'one': 'one', 'two': 'two' });
                    expect(logger).toEqual(['control1', 'control2', 'group', 'form']);
                });
            });
        });
        testing_internal_1.describe('reset()', function () {
            var c, c2, g;
            testing_internal_1.beforeEach(function () {
                c = new forms_1.FormControl('initial value');
                c2 = new forms_1.FormControl('');
                g = new forms_1.FormGroup({ 'one': c, 'two': c2 });
            });
            testing_internal_1.it('should set its own value if value passed', function () {
                g.setValue({ 'one': 'new value', 'two': 'new value' });
                g.reset({ 'one': 'initial value', 'two': '' });
                expect(g.value).toEqual({ 'one': 'initial value', 'two': '' });
            });
            testing_internal_1.it('should set its own value if boxed value passed', function () {
                g.setValue({ 'one': 'new value', 'two': 'new value' });
                g.reset({ 'one': { value: 'initial value', disabled: false }, 'two': '' });
                expect(g.value).toEqual({ 'one': 'initial value', 'two': '' });
            });
            testing_internal_1.it('should clear its own value if no value passed', function () {
                g.setValue({ 'one': 'new value', 'two': 'new value' });
                g.reset();
                expect(g.value).toEqual({ 'one': null, 'two': null });
            });
            testing_internal_1.it('should set the value of each of its child controls if value passed', function () {
                g.setValue({ 'one': 'new value', 'two': 'new value' });
                g.reset({ 'one': 'initial value', 'two': '' });
                expect(c.value).toBe('initial value');
                expect(c2.value).toBe('');
            });
            testing_internal_1.it('should clear the value of each of its child controls if no value passed', function () {
                g.setValue({ 'one': 'new value', 'two': 'new value' });
                g.reset();
                expect(c.value).toBe(null);
                expect(c2.value).toBe(null);
            });
            testing_internal_1.it('should set the value of its parent if value passed', function () {
                var form = new forms_1.FormGroup({ 'g': g });
                g.setValue({ 'one': 'new value', 'two': 'new value' });
                g.reset({ 'one': 'initial value', 'two': '' });
                expect(form.value).toEqual({ 'g': { 'one': 'initial value', 'two': '' } });
            });
            testing_internal_1.it('should clear the value of its parent if no value passed', function () {
                var form = new forms_1.FormGroup({ 'g': g });
                g.setValue({ 'one': 'new value', 'two': 'new value' });
                g.reset();
                expect(form.value).toEqual({ 'g': { 'one': null, 'two': null } });
            });
            testing_internal_1.it('should not update the parent when explicitly specified', function () {
                var form = new forms_1.FormGroup({ 'g': g });
                g.reset({ 'one': 'new value', 'two': 'new value' }, { onlySelf: true });
                expect(form.value).toEqual({ g: { 'one': 'initial value', 'two': '' } });
            });
            testing_internal_1.it('should mark itself as pristine', function () {
                g.markAsDirty();
                expect(g.pristine).toBe(false);
                g.reset();
                expect(g.pristine).toBe(true);
            });
            testing_internal_1.it('should mark all child controls as pristine', function () {
                c.markAsDirty();
                c2.markAsDirty();
                expect(c.pristine).toBe(false);
                expect(c2.pristine).toBe(false);
                g.reset();
                expect(c.pristine).toBe(true);
                expect(c2.pristine).toBe(true);
            });
            testing_internal_1.it('should mark the parent as pristine if all siblings pristine', function () {
                var c3 = new forms_1.FormControl('');
                var form = new forms_1.FormGroup({ 'g': g, 'c3': c3 });
                g.markAsDirty();
                expect(form.pristine).toBe(false);
                g.reset();
                expect(form.pristine).toBe(true);
            });
            testing_internal_1.it('should not mark the parent pristine if any dirty siblings', function () {
                var c3 = new forms_1.FormControl('');
                var form = new forms_1.FormGroup({ 'g': g, 'c3': c3 });
                g.markAsDirty();
                c3.markAsDirty();
                expect(form.pristine).toBe(false);
                g.reset();
                expect(form.pristine).toBe(false);
            });
            testing_internal_1.it('should mark itself as untouched', function () {
                g.markAsTouched();
                expect(g.untouched).toBe(false);
                g.reset();
                expect(g.untouched).toBe(true);
            });
            testing_internal_1.it('should mark all child controls as untouched', function () {
                c.markAsTouched();
                c2.markAsTouched();
                expect(c.untouched).toBe(false);
                expect(c2.untouched).toBe(false);
                g.reset();
                expect(c.untouched).toBe(true);
                expect(c2.untouched).toBe(true);
            });
            testing_internal_1.it('should mark the parent untouched if all siblings untouched', function () {
                var c3 = new forms_1.FormControl('');
                var form = new forms_1.FormGroup({ 'g': g, 'c3': c3 });
                g.markAsTouched();
                expect(form.untouched).toBe(false);
                g.reset();
                expect(form.untouched).toBe(true);
            });
            testing_internal_1.it('should not mark the parent untouched if any touched siblings', function () {
                var c3 = new forms_1.FormControl('');
                var form = new forms_1.FormGroup({ 'g': g, 'c3': c3 });
                g.markAsTouched();
                c3.markAsTouched();
                expect(form.untouched).toBe(false);
                g.reset();
                expect(form.untouched).toBe(false);
            });
            testing_internal_1.it('should retain previous disabled state', function () {
                g.disable();
                g.reset();
                expect(g.disabled).toBe(true);
            });
            testing_internal_1.it('should set child disabled state if boxed value passed', function () {
                g.disable();
                g.reset({ 'one': { value: '', disabled: false }, 'two': '' });
                expect(c.disabled).toBe(false);
                expect(g.disabled).toBe(false);
            });
            testing_internal_1.describe('reset() events', function () {
                var form, c3, logger;
                testing_internal_1.beforeEach(function () {
                    c3 = new forms_1.FormControl('');
                    form = new forms_1.FormGroup({ 'g': g, 'c3': c3 });
                    logger = [];
                });
                testing_internal_1.it('should emit one valueChange event per reset control', function () {
                    form.valueChanges.subscribe(function () { return logger.push('form'); });
                    g.valueChanges.subscribe(function () { return logger.push('group'); });
                    c.valueChanges.subscribe(function () { return logger.push('control1'); });
                    c2.valueChanges.subscribe(function () { return logger.push('control2'); });
                    c3.valueChanges.subscribe(function () { return logger.push('control3'); });
                    g.reset();
                    expect(logger).toEqual(['control1', 'control2', 'group', 'form']);
                });
                testing_internal_1.it('should not fire an event when explicitly specified', testing_1.fakeAsync(function () {
                    form.valueChanges.subscribe(function (value) { throw 'Should not happen'; });
                    g.valueChanges.subscribe(function (value) { throw 'Should not happen'; });
                    c.valueChanges.subscribe(function (value) { throw 'Should not happen'; });
                    g.reset({}, { emitEvent: false });
                    testing_1.tick();
                }));
                testing_internal_1.it('should emit one statusChange event per reset control', function () {
                    form.statusChanges.subscribe(function () { return logger.push('form'); });
                    g.statusChanges.subscribe(function () { return logger.push('group'); });
                    c.statusChanges.subscribe(function () { return logger.push('control1'); });
                    c2.statusChanges.subscribe(function () { return logger.push('control2'); });
                    c3.statusChanges.subscribe(function () { return logger.push('control3'); });
                    g.reset();
                    expect(logger).toEqual(['control1', 'control2', 'group', 'form']);
                });
                testing_internal_1.it('should emit one statusChange event per reset control', function () {
                    form.statusChanges.subscribe(function () { return logger.push('form'); });
                    g.statusChanges.subscribe(function () { return logger.push('group'); });
                    c.statusChanges.subscribe(function () { return logger.push('control1'); });
                    c2.statusChanges.subscribe(function () { return logger.push('control2'); });
                    c3.statusChanges.subscribe(function () { return logger.push('control3'); });
                    g.reset({ 'one': { value: '', disabled: true } });
                    expect(logger).toEqual(['control1', 'control2', 'group', 'form']);
                });
            });
        });
        testing_internal_1.describe('contains', function () {
            var group;
            testing_internal_1.beforeEach(function () {
                group = new forms_1.FormGroup({
                    'required': new forms_1.FormControl('requiredValue'),
                    'optional': new forms_1.FormControl({ value: 'disabled value', disabled: true })
                });
            });
            testing_internal_1.it('should return false when the component is disabled', function () { expect(group.contains('optional')).toEqual(false); });
            testing_internal_1.it('should return false when there is no component with the given name', function () { expect(group.contains('something else')).toEqual(false); });
            testing_internal_1.it('should return true when the component is enabled', function () {
                expect(group.contains('required')).toEqual(true);
                group.enable();
                expect(group.contains('optional')).toEqual(true);
            });
            testing_internal_1.it('should support controls with dots in their name', function () {
                expect(group.contains('some.name')).toBe(false);
                group.addControl('some.name', new forms_1.FormControl());
                expect(group.contains('some.name')).toBe(true);
            });
        });
        testing_internal_1.describe('retrieve', function () {
            var group;
            testing_internal_1.beforeEach(function () {
                group = new forms_1.FormGroup({
                    'required': new forms_1.FormControl('requiredValue'),
                });
            });
            testing_internal_1.it('should not get inherited properties', function () { expect(group.get('constructor')).toBe(null); });
        });
        testing_internal_1.describe('statusChanges', function () {
            var control;
            var group;
            testing_internal_1.beforeEach(testing_1.async(function () {
                control = new forms_1.FormControl('', asyncValidatorReturningObservable);
                group = new forms_1.FormGroup({ 'one': control });
            }));
            // TODO(kara): update these tests to use fake Async
            testing_internal_1.it('should fire a statusChange if child has async validation change', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var loggedValues = [];
                group.statusChanges.subscribe({
                    next: function (status) {
                        loggedValues.push(status);
                        if (loggedValues.length === 2) {
                            expect(loggedValues).toEqual(['PENDING', 'INVALID']);
                        }
                        async.done();
                    }
                });
                control.setValue('');
            }));
        });
        testing_internal_1.describe('getError', function () {
            testing_internal_1.it('should return the error when it is present', function () {
                var c = new forms_1.FormControl('', forms_1.Validators.required);
                var g = new forms_1.FormGroup({ 'one': c });
                expect(c.getError('required')).toEqual(true);
                expect(g.getError('required', ['one'])).toEqual(true);
            });
            testing_internal_1.it('should return null otherwise', function () {
                var c = new forms_1.FormControl('not empty', forms_1.Validators.required);
                var g = new forms_1.FormGroup({ 'one': c });
                expect(c.getError('invalid')).toEqual(null);
                expect(g.getError('required', ['one'])).toEqual(null);
                expect(g.getError('required', ['invalid'])).toEqual(null);
            });
        });
        testing_internal_1.describe('validator', function () {
            function containsValidator(c) {
                return c.get('one').value && c.get('one').value.indexOf('c') !== -1 ? null :
                    { 'missing': true };
            }
            testing_internal_1.it('should run a single validator when the value changes', function () {
                var c = new forms_1.FormControl(null);
                var g = new forms_1.FormGroup({ 'one': c }, simpleValidator);
                c.setValue('correct');
                expect(g.valid).toEqual(true);
                expect(g.errors).toEqual(null);
                c.setValue('incorrect');
                expect(g.valid).toEqual(false);
                expect(g.errors).toEqual({ 'broken': true });
            });
            testing_internal_1.it('should support multiple validators from array', function () {
                var g = new forms_1.FormGroup({ one: new forms_1.FormControl() }, [simpleValidator, containsValidator]);
                expect(g.valid).toEqual(false);
                expect(g.errors).toEqual({ missing: true, broken: true });
                g.setValue({ one: 'c' });
                expect(g.valid).toEqual(false);
                expect(g.errors).toEqual({ broken: true });
                g.setValue({ one: 'correct' });
                expect(g.valid).toEqual(true);
            });
            testing_internal_1.it('should set single validator from options obj', function () {
                var g = new forms_1.FormGroup({ one: new forms_1.FormControl() }, { validators: simpleValidator });
                expect(g.valid).toEqual(false);
                expect(g.errors).toEqual({ broken: true });
                g.setValue({ one: 'correct' });
                expect(g.valid).toEqual(true);
            });
            testing_internal_1.it('should set multiple validators from options obj', function () {
                var g = new forms_1.FormGroup({ one: new forms_1.FormControl() }, { validators: [simpleValidator, containsValidator] });
                expect(g.valid).toEqual(false);
                expect(g.errors).toEqual({ missing: true, broken: true });
                g.setValue({ one: 'c' });
                expect(g.valid).toEqual(false);
                expect(g.errors).toEqual({ broken: true });
                g.setValue({ one: 'correct' });
                expect(g.valid).toEqual(true);
            });
        });
        testing_internal_1.describe('asyncValidator', function () {
            testing_internal_1.it('should run the async validator', testing_1.fakeAsync(function () {
                var c = new forms_1.FormControl('value');
                var g = new forms_1.FormGroup({ 'one': c }, null, asyncValidator('expected'));
                expect(g.pending).toEqual(true);
                testing_1.tick(1);
                expect(g.errors).toEqual({ 'async': true });
                expect(g.pending).toEqual(false);
            }));
            testing_internal_1.it('should set multiple async validators from array', testing_1.fakeAsync(function () {
                var g = new forms_1.FormGroup({ 'one': new forms_1.FormControl('value') }, null, [asyncValidator('expected'), otherObservableValidator]);
                expect(g.pending).toEqual(true);
                testing_1.tick();
                expect(g.errors).toEqual({ 'async': true, 'other': true });
                expect(g.pending).toEqual(false);
            }));
            testing_internal_1.it('should set single async validator from options obj', testing_1.fakeAsync(function () {
                var g = new forms_1.FormGroup({ 'one': new forms_1.FormControl('value') }, { asyncValidators: asyncValidator('expected') });
                expect(g.pending).toEqual(true);
                testing_1.tick();
                expect(g.errors).toEqual({ 'async': true });
                expect(g.pending).toEqual(false);
            }));
            testing_internal_1.it('should set multiple async validators from options obj', testing_1.fakeAsync(function () {
                var g = new forms_1.FormGroup({ 'one': new forms_1.FormControl('value') }, { asyncValidators: [asyncValidator('expected'), otherObservableValidator] });
                expect(g.pending).toEqual(true);
                testing_1.tick();
                expect(g.errors).toEqual({ 'async': true, 'other': true });
                expect(g.pending).toEqual(false);
            }));
            testing_internal_1.it('should set the parent group\'s status to pending', testing_1.fakeAsync(function () {
                var c = new forms_1.FormControl('value', null, asyncValidator('expected'));
                var g = new forms_1.FormGroup({ 'one': c });
                expect(g.pending).toEqual(true);
                testing_1.tick(1);
                expect(g.pending).toEqual(false);
            }));
            testing_internal_1.it('should run the parent group\'s async validator when children are pending', testing_1.fakeAsync(function () {
                var c = new forms_1.FormControl('value', null, asyncValidator('expected'));
                var g = new forms_1.FormGroup({ 'one': c }, null, asyncValidator('expected'));
                testing_1.tick(1);
                expect(g.errors).toEqual({ 'async': true });
                expect(g.get('one').errors).toEqual({ 'async': true });
            }));
        });
        testing_internal_1.describe('disable() & enable()', function () {
            testing_internal_1.it('should mark the group as disabled', function () {
                var g = new forms_1.FormGroup({ 'one': new forms_1.FormControl(null) });
                expect(g.disabled).toBe(false);
                expect(g.valid).toBe(true);
                g.disable();
                expect(g.disabled).toBe(true);
                expect(g.valid).toBe(false);
                g.enable();
                expect(g.disabled).toBe(false);
                expect(g.valid).toBe(true);
            });
            testing_internal_1.it('should set the group status as disabled', function () {
                var g = new forms_1.FormGroup({ 'one': new forms_1.FormControl(null) });
                expect(g.status).toEqual('VALID');
                g.disable();
                expect(g.status).toEqual('DISABLED');
                g.enable();
                expect(g.status).toBe('VALID');
            });
            testing_internal_1.it('should mark children of the group as disabled', function () {
                var c1 = new forms_1.FormControl(null);
                var c2 = new forms_1.FormControl(null);
                var g = new forms_1.FormGroup({ 'one': c1, 'two': c2 });
                expect(c1.disabled).toBe(false);
                expect(c2.disabled).toBe(false);
                g.disable();
                expect(c1.disabled).toBe(true);
                expect(c2.disabled).toBe(true);
                g.enable();
                expect(c1.disabled).toBe(false);
                expect(c2.disabled).toBe(false);
            });
            testing_internal_1.it('should ignore disabled controls in validation', function () {
                var g = new forms_1.FormGroup({
                    nested: new forms_1.FormGroup({ one: new forms_1.FormControl(null, forms_1.Validators.required) }),
                    two: new forms_1.FormControl('two')
                });
                expect(g.valid).toBe(false);
                g.get('nested').disable();
                expect(g.valid).toBe(true);
                g.get('nested').enable();
                expect(g.valid).toBe(false);
            });
            testing_internal_1.it('should ignore disabled controls when serializing value', function () {
                var g = new forms_1.FormGroup({ nested: new forms_1.FormGroup({ one: new forms_1.FormControl('one') }), two: new forms_1.FormControl('two') });
                expect(g.value).toEqual({ 'nested': { 'one': 'one' }, 'two': 'two' });
                g.get('nested').disable();
                expect(g.value).toEqual({ 'two': 'two' });
                g.get('nested').enable();
                expect(g.value).toEqual({ 'nested': { 'one': 'one' }, 'two': 'two' });
            });
            testing_internal_1.it('should update its value when disabled with disabled children', function () {
                var g = new forms_1.FormGroup({ nested: new forms_1.FormGroup({ one: new forms_1.FormControl('one'), two: new forms_1.FormControl('two') }) });
                g.get('nested.two').disable();
                expect(g.value).toEqual({ nested: { one: 'one' } });
                g.get('nested').disable();
                expect(g.value).toEqual({ nested: { one: 'one', two: 'two' } });
                g.get('nested').enable();
                expect(g.value).toEqual({ nested: { one: 'one', two: 'two' } });
            });
            testing_internal_1.it('should update its value when enabled with disabled children', function () {
                var g = new forms_1.FormGroup({ nested: new forms_1.FormGroup({ one: new forms_1.FormControl('one'), two: new forms_1.FormControl('two') }) });
                g.get('nested.two').disable();
                expect(g.value).toEqual({ nested: { one: 'one' } });
                g.get('nested').enable();
                expect(g.value).toEqual({ nested: { one: 'one', two: 'two' } });
            });
            testing_internal_1.it('should ignore disabled controls when determining dirtiness', function () {
                var g = new forms_1.FormGroup({ nested: new forms_1.FormGroup({ one: new forms_1.FormControl('one') }), two: new forms_1.FormControl('two') });
                g.get('nested.one').markAsDirty();
                expect(g.dirty).toBe(true);
                g.get('nested').disable();
                expect(g.get('nested').dirty).toBe(true);
                expect(g.dirty).toEqual(false);
                g.get('nested').enable();
                expect(g.dirty).toEqual(true);
            });
            testing_internal_1.it('should ignore disabled controls when determining touched state', function () {
                var g = new forms_1.FormGroup({ nested: new forms_1.FormGroup({ one: new forms_1.FormControl('one') }), two: new forms_1.FormControl('two') });
                g.get('nested.one').markAsTouched();
                expect(g.touched).toBe(true);
                g.get('nested').disable();
                expect(g.get('nested').touched).toBe(true);
                expect(g.touched).toEqual(false);
                g.get('nested').enable();
                expect(g.touched).toEqual(true);
            });
            testing_internal_1.it('should keep empty, disabled groups disabled when updating validity', function () {
                var group = new forms_1.FormGroup({});
                expect(group.status).toEqual('VALID');
                group.disable();
                expect(group.status).toEqual('DISABLED');
                group.updateValueAndValidity();
                expect(group.status).toEqual('DISABLED');
                group.addControl('one', new forms_1.FormControl({ value: '', disabled: true }));
                expect(group.status).toEqual('DISABLED');
                group.addControl('two', new forms_1.FormControl());
                expect(group.status).toEqual('VALID');
            });
            testing_internal_1.it('should re-enable empty, disabled groups', function () {
                var group = new forms_1.FormGroup({});
                group.disable();
                expect(group.status).toEqual('DISABLED');
                group.enable();
                expect(group.status).toEqual('VALID');
            });
            testing_internal_1.it('should not run validators on disabled controls', function () {
                var validator = jasmine.createSpy('validator');
                var g = new forms_1.FormGroup({ 'one': new forms_1.FormControl() }, validator);
                expect(validator.calls.count()).toEqual(1);
                g.disable();
                expect(validator.calls.count()).toEqual(1);
                g.setValue({ one: 'value' });
                expect(validator.calls.count()).toEqual(1);
                g.enable();
                expect(validator.calls.count()).toEqual(2);
            });
            testing_internal_1.describe('disabled errors', function () {
                testing_internal_1.it('should clear out group errors when disabled', function () {
                    var g = new forms_1.FormGroup({ 'one': new forms_1.FormControl() }, function () { return ({ 'expected': true }); });
                    expect(g.errors).toEqual({ 'expected': true });
                    g.disable();
                    expect(g.errors).toEqual(null);
                    g.enable();
                    expect(g.errors).toEqual({ 'expected': true });
                });
                testing_internal_1.it('should re-populate group errors when enabled from a child', function () {
                    var g = new forms_1.FormGroup({ 'one': new forms_1.FormControl() }, function () { return ({ 'expected': true }); });
                    g.disable();
                    expect(g.errors).toEqual(null);
                    g.addControl('two', new forms_1.FormControl());
                    expect(g.errors).toEqual({ 'expected': true });
                });
                testing_internal_1.it('should clear out async group errors when disabled', testing_1.fakeAsync(function () {
                    var g = new forms_1.FormGroup({ 'one': new forms_1.FormControl() }, null, asyncValidator('expected'));
                    testing_1.tick();
                    expect(g.errors).toEqual({ 'async': true });
                    g.disable();
                    expect(g.errors).toEqual(null);
                    g.enable();
                    testing_1.tick();
                    expect(g.errors).toEqual({ 'async': true });
                }));
                testing_internal_1.it('should re-populate async group errors when enabled from a child', testing_1.fakeAsync(function () {
                    var g = new forms_1.FormGroup({ 'one': new forms_1.FormControl() }, null, asyncValidator('expected'));
                    testing_1.tick();
                    expect(g.errors).toEqual({ 'async': true });
                    g.disable();
                    expect(g.errors).toEqual(null);
                    g.addControl('two', new forms_1.FormControl());
                    testing_1.tick();
                    expect(g.errors).toEqual({ 'async': true });
                }));
            });
            testing_internal_1.describe('disabled events', function () {
                var logger;
                var c;
                var g;
                var form;
                testing_internal_1.beforeEach(function () {
                    logger = [];
                    c = new forms_1.FormControl('', forms_1.Validators.required);
                    g = new forms_1.FormGroup({ one: c });
                    form = new forms_1.FormGroup({ g: g });
                });
                testing_internal_1.it('should emit value change events in the right order', function () {
                    c.valueChanges.subscribe(function () { return logger.push('control'); });
                    g.valueChanges.subscribe(function () { return logger.push('group'); });
                    form.valueChanges.subscribe(function () { return logger.push('form'); });
                    g.disable();
                    expect(logger).toEqual(['control', 'group', 'form']);
                });
                testing_internal_1.it('should emit status change events in the right order', function () {
                    c.statusChanges.subscribe(function () { return logger.push('control'); });
                    g.statusChanges.subscribe(function () { return logger.push('group'); });
                    form.statusChanges.subscribe(function () { return logger.push('form'); });
                    g.disable();
                    expect(logger).toEqual(['control', 'group', 'form']);
                });
                testing_internal_1.it('should not emit value change events when emitEvent = false', function () {
                    c.valueChanges.subscribe(function () { return logger.push('control'); });
                    g.valueChanges.subscribe(function () { return logger.push('group'); });
                    form.valueChanges.subscribe(function () { return logger.push('form'); });
                    g.disable({ emitEvent: false });
                    expect(logger).toEqual([]);
                    g.enable({ emitEvent: false });
                    expect(logger).toEqual([]);
                });
                testing_internal_1.it('should not emit status change events when emitEvent = false', function () {
                    c.statusChanges.subscribe(function () { return logger.push('control'); });
                    g.statusChanges.subscribe(function () { return logger.push('group'); });
                    form.statusChanges.subscribe(function () { return logger.push('form'); });
                    g.disable({ emitEvent: false });
                    expect(logger).toEqual([]);
                    g.enable({ emitEvent: false });
                    expect(logger).toEqual([]);
                });
            });
        });
        testing_internal_1.describe('updateTreeValidity()', function () {
            var c, c2, c3;
            var nested, form;
            var logger;
            testing_internal_1.beforeEach(function () {
                c = new forms_1.FormControl('one');
                c2 = new forms_1.FormControl('two');
                c3 = new forms_1.FormControl('three');
                nested = new forms_1.FormGroup({ one: c, two: c2 });
                form = new forms_1.FormGroup({ nested: nested, three: c3 });
                logger = [];
                c.statusChanges.subscribe(function () { return logger.push('one'); });
                c2.statusChanges.subscribe(function () { return logger.push('two'); });
                c3.statusChanges.subscribe(function () { return logger.push('three'); });
                nested.statusChanges.subscribe(function () { return logger.push('nested'); });
                form.statusChanges.subscribe(function () { return logger.push('form'); });
            });
            testing_internal_1.it('should update tree validity', function () {
                form._updateTreeValidity();
                expect(logger).toEqual(['one', 'two', 'nested', 'three', 'form']);
            });
            testing_internal_1.it('should not emit events when turned off', function () {
                form._updateTreeValidity({ emitEvent: false });
                expect(logger).toEqual([]);
            });
        });
        testing_internal_1.describe('setControl()', function () {
            var c;
            var g;
            testing_internal_1.beforeEach(function () {
                c = new forms_1.FormControl('one');
                g = new forms_1.FormGroup({ one: c });
            });
            testing_internal_1.it('should replace existing control with new control', function () {
                var c2 = new forms_1.FormControl('new!', forms_1.Validators.minLength(10));
                g.setControl('one', c2);
                expect(g.controls['one']).toEqual(c2);
                expect(g.value).toEqual({ one: 'new!' });
                expect(g.valid).toBe(false);
            });
            testing_internal_1.it('should add control if control did not exist before', function () {
                var c2 = new forms_1.FormControl('new!', forms_1.Validators.minLength(10));
                g.setControl('two', c2);
                expect(g.controls['two']).toEqual(c2);
                expect(g.value).toEqual({ one: 'one', two: 'new!' });
                expect(g.valid).toBe(false);
            });
            testing_internal_1.it('should remove control if new control is null', function () {
                g.setControl('one', null);
                expect(g.controls['one']).not.toBeDefined();
                expect(g.value).toEqual({});
            });
            testing_internal_1.it('should only emit value change event once', function () {
                var logger = [];
                var c2 = new forms_1.FormControl('new!');
                g.valueChanges.subscribe(function () { return logger.push('change!'); });
                g.setControl('one', c2);
                expect(logger).toEqual(['change!']);
            });
        });
        testing_internal_1.describe('pending', function () {
            var c;
            var g;
            testing_internal_1.beforeEach(function () {
                c = new forms_1.FormControl('value');
                g = new forms_1.FormGroup({ 'one': c });
            });
            testing_internal_1.it('should be false after creating a control', function () { expect(g.pending).toEqual(false); });
            testing_internal_1.it('should be true after changing the value of the control', function () {
                c.markAsPending();
                expect(g.pending).toEqual(true);
            });
            testing_internal_1.it('should not update the parent when onlySelf = true', function () {
                c.markAsPending({ onlySelf: true });
                expect(g.pending).toEqual(false);
            });
            testing_internal_1.describe('status change events', function () {
                var logger;
                testing_internal_1.beforeEach(function () {
                    logger = [];
                    g.statusChanges.subscribe(function (status) { return logger.push(status); });
                });
                testing_internal_1.it('should emit event after marking control as pending', function () {
                    c.markAsPending();
                    expect(logger).toEqual(['PENDING']);
                });
                testing_internal_1.it('should not emit event when onlySelf = true', function () {
                    c.markAsPending({ onlySelf: true });
                    expect(logger).toEqual([]);
                });
                testing_internal_1.it('should not emit event when emitEvent = false', function () {
                    c.markAsPending({ emitEvent: false });
                    expect(logger).toEqual([]);
                });
                testing_internal_1.it('should emit event when parent is markedAsPending', function () {
                    g.markAsPending();
                    expect(logger).toEqual(['PENDING']);
                });
            });
        });
    });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9ncm91cF9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvdGVzdC9mb3JtX2dyb3VwX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxzQ0FBMkM7QUFDM0MsaURBQTZEO0FBQzdELCtFQUFnSDtBQUNoSCx3Q0FBZ0g7QUFDaEgsNkJBQXlCO0FBR3pCLENBQUM7SUFDQyx5QkFBeUIsQ0FBa0I7UUFDekMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBRyxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUM7SUFDdEUsQ0FBQztJQUVELHdCQUF3QixRQUFnQixFQUFFLFFBQWE7UUFBYix5QkFBQSxFQUFBLGFBQWE7UUFDckQsT0FBTyxVQUFDLENBQWtCO1lBQ3hCLElBQUksT0FBTyxHQUEwQixTQUFXLENBQUM7WUFDakQsSUFBTSxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBQSxHQUFHLElBQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZELElBQU0sQ0FBQyxHQUFJLFFBQWdCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUUsUUFBZ0IsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5RSxJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBQyxPQUFPLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUV6RCxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ2Q7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