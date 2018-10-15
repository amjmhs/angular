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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
// #docregion Component, disabled-control
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
// #enddocregion disabled-control
var FormBuilderComp = /** @class */ (function () {
    function FormBuilderComp(fb) {
        this.form = fb.group({
            name: fb.group({
                first: ['Nancy', forms_1.Validators.minLength(2)],
                last: 'Drew',
            }),
            email: '',
        });
    }
    FormBuilderComp = __decorate([
        core_1.Component({
            selector: 'example-app',
            template: "\n    <form [formGroup]=\"form\">\n      <div formGroupName=\"name\">\n        <input formControlName=\"first\" placeholder=\"First\">\n        <input formControlName=\"last\" placeholder=\"Last\">\n      </div>\n      <input formControlName=\"email\" placeholder=\"Email\">\n      <button>Submit</button>\n    </form>\n    \n    <p>Value: {{ form.value | json }}</p>\n    <p>Validation status: {{ form.status }}</p>\n  "
        }),
        __param(0, core_1.Inject(forms_1.FormBuilder)),
        __metadata("design:paramtypes", [forms_1.FormBuilder])
    ], FormBuilderComp);
    return FormBuilderComp;
}());
exports.FormBuilderComp = FormBuilderComp;
// #enddocregion
// #docregion disabled-control
var DisabledFormControlComponent = /** @class */ (function () {
    function DisabledFormControlComponent(fb) {
        this.fb = fb;
        this.control = fb.control({ value: 'my val', disabled: true });
    }
    DisabledFormControlComponent = __decorate([
        core_1.Component({
            selector: 'app-disabled-form-control',
            template: "\n    <input [formControl]=\"control\" placeholder=\"First\">\n  "
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder])
    ], DisabledFormControlComponent);
    return DisabledFormControlComponent;
}());
exports.DisabledFormControlComponent = DisabledFormControlComponent;
// #enddocregion disabled-control
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9idWlsZGVyX2V4YW1wbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9leGFtcGxlcy9mb3Jtcy90cy9mb3JtQnVpbGRlci9mb3JtX2J1aWxkZXJfZXhhbXBsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7OztBQUVILHlDQUF5QztBQUN6QyxzQ0FBZ0Q7QUFDaEQsd0NBQStFO0FBQy9FLGlDQUFpQztBQWtCakM7SUFHRSx5QkFBaUMsRUFBZTtRQUM5QyxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUM7WUFDbkIsSUFBSSxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUM7Z0JBQ2IsS0FBSyxFQUFFLENBQUMsT0FBTyxFQUFFLGtCQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6QyxJQUFJLEVBQUUsTUFBTTthQUNiLENBQUM7WUFDRixLQUFLLEVBQUUsRUFBRTtTQUNWLENBQUMsQ0FBQztJQUNMLENBQUM7SUFYVSxlQUFlO1FBaEIzQixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLGFBQWE7WUFDdkIsUUFBUSxFQUFFLHNhQVlUO1NBQ0YsQ0FBQztRQUlhLFdBQUEsYUFBTSxDQUFDLG1CQUFXLENBQUMsQ0FBQTt5Q0FBSyxtQkFBVztPQUhyQyxlQUFlLENBWTNCO0lBQUQsc0JBQUM7Q0FBQSxBQVpELElBWUM7QUFaWSwwQ0FBZTtBQWE1QixnQkFBZ0I7QUFFaEIsOEJBQThCO0FBTzlCO0lBR0Usc0NBQW9CLEVBQWU7UUFBZixPQUFFLEdBQUYsRUFBRSxDQUFhO1FBQ2pDLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUxVLDRCQUE0QjtRQU54QyxnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLDJCQUEyQjtZQUNyQyxRQUFRLEVBQUUsbUVBRVQ7U0FDRixDQUFDO3lDQUl3QixtQkFBVztPQUh4Qiw0QkFBNEIsQ0FNeEM7SUFBRCxtQ0FBQztDQUFBLEFBTkQsSUFNQztBQU5ZLG9FQUE0QjtBQU96QyxpQ0FBaUMifQ==