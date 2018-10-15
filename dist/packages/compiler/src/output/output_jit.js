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
    let fnBody = `${ctx.toSource()}\n//# sourceURL=${sourceUrl}`;
    /** @type {?} */
    const fnArgNames = [];
    /** @type {?} */
    const fnArgValues = [];
    for (const argName in vars) {
        fnArgNames.push(argName);
        fnArgValues.push(vars[argName]);
    }
    if (createSourceMap) {
        /** @type {?} */
        const emptyFn = new Function(...fnArgNames.concat('return null;')).toString();
        /** @type {?} */
        const headerLines = emptyFn.slice(0, emptyFn.indexOf('return null;')).split('\n').length - 1;
        fnBody += `\n${ctx.toSourceMapGenerator(sourceUrl, headerLines).toJsComment()}`;
    }
    return new Function(...fnArgNames.concat(fnBody))(...fnArgValues);
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
    const converter = new JitEmitterVisitor(reflector);
    /** @type {?} */
    const ctx = EmitterVisitorContext.createRoot();
    converter.visitAllStatements(statements, ctx);
    converter.createReturnStmt(ctx);
    return evalExpression(sourceUrl, ctx, converter.getArgs(), createSourceMaps);
}
export class JitEmitterVisitor extends AbstractJsEmitterVisitor {
    /**
     * @param {?} reflector
     */
    constructor(reflector) {
        super();
        this.reflector = reflector;
        this._evalArgNames = [];
        this._evalArgValues = [];
        this._evalExportedVars = [];
    }
    /**
     * @param {?} ctx
     * @return {?}
     */
    createReturnStmt(ctx) {
        /** @type {?} */
        const stmt = new o.ReturnStatement(new o.LiteralMapExpr(this._evalExportedVars.map(resultVar => new o.LiteralMapEntry(resultVar, o.variable(resultVar), false))));
        stmt.visitStatement(this, ctx);
    }
    /**
     * @return {?}
     */
    getArgs() {
        /** @type {?} */
        const result = {};
        for (let i = 0; i < this._evalArgNames.length; i++) {
            result[this._evalArgNames[i]] = this._evalArgValues[i];
        }
        return result;
    }
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitExternalExpr(ast, ctx) {
        this._emitReferenceToExternal(ast, this.reflector.resolveExternalReference(ast.value), ctx);
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitWrappedNodeExpr(ast, ctx) {
        this._emitReferenceToExternal(ast, ast.node, ctx);
        return null;
    }
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    visitDeclareVarStmt(stmt, ctx) {
        if (stmt.hasModifier(o.StmtModifier.Exported)) {
            this._evalExportedVars.push(stmt.name);
        }
        return super.visitDeclareVarStmt(stmt, ctx);
    }
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    visitDeclareFunctionStmt(stmt, ctx) {
        if (stmt.hasModifier(o.StmtModifier.Exported)) {
            this._evalExportedVars.push(stmt.name);
        }
        return super.visitDeclareFunctionStmt(stmt, ctx);
    }
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    visitDeclareClassStmt(stmt, ctx) {
        if (stmt.hasModifier(o.StmtModifier.Exported)) {
            this._evalExportedVars.push(stmt.name);
        }
        return super.visitDeclareClassStmt(stmt, ctx);
    }
    /**
     * @param {?} ast
     * @param {?} value
     * @param {?} ctx
     * @return {?}
     */
    _emitReferenceToExternal(ast, value, ctx) {
        /** @type {?} */
        let id = this._evalArgValues.indexOf(value);
        if (id === -1) {
            id = this._evalArgValues.length;
            this._evalArgValues.push(value);
            /** @type {?} */
            const name = identifierName({ reference: value }) || 'val';
            this._evalArgNames.push(`jit_${name}_${id}`);
        }
        ctx.print(ast, this._evalArgNames[id]);
    }
}
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