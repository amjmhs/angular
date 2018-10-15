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
import { MissingTranslationStrategy } from '../core';
import { HtmlParser } from '../ml_parser/html_parser';
import { I18nError } from './parse_util';
import { escapeXml } from './serializers/xml_helper';
/**
 * A container for translated messages
 */
export class TranslationBundle {
    /**
     * @param {?=} _i18nNodesByMsgId
     * @param {?=} locale
     * @param {?=} digest
     * @param {?=} mapperFactory
     * @param {?=} missingTranslationStrategy
     * @param {?=} console
     */
    constructor(_i18nNodesByMsgId = {}, locale, digest, mapperFactory, missingTranslationStrategy = MissingTranslationStrategy.Warning, console) {
        this._i18nNodesByMsgId = _i18nNodesByMsgId;
        this.digest = digest;
        this.mapperFactory = mapperFactory;
        this._i18nToHtml = new I18nToHtmlVisitor(_i18nNodesByMsgId, locale, digest, /** @type {?} */ ((mapperFactory)), missingTranslationStrategy, console);
    }
    /**
     * @param {?} content
     * @param {?} url
     * @param {?} serializer
     * @param {?} missingTranslationStrategy
     * @param {?=} console
     * @return {?}
     */
    static load(content, url, serializer, missingTranslationStrategy, console) {
        const { locale, i18nNodesByMsgId } = serializer.load(content, url);
        /** @type {?} */
        const digestFn = (m) => serializer.digest(m);
        /** @type {?} */
        const mapperFactory = (m) => /** @type {?} */ ((serializer.createNameMapper(m)));
        return new TranslationBundle(i18nNodesByMsgId, locale, digestFn, mapperFactory, missingTranslationStrategy, console);
    }
    /**
     * @param {?} srcMsg
     * @return {?}
     */
    get(srcMsg) {
        /** @type {?} */
        const html = this._i18nToHtml.convert(srcMsg);
        if (html.errors.length) {
            throw new Error(html.errors.join('\n'));
        }
        return html.nodes;
    }
    /**
     * @param {?} srcMsg
     * @return {?}
     */
    has(srcMsg) { return this.digest(srcMsg) in this._i18nNodesByMsgId; }
}
if (false) {
    /** @type {?} */
    TranslationBundle.prototype._i18nToHtml;
    /** @type {?} */
    TranslationBundle.prototype._i18nNodesByMsgId;
    /** @type {?} */
    TranslationBundle.prototype.digest;
    /** @type {?} */
    TranslationBundle.prototype.mapperFactory;
}
class I18nToHtmlVisitor {
    /**
     * @param {?=} _i18nNodesByMsgId
     * @param {?=} _locale
     * @param {?=} _digest
     * @param {?=} _mapperFactory
     * @param {?=} _missingTranslationStrategy
     * @param {?=} _console
     */
    constructor(_i18nNodesByMsgId = {}, _locale, _digest, _mapperFactory, _missingTranslationStrategy, _console) {
        this._i18nNodesByMsgId = _i18nNodesByMsgId;
        this._locale = _locale;
        this._digest = _digest;
        this._mapperFactory = _mapperFactory;
        this._missingTranslationStrategy = _missingTranslationStrategy;
        this._console = _console;
        this._contextStack = [];
        this._errors = [];
    }
    /**
     * @param {?} srcMsg
     * @return {?}
     */
    convert(srcMsg) {
        this._contextStack.length = 0;
        this._errors.length = 0;
        /** @type {?} */
        const text = this._convertToText(srcMsg);
        /** @type {?} */
        const url = srcMsg.nodes[0].sourceSpan.start.file.url;
        /** @type {?} */
        const html = new HtmlParser().parse(text, url, true);
        return {
            nodes: html.rootNodes,
            errors: [...this._errors, ...html.errors],
        };
    }
    /**
     * @param {?} text
     * @param {?=} context
     * @return {?}
     */
    visitText(text, context) {
        // `convert()` uses an `HtmlParser` to return `html.Node`s
        // we should then make sure that any special characters are escaped
        return escapeXml(text.value);
    }
    /**
     * @param {?} container
     * @param {?=} context
     * @return {?}
     */
    visitContainer(container, context) {
        return container.children.map(n => n.visit(this)).join('');
    }
    /**
     * @param {?} icu
     * @param {?=} context
     * @return {?}
     */
    visitIcu(icu, context) {
        /** @type {?} */
        const cases = Object.keys(icu.cases).map(k => `${k} {${icu.cases[k].visit(this)}}`);
        /** @type {?} */
        const exp = this._srcMsg.placeholders.hasOwnProperty(icu.expression) ?
            this._srcMsg.placeholders[icu.expression] :
            icu.expression;
        return `{${exp}, ${icu.type}, ${cases.join(' ')}}`;
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitPlaceholder(ph, context) {
        /** @type {?} */
        const phName = this._mapper(ph.name);
        if (this._srcMsg.placeholders.hasOwnProperty(phName)) {
            return this._srcMsg.placeholders[phName];
        }
        if (this._srcMsg.placeholderToMessage.hasOwnProperty(phName)) {
            return this._convertToText(this._srcMsg.placeholderToMessage[phName]);
        }
        this._addError(ph, `Unknown placeholder "${ph.name}"`);
        return '';
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitTagPlaceholder(ph, context) {
        /** @type {?} */
        const tag = `${ph.tag}`;
        /** @type {?} */
        const attrs = Object.keys(ph.attrs).map(name => `${name}="${ph.attrs[name]}"`).join(' ');
        if (ph.isVoid) {
            return `<${tag} ${attrs}/>`;
        }
        /** @type {?} */
        const children = ph.children.map((c) => c.visit(this)).join('');
        return `<${tag} ${attrs}>${children}</${tag}>`;
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitIcuPlaceholder(ph, context) {
        // An ICU placeholder references the source message to be serialized
        return this._convertToText(this._srcMsg.placeholderToMessage[ph.name]);
    }
    /**
     * Convert a source message to a translated text string:
     * - text nodes are replaced with their translation,
     * - placeholders are replaced with their content,
     * - ICU nodes are converted to ICU expressions.
     * @param {?} srcMsg
     * @return {?}
     */
    _convertToText(srcMsg) {
        /** @type {?} */
        const id = this._digest(srcMsg);
        /** @type {?} */
        const mapper = this._mapperFactory ? this._mapperFactory(srcMsg) : null;
        /** @type {?} */
        let nodes;
        this._contextStack.push({ msg: this._srcMsg, mapper: this._mapper });
        this._srcMsg = srcMsg;
        if (this._i18nNodesByMsgId.hasOwnProperty(id)) {
            // When there is a translation use its nodes as the source
            // And create a mapper to convert serialized placeholder names to internal names
            nodes = this._i18nNodesByMsgId[id];
            this._mapper = (name) => mapper ? /** @type {?} */ ((mapper.toInternalName(name))) : name;
        }
        else {
            // When no translation has been found
            // - report an error / a warning / nothing,
            // - use the nodes from the original message
            // - placeholders are already internal and need no mapper
            if (this._missingTranslationStrategy === MissingTranslationStrategy.Error) {
                /** @type {?} */
                const ctx = this._locale ? ` for locale "${this._locale}"` : '';
                this._addError(srcMsg.nodes[0], `Missing translation for message "${id}"${ctx}`);
            }
            else if (this._console &&
                this._missingTranslationStrategy === MissingTranslationStrategy.Warning) {
                /** @type {?} */
                const ctx = this._locale ? ` for locale "${this._locale}"` : '';
                this._console.warn(`Missing translation for message "${id}"${ctx}`);
            }
            nodes = srcMsg.nodes;
            this._mapper = (name) => name;
        }
        /** @type {?} */
        const text = nodes.map(node => node.visit(this)).join('');
        /** @type {?} */
        const context = /** @type {?} */ ((this._contextStack.pop()));
        this._srcMsg = context.msg;
        this._mapper = context.mapper;
        return text;
    }
    /**
     * @param {?} el
     * @param {?} msg
     * @return {?}
     */
    _addError(el, msg) {
        this._errors.push(new I18nError(el.sourceSpan, msg));
    }
}
if (false) {
    /** @type {?} */
    I18nToHtmlVisitor.prototype._srcMsg;
    /** @type {?} */
    I18nToHtmlVisitor.prototype._contextStack;
    /** @type {?} */
    I18nToHtmlVisitor.prototype._errors;
    /** @type {?} */
    I18nToHtmlVisitor.prototype._mapper;
    /** @type {?} */
    I18nToHtmlVisitor.prototype._i18nNodesByMsgId;
    /** @type {?} */
    I18nToHtmlVisitor.prototype._locale;
    /** @type {?} */
    I18nToHtmlVisitor.prototype._digest;
    /** @type {?} */
    I18nToHtmlVisitor.prototype._mapperFactory;
    /** @type {?} */
    I18nToHtmlVisitor.prototype._missingTranslationStrategy;
    /** @type {?} */
    I18nToHtmlVisitor.prototype._console;
}
//# sourceMappingURL=translation_bundle.js.map