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
// #docregion TemplateDriven
var core_1 = require("@angular/core");
var RadioButtonComp = /** @class */ (function () {
    function RadioButtonComp() {
        this.myFood = 'lamb';
    }
    RadioButtonComp = __decorate([
        core_1.Component({
            selector: 'example-app',
            template: "\n    <form #f=\"ngForm\">\n      <input type=\"radio\" value=\"beef\" name=\"food\" [(ngModel)]=\"myFood\"> Beef\n      <input type=\"radio\" value=\"lamb\" name=\"food\" [(ngModel)]=\"myFood\"> Lamb\n      <input type=\"radio\" value=\"fish\" name=\"food\" [(ngModel)]=\"myFood\"> Fish\n    </form>\n    \n    <p>Form value: {{ f.value | json }}</p>  <!-- {food: 'lamb' } -->\n    <p>myFood value: {{ myFood }}</p>  <!-- 'lamb' -->\n  ",
        })
    ], RadioButtonComp);
    return RadioButtonComp;
}());
exports.RadioButtonComp = RadioButtonComp;
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW9fYnV0dG9uX2V4YW1wbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9leGFtcGxlcy9mb3Jtcy90cy9yYWRpb0J1dHRvbnMvcmFkaW9fYnV0dG9uX2V4YW1wbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7QUFFSCw0QkFBNEI7QUFDNUIsc0NBQXdDO0FBZXhDO0lBYkE7UUFjRSxXQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFGWSxlQUFlO1FBYjNCLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsYUFBYTtZQUN2QixRQUFRLEVBQUUsdWJBU1Q7U0FDRixDQUFDO09BQ1csZUFBZSxDQUUzQjtJQUFELHNCQUFDO0NBQUEsQUFGRCxJQUVDO0FBRlksMENBQWU7QUFHNUIsZ0JBQWdCIn0=