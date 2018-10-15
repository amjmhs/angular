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
var application_ref_1 = require("@angular/core/src/application_ref");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var SpyApplicationRef = /** @class */ (function (_super) {
    __extends(SpyApplicationRef, _super);
    function SpyApplicationRef() {
        return _super.call(this, application_ref_1.ApplicationRef) || this;
    }
    return SpyApplicationRef;
}(testing_internal_1.SpyObject));
exports.SpyApplicationRef = SpyApplicationRef;
var SpyComponentRef = /** @class */ (function (_super) {
    __extends(SpyComponentRef, _super);
    function SpyComponentRef() {
        var _this = _super.call(this) || this;
        _this.injector =
            core_1.Injector.create([{ provide: application_ref_1.ApplicationRef, useClass: SpyApplicationRef, deps: [] }]);
        return _this;
    }
    return SpyComponentRef;
}(testing_internal_1.SpyObject));
exports.SpyComponentRef = SpyComponentRef;
function callNgProfilerTimeChangeDetection(config /** TODO #9100 */) {
    core_1.ɵglobal.ng.profiler.timeChangeDetection(config);
}
exports.callNgProfilerTimeChangeDetection = callNgProfilerTimeChangeDetection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BpZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyL3Rlc3QvYnJvd3Nlci90b29scy9zcGllcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBMEQ7QUFDMUQscUVBQWlFO0FBQ2pFLCtFQUFxRTtBQUVyRTtJQUF1QyxxQ0FBUztJQUM5QztlQUFnQixrQkFBTSxnQ0FBYyxDQUFDO0lBQUUsQ0FBQztJQUMxQyx3QkFBQztBQUFELENBQUMsQUFGRCxDQUF1Qyw0QkFBUyxHQUUvQztBQUZZLDhDQUFpQjtBQUk5QjtJQUFxQyxtQ0FBUztJQUU1QztRQUFBLFlBQ0UsaUJBQU8sU0FHUjtRQUZDLEtBQUksQ0FBQyxRQUFRO1lBQ1QsZUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUMsT0FBTyxFQUFFLGdDQUFjLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFLElBQUksRUFBRSxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUM7O0lBQzFGLENBQUM7SUFDSCxzQkFBQztBQUFELENBQUMsQUFQRCxDQUFxQyw0QkFBUyxHQU83QztBQVBZLDBDQUFlO0FBUzVCLDJDQUFrRCxNQUFZLENBQUMsaUJBQWlCO0lBQ3hFLGNBQU8sQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3hELENBQUM7QUFGRCw4RUFFQyJ9