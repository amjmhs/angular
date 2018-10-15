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
Object.defineProperty(exports, "__esModule", { value: true });
var abstract_control_directive_1 = require("./abstract_control_directive");
function unimplemented() {
    throw new Error('unimplemented');
}
/**
 * @description
 * A base class that all control `FormControl`-based directives extend. It binds a `FormControl`
 * object to a DOM element.
 */
var NgControl = /** @class */ (function (_super) {
    __extends(NgControl, _super);
    function NgControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * @description
         * The parent form for the control.
         *
         * @internal
         */
        _this._parent = null;
        /**
         * @description
         * The name for the control
         */
        _this.name = null;
        /**
         * @description
         * The value accessor for the control
         */
        _this.valueAccessor = null;
        /**
         * @description
         * The uncomposed array of synchronous validators for the control
         *
         * @internal
         */
        _this._rawValidators = [];
        /**
         * @description
         * The uncomposed array of async validators for the control
         *
         * @internal
         */
        _this._rawAsyncValidators = [];
        return _this;
    }
    Object.defineProperty(NgControl.prototype, "validator", {
        /**
         * @description
         * The registered synchronous validator function for the control
         *
         * @throws An exception that this method is not implemented
         */
        get: function () { return unimplemented(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgControl.prototype, "asyncValidator", {
        /**
         * @description
         * The registered async validator function for the control
         *
         * @throws An exception that this method is not implemented
         */
        get: function () { return unimplemented(); },
        enumerable: true,
        configurable: true
    });
    return NgControl;
}(abstract_control_directive_1.AbstractControlDirective));
exports.NgControl = NgControl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfY29udHJvbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL25nX2NvbnRyb2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0FBR0gsMkVBQXNFO0FBS3RFO0lBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUNuQyxDQUFDO0FBRUQ7Ozs7R0FJRztBQUNIO0lBQXdDLDZCQUF3QjtJQUFoRTtRQUFBLHFFQTREQztRQTNEQzs7Ozs7V0FLRztRQUNILGFBQU8sR0FBMEIsSUFBSSxDQUFDO1FBRXRDOzs7V0FHRztRQUNILFVBQUksR0FBZ0IsSUFBSSxDQUFDO1FBRXpCOzs7V0FHRztRQUNILG1CQUFhLEdBQThCLElBQUksQ0FBQztRQUVoRDs7Ozs7V0FLRztRQUNILG9CQUFjLEdBQWlDLEVBQUUsQ0FBQztRQUVsRDs7Ozs7V0FLRztRQUNILHlCQUFtQixHQUEyQyxFQUFFLENBQUM7O0lBeUJuRSxDQUFDO0lBakJDLHNCQUFJLGdDQUFTO1FBTmI7Ozs7O1dBS0c7YUFDSCxjQUFvQyxPQUFvQixhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBUTFFLHNCQUFJLHFDQUFjO1FBTmxCOzs7OztXQUtHO2FBQ0gsY0FBOEMsT0FBeUIsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQVMzRixnQkFBQztBQUFELENBQUMsQUE1REQsQ0FBd0MscURBQXdCLEdBNEQvRDtBQTVEcUIsOEJBQVMifQ==