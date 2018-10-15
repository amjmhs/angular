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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var validators_1 = require("../validators");
exports.REQUIRED_VALIDATOR = {
    provide: validators_1.NG_VALIDATORS,
    useExisting: core_1.forwardRef(function () { return RequiredValidator; }),
    multi: true
};
exports.CHECKBOX_REQUIRED_VALIDATOR = {
    provide: validators_1.NG_VALIDATORS,
    useExisting: core_1.forwardRef(function () { return CheckboxRequiredValidator; }),
    multi: true
};
/**
 * A Directive that adds the `required` validator to any controls marked with the
 * `required` attribute, via the `NG_VALIDATORS` binding.
 *
 * @usageNotes
 * ### Example
 *
 * ```
 * <input name="fullName" ngModel required>
 * ```
 *
 * @ngModule FormsModule
 * @ngModule ReactiveFormsModule
 */
var RequiredValidator = /** @class */ (function () {
    function RequiredValidator() {
    }
    Object.defineProperty(RequiredValidator.prototype, "required", {
        get: function () { return this._required; },
        set: function (value) {
            this._required = value != null && value !== false && "" + value !== 'false';
            if (this._onChange)
                this._onChange();
        },
        enumerable: true,
        configurable: true
    });
    RequiredValidator.prototype.validate = function (control) {
        return this.required ? validators_1.Validators.required(control) : null;
    };
    RequiredValidator.prototype.registerOnValidatorChange = function (fn) { this._onChange = fn; };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], RequiredValidator.prototype, "required", null);
    RequiredValidator = __decorate([
        core_1.Directive({
            selector: ':not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]',
            providers: [exports.REQUIRED_VALIDATOR],
            host: { '[attr.required]': 'required ? "" : null' }
        })
    ], RequiredValidator);
    return RequiredValidator;
}());
exports.RequiredValidator = RequiredValidator;
/**
 * A Directive that adds the `required` validator to checkbox controls marked with the
 * `required` attribute, via the `NG_VALIDATORS` binding.
 *
 * @usageNotes
 * ### Example
 *
 * ```
 * <input type="checkbox" name="active" ngModel required>
 * ```
 *
 * @experimental
 * @ngModule FormsModule
 * @ngModule ReactiveFormsModule
 */
var CheckboxRequiredValidator = /** @class */ (function (_super) {
    __extends(CheckboxRequiredValidator, _super);
    function CheckboxRequiredValidator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CheckboxRequiredValidator.prototype.validate = function (control) {
        return this.required ? validators_1.Validators.requiredTrue(control) : null;
    };
    CheckboxRequiredValidator = __decorate([
        core_1.Directive({
            selector: 'input[type=checkbox][required][formControlName],input[type=checkbox][required][formControl],input[type=checkbox][required][ngModel]',
            providers: [exports.CHECKBOX_REQUIRED_VALIDATOR],
            host: { '[attr.required]': 'required ? "" : null' }
        })
    ], CheckboxRequiredValidator);
    return CheckboxRequiredValidator;
}(RequiredValidator));
exports.CheckboxRequiredValidator = CheckboxRequiredValidator;
/**
 * Provider which adds `EmailValidator` to `NG_VALIDATORS`.
 */
exports.EMAIL_VALIDATOR = {
    provide: validators_1.NG_VALIDATORS,
    useExisting: core_1.forwardRef(function () { return EmailValidator; }),
    multi: true
};
/**
 * A Directive that adds the `email` validator to controls marked with the
 * `email` attribute, via the `NG_VALIDATORS` binding.
 *
 * @usageNotes
 * ### Example
 *
 * ```
 * <input type="email" name="email" ngModel email>
 * <input type="email" name="email" ngModel email="true">
 * <input type="email" name="email" ngModel [email]="true">
 * ```
 *
 * @experimental
 * @ngModule FormsModule
 * @ngModule ReactiveFormsModule
 */
var EmailValidator = /** @class */ (function () {
    function EmailValidator() {
    }
    Object.defineProperty(EmailValidator.prototype, "email", {
        set: function (value) {
            this._enabled = value === '' || value === true || value === 'true';
            if (this._onChange)
                this._onChange();
        },
        enumerable: true,
        configurable: true
    });
    EmailValidator.prototype.validate = function (control) {
        return this._enabled ? validators_1.Validators.email(control) : null;
    };
    EmailValidator.prototype.registerOnValidatorChange = function (fn) { this._onChange = fn; };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], EmailValidator.prototype, "email", null);
    EmailValidator = __decorate([
        core_1.Directive({
            selector: '[email][formControlName],[email][formControl],[email][ngModel]',
            providers: [exports.EMAIL_VALIDATOR]
        })
    ], EmailValidator);
    return EmailValidator;
}());
exports.EmailValidator = EmailValidator;
/**
 * Provider which adds `MinLengthValidator` to `NG_VALIDATORS`.
 *
 * @usageNotes
 * ### Example:
 *
 * {@example common/forms/ts/validators/validators.ts region='min'}
 */
exports.MIN_LENGTH_VALIDATOR = {
    provide: validators_1.NG_VALIDATORS,
    useExisting: core_1.forwardRef(function () { return MinLengthValidator; }),
    multi: true
};
/**
 * A directive which installs the `MinLengthValidator` for any `formControlName`,
 * `formControl`, or control with `ngModel` that also has a `minlength` attribute.
 *
 * @ngModule FormsModule
 * @ngModule ReactiveFormsModule
 */
var MinLengthValidator = /** @class */ (function () {
    function MinLengthValidator() {
    }
    MinLengthValidator.prototype.ngOnChanges = function (changes) {
        if ('minlength' in changes) {
            this._createValidator();
            if (this._onChange)
                this._onChange();
        }
    };
    MinLengthValidator.prototype.validate = function (control) {
        return this.minlength == null ? null : this._validator(control);
    };
    MinLengthValidator.prototype.registerOnValidatorChange = function (fn) { this._onChange = fn; };
    MinLengthValidator.prototype._createValidator = function () {
        this._validator = validators_1.Validators.minLength(parseInt(this.minlength, 10));
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], MinLengthValidator.prototype, "minlength", void 0);
    MinLengthValidator = __decorate([
        core_1.Directive({
            selector: '[minlength][formControlName],[minlength][formControl],[minlength][ngModel]',
            providers: [exports.MIN_LENGTH_VALIDATOR],
            host: { '[attr.minlength]': 'minlength ? minlength : null' }
        })
    ], MinLengthValidator);
    return MinLengthValidator;
}());
exports.MinLengthValidator = MinLengthValidator;
/**
 * Provider which adds `MaxLengthValidator` to `NG_VALIDATORS`.
 *
 * @usageNotes
 * ### Example:
 *
 * {@example common/forms/ts/validators/validators.ts region='max'}
 */
exports.MAX_LENGTH_VALIDATOR = {
    provide: validators_1.NG_VALIDATORS,
    useExisting: core_1.forwardRef(function () { return MaxLengthValidator; }),
    multi: true
};
/**
 * A directive which installs the `MaxLengthValidator` for any `formControlName`,
 * `formControl`, or control with `ngModel` that also has a `maxlength` attribute.
 *
 * @ngModule FormsModule
 * @ngModule ReactiveFormsModule
 */
var MaxLengthValidator = /** @class */ (function () {
    function MaxLengthValidator() {
    }
    MaxLengthValidator.prototype.ngOnChanges = function (changes) {
        if ('maxlength' in changes) {
            this._createValidator();
            if (this._onChange)
                this._onChange();
        }
    };
    MaxLengthValidator.prototype.validate = function (control) {
        return this.maxlength != null ? this._validator(control) : null;
    };
    MaxLengthValidator.prototype.registerOnValidatorChange = function (fn) { this._onChange = fn; };
    MaxLengthValidator.prototype._createValidator = function () {
        this._validator = validators_1.Validators.maxLength(parseInt(this.maxlength, 10));
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], MaxLengthValidator.prototype, "maxlength", void 0);
    MaxLengthValidator = __decorate([
        core_1.Directive({
            selector: '[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]',
            providers: [exports.MAX_LENGTH_VALIDATOR],
            host: { '[attr.maxlength]': 'maxlength ? maxlength : null' }
        })
    ], MaxLengthValidator);
    return MaxLengthValidator;
}());
exports.MaxLengthValidator = MaxLengthValidator;
exports.PATTERN_VALIDATOR = {
    provide: validators_1.NG_VALIDATORS,
    useExisting: core_1.forwardRef(function () { return PatternValidator; }),
    multi: true
};
/**
 * A Directive that adds the `pattern` validator to any controls marked with the
 * `pattern` attribute, via the `NG_VALIDATORS` binding. Uses attribute value
 * as the regex to validate Control value against.  Follows pattern attribute
 * semantics; i.e. regex must match entire Control value.
 *
 * @usageNotes
 * ### Example
 *
 * ```
 * <input [name]="fullName" pattern="[a-zA-Z ]*" ngModel>
 * ```
 *
 * @ngModule FormsModule
 * @ngModule ReactiveFormsModule
 */
var PatternValidator = /** @class */ (function () {
    function PatternValidator() {
    }
    PatternValidator.prototype.ngOnChanges = function (changes) {
        if ('pattern' in changes) {
            this._createValidator();
            if (this._onChange)
                this._onChange();
        }
    };
    PatternValidator.prototype.validate = function (control) { return this._validator(control); };
    PatternValidator.prototype.registerOnValidatorChange = function (fn) { this._onChange = fn; };
    PatternValidator.prototype._createValidator = function () { this._validator = validators_1.Validators.pattern(this.pattern); };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], PatternValidator.prototype, "pattern", void 0);
    PatternValidator = __decorate([
        core_1.Directive({
            selector: '[pattern][formControlName],[pattern][formControl],[pattern][ngModel]',
            providers: [exports.PATTERN_VALIDATOR],
            host: { '[attr.pattern]': 'pattern ? pattern : null' }
        })
    ], PatternValidator);
    return PatternValidator;
}());
exports.PatternValidator = PatternValidator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL3ZhbGlkYXRvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsc0NBQXFHO0FBSXJHLDRDQUF3RDtBQW1HM0MsUUFBQSxrQkFBa0IsR0FBbUI7SUFDaEQsT0FBTyxFQUFFLDBCQUFhO0lBQ3RCLFdBQVcsRUFBRSxpQkFBVSxDQUFDLGNBQU0sT0FBQSxpQkFBaUIsRUFBakIsQ0FBaUIsQ0FBQztJQUNoRCxLQUFLLEVBQUUsSUFBSTtDQUNaLENBQUM7QUFFVyxRQUFBLDJCQUEyQixHQUFtQjtJQUN6RCxPQUFPLEVBQUUsMEJBQWE7SUFDdEIsV0FBVyxFQUFFLGlCQUFVLENBQUMsY0FBTSxPQUFBLHlCQUF5QixFQUF6QixDQUF5QixDQUFDO0lBQ3hELEtBQUssRUFBRSxJQUFJO0NBQ1osQ0FBQztBQUdGOzs7Ozs7Ozs7Ozs7O0dBYUc7QUFPSDtJQUFBO0lBbUJBLENBQUM7SUFaQyxzQkFBSSx1Q0FBUTthQUFaLGNBQWlDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7YUFFekQsVUFBYSxLQUFxQjtZQUNoQyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxLQUFLLEtBQUssSUFBSSxLQUFHLEtBQU8sS0FBSyxPQUFPLENBQUM7WUFDNUUsSUFBSSxJQUFJLENBQUMsU0FBUztnQkFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDdkMsQ0FBQzs7O09BTHdEO0lBT3pELG9DQUFRLEdBQVIsVUFBUyxPQUF3QjtRQUMvQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLHVCQUFVLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENB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