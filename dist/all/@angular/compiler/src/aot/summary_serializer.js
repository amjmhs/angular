"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var compile_metadata_1 = require("../compile_metadata");
var o = require("../output/output_ast");
var util_1 = require("../util");
var static_symbol_1 = require("./static_symbol");
var static_symbol_resolver_1 = require("./static_symbol_resolver");
var util_2 = require("./util");
function serializeSummaries(srcFileName, forJitCtx, summaryResolver, symbolResolver, symbols, types) {
    var toJsonSerializer = new ToJsonSerializer(symbolResolver, summaryResolver, srcFileName);
    // for symbols, we use everything except for the class metadata itself
    // (we keep the statics though), as the class metadata is contained in the
    // CompileTypeSummary.
    symbols.forEach(function (resolvedSymbol) { return toJsonSerializer.addSummary({ symbol: resolvedSymbol.symbol, metadata: resolvedSymbol.metadata }); });
    // Add type summaries.
    types.forEach(function (_a) {
        var summary = _a.summary, metadata = _a.metadata;
        toJsonSerializer.addSummary({ symbol: summary.type.reference, metadata: undefined, type: summary });
    });
    var _a = toJsonSerializer.serialize(), json = _a.json, exportAs = _a.exportAs;
    if (forJitCtx) {
        var forJitSerializer_1 = new ForJitSerializer(forJitCtx, symbolResolver, summaryResolver);
        types.forEach(function (_a) {
            var summary = _a.summary, metadata = _a.metadata;
            forJitSerializer_1.addSourceType(summary, metadata);
        });
        toJsonSerializer.unprocessedSymbolSummariesBySymbol.forEach(function (summary) {
            if (summaryResolver.isLibraryFile(summary.symbol.filePath) && summary.type) {
                forJitSerializer_1.addLibType(summary.type);
            }
        });
        forJitSerializer_1.serialize(exportAs);
    }
    return { json: json, exportAs: exportAs };
}
exports.serializeSummaries = serializeSummaries;
function deserializeSummaries(symbolCache, summaryResolver, libraryFileName, json) {
    var deserializer = new FromJsonDeserializer(symbolCache, summaryResolver);
    return deserializer.deserialize(libraryFileName, json);
}
exports.deserializeSummaries = deserializeSummaries;
function createForJitStub(outputCtx, reference) {
    return createSummaryForJitFunction(outputCtx, reference, o.NULL_EXPR);
}
exports.createForJitStub = createForJitStub;
function createSummaryForJitFunction(outputCtx, reference, value) {
    var fnName = util_2.summaryForJitName(reference.name);
    outputCtx.statements.push(o.fn([], [new o.ReturnStatement(value)], new o.ArrayType(o.DYNAMIC_TYPE)).toDeclStmt(fnName, [
        o.StmtModifier.Final, o.StmtModifier.Exported
    ]));
}
var ToJsonSerializer = /** @class */ (function (_super) {
    __extends(ToJsonSerializer, _super);
    function ToJsonSerializer(symbolResolver, summaryResolver, srcFileName) {
        var _this = _super.call(this) || this;
        _this.symbolResolver = symbolResolver;
        _this.summaryResolver = summaryResolver;
        _this.srcFileName = srcFileName;
        // Note: This only contains symbols without members.
        _this.symbols = [];
        _this.indexBySymbol = new Map();
        _this.reexportedBy = new Map();
        // This now contains a `__symbol: number` in the place of
        // StaticSymbols, but otherwise has the same shape as the original objects.
        _this.processedSummaryBySymbol = new Map();
        _this.processedSummaries = [];
        _this.unprocessedSymbolSummariesBySymbol = new Map();
        _this.moduleName = symbolResolver.getKnownModuleName(srcFileName);
        return _this;
    }
    ToJsonSerializer.prototype.addSummary = function (summary) {
        var _this = this;
        var unprocessedSummary = this.unprocessedSymbolSummariesBySymbol.get(summary.symbol);
        var processedSummary = this.processedSummaryBySymbol.get(summary.symbol);
        if (!unprocessedSummary) {
            unprocessedSummary = { symbol: summary.symbol, metadata: undefined };
            this.unprocessedSymbolSummariesBySymbol.set(summary.symbol, unprocessedSummary);
            processedSummary = { symbol: this.processValue(summary.symbol, 0 /* None */) };
            this.processedSummaries.push(processedSummary);
            this.processedSummaryBySymbol.set(summary.symbol, processedSummary);
        }
        if (!unprocessedSummary.metadata && summary.metadata) {
            var metadata_1 = summary.metadata || {};
            if (metadata_1.__symbolic === 'class') {
                // For classes, we keep everything except their class decorators.
                // We need to keep e.g. the ctor args, method names, method decorators
                // so that the class can be extended in another compilation unit.
                // We don't keep the class decorators as
                // 1) they refer to data
                //   that should not cause a rebuild of downstream compilation units
                //   (e.g. inline templates of @Component, or @NgModule.declarations)
                // 2) their data is already captured in TypeSummaries, e.g. DirectiveSummary.
                var clone_1 = {};
                Object.keys(metadata_1).forEach(function (propName) {
                    if (propName !== 'decorators') {
                        clone_1[propName] = metadata_1[propName];
                    }
                });
                metadata_1 = clone_1;
            }
            else if (isCall(metadata_1)) {
                if (!isFunctionCall(metadata_1) && !isMethodCallOnVariable(metadata_1)) {
                    // Don't store complex calls as we won't be able to simplify them anyways later on.
                    metadata_1 = {
                        __symbolic: 'error',
                        message: 'Complex function calls are not supported.',
                    };
                }
            }
            // Note: We need to keep storing ctor calls for e.g.
            // `export const x = new InjectionToken(...)`
            unprocessedSummary.metadata = metadata_1;
            processedSummary.metadata = this.processValue(metadata_1, 1 /* ResolveValue */);
            if (metadata_1 instanceof static_symbol_1.StaticSymbol &&
                this.summaryResolver.isLibraryFile(metadata_1.filePath)) {
                var declarationSymbol = this.symbols[this.indexBySymbol.get(metadata_1)];
                if (!util_2.isLoweredSymbol(declarationSymbol.name)) {
                    // Note: symbols that were introduced during codegen in the user file can have a reexport
                    // if a user used `export *`. However, we can't rely on this as tsickle will change
                    // `export *` into named exports, using only the information from the typechecker.
                    // As we introduce the new symbols after typecheck, Tsickle does not know about them,
                    // and omits them when expanding `export *`.
                    // So we have to keep reexporting these symbols manually via .ngfactory files.
                    this.reexportedBy.set(declarationSymbol, summary.symbol);
                }
            }
        }
        if (!unprocessedSummary.type && summary.type) {
            unprocessedSummary.type = summary.type;
            // Note: We don't add the summaries of all referenced symbols as for the ResolvedSymbols,
            // as the type summaries already contain the transitive data that they require
            // (in a minimal way).
            processedSummary.type = this.processValue(summary.type, 0 /* None */);
            // except for reexported directives / pipes, so we need to store
            // their summaries explicitly.
            if (summary.type.summaryKind === compile_metadata_1.CompileSummaryKind.NgModule) {
                var ngModuleSummary = summary.type;
                ngModuleSummary.exportedDirectives.concat(ngModuleSummary.exportedPipes).forEach(function (id) {
                    var symbol = id.reference;
                    if (_this.summaryResolver.isLibraryFile(symbol.filePath) &&
                        !_this.unprocessedSymbolSummariesBySymbol.has(symbol)) {
                        var summary_1 = _this.summaryResolver.resolveSummary(symbol);
                        if (summary_1) {
                            _this.addSummary(summary_1);
                        }
                    }
                });
            }
        }
    };
    ToJsonSerializer.prototype.serialize = function () {
        var _this = this;
        var exportAs = [];
        var json = JSON.stringify({
            moduleName: this.moduleName,
            summaries: this.processedSummaries,
            symbols: this.symbols.map(function (symbol, index) {
                symbol.assertNoMembers();
                var importAs = undefined;
                if (_this.summaryResolver.isLibraryFile(symbol.filePath)) {
                    var reexportSymbol = _this.reexportedBy.get(symbol);
                    if (reexportSymbol) {
                        importAs = _this.indexBySymbol.get(reexportSymbol);
                    }
                    else {
                        var summary = _this.unprocessedSymbolSummariesBySymbol.get(symbol);
                        if (!summary || !summary.metadata || summary.metadata.__symbolic !== 'interface') {
                            importAs = symbol.name + "_" + index;
                            exportAs.push({ symbol: symbol, exportAs: importAs });
                        }
                    }
                }
                return {
                    __symbol: index,
                    name: symbol.name,
                    filePath: _this.summaryResolver.toSummaryFileName(symbol.filePath, _this.srcFileName),
                    importAs: importAs
                };
            })
        });
        return { json: json, exportAs: exportAs };
    };
    ToJsonSerializer.prototype.processValue = function (value, flags) {
        return util_1.visitValue(value, this, flags);
    };
    ToJsonSerializer.prototype.visitOther = function (value, context) {
        if (value instanceof static_symbol_1.StaticSymbol) {
            var baseSymbol = this.symbolResolver.getStaticSymbol(value.filePath, value.name);
            var index = this.visitStaticSymbol(baseSymbol, context);
            return { __symbol: index, members: value.members };
        }
    };
    /**
     * Strip line and character numbers from ngsummaries.
     * Emitting them causes white spaces changes to retrigger upstream
     * recompilations in bazel.
     * TODO: find out a way to have line and character numbers in errors without
     * excessive recompilation in bazel.
     */
    ToJsonSerializer.prototype.visitStringMap = function (map, context) {
        if (map['__symbolic'] === 'resolved') {
            return util_1.visitValue(map.symbol, this, context);
        }
        if (map['__symbolic'] === 'error') {
            delete map['line'];
            delete map['character'];
        }
        return _super.prototype.visitStringMap.call(this, map, context);
    };
    /**
     * Returns null if the options.resolveValue is true, and the summary for the symbol
     * resolved to a type or could not be resolved.
     */
    ToJsonSerializer.prototype.visitStaticSymbol = function (baseSymbol, flags) {
        var index = this.indexBySymbol.get(baseSymbol);
        var summary = null;
        if (flags & 1 /* ResolveValue */ &&
            this.summaryResolver.isLibraryFile(baseSymbol.filePath)) {
            if (this.unprocessedSymbolSummariesBySymbol.has(baseSymbol)) {
                // the summary for this symbol was already added
                // -> nothing to do.
                return index;
            }
            summary = this.loadSummary(baseSymbol);
            if (summary && summary.metadata instanceof static_symbol_1.StaticSymbol) {
                // The summary is a reexport
                index = this.visitStaticSymbol(summary.metadata, flags);
                // reset the summary as it is just a reexport, so we don't want to store it.
                summary = null;
            }
        }
        else if (index != null) {
            // Note: == on purpose to compare with undefined!
            // No summary and the symbol is already added -> nothing to do.
            return index;
        }
        // Note: == on purpose to compare with undefined!
        if (index == null) {
            index = this.symbols.length;
            this.symbols.push(baseSymbol);
        }
        this.indexBySymbol.set(baseSymbol, index);
        if (summary) {
            this.addSummary(summary);
        }
        return index;
    };
    ToJsonSerializer.prototype.loadSummary = function (symbol) {
        var summary = this.summaryResolver.resolveSummary(symbol);
        if (!summary) {
            // some symbols might originate from a plain typescript library
            // that just exported .d.ts and .metadata.json files, i.e. where no summary
            // files were created.
            var resolvedSymbol = this.symbolResolver.resolveSymbol(symbol);
            if (resolvedSymbol) {
                summary = { symbol: resolvedSymbol.symbol, metadata: resolvedSymbol.metadata };
            }
        }
        return summary;
    };
    return ToJsonSerializer;
}(util_1.ValueTransformer));
var ForJitSerializer = /** @class */ (function () {
    function ForJitSerializer(outputCtx, symbolResolver, summaryResolver) {
        this.outputCtx = outputCtx;
        this.symbolResolver = symbolResolver;
        this.summaryResolver = summaryResolver;
        this.data = [];
    }
    ForJitSerializer.prototype.addSourceType = function (summary, metadata) {
        this.data.push({ summary: summary, metadata: metadata, isLibrary: false });
    };
    ForJitSerializer.prototype.addLibType = function (summary) {
        this.data.push({ summary: summary, metadata: null, isLibrary: true });
    };
    ForJitSerializer.prototype.serialize = function (exportAsArr) {
        var _this = this;
        var exportAsBySymbol = new Map();
        for (var _i = 0, exportAsArr_1 = exportAsArr; _i < exportAsArr_1.length; _i++) {
            var _a = exportAsArr_1[_i], symbol = _a.symbol, exportAs = _a.exportAs;
            exportAsBySymbol.set(symbol, exportAs);
        }
        var ngModuleSymbols = new Set();
        for (var _b = 0, _c = this.data; _b < _c.length; _b++) {
            var _d = _c[_b], summary = _d.summary, metadata = _d.metadata, isLibrary = _d.isLibrary;
            if (summary.summaryKind === compile_metadata_1.CompileSummaryKind.NgModule) {
                // collect the symbols that refer to NgModule classes.
                // Note: we can't just rely on `summary.type.summaryKind` to determine this as
                // we don't add the summaries of all referenced symbols when we serialize type summaries.
                // See serializeSummaries for details.
                ngModuleSymbols.add(summary.type.reference);
                var modSummary = summary;
                for (var _e = 0, _f = modSummary.modules; _e < _f.length; _e++) {
                    var mod_1 = _f[_e];
                    ngModuleSymbols.add(mod_1.reference);
                }
            }
            if (!isLibrary) {
                var fnName = util_2.summaryForJitName(summary.type.reference.name);
                createSummaryForJitFunction(this.outputCtx, summary.type.reference, this.serializeSummaryWithDeps(summary, metadata));
            }
        }
        ngModuleSymbols.forEach(function (ngModuleSymbol) {
            if (_this.summaryResolver.isLibraryFile(ngModuleSymbol.filePath)) {
                var exportAs = exportAsBySymbol.get(ngModuleSymbol) || ngModuleSymbol.name;
                var jitExportAsName = util_2.summaryForJitName(exportAs);
                _this.outputCtx.statements.push(o.variable(jitExportAsName)
                    .set(_this.serializeSummaryRef(ngModuleSymbol))
                    .toDeclStmt(null, [o.StmtModifier.Exported]));
            }
        });
    };
    ForJitSerializer.prototype.serializeSummaryWithDeps = function (summary, metadata) {
        var _this = this;
        var expressions = [this.serializeSummary(summary)];
        var providers = [];
        if (metadata instanceof compile_metadata_1.CompileNgModuleMetadata) {
            expressions.push.apply(expressions, 
            // For directives / pipes, we only add the declared ones,
            // and rely on transitively importing NgModules to get the transitive
            // summaries.
            metadata.declaredDirectives.concat(metadata.declaredPipes)
                .map(function (type) { return type.reference; })
                // For modules,
                // we also add the summaries for modules
                // from libraries.
                // This is ok as we produce reexports for all transitive modules.
                .concat(metadata.transitiveModule.modules.map(function (type) { return type.reference; })
                .filter(function (ref) { return ref !== metadata.type.reference; }))
                .map(function (ref) { return _this.serializeSummaryRef(ref); }));
            // Note: We don't use `NgModuleSummary.providers`, as that one is transitive,
            // and we already have transitive modules.
            providers = metadata.providers;
        }
        else if (summary.summaryKind === compile_metadata_1.CompileSummaryKind.Directive) {
            var dirSummary = summary;
            providers = dirSummary.providers.concat(dirSummary.viewProviders);
        }
        // Note: We can't just refer to the `ngsummary.ts` files for `useClass` providers (as we do for
        // declaredDirectives / declaredPipes), as we allow
        // providers without ctor arguments to skip the `@Injectable` decorator,
        // i.e. we didn't generate .ngsummary.ts files for these.
        expressions.push.apply(expressions, providers.filter(function (provider) { return !!provider.useClass; }).map(function (provider) { return _this.serializeSummary({
            summaryKind: compile_metadata_1.CompileSummaryKind.Injectable, type: provider.useClass
        }); }));
        return o.literalArr(expressions);
    };
    ForJitSerializer.prototype.serializeSummaryRef = function (typeSymbol) {
        var jitImportedSymbol = this.symbolResolver.getStaticSymbol(util_2.summaryForJitFileName(typeSymbol.filePath), util_2.summaryForJitName(typeSymbol.name));
        return this.outputCtx.importExpr(jitImportedSymbol);
    };
    ForJitSerializer.prototype.serializeSummary = function (data) {
        var outputCtx = this.outputCtx;
        var Transformer = /** @class */ (function () {
            function Transformer() {
            }
            Transformer.prototype.visitArray = function (arr, context) {
                var _this = this;
                return o.literalArr(arr.map(function (entry) { return util_1.visitValue(entry, _this, context); }));
            };
            Transformer.prototype.visitStringMap = function (map, context) {
                var _this = this;
                return new o.LiteralMapExpr(Object.keys(map).map(function (key) { return new o.LiteralMapEntry(key, util_1.visitValue(map[key], _this, context), false); }));
            };
            Transformer.prototype.visitPrimitive = function (value, context) { return o.literal(value); };
            Transformer.prototype.visitOther = function (value, context) {
                if (value instanceof static_symbol_1.StaticSymbol) {
                    return outputCtx.importExpr(value);
                }
                else {
                    throw new Error("Illegal State: Encountered value " + value);
                }
            };
            return Transformer;
        }());
        return util_1.visitValue(data, new Transformer(), null);
    };
    return ForJitSerializer;
}());
var FromJsonDeserializer = /** @class */ (function (_super) {
    __extends(FromJsonDeserializer, _super);
    function FromJsonDeserializer(symbolCache, summaryResolver) {
        var _this = _super.call(this) || this;
        _this.symbolCache = symbolCache;
        _this.summaryResolver = summaryResolver;
        return _this;
    }
    FromJsonDeserializer.prototype.deserialize = function (libraryFileName, json) {
        var _this = this;
        var data = JSON.parse(json);
        var allImportAs = [];
        this.symbols = data.symbols.map(function (serializedSymbol) { return _this.symbolCache.get(_this.summaryResolver.fromSummaryFileName(serializedSymbol.filePath, libraryFileName), serializedSymbol.name); });
        data.symbols.forEach(function (serializedSymbol, index) {
            var symbol = _this.symbols[index];
            var importAs = serializedSymbol.importAs;
            if (typeof importAs === 'number') {
                allImportAs.push({ symbol: symbol, importAs: _this.symbols[importAs] });
            }
            else if (typeof importAs === 'string') {
                allImportAs.push({ symbol: symbol, importAs: _this.symbolCache.get(util_2.ngfactoryFilePath(libraryFileName), importAs) });
            }
        });
        var summaries = util_1.visitValue(data.summaries, this, null);
        return { moduleName: data.moduleName, summaries: summaries, importAs: allImportAs };
    };
    FromJsonDeserializer.prototype.visitStringMap = function (map, context) {
        if ('__symbol' in map) {
            var baseSymbol = this.symbols[map['__symbol']];
            var members = map['members'];
            return members.length ? this.symbolCache.get(baseSymbol.filePath, baseSymbol.name, members) :
                baseSymbol;
        }
        else {
            return _super.prototype.visitStringMap.call(this, map, context);
        }
    };
    return FromJsonDeserializer;
}(util_1.ValueTransformer));
function isCall(metadata) {
    return metadata && metadata.__symbolic === 'call';
}
function isFunctionCall(metadata) {
    return isCall(metadata) && static_symbol_resolver_1.unwrapResolvedMetadata(metadata.expression) instanceof static_symbol_1.StaticSymbol;
}
function isMethodCallOnVariable(metadata) {
    return isCall(metadata) && metadata.expression && metadata.expression.__symbolic === 'select' &&
        static_symbol_resolver_1.unwrapResolvedMetadata(metadata.expression.expression) instanceof static_symbol_1.StaticSymbol;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VtbWFyeV9zZXJpYWxpemVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL2FvdC9zdW1tYXJ5X3NlcmlhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsd0RBQWtQO0FBQ2xQLHdDQUEwQztBQUUxQyxnQ0FBa0Y7QUFFbEYsaURBQWdFO0FBQ2hFLG1FQUE0RztBQUM1RywrQkFBb0c7QUFFcEcsNEJBQ0ksV0FBbUIsRUFBRSxTQUErQixFQUNwRCxlQUE4QyxFQUFFLGNBQW9DLEVBQ3BGLE9BQStCLEVBQUUsS0FJOUI7SUFDTCxJQUFNLGdCQUFnQixHQUFHLElBQUksZ0JBQWdCLENBQUMsY0FBYyxFQUFFLGVBQWUsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUU1RixzRUFBc0U7SUFDdEUsMEVBQTBFO0lBQzFFLHNCQUFzQjtJQUN0QixPQUFPLENBQUMsT0FBTyxDQUNYLFVBQUMsY0FBYyxJQUFLLE9BQUEsZ0JBQWdCLENBQUMsVUFBVSxDQUMzQyxFQUFDLE1BQU0sRUFBRSxjQUFjLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxjQUFjLENBQUMsUUFBUSxFQUFDLENBQUMsRUFEbkQsQ0FDbUQsQ0FBQyxDQUFDO0lBRTdFLHNCQUFzQjtJQUN0QixLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsRUFBbUI7WUFBbEIsb0JBQU8sRUFBRSxzQkFBUTtRQUMvQixnQkFBZ0IsQ0FBQyxVQUFVLENBQ3ZCLEVBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7SUFDNUUsQ0FBQyxDQUFDLENBQUM7SUFDRyxJQUFBLGlDQUErQyxFQUE5QyxjQUFJLEVBQUUsc0JBQVEsQ0FBaUM7SUFDdEQsSUFBSSxTQUFTLEVBQUU7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