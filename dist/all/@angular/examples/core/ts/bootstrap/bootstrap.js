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
var platform_browser_1 = require("@angular/platform-browser");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
// #docregion bootstrap
var MyApp = /** @class */ (function () {
    function MyApp() {
        this.name = 'World';
    }
    MyApp = __decorate([
        core_1.Component({ selector: 'my-app', template: 'Hello {{ name }}!' })
    ], MyApp);
    return MyApp;
}());
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({ imports: [platform_browser_1.BrowserModule], bootstrap: [MyApp] })
    ], AppModule);
    return AppModule;
}());
function main() {
    platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(AppModule);
}
exports.main = main;
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vdHN0cmFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZXhhbXBsZXMvY29yZS90cy9ib290c3RyYXAvYm9vdHN0cmFwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsc0NBQWtEO0FBQ2xELDhEQUF3RDtBQUN4RCw4RUFBeUU7QUFFekUsdUJBQXVCO0FBRXZCO0lBREE7UUFFRSxTQUFJLEdBQVcsT0FBTyxDQUFDO0lBQ3pCLENBQUM7SUFGSyxLQUFLO1FBRFYsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLG1CQUFtQixFQUFDLENBQUM7T0FDekQsS0FBSyxDQUVWO0lBQUQsWUFBQztDQUFBLEFBRkQsSUFFQztBQUdEO0lBQUE7SUFDQSxDQUFDO0lBREssU0FBUztRQURkLGVBQVEsQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLGdDQUFhLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBQyxDQUFDO09BQ25ELFNBQVMsQ0FDZDtJQUFELGdCQUFDO0NBQUEsQUFERCxJQUNDO0FBRUQ7SUFDRSxpREFBc0IsRUFBRSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN0RCxDQUFDO0FBRkQsb0JBRUM7QUFFRCxnQkFBZ0IifQ==