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
import { identifierName } from './compile_metadata';
import { Identifiers } from './identifiers';
import * as o from './output/output_ast';
import { typeSourceSpan } from './parse_util';
import { NgModuleProviderAnalyzer } from './provider_analyzer';
import { componentFactoryResolverProviderDef, providerDef } from './view_compiler/provider_compiler';
export class NgModuleCompileResult {
    /**
     * @param {?} ngModuleFactoryVar
     */
    constructor(ngModuleFactoryVar) {
        this.ngModuleFactoryVar = ngModuleFactoryVar;
    }
}
if (false) {
    /** @type {?} */
    NgModuleCompileResult.prototype.ngModuleFactoryVar;
}
/** @type {?} */
const LOG_VAR = o.variable('_l');
export class NgModuleCompiler {
    /**
     * @param {?} reflector
     */
    constructor(reflector) {
        this.reflector = reflector;
    }
    /**
     * @param {?} ctx
     * @param {?} ngModuleMeta
     * @param {?} extraProviders
     * @return {?}
     */
    compile(ctx, ngModuleMeta, extraProviders) {
        /** @type {?} */
        const sourceSpan = typeSourceSpan('NgModule', ngModuleMeta.type);
        /** @type {?} */
        const entryComponentFactories = ngModuleMeta.transitiveModule.entryComponents;
        /** @type {?} */
        const bootstrapComponents = ngModuleMeta.bootstrapComponents;
        /** @type {?} */
        const providerParser = new NgModuleProviderAnalyzer(this.reflector, ngModuleMeta, extraProviders, sourceSpan);
        /** @type {?} */
        const providerDefs = [componentFactoryResolverProviderDef(this.reflector, ctx, 0 /* None */, entryComponentFactories)]
            .concat(providerParser.parse().map((provider) => providerDef(ctx, provider)))
            .map(({ providerExpr, depsExpr, flags, tokenExpr }) => {
            return o.importExpr(Identifiers.moduleProviderDef).callFn([
                o.literal(flags), tokenExpr, providerExpr, depsExpr
            ]);
        });
        /** @type {?} */
        const ngModuleDef = o.importExpr(Identifiers.moduleDef).callFn([o.literalArr(providerDefs)]);
        /** @type {?} */
        const ngModuleDefFactory = o.fn([new o.FnParam(/** @type {?} */ ((LOG_VAR.name)))], [new o.ReturnStatement(ngModuleDef)], o.INFERRED_TYPE);
        /** @type {?} */
        const ngModuleFactoryVar = `${identifierName(ngModuleMeta.type)}NgFactory`;
        this._createNgModuleFactory(ctx, ngModuleMeta.type.reference, o.importExpr(Identifiers.createModuleFactory).callFn([
            ctx.importExpr(ngModuleMeta.type.reference),
            o.literalArr(bootstrapComponents.map(id => ctx.importExpr(id.reference))),
            ngModuleDefFactory
        ]));
        if (ngModuleMeta.id) {
            /** @type {?} */
            const id = typeof ngModuleMeta.id === 'string' ? o.literal(ngModuleMeta.id) :
                ctx.importExpr(ngModuleMeta.id);
            /** @type {?} */
            const registerFactoryStmt = o.importExpr(Identifiers.RegisterModuleFactoryFn)
                .callFn([id, o.variable(ngModuleFactoryVar)])
                .toStmt();
            ctx.statements.push(registerFactoryStmt);
        }
        return new NgModuleCompileResult(ngModuleFactoryVar);
    }
    /**
     * @param {?} ctx
     * @param {?} ngModuleReference
     * @return {?}
     */
    createStub(ctx, ngModuleReference) {
        this._createNgModuleFactory(ctx, ngModuleReference, o.NULL_EXPR);
    }
    /**
     * @param {?} ctx
     * @param {?} reference
     * @param {?} value
     * @return {?}
     */
    _createNgModuleFactory(ctx, reference, value) {
        /** @type {?} */
        const ngModuleFactoryVar = `${identifierName({ reference: reference })}NgFactory`;
        /** @type {?} */
        const ngModuleFactoryStmt = o.variable(ngModuleFactoryVar)
            .set(value)
            .toDeclStmt(o.importType(Identifiers.NgModuleFactory, [/** @type {?} */ ((o.expressionType(ctx.importExpr(reference))))], [o.TypeModifier.Const]), [o.StmtModifier.Final, o.StmtModifier.Exported]);
        ctx.statements.push(ngModuleFactoryStmt);
    }
}
if (false) {
    /** @type {?} */
    NgModuleCompiler.prototype.reflector;
}
//# sourceMappingURL=ng_module_compiler.js.map