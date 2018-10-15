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
var model_1 = require("@angular/forms/src/model");
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
    function asyncValidatorReturningObservable(c) {
        var e = new core_1.EventEmitter();
        Promise.resolve(null).then(function () { e.emit({ 'async': true }); });
        return e;
    }
    function otherAsyncValidator() { return Promise.resolve({ 'other': true }); }
    function syncValidator(_ /** TODO #9100 */) { return null; }
    testing_internal_1.describe('FormControl', function () {
        testing_internal_1.it('should default the value to null', function () {
            var c = new forms_1.FormControl();
            expect(c.value).toBe(null);
        });
        testing_internal_1.describe('boxed values', function () {
            testing_internal_1.it('should support valid boxed values on creation', function () {
                var c = new forms_1.FormControl({ value: 'some val', disabled: true }, null, null);
                expect(c.disabled).toBe(true);
                expect(c.value).toBe('some val');
                expect(c.status).toBe('DISABLED');
            });
            testing_internal_1.it('should honor boxed value with disabled control when validating', function () {
                var c = new forms_1.FormControl({ value: '', disabled: true }, forms_1.Validators.required);
                expect(c.disabled).toBe(true);
                expect(c.valid).toBe(false);
                expect(c.status).toBe('DISABLED');
            });
            testing_internal_1.it('should not treat objects as boxed values if they have more than two props', function () {
                var c = new forms_1.FormControl({ value: '', disabled: true, test: 'test' }, null, null);
                expect(c.value).toEqual({ value: '', disabled: true, test: 'test' });
                expect(c.disabled).toBe(false);
            });
            testing_internal_1.it('should not treat objects as boxed values if disabled is missing', function () {
                var c = new forms_1.FormControl({ value: '', test: 'test' }, null, null);
                expect(c.value).toEqual({ value: '', test: 'test' });
                expect(c.disabled).toBe(false);
            });
        });
        testing_internal_1.describe('updateOn', function () {
            testing_internal_1.it('should default to on change', function () {
                var c = new forms_1.FormControl('');
                expect(c.updateOn).toEqual('change');
            });
            testing_internal_1.it('should default to on change with an options obj', function () {
                var c = new forms_1.FormControl('', { validators: forms_1.Validators.required });
                expect(c.updateOn).toEqual('change');
            });
            testing_internal_1.it('should set updateOn when updating on blur', function () {
                var c = new forms_1.FormControl('', { updateOn: 'blur' });
                expect(c.updateOn).toEqual('blur');
            });
            testing_internal_1.describe('in groups and arrays', function () {
                testing_internal_1.it('should default to group updateOn when not set in control', function () {
                    var g = new forms_1.FormGroup({ one: new forms_1.FormControl(), two: new forms_1.FormControl() }, { updateOn: 'blur' });
                    expect(g.get('one').updateOn).toEqual('blur');
                    expect(g.get('two').updateOn).toEqual('blur');
                });
                testing_internal_1.it('should default to array updateOn when not set in control', function () {
                    var a = new model_1.FormArray([new forms_1.FormControl(), new forms_1.FormControl()], { updateOn: 'blur' });
                    expect(a.get([0]).updateOn).toEqual('blur');
                    expect(a.get([1]).updateOn).toEqual('blur');
                });
                testing_internal_1.it('should set updateOn with nested groups', function () {
                    var g = new forms_1.FormGroup({
                        group: new forms_1.FormGroup({ one: new forms_1.FormControl(), two: new forms_1.FormControl() }),
                    }, { updateOn: 'blur' });
                    expect(g.get('group.one').updateOn).toEqual('blur');
                    expect(g.get('group.two').updateOn).toEqual('blur');
                    expect(g.get('group').updateOn).toEqual('blur');
                });
                testing_internal_1.it('should set updateOn with nested arrays', function () {
                    var g = new forms_1.FormGroup({
                        arr: new model_1.FormArray([new forms_1.FormControl(), new forms_1.FormControl()]),
                    }, { updateOn: 'blur' });
                    expect(g.get(['arr', 0]).updateOn).toEqual('blur');
                    expect(g.get(['arr', 1]).updateOn).toEqual('blur');
                    expect(g.get('arr').updateOn).toEqual('blur');
                });
                testing_internal_1.it('should allow control updateOn to override group updateOn', function () {
                    var g = new forms_1.FormGroup({ one: new forms_1.FormControl('', { updateOn: 'change' }), two: new forms_1.FormControl() }, { updateOn: 'blur' });
                    expect(g.get('one').updateOn).toEqual('change');
                    expect(g.get('two').updateOn).toEqual('blur');
                });
                testing_internal_1.it('should set updateOn with complex setup', function () {
                    var g = new forms_1.FormGroup({
                        group: new forms_1.FormGroup({ one: new forms_1.FormControl('', { updateOn: 'change' }), two: new forms_1.FormControl() }, { updateOn: 'blur' }),
                        groupTwo: new forms_1.FormGroup({ one: new forms_1.FormControl() }, { updateOn: 'submit' }),
                        three: new forms_1.FormControl()
                    });
                    expect(g.get('group.one').updateOn).toEqual('change');
                    expect(g.get('group.two').updateOn).toEqual('blur');
                    expect(g.get('groupTwo.one').updateOn).toEqual('submit');
                    expect(g.get('three').updateOn).toEqual('change');
                });
            });
        });
        testing_internal_1.describe('validator', function () {
            testing_internal_1.it('should run validator with the initial value', function () {
                var c = new forms_1.FormControl('value', forms_1.Validators.required);
                expect(c.valid).toEqual(true);
            });
            testing_internal_1.it('should rerun the validator when the value changes', function () {
                var c = new forms_1.FormControl('value', forms_1.Validators.required);
                c.setValue(null);
                expect(c.valid).toEqual(false);
            });
            testing_internal_1.it('should support arrays of validator functions if passed', function () {
                var c = new forms_1.FormControl('value', [forms_1.Validators.required, forms_1.Validators.minLength(3)]);
                c.setValue('a');
                expect(c.valid).toEqual(false);
                c.setValue('aaa');
                expect(c.valid).toEqual(true);
            });
            testing_internal_1.it('should support single validator from options obj', function () {
                var c = new forms_1.FormControl(null, { validators: forms_1.Validators.required });
                expect(c.valid).toEqual(false);
                expect(c.errors).toEqual({ required: true });
                c.setValue('value');
                expect(c.valid).toEqual(true);
            });
            testing_internal_1.it('should support multiple validators from options obj', function () {
                var c = new forms_1.FormControl(null, { validators: [forms_1.Validators.required, forms_1.Validators.minLength(3)] });
                expect(c.valid).toEqual(false);
                expect(c.errors).toEqual({ required: true });
                c.setValue('aa');
                expect(c.valid).toEqual(false);
                expect(c.errors).toEqual({ minlength: { requiredLength: 3, actualLength: 2 } });
                c.setValue('aaa');
                expect(c.valid).toEqual(true);
            });
            testing_internal_1.it('should support a null validators value', function () {
                var c = new forms_1.FormControl(null, { validators: null });
                expect(c.valid).toEqual(true);
            });
            testing_internal_1.it('should support an empty options obj', function () {
                var c = new forms_1.FormControl(null, {});
                expect(c.valid).toEqual(true);
            });
            testing_internal_1.it('should return errors', function () {
                var c = new forms_1.FormControl(null, forms_1.Validators.required);
                expect(c.errors).toEqual({ 'required': true });
            });
            testing_internal_1.it('should set single validator', function () {
                var c = new forms_1.FormControl(null);
                expect(c.valid).toEqual(true);
                c.setValidators(forms_1.Validators.required);
                c.setValue(null);
                expect(c.valid).toEqual(false);
                c.setValue('abc');
                expect(c.valid).toEqual(true);
            });
            testing_internal_1.it('should set multiple validators from array', function () {
                var c = new forms_1.FormControl('');
                expect(c.valid).toEqual(true);
                c.setValidators([forms_1.Validators.minLength(5), forms_1.Validators.required]);
                c.setValue('');
                expect(c.valid).toEqual(false);
                c.setValue('abc');
                expect(c.valid).toEqual(false);
                c.setValue('abcde');
                expect(c.valid).toEqual(true);
            });
            testing_internal_1.it('should clear validators', function () {
                var c = new forms_1.FormControl('', forms_1.Validators.required);
                expect(c.valid).toEqual(false);
                c.clearValidators();
                expect(c.validator).toEqual(null);
                c.setValue('');
                expect(c.valid).toEqual(true);
            });
            testing_internal_1.it('should add after clearing', function () {
                var c = new forms_1.FormControl('', forms_1.Validators.required);
                expect(c.valid).toEqual(false);
                c.clearValidators();
                expect(c.validator).toEqual(null);
                c.setValidators([forms_1.Validators.required]);
                expect(c.validator).not.toBe(null);
            });
        });
        testing_internal_1.describe('asyncValidator', function () {
            testing_internal_1.it('should run validator with the initial value', testing_1.fakeAsync(function () {
                var c = new forms_1.FormControl('value', null, asyncValidator('expected'));
                testing_1.tick();
                expect(c.valid).toEqual(false);
                expect(c.errors).toEqual({ 'async': true });
            }));
            testing_internal_1.it('should support validators returning observables', testing_1.fakeAsync(function () {
                var c = new forms_1.FormControl('value', null, asyncValidatorReturningObservable);
                testing_1.tick();
                expect(c.valid).toEqual(false);
                expect(c.errors).toEqual({ 'async': true });
            }));
            testing_internal_1.it('should rerun the validator when the value changes', testing_1.fakeAsync(function () {
                var c = new forms_1.FormControl('value', null, asyncValidator('expected'));
                c.setValue('expected');
                testing_1.tick();
                expect(c.valid).toEqual(true);
            }));
            testing_internal_1.it('should run the async validator only when the sync validator passes', testing_1.fakeAsync(function () {
                var c = new forms_1.FormControl('', forms_1.Validators.required, asyncValidator('expected'));
                testing_1.tick();
                expect(c.errors).toEqual({ 'required': true });
                c.setValue('some value');
                testing_1.tick();
                expect(c.errors).toEqual({ 'async': true });
            }));
            testing_internal_1.it('should mark the control as pending while running the async validation', testing_1.fakeAsync(function () {
                var c = new forms_1.FormControl('', null, asyncValidator('expected'));
                expect(c.pending).toEqual(true);
                testing_1.tick();
                expect(c.pending).toEqual(false);
            }));
            testing_internal_1.it('should only use the latest async validation run', testing_1.fakeAsync(function () {
                var c = new forms_1.FormControl('', null, asyncValidator('expected', { 'long': 200, 'expected': 100 }));
                c.setValue('long');
                c.setValue('expected');
                testing_1.tick(300);
                expect(c.valid).toEqual(true);
            }));
            testing_internal_1.it('should support arrays of async validator functions if passed', testing_1.fakeAsync(function () {
                var c = new forms_1.FormControl('value', null, [asyncValidator('expected'), otherAsyncValidator]);
                testing_1.tick();
                expect(c.errors).toEqual({ 'async': true, 'other': true });
            }));
            testing_internal_1.it('should support a single async validator from options obj', testing_1.fakeAsync(function () {
                var c = new forms_1.FormControl('value', { asyncValidators: asyncValidator('expected') });
                expect(c.pending).toEqual(true);
                testing_1.tick();
                expect(c.valid).toEqual(false);
                expect(c.errors).toEqual({ 'async': true });
            }));
            testing_internal_1.it('should support multiple async validators from options obj', testing_1.fakeAsync(function () {
                var c = new forms_1.FormControl('value', { asyncValidators: [asyncValidator('expected'), otherAsyncValidator] });
                expect(c.pending).toEqual(true);
                testing_1.tick();
                expect(c.valid).toEqual(false);
                expect(c.errors).toEqual({ 'async': true, 'other': true });
            }));
            testing_internal_1.it('should support a mix of validators from options obj', testing_1.fakeAsync(function () {
                var c = new forms_1.FormControl('', { validators: forms_1.Validators.required, asyncValidators: asyncValidator('expected') });
                testing_1.tick();
                expect(c.errors).toEqual({ required: true });
                c.setValue('value');
                expect(c.pending).toBe(true);
                testing_1.tick();
                expect(c.valid).toEqual(false);
                expect(c.errors).toEqual({ 'async': true });
            }));
            testing_internal_1.it('should add single async validator', testing_1.fakeAsync(function () {
                var c = new forms_1.FormControl('value', null);
                c.setAsyncValidators(asyncValidator('expected'));
                expect(c.asyncValidator).not.toEqual(null);
                c.setValue('expected');
                testing_1.tick();
                expect(c.valid).toEqual(true);
            }));
            testing_internal_1.it('should add async validator from array', testing_1.fakeAsync(function () {
                var c = new forms_1.FormControl('value', null);
                c.setAsyncValidators([asyncValidator('expected')]);
                expect(c.asyncValidator).not.toEqual(null);
                c.setValue('expected');
                testing_1.tick();
                expect(c.valid).toEqual(true);
            }));
            testing_internal_1.it('should clear async validators', testing_1.fakeAsync(function () {
                var c = new forms_1.FormControl('value', [asyncValidator('expected'), otherAsyncValidator]);
                c.clearValidators();
                expect(c.asyncValidator).toEqual(null);
            }));
            testing_internal_1.it('should not change validity state if control is disabled while async validating', testing_1.fakeAsync(function () {
                var c = new forms_1.FormControl('value', [asyncValidator('expected')]);
                c.disable();
                testing_1.tick();
                expect(c.status).toEqual('DISABLED');
            }));
        });
        testing_internal_1.describe('dirty', function () {
            testing_internal_1.it('should be false after creating a control', function () {
                var c = new forms_1.FormControl('value');
                expect(c.dirty).toEqual(false);
            });
            testing_internal_1.it('should be true after changing the value of the control', function () {
                var c = new forms_1.FormControl('value');
                c.markAsDirty();
                expect(c.dirty).toEqual(true);
            });
        });
        testing_internal_1.describe('touched', function () {
            testing_internal_1.it('should be false after creating a control', function () {
                var c = new forms_1.FormControl('value');
                expect(c.touched).toEqual(false);
            });
            testing_internal_1.it('should be true after markAsTouched runs', function () {
                var c = new forms_1.FormControl('value');
                c.markAsTouched();
                expect(c.touched).toEqual(true);
            });
        });
        testing_internal_1.describe('setValue', function () {
            var g, c;
            testing_internal_1.beforeEach(function () {
                c = new forms_1.FormControl('oldValue');
                g = new forms_1.FormGroup({ 'one': c });
            });
            testing_internal_1.it('should set the value of the control', function () {
                c.setValue('newValue');
                expect(c.value).toEqual('newValue');
            });
            testing_internal_1.it('should invoke ngOnChanges if it is present', function () {
                var ngOnChanges;
                c.registerOnChange(function (v) { return ngOnChanges = ['invoked', v]; });
                c.setValue('newValue');
                expect(ngOnChanges).toEqual(['invoked', 'newValue']);
            });
            testing_internal_1.it('should not invoke on change when explicitly specified', function () {
                var onChange = null;
                c.registerOnChange(function (v) { return onChange = ['invoked', v]; });
                c.setValue('newValue', { emitModelToViewChange: false });
                expect(onChange).toBeNull();
            });
            testing_internal_1.it('should set the parent', function () {
                c.setValue('newValue');
                expect(g.value).toEqual({ 'one': 'newValue' });
            });
            testing_internal_1.it('should not set the parent when explicitly specified', function () {
                c.setValue('newValue', { onlySelf: true });
                expect(g.value).toEqual({ 'one': 'oldValue' });
            });
            testing_internal_1.it('should fire an event', testing_1.fakeAsync(function () {
                c.valueChanges.subscribe(function (value) { expect(value).toEqual('newValue'); });
                c.setValue('newValue');
                testing_1.tick();
            }));
            testing_internal_1.it('should not fire an event when explicitly specified', testing_1.fakeAsync(function () {
                c.valueChanges.subscribe(function (value) { throw 'Should not happen'; });
                c.setValue('newValue', { emitEvent: false });
                testing_1.tick();
            }));
            testing_internal_1.it('should work on a disabled control', function () {
                g.addControl('two', new forms_1.FormControl('two'));
                c.disable();
                c.setValue('new value');
                expect(c.value).toEqual('new value');
                expect(g.value).toEqual({ 'two': 'two' });
            });
        });
        testing_internal_1.describe('patchValue', function () {
            var g, c;
            testing_internal_1.beforeEach(function () {
                c = new forms_1.FormControl('oldValue');
                g = new forms_1.FormGroup({ 'one': c });
            });
            testing_internal_1.it('should set the value of the control', function () {
                c.patchValue('newValue');
                expect(c.value).toEqual('newValue');
            });
            testing_internal_1.it('should invoke ngOnChanges if it is present', function () {
                var ngOnChanges;
                c.registerOnChange(function (v) { return ngOnChanges = ['invoked', v]; });
                c.patchValue('newValue');
                expect(ngOnChanges).toEqual(['invoked', 'newValue']);
            });
            testing_internal_1.it('should not invoke on change when explicitly specified', function () {
                var onChange = null;
                c.registerOnChange(function (v) { return onChange = ['invoked', v]; });
                c.patchValue('newValue', { emitModelToViewChange: false });
                expect(onChange).toBeNull();
            });
            testing_internal_1.it('should set the parent', function () {
                c.patchValue('newValue');
                expect(g.value).toEqual({ 'one': 'newValue' });
            });
            testing_internal_1.it('should not set the parent when explicitly specified', function () {
                c.patchValue('newValue', { onlySelf: true });
                expect(g.value).toEqual({ 'one': 'oldValue' });
            });
            testing_internal_1.it('should fire an event', testing_1.fakeAsync(function () {
                c.valueChanges.subscribe(function (value) { expect(value).toEqual('newValue'); });
                c.patchValue('newValue');
                testing_1.tick();
            }));
            testing_internal_1.it('should not fire an event when explicitly specified', testing_1.fakeAsync(function () {
                c.valueChanges.subscribe(function (value) { throw 'Should not happen'; });
                c.patchValue('newValue', { emitEvent: false });
                testing_1.tick();
            }));
            testing_internal_1.it('should patch value on a disabled control', function () {
                g.addControl('two', new forms_1.FormControl('two'));
                c.disable();
                c.patchValue('new value');
                expect(c.value).toEqual('new value');
                expect(g.value).toEqual({ 'two': 'two' });
            });
        });
        testing_internal_1.describe('reset()', function () {
            var c;
            testing_internal_1.beforeEach(function () { c = new forms_1.FormControl('initial value'); });
            testing_internal_1.it('should reset to a specific value if passed', function () {
                c.setValue('new value');
                expect(c.value).toBe('new value');
                c.reset('initial value');
                expect(c.value).toBe('initial value');
            });
            testing_internal_1.it('should not set the parent when explicitly specified', function () {
                var g = new forms_1.FormGroup({ 'one': c });
                c.patchValue('newValue', { onlySelf: true });
                expect(g.value).toEqual({ 'one': 'initial value' });
            });
            testing_internal_1.it('should reset to a specific value if passed with boxed value', function () {
                c.setValue('new value');
                expect(c.value).toBe('new value');
                c.reset({ value: 'initial value', disabled: false });
                expect(c.value).toBe('initial value');
            });
            testing_internal_1.it('should clear the control value if no value is passed', function () {
                c.setValue('new value');
                expect(c.value).toBe('new value');
                c.reset();
                expect(c.value).toBe(null);
            });
            testing_internal_1.it('should update the value of any parent controls with passed value', function () {
                var g = new forms_1.FormGroup({ 'one': c });
                c.setValue('new value');
                expect(g.value).toEqual({ 'one': 'new value' });
                c.reset('initial value');
                expect(g.value).toEqual({ 'one': 'initial value' });
            });
            testing_internal_1.it('should update the value of any parent controls with null value', function () {
                var g = new forms_1.FormGroup({ 'one': c });
                c.setValue('new value');
                expect(g.value).toEqual({ 'one': 'new value' });
                c.reset();
                expect(g.value).toEqual({ 'one': null });
            });
            testing_internal_1.it('should mark the control as pristine', function () {
                c.markAsDirty();
                expect(c.pristine).toBe(false);
                c.reset();
                expect(c.pristine).toBe(true);
            });
            testing_internal_1.it('should set the parent pristine state if all pristine', function () {
                var g = new forms_1.FormGroup({ 'one': c });
                c.markAsDirty();
                expect(g.pristine).toBe(false);
                c.reset();
                expect(g.pristine).toBe(true);
            });
            testing_internal_1.it('should not set the parent pristine state if it has other dirty controls', function () {
                var c2 = new forms_1.FormControl('two');
                var g = new forms_1.FormGroup({ 'one': c, 'two': c2 });
                c.markAsDirty();
                c2.markAsDirty();
                c.reset();
                expect(g.pristine).toBe(false);
            });
            testing_internal_1.it('should mark the control as untouched', function () {
                c.markAsTouched();
                expect(c.untouched).toBe(false);
                c.reset();
                expect(c.untouched).toBe(true);
            });
            testing_internal_1.it('should set the parent untouched state if all untouched', function () {
                var g = new forms_1.FormGroup({ 'one': c });
                c.markAsTouched();
                expect(g.untouched).toBe(false);
                c.reset();
                expect(g.untouched).toBe(true);
            });
            testing_internal_1.it('should not set the parent untouched state if other touched controls', function () {
                var c2 = new forms_1.FormControl('two');
                var g = new forms_1.FormGroup({ 'one': c, 'two': c2 });
                c.markAsTouched();
                c2.markAsTouched();
                c.reset();
                expect(g.untouched).toBe(false);
            });
            testing_internal_1.it('should retain the disabled state of the control', function () {
                c.disable();
                c.reset();
                expect(c.disabled).toBe(true);
            });
            testing_internal_1.it('should set disabled state based on boxed value if passed', function () {
                c.disable();
                c.reset({ value: null, disabled: false });
                expect(c.disabled).toBe(false);
            });
            testing_internal_1.describe('reset() events', function () {
                var g, c2, logger;
                testing_internal_1.beforeEach(function () {
                    c2 = new forms_1.FormControl('two');
                    g = new forms_1.FormGroup({ 'one': c, 'two': c2 });
                    logger = [];
                });
                testing_internal_1.it('should emit one valueChange event per reset control', function () {
                    g.valueChanges.subscribe(function () { return logger.push('group'); });
                    c.valueChanges.subscribe(function () { return logger.push('control1'); });
                    c2.valueChanges.subscribe(function () { return logger.push('control2'); });
                    c.reset();
                    expect(logger).toEqual(['control1', 'group']);
                });
                testing_internal_1.it('should not fire an event when explicitly specified', testing_1.fakeAsync(function () {
                    g.valueChanges.subscribe(function (value) { throw 'Should not happen'; });
                    c.valueChanges.subscribe(function (value) { throw 'Should not happen'; });
                    c2.valueChanges.subscribe(function (value) { throw 'Should not happen'; });
                    c.reset(null, { emitEvent: false });
                    testing_1.tick();
                }));
                testing_internal_1.it('should emit one statusChange event per reset control', function () {
                    g.statusChanges.subscribe(function () { return logger.push('group'); });
                    c.statusChanges.subscribe(function () { return logger.push('control1'); });
                    c2.statusChanges.subscribe(function () { return logger.push('control2'); });
                    c.reset();
                    expect(logger).toEqual(['control1', 'group']);
                });
                testing_internal_1.it('should emit one statusChange event per disabled control', function () {
                    g.statusChanges.subscribe(function () { return logger.push('group'); });
                    c.statusChanges.subscribe(function () { return logger.push('control1'); });
                    c2.statusChanges.subscribe(function () { return logger.push('control2'); });
                    c.reset({ value: null, disabled: true });
                    expect(logger).toEqual(['control1', 'group']);
                });
            });
        });
        testing_internal_1.describe('valueChanges & statusChanges', function () {
            var c;
            testing_internal_1.beforeEach(function () { c = new forms_1.FormControl('old', forms_1.Validators.required); });
            testing_internal_1.it('should fire an event after the value has been updated', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                c.valueChanges.subscribe({
                    next: function (value) {
                        expect(c.value).toEqual('new');
                        expect(value).toEqual('new');
                        async.done();
                    }
                });
                c.setValue('new');
            }));
            testing_internal_1.it('should fire an event after the status has been updated to invalid', testing_1.fakeAsync(function () {
                c.statusChanges.subscribe({
                    next: function (status) {
                        expect(c.status).toEqual('INVALID');
                        expect(status).toEqual('INVALID');
                    }
                });
                c.setValue('');
                testing_1.tick();
            }));
            testing_internal_1.it('should fire an event after the status has been updated to pending', testing_1.fakeAsync(function () {
                var c = new forms_1.FormControl('old', forms_1.Validators.required, asyncValidator('expected'));
                var log = [];
                c.valueChanges.subscribe({ next: function (value) { return log.push("value: '" + value + "'"); } });
                c.statusChanges.subscribe({ next: function (status) { return log.push("status: '" + status + "'"); } });
                c.setValue('');
                testing_1.tick();
                c.setValue('nonEmpty');
                testing_1.tick();
                c.setValue('expected');
                testing_1.tick();
                expect(log).toEqual([
                    'value: \'\'',
                    'status: \'INVALID\'',
                    'value: \'nonEmpty\'',
                    'status: \'PENDING\'',
                    'status: \'INVALID\'',
                    'value: \'expected\'',
                    'status: \'PENDING\'',
                    'status: \'VALID\'',
                ]);
            }));
            // TODO: remove the if statement after making observable delivery sync
            testing_internal_1.it('should update set errors and status before emitting an event', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                c.valueChanges.subscribe(function (value /** TODO #9100 */) {
                    expect(c.valid).toEqual(false);
                    expect(c.errors).toEqual({ 'required': true });
                    async.done();
                });
                c.setValue('');
            }));
            testing_internal_1.it('should return a cold observable', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                c.setValue('will be ignored');
                c.valueChanges.subscribe({
                    next: function (value) {
                        expect(value).toEqual('new');
                        async.done();
                    }
                });
                c.setValue('new');
            }));
        });
        testing_internal_1.describe('setErrors', function () {
            testing_internal_1.it('should set errors on a control', function () {
                var c = new forms_1.FormControl('someValue');
                c.setErrors({ 'someError': true });
                expect(c.valid).toEqual(false);
                expect(c.errors).toEqual({ 'someError': true });
            });
            testing_internal_1.it('should reset the errors and validity when the value changes', function () {
                var c = new forms_1.FormControl('someValue', forms_1.Validators.required);
                c.setErrors({ 'someError': true });
                c.setValue('');
                expect(c.errors).toEqual({ 'required': true });
            });
            testing_internal_1.it('should update the parent group\'s validity', function () {
                var c = new forms_1.FormControl('someValue');
                var g = new forms_1.FormGroup({ 'one': c });
                expect(g.valid).toEqual(true);
                c.setErrors({ 'someError': true });
                expect(g.valid).toEqual(false);
            });
            testing_internal_1.it('should not reset parent\'s errors', function () {
                var c = new forms_1.FormControl('someValue');
                var g = new forms_1.FormGroup({ 'one': c });
                g.setErrors({ 'someGroupError': true });
                c.setErrors({ 'someError': true });
                expect(g.errors).toEqual({ 'someGroupError': true });
            });
            testing_internal_1.it('should reset errors when updating a value', function () {
                var c = new forms_1.FormControl('oldValue');
                var g = new forms_1.FormGroup({ 'one': c });
                g.setErrors({ 'someGroupError': true });
                c.setErrors({ 'someError': true });
                c.setValue('newValue');
                expect(c.errors).toEqual(null);
                expect(g.errors).toEqual(null);
            });
        });
        testing_internal_1.describe('disable() & enable()', function () {
            testing_internal_1.it('should mark the control as disabled', function () {
                var c = new forms_1.FormControl(null);
                expect(c.disabled).toBe(false);
                expect(c.valid).toBe(true);
                c.disable();
                expect(c.disabled).toBe(true);
                expect(c.valid).toBe(false);
                c.enable();
                expect(c.disabled).toBe(false);
                expect(c.valid).toBe(true);
            });
            testing_internal_1.it('should set the control status as disabled', function () {
                var c = new forms_1.FormControl(null);
                expect(c.status).toEqual('VALID');
                c.disable();
                expect(c.status).toEqual('DISABLED');
                c.enable();
                expect(c.status).toEqual('VALID');
            });
            testing_internal_1.it('should retain the original value when disabled', function () {
                var c = new forms_1.FormControl('some value');
                expect(c.value).toEqual('some value');
                c.disable();
                expect(c.value).toEqual('some value');
                c.enable();
                expect(c.value).toEqual('some value');
            });
            testing_internal_1.it('should keep the disabled control in the group, but return false for contains()', function () {
                var c = new forms_1.FormControl('');
                var g = new forms_1.FormGroup({ 'one': c });
                expect(g.get('one')).toBeDefined();
                expect(g.contains('one')).toBe(true);
                c.disable();
                expect(g.get('one')).toBeDefined();
                expect(g.contains('one')).toBe(false);
            });
            testing_internal_1.it('should mark the parent group disabled if all controls are disabled', function () {
                var c = new forms_1.FormControl();
                var c2 = new forms_1.FormControl();
                var g = new forms_1.FormGroup({ 'one': c, 'two': c2 });
                expect(g.enabled).toBe(true);
                c.disable();
                expect(g.enabled).toBe(true);
                c2.disable();
                expect(g.enabled).toBe(false);
                c.enable();
                expect(g.enabled).toBe(true);
            });
            testing_internal_1.it('should update the parent group value when child control status changes', function () {
                var c = new forms_1.FormControl('one');
                var c2 = new forms_1.FormControl('two');
                var g = new forms_1.FormGroup({ 'one': c, 'two': c2 });
                expect(g.value).toEqual({ 'one': 'one', 'two': 'two' });
                c.disable();
                expect(g.value).toEqual({ 'two': 'two' });
                c2.disable();
                expect(g.value).toEqual({ 'one': 'one', 'two': 'two' });
                c.enable();
                expect(g.value).toEqual({ 'one': 'one' });
            });
            testing_internal_1.it('should mark the parent array disabled if all controls are disabled', function () {
                var c = new forms_1.FormControl();
                var c2 = new forms_1.FormControl();
                var a = new model_1.FormArray([c, c2]);
                expect(a.enabled).toBe(true);
                c.disable();
                expect(a.enabled).toBe(true);
                c2.disable();
                expect(a.enabled).toBe(false);
                c.enable();
                expect(a.enabled).toBe(true);
            });
            testing_internal_1.it('should update the parent array value when child control status changes', function () {
                var c = new forms_1.FormControl('one');
                var c2 = new forms_1.FormControl('two');
                var a = new model_1.FormArray([c, c2]);
                expect(a.value).toEqual(['one', 'two']);
                c.disable();
                expect(a.value).toEqual(['two']);
                c2.disable();
                expect(a.value).toEqual(['one', 'two']);
                c.enable();
                expect(a.value).toEqual(['one']);
            });
            testing_internal_1.it('should ignore disabled controls in validation', function () {
                var c = new forms_1.FormControl(null, forms_1.Validators.required);
                var c2 = new forms_1.FormControl(null);
                var g = new forms_1.FormGroup({ one: c, two: c2 });
                expect(g.valid).toBe(false);
                c.disable();
                expect(g.valid).toBe(true);
                c.enable();
                expect(g.valid).toBe(false);
            });
            testing_internal_1.it('should ignore disabled controls when serializing value in a group', function () {
                var c = new forms_1.FormControl('one');
                var c2 = new forms_1.FormControl('two');
                var g = new forms_1.FormGroup({ one: c, two: c2 });
                expect(g.value).toEqual({ one: 'one', two: 'two' });
                c.disable();
                expect(g.value).toEqual({ two: 'two' });
                c.enable();
                expect(g.value).toEqual({ one: 'one', two: 'two' });
            });
            testing_internal_1.it('should ignore disabled controls when serializing value in an array', function () {
                var c = new forms_1.FormControl('one');
                var c2 = new forms_1.FormControl('two');
                var a = new model_1.FormArray([c, c2]);
                expect(a.value).toEqual(['one', 'two']);
                c.disable();
                expect(a.value).toEqual(['two']);
                c.enable();
                expect(a.value).toEqual(['one', 'two']);
            });
            testing_internal_1.it('should ignore disabled controls when determining dirtiness', function () {
                var c = new forms_1.FormControl('one');
                var c2 = new forms_1.FormControl('two');
                var g = new forms_1.FormGroup({ one: c, two: c2 });
                c.markAsDirty();
                expect(g.dirty).toBe(true);
                c.disable();
                expect(c.dirty).toBe(true);
                expect(g.dirty).toBe(false);
                c.enable();
                expect(g.dirty).toBe(true);
            });
            testing_internal_1.it('should ignore disabled controls when determining touched state', function () {
                var c = new forms_1.FormControl('one');
                var c2 = new forms_1.FormControl('two');
                var g = new forms_1.FormGroup({ one: c, two: c2 });
                c.markAsTouched();
                expect(g.touched).toBe(true);
                c.disable();
                expect(c.touched).toBe(true);
                expect(g.touched).toBe(false);
                c.enable();
                expect(g.touched).toBe(true);
            });
            testing_internal_1.it('should not run validators on disabled controls', function () {
                var validator = jasmine.createSpy('validator');
                var c = new forms_1.FormControl('', validator);
                expect(validator.calls.count()).toEqual(1);
                c.disable();
                expect(validator.calls.count()).toEqual(1);
                c.setValue('value');
                expect(validator.calls.count()).toEqual(1);
                c.enable();
                expect(validator.calls.count()).toEqual(2);
            });
            testing_internal_1.describe('disabled errors', function () {
                testing_internal_1.it('should clear out the errors when disabled', function () {
                    var c = new forms_1.FormControl('', forms_1.Validators.required);
                    expect(c.errors).toEqual({ required: true });
                    c.disable();
                    expect(c.errors).toEqual(null);
                    c.enable();
                    expect(c.errors).toEqual({ required: true });
                });
                testing_internal_1.it('should clear out async errors when disabled', testing_1.fakeAsync(function () {
                    var c = new forms_1.FormControl('', null, asyncValidator('expected'));
                    testing_1.tick();
                    expect(c.errors).toEqual({ 'async': true });
                    c.disable();
                    expect(c.errors).toEqual(null);
                    c.enable();
                    testing_1.tick();
                    expect(c.errors).toEqual({ 'async': true });
                }));
            });
            testing_internal_1.describe('disabled events', function () {
                var logger;
                var c;
                var g;
                testing_internal_1.beforeEach(function () {
                    logger = [];
                    c = new forms_1.FormControl('', forms_1.Validators.required);
                    g = new forms_1.FormGroup({ one: c });
                });
                testing_internal_1.it('should emit a statusChange event when disabled status changes', function () {
                    c.statusChanges.subscribe(function (status) { return logger.push(status); });
                    c.disable();
                    expect(logger).toEqual(['DISABLED']);
                    c.enable();
                    expect(logger).toEqual(['DISABLED', 'INVALID']);
                });
                testing_internal_1.it('should emit status change events in correct order', function () {
                    c.statusChanges.subscribe(function () { return logger.push('control'); });
                    g.statusChanges.subscribe(function () { return logger.push('group'); });
                    c.disable();
                    expect(logger).toEqual(['control', 'group']);
                });
                testing_internal_1.it('should throw when sync validator passed into async validator param', function () {
                    var fn = function () { return new forms_1.FormControl('', syncValidator, syncValidator); };
                    // test for the specific error since without the error check it would still throw an error
                    // but
                    // not a meaningful one
                    expect(fn).toThrowError("Expected validator to return Promise or Observable.");
                });
                testing_internal_1.it('should not emit value change events when emitEvent = false', function () {
                    c.valueChanges.subscribe(function () { return logger.push('control'); });
                    g.valueChanges.subscribe(function () { return logger.push('group'); });
                    c.disable({ emitEvent: false });
                    expect(logger).toEqual([]);
                    c.enable({ emitEvent: false });
                    expect(logger).toEqual([]);
                });
                testing_internal_1.it('should not emit status change events when emitEvent = false', function () {
                    c.statusChanges.subscribe(function () { return logger.push('control'); });
                    g.statusChanges.subscribe(function () { return logger.push('form'); });
                    c.disable({ emitEvent: false });
                    expect(logger).toEqual([]);
                    c.enable({ emitEvent: false });
                    expect(logger).toEqual([]);
                });
            });
        });
        testing_internal_1.describe('pending', function () {
            var c;
            testing_internal_1.beforeEach(function () { c = new forms_1.FormControl('value'); });
            testing_internal_1.it('should be false after creating a control', function () { expect(c.pending).toEqual(false); });
            testing_internal_1.it('should be true after changing the value of the control', function () {
                c.markAsPending();
                expect(c.pending).toEqual(true);
            });
            testing_internal_1.describe('status change events', function () {
                var logger;
                testing_internal_1.beforeEach(function () {
                    logger = [];
                    c.statusChanges.subscribe(function (status) { return logger.push(status); });
                });
                testing_internal_1.it('should emit event after marking control as pending', function () {
                    c.markAsPending();
                    expect(logger).toEqual(['PENDING']);
                });
                testing_internal_1.it('should not emit event when emitEvent = false', function () {
                    c.markAsPending({ emitEvent: false });
                    expect(logger).toEqual([]);
                });
            });
        });
    });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9jb250cm9sX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy90ZXN0L2Zvcm1fY29udHJvbF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0NBQTJDO0FBQzNDLGlEQUFzRDtBQUN0RCwrRUFBZ0g7QUFDaEgsd0NBQWtFO0FBRWxFLGtEQUFtRDtBQUVuRCxDQUFDO0lBQ0Msd0JBQXdCLFFBQWdCLEVBQUUsUUFBYTtRQUFiLHlCQUFBLEVBQUEsYUFBYTtRQUNyRCxPQUFPLFVBQUMsQ0FBYztZQUNwQixJQUFJLE9BQU8sR0FBMEIsU0FBVyxDQUFDO1lBQ2pELElBQU0sT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLFVBQUEsR0FBRyxJQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2RCxJQUFNLENBQUMsR0FBSSxRQUFnQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFFLFFBQWdCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUUsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUssSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFFekQsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNkO2lCQUFNO2dCQUNMLFVBQVUsQ0FBQyxjQUFRLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUN4QztZQUVELE9BQU8sT0FBTyxDQUFDO1FBQ2pCLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRCwyQ0FBMkMsQ0FBYztR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