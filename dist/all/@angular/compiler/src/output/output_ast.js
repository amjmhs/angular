"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
//// Types
var TypeModifier;
(function (TypeModifier) {
    TypeModifier[TypeModifier["Const"] = 0] = "Const";
})(TypeModifier = exports.TypeModifier || (exports.TypeModifier = {}));
var Type = /** @class */ (function () {
    function Type(modifiers) {
        if (modifiers === void 0) { modifiers = null; }
        this.modifiers = modifiers;
        if (!modifiers) {
            this.modifiers = [];
        }
    }
    Type.prototype.hasModifier = function (modifier) { return this.modifiers.indexOf(modifier) !== -1; };
    return Type;
}());
exports.Type = Type;
var BuiltinTypeName;
(function (BuiltinTypeName) {
    BuiltinTypeName[BuiltinTypeName["Dynamic"] = 0] = "Dynamic";
    BuiltinTypeName[BuiltinTypeName["Bool"] = 1] = "Bool";
    BuiltinTypeName[BuiltinTypeName["String"] = 2] = "String";
    BuiltinTypeName[BuiltinTypeName["Int"] = 3] = "Int";
    BuiltinTypeName[BuiltinTypeName["Number"] = 4] = "Number";
    BuiltinTypeName[BuiltinTypeName["Function"] = 5] = "Function";
    BuiltinTypeName[BuiltinTypeName["Inferred"] = 6] = "Inferred";
    BuiltinTypeName[BuiltinTypeName["None"] = 7] = "None";
})(BuiltinTypeName = exports.BuiltinTypeName || (exports.BuiltinTypeName = {}));
var BuiltinType = /** @class */ (function (_super) {
    __extends(BuiltinType, _super);
    function BuiltinType(name, modifiers) {
        if (modifiers === void 0) { modifiers = null; }
        var _this = _super.call(this, modifiers) || this;
        _this.name = name;
        return _this;
    }
    BuiltinType.prototype.visitType = function (visitor, context) {
        return visitor.visitBuiltinType(this, context);
    };
    return BuiltinType;
}(Type));
exports.BuiltinType = BuiltinType;
var ExpressionType = /** @class */ (function (_super) {
    __extends(ExpressionType, _super);
    function ExpressionType(value, modifiers, typeParams) {
        if (modifiers === void 0) { modifiers = null; }
        if (typeParams === void 0) { typeParams = null; }
        var _this = _super.call(this, modifiers) || this;
        _this.value = value;
        _this.typeParams = typeParams;
        return _this;
    }
    ExpressionType.prototype.visitType = function (visitor, context) {
        return visitor.visitExpressionType(this, context);
    };
    return ExpressionType;
}(Type));
exports.ExpressionType = ExpressionType;
var ArrayType = /** @class */ (function (_super) {
    __extends(ArrayType, _super);
    function ArrayType(of, modifiers) {
        if (modifiers === void 0) { modifiers = null; }
        var _this = _super.call(this, modifiers) || this;
        _this.of = of;
        return _this;
    }
    ArrayType.prototype.visitType = function (visitor, context) {
        return visitor.visitArrayType(this, context);
    };
    return ArrayType;
}(Type));
exports.ArrayType = ArrayType;
var MapType = /** @class */ (function (_super) {
    __extends(MapType, _super);
    function MapType(valueType, modifiers) {
        if (modifiers === void 0) { modifiers = null; }
        var _this = _super.call(this, modifiers) || this;
        _this.valueType = valueType || null;
        return _this;
    }
    MapType.prototype.visitType = function (visitor, context) { return visitor.visitMapType(this, context); };
    return MapType;
}(Type));
exports.MapType = MapType;
exports.DYNAMIC_TYPE = new BuiltinType(BuiltinTypeName.Dynamic);
exports.INFERRED_TYPE = new BuiltinType(BuiltinTypeName.Inferred);
exports.BOOL_TYPE = new BuiltinType(BuiltinTypeName.Bool);
exports.INT_TYPE = new BuiltinType(BuiltinTypeName.Int);
exports.NUMBER_TYPE = new BuiltinType(BuiltinTypeName.Number);
exports.STRING_TYPE = new BuiltinType(BuiltinTypeName.String);
exports.FUNCTION_TYPE = new BuiltinType(BuiltinTypeName.Function);
exports.NONE_TYPE = new BuiltinType(BuiltinTypeName.None);
///// Expressions
var BinaryOperator;
(function (BinaryOperator) {
    BinaryOperator[BinaryOperator["Equals"] = 0] = "Equals";
    BinaryOperator[BinaryOperator["NotEquals"] = 1] = "NotEquals";
    BinaryOperator[BinaryOperator["Identical"] = 2] = "Identical";
    BinaryOperator[BinaryOperator["NotIdentical"] = 3] = "NotIdentical";
    BinaryOperator[BinaryOperator["Minus"] = 4] = "Minus";
    BinaryOperator[BinaryOperator["Plus"] = 5] = "Plus";
    BinaryOperator[BinaryOperator["Divide"] = 6] = "Divide";
    BinaryOperator[BinaryOperator["Multiply"] = 7] = "Multiply";
    BinaryOperator[BinaryOperator["Modulo"] = 8] = "Modulo";
    BinaryOperator[BinaryOperator["And"] = 9] = "And";
    BinaryOperator[BinaryOperator["Or"] = 10] = "Or";
    BinaryOperator[BinaryOperator["BitwiseAnd"] = 11] = "BitwiseAnd";
    BinaryOperator[BinaryOperator["Lower"] = 12] = "Lower";
    BinaryOperator[BinaryOperator["LowerEquals"] = 13] = "LowerEquals";
    BinaryOperator[BinaryOperator["Bigger"] = 14] = "Bigger";
    BinaryOperator[BinaryOperator["BiggerEquals"] = 15] = "BiggerEquals";
})(BinaryOperator = exports.BinaryOperator || (exports.BinaryOperator = {}));
function nullSafeIsEquivalent(base, other) {
    if (base == null || other == null) {
        return base == other;
    }
    return base.isEquivalent(other);
}
exports.nullSafeIsEquivalent = nullSafeIsEquivalent;
function areAllEquivalent(base, other) {
    var len = base.length;
    if (len !== other.length) {
        return false;
    }
    for (var i = 0; i < len; i++) {
        if (!base[i].isEquivalent(other[i])) {
            return false;
        }
    }
    return true;
}
exports.areAllEquivalent = areAllEquivalent;
var Expression = /** @class */ (function () {
    function Expression(type, sourceSpan) {
        this.type = type || null;
        this.sourceSpan = sourceSpan || null;
    }
    Expression.prototype.prop = function (name, sourceSpan) {
        return new ReadPropExpr(this, name, null, sourceSpan);
    };
    Expression.prototype.key = function (index, type, sourceSpan) {
        return new ReadKeyExpr(this, index, type, sourceSpan);
    };
    Expression.prototype.callMethod = function (name, params, sourceSpan) {
        return new InvokeMethodExpr(this, name, params, null, sourceSpan);
    };
    Expression.prototype.callFn = function (params, sourceSpan) {
        return new InvokeFunctionExpr(this, params, null, sourceSpan);
    };
    Expression.prototype.instantiate = function (params, type, sourceSpan) {
        return new InstantiateExpr(this, params, type, sourceSpan);
    };
    Expression.prototype.conditional = function (trueCase, falseCase, sourceSpan) {
        if (falseCase === void 0) { falseCase = null; }
        return new ConditionalExpr(this, trueCase, falseCase, null, sourceSpan);
    };
    Expression.prototype.equals = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Equals, this, rhs, null, sourceSpan);
    };
    Expression.prototype.notEquals = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.NotEquals, this, rhs, null, sourceSpan);
    };
    Expression.prototype.identical = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Identical, this, rhs, null, sourceSpan);
    };
    Expression.prototype.notIdentical = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.NotIdentical, this, rhs, null, sourceSpan);
    };
    Expression.prototype.minus = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Minus, this, rhs, null, sourceSpan);
    };
    Expression.prototype.plus = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Plus, this, rhs, null, sourceSpan);
    };
    Expression.prototype.divide = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Divide, this, rhs, null, sourceSpan);
    };
    Expression.prototype.multiply = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Multiply, this, rhs, null, sourceSpan);
    };
    Expression.prototype.modulo = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Modulo, this, rhs, null, sourceSpan);
    };
    Expression.prototype.and = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.And, this, rhs, null, sourceSpan);
    };
    Expression.prototype.bitwiseAnd = function (rhs, sourceSpan, parens) {
        if (parens === void 0) { parens = true; }
        return new BinaryOperatorExpr(BinaryOperator.BitwiseAnd, this, rhs, null, sourceSpan, parens);
    };
    Expression.prototype.or = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Or, this, rhs, null, sourceSpan);
    };
    Expression.prototype.lower = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Lower, this, rhs, null, sourceSpan);
    };
    Expression.prototype.lowerEquals = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.LowerEquals, this, rhs, null, sourceSpan);
    };
    Expression.prototype.bigger = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Bigger, this, rhs, null, sourceSpan);
    };
    Expression.prototype.biggerEquals = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.BiggerEquals, this, rhs, null, sourceSpan);
    };
    Expression.prototype.isBlank = function (sourceSpan) {
        // Note: We use equals by purpose here to compare to null and undefined in JS.
        // We use the typed null to allow strictNullChecks to narrow types.
        return this.equals(exports.TYPED_NULL_EXPR, sourceSpan);
    };
    Expression.prototype.cast = function (type, sourceSpan) {
        return new CastExpr(this, type, sourceSpan);
    };
    Expression.prototype.toStmt = function () { return new ExpressionStatement(this, null); };
    return Expression;
}());
exports.Expression = Expression;
var BuiltinVar;
(function (BuiltinVar) {
    BuiltinVar[BuiltinVar["This"] = 0] = "This";
    BuiltinVar[BuiltinVar["Super"] = 1] = "Super";
    BuiltinVar[BuiltinVar["CatchError"] = 2] = "CatchError";
    BuiltinVar[BuiltinVar["CatchStack"] = 3] = "CatchStack";
})(BuiltinVar = exports.BuiltinVar || (exports.BuiltinVar = {}));
var ReadVarExpr = /** @class */ (function (_super) {
    __extends(ReadVarExpr, _super);
    function ReadVarExpr(name, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        if (typeof name === 'string') {
            _this.name = name;
            _this.builtin = null;
        }
        else {
            _this.name = null;
            _this.builtin = name;
        }
        return _this;
    }
    ReadVarExpr.prototype.isEquivalent = function (e) {
        return e instanceof ReadVarExpr && this.name === e.name && this.builtin === e.builtin;
    };
    ReadVarExpr.prototype.isConstant = function () { return false; };
    ReadVarExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitReadVarExpr(this, context);
    };
    ReadVarExpr.prototype.set = function (value) {
        if (!this.name) {
            throw new Error("Built in variable " + this.builtin + " can not be assigned to.");
        }
        return new WriteVarExpr(this.name, value, null, this.sourceSpan);
    };
    return ReadVarExpr;
}(Expression));
exports.ReadVarExpr = ReadVarExpr;
var TypeofExpr = /** @class */ (function (_super) {
    __extends(TypeofExpr, _super);
    function TypeofExpr(expr, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.expr = expr;
        return _this;
    }
    TypeofExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitTypeofExpr(this, context);
    };
    TypeofExpr.prototype.isEquivalent = function (e) {
        return e instanceof TypeofExpr && e.expr.isEquivalent(this.expr);
    };
    TypeofExpr.prototype.isConstant = function () { return this.expr.isConstant(); };
    return TypeofExpr;
}(Expression));
exports.TypeofExpr = TypeofExpr;
var WrappedNodeExpr = /** @class */ (function (_super) {
    __extends(WrappedNodeExpr, _super);
    function WrappedNodeExpr(node, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.node = node;
        return _this;
    }
    WrappedNodeExpr.prototype.isEquivalent = function (e) {
        return e instanceof WrappedNodeExpr && this.node === e.node;
    };
    WrappedNodeExpr.prototype.isConstant = function () { return false; };
    WrappedNodeExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitWrappedNodeExpr(this, context);
    };
    return WrappedNodeExpr;
}(Expression));
exports.WrappedNodeExpr = WrappedNodeExpr;
var WriteVarExpr = /** @class */ (function (_super) {
    __extends(WriteVarExpr, _super);
    function WriteVarExpr(name, value, type, sourceSpan) {
        var _this = _super.call(this, type || value.type, sourceSpan) || this;
        _this.name = name;
        _this.value = value;
        return _this;
    }
    WriteVarExpr.prototype.isEquivalent = function (e) {
        return e instanceof WriteVarExpr && this.name === e.name && this.value.isEquivalent(e.value);
    };
    WriteVarExpr.prototype.isConstant = function () { return false; };
    WriteVarExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitWriteVarExpr(this, context);
    };
    WriteVarExpr.prototype.toDeclStmt = function (type, modifiers) {
        return new DeclareVarStmt(this.name, this.value, type, modifiers, this.sourceSpan);
    };
    return WriteVarExpr;
}(Expression));
exports.WriteVarExpr = WriteVarExpr;
var WriteKeyExpr = /** @class */ (function (_super) {
    __extends(WriteKeyExpr, _super);
    function WriteKeyExpr(receiver, index, value, type, sourceSpan) {
        var _this = _super.call(this, type || value.type, sourceSpan) || this;
        _this.receiver = receiver;
        _this.index = index;
        _this.value = value;
        return _this;
    }
    WriteKeyExpr.prototype.isEquivalent = function (e) {
        return e instanceof WriteKeyExpr && this.receiver.isEquivalent(e.receiver) &&
            this.index.isEquivalent(e.index) && this.value.isEquivalent(e.value);
    };
    WriteKeyExpr.prototype.isConstant = function () { return false; };
    WriteKeyExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitWriteKeyExpr(this, context);
    };
    return WriteKeyExpr;
}(Expression));
exports.WriteKeyExpr = WriteKeyExpr;
var WritePropExpr = /** @class */ (function (_super) {
    __extends(WritePropExpr, _super);
    function WritePropExpr(receiver, name, value, type, sourceSpan) {
        var _this = _super.call(this, type || value.type, sourceSpan) || this;
        _this.receiver = receiver;
        _this.name = name;
        _this.value = value;
        return _this;
    }
    WritePropExpr.prototype.isEquivalent = function (e) {
        return e instanceof WritePropExpr && this.receiver.isEquivalent(e.receiver) &&
            this.name === e.name && this.value.isEquivalent(e.value);
    };
    WritePropExpr.prototype.isConstant = function () { return false; };
    WritePropExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitWritePropExpr(this, context);
    };
    return WritePropExpr;
}(Expression));
exports.WritePropExpr = WritePropExpr;
var BuiltinMethod;
(function (BuiltinMethod) {
    BuiltinMethod[BuiltinMethod["ConcatArray"] = 0] = "ConcatArray";
    BuiltinMethod[BuiltinMethod["SubscribeObservable"] = 1] = "SubscribeObservable";
    BuiltinMethod[BuiltinMethod["Bind"] = 2] = "Bind";
})(BuiltinMethod = exports.BuiltinMethod || (exports.BuiltinMethod = {}));
var InvokeMethodExpr = /** @class */ (function (_super) {
    __extends(InvokeMethodExpr, _super);
    function InvokeMethodExpr(receiver, method, args, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.receiver = receiver;
        _this.args = args;
        if (typeof method === 'string') {
            _this.name = method;
            _this.builtin = null;
        }
        else {
            _this.name = null;
            _this.builtin = method;
        }
        return _this;
    }
    InvokeMethodExpr.prototype.isEquivalent = function (e) {
        return e instanceof InvokeMethodExpr && this.receiver.isEquivalent(e.receiver) &&
            this.name === e.name && this.builtin === e.builtin && areAllEquivalent(this.args, e.args);
    };
    InvokeMethodExpr.prototype.isConstant = function () { return false; };
    InvokeMethodExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitInvokeMethodExpr(this, context);
    };
    return InvokeMethodExpr;
}(Expression));
exports.InvokeMethodExpr = InvokeMethodExpr;
var InvokeFunctionExpr = /** @class */ (function (_super) {
    __extends(InvokeFunctionExpr, _super);
    function InvokeFunctionExpr(fn, args, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.fn = fn;
        _this.args = args;
        return _this;
    }
    InvokeFunctionExpr.prototype.isEquivalent = function (e) {
        return e instanceof InvokeFunctionExpr && this.fn.isEquivalent(e.fn) &&
            areAllEquivalent(this.args, e.args);
    };
    InvokeFunctionExpr.prototype.isConstant = function () { return false; };
    InvokeFunctionExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitInvokeFunctionExpr(this, context);
    };
    return InvokeFunctionExpr;
}(Expression));
exports.InvokeFunctionExpr = InvokeFunctionExpr;
var InstantiateExpr = /** @class */ (function (_super) {
    __extends(InstantiateExpr, _super);
    function InstantiateExpr(classExpr, args, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.classExpr = classExpr;
        _this.args = args;
        return _this;
    }
    InstantiateExpr.prototype.isEquivalent = function (e) {
        return e instanceof InstantiateExpr && this.classExpr.isEquivalent(e.classExpr) &&
            areAllEquivalent(this.args, e.args);
    };
    InstantiateExpr.prototype.isConstant = function () { return false; };
    InstantiateExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitInstantiateExpr(this, context);
    };
    return InstantiateExpr;
}(Expression));
exports.InstantiateExpr = InstantiateExpr;
var LiteralExpr = /** @class */ (function (_super) {
    __extends(LiteralExpr, _super);
    function LiteralExpr(value, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.value = value;
        return _this;
    }
    LiteralExpr.prototype.isEquivalent = function (e) {
        return e instanceof LiteralExpr && this.value === e.value;
    };
    LiteralExpr.prototype.isConstant = function () { return true; };
    LiteralExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitLiteralExpr(this, context);
    };
    return LiteralExpr;
}(Expression));
exports.LiteralExpr = LiteralExpr;
var ExternalExpr = /** @class */ (function (_super) {
    __extends(ExternalExpr, _super);
    function ExternalExpr(value, type, typeParams, sourceSpan) {
        if (typeParams === void 0) { typeParams = null; }
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.value = value;
        _this.typeParams = typeParams;
        return _this;
    }
    ExternalExpr.prototype.isEquivalent = function (e) {
        return e instanceof ExternalExpr && this.value.name === e.value.name &&
            this.value.moduleName === e.value.moduleName && this.value.runtime === e.value.runtime;
    };
    ExternalExpr.prototype.isConstant = function () { return false; };
    ExternalExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitExternalExpr(this, context);
    };
    return ExternalExpr;
}(Expression));
exports.ExternalExpr = ExternalExpr;
var ExternalReference = /** @class */ (function () {
    function ExternalReference(moduleName, name, runtime) {
        this.moduleName = moduleName;
        this.name = name;
        this.runtime = runtime;
    }
    return ExternalReference;
}());
exports.ExternalReference = ExternalReference;
var ConditionalExpr = /** @class */ (function (_super) {
    __extends(ConditionalExpr, _super);
    function ConditionalExpr(condition, trueCase, falseCase, type, sourceSpan) {
        if (falseCase === void 0) { falseCase = null; }
        var _this = _super.call(this, type || trueCase.type, sourceSpan) || this;
        _this.condition = condition;
        _this.falseCase = falseCase;
        _this.trueCase = trueCase;
        return _this;
    }
    ConditionalExpr.prototype.isEquivalent = function (e) {
        return e instanceof ConditionalExpr && this.condition.isEquivalent(e.condition) &&
            this.trueCase.isEquivalent(e.trueCase) && nullSafeIsEquivalent(this.falseCase, e.falseCase);
    };
    ConditionalExpr.prototype.isConstant = function () { return false; };
    ConditionalExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitConditionalExpr(this, context);
    };
    return ConditionalExpr;
}(Expression));
exports.ConditionalExpr = ConditionalExpr;
var NotExpr = /** @class */ (function (_super) {
    __extends(NotExpr, _super);
    function NotExpr(condition, sourceSpan) {
        var _this = _super.call(this, exports.BOOL_TYPE, sourceSpan) || this;
        _this.condition = condition;
        return _this;
    }
    NotExpr.prototype.isEquivalent = function (e) {
        return e instanceof NotExpr && this.condition.isEquivalent(e.condition);
    };
    NotExpr.prototype.isConstant = function () { return false; };
    NotExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitNotExpr(this, context);
    };
    return NotExpr;
}(Expression));
exports.NotExpr = NotExpr;
var AssertNotNull = /** @class */ (function (_super) {
    __extends(AssertNotNull, _super);
    function AssertNotNull(condition, sourceSpan) {
        var _this = _super.call(this, condition.type, sourceSpan) || this;
        _this.condition = condition;
        return _this;
    }
    AssertNotNull.prototype.isEquivalent = function (e) {
        return e instanceof AssertNotNull && this.condition.isEquivalent(e.condition);
    };
    AssertNotNull.prototype.isConstant = function () { return false; };
    AssertNotNull.prototype.visitExpression = function (visitor, context) {
        return visitor.visitAssertNotNullExpr(this, context);
    };
    return AssertNotNull;
}(Expression));
exports.AssertNotNull = AssertNotNull;
var CastExpr = /** @class */ (function (_super) {
    __extends(CastExpr, _super);
    function CastExpr(value, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.value = value;
        return _this;
    }
    CastExpr.prototype.isEquivalent = function (e) {
        return e instanceof CastExpr && this.value.isEquivalent(e.value);
    };
    CastExpr.prototype.isConstant = function () { return false; };
    CastExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitCastExpr(this, context);
    };
    return CastExpr;
}(Expression));
exports.CastExpr = CastExpr;
var FnParam = /** @class */ (function () {
    function FnParam(name, type) {
        if (type === void 0) { type = null; }
        this.name = name;
        this.type = type;
    }
    FnParam.prototype.isEquivalent = function (param) { return this.name === param.name; };
    return FnParam;
}());
exports.FnParam = FnParam;
var FunctionExpr = /** @class */ (function (_super) {
    __extends(FunctionExpr, _super);
    function FunctionExpr(params, statements, type, sourceSpan, name) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.params = params;
        _this.statements = statements;
        _this.name = name;
        return _this;
    }
    FunctionExpr.prototype.isEquivalent = function (e) {
        return e instanceof FunctionExpr && areAllEquivalent(this.params, e.params) &&
            areAllEquivalent(this.statements, e.statements);
    };
    FunctionExpr.prototype.isConstant = function () { return false; };
    FunctionExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitFunctionExpr(this, context);
    };
    FunctionExpr.prototype.toDeclStmt = function (name, modifiers) {
        if (modifiers === void 0) { modifiers = null; }
        return new DeclareFunctionStmt(name, this.params, this.statements, this.type, modifiers, this.sourceSpan);
    };
    return FunctionExpr;
}(Expression));
exports.FunctionExpr = FunctionExpr;
var BinaryOperatorExpr = /** @class */ (function (_super) {
    __extends(BinaryOperatorExpr, _super);
    function BinaryOperatorExpr(operator, lhs, rhs, type, sourceSpan, parens) {
        if (parens === void 0) { parens = true; }
        var _this = _super.call(this, type || lhs.type, sourceSpan) || this;
        _this.operator = operator;
        _this.rhs = rhs;
        _this.parens = parens;
        _this.lhs = lhs;
        return _this;
    }
    BinaryOperatorExpr.prototype.isEquivalent = function (e) {
        return e instanceof BinaryOperatorExpr && this.operator === e.operator &&
            this.lhs.isEquivalent(e.lhs) && this.rhs.isEquivalent(e.rhs);
    };
    BinaryOperatorExpr.prototype.isConstant = function () { return false; };
    BinaryOperatorExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitBinaryOperatorExpr(this, context);
    };
    return BinaryOperatorExpr;
}(Expression));
exports.BinaryOperatorExpr = BinaryOperatorExpr;
var ReadPropExpr = /** @class */ (function (_super) {
    __extends(ReadPropExpr, _super);
    function ReadPropExpr(receiver, name, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.receiver = receiver;
        _this.name = name;
        return _this;
    }
    ReadPropExpr.prototype.isEquivalent = function (e) {
        return e instanceof ReadPropExpr && this.receiver.isEquivalent(e.receiver) &&
            this.name === e.name;
    };
    ReadPropExpr.prototype.isConstant = function () { return false; };
    ReadPropExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitReadPropExpr(this, context);
    };
    ReadPropExpr.prototype.set = function (value) {
        return new WritePropExpr(this.receiver, this.name, value, null, this.sourceSpan);
    };
    return ReadPropExpr;
}(Expression));
exports.ReadPropExpr = ReadPropExpr;
var ReadKeyExpr = /** @class */ (function (_super) {
    __extends(ReadKeyExpr, _super);
    function ReadKeyExpr(receiver, index, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.receiver = receiver;
        _this.index = index;
        return _this;
    }
    ReadKeyExpr.prototype.isEquivalent = function (e) {
        return e instanceof ReadKeyExpr && this.receiver.isEquivalent(e.receiver) &&
            this.index.isEquivalent(e.index);
    };
    ReadKeyExpr.prototype.isConstant = function () { return false; };
    ReadKeyExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitReadKeyExpr(this, context);
    };
    ReadKeyExpr.prototype.set = function (value) {
        return new WriteKeyExpr(this.receiver, this.index, value, null, this.sourceSpan);
    };
    return ReadKeyExpr;
}(Expression));
exports.ReadKeyExpr = ReadKeyExpr;
var LiteralArrayExpr = /** @class */ (function (_super) {
    __extends(LiteralArrayExpr, _super);
    function LiteralArrayExpr(entries, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.entries = entries;
        return _this;
    }
    LiteralArrayExpr.prototype.isConstant = function () { return this.entries.every(function (e) { return e.isConstant(); }); };
    LiteralArrayExpr.prototype.isEquivalent = function (e) {
        return e instanceof LiteralArrayExpr && areAllEquivalent(this.entries, e.entries);
    };
    LiteralArrayExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitLiteralArrayExpr(this, context);
    };
    return LiteralArrayExpr;
}(Expression));
exports.LiteralArrayExpr = LiteralArrayExpr;
var LiteralMapEntry = /** @class */ (function () {
    function LiteralMapEntry(key, value, quoted) {
        this.key = key;
        this.value = value;
        this.quoted = quoted;
    }
    LiteralMapEntry.prototype.isEquivalent = function (e) {
        return this.key === e.key && this.value.isEquivalent(e.value);
    };
    return LiteralMapEntry;
}());
exports.LiteralMapEntry = LiteralMapEntry;
var LiteralMapExpr = /** @class */ (function (_super) {
    __extends(LiteralMapExpr, _super);
    function LiteralMapExpr(entries, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.entries = entries;
        _this.valueType = null;
        if (type) {
            _this.valueType = type.valueType;
        }
        return _this;
    }
    LiteralMapExpr.prototype.isEquivalent = function (e) {
        return e instanceof LiteralMapExpr && areAllEquivalent(this.entries, e.entries);
    };
    LiteralMapExpr.prototype.isConstant = function () { return this.entries.every(function (e) { return e.value.isConstant(); }); };
    LiteralMapExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitLiteralMapExpr(this, context);
    };
    return LiteralMapExpr;
}(Expression));
exports.LiteralMapExpr = LiteralMapExpr;
var CommaExpr = /** @class */ (function (_super) {
    __extends(CommaExpr, _super);
    function CommaExpr(parts, sourceSpan) {
        var _this = _super.call(this, parts[parts.length - 1].type, sourceSpan) || this;
        _this.parts = parts;
        return _this;
    }
    CommaExpr.prototype.isEquivalent = function (e) {
        return e instanceof CommaExpr && areAllEquivalent(this.parts, e.parts);
    };
    CommaExpr.prototype.isConstant = function () { return false; };
    CommaExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitCommaExpr(this, context);
    };
    return CommaExpr;
}(Expression));
exports.CommaExpr = CommaExpr;
exports.THIS_EXPR = new ReadVarExpr(BuiltinVar.This, null, null);
exports.SUPER_EXPR = new ReadVarExpr(BuiltinVar.Super, null, null);
exports.CATCH_ERROR_VAR = new ReadVarExpr(BuiltinVar.CatchError, null, null);
exports.CATCH_STACK_VAR = new ReadVarExpr(BuiltinVar.CatchStack, null, null);
exports.NULL_EXPR = new LiteralExpr(null, null, null);
exports.TYPED_NULL_EXPR = new LiteralExpr(null, exports.INFERRED_TYPE, null);
//// Statements
var StmtModifier;
(function (StmtModifier) {
    StmtModifier[StmtModifier["Final"] = 0] = "Final";
    StmtModifier[StmtModifier["Private"] = 1] = "Private";
    StmtModifier[StmtModifier["Exported"] = 2] = "Exported";
    StmtModifier[StmtModifier["Static"] = 3] = "Static";
})(StmtModifier = exports.StmtModifier || (exports.StmtModifier = {}));
var Statement = /** @class */ (function () {
    function Statement(modifiers, sourceSpan) {
        this.modifiers = modifiers || [];
        this.sourceSpan = sourceSpan || null;
    }
    Statement.prototype.hasModifier = function (modifier) { return this.modifiers.indexOf(modifier) !== -1; };
    return Statement;
}());
exports.Statement = Statement;
var DeclareVarStmt = /** @class */ (function (_super) {
    __extends(DeclareVarStmt, _super);
    function DeclareVarStmt(name, value, type, modifiers, sourceSpan) {
        if (modifiers === void 0) { modifiers = null; }
        var _this = _super.call(this, modifiers, sourceSpan) || this;
        _this.name = name;
        _this.value = value;
        _this.type = type || (value && value.type) || null;
        return _this;
    }
    DeclareVarStmt.prototype.isEquivalent = function (stmt) {
        return stmt instanceof DeclareVarStmt && this.name === stmt.name &&
            (this.value ? !!stmt.value && this.value.isEquivalent(stmt.value) : !stmt.value);
    };
    DeclareVarStmt.prototype.visitStatement = function (visitor, context) {
        return visitor.visitDeclareVarStmt(this, context);
    };
    return DeclareVarStmt;
}(Statement));
exports.DeclareVarStmt = DeclareVarStmt;
var DeclareFunctionStmt = /** @class */ (function (_super) {
    __extends(DeclareFunctionStmt, _super);
    function DeclareFunctionStmt(name, params, statements, type, modifiers, sourceSpan) {
        if (modifiers === void 0) { modifiers = null; }
        var _this = _super.call(this, modifiers, sourceSpan) || this;
        _this.name = name;
        _this.params = params;
        _this.statements = statements;
        _this.type = type || null;
        return _this;
    }
    DeclareFunctionStmt.prototype.isEquivalent = function (stmt) {
        return stmt instanceof DeclareFunctionStmt && areAllEquivalent(this.params, stmt.params) &&
            areAllEquivalent(this.statements, stmt.statements);
    };
    DeclareFunctionStmt.prototype.visitStatement = function (visitor, context) {
        return visitor.visitDeclareFunctionStmt(this, context);
    };
    return DeclareFunctionStmt;
}(Statement));
exports.DeclareFunctionStmt = DeclareFunctionStmt;
var ExpressionStatement = /** @class */ (function (_super) {
    __extends(ExpressionStatement, _super);
    function ExpressionStatement(expr, sourceSpan) {
        var _this = _super.call(this, null, sourceSpan) || this;
        _this.expr = expr;
        return _this;
    }
    ExpressionStatement.prototype.isEquivalent = function (stmt) {
        return stmt instanceof ExpressionStatement && this.expr.isEquivalent(stmt.expr);
    };
    ExpressionStatement.prototype.visitStatement = function (visitor, context) {
        return visitor.visitExpressionStmt(this, context);
    };
    return ExpressionStatement;
}(Statement));
exports.ExpressionStatement = ExpressionStatement;
var ReturnStatement = /** @class */ (function (_super) {
    __extends(ReturnStatement, _super);
    function ReturnStatement(value, sourceSpan) {
        var _this = _super.call(this, null, sourceSpan) || this;
        _this.value = value;
        return _this;
    }
    ReturnStatement.prototype.isEquivalent = function (stmt) {
        return stmt instanceof ReturnStatement && this.value.isEquivalent(stmt.value);
    };
    ReturnStatement.prototype.visitStatement = function (visitor, context) {
        return visitor.visitReturnStmt(this, context);
    };
    return ReturnStatement;
}(Statement));
exports.ReturnStatement = ReturnStatement;
var AbstractClassPart = /** @class */ (function () {
    function AbstractClassPart(type, modifiers) {
        this.modifiers = modifiers;
        if (!modifiers) {
            this.modifiers = [];
        }
        this.type = type || null;
    }
    AbstractClassPart.prototype.hasModifier = function (modifier) { return this.modifiers.indexOf(modifier) !== -1; };
    return AbstractClassPart;
}());
exports.AbstractClassPart = AbstractClassPart;
var ClassField = /** @class */ (function (_super) {
    __extends(ClassField, _super);
    function ClassField(name, type, modifiers, initializer) {
        if (modifiers === void 0) { modifiers = null; }
        var _this = _super.call(this, type, modifiers) || this;
        _this.name = name;
        _this.initializer = initializer;
        return _this;
    }
    ClassField.prototype.isEquivalent = function (f) { return this.name === f.name; };
    return ClassField;
}(AbstractClassPart));
exports.ClassField = ClassField;
var ClassMethod = /** @class */ (function (_super) {
    __extends(ClassMethod, _super);
    function ClassMethod(name, params, body, type, modifiers) {
        if (modifiers === void 0) { modifiers = null; }
        var _this = _super.call(this, type, modifiers) || this;
        _this.name = name;
        _this.params = params;
        _this.body = body;
        return _this;
    }
    ClassMethod.prototype.isEquivalent = function (m) {
        return this.name === m.name && areAllEquivalent(this.body, m.body);
    };
    return ClassMethod;
}(AbstractClassPart));
exports.ClassMethod = ClassMethod;
var ClassGetter = /** @class */ (function (_super) {
    __extends(ClassGetter, _super);
    function ClassGetter(name, body, type, modifiers) {
        if (modifiers === void 0) { modifiers = null; }
        var _this = _super.call(this, type, modifiers) || this;
        _this.name = name;
        _this.body = body;
        return _this;
    }
    ClassGetter.prototype.isEquivalent = function (m) {
        return this.name === m.name && areAllEquivalent(this.body, m.body);
    };
    return ClassGetter;
}(AbstractClassPart));
exports.ClassGetter = ClassGetter;
var ClassStmt = /** @class */ (function (_super) {
    __extends(ClassStmt, _super);
    function ClassStmt(name, parent, fields, getters, constructorMethod, methods, modifiers, sourceSpan) {
        if (modifiers === void 0) { modifiers = null; }
        var _this = _super.call(this, modifiers, sourceSpan) || this;
        _this.name = name;
        _this.parent = parent;
        _this.fields = fields;
        _this.getters = getters;
        _this.constructorMethod = constructorMethod;
        _this.methods = methods;
        return _this;
    }
    ClassStmt.prototype.isEquivalent = function (stmt) {
        return stmt instanceof ClassStmt && this.name === stmt.name &&
            nullSafeIsEquivalent(this.parent, stmt.parent) &&
            areAllEquivalent(this.fields, stmt.fields) &&
            areAllEquivalent(this.getters, stmt.getters) &&
            this.constructorMethod.isEquivalent(stmt.constructorMethod) &&
            areAllEquivalent(this.methods, stmt.methods);
    };
    ClassStmt.prototype.visitStatement = function (visitor, context) {
        return visitor.visitDeclareClassStmt(this, context);
    };
    return ClassStmt;
}(Statement));
exports.ClassStmt = ClassStmt;
var IfStmt = /** @class */ (function (_super) {
    __extends(IfStmt, _super);
    function IfStmt(condition, trueCase, falseCase, sourceSpan) {
        if (falseCase === void 0) { falseCase = []; }
        var _this = _super.call(this, null, sourceSpan) || this;
        _this.condition = condition;
        _this.trueCase = trueCase;
        _this.falseCase = falseCase;
        return _this;
    }
    IfStmt.prototype.isEquivalent = function (stmt) {
        return stmt instanceof IfStmt && this.condition.isEquivalent(stmt.condition) &&
            areAllEquivalent(this.trueCase, stmt.trueCase) &&
            areAllEquivalent(this.falseCase, stmt.falseCase);
    };
    IfStmt.prototype.visitStatement = function (visitor, context) {
        return visitor.visitIfStmt(this, context);
    };
    return IfStmt;
}(Statement));
exports.IfStmt = IfStmt;
var CommentStmt = /** @class */ (function (_super) {
    __extends(CommentStmt, _super);
    function CommentStmt(comment, multiline, sourceSpan) {
        if (multiline === void 0) { multiline = false; }
        var _this = _super.call(this, null, sourceSpan) || this;
        _this.comment = comment;
        _this.multiline = multiline;
        return _this;
    }
    CommentStmt.prototype.isEquivalent = function (stmt) { return stmt instanceof CommentStmt; };
    CommentStmt.prototype.visitStatement = function (visitor, context) {
        return visitor.visitCommentStmt(this, context);
    };
    return CommentStmt;
}(Statement));
exports.CommentStmt = CommentStmt;
var JSDocCommentStmt = /** @class */ (function (_super) {
    __extends(JSDocCommentStmt, _super);
    function JSDocCommentStmt(tags, sourceSpan) {
        if (tags === void 0) { tags = []; }
        var _this = _super.call(this, null, sourceSpan) || this;
        _this.tags = tags;
        return _this;
    }
    JSDocCommentStmt.prototype.isEquivalent = function (stmt) {
        return stmt instanceof JSDocCommentStmt && this.toString() === stmt.toString();
    };
    JSDocCommentStmt.prototype.visitStatement = function (visitor, context) {
        return visitor.visitJSDocCommentStmt(this, context);
    };
    JSDocCommentStmt.prototype.toString = function () { return serializeTags(this.tags); };
    return JSDocCommentStmt;
}(Statement));
exports.JSDocCommentStmt = JSDocCommentStmt;
var TryCatchStmt = /** @class */ (function (_super) {
    __extends(TryCatchStmt, _super);
    function TryCatchStmt(bodyStmts, catchStmts, sourceSpan) {
        var _this = _super.call(this, null, sourceSpan) || this;
        _this.bodyStmts = bodyStmts;
        _this.catchStmts = catchStmts;
        return _this;
    }
    TryCatchStmt.prototype.isEquivalent = function (stmt) {
        return stmt instanceof TryCatchStmt && areAllEquivalent(this.bodyStmts, stmt.bodyStmts) &&
            areAllEquivalent(this.catchStmts, stmt.catchStmts);
    };
    TryCatchStmt.prototype.visitStatement = function (visitor, context) {
        return visitor.visitTryCatchStmt(this, context);
    };
    return TryCatchStmt;
}(Statement));
exports.TryCatchStmt = TryCatchStmt;
var ThrowStmt = /** @class */ (function (_super) {
    __extends(ThrowStmt, _super);
    function ThrowStmt(error, sourceSpan) {
        var _this = _super.call(this, null, sourceSpan) || this;
        _this.error = error;
        return _this;
    }
    ThrowStmt.prototype.isEquivalent = function (stmt) {
        return stmt instanceof TryCatchStmt && this.error.isEquivalent(stmt.error);
    };
    ThrowStmt.prototype.visitStatement = function (visitor, context) {
        return visitor.visitThrowStmt(this, context);
    };
    return ThrowStmt;
}(Statement));
exports.ThrowStmt = ThrowStmt;
var AstTransformer = /** @class */ (function () {
    function AstTransformer() {
    }
    AstTransformer.prototype.transformExpr = function (expr, context) { return expr; };
    AstTransformer.prototype.transformStmt = function (stmt, context) { return stmt; };
    AstTransformer.prototype.visitReadVarExpr = function (ast, context) { return this.transformExpr(ast, context); };
    AstTransformer.prototype.visitWrappedNodeExpr = function (ast, context) {
        return this.transformExpr(ast, context);
    };
    AstTransformer.prototype.visitTypeofExpr = function (expr, context) {
        return this.transformExpr(new TypeofExpr(expr.expr.visitExpression(this, context), expr.type, expr.sourceSpan), context);
    };
    AstTransformer.prototype.visitWriteVarExpr = function (expr, context) {
        return this.transformExpr(new WriteVarExpr(expr.name, expr.value.visitExpression(this, context), expr.type, expr.sourceSpan), context);
    };
    AstTransformer.prototype.visitWriteKeyExpr = function (expr, context) {
        return this.transformExpr(new WriteKeyExpr(expr.receiver.visitExpression(this, context), expr.index.visitExpression(this, context), expr.value.visitExpression(this, context), expr.type, expr.sourceSpan), context);
    };
    AstTransformer.prototype.visitWritePropExpr = function (expr, context) {
        return this.transformExpr(new WritePropExpr(expr.receiver.visitExpression(this, context), expr.name, expr.value.visitExpression(this, context), expr.type, expr.sourceSpan), context);
    };
    AstTransformer.prototype.visitInvokeMethodExpr = function (ast, context) {
        var method = ast.builtin || ast.name;
        return this.transformExpr(new InvokeMethodExpr(ast.receiver.visitExpression(this, context), method, this.visitAllExpressions(ast.args, context), ast.type, ast.sourceSpan), context);
    };
    AstTransformer.prototype.visitInvokeFunctionExpr = function (ast, context) {
        return this.transformExpr(new InvokeFunctionExpr(ast.fn.visitExpression(this, context), this.visitAllExpressions(ast.args, context), ast.type, ast.sourceSpan), context);
    };
    AstTransformer.prototype.visitInstantiateExpr = function (ast, context) {
        return this.transformExpr(new InstantiateExpr(ast.classExpr.visitExpression(this, context), this.visitAllExpressions(ast.args, context), ast.type, ast.sourceSpan), context);
    };
    AstTransformer.prototype.visitLiteralExpr = function (ast, context) { return this.transformExpr(ast, context); };
    AstTransformer.prototype.visitExternalExpr = function (ast, context) {
        return this.transformExpr(ast, context);
    };
    AstTransformer.prototype.visitConditionalExpr = function (ast, context) {
        return this.transformExpr(new ConditionalExpr(ast.condition.visitExpression(this, context), ast.trueCase.visitExpression(this, context), ast.falseCase.visitExpression(this, context), ast.type, ast.sourceSpan), context);
    };
    AstTransformer.prototype.visitNotExpr = function (ast, context) {
        return this.transformExpr(new NotExpr(ast.condition.visitExpression(this, context), ast.sourceSpan), context);
    };
    AstTransformer.prototype.visitAssertNotNullExpr = function (ast, context) {
        return this.transformExpr(new AssertNotNull(ast.condition.visitExpression(this, context), ast.sourceSpan), context);
    };
    AstTransformer.prototype.visitCastExpr = function (ast, context) {
        return this.transformExpr(new CastExpr(ast.value.visitExpression(this, context), ast.type, ast.sourceSpan), context);
    };
    AstTransformer.prototype.visitFunctionExpr = function (ast, context) {
        return this.transformExpr(new FunctionExpr(ast.params, this.visitAllStatements(ast.statements, context), ast.type, ast.sourceSpan), context);
    };
    AstTransformer.prototype.visitBinaryOperatorExpr = function (ast, context) {
        return this.transformExpr(new BinaryOperatorExpr(ast.operator, ast.lhs.visitExpression(this, context), ast.rhs.visitExpression(this, context), ast.type, ast.sourceSpan), context);
    };
    AstTransformer.prototype.visitReadPropExpr = function (ast, context) {
        return this.transformExpr(new ReadPropExpr(ast.receiver.visitExpression(this, context), ast.name, ast.type, ast.sourceSpan), context);
    };
    AstTransformer.prototype.visitReadKeyExpr = function (ast, context) {
        return this.transformExpr(new ReadKeyExpr(ast.receiver.visitExpression(this, context), ast.index.visitExpression(this, context), ast.type, ast.sourceSpan), context);
    };
    AstTransformer.prototype.visitLiteralArrayExpr = function (ast, context) {
        return this.transformExpr(new LiteralArrayExpr(this.visitAllExpressions(ast.entries, context), ast.type, ast.sourceSpan), context);
    };
    AstTransformer.prototype.visitLiteralMapExpr = function (ast, context) {
        var _this = this;
        var entries = ast.entries.map(function (entry) { return new LiteralMapEntry(entry.key, entry.value.visitExpression(_this, context), entry.quoted); });
        var mapType = new MapType(ast.valueType, null);
        return this.transformExpr(new LiteralMapExpr(entries, mapType, ast.sourceSpan), context);
    };
    AstTransformer.prototype.visitCommaExpr = function (ast, context) {
        return this.transformExpr(new CommaExpr(this.visitAllExpressions(ast.parts, context), ast.sourceSpan), context);
    };
    AstTransformer.prototype.visitAllExpressions = function (exprs, context) {
        var _this = this;
        return exprs.map(function (expr) { return expr.visitExpression(_this, context); });
    };
    AstTransformer.prototype.visitDeclareVarStmt = function (stmt, context) {
        var value = stmt.value && stmt.value.visitExpression(this, context);
        return this.transformStmt(new DeclareVarStmt(stmt.name, value, stmt.type, stmt.modifiers, stmt.sourceSpan), context);
    };
    AstTransformer.prototype.visitDeclareFunctionStmt = function (stmt, context) {
        return this.transformStmt(new DeclareFunctionStmt(stmt.name, stmt.params, this.visitAllStatements(stmt.statements, context), stmt.type, stmt.modifiers, stmt.sourceSpan), context);
    };
    AstTransformer.prototype.visitExpressionStmt = function (stmt, context) {
        return this.transformStmt(new ExpressionStatement(stmt.expr.visitExpression(this, context), stmt.sourceSpan), context);
    };
    AstTransformer.prototype.visitReturnStmt = function (stmt, context) {
        return this.transformStmt(new ReturnStatement(stmt.value.visitExpression(this, context), stmt.sourceSpan), context);
    };
    AstTransformer.prototype.visitDeclareClassStmt = function (stmt, context) {
        var _this = this;
        var parent = stmt.parent.visitExpression(this, context);
        var getters = stmt.getters.map(function (getter) { return new ClassGetter(getter.name, _this.visitAllStatements(getter.body, context), getter.type, getter.modifiers); });
        var ctorMethod = stmt.constructorMethod &&
            new ClassMethod(stmt.constructorMethod.name, stmt.constructorMethod.params, this.visitAllStatements(stmt.constructorMethod.body, context), stmt.constructorMethod.type, stmt.constructorMethod.modifiers);
        var methods = stmt.methods.map(function (method) { return new ClassMethod(method.name, method.params, _this.visitAllStatements(method.body, context), method.type, method.modifiers); });
        return this.transformStmt(new ClassStmt(stmt.name, parent, stmt.fields, getters, ctorMethod, methods, stmt.modifiers, stmt.sourceSpan), context);
    };
    AstTransformer.prototype.visitIfStmt = function (stmt, context) {
        return this.transformStmt(new IfStmt(stmt.condition.visitExpression(this, context), this.visitAllStatements(stmt.trueCase, context), this.visitAllStatements(stmt.falseCase, context), stmt.sourceSpan), context);
    };
    AstTransformer.prototype.visitTryCatchStmt = function (stmt, context) {
        return this.transformStmt(new TryCatchStmt(this.visitAllStatements(stmt.bodyStmts, context), this.visitAllStatements(stmt.catchStmts, context), stmt.sourceSpan), context);
    };
    AstTransformer.prototype.visitThrowStmt = function (stmt, context) {
        return this.transformStmt(new ThrowStmt(stmt.error.visitExpression(this, context), stmt.sourceSpan), context);
    };
    AstTransformer.prototype.visitCommentStmt = function (stmt, context) {
        return this.transformStmt(stmt, context);
    };
    AstTransformer.prototype.visitJSDocCommentStmt = function (stmt, context) {
        return this.transformStmt(stmt, context);
    };
    AstTransformer.prototype.visitAllStatements = function (stmts, context) {
        var _this = this;
        return stmts.map(function (stmt) { return stmt.visitStatement(_this, context); });
    };
    return AstTransformer;
}());
exports.AstTransformer = AstTransformer;
var RecursiveAstVisitor = /** @class */ (function () {
    function RecursiveAstVisitor() {
    }
    RecursiveAstVisitor.prototype.visitType = function (ast, context) { return ast; };
    RecursiveAstVisitor.prototype.visitExpression = function (ast, context) {
        if (ast.type) {
            ast.type.visitType(this, context);
        }
        return ast;
    };
    RecursiveAstVisitor.prototype.visitBuiltinType = function (type, context) { return this.visitType(type, context); };
    RecursiveAstVisitor.prototype.visitExpressionType = function (type, context) {
        var _this = this;
        type.value.visitExpression(this, context);
        if (type.typeParams !== null) {
            type.typeParams.forEach(function (param) { return _this.visitType(param, context); });
        }
        return this.visitType(type, context);
    };
    RecursiveAstVisitor.prototype.visitArrayType = function (type, context) { return this.visitType(type, context); };
    RecursiveAstVisitor.prototype.visitMapType = function (type, context) { return this.visitType(type, context); };
    RecursiveAstVisitor.prototype.visitWrappedNodeExpr = function (ast, context) { return ast; };
    RecursiveAstVisitor.prototype.visitTypeofExpr = function (ast, context) { return this.visitExpression(ast, context); };
    RecursiveAstVisitor.prototype.visitReadVarExpr = function (ast, context) {
        return this.visitExpression(ast, context);
    };
    RecursiveAstVisitor.prototype.visitWriteVarExpr = function (ast, context) {
        ast.value.visitExpression(this, context);
        return this.visitExpression(ast, context);
    };
    RecursiveAstVisitor.prototype.visitWriteKeyExpr = function (ast, context) {
        ast.receiver.visitExpression(this, context);
        ast.index.visitExpression(this, context);
        ast.value.visitExpression(this, context);
        return this.visitExpression(ast, context);
    };
    RecursiveAstVisitor.prototype.visitWritePropExpr = function (ast, context) {
        ast.receiver.visitExpression(this, context);
        ast.value.visitExpression(this, context);
        return this.visitExpression(ast, context);
    };
    RecursiveAstVisitor.prototype.visitInvokeMethodExpr = function (ast, context) {
        ast.receiver.visitExpression(this, context);
        this.visitAllExpressions(ast.args, context);
        return this.visitExpression(ast, context);
    };
    RecursiveAstVisitor.prototype.visitInvokeFunctionExpr = function (ast, context) {
        ast.fn.visitExpression(this, context);
        this.visitAllExpressions(ast.args, context);
        return this.visitExpression(ast, context);
    };
    RecursiveAstVisitor.prototype.visitInstantiateExpr = function (ast, context) {
        ast.classExpr.visitExpression(this, context);
        this.visitAllExpressions(ast.args, context);
        return this.visitExpression(ast, context);
    };
    RecursiveAstVisitor.prototype.visitLiteralExpr = function (ast, context) {
        return this.visitExpression(ast, context);
    };
    RecursiveAstVisitor.prototype.visitExternalExpr = function (ast, context) {
        var _this = this;
        if (ast.typeParams) {
            ast.typeParams.forEach(function (type) { return type.visitType(_this, context); });
        }
        return this.visitExpression(ast, context);
    };
    RecursiveAstVisitor.prototype.visitConditionalExpr = function (ast, context) {
        ast.condition.visitExpression(this, context);
        ast.trueCase.visitExpression(this, context);
        ast.falseCase.visitExpression(this, context);
        return this.visitExpression(ast, context);
    };
    RecursiveAstVisitor.prototype.visitNotExpr = function (ast, context) {
        ast.condition.visitExpression(this, context);
        return this.visitExpression(ast, context);
    };
    RecursiveAstVisitor.prototype.visitAssertNotNullExpr = function (ast, context) {
        ast.condition.visitExpression(this, context);
        return this.visitExpression(ast, context);
    };
    RecursiveAstVisitor.prototype.visitCastExpr = function (ast, context) {
        ast.value.visitExpression(this, context);
        return this.visitExpression(ast, context);
    };
    RecursiveAstVisitor.prototype.visitFunctionExpr = function (ast, context) {
        this.visitAllStatements(ast.statements, context);
        return this.visitExpression(ast, context);
    };
    RecursiveAstVisitor.prototype.visitBinaryOperatorExpr = function (ast, context) {
        ast.lhs.visitExpression(this, context);
        ast.rhs.visitExpression(this, context);
        return this.visitExpression(ast, context);
    };
    RecursiveAstVisitor.prototype.visitReadPropExpr = function (ast, context) {
        ast.receiver.visitExpression(this, context);
        return this.visitExpression(ast, context);
    };
    RecursiveAstVisitor.prototype.visitReadKeyExpr = function (ast, context) {
        ast.receiver.visitExpression(this, context);
        ast.index.visitExpression(this, context);
        return this.visitExpression(ast, context);
    };
    RecursiveAstVisitor.prototype.visitLiteralArrayExpr = function (ast, context) {
        this.visitAllExpressions(ast.entries, context);
        return this.visitExpression(ast, context);
    };
    RecursiveAstVisitor.prototype.visitLiteralMapExpr = function (ast, context) {
        var _this = this;
        ast.entries.forEach(function (entry) { return entry.value.visitExpression(_this, context); });
        return this.visitExpression(ast, context);
    };
    RecursiveAstVisitor.prototype.visitCommaExpr = function (ast, context) {
        this.visitAllExpressions(ast.parts, context);
        return this.visitExpression(ast, context);
    };
    RecursiveAstVisitor.prototype.visitAllExpressions = function (exprs, context) {
        var _this = this;
        exprs.forEach(function (expr) { return expr.visitExpression(_this, context); });
    };
    RecursiveAstVisitor.prototype.visitDeclareVarStmt = function (stmt, context) {
        if (stmt.value) {
            stmt.value.visitExpression(this, context);
        }
        if (stmt.type) {
            stmt.type.visitType(this, context);
        }
        return stmt;
    };
    RecursiveAstVisitor.prototype.visitDeclareFunctionStmt = function (stmt, context) {
        this.visitAllStatements(stmt.statements, context);
        if (stmt.type) {
            stmt.type.visitType(this, context);
        }
        return stmt;
    };
    RecursiveAstVisitor.prototype.visitExpressionStmt = function (stmt, context) {
        stmt.expr.visitExpression(this, context);
        return stmt;
    };
    RecursiveAstVisitor.prototype.visitReturnStmt = function (stmt, context) {
        stmt.value.visitExpression(this, context);
        return stmt;
    };
    RecursiveAstVisitor.prototype.visitDeclareClassStmt = function (stmt, context) {
        var _this = this;
        stmt.parent.visitExpression(this, context);
        stmt.getters.forEach(function (getter) { return _this.visitAllStatements(getter.body, context); });
        if (stmt.constructorMethod) {
            this.visitAllStatements(stmt.constructorMethod.body, context);
        }
        stmt.methods.forEach(function (method) { return _this.visitAllStatements(method.body, context); });
        return stmt;
    };
    RecursiveAstVisitor.prototype.visitIfStmt = function (stmt, context) {
        stmt.condition.visitExpression(this, context);
        this.visitAllStatements(stmt.trueCase, context);
        this.visitAllStatements(stmt.falseCase, context);
        return stmt;
    };
    RecursiveAstVisitor.prototype.visitTryCatchStmt = function (stmt, context) {
        this.visitAllStatements(stmt.bodyStmts, context);
        this.visitAllStatements(stmt.catchStmts, context);
        return stmt;
    };
    RecursiveAstVisitor.prototype.visitThrowStmt = function (stmt, context) {
        stmt.error.visitExpression(this, context);
        return stmt;
    };
    RecursiveAstVisitor.prototype.visitCommentStmt = function (stmt, context) { return stmt; };
    RecursiveAstVisitor.prototype.visitJSDocCommentStmt = function (stmt, context) { return stmt; };
    RecursiveAstVisitor.prototype.visitAllStatements = function (stmts, context) {
        var _this = this;
        stmts.forEach(function (stmt) { return stmt.visitStatement(_this, context); });
    };
    return RecursiveAstVisitor;
}());
exports.RecursiveAstVisitor = RecursiveAstVisitor;
function findReadVarNames(stmts) {
    var visitor = new _ReadVarVisitor();
    visitor.visitAllStatements(stmts, null);
    return visitor.varNames;
}
exports.findReadVarNames = findReadVarNames;
var _ReadVarVisitor = /** @class */ (function (_super) {
    __extends(_ReadVarVisitor, _super);
    function _ReadVarVisitor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.varNames = new Set();
        return _this;
    }
    _ReadVarVisitor.prototype.visitDeclareFunctionStmt = function (stmt, context) {
        // Don't descend into nested functions
        return stmt;
    };
    _ReadVarVisitor.prototype.visitDeclareClassStmt = function (stmt, context) {
        // Don't descend into nested classes
        return stmt;
    };
    _ReadVarVisitor.prototype.visitReadVarExpr = function (ast, context) {
        if (ast.name) {
            this.varNames.add(ast.name);
        }
        return null;
    };
    return _ReadVarVisitor;
}(RecursiveAstVisitor));
function collectExternalReferences(stmts) {
    var visitor = new _FindExternalReferencesVisitor();
    visitor.visitAllStatements(stmts, null);
    return visitor.externalReferences;
}
exports.collectExternalReferences = collectExternalReferences;
var _FindExternalReferencesVisitor = /** @class */ (function (_super) {
    __extends(_FindExternalReferencesVisitor, _super);
    function _FindExternalReferencesVisitor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.externalReferences = [];
        return _this;
    }
    _FindExternalReferencesVisitor.prototype.visitExternalExpr = function (e, context) {
        this.externalReferences.push(e.value);
        return _super.prototype.visitExternalExpr.call(this, e, context);
    };
    return _FindExternalReferencesVisitor;
}(RecursiveAstVisitor));
function applySourceSpanToStatementIfNeeded(stmt, sourceSpan) {
    if (!sourceSpan) {
        return stmt;
    }
    var transformer = new _ApplySourceSpanTransformer(sourceSpan);
    return stmt.visitStatement(transformer, null);
}
exports.applySourceSpanToStatementIfNeeded = applySourceSpanToStatementIfNeeded;
function applySourceSpanToExpressionIfNeeded(expr, sourceSpan) {
    if (!sourceSpan) {
        return expr;
    }
    var transformer = new _ApplySourceSpanTransformer(sourceSpan);
    return expr.visitExpression(transformer, null);
}
exports.applySourceSpanToExpressionIfNeeded = applySourceSpanToExpressionIfNeeded;
var _ApplySourceSpanTransformer = /** @class */ (function (_super) {
    __extends(_ApplySourceSpanTransformer, _super);
    function _ApplySourceSpanTransformer(sourceSpan) {
        var _this = _super.call(this) || this;
        _this.sourceSpan = sourceSpan;
        return _this;
    }
    _ApplySourceSpanTransformer.prototype._clone = function (obj) {
        var clone = Object.create(obj.constructor.prototype);
        for (var prop in obj) {
            clone[prop] = obj[prop];
        }
        return clone;
    };
    _ApplySourceSpanTransformer.prototype.transformExpr = function (expr, context) {
        if (!expr.sourceSpan) {
            expr = this._clone(expr);
            expr.sourceSpan = this.sourceSpan;
        }
        return expr;
    };
    _ApplySourceSpanTransformer.prototype.transformStmt = function (stmt, context) {
        if (!stmt.sourceSpan) {
            stmt = this._clone(stmt);
            stmt.sourceSpan = this.sourceSpan;
        }
        return stmt;
    };
    return _ApplySourceSpanTransformer;
}(AstTransformer));
function variable(name, type, sourceSpan) {
    return new ReadVarExpr(name, type, sourceSpan);
}
exports.variable = variable;
function importExpr(id, typeParams, sourceSpan) {
    if (typeParams === void 0) { typeParams = null; }
    return new ExternalExpr(id, null, typeParams, sourceSpan);
}
exports.importExpr = importExpr;
function importType(id, typeParams, typeModifiers) {
    if (typeParams === void 0) { typeParams = null; }
    if (typeModifiers === void 0) { typeModifiers = null; }
    return id != null ? expressionType(importExpr(id, typeParams, null), typeModifiers) : null;
}
exports.importType = importType;
function expressionType(expr, typeModifiers, typeParams) {
    if (typeModifiers === void 0) { typeModifiers = null; }
    if (typeParams === void 0) { typeParams = null; }
    return new ExpressionType(expr, typeModifiers, typeParams);
}
exports.expressionType = expressionType;
function typeofExpr(expr) {
    return new TypeofExpr(expr);
}
exports.typeofExpr = typeofExpr;
function literalArr(values, type, sourceSpan) {
    return new LiteralArrayExpr(values, type, sourceSpan);
}
exports.literalArr = literalArr;
function literalMap(values, type) {
    if (type === void 0) { type = null; }
    return new LiteralMapExpr(values.map(function (e) { return new LiteralMapEntry(e.key, e.value, e.quoted); }), type, null);
}
exports.literalMap = literalMap;
function not(expr, sourceSpan) {
    return new NotExpr(expr, sourceSpan);
}
exports.not = not;
function assertNotNull(expr, sourceSpan) {
    return new AssertNotNull(expr, sourceSpan);
}
exports.assertNotNull = assertNotNull;
function fn(params, body, type, sourceSpan, name) {
    return new FunctionExpr(params, body, type, sourceSpan, name);
}
exports.fn = fn;
function ifStmt(condition, thenClause, elseClause) {
    return new IfStmt(condition, thenClause, elseClause);
}
exports.ifStmt = ifStmt;
function literal(value, type, sourceSpan) {
    return new LiteralExpr(value, type, sourceSpan);
}
exports.literal = literal;
function isNull(exp) {
    return exp instanceof LiteralExpr && exp.value === null;
}
exports.isNull = isNull;
/*
 * Serializes a `Tag` into a string.
 * Returns a string like " @foo {bar} baz" (note the leading whitespace before `@foo`).
 */
function tagToString(tag) {
    var out = '';
    if (tag.tagName) {
        out += " @" + tag.tagName;
    }
    if (tag.text) {
        if (tag.text.match(/\/\*|\*\//)) {
            throw new Error('JSDoc text cannot contain "/*" and "*/"');
        }
        out += ' ' + tag.text.replace(/@/g, '\\@');
    }
    return out;
}
function serializeTags(tags) {
    if (tags.length === 0)
        return '';
    var out = '*\n';
    for (var _i = 0, tags_1 = tags; _i < tags_1.length; _i++) {
        var tag = tags_1[_i];
        out += ' *';
        // If the tagToString is multi-line, insert " * " prefixes on subsequent lines.
        out += tagToString(tag).replace(/\n/g, '\n * ');
        out += '\n';
    }
    out += ' ';
    return out;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0cHV0X2FzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9vdXRwdXQvb3V0cHV0X2FzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFNSCxVQUFVO0FBQ1YsSUFBWSxZQUVYO0FBRkQsV0FBWSxZQUFZO0lBQ3RCLGlEQUFLLENBQUE7QUFDUCxDQUFDLEVBRlcsWUFBWSxHQUFaLG9CQUFZLEtBQVosb0JBQVksUUFFdkI7QUFFRDtJQUNFLGNBQW1CLFNBQXFDO1FBQXJDLDBCQUFBLEVBQUEsZ0JBQXFDO1FBQXJDLGNBQVMsR0FBVCxTQUFTLENBQTRCO1FBQ3RELElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDZCxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztTQUNyQjtJQUNILENBQUM7SUFHRCwwQkFBVyxHQUFYLFVBQVksUUFBc0IsSUFBYSxPQUFPLElBQUksQ0FBQyxTQUFXLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwRyxXQUFDO0FBQUQsQ0FBQyxBQVRELElBU0M7QUFUcUIsb0JBQUk7QUFXMUIsSUFBWSxlQVNYO0FBVEQsV0FBWSxlQUFlO0lBQ3pCLDJEQUFPLENBQUE7SUFDUCxxREFBSSxDQUFBO0lBQ0oseURBQU0sQ0FBQTtJQUNOLG1EQUFHLENBQUE7SUFDSCx5REFBTSxDQUFBO0lBQ04sNkRBQVEsQ0FBQTtJQUNSLDZEQUFRLENBQUE7SUFDUixxREFBSSxDQUFBO0FBQ04sQ0FBQyxFQVRXLGVBQWUsR0FBZix1QkFBZSxLQUFmLHVCQUFlLFFBUzFCO0FBRUQ7SUFBaUMsK0JBQUk7SUFDbkMscUJBQW1CLElBQXFCLEVBQUUsU0FBcUM7UUFBckMsMEJBQUEsRUFBQSxnQkFBcUM7UUFBL0UsWUFDRSxrQkFBTSxTQUFTLENBQUMsU0FDakI7UUFGa0Is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RUFBRSxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDcEYsQ0FBQztJQUNELDhCQUFTLEdBQVQsVUFBVSxHQUFlLEVBQUUsVUFBaUM7UUFDMUQsT0FBTyxJQUFJLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDdkYsQ0FBQztJQUNELDhCQUFTLEdBQVQsVUFBVSxHQUFlLEVBQUUsVUFBaUM7UUFDMUQsT0FBTyxJQUFJLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDdkYsQ0FBQztJQUNELGlDQUFZLEdBQVosVUFBYSxHQUFlLEVBQUUsVUFBaUM7UUFDN0QsT0FBTyxJQUFJLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDMUYsQ0FBQztJQUNELDBCQUFLLEdBQUwsVUFBTSxHQUFlLEVBQUUsVUFBaUM7UUFDdEQsT0FBTyxJQUFJLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDbkYsQ0FBQztJQUNELHlCQUFJLEdBQUosVUFBSyxHQUFlLEVBQUUsVUFBaUM7UUFDckQsT0FBTyxJQUFJLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDbEYsQ0FBQztJQUNELDJCQUFNLEdBQU4sVUFBTyxHQUFlLEVBQUUsVUFBaUM7UUFDdkQsT0FBTyxJQUFJLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDcEYsQ0FBQztJQUNELDZCQUFRLEdB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