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
var util_1 = require("./util");
var METHOD_THIS_NAME = 'this';
var CATCH_ERROR_NAME = 'error';
var CATCH_STACK_NAME = 'stack';
var _VALID_IDENTIFIER_RE = /^[$A-Z_][0-9A-Z_$]*$/i;
var TypeScriptNodeEmitter = /** @class */ (function () {
    function TypeScriptNodeEmitter() {
    }
    TypeScriptNodeEmitter.prototype.updateSourceFile = function (sourceFile, stmts, preamble) {
        var converter = new NodeEmitterVisitor();
        // [].concat flattens the result so that each `visit...` method can also return an array of
        // stmts.
        var statements = [].concat.apply([], stmts.map(function (stmt) { return stmt.visitStatement(converter, null); }).filter(function (stmt) { return stmt != null; }));
        var preambleStmts = [];
        if (preamble) {
            var commentStmt = this.createCommentStatement(sourceFile, preamble);
            preambleStmts.push(commentStmt);
        }
        var sourceStatements = preambleStmts.concat(converter.getReexports(), converter.getImports(), statements);
        converter.updateSourceMap(sourceStatements);
        var newSourceFile = ts.updateSourceFileNode(sourceFile, sourceStatements);
        return [newSourceFile, converter.getNodeMap()];
    };
    /** Creates a not emitted statement containing the given comment. */
    TypeScriptNodeEmitter.prototype.createCommentStatement = function (sourceFile, comment) {
        if (comment.startsWith('/*') && comment.endsWith('*/')) {
            comment = comment.substr(2, comment.length - 4);
        }
        var commentStmt = ts.createNotEmittedStatement(sourceFile);
        ts.setSyntheticLeadingComments(commentStmt, [{ kind: ts.SyntaxKind.MultiLineCommentTrivia, text: comment, pos: -1, end: -1 }]);
        ts.setEmitFlags(commentStmt, ts.EmitFlags.CustomPrologue);
        return commentStmt;
    };
    return TypeScriptNodeEmitter;
}());
exports.TypeScriptNodeEmitter = TypeScriptNodeEmitter;
/**
 * Update the given source file to include the changes specified in module.
 *
 * The module parameter is treated as a partial module meaning that the statements are added to
 * the module instead of replacing the module. Also, any classes are treated as partial classes
 * and the included members are added to the class with the same name instead of a new class
 * being created.
 */
function updateSourceFile(sourceFile, module, context) {
    var converter = new NodeEmitterVisitor();
    converter.loadExportedVariableIdentifiers(sourceFile);
    var prefixStatements = module.statements.filter(function (statement) { return !(statement instanceof compiler_1.ClassStmt); });
    var classes = module.statements.filter(function (statement) { return statement instanceof compiler_1.ClassStmt; });
    var classMap = new Map(classes.map(function (classStatement) { return [classStatement.name, classStatement]; }));
    var classNames = new Set(classes.map(function (classStatement) { return classStatement.name; }));
    var prefix = prefixStatements.map(function (statement) { return statement.visitStatement(converter, sourceFile); });
    // Add static methods to all the classes referenced in module.
    var newStatements = sourceFile.statements.map(function (node) {
        if (node.kind == ts.SyntaxKind.ClassDeclaration) {
            var classDeclaration = node;
            var name_1 = classDeclaration.name;
            if (name_1) {
                var classStatement = classMap.get(name_1.text);
                if (classStatement) {
                    classNames.delete(name_1.text);
                    var classMemberHolder = converter.visitDeclareClassStmt(classStatement);
                    var newMethods = classMemberHolder.members.filter(function (member) { return member.kind !== ts.SyntaxKind.Constructor; });
                    var newMembers = classDeclaration.members.concat(newMethods);
                    return ts.updateClassDeclaration(classDeclaration, 
                    /* decorators */ classDeclaration.decorators, 
                    /* modifiers */ classDeclaration.modifiers, 
                    /* name */ classDeclaration.name, 
                    /* typeParameters */ classDeclaration.typeParameters, 
                    /* heritageClauses */ classDeclaration.heritageClauses || [], 
                    /* members */ newMembers);
                }
            }
        }
        return node;
    });
    // Validate that all the classes have been generated
    classNames.size == 0 ||
        util_1.error((classNames.size == 1 ? 'Class' : 'Classes') + " \"" + Array.from(classNames.keys()).join(', ') + "\" not generated");
    // Add imports to the module required by the new methods
    var imports = converter.getImports();
    if (imports && imports.length) {
        // Find where the new imports should go
        var index = firstAfter(newStatements, function (statement) { return statement.kind === ts.SyntaxKind.ImportDeclaration ||
            statement.kind === ts.SyntaxKind.ImportEqualsDeclaration; });
        newStatements = newStatements.slice(0, index).concat(imports, prefix, newStatements.slice(index));
    }
    else {
        newStatements = prefix.concat(newStatements);
    }
    converter.updateSourceMap(newStatements);
    var newSourceFile = ts.updateSourceFileNode(sourceFile, newStatements);
    return [newSourceFile, converter.getNodeMap()];
}
exports.updateSourceFile = updateSourceFile;
// Return the index after the first value in `a` that doesn't match the predicate after a value that
// does or 0 if no values match.
function firstAfter(a, predicate) {
    var index = 0;
    var len = a.length;
    for (; index < len; index++) {
        var value = a[index];
        if (predicate(value))
            break;
    }
    if (index >= len)
        return 0;
    for (; index < len; index++) {
        var value = a[index];
        if (!predicate(value))
            break;
    }
    return index;
}
function escapeLiteral(value) {
    return value.replace(/(\"|\\)/g, '\\$1').replace(/(\n)|(\r)/g, function (v, n, r) {
        return n ? '\\n' : '\\r';
    });
}
function createLiteral(value) {
    if (value === null) {
        return ts.createNull();
    }
    else if (value === undefined) {
        return ts.createIdentifier('undefined');
    }
    else {
        var result = ts.createLiteral(value);
        if (ts.isStringLiteral(result) && result.text.indexOf('\\') >= 0) {
            // Hack to avoid problems cause indirectly by:
            //    https://github.com/Microsoft/TypeScript/issues/20192
            // This avoids the string escaping normally performed for a string relying on that
            // TypeScript just emits the text raw for a numeric literal.
            result.kind = ts.SyntaxKind.NumericLiteral;
            result.text = "\"" + escapeLiteral(result.text) + "\"";
        }
        return result;
    }
}
function isExportTypeStatement(statement) {
    return !!statement.modifiers &&
        statement.modifiers.some(function (mod) { return mod.kind === ts.SyntaxKind.ExportKeyword; });
}
/**
 * Visits an output ast and produces the corresponding TypeScript synthetic nodes.
 */
var NodeEmitterVisitor = /** @class */ (function () {
    function NodeEmitterVisitor() {
        this._nodeMap = new Map();
        this._importsWithPrefixes = new Map();
        this._reexports = new Map();
        this._templateSources = new Map();
        this._exportedVariableIdentifiers = new Map();
    }
    /**
     * Process the source file and collect exported identifiers that refer to variables.
     *
     * Only variables are collected because exported classes still exist in the module scope in
     * CommonJS, whereas variables have their declarations moved onto the `exports` object, and all
     * references are updated accordingly.
     */
    NodeEmitterVisitor.prototype.loadExportedVariableIdentifiers = function (sourceFile) {
        var _this = this;
        sourceFile.statements.forEach(function (statement) {
            if (ts.isVariableStatement(statement) && isExportTypeStatement(statement)) {
                statement.declarationList.declarations.forEach(function (declaration) {
                    if (ts.isIdentifier(declaration.name)) {
                        _this._exportedVariableIdentifiers.set(declaration.name.text, declaration.name);
                    }
                });
            }
        });
    };
    NodeEmitterVisitor.prototype.getReexports = function () {
        return Array.from(this._reexports.entries())
            .map(function (_a) {
            var exportedFilePath = _a[0], reexports = _a[1];
            return ts.createExportDeclaration(
            /* decorators */ undefined, 
            /* modifiers */ undefined, ts.createNamedExports(reexports.map(function (_a) {
                var name = _a.name, as = _a.as;
                return ts.createExportSpecifier(name, as);
            })), 
            /* moduleSpecifier */ createLiteral(exportedFilePath));
        });
    };
    NodeEmitterVisitor.prototype.getImports = function () {
        return Array.from(this._importsWithPrefixes.entries())
            .map(function (_a) {
            var namespace = _a[0], prefix = _a[1];
            return ts.createImportDeclaration(
            /* decorators */ undefined, 
            /* modifiers */ undefined, 
            /* importClause */ ts.createImportClause(
            /* name */ undefined, ts.createNamespaceImport(ts.createIdentifier(prefix))), 
            /* moduleSpecifier */ createLiteral(namespace));
        });
    };
    NodeEmitterVisitor.prototype.getNodeMap = function () { return this._nodeMap; };
    NodeEmitterVisitor.prototype.updateSourceMap = function (statements) {
        var _this = this;
        var lastRangeStartNode = undefined;
        var lastRangeEndNode = undefined;
        var lastRange = undefined;
        var recordLastSourceRange = function () {
            if (lastRange && lastRangeStartNode && lastRangeEndNode) {
                if (lastRangeStartNode == lastRangeEndNode) {
                    ts.setSourceMapRange(lastRangeEndNode, lastRange);
                }
                else {
                    ts.setSourceMapRange(lastRangeStartNode, lastRange);
                    // Only emit the pos for the first node emitted in the range.
                    ts.setEmitFlags(lastRangeStartNode, ts.EmitFlags.NoTrailingSourceMap);
                    ts.setSourceMapRange(lastRangeEndNode, lastRange);
                    // Only emit emit end for the last node emitted in the range.
                    ts.setEmitFlags(lastRangeEndNode, ts.EmitFlags.NoLeadingSourceMap);
                }
            }
        };
        var visitNode = function (tsNode) {
            var ngNode = _this._nodeMap.get(tsNode);
            if (ngNode) {
                var range = _this.sourceRangeOf(ngNode);
                if (range) {
                    if (!lastRange || range.source != lastRange.source || range.pos != lastRange.pos ||
                        range.end != lastRange.end) {
                        recordLastSourceRange();
                        lastRangeStartNode = tsNode;
                        lastRange = range;
                    }
                    lastRangeEndNode = tsNode;
                }
            }
            ts.forEachChild(tsNode, visitNode);
        };
        statements.forEach(visitNode);
        recordLastSourceRange();
    };
    NodeEmitterVisitor.prototype.record = function (ngNode, tsNode) {
        if (tsNode && !this._nodeMap.has(tsNode)) {
            this._nodeMap.set(tsNode, ngNode);
        }
        return tsNode;
    };
    NodeEmitterVisitor.prototype.sourceRangeOf = function (node) {
        if (node.sourceSpan) {
            var span = node.sourceSpan;
            if (span.start.file == span.end.file) {
                var file = span.start.file;
                if (file.url) {
                    var source = this._templateSources.get(file);
                    if (!source) {
                        source = ts.createSourceMapSource(file.url, file.content, function (pos) { return pos; });
                        this._templateSources.set(file, source);
                    }
                    return { pos: span.start.offset, end: span.end.offset, source: source };
                }
            }
        }
        return null;
    };
    NodeEmitterVisitor.prototype.getModifiers = function (stmt) {
        var modifiers = [];
        if (stmt.hasModifier(compiler_1.StmtModifier.Exported)) {
            modifiers.push(ts.createToken(ts.SyntaxKind.ExportKeyword));
        }
        return modifiers;
    };
    // StatementVisitor
    NodeEmitterVisitor.prototype.visitDeclareVarStmt = function (stmt) {
        if (stmt.hasModifier(compiler_1.StmtModifier.Exported) && stmt.value instanceof compiler_1.ExternalExpr &&
            !stmt.type) {
            // check for a reexport
            var _a = stmt.value.value, name_2 = _a.name, moduleName = _a.moduleName;
            if (moduleName) {
                var reexports = this._reexports.get(moduleName);
                if (!reexports) {
                    reexports = [];
                    this._reexports.set(moduleName, reexports);
                }
                reexports.push({ name: name_2, as: stmt.name });
                return null;
            }
        }
        var varDeclList = ts.createVariableDeclarationList([ts.createVariableDeclaration(ts.createIdentifier(stmt.name), 
            /* type */ undefined, (stmt.value && stmt.value.visitExpression(this, null)) || undefined)]);
        if (stmt.hasModifier(compiler_1.StmtModifier.Exported)) {
            // Note: We need to add an explicit variable and export declaration so that
            // the variable can be referred in the same file as well.
            var tsVarStmt = this.record(stmt, ts.createVariableStatement(/* modifiers */ [], varDeclList));
            var exportStmt = this.record(stmt, ts.createExportDeclaration(
            /*decorators*/ undefined, /*modifiers*/ undefined, ts.createNamedExports([ts.createExportSpecifier(stmt.name, stmt.name)])));
            return [tsVarStmt, exportStmt];
        }
        return this.record(stmt, ts.createVariableStatement(this.getModifiers(stmt), varDeclList));
    };
    NodeEmitterVisitor.prototype.visitDeclareFunctionStmt = function (stmt) {
        return this.record(stmt, ts.createFunctionDeclaration(
        /* decorators */ undefined, this.getModifiers(stmt), 
        /* asteriskToken */ undefined, stmt.name, /* typeParameters */ undefined, stmt.params.map(function (p) { return ts.createParameter(
        /* decorators */ undefined, /* modifiers */ undefined, 
        /* dotDotDotToken */ undefined, p.name); }), 
        /* type */ undefined, this._visitStatements(stmt.statements)));
    };
    NodeEmitterVisitor.prototype.visitExpressionStmt = function (stmt) {
        return this.record(stmt, ts.createStatement(stmt.expr.visitExpression(this, null)));
    };
    NodeEmitterVisitor.prototype.visitReturnStmt = function (stmt) {
        return this.record(stmt, ts.createReturn(stmt.value ? stmt.value.visitExpression(this, null) : undefined));
    };
    NodeEmitterVisitor.prototype.visitDeclareClassStmt = function (stmt) {
        var _this = this;
        var modifiers = this.getModifiers(stmt);
        var fields = stmt.fields.map(function (field) { return ts.createProperty(
        /* decorators */ undefined, /* modifiers */ translateModifiers(field.modifiers), field.name, 
        /* questionToken */ undefined, 
        /* type */ undefined, field.initializer == null ? ts.createNull() :
            field.initializer.visitExpression(_this, null)); });
        var getters = stmt.getters.map(function (getter) { return ts.createGetAccessor(
        /* decorators */ undefined, /* modifiers */ undefined, getter.name, /* parameters */ [], 
        /* type */ undefined, _this._visitStatements(getter.body)); });
        var constructor = (stmt.constructorMethod && [ts.createConstructor(
            /* decorators */ undefined, 
            /* modifiers */ undefined, 
            /* parameters */ stmt.constructorMethod.params.map(function (p) { return ts.createParameter(
            /* decorators */ undefined, 
            /* modifiers */ undefined, 
            /* dotDotDotToken */ undefined, p.name); }), this._visitStatements(stmt.constructorMethod.body))]) ||
            [];
        // TODO {chuckj}: Determine what should be done for a method with a null name.
        var methods = stmt.methods.filter(function (method) { return method.name; })
            .map(function (method) { return ts.createMethod(
        /* decorators */ undefined, 
        /* modifiers */ translateModifiers(method.modifiers), 
        /* astriskToken */ undefined, method.name /* guarded by filter */, 
        /* questionToken */ undefined, /* typeParameters */ undefined, method.params.map(function (p) { return ts.createParameter(
        /* decorators */ undefined, /* modifiers */ undefined, 
        /* dotDotDotToken */ undefined, p.name); }), 
        /* type */ undefined, _this._visitStatements(method.body)); });
        return this.record(stmt, ts.createClassDeclaration(
        /* decorators */ undefined, modifiers, stmt.name, /* typeParameters*/ undefined, stmt.parent && [ts.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [stmt.parent.visitExpression(this, null)])] ||
            [], fields.concat(getters, constructor, methods)));
    };
    NodeEmitterVisitor.prototype.visitIfStmt = function (stmt) {
        return this.record(stmt, ts.createIf(stmt.condition.visitExpression(this, null), this._visitStatements(stmt.trueCase), stmt.falseCase && stmt.falseCase.length && this._visitStatements(stmt.falseCase) ||
            undefined));
    };
    NodeEmitterVisitor.prototype.visitTryCatchStmt = function (stmt) {
        return this.record(stmt, ts.createTry(this._visitStatements(stmt.bodyStmts), ts.createCatchClause(CATCH_ERROR_NAME, this._visitStatementsPrefix([ts.createVariableStatement(
            /* modifiers */ undefined, [ts.createVariableDeclaration(CATCH_STACK_NAME, /* type */ undefined, ts.createPropertyAccess(ts.createIdentifier(CATCH_ERROR_NAME), ts.createIdentifier(CATCH_STACK_NAME)))])], stmt.catchStmts)), 
        /* finallyBlock */ undefined));
    };
    NodeEmitterVisitor.prototype.visitThrowStmt = function (stmt) {
        return this.record(stmt, ts.createThrow(stmt.error.visitExpression(this, null)));
    };
    NodeEmitterVisitor.prototype.visitCommentStmt = function (stmt, sourceFile) {
        var text = stmt.multiline ? " " + stmt.comment + " " : " " + stmt.comment;
        return this.createCommentStmt(text, stmt.multiline, sourceFile);
    };
    NodeEmitterVisitor.prototype.visitJSDocCommentStmt = function (stmt, sourceFile) {
        return this.createCommentStmt(stmt.toString(), true, sourceFile);
    };
    NodeEmitterVisitor.prototype.createCommentStmt = function (text, multiline, sourceFile) {
        var commentStmt = ts.createNotEmittedStatement(sourceFile);
        var kind = multiline ? ts.SyntaxKind.MultiLineCommentTrivia : ts.SyntaxKind.SingleLineCommentTrivia;
        ts.setSyntheticLeadingComments(commentStmt, [{ kind: kind, text: text, pos: -1, end: -1 }]);
        return commentStmt;
    };
    // ExpressionVisitor
    NodeEmitterVisitor.prototype.visitWrappedNodeExpr = function (expr) { return this.record(expr, expr.node); };
    NodeEmitterVisitor.prototype.visitTypeofExpr = function (expr) {
        var typeOf = ts.createTypeOf(expr.expr.visitExpression(this, null));
        return this.record(expr, typeOf);
    };
    // ExpressionVisitor
    NodeEmitterVisitor.prototype.visitReadVarExpr = function (expr) {
        switch (expr.builtin) {
            case compiler_1.BuiltinVar.This:
                return this.record(expr, ts.createIdentifier(METHOD_THIS_NAME));
            case compiler_1.BuiltinVar.CatchError:
                return this.record(expr, ts.createIdentifier(CATCH_ERROR_NAME));
            case compiler_1.BuiltinVar.CatchStack:
                return this.record(expr, ts.createIdentifier(CATCH_STACK_NAME));
            case compiler_1.BuiltinVar.Super:
                return this.record(expr, ts.createSuper());
        }
        if (expr.name) {
            return this.record(expr, ts.createIdentifier(expr.name));
        }
        throw Error("Unexpected ReadVarExpr form");
    };
    NodeEmitterVisitor.prototype.visitWriteVarExpr = function (expr) {
        return this.record(expr, ts.createAssignment(ts.createIdentifier(expr.name), expr.value.visitExpression(this, null)));
    };
    NodeEmitterVisitor.prototype.visitWriteKeyExpr = function (expr) {
        return this.record(expr, ts.createAssignment(ts.createElementAccess(expr.receiver.visitExpression(this, null), expr.index.visitExpression(this, null)), expr.value.visitExpression(this, null)));
    };
    NodeEmitterVisitor.prototype.visitWritePropExpr = function (expr) {
        return this.record(expr, ts.createAssignment(ts.createPropertyAccess(expr.receiver.visitExpression(this, null), expr.name), expr.value.visitExpression(this, null)));
    };
    NodeEmitterVisitor.prototype.visitInvokeMethodExpr = function (expr) {
        var _this = this;
        var methodName = getMethodName(expr);
        return this.record(expr, ts.createCall(ts.createPropertyAccess(expr.receiver.visitExpression(this, null), methodName), 
        /* typeArguments */ undefined, expr.args.map(function (arg) { return arg.visitExpression(_this, null); })));
    };
    NodeEmitterVisitor.prototype.visitInvokeFunctionExpr = function (expr) {
        var _this = this;
        return this.record(expr, ts.createCall(expr.fn.visitExpression(this, null), /* typeArguments */ undefined, expr.args.map(function (arg) { return arg.visitExpression(_this, null); })));
    };
    NodeEmitterVisitor.prototype.visitInstantiateExpr = function (expr) {
        var _this = this;
        return this.record(expr, ts.createNew(expr.classExpr.visitExpression(this, null), /* typeArguments */ undefined, expr.args.map(function (arg) { return arg.visitExpression(_this, null); })));
    };
    NodeEmitterVisitor.prototype.visitLiteralExpr = function (expr) { return this.record(expr, createLiteral(expr.value)); };
    NodeEmitterVisitor.prototype.visitExternalExpr = function (expr) {
        return this.record(expr, this._visitIdentifier(expr.value));
    };
    NodeEmitterVisitor.prototype.visitConditionalExpr = function (expr) {
        // TODO {chuckj}: Review use of ! on falseCase. Should it be non-nullable?
        return this.record(expr, ts.createParen(ts.createConditional(expr.condition.visitExpression(this, null), expr.trueCase.visitExpression(this, null), expr.falseCase.visitExpression(this, null))));
    };
    NodeEmitterVisitor.prototype.visitNotExpr = function (expr) {
        return this.record(expr, ts.createPrefix(ts.SyntaxKind.ExclamationToken, expr.condition.visitExpression(this, null)));
    };
    NodeEmitterVisitor.prototype.visitAssertNotNullExpr = function (expr) {
        return expr.condition.visitExpression(this, null);
    };
    NodeEmitterVisitor.prototype.visitCastExpr = function (expr) {
        return expr.value.visitExpression(this, null);
    };
    NodeEmitterVisitor.prototype.visitFunctionExpr = function (expr) {
        return this.record(expr, ts.createFunctionExpression(
        /* modifiers */ undefined, /* astriskToken */ undefined, 
        /* name */ expr.name || undefined, 
        /* typeParameters */ undefined, expr.params.map(function (p) { return ts.createParameter(
        /* decorators */ undefined, /* modifiers */ undefined, 
        /* dotDotDotToken */ undefined, p.name); }), 
        /* type */ undefined, this._visitStatements(expr.statements)));
    };
    NodeEmitterVisitor.prototype.visitBinaryOperatorExpr = function (expr) {
        var binaryOperator;
        switch (expr.operator) {
            case compiler_1.BinaryOperator.And:
                binaryOperator = ts.SyntaxKind.AmpersandAmpersandToken;
                break;
            case compiler_1.BinaryOperator.BitwiseAnd:
                binaryOperator = ts.SyntaxKind.AmpersandToken;
                break;
            case compiler_1.BinaryOperator.Bigger:
                binaryOperator = ts.SyntaxKind.GreaterThanToken;
                break;
            case compiler_1.BinaryOperator.BiggerEquals:
                binaryOperator = ts.SyntaxKind.GreaterThanEqualsToken;
                break;
            case compiler_1.BinaryOperator.Divide:
                binaryOperator = ts.SyntaxKind.SlashToken;
                break;
            case compiler_1.BinaryOperator.Equals:
                binaryOperator = ts.SyntaxKind.EqualsEqualsToken;
                break;
            case compiler_1.BinaryOperator.Identical:
                binaryOperator = ts.SyntaxKind.EqualsEqualsEqualsToken;
                break;
            case compiler_1.BinaryOperator.Lower:
                binaryOperator = ts.SyntaxKind.LessThanToken;
                break;
            case compiler_1.BinaryOperator.LowerEquals:
                binaryOperator = ts.SyntaxKind.LessThanEqualsToken;
                break;
            case compiler_1.BinaryOperator.Minus:
                binaryOperator = ts.SyntaxKind.MinusToken;
                break;
            case compiler_1.BinaryOperator.Modulo:
                binaryOperator = ts.SyntaxKind.PercentToken;
                break;
            case compiler_1.BinaryOperator.Multiply:
                binaryOperator = ts.SyntaxKind.AsteriskToken;
                break;
            case compiler_1.BinaryOperator.NotEquals:
                binaryOperator = ts.SyntaxKind.ExclamationEqualsToken;
                break;
            case compiler_1.BinaryOperator.NotIdentical:
                binaryOperator = ts.SyntaxKind.ExclamationEqualsEqualsToken;
                break;
            case compiler_1.BinaryOperator.Or:
                binaryOperator = ts.SyntaxKind.BarBarToken;
                break;
            case compiler_1.BinaryOperator.Plus:
                binaryOperator = ts.SyntaxKind.PlusToken;
                break;
            default:
                throw new Error("Unknown operator: " + expr.operator);
        }
        var binary = ts.createBinary(expr.lhs.visitExpression(this, null), binaryOperator, expr.rhs.visitExpression(this, null));
        return this.record(expr, expr.parens ? ts.createParen(binary) : binary);
    };
    NodeEmitterVisitor.prototype.visitReadPropExpr = function (expr) {
        return this.record(expr, ts.createPropertyAccess(expr.receiver.visitExpression(this, null), expr.name));
    };
    NodeEmitterVisitor.prototype.visitReadKeyExpr = function (expr) {
        return this.record(expr, ts.createElementAccess(expr.receiver.visitExpression(this, null), expr.index.visitExpression(this, null)));
    };
    NodeEmitterVisitor.prototype.visitLiteralArrayExpr = function (expr) {
        var _this = this;
        return this.record(expr, ts.createArrayLiteral(expr.entries.map(function (entry) { return entry.visitExpression(_this, null); })));
    };
    NodeEmitterVisitor.prototype.visitLiteralMapExpr = function (expr) {
        var _this = this;
        return this.record(expr, ts.createObjectLiteral(expr.entries.map(function (entry) { return ts.createPropertyAssignment(entry.quoted || !_VALID_IDENTIFIER_RE.test(entry.key) ?
            ts.createLiteral(entry.key) :
            entry.key, entry.value.visitExpression(_this, null)); })));
    };
    NodeEmitterVisitor.prototype.visitCommaExpr = function (expr) {
        var _this = this;
        return this.record(expr, expr.parts.map(function (e) { return e.visitExpression(_this, null); })
            .reduce(function (left, right) {
            return left ? ts.createBinary(left, ts.SyntaxKind.CommaToken, right) : right;
        }, null));
    };
    NodeEmitterVisitor.prototype._visitStatements = function (statements) {
        return this._visitStatementsPrefix([], statements);
    };
    NodeEmitterVisitor.prototype._visitStatementsPrefix = function (prefix, statements) {
        var _this = this;
        return ts.createBlock(prefix.concat(statements.map(function (stmt) { return stmt.visitStatement(_this, null); }).filter(function (f) { return f != null; })));
    };
    NodeEmitterVisitor.prototype._visitIdentifier = function (value) {
        // name can only be null during JIT which never executes this code.
        var moduleName = value.moduleName, name = value.name;
        var prefixIdent = null;
        if (moduleName) {
            var prefix = this._importsWithPrefixes.get(moduleName);
            if (prefix == null) {
                prefix = "i" + this._importsWithPrefixes.size;
                this._importsWithPrefixes.set(moduleName, prefix);
            }
            prefixIdent = ts.createIdentifier(prefix);
        }
        if (prefixIdent) {
            return ts.createPropertyAccess(prefixIdent, name);
        }
        else {
            var id = ts.createIdentifier(name);
            if (this._exportedVariableIdentifiers.has(name)) {
                // In order for this new identifier node to be properly rewritten in CommonJS output,
                // it must have its original node set to a parsed instance of the same identifier.
                ts.setOriginalNode(id, this._exportedVariableIdentifiers.get(name));
            }
            return id;
        }
    };
    return NodeEmitterVisitor;
}());
exports.NodeEmitterVisitor = NodeEmitterVisitor;
function getMethodName(methodRef) {
    if (methodRef.name) {
        return methodRef.name;
    }
    else {
        switch (methodRef.builtin) {
            case compiler_1.BuiltinMethod.Bind:
                return 'bind';
            case compiler_1.BuiltinMethod.ConcatArray:
                return 'concat';
            case compiler_1.BuiltinMethod.SubscribeObservable:
                return 'subscribe';
        }
    }
    throw new Error('Unexpected method reference form');
}
function modifierFromModifier(modifier) {
    switch (modifier) {
        case compiler_1.StmtModifier.Exported:
            return ts.createToken(ts.SyntaxKind.ExportKeyword);
        case compiler_1.StmtModifier.Final:
            return ts.createToken(ts.SyntaxKind.ConstKeyword);
        case compiler_1.StmtModifier.Private:
            return ts.createToken(ts.SyntaxKind.PrivateKeyword);
        case compiler_1.StmtModifier.Static:
            return ts.createToken(ts.SyntaxKind.StaticKeyword);
    }
    return util_1.error("unknown statement modifier");
}
function translateModifiers(modifiers) {
    return modifiers == null ? undefined : modifiers.map(modifierFromModifier);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZV9lbWl0dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy90cmFuc2Zvcm1lcnMvbm9kZV9lbWl0dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsOENBQXdxQjtBQUN4cUIsK0JBQWlDO0FBRWpDLCtCQUE2QjtBQUk3QixJQUFNLGdCQUFnQixHQUFHLE1BQU0sQ0FBQztBQUNoQyxJQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQztBQUNqQyxJQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQztBQUNqQyxJQUFNLG9CQUFvQixHQUFHLHVCQUF1QixDQUFDO0FBRXJEO0lBQUE7SUFnQ0EsQ0FBQztJQS9CQyxnREFBZ0IsR0FBaEIsVUFBaUIsVUFBeUIsRUFBRSxLQUFrQixFQUFFLFFBQWlCO1FBRS9FLElBQU0sU0FBUyxHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztRQUMzQywyRkFBMkY7UUFDM0YsU0FBUztRQUNULElBQU0sVUFBVSxHQUFVLEVBQUUsQ0FBQyxNQUFNLE9BQVQsRUFBRSxFQUNyQixLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEVBQXBDLENBQW9DLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLElBQUksSUFBSSxFQUFaLENBQVksQ0FBQyxDQUFDLENBQUM7UUFDN0YsSUFBTSxhQUFhLEdBQW1CLEVBQUUsQ0FBQztRQUN6QyxJQUFJLFFBQVEsRUFBRTtZQUNaLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDdEUsYUFBYSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUNqQztRQUNELElBQU0sZ0JB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