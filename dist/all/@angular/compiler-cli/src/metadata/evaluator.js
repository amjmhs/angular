"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var schema_1 = require("./schema");
// In TypeScript 2.1 the spread element kind was renamed.
var spreadElementSyntaxKind = ts.SyntaxKind.SpreadElement || ts.SyntaxKind.SpreadElementExpression;
function isMethodCallOf(callExpression, memberName) {
    var expression = callExpression.expression;
    if (expression.kind === ts.SyntaxKind.PropertyAccessExpression) {
        var propertyAccessExpression = expression;
        var name_1 = propertyAccessExpression.name;
        if (name_1.kind == ts.SyntaxKind.Identifier) {
            return name_1.text === memberName;
        }
    }
    return false;
}
function isCallOf(callExpression, ident) {
    var expression = callExpression.expression;
    if (expression.kind === ts.SyntaxKind.Identifier) {
        var identifier = expression;
        return identifier.text === ident;
    }
    return false;
}
/* @internal */
function recordMapEntry(entry, node, nodeMap, sourceFile) {
    if (!nodeMap.has(entry)) {
        nodeMap.set(entry, node);
        if (node && (schema_1.isMetadataImportedSymbolReferenceExpression(entry) ||
            schema_1.isMetadataImportDefaultReference(entry)) &&
            entry.line == null) {
            var info = sourceInfo(node, sourceFile);
            if (info.line != null)
                entry.line = info.line;
            if (info.character != null)
                entry.character = info.character;
        }
    }
    return entry;
}
exports.recordMapEntry = recordMapEntry;
/**
 * ts.forEachChild stops iterating children when the callback return a truthy value.
 * This method inverts this to implement an `every` style iterator. It will return
 * true if every call to `cb` returns `true`.
 */
function everyNodeChild(node, cb) {
    return !ts.forEachChild(node, function (node) { return !cb(node); });
}
function isPrimitive(value) {
    return Object(value) !== value;
}
exports.isPrimitive = isPrimitive;
function isDefined(obj) {
    return obj !== undefined;
}
function getSourceFileOfNode(node) {
    while (node && node.kind != ts.SyntaxKind.SourceFile) {
        node = node.parent;
    }
    return node;
}
/* @internal */
function sourceInfo(node, sourceFile) {
    if (node) {
        sourceFile = sourceFile || getSourceFileOfNode(node);
        if (sourceFile) {
            return ts.getLineAndCharacterOfPosition(sourceFile, node.getStart(sourceFile));
        }
    }
    return {};
}
exports.sourceInfo = sourceInfo;
/* @internal */
function errorSymbol(message, node, context, sourceFile) {
    var result = __assign({ __symbolic: 'error', message: message }, sourceInfo(node, sourceFile));
    if (context) {
        result.context = context;
    }
    return result;
}
exports.errorSymbol = errorSymbol;
/**
 * Produce a symbolic representation of an expression folding values into their final value when
 * possible.
 */
var Evaluator = /** @class */ (function () {
    function Evaluator(symbols, nodeMap, options, recordExport) {
        if (options === void 0) { options = {}; }
        this.symbols = symbols;
        this.nodeMap = nodeMap;
        this.options = options;
        this.recordExport = recordExport;
    }
    Evaluator.prototype.nameOf = function (node) {
        if (node && node.kind == ts.SyntaxKind.Identifier) {
            return node.text;
        }
        var result = node && this.evaluateNode(node);
        if (schema_1.isMetadataError(result) || typeof result === 'string') {
            return result;
        }
        else {
            return errorSymbol('Name expected', node, { received: (node && node.getText()) || '<missing>' });
        }
    };
    /**
     * Returns true if the expression represented by `node` can be folded into a literal expression.
     *
     * For example, a literal is always foldable. This means that literal expressions such as `1.2`
     * `"Some value"` `true` `false` are foldable.
     *
     * - An object literal is foldable if all the properties in the literal are foldable.
     * - An array literal is foldable if all the elements are foldable.
     * - A call is foldable if it is a call to a Array.prototype.concat or a call to CONST_EXPR.
     * - A property access is foldable if the object is foldable.
     * - A array index is foldable if index expression is foldable and the array is foldable.
     * - Binary operator expressions are foldable if the left and right expressions are foldable and
     *   it is one of '+', '-', '*', '/', '%', '||', and '&&'.
     * - An identifier is foldable if a value can be found for its symbol in the evaluator symbol
     *   table.
     */
    Evaluator.prototype.isFoldable = function (node) {
        return this.isFoldableWorker(node, new Map());
    };
    Evaluator.prototype.isFoldableWorker = function (node, folding) {
        var _this = this;
        if (node) {
            switch (node.kind) {
                case ts.SyntaxKind.ObjectLiteralExpression:
                    return everyNodeChild(node, function (child) {
                        if (child.kind === ts.SyntaxKind.PropertyAssignment) {
                            var propertyAssignment = child;
                            return _this.isFoldableWorker(propertyAssignment.initializer, folding);
                        }
                        return false;
                    });
                case ts.SyntaxKind.ArrayLiteralExpression:
                    return everyNodeChild(node, function (child) { return _this.isFoldableWorker(child, folding); });
                case ts.SyntaxKind.CallExpression:
                    var callExpression = node;
                    // We can fold a <array>.concat(<v>).
                    if (isMethodCallOf(callExpression, 'concat') &&
                        arrayOrEmpty(callExpression.arguments).length === 1) {
                        var arrayNode = callExpression.expression.expression;
                        if (this.isFoldableWorker(arrayNode, folding) &&
                            this.isFoldableWorker(callExpression.arguments[0], folding)) {
                            // It needs to be an array.
                            var arrayValue = this.evaluateNode(arrayNode);
                            if (arrayValue && Array.isArray(arrayValue)) {
                                return true;
                            }
                        }
                    }
                    // We can fold a call to CONST_EXPR
                    if (isCallOf(callExpression, 'CONST_EXPR') &&
                        arrayOrEmpty(callExpression.arguments).length === 1)
                        return this.isFoldableWorker(callExpression.arguments[0], folding);
                    return false;
                case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
                case ts.SyntaxKind.StringLiteral:
                case ts.SyntaxKind.NumericLiteral:
                case ts.SyntaxKind.NullKeyword:
                case ts.SyntaxKind.TrueKeyword:
                case ts.SyntaxKind.FalseKeyword:
                case ts.SyntaxKind.TemplateHead:
                case ts.SyntaxKind.TemplateMiddle:
                case ts.SyntaxKind.TemplateTail:
                    return true;
                case ts.SyntaxKind.ParenthesizedExpression:
                    var parenthesizedExpression = node;
                    return this.isFoldableWorker(parenthesizedExpression.expression, folding);
                case ts.SyntaxKind.BinaryExpression:
                    var binaryExpression = node;
                    switch (binaryExpression.operatorToken.kind) {
                        case ts.SyntaxKind.PlusToken:
                        case ts.SyntaxKind.MinusToken:
                        case ts.SyntaxKind.AsteriskToken:
                        case ts.SyntaxKind.SlashToken:
                        case ts.SyntaxKind.PercentToken:
                        case ts.SyntaxKind.AmpersandAmpersandToken:
                        case ts.SyntaxKind.BarBarToken:
                            return this.isFoldableWorker(binaryExpression.left, folding) &&
                                this.isFoldableWorker(binaryExpression.right, folding);
                        default:
                            return false;
                    }
                case ts.SyntaxKind.PropertyAccessExpression:
                    var propertyAccessExpression = node;
                    return this.isFoldableWorker(propertyAccessExpression.expression, folding);
                case ts.SyntaxKind.ElementAccessExpression:
                    var elementAccessExpression = node;
                    return this.isFoldableWorker(elementAccessExpression.expression, folding) &&
                        this.isFoldableWorker(elementAccessExpression.argumentExpression, folding);
                case ts.SyntaxKind.Identifier:
                    var identifier = node;
                    var reference = this.symbols.resolve(identifier.text);
                    if (reference !== undefined && isPrimitive(reference)) {
                        return true;
                    }
                    break;
                case ts.SyntaxKind.TemplateExpression:
                    var templateExpression = node;
                    return templateExpression.templateSpans.every(function (span) { return _this.isFoldableWorker(span.expression, folding); });
            }
        }
        return false;
    };
    /**
     * Produce a JSON serialiable object representing `node`. The foldable values in the expression
     * tree are folded. For example, a node representing `1 + 2` is folded into `3`.
     */
    Evaluator.prototype.evaluateNode = function (node, preferReference) {
        var _this = this;
        var t = this;
        var error;
        function recordEntry(entry, node) {
            if (t.options.substituteExpression) {
                var newEntry = t.options.substituteExpression(entry, node);
                if (t.recordExport && newEntry != entry && schema_1.isMetadataGlobalReferenceExpression(newEntry)) {
                    t.recordExport(newEntry.name, entry);
                }
                entry = newEntry;
            }
            return recordMapEntry(entry, node, t.nodeMap);
        }
        function isFoldableError(value) {
            return !t.options.verboseInvalidExpression && schema_1.isMetadataError(value);
        }
        var resolveName = function (name, preferReference) {
            var reference = _this.symbols.resolve(name, preferReference);
            if (reference === undefined) {
                // Encode as a global reference. StaticReflector will check the reference.
                return recordEntry({ __symbolic: 'reference', name: name }, node);
            }
            if (reference && schema_1.isMetadataSymbolicReferenceExpression(reference)) {
                return recordEntry(__assign({}, reference), node);
            }
            return reference;
        };
        switch (node.kind) {
            case ts.SyntaxKind.ObjectLiteralExpression:
                var obj_1 = {};
                var quoted_1 = [];
                ts.forEachChild(node, function (child) {
                    switch (child.kind) {
                        case ts.SyntaxKind.ShorthandPropertyAssignment:
                        case ts.SyntaxKind.PropertyAssignment:
                            var assignment = child;
                            if (assignment.name.kind == ts.SyntaxKind.StringLiteral) {
                                var name_2 = assignment.name.text;
                                quoted_1.push(name_2);
                            }
                            var propertyName = _this.nameOf(assignment.name);
                            if (isFoldableError(propertyName)) {
                                error = propertyName;
                                return true;
                            }
                            var propertyValue = isPropertyAssignment(assignment) ?
                                _this.evaluateNode(assignment.initializer, /* preferReference */ true) :
                                resolveName(propertyName, /* preferReference */ true);
                            if (isFoldableError(propertyValue)) {
                                error = propertyValue;
                                return true; // Stop the forEachChild.
                            }
                            else {
                                obj_1[propertyName] = isPropertyAssignment(assignment) ?
                                    recordEntry(propertyValue, assignment.initializer) :
                                    propertyValue;
                            }
                    }
                });
                if (error)
                    return error;
                if (this.options.quotedNames && quoted_1.length) {
                    obj_1['$quoted$'] = quoted_1;
                }
                return recordEntry(obj_1, node);
            case ts.SyntaxKind.ArrayLiteralExpression:
                var arr_1 = [];
                ts.forEachChild(node, function (child) {
                    var value = _this.evaluateNode(child, /* preferReference */ true);
                    // Check for error
                    if (isFoldableError(value)) {
                        error = value;
                        return true; // Stop the forEachChild.
                    }
                    // Handle spread expressions
                    if (schema_1.isMetadataSymbolicSpreadExpression(value)) {
                        if (Array.isArray(value.expression)) {
                            for (var _i = 0, _a = value.expression; _i < _a.length; _i++) {
                                var spreadValue = _a[_i];
                                arr_1.push(spreadValue);
                            }
                            return;
                        }
                    }
                    arr_1.push(value);
                });
                if (error)
                    return error;
                return recordEntry(arr_1, node);
            case spreadElementSyntaxKind:
                var spreadExpression = this.evaluateNode(node.expression);
                return recordEntry({ __symbolic: 'spread', expression: spreadExpression }, node);
            case ts.SyntaxKind.CallExpression:
                var callExpression = node;
                if (isCallOf(callExpression, 'forwardRef') &&
                    arrayOrEmpty(callExpression.arguments).length === 1) {
                    var firstArgument = callExpression.arguments[0];
                    if (firstArgument.kind == ts.SyntaxKind.ArrowFunction) {
                        var arrowFunction = firstArgument;
                        return recordEntry(this.evaluateNode(arrowFunction.body), node);
                    }
                }
                var args = arrayOrEmpty(callExpression.arguments).map(function (arg) { return _this.evaluateNode(arg); });
                if (this.isFoldable(callExpression)) {
                    if (isMethodCallOf(callExpression, 'concat')) {
                        var arrayValue = this.evaluateNode(callExpression.expression.expression);
                        if (isFoldableError(arrayValue))
                            return arrayValue;
                        return arrayValue.concat(args[0]);
                    }
                }
                // Always fold a CONST_EXPR even if the argument is not foldable.
                if (isCallOf(callExpression, 'CONST_EXPR') &&
                    arrayOrEmpty(callExpression.arguments).length === 1) {
                    return recordEntry(args[0], node);
                }
                var expression = this.evaluateNode(callExpression.expression);
                if (isFoldableError(expression)) {
                    return recordEntry(expression, node);
                }
                var result = { __symbolic: 'call', expression: expression };
                if (args && args.length) {
                    result.arguments = args;
                }
                return recordEntry(result, node);
            case ts.SyntaxKind.NewExpression:
                var newExpression = node;
                var newArgs = arrayOrEmpty(newExpression.arguments).map(function (arg) { return _this.evaluateNode(arg); });
                var newTarget = this.evaluateNode(newExpression.expression);
                if (schema_1.isMetadataError(newTarget)) {
                    return recordEntry(newTarget, node);
                }
                var call = { __symbolic: 'new', expression: newTarget };
                if (newArgs.length) {
                    call.arguments = newArgs;
                }
                return recordEntry(call, node);
            case ts.SyntaxKind.PropertyAccessExpression: {
                var propertyAccessExpression = node;
                var expression_1 = this.evaluateNode(propertyAccessExpression.expression);
                if (isFoldableError(expression_1)) {
                    return recordEntry(expression_1, node);
                }
                var member = this.nameOf(propertyAccessExpression.name);
                if (isFoldableError(member)) {
                    return recordEntry(member, node);
                }
                if (expression_1 && this.isFoldable(propertyAccessExpression.expression))
                    return expression_1[member];
                if (schema_1.isMetadataModuleReferenceExpression(expression_1)) {
                    // A select into a module reference and be converted into a reference to the symbol
                    // in the module
                    return recordEntry({ __symbolic: 'reference', module: expression_1.module, name: member }, node);
                }
                return recordEntry({ __symbolic: 'select', expression: expression_1, member: member }, node);
            }
            case ts.SyntaxKind.ElementAccessExpression: {
                var elementAccessExpression = node;
                var expression_2 = this.evaluateNode(elementAccessExpression.expression);
                if (isFoldableError(expression_2)) {
                    return recordEntry(expression_2, node);
                }
                if (!elementAccessExpression.argumentExpression) {
                    return recordEntry(errorSymbol('Expression form not supported', node), node);
                }
                var index = this.evaluateNode(elementAccessExpression.argumentExpression);
                if (isFoldableError(expression_2)) {
                    return recordEntry(expression_2, node);
                }
                if (this.isFoldable(elementAccessExpression.expression) &&
                    this.isFoldable(elementAccessExpression.argumentExpression))
                    return expression_2[index];
                return recordEntry({ __symbolic: 'index', expression: expression_2, index: index }, node);
            }
            case ts.SyntaxKind.Identifier:
                var identifier = node;
                var name_3 = identifier.text;
                return resolveName(name_3, preferReference);
            case ts.SyntaxKind.TypeReference:
                var typeReferenceNode = node;
                var typeNameNode_1 = typeReferenceNode.typeName;
                var getReference = function (node) {
                    if (typeNameNode_1.kind === ts.SyntaxKind.QualifiedName) {
                        var qualifiedName = node;
                        var left_1 = _this.evaluateNode(qualifiedName.left);
                        if (schema_1.isMetadataModuleReferenceExpression(left_1)) {
                            return recordEntry({
                                __symbolic: 'reference',
                                module: left_1.module,
                                name: qualifiedName.right.text
                            }, node);
                        }
                        // Record a type reference to a declared type as a select.
                        return { __symbolic: 'select', expression: left_1, member: qualifiedName.right.text };
                    }
                    else {
                        var identifier_1 = typeNameNode_1;
                        var symbol = _this.symbols.resolve(identifier_1.text);
                        if (isFoldableError(symbol) || schema_1.isMetadataSymbolicReferenceExpression(symbol)) {
                            return recordEntry(symbol, node);
                        }
                        return recordEntry(errorSymbol('Could not resolve type', node, { typeName: identifier_1.text }), node);
                    }
                };
                var typeReference = getReference(typeNameNode_1);
                if (isFoldableError(typeReference)) {
                    return recordEntry(typeReference, node);
                }
                if (!schema_1.isMetadataModuleReferenceExpression(typeReference) &&
                    typeReferenceNode.typeArguments && typeReferenceNode.typeArguments.length) {
                    var args_1 = typeReferenceNode.typeArguments.map(function (element) { return _this.evaluateNode(element); });
                    // TODO: Remove typecast when upgraded to 2.0 as it will be correctly inferred.
                    // Some versions of 1.9 do not infer this correctly.
                    typeReference.arguments = args_1;
                }
                return recordEntry(typeReference, node);
            case ts.SyntaxKind.UnionType:
                var unionType = node;
                // Remove null and undefined from the list of unions.
                var references = unionType.types
                    .filter(function (n) { return n.kind != ts.SyntaxKind.NullKeyword &&
                    n.kind != ts.SyntaxKind.UndefinedKeyword; })
                    .map(function (n) { return _this.evaluateNode(n); });
                // The remmaining reference must be the same. If two have type arguments consider them
                // different even if the type arguments are the same.
                var candidate = null;
                for (var i = 0; i < references.length; i++) {
                    var reference = references[i];
                    if (schema_1.isMetadataSymbolicReferenceExpression(reference)) {
                        if (candidate) {
                            if (reference.name == candidate.name &&
                                reference.module == candidate.module && !reference.arguments) {
                                candidate = reference;
                            }
                        }
                        else {
                            candidate = reference;
                        }
                    }
                    else {
                        return reference;
                    }
                }
                if (candidate)
                    return candidate;
                break;
            case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
            case ts.SyntaxKind.StringLiteral:
            case ts.SyntaxKind.TemplateHead:
            case ts.SyntaxKind.TemplateTail:
            case ts.SyntaxKind.TemplateMiddle:
                return node.text;
            case ts.SyntaxKind.NumericLiteral:
                return parseFloat(node.text);
            case ts.SyntaxKind.AnyKeyword:
                return recordEntry({ __symbolic: 'reference', name: 'any' }, node);
            case ts.SyntaxKind.StringKeyword:
                return recordEntry({ __symbolic: 'reference', name: 'string' }, node);
            case ts.SyntaxKind.NumberKeyword:
                return recordEntry({ __symbolic: 'reference', name: 'number' }, node);
            case ts.SyntaxKind.BooleanKeyword:
                return recordEntry({ __symbolic: 'reference', name: 'boolean' }, node);
            case ts.SyntaxKind.ArrayType:
                var arrayTypeNode = node;
                return recordEntry({
                    __symbolic: 'reference',
                    name: 'Array',
                    arguments: [this.evaluateNode(arrayTypeNode.elementType)]
                }, node);
            case ts.SyntaxKind.NullKeyword:
                return null;
            case ts.SyntaxKind.TrueKeyword:
                return true;
            case ts.SyntaxKind.FalseKeyword:
                return false;
            case ts.SyntaxKind.ParenthesizedExpression:
                var parenthesizedExpression = node;
                return this.evaluateNode(parenthesizedExpression.expression);
            case ts.SyntaxKind.TypeAssertionExpression:
                var typeAssertion = node;
                return this.evaluateNode(typeAssertion.expression);
            case ts.SyntaxKind.PrefixUnaryExpression:
                var prefixUnaryExpression = node;
                var operand = this.evaluateNode(prefixUnaryExpression.operand);
                if (isDefined(operand) && isPrimitive(operand)) {
                    switch (prefixUnaryExpression.operator) {
                        case ts.SyntaxKind.PlusToken:
                            return +operand;
                        case ts.SyntaxKind.MinusToken:
                            return -operand;
                        case ts.SyntaxKind.TildeToken:
                            return ~operand;
                        case ts.SyntaxKind.ExclamationToken:
                            return !operand;
                    }
                }
                var operatorText = void 0;
                switch (prefixUnaryExpression.operator) {
                    case ts.SyntaxKind.PlusToken:
                        operatorText = '+';
                        break;
                    case ts.SyntaxKind.MinusToken:
                        operatorText = '-';
                        break;
                    case ts.SyntaxKind.TildeToken:
                        operatorText = '~';
                        break;
                    case ts.SyntaxKind.ExclamationToken:
                        operatorText = '!';
                        break;
                    default:
                        return undefined;
                }
                return recordEntry({ __symbolic: 'pre', operator: operatorText, operand: operand }, node);
            case ts.SyntaxKind.BinaryExpression:
                var binaryExpression = node;
                var left = this.evaluateNode(binaryExpression.left);
                var right = this.evaluateNode(binaryExpression.right);
                if (isDefined(left) && isDefined(right)) {
                    if (isPrimitive(left) && isPrimitive(right))
                        switch (binaryExpression.operatorToken.kind) {
                            case ts.SyntaxKind.BarBarToken:
                                return left || right;
                            case ts.SyntaxKind.AmpersandAmpersandToken:
                                return left && right;
                            case ts.SyntaxKind.AmpersandToken:
                                return left & right;
                            case ts.SyntaxKind.BarToken:
                                return left | right;
                            case ts.SyntaxKind.CaretToken:
                                return left ^ right;
                            case ts.SyntaxKind.EqualsEqualsToken:
                                return left == right;
                            case ts.SyntaxKind.ExclamationEqualsToken:
                                return left != right;
                            case ts.SyntaxKind.EqualsEqualsEqualsToken:
                                return left === right;
                            case ts.SyntaxKind.ExclamationEqualsEqualsToken:
                                return left !== right;
                            case ts.SyntaxKind.LessThanToken:
                                return left < right;
                            case ts.SyntaxKind.GreaterThanToken:
                                return left > right;
                            case ts.SyntaxKind.LessThanEqualsToken:
                                return left <= right;
                            case ts.SyntaxKind.GreaterThanEqualsToken:
                                return left >= right;
                            case ts.SyntaxKind.LessThanLessThanToken:
                                return left << right;
                            case ts.SyntaxKind.GreaterThanGreaterThanToken:
                                return left >> right;
                            case ts.SyntaxKind.GreaterThanGreaterThanGreaterThanToken:
                                return left >>> right;
                            case ts.SyntaxKind.PlusToken:
                                return left + right;
                            case ts.SyntaxKind.MinusToken:
                                return left - right;
                            case ts.SyntaxKind.AsteriskToken:
                                return left * right;
                            case ts.SyntaxKind.SlashToken:
                                return left / right;
                            case ts.SyntaxKind.PercentToken:
                                return left % right;
                        }
                    return recordEntry({
                        __symbolic: 'binop',
                        operator: binaryExpression.operatorToken.getText(),
                        left: left,
                        right: right
                    }, node);
                }
                break;
            case ts.SyntaxKind.ConditionalExpression:
                var conditionalExpression = node;
                var condition = this.evaluateNode(conditionalExpression.condition);
                var thenExpression = this.evaluateNode(conditionalExpression.whenTrue);
                var elseExpression = this.evaluateNode(conditionalExpression.whenFalse);
                if (isPrimitive(condition)) {
                    return condition ? thenExpression : elseExpression;
                }
                return recordEntry({ __symbolic: 'if', condition: condition, thenExpression: thenExpression, elseExpression: elseExpression }, node);
            case ts.SyntaxKind.FunctionExpression:
            case ts.SyntaxKind.ArrowFunction:
                return recordEntry(errorSymbol('Lambda not supported', node), node);
            case ts.SyntaxKind.TaggedTemplateExpression:
                return recordEntry(errorSymbol('Tagged template expressions are not supported in metadata', node), node);
            case ts.SyntaxKind.TemplateExpression:
                var templateExpression = node;
                if (this.isFoldable(node)) {
                    return templateExpression.templateSpans.reduce(function (previous, current) { return previous + _this.evaluateNode(current.expression) +
                        _this.evaluateNode(current.literal); }, this.evaluateNode(templateExpression.head));
                }
                else {
                    return templateExpression.templateSpans.reduce(function (previous, current) {
                        var expr = _this.evaluateNode(current.expression);
                        var literal = _this.evaluateNode(current.literal);
                        if (isFoldableError(expr))
                            return expr;
                        if (isFoldableError(literal))
                            return literal;
                        if (typeof previous === 'string' && typeof expr === 'string' &&
                            typeof literal === 'string') {
                            return previous + expr + literal;
                        }
                        var result = expr;
                        if (previous !== '') {
                            result = { __symbolic: 'binop', operator: '+', left: previous, right: expr };
                        }
                        if (literal != '') {
                            result = { __symbolic: 'binop', operator: '+', left: result, right: literal };
                        }
                        return result;
                    }, this.evaluateNode(templateExpression.head));
                }
            case ts.SyntaxKind.AsExpression:
                var asExpression = node;
                return this.evaluateNode(asExpression.expression);
            case ts.SyntaxKind.ClassExpression:
                return { __symbolic: 'class' };
        }
        return recordEntry(errorSymbol('Expression form not supported', node), node);
    };
    return Evaluator;
}());
exports.Evaluator = Evaluator;
function isPropertyAssignment(node) {
    return node.kind == ts.SyntaxKind.PropertyAssignment;
}
var empty = ts.createNodeArray();
function arrayOrEmpty(v) {
    return v || empty;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZhbHVhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9tZXRhZGF0YS9ldmFsdWF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7OztBQUVILCtCQUFpQztBQUdqQyxtQ0FBcWQ7QUFLcmQseURBQXlEO0FBQ3pELElBQU0sdUJBQXVCLEdBQ3hCLEVBQUUsQ0FBQyxVQUFrQixDQUFDLGFBQWEsSUFBSyxFQUFFLENBQUMsVUFBa0IsQ0FBQyx1QkFBdUIsQ0FBQztBQUUzRix3QkFBd0IsY0FBaUMsRUFBRSxVQUFrQjtJQUMzRSxJQUFNLFVBQVUsR0FBRyxjQUFjLENBQUMsVUFBVSxDQUFDO0lBQzdDLElBQUksVUFBVSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLHdCQUF3QixFQUFFO1FBQzlELElBQU0sd0JBQXdCLEdBQWdDLFVBQVUsQ0FBQztRQUN6RSxJQUFNLE1BQUksR0FBRyx3QkFBd0IsQ0FBQyxJQUFJLENBQUM7UUFDM0MsSUFBSSxNQUFJLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFO1lBQ3pDLE9BQU8sTUFBSSxDQUFDLElBQUksS0FBSyxVQUFVLENBQUM7U0FDakM7S0FDRjtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUVELGtCQUFrQixjQUFpQyxFQUFFLEtBQWE7SUFDaEUsSUFBTSxVQUFVLEdBQUcsY0FBYyxDQUFDLFVBQVUsQ0FBQztJQUM3QyxJQUFJLFVBQVUsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUU7UUFDaEQsSUFBTSxVQUFVLEdBQWtCLFVBQVUsQ0FBQztRQUM3QyxPQUFPLFVBQVUsQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDO0tBQ2xDO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FB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