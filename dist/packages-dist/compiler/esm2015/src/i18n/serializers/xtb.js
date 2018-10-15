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
import * as ml from '../../ml_parser/ast';
import { XmlParser } from '../../ml_parser/xml_parser';
import * as i18n from '../i18n_ast';
import { I18nError } from '../parse_util';
import { Serializer, SimplePlaceholderMapper } from './serializer';
import { digest, toPublicName } from './xmb';
/** @type {?} */
const _TRANSLATIONS_TAG = 'translationbundle';
/** @type {?} */
const _TRANSLATION_TAG = 'translation';
/** @type {?} */
const _PLACEHOLDER_TAG = 'ph';
export class Xtb extends Serializer {
    /**
     * @param {?} messages
     * @param {?} locale
     * @return {?}
     */
    write(messages, locale) { throw new Error('Unsupported'); }
    /**
     * @param {?} content
     * @param {?} url
     * @return {?}
     */
    load(content, url) {
        /** @type {?} */
        const xtbParser = new XtbParser();
        const { locale, msgIdToHtml, errors } = xtbParser.parse(content, url);
        /** @type {?} */
        const i18nNodesByMsgId = {};
        /** @type {?} */
        const converter = new XmlToI18n();
        // Because we should be able to load xtb files that rely on features not supported by angular,
        // we need to delay the conversion of html to i18n nodes so that non angular messages are not
        // converted
        Object.keys(msgIdToHtml).forEach(msgId => {
            /** @type {?} */
            const valueFn = function () {
                const { i18nNodes, errors } = converter.convert(msgIdToHtml[msgId], url);
                if (errors.length) {
                    throw new Error(`xtb parse errors:\n${errors.join('\n')}`);
                }
                return i18nNodes;
            };
            createLazyProperty(i18nNodesByMsgId, msgId, valueFn);
        });
        if (errors.length) {
            throw new Error(`xtb parse errors:\n${errors.join('\n')}`);
        }
        return { locale: /** @type {?} */ ((locale)), i18nNodesByMsgId };
    }
    /**
     * @param {?} message
     * @return {?}
     */
    digest(message) { return digest(message); }
    /**
     * @param {?} message
     * @return {?}
     */
    createNameMapper(message) {
        return new SimplePlaceholderMapper(message, toPublicName);
    }
}
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
            const value = valueFn();
            Object.defineProperty(messages, id, { enumerable: true, value });
            return value;
        },
        set: _ => { throw new Error('Could not overwrite an XTB translation'); },
    });
}
class XtbParser {
    constructor() {
        this._locale = null;
    }
    /**
     * @param {?} xtb
     * @param {?} url
     * @return {?}
     */
    parse(xtb, url) {
        this._bundleDepth = 0;
        this._msgIdToHtml = {};
        /** @type {?} */
        const xml = new XmlParser().parse(xtb, url, false);
        this._errors = xml.errors;
        ml.visitAll(this, xml.rootNodes);
        return {
            msgIdToHtml: this._msgIdToHtml,
            errors: this._errors,
            locale: this._locale,
        };
    }
    /**
     * @param {?} element
     * @param {?} context
     * @return {?}
     */
    visitElement(element, context) {
        switch (element.name) {
            case _TRANSLATIONS_TAG:
                this._bundleDepth++;
                if (this._bundleDepth > 1) {
                    this._addError(element, `<${_TRANSLATIONS_TAG}> elements can not be nested`);
                }
                /** @type {?} */
                const langAttr = element.attrs.find((attr) => attr.name === 'lang');
                if (langAttr) {
                    this._locale = langAttr.value;
                }
                ml.visitAll(this, element.children, null);
                this._bundleDepth--;
                break;
            case _TRANSLATION_TAG:
                /** @type {?} */
                const idAttr = element.attrs.find((attr) => attr.name === 'id');
                if (!idAttr) {
                    this._addError(element, `<${_TRANSLATION_TAG}> misses the "id" attribute`);
                }
                else {
                    /** @type {?} */
                    const id = idAttr.value;
                    if (this._msgIdToHtml.hasOwnProperty(id)) {
                        this._addError(element, `Duplicated translations for msg ${id}`);
                    }
                    else {
                        /** @type {?} */
                        const innerTextStart = /** @type {?} */ ((element.startSourceSpan)).end.offset;
                        /** @type {?} */
                        const innerTextEnd = /** @type {?} */ ((element.endSourceSpan)).start.offset;
                        /** @type {?} */
                        const content = /** @type {?} */ ((element.startSourceSpan)).start.file.content;
                        /** @type {?} */
                        const innerText = content.slice(/** @type {?} */ ((innerTextStart)), /** @type {?} */ ((innerTextEnd)));
                        this._msgIdToHtml[id] = innerText;
                    }
                }
                break;
            default:
                this._addError(element, 'Unexpected tag');
        }
    }
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    visitAttribute(attribute, context) { }
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    visitText(text, context) { }
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    visitComment(comment, context) { }
    /**
     * @param {?} expansion
     * @param {?} context
     * @return {?}
     */
    visitExpansion(expansion, context) { }
    /**
     * @param {?} expansionCase
     * @param {?} context
     * @return {?}
     */
    visitExpansionCase(expansionCase, context) { }
    /**
     * @param {?} node
     * @param {?} message
     * @return {?}
     */
    _addError(node, message) {
        this._errors.push(new I18nError(/** @type {?} */ ((node.sourceSpan)), message));
    }
}
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
class XmlToI18n {
    /**
     * @param {?} message
     * @param {?} url
     * @return {?}
     */
    convert(message, url) {
        /** @type {?} */
        const xmlIcu = new XmlParser().parse(message, url, true);
        this._errors = xmlIcu.errors;
        /** @type {?} */
        const i18nNodes = this._errors.length > 0 || xmlIcu.rootNodes.length == 0 ?
            [] :
            ml.visitAll(this, xmlIcu.rootNodes);
        return {
            i18nNodes,
            errors: this._errors,
        };
    }
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    visitText(text, context) { return new i18n.Text(text.value, /** @type {?} */ ((text.sourceSpan))); }
    /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    visitExpansion(icu, context) {
        /** @type {?} */
        const caseMap = {};
        ml.visitAll(this, icu.cases).forEach(c => {
            caseMap[c.value] = new i18n.Container(c.nodes, icu.sourceSpan);
        });
        return new i18n.Icu(icu.switchValue, icu.type, caseMap, icu.sourceSpan);
    }
    /**
     * @param {?} icuCase
     * @param {?} context
     * @return {?}
     */
    visitExpansionCase(icuCase, context) {
        return {
            value: icuCase.value,
            nodes: ml.visitAll(this, icuCase.expression),
        };
    }
    /**
     * @param {?} el
     * @param {?} context
     * @return {?}
     */
    visitElement(el, context) {
        if (el.name === _PLACEHOLDER_TAG) {
            /** @type {?} */
            const nameAttr = el.attrs.find((attr) => attr.name === 'name');
            if (nameAttr) {
                return new i18n.Placeholder('', nameAttr.value, /** @type {?} */ ((el.sourceSpan)));
            }
            this._addError(el, `<${_PLACEHOLDER_TAG}> misses the "name" attribute`);
        }
        else {
            this._addError(el, `Unexpected tag`);
        }
        return null;
    }
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    visitComment(comment, context) { }
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    visitAttribute(attribute, context) { }
    /**
     * @param {?} node
     * @param {?} message
     * @return {?}
     */
    _addError(node, message) {
        this._errors.push(new I18nError(/** @type {?} */ ((node.sourceSpan)), message));
    }
}
if (false) {
    /** @type {?} */
    XmlToI18n.prototype._errors;
}
//# sourceMappingURL=xtb.js.map