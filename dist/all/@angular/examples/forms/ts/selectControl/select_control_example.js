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
var SelectControlComp = /** @class */ (function () {
    function SelectControlComp() {
        this.states = [
            { name: 'Arizona', abbrev: 'AZ' },
            { name: 'California', abbrev: 'CA' },
            { name: 'Colorado', abbrev: 'CO' },
            { name: 'New York', abbrev: 'NY' },
            { name: 'Pennsylvania', abbrev: 'PA' },
        ];
    }
    SelectControlComp = __decorate([
        core_1.Component({
            selector: 'example-app',
            template: "\n    <form #f=\"ngForm\">\n      <select name=\"state\" ngModel>\n        <option value=\"\" disabled>Choose a state</option>\n        <option *ngFor=\"let state of states\" [ngValue]=\"state\">\n          {{ state.abbrev }}\n        </option>\n      </select>\n    </form>\n    \n     <p>Form value: {{ f.value | json }}</p>\n     <!-- example value: {state: {name: 'New York', abbrev: 'NY'} } -->\n  ",
        })
    ], SelectControlComp);
    return SelectControlComp;
}());
exports.SelectControlComp = SelectControlComp;
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0X2NvbnRyb2xfZXhhbXBsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2V4YW1wbGVzL2Zvcm1zL3RzL3NlbGVjdENvbnRyb2wvc2VsZWN0X2NvbnRyb2xfZXhhbXBsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILHVCQUF1QjtBQUN2QixzQ0FBd0M7QUFrQnhDO0lBaEJBO1FBaUJFLFdBQU0sR0FBRztZQUNQLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFDO1lBQy9CLEVBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFDO1lBQ2xDLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFDO1lBQ2hDLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFDO1lBQ2hDLEVBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFDO1NBQ3JDLENBQUM7SUFDSixDQUFDO0lBUlksaUJBQWlCO1FBaEI3QixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLGFBQWE7WUFDdkIsUUFBUSxFQUFFLHFaQVlUO1NBQ0YsQ0FBQztPQUNXLGlCQUFpQixDQVE3QjtJQUFELHdCQUFDO0NBQUEsQUFSRCxJQVFDO0FBUlksOENBQWlCO0FBUzlCLGdCQUFnQiJ9