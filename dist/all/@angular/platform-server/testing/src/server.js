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
var testing_1 = require("@angular/platform-browser-dynamic/testing");
var animations_1 = require("@angular/platform-browser/animations");
var platform_server_1 = require("@angular/platform-server");
/**
 * Platform for testing
 *
 * @experimental API related to bootstrapping are still under review.
 */
exports.platformServerTesting = core_1.createPlatformFactory(testing_1.ɵplatformCoreDynamicTesting, 'serverTesting', platform_server_1.ɵINTERNAL_SERVER_PLATFORM_PROVIDERS);
/**
 * NgModule for testing.
 *
 * @experimental API related to bootstrapping are still under review.
 */
var ServerTestingModule = /** @class */ (function () {
    function ServerTestingModule() {
    }
    ServerTestingModule = __decorate([
        core_1.NgModule({
            exports: [testing_1.BrowserDynamicTestingModule],
            imports: [animations_1.NoopAnimationsModule],
            providers: platform_server_1.ɵSERVER_RENDER_PROVIDERS
        })
    ], ServerTestingModule);
    return ServerTestingModule;
}());
exports.ServerTestingModule = ServerTestingModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tc2VydmVyL3Rlc3Rpbmcvc3JjL3NlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILHNDQUEyRjtBQUMzRixxRUFBaUo7QUFDakosbUVBQTBFO0FBQzFFLDREQUF3SztBQUd4Szs7OztHQUlHO0FBQ1UsUUFBQSxxQkFBcUIsR0FBRyw0QkFBcUIsQ0FDdEQscUNBQTBCLEVBQUUsZUFBZSxFQUFFLHFEQUFrQyxDQUFDLENBQUM7QUFFckY7Ozs7R0FJRztBQU1IO0lBQUE7SUFDQSxDQUFDO0lBRFksbUJBQW1CO1FBTC9CLGVBQVEsQ0FBQztZQUNSLE9BQU8sRUFBRSxDQUFDLHFDQUEyQixDQUFDO1lBQ3RDLE9BQU8sRUFBRSxDQUFDLGlDQUFvQixDQUFDO1lBQy9CLFNBQVMsRUFBRSwwQ0FBdUI7U0FDbkMsQ0FBQztPQUNXLG1CQUFtQixDQUMvQjtJQUFELDBCQUFDO0NBQUEsQUFERCxJQUNDO0FBRFksa0RBQW1CIn0=