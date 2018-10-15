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
import { extractMessages } from './extractor_merger';
import * as i18n from './i18n_ast';
/**
 * A container for message extracted from the templates.
 */
export class MessageBundle {
    /**
     * @param {?} _htmlParser
     * @param {?} _implicitTags
     * @param {?} _implicitAttrs
     * @param {?=} _locale
     */
    constructor(_htmlParser, _implicitTags, _implicitAttrs, _locale = null) {
        this._htmlParser = _htmlParser;
        this._implicitTags = _implicitTags;
        this._implicitAttrs = _implicitAttrs;
        this._locale = _locale;
        this._messages = [];
    }
    /**
     * @param {?} html
     * @param {?} url
     * @param {?} interpolationConfig
     * @return {?}
     */
    updateFromTemplate(html, url, interpolationConfig) {
        /** @type {?} */
        const htmlParserResult = this._htmlParser.parse(html, url, true, interpolationConfig);
        if (htmlParserResult.errors.length) {
            return htmlParserResult.errors;
        }
        /** @type {?} */
        const i18nParserResult = extractMessages(htmlParserResult.rootNodes, interpolationConfig, this._implicitTags, this._implicitAttrs);
        if (i18nParserResult.errors.length) {
            return i18nParserResult.errors;
        }
        this._messages.push(...i18nParserResult.messages);
        return [];
    }
    /**
     * @return {?}
     */
    getMessages() { return this._messages; }
    /**
     * @param {?} serializer
     * @param {?=} filterSources
     * @return {?}
     */
    write(serializer, filterSources) {
        /** @type {?} */
        const messages = {};
        /** @type {?} */
        const mapperVisitor = new MapPlaceholderNames();
        // Deduplicate messages based on their ID
        this._messages.forEach(message => {
            /** @type {?} */
            const id = serializer.digest(message);
            if (!messages.hasOwnProperty(id)) {
                messages[id] = message;
            }
            else {
                messages[id].sources.push(...message.sources);
            }
        });
        /** @type {?} */
        const msgList = Object.keys(messages).map(id => {
            /** @type {?} */
            const mapper = serializer.createNameMapper(messages[id]);
            /** @type {?} */
            const src = messages[id];
            /** @type {?} */
            const nodes = mapper ? mapperVisitor.convert(src.nodes, mapper) : src.nodes;
            /** @type {?} */
            let transformedMessage = new i18n.Message(nodes, {}, {}, src.meaning, src.description, id);
            transformedMessage.sources = src.sources;
            if (filterSources) {
                transformedMessage.sources.forEach((source) => source.filePath = filterSources(source.filePath));
            }
            return transformedMessage;
        });
        return serializer.write(msgList, this._locale);
    }
}
if (false) {
    /** @type {?} */
    MessageBundle.prototype._messages;
    /** @type {?} */
    MessageBundle.prototype._htmlParser;
    /** @type {?} */
    MessageBundle.prototype._implicitTags;
    /** @type {?} */
    MessageBundle.prototype._implicitAttrs;
    /** @type {?} */
    MessageBundle.prototype._locale;
}
class MapPlaceholderNames extends i18n.CloneVisitor {
    /**
     * @param {?} nodes
     * @param {?} mapper
     * @return {?}
     */
    convert(nodes, mapper) {
        return mapper ? nodes.map(n => n.visit(this, mapper)) : nodes;
    }
    /**
     * @param {?} ph
     * @param {?} mapper
     * @return {?}
     */
    visitTagPlaceholder(ph, mapper) {
        /** @type {?} */
        const startName = /** @type {?} */ ((mapper.toPublicName(ph.startName)));
        /** @type {?} */
        const closeName = ph.closeName ? /** @type {?} */ ((mapper.toPublicName(ph.closeName))) : ph.closeName;
        /** @type {?} */
        const children = ph.children.map(n => n.visit(this, mapper));
        return new i18n.TagPlaceholder(ph.tag, ph.attrs, startName, closeName, children, ph.isVoid, ph.sourceSpan);
    }
    /**
     * @param {?} ph
     * @param {?} mapper
     * @return {?}
     */
    visitPlaceholder(ph, mapper) {
        return new i18n.Placeholder(ph.value, /** @type {?} */ ((mapper.toPublicName(ph.name))), ph.sourceSpan);
    }
    /**
     * @param {?} ph
     * @param {?} mapper
     * @return {?}
     */
    visitIcuPlaceholder(ph, mapper) {
        return new i18n.IcuPlaceholder(ph.value, /** @type {?} */ ((mapper.toPublicName(ph.name))), ph.sourceSpan);
    }
}
//# sourceMappingURL=message_bundle.js.map