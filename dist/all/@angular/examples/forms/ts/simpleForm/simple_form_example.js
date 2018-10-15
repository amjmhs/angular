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
/* tslint:disable:no-console  */
// #docregion Component
var core_1 = require("@angular/core");
var SimpleFormComp = /** @class */ (function () {
    function SimpleFormComp() {
    }
    SimpleFormComp.prototype.onSubmit = function (f) {
        console.log(f.value); // { first: '', last: '' }
        console.log(f.valid); // false
    };
    SimpleFormComp = __decorate([
        core_1.Component({
            selector: 'example-app',
            template: "\n    <form #f=\"ngForm\" (ngSubmit)=\"onSubmit(f)\" novalidate>\n      <input name=\"first\" ngModel required #first=\"ngModel\">\n      <input name=\"last\" ngModel>\n      <button>Submit</button>\n    </form>\n    \n    <p>First name value: {{ first.value }}</p>\n    <p>First name valid: {{ first.valid }}</p>\n    <p>Form value: {{ f.value | json }}</p>\n    <p>Form valid: {{ f.valid }}</p>\n  ",
        })
    ], SimpleFormComp);
    return SimpleFormComp;
}());
exports.SimpleFormComp = SimpleFormComp;
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltcGxlX2Zvcm1fZXhhbXBsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2V4YW1wbGVzL2Zvcm1zL3RzL3NpbXBsZUZvcm0vc2ltcGxlX2Zvcm1fZXhhbXBsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILGdDQUFnQztBQUNoQyx1QkFBdUI7QUFDdkIsc0NBQXdDO0FBa0J4QztJQUFBO0lBS0EsQ0FBQztJQUpDLGlDQUFRLEdBQVIsVUFBUyxDQUFTO1FBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUUsMEJBQTBCO1FBQ2pELE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUUsUUFBUTtJQUNqQyxDQUFDO0lBSlUsY0FBYztRQWYxQixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLGFBQWE7WUFDdkIsUUFBUSxFQUFFLGtaQVdUO1NBQ0YsQ0FBQztPQUNXLGNBQWMsQ0FLMUI7SUFBRCxxQkFBQztDQUFBLEFBTEQsSUFLQztBQUxZLHdDQUFjO0FBTTNCLGdCQUFnQiJ9