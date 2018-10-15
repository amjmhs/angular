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
        core_1.NgModule({ imports: [platform_webworker_1.WorkerAppModule], bootstrap: [index_common_1.AnimationCmp], declarations: [index_common_1.AnimationCmp] })
    ], ExampleModule);
    return ExampleModule;
}());
function main() {
    platform_webworker_dynamic_1.platformWorkerAppDynamic().bootstrapModule(ExampleModule);
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZF9pbmRleC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvcGxheWdyb3VuZC9zcmMvd2ViX3dvcmtlcnMvYW5pbWF0aW9ucy9iYWNrZ3JvdW5kX2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsc0NBQXVDO0FBQ3ZDLGtFQUE0RDtBQUM1RCxrRkFBNkU7QUFFN0UsK0NBQTRDO0FBRzVDO0lBQUE7SUFDQSxDQUFDO0lBREssYUFBYTtRQURsQixlQUFRLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxvQ0FBZSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsMkJBQVksQ0FBQyxFQUFFLFlBQVksRUFBRSxDQUFDLDJCQUFZLENBQUMsRUFBQyxDQUFDO09BQzFGLGFBQWEsQ0FDbEI7SUFBRCxvQkFBQztDQUFBLEFBREQsSUFDQztBQUVEO0lBQ0UscURBQXdCLEVBQUUsQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDNUQsQ0FBQztBQUZELG9CQUVDIn0=