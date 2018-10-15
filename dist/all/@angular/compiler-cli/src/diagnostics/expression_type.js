"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var symbols_1 = require("./symbols");
var DiagnosticKind;
(function (DiagnosticKind) {
    DiagnosticKind[DiagnosticKind["Error"] = 0] = "Error";
    DiagnosticKind[DiagnosticKind["Warning"] = 1] = "Warning";
})(DiagnosticKind = exports.DiagnosticKind || (exports.DiagnosticKind = {}));
var TypeDiagnostic = /** @class */ (function () {
    function TypeDiagnostic(kind, message, ast) {
        this.kind = kind;
        this.message = message;
        this.ast = ast;
    }
    return TypeDiagnostic;
}());
exports.TypeDiagnostic = TypeDiagnostic;
// AstType calculatetype of the ast given AST element.
var AstType = /** @class */ (function () {
    function AstType(scope, query, context) {
        this.scope = scope;
        this.query = query;
        this.context = context;
    }
    AstType.prototype.getType = function (ast) { return ast.visit(this); };
    AstType.prototype.getDiagnostics = function (ast) {
        this.diagnostics = [];
        var type = ast.visit(this);
        if (this.context.event && type.callable) {
            this.reportWarning('Unexpected callable expression. Expected a method call', ast);
        }
        return this.diagnostics;
    };
    AstType.prototype.visitBinary = function (ast) {
        var _this_1 = this;
        // Treat undefined and null as other.
        function normalize(kind, other) {
            switch (kind) {
                case symbols_1.BuiltinType.Undefined:
                case symbols_1.BuiltinType.Null:
                    return normalize(other, symbols_1.BuiltinType.Other);
            }
            return kind;
        }
        var getType = function (ast, operation) {
            var type = _this_1.getType(ast);
            if (type.nullable) {
                switch (operation) {
                    case '&&':
                    case '||':
                    case '==':
                    case '!=':
                    case '===':
                    case '!==':
                        // Nullable allowed.
                        break;
                    default:
                        _this_1.reportError("The expression might be null", ast);
                        break;
                }
                return _this_1.query.getNonNullableType(type);
            }
            return type;
        };
        var leftType = getType(ast.left, ast.operation);
        var rightType = getType(ast.right, ast.operation);
        var leftRawKind = this.query.getTypeKind(leftType);
        var rightRawKind = this.query.getTypeKind(rightType);
        var leftKind = normalize(leftRawKind, rightRawKind);
        var rightKind = normalize(rightRawKind, leftRawKind);
        // The following swtich implements operator typing similar to the
        // type production tables in the TypeScript specification.
        // https://github.com/Microsoft/TypeScript/blob/v1.8.10/doc/spec.md#4.19
        var operKind = leftKind << 8 | rightKind;
        switch (ast.operation) {
            case '*':
            case '/':
            case '%':
            case '-':
            case '<<':
            case '>>':
            case '>>>':
            case '&':
            case '^':
            case '|':
                switch (operKind) {
                    case symbols_1.BuiltinType.Any << 8 | symbols_1.BuiltinType.Any:
                    case symbols_1.BuiltinType.Number << 8 | symbols_1.BuiltinType.Any:
                    case symbols_1.BuiltinType.Any << 8 | symbols_1.BuiltinType.Number:
                    case symbols_1.BuiltinType.Number << 8 | symbols_1.BuiltinType.Number:
                        return this.query.getBuiltinType(symbols_1.BuiltinType.Number);
                    default:
                        var errorAst = ast.left;
                        switch (leftKind) {
                            case symbols_1.BuiltinType.Any:
                            case symbols_1.BuiltinType.Number:
                                errorAst = ast.right;
                                break;
                        }
                        return this.reportError('Expected a numeric type', errorAst);
                }
            case '+':
                switch (operKind) {
                    case symbols_1.BuiltinType.Any << 8 | symbols_1.BuiltinType.Any:
                    case symbols_1.BuiltinType.Any << 8 | symbols_1.BuiltinType.Boolean:
                    case symbols_1.BuiltinType.Any << 8 | symbols_1.BuiltinType.Number:
                    case symbols_1.BuiltinType.Any << 8 | symbols_1.BuiltinType.Other:
                    case symbols_1.BuiltinType.Boolean << 8 | symbols_1.BuiltinType.Any:
                    case symbols_1.BuiltinType.Number << 8 | symbols_1.BuiltinType.Any:
                    case symbols_1.BuiltinType.Other << 8 | symbols_1.BuiltinType.Any:
                        return this.anyType;
                    case symbols_1.BuiltinType.Any << 8 | symbols_1.BuiltinType.String:
                    case symbols_1.BuiltinType.Boolean << 8 | symbols_1.BuiltinType.String:
                    case symbols_1.BuiltinType.Number << 8 | symbols_1.BuiltinType.String:
                    case symbols_1.BuiltinType.String << 8 | symbols_1.BuiltinType.Any:
                    case symbols_1.BuiltinType.String << 8 | symbols_1.BuiltinType.Boolean:
                    case symbols_1.BuiltinType.String << 8 | symbols_1.BuiltinType.Number:
                    case symbols_1.BuiltinType.String << 8 | symbols_1.BuiltinType.String:
                    case symbols_1.BuiltinType.String << 8 | symbols_1.BuiltinType.Other:
                    case symbols_1.BuiltinType.Other << 8 | symbols_1.BuiltinType.String:
                        return this.query.getBuiltinType(symbols_1.BuiltinType.String);
                    case symbols_1.BuiltinType.Number << 8 | symbols_1.BuiltinType.Number:
                        return this.query.getBuiltinType(symbols_1.BuiltinType.Number);
                    case symbols_1.BuiltinType.Boolean << 8 | symbols_1.BuiltinType.Number:
                    case symbols_1.BuiltinType.Other << 8 | symbols_1.BuiltinType.Number:
                        return this.reportError('Expected a number type', ast.left);
                    case symbols_1.BuiltinType.Number << 8 | symbols_1.BuiltinType.Boolean:
                    case symbols_1.BuiltinType.Number << 8 | symbols_1.BuiltinType.Other:
                        return this.reportError('Expected a number type', ast.right);
                    default:
                        return this.reportError('Expected operands to be a string or number type', ast);
                }
            case '>':
            case '<':
            case '<=':
            case '>=':
            case '==':
            case '!=':
            case '===':
            case '!==':
                switch (operKind) {
                    case symbols_1.BuiltinType.Any << 8 | symbols_1.BuiltinType.Any:
                    case symbols_1.BuiltinType.Any << 8 | symbols_1.BuiltinType.Boolean:
                    case symbols_1.BuiltinType.Any << 8 | symbols_1.BuiltinType.Number:
                    case symbols_1.BuiltinType.Any << 8 | symbols_1.BuiltinType.String:
                    case symbols_1.BuiltinType.Any << 8 | symbols_1.BuiltinType.Other:
                    case symbols_1.BuiltinType.Boolean << 8 | symbols_1.BuiltinType.Any:
                    case symbols_1.BuiltinType.Boolean << 8 | symbols_1.BuiltinType.Boolean:
                    case symbols_1.BuiltinType.Number << 8 | symbols_1.BuiltinType.Any:
                    case symbols_1.BuiltinType.Number << 8 | symbols_1.BuiltinType.Number:
                    case symbols_1.BuiltinType.String << 8 | symbols_1.BuiltinType.Any:
                    case symbols_1.BuiltinType.String << 8 | symbols_1.BuiltinType.String:
                    case symbols_1.BuiltinType.Other << 8 | symbols_1.BuiltinType.Any:
                    case symbols_1.BuiltinType.Other << 8 | symbols_1.BuiltinType.Other:
                        return this.query.getBuiltinType(symbols_1.BuiltinType.Boolean);
                    default:
                        return this.reportError('Expected the operants to be of similar type or any', ast);
                }
            case '&&':
                return rightType;
            case '||':
                return this.query.getTypeUnion(leftType, rightType);
        }
        return this.reportError("Unrecognized operator " + ast.operation, ast);
    };
    AstType.prototype.visitChain = function (ast) {
        if (this.diagnostics) {
            // If we are producing diagnostics, visit the children
            compiler_1.visitAstChildren(ast, this);
        }
        // The type of a chain is always undefined.
        return this.query.getBuiltinType(symbols_1.BuiltinType.Undefined);
    };
    AstType.prototype.visitConditional = function (ast) {
        // The type of a conditional is the union of the true and false conditions.
        if (this.diagnostics) {
            compiler_1.visitAstChildren(ast, this);
        }
        return this.query.getTypeUnion(this.getType(ast.trueExp), this.getType(ast.falseExp));
    };
    AstType.prototype.visitFunctionCall = function (ast) {
        var _this_1 = this;
        // The type of a function call is the return type of the selected signature.
        // The signature is selected based on the types of the arguments. Angular doesn't
        // support contextual typing of arguments so this is simpler than TypeScript's
        // version.
        var args = ast.args.map(function (arg) { return _this_1.getType(arg); });
        var target = this.getType(ast.target);
        if (!target || !target.callable)
            return this.reportError('Call target is not callable', ast);
        var signature = target.selectSignature(args);
        if (signature)
            return signature.result;
        // TODO: Consider a better error message here.
        return this.reportError('Unable no compatible signature found for call', ast);
    };
    AstType.prototype.visitImplicitReceiver = function (ast) {
        var _this = this;
        // Return a pseudo-symbol for the implicit receiver.
        // The members of the implicit receiver are what is defined by the
        // scope passed into this class.
        return {
            name: '$implict',
            kind: 'component',
            language: 'ng-template',
            type: undefined,
            container: undefined,
            callable: false,
            nullable: false,
            public: true,
            definition: undefined,
            members: function () { return _this.scope; },
            signatures: function () { return []; },
            selectSignature: function (types) { return undefined; },
            indexed: function (argument) { return undefined; }
        };
    };
    AstType.prototype.visitInterpolation = function (ast) {
        // If we are producing diagnostics, visit the children.
        if (this.diagnostics) {
            compiler_1.visitAstChildren(ast, this);
        }
        return this.undefinedType;
    };
    AstType.prototype.visitKeyedRead = function (ast) {
        var targetType = this.getType(ast.obj);
        var keyType = this.getType(ast.key);
        var result = targetType.indexed(keyType);
        return result || this.anyType;
    };
    AstType.prototype.visitKeyedWrite = function (ast) {
        // The write of a type is the type of the value being written.
        return this.getType(ast.value);
    };
    AstType.prototype.visitLiteralArray = function (ast) {
        var _this_1 = this;
        var _a;
        // A type literal is an array type of the union of the elements
        return this.query.getArrayType((_a = this.query).getTypeUnion.apply(_a, ast.expressions.map(function (element) { return _this_1.getType(element); })));
    };
    AstType.prototype.visitLiteralMap = function (ast) {
        // If we are producing diagnostics, visit the children
        if (this.diagnostics) {
            compiler_1.visitAstChildren(ast, this);
        }
        // TODO: Return a composite type.
        return this.anyType;
    };
    AstType.prototype.visitLiteralPrimitive = function (ast) {
        // The type of a literal primitive depends on the value of the literal.
        switch (ast.value) {
            case true:
            case false:
                return this.query.getBuiltinType(symbols_1.BuiltinType.Boolean);
            case null:
                return this.query.getBuiltinType(symbols_1.BuiltinType.Null);
            case undefined:
                return this.query.getBuiltinType(symbols_1.BuiltinType.Undefined);
            default:
                switch (typeof ast.value) {
                    case 'string':
                        return this.query.getBuiltinType(symbols_1.BuiltinType.String);
                    case 'number':
                        return this.query.getBuiltinType(symbols_1.BuiltinType.Number);
                    default:
                        return this.reportError('Unrecognized primitive', ast);
                }
        }
    };
    AstType.prototype.visitMethodCall = function (ast) {
        return this.resolveMethodCall(this.getType(ast.receiver), ast);
    };
    AstType.prototype.visitPipe = function (ast) {
        var _this_1 = this;
        // The type of a pipe node is the return type of the pipe's transform method. The table returned
        // by getPipes() is expected to contain symbols with the corresponding transform method type.
        var pipe = this.query.getPipes().get(ast.name);
        if (!pipe)
            return this.reportError("No pipe by the name " + ast.name + " found", ast);
        var expType = this.getType(ast.exp);
        var signature = pipe.selectSignature([expType].concat(ast.args.map(function (arg) { return _this_1.getType(arg); })));
        if (!signature)
            return this.reportError('Unable to resolve signature for pipe invocation', ast);
        return signature.result;
    };
    AstType.prototype.visitPrefixNot = function (ast) {
        // The type of a prefix ! is always boolean.
        return this.query.getBuiltinType(symbols_1.BuiltinType.Boolean);
    };
    AstType.prototype.visitNonNullAssert = function (ast) {
        var expressionType = this.getType(ast.expression);
        return this.query.getNonNullableType(expressionType);
    };
    AstType.prototype.visitPropertyRead = function (ast) {
        return this.resolvePropertyRead(this.getType(ast.receiver), ast);
    };
    AstType.prototype.visitPropertyWrite = function (ast) {
        // The type of a write is the type of the value being written.
        return this.getType(ast.value);
    };
    AstType.prototype.visitQuote = function (ast) {
        // The type of a quoted expression is any.
        return this.query.getBuiltinType(symbols_1.BuiltinType.Any);
    };
    AstType.prototype.visitSafeMethodCall = function (ast) {
        return this.resolveMethodCall(this.query.getNonNullableType(this.getType(ast.receiver)), ast);
    };
    AstType.prototype.visitSafePropertyRead = function (ast) {
        return this.resolvePropertyRead(this.query.getNonNullableType(this.getType(ast.receiver)), ast);
    };
    Object.defineProperty(AstType.prototype, "anyType", {
        get: function () {
            var result = this._anyType;
            if (!result) {
                result = this._anyType = this.query.getBuiltinType(symbols_1.BuiltinType.Any);
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AstType.prototype, "undefinedType", {
        get: function () {
            var result = this._undefinedType;
            if (!result) {
                result = this._undefinedType = this.query.getBuiltinType(symbols_1.BuiltinType.Undefined);
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    AstType.prototype.resolveMethodCall = function (receiverType, ast) {
        var _this_1 = this;
        if (this.isAny(receiverType)) {
            return this.anyType;
        }
        // The type of a method is the selected methods result type.
        var method = receiverType.members().get(ast.name);
        if (!method)
            return this.reportError("Unknown method '" + ast.name + "'", ast);
        if (!method.type)
            return this.reportError("Could not find a type for '" + ast.name + "'", ast);
        if (!method.type.callable)
            return this.reportError("Member '" + ast.name + "' is not callable", ast);
        var signature = method.type.selectSignature(ast.args.map(function (arg) { return _this_1.getType(arg); }));
        if (!signature)
            return this.reportError("Unable to resolve signature for call of method " + ast.name, ast);
        return signature.result;
    };
    AstType.prototype.resolvePropertyRead = function (receiverType, ast) {
        if (this.isAny(receiverType)) {
            return this.anyType;
        }
        // The type of a property read is the seelcted member's type.
        var member = receiverType.members().get(ast.name);
        if (!member) {
            var receiverInfo = receiverType.name;
            if (receiverInfo == '$implict') {
                receiverInfo =
                    'The component declaration, template variable declarations, and element references do';
            }
            else if (receiverType.nullable) {
                return this.reportError("The expression might be null", ast.receiver);
            }
            else {
                receiverInfo = "'" + receiverInfo + "' does";
            }
            return this.reportError("Identifier '" + ast.name + "' is not defined. " + receiverInfo + " not contain such a member", ast);
        }
        if (!member.public) {
            var receiverInfo = receiverType.name;
            if (receiverInfo == '$implict') {
                receiverInfo = 'the component';
            }
            else {
                receiverInfo = "'" + receiverInfo + "'";
            }
            this.reportWarning("Identifier '" + ast.name + "' refers to a private member of " + receiverInfo, ast);
        }
        return member.type;
    };
    AstType.prototype.reportError = function (message, ast) {
        if (this.diagnostics) {
            this.diagnostics.push(new TypeDiagnostic(DiagnosticKind.Error, message, ast));
        }
        return this.anyType;
    };
    AstType.prototype.reportWarning = function (message, ast) {
        if (this.diagnostics) {
            this.diagnostics.push(new TypeDiagnostic(DiagnosticKind.Warning, message, ast));
        }
        return this.anyType;
    };
    AstType.prototype.isAny = function (symbol) {
        return !symbol || this.query.getTypeKind(symbol) == symbols_1.BuiltinType.Any ||
            (!!symbol.type && this.isAny(symbol.type));
    };
    return AstType;
}());
exports.AstType = AstType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwcmVzc2lvbl90eXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9kaWFnbm9zdGljcy9leHByZXNzaW9uX3R5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw4Q0FBMlU7QUFFM1UscUNBQXlGO0FBSXpGLElBQVksY0FHWDtBQUhELFdBQVksY0FBYztJQUN4QixxREFBSyxDQUFBO0lBQ0wseURBQU8sQ0FBQTtBQUNULENBQUMsRUFIVyxjQUFjLEdBQWQsc0JBQWMsS0FBZCxzQkFBYyxRQUd6QjtBQUVEO0lBQ0Usd0JBQW1CLElBQW9CLEVBQVMsT0FBZSxFQUFTLEdBQVE7UUFBN0QsU0FBSSxHQUFKLElBQUksQ0FBZ0I7UUFBUyxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQVMsUUFBRyxHQUFILEdBQUcsQ0FBSztJQUFHLENBQUM7SUFDdEYscUJBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUZZLHdDQUFjO0FBSTNCLHNEQUFzRDtBQUN0RDtJQUlFLGlCQUNZLEtBQWtCLEVBQVUsS0FBa0IsRUFDOUMsT0FBcUM7UUFEckMsVUFBSyxHQUFMLEtBQUssQ0FBYTtRQUFVLFVBQUssR0FBTCxLQUFLLENBQWE7UUFDOUMsWUFBTyxHQUFQLE9BQU8sQ0FBOEI7SUFBRyxDQUFDO0lBRXJELHlCQUFPLEdBQVAsVUFBUSxHQUFRLElBQVksT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVyRCxnQ0FBYyxHQUFkLFVBQWUsR0FBUTtRQUNyQixJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUN0QixJQUFNLElBQUksR0FBVyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLFFBQVEs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