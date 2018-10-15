/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { CompileNgModuleMetadata, CompileSummaryKind } from '../compile_metadata';
import * as o from '../output/output_ast';
import { ValueTransformer, visitValue } from '../util';
import { StaticSymbol } from './static_symbol';
import { unwrapResolvedMetadata } from './static_symbol_resolver';
import { isLoweredSymbol, ngfactoryFilePath, summaryForJitFileName, summaryForJitName } from './util';
/**
 * @param {?} srcFileName
 * @param {?} forJitCtx
 * @param {?} summaryResolver
 * @param {?} symbolResolver
 * @param {?} symbols
 * @param {?} types
 * @return {?}
 */
export function serializeSummaries(srcFileName, forJitCtx, summaryResolver, symbolResolver, symbols, types) {
    /** @type {?} */
    const toJsonSerializer = new ToJsonSerializer(symbolResolver, summaryResolver, srcFileName);
    // for symbols, we use everything except for the class metadata itself
    // (we keep the statics though), as the class metadata is contained in the
    // CompileTypeSummary.
    symbols.forEach((resolvedSymbol) => toJsonSerializer.addSummary({ symbol: resolvedSymbol.symbol, metadata: resolvedSymbol.metadata }));
    // Add type summaries.
    types.forEach(({ summary, metadata }) => {
        toJsonSerializer.addSummary({ symbol: summary.type.reference, metadata: undefined, type: summary });
    });
    const { json, exportAs } = toJsonSerializer.serialize();
    if (forJitCtx) {
        /** @type {?} */
        const forJitSerializer = new ForJitSerializer(forJitCtx, symbolResolver, summaryResolver);
        types.forEach(({ summary, metadata }) => { forJitSerializer.addSourceType(summary, metadata); });
        toJsonSerializer.unprocessedSymbolSummariesBySymbol.forEach((summary) => {
            if (summaryResolver.isLibraryFile(summary.symbol.filePath) && summary.type) {
                forJitSerializer.addLibType(summary.type);
            }
        });
        forJitSerializer.serialize(exportAs);
    }
    return { json, exportAs };
}
/**
 * @param {?} symbolCache
 * @param {?} summaryResolver
 * @param {?} libraryFileName
 * @param {?} json
 * @return {?}
 */
export function deserializeSummaries(symbolCache, summaryResolver, libraryFileName, json) {
    /** @type {?} */
    const deserializer = new FromJsonDeserializer(symbolCache, summaryResolver);
    return deserializer.deserialize(libraryFileName, json);
}
/**
 * @param {?} outputCtx
 * @param {?} reference
 * @return {?}
 */
export function createForJitStub(outputCtx, reference) {
    return createSummaryForJitFunction(outputCtx, reference, o.NULL_EXPR);
}
/**
 * @param {?} outputCtx
 * @param {?} reference
 * @param {?} value
 * @return {?}
 */
function createSummaryForJitFunction(outputCtx, reference, value) {
    /** @type {?} */
    const fnName = summaryForJitName(reference.name);
    outputCtx.statements.push(o.fn([], [new o.ReturnStatement(value)], new o.ArrayType(o.DYNAMIC_TYPE)).toDeclStmt(fnName, [
        o.StmtModifier.Final, o.StmtModifier.Exported
    ]));
}
/** @enum {number} */
const SerializationFlags = {
    None: 0,
    ResolveValue: 1,
};
class ToJsonSerializer extends ValueTransformer {
    /**
     * @param {?} symbolResolver
     * @param {?} summaryResolver
     * @param {?} srcFileName
     */
    constructor(symbolResolver, summaryResolver, srcFileName) {
        super();
        this.symbolResolver = symbolResolver;
        this.summaryResolver = summaryResolver;
        this.srcFileName = srcFileName;
        this.symbols = [];
        this.indexBySymbol = new Map();
        this.reexportedBy = new Map();
        this.processedSummaryBySymbol = new Map();
        this.processedSummaries = [];
        this.unprocessedSymbolSummariesBySymbol = new Map();
        this.moduleName = symbolResolver.getKnownModuleName(srcFileName);
    }
    /**
     * @param {?} summary
     * @return {?}
     */
    addSummary(summary) {
        /** @type {?} */
        let unprocessedSummary = this.unprocessedSymbolSummariesBySymbol.get(summary.symbol);
        /** @type {?} */
        let processedSummary = this.processedSummaryBySymbol.get(summary.symbol);
        if (!unprocessedSummary) {
            unprocessedSummary = { symbol: summary.symbol, metadata: undefined };
            this.unprocessedSymbolSummariesBySymbol.set(summary.symbol, unprocessedSummary);
            processedSummary = { symbol: this.processValue(summary.symbol, 0 /* None */) };
            this.processedSummaries.push(processedSummary);
            this.processedSummaryBySymbol.set(summary.symbol, processedSummary);
        }
        if (!unprocessedSummary.metadata && summary.metadata) {
            /** @type {?} */
            let metadata = summary.metadata || {};
            if (metadata.__symbolic === 'class') {
                /** @type {?} */
                const clone = {};
                Object.keys(metadata).forEach((propName) => {
                    if (propName !== 'decorators') {
                        clone[propName] = metadata[propName];
                    }
                });
                metadata = clone;
            }
            else if (isCall(metadata)) {
                if (!isFunctionCall(metadata) && !isMethodCallOnVariable(metadata)) {
                    // Don't store complex calls as we won't be able to simplify them anyways later on.
                    metadata = {
                        __symbolic: 'error',
                        message: 'Complex function calls are not supported.',
                    };
                }
            }
            // Note: We need to keep storing ctor calls for e.g.
            // `export const x = new InjectionToken(...)`
            unprocessedSummary.metadata = metadata;
            processedSummary.metadata = this.processValue(metadata, 1 /* ResolveValue */);
            if (metadata instanceof StaticSymbol &&
                this.summaryResolver.isLibraryFile(metadata.filePath)) {
                /** @type {?} */
                const declarationSymbol = this.symbols[/** @type {?} */ ((this.indexBySymbol.get(metadata)))];
                if (!isLoweredSymbol(declarationSymbol.name)) {
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
            if (summary.type.summaryKind === CompileSummaryKind.NgModule) {
                /** @type {?} */
                const ngModuleSummary = /** @type {?} */ (summary.type);
                ngModuleSummary.exportedDirectives.concat(ngModuleSummary.exportedPipes).forEach((id) => {
                    /** @type {?} */
                    const symbol = id.reference;
                    if (this.summaryResolver.isLibraryFile(symbol.filePath) &&
                        !this.unprocessedSymbolSummariesBySymbol.has(symbol)) {
                        /** @type {?} */
                        const summary = this.summaryResolver.resolveSummary(symbol);
                        if (summary) {
                            this.addSummary(summary);
                        }
                    }
                });
            }
        }
    }
    /**
     * @return {?}
     */
    serialize() {
        /** @type {?} */
        const exportAs = [];
        /** @type {?} */
        const json = JSON.stringify({
            moduleName: this.moduleName,
            summaries: this.processedSummaries,
            symbols: this.symbols.map((symbol, index) => {
                symbol.assertNoMembers();
                /** @type {?} */
                let importAs = /** @type {?} */ ((undefined));
                if (this.summaryResolver.isLibraryFile(symbol.filePath)) {
                    /** @type {?} */
                    const reexportSymbol = this.reexportedBy.get(symbol);
                    if (reexportSymbol) {
                        importAs = /** @type {?} */ ((this.indexBySymbol.get(reexportSymbol)));
                    }
                    else {
                        /** @type {?} */
                        const summary = this.unprocessedSymbolSummariesBySymbol.get(symbol);
                        if (!summary || !summary.metadata || summary.metadata.__symbolic !== 'interface') {
                            importAs = `${symbol.name}_${index}`;
                            exportAs.push({ symbol, exportAs: importAs });
                        }
                    }
                }
                return {
                    __symbol: index,
                    name: symbol.name,
                    filePath: this.summaryResolver.toSummaryFileName(symbol.filePath, this.srcFileName),
                    importAs: importAs
                };
            })
        });
        return { json, exportAs };
    }
    /**
     * @param {?} value
     * @param {?} flags
     * @return {?}
     */
    processValue(value, flags) {
        return visitValue(value, this, flags);
    }
    /**
     * @param {?} value
     * @param {?} context
     * @return {?}
     */
    visitOther(value, context) {
        if (value instanceof StaticSymbol) {
            /** @type {?} */
            let baseSymbol = this.symbolResolver.getStaticSymbol(value.filePath, value.name);
            /** @type {?} */
            const index = this.visitStaticSymbol(baseSymbol, context);
            return { __symbol: index, members: value.members };
        }
    }
    /**
     * Strip line and character numbers from ngsummaries.
     * Emitting them causes white spaces changes to retrigger upstream
     * recompilations in bazel.
     * TODO: find out a way to have line and character numbers in errors without
     * excessive recompilation in bazel.
     * @param {?} map
     * @param {?} context
     * @return {?}
     */
    visitStringMap(map, context) {
        if (map['__symbolic'] === 'resolved') {
            return visitValue(map["symbol"], this, context);
        }
        if (map['__symbolic'] === 'error') {
            delete map['line'];
            delete map['character'];
        }
        return super.visitStringMap(map, context);
    }
    /**
     * Returns null if the options.resolveValue is true, and the summary for the symbol
     * resolved to a type or could not be resolved.
     * @param {?} baseSymbol
     * @param {?} flags
     * @return {?}
     */
    visitStaticSymbol(baseSymbol, flags) {
        /** @type {?} */
        let index = this.indexBySymbol.get(baseSymbol);
        /** @type {?} */
        let summary = null;
        if (flags & 1 /* ResolveValue */ &&
            this.summaryResolver.isLibraryFile(baseSymbol.filePath)) {
            if (this.unprocessedSymbolSummariesBySymbol.has(baseSymbol)) {
                // the summary for this symbol was already added
                // -> nothing to do.
                return /** @type {?} */ ((index));
            }
            summary = this.loadSummary(baseSymbol);
            if (summary && summary.metadata instanceof StaticSymbol) {
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
    }
    /**
     * @param {?} symbol
     * @return {?}
     */
    loadSummary(symbol) {
        /** @type {?} */
        let summary = this.summaryResolver.resolveSummary(symbol);
        if (!summary) {
            /** @type {?} */
            const resolvedSymbol = this.symbolResolver.resolveSymbol(symbol);
            if (resolvedSymbol) {
                summary = { symbol: resolvedSymbol.symbol, metadata: resolvedSymbol.metadata };
            }
        }
        return summary;
    }
}
if (false) {
    /** @type {?} */
    ToJsonSerializer.prototype.symbols;
    /** @type {?} */
    ToJsonSerializer.prototype.indexBySymbol;
    /** @type {?} */
    ToJsonSerializer.prototype.reexportedBy;
    /** @type {?} */
    ToJsonSerializer.prototype.processedSummaryBySymbol;
    /** @type {?} */
    ToJsonSerializer.prototype.processedSummaries;
    /** @type {?} */
    ToJsonSerializer.prototype.moduleName;
    /** @type {?} */
    ToJsonSerializer.prototype.unprocessedSymbolSummariesBySymbol;
    /** @type {?} */
    ToJsonSerializer.prototype.symbolResolver;
    /** @type {?} */
    ToJsonSerializer.prototype.summaryResolver;
    /** @type {?} */
    ToJsonSerializer.prototype.srcFileName;
}
class ForJitSerializer {
    /**
     * @param {?} outputCtx
     * @param {?} symbolResolver
     * @param {?} summaryResolver
     */
    constructor(outputCtx, symbolResolver, summaryResolver) {
        this.outputCtx = outputCtx;
        this.symbolResolver = symbolResolver;
        this.summaryResolver = summaryResolver;
        this.data = [];
    }
    /**
     * @param {?} summary
     * @param {?} metadata
     * @return {?}
     */
    addSourceType(summary, metadata) {
        this.data.push({ summary, metadata, isLibrary: false });
    }
    /**
     * @param {?} summary
     * @return {?}
     */
    addLibType(summary) {
        this.data.push({ summary, metadata: null, isLibrary: true });
    }
    /**
     * @param {?} exportAsArr
     * @return {?}
     */
    serialize(exportAsArr) {
        /** @type {?} */
        const exportAsBySymbol = new Map();
        for (const { symbol, exportAs } of exportAsArr) {
            exportAsBySymbol.set(symbol, exportAs);
        }
        /** @type {?} */
        const ngModuleSymbols = new Set();
        for (const { summary, metadata, isLibrary } of this.data) {
            if (summary.summaryKind === CompileSummaryKind.NgModule) {
                // collect the symbols that refer to NgModule classes.
                // Note: we can't just rely on `summary.type.summaryKind` to determine this as
                // we don't add the summaries of all referenced symbols when we serialize type summaries.
                // See serializeSummaries for details.
                ngModuleSymbols.add(summary.type.reference);
                /** @type {?} */
                const modSummary = /** @type {?} */ (summary);
                for (const mod of modSummary.modules) {
                    ngModuleSymbols.add(mod.reference);
                }
            }
            if (!isLibrary) {
                /** @type {?} */
                const fnName = summaryForJitName(summary.type.reference.name);
                createSummaryForJitFunction(this.outputCtx, summary.type.reference, this.serializeSummaryWithDeps(summary, /** @type {?} */ ((metadata))));
            }
        }
        ngModuleSymbols.forEach((ngModuleSymbol) => {
            if (this.summaryResolver.isLibraryFile(ngModuleSymbol.filePath)) {
                /** @type {?} */
                let exportAs = exportAsBySymbol.get(ngModuleSymbol) || ngModuleSymbol.name;
                /** @type {?} */
                const jitExportAsName = summaryForJitName(exportAs);
                this.outputCtx.statements.push(o.variable(jitExportAsName)
                    .set(this.serializeSummaryRef(ngModuleSymbol))
                    .toDeclStmt(null, [o.StmtModifier.Exported]));
            }
        });
    }
    /**
     * @param {?} summary
     * @param {?} metadata
     * @return {?}
     */
    serializeSummaryWithDeps(summary, metadata) {
        /** @type {?} */
        const expressions = [this.serializeSummary(summary)];
        /** @type {?} */
        let providers = [];
        if (metadata instanceof CompileNgModuleMetadata) {
            expressions.push(...
            // For directives / pipes, we only add the declared ones,
            // and rely on transitively importing NgModules to get the transitive
            // summaries.
            metadata.declaredDirectives.concat(metadata.declaredPipes)
                .map(type => type.reference)
                // For modules,
                // we also add the summaries for modules
                // from libraries.
                // This is ok as we produce reexports for all transitive modules.
                .concat(metadata.transitiveModule.modules.map(type => type.reference)
                .filter(ref => ref !== metadata.type.reference))
                .map((ref) => this.serializeSummaryRef(ref)));
            // Note: We don't use `NgModuleSummary.providers`, as that one is transitive,
            // and we already have transitive modules.
            providers = metadata.providers;
        }
        else if (summary.summaryKind === CompileSummaryKind.Directive) {
            /** @type {?} */
            const dirSummary = /** @type {?} */ (summary);
            providers = dirSummary.providers.concat(dirSummary.viewProviders);
        }
        // Note: We can't just refer to the `ngsummary.ts` files for `useClass` providers (as we do for
        // declaredDirectives / declaredPipes), as we allow
        // providers without ctor arguments to skip the `@Injectable` decorator,
        // i.e. we didn't generate .ngsummary.ts files for these.
        expressions.push(...providers.filter(provider => !!provider.useClass).map(provider => this.serializeSummary(/** @type {?} */ ({
            summaryKind: CompileSummaryKind.Injectable, type: provider.useClass
        }))));
        return o.literalArr(expressions);
    }
    /**
     * @param {?} typeSymbol
     * @return {?}
     */
    serializeSummaryRef(typeSymbol) {
        /** @type {?} */
        const jitImportedSymbol = this.symbolResolver.getStaticSymbol(summaryForJitFileName(typeSymbol.filePath), summaryForJitName(typeSymbol.name));
        return this.outputCtx.importExpr(jitImportedSymbol);
    }
    /**
     * @param {?} data
     * @return {?}
     */
    serializeSummary(data) {
        /** @type {?} */
        const outputCtx = this.outputCtx;
        class Transformer {
            /**
             * @param {?} arr
             * @param {?} context
             * @return {?}
             */
            visitArray(arr, context) {
                return o.literalArr(arr.map(entry => visitValue(entry, this, context)));
            }
            /**
             * @param {?} map
             * @param {?} context
             * @return {?}
             */
            visitStringMap(map, context) {
                return new o.LiteralMapExpr(Object.keys(map).map((key) => new o.LiteralMapEntry(key, visitValue(map[key], this, context), false)));
            }
            /**
             * @param {?} value
             * @param {?} context
             * @return {?}
             */
            visitPrimitive(value, context) { return o.literal(value); }
            /**
             * @param {?} value
             * @param {?} context
             * @return {?}
             */
            visitOther(value, context) {
                if (value instanceof StaticSymbol) {
                    return outputCtx.importExpr(value);
                }
                else {
                    throw new Error(`Illegal State: Encountered value ${value}`);
                }
            }
        }
        return visitValue(data, new Transformer(), null);
    }
}
if (false) {
    /** @type {?} */
    ForJitSerializer.prototype.data;
    /** @type {?} */
    ForJitSerializer.prototype.outputCtx;
    /** @type {?} */
    ForJitSerializer.prototype.symbolResolver;
    /** @type {?} */
    ForJitSerializer.prototype.summaryResolver;
}
class FromJsonDeserializer extends ValueTransformer {
    /**
     * @param {?} symbolCache
     * @param {?} summaryResolver
     */
    constructor(symbolCache, summaryResolver) {
        super();
        this.symbolCache = symbolCache;
        this.summaryResolver = summaryResolver;
    }
    /**
     * @param {?} libraryFileName
     * @param {?} json
     * @return {?}
     */
    deserialize(libraryFileName, json) {
        /** @type {?} */
        const data = JSON.parse(json);
        /** @type {?} */
        const allImportAs = [];
        this.symbols = data.symbols.map((serializedSymbol) => this.symbolCache.get(this.summaryResolver.fromSummaryFileName(serializedSymbol.filePath, libraryFileName), serializedSymbol.name));
        data.symbols.forEach((serializedSymbol, index) => {
            /** @type {?} */
            const symbol = this.symbols[index];
            /** @type {?} */
            const importAs = serializedSymbol.importAs;
            if (typeof importAs === 'number') {
                allImportAs.push({ symbol, importAs: this.symbols[importAs] });
            }
            else if (typeof importAs === 'string') {
                allImportAs.push({ symbol, importAs: this.symbolCache.get(ngfactoryFilePath(libraryFileName), importAs) });
            }
        });
        /** @type {?} */
        const summaries = /** @type {?} */ (visitValue(data.summaries, this, null));
        return { moduleName: data.moduleName, summaries, importAs: allImportAs };
    }
    /**
     * @param {?} map
     * @param {?} context
     * @return {?}
     */
    visitStringMap(map, context) {
        if ('__symbol' in map) {
            /** @type {?} */
            const baseSymbol = this.symbols[map['__symbol']];
            /** @type {?} */
            const members = map['members'];
            return members.length ? this.symbolCache.get(baseSymbol.filePath, baseSymbol.name, members) :
                baseSymbol;
        }
        else {
            return super.visitStringMap(map, context);
        }
    }
}
if (false) {
    /** @type {?} */
    FromJsonDeserializer.prototype.symbols;
    /** @type {?} */
    FromJsonDeserializer.prototype.symbolCache;
    /** @type {?} */
    FromJsonDeserializer.prototype.summaryResolver;
}
/**
 * @param {?} metadata
 * @return {?}
 */
function isCall(metadata) {
    return metadata && metadata.__symbolic === 'call';
}
/**
 * @param {?} metadata
 * @return {?}
 */
function isFunctionCall(metadata) {
    return isCall(metadata) && unwrapResolvedMetadata(metadata.expression) instanceof StaticSymbol;
}
/**
 * @param {?} metadata
 * @return {?}
 */
function isMethodCallOnVariable(metadata) {
    return isCall(metadata) && metadata.expression && metadata.expression.__symbolic === 'select' &&
        unwrapResolvedMetadata(metadata.expression.expression) instanceof StaticSymbol;
}
//# sourceMappingURL=summary_serializer.js.map