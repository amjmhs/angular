"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var validators_1 = require("../../validators");
var abstract_form_group_directive_1 = require("../abstract_form_group_directive");
var control_container_1 = require("../control_container");
var control_value_accessor_1 = require("../control_value_accessor");
var ng_control_1 = require("../ng_control");
var reactive_errors_1 = require("../reactive_errors");
var shared_1 = require("../shared");
var form_control_directive_1 = require("./form_control_directive");
var form_group_directive_1 = require("./form_group_directive");
var form_group_name_1 = require("./form_group_name");
exports.controlNameBinding = {
    provide: ng_control_1.NgControl,
    useExisting: core_1.forwardRef(function () { return FormControlName; })
};
/**
 * @description
 *
 * Syncs a `FormControl` in an existing `FormGroup` to a form control
 * element by name.
 *
 * This directive ensures that any values written to the `FormControl`
 * instance programmatically will be written to the DOM element (model -> view). Conversely,
 * any values written to the DOM element through user input will be reflected in the
 * `FormControl` instance (view -> model).
 *
 * @usageNotes
 * This directive is designed to be used with a parent `FormGroupDirective` (selector:
 * `[formGroup]`).
 *
 * It accepts the string name of the `FormControl` instance you want to
 * link, and will look for a `FormControl` registered with that name in the
 * closest `FormGroup` or `FormArray` above it.
 *
 * **Access the control**: You can access the `FormControl` associated with
 * this directive by using the {@link AbstractControl#get get} method.
 * Ex: `this.form.get('first');`
 *
 * **Get value**: the `value` property is always synced and available on the `FormControl`.
 * See a full list of available properties in `AbstractControl`.
 *
 *  **Set value**: You can set an initial value for the control when instantiating the
 *  `FormControl`, or you can set it programmatically later using
 *  {@link AbstractControl#setValue setValue} or {@link AbstractControl#patchValue patchValue}.
 *
 * **Listen to value**: If you want to listen to changes in the value of the control, you can
 * subscribe to the {@link AbstractControl#valueChanges valueChanges} event.  You can also listen to
 * {@link AbstractControl#statusChanges statusChanges} to be notified when the validation status is
 * re-calculated.
 *
 * ### Example
 *
 * In this example, we create form controls for first name and last name.
 *
 * {@example forms/ts/simpleFormGroup/simple_form_group_example.ts region='Component'}
 *
 * To see `formControlName` examples with different form control types, see:
 *
 * * Radio buttons: `RadioControlValueAccessor`
 * * Selects: `SelectControlValueAccessor`
 *
 * ### Use with ngModel
 *
 * Support for using the `ngModel` input property and `ngModelChange` event with reactive
 * form directives has been deprecated in Angular v6 and will be removed in Angular v7.
 *
 * Now deprecated:
 *
 * ```html
 * <form [formGroup]="form">
 *   <input formControlName="first" [(ngModel)]="value">
 * </form>
 * ```
 *
 * ```ts
 * this.value = 'some value';
 * ```
 *
 * This has been deprecated for a few reasons. First, developers have found this pattern
 * confusing. It seems like the actual `ngModel` directive is being used, but in fact it's
 * an input/output property named `ngModel` on the reactive form directive that simply
 * approximates (some of) its behavior. Specifically, it allows getting/setting the value
 * and intercepting value events. However, some of `ngModel`'s other features - like
 * delaying updates with`ngModelOptions` or exporting the directive - simply don't work,
 * which has understandably caused some confusion.
 *
 * In addition, this pattern mixes template-driven and reactive forms strategies, which
 * we generally don't recommend because it doesn't take advantage of the full benefits of
 * either strategy. Setting the value in the template violates the template-agnostic
 * principles behind reactive forms, whereas adding a `FormControl`/`FormGroup` layer in
 * the class removes the convenience of defining forms in the template.
 *
 * To update your code before v7, you'll want to decide whether to stick with reactive form
 * directives (and get/set values using reactive forms patterns) or switch over to
 * template-driven directives.
 *
 * After (choice 1 - use reactive forms):
 *
 * ```html
 * <form [formGroup]="form">
 *   <input formControlName="first">
 * </form>
 * ```
 *
 * ```ts
 * this.form.get('first').setValue('some value');
 * ```
 *
 * After (choice 2 - use template-driven forms):
 *
 * ```html
 * <input [(ngModel)]="value">
 * ```
 *
 * ```ts
 * this.value = 'some value';
 * ```
 *
 * By default, when you use this pattern, you will see a deprecation warning once in dev
 * mode. You can choose to silence this warning by providing a config for
 * `ReactiveFormsModule` at import time:
 *
 * ```ts
 * imports: [
 *   ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'});
 * ]
 * ```
 *
 * Alternatively, you can choose to surface a separate warning for each instance of this
 * pattern with a config value of `"always"`. This may help to track down where in the code
 * the pattern is being used as the code is being updated.
 *
 * @ngModule ReactiveFormsModule
 */
var FormControlName = /** @class */ (function (_super) {
    __extends(FormControlName, _super);
    function FormControlName(parent, validators, asyncValidators, valueAccessors, _ngModelWarningConfig) {
        var _this = _super.call(this) || this;
        _this._ngModelWarningConfig = _ngModelWarningConfig;
        _this._added = false;
        /** @deprecated as of v6 */
        _this.update = new core_1.EventEmitter();
        /**
         * Instance property used to track whether an ngModel warning has been sent out for this
         * particular FormControlName instance. Used to support warning config of "always".
         *
         * @internal
         */
        _this._ngModelWarningSent = false;
        _this._parent = parent;
        _this._rawValidators = validators || [];
        _this._rawAsyncValidators = asyncValidators || [];
        _this.valueAccessor = shared_1.selectValueAccessor(_this, valueAccessors);
        return _this;
    }
    FormControlName_1 = FormControlName;
    Object.defineProperty(FormControlName.prototype, "isDisabled", {
        set: function (isDisabled) { reactive_errors_1.ReactiveErrors.disabledAttrWarning(); },
        enumerable: true,
        configurable: true
    });
    FormControlName.prototype.ngOnChanges = function (changes) {
        if (!this._added)
            this._setUpControl();
        if (shared_1.isPropertyUpdated(changes, this.viewModel)) {
            shared_1._ngModelWarning('formControlName', FormControlName_1, this, this._ngModelWarningConfig);
            this.viewModel = this.model;
            this.formDirective.updateModel(this, this.model);
        }
    };
    FormControlName.prototype.ngOnDestroy = function () {
        if (this.formDirective) {
            this.formDirective.removeControl(this);
        }
    };
    FormControlName.prototype.viewToModelUpdate = function (newValue) {
        this.viewModel = newValue;
        this.update.emit(newValue);
    };
    Object.defineProperty(FormControlName.prototype, "path", {
        get: function () { return shared_1.controlPath(this.name, this._parent); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormControlName.prototype, "formDirective", {
        get: function () { return this._parent ? this._parent.formDirective : null; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormControlName.prototype, "validator", {
        get: function () { return shared_1.composeValidators(this._rawValidators); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormControlName.prototype, "asyncValidator", {
        get: function () {
            return shared_1.composeAsyncValidators(this._rawAsyncValidators);
        },
        enumerable: true,
        configurable: true
    });
    FormControlName.prototype._checkParentType = function () {
        if (!(this._parent instanceof form_group_name_1.FormGroupName) &&
            this._parent instanceof abstract_form_group_directive_1.AbstractFormGroupDirective) {
            reactive_errors_1.ReactiveErrors.ngModelGroupException();
        }
        else if (!(this._parent instanceof form_group_name_1.FormGroupName) && !(this._parent instanceof form_group_directive_1.FormGroupDirective) &&
            !(this._parent instanceof form_group_name_1.FormArrayName)) {
            reactive_errors_1.ReactiveErrors.controlParentException();
        }
    };
    FormControlName.prototype._setUpControl = function () {
        this._checkParentType();
        this.control = this.formDirective.addControl(this);
        if (this.control.disabled && this.valueAccessor.setDisabledState) {
            this.valueAccessor.setDisabledState(true);
        }
        this._added = true;
    };
    var FormControlName_1;
    /**
     * Static property used to track whether any ngModel warnings have been sent across
     * all instances of FormControlName. Used to support warning config of "once".
     *
     * @internal
     */
    FormControlName._ngModelWarningSentOnce = false;
    __decorate([
        core_1.Input('formControlName'),
        __metadata("design:type", String)
    ], FormControlName.prototype, "name", void 0);
    __decorate([
        core_1.Input('disabled'),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], FormControlName.prototype, "isDisabled", null);
    __decorate([
        core_1.Input('ngModel'),
        __metadata("design:type", Object)
    ], FormControlName.prototype, "model", void 0);
    __decorate([
        core_1.Output('ngModelChange'),
        __metadata("design:type", Object)
    ], FormControlName.prototype, "update", void 0);
    FormControlName = FormControlName_1 = __decorate([
        core_1.Directive({ selector: '[formControlName]', providers: [exports.controlNameBinding] }),
        __param(0, core_1.Optional()), __param(0, core_1.Host()), __param(0, core_1.SkipSelf()),
        __param(1, core_1.Optional()), __param(1, core_1.Self()), __param(1, core_1.Inject(validators_1.NG_VALIDATORS)),
        __param(2, core_1.Optional()), __param(2, core_1.Self()), __param(2, core_1.Inject(validators_1.NG_ASYNC_VALIDATORS)),
        __param(3, core_1.Optional()), __param(3, core_1.Self()), __param(3, core_1.Inject(control_value_accessor_1.NG_VALUE_ACCESSOR)),
        __param(4, core_1.Optional()), __param(4, core_1.Inject(form_control_directive_1.NG_MODEL_WITH_FORM_CONTROL_WARNING)),
        __metadata("design:paramtypes", [control_container_1.ControlContainer,
            Array,
            Array, Array, Object])
    ], FormControlName);
    return FormControlName;
}(ng_control_1.NgControl));
exports.FormControlName = FormControlName;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9jb250cm9sX25hbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9yZWFjdGl2ZV9kaXJlY3RpdmVzL2Zvcm1fY29udHJvbF9uYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILHNDQUE4SjtBQUc5SiwrQ0FBb0U7QUFDcEUsa0ZBQTRFO0FBQzVFLDBEQUFzRDtBQUN0RCxvRUFBa0Y7QUFDbEYsNENBQXdDO0FBQ3hDLHNEQUFrRDtBQUNsRCxvQ0FBMEk7QUFHMUksbUVBQTRFO0FBQzVFLCtEQUEwRDtBQUMxRCxxREFBK0Q7QUFFbEQsUUFBQSxrQkFBa0IsR0FBUTtJQUNyQyxPQUFPLEVBQUUsc0JBQVM7SUFDbEIsV0FBVyxFQUFFLGlCQUFVLENBQUMsY0FBTSxPQUFBLGVBQWUsRUFBZixDQUFlLENBQUM7Q0FDL0MsQ0FBQztBQUVGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBc0hHO0FBRUg7SUFBcUMsbUNBQVM7SUFxQzVDLHlCQUNvQyxNQUF3QixFQUNiLFVBQXdDLEVBQ2xDLGVBQ1AsRUFDSyxjQUFzQyxFQUNyQixxQkFDNUQ7UUFQUixZQVFFLGlCQUFPLFNBS1I7UUFQbUUsMkJBQXFCLEdBQXJCLHFCQUFxQixDQUNqRjtRQTNDQSxZQUFNLEdBQUcsS0FBSyxDQUFDO1FBaUJ2QiwyQkFBMkI7UUFDRixZQUFNLEdBQUcsSUFBSSxtQkFBWSxFQUFFLENBQUM7UUFVckQ7Ozs7O1dBS0c7UUFDSCx5QkFBbUIsR0FBRyxLQUFLLENBQUM7UUFXMUIsS0FBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7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