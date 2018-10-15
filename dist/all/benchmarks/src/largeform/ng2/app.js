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
var forms_1 = require("@angular/forms");
var platform_browser_1 = require("@angular/platform-browser");
var AppComponent = /** @class */ (function () {
    function AppComponent() {
        this.copies = [];
        this.values = [];
        for (var i = 0; i < 50; i++) {
            this.values[i] = "someValue" + i;
        }
    }
    AppComponent.prototype.setCopies = function (count) {
        this.copies = [];
        for (var i = 0; i < count; i++) {
            this.copies.push(i);
        }
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app',
            template: "<form *ngFor=\"let copy of copies\">\n<input type=\"text\" [(ngModel)]=\"values[0]\" name=\"value0\">\n<input type=\"text\" [(ngModel)]=\"values[1]\" name=\"value1\">\n<input type=\"text\" [(ngModel)]=\"values[2]\" name=\"value2\">\n<input type=\"text\" [(ngModel)]=\"values[3]\" name=\"value3\">\n<input type=\"text\" [(ngModel)]=\"values[4]\" name=\"value4\">\n<input type=\"text\" [(ngModel)]=\"values[5]\" name=\"value5\">\n<input type=\"text\" [(ngModel)]=\"values[6]\" name=\"value6\">\n<input type=\"text\" [(ngModel)]=\"values[7]\" name=\"value7\">\n<input type=\"text\" [(ngModel)]=\"values[8]\" name=\"value8\">\n<input type=\"text\" [(ngModel)]=\"values[9]\" name=\"value9\">\n<input type=\"text\" [(ngModel)]=\"values[10]\" name=\"value10\">\n<input type=\"text\" [(ngModel)]=\"values[11]\" name=\"value11\">\n<input type=\"text\" [(ngModel)]=\"values[12]\" name=\"value12\">\n<input type=\"text\" [(ngModel)]=\"values[13]\" name=\"value13\">\n<input type=\"text\" [(ngModel)]=\"values[14]\" name=\"value14\">\n<input type=\"text\" [(ngModel)]=\"values[15]\" name=\"value15\">\n<input type=\"text\" [(ngModel)]=\"values[16]\" name=\"value16\">\n<input type=\"text\" [(ngModel)]=\"values[17]\" name=\"value17\">\n<input type=\"text\" [(ngModel)]=\"values[18]\" name=\"value18\">\n<input type=\"text\" [(ngModel)]=\"values[19]\" name=\"value19\">\n<input type=\"text\" [(ngModel)]=\"values[20]\" name=\"value20\">\n<input type=\"text\" [(ngModel)]=\"values[21]\" name=\"value21\">\n<input type=\"text\" [(ngModel)]=\"values[22]\" name=\"value22\">\n<input type=\"text\" [(ngModel)]=\"values[23]\" name=\"value23\">\n<input type=\"text\" [(ngModel)]=\"values[24]\" name=\"value24\">\n<input type=\"text\" [(ngModel)]=\"values[25]\" name=\"value25\">\n<input type=\"text\" [(ngModel)]=\"values[26]\" name=\"value26\">\n<input type=\"text\" [(ngModel)]=\"values[27]\" name=\"value27\">\n<input type=\"text\" [(ngModel)]=\"values[28]\" name=\"value28\">\n<input type=\"text\" [(ngModel)]=\"values[29]\" name=\"value29\">\n<input type=\"text\" [(ngModel)]=\"values[30]\" name=\"value30\">\n<input type=\"text\" [(ngModel)]=\"values[31]\" name=\"value31\">\n<input type=\"text\" [(ngModel)]=\"values[32]\" name=\"value32\">\n<input type=\"text\" [(ngModel)]=\"values[33]\" name=\"value33\">\n<input type=\"text\" [(ngModel)]=\"values[34]\" name=\"value34\">\n<input type=\"text\" [(ngModel)]=\"values[35]\" name=\"value35\">\n<input type=\"text\" [(ngModel)]=\"values[36]\" name=\"value36\">\n<input type=\"text\" [(ngModel)]=\"values[37]\" name=\"value37\">\n<input type=\"text\" [(ngModel)]=\"values[38]\" name=\"value38\">\n<input type=\"text\" [(ngModel)]=\"values[39]\" name=\"value39\">\n<input type=\"text\" [(ngModel)]=\"values[40]\" name=\"value40\">\n<input type=\"text\" [(ngModel)]=\"values[41]\" name=\"value41\">\n<input type=\"text\" [(ngModel)]=\"values[42]\" name=\"value42\">\n<input type=\"text\" [(ngModel)]=\"values[43]\" name=\"value43\">\n<input type=\"text\" [(ngModel)]=\"values[44]\" name=\"value44\">\n<input type=\"text\" [(ngModel)]=\"values[45]\" name=\"value45\">\n<input type=\"text\" [(ngModel)]=\"values[46]\" name=\"value46\">\n<input type=\"text\" [(ngModel)]=\"values[47]\" name=\"value47\">\n<input type=\"text\" [(ngModel)]=\"values[48]\" name=\"value48\">\n<input type=\"text\" [(ngModel)]=\"values[49]\" name=\"value49\">\n</form>"
        }),
        __metadata("design:paramtypes", [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule, forms_1.FormsModule],
            bootstrap: [AppComponent],
            declarations: [AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9iZW5jaG1hcmtzL3NyYy9sYXJnZWZvcm0vbmcyL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUVILHNDQUFrRDtBQUNsRCx3Q0FBMkM7QUFDM0MsOERBQXdEO0FBeUR4RDtJQUdFO1FBRkEsV0FBTSxHQUFhLEVBQUUsQ0FBQztRQUN0QixXQUFNLEdBQWEsRUFBRSxDQUFDO1FBRXBCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDM0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxjQUFZLENBQUcsQ0FBQztTQUNsQztJQUNILENBQUM7SUFFRCxnQ0FBUyxHQUFULFVBQVUsS0FBYTtRQUNyQixJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNqQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3JCO0lBQ0gsQ0FBQztJQWRVLFlBQVk7UUF2RHhCLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsS0FBSztZQUNmLFFBQVEsRUFBRSxpekdBbURKO1NBQ1AsQ0FBQzs7T0FDVyxZQUFZLENBZXhCO0lBQUQsbUJBQUM7Q0FBQSxBQWZELElBZUM7QUFmWSxvQ0FBWTtBQXNCekI7SUFBQTtJQUNBLENBQUM7SUFEWSxTQUFTO1FBTHJCLGVBQVEsQ0FBQztZQUNSLE9BQU8sRUFBRSxDQUFDLGdDQUFhLEVBQUUsbUJBQVcsQ0FBQztZQUNyQyxTQUFTLEVBQUUsQ0FBQyxZQUFZLENBQUM7WUFDekIsWUFBWSxFQUFFLENBQUMsWUFBWSxDQUFDO1NBQzdCLENBQUM7T0FDVyxTQUFTLENBQ3JCO0lBQUQsZ0JBQUM7Q0FBQSxBQURELElBQ0M7QUFEWSw4QkFBUyJ9