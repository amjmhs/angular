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
var change_detector_ref_1 = require("@angular/core/src/change_detection/change_detector_ref");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var SpyChangeDetectorRef = /** @class */ (function (_super) {
    __extends(SpyChangeDetectorRef, _super);
    function SpyChangeDetectorRef() {
        var _this = _super.call(this, change_detector_ref_1.ChangeDetectorRef) || this;
        _this.spy('markForCheck');
        return _this;
    }
    return SpyChangeDetectorRef;
}(testing_internal_1.SpyObject));
exports.SpyChangeDetectorRef = SpyChangeDetectorRef;
var SpyNgControl = /** @class */ (function (_super) {
    __extends(SpyNgControl, _super);
    function SpyNgControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.path = [];
        return _this;
    }
    return SpyNgControl;
}(testing_internal_1.SpyObject));
exports.SpyNgControl = SpyNgControl;
var SpyValueAccessor = /** @class */ (function (_super) {
    __extends(SpyValueAccessor, _super);
    function SpyValueAccessor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SpyValueAccessor;
}(testing_internal_1.SpyObject));
exports.SpyValueAccessor = SpyValueAccessor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BpZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy90ZXN0L3NwaWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztBQUVILDhGQUF5RjtBQUN6RiwrRUFBcUU7QUFFckU7SUFBMEMsd0NBQVM7SUFDakQ7UUFBQSxZQUNFLGtCQUFNLHVDQUFpQixDQUFDLFNBRXpCO1FBREMsS0FBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQzs7SUFDM0IsQ0FBQztJQUNILDJCQUFDO0FBQUQsQ0FBQyxBQUxELENBQTBDLDRCQUFTLEdBS2xEO0FBTFksb0RBQW9CO0FBT2pDO0lBQWtDLGdDQUFTO0lBQTNDO1FBQUEscUVBQTBEO1FBQVosVUFBSSxHQUFHLEVBQUUsQ0FBQzs7SUFBQyxDQUFDO0lBQUQsbUJBQUM7QUFBRCxDQUFDLEFBQTFELENBQWtDLDRCQUFTLEdBQWU7QUFBN0Msb0NBQVk7QUFFekI7SUFBc0Msb0NBQVM7SUFBL0M7O0lBQW1FLENBQUM7SUFBRCx1QkFBQztBQUFELENBQUMsQUFBcEUsQ0FBc0MsNEJBQVMsR0FBcUI7QUFBdkQsNENBQWdCIn0=