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
/** @type {?} */
var TAG_TO_PLACEHOLDER_NAMES = {
    'A': 'LINK',
    'B': 'BOLD_TEXT',
    'BR': 'LINE_BREAK',
    'EM': 'EMPHASISED_TEXT',
    'H1': 'HEADING_LEVEL1',
    'H2': 'HEADING_LEVEL2',
    'H3': 'HEADING_LEVEL3',
    'H4': 'HEADING_LEVEL4',
    'H5': 'HEADING_LEVEL5',
    'H6': 'HEADING_LEVEL6',
    'HR': 'HORIZONTAL_RULE',
    'I': 'ITALIC_TEXT',
    'LI': 'LIST_ITEM',
    'LINK': 'MEDIA_LINK',
    'OL': 'ORDERED_LIST',
    'P': 'PARAGRAPH',
    'Q': 'QUOTATION',
    'S': 'STRIKETHROUGH_TEXT',
    'SMALL': 'SMALL_TEXT',
    'SUB': 'SUBSTRIPT',
    'SUP': 'SUPERSCRIPT',
    'TBODY': 'TABLE_BODY',
    'TD': 'TABLE_CELL',
    'TFOOT': 'TABLE_FOOTER',
    'TH': 'TABLE_HEADER_CELL',
    'THEAD': 'TABLE_HEADER',
    'TR': 'TABLE_ROW',
    'TT': 'MONOSPACED_TEXT',
    'U': 'UNDERLINED_TEXT',
    'UL': 'UNORDERED_LIST',
};
/**
 * Creates unique names for placeholder with different content.
 *
 * Returns the same placeholder name when the content is identical.
 */
var /**
 * Creates unique names for placeholder with different content.
 *
 * Returns the same placeholder name when the content is identical.
 */
PlaceholderRegistry = /** @class */ (function () {
    function PlaceholderRegistry() {
        this._placeHolderNameCounts = {};
        this._signatureToName = {};
    }
    /**
     * @param {?} tag
     * @param {?} attrs
     * @param {?} isVoid
     * @return {?}
     */
    PlaceholderRegistry.prototype.getStartTagPlaceholderName = /**
     * @param {?} tag
     * @param {?} attrs
     * @param {?} isVoid
     * @return {?}
     */
    function (tag, attrs, isVoid) {
        /** @type {?} */
        var signature = this._hashTag(tag, attrs, isVoid);
        if (this._signatureToName[signature]) {
            return this._signatureToName[signature];
        }
        /** @type {?} */
        var upperTag = tag.toUpperCase();
        /** @type {?} */
        var baseName = TAG_TO_PLACEHOLDER_NAMES[upperTag] || "TAG_" + upperTag;
        /** @type {?} */
        var name = this._generateUniqueName(isVoid ? baseName : "START_" + baseName);
        this._signatureToName[signature] = name;
        return name;
    };
    /**
     * @param {?} tag
     * @return {?}
     */
    PlaceholderRegistry.prototype.getCloseTagPlaceholderName = /**
     * @param {?} tag
     * @return {?}
     */
    function (tag) {
        /** @type {?} */
        var signature = this._hashClosingTag(tag);
        if (this._signatureToName[signature]) {
            return this._signatureToName[signature];
        }
        /** @type {?} */
        var upperTag = tag.toUpperCase();
        /** @type {?} */
        var baseName = TAG_TO_PLACEHOLDER_NAMES[upperTag] || "TAG_" + upperTag;
        /** @type {?} */
        var name = this._generateUniqueName("CLOSE_" + baseName);
        this._signatureToName[signature] = name;
        return name;
    };
    /**
     * @param {?} name
     * @param {?} content
     * @return {?}
     */
    PlaceholderRegistry.prototype.getPlaceholderName = /**
     * @param {?} name
     * @param {?} content
     * @return {?}
     */
    function (name, content) {
        /** @type {?} */
        var upperName = name.toUpperCase();
        /** @type {?} */
        var signature = "PH: " + upperName + "=" + content;
        if (this._signatureToName[signature]) {
            return this._signatureToName[signature];
        }
        /** @type {?} */
        var uniqueName = this._generateUniqueName(upperName);
        this._signatureToName[signature] = uniqueName;
        return uniqueName;
    };
    /**
     * @param {?} name
     * @return {?}
     */
    PlaceholderRegistry.prototype.getUniquePlaceholder = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        return this._generateUniqueName(name.toUpperCase());
    };
    /**
     * @param {?} tag
     * @param {?} attrs
     * @param {?} isVoid
     * @return {?}
     */
    PlaceholderRegistry.prototype._hashTag = /**
     * @param {?} tag
     * @param {?} attrs
     * @param {?} isVoid
     * @return {?}
     */
    function (tag, attrs, isVoid) {
        /** @type {?} */
        var start = "<" + tag;
        /** @type {?} */
        var strAttrs = Object.keys(attrs).sort().map(function (name) { return " " + name + "=" + attrs[name]; }).join('');
        /** @type {?} */
        var end = isVoid ? '/>' : "></" + tag + ">";
        return start + strAttrs + end;
    };
    /**
     * @param {?} tag
     * @return {?}
     */
    PlaceholderRegistry.prototype._hashClosingTag = /**
     * @param {?} tag
     * @return {?}
     */
    function (tag) { return this._hashTag("/" + tag, {}, false); };
    /**
     * @param {?} base
     * @return {?}
     */
    PlaceholderRegistry.prototype._generateUniqueName = /**
     * @param {?} base
     * @return {?}
     */
    function (base) {
        /** @type {?} */
        var seen = this._placeHolderNameCounts.hasOwnProperty(base);
        if (!seen) {
            this._placeHolderNameCounts[base] = 1;
            return base;
        }
        /** @type {?} */
        var id = this._placeHolderNameCounts[base];
        this._placeHolderNameCounts[base] = id + 1;
        return base + "_" + id;
    };
    return PlaceholderRegistry;
}());
/**
 * Creates unique names for placeholder with different content.
 *
 * Returns the same placeholder name when the content is identical.
 */
export { PlaceholderRegistry };
if (false) {
    /** @type {?} */
    PlaceholderRegistry.prototype._placeHolderNameCounts;
    /** @type {?} */
    PlaceholderRegistry.prototype._signatureToName;
}
//# sourceMappingURL=placeholder.js.map