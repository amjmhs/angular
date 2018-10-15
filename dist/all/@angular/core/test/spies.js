"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var change_detection_1 = require("@angular/core/src/change_detection/change_detection");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var SpyChangeDetectorRef = /** @class */ (function (_super) {
    __extends(SpyChangeDetectorRef, _super);
    function SpyChangeDetectorRef() {
        var _this = _super.call(this, change_detection_1.ChangeDetectorRef) || this;
        _this.spy('detectChanges');
        _this.spy('checkNoChanges');
        return _this;
    }
    return SpyChangeDetectorRef;
}(testing_internal_1.SpyObject));
exports.SpyChangeDetectorRef = SpyChangeDetectorRef;
var SpyIterableDifferFactory = /** @class */ (function (_super) {
    __extends(SpyIterableDifferFactory, _super);
    function SpyIterableDifferFactory() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SpyIterableDifferFactory;
}(testing_internal_1.SpyObject));
exports.SpyIterableDifferFactory = SpyIterableDifferFactory;
var SpyElementRef = /** @class */ (function (_super) {
    __extends(SpyElementRef, _super);
    function SpyElementRef() {
        return _super.call(this, core_1.ElementRef) || this;
    }
    return SpyElementRef;
}(testing_internal_1.SpyObject));
exports.SpyElementRef = SpyElementRef;
var SpyDomAdapter = /** @class */ (function (_super) {
    __extends(SpyDomAdapter, _super);
    function SpyDomAdapter() {
        return _super.call(this, dom_adapter_1.DomAdapter) || this;
    }
    return SpyDomAdapter;
}(testing_internal_1.SpyObject));
exports.SpyDomAdapter = SpyDomAdapter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BpZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3Qvc3BpZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0FBRUgsc0NBQXlDO0FBQ3pDLHdGQUFzRjtBQUN0RiwrRUFBcUU7QUFDckUsNkVBQXlFO0FBRXpFO0lBQTBDLHdDQUFTO0lBQ2pEO1FBQUEsWUFDRSxrQkFBTSxvQ0FBaUIsQ0FBQyxTQUd6QjtRQUZDLEtBQUksQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDMUIsS0FBSSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOztJQUM3QixDQUFDO0lBQ0gsMkJBQUM7QUFBRCxDQUFDLEFBTkQsQ0FBMEMsNEJBQVMsR0FNbEQ7QUFOWSxvREFBb0I7QUFRakM7SUFBOEMsNENBQVM7SUFBdkQ7O0lBQXlELENBQUM7SUFBRCwrQkFBQztBQUFELENBQUMsQUFBMUQsQ0FBOEMsNEJBQVMsR0FBRztBQUE3Qyw0REFBd0I7QUFFckM7SUFBbUMsaUNBQVM7SUFDMUM7ZUFBZ0Isa0JBQU0saUJBQVUsQ0FBQztJQUFFLENBQUM7SUFDdEMsb0JBQUM7QUFBRCxDQUFDLEFBRkQsQ0FBbUMsNEJBQVMsR0FFM0M7QUFGWSxzQ0FBYTtBQUkxQjtJQUFtQyxpQ0FBUztJQUMxQztlQUFnQixrQkFBTSx3QkFBVSxDQUFDO0lBQUUsQ0FBQztJQUN0QyxvQkFBQztBQUFELENBQUMsQUFGRCxDQUFtQyw0QkFBUyxHQUUzQztBQUZZLHNDQUFhIn0=