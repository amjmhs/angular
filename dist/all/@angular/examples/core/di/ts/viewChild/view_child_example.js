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
// #docregion Component
var core_1 = require("@angular/core");
var Pane = /** @class */ (function () {
    function Pane() {
    }
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], Pane.prototype, "id", void 0);
    Pane = __decorate([
        core_1.Directive({ selector: 'pane' })
    ], Pane);
    return Pane;
}());
exports.Pane = Pane;
var ViewChildComp = /** @class */ (function () {
    function ViewChildComp() {
        this.selectedPane = '';
        this.shouldShow = true;
    }
    Object.defineProperty(ViewChildComp.prototype, "pane", {
        set: function (v) {
            var _this = this;
            setTimeout(function () { _this.selectedPane = v.id; }, 0);
        },
        enumerable: true,
        configurable: true
    });
    ViewChildComp.prototype.toggle = function () { this.shouldShow = !this.shouldShow; };
    __decorate([
        core_1.ViewChild(Pane),
        __metadata("design:type", Pane),
        __metadata("design:paramtypes", [Pane])
    ], ViewChildComp.prototype, "pane", null);
    ViewChildComp = __decorate([
        core_1.Component({
            selector: 'example-app',
            template: "\n    <pane id=\"1\" *ngIf=\"shouldShow\"></pane>\n    <pane id=\"2\" *ngIf=\"!shouldShow\"></pane>\n    \n    <button (click)=\"toggle()\">Toggle</button>\n       \n    <div>Selected: {{selectedPane}}</div> \n  ",
        })
    ], ViewChildComp);
    return ViewChildComp;
}());
exports.ViewChildComp = ViewChildComp;
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld19jaGlsZF9leGFtcGxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZXhhbXBsZXMvY29yZS9kaS90cy92aWV3Q2hpbGQvdmlld19jaGlsZF9leGFtcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsdUJBQXVCO0FBQ3ZCLHNDQUFxRTtBQUdyRTtJQUFBO0lBR0EsQ0FBQztJQURVO1FBQVIsWUFBSyxFQUFFOztvQ0FBYztJQUZYLElBQUk7UUFEaEIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUMsQ0FBQztPQUNqQixJQUFJLENBR2hCO0lBQUQsV0FBQztDQUFBLEFBSEQsSUFHQztBQUhZLG9CQUFJO0FBZ0JqQjtJQVhBO1FBZ0JFLGlCQUFZLEdBQVcsRUFBRSxDQUFDO1FBQzFCLGVBQVUsR0FBRyxJQUFJLENBQUM7SUFFcEIsQ0FBQztJQU5DLHNCQUFJLCtCQUFJO2FBQVIsVUFBUyxDQUFPO1lBRGhCLGlCQUdDO1lBREMsVUFBVSxDQUFDLGNBQVEsS0FBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3JELENBQUM7OztPQUFBO0lBR0QsOEJBQU0sR0FBTixjQUFXLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUxoRDtRQURDLGdCQUFTLENBQUMsSUFBSSxDQUFDO2tDQUNKLElBQUk7eUNBQUosSUFBSTs2Q0FFZjtJQUpVLGFBQWE7UUFYekIsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxhQUFhO1lBQ3ZCLFFBQVEsRUFBRSxzTkFPVDtTQUNGLENBQUM7T0FDVyxhQUFhLENBUXpCO0lBQUQsb0JBQUM7Q0FBQSxBQVJELElBUUM7QUFSWSxzQ0FBYTtBQVMxQixnQkFBZ0IifQ==