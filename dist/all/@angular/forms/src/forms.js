"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module
 * @description
 * This module is used for handling user input, by defining and building a `FormGroup` that
 * consists of `FormControl` objects, and mapping them onto the DOM. `FormControl`
 * objects can then be used to read information from the form DOM elements.
 *
 * Forms providers are not included in default providers; you must import these providers
 * explicitly.
 */
var abstract_control_directive_1 = require("./directives/abstract_control_directive");
exports.AbstractControlDirective = abstract_control_directive_1.AbstractControlDirective;
var abstract_form_group_directive_1 = require("./directives/abstract_form_group_directive");
exports.AbstractFormGroupDirective = abstract_form_group_directive_1.AbstractFormGroupDirective;
var checkbox_value_accessor_1 = require("./directives/checkbox_value_accessor");
exports.CheckboxControlValueAccessor = checkbox_value_accessor_1.CheckboxControlValueAccessor;
var control_container_1 = require("./directives/control_container");
exports.ControlContainer = control_container_1.ControlContainer;
var control_value_accessor_1 = require("./directives/control_value_accessor");
exports.NG_VALUE_ACCESSOR = control_value_accessor_1.NG_VALUE_ACCESSOR;
var default_value_accessor_1 = require("./directives/default_value_accessor");
exports.COMPOSITION_BUFFER_MODE = default_value_accessor_1.COMPOSITION_BUFFER_MODE;
exports.DefaultValueAccessor = default_value_accessor_1.DefaultValueAccessor;
var ng_control_1 = require("./directives/ng_control");
exports.NgControl = ng_control_1.NgControl;
var ng_control_status_1 = require("./directives/ng_control_status");
exports.NgControlStatus = ng_control_status_1.NgControlStatus;
exports.NgControlStatusGroup = ng_control_status_1.NgControlStatusGroup;
var ng_form_1 = require("./directives/ng_form");
exports.NgForm = ng_form_1.NgForm;
var ng_model_1 = require("./directives/ng_model");
exports.NgModel = ng_model_1.NgModel;
var ng_model_group_1 = require("./directives/ng_model_group");
exports.NgModelGroup = ng_model_group_1.NgModelGroup;
var radio_control_value_accessor_1 = require("./directives/radio_control_value_accessor");
exports.RadioControlValueAccessor = radio_control_value_accessor_1.RadioControlValueAccessor;
var form_control_directive_1 = require("./directives/reactive_directives/form_control_directive");
exports.FormControlDirective = form_control_directive_1.FormControlDirective;
var form_control_name_1 = require("./directives/reactive_directives/form_control_name");
exports.FormControlName = form_control_name_1.FormControlName;
var form_group_directive_1 = require("./directives/reactive_directives/form_group_directive");
exports.FormGroupDirective = form_group_directive_1.FormGroupDirective;
var form_group_name_1 = require("./directives/reactive_directives/form_group_name");
exports.FormArrayName = form_group_name_1.FormArrayName;
var form_group_name_2 = require("./directives/reactive_directives/form_group_name");
exports.FormGroupName = form_group_name_2.FormGroupName;
var select_control_value_accessor_1 = require("./directives/select_control_value_accessor");
exports.NgSelectOption = select_control_value_accessor_1.NgSelectOption;
exports.SelectControlValueAccessor = select_control_value_accessor_1.SelectControlValueAccessor;
var select_multiple_control_value_accessor_1 = require("./directives/select_multiple_control_value_accessor");
exports.SelectMultipleControlValueAccessor = select_multiple_control_value_accessor_1.SelectMultipleControlValueAccessor;
var validators_1 = require("./directives/validators");
exports.CheckboxRequiredValidator = validators_1.CheckboxRequiredValidator;
exports.EmailValidator = validators_1.EmailValidator;
exports.MaxLengthValidator = validators_1.MaxLengthValidator;
exports.MinLengthValidator = validators_1.MinLengthValidator;
exports.PatternValidator = validators_1.PatternValidator;
exports.RequiredValidator = validators_1.RequiredValidator;
var form_builder_1 = require("./form_builder");
exports.FormBuilder = form_builder_1.FormBuilder;
var model_1 = require("./model");
exports.AbstractControl = model_1.AbstractControl;
exports.FormArray = model_1.FormArray;
exports.FormControl = model_1.FormControl;
exports.FormGroup = model_1.FormGroup;
var validators_2 = require("./validators");
exports.NG_ASYNC_VALIDATORS = validators_2.NG_ASYNC_VALIDATORS;
exports.NG_VALIDATORS = validators_2.NG_VALIDATORS;
exports.Validators = validators_2.Validators;
var version_1 = require("./version");
exports.VERSION = version_1.VERSION;
__export(require("./form_providers"));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZm9ybXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7QUFFSDs7Ozs7Ozs7O0dBU0c7QUFHSCxzRkFBaUY7QUFBekUsZ0VBQUEsd0JBQXdCLENBQUE7QUFDaEMsNEZBQXNGO0FBQTlFLHFFQUFBLDBCQUEwQixDQUFBO0FBQ2xDLGdGQUFrRjtBQUExRSxpRUFBQSw0QkFBNEIsQ0FBQTtBQUNwQyxvRUFBZ0U7QUFBeEQsK0NBQUEsZ0JBQWdCLENBQUE7QUFDeEIsOEVBQTRGO0FBQTlELHFEQUFBLGlCQUFpQixDQUFBO0FBQy9DLDhFQUFrRztBQUExRiwyREFBQSx1QkFBdUIsQ0FBQTtBQUFFLHdEQUFBLG9CQUFvQixDQUFBO0FBRXJELHNEQUFrRDtBQUExQyxpQ0FBQSxTQUFTLENBQUE7QUFDakIsb0VBQXFGO0FBQTdFLDhDQUFBLGVBQWUsQ0FBQTtBQUFFLG1EQUFBLG9CQUFvQixDQUFBO0FBQzdDLGdEQUE0QztBQUFwQywyQkFBQSxNQUFNLENBQUE7QUFDZCxrREFBOEM7QUFBdEMsNkJBQUEsT0FBTyxDQUFBO0FBQ2YsOERBQXlEO0FBQWpELHdDQUFBLFlBQVksQ0FBQTtBQUNwQiwwRkFBb0Y7QUFBNUUsbUVBQUEseUJBQXlCLENBQUE7QUFDakMsa0dBQTZGO0FBQXJGLHdEQUFBLG9CQUFvQixDQUFBO0FBQzVCLHdGQUFtRjtBQUEzRSw4Q0FBQSxlQUFlLENBQUE7QUFDdkIsOEZBQXlGO0FBQWpGLG9EQUFBLGtCQUFrQixDQUFBO0FBQzFCLG9GQUErRTtBQUF2RSwwQ0FBQSxhQUFhLENBQUE7QUFDckIsb0ZBQStFO0FBQXZFLDBDQUFBLGFBQWEsQ0FBQTtBQUNyQiw0RkFBc0c7QUFBOUYseURBQUEsY0FBYyxDQUFBO0FBQUUscUVBQUEsMEJBQTBCLENBQUE7QUFDbEQsOEdBQXVHO0FBQS9GLHNGQUFBLGtDQUFrQyxDQUFBO0FBQzFDLHNEQUEyTztBQUFqTSxpREFBQSx5QkFBeUIsQ0FBQTtBQUFFLHNDQUFBLGNBQWMsQ0FBQTtBQUFFLDBDQUFBLGtCQUFrQixDQUFBO0FBQUUsMENBQUEsa0JBQWtCLENBQUE7QUFBRSx3Q0FBQSxnQkFBZ0IsQ0FBQTtBQUFFLHlDQUFBLGlCQUFpQixDQUFBO0FBQ2hLLCtDQUEyQztBQUFuQyxxQ0FBQSxXQUFXLENBQUE7QUFDbkIsaUNBQW1HO0FBQTNGLGtDQUFBLGVBQWUsQ0FBQTtBQUEwQiw0QkFBQSxTQUFTLENBQUE7QUFBRSw4QkFBQSxXQUFXLENBQUE7QUFBRSw0QkFBQSxTQUFTLENBQUE7QUFDbEYsMkNBQTRFO0FBQXBFLDJDQUFBLG1CQUFtQixDQUFBO0FBQUUscUNBQUEsYUFBYSxDQUFBO0FBQUUsa0NBQUEsVUFBVSxDQUFBO0FBQ3RELHFDQUFrQztBQUExQiw0QkFBQSxPQUFPLENBQUE7QUFFZixzQ0FBaUMifQ==