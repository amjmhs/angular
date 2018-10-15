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
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
// #docregion longform
var MyApp = /** @class */ (function () {
    function MyApp() {
    }
    MyApp = __decorate([
        core_1.Component({ selector: 'my-app', template: 'Hello World' })
    ], MyApp);
    return MyApp;
}());
var myPlatformFactory = core_1.createPlatformFactory(platform_browser_dynamic_1.platformBrowserDynamic, 'myPlatform');
myPlatformFactory().bootstrapModule(MyApp);
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9leGFtcGxlcy9jb3JlL3RzL3BsYXRmb3JtL3BsYXRmb3JtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsc0NBQStEO0FBQy9ELDhFQUF5RTtBQUV6RSxzQkFBc0I7QUFFdEI7SUFBQTtJQUNBLENBQUM7SUFESyxLQUFLO1FBRFYsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBQyxDQUFDO09BQ25ELEtBQUssQ0FDVjtJQUFELFlBQUM7Q0FBQSxBQURELElBQ0M7QUFFRCxJQUFNLGlCQUFpQixHQUFHLDRCQUFxQixDQUFDLGlEQUFzQixFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ3RGLGlCQUFpQixFQUFFLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzNDLGdCQUFnQiJ9