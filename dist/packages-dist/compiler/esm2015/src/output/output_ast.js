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
/** @enum {number} */
const TypeModifier = {
    Const: 0,
};
export { TypeModifier };
TypeModifier[TypeModifier.Const] = 'Const';
/**
 * @abstract
 */
export class Type {
    /**
     * @param {?=} modifiers
     */
    constructor(modifiers = null) {
        this.modifiers = modifiers;
        if (!modifiers) {
            this.modifiers = [];
        }
    }
    /**
     * @param {?} modifier
     * @return {?}
     */
    hasModifier(modifier) { return /** @type {?} */ ((this.modifiers)).indexOf(modifier) !== -1; }
}
if (false) {
    /** @type {?} */
    Type.prototype.modifiers;
    /**
     * @abstract
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    Type.prototype.visitType = function (visitor, context) { };
}
/** @enum {number} */
const BuiltinTypeName = {
    Dynamic: 0,
    Bool: 1,
    String: 2,
    Int: 3,
    Number: 4,
    Function: 5,
    Inferred: 6,
    None: 7,
};
export { BuiltinTypeName };
BuiltinTypeName[BuiltinTypeName.Dynamic] = 'Dynamic';
BuiltinTypeName[BuiltinTypeName.Bool] = 'Bool';
BuiltinTypeName[BuiltinTypeName.String] = 'String';
BuiltinTypeName[BuiltinTypeName.Int] = 'Int';
BuiltinTypeName[BuiltinTypeName.Number] = 'Number';
BuiltinTypeName[BuiltinTypeName.Function] = 'Function';
BuiltinTypeName[BuiltinTypeName.Inferred] = 'Inferred';
BuiltinTypeName[BuiltinTypeName.None] = 'None';
export class BuiltinType extends Type {
    /**
     * @param {?} name
     * @param {?=} modifiers
     */
    constructor(name, modifiers = null) {
        super(modifiers);
        this.name = name;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitType(visitor, context) {
        return visitor.visitBuiltinType(this, context);
    }
}
if (false) {
    /** @type {?} */
    BuiltinType.prototype.name;
}
export class ExpressionType extends Type {
    /**
     * @param {?} value
     * @param {?=} modifiers
     * @param {?=} typeParams
     */
    constructor(value, modifiers = null, typeParams = null) {
        super(modifiers);
        this.value = value;
        this.typeParams = typeParams;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitType(visitor, context) {
        return visitor.visitExpressionType(this, context);
    }
}
if (false) {
    /** @type {?} */
    ExpressionType.prototype.value;
    /** @type {?} */
    ExpressionType.prototype.typeParams;
}
export class ArrayType extends Type {
    /**
     * @param {?} of
     * @param {?=} modifiers
     */
    constructor(of, modifiers = null) {
        super(modifiers);
        this.of = of;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitType(visitor, context) {
        return visitor.visitArrayType(this, context);
    }
}
if (false) {
    /** @type {?} */
    ArrayType.prototype.of;
}
export class MapType extends Type {
    /**
     * @param {?} valueType
     * @param {?=} modifiers
     */
    constructor(valueType, modifiers = null) {
        super(modifiers);
        this.valueType = valueType || null;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitType(visitor, context) { return visitor.visitMapType(this, context); }
}
if (false) {
    /** @type {?} */
    MapType.prototype.valueType;
}
/** @type {?} */
export const DYNAMIC_TYPE = new BuiltinType(BuiltinTypeName.Dynamic);
/** @type {?} */
export const INFERRED_TYPE = new BuiltinType(BuiltinTypeName.Inferred);
/** @type {?} */
export const BOOL_TYPE = new BuiltinType(BuiltinTypeName.Bool);
/** @type {?} */
export const INT_TYPE = new BuiltinType(BuiltinTypeName.Int);
/** @type {?} */
export const NUMBER_TYPE = new BuiltinType(BuiltinTypeName.Number);
/** @type {?} */
export const STRING_TYPE = new BuiltinType(BuiltinTypeName.String);
/** @type {?} */
export const FUNCTION_TYPE = new BuiltinType(BuiltinTypeName.Function);
/** @type {?} */
export const NONE_TYPE = new BuiltinType(BuiltinTypeName.None);
/**
 * @record
 */
export function TypeVisitor() { }
/** @type {?} */
TypeVisitor.prototype.visitBuiltinType;
/** @type {?} */
TypeVisitor.prototype.visitExpressionType;
/** @type {?} */
TypeVisitor.prototype.visitArrayType;
/** @type {?} */
TypeVisitor.prototype.visitMapType;
/** @enum {number} */
const BinaryOperator = {
    Equals: 0,
    NotEquals: 1,
    Identical: 2,
    NotIdentical: 3,
    Minus: 4,
    Plus: 5,
    Divide: 6,
    Multiply: 7,
    Modulo: 8,
    And: 9,
    Or: 10,
    BitwiseAnd: 11,
    Lower: 12,
    LowerEquals: 13,
    Bigger: 14,
    BiggerEquals: 15,
};
export { BinaryOperator };
BinaryOperator[BinaryOperator.Equals] = 'Equals';
BinaryOperator[BinaryOperator.NotEquals] = 'NotEquals';
BinaryOperator[BinaryOperator.Identical] = 'Identical';
BinaryOperator[BinaryOperator.NotIdentical] = 'NotIdentical';
BinaryOperator[BinaryOperator.Minus] = 'Minus';
BinaryOperator[BinaryOperator.Plus] = 'Plus';
BinaryOperator[BinaryOperator.Divide] = 'Divide';
BinaryOperator[BinaryOperator.Multiply] = 'Multiply';
BinaryOperator[BinaryOperator.Modulo] = 'Modulo';
BinaryOperator[BinaryOperator.And] = 'And';
BinaryOperator[BinaryOperator.Or] = 'Or';
BinaryOperator[BinaryOperator.BitwiseAnd] = 'BitwiseAnd';
BinaryOperator[BinaryOperator.Lower] = 'Lower';
BinaryOperator[BinaryOperator.LowerEquals] = 'LowerEquals';
BinaryOperator[BinaryOperator.Bigger] = 'Bigger';
BinaryOperator[BinaryOperator.BiggerEquals] = 'BiggerEquals';
/**
 * @template T
 * @param {?} base
 * @param {?} other
 * @return {?}
 */
export function nullSafeIsEquivalent(base, other) {
    if (base == null || other == null) {
        return base == other;
    }
    return base.isEquivalent(other);
}
/**
 * @template T
 * @param {?} base
 * @param {?} other
 * @return {?}
 */
export function areAllEquivalent(base, other) {
    /** @type {?} */
    const len = base.length;
    if (len !== other.length) {
        return false;
    }
    for (let i = 0; i < len; i++) {
        if (!base[i].isEquivalent(other[i])) {
            return false;
        }
    }
    return true;
}
/**
 * @abstract
 */
export class Expression {
    /**
     * @param {?} type
     * @param {?=} sourceSpan
     */
    constructor(type, sourceSpan) {
        this.type = type || null;
        this.sourceSpan = sourceSpan || null;
    }
    /**
     * @param {?} name
     * @param {?=} sourceSpan
     * @return {?}
     */
    prop(name, sourceSpan) {
        return new ReadPropExpr(this, name, null, sourceSpan);
    }
    /**
     * @param {?} index
     * @param {?=} type
     * @param {?=} sourceSpan
     * @return {?}
     */
    key(index, type, sourceSpan) {
        return new ReadKeyExpr(this, index, type, sourceSpan);
    }
    /**
     * @param {?} name
     * @param {?} params
     * @param {?=} sourceSpan
     * @return {?}
     */
    callMethod(name, params, sourceSpan) {
        return new InvokeMethodExpr(this, name, params, null, sourceSpan);
    }
    /**
     * @param {?} params
     * @param {?=} sourceSpan
     * @return {?}
     */
    callFn(params, sourceSpan) {
        return new InvokeFunctionExpr(this, params, null, sourceSpan);
    }
    /**
     * @param {?} params
     * @param {?=} type
     * @param {?=} sourceSpan
     * @return {?}
     */
    instantiate(params, type, sourceSpan) {
        return new InstantiateExpr(this, params, type, sourceSpan);
    }
    /**
     * @param {?} trueCase
     * @param {?=} falseCase
     * @param {?=} sourceSpan
     * @return {?}
     */
    conditional(trueCase, falseCase = null, sourceSpan) {
        return new ConditionalExpr(this, trueCase, falseCase, null, sourceSpan);
    }
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    equals(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Equals, this, rhs, null, sourceSpan);
    }
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    notEquals(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.NotEquals, this, rhs, null, sourceSpan);
    }
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    identical(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Identical, this, rhs, null, sourceSpan);
    }
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    notIdentical(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.NotIdentical, this, rhs, null, sourceSpan);
    }
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    minus(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Minus, this, rhs, null, sourceSpan);
    }
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    plus(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Plus, this, rhs, null, sourceSpan);
    }
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    divide(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Divide, this, rhs, null, sourceSpan);
    }
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    multiply(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Multiply, this, rhs, null, sourceSpan);
    }
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    modulo(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Modulo, this, rhs, null, sourceSpan);
    }
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    and(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.And, this, rhs, null, sourceSpan);
    }
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @param {?=} parens
     * @return {?}
     */
    bitwiseAnd(rhs, sourceSpan, parens = true) {
        return new BinaryOperatorExpr(BinaryOperator.BitwiseAnd, this, rhs, null, sourceSpan, parens);
    }
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    or(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Or, this, rhs, null, sourceSpan);
    }
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    lower(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Lower, this, rhs, null, sourceSpan);
    }
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    lowerEquals(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.LowerEquals, this, rhs, null, sourceSpan);
    }
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    bigger(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Bigger, this, rhs, null, sourceSpan);
    }
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    biggerEquals(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.BiggerEquals, this, rhs, null, sourceSpan);
    }
    /**
     * @param {?=} sourceSpan
     * @return {?}
     */
    isBlank(sourceSpan) {
        // Note: We use equals by purpose here to compare to null and undefined in JS.
        // We use the typed null to allow strictNullChecks to narrow types.
        return this.equals(TYPED_NULL_EXPR, sourceSpan);
    }
    /**
     * @param {?} type
     * @param {?=} sourceSpan
     * @return {?}
     */
    cast(type, sourceSpan) {
        return new CastExpr(this, type, sourceSpan);
    }
    /**
     * @return {?}
     */
    toStmt() { return new ExpressionStatement(this, null); }
}
if (false) {
    /** @type {?} */
    Expression.prototype.type;
    /** @type {?} */
    Expression.prototype.sourceSpan;
    /**
     * @abstract
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    Expression.prototype.visitExpression = function (visitor, context) { };
    /**
     * Calculates whether this expression produces the same value as the given expression.
     * Note: We don't check Types nor ParseSourceSpans nor function arguments.
     * @abstract
     * @param {?} e
     * @return {?}
     */
    Expression.prototype.isEquivalent = function (e) { };
    /**
     * Return true if the expression is constant.
     * @abstract
     * @return {?}
     */
    Expression.prototype.isConstant = function () { };
}
/** @enum {number} */
const BuiltinVar = {
    This: 0,
    Super: 1,
    CatchError: 2,
    CatchStack: 3,
};
export { BuiltinVar };
BuiltinVar[BuiltinVar.This] = 'This';
BuiltinVar[BuiltinVar.Super] = 'Super';
BuiltinVar[BuiltinVar.CatchError] = 'CatchError';
BuiltinVar[BuiltinVar.CatchStack] = 'CatchStack';
export class ReadVarExpr extends Expression {
    /**
     * @param {?} name
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    constructor(name, type, sourceSpan) {
        super(type, sourceSpan);
        if (typeof name === 'string') {
            this.name = name;
            this.builtin = null;
        }
        else {
            this.name = null;
            this.builtin = name;
        }
    }
    /**
     * @param {?} e
     * @return {?}
     */
    isEquivalent(e) {
        return e instanceof ReadVarExpr && this.name === e.name && this.builtin === e.builtin;
    }
    /**
     * @return {?}
     */
    isConstant() { return false; }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitReadVarExpr(this, context);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set(value) {
        if (!this.name) {
            throw new Error(`Built in variable ${this.builtin} can not be assigned to.`);
        }
        return new WriteVarExpr(this.name, value, null, this.sourceSpan);
    }
}
if (false) {
    /** @type {?} */
    ReadVarExpr.prototype.name;
    /** @type {?} */
    ReadVarExpr.prototype.builtin;
}
export class TypeofExpr extends Expression {
    /**
     * @param {?} expr
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    constructor(expr, type, sourceSpan) {
        super(type, sourceSpan);
        this.expr = expr;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitTypeofExpr(this, context);
    }
    /**
     * @param {?} e
     * @return {?}
     */
    isEquivalent(e) {
        return e instanceof TypeofExpr && e.expr.isEquivalent(this.expr);
    }
    /**
     * @return {?}
     */
    isConstant() { return this.expr.isConstant(); }
}
if (false) {
    /** @type {?} */
    TypeofExpr.prototype.expr;
}
/**
 * @template T
 */
export class WrappedNodeExpr extends Expression {
    /**
     * @param {?} node
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    constructor(node, type, sourceSpan) {
        super(type, sourceSpan);
        this.node = node;
    }
    /**
     * @param {?} e
     * @return {?}
     */
    isEquivalent(e) {
        return e instanceof WrappedNodeExpr && this.node === e.node;
    }
    /**
     * @return {?}
     */
    isConstant() { return false; }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitWrappedNodeExpr(this, context);
    }
}
if (false) {
    /** @type {?} */
    WrappedNodeExpr.prototype.node;
}
export class WriteVarExpr extends Expression {
    /**
     * @param {?} name
     * @param {?} value
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    constructor(name, value, type, sourceSpan) {
        super(type || value.type, sourceSpan);
        this.name = name;
        this.value = value;
    }
    /**
     * @param {?} e
     * @return {?}
     */
    isEquivalent(e) {
        return e instanceof WriteVarExpr && this.name === e.name && this.value.isEquivalent(e.value);
    }
    /**
     * @return {?}
     */
    isConstant() { return false; }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitWriteVarExpr(this, context);
    }
    /**
     * @param {?=} type
     * @param {?=} modifiers
     * @return {?}
     */
    toDeclStmt(type, modifiers) {
        return new DeclareVarStmt(this.name, this.value, type, modifiers, this.sourceSpan);
    }
}
if (false) {
    /** @type {?} */
    WriteVarExpr.prototype.value;
    /** @type {?} */
    WriteVarExpr.prototype.name;
}
export class WriteKeyExpr extends Expression {
    /**
     * @param {?} receiver
     * @param {?} index
     * @param {?} value
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    constructor(receiver, index, value, type, sourceSpan) {
        super(type || value.type, sourceSpan);
        this.receiver = receiver;
        this.index = index;
        this.value = value;
    }
    /**
     * @param {?} e
     * @return {?}
     */
    isEquivalent(e) {
        return e instanceof WriteKeyExpr && this.receiver.isEquivalent(e.receiver) &&
            this.index.isEquivalent(e.index) && this.value.isEquivalent(e.value);
    }
    /**
     * @return {?}
     */
    isConstant() { return false; }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitWriteKeyExpr(this, context);
    }
}
if (false) {
    /** @type {?} */
    WriteKeyExpr.prototype.value;
    /** @type {?} */
    WriteKeyExpr.prototype.receiver;
    /** @type {?} */
    WriteKeyExpr.prototype.index;
}
export class WritePropExpr extends Expression {
    /**
     * @param {?} receiver
     * @param {?} name
     * @param {?} value
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    constructor(receiver, name, value, type, sourceSpan) {
        super(type || value.type, sourceSpan);
        this.receiver = receiver;
        this.name = name;
        this.value = value;
    }
    /**
     * @param {?} e
     * @return {?}
     */
    isEquivalent(e) {
        return e instanceof WritePropExpr && this.receiver.isEquivalent(e.receiver) &&
            this.name === e.name && this.value.isEquivalent(e.value);
    }
    /**
     * @return {?}
     */
    isConstant() { return false; }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitWritePropExpr(this, context);
    }
}
if (false) {
    /** @type {?} */
    WritePropExpr.prototype.value;
    /** @type {?} */
    WritePropExpr.prototype.receiver;
    /** @type {?} */
    WritePropExpr.prototype.name;
}
/** @enum {number} */
const BuiltinMethod = {
    ConcatArray: 0,
    SubscribeObservable: 1,
    Bind: 2,
};
export { BuiltinMethod };
BuiltinMethod[BuiltinMethod.ConcatArray] = 'ConcatArray';
BuiltinMethod[BuiltinMethod.SubscribeObservable] = 'SubscribeObservable';
BuiltinMethod[BuiltinMethod.Bind] = 'Bind';
export class InvokeMethodExpr extends Expression {
    /**
     * @param {?} receiver
     * @param {?} method
     * @param {?} args
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    constructor(receiver, method, args, type, sourceSpan) {
        super(type, sourceSpan);
        this.receiver = receiver;
        this.args = args;
        if (typeof method === 'string') {
            this.name = method;
            this.builtin = null;
        }
        else {
            this.name = null;
            this.builtin = /** @type {?} */ (method);
        }
    }
    /**
     * @param {?} e
     * @return {?}
     */
    isEquivalent(e) {
        return e instanceof InvokeMethodExpr && this.receiver.isEquivalent(e.receiver) &&
            this.name === e.name && this.builtin === e.builtin && areAllEquivalent(this.args, e.args);
    }
    /**
     * @return {?}
     */
    isConstant() { return false; }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitInvokeMethodExpr(this, context);
    }
}
if (false) {
    /** @type {?} */
    InvokeMethodExpr.prototype.name;
    /** @type {?} */
    InvokeMethodExpr.prototype.builtin;
    /** @type {?} */
    InvokeMethodExpr.prototype.receiver;
    /** @type {?} */
    InvokeMethodExpr.prototype.args;
}
export class InvokeFunctionExpr extends Expression {
    /**
     * @param {?} fn
     * @param {?} args
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    constructor(fn, args, type, sourceSpan) {
        super(type, sourceSpan);
        this.fn = fn;
        this.args = args;
    }
    /**
     * @param {?} e
     * @return {?}
     */
    isEquivalent(e) {
        return e instanceof InvokeFunctionExpr && this.fn.isEquivalent(e.fn) &&
            areAllEquivalent(this.args, e.args);
    }
    /**
     * @return {?}
     */
    isConstant() { return false; }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitInvokeFunctionExpr(this, context);
    }
}
if (false) {
    /** @type {?} */
    InvokeFunctionExpr.prototype.fn;
    /** @type {?} */
    InvokeFunctionExpr.prototype.args;
}
export class InstantiateExpr extends Expression {
    /**
     * @param {?} classExpr
     * @param {?} args
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    constructor(classExpr, args, type, sourceSpan) {
        super(type, sourceSpan);
        this.classExpr = classExpr;
        this.args = args;
    }
    /**
     * @param {?} e
     * @return {?}
     */
    isEquivalent(e) {
        return e instanceof InstantiateExpr && this.classExpr.isEquivalent(e.classExpr) &&
            areAllEquivalent(this.args, e.args);
    }
    /**
     * @return {?}
     */
    isConstant() { return false; }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitInstantiateExpr(this, context);
    }
}
if (false) {
    /** @type {?} */
    InstantiateExpr.prototype.classExpr;
    /** @type {?} */
    InstantiateExpr.prototype.args;
}
export class LiteralExpr extends Expression {
    /**
     * @param {?} value
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    constructor(value, type, sourceSpan) {
        super(type, sourceSpan);
        this.value = value;
    }
    /**
     * @param {?} e
     * @return {?}
     */
    isEquivalent(e) {
        return e instanceof LiteralExpr && this.value === e.value;
    }
    /**
     * @return {?}
     */
    isConstant() { return true; }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitLiteralExpr(this, context);
    }
}
if (false) {
    /** @type {?} */
    LiteralExpr.prototype.value;
}
export class ExternalExpr extends Expression {
    /**
     * @param {?} value
     * @param {?=} type
     * @param {?=} typeParams
     * @param {?=} sourceSpan
     */
    constructor(value, type, typeParams = null, sourceSpan) {
        super(type, sourceSpan);
        this.value = value;
        this.typeParams = typeParams;
    }
    /**
     * @param {?} e
     * @return {?}
     */
    isEquivalent(e) {
        return e instanceof ExternalExpr && this.value.name === e.value.name &&
            this.value.moduleName === e.value.moduleName && this.value.runtime === e.value.runtime;
    }
    /**
     * @return {?}
     */
    isConstant() { return false; }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitExternalExpr(this, context);
    }
}
if (false) {
    /** @type {?} */
    ExternalExpr.prototype.value;
    /** @type {?} */
    ExternalExpr.prototype.typeParams;
}
export class ExternalReference {
    /**
     * @param {?} moduleName
     * @param {?} name
     * @param {?=} runtime
     */
    constructor(moduleName, name, runtime) {
        this.moduleName = moduleName;
        this.name = name;
        this.runtime = runtime;
    }
}
if (false) {
    /** @type {?} */
    ExternalReference.prototype.moduleName;
    /** @type {?} */
    ExternalReference.prototype.name;
    /** @type {?} */
    ExternalReference.prototype.runtime;
}
export class ConditionalExpr extends Expression {
    /**
     * @param {?} condition
     * @param {?} trueCase
     * @param {?=} falseCase
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    constructor(condition, trueCase, falseCase = null, type, sourceSpan) {
        super(type || trueCase.type, sourceSpan);
        this.condition = condition;
        this.falseCase = falseCase;
        this.trueCase = trueCase;
    }
    /**
     * @param {?} e
     * @return {?}
     */
    isEquivalent(e) {
        return e instanceof ConditionalExpr && this.condition.isEquivalent(e.condition) &&
            this.trueCase.isEquivalent(e.trueCase) && nullSafeIsEquivalent(this.falseCase, e.falseCase);
    }
    /**
     * @return {?}
     */
    isConstant() { return false; }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitConditionalExpr(this, context);
    }
}
if (false) {
    /** @type {?} */
    ConditionalExpr.prototype.trueCase;
    /** @type {?} */
    ConditionalExpr.prototype.condition;
    /** @type {?} */
    ConditionalExpr.prototype.falseCase;
}
export class NotExpr extends Expression {
    /**
     * @param {?} condition
     * @param {?=} sourceSpan
     */
    constructor(condition, sourceSpan) {
        super(BOOL_TYPE, sourceSpan);
        this.condition = condition;
    }
    /**
     * @param {?} e
     * @return {?}
     */
    isEquivalent(e) {
        return e instanceof NotExpr && this.condition.isEquivalent(e.condition);
    }
    /**
     * @return {?}
     */
    isConstant() { return false; }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitNotExpr(this, context);
    }
}
if (false) {
    /** @type {?} */
    NotExpr.prototype.condition;
}
export class AssertNotNull extends Expression {
    /**
     * @param {?} condition
     * @param {?=} sourceSpan
     */
    constructor(condition, sourceSpan) {
        super(condition.type, sourceSpan);
        this.condition = condition;
    }
    /**
     * @param {?} e
     * @return {?}
     */
    isEquivalent(e) {
        return e instanceof AssertNotNull && this.condition.isEquivalent(e.condition);
    }
    /**
     * @return {?}
     */
    isConstant() { return false; }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitAssertNotNullExpr(this, context);
    }
}
if (false) {
    /** @type {?} */
    AssertNotNull.prototype.condition;
}
export class CastExpr extends Expression {
    /**
     * @param {?} value
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    constructor(value, type, sourceSpan) {
        super(type, sourceSpan);
        this.value = value;
    }
    /**
     * @param {?} e
     * @return {?}
     */
    isEquivalent(e) {
        return e instanceof CastExpr && this.value.isEquivalent(e.value);
    }
    /**
     * @return {?}
     */
    isConstant() { return false; }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitCastExpr(this, context);
    }
}
if (false) {
    /** @type {?} */
    CastExpr.prototype.value;
}
export class FnParam {
    /**
     * @param {?} name
     * @param {?=} type
     */
    constructor(name, type = null) {
        this.name = name;
        this.type = type;
    }
    /**
     * @param {?} param
     * @return {?}
     */
    isEquivalent(param) { return this.name === param.name; }
}
if (false) {
    /** @type {?} */
    FnParam.prototype.name;
    /** @type {?} */
    FnParam.prototype.type;
}
export class FunctionExpr extends Expression {
    /**
     * @param {?} params
     * @param {?} statements
     * @param {?=} type
     * @param {?=} sourceSpan
     * @param {?=} name
     */
    constructor(params, statements, type, sourceSpan, name) {
        super(type, sourceSpan);
        this.params = params;
        this.statements = statements;
        this.name = name;
    }
    /**
     * @param {?} e
     * @return {?}
     */
    isEquivalent(e) {
        return e instanceof FunctionExpr && areAllEquivalent(this.params, e.params) &&
            areAllEquivalent(this.statements, e.statements);
    }
    /**
     * @return {?}
     */
    isConstant() { return false; }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitFunctionExpr(this, context);
    }
    /**
     * @param {?} name
     * @param {?=} modifiers
     * @return {?}
     */
    toDeclStmt(name, modifiers = null) {
        return new DeclareFunctionStmt(name, this.params, this.statements, this.type, modifiers, this.sourceSpan);
    }
}
if (false) {
    /** @type {?} */
    FunctionExpr.prototype.params;
    /** @type {?} */
    FunctionExpr.prototype.statements;
    /** @type {?} */
    FunctionExpr.prototype.name;
}
export class BinaryOperatorExpr extends Expression {
    /**
     * @param {?} operator
     * @param {?} lhs
     * @param {?} rhs
     * @param {?=} type
     * @param {?=} sourceSpan
     * @param {?=} parens
     */
    constructor(operator, lhs, rhs, type, sourceSpan, parens = true) {
        super(type || lhs.type, sourceSpan);
        this.operator = operator;
        this.rhs = rhs;
        this.parens = parens;
        this.lhs = lhs;
    }
    /**
     * @param {?} e
     * @return {?}
     */
    isEquivalent(e) {
        return e instanceof BinaryOperatorExpr && this.operator === e.operator &&
            this.lhs.isEquivalent(e.lhs) && this.rhs.isEquivalent(e.rhs);
    }
    /**
     * @return {?}
     */
    isConstant() { return false; }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitBinaryOperatorExpr(this, context);
    }
}
if (false) {
    /** @type {?} */
    BinaryOperatorExpr.prototype.lhs;
    /** @type {?} */
    BinaryOperatorExpr.prototype.operator;
    /** @type {?} */
    BinaryOperatorExpr.prototype.rhs;
    /** @type {?} */
    BinaryOperatorExpr.prototype.parens;
}
export class ReadPropExpr extends Expression {
    /**
     * @param {?} receiver
     * @param {?} name
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    constructor(receiver, name, type, sourceSpan) {
        super(type, sourceSpan);
        this.receiver = receiver;
        this.name = name;
    }
    /**
     * @param {?} e
     * @return {?}
     */
    isEquivalent(e) {
        return e instanceof ReadPropExpr && this.receiver.isEquivalent(e.receiver) &&
            this.name === e.name;
    }
    /**
     * @return {?}
     */
    isConstant() { return false; }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitReadPropExpr(this, context);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set(value) {
        return new WritePropExpr(this.receiver, this.name, value, null, this.sourceSpan);
    }
}
if (false) {
    /** @type {?} */
    ReadPropExpr.prototype.receiver;
    /** @type {?} */
    ReadPropExpr.prototype.name;
}
export class ReadKeyExpr extends Expression {
    /**
     * @param {?} receiver
     * @param {?} index
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    constructor(receiver, index, type, sourceSpan) {
        super(type, sourceSpan);
        this.receiver = receiver;
        this.index = index;
    }
    /**
     * @param {?} e
     * @return {?}
     */
    isEquivalent(e) {
        return e instanceof ReadKeyExpr && this.receiver.isEquivalent(e.receiver) &&
            this.index.isEquivalent(e.index);
    }
    /**
     * @return {?}
     */
    isConstant() { return false; }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitReadKeyExpr(this, context);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set(value) {
        return new WriteKeyExpr(this.receiver, this.index, value, null, this.sourceSpan);
    }
}
if (false) {
    /** @type {?} */
    ReadKeyExpr.prototype.receiver;
    /** @type {?} */
    ReadKeyExpr.prototype.index;
}
export class LiteralArrayExpr extends Expression {
    /**
     * @param {?} entries
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    constructor(entries, type, sourceSpan) {
        super(type, sourceSpan);
        this.entries = entries;
    }
    /**
     * @return {?}
     */
    isConstant() { return this.entries.every(e => e.isConstant()); }
    /**
     * @param {?} e
     * @return {?}
     */
    isEquivalent(e) {
        return e instanceof LiteralArrayExpr && areAllEquivalent(this.entries, e.entries);
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitLiteralArrayExpr(this, context);
    }
}
if (false) {
    /** @type {?} */
    LiteralArrayExpr.prototype.entries;
}
export class LiteralMapEntry {
    /**
     * @param {?} key
     * @param {?} value
     * @param {?} quoted
     */
    constructor(key, value, quoted) {
        this.key = key;
        this.value = value;
        this.quoted = quoted;
    }
    /**
     * @param {?} e
     * @return {?}
     */
    isEquivalent(e) {
        return this.key === e.key && this.value.isEquivalent(e.value);
    }
}
if (false) {
    /** @type {?} */
    LiteralMapEntry.prototype.key;
    /** @type {?} */
    LiteralMapEntry.prototype.value;
    /** @type {?} */
    LiteralMapEntry.prototype.quoted;
}
export class LiteralMapExpr extends Expression {
    /**
     * @param {?} entries
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    constructor(entries, type, sourceSpan) {
        super(type, sourceSpan);
        this.entries = entries;
        this.valueType = null;
        if (type) {
            this.valueType = type.valueType;
        }
    }
    /**
     * @param {?} e
     * @return {?}
     */
    isEquivalent(e) {
        return e instanceof LiteralMapExpr && areAllEquivalent(this.entries, e.entries);
    }
    /**
     * @return {?}
     */
    isConstant() { return this.entries.every(e => e.value.isConstant()); }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitLiteralMapExpr(this, context);
    }
}
if (false) {
    /** @type {?} */
    LiteralMapExpr.prototype.valueType;
    /** @type {?} */
    LiteralMapExpr.prototype.entries;
}
export class CommaExpr extends Expression {
    /**
     * @param {?} parts
     * @param {?=} sourceSpan
     */
    constructor(parts, sourceSpan) {
        super(parts[parts.length - 1].type, sourceSpan);
        this.parts = parts;
    }
    /**
     * @param {?} e
     * @return {?}
     */
    isEquivalent(e) {
        return e instanceof CommaExpr && areAllEquivalent(this.parts, e.parts);
    }
    /**
     * @return {?}
     */
    isConstant() { return false; }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitCommaExpr(this, context);
    }
}
if (false) {
    /** @type {?} */
    CommaExpr.prototype.parts;
}
/**
 * @record
 */
export function ExpressionVisitor() { }
/** @type {?} */
ExpressionVisitor.prototype.visitReadVarExpr;
/** @type {?} */
ExpressionVisitor.prototype.visitWriteVarExpr;
/** @type {?} */
ExpressionVisitor.prototype.visitWriteKeyExpr;
/** @type {?} */
ExpressionVisitor.prototype.visitWritePropExpr;
/** @type {?} */
ExpressionVisitor.prototype.visitInvokeMethodExpr;
/** @type {?} */
ExpressionVisitor.prototype.visitInvokeFunctionExpr;
/** @type {?} */
ExpressionVisitor.prototype.visitInstantiateExpr;
/** @type {?} */
ExpressionVisitor.prototype.visitLiteralExpr;
/** @type {?} */
ExpressionVisitor.prototype.visitExternalExpr;
/** @type {?} */
ExpressionVisitor.prototype.visitConditionalExpr;
/** @type {?} */
ExpressionVisitor.prototype.visitNotExpr;
/** @type {?} */
ExpressionVisitor.prototype.visitAssertNotNullExpr;
/** @type {?} */
ExpressionVisitor.prototype.visitCastExpr;
/** @type {?} */
ExpressionVisitor.prototype.visitFunctionExpr;
/** @type {?} */
ExpressionVisitor.prototype.visitBinaryOperatorExpr;
/** @type {?} */
ExpressionVisitor.prototype.visitReadPropExpr;
/** @type {?} */
ExpressionVisitor.prototype.visitReadKeyExpr;
/** @type {?} */
ExpressionVisitor.prototype.visitLiteralArrayExpr;
/** @type {?} */
ExpressionVisitor.prototype.visitLiteralMapExpr;
/** @type {?} */
ExpressionVisitor.prototype.visitCommaExpr;
/** @type {?} */
ExpressionVisitor.prototype.visitWrappedNodeExpr;
/** @type {?} */
ExpressionVisitor.prototype.visitTypeofExpr;
/** @type {?} */
export const THIS_EXPR = new ReadVarExpr(BuiltinVar.This, null, null);
/** @type {?} */
export const SUPER_EXPR = new ReadVarExpr(BuiltinVar.Super, null, null);
/** @type {?} */
export const CATCH_ERROR_VAR = new ReadVarExpr(BuiltinVar.CatchError, null, null);
/** @type {?} */
export const CATCH_STACK_VAR = new ReadVarExpr(BuiltinVar.CatchStack, null, null);
/** @type {?} */
export const NULL_EXPR = new LiteralExpr(null, null, null);
/** @type {?} */
export const TYPED_NULL_EXPR = new LiteralExpr(null, INFERRED_TYPE, null);
/** @enum {number} */
const StmtModifier = {
    Final: 0,
    Private: 1,
    Exported: 2,
    Static: 3,
};
export { StmtModifier };
StmtModifier[StmtModifier.Final] = 'Final';
StmtModifier[StmtModifier.Private] = 'Private';
StmtModifier[StmtModifier.Exported] = 'Exported';
StmtModifier[StmtModifier.Static] = 'Static';
/**
 * @abstract
 */
export class Statement {
    /**
     * @param {?=} modifiers
     * @param {?=} sourceSpan
     */
    constructor(modifiers, sourceSpan) {
        this.modifiers = modifiers || [];
        this.sourceSpan = sourceSpan || null;
    }
    /**
     * @param {?} modifier
     * @return {?}
     */
    hasModifier(modifier) { return /** @type {?} */ ((this.modifiers)).indexOf(modifier) !== -1; }
}
if (false) {
    /** @type {?} */
    Statement.prototype.modifiers;
    /** @type {?} */
    Statement.prototype.sourceSpan;
    /**
     * Calculates whether this statement produces the same value as the given statement.
     * Note: We don't check Types nor ParseSourceSpans nor function arguments.
     * @abstract
     * @param {?} stmt
     * @return {?}
     */
    Statement.prototype.isEquivalent = function (stmt) { };
    /**
     * @abstract
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    Statement.prototype.visitStatement = function (visitor, context) { };
}
export class DeclareVarStmt extends Statement {
    /**
     * @param {?} name
     * @param {?=} value
     * @param {?=} type
     * @param {?=} modifiers
     * @param {?=} sourceSpan
     */
    constructor(name, value, type, modifiers = null, sourceSpan) {
        super(modifiers, sourceSpan);
        this.name = name;
        this.value = value;
        this.type = type || (value && value.type) || null;
    }
    /**
     * @param {?} stmt
     * @return {?}
     */
    isEquivalent(stmt) {
        return stmt instanceof DeclareVarStmt && this.name === stmt.name &&
            (this.value ? !!stmt.value && this.value.isEquivalent(stmt.value) : !stmt.value);
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitStatement(visitor, context) {
        return visitor.visitDeclareVarStmt(this, context);
    }
}
if (false) {
    /** @type {?} */
    DeclareVarStmt.prototype.type;
    /** @type {?} */
    DeclareVarStmt.prototype.name;
    /** @type {?} */
    DeclareVarStmt.prototype.value;
}
export class DeclareFunctionStmt extends Statement {
    /**
     * @param {?} name
     * @param {?} params
     * @param {?} statements
     * @param {?=} type
     * @param {?=} modifiers
     * @param {?=} sourceSpan
     */
    constructor(name, params, statements, type, modifiers = null, sourceSpan) {
        super(modifiers, sourceSpan);
        this.name = name;
        this.params = params;
        this.statements = statements;
        this.type = type || null;
    }
    /**
     * @param {?} stmt
     * @return {?}
     */
    isEquivalent(stmt) {
        return stmt instanceof DeclareFunctionStmt && areAllEquivalent(this.params, stmt.params) &&
            areAllEquivalent(this.statements, stmt.statements);
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitStatement(visitor, context) {
        return visitor.visitDeclareFunctionStmt(this, context);
    }
}
if (false) {
    /** @type {?} */
    DeclareFunctionStmt.prototype.type;
    /** @type {?} */
    DeclareFunctionStmt.prototype.name;
    /** @type {?} */
    DeclareFunctionStmt.prototype.params;
    /** @type {?} */
    DeclareFunctionStmt.prototype.statements;
}
export class ExpressionStatement extends Statement {
    /**
     * @param {?} expr
     * @param {?=} sourceSpan
     */
    constructor(expr, sourceSpan) {
        super(null, sourceSpan);
        this.expr = expr;
    }
    /**
     * @param {?} stmt
     * @return {?}
     */
    isEquivalent(stmt) {
        return stmt instanceof ExpressionStatement && this.expr.isEquivalent(stmt.expr);
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitStatement(visitor, context) {
        return visitor.visitExpressionStmt(this, context);
    }
}
if (false) {
    /** @type {?} */
    ExpressionStatement.prototype.expr;
}
export class ReturnStatement extends Statement {
    /**
     * @param {?} value
     * @param {?=} sourceSpan
     */
    constructor(value, sourceSpan) {
        super(null, sourceSpan);
        this.value = value;
    }
    /**
     * @param {?} stmt
     * @return {?}
     */
    isEquivalent(stmt) {
        return stmt instanceof ReturnStatement && this.value.isEquivalent(stmt.value);
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitStatement(visitor, context) {
        return visitor.visitReturnStmt(this, context);
    }
}
if (false) {
    /** @type {?} */
    ReturnStatement.prototype.value;
}
export class AbstractClassPart {
    /**
     * @param {?} type
     * @param {?} modifiers
     */
    constructor(type, modifiers) {
        this.modifiers = modifiers;
        if (!modifiers) {
            this.modifiers = [];
        }
        this.type = type || null;
    }
    /**
     * @param {?} modifier
     * @return {?}
     */
    hasModifier(modifier) { return /** @type {?} */ ((this.modifiers)).indexOf(modifier) !== -1; }
}
if (false) {
    /** @type {?} */
    AbstractClassPart.prototype.type;
    /** @type {?} */
    AbstractClassPart.prototype.modifiers;
}
export class ClassField extends AbstractClassPart {
    /**
     * @param {?} name
     * @param {?=} type
     * @param {?=} modifiers
     * @param {?=} initializer
     */
    constructor(name, type, modifiers = null, initializer) {
        super(type, modifiers);
        this.name = name;
        this.initializer = initializer;
    }
    /**
     * @param {?} f
     * @return {?}
     */
    isEquivalent(f) { return this.name === f.name; }
}
if (false) {
    /** @type {?} */
    ClassField.prototype.name;
    /** @type {?} */
    ClassField.prototype.initializer;
}
export class ClassMethod extends AbstractClassPart {
    /**
     * @param {?} name
     * @param {?} params
     * @param {?} body
     * @param {?=} type
     * @param {?=} modifiers
     */
    constructor(name, params, body, type, modifiers = null) {
        super(type, modifiers);
        this.name = name;
        this.params = params;
        this.body = body;
    }
    /**
     * @param {?} m
     * @return {?}
     */
    isEquivalent(m) {
        return this.name === m.name && areAllEquivalent(this.body, m.body);
    }
}
if (false) {
    /** @type {?} */
    ClassMethod.prototype.name;
    /** @type {?} */
    ClassMethod.prototype.params;
    /** @type {?} */
    ClassMethod.prototype.body;
}
export class ClassGetter extends AbstractClassPart {
    /**
     * @param {?} name
     * @param {?} body
     * @param {?=} type
     * @param {?=} modifiers
     */
    constructor(name, body, type, modifiers = null) {
        super(type, modifiers);
        this.name = name;
        this.body = body;
    }
    /**
     * @param {?} m
     * @return {?}
     */
    isEquivalent(m) {
        return this.name === m.name && areAllEquivalent(this.body, m.body);
    }
}
if (false) {
    /** @type {?} */
    ClassGetter.prototype.name;
    /** @type {?} */
    ClassGetter.prototype.body;
}
export class ClassStmt extends Statement {
    /**
     * @param {?} name
     * @param {?} parent
     * @param {?} fields
     * @param {?} getters
     * @param {?} constructorMethod
     * @param {?} methods
     * @param {?=} modifiers
     * @param {?=} sourceSpan
     */
    constructor(name, parent, fields, getters, constructorMethod, methods, modifiers = null, sourceSpan) {
        super(modifiers, sourceSpan);
        this.name = name;
        this.parent = parent;
        this.fields = fields;
        this.getters = getters;
        this.constructorMethod = constructorMethod;
        this.methods = methods;
    }
    /**
     * @param {?} stmt
     * @return {?}
     */
    isEquivalent(stmt) {
        return stmt instanceof ClassStmt && this.name === stmt.name &&
            nullSafeIsEquivalent(this.parent, stmt.parent) &&
            areAllEquivalent(this.fields, stmt.fields) &&
            areAllEquivalent(this.getters, stmt.getters) &&
            this.constructorMethod.isEquivalent(stmt.constructorMethod) &&
            areAllEquivalent(this.methods, stmt.methods);
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitStatement(visitor, context) {
        return visitor.visitDeclareClassStmt(this, context);
    }
}
if (false) {
    /** @type {?} */
    ClassStmt.prototype.name;
    /** @type {?} */
    ClassStmt.prototype.parent;
    /** @type {?} */
    ClassStmt.prototype.fields;
    /** @type {?} */
    ClassStmt.prototype.getters;
    /** @type {?} */
    ClassStmt.prototype.constructorMethod;
    /** @type {?} */
    ClassStmt.prototype.methods;
}
export class IfStmt extends Statement {
    /**
     * @param {?} condition
     * @param {?} trueCase
     * @param {?=} falseCase
     * @param {?=} sourceSpan
     */
    constructor(condition, trueCase, falseCase = [], sourceSpan) {
        super(null, sourceSpan);
        this.condition = condition;
        this.trueCase = trueCase;
        this.falseCase = falseCase;
    }
    /**
     * @param {?} stmt
     * @return {?}
     */
    isEquivalent(stmt) {
        return stmt instanceof IfStmt && this.condition.isEquivalent(stmt.condition) &&
            areAllEquivalent(this.trueCase, stmt.trueCase) &&
            areAllEquivalent(this.falseCase, stmt.falseCase);
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitStatement(visitor, context) {
        return visitor.visitIfStmt(this, context);
    }
}
if (false) {
    /** @type {?} */
    IfStmt.prototype.condition;
    /** @type {?} */
    IfStmt.prototype.trueCase;
    /** @type {?} */
    IfStmt.prototype.falseCase;
}
export class CommentStmt extends Statement {
    /**
     * @param {?} comment
     * @param {?=} multiline
     * @param {?=} sourceSpan
     */
    constructor(comment, multiline = false, sourceSpan) {
        super(null, sourceSpan);
        this.comment = comment;
        this.multiline = multiline;
    }
    /**
     * @param {?} stmt
     * @return {?}
     */
    isEquivalent(stmt) { return stmt instanceof CommentStmt; }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitStatement(visitor, context) {
        return visitor.visitCommentStmt(this, context);
    }
}
if (false) {
    /** @type {?} */
    CommentStmt.prototype.comment;
    /** @type {?} */
    CommentStmt.prototype.multiline;
}
export class JSDocCommentStmt extends Statement {
    /**
     * @param {?=} tags
     * @param {?=} sourceSpan
     */
    constructor(tags = [], sourceSpan) {
        super(null, sourceSpan);
        this.tags = tags;
    }
    /**
     * @param {?} stmt
     * @return {?}
     */
    isEquivalent(stmt) {
        return stmt instanceof JSDocCommentStmt && this.toString() === stmt.toString();
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitStatement(visitor, context) {
        return visitor.visitJSDocCommentStmt(this, context);
    }
    /**
     * @return {?}
     */
    toString() { return serializeTags(this.tags); }
}
if (false) {
    /** @type {?} */
    JSDocCommentStmt.prototype.tags;
}
export class TryCatchStmt extends Statement {
    /**
     * @param {?} bodyStmts
     * @param {?} catchStmts
     * @param {?=} sourceSpan
     */
    constructor(bodyStmts, catchStmts, sourceSpan) {
        super(null, sourceSpan);
        this.bodyStmts = bodyStmts;
        this.catchStmts = catchStmts;
    }
    /**
     * @param {?} stmt
     * @return {?}
     */
    isEquivalent(stmt) {
        return stmt instanceof TryCatchStmt && areAllEquivalent(this.bodyStmts, stmt.bodyStmts) &&
            areAllEquivalent(this.catchStmts, stmt.catchStmts);
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitStatement(visitor, context) {
        return visitor.visitTryCatchStmt(this, context);
    }
}
if (false) {
    /** @type {?} */
    TryCatchStmt.prototype.bodyStmts;
    /** @type {?} */
    TryCatchStmt.prototype.catchStmts;
}
export class ThrowStmt extends Statement {
    /**
     * @param {?} error
     * @param {?=} sourceSpan
     */
    constructor(error, sourceSpan) {
        super(null, sourceSpan);
        this.error = error;
    }
    /**
     * @param {?} stmt
     * @return {?}
     */
    isEquivalent(stmt) {
        return stmt instanceof TryCatchStmt && this.error.isEquivalent(stmt.error);
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitStatement(visitor, context) {
        return visitor.visitThrowStmt(this, context);
    }
}
if (false) {
    /** @type {?} */
    ThrowStmt.prototype.error;
}
/**
 * @record
 */
export function StatementVisitor() { }
/** @type {?} */
StatementVisitor.prototype.visitDeclareVarStmt;
/** @type {?} */
StatementVisitor.prototype.visitDeclareFunctionStmt;
/** @type {?} */
StatementVisitor.prototype.visitExpressionStmt;
/** @type {?} */
StatementVisitor.prototype.visitReturnStmt;
/** @type {?} */
StatementVisitor.prototype.visitDeclareClassStmt;
/** @type {?} */
StatementVisitor.prototype.visitIfStmt;
/** @type {?} */
StatementVisitor.prototype.visitTryCatchStmt;
/** @type {?} */
StatementVisitor.prototype.visitThrowStmt;
/** @type {?} */
StatementVisitor.prototype.visitCommentStmt;
/** @type {?} */
StatementVisitor.prototype.visitJSDocCommentStmt;
export class AstTransformer {
    /**
     * @param {?} expr
     * @param {?} context
     * @return {?}
     */
    transformExpr(expr, context) { return expr; }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    transformStmt(stmt, context) { return stmt; }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitReadVarExpr(ast, context) { return this.transformExpr(ast, context); }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitWrappedNodeExpr(ast, context) {
        return this.transformExpr(ast, context);
    }
    /**
     * @param {?} expr
     * @param {?} context
     * @return {?}
     */
    visitTypeofExpr(expr, context) {
        return this.transformExpr(new TypeofExpr(expr.expr.visitExpression(this, context), expr.type, expr.sourceSpan), context);
    }
    /**
     * @param {?} expr
     * @param {?} context
     * @return {?}
     */
    visitWriteVarExpr(expr, context) {
        return this.transformExpr(new WriteVarExpr(expr.name, expr.value.visitExpression(this, context), expr.type, expr.sourceSpan), context);
    }
    /**
     * @param {?} expr
     * @param {?} context
     * @return {?}
     */
    visitWriteKeyExpr(expr, context) {
        return this.transformExpr(new WriteKeyExpr(expr.receiver.visitExpression(this, context), expr.index.visitExpression(this, context), expr.value.visitExpression(this, context), expr.type, expr.sourceSpan), context);
    }
    /**
     * @param {?} expr
     * @param {?} context
     * @return {?}
     */
    visitWritePropExpr(expr, context) {
        return this.transformExpr(new WritePropExpr(expr.receiver.visitExpression(this, context), expr.name, expr.value.visitExpression(this, context), expr.type, expr.sourceSpan), context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitInvokeMethodExpr(ast, context) {
        /** @type {?} */
        const method = ast.builtin || ast.name;
        return this.transformExpr(new InvokeMethodExpr(ast.receiver.visitExpression(this, context), /** @type {?} */ ((method)), this.visitAllExpressions(ast.args, context), ast.type, ast.sourceSpan), context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitInvokeFunctionExpr(ast, context) {
        return this.transformExpr(new InvokeFunctionExpr(ast.fn.visitExpression(this, context), this.visitAllExpressions(ast.args, context), ast.type, ast.sourceSpan), context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitInstantiateExpr(ast, context) {
        return this.transformExpr(new InstantiateExpr(ast.classExpr.visitExpression(this, context), this.visitAllExpressions(ast.args, context), ast.type, ast.sourceSpan), context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitLiteralExpr(ast, context) { return this.transformExpr(ast, context); }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitExternalExpr(ast, context) {
        return this.transformExpr(ast, context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitConditionalExpr(ast, context) {
        return this.transformExpr(new ConditionalExpr(ast.condition.visitExpression(this, context), ast.trueCase.visitExpression(this, context), /** @type {?} */ ((ast.falseCase)).visitExpression(this, context), ast.type, ast.sourceSpan), context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitNotExpr(ast, context) {
        return this.transformExpr(new NotExpr(ast.condition.visitExpression(this, context), ast.sourceSpan), context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitAssertNotNullExpr(ast, context) {
        return this.transformExpr(new AssertNotNull(ast.condition.visitExpression(this, context), ast.sourceSpan), context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitCastExpr(ast, context) {
        return this.transformExpr(new CastExpr(ast.value.visitExpression(this, context), ast.type, ast.sourceSpan), context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitFunctionExpr(ast, context) {
        return this.transformExpr(new FunctionExpr(ast.params, this.visitAllStatements(ast.statements, context), ast.type, ast.sourceSpan), context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitBinaryOperatorExpr(ast, context) {
        return this.transformExpr(new BinaryOperatorExpr(ast.operator, ast.lhs.visitExpression(this, context), ast.rhs.visitExpression(this, context), ast.type, ast.sourceSpan), context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitReadPropExpr(ast, context) {
        return this.transformExpr(new ReadPropExpr(ast.receiver.visitExpression(this, context), ast.name, ast.type, ast.sourceSpan), context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitReadKeyExpr(ast, context) {
        return this.transformExpr(new ReadKeyExpr(ast.receiver.visitExpression(this, context), ast.index.visitExpression(this, context), ast.type, ast.sourceSpan), context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitLiteralArrayExpr(ast, context) {
        return this.transformExpr(new LiteralArrayExpr(this.visitAllExpressions(ast.entries, context), ast.type, ast.sourceSpan), context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitLiteralMapExpr(ast, context) {
        /** @type {?} */
        const entries = ast.entries.map((entry) => new LiteralMapEntry(entry.key, entry.value.visitExpression(this, context), entry.quoted));
        /** @type {?} */
        const mapType = new MapType(ast.valueType, null);
        return this.transformExpr(new LiteralMapExpr(entries, mapType, ast.sourceSpan), context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitCommaExpr(ast, context) {
        return this.transformExpr(new CommaExpr(this.visitAllExpressions(ast.parts, context), ast.sourceSpan), context);
    }
    /**
     * @param {?} exprs
     * @param {?} context
     * @return {?}
     */
    visitAllExpressions(exprs, context) {
        return exprs.map(expr => expr.visitExpression(this, context));
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitDeclareVarStmt(stmt, context) {
        /** @type {?} */
        const value = stmt.value && stmt.value.visitExpression(this, context);
        return this.transformStmt(new DeclareVarStmt(stmt.name, value, stmt.type, stmt.modifiers, stmt.sourceSpan), context);
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitDeclareFunctionStmt(stmt, context) {
        return this.transformStmt(new DeclareFunctionStmt(stmt.name, stmt.params, this.visitAllStatements(stmt.statements, context), stmt.type, stmt.modifiers, stmt.sourceSpan), context);
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitExpressionStmt(stmt, context) {
        return this.transformStmt(new ExpressionStatement(stmt.expr.visitExpression(this, context), stmt.sourceSpan), context);
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitReturnStmt(stmt, context) {
        return this.transformStmt(new ReturnStatement(stmt.value.visitExpression(this, context), stmt.sourceSpan), context);
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitDeclareClassStmt(stmt, context) {
        /** @type {?} */
        const parent = /** @type {?} */ ((stmt.parent)).visitExpression(this, context);
        /** @type {?} */
        const getters = stmt.getters.map(getter => new ClassGetter(getter.name, this.visitAllStatements(getter.body, context), getter.type, getter.modifiers));
        /** @type {?} */
        const ctorMethod = stmt.constructorMethod &&
            new ClassMethod(stmt.constructorMethod.name, stmt.constructorMethod.params, this.visitAllStatements(stmt.constructorMethod.body, context), stmt.constructorMethod.type, stmt.constructorMethod.modifiers);
        /** @type {?} */
        const methods = stmt.methods.map(method => new ClassMethod(method.name, method.params, this.visitAllStatements(method.body, context), method.type, method.modifiers));
        return this.transformStmt(new ClassStmt(stmt.name, parent, stmt.fields, getters, ctorMethod, methods, stmt.modifiers, stmt.sourceSpan), context);
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitIfStmt(stmt, context) {
        return this.transformStmt(new IfStmt(stmt.condition.visitExpression(this, context), this.visitAllStatements(stmt.trueCase, context), this.visitAllStatements(stmt.falseCase, context), stmt.sourceSpan), context);
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitTryCatchStmt(stmt, context) {
        return this.transformStmt(new TryCatchStmt(this.visitAllStatements(stmt.bodyStmts, context), this.visitAllStatements(stmt.catchStmts, context), stmt.sourceSpan), context);
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitThrowStmt(stmt, context) {
        return this.transformStmt(new ThrowStmt(stmt.error.visitExpression(this, context), stmt.sourceSpan), context);
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitCommentStmt(stmt, context) {
        return this.transformStmt(stmt, context);
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitJSDocCommentStmt(stmt, context) {
        return this.transformStmt(stmt, context);
    }
    /**
     * @param {?} stmts
     * @param {?} context
     * @return {?}
     */
    visitAllStatements(stmts, context) {
        return stmts.map(stmt => stmt.visitStatement(this, context));
    }
}
export class RecursiveAstVisitor {
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitType(ast, context) { return ast; }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitExpression(ast, context) {
        if (ast.type) {
            ast.type.visitType(this, context);
        }
        return ast;
    }
    /**
     * @param {?} type
     * @param {?} context
     * @return {?}
     */
    visitBuiltinType(type, context) { return this.visitType(type, context); }
    /**
     * @param {?} type
     * @param {?} context
     * @return {?}
     */
    visitExpressionType(type, context) {
        type.value.visitExpression(this, context);
        if (type.typeParams !== null) {
            type.typeParams.forEach(param => this.visitType(param, context));
        }
        return this.visitType(type, context);
    }
    /**
     * @param {?} type
     * @param {?} context
     * @return {?}
     */
    visitArrayType(type, context) { return this.visitType(type, context); }
    /**
     * @param {?} type
     * @param {?} context
     * @return {?}
     */
    visitMapType(type, context) { return this.visitType(type, context); }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitWrappedNodeExpr(ast, context) { return ast; }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitTypeofExpr(ast, context) { return this.visitExpression(ast, context); }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitReadVarExpr(ast, context) {
        return this.visitExpression(ast, context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitWriteVarExpr(ast, context) {
        ast.value.visitExpression(this, context);
        return this.visitExpression(ast, context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitWriteKeyExpr(ast, context) {
        ast.receiver.visitExpression(this, context);
        ast.index.visitExpression(this, context);
        ast.value.visitExpression(this, context);
        return this.visitExpression(ast, context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitWritePropExpr(ast, context) {
        ast.receiver.visitExpression(this, context);
        ast.value.visitExpression(this, context);
        return this.visitExpression(ast, context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitInvokeMethodExpr(ast, context) {
        ast.receiver.visitExpression(this, context);
        this.visitAllExpressions(ast.args, context);
        return this.visitExpression(ast, context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitInvokeFunctionExpr(ast, context) {
        ast.fn.visitExpression(this, context);
        this.visitAllExpressions(ast.args, context);
        return this.visitExpression(ast, context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitInstantiateExpr(ast, context) {
        ast.classExpr.visitExpression(this, context);
        this.visitAllExpressions(ast.args, context);
        return this.visitExpression(ast, context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitLiteralExpr(ast, context) {
        return this.visitExpression(ast, context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitExternalExpr(ast, context) {
        if (ast.typeParams) {
            ast.typeParams.forEach(type => type.visitType(this, context));
        }
        return this.visitExpression(ast, context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitConditionalExpr(ast, context) {
        ast.condition.visitExpression(this, context);
        ast.trueCase.visitExpression(this, context); /** @type {?} */
        ((ast.falseCase)).visitExpression(this, context);
        return this.visitExpression(ast, context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitNotExpr(ast, context) {
        ast.condition.visitExpression(this, context);
        return this.visitExpression(ast, context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitAssertNotNullExpr(ast, context) {
        ast.condition.visitExpression(this, context);
        return this.visitExpression(ast, context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitCastExpr(ast, context) {
        ast.value.visitExpression(this, context);
        return this.visitExpression(ast, context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitFunctionExpr(ast, context) {
        this.visitAllStatements(ast.statements, context);
        return this.visitExpression(ast, context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitBinaryOperatorExpr(ast, context) {
        ast.lhs.visitExpression(this, context);
        ast.rhs.visitExpression(this, context);
        return this.visitExpression(ast, context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitReadPropExpr(ast, context) {
        ast.receiver.visitExpression(this, context);
        return this.visitExpression(ast, context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitReadKeyExpr(ast, context) {
        ast.receiver.visitExpression(this, context);
        ast.index.visitExpression(this, context);
        return this.visitExpression(ast, context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitLiteralArrayExpr(ast, context) {
        this.visitAllExpressions(ast.entries, context);
        return this.visitExpression(ast, context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitLiteralMapExpr(ast, context) {
        ast.entries.forEach((entry) => entry.value.visitExpression(this, context));
        return this.visitExpression(ast, context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitCommaExpr(ast, context) {
        this.visitAllExpressions(ast.parts, context);
        return this.visitExpression(ast, context);
    }
    /**
     * @param {?} exprs
     * @param {?} context
     * @return {?}
     */
    visitAllExpressions(exprs, context) {
        exprs.forEach(expr => expr.visitExpression(this, context));
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitDeclareVarStmt(stmt, context) {
        if (stmt.value) {
            stmt.value.visitExpression(this, context);
        }
        if (stmt.type) {
            stmt.type.visitType(this, context);
        }
        return stmt;
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitDeclareFunctionStmt(stmt, context) {
        this.visitAllStatements(stmt.statements, context);
        if (stmt.type) {
            stmt.type.visitType(this, context);
        }
        return stmt;
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitExpressionStmt(stmt, context) {
        stmt.expr.visitExpression(this, context);
        return stmt;
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitReturnStmt(stmt, context) {
        stmt.value.visitExpression(this, context);
        return stmt;
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitDeclareClassStmt(stmt, context) {
        /** @type {?} */ ((stmt.parent)).visitExpression(this, context);
        stmt.getters.forEach(getter => this.visitAllStatements(getter.body, context));
        if (stmt.constructorMethod) {
            this.visitAllStatements(stmt.constructorMethod.body, context);
        }
        stmt.methods.forEach(method => this.visitAllStatements(method.body, context));
        return stmt;
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitIfStmt(stmt, context) {
        stmt.condition.visitExpression(this, context);
        this.visitAllStatements(stmt.trueCase, context);
        this.visitAllStatements(stmt.falseCase, context);
        return stmt;
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitTryCatchStmt(stmt, context) {
        this.visitAllStatements(stmt.bodyStmts, context);
        this.visitAllStatements(stmt.catchStmts, context);
        return stmt;
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitThrowStmt(stmt, context) {
        stmt.error.visitExpression(this, context);
        return stmt;
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitCommentStmt(stmt, context) { return stmt; }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitJSDocCommentStmt(stmt, context) { return stmt; }
    /**
     * @param {?} stmts
     * @param {?} context
     * @return {?}
     */
    visitAllStatements(stmts, context) {
        stmts.forEach(stmt => stmt.visitStatement(this, context));
    }
}
/**
 * @param {?} stmts
 * @return {?}
 */
export function findReadVarNames(stmts) {
    /** @type {?} */
    const visitor = new _ReadVarVisitor();
    visitor.visitAllStatements(stmts, null);
    return visitor.varNames;
}
class _ReadVarVisitor extends RecursiveAstVisitor {
    constructor() {
        super(...arguments);
        this.varNames = new Set();
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitDeclareFunctionStmt(stmt, context) {
        // Don't descend into nested functions
        return stmt;
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitDeclareClassStmt(stmt, context) {
        // Don't descend into nested classes
        return stmt;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitReadVarExpr(ast, context) {
        if (ast.name) {
            this.varNames.add(ast.name);
        }
        return null;
    }
}
if (false) {
    /** @type {?} */
    _ReadVarVisitor.prototype.varNames;
}
/**
 * @param {?} stmts
 * @return {?}
 */
export function collectExternalReferences(stmts) {
    /** @type {?} */
    const visitor = new _FindExternalReferencesVisitor();
    visitor.visitAllStatements(stmts, null);
    return visitor.externalReferences;
}
class _FindExternalReferencesVisitor extends RecursiveAstVisitor {
    constructor() {
        super(...arguments);
        this.externalReferences = [];
    }
    /**
     * @param {?} e
     * @param {?} context
     * @return {?}
     */
    visitExternalExpr(e, context) {
        this.externalReferences.push(e.value);
        return super.visitExternalExpr(e, context);
    }
}
if (false) {
    /** @type {?} */
    _FindExternalReferencesVisitor.prototype.externalReferences;
}
/**
 * @param {?} stmt
 * @param {?} sourceSpan
 * @return {?}
 */
export function applySourceSpanToStatementIfNeeded(stmt, sourceSpan) {
    if (!sourceSpan) {
        return stmt;
    }
    /** @type {?} */
    const transformer = new _ApplySourceSpanTransformer(sourceSpan);
    return stmt.visitStatement(transformer, null);
}
/**
 * @param {?} expr
 * @param {?} sourceSpan
 * @return {?}
 */
export function applySourceSpanToExpressionIfNeeded(expr, sourceSpan) {
    if (!sourceSpan) {
        return expr;
    }
    /** @type {?} */
    const transformer = new _ApplySourceSpanTransformer(sourceSpan);
    return expr.visitExpression(transformer, null);
}
class _ApplySourceSpanTransformer extends AstTransformer {
    /**
     * @param {?} sourceSpan
     */
    constructor(sourceSpan) {
        super();
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} obj
     * @return {?}
     */
    _clone(obj) {
        /** @type {?} */
        const clone = Object.create(obj.constructor.prototype);
        for (let prop in obj) {
            clone[prop] = obj[prop];
        }
        return clone;
    }
    /**
     * @param {?} expr
     * @param {?} context
     * @return {?}
     */
    transformExpr(expr, context) {
        if (!expr.sourceSpan) {
            expr = this._clone(expr);
            expr.sourceSpan = this.sourceSpan;
        }
        return expr;
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    transformStmt(stmt, context) {
        if (!stmt.sourceSpan) {
            stmt = this._clone(stmt);
            stmt.sourceSpan = this.sourceSpan;
        }
        return stmt;
    }
}
if (false) {
    /** @type {?} */
    _ApplySourceSpanTransformer.prototype.sourceSpan;
}
/**
 * @param {?} name
 * @param {?=} type
 * @param {?=} sourceSpan
 * @return {?}
 */
export function variable(name, type, sourceSpan) {
    return new ReadVarExpr(name, type, sourceSpan);
}
/**
 * @param {?} id
 * @param {?=} typeParams
 * @param {?=} sourceSpan
 * @return {?}
 */
export function importExpr(id, typeParams = null, sourceSpan) {
    return new ExternalExpr(id, null, typeParams, sourceSpan);
}
/**
 * @param {?} id
 * @param {?=} typeParams
 * @param {?=} typeModifiers
 * @return {?}
 */
export function importType(id, typeParams = null, typeModifiers = null) {
    return id != null ? expressionType(importExpr(id, typeParams, null), typeModifiers) : null;
}
/**
 * @param {?} expr
 * @param {?=} typeModifiers
 * @param {?=} typeParams
 * @return {?}
 */
export function expressionType(expr, typeModifiers = null, typeParams = null) {
    return new ExpressionType(expr, typeModifiers, typeParams);
}
/**
 * @param {?} expr
 * @return {?}
 */
export function typeofExpr(expr) {
    return new TypeofExpr(expr);
}
/**
 * @param {?} values
 * @param {?=} type
 * @param {?=} sourceSpan
 * @return {?}
 */
export function literalArr(values, type, sourceSpan) {
    return new LiteralArrayExpr(values, type, sourceSpan);
}
/**
 * @param {?} values
 * @param {?=} type
 * @return {?}
 */
export function literalMap(values, type = null) {
    return new LiteralMapExpr(values.map(e => new LiteralMapEntry(e.key, e.value, e.quoted)), type, null);
}
/**
 * @param {?} expr
 * @param {?=} sourceSpan
 * @return {?}
 */
export function not(expr, sourceSpan) {
    return new NotExpr(expr, sourceSpan);
}
/**
 * @param {?} expr
 * @param {?=} sourceSpan
 * @return {?}
 */
export function assertNotNull(expr, sourceSpan) {
    return new AssertNotNull(expr, sourceSpan);
}
/**
 * @param {?} params
 * @param {?} body
 * @param {?=} type
 * @param {?=} sourceSpan
 * @param {?=} name
 * @return {?}
 */
export function fn(params, body, type, sourceSpan, name) {
    return new FunctionExpr(params, body, type, sourceSpan, name);
}
/**
 * @param {?} condition
 * @param {?} thenClause
 * @param {?=} elseClause
 * @return {?}
 */
export function ifStmt(condition, thenClause, elseClause) {
    return new IfStmt(condition, thenClause, elseClause);
}
/**
 * @param {?} value
 * @param {?=} type
 * @param {?=} sourceSpan
 * @return {?}
 */
export function literal(value, type, sourceSpan) {
    return new LiteralExpr(value, type, sourceSpan);
}
/**
 * @param {?} exp
 * @return {?}
 */
export function isNull(exp) {
    return exp instanceof LiteralExpr && exp.value === null;
}
/** @enum {string} */
const JSDocTagName = {
    Desc: 'desc',
    Id: 'id',
    Meaning: 'meaning',
};
export { JSDocTagName };
/** @typedef {?} */
var JSDocTag;
export { JSDocTag };
/**
 * @param {?} tag
 * @return {?}
 */
function tagToString(tag) {
    /** @type {?} */
    let out = '';
    if (tag.tagName) {
        out += ` @${tag.tagName}`;
    }
    if (tag.text) {
        if (tag.text.match(/\/\*|\*\//)) {
            throw new Error('JSDoc text cannot contain "/*" and "*/"');
        }
        out += ' ' + tag.text.replace(/@/g, '\\@');
    }
    return out;
}
/**
 * @param {?} tags
 * @return {?}
 */
function serializeTags(tags) {
    if (tags.length === 0)
        return '';
    /** @type {?} */
    let out = '*\n';
    for (const tag of tags) {
        out += ' *';
        // If the tagToString is multi-line, insert " * " prefixes on subsequent lines.
        out += tagToString(tag).replace(/\n/g, '\n * ');
        out += '\n';
    }
    out += ' ';
    return out;
}
//# sourceMappingURL=output_ast.js.map