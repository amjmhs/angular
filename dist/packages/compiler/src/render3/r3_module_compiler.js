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
import { mapLiteral } from '../output/map_util';
import * as o from '../output/output_ast';
import { compileFactoryFunction } from './r3_factory';
import { Identifiers as R3 } from './r3_identifiers';
import { convertMetaToOutput, mapToMapExpression } from './util';
/**
 * @record
 */
export function R3NgModuleDef() { }
/** @type {?} */
R3NgModuleDef.prototype.expression;
/** @type {?} */
R3NgModuleDef.prototype.type;
/** @type {?} */
R3NgModuleDef.prototype.additionalStatements;
/**
 * Metadata required by the module compiler to generate a `ngModuleDef` for a type.
 * @record
 */
export function R3NgModuleMetadata() { }
/**
 * An expression representing the module type being compiled.
 * @type {?}
 */
R3NgModuleMetadata.prototype.type;
/**
 * An array of expressions representing the bootstrap components specified by the module.
 * @type {?}
 */
R3NgModuleMetadata.prototype.bootstrap;
/**
 * An array of expressions representing the directives and pipes declared by the module.
 * @type {?}
 */
R3NgModuleMetadata.prototype.declarations;
/**
 * An array of expressions representing the imports of the module.
 * @type {?}
 */
R3NgModuleMetadata.prototype.imports;
/**
 * An array of expressions representing the exports of the module.
 * @type {?}
 */
R3NgModuleMetadata.prototype.exports;
/**
 * Whether to emit the selector scope values (declarations, imports, exports) inline into the
 * module definition, or to generate additional statements which patch them on. Inline emission
 * does not allow components to be tree-shaken, but is useful for JIT mode.
 * @type {?}
 */
R3NgModuleMetadata.prototype.emitInline;
/**
 * Construct an `R3NgModuleDef` for the given `R3NgModuleMetadata`.
 * @param {?} meta
 * @return {?}
 */
export function compileNgModule(meta) {
    const { type: moduleType, bootstrap, declarations, imports, exports } = meta;
    /** @type {?} */
    const expression = o.importExpr(R3.defineNgModule).callFn([mapToMapExpression({
            type: moduleType,
            bootstrap: o.literalArr(bootstrap),
            declarations: o.literalArr(declarations),
            imports: o.literalArr(imports),
            exports: o.literalArr(exports),
        })]);
    /** @type {?} */
    const type = new o.ExpressionType(o.importExpr(R3.NgModuleDef, [
        new o.ExpressionType(moduleType), tupleTypeOf(declarations), tupleTypeOf(imports),
        tupleTypeOf(exports)
    ]));
    /** @type {?} */
    const additionalStatements = [];
    return { expression, type, additionalStatements };
}
/**
 * @record
 */
export function R3InjectorDef() { }
/** @type {?} */
R3InjectorDef.prototype.expression;
/** @type {?} */
R3InjectorDef.prototype.type;
/**
 * @record
 */
export function R3InjectorMetadata() { }
/** @type {?} */
R3InjectorMetadata.prototype.name;
/** @type {?} */
R3InjectorMetadata.prototype.type;
/** @type {?} */
R3InjectorMetadata.prototype.deps;
/** @type {?} */
R3InjectorMetadata.prototype.providers;
/** @type {?} */
R3InjectorMetadata.prototype.imports;
/**
 * @param {?} meta
 * @return {?}
 */
export function compileInjector(meta) {
    /** @type {?} */
    const expression = o.importExpr(R3.defineInjector).callFn([mapToMapExpression({
            factory: compileFactoryFunction({
                name: meta.name,
                fnOrClass: meta.type,
                deps: meta.deps,
                useNew: true,
                injectFn: R3.inject,
            }),
            providers: meta.providers,
            imports: meta.imports,
        })]);
    /** @type {?} */
    const type = new o.ExpressionType(o.importExpr(R3.InjectorDef, [new o.ExpressionType(meta.type)]));
    return { expression, type };
}
/**
 * @param {?} ctx
 * @param {?} ngModule
 * @param {?} injectableCompiler
 * @return {?}
 */
export function compileNgModuleFromRender2(ctx, ngModule, injectableCompiler) {
    /** @type {?} */
    const className = /** @type {?} */ ((identifierName(ngModule.type)));
    /** @type {?} */
    const rawImports = ngModule.rawImports ? [ngModule.rawImports] : [];
    /** @type {?} */
    const rawExports = ngModule.rawExports ? [ngModule.rawExports] : [];
    /** @type {?} */
    const injectorDefArg = mapLiteral({
        'factory': injectableCompiler.factoryFor({ type: ngModule.type, symbol: ngModule.type.reference }, ctx),
        'providers': convertMetaToOutput(ngModule.rawProviders, ctx),
        'imports': convertMetaToOutput([...rawImports, ...rawExports], ctx),
    });
    /** @type {?} */
    const injectorDef = o.importExpr(R3.defineInjector).callFn([injectorDefArg]);
    ctx.statements.push(new o.ClassStmt(className, null, /* fields */ [new o.ClassField('ngInjectorDef', /* type */ o.INFERRED_TYPE, /* modifiers */ [o.StmtModifier.Static], injectorDef)], /* getters */ [], /* constructorMethod */ new o.ClassMethod(null, [], []), /* methods */ []));
}
/**
 * @param {?} module
 * @return {?}
 */
function accessExportScope(module) {
    /** @type {?} */
    const selectorScope = new o.ReadPropExpr(module, 'ngModuleDef');
    return new o.ReadPropExpr(selectorScope, 'exported');
}
/**
 * @param {?} exp
 * @return {?}
 */
function tupleTypeOf(exp) {
    /** @type {?} */
    const types = exp.map(type => o.typeofExpr(type));
    return exp.length > 0 ? o.expressionType(o.literalArr(types)) : o.NONE_TYPE;
}
//# sourceMappingURL=r3_module_compiler.js.map