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
var shared_1 = require("@angular/forms/src/directives/shared");
var spies_1 = require("./spies");
var DummyControlValueAccessor = /** @class */ (function () {
    function DummyControlValueAccessor() {
    }
    DummyControlValueAccessor.prototype.registerOnChange = function (fn) { };
    DummyControlValueAccessor.prototype.registerOnTouched = function (fn) { };
    DummyControlValueAccessor.prototype.writeValue = function (obj) { this.writtenValue = obj; };
    return DummyControlValueAccessor;
}());
var CustomValidatorDirective = /** @class */ (function () {
    function CustomValidatorDirective() {
    }
    CustomValidatorDirective.prototype.validate = function (c) { return { 'custom': true }; };
    return CustomValidatorDirective;
}());
function asyncValidator(expected, timeout) {
    if (timeout === void 0) { timeout = 0; }
    return function (c) {
        var resolve = undefined;
        var promise = new Promise(function (res) { resolve = res; });
        var res = c.value != expected ? { 'async': true } : null;
        if (timeout == 0) {
            resolve(res);
        }
        else {
            setTimeout(function () { resolve(res); }, timeout);
        }
        return promise;
    };
}
{
    testing_internal_1.describe('Form Directives', function () {
        var defaultAccessor;
        testing_internal_1.beforeEach(function () { defaultAccessor = new forms_1.DefaultValueAccessor(null, null, null); });
        testing_internal_1.describe('shared', function () {
            testing_internal_1.describe('selectValueAccessor', function () {
                var dir;
                testing_internal_1.beforeEach(function () { dir = new spies_1.SpyNgControl(); });
                testing_internal_1.it('should throw when given an empty array', function () { testing_internal_1.expect(function () { return shared_1.selectValueAccessor(dir, []); }).toThrowError(); });
                testing_internal_1.it('should throw when accessor is not provided as array', function () {
                    testing_internal_1.expect(function () { return shared_1.selectValueAccessor(dir, {}); })
                        .toThrowError("Value accessor was not provided as an array for form control with unspecified name attribute");
                });
                testing_internal_1.it('should return the default value accessor when no other provided', function () { testing_internal_1.expect(shared_1.selectValueAccessor(dir, [defaultAccessor])).toEqual(defaultAccessor); });
                testing_internal_1.it('should return checkbox accessor when provided', function () {
                    var checkboxAccessor = new forms_1.CheckboxControlValueAccessor(null, null);
                    testing_internal_1.expect(shared_1.selectValueAccessor(dir, [
                        defaultAccessor, checkboxAccessor
                    ])).toEqual(checkboxAccessor);
                });
                testing_internal_1.it('should return select accessor when provided', function () {
                    var selectAccessor = new forms_1.SelectControlValueAccessor(null, null);
                    testing_internal_1.expect(shared_1.selectValueAccessor(dir, [
                        defaultAccessor, selectAccessor
                    ])).toEqual(selectAccessor);
                });
                testing_internal_1.it('should return select multiple accessor when provided', function () {
                    var selectMultipleAccessor = new forms_1.SelectMultipleControlValueAccessor(null, null);
                    testing_internal_1.expect(shared_1.selectValueAccessor(dir, [
                        defaultAccessor, selectMultipleAccessor
                    ])).toEqual(selectMultipleAccessor);
                });
                testing_internal_1.it('should throw when more than one build-in accessor is provided', function () {
                    var checkboxAccessor = new forms_1.CheckboxControlValueAccessor(null, null);
                    var selectAccessor = new forms_1.SelectControlValueAccessor(null, null);
                    testing_internal_1.expect(function () { return shared_1.selectValueAccessor(dir, [checkboxAccessor, selectAccessor]); }).toThrowError();
                });
                testing_internal_1.it('should return custom accessor when provided', function () {
                    var customAccessor = new spies_1.SpyValueAccessor();
                    var checkboxAccessor = new forms_1.CheckboxControlValueAccessor(null, null);
                    testing_internal_1.expect(shared_1.selectValueAccessor(dir, [defaultAccessor, customAccessor, checkboxAccessor]))
                        .toEqual(customAccessor);
                });
                testing_internal_1.it('should return custom accessor when provided with select multiple', function () {
                    var customAccessor = new spies_1.SpyValueAccessor();
                    var selectMultipleAccessor = new forms_1.SelectMultipleControlValueAccessor(null, null);
                    testing_internal_1.expect(shared_1.selectValueAccessor(dir, [defaultAccessor, customAccessor, selectMultipleAccessor]))
                        .toEqual(customAccessor);
                });
                testing_internal_1.it('should throw when more than one custom accessor is provided', function () {
                    var customAccessor = new spies_1.SpyValueAccessor();
                    testing_internal_1.expect(function () { return shared_1.selectValueAccessor(dir, [customAccessor, customAccessor]); }).toThrowError();
                });
            });
            testing_internal_1.describe('composeValidators', function () {
                testing_internal_1.it('should compose functions', function () {
                    var dummy1 = function (_ /** TODO #9100 */) { return ({ 'dummy1': true }); };
                    var dummy2 = function (_ /** TODO #9100 */) { return ({ 'dummy2': true }); };
                    var v = shared_1.composeValidators([dummy1, dummy2]);
                    testing_internal_1.expect(v(new forms_1.FormControl(''))).toEqual({ 'dummy1': true, 'dummy2': true });
                });
                testing_internal_1.it('should compose validator directives', function () {
                    var dummy1 = function (_ /** TODO #9100 */) { return ({ 'dummy1': true }); };
                    var v = shared_1.composeValidators([dummy1, new CustomValidatorDirective()]);
                    testing_internal_1.expect(v(new forms_1.FormControl(''))).toEqual({ 'dummy1': true, 'custom': true });
                });
            });
        });
        testing_internal_1.describe('formGroup', function () {
            var form;
            var formModel;
            var loginControlDir;
            testing_internal_1.beforeEach(function () {
                form = new forms_1.FormGroupDirective([], []);
                formModel = new forms_1.FormGroup({
                    'login': new forms_1.FormControl(),
                    'passwords': new forms_1.FormGroup({ 'password': new forms_1.FormControl(), 'passwordConfirm': new forms_1.FormControl() })
                });
                form.form = formModel;
                loginControlDir = new forms_1.FormControlName(form, [forms_1.Validators.required], [asyncValidator('expected')], [defaultAccessor], null);
                loginControlDir.name = 'login';
                loginControlDir.valueAccessor = new DummyControlValueAccessor();
            });
            testing_internal_1.it('should reexport control properties', function () {
                testing_internal_1.expect(form.control).toBe(formModel);
                testing_internal_1.expect(form.value).toBe(formModel.value);
                testing_internal_1.expect(form.valid).toBe(formModel.valid);
                testing_internal_1.expect(form.invalid).toBe(formModel.invalid);
                testing_internal_1.expect(form.pending).toBe(formModel.pending);
                testing_internal_1.expect(form.errors).toBe(formModel.errors);
                testing_internal_1.expect(form.pristine).toBe(formModel.pristine);
                testing_internal_1.expect(form.dirty).toBe(formModel.dirty);
                testing_internal_1.expect(form.touched).toBe(formModel.touched);
                testing_internal_1.expect(form.untouched).toBe(formModel.untouched);
                testing_internal_1.expect(form.statusChanges).toBe(formModel.statusChanges);
                testing_internal_1.expect(form.valueChanges).toBe(formModel.valueChanges);
            });
            testing_internal_1.it('should reexport control methods', function () {
                testing_internal_1.expect(form.hasError('required')).toBe(formModel.hasError('required'));
                testing_internal_1.expect(form.getError('required')).toBe(formModel.getError('required'));
                formModel.setErrors({ required: true });
                testing_internal_1.expect(form.hasError('required')).toBe(formModel.hasError('required'));
                testing_internal_1.expect(form.getError('required')).toBe(formModel.getError('required'));
            });
            testing_internal_1.describe('addControl', function () {
                testing_internal_1.it('should throw when no control found', function () {
                    var dir = new forms_1.FormControlName(form, null, null, [defaultAccessor], null);
                    dir.name = 'invalidName';
                    testing_internal_1.expect(function () { return form.addControl(dir); })
                        .toThrowError(new RegExp("Cannot find control with name: 'invalidName'"));
                });
                testing_internal_1.it('should throw for a named control when no value accessor', function () {
                    var dir = new forms_1.FormControlName(form, null, null, null, null);
                    dir.name = 'login';
                    testing_internal_1.expect(function () { return form.addControl(dir); })
                        .toThrowError(new RegExp("No value accessor for form control with name: 'login'"));
                });
                testing_internal_1.it('should throw when no value accessor with path', function () {
                    var group = new forms_1.FormGroupName(form, null, null);
                    var dir = new forms_1.FormControlName(group, null, null, null, null);
                    group.name = 'passwords';
                    dir.name = 'password';
                    testing_internal_1.expect(function () { return form.addControl(dir); })
                        .toThrowError(new RegExp("No value accessor for form control with path: 'passwords -> password'"));
                });
                testing_internal_1.it('should set up validators', testing_1.fakeAsync(function () {
                    form.addControl(loginControlDir);
                    // sync validators are set
                    testing_internal_1.expect(formModel.hasError('required', ['login'])).toBe(true);
                    testing_internal_1.expect(formModel.hasError('async', ['login'])).toBe(false);
                    formModel.get('login').setValue('invalid value');
                    // sync validator passes, running async validators
                    testing_internal_1.expect(formModel.pending).toBe(true);
                    testing_1.tick();
                    testing_internal_1.expect(formModel.hasError('required', ['login'])).toBe(false);
                    testing_internal_1.expect(formModel.hasError('async', ['login'])).toBe(true);
                }));
                testing_internal_1.it('should write value to the DOM', function () {
                    formModel.get(['login']).setValue('initValue');
                    form.addControl(loginControlDir);
                    testing_internal_1.expect(loginControlDir.valueAccessor.writtenValue).toEqual('initValue');
                });
                testing_internal_1.it('should add the directive to the list of directives included in the form', function () {
                    form.addControl(loginControlDir);
                    testing_internal_1.expect(form.directives).toEqual([loginControlDir]);
                });
            });
            testing_internal_1.describe('addFormGroup', function () {
                var matchingPasswordsValidator = function (g) {
                    if (g.controls['password'].value != g.controls['passwordConfirm'].value) {
                        return { 'differentPasswords': true };
                    }
                    else {
                        return null;
                    }
                };
                testing_internal_1.it('should set up validator', testing_1.fakeAsync(function () {
                    var group = new forms_1.FormGroupName(form, [matchingPasswordsValidator], [asyncValidator('expected')]);
                    group.name = 'passwords';
                    form.addFormGroup(group);
                    formModel.get(['passwords', 'password']).setValue('somePassword');
                    formModel.get([
                        'passwords', 'passwordConfirm'
                    ]).setValue('someOtherPassword');
                    // sync validators are set
                    testing_internal_1.expect(formModel.hasError('differentPasswords', ['passwords'])).toEqual(true);
                    formModel.get([
                        'passwords', 'passwordConfirm'
                    ]).setValue('somePassword');
                    // sync validators pass, running async validators
                    testing_internal_1.expect(formModel.pending).toBe(true);
                    testing_1.tick();
                    testing_internal_1.expect(formModel.hasError('async', ['passwords'])).toBe(true);
                }));
            });
            testing_internal_1.describe('removeControl', function () {
                testing_internal_1.it('should remove the directive to the list of directives included in the form', function () {
                    form.addControl(loginControlDir);
                    form.removeControl(loginControlDir);
                    testing_internal_1.expect(form.directives).toEqual([]);
                });
            });
            testing_internal_1.describe('ngOnChanges', function () {
                testing_internal_1.it('should update dom values of all the directives', function () {
                    form.addControl(loginControlDir);
                    formModel.get(['login']).setValue('new value');
                    form.ngOnChanges({});
                    testing_internal_1.expect(loginControlDir.valueAccessor.writtenValue).toEqual('new value');
                });
                testing_internal_1.it('should set up a sync validator', function () {
                    var formValidator = function (c) { return ({ 'custom': true }); };
                    var f = new forms_1.FormGroupDirective([formValidator], []);
                    f.form = formModel;
                    f.ngOnChanges({ 'form': new core_1.SimpleChange(null, null, false) });
                    testing_internal_1.expect(formModel.errors).toEqual({ 'custom': true });
                });
                testing_internal_1.it('should set up an async validator', testing_1.fakeAsync(function () {
                    var f = new forms_1.FormGroupDirective([], [asyncValidator('expected')]);
                    f.form = formModel;
                    f.ngOnChanges({ 'form': new core_1.SimpleChange(null, null, false) });
                    testing_1.tick();
                    testing_internal_1.expect(formModel.errors).toEqual({ 'async': true });
                }));
            });
        });
        testing_internal_1.describe('NgForm', function () {
            var form /** TODO #9100 */;
            var formModel;
            var loginControlDir /** TODO #9100 */;
            var personControlGroupDir /** TODO #9100 */;
            testing_internal_1.beforeEach(function () {
                form = new forms_1.NgForm([], []);
                formModel = form.form;
                personControlGroupDir = new forms_1.NgModelGroup(form, [], []);
                personControlGroupDir.name = 'person';
                loginControlDir = new forms_1.NgModel(personControlGroupDir, null, null, [defaultAccessor]);
                loginControlDir.name = 'login';
                loginControlDir.valueAccessor = new DummyControlValueAccessor();
            });
            testing_internal_1.it('should reexport control properties', function () {
                testing_internal_1.expect(form.control).toBe(formModel);
                testing_internal_1.expect(form.value).toBe(formModel.value);
                testing_internal_1.expect(form.valid).toBe(formModel.valid);
                testing_internal_1.expect(form.invalid).toBe(formModel.invalid);
                testing_internal_1.expect(form.pending).toBe(formModel.pending);
                testing_internal_1.expect(form.errors).toBe(formModel.errors);
                testing_internal_1.expect(form.pristine).toBe(formModel.pristine);
                testing_internal_1.expect(form.dirty).toBe(formModel.dirty);
                testing_internal_1.expect(form.touched).toBe(formModel.touched);
                testing_internal_1.expect(form.untouched).toBe(formModel.untouched);
                testing_internal_1.expect(form.statusChanges).toBe(formModel.statusChanges);
                testing_internal_1.expect(form.status).toBe(formModel.status);
                testing_internal_1.expect(form.valueChanges).toBe(formModel.valueChanges);
                testing_internal_1.expect(form.disabled).toBe(formModel.disabled);
                testing_internal_1.expect(form.enabled).toBe(formModel.enabled);
            });
            testing_internal_1.it('should reexport control methods', function () {
                testing_internal_1.expect(form.hasError('required')).toBe(formModel.hasError('required'));
                testing_internal_1.expect(form.getError('required')).toBe(formModel.getError('required'));
                formModel.setErrors({ required: true });
                testing_internal_1.expect(form.hasError('required')).toBe(formModel.hasError('required'));
                testing_internal_1.expect(form.getError('required')).toBe(formModel.getError('required'));
            });
            testing_internal_1.describe('addControl & addFormGroup', function () {
                testing_internal_1.it('should create a control with the given name', testing_1.fakeAsync(function () {
                    form.addFormGroup(personControlGroupDir);
                    form.addControl(loginControlDir);
                    testing_1.flushMicrotasks();
                    testing_internal_1.expect(formModel.get(['person', 'login'])).not.toBeNull;
                }));
                // should update the form's value and validity
            });
            testing_internal_1.describe('removeControl & removeFormGroup', function () {
                testing_internal_1.it('should remove control', testing_1.fakeAsync(function () {
                    form.addFormGroup(personControlGroupDir);
                    form.addControl(loginControlDir);
                    form.removeFormGroup(personControlGroupDir);
                    form.removeControl(loginControlDir);
                    testing_1.flushMicrotasks();
                    testing_internal_1.expect(formModel.get(['person'])).toBeNull();
                    testing_internal_1.expect(formModel.get(['person', 'login'])).toBeNull();
                }));
                // should update the form's value and validity
            });
            testing_internal_1.it('should set up sync validator', testing_1.fakeAsync(function () {
                var formValidator = function (c /** TODO #9100 */) { return ({ 'custom': true }); };
                var f = new forms_1.NgForm([formValidator], []);
                testing_1.tick();
                testing_internal_1.expect(f.form.errors).toEqual({ 'custom': true });
            }));
            testing_internal_1.it('should set up async validator', testing_1.fakeAsync(function () {
                var f = new forms_1.NgForm([], [asyncValidator('expected')]);
                testing_1.tick();
                testing_internal_1.expect(f.form.errors).toEqual({ 'async': true });
            }));
        });
        testing_internal_1.describe('FormGroupName', function () {
            var formModel /** TODO #9100 */;
            var controlGroupDir /** TODO #9100 */;
            testing_internal_1.beforeEach(function () {
                formModel = new forms_1.FormGroup({ 'login': new forms_1.FormControl(null) });
                var parent = new forms_1.FormGroupDirective([], []);
                parent.form = new forms_1.FormGroup({ 'group': formModel });
                controlGroupDir = new forms_1.FormGroupName(parent, [], []);
                controlGroupDir.name = 'group';
            });
            testing_internal_1.it('should reexport control properties', function () {
                testing_internal_1.expect(controlGroupDir.control).toBe(formModel);
                testing_internal_1.expect(controlGroupDir.value).toBe(formModel.value);
                testing_internal_1.expect(controlGroupDir.valid).toBe(formModel.valid);
                testing_internal_1.expect(controlGroupDir.invalid).toBe(formModel.invalid);
                testing_internal_1.expect(controlGroupDir.pending).toBe(formModel.pending);
                testing_internal_1.expect(controlGroupDir.errors).toBe(formModel.errors);
                testing_internal_1.expect(controlGroupDir.pristine).toBe(formModel.pristine);
                testing_internal_1.expect(controlGroupDir.dirty).toBe(formModel.dirty);
                testing_internal_1.expect(controlGroupDir.touched).toBe(formModel.touched);
                testing_internal_1.expect(controlGroupDir.untouched).toBe(formModel.untouched);
                testing_internal_1.expect(controlGroupDir.statusChanges).toBe(formModel.statusChanges);
                testing_internal_1.expect(controlGroupDir.status).toBe(formModel.status);
                testing_internal_1.expect(controlGroupDir.valueChanges).toBe(formModel.valueChanges);
                testing_internal_1.expect(controlGroupDir.disabled).toBe(formModel.disabled);
                testing_internal_1.expect(controlGroupDir.enabled).toBe(formModel.enabled);
            });
            testing_internal_1.it('should reexport control methods', function () {
                testing_internal_1.expect(controlGroupDir.hasError('required')).toBe(formModel.hasError('required'));
                testing_internal_1.expect(controlGroupDir.getError('required')).toBe(formModel.getError('required'));
                formModel.setErrors({ required: true });
                testing_internal_1.expect(controlGroupDir.hasError('required')).toBe(formModel.hasError('required'));
                testing_internal_1.expect(controlGroupDir.getError('required')).toBe(formModel.getError('required'));
            });
        });
        testing_internal_1.describe('FormArrayName', function () {
            var formModel;
            var formArrayDir;
            testing_internal_1.beforeEach(function () {
                var parent = new forms_1.FormGroupDirective([], []);
                formModel = new forms_1.FormArray([new forms_1.FormControl('')]);
                parent.form = new forms_1.FormGroup({ 'array': formModel });
                formArrayDir = new forms_1.FormArrayName(parent, [], []);
                formArrayDir.name = 'array';
            });
            testing_internal_1.it('should reexport control properties', function () {
                testing_internal_1.expect(formArrayDir.control).toBe(formModel);
                testing_internal_1.expect(formArrayDir.value).toBe(formModel.value);
                testing_internal_1.expect(formArrayDir.valid).toBe(formModel.valid);
                testing_internal_1.expect(formArrayDir.invalid).toBe(formModel.invalid);
                testing_internal_1.expect(formArrayDir.pending).toBe(formModel.pending);
                testing_internal_1.expect(formArrayDir.errors).toBe(formModel.errors);
                testing_internal_1.expect(formArrayDir.pristine).toBe(formModel.pristine);
                testing_internal_1.expect(formArrayDir.dirty).toBe(formModel.dirty);
                testing_internal_1.expect(formArrayDir.touched).toBe(formModel.touched);
                testing_internal_1.expect(formArrayDir.status).toBe(formModel.status);
                testing_internal_1.expect(formArrayDir.untouched).toBe(formModel.untouched);
                testing_internal_1.expect(formArrayDir.disabled).toBe(formModel.disabled);
                testing_internal_1.expect(formArrayDir.enabled).toBe(formModel.enabled);
            });
            testing_internal_1.it('should reexport control methods', function () {
                testing_internal_1.expect(formArrayDir.hasError('required')).toBe(formModel.hasError('required'));
                testing_internal_1.expect(formArrayDir.getError('required')).toBe(formModel.getError('required'));
                formModel.setErrors({ required: true });
                testing_internal_1.expect(formArrayDir.hasError('required')).toBe(formModel.hasError('required'));
                testing_internal_1.expect(formArrayDir.getError('required')).toBe(formModel.getError('required'));
            });
        });
        testing_internal_1.describe('FormControlDirective', function () {
            var controlDir /** TODO #9100 */;
            var control /** TODO #9100 */;
            var checkProperties = function (control) {
                testing_internal_1.expect(controlDir.control).toBe(control);
                testing_internal_1.expect(controlDir.value).toBe(control.value);
                testing_internal_1.expect(controlDir.valid).toBe(control.valid);
                testing_internal_1.expect(controlDir.invalid).toBe(control.invalid);
                testing_internal_1.expect(controlDir.pending).toBe(control.pending);
                testing_internal_1.expect(controlDir.errors).toBe(control.errors);
                testing_internal_1.expect(controlDir.pristine).toBe(control.pristine);
                testing_internal_1.expect(controlDir.dirty).toBe(control.dirty);
                testing_internal_1.expect(controlDir.touched).toBe(control.touched);
                testing_internal_1.expect(controlDir.untouched).toBe(control.untouched);
                testing_internal_1.expect(controlDir.statusChanges).toBe(control.statusChanges);
                testing_internal_1.expect(controlDir.status).toBe(control.status);
                testing_internal_1.expect(controlDir.valueChanges).toBe(control.valueChanges);
                testing_internal_1.expect(controlDir.disabled).toBe(control.disabled);
                testing_internal_1.expect(controlDir.enabled).toBe(control.enabled);
            };
            testing_internal_1.beforeEach(function () {
                controlDir = new forms_1.FormControlDirective([forms_1.Validators.required], [], [defaultAccessor], null);
                controlDir.valueAccessor = new DummyControlValueAccessor();
                control = new forms_1.FormControl(null);
                controlDir.form = control;
            });
            testing_internal_1.it('should reexport control properties', function () { checkProperties(control); });
            testing_internal_1.it('should reexport control methods', function () {
                testing_internal_1.expect(controlDir.hasError('required')).toBe(control.hasError('required'));
                testing_internal_1.expect(controlDir.getError('required')).toBe(control.getError('required'));
                control.setErrors({ required: true });
                testing_internal_1.expect(controlDir.hasError('required')).toBe(control.hasError('required'));
                testing_internal_1.expect(controlDir.getError('required')).toBe(control.getError('required'));
            });
            testing_internal_1.it('should reexport new control properties', function () {
                var newControl = new forms_1.FormControl(null);
                controlDir.form = newControl;
                controlDir.ngOnChanges({ 'form': new core_1.SimpleChange(control, newControl, false) });
                checkProperties(newControl);
            });
            testing_internal_1.it('should set up validator', function () {
                testing_internal_1.expect(control.valid).toBe(true);
                // this will add the required validator and recalculate the validity
                controlDir.ngOnChanges({ 'form': new core_1.SimpleChange(null, control, false) });
                testing_internal_1.expect(control.valid).toBe(false);
            });
        });
        testing_internal_1.describe('NgModel', function () {
            var ngModel;
            var control;
            testing_internal_1.beforeEach(function () {
                ngModel = new forms_1.NgModel(null, [forms_1.Validators.required], [asyncValidator('expected')], [defaultAccessor]);
                ngModel.valueAccessor = new DummyControlValueAccessor();
                control = ngModel.control;
            });
            testing_internal_1.it('should reexport control properties', function () {
                testing_internal_1.expect(ngModel.control).toBe(control);
                testing_internal_1.expect(ngModel.value).toBe(control.value);
                testing_internal_1.expect(ngModel.valid).toBe(control.valid);
                testing_internal_1.expect(ngModel.invalid).toBe(control.invalid);
                testing_internal_1.expect(ngModel.pending).toBe(control.pending);
                testing_internal_1.expect(ngModel.errors).toBe(control.errors);
                testing_internal_1.expect(ngModel.pristine).toBe(control.pristine);
                testing_internal_1.expect(ngModel.dirty).toBe(control.dirty);
                testing_internal_1.expect(ngModel.touched).toBe(control.touched);
                testing_internal_1.expect(ngModel.untouched).toBe(control.untouched);
                testing_internal_1.expect(ngModel.statusChanges).toBe(control.statusChanges);
                testing_internal_1.expect(ngModel.status).toBe(control.status);
                testing_internal_1.expect(ngModel.valueChanges).toBe(control.valueChanges);
                testing_internal_1.expect(ngModel.disabled).toBe(control.disabled);
                testing_internal_1.expect(ngModel.enabled).toBe(control.enabled);
            });
            testing_internal_1.it('should reexport control methods', function () {
                testing_internal_1.expect(ngModel.hasError('required')).toBe(control.hasError('required'));
                testing_internal_1.expect(ngModel.getError('required')).toBe(control.getError('required'));
                control.setErrors({ required: true });
                testing_internal_1.expect(ngModel.hasError('required')).toBe(control.hasError('required'));
                testing_internal_1.expect(ngModel.getError('required')).toBe(control.getError('required'));
            });
            testing_internal_1.it('should throw when no value accessor with named control', function () {
                var namedDir = new forms_1.NgModel(null, null, null, null);
                namedDir.name = 'one';
                testing_internal_1.expect(function () { return namedDir.ngOnChanges({}); })
                    .toThrowError(new RegExp("No value accessor for form control with name: 'one'"));
            });
            testing_internal_1.it('should throw when no value accessor with unnamed control', function () {
                var unnamedDir = new forms_1.NgModel(null, null, null, null);
                testing_internal_1.expect(function () { return unnamedDir.ngOnChanges({}); })
                    .toThrowError(new RegExp("No value accessor for form control with unspecified name attribute"));
            });
            testing_internal_1.it('should set up validator', testing_1.fakeAsync(function () {
                // this will add the required validator and recalculate the validity
                ngModel.ngOnChanges({});
                testing_1.tick();
                testing_internal_1.expect(ngModel.control.errors).toEqual({ 'required': true });
                ngModel.control.setValue('someValue');
                testing_1.tick();
                testing_internal_1.expect(ngModel.control.errors).toEqual({ 'async': true });
            }));
            testing_internal_1.it('should mark as disabled properly', testing_1.fakeAsync(function () {
                ngModel.ngOnChanges({ isDisabled: new core_1.SimpleChange('', undefined, false) });
                testing_1.tick();
                testing_internal_1.expect(ngModel.control.disabled).toEqual(false);
                ngModel.ngOnChanges({ isDisabled: new core_1.SimpleChange('', null, false) });
                testing_1.tick();
                testing_internal_1.expect(ngModel.control.disabled).toEqual(false);
                ngModel.ngOnChanges({ isDisabled: new core_1.SimpleChange('', false, false) });
                testing_1.tick();
                testing_internal_1.expect(ngModel.control.disabled).toEqual(false);
                ngModel.ngOnChanges({ isDisabled: new core_1.SimpleChange('', 'false', false) });
                testing_1.tick();
                testing_internal_1.expect(ngModel.control.disabled).toEqual(false);
                ngModel.ngOnChanges({ isDisabled: new core_1.SimpleChange('', 0, false) });
                testing_1.tick();
                testing_internal_1.expect(ngModel.control.disabled).toEqual(false);
                ngModel.ngOnChanges({ isDisabled: new core_1.SimpleChange(null, '', false) });
                testing_1.tick();
                testing_internal_1.expect(ngModel.control.disabled).toEqual(true);
                ngModel.ngOnChanges({ isDisabled: new core_1.SimpleChange(null, 'true', false) });
                testing_1.tick();
                testing_internal_1.expect(ngModel.control.disabled).toEqual(true);
                ngModel.ngOnChanges({ isDisabled: new core_1.SimpleChange(null, true, false) });
                testing_1.tick();
                testing_internal_1.expect(ngModel.control.disabled).toEqual(true);
                ngModel.ngOnChanges({ isDisabled: new core_1.SimpleChange(null, 'anything else', false) });
                testing_1.tick();
                testing_internal_1.expect(ngModel.control.disabled).toEqual(true);
            }));
        });
        testing_internal_1.describe('FormControlName', function () {
            var formModel /** TODO #9100 */;
            var controlNameDir /** TODO #9100 */;
            testing_internal_1.beforeEach(function () {
                formModel = new forms_1.FormControl('name');
                var parent = new forms_1.FormGroupDirective([], []);
                parent.form = new forms_1.FormGroup({ 'name': formModel });
                controlNameDir = new forms_1.FormControlName(parent, [], [], [defaultAccessor], null);
                controlNameDir.name = 'name';
                controlNameDir.control = formModel;
            });
            testing_internal_1.it('should reexport control properties', function () {
                testing_internal_1.expect(controlNameDir.control).toBe(formModel);
                testing_internal_1.expect(controlNameDir.value).toBe(formModel.value);
                testing_internal_1.expect(controlNameDir.valid).toBe(formModel.valid);
                testing_internal_1.expect(controlNameDir.invalid).toBe(formModel.invalid);
                testing_internal_1.expect(controlNameDir.pending).toBe(formModel.pending);
                testing_internal_1.expect(controlNameDir.errors).toBe(formModel.errors);
                testing_internal_1.expect(controlNameDir.pristine).toBe(formModel.pristine);
                testing_internal_1.expect(controlNameDir.dirty).toBe(formModel.dirty);
                testing_internal_1.expect(controlNameDir.touched).toBe(formModel.touched);
                testing_internal_1.expect(controlNameDir.untouched).toBe(formModel.untouched);
                testing_internal_1.expect(controlNameDir.statusChanges).toBe(formModel.statusChanges);
                testing_internal_1.expect(controlNameDir.status).toBe(formModel.status);
                testing_internal_1.expect(controlNameDir.valueChanges).toBe(formModel.valueChanges);
                testing_internal_1.expect(controlNameDir.disabled).toBe(formModel.disabled);
                testing_internal_1.expect(controlNameDir.enabled).toBe(formModel.enabled);
            });
            testing_internal_1.it('should reexport control methods', function () {
                testing_internal_1.expect(controlNameDir.hasError('required')).toBe(formModel.hasError('required'));
                testing_internal_1.expect(controlNameDir.getError('required')).toBe(formModel.getError('required'));
                formModel.setErrors({ required: true });
                testing_internal_1.expect(controlNameDir.hasError('required')).toBe(formModel.hasError('required'));
                testing_internal_1.expect(controlNameDir.getError('required')).toBe(formModel.getError('required'));
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlc19zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvdGVzdC9kaXJlY3RpdmVzX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxzQ0FBMkM7QUFDM0MsaURBQXVFO0FBQ3ZFLCtFQUE0RjtBQUM1Rix3Q0FBd1k7QUFDeFksK0RBQTRGO0FBQzVGLGlDQUF1RDtBQUV2RDtJQUFBO0lBT0EsQ0FBQztJQUpDLG9EQUFnQixHQUFoQixVQUFpQixFQUFPLElBQUcsQ0FBQztJQUM1QixxREFBaUIsR0FBakIsVUFBa0IsRUFBTyxJQUFHLENBQUM7SUFFN0IsOENBQVUsR0FBVixVQUFXLEdBQVEsSUFBVSxJQUFJLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDekQsZ0NBQUM7QUFBRCxDQUFDLEFBUEQsSUFPQztBQUVEO0lBQUE7SUFFQSxDQUFDO0lBREMsMkNBQVEsR0FBUixVQUFTLENBQWMsSUFBc0IsT0FBTyxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekUsK0JBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUVELHdCQUF3QixRQUFhLEVBQUUsT0FBVztJQUFYLHdCQUFBLEVBQUEsV0FBVztJQUNoRCxPQUFPLFVBQUMsQ0FBa0I7UUFDeEIsSUFBSSxPQUFPLEdBQTBCLFNBQVcsQ0FBQztRQUNqRCxJQUFNLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFBLEdBQUcsSUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkQsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUssSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDekQsSUFBSSxPQUFPLElBQUks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LFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDekMseUJBQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDN0MseUJBQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDN0MseUJBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDM0MseUJBQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDL0MseUJBQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDekMseUJBQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDN0MseUJBQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDakQseUJBQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDekQseUJBQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUN6RCxDQUFDLENBQUMsQ0FBQztZQUVILHFCQUFFLENBQUMsaUNBQWlDLEVBQUU7Z0JBQ3BDLHlCQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZFLHlCQUFNLENB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eEQseUJBQU0sQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDdEQseUJBQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDMUQseUJBQU0sQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDcEQseUJBQU0sQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDeEQseUJBQU0sQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDNUQseUJBQU0sQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDcEUseUJBQU0sQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDdEQseUJBQU0sQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDbEUseUJBQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDMUQseUJBQU0sQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMxRCxDQUFDLENBQUMsQ0FBQztZQUVILHFCQUFFLENBQUMsaUNBQWlDLEVBQUU7Z0JBQ3BDLHlCQUFNLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xGLHlCQUFNLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBRWxGLFNBQVMsQ0FBQyxTQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztnQkFDdEMseUJBQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDbEYseUJBQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNwRixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsMkJBQVEsQ0FBQyxlQUFlLEVBQUU7WUFDeEIsSUFBSSxTQUFvQixDQUFDO1lBQ3pCLElBQUksWUFBMkIsQ0FBQztZQUVoQyw2QkFBVSxDQUFDO2dCQUNULElBQU0sTUFBTSxHQUFHLElBQUksMEJBQWtCLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUM5QyxTQUFTLEdBQUcsSUFBSSxpQkFBUyxDQUFDLENBQUMsSUFBSSxtQkFBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakQsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLGlCQUFTLENBQUMsRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQztnQkFDbEQsWUFBWSxHQUFHLElBQUkscUJBQWEsQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUNqRCxZQUFZLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztZQUM5QixDQUFDLENBQUMsQ0FBQztZQUVILHFCQUFFLENBQUMsb0NBQW9DLEVBQUU7Z0JBQ3ZDLHlCQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDN0MseUJBQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDakQseUJBQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDakQseUJBQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDckQseUJBQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDckQseUJBQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDbkQseUJBQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDdkQseUJBQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDakQseUJBQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDckQseUJBQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDbkQseUJBQU0sQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDekQseUJBQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDdkQseUJBQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN2RCxDQUFDLENBQUMsQ0FBQztZQUVILHFCQUFFLENBQUMsaUNBQWlDLEVBQUU7Z0JBQ3BDLHlCQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQy9FLHlCQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBRS9FLFNBQVMsQ0FBQyxTQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztnQkFDdEMseUJBQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDL0UseUJBQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNqRixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsMkJBQVEsQ0FBQyxzQkFBc0IsRUFBRTtZQUMvQixJQUFJLFVBQWUsQ0FBQyxpQkFBaUIsQ0FBQztZQUN0QyxJQUFJLE9BQVksQ0FBQyxpQkFBaUIsQ0FBQztZQUNuQyxJQUFNLGVBQWUsR0FBRyxVQUFTLE9BQXdCO2dCQUN2RCx5QkFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3pDLHlCQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzdDLHlCQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzdDLHlCQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ2pELHlCQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ2pELHlCQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQy9DLHlCQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ25ELHlCQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzdDLHlCQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ2pELHlCQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ3JELHlCQUFNLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQzdELHlCQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQy9DLHlCQUFNLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxD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Y0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDL0MseUJBQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDbkQseUJBQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDbkQseUJBQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDdkQseUJBQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDdkQseUJBQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDckQseUJBQU0sQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDekQseUJBQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDbkQseUJBQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDdkQseUJBQU0sQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDM0QseUJBQU0sQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDbkUseUJBQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDckQseUJBQU0sQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDakUseUJBQU0sQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDekQseUJBQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN6RCxDQUFDLENBQUMsQ0FBQztZQUVILHFCQUFFLENBQUMsaUNBQWlDLEVBQUU7Z0JBQ3BDLHlCQUFNLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pGLHlCQUFNLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBRWpGLFNBQVMsQ0FBQyxTQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztnQkFDdEMseUJBQU0sQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDakYseUJBQU0sQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNuRixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7Q0FDSiJ9