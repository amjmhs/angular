"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const compiler_1 = require("@angular/compiler");
const ts = require("typescript");
const metadata_1 = require("../../metadata");
const util_1 = require("./util");
/**
 * Compiles @NgModule annotations to ngModuleDef fields.
 *
 * TODO(alxhub): handle injector side of things as well.
 */
class NgModuleDecoratorHandler {
    constructor(checker, reflector, scopeRegistry, isCore) {
        this.checker = checker;
        this.reflector = reflector;
        this.scopeRegistry = scopeRegistry;
        this.isCore = isCore;
    }
    detect(decorators) {
        return decorators.find(decorator => decorator.name === 'NgModule' && (this.isCore || util_1.isAngularCore(decorator)));
    }
    analyze(node, decorator) {
        if (decorator.args === null || decorator.args.length > 1) {
            throw new Error(`Incorrect number of arguments to @NgModule decorator`);
        }
        // @NgModule can be invoked without arguments. In case it is, pretend as if a blank object
        // literal was specified. This simplifies the code below.
        const meta = decorator.args.length === 1 ? util_1.unwrapExpression(decorator.args[0]) :
            ts.createObjectLiteral([]);
        if (!ts.isObjectLiteralExpression(meta)) {
            throw new Error(`Decorator argument must be literal.`);
        }
        const ngModule = metadata_1.reflectObjectLiteral(meta);
        if (ngModule.has('jit')) {
            // The only allowed value is true, so there's no need to expand further.
            return {};
        }
        // Extract the module declarations, imports, and exports.
        let declarations = [];
        if (ngModule.has('declarations')) {
            const declarationMeta = metadata_1.staticallyResolve(ngModule.get('declarations'), this.reflector, this.checker);
            declarations = resolveTypeList(declarationMeta, 'declarations');
        }
        let imports = [];
        if (ngModule.has('imports')) {
            const importsMeta = metadata_1.staticallyResolve(ngModule.get('imports'), this.reflector, this.checker, node => this._extractModuleFromModuleWithProvidersFn(node));
            imports = resolveTypeList(importsMeta, 'imports');
        }
        let exports = [];
        if (ngModule.has('exports')) {
            const exportsMeta = metadata_1.staticallyResolve(ngModule.get('exports'), this.reflector, this.checker, node => this._extractModuleFromModuleWithProvidersFn(node));
            exports = resolveTypeList(exportsMeta, 'exports');
        }
        // Register this module's information with the SelectorScopeRegistry. This ensures that during
        // the compile() phase, the module's metadata is available for selector scope computation.
        this.scopeRegistry.registerModule(node, { declarations, imports, exports });
        const context = node.getSourceFile();
        const ngModuleDef = {
            type: new compiler_1.WrappedNodeExpr(node.name),
            bootstrap: [],
            declarations: declarations.map(decl => util_1.referenceToExpression(decl, context)),
            exports: exports.map(exp => util_1.referenceToExpression(exp, context)),
            imports: imports.map(imp => util_1.referenceToExpression(imp, context)),
            emitInline: false,
        };
        const providers = ngModule.has('providers') ?
            new compiler_1.WrappedNodeExpr(ngModule.get('providers')) :
            new compiler_1.LiteralArrayExpr([]);
        const injectorImports = [];
        if (ngModule.has('imports')) {
            injectorImports.push(new compiler_1.WrappedNodeExpr(ngModule.get('imports')));
        }
        if (ngModule.has('exports')) {
            injectorImports.push(new compiler_1.WrappedNodeExpr(ngModule.get('exports')));
        }
        const ngInjectorDef = {
            name: node.name.text,
            type: new compiler_1.WrappedNodeExpr(node.name),
            deps: util_1.getConstructorDependencies(node, this.reflector, this.isCore), providers,
            imports: new compiler_1.LiteralArrayExpr(injectorImports),
        };
        return {
            analysis: {
                ngModuleDef, ngInjectorDef,
            },
        };
    }
    compile(node, analysis) {
        const ngInjectorDef = compiler_1.compileInjector(analysis.ngInjectorDef);
        const ngModuleDef = compiler_1.compileNgModule(analysis.ngModuleDef);
        return [
            {
                name: 'ngModuleDef',
                initializer: ngModuleDef.expression,
                statements: [],
                type: ngModuleDef.type,
            },
            {
                name: 'ngInjectorDef',
                initializer: ngInjectorDef.expression,
                statements: [],
                type: ngInjectorDef.type,
            },
        ];
    }
    /**
     * Given a `FunctionDeclaration` or `MethodDeclaration`, check if it is typed as a
     * `ModuleWithProviders` and return an expression referencing the module if available.
     */
    _extractModuleFromModuleWithProvidersFn(node) {
        const type = node.type;
        // Examine the type of the function to see if it's a ModuleWithProviders reference.
        if (type === undefined || !ts.isTypeReferenceNode(type) || !ts.isIdentifier(type.typeName)) {
            return null;
        }
        // Look at the type itself to see where it comes from.
        const id = this.reflector.getImportOfIdentifier(type.typeName);
        // If it's not named ModuleWithProviders, bail.
        if (id === null || id.name !== 'ModuleWithProviders') {
            return null;
        }
        // If it's not from @angular/core, bail.
        if (!this.isCore && id.from !== '@angular/core') {
            return null;
        }
        // If there's no type parameter specified, bail.
        if (type.typeArguments === undefined || type.typeArguments.length !== 1) {
            return null;
        }
        const arg = type.typeArguments[0];
        // If the argument isn't an Identifier, bail.
        if (!ts.isTypeReferenceNode(arg) || !ts.isIdentifier(arg.typeName)) {
            return null;
        }
        return arg.typeName;
    }
}
exports.NgModuleDecoratorHandler = NgModuleDecoratorHandler;
/**
 * Compute a list of `Reference`s from a resolved metadata value.
 */
function resolveTypeList(resolvedList, name) {
    const refList = [];
    if (!Array.isArray(resolvedList)) {
        throw new Error(`Expected array when reading property ${name}`);
    }
    resolvedList.forEach((entry, idx) => {
        // Unwrap ModuleWithProviders for modules that are locally declared (and thus static resolution
        // was able to descend into the function and return an object literal, a Map).
        if (entry instanceof Map && entry.has('ngModule')) {
            entry = entry.get('ngModule');
        }
        if (Array.isArray(entry)) {
            // Recurse into nested arrays.
            refList.push(...resolveTypeList(entry, name));
        }
        else if (entry instanceof metadata_1.Reference) {
            if (!entry.expressable) {
                throw new Error(`Value at position ${idx} in ${name} array is not expressable`);
            }
            else if (!ts.isClassDeclaration(entry.node)) {
                throw new Error(`Value at position ${idx} in ${name} array is not a class declaration`);
            }
            refList.push(entry);
        }
        else {
            // TODO(alxhub): expand ModuleWithProviders.
            throw new Error(`Value at position ${idx} in ${name} array is not a reference: ${entry}`);
        }
    });
    return refList;
}
//# sourceMappingURL=ng_module.js.map