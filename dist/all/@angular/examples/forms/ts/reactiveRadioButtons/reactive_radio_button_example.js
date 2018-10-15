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
// #docregion Reactive
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var ReactiveRadioButtonComp = /** @class */ (function () {
    function ReactiveRadioButtonComp() {
        this.form = new forms_1.FormGroup({
            food: new forms_1.FormControl('lamb'),
        });
    }
    ReactiveRadioButtonComp = __decorate([
        core_1.Component({
            selector: 'example-app',
            template: "\n    <form [formGroup]=\"form\">\n      <input type=\"radio\" formControlName=\"food\" value=\"beef\" > Beef\n      <input type=\"radio\" formControlName=\"food\" value=\"lamb\"> Lamb\n      <input type=\"radio\" formControlName=\"food\" value=\"fish\"> Fish\n    </form>\n    \n    <p>Form value: {{ form.value | json }}</p>  <!-- {food: 'lamb' } -->\n  ",
        })
    ], ReactiveRadioButtonComp);
    return ReactiveRadioButtonComp;
}());
exports.ReactiveRadioButtonComp = ReactiveRadioButtonComp;
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3RpdmVfcmFkaW9fYnV0dG9uX2V4YW1wbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9leGFtcGxlcy9mb3Jtcy90cy9yZWFjdGl2ZVJhZGlvQnV0dG9ucy9yZWFjdGl2ZV9yYWRpb19idXR0b25fZXhhbXBsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILHNCQUFzQjtBQUN0QixzQ0FBd0M7QUFDeEMsd0NBQXNEO0FBY3REO0lBWkE7UUFhRSxTQUFJLEdBQUcsSUFBSSxpQkFBUyxDQUFDO1lBQ25CLElBQUksRUFBRSxJQUFJLG1CQUFXLENBQUMsTUFBTSxDQUFDO1NBQzlCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFKWSx1QkFBdUI7UUFabkMsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxhQUFhO1lBQ3ZCLFFBQVEsRUFBRSxzV0FRVDtTQUNGLENBQUM7T0FDVyx1QkFBdUIsQ0FJbkM7SUFBRCw4QkFBQztDQUFBLEFBSkQsSUFJQztBQUpZLDBEQUF1QjtBQUtwQyxnQkFBZ0IifQ==