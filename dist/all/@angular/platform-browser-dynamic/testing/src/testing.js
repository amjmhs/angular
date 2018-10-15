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
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var testing_2 = require("@angular/platform-browser/testing");
var dom_test_component_renderer_1 = require("./dom_test_component_renderer");
var platform_core_dynamic_testing_1 = require("./platform_core_dynamic_testing");
__export(require("./private_export_testing"));
exports.platformBrowserDynamicTesting = core_1.createPlatformFactory(platform_core_dynamic_testing_1.platformCoreDynamicTesting, 'browserDynamicTesting', platform_browser_dynamic_1.ɵINTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS);
/**
 * NgModule for testing.
 *
 *
 */
var BrowserDynamicTestingModule = /** @class */ (function () {
    function BrowserDynamicTestingModule() {
    }
    BrowserDynamicTestingModule = __decorate([
        core_1.NgModule({
            exports: [testing_2.BrowserTestingModule],
            providers: [
                { provide: testing_1.TestComponentRenderer, useClass: dom_test_component_renderer_1.DOMTestComponentRenderer },
            ]
        })
    ], BrowserDynamicTestingModule);
    return BrowserDynamicTestingModule;
}());
exports.BrowserDynamicTestingModule = BrowserDynamicTestingModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLWJyb3dzZXItZHluYW1pYy90ZXN0aW5nL3NyYy90ZXN0aW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsc0NBQTJGO0FBQzNGLGlEQUE0RDtBQUM1RCw4RUFBOEk7QUFDOUksNkRBQXVFO0FBRXZFLDZFQUF1RTtBQUN2RSxpRkFBMkU7QUFFM0UsOENBQXlDO0FBRTVCLFFBQUEsNkJBQTZCLEdBQUcsNEJBQXFCLENBQzlELDBEQUEwQixFQUFFLHVCQUF1QixFQUNuRCx1RUFBMkMsQ0FBQyxDQUFDO0FBRWpEOzs7O0dBSUc7QUFPSDtJQUFBO0lBQ0EsQ0FBQztJQURZLDJCQUEyQjtRQU52QyxlQUFRLENBQUM7WUFDUixPQUFPLEVBQUUsQ0FBQyw4QkFBb0IsQ0FBQztZQUMvQixTQUFTLEVBQUU7Z0JBQ1QsRUFBQyxPQUFPLEVBQUUsK0JBQXFCLEVBQUUsUUFBUSxFQUFFLHNEQUF3QixFQUFDO2FBQ3JFO1NBQ0YsQ0FBQztPQUNXLDJCQUEyQixDQUN2QztJQUFELGtDQUFDO0NBQUEsQUFERCxJQUNDO0FBRFksa0VBQTJCIn0=