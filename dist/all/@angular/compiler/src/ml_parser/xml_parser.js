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
var parser_1 = require("./parser");
var xml_tags_1 = require("./xml_tags");
var parser_2 = require("./parser");
exports.ParseTreeResult = parser_2.ParseTreeResult;
exports.TreeError = parser_2.TreeError;
var XmlParser = /** @class */ (function (_super) {
    __extends(XmlParser, _super);
    function XmlParser() {
        return _super.call(this, xml_tags_1.getXmlTagDefinition) || this;
    }
    XmlParser.prototype.parse = function (source, url, parseExpansionForms) {
        if (parseExpansionForms === void 0) { parseExpansionForms = false; }
        return _super.prototype.parse.call(this, source, url, parseExpansionForms);
    };
    return XmlParser;
}(parser_1.Parser));
exports.XmlParser = XmlParser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieG1sX3BhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9tbF9wYXJzZXIveG1sX3BhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCxtQ0FBaUQ7QUFDakQsdUNBQStDO0FBRS9DLG1DQUFvRDtBQUE1QyxtQ0FBQSxlQUFlLENBQUE7QUFBRSw2QkFBQSxTQUFTLENBQUE7QUFFbEM7SUFBK0IsNkJBQU07SUFDbkM7ZUFBZ0Isa0JBQU0sOEJBQW1CLENBQUM7SUFBRSxDQUFDO0lBRTdDLHlCQUFLLEdBQUwsVUFBTSxNQUFjLEVBQUUsR0FBVyxFQUFFLG1CQUFvQztRQUFwQyxvQ0FBQSxFQUFBLDJCQUFvQztRQUNyRSxPQUFPLGlCQUFNLEtBQUssWUFBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLG1CQUFtQixDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUNILGdCQUFDO0FBQUQsQ0FBQyxBQU5ELENBQStCLGVBQU0sR0FNcEM7QUFOWSw4QkFBUyJ9