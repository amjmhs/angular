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
import * as o from '../output/output_ast';
import { jitStatements } from '../output/output_jit';
/**
 * Implementation of `CompileReflector` which resolves references to \@angular/core
 * symbols at runtime, according to a consumer-provided mapping.
 *
 * Only supports `resolveExternalReference`, all other methods throw.
 */
var /**
 * Implementation of `CompileReflector` which resolves references to \@angular/core
 * symbols at runtime, according to a consumer-provided mapping.
 *
 * Only supports `resolveExternalReference`, all other methods throw.
 */
R3JitReflector = /** @class */ (function () {
    function R3JitReflector(context) {
        this.context = context;
    }
    /**
     * @param {?} ref
     * @return {?}
     */
    R3JitReflector.prototype.resolveExternalReference = /**
     * @param {?} ref
     * @return {?}
     */
    function (ref) {
        // This reflector only handles @angular/core imports.
        if (ref.moduleName !== '@angular/core') {
            throw new Error("Cannot resolve external reference to " + ref.moduleName + ", only references to @angular/core are supported.");
        }
        if (!this.context.hasOwnProperty(/** @type {?} */ ((ref.name)))) {
            throw new Error("No value provided for @angular/core symbol '" + (/** @type {?} */ ((ref.name))) + "'.");
        }
        return this.context[/** @type {?} */ ((ref.name))];
    };
    /**
     * @param {?} typeOrFunc
     * @return {?}
     */
    R3JitReflector.prototype.parameters = /**
     * @param {?} typeOrFunc
     * @return {?}
     */
    function (typeOrFunc) { throw new Error('Not implemented.'); };
    /**
     * @param {?} typeOrFunc
     * @return {?}
     */
    R3JitReflector.prototype.annotations = /**
     * @param {?} typeOrFunc
     * @return {?}
     */
    function (typeOrFunc) { throw new Error('Not implemented.'); };
    /**
     * @param {?} typeOrFunc
     * @return {?}
     */
    R3JitReflector.prototype.shallowAnnotations = /**
     * @param {?} typeOrFunc
     * @return {?}
     */
    function (typeOrFunc) { throw new Error('Not implemented.'); };
    /**
     * @param {?} typeOrFunc
     * @return {?}
     */
    R3JitReflector.prototype.tryAnnotations = /**
     * @param {?} typeOrFunc
     * @return {?}
     */
    function (typeOrFunc) { throw new Error('Not implemented.'); };
    /**
     * @param {?} typeOrFunc
     * @return {?}
     */
    R3JitReflector.prototype.propMetadata = /**
     * @param {?} typeOrFunc
     * @return {?}
     */
    function (typeOrFunc) { throw new Error('Not implemented.'); };
    /**
     * @param {?} type
     * @param {?} lcProperty
     * @return {?}
     */
    R3JitReflector.prototype.hasLifecycleHook = /**
     * @param {?} type
     * @param {?} lcProperty
     * @return {?}
     */
    function (type, lcProperty) { throw new Error('Not implemented.'); };
    /**
     * @param {?} typeOrFunc
     * @return {?}
     */
    R3JitReflector.prototype.guards = /**
     * @param {?} typeOrFunc
     * @return {?}
     */
    function (typeOrFunc) { throw new Error('Not implemented.'); };
    /**
     * @param {?} type
     * @param {?} cmpMetadata
     * @return {?}
     */
    R3JitReflector.prototype.componentModuleUrl = /**
     * @param {?} type
     * @param {?} cmpMetadata
     * @return {?}
     */
    function (type, cmpMetadata) { throw new Error('Not implemented.'); };
    return R3JitReflector;
}());
if (false) {
    /** @type {?} */
    R3JitReflector.prototype.context;
}
/**
 * JIT compiles an expression and returns the result of executing that expression.
 *
 * @param {?} def the definition which will be compiled and executed to get the value to patch
 * @param {?} context an object map of \@angular/core symbol names to symbols which will be available in
 * the context of the compiled expression
 * @param {?} sourceUrl a URL to use for the source map of the compiled expression
 * @param {?=} constantPool an optional `ConstantPool` which contains constants used in the expression
 * @return {?}
 */
export function jitExpression(def, context, sourceUrl, constantPool) {
    /** @type {?} */
    var statements = (constantPool !== undefined ? constantPool.statements : []).concat([
        new o.DeclareVarStmt('$def', def, undefined, [o.StmtModifier.Exported]),
    ]);
    /** @type {?} */
    var res = jitStatements(sourceUrl, statements, new R3JitReflector(context), false);
    return res['$def'];
}
//# sourceMappingURL=r3_jit.js.map