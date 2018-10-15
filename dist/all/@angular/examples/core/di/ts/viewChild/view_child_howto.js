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
var SomeCmp = /** @class */ (function () {
    function SomeCmp() {
    }
    SomeCmp.prototype.ngAfterViewInit = function () {
        // child is set
    };
    __decorate([
        core_1.ViewChild(ChildDirective),
        __metadata("design:type", ChildDirective)
    ], SomeCmp.prototype, "child", void 0);
    SomeCmp = __decorate([
        core_1.Component({ selector: 'someCmp', templateUrl: 'someCmp.html' })
    ], SomeCmp);
    return SomeCmp;
}());
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld19jaGlsZF9ob3d0by5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2V4YW1wbGVzL2NvcmUvZGkvdHMvdmlld0NoaWxkL3ZpZXdfY2hpbGRfaG93dG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCxtQkFBbUI7QUFDbkIsc0NBQTZFO0FBRzdFO0lBQUE7SUFDQSxDQUFDO0lBREssY0FBYztRQURuQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLGlCQUFpQixFQUFDLENBQUM7T0FDbkMsY0FBYyxDQUNuQjtJQUFELHFCQUFDO0NBQUEsQUFERCxJQUNDO0FBR0Q7SUFBQTtJQU9BLENBQUM7SUFIQyxpQ0FBZSxHQUFmO1FBQ0UsZUFBZTtJQUNqQixDQUFDO0lBSjBCO1FBQTFCLGdCQUFTLENBQUMsY0FBYyxDQUFDO2tDQUFVLGNBQWM7MENBQUM7SUFGL0MsT0FBTztRQURaLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxjQUFjLEVBQUMsQ0FBQztPQUN4RCxPQUFPLENBT1o7SUFBRCxjQUFDO0NBQUEsQUFQRCxJQU9DO0FBQ0QsZ0JBQWdCIn0=