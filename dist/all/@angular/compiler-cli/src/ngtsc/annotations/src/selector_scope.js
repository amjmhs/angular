"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var metadata_1 = require("../../metadata");
var reflector_1 = require("../../metadata/src/reflector");
var util_1 = require("./util");
/**
 * Registry which records and correlates static analysis information of Angular types.
 *
 * Once a compilation unit's information is fed into the SelectorScopeRegistry, it can be asked to
 * produce transitive `CompilationScope`s for components.
 */
var SelectorScopeRegistry = /** @class */ (function () {
    function SelectorScopeRegistry(checker, reflector) {
        this.checker = checker;
        this.reflector = reflector;
        /**
         *  Map of modules declared in the current compilation unit to their (local) metadata.
         */
        this._moduleToData = new Map();
        /**
         * Map of modules to their cached `CompilationScope`s.
         */
        this._compilationScopeCache = new Map();
        /**
         * Map of components/directives to their selector.
         */
        this._directiveToSelector = new Map();
        /**
         * Map of pipes to their name.
         */
        this._pipeToName = new Map();
        /**
         * Map of components/directives/pipes to their module.
         */
        this._declararedTypeToModule = new Map();
    }
    /**
     * Register a module's metadata with the registry.
     */
    SelectorScopeRegistry.prototype.registerModule = function (node, data) {
        var _this = this;
        node = ts.getOriginalNode(node);
        if (this._moduleToData.has(node)) {
            throw new Error("Module already registered: " + reflector_1.reflectNameOfDeclaration(node));
        }
        this._moduleToData.set(node, data);
        // Register all of the module's declarations in the context map as belonging to this module.
        data.declarations.forEach(function (decl) {
            _this._declararedTypeToModule.set(ts.getOriginalNode(decl.node), node);
        });
    };
    /**
     * Register the selector of a component or directive with the registry.
     */
    SelectorScopeRegistry.prototype.registerSelector = function (node, selector) {
        node = ts.getOriginalNode(node);
        if (this._directiveToSelector.has(node)) {
            throw new Error("Selector already registered: " + reflector_1.reflectNameOfDeclaration(node) + " " + selector);
        }
        this._directiveToSelector.set(node, selector);
    };
    /**
     * Register the name of a pipe with the registry.
     */
    SelectorScopeRegistry.prototype.registerPipe = function (node, name) {
        node = ts.getOriginalNode(node);
        this._pipeToName.set(node, name);
    };
    /**
     * Produce the compilation scope of a component, which is determined by the module that declares
     * it.
     */
    SelectorScopeRegistry.prototype.lookupCompilationScope = function (node) {
        var _this = this;
        node = ts.getOriginalNode(node);
        // If the component has no associated module, then it has no compilation scope.
        if (!this._declararedTypeToModule.has(node)) {
            return null;
        }
        var module = this._declararedTypeToModule.get(node);
        // Compilation scope computation is somewhat expensive, so it's cached. Check the cache for
        // the module.
        if (this._compilationScopeCache.has(module)) {
            // The compilation scope was cached.
            var scope_1 = this._compilationScopeCache.get(module);
            // The scope as cached is in terms of References, not Expressions. Converting between them
            // requires knowledge of the context file (in this case, the component node's source file).
            return convertScopeToExpressions(scope_1, node.getSourceFile());
        }
        // This is the first time the scope for this module is being computed.
        var directives = new Map();
        var pipes = new Map();
        // Process the declaration scope of the module, and lookup the selector of every declared type.
        // The initial value of ngModuleImportedFrom is 'null' which signifies that the NgModule
        // was not imported from a .d.ts source.
        this.lookupScopes(module, /* ngModuleImportedFrom */ null).compilation.forEach(function (ref) {
            var node = ts.getOriginalNode(ref.node);
            // Either the node represents a directive or a pipe. Look for both.
            var selector = _this.lookupDirectiveSelector(node);
            // Only directives/components with selectors get added to the scope.
            if (selector != null) {
                directives.set(selector, ref);
                return;
            }
            var name = _this.lookupPipeName(node);
            if (name != null) {
                pipes.set(name, ref);
            }
        });
        var scope = { directives: directives, pipes: pipes };
        // Many components may be compiled in the same scope, so cache it.
        this._compilationScopeCache.set(node, scope);
        // Convert References to Expressions in the context of the component's source file.
        return convertScopeToExpressions(scope, node.getSourceFile());
    };
    /**
     * Lookup `SelectorScopes` for a given module.
     *
     * This function assumes that if the given module was imported from an absolute path
     * (`ngModuleImportedFrom`) then all of its declarations are exported at that same path, as well
     * as imports and exports from other modules that are relatively imported.
     */
    SelectorScopeRegistry.prototype.lookupScopes = function (node, ngModuleImportedFrom) {
        var _this = this;
        var data = null;
        // Either this module was analyzed directly, or has a precompiled ngModuleDef.
        if (this._moduleToData.has(node)) {
            // The module was analyzed before, and thus its data is available.
            data = this._moduleToData.get(node);
        }
        else {
            // The module wasn't analyzed before, and probably has a precompiled ngModuleDef with a type
            // annotation that specifies the needed metadata.
            if (ngModuleImportedFrom === null) {
                // TODO(alxhub): handle hand-compiled ngModuleDef in the current Program.
                throw new Error("Need to read .d.ts module but ngModuleImportedFrom is unspecified");
            }
            data = this._readMetadataFromCompiledClass(node, ngModuleImportedFrom);
            // Note that data here could still be null, if the class didn't have a precompiled
            // ngModuleDef.
        }
        if (data === null) {
            throw new Error("Module not registered: " + reflector_1.reflectNameOfDeclaration(node));
        }
        return {
            compilation: data.declarations.concat(flatten(data.imports.map(function (ref) {
                return _this.lookupScopes(ref.node, absoluteModuleName(ref)).exported;
            })), flatten(data.exports.filter(function (ref) { return _this._moduleToData.has(ref.node); })
                .map(function (ref) { return _this.lookupScopes(ref.node, absoluteModuleName(ref))
                .exported; }))),
            exported: flatten(data.exports.map(function (ref) {
                if (_this._moduleToData.has(ref.node)) {
                    return _this.lookupScopes(ref.node, absoluteModuleName(ref)).exported;
                }
                else {
                    return [ref];
                }
            })),
        };
    };
    /**
     * Lookup the selector of a component or directive class.
     *
     * Potentially this class is declared in a .d.ts file or otherwise has a manually created
     * ngComponentDef/ngDirectiveDef. In this case, the type metadata of that definition is read
     * to determine the selector.
     */
    SelectorScopeRegistry.prototype.lookupDirectiveSelector = function (node) {
        if (this._directiveToSelector.has(node)) {
            return this._directiveToSelector.get(node);
        }
        else {
            return this._readSelectorFromCompiledClass(node);
        }
    };
    SelectorScopeRegistry.prototype.lookupPipeName = function (node) {
        if (this._pipeToName.has(node)) {
            return this._pipeToName.get(node);
        }
        else {
            return this._readNameFromCompiledClass(node);
        }
    };
    /**
     * Read the metadata from a class that has already been compiled somehow (either it's in a .d.ts
     * file, or in a .ts file with a handwritten definition).
     *
     * @param clazz the class of interest
     * @param ngModuleImportedFrom module specifier of the import path to assume for all declarations
     * stemming from this module.
     */
    SelectorScopeRegistry.prototype._readMetadataFromCompiledClass = function (clazz, ngModuleImportedFrom) {
        // This operation is explicitly not memoized, as it depends on `ngModuleImportedFrom`.
        // TODO(alxhub): investigate caching of .d.ts module metadata.
        var ngModuleDef = this.reflector.getMembersOfClass(clazz).find(function (member) { return member.name === 'ngModuleDef' && member.isStatic; });
        if (ngModuleDef === undefined) {
            return null;
        }
        else if (
        // Validate that the shape of the ngModuleDef type is correct.
        ngModuleDef.type === null || !ts.isTypeReferenceNode(ngModuleDef.type) ||
            ngModuleDef.type.typeArguments === undefined ||
            ngModuleDef.type.typeArguments.length !== 4) {
            return null;
        }
        // Read the ModuleData out of the type arguments.
        var _a = ngModuleDef.type.typeArguments, _ = _a[0], declarationMetadata = _a[1], importMetadata = _a[2], exportMetadata = _a[3];
        return {
            declarations: this._extractReferencesFromType(declarationMetadata, ngModuleImportedFrom),
            exports: this._extractReferencesFromType(exportMetadata, ngModuleImportedFrom),
            imports: this._extractReferencesFromType(importMetadata, ngModuleImportedFrom),
        };
    };
    /**
     * Get the selector from type metadata for a class with a precompiled ngComponentDef or
     * ngDirectiveDef.
     */
    SelectorScopeRegistry.prototype._readSelectorFromCompiledClass = function (clazz) {
        var def = this.reflector.getMembersOfClass(clazz).find(function (field) {
            return field.isStatic && (field.name === 'ngComponentDef' || field.name === 'ngDirectiveDef');
        });
        if (def === undefined) {
            // No definition could be found.
            return null;
        }
        else if (def.type === null || !ts.isTypeReferenceNode(def.type) ||
            def.type.typeArguments === undefined || def.type.typeArguments.length !== 2) {
            // The type metadata was the wrong shape.
            return null;
        }
        var type = def.type.typeArguments[1];
        if (!ts.isLiteralTypeNode(type) || !ts.isStringLiteral(type.literal)) {
            // The type metadata was the wrong type.
            return null;
        }
        return type.literal.text;
    };
    /**
     * Get the selector from type metadata for a class with a precompiled ngComponentDef or
     * ngDirectiveDef.
     */
    SelectorScopeRegistry.prototype._readNameFromCompiledClass = function (clazz) {
        var def = this.reflector.getMembersOfClass(clazz).find(function (field) { return field.isStatic && field.name === 'ngPipeDef'; });
        if (def === undefined) {
            // No definition could be found.
            return null;
        }
        else if (def.type === null || !ts.isTypeReferenceNode(def.type) ||
            def.type.typeArguments === undefined || def.type.typeArguments.length !== 2) {
            // The type metadata was the wrong shape.
            return null;
        }
        var type = def.type.typeArguments[1];
        if (!ts.isLiteralTypeNode(type) || !ts.isStringLiteral(type.literal)) {
            // The type metadata was the wrong type.
            return null;
        }
        return type.literal.text;
    };
    /**
     * Process a `TypeNode` which is a tuple of references to other types, and return `Reference`s to
     * them.
     *
     * This operation assumes that these types should be imported from `ngModuleImportedFrom` unless
     * they themselves were imported from another absolute path.
     */
    SelectorScopeRegistry.prototype._extractReferencesFromType = function (def, ngModuleImportedFrom) {
        var _this = this;
        if (!ts.isTupleTypeNode(def)) {
            return [];
        }
        return def.elementTypes.map(function (element) {
            if (!ts.isTypeQueryNode(element)) {
                throw new Error("Expected TypeQueryNode");
            }
            var type = element.exprName;
            var _a = metadata_1.reflectTypeEntityToDeclaration(type, _this.checker), node = _a.node, from = _a.from;
            var moduleName = (from !== null && !from.startsWith('.') ? from : ngModuleImportedFrom);
            var clazz = node;
            var id = reflector_1.reflectIdentifierOfDeclaration(clazz);
            return new metadata_1.AbsoluteReference(node, id, moduleName, id.text);
        });
    };
    return SelectorScopeRegistry;
}());
exports.SelectorScopeRegistry = SelectorScopeRegistry;
function flatten(array) {
    return array.reduce(function (accum, subArray) {
        accum.push.apply(accum, subArray);
        return accum;
    }, []);
}
function absoluteModuleName(ref) {
    if (!(ref instanceof metadata_1.AbsoluteReference)) {
        return null;
    }
    return ref.moduleName;
}
function convertReferenceMap(map, context) {
    return new Map(Array.from(map.entries()).map(function (_a) {
        var selector = _a[0], ref = _a[1];
        return [selector, util_1.referenceToExpression(ref, context)];
    }));
}
function convertScopeToExpressions(scope, context) {
    var directives = convertReferenceMap(scope.directives, context);
    var pipes = convertReferenceMap(scope.pipes, context);
    return { directives: directives, pipes: pipes };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0b3Jfc2NvcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL2Fubm90YXRpb25zL3NyYy9zZWxlY3Rvcl9zY29wZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUdILCtCQUFpQztBQUdqQywyQ0FBNEY7QUFDNUYsMERBQXNHO0FBRXRHLCtCQUE2QztBQXVDN0M7Ozs7O0dBS0c7QUFDSDtJQTBCRSwrQkFBb0IsT0FBdUIsRUFBVSxTQUF5QjtRQUExRCxZQUFPLEdBQVAsT0FBTyxDQUFnQjtRQUFVLGNBQVMsR0FBVCxTQUFTLENBQWdCO1FBekI5RTs7V0FFRztRQUNLLGtCQUFhLEdBQUcsSUFBSSxHQUFHLEVBQThCLENBQUM7UUFFOUQ7O1dBRUc7UUFDSywyQkFBc0IsR0FBRyxJQUFJLEdBQUcsRUFBK0MsQ0FBQztRQUV4Rjs7V0FFRztRQUNLLHlCQUFvQixHQUFHLElBQUksR0FBRyxFQUEwQixDQUFDO1FBRWpFOztXQUVHO1FBQ0ssZ0JBQVcsR0FBRyxJQUFJLEdBQUcsRUFBMEIsQ0FBQztRQUV4RDs7V0FFRztRQUNLLDRCQUF1QixHQUFHLElBQUksR0FBRyxFQUFrQyxDQUFDO0lBRUssQ0FBQztJQUVsRjs7T0FFRztJQUNILDhDQUFjLEdBQWQsVUFBZSxJQUFvQixFQUFFLElBQWdCO1FBQXJELGlCQVlDO1FBWEMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFtQixDQUFDO1FBRWxELElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDaEMsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBOEIsb0NBQXdCLENBQUMsSUFBSSxDQUFHLENBQUMsQ0FBQztTQUNqRjtRQUNELElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxJ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