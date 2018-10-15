"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var compile_metadata_1 = require("../compile_metadata");
var map_util_1 = require("../output/map_util");
var o = require("../output/output_ast");
var r3_factory_1 = require("./r3_factory");
var r3_identifiers_1 = require("./r3_identifiers");
var util_1 = require("./util");
/**
 * Construct an `R3NgModuleDef` for the given `R3NgModuleMetadata`.
 */
function compileNgModule(meta) {
    var moduleType = meta.type, bootstrap = meta.bootstrap, declarations = meta.declarations, imports = meta.imports, exports = meta.exports;
    var expression = o.importExpr(r3_identifiers_1.Identifiers.defineNgModule).callFn([util_1.mapToMapExpression({
            type: moduleType,
            bootstrap: o.literalArr(bootstrap),
            declarations: o.literalArr(declarations),
            imports: o.literalArr(imports),
            exports: o.literalArr(exports),
        })]);
    var type = new o.ExpressionType(o.importExpr(r3_identifiers_1.Identifiers.NgModuleDef, [
        new o.ExpressionType(moduleType), tupleTypeOf(declarations), tupleTypeOf(imports),
        tupleTypeOf(exports)
    ]));
    var additionalStatements = [];
    return { expression: expression, type: type, additionalStatements: additionalStatements };
}
exports.compileNgModule = compileNgModule;
function compileInjector(meta) {
    var expression = o.importExpr(r3_identifiers_1.Identifiers.defineInjector).callFn([util_1.mapToMapExpression({
            factory: r3_factory_1.compileFactoryFunction({
                name: meta.name,
                fnOrClass: meta.type,
                deps: meta.deps,
                useNew: true,
                injectFn: r3_identifiers_1.Identifiers.inject,
            }),
            providers: meta.providers,
            imports: meta.imports,
        })]);
    var type = new o.ExpressionType(o.importExpr(r3_identifiers_1.Identifiers.InjectorDef, [new o.ExpressionType(meta.type)]));
    return { expression: expression, type: type };
}
exports.compileInjector = compileInjector;
// TODO(alxhub): integrate this with `compileNgModule`. Currently the two are separate operations.
function compileNgModuleFromRender2(ctx, ngModule, injectableCompiler) {
    var className = compile_metadata_1.identifierName(ngModule.type);
    var rawImports = ngModule.rawImports ? [ngModule.rawImports] : [];
    var rawExports = ngModule.rawExports ? [ngModule.rawExports] : [];
    var injectorDefArg = map_util_1.mapLiteral({
        'factory': injectableCompiler.factoryFor({ type: ngModule.type, symbol: ngModule.type.reference }, ctx),
        'providers': util_1.convertMetaToOutput(ngModule.rawProviders, ctx),
        'imports': util_1.convertMetaToOutput(rawImports.concat(rawExports), ctx),
    });
    var injectorDef = o.importExpr(r3_identifiers_1.Identifiers.defineInjector).callFn([injectorDefArg]);
    ctx.statements.push(new o.ClassStmt(
    /* name */ className, 
    /* parent */ null, 
    /* fields */ [new o.ClassField(
        /* name */ 'ngInjectorDef', 
        /* type */ o.INFERRED_TYPE, 
        /* modifiers */ [o.StmtModifier.Static], 
        /* initializer */ injectorDef)], 
    /* getters */ [], 
    /* constructorMethod */ new o.ClassMethod(null, [], []), 
    /* methods */ []));
}
exports.compileNgModuleFromRender2 = compileNgModuleFromRender2;
function accessExportScope(module) {
    var selectorScope = new o.ReadPropExpr(module, 'ngModuleDef');
    return new o.ReadPropExpr(selectorScope, 'exported');
}
function tupleTypeOf(exp) {
    var types = exp.map(function (type) { return o.typeofExpr(type); });
    return exp.length > 0 ? o.expressionType(o.literalArr(types)) : o.NONE_TYPE;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicjNfbW9kdWxlX2NvbXBpbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL3JlbmRlcjMvcjNfbW9kdWxlX2NvbXBpbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBR0gsd0RBQWlGO0FBRWpGLCtDQUE4QztBQUM5Qyx3Q0FBMEM7QUFHMUMsMkNBQTBFO0FBQzFFLG1EQUFtRDtBQUNuRCwrQkFBK0Q7QUE2Qy9EOztHQUVHO0FBQ0gseUJBQWdDLElBQXdCO0lBQy9DLElBQUEsc0JBQWdCLEVBQUUsMEJBQVMsRUFBRSxnQ0FBWSxFQUFFLHNCQUFPLEVBQUUsc0JBQU8sQ0FBUztJQUMzRSxJQUFNLFVBQVUsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLDRCQUFFLENBQUMsY0FBYyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMseUJBQWtCLENBQUM7WUFDNUUsSUFBSSxFQUFFLFVBQVU7WUFDaEIsU0FBUyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDO1lBQ2xDLFlBQVksRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQztZQUN4QyxPQUFPLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7WUFDOUIsT0FBTyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO1NBQy9CLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFTCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyw0QkFBRSxDQUFDLFdBQVcsRUFBRTtRQUM3RCxJQUFJLENBQUMsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLEVBQUUsV0FBVyxDQUFDLFlBQVksQ0FBQyxFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUM7UUFDakYsV0FBVyxDQUFDLE9BQU8sQ0FBQztLQUNyQixDQUFDLENB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