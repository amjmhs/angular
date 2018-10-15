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
        __metadata("design:paramtypes", [forms_1.FormGroupDirective])
    ], ShowError);
    return ShowError;
}());
var ReactiveForms = /** @class */ (function () {
    function ReactiveForms(fb) {
        this.countries = ['US', 'Canada'];
        this.form = fb.group({
            'firstName': ['', forms_1.Validators.required],
            'middleName': [''],
            'lastName': ['', forms_1.Validators.required],
            'country': ['Canada', forms_1.Validators.required],
            'creditCard': ['', forms_1.Validators.compose([forms_1.Validators.required, creditCardValidator])],
            'amount': [0, forms_1.Validators.required],
            'email': ['', forms_1.Validators.required],
            'comments': ['']
        });
    }
    ReactiveForms.prototype.onSubmit = function () {
        console.log('Submitting:');
        console.log(this.form.value);
    };
    ReactiveForms = __decorate([
        core_1.Component({
            selector: 'reactive-forms',
            viewProviders: [forms_1.FormBuilder],
            template: "\n    <h1>Checkout Form (Reactive)</h1>\n\n    <form (ngSubmit)=\"onSubmit()\" [formGroup]=\"form\" #f=\"ngForm\">\n      <p>\n        <label for=\"firstName\">First Name</label>\n        <input type=\"text\" id=\"firstName\" formControlName=\"firstName\">\n        <show-error control=\"firstName\" [errors]=\"['required']\"></show-error>\n      </p>\n\n      <p>\n        <label for=\"middleName\">Middle Name</label>\n        <input type=\"text\" id=\"middleName\" formControlName=\"middleName\">\n      </p>\n\n      <p>\n        <label for=\"lastName\">Last Name</label>\n        <input type=\"text\" id=\"lastName\" formControlName=\"lastName\">\n        <show-error control=\"lastName\" [errors]=\"['required']\"></show-error>\n      </p>\n\n      <p>\n        <label for=\"country\">Country</label>\n        <select id=\"country\" formControlName=\"country\">\n          <option *ngFor=\"let c of countries\" [value]=\"c\">{{c}}</option>\n        </select>\n      </p>\n\n      <p>\n        <label for=\"creditCard\">Credit Card</label>\n        <input type=\"text\" id=\"creditCard\" formControlName=\"creditCard\">\n        <show-error control=\"creditCard\" [errors]=\"['required', 'invalidCreditCard']\"></show-error>\n      </p>\n\n      <p>\n        <label for=\"amount\">Amount</label>\n        <input type=\"number\" id=\"amount\" formControlName=\"amount\">\n        <show-error control=\"amount\" [errors]=\"['required']\"></show-error>\n      </p>\n\n      <p>\n        <label for=\"email\">Email</label>\n        <input type=\"email\" id=\"email\" formControlName=\"email\">\n        <show-error control=\"email\" [errors]=\"['required']\"></show-error>\n      </p>\n\n      <p>\n        <label for=\"comments\">Comments</label>\n        <textarea id=\"comments\" formControlName=\"comments\">\n        </textarea>\n      </p>\n\n      <button type=\"submit\" [disabled]=\"!f.form.valid\">Submit</button>\n    </form>\n  "
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder])
    ], ReactiveForms);
    return ReactiveForms;
}());
var ExampleModule = /** @class */ (function () {
    function ExampleModule() {
    }
    ExampleModule = __decorate([
        core_1.NgModule({
            bootstrap: [ReactiveForms],
            declarations: [ShowError, ReactiveForms],
            imports: [platform_browser_1.BrowserModule, forms_1.ReactiveFormsModule]
        })
    ], ExampleModule);
    return ExampleModule;
}());
function main() {
    platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(ExampleModule);
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3BsYXlncm91bmQvc3JjL21vZGVsX2RyaXZlbl9mb3Jtcy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7OztBQUVILGdDQUFnQztBQUNoQyxzQ0FBd0Q7QUFDeEQsd0NBQTRIO0FBQzVILDhEQUF3RDtBQUN4RCw4RUFBeUU7QUFJekU7O0dBRUc7QUFDSCw2QkFBNkIsQ0FBa0I7SUFDN0MsSUFBSSxDQUFDLENBQUMsS0FBSyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3ZDLE9BQU8sSUFBSSxDQUFDO0tBQ2I7U0FBTTtRQUNMLE9BQU8sRUFBQyxtQkFBbUIsRUFBRSxJQUFJLEVBQUMsQ0FBQztLQUNwQztBQUNILENBQUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQVFIO0lBS0UsbUJBQW9CLE9BQTJCO1FBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFBQyxDQUFDO0lBRTVFLHNCQUFJLG1DQUFZO2FBQWhCO1lBQ0UsSUFBTSxJQUFJLEdBQWMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDMUMsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDM0MsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRTtnQkFDOUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO29CQUMvQyxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO3dCQUN4QyxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUMvQztpQkFDRjthQUNGO1lBQ0QsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDOzs7T0FBQTtJQUVPLGlDQUFhLEdBQXJCLFVBQXNCLElBQVk7UUFDaEMsSUFBTSxNQUFNLEdBQTRCO1lBQ3RDLFVBQVUsRUFBRSxhQUFhO1lBQ3pCLG1CQUFtQixFQUFFLCtCQUErQjtTQUNyRCxDQUFDO1FBQ0YsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEIsQ0FBQztJQTFCRyxTQUFTO1FBUGQsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxZQUFZO1lBQ3RCLE1BQU0sRUFBRSxDQUFDLHNCQUFzQixFQUFFLG9CQUFvQixDQUFDO1lBQ3RELFFBQVEsRUFBRSx5RUFFVDtTQUNGLENBQUM7UUFNYSxXQUFBLFdBQUksRUFBRSxDQUFBO3lDQUFVLDBCQUFrQjtPQUwzQyxTQUFTLENBMkJkO0lBQUQsZ0JBQUM7Q0FBQSxBQTNCRCxJQTJCQztBQThERDtJQUlFLHVCQUFZLEVBQWU7UUFGM0IsY0FBUyxHQUFHLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRzNCLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQztZQUNuQixXQUFXLEVBQUUsQ0FBQyxFQUFFLEVBQUUsa0JBQVUsQ0FBQyxRQUFRLENBQUM7WUFDdEMsWUFBWSxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ2xCLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRSxrQkFBVSxDQUFDLFFBQVEsQ0FBQztZQUNyQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLEVBQUUsa0JBQVUsQ0FBQyxRQUFRLENBQUM7WUFDMUMsWUFBWSxFQUFFLENBQUMsRUFBRSxFQUFFLGtCQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsa0JBQVUsQ0FBQyxRQUFRLEVBQUUsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO1lBQ2xGLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRSxrQkFBVSxDQUFDLFFBQVEsQ0FBQztZQUNsQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUUsa0JBQVUsQ0FBQyxRQUFRLENBQUM7WUFDbEMsVUFBVSxFQUFFLENBQUMsRUFBRSxDQUFDO1NBQ2pCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxnQ0FBUSxHQUFSO1FBQ0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQXBCRyxhQUFhO1FBM0RsQixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLGdCQUFnQjtZQUMxQixhQUFhLEVBQUUsQ0FBQyxtQkFBVyxDQUFDO1lBQzVCLFFBQVEsRUFBRSx1NURBc0RUO1NBQ0YsQ0FBQzt5Q0FLZ0IsbUJBQVc7T0FKdkIsYUFBYSxDQXFCbEI7SUFBRCxvQkFBQztDQUFBLEFBckJELElBcUJDO0FBT0Q7SUFBQTtJQUNBLENBQUM7SUFESyxhQUFhO1FBTGxCLGVBQVEsQ0FBQztZQUNSLFNBQVMsRUFBRSxDQUFDLGFBQWEsQ0FBQztZQUMxQixZQUFZLEVBQUUsQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDO1lBQ3hDLE9BQU8sRUFBRSxDQUFDLGdDQUFhLEVBQUUsMkJBQW1CLENBQUM7U0FDOUMsQ0FBQztPQUNJLGFBQWEsQ0FDbEI7SUFBRCxvQkFBQztDQUFBLEFBREQsSUFDQztBQUVEO0lBQ0UsaURBQXNCLEVBQUUsQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDMUQsQ0FBQztBQUZELG9CQUVDIn0=