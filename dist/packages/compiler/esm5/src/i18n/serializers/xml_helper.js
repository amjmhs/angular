/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
/**
 * @record
 */
export function IVisitor() { }
/** @type {?} */
IVisitor.prototype.visitTag;
/** @type {?} */
IVisitor.prototype.visitText;
/** @type {?} */
IVisitor.prototype.visitDeclaration;
/** @type {?} */
IVisitor.prototype.visitDoctype;
var _Visitor = /** @class */ (function () {
    function _Visitor() {
    }
    /**
     * @param {?} tag
     * @return {?}
     */
    _Visitor.prototype.visitTag = /**
     * @param {?} tag
     * @return {?}
     */
    function (tag) {
        var _this = this;
        /** @type {?} */
        var strAttrs = this._serializeAttributes(tag.attrs);
        if (tag.children.length == 0) {
            return "<" + tag.name + strAttrs + "/>";
        }
        /** @type {?} */
        var strChildren = tag.children.map(function (node) { return node.visit(_this); });
        return "<" + tag.name + strAttrs + ">" + strChildren.join('') + "</" + tag.name + ">";
    };
    /**
     * @param {?} text
     * @return {?}
     */
    _Visitor.prototype.visitText = /**
     * @param {?} text
     * @return {?}
     */
    function (text) { return text.value; };
    /**
     * @param {?} decl
     * @return {?}
     */
    _Visitor.prototype.visitDeclaration = /**
     * @param {?} decl
     * @return {?}
     */
    function (decl) {
        return "<?xml" + this._serializeAttributes(decl.attrs) + " ?>";
    };
    /**
     * @param {?} attrs
     * @return {?}
     */
    _Visitor.prototype._serializeAttributes = /**
     * @param {?} attrs
     * @return {?}
     */
    function (attrs) {
        /** @type {?} */
        var strAttrs = Object.keys(attrs).map(function (name) { return name + "=\"" + attrs[name] + "\""; }).join(' ');
        return strAttrs.length > 0 ? ' ' + strAttrs : '';
    };
    /**
     * @param {?} doctype
     * @return {?}
     */
    _Visitor.prototype.visitDoctype = /**
     * @param {?} doctype
     * @return {?}
     */
    function (doctype) {
        return "<!DOCTYPE " + doctype.rootTag + " [\n" + doctype.dtd + "\n]>";
    };
    return _Visitor;
}());
/** @type {?} */
var _visitor = new _Visitor();
/**
 * @param {?} nodes
 * @return {?}
 */
export function serialize(nodes) {
    return nodes.map(function (node) { return node.visit(_visitor); }).join('');
}
/**
 * @record
 */
export function Node() { }
/** @type {?} */
Node.prototype.visit;
var Declaration = /** @class */ (function () {
    function Declaration(unescapedAttrs) {
        var _this = this;
        this.attrs = {};
        Object.keys(unescapedAttrs).forEach(function (k) {
            _this.attrs[k] = escapeXml(unescapedAttrs[k]);
        });
    }
    /**
     * @param {?} visitor
     * @return {?}
     */
    Declaration.prototype.visit = /**
     * @param {?} visitor
     * @return {?}
     */
    function (visitor) { return visitor.visitDeclaration(this); };
    return Declaration;
}());
export { Declaration };
if (false) {
    /** @type {?} */
    Declaration.prototype.attrs;
}
var Doctype = /** @class */ (function () {
    function Doctype(rootTag, dtd) {
        this.rootTag = rootTag;
        this.dtd = dtd;
    }
    /**
     * @param {?} visitor
     * @return {?}
     */
    Doctype.prototype.visit = /**
     * @param {?} visitor
     * @return {?}
     */
    function (visitor) { return visitor.visitDoctype(this); };
    return Doctype;
}());
export { Doctype };
if (false) {
    /** @type {?} */
    Doctype.prototype.rootTag;
    /** @type {?} */
    Doctype.prototype.dtd;
}
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
    /**
     * @param {?} visitor
     * @return {?}
     */
    Tag.prototype.visit = /**
     * @param {?} visitor
     * @return {?}
     */
    function (visitor) { return visitor.visitTag(this); };
    return Tag;
}());
export { Tag };
if (false) {
    /** @type {?} */
    Tag.prototype.attrs;
    /** @type {?} */
    Tag.prototype.name;
    /** @type {?} */
    Tag.prototype.children;
}
var Text = /** @class */ (function () {
    function Text(unescapedValue) {
        this.value = escapeXml(unescapedValue);
    }
    /**
     * @param {?} visitor
     * @return {?}
     */
    Text.prototype.visit = /**
     * @param {?} visitor
     * @return {?}
     */
    function (visitor) { return visitor.visitText(this); };
    return Text;
}());
export { Text };
if (false) {
    /** @type {?} */
    Text.prototype.value;
}
var CR = /** @class */ (function (_super) {
    tslib_1.__extends(CR, _super);
    function CR(ws) {
        if (ws === void 0) { ws = 0; }
        return _super.call(this, "\n" + new Array(ws + 1).join(' ')) || this;
    }
    return CR;
}(Text));
export { CR };
/** @type {?} */
var _ESCAPED_CHARS = [
    [/&/g, '&amp;'],
    [/"/g, '&quot;'],
    [/'/g, '&apos;'],
    [/</g, '&lt;'],
    [/>/g, '&gt;'],
];
/**
 * @param {?} text
 * @return {?}
 */
export function escapeXml(text) {
    return _ESCAPED_CHARS.reduce(function (text, entry) { return text.replace(entry[0], entry[1]); }, text);
}
//# sourceMappingURL=xml_helper.js.map