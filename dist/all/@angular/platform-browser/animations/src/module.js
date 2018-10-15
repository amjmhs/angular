"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var providers_1 = require("./providers");
/**
 * Exports `BrowserModule` with additional [dependency-injection providers](guide/glossary#provider)
 * for use with animations. See [Animations](guide/animations).
 * @experimental
 */
var BrowserAnimationsModule = /** @class */ (function () {
    function BrowserAnimationsModule() {
    }
    BrowserAnimationsModule = __decorate([
        core_1.NgModule({
            exports: [platform_browser_1.BrowserModule],
            providers: providers_1.BROWSER_ANIMATIONS_PROVIDERS,
        })
    ], BrowserAnimationsModule);
    return BrowserAnimationsModule;
}());
exports.BrowserAnimationsModule = BrowserAnimationsModule;
/**
 * A null player that must be imported to allow disabling of animations.
 * @experimental
 */
var NoopAnimationsModule = /** @class */ (function () {
    function NoopAnimationsModule() {
    }
    NoopAnimationsModule = __decorate([
        core_1.NgModule({
            exports: [platform_browser_1.BrowserModule],
            providers: providers_1.BROWSER_NOOP_ANIMATIONS_PROVIDERS,
        })
    ], NoopAnimationsModule);
    return NoopAnimationsModule;
}());
exports.NoopAnimationsModule = NoopAnimationsModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zL3NyYy9tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7Ozs7O0dBTUc7QUFDSCxzQ0FBdUM7QUFDdkMsOERBQXdEO0FBRXhELHlDQUE0RjtBQUU1Rjs7OztHQUlHO0FBS0g7SUFBQTtJQUNBLENBQUM7SUFEWSx1QkFBdUI7UUFKbkMsZUFBUSxDQUFDO1lBQ1IsT0FBTyxFQUFFLENBQUMsZ0NBQWEsQ0FBQztZQUN4QixTQUFTLEVBQUUsd0NBQTRCO1NBQ3hDLENBQUM7T0FDVyx1QkFBdUIsQ0FDbkM7SUFBRCw4QkFBQztDQUFBLEFBREQsSUFDQztBQURZLDBEQUF1QjtBQUdwQzs7O0dBR0c7QUFLSDtJQUFBO0lBQ0EsQ0FBQztJQURZLG9CQUFvQjtRQUpoQyxlQUFRLENBQUM7WUFDUixPQUFPLEVBQUUsQ0FBQyxnQ0FBYSxDQUFDO1lBQ3hCLFNBQVMsRUFBRSw2Q0FBaUM7U0FDN0MsQ0FBQztPQUNXLG9CQUFvQixDQUNoQztJQUFELDJCQUFDO0NBQUEsQUFERCxJQUNDO0FBRFksb0RBQW9CIn0=