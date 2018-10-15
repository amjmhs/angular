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
var html_tags_1 = require("./html_tags");
var interpolation_config_1 = require("./interpolation_config");
var parser_1 = require("./parser");
var parser_2 = require("./parser");
exports.ParseTreeResult = parser_2.ParseTreeResult;
exports.TreeError = parser_2.TreeError;
var HtmlParser = /** @class */ (function (_super) {
    __extends(HtmlParser, _super);
    function HtmlParser() {
        return _super.call(this, html_tags_1.getHtmlTagDefinition) || this;
    }
    HtmlParser.prototype.parse = function (source, url, parseExpansionForms, interpolationConfig) {
        if (parseExpansionForms === void 0) { parseExpansionForms = false; }
        if (interpolationConfig === void 0) { interpolationConfig = interpolation_config_1.DEFAULT_INTERPOLATION_CONFIG; }
        return _super.prototype.parse.call(this, source, url, parseExpansionForms, interpolationConfig);
    };
    return HtmlParser;
}(parser_1.Parser));
exports.HtmlParser = HtmlParser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbF9wYXJzZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvbWxfcGFyc2VyL2h0bWxfcGFyc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztBQUVILHlDQUFpRDtBQUNqRCwrREFBeUY7QUFDekYsbUNBQWlEO0FBRWpELG1DQUFvRDtBQUE1QyxtQ0FBQSxlQUFlLENBQUE7QUFBRSw2QkFBQSxTQUFTLENBQUE7QUFFbEM7SUFBZ0MsOEJBQU07SUFDcEM7ZUFBZ0Isa0JBQU0sZ0NBQW9CLENBQUM7SUFBRSxDQUFDO0lBRTlDLDBCQUFLLEdBQUwsVUFDSSxNQUFjLEVBQUUsR0FBVyxFQUFFLG1CQUFvQyxFQUNqRSxtQkFBdUU7UUFEMUMsb0NBQUEsRUFBQSwyQkFBb0M7UUFDakUsb0NBQUEsRUFBQSxzQkFBMkMsbURBQTRCO1FBQ3pFLE9BQU8saUJBQU0sS0FBSyxZQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsbUJBQW1CLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBQ0gsaUJBQUM7QUFBRCxDQUFDLEFBUkQsQ0FBZ0MsZUFBTSxHQVFyQztBQVJZLGdDQUFVIn0=