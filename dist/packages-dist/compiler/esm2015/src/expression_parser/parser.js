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
import * as chars from '../chars';
import { DEFAULT_INTERPOLATION_CONFIG } from '../ml_parser/interpolation_config';
import { escapeRegExp } from '../util';
import { ASTWithSource, Binary, BindingPipe, Chain, Conditional, EmptyExpr, FunctionCall, ImplicitReceiver, Interpolation, KeyedRead, KeyedWrite, LiteralArray, LiteralMap, LiteralPrimitive, MethodCall, NonNullAssert, ParseSpan, ParserError, PrefixNot, PropertyRead, PropertyWrite, Quote, SafeMethodCall, SafePropertyRead, TemplateBinding } from './ast';
import { EOF, TokenType, isIdentifier, isQuote } from './lexer';
export class SplitInterpolation {
    /**
     * @param {?} strings
     * @param {?} expressions
     * @param {?} offsets
     */
    constructor(strings, expressions, offsets) {
        this.strings = strings;
        this.expressions = expressions;
        this.offsets = offsets;
    }
}
if (false) {
    /** @type {?} */
    SplitInterpolation.prototype.strings;
    /** @type {?} */
    SplitInterpolation.prototype.expressions;
    /** @type {?} */
    SplitInterpolation.prototype.offsets;
}
export class TemplateBindingParseResult {
    /**
     * @param {?} templateBindings
     * @param {?} warnings
     * @param {?} errors
     */
    constructor(templateBindings, warnings, errors) {
        this.templateBindings = templateBindings;
        this.warnings = warnings;
        this.errors = errors;
    }
}
if (false) {
    /** @type {?} */
    TemplateBindingParseResult.prototype.templateBindings;
    /** @type {?} */
    TemplateBindingParseResult.prototype.warnings;
    /** @type {?} */
    TemplateBindingParseResult.prototype.errors;
}
/**
 * @param {?} config
 * @return {?}
 */
function _createInterpolateRegExp(config) {
    /** @type {?} */
    const pattern = escapeRegExp(config.start) + '([\\s\\S]*?)' + escapeRegExp(config.end);
    return new RegExp(pattern, 'g');
}
export class Parser {
    /**
     * @param {?} _lexer
     */
    constructor(_lexer) {
        this._lexer = _lexer;
        this.errors = [];
    }
    /**
     * @param {?} input
     * @param {?} location
     * @param {?=} interpolationConfig
     * @return {?}
     */
    parseAction(input, location, interpolationConfig = DEFAULT_INTERPOLATION_CONFIG) {
        this._checkNoInterpolation(input, location, interpolationConfig);
        /** @type {?} */
        const sourceToLex = this._stripComments(input);
        /** @type {?} */
        const tokens = this._lexer.tokenize(this._stripComments(input));
        /** @type {?} */
        const ast = new _ParseAST(input, location, tokens, sourceToLex.length, true, this.errors, input.length - sourceToLex.length)
            .parseChain();
        return new ASTWithSource(ast, input, location, this.errors);
    }
    /**
     * @param {?} input
     * @param {?} location
     * @param {?=} interpolationConfig
     * @return {?}
     */
    parseBinding(input, location, interpolationConfig = DEFAULT_INTERPOLATION_CONFIG) {
        /** @type {?} */
        const ast = this._parseBindingAst(input, location, interpolationConfig);
        return new ASTWithSource(ast, input, location, this.errors);
    }
    /**
     * @param {?} input
     * @param {?} location
     * @param {?=} interpolationConfig
     * @return {?}
     */
    parseSimpleBinding(input, location, interpolationConfig = DEFAULT_INTERPOLATION_CONFIG) {
        /** @type {?} */
        const ast = this._parseBindingAst(input, location, interpolationConfig);
        /** @type {?} */
        const errors = SimpleExpressionChecker.check(ast);
        if (errors.length > 0) {
            this._reportError(`Host binding expression cannot contain ${errors.join(' ')}`, input, location);
        }
        return new ASTWithSource(ast, input, location, this.errors);
    }
    /**
     * @param {?} message
     * @param {?} input
     * @param {?} errLocation
     * @param {?=} ctxLocation
     * @return {?}
     */
    _reportError(message, input, errLocation, ctxLocation) {
        this.errors.push(new ParserError(message, input, errLocation, ctxLocation));
    }
    /**
     * @param {?} input
     * @param {?} location
     * @param {?} interpolationConfig
     * @return {?}
     */
    _parseBindingAst(input, location, interpolationConfig) {
        /** @type {?} */
        const quote = this._parseQuote(input, location);
        if (quote != null) {
            return quote;
        }
        this._checkNoInterpolation(input, location, interpolationConfig);
        /** @type {?} */
        const sourceToLex = this._stripComments(input);
        /** @type {?} */
        const tokens = this._lexer.tokenize(sourceToLex);
        return new _ParseAST(input, location, tokens, sourceToLex.length, false, this.errors, input.length - sourceToLex.length)
            .parseChain();
    }
    /**
     * @param {?} input
     * @param {?} location
     * @return {?}
     */
    _parseQuote(input, location) {
        if (input == null)
            return null;
        /** @type {?} */
        const prefixSeparatorIndex = input.indexOf(':');
        if (prefixSeparatorIndex == -1)
            return null;
        /** @type {?} */
        const prefix = input.substring(0, prefixSeparatorIndex).trim();
        if (!isIdentifier(prefix))
            return null;
        /** @type {?} */
        const uninterpretedExpression = input.substring(prefixSeparatorIndex + 1);
        return new Quote(new ParseSpan(0, input.length), prefix, uninterpretedExpression, location);
    }
    /**
     * @param {?} tplKey
     * @param {?} tplValue
     * @param {?} location
     * @return {?}
     */
    parseTemplateBindings(tplKey, tplValue, location) {
        /** @type {?} */
        const tokens = this._lexer.tokenize(tplValue);
        return new _ParseAST(tplValue, location, tokens, tplValue.length, false, this.errors, 0)
            .parseTemplateBindings(tplKey);
    }
    /**
     * @param {?} input
     * @param {?} location
     * @param {?=} interpolationConfig
     * @return {?}
     */
    parseInterpolation(input, location, interpolationConfig = DEFAULT_INTERPOLATION_CONFIG) {
        /** @type {?} */
        const split = this.splitInterpolation(input, location, interpolationConfig);
        if (split == null)
            return null;
        /** @type {?} */
        const expressions = [];
        for (let i = 0; i < split.expressions.length; ++i) {
            /** @type {?} */
            const expressionText = split.expressions[i];
            /** @type {?} */
            const sourceToLex = this._stripComments(expressionText);
            /** @type {?} */
            const tokens = this._lexer.tokenize(sourceToLex);
            /** @type {?} */
            const ast = new _ParseAST(input, location, tokens, sourceToLex.length, false, this.errors, split.offsets[i] + (expressionText.length - sourceToLex.length))
                .parseChain();
            expressions.push(ast);
        }
        return new ASTWithSource(new Interpolation(new ParseSpan(0, input == null ? 0 : input.length), split.strings, expressions), input, location, this.errors);
    }
    /**
     * @param {?} input
     * @param {?} location
     * @param {?=} interpolationConfig
     * @return {?}
     */
    splitInterpolation(input, location, interpolationConfig = DEFAULT_INTERPOLATION_CONFIG) {
        /** @type {?} */
        const regexp = _createInterpolateRegExp(interpolationConfig);
        /** @type {?} */
        const parts = input.split(regexp);
        if (parts.length <= 1) {
            return null;
        }
        /** @type {?} */
        const strings = [];
        /** @type {?} */
        const expressions = [];
        /** @type {?} */
        const offsets = [];
        /** @type {?} */
        let offset = 0;
        for (let i = 0; i < parts.length; i++) {
            /** @type {?} */
            const part = parts[i];
            if (i % 2 === 0) {
                // fixed string
                strings.push(part);
                offset += part.length;
            }
            else if (part.trim().length > 0) {
                offset += interpolationConfig.start.length;
                expressions.push(part);
                offsets.push(offset);
                offset += part.length + interpolationConfig.end.length;
            }
            else {
                this._reportError('Blank expressions are not allowed in interpolated strings', input, `at column ${this._findInterpolationErrorColumn(parts, i, interpolationConfig)} in`, location);
                expressions.push('$implict');
                offsets.push(offset);
            }
        }
        return new SplitInterpolation(strings, expressions, offsets);
    }
    /**
     * @param {?} input
     * @param {?} location
     * @return {?}
     */
    wrapLiteralPrimitive(input, location) {
        return new ASTWithSource(new LiteralPrimitive(new ParseSpan(0, input == null ? 0 : input.length), input), input, location, this.errors);
    }
    /**
     * @param {?} input
     * @return {?}
     */
    _stripComments(input) {
        /** @type {?} */
        const i = this._commentStart(input);
        return i != null ? input.substring(0, i).trim() : input;
    }
    /**
     * @param {?} input
     * @return {?}
     */
    _commentStart(input) {
        /** @type {?} */
        let outerQuote = null;
        for (let i = 0; i < input.length - 1; i++) {
            /** @type {?} */
            const char = input.charCodeAt(i);
            /** @type {?} */
            const nextChar = input.charCodeAt(i + 1);
            if (char === chars.$SLASH && nextChar == chars.$SLASH && outerQuote == null)
                return i;
            if (outerQuote === char) {
                outerQuote = null;
            }
            else if (outerQuote == null && isQuote(char)) {
                outerQuote = char;
            }
        }
        return null;
    }
    /**
     * @param {?} input
     * @param {?} location
     * @param {?} interpolationConfig
     * @return {?}
     */
    _checkNoInterpolation(input, location, interpolationConfig) {
        /** @type {?} */
        const regexp = _createInterpolateRegExp(interpolationConfig);
        /** @type {?} */
        const parts = input.split(regexp);
        if (parts.length > 1) {
            this._reportError(`Got interpolation (${interpolationConfig.start}${interpolationConfig.end}) where expression was expected`, input, `at column ${this._findInterpolationErrorColumn(parts, 1, interpolationConfig)} in`, location);
        }
    }
    /**
     * @param {?} parts
     * @param {?} partInErrIdx
     * @param {?} interpolationConfig
     * @return {?}
     */
    _findInterpolationErrorColumn(parts, partInErrIdx, interpolationConfig) {
        /** @type {?} */
        let errLocation = '';
        for (let j = 0; j < partInErrIdx; j++) {
            errLocation += j % 2 === 0 ?
                parts[j] :
                `${interpolationConfig.start}${parts[j]}${interpolationConfig.end}`;
        }
        return errLocation.length;
    }
}
if (false) {
    /** @type {?} */
    Parser.prototype.errors;
    /** @type {?} */
    Parser.prototype._lexer;
}
export class _ParseAST {
    /**
     * @param {?} input
     * @param {?} location
     * @param {?} tokens
     * @param {?} inputLength
     * @param {?} parseAction
     * @param {?} errors
     * @param {?} offset
     */
    constructor(input, location, tokens, inputLength, parseAction, errors, offset) {
        this.input = input;
        this.location = location;
        this.tokens = tokens;
        this.inputLength = inputLength;
        this.parseAction = parseAction;
        this.errors = errors;
        this.offset = offset;
        this.rparensExpected = 0;
        this.rbracketsExpected = 0;
        this.rbracesExpected = 0;
        this.index = 0;
    }
    /**
     * @param {?} offset
     * @return {?}
     */
    peek(offset) {
        /** @type {?} */
        const i = this.index + offset;
        return i < this.tokens.length ? this.tokens[i] : EOF;
    }
    /**
     * @return {?}
     */
    get next() { return this.peek(0); }
    /**
     * @return {?}
     */
    get inputIndex() {
        return (this.index < this.tokens.length) ? this.next.index + this.offset :
            this.inputLength + this.offset;
    }
    /**
     * @param {?} start
     * @return {?}
     */
    span(start) { return new ParseSpan(start, this.inputIndex); }
    /**
     * @return {?}
     */
    advance() { this.index++; }
    /**
     * @param {?} code
     * @return {?}
     */
    optionalCharacter(code) {
        if (this.next.isCharacter(code)) {
            this.advance();
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * @return {?}
     */
    peekKeywordLet() { return this.next.isKeywordLet(); }
    /**
     * @return {?}
     */
    peekKeywordAs() { return this.next.isKeywordAs(); }
    /**
     * @param {?} code
     * @return {?}
     */
    expectCharacter(code) {
        if (this.optionalCharacter(code))
            return;
        this.error(`Missing expected ${String.fromCharCode(code)}`);
    }
    /**
     * @param {?} op
     * @return {?}
     */
    optionalOperator(op) {
        if (this.next.isOperator(op)) {
            this.advance();
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * @param {?} operator
     * @return {?}
     */
    expectOperator(operator) {
        if (this.optionalOperator(operator))
            return;
        this.error(`Missing expected operator ${operator}`);
    }
    /**
     * @return {?}
     */
    expectIdentifierOrKeyword() {
        /** @type {?} */
        const n = this.next;
        if (!n.isIdentifier() && !n.isKeyword()) {
            this.error(`Unexpected token ${n}, expected identifier or keyword`);
            return '';
        }
        this.advance();
        return /** @type {?} */ (n.toString());
    }
    /**
     * @return {?}
     */
    expectIdentifierOrKeywordOrString() {
        /** @type {?} */
        const n = this.next;
        if (!n.isIdentifier() && !n.isKeyword() && !n.isString()) {
            this.error(`Unexpected token ${n}, expected identifier, keyword, or string`);
            return '';
        }
        this.advance();
        return /** @type {?} */ (n.toString());
    }
    /**
     * @return {?}
     */
    parseChain() {
        /** @type {?} */
        const exprs = [];
        /** @type {?} */
        const start = this.inputIndex;
        while (this.index < this.tokens.length) {
            /** @type {?} */
            const expr = this.parsePipe();
            exprs.push(expr);
            if (this.optionalCharacter(chars.$SEMICOLON)) {
                if (!this.parseAction) {
                    this.error('Binding expression cannot contain chained expression');
                }
                while (this.optionalCharacter(chars.$SEMICOLON)) {
                } // read all semicolons
            }
            else if (this.index < this.tokens.length) {
                this.error(`Unexpected token '${this.next}'`);
            }
        }
        if (exprs.length == 0)
            return new EmptyExpr(this.span(start));
        if (exprs.length == 1)
            return exprs[0];
        return new Chain(this.span(start), exprs);
    }
    /**
     * @return {?}
     */
    parsePipe() {
        /** @type {?} */
        let result = this.parseExpression();
        if (this.optionalOperator('|')) {
            if (this.parseAction) {
                this.error('Cannot have a pipe in an action expression');
            }
            do {
                /** @type {?} */
                const name = this.expectIdentifierOrKeyword();
                /** @type {?} */
                const args = [];
                while (this.optionalCharacter(chars.$COLON)) {
                    args.push(this.parseExpression());
                }
                result = new BindingPipe(this.span(result.span.start), result, name, args);
            } while (this.optionalOperator('|'));
        }
        return result;
    }
    /**
     * @return {?}
     */
    parseExpression() { return this.parseConditional(); }
    /**
     * @return {?}
     */
    parseConditional() {
        /** @type {?} */
        const start = this.inputIndex;
        /** @type {?} */
        const result = this.parseLogicalOr();
        if (this.optionalOperator('?')) {
            /** @type {?} */
            const yes = this.parsePipe();
            /** @type {?} */
            let no;
            if (!this.optionalCharacter(chars.$COLON)) {
                /** @type {?} */
                const end = this.inputIndex;
                /** @type {?} */
                const expression = this.input.substring(start, end);
                this.error(`Conditional expression ${expression} requires all 3 expressions`);
                no = new EmptyExpr(this.span(start));
            }
            else {
                no = this.parsePipe();
            }
            return new Conditional(this.span(start), result, yes, no);
        }
        else {
            return result;
        }
    }
    /**
     * @return {?}
     */
    parseLogicalOr() {
        /** @type {?} */
        let result = this.parseLogicalAnd();
        while (this.optionalOperator('||')) {
            /** @type {?} */
            const right = this.parseLogicalAnd();
            result = new Binary(this.span(result.span.start), '||', result, right);
        }
        return result;
    }
    /**
     * @return {?}
     */
    parseLogicalAnd() {
        /** @type {?} */
        let result = this.parseEquality();
        while (this.optionalOperator('&&')) {
            /** @type {?} */
            const right = this.parseEquality();
            result = new Binary(this.span(result.span.start), '&&', result, right);
        }
        return result;
    }
    /**
     * @return {?}
     */
    parseEquality() {
        /** @type {?} */
        let result = this.parseRelational();
        while (this.next.type == TokenType.Operator) {
            /** @type {?} */
            const operator = this.next.strValue;
            switch (operator) {
                case '==':
                case '===':
                case '!=':
                case '!==':
                    this.advance();
                    /** @type {?} */
                    const right = this.parseRelational();
                    result = new Binary(this.span(result.span.start), operator, result, right);
                    continue;
            }
            break;
        }
        return result;
    }
    /**
     * @return {?}
     */
    parseRelational() {
        /** @type {?} */
        let result = this.parseAdditive();
        while (this.next.type == TokenType.Operator) {
            /** @type {?} */
            const operator = this.next.strValue;
            switch (operator) {
                case '<':
                case '>':
                case '<=':
                case '>=':
                    this.advance();
                    /** @type {?} */
                    const right = this.parseAdditive();
                    result = new Binary(this.span(result.span.start), operator, result, right);
                    continue;
            }
            break;
        }
        return result;
    }
    /**
     * @return {?}
     */
    parseAdditive() {
        /** @type {?} */
        let result = this.parseMultiplicative();
        while (this.next.type == TokenType.Operator) {
            /** @type {?} */
            const operator = this.next.strValue;
            switch (operator) {
                case '+':
                case '-':
                    this.advance();
                    /** @type {?} */
                    let right = this.parseMultiplicative();
                    result = new Binary(this.span(result.span.start), operator, result, right);
                    continue;
            }
            break;
        }
        return result;
    }
    /**
     * @return {?}
     */
    parseMultiplicative() {
        /** @type {?} */
        let result = this.parsePrefix();
        while (this.next.type == TokenType.Operator) {
            /** @type {?} */
            const operator = this.next.strValue;
            switch (operator) {
                case '*':
                case '%':
                case '/':
                    this.advance();
                    /** @type {?} */
                    let right = this.parsePrefix();
                    result = new Binary(this.span(result.span.start), operator, result, right);
                    continue;
            }
            break;
        }
        return result;
    }
    /**
     * @return {?}
     */
    parsePrefix() {
        if (this.next.type == TokenType.Operator) {
            /** @type {?} */
            const start = this.inputIndex;
            /** @type {?} */
            const operator = this.next.strValue;
            /** @type {?} */
            let result;
            switch (operator) {
                case '+':
                    this.advance();
                    result = this.parsePrefix();
                    return new Binary(this.span(start), '-', result, new LiteralPrimitive(new ParseSpan(start, start), 0));
                case '-':
                    this.advance();
                    result = this.parsePrefix();
                    return new Binary(this.span(start), operator, new LiteralPrimitive(new ParseSpan(start, start), 0), result);
                case '!':
                    this.advance();
                    result = this.parsePrefix();
                    return new PrefixNot(this.span(start), result);
            }
        }
        return this.parseCallChain();
    }
    /**
     * @return {?}
     */
    parseCallChain() {
        /** @type {?} */
        let result = this.parsePrimary();
        while (true) {
            if (this.optionalCharacter(chars.$PERIOD)) {
                result = this.parseAccessMemberOrMethodCall(result, false);
            }
            else if (this.optionalOperator('?.')) {
                result = this.parseAccessMemberOrMethodCall(result, true);
            }
            else if (this.optionalCharacter(chars.$LBRACKET)) {
                this.rbracketsExpected++;
                /** @type {?} */
                const key = this.parsePipe();
                this.rbracketsExpected--;
                this.expectCharacter(chars.$RBRACKET);
                if (this.optionalOperator('=')) {
                    /** @type {?} */
                    const value = this.parseConditional();
                    result = new KeyedWrite(this.span(result.span.start), result, key, value);
                }
                else {
                    result = new KeyedRead(this.span(result.span.start), result, key);
                }
            }
            else if (this.optionalCharacter(chars.$LPAREN)) {
                this.rparensExpected++;
                /** @type {?} */
                const args = this.parseCallArguments();
                this.rparensExpected--;
                this.expectCharacter(chars.$RPAREN);
                result = new FunctionCall(this.span(result.span.start), result, args);
            }
            else if (this.optionalOperator('!')) {
                result = new NonNullAssert(this.span(result.span.start), result);
            }
            else {
                return result;
            }
        }
    }
    /**
     * @return {?}
     */
    parsePrimary() {
        /** @type {?} */
        const start = this.inputIndex;
        if (this.optionalCharacter(chars.$LPAREN)) {
            this.rparensExpected++;
            /** @type {?} */
            const result = this.parsePipe();
            this.rparensExpected--;
            this.expectCharacter(chars.$RPAREN);
            return result;
        }
        else if (this.next.isKeywordNull()) {
            this.advance();
            return new LiteralPrimitive(this.span(start), null);
        }
        else if (this.next.isKeywordUndefined()) {
            this.advance();
            return new LiteralPrimitive(this.span(start), void 0);
        }
        else if (this.next.isKeywordTrue()) {
            this.advance();
            return new LiteralPrimitive(this.span(start), true);
        }
        else if (this.next.isKeywordFalse()) {
            this.advance();
            return new LiteralPrimitive(this.span(start), false);
        }
        else if (this.next.isKeywordThis()) {
            this.advance();
            return new ImplicitReceiver(this.span(start));
        }
        else if (this.optionalCharacter(chars.$LBRACKET)) {
            this.rbracketsExpected++;
            /** @type {?} */
            const elements = this.parseExpressionList(chars.$RBRACKET);
            this.rbracketsExpected--;
            this.expectCharacter(chars.$RBRACKET);
            return new LiteralArray(this.span(start), elements);
        }
        else if (this.next.isCharacter(chars.$LBRACE)) {
            return this.parseLiteralMap();
        }
        else if (this.next.isIdentifier()) {
            return this.parseAccessMemberOrMethodCall(new ImplicitReceiver(this.span(start)), false);
        }
        else if (this.next.isNumber()) {
            /** @type {?} */
            const value = this.next.toNumber();
            this.advance();
            return new LiteralPrimitive(this.span(start), value);
        }
        else if (this.next.isString()) {
            /** @type {?} */
            const literalValue = this.next.toString();
            this.advance();
            return new LiteralPrimitive(this.span(start), literalValue);
        }
        else if (this.index >= this.tokens.length) {
            this.error(`Unexpected end of expression: ${this.input}`);
            return new EmptyExpr(this.span(start));
        }
        else {
            this.error(`Unexpected token ${this.next}`);
            return new EmptyExpr(this.span(start));
        }
    }
    /**
     * @param {?} terminator
     * @return {?}
     */
    parseExpressionList(terminator) {
        /** @type {?} */
        const result = [];
        if (!this.next.isCharacter(terminator)) {
            do {
                result.push(this.parsePipe());
            } while (this.optionalCharacter(chars.$COMMA));
        }
        return result;
    }
    /**
     * @return {?}
     */
    parseLiteralMap() {
        /** @type {?} */
        const keys = [];
        /** @type {?} */
        const values = [];
        /** @type {?} */
        const start = this.inputIndex;
        this.expectCharacter(chars.$LBRACE);
        if (!this.optionalCharacter(chars.$RBRACE)) {
            this.rbracesExpected++;
            do {
                /** @type {?} */
                const quoted = this.next.isString();
                /** @type {?} */
                const key = this.expectIdentifierOrKeywordOrString();
                keys.push({ key, quoted });
                this.expectCharacter(chars.$COLON);
                values.push(this.parsePipe());
            } while (this.optionalCharacter(chars.$COMMA));
            this.rbracesExpected--;
            this.expectCharacter(chars.$RBRACE);
        }
        return new LiteralMap(this.span(start), keys, values);
    }
    /**
     * @param {?} receiver
     * @param {?=} isSafe
     * @return {?}
     */
    parseAccessMemberOrMethodCall(receiver, isSafe = false) {
        /** @type {?} */
        const start = receiver.span.start;
        /** @type {?} */
        const id = this.expectIdentifierOrKeyword();
        if (this.optionalCharacter(chars.$LPAREN)) {
            this.rparensExpected++;
            /** @type {?} */
            const args = this.parseCallArguments();
            this.expectCharacter(chars.$RPAREN);
            this.rparensExpected--;
            /** @type {?} */
            const span = this.span(start);
            return isSafe ? new SafeMethodCall(span, receiver, id, args) :
                new MethodCall(span, receiver, id, args);
        }
        else {
            if (isSafe) {
                if (this.optionalOperator('=')) {
                    this.error('The \'?.\' operator cannot be used in the assignment');
                    return new EmptyExpr(this.span(start));
                }
                else {
                    return new SafePropertyRead(this.span(start), receiver, id);
                }
            }
            else {
                if (this.optionalOperator('=')) {
                    if (!this.parseAction) {
                        this.error('Bindings cannot contain assignments');
                        return new EmptyExpr(this.span(start));
                    }
                    /** @type {?} */
                    const value = this.parseConditional();
                    return new PropertyWrite(this.span(start), receiver, id, value);
                }
                else {
                    return new PropertyRead(this.span(start), receiver, id);
                }
            }
        }
    }
    /**
     * @return {?}
     */
    parseCallArguments() {
        if (this.next.isCharacter(chars.$RPAREN))
            return [];
        /** @type {?} */
        const positionals = [];
        do {
            positionals.push(this.parsePipe());
        } while (this.optionalCharacter(chars.$COMMA));
        return /** @type {?} */ (positionals);
    }
    /**
     * An identifier, a keyword, a string with an optional `-` in between.
     * @return {?}
     */
    expectTemplateBindingKey() {
        /** @type {?} */
        let result = '';
        /** @type {?} */
        let operatorFound = false;
        do {
            result += this.expectIdentifierOrKeywordOrString();
            operatorFound = this.optionalOperator('-');
            if (operatorFound) {
                result += '-';
            }
        } while (operatorFound);
        return result.toString();
    }
    /**
     * @param {?} tplKey
     * @return {?}
     */
    parseTemplateBindings(tplKey) {
        /** @type {?} */
        let firstBinding = true;
        /** @type {?} */
        const bindings = [];
        /** @type {?} */
        const warnings = [];
        do {
            /** @type {?} */
            const start = this.inputIndex;
            /** @type {?} */
            let rawKey;
            /** @type {?} */
            let key;
            /** @type {?} */
            let isVar = false;
            if (firstBinding) {
                rawKey = key = tplKey;
                firstBinding = false;
            }
            else {
                isVar = this.peekKeywordLet();
                if (isVar)
                    this.advance();
                rawKey = this.expectTemplateBindingKey();
                key = isVar ? rawKey : tplKey + rawKey[0].toUpperCase() + rawKey.substring(1);
                this.optionalCharacter(chars.$COLON);
            }
            /** @type {?} */
            let name = /** @type {?} */ ((null));
            /** @type {?} */
            let expression = null;
            if (isVar) {
                if (this.optionalOperator('=')) {
                    name = this.expectTemplateBindingKey();
                }
                else {
                    name = '\$implicit';
                }
            }
            else if (this.peekKeywordAs()) {
                this.advance(); // consume `as`
                name = rawKey;
                key = this.expectTemplateBindingKey(); // read local var name
                isVar = true;
            }
            else if (this.next !== EOF && !this.peekKeywordLet()) {
                /** @type {?} */
                const start = this.inputIndex;
                /** @type {?} */
                const ast = this.parsePipe();
                /** @type {?} */
                const source = this.input.substring(start - this.offset, this.inputIndex - this.offset);
                expression = new ASTWithSource(ast, source, this.location, this.errors);
            }
            bindings.push(new TemplateBinding(this.span(start), key, isVar, name, expression));
            if (this.peekKeywordAs() && !isVar) {
                /** @type {?} */
                const letStart = this.inputIndex;
                this.advance();
                /** @type {?} */
                const letName = this.expectTemplateBindingKey(); // read local var name
                bindings.push(new TemplateBinding(this.span(letStart), letName, true, key, /** @type {?} */ ((null))));
            }
            if (!this.optionalCharacter(chars.$SEMICOLON)) {
                this.optionalCharacter(chars.$COMMA);
            }
        } while (this.index < this.tokens.length);
        return new TemplateBindingParseResult(bindings, warnings, this.errors);
    }
    /**
     * @param {?} message
     * @param {?=} index
     * @return {?}
     */
    error(message, index = null) {
        this.errors.push(new ParserError(message, this.input, this.locationText(index), this.location));
        this.skip();
    }
    /**
     * @param {?=} index
     * @return {?}
     */
    locationText(index = null) {
        if (index == null)
            index = this.index;
        return (index < this.tokens.length) ? `at column ${this.tokens[index].index + 1} in` :
            `at the end of the expression`;
    }
    /**
     * @return {?}
     */
    skip() {
        /** @type {?} */
        let n = this.next;
        while (this.index < this.tokens.length && !n.isCharacter(chars.$SEMICOLON) &&
            (this.rparensExpected <= 0 || !n.isCharacter(chars.$RPAREN)) &&
            (this.rbracesExpected <= 0 || !n.isCharacter(chars.$RBRACE)) &&
            (this.rbracketsExpected <= 0 || !n.isCharacter(chars.$RBRACKET))) {
            if (this.next.isError()) {
                this.errors.push(new ParserError(/** @type {?} */ ((this.next.toString())), this.input, this.locationText(), this.location));
            }
            this.advance();
            n = this.next;
        }
    }
}
if (false) {
    /** @type {?} */
    _ParseAST.prototype.rparensExpected;
    /** @type {?} */
    _ParseAST.prototype.rbracketsExpected;
    /** @type {?} */
    _ParseAST.prototype.rbracesExpected;
    /** @type {?} */
    _ParseAST.prototype.index;
    /** @type {?} */
    _ParseAST.prototype.input;
    /** @type {?} */
    _ParseAST.prototype.location;
    /** @type {?} */
    _ParseAST.prototype.tokens;
    /** @type {?} */
    _ParseAST.prototype.inputLength;
    /** @type {?} */
    _ParseAST.prototype.parseAction;
    /** @type {?} */
    _ParseAST.prototype.errors;
    /** @type {?} */
    _ParseAST.prototype.offset;
}
class SimpleExpressionChecker {
    constructor() {
        this.errors = [];
    }
    /**
     * @param {?} ast
     * @return {?}
     */
    static check(ast) {
        /** @type {?} */
        const s = new SimpleExpressionChecker();
        ast.visit(s);
        return s.errors;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitImplicitReceiver(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitInterpolation(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitLiteralPrimitive(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitPropertyRead(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitPropertyWrite(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitSafePropertyRead(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitMethodCall(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitSafeMethodCall(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitFunctionCall(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitLiteralArray(ast, context) { this.visitAll(ast.expressions); }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitLiteralMap(ast, context) { this.visitAll(ast.values); }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitBinary(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitPrefixNot(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitNonNullAssert(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitConditional(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitPipe(ast, context) { this.errors.push('pipes'); }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitKeyedRead(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitKeyedWrite(ast, context) { }
    /**
     * @param {?} asts
     * @return {?}
     */
    visitAll(asts) { return asts.map(node => node.visit(this)); }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitChain(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitQuote(ast, context) { }
}
if (false) {
    /** @type {?} */
    SimpleExpressionChecker.prototype.errors;
}
//# sourceMappingURL=parser.js.map