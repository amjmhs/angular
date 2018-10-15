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
var browser_util_1 = require("@angular/platform-browser/testing/src/browser_util");
{
    describe('value accessors', function () {
        function initTest(component) {
            var directives = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                directives[_i - 1] = arguments[_i];
            }
            testing_1.TestBed.configureTestingModule({ declarations: [component].concat(directives), imports: [forms_1.FormsModule, forms_1.ReactiveFormsModule] });
            return testing_1.TestBed.createComponent(component);
        }
        it('should support <input> without type', function () {
            testing_1.TestBed.overrideComponent(FormControlComp, { set: { template: "<input [formControl]=\"control\">" } });
            var fixture = initTest(FormControlComp);
            var control = new forms_1.FormControl('old');
            fixture.componentInstance.control = control;
            fixture.detectChanges();
            // model -> view
            var input = fixture.debugElement.query(by_1.By.css('input'));
            expect(input.nativeElement.value).toEqual('old');
            input.nativeElement.value = 'new';
            browser_util_1.dispatchEvent(input.nativeElement, 'input');
            // view -> model
            expect(control.value).toEqual('new');
        });
        it('should support <input type=text>', function () {
            var fixture = initTest(FormGroupComp);
            var form = new forms_1.FormGroup({ 'login': new forms_1.FormControl('old') });
            fixture.componentInstance.form = form;
            fixture.detectChanges();
            // model -> view
            var input = fixture.debugElement.query(by_1.By.css('input'));
            expect(input.nativeElement.value).toEqual('old');
            input.nativeElement.value = 'new';
            browser_util_1.dispatchEvent(input.nativeElement, 'input');
            // view -> model
            expect(form.value).toEqual({ 'login': 'new' });
        });
        it('should ignore the change event for <input type=text>', function () {
            var fixture = initTest(FormGroupComp);
            var form = new forms_1.FormGroup({ 'login': new forms_1.FormControl('oldValue') });
            fixture.componentInstance.form = form;
            fixture.detectChanges();
            var input = fixture.debugElement.query(by_1.By.css('input'));
            form.valueChanges.subscribe({ next: function (value) { throw 'Should not happen'; } });
            input.nativeElement.value = 'updatedValue';
            browser_util_1.dispatchEvent(input.nativeElement, 'change');
        });
        it('should support <textarea>', function () {
            testing_1.TestBed.overrideComponent(FormControlComp, { set: { template: "<textarea [formControl]=\"control\"></textarea>" } });
            var fixture = initTest(FormControlComp);
            var control = new forms_1.FormControl('old');
            fixture.componentInstance.control = control;
            fixture.detectChanges();
            // model -> view
            var textarea = fixture.debugElement.query(by_1.By.css('textarea'));
            expect(textarea.nativeElement.value).toEqual('old');
            textarea.nativeElement.value = 'new';
            browser_util_1.dispatchEvent(textarea.nativeElement, 'input');
            // view -> model
            expect(control.value).toEqual('new');
        });
        it('should support <type=checkbox>', function () {
            testing_1.TestBed.overrideComponent(FormControlComp, { set: { template: "<input type=\"checkbox\" [formControl]=\"control\">" } });
            var fixture = initTest(FormControlComp);
            var control = new forms_1.FormControl(true);
            fixture.componentInstance.control = control;
            fixture.detectChanges();
            // model -> view
            var input = fixture.debugElement.query(by_1.By.css('input'));
            expect(input.nativeElement.checked).toBe(true);
            input.nativeElement.checked = false;
            browser_util_1.dispatchEvent(input.nativeElement, 'change');
            // view -> model
            expect(control.value).toBe(false);
        });
        describe('should support <type=number>', function () {
            it('with basic use case', function () {
                var fixture = initTest(FormControlNumberInput);
                var control = new forms_1.FormControl(10);
                fixture.componentInstance.control = control;
                fixture.detectChanges();
                // model -> view
                var input = fixture.debugElement.query(by_1.By.css('input'));
                expect(input.nativeElement.value).toEqual('10');
                input.nativeElement.value = '20';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                // view -> model
                expect(control.value).toEqual(20);
            });
            it('when value is cleared in the UI', function () {
                var fixture = initTest(FormControlNumberInput);
                var control = new forms_1.FormControl(10, forms_1.Validators.required);
                fixture.componentInstance.control = control;
                fixture.detectChanges();
                var input = fixture.debugElement.query(by_1.By.css('input'));
                input.nativeElement.value = '';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                expect(control.valid).toBe(false);
                expect(control.value).toEqual(null);
                input.nativeElement.value = '0';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                expect(control.valid).toBe(true);
                expect(control.value).toEqual(0);
            });
            it('when value is cleared programmatically', function () {
                var fixture = initTest(FormControlNumberInput);
                var control = new forms_1.FormControl(10);
                fixture.componentInstance.control = control;
                fixture.detectChanges();
                control.setValue(null);
                var input = fixture.debugElement.query(by_1.By.css('input'));
                expect(input.nativeElement.value).toEqual('');
            });
        });
        describe('select controls', function () {
            describe('in reactive forms', function () {
                it("should support primitive values", function () {
                    if (isNode)
                        return;
                    var fixture = initTest(FormControlNameSelect);
                    fixture.detectChanges();
                    // model -> view
                    var select = fixture.debugElement.query(by_1.By.css('select'));
                    var sfOption = fixture.debugElement.query(by_1.By.css('option'));
                    expect(select.nativeElement.value).toEqual('SF');
                    expect(sfOption.nativeElement.selected).toBe(true);
                    select.nativeElement.value = 'NY';
                    browser_util_1.dispatchEvent(select.nativeElement, 'change');
                    fixture.detectChanges();
                    // view -> model
                    expect(sfOption.nativeElement.selected).toBe(false);
                    expect(fixture.componentInstance.form.value).toEqual({ 'city': 'NY' });
                });
                it("should support objects", function () {
                    if (isNode)
                        return;
                    var fixture = initTest(FormControlSelectNgValue);
                    fixture.detectChanges();
                    // model -> view
                    var select = fixture.debugElement.query(by_1.By.css('select'));
                    var sfOption = fixture.debugElement.query(by_1.By.css('option'));
                    expect(select.nativeElement.value).toEqual('0: Object');
                    expect(sfOption.nativeElement.selected).toBe(true);
                });
                it('should throw an error if compareWith is not a function', function () {
                    var fixture = initTest(FormControlSelectWithCompareFn);
                    fixture.componentInstance.compareFn = null;
                    expect(function () { return fixture.detectChanges(); })
                        .toThrowError(/compareWith must be a function, but received null/);
                });
                it('should compare options using provided compareWith function', function () {
                    if (isNode)
                        return;
                    var fixture = initTest(FormControlSelectWithCompareFn);
                    fixture.detectChanges();
                    var select = fixture.debugElement.query(by_1.By.css('select'));
                    var sfOption = fixture.debugElement.query(by_1.By.css('option'));
                    expect(select.nativeElement.value).toEqual('0: Object');
                    expect(sfOption.nativeElement.selected).toBe(true);
                });
                it('should support re-assigning the options array with compareWith', function () {
                    if (isNode)
                        return;
                    var fixture = initTest(FormControlSelectWithCompareFn);
                    fixture.detectChanges();
                    // Option IDs start out as 0 and 1, so setting the select value to "1: Object"
                    // will select the second option (NY).
                    var select = fixture.debugElement.query(by_1.By.css('select'));
                    select.nativeElement.value = '1: Object';
                    browser_util_1.dispatchEvent(select.nativeElement, 'change');
                    fixture.detectChanges();
                    expect(fixture.componentInstance.form.value).toEqual({ city: { id: 2, name: 'NY' } });
                    fixture.componentInstance.cities = [{ id: 1, name: 'SF' }, { id: 2, name: 'NY' }];
                    fixture.detectChanges();
                    // Now that the options array has been re-assigned, new option instances will
                    // be created by ngFor. These instances will have different option IDs, subsequent
                    // to the first: 2 and 3. For the second option to stay selected, the select
                    // value will need to have the ID of the current second option: 3.
                    var nyOption = fixture.debugElement.queryAll(by_1.By.css('option'))[1];
                    expect(select.nativeElement.value).toEqual('3: Object');
                    expect(nyOption.nativeElement.selected).toBe(true);
                });
            });
            describe('in template-driven forms', function () {
                it('with option values that are objects', testing_1.fakeAsync(function () {
                    if (isNode)
                        return;
                    var fixture = initTest(NgModelSelectForm);
                    var comp = fixture.componentInstance;
                    comp.cities = [{ 'name': 'SF' }, { 'name': 'NYC' }, { 'name': 'Buffalo' }];
                    comp.selectedCity = comp.cities[1];
                    fixture.detectChanges();
                    testing_1.tick();
                    var select = fixture.debugElement.query(by_1.By.css('select'));
                    var nycOption = fixture.debugElement.queryAll(by_1.By.css('option'))[1];
                    // model -> view
                    expect(select.nativeElement.value).toEqual('1: Object');
                    expect(nycOption.nativeElement.selected).toBe(true);
                    select.nativeElement.value = '2: Object';
                    browser_util_1.dispatchEvent(select.nativeElement, 'change');
                    fixture.detectChanges();
                    testing_1.tick();
                    // view -> model
                    expect(comp.selectedCity['name']).toEqual('Buffalo');
                }));
                it('when new options are added', testing_1.fakeAsync(function () {
                    if (isNode)
                        return;
                    var fixture = initTest(NgModelSelectForm);
                    var comp = fixture.componentInstance;
                    comp.cities = [{ 'name': 'SF' }, { 'name': 'NYC' }];
                    comp.selectedCity = comp.cities[1];
                    fixture.detectChanges();
                    testing_1.tick();
                    comp.cities.push({ 'name': 'Buffalo' });
                    comp.selectedCity = comp.cities[2];
                    fixture.detectChanges();
                    testing_1.tick();
                    var select = fixture.debugElement.query(by_1.By.css('select'));
                    var buffalo = fixture.debugElement.queryAll(by_1.By.css('option'))[2];
                    expect(select.nativeElement.value).toEqual('2: Object');
                    expect(buffalo.nativeElement.selected).toBe(true);
                }));
                it('when options are removed', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelSelectForm);
                    var comp = fixture.componentInstance;
                    comp.cities = [{ 'name': 'SF' }, { 'name': 'NYC' }];
                    comp.selectedCity = comp.cities[1];
                    fixture.detectChanges();
                    testing_1.tick();
                    var select = fixture.debugElement.query(by_1.By.css('select'));
                    expect(select.nativeElement.value).toEqual('1: Object');
                    comp.cities.pop();
                    fixture.detectChanges();
                    testing_1.tick();
                    expect(select.nativeElement.value).not.toEqual('1: Object');
                }));
                it('when option values have same content, but different identities', testing_1.fakeAsync(function () {
                    if (isNode)
                        return;
                    var fixture = initTest(NgModelSelectForm);
                    var comp = fixture.componentInstance;
                    comp.cities = [{ 'name': 'SF' }, { 'name': 'NYC' }, { 'name': 'NYC' }];
                    comp.selectedCity = comp.cities[0];
                    fixture.detectChanges();
                    comp.selectedCity = comp.cities[2];
                    fixture.detectChanges();
                    testing_1.tick();
                    var select = fixture.debugElement.query(by_1.By.css('select'));
                    var secondNYC = fixture.debugElement.queryAll(by_1.By.css('option'))[2];
                    expect(select.nativeElement.value).toEqual('2: Object');
                    expect(secondNYC.nativeElement.selected).toBe(true);
                }));
                it('should work with null option', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelSelectWithNullForm);
                    var comp = fixture.componentInstance;
                    comp.cities = [{ 'name': 'SF' }, { 'name': 'NYC' }];
                    comp.selectedCity = null;
                    fixture.detectChanges();
                    var select = fixture.debugElement.query(by_1.By.css('select'));
                    select.nativeElement.value = '2: Object';
                    browser_util_1.dispatchEvent(select.nativeElement, 'change');
                    fixture.detectChanges();
                    testing_1.tick();
                    expect(comp.selectedCity['name']).toEqual('NYC');
                    select.nativeElement.value = '0: null';
                    browser_util_1.dispatchEvent(select.nativeElement, 'change');
                    fixture.detectChanges();
                    testing_1.tick();
                    expect(comp.selectedCity).toEqual(null);
                }));
                it('should throw an error when compareWith is not a function', function () {
                    var fixture = initTest(NgModelSelectWithCustomCompareFnForm);
                    var comp = fixture.componentInstance;
                    comp.compareFn = null;
                    expect(function () { return fixture.detectChanges(); })
                        .toThrowError(/compareWith must be a function, but received null/);
                });
                it('should compare options using provided compareWith function', testing_1.fakeAsync(function () {
                    if (isNode)
                        return;
                    var fixture = initTest(NgModelSelectWithCustomCompareFnForm);
                    var comp = fixture.componentInstance;
                    comp.selectedCity = { id: 1, name: 'SF' };
                    comp.cities = [{ id: 1, name: 'SF' }, { id: 2, name: 'LA' }];
                    fixture.detectChanges();
                    testing_1.tick();
                    var select = fixture.debugElement.query(by_1.By.css('select'));
                    var sfOption = fixture.debugElement.query(by_1.By.css('option'));
                    expect(select.nativeElement.value).toEqual('0: Object');
                    expect(sfOption.nativeElement.selected).toBe(true);
                }));
                it('should support re-assigning the options array with compareWith', testing_1.fakeAsync(function () {
                    if (isNode)
                        return;
                    var fixture = initTest(NgModelSelectWithCustomCompareFnForm);
                    fixture.componentInstance.selectedCity = { id: 1, name: 'SF' };
                    fixture.componentInstance.cities = [{ id: 1, name: 'SF' }, { id: 2, name: 'NY' }];
                    fixture.detectChanges();
                    testing_1.tick();
                    // Option IDs start out as 0 and 1, so setting the select value to "1: Object"
                    // will select the second option (NY).
                    var select = fixture.debugElement.query(by_1.By.css('select'));
                    select.nativeElement.value = '1: Object';
                    browser_util_1.dispatchEvent(select.nativeElement, 'change');
                    fixture.detectChanges();
                    var model = fixture.debugElement.children[0].injector.get(forms_1.NgModel);
                    expect(model.value).toEqual({ id: 2, name: 'NY' });
                    fixture.componentInstance.cities = [{ id: 1, name: 'SF' }, { id: 2, name: 'NY' }];
                    fixture.detectChanges();
                    testing_1.tick();
                    // Now that the options array has been re-assigned, new option instances will
                    // be created by ngFor. These instances will have different option IDs, subsequent
                    // to the first: 2 and 3. For the second option to stay selected, the select
                    // value will need to have the ID of the current second option: 3.
                    var nyOption = fixture.debugElement.queryAll(by_1.By.css('option'))[1];
                    expect(select.nativeElement.value).toEqual('3: Object');
                    expect(nyOption.nativeElement.selected).toBe(true);
                }));
            });
        });
        describe('select multiple controls', function () {
            describe('in reactive forms', function () {
                it('should support primitive values', function () {
                    if (isNode)
                        return;
                    var fixture = initTest(FormControlSelectMultiple);
                    fixture.detectChanges();
                    var select = fixture.debugElement.query(by_1.By.css('select'));
                    var sfOption = fixture.debugElement.query(by_1.By.css('option'));
                    expect(select.nativeElement.value).toEqual("0: 'SF'");
                    expect(sfOption.nativeElement.selected).toBe(true);
                });
                it('should support objects', function () {
                    if (isNode)
                        return;
                    var fixture = initTest(FormControlSelectMultipleNgValue);
                    fixture.detectChanges();
                    var select = fixture.debugElement.query(by_1.By.css('select'));
                    var sfOption = fixture.debugElement.query(by_1.By.css('option'));
                    expect(select.nativeElement.value).toEqual('0: Object');
                    expect(sfOption.nativeElement.selected).toBe(true);
                });
                it('should throw an error when compareWith is not a function', function () {
                    var fixture = initTest(FormControlSelectMultipleWithCompareFn);
                    fixture.componentInstance.compareFn = null;
                    expect(function () { return fixture.detectChanges(); })
                        .toThrowError(/compareWith must be a function, but received null/);
                });
                it('should compare options using provided compareWith function', testing_1.fakeAsync(function () {
                    if (isNode)
                        return;
                    var fixture = initTest(FormControlSelectMultipleWithCompareFn);
                    fixture.detectChanges();
                    testing_1.tick();
                    var select = fixture.debugElement.query(by_1.By.css('select'));
                    var sfOption = fixture.debugElement.query(by_1.By.css('option'));
                    expect(select.nativeElement.value).toEqual('0: Object');
                    expect(sfOption.nativeElement.selected).toBe(true);
                }));
            });
            describe('in template-driven forms', function () {
                var fixture;
                var comp;
                beforeEach(function () {
                    fixture = initTest(NgModelSelectMultipleForm);
                    comp = fixture.componentInstance;
                    comp.cities = [{ 'name': 'SF' }, { 'name': 'NYC' }, { 'name': 'Buffalo' }];
                });
                var detectChangesAndTick = function () {
                    fixture.detectChanges();
                    testing_1.tick();
                };
                var setSelectedCities = function (selectedCities) {
                    comp.selectedCities = selectedCities;
                    detectChangesAndTick();
                };
                var selectOptionViaUI = function (valueString) {
                    var select = fixture.debugElement.query(by_1.By.css('select'));
                    select.nativeElement.value = valueString;
                    browser_util_1.dispatchEvent(select.nativeElement, 'change');
                    detectChangesAndTick();
                };
                var assertOptionElementSelectedState = function (selectedStates) {
                    var options = fixture.debugElement.queryAll(by_1.By.css('option'));
                    if (options.length !== selectedStates.length) {
                        throw 'the selected state values to assert does not match the number of options';
                    }
                    for (var i = 0; i < selectedStates.length; i++) {
                        expect(options[i].nativeElement.selected).toBe(selectedStates[i]);
                    }
                };
                it('should reflect state of model after option selected and new options subsequently added', testing_1.fakeAsync(function () {
                    if (isNode)
                        return;
                    setSelectedCities([]);
                    selectOptionViaUI('1: Object');
                    assertOptionElementSelectedState([false, true, false]);
                    comp.cities.push({ 'name': 'Chicago' });
                    detectChangesAndTick();
                    assertOptionElementSelectedState([false, true, false, false]);
                }));
                it('should reflect state of model after option selected and then other options removed', testing_1.fakeAsync(function () {
                    if (isNode)
                        return;
                    setSelectedCities([]);
                    selectOptionViaUI('1: Object');
                    assertOptionElementSelectedState([false, true, false]);
                    comp.cities.pop();
                    detectChangesAndTick();
                    assertOptionElementSelectedState([false, true]);
                }));
            });
            it('should throw an error when compareWith is not a function', function () {
                var fixture = initTest(NgModelSelectMultipleWithCustomCompareFnForm);
                var comp = fixture.componentInstance;
                comp.compareFn = null;
                expect(function () { return fixture.detectChanges(); })
                    .toThrowError(/compareWith must be a function, but received null/);
            });
            it('should compare options using provided compareWith function', testing_1.fakeAsync(function () {
                if (isNode)
                    return;
                var fixture = initTest(NgModelSelectMultipleWithCustomCompareFnForm);
                var comp = fixture.componentInstance;
                comp.cities = [{ id: 1, name: 'SF' }, { id: 2, name: 'LA' }];
                comp.selectedCities = [comp.cities[0]];
                fixture.detectChanges();
                testing_1.tick();
                var select = fixture.debugElement.query(by_1.By.css('select'));
                var sfOption = fixture.debugElement.query(by_1.By.css('option'));
                expect(select.nativeElement.value).toEqual('0: Object');
                expect(sfOption.nativeElement.selected).toBe(true);
            }));
        });
        describe('should support <type=radio>', function () {
            describe('in reactive forms', function () {
                it('should support basic functionality', function () {
                    var fixture = initTest(FormControlRadioButtons);
                    var form = new forms_1.FormGroup({ 'food': new forms_1.FormControl('fish'), 'drink': new forms_1.FormControl('sprite') });
                    fixture.componentInstance.form = form;
                    fixture.detectChanges();
                    // model -> view
                    var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                    expect(inputs[0].nativeElement.checked).toEqual(false);
                    expect(inputs[1].nativeElement.checked).toEqual(true);
                    browser_util_1.dispatchEvent(inputs[0].nativeElement, 'change');
                    fixture.detectChanges();
                    // view -> model
                    expect(form.get('food').value).toEqual('chicken');
                    expect(inputs[1].nativeElement.checked).toEqual(false);
                    form.get('food').setValue('fish');
                    fixture.detectChanges();
                    // programmatic change -> view
                    expect(inputs[0].nativeElement.checked).toEqual(false);
                    expect(inputs[1].nativeElement.checked).toEqual(true);
                });
                it('should support an initial undefined value', function () {
                    var fixture = initTest(FormControlRadioButtons);
                    var form = new forms_1.FormGroup({ 'food': new forms_1.FormControl(), 'drink': new forms_1.FormControl() });
                    fixture.componentInstance.form = form;
                    fixture.detectChanges();
                    var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                    expect(inputs[0].nativeElement.checked).toEqual(false);
                    expect(inputs[1].nativeElement.checked).toEqual(false);
                });
                it('should reset properly', function () {
                    var fixture = initTest(FormControlRadioButtons);
                    var form = new forms_1.FormGroup({ 'food': new forms_1.FormControl('fish'), 'drink': new forms_1.FormControl('sprite') });
                    fixture.componentInstance.form = form;
                    fixture.detectChanges();
                    form.reset();
                    fixture.detectChanges();
                    var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                    expect(inputs[0].nativeElement.checked).toEqual(false);
                    expect(inputs[1].nativeElement.checked).toEqual(false);
                });
                it('should properly set value to null and undefined', function () {
                    var fixture = initTest(FormControlRadioButtons);
                    var form = new forms_1.FormGroup({ 'food': new forms_1.FormControl('chicken'), 'drink': new forms_1.FormControl('sprite') });
                    fixture.componentInstance.form = form;
                    fixture.detectChanges();
                    form.get('food').setValue(null);
                    fixture.detectChanges();
                    var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                    expect(inputs[0].nativeElement.checked).toEqual(false);
                    form.get('food').setValue('chicken');
                    fixture.detectChanges();
                    form.get('food').setValue(undefined);
                    fixture.detectChanges();
                    expect(inputs[0].nativeElement.checked).toEqual(false);
                });
                it('should use formControlName to group radio buttons when name is absent', function () {
                    var fixture = initTest(FormControlRadioButtons);
                    var foodCtrl = new forms_1.FormControl('fish');
                    var drinkCtrl = new forms_1.FormControl('sprite');
                    fixture.componentInstance.form = new forms_1.FormGroup({ 'food': foodCtrl, 'drink': drinkCtrl });
                    fixture.detectChanges();
                    var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                    expect(inputs[0].nativeElement.checked).toEqual(false);
                    expect(inputs[1].nativeElement.checked).toEqual(true);
                    expect(inputs[2].nativeElement.checked).toEqual(false);
                    expect(inputs[3].nativeElement.checked).toEqual(true);
                    browser_util_1.dispatchEvent(inputs[0].nativeElement, 'change');
                    inputs[0].nativeElement.checked = true;
                    fixture.detectChanges();
                    var value = fixture.componentInstance.form.value;
                    expect(value.food).toEqual('chicken');
                    expect(inputs[1].nativeElement.checked).toEqual(false);
                    expect(inputs[2].nativeElement.checked).toEqual(false);
                    expect(inputs[3].nativeElement.checked).toEqual(true);
                    drinkCtrl.setValue('cola');
                    fixture.detectChanges();
                    expect(inputs[0].nativeElement.checked).toEqual(true);
                    expect(inputs[1].nativeElement.checked).toEqual(false);
                    expect(inputs[2].nativeElement.checked).toEqual(true);
                    expect(inputs[3].nativeElement.checked).toEqual(false);
                });
                it('should support removing controls from <type=radio>', function () {
                    var fixture = initTest(FormControlRadioButtons);
                    var showRadio = new forms_1.FormControl('yes');
                    var form = new forms_1.FormGroup({ 'food': new forms_1.FormControl('fish'), 'drink': new forms_1.FormControl('sprite') });
                    fixture.componentInstance.form = form;
                    fixture.componentInstance.showRadio = showRadio;
                    showRadio.valueChanges.subscribe(function (change) {
                        (change === 'yes') ? form.addControl('food', new forms_1.FormControl('fish')) :
                            form.removeControl('food');
                    });
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('[value="no"]'));
                    browser_util_1.dispatchEvent(input.nativeElement, 'change');
                    fixture.detectChanges();
                    expect(form.value).toEqual({ drink: 'sprite' });
                });
                it('should differentiate controls on different levels with the same name', function () {
                    testing_1.TestBed.overrideComponent(FormControlRadioButtons, {
                        set: {
                            template: "\n              <div [formGroup]=\"form\">\n                <input type=\"radio\" formControlName=\"food\" value=\"chicken\">\n                <input type=\"radio\" formControlName=\"food\" value=\"fish\">\n                <div formGroupName=\"nested\">\n                  <input type=\"radio\" formControlName=\"food\" value=\"chicken\">\n                  <input type=\"radio\" formControlName=\"food\" value=\"fish\">\n                </div>\n              </div>\n              "
                        }
                    });
                    var fixture = initTest(FormControlRadioButtons);
                    var form = new forms_1.FormGroup({
                        food: new forms_1.FormControl('fish'),
                        nested: new forms_1.FormGroup({ food: new forms_1.FormControl('fish') })
                    });
                    fixture.componentInstance.form = form;
                    fixture.detectChanges();
                    // model -> view
                    var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                    expect(inputs[0].nativeElement.checked).toEqual(false);
                    expect(inputs[1].nativeElement.checked).toEqual(true);
                    expect(inputs[2].nativeElement.checked).toEqual(false);
                    expect(inputs[3].nativeElement.checked).toEqual(true);
                    browser_util_1.dispatchEvent(inputs[0].nativeElement, 'change');
                    fixture.detectChanges();
                    // view -> model
                    expect(form.get('food').value).toEqual('chicken');
                    expect(form.get('nested.food').value).toEqual('fish');
                    expect(inputs[1].nativeElement.checked).toEqual(false);
                    expect(inputs[2].nativeElement.checked).toEqual(false);
                    expect(inputs[3].nativeElement.checked).toEqual(true);
                });
                it('should disable all radio buttons when disable() is called', function () {
                    var fixture = initTest(FormControlRadioButtons);
                    var form = new forms_1.FormGroup({ food: new forms_1.FormControl('fish'), drink: new forms_1.FormControl('cola') });
                    fixture.componentInstance.form = form;
                    fixture.detectChanges();
                    var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                    expect(inputs[0].nativeElement.disabled).toEqual(false);
                    expect(inputs[1].nativeElement.disabled).toEqual(false);
                    expect(inputs[2].nativeElement.disabled).toEqual(false);
                    expect(inputs[3].nativeElement.disabled).toEqual(false);
                    form.get('food').disable();
                    expect(inputs[0].nativeElement.disabled).toEqual(true);
                    expect(inputs[1].nativeElement.disabled).toEqual(true);
                    expect(inputs[2].nativeElement.disabled).toEqual(false);
                    expect(inputs[3].nativeElement.disabled).toEqual(false);
                    form.disable();
                    expect(inputs[0].nativeElement.disabled).toEqual(true);
                    expect(inputs[1].nativeElement.disabled).toEqual(true);
                    expect(inputs[2].nativeElement.disabled).toEqual(true);
                    expect(inputs[3].nativeElement.disabled).toEqual(true);
                    form.enable();
                    expect(inputs[0].nativeElement.disabled).toEqual(false);
                    expect(inputs[1].nativeElement.disabled).toEqual(false);
                    expect(inputs[2].nativeElement.disabled).toEqual(false);
                    expect(inputs[3].nativeElement.disabled).toEqual(false);
                });
                it('should disable all radio buttons when initially disabled', function () {
                    var fixture = initTest(FormControlRadioButtons);
                    var form = new forms_1.FormGroup({
                        food: new forms_1.FormControl({ value: 'fish', disabled: true }),
                        drink: new forms_1.FormControl('cola')
                    });
                    fixture.componentInstance.form = form;
                    fixture.detectChanges();
                    var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                    expect(inputs[0].nativeElement.disabled).toEqual(true);
                    expect(inputs[1].nativeElement.disabled).toEqual(true);
                    expect(inputs[2].nativeElement.disabled).toEqual(false);
                    expect(inputs[3].nativeElement.disabled).toEqual(false);
                });
                it('should work with reusing controls', function () {
                    var fixture = initTest(FormControlRadioButtons);
                    var food = new forms_1.FormControl('chicken');
                    fixture.componentInstance.form =
                        new forms_1.FormGroup({ 'food': food, 'drink': new forms_1.FormControl('') });
                    fixture.detectChanges();
                    var newForm = new forms_1.FormGroup({ 'food': food, 'drink': new forms_1.FormControl('') });
                    fixture.componentInstance.form = newForm;
                    fixture.detectChanges();
                    newForm.setValue({ food: 'fish', drink: '' });
                    fixture.detectChanges();
                    var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                    expect(inputs[0].nativeElement.checked).toBe(false);
                    expect(inputs[1].nativeElement.checked).toBe(true);
                });
            });
            describe('in template-driven forms', function () {
                it('should support basic functionality', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelRadioForm);
                    fixture.componentInstance.food = 'fish';
                    fixture.detectChanges();
                    testing_1.tick();
                    // model -> view
                    var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                    expect(inputs[0].nativeElement.checked).toEqual(false);
                    expect(inputs[1].nativeElement.checked).toEqual(true);
                    browser_util_1.dispatchEvent(inputs[0].nativeElement, 'change');
                    testing_1.tick();
                    // view -> model
                    expect(fixture.componentInstance.food).toEqual('chicken');
                    expect(inputs[1].nativeElement.checked).toEqual(false);
                }));
                it('should support multiple named <type=radio> groups', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelRadioForm);
                    fixture.componentInstance.food = 'fish';
                    fixture.componentInstance.drink = 'sprite';
                    fixture.detectChanges();
                    testing_1.tick();
                    var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                    expect(inputs[0].nativeElement.checked).toEqual(false);
                    expect(inputs[1].nativeElement.checked).toEqual(true);
                    expect(inputs[2].nativeElement.checked).toEqual(false);
                    expect(inputs[3].nativeElement.checked).toEqual(true);
                    browser_util_1.dispatchEvent(inputs[0].nativeElement, 'change');
                    testing_1.tick();
                    expect(fixture.componentInstance.food).toEqual('chicken');
                    expect(fixture.componentInstance.drink).toEqual('sprite');
                    expect(inputs[1].nativeElement.checked).toEqual(false);
                    expect(inputs[2].nativeElement.checked).toEqual(false);
                    expect(inputs[3].nativeElement.checked).toEqual(true);
                }));
                it('should support initial undefined value', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelRadioForm);
                    fixture.detectChanges();
                    testing_1.tick();
                    var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                    expect(inputs[0].nativeElement.checked).toEqual(false);
                    expect(inputs[1].nativeElement.checked).toEqual(false);
                    expect(inputs[2].nativeElement.checked).toEqual(false);
                    expect(inputs[3].nativeElement.checked).toEqual(false);
                }));
                it('should support resetting properly', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelRadioForm);
                    fixture.componentInstance.food = 'chicken';
                    fixture.detectChanges();
                    testing_1.tick();
                    var form = fixture.debugElement.query(by_1.By.css('form'));
                    browser_util_1.dispatchEvent(form.nativeElement, 'reset');
                    fixture.detectChanges();
                    testing_1.tick();
                    var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                    expect(inputs[0].nativeElement.checked).toEqual(false);
                    expect(inputs[1].nativeElement.checked).toEqual(false);
                }));
                it('should support setting value to null and undefined', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelRadioForm);
                    fixture.componentInstance.food = 'chicken';
                    fixture.detectChanges();
                    testing_1.tick();
                    fixture.componentInstance.food = null;
                    fixture.detectChanges();
                    testing_1.tick();
                    var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                    expect(inputs[0].nativeElement.checked).toEqual(false);
                    expect(inputs[1].nativeElement.checked).toEqual(false);
                    fixture.componentInstance.food = 'chicken';
                    fixture.detectChanges();
                    testing_1.tick();
                    fixture.componentInstance.food = undefined;
                    fixture.detectChanges();
                    testing_1.tick();
                    expect(inputs[0].nativeElement.checked).toEqual(false);
                    expect(inputs[1].nativeElement.checked).toEqual(false);
                }));
                it('should disable radio controls properly with programmatic call', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelRadioForm);
                    fixture.componentInstance.food = 'fish';
                    fixture.detectChanges();
                    testing_1.tick();
                    var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                    form.control.get('food').disable();
                    testing_1.tick();
                    var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                    expect(inputs[0].nativeElement.disabled).toBe(true);
                    expect(inputs[1].nativeElement.disabled).toBe(true);
                    expect(inputs[2].nativeElement.disabled).toBe(false);
                    expect(inputs[3].nativeElement.disabled).toBe(false);
                    form.control.disable();
                    testing_1.tick();
                    expect(inputs[0].nativeElement.disabled).toBe(true);
                    expect(inputs[1].nativeElement.disabled).toBe(true);
                    expect(inputs[2].nativeElement.disabled).toBe(true);
                    expect(inputs[3].nativeElement.disabled).toBe(true);
                    form.control.enable();
                    testing_1.tick();
                    expect(inputs[0].nativeElement.disabled).toBe(false);
                    expect(inputs[1].nativeElement.disabled).toBe(false);
                    expect(inputs[2].nativeElement.disabled).toBe(false);
                    expect(inputs[3].nativeElement.disabled).toBe(false);
                }));
            });
        });
        describe('should support <type=range>', function () {
            describe('in reactive forms', function () {
                it('with basic use case', function () {
                    var fixture = initTest(FormControlRangeInput);
                    var control = new forms_1.FormControl(10);
                    fixture.componentInstance.control = control;
                    fixture.detectChanges();
                    // model -> view
                    var input = fixture.debugElement.query(by_1.By.css('input'));
                    expect(input.nativeElement.value).toEqual('10');
                    input.nativeElement.value = '20';
                    browser_util_1.dispatchEvent(input.nativeElement, 'input');
                    // view -> model
                    expect(control.value).toEqual(20);
                });
                it('when value is cleared in the UI', function () {
                    var fixture = initTest(FormControlNumberInput);
                    var control = new forms_1.FormControl(10, forms_1.Validators.required);
                    fixture.componentInstance.control = control;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input'));
                    input.nativeElement.value = '';
                    browser_util_1.dispatchEvent(input.nativeElement, 'input');
                    expect(control.valid).toBe(false);
                    expect(control.value).toEqual(null);
                    input.nativeElement.value = '0';
                    browser_util_1.dispatchEvent(input.nativeElement, 'input');
                    expect(control.valid).toBe(true);
                    expect(control.value).toEqual(0);
                });
                it('when value is cleared programmatically', function () {
                    var fixture = initTest(FormControlNumberInput);
                    var control = new forms_1.FormControl(10);
                    fixture.componentInstance.control = control;
                    fixture.detectChanges();
                    control.setValue(null);
                    var input = fixture.debugElement.query(by_1.By.css('input'));
                    expect(input.nativeElement.value).toEqual('');
                });
            });
            describe('in template-driven forms', function () {
                it('with basic use case', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelRangeForm);
                    // model -> view
                    fixture.componentInstance.val = 4;
                    fixture.detectChanges();
                    testing_1.tick();
                    var input = fixture.debugElement.query(by_1.By.css('input'));
                    expect(input.nativeElement.value).toBe('4');
                    fixture.detectChanges();
                    testing_1.tick();
                    var newVal = '4';
                    input.triggerEventHandler('input', { target: { value: newVal } });
                    testing_1.tick();
                    // view -> model
                    fixture.detectChanges();
                    expect(typeof (fixture.componentInstance.val)).toBe('number');
                }));
            });
        });
        describe('custom value accessors', function () {
            describe('in reactive forms', function () {
                it('should support basic functionality', function () {
                    var fixture = initTest(WrappedValueForm, WrappedValue);
                    var form = new forms_1.FormGroup({ 'login': new forms_1.FormControl('aa') });
                    fixture.componentInstance.form = form;
                    fixture.detectChanges();
                    // model -> view
                    var input = fixture.debugElement.query(by_1.By.css('input'));
                    expect(input.nativeElement.value).toEqual('!aa!');
                    input.nativeElement.value = '!bb!';
                    browser_util_1.dispatchEvent(input.nativeElement, 'input');
                    // view -> model
                    expect(form.value).toEqual({ 'login': 'bb' });
                    // custom validator
                    expect(form.get('login').errors).toEqual({ 'err': true });
                    form.setValue({ login: 'expected' });
                    expect(form.get('login').errors).toEqual(null);
                });
                it('should support non builtin input elements that fire a change event without a \'target\' property', function () {
                    var fixture = initTest(MyInputForm, MyInput);
                    fixture.componentInstance.form = new forms_1.FormGroup({ 'login': new forms_1.FormControl('aa') });
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('my-input'));
                    expect(input.componentInstance.value).toEqual('!aa!');
                    input.componentInstance.value = '!bb!';
                    input.componentInstance.onInput.subscribe(function (value) {
                        expect(fixture.componentInstance.form.value).toEqual({ 'login': 'bb' });
                    });
                    input.componentInstance.dispatchChangeEvent();
                });
                it('should support custom accessors without setDisabledState - formControlName', function () {
                    var fixture = initTest(WrappedValueForm, WrappedValue);
                    fixture.componentInstance.form = new forms_1.FormGroup({
                        'login': new forms_1.FormControl({ value: 'aa', disabled: true }),
                    });
                    fixture.detectChanges();
                    expect(fixture.componentInstance.form.status).toEqual('DISABLED');
                    expect(fixture.componentInstance.form.get('login').status).toEqual('DISABLED');
                });
                it('should support custom accessors without setDisabledState - formControlDirective', function () {
                    testing_1.TestBed.overrideComponent(FormControlComp, { set: { template: "<input type=\"text\" [formControl]=\"control\" wrapped-value>" } });
                    var fixture = initTest(FormControlComp);
                    fixture.componentInstance.control = new forms_1.FormControl({ value: 'aa', disabled: true });
                    fixture.detectChanges();
                    expect(fixture.componentInstance.control.status).toEqual('DISABLED');
                });
            });
            describe('in template-driven forms', function () {
                it('should support standard writing to view and model', testing_1.async(function () {
                    var fixture = initTest(NgModelCustomWrapper, NgModelCustomComp);
                    fixture.componentInstance.name = 'Nancy';
                    fixture.detectChanges();
                    fixture.whenStable().then(function () {
                        fixture.detectChanges();
                        fixture.whenStable().then(function () {
                            // model -> view
                            var customInput = fixture.debugElement.query(by_1.By.css('[name="custom"]'));
                            expect(customInput.nativeElement.value).toEqual('Nancy');
                            customInput.nativeElement.value = 'Carson';
                            browser_util_1.dispatchEvent(customInput.nativeElement, 'input');
                            fixture.detectChanges();
                            // view -> model
                            expect(fixture.componentInstance.name).toEqual('Carson');
                        });
                    });
                }));
            });
        });
    });
}
var FormControlComp = /** @class */ (function () {
    function FormControlComp() {
    }
    FormControlComp = __decorate([
        core_1.Component({ selector: 'form-control-comp', template: "<input type=\"text\" [formControl]=\"control\">" })
    ], FormControlComp);
    return FormControlComp;
}());
exports.FormControlComp = FormControlComp;
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
exports.FormGroupComp = FormGroupComp;
var FormControlNumberInput = /** @class */ (function () {
    function FormControlNumberInput() {
    }
    FormControlNumberInput = __decorate([
        core_1.Component({
            selector: 'form-control-number-input',
            template: "<input type=\"number\" [formControl]=\"control\">"
        })
    ], FormControlNumberInput);
    return FormControlNumberInput;
}());
var FormControlNameSelect = /** @class */ (function () {
    function FormControlNameSelect() {
        this.cities = ['SF', 'NY'];
        this.form = new forms_1.FormGroup({ city: new forms_1.FormControl('SF') });
    }
    FormControlNameSelect = __decorate([
        core_1.Component({
            selector: 'form-control-name-select',
            template: "\n    <div [formGroup]=\"form\">\n      <select formControlName=\"city\">\n        <option *ngFor=\"let c of cities\" [value]=\"c\"></option>\n      </select>\n    </div>"
        })
    ], FormControlNameSelect);
    return FormControlNameSelect;
}());
var FormControlSelectNgValue = /** @class */ (function () {
    function FormControlSelectNgValue() {
        this.cities = [{ id: 1, name: 'SF' }, { id: 2, name: 'NY' }];
        this.form = new forms_1.FormGroup({ city: new forms_1.FormControl(this.cities[0]) });
    }
    FormControlSelectNgValue = __decorate([
        core_1.Component({
            selector: 'form-control-select-ngValue',
            template: "\n    <div [formGroup]=\"form\">\n      <select formControlName=\"city\">\n        <option *ngFor=\"let c of cities\" [ngValue]=\"c\">{{c.name}}</option>\n      </select>\n    </div>"
        })
    ], FormControlSelectNgValue);
    return FormControlSelectNgValue;
}());
var FormControlSelectWithCompareFn = /** @class */ (function () {
    function FormControlSelectWithCompareFn() {
        this.compareFn = function (o1, o2) { return o1 && o2 ? o1.id === o2.id : o1 === o2; };
        this.cities = [{ id: 1, name: 'SF' }, { id: 2, name: 'NY' }];
        this.form = new forms_1.FormGroup({ city: new forms_1.FormControl({ id: 1, name: 'SF' }) });
    }
    FormControlSelectWithCompareFn = __decorate([
        core_1.Component({
            selector: 'form-control-select-compare-with',
            template: "\n    <div [formGroup]=\"form\">\n      <select formControlName=\"city\" [compareWith]=\"compareFn\">\n        <option *ngFor=\"let c of cities\" [ngValue]=\"c\">{{c.name}}</option>\n      </select>\n    </div>"
        })
    ], FormControlSelectWithCompareFn);
    return FormControlSelectWithCompareFn;
}());
var FormControlSelectMultiple = /** @class */ (function () {
    function FormControlSelectMultiple() {
        this.cities = ['SF', 'NY'];
        this.form = new forms_1.FormGroup({ city: new forms_1.FormControl(['SF']) });
    }
    FormControlSelectMultiple = __decorate([
        core_1.Component({
            selector: 'form-control-select-multiple',
            template: "\n    <div [formGroup]=\"form\">\n      <select multiple formControlName=\"city\">\n        <option *ngFor=\"let c of cities\" [value]=\"c\">{{c}}</option>\n      </select>\n    </div>"
        })
    ], FormControlSelectMultiple);
    return FormControlSelectMultiple;
}());
var FormControlSelectMultipleNgValue = /** @class */ (function () {
    function FormControlSelectMultipleNgValue() {
        this.cities = [{ id: 1, name: 'SF' }, { id: 2, name: 'NY' }];
        this.form = new forms_1.FormGroup({ city: new forms_1.FormControl([this.cities[0]]) });
    }
    FormControlSelectMultipleNgValue = __decorate([
        core_1.Component({
            selector: 'form-control-select-multiple',
            template: "\n    <div [formGroup]=\"form\">\n      <select multiple formControlName=\"city\">\n        <option *ngFor=\"let c of cities\" [ngValue]=\"c\">{{c.name}}</option>\n      </select>\n    </div>"
        })
    ], FormControlSelectMultipleNgValue);
    return FormControlSelectMultipleNgValue;
}());
var FormControlSelectMultipleWithCompareFn = /** @class */ (function () {
    function FormControlSelectMultipleWithCompareFn() {
        this.compareFn = function (o1, o2) { return o1 && o2 ? o1.id === o2.id : o1 === o2; };
        this.cities = [{ id: 1, name: 'SF' }, { id: 2, name: 'NY' }];
        this.form = new forms_1.FormGroup({ city: new forms_1.FormControl([{ id: 1, name: 'SF' }]) });
    }
    FormControlSelectMultipleWithCompareFn = __decorate([
        core_1.Component({
            selector: 'form-control-select-multiple-compare-with',
            template: "\n    <div [formGroup]=\"form\">\n      <select multiple formControlName=\"city\" [compareWith]=\"compareFn\">\n        <option *ngFor=\"let c of cities\" [ngValue]=\"c\">{{c.name}}</option>\n      </select>\n    </div>"
        })
    ], FormControlSelectMultipleWithCompareFn);
    return FormControlSelectMultipleWithCompareFn;
}());
var NgModelSelectForm = /** @class */ (function () {
    function NgModelSelectForm() {
        this.selectedCity = {};
        this.cities = [];
    }
    NgModelSelectForm = __decorate([
        core_1.Component({
            selector: 'ng-model-select-form',
            template: "\n    <select [(ngModel)]=\"selectedCity\">\n      <option *ngFor=\"let c of cities\" [ngValue]=\"c\"> {{c.name}} </option>\n    </select>\n  "
        })
    ], NgModelSelectForm);
    return NgModelSelectForm;
}());
var NgModelSelectWithNullForm = /** @class */ (function () {
    function NgModelSelectWithNullForm() {
        this.selectedCity = {};
        this.cities = [];
    }
    NgModelSelectWithNullForm = __decorate([
        core_1.Component({
            selector: 'ng-model-select-null-form',
            template: "\n    <select [(ngModel)]=\"selectedCity\">\n      <option *ngFor=\"let c of cities\" [ngValue]=\"c\"> {{c.name}} </option>\n      <option [ngValue]=\"null\">Unspecified</option>\n    </select>\n  "
        })
    ], NgModelSelectWithNullForm);
    return NgModelSelectWithNullForm;
}());
var NgModelSelectWithCustomCompareFnForm = /** @class */ (function () {
    function NgModelSelectWithCustomCompareFnForm() {
        this.compareFn = function (o1, o2) { return o1 && o2 ? o1.id === o2.id : o1 === o2; };
        this.selectedCity = {};
        this.cities = [];
    }
    NgModelSelectWithCustomCompareFnForm = __decorate([
        core_1.Component({
            selector: 'ng-model-select-compare-with',
            template: "\n    <select [(ngModel)]=\"selectedCity\" [compareWith]=\"compareFn\">\n      <option *ngFor=\"let c of cities\" [ngValue]=\"c\"> {{c.name}} </option>\n    </select>\n  "
        })
    ], NgModelSelectWithCustomCompareFnForm);
    return NgModelSelectWithCustomCompareFnForm;
}());
var NgModelSelectMultipleWithCustomCompareFnForm = /** @class */ (function () {
    function NgModelSelectMultipleWithCustomCompareFnForm() {
        this.compareFn = function (o1, o2) { return o1 && o2 ? o1.id === o2.id : o1 === o2; };
        this.selectedCities = [];
        this.cities = [];
    }
    NgModelSelectMultipleWithCustomCompareFnForm = __decorate([
        core_1.Component({
            selector: 'ng-model-select-multiple-compare-with',
            template: "\n    <select multiple [(ngModel)]=\"selectedCities\" [compareWith]=\"compareFn\">\n      <option *ngFor=\"let c of cities\" [ngValue]=\"c\"> {{c.name}} </option>\n    </select>\n  "
        })
    ], NgModelSelectMultipleWithCustomCompareFnForm);
    return NgModelSelectMultipleWithCustomCompareFnForm;
}());
var NgModelSelectMultipleForm = /** @class */ (function () {
    function NgModelSelectMultipleForm() {
        this.cities = [];
    }
    NgModelSelectMultipleForm = __decorate([
        core_1.Component({
            selector: 'ng-model-select-multiple-form',
            template: "\n    <select multiple [(ngModel)]=\"selectedCities\">\n      <option *ngFor=\"let c of cities\" [ngValue]=\"c\"> {{c.name}} </option>\n    </select>\n  "
        })
    ], NgModelSelectMultipleForm);
    return NgModelSelectMultipleForm;
}());
var FormControlRangeInput = /** @class */ (function () {
    function FormControlRangeInput() {
    }
    FormControlRangeInput = __decorate([
        core_1.Component({
            selector: 'form-control-range-input',
            template: "<input type=\"range\" [formControl]=\"control\">"
        })
    ], FormControlRangeInput);
    return FormControlRangeInput;
}());
var NgModelRangeForm = /** @class */ (function () {
    function NgModelRangeForm() {
    }
    NgModelRangeForm = __decorate([
        core_1.Component({ selector: 'ng-model-range-form', template: '<input type="range" [(ngModel)]="val">' })
    ], NgModelRangeForm);
    return NgModelRangeForm;
}());
var FormControlRadioButtons = /** @class */ (function () {
    function FormControlRadioButtons() {
        this.showRadio = new forms_1.FormControl('yes');
    }
    FormControlRadioButtons = __decorate([
        core_1.Component({
            selector: 'form-control-radio-buttons',
            template: "\n    <form [formGroup]=\"form\" *ngIf=\"showRadio.value === 'yes'\">\n      <input type=\"radio\" formControlName=\"food\" value=\"chicken\">\n      <input type=\"radio\" formControlName=\"food\" value=\"fish\">\n      <input type=\"radio\" formControlName=\"drink\" value=\"cola\">\n      <input type=\"radio\" formControlName=\"drink\" value=\"sprite\">\n    </form>\n    <input type=\"radio\" [formControl]=\"showRadio\" value=\"yes\">\n    <input type=\"radio\" [formControl]=\"showRadio\" value=\"no\">"
        })
    ], FormControlRadioButtons);
    return FormControlRadioButtons;
}());
exports.FormControlRadioButtons = FormControlRadioButtons;
var NgModelRadioForm = /** @class */ (function () {
    function NgModelRadioForm() {
    }
    NgModelRadioForm = __decorate([
        core_1.Component({
            selector: 'ng-model-radio-form',
            template: "\n    <form>\n      <input type=\"radio\" name=\"food\" [(ngModel)]=\"food\" value=\"chicken\">\n      <input type=\"radio\" name=\"food\"  [(ngModel)]=\"food\" value=\"fish\">\n\n      <input type=\"radio\" name=\"drink\" [(ngModel)]=\"drink\" value=\"cola\">\n      <input type=\"radio\" name=\"drink\" [(ngModel)]=\"drink\" value=\"sprite\">\n    </form>\n  "
        })
    ], NgModelRadioForm);
    return NgModelRadioForm;
}());
var WrappedValue = /** @class */ (function () {
    function WrappedValue() {
    }
    WrappedValue_1 = WrappedValue;
    WrappedValue.prototype.writeValue = function (value) { this.value = "!" + value + "!"; };
    WrappedValue.prototype.registerOnChange = function (fn) { this.onChange = fn; };
    WrappedValue.prototype.registerOnTouched = function (fn) { };
    WrappedValue.prototype.handleOnInput = function (value) { this.onChange(value.substring(1, value.length - 1)); };
    WrappedValue.prototype.validate = function (c) { return c.value === 'expected' ? null : { 'err': true }; };
    var WrappedValue_1;
    WrappedValue = WrappedValue_1 = __decorate([
        core_1.Directive({
            selector: '[wrapped-value]',
            host: { '(input)': 'handleOnInput($event.target.value)', '[value]': 'value' },
            providers: [
                { provide: forms_1.NG_VALUE_ACCESSOR, multi: true, useExisting: WrappedValue_1 },
                { provide: forms_1.NG_VALIDATORS, multi: true, useExisting: WrappedValue_1 }
            ]
        })
    ], WrappedValue);
    return WrappedValue;
}());
var MyInput = /** @class */ (function () {
    function MyInput(cd) {
        this.onInput = new core_1.EventEmitter();
        cd.valueAccessor = this;
    }
    MyInput.prototype.writeValue = function (value) { this.value = "!" + value + "!"; };
    MyInput.prototype.registerOnChange = function (fn) { this.onInput.subscribe({ next: fn }); };
    MyInput.prototype.registerOnTouched = function (fn) { };
    MyInput.prototype.dispatchChangeEvent = function () { this.onInput.emit(this.value.substring(1, this.value.length - 1)); };
    __decorate([
        core_1.Output('input'),
        __metadata("design:type", Object)
    ], MyInput.prototype, "onInput", void 0);
    MyInput = __decorate([
        core_1.Component({ selector: 'my-input', template: '' }),
        __metadata("design:paramtypes", [forms_1.NgControl])
    ], MyInput);
    return MyInput;
}());
exports.MyInput = MyInput;
var MyInputForm = /** @class */ (function () {
    function MyInputForm() {
    }
    MyInputForm = __decorate([
        core_1.Component({
            selector: 'my-input-form',
            template: "\n    <div [formGroup]=\"form\">\n      <my-input formControlName=\"login\"></my-input>\n    </div>"
        })
    ], MyInputForm);
    return MyInputForm;
}());
exports.MyInputForm = MyInputForm;
var WrappedValueForm = /** @class */ (function () {
    function WrappedValueForm() {
    }
    WrappedValueForm = __decorate([
        core_1.Component({
            selector: 'wrapped-value-form',
            template: "\n    <div [formGroup]=\"form\">\n      <input type=\"text\" formControlName=\"login\" wrapped-value>\n    </div>"
        })
    ], WrappedValueForm);
    return WrappedValueForm;
}());
var NgModelCustomComp = /** @class */ (function () {
    function NgModelCustomComp() {
        this.isDisabled = false;
    }
    NgModelCustomComp_1 = NgModelCustomComp;
    NgModelCustomComp.prototype.writeValue = function (value) { this.model = value; };
    NgModelCustomComp.prototype.registerOnChange = function (fn) { this.changeFn = fn; };
    NgModelCustomComp.prototype.registerOnTouched = function () { };
    NgModelCustomComp.prototype.setDisabledState = function (isDisabled) { this.isDisabled = isDisabled; };
    var NgModelCustomComp_1;
    __decorate([
        core_1.Input('disabled'),
        __metadata("design:type", Boolean)
    ], NgModelCustomComp.prototype, "isDisabled", void 0);
    NgModelCustomComp = NgModelCustomComp_1 = __decorate([
        core_1.Component({
            selector: 'ng-model-custom-comp',
            template: "\n    <input name=\"custom\" [(ngModel)]=\"model\" (ngModelChange)=\"changeFn($event)\" [disabled]=\"isDisabled\">\n  ",
            providers: [{ provide: forms_1.NG_VALUE_ACCESSOR, multi: true, useExisting: NgModelCustomComp_1 }]
        })
    ], NgModelCustomComp);
    return NgModelCustomComp;
}());
exports.NgModelCustomComp = NgModelCustomComp;
var NgModelCustomWrapper = /** @class */ (function () {
    function NgModelCustomWrapper() {
        this.isDisabled = false;
    }
    NgModelCustomWrapper = __decorate([
        core_1.Component({
            selector: 'ng-model-custom-wrapper',
            template: "\n    <form>\n      <ng-model-custom-comp name=\"name\" [(ngModel)]=\"name\" [disabled]=\"isDisabled\"></ng-model-custom-comp>\n    </form>\n  "
        })
    ], NgModelCustomWrapper);
    return NgModelCustomWrapper;
}());
exports.NgModelCustomWrapper = NgModelCustomWrapper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsdWVfYWNjZXNzb3JfaW50ZWdyYXRpb25fc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3Rlc3QvdmFsdWVfYWNjZXNzb3JfaW50ZWdyYXRpb25fc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUVILHNDQUFzRjtBQUN0RixpREFBd0Y7QUFDeEYsd0NBQXlNO0FBQ3pNLGlFQUE4RDtBQUM5RCxtRkFBaUY7QUFFakY7SUFDRSxRQUFRLENBQUMsaUJBQWlCLEVBQUU7UUFFMUIsa0JBQXFCLFNBQWtCO1lBQUUsb0JBQTBCO2lCQUExQixVQUEwQixFQUExQixxQkFBMEIsRUFBMUIsSUFBMEI7Z0JBQTFCLG1DQUEwQjs7WUFDakUsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FDMUIsRUFBQyxZQUFZLEdBQUcsU0FBUyxTQUFLLFVBQVUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLG1CQUFXLEVBQUUsMkJBQW1CLENBQUMsRUFBQyxDQUFDLENBQUM7WUFDN0YsT0FBTyxpQkFBTyxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM1QyxDQUFDO1FBRUQsRUFBRSxDQUFDLHFDQUFxQyxFQUFFO1lBQ3hDLGlCQUFPLENBQUMsaUJBQWlCLENBQ3JCLGVBQWUsRUFBRSxFQUFDLEdBQUcsRUFBRSxFQUFDLFFBQVEsRUFBRSxtQ0FBaUMsRUFBQyxFQUFDLENBQUMsQ0FBQztZQUMzRSxJQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDMUMsSUFBTSxPQUFPLEdBQUcsSUFBSSxtQkFBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3ZDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1lBQzVDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUV4QixnQkFBZ0I7WUFDaEIsSUFBTSxLQUFLLEdB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