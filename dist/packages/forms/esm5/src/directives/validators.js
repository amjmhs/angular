/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { Directive, Input, forwardRef } from '@angular/core';
import { NG_VALIDATORS, Validators } from '../validators';
/** @typedef {?} */
var ValidationErrors;
export { ValidationErrors };
/**
 * \@description
 * An interface implemented by classes that perform synchronous validation.
 *
 * \@usageNotes
 *
 * ### Provide a custom validator
 *
 * The following example implements the `Validator` interface to create a
 * validator directive with a custom error key.
 *
 * ```typescript
 * \@Directive({
 *   selector: '[customValidator]',
 *   providers: [{provide: NG_VALIDATORS, useExisting: CustomValidatorDirective, multi: true}]
 * })
 * class CustomValidatorDirective implements Validator {
 *   validate(control: AbstractControl): ValidationErrors|null {
 *     return {'custom': true};
 *   }
 * }
 * ```
 * @record
 */
export function Validator() { }
/**
 * \@description
 * Method that performs synchronous validation against the provided control.
 *
 * \@param c The control to validate against.
 *
 * \@return A map of validation errors if validation fails,
 * otherwise null.
 * @type {?}
 */
Validator.prototype.validate;
/**
 * \@description
 * Registers a callback function to call when the validator inputs change.
 *
 * \@param fn The callback function
 * @type {?|undefined}
 */
Validator.prototype.registerOnValidatorChange;
/**
 * \@description
 * An interface implemented by classes that perform asynchronous validation.
 *
 * \@usageNotes
 *
 * ### Provide a custom async validator directive
 *
 * The following example implements the `AsyncValidator` interface to create an
 * async validator directive with a custom error key.
 *
 * ```typescript
 * import { of as observableOf } from 'rxjs';
 *
 * \@Directive({
 *   selector: '[customAsyncValidator]',
 *   providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: CustomAsyncValidatorDirective, multi:
 * true}]
 * })
 * class CustomAsyncValidatorDirective implements AsyncValidator {
 *   validate(control: AbstractControl): Observable<ValidationErrors|null> {
 *     return observableOf({'custom': true});
 *   }
 * }
 * ```
 *
 * \@experimental
 * @record
 */
export function AsyncValidator() { }
/**
 * \@description
 * Method that performs async validation against the provided control.
 *
 * \@param c The control to validate against.
 *
 * \@return A promise or observable that resolves a map of validation errors
 * if validation fails, otherwise null.
 * @type {?}
 */
AsyncValidator.prototype.validate;
/** @type {?} */
export var REQUIRED_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(function () { return RequiredValidator; }),
    multi: true
};
/** @type {?} */
export var CHECKBOX_REQUIRED_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(function () { return CheckboxRequiredValidator; }),
    multi: true
};
/**
 * A Directive that adds the `required` validator to any controls marked with the
 * `required` attribute, via the `NG_VALIDATORS` binding.
 *
 * \@usageNotes
 * ### Example
 *
 * ```
 * <input name="fullName" ngModel required>
 * ```
 *
 * \@ngModule FormsModule
 * \@ngModule ReactiveFormsModule
 */
var RequiredValidator = /** @class */ (function () {
    function RequiredValidator() {
    }
    Object.defineProperty(RequiredValidator.prototype, "required", {
        get: /**
         * @return {?}
         */
        function () { return this._required; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._required = value != null && value !== false && "" + value !== 'false';
            if (this._onChange)
                this._onChange();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} control
     * @return {?}
     */
    RequiredValidator.prototype.validate = /**
     * @param {?} control
     * @return {?}
     */
    function (control) {
        return this.required ? Validators.required(control) : null;
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    RequiredValidator.prototype.registerOnValidatorChange = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) { this._onChange = fn; };
    RequiredValidator.decorators = [
        { type: Directive, args: [{
                    selector: ':not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]',
                    providers: [REQUIRED_VALIDATOR],
                    host: { '[attr.required]': 'required ? "" : null' }
                },] },
    ];
    RequiredValidator.propDecorators = {
        required: [{ type: Input }]
    };
    return RequiredValidator;
}());
export { RequiredValidator };
if (false) {
    /** @type {?} */
    RequiredValidator.prototype._required;
    /** @type {?} */
    RequiredValidator.prototype._onChange;
}
/**
 * A Directive that adds the `required` validator to checkbox controls marked with the
 * `required` attribute, via the `NG_VALIDATORS` binding.
 *
 * \@usageNotes
 * ### Example
 *
 * ```
 * <input type="checkbox" name="active" ngModel required>
 * ```
 *
 * \@experimental
 * \@ngModule FormsModule
 * \@ngModule ReactiveFormsModule
 */
var CheckboxRequiredValidator = /** @class */ (function (_super) {
    tslib_1.__extends(CheckboxRequiredValidator, _super);
    function CheckboxRequiredValidator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {?} control
     * @return {?}
     */
    CheckboxRequiredValidator.prototype.validate = /**
     * @param {?} control
     * @return {?}
     */
    function (control) {
        return this.required ? Validators.requiredTrue(control) : null;
    };
    CheckboxRequiredValidator.decorators = [
        { type: Directive, args: [{
                    selector: 'input[type=checkbox][required][formControlName],input[type=checkbox][required][formControl],input[type=checkbox][required][ngModel]',
                    providers: [CHECKBOX_REQUIRED_VALIDATOR],
                    host: { '[attr.required]': 'required ? "" : null' }
                },] },
    ];
    return CheckboxRequiredValidator;
}(RequiredValidator));
export { CheckboxRequiredValidator };
/** *
 * Provider which adds `EmailValidator` to `NG_VALIDATORS`.
  @type {?} */
export var EMAIL_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(function () { return EmailValidator; }),
    multi: true
};
/**
 * A Directive that adds the `email` validator to controls marked with the
 * `email` attribute, via the `NG_VALIDATORS` binding.
 *
 * \@usageNotes
 * ### Example
 *
 * ```
 * <input type="email" name="email" ngModel email>
 * <input type="email" name="email" ngModel email="true">
 * <input type="email" name="email" ngModel [email]="true">
 * ```
 *
 * \@experimental
 * \@ngModule FormsModule
 * \@ngModule ReactiveFormsModule
 */
var EmailValidator = /** @class */ (function () {
    function EmailValidator() {
    }
    Object.defineProperty(EmailValidator.prototype, "email", {
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._enabled = value === '' || value === true || value === 'true';
            if (this._onChange)
                this._onChange();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} control
     * @return {?}
     */
    EmailValidator.prototype.validate = /**
     * @param {?} control
     * @return {?}
     */
    function (control) {
        return this._enabled ? Validators.email(control) : null;
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    EmailValidator.prototype.registerOnValidatorChange = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) { this._onChange = fn; };
    EmailValidator.decorators = [
        { type: Directive, args: [{
                    selector: '[email][formControlName],[email][formControl],[email][ngModel]',
                    providers: [EMAIL_VALIDATOR]
                },] },
    ];
    EmailValidator.propDecorators = {
        email: [{ type: Input }]
    };
    return EmailValidator;
}());
export { EmailValidator };
if (false) {
    /** @type {?} */
    EmailValidator.prototype._enabled;
    /** @type {?} */
    EmailValidator.prototype._onChange;
}
/**
 * @record
 */
export function ValidatorFn() { }
/**
 * @record
 */
export function AsyncValidatorFn() { }
/** *
 * Provider which adds `MinLengthValidator` to `NG_VALIDATORS`.
 *
 * \@usageNotes
 * ### Example:
 *
 * {\@example common/forms/ts/validators/validators.ts region='min'}
  @type {?} */
export var MIN_LENGTH_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(function () { return MinLengthValidator; }),
    multi: true
};
/**
 * A directive which installs the `MinLengthValidator` for any `formControlName`,
 * `formControl`, or control with `ngModel` that also has a `minlength` attribute.
 *
 * \@ngModule FormsModule
 * \@ngModule ReactiveFormsModule
 */
var MinLengthValidator = /** @class */ (function () {
    function MinLengthValidator() {
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    MinLengthValidator.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if ('minlength' in changes) {
            this._createValidator();
            if (this._onChange)
                this._onChange();
        }
    };
    /**
     * @param {?} control
     * @return {?}
     */
    MinLengthValidator.prototype.validate = /**
     * @param {?} control
     * @return {?}
     */
    function (control) {
        return this.minlength == null ? null : this._validator(control);
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    MinLengthValidator.prototype.registerOnValidatorChange = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) { this._onChange = fn; };
    /**
     * @return {?}
     */
    MinLengthValidator.prototype._createValidator = /**
     * @return {?}
     */
    function () {
        this._validator = Validators.minLength(parseInt(this.minlength, 10));
    };
    MinLengthValidator.decorators = [
        { type: Directive, args: [{
                    selector: '[minlength][formControlName],[minlength][formControl],[minlength][ngModel]',
                    providers: [MIN_LENGTH_VALIDATOR],
                    host: { '[attr.minlength]': 'minlength ? minlength : null' }
                },] },
    ];
    MinLengthValidator.propDecorators = {
        minlength: [{ type: Input }]
    };
    return MinLengthValidator;
}());
export { MinLengthValidator };
if (false) {
    /** @type {?} */
    MinLengthValidator.prototype._validator;
    /** @type {?} */
    MinLengthValidator.prototype._onChange;
    /** @type {?} */
    MinLengthValidator.prototype.minlength;
}
/** *
 * Provider which adds `MaxLengthValidator` to `NG_VALIDATORS`.
 *
 * \@usageNotes
 * ### Example:
 *
 * {\@example common/forms/ts/validators/validators.ts region='max'}
  @type {?} */
export var MAX_LENGTH_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(function () { return MaxLengthValidator; }),
    multi: true
};
/**
 * A directive which installs the `MaxLengthValidator` for any `formControlName`,
 * `formControl`, or control with `ngModel` that also has a `maxlength` attribute.
 *
 * \@ngModule FormsModule
 * \@ngModule ReactiveFormsModule
 */
var MaxLengthValidator = /** @class */ (function () {
    function MaxLengthValidator() {
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    MaxLengthValidator.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if ('maxlength' in changes) {
            this._createValidator();
            if (this._onChange)
                this._onChange();
        }
    };
    /**
     * @param {?} control
     * @return {?}
     */
    MaxLengthValidator.prototype.validate = /**
     * @param {?} control
     * @return {?}
     */
    function (control) {
        return this.maxlength != null ? this._validator(control) : null;
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    MaxLengthValidator.prototype.registerOnValidatorChange = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) { this._onChange = fn; };
    /**
     * @return {?}
     */
    MaxLengthValidator.prototype._createValidator = /**
     * @return {?}
     */
    function () {
        this._validator = Validators.maxLength(parseInt(this.maxlength, 10));
    };
    MaxLengthValidator.decorators = [
        { type: Directive, args: [{
                    selector: '[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]',
                    providers: [MAX_LENGTH_VALIDATOR],
                    host: { '[attr.maxlength]': 'maxlength ? maxlength : null' }
                },] },
    ];
    MaxLengthValidator.propDecorators = {
        maxlength: [{ type: Input }]
    };
    return MaxLengthValidator;
}());
export { MaxLengthValidator };
if (false) {
    /** @type {?} */
    MaxLengthValidator.prototype._validator;
    /** @type {?} */
    MaxLengthValidator.prototype._onChange;
    /** @type {?} */
    MaxLengthValidator.prototype.maxlength;
}
/** @type {?} */
export var PATTERN_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(function () { return PatternValidator; }),
    multi: true
};
/**
 * A Directive that adds the `pattern` validator to any controls marked with the
 * `pattern` attribute, via the `NG_VALIDATORS` binding. Uses attribute value
 * as the regex to validate Control value against.  Follows pattern attribute
 * semantics; i.e. regex must match entire Control value.
 *
 * \@usageNotes
 * ### Example
 *
 * ```
 * <input [name]="fullName" pattern="[a-zA-Z ]*" ngModel>
 * ```
 *
 * \@ngModule FormsModule
 * \@ngModule ReactiveFormsModule
 */
var PatternValidator = /** @class */ (function () {
    function PatternValidator() {
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    PatternValidator.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if ('pattern' in changes) {
            this._createValidator();
            if (this._onChange)
                this._onChange();
        }
    };
    /**
     * @param {?} control
     * @return {?}
     */
    PatternValidator.prototype.validate = /**
     * @param {?} control
     * @return {?}
     */
    function (control) { return this._validator(control); };
    /**
     * @param {?} fn
     * @return {?}
     */
    PatternValidator.prototype.registerOnValidatorChange = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) { this._onChange = fn; };
    /**
     * @return {?}
     */
    PatternValidator.prototype._createValidator = /**
     * @return {?}
     */
    function () { this._validator = Validators.pattern(this.pattern); };
    PatternValidator.decorators = [
        { type: Directive, args: [{
                    selector: '[pattern][formControlName],[pattern][formControl],[pattern][ngModel]',
                    providers: [PATTERN_VALIDATOR],
                    host: { '[attr.pattern]': 'pattern ? pattern : null' }
                },] },
    ];
    PatternValidator.propDecorators = {
        pattern: [{ type: Input }]
    };
    return PatternValidator;
}());
export { PatternValidator };
if (false) {
    /** @type {?} */
    PatternValidator.prototype._validator;
    /** @type {?} */
    PatternValidator.prototype._onChange;
    /** @type {?} */
    PatternValidator.prototype.pattern;
}
//# sourceMappingURL=validators.js.map