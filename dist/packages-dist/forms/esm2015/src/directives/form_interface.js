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
/**
 * \@description
 * An interface implemented by `FormGroupDirective` and `NgForm` directives.
 *
 * Only used by the `ReactiveFormsModule` and `FormsModule`.
 * @record
 */
export function Form() { }
/**
 * \@description
 * Add a control to this form.
 *
 * \@param dir The control directive to add to the form.
 * @type {?}
 */
Form.prototype.addControl;
/**
 * \@description
 * Remove a control from this form.
 *
 * \@param dir: The control directive to remove from the form.
 * @type {?}
 */
Form.prototype.removeControl;
/**
 * \@description
 * The control directive from which to get the `FormControl`.
 *
 * \@param dir: The control directive.
 * @type {?}
 */
Form.prototype.getControl;
/**
 * \@description
 * Add a group of controls to this form.
 *
 * \@param dir: The control group directive to add.
 * @type {?}
 */
Form.prototype.addFormGroup;
/**
 * \@description
 * Remove a group of controls to this form.
 *
 * \@param dir: The control group directive to remove.
 * @type {?}
 */
Form.prototype.removeFormGroup;
/**
 * \@description
 * The `FormGroup` associated with a particular `AbstractFormGroupDirective`.
 *
 * \@param dir: The form group directive from which to get the `FormGroup`.
 * @type {?}
 */
Form.prototype.getFormGroup;
/**
 * \@description
 * Update the model for a particular control with a new value.
 *
 * \@param dir: The control directive to update.
 * \@param value: The new value for the control.
 * @type {?}
 */
Form.prototype.updateModel;
//# sourceMappingURL=form_interface.js.map