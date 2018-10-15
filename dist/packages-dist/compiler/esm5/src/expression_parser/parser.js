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
var SplitInterpolation = /** @class */ (function () {
    function SplitInterpolation(strings, expressions, offsets) {
        this.strings = strings;
        this.expressions = expressions;
        this.offsets = offsets;
    }
    return SplitInterpolation;
}());
export { SplitInterpolation };
if (false) {
    /** @type {?} */
    SplitInterpolation.prototype.strings;
    /** @type {?} */
    SplitInterpolation.prototype.expressions;
    /** @type {?} */
    SplitInterpolation.prototype.offsets;
}
var TemplateBindingParseResult = /** @class */ (function () {
    function TemplateBindingParseResult(templateBindings, warnings, errors) {
        this.templateBindings = templateBindings;
        this.warnings = warnings;
        this.errors = errors;
    }
    return TemplateBindingParseResult;
}());
export { TemplateBindingParseResult };
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
    var pattern = escapeRegExp(config.start) + '([\\s\\S]*?)' + escapeRegExp(config.end);
    return new RegExp(pattern, 'g');
}
var Parser = /** @class */ (function () {
    function Parser(_lexer) {
        this._lexer = _lexer;
        this.errors = [];
    }
    /**
     * @param {?} input
     * @param {?} location
     * @param {?=} interpolationConfig
     * @return {?}
     */
    Parser.prototype.parseAction = /**
     * @param {?} input
     * @param {?} location
     * @param {?=} interpolationConfig
     * @return {?}
     */
    function (input, location, interpolationConfig) {
        if (interpolationConfig === void 0) { interpolationConfig = DEFAULT_INTERPOLATION_CONFIG; }
        this._checkNoInterpolation(input, location, interpolationConfig);
        /** @type {?} */
        var sourceToLex = this._stripComments(input);
        /** @type {?} */
        var tokens = this._lexer.tokenize(this._stripComments(input));
        /** @type {?} */
        var ast = new _ParseAST(input, location, tokens, sourceToLex.length, true, this.errors, input.length - sourceToLex.length)
            .parseChain();
        return new ASTWithSource(ast, input, location, this.errors);
    };
    /**
     * @param {?} input
     * @param {?} location
     * @param {?=} interpolationConfig
     * @return {?}
     */
    Parser.prototype.parseBinding = /**
     * @param {?} input
     * @param {?} location
     * @param {?=} interpolationConfig
     * @return {?}
     */
    function (input, location, interpolationConfig) {
        if (interpolationConfig === void 0) { interpolationConfig = DEFAULT_INTERPOLATION_CONFIG; }
        /** @type {?} */
        var ast = this._parseBindingAst(input, location, interpolationConfig);
        return new ASTWithSource(ast, input, location, this.errors);
    };
    /**
     * @param {?} input
     * @param {?} location
     * @param {?=} interpolationConfig
     * @return {?}
     */
    Parser.prototype.parseSimpleBinding = /**
     * @param {?} input
     * @param {?} location
     * @param {?=} interpolationConfig
     * @return {?}
     */
    function (input, location, interpolationConfig) {
        if (interpolationConfig === void 0) { interpolationConfig = DEFAULT_INTERPOLATION_CONFIG; }
        /** @type {?} */
        var ast = this._parseBindingAst(input, location, interpolationConfig);
        /** @type {?} */
        var errors = SimpleExpressionChecker.check(ast);
        if (errors.length > 0) {
            this._reportError("Host binding expression cannot contain " + errors.join(' '), input, location);
        }
        return new ASTWithSource(ast, input, location, this.errors);
    };
    /**
     * @param {?} message
     * @param {?} input
     * @param {?} errLocation
     * @param {?=} ctxLocation
     * @return {?}
     */
    Parser.prototype._reportError = /**
     * @param {?} message
     * @param {?} input
     * @param {?} errLocation
     * @param {?=} ctxLocation
     * @return {?}
     */
    function (message, input, errLocation, ctxLocation) {
        this.errors.push(new ParserError(message, input, errLocation, ctxLocation));
    };
    /**
     * @param {?} input
     * @param {?} location
     * @param {?} interpolationConfig
     * @return {?}
     */
    Parser.prototype._parseBindingAst = /**
     * @param {?} input
     * @param {?} location
     * @param {?} interpolationConfig
     * @return {?}
     */
    function (input, location, interpolationConfig) {
        /** @type {?} */
        var quote = this._parseQuote(input, location);
        if (quote != null) {
            return quote;
        }
        this._checkNoInterpolation(input, location, interpolationConfig);
        /** @type {?} */
        var sourceToLex = this._stripComments(input);
        /** @type {?} */
        var tokens = this._lexer.tokenize(sourceToLex);
        return new _ParseAST(input, location, tokens, sourceToLex.length, false, this.errors, input.length - sourceToLex.length)
            .parseChain();
    };
    /**
     * @param {?} input
     * @param {?} location
     * @return {?}
     */
    Parser.prototype._parseQuote = /**
     * @param {?} input
     * @param {?} location
     * @return {?}
     */
    function (input, location) {
        if (input == null)
            return null;
        /** @type {?} */
        var prefixSeparatorIndex = input.indexOf(':');
        if (prefixSeparatorIndex == -1)
            return null;
        /** @type {?} */
        var prefix = input.substring(0, prefixSeparatorIndex).trim();
        if (!isIdentifier(prefix))
            return null;
        /** @type {?} */
        var uninterpretedExpression = input.substring(prefixSeparatorIndex + 1);
        return new Quote(new ParseSpan(0, input.length), prefix, uninterpretedExpression, location);
    };
    /**
     * @param {?} tplKey
     * @param {?} tplValue
     * @param {?} location
     * @return {?}
     */
    Parser.prototype.parseTemplateBindings = /**
     * @param {?} tplKey
     * @param {?} tplValue
     * @param {?} location
     * @return {?}
     */
    function (tplKey, tplValue, location) {
        /** @type {?} */
        var tokens = this._lexer.tokenize(tplValue);
        return new _ParseAST(tplValue, location, tokens, tplValue.length, false, this.errors, 0)
            .parseTemplateBindings(tplKey);
    };
    /**
     * @param {?} input
     * @param {?} location
     * @param {?=} interpolationConfig
     * @return {?}
     */
    Parser.prototype.parseInterpolation = /**
     * @param {?} input
     * @param {?} location
     * @param {?=} interpolationConfig
     * @return {?}
     */
    function (input, location, interpolationConfig) {
        if (interpolationConfig === void 0) { interpolationConfig = DEFAULT_INTERPOLATION_CONFIG; }
        /** @type {?} */
        var split = this.splitInterpolation(input, location, interpolationConfig);
        if (split == null)
            return null;
        /** @type {?} */
        var expressions = [];
        for (var i = 0; i < split.expressions.length; ++i) {
            /** @type {?} */
            var expressionText = split.expressions[i];
            /** @type {?} */
            var sourceToLex = this._stripComments(expressionText);
            /** @type {?} */
            var tokens = this._lexer.tokenize(sourceToLex);
            /** @type {?} */
            var ast = new _ParseAST(input, location, tokens, sourceToLex.length, false, this.errors, split.offsets[i] + (expressionText.length - sourceToLex.length))
                .parseChain();
            expressions.push(ast);
        }
        return new ASTWithSource(new Interpolation(new ParseSpan(0, input == null ? 0 : input.length), split.strings, expressions), input, location, this.errors);
    };
    /**
     * @param {?} input
     * @param {?} location
     * @param {?=} interpolationConfig
     * @return {?}
     */
    Parser.prototype.splitInterpolation = /**
     * @param {?} input
     * @param {?} location
     * @param {?=} interpolationConfig
     * @return {?}
     */
    function (input, location, interpolationConfig) {
        if (interpolationConfig === void 0) { interpolationConfig = DEFAULT_INTERPOLATION_CONFIG; }
        /** @type {?} */
        var regexp = _createInterpolateRegExp(interpolationConfig);
        /** @type {?} */
        var parts = input.split(regexp);
        if (parts.length <= 1) {
            return null;
        }
        /** @type {?} */
        var strings = [];
        /** @type {?} */
        var expressions = [];
        /** @type {?} */
        var offsets = [];
        /** @type {?} */
        var offset = 0;
        for (var i = 0; i < parts.length; i++) {
            /** @type {?} */
            var part = parts[i];
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
                this._reportError('Blank expressions are not allowed in interpolated strings', input, "at column " + this._findInterpolationErrorColumn(parts, i, interpolationConfig) + " in", location);
                expressions.push('$implict');
                offsets.push(offset);
            }
        }
        return new SplitInterpolation(strings, expressions, offsets);
    };
    /**
     * @param {?} input
     * @param {?} location
     * @return {?}
     */
    Parser.prototype.wrapLiteralPrimitive = /**
     * @param {?} input
     * @param {?} location
     * @return {?}
     */
    function (input, location) {
        return new ASTWithSource(new LiteralPrimitive(new ParseSpan(0, input == null ? 0 : input.length), input), input, location, this.errors);
    };
    /**
     * @param {?} input
     * @return {?}
     */
    Parser.prototype._stripComments = /**
     * @param {?} input
     * @return {?}
     */
    function (input) {
        /** @type {?} */
        var i = this._commentStart(input);
        return i != null ? input.substring(0, i).trim() : input;
    };
    /**
     * @param {?} input
     * @return {?}
     */
    Parser.prototype._commentStart = /**
     * @param {?} input
     * @return {?}
     */
    function (input) {
        /** @type {?} */
        var outerQuote = null;
        for (var i = 0; i < input.length - 1; i++) {
            /** @type {?} */
            var char = input.charCodeAt(i);
            /** @type {?} */
            var nextChar = input.charCodeAt(i + 1);
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
    };
    /**
     * @param {?} input
     * @param {?} location
     * @param {?} interpolationConfig
     * @return {?}
     */
    Parser.prototype._checkNoInterpolation = /**
     * @param {?} input
     * @param {?} location
     * @param {?} interpolationConfig
     * @return {?}
     */
    function (input, location, interpolationConfig) {
        /** @type {?} */
        var regexp = _createInterpolateRegExp(interpolationConfig);
        /** @type {?} */
        var parts = input.split(regexp);
        if (parts.length > 1) {
            this._reportError("Got interpolation (" + interpolationConfig.start + interpolationConfig.end + ") where expression was expected", input, "at column " + this._findInterpolationErrorColumn(parts, 1, interpolationConfig) + " in", location);
        }
    };
    /**
     * @param {?} parts
     * @param {?} partInErrIdx
     * @param {?} interpolationConfig
     * @return {?}
     */
    Parser.prototype._findInterpolationErrorColumn = /**
     * @param {?} parts
     * @param {?} partInErrIdx
     * @param {?} interpolationConfig
     * @return {?}
     */
    function (parts, partInErrIdx, interpolationConfig) {
        /** @type {?} */
        var errLocation = '';
        for (var j = 0; j < partInErrIdx; j++) {
            errLocation += j % 2 === 0 ?
                parts[j] :
                "" + interpolationConfig.start + parts[j] + interpolationConfig.end;
        }
        return errLocation.length;
    };
    return Parser;
}());
export { Parser };
if (false) {
    /** @type {?} */
    Parser.prototype.errors;
    /** @type {?} */
    Parser.prototype._lexer;
}
var _ParseAST = /** @class */ (function () {
    function _ParseAST(input, location, tokens, inputLength, parseAction, errors, offset) {
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
    _ParseAST.prototype.peek = /**
     * @param {?} offset
     * @return {?}
     */
    function (offset) {
        /** @type {?} */
        var i = this.index + offset;
        return i < this.tokens.length ? this.tokens[i] : EOF;
    };
    Object.defineProperty(_ParseAST.prototype, "next", {
        get: /**
         * @return {?}
         */
        function () { return this.peek(0); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_ParseAST.prototype, "inputIndex", {
        get: /**
         * @return {?}
         */
        function () {
            return (this.index < this.tokens.length) ? this.next.index + this.offset :
                this.inputLength + this.offset;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} start
     * @return {?}
     */
    _ParseAST.prototype.span = /**
     * @param {?} start
     * @return {?}
     */
    function (start) { return new ParseSpan(start, this.inputIndex); };
    /**
     * @return {?}
     */
    _ParseAST.prototype.advance = /**
     * @return {?}
     */
    function () { this.index++; };
    /**
     * @param {?} code
     * @return {?}
     */
    _ParseAST.prototype.optionalCharacter = /**
     * @param {?} code
     * @return {?}
     */
    function (code) {
        if (this.next.isCharacter(code)) {
            this.advance();
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.peekKeywordLet = /**
     * @return {?}
     */
    function () { return this.next.isKeywordLet(); };
    /**
     * @return {?}
     */
    _ParseAST.prototype.peekKeywordAs = /**
     * @return {?}
     */
    function () { return this.next.isKeywordAs(); };
    /**
     * @param {?} code
     * @return {?}
     */
    _ParseAST.prototype.expectCharacter = /**
     * @param {?} code
     * @return {?}
     */
    function (code) {
        if (this.optionalCharacter(code))
            return;
        this.error("Missing expected " + String.fromCharCode(code));
    };
    /**
     * @param {?} op
     * @return {?}
     */
    _ParseAST.prototype.optionalOperator = /**
     * @param {?} op
     * @return {?}
     */
    function (op) {
        if (this.next.isOperator(op)) {
            this.advance();
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * @param {?} operator
     * @return {?}
     */
    _ParseAST.prototype.expectOperator = /**
     * @param {?} operator
     * @return {?}
     */
    function (operator) {
        if (this.optionalOperator(operator))
            return;
        this.error("Missing expected operator " + operator);
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.expectIdentifierOrKeyword = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var n = this.next;
        if (!n.isIdentifier() && !n.isKeyword()) {
            this.error("Unexpected token " + n + ", expected identifier or keyword");
            return '';
        }
        this.advance();
        return /** @type {?} */ (n.toString());
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.expectIdentifierOrKeywordOrString = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var n = this.next;
        if (!n.isIdentifier() && !n.isKeyword() && !n.isString()) {
            this.error("Unexpected token " + n + ", expected identifier, keyword, or string");
            return '';
        }
        this.advance();
        return /** @type {?} */ (n.toString());
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parseChain = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var exprs = [];
        /** @type {?} */
        var start = this.inputIndex;
        while (this.index < this.tokens.length) {
            /** @type {?} */
            var expr = this.parsePipe();
            exprs.push(expr);
            if (this.optionalCharacter(chars.$SEMICOLON)) {
                if (!this.parseAction) {
                    this.error('Binding expression cannot contain chained expression');
                }
                while (this.optionalCharacter(chars.$SEMICOLON)) {
                } // read all semicolons
            }
            else if (this.index < this.tokens.length) {
                this.error("Unexpected token '" + this.next + "'");
            }
        }
        if (exprs.length == 0)
            return new EmptyExpr(this.span(start));
        if (exprs.length == 1)
            return exprs[0];
        return new Chain(this.span(start), exprs);
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parsePipe = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var result = this.parseExpression();
        if (this.optionalOperator('|')) {
            if (this.parseAction) {
                this.error('Cannot have a pipe in an action expression');
            }
            do {
                /** @type {?} */
                var name_1 = this.expectIdentifierOrKeyword();
                /** @type {?} */
                var args = [];
                while (this.optionalCharacter(chars.$COLON)) {
                    args.push(this.parseExpression());
                }
                result = new BindingPipe(this.span(result.span.start), result, name_1, args);
            } while (this.optionalOperator('|'));
        }
        return result;
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parseExpression = /**
     * @return {?}
     */
    function () { return this.parseConditional(); };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parseConditional = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var start = this.inputIndex;
        /** @type {?} */
        var result = this.parseLogicalOr();
        if (this.optionalOperator('?')) {
            /** @type {?} */
            var yes = this.parsePipe();
            /** @type {?} */
            var no = void 0;
            if (!this.optionalCharacter(chars.$COLON)) {
                /** @type {?} */
                var end = this.inputIndex;
                /** @type {?} */
                var expression = this.input.substring(start, end);
                this.error("Conditional expression " + expression + " requires all 3 expressions");
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
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parseLogicalOr = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var result = this.parseLogicalAnd();
        while (this.optionalOperator('||')) {
            /** @type {?} */
            var right = this.parseLogicalAnd();
            result = new Binary(this.span(result.span.start), '||', result, right);
        }
        return result;
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parseLogicalAnd = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var result = this.parseEquality();
        while (this.optionalOperator('&&')) {
            /** @type {?} */
            var right = this.parseEquality();
            result = new Binary(this.span(result.span.start), '&&', result, right);
        }
        return result;
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parseEquality = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var result = this.parseRelational();
        while (this.next.type == TokenType.Operator) {
            /** @type {?} */
            var operator = this.next.strValue;
            switch (operator) {
                case '==':
                case '===':
                case '!=':
                case '!==':
                    this.advance();
                    /** @type {?} */
                    var right = this.parseRelational();
                    result = new Binary(this.span(result.span.start), operator, result, right);
                    continue;
            }
            break;
        }
        return result;
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parseRelational = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var result = this.parseAdditive();
        while (this.next.type == TokenType.Operator) {
            /** @type {?} */
            var operator = this.next.strValue;
            switch (operator) {
                case '<':
                case '>':
                case '<=':
                case '>=':
                    this.advance();
                    /** @type {?} */
                    var right = this.parseAdditive();
                    result = new Binary(this.span(result.span.start), operator, result, right);
                    continue;
            }
            break;
        }
        return result;
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parseAdditive = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var result = this.parseMultiplicative();
        while (this.next.type == TokenType.Operator) {
            /** @type {?} */
            var operator = this.next.strValue;
            switch (operator) {
                case '+':
                case '-':
                    this.advance();
                    /** @type {?} */
                    var right = this.parseMultiplicative();
                    result = new Binary(this.span(result.span.start), operator, result, right);
                    continue;
            }
            break;
        }
        return result;
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parseMultiplicative = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var result = this.parsePrefix();
        while (this.next.type == TokenType.Operator) {
            /** @type {?} */
            var operator = this.next.strValue;
            switch (operator) {
                case '*':
                case '%':
                case '/':
                    this.advance();
                    /** @type {?} */
                    var right = this.parsePrefix();
                    result = new Binary(this.span(result.span.start), operator, result, right);
                    continue;
            }
            break;
        }
        return result;
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parsePrefix = /**
     * @return {?}
     */
    function () {
        if (this.next.type == TokenType.Operator) {
            /** @type {?} */
            var start = this.inputIndex;
            /** @type {?} */
            var operator = this.next.strValue;
            /** @type {?} */
            var result = void 0;
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
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parseCallChain = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var result = this.parsePrimary();
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
                var key = this.parsePipe();
                this.rbracketsExpected--;
                this.expectCharacter(chars.$RBRACKET);
                if (this.optionalOperator('=')) {
                    /** @type {?} */
                    var value = this.parseConditional();
                    result = new KeyedWrite(this.span(result.span.start), result, key, value);
                }
                else {
                    result = new KeyedRead(this.span(result.span.start), result, key);
                }
            }
            else if (this.optionalCharacter(chars.$LPAREN)) {
                this.rparensExpected++;
                /** @type {?} */
                var args = this.parseCallArguments();
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
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parsePrimary = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var start = this.inputIndex;
        if (this.optionalCharacter(chars.$LPAREN)) {
            this.rparensExpected++;
            /** @type {?} */
            var result = this.parsePipe();
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
            var elements = this.parseExpressionList(chars.$RBRACKET);
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
            var value = this.next.toNumber();
            this.advance();
            return new LiteralPrimitive(this.span(start), value);
        }
        else if (this.next.isString()) {
            /** @type {?} */
            var literalValue = this.next.toString();
            this.advance();
            return new LiteralPrimitive(this.span(start), literalValue);
        }
        else if (this.index >= this.tokens.length) {
            this.error("Unexpected end of expression: " + this.input);
            return new EmptyExpr(this.span(start));
        }
        else {
            this.error("Unexpected token " + this.next);
            return new EmptyExpr(this.span(start));
        }
    };
    /**
     * @param {?} terminator
     * @return {?}
     */
    _ParseAST.prototype.parseExpressionList = /**
     * @param {?} terminator
     * @return {?}
     */
    function (terminator) {
        /** @type {?} */
        var result = [];
        if (!this.next.isCharacter(terminator)) {
            do {
                result.push(this.parsePipe());
            } while (this.optionalCharacter(chars.$COMMA));
        }
        return result;
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parseLiteralMap = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var keys = [];
        /** @type {?} */
        var values = [];
        /** @type {?} */
        var start = this.inputIndex;
        this.expectCharacter(chars.$LBRACE);
        if (!this.optionalCharacter(chars.$RBRACE)) {
            this.rbracesExpected++;
            do {
                /** @type {?} */
                var quoted = this.next.isString();
                /** @type {?} */
                var key = this.expectIdentifierOrKeywordOrString();
                keys.push({ key: key, quoted: quoted });
                this.expectCharacter(chars.$COLON);
                values.push(this.parsePipe());
            } while (this.optionalCharacter(chars.$COMMA));
            this.rbracesExpected--;
            this.expectCharacter(chars.$RBRACE);
        }
        return new LiteralMap(this.span(start), keys, values);
    };
    /**
     * @param {?} receiver
     * @param {?=} isSafe
     * @return {?}
     */
    _ParseAST.prototype.parseAccessMemberOrMethodCall = /**
     * @param {?} receiver
     * @param {?=} isSafe
     * @return {?}
     */
    function (receiver, isSafe) {
        if (isSafe === void 0) { isSafe = false; }
        /** @type {?} */
        var start = receiver.span.start;
        /** @type {?} */
        var id = this.expectIdentifierOrKeyword();
        if (this.optionalCharacter(chars.$LPAREN)) {
            this.rparensExpected++;
            /** @type {?} */
            var args = this.parseCallArguments();
            this.expectCharacter(chars.$RPAREN);
            this.rparensExpected--;
            /** @type {?} */
            var span = this.span(start);
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
                    var value = this.parseConditional();
                    return new PropertyWrite(this.span(start), receiver, id, value);
                }
                else {
                    return new PropertyRead(this.span(start), receiver, id);
                }
            }
        }
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parseCallArguments = /**
     * @return {?}
     */
    function () {
        if (this.next.isCharacter(chars.$RPAREN))
            return [];
        /** @type {?} */
        var positionals = [];
        do {
            positionals.push(this.parsePipe());
        } while (this.optionalCharacter(chars.$COMMA));
        return /** @type {?} */ (positionals);
    };
    /**
     * An identifier, a keyword, a string with an optional `-` in between.
     */
    /**
     * An identifier, a keyword, a string with an optional `-` in between.
     * @return {?}
     */
    _ParseAST.prototype.expectTemplateBindingKey = /**
     * An identifier, a keyword, a string with an optional `-` in between.
     * @return {?}
     */
    function () {
        /** @type {?} */
        var result = '';
        /** @type {?} */
        var operatorFound = false;
        do {
            result += this.expectIdentifierOrKeywordOrString();
            operatorFound = this.optionalOperator('-');
            if (operatorFound) {
                result += '-';
            }
        } while (operatorFound);
        return result.toString();
    };
    // Parses the AST for `<some-tag *tplKey=AST>`
    /**
     * @param {?} tplKey
     * @return {?}
     */
    _ParseAST.prototype.parseTemplateBindings = /**
     * @param {?} tplKey
     * @return {?}
     */
    function (tplKey) {
        /** @type {?} */
        var firstBinding = true;
        /** @type {?} */
        var bindings = [];
        /** @type {?} */
        var warnings = [];
        do {
            /** @type {?} */
            var start = this.inputIndex;
            /** @type {?} */
            var rawKey = void 0;
            /** @type {?} */
            var key = void 0;
            /** @type {?} */
            var isVar = false;
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
            var name_2 = /** @type {?} */ ((null));
            /** @type {?} */
            var expression = null;
            if (isVar) {
                if (this.optionalOperator('=')) {
                    name_2 = this.expectTemplateBindingKey();
                }
                else {
                    name_2 = '\$implicit';
                }
            }
            else if (this.peekKeywordAs()) {
                this.advance(); // consume `as`
                name_2 = rawKey;
                key = this.expectTemplateBindingKey(); // read local var name
                isVar = true;
            }
            else if (this.next !== EOF && !this.peekKeywordLet()) {
                /** @type {?} */
                var start_1 = this.inputIndex;
                /** @type {?} */
                var ast = this.parsePipe();
                /** @type {?} */
                var source = this.input.substring(start_1 - this.offset, this.inputIndex - this.offset);
                expression = new ASTWithSource(ast, source, this.location, this.errors);
            }
            bindings.push(new TemplateBinding(this.span(start), key, isVar, name_2, expression));
            if (this.peekKeywordAs() && !isVar) {
                /** @type {?} */
                var letStart = this.inputIndex;
                this.advance();
                /** @type {?} */
                var letName = this.expectTemplateBindingKey(); // read local var name
                bindings.push(new TemplateBinding(this.span(letStart), letName, true, key, /** @type {?} */ ((null))));
            }
            if (!this.optionalCharacter(chars.$SEMICOLON)) {
                this.optionalCharacter(chars.$COMMA);
            }
        } while (this.index < this.tokens.length);
        return new TemplateBindingParseResult(bindings, warnings, this.errors);
    };
    /**
     * @param {?} message
     * @param {?=} index
     * @return {?}
     */
    _ParseAST.prototype.error = /**
     * @param {?} message
     * @param {?=} index
     * @return {?}
     */
    function (message, index) {
        if (index === void 0) { index = null; }
        this.errors.push(new ParserError(message, this.input, this.locationText(index), this.location));
        this.skip();
    };
    /**
     * @param {?=} index
     * @return {?}
     */
    _ParseAST.prototype.locationText = /**
     * @param {?=} index
     * @return {?}
     */
    function (index) {
        if (index === void 0) { index = null; }
        if (index == null)
            index = this.index;
        return (index < this.tokens.length) ? "at column " + (this.tokens[index].index + 1) + " in" :
            "at the end of the expression";
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.skip = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var n = this.next;
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
    };
    return _ParseAST;
}());
export { _ParseAST };
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
var SimpleExpressionChecker = /** @class */ (function () {
    function SimpleExpressionChecker() {
        this.errors = [];
    }
    /**
     * @param {?} ast
     * @return {?}
     */
    SimpleExpressionChecker.check = /**
     * @param {?} ast
     * @return {?}
     */
    function (ast) {
        /** @type {?} */
        var s = new SimpleExpressionChecker();
        ast.visit(s);
        return s.errors;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitImplicitReceiver = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitInterpolation = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitLiteralPrimitive = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitPropertyRead = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitPropertyWrite = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitSafePropertyRead = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitMethodCall = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitSafeMethodCall = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitFunctionCall = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitLiteralArray = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) { this.visitAll(ast.expressions); };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitLiteralMap = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) { this.visitAll(ast.values); };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitBinary = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitPrefixNot = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitNonNullAssert = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitConditional = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitPipe = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) { this.errors.push('pipes'); };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitKeyedRead = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitKeyedWrite = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) { };
    /**
     * @param {?} asts
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitAll = /**
     * @param {?} asts
     * @return {?}
     */
    function (asts) {
        var _this = this;
        return asts.map(function (node) { return node.visit(_this); });
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitChain = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitQuote = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) { };
    return SimpleExpressionChecker;
}());
if (false) {
    /** @type {?} */
    SimpleExpressionChecker.prototype.errors;
}
//# sourceMappingURL=parser.js.map