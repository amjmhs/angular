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
var platform_browser_1 = require("@angular/platform-browser");
var StableTestCmp = /** @class */ (function () {
    function StableTestCmp() {
        this.status = 'none';
    }
    StableTestCmp.prototype.start = function () {
        var _this = this;
        this.status = 'running';
        setTimeout(function () { _this.status = 'done'; }, 5000);
    };
    StableTestCmp = __decorate([
        core_1.Component({
            selector: 'example-app',
            template: "\n    <button class=\"start-button\" (click)=\"start()\">Start long-running task</button>\n    <div class=\"status\">Status: {{status}}</div>\n  "
        })
    ], StableTestCmp);
    return StableTestCmp;
}());
exports.StableTestCmp = StableTestCmp;
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({ imports: [platform_browser_1.BrowserModule], declarations: [StableTestCmp], bootstrap: [StableTestCmp] })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGFiaWxpdHlfZXhhbXBsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2V4YW1wbGVzL2NvcmUvdGVzdGFiaWxpdHkvdHMvd2hlblN0YWJsZS90ZXN0YWJpbGl0eV9leGFtcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsc0NBQWtEO0FBQ2xELDhEQUF3RDtBQVN4RDtJQVBBO1FBUUUsV0FBTSxHQUFHLE1BQU0sQ0FBQztJQUtsQixDQUFDO0lBSkMsNkJBQUssR0FBTDtRQUFBLGlCQUdDO1FBRkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7UUFDeEIsVUFBVSxDQUFDLGNBQVEsS0FBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUxVLGFBQWE7UUFQekIsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxhQUFhO1lBQ3ZCLFFBQVEsRUFBRSxtSkFHVDtTQUNGLENBQUM7T0FDVyxhQUFhLENBTXpCO0lBQUQsb0JBQUM7Q0FBQSxBQU5ELElBTUM7QUFOWSxzQ0FBYTtBQVMxQjtJQUFBO0lBQ0EsQ0FBQztJQURZLFNBQVM7UUFEckIsZUFBUSxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsZ0NBQWEsQ0FBQyxFQUFFLFlBQVksRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFDLENBQUM7T0FDbkYsU0FBUyxDQUNyQjtJQUFELGdCQUFDO0NBQUEsQUFERCxJQUNDO0FBRFksOEJBQVMifQ==