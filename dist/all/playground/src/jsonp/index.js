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
var http_1 = require("@angular/http");
var platform_browser_1 = require("@angular/platform-browser");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var jsonp_comp_1 = require("./app/jsonp_comp");
var ExampleModule = /** @class */ (function () {
    function ExampleModule() {
    }
    ExampleModule = __decorate([
        core_1.NgModule({ bootstrap: [jsonp_comp_1.JsonpCmp], declarations: [jsonp_comp_1.JsonpCmp], imports: [platform_browser_1.BrowserModule, http_1.JsonpModule] })
    ], ExampleModule);
    return ExampleModule;
}());
function main() {
    platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(ExampleModule);
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3BsYXlncm91bmQvc3JjL2pzb25wL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsc0NBQXVDO0FBQ3ZDLHNDQUEwQztBQUMxQyw4REFBd0Q7QUFDeEQsOEVBQXlFO0FBRXpFLCtDQUEwQztBQUcxQztJQUFBO0lBQ0EsQ0FBQztJQURLLGFBQWE7UUFEbEIsZUFBUSxDQUFDLEVBQUMsU0FBUyxFQUFFLENBQUMscUJBQVEsQ0FBQyxFQUFFLFlBQVksRUFBRSxDQUFDLHFCQUFRLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxnQ0FBYSxFQUFFLGtCQUFXLENBQUMsRUFBQyxDQUFDO09BQzdGLGFBQWEsQ0FDbEI7SUFBRCxvQkFBQztDQUFBLEFBREQsSUFDQztBQUVEO0lBQ0UsaURBQXNCLEVBQUUsQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDMUQsQ0FBQztBQUZELG9CQUVDIn0=