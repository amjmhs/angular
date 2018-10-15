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
//# sourceMappingURL=r3_module_compiler.js.map