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
// #docregion Component
var core_1 = require("@angular/core");
var SimpleNgModelComp = /** @class */ (function () {
    function SimpleNgModelComp() {
        this.name = '';
    }
    SimpleNgModelComp.prototype.setValue = function () { this.name = 'Nancy'; };
    SimpleNgModelComp = __decorate([
        core_1.Component({
            selector: 'example-app',
            template: "\n    <input [(ngModel)]=\"name\" #ctrl=\"ngModel\" required>\n\n    <p>Value: {{ name }}</p>\n    <p>Valid: {{ ctrl.valid }}</p>\n    \n    <button (click)=\"setValue()\">Set value</button>\n  ",
        })
    ], SimpleNgModelComp);
    return SimpleNgModelComp;
}());
exports.SimpleNgModelComp = SimpleNgModelComp;
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltcGxlX25nX21vZGVsX2V4YW1wbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9leGFtcGxlcy9mb3Jtcy90cy9zaW1wbGVOZ01vZGVsL3NpbXBsZV9uZ19tb2RlbF9leGFtcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsdUJBQXVCO0FBQ3ZCLHNDQUF3QztBQWF4QztJQVhBO1FBWUUsU0FBSSxHQUFXLEVBQUUsQ0FBQztJQUdwQixDQUFDO0lBREMsb0NBQVEsR0FBUixjQUFhLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUh4QixpQkFBaUI7UUFYN0IsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxhQUFhO1lBQ3ZCLFFBQVEsRUFBRSxvTUFPVDtTQUNGLENBQUM7T0FDVyxpQkFBaUIsQ0FJN0I7SUFBRCx3QkFBQztDQUFBLEFBSkQsSUFJQztBQUpZLDhDQUFpQjtBQUs5QixnQkFBZ0IifQ==