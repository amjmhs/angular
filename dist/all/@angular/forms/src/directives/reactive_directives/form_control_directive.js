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
var model_1 = require("../../model");
var validators_1 = require("../../validators");
var control_value_accessor_1 = require("../control_value_accessor");
var ng_control_1 = require("../ng_control");
var reactive_errors_1 = require("../reactive_errors");
var shared_1 = require("../shared");
/**
 * Token to provide to turn off the ngModel warning on formControl and formControlName.
 */
exports.NG_MODEL_WITH_FORM_CONTROL_WARNING = new core_1.InjectionToken('NgModelWithFormControlWarning');
exports.formControlBinding = {
    provide: ng_control_1.NgControl,
    useExisting: core_1.forwardRef(function () { return FormControlDirective; })
};
/**
 * @description
 *
 * Syncs a standalone `FormControl` instance to a form control element.
 *
 * This directive ensures that any values written to the `FormControl`
 * instance programmatically will be written to the DOM element (model -> view). Conversely,
 * any values written to the DOM element through user input will be reflected in the
 * `FormControl` instance (view -> model).
 *
 * @usageNotes
 * Use this directive if you'd like to create and manage a `FormControl` instance directly.
 * Simply create a `FormControl`, save it to your component class, and pass it into the
 * `FormControlDirective`.
 *
 * This directive is designed to be used as a standalone control.  Unlike `FormControlName`,
 * it does not require that your `FormControl` instance be part of any parent
 * `FormGroup`, and it won't be registered to any `FormGroupDirective` that
 * exists above it.
 *
 * **Get the value**: the `value` property is always synced and available on the
 * `FormControl` instance. See a full list of available properties in
 * `AbstractControl`.
 *
 * **Set the value**: You can pass in an initial value when instantiating the `FormControl`,
 * or you can set it programmatically later using {@link AbstractControl#setValue setValue} or
 * {@link AbstractControl#patchValue patchValue}.
 *
 * **Listen to value**: If you want to listen to changes in the value of the control, you can
 * subscribe to the {@link AbstractControl#valueChanges valueChanges} event.  You can also listen to
 * {@link AbstractControl#statusChanges statusChanges} to be notified when the validation status is
 * re-calculated.
 *
 * ### Example
 *
 * {@example forms/ts/simpleFormControl/simple_form_control_example.ts region='Component'}
 *
 * ### Use with ngModel
 *
 * Support for using the `ngModel` input property and `ngModelChange` event with reactive
 * form directives has been deprecated in Angular v6 and will be removed in Angular v7.
 *
 * Now deprecated:
 *
 * ```html
 * <input [formControl]="control" [(ngModel)]="value">
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
 * <input [formControl]="control">
 * ```
 *
 * ```ts
 * this.control.setValue('some value');
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
var FormControlDirective = /** @class */ (function (_super) {
    __extends(FormControlDirective, _super);
    function FormControlDirective(validators, asyncValidators, valueAccessors, _ngModelWarningConfig) {
        var _this = _super.call(this) || this;
        _this._ngModelWarningConfig = _ngModelWarningConfig;
        /** @deprecated as of v6 */
        _this.update = new core_1.EventEmitter();
        /**
         * Instance property used to track whether an ngModel warning has been sent out for this
         * particular FormControlDirective instance. Used to support warning config of "always".
         *
         * @internal
         */
        _this._ngModelWarningSent = false;
        _this._rawValidators = validators || [];
        _this._rawAsyncValidators = asyncValidators || [];
        _this.valueAccessor = shared_1.selectValueAccessor(_this, valueAccessors);
        return _this;
    }
    FormControlDirective_1 = FormControlDirective;
    Object.defineProperty(FormControlDirective.prototype, "isDisabled", {
        set: function (isDisabled) { reactive_errors_1.ReactiveErrors.disabledAttrWarning(); },
        enumerable: true,
        configurable: true
    });
    FormControlDirective.prototype.ngOnChanges = function (changes) {
        if (this._isControlChanged(changes)) {
            shared_1.setUpControl(this.form, this);
            if (this.control.disabled && this.valueAccessor.setDisabledState) {
                this.valueAccessor.setDisabledState(true);
            }
            this.form.updateValueAndValidity({ emitEvent: false });
        }
        if (shared_1.isPropertyUpdated(changes, this.viewModel)) {
            shared_1._ngModelWarning('formControl', FormControlDirective_1, this, this._ngModelWarningConfig);
            this.form.setValue(this.model);
            this.viewModel = this.model;
        }
    };
    Object.defineProperty(FormControlDirective.prototype, "path", {
        get: function () { return []; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormControlDirective.prototype, "validator", {
        get: function () { return shared_1.composeValidators(this._rawValidators); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormControlDirective.prototype, "asyncValidator", {
        get: function () {
            return shared_1.composeAsyncValidators(this._rawAsyncValidators);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormControlDirective.prototype, "control", {
        get: function () { return this.form; },
        enumerable: true,
        configurable: true
    });
    FormControlDirective.prototype.viewToModelUpdate = function (newValue) {
        this.viewModel = newValue;
        this.update.emit(newValue);
    };
    FormControlDirective.prototype._isControlChanged = function (changes) {
        return changes.hasOwnProperty('form');
    };
    var FormControlDirective_1;
    /**
     * Static property used to track whether any ngModel warnings have been sent across
     * all instances of FormControlDirective. Used to support warning config of "once".
     *
     * @internal
     */
    FormControlDirective._ngModelWarningSentOnce = false;
    __decorate([
        core_1.Input('formControl'),
        __metadata("design:type", model_1.FormControl)
    ], FormControlDirective.prototype, "form", void 0);
    __decorate([
        core_1.Input('disabled'),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], FormControlDirective.prototype, "isDisabled", null);
    __decorate([
        core_1.Input('ngModel'),
        __metadata("design:type", Object)
    ], FormControlDirective.prototype, "model", void 0);
    __decorate([
        core_1.Output('ngModelChange'),
        __metadata("design:type", Object)
    ], FormControlDirective.prototype, "update", void 0);
    FormControlDirective = FormControlDirective_1 = __decorate([
        core_1.Directive({ selector: '[formControl]', providers: [exports.formControlBinding], exportAs: 'ngForm' }),
        __param(0, core_1.Optional()), __param(0, core_1.Self()), __param(0, core_1.Inject(validators_1.NG_VALIDATORS)),
        __param(1, core_1.Optional()), __param(1, core_1.Self()), __param(1, core_1.Inject(validators_1.NG_ASYNC_VALIDATORS)),
        __param(2, core_1.Optional()), __param(2, core_1.Self()), __param(2, core_1.Inject(control_value_accessor_1.NG_VALUE_ACCESSOR)),
        __param(3, core_1.Optional()), __param(3, core_1.Inject(exports.NG_MODEL_WITH_FORM_CONTROL_WARNING)),
        __metadata("design:paramtypes", [Array,
            Array, Array, Object])
    ], FormControlDirective);
    return FormControlDirective;
}(ng_control_1.NgControl));
exports.FormControlDirective = FormControlDirective;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9jb250cm9sX2RpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL3JlYWN0aXZlX2RpcmVjdGl2ZXMvZm9ybV9jb250cm9sX2RpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBbUo7QUFFbkoscUNBQXdDO0FBQ3hDLCtDQUFvRTtBQUNwRSxvRUFBa0Y7QUFDbEYsNENBQXdDO0FBQ3hDLHNEQUFrRDtBQUNsRCxvQ0FBMkk7QUFJM0k7O0dBRUc7QUFDVSxRQUFBLGtDQUFrQyxHQUMzQyxJQUFJLHFCQUFjLENBQUMsK0JBQStCLENBQUMsQ0FBQztBQUUzQyxRQUFBLGtCQUFrQixHQUFRO0lBQ3JDLE9BQU8sRUFBRSxzQkFBUztJQUNsQixXQUFXLEVBQUUsaUJBQVUsQ0FBQyxjQUFNLE9BQUEsb0JBQW9CLEVBQXBCLENBQW9CLENBQUM7Q0FDcEQsQ0FBQztBQUVGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F5R0c7QUFHSDtJQUEwQyx3Q0FBUztJQWlDakQsOEJBQXVELFVBQXdDLEVBQ2xDLGVBQXVELEVBRXhHLGNBQXNDLEVBQzBCLHFCQUFrQztRQUo5RyxZQUtjLGlCQUFPLFNBSVI7UUFMK0QsMkJBQXFCLEdBQXJCLHFCQUFxQixDQUFhO1FBdkI5RywyQkFBMkI7UUFDRixZQUFNLEdBQUcsSUFBSSxtQkFBWSxFQUFFLENBQUM7UUFVckQ7Ozs7O1dBS0c7UUFDSCx5QkFBbUIsR0FBRyxLQUFLLENBQUM7UUFRZCxLQUFJLENBQUMsY0FBYyxHQUFHLFVBQVUsSUFBSSxFQUFFLENBQUM7UUFDdkMsS0FB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