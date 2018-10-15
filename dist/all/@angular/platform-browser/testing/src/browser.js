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
var browser_util_1 = require("./browser_util");
function initBrowserTests() {
    platform_browser_1.ɵBrowserDomAdapter.makeCurrent();
    browser_util_1.BrowserDetection.setup();
}
var _TEST_BROWSER_PLATFORM_PROVIDERS = [{ provide: core_1.PLATFORM_INITIALIZER, useValue: initBrowserTests, multi: true }];
/**
 * Platform for testing
 *
 *
 */
exports.platformBrowserTesting = core_1.createPlatformFactory(core_1.platformCore, 'browserTesting', _TEST_BROWSER_PLATFORM_PROVIDERS);
/**
 * NgModule for testing.
 *
 *
 */
var BrowserTestingModule = /** @class */ (function () {
    function BrowserTestingModule() {
    }
    BrowserTestingModule = __decorate([
        core_1.NgModule({
            exports: [platform_browser_1.BrowserModule],
            providers: [
                { provide: core_1.APP_ID, useValue: 'a' },
                platform_browser_1.ɵELEMENT_PROBE_PROVIDERS,
                { provide: core_1.NgZone, useFactory: browser_util_1.createNgZone },
            ]
        })
    ], BrowserTestingModule);
    return BrowserTestingModule;
}());
exports.BrowserTestingModule = BrowserTestingModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLWJyb3dzZXIvdGVzdGluZy9zcmMvYnJvd3Nlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7Ozs7R0FNRztBQUNILHNDQUErSTtBQUMvSSw4REFBc0o7QUFDdEosK0NBQThEO0FBRTlEO0lBQ0UscUNBQWlCLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDaEMsK0JBQWdCLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDM0IsQ0FBQztBQUVELElBQU0sZ0NBQWdDLEdBQ2xDLENBQUMsRUFBQyxPQUFPLEVBQUUsMkJBQW9CLEVBQUUsUUFBUSxFQUFFLGdCQUFnQixFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0FBRS9FOzs7O0dBSUc7QUFDVSxRQUFBLHNCQUFzQixHQUMvQiw0QkFBcUIsQ0FBQyxtQkFBWSxFQUFFLGdCQUFnQixFQUFFLGdDQUFnQyxDQUFDLENBQUM7QUFFNUY7Ozs7R0FJRztBQVNIO0lBQUE7SUFDQSxDQUFDO0lBRFksb0JBQW9CO1FBUmhDLGVBQVEsQ0FBQztZQUNSLE9BQU8sRUFBRSxDQUFDLGdDQUFhLENBQUM7WUFDeEIsU0FBUyxFQUFFO2dCQUNULEVBQUMsT0FBTyxFQUFFLGFBQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFDO2dCQUNoQywyQ0FBdUI7Z0JBQ3ZCLEVBQUMsT0FBTyxFQUFFLGFBQU0sRUFBRSxVQUFVLEVBQUUsMkJBQVksRUFBQzthQUM1QztTQUNGLENBQUM7T0FDVyxvQkFBb0IsQ0FDaEM7SUFBRCwyQkFBQztDQUFBLEFBREQsSUFDQztBQURZLG9EQUFvQiJ9