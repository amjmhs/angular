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
var platform_browser_1 = require("@angular/platform-browser");
var util_1 = require("../util");
var TableComponent = /** @class */ (function () {
    function TableComponent() {
        this.data = util_1.emptyTable;
    }
    TableComponent.prototype.trackByIndex = function (index, item) { return index; };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], TableComponent.prototype, "data", void 0);
    TableComponent = __decorate([
        core_1.Component({
            selector: 'largetable',
            template: "<table><tbody>\n    <tr *ngFor=\"let row of data; trackBy: trackByIndex\">\n    <ng-template ngFor [ngForOf]=\"row\" [ngForTrackBy]=\"trackByIndex\" let-cell><ng-container [ngSwitch]=\"cell.row % 2\">\n        <td *ngSwitchCase=\"0\" style=\"background-color: grey\">{{cell.value}}</td><td *ngSwitchDefault>{{cell.value}}</td>\n    </ng-container></ng-template>\n    </tr>\n  </tbody></table>"
        })
    ], TableComponent);
    return TableComponent;
}());
exports.TableComponent = TableComponent;
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({ imports: [platform_browser_1.BrowserModule], bootstrap: [TableComponent], declarations: [TableComponent] })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2JlbmNobWFya3Mvc3JjL2xhcmdldGFibGUvbmcyX3N3aXRjaC90YWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUVILHNDQUF5RDtBQUN6RCw4REFBd0Q7QUFFeEQsZ0NBQThDO0FBWTlDO0lBVkE7UUFZRSxTQUFJLEdBQWtCLGlCQUFVLENBQUM7SUFHbkMsQ0FBQztJQURDLHFDQUFZLEdBQVosVUFBYSxLQUFhLEVBQUUsSUFBUyxJQUFJLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQztJQUZ4RDtRQURDLFlBQUssRUFBRTs7Z0RBQ3lCO0lBRnRCLGNBQWM7UUFWMUIsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxZQUFZO1lBQ3RCLFFBQVEsRUFBRSwwWUFNTztTQUNsQixDQUFDO09BQ1csY0FBYyxDQUsxQjtJQUFELHFCQUFDO0NBQUEsQUFMRCxJQUtDO0FBTFksd0NBQWM7QUFRM0I7SUFBQTtJQUNBLENBQUM7SUFEWSxTQUFTO1FBRHJCLGVBQVEsQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLGdDQUFhLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxjQUFjLENBQUMsRUFBRSxZQUFZLEVBQUUsQ0FBQyxjQUFjLENBQUMsRUFBQyxDQUFDO09BQ3JGLFNBQVMsQ0FDckI7SUFBRCxnQkFBQztDQUFBLEFBREQsSUFDQztBQURZLDhCQUFTIn0=