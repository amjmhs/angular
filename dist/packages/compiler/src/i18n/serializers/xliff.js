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
import { digest } from '../digest';
import * as i18n from '../i18n_ast';
import { I18nError } from '../parse_util';
import { Serializer } from './serializer';
import * as xml from './xml_helper';
/** @type {?} */
const _VERSION = '1.2';
/** @type {?} */
const _XMLNS = 'urn:oasis:names:tc:xliff:document:1.2';
/** @type {?} */
const _DEFAULT_SOURCE_LANG = 'en';
/** @type {?} */
const _PLACEHOLDER_TAG = 'x';
/** @type {?} */
const _MARKER_TAG = 'mrk';
/** @type {?} */
const _FILE_TAG = 'file';
/** @type {?} */
const _SOURCE_TAG = 'source';
/** @type {?} */
const _SEGMENT_SOURCE_TAG = 'seg-source';
/** @type {?} */
const _TARGET_TAG = 'target';
/** @type {?} */
const _UNIT_TAG = 'trans-unit';
/** @type {?} */
const _CONTEXT_GROUP_TAG = 'context-group';
/** @type {?} */
const _CONTEXT_TAG = 'context';
export class Xliff extends Serializer {
    /**
     * @param {?} messages
     * @param {?} locale
     * @return {?}
     */
    write(messages, locale) {
        /** @type {?} */
        const visitor = new _WriteVisitor();
        /** @type {?} */
        const transUnits = [];
        messages.forEach(message => {
            /** @type {?} */
            let contextTags = [];
            message.sources.forEach((source) => {
                /** @type {?} */
                let contextGroupTag = new xml.Tag(_CONTEXT_GROUP_TAG, { purpose: 'location' });
                contextGroupTag.children.push(new xml.CR(10), new xml.Tag(_CONTEXT_TAG, { 'context-type': 'sourcefile' }, [new xml.Text(source.filePath)]), new xml.CR(10), new xml.Tag(_CONTEXT_TAG, { 'context-type': 'linenumber' }, [new xml.Text(`${source.startLine}`)]), new xml.CR(8));
                contextTags.push(new xml.CR(8), contextGroupTag);
            });
            /** @type {?} */
            const transUnit = new xml.Tag(_UNIT_TAG, { id: message.id, datatype: 'html' });
            transUnit.children.push(new xml.CR(8), new xml.Tag(_SOURCE_TAG, {}, visitor.serialize(message.nodes)), ...contextTags);
            if (message.description) {
                transUnit.children.push(new xml.CR(8), new xml.Tag('note', { priority: '1', from: 'description' }, [new xml.Text(message.description)]));
            }
            if (message.meaning) {
                transUnit.children.push(new xml.CR(8), new xml.Tag('note', { priority: '1', from: 'meaning' }, [new xml.Text(message.meaning)]));
            }
            transUnit.children.push(new xml.CR(6));
            transUnits.push(new xml.CR(6), transUnit);
        });
        /** @type {?} */
        const body = new xml.Tag('body', {}, [...transUnits, new xml.CR(4)]);
        /** @type {?} */
        const file = new xml.Tag('file', {
            'source-language': locale || _DEFAULT_SOURCE_LANG,
            datatype: 'plaintext',
            original: 'ng2.template',
        }, [new xml.CR(4), body, new xml.CR(2)]);
        /** @type {?} */
        const xliff = new xml.Tag('xliff', { version: _VERSION, xmlns: _XMLNS }, [new xml.CR(2), file, new xml.CR()]);
        return xml.serialize([
            new xml.Declaration({ version: '1.0', encoding: 'UTF-8' }), new xml.CR(), xliff, new xml.CR()
        ]);
    }
    /**
     * @param {?} content
     * @param {?} url
     * @return {?}
     */
    load(content, url) {
        /** @type {?} */
        const xliffParser = new XliffParser();
        const { locale, msgIdToHtml, errors } = xliffParser.parse(content, url);
        /** @type {?} */
        const i18nNodesByMsgId = {};
        /** @type {?} */
        const converter = new XmlToI18n();
        Object.keys(msgIdToHtml).forEach(msgId => {
            const { i18nNodes, errors: e } = converter.convert(msgIdToHtml[msgId], url);
            errors.push(...e);
            i18nNodesByMsgId[msgId] = i18nNodes;
        });
        if (errors.length) {
            throw new Error(`xliff parse errors:\n${errors.join('\n')}`);
        }
        return { locale: /** @type {?} */ ((locale)), i18nNodesByMsgId };
    }
    /**
     * @param {?} message
     * @return {?}
     */
    digest(message) { return digest(message); }
}
class _WriteVisitor {
    /**
     * @param {?} text
     * @param {?=} context
     * @return {?}
     */
    visitText(text, context) { return [new xml.Text(text.value)]; }
    /**
     * @param {?} container
     * @param {?=} context
     * @return {?}
     */
    visitContainer(container, context) {
        /** @type {?} */
        const nodes = [];
        container.children.forEach((node) => nodes.push(...node.visit(this)));
        return nodes;
    }
    /**
     * @param {?} icu
     * @param {?=} context
     * @return {?}
     */
    visitIcu(icu, context) {
        /** @type {?} */
        const nodes = [new xml.Text(`{${icu.expressionPlaceholder}, ${icu.type}, `)];
        Object.keys(icu.cases).forEach((c) => {
            nodes.push(new xml.Text(`${c} {`), ...icu.cases[c].visit(this), new xml.Text(`} `));
        });
        nodes.push(new xml.Text(`}`));
        return nodes;
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitTagPlaceholder(ph, context) {
        /** @type {?} */
        const ctype = getCtypeForTag(ph.tag);
        if (ph.isVoid) {
            // void tags have no children nor closing tags
            return [new xml.Tag(_PLACEHOLDER_TAG, { id: ph.startName, ctype, 'equiv-text': `<${ph.tag}/>` })];
        }
        /** @type {?} */
        const startTagPh = new xml.Tag(_PLACEHOLDER_TAG, { id: ph.startName, ctype, 'equiv-text': `<${ph.tag}>` });
        /** @type {?} */
        const closeTagPh = new xml.Tag(_PLACEHOLDER_TAG, { id: ph.closeName, ctype, 'equiv-text': `</${ph.tag}>` });
        return [startTagPh, ...this.serialize(ph.children), closeTagPh];
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitPlaceholder(ph, context) {
        return [new xml.Tag(_PLACEHOLDER_TAG, { id: ph.name, 'equiv-text': `{{${ph.value}}}` })];
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitIcuPlaceholder(ph, context) {
        /** @type {?} */
        const equivText = `{${ph.value.expression}, ${ph.value.type}, ${Object.keys(ph.value.cases).map((value) => value + ' {...}').join(' ')}}`;
        return [new xml.Tag(_PLACEHOLDER_TAG, { id: ph.name, 'equiv-text': equivText })];
    }
    /**
     * @param {?} nodes
     * @return {?}
     */
    serialize(nodes) {
        return [].concat(...nodes.map(node => node.visit(this)));
    }
}
class XliffParser {
    constructor() {
        this._locale = null;
    }
    /**
     * @param {?} xliff
     * @param {?} url
     * @return {?}
     */
    parse(xliff, url) {
        this._unitMlString = null;
        this._msgIdToHtml = {};
        /** @type {?} */
        const xml = new XmlParser().parse(xliff, url, false);
        this._errors = xml.errors;
        ml.visitAll(this, xml.rootNodes, null);
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
            case _UNIT_TAG:
                this._unitMlString = /** @type {?} */ ((null));
                /** @type {?} */
                const idAttr = element.attrs.find((attr) => attr.name === 'id');
                if (!idAttr) {
                    this._addError(element, `<${_UNIT_TAG}> misses the "id" attribute`);
                }
                else {
                    /** @type {?} */
                    const id = idAttr.value;
                    if (this._msgIdToHtml.hasOwnProperty(id)) {
                        this._addError(element, `Duplicated translations for msg ${id}`);
                    }
                    else {
                        ml.visitAll(this, element.children, null);
                        if (typeof this._unitMlString === 'string') {
                            this._msgIdToHtml[id] = this._unitMlString;
                        }
                        else {
                            this._addError(element, `Message ${id} misses a translation`);
                        }
                    }
                }
                break;
            // ignore those tags
            case _SOURCE_TAG:
            case _SEGMENT_SOURCE_TAG:
                break;
            case _TARGET_TAG:
                /** @type {?} */
                const innerTextStart = /** @type {?} */ ((element.startSourceSpan)).end.offset;
                /** @type {?} */
                const innerTextEnd = /** @type {?} */ ((element.endSourceSpan)).start.offset;
                /** @type {?} */
                const content = /** @type {?} */ ((element.startSourceSpan)).start.file.content;
                /** @type {?} */
                const innerText = content.slice(innerTextStart, innerTextEnd);
                this._unitMlString = innerText;
                break;
            case _FILE_TAG:
                /** @type {?} */
                const localeAttr = element.attrs.find((attr) => attr.name === 'target-language');
                if (localeAttr) {
                    this._locale = localeAttr.value;
                }
                ml.visitAll(this, element.children, null);
                break;
            default:
                // TODO(vicb): assert file structure, xliff version
                // For now only recurse on unhandled nodes
                ml.visitAll(this, element.children, null);
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
    XliffParser.prototype._unitMlString;
    /** @type {?} */
    XliffParser.prototype._errors;
    /** @type {?} */
    XliffParser.prototype._msgIdToHtml;
    /** @type {?} */
    XliffParser.prototype._locale;
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
            [].concat(...ml.visitAll(this, xmlIcu.rootNodes));
        return {
            i18nNodes: i18nNodes,
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
     * @param {?} el
     * @param {?} context
     * @return {?}
     */
    visitElement(el, context) {
        if (el.name === _PLACEHOLDER_TAG) {
            /** @type {?} */
            const nameAttr = el.attrs.find((attr) => attr.name === 'id');
            if (nameAttr) {
                return new i18n.Placeholder('', nameAttr.value, /** @type {?} */ ((el.sourceSpan)));
            }
            this._addError(el, `<${_PLACEHOLDER_TAG}> misses the "id" attribute`);
            return null;
        }
        if (el.name === _MARKER_TAG) {
            return [].concat(...ml.visitAll(this, el.children));
        }
        this._addError(el, `Unexpected tag`);
        return null;
    }
    /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    visitExpansion(icu, context) {
        /** @type {?} */
        const caseMap = {};
        ml.visitAll(this, icu.cases).forEach((c) => {
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
/**
 * @param {?} tag
 * @return {?}
 */
function getCtypeForTag(tag) {
    switch (tag.toLowerCase()) {
        case 'br':
            return 'lb';
        case 'img':
            return 'image';
        default:
            return `x-${tag}`;
    }
}
//# sourceMappingURL=xliff.js.map