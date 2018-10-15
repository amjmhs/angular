"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var html_parser_1 = require("@angular/compiler/src/ml_parser/html_parser");
var html_tags_1 = require("@angular/compiler/src/ml_parser/html_tags");
{
    describe('Node serializer', function () {
        var parser;
        beforeEach(function () { parser = new html_parser_1.HtmlParser(); });
        it('should support element', function () {
            var html = '<p></p>';
            var ast = parser.parse(html, 'url');
            expect(serializeNodes(ast.rootNodes)).toEqual([html]);
        });
        it('should support attributes', function () {
            var html = '<p k="value"></p>';
            var ast = parser.parse(html, 'url');
            expect(serializeNodes(ast.rootNodes)).toEqual([html]);
        });
        it('should support text', function () {
            var html = 'some text';
            var ast = parser.parse(html, 'url');
            expect(serializeNodes(ast.rootNodes)).toEqual([html]);
        });
        it('should support expansion', function () {
            var html = '{number, plural, =0 {none} =1 {one} other {many}}';
            var ast = parser.parse(html, 'url', true);
            expect(serializeNodes(ast.rootNodes)).toEqual([html]);
        });
        it('should support comment', function () {
            var html = '<!--comment-->';
            var ast = parser.parse(html, 'url', true);
            expect(serializeNodes(ast.rootNodes)).toEqual([html]);
        });
        it('should support nesting', function () {
            var html = "<div i18n=\"meaning|desc\">\n        <span>{{ interpolation }}</span>\n        <!--comment-->\n        <p expansion=\"true\">\n          {number, plural, =0 {{sex, select, other {<b>?</b>}}}}\n        </p>                            \n      </div>";
            var ast = parser.parse(html, 'url', true);
            expect(serializeNodes(ast.rootNodes)).toEqual([html]);
        });
    });
}
var _SerializerVisitor = /** @class */ (function () {
    function _SerializerVisitor() {
    }
    _SerializerVisitor.prototype.visitElement = function (element, context) {
        if (html_tags_1.getHtmlTagDefinition(element.name).isVoid) {
            return "<" + element.name + this._visitAll(element.attrs, ' ') + "/>";
        }
        return "<" + element.name + this._visitAll(element.attrs, ' ') + ">" + this._visitAll(element.children) + "</" + element.name + ">";
    };
    _SerializerVisitor.prototype.visitAttribute = function (attribute, context) {
        return attribute.name + "=\"" + attribute.value + "\"";
    };
    _SerializerVisitor.prototype.visitText = function (text, context) { return text.value; };
    _SerializerVisitor.prototype.visitComment = function (comment, context) { return "<!--" + comment.value + "-->"; };
    _SerializerVisitor.prototype.visitExpansion = function (expansion, context) {
        return "{" + expansion.switchValue + ", " + expansion.type + "," + this._visitAll(expansion.cases) + "}";
    };
    _SerializerVisitor.prototype.visitExpansionCase = function (expansionCase, context) {
        return " " + expansionCase.value + " {" + this._visitAll(expansionCase.expression) + "}";
    };
    _SerializerVisitor.prototype._visitAll = function (nodes, join) {
        var _this = this;
        if (join === void 0) { join = ''; }
        if (nodes.length == 0) {
            return '';
        }
        return join + nodes.map(function (a) { return a.visit(_this, null); }).join(join);
    };
    return _SerializerVisitor;
}());
var serializerVisitor = new _SerializerVisitor();
function serializeNodes(nodes) {
    return nodes.map(function (node) { return node.visit(serializerVisitor, null); });
}
exports.serializeNodes = serializeNodes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN0X3NlcmlhbGl6ZXJfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3Rlc3QvbWxfcGFyc2VyL2FzdF9zZXJpYWxpemVyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFHSCwyRUFBdUU7QUFDdkUsdUVBQStFO0FBRS9FO0lBQ0UsUUFBUSxDQUFDLGlCQUFpQixFQUFFO1FBQzFCLElBQUksTUFBa0IsQ0FBQztRQUV2QixVQUFVLENBQUMsY0FBUSxNQUFNLEdBQUcsSUFBSSx3QkFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVqRCxFQUFFLENBQUMsd0JBQXdCLEVBQUU7WUFDM0IsSUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDO1lBQ3ZCLElBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3RDLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUN4RCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywyQkFBMkIsRUFBRTtZQUM5QixJQUFNLElBQUksR0FBRyxtQkFBbUIsQ0FBQztZQUNqQyxJQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN0QyxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDeEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMscUJBQXFCLEVBQUU7WUFDeEIsSUFBTSxJQUFJLEdBQUcsV0FBVyxDQUFDO1lBQ3pCLElBQU0sR0FBRyxHQUFHLE1BQU0s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