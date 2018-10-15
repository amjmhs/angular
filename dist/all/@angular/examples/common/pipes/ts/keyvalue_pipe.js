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
// #docregion KeyValuePipe
var KeyValuePipeComponent = /** @class */ (function () {
    function KeyValuePipeComponent() {
        this.object = { 2: 'foo', 1: 'bar' };
        this.map = new Map([[2, 'foo'], [1, 'bar']]);
    }
    KeyValuePipeComponent = __decorate([
        core_1.Component({
            selector: 'keyvalue-pipe',
            template: "<span>\n    <p>Object</p>\n    <div *ngFor=\"let item of object | keyvalue\">\n      {{item.key}}:{{item.value}}\n    </div>\n    <p>Map</p>\n    <div *ngFor=\"let item of map | keyvalue\">\n      {{item.key}}:{{item.value}}\n    </div>\n  </span>"
        })
    ], KeyValuePipeComponent);
    return KeyValuePipeComponent;
}());
exports.KeyValuePipeComponent = KeyValuePipeComponent;
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5dmFsdWVfcGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2V4YW1wbGVzL2NvbW1vbi9waXBlcy90cy9rZXl2YWx1ZV9waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsc0NBQXdDO0FBRXhDLDBCQUEwQjtBQWMxQjtJQWJBO1FBY0UsV0FBTSxHQUE0QixFQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBQyxDQUFDO1FBQ3ZELFFBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBSFkscUJBQXFCO1FBYmpDLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsZUFBZTtZQUN6QixRQUFRLEVBQUUseVBBU0Y7U0FDVCxDQUFDO09BQ1cscUJBQXFCLENBR2pDO0lBQUQsNEJBQUM7Q0FBQSxBQUhELElBR0M7QUFIWSxzREFBcUI7QUFJbEMsZ0JBQWdCIn0=