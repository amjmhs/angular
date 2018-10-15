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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfbW9kdWxlX2NvbXBpbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL25nX21vZHVsZV9jb21waWxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHVEQUFvRztBQUdwRyw2Q0FBMEM7QUFDMUMsdUNBQXlDO0FBQ3pDLDJDQUE0QztBQUM1Qyx5REFBNkQ7QUFFN0QsdUVBQTJHO0FBRTNHO0lBQ0UsK0JBQW1CLGtCQUEwQjtRQUExQix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQVE7SUFBRyxDQUFDO0lBQ25ELDRCQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFGWSxzREFBcUI7QUFJbEMsSUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUVqQztJQUNFLDBCQUFvQixTQUEyQjtRQUEzQixjQUFTLEdBQVQsU0FBUyxDQUFrQjtJQUFHLENBQUM7SUFDbkQsa0NBQU8sR0FBUCxVQUNJLEdBQWtCLEVBQUUsWUFBcUMsRUFDekQsY0FBeUM7UUFDM0MsSUFBTSxVQUFVLEdBQUcsMkJBQWMsQ0FBQyxVQUFVLEVBQUUsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pFLElBQU0sdUJBQXVCLEdBQUcsWUFBWSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQztRQUM5RSxJQUFNLG1CQUFtQixHQUFHLFlBQVksQ0FBQyxtQkFBbUIsQ0FBQztRQUM3RCxJQUFNLGNBQWMsR0FDaEIsSUFBSSw0Q0FBd0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDM0YsSUFBTSxZQUFZLEdBQ2QsQ0FBQyx1REFBbUMsQ0FDL0IsSUFBSSxDQUFDLFNBQVMsRUFBRSxHQUFHLGdCQUFrQix1QkFBdUIsQ0FBQyxDQUFDO2FBQzlELE1BQU0sQ0FBQyxjQUFjLENB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