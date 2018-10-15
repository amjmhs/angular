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
var ViewChildrenComp = /** @class */ (function () {
    function ViewChildrenComp() {
        this.serializedPanes = '';
        this.shouldShow = false;
    }
    ViewChildrenComp.prototype.show = function () { this.shouldShow = true; };
    ViewChildrenComp.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.calculateSerializedPanes();
        this.panes.changes.subscribe(function (r) { _this.calculateSerializedPanes(); });
    };
    ViewChildrenComp.prototype.calculateSerializedPanes = function () {
        var _this = this;
        setTimeout(function () { _this.serializedPanes = _this.panes.map(function (p) { return p.id; }).join(', '); }, 0);
    };
    __decorate([
        core_1.ViewChildren(Pane),
        __metadata("design:type", core_1.QueryList)
    ], ViewChildrenComp.prototype, "panes", void 0);
    ViewChildrenComp = __decorate([
        core_1.Component({
            selector: 'example-app',
            template: "\n    <pane id=\"1\"></pane>\n    <pane id=\"2\"></pane>\n    <pane id=\"3\" *ngIf=\"shouldShow\"></pane>\n    \n    <button (click)=\"show()\">Show 3</button>\n       \n    <div>panes: {{serializedPanes}}</div> \n  ",
        })
    ], ViewChildrenComp);
    return ViewChildrenComp;
}());
exports.ViewChildrenComp = ViewChildrenComp;
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld19jaGlsZHJlbl9leGFtcGxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZXhhbXBsZXMvY29yZS9kaS90cy92aWV3Q2hpbGRyZW4vdmlld19jaGlsZHJlbl9leGFtcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsdUJBQXVCO0FBQ3ZCLHNDQUFrRztBQUdsRztJQUFBO0lBR0EsQ0FBQztJQURVO1FBQVIsWUFBSyxFQUFFOztvQ0FBYztJQUZYLElBQUk7UUFEaEIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUMsQ0FBQztPQUNqQixJQUFJLENBR2hCO0lBQUQsV0FBQztDQUFBLEFBSEQsSUFHQztBQUhZLG9CQUFJO0FBaUJqQjtJQVpBO1FBZUUsb0JBQWUsR0FBVyxFQUFFLENBQUM7UUFFN0IsZUFBVSxHQUFHLEtBQUssQ0FBQztJQVlyQixDQUFDO0lBVkMsK0JBQUksR0FBSixjQUFTLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUVsQywwQ0FBZSxHQUFmO1FBQUEsaUJBR0M7UUFGQyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztRQUNoQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsVUFBQyxDQUFDLElBQU8sS0FBSSxDQUFDLHdCQUF3QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBRUQsbURBQXdCLEdBQXhCO1FBQUEsaUJBRUM7UUFEQyxVQUFVLENBQUMsY0FBUSxLQUFJLENBQUMsZUFBZSxHQUFHLEtBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEVBQUUsRUFBSixDQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDeEYsQ0FBQztJQWRtQjtRQUFuQixtQkFBWSxDQUFDLElBQUksQ0FBQztrQ0FBVSxnQkFBUzttREFBTztJQUZsQyxnQkFBZ0I7UUFaNUIsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxhQUFhO1lBQ3ZCLFFBQVEsRUFBRSwwTkFRVDtTQUNGLENBQUM7T0FDVyxnQkFBZ0IsQ0FpQjVCO0lBQUQsdUJBQUM7Q0FBQSxBQWpCRCxJQWlCQztBQWpCWSw0Q0FBZ0I7QUFrQjdCLGdCQUFnQiJ9