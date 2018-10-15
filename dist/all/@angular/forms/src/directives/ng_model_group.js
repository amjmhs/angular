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
var validators_1 = require("../validators");
var abstract_form_group_directive_1 = require("./abstract_form_group_directive");
var control_container_1 = require("./control_container");
var ng_form_1 = require("./ng_form");
var template_driven_errors_1 = require("./template_driven_errors");
exports.modelGroupProvider = {
    provide: control_container_1.ControlContainer,
    useExisting: core_1.forwardRef(function () { return NgModelGroup; })
};
/**
 * @description
 *
 * Creates and binds a `FormGroup` instance to a DOM element.
 *
 * This directive can only be used as a child of `NgForm` (or in other words,
 * within `<form>` tags).
 *
 * Use this directive if you'd like to create a sub-group within a form. This can
 * come in handy if you want to validate a sub-group of your form separately from
 * the rest of your form, or if some values in your domain model make more sense to
 * consume together in a nested object.
 *
 * Pass in the name you'd like this sub-group to have and it will become the key
 * for the sub-group in the form's full value. You can also export the directive into
 * a local template variable using `ngModelGroup` (ex: `#myGroup="ngModelGroup"`).
 *
 * {@example forms/ts/ngModelGroup/ng_model_group_example.ts region='Component'}
 *
 * @ngModule FormsModule
 */
var NgModelGroup = /** @class */ (function (_super) {
    __extends(NgModelGroup, _super);
    function NgModelGroup(parent, validators, asyncValidators) {
        var _this = _super.call(this) || this;
        _this._parent = parent;
        _this._validators = validators;
        _this._asyncValidators = asyncValidators;
        return _this;
    }
    NgModelGroup_1 = NgModelGroup;
    /** @internal */
    NgModelGroup.prototype._checkParentType = function () {
        if (!(this._parent instanceof NgModelGroup_1) && !(this._parent instanceof ng_form_1.NgForm)) {
            template_driven_errors_1.TemplateDrivenErrors.modelGroupParentException();
        }
    };
    var NgModelGroup_1;
    __decorate([
        core_1.Input('ngModelGroup'),
        __metadata("design:type", String)
    ], NgModelGroup.prototype, "name", void 0);
    NgModelGroup = NgModelGroup_1 = __decorate([
        core_1.Directive({ selector: '[ngModelGroup]', providers: [exports.modelGroupProvider], exportAs: 'ngModelGroup' }),
        __param(0, core_1.Host()), __param(0, core_1.SkipSelf()),
        __param(1, core_1.Optional()), __param(1, core_1.Self()), __param(1, core_1.Inject(validators_1.NG_VALIDATORS)),
        __param(2, core_1.Optional()), __param(2, core_1.Self()), __param(2, core_1.Inject(validators_1.NG_ASYNC_VALIDATORS)),
        __metadata("design:paramtypes", [control_container_1.ControlContainer, Array, Array])
    ], NgModelGroup);
    return NgModelGroup;
}(abstract_form_group_directive_1.AbstractFormGroupDirective));
exports.NgModelGroup = NgModelGroup;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfbW9kZWxfZ3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9uZ19tb2RlbF9ncm91cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBc0g7QUFFdEgsNENBQWlFO0FBRWpFLGlGQUEyRTtBQUMzRSx5REFBcUQ7QUFDckQscUNBQWlDO0FBQ2pDLG1FQUE4RDtBQUVqRCxRQUFBLGtCQUFrQixHQUFRO0lBQ3JDLE9BQU8sRUFBRSxvQ0FBZ0I7SUFDekIsV0FBVyxFQUFFLGlCQUFVLENBQUMsY0FBTSxPQUFBLFlBQVksRUFBWixDQUFZLENBQUM7Q0FDNUMsQ0FBQztBQUVGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW9CRztBQUVIO0lBQWtDLGdDQUEwQjtJQUkxRCxzQkFDd0IsTUFBd0IsRUFDRCxVQUFpQixFQUNYLGVBQXNCO1FBSDNFLFlBSUUsaUJBQU8sU0FJUjtRQUhDLEtBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLEtBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQzlCLEtBQUksQ0FBQyxnQkFBZ0IsR0FBRyxlQUFlLENBQUM7O0lBQzFDLENBQUM7cUJBWlUsWUFBWTtJQWN2QixnQkFBZ0I7SUFDaEIsdUNBQWdCLEdBQWhCO1FBQ0UsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sWUFBWSxjQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sWUFBWSxnQkFBTSxDQUFDLEVBQUU7WUFDaEYsNkNBQW9CLENBQUMseUJBQXlCLEVBQUUsQ0FBQztTQUNsRDtJQUNILENBQUM7O0lBakJzQjtRQUF0QixZQUFLLENBQUMsY0FBYyxDQUFDOzs4Q0FBZ0I7SUFGM0IsWUFBWTtRQUR4QixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLGdCQUFnQixFQUFFLFNBQVMsRUFBRSxDQUFDLDBCQUFrQixDQUFDLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBQyxDQUFDO1FBTTVGLFdBQUEsV0FBSSxFQUFFLENBQUEsRUFBRSxXQUFBLGVBQVEsRUFBRSxDQUFBO1FBQ2xCLFdBQUEsZUFBUSxFQUFFLENBQUEsRUFBRSxXQUFBLFdBQUksRUFBRSxDQUFBLEVBQUUsV0FBQSxhQUFNLENBQUMsMEJBQWEsQ0FBQyxDQUFBO1FBQ3pDLFdBQUEsZUFBUSxFQUFFLENBQUEsRUFBRSxXQUFBLFdBQUksRUFBRSxDQUFBLEVBQUUsV0FBQSxhQUFNLENBQUMsZ0NBQW1CLENBQUMsQ0FBQTt5Q0FGcEIsb0NBQWdCO09BTHJDLFlBQVksQ0FvQnhCO0lBQUQsbUJBQUM7Q0FBQSxBQXBCRCxDQUFrQywwREFBMEIsR0FvQjNEO0FBcEJZLG9DQUFZIn0=