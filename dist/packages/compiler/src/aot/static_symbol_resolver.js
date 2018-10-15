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
import { ValueTransformer, visitValue } from '../util';
import { StaticSymbol } from './static_symbol';
import { isGeneratedFile, stripSummaryForJitFileSuffix, stripSummaryForJitNameSuffix, summaryForJitFileName, summaryForJitName } from './util';
/** @type {?} */
const TS = /^(?!.*\.d\.ts$).*\.ts$/;
export class ResolvedStaticSymbol {
    /**
     * @param {?} symbol
     * @param {?} metadata
     */
    constructor(symbol, metadata) {
        this.symbol = symbol;
        this.metadata = metadata;
    }
}
if (false) {
    /** @type {?} */
    ResolvedStaticSymbol.prototype.symbol;
    /** @type {?} */
    ResolvedStaticSymbol.prototype.metadata;
}
/**
 * The host of the SymbolResolverHost disconnects the implementation from TypeScript / other
 * language
 * services and from underlying file systems.
 * @record
 */
export function StaticSymbolResolverHost() { }
/**
 * Return a ModuleMetadata for the given module.
 * Angular CLI will produce this metadata for a module whenever a .d.ts files is
 * produced and the module has exported variables or classes with decorators. Module metadata can
 * also be produced directly from TypeScript sources by using MetadataCollector in tools/metadata.
 *
 * \@param modulePath is a string identifier for a module as an absolute path.
 * \@return the metadata for the given module.
 * @type {?}
 */
StaticSymbolResolverHost.prototype.getMetadataFor;
/**
 * Converts a module name that is used in an `import` to a file path.
 * I.e.
 * `path/to/containingFile.ts` containing `import {...} from 'module-name'`.
 * @type {?}
 */
StaticSymbolResolverHost.prototype.moduleNameToFileName;
/**
 * Get a file suitable for display to the user that should be relative to the project directory
 * or the current directory.
 * @type {?}
 */
StaticSymbolResolverHost.prototype.getOutputName;
/** @type {?} */
const SUPPORTED_SCHEMA_VERSION = 4;
/**
 * This class is responsible for loading metadata per symbol,
 * and normalizing references between symbols.
 *
 * Internally, it only uses symbols without members,
 * and deduces the values for symbols with members based
 * on these symbols.
 */
export class StaticSymbolResolver {
    /**
     * @param {?} host
     * @param {?} staticSymbolCache
     * @param {?} summaryResolver
     * @param {?=} errorRecorder
     */
    constructor(host, staticSymbolCache, summaryResolver, errorRecorder) {
        this.host = host;
        this.staticSymbolCache = staticSymbolCache;
        this.summaryResolver = summaryResolver;
        this.errorRecorder = errorRecorder;
        this.metadataCache = new Map();
        this.resolvedSymbols = new Map();
        this.resolvedFilePaths = new Set();
        this.importAs = new Map();
        this.symbolResourcePaths = new Map();
        this.symbolFromFile = new Map();
        this.knownFileNameToModuleNames = new Map();
    }
    /**
     * @param {?} staticSymbol
     * @return {?}
     */
    resolveSymbol(staticSymbol) {
        if (staticSymbol.members.length > 0) {
            return /** @type {?} */ ((this._resolveSymbolMembers(staticSymbol)));
        }
        /** @type {?} */
        const resultFromSummary = /** @type {?} */ ((this._resolveSymbolFromSummary(staticSymbol)));
        if (resultFromSummary) {
            return resultFromSummary;
        }
        /** @type {?} */
        const resultFromCache = this.resolvedSymbols.get(staticSymbol);
        if (resultFromCache) {
            return resultFromCache;
        }
        // Note: Some users use libraries that were not compiled with ngc, i.e. they don't
        // have summaries, only .d.ts files. So we always need to check both, the summary
        // and metadata.
        this._createSymbolsOf(staticSymbol.filePath);
        return /** @type {?} */ ((this.resolvedSymbols.get(staticSymbol)));
    }
    /**
     * getImportAs produces a symbol that can be used to import the given symbol.
     * The import might be different than the symbol if the symbol is exported from
     * a library with a summary; in which case we want to import the symbol from the
     * ngfactory re-export instead of directly to avoid introducing a direct dependency
     * on an otherwise indirect dependency.
     *
     * @param {?} staticSymbol the symbol for which to generate a import symbol
     * @param {?=} useSummaries
     * @return {?}
     */
    getImportAs(staticSymbol, useSummaries = true) {
        if (staticSymbol.members.length) {
            /** @type {?} */
            const baseSymbol = this.getStaticSymbol(staticSymbol.filePath, staticSymbol.name);
            /** @type {?} */
            const baseImportAs = this.getImportAs(baseSymbol, useSummaries);
            return baseImportAs ?
                this.getStaticSymbol(baseImportAs.filePath, baseImportAs.name, staticSymbol.members) :
                null;
        }
        /** @type {?} */
        const summarizedFileName = stripSummaryForJitFileSuffix(staticSymbol.filePath);
        if (summarizedFileName !== staticSymbol.filePath) {
            /** @type {?} */
            const summarizedName = stripSummaryForJitNameSuffix(staticSymbol.name);
            /** @type {?} */
            const baseSymbol = this.getStaticSymbol(summarizedFileName, summarizedName, staticSymbol.members);
            /** @type {?} */
            const baseImportAs = this.getImportAs(baseSymbol, useSummaries);
            return baseImportAs ?
                this.getStaticSymbol(summaryForJitFileName(baseImportAs.filePath), summaryForJitName(baseImportAs.name), baseSymbol.members) :
                null;
        }
        /** @type {?} */
        let result = (useSummaries && this.summaryResolver.getImportAs(staticSymbol)) || null;
        if (!result) {
            result = /** @type {?} */ ((this.importAs.get(staticSymbol)));
        }
        return result;
    }
    /**
     * getResourcePath produces the path to the original location of the symbol and should
     * be used to determine the relative location of resource references recorded in
     * symbol metadata.
     * @param {?} staticSymbol
     * @return {?}
     */
    getResourcePath(staticSymbol) {
        return this.symbolResourcePaths.get(staticSymbol) || staticSymbol.filePath;
    }
    /**
     * getTypeArity returns the number of generic type parameters the given symbol
     * has. If the symbol is not a type the result is null.
     * @param {?} staticSymbol
     * @return {?}
     */
    getTypeArity(staticSymbol) {
        // If the file is a factory/ngsummary file, don't resolve the symbol as doing so would
        // cause the metadata for an factory/ngsummary file to be loaded which doesn't exist.
        // All references to generated classes must include the correct arity whenever
        // generating code.
        if (isGeneratedFile(staticSymbol.filePath)) {
            return null;
        }
        /** @type {?} */
        let resolvedSymbol = unwrapResolvedMetadata(this.resolveSymbol(staticSymbol));
        while (resolvedSymbol && resolvedSymbol.metadata instanceof StaticSymbol) {
            resolvedSymbol = unwrapResolvedMetadata(this.resolveSymbol(resolvedSymbol.metadata));
        }
        return (resolvedSymbol && resolvedSymbol.metadata && resolvedSymbol.metadata.arity) || null;
    }
    /**
     * @param {?} filePath
     * @return {?}
     */
    getKnownModuleName(filePath) {
        return this.knownFileNameToModuleNames.get(filePath) || null;
    }
    /**
     * @param {?} sourceSymbol
     * @param {?} targetSymbol
     * @return {?}
     */
    recordImportAs(sourceSymbol, targetSymbol) {
        sourceSymbol.assertNoMembers();
        targetSymbol.assertNoMembers();
        this.importAs.set(sourceSymbol, targetSymbol);
    }
    /**
     * @param {?} fileName
     * @param {?} moduleName
     * @return {?}
     */
    recordModuleNameForFileName(fileName, moduleName) {
        this.knownFileNameToModuleNames.set(fileName, moduleName);
    }
    /**
     * Invalidate all information derived from the given file.
     *
     * @param {?} fileName the file to invalidate
     * @return {?}
     */
    invalidateFile(fileName) {
        this.metadataCache.delete(fileName);
        this.resolvedFilePaths.delete(fileName);
        /** @type {?} */
        const symbols = this.symbolFromFile.get(fileName);
        if (symbols) {
            this.symbolFromFile.delete(fileName);
            for (const symbol of symbols) {
                this.resolvedSymbols.delete(symbol);
                this.importAs.delete(symbol);
                this.symbolResourcePaths.delete(symbol);
            }
        }
    }
    /**
     * \@internal
     * @template T
     * @param {?} cb
     * @return {?}
     */
    ignoreErrorsFor(cb) {
        /** @type {?} */
        const recorder = this.errorRecorder;
        this.errorRecorder = () => { };
        try {
            return cb();
        }
        finally {
            this.errorRecorder = recorder;
        }
    }
    /**
     * @param {?} staticSymbol
     * @return {?}
     */
    _resolveSymbolMembers(staticSymbol) {
        /** @type {?} */
        const members = staticSymbol.members;
        /** @type {?} */
        const baseResolvedSymbol = this.resolveSymbol(this.getStaticSymbol(staticSymbol.filePath, staticSymbol.name));
        if (!baseResolvedSymbol) {
            return null;
        }
        /** @type {?} */
        let baseMetadata = unwrapResolvedMetadata(baseResolvedSymbol.metadata);
        if (baseMetadata instanceof StaticSymbol) {
            return new ResolvedStaticSymbol(staticSymbol, this.getStaticSymbol(baseMetadata.filePath, baseMetadata.name, members));
        }
        else if (baseMetadata && baseMetadata.__symbolic === 'class') {
            if (baseMetadata.statics && members.length === 1) {
                return new ResolvedStaticSymbol(staticSymbol, baseMetadata.statics[members[0]]);
            }
        }
        else {
            /** @type {?} */
            let value = baseMetadata;
            for (let i = 0; i < members.length && value; i++) {
                value = value[members[i]];
            }
            return new ResolvedStaticSymbol(staticSymbol, value);
        }
        return null;
    }
    /**
     * @param {?} staticSymbol
     * @return {?}
     */
    _resolveSymbolFromSummary(staticSymbol) {
        /** @type {?} */
        const summary = this.summaryResolver.resolveSummary(staticSymbol);
        return summary ? new ResolvedStaticSymbol(staticSymbol, summary.metadata) : null;
    }
    /**
     * getStaticSymbol produces a Type whose metadata is known but whose implementation is not loaded.
     * All types passed to the StaticResolver should be pseudo-types returned by this method.
     *
     * @param {?} declarationFile the absolute path of the file where the symbol is declared
     * @param {?} name the name of the type.
     * @param {?=} members a symbol for a static member of the named type
     * @return {?}
     */
    getStaticSymbol(declarationFile, name, members) {
        return this.staticSymbolCache.get(declarationFile, name, members);
    }
    /**
     * hasDecorators checks a file's metadata for the presence of decorators without evaluating the
     * metadata.
     *
     * @param {?} filePath the absolute path to examine for decorators.
     * @return {?} true if any class in the file has a decorator.
     */
    hasDecorators(filePath) {
        /** @type {?} */
        const metadata = this.getModuleMetadata(filePath);
        if (metadata['metadata']) {
            return Object.keys(metadata['metadata']).some((metadataKey) => {
                /** @type {?} */
                const entry = metadata['metadata'][metadataKey];
                return entry && entry.__symbolic === 'class' && entry.decorators;
            });
        }
        return false;
    }
    /**
     * @param {?} filePath
     * @return {?}
     */
    getSymbolsOf(filePath) {
        /** @type {?} */
        const summarySymbols = this.summaryResolver.getSymbolsOf(filePath);
        if (summarySymbols) {
            return summarySymbols;
        }
        // Note: Some users use libraries that were not compiled with ngc, i.e. they don't
        // have summaries, only .d.ts files, but `summaryResolver.isLibraryFile` returns true.
        this._createSymbolsOf(filePath);
        /** @type {?} */
        const metadataSymbols = [];
        this.resolvedSymbols.forEach((resolvedSymbol) => {
            if (resolvedSymbol.symbol.filePath === filePath) {
                metadataSymbols.push(resolvedSymbol.symbol);
            }
        });
        return metadataSymbols;
    }
    /**
     * @param {?} filePath
     * @return {?}
     */
    _createSymbolsOf(filePath) {
        if (this.resolvedFilePaths.has(filePath)) {
            return;
        }
        this.resolvedFilePaths.add(filePath);
        /** @type {?} */
        const resolvedSymbols = [];
        /** @type {?} */
        const metadata = this.getModuleMetadata(filePath);
        if (metadata['importAs']) {
            // Index bundle indices should use the importAs module name defined
            // in the bundle.
            this.knownFileNameToModuleNames.set(filePath, metadata['importAs']);
        }
        // handle the symbols in one of the re-export location
        if (metadata['exports']) {
            for (const moduleExport of metadata['exports']) {
                // handle the symbols in the list of explicitly re-exported symbols.
                if (moduleExport.export) {
                    moduleExport.export.forEach((exportSymbol) => {
                        /** @type {?} */
                        let symbolName;
                        if (typeof exportSymbol === 'string') {
                            symbolName = exportSymbol;
                        }
                        else {
                            symbolName = exportSymbol.as;
                        }
                        symbolName = unescapeIdentifier(symbolName);
                        /** @type {?} */
                        let symName = symbolName;
                        if (typeof exportSymbol !== 'string') {
                            symName = unescapeIdentifier(exportSymbol.name);
                        }
                        /** @type {?} */
                        const resolvedModule = this.resolveModule(moduleExport.from, filePath);
                        if (resolvedModule) {
                            /** @type {?} */
                            const targetSymbol = this.getStaticSymbol(resolvedModule, symName);
                            /** @type {?} */
                            const sourceSymbol = this.getStaticSymbol(filePath, symbolName);
                            resolvedSymbols.push(this.createExport(sourceSymbol, targetSymbol));
                        }
                    });
                }
                else {
                    /** @type {?} */
                    const resolvedModule = this.resolveModule(moduleExport.from, filePath);
                    if (resolvedModule) {
                        /** @type {?} */
                        const nestedExports = this.getSymbolsOf(resolvedModule);
                        nestedExports.forEach((targetSymbol) => {
                            /** @type {?} */
                            const sourceSymbol = this.getStaticSymbol(filePath, targetSymbol.name);
                            resolvedSymbols.push(this.createExport(sourceSymbol, targetSymbol));
                        });
                    }
                }
            }
        }
        // handle the actual metadata. Has to be after the exports
        // as there might be collisions in the names, and we want the symbols
        // of the current module to win ofter reexports.
        if (metadata['metadata']) {
            /** @type {?} */
            const topLevelSymbolNames = new Set(Object.keys(metadata['metadata']).map(unescapeIdentifier));
            /** @type {?} */
            const origins = metadata['origins'] || {};
            Object.keys(metadata['metadata']).forEach((metadataKey) => {
                /** @type {?} */
                const symbolMeta = metadata['metadata'][metadataKey];
                /** @type {?} */
                const name = unescapeIdentifier(metadataKey);
                /** @type {?} */
                const symbol = this.getStaticSymbol(filePath, name);
                /** @type {?} */
                const origin = origins.hasOwnProperty(metadataKey) && origins[metadataKey];
                if (origin) {
                    /** @type {?} */
                    const originFilePath = this.resolveModule(origin, filePath);
                    if (!originFilePath) {
                        this.reportError(new Error(`Couldn't resolve original symbol for ${origin} from ${filePath}`));
                    }
                    else {
                        this.symbolResourcePaths.set(symbol, originFilePath);
                    }
                }
                resolvedSymbols.push(this.createResolvedSymbol(symbol, filePath, topLevelSymbolNames, symbolMeta));
            });
        }
        resolvedSymbols.forEach((resolvedSymbol) => this.resolvedSymbols.set(resolvedSymbol.symbol, resolvedSymbol));
        this.symbolFromFile.set(filePath, resolvedSymbols.map(resolvedSymbol => resolvedSymbol.symbol));
    }
    /**
     * @param {?} sourceSymbol
     * @param {?} topLevelPath
     * @param {?} topLevelSymbolNames
     * @param {?} metadata
     * @return {?}
     */
    createResolvedSymbol(sourceSymbol, topLevelPath, topLevelSymbolNames, metadata) {
        /** @type {?} */
        const isTsFile = TS.test(sourceSymbol.filePath);
        if (this.summaryResolver.isLibraryFile(sourceSymbol.filePath) && !isTsFile && metadata &&
            metadata['__symbolic'] === 'class') {
            /** @type {?} */
            const transformedMeta = { __symbolic: 'class', arity: metadata.arity };
            return new ResolvedStaticSymbol(sourceSymbol, transformedMeta);
        }
        /** @type {?} */
        let _originalFileMemo;
        /** @type {?} */
        const getOriginalName = () => {
            if (!_originalFileMemo) {
                // Guess what the original file name is from the reference. If it has a `.d.ts` extension
                // replace it with `.ts`. If it already has `.ts` just leave it in place. If it doesn't have
                // .ts or .d.ts, append `.ts'. Also, if it is in `node_modules`, trim the `node_module`
                // location as it is not important to finding the file.
                _originalFileMemo =
                    this.host.getOutputName(topLevelPath.replace(/((\.ts)|(\.d\.ts)|)$/, '.ts')
                        .replace(/^.*node_modules[/\\]/, ''));
            }
            return _originalFileMemo;
        };
        /** @type {?} */
        const self = this;
        class ReferenceTransformer extends ValueTransformer {
            /**
             * @param {?} map
             * @param {?} functionParams
             * @return {?}
             */
            visitStringMap(map, functionParams) {
                /** @type {?} */
                const symbolic = map['__symbolic'];
                if (symbolic === 'function') {
                    /** @type {?} */
                    const oldLen = functionParams.length;
                    functionParams.push(...(map['parameters'] || []));
                    /** @type {?} */
                    const result = super.visitStringMap(map, functionParams);
                    functionParams.length = oldLen;
                    return result;
                }
                else if (symbolic === 'reference') {
                    /** @type {?} */
                    const module = map['module'];
                    /** @type {?} */
                    const name = map['name'] ? unescapeIdentifier(map['name']) : map['name'];
                    if (!name) {
                        return null;
                    }
                    /** @type {?} */
                    let filePath;
                    if (module) {
                        filePath = /** @type {?} */ ((self.resolveModule(module, sourceSymbol.filePath)));
                        if (!filePath) {
                            return {
                                __symbolic: 'error',
                                message: `Could not resolve ${module} relative to ${sourceSymbol.filePath}.`,
                                line: map["line"],
                                character: map["character"],
                                fileName: getOriginalName()
                            };
                        }
                        return {
                            __symbolic: 'resolved',
                            symbol: self.getStaticSymbol(filePath, name),
                            line: map["line"],
                            character: map["character"],
                            fileName: getOriginalName()
                        };
                    }
                    else if (functionParams.indexOf(name) >= 0) {
                        // reference to a function parameter
                        return { __symbolic: 'reference', name: name };
                    }
                    else {
                        if (topLevelSymbolNames.has(name)) {
                            return self.getStaticSymbol(topLevelPath, name);
                        }
                        // ambient value
                        null;
                    }
                }
                else if (symbolic === 'error') {
                    return Object.assign({}, map, { fileName: getOriginalName() });
                }
                else {
                    return super.visitStringMap(map, functionParams);
                }
            }
        }
        /** @type {?} */
        const transformedMeta = visitValue(metadata, new ReferenceTransformer(), []);
        /** @type {?} */
        let unwrappedTransformedMeta = unwrapResolvedMetadata(transformedMeta);
        if (unwrappedTransformedMeta instanceof StaticSymbol) {
            return this.createExport(sourceSymbol, unwrappedTransformedMeta);
        }
        return new ResolvedStaticSymbol(sourceSymbol, transformedMeta);
    }
    /**
     * @param {?} sourceSymbol
     * @param {?} targetSymbol
     * @return {?}
     */
    createExport(sourceSymbol, targetSymbol) {
        sourceSymbol.assertNoMembers();
        targetSymbol.assertNoMembers();
        if (this.summaryResolver.isLibraryFile(sourceSymbol.filePath) &&
            this.summaryResolver.isLibraryFile(targetSymbol.filePath)) {
            // This case is for an ng library importing symbols from a plain ts library
            // transitively.
            // Note: We rely on the fact that we discover symbols in the direction
            // from source files to library files
            this.importAs.set(targetSymbol, this.getImportAs(sourceSymbol) || sourceSymbol);
        }
        return new ResolvedStaticSymbol(sourceSymbol, targetSymbol);
    }
    /**
     * @param {?} error
     * @param {?=} context
     * @param {?=} path
     * @return {?}
     */
    reportError(error, context, path) {
        if (this.errorRecorder) {
            this.errorRecorder(error, (context && context.filePath) || path);
        }
        else {
            throw error;
        }
    }
    /**
     * @param {?} module an absolute path to a module file.
     * @return {?}
     */
    getModuleMetadata(module) {
        /** @type {?} */
        let moduleMetadata = this.metadataCache.get(module);
        if (!moduleMetadata) {
            /** @type {?} */
            const moduleMetadatas = this.host.getMetadataFor(module);
            if (moduleMetadatas) {
                /** @type {?} */
                let maxVersion = -1;
                moduleMetadatas.forEach((md) => {
                    if (md && md['version'] > maxVersion) {
                        maxVersion = md['version'];
                        moduleMetadata = md;
                    }
                });
            }
            if (!moduleMetadata) {
                moduleMetadata =
                    { __symbolic: 'module', version: SUPPORTED_SCHEMA_VERSION, module: module, metadata: {} };
            }
            if (moduleMetadata['version'] != SUPPORTED_SCHEMA_VERSION) {
                /** @type {?} */
                const errorMessage = moduleMetadata['version'] == 2 ?
                    `Unsupported metadata version ${moduleMetadata['version']} for module ${module}. This module should be compiled with a newer version of ngc` :
                    `Metadata version mismatch for module ${module}, found version ${moduleMetadata['version']}, expected ${SUPPORTED_SCHEMA_VERSION}`;
                this.reportError(new Error(errorMessage));
            }
            this.metadataCache.set(module, moduleMetadata);
        }
        return moduleMetadata;
    }
    /**
     * @param {?} module
     * @param {?} symbolName
     * @param {?=} containingFile
     * @return {?}
     */
    getSymbolByModule(module, symbolName, containingFile) {
        /** @type {?} */
        const filePath = this.resolveModule(module, containingFile);
        if (!filePath) {
            this.reportError(new Error(`Could not resolve module ${module}${containingFile ? ' relative to ' +
                containingFile : ''}`));
            return this.getStaticSymbol(`ERROR:${module}`, symbolName);
        }
        return this.getStaticSymbol(filePath, symbolName);
    }
    /**
     * @param {?} module
     * @param {?=} containingFile
     * @return {?}
     */
    resolveModule(module, containingFile) {
        try {
            return this.host.moduleNameToFileName(module, containingFile);
        }
        catch (e) {
            console.error(`Could not resolve module '${module}' relative to file ${containingFile}`);
            this.reportError(e, undefined, containingFile);
        }
        return null;
    }
}
if (false) {
    /** @type {?} */
    StaticSymbolResolver.prototype.metadataCache;
    /** @type {?} */
    StaticSymbolResolver.prototype.resolvedSymbols;
    /** @type {?} */
    StaticSymbolResolver.prototype.resolvedFilePaths;
    /** @type {?} */
    StaticSymbolResolver.prototype.importAs;
    /** @type {?} */
    StaticSymbolResolver.prototype.symbolResourcePaths;
    /** @type {?} */
    StaticSymbolResolver.prototype.symbolFromFile;
    /** @type {?} */
    StaticSymbolResolver.prototype.knownFileNameToModuleNames;
    /** @type {?} */
    StaticSymbolResolver.prototype.host;
    /** @type {?} */
    StaticSymbolResolver.prototype.staticSymbolCache;
    /** @type {?} */
    StaticSymbolResolver.prototype.summaryResolver;
    /** @type {?} */
    StaticSymbolResolver.prototype.errorRecorder;
}
/**
 * @param {?} identifier
 * @return {?}
 */
export function unescapeIdentifier(identifier) {
    return identifier.startsWith('___') ? identifier.substr(1) : identifier;
}
/**
 * @param {?} metadata
 * @return {?}
 */
export function unwrapResolvedMetadata(metadata) {
    if (metadata && metadata.__symbolic === 'resolved') {
        return metadata.symbol;
    }
    return metadata;
}
//# sourceMappingURL=static_symbol_resolver.js.map