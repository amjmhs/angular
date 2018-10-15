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
import * as cdAst from '../expression_parser/ast';
import { Identifiers } from '../identifiers';
import * as o from '../output/output_ast';
export class EventHandlerVars {
}
EventHandlerVars.event = o.variable('$event');
if (false) {
    /** @type {?} */
    EventHandlerVars.event;
}
/**
 * @record
 */
export function LocalResolver() { }
/** @type {?} */
LocalResolver.prototype.getLocal;
export class ConvertActionBindingResult {
    /**
     * @param {?} stmts
     * @param {?} allowDefault
     */
    constructor(stmts, allowDefault) {
        this.stmts = stmts;
        this.allowDefault = allowDefault;
        /**
             * This is bit of a hack. It converts statements which render2 expects to statements which are
             * expected by render3.
             *
             * Example: `<div click="doSomething($event)">` will generate:
             *
             * Render3:
             * ```
             * const pd_b:any = ((<any>ctx.doSomething($event)) !== false);
             * return pd_b;
             * ```
             *
             * but render2 expects:
             * ```
             * return ctx.doSomething($event);
             * ```
             */
        // TODO(misko): remove this hack once we no longer support ViewEngine.
        this.render3Stmts = stmts.map((statement) => {
            if (statement instanceof o.DeclareVarStmt && statement.name == allowDefault.name &&
                statement.value instanceof o.BinaryOperatorExpr) {
                /** @type {?} */
                const lhs = /** @type {?} */ (statement.value.lhs);
                return new o.ReturnStatement(lhs.value);
            }
            return statement;
        });
    }
}
if (false) {
    /**
     * Store statements which are render3 compatible.
     * @type {?}
     */
    ConvertActionBindingResult.prototype.render3Stmts;
    /**
     * Render2 compatible statements,
     * @type {?}
     */
    ConvertActionBindingResult.prototype.stmts;
    /**
     * Variable name used with render2 compatible statements.
     * @type {?}
     */
    ConvertActionBindingResult.prototype.allowDefault;
}
/** @typedef {?} */
var InterpolationFunction;
export { InterpolationFunction };
/**
 * Converts the given expression AST into an executable output AST, assuming the expression is
 * used in an action binding (e.g. an event handler).
 * @param {?} localResolver
 * @param {?} implicitReceiver
 * @param {?} action
 * @param {?} bindingId
 * @param {?=} interpolationFunction
 * @return {?}
 */
export function convertActionBinding(localResolver, implicitReceiver, action, bindingId, interpolationFunction) {
    if (!localResolver) {
        localResolver = new DefaultLocalResolver();
    }
    /** @type {?} */
    const actionWithoutBuiltins = convertPropertyBindingBuiltins({
        createLiteralArrayConverter: (argCount) => {
            // Note: no caching for literal arrays in actions.
            return (args) => o.literalArr(args);
        },
        createLiteralMapConverter: (keys) => {
            // Note: no caching for literal maps in actions.
            return (values) => {
                /** @type {?} */
                const entries = keys.map((k, i) => ({
                    key: k.key,
                    value: values[i],
                    quoted: k.quoted,
                }));
                return o.literalMap(entries);
            };
        },
        createPipeConverter: (name) => {
            throw new Error(`Illegal State: Actions are not allowed to contain pipes. Pipe: ${name}`);
        }
    }, action);
    /** @type {?} */
    const visitor = new _AstToIrVisitor(localResolver, implicitReceiver, bindingId, interpolationFunction);
    /** @type {?} */
    const actionStmts = [];
    flattenStatements(actionWithoutBuiltins.visit(visitor, _Mode.Statement), actionStmts);
    prependTemporaryDecls(visitor.temporaryCount, bindingId, actionStmts);
    /** @type {?} */
    const lastIndex = actionStmts.length - 1;
    /** @type {?} */
    let preventDefaultVar = /** @type {?} */ ((null));
    if (lastIndex >= 0) {
        /** @type {?} */
        const lastStatement = actionStmts[lastIndex];
        /** @type {?} */
        const returnExpr = convertStmtIntoExpression(lastStatement);
        if (returnExpr) {
            // Note: We need to cast the result of the method call to dynamic,
            // as it might be a void method!
            preventDefaultVar = createPreventDefaultVar(bindingId);
            actionStmts[lastIndex] =
                preventDefaultVar.set(returnExpr.cast(o.DYNAMIC_TYPE).notIdentical(o.literal(false)))
                    .toDeclStmt(null, [o.StmtModifier.Final]);
        }
    }
    return new ConvertActionBindingResult(actionStmts, preventDefaultVar);
}
/**
 * @record
 */
export function BuiltinConverter() { }
/**
 * @record
 */
export function BuiltinConverterFactory() { }
/** @type {?} */
BuiltinConverterFactory.prototype.createLiteralArrayConverter;
/** @type {?} */
BuiltinConverterFactory.prototype.createLiteralMapConverter;
/** @type {?} */
BuiltinConverterFactory.prototype.createPipeConverter;
/**
 * @param {?} converterFactory
 * @param {?} ast
 * @return {?}
 */
export function convertPropertyBindingBuiltins(converterFactory, ast) {
    return convertBuiltins(converterFactory, ast);
}
export class ConvertPropertyBindingResult {
    /**
     * @param {?} stmts
     * @param {?} currValExpr
     */
    constructor(stmts, currValExpr) {
        this.stmts = stmts;
        this.currValExpr = currValExpr;
    }
}
if (false) {
    /** @type {?} */
    ConvertPropertyBindingResult.prototype.stmts;
    /** @type {?} */
    ConvertPropertyBindingResult.prototype.currValExpr;
}
/** @enum {number} */
const BindingForm = {
    // The general form of binding expression, supports all expressions.
    General: 0,
    // Try to generate a simple binding (no temporaries or statements)
    // otherwise generate a general binding
    TrySimple: 1,
};
export { BindingForm };
BindingForm[BindingForm.General] = 'General';
BindingForm[BindingForm.TrySimple] = 'TrySimple';
/**
 * Converts the given expression AST into an executable output AST, assuming the expression
 * is used in property binding. The expression has to be preprocessed via
 * `convertPropertyBindingBuiltins`.
 * @param {?} localResolver
 * @param {?} implicitReceiver
 * @param {?} expressionWithoutBuiltins
 * @param {?} bindingId
 * @param {?} form
 * @param {?=} interpolationFunction
 * @return {?}
 */
export function convertPropertyBinding(localResolver, implicitReceiver, expressionWithoutBuiltins, bindingId, form, interpolationFunction) {
    if (!localResolver) {
        localResolver = new DefaultLocalResolver();
    }
    /** @type {?} */
    const currValExpr = createCurrValueExpr(bindingId);
    /** @type {?} */
    const stmts = [];
    /** @type {?} */
    const visitor = new _AstToIrVisitor(localResolver, implicitReceiver, bindingId, interpolationFunction);
    /** @type {?} */
    const outputExpr = expressionWithoutBuiltins.visit(visitor, _Mode.Expression);
    if (visitor.temporaryCount) {
        for (let i = 0; i < visitor.temporaryCount; i++) {
            stmts.push(temporaryDeclaration(bindingId, i));
        }
    }
    else if (form == BindingForm.TrySimple) {
        return new ConvertPropertyBindingResult([], outputExpr);
    }
    stmts.push(currValExpr.set(outputExpr).toDeclStmt(o.DYNAMIC_TYPE, [o.StmtModifier.Final]));
    return new ConvertPropertyBindingResult(stmts, currValExpr);
}
/**
 * @param {?} converterFactory
 * @param {?} ast
 * @return {?}
 */
function convertBuiltins(converterFactory, ast) {
    /** @type {?} */
    const visitor = new _BuiltinAstConverter(converterFactory);
    return ast.visit(visitor);
}
/**
 * @param {?} bindingId
 * @param {?} temporaryNumber
 * @return {?}
 */
function temporaryName(bindingId, temporaryNumber) {
    return `tmp_${bindingId}_${temporaryNumber}`;
}
/**
 * @param {?} bindingId
 * @param {?} temporaryNumber
 * @return {?}
 */
export function temporaryDeclaration(bindingId, temporaryNumber) {
    return new o.DeclareVarStmt(temporaryName(bindingId, temporaryNumber), o.NULL_EXPR);
}
/**
 * @param {?} temporaryCount
 * @param {?} bindingId
 * @param {?} statements
 * @return {?}
 */
function prependTemporaryDecls(temporaryCount, bindingId, statements) {
    for (let i = temporaryCount - 1; i >= 0; i--) {
        statements.unshift(temporaryDeclaration(bindingId, i));
    }
}
/** @enum {number} */
const _Mode = {
    Statement: 0,
    Expression: 1,
};
_Mode[_Mode.Statement] = 'Statement';
_Mode[_Mode.Expression] = 'Expression';
/**
 * @param {?} mode
 * @param {?} ast
 * @return {?}
 */
function ensureStatementMode(mode, ast) {
    if (mode !== _Mode.Statement) {
        throw new Error(`Expected a statement, but saw ${ast}`);
    }
}
/**
 * @param {?} mode
 * @param {?} ast
 * @return {?}
 */
function ensureExpressionMode(mode, ast) {
    if (mode !== _Mode.Expression) {
        throw new Error(`Expected an expression, but saw ${ast}`);
    }
}
/**
 * @param {?} mode
 * @param {?} expr
 * @return {?}
 */
function convertToStatementIfNeeded(mode, expr) {
    if (mode === _Mode.Statement) {
        return expr.toStmt();
    }
    else {
        return expr;
    }
}
class _BuiltinAstConverter extends cdAst.AstTransformer {
    /**
     * @param {?} _converterFactory
     */
    constructor(_converterFactory) {
        super();
        this._converterFactory = _converterFactory;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitPipe(ast, context) {
        /** @type {?} */
        const args = [ast.exp, ...ast.args].map(ast => ast.visit(this, context));
        return new BuiltinFunctionCall(ast.span, args, this._converterFactory.createPipeConverter(ast.name, args.length));
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitLiteralArray(ast, context) {
        /** @type {?} */
        const args = ast.expressions.map(ast => ast.visit(this, context));
        return new BuiltinFunctionCall(ast.span, args, this._converterFactory.createLiteralArrayConverter(ast.expressions.length));
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitLiteralMap(ast, context) {
        /** @type {?} */
        const args = ast.values.map(ast => ast.visit(this, context));
        return new BuiltinFunctionCall(ast.span, args, this._converterFactory.createLiteralMapConverter(ast.keys));
    }
}
if (false) {
    /** @type {?} */
    _BuiltinAstConverter.prototype._converterFactory;
}
class _AstToIrVisitor {
    /**
     * @param {?} _localResolver
     * @param {?} _implicitReceiver
     * @param {?} bindingId
     * @param {?} interpolationFunction
     */
    constructor(_localResolver, _implicitReceiver, bindingId, interpolationFunction) {
        this._localResolver = _localResolver;
        this._implicitReceiver = _implicitReceiver;
        this.bindingId = bindingId;
        this.interpolationFunction = interpolationFunction;
        this._nodeMap = new Map();
        this._resultMap = new Map();
        this._currentTemporary = 0;
        this.temporaryCount = 0;
    }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visitBinary(ast, mode) {
        /** @type {?} */
        let op;
        switch (ast.operation) {
            case '+':
                op = o.BinaryOperator.Plus;
                break;
            case '-':
                op = o.BinaryOperator.Minus;
                break;
            case '*':
                op = o.BinaryOperator.Multiply;
                break;
            case '/':
                op = o.BinaryOperator.Divide;
                break;
            case '%':
                op = o.BinaryOperator.Modulo;
                break;
            case '&&':
                op = o.BinaryOperator.And;
                break;
            case '||':
                op = o.BinaryOperator.Or;
                break;
            case '==':
                op = o.BinaryOperator.Equals;
                break;
            case '!=':
                op = o.BinaryOperator.NotEquals;
                break;
            case '===':
                op = o.BinaryOperator.Identical;
                break;
            case '!==':
                op = o.BinaryOperator.NotIdentical;
                break;
            case '<':
                op = o.BinaryOperator.Lower;
                break;
            case '>':
                op = o.BinaryOperator.Bigger;
                break;
            case '<=':
                op = o.BinaryOperator.LowerEquals;
                break;
            case '>=':
                op = o.BinaryOperator.BiggerEquals;
                break;
            default:
                throw new Error(`Unsupported operation ${ast.operation}`);
        }
        return convertToStatementIfNeeded(mode, new o.BinaryOperatorExpr(op, this._visit(ast.left, _Mode.Expression), this._visit(ast.right, _Mode.Expression)));
    }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visitChain(ast, mode) {
        ensureStatementMode(mode, ast);
        return this.visitAll(ast.expressions, mode);
    }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visitConditional(ast, mode) {
        /** @type {?} */
        const value = this._visit(ast.condition, _Mode.Expression);
        return convertToStatementIfNeeded(mode, value.conditional(this._visit(ast.trueExp, _Mode.Expression), this._visit(ast.falseExp, _Mode.Expression)));
    }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visitPipe(ast, mode) {
        throw new Error(`Illegal state: Pipes should have been converted into functions. Pipe: ${ast.name}`);
    }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visitFunctionCall(ast, mode) {
        /** @type {?} */
        const convertedArgs = this.visitAll(ast.args, _Mode.Expression);
        /** @type {?} */
        let fnResult;
        if (ast instanceof BuiltinFunctionCall) {
            fnResult = ast.converter(convertedArgs);
        }
        else {
            fnResult = this._visit(/** @type {?} */ ((ast.target)), _Mode.Expression).callFn(convertedArgs);
        }
        return convertToStatementIfNeeded(mode, fnResult);
    }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visitImplicitReceiver(ast, mode) {
        ensureExpressionMode(mode, ast);
        return this._implicitReceiver;
    }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visitInterpolation(ast, mode) {
        ensureExpressionMode(mode, ast);
        /** @type {?} */
        const args = [o.literal(ast.expressions.length)];
        for (let i = 0; i < ast.strings.length - 1; i++) {
            args.push(o.literal(ast.strings[i]));
            args.push(this._visit(ast.expressions[i], _Mode.Expression));
        }
        args.push(o.literal(ast.strings[ast.strings.length - 1]));
        if (this.interpolationFunction) {
            return this.interpolationFunction(args);
        }
        return ast.expressions.length <= 9 ?
            o.importExpr(Identifiers.inlineInterpolate).callFn(args) :
            o.importExpr(Identifiers.interpolate).callFn([args[0], o.literalArr(args.slice(1))]);
    }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visitKeyedRead(ast, mode) {
        /** @type {?} */
        const leftMostSafe = this.leftMostSafeNode(ast);
        if (leftMostSafe) {
            return this.convertSafeAccess(ast, leftMostSafe, mode);
        }
        else {
            return convertToStatementIfNeeded(mode, this._visit(ast.obj, _Mode.Expression).key(this._visit(ast.key, _Mode.Expression)));
        }
    }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visitKeyedWrite(ast, mode) {
        /** @type {?} */
        const obj = this._visit(ast.obj, _Mode.Expression);
        /** @type {?} */
        const key = this._visit(ast.key, _Mode.Expression);
        /** @type {?} */
        const value = this._visit(ast.value, _Mode.Expression);
        return convertToStatementIfNeeded(mode, obj.key(key).set(value));
    }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visitLiteralArray(ast, mode) {
        throw new Error(`Illegal State: literal arrays should have been converted into functions`);
    }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visitLiteralMap(ast, mode) {
        throw new Error(`Illegal State: literal maps should have been converted into functions`);
    }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visitLiteralPrimitive(ast, mode) {
        /** @type {?} */
        const type = ast.value === null || ast.value === undefined || ast.value === true || ast.value === true ?
            o.INFERRED_TYPE :
            undefined;
        return convertToStatementIfNeeded(mode, o.literal(ast.value, type));
    }
    /**
     * @param {?} name
     * @return {?}
     */
    _getLocal(name) { return this._localResolver.getLocal(name); }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visitMethodCall(ast, mode) {
        if (ast.receiver instanceof cdAst.ImplicitReceiver && ast.name == '$any') {
            /** @type {?} */
            const args = /** @type {?} */ (this.visitAll(ast.args, _Mode.Expression));
            if (args.length != 1) {
                throw new Error(`Invalid call to $any, expected 1 argument but received ${args.length || 'none'}`);
            }
            return (/** @type {?} */ (args[0])).cast(o.DYNAMIC_TYPE);
        }
        /** @type {?} */
        const leftMostSafe = this.leftMostSafeNode(ast);
        if (leftMostSafe) {
            return this.convertSafeAccess(ast, leftMostSafe, mode);
        }
        else {
            /** @type {?} */
            const args = this.visitAll(ast.args, _Mode.Expression);
            /** @type {?} */
            let result = null;
            /** @type {?} */
            const receiver = this._visit(ast.receiver, _Mode.Expression);
            if (receiver === this._implicitReceiver) {
                /** @type {?} */
                const varExpr = this._getLocal(ast.name);
                if (varExpr) {
                    result = varExpr.callFn(args);
                }
            }
            if (result == null) {
                result = receiver.callMethod(ast.name, args);
            }
            return convertToStatementIfNeeded(mode, result);
        }
    }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visitPrefixNot(ast, mode) {
        return convertToStatementIfNeeded(mode, o.not(this._visit(ast.expression, _Mode.Expression)));
    }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visitNonNullAssert(ast, mode) {
        return convertToStatementIfNeeded(mode, o.assertNotNull(this._visit(ast.expression, _Mode.Expression)));
    }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visitPropertyRead(ast, mode) {
        /** @type {?} */
        const leftMostSafe = this.leftMostSafeNode(ast);
        if (leftMostSafe) {
            return this.convertSafeAccess(ast, leftMostSafe, mode);
        }
        else {
            /** @type {?} */
            let result = null;
            /** @type {?} */
            const receiver = this._visit(ast.receiver, _Mode.Expression);
            if (receiver === this._implicitReceiver) {
                result = this._getLocal(ast.name);
            }
            if (result == null) {
                result = receiver.prop(ast.name);
            }
            return convertToStatementIfNeeded(mode, result);
        }
    }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visitPropertyWrite(ast, mode) {
        /** @type {?} */
        const receiver = this._visit(ast.receiver, _Mode.Expression);
        if (receiver === this._implicitReceiver) {
            /** @type {?} */
            const varExpr = this._getLocal(ast.name);
            if (varExpr) {
                throw new Error('Cannot assign to a reference or variable!');
            }
        }
        return convertToStatementIfNeeded(mode, receiver.prop(ast.name).set(this._visit(ast.value, _Mode.Expression)));
    }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visitSafePropertyRead(ast, mode) {
        return this.convertSafeAccess(ast, this.leftMostSafeNode(ast), mode);
    }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visitSafeMethodCall(ast, mode) {
        return this.convertSafeAccess(ast, this.leftMostSafeNode(ast), mode);
    }
    /**
     * @param {?} asts
     * @param {?} mode
     * @return {?}
     */
    visitAll(asts, mode) { return asts.map(ast => this._visit(ast, mode)); }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visitQuote(ast, mode) {
        throw new Error(`Quotes are not supported for evaluation!
        Statement: ${ast.uninterpretedExpression} located at ${ast.location}`);
    }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    _visit(ast, mode) {
        /** @type {?} */
        const result = this._resultMap.get(ast);
        if (result)
            return result;
        return (this._nodeMap.get(ast) || ast).visit(this, mode);
    }
    /**
     * @param {?} ast
     * @param {?} leftMostSafe
     * @param {?} mode
     * @return {?}
     */
    convertSafeAccess(ast, leftMostSafe, mode) {
        /** @type {?} */
        let guardedExpression = this._visit(leftMostSafe.receiver, _Mode.Expression);
        /** @type {?} */
        let temporary = /** @type {?} */ ((undefined));
        if (this.needsTemporary(leftMostSafe.receiver)) {
            // If the expression has method calls or pipes then we need to save the result into a
            // temporary variable to avoid calling stateful or impure code more than once.
            temporary = this.allocateTemporary();
            // Preserve the result in the temporary variable
            guardedExpression = temporary.set(guardedExpression);
            // Ensure all further references to the guarded expression refer to the temporary instead.
            this._resultMap.set(leftMostSafe.receiver, temporary);
        }
        /** @type {?} */
        const condition = guardedExpression.isBlank();
        // Convert the ast to an unguarded access to the receiver's member. The map will substitute
        // leftMostNode with its unguarded version in the call to `this.visit()`.
        if (leftMostSafe instanceof cdAst.SafeMethodCall) {
            this._nodeMap.set(leftMostSafe, new cdAst.MethodCall(leftMostSafe.span, leftMostSafe.receiver, leftMostSafe.name, leftMostSafe.args));
        }
        else {
            this._nodeMap.set(leftMostSafe, new cdAst.PropertyRead(leftMostSafe.span, leftMostSafe.receiver, leftMostSafe.name));
        }
        /** @type {?} */
        const access = this._visit(ast, _Mode.Expression);
        // Remove the mapping. This is not strictly required as the converter only traverses each node
        // once but is safer if the conversion is changed to traverse the nodes more than once.
        this._nodeMap.delete(leftMostSafe);
        // If we allocated a temporary, release it.
        if (temporary) {
            this.releaseTemporary(temporary);
        }
        // Produce the conditional
        return convertToStatementIfNeeded(mode, condition.conditional(o.literal(null), access));
    }
    /**
     * @param {?} ast
     * @return {?}
     */
    leftMostSafeNode(ast) {
        /** @type {?} */
        const visit = (visitor, ast) => {
            return (this._nodeMap.get(ast) || ast).visit(visitor);
        };
        return ast.visit({
            /**
             * @param {?} ast
             * @return {?}
             */
            visitBinary(ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitChain(ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitConditional(ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitFunctionCall(ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitImplicitReceiver(ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitInterpolation(ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitKeyedRead(ast) { return visit(this, ast.obj); },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitKeyedWrite(ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitLiteralArray(ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitLiteralMap(ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitLiteralPrimitive(ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitMethodCall(ast) { return visit(this, ast.receiver); },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitPipe(ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitPrefixNot(ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitNonNullAssert(ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitPropertyRead(ast) { return visit(this, ast.receiver); },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitPropertyWrite(ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitQuote(ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitSafeMethodCall(ast) { return visit(this, ast.receiver) || ast; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitSafePropertyRead(ast) {
                return visit(this, ast.receiver) || ast;
            }
        });
    }
    /**
     * @param {?} ast
     * @return {?}
     */
    needsTemporary(ast) {
        /** @type {?} */
        const visit = (visitor, ast) => {
            return ast && (this._nodeMap.get(ast) || ast).visit(visitor);
        };
        /** @type {?} */
        const visitSome = (visitor, ast) => {
            return ast.some(ast => visit(visitor, ast));
        };
        return ast.visit({
            /**
             * @param {?} ast
             * @return {?}
             */
            visitBinary(ast) { return visit(this, ast.left) || visit(this, ast.right); },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitChain(ast) { return false; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitConditional(ast) {
                return visit(this, ast.condition) || visit(this, ast.trueExp) ||
                    visit(this, ast.falseExp);
            },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitFunctionCall(ast) { return true; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitImplicitReceiver(ast) { return false; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitInterpolation(ast) { return visitSome(this, ast.expressions); },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitKeyedRead(ast) { return false; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitKeyedWrite(ast) { return false; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitLiteralArray(ast) { return true; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitLiteralMap(ast) { return true; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitLiteralPrimitive(ast) { return false; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitMethodCall(ast) { return true; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitPipe(ast) { return true; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitPrefixNot(ast) { return visit(this, ast.expression); },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitNonNullAssert(ast) { return visit(this, ast.expression); },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitPropertyRead(ast) { return false; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitPropertyWrite(ast) { return false; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitQuote(ast) { return false; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitSafeMethodCall(ast) { return true; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitSafePropertyRead(ast) { return false; }
        });
    }
    /**
     * @return {?}
     */
    allocateTemporary() {
        /** @type {?} */
        const tempNumber = this._currentTemporary++;
        this.temporaryCount = Math.max(this._currentTemporary, this.temporaryCount);
        return new o.ReadVarExpr(temporaryName(this.bindingId, tempNumber));
    }
    /**
     * @param {?} temporary
     * @return {?}
     */
    releaseTemporary(temporary) {
        this._currentTemporary--;
        if (temporary.name != temporaryName(this.bindingId, this._currentTemporary)) {
            throw new Error(`Temporary ${temporary.name} released out of order`);
        }
    }
}
if (false) {
    /** @type {?} */
    _AstToIrVisitor.prototype._nodeMap;
    /** @type {?} */
    _AstToIrVisitor.prototype._resultMap;
    /** @type {?} */
    _AstToIrVisitor.prototype._currentTemporary;
    /** @type {?} */
    _AstToIrVisitor.prototype.temporaryCount;
    /** @type {?} */
    _AstToIrVisitor.prototype._localResolver;
    /** @type {?} */
    _AstToIrVisitor.prototype._implicitReceiver;
    /** @type {?} */
    _AstToIrVisitor.prototype.bindingId;
    /** @type {?} */
    _AstToIrVisitor.prototype.interpolationFunction;
}
/**
 * @param {?} arg
 * @param {?} output
 * @return {?}
 */
function flattenStatements(arg, output) {
    if (Array.isArray(arg)) {
        (/** @type {?} */ (arg)).forEach((entry) => flattenStatements(entry, output));
    }
    else {
        output.push(arg);
    }
}
class DefaultLocalResolver {
    /**
     * @param {?} name
     * @return {?}
     */
    getLocal(name) {
        if (name === EventHandlerVars.event.name) {
            return EventHandlerVars.event;
        }
        return null;
    }
}
/**
 * @param {?} bindingId
 * @return {?}
 */
function createCurrValueExpr(bindingId) {
    return o.variable(`currVal_${bindingId}`); // fix syntax highlighting: `
}
/**
 * @param {?} bindingId
 * @return {?}
 */
function createPreventDefaultVar(bindingId) {
    return o.variable(`pd_${bindingId}`);
}
/**
 * @param {?} stmt
 * @return {?}
 */
function convertStmtIntoExpression(stmt) {
    if (stmt instanceof o.ExpressionStatement) {
        return stmt.expr;
    }
    else if (stmt instanceof o.ReturnStatement) {
        return stmt.value;
    }
    return null;
}
export class BuiltinFunctionCall extends cdAst.FunctionCall {
    /**
     * @param {?} span
     * @param {?} args
     * @param {?} converter
     */
    constructor(span, args, converter) {
        super(span, null, args);
        this.args = args;
        this.converter = converter;
    }
}
if (false) {
    /** @type {?} */
    BuiltinFunctionCall.prototype.args;
    /** @type {?} */
    BuiltinFunctionCall.prototype.converter;
}
//# sourceMappingURL=expression_converter.js.map