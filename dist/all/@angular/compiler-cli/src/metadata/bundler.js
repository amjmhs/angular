"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var path = require("path");
var ts = require("typescript");
var collector_1 = require("../metadata/collector");
var schema_1 = require("../metadata/schema");
// The character set used to produce private names.
var PRIVATE_NAME_CHARS = 'abcdefghijklmnopqrstuvwxyz';
var MetadataBundler = /** @class */ (function () {
    function MetadataBundler(root, importAs, host, privateSymbolPrefix) {
        this.root = root;
        this.importAs = importAs;
        this.host = host;
        this.symbolMap = new Map();
        this.metadataCache = new Map();
        this.exports = new Map();
        this.rootModule = "./" + path.basename(root);
        this.privateSymbolPrefix = (privateSymbolPrefix || '').replace(/\W/g, '_');
    }
    MetadataBundler.prototype.getMetadataBundle = function () {
        // Export the root module. This also collects the transitive closure of all values referenced by
        // the exports.
        var exportedSymbols = this.exportAll(this.rootModule);
        this.canonicalizeSymbols(exportedSymbols);
        // TODO: exports? e.g. a module re-exports a symbol from another bundle
        var metadata = this.getEntries(exportedSymbols);
        var privates = Array.from(this.symbolMap.values())
            .filter(function (s) { return s.referenced && s.isPrivate; })
            .map(function (s) { return ({
            privateName: s.privateName,
            name: s.declaration.name,
            module: s.declaration.module
        }); });
        var origins = Array.from(this.symbolMap.values())
            .filter(function (s) { return s.referenced && !s.reexport; })
            .reduce(function (p, s) {
            p[s.isPrivate ? s.privateName : s.name] = s.declaration.module;
            return p;
        }, {});
        var exports = this.getReExports(exportedSymbols);
        return {
            metadata: {
                __symbolic: 'module',
                version: schema_1.METADATA_VERSION,
                exports: exports.length ? exports : undefined, metadata: metadata, origins: origins,
                importAs: this.importAs
            },
            privates: privates
        };
    };
    MetadataBundler.resolveModule = function (importName, from) {
        return resolveModule(importName, from);
    };
    MetadataBundler.prototype.getMetadata = function (moduleName) {
        var result = this.metadataCache.get(moduleName);
        if (!result) {
            if (moduleName.startsWith('.')) {
                var fullModuleName = resolveModule(moduleName, this.root);
                result = this.host.getMetadataFor(fullModuleName, this.root);
            }
            this.metadataCache.set(moduleName, result);
        }
        return result;
    };
    MetadataBundler.prototype.exportAll = function (moduleName) {
        var _this = this;
        var module = this.getMetadata(moduleName);
        var result = this.exports.get(moduleName);
        if (result) {
            return result;
        }
        result = [];
        var exportSymbol = function (exportedSymbol, exportAs) {
            var symbol = _this.symbolOf(moduleName, exportAs);
            result.push(symbol);
            exportedSymbol.reexportedAs = symbol;
            symbol.exports = exportedSymbol;
        };
        // Export all the symbols defined in this module.
        if (module && module.metadata) {
            for (var key in module.metadata) {
                var data_1 = module.metadata[key];
                if (schema_1.isMetadataImportedSymbolReferenceExpression(data_1)) {
                    // This is a re-export of an imported symbol. Record this as a re-export.
                    var exportFrom = resolveModule(data_1.module, moduleName);
                    this.exportAll(exportFrom);
                    var symbol = this.symbolOf(exportFrom, data_1.name);
                    exportSymbol(symbol, key);
                }
                else {
                    // Record that this symbol is exported by this module.
                    result.push(this.symbolOf(moduleName, key));
                }
            }
        }
        // Export all the re-exports from this module
        if (module && module.exports) {
            for (var _i = 0, _a = module.exports; _i < _a.length; _i++) {
                var exportDeclaration = _a[_i];
                var exportFrom = resolveModule(exportDeclaration.from, moduleName);
                // Record all the exports from the module even if we don't use it directly.
                var exportedSymbols = this.exportAll(exportFrom);
                if (exportDeclaration.export) {
                    // Re-export all the named exports from a module.
                    for (var _b = 0, _c = exportDeclaration.export; _b < _c.length; _b++) {
                        var exportItem = _c[_b];
                        var name_1 = typeof exportItem == 'string' ? exportItem : exportItem.name;
                        var exportAs = typeof exportItem == 'string' ? exportItem : exportItem.as;
                        var symbol = this.symbolOf(exportFrom, name_1);
                        if (exportedSymbols && exportedSymbols.length == 1 && exportedSymbols[0].reexport &&
                            exportedSymbols[0].name == '*') {
                            // This is a named export from a module we have no metadata about. Record the named
                            // export as a re-export.
                            symbol.reexport = true;
                        }
                        exportSymbol(this.symbolOf(exportFrom, name_1), exportAs);
                    }
                }
                else {
                    // Re-export all the symbols from the module
                    var exportedSymbols_2 = this.exportAll(exportFrom);
                    for (var _d = 0, exportedSymbols_1 = exportedSymbols_2; _d < exportedSymbols_1.length; _d++) {
                        var exportedSymbol = exportedSymbols_1[_d];
                        var name_2 = exportedSymbol.name;
                        exportSymbol(exportedSymbol, name_2);
                    }
                }
            }
        }
        if (!module) {
            // If no metadata is found for this import then it is considered external to the
            // library and should be recorded as a re-export in the final metadata if it is
            // eventually re-exported.
            var symbol = this.symbolOf(moduleName, '*');
            symbol.reexport = true;
            result.push(symbol);
        }
        this.exports.set(moduleName, result);
        return result;
    };
    /**
     * Fill in the canonicalSymbol which is the symbol that should be imported by factories.
     * The canonical symbol is the one exported by the index file for the bundle or definition
     * symbol for private symbols that are not exported by bundle index.
     */
    MetadataBundler.prototype.canonicalizeSymbols = function (exportedSymbols) {
        var symbols = Array.from(this.symbolMap.values());
        this.exported = new Set(exportedSymbols);
        symbols.forEach(this.canonicalizeSymbol, this);
    };
    MetadataBundler.prototype.canonicalizeSymbol = function (symbol) {
        var rootExport = getRootExport(symbol);
        var declaration = getSymbolDeclaration(symbol);
        var isPrivate = !this.exported.has(rootExport);
        var canonicalSymbol = isPrivate ? declaration : rootExport;
        symbol.isPrivate = isPrivate;
        symbol.declaration = declaration;
        symbol.canonicalSymbol = canonicalSymbol;
        symbol.reexport = declaration.reexport;
    };
    MetadataBundler.prototype.getEntries = function (exportedSymbols) {
        var _this = this;
        var result = {};
        var exportedNames = new Set(exportedSymbols.map(function (s) { return s.name; }));
        var privateName = 0;
        function newPrivateName(prefix) {
            while (true) {
                var digits = [];
                var index = privateName++;
                var base = PRIVATE_NAME_CHARS;
                while (!digits.length || index > 0) {
                    digits.unshift(base[index % base.length]);
                    index = Math.floor(index / base.length);
                }
                var result_1 = "\u0275" + prefix + digits.join('');
                if (!exportedNames.has(result_1))
                    return result_1;
            }
        }
        exportedSymbols.forEach(function (symbol) { return _this.convertSymbol(symbol); });
        var symbolsMap = new Map();
        Array.from(this.symbolMap.values()).forEach(function (symbol) {
            if (symbol.referenced && !symbol.reexport) {
                var name_3 = symbol.name;
                var identifier = symbol.declaration.module + ":" + symbol.declaration.name;
                if (symbol.isPrivate && !symbol.privateName) {
                    name_3 = newPrivateName(_this.privateSymbolPrefix);
                    symbol.privateName = name_3;
                }
                if (symbolsMap.has(identifier)) {
                    var names = symbolsMap.get(identifier);
                    names.push(name_3);
                }
                else {
                    symbolsMap.set(identifier, [name_3]);
                }
                result[name_3] = symbol.value;
            }
        });
        // check for duplicated entries
        symbolsMap.forEach(function (names, identifier) {
            if (names.length > 1) {
                var _a = identifier.split(':'), module_1 = _a[0], declaredName = _a[1];
                // prefer the export that uses the declared name (if any)
                var reference_1 = names.indexOf(declaredName);
                if (reference_1 === -1) {
                    reference_1 = 0;
                }
                // keep one entry and replace the others by references
                names.forEach(function (name, i) {
                    if (i !== reference_1) {
                        result[name] = { __symbolic: 'reference', name: names[reference_1] };
                    }
                });
            }
        });
        return result;
    };
    MetadataBundler.prototype.getReExports = function (exportedSymbols) {
        var modules = new Map();
        var exportAlls = new Set();
        for (var _i = 0, exportedSymbols_3 = exportedSymbols; _i < exportedSymbols_3.length; _i++) {
            var symbol = exportedSymbols_3[_i];
            if (symbol.reexport) {
                // symbol.declaration is guaranteed to be defined during the phase this method is called.
                var declaration = symbol.declaration;
                var module_2 = declaration.module;
                if (declaration.name == '*') {
                    // Reexport all the symbols.
                    exportAlls.add(declaration.module);
                }
                else {
                    // Re-export the symbol as the exported name.
                    var entry = modules.get(module_2);
                    if (!entry) {
                        entry = [];
                        modules.set(module_2, entry);
                    }
                    var as = symbol.name;
                    var name_4 = declaration.name;
                    entry.push({ name: name_4, as: as });
                }
            }
        }
        return Array.from(exportAlls.values()).map(function (from) { return ({ from: from }); }).concat(Array.from(modules.entries()).map(function (_a) {
            var from = _a[0], exports = _a[1];
            return ({ export: exports, from: from });
        }));
    };
    MetadataBundler.prototype.convertSymbol = function (symbol) {
        // canonicalSymbol is ensured to be defined before this is called.
        var canonicalSymbol = symbol.canonicalSymbol;
        if (!canonicalSymbol.referenced) {
            canonicalSymbol.referenced = true;
            // declaration is ensured to be definded before this method is called.
            var declaration = canonicalSymbol.declaration;
            var module_3 = this.getMetadata(declaration.module);
            if (module_3) {
                var value = module_3.metadata[declaration.name];
                if (value && !declaration.name.startsWith('___')) {
                    canonicalSymbol.value = this.convertEntry(declaration.module, value);
                }
            }
        }
    };
    MetadataBundler.prototype.convertEntry = function (moduleName, value) {
        if (schema_1.isClassMetadata(value)) {
            return this.convertClass(moduleName, value);
        }
        if (schema_1.isFunctionMetadata(value)) {
            return this.convertFunction(moduleName, value);
        }
        if (schema_1.isInterfaceMetadata(value)) {
            return value;
        }
        return this.convertValue(moduleName, value);
    };
    MetadataBundler.prototype.convertClass = function (moduleName, value) {
        var _this = this;
        return {
            __symbolic: 'class',
            arity: value.arity,
            extends: this.convertExpression(moduleName, value.extends),
            decorators: value.decorators && value.decorators.map(function (d) { return _this.convertExpression(moduleName, d); }),
            members: this.convertMembers(moduleName, value.members),
            statics: value.statics && this.convertStatics(moduleName, value.statics)
        };
    };
    MetadataBundler.prototype.convertMembers = function (moduleName, members) {
        var _this = this;
        var result = {};
        for (var name_5 in members) {
            var value = members[name_5];
            result[name_5] = value.map(function (v) { return _this.convertMember(moduleName, v); });
        }
        return result;
    };
    MetadataBundler.prototype.convertMember = function (moduleName, member) {
        var _this = this;
        var result = { __symbolic: member.__symbolic };
        result.decorators =
            member.decorators && member.decorators.map(function (d) { return _this.convertExpression(moduleName, d); });
        if (schema_1.isMethodMetadata(member)) {
            result.parameterDecorators = member.parameterDecorators &&
                member.parameterDecorators.map(function (d) { return d && d.map(function (p) { return _this.convertExpression(moduleName, p); }); });
            if (schema_1.isConstructorMetadata(member)) {
                if (member.parameters) {
                    result.parameters =
                        member.parameters.map(function (p) { return _this.convertExpression(moduleName, p); });
                }
            }
        }
        return result;
    };
    MetadataBundler.prototype.convertStatics = function (moduleName, statics) {
        var result = {};
        for (var key in statics) {
            var value = statics[key];
            result[key] = schema_1.isFunctionMetadata(value) ? this.convertFunction(moduleName, value) : value;
        }
        return result;
    };
    MetadataBundler.prototype.convertFunction = function (moduleName, value) {
        var _this = this;
        return {
            __symbolic: 'function',
            parameters: value.parameters,
            defaults: value.defaults && value.defaults.map(function (v) { return _this.convertValue(moduleName, v); }),
            value: this.convertValue(moduleName, value.value)
        };
    };
    MetadataBundler.prototype.convertValue = function (moduleName, value) {
        var _this = this;
        if (isPrimitive(value)) {
            return value;
        }
        if (schema_1.isMetadataError(value)) {
            return this.convertError(moduleName, value);
        }
        if (schema_1.isMetadataSymbolicExpression(value)) {
            return this.convertExpression(moduleName, value);
        }
        if (Array.isArray(value)) {
            return value.map(function (v) { return _this.convertValue(moduleName, v); });
        }
        // Otherwise it is a metadata object.
        var object = value;
        var result = {};
        for (var key in object) {
            result[key] = this.convertValue(moduleName, object[key]);
        }
        return result;
    };
    MetadataBundler.prototype.convertExpression = function (moduleName, value) {
        if (value) {
            switch (value.__symbolic) {
                case 'error':
                    return this.convertError(moduleName, value);
                case 'reference':
                    return this.convertReference(moduleName, value);
                default:
                    return this.convertExpressionNode(moduleName, value);
            }
        }
        return value;
    };
    MetadataBundler.prototype.convertError = function (module, value) {
        return {
            __symbolic: 'error',
            message: value.message,
            line: value.line,
            character: value.character,
            context: value.context, module: module
        };
    };
    MetadataBundler.prototype.convertReference = function (moduleName, value) {
        var _this = this;
        var createReference = function (symbol) {
            var declaration = symbol.declaration;
            if (declaration.module.startsWith('.')) {
                // Reference to a symbol defined in the module. Ensure it is converted then return a
                // references to the final symbol.
                _this.convertSymbol(symbol);
                return {
                    __symbolic: 'reference',
                    get name() {
                        // Resolved lazily because private names are assigned late.
                        var canonicalSymbol = symbol.canonicalSymbol;
                        if (canonicalSymbol.isPrivate == null) {
                            throw Error('Invalid state: isPrivate was not initialized');
                        }
                        return canonicalSymbol.isPrivate ? canonicalSymbol.privateName : canonicalSymbol.name;
                    }
                };
            }
            else {
                // The symbol was a re-exported symbol from another module. Return a reference to the
                // original imported symbol.
                return { __symbolic: 'reference', name: declaration.name, module: declaration.module };
            }
        };
        if (schema_1.isMetadataGlobalReferenceExpression(value)) {
            var metadata = this.getMetadata(moduleName);
            if (metadata && metadata.metadata && metadata.metadata[value.name]) {
                // Reference to a symbol defined in the module
                return createReference(this.canonicalSymbolOf(moduleName, value.name));
            }
            // If a reference has arguments, the arguments need to be converted.
            if (value.arguments) {
                return {
                    __symbolic: 'reference',
                    name: value.name,
                    arguments: value.arguments.map(function (a) { return _this.convertValue(moduleName, a); })
                };
            }
            // Global references without arguments (such as to Math or JSON) are unmodified.
            return value;
        }
        if (schema_1.isMetadataImportedSymbolReferenceExpression(value)) {
            // References to imported symbols are separated into two, references to bundled modules and
            // references to modules external to the bundle. If the module reference is relative it is
            // assumed to be in the bundle. If it is Global it is assumed to be outside the bundle.
            // References to symbols outside the bundle are left unmodified. References to symbol inside
            // the bundle need to be converted to a bundle import reference reachable from the bundle
            // index.
            if (value.module.startsWith('.')) {
                // Reference is to a symbol defined inside the module. Convert the reference to a reference
                // to the canonical symbol.
                var referencedModule = resolveModule(value.module, moduleName);
                var referencedName = value.name;
                return createReference(this.canonicalSymbolOf(referencedModule, referencedName));
            }
            // Value is a reference to a symbol defined outside the module.
            if (value.arguments) {
                // If a reference has arguments the arguments need to be converted.
                return {
                    __symbolic: 'reference',
                    name: value.name,
                    module: value.module,
                    arguments: value.arguments.map(function (a) { return _this.convertValue(moduleName, a); })
                };
            }
            return value;
        }
        if (schema_1.isMetadataModuleReferenceExpression(value)) {
            // Cannot support references to bundled modules as the internal modules of a bundle are erased
            // by the bundler.
            if (value.module.startsWith('.')) {
                return {
                    __symbolic: 'error',
                    message: 'Unsupported bundled module reference',
                    context: { module: value.module }
                };
            }
            // References to unbundled modules are unmodified.
            return value;
        }
    };
    MetadataBundler.prototype.convertExpressionNode = function (moduleName, value) {
        var result = { __symbolic: value.__symbolic };
        for (var key in value) {
            result[key] = this.convertValue(moduleName, value[key]);
        }
        return result;
    };
    MetadataBundler.prototype.symbolOf = function (module, name) {
        var symbolKey = module + ":" + name;
        var symbol = this.symbolMap.get(symbolKey);
        if (!symbol) {
            symbol = { module: module, name: name };
            this.symbolMap.set(symbolKey, symbol);
        }
        return symbol;
    };
    MetadataBundler.prototype.canonicalSymbolOf = function (module, name) {
        // Ensure the module has been seen.
        this.exportAll(module);
        var symbol = this.symbolOf(module, name);
        if (!symbol.canonicalSymbol) {
            this.canonicalizeSymbol(symbol);
        }
        return symbol;
    };
    return MetadataBundler;
}());
exports.MetadataBundler = MetadataBundler;
var CompilerHostAdapter = /** @class */ (function () {
    function CompilerHostAdapter(host, cache, options) {
        this.host = host;
        this.cache = cache;
        this.options = options;
        this.collector = new collector_1.MetadataCollector();
    }
    CompilerHostAdapter.prototype.getMetadataFor = function (fileName, containingFile) {
        var resolvedModule = ts.resolveModuleName(fileName, containingFile, this.options, this.host).resolvedModule;
        var sourceFile;
        if (resolvedModule) {
            var resolvedFileName = resolvedModule.resolvedFileName;
            if (resolvedModule.extension !== '.ts') {
                resolvedFileName = resolvedFileName.replace(/(\.d\.ts|\.js)$/, '.ts');
            }
            sourceFile = this.host.getSourceFile(resolvedFileName, ts.ScriptTarget.Latest);
        }
        else {
            // If typescript is unable to resolve the file, fallback on old behavior
            if (!this.host.fileExists(fileName + '.ts'))
                return undefined;
            sourceFile = this.host.getSourceFile(fileName + '.ts', ts.ScriptTarget.Latest);
        }
        // If there is a metadata cache, use it to get the metadata for this source file. Otherwise,
        // fall back on the locally created MetadataCollector.
        if (!sourceFile) {
            return undefined;
        }
        else if (this.cache) {
            return this.cache.getMetadata(sourceFile);
        }
        else {
            return this.collector.getMetadata(sourceFile);
        }
    };
    return CompilerHostAdapter;
}());
exports.CompilerHostAdapter = CompilerHostAdapter;
function resolveModule(importName, from) {
    if (importName.startsWith('.') && from) {
        var normalPath = path.normalize(path.join(path.dirname(from), importName));
        if (!normalPath.startsWith('.') && from.startsWith('.')) {
            // path.normalize() preserves leading '../' but not './'. This adds it back.
            normalPath = "." + path.sep + normalPath;
        }
        // Replace windows path delimiters with forward-slashes. Otherwise the paths are not
        // TypeScript compatible when building the bundle.
        return normalPath.replace(/\\/g, '/');
    }
    return importName;
}
function isPrimitive(o) {
    return o === null || (typeof o !== 'function' && typeof o !== 'object');
}
function getRootExport(symbol) {
    return symbol.reexportedAs ? getRootExport(symbol.reexportedAs) : symbol;
}
function getSymbolDeclaration(symbol) {
    return symbol.exports ? getSymbolDeclaration(symbol.exports) : symbol;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbWV0YWRhdGEvYnVuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILDJCQUE2QjtBQUM3QiwrQkFBaUM7QUFFakMsbURBQXdEO0FBQ3hELDZDQUErbUI7QUFLL21CLG1EQUFtRDtBQUNuRCxJQUFNLGtCQUFrQixHQUFHLDRCQUE0QixDQUFDO0FBZ0V4RDtJQVNFLHlCQUNZLElBQVksRUFBVSxRQUEwQixFQUFVLElBQXlCLEVBQzNGLG1CQUE0QjtRQURwQixTQUFJLEdBQUosSUFBSSxDQUFRO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBa0I7UUFBVSxTQUFJLEdBQUosSUFBSSxDQUFxQjtRQVR2RixjQUFTLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUM7UUFDdEMsa0JBQWEsR0FBRyxJQUFJLEdBQUcsRUFBb0MsQ0FBQztRQUM1RCxZQUFPLEdBQUcsSUFBSSxHQUFHLEVBQW9CLENBQUM7UUFTNUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFLLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFHLENBQUM7UUFDN0MsSUFBSSxDQUFDLG1CQUFtQixHQUFHLENBQUMsbUJBQW1CLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztJQUM3RSxDQUFDO0lBRUQsMkNBQWlCLEdBQWpCO1FBQ0UsZ0dBQWdHO1FBQ2hHLGVBQWU7UUFDZixJQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsbUJBQW1CLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDMUMsdUVBQXVFO1FBQ3ZFLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFD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