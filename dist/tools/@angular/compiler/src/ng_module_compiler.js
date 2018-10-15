"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var compile_metadata_1 = require("./compile_metadata");
var identifiers_1 = require("./identifiers");
var o = require("./output/output_ast");
var parse_util_1 = require("./parse_util");
var provider_analyzer_1 = require("./provider_analyzer");
var provider_compiler_1 = require("./view_compiler/provider_compiler");
var NgModuleCompileResult = /** @class */ (function () {
    function NgModuleCompileResult(ngModuleFactoryVar) {
        this.ngModuleFactoryVar = ngModuleFactoryVar;
    }
    return NgModuleCompileResult;
}());
exports.NgModuleCompileResult = NgModuleCompileResult;
var LOG_VAR = o.variable('_l');
var NgModuleCompiler = /** @class */ (function () {
    function NgModuleCompiler(reflector) {
        this.reflector = reflector;
    }
    NgModuleCompiler.prototype.compile = function (ctx, ngModuleMeta, extraProviders) {
        var sourceSpan = parse_util_1.typeSourceSpan('NgModule', ngModuleMeta.type);
        var entryComponentFactories = ngModuleMeta.transitiveModule.entryComponents;
        var bootstrapComponents = ngModuleMeta.bootstrapComponents;
        var providerParser = new provider_analyzer_1.NgModuleProviderAnalyzer(this.reflector, ngModuleMeta, extraProviders, sourceSpan);
        var providerDefs = [provider_compiler_1.componentFactoryResolverProviderDef(this.reflector, ctx, 0 /* None */, entryComponentFactories)]
            .concat(providerParser.parse().map(function (provider) { return provider_compiler_1.providerDef(ctx, provider); }))
            .map(function (_a) {
            var providerExpr = _a.providerExpr, depsExpr = _a.depsExpr, flags = _a.flags, tokenExpr = _a.tokenExpr;
            return o.importExpr(identifiers_1.Identifiers.moduleProviderDef).callFn([
                o.literal(flags), tokenExpr, providerExpr, depsExpr
            ]);
        });
        var ngModuleDef = o.importExpr(identifiers_1.Identifiers.moduleDef).callFn([o.literalArr(providerDefs)]);
        var ngModuleDefFactory = o.fn([new o.FnParam(LOG_VAR.name)], [new o.ReturnStatement(ngModuleDef)], o.INFERRED_TYPE);
        var ngModuleFactoryVar = compile_metadata_1.identifierName(ngModuleMeta.type) + "NgFactory";
        this._createNgModuleFactory(ctx, ngModuleMeta.type.reference, o.importExpr(identifiers_1.Identifiers.createModuleFactory).callFn([
            ctx.importExpr(ngModuleMeta.type.reference),
            o.literalArr(bootstrapComponents.map(function (id) { return ctx.importExpr(id.reference); })),
            ngModuleDefFactory
        ]));
        if (ngModuleMeta.id) {
            var id = typeof ngModuleMeta.id === 'string' ? o.literal(ngModuleMeta.id) :
                ctx.importExpr(ngModuleMeta.id);
            var registerFactoryStmt = o.importExpr(identifiers_1.Identifiers.RegisterModuleFactoryFn)
                .callFn([id, o.variable(ngModuleFactoryVar)])
                .toStmt();
            ctx.statements.push(registerFactoryStmt);
        }
        return new NgModuleCompileResult(ngModuleFactoryVar);
    };
    NgModuleCompiler.prototype.createStub = function (ctx, ngModuleReference) {
        this._createNgModuleFactory(ctx, ngModuleReference, o.NULL_EXPR);
    };
    NgModuleCompiler.prototype._createNgModuleFactory = function (ctx, reference, value) {
        var ngModuleFactoryVar = compile_metadata_1.identifierName({ reference: reference }) + "NgFactory";
        var ngModuleFactoryStmt = o.variable(ngModuleFactoryVar)
            .set(value)
            .toDeclStmt(o.importType(identifiers_1.Identifiers.NgModuleFactory, [o.expressionType(ctx.importExpr(reference))], [o.TypeModifier.Const]), [o.StmtModifier.Final, o.StmtModifier.Exported]);
        ctx.statements.push(ngModuleFactoryStmt);
    };
    return NgModuleCompiler;
}());
exports.NgModuleCompiler = NgModuleCompiler;
//# sourceMappingURL=ng_module_compiler.js.map