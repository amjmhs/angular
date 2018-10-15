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
import * as ml from '../../ml_parser/ast';
import { XmlParser } from '../../ml_parser/xml_parser';
import * as i18n from '../i18n_ast';
import { I18nError } from '../parse_util';
import { Serializer, SimplePlaceholderMapper } from './serializer';
import { digest, toPublicName } from './xmb';
/** @type {?} */
var _TRANSLATIONS_TAG = 'translationbundle';
/** @type {?} */
var _TRANSLATION_TAG = 'translation';
/** @type {?} */
var _PLACEHOLDER_TAG = 'ph';
var Xtb = /** @class */ (function (_super) {
    tslib_1.__extends(Xtb, _super);
    function Xtb() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {?} messages
     * @param {?} locale
     * @return {?}
     */
    Xtb.prototype.write = /**
     * @param {?} messages
     * @param {?} locale
     * @return {?}
     */
    function (messages, locale) { throw new Error('Unsupported'); };
    /**
     * @param {?} content
     * @param {?} url
     * @return {?}
     */
    Xtb.prototype.load = /**
     * @param {?} content
     * @param {?} url
     * @return {?}
     */
    function (content, url) {
        /** @type {?} */
        var xtbParser = new XtbParser();
        var _a = xtbParser.parse(content, url), locale = _a.locale, msgIdToHtml = _a.msgIdToHtml, errors = _a.errors;
        /** @type {?} */
        var i18nNodesByMsgId = {};
        /** @type {?} */
        var converter = new XmlToI18n();
        // Because we should be able to load xtb files that rely on features not supported by angular,
        // we need to delay the conversion of html to i18n nodes so that non angular messages are not
        // converted
        Object.keys(msgIdToHtml).forEach(function (msgId) {
            /** @type {?} */
            var valueFn = function () {
                var _a = converter.convert(msgIdToHtml[msgId], url), i18nNodes = _a.i18nNodes, errors = _a.errors;
                if (errors.length) {
                    throw new Error("xtb parse errors:\n" + errors.join('\n'));
                }
                return i18nNodes;
            };
            createLazyProperty(i18nNodesByMsgId, msgId, valueFn);
        });
        if (errors.length) {
            throw new Error("xtb parse errors:\n" + errors.join('\n'));
        }
        return { locale: /** @type {?} */ ((locale)), i18nNodesByMsgId: i18nNodesByMsgId };
    };
    /**
     * @param {?} message
     * @return {?}
     */
    Xtb.prototype.digest = /**
     * @param {?} message
     * @return {?}
     */
    function (message) { return digest(message); };
    /**
     * @param {?} message
     * @return {?}
     */
    Xtb.prototype.createNameMapper = /**
     * @param {?} message
     * @return {?}
     */
    function (message) {
        return new SimplePlaceholderMapper(message, toPublicName);
    };
    return Xtb;
}(Serializer));
export { Xtb };
/**
 * @param {?} messages
 * @param {?} id
 * @param {?} valueFn
 * @return {?}
 */
function createLazyProperty(messages, id, valueFn) {
    Object.defineProperty(messages, id, {
        configurable: true,
        enumerable: true,
        get: function () {
            /** @type {?} */
            var value = valueFn();
            Object.defineProperty(messages, id, { enumerable: true, value: value });
            return value;
        },
        set: function (_) { throw new Error('Could not overwrite an XTB translation'); },
    });
}
var XtbParser = /** @class */ (function () {
    function XtbParser() {
        this._locale = null;
    }
    /**
     * @param {?} xtb
     * @param {?} url
     * @return {?}
     */
    XtbParser.prototype.parse = /**
     * @param {?} xtb
     * @param {?} url
     * @return {?}
     */
    function (xtb, url) {
        this._bundleDepth = 0;
        this._msgIdToHtml = {};
        /** @type {?} */
        var xml = new XmlParser().parse(xtb, url, false);
        this._errors = xml.errors;
        ml.visitAll(this, xml.rootNodes);
        return {
            msgIdToHtml: this._msgIdToHtml,
            errors: this._errors,
            locale: this._locale,
        };
    };
    /**
     * @param {?} element
     * @param {?} context
     * @return {?}
     */
    XtbParser.prototype.visitElement = /**
     * @param {?} element
     * @param {?} context
     * @return {?}
     */
    function (element, context) {
        switch (element.name) {
            case _TRANSLATIONS_TAG:
                this._bundleDepth++;
                if (this._bundleDepth > 1) {
                    this._addError(element, "<" + _TRANSLATIONS_TAG + "> elements can not be nested");
                }
                /** @type {?} */
                var langAttr = element.attrs.find(function (attr) { return attr.name === 'lang'; });
                if (langAttr) {
                    this._locale = langAttr.value;
                }
                ml.visitAll(this, element.children, null);
                this._bundleDepth--;
                break;
            case _TRANSLATION_TAG:
                /** @type {?} */
                var idAttr = element.attrs.find(function (attr) { return attr.name === 'id'; });
                if (!idAttr) {
                    this._addError(element, "<" + _TRANSLATION_TAG + "> misses the \"id\" attribute");
                }
                else {
                    /** @type {?} */
                    var id = idAttr.value;
                    if (this._msgIdToHtml.hasOwnProperty(id)) {
                        this._addError(element, "Duplicated translations for msg " + id);
                    }
                    else {
                        /** @type {?} */
                        var innerTextStart = /** @type {?} */ ((element.startSourceSpan)).end.offset;
                        /** @type {?} */
                        var innerTextEnd = /** @type {?} */ ((element.endSourceSpan)).start.offset;
                        /** @type {?} */
                        var content = /** @type {?} */ ((element.startSourceSpan)).start.file.content;
                        /** @type {?} */
                        var innerText = content.slice(/** @type {?} */ ((innerTextStart)), /** @type {?} */ ((innerTextEnd)));
                        this._msgIdToHtml[id] = innerText;
                    }
                }
                break;
            default:
                this._addError(element, 'Unexpected tag');
        }
    };
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    XtbParser.prototype.visitAttribute = /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    function (attribute, context) { };
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    XtbParser.prototype.visitText = /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    function (text, context) { };
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    XtbParser.prototype.visitComment = /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    function (comment, context) { };
    /**
     * @param {?} expansion
     * @param {?} context
     * @return {?}
     */
    XtbParser.prototype.visitExpansion = /**
     * @param {?} expansion
     * @param {?} context
     * @return {?}
     */
    function (expansion, context) { };
    /**
     * @param {?} expansionCase
     * @param {?} context
     * @return {?}
     */
    XtbParser.prototype.visitExpansionCase = /**
     * @param {?} expansionCase
     * @param {?} context
     * @return {?}
     */
    function (expansionCase, context) { };
    /**
     * @param {?} node
     * @param {?} message
     * @return {?}
     */
    XtbParser.prototype._addError = /**
     * @param {?} node
     * @param {?} message
     * @return {?}
     */
    function (node, message) {
        this._errors.push(new I18nError(/** @type {?} */ ((node.sourceSpan)), message));
    };
    return XtbParser;
}());
if (false) {
    /** @type {?} */
    XtbParser.prototype._bundleDepth;
    /** @type {?} */
    XtbParser.prototype._errors;
    /** @type {?} */
    XtbParser.prototype._msgIdToHtml;
    /** @type {?} */
    XtbParser.prototype._locale;
}
var XmlToI18n = /** @class */ (function () {
    function XmlToI18n() {
    }
    /**
     * @param {?} message
     * @param {?} url
     * @return {?}
     */
    XmlToI18n.prototype.convert = /**
     * @param {?} message
     * @param {?} url
     * @return {?}
     */
    function (message, url) {
        /** @type {?} */
        var xmlIcu = new XmlParser().parse(message, url, true);
        this._errors = xmlIcu.errors;
        /** @type {?} */
        var i18nNodes = this._errors.length > 0 || xmlIcu.rootNodes.length == 0 ?
            [] :
            ml.visitAll(this, xmlIcu.rootNodes);
        return {
            i18nNodes: i18nNodes,
            errors: this._errors,
        };
    };
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    XmlToI18n.prototype.visitText = /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    function (text, context) { return new i18n.Text(text.value, /** @type {?} */ ((text.sourceSpan))); };
    /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    XmlToI18n.prototype.visitExpansion = /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    function (icu, context) {
        /** @type {?} */
        var caseMap = {};
        ml.visitAll(this, icu.cases).forEach(function (c) {
            caseMap[c.value] = new i18n.Container(c.nodes, icu.sourceSpan);
        });
        return new i18n.Icu(icu.switchValue, icu.type, caseMap, icu.sourceSpan);
    };
    /**
     * @param {?} icuCase
     * @param {?} context
     * @return {?}
     */
    XmlToI18n.prototype.visitExpansionCase = /**
     * @param {?} icuCase
     * @param {?} context
     * @return {?}
     */
    function (icuCase, context) {
        return {
            value: icuCase.value,
            nodes: ml.visitAll(this, icuCase.expression),
        };
    };
    /**
     * @param {?} el
     * @param {?} context
     * @return {?}
     */
    XmlToI18n.prototype.visitElement = /**
     * @param {?} el
     * @param {?} context
     * @return {?}
     */
    function (el, context) {
        if (el.name === _PLACEHOLDER_TAG) {
            /** @type {?} */
            var nameAttr = el.attrs.find(function (attr) { return attr.name === 'name'; });
            if (nameAttr) {
                return new i18n.Placeholder('', nameAttr.value, /** @type {?} */ ((el.sourceSpan)));
            }
            this._addError(el, "<" + _PLACEHOLDER_TAG + "> misses the \"name\" attribute");
        }
        else {
            this._addError(el, "Unexpected tag");
        }
        return null;
    };
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    XmlToI18n.prototype.visitComment = /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    function (comment, context) { };
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    XmlToI18n.prototype.visitAttribute = /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    function (attribute, context) { };
    /**
     * @param {?} node
     * @param {?} message
     * @return {?}
     */
    XmlToI18n.prototype._addError = /**
     * @param {?} node
     * @param {?} message
     * @return {?}
     */
    function (node, message) {
        this._errors.push(new I18nError(/** @type {?} */ ((node.sourceSpan)), message));
    };
    return XmlToI18n;
}());
if (false) {
    /** @type {?} */
    XmlToI18n.prototype._errors;
}
//# sourceMappingURL=xtb.js.map