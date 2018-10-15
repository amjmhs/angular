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
import { Lexer as ExpressionLexer } from '../expression_parser/lexer';
import { Parser as ExpressionParser } from '../expression_parser/parser';
import * as html from '../ml_parser/ast';
import { getHtmlTagDefinition } from '../ml_parser/html_tags';
import * as i18n from './i18n_ast';
import { PlaceholderRegistry } from './serializers/placeholder';
/** @type {?} */
var _expParser = new ExpressionParser(new ExpressionLexer());
/**
 * Returns a function converting html nodes to an i18n Message given an interpolationConfig
 * @param {?} interpolationConfig
 * @return {?}
 */
export function createI18nMessageFactory(interpolationConfig) {
    /** @type {?} */
    var visitor = new _I18nVisitor(_expParser, interpolationConfig);
    return function (nodes, meaning, description, id) {
        return visitor.toI18nMessage(nodes, meaning, description, id);
    };
}
var _I18nVisitor = /** @class */ (function () {
    function _I18nVisitor(_expressionParser, _interpolationConfig) {
        this._expressionParser = _expressionParser;
        this._interpolationConfig = _interpolationConfig;
    }
    /**
     * @param {?} nodes
     * @param {?} meaning
     * @param {?} description
     * @param {?} id
     * @return {?}
     */
    _I18nVisitor.prototype.toI18nMessage = /**
     * @param {?} nodes
     * @param {?} meaning
     * @param {?} description
     * @param {?} id
     * @return {?}
     */
    function (nodes, meaning, description, id) {
        this._isIcu = nodes.length == 1 && nodes[0] instanceof html.Expansion;
        this._icuDepth = 0;
        this._placeholderRegistry = new PlaceholderRegistry();
        this._placeholderToContent = {};
        this._placeholderToMessage = {};
        /** @type {?} */
        var i18nodes = html.visitAll(this, nodes, {});
        return new i18n.Message(i18nodes, this._placeholderToContent, this._placeholderToMessage, meaning, description, id);
    };
    /**
     * @param {?} el
     * @param {?} context
     * @return {?}
     */
    _I18nVisitor.prototype.visitElement = /**
     * @param {?} el
     * @param {?} context
     * @return {?}
     */
    function (el, context) {
        /** @type {?} */
        var children = html.visitAll(this, el.children);
        /** @type {?} */
        var attrs = {};
        el.attrs.forEach(function (attr) {
            // Do not visit the attributes, translatable ones are top-level ASTs
            attrs[attr.name] = attr.value;
        });
        /** @type {?} */
        var isVoid = getHtmlTagDefinition(el.name).isVoid;
        /** @type {?} */
        var startPhName = this._placeholderRegistry.getStartTagPlaceholderName(el.name, attrs, isVoid);
        this._placeholderToContent[startPhName] = /** @type {?} */ ((el.sourceSpan)).toString();
        /** @type {?} */
        var closePhName = '';
        if (!isVoid) {
            closePhName = this._placeholderRegistry.getCloseTagPlaceholderName(el.name);
            this._placeholderToContent[closePhName] = "</" + el.name + ">";
        }
        return new i18n.TagPlaceholder(el.name, attrs, startPhName, closePhName, children, isVoid, /** @type {?} */ ((el.sourceSpan)));
    };
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    _I18nVisitor.prototype.visitAttribute = /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    function (attribute, context) {
        return this._visitTextWithInterpolation(attribute.value, attribute.sourceSpan);
    };
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    _I18nVisitor.prototype.visitText = /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    function (text, context) {
        return this._visitTextWithInterpolation(text.value, /** @type {?} */ ((text.sourceSpan)));
    };
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    _I18nVisitor.prototype.visitComment = /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    function (comment, context) { return null; };
    /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    _I18nVisitor.prototype.visitExpansion = /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    function (icu, context) {
        var _this = this;
        this._icuDepth++;
        /** @type {?} */
        var i18nIcuCases = {};
        /** @type {?} */
        var i18nIcu = new i18n.Icu(icu.switchValue, icu.type, i18nIcuCases, icu.sourceSpan);
        icu.cases.forEach(function (caze) {
            i18nIcuCases[caze.value] = new i18n.Container(caze.expression.map(function (node) { return node.visit(_this, {}); }), caze.expSourceSpan);
        });
        this._icuDepth--;
        if (this._isIcu || this._icuDepth > 0) {
            /** @type {?} */
            var expPh = this._placeholderRegistry.getUniquePlaceholder("VAR_" + icu.type);
            i18nIcu.expressionPlaceholder = expPh;
            this._placeholderToContent[expPh] = icu.switchValue;
            return i18nIcu;
        }
        /** @type {?} */
        var phName = this._placeholderRegistry.getPlaceholderName('ICU', icu.sourceSpan.toString());
        /** @type {?} */
        var visitor = new _I18nVisitor(this._expressionParser, this._interpolationConfig);
        this._placeholderToMessage[phName] = visitor.toI18nMessage([icu], '', '', '');
        return new i18n.IcuPlaceholder(i18nIcu, phName, icu.sourceSpan);
    };
    /**
     * @param {?} icuCase
     * @param {?} context
     * @return {?}
     */
    _I18nVisitor.prototype.visitExpansionCase = /**
     * @param {?} icuCase
     * @param {?} context
     * @return {?}
     */
    function (icuCase, context) {
        throw new Error('Unreachable code');
    };
    /**
     * @param {?} text
     * @param {?} sourceSpan
     * @return {?}
     */
    _I18nVisitor.prototype._visitTextWithInterpolation = /**
     * @param {?} text
     * @param {?} sourceSpan
     * @return {?}
     */
    function (text, sourceSpan) {
        /** @type {?} */
        var splitInterpolation = this._expressionParser.splitInterpolation(text, sourceSpan.start.toString(), this._interpolationConfig);
        if (!splitInterpolation) {
            // No expression, return a single text
            return new i18n.Text(text, sourceSpan);
        }
        /** @type {?} */
        var nodes = [];
        /** @type {?} */
        var container = new i18n.Container(nodes, sourceSpan);
        var _a = this._interpolationConfig, sDelimiter = _a.start, eDelimiter = _a.end;
        for (var i = 0; i < splitInterpolation.strings.length - 1; i++) {
            /** @type {?} */
            var expression = splitInterpolation.expressions[i];
            /** @type {?} */
            var baseName = _extractPlaceholderName(expression) || 'INTERPOLATION';
            /** @type {?} */
            var phName = this._placeholderRegistry.getPlaceholderName(baseName, expression);
            if (splitInterpolation.strings[i].length) {
                // No need to add empty strings
                nodes.push(new i18n.Text(splitInterpolation.strings[i], sourceSpan));
            }
            nodes.push(new i18n.Placeholder(expression, phName, sourceSpan));
            this._placeholderToContent[phName] = sDelimiter + expression + eDelimiter;
        }
        /** @type {?} */
        var lastStringIdx = splitInterpolation.strings.length - 1;
        if (splitInterpolation.strings[lastStringIdx].length) {
            nodes.push(new i18n.Text(splitInterpolation.strings[lastStringIdx], sourceSpan));
        }
        return container;
    };
    return _I18nVisitor;
}());
if (false) {
    /** @type {?} */
    _I18nVisitor.prototype._isIcu;
    /** @type {?} */
    _I18nVisitor.prototype._icuDepth;
    /** @type {?} */
    _I18nVisitor.prototype._placeholderRegistry;
    /** @type {?} */
    _I18nVisitor.prototype._placeholderToContent;
    /** @type {?} */
    _I18nVisitor.prototype._placeholderToMessage;
    /** @type {?} */
    _I18nVisitor.prototype._expressionParser;
    /** @type {?} */
    _I18nVisitor.prototype._interpolationConfig;
}
/** @type {?} */
var _CUSTOM_PH_EXP = /\/\/[\s\S]*i18n[\s\S]*\([\s\S]*ph[\s\S]*=[\s\S]*("|')([\s\S]*?)\1[\s\S]*\)/g;
/**
 * @param {?} input
 * @return {?}
 */
function _extractPlaceholderName(input) {
    return input.split(_CUSTOM_PH_EXP)[2];
}
//# sourceMappingURL=i18n_parser.js.map