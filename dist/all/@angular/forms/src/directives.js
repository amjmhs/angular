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
var checkbox_value_accessor_1 = require("./directives/checkbox_value_accessor");
var default_value_accessor_1 = require("./directives/default_value_accessor");
var ng_control_status_1 = require("./directives/ng_control_status");
var ng_form_1 = require("./directives/ng_form");
var ng_model_1 = require("./directives/ng_model");
var ng_model_group_1 = require("./directives/ng_model_group");
var ng_no_validate_directive_1 = require("./directives/ng_no_validate_directive");
var number_value_accessor_1 = require("./directives/number_value_accessor");
var radio_control_value_accessor_1 = require("./directives/radio_control_value_accessor");
var range_value_accessor_1 = require("./directives/range_value_accessor");
var form_control_directive_1 = require("./directives/reactive_directives/form_control_directive");
var form_control_name_1 = require("./directives/reactive_directives/form_control_name");
var form_group_directive_1 = require("./directives/reactive_directives/form_group_directive");
var form_group_name_1 = require("./directives/reactive_directives/form_group_name");
var select_control_value_accessor_1 = require("./directives/select_control_value_accessor");
var select_multiple_control_value_accessor_1 = require("./directives/select_multiple_control_value_accessor");
var validators_1 = require("./directives/validators");
var checkbox_value_accessor_2 = require("./directives/checkbox_value_accessor");
exports.CheckboxControlValueAccessor = checkbox_value_accessor_2.CheckboxControlValueAccessor;
var default_value_accessor_2 = require("./directives/default_value_accessor");
exports.DefaultValueAccessor = default_value_accessor_2.DefaultValueAccessor;
var ng_control_1 = require("./directives/ng_control");
exports.NgControl = ng_control_1.NgControl;
var ng_control_status_2 = require("./directives/ng_control_status");
exports.NgControlStatus = ng_control_status_2.NgControlStatus;
exports.NgControlStatusGroup = ng_control_status_2.NgControlStatusGroup;
var ng_form_2 = require("./directives/ng_form");
exports.NgForm = ng_form_2.NgForm;
var ng_model_2 = require("./directives/ng_model");
exports.NgModel = ng_model_2.NgModel;
var ng_model_group_2 = require("./directives/ng_model_group");
exports.NgModelGroup = ng_model_group_2.NgModelGroup;
var number_value_accessor_2 = require("./directives/number_value_accessor");
exports.NumberValueAccessor = number_value_accessor_2.NumberValueAccessor;
var radio_control_value_accessor_2 = require("./directives/radio_control_value_accessor");
exports.RadioControlValueAccessor = radio_control_value_accessor_2.RadioControlValueAccessor;
var range_value_accessor_2 = require("./directives/range_value_accessor");
exports.RangeValueAccessor = range_value_accessor_2.RangeValueAccessor;
var form_control_directive_2 = require("./directives/reactive_directives/form_control_directive");
exports.FormControlDirective = form_control_directive_2.FormControlDirective;
exports.NG_MODEL_WITH_FORM_CONTROL_WARNING = form_control_directive_2.NG_MODEL_WITH_FORM_CONTROL_WARNING;
var form_control_name_2 = require("./directives/reactive_directives/form_control_name");
exports.FormControlName = form_control_name_2.FormControlName;
var form_group_directive_2 = require("./directives/reactive_directives/form_group_directive");
exports.FormGroupDirective = form_group_directive_2.FormGroupDirective;
var form_group_name_2 = require("./directives/reactive_directives/form_group_name");
exports.FormArrayName = form_group_name_2.FormArrayName;
exports.FormGroupName = form_group_name_2.FormGroupName;
var select_control_value_accessor_2 = require("./directives/select_control_value_accessor");
exports.NgSelectOption = select_control_value_accessor_2.NgSelectOption;
exports.SelectControlValueAccessor = select_control_value_accessor_2.SelectControlValueAccessor;
var select_multiple_control_value_accessor_2 = require("./directives/select_multiple_control_value_accessor");
exports.NgSelectMultipleOption = select_multiple_control_value_accessor_2.NgSelectMultipleOption;
exports.SelectMultipleControlValueAccessor = select_multiple_control_value_accessor_2.SelectMultipleControlValueAccessor;
exports.SHARED_FORM_DIRECTIVES = [
    ng_no_validate_directive_1.NgNoValidate,
    select_control_value_accessor_1.NgSelectOption,
    select_multiple_control_value_accessor_1.NgSelectMultipleOption,
    default_value_accessor_1.DefaultValueAccessor,
    number_value_accessor_1.NumberValueAccessor,
    range_value_accessor_1.RangeValueAccessor,
    checkbox_value_accessor_1.CheckboxControlValueAccessor,
    select_control_value_accessor_1.SelectControlValueAccessor,
    select_multiple_control_value_accessor_1.SelectMultipleControlValueAccessor,
    radio_control_value_accessor_1.RadioControlValueAccessor,
    ng_control_status_1.NgControlStatus,
    ng_control_status_1.NgControlStatusGroup,
    validators_1.RequiredValidator,
    validators_1.MinLengthValidator,
    validators_1.MaxLengthValidator,
    validators_1.PatternValidator,
    validators_1.CheckboxRequiredValidator,
    validators_1.EmailValidator,
];
exports.TEMPLATE_DRIVEN_DIRECTIVES = [ng_model_1.NgModel, ng_model_group_1.NgModelGroup, ng_form_1.NgForm];
exports.REACTIVE_DRIVEN_DIRECTIVES = [form_control_directive_1.FormControlDirective, form_group_directive_1.FormGroupDirective, form_control_name_1.FormControlName, form_group_name_1.FormGroupName, form_group_name_1.FormArrayName];
/**
 * Internal module used for sharing directives between FormsModule and ReactiveFormsModule
 */
var InternalFormsSharedModule = /** @class */ (function () {
    function InternalFormsSharedModule() {
    }
    InternalFormsSharedModule = __decorate([
        core_1.NgModule({
            declarations: exports.SHARED_FORM_DIRECTIVES,
            exports: exports.SHARED_FORM_DIRECTIVES,
        })
    ], InternalFormsSharedModule);
    return InternalFormsSharedModule;
}());
exports.InternalFormsSharedModule = InternalFormsSharedModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsc0NBQTZDO0FBRTdDLGdGQUFrRjtBQUNsRiw4RUFBeUU7QUFDekUsb0VBQXFGO0FBQ3JGLGdEQUE0QztBQUM1QyxrREFBOEM7QUFDOUMsOERBQXlEO0FBQ3pELGtGQUFtRTtBQUNuRSw0RUFBdUU7QUFDdkUsMEZBQW9GO0FBQ3BGLDBFQUFxRTtBQUNyRSxrR0FBNkY7QUFDN0Ysd0ZBQW1GO0FBQ25GLDhGQUF5RjtBQUN6RixvRkFBOEY7QUFDOUYsNEZBQXNHO0FBQ3RHLDhHQUErSDtBQUMvSCxzREFBK0o7QUFFL0osZ0ZBQWtGO0FBQTFFLGlFQUFBLDRCQUE0QixDQUFBO0FBRXBDLDhFQUF5RTtBQUFqRSx3REFBQSxvQkFBb0IsQ0FBQTtBQUM1QixzREFBa0Q7QUFBMUMsaUNBQUEsU0FBUyxDQUFBO0FBQ2pCLG9FQUFxRjtBQUE3RSw4Q0FBQSxlQUFlLENBQUE7QUFBRSxtREFBQSxvQkFBb0IsQ0FBQTtBQUM3QyxnREFBNEM7QUFBcEMsMkJBQUEsTUFBTSxDQUFBO0FBQ2Qsa0RBQThDO0FBQXRDLDZCQUFBLE9BQU8sQ0FBQTtBQUNmLDhEQUF5RDtBQUFqRCx3Q0FBQSxZQUFZLENBQUE7QUFDcEIsNEVBQXVFO0FBQS9ELHNEQUFBLG1CQUFtQixDQUFBO0FBQzNCLDBGQUFvRjtBQUE1RSxtRUFBQSx5QkFBeUIsQ0FBQTtBQUNqQywwRUFBcUU7QUFBN0Qsb0RBQUEsa0JBQWtCLENBQUE7QUFDMUIsa0dBQWlJO0FBQXpILHdEQUFBLG9CQUFvQixDQUFBO0FBQUUsc0VBQUEsa0NBQWtDLENBQUE7QUFDaEUsd0ZBQW1GO0FBQTNFLDhDQUFBLGVBQWUsQ0FBQTtBQUN2Qiw4RkFBeUY7QUFBakYsb0RBQUEsa0JBQWtCLENBQUE7QUFDMUIsb0ZBQThGO0FBQXRGLDBDQUFBLGFBQWEsQ0FBQTtBQUFFLDBDQUFBLGFBQWEsQ0FBQTtBQUNwQyw0RkFBc0c7QUFBOUYseURBQUEsY0FBYyxDQUFBO0FBQUUscUVBQUEsMEJBQTBCLENBQUE7QUFDbEQsOEdBQStIO0FBQXZILDBFQUFBLHNCQUFzQixDQUFBO0FBQUUsc0ZBQUEsa0NBQWtDLENBQUE7QUFFckQsUUFBQSxzQkFBc0IsR0FBZ0I7SUFDakQsdUNBQVk7SUFDWiw4Q0FBYztJQUNkLCtEQUFzQjtJQUN0Qiw2Q0FBb0I7SUFDcEIsMkNBQW1CO0lBQ25CLHlDQUFrQjtJQUNsQixzREFBNEI7SUFDNUIsMERBQTBCO0lBQzFCLDJFQUFrQztJQUNsQyx3REFBeUI7SUFDekIsbUNBQWU7SUFDZix3Q0FBb0I7SUFDcEIsOEJBQWlCO0lBQ2pCLCtCQUFrQjtJQUNsQiwrQkFBa0I7SUFDbEIsNkJBQWdCO0lBQ2hCLHNDQUF5QjtJQUN6QiwyQkFBYztDQUNmLENBQUM7QUFFVyxRQUFBLDBCQUEwQixHQUFnQixDQUFDLGtCQUFPLEVBQUUsNkJBQVksRUFBRSxnQkFBTSxDQUFDLENBQUM7QUFFMUUsUUFBQSwwQkFBMEIsR0FDbkMsQ0FBQyw2Q0FBb0IsRUFBRSx5Q0FBa0IsRUFBRSxtQ0FBZSxFQUFFLCtCQUFhLEVBQUUsK0JBQWEsQ0FBQyxDQUFDO0FBRTlGOztHQUVHO0FBS0g7SUFBQTtJQUNBLENBQUM7SUFEWSx5QkFBeUI7UUFKckMsZUFBUSxDQUFDO1lBQ1IsWUFBWSxFQUFFLDhCQUFzQjtZQUNwQyxPQUFPLEVBQUUsOEJBQXNCO1NBQ2hDLENBQUM7T0FDVyx5QkFBeUIsQ0FDckM7SUFBRCxnQ0FBQztDQUFBLEFBREQsSUFDQztBQURZLDhEQUF5QiJ9