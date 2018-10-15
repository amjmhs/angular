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
var trustedEmptyColor;
var trustedGreyColor;
var TableComponent = /** @class */ (function () {
    function TableComponent() {
        this.data = util_1.emptyTable;
    }
    TableComponent.prototype.trackByIndex = function (index, item) { return index; };
    TableComponent.prototype.getColor = function (row) { return row % 2 ? trustedEmptyColor : trustedGreyColor; };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], TableComponent.prototype, "data", void 0);
    TableComponent = __decorate([
        core_1.Component({
            selector: 'largetable',
            template: "<table><tbody>\n    <tr *ngFor=\"let row of data; trackBy: trackByIndex\">\n      <td *ngFor=\"let cell of row; trackBy: trackByIndex\" [style.backgroundColor]=\"getColor(cell.row)\">\n      {{cell.value}}\n      </td>\n    </tr>\n  </tbody></table>",
        })
    ], TableComponent);
    return TableComponent;
}());
exports.TableComponent = TableComponent;
var AppModule = /** @class */ (function () {
    function AppModule(sanitizer) {
        trustedEmptyColor = sanitizer.bypassSecurityTrustStyle('');
        trustedGreyColor = sanitizer.bypassSecurityTrustStyle('grey');
    }
    AppModule = __decorate([
        core_1.NgModule({ imports: [platform_browser_1.BrowserModule], bootstrap: [TableComponent], declarations: [TableComponent] }),
        __metadata("design:paramtypes", [platform_browser_1.DomSanitizer])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2JlbmNobWFya3Mvc3JjL2xhcmdldGFibGUvbmcyL3RhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsc0NBQXlEO0FBQ3pELDhEQUFpRjtBQUVqRixnQ0FBOEM7QUFFOUMsSUFBSSxpQkFBNEIsQ0FBQztBQUNqQyxJQUFJLGdCQUEyQixDQUFDO0FBWWhDO0lBVkE7UUFZRSxTQUFJLEdBQWtCLGlCQUFVLENBQUM7SUFLbkMsQ0FBQztJQUhDLHFDQUFZLEdBQVosVUFBYSxLQUFhLEVBQUUsSUFBUyxJQUFJLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQztJQUV4RCxpQ0FBUSxHQUFSLFVBQVMsR0FBVyxJQUFJLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztJQUpoRjtRQURDLFlBQUssRUFBRTs7Z0RBQ3lCO0lBRnRCLGNBQWM7UUFWMUIsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxZQUFZO1lBQ3RCLFFBQVEsRUFBRSwyUEFNTztTQUNsQixDQUFDO09BQ1csY0FBYyxDQU8xQjtJQUFELHFCQUFDO0NBQUEsQUFQRCxJQU9DO0FBUFksd0NBQWM7QUFVM0I7SUFDRSxtQkFBWSxTQUF1QjtRQUNqQyxpQkFBaUIsR0FBRyxTQUFTLENBQUMsd0JBQXdCLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDM0QsZ0JBQWdCLEdBQUcsU0FBUyxDQUFDLHdCQUF3QixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFKVSxTQUFTO1FBRHJCLGVBQVEsQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLGdDQUFhLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxjQUFjLENBQUMsRUFBRSxZQUFZLEVBQUUsQ0FBQyxjQUFjLENBQUMsRUFBQyxDQUFDO3lDQUV6RSwrQkFBWTtPQUR4QixTQUFTLENBS3JCO0lBQUQsZ0JBQUM7Q0FBQSxBQUxELElBS0M7QUFMWSw4QkFBUyJ9