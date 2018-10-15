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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var forms_1 = require("@angular/forms");
var by_1 = require("@angular/platform-browser/src/dom/debug/by");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var browser_util_1 = require("@angular/platform-browser/testing/src/browser_util");
var rxjs_1 = require("rxjs");
var value_accessor_integration_spec_1 = require("./value_accessor_integration_spec");
{
    describe('template-driven forms integration tests', function () {
        function initTest(component) {
            var directives = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                directives[_i - 1] = arguments[_i];
            }
            testing_1.TestBed.configureTestingModule({ declarations: [component].concat(directives), imports: [forms_1.FormsModule] });
            return testing_1.TestBed.createComponent(component);
        }
        describe('basic functionality', function () {
            it('should support ngModel for standalone fields', testing_1.fakeAsync(function () {
                var fixture = initTest(StandaloneNgModel);
                fixture.componentInstance.name = 'oldValue';
                fixture.detectChanges();
                testing_1.tick();
                // model -> view
                var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                expect(input.value).toEqual('oldValue');
                input.value = 'updatedValue';
                browser_util_1.dispatchEvent(input, 'input');
                testing_1.tick();
                // view -> model
                expect(fixture.componentInstance.name).toEqual('updatedValue');
            }));
            it('should support ngModel registration with a parent form', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelForm);
                fixture.componentInstance.name = 'Nancy';
                fixture.detectChanges();
                testing_1.tick();
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                expect(form.value).toEqual({ name: 'Nancy' });
                expect(form.valid).toBe(false);
            }));
            it('should add novalidate by default to form element', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelForm);
                fixture.detectChanges();
                testing_1.tick();
                var form = fixture.debugElement.query(by_1.By.css('form'));
                expect(form.nativeElement.getAttribute('novalidate')).toEqual('');
            }));
            it('should be possible to use native validation and angular forms', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelNativeValidateForm);
                fixture.detectChanges();
                testing_1.tick();
                var form = fixture.debugElement.query(by_1.By.css('form'));
                expect(form.nativeElement.hasAttribute('novalidate')).toEqual(false);
            }));
            it('should support ngModelGroup', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelGroupForm);
                fixture.componentInstance.first = 'Nancy';
                fixture.componentInstance.last = 'Drew';
                fixture.componentInstance.email = 'some email';
                fixture.detectChanges();
                testing_1.tick();
                // model -> view
                var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                expect(inputs[0].nativeElement.value).toEqual('Nancy');
                expect(inputs[1].nativeElement.value).toEqual('Drew');
                inputs[0].nativeElement.value = 'Carson';
                browser_util_1.dispatchEvent(inputs[0].nativeElement, 'input');
                testing_1.tick();
                // view -> model
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                expect(form.value).toEqual({ name: { first: 'Carson', last: 'Drew' }, email: 'some email' });
            }));
            it('should add controls and control groups to form control model', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelGroupForm);
                fixture.componentInstance.first = 'Nancy';
                fixture.componentInstance.last = 'Drew';
                fixture.componentInstance.email = 'some email';
                fixture.detectChanges();
                testing_1.tick();
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                expect(form.control.get('name').value).toEqual({ first: 'Nancy', last: 'Drew' });
                expect(form.control.get('name.first').value).toEqual('Nancy');
                expect(form.control.get('email').value).toEqual('some email');
            }));
            it('should remove controls and control groups from form control model', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelNgIfForm);
                fixture.componentInstance.emailShowing = true;
                fixture.componentInstance.first = 'Nancy';
                fixture.componentInstance.email = 'some email';
                fixture.detectChanges();
                testing_1.tick();
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                expect(form.control.get('email').value).toEqual('some email');
                expect(form.value).toEqual({ name: { first: 'Nancy' }, email: 'some email' });
                // should remove individual control successfully
                fixture.componentInstance.emailShowing = false;
                fixture.detectChanges();
                testing_1.tick();
                expect(form.control.get('email')).toBe(null);
                expect(form.value).toEqual({ name: { first: 'Nancy' } });
                expect(form.control.get('name').value).toEqual({ first: 'Nancy' });
                expect(form.control.get('name.first').value).toEqual('Nancy');
                // should remove form group successfully
                fixture.componentInstance.groupShowing = false;
                fixture.detectChanges();
                testing_1.tick();
                expect(form.control.get('name')).toBe(null);
                expect(form.control.get('name.first')).toBe(null);
                expect(form.value).toEqual({});
            }));
            it('should set status classes with ngModel', testing_1.async(function () {
                var fixture = initTest(NgModelForm);
                fixture.componentInstance.name = 'aa';
                fixture.detectChanges();
                fixture.whenStable().then(function () {
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
            }));
            it('should set status classes with ngModel and async validators', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelAsyncValidation, NgAsyncValidator);
                fixture.whenStable().then(function () {
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    expect(sortedClassList(input)).toEqual(['ng-pending', 'ng-pristine', 'ng-untouched']);
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(sortedClassList(input)).toEqual(['ng-pending', 'ng-pristine', 'ng-touched']);
                    input.value = 'updatedValue';
                    browser_util_1.dispatchEvent(input, 'input');
                    testing_1.tick();
                    fixture.detectChanges();
                    expect(sortedClassList(input)).toEqual(['ng-dirty', 'ng-touched', 'ng-valid']);
                });
            }));
            it('should set status classes with ngModelGroup and ngForm', testing_1.async(function () {
                var fixture = initTest(NgModelGroupForm);
                fixture.componentInstance.first = '';
                fixture.detectChanges();
                var form = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                var modelGroup = fixture.debugElement.query(by_1.By.css('[ngModelGroup]')).nativeElement;
                var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                // ngModelGroup creates its control asynchronously
                fixture.whenStable().then(function () {
                    fixture.detectChanges();
                    expect(sortedClassList(modelGroup)).toEqual([
                        'ng-invalid', 'ng-pristine', 'ng-untouched'
                    ]);
                    expect(sortedClassList(form)).toEqual(['ng-invalid', 'ng-pristine', 'ng-untouched']);
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(sortedClassList(modelGroup)).toEqual([
                        'ng-invalid', 'ng-pristine', 'ng-touched'
                    ]);
                    expect(sortedClassList(form)).toEqual(['ng-invalid', 'ng-pristine', 'ng-touched']);
                    input.value = 'updatedValue';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    expect(sortedClassList(modelGroup)).toEqual(['ng-dirty', 'ng-touched', 'ng-valid']);
                    expect(sortedClassList(form)).toEqual(['ng-dirty', 'ng-touched', 'ng-valid']);
                });
            }));
            it('should not create a template-driven form when ngNoForm is used', function () {
                var fixture = initTest(NgNoFormComp);
                fixture.detectChanges();
                expect(fixture.debugElement.children[0].providerTokens.length).toEqual(0);
            });
            it('should not add novalidate when ngNoForm is used', function () {
                var fixture = initTest(NgNoFormComp);
                fixture.detectChanges();
                var form = fixture.debugElement.query(by_1.By.css('form'));
                expect(form.nativeElement.hasAttribute('novalidate')).toEqual(false);
            });
        });
        describe('name and ngModelOptions', function () {
            it('should throw if ngModel has a parent form but no name attr or standalone label', function () {
                var fixture = initTest(InvalidNgModelNoName);
                expect(function () { return fixture.detectChanges(); })
                    .toThrowError(new RegExp("name attribute must be set"));
            });
            it('should not throw if ngModel has a parent form, no name attr, and a standalone label', function () {
                var fixture = initTest(NgModelOptionsStandalone);
                expect(function () { return fixture.detectChanges(); }).not.toThrow();
            });
            it('should not register standalone ngModels with parent form', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelOptionsStandalone);
                fixture.componentInstance.one = 'some data';
                fixture.componentInstance.two = 'should not show';
                fixture.detectChanges();
                testing_1.tick();
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                testing_1.tick();
                expect(form.value).toEqual({ one: 'some data' });
                expect(inputs[1].nativeElement.value).toEqual('should not show');
            }));
            it('should override name attribute with ngModelOptions name if provided', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelForm);
                fixture.componentInstance.options = { name: 'override' };
                fixture.componentInstance.name = 'some data';
                fixture.detectChanges();
                testing_1.tick();
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                expect(form.value).toEqual({ override: 'some data' });
            }));
        });
        describe('updateOn', function () {
            describe('blur', function () {
                it('should default updateOn to change', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelForm);
                    fixture.componentInstance.name = '';
                    fixture.componentInstance.options = {};
                    fixture.detectChanges();
                    testing_1.tick();
                    var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                    var name = form.control.get('name');
                    expect(name._updateOn).toBeUndefined();
                    expect(name.updateOn).toEqual('change');
                }));
                it('should set control updateOn to blur properly', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelForm);
                    fixture.componentInstance.name = '';
                    fixture.componentInstance.options = { updateOn: 'blur' };
                    fixture.detectChanges();
                    testing_1.tick();
                    var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                    var name = form.control.get('name');
                    expect(name._updateOn).toEqual('blur');
                    expect(name.updateOn).toEqual('blur');
                }));
                it('should always set value and validity on init', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelForm);
                    fixture.componentInstance.name = 'Nancy Drew';
                    fixture.componentInstance.options = { updateOn: 'blur' };
                    fixture.detectChanges();
                    testing_1.tick();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                    expect(input.value).toEqual('Nancy Drew', 'Expected initial view value to be set.');
                    expect(form.value)
                        .toEqual({ name: 'Nancy Drew' }, 'Expected initial control value be set.');
                    expect(form.valid).toBe(true, 'Expected validation to run on initial value.');
                }));
                it('should always set value programmatically right away', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelForm);
                    fixture.componentInstance.name = 'Nancy Drew';
                    fixture.componentInstance.options = { updateOn: 'blur' };
                    fixture.detectChanges();
                    testing_1.tick();
                    fixture.componentInstance.name = 'Carson';
                    fixture.detectChanges();
                    testing_1.tick();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                    expect(input.value)
                        .toEqual('Carson', 'Expected view value to update on programmatic change.');
                    expect(form.value)
                        .toEqual({ name: 'Carson' }, 'Expected form value to update on programmatic change.');
                    expect(form.valid)
                        .toBe(false, 'Expected validation to run immediately on programmatic change.');
                }));
                it('should update value/validity on blur', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelForm);
                    fixture.componentInstance.name = 'Carson';
                    fixture.componentInstance.options = { updateOn: 'blur' };
                    fixture.detectChanges();
                    testing_1.tick();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'Nancy Drew';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    testing_1.tick();
                    var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                    expect(fixture.componentInstance.name)
                        .toEqual('Carson', 'Expected value not to update on input.');
                    expect(form.valid).toBe(false, 'Expected validation not to run on input.');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(fixture.componentInstance.name)
                        .toEqual('Nancy Drew', 'Expected value to update on blur.');
                    expect(form.valid).toBe(true, 'Expected validation to run on blur.');
                }));
                it('should wait for second blur to update value/validity again', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelForm);
                    fixture.componentInstance.name = 'Carson';
                    fixture.componentInstance.options = { updateOn: 'blur' };
                    fixture.detectChanges();
                    testing_1.tick();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'Nancy Drew';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    input.value = 'Carson';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    testing_1.tick();
                    var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                    expect(fixture.componentInstance.name)
                        .toEqual('Nancy Drew', 'Expected value not to update until another blur.');
                    expect(form.valid).toBe(true, 'Expected validation not to run until another blur.');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(fixture.componentInstance.name)
                        .toEqual('Carson', 'Expected value to update on second blur.');
                    expect(form.valid).toBe(false, 'Expected validation to run on second blur.');
                }));
                it('should not update dirtiness until blur', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelForm);
                    fixture.componentInstance.name = '';
                    fixture.componentInstance.options = { updateOn: 'blur' };
                    fixture.detectChanges();
                    testing_1.tick();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'Nancy Drew';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    testing_1.tick();
                    var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                    expect(form.dirty).toBe(false, 'Expected dirtiness not to update on input.');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(form.dirty).toBe(true, 'Expected dirtiness to update on blur.');
                }));
                it('should not update touched until blur', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelForm);
                    fixture.componentInstance.name = '';
                    fixture.componentInstance.options = { updateOn: 'blur' };
                    fixture.detectChanges();
                    testing_1.tick();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'Nancy Drew';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    testing_1.tick();
                    var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                    expect(form.touched).toBe(false, 'Expected touched not to update on input.');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(form.touched).toBe(true, 'Expected touched to update on blur.');
                }));
                it('should not emit valueChanges or statusChanges until blur', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelForm);
                    fixture.componentInstance.name = '';
                    fixture.componentInstance.options = { updateOn: 'blur' };
                    fixture.detectChanges();
                    testing_1.tick();
                    var values = [];
                    var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                    var sub = rxjs_1.merge(form.valueChanges, form.statusChanges)
                        .subscribe(function (val) { return values.push(val); });
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'Nancy Drew';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    testing_1.tick();
                    expect(values).toEqual([], 'Expected no valueChanges or statusChanges on input.');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(values).toEqual([{ name: 'Nancy Drew' }, 'VALID'], 'Expected valueChanges and statusChanges on blur.');
                    sub.unsubscribe();
                }));
                it('should not fire ngModelChange event on blur unless value has changed', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelChangesForm);
                    fixture.componentInstance.name = 'Carson';
                    fixture.componentInstance.options = { updateOn: 'blur' };
                    fixture.detectChanges();
                    testing_1.tick();
                    expect(fixture.componentInstance.events)
                        .toEqual([], 'Expected ngModelChanges not to fire.');
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(fixture.componentInstance.events)
                        .toEqual([], 'Expected ngModelChanges not to fire if value unchanged.');
                    input.value = 'Carson';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    testing_1.tick();
                    expect(fixture.componentInstance.events)
                        .toEqual([], 'Expected ngModelChanges not to fire on input.');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(fixture.componentInstance.events)
                        .toEqual(['fired'], 'Expected ngModelChanges to fire once blurred if value changed.');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(fixture.componentInstance.events)
                        .toEqual(['fired'], 'Expected ngModelChanges not to fire again on blur unless value changed.');
                    input.value = 'Bess';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    testing_1.tick();
                    expect(fixture.componentInstance.events)
                        .toEqual(['fired'], 'Expected ngModelChanges not to fire on input after blur.');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(fixture.componentInstance.events)
                        .toEqual(['fired', 'fired'], 'Expected ngModelChanges to fire again on blur if value changed.');
                }));
            });
            describe('submit', function () {
                it('should set control updateOn to submit properly', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelForm);
                    fixture.componentInstance.name = '';
                    fixture.componentInstance.options = { updateOn: 'submit' };
                    fixture.detectChanges();
                    testing_1.tick();
                    var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                    var name = form.control.get('name');
                    expect(name._updateOn).toEqual('submit');
                    expect(name.updateOn).toEqual('submit');
                }));
                it('should always set value and validity on init', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelForm);
                    fixture.componentInstance.name = 'Nancy Drew';
                    fixture.componentInstance.options = { updateOn: 'submit' };
                    fixture.detectChanges();
                    testing_1.tick();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                    expect(input.value).toEqual('Nancy Drew', 'Expected initial view value to be set.');
                    expect(form.value)
                        .toEqual({ name: 'Nancy Drew' }, 'Expected initial control value be set.');
                    expect(form.valid).toBe(true, 'Expected validation to run on initial value.');
                }));
                it('should always set value programmatically right away', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelForm);
                    fixture.componentInstance.name = 'Nancy Drew';
                    fixture.componentInstance.options = { updateOn: 'submit' };
                    fixture.detectChanges();
                    testing_1.tick();
                    fixture.componentInstance.name = 'Carson';
                    fixture.detectChanges();
                    testing_1.tick();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                    expect(input.value)
                        .toEqual('Carson', 'Expected view value to update on programmatic change.');
                    expect(form.value)
                        .toEqual({ name: 'Carson' }, 'Expected form value to update on programmatic change.');
                    expect(form.valid)
                        .toBe(false, 'Expected validation to run immediately on programmatic change.');
                }));
                it('should update on submit', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelForm);
                    fixture.componentInstance.name = 'Carson';
                    fixture.componentInstance.options = { updateOn: 'submit' };
                    fixture.detectChanges();
                    testing_1.tick();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'Nancy Drew';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    testing_1.tick();
                    var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                    expect(fixture.componentInstance.name)
                        .toEqual('Carson', 'Expected value not to update on input.');
                    expect(form.valid).toBe(false, 'Expected validation not to run on input.');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    testing_1.tick();
                    expect(fixture.componentInstance.name)
                        .toEqual('Carson', 'Expected value not to update on blur.');
                    expect(form.valid).toBe(false, 'Expected validation not to run on blur.');
                    var formEl = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                    browser_util_1.dispatchEvent(formEl, 'submit');
                    fixture.detectChanges();
                    expect(fixture.componentInstance.name)
                        .toEqual('Nancy Drew', 'Expected value to update on submit.');
                    expect(form.valid).toBe(true, 'Expected validation to run on submit.');
                }));
                it('should wait until second submit to update again', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelForm);
                    fixture.componentInstance.name = 'Carson';
                    fixture.componentInstance.options = { updateOn: 'submit' };
                    fixture.detectChanges();
                    testing_1.tick();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'Nancy Drew';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    testing_1.tick();
                    var formEl = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                    browser_util_1.dispatchEvent(formEl, 'submit');
                    fixture.detectChanges();
                    testing_1.tick();
                    input.value = 'Carson';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    testing_1.tick();
                    var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                    expect(fixture.componentInstance.name)
                        .toEqual('Nancy Drew', 'Expected value not to update until second submit.');
                    expect(form.valid).toBe(true, 'Expected validation not to run until second submit.');
                    browser_util_1.dispatchEvent(formEl, 'submit');
                    fixture.detectChanges();
                    testing_1.tick();
                    expect(fixture.componentInstance.name)
                        .toEqual('Carson', 'Expected value to update on second submit.');
                    expect(form.valid).toBe(false, 'Expected validation to run on second submit.');
                }));
                it('should not run validation for onChange controls on submit', testing_1.fakeAsync(function () {
                    var validatorSpy = jasmine.createSpy('validator');
                    var groupValidatorSpy = jasmine.createSpy('groupValidatorSpy');
                    var fixture = initTest(NgModelGroupForm);
                    fixture.componentInstance.options = { updateOn: 'submit' };
                    fixture.detectChanges();
                    testing_1.tick();
                    var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                    form.control.get('name').setValidators(groupValidatorSpy);
                    form.control.get('name.last').setValidators(validatorSpy);
                    var formEl = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                    browser_util_1.dispatchEvent(formEl, 'submit');
                    fixture.detectChanges();
                    expect(validatorSpy).not.toHaveBeenCalled();
                    expect(groupValidatorSpy).not.toHaveBeenCalled();
                }));
                it('should not update dirtiness until submit', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelForm);
                    fixture.componentInstance.name = '';
                    fixture.componentInstance.options = { updateOn: 'submit' };
                    fixture.detectChanges();
                    testing_1.tick();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'Nancy Drew';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    testing_1.tick();
                    var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                    expect(form.dirty).toBe(false, 'Expected dirtiness not to update on input.');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    testing_1.tick();
                    expect(form.dirty).toBe(false, 'Expected dirtiness not to update on blur.');
                    var formEl = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                    browser_util_1.dispatchEvent(formEl, 'submit');
                    fixture.detectChanges();
                    expect(form.dirty).toBe(true, 'Expected dirtiness to update on submit.');
                }));
                it('should not update touched until submit', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelForm);
                    fixture.componentInstance.name = '';
                    fixture.componentInstance.options = { updateOn: 'submit' };
                    fixture.detectChanges();
                    testing_1.tick();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'Nancy Drew';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    testing_1.tick();
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    testing_1.tick();
                    var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                    expect(form.touched).toBe(false, 'Expected touched not to update on blur.');
                    var formEl = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                    browser_util_1.dispatchEvent(formEl, 'submit');
                    fixture.detectChanges();
                    expect(form.touched).toBe(true, 'Expected touched to update on submit.');
                }));
                it('should reset properly', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelForm);
                    fixture.componentInstance.name = 'Nancy';
                    fixture.componentInstance.options = { updateOn: 'submit' };
                    fixture.detectChanges();
                    testing_1.tick();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'Nancy Drew';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                    form.resetForm();
                    fixture.detectChanges();
                    testing_1.tick();
                    expect(input.value).toEqual('', 'Expected view value to reset.');
                    expect(form.value).toEqual({ name: null }, 'Expected form value to reset.');
                    expect(fixture.componentInstance.name)
                        .toEqual(null, 'Expected ngModel value to reset.');
                    expect(form.dirty).toBe(false, 'Expected dirty to stay false on reset.');
                    expect(form.touched).toBe(false, 'Expected touched to stay false on reset.');
                    var formEl = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                    browser_util_1.dispatchEvent(formEl, 'submit');
                    fixture.detectChanges();
                    expect(form.value)
                        .toEqual({ name: null }, 'Expected form value to stay empty on submit');
                    expect(fixture.componentInstance.name)
                        .toEqual(null, 'Expected ngModel value to stay empty on submit.');
                    expect(form.dirty).toBe(false, 'Expected dirty to stay false on submit.');
                    expect(form.touched).toBe(false, 'Expected touched to stay false on submit.');
                }));
                it('should not emit valueChanges or statusChanges until submit', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelForm);
                    fixture.componentInstance.name = '';
                    fixture.componentInstance.options = { updateOn: 'submit' };
                    fixture.detectChanges();
                    testing_1.tick();
                    var values = [];
                    var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                    var sub = rxjs_1.merge(form.valueChanges, form.statusChanges)
                        .subscribe(function (val) { return values.push(val); });
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'Nancy Drew';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    testing_1.tick();
                    expect(values).toEqual([], 'Expected no valueChanges or statusChanges on input.');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    testing_1.tick();
                    expect(values).toEqual([], 'Expected no valueChanges or statusChanges on blur.');
                    var formEl = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                    browser_util_1.dispatchEvent(formEl, 'submit');
                    fixture.detectChanges();
                    expect(values).toEqual([{ name: 'Nancy Drew' }, 'VALID'], 'Expected valueChanges and statusChanges on submit.');
                    sub.unsubscribe();
                }));
                it('should not fire ngModelChange event on submit unless value has changed', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelChangesForm);
                    fixture.componentInstance.name = 'Carson';
                    fixture.componentInstance.options = { updateOn: 'submit' };
                    fixture.detectChanges();
                    testing_1.tick();
                    var formEl = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                    browser_util_1.dispatchEvent(formEl, 'submit');
                    fixture.detectChanges();
                    expect(fixture.componentInstance.events)
                        .toEqual([], 'Expected ngModelChanges not to fire if value unchanged.');
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'Carson';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    testing_1.tick();
                    expect(fixture.componentInstance.events)
                        .toEqual([], 'Expected ngModelChanges not to fire on input.');
                    browser_util_1.dispatchEvent(formEl, 'submit');
                    fixture.detectChanges();
                    expect(fixture.componentInstance.events)
                        .toEqual(['fired'], 'Expected ngModelChanges to fire once submitted if value changed.');
                    browser_util_1.dispatchEvent(formEl, 'submit');
                    fixture.detectChanges();
                    expect(fixture.componentInstance.events)
                        .toEqual(['fired'], 'Expected ngModelChanges not to fire again on submit unless value changed.');
                    input.value = 'Bess';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    testing_1.tick();
                    expect(fixture.componentInstance.events)
                        .toEqual(['fired'], 'Expected ngModelChanges not to fire on input after submit.');
                    browser_util_1.dispatchEvent(formEl, 'submit');
                    fixture.detectChanges();
                    expect(fixture.componentInstance.events)
                        .toEqual(['fired', 'fired'], 'Expected ngModelChanges to fire again on submit if value changed.');
                }));
            });
            describe('ngFormOptions', function () {
                it('should use ngFormOptions value when ngModelOptions are not set', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelOptionsStandalone);
                    fixture.componentInstance.options = { name: 'two' };
                    fixture.componentInstance.formOptions = { updateOn: 'blur' };
                    fixture.detectChanges();
                    testing_1.tick();
                    var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                    var controlOne = form.control.get('one');
                    expect(controlOne._updateOn).toBeUndefined();
                    expect(controlOne.updateOn)
                        .toEqual('blur', 'Expected first control to inherit updateOn from parent form.');
                    var controlTwo = form.control.get('two');
                    expect(controlTwo._updateOn).toBeUndefined();
                    expect(controlTwo.updateOn)
                        .toEqual('blur', 'Expected last control to inherit updateOn from parent form.');
                }));
                it('should actually update using ngFormOptions value', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelOptionsStandalone);
                    fixture.componentInstance.one = '';
                    fixture.componentInstance.formOptions = { updateOn: 'blur' };
                    fixture.detectChanges();
                    testing_1.tick();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'Nancy Drew';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    testing_1.tick();
                    var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                    expect(form.value).toEqual({ one: '' }, 'Expected value not to update on input.');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(form.value).toEqual({ one: 'Nancy Drew' }, 'Expected value to update on blur.');
                }));
                it('should allow ngModelOptions updateOn to override ngFormOptions', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelOptionsStandalone);
                    fixture.componentInstance.options = { updateOn: 'blur', name: 'two' };
                    fixture.componentInstance.formOptions = { updateOn: 'change' };
                    fixture.detectChanges();
                    testing_1.tick();
                    var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                    var controlOne = form.control.get('one');
                    expect(controlOne._updateOn).toBeUndefined();
                    expect(controlOne.updateOn)
                        .toEqual('change', 'Expected control updateOn to inherit form updateOn.');
                    var controlTwo = form.control.get('two');
                    expect(controlTwo._updateOn)
                        .toEqual('blur', 'Expected control to set blur override.');
                    expect(controlTwo.updateOn)
                        .toEqual('blur', 'Expected control updateOn to override form updateOn.');
                }));
                it('should update using ngModelOptions override', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelOptionsStandalone);
                    fixture.componentInstance.one = '';
                    fixture.componentInstance.two = '';
                    fixture.componentInstance.options = { updateOn: 'blur', name: 'two' };
                    fixture.componentInstance.formOptions = { updateOn: 'change' };
                    fixture.detectChanges();
                    testing_1.tick();
                    var _a = fixture.debugElement.queryAll(by_1.By.css('input')), inputOne = _a[0], inputTwo = _a[1];
                    inputOne.nativeElement.value = 'Nancy Drew';
                    browser_util_1.dispatchEvent(inputOne.nativeElement, 'input');
                    fixture.detectChanges();
                    var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                    expect(form.value)
                        .toEqual({ one: 'Nancy Drew', two: '' }, 'Expected first value to update on input.');
                    inputTwo.nativeElement.value = 'Carson Drew';
                    browser_util_1.dispatchEvent(inputTwo.nativeElement, 'input');
                    fixture.detectChanges();
                    testing_1.tick();
                    expect(form.value)
                        .toEqual({ one: 'Nancy Drew', two: '' }, 'Expected second value not to update on input.');
                    browser_util_1.dispatchEvent(inputTwo.nativeElement, 'blur');
                    fixture.detectChanges();
                    expect(form.value)
                        .toEqual({ one: 'Nancy Drew', two: 'Carson Drew' }, 'Expected second value to update on blur.');
                }));
                it('should not use ngFormOptions for standalone ngModels', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelOptionsStandalone);
                    fixture.componentInstance.two = '';
                    fixture.componentInstance.options = { standalone: true };
                    fixture.componentInstance.formOptions = { updateOn: 'blur' };
                    fixture.detectChanges();
                    testing_1.tick();
                    var inputTwo = fixture.debugElement.queryAll(by_1.By.css('input'))[1].nativeElement;
                    inputTwo.value = 'Nancy Drew';
                    browser_util_1.dispatchEvent(inputTwo, 'input');
                    fixture.detectChanges();
                    expect(fixture.componentInstance.two)
                        .toEqual('Nancy Drew', 'Expected standalone ngModel not to inherit blur update.');
                }));
            });
        });
        describe('submit and reset events', function () {
            it('should emit ngSubmit event with the original submit event on submit', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelForm);
                fixture.componentInstance.event = null;
                var form = fixture.debugElement.query(by_1.By.css('form'));
                browser_util_1.dispatchEvent(form.nativeElement, 'submit');
                testing_1.tick();
                expect(fixture.componentInstance.event.type).toEqual('submit');
            }));
            it('should mark NgForm as submitted on submit event', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelForm);
                testing_1.tick();
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                expect(form.submitted).toBe(false);
                var formEl = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                browser_util_1.dispatchEvent(formEl, 'submit');
                testing_1.tick();
                expect(form.submitted).toBe(true);
            }));
            it('should reset the form to empty when reset event is fired', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelForm);
                fixture.componentInstance.name = 'should be cleared';
                fixture.detectChanges();
                testing_1.tick();
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                var formEl = fixture.debugElement.query(by_1.By.css('form'));
                var input = fixture.debugElement.query(by_1.By.css('input'));
                expect(input.nativeElement.value).toBe('should be cleared'); // view value
                expect(fixture.componentInstance.name).toBe('should be cleared'); // ngModel value
                expect(form.value.name).toEqual('should be cleared'); // control value
                browser_util_1.dispatchEvent(formEl.nativeElement, 'reset');
                fixture.detectChanges();
                testing_1.tick();
                expect(input.nativeElement.value).toBe(''); // view value
                expect(fixture.componentInstance.name).toBe(null); // ngModel value
                expect(form.value.name).toEqual(null); // control value
            }));
            it('should reset the form submit state when reset button is clicked', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelForm);
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                var formEl = fixture.debugElement.query(by_1.By.css('form'));
                browser_util_1.dispatchEvent(formEl.nativeElement, 'submit');
                fixture.detectChanges();
                testing_1.tick();
                expect(form.submitted).toBe(true);
                browser_util_1.dispatchEvent(formEl.nativeElement, 'reset');
                fixture.detectChanges();
                testing_1.tick();
                expect(form.submitted).toBe(false);
            }));
        });
        describe('valueChange and statusChange events', function () {
            it('should emit valueChanges and statusChanges on init', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelForm);
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                fixture.componentInstance.name = 'aa';
                fixture.detectChanges();
                expect(form.valid).toEqual(true);
                expect(form.value).toEqual({});
                var formValidity = undefined;
                var formValue = undefined;
                form.statusChanges.subscribe(function (status) { return formValidity = status; });
                form.valueChanges.subscribe(function (value) { return formValue = value; });
                testing_1.tick();
                expect(formValidity).toEqual('INVALID');
                expect(formValue).toEqual({ name: 'aa' });
            }));
            it('should mark controls dirty before emitting the value change event', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelForm);
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm).form;
                fixture.detectChanges();
                testing_1.tick();
                form.get('name').valueChanges.subscribe(function () { expect(form.get('name').dirty).toBe(true); });
                var inputEl = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                inputEl.value = 'newValue';
                browser_util_1.dispatchEvent(inputEl, 'input');
            }));
            it('should mark controls pristine before emitting the value change event when resetting ', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelForm);
                fixture.detectChanges();
                testing_1.tick();
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm).form;
                var formEl = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                var inputEl = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                inputEl.value = 'newValue';
                browser_util_1.dispatchEvent(inputEl, 'input');
                expect(form.get('name').pristine).toBe(false);
                form.get('name').valueChanges.subscribe(function () { expect(form.get('name').pristine).toBe(true); });
                browser_util_1.dispatchEvent(formEl, 'reset');
            }));
        });
        describe('disabled controls', function () {
            it('should not consider disabled controls in value or validation', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelGroupForm);
                fixture.componentInstance.isDisabled = false;
                fixture.componentInstance.first = '';
                fixture.componentInstance.last = 'Drew';
                fixture.componentInstance.email = 'some email';
                fixture.detectChanges();
                testing_1.tick();
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                expect(form.value).toEqual({ name: { first: '', last: 'Drew' }, email: 'some email' });
                expect(form.valid).toBe(false);
                expect(form.control.get('name.first').disabled).toBe(false);
                fixture.componentInstance.isDisabled = true;
                fixture.detectChanges();
                testing_1.tick();
                expect(form.value).toEqual({ name: { last: 'Drew' }, email: 'some email' });
                expect(form.valid).toBe(true);
                expect(form.control.get('name.first').disabled).toBe(true);
            }));
            it('should add disabled attribute in the UI if disable() is called programmatically', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelGroupForm);
                fixture.componentInstance.isDisabled = false;
                fixture.componentInstance.first = 'Nancy';
                fixture.detectChanges();
                testing_1.tick();
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                form.control.get('name.first').disable();
                fixture.detectChanges();
                testing_1.tick();
                var input = fixture.debugElement.query(by_1.By.css("[name=\"first\"]"));
                expect(input.nativeElement.disabled).toBe(true);
            }));
            it('should disable a custom control if disabled attr is added', testing_1.async(function () {
                var fixture = initTest(value_accessor_integration_spec_1.NgModelCustomWrapper, value_accessor_integration_spec_1.NgModelCustomComp);
                fixture.componentInstance.name = 'Nancy';
                fixture.componentInstance.isDisabled = true;
                fixture.detectChanges();
                fixture.whenStable().then(function () {
                    fixture.detectChanges();
                    fixture.whenStable().then(function () {
                        var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                        expect(form.control.get('name').disabled).toBe(true);
                        var customInput = fixture.debugElement.query(by_1.By.css('[name="custom"]'));
                        expect(customInput.nativeElement.disabled).toEqual(true);
                    });
                });
            }));
            it('should disable a control with unbound disabled attr', testing_1.fakeAsync(function () {
                testing_1.TestBed.overrideComponent(NgModelForm, {
                    set: {
                        template: "\n            <form>\n             <input name=\"name\" [(ngModel)]=\"name\" disabled>\n            </form>\n          ",
                    }
                });
                var fixture = initTest(NgModelForm);
                fixture.detectChanges();
                testing_1.tick();
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                expect(form.control.get('name').disabled).toBe(true);
                var input = fixture.debugElement.query(by_1.By.css('input'));
                expect(input.nativeElement.disabled).toEqual(true);
                form.control.enable();
                fixture.detectChanges();
                testing_1.tick();
                expect(input.nativeElement.disabled).toEqual(false);
            }));
        });
        describe('validation directives', function () {
            it('required validator should validate checkbox', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelCheckboxRequiredValidator);
                fixture.detectChanges();
                testing_1.tick();
                var control = fixture.debugElement.children[0].injector.get(forms_1.NgForm).control.get('checkbox');
                var input = fixture.debugElement.query(by_1.By.css('input'));
                expect(input.nativeElement.checked).toBe(false);
                expect(control.hasError('required')).toBe(false);
                fixture.componentInstance.required = true;
                fixture.detectChanges();
                testing_1.tick();
                expect(input.nativeElement.checked).toBe(false);
                expect(control.hasError('required')).toBe(true);
                input.nativeElement.checked = true;
                browser_util_1.dispatchEvent(input.nativeElement, 'change');
                fixture.detectChanges();
                testing_1.tick();
                expect(input.nativeElement.checked).toBe(true);
                expect(control.hasError('required')).toBe(false);
                input.nativeElement.checked = false;
                browser_util_1.dispatchEvent(input.nativeElement, 'change');
                fixture.detectChanges();
                testing_1.tick();
                expect(input.nativeElement.checked).toBe(false);
                expect(control.hasError('required')).toBe(true);
            }));
            it('should validate email', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelEmailValidator);
                fixture.detectChanges();
                testing_1.tick();
                var control = fixture.debugElement.children[0].injector.get(forms_1.NgForm).control.get('email');
                var input = fixture.debugElement.query(by_1.By.css('input'));
                expect(control.hasError('email')).toBe(false);
                fixture.componentInstance.validatorEnabled = true;
                fixture.detectChanges();
                testing_1.tick();
                expect(input.nativeElement.value).toEqual('');
                expect(control.hasError('email')).toBe(false);
                input.nativeElement.value = '@';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                testing_1.tick();
                expect(input.nativeElement.value).toEqual('@');
                expect(control.hasError('email')).toBe(true);
                input.nativeElement.value = 'test@gmail.com';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                fixture.detectChanges();
                testing_1.tick();
                expect(input.nativeElement.value).toEqual('test@gmail.com');
                expect(control.hasError('email')).toBe(false);
                input.nativeElement.value = 'text';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                fixture.detectChanges();
                testing_1.tick();
                expect(input.nativeElement.value).toEqual('text');
                expect(control.hasError('email')).toBe(true);
            }));
            it('should support dir validators using bindings', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelValidationBindings);
                fixture.componentInstance.required = true;
                fixture.componentInstance.minLen = 3;
                fixture.componentInstance.maxLen = 3;
                fixture.componentInstance.pattern = '.{3,}';
                fixture.detectChanges();
                testing_1.tick();
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
                fixture.detectChanges();
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                expect(form.control.hasError('required', ['required'])).toEqual(true);
                expect(form.control.hasError('minlength', ['minlength'])).toEqual(true);
                expect(form.control.hasError('maxlength', ['maxlength'])).toEqual(true);
                expect(form.control.hasError('pattern', ['pattern'])).toEqual(true);
                required.nativeElement.value = '1';
                minLength.nativeElement.value = '123';
                maxLength.nativeElement.value = '123';
                pattern.nativeElement.value = '123';
                browser_util_1.dispatchEvent(required.nativeElement, 'input');
                browser_util_1.dispatchEvent(minLength.nativeElement, 'input');
                browser_util_1.dispatchEvent(maxLength.nativeElement, 'input');
                browser_util_1.dispatchEvent(pattern.nativeElement, 'input');
                expect(form.valid).toEqual(true);
            }));
            it('should support optional fields with string pattern validator', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelMultipleValidators);
                fixture.componentInstance.required = false;
                fixture.componentInstance.pattern = '[a-z]+';
                fixture.detectChanges();
                testing_1.tick();
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                var input = fixture.debugElement.query(by_1.By.css('input'));
                input.nativeElement.value = '';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                fixture.detectChanges();
                expect(form.valid).toBeTruthy();
                input.nativeElement.value = '1';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                fixture.detectChanges();
                expect(form.valid).toBeFalsy();
                expect(form.control.hasError('pattern', ['tovalidate'])).toBeTruthy();
            }));
            it('should support optional fields with RegExp pattern validator', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelMultipleValidators);
                fixture.componentInstance.required = false;
                fixture.componentInstance.pattern = /^[a-z]+$/;
                fixture.detectChanges();
                testing_1.tick();
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                var input = fixture.debugElement.query(by_1.By.css('input'));
                input.nativeElement.value = '';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                fixture.detectChanges();
                expect(form.valid).toBeTruthy();
                input.nativeElement.value = '1';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                fixture.detectChanges();
                expect(form.valid).toBeFalsy();
                expect(form.control.hasError('pattern', ['tovalidate'])).toBeTruthy();
            }));
            it('should support optional fields with minlength validator', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelMultipleValidators);
                fixture.componentInstance.required = false;
                fixture.componentInstance.minLen = 2;
                fixture.detectChanges();
                testing_1.tick();
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                var input = fixture.debugElement.query(by_1.By.css('input'));
                input.nativeElement.value = '';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                fixture.detectChanges();
                expect(form.valid).toBeTruthy();
                input.nativeElement.value = '1';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                fixture.detectChanges();
                expect(form.valid).toBeFalsy();
                expect(form.control.hasError('minlength', ['tovalidate'])).toBeTruthy();
            }));
            it('changes on bound properties should change the validation state of the form', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelValidationBindings);
                fixture.detectChanges();
                testing_1.tick();
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
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                expect(form.control.hasError('required', ['required'])).toEqual(false);
                expect(form.control.hasError('minlength', ['minlength'])).toEqual(false);
                expect(form.control.hasError('maxlength', ['maxlength'])).toEqual(false);
                expect(form.control.hasError('pattern', ['pattern'])).toEqual(false);
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
                expect(form.control.hasError('required', ['required'])).toEqual(true);
                expect(form.control.hasError('minlength', ['minlength'])).toEqual(true);
                expect(form.control.hasError('maxlength', ['maxlength'])).toEqual(true);
                expect(form.control.hasError('pattern', ['pattern'])).toEqual(true);
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
                expect(form.control.hasError('required', ['required'])).toEqual(false);
                expect(form.control.hasError('minlength', ['minlength'])).toEqual(false);
                expect(form.control.hasError('maxlength', ['maxlength'])).toEqual(false);
                expect(form.control.hasError('pattern', ['pattern'])).toEqual(false);
                expect(form.valid).toEqual(true);
                expect(required.nativeElement.getAttribute('required')).toEqual(null);
                expect(required.nativeElement.getAttribute('minlength')).toEqual(null);
                expect(required.nativeElement.getAttribute('maxlength')).toEqual(null);
                expect(required.nativeElement.getAttribute('pattern')).toEqual(null);
            }));
            it('should update control status', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelChangeState);
                var inputEl = fixture.debugElement.query(by_1.By.css('input'));
                var inputNativeEl = inputEl.nativeElement;
                var onNgModelChange = jasmine.createSpy('onNgModelChange');
                fixture.componentInstance.onNgModelChange = onNgModelChange;
                fixture.detectChanges();
                testing_1.tick();
                expect(onNgModelChange).not.toHaveBeenCalled();
                inputNativeEl.value = 'updated';
                onNgModelChange.and.callFake(function (ngModel) {
                    expect(ngModel.invalid).toBe(true);
                    expect(ngModel.value).toBe('updated');
                });
                browser_util_1.dispatchEvent(inputNativeEl, 'input');
                expect(onNgModelChange).toHaveBeenCalled();
                testing_1.tick();
                inputNativeEl.value = '333';
                onNgModelChange.and.callFake(function (ngModel) {
                    expect(ngModel.invalid).toBe(false);
                    expect(ngModel.value).toBe('333');
                });
                browser_util_1.dispatchEvent(inputNativeEl, 'input');
                expect(onNgModelChange).toHaveBeenCalledTimes(2);
                testing_1.tick();
            }));
        });
        describe('IME events', function () {
            it('should determine IME event handling depending on platform by default', testing_1.fakeAsync(function () {
                var fixture = initTest(StandaloneNgModel);
                var inputEl = fixture.debugElement.query(by_1.By.css('input'));
                var inputNativeEl = inputEl.nativeElement;
                fixture.componentInstance.name = 'oldValue';
                fixture.detectChanges();
                testing_1.tick();
                expect(inputNativeEl.value).toEqual('oldValue');
                inputEl.triggerEventHandler('compositionstart', null);
                inputNativeEl.value = 'updatedValue';
                browser_util_1.dispatchEvent(inputNativeEl, 'input');
                testing_1.tick();
                var isAndroid = /android (\d+)/.test(dom_adapter_1.getDOM().getUserAgent().toLowerCase());
                if (isAndroid) {
                    // On Android, values should update immediately
                    expect(fixture.componentInstance.name).toEqual('updatedValue');
                }
                else {
                    // On other platforms, values should wait until compositionend
                    expect(fixture.componentInstance.name).toEqual('oldValue');
                    inputEl.triggerEventHandler('compositionend', { target: { value: 'updatedValue' } });
                    fixture.detectChanges();
                    testing_1.tick();
                    expect(fixture.componentInstance.name).toEqual('updatedValue');
                }
            }));
            it('should hold IME events until compositionend if composition mode', testing_1.fakeAsync(function () {
                testing_1.TestBed.overrideComponent(StandaloneNgModel, { set: { providers: [{ provide: forms_1.COMPOSITION_BUFFER_MODE, useValue: true }] } });
                var fixture = initTest(StandaloneNgModel);
                var inputEl = fixture.debugElement.query(by_1.By.css('input'));
                var inputNativeEl = inputEl.nativeElement;
                fixture.componentInstance.name = 'oldValue';
                fixture.detectChanges();
                testing_1.tick();
                expect(inputNativeEl.value).toEqual('oldValue');
                inputEl.triggerEventHandler('compositionstart', null);
                inputNativeEl.value = 'updatedValue';
                browser_util_1.dispatchEvent(inputNativeEl, 'input');
                testing_1.tick();
                // ngModel should not update when compositionstart
                expect(fixture.componentInstance.name).toEqual('oldValue');
                inputEl.triggerEventHandler('compositionend', { target: { value: 'updatedValue' } });
                fixture.detectChanges();
                testing_1.tick();
                // ngModel should update when compositionend
                expect(fixture.componentInstance.name).toEqual('updatedValue');
            }));
            it('should work normally with composition events if composition mode is off', testing_1.fakeAsync(function () {
                testing_1.TestBed.overrideComponent(StandaloneNgModel, { set: { providers: [{ provide: forms_1.COMPOSITION_BUFFER_MODE, useValue: false }] } });
                var fixture = initTest(StandaloneNgModel);
                var inputEl = fixture.debugElement.query(by_1.By.css('input'));
                var inputNativeEl = inputEl.nativeElement;
                fixture.componentInstance.name = 'oldValue';
                fixture.detectChanges();
                testing_1.tick();
                expect(inputNativeEl.value).toEqual('oldValue');
                inputEl.triggerEventHandler('compositionstart', null);
                inputNativeEl.value = 'updatedValue';
                browser_util_1.dispatchEvent(inputNativeEl, 'input');
                testing_1.tick();
                // ngModel should update normally
                expect(fixture.componentInstance.name).toEqual('updatedValue');
            }));
        });
        describe('ngModel corner cases', function () {
            it('should update the view when the model is set back to what used to be in the view', testing_1.fakeAsync(function () {
                var fixture = initTest(StandaloneNgModel);
                fixture.componentInstance.name = '';
                fixture.detectChanges();
                testing_1.tick();
                var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                input.value = 'aa';
                input.selectionStart = 1;
                browser_util_1.dispatchEvent(input, 'input');
                fixture.detectChanges();
                testing_1.tick();
                expect(fixture.componentInstance.name).toEqual('aa');
                // Programmatically update the input value to be "bb".
                fixture.componentInstance.name = 'bb';
                fixture.detectChanges();
                testing_1.tick();
                expect(input.value).toEqual('bb');
                // Programatically set it back to "aa".
                fixture.componentInstance.name = 'aa';
                fixture.detectChanges();
                testing_1.tick();
                expect(input.value).toEqual('aa');
            }));
            it('should not crash when validity is checked from a binding', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelValidBinding);
                testing_1.tick();
                expect(function () { return fixture.detectChanges(); }).not.toThrowError();
            }));
        });
    });
}
var StandaloneNgModel = /** @class */ (function () {
    function StandaloneNgModel() {
    }
    StandaloneNgModel = __decorate([
        core_1.Component({
            selector: 'standalone-ng-model',
            template: "\n    <input type=\"text\" [(ngModel)]=\"name\">\n  "
        })
    ], StandaloneNgModel);
    return StandaloneNgModel;
}());
var NgModelForm = /** @class */ (function () {
    function NgModelForm() {
        this.options = {};
    }
    NgModelForm.prototype.onReset = function () { };
    NgModelForm = __decorate([
        core_1.Component({
            selector: 'ng-model-form',
            template: "\n    <form (ngSubmit)=\"event=$event\" (reset)=\"onReset()\">\n      <input name=\"name\" [(ngModel)]=\"name\" minlength=\"10\" [ngModelOptions]=\"options\">\n    </form>\n  "
        })
    ], NgModelForm);
    return NgModelForm;
}());
var NgModelNativeValidateForm = /** @class */ (function () {
    function NgModelNativeValidateForm() {
    }
    NgModelNativeValidateForm = __decorate([
        core_1.Component({ selector: 'ng-model-native-validate-form', template: "<form ngNativeValidate></form>" })
    ], NgModelNativeValidateForm);
    return NgModelNativeValidateForm;
}());
var NgModelGroupForm = /** @class */ (function () {
    function NgModelGroupForm() {
        this.options = { updateOn: 'change' };
    }
    NgModelGroupForm = __decorate([
        core_1.Component({
            selector: 'ng-model-group-form',
            template: "\n    <form>\n      <div ngModelGroup=\"name\">\n        <input name=\"first\" [(ngModel)]=\"first\" required [disabled]=\"isDisabled\">\n        <input name=\"last\" [(ngModel)]=\"last\">\n      </div>\n      <input name=\"email\" [(ngModel)]=\"email\" [ngModelOptions]=\"options\">\n    </form>\n  "
        })
    ], NgModelGroupForm);
    return NgModelGroupForm;
}());
var NgModelValidBinding = /** @class */ (function () {
    function NgModelValidBinding() {
    }
    NgModelValidBinding = __decorate([
        core_1.Component({
            selector: 'ng-model-valid-binding',
            template: "\n    <form>\n      <div ngModelGroup=\"name\" #group=\"ngModelGroup\">\n        <input name=\"first\" [(ngModel)]=\"first\" required>\n        {{ group.valid }}\n      </div>\n    </form>\n  "
        })
    ], NgModelValidBinding);
    return NgModelValidBinding;
}());
var NgModelNgIfForm = /** @class */ (function () {
    function NgModelNgIfForm() {
        this.groupShowing = true;
        this.emailShowing = true;
    }
    NgModelNgIfForm = __decorate([
        core_1.Component({
            selector: 'ng-model-ngif-form',
            template: "\n    <form>\n      <div ngModelGroup=\"name\" *ngIf=\"groupShowing\">\n        <input name=\"first\" [(ngModel)]=\"first\">\n      </div>\n      <input name=\"email\" [(ngModel)]=\"email\" *ngIf=\"emailShowing\">\n    </form>\n  "
        })
    ], NgModelNgIfForm);
    return NgModelNgIfForm;
}());
var NgNoFormComp = /** @class */ (function () {
    function NgNoFormComp() {
    }
    NgNoFormComp = __decorate([
        core_1.Component({
            selector: 'ng-no-form',
            template: "\n    <form ngNoForm>\n      <input name=\"name\">\n    </form>\n  "
        })
    ], NgNoFormComp);
    return NgNoFormComp;
}());
var InvalidNgModelNoName = /** @class */ (function () {
    function InvalidNgModelNoName() {
    }
    InvalidNgModelNoName = __decorate([
        core_1.Component({
            selector: 'invalid-ng-model-noname',
            template: "\n    <form>\n      <input [(ngModel)]=\"name\">\n    </form>\n  "
        })
    ], InvalidNgModelNoName);
    return InvalidNgModelNoName;
}());
var NgModelOptionsStandalone = /** @class */ (function () {
    function NgModelOptionsStandalone() {
        this.options = { standalone: true };
        this.formOptions = {};
    }
    NgModelOptionsStandalone = __decorate([
        core_1.Component({
            selector: 'ng-model-options-standalone',
            template: "\n    <form [ngFormOptions]=\"formOptions\">\n      <input name=\"one\" [(ngModel)]=\"one\">\n      <input [(ngModel)]=\"two\" [ngModelOptions]=\"options\">\n    </form>\n  "
        })
    ], NgModelOptionsStandalone);
    return NgModelOptionsStandalone;
}());
var NgModelValidationBindings = /** @class */ (function () {
    function NgModelValidationBindings() {
    }
    NgModelValidationBindings = __decorate([
        core_1.Component({
            selector: 'ng-model-validation-bindings',
            template: "\n    <form>\n      <input name=\"required\" ngModel  [required]=\"required\">\n      <input name=\"minlength\" ngModel  [minlength]=\"minLen\">\n      <input name=\"maxlength\" ngModel [maxlength]=\"maxLen\">\n      <input name=\"pattern\" ngModel  [pattern]=\"pattern\">\n    </form>\n  "
        })
    ], NgModelValidationBindings);
    return NgModelValidationBindings;
}());
var NgModelMultipleValidators = /** @class */ (function () {
    function NgModelMultipleValidators() {
    }
    NgModelMultipleValidators = __decorate([
        core_1.Component({
            selector: 'ng-model-multiple-validators',
            template: "\n    <form>\n      <input name=\"tovalidate\" ngModel  [required]=\"required\" [minlength]=\"minLen\" [pattern]=\"pattern\">\n    </form>\n  "
        })
    ], NgModelMultipleValidators);
    return NgModelMultipleValidators;
}());
var NgModelCheckboxRequiredValidator = /** @class */ (function () {
    function NgModelCheckboxRequiredValidator() {
        this.accepted = false;
        this.required = false;
    }
    NgModelCheckboxRequiredValidator = __decorate([
        core_1.Component({
            selector: 'ng-model-checkbox-validator',
            template: "<form><input type=\"checkbox\" [(ngModel)]=\"accepted\" [required]=\"required\" name=\"checkbox\"></form>"
        })
    ], NgModelCheckboxRequiredValidator);
    return NgModelCheckboxRequiredValidator;
}());
var NgModelEmailValidator = /** @class */ (function () {
    function NgModelEmailValidator() {
        this.validatorEnabled = false;
    }
    NgModelEmailValidator = __decorate([
        core_1.Component({
            selector: 'ng-model-email',
            template: "<form><input type=\"email\" ngModel [email]=\"validatorEnabled\" name=\"email\"></form>"
        })
    ], NgModelEmailValidator);
    return NgModelEmailValidator;
}());
var NgAsyncValidator = /** @class */ (function () {
    function NgAsyncValidator() {
    }
    NgAsyncValidator_1 = NgAsyncValidator;
    NgAsyncValidator.prototype.validate = function (c) { return Promise.resolve(null); };
    var NgAsyncValidator_1;
    NgAsyncValidator = NgAsyncValidator_1 = __decorate([
        core_1.Directive({
            selector: '[ng-async-validator]',
            providers: [
                { provide: forms_1.NG_ASYNC_VALIDATORS, useExisting: core_1.forwardRef(function () { return NgAsyncValidator_1; }), multi: true }
            ]
        })
    ], NgAsyncValidator);
    return NgAsyncValidator;
}());
var NgModelAsyncValidation = /** @class */ (function () {
    function NgModelAsyncValidation() {
    }
    NgModelAsyncValidation = __decorate([
        core_1.Component({
            selector: 'ng-model-async-validation',
            template: "<input name=\"async\" ngModel ng-async-validator>"
        })
    ], NgModelAsyncValidation);
    return NgModelAsyncValidation;
}());
var NgModelChangesForm = /** @class */ (function () {
    function NgModelChangesForm() {
        this.events = [];
    }
    NgModelChangesForm.prototype.log = function () { this.events.push('fired'); };
    NgModelChangesForm = __decorate([
        core_1.Component({
            selector: 'ng-model-changes-form',
            template: "\n    <form>\n      <input name=\"async\" [ngModel]=\"name\" (ngModelChange)=\"log()\" \n             [ngModelOptions]=\"options\">\n    </form>\n  "
        })
    ], NgModelChangesForm);
    return NgModelChangesForm;
}());
var NgModelChangeState = /** @class */ (function () {
    function NgModelChangeState() {
        this.onNgModelChange = function () { };
    }
    NgModelChangeState = __decorate([
        core_1.Component({
            selector: 'ng-model-change-state',
            template: "\n    <input #ngModel=\"ngModel\" ngModel [maxlength]=\"4\"\n           (ngModelChange)=\"onNgModelChange(ngModel)\">\n  "
        })
    ], NgModelChangeState);
    return NgModelChangeState;
}());
function sortedClassList(el) {
    var l = dom_adapter_1.getDOM().classList(el);
    l.sort();
    return l;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGVfaW50ZWdyYXRpb25fc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3Rlc3QvdGVtcGxhdGVfaW50ZWdyYXRpb25fc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILHNDQUFxRTtBQUNyRSxpREFBd0Y7QUFDeEYsd0NBQXdKO0FBQ3hKLGlFQUE4RDtBQUM5RCw2RUFBcUU7QUFDckUsbUZBQWlGO0FBQ2pGLDZCQUEyQjtBQUUzQixxRkFBMEY7QUFFMUY7SUFDRSxRQUFRLENBQUMseUNBQXlDLEVBQUU7UUFFbEQsa0JBQXFCLFNBQWtCO1lBQUUsb0JBQTBCO2lCQUExQixVQUEwQixFQUExQixxQkFBMEIsRUFBMUIsSUFBMEI7Z0JBQTFCLG1DQUEwQjs7WUFDakUsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FDMUIsRUFBQyxZQUFZLEdBQUcsU0FBUyxTQUFLLFVBQVUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLG1CQUFXLENBQUMsRUFBQyxDQUFDLENBQUM7WUFDeEUsT0FBTyxpQkFBTyxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM1QyxDQUFDO1FBRUQsUUFBUSxDQUFDLHFCQUFxQixFQUFFO1lBQzlCLEVBQUUsQ0FBQyw4Q0FBOEMsRUFBRSxtQkFBUyxDQUFDO2dCQUN4RCxJQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFDNUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7Z0JBRTVDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDeEIsY0FBSSxFQUFFLENBQUM7Z0JBRVAsZ0JBQWdCO2dCQUNoQixJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxPQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENB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