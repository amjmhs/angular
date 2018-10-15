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
// #docregion HowTo
var core_1 = require("@angular/core");
var ChildDirective = /** @class */ (function () {
    function ChildDirective() {
    }
    ChildDirective = __decorate([
        core_1.Directive({ selector: 'child-directive' })
    ], ChildDirective);
    return ChildDirective;
}());
var SomeDir = /** @class */ (function () {
    function SomeDir() {
    }
    SomeDir.prototype.ngAfterContentInit = function () {
        // contentChildren is set
    };
    __decorate([
        core_1.ContentChildren(ChildDirective),
        __metadata("design:type", core_1.QueryList)
    ], SomeDir.prototype, "contentChildren", void 0);
    SomeDir = __decorate([
        core_1.Directive({ selector: 'someDir' })
    ], SomeDir);
    return SomeDir;
}());
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudF9jaGlsZHJlbl9ob3d0by5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2V4YW1wbGVzL2NvcmUvZGkvdHMvY29udGVudENoaWxkcmVuL2NvbnRlbnRfY2hpbGRyZW5faG93dG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCxtQkFBbUI7QUFDbkIsc0NBQXNGO0FBR3RGO0lBQUE7SUFDQSxDQUFDO0lBREssY0FBYztRQURuQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLGlCQUFpQixFQUFDLENBQUM7T0FDbkMsY0FBYyxDQUNuQjtJQUFELHFCQUFDO0NBQUEsQUFERCxJQUNDO0FBR0Q7SUFBQTtJQU9BLENBQUM7SUFIQyxvQ0FBa0IsR0FBbEI7UUFDRSx5QkFBeUI7SUFDM0IsQ0FBQztJQUpnQztRQUFoQyxzQkFBZSxDQUFDLGNBQWMsQ0FBQztrQ0FBb0IsZ0JBQVM7b0RBQWlCO0lBRjFFLE9BQU87UUFEWixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLFNBQVMsRUFBQyxDQUFDO09BQzNCLE9BQU8sQ0FPWjtJQUFELGNBQUM7Q0FBQSxBQVBELElBT0M7QUFDRCxnQkFBZ0IifQ==