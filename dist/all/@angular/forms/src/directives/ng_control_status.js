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
var control_container_1 = require("./control_container");
var ng_control_1 = require("./ng_control");
var AbstractControlStatus = /** @class */ (function () {
    function AbstractControlStatus(cd) {
        this._cd = cd;
    }
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassUntouched", {
        get: function () { return this._cd.control ? this._cd.control.untouched : false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassTouched", {
        get: function () { return this._cd.control ? this._cd.control.touched : false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassPristine", {
        get: function () { return this._cd.control ? this._cd.control.pristine : false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassDirty", {
        get: function () { return this._cd.control ? this._cd.control.dirty : false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassValid", {
        get: function () { return this._cd.control ? this._cd.control.valid : false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassInvalid", {
        get: function () { return this._cd.control ? this._cd.control.invalid : false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassPending", {
        get: function () { return this._cd.control ? this._cd.control.pending : false; },
        enumerable: true,
        configurable: true
    });
    return AbstractControlStatus;
}());
exports.AbstractControlStatus = AbstractControlStatus;
exports.ngControlStatusHost = {
    '[class.ng-untouched]': 'ngClassUntouched',
    '[class.ng-touched]': 'ngClassTouched',
    '[class.ng-pristine]': 'ngClassPristine',
    '[class.ng-dirty]': 'ngClassDirty',
    '[class.ng-valid]': 'ngClassValid',
    '[class.ng-invalid]': 'ngClassInvalid',
    '[class.ng-pending]': 'ngClassPending',
};
/**
 * Directive automatically applied to Angular form controls that sets CSS classes
 * based on control status. The following classes are applied as the properties
 * become true:
 *
 * * ng-valid
 * * ng-invalid
 * * ng-pending
 * * ng-pristine
 * * ng-dirty
 * * ng-untouched
 * * ng-touched
 *
 * @ngModule FormsModule
 * @ngModule ReactiveFormsModule
 */
var NgControlStatus = /** @class */ (function (_super) {
    __extends(NgControlStatus, _super);
    function NgControlStatus(cd) {
        return _super.call(this, cd) || this;
    }
    NgControlStatus = __decorate([
        core_1.Directive({ selector: '[formControlName],[ngModel],[formControl]', host: exports.ngControlStatusHost }),
        __param(0, core_1.Self()),
        __metadata("design:paramtypes", [ng_control_1.NgControl])
    ], NgControlStatus);
    return NgControlStatus;
}(AbstractControlStatus));
exports.NgControlStatus = NgControlStatus;
/**
 * Directive automatically applied to Angular form groups that sets CSS classes
 * based on control status (valid/invalid/dirty/etc).
 *
 * @ngModule FormsModule
 * @ngModule ReactiveFormsModule
 */
var NgControlStatusGroup = /** @class */ (function (_super) {
    __extends(NgControlStatusGroup, _super);
    function NgControlStatusGroup(cd) {
        return _super.call(this, cd) || this;
    }
    NgControlStatusGroup = __decorate([
        core_1.Directive({
            selector: '[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]',
            host: exports.ngControlStatusHost
        }),
        __param(0, core_1.Self()),
        __metadata("design:paramtypes", [control_container_1.ControlContainer])
    ], NgControlStatusGroup);
    return NgControlStatusGroup;
}(AbstractControlStatus));
exports.NgControlStatusGroup = NgControlStatusGroup;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfY29udHJvbF9zdGF0dXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9uZ19jb250cm9sX3N0YXR1cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBOEM7QUFHOUMseURBQXFEO0FBQ3JELDJDQUF1QztBQUV2QztJQUdFLCtCQUFZLEVBQTRCO1FBQUksSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFBQyxDQUFDO0lBRTVELHNCQUFJLG1EQUFnQjthQUFwQixjQUFrQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQ2pHLHNCQUFJLGlEQUFjO2FBQWxCLGNBQWdDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDN0Ysc0JBQUksa0RBQWU7YUFBbkIsY0FBaUMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUMvRixzQkFBSSwrQ0FBWTthQUFoQixjQUE4QixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQ3pGLHNCQUFJLCtDQUFZO2FBQWhCLGNBQThCLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDekYsc0JBQUksaURBQWM7YUFBbEIsY0FBZ0MsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUM3RixzQkFBSSxpREFBYzthQUFsQixjQUFnQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQy9GLDRCQUFDO0FBQUQsQ0FBQyxBQVpELElBWUM7QUFaWSxzREFBcUI7QUFjckIsUUFBQSxtQkFBbUIsR0FBRztJQUNqQyxzQkFBc0IsRUFBRSxrQkFBa0I7SUFDMUMsb0JBQW9CLEVBQUUsZ0JBQWdCO0lBQ3RDLHFCQUFxQixFQUFFLGlCQUFpQjtJQUN4QyxrQkFBa0IsRUFBRSxjQUFjO0lBQ2xDLGtCQUFrQixFQUFFLGNBQWM7SUFDbEMsb0JBQW9CLEVBQUUsZ0JBQWdCO0lBQ3RDLG9CQUFvQixFQUFFLGdCQUFnQjtDQUN2QyxDQUFDO0FBRUY7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUg7SUFBcUMsbUNBQXFCO0lBQ3hELHlCQUFvQixFQUFhO2VBQUksa0JBQU0sRUFBRSxDQUFDO0lBQUUsQ0FBQztJQUR0QyxlQUFlO1FBRDNCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsMkNBQTJDLEVBQUUsSUFBSSxFQUFFLDJCQUFtQixFQUFDLENBQUM7UUFFL0UsV0FBQSxXQUFJLEVBQUUsQ0FBQTt5Q0FBSyxzQkFBUztPQUR0QixlQUFlLENBRTNCO0lBQUQsc0JBQUM7Q0FBQSxBQUZELENBQXFDLHFCQUFxQixHQUV6RDtBQUZZLDBDQUFlO0FBSTVCOzs7Ozs7R0FNRztBQU1IO0lBQTBDLHdDQUFxQjtJQUM3RCw4QkFBb0IsRUFBb0I7ZUFBSSxrQkFBTSxFQUFFLENBQUM7SUFBRSxDQUFDO0lBRDdDLG9CQUFvQjtRQUxoQyxnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUNKLDBGQUEwRjtZQUM5RixJQUFJLEVBQUUsMkJBQW1CO1NBQzFCLENBQUM7UUFFYSxXQUFBLFdBQUksRUFBRSxDQUFBO3lDQUFLLG9DQUFnQjtPQUQ3QixvQkFBb0IsQ0FFaEM7SUFBRCwyQkFBQztDQUFBLEFBRkQsQ0FBMEMscUJBQXFCLEdBRTlEO0FBRlksb0RBQW9CIn0=