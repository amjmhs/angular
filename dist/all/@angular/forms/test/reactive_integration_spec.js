"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var forms_1 = require("@angular/forms");
var by_1 = require("@angular/platform-browser/src/dom/debug/by");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var browser_util_1 = require("@angular/platform-browser/testing/src/browser_util");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var value_accessor_integration_spec_1 = require("./value_accessor_integration_spec");
{
    describe('reactive forms integration tests', function () {
        function initTest(component) {
            var directives = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                directives[_i - 1] = arguments[_i];
            }
            testing_1.TestBed.configureTestingModule({ declarations: [component].concat(directives), imports: [forms_1.FormsModule, forms_1.ReactiveFormsModule] });
            return testing_1.TestBed.createComponent(component);
        }
        describe('basic functionality', function () {
            it('should work with single controls', function () {
                var fixture = initTest(FormControlComp);
                var control = new forms_1.FormControl('old value');
                fixture.componentInstance.control = control;
                fixture.detectChanges();
                // model -> view
                var input = fixture.debugElement.query(by_1.By.css('input'));
                expect(input.nativeElement.value).toEqual('old value');
                input.nativeElement.value = 'updated value';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                // view -> model
                expect(control.value).toEqual('updated value');
            });
            it('should work with formGroups (model -> view)', function () {
                var fixture = initTest(FormGroupComp);
                fixture.componentInstance.form = new forms_1.FormGroup({ 'login': new forms_1.FormControl('loginValue') });
                fixture.detectChanges();
                var input = fixture.debugElement.query(by_1.By.css('input'));
                expect(input.nativeElement.value).toEqual('loginValue');
            });
            it('should add novalidate by default to form', function () {
                var fixture = initTest(FormGroupComp);
                fixture.componentInstance.form = new forms_1.FormGroup({ 'login': new forms_1.FormControl('loginValue') });
                fixture.detectChanges();
                var form = fixture.debugElement.query(by_1.By.css('form'));
                expect(form.nativeElement.getAttribute('novalidate')).toEqual('');
            });
            it('work with formGroups (view -> model)', function () {
                var fixture = initTest(FormGroupComp);
                var form = new forms_1.FormGroup({ 'login': new forms_1.FormControl('oldValue') });
                fixture.componentInstance.form = form;
                fixture.detectChanges();
                var input = fixture.debugElement.query(by_1.By.css('input'));
                input.nativeElement.value = 'updatedValue';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                expect(form.value).toEqual({ 'login': 'updatedValue' });
            });
        });
        describe('re-bound form groups', function () {
            it('should update DOM elements initially', function () {
                var fixture = initTest(FormGroupComp);
                fixture.componentInstance.form = new forms_1.FormGroup({ 'login': new forms_1.FormControl('oldValue') });
                fixture.detectChanges();
                fixture.componentInstance.form = new forms_1.FormGroup({ 'login': new forms_1.FormControl('newValue') });
                fixture.detectChanges();
                var input = fixture.debugElement.query(by_1.By.css('input'));
                expect(input.nativeElement.value).toEqual('newValue');
            });
            it('should update model when UI changes', function () {
                var fixture = initTest(FormGroupComp);
                fixture.componentInstance.form = new forms_1.FormGroup({ 'login': new forms_1.FormControl('oldValue') });
                fixture.detectChanges();
                var newForm = new forms_1.FormGroup({ 'login': new forms_1.FormControl('newValue') });
                fixture.componentInstance.form = newForm;
                fixture.detectChanges();
                var input = fixture.debugElement.query(by_1.By.css('input'));
                input.nativeElement.value = 'Nancy';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                fixture.detectChanges();
                expect(newForm.value).toEqual({ login: 'Nancy' });
                newForm.setValue({ login: 'Carson' });
                fixture.detectChanges();
                expect(input.nativeElement.value).toEqual('Carson');
            });
            it('should update nested form group model when UI changes', function () {
                var fixture = initTest(NestedFormGroupComp);
                fixture.componentInstance.form = new forms_1.FormGroup({ 'signin': new forms_1.FormGroup({ 'login': new forms_1.FormControl(), 'password': new forms_1.FormControl() }) });
                fixture.detectChanges();
                var newForm = new forms_1.FormGroup({
                    'signin': new forms_1.FormGroup({ 'login': new forms_1.FormControl('Nancy'), 'password': new forms_1.FormControl('secret') })
                });
                fixture.componentInstance.form = newForm;
                fixture.detectChanges();
                var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                expect(inputs[0].nativeElement.value).toEqual('Nancy');
                expect(inputs[1].nativeElement.value).toEqual('secret');
                inputs[0].nativeElement.value = 'Carson';
                browser_util_1.dispatchEvent(inputs[0].nativeElement, 'input');
                fixture.detectChanges();
                expect(newForm.value).toEqual({ signin: { login: 'Carson', password: 'secret' } });
                newForm.setValue({ signin: { login: 'Bess', password: 'otherpass' } });
                fixture.detectChanges();
                expect(inputs[0].nativeElement.value).toEqual('Bess');
            });
            it('should pick up dir validators from form controls', function () {
                var fixture = initTest(LoginIsEmptyWrapper, LoginIsEmptyValidator);
                var form = new forms_1.FormGroup({
                    'login': new forms_1.FormControl(''),
                    'min': new forms_1.FormControl(''),
                    'max': new forms_1.FormControl(''),
                    'pattern': new forms_1.FormControl('')
                });
                fixture.componentInstance.form = form;
                fixture.detectChanges();
                expect(form.get('login').errors).toEqual({ required: true });
                var newForm = new forms_1.FormGroup({
                    'login': new forms_1.FormControl(''),
                    'min': new forms_1.FormControl(''),
                    'max': new forms_1.FormControl(''),
                    'pattern': new forms_1.FormControl('')
                });
                fixture.componentInstance.form = newForm;
                fixture.detectChanges();
                expect(newForm.get('login').errors).toEqual({ required: true });
            });
            it('should pick up dir validators from nested form groups', function () {
                var fixture = initTest(NestedFormGroupComp, LoginIsEmptyValidator);
                var form = new forms_1.FormGroup({
                    'signin': new forms_1.FormGroup({ 'login': new forms_1.FormControl(''), 'password': new forms_1.FormControl('') })
                });
                fixture.componentInstance.form = form;
                fixture.detectChanges();
                expect(form.get('signin').valid).toBe(false);
                var newForm = new forms_1.FormGroup({
                    'signin': new forms_1.FormGroup({ 'login': new forms_1.FormControl(''), 'password': new forms_1.FormControl('') })
                });
                fixture.componentInstance.form = newForm;
                fixture.detectChanges();
                expect(form.get('signin').valid).toBe(false);
            });
            it('should strip named controls that are not found', function () {
                var fixture = initTest(NestedFormGroupComp, LoginIsEmptyValidator);
                var form = new forms_1.FormGroup({
                    'signin': new forms_1.FormGroup({ 'login': new forms_1.FormControl(''), 'password': new forms_1.FormControl('') })
                });
                fixture.componentInstance.form = form;
                fixture.detectChanges();
                form.addControl('email', new forms_1.FormControl('email'));
                fixture.detectChanges();
                var emailInput = fixture.debugElement.query(by_1.By.css('[formControlName="email"]'));
                expect(emailInput.nativeElement.value).toEqual('email');
                var newForm = new forms_1.FormGroup({
                    'signin': new forms_1.FormGroup({ 'login': new forms_1.FormControl(''), 'password': new forms_1.FormControl('') })
                });
                fixture.componentInstance.form = newForm;
                fixture.detectChanges();
                emailInput = fixture.debugElement.query(by_1.By.css('[formControlName="email"]'));
                expect(emailInput).toBe(null); // TODO: Review use of `any` here (#19904)
            });
            it('should strip array controls that are not found', function () {
                var fixture = initTest(FormArrayComp);
                var cityArray = new forms_1.FormArray([new forms_1.FormControl('SF'), new forms_1.FormControl('NY')]);
                var form = new forms_1.FormGroup({ cities: cityArray });
                fixture.componentInstance.form = form;
                fixture.componentInstance.cityArray = cityArray;
                fixture.detectChanges();
                var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                expect(inputs[2]).not.toBeDefined();
                cityArray.push(new forms_1.FormControl('LA'));
                fixture.detectChanges();
                inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                expect(inputs[2]).toBeDefined();
                var newArr = new forms_1.FormArray([new forms_1.FormControl('SF'), new forms_1.FormControl('NY')]);
                var newForm = new forms_1.FormGroup({ cities: newArr });
                fixture.componentInstance.form = newForm;
                fixture.componentInstance.cityArray = newArr;
                fixture.detectChanges();
                inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                expect(inputs[2]).not.toBeDefined();
            });
            describe('nested control rebinding', function () {
                it('should attach dir to control when leaf control changes', function () {
                    var form = new forms_1.FormGroup({ 'login': new forms_1.FormControl('oldValue') });
                    var fixture = initTest(FormGroupComp);
                    fixture.componentInstance.form = form;
                    fixture.detectChanges();
                    form.removeControl('login');
                    form.addControl('login', new forms_1.FormControl('newValue'));
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input'));
                    expect(input.nativeElement.value).toEqual('newValue');
                    input.nativeElement.value = 'user input';
                    browser_util_1.dispatchEvent(input.nativeElement, 'input');
                    fixture.detectChanges();
                    expect(form.value).toEqual({ login: 'user input' });
                    form.setValue({ login: 'Carson' });
                    fixture.detectChanges();
                    expect(input.nativeElement.value).toEqual('Carson');
                });
                it('should attach dirs to all child controls when group control changes', function () {
                    var fixture = initTest(NestedFormGroupComp, LoginIsEmptyValidator);
                    var form = new forms_1.FormGroup({
                        signin: new forms_1.FormGroup({ login: new forms_1.FormControl('oldLogin'), password: new forms_1.FormControl('oldPassword') })
                    });
                    fixture.componentInstance.form = form;
                    fixture.detectChanges();
                    form.removeControl('signin');
                    form.addControl('signin', new forms_1.FormGroup({ login: new forms_1.FormControl('newLogin'), password: new forms_1.FormControl('newPassword') }));
                    fixture.detectChanges();
                    var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                    expect(inputs[0].nativeElement.value).toEqual('newLogin');
                    expect(inputs[1].nativeElement.value).toEqual('newPassword');
                    inputs[0].nativeElement.value = 'user input';
                    browser_util_1.dispatchEvent(inputs[0].nativeElement, 'input');
                    fixture.detectChanges();
                    expect(form.value).toEqual({ signin: { login: 'user input', password: 'newPassword' } });
                    form.setValue({ signin: { login: 'Carson', password: 'Drew' } });
                    fixture.detectChanges();
                    expect(inputs[0].nativeElement.value).toEqual('Carson');
                    expect(inputs[1].nativeElement.value).toEqual('Drew');
                });
                it('should attach dirs to all present child controls when array control changes', function () {
                    var fixture = initTest(FormArrayComp);
                    var cityArray = new forms_1.FormArray([new forms_1.FormControl('SF'), new forms_1.FormControl('NY')]);
                    var form = new forms_1.FormGroup({ cities: cityArray });
                    fixture.componentInstance.form = form;
                    fixture.componentInstance.cityArray = cityArray;
                    fixture.detectChanges();
                    form.removeControl('cities');
                    form.addControl('cities', new forms_1.FormArray([new forms_1.FormControl('LA')]));
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input'));
                    expect(input.nativeElement.value).toEqual('LA');
                    input.nativeElement.value = 'MTV';
                    browser_util_1.dispatchEvent(input.nativeElement, 'input');
                    fixture.detectChanges();
                    expect(form.value).toEqual({ cities: ['MTV'] });
                    form.setValue({ cities: ['LA'] });
                    fixture.detectChanges();
                    expect(input.nativeElement.value).toEqual('LA');
                });
                it('should remove controls correctly after re-binding a form array', function () {
                    var fixture = initTest(FormArrayComp);
                    var cityArray = new forms_1.FormArray([new forms_1.FormControl('SF'), new forms_1.FormControl('NY'), new forms_1.FormControl('LA')]);
                    var form = new forms_1.FormGroup({ cities: cityArray });
                    fixture.componentInstance.form = form;
                    fixture.componentInstance.cityArray = cityArray;
                    fixture.detectChanges();
                    var newArr = new forms_1.FormArray([new forms_1.FormControl('SF'), new forms_1.FormControl('NY'), new forms_1.FormControl('LA')]);
                    fixture.componentInstance.cityArray = newArr;
                    form.setControl('cities', newArr);
                    fixture.detectChanges();
                    newArr.removeAt(0);
                    fixture.detectChanges();
                    var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                    expect(inputs[0].nativeElement.value).toEqual('NY');
                    expect(inputs[1].nativeElement.value).toEqual('LA');
                    var firstInput = inputs[0].nativeElement;
                    firstInput.value = 'new value';
                    browser_util_1.dispatchEvent(firstInput, 'input');
                    fixture.detectChanges();
                    expect(newArr.value).toEqual(['new value', 'LA']);
                    newArr.removeAt(0);
                    fixture.detectChanges();
                    firstInput = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    firstInput.value = 'last one';
                    browser_util_1.dispatchEvent(firstInput, 'input');
                    fixture.detectChanges();
                    expect(newArr.value).toEqual(['last one']);
                    newArr.get([0]).setValue('set value');
                    fixture.detectChanges();
                    firstInput = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    expect(firstInput.value).toEqual('set value');
                });
                it('should submit properly after removing controls on a re-bound array', function () {
                    var fixture = initTest(FormArrayComp);
                    var cityArray = new forms_1.FormArray([new forms_1.FormControl('SF'), new forms_1.FormControl('NY'), new forms_1.FormControl('LA')]);
                    var form = new forms_1.FormGroup({ cities: cityArray });
                    fixture.componentInstance.form = form;
                    fixture.componentInstance.cityArray = cityArray;
                    fixture.detectChanges();
                    var newArr = new forms_1.FormArray([new forms_1.FormControl('SF'), new forms_1.FormControl('NY'), new forms_1.FormControl('LA')]);
                    fixture.componentInstance.cityArray = newArr;
                    form.setControl('cities', newArr);
                    fixture.detectChanges();
                    newArr.removeAt(0);
                    fixture.detectChanges();
                    var formEl = fixture.debugElement.query(by_1.By.css('form'));
                    expect(function () { return browser_util_1.dispatchEvent(formEl.nativeElement, 'submit'); }).not.toThrowError();
                });
                it('should insert controls properly on a re-bound array', function () {
                    var fixture = initTest(FormArrayComp);
                    var cityArray = new forms_1.FormArray([new forms_1.FormControl('SF'), new forms_1.FormControl('NY')]);
                    var form = new forms_1.FormGroup({ cities: cityArray });
                    fixture.componentInstance.form = form;
                    fixture.componentInstance.cityArray = cityArray;
                    fixture.detectChanges();
                    var newArr = new forms_1.FormArray([new forms_1.FormControl('SF'), new forms_1.FormControl('NY')]);
                    fixture.componentInstance.cityArray = newArr;
                    form.setControl('cities', newArr);
                    fixture.detectChanges();
                    newArr.insert(1, new forms_1.FormControl('LA'));
                    fixture.detectChanges();
                    var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                    expect(inputs[0].nativeElement.value).toEqual('SF');
                    expect(inputs[1].nativeElement.value).toEqual('LA');
                    expect(inputs[2].nativeElement.value).toEqual('NY');
                    var lastInput = inputs[2].nativeElement;
                    lastInput.value = 'Tulsa';
                    browser_util_1.dispatchEvent(lastInput, 'input');
                    fixture.detectChanges();
                    expect(newArr.value).toEqual(['SF', 'LA', 'Tulsa']);
                    newArr.get([2]).setValue('NY');
                    fixture.detectChanges();
                    expect(lastInput.value).toEqual('NY');
                });
            });
        });
        describe('form arrays', function () {
            it('should support form arrays', function () {
                var fixture = initTest(FormArrayComp);
                var cityArray = new forms_1.FormArray([new forms_1.FormControl('SF'), new forms_1.FormControl('NY')]);
                var form = new forms_1.FormGroup({ cities: cityArray });
                fixture.componentInstance.form = form;
                fixture.componentInstance.cityArray = cityArray;
                fixture.detectChanges();
                var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                // model -> view
                expect(inputs[0].nativeElement.value).toEqual('SF');
                expect(inputs[1].nativeElement.value).toEqual('NY');
                expect(form.value).toEqual({ cities: ['SF', 'NY'] });
                inputs[0].nativeElement.value = 'LA';
                browser_util_1.dispatchEvent(inputs[0].nativeElement, 'input');
                fixture.detectChanges();
                //  view -> model
                expect(form.value).toEqual({ cities: ['LA', 'NY'] });
            });
            it('should support pushing new controls to form arrays', function () {
                var fixture = initTest(FormArrayComp);
                var cityArray = new forms_1.FormArray([new forms_1.FormControl('SF'), new forms_1.FormControl('NY')]);
                var form = new forms_1.FormGroup({ cities: cityArray });
                fixture.componentInstance.form = form;
                fixture.componentInstance.cityArray = cityArray;
                fixture.detectChanges();
                cityArray.push(new forms_1.FormControl('LA'));
                fixture.detectChanges();
                var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                expect(inputs[2].nativeElement.value).toEqual('LA');
                expect(form.value).toEqual({ cities: ['SF', 'NY', 'LA'] });
            });
            it('should support form groups nested in form arrays', function () {
                var fixture = initTest(FormArrayNestedGroup);
                var cityArray = new forms_1.FormArray([
                    new forms_1.FormGroup({ town: new forms_1.FormControl('SF'), state: new forms_1.FormControl('CA') }),
                    new forms_1.FormGroup({ town: new forms_1.FormControl('NY'), state: new forms_1.FormControl('NY') })
                ]);
                var form = new forms_1.FormGroup({ cities: cityArray });
                fixture.componentInstance.form = form;
                fixture.componentInstance.cityArray = cityArray;
                fixture.detectChanges();
                var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                expect(inputs[0].nativeElement.value).toEqual('SF');
                expect(inputs[1].nativeElement.value).toEqual('CA');
                expect(inputs[2].nativeElement.value).toEqual('NY');
                expect(inputs[3].nativeElement.value).toEqual('NY');
                expect(form.value).toEqual({
                    cities: [{ town: 'SF', state: 'CA' }, { town: 'NY', state: 'NY' }]
                });
                inputs[0].nativeElement.value = 'LA';
                browser_util_1.dispatchEvent(inputs[0].nativeElement, 'input');
                fixture.detectChanges();
                expect(form.value).toEqual({
                    cities: [{ town: 'LA', state: 'CA' }, { town: 'NY', state: 'NY' }]
                });
            });
        });
        describe('programmatic changes', function () {
            it('should update the value in the DOM when setValue() is called', function () {
                var fixture = initTest(FormGroupComp);
                var login = new forms_1.FormControl('oldValue');
                var form = new forms_1.FormGroup({ 'login': login });
                fixture.componentInstance.form = form;
                fixture.detectChanges();
                login.setValue('newValue');
                fixture.detectChanges();
                var input = fixture.debugElement.query(by_1.By.css('input'));
                expect(input.nativeElement.value).toEqual('newValue');
            });
            describe('disabled controls', function () {
                it('should add disabled attribute to an individual control when instantiated as disabled', function () {
                    var fixture = initTest(FormControlComp);
                    var control = new forms_1.FormControl({ value: 'some value', disabled: true });
                    fixture.componentInstance.control = control;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input'));
                    expect(input.nativeElement.disabled).toBe(true);
                    control.enable();
                    fixture.detectChanges();
                    expect(input.nativeElement.disabled).toBe(false);
                });
                it('should add disabled attribute to formControlName when instantiated as disabled', function () {
                    var fixture = initTest(FormGroupComp);
                    var control = new forms_1.FormControl({ value: 'some value', disabled: true });
                    fixture.componentInstance.form = new forms_1.FormGroup({ login: control });
                    fixture.componentInstance.control = control;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input'));
                    expect(input.nativeElement.disabled).toBe(true);
                    control.enable();
                    fixture.detectChanges();
                    expect(input.nativeElement.disabled).toBe(false);
                });
                it('should add disabled attribute to an individual control when disable() is called', function () {
                    var fixture = initTest(FormControlComp);
                    var control = new forms_1.FormControl('some value');
                    fixture.componentInstance.control = control;
                    fixture.detectChanges();
                    control.disable();
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input'));
                    expect(input.nativeElement.disabled).toBe(true);
                    control.enable();
                    fixture.detectChanges();
                    expect(input.nativeElement.disabled).toBe(false);
                });
                it('should add disabled attribute to child controls when disable() is called on group', function () {
                    var fixture = initTest(FormGroupComp);
                    var form = new forms_1.FormGroup({ 'login': new forms_1.FormControl('login') });
                    fixture.componentInstance.form = form;
                    fixture.detectChanges();
                    form.disable();
                    fixture.detectChanges();
                    var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                    expect(inputs[0].nativeElement.disabled).toBe(true);
                    form.enable();
                    fixture.detectChanges();
                    expect(inputs[0].nativeElement.disabled).toBe(false);
                });
                it('should not add disabled attribute to custom controls when disable() is called', function () {
                    var fixture = initTest(value_accessor_integration_spec_1.MyInputForm, value_accessor_integration_spec_1.MyInput);
                    var control = new forms_1.FormControl('some value');
                    fixture.componentInstance.form = new forms_1.FormGroup({ login: control });
                    fixture.detectChanges();
                    control.disable();
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('my-input'));
                    expect(input.nativeElement.getAttribute('disabled')).toBe(null);
                });
            });
        });
        describe('user input', function () {
            it('should mark controls as touched after interacting with the DOM control', function () {
                var fixture = initTest(FormGroupComp);
                var login = new forms_1.FormControl('oldValue');
                var form = new forms_1.FormGroup({ 'login': login });
                fixture.componentInstance.form = form;
                fixture.detectChanges();
                var loginEl = fixture.debugElement.query(by_1.By.css('input'));
                expect(login.touched).toBe(false);
                browser_util_1.dispatchEvent(loginEl.nativeElement, 'blur');
                expect(login.touched).toBe(true);
            });
        });
        describe('submit and reset events', function () {
            it('should emit ngSubmit event with the original submit event on submit', function () {
                var fixture = initTest(FormGroupComp);
                fixture.componentInstance.form = new forms_1.FormGroup({ 'login': new forms_1.FormControl('loginValue') });
                fixture.componentInstance.event = null;
                fixture.detectChanges();
                var formEl = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                browser_util_1.dispatchEvent(formEl, 'submit');
                fixture.detectChanges();
                expect(fixture.componentInstance.event.type).toEqual('submit');
            });
            it('should mark formGroup as submitted on submit event', function () {
                var fixture = initTest(FormGroupComp);
                fixture.componentInstance.form = new forms_1.FormGroup({ 'login': new forms_1.FormControl('loginValue') });
                fixture.detectChanges();
                var formGroupDir = fixture.debugElement.children[0].injector.get(forms_1.FormGroupDirective);
                expect(formGroupDir.submitted).toBe(false);
                var formEl = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                browser_util_1.dispatchEvent(formEl, 'submit');
                fixture.detectChanges();
                expect(formGroupDir.submitted).toEqual(true);
            });
            it('should set value in UI when form resets to that value programmatically', function () {
                var fixture = initTest(FormGroupComp);
                var login = new forms_1.FormControl('some value');
                var form = new forms_1.FormGroup({ 'login': login });
                fixture.componentInstance.form = form;
                fixture.detectChanges();
                var loginEl = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                expect(loginEl.value).toBe('some value');
                form.reset({ 'login': 'reset value' });
                expect(loginEl.value).toBe('reset value');
            });
            it('should clear value in UI when form resets programmatically', function () {
                var fixture = initTest(FormGroupComp);
                var login = new forms_1.FormControl('some value');
                var form = new forms_1.FormGroup({ 'login': login });
                fixture.componentInstance.form = form;
                fixture.detectChanges();
                var loginEl = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                expect(loginEl.value).toBe('some value');
                form.reset();
                expect(loginEl.value).toBe('');
            });
        });
        describe('value changes and status changes', function () {
            it('should mark controls as dirty before emitting a value change event', function () {
                var fixture = initTest(FormGroupComp);
                var login = new forms_1.FormControl('oldValue');
                fixture.componentInstance.form = new forms_1.FormGroup({ 'login': login });
                fixture.detectChanges();
                login.valueChanges.subscribe(function () { expect(login.dirty).toBe(true); });
                var loginEl = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                loginEl.value = 'newValue';
                browser_util_1.dispatchEvent(loginEl, 'input');
            });
            it('should mark control as pristine before emitting a value change event when resetting ', function () {
                var fixture = initTest(FormGroupComp);
                var login = new forms_1.FormControl('oldValue');
                var form = new forms_1.FormGroup({ 'login': login });
                fixture.componentInstance.form = form;
                fixture.detectChanges();
                var loginEl = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                loginEl.value = 'newValue';
                browser_util_1.dispatchEvent(loginEl, 'input');
                expect(login.pristine).toBe(false);
                login.valueChanges.subscribe(function () { expect(login.pristine).toBe(true); });
                form.reset();
            });
        });
        describe('setting status classes', function () {
            it('should work with single fields', function () {
                var fixture = initTest(FormControlComp);
                var control = new forms_1.FormControl('', forms_1.Validators.required);
                fixture.componentInstance.control = control;
                fixture.detectChanges();
                var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                expect(sortedClassList(input)).toEqual(['ng-invalid', 'ng-pristine', 'ng-untouched']);
                browser_util_1.dispatchEvent(input, 'blur');
                fixture.detectChanges();
                expect(sortedClassList(input)).toEqual(['ng-invalid', 'ng-pristine', 'ng-touched']);
                input.value = 'updatedValue';
                browser_util_1.dispatchEvent(input, 'input');
                fixture.detectChanges();
                expect(sortedClassList(input)).toEqual(['ng-dirty', 'ng-touched', 'ng-valid']);
            });
            it('should work with single fields and async validators', testing_1.fakeAsync(function () {
                var fixture = initTest(FormControlComp);
                var control = new forms_1.FormControl('', null, uniqLoginAsyncValidator('good'));
                fixture.debugElement.componentInstance.control = control;
                fixture.detectChanges();
                var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                expect(sortedClassList(input)).toEqual(['ng-pending', 'ng-pristine', 'ng-untouched']);
                browser_util_1.dispatchEvent(input, 'blur');
                fixture.detectChanges();
                expect(sortedClassList(input)).toEqual(['ng-pending', 'ng-pristine', 'ng-touched']);
                input.value = 'good';
                browser_util_1.dispatchEvent(input, 'input');
                testing_1.tick();
                fixture.detectChanges();
                expect(sortedClassList(input)).toEqual(['ng-dirty', 'ng-touched', 'ng-valid']);
            }));
            it('should work with single fields that combines async and sync validators', testing_1.fakeAsync(function () {
                var fixture = initTest(FormControlComp);
                var control = new forms_1.FormControl('', forms_1.Validators.required, uniqLoginAsyncValidator('good'));
                fixture.debugElement.componentInstance.control = control;
                fixture.detectChanges();
                var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                expect(sortedClassList(input)).toEqual(['ng-invalid', 'ng-pristine', 'ng-untouched']);
                browser_util_1.dispatchEvent(input, 'blur');
                fixture.detectChanges();
                expect(sortedClassList(input)).toEqual(['ng-invalid', 'ng-pristine', 'ng-touched']);
                input.value = 'bad';
                browser_util_1.dispatchEvent(input, 'input');
                fixture.detectChanges();
                expect(sortedClassList(input)).toEqual(['ng-dirty', 'ng-pending', 'ng-touched']);
                testing_1.tick();
                fixture.detectChanges();
                expect(sortedClassList(input)).toEqual(['ng-dirty', 'ng-invalid', 'ng-touched']);
                input.value = 'good';
                browser_util_1.dispatchEvent(input, 'input');
                testing_1.tick();
                fixture.detectChanges();
                expect(sortedClassList(input)).toEqual(['ng-dirty', 'ng-touched', 'ng-valid']);
            }));
            it('should work with single fields in parent forms', function () {
                var fixture = initTest(FormGroupComp);
                var form = new forms_1.FormGroup({ 'login': new forms_1.FormControl('', forms_1.Validators.required) });
                fixture.componentInstance.form = form;
                fixture.detectChanges();
                var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                expect(sortedClassList(input)).toEqual(['ng-invalid', 'ng-pristine', 'ng-untouched']);
                browser_util_1.dispatchEvent(input, 'blur');
                fixture.detectChanges();
                expect(sortedClassList(input)).toEqual(['ng-invalid', 'ng-pristine', 'ng-touched']);
                input.value = 'updatedValue';
                browser_util_1.dispatchEvent(input, 'input');
                fixture.detectChanges();
                expect(sortedClassList(input)).toEqual(['ng-dirty', 'ng-touched', 'ng-valid']);
            });
            it('should work with formGroup', function () {
                var fixture = initTest(FormGroupComp);
                var form = new forms_1.FormGroup({ 'login': new forms_1.FormControl('', forms_1.Validators.required) });
                fixture.componentInstance.form = form;
                fixture.detectChanges();
                var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                var formEl = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                expect(sortedClassList(formEl)).toEqual(['ng-invalid', 'ng-pristine', 'ng-untouched']);
                browser_util_1.dispatchEvent(input, 'blur');
                fixture.detectChanges();
                expect(sortedClassList(formEl)).toEqual(['ng-invalid', 'ng-pristine', 'ng-touched']);
                input.value = 'updatedValue';
                browser_util_1.dispatchEvent(input, 'input');
                fixture.detectChanges();
                expect(sortedClassList(formEl)).toEqual(['ng-dirty', 'ng-touched', 'ng-valid']);
            });
        });
        describe('updateOn options', function () {
            describe('on blur', function () {
                it('should not update value or validity based on user input until blur', function () {
                    var fixture = initTest(FormControlComp);
                    var control = new forms_1.FormControl('', { validators: forms_1.Validators.required, updateOn: 'blur' });
                    fixture.componentInstance.control = control;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'Nancy';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    expect(control.value).toEqual('', 'Expected value to remain unchanged until blur.');
                    expect(control.valid).toBe(false, 'Expected no validation to occur until blur.');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(control.value)
                        .toEqual('Nancy', 'Expected value to change once control is blurred.');
                    expect(control.valid).toBe(true, 'Expected validation to run once control is blurred.');
                });
                it('should not update parent group value/validity from child until blur', function () {
                    var fixture = initTest(FormGroupComp);
                    var form = new forms_1.FormGroup({ login: new forms_1.FormControl('', { validators: forms_1.Validators.required, updateOn: 'blur' }) });
                    fixture.componentInstance.form = form;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'Nancy';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    expect(form.value)
                        .toEqual({ login: '' }, 'Expected group value to remain unchanged until blur.');
                    expect(form.valid).toBe(false, 'Expected no validation to occur on group until blur.');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(form.value)
                        .toEqual({ login: 'Nancy' }, 'Expected group value to change once input blurred.');
                    expect(form.valid).toBe(true, 'Expected validation to run once input blurred.');
                });
                it('should not wait for blur event to update if value is set programmatically', function () {
                    var fixture = initTest(FormControlComp);
                    var control = new forms_1.FormControl('', { validators: forms_1.Validators.required, updateOn: 'blur' });
                    fixture.componentInstance.control = control;
                    fixture.detectChanges();
                    control.setValue('Nancy');
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    expect(input.value).toEqual('Nancy', 'Expected value to propagate to view immediately.');
                    expect(control.value).toEqual('Nancy', 'Expected model value to update immediately.');
                    expect(control.valid).toBe(true, 'Expected validation to run immediately.');
                });
                it('should not update dirty state until control is blurred', function () {
                    var fixture = initTest(FormControlComp);
                    var control = new forms_1.FormControl('', { updateOn: 'blur' });
                    fixture.componentInstance.control = control;
                    fixture.detectChanges();
                    expect(control.dirty).toBe(false, 'Expected control to start out pristine.');
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'Nancy';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    expect(control.dirty).toBe(false, 'Expected control to stay pristine until blurred.');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(control.dirty).toBe(true, 'Expected control to update dirty state when blurred.');
                });
                it('should update touched when control is blurred', function () {
                    var fixture = initTest(FormControlComp);
                    var control = new forms_1.FormControl('', { updateOn: 'blur' });
                    fixture.componentInstance.control = control;
                    fixture.detectChanges();
                    expect(control.touched).toBe(false, 'Expected control to start out untouched.');
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(control.touched)
                        .toBe(true, 'Expected control to update touched state when blurred.');
                });
                it('should continue waiting for blur to update if previously blurred', function () {
                    var fixture = initTest(FormControlComp);
                    var control = new forms_1.FormControl('Nancy', { validators: forms_1.Validators.required, updateOn: 'blur' });
                    fixture.componentInstance.control = control;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    browser_util_1.dispatchEvent(input, 'focus');
                    input.value = '';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    expect(control.value)
                        .toEqual('Nancy', 'Expected value to remain unchanged until second blur.');
                    expect(control.valid).toBe(true, 'Expected validation not to run until second blur.');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(control.value).toEqual('', 'Expected value to update when blur occurs again.');
                    expect(control.valid).toBe(false, 'Expected validation to run when blur occurs again.');
                });
                it('should not use stale pending value if value set programmatically', function () {
                    var fixture = initTest(FormControlComp);
                    var control = new forms_1.FormControl('', { validators: forms_1.Validators.required, updateOn: 'blur' });
                    fixture.componentInstance.control = control;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'aa';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    control.setValue('Nancy');
                    fixture.detectChanges();
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(input.value).toEqual('Nancy', 'Expected programmatic value to stick after blur.');
                });
                it('should set initial value and validity on init', function () {
                    var fixture = initTest(FormControlComp);
                    var control = new forms_1.FormControl('Nancy', { validators: forms_1.Validators.maxLength(3), updateOn: 'blur' });
                    fixture.componentInstance.control = control;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    expect(input.value).toEqual('Nancy', 'Expected value to be set in the view.');
                    expect(control.value).toEqual('Nancy', 'Expected initial model value to be set.');
                    expect(control.valid).toBe(false, 'Expected validation to run on initial value.');
                });
                it('should reset properly', function () {
                    var fixture = initTest(FormControlComp);
                    var control = new forms_1.FormControl('', { validators: forms_1.Validators.required, updateOn: 'blur' });
                    fixture.componentInstance.control = control;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'aa';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(control.dirty).toBe(true, 'Expected control to be dirty on blur.');
                    control.reset();
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(input.value).toEqual('', 'Expected view value to reset');
                    expect(control.value).toBe(null, 'Expected pending value to reset.');
                    expect(control.dirty).toBe(false, 'Expected pending dirty value to reset.');
                });
                it('should not emit valueChanges or statusChanges until blur', function () {
                    var fixture = initTest(FormControlComp);
                    var control = new forms_1.FormControl('', { validators: forms_1.Validators.required, updateOn: 'blur' });
                    fixture.componentInstance.control = control;
                    fixture.detectChanges();
                    var values = [];
                    var sub = rxjs_1.merge(control.valueChanges, control.statusChanges).subscribe(function (val) { return values.push(val); });
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'Nancy';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    expect(values).toEqual([], 'Expected no valueChanges or statusChanges on input.');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(values).toEqual(['Nancy', 'VALID'], 'Expected valueChanges and statusChanges on blur.');
                    sub.unsubscribe();
                });
                it('should not emit valueChanges or statusChanges on blur if value unchanged', function () {
                    var fixture = initTest(FormControlComp);
                    var control = new forms_1.FormControl('', { validators: forms_1.Validators.required, updateOn: 'blur' });
                    fixture.componentInstance.control = control;
                    fixture.detectChanges();
                    var values = [];
                    var sub = rxjs_1.merge(control.valueChanges, control.statusChanges).subscribe(function (val) { return values.push(val); });
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(values).toEqual([], 'Expected no valueChanges or statusChanges if value unchanged.');
                    input.value = 'Nancy';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    expect(values).toEqual([], 'Expected no valueChanges or statusChanges on input.');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(values).toEqual(['Nancy', 'VALID'], 'Expected valueChanges and statusChanges on blur if value changed.');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(values).toEqual(['Nancy', 'VALID'], 'Expected valueChanges and statusChanges not to fire again on blur unless value changed.');
                    input.value = 'Bess';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    expect(values).toEqual(['Nancy', 'VALID'], 'Expected valueChanges and statusChanges not to fire on input after blur.');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(values).toEqual(['Nancy', 'VALID', 'Bess', 'VALID'], 'Expected valueChanges and statusChanges to fire again on blur if value changed.');
                    sub.unsubscribe();
                });
                it('should mark as pristine properly if pending dirty', function () {
                    var fixture = initTest(FormControlComp);
                    var control = new forms_1.FormControl('', { updateOn: 'blur' });
                    fixture.componentInstance.control = control;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'aa';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    control.markAsPristine();
                    expect(control.dirty).toBe(false, 'Expected control to become pristine.');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(control.dirty).toBe(false, 'Expected pending dirty value to reset.');
                });
                it('should update on blur with group updateOn', function () {
                    var fixture = initTest(FormGroupComp);
                    var control = new forms_1.FormControl('', forms_1.Validators.required);
                    var formGroup = new forms_1.FormGroup({ login: control }, { updateOn: 'blur' });
                    fixture.componentInstance.form = formGroup;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'Nancy';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    expect(control.value).toEqual('', 'Expected value to remain unchanged until blur.');
                    expect(control.valid).toBe(false, 'Expected no validation to occur until blur.');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(control.value)
                        .toEqual('Nancy', 'Expected value to change once control is blurred.');
                    expect(control.valid).toBe(true, 'Expected validation to run once control is blurred.');
                });
                it('should update on blur with array updateOn', function () {
                    var fixture = initTest(FormArrayComp);
                    var control = new forms_1.FormControl('', forms_1.Validators.required);
                    var cityArray = new forms_1.FormArray([control], { updateOn: 'blur' });
                    var formGroup = new forms_1.FormGroup({ cities: cityArray });
                    fixture.componentInstance.form = formGroup;
                    fixture.componentInstance.cityArray = cityArray;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'Nancy';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    expect(control.value).toEqual('', 'Expected value to remain unchanged until blur.');
                    expect(control.valid).toBe(false, 'Expected no validation to occur until blur.');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(control.value)
                        .toEqual('Nancy', 'Expected value to change once control is blurred.');
                    expect(control.valid).toBe(true, 'Expected validation to run once control is blurred.');
                });
                it('should allow child control updateOn blur to override group updateOn', function () {
                    var fixture = initTest(NestedFormGroupComp);
                    var loginControl = new forms_1.FormControl('', { validators: forms_1.Validators.required, updateOn: 'change' });
                    var passwordControl = new forms_1.FormControl('', forms_1.Validators.required);
                    var formGroup = new forms_1.FormGroup({ signin: new forms_1.FormGroup({ login: loginControl, password: passwordControl }) }, { updateOn: 'blur' });
                    fixture.componentInstance.form = formGroup;
                    fixture.detectChanges();
                    var _a = fixture.debugElement.queryAll(by_1.By.css('input')), loginInput = _a[0], passwordInput = _a[1];
                    loginInput.nativeElement.value = 'Nancy';
                    browser_util_1.dispatchEvent(loginInput.nativeElement, 'input');
                    fixture.detectChanges();
                    expect(loginControl.value).toEqual('Nancy', 'Expected value change on input.');
                    expect(loginControl.valid).toBe(true, 'Expected validation to run on input.');
                    passwordInput.nativeElement.value = 'Carson';
                    browser_util_1.dispatchEvent(passwordInput.nativeElement, 'input');
                    fixture.detectChanges();
                    expect(passwordControl.value)
                        .toEqual('', 'Expected value to remain unchanged until blur.');
                    expect(passwordControl.valid).toBe(false, 'Expected no validation to occur until blur.');
                    browser_util_1.dispatchEvent(passwordInput.nativeElement, 'blur');
                    fixture.detectChanges();
                    expect(passwordControl.value)
                        .toEqual('Carson', 'Expected value to change once control is blurred.');
                    expect(passwordControl.valid)
                        .toBe(true, 'Expected validation to run once control is blurred.');
                });
            });
            describe('on submit', function () {
                it('should set initial value and validity on init', function () {
                    var fixture = initTest(FormGroupComp);
                    var form = new forms_1.FormGroup({
                        login: new forms_1.FormControl('Nancy', { validators: forms_1.Validators.required, updateOn: 'submit' })
                    });
                    fixture.componentInstance.form = form;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    expect(input.value).toEqual('Nancy', 'Expected initial value to propagate to view.');
                    expect(form.value).toEqual({ login: 'Nancy' }, 'Expected initial value to be set.');
                    expect(form.valid).toBe(true, 'Expected form to run validation on initial value.');
                });
                it('should not update value or validity until submit', function () {
                    var fixture = initTest(FormGroupComp);
                    var formGroup = new forms_1.FormGroup({ login: new forms_1.FormControl('', { validators: forms_1.Validators.required, updateOn: 'submit' }) });
                    fixture.componentInstance.form = formGroup;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'Nancy';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    expect(formGroup.value)
                        .toEqual({ login: '' }, 'Expected form value to remain unchanged on input.');
                    expect(formGroup.valid).toBe(false, 'Expected form validation not to run on input.');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(formGroup.value)
                        .toEqual({ login: '' }, 'Expected form value to remain unchanged on blur.');
                    expect(formGroup.valid).toBe(false, 'Expected form validation not to run on blur.');
                    var form = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                    browser_util_1.dispatchEvent(form, 'submit');
                    fixture.detectChanges();
                    expect(formGroup.value)
                        .toEqual({ login: 'Nancy' }, 'Expected form value to update on submit.');
                    expect(formGroup.valid).toBe(true, 'Expected form validation to run on submit.');
                });
                it('should not update after submit until a second submit', function () {
                    var fixture = initTest(FormGroupComp);
                    var formGroup = new forms_1.FormGroup({ login: new forms_1.FormControl('', { validators: forms_1.Validators.required, updateOn: 'submit' }) });
                    fixture.componentInstance.form = formGroup;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'Nancy';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    var form = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                    browser_util_1.dispatchEvent(form, 'submit');
                    fixture.detectChanges();
                    input.value = '';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    expect(formGroup.value)
                        .toEqual({ login: 'Nancy' }, 'Expected value not to change until a second submit.');
                    expect(formGroup.valid)
                        .toBe(true, 'Expected validation not to run until a second submit.');
                    browser_util_1.dispatchEvent(form, 'submit');
                    fixture.detectChanges();
                    expect(formGroup.value)
                        .toEqual({ login: '' }, 'Expected value to update on the second submit.');
                    expect(formGroup.valid).toBe(false, 'Expected validation to run on a second submit.');
                });
                it('should not wait for submit to set value programmatically', function () {
                    var fixture = initTest(FormGroupComp);
                    var formGroup = new forms_1.FormGroup({ login: new forms_1.FormControl('', { validators: forms_1.Validators.required, updateOn: 'submit' }) });
                    fixture.componentInstance.form = formGroup;
                    fixture.detectChanges();
                    formGroup.setValue({ login: 'Nancy' });
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    expect(input.value).toEqual('Nancy', 'Expected view value to update immediately.');
                    expect(formGroup.value)
                        .toEqual({ login: 'Nancy' }, 'Expected form value to update immediately.');
                    expect(formGroup.valid).toBe(true, 'Expected form validation to run immediately.');
                });
                it('should not update dirty until submit', function () {
                    var fixture = initTest(FormGroupComp);
                    var formGroup = new forms_1.FormGroup({ login: new forms_1.FormControl('', { updateOn: 'submit' }) });
                    fixture.componentInstance.form = formGroup;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    expect(formGroup.dirty).toBe(false, 'Expected dirty not to change on input.');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(formGroup.dirty).toBe(false, 'Expected dirty not to change on blur.');
                    var form = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                    browser_util_1.dispatchEvent(form, 'submit');
                    fixture.detectChanges();
                    expect(formGroup.dirty).toBe(true, 'Expected dirty to update on submit.');
                });
                it('should not update touched until submit', function () {
                    var fixture = initTest(FormGroupComp);
                    var formGroup = new forms_1.FormGroup({ login: new forms_1.FormControl('', { updateOn: 'submit' }) });
                    fixture.componentInstance.form = formGroup;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(formGroup.touched).toBe(false, 'Expected touched not to change until submit.');
                    var form = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                    browser_util_1.dispatchEvent(form, 'submit');
                    fixture.detectChanges();
                    expect(formGroup.touched).toBe(true, 'Expected touched to update on submit.');
                });
                it('should reset properly', function () {
                    var fixture = initTest(FormGroupComp);
                    var formGroup = new forms_1.FormGroup({ login: new forms_1.FormControl('', { validators: forms_1.Validators.required, updateOn: 'submit' }) });
                    fixture.componentInstance.form = formGroup;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'Nancy';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    formGroup.reset();
                    fixture.detectChanges();
                    expect(input.value).toEqual('', 'Expected view value to reset.');
                    expect(formGroup.value).toEqual({ login: null }, 'Expected form value to reset');
                    expect(formGroup.dirty).toBe(false, 'Expected dirty to stay false on reset.');
                    expect(formGroup.touched).toBe(false, 'Expected touched to stay false on reset.');
                    var form = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                    browser_util_1.dispatchEvent(form, 'submit');
                    fixture.detectChanges();
                    expect(formGroup.value)
                        .toEqual({ login: null }, 'Expected form value to stay empty on submit');
                    expect(formGroup.dirty).toBe(false, 'Expected dirty to stay false on submit.');
                    expect(formGroup.touched).toBe(false, 'Expected touched to stay false on submit.');
                });
                it('should not emit valueChanges or statusChanges until submit', function () {
                    var fixture = initTest(FormGroupComp);
                    var control = new forms_1.FormControl('', { validators: forms_1.Validators.required, updateOn: 'submit' });
                    var formGroup = new forms_1.FormGroup({ login: control });
                    fixture.componentInstance.form = formGroup;
                    fixture.detectChanges();
                    var values = [];
                    var streams = rxjs_1.merge(control.valueChanges, control.statusChanges, formGroup.valueChanges, formGroup.statusChanges);
                    var sub = streams.subscribe(function (val) { return values.push(val); });
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'Nancy';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    expect(values).toEqual([], 'Expected no valueChanges or statusChanges on input');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(values).toEqual([], 'Expected no valueChanges or statusChanges on blur');
                    var form = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                    browser_util_1.dispatchEvent(form, 'submit');
                    fixture.detectChanges();
                    expect(values).toEqual(['Nancy', 'VALID', { login: 'Nancy' }, 'VALID'], 'Expected valueChanges and statusChanges to update on submit.');
                    sub.unsubscribe();
                });
                it('should not emit valueChanges or statusChanges on submit if value unchanged', function () {
                    var fixture = initTest(FormGroupComp);
                    var control = new forms_1.FormControl('', { validators: forms_1.Validators.required, updateOn: 'submit' });
                    var formGroup = new forms_1.FormGroup({ login: control });
                    fixture.componentInstance.form = formGroup;
                    fixture.detectChanges();
                    var values = [];
                    var streams = rxjs_1.merge(control.valueChanges, control.statusChanges, formGroup.valueChanges, formGroup.statusChanges);
                    var sub = streams.subscribe(function (val) { return values.push(val); });
                    var form = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                    browser_util_1.dispatchEvent(form, 'submit');
                    fixture.detectChanges();
                    expect(values).toEqual([], 'Expected no valueChanges or statusChanges if value unchanged.');
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'Nancy';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    expect(values).toEqual([], 'Expected no valueChanges or statusChanges on input.');
                    browser_util_1.dispatchEvent(form, 'submit');
                    fixture.detectChanges();
                    expect(values).toEqual(['Nancy', 'VALID', { login: 'Nancy' }, 'VALID'], 'Expected valueChanges and statusChanges on submit if value changed.');
                    browser_util_1.dispatchEvent(form, 'submit');
                    fixture.detectChanges();
                    expect(values).toEqual(['Nancy', 'VALID', { login: 'Nancy' }, 'VALID'], 'Expected valueChanges and statusChanges not to fire again if value unchanged.');
                    input.value = 'Bess';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    expect(values).toEqual(['Nancy', 'VALID', { login: 'Nancy' }, 'VALID'], 'Expected valueChanges and statusChanges not to fire on input after submit.');
                    browser_util_1.dispatchEvent(form, 'submit');
                    fixture.detectChanges();
                    expect(values).toEqual([
                        'Nancy', 'VALID', { login: 'Nancy' }, 'VALID', 'Bess', 'VALID', { login: 'Bess' },
                        'VALID'
                    ], 'Expected valueChanges and statusChanges to fire again on submit if value changed.');
                    sub.unsubscribe();
                });
                it('should not run validation for onChange controls on submit', function () {
                    var validatorSpy = jasmine.createSpy('validator');
                    var groupValidatorSpy = jasmine.createSpy('groupValidatorSpy');
                    var fixture = initTest(NestedFormGroupComp);
                    var formGroup = new forms_1.FormGroup({
                        signin: new forms_1.FormGroup({ login: new forms_1.FormControl(), password: new forms_1.FormControl() }),
                        email: new forms_1.FormControl('', { updateOn: 'submit' })
                    });
                    fixture.componentInstance.form = formGroup;
                    fixture.detectChanges();
                    formGroup.get('signin.login').setValidators(validatorSpy);
                    formGroup.get('signin').setValidators(groupValidatorSpy);
                    var form = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                    browser_util_1.dispatchEvent(form, 'submit');
                    fixture.detectChanges();
                    expect(validatorSpy).not.toHaveBeenCalled();
                    expect(groupValidatorSpy).not.toHaveBeenCalled();
                });
                it('should mark as untouched properly if pending touched', function () {
                    var fixture = initTest(FormGroupComp);
                    var formGroup = new forms_1.FormGroup({ login: new forms_1.FormControl('', { updateOn: 'submit' }) });
                    fixture.componentInstance.form = formGroup;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    formGroup.markAsUntouched();
                    fixture.detectChanges();
                    expect(formGroup.touched).toBe(false, 'Expected group to become untouched.');
                    var form = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                    browser_util_1.dispatchEvent(form, 'submit');
                    fixture.detectChanges();
                    expect(formGroup.touched).toBe(false, 'Expected touched to stay false on submit.');
                });
                it('should update on submit with group updateOn', function () {
                    var fixture = initTest(FormGroupComp);
                    var control = new forms_1.FormControl('', forms_1.Validators.required);
                    var formGroup = new forms_1.FormGroup({ login: control }, { updateOn: 'submit' });
                    fixture.componentInstance.form = formGroup;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'Nancy';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    expect(control.value).toEqual('', 'Expected value to remain unchanged until submit.');
                    expect(control.valid).toBe(false, 'Expected no validation to occur until submit.');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(control.value).toEqual('', 'Expected value to remain unchanged until submit.');
                    expect(control.valid).toBe(false, 'Expected no validation to occur until submit.');
                    var form = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                    browser_util_1.dispatchEvent(form, 'submit');
                    fixture.detectChanges();
                    expect(control.value).toEqual('Nancy', 'Expected value to change on submit.');
                    expect(control.valid).toBe(true, 'Expected validation to run on submit.');
                });
                it('should update on submit with array updateOn', function () {
                    var fixture = initTest(FormArrayComp);
                    var control = new forms_1.FormControl('', forms_1.Validators.required);
                    var cityArray = new forms_1.FormArray([control], { updateOn: 'submit' });
                    var formGroup = new forms_1.FormGroup({ cities: cityArray });
                    fixture.componentInstance.form = formGroup;
                    fixture.componentInstance.cityArray = cityArray;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'Nancy';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    expect(control.value).toEqual('', 'Expected value to remain unchanged until submit.');
                    expect(control.valid).toBe(false, 'Expected no validation to occur until submit.');
                    var form = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                    browser_util_1.dispatchEvent(form, 'submit');
                    fixture.detectChanges();
                    expect(control.value).toEqual('Nancy', 'Expected value to change once control on submit');
                    expect(control.valid).toBe(true, 'Expected validation to run on submit.');
                });
                it('should allow child control updateOn submit to override group updateOn', function () {
                    var fixture = initTest(NestedFormGroupComp);
                    var loginControl = new forms_1.FormControl('', { validators: forms_1.Validators.required, updateOn: 'change' });
                    var passwordControl = new forms_1.FormControl('', forms_1.Validators.required);
                    var formGroup = new forms_1.FormGroup({ signin: new forms_1.FormGroup({ login: loginControl, password: passwordControl }) }, { updateOn: 'submit' });
                    fixture.componentInstance.form = formGroup;
                    fixture.detectChanges();
                    var _a = fixture.debugElement.queryAll(by_1.By.css('input')), loginInput = _a[0], passwordInput = _a[1];
                    loginInput.nativeElement.value = 'Nancy';
                    browser_util_1.dispatchEvent(loginInput.nativeElement, 'input');
                    fixture.detectChanges();
                    expect(loginControl.value).toEqual('Nancy', 'Expected value change on input.');
                    expect(loginControl.valid).toBe(true, 'Expected validation to run on input.');
                    passwordInput.nativeElement.value = 'Carson';
                    browser_util_1.dispatchEvent(passwordInput.nativeElement, 'input');
                    fixture.detectChanges();
                    expect(passwordControl.value)
                        .toEqual('', 'Expected value to remain unchanged until submit.');
                    expect(passwordControl.valid)
                        .toBe(false, 'Expected no validation to occur until submit.');
                    var form = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                    browser_util_1.dispatchEvent(form, 'submit');
                    fixture.detectChanges();
                    expect(passwordControl.value).toEqual('Carson', 'Expected value to change on submit.');
                    expect(passwordControl.valid).toBe(true, 'Expected validation to run on submit.');
                });
            });
        });
        describe('ngModel interactions', function () {
            var warnSpy;
            beforeEach(function () {
                // Reset `_ngModelWarningSentOnce` on `FormControlDirective` and `FormControlName` types.
                forms_1.FormControlDirective._ngModelWarningSentOnce = false;
                forms_1.FormControlName._ngModelWarningSentOnce = false;
                warnSpy = spyOn(console, 'warn');
            });
            describe('deprecation warnings', function () {
                it('should warn once by default when using ngModel with formControlName', testing_1.fakeAsync(function () {
                    var fixture = initTest(FormGroupNgModel);
                    fixture.componentInstance.form =
                        new forms_1.FormGroup({ 'login': new forms_1.FormControl(''), 'password': new forms_1.FormControl('') });
                    fixture.detectChanges();
                    testing_1.tick();
                    expect(warnSpy.calls.count()).toEqual(1);
                    expect(warnSpy.calls.mostRecent().args[0])
                        .toMatch(/It looks like you're using ngModel on the same form field as formControlName/gi);
                    fixture.componentInstance.login = 'some value';
                    fixture.detectChanges();
                    testing_1.tick();
                    expect(warnSpy.calls.count()).toEqual(1);
                }));
                it('should warn once by default when using ngModel with formControl', testing_1.fakeAsync(function () {
                    var fixture = initTest(FormControlNgModel);
                    fixture.componentInstance.control = new forms_1.FormControl('');
                    fixture.componentInstance.passwordControl = new forms_1.FormControl('');
                    fixture.detectChanges();
                    testing_1.tick();
                    expect(warnSpy.calls.count()).toEqual(1);
                    expect(warnSpy.calls.mostRecent().args[0])
                        .toMatch(/It looks like you're using ngModel on the same form field as formControl/gi);
                    fixture.componentInstance.login = 'some value';
                    fixture.detectChanges();
                    testing_1.tick();
                    expect(warnSpy.calls.count()).toEqual(1);
                }));
                it('should warn once for each instance when global provider is provided with "always"', testing_1.fakeAsync(function () {
                    testing_1.TestBed.configureTestingModule({
                        declarations: [FormControlNgModel],
                        imports: [forms_1.ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'always' })]
                    });
                    var fixture = testing_1.TestBed.createComponent(FormControlNgModel);
                    fixture.componentInstance.control = new forms_1.FormControl('');
                    fixture.componentInstance.passwordControl = new forms_1.FormControl('');
                    fixture.detectChanges();
                    testing_1.tick();
                    expect(warnSpy.calls.count()).toEqual(2);
                    expect(warnSpy.calls.mostRecent().args[0])
                        .toMatch(/It looks like you're using ngModel on the same form field as formControl/gi);
                }));
                it('should silence warnings when global provider is provided with "never"', testing_1.fakeAsync(function () {
                    testing_1.TestBed.configureTestingModule({
                        declarations: [FormControlNgModel],
                        imports: [forms_1.ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' })]
                    });
                    var fixture = testing_1.TestBed.createComponent(FormControlNgModel);
                    fixture.componentInstance.control = new forms_1.FormControl('');
                    fixture.componentInstance.passwordControl = new forms_1.FormControl('');
                    fixture.detectChanges();
                    testing_1.tick();
                    expect(warnSpy).not.toHaveBeenCalled();
                }));
            });
            it('should support ngModel for complex forms', testing_1.fakeAsync(function () {
                var fixture = initTest(FormGroupNgModel);
                fixture.componentInstance.form =
                    new forms_1.FormGroup({ 'login': new forms_1.FormControl(''), 'password': new forms_1.FormControl('') });
                fixture.componentInstance.login = 'oldValue';
                fixture.detectChanges();
                testing_1.tick();
                var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                expect(input.value).toEqual('oldValue');
                input.value = 'updatedValue';
                browser_util_1.dispatchEvent(input, 'input');
                testing_1.tick();
                expect(fixture.componentInstance.login).toEqual('updatedValue');
            }));
            it('should support ngModel for single fields', testing_1.fakeAsync(function () {
                var fixture = initTest(FormControlNgModel);
                fixture.componentInstance.control = new forms_1.FormControl('');
                fixture.componentInstance.passwordControl = new forms_1.FormControl('');
                fixture.componentInstance.login = 'oldValue';
                fixture.detectChanges();
                testing_1.tick();
                var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                expect(input.value).toEqual('oldValue');
                input.value = 'updatedValue';
                browser_util_1.dispatchEvent(input, 'input');
                testing_1.tick();
                expect(fixture.componentInstance.login).toEqual('updatedValue');
            }));
            it('should not update the view when the value initially came from the view', testing_1.fakeAsync(function () {
                if (isNode)
                    return;
                var fixture = initTest(FormControlNgModel);
                fixture.componentInstance.control = new forms_1.FormControl('');
                fixture.componentInstance.passwordControl = new forms_1.FormControl('');
                fixture.detectChanges();
                testing_1.tick();
                var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                input.value = 'aa';
                input.setSelectionRange(1, 2);
                browser_util_1.dispatchEvent(input, 'input');
                fixture.detectChanges();
                testing_1.tick();
                // selection start has not changed because we did not reset the value
                expect(input.selectionStart).toEqual(1);
            }));
            it('should work with updateOn submit', testing_1.fakeAsync(function () {
                var fixture = initTest(FormGroupNgModel);
                var formGroup = new forms_1.FormGroup({ login: new forms_1.FormControl('', { updateOn: 'submit' }), password: new forms_1.FormControl('') });
                fixture.componentInstance.form = formGroup;
                fixture.componentInstance.login = 'initial';
                fixture.detectChanges();
                testing_1.tick();
                var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                input.value = 'Nancy';
                browser_util_1.dispatchEvent(input, 'input');
                fixture.detectChanges();
                testing_1.tick();
                expect(fixture.componentInstance.login)
                    .toEqual('initial', 'Expected ngModel value to remain unchanged on input.');
                var form = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                browser_util_1.dispatchEvent(form, 'submit');
                fixture.detectChanges();
                testing_1.tick();
                expect(fixture.componentInstance.login)
                    .toEqual('Nancy', 'Expected ngModel value to update on submit.');
            }));
        });
        describe('validations', function () {
            it('required validator should validate checkbox', function () {
                var fixture = initTest(FormControlCheckboxRequiredValidator);
                var control = new forms_1.FormControl(false, forms_1.Validators.requiredTrue);
                fixture.componentInstance.control = control;
                fixture.detectChanges();
                var checkbox = fixture.debugElement.query(by_1.By.css('input'));
                expect(checkbox.nativeElement.checked).toBe(false);
                expect(control.hasError('required')).toEqual(true);
                checkbox.nativeElement.checked = true;
                browser_util_1.dispatchEvent(checkbox.nativeElement, 'change');
                fixture.detectChanges();
                expect(checkbox.nativeElement.checked).toBe(true);
                expect(control.hasError('required')).toEqual(false);
            });
            it('should use sync validators defined in html', function () {
                var fixture = initTest(LoginIsEmptyWrapper, LoginIsEmptyValidator);
                var form = new forms_1.FormGroup({
                    'login': new forms_1.FormControl(''),
                    'min': new forms_1.FormControl(''),
                    'max': new forms_1.FormControl(''),
                    'pattern': new forms_1.FormControl('')
                });
                fixture.componentInstance.form = form;
                fixture.detectChanges();
                var required = fixture.debugElement.query(by_1.By.css('[required]'));
                var minLength = fixture.debugElement.query(by_1.By.css('[minlength]'));
                var maxLength = fixture.debugElement.query(by_1.By.css('[maxlength]'));
                var pattern = fixture.debugElement.query(by_1.By.css('[pattern]'));
                required.nativeElement.value = '';
                minLength.nativeElement.value = '1';
                maxLength.nativeElement.value = '1234';
                pattern.nativeElement.value = '12';
                browser_util_1.dispatchEvent(required.nativeElement, 'input');
                browser_util_1.dispatchEvent(minLength.nativeElement, 'input');
                browser_util_1.dispatchEvent(maxLength.nativeElement, 'input');
                browser_util_1.dispatchEvent(pattern.nativeElement, 'input');
                expect(form.hasError('required', ['login'])).toEqual(true);
                expect(form.hasError('minlength', ['min'])).toEqual(true);
                expect(form.hasError('maxlength', ['max'])).toEqual(true);
                expect(form.hasError('pattern', ['pattern'])).toEqual(true);
                expect(form.hasError('loginIsEmpty')).toEqual(true);
                required.nativeElement.value = '1';
                minLength.nativeElement.value = '123';
                maxLength.nativeElement.value = '123';
                pattern.nativeElement.value = '123';
                browser_util_1.dispatchEvent(required.nativeElement, 'input');
                browser_util_1.dispatchEvent(minLength.nativeElement, 'input');
                browser_util_1.dispatchEvent(maxLength.nativeElement, 'input');
                browser_util_1.dispatchEvent(pattern.nativeElement, 'input');
                expect(form.valid).toEqual(true);
            });
            it('should use sync validators using bindings', function () {
                var fixture = initTest(ValidationBindingsForm);
                var form = new forms_1.FormGroup({
                    'login': new forms_1.FormControl(''),
                    'min': new forms_1.FormControl(''),
                    'max': new forms_1.FormControl(''),
                    'pattern': new forms_1.FormControl('')
                });
                fixture.componentInstance.form = form;
                fixture.componentInstance.required = true;
                fixture.componentInstance.minLen = 3;
                fixture.componentInstance.maxLen = 3;
                fixture.componentInstance.pattern = '.{3,}';
                fixture.detectChanges();
                var required = fixture.debugElement.query(by_1.By.css('[name=required]'));
                var minLength = fixture.debugElement.query(by_1.By.css('[name=minlength]'));
                var maxLength = fixture.debugElement.query(by_1.By.css('[name=maxlength]'));
                var pattern = fixture.debugElement.query(by_1.By.css('[name=pattern]'));
                required.nativeElement.value = '';
                minLength.nativeElement.value = '1';
                maxLength.nativeElement.value = '1234';
                pattern.nativeElement.value = '12';
                browser_util_1.dispatchEvent(required.nativeElement, 'input');
                browser_util_1.dispatchEvent(minLength.nativeElement, 'input');
                browser_util_1.dispatchEvent(maxLength.nativeElement, 'input');
                browser_util_1.dispatchEvent(pattern.nativeElement, 'input');
                expect(form.hasError('required', ['login'])).toEqual(true);
                expect(form.hasError('minlength', ['min'])).toEqual(true);
                expect(form.hasError('maxlength', ['max'])).toEqual(true);
                expect(form.hasError('pattern', ['pattern'])).toEqual(true);
                required.nativeElement.value = '1';
                minLength.nativeElement.value = '123';
                maxLength.nativeElement.value = '123';
                pattern.nativeElement.value = '123';
                browser_util_1.dispatchEvent(required.nativeElement, 'input');
                browser_util_1.dispatchEvent(minLength.nativeElement, 'input');
                browser_util_1.dispatchEvent(maxLength.nativeElement, 'input');
                browser_util_1.dispatchEvent(pattern.nativeElement, 'input');
                expect(form.valid).toEqual(true);
            });
            it('changes on bound properties should change the validation state of the form', function () {
                var fixture = initTest(ValidationBindingsForm);
                var form = new forms_1.FormGroup({
                    'login': new forms_1.FormControl(''),
                    'min': new forms_1.FormControl(''),
                    'max': new forms_1.FormControl(''),
                    'pattern': new forms_1.FormControl('')
                });
                fixture.componentInstance.form = form;
                fixture.detectChanges();
                var required = fixture.debugElement.query(by_1.By.css('[name=required]'));
                var minLength = fixture.debugElement.query(by_1.By.css('[name=minlength]'));
                var maxLength = fixture.debugElement.query(by_1.By.css('[name=maxlength]'));
                var pattern = fixture.debugElement.query(by_1.By.css('[name=pattern]'));
                required.nativeElement.value = '';
                minLength.nativeElement.value = '1';
                maxLength.nativeElement.value = '1234';
                pattern.nativeElement.value = '12';
                browser_util_1.dispatchEvent(required.nativeElement, 'input');
                browser_util_1.dispatchEvent(minLength.nativeElement, 'input');
                browser_util_1.dispatchEvent(maxLength.nativeElement, 'input');
                browser_util_1.dispatchEvent(pattern.nativeElement, 'input');
                expect(form.hasError('required', ['login'])).toEqual(false);
                expect(form.hasError('minlength', ['min'])).toEqual(false);
                expect(form.hasError('maxlength', ['max'])).toEqual(false);
                expect(form.hasError('pattern', ['pattern'])).toEqual(false);
                expect(form.valid).toEqual(true);
                fixture.componentInstance.required = true;
                fixture.componentInstance.minLen = 3;
                fixture.componentInstance.maxLen = 3;
                fixture.componentInstance.pattern = '.{3,}';
                fixture.detectChanges();
                browser_util_1.dispatchEvent(required.nativeElement, 'input');
                browser_util_1.dispatchEvent(minLength.nativeElement, 'input');
                browser_util_1.dispatchEvent(maxLength.nativeElement, 'input');
                browser_util_1.dispatchEvent(pattern.nativeElement, 'input');
                expect(form.hasError('required', ['login'])).toEqual(true);
                expect(form.hasError('minlength', ['min'])).toEqual(true);
                expect(form.hasError('maxlength', ['max'])).toEqual(true);
                expect(form.hasError('pattern', ['pattern'])).toEqual(true);
                expect(form.valid).toEqual(false);
                expect(required.nativeElement.getAttribute('required')).toEqual('');
                expect(fixture.componentInstance.minLen.toString())
                    .toEqual(minLength.nativeElement.getAttribute('minlength'));
                expect(fixture.componentInstance.maxLen.toString())
                    .toEqual(maxLength.nativeElement.getAttribute('maxlength'));
                expect(fixture.componentInstance.pattern.toString())
                    .toEqual(pattern.nativeElement.getAttribute('pattern'));
                fixture.componentInstance.required = false;
                fixture.componentInstance.minLen = null;
                fixture.componentInstance.maxLen = null;
                fixture.componentInstance.pattern = null;
                fixture.detectChanges();
                expect(form.hasError('required', ['login'])).toEqual(false);
                expect(form.hasError('minlength', ['min'])).toEqual(false);
                expect(form.hasError('maxlength', ['max'])).toEqual(false);
                expect(form.hasError('pattern', ['pattern'])).toEqual(false);
                expect(form.valid).toEqual(true);
                expect(required.nativeElement.getAttribute('required')).toEqual(null);
                expect(required.nativeElement.getAttribute('minlength')).toEqual(null);
                expect(required.nativeElement.getAttribute('maxlength')).toEqual(null);
                expect(required.nativeElement.getAttribute('pattern')).toEqual(null);
            });
            it('should support rebound controls with rebound validators', function () {
                var fixture = initTest(ValidationBindingsForm);
                var form = new forms_1.FormGroup({
                    'login': new forms_1.FormControl(''),
                    'min': new forms_1.FormControl(''),
                    'max': new forms_1.FormControl(''),
                    'pattern': new forms_1.FormControl('')
                });
                fixture.componentInstance.form = form;
                fixture.componentInstance.required = true;
                fixture.componentInstance.minLen = 3;
                fixture.componentInstance.maxLen = 3;
                fixture.componentInstance.pattern = '.{3,}';
                fixture.detectChanges();
                var newForm = new forms_1.FormGroup({
                    'login': new forms_1.FormControl(''),
                    'min': new forms_1.FormControl(''),
                    'max': new forms_1.FormControl(''),
                    'pattern': new forms_1.FormControl('')
                });
                fixture.componentInstance.form = newForm;
                fixture.detectChanges();
                fixture.componentInstance.required = false;
                fixture.componentInstance.minLen = null;
                fixture.componentInstance.maxLen = null;
                fixture.componentInstance.pattern = null;
                fixture.detectChanges();
                expect(newForm.hasError('required', ['login'])).toEqual(false);
                expect(newForm.hasError('minlength', ['min'])).toEqual(false);
                expect(newForm.hasError('maxlength', ['max'])).toEqual(false);
                expect(newForm.hasError('pattern', ['pattern'])).toEqual(false);
                expect(newForm.valid).toEqual(true);
            });
            it('should use async validators defined in the html', testing_1.fakeAsync(function () {
                var fixture = initTest(UniqLoginWrapper, UniqLoginValidator);
                var form = new forms_1.FormGroup({ 'login': new forms_1.FormControl('') });
                testing_1.tick();
                fixture.componentInstance.form = form;
                fixture.detectChanges();
                expect(form.pending).toEqual(true);
                testing_1.tick(100);
                expect(form.hasError('uniqLogin', ['login'])).toEqual(true);
                var input = fixture.debugElement.query(by_1.By.css('input'));
                input.nativeElement.value = 'expected';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                testing_1.tick(100);
                expect(form.valid).toEqual(true);
            }));
            it('should use sync validators defined in the model', function () {
                var fixture = initTest(FormGroupComp);
                var form = new forms_1.FormGroup({ 'login': new forms_1.FormControl('aa', forms_1.Validators.required) });
                fixture.componentInstance.form = form;
                fixture.detectChanges();
                expect(form.valid).toEqual(true);
                var input = fixture.debugElement.query(by_1.By.css('input'));
                input.nativeElement.value = '';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                expect(form.valid).toEqual(false);
            });
            it('should use async validators defined in the model', testing_1.fakeAsync(function () {
                var fixture = initTest(FormGroupComp);
                var control = new forms_1.FormControl('', forms_1.Validators.required, uniqLoginAsyncValidator('expected'));
                var form = new forms_1.FormGroup({ 'login': control });
                fixture.componentInstance.form = form;
                fixture.detectChanges();
                testing_1.tick();
                expect(form.hasError('required', ['login'])).toEqual(true);
                var input = fixture.debugElement.query(by_1.By.css('input'));
                input.nativeElement.value = 'wrong value';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                expect(form.pending).toEqual(true);
                testing_1.tick();
                expect(form.hasError('uniqLogin', ['login'])).toEqual(true);
                input.nativeElement.value = 'expected';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                testing_1.tick();
                expect(form.valid).toEqual(true);
            }));
            it('async validator should not override result of sync validator', testing_1.fakeAsync(function () {
                var fixture = initTest(FormGroupComp);
                var control = new forms_1.FormControl('', forms_1.Validators.required, uniqLoginAsyncValidator('expected', 100));
                fixture.componentInstance.form = new forms_1.FormGroup({ 'login': control });
                fixture.detectChanges();
                testing_1.tick();
                expect(control.hasError('required')).toEqual(true);
                var input = fixture.debugElement.query(by_1.By.css('input'));
                input.nativeElement.value = 'expected';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                expect(control.pending).toEqual(true);
                input.nativeElement.value = '';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                testing_1.tick(110);
                expect(control.valid).toEqual(false);
            }));
            it('should cancel observable properly between validation runs', testing_1.fakeAsync(function () {
                var fixture = initTest(FormControlComp);
                var resultArr = [];
                fixture.componentInstance.control =
                    new forms_1.FormControl('', null, observableValidator(resultArr));
                fixture.detectChanges();
                testing_1.tick(100);
                expect(resultArr.length).toEqual(1, "Expected source observable to emit once on init.");
                var input = fixture.debugElement.query(by_1.By.css('input'));
                input.nativeElement.value = 'a';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                fixture.detectChanges();
                input.nativeElement.value = 'aa';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                fixture.detectChanges();
                testing_1.tick(100);
                expect(resultArr.length)
                    .toEqual(2, "Expected original observable to be canceled on the next value change.");
            }));
        });
        describe('errors', function () {
            it('should throw if a form isn\'t passed into formGroup', function () {
                var fixture = initTest(FormGroupComp);
                expect(function () { return fixture.detectChanges(); })
                    .toThrowError(new RegExp("formGroup expects a FormGroup instance"));
            });
            it('should throw if formControlName is used without a control container', function () {
                testing_1.TestBed.overrideComponent(FormGroupComp, {
                    set: {
                        template: "\n          <input type=\"text\" formControlName=\"login\">\n        "
                    }
                });
                var fixture = initTest(FormGroupComp);
                expect(function () { return fixture.detectChanges(); })
                    .toThrowError(new RegExp("formControlName must be used with a parent formGroup directive"));
            });
            it('should throw if formControlName is used with NgForm', function () {
                testing_1.TestBed.overrideComponent(FormGroupComp, {
                    set: {
                        template: "\n          <form>\n            <input type=\"text\" formControlName=\"login\">\n          </form>\n        "
                    }
                });
                var fixture = initTest(FormGroupComp);
                expect(function () { return fixture.detectChanges(); })
                    .toThrowError(new RegExp("formControlName must be used with a parent formGroup directive."));
            });
            it('should throw if formControlName is used with NgModelGroup', function () {
                testing_1.TestBed.overrideComponent(FormGroupComp, {
                    set: {
                        template: "\n          <form>\n            <div ngModelGroup=\"parent\">\n              <input type=\"text\" formControlName=\"login\">\n            </div>\n          </form>\n        "
                    }
                });
                var fixture = initTest(FormGroupComp);
                expect(function () { return fixture.detectChanges(); })
                    .toThrowError(new RegExp("formControlName cannot be used with an ngModelGroup parent."));
            });
            it('should throw if formGroupName is used without a control container', function () {
                testing_1.TestBed.overrideComponent(FormGroupComp, {
                    set: {
                        template: "\n          <div formGroupName=\"person\">\n            <input type=\"text\" formControlName=\"login\">\n          </div>\n        "
                    }
                });
                var fixture = initTest(FormGroupComp);
                expect(function () { return fixture.detectChanges(); })
                    .toThrowError(new RegExp("formGroupName must be used with a parent formGroup directive"));
            });
            it('should throw if formGroupName is used with NgForm', function () {
                testing_1.TestBed.overrideComponent(FormGroupComp, {
                    set: {
                        template: "\n          <form>\n            <div formGroupName=\"person\">\n              <input type=\"text\" formControlName=\"login\">\n            </div>\n          </form>\n        "
                    }
                });
                var fixture = initTest(FormGroupComp);
                expect(function () { return fixture.detectChanges(); })
                    .toThrowError(new RegExp("formGroupName must be used with a parent formGroup directive."));
            });
            it('should throw if formArrayName is used without a control container', function () {
                testing_1.TestBed.overrideComponent(FormGroupComp, {
                    set: {
                        template: "\n         <div formArrayName=\"cities\">\n           <input type=\"text\" formControlName=\"login\">\n         </div>"
                    }
                });
                var fixture = initTest(FormGroupComp);
                expect(function () { return fixture.detectChanges(); })
                    .toThrowError(new RegExp("formArrayName must be used with a parent formGroup directive"));
            });
            it('should throw if ngModel is used alone under formGroup', function () {
                testing_1.TestBed.overrideComponent(FormGroupComp, {
                    set: {
                        template: "\n         <div [formGroup]=\"form\">\n           <input type=\"text\" [(ngModel)]=\"data\">\n         </div>\n        "
                    }
                });
                var fixture = initTest(FormGroupComp);
                fixture.componentInstance.form = new forms_1.FormGroup({});
                expect(function () { return fixture.detectChanges(); })
                    .toThrowError(new RegExp("ngModel cannot be used to register form controls with a parent formGroup directive."));
            });
            it('should not throw if ngModel is used alone under formGroup with standalone: true', function () {
                testing_1.TestBed.overrideComponent(FormGroupComp, {
                    set: {
                        template: "\n         <div [formGroup]=\"form\">\n            <input type=\"text\" [(ngModel)]=\"data\" [ngModelOptions]=\"{standalone: true}\">\n         </div>\n        "
                    }
                });
                var fixture = initTest(FormGroupComp);
                fixture.componentInstance.form = new forms_1.FormGroup({});
                expect(function () { return fixture.detectChanges(); }).not.toThrowError();
            });
            it('should throw if ngModel is used alone with formGroupName', function () {
                testing_1.TestBed.overrideComponent(FormGroupComp, {
                    set: {
                        template: "\n          <div [formGroup]=\"form\">\n            <div formGroupName=\"person\">\n              <input type=\"text\" [(ngModel)]=\"data\">\n            </div>\n          </div>\n        "
                    }
                });
                var fixture = initTest(FormGroupComp);
                fixture.componentInstance.form = new forms_1.FormGroup({ person: new forms_1.FormGroup({}) });
                expect(function () { return fixture.detectChanges(); })
                    .toThrowError(new RegExp("ngModel cannot be used to register form controls with a parent formGroupName or formArrayName directive."));
            });
            it('should throw if ngModelGroup is used with formGroup', function () {
                testing_1.TestBed.overrideComponent(FormGroupComp, {
                    set: {
                        template: "\n          <div [formGroup]=\"form\">\n            <div ngModelGroup=\"person\">\n              <input type=\"text\" [(ngModel)]=\"data\">\n            </div>\n          </div>\n        "
                    }
                });
                var fixture = initTest(FormGroupComp);
                fixture.componentInstance.form = new forms_1.FormGroup({});
                expect(function () { return fixture.detectChanges(); })
                    .toThrowError(new RegExp("ngModelGroup cannot be used with a parent formGroup directive"));
            });
            it('should throw if radio button name does not match formControlName attr', function () {
                testing_1.TestBed.overrideComponent(FormGroupComp, {
                    set: {
                        template: "\n          <form [formGroup]=\"form\">hav\n            <input type=\"radio\" formControlName=\"food\" name=\"drink\" value=\"chicken\">\n          </form>"
                    }
                });
                var fixture = initTest(FormGroupComp);
                fixture.componentInstance.form = new forms_1.FormGroup({ 'food': new forms_1.FormControl('fish') });
                expect(function () { return fixture.detectChanges(); })
                    .toThrowError(new RegExp('If you define both a name and a formControlName'));
            });
        });
        describe('IME events', function () {
            it('should determine IME event handling depending on platform by default', function () {
                var fixture = initTest(FormControlComp);
                fixture.componentInstance.control = new forms_1.FormControl('oldValue');
                fixture.detectChanges();
                var inputEl = fixture.debugElement.query(by_1.By.css('input'));
                var inputNativeEl = inputEl.nativeElement;
                expect(inputNativeEl.value).toEqual('oldValue');
                inputEl.triggerEventHandler('compositionstart', null);
                inputNativeEl.value = 'updatedValue';
                browser_util_1.dispatchEvent(inputNativeEl, 'input');
                var isAndroid = /android (\d+)/.test(dom_adapter_1.getDOM().getUserAgent().toLowerCase());
                if (isAndroid) {
                    // On Android, values should update immediately
                    expect(fixture.componentInstance.control.value).toEqual('updatedValue');
                }
                else {
                    // On other platforms, values should wait for compositionend
                    expect(fixture.componentInstance.control.value).toEqual('oldValue');
                    inputEl.triggerEventHandler('compositionend', { target: { value: 'updatedValue' } });
                    fixture.detectChanges();
                    expect(fixture.componentInstance.control.value).toEqual('updatedValue');
                }
            });
            it('should hold IME events until compositionend if composition mode', function () {
                testing_1.TestBed.overrideComponent(FormControlComp, { set: { providers: [{ provide: forms_1.COMPOSITION_BUFFER_MODE, useValue: true }] } });
                var fixture = initTest(FormControlComp);
                fixture.componentInstance.control = new forms_1.FormControl('oldValue');
                fixture.detectChanges();
                var inputEl = fixture.debugElement.query(by_1.By.css('input'));
                var inputNativeEl = inputEl.nativeElement;
                expect(inputNativeEl.value).toEqual('oldValue');
                inputEl.triggerEventHandler('compositionstart', null);
                inputNativeEl.value = 'updatedValue';
                browser_util_1.dispatchEvent(inputNativeEl, 'input');
                // should not update when compositionstart
                expect(fixture.componentInstance.control.value).toEqual('oldValue');
                inputEl.triggerEventHandler('compositionend', { target: { value: 'updatedValue' } });
                fixture.detectChanges();
                // should update when compositionend
                expect(fixture.componentInstance.control.value).toEqual('updatedValue');
            });
            it('should work normally with composition events if composition mode is off', function () {
                testing_1.TestBed.overrideComponent(FormControlComp, { set: { providers: [{ provide: forms_1.COMPOSITION_BUFFER_MODE, useValue: false }] } });
                var fixture = initTest(FormControlComp);
                fixture.componentInstance.control = new forms_1.FormControl('oldValue');
                fixture.detectChanges();
                var inputEl = fixture.debugElement.query(by_1.By.css('input'));
                var inputNativeEl = inputEl.nativeElement;
                expect(inputNativeEl.value).toEqual('oldValue');
                inputEl.triggerEventHandler('compositionstart', null);
                inputNativeEl.value = 'updatedValue';
                browser_util_1.dispatchEvent(inputNativeEl, 'input');
                fixture.detectChanges();
                // formControl should update normally
                expect(fixture.componentInstance.control.value).toEqual('updatedValue');
            });
        });
    });
}
function uniqLoginAsyncValidator(expectedValue, timeout) {
    if (timeout === void 0) { timeout = 0; }
    return function (c) {
        var resolve;
        var promise = new Promise(function (res) { resolve = res; });
        var res = (c.value == expectedValue) ? null : { 'uniqLogin': true };
        setTimeout(function () { return resolve(res); }, timeout);
        return promise;
    };
}
function observableValidator(resultArr) {
    return function (c) {
        return rxjs_1.timer(100).pipe(operators_1.tap(function (resp) { return resultArr.push(resp); }));
    };
}
function loginIsEmptyGroupValidator(c) {
    return c.controls['login'].value == '' ? { 'loginIsEmpty': true } : null;
}
var LoginIsEmptyValidator = /** @class */ (function () {
    function LoginIsEmptyValidator() {
    }
    LoginIsEmptyValidator = __decorate([
        core_1.Directive({
            selector: '[login-is-empty-validator]',
            providers: [{ provide: forms_1.NG_VALIDATORS, useValue: loginIsEmptyGroupValidator, multi: true }]
        })
    ], LoginIsEmptyValidator);
    return LoginIsEmptyValidator;
}());
var UniqLoginValidator = /** @class */ (function () {
    function UniqLoginValidator() {
    }
    UniqLoginValidator_1 = UniqLoginValidator;
    UniqLoginValidator.prototype.validate = function (c) { return uniqLoginAsyncValidator(this.expected)(c); };
    var UniqLoginValidator_1;
    __decorate([
        core_1.Input('uniq-login-validator'),
        __metadata("design:type", Object)
    ], UniqLoginValidator.prototype, "expected", void 0);
    UniqLoginValidator = UniqLoginValidator_1 = __decorate([
        core_1.Directive({
            selector: '[uniq-login-validator]',
            providers: [{
                    provide: forms_1.NG_ASYNC_VALIDATORS,
                    useExisting: core_1.forwardRef(function () { return UniqLoginValidator_1; }),
                    multi: true
                }]
        })
    ], UniqLoginValidator);
    return UniqLoginValidator;
}());
function sortedClassList(el) {
    return dom_adapter_1.getDOM().classList(el).sort();
}
var FormControlComp = /** @class */ (function () {
    function FormControlComp() {
    }
    FormControlComp = __decorate([
        core_1.Component({ selector: 'form-control-comp', template: "<input type=\"text\" [formControl]=\"control\">" })
    ], FormControlComp);
    return FormControlComp;
}());
var FormGroupComp = /** @class */ (function () {
    function FormGroupComp() {
    }
    FormGroupComp = __decorate([
        core_1.Component({
            selector: 'form-group-comp',
            template: "\n    <form [formGroup]=\"form\" (ngSubmit)=\"event=$event\">\n      <input type=\"text\" formControlName=\"login\">\n    </form>"
        })
    ], FormGroupComp);
    return FormGroupComp;
}());
var NestedFormGroupComp = /** @class */ (function () {
    function NestedFormGroupComp() {
    }
    NestedFormGroupComp = __decorate([
        core_1.Component({
            selector: 'nested-form-group-comp',
            template: "\n    <form [formGroup]=\"form\">\n      <div formGroupName=\"signin\" login-is-empty-validator>\n        <input formControlName=\"login\">\n        <input formControlName=\"password\">\n      </div>\n      <input *ngIf=\"form.contains('email')\" formControlName=\"email\">\n    </form>"
        })
    ], NestedFormGroupComp);
    return NestedFormGroupComp;
}());
var FormArrayComp = /** @class */ (function () {
    function FormArrayComp() {
    }
    FormArrayComp = __decorate([
        core_1.Component({
            selector: 'form-array-comp',
            template: "\n    <form [formGroup]=\"form\">\n      <div formArrayName=\"cities\">\n        <div *ngFor=\"let city of cityArray.controls; let i=index\">\n          <input [formControlName]=\"i\">\n        </div>\n      </div>\n     </form>"
        })
    ], FormArrayComp);
    return FormArrayComp;
}());
var FormArrayNestedGroup = /** @class */ (function () {
    function FormArrayNestedGroup() {
    }
    FormArrayNestedGroup = __decorate([
        core_1.Component({
            selector: 'form-array-nested-group',
            template: "\n     <div [formGroup]=\"form\">\n      <div formArrayName=\"cities\">\n        <div *ngFor=\"let city of cityArray.controls; let i=index\" [formGroupName]=\"i\">\n          <input formControlName=\"town\">\n          <input formControlName=\"state\">\n        </div>\n      </div>\n     </div>"
        })
    ], FormArrayNestedGroup);
    return FormArrayNestedGroup;
}());
var FormGroupNgModel = /** @class */ (function () {
    function FormGroupNgModel() {
    }
    FormGroupNgModel = __decorate([
        core_1.Component({
            selector: 'form-group-ng-model',
            template: "\n  <form [formGroup]=\"form\">\n    <input type=\"text\" formControlName=\"login\" [(ngModel)]=\"login\">\n    <input type=\"text\" formControlName=\"password\" [(ngModel)]=\"password\">\n   </form>"
        })
    ], FormGroupNgModel);
    return FormGroupNgModel;
}());
var FormControlNgModel = /** @class */ (function () {
    function FormControlNgModel() {
    }
    FormControlNgModel = __decorate([
        core_1.Component({
            selector: 'form-control-ng-model',
            template: "\n    <input type=\"text\" [formControl]=\"control\" [(ngModel)]=\"login\">\n    <input type=\"text\" [formControl]=\"passwordControl\" [(ngModel)]=\"password\">\n  "
        })
    ], FormControlNgModel);
    return FormControlNgModel;
}());
var LoginIsEmptyWrapper = /** @class */ (function () {
    function LoginIsEmptyWrapper() {
    }
    LoginIsEmptyWrapper = __decorate([
        core_1.Component({
            selector: 'login-is-empty-wrapper',
            template: "\n    <div [formGroup]=\"form\" login-is-empty-validator>\n      <input type=\"text\" formControlName=\"login\" required>\n      <input type=\"text\" formControlName=\"min\" minlength=\"3\">\n      <input type=\"text\" formControlName=\"max\" maxlength=\"3\">\n      <input type=\"text\" formControlName=\"pattern\" pattern=\".{3,}\">\n   </div>"
        })
    ], LoginIsEmptyWrapper);
    return LoginIsEmptyWrapper;
}());
var ValidationBindingsForm = /** @class */ (function () {
    function ValidationBindingsForm() {
    }
    ValidationBindingsForm = __decorate([
        core_1.Component({
            selector: 'validation-bindings-form',
            template: "\n    <div [formGroup]=\"form\">\n      <input name=\"required\" type=\"text\" formControlName=\"login\" [required]=\"required\">\n      <input name=\"minlength\" type=\"text\" formControlName=\"min\" [minlength]=\"minLen\">\n      <input name=\"maxlength\" type=\"text\" formControlName=\"max\" [maxlength]=\"maxLen\">\n      <input name=\"pattern\" type=\"text\" formControlName=\"pattern\" [pattern]=\"pattern\">\n   </div>"
        })
    ], ValidationBindingsForm);
    return ValidationBindingsForm;
}());
var FormControlCheckboxRequiredValidator = /** @class */ (function () {
    function FormControlCheckboxRequiredValidator() {
    }
    FormControlCheckboxRequiredValidator = __decorate([
        core_1.Component({
            selector: 'form-control-checkbox-validator',
            template: "<input type=\"checkbox\" [formControl]=\"control\">"
        })
    ], FormControlCheckboxRequiredValidator);
    return FormControlCheckboxRequiredValidator;
}());
var UniqLoginWrapper = /** @class */ (function () {
    function UniqLoginWrapper() {
    }
    UniqLoginWrapper = __decorate([
        core_1.Component({
            selector: 'uniq-login-wrapper',
            template: "\n  <div [formGroup]=\"form\">\n    <input type=\"text\" formControlName=\"login\" uniq-login-validator=\"expected\">\n  </div>"
        })
    ], UniqLoginWrapper);
    return UniqLoginWrapper;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3RpdmVfaW50ZWdyYXRpb25fc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3Rlc3QvcmVhY3RpdmVfaW50ZWdyYXRpb25fc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUVILHNDQUE0RTtBQUM1RSxpREFBaUY7QUFDakYsd0NBQTBSO0FBQzFSLGlFQUE4RDtBQUM5RCw2RUFBcUU7QUFDckUsbUZBQWlGO0FBQ2pGLDZCQUFrQztBQUNsQyw0Q0FBbUM7QUFFbkMscUZBQXVFO0FBRXZFO0lBQ0UsUUFBUSxDQUFDLGtDQUFrQyxFQUFFO1FBRTNDLGtCQUFxQixTQUFrQjtZQUFFLG9CQUEwQjtpQkFBMUIsVUFBMEIsRUFBMUIscUJBQTBCLEVBQTFCLElBQTBCO2dCQUExQixtQ0FBMEI7O1lBQ2pFLGlCQUFPLENBQUMsc0JBQXNCLENBQzFCLEVBQUMsWUFBWSxHQUFHLFNBQVMsU0FBSyxVQUFVLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxtQkFBVyxFQUFFLDJCQUFtQixDQUFDLEVBQUMsQ0FBQyxDQUFDO1lBQzdGLE9BQU8saUJBQU8sQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDNUMsQ0FBQztRQUVELFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtZQUM5QixFQUFFLENBQUMsa0NBQWtDLEVBQUU7Z0JBQ3JDLElBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFDMUMsSUFBTSxPQUFPLEdBQUcsSUFBSSxtQkFBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUM3QyxPQUFPLENBQUMsaUJBQWlCLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztnQkFDNUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUV4QixnQkFBZ0I7Z0JBQ2hCLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMs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