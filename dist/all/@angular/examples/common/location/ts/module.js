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
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var hash_location_component_1 = require("./hash_location_component");
var path_location_component_1 = require("./path_location_component");
var ExampleAppComponent = /** @class */ (function () {
    function ExampleAppComponent() {
    }
    ExampleAppComponent = __decorate([
        core_1.Component({
            selector: 'example-app',
            template: "<hash-location></hash-location><path-location></path-location>"
        })
    ], ExampleAppComponent);
    return ExampleAppComponent;
}());
exports.ExampleAppComponent = ExampleAppComponent;
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [ExampleAppComponent, path_location_component_1.PathLocationComponent, hash_location_component_1.HashLocationComponent],
            providers: [{ provide: common_1.APP_BASE_HREF, useValue: '/' }],
            imports: [platform_browser_1.BrowserModule],
            bootstrap: [ExampleAppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZXhhbXBsZXMvY29tbW9uL2xvY2F0aW9uL3RzL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILDBDQUE4QztBQUM5QyxzQ0FBa0Q7QUFDbEQsOERBQXdEO0FBRXhELHFFQUFnRTtBQUNoRSxxRUFBZ0U7QUFNaEU7SUFBQTtJQUNBLENBQUM7SUFEWSxtQkFBbUI7UUFKL0IsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxhQUFhO1lBQ3ZCLFFBQVEsRUFBRSxnRUFBZ0U7U0FDM0UsQ0FBQztPQUNXLG1CQUFtQixDQUMvQjtJQUFELDBCQUFDO0NBQUEsQUFERCxJQUNDO0FBRFksa0RBQW1CO0FBU2hDO0lBQUE7SUFDQSxDQUFDO0lBRFksU0FBUztRQU5yQixlQUFRLENBQUM7WUFDUixZQUFZLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSwrQ0FBcUIsRUFBRSwrQ0FBcUIsQ0FBQztZQUNqRixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxzQkFBYSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUMsQ0FBQztZQUNwRCxPQUFPLEVBQUUsQ0FBQyxnQ0FBYSxDQUFDO1lBQ3hCLFNBQVMsRUFBRSxDQUFDLG1CQUFtQixDQUFDO1NBQ2pDLENBQUM7T0FDVyxTQUFTLENBQ3JCO0lBQUQsZ0JBQUM7Q0FBQSxBQURELElBQ0M7QUFEWSw4QkFBUyJ9