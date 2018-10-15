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
var platform_webworker_1 = require("@angular/platform-webworker");
var platform_webworker_dynamic_1 = require("@angular/platform-webworker-dynamic");
var index_common_1 = require("./index_common");
var ExampleModule = /** @class */ (function () {
    function ExampleModule() {
    }
    ExampleModule = __decorate([
        core_1.NgModule({ imports: [platform_webworker_1.WorkerAppModule], bootstrap: [index_common_1.HelloCmp], declarations: [index_common_1.HelloCmp] })
    ], ExampleModule);
    return ExampleModule;
}());
function main() {
    platform_webworker_dynamic_1.platformWorkerAppDynamic().bootstrapModule(ExampleModule);
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZF9pbmRleC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvcGxheWdyb3VuZC9zcmMvd2ViX3dvcmtlcnMva2l0Y2hlbl9zaW5rL2JhY2tncm91bmRfaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7QUFFSCxzQ0FBdUM7QUFDdkMsa0VBQTREO0FBQzVELGtGQUE2RTtBQUU3RSwrQ0FBd0M7QUFHeEM7SUFBQTtJQUNBLENBQUM7SUFESyxhQUFhO1FBRGxCLGVBQVEsQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLG9DQUFlLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyx1QkFBUSxDQUFDLEVBQUUsWUFBWSxFQUFFLENBQUMsdUJBQVEsQ0FBQyxFQUFDLENBQUM7T0FDbEYsYUFBYSxDQUNsQjtJQUFELG9CQUFDO0NBQUEsQUFERCxJQUNDO0FBRUQ7SUFDRSxxREFBd0IsRUFBRSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUM1RCxDQUFDO0FBRkQsb0JBRUMifQ==