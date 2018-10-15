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
var MyAppComponent = /** @class */ (function () {
    function MyAppComponent() {
    }
    MyAppComponent = __decorate([
        core_1.Component({ selector: 'my-component' })
    ], MyAppComponent);
    return MyAppComponent;
}());
// #docregion providers
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({ imports: [platform_browser_1.BrowserModule], bootstrap: [MyAppComponent] })
    ], AppModule);
    return AppModule;
}());
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(AppModule);
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdmlkZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZXhhbXBsZXMvcGxhdGZvcm0tYnJvd3Nlci9kb20vZGVidWcvdHMvZGVidWdfZWxlbWVudF92aWV3X2xpc3RlbmVyL3Byb3ZpZGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUdILHNDQUFrRDtBQUNsRCw4REFBd0Q7QUFDeEQsOEVBQXlFO0FBR3pFO0lBQUE7SUFDQSxDQUFDO0lBREssY0FBYztRQURuQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLGNBQWMsRUFBQyxDQUFDO09BQ2hDLGNBQWMsQ0FDbkI7SUFBRCxxQkFBQztDQUFBLEFBREQsSUFDQztBQUVELHVCQUF1QjtBQUV2QjtJQUFBO0lBQ0EsQ0FBQztJQURLLFNBQVM7UUFEZCxlQUFRLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxnQ0FBYSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsY0FBYyxDQUFDLEVBQUMsQ0FBQztPQUM1RCxTQUFTLENBQ2Q7SUFBRCxnQkFBQztDQUFBLEFBREQsSUFDQztBQUNELGlEQUFzQixFQUFFLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3BELGdCQUFnQiJ9