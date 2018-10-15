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
import * as tslib_1 from "tslib";
import { identifierName } from '../compile_metadata';
import { EmitterVisitorContext } from './abstract_emitter';
import { AbstractJsEmitterVisitor } from './abstract_js_emitter';
import * as o from './output_ast';
/**
 * @param {?} sourceUrl
 * @param {?} ctx
 * @param {?} vars
 * @param {?} createSourceMap
 * @return {?}
 */
function evalExpression(sourceUrl, ctx, vars, createSourceMap) {
    /** @type {?} */
    var fnBody = ctx.toSource() + "\n//# sourceURL=" + sourceUrl;
    /** @type {?} */
    var fnArgNames = [];
    /** @type {?} */
    var fnArgValues = [];
    for (var argName in vars) {
        fnArgNames.push(argName);
        fnArgValues.push(vars[argName]);
    }
    if (createSourceMap) {
        /** @type {?} */
        var emptyFn = new (Function.bind.apply(Function, [void 0].concat(fnArgNames.concat('return null;'))))().toString();
        /** @type {?} */
        var headerLines = emptyFn.slice(0, emptyFn.indexOf('return null;')).split('\n').length - 1;
        fnBody += "\n" + ctx.toSourceMapGenerator(sourceUrl, headerLines).toJsComment();
    }
    return new (Function.bind.apply(Function, [void 0].concat(fnArgNames.concat(fnBody))))().apply(void 0, fnArgValues);
}
/**
 * @param {?} sourceUrl
 * @param {?} statements
 * @param {?} reflector
 * @param {?} createSourceMaps
 * @return {?}
 */
export function jitStatements(sourceUrl, statements, reflector, createSourceMaps) {
    /** @type {?} */
    var converter = new JitEmitterVisitor(reflector);
    /** @type {?} */
    var ctx = EmitterVisitorContext.createRoot();
    converter.visitAllStatements(statements, ctx);
    converter.createReturnStmt(ctx);
    return evalExpression(sourceUrl, ctx, converter.getArgs(), createSourceMaps);
}
var JitEmitterVisitor = /** @class */ (function (_super) {
    tslib_1.__extends(JitEmitterVisitor, _super);
    function JitEmitterVisitor(reflector) {
        var _this = _super.call(this) || this;
        _this.reflector = reflector;
        _this._evalArgNames = [];
        _this._evalArgValues = [];
        _this._evalExportedVars = [];
        return _this;
    }
    /**
     * @param {?} ctx
     * @return {?}
     */
    JitEmitterVisitor.prototype.createReturnStmt = /**
     * @param {?} ctx
     * @return {?}
     */
    function (ctx) {
        /** @type {?} */
        var stmt = new o.ReturnStatement(new o.LiteralMapExpr(this._evalExportedVars.map(function (resultVar) { return new o.LiteralMapEntry(resultVar, o.variable(resultVar), false); })));
        stmt.visitStatement(this, ctx);
    };
    /**
     * @return {?}
     */
    JitEmitterVisitor.prototype.getArgs = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var result = {};
        for (var i = 0; i < this._evalArgNames.length; i++) {
            result[this._evalArgNames[i]] = this._evalArgValues[i];
        }
        return result;
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    JitEmitterVisitor.prototype.visitExternalExpr = /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    function (ast, ctx) {
        this._emitReferenceToExternal(ast, this.reflector.resolveExternalReference(ast.value), ctx);
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    JitEmitterVisitor.prototype.visitWrappedNodeExpr = /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    function (ast, ctx) {
        this._emitReferenceToExternal(ast, ast.node, ctx);
        return null;
    };
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    JitEmitterVisitor.prototype.visitDeclareVarStmt = /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    function (stmt, ctx) {
        if (stmt.hasModifier(o.StmtModifier.Exported)) {
            this._evalExportedVars.push(stmt.name);
        }
        return _super.prototype.visitDeclareVarStmt.call(this, stmt, ctx);
    };
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    JitEmitterVisitor.prototype.visitDeclareFunctionStmt = /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    function (stmt, ctx) {
        if (stmt.hasModifier(o.StmtModifier.Exported)) {
            this._evalExportedVars.push(stmt.name);
        }
        return _super.prototype.visitDeclareFunctionStmt.call(this, stmt, ctx);
    };
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    JitEmitterVisitor.prototype.visitDeclareClassStmt = /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    function (stmt, ctx) {
        if (stmt.hasModifier(o.StmtModifier.Exported)) {
            this._evalExportedVars.push(stmt.name);
        }
        return _super.prototype.visitDeclareClassStmt.call(this, stmt, ctx);
    };
    /**
     * @param {?} ast
     * @param {?} value
     * @param {?} ctx
     * @return {?}
     */
    JitEmitterVisitor.prototype._emitReferenceToExternal = /**
     * @param {?} ast
     * @param {?} value
     * @param {?} ctx
     * @return {?}
     */
    function (ast, value, ctx) {
        /** @type {?} */
        var id = this._evalArgValues.indexOf(value);
        if (id === -1) {
            id = this._evalArgValues.length;
            this._evalArgValues.push(value);
            /** @type {?} */
            var name_1 = identifierName({ reference: value }) || 'val';
            this._evalArgNames.push("jit_" + name_1 + "_" + id);
        }
        ctx.print(ast, this._evalArgNames[id]);
    };
    return JitEmitterVisitor;
}(AbstractJsEmitterVisitor));
export { JitEmitterVisitor };
if (false) {
    /** @type {?} */
    JitEmitterVisitor.prototype._evalArgNames;
    /** @type {?} */
    JitEmitterVisitor.prototype._evalArgValues;
    /** @type {?} */
    JitEmitterVisitor.prototype._evalExportedVars;
    /** @type {?} */
    JitEmitterVisitor.prototype.reflector;
}
//# sourceMappingURL=output_jit.js.map