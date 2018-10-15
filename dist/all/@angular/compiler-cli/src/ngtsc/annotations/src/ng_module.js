"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var ts = require("typescript");
var metadata_1 = require("../../metadata");
var util_1 = require("./util");
/**
 * Compiles @NgModule annotations to ngModuleDef fields.
 *
 * TODO(alxhub): handle injector side of things as well.
 */
var NgModuleDecoratorHandler = /** @class */ (function () {
    function NgModuleDecoratorHandler(checker, reflector, scopeRegistry, isCore) {
        this.checker = checker;
        this.reflector = reflector;
        this.scopeRegistry = scopeRegistry;
        this.isCore = isCore;
    }
    NgModuleDecoratorHandler.prototype.detect = function (decorators) {
        var _this = this;
        return decorators.find(function (decorator) { return decorator.name === 'NgModule' && (_this.isCore || util_1.isAngularCore(decorator)); });
    };
    NgModuleDecoratorHandler.prototype.analyze = function (node, decorator) {
        var _this = this;
        if (decorator.args === null || decorator.args.length > 1) {
            throw new Error("Incorrect number of arguments to @NgModule decorator");
        }
        // @NgModule can be invoked without arguments. In case it is, pretend as if a blank object
        // literal was specified. This simplifies the code below.
        var meta = decorator.args.length === 1 ? util_1.unwrapExpression(decorator.args[0]) :
            ts.createObjectLiteral([]);
        if (!ts.isObjectLiteralExpression(meta)) {
            throw new Error("Decorator argument must be literal.");
        }
        var ngModule = metadata_1.reflectObjectLiteral(meta);
        if (ngModule.has('jit')) {
            // The only allowed value is true, so there's no need to expand further.
            return {};
        }
        // Extract the module declarations, imports, and exports.
        var declarations = [];
        if (ngModule.has('declarations')) {
            var declarationMeta = metadata_1.staticallyResolve(ngModule.get('declarations'), this.reflector, this.checker);
            declarations = resolveTypeList(declarationMeta, 'declarations');
        }
        var imports = [];
        if (ngModule.has('imports')) {
            var importsMeta = metadata_1.staticallyResolve(ngModule.get('imports'), this.reflector, this.checker, function (node) { return _this._extractModuleFromModuleWithProvidersFn(node); });
            imports = resolveTypeList(importsMeta, 'imports');
        }
        var exports = [];
        if (ngModule.has('exports')) {
            var exportsMeta = metadata_1.staticallyResolve(ngModule.get('exports'), this.reflector, this.checker, function (node) { return _this._extractModuleFromModuleWithProvidersFn(node); });
            exports = resolveTypeList(exportsMeta, 'exports');
        }
        // Register this module's information with the SelectorScopeRegistry. This ensures that during
        // the compile() phase, the module's metadata is available for selector scope computation.
        this.scopeRegistry.registerModule(node, { declarations: declarations, imports: imports, exports: exports });
        var context = node.getSourceFile();
        var ngModuleDef = {
            type: new compiler_1.WrappedNodeExpr(node.name),
            bootstrap: [],
            declarations: declarations.map(function (decl) { return util_1.referenceToExpression(decl, context); }),
            exports: exports.map(function (exp) { return util_1.referenceToExpression(exp, context); }),
            imports: imports.map(function (imp) { return util_1.referenceToExpression(imp, context); }),
            emitInline: false,
        };
        var providers = ngModule.has('providers') ?
            new compiler_1.WrappedNodeExpr(ngModule.get('providers')) :
            new compiler_1.LiteralArrayExpr([]);
        var injectorImports = [];
        if (ngModule.has('imports')) {
            injectorImports.push(new compiler_1.WrappedNodeExpr(ngModule.get('imports')));
        }
        if (ngModule.has('exports')) {
            injectorImports.push(new compiler_1.WrappedNodeExpr(ngModule.get('exports')));
        }
        var ngInjectorDef = {
            name: node.name.text,
            type: new compiler_1.WrappedNodeExpr(node.name),
            deps: util_1.getConstructorDependencies(node, this.reflector, this.isCore), providers: providers,
            imports: new compiler_1.LiteralArrayExpr(injectorImports),
        };
        return {
            analysis: {
                ngModuleDef: ngModuleDef, ngInjectorDef: ngInjectorDef,
            },
        };
    };
    NgModuleDecoratorHandler.prototype.compile = function (node, analysis) {
        var ngInjectorDef = compiler_1.compileInjector(analysis.ngInjectorDef);
        var ngModuleDef = compiler_1.compileNgModule(analysis.ngModuleDef);
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
    };
    /**
     * Given a `FunctionDeclaration` or `MethodDeclaration`, check if it is typed as a
     * `ModuleWithProviders` and return an expression referencing the module if available.
     */
    NgModuleDecoratorHandler.prototype._extractModuleFromModuleWithProvidersFn = function (node) {
        var type = node.type;
        // Examine the type of the function to see if it's a ModuleWithProviders reference.
        if (type === undefined || !ts.isTypeReferenceNode(type) || !ts.isIdentifier(type.typeName)) {
            return null;
        }
        // Look at the type itself to see where it comes from.
        var id = this.reflector.getImportOfIdentifier(type.typeName);
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
        var arg = type.typeArguments[0];
        // If the argument isn't an Identifier, bail.
        if (!ts.isTypeReferenceNode(arg) || !ts.isIdentifier(arg.typeName)) {
            return null;
        }
        return arg.typeName;
    };
    return NgModuleDecoratorHandler;
}());
exports.NgModuleDecoratorHandler = NgModuleDecoratorHandler;
/**
 * Compute a list of `Reference`s from a resolved metadata value.
 */
function resolveTypeList(resolvedList, name) {
    var refList = [];
    if (!Array.isArray(resolvedList)) {
        throw new Error("Expected array when reading property " + name);
    }
    resolvedList.forEach(function (entry, idx) {
        // Unwrap ModuleWithProviders for modules that are locally declared (and thus static resolution
        // was able to descend into the function and return an object literal, a Map).
        if (entry instanceof Map && entry.has('ngModule')) {
            entry = entry.get('ngModule');
        }
        if (Array.isArray(entry)) {
            // Recurse into nested arrays.
            refList.push.apply(refList, resolveTypeList(entry, name));
        }
        else if (entry instanceof metadata_1.Reference) {
            if (!entry.expressable) {
                throw new Error("Value at position " + idx + " in " + name + " array is not expressable");
            }
            else if (!ts.isClassDeclaration(entry.node)) {
                throw new Error("Value at position " + idx + " in " + name + " array is not a class declaration");
            }
            refList.push(entry);
        }
        else {
            // TODO(alxhub): expand ModuleWithProviders.
            throw new Error("Value at position " + idx + " in " + name + " array is not a reference: " + entry);
        }
    });
    return refList;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9hbm5vdGF0aW9ucy9zcmMvbmdfbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsOENBQStOO0FBQy9OLCtCQUFpQztBQUdqQywyQ0FBaUc7QUFJakcsK0JBQTBHO0FBTzFHOzs7O0dBSUc7QUFDSDtJQUNFLGtDQUNZLE9BQXVCLEVBQVUsU0FBeUIsRUFDMUQsYUFBb0MsRUFBVSxNQUFlO1FBRDdELFlBQU8sR0FBUCxPQUFPLENBQWdCO1FBQVUsY0FBUyxHQUFULFNBQVMsQ0FBZ0I7UUFDMUQsa0JBQWEsR0FBYixhQUFhLENBQXVCO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBUztJQUFHLENBQUM7SUFFN0UseUNBQU0sR0FBTixVQUFPLFVBQXVCO1FBQTlCLGlCQUdDO1FBRkMsT0FBTyxVQUFVLENBQUMsSUFBSSxDQUNsQixVQUFBLFNBQVMsSUFBSSxPQUFBLFNBQVMsQ0FBQyxJQUFJLEtBQUssVUFBVSxJQUFJLENBQUMsS0FBSSxDQUFDLE1BQU0sSUFBSSxvQkFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQTFFLENBQTBFLENBQUMsQ0FBQztJQUMvRixDQUFDO0lBRUQsMENBQU8sR0FBUCxVQUFRLElBQXlCLEVBQUUsU0FBb0I7UUFBdkQsaUJBaUZDO1FBaEZDLElBQUksU0FBUyxDQUFDLElBQUksS0FBSyxJQUFJLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3hELE1BQU0sSUFBSSxLQUFLLENBQUMsc0RBQXNELENBQUMsQ0FBQztTQUN6RTtRQUVELDBGQUEwRjtRQUMxRix5REFBeUQ7UUFDekQsSUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENB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