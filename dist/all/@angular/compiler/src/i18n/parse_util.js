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
var parse_util_1 = require("../parse_util");
/**
 * An i18n error.
 */
var I18nError = /** @class */ (function (_super) {
    __extends(I18nError, _super);
    function I18nError(span, msg) {
        return _super.call(this, span, msg) || this;
    }
    return I18nError;
}(parse_util_1.ParseError));
exports.I18nError = I18nError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VfdXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9pMThuL3BhcnNlX3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0FBRUgsNENBQTBEO0FBRTFEOztHQUVHO0FBQ0g7SUFBK0IsNkJBQVU7SUFDdkMsbUJBQVksSUFBcUIsRUFBRSxHQUFXO2VBQUksa0JBQU0sSUFBSSxFQUFFLEdBQUcsQ0FBQztJQUFFLENBQUM7SUFDdkUsZ0JBQUM7QUFBRCxDQUFDLEFBRkQsQ0FBK0IsdUJBQVUsR0FFeEM7QUFGWSw4QkFBUyJ9