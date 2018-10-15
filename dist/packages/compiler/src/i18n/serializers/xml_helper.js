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
class _Visitor {
    /**
     * @param {?} tag
     * @return {?}
     */
    visitTag(tag) {
        /** @type {?} */
        const strAttrs = this._serializeAttributes(tag.attrs);
        if (tag.children.length == 0) {
            return `<${tag.name}${strAttrs}/>`;
        }
        /** @type {?} */
        const strChildren = tag.children.map(node => node.visit(this));
        return `<${tag.name}${strAttrs}>${strChildren.join('')}</${tag.name}>`;
    }
    /**
     * @param {?} text
     * @return {?}
     */
    visitText(text) { return text.value; }
    /**
     * @param {?} decl
     * @return {?}
     */
    visitDeclaration(decl) {
        return `<?xml${this._serializeAttributes(decl.attrs)} ?>`;
    }
    /**
     * @param {?} attrs
     * @return {?}
     */
    _serializeAttributes(attrs) {
        /** @type {?} */
        const strAttrs = Object.keys(attrs).map((name) => `${name}="${attrs[name]}"`).join(' ');
        return strAttrs.length > 0 ? ' ' + strAttrs : '';
    }
    /**
     * @param {?} doctype
     * @return {?}
     */
    visitDoctype(doctype) {
        return `<!DOCTYPE ${doctype.rootTag} [\n${doctype.dtd}\n]>`;
    }
}
/** @type {?} */
const _visitor = new _Visitor();
/**
 * @param {?} nodes
 * @return {?}
 */
export function serialize(nodes) {
    return nodes.map((node) => node.visit(_visitor)).join('');
}
/**
 * @record
 */
export function Node() { }
/** @type {?} */
Node.prototype.visit;
export class Declaration {
    /**
     * @param {?} unescapedAttrs
     */
    constructor(unescapedAttrs) {
        this.attrs = {};
        Object.keys(unescapedAttrs).forEach((k) => {
            this.attrs[k] = escapeXml(unescapedAttrs[k]);
        });
    }
    /**
     * @param {?} visitor
     * @return {?}
     */
    visit(visitor) { return visitor.visitDeclaration(this); }
}
if (false) {
    /** @type {?} */
    Declaration.prototype.attrs;
}
export class Doctype {
    /**
     * @param {?} rootTag
     * @param {?} dtd
     */
    constructor(rootTag, dtd) {
        this.rootTag = rootTag;
        this.dtd = dtd;
    }
    /**
     * @param {?} visitor
     * @return {?}
     */
    visit(visitor) { return visitor.visitDoctype(this); }
}
if (false) {
    /** @type {?} */
    Doctype.prototype.rootTag;
    /** @type {?} */
    Doctype.prototype.dtd;
}
export class Tag {
    /**
     * @param {?} name
     * @param {?=} unescapedAttrs
     * @param {?=} children
     */
    constructor(name, unescapedAttrs = {}, children = []) {
        this.name = name;
        this.children = children;
        this.attrs = {};
        Object.keys(unescapedAttrs).forEach((k) => {
            this.attrs[k] = escapeXml(unescapedAttrs[k]);
        });
    }
    /**
     * @param {?} visitor
     * @return {?}
     */
    visit(visitor) { return visitor.visitTag(this); }
}
if (false) {
    /** @type {?} */
    Tag.prototype.attrs;
    /** @type {?} */
    Tag.prototype.name;
    /** @type {?} */
    Tag.prototype.children;
}
export class Text {
    /**
     * @param {?} unescapedValue
     */
    constructor(unescapedValue) { this.value = escapeXml(unescapedValue); }
    /**
     * @param {?} visitor
     * @return {?}
     */
    visit(visitor) { return visitor.visitText(this); }
}
if (false) {
    /** @type {?} */
    Text.prototype.value;
}
export class CR extends Text {
    /**
     * @param {?=} ws
     */
    constructor(ws = 0) { super(`\n${new Array(ws + 1).join(' ')}`); }
}
/** @type {?} */
const _ESCAPED_CHARS = [
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
    return _ESCAPED_CHARS.reduce((text, entry) => text.replace(entry[0], entry[1]), text);
}
//# sourceMappingURL=xml_helper.js.map