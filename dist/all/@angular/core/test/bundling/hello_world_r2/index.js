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
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var HelloWorldComponent = /** @class */ (function () {
    function HelloWorldComponent() {
    }
    HelloWorldComponent = __decorate([
        core_1.Component({ selector: 'hello-world', template: 'Hello World!' })
    ], HelloWorldComponent);
    return HelloWorldComponent;
}());
exports.HelloWorldComponent = HelloWorldComponent;
var HelloWorldModule = /** @class */ (function () {
    function HelloWorldModule() {
    }
    HelloWorldModule = __decorate([
        core_1.NgModule({ declarations: [HelloWorldComponent] })
    ], HelloWorldModule);
    return HelloWorldModule;
}());
exports.HelloWorldModule = HelloWorldModule;
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(HelloWorldModule);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvYnVuZGxpbmcvaGVsbG9fd29ybGRfcjIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7Ozs7O0dBTUc7QUFDSCxzQ0FBa0Q7QUFDbEQsOEVBQXlFO0FBR3pFO0lBQUE7SUFDQSxDQUFDO0lBRFksbUJBQW1CO1FBRC9CLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxjQUFjLEVBQUMsQ0FBQztPQUNsRCxtQkFBbUIsQ0FDL0I7SUFBRCwwQkFBQztDQUFBLEFBREQsSUFDQztBQURZLGtEQUFtQjtBQUloQztJQUFBO0lBQ0EsQ0FBQztJQURZLGdCQUFnQjtRQUQ1QixlQUFRLENBQUMsRUFBQyxZQUFZLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFDLENBQUM7T0FDbkMsZ0JBQWdCLENBQzVCO0lBQUQsdUJBQUM7Q0FBQSxBQURELElBQ0M7QUFEWSw0Q0FBZ0I7QUFHN0IsaURBQXNCLEVBQUUsQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyJ9