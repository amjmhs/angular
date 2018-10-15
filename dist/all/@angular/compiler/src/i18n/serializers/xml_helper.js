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
var _Visitor = /** @class */ (function () {
    function _Visitor() {
    }
    _Visitor.prototype.visitTag = function (tag) {
        var _this = this;
        var strAttrs = this._serializeAttributes(tag.attrs);
        if (tag.children.length == 0) {
            return "<" + tag.name + strAttrs + "/>";
        }
        var strChildren = tag.children.map(function (node) { return node.visit(_this); });
        return "<" + tag.name + strAttrs + ">" + strChildren.join('') + "</" + tag.name + ">";
    };
    _Visitor.prototype.visitText = function (text) { return text.value; };
    _Visitor.prototype.visitDeclaration = function (decl) {
        return "<?xml" + this._serializeAttributes(decl.attrs) + " ?>";
    };
    _Visitor.prototype._serializeAttributes = function (attrs) {
        var strAttrs = Object.keys(attrs).map(function (name) { return name + "=\"" + attrs[name] + "\""; }).join(' ');
        return strAttrs.length > 0 ? ' ' + strAttrs : '';
    };
    _Visitor.prototype.visitDoctype = function (doctype) {
        return "<!DOCTYPE " + doctype.rootTag + " [\n" + doctype.dtd + "\n]>";
    };
    return _Visitor;
}());
var _visitor = new _Visitor();
function serialize(nodes) {
    return nodes.map(function (node) { return node.visit(_visitor); }).join('');
}
exports.serialize = serialize;
var Declaration = /** @class */ (function () {
    function Declaration(unescapedAttrs) {
        var _this = this;
        this.attrs = {};
        Object.keys(unescapedAttrs).forEach(function (k) {
            _this.attrs[k] = escapeXml(unescapedAttrs[k]);
        });
    }
    Declaration.prototype.visit = function (visitor) { return visitor.visitDeclaration(this); };
    return Declaration;
}());
exports.Declaration = Declaration;
var Doctype = /** @class */ (function () {
    function Doctype(rootTag, dtd) {
        this.rootTag = rootTag;
        this.dtd = dtd;
    }
    Doctype.prototype.visit = function (visitor) { return visitor.visitDoctype(this); };
    return Doctype;
}());
exports.Doctype = Doctype;
var Tag = /** @class */ (function () {
    function Tag(name, unescapedAttrs, children) {
        if (unescapedAttrs === void 0) { unescapedAttrs = {}; }
        if (children === void 0) { children = []; }
        var _this = this;
        this.name = name;
        this.children = children;
        this.attrs = {};
        Object.keys(unescapedAttrs).forEach(function (k) {
            _this.attrs[k] = escapeXml(unescapedAttrs[k]);
        });
    }
    Tag.prototype.visit = function (visitor) { return visitor.visitTag(this); };
    return Tag;
}());
exports.Tag = Tag;
var Text = /** @class */ (function () {
    function Text(unescapedValue) {
        this.value = escapeXml(unescapedValue);
    }
    Text.prototype.visit = function (visitor) { return visitor.visitText(this); };
    return Text;
}());
exports.Text = Text;
var CR = /** @class */ (function (_super) {
    __extends(CR, _super);
    function CR(ws) {
        if (ws === void 0) { ws = 0; }
        return _super.call(this, "\n" + new Array(ws + 1).join(' ')) || this;
    }
    return CR;
}(Text));
exports.CR = CR;
var _ESCAPED_CHARS = [
    [/&/g, '&amp;'],
    [/"/g, '&quot;'],
    [/'/g, '&apos;'],
    [/</g, '&lt;'],
    [/>/g, '&gt;'],
];
// Escape `_ESCAPED_CHARS` characters in the given text with encoded entities
function escapeXml(text) {
    return _ESCAPED_CHARS.reduce(function (text, entry) { return text.replace(entry[0], entry[1]); }, text);
}
exports.escapeXml = escapeXml;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieG1sX2hlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9pMThuL3NlcmlhbGl6ZXJzL3htbF9oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0FBU0g7SUFBQTtJQTBCQSxDQUFDO0lBekJDLDJCQUFRLEdBQVIsVUFBUyxHQUFRO1FBQWpCLGlCQVNDO1FBUkMsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV0RCxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtZQUM1QixPQUFPLE1BQUksR0FBRyxDQUFDLElBQUksR0FBRyxRQUFRLE9BQUksQ0FBQztTQUNwQztRQUVELElBQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFJLENBQUMsRUFBaEIsQ0FBZ0IsQ0FBQyxDQUFDO1FBQy9ELE9BQU8sTUFBSSxHQUFHLENBQUMsSUFBSSxHQUFHLFFBQVEsU0FBSSxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFLLEdBQUcsQ0FBQyxJQUFJLE1BQUcsQ0FBQztJQUN6RSxDQUFDO0lBRUQsNEJBQVMsR0FBVCxVQUFVLElBQVUsSUFBWSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBRXBELG1DQUFnQixHQUFoQixVQUFpQixJQUFpQjtRQUNoQyxPQUFPLFVBQVEsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBSyxDQUFDO0lBQzVELENBQUM7SUFFTyx1Q0FBb0IsR0FBNUIsVUFBNkIsS0FBNEI7UUFDdkQsSUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQyxJQUFZLElBQUssT0FBRyxJQUFJLFdBQUssS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFHLEVBQTFCLENBQTBCLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDaEcsT0FBTyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ25ELENBQUM7SUFFRCwrQkFBWSxHQUFaLFVBQWEsT0FBZ0I7UUFDM0IsT0FBTyxlQUFhLE9BQU8sQ0FBQyxPQUFPLFlBQU8sT0FBTyxDQUFDLEdBQUcsU0FBTSxDQUFDO0lBQzlELENBQUM7SUFDSCxlQUFDO0FBQUQsQ0FBQyxBQTFCRCxJQTBCQztBQUVELElBQU0sUUFBUSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7QUFFaEMsbUJBQTBCLEtBQWE7SUFDckMsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUMsSUFBVSxJQUFhLE9BQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBcEIsQ0FBb0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUMxRSxDQUFDO0FBRkQsOEJBRUM7QUFJRDtJQUdFLHFCQUFZLGNBQXFDO1FBQWpELGlCQUlDO1FBTk0sVUFBSyxHQUEwQixFQUFFLENBQUM7UUFHdkMsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFTO1lBQzVDLEtBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9DLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELDJCQUFLLEdBQUwsVUFBTSxPQUFpQixJQUFTLE9BQU8sT0FBTyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxRSxrQkFBQztBQUFELENBQUMsQUFWRCxJQVVDO0FBVlksa0NBQVc7QUFZeEI7SUFDRSxpQkFBbUIsT0FBZSxFQUFTLEdBQVc7UUFBbkMsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUFTLFFBQUcsR0FBSCxHQUFHLENBQVE7SUFBRyxDQUFDO0lBRTFELHVCQUFLLEdBQUwsVUFBTSxPQUFpQixJQUFTLE9BQU8sT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEUsY0FBQztBQUFELENBQUMsQUFKRCxJQUlDO0FBSlksMEJBQU87QUFNcEI7SUFHRSxhQUNXLElBQVksRUFBRSxjQUEwQyxFQUN4RCxRQUFxQjtRQURQLCtCQUFBLEVBQUEsbUJBQTBDO1FBQ3hELHlCQUFBLEVBQUEsYUFBcUI7UUFGaEMsaUJBTUM7UUFMVSxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQ1osYUFBUSxHQUFSLFFBQVEsQ0FBYTtRQUp6QixVQUFLLEdBQTBCLEVBQUUsQ0FBQztRQUt2QyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQVM7WUFDNUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0MsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsbUJBQUssR0FBTCxVQUFNLE9BQWlCLElBQVMsT0FBTyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRSxVQUFDO0FBQUQsQ0FBQyxBQVpELElBWUM7QUFaWSxrQkFBRztBQWNoQjtJQUVFLGNBQVksY0FBc0I7UUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUFDLENBQUM7SUFFL0Usb0JBQUssR0FBTCxVQUFNLE9BQWlCLElBQVMsT0FBTyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuRSxXQUFDO0FBQUQsQ0FBQyxBQUxELElBS0M7QUFMWSxvQkFBSTtBQU9qQjtJQUF3QixzQkFBSTtJQUMxQixZQUFZLEVBQWM7UUFBZCxtQkFBQSxFQUFBLE1BQWM7ZUFBSSxrQkFBTSxPQUFLLElBQUksS0FBSyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFHLENBQUM7SUFBRSxDQUFDO0lBQzVFLFNBQUM7QUFBRCxDQUFDLEFBRkQsQ0FBd0IsSUFBSSxHQUUzQjtBQUZZLGdCQUFFO0FBSWYsSUFBTSxjQUFjLEdBQXVCO0lBQ3pDLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQztJQUNmLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQztJQUNoQixDQUFDLElBQUksRUFBRSxRQUFRLENBQUM7SUFDaEIsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDO0lBQ2QsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDO0NBQ2YsQ0FBQztBQUVGLDZFQUE2RTtBQUM3RSxtQkFBMEIsSUFBWTtJQUNwQyxPQUFPLGNBQWMsQ0FBQyxNQUFNLENBQ3hCLFVBQUMsSUFBWSxFQUFFLEtBQXVCLElBQUssT0FBQSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBaEMsQ0FBZ0MsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN6RixDQUFDO0FBSEQsOEJBR0MifQ==