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
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var platform_browser_1 = require("@angular/platform-browser");
var simple_form_group_example_1 = require("./simple_form_group_example");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule, forms_1.ReactiveFormsModule],
            declarations: [simple_form_group_example_1.SimpleFormGroup],
            bootstrap: [simple_form_group_example_1.SimpleFormGroup]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZXhhbXBsZXMvZm9ybXMvdHMvc2ltcGxlRm9ybUdyb3VwL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILHNDQUF1QztBQUN2Qyx3Q0FBbUQ7QUFDbkQsOERBQXdEO0FBQ3hELHlFQUE0RDtBQU81RDtJQUFBO0lBQ0EsQ0FBQztJQURZLFNBQVM7UUFMckIsZUFBUSxDQUFDO1lBQ1IsT0FBTyxFQUFFLENBQUMsZ0NBQWEsRUFBRSwyQkFBbUIsQ0FBQztZQUM3QyxZQUFZLEVBQUUsQ0FBQywyQ0FBZSxDQUFDO1lBQy9CLFNBQVMsRUFBRSxDQUFDLDJDQUFlLENBQUM7U0FDN0IsQ0FBQztPQUNXLFNBQVMsQ0FDckI7SUFBRCxnQkFBQztDQUFBLEFBREQsSUFDQztBQURZLDhCQUFTIn0=