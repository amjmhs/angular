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
import { identifierName, ngModuleJitUrl, sharedStylesheetJitUrl, templateJitUrl, templateSourceUrl } from '../compile_metadata';
import { ConstantPool } from '../constant_pool';
import * as ir from '../output/output_ast';
import { interpretStatements } from '../output/output_interpreter';
import { jitStatements } from '../output/output_jit';
import { SyncAsync, stringify } from '../util';
/**
 * @record
 */
export function ModuleWithComponentFactories() { }
/** @type {?} */
ModuleWithComponentFactories.prototype.ngModuleFactory;
/** @type {?} */
ModuleWithComponentFactories.prototype.componentFactories;
/**
 * An internal module of the Angular compiler that begins with component types,
 * extracts templates, and eventually produces a compiled version of the component
 * ready for linking into an application.
 *
 * \@security When compiling templates at runtime, you must ensure that the entire template comes
 * from a trusted source. Attacker-controlled data introduced by a template could expose your
 * application to XSS risks.  For more detail, see the [Security Guide](http://g.co/ng/security).
 */
export class JitCompiler {
    /**
     * @param {?} _metadataResolver
     * @param {?} _templateParser
     * @param {?} _styleCompiler
     * @param {?} _viewCompiler
     * @param {?} _ngModuleCompiler
     * @param {?} _summaryResolver
     * @param {?} _reflector
     * @param {?} _compilerConfig
     * @param {?} _console
     * @param {?} getExtraNgModuleProviders
     */
    constructor(_metadataResolver, _templateParser, _styleCompiler, _viewCompiler, _ngModuleCompiler, _summaryResolver, _reflector, _compilerConfig, _console, getExtraNgModuleProviders) {
        this._metadataResolver = _metadataResolver;
        this._templateParser = _templateParser;
        this._styleCompiler = _styleCompiler;
        this._viewCompiler = _viewCompiler;
        this._ngModuleCompiler = _ngModuleCompiler;
        this._summaryResolver = _summaryResolver;
        this._reflector = _reflector;
        this._compilerConfig = _compilerConfig;
        this._console = _console;
        this.getExtraNgModuleProviders = getExtraNgModuleProviders;
        this._compiledTemplateCache = new Map();
        this._compiledHostTemplateCache = new Map();
        this._compiledDirectiveWrapperCache = new Map();
        this._compiledNgModuleCache = new Map();
        this._sharedStylesheetCount = 0;
        this._addedAotSummaries = new Set();
    }
    /**
     * @param {?} moduleType
     * @return {?}
     */
    compileModuleSync(moduleType) {
        return SyncAsync.assertSync(this._compileModuleAndComponents(moduleType, true));
    }
    /**
     * @param {?} moduleType
     * @return {?}
     */
    compileModuleAsync(moduleType) {
        return Promise.resolve(this._compileModuleAndComponents(moduleType, false));
    }
    /**
     * @param {?} moduleType
     * @return {?}
     */
    compileModuleAndAllComponentsSync(moduleType) {
        return SyncAsync.assertSync(this._compileModuleAndAllComponents(moduleType, true));
    }
    /**
     * @param {?} moduleType
     * @return {?}
     */
    compileModuleAndAllComponentsAsync(moduleType) {
        return Promise.resolve(this._compileModuleAndAllComponents(moduleType, false));
    }
    /**
     * @param {?} component
     * @return {?}
     */
    getComponentFactory(component) {
        /** @type {?} */
        const summary = this._metadataResolver.getDirectiveSummary(component);
        return /** @type {?} */ (summary.componentFactory);
    }
    /**
     * @param {?} summaries
     * @return {?}
     */
    loadAotSummaries(summaries) {
        this.clearCache();
        this._addAotSummaries(summaries);
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    _addAotSummaries(fn) {
        if (this._addedAotSummaries.has(fn)) {
            return;
        }
        this._addedAotSummaries.add(fn);
        /** @type {?} */
        const summaries = fn();
        for (let i = 0; i < summaries.length; i++) {
            /** @type {?} */
            const entry = summaries[i];
            if (typeof entry === 'function') {
                this._addAotSummaries(entry);
            }
            else {
                /** @type {?} */
                const summary = /** @type {?} */ (entry);
                this._summaryResolver.addSummary({ symbol: summary.type.reference, metadata: null, type: summary });
            }
        }
    }
    /**
     * @param {?} ref
     * @return {?}
     */
    hasAotSummary(ref) { return !!this._summaryResolver.resolveSummary(ref); }
    /**
     * @param {?} ids
     * @return {?}
     */
    _filterJitIdentifiers(ids) {
        return ids.map(mod => mod.reference).filter((ref) => !this.hasAotSummary(ref));
    }
    /**
     * @param {?} moduleType
     * @param {?} isSync
     * @return {?}
     */
    _compileModuleAndComponents(moduleType, isSync) {
        return SyncAsync.then(this._loadModules(moduleType, isSync), () => {
            this._compileComponents(moduleType, null);
            return this._compileModule(moduleType);
        });
    }
    /**
     * @param {?} moduleType
     * @param {?} isSync
     * @return {?}
     */
    _compileModuleAndAllComponents(moduleType, isSync) {
        return SyncAsync.then(this._loadModules(moduleType, isSync), () => {
            /** @type {?} */
            const componentFactories = [];
            this._compileComponents(moduleType, componentFactories);
            return {
                ngModuleFactory: this._compileModule(moduleType),
                componentFactories: componentFactories
            };
        });
    }
    /**
     * @param {?} mainModule
     * @param {?} isSync
     * @return {?}
     */
    _loadModules(mainModule, isSync) {
        /** @type {?} */
        const loading = [];
        /** @type {?} */
        const mainNgModule = /** @type {?} */ ((this._metadataResolver.getNgModuleMetadata(mainModule)));
        // Note: for runtime compilation, we want to transitively compile all modules,
        // so we also need to load the declared directives / pipes for all nested modules.
        this._filterJitIdentifiers(mainNgModule.transitiveModule.modules).forEach((nestedNgModule) => {
            /** @type {?} */
            const moduleMeta = /** @type {?} */ ((this._metadataResolver.getNgModuleMetadata(nestedNgModule)));
            this._filterJitIdentifiers(moduleMeta.declaredDirectives).forEach((ref) => {
                /** @type {?} */
                const promise = this._metadataResolver.loadDirectiveMetadata(moduleMeta.type.reference, ref, isSync);
                if (promise) {
                    loading.push(promise);
                }
            });
            this._filterJitIdentifiers(moduleMeta.declaredPipes)
                .forEach((ref) => this._metadataResolver.getOrLoadPipeMetadata(ref));
        });
        return SyncAsync.all(loading);
    }
    /**
     * @param {?} moduleType
     * @return {?}
     */
    _compileModule(moduleType) {
        /** @type {?} */
        let ngModuleFactory = /** @type {?} */ ((this._compiledNgModuleCache.get(moduleType)));
        if (!ngModuleFactory) {
            /** @type {?} */
            const moduleMeta = /** @type {?} */ ((this._metadataResolver.getNgModuleMetadata(moduleType)));
            /** @type {?} */
            const extraProviders = this.getExtraNgModuleProviders(moduleMeta.type.reference);
            /** @type {?} */
            const outputCtx = createOutputContext();
            /** @type {?} */
            const compileResult = this._ngModuleCompiler.compile(outputCtx, moduleMeta, extraProviders);
            ngModuleFactory = this._interpretOrJit(ngModuleJitUrl(moduleMeta), outputCtx.statements)[compileResult.ngModuleFactoryVar];
            this._compiledNgModuleCache.set(moduleMeta.type.reference, ngModuleFactory);
        }
        return ngModuleFactory;
    }
    /**
     * \@internal
     * @param {?} mainModule
     * @param {?} allComponentFactories
     * @return {?}
     */
    _compileComponents(mainModule, allComponentFactories) {
        /** @type {?} */
        const ngModule = /** @type {?} */ ((this._metadataResolver.getNgModuleMetadata(mainModule)));
        /** @type {?} */
        const moduleByJitDirective = new Map();
        /** @type {?} */
        const templates = new Set();
        /** @type {?} */
        const transJitModules = this._filterJitIdentifiers(ngModule.transitiveModule.modules);
        transJitModules.forEach((localMod) => {
            /** @type {?} */
            const localModuleMeta = /** @type {?} */ ((this._metadataResolver.getNgModuleMetadata(localMod)));
            this._filterJitIdentifiers(localModuleMeta.declaredDirectives).forEach((dirRef) => {
                moduleByJitDirective.set(dirRef, localModuleMeta);
                /** @type {?} */
                const dirMeta = this._metadataResolver.getDirectiveMetadata(dirRef);
                if (dirMeta.isComponent) {
                    templates.add(this._createCompiledTemplate(dirMeta, localModuleMeta));
                    if (allComponentFactories) {
                        /** @type {?} */
                        const template = this._createCompiledHostTemplate(dirMeta.type.reference, localModuleMeta);
                        templates.add(template);
                        allComponentFactories.push(/** @type {?} */ (dirMeta.componentFactory));
                    }
                }
            });
        });
        transJitModules.forEach((localMod) => {
            /** @type {?} */
            const localModuleMeta = /** @type {?} */ ((this._metadataResolver.getNgModuleMetadata(localMod)));
            this._filterJitIdentifiers(localModuleMeta.declaredDirectives).forEach((dirRef) => {
                /** @type {?} */
                const dirMeta = this._metadataResolver.getDirectiveMetadata(dirRef);
                if (dirMeta.isComponent) {
                    dirMeta.entryComponents.forEach((entryComponentType) => {
                        /** @type {?} */
                        const moduleMeta = /** @type {?} */ ((moduleByJitDirective.get(entryComponentType.componentType)));
                        templates.add(this._createCompiledHostTemplate(entryComponentType.componentType, moduleMeta));
                    });
                }
            });
            localModuleMeta.entryComponents.forEach((entryComponentType) => {
                if (!this.hasAotSummary(entryComponentType.componentType)) {
                    /** @type {?} */
                    const moduleMeta = /** @type {?} */ ((moduleByJitDirective.get(entryComponentType.componentType)));
                    templates.add(this._createCompiledHostTemplate(entryComponentType.componentType, moduleMeta));
                }
            });
        });
        templates.forEach((template) => this._compileTemplate(template));
    }
    /**
     * @param {?} type
     * @return {?}
     */
    clearCacheFor(type) {
        this._compiledNgModuleCache.delete(type);
        this._metadataResolver.clearCacheFor(type);
        this._compiledHostTemplateCache.delete(type);
        /** @type {?} */
        const compiledTemplate = this._compiledTemplateCache.get(type);
        if (compiledTemplate) {
            this._compiledTemplateCache.delete(type);
        }
    }
    /**
     * @return {?}
     */
    clearCache() {
        // Note: don't clear the _addedAotSummaries, as they don't change!
        this._metadataResolver.clearCache();
        this._compiledTemplateCache.clear();
        this._compiledHostTemplateCache.clear();
        this._compiledNgModuleCache.clear();
    }
    /**
     * @param {?} compType
     * @param {?} ngModule
     * @return {?}
     */
    _createCompiledHostTemplate(compType, ngModule) {
        if (!ngModule) {
            throw new Error(`Component ${stringify(compType)} is not part of any NgModule or the module has not been imported into your module.`);
        }
        /** @type {?} */
        let compiledTemplate = this._compiledHostTemplateCache.get(compType);
        if (!compiledTemplate) {
            /** @type {?} */
            const compMeta = this._metadataResolver.getDirectiveMetadata(compType);
            assertComponent(compMeta);
            /** @type {?} */
            const hostMeta = this._metadataResolver.getHostComponentMetadata(compMeta, (/** @type {?} */ (compMeta.componentFactory)).viewDefFactory);
            compiledTemplate =
                new CompiledTemplate(true, compMeta.type, hostMeta, ngModule, [compMeta.type]);
            this._compiledHostTemplateCache.set(compType, compiledTemplate);
        }
        return compiledTemplate;
    }
    /**
     * @param {?} compMeta
     * @param {?} ngModule
     * @return {?}
     */
    _createCompiledTemplate(compMeta, ngModule) {
        /** @type {?} */
        let compiledTemplate = this._compiledTemplateCache.get(compMeta.type.reference);
        if (!compiledTemplate) {
            assertComponent(compMeta);
            compiledTemplate = new CompiledTemplate(false, compMeta.type, compMeta, ngModule, ngModule.transitiveModule.directives);
            this._compiledTemplateCache.set(compMeta.type.reference, compiledTemplate);
        }
        return compiledTemplate;
    }
    /**
     * @param {?} template
     * @return {?}
     */
    _compileTemplate(template) {
        if (template.isCompiled) {
            return;
        }
        /** @type {?} */
        const compMeta = template.compMeta;
        /** @type {?} */
        const externalStylesheetsByModuleUrl = new Map();
        /** @type {?} */
        const outputContext = createOutputContext();
        /** @type {?} */
        const componentStylesheet = this._styleCompiler.compileComponent(outputContext, compMeta); /** @type {?} */
        ((compMeta.template)).externalStylesheets.forEach((stylesheetMeta) => {
            /** @type {?} */
            const compiledStylesheet = this._styleCompiler.compileStyles(createOutputContext(), compMeta, stylesheetMeta);
            externalStylesheetsByModuleUrl.set(/** @type {?} */ ((stylesheetMeta.moduleUrl)), compiledStylesheet);
        });
        this._resolveStylesCompileResult(componentStylesheet, externalStylesheetsByModuleUrl);
        /** @type {?} */
        const pipes = template.ngModule.transitiveModule.pipes.map(pipe => this._metadataResolver.getPipeSummary(pipe.reference));
        const { template: parsedTemplate, pipes: usedPipes } = this._parseTemplate(compMeta, template.ngModule, template.directives);
        /** @type {?} */
        const compileResult = this._viewCompiler.compileComponent(outputContext, compMeta, parsedTemplate, ir.variable(componentStylesheet.stylesVar), usedPipes);
        /** @type {?} */
        const evalResult = this._interpretOrJit(templateJitUrl(template.ngModule.type, template.compMeta), outputContext.statements);
        /** @type {?} */
        const viewClass = evalResult[compileResult.viewClassVar];
        /** @type {?} */
        const rendererType = evalResult[compileResult.rendererTypeVar];
        template.compiled(viewClass, rendererType);
    }
    /**
     * @param {?} compMeta
     * @param {?} ngModule
     * @param {?} directiveIdentifiers
     * @return {?}
     */
    _parseTemplate(compMeta, ngModule, directiveIdentifiers) {
        /** @type {?} */
        const preserveWhitespaces = /** @type {?} */ ((compMeta.template)).preserveWhitespaces;
        /** @type {?} */
        const directives = directiveIdentifiers.map(dir => this._metadataResolver.getDirectiveSummary(dir.reference));
        /** @type {?} */
        const pipes = ngModule.transitiveModule.pipes.map(pipe => this._metadataResolver.getPipeSummary(pipe.reference));
        return this._templateParser.parse(compMeta, /** @type {?} */ ((/** @type {?} */ ((compMeta.template)).htmlAst)), directives, pipes, ngModule.schemas, templateSourceUrl(ngModule.type, compMeta, /** @type {?} */ ((compMeta.template))), preserveWhitespaces);
    }
    /**
     * @param {?} result
     * @param {?} externalStylesheetsByModuleUrl
     * @return {?}
     */
    _resolveStylesCompileResult(result, externalStylesheetsByModuleUrl) {
        result.dependencies.forEach((dep, i) => {
            /** @type {?} */
            const nestedCompileResult = /** @type {?} */ ((externalStylesheetsByModuleUrl.get(dep.moduleUrl)));
            /** @type {?} */
            const nestedStylesArr = this._resolveAndEvalStylesCompileResult(nestedCompileResult, externalStylesheetsByModuleUrl);
            dep.setValue(nestedStylesArr);
        });
    }
    /**
     * @param {?} result
     * @param {?} externalStylesheetsByModuleUrl
     * @return {?}
     */
    _resolveAndEvalStylesCompileResult(result, externalStylesheetsByModuleUrl) {
        this._resolveStylesCompileResult(result, externalStylesheetsByModuleUrl);
        return this._interpretOrJit(sharedStylesheetJitUrl(result.meta, this._sharedStylesheetCount++), result.outputCtx.statements)[result.stylesVar];
    }
    /**
     * @param {?} sourceUrl
     * @param {?} statements
     * @return {?}
     */
    _interpretOrJit(sourceUrl, statements) {
        if (!this._compilerConfig.useJit) {
            return interpretStatements(statements, this._reflector);
        }
        else {
            return jitStatements(sourceUrl, statements, this._reflector, this._compilerConfig.jitDevMode);
        }
    }
}
if (false) {
    /** @type {?} */
    JitCompiler.prototype._compiledTemplateCache;
    /** @type {?} */
    JitCompiler.prototype._compiledHostTemplateCache;
    /** @type {?} */
    JitCompiler.prototype._compiledDirectiveWrapperCache;
    /** @type {?} */
    JitCompiler.prototype._compiledNgModuleCache;
    /** @type {?} */
    JitCompiler.prototype._sharedStylesheetCount;
    /** @type {?} */
    JitCompiler.prototype._addedAotSummaries;
    /** @type {?} */
    JitCompiler.prototype._metadataResolver;
    /** @type {?} */
    JitCompiler.prototype._templateParser;
    /** @type {?} */
    JitCompiler.prototype._styleCompiler;
    /** @type {?} */
    JitCompiler.prototype._viewCompiler;
    /** @type {?} */
    JitCompiler.prototype._ngModuleCompiler;
    /** @type {?} */
    JitCompiler.prototype._summaryResolver;
    /** @type {?} */
    JitCompiler.prototype._reflector;
    /** @type {?} */
    JitCompiler.prototype._compilerConfig;
    /** @type {?} */
    JitCompiler.prototype._console;
    /** @type {?} */
    JitCompiler.prototype.getExtraNgModuleProviders;
}
class CompiledTemplate {
    /**
     * @param {?} isHost
     * @param {?} compType
     * @param {?} compMeta
     * @param {?} ngModule
     * @param {?} directives
     */
    constructor(isHost, compType, compMeta, ngModule, directives) {
        this.isHost = isHost;
        this.compType = compType;
        this.compMeta = compMeta;
        this.ngModule = ngModule;
        this.directives = directives;
        this._viewClass = /** @type {?} */ ((null));
        this.isCompiled = false;
    }
    /**
     * @param {?} viewClass
     * @param {?} rendererType
     * @return {?}
     */
    compiled(viewClass, rendererType) {
        this._viewClass = viewClass;
        (/** @type {?} */ (this.compMeta.componentViewType)).setDelegate(viewClass);
        for (let prop in rendererType) {
            (/** @type {?} */ (this.compMeta.rendererType))[prop] = rendererType[prop];
        }
        this.isCompiled = true;
    }
}
if (false) {
    /** @type {?} */
    CompiledTemplate.prototype._viewClass;
    /** @type {?} */
    CompiledTemplate.prototype.isCompiled;
    /** @type {?} */
    CompiledTemplate.prototype.isHost;
    /** @type {?} */
    CompiledTemplate.prototype.compType;
    /** @type {?} */
    CompiledTemplate.prototype.compMeta;
    /** @type {?} */
    CompiledTemplate.prototype.ngModule;
    /** @type {?} */
    CompiledTemplate.prototype.directives;
}
/**
 * @param {?} meta
 * @return {?}
 */
function assertComponent(meta) {
    if (!meta.isComponent) {
        throw new Error(`Could not compile '${identifierName(meta.type)}' because it is not a component.`);
    }
}
/**
 * @return {?}
 */
function createOutputContext() {
    /** @type {?} */
    const importExpr = (symbol) => ir.importExpr({ name: identifierName(symbol), moduleName: null, runtime: symbol });
    return { statements: [], genFilePath: '', importExpr, constantPool: new ConstantPool() };
}
//# sourceMappingURL=compiler.js.map