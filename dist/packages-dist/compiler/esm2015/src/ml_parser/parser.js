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
import { ParseError, ParseSourceSpan } from '../parse_util';
import * as html from './ast';
import { DEFAULT_INTERPOLATION_CONFIG } from './interpolation_config';
import * as lex from './lexer';
import { getNsPrefix, isNgContainer, mergeNsAndName } from './tags';
export class TreeError extends ParseError {
    /**
     * @param {?} elementName
     * @param {?} span
     * @param {?} msg
     */
    constructor(elementName, span, msg) {
        super(span, msg);
        this.elementName = elementName;
    }
    /**
     * @param {?} elementName
     * @param {?} span
     * @param {?} msg
     * @return {?}
     */
    static create(elementName, span, msg) {
        return new TreeError(elementName, span, msg);
    }
}
if (false) {
    /** @type {?} */
    TreeError.prototype.elementName;
}
export class ParseTreeResult {
    /**
     * @param {?} rootNodes
     * @param {?} errors
     */
    constructor(rootNodes, errors) {
        this.rootNodes = rootNodes;
        this.errors = errors;
    }
}
if (false) {
    /** @type {?} */
    ParseTreeResult.prototype.rootNodes;
    /** @type {?} */
    ParseTreeResult.prototype.errors;
}
export class Parser {
    /**
     * @param {?} getTagDefinition
     */
    constructor(getTagDefinition) {
        this.getTagDefinition = getTagDefinition;
    }
    /**
     * @param {?} source
     * @param {?} url
     * @param {?=} parseExpansionForms
     * @param {?=} interpolationConfig
     * @return {?}
     */
    parse(source, url, parseExpansionForms = false, interpolationConfig = DEFAULT_INTERPOLATION_CONFIG) {
        /** @type {?} */
        const tokensAndErrors = lex.tokenize(source, url, this.getTagDefinition, parseExpansionForms, interpolationConfig);
        /** @type {?} */
        const treeAndErrors = new _TreeBuilder(tokensAndErrors.tokens, this.getTagDefinition).build();
        return new ParseTreeResult(treeAndErrors.rootNodes, (/** @type {?} */ (tokensAndErrors.errors)).concat(treeAndErrors.errors));
    }
}
if (false) {
    /** @type {?} */
    Parser.prototype.getTagDefinition;
}
class _TreeBuilder {
    /**
     * @param {?} tokens
     * @param {?} getTagDefinition
     */
    constructor(tokens, getTagDefinition) {
        this.tokens = tokens;
        this.getTagDefinition = getTagDefinition;
        this._index = -1;
        this._rootNodes = [];
        this._errors = [];
        this._elementStack = [];
        this._advance();
    }
    /**
     * @return {?}
     */
    build() {
        while (this._peek.type !== lex.TokenType.EOF) {
            if (this._peek.type === lex.TokenType.TAG_OPEN_START) {
                this._consumeStartTag(this._advance());
            }
            else if (this._peek.type === lex.TokenType.TAG_CLOSE) {
                this._consumeEndTag(this._advance());
            }
            else if (this._peek.type === lex.TokenType.CDATA_START) {
                this._closeVoidElement();
                this._consumeCdata(this._advance());
            }
            else if (this._peek.type === lex.TokenType.COMMENT_START) {
                this._closeVoidElement();
                this._consumeComment(this._advance());
            }
            else if (this._peek.type === lex.TokenType.TEXT || this._peek.type === lex.TokenType.RAW_TEXT ||
                this._peek.type === lex.TokenType.ESCAPABLE_RAW_TEXT) {
                this._closeVoidElement();
                this._consumeText(this._advance());
            }
            else if (this._peek.type === lex.TokenType.EXPANSION_FORM_START) {
                this._consumeExpansion(this._advance());
            }
            else {
                // Skip all other tokens...
                this._advance();
            }
        }
        return new ParseTreeResult(this._rootNodes, this._errors);
    }
    /**
     * @return {?}
     */
    _advance() {
        /** @type {?} */
        const prev = this._peek;
        if (this._index < this.tokens.length - 1) {
            // Note: there is always an EOF token at the end
            this._index++;
        }
        this._peek = this.tokens[this._index];
        return prev;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    _advanceIf(type) {
        if (this._peek.type === type) {
            return this._advance();
        }
        return null;
    }
    /**
     * @param {?} startToken
     * @return {?}
     */
    _consumeCdata(startToken) {
        this._consumeText(this._advance());
        this._advanceIf(lex.TokenType.CDATA_END);
    }
    /**
     * @param {?} token
     * @return {?}
     */
    _consumeComment(token) {
        /** @type {?} */
        const text = this._advanceIf(lex.TokenType.RAW_TEXT);
        this._advanceIf(lex.TokenType.COMMENT_END);
        /** @type {?} */
        const value = text != null ? text.parts[0].trim() : null;
        this._addToParent(new html.Comment(value, token.sourceSpan));
    }
    /**
     * @param {?} token
     * @return {?}
     */
    _consumeExpansion(token) {
        /** @type {?} */
        const switchValue = this._advance();
        /** @type {?} */
        const type = this._advance();
        /** @type {?} */
        const cases = [];
        // read =
        while (this._peek.type === lex.TokenType.EXPANSION_CASE_VALUE) {
            /** @type {?} */
            const expCase = this._parseExpansionCase();
            if (!expCase)
                return; // error
            cases.push(expCase);
        }
        // read the final }
        if (this._peek.type !== lex.TokenType.EXPANSION_FORM_END) {
            this._errors.push(TreeError.create(null, this._peek.sourceSpan, `Invalid ICU message. Missing '}'.`));
            return;
        }
        /** @type {?} */
        const sourceSpan = new ParseSourceSpan(token.sourceSpan.start, this._peek.sourceSpan.end);
        this._addToParent(new html.Expansion(switchValue.parts[0], type.parts[0], cases, sourceSpan, switchValue.sourceSpan));
        this._advance();
    }
    /**
     * @return {?}
     */
    _parseExpansionCase() {
        /** @type {?} */
        const value = this._advance();
        // read {
        if (this._peek.type !== lex.TokenType.EXPANSION_CASE_EXP_START) {
            this._errors.push(TreeError.create(null, this._peek.sourceSpan, `Invalid ICU message. Missing '{'.`));
            return null;
        }
        /** @type {?} */
        const start = this._advance();
        /** @type {?} */
        const exp = this._collectExpansionExpTokens(start);
        if (!exp)
            return null;
        /** @type {?} */
        const end = this._advance();
        exp.push(new lex.Token(lex.TokenType.EOF, [], end.sourceSpan));
        /** @type {?} */
        const parsedExp = new _TreeBuilder(exp, this.getTagDefinition).build();
        if (parsedExp.errors.length > 0) {
            this._errors = this._errors.concat(/** @type {?} */ (parsedExp.errors));
            return null;
        }
        /** @type {?} */
        const sourceSpan = new ParseSourceSpan(value.sourceSpan.start, end.sourceSpan.end);
        /** @type {?} */
        const expSourceSpan = new ParseSourceSpan(start.sourceSpan.start, end.sourceSpan.end);
        return new html.ExpansionCase(value.parts[0], parsedExp.rootNodes, sourceSpan, value.sourceSpan, expSourceSpan);
    }
    /**
     * @param {?} start
     * @return {?}
     */
    _collectExpansionExpTokens(start) {
        /** @type {?} */
        const exp = [];
        /** @type {?} */
        const expansionFormStack = [lex.TokenType.EXPANSION_CASE_EXP_START];
        while (true) {
            if (this._peek.type === lex.TokenType.EXPANSION_FORM_START ||
                this._peek.type === lex.TokenType.EXPANSION_CASE_EXP_START) {
                expansionFormStack.push(this._peek.type);
            }
            if (this._peek.type === lex.TokenType.EXPANSION_CASE_EXP_END) {
                if (lastOnStack(expansionFormStack, lex.TokenType.EXPANSION_CASE_EXP_START)) {
                    expansionFormStack.pop();
                    if (expansionFormStack.length == 0)
                        return exp;
                }
                else {
                    this._errors.push(TreeError.create(null, start.sourceSpan, `Invalid ICU message. Missing '}'.`));
                    return null;
                }
            }
            if (this._peek.type === lex.TokenType.EXPANSION_FORM_END) {
                if (lastOnStack(expansionFormStack, lex.TokenType.EXPANSION_FORM_START)) {
                    expansionFormStack.pop();
                }
                else {
                    this._errors.push(TreeError.create(null, start.sourceSpan, `Invalid ICU message. Missing '}'.`));
                    return null;
                }
            }
            if (this._peek.type === lex.TokenType.EOF) {
                this._errors.push(TreeError.create(null, start.sourceSpan, `Invalid ICU message. Missing '}'.`));
                return null;
            }
            exp.push(this._advance());
        }
    }
    /**
     * @param {?} token
     * @return {?}
     */
    _consumeText(token) {
        /** @type {?} */
        let text = token.parts[0];
        if (text.length > 0 && text[0] == '\n') {
            /** @type {?} */
            const parent = this._getParentElement();
            if (parent != null && parent.children.length == 0 &&
                this.getTagDefinition(parent.name).ignoreFirstLf) {
                text = text.substring(1);
            }
        }
        if (text.length > 0) {
            this._addToParent(new html.Text(text, token.sourceSpan));
        }
    }
    /**
     * @return {?}
     */
    _closeVoidElement() {
        /** @type {?} */
        const el = this._getParentElement();
        if (el && this.getTagDefinition(el.name).isVoid) {
            this._elementStack.pop();
        }
    }
    /**
     * @param {?} startTagToken
     * @return {?}
     */
    _consumeStartTag(startTagToken) {
        /** @type {?} */
        const prefix = startTagToken.parts[0];
        /** @type {?} */
        const name = startTagToken.parts[1];
        /** @type {?} */
        const attrs = [];
        while (this._peek.type === lex.TokenType.ATTR_NAME) {
            attrs.push(this._consumeAttr(this._advance()));
        }
        /** @type {?} */
        const fullName = this._getElementFullName(prefix, name, this._getParentElement());
        /** @type {?} */
        let selfClosing = false;
        // Note: There could have been a tokenizer error
        // so that we don't get a token for the end tag...
        if (this._peek.type === lex.TokenType.TAG_OPEN_END_VOID) {
            this._advance();
            selfClosing = true;
            /** @type {?} */
            const tagDef = this.getTagDefinition(fullName);
            if (!(tagDef.canSelfClose || getNsPrefix(fullName) !== null || tagDef.isVoid)) {
                this._errors.push(TreeError.create(fullName, startTagToken.sourceSpan, `Only void and foreign elements can be self closed "${startTagToken.parts[1]}"`));
            }
        }
        else if (this._peek.type === lex.TokenType.TAG_OPEN_END) {
            this._advance();
            selfClosing = false;
        }
        /** @type {?} */
        const end = this._peek.sourceSpan.start;
        /** @type {?} */
        const span = new ParseSourceSpan(startTagToken.sourceSpan.start, end);
        /** @type {?} */
        const el = new html.Element(fullName, attrs, [], span, span, undefined);
        this._pushElement(el);
        if (selfClosing) {
            this._popElement(fullName);
            el.endSourceSpan = span;
        }
    }
    /**
     * @param {?} el
     * @return {?}
     */
    _pushElement(el) {
        /** @type {?} */
        const parentEl = this._getParentElement();
        if (parentEl && this.getTagDefinition(parentEl.name).isClosedByChild(el.name)) {
            this._elementStack.pop();
        }
        /** @type {?} */
        const tagDef = this.getTagDefinition(el.name);
        const { parent, container } = this._getParentElementSkippingContainers();
        if (parent && tagDef.requireExtraParent(parent.name)) {
            /** @type {?} */
            const newParent = new html.Element(tagDef.parentToAdd, [], [], el.sourceSpan, el.startSourceSpan, el.endSourceSpan);
            this._insertBeforeContainer(parent, container, newParent);
        }
        this._addToParent(el);
        this._elementStack.push(el);
    }
    /**
     * @param {?} endTagToken
     * @return {?}
     */
    _consumeEndTag(endTagToken) {
        /** @type {?} */
        const fullName = this._getElementFullName(endTagToken.parts[0], endTagToken.parts[1], this._getParentElement());
        if (this._getParentElement()) {
            /** @type {?} */ ((this._getParentElement())).endSourceSpan = endTagToken.sourceSpan;
        }
        if (this.getTagDefinition(fullName).isVoid) {
            this._errors.push(TreeError.create(fullName, endTagToken.sourceSpan, `Void elements do not have end tags "${endTagToken.parts[1]}"`));
        }
        else if (!this._popElement(fullName)) {
            /** @type {?} */
            const errMsg = `Unexpected closing tag "${fullName}". It may happen when the tag has already been closed by another tag. For more info see https://www.w3.org/TR/html5/syntax.html#closing-elements-that-have-implied-end-tags`;
            this._errors.push(TreeError.create(fullName, endTagToken.sourceSpan, errMsg));
        }
    }
    /**
     * @param {?} fullName
     * @return {?}
     */
    _popElement(fullName) {
        for (let stackIndex = this._elementStack.length - 1; stackIndex >= 0; stackIndex--) {
            /** @type {?} */
            const el = this._elementStack[stackIndex];
            if (el.name == fullName) {
                this._elementStack.splice(stackIndex, this._elementStack.length - stackIndex);
                return true;
            }
            if (!this.getTagDefinition(el.name).closedByParent) {
                return false;
            }
        }
        return false;
    }
    /**
     * @param {?} attrName
     * @return {?}
     */
    _consumeAttr(attrName) {
        /** @type {?} */
        const fullName = mergeNsAndName(attrName.parts[0], attrName.parts[1]);
        /** @type {?} */
        let end = attrName.sourceSpan.end;
        /** @type {?} */
        let value = '';
        /** @type {?} */
        let valueSpan = /** @type {?} */ ((undefined));
        if (this._peek.type === lex.TokenType.ATTR_VALUE) {
            /** @type {?} */
            const valueToken = this._advance();
            value = valueToken.parts[0];
            end = valueToken.sourceSpan.end;
            valueSpan = valueToken.sourceSpan;
        }
        return new html.Attribute(fullName, value, new ParseSourceSpan(attrName.sourceSpan.start, end), valueSpan);
    }
    /**
     * @return {?}
     */
    _getParentElement() {
        return this._elementStack.length > 0 ? this._elementStack[this._elementStack.length - 1] : null;
    }
    /**
     * Returns the parent in the DOM and the container.
     *
     * `<ng-container>` elements are skipped as they are not rendered as DOM element.
     * @return {?}
     */
    _getParentElementSkippingContainers() {
        /** @type {?} */
        let container = null;
        for (let i = this._elementStack.length - 1; i >= 0; i--) {
            if (!isNgContainer(this._elementStack[i].name)) {
                return { parent: this._elementStack[i], container };
            }
            container = this._elementStack[i];
        }
        return { parent: null, container };
    }
    /**
     * @param {?} node
     * @return {?}
     */
    _addToParent(node) {
        /** @type {?} */
        const parent = this._getParentElement();
        if (parent != null) {
            parent.children.push(node);
        }
        else {
            this._rootNodes.push(node);
        }
    }
    /**
     * Insert a node between the parent and the container.
     * When no container is given, the node is appended as a child of the parent.
     * Also updates the element stack accordingly.
     *
     * \@internal
     * @param {?} parent
     * @param {?} container
     * @param {?} node
     * @return {?}
     */
    _insertBeforeContainer(parent, container, node) {
        if (!container) {
            this._addToParent(node);
            this._elementStack.push(node);
        }
        else {
            if (parent) {
                /** @type {?} */
                const index = parent.children.indexOf(container);
                parent.children[index] = node;
            }
            else {
                this._rootNodes.push(node);
            }
            node.children.push(container);
            this._elementStack.splice(this._elementStack.indexOf(container), 0, node);
        }
    }
    /**
     * @param {?} prefix
     * @param {?} localName
     * @param {?} parentElement
     * @return {?}
     */
    _getElementFullName(prefix, localName, parentElement) {
        if (prefix == null) {
            prefix = /** @type {?} */ ((this.getTagDefinition(localName).implicitNamespacePrefix));
            if (prefix == null && parentElement != null) {
                prefix = getNsPrefix(parentElement.name);
            }
        }
        return mergeNsAndName(prefix, localName);
    }
}
if (false) {
    /** @type {?} */
    _TreeBuilder.prototype._index;
    /** @type {?} */
    _TreeBuilder.prototype._peek;
    /** @type {?} */
    _TreeBuilder.prototype._rootNodes;
    /** @type {?} */
    _TreeBuilder.prototype._errors;
    /** @type {?} */
    _TreeBuilder.prototype._elementStack;
    /** @type {?} */
    _TreeBuilder.prototype.tokens;
    /** @type {?} */
    _TreeBuilder.prototype.getTagDefinition;
}
/**
 * @param {?} stack
 * @param {?} element
 * @return {?}
 */
function lastOnStack(stack, element) {
    return stack.length > 0 && stack[stack.length - 1] === element;
}
//# sourceMappingURL=parser.js.map