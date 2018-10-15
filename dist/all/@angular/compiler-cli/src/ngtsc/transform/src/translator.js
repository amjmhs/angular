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
var ts = require("typescript");
var path_1 = require("../../util/src/path");
var Context = /** @class */ (function () {
    function Context(isStatement) {
        this.isStatement = isStatement;
    }
    Object.defineProperty(Context.prototype, "withExpressionMode", {
        get: function () { return this.isStatement ? new Context(false) : this; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "withStatementMode", {
        get: function () { return this.isStatement ? new Context(true) : this; },
        enumerable: true,
        configurable: true
    });
    return Context;
}());
exports.Context = Context;
var BINARY_OPERATORS = new Map([
    [compiler_1.BinaryOperator.And, ts.SyntaxKind.AmpersandAmpersandToken],
    [compiler_1.BinaryOperator.Bigger, ts.SyntaxKind.GreaterThanToken],
    [compiler_1.BinaryOperator.BiggerEquals, ts.SyntaxKind.GreaterThanEqualsToken],
    [compiler_1.BinaryOperator.BitwiseAnd, ts.SyntaxKind.AmpersandToken],
    [compiler_1.BinaryOperator.Divide, ts.SyntaxKind.SlashToken],
    [compiler_1.BinaryOperator.Equals, ts.SyntaxKind.EqualsEqualsToken],
    [compiler_1.BinaryOperator.Identical, ts.SyntaxKind.EqualsEqualsEqualsToken],
    [compiler_1.BinaryOperator.Lower, ts.SyntaxKind.LessThanToken],
    [compiler_1.BinaryOperator.LowerEquals, ts.SyntaxKind.LessThanEqualsToken],
    [compiler_1.BinaryOperator.Minus, ts.SyntaxKind.MinusToken],
    [compiler_1.BinaryOperator.Modulo, ts.SyntaxKind.PercentToken],
    [compiler_1.BinaryOperator.Multiply, ts.SyntaxKind.AsteriskToken],
    [compiler_1.BinaryOperator.NotEquals, ts.SyntaxKind.ExclamationEqualsToken],
    [compiler_1.BinaryOperator.NotIdentical, ts.SyntaxKind.ExclamationEqualsEqualsToken],
    [compiler_1.BinaryOperator.Or, ts.SyntaxKind.BarBarToken],
    [compiler_1.BinaryOperator.Plus, ts.SyntaxKind.PlusToken],
]);
var CORE_SUPPORTED_SYMBOLS = new Set([
    'defineInjectable',
    'defineInjector',
    'ɵdefineNgModule',
    'inject',
    'ɵInjectableDef',
    'ɵInjectorDef',
    'ɵNgModuleDef',
]);
var ImportManager = /** @class */ (function () {
    function ImportManager(isCore) {
        this.isCore = isCore;
        this.moduleToIndex = new Map();
        this.nextIndex = 0;
    }
    ImportManager.prototype.generateNamedImport = function (moduleName, symbol) {
        if (!this.moduleToIndex.has(moduleName)) {
            this.moduleToIndex.set(moduleName, "i" + this.nextIndex++);
        }
        if (this.isCore && moduleName === '@angular/core' && !CORE_SUPPORTED_SYMBOLS.has(symbol)) {
            throw new Error("Importing unexpected symbol " + symbol + " while compiling core");
        }
        return this.moduleToIndex.get(moduleName);
    };
    ImportManager.prototype.getAllImports = function (contextPath, rewriteCoreImportsTo) {
        var _this = this;
        return Array.from(this.moduleToIndex.keys()).map(function (name) {
            var as = _this.moduleToIndex.get(name);
            if (rewriteCoreImportsTo !== null && name === '@angular/core') {
                var relative = path_1.relativePathBetween(contextPath, rewriteCoreImportsTo.fileName);
                if (relative === null) {
                    throw new Error("Failed to rewrite import inside core: " + contextPath + " -> " + rewriteCoreImportsTo.fileName);
                }
                name = relative;
            }
            return { name: name, as: as };
        });
    };
    return ImportManager;
}());
exports.ImportManager = ImportManager;
function translateExpression(expression, imports) {
    return expression.visitExpression(new ExpressionTranslatorVisitor(imports), new Context(false));
}
exports.translateExpression = translateExpression;
function translateStatement(statement, imports) {
    return statement.visitStatement(new ExpressionTranslatorVisitor(imports), new Context(true));
}
exports.translateStatement = translateStatement;
function translateType(type, imports) {
    return type.visitType(new TypeTranslatorVisitor(imports), new Context(false));
}
exports.translateType = translateType;
var ExpressionTranslatorVisitor = /** @class */ (function () {
    function ExpressionTranslatorVisitor(imports) {
        this.imports = imports;
    }
    ExpressionTranslatorVisitor.prototype.visitDeclareVarStmt = function (stmt, context) {
        var nodeFlags = stmt.hasModifier(compiler_1.StmtModifier.Final) ? ts.NodeFlags.Const : ts.NodeFlags.None;
        return ts.createVariableStatement(undefined, ts.createVariableDeclarationList([ts.createVariableDeclaration(stmt.name, undefined, stmt.value &&
                stmt.value.visitExpression(this, context.withExpressionMode))], nodeFlags));
    };
    ExpressionTranslatorVisitor.prototype.visitDeclareFunctionStmt = function (stmt, context) {
        var _this = this;
        return ts.createFunctionDeclaration(undefined, undefined, undefined, stmt.name, undefined, stmt.params.map(function (param) { return ts.createParameter(undefined, undefined, undefined, param.name); }), undefined, ts.createBlock(stmt.statements.map(function (child) { return child.visitStatement(_this, context.withStatementMode); })));
    };
    ExpressionTranslatorVisitor.prototype.visitExpressionStmt = function (stmt, context) {
        return ts.createStatement(stmt.expr.visitExpression(this, context.withStatementMode));
    };
    ExpressionTranslatorVisitor.prototype.visitReturnStmt = function (stmt, context) {
        return ts.createReturn(stmt.value.visitExpression(this, context.withExpressionMode));
    };
    ExpressionTranslatorVisitor.prototype.visitDeclareClassStmt = function (stmt, context) {
        throw new Error('Method not implemented.');
    };
    ExpressionTranslatorVisitor.prototype.visitIfStmt = function (stmt, context) {
        var _this = this;
        return ts.createIf(stmt.condition.visitExpression(this, context), ts.createBlock(stmt.trueCase.map(function (child) { return child.visitStatement(_this, context.withStatementMode); })), stmt.falseCase.length > 0 ?
            ts.createBlock(stmt.falseCase.map(function (child) { return child.visitStatement(_this, context.withStatementMode); })) :
            undefined);
    };
    ExpressionTranslatorVisitor.prototype.visitTryCatchStmt = function (stmt, context) {
        throw new Error('Method not implemented.');
    };
    ExpressionTranslatorVisitor.prototype.visitThrowStmt = function (stmt, context) { throw new Error('Method not implemented.'); };
    ExpressionTranslatorVisitor.prototype.visitCommentStmt = function (stmt, context) {
        throw new Error('Method not implemented.');
    };
    ExpressionTranslatorVisitor.prototype.visitJSDocCommentStmt = function (stmt, context) {
        var commentStmt = ts.createNotEmittedStatement(ts.createLiteral(''));
        var text = stmt.toString();
        var kind = ts.SyntaxKind.MultiLineCommentTrivia;
        ts.setSyntheticLeadingComments(commentStmt, [{ kind: kind, text: text, pos: -1, end: -1 }]);
        return commentStmt;
    };
    ExpressionTranslatorVisitor.prototype.visitReadVarExpr = function (ast, context) {
        return ts.createIdentifier(ast.name);
    };
    ExpressionTranslatorVisitor.prototype.visitWriteVarExpr = function (expr, context) {
        var result = ts.createBinary(ts.createIdentifier(expr.name), ts.SyntaxKind.EqualsToken, expr.value.visitExpression(this, context));
        return context.isStatement ? result : ts.createParen(result);
    };
    ExpressionTranslatorVisitor.prototype.visitWriteKeyExpr = function (expr, context) {
        throw new Error('Method not implemented.');
    };
    ExpressionTranslatorVisitor.prototype.visitWritePropExpr = function (expr, context) {
        return ts.createBinary(ts.createPropertyAccess(expr.receiver.visitExpression(this, context), expr.name), ts.SyntaxKind.EqualsToken, expr.value.visitExpression(this, context));
    };
    ExpressionTranslatorVisitor.prototype.visitInvokeMethodExpr = function (ast, context) {
        var _this = this;
        var target = ast.receiver.visitExpression(this, context);
        return ts.createCall(ast.name !== null ? ts.createPropertyAccess(target, ast.name) : target, undefined, ast.args.map(function (arg) { return arg.visitExpression(_this, context); }));
    };
    ExpressionTranslatorVisitor.prototype.visitInvokeFunctionExpr = function (ast, context) {
        var _this = this;
        return ts.createCall(ast.fn.visitExpression(this, context), undefined, ast.args.map(function (arg) { return arg.visitExpression(_this, context); }));
    };
    ExpressionTranslatorVisitor.prototype.visitInstantiateExpr = function (ast, context) {
        var _this = this;
        return ts.createNew(ast.classExpr.visitExpression(this, context), undefined, ast.args.map(function (arg) { return arg.visitExpression(_this, context); }));
    };
    ExpressionTranslatorVisitor.prototype.visitLiteralExpr = function (ast, context) {
        if (ast.value === undefined) {
            return ts.createIdentifier('undefined');
        }
        else if (ast.value === null) {
            return ts.createNull();
        }
        else {
            return ts.createLiteral(ast.value);
        }
    };
    ExpressionTranslatorVisitor.prototype.visitExternalExpr = function (ast, context) {
        if (ast.value.moduleName === null || ast.value.name === null) {
            throw new Error("Import unknown module or symbol " + ast.value);
        }
        return ts.createPropertyAccess(ts.createIdentifier(this.imports.generateNamedImport(ast.value.moduleName, ast.value.name)), ts.createIdentifier(ast.value.name));
    };
    ExpressionTranslatorVisitor.prototype.visitConditionalExpr = function (ast, context) {
        return ts.createParen(ts.createConditional(ast.condition.visitExpression(this, context), ast.trueCase.visitExpression(this, context), ast.falseCase.visitExpression(this, context)));
    };
    ExpressionTranslatorVisitor.prototype.visitNotExpr = function (ast, context) {
        return ts.createPrefix(ts.SyntaxKind.ExclamationToken, ast.condition.visitExpression(this, context));
    };
    ExpressionTranslatorVisitor.prototype.visitAssertNotNullExpr = function (ast, context) {
        return ts.createNonNullExpression(ast.condition.visitExpression(this, context));
    };
    ExpressionTranslatorVisitor.prototype.visitCastExpr = function (ast, context) {
        return ast.value.visitExpression(this, context);
    };
    ExpressionTranslatorVisitor.prototype.visitFunctionExpr = function (ast, context) {
        var _this = this;
        return ts.createFunctionExpression(undefined, undefined, ast.name || undefined, undefined, ast.params.map(function (param) { return ts.createParameter(undefined, undefined, undefined, param.name, undefined, undefined, undefined); }), undefined, ts.createBlock(ast.statements.map(function (stmt) { return stmt.visitStatement(_this, context); })));
    };
    ExpressionTranslatorVisitor.prototype.visitBinaryOperatorExpr = function (ast, context) {
        if (!BINARY_OPERATORS.has(ast.operator)) {
            throw new Error("Unknown binary operator: " + compiler_1.BinaryOperator[ast.operator]);
        }
        var binEx = ts.createBinary(ast.lhs.visitExpression(this, context), BINARY_OPERATORS.get(ast.operator), ast.rhs.visitExpression(this, context));
        return ast.parens ? ts.createParen(binEx) : binEx;
    };
    ExpressionTranslatorVisitor.prototype.visitReadPropExpr = function (ast, context) {
        return ts.createPropertyAccess(ast.receiver.visitExpression(this, context), ast.name);
    };
    ExpressionTranslatorVisitor.prototype.visitReadKeyExpr = function (ast, context) {
        return ts.createElementAccess(ast.receiver.visitExpression(this, context), ast.index.visitExpression(this, context));
    };
    ExpressionTranslatorVisitor.prototype.visitLiteralArrayExpr = function (ast, context) {
        var _this = this;
        return ts.createArrayLiteral(ast.entries.map(function (expr) { return expr.visitExpression(_this, context); }));
    };
    ExpressionTranslatorVisitor.prototype.visitLiteralMapExpr = function (ast, context) {
        var _this = this;
        var entries = ast.entries.map(function (entry) { return ts.createPropertyAssignment(entry.quoted ? ts.createLiteral(entry.key) : ts.createIdentifier(entry.key), entry.value.visitExpression(_this, context)); });
        return ts.createObjectLiteral(entries);
    };
    ExpressionTranslatorVisitor.prototype.visitCommaExpr = function (ast, context) {
        throw new Error('Method not implemented.');
    };
    ExpressionTranslatorVisitor.prototype.visitWrappedNodeExpr = function (ast, context) { return ast.node; };
    ExpressionTranslatorVisitor.prototype.visitTypeofExpr = function (ast, context) {
        return ts.createTypeOf(ast.expr.visitExpression(this, context));
    };
    return ExpressionTranslatorVisitor;
}());
var TypeTranslatorVisitor = /** @class */ (function () {
    function TypeTranslatorVisitor(imports) {
        this.imports = imports;
    }
    TypeTranslatorVisitor.prototype.visitBuiltinType = function (type, context) {
        switch (type.name) {
            case compiler_1.BuiltinTypeName.Bool:
                return 'boolean';
            case compiler_1.BuiltinTypeName.Dynamic:
                return 'any';
            case compiler_1.BuiltinTypeName.Int:
            case compiler_1.BuiltinTypeName.Number:
                return 'number';
            case compiler_1.BuiltinTypeName.String:
                return 'string';
            case compiler_1.BuiltinTypeName.None:
                return 'never';
            default:
                throw new Error("Unsupported builtin type: " + compiler_1.BuiltinTypeName[type.name]);
        }
    };
    TypeTranslatorVisitor.prototype.visitExpressionType = function (type, context) {
        var _this = this;
        var exprStr = type.value.visitExpression(this, context);
        if (type.typeParams !== null) {
            var typeSegments = type.typeParams.map(function (param) { return param.visitType(_this, context); });
            return exprStr + "<" + typeSegments.join(',') + ">";
        }
        else {
            return exprStr;
        }
    };
    TypeTranslatorVisitor.prototype.visitArrayType = function (type, context) {
        return "Array<" + type.visitType(this, context) + ">";
    };
    TypeTranslatorVisitor.prototype.visitMapType = function (type, context) {
        if (type.valueType !== null) {
            return "{[key: string]: " + type.valueType.visitType(this, context) + "}";
        }
        else {
            return '{[key: string]: any}';
        }
    };
    TypeTranslatorVisitor.prototype.visitReadVarExpr = function (ast, context) {
        if (ast.name === null) {
            throw new Error("ReadVarExpr with no variable name in type");
        }
        return ast.name;
    };
    TypeTranslatorVisitor.prototype.visitWriteVarExpr = function (expr, context) {
        throw new Error('Method not implemented.');
    };
    TypeTranslatorVisitor.prototype.visitWriteKeyExpr = function (expr, context) {
        throw new Error('Method not implemented.');
    };
    TypeTranslatorVisitor.prototype.visitWritePropExpr = function (expr, context) {
        throw new Error('Method not implemented.');
    };
    TypeTranslatorVisitor.prototype.visitInvokeMethodExpr = function (ast, context) {
        throw new Error('Method not implemented.');
    };
    TypeTranslatorVisitor.prototype.visitInvokeFunctionExpr = function (ast, context) {
        throw new Error('Method not implemented.');
    };
    TypeTranslatorVisitor.prototype.visitInstantiateExpr = function (ast, context) {
        throw new Error('Method not implemented.');
    };
    TypeTranslatorVisitor.prototype.visitLiteralExpr = function (ast, context) {
        if (typeof ast.value === 'string') {
            var escaped = ast.value.replace(/\'/g, '\\\'');
            return "'" + escaped + "'";
        }
        else {
            return "" + ast.value;
        }
    };
    TypeTranslatorVisitor.prototype.visitExternalExpr = function (ast, context) {
        var _this = this;
        if (ast.value.moduleName === null || ast.value.name === null) {
            throw new Error("Import unknown module or symbol");
        }
        var moduleSymbol = this.imports.generateNamedImport(ast.value.moduleName, ast.value.name);
        var base = moduleSymbol + "." + ast.value.name;
        if (ast.typeParams !== null) {
            var generics = ast.typeParams.map(function (type) { return type.visitType(_this, context); }).join(', ');
            return base + "<" + generics + ">";
        }
        else {
            return base;
        }
    };
    TypeTranslatorVisitor.prototype.visitConditionalExpr = function (ast, context) {
        throw new Error('Method not implemented.');
    };
    TypeTranslatorVisitor.prototype.visitNotExpr = function (ast, context) { throw new Error('Method not implemented.'); };
    TypeTranslatorVisitor.prototype.visitAssertNotNullExpr = function (ast, context) {
        throw new Error('Method not implemented.');
    };
    TypeTranslatorVisitor.prototype.visitCastExpr = function (ast, context) { throw new Error('Method not implemented.'); };
    TypeTranslatorVisitor.prototype.visitFunctionExpr = function (ast, context) {
        throw new Error('Method not implemented.');
    };
    TypeTranslatorVisitor.prototype.visitBinaryOperatorExpr = function (ast, context) {
        throw new Error('Method not implemented.');
    };
    TypeTranslatorVisitor.prototype.visitReadPropExpr = function (ast, context) {
        throw new Error('Method not implemented.');
    };
    TypeTranslatorVisitor.prototype.visitReadKeyExpr = function (ast, context) {
        throw new Error('Method not implemented.');
    };
    TypeTranslatorVisitor.prototype.visitLiteralArrayExpr = function (ast, context) {
        var _this = this;
        var values = ast.entries.map(function (expr) { return expr.visitExpression(_this, context); });
        return "[" + values.join(',') + "]";
    };
    TypeTranslatorVisitor.prototype.visitLiteralMapExpr = function (ast, context) {
        throw new Error('Method not implemented.');
    };
    TypeTranslatorVisitor.prototype.visitCommaExpr = function (ast, context) { throw new Error('Method not implemented.'); };
    TypeTranslatorVisitor.prototype.visitWrappedNodeExpr = function (ast, context) {
        var node = ast.node;
        if (ts.isIdentifier(node)) {
            return node.text;
        }
        else {
            throw new Error("Unsupported WrappedNodeExpr in TypeTranslatorVisitor: " + ts.SyntaxKind[node.kind]);
        }
    };
    TypeTranslatorVisitor.prototype.visitTypeofExpr = function (ast, context) {
        return "typeof " + ast.expr.visitExpression(this, context);
    };
    return TypeTranslatorVisitor;
}());
exports.TypeTranslatorVisitor = TypeTranslatorVisitor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvdHJhbnNmb3JtL3NyYy90cmFuc2xhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsOENBQTZyQjtBQUM3ckIsK0JBQWlDO0FBRWpDLDRDQUF3RDtBQUV4RDtJQUNFLGlCQUFxQixXQUFvQjtRQUFwQixnQkFBVyxHQUFYLFdBQVcsQ0FBUztJQUFHLENBQUM7SUFFN0Msc0JBQUksdUNBQWtCO2FBQXRCLGNBQW9DLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBRTFGLHNCQUFJLHNDQUFpQjthQUFyQixjQUFtQyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUMxRixjQUFDO0FBQUQsQ0FBQyxBQU5ELElBTUM7QUFOWSwwQkFBTztBQVFwQixJQUFNLGdCQUFnQixHQUFHLElBQUksR0FBRyxDQUFvQztJQUNsRSxDQUFDLHlCQUFjLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsdUJBQXVCLENBQUM7SUFDM0QsQ0FBQyx5QkFBYyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDO0lBQ3ZELENBQUMseUJBQWMsQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxzQkFBc0IsQ0FBQztJQUNuRSxDQUFDLHlCQUFjLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDO0lBQ3pELENB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