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
import { AbstractControlDirective } from './abstract_control_directive';
/**
 * @return {?}
 */
function unimplemented() {
    throw new Error('unimplemented');
}
/**
 * \@description
 * A base class that all control `FormControl`-based directives extend. It binds a `FormControl`
 * object to a DOM element.
 * @abstract
 */
export class NgControl extends AbstractControlDirective {
    constructor() {
        super(...arguments);
        /**
         * \@description
         * The parent form for the control.
         *
         * \@internal
         */
        this._parent = null;
        /**
         * \@description
         * The name for the control
         */
        this.name = null;
        /**
         * \@description
         * The value accessor for the control
         */
        this.valueAccessor = null;
        /**
         * \@description
         * The uncomposed array of synchronous validators for the control
         *
         * \@internal
         */
        this._rawValidators = [];
        /**
         * \@description
         * The uncomposed array of async validators for the control
         *
         * \@internal
         */
        this._rawAsyncValidators = [];
    }
    /**
     * \@description
     * The registered synchronous validator function for the control
     *
     * @throws An exception that this method is not implemented
     * @return {?}
     */
    get validator() { return /** @type {?} */ (unimplemented()); }
    /**
     * \@description
     * The registered async validator function for the control
     *
     * @throws An exception that this method is not implemented
     * @return {?}
     */
    get asyncValidator() { return /** @type {?} */ (unimplemented()); }
}
if (false) {
    /**
     * \@description
     * The parent form for the control.
     *
     * \@internal
     * @type {?}
     */
    NgControl.prototype._parent;
    /**
     * \@description
     * The name for the control
     * @type {?}
     */
    NgControl.prototype.name;
    /**
     * \@description
     * The value accessor for the control
     * @type {?}
     */
    NgControl.prototype.valueAccessor;
    /**
     * \@description
     * The uncomposed array of synchronous validators for the control
     *
     * \@internal
     * @type {?}
     */
    NgControl.prototype._rawValidators;
    /**
     * \@description
     * The uncomposed array of async validators for the control
     *
     * \@internal
     * @type {?}
     */
    NgControl.prototype._rawAsyncValidators;
    /**
     * \@description
     * The callback method to update the model from the view when requested
     *
     * @abstract
     * @param {?} newValue The new value for the view
     * @return {?}
     */
    NgControl.prototype.viewToModelUpdate = function (newValue) { };
}
//# sourceMappingURL=ng_control.js.map