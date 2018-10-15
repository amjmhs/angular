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
/* tslint:disable:no-console  */
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var platform_browser_1 = require("@angular/platform-browser");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
/**
 * A domain model we are binding the form controls to.
 */
var CheckoutModel = /** @class */ (function () {
    function CheckoutModel() {
        this.country = 'Canada';
    }
    return CheckoutModel;
}());
/**
 * Custom validator.
 */
function creditCardValidator(c) {
    if (c.value && /^\d{16}$/.test(c.value)) {
        return null;
    }
    else {
        return { 'invalidCreditCard': true };
    }
}
var creditCardValidatorBinding = {
    provide: forms_1.NG_VALIDATORS,
    useValue: creditCardValidator,
    multi: true
};
var CreditCardValidator = /** @class */ (function () {
    function CreditCardValidator() {
    }
    CreditCardValidator = __decorate([
        core_1.Directive({ selector: '[credit-card]', providers: [creditCardValidatorBinding] })
    ], CreditCardValidator);
    return CreditCardValidator;
}());
/**
 * This is a component that displays an error message.
 *
 * For instance,
 *
 * <show-error control="creditCard" [errors]="['required', 'invalidCreditCard']"></show-error>
 *
 * Will display the "is required" error if the control is empty, and "invalid credit card" if the
 * control is not empty
 * but not valid.
 *
 * In a real application, this component would receive a service that would map an error code to an
 * actual error message.
 * To make it simple, we are using a simple map here.
 */
var ShowError = /** @class */ (function () {
    function ShowError(formDir) {
        this.formDir = formDir;
    }
    Object.defineProperty(ShowError.prototype, "errorMessage", {
        get: function () {
            var form = this.formDir.form;
            var control = form.get(this.controlPath);
            if (control && control.touched) {
                for (var i = 0; i < this.errorTypes.length; ++i) {
                    if (control.hasError(this.errorTypes[i])) {
                        return this._errorMessage(this.errorTypes[i]);
                    }
                }
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    ShowError.prototype._errorMessage = function (code) {
        var config = {
            'required': 'is required',
            'invalidCreditCard': 'is invalid credit card number',
        };
        return config[code];
    };
    ShowError = __decorate([
        core_1.Component({
            selector: 'show-error',
            inputs: ['controlPath: control', 'errorTypes: errors'],
            template: "\n    <span *ngIf=\"errorMessage !== null\">{{errorMessage}}</span>\n  "
        }),
        __param(0, core_1.Host()),
        __metadata("design:paramtypes", [forms_1.NgForm])
    ], ShowError);
    return ShowError;
}());
var TemplateDrivenForms = /** @class */ (function () {
    function TemplateDrivenForms() {
        this.model = new CheckoutModel();
        this.countries = ['US', 'Canada'];
    }
    TemplateDrivenForms.prototype.onSubmit = function () {
        console.log('Submitting:');
        console.log(this.model);
    };
    TemplateDrivenForms = __decorate([
        core_1.Component({
            selector: 'template-driven-forms',
            template: "\n    <h1>Checkout Form</h1>\n\n    <form (ngSubmit)=\"onSubmit()\" #f=\"ngForm\">\n      <p>\n        <label for=\"firstName\">First Name</label>\n        <input type=\"text\" id=\"firstName\" name=\"firstName\" [(ngModel)]=\"model.firstName\" required>\n        <show-error control=\"firstName\" [errors]=\"['required']\"></show-error>\n      </p>\n\n      <p>\n        <label for=\"middleName\">Middle Name</label>\n        <input type=\"text\" id=\"middleName\" name=\"middleName\" [(ngModel)]=\"model.middleName\">\n      </p>\n\n      <p>\n        <label for=\"lastName\">Last Name</label>\n        <input type=\"text\" id=\"lastName\" name=\"lastName\" [(ngModel)]=\"model.lastName\" required>\n        <show-error control=\"lastName\" [errors]=\"['required']\"></show-error>\n      </p>\n\n      <p>\n        <label for=\"country\">Country</label>\n        <select id=\"country\" name=\"country\" [(ngModel)]=\"model.country\">\n          <option *ngFor=\"let c of countries\" [value]=\"c\">{{c}}</option>\n        </select>\n      </p>\n\n      <p>\n        <label for=\"creditCard\">Credit Card</label>\n        <input type=\"text\" id=\"creditCard\" name=\"creditCard\" [(ngModel)]=\"model.creditCard\" required credit-card>\n        <show-error control=\"creditCard\" [errors]=\"['required', 'invalidCreditCard']\"></show-error>\n      </p>\n\n      <p>\n        <label for=\"amount\">Amount</label>\n        <input type=\"number\" id=\"amount\" name=\"amount\" [(ngModel)]=\"model.amount\" required>\n        <show-error control=\"amount\" [errors]=\"['required']\"></show-error>\n      </p>\n\n      <p>\n        <label for=\"email\">Email</label>\n        <input type=\"email\" id=\"email\" name=\"email\" [(ngModel)]=\"model.email\" required>\n        <show-error control=\"email\" [errors]=\"['required']\"></show-error>\n      </p>\n\n      <p>\n        <label for=\"comments\">Comments</label>\n        <textarea id=\"comments\" name=\"comments\" [(ngModel)]=\"model.comments\">\n        </textarea>\n      </p>\n\n      <button type=\"submit\" [disabled]=\"!f.form.valid\">Submit</button>\n    </form>\n  "
        })
    ], TemplateDrivenForms);
    return TemplateDrivenForms;
}());
var ExampleModule = /** @class */ (function () {
    function ExampleModule() {
    }
    ExampleModule = __decorate([
        core_1.NgModule({
            declarations: [TemplateDrivenForms, CreditCardValidator, ShowError],
            bootstrap: [TemplateDrivenForms],
            imports: [platform_browser_1.BrowserModule, forms_1.FormsModule]
        })
    ], ExampleModule);
    return ExampleModule;
}());
function main() {
    platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(ExampleModule);
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3BsYXlncm91bmQvc3JjL3RlbXBsYXRlX2RyaXZlbl9mb3Jtcy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7OztBQUVILGdDQUFnQztBQUVoQyxzQ0FBbUU7QUFDbkUsd0NBQTBGO0FBQzFGLDhEQUF3RDtBQUN4RCw4RUFBeUU7QUFJekU7O0dBRUc7QUFDSDtJQUFBO1FBSUUsWUFBTyxHQUFXLFFBQVEsQ0FBQztJQU03QixDQUFDO0lBQUQsb0JBQUM7QUFBRCxDQUFDLEFBVkQsSUFVQztBQUVEOztHQUVHO0FBQ0gsNkJBQTZCLENBQWM7SUFDekMsSUFBSSxDQUFDLENBQUMsS0FBSyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3ZDLE9BQU8sSUFBSSxDQUFDO0tBQ2I7U0FBTTtRQUNMLE9BQU8sRUFBQyxtQkFBbUIsRUFBRSxJQUFJLEVBQUMsQ0FBQztLQUNwQztBQUNILENBQUM7QUFFRCxJQUFNLDBCQUEwQixHQUFHO0lBQ2pDLE9BQU8sRUFBRSxxQkFBYTtJQUN0QixRQUFRLEVBQUUsbUJBQW1CO0lBQzdCLEtBQUssRUFBRSxJQUFJO0NBQ1osQ0FBQztBQUdGO0lBQUE7SUFDQSxDQUFDO0lBREssbUJBQW1CO1FBRHhCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsZUFBZSxFQUFFLFNBQVMsRUFBRSxDQUFDLDBCQUEwQixDQUFDLEVBQUMsQ0FBQztPQUMxRSxtQkFBbUIsQ0FDeEI7SUFBRCwwQkFBQztDQUFBLEFBREQsSUFDQztBQUVEOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBUUg7SUFLRSxtQkFBb0IsT0FBZTtRQUFJLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQUMsQ0FBQztJQUVoRSxzQkFBSSxtQ0FBWTthQUFoQjtZQUNFLElBQU0sSUFBSSxHQUFjLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1lBQzFDLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzNDLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUU7Z0JBQzlCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtvQkFDL0MsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTt3QkFDeEMsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDL0M7aUJBQ0Y7YUFDRjtZQUNELE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQzs7O09BQUE7SUFFTyxpQ0FBYSxHQUFyQixVQUFzQixJQUFZO1FBQ2hDLElBQU0sTUFBTSxHQUE0QjtZQUN0QyxVQUFVLEVBQUUsYUFBYTtZQUN6QixtQkFBbUIsRUFBRSwrQkFBK0I7U0FDckQsQ0FBQztRQUNGLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RCLENBQUM7SUExQkcsU0FBUztRQVBkLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsWUFBWTtZQUN0QixNQUFNLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxvQkFBb0IsQ0FBQztZQUN0RCxRQUFRLEVBQUUseUVBRVQ7U0FDRixDQUFDO1FBTWEsV0FBQSxXQUFJLEVBQUUsQ0FBQTt5Q0FBVSxjQUFNO09BTC9CLFNBQVMsQ0EyQmQ7SUFBRCxnQkFBQztDQUFBLEFBM0JELElBMkJDO0FBNkREO0lBMURBO1FBMkRFLFVBQUssR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO1FBQzVCLGNBQVMsR0FBRyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztJQU0vQixDQUFDO0lBSkMsc0NBQVEsR0FBUjtRQUNFLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQVBHLG1CQUFtQjtRQTFEeEIsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSx1QkFBdUI7WUFDakMsUUFBUSxFQUFFLCtrRUFzRFQ7U0FDRixDQUFDO09BQ0ksbUJBQW1CLENBUXhCO0lBQUQsMEJBQUM7Q0FBQSxBQVJELElBUUM7QUFNRDtJQUFBO0lBQ0EsQ0FBQztJQURLLGFBQWE7UUFMbEIsZUFBUSxDQUFDO1lBQ1IsWUFBWSxFQUFFLENBQUMsbUJBQW1CLEVBQUUsbUJBQW1CLEVBQUUsU0FBUyxDQUFDO1lBQ25FLFNBQVMsRUFBRSxDQUFDLG1CQUFtQixDQUFDO1lBQ2hDLE9BQU8sRUFBRSxDQUFDLGdDQUFhLEVBQUUsbUJBQVcsQ0FBQztTQUN0QyxDQUFDO09BQ0ksYUFBYSxDQUNsQjtJQUFELG9CQUFDO0NBQUEsQUFERCxJQUNDO0FBRUQ7SUFDRSxpREFBc0IsRUFBRSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUMxRCxDQUFDO0FBRkQsb0JBRUMifQ==