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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Zippy = /** @class */ (function () {
    function Zippy() {
        this.visible = true;
        this.title = '';
        this.open = new core_1.EventEmitter();
        this.close = new core_1.EventEmitter();
    }
    Zippy.prototype.toggle = function () {
        this.visible = !this.visible;
        if (this.visible) {
            this.open.emit(null);
        }
        else {
            this.close.emit(null);
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], Zippy.prototype, "title", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], Zippy.prototype, "open", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], Zippy.prototype, "close", void 0);
    Zippy = __decorate([
        core_1.Component({ selector: 'zippy', templateUrl: 'app/zippy.html' })
    ], Zippy);
    return Zippy;
}());
exports.Zippy = Zippy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiemlwcHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3BsYXlncm91bmQvc3JjL3ppcHB5X2NvbXBvbmVudC9hcHAvemlwcHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBcUU7QUFHckU7SUFEQTtRQUVFLFlBQU8sR0FBWSxJQUFJLENBQUM7UUFDZixVQUFLLEdBQVcsRUFBRSxDQUFDO1FBQ2xCLFNBQUksR0FBc0IsSUFBSSxtQkFBWSxFQUFFLENBQUM7UUFDN0MsVUFBSyxHQUFzQixJQUFJLG1CQUFZLEVBQUUsQ0FBQztJQVUxRCxDQUFDO0lBUkMsc0JBQU0sR0FBTjtRQUNFLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQzdCLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNoQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN0QjthQUFNO1lBQ0wsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdkI7SUFDSCxDQUFDO0lBWFE7UUFBUixZQUFLLEVBQUU7O3dDQUFvQjtJQUNsQjtRQUFULGFBQU0sRUFBRTtrQ0FBTyxtQkFBWTt1Q0FBMkI7SUFDN0M7UUFBVCxhQUFNLEVBQUU7a0NBQVEsbUJBQVk7d0NBQTJCO0lBSjdDLEtBQUs7UUFEakIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLGdCQUFnQixFQUFDLENBQUM7T0FDakQsS0FBSyxDQWNqQjtJQUFELFlBQUM7Q0FBQSxBQWRELElBY0M7QUFkWSxzQkFBSyJ9