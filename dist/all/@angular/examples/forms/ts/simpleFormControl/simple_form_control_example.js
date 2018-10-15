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
// #docregion Component
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var SimpleFormControl = /** @class */ (function () {
    function SimpleFormControl() {
        this.control = new forms_1.FormControl('value', forms_1.Validators.minLength(2));
    }
    SimpleFormControl.prototype.setValue = function () { this.control.setValue('new value'); };
    SimpleFormControl = __decorate([
        core_1.Component({
            selector: 'example-app',
            template: "\n     <input [formControl]=\"control\">\n      \n     <p>Value: {{ control.value }}</p>\n     <p>Validation status: {{ control.status }}</p>\n     \n     <button (click)=\"setValue()\">Set value</button>\n  ",
        })
    ], SimpleFormControl);
    return SimpleFormControl;
}());
exports.SimpleFormControl = SimpleFormControl;
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltcGxlX2Zvcm1fY29udHJvbF9leGFtcGxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZXhhbXBsZXMvZm9ybXMvdHMvc2ltcGxlRm9ybUNvbnRyb2wvc2ltcGxlX2Zvcm1fY29udHJvbF9leGFtcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsdUJBQXVCO0FBQ3ZCLHNDQUF3QztBQUN4Qyx3Q0FBdUQ7QUFhdkQ7SUFYQTtRQVlFLFlBQU8sR0FBZ0IsSUFBSSxtQkFBVyxDQUFDLE9BQU8sRUFBRSxrQkFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRzNFLENBQUM7SUFEQyxvQ0FBUSxHQUFSLGNBQWEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBSHZDLGlCQUFpQjtRQVg3QixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLGFBQWE7WUFDdkIsUUFBUSxFQUFFLGtOQU9UO1NBQ0YsQ0FBQztPQUNXLGlCQUFpQixDQUk3QjtJQUFELHdCQUFDO0NBQUEsQUFKRCxJQUlDO0FBSlksOENBQWlCO0FBSzlCLGdCQUFnQiJ9